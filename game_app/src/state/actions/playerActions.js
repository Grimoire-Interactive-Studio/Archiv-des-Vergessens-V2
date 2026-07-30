import { calculateExpToNext, calculateAggregatePlayerStats } from '../../engine/math.js';

/**
 * Hilfsfunktion: Fügt EXP hinzu und verarbeitet Level-Ups.
 * @param {Object} playerState - Der aktuelle Spieler-State
 * @param {number} expGained - Die gewonnene EXP-Menge
 * @param {number} currentYieldPerSec - Aktuelle Mneme-Produktion pro Sekunde (für Burst-Berechnung)
 * @returns {{ updatedPlayer: Object, burstMnemeGained: number }}
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

/**
 * Weist einen Attributpunkt zu.
 * @param {string} attributeKey - 'focus', 'knowledge' oder 'willpower'
 */
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
