var L = { fr: { ranking: "Les plus connectés", garden: "Mon jardin", about: "À propos" }, en: { ranking: "Most connected", garden: "My garden", about: "About" } };

export default function Tabs(props) {
  var viewMode = props.viewMode, setViewMode = props.setViewMode, gardenCount = props.gardenCount, lang = props.lang;
  var t = L[lang] || L.fr;
  return (
    <div className="tabs">
      <button className={'tab' + (viewMode === 'ranking' ? ' active' : '')} onClick={function () { setViewMode('ranking'); }}>{t.ranking}</button>
      <button className={'tab' + (viewMode === 'garden' ? ' active' : '')} onClick={function () { setViewMode('garden'); }}>
        {t.garden}
        {gardenCount > 0 && (<span className="tab-badge">{gardenCount}</span>)}
      </button>
      <button className={'tab' + (viewMode === 'about' ? ' active' : '')} onClick={function () { setViewMode('about'); }}>{t.about}</button>
    </div>
  );
}
