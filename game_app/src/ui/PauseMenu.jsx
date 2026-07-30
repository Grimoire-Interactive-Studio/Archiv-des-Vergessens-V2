import { useState } from 'preact/hooks';
import SaveManager from '../persistence/save-manager';
import store from '../state/store';
import OptionsMenu from './OptionsMenu';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export function PauseMenu({
  isOpen,
  onClose,
  settings = {},
  onUpdateSettings,
  onResetProgress,
  onReturnToMainMenu
}) {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'options'
  const [saveToast, setSaveToast] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleResume = () => {
    setActiveTab('menu');
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleManualSave = () => {
    const success = SaveManager.save(store.getState());
    if (success) {
      setSaveToast('Spielstand erfolgreich gespeichert! 💾');
      setTimeout(() => setSaveToast(''), 3000);
    }
  };

  const handleGoToMainMenu = () => {
    SaveManager.save(store.getState());
    handleResume();
    if (onReturnToMainMenu) {
      onReturnToMainMenu();
    }
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    if (onResetProgress) {
      onResetProgress();
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
            <button className="pause-menu-btn" onClick={handleGoToMainMenu}>
              🏠 Hauptmenü
            </button>
            <button className="pause-menu-btn danger" onClick={handleQuit}>
              🚪 Beenden
            </button>
          </div>
        )}

        {activeTab === 'options' && (
          <OptionsMenu
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onRequestDeleteSave={() => setShowDeleteConfirm(true)}
            closeLabel="← Zurück zum Menü"
            onClose={() => setActiveTab('menu')}
            extraActions={
              <button className="btn-secondary" onClick={handleManualSave}>
                💾 Manuell Speichern
              </button>
            }
          />
        )}

        <div className="pause-footer-hint">
          <small>Drücke [ESC] um das Menü zu schließen</small>
        </div>
      </div>

      {/* CONFIRMATION MODAL FOR DELETE SAVE IN PAUSE MENU */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

export default PauseMenu;
