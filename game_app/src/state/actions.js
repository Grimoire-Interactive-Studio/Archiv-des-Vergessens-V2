import { calculateBuildingCost, calculateBulkCost, calculateMaxAffordable } from '../engine/math.js';
import { INITIAL_STATE } from './store.js';

export function addMneme(amount) {
  const safeAmount = Math.max(0, Number(amount) || 0);
  return (state) => {
    if (safeAmount <= 0) return state;
    return {
      ...state,
      resources: {
        ...state.resources,
        mneme: state.resources.mneme + safeAmount,
        totalMneme: state.resources.totalMneme + safeAmount
      }
    };
  };
}

export function buyGenerator(genKey, count = 1) {
  return (state) => {
    const gen = state.generators[genKey];
    if (!gen) return state;

    let targetCount = 1;
    let cost = 0;

    if (count === 'max') {
      const maxInfo = calculateMaxAffordable(gen.baseCost, gen.level, gen.costMult, state.resources.mneme);
      targetCount = maxInfo.count;
      cost = maxInfo.cost;
    } else {
      targetCount = Math.max(1, Math.floor(Number(count) || 1));
      cost = calculateBulkCost(gen.baseCost, gen.level, gen.costMult, targetCount);
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
    let totalYield = 0;
    for (const key in state.generators) {
      const gen = state.generators[key];
      if (gen.level > 0) {
        const milestones = Math.pow(2, Math.floor(gen.level / 25));
        totalYield += gen.baseYield * gen.level * milestones * dtSeconds;
      }
    }

    if (totalYield <= 0) return state;

    return {
      ...state,
      resources: {
        ...state.resources,
        mneme: state.resources.mneme + totalYield,
        totalMneme: state.resources.totalMneme + totalYield
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
