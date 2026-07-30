import { calculateAggregatePlayerStats, formatNumber } from '../engine/math';
import store from '../state/store';
import { allocateAttributePoint } from '../state/actions';

export function CharacterView({ player, totalYieldPerSec }) {
  const stats = calculateAggregatePlayerStats(player);
  const attributes = player.attributes || { focus: 0, knowledge: 0, willpower: 0 };
  const pointsAvailable = player.attributePoints || 0;

  const handleAllocate = (attrKey) => {
    store.dispatch(allocateAttributePoint(attrKey), `allocateAttribute/${attrKey}`);
  };

  const expProgressPct = Math.min(100, Math.floor((player.exp / (player.expToNext || 100)) * 100));

  return (
    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      {/* Left Panel: Celestial Guardian Character Sheet */}
      <div className="character-sheet-panel arcane-panel arcane-panel-ornate">
        <div className="character-header">
          <h2 className="character-title">CELESTIAL GUARDIAN</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stufe {player.level || 1}</span>
        </div>

        <div className="character-content-top">
          {/* Avatar Frame */}
          <div className="character-avatar-frame">
            <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.8))' }}>🧙‍♂️</div>
          </div>

          {/* Stats List */}
          <div className="character-stats-list">
            <div className="stat-entry">
              <div className="stat-icon str">⚔️</div>
              <div className="stat-info">
                <span className="stat-name">STR (STÄRKE)</span>
                <span className="stat-value">{10 + (attributes.focus || 0) * 2}</span>
              </div>
            </div>

            <div className="stat-entry">
              <div className="stat-icon arc">🔮</div>
              <div className="stat-info">
                <span className="stat-name">ARC (ARKAN)</span>
                <span className="stat-value">{15 + (attributes.knowledge || 0) * 3}</span>
              </div>
            </div>

            <div className="stat-entry">
              <div className="stat-icon dex">⚡</div>
              <div className="stat-info">
                <span className="stat-name">DEX (GESCHICK)</span>
                <span className="stat-value">{8 + (attributes.focus || 0)}</span>
              </div>
            </div>

            <div className="stat-entry">
              <div className="stat-icon con">🛡️</div>
              <div className="stat-info">
                <span className="stat-name">CON (KONSTITUTION)</span>
                <span className="stat-value">{12 + (attributes.willpower || 0) * 2}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="arcane-divider"></div>

        {/* Active Quests Section */}
        <div className="active-quests-section">
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold-bright)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
            ACTIVE QUESTS
          </h3>
          <div className="quest-item">
            <div className="quest-title">Das Erwachen der Mneme</div>
            <div className="quest-desc">Sammle 1.000 Mneme und reaktiviere das erste Relikt des Archivs.</div>
          </div>
        </div>
      </div>

      {/* Right Section: Attribute Distribution & Stats */}
      <div style={{ flex: '1', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="arcane-panel arcane-panel-ornate" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="section-title-bar" style={{ border: 'none', padding: 0 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold-bright)' }}>Attributpunkte Verteilen</h3>
            <span className={`points-badge ${pointsAvailable > 0 ? 'highlight' : ''}`}>
              {pointsAvailable} Punkte verfügbar
            </span>
          </div>

          <div className="attributes-grid">
            {/* Fokus */}
            <div className="attribute-card">
              <div className="attribute-header">
                <span className="attribute-icon">🎯</span>
                <div className="attribute-title">
                  <h4>Fokus</h4>
                  <span className="attribute-val">Stufe {attributes.focus || 0}</span>
                </div>
              </div>
              <p className="attribute-desc">+2% Klick-Ertrag & +0.5% Krit-Chance pro Punkt</p>
              <button
                className="btn-attribute-add"
                disabled={pointsAvailable <= 0}
                onClick={() => handleAllocate('focus')}
              >
                +1 Fokus Verteilen
              </button>
            </div>

            {/* Wissen */}
            <div className="attribute-card">
              <div className="attribute-header">
                <span className="attribute-icon">📚</span>
                <div className="attribute-title">
                  <h4>Wissen</h4>
                  <span className="attribute-val">Stufe {attributes.knowledge || 0}</span>
                </div>
              </div>
              <p className="attribute-desc">+1.5% Ertrag aller Generatoren pro Punkt</p>
              <button
                className="btn-attribute-add"
                disabled={pointsAvailable <= 0}
                onClick={() => handleAllocate('knowledge')}
              >
                +1 Wissen Verteilen
              </button>
            </div>

            {/* Willenskraft */}
            <div className="attribute-card">
              <div className="attribute-header">
                <span className="attribute-icon">⚡</span>
                <div className="attribute-title">
                  <h4>Willenskraft</h4>
                  <span className="attribute-val">Stufe {attributes.willpower || 0}</span>
                </div>
              </div>
              <p className="attribute-desc">-0.8% Baukosten & +1.0% EXP-Gewinn pro Punkt</p>
              <button
                className="btn-attribute-add"
                disabled={pointsAvailable <= 0}
                onClick={() => handleAllocate('willpower')}
              >
                +1 Willenskraft Verteilen
              </button>
            </div>
          </div>
        </div>

        {/* Stats Breakdown Summary */}
        <div className="arcane-panel arcane-panel-ornate">
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold-bright)', marginBottom: '1rem' }}>Aktive Gesamt-Boni</h3>
          <div className="stats-breakdown-card" style={{ background: 'transparent', border: 'none', padding: 0 }}>
            <div className="stat-row">
              <span className="stat-label">🏛️ Generator Ertrags-Bonus:</span>
              <span className="stat-value">+{stats.generatorYieldPct.toFixed(1)}%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">✦ Klick-Ertrags-Bonus:</span>
              <span className="stat-value">+{stats.clickYieldPct.toFixed(1)}%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">💥 Kritische Klick-Chance:</span>
              <span className="stat-value">{stats.critChancePct.toFixed(1)}%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">⚡ Kritischer Klick-Schaden:</span>
              <span className="stat-value">{stats.critDamagePct.toFixed(0)}%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">💸 Baukosten-Rabatt:</span>
              <span className="stat-value">-{stats.buildingCostDiscountPct.toFixed(1)}%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">✨ EXP-Gewinn Multiplikator:</span>
              <span className="stat-value">+{stats.expBoostPct.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterView;

