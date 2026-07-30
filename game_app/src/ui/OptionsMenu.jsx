export function OptionsMenu({
  isOpen = true,
  onClose,
  settings = {},
  onUpdateSettings,
  hasSave = false,
  onRequestDeleteSave,
  extraActions = null,
  closeLabel = '✓ Schließen'
}) {
  if (!isOpen) return null;

  const currentVolume = settings.volume ?? 80;
  const currentAutosave = settings.autosave ?? true;

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

  return (
    <div className="options-container">
      {/* Audio & System */}
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

      {/* Visuelle Effekte */}
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

      {/* Danger Zone: Spielstand löschen */}
      {(hasSave || onRequestDeleteSave) && (
        <div className="danger-zone-box">
          <div className="danger-zone-header">⚠️ Danger Zone</div>
          <p className="danger-zone-text">
            Löscht deinen aktuellen Spielstand unwiderruflich, um von neuem zu beginnen.
          </p>
          <button
            className="btn-danger-reset"
            onClick={onRequestDeleteSave}
          >
            🗑️ Spielstand löschen
          </button>
        </div>
      )}

      <div className="option-actions">
        {extraActions}
        {onClose && (
          <button className="btn-primary" onClick={onClose}>
            {closeLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default OptionsMenu;
