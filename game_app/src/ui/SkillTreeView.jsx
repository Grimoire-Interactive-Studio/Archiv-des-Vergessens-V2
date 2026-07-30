import { useState, useMemo, useRef, useEffect } from 'preact/hooks';
import { SKILL_TREE_NODES } from '../state/skillTreeData';
import store from '../state/store';
import { unlockSkillNode, respecSkillTree } from '../state/actions';
import { ConfirmRespecModal } from './ConfirmRespecModal';

export function SkillTreeView({ player, mneme }) {
  const [selectedNodeId, setSelectedNodeId] = useState('root');
  const [isRespecModalOpen, setIsRespecModalOpen] = useState(false);
  const unlockedNodes = Array.isArray(player.unlockedNodes) ? player.unlockedNodes : ['root'];
  const skillPoints = player.skillPoints || 0;

  const spentPoints = unlockedNodes.filter((id) => id !== 'root').length;
  const respecCost = Math.floor(100 * Math.pow(1.5, spentPoints));

  // Zoom & Pan state
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 30 });
  const [isDraggingState, setIsDraggingState] = useState(false);

  const svgRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startPanRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const touchStateRef = useRef({ initialDist: 0, initialZoom: 1 });

  const handleUnlock = (nodeId) => {
    store.dispatch(unlockSkillNode(nodeId), `unlockSkillNode/${nodeId}`);
  };

  const handleConfirmRespec = () => {
    store.dispatch(respecSkillTree(), 'respecSkillTree');
    setIsRespecModalOpen(false);
  };

  // Center offset for SVG viewBox (0,0 maps to center 400, 320 in SVG viewBox 0 0 800 640)
  const centerX = 400;
  const centerY = 320;

  const selectedNode = SKILL_TREE_NODES[selectedNodeId] || SKILL_TREE_NODES['root'];

  // All unique connection lines (memoized)
  const unlockedNodesKey = unlockedNodes.join(',');
  const lines = useMemo(() => {
    const result = [];
    const processedPairs = new Set();
    const unlockedSet = new Set(unlockedNodes);

    Object.values(SKILL_TREE_NODES).forEach((node) => {
      node.connections.forEach((targetId) => {
        const targetNode = SKILL_TREE_NODES[targetId];
        if (!targetNode) return;

        const pairKey = [node.id, targetId].sort().join('--');
        if (processedPairs.has(pairKey)) return;
        processedPairs.add(pairKey);

        const isBothUnlocked = unlockedSet.has(node.id) && unlockedSet.has(targetId);
        result.push({
          id: pairKey,
          x1: node.x,
          y1: node.y,
          x2: targetNode.x,
          y2: targetNode.y,
          isUnlocked: isBothUnlocked
        });
      });
    });
    return result;
  }, [unlockedNodesKey]);

  // Zoom on Mouse Wheel (Zoom towards cursor position)
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const handleWheel = (e) => {
      e.preventDefault();

      const rect = svgEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const mouseX = ((e.clientX - rect.left) / rect.width) * 800;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 640;

      const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;

      setZoom((prevZoom) => {
        const newZoom = Math.min(Math.max(prevZoom * zoomFactor, 0.35), 3.0);
        if (newZoom === prevZoom) return prevZoom;

        setPan((prevPan) => {
          const scaleRatio = newZoom / prevZoom;
          const newPanX = mouseX - centerX - scaleRatio * (mouseX - centerX - prevPan.x);
          const newPanY = mouseY - centerY - scaleRatio * (mouseY - centerY - prevPan.y);
          return { x: newPanX, y: newPanY };
        });

        return newZoom;
      });
    };

    svgEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      svgEl.removeEventListener('wheel', handleWheel);
    };
  }, [centerX, centerY]);

  // Drag & Drop Pan handling
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;

    isDraggingRef.current = true;
    setIsDraggingState(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startPanRef.current = { ...pan };
    hasDraggedRef.current = false;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;

      if (Math.hypot(dx, dy) > 4) {
        hasDraggedRef.current = true;
      }

      const svgEl = svgRef.current;
      if (!svgEl) return;
      const rect = svgEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const svgDx = (dx / rect.width) * 800;
      const svgDy = (dy / rect.height) * 640;

      setPan({
        x: startPanRef.current.x + svgDx,
        y: startPanRef.current.y + svgDy
      });
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDraggingState(false);
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 50);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Touch handling for mobile / touch screens
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        setIsDraggingState(true);
        startPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        startPanRef.current = { ...pan };
        hasDraggedRef.current = false;
      } else if (e.touches.length === 2) {
        isDraggingRef.current = false;
        setIsDraggingState(false);
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        touchStateRef.current = {
          initialDist: dist,
          initialZoom: zoom
        };
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        e.preventDefault();
        const dx = e.touches[0].clientX - startPosRef.current.x;
        const dy = e.touches[0].clientY - startPosRef.current.y;
        if (Math.hypot(dx, dy) > 4) hasDraggedRef.current = true;

        const rect = svgEl.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const svgDx = (dx / rect.width) * 800;
        const svgDy = (dy / rect.height) * 640;

        setPan({
          x: startPanRef.current.x + svgDx,
          y: startPanRef.current.y + svgDy
        });
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (touchStateRef.current.initialDist > 0) {
          const factor = dist / touchStateRef.current.initialDist;
          const newZoom = Math.min(Math.max(touchStateRef.current.initialZoom * factor, 0.35), 3.0);
          setZoom(newZoom);
        }
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      setIsDraggingState(false);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    };

    svgEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    svgEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    svgEl.addEventListener('touchend', handleTouchEnd);
    svgEl.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      svgEl.removeEventListener('touchstart', handleTouchStart);
      svgEl.removeEventListener('touchmove', handleTouchMove);
      svgEl.removeEventListener('touchend', handleTouchEnd);
      svgEl.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [pan, zoom]);

  const handleResetView = () => {
    setZoom(0.85);
    setPan({ x: 0, y: 30 });
  };

  const handleNodeClick = (nodeId, e) => {
    if (e) e.stopPropagation();
    if (hasDraggedRef.current) return;
    setSelectedNodeId(nodeId);
  };

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
          onClick={() => setIsRespecModalOpen(true)}
        >
          🔄 Talentbaum Zurücksetzen (Respec)
        </button>
      </div>

      {/* Visueller Knoten-Graph (SVG) */}
      <div className="skill-tree-graph-wrapper">
        {/* Navigation Hint Overlay */}
        <div className="skill-tree-hint">
          <span>💡 <strong>Mausrad:</strong> Zoomen • <strong>Ziehen:</strong> Verschieben</span>
        </div>

        {/* Map Controls Overlay */}
        <div className="skill-tree-controls">
          <button
            className="control-btn"
            title="Hineinzoomen"
            onClick={() => setZoom((z) => Math.min(z * 1.2, 3.0))}
          >
            ➕
          </button>
          <button
            className="control-btn zoom-level-badge"
            title="Klicken zum Zurücksetzen"
            onClick={handleResetView}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            className="control-btn"
            title="Herauszoomen"
            onClick={() => setZoom((z) => Math.max(z / 1.2, 0.35))}
          >
            ➖
          </button>
          <button
            className="control-btn btn-recenter"
            title="Ansicht zentrieren"
            onClick={handleResetView}
          >
            🎯 Zentrieren
          </button>
        </div>

        <svg
          ref={svgRef}
          className={`skill-tree-svg ${isDraggingState ? 'is-dragging' : ''}`}
          viewBox="0 0 800 640"
          preserveAspectRatio="xMidYMid meet"
          onMouseDown={handleMouseDown}
        >
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

          {/* Interactive Viewport Group */}
          <g transform={`translate(${centerX + pan.x}, ${centerY + pan.y}) scale(${zoom})`}>
            {/* Glowing Hub Background Circle */}
            <circle cx={0} cy={0} r="180" fill="url(#hubGlow)" />

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
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => handleNodeClick(node.id, e)}
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
          </g>
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

      <ConfirmRespecModal
        isOpen={isRespecModalOpen}
        spentPoints={spentPoints}
        cost={respecCost}
        onConfirm={handleConfirmRespec}
        onCancel={() => setIsRespecModalOpen(false)}
      />
    </div>
  );
}

export default SkillTreeView;
