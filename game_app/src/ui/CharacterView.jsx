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
    <div className="character-view">
      {/* Player Header Banner */}
      <div className="character-card hero-card">
        <div className="hero-avatar">🧙‍♂️</div>
        <div className="hero-info">
          <h2 className="hero-name">{player.name || 'Mnemoniker'}</h2>
          <span className="hero-level">Stufe {player.level || 1}</span>
          
          <div className="exp-bar-container" title={`EXP: ${formatNumber(player.exp)} / ${formatNumber(player.expToNext)}`}>
            <div className="exp-bar-fill" style={{ width: `${expProgressPct}%` }}></div>
            <span className="exp-bar-text">{formatNumber(player.exp)} / {formatNumber(player.expToNext)} EXP ({expProgressPct}%)</span>
          </div>
        </div>
      </div>

      {/* Attribute Distribution Section */}
      <div className="section-title-bar">
        <h3>Attributpunkte Verteilen</h3>
        <span className={`points-badge ${pointsAvailable > 0 ? 'highlight' : ''}`}>
          {pointsAvailable} {pointsAvailable === 1 ? 'Punkt' : 'Punkte'} verfügbar
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

      {/* Stats Breakdown Summary */}
      <div className="section-title-bar">
        <h3>Aktive Gesamt-Boni</h3>
      </div>

      <div className="stats-breakdown-card">
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
        {stats.doubleMilestoneBonus && (
          <div className="stat-row keystone-row">
            <span className="stat-label">👑 Ahnenresonanz (Keystone):</span>
            <span className="stat-value">Verdoppelt Meilenstein-Boni (4x)</span>
          </div>
        )}
        {stats.superCritEnabled && (
          <div className="stat-row keystone-row">
            <span className="stat-label">⚡ Gedankenblitz (Keystone):</span>
            <span className="stat-value">Super-Krits (10x Ertrag) aktiv</span>
          </div>
        )}
        {stats.levelUpBurstSeconds > 0 && (
          <div className="stat-row keystone-row">
            <span className="stat-label">⏱️ Zeitraffer-Matrize (Keystone):</span>
            <span className="stat-value">+{stats.levelUpBurstSeconds}s Ertrag pro Level-Up</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CharacterView;
