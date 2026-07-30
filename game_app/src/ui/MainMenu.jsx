import { useState } from 'preact/hooks';
import { formatNumber } from '../engine/math';
import OptionsMenu from './OptionsMenu';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export function MainMenu({
  hasSave,
  saveData,
  onStartNewGame,
  onContinueGame,
  onDeleteSave,
  settings = {},
  onUpdateSettings
}) {
  const [activeModal, setActiveModal] = useState(null); // null | 'options' | 'credits'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleConfirmDeleteSave = () => {
    setShowDeleteConfirm(false);
    setActiveModal(null);
    onDeleteSave();
  };

  const formatLastSave = (timestamp) => {
    if (!timestamp) return 'Unbekannt';
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="main-menu-container">
      {/* Hero Header */}
      <div className="main-menu-hero">
        <h1 className="main-menu-title">ARCHIV DES VERGESSENS</h1>
        <p className="main-menu-subtitle">Die Macht der Mneme</p>
      </div>

      {/* Main Menu Action Card */}
      <div className="main-menu-card">
        {hasSave ? (
          <div className="save-preview-box">
            <div className="save-preview-header">
              <span className="save-preview-tag">💾 Aktiver Spielstand</span>
              <span className="save-preview-date">{formatLastSave(saveData?.system?.lastSave)}</span>
            </div>
            <div className="save-preview-stats">
              <div className="save-stat-item">
                <span className="save-stat-label">Stufe</span>
                <span className="save-stat-val">Lvl {saveData?.player?.level || 1}</span>
              </div>
              <div className="save-stat-item">
                <span className="save-stat-label">Gesammelte Mneme</span>
                <span className="save-stat-val">{formatNumber(saveData?.resources?.mneme || 0)}</span>
              </div>
            </div>

            <button className="main-menu-btn primary continue-btn" onClick={onContinueGame}>
              ✦ Fortsetzen
            </button>
          </div>
        ) : (
          <button className="main-menu-btn primary new-game-btn" onClick={onStartNewGame}>
            ✨ Neues Spiel
          </button>
        )}

        <button className="main-menu-btn" onClick={() => setActiveModal('options')}>
          ⚙️ Optionen
        </button>

        <button className="main-menu-btn" onClick={() => setActiveModal('credits')}>
          📜 Mitwirkende & Info
        </button>
      </div>

      <div className="main-menu-footer">
        <small>v1.0.0 — Grimoire Interactive Studio</small>
      </div>

      {/* MODAL: OPTIONS */}
      {activeModal === 'options' && (
        <div className="menu-modal-overlay" onClick={(e) => e.target.classList.contains('menu-modal-overlay') && setActiveModal(null)}>
          <div className="menu-modal-box">
            <div className="pause-header">
              <h2 className="pause-title">⚙️ OPTIONEN</h2>
              <button className="btn-close" onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <OptionsMenu
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              hasSave={hasSave}
              onRequestDeleteSave={() => setShowDeleteConfirm(true)}
              onClose={() => setActiveModal(null)}
            />
          </div>
        </div>
      )}

      {/* FULLSCREEN CREDITS & LORE CRAWL */}
      {activeModal === 'credits' && (
        <div className="credits-fullscreen-overlay">
          {/* Top Left Back Button */}
          <div className="lore-top-bar">
            <button className="btn-lore-back" onClick={() => setActiveModal(null)}>
              ← Zurück
            </button>
          </div>

          <div className="fullscreen-crawl-viewport">
            <div className="crawl-fade-top"></div>
            <div className="crawl-fade-bottom"></div>

            <div className="star-wars-crawl-content">
              <h2 className="crawl-heading">ARCHIV DES VERGESSENS</h2>
              <h3 className="crawl-subheading">Die Macht der Mneme</h3>

              <p className="crawl-paragraph">
                In den urzeitlichen Tiefen des Kosmos, wo Sternenstaub zu verblassten Erinnerungen gerinnt, ruht das Archiv des Vergessens.
              </p>

              <p className="crawl-paragraph">
                Einst wachten die mächtigen Mnemoniker über den Fluss der Gedanken und das Licht aller Seelen. Doch die Äonen strichen dahin, und die kosmische Resonanz verstummte im ewigen Schatten der Vergessenheit.
              </p>

              <p className="crawl-paragraph">
                Nun ruft die Essenz der Mneme nach einer neuen Seele. Sammle die verstreuten Erinnerungs-Partikel, reaktiviere die unermesslichen Generatoren und entfache das Licht der Erkenntnis von Neuem...
              </p>

              <div className="crawl-divider">✦ ✦ ✦</div>

              <div className="crawl-footer-credits">
                <div className="crawl-credit-block">
                  <span className="crawl-credit-label">Entwickler Studio</span>
                  <span className="crawl-credit-val">Grimoire Interactive Studio</span>
                </div>

                <div className="crawl-credit-block">
                  <span className="crawl-credit-label">Version</span>
                  <span className="crawl-credit-val">v1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR DELETE SAVE */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDeleteSave}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

export default MainMenu;
