import { render } from 'preact';
import App from './ui/App';
import store from './state/store';
import { processTick, addMneme } from './state/actions';
import GameLoop from './engine/loop';
import SaveManager from './persistence/save-manager';
import { calculateOfflineProgress } from './engine/math';
import './style.css';

// 1. Speichersituation prüfen und laden
const savedState = SaveManager.load();
let offlineMessage = '';

if (savedState) {
  store.hydrate(savedState);
  const state = store.getState();
  const lastSave = state.system?.lastSave || 0;

  // Ertrag pro Sekunde für Offline-Progression ermitteln
  let totalYieldPerSecond = 0;
  for (const key in state.generators) {
    const gen = state.generators[key];
    if (gen.level > 0) {
      const milestones = Math.pow(2, Math.floor(gen.level / 25));
      totalYieldPerSecond += gen.baseYield * gen.level * milestones;
    }
  }

  if (lastSave > 0 && totalYieldPerSecond > 0) {
    const offline = calculateOfflineProgress(lastSave, Date.now(), totalYieldPerSecond);
    if (offline.totalYield > 0) {
      store.dispatch(addMneme(offline.totalYield), 'offlineProgress');
      offlineMessage = `Willkommen zurück! Während deiner Abwesenheit (${Math.floor(offline.clampedSeconds / 60)} Min.) hast du +${offline.totalYield.toLocaleString()} Mneme gesammelt!`;
    }
  }
}

// 2. Game Loop starten (Logic Tick alle 100ms)
const gameLoop = new GameLoop({
  logicIntervalMs: 100,
  onTick: (deltaMs) => {
    const dtSeconds = deltaMs / 1000;
    store.dispatch(processTick(dtSeconds), 'gameTick');
  }
});

gameLoop.start();

// 3. Automatisches Intervall-Speichern (alle 10 Sekunden)
setInterval(() => {
  SaveManager.save(store.getState());
}, 10000);

// Safe Save beim Schließen
window.addEventListener('beforeunload', () => {
  SaveManager.save(store.getState());
});

// 4. Preact UI Rendern
const rootElement = document.getElementById('app');
if (rootElement) {
  render(<App offlineMessage={offlineMessage} />, rootElement);
}
