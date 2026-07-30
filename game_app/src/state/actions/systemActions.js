import { INITIAL_STATE } from '../store.js';

/**
 * Aktualisiert eine Einstellung.
 * @param {string} key - Einstellungs-Schlüssel
 * @param {any} value - Neuer Wert
 */
export function updateSetting(key, value) {
  return (state) => ({
    ...state,
    settings: {
      ...(state.settings || INITIAL_STATE.settings),
      [key]: value
    }
  });
}

/**
 * Aktualisiert den letzten Speicherzeitpunkt.
 * @param {number} timestamp - Unix-Timestamp
 */
export function updateLastSave(timestamp = Date.now()) {
  return (state) => ({
    ...state,
    system: {
      ...state.system,
      lastSave: timestamp
    }
  });
}

/**
 * Setzt das Spiel komplett zurück.
 */
export function resetGame() {
  return () => JSON.parse(JSON.stringify({
    ...INITIAL_STATE,
    system: {
      ...INITIAL_STATE.system,
      lastSave: Date.now()
    }
  }));
}

/**
 * Importiert einen Spielstand.
 * @param {Object} importedState - Der zu importierende State
 */
export function importSave(importedState) {
  return () => ({
    ...importedState,
    system: {
      ...importedState.system,
      lastSave: Date.now()
    }
  });
}

/**
 * Exportiert den aktuellen Spielstand (als JSON-String).
 * @returns {string} JSON-String des aktuellen States
 */
export function exportSave(state) {
  return JSON.stringify(state);
}
