import { formatNumber } from '../engine/math';

export function ConfirmRespecModal({ isOpen, spentPoints, cost, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div
      className="menu-modal-overlay high-z"
      onClick={(e) => e.target.classList.contains('menu-modal-overlay') && onCancel()}
    >
      <div className="menu-modal-box confirm-respec-box">
        <div style={{ textAlign: 'center', fontSize: '2.5rem' }}>🔄</div>
        <h3 style={{ margin: 0, textAlign: 'center', color: '#ffb703', fontSize: '1.4rem' }}>
          TALENTBAUM ZURÜCKSETZEN?
        </h3>
        <p style={{ margin: 0, lineHeight: 1.5, color: '#e0e0e0', textAlign: 'center' }}>
          Möchtest du den Talentbaum wirklich zurücksetzen?
        </p>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a0a0b0' }}>
            <span>Zurückerstattete Skillpunkte:</span>
            <strong style={{ color: '#4cc9f0' }}>+{spentPoints} Punkte</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a0a0b0' }}>
            <span>Kosten:</span>
            <strong style={{ color: '#ffb703' }}>{formatNumber(cost)} Mneme</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button className="btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
            Abbrechen
          </button>
          <button className="btn-danger-confirm" onClick={onConfirm} style={{ flex: 1 }}>
            Ja, zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmRespecModal;
