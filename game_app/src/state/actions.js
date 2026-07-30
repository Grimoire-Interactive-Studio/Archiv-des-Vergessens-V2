import {
  calculateBuildingCost,
  calculateBulkCost,
  calculateMaxAffordable,
  calculateExpToNext,
  calculateAggregatePlayerStats,
  calculateGeneratorYield,
  calculateTotalGeneratorYield,
  calculateClickYield
} from '../engine/math.js';
import { SKILL_TREE_NODES } from './skillTreeData.js';
import { INITIAL_STATE } from './store.js';

/**
 * Hilfsfunktion: Fügt EXP hinzu und verarbeitet Level-Ups.
 */
export function addExpToPlayer(playerState, expGained, currentYieldPerSec = 0) {
  let player = { ...playerState };
  let exp = player.exp + expGained;
  let level = player.level;
  let expToNext = player.expToNext || calculateExpToNext(level);
  let attributePoints = player.attributePoints || 0;
  let skillPoints = player.skillPoints || 0;
  let burstMnemeGained = 0;

  const stats = calculateAggregatePlayerStats(player);

  while (exp >= expToNext) {
    exp -= expToNext;
    level += 1;
    attributePoints += 1;
    skillPoints += 1;
    expToNext = calculateExpToNext(level);

    // Keystone: Zeitraffer-Matrize (Level Up Burst)
    if (stats.levelUpBurstSeconds > 0 && currentYieldPerSec > 0) {
      burstMnemeGained += currentYieldPerSec * stats.levelUpBurstSeconds;
    }
  }

  return {
    updatedPlayer: {
      ...player,
      level,
      exp,
      expToNext,
      attributePoints,
      skillPoints
    },
    burstMnemeGained
  };
}

export function addMneme(amount = 1) {
  const safeAmount = Number(amount);
  return (state) => {
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

export function allocateAttributePoint(attributeKey) {
  return (state) => {
    const player = state.player;
    if (!player || player.attributePoints <= 0) return state;
    if (!['focus', 'knowledge', 'willpower'].includes(attributeKey)) return state;

    return {
      ...state,
      player: {
        ...player,
        attributePoints: player.attributePoints - 1,
        attributes: {
          ...player.attributes,
          [attributeKey]: (player.attributes[attributeKey] || 0) + 1
        }
      }
    };
  };
}

export function unlockSkillNode(nodeId) {
  return (state) => {
    const player = state.player;
    if (!player || player.skillPoints <= 0) return state;

    const node = SKILL_TREE_NODES[nodeId];
    if (!node) return state;

    const unlocked = Array.isArray(player.unlockedNodes) ? player.unlockedNodes : ['root'];
    if (unlocked.includes(nodeId)) return state; // Bereit freigeschaltet

    // Prüfen ob Nachbarknoten bereits freigeschaltet ist
    const isConnected = node.connections.some((connId) => unlocked.includes(connId));
    if (!isConnected && node.type !== 'start') return state;

    return {
      ...state,
      player: {
        ...player,
        skillPoints: player.skillPoints - 1,
        unlockedNodes: [...unlocked, nodeId]
      }
    };
  };
}

export function respecSkillTree() {
  return (state) => {
    const player = state.player;
    const unlocked = Array.isArray(player.unlockedNodes) ? player.unlockedNodes : ['root'];
    
    // Wurzelknoten nicht mitzählen
    const spentPoints = Math.max(0, unlocked.filter((id) => id !== 'root').length);
    if (spentPoints === 0) return state;

    // Respec Kosten: Geringe Mneme Menge oder Relikte
    const respecCost = Math.floor(100 * Math.pow(1.5, spentPoints));
    const canAfford = state.resources.mneme >= respecCost;

    const remainingMneme = canAfford ? state.resources.mneme - respecCost : state.resources.mneme;

    return {
      ...state,
      resources: {
        ...state.resources,
        mneme: remainingMneme
      },
      player: {
        ...player,
        skillPoints: player.skillPoints + spentPoints,
        unlockedNodes: ['root']
      }
    };
  };
}

export function updateSetting(key, value) {
  return (state) => ({
    ...state,
    settings: {
      ...(state.settings || INITIAL_STATE.settings),
      [key]: value
    }
  });
}

export function updateLastSave(timestamp = Date.now()) {
  return (state) => ({
    ...state,
    system: {
      ...state.system,
      lastSave: timestamp
    }
  });
}

export function resetGame() {
  return () => JSON.parse(JSON.stringify({
    ...INITIAL_STATE,
    system: {
      ...INITIAL_STATE.system,
      lastSave: Date.now()
    }
  }));
}
