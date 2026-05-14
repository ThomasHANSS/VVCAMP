#!/usr/bin/env python3
"""
data/scripts/merge_wikidata_into_plants.py

Lit data/wikidata_plants_cache.json et enrichit public/data/plants.json
avec : family, name_fr, wp_fr, height_m, tags[]

Idempotent : peut etre relance autant de fois que le cache grossit.

Usage:
  python3 data/scripts/merge_wikidata_into_plants.py
"""

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PLANTS_FILE = ROOT / "public" / "data" / "plants.json"
CACHE_FILE = ROOT / "data" / "wikidata_plants_cache.json"
BACKUP_FILE = ROOT / "public" / "data" / "plants.before_wikidata.json"

# Mapping labels Wikidata (FR/EN, lowercase) -> tag Phytomia
# Etend la liste si le cache fait apparaitre de nouveaux labels frequents.
TAG_MAP = {
    "medicinal": {"plante medicinale", "plante médicinale", "medicinal plant"},
    "edible": {
        "nourriture", "food",
        "legume", "légume", "vegetable",
        "fruit comestible", "edible fruit",
        "plante comestible", "edible plant",
    },
    "fruit": {"fruit"},
    "spice": {"epice", "épice", "spice"},
    "fodder": {"fourrage", "fodder", "forage"},
    "wood": {"bois", "wood"},
    "fiber": {"fibre", "fiber"},
    "construction": {"materiau de construction", "matériau de construction", "building material"},
    "dye": {"teinture", "dye", "plante tinctoriale", "dye plant"},
    "nectar": {"flore melifere", "flore mellifère", "nectar source", "plante mellifere", "plante mellifère", "honey plant"},
    "brewing": {"brassage", "brewing", "brewing material"},
    "firewood": {"bois de feu", "firewood"},
    "afforestation": {"afforestation", "boisement", "sylviculture", "forestry"},
    "insecticide": {"insecticide"},
    "aromatic": {"plante aromatique", "aromatic plant", "aromatic", "huile essentielle", "essential oil"},
    "ornamental": {"plante ornementale", "ornamental plant", "amenagement paysager", "aménagement paysager", "landscaping"},
    "toxic": {"plante toxique", "poisonous plant", "toxic plant"},
    "cosmetic": {"cosmetique", "cosmétique", "cosmetics"},
    "perfume": {"parfum", "perfume", "fragrance"},
    "oil": {"huile vegetale", "huile végétale", "vegetable oil", "oilseed", "oleagineux", "oléagineux"},
}


def normalize(s):
    if not s:
        return ""
    return s.strip().lower()


def derive_tags(uses_fr, uses_en):
    """Retourne la liste de tags Phytomia derives des usages Wikidata."""
    all_uses = {normalize(u) for u in (uses_fr or []) + (uses_en or []) if u}
    tags = []
    for tag, keywords in TAG_MAP.items():
        if all_uses & keywords:
            tags.append(tag)
    return tags


def main():
    if not PLANTS_FILE.exists():
        print(f"ERROR : {PLANTS_FILE} introuvable")
        return
    if not CACHE_FILE.exists():
        print(f"ERROR : {CACHE_FILE} introuvable")
        return

    plants = json.loads(PLANTS_FILE.read_text())
    cache = json.loads(CACHE_FILE.read_text())
    print(f"Plantes : {len(plants)}")
    print(f"Cache Wikidata : {len(cache)} ({sum(1 for v in cache.values() if v.get('qid'))} avec QID)")

    # Backup la 1ere fois
    if not BACKUP_FILE.exists():
        shutil.copy(PLANTS_FILE, BACKUP_FILE)
        print(f"Backup -> {BACKUP_FILE.name}")

    stats = {
        "with_qid": 0,
        "with_tags": 0,
        "with_name_fr": 0,
        "with_family": 0,
        "with_wp_fr": 0,
        "with_height": 0,
    }
    tag_counter = {}

    for p in plants:
        sci = p["sci"]
        entry = cache.get(sci) or {}
        qid = entry.get("qid")

        if qid:
            stats["with_qid"] += 1
            p["wd"] = qid

        # Famille (priorite Wikidata, sinon on garde l'existant)
        if entry.get("family"):
            p["family"] = entry["family"]
            stats["with_family"] += 1

        # Nom commun FR
        if entry.get("name_fr"):
            p["name_fr"] = entry["name_fr"]
            stats["with_name_fr"] += 1

        # Wikipedia FR
        if entry.get("wp_fr"):
            p["wp_fr"] = entry["wp_fr"]
            stats["with_wp_fr"] += 1

        # Hauteur (couverture faible mais utile quand presente)
        if entry.get("height_m"):
            p["height_m"] = entry["height_m"]
            stats["with_height"] += 1

        # Tags derives des usages
        tags = derive_tags(entry.get("uses_fr"), entry.get("uses_en"))
        if tags:
            p["tags"] = tags
            stats["with_tags"] += 1
            for t in tags:
                tag_counter[t] = tag_counter.get(t, 0) + 1
        elif "tags" in p:
            # nettoie un eventuel tags vide d'un merge precedent
            del p["tags"]

    PLANTS_FILE.write_text(json.dumps(plants, ensure_ascii=False))
    print(f"\nplants.json reecrit ({PLANTS_FILE.stat().st_size // 1024} Ko)")
    print(f"\nStats sur {len(plants)} plantes :")
    for k, v in stats.items():
        pct = v * 100 // len(plants)
        print(f"  {k:20s} {v:>6} ({pct}%)")

    print("\nDistribution des tags :")
    for t, n in sorted(tag_counter.items(), key=lambda x: -x[1]):
        print(f"  {t:15s} {n:>6}")


if __name__ == "__main__":
    main()
