import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Starfield from '../components/Starfield';

const ease = [0.22, 1, 0.36, 1];
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

/* ShuffleText — gentle letter scramble on hover + scroll trigger */
function ShuffleText({ text, className, triggerOnVisible }) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(null);
  const iterRef = useRef(0);
  const hasTriggered = useRef(false);

  const scramble = useCallback(() => {
    iterRef.current = 0;
    const resolve = () => {
      iterRef.current += 2;
      const result = text.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < iterRef.current) return text[i];
        if (Math.random() > 0.25) return text[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      setDisplay(result);
      if (iterRef.current < text.length) {
        rafRef.current = setTimeout(resolve, 90);
      }
    };
    resolve();
  }, [text]);

  const reset = useCallback(() => {
    if (rafRef.current) clearTimeout(rafRef.current);
    setDisplay(text);
  }, [text]);

  // Auto-trigger on scroll visibility
  useEffect(() => {
    if (triggerOnVisible && !hasTriggered.current) {
      hasTriggered.current = true;
      scramble();
    }
    if (!triggerOnVisible) {
      hasTriggered.current = false;
    }
  }, [triggerOnVisible, scramble]);

  useEffect(() => () => { if (rafRef.current) clearTimeout(rafRef.current); }, []);

  return (
    <span className={className} onMouseEnter={scramble} onMouseLeave={reset} style={{ cursor: 'default' }}>
      {display}
    </span>
  );
}

/* Mouse-reactive tilt wrapper */
function MouseTilt({ children, className }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = ((e.clientX - cx) / (rect.width / 2)) * 8;
    const y = ((e.clientY - cy) / (rect.height / 2)) * -8;
    setTilt({ x, y });
  }, []);

  const onLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `perspective(600px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease' : 'transform 0.1s ease',
      }}
    >
      {children}
    </div>
  );
}

/* Colors from site palette */
const lime = '#c6ef4d';
const lav = '#a5a5f6';
const dimLime = 'rgba(198,239,77,0.25)';
const dimLav = 'rgba(165,165,246,0.2)';
const faint = 'rgba(255,255,255,0.12)';

function useScrollVisible(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const overlay = el.closest('.overlay');
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { root: overlay || null, threshold, rootMargin: '-8% 0px -8% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

/* Animated SVG wrapper: measures real stroke lengths, draws them on, tracks mouse */
function AnimatedSVG({ visible, children, className, onMouse, cursor }) {
  const svgRef = useRef(null);
  const measuredRef = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || measuredRef.current) return;
    measuredRef.current = true;

    const drawEls = svg.querySelectorAll('.draw, .draw-delay, .draw-slow, .draw-reverse, .draw-reverse-delay');
    drawEls.forEach(el => {
      let len;
      try {
        if (typeof el.getTotalLength === 'function') {
          len = el.getTotalLength();
        }
      } catch (e) { /* fallback below */ }

      if (!len) {
        const tag = el.tagName.toLowerCase();
        if (tag === 'circle') {
          len = 2 * Math.PI * parseFloat(el.getAttribute('r') || 50);
        } else if (tag === 'rect') {
          const w = parseFloat(el.getAttribute('width') || 100);
          const h = parseFloat(el.getAttribute('height') || 100);
          len = 2 * (w + h);
        } else if (tag === 'line') {
          const x1 = parseFloat(el.getAttribute('x1') || 0);
          const y1 = parseFloat(el.getAttribute('y1') || 0);
          const x2 = parseFloat(el.getAttribute('x2') || 0);
          const y2 = parseFloat(el.getAttribute('y2') || 0);
          len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        } else if (tag === 'ellipse') {
          const rx = parseFloat(el.getAttribute('rx') || 50);
          const ry = parseFloat(el.getAttribute('ry') || 50);
          len = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
        } else if (tag === 'polygon' || tag === 'polyline') {
          const pts = el.getAttribute('points').trim().split(/[\s,]+/).map(Number);
          len = 0;
          for (let i = 0; i < pts.length - 2; i += 2) {
            len += Math.sqrt((pts[i + 2] - pts[i]) ** 2 + (pts[i + 3] - pts[i + 1]) ** 2);
          }
          if (tag === 'polygon' && pts.length >= 4) {
            len += Math.sqrt((pts[0] - pts[pts.length - 2]) ** 2 + (pts[1] - pts[pts.length - 1]) ** 2);
          }
        } else {
          len = 1000;
        }
      }

      const isReverse = el.classList.contains('draw-reverse') || el.classList.contains('draw-reverse-delay');
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = isReverse ? -len : len;
      el.dataset.len = len;
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const drawEls = svg.querySelectorAll('.draw, .draw-delay, .draw-slow, .draw-reverse, .draw-reverse-delay');
    drawEls.forEach(el => {
      const len = parseFloat(el.dataset.len || '1000');
      const isReverse = el.classList.contains('draw-reverse') || el.classList.contains('draw-reverse-delay');
      if (visible) {
        const isDelay = el.classList.contains('draw-delay') || el.classList.contains('draw-reverse-delay');
        const isSlow = el.classList.contains('draw-slow');
        const dur = isSlow ? '2.5s' : '1.8s';
        const delay = isDelay ? '0.7s' : isSlow ? '0.3s' : '0s';
        el.style.transition = `stroke-dashoffset ${dur} cubic-bezier(0.22, 1, 0.36, 1) ${delay}`;
        el.style.strokeDashoffset = '0';
      } else {
        el.style.transition = 'none';
        el.style.strokeDashoffset = isReverse ? -len : len;
      }
    });
  }, [visible]);

  // Mouse tracking: normalized -1..1 from center of SVG
  const handleMouseMove = useCallback((e) => {
    if (!onMouse) return;
    const rect = svgRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    onMouse({ x: nx, y: ny, clientX: e.clientX, clientY: e.clientY, rect });
  }, [onMouse]);

  const handleMouseLeave = useCallback(() => {
    if (onMouse) onMouse(null);
  }, [onMouse]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      fill="none"
      className={`process-pictogram ${visible ? 'process-pictogram--visible' : ''} ${className || ''}`}
      onMouseMove={onMouse ? handleMouseMove : undefined}
      onMouseLeave={onMouse ? handleMouseLeave : undefined}
      style={cursor ? { cursor } : undefined}
    >
      {children}
    </svg>
  );
}

/* Hook for mouse-reactive pictograms */
function useMouseOffset() {
  const [m, setM] = useState(null);
  const onMouse = useCallback((v) => setM(v), []);
  const x = m ? m.x : 0;
  const y = m ? m.y : 0;
  return { x, y, onMouse, active: !!m };
}

/*
  DISCOVER: Person with magnifying glass examining user personas
  Story: You're looking closely at real people to understand their needs
*/
function PictogramDiscover({ visible }) {
  const { x, y, onMouse, active } = useMouseOffset();
  const glassX = x * 15;
  const glassY = y * 15;
  const glassR = active ? -x * 5 : 0;
  const t = active ? 'transform 0.15s ease' : 'transform 0.5s ease';

  return (
    <AnimatedSVG visible={visible} onMouse={onMouse} cursor="none">
      {/* Person silhouette — head tilts toward mouse */}
      <g style={{ transform: `rotate(${x * 3}deg)`, transformOrigin: '140px 175px', transition: t }}>
        <circle cx="140" cy="130" r="22" stroke={lime} strokeWidth="1.2" className="draw" />
      </g>
      <path d="M100 220 Q100 175 140 175 Q180 175 180 220" stroke={lime} strokeWidth="1.2" className="draw-reverse" fill="none" />

      {/* Magnifying glass — follows mouse */}
      <g style={{ transform: `translate(${glassX}px, ${glassY}px) rotate(${glassR}deg)`, transformOrigin: '270px 170px', transition: t }}>
        <circle cx="270" cy="170" r="50" stroke={lav} strokeWidth="1.5" className="draw-reverse" />
        <line x1="305" y1="205" x2="340" y2="240" stroke={lav} strokeWidth="2" className="draw" />
        <circle cx="270" cy="160" r="10" stroke={lime} strokeWidth="0.8" className="draw-delay" />
        <path d="M255 182 Q255 172 270 172 Q285 172 285 182" stroke={lime} strokeWidth="0.8" className="draw-reverse-delay" fill="none" />
      </g>

      {/* Research notes — shift opposite to glass */}
      <g style={{ transform: `translate(${x * -6}px, ${y * -4}px)`, transition: t }}>
        <line x1="60" y1="270" x2="130" y2="270" stroke={faint} strokeWidth="0.8" className="draw-reverse-delay" />
        <line x1="60" y1="285" x2="110" y2="285" stroke={faint} strokeWidth="0.8" className="draw-delay" />
        <line x1="60" y1="300" x2="120" y2="300" stroke={faint} strokeWidth="0.8" className="draw-reverse-delay" />
        <circle cx="50" cy="270" r="3" className="dot" fill={lime} />
        <circle cx="50" cy="285" r="3" className="dot" fill={lime} />
        <circle cx="50" cy="300" r="3" className="dot" fill={lime} />
      </g>

      {/* Connection lines from person to notes */}
      <path d="M140 220 Q100 260 70 265" stroke={dimLime} strokeWidth="0.5" className="draw-delay" fill="none" />
    </AnimatedSVG>
  );
}

/*
  DEFINE: Compass pointing north with a clear path ahead
  Story: Setting direction, aligning on where to go
*/
function PictogramDefine({ visible }) {
  const svgRef = useRef(null);
  const measuredRef = useRef(false);
  const [needleAngle, setNeedleAngle] = useState(0);

  // Measure stroke lengths
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || measuredRef.current) return;
    measuredRef.current = true;
    const drawEls = svg.querySelectorAll('.draw, .draw-delay, .draw-slow, .draw-reverse, .draw-reverse-delay');
    drawEls.forEach(el => {
      let len;
      try { if (typeof el.getTotalLength === 'function') len = el.getTotalLength(); } catch (e) {}
      if (!len) {
        const tag = el.tagName.toLowerCase();
        if (tag === 'circle') len = 2 * Math.PI * parseFloat(el.getAttribute('r') || 50);
        else if (tag === 'line') {
          const x1 = parseFloat(el.getAttribute('x1')||0), y1 = parseFloat(el.getAttribute('y1')||0);
          const x2 = parseFloat(el.getAttribute('x2')||0), y2 = parseFloat(el.getAttribute('y2')||0);
          len = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        } else if (tag === 'polygon' || tag === 'polyline') {
          const pts = el.getAttribute('points').trim().split(/[\s,]+/).map(Number);
          len = 0;
          for (let i = 0; i < pts.length - 2; i += 2) len += Math.sqrt((pts[i+2]-pts[i])**2 + (pts[i+3]-pts[i+1])**2);
          if (tag === 'polygon' && pts.length >= 4) len += Math.sqrt((pts[0]-pts[pts.length-2])**2 + (pts[1]-pts[pts.length-1])**2);
        } else len = 1000;
      }
      const isReverse = el.classList.contains('draw-reverse') || el.classList.contains('draw-reverse-delay');
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = isReverse ? -len : len;
      el.dataset.len = len;
    });
  }, []);

  // Animate strokes on visibility
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const drawEls = svg.querySelectorAll('.draw, .draw-delay, .draw-slow, .draw-reverse, .draw-reverse-delay');
    drawEls.forEach(el => {
      const len = parseFloat(el.dataset.len || '1000');
      const isReverse = el.classList.contains('draw-reverse') || el.classList.contains('draw-reverse-delay');
      if (visible) {
        const isDelay = el.classList.contains('draw-delay') || el.classList.contains('draw-reverse-delay');
        const isSlow = el.classList.contains('draw-slow');
        const dur = isSlow ? '2.5s' : '1.8s';
        const delay = isDelay ? '0.7s' : isSlow ? '0.3s' : '0s';
        el.style.transition = `stroke-dashoffset ${dur} cubic-bezier(0.22, 1, 0.36, 1) ${delay}`;
        el.style.strokeDashoffset = '0';
      } else {
        el.style.transition = 'none';
        el.style.strokeDashoffset = isReverse ? -len : len;
      }
    });
  }, [visible]);

  const onMouseMove = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    setNeedleAngle(angle);
  }, []);

  const onMouseLeave = useCallback(() => {
    setNeedleAngle(0); // return to north
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      fill="none"
      className={`process-pictogram ${visible ? 'process-pictogram--visible' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'crosshair' }}
    >
      {/* Compass outer rings — draw in opposite directions */}
      <circle cx="200" cy="200" r="140" stroke={faint} strokeWidth="0.8" className="draw-reverse" />
      <circle cx="200" cy="200" r="100" stroke={lav} strokeWidth="1" className="draw" />

      {/* Cardinal marks */}
      <line x1="200" y1="55" x2="200" y2="75" stroke={lime} strokeWidth="1.2" className="draw-delay" />
      <line x1="200" y1="325" x2="200" y2="345" stroke={faint} strokeWidth="0.8" className="draw-reverse-delay" />
      <line x1="55" y1="200" x2="75" y2="200" stroke={faint} strokeWidth="0.8" className="draw-delay" />
      <line x1="325" y1="200" x2="345" y2="200" stroke={faint} strokeWidth="0.8" className="draw-reverse-delay" />

      {/* Tick marks */}
      {[45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r1 = 95, r2 = 105;
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={deg}
            x1={200 + r1 * Math.sin(rad)} y1={200 - r1 * Math.cos(rad)}
            x2={200 + r2 * Math.sin(rad)} y2={200 - r2 * Math.cos(rad)}
            stroke={faint} strokeWidth="0.6" className={deg % 90 === 0 ? 'draw-delay' : 'draw-reverse-delay'}
          />
        );
      })}

      {/* Needle group — rotates with mouse */}
      <g style={{
        transformOrigin: '200px 200px',
        transform: `rotate(${needleAngle}deg)`,
        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {/* North needle */}
        <polygon points="200,100 188,210 200,190 212,210" stroke={lime} strokeWidth="1" className="draw-delay" fill="none" />
        <polygon points="200,100 200,190 212,210" fill={dimLime} className="fade" />
        {/* South needle */}
        <polygon points="200,300 188,190 200,210 212,190" stroke={dimLav} strokeWidth="0.6" className="draw-reverse-delay" fill="none" />
      </g>

      {/* Center pivot */}
      <circle cx="200" cy="200" r="6" fill={lime} className="dot" />

      {/* "N" label — also rotates */}
      <g style={{
        transformOrigin: '200px 200px',
        transform: `rotate(${needleAngle}deg)`,
        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <text x="200" y="48" textAnchor="middle" fill={lime} fontSize="14" fontFamily="'IBM Plex Mono', monospace" fontWeight="500" className="fade-delay">N</text>
      </g>
    </svg>
  );
}

/*
  ENVISION: People around a table/whiteboard with sticky notes
  Story: Collaborative workshops mapping out possibilities
*/
function PictogramEnvision({ visible }) {
  const { x, y, onMouse, active } = useMouseOffset();
  const t = active ? 'transform 0.12s ease' : 'transform 0.5s ease';
  // Each sticky note shifts differently based on mouse
  const n1 = { x: x * 8, y: y * 6, r: x * 4 };
  const n2 = { x: x * -5, y: y * 10, r: x * -3 };
  const n3 = { x: x * 12, y: y * -4, r: x * 5 };
  const n4 = { x: x * -10, y: y * 8, r: x * -6 };
  const n5 = { x: x * 6, y: y * -8, r: x * 3 };

  return (
    <AnimatedSVG visible={visible} onMouse={onMouse} cursor="grab">
      {/* Whiteboard/canvas */}
      <rect x="100" y="80" width="200" height="140" rx="4" stroke={lav} strokeWidth="1" className="draw-reverse" />

      {/* Sticky notes — each drifts independently with mouse */}
      <g style={{ transform: `translate(${n1.x}px, ${n1.y}px) rotate(${n1.r}deg)`, transformOrigin: '140px 117px', transition: t }}>
        <rect x="120" y="100" width="40" height="35" rx="2" stroke={lime} strokeWidth="0.8" className="draw-delay" />
        <line x1="126" y1="112" x2="152" y2="112" stroke={dimLime} strokeWidth="0.5" className="draw-delay" />
        <line x1="126" y1="120" x2="148" y2="120" stroke={dimLime} strokeWidth="0.5" className="draw-delay" />
      </g>
      <g style={{ transform: `translate(${n2.x}px, ${n2.y}px) rotate(${n2.r}deg)`, transformOrigin: '195px 112px', transition: t }}>
        <rect x="175" y="95" width="40" height="35" rx="2" stroke={lime} strokeWidth="0.8" className="draw-reverse-delay" />
        <line x1="181" y1="107" x2="207" y2="107" stroke={dimLime} strokeWidth="0.5" className="draw-delay" />
        <line x1="181" y1="115" x2="203" y2="115" stroke={dimLime} strokeWidth="0.5" className="draw-delay" />
      </g>
      <g style={{ transform: `translate(${n3.x}px, ${n3.y}px) rotate(${n3.r}deg)`, transformOrigin: '250px 117px', transition: t }}>
        <rect x="230" y="100" width="40" height="35" rx="2" stroke={lav} strokeWidth="0.8" className="draw-delay" />
      </g>
      <g style={{ transform: `translate(${n4.x}px, ${n4.y}px) rotate(${n4.r}deg)`, transformOrigin: '165px 172px', transition: t }}>
        <rect x="145" y="155" width="40" height="35" rx="2" stroke={lav} strokeWidth="0.8" className="draw-reverse-delay" />
      </g>
      <g style={{ transform: `translate(${n5.x}px, ${n5.y}px) rotate(${n5.r}deg)`, transformOrigin: '225px 167px', transition: t }}>
        <rect x="205" y="150" width="40" height="35" rx="2" stroke={lime} strokeWidth="0.8" className="draw-delay" />
      </g>

      {/* Person 1 (left) — leans toward mouse */}
      <g style={{ transform: `translate(${x * 3}px, ${y * 2}px)`, transition: t }}>
        <circle cx="110" cy="280" r="16" stroke={lime} strokeWidth="0.8" className="draw-reverse-delay" />
        <path d="M85 330 Q85 300 110 300 Q135 300 135 330" stroke={lime} strokeWidth="0.8" className="draw-delay" fill="none" />
      </g>

      {/* Person 2 (center) */}
      <g style={{ transform: `translate(${x * -2}px, ${y * 3}px)`, transition: t }}>
        <circle cx="200" cy="275" r="16" stroke={lav} strokeWidth="0.8" className="draw-delay" />
        <path d="M175 325 Q175 295 200 295 Q225 295 225 325" stroke={lav} strokeWidth="0.8" className="draw-reverse-delay" fill="none" />
      </g>

      {/* Person 3 (right) */}
      <g style={{ transform: `translate(${x * 4}px, ${y * -2}px)`, transition: t }}>
        <circle cx="290" cy="280" r="16" stroke={lime} strokeWidth="0.8" className="draw-delay" />
        <path d="M265 330 Q265 300 290 300 Q315 300 315 330" stroke={lime} strokeWidth="0.8" className="draw-reverse-delay" fill="none" />
      </g>

      {/* Connection lines from people to board */}
      <path d="M110 265 L140 220" stroke={dimLime} strokeWidth="0.5" strokeDasharray="3 2" className="draw-delay" />
      <path d="M200 260 L200 220" stroke={dimLav} strokeWidth="0.5" strokeDasharray="3 2" className="draw-delay" />
      <path d="M290 265 L260 220" stroke={dimLime} strokeWidth="0.5" strokeDasharray="3 2" className="draw-delay" />
    </AnimatedSVG>
  );
}

/*
  PROTOTYPE & TEST: Screen mockup with a person tapping/clicking, feedback loop arrow
  Story: Building something tangible and putting it in front of real users
*/
function PictogramPrototype({ visible }) {
  const { x, y, onMouse, active } = useMouseOffset();
  const t = active ? 'transform 0.12s ease' : 'transform 0.5s ease';
  // Tap indicator follows mouse within screen bounds
  const tapX = 107 + x * 40;
  const tapY = 175 + y * 50;
  // Feedback arrow sways
  const arrowShift = x * 10;
  // Speech bubbles float up with mouse
  const bubbleY = y * -12;

  return (
    <AnimatedSVG visible={visible} onMouse={onMouse} cursor="pointer">
      {/* Device screen */}
      <rect x="60" y="70" width="170" height="240" rx="6" stroke={lav} strokeWidth="1.2" className="draw-reverse" />
      <line x1="60" y1="100" x2="230" y2="100" stroke={dimLav} strokeWidth="0.6" className="draw" />

      {/* UI elements on screen — shift subtly */}
      <g style={{ transform: `translate(${x * 3}px, ${y * 2}px)`, transition: t }}>
        <rect x="80" y="115" width="130" height="12" rx="2" stroke={faint} strokeWidth="0.5" className="draw-reverse-delay" />
      </g>
      <g style={{ transform: `translate(${x * -2}px, ${y * 3}px)`, transition: t }}>
        <rect x="80" y="140" width="130" height="50" rx="2" stroke={dimLime} strokeWidth="0.6" className="draw-delay" />
      </g>
      <g style={{ transform: `translate(${x * 4}px, ${y * -1}px)`, transition: t }}>
        <rect x="80" y="205" width="55" height="20" rx="3" stroke={lime} strokeWidth="0.8" className="draw-reverse-delay" />
        <rect x="145" y="205" width="55" height="20" rx="3" stroke={faint} strokeWidth="0.5" className="draw-delay" />
      </g>

      {/* Touch/click indicator — follows mouse */}
      <g style={{ transform: `translate(${tapX - 107}px, ${tapY - 215}px)`, transition: t }}>
        <circle cx="107" cy="215" r="12" stroke={lime} strokeWidth="0.6" className="pulse" fill="none" />
        <circle cx="107" cy="215" r="4" fill={lime} className="dot" />
      </g>

      {/* Person (tester) */}
      <circle cx="310" cy="160" r="20" stroke={lav} strokeWidth="0.8" className="draw-delay" />
      <path d="M282 220 Q282 185 310 185 Q338 185 338 220" stroke={lav} strokeWidth="0.8" className="draw-delay" fill="none" />

      {/* Feedback loop arrow — sways with mouse */}
      <g style={{ transform: `translate(${arrowShift}px, ${y * 5}px)`, transition: t }}>
        <path d="M285 230 Q200 310 100 310 Q60 310 60 280" stroke={lime} strokeWidth="0.8" className="draw-delay" fill="none" strokeDasharray="4 3" />
        <polyline points="55,288 60,275 68,286" stroke={lime} strokeWidth="0.8" className="draw-delay" fill="none" />
      </g>

      {/* Speech bubbles — float with mouse */}
      <g style={{ transform: `translate(${x * 6}px, ${bubbleY}px)`, transition: t }}>
        <circle cx="330" cy="120" r="3" fill={lime} className="dot-delay" />
        <circle cx="345" cy="108" r="3" fill={lime} className="dot-delay" />
        <circle cx="355" cy="90" r="8" stroke={lime} strokeWidth="0.6" className="draw-delay" />
        <line x1="350" y1="88" x2="360" y2="88" stroke={lime} strokeWidth="0.5" className="draw-delay" />
        <line x1="349" y1="93" x2="358" y2="93" stroke={lime} strokeWidth="0.5" className="draw-delay" />
      </g>
    </AnimatedSVG>
  );
}

/*
  REFINE: Before/after with polish details, slider in between
  Story: Sweating the details, polishing micro-interactions
*/
function PictogramRefine({ visible }) {
  const { x, y, onMouse, active } = useMouseOffset();
  const t = active ? 'transform 0.12s ease' : 'transform 0.5s ease';
  // Slider thumb moves left/right with mouse
  const sliderX = x * 30;
  // Before panel shifts away, after panel shifts in
  const beforeX = x * -8;
  const afterX = x * 8;
  // Sparkle rotates
  const sparkleR = x * 20;

  return (
    <AnimatedSVG visible={visible} onMouse={onMouse} cursor="col-resize">
      {/* "Before" rough shape — shifts left with mouse */}
      <g style={{ transform: `translate(${beforeX}px, 0)`, transition: t }}>
        <rect x="40" y="100" width="130" height="180" rx="4" stroke={faint} strokeWidth="0.8" className="draw-reverse" />
        <text x="105" y="90" textAnchor="middle" fill={faint} fontSize="11" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">before</text>
        <rect x="55" y="125" width="100" height="10" rx="2" stroke={faint} strokeWidth="0.4" className="draw-reverse-delay" />
        <rect x="55" y="150" width="100" height="40" rx="2" stroke={faint} strokeWidth="0.4" className="draw-delay" />
        <rect x="55" y="205" width="60" height="14" rx="2" stroke={faint} strokeWidth="0.5" className="draw-reverse-delay" />
        <polyline points="55,245 70,240 80,250 95,238 110,248 125,240 140,245" stroke={faint} strokeWidth="0.5" className="draw-delay" fill="none" />
      </g>

      {/* Center divider / slider — moves with mouse X */}
      <g style={{ transform: `translate(${sliderX}px, 0)`, transition: t }}>
        <line x1="200" y1="80" x2="200" y2="300" stroke={lime} strokeWidth="1" className="draw" />
        <circle cx="200" cy="190" r="8" stroke={lime} strokeWidth="1" fill="#00330f" className="draw" />
        <polyline points="195,188 199,192 195,196" stroke={lime} strokeWidth="0.6" fill="none" className="draw-delay" />
        <polyline points="205,188 201,192 205,196" stroke={lime} strokeWidth="0.6" fill="none" className="draw-delay" />
      </g>

      {/* "After" polished shape — shifts right with mouse */}
      <g style={{ transform: `translate(${afterX}px, 0)`, transition: t }}>
        <rect x="230" y="100" width="130" height="180" rx="8" stroke={lav} strokeWidth="1.2" className="draw" />
        <text x="295" y="90" textAnchor="middle" fill={lav} fontSize="11" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">after</text>
        <rect x="248" y="125" width="95" height="10" rx="3" stroke={lav} strokeWidth="0.6" className="draw-delay" />
        <rect x="248" y="150" width="95" height="40" rx="4" stroke={lav} strokeWidth="0.6" className="draw-delay" />
        <rect x="248" y="205" width="55" height="14" rx="7" stroke={lime} strokeWidth="0.8" className="draw-delay" />
        {/* Sparkle rotates */}
        <g style={{ transform: `rotate(${sparkleR}deg)`, transformOrigin: '320px 216px', transition: t }}>
          <line x1="320" y1="210" x2="320" y2="222" stroke={lime} strokeWidth="0.6" className="draw-delay" />
          <line x1="314" y1="216" x2="326" y2="216" stroke={lime} strokeWidth="0.6" className="draw-delay" />
        </g>
        <path d="M248 245 Q270 235 295 245 Q320 255 343 245" stroke={lav} strokeWidth="0.6" className="draw-delay" fill="none" />
      </g>
    </AnimatedSVG>
  );
}

/*
  EVOLVE: Growth chart with upward trend, branching iterations
  Story: Measuring, learning, the experience keeps growing
*/
function PictogramEvolve({ visible }) {
  const { x, y, onMouse, active } = useMouseOffset();
  const t = active ? 'transform 0.12s ease' : 'transform 0.5s ease';
  // Data points lift/drop based on mouse — each more than the last
  const d1 = y * -5;
  const d2 = y * -10;
  const d3 = y * -16;
  const d4 = y * -22;
  // Arrow at end tilts
  const arrowR = x * 15;
  // People along bottom spread out
  const spread = x * 6;

  return (
    <AnimatedSVG visible={visible} onMouse={onMouse} cursor="ns-resize">
      {/* Axis lines */}
      <line x1="70" y1="330" x2="350" y2="330" stroke={faint} strokeWidth="0.8" className="draw" />
      <line x1="70" y1="330" x2="70" y2="70" stroke={faint} strokeWidth="0.8" className="draw" />

      {/* Grid lines */}
      {[130, 195, 260].map(gy => (
        <line key={gy} x1="70" y1={gy} x2="350" y2={gy} stroke={faint} strokeWidth="0.3" strokeDasharray="3 4" className="draw-delay" />
      ))}

      {/* Growth curve */}
      <path d="M80 310 Q130 300 160 280 Q200 250 230 200 Q260 160 290 130 Q310 110 340 85"
        stroke={lime} strokeWidth="1.8" className="draw-slow" fill="none" strokeLinecap="round" />

      {/* Data points — each lifts independently */}
      <g style={{ transform: `translate(0, ${d1}px)`, transition: t }}>
        <circle cx="160" cy="280" r="4" fill={lime} className="dot" />
        <text x="160" y="300" textAnchor="middle" fill={dimLime} fontSize="9" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">v1</text>
      </g>
      <g style={{ transform: `translate(0, ${d2}px)`, transition: t }}>
        <circle cx="230" cy="200" r="4" fill={lime} className="dot-delay" />
        <text x="230" y="220" textAnchor="middle" fill={dimLime} fontSize="9" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">v2</text>
      </g>
      <g style={{ transform: `translate(0, ${d3}px)`, transition: t }}>
        <circle cx="290" cy="130" r="5" fill={lime} className="dot-delay" />
        <text x="290" y="150" textAnchor="middle" fill={lime} fontSize="9" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">v3</text>
      </g>
      <g style={{ transform: `translate(0, ${d4}px)`, transition: t }}>
        <circle cx="340" cy="85" r="6" fill={lime} className="dot-delay" />
        <text x="340" y="75" textAnchor="middle" fill={lime} fontSize="10" fontFamily="'IBM Plex Mono', monospace" fontWeight="500" className="fade-delay">v4</text>
        {/* Arrow tilts with mouse */}
        <g style={{ transform: `rotate(${arrowR}deg)`, transformOrigin: '340px 74px', transition: t }}>
          <polyline points="335,80 340,68 345,80" stroke={lime} strokeWidth="0.8" fill="none" className="draw-delay" />
        </g>
      </g>

      {/* User count growing — spread with mouse */}
      <g style={{ transform: `translate(${-spread * 2}px, 0)`, transition: t }}>
        <circle cx="130" cy="355" r="5" stroke={dimLav} strokeWidth="0.5" className="draw-delay" />
      </g>
      <g style={{ transform: `translate(${-spread}px, 0)`, transition: t }}>
        <circle cx="200" cy="355" r="5" stroke={dimLav} strokeWidth="0.5" className="draw-delay" />
        <circle cx="210" cy="355" r="5" stroke={dimLav} strokeWidth="0.5" className="draw-delay" />
      </g>
      <g style={{ transform: `translate(${spread}px, 0)`, transition: t }}>
        <circle cx="275" cy="355" r="5" stroke={lav} strokeWidth="0.5" className="draw-delay" />
        <circle cx="285" cy="355" r="5" stroke={lav} strokeWidth="0.5" className="draw-delay" />
        <circle cx="295" cy="355" r="5" stroke={lav} strokeWidth="0.5" className="draw-delay" />
      </g>
    </AnimatedSVG>
  );
}

const pictograms = [
  PictogramDiscover,
  PictogramDefine,
  PictogramEnvision,
  PictogramPrototype,
  PictogramRefine,
  PictogramEvolve,
];

const steps = [
  {
    title: 'Discover the\nreal problem',
    desc: 'Great experiences start with the humans behind them. I talk to stakeholders, map their workflows, and design around the way they actually work.',
  },
  {
    title: 'Define what\nsuccess looks like',
    desc: 'Align on the challenge before solving it. Who is this for, what does good look like, and what constraints shape the solution. Clarity here saves everything downstream.',
  },
  {
    title: 'Envision the\nexperience',
    desc: 'Workshops, journey maps, and design thinking to explore possibilities. Shape how people and technology work together before a single screen is designed.',
  },
  {
    title: 'Prototype and\ntest with people',
    desc: 'Tangible concepts people can react to, not decks or wireframes in isolation. Test with real users early. When tools can generate anything, knowing what to keep matters most.',
  },
  {
    title: 'Refine the\ndetails that matter',
    desc: 'Iterate on what the testing reveals. Sweat the details that build trust: micro-interactions, error states, moments of delight. Good design is invisible until it isn\'t.',
  },
  {
    title: 'Evolve with\nthe people using it',
    desc: 'Design doesn\'t end at handoff. Measure, learn, adapt. The best experiences are living systems that grow with their users, not static deliverables.',
  },
];

function ProcessPanel({ step, index }) {
  const ref = useRef(null);
  const visible = useScrollVisible(ref, 0.15);
  const Pictogram = pictograms[index];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const pictoY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const titleLines = step.title.split('\n');

  return (
    <div ref={ref} className="process-panel">
      <motion.div className="process-panel__text" style={{ y: textY }}>
        <motion.h2
          className="process-panel__title"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.9, ease }}
        >
          {titleLines.map((line, i) => (
            <span key={i}>
              <ShuffleText text={line} className="process-panel__title-line" triggerOnVisible={visible} />
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </motion.h2>
        <motion.p
          className="process-panel__desc"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          {step.desc}
        </motion.p>
      </motion.div>
      <motion.div style={{ y: pictoY }}>
        <MouseTilt className="process-panel__pictogram">
          <Pictogram visible={visible} />
        </MouseTilt>
      </motion.div>
    </div>
  );
}

export default function HowIWorkSection() {
  const introRef = useRef(null);
  const introVisible = useScrollVisible(introRef, 0.3);

  return (
    <div className="process-section" style={{ background: '#00330f' }}>
      <Starfield count={25} />

      <div ref={introRef} className="process-intro">
        <motion.h2
          className="process-intro__heading"
          animate={introVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease }}
        >
          People-first<br />design process
        </motion.h2>
      </div>

      {steps.map((step, i) => (
        <ProcessPanel key={i} step={step} index={i} />
      ))}
    </div>
  );
}
