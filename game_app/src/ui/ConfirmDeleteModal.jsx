export function ConfirmDeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="menu-modal-overlay high-z" onClick={(e) => e.target.classList.contains('menu-modal-overlay') && onCancel()}>
      <div className="menu-modal-box confirm-delete-box">
        <div className="confirm-delete-icon">🚨</div>
        <h3 className="confirm-delete-title">SPIELSTAND WIRKLICH LÖSCHEN?</h3>
        <p className="confirm-delete-desc">
          Möchtest du deinen aktuellen Spielstand wirklich <strong>unwiderruflich löschen</strong>?
          Sämtlicher Fortschritt (Level, Mneme, Ausbau) geht dabei verloren!
        </p>
        <div className="confirm-delete-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Abbrechen
          </button>
          <button className="btn-danger-confirm" onClick={onConfirm}>
            JA, SPIELSTAND LÖSCHEN
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
