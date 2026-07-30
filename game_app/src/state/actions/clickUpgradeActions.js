import { calculateAggregatePlayerStats, calculateBuildingCost, calculateBulkCost, calculateMaxAffordable } from '../../engine/math.js';

/**
 * Kauft ein Klick-Upgrade.
 * @param {string} upgradeKey - Schlüssel des Upgrades
 */
export function buyClickUpgrade(upgradeKey) {
  return (state) => {
    const upgrade = state.clickUpgrades[upgradeKey];
    if (!upgrade || upgrade.purchased) return state;

    const stats = calculateAggregatePlayerStats(state.player);
    const discountPct = stats.buildingCostDiscountPct || 0;

    // Berechne Kosten mit Rabatt
    const cost = calculateBuildingCost(upgrade.baseCost, 0, 1, discountPct);

    if (state.resources.mneme < cost) return state;

    return {
      ...state,
      resources: {
        ...state.resources,
        mneme: state.resources.mneme - cost
      },
      clickUpgrades: {
        ...state.clickUpgrades,
        [upgradeKey]: {
          ...upgrade,
          purchased: true
        }
      }
    };
  };
}
