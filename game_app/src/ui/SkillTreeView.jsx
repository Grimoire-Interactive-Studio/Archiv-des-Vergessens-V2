import { useState } from 'preact/hooks';
import { SKILL_TREE_NODES } from '../state/skillTreeData';
import { formatNumber } from '../engine/math';
import store from '../state/store';
import { unlockSkillNode, respecSkillTree } from '../state/actions';

export function SkillTreeView({ player, mneme }) {
  const [selectedNodeId, setSelectedNodeId] = useState('root');
  const unlockedNodes = Array.isArray(player.unlockedNodes) ? player.unlockedNodes : ['root'];
  const skillPoints = player.skillPoints || 0;

  const handleUnlock = (nodeId) => {
    store.dispatch(unlockSkillNode(nodeId), `unlockSkillNode/${nodeId}`);
  };

  const handleRespec = () => {
    const spentPoints = unlockedNodes.filter((id) => id !== 'root').length;
    const cost = Math.floor(100 * Math.pow(1.5, spentPoints));
    if (window.confirm(`Möchtest du den Talentbaum wirklich zurücksetzen?\nAlle ${spentPoints} Skillpunkte werden zurückerstattet.\nKosten: ${formatNumber(cost)} Mneme.`)) {
      store.dispatch(respecSkillTree(), 'respecSkillTree');
    }
  };

  // Center offset for graph (0,0 maps to center 400, 320 in SVG viewBox 0 0 800 640)
  const centerX = 400;
  const centerY = 320;

  const selectedNode = SKILL_TREE_NODES[selectedNodeId] || SKILL_TREE_NODES['root'];

  // All unique connection lines
  const lines = [];
  const processedPairs = new Set();

  Object.values(SKILL_TREE_NODES).forEach((node) => {
    node.connections.forEach((targetId) => {
      const targetNode = SKILL_TREE_NODES[targetId];
      if (!targetNode) return;

      const pairKey = [node.id, targetId].sort().join('--');
      if (processedPairs.has(pairKey)) return;
      processedPairs.add(pairKey);

      const isBothUnlocked = unlockedNodes.includes(node.id) && unlockedNodes.includes(targetId);
      lines.push({
        id: pairKey,
        x1: centerX + node.x,
        y1: centerY + node.y,
        x2: centerX + targetNode.x,
        y2: centerY + targetNode.y,
        isUnlocked: isBothUnlocked
      });
    });
  });

  return (
    <div className="skill-tree-container">
      <div className="skill-tree-header-bar">
        <div className="skill-points-info">
          <span className="info-label">Verfügbare Skillpunkte:</span>
          <span className={`skill-points-badge ${skillPoints > 0 ? 'pulse-badge' : ''}`}>
            {skillPoints} {skillPoints === 1 ? 'Punkt' : 'Punkte'}
          </span>
        </div>

        <button
          className="btn-respec"
          disabled={unlockedNodes.length <= 1}
          onClick={handleRespec}
        >
          🔄 Talentbaum Zurücksetzen (Respec)
        </button>
      </div>

      {/* Visueller Knoten-Graph (SVG) */}
      <div className="skill-tree-graph-wrapper">
        <svg className="skill-tree-svg" viewBox="0 0 800 640" preserveAspectRatio="xMidYMid meet">
          {/* Grid Background Lines */}
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4cc9f0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4cc9f0" stopOpacity="0" />
            </radialGradient>
            <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="keystoneGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Glowing Hub Background Circle */}
          <circle cx={centerX} cy={centerY} r="180" fill="url(#hubGlow)" />

          {/* Connection Lines */}
          {lines.map((line) => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className={`tree-connector ${line.isUnlocked ? 'active' : ''}`}
            />
          ))}

          {/* Nodes */}
          {Object.values(SKILL_TREE_NODES).map((node) => {
            const isUnlocked = unlockedNodes.includes(node.id);
            const isConnected = node.connections.some((connId) => unlockedNodes.includes(connId));
            const isAvailable = !isUnlocked && (isConnected || node.type === 'start') && skillPoints > 0;
            const isSelected = selectedNodeId === node.id;

            const cx = centerX + node.x;
            const cy = centerY + node.y;

            let radius = 22;
            if (node.type === 'notable') radius = 28;
            if (node.type === 'keystone') radius = 34;
            if (node.type === 'start') radius = 30;

            let classNames = `tree-node node-type-${node.type}`;
            if (isUnlocked) classNames += ' unlocked';
            if (isAvailable) classNames += ' available';
            if (isSelected) classNames += ' selected';

            return (
              <g
                key={node.id}
                className={classNames}
                transform={`translate(${cx}, ${cy})`}
                onClick={() => setSelectedNodeId(node.id)}
              >
                {/* Node Outer Ring / Glow */}
                <circle
                  r={radius + 4}
                  className="node-outer-ring"
                  filter={node.type === 'keystone' && isUnlocked ? 'url(#keystoneGlow)' : (isUnlocked ? 'url(#goldGlow)' : '')}
                />
                
                {/* Node Main Circle */}
                <circle r={radius} className="node-body" />

                {/* Node Icon */}
                <text
                  x="0"
                  y="6"
                  textAnchor="middle"
                  className="node-icon-text"
                  style={{ fontSize: node.type === 'keystone' ? '20px' : '16px' }}
                >
                  {node.icon}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Card / Inspector */}
        <div className="node-inspector-card">
          <div className="inspector-header">
            <span className="inspector-icon">{selectedNode.icon}</span>
            <div className="inspector-title">
              <h4>{selectedNode.name}</h4>
              <span className={`node-type-badge type-${selectedNode.type}`}>
                {selectedNode.type.toUpperCase()}
              </span>
            </div>
          </div>

          <p className="inspector-desc">{selectedNode.description}</p>

          <div className="inspector-status">
            {unlockedNodes.includes(selectedNode.id) ? (
              <div className="status-tag unlocked">✓ Bereits freigeschaltet</div>
            ) : (
              (() => {
                const isConnected = selectedNode.connections.some((id) => unlockedNodes.includes(id));
                if (!isConnected && selectedNode.type !== 'start') {
                  return <div className="status-tag locked">🔒 Nachbarknoten wird benötigt</div>;
                }
                if (skillPoints <= 0) {
                  return <div className="status-tag no-points">⚠️ 1 Skillpunkt wird benötigt</div>;
                }
                return (
                  <button
                    className="btn-unlock-node"
                    onClick={() => handleUnlock(selectedNode.id)}
                  >
                    ✦ Knoten Freischalten (1 Skillpunkt)
                  </button>
                );
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillTreeView;
