import { useRef, useEffect } from 'react';

export default function Starfield({ count = 60, color = 'rgba(255,255,255,0.5)' }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate stars with varied sizes and twinkle speeds
    const stars = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.5 + 0.5,
      twinkleSpeed: Math.random() * 0.8 + 0.3,
      twinkleOffset: Math.random() * Math.PI * 2,
      type: Math.random(), // 0-0.3 = dot, 0.3-0.7 = cross, 0.7-1 = sparkle
    }));

    const draw = (time) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      stars.forEach((star) => {
        const t = time * 0.001;
        const alpha = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset));
        const x = star.x * w;
        const y = star.y * h;
        const s = star.size;

        ctx.globalAlpha = alpha;

        if (star.type < 0.35) {
          // Simple dot
          ctx.beginPath();
          ctx.arc(x, y, s * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        } else if (star.type < 0.7) {
          // Cross / plus shape
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(x - s, y);
          ctx.lineTo(x + s, y);
          ctx.moveTo(x, y - s);
          ctx.lineTo(x, y + s);
          ctx.stroke();
        } else {
          // 4-point sparkle
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.6;
          const len = s * 1.5;
          const short = s * 0.6;
          ctx.beginPath();
          ctx.moveTo(x - len, y);
          ctx.lineTo(x + len, y);
          ctx.moveTo(x, y - len);
          ctx.lineTo(x, y + len);
          // diagonal arms (shorter)
          ctx.moveTo(x - short, y - short);
          ctx.lineTo(x + short, y + short);
          ctx.moveTo(x + short, y - short);
          ctx.lineTo(x - short, y + short);
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
