import {
  calculateBulkCost,
  calculateMaxAffordable,
  calculateGeneratorYield,
  formatNumber
} from '../engine/math';
import { getGeneratorIcon } from '../state/generatorsData';

export function GeneratorCard({
  genKey,
  gen,
  mneme = 0,
  buyMultiplier = 1,
  purchasedKey = null,
  stats = {},
  onBuy
}) {
  let cost = 0;
  let targetCount = buyMultiplier;
  const discountPct = stats.buildingCostDiscountPct || 0;

  if (buyMultiplier === 'max') {
    const maxInfo = calculateMaxAffordable(gen.baseCost, gen.level, gen.costMult, mneme, discountPct);
    targetCount = maxInfo.count > 0 ? maxInfo.count : 1;
    cost = maxInfo.cost > 0 ? maxInfo.cost : calculateBulkCost(gen.baseCost, gen.level, gen.costMult, 1, discountPct);
  } else {
    cost = calculateBulkCost(gen.baseCost, gen.level, gen.costMult, buyMultiplier, discountPct);
  }

  const currentYield = calculateGeneratorYield(gen.baseYield, gen.level, stats);
  const canAfford = mneme >= cost && cost > 0;
  const icon = getGeneratorIcon(genKey);

  // Fortschritt bis zur leistbaren Stufe (0-100%)
  const affordabilityPercent = canAfford ? 100 : Math.min(100, (mneme / (cost || 1)) * 100);

  // Meilenstein-Fortschritt
  const milestoneProgress = ((gen.level % 25) / 25) * 100;
  const nextMilestoneLvl = (Math.floor(gen.level / 25) + 1) * 25;

  return (
    <div className={`generator-card ${purchasedKey === genKey ? 'purchased-flash' : ''}`}>
      <div className="generator-header">
        <div className="generator-title-group">
          <span className="generator-icon">{icon}</span>
          <h3 className="generator-name">{gen.name}</h3>
        </div>
        <span className="generator-level">Stufe {gen.level}</span>
      </div>

      <div className="generator-stats">
        <p>Ertrag: +{formatNumber(currentYield)} Mneme/s</p>
        <p className="milestone-text">
          ⚡ Next {stats.doubleMilestoneBonus ? '4x' : '2x'} Bonus bei Stufe {nextMilestoneLvl}
        </p>
      </div>

      {/* Meilenstein-Fortschrittsbalken */}
      <div
        className="progress-bar-container milestone-bar-container"
        title={`Meilenstein-Fortschritt (${Math.floor(milestoneProgress)}%)`}
      >
        <div className="progress-bar milestone-bar" style={{ width: `${milestoneProgress}%` }}></div>
      </div>

      {/* Kaufbereitschafts-Fortschrittsbalken */}
      <div
        className="progress-bar-container affordability-bar-container"
        title={`Bereitschaft (${Math.floor(affordabilityPercent)}%)`}
      >
        <div
          className={`progress-bar affordability-bar ${canAfford ? 'ready' : ''}`}
          style={{ width: `${affordabilityPercent}%` }}
        ></div>
      </div>

      <button
        className="btn-buy"
        disabled={!canAfford}
        onClick={(e) => onBuy && onBuy(genKey, targetCount, cost, e)}
      >
        Kaufen ({buyMultiplier === 'max' ? `+${targetCount}` : `+${buyMultiplier}`}) für {formatNumber(cost)} Mneme
      </button>
    </div>
  );
}

export default GeneratorCard;
