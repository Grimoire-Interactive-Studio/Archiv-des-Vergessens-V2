import { useState } from 'preact/hooks';
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

  const handlePlayClick = () => {
    if (hasSave) {
      onContinueGame();
    } else {
      onStartNewGame();
    }
  };

  return (
    <div className="main-menu-fullscreen-wrapper">
      {/* Background Cosmic Atmosphere */}
      <div className="cosmic-bg-overlay"></div>

      {/* Main Arcane Card Container */}
      <div className="arcane-card-frame">
        {/* 4 Ornate Gold Filigree Corners */}
        <div className="card-corner corner-top-left">
          <svg viewBox="0 0 120 120" className="corner-svg">
            <defs>
              <linearGradient id="goldGradCorner" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fff2c2" />
                <stop offset="35%" stop-color="#e0b853" />
                <stop offset="70%" stop-color="#99701a" />
                <stop offset="100%" stop-color="#4d3605" />
              </linearGradient>
            </defs>
            <path d="M 6,114 L 6,22 C 6,13 13,6 22,6 L 114,6" fill="none" stroke="url(#goldGradCorner)" stroke-width="4" />
            <path d="M 14,114 L 14,26 C 14,19 19,14 26,14 L 114,14" fill="none" stroke="url(#goldGradCorner)" stroke-width="1.5" stroke-dasharray="5 3" />
            <path d="M 6,6 C 30,6 50,15 60,38 C 45,55 20,40 6,6 Z" fill="url(#goldGradCorner)" opacity="0.9" />
            <path d="M 6,6 C 6,30 15,50 38,60 C 55,45 40,20 6,6 Z" fill="url(#goldGradCorner)" opacity="0.9" />
            <path d="M 18,18 C 35,10 65,15 80,35 C 65,30 50,40 35,60 C 30,45 15,30 18,18 Z" fill="url(#goldGradCorner)" />
            <polygon points="22,22 30,12 38,22 30,32" fill="#fff8d6" stroke="#99701a" stroke-width="1.5" />
          </svg>
        </div>

        <div className="card-corner corner-top-right">
          <svg viewBox="0 0 120 120" className="corner-svg">
            <path d="M 6,114 L 6,22 C 6,13 13,6 22,6 L 114,6" fill="none" stroke="url(#goldGradCorner)" stroke-width="4" />
            <path d="M 14,114 L 14,26 C 14,19 19,14 26,14 L 114,14" fill="none" stroke="url(#goldGradCorner)" stroke-width="1.5" stroke-dasharray="5 3" />
            <path d="M 6,6 C 30,6 50,15 60,38 C 45,55 20,40 6,6 Z" fill="url(#goldGradCorner)" opacity="0.9" />
            <path d="M 6,6 C 6,30 15,50 38,60 C 55,45 40,20 6,6 Z" fill="url(#goldGradCorner)" opacity="0.9" />
            <path d="M 18,18 C 35,10 65,15 80,35 C 65,30 50,40 35,60 C 30,45 15,30 18,18 Z" fill="url(#goldGradCorner)" />
            <polygon points="22,22 30,12 38,22 30,32" fill="#fff8d6" stroke="#99701a" stroke-width="1.5" />
          </svg>
        </div>

        <div className="card-corner corner-bottom-left">
          <svg viewBox="0 0 120 120" className="corner-svg">
            <path d="M 6,114 L 6,22 C 6,13 13,6 22,6 L 114,6" fill="none" stroke="url(#goldGradCorner)" stroke-width="4" />
            <path d="M 14,114 L 14,26 C 14,19 19,14 26,14 L 114,14" fill="none" stroke="url(#goldGradCorner)" stroke-width="1.5" stroke-dasharray="5 3" />
            <path d="M 6,6 C 30,6 50,15 60,38 C 45,55 20,40 6,6 Z" fill="url(#goldGradCorner)" opacity="0.9" />
            <path d="M 6,6 C 6,30 15,50 38,60 C 55,45 40,20 6,6 Z" fill="url(#goldGradCorner)" opacity="0.9" />
            <path d="M 18,18 C 35,10 65,15 80,35 C 65,30 50,40 35,60 C 30,45 15,30 18,18 Z" fill="url(#goldGradCorner)" />
            <polygon points="22,22 30,12 38,22 30,32" fill="#fff8d6" stroke="#99701a" stroke-width="1.5" />
          </svg>
        </div>

        <div className="card-corner corner-bottom-right">
          <svg viewBox="0 0 120 120" className="corner-svg">
            <path d="M 6,114 L 6,22 C 6,13 13,6 22,6 L 114,6" fill="none" stroke="url(#goldGradCorner)" stroke-width="4" />
            <path d="M 14,114 L 14,26 C 14,19 19,14 26,14 L 114,14" fill="none" stroke="url(#goldGradCorner)" stroke-width="1.5" stroke-dasharray="5 3" />
            <path d="M 6,6 C 30,6 50,15 60,38 C 45,55 20,40 6,6 Z" fill="url(#goldGradCorner)" opacity="0.9" />
            <path d="M 6,6 C 6,30 15,50 38,60 C 55,45 40,20 6,6 Z" fill="url(#goldGradCorner)" opacity="0.9" />
            <path d="M 18,18 C 35,10 65,15 80,35 C 65,30 50,40 35,60 C 30,45 15,30 18,18 Z" fill="url(#goldGradCorner)" />
            <polygon points="22,22 30,12 38,22 30,32" fill="#fff8d6" stroke="#99701a" stroke-width="1.5" />
          </svg>
        </div>

        {/* Card Inner Face & Sacred Geometry Overlay */}
        <div className="card-face-content">
          {/* Sacred Geometry SVG Overlay */}
          <div className="sacred-geometry-bg">
            <svg viewBox="0 0 500 600" className="geometry-svg">
              <defs>
                <linearGradient id="geomGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="rgba(255, 230, 160, 0.4)" />
                  <stop offset="100%" stop-color="rgba(180, 130, 40, 0.15)" />
                </linearGradient>
              </defs>

              {/* Concentric Circles */}
              <circle cx="250" cy="300" r="210" fill="none" stroke="url(#geomGold)" stroke-width="1" />
              <circle cx="250" cy="300" r="180" fill="none" stroke="url(#geomGold)" stroke-width="1.5" stroke-dasharray="6 4" />
              <circle cx="250" cy="300" r="130" fill="none" stroke="url(#geomGold)" stroke-width="1" />
              <circle cx="250" cy="300" r="90" fill="none" stroke="url(#geomGold)" stroke-width="0.75" />

              {/* Tilted Diamond / Sacred Star Lines */}
              <rect x="140" y="190" width="220" height="220" fill="none" stroke="url(#geomGold)" stroke-width="1" transform="rotate(45 250 300)" />
              <rect x="155" y="205" width="190" height="190" fill="none" stroke="url(#geomGold)" stroke-width="0.75" transform="rotate(22.5 250 300)" />
              <rect x="155" y="205" width="190" height="190" fill="none" stroke="url(#geomGold)" stroke-width="0.75" transform="rotate(67.5 250 300)" />

              {/* Ray Lines */}
              <line x1="250" y1="50" x2="250" y2="550" stroke="url(#geomGold)" stroke-width="0.75" />
              <line x1="40" y1="300" x2="460" y2="300" stroke="url(#geomGold)" stroke-width="0.75" />
              <line x1="100" y1="90" x2="400" y2="510" stroke="url(#geomGold)" stroke-width="0.5" />
              <line x1="400" y1="90" x2="100" y2="510" stroke="url(#geomGold)" stroke-width="0.5" />
            </svg>
          </div>

          {/* Runic Wheel Circle */}
          <div className="rune-ring-container">
            <div className="rune-ring-characters"></div>
          </div>

          {/* Center Play Assembly */}
          <div className="play-button-assembly">
            {/* Top Winged Diamond Crest */}
            <div className="winged-crest-top">
              <svg viewBox="0 0 200 80" className="winged-crest-svg">
                <defs>
                  <linearGradient id="crestGold" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="30%" stop-color="#ffe49e" />
                    <stop offset="70%" stop-color="#d4a338" />
                    <stop offset="100%" stop-color="#7a550d" />
                  </linearGradient>
                  <filter id="crestGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#ffd700" flood-opacity="0.6" />
                  </filter>
                </defs>

                {/* Center Star Diamond */}
                <polygon points="100,5 110,22 100,39 90,22" fill="#ffffff" filter="url(#crestGlow)" />
                <polygon points="100,10 106,22 100,34 94,22" fill="#ffe9a3" />

                {/* Left Feathered Wings */}
                <path d="M 90,22 Q 60,5 20,20 C 35,32 60,35 85,38 Z" fill="url(#crestGold)" filter="url(#crestGlow)" />
                <path d="M 85,28 Q 55,18 25,32 C 40,42 62,43 82,45 Z" fill="url(#crestGold)" />
                <path d="M 80,34 Q 55,30 35,42 C 48,50 65,49 80,49 Z" fill="url(#crestGold)" />

                {/* Right Feathered Wings */}
                <path d="M 110,22 Q 140,5 180,20 C 165,32 140,35 115,38 Z" fill="url(#crestGold)" filter="url(#crestGlow)" />
                <path d="M 115,28 Q 145,18 175,32 C 160,42 138,43 118,45 Z" fill="url(#crestGold)" />
                <path d="M 120,34 Q 145,30 165,42 C 152,50 135,49 120,49 Z" fill="url(#crestGold)" />

                {/* Lower Filigree Scroll Bar */}
                <path d="M 30,55 Q 100,42 170,55 Q 100,68 30,55 Z" fill="url(#crestGold)" />
                <circle cx="100" cy="58" r="5" fill="#ffffff" />
              </svg>
            </div>

            {/* Grand PLAY Button Frame */}
            <button className="btn-exact-play" onClick={handlePlayClick}>
              <span className="play-button-shine"></span>
              <span className="play-text">{hasSave ? 'FORTSETZEN' : 'PLAY'}</span>
            </button>

            {/* Bottom Downward Filigree Tip */}
            <div className="winged-crest-bottom">
              <svg viewBox="0 0 160 60" className="bottom-crest-svg">
                <path d="M 20,10 Q 80,25 140,10 Q 80,5 20,10 Z" fill="url(#crestGold)" />
                <path d="M 40,18 Q 80,45 120,18 Q 80,25 40,18 Z" fill="url(#crestGold)" />
                <polygon points="80,55 90,30 80,20 70,30" fill="#ffffff" filter="url(#crestGlow)" />
              </svg>
            </div>
          </div>

          {/* Menu Control Buttons below */}
          <div className="main-menu-actions-bar">
            {hasSave && (
              <button className="menu-action-pill" onClick={onStartNewGame}>
                ✨ Neues Spiel
              </button>
            )}
            <button className="menu-action-pill" onClick={() => setActiveModal('options')}>
              ⚙️ Optionen
            </button>
            <button className="menu-action-pill" onClick={() => setActiveModal('credits')}>
              📜 Info & Credits
            </button>
          </div>
        </div>
      </div>

      {/* OPTIONS MODAL */}
      {activeModal === 'options' && (
        <div className="menu-modal-overlay" onClick={(e) => e.target.classList.contains('menu-modal-overlay') && setActiveModal(null)}>
          <div className="menu-modal-box arcane-panel arcane-panel-ornate">
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

      {/* CREDITS / LORE CRAWL MODAL */}
      {activeModal === 'credits' && (
        <div className="credits-fullscreen-overlay">
          <div className="lore-top-bar">
            <button className="btn-lore-back" onClick={() => setActiveModal(null)}>
              ← Zurück
            </button>
          </div>

          <div className="fullscreen-crawl-viewport">
            <div className="crawl-fade-top"></div>
            <div className="crawl-fade-bottom"></div>

            <div className="star-wars-crawl-content">
              <h2 className="crawl-heading">ARCHIV DES VERGESSENS V2</h2>
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
                  <span className="crawl-credit-val">v2.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDeleteSave}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

export default MainMenu;
