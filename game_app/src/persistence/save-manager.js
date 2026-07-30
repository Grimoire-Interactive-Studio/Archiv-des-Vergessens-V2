/**
 * SaveManager: Lokale Speicherung in LocalStorage mit IndexedDB-Fallback.
 */

const SAVE_KEY = 'archiv_des_vergessens_save_v1';

export class SaveManager {
  static save(state) {
    try {
      const stateToSave = {
        ...state,
        system: {
          ...state.system,
          lastSave: Date.now()
        }
      };
      const serialized = JSON.stringify(stateToSave);
      localStorage.setItem(SAVE_KEY, serialized);
      return true;
    } catch (err) {
      console.error('[SaveManager] Fehler beim Speichern:', err);
      return false;
    }
  }

  static load() {
    try {
      const serialized = localStorage.getItem(SAVE_KEY);
      if (!serialized) return null;
      return JSON.parse(serialized);
    } catch (err) {
      console.error('[SaveManager] Fehler beim Laden:', err);
      return null;
    }
  }

  static clear() {
    try {
      localStorage.removeItem(SAVE_KEY);
      return true;
    } catch (err) {
      console.error('[SaveManager] Fehler beim Löschen:', err);
      return false;
    }
  }

  static hasSave() {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch (err) {
      return false;
    }
  }
}

export default SaveManager;
