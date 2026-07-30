import { calculateAggregatePlayerStats, calculateGeneratorYield, calculateTotalGeneratorYield, calculateClickYield, calculateBuildingCost, calculateBulkCost, calculateMaxAffordable } from '../../engine/math.js';
import { addExpToPlayer } from './playerActions.js';

/**
 * Fügt Mneme durch Klick hinzu und verarbeitet EXP.
 * @param {number} amount - Basis-Mneme-Menge
 */
export function addMneme(amount = 1) {
  return (state) => {
    const safeAmount = Number(amount);
    if (isNaN(safeAmount) || safeAmount <= 0) return state;

    const stats = calculateAggregatePlayerStats(state.player);
    const clickResult = calculateClickYield(safeAmount, stats);

    // Klick EXP: Base 1 EXP + Bonus durch stats
    const expGained = Math.max(1, Math.floor(1 * (1 + (stats.expBoostPct || 0) / 100)));
    const { updatedPlayer, burstMnemeGained } = addExpToPlayer(state.player, expGained, 0);

    const totalMnemeAdded = clickResult.yield + burstMnemeGained;

    return {
      ...state,
      player: updatedPlayer,
      resources: {
        ...state.resources,
        mneme: state.resources.mneme + totalMnemeAdded,
        totalMneme: state.resources.totalMneme + totalMnemeAdded
      },
      lastClickResult: clickResult // Für Floating Text in UI (Crit Indicator)
    };
  };
}

/**
 * Kauft einen Generator.
 * @param {string} genKey - Schlüssel des Generators
 * @param {number|string} count - Anzahl oder 'max'
 */
export function buyGenerator(genKey, count = 1) {
  return (state) => {
    const gen = state.generators[genKey];
    if (!gen) return state;

    const stats = calculateAggregatePlayerStats(state.player);
    const discountPct = stats.buildingCostDiscountPct || 0;

    let targetCount = 1;
    let cost = 0;

    if (count === 'max') {
      const maxInfo = calculateMaxAffordable(gen.baseCost, gen.level, gen.costMult, state.resources.mneme, discountPct);
      targetCount = maxInfo.count;
      cost = maxInfo.cost;
    } else {
      targetCount = Math.max(1, Math.floor(Number(count) || 1));
      cost = calculateBulkCost(gen.baseCost, gen.level, gen.costMult, targetCount, discountPct);
    }

    if (targetCount <= 0 || state.resources.mneme < cost) return state;

    return {
      ...state,
      resources: {
        ...state.resources,
        mneme: state.resources.mneme - cost
      },
      generators: {
        ...state.generators,
        [genKey]: {
          ...gen,
          level: gen.level + targetCount
        }
      }
    };
  };
}

/**
 * Verarbeitet einen Tick (passive Produktion).
 * @param {number} dtSeconds - Vergangene Zeit in Sekunden
 */
export function processTick(dtSeconds) {
  return (state) => {
    const stats = calculateAggregatePlayerStats(state.player);
    const totalYieldPerSec = calculateTotalGeneratorYield(state.generators, stats);

    const tickMneme = totalYieldPerSec * dtSeconds;

    // Idle EXP Gewinn: logarithmisch gedämpft basierend auf Ertrag
    let passiveExpGained = 0;
    if (tickMneme > 0) {
      const baseExpRate = Math.max(0.05, Math.log10(1 + totalYieldPerSec) * 0.1);
      passiveExpGained = baseExpRate * dtSeconds * (1 + (stats.expBoostPct || 0) / 100);
    }

    const { updatedPlayer, burstMnemeGained } = addExpToPlayer(state.player, passiveExpGained, totalYieldPerSec);

    const totalAdded = tickMneme + burstMnemeGained;

    return {
      ...state,
      player: updatedPlayer,
      resources: {
        ...state.resources,
        mneme: state.resources.mneme + totalAdded,
        totalMneme: state.resources.totalMneme + totalAdded
      }
    };
  };
}
