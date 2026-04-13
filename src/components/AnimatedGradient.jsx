import { useRef, useEffect } from 'react';

// Smooth animated gradient using canvas — similar to Stripe/Apple mesh gradients
// Uses overlapping soft circles that drift slowly for an organic feel

const COLORS = [
  [126, 128, 238],  // purple
  [19, 118, 191],   // blue
  [244, 90, 155],   // pink
  [242, 165, 115],  // orange
  [74, 26, 138],    // deep purple
];

class Orb {
  constructor(w, h, color) {
    this.w = w;
    this.h = h;
    this.color = color;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.radius = Math.max(w, h) * (0.3 + Math.random() * 0.25);
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.opacity = 0.4 + Math.random() * 0.3;
    this.targetOpacity = this.opacity;
    this.opacitySpeed = 0.002 + Math.random() * 0.003;
    this.opacityDir = 1;
  }

  update(ease = 1) {
    this.x += this.vx * ease;
    this.y += this.vy * ease;

    if (this.x < -this.radius * 0.3) this.vx = Math.abs(this.vx);
    if (this.x > this.w + this.radius * 0.3) this.vx = -Math.abs(this.vx);
    if (this.y < -this.radius * 0.3) this.vy = Math.abs(this.vy);
    if (this.y > this.h + this.radius * 0.3) this.vy = -Math.abs(this.vy);

    this.opacity += this.opacitySpeed * this.opacityDir * ease;
    if (this.opacity > 0.65) this.opacityDir = -1;
    if (this.opacity < 0.25) this.opacityDir = 1;
  }

  draw(ctx) {
    const grad = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );
    const [r, g, b] = this.color;
    grad.addColorStop(0, `rgba(${r},${g},${b},${this.opacity})`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${this.opacity * 0.4})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.w, this.h);
  }
}

export default function AnimatedGradient() {
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
      orbs.forEach(o => { o.w = w; o.h = h; });
    };

    const orbs = COLORS.map(c => new Orb(window.innerWidth, window.innerHeight, c));
    resize();
    window.addEventListener('resize', resize);

    const settleDuration = 3000;
    const startTime = performance.now();

    const draw = (now) => {
      ctx.fillStyle = '#1a0a2e';
      ctx.fillRect(0, 0, w, h);

      const elapsed = now - startTime;
      const ease = Math.max(0, 1 - elapsed / settleDuration);

      orbs.forEach(o => {
        o.update(ease);
        o.draw(ctx);
      });

      if (ease > 0.001) {
        animRef.current = requestAnimationFrame(draw);
      }
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
        zIndex: 0,
      }}
    />
  );
}
