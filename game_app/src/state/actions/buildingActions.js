import { calculateAggregatePlayerStats, calculateBuildingCost, calculateBulkCost, calculateMaxAffordable } from '../../engine/math.js';

/**
 * Kauft ein Gebäude.
 * @param {string} buildingKey - Schlüssel des Gebäudes
 * @param {number|string} count - Anzahl oder 'max'
 */
export function buyBuilding(buildingKey, count = 1) {
  return (state) => {
    const building = state.buildings[buildingKey];
    if (!building) return state;

    const stats = calculateAggregatePlayerStats(state.player);
    const discountPct = stats.buildingCostDiscountPct || 0;

    let targetCount = 1;
    let cost = 0;

    if (count === 'max') {
      const maxInfo = calculateMaxAffordable(building.baseCost, building.level, building.costMult, state.resources.mneme, discountPct);
      targetCount = maxInfo.count;
      cost = maxInfo.cost;
    } else {
      targetCount = Math.max(1, Math.floor(Number(count) || 1));
      cost = calculateBulkCost(building.baseCost, building.level, building.costMult, targetCount, discountPct);
    }

    if (targetCount <= 0 || state.resources.mneme < cost) return state;

    return {
      ...state,
      resources: {
        ...state.resources,
        mneme: state.resources.mneme - cost
      },
      buildings: {
        ...state.buildings,
        [buildingKey]: {
          ...building,
          level: building.level + targetCount
        }
      }
    };
  };
}

/**
 * Verkauft ein Gebäude (50% Rückerstattung).
 * @param {string} buildingKey - Schlüssel des Gebäudes
 * @param {number} count - Anzahl
 */
export function sellBuilding(buildingKey, count = 1) {
  return (state) => {
    const building = state.buildings[buildingKey];
    if (!building || building.level <= 0) return state;

    const sellCount = Math.min(count, building.level);
    if (sellCount <= 0) return state;

    // 50% Rückerstattung des aktuellen Kostenwerts
    const refundPerUnit = calculateBuildingCost(building.baseCost, building.level - 1, building.costMult, 0) * 0.5;
    const totalRefund = refundPerUnit * sellCount;

    return {
      ...state,
      resources: {
        ...state.resources,
        mneme: state.resources.mneme + totalRefund
      },
      buildings: {
        ...state.buildings,
        [buildingKey]: {
          ...building,
          level: building.level - sellCount
        }
      }
    };
  };
}
