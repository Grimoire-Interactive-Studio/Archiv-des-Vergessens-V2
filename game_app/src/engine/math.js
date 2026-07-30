import { SKILL_TREE_NODES } from '../state/skillTreeData.js';

/**
 * Pure Mathematical Helper Functions for Idle & Incremental Mechanics.
 */

/**
 * Berechnet die benötigten EXP für die nächste Stufe.
 * Formel: expToNext = Math.floor(100 * (1.15 ^ (level - 1)))
 */
export function calculateExpToNext(level) {
  const safeLvl = Math.max(1, Math.floor(Number(level) || 1));
  return Math.floor(100 * Math.pow(1.15, safeLvl - 1));
}

/**
 * Sammelt und summiert alle Boni aus freigeschalteten Skilltree-Knoten und Attributen.
 */
export function calculateAggregatePlayerStats(playerState = {}) {
  const stats = {
    generatorYieldPct: 0,
    clickYieldPct: 0,
    critChancePct: 0,
    critDamagePct: 150, // Base Crit Damage 150%
    buildingCostDiscountPct: 0,
    expBoostPct: 0,
    doubleMilestoneBonus: false,
    superCritEnabled: false,
    levelUpBurstSeconds: 0
  };

  if (!playerState) return stats;

  // 1. Attributs-Boni hinzurechnen
  const attrs = playerState.attributes || {};
  const focus = Math.max(0, Number(attrs.focus) || 0);
  const knowledge = Math.max(0, Number(attrs.knowledge) || 0);
  const willpower = Math.max(0, Number(attrs.willpower) || 0);

  stats.clickYieldPct += focus * 2;
  stats.critChancePct += focus * 0.5;

  stats.generatorYieldPct += knowledge * 1.5;

  stats.buildingCostDiscountPct += willpower * 0.8;
  stats.expBoostPct += willpower * 1.0;

  // 2. Skill-Tree Knoten Boni hinzurechnen
  const unlocked = Array.isArray(playerState.unlockedNodes) ? playerState.unlockedNodes : ['root'];
  for (const nodeId of unlocked) {
    const node = SKILL_TREE_NODES[nodeId];
    if (node && node.stats) {
      if (node.stats.generatorYieldPct) stats.generatorYieldPct += node.stats.generatorYieldPct;
      if (node.stats.clickYieldPct) stats.clickYieldPct += node.stats.clickYieldPct;
      if (node.stats.critChancePct) stats.critChancePct += node.stats.critChancePct;
      if (node.stats.critDamagePct) stats.critDamagePct += node.stats.critDamagePct;
      if (node.stats.buildingCostDiscountPct) stats.buildingCostDiscountPct += node.stats.buildingCostDiscountPct;
      if (node.stats.expBoostPct) stats.expBoostPct += node.stats.expBoostPct;
      if (node.stats.doubleMilestoneBonus) stats.doubleMilestoneBonus = true;
      if (node.stats.superCritEnabled) stats.superCritEnabled = true;
      if (node.stats.levelUpBurstSeconds) stats.levelUpBurstSeconds += node.stats.levelUpBurstSeconds;
    }
  }

  // Max Rabatt Deckelung auf 75%
  stats.buildingCostDiscountPct = Math.min(75, stats.buildingCostDiscountPct);

  return stats;
}

/**
 * Berechnet den Meilenstein-Multiplikator (Verdopplung oder Vervierfachung alle 25 Stufen).
 */
export function calculateMilestoneMultiplier(level, doubleMilestone = false) {
  const safeLevel = Math.max(0, Number(level) || 0);
  const milestones = Math.floor(safeLevel / 25);
  const baseMult = doubleMilestone ? 4 : 2;
  return Math.pow(baseMult, milestones);
}

/**
 * Berechnet den Ertrag pro Sekunde für einen Generator unter Berücksichtigung von Boni.
 */
export function calculateGeneratorYield(baseYield, level, stats = {}) {
  const safeBase = Math.max(0, Number(baseYield) || 0);
  const safeLevel = Math.max(0, Number(level) || 0);
  const milestoneMult = calculateMilestoneMultiplier(safeLevel, stats.doubleMilestoneBonus);
  
  const rawYield = safeBase * safeLevel * milestoneMult;
  const bonusMult = 1 + (stats.generatorYieldPct || 0) / 100;
  
  return rawYield * bonusMult;
}

/**
 * Berechnet den Gesamtertrag pro Sekunde aller Generatoren im State.
 */
export function calculateTotalGeneratorYield(generators = {}, stats = {}) {
  let totalYield = 0;
  if (!generators) return 0;
  for (const key in generators) {
    const gen = generators[key];
    if (gen && gen.level > 0) {
      totalYield += calculateGeneratorYield(gen.baseYield, gen.level, stats);
    }
  }
  return totalYield;
}

/**
 * Berechnet die Rabatt-Kosten für ein Gebäude.
 */
export function calculateBuildingCost(baseCost, level, costMultiplier = 1.15, discountPct = 0) {
  const safeBase = Math.max(0, Number(baseCost) || 0);
  const safeLevel = Math.max(0, Number(level) || 0);
  const safeMult = Math.max(1.0, Number(costMultiplier) || 1.15);
  
  const rawCost = safeBase * Math.pow(safeMult, safeLevel);
  const discountMult = Math.max(0.25, 1 - (discountPct || 0) / 100);
  
  return Math.floor(rawCost * discountMult);
}

/**
 * Berechnet die Gesamtkosten für den Bulk-Kauf mehrerer Stufen mit Rabatt.
 */
export function calculateBulkCost(baseCost, currentLevel, costMultiplier = 1.15, count = 1, discountPct = 0) {
  const safeCount = Math.max(1, Math.floor(Number(count) || 1));
  if (safeCount === 1) {
    return calculateBuildingCost(baseCost, currentLevel, costMultiplier, discountPct);
  }

  const safeBase = Math.max(0, Number(baseCost) || 0);
  const safeLevel = Math.max(0, Number(currentLevel) || 0);
  const safeMult = Math.max(1.0001, Number(costMultiplier) || 1.15);

  const firstCost = safeBase * Math.pow(safeMult, safeLevel);
  const rawTotalCost = firstCost * (Math.pow(safeMult, safeCount) - 1) / (safeMult - 1);
  const discountMult = Math.max(0.25, 1 - (discountPct || 0) / 100);

  return Math.floor(rawTotalCost * discountMult);
}

/**
 * Berechnet wie viele Stufen leistbar sind mit Rabatt.
 */
export function calculateMaxAffordable(baseCost, currentLevel, costMultiplier = 1.15, availableResources = 0, discountPct = 0) {
  const safeResources = Math.max(0, Number(availableResources) || 0);
  const safeBase = Math.max(0, Number(baseCost) || 0);
  const safeLevel = Math.max(0, Number(currentLevel) || 0);
  const safeMult = Math.max(1.0001, Number(costMultiplier) || 1.15);

  const discountMult = Math.max(0.25, 1 - (discountPct || 0) / 100);
  const firstCost = safeBase * Math.pow(safeMult, safeLevel) * discountMult;

  if (safeResources < firstCost) {
    return { count: 0, cost: 0 };
  }

  const effectiveResources = safeResources / discountMult;
  const rawFirstCost = safeBase * Math.pow(safeMult, safeLevel);

  const maxCount = Math.floor(
    Math.log((effectiveResources * (safeMult - 1) / rawFirstCost) + 1) / Math.log(safeMult)
  );

  const safeCount = Math.max(1, maxCount);
  const cost = calculateBulkCost(baseCost, safeLevel, safeMult, safeCount, discountPct);
  return { count: safeCount, cost };
}

/**
 * Berechnet den Ertrag eines Klicks inkl. Krits & Super-Krits.
 */
export function calculateClickYield(baseAmount = 1, stats = {}) {
  const bonusMult = 1 + (stats.clickYieldPct || 0) / 100;
  let amount = baseAmount * bonusMult;

  const roll = Math.random() * 100;
  let isCrit = false;
  let isSuperCrit = false;

  if (roll < (stats.critChancePct || 0)) {
    isCrit = true;
    if (stats.superCritEnabled && Math.random() < 0.25) {
      isSuperCrit = true;
      amount *= (stats.critDamagePct / 100) * 3; // Super Crit 3x normal crit
    } else {
      amount *= (stats.critDamagePct / 100);
    }
  }

  return {
    yield: Math.max(1, Math.floor(amount)),
    isCrit,
    isSuperCrit
  };
}

/**
 * Berechnet die Offline-Progression basierend auf vergangener Zeit.
 */
export function calculateOfflineProgress(lastSaveTimestamp, currentTimestamp, yieldPerSecond, maxOfflineHours = 12) {
  const last = Number(lastSaveTimestamp) || 0;
  const now = Number(currentTimestamp) || 0;
  const safeYield = Math.max(0, Number(yieldPerSecond) || 0);
  
  if (last <= 0 || now <= last) {
    return { elapsedSeconds: 0, totalYield: 0 };
  }
  
  const elapsedSeconds = Math.floor((now - last) / 1000);
  const maxSeconds = maxOfflineHours * 3600;
  const clampedSeconds = Math.min(elapsedSeconds, maxSeconds);
  const totalYield = Math.floor(clampedSeconds * safeYield);
  
  return { elapsedSeconds, clampedSeconds, totalYield };
}

/**
 * Formatiert große Zahlen lesbar.
 */
export function formatNumber(num) {
  const val = Number(num) || 0;
  if (val < 100000) {
    return Math.floor(val).toLocaleString();
  }

  const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  const i = Math.floor(Math.log10(val) / 3);
  
  if (i < units.length) {
    const formatted = (val / Math.pow(10, i * 3)).toFixed(2);
    return `${formatted} ${units[i]}`;
  }

  return val.toExponential(2);
}
