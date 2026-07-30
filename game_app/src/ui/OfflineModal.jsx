import { formatNumber } from '../engine/math';

function formatDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '0 Sek.';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const parts = [];
  if (hrs > 0) parts.push(`${hrs} Std.`);
  if (mins > 0 || hrs > 0) parts.push(`${mins} Min.`);
  parts.push(`${secs} Sek.`);

  return parts.join(' ');
}

function formatTimestamp(ts) {
  if (!ts) return 'Unbekannt';
  const d = new Date(ts);
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function OfflineModal({ isOpen, offlineData, onClaim }) {
  if (!isOpen || !offlineData) return null;

  const {
    elapsedSeconds = 0,
    clampedSeconds = 0,
    totalYield = 0,
    ratePerSec = 0,
    wasClamped = false,
    lastSaveTimestamp = 0
  } = offlineData;

  return (
    <div className="offline-modal-overlay">
      <div className="offline-modal-box">
        {/* Header Icon & Title */}
        <div className="offline-modal-header">
          <div className="offline-header-icon">⏳</div>
          <h2 className="offline-title">WILLKOMMEN ZURÜCK!</h2>
          <p className="offline-subtitle">
            Dein Archiv hat während deiner Abwesenheit weitergearbeitet und Erinnerungen gesammelt.
          </p>
        </div>

        {/* Main Highlight: Total Gained Mneme */}
        <div className="offline-reward-banner">
          <span className="offline-reward-label">Generierte Mneme-Essenz</span>
          <div className="offline-reward-amount">
            + {formatNumber(totalYield)}
          </div>
          <span className="offline-reward-sub">Mneme-Partikel</span>
        </div>

        {/* Statistics Grid */}
        <div className="offline-stat-grid">
          <div className="offline-stat-card">
            <span className="offline-stat-icon">⏱️</span>
            <div className="offline-stat-info">
              <span className="offline-stat-label">Abwesenheitszeit</span>
              <span className="offline-stat-value">{formatDuration(clampedSeconds)}</span>
              {wasClamped && (
                <span className="offline-stat-limit-tag">Max Limit (12 Std.)</span>
              )}
            </div>
          </div>

          <div className="offline-stat-card">
            <span className="offline-stat-icon">⚡</span>
            <div className="offline-stat-info">
              <span className="offline-stat-label">Ertrags-Rate</span>
              <span className="offline-stat-value">+{formatNumber(ratePerSec)} / Sek.</span>
            </div>
          </div>

          <div className="offline-stat-card">
            <span className="offline-stat-icon">💾</span>
            <div className="offline-stat-info">
              <span className="offline-stat-label">Letzter Stand</span>
              <span className="offline-stat-value">{formatTimestamp(lastSaveTimestamp)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="offline-action-box">
          <button className="btn-claim-offline" onClick={onClaim}>
            ✦ BELOHNUNG ANNEHMEN & FORTSETZEN ✦
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfflineModal;
