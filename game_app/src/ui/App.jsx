import { useState, useEffect } from 'preact/hooks';
import store from '../state/store';
import { addMneme, buyGenerator, resetGame, updateSetting } from '../state/actions';
import {
  calculateAggregatePlayerStats,
  calculateTotalGeneratorYield,
  formatNumber
} from '../engine/math';
import SaveManager from '../persistence/save-manager';
import PauseMenu from './PauseMenu';
import MainMenu from './MainMenu';
import FloatingTextOverlay, { spawnFloatingText } from './FloatingTextOverlay';
import AmbientParticles from './AmbientParticles';
import CharacterView from './CharacterView';
import SkillTreeView from './SkillTreeView';
import OfflineModal from './OfflineModal';
import GeneratorsView from './GeneratorsView';
import ResourceBanner from '../components/ResourceBanner';
import HubSidebar from '../components/HubSidebar';
import InventoryView from '../components/InventoryView';
import StoryView from '../components/StoryView';

export function App({ offlineData }) {
  const [state, setState] = useState(store.getState());
  const [screenState, setScreenState] = useState('main_menu'); // 'main_menu' | 'game'
  const [hasSave, setHasSave] = useState(SaveManager.hasSave());
  const [saveData, setSaveData] = useState(SaveManager.load());

  const [activeTab, setActiveTab] = useState('generators'); // 'generators' | 'character' | 'skilltree'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(!!offlineData);
  const [buyMultiplier, setBuyMultiplier] = useState(1); // 1, 10, 100, 'max'
  const [purchasedKey, setPurchasedKey] = useState(null);

  const settings = state.settings || { showFloatingText: true, showParticles: true, volume: 80, autosave: true };
  const player = state.player || { level: 1, exp: 0, expToNext: 100, attributePoints: 0, skillPoints: 0 };
  const stats = calculateAggregatePlayerStats(player);

  const [autoSaveToast, setAutoSaveToast] = useState(true);
  const [isAutoSaveFading, setIsAutoSaveFading] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  // Sync save info whenever returning to main menu
  const refreshSaveInfo = () => {
    const exists = SaveManager.hasSave();
    setHasSave(exists);
    setSaveData(exists ? SaveManager.load() : null);
  };

  // 2s Toast für Automatische Speicherung bei Spielstart
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsAutoSaveFading(true);
    }, 1500);

    const removeTimer = setTimeout(() => {
      setAutoSaveToast(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Keyboard Event Listener für ESC-Taste im Spiel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && screenState === 'game') {
        e.preventDefault();
        setIsMenuOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenState]);

  const handleStartNewGame = () => {
    SaveManager.clear();
    store.dispatch(resetGame(), 'startNewGame');
    SaveManager.save(store.getState());
    refreshSaveInfo();
    setShowOfflineModal(false);
    setScreenState('game');
  };

  const handleContinueGame = () => {
    if (offlineData && (offlineData.totalYield > 0 || offlineData.clampedSeconds > 0)) {
      setShowOfflineModal(true);
    }
    setScreenState('game');
  };

  const handleDeleteSave = () => {
    SaveManager.clear();
    store.dispatch(resetGame(), 'deleteSave');
    refreshSaveInfo();
    setShowOfflineModal(false);
    setScreenState('main_menu');
  };

  const handleReturnToMainMenu = () => {
    SaveManager.save(store.getState());
    refreshSaveInfo();
    setIsMenuOpen(false);
    setScreenState('main_menu');
  };

  const handleGatherClick = (e) => {
    store.dispatch(addMneme(1), 'gatherMneme');
    if (settings.showFloatingText === false) return;

    const lastResult = store.getState().lastClickResult;

    let x = e && e.clientX ? e.clientX : window.innerWidth / 2;
    let y = e && e.clientY ? e.clientY : window.innerHeight / 2;

    if (e && e.currentTarget && (!e.clientX || e.clientX === 0)) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    if (lastResult) {
      if (lastResult.isSuperCrit) {
        spawnFloatingText(x, y, `⚡ GEDANKENBLITZ +${formatNumber(lastResult.yield)} Mneme!`, '#ff0055');
      } else if (lastResult.isCrit) {
        spawnFloatingText(x, y, `💥 KRIT! +${formatNumber(lastResult.yield)} Mneme`, '#ffb703');
      } else {
        spawnFloatingText(x, y, `+${formatNumber(lastResult.yield)} Mneme`, '#e2b042');
      }
    } else {
      spawnFloatingText(x, y, '+1 Mneme', '#e2b042');
    }
  };

  const handleBuyGenerator = (key, count, cost, e) => {
    store.dispatch(buyGenerator(key, count), `buyGenerator/${key}`);

    if (settings.showFloatingText !== false && e && e.clientX) {
      spawnFloatingText(e.clientX, e.clientY, `+${count === 'max' ? 'Max' : count} Stufe`, '#4cc9f0');
    }

    setPurchasedKey(key);
    setTimeout(() => setPurchasedKey(null), 400);
  };

  const handleUpdateSettings = (key, value) => {
    store.dispatch(updateSetting(key, value), `updateSetting/${key}`);
  };

  // Gesamtertrag pro Sekunde berechnen
  const totalYieldPerSecond = calculateTotalGeneratorYield(state.generators, stats);

  const expProgressPct = Math.min(100, Math.floor((player.exp / (player.expToNext || 100)) * 100));

  // SCREEN 1: MAIN MENU
  if (screenState === 'main_menu') {
    return (
      <div className="game-container main-menu-screen">
        {settings.showParticles && <AmbientParticles active={true} />}
        <MainMenu
          hasSave={hasSave}
          saveData={saveData}
          onStartNewGame={handleStartNewGame}
          onContinueGame={handleContinueGame}
          onDeleteSave={handleDeleteSave}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>
    );
  }

  // SCREEN 2: ACTIVE GAME
  return (
    <div className="game-container fade-in-game">
      {settings.showParticles && <AmbientParticles active={true} />}

      <FloatingTextOverlay active={settings.showFloatingText !== false} />

      {autoSaveToast && (
        <div className={`toast-top-corner ${isAutoSaveFading ? 'fade-out' : ''}`}>
          💾 Automatische Speicherung aktiv
        </div>
      )}

      <header className="game-header">
        <div className="header-top-bar">
          <button className="btn-menu-trigger" onClick={() => setIsMenuOpen(true)}>
            ☰ Menü [ESC]
          </button>
        </div>
        <h1 className="game-title">Archiv des Vergessens</h1>
        <p className="game-subtitle">Die Macht der Mneme</p>

        {/* Header Hero Level Badge */}
        <div className="header-hero-bar" onClick={() => setActiveTab('character')}>
          <span className="hero-lvl-tag">Lvl {player.level || 1}</span>
          <div className="mini-exp-track" title={`EXP: ${formatNumber(player.exp)} / ${formatNumber(player.expToNext)}`}>
            <div className="mini-exp-fill" style={{ width: `${expProgressPct}%` }}></div>
          </div>
        </div>
      </header>

      <ResourceBanner mneme={state.resources.mneme} totalYieldPerSecond={totalYieldPerSecond} />

      {/* Main Game Hub Layout with Left Navigation Sidebar */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', alignItems: 'flex-start' }}>
        {/* Left Hub Sidebar Panel */}
        <HubSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          playerAttributePoints={player.attributePoints}
          playerSkillPoints={player.skillPoints}
          onOpenMenu={() => setIsMenuOpen(true)}
        />

        {/* Main Scene Content Area (Daneben) */}
        <main style={{ flex: '1', minWidth: 0 }}>
          {/* TAB 1: GENERATORS */}
          {activeTab === 'generators' && (
            <GeneratorsView
              generators={state.generators}
              mneme={state.resources.mneme}
              buyMultiplier={buyMultiplier}
              setBuyMultiplier={setBuyMultiplier}
              purchasedKey={purchasedKey}
              stats={stats}
              onGatherClick={handleGatherClick}
              onBuyGenerator={handleBuyGenerator}
            />
          )}

          {/* TAB 2: CHARACTER & ATTRIBUTES */}
          {activeTab === 'character' && (
            <CharacterView player={player} totalYieldPerSec={totalYieldPerSecond} />
          )}

          {/* TAB 3: POE STYLE SKILLTREE */}
          {activeTab === 'skilltree' && (
            <SkillTreeView player={player} mneme={state.resources.mneme} />
          )}

          {/* TAB 4: INVENTORY WITH STAT PREVIEW */}
          {activeTab === 'inventory' && <InventoryView />}

          {/* TAB 5: STORY / KAMPF */}
          {activeTab === 'story' && <StoryView />}
        </main>
      </div>

      {/* Offline Progress Modal */}
      <OfflineModal
        isOpen={showOfflineModal && screenState === 'game'}
        offlineData={offlineData}
        onClaim={() => setShowOfflineModal(false)}
      />

      {/* Pausenmenü Modal */}
      <PauseMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleDeleteSave}
        onReturnToMainMenu={handleReturnToMainMenu}
      />
    </div>
  );
}

export default App;

