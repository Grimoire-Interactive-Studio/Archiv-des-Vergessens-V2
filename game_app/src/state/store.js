/**
 * State Store: Single Source of Truth mit unidirektionalem Datenfluss.
 */

export const INITIAL_STATE = {
  player: {
    name: 'Mnemoniker',
    level: 1,
    exp: 0,
    expToNext: 100,
    attributePoints: 0,
    skillPoints: 0,
    attributes: {
      focus: 0,
      knowledge: 0,
      willpower: 0
    },
    unlockedNodes: ['root']
  },
  resources: {
    mneme: 0,
    totalMneme: 0,
    relics: 0
  },
  generators: {
    gedankenArchiv: {
      name: 'Gedanken-Archiv',
      level: 0,
      baseCost: 10,
      baseYield: 1.0,
      costMult: 1.15
    },
    seelenQuell: {
      name: 'Seelen-Quell',
      level: 0,
      baseCost: 100,
      baseYield: 8.0,
      costMult: 1.18
    },
    chronoKristall: {
      name: 'Chrono-Kristall',
      level: 0,
      baseCost: 1200,
      baseYield: 65.0,
      costMult: 1.22
    },
    astralResonator: {
      name: 'Astral-Resonator',
      level: 0,
      baseCost: 15000,
      baseYield: 450.0,
      costMult: 1.25
    },
    aetherBibliothek: {
      name: 'Äther-Bibliothek',
      level: 0,
      baseCost: 200000,
      baseYield: 3200.0,
      costMult: 1.28
    },
    schattenWebstuhl: {
      name: 'Schatten-Webstuhl',
      level: 0,
      baseCost: 3000000,
      baseYield: 28000.0,
      costMult: 1.30
    },
    kosmischesOrakel: {
      name: 'Kosmisches Orakel',
      level: 0,
      baseCost: 50000000,
      baseYield: 260000.0,
      costMult: 1.32
    },
    traumAltar: {
      name: 'Traum-Altar',
      level: 0,
      baseCost: 900000000,
      baseYield: 2500000.0,
      costMult: 1.34
    },
    ewigkeitsSpire: {
      name: 'Ewigkeits-Spire',
      level: 0,
      baseCost: 18000000000,
      baseYield: 28000000.0,
      costMult: 1.36
    },
    vergessensRiss: {
      name: 'Vergessens-Riss',
      level: 0,
      baseCost: 400000000000,
      baseYield: 350000000.0,
      costMult: 1.38
    },
    urzeitKatalysator: {
      name: 'Urzeit-Katalysator',
      level: 0,
      baseCost: 10000000000000,
      baseYield: 5000000000.0,
      costMult: 1.40
    },
    singularitaetsKern: {
      name: 'Singularitäts-Kern',
      level: 0,
      baseCost: 300000000000000,
      baseYield: 85000000000.0,
      costMult: 1.42
    },
    omniscenzMatrix: {
      name: 'Omniszienz-Matrix',
      level: 0,
      baseCost: 10000000000000000,
      baseYield: 1500000000000.0,
      costMult: 1.45
    },
    transzendenzNexus: {
      name: 'Transzendenz-Nexus',
      level: 0,
      baseCost: 400000000000000000,
      baseYield: 30000000000000.0,
      costMult: 1.48
    },
    absolutesChronoskop: {
      name: 'Absolutes Chronoskop',
      level: 0,
      baseCost: 20000000000000000000,
      baseYield: 800000000000000.0,
      costMult: 1.50
    }
  },
  system: {
    lastSave: Date.now(),
    version: '1.0.0'
  },
  settings: {
    volume: 80,
    autosave: true,
    showFloatingText: true,
    showParticles: true
  }
};

const isProduction =
  (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD);

function deepFreeze(obj) {
  if (isProduction) return obj;
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.keys(obj).forEach((key) => {
      deepFreeze(obj[key]);
    });
  }
  return obj;
}

export class Store {
  constructor(initialState = INITIAL_STATE) {
    this._state = deepFreeze(JSON.parse(JSON.stringify(initialState)));
    this._listeners = new Set();
  }

  getState() {
    return this._state;
  }

  dispatch(reducer, actionName = 'anonymous') {
    const prevState = this._state;
    const nextState = reducer(prevState);

    if (nextState !== prevState && nextState) {
      this._state = deepFreeze(nextState);
      this._notify();
    }
    return this._state;
  }

  subscribe(listener) {
    this._listeners.add(listener);
    // Sofortiger Erstaufruf
    listener(this._state);
    return () => this._listeners.delete(listener);
  }

  _notify() {
    for (const listener of this._listeners) {
      try {
        listener(this._state);
      } catch (err) {
        console.error('[Store] Subscriber Fehler:', err);
      }
    }
  }

  hydrate(savedState) {
    if (!savedState || typeof savedState !== 'object') return;
    const merged = {
      ...INITIAL_STATE,
      ...savedState,
      player: {
        ...INITIAL_STATE.player,
        ...(savedState.player || {}),
        attributes: {
          ...INITIAL_STATE.player.attributes,
          ...((savedState.player && savedState.player.attributes) || {})
        },
        unlockedNodes: (savedState.player && Array.isArray(savedState.player.unlockedNodes))
          ? savedState.player.unlockedNodes
          : INITIAL_STATE.player.unlockedNodes
      },
      resources: { ...INITIAL_STATE.resources, ...(savedState.resources || {}) },
      generators: { ...INITIAL_STATE.generators, ...(savedState.generators || {}) },
      system: { ...INITIAL_STATE.system, ...(savedState.system || {}) },
      settings: { ...INITIAL_STATE.settings, ...(savedState.settings || {}) }
    };
    this._state = deepFreeze(merged);
    this._notify();
  }
}

export const store = new Store();
export default store;
