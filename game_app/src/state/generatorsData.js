/**
 * Generator Metadaten & Visuals
 * Zentrale Definition aller Generator-Eigenschaften für DRY-Prinzip
 */

export const GENERATOR_ICONS = {
  gedankenArchiv: '📜',
  seelenQuell: '💧',
  chronoKristall: '🔮',
  astralResonator: '🌌',
  aetherBibliothek: '📚',
  schattenWebstuhl: '🕸️',
  kosmischesOrakel: '👁️',
  traumAltar: '⛩️',
  ewigkeitsSpire: '🏰',
  vergessensRiss: '🕳️',
  urzeitKatalysator: '🧪',
  singularitaetsKern: '⚛️',
  omniscenzMatrix: '🌐',
  transzendenzNexus: '✨',
  absolutesChronoskop: '⏳'
};

/**
 * Generator-Konfiguration mit allen notwendigen Metadaten
 * BaseCost, BaseYield, CostMultiplier und Name pro Generator
 */
export const GENERATORS_CONFIG = {
  gedankenArchiv: {
    name: 'Gedanken-Archiv',
    baseCost: 10,
    baseYield: 1.0,
    costMult: 1.15
  },
  seelenQuell: {
    name: 'Seelen-Quell',
    baseCost: 100,
    baseYield: 8.0,
    costMult: 1.18
  },
  chronoKristall: {
    name: 'Chrono-Kristall',
    baseCost: 1200,
    baseYield: 65.0,
    costMult: 1.22
  },
  astralResonator: {
    name: 'Astral-Resonator',
    baseCost: 15000,
    baseYield: 450.0,
    costMult: 1.25
  },
  aetherBibliothek: {
    name: 'Äther-Bibliothek',
    baseCost: 200000,
    baseYield: 3200.0,
    costMult: 1.28
  },
  schattenWebstuhl: {
    name: 'Schatten-Webstuhl',
    baseCost: 3000000,
    baseYield: 28000.0,
    costMult: 1.30
  },
  kosmischesOrakel: {
    name: 'Kosmisches Orakel',
    baseCost: 50000000,
    baseYield: 260000.0,
    costMult: 1.32
  },
  traumAltar: {
    name: 'Traum-Altar',
    baseCost: 900000000,
    baseYield: 2500000.0,
    costMult: 1.34
  },
  ewigkeitsSpire: {
    name: 'Ewigkeits-Spire',
    baseCost: 18000000000,
    baseYield: 28000000.0,
    costMult: 1.36
  },
  vergessensRiss: {
    name: 'Vergessens-Riss',
    baseCost: 400000000000,
    baseYield: 350000000.0,
    costMult: 1.38
  },
  urzeitKatalysator: {
    name: 'Urzeit-Katalysator',
    baseCost: 10000000000000,
    baseYield: 5000000000.0,
    costMult: 1.40
  },
  singularitaetsKern: {
    name: 'Singularitäts-Kern',
    baseCost: 300000000000000,
    baseYield: 85000000000.0,
    costMult: 1.42
  },
  omniscenzMatrix: {
    name: 'Omniszienz-Matrix',
    baseCost: 10000000000000000,
    baseYield: 1500000000000.0,
    costMult: 1.45
  },
  transzendenzNexus: {
    name: 'Transzendenz-Nexus',
    baseCost: 400000000000000000,
    baseYield: 30000000000000.0,
    costMult: 1.48
  },
  absolutesChronoskop: {
    name: 'Absolutes Chronoskop',
    baseCost: 20000000000000000000,
    baseYield: 800000000000000.0,
    costMult: 1.50
  }
};

/**
 * Erstellt einen initialen Generator-State aus der Konfiguration
 * @param {string} key - Generator-Key
 * @returns {Object} Initialer Generator-State mit level: 0
 */
export function createInitialGeneratorState(key) {
  const config = GENERATORS_CONFIG[key];
  if (!config) {
    throw new Error(`Unknown generator key: ${key}`);
  }
  return {
    ...config,
    level: 0
  };
}

/**
 * Erstellt den kompletten initialen Generators-State
 * @returns {Object} Object mit allen Generatoren im Initialzustand
 */
export function createInitialGenerators() {
  const generators = {};
  for (const key of Object.keys(GENERATORS_CONFIG)) {
    generators[key] = createInitialGeneratorState(key);
  }
  return generators;
}

export function getGeneratorIcon(key) {
  return GENERATOR_ICONS[key] || '🔮';
}

export default {
  GENERATOR_ICONS,
  GENERATORS_CONFIG,
  createInitialGeneratorState,
  createInitialGenerators,
  getGeneratorIcon
};
