import { useEffect, useRef } from 'preact/hooks';

// Event-basierte Hilfsfunktion zum knotenfreien Erzeugen von Floating Texten ohne React-Re-Renders
export function spawnFloatingText(x, y, text, color = '#e2b042') {
  window.dispatchEvent(
    new CustomEvent('spawn-floating-text', {
      detail: { x, y, text, color }
    })
  );
}

export function FloatingTextOverlay({ active = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let floats = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    const handleSpawn = (e) => {
      if (!active) return;
      const { x, y, text, color } = e.detail;
      const startX = x + (Math.random() * 20 - 10);
      const startY = y + (Math.random() * 10 - 20);

      floats.push({
        x: startX,
        y: startY,
        text,
        color: color || '#e2b042',
        age: 0,
        maxAge: 45, // ~0.75 Sek. bei 60 FPS
        scale: 1.0,
        alpha: 1.0,
        vy: -1.4
      });

      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('spawn-floating-text', handleSpawn);

    const render = () => {
      // WICHTIG: Das gesamte Canvas-Buffer (canvas.width x canvas.height) löschen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (floats.length === 0) {
        animId = null;
        return; // Loop schläft automatisch bei 0 aktiven Texten
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.font = '700 18px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = floats.length - 1; i >= 0; i--) {
        const f = floats[i];
        f.age++;
        f.y += f.vy;

        const progress = f.age / f.maxAge;
        f.alpha = Math.max(0, 1 - Math.pow(progress, 2));
        f.scale = 1 + Math.sin(progress * Math.PI) * 0.18;

        ctx.save();
        ctx.globalAlpha = f.alpha;
        ctx.fillStyle = f.color;
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 8;

        ctx.translate(f.x, f.y);
        ctx.scale(f.scale, f.scale);
        ctx.fillText(f.text, 0, 0);

        ctx.restore();

        if (f.age >= f.maxAge) {
          floats.splice(i, 1);
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('spawn-floating-text', handleSpawn);
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, [active]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="floating-text-canvas" />;
}

export default FloatingTextOverlay;
