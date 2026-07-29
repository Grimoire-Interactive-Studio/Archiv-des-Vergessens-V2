import { useEffect } from 'preact/hooks';

export function FloatingTextOverlay({ floats, onRemove }) {
  useEffect(() => {
    if (floats.length === 0) return;

    const timer = setTimeout(() => {
      const now = Date.now();
      const expiredIds = floats.filter(f => now - f.createdAt >= 1000).map(f => f.id);
      if (expiredIds.length > 0) {
        onRemove(expiredIds);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [floats, onRemove]);

  return (
    <div className="floating-text-container">
      {floats.map((item) => (
        <div
          key={item.id}
          className="floating-text-item"
          style={{
            transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
            color: item.color || '#e2b042'
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}

export default FloatingTextOverlay;
