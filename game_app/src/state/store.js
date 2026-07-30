/**
 * State Store: Single Source of Truth mit unidirektionalem Datenfluss.
 */

import { createInitialGenerators } from './generatorsData.js';

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
  generators: createInitialGenerators(),
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
