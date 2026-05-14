#!/usr/bin/env python3
"""
data/scripts/enrich_phenology.py

Recupere depuis GBIF un histogramme mensuel des observations pour
chaque plante et insecte du corpus. Sert a deduire la periode de
floraison (plantes) ou de vol (insectes).

Pour chaque espece :
1. /species/match -> taxonKey GBIF
2. /occurrence/search?taxonKey=X&facet=month -> distribution mensuelle

Sortie : data/gbif_phenology_cache.json
  Format par species id :
    {} -> verifie, pas de match GBIF
    {"k": 123, "n": 5} -> match mais trop peu d'observations
    {"k": 123, "n": 1248, "p": [0, ..., 0]} -> phenologie complete (12 valeurs)

Le tableau p est normalise sur le mois pic (max=1.0).
"""

import json
import time
import sys
from pathlib import Path
from urllib.parse import urlencode
import urllib.request
import urllib.error

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public" / "data"
PLANTS_FILE = PUBLIC / "plants.json"
INSECTS_FILE = PUBLIC / "insects.json"
CACHE_FILE = ROOT / "data" / "gbif_phenology_cache.json"
LOG_FILE = ROOT / "data" / "phenology_batch.log"

GBIF_API = "https://api.gbif.org/v1"
SLEEP_BETWEEN_CALLS = 0.05   # ~10 req/s combine, dans la tolerance GBIF
TIMEOUT = 30
MIN_OBS_FOR_PHENOLOGY = 30   # en dessous, pas de phenologie fiable

USER_AGENT = (
    "Phytomia/1.0 "
    "(https://github.com/ThomasHANSS/phytomia; thomas.hanss@vivantes.fr) "
    "python-urllib"
)


def log(msg):
    line = f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}"
    print(line, flush=True)
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def http_get_json(url):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT, "Accept": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        return json.loads(resp.read())


def gbif_match_taxon_key(name):
    """Retourne le taxonKey GBIF ou None."""
    url = f"{GBIF_API}/species/match?" + urlencode({"name": name, "strict": "false"})
    data = http_get_json(url)
    # On accepte les matches EXACT et FUZZY (pas HIGHERRANK ni NONE)
    if data.get("matchType") in ("EXACT", "FUZZY"):
        return data.get("usageKey")
    return None


def gbif_monthly_distribution(taxon_key):
    """Retourne (total_obs, [counts par mois 1-12])."""
    url = f"{GBIF_API}/occurrence/search?" + urlencode({
        "taxonKey": taxon_key,
        "facet": "month",
        "facetLimit": 12,
        "limit": 0,
    })
    data = http_get_json(url)
    total = data.get("count", 0)
    counts = [0] * 12
    for f in data.get("facets", []):
        if f.get("field") == "MONTH":
            for c in f.get("counts", []):
                try:
                    m = int(c["name"])
                    if 1 <= m <= 12:
                        counts[m - 1] = c["count"]
                except (KeyError, ValueError):
                    pass
    return (total, counts)


def normalize_phenology(counts):
    """Convertit en scores 0-1 normalises sur le pic. Renvoie None si tout est 0."""
    if not counts:
        return None
    m = max(counts)
    if m == 0:
        return None
    return [round(c / m, 2) for c in counts]


def save_cache(cache):
    tmp = CACHE_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(cache, ensure_ascii=False))
    tmp.replace(CACHE_FILE)


def main():
    for f in [PLANTS_FILE, INSECTS_FILE]:
        if not f.exists():
            log(f"ERROR : {f} introuvable")
            sys.exit(1)

    plants = json.loads(PLANTS_FILE.read_text())
    insects = json.loads(INSECTS_FILE.read_text())
    log(f"Charge {len(plants)} plantes + {len(insects)} insectes")

    cache = {}
    if CACHE_FILE.exists():
        cache = json.loads(CACHE_FILE.read_text())
        done = sum(1 for v in cache.values() if v.get("k"))
        log(f"Cache existant : {len(cache)} entrees ({done} avec taxonKey GBIF)")

    species = (
        [(p["id"], p["sci"]) for p in plants] +
        [(i["id"], i["sci"]) for i in insects]
    )
    todo = [(sid, sci) for sid, sci in species if sid not in cache]
    log(f"A traiter : {len(todo)} especes")

    if not todo:
        log("Cache complet, rien a faire")
        return

    started = time.time()
    n_match = 0
    n_pheno = 0
    consecutive_errors = 0

    for idx, (sid, sci) in enumerate(todo):
        try:
            key = gbif_match_taxon_key(sci)
            time.sleep(SLEEP_BETWEEN_CALLS)

            if not key:
                cache[sid] = {}
                consecutive_errors = 0
            else:
                n_match += 1
                total, counts = gbif_monthly_distribution(key)
                time.sleep(SLEEP_BETWEEN_CALLS)

                if total >= MIN_OBS_FOR_PHENOLOGY:
                    p = normalize_phenology(counts)
                    if p:
                        cache[sid] = {"k": key, "n": total, "p": p}
                        n_pheno += 1
                    else:
                        cache[sid] = {"k": key, "n": total}
                else:
                    cache[sid] = {"k": key, "n": total}
                consecutive_errors = 0

        except urllib.error.HTTPError as e:
            consecutive_errors += 1
            log(f"  [{idx}] HTTP {e.code} sur '{sci}' ({sid})")
            if e.code == 429:
                wait = int(e.headers.get("Retry-After") or 30)
                log(f"    rate-limit, attente {wait}s")
                time.sleep(wait)
            elif consecutive_errors > 10:
                log(f"  trop d'erreurs consecutives, abandon")
                break
            else:
                time.sleep(2)
        except Exception as e:
            consecutive_errors += 1
            log(f"  [{idx}] {type(e).__name__} sur '{sci}' ({sid}) : {e}")
            if consecutive_errors > 10:
                break
            time.sleep(2)

        if (idx + 1) % 200 == 0:
            save_cache(cache)
            elapsed = time.time() - started
            rate = (idx + 1) / max(elapsed, 1)
            eta_min = (len(todo) - idx - 1) / max(rate, 0.0001) / 60
            log(
                f"  [{idx+1:>6}/{len(todo)}] "
                f"match={n_match} pheno={n_pheno} "
                f"rate={rate:.1f}/s ETA={eta_min:.0f}min"
            )

    save_cache(cache)

    # Stats finales
    matched = sum(1 for v in cache.values() if v.get("k"))
    with_pheno = sum(1 for v in cache.values() if v.get("p"))
    elapsed = time.time() - started
    log(f"\nTermine en {elapsed/60:.1f} min")
    log(f"Match GBIF      : {matched}/{len(cache)} ({matched*100//max(len(cache),1)}%)")
    log(f"Avec phenologie : {with_pheno}/{len(cache)} ({with_pheno*100//max(len(cache),1)}%)")


if __name__ == "__main__":
    main()
