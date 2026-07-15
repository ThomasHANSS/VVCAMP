/**
 * VVCAMP — Interaction type system
 * 
 * 12 interaction types grouped in 6 families.
 * Each type has a color (from its family), a dash pattern, a stroke width,
 * and an SVG path icon for use on graph links.
 */

export var FAMILIES = {
  pollinisation:   { color: '#10b981', fr: 'Pollinisateurs',     en: 'Pollinators' },
  hote:            { color: '#22c55e', fr: 'Hôtes larvaires',    en: 'Larval hosts' },
  folivorie:       { color: '#eab308', fr: 'Folivores',          en: 'Leaf feeders' },
  mineuse:         { color: '#ca8a04', fr: 'Mineuses',           en: 'Leaf miners' },
  gallicole:       { color: '#a16207', fr: 'Gallicoles',         en: 'Gall makers' },
  xylophage:       { color: '#92400e', fr: 'Xylophages',         en: 'Wood borers' },
  rhizophage:      { color: '#78350f', fr: 'Rhizophages',        en: 'Root feeders' },
  frugivore:       { color: '#f43f5e', fr: 'Frugivores',         en: 'Fruit/seed feeders' },
  florivore:       { color: '#e11d48', fr: 'Florivores',         en: 'Flower feeders' },
  suceur:          { color: '#a855f7', fr: 'Suceurs de sève',    en: 'Sap suckers' },
  predateur_fam:   { color: '#0ea5e9', fr: 'Prédateurs',        en: 'Predators' },
  parasitoide_fam: { color: '#06b6d4', fr: 'Parasitoïdes',      en: 'Parasitoids' },
};

export var TYPES = {
  pollination:   { fam: 'pollinisation',  fr: 'Pollinisation',        en: 'Pollination',        dash: 'none',    w: 2.5, icon: 'M0-3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM0-1.5l-2-2M0-1.5l2-2M0-1.5l0-2.5' },
  hote_larvaire: { fam: 'hote',  fr: 'Plante hôte larvaire', en: 'Larval host plant',  dash: '8 3 2 3', w: 2,   icon: 'M-3 0C-3-3 3-3 3 0C3 3-3 3-3 0z' },
  folivorie:     { fam: 'folivorie',   fr: 'Folivorie',            en: 'Leaf feeding',       dash: 'none',    w: 2.2, icon: 'M0-4C-3-2-3 2 0 4C3 2 3-2 0-4zM0-4l0 8' },
  mineuse:       { fam: 'mineuse',   fr: 'Mineuse',              en: 'Leaf mining',        dash: '6 3',     w: 1.8, icon: 'M0-4C-3-2-3 2 0 4C3 2 3-2 0-4zM-2 0l4 0' },
  gallicole:     { fam: 'gallicole',   fr: 'Gallicole',            en: 'Gall making',        dash: '3 3',     w: 1.8, icon: 'M0-3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z' },
  xylophage:     { fam: 'xylophage',fr: 'Xylophage',            en: 'Wood boring',        dash: 'none',    w: 2.2, icon: 'M-3-2h6v4h-6z' },
  rhizophage:    { fam: 'rhizophage',fr: 'Rhizophage',           en: 'Root feeding',       dash: '6 3',     w: 1.8, icon: 'M0-1l-3 4M0-1l3 4M0-1l0 4' },
  frugivore:     { fam: 'frugivore', fr: 'Frugivore/granivore',  en: 'Fruit/seed feeding', dash: 'none',    w: 2.2, icon: 'M0-3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM0-3l1-2' },
  florivore:     { fam: 'florivore', fr: 'Florivore',            en: 'Flower feeding',     dash: '6 3',     w: 1.8, icon: 'M0-3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z' },
  suceur_seve:   { fam: 'suceur',      fr: 'Suceur de sève',       en: 'Sap sucking',        dash: 'none',    w: 2.2, icon: 'M0-4C-2-1-2 1 0 4C2 1 2-1 0-4z' },
  predateur:     { fam: 'predateur_fam',  fr: 'Prédateur',            en: 'Predator',           dash: 'none',    w: 2,   icon: 'M-3 2l3-5 3 5z' },
  parasitoide:   { fam: 'parasitoide_fam',  fr: 'Parasitoïde',          en: 'Parasitoid',         dash: '6 3',     w: 1.8, icon: 'M-3 0h6M0-3v6' },
};

export var FILTER_GROUPS = [
  { key: 'all',             fr: 'Toutes',          en: 'All' },
  { key: 'pollinisation',   fr: 'Pollinisateurs',  en: 'Pollinators' },
  { key: 'hote',            fr: 'Hôtes larvaires', en: 'Larval hosts' },
  { key: 'folivorie',       fr: 'Folivores',       en: 'Leaf feeders' },
  { key: 'mineuse',         fr: 'Mineuses',        en: 'Leaf miners' },
  { key: 'gallicole',       fr: 'Gallicoles',      en: 'Gall makers' },
  { key: 'xylophage',       fr: 'Xylophages',      en: 'Wood borers' },
  { key: 'rhizophage',      fr: 'Rhizophages',     en: 'Root feeders' },
  { key: 'frugivore',       fr: 'Frugivores',      en: 'Fruit/seed feeders' },
  { key: 'florivore',       fr: 'Florivores',      en: 'Flower feeders' },
  { key: 'suceur',          fr: 'Suceurs de sève', en: 'Sap suckers' },
  { key: 'predateur_fam',   fr: 'Prédateurs',      en: 'Predators' },
  { key: 'parasitoide_fam', fr: 'Parasitoïdes',    en: 'Parasitoids' },
];

export var STATUS_COLORS = {
  native: '#10b981',
  archaeophyte: '#ca8a04',
  neophyte: '#f43f5e',
  horticultural: '#8e44ad',
  cultivated: '#2874a6',
};

/**
 * IUCN Red List threat categories
 */
export var THREAT_CATS = {
  EX:  { color: '#000000', fr: 'Éteint',              en: 'Extinct',              icon: '✝' },
  EW:  { color: '#3d1466', fr: 'Éteint à l\'état sauvage', en: 'Extinct in the Wild', icon: '✝' },
  RE:  { color: '#5a189a', fr: 'Rég. éteint',         en: 'Regionally Extinct',   icon: '✝' },
  CR:  { color: '#ef4444', fr: 'En danger critique',   en: 'Critically Endangered',icon: '!!' },
  EN:  { color: '#e06000', fr: 'En danger',            en: 'Endangered',           icon: '!' },
  VU:  { color: '#cc9900', fr: 'Vulnérable',           en: 'Vulnerable',           icon: '▲' },
  NT:  { color: '#84cc16', fr: 'Quasi menacé',         en: 'Near Threatened',      icon: '~' },
  LC:  { color: '#10b981', fr: 'Préoccupation mineure',en: 'Least Concern',        icon: '✓' },
  DD:  { color: '#888888', fr: 'Données insuffisantes',en: 'Data Deficient',       icon: '?' },
};

export var THREATENED_CATS = ['CR', 'EN', 'VU'];

export var THREAT_FILTER_OPTIONS = [
  { key: 'threatened', fr: 'Menacées (CR/EN/VU)', en: 'Threatened (CR/EN/VU)', color: '#ef4444' },
  { key: 'NT',         fr: 'Quasi menacées',      en: 'Near Threatened',       color: '#6b8e23' },
  { key: 'LC',         fr: 'Non menacées',         en: 'Least Concern',         color: '#10b981' },
];
