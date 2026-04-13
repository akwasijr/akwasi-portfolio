import { useRef, useEffect } from 'react';

export default function Starfield({ count = 60, color = 'rgba(255,255,255,0.5)' }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h;
    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars with drift + twinkle + pulse
    const stars = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.5 + 0.5,
      twinkleSpeed: Math.random() * 0.8 + 0.3,
      twinkleOffset: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.003,
      driftY: (Math.random() - 0.5) * 0.002,
      pulseSpeed: Math.random() * 0.4 + 0.1,
      pulseOffset: Math.random() * Math.PI * 2,
      type: Math.random(),
    }));

    // Shooting stars
    const shooters = [];
    const spawnShooter = () => ({
      x: Math.random() * 0.6 + 0.2,
      y: Math.random() * 0.3,
      vx: (Math.random() * 0.4 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
      vy: Math.random() * 0.2 + 0.15,
      life: 1,
      decay: Math.random() * 0.008 + 0.006,
      length: Math.random() * 60 + 40,
    });

    let lastShooterTime = 0;

    const draw = (time) => {
      ctx.clearRect(0, 0, w, h);
      const t = time * 0.001;

      // Draw stars
      stars.forEach((star) => {
        // Drift position slowly
        star.x += star.driftX * 0.016;
        star.y += star.driftY * 0.016;
        if (star.x > 1.05) star.x = -0.05;
        if (star.x < -0.05) star.x = 1.05;
        if (star.y > 1.05) star.y = -0.05;
        if (star.y < -0.05) star.y = 1.05;

        const alpha = 0.15 + 0.6 * (0.5 + 0.5 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset));
        const pulse = 1 + 0.3 * Math.sin(t * star.pulseSpeed + star.pulseOffset);
        const x = star.x * w;
        const y = star.y * h;
        const s = star.size * pulse;

        ctx.globalAlpha = alpha;

        if (star.type < 0.35) {
          ctx.beginPath();
          ctx.arc(x, y, s * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        } else if (star.type < 0.7) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(x - s, y);
          ctx.lineTo(x + s, y);
          ctx.moveTo(x, y - s);
          ctx.lineTo(x, y + s);
          ctx.stroke();
        } else {
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.6;
          const len = s * 1.5;
          const short = s * 0.6;
          ctx.beginPath();
          ctx.moveTo(x - len, y);
          ctx.lineTo(x + len, y);
          ctx.moveTo(x, y - len);
          ctx.lineTo(x, y + len);
          ctx.moveTo(x - short, y - short);
          ctx.lineTo(x + short, y + short);
          ctx.moveTo(x + short, y - short);
          ctx.lineTo(x - short, y + short);
          ctx.stroke();
        }
      });

      // Spawn shooting stars occasionally
      if (time - lastShooterTime > 3000 + Math.random() * 5000) {
        shooters.push(spawnShooter());
        lastShooterTime = time;
        if (shooters.length > 3) shooters.shift();
      }

      // Draw shooting stars
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        s.x += s.vx * 0.016;
        s.y += s.vy * 0.016;
        s.life -= s.decay;

        if (s.life <= 0) { shooters.splice(i, 1); continue; }

        const sx = s.x * w;
        const sy = s.y * h;
        const angle = Math.atan2(s.vy, s.vx);
        const tailX = sx - Math.cos(angle) * s.length * s.life;
        const tailY = sy - Math.sin(angle) * s.length * s.life;

        const grad = ctx.createLinearGradient(tailX, tailY, sx, sy);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, 'rgba(255,255,255,' + (s.life * 0.7) + ')');

        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        // Head glow
        ctx.globalAlpha = s.life * 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }

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
