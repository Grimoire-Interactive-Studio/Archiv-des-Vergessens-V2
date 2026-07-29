import { useState, useEffect } from 'preact/hooks';
import SaveManager from '../persistence/save-manager';
import store from '../state/store';

export function PauseMenu({ isOpen, onClose, settings = {}, onUpdateSettings, onResetProgress }) {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'options'
  const [saveToast, setSaveToast] = useState('');

  if (!isOpen) return null;

  const currentVolume = settings.volume ?? 80;
  const currentAutosave = settings.autosave ?? true;

  const handleResume = () => {
    setActiveTab('menu');
    onClose();
  };

  const handleManualSave = () => {
    const success = SaveManager.save(store.getState());
    if (success) {
      setSaveToast('Spielstand erfolgreich gespeichert! 💾');
      setTimeout(() => setSaveToast(''), 3000);
    }
  };

  const handleToggleSetting = (key) => {
    if (onUpdateSettings) {
      onUpdateSettings(key, !settings[key]);
    }
  };

  const handleSettingChange = (key, value) => {
    if (onUpdateSettings) {
      onUpdateSettings(key, value);
    }
  };

  const handleQuit = () => {
    SaveManager.save(store.getState());
    if (window['__TAURI__'] && window['__TAURI__'].process) {
      window['__TAURI__'].process.exit(0);
    } else {
      if (window.confirm('Möchtest du das Spiel wirklich beenden? Dein Fortschritt wurde gespeichert.')) {
        window.location.reload();
      }
    }
  };

  return (
    <div className="pause-overlay" onClick={(e) => e.target.classList.contains('pause-overlay') && handleResume()}>
      <div className="pause-modal">
        <div className="pause-header">
          <h2 className="pause-title">
            {activeTab === 'menu' ? '🏛️ PAUSENMENÜ' : '⚙️ OPTIONEN'}
          </h2>
          <button className="btn-close" onClick={handleResume}>✕</button>
        </div>

        {saveToast && <div className="save-toast-popup">{saveToast}</div>}

        {activeTab === 'menu' && (
          <div className="pause-menu-list">
            <button className="pause-menu-btn primary" onClick={handleResume}>
              ▶ Fortsetzen
            </button>
            <button className="pause-menu-btn" onClick={() => setActiveTab('options')}>
              ⚙️ Optionen
            </button>
            <button className="pause-menu-btn danger" onClick={handleQuit}>
              🚪 Beenden
            </button>
          </div>
        )}

        {activeTab === 'options' && (
          <div className="options-container">
            {/* System & Audio */}
            <div className="options-group">
              <h3 className="options-group-title">🔊 Audio & System</h3>
              
              <div className="option-row">
                <div className="option-info">
                  <span className="option-label">Lautstärke</span>
                  <span className="option-desc">Master-Lautstärke für Soundeffekte</span>
                </div>
                <div className="option-control">
                  <input
                    type="range"
                    className="volume-slider"
                    min="0"
                    max="100"
                    value={currentVolume}
                    style={{ '--slider-fill': `${currentVolume}%` }}
                    onInput={(e) => handleSettingChange('volume', Number(e.target.value))}
                  />
                  <span className="volume-badge">{currentVolume}%</span>
                </div>
              </div>

              <div className="option-row">
                <div className="option-info">
                  <span className="option-label">Automatisch Speichern</span>
                  <span className="option-desc">Sichert den Fortschritt regelmäßig lokal</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={currentAutosave}
                    onChange={(e) => handleSettingChange('autosave', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            {/* Visuals */}
            <div className="options-group">
              <h3 className="options-group-title">✨ Visuelle Effekte</h3>

              <div className="option-row">
                <div className="option-info">
                  <span className="option-label">Floating-Texte</span>
                  <span className="option-desc">Aufsteigende Zahlenwerte bei Klicks & Käufen</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.showFloatingText !== false}
                    onChange={() => handleToggleSetting('showFloatingText')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="option-row">
                <div className="option-info">
                  <span className="option-label">Hintergrund-Partikel</span>
                  <span className="option-desc">Schwebender Mneme-Funken-Effekt im Hintergrund</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.showParticles !== false}
                    onChange={() => handleToggleSetting('showParticles')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="danger-zone-box">
              <div className="danger-zone-header">⚠️ Danger Zone</div>
              <p className="danger-zone-text">Das Zurücksetzen löscht deinen gesamten Spielfortschritt unwiderruflich.</p>
              <button className="btn-danger-reset" onClick={onResetProgress}>
                🗑️ Spielfortschritt zurücksetzen
              </button>
            </div>

            <div className="option-actions">
              <button className="btn-secondary" onClick={handleManualSave}>
                💾 Manuell Speichern
              </button>
              <button className="btn-primary" onClick={() => setActiveTab('menu')}>
                ← Zurück zum Menü
              </button>
            </div>
          </div>
        )}

        <div className="pause-footer-hint">
          <small>Drücke [ESC] um das Menü zu schließen</small>
        </div>
      </div>
    </div>
  );
}



export default PauseMenu;
