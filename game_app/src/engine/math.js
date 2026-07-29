/**
 * Pure Mathematical Helper Functions for Idle & Incremental Mechanics.
 */

/**
 * Berechnet die Kosten für die nächste Generator-Stufe.
 * Formel: Kosten = floor(BasisKosten * (1.15 ^ AktuelleStufe))
 */
export function calculateBuildingCost(baseCost, level, costMultiplier = 1.15) {
  const safeBase = Math.max(0, Number(baseCost) || 0);
  const safeLevel = Math.max(0, Number(level) || 0);
  const safeMult = Math.max(1.0, Number(costMultiplier) || 1.15);
  
  return Math.floor(safeBase * Math.pow(safeMult, safeLevel));
}

/**
 * Berechnet den Meilenstein-Multiplikator (Verdopplung alle 25 Stufen).
 */
export function calculateMilestoneMultiplier(level) {
  const safeLevel = Math.max(0, Number(level) || 0);
  const milestones = Math.floor(safeLevel / 25);
  return Math.pow(2, milestones);
}

/**
 * Berechnet den Ertrag pro Sekunde für einen Generator.
 * Formel: Yield = BasisErtrag * Level * MeilensteinMultiplikator
 */
export function calculateGeneratorYield(baseYield, level) {
  const safeBase = Math.max(0, Number(baseYield) || 0);
  const safeLevel = Math.max(0, Number(level) || 0);
  const milestoneMult = calculateMilestoneMultiplier(safeLevel);
  
  return safeBase * safeLevel * milestoneMult;
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
 * Berechnet die Gesamtkosten für den Kauf mehrerer Stufen auf einmal.
 * Geometrische Reihe: Cost = Base * (Mult^Level) * (Mult^Count - 1) / (Mult - 1)
 */
export function calculateBulkCost(baseCost, currentLevel, costMultiplier = 1.15, count = 1) {
  const safeCount = Math.max(1, Math.floor(Number(count) || 1));
  if (safeCount === 1) {
    return calculateBuildingCost(baseCost, currentLevel, costMultiplier);
  }

  const safeBase = Math.max(0, Number(baseCost) || 0);
  const safeLevel = Math.max(0, Number(currentLevel) || 0);
  const safeMult = Math.max(1.0001, Number(costMultiplier) || 1.15);

  const firstCost = safeBase * Math.pow(safeMult, safeLevel);
  const totalCost = firstCost * (Math.pow(safeMult, safeCount) - 1) / (safeMult - 1);
  return Math.floor(totalCost);
}

/**
 * Berechnet wie viele Stufen eines Generators mit den verfügbaren Ressourcen maximal gekauft werden können.
 */
export function calculateMaxAffordable(baseCost, currentLevel, costMultiplier = 1.15, availableResources = 0) {
  const safeResources = Math.max(0, Number(availableResources) || 0);
  const safeBase = Math.max(0, Number(baseCost) || 0);
  const safeLevel = Math.max(0, Number(currentLevel) || 0);
  const safeMult = Math.max(1.0001, Number(costMultiplier) || 1.15);

  const firstCost = safeBase * Math.pow(safeMult, safeLevel);
  if (safeResources < firstCost) {
    return { count: 0, cost: 0 };
  }

  // N = log( (Resources * (Mult - 1) / FirstCost) + 1 ) / log(Mult)
  const maxCount = Math.floor(
    Math.log((safeResources * (safeMult - 1) / firstCost) + 1) / Math.log(safeMult)
  );

  const safeCount = Math.max(1, maxCount);
  const cost = calculateBulkCost(baseCost, safeLevel, safeMult, safeCount);
  return { count: safeCount, cost };
}

/**
 * Formatiert große Zahlen lesbar (z.B. 1.25M, 3.40B, 12.5T)
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

