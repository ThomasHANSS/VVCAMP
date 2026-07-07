var L = {
  fr: {
    title: 'À propos de VVCAMP',
    desc: "VVCAMP est une application web open-source qui permet d'explorer les interactions documentées entre plantes et insectes en Europe. Elle agrège, harmonise et met en relation les données issues de bases scientifiques en accès libre.",
    stats: [
      { label: 'Interactions documentées', value: '270 496' },
      { label: 'Espèces végétales', value: '17 168' },
      { label: "Espèces d'insectes", value: '27 494' },
      { label: 'Bases de données intégrées', value: '6' },
      { label: 'Pays couverts', value: '23+' },
    ],
    sourcesTitle: 'Sources de données',
    sources: [
      { name: 'EuPPollNet', desc: 'Réseaux plantes-pollinisateurs européens', license: 'CC-BY' },
      { name: 'EuropeanHostData', desc: 'Insectes herbivores des arbres européens', license: 'CC0' },
      { name: 'GloBI', desc: 'Interactions biotiques mondiales', license: 'CC0' },
      { name: 'DBIF', desc: 'Insectes et plantes hôtes (Grande-Bretagne)', license: 'OGL' },
      { name: 'HOSTS NHM', desc: 'Plantes hôtes des lépidoptères du monde', license: 'Open' },
      { name: 'DoPI', desc: 'Interactions pollinisateurs (Grande-Bretagne)', license: 'CC-BY' },
    ],
    licenseTitle: 'Licence',
    licenseText: 'Les données sont mises à disposition sous licence',
    creditsTitle: 'Crédits & contact',
    credits: 'Villes Vivantes',
    contact: 'thomas.hanss@vivantes.fr',
    repo: 'Code source sur GitHub',
  },
  en: {
    title: 'About VVCAMP',
    desc: "VVCAMP is an open-source web app for exploring documented interactions between plants and insects in Europe. It aggregates, harmonizes and links data from open-access scientific databases.",
    stats: [
      { label: 'Documented interactions', value: '270,496' },
      { label: 'Plant species', value: '17,168' },
      { label: 'Insect species', value: '27,494' },
      { label: 'Integrated databases', value: '6' },
      { label: 'Countries covered', value: '23+' },
    ],
    sourcesTitle: 'Data sources',
    sources: [
      { name: 'EuPPollNet', desc: 'European plant-pollinator networks', license: 'CC-BY' },
      { name: 'EuropeanHostData', desc: 'Herbivorous insects of European trees', license: 'CC0' },
      { name: 'GloBI', desc: 'Global biotic interactions', license: 'CC0' },
      { name: 'DBIF', desc: 'Insects and their food plants (Great Britain)', license: 'OGL' },
      { name: 'HOSTS NHM', desc: "World Lepidoptera host plants", license: 'Open' },
      { name: 'DoPI', desc: 'Pollinator interactions (Great Britain)', license: 'CC-BY' },
    ],
    licenseTitle: 'License',
    licenseText: 'Data is made available under',
    creditsTitle: 'Credits & contact',
    credits: 'Villes Vivantes',
    contact: 'thomas.hanss@vivantes.fr',
    repo: 'Source code on GitHub',
  }
};

export default function About(props) {
  var lang = props.lang;
  var t = L[lang] || L.fr;
  return (
    <div className="about">
      <h2 className="about-title">{t.title}</h2>
      <p className="about-desc">{t.desc}</p>

      <div className="about-stats">
        {t.stats.map(function(s, i) {
          return (
            <div className="about-stat" key={i}>
              <div className="about-stat-value">{s.value}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      <h3 className="about-section-title">{t.sourcesTitle}</h3>
      <div className="about-sources">
        {t.sources.map(function(src, i) {
          return (
            <div className="about-source" key={i}>
              <span className="about-source-name">{src.name}</span>
              <span className="about-source-desc">{src.desc}</span>
              <span className="about-source-license">{src.license}</span>
            </div>
          );
        })}
      </div>

      <h3 className="about-section-title">{t.licenseTitle}</h3>
      <p className="about-license">
        {t.licenseText}{' '}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>
      </p>

      <h3 className="about-section-title">{t.creditsTitle}</h3>
      <p className="about-credits">
        {t.credits} — <a href={'mailto:' + t.contact}>{t.contact}</a>
        <br />
        <a href="https://github.com/ThomasHANSS/VVCAMP" target="_blank" rel="noopener noreferrer">{t.repo}</a>
      </p>
    </div>
  );
}
