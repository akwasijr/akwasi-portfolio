import { useEffect, useRef } from 'react';

export default function ShootingStars() {
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

    const shooters = [];
    let lastSpawn = 0;

    const spawn = () => ({
      x: Math.random() * w * 0.6 + w * 0.2,
      y: Math.random() * h * 0.3,
      vx: (Math.random() * 0.4 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
      vy: Math.random() * 0.2 + 0.15,
      life: 1,
      decay: Math.random() * 0.006 + 0.004,
      length: Math.random() * 80 + 50,
    });

    const draw = (time) => {
      ctx.clearRect(0, 0, w, h);

      if (time - lastSpawn > 2500 + Math.random() * 4000) {
        shooters.push(spawn());
        lastSpawn = time;
        if (shooters.length > 4) shooters.shift();
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        s.x += s.vx * 16;
        s.y += s.vy * 16;
        s.life -= s.decay;

        if (s.life <= 0) { shooters.splice(i, 1); continue; }

        const angle = Math.atan2(s.vy, s.vx);
        const tailX = s.x - Math.cos(angle) * s.length * s.life;
        const tailY = s.y - Math.sin(angle) * s.length * s.life;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, 'rgba(255,255,255,' + (s.life * 0.6) + ')');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        ctx.globalAlpha = s.life * 0.4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

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
