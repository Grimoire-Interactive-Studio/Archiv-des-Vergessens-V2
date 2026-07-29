import { useState, useEffect } from 'preact/hooks';
import store from '../state/store';
import { addMneme, buyGenerator, resetGame, updateSetting } from '../state/actions';
import { calculateBulkCost, calculateMaxAffordable, calculateGeneratorYield, formatNumber } from '../engine/math';
import SaveManager from '../persistence/save-manager';
import PauseMenu from './PauseMenu';
import FloatingTextOverlay from './FloatingTextOverlay';
import AmbientParticles from './AmbientParticles';

const GENERATOR_ICONS = {
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

export function App({ offlineMessage }) {
  const [state, setState] = useState(store.getState());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(offlineMessage);
  const [isFading, setIsFading] = useState(false);
  const [buyMultiplier, setBuyMultiplier] = useState(1); // 1, 10, 100, 'max'
  const [floats, setFloats] = useState([]);
  const [purchasedKey, setPurchasedKey] = useState(null);

  const settings = state.settings || { showFloatingText: true, showParticles: true, volume: 80, autosave: true };

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  // Offline-Willkommensnachricht nach 5s sanft ausblenden
  useEffect(() => {
    if (offlineMessage) {
      setToastMsg(offlineMessage);
      setIsFading(false);

      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 4500);

      const removeTimer = setTimeout(() => {
        setToastMsg('');
      }, 5000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [offlineMessage]);

  // Keyboard Event Listener für ESC-Taste
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMenuOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const spawnFloat = (x, y, text, color = '#e2b042') => {
    if (!settings.showFloatingText) return;
    const newFloat = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() * 20 - 10),
      y: y + (Math.random() * 10 - 20),
      text,
      color,
      createdAt: Date.now()
    };
    setFloats((prev) => [...prev, newFloat]);
  };

  const handleRemoveFloats = (expiredIds) => {
    setFloats((prev) => prev.filter((f) => !expiredIds.includes(f.id)));
  };

  const handleGatherClick = (e) => {
    store.dispatch(addMneme(1), 'gatherMneme');
    spawnFloat(e.clientX, e.clientY, '+1 Mneme', '#e2b042');
  };

  const handleBuyGenerator = (key, count, cost, e) => {
    store.dispatch(buyGenerator(key, count), `buyGenerator/${key}`);
    
    if (e && e.clientX) {
      spawnFloat(e.clientX, e.clientY, `+${count === 'max' ? 'Max' : count} Stufe`, '#4cc9f0');
    }

    setPurchasedKey(key);
    setTimeout(() => setPurchasedKey(null), 400);
  };

  const handleUpdateSettings = (key, value) => {
    store.dispatch(updateSetting(key, value), `updateSetting/${key}`);
  };

  const handleReset = () => {
    if (window.confirm('Möchtest du deinen Spielfortschritt wirklich zurücksetzen?')) {
      SaveManager.clear();
      store.dispatch(resetGame(), 'resetGame');
    }
  };

  // Gesamtertrag pro Sekunde berechnen
  let totalYieldPerSecond = 0;
  for (const key in state.generators) {
    const gen = state.generators[key];
    totalYieldPerSecond += calculateGeneratorYield(gen.baseYield, gen.level);
  }

  return (
    <div className="game-container">
      {settings.showParticles && <AmbientParticles active={true} />}

      <FloatingTextOverlay floats={floats} onRemove={handleRemoveFloats} />

      <header className="game-header">
        <div className="header-top-bar">
          <button className="btn-menu-trigger" onClick={() => setIsMenuOpen(true)}>
            ☰ Menü [ESC]
          </button>
        </div>
        <h1 className="game-title">Archiv des Vergessens</h1>
        <p className="game-subtitle">Die Macht der Mneme</p>
      </header>

      {toastMsg && (
        <div className={`toast-notice ${isFading ? 'fade-out' : ''}`}>
          ✨ {toastMsg}
        </div>
      )}

      <section className="resource-banner">
        <div className="resource-item">
          <span className="resource-label">Gesammelte Mneme</span>
          <span className="resource-value">{formatNumber(state.resources.mneme)}</span>
          <span className="resource-rate">+{formatNumber(totalYieldPerSecond)} / Sekunde</span>
        </div>
      </section>

      <section className="click-section">
        <button className="btn-gather" onClick={handleGatherClick}>
          ✦ Mneme-Partikel Sammeln (+1)
        </button>
      </section>

      {/* Bulk Buy Selector Header */}
      <section className="bulk-buy-bar">
        <span className="bulk-buy-label">Kaufmenge:</span>
        <div className="bulk-buy-toggle">
          {[1, 10, 100, 'max'].map((mult) => (
            <button
              key={mult}
              className={`btn-bulk-option ${buyMultiplier === mult ? 'active' : ''}`}
              onClick={() => setBuyMultiplier(mult)}
            >
              {mult === 'max' ? 'MAX' : `x${mult}`}
            </button>
          ))}
        </div>
      </section>

      <section className="generators-grid">
        {Object.entries(state.generators)
          .filter((_, index, array) => {
            if (index === 0) return true;
            const prevGen = array[index - 1][1];
            return prevGen.level >= 10;
          })
          .map(([key, gen]) => {
            let cost = 0;
            let targetCount = buyMultiplier;

            if (buyMultiplier === 'max') {
              const maxInfo = calculateMaxAffordable(gen.baseCost, gen.level, gen.costMult, state.resources.mneme);
              targetCount = maxInfo.count > 0 ? maxInfo.count : 1;
              cost = maxInfo.cost > 0 ? maxInfo.cost : calculateBulkCost(gen.baseCost, gen.level, gen.costMult, 1);
            } else {
              cost = calculateBulkCost(gen.baseCost, gen.level, gen.costMult, buyMultiplier);
            }

            const currentYield = calculateGeneratorYield(gen.baseYield, gen.level);
            const canAfford = state.resources.mneme >= cost && cost > 0;
            const icon = GENERATOR_ICONS[key] || '🔮';

            // Fortschritt bis zur leistbaren Stufe (0-100%)
            const affordabilityPercent = canAfford ? 100 : Math.min(100, (state.resources.mneme / (cost || 1)) * 100);

            // Meilenstein-Fortschritt (alle 25 Level Verdopplung)
            const milestoneProgress = ((gen.level % 25) / 25) * 100;
            const nextMilestoneLvl = (Math.floor(gen.level / 25) + 1) * 25;

            return (
              <div
                key={key}
                className={`generator-card ${purchasedKey === key ? 'purchased-flash' : ''}`}
              >
                <div className="generator-header">
                  <div className="generator-title-group">
                    <span className="generator-icon">{icon}</span>
                    <h3 className="generator-name">{gen.name}</h3>
                  </div>
                  <span className="generator-level">Stufe {gen.level}</span>
                </div>

                <div className="generator-stats">
                  <p>Ertrag: +{formatNumber(currentYield)} Mneme/s</p>
                  <p className="milestone-text">⚡ Next 2x Bonus bei Stufe {nextMilestoneLvl}</p>
                </div>

                {/* Meilenstein-Fortschrittsbalken */}
                <div className="progress-bar-container milestone-bar-container" title={`Meilenstein-Fortschritt (${Math.floor(milestoneProgress)}%)`}>
                  <div className="progress-bar milestone-bar" style={{ width: `${milestoneProgress}%` }}></div>
                </div>

                {/* Kaufbereitschafts-Fortschrittsbalken */}
                <div className="progress-bar-container affordability-bar-container" title={`Bereitschaft (${Math.floor(affordabilityPercent)}%)`}>
                  <div
                    className={`progress-bar affordability-bar ${canAfford ? 'ready' : ''}`}
                    style={{ width: `${affordabilityPercent}%` }}
                  ></div>
                </div>

                <button
                  className="btn-buy"
                  disabled={!canAfford}
                  onClick={(e) => handleBuyGenerator(key, targetCount, cost, e)}
                >
                  Kaufen ({buyMultiplier === 'max' ? `+${targetCount}` : `+${buyMultiplier}`}) für {formatNumber(cost)} Mneme
                </button>
              </div>
            );
          })}
      </section>

      <footer className="game-footer">
        <span>Automatische Speicherung aktiv</span>
      </footer>

      {/* Pausenmenü Modal */}
      <PauseMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleReset}
      />
    </div>
  );
}

export default App;
