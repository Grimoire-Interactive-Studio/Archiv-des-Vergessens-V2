import { SKILL_TREE_NODES } from '../skillTreeData.js';

/**
 * Schaltet einen Skill-Tree-Knoten frei.
 * @param {string} nodeId - ID des Knotens
 */
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

/**
 * Setzt den Skill-Tree zurück (Respec).
 */
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
