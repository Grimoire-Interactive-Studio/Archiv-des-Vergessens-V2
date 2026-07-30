/**
 * StoryView Component
 * Zeigt die Story- und Kampf-Übersicht an (Placeholder für zukünftige Features)
 */
export function StoryView() {
  return (
    <div className="arcane-panel arcane-panel-ornate" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 15px var(--accent-gold-glow))' }}>📖</div>
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold-bright)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
        STORY & KÄMPFE
      </h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: '1.5' }}>
        Hier werden später die epischen Storyfights und die Enthüllung der verblassenden Erinnerungen stattfinden.
      </p>
      <div className="arcane-divider" style={{ maxWidth: '300px', margin: '0 auto 1.5rem auto' }}></div>
      <span className="points-badge highlight">Kapitel 1: Demnächst verfügbar</span>
    </div>
  );
}

export default StoryView;
