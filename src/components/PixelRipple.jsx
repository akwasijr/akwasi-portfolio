import { useEffect, useState, useCallback } from 'react';

const PIXEL_SIZE = 20;
const DURATION = 500;

// Pre-defined grid positions that don't overlap (snapped to 20px grid)
const POSITIONS = [
  { dx: 0, dy: -40 },   // top
  { dx: 40, dy: -20 },  // top-right
  { dx: 40, dy: 20 },   // right
  { dx: 20, dy: 40 },   // bottom-right
  { dx: -20, dy: 40 },  // bottom
  { dx: -40, dy: 20 },  // bottom-left
  { dx: -40, dy: -20 }, // left
  { dx: -20, dy: -40 }, // top-left
];

function Ripple({ x, y, id, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(id), DURATION);
    return () => clearTimeout(t);
  }, [id, onDone]);

  return (
    <div style={{ position: 'fixed', left: x - PIXEL_SIZE / 2, top: y - PIXEL_SIZE / 2, pointerEvents: 'none', zIndex: 99998 }}>
      {POSITIONS.map((p, i) => (
        <div
          key={i}
          className={`pixel-ripple__dot ${i % 2 === 0 ? 'pixel-ripple__dot--filled' : 'pixel-ripple__dot--outline'}`}
          style={{
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            animationDelay: `${i * 20}ms`,
          }}
        />
      ))}
    </div>
  );
}

export default function PixelRipple() {
  const [ripples, setRipples] = useState([]);

  const handleDone = useCallback((id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  useEffect(() => {
    let idCounter = 0;
    const handleClick = (e) => {
      // Skip if clicking a link, button, or interactive element
      const tag = e.target.closest('a, button, [role="button"], input, textarea, select, .fan-card, .blog-card');
      if (tag) return;

      idCounter++;
      setRipples((prev) => [...prev, { id: idCounter, x: e.clientX, y: e.clientY }]);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {ripples.map((r) => (
        <Ripple key={r.id} {...r} onDone={handleDone} />
      ))}
    </>
  );
}
