/**
 * HubSidebar Component
 * Linke Navigations-Sidebar für die Hauptansicht des Spiels
 */
export function HubSidebar({ activeTab, setActiveTab, playerAttributePoints, playerSkillPoints, onOpenMenu }) {
  return (
    <aside className="hub-sidebar-panel arcane-panel arcane-panel-ornate">
      <div className="hub-nav-list">
        <button
          className={`hub-nav-btn ${activeTab === 'generators' ? 'active' : ''}`}
          onClick={() => setActiveTab('generators')}
        >
          <span className="hub-nav-icon">🏛️</span>
          Generatoren
        </button>

        <button
          className={`hub-nav-btn ${activeTab === 'character' ? 'active' : ''}`}
          onClick={() => setActiveTab('character')}
        >
          <span className="hub-nav-icon">👤</span>
          Charakter
          {playerAttributePoints > 0 && (
            <span className="tab-badge-notification" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
              {playerAttributePoints}
            </span>
          )}
        </button>

        <button
          className={`hub-nav-btn ${activeTab === 'skilltree' ? 'active' : ''}`}
          onClick={() => setActiveTab('skilltree')}
        >
          <span className="hub-nav-icon">🌌</span>
          Talentbaum
          {playerSkillPoints > 0 && (
            <span className="tab-badge-notification" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
              {playerSkillPoints}
            </span>
          )}
        </button>

        <button
          className={`hub-nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <span className="hub-nav-icon">🎒</span>
          Inventar
        </button>

        <button
          className={`hub-nav-btn ${activeTab === 'story' ? 'active' : ''}`}
          onClick={() => setActiveTab('story')}
        >
          <span className="hub-nav-icon">📖</span>
          Story
        </button>

        <div className="hub-nav-separator"></div>

        <button
          className="hub-nav-btn"
          onClick={onOpenMenu}
        >
          <span className="hub-nav-icon">⚙️</span>
          Optionen
        </button>
      </div>
    </aside>
  );
}

export default HubSidebar;
