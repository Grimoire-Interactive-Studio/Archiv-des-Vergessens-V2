/**
 * InventoryView Component
 * Zeigt das Inventar mit Items und Stat-Previews an
 */
export function InventoryView() {
  return (
    <div className="arcane-panel arcane-panel-ornate">
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold-bright)', marginBottom: '1rem' }}>
        🎒 Inventar & Ausrüstung
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Bewege die Maus über ein Item, um die Statveränderung einzusehen.
      </p>

      <div className="inventory-grid">
        {/* Sample Items with Stat Preview Tooltips */}
        <div className="inventory-slot">
          <span style={{ fontSize: '1.8rem' }}>🗡️</span>
          <div className="item-tooltip">
            <div className="item-tooltip-title">Klinge der Erinnerung</div>
            <div className="stat-change-list">
              <div className="stat-change-row">
                <span>Stärke (STR):</span>
                <span className="stat-change-val positive">+5</span>
              </div>
              <div className="stat-change-row">
                <span>Krit-Chance:</span>
                <span className="stat-change-val positive">+2.0%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="inventory-slot">
          <span style={{ fontSize: '1.8rem' }}>🔮</span>
          <div className="item-tooltip">
            <div className="item-tooltip-title">Fokus-Kristall</div>
            <div className="stat-change-list">
              <div className="stat-change-row">
                <span>Arkan (ARC):</span>
                <span className="stat-change-val positive">+8</span>
              </div>
              <div className="stat-change-row">
                <span>Baukosten:</span>
                <span className="stat-change-val negative">+1.5%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="inventory-slot">
          <span style={{ fontSize: '1.8rem' }}>🛡️</span>
          <div className="item-tooltip">
            <div className="item-tooltip-title">Schild der Ahnen</div>
            <div className="stat-change-list">
              <div className="stat-change-row">
                <span>Konstitution:</span>
                <span className="stat-change-val positive">+12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Empty slots */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="inventory-slot" style={{ opacity: 0.3 }}>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>◇</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventoryView;
