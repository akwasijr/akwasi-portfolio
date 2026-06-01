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

/* Colors — purple-based process palette (from site's #7779f0) */
const lime = '#7779f0';          /* site purple (primary accent) */
const lav  = '#b8b9ff';          /* lighter tint (secondary accent) */
const dimLime = 'rgba(119,121,240,0.25)';
const dimLav  = 'rgba(184,185,255,0.18)';
const faint = 'rgba(255,255,255,0.10)';

/* Pixel-art octagonal circle — only H/V moves for that 8-bit look */
function pxCircle(cx, cy, r) {
  const a = Math.round(r * 0.38);
  const b = Math.round(r * 0.71);
  return [
    `M${cx-a},${cy-r}`, `H${cx+a}`,
    `V${cy-b}`, `H${cx+b}`, `V${cy-a}`, `H${cx+r}`,
    `V${cy+a}`, `H${cx+b}`, `V${cy+b}`, `H${cx+a}`, `V${cy+r}`,
    `H${cx-a}`, `V${cy+b}`, `H${cx-b}`, `V${cy+a}`, `H${cx-r}`,
    `V${cy-a}`, `H${cx-b}`, `V${cy-b}`, `H${cx-a}`, 'Z'
  ].join(' ');
}

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
      style={cursor ? { cursor, shapeRendering: 'crispEdges' } : { shapeRendering: 'crispEdges' }}
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
  DISCOVER: Pixel person with magnifying glass examining user personas
  8-bit style: octagonal lens, stepped handle, block sprites
  Hover: lens bulges, person leans in, notes pulse
*/
function PictogramDiscover({ visible }) {
  const { x, y, onMouse, active } = useMouseOffset();
  const glassX = x * 15;
  const glassY = y * 15;
  const glassR = active ? -x * 5 : 0;
  const t = active ? 'transform 0.15s ease' : 'transform 0.5s ease';
  // Lens bulge on hover
  const lensScale = active ? 1 + Math.abs(x) * 0.12 : 1;
  // Person leans toward glass
  const personLean = active ? x * 6 : 0;
  // Notes stagger in
  const noteShift = active ? 4 : 0;

  return (
    <AnimatedSVG visible={visible} onMouse={onMouse} cursor="none">
      {/* Pixel person — block head leans toward mouse */}
      <g style={{ transform: `translateX(${personLean}px) rotate(${x * 3}deg)`, transformOrigin: '130px 170px', transition: t }}>
        <rect x="114" y="108" width="32" height="32" stroke={lime} strokeWidth="1.5" className="draw" fill="none" />
        {/* Eyes follow mouse direction */}
        <rect x={122 + (active ? x * 2 : 0)} y="118" width="4" height="6" fill={lime} className="dot" />
        <rect x={134 + (active ? x * 2 : 0)} y="118" width="4" height="6" fill={lime} className="dot" />
        <line x1="124" y1="130" x2="136" y2="130" stroke={lime} strokeWidth="1" className="draw-delay" />
      </g>
      {/* Body — shifts with lean */}
      <g style={{ transform: `translateX(${personLean * 0.5}px)`, transition: t }}>
        <path d="M106,148 H154 V196 H142 V172 H118 V196 H106 Z" stroke={lime} strokeWidth="1.2" className="draw-reverse" fill="none" />
      </g>

      {/* Pixel magnifying glass — octagonal lens BULGES on hover */}
      <g style={{ transform: `translate(${glassX}px, ${glassY}px) rotate(${glassR}deg) scale(${lensScale})`, transformOrigin: '272px 168px', transition: `${t}, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)` }}>
        <path d={pxCircle(272, 168, 50)} stroke={lav} strokeWidth={active ? 2.2 : 1.8} className="draw-reverse" fill="none" style={{ transition: 'stroke-width 0.3s ease' }} />
        {/* Stepped diagonal handle */}
        <path d="M310,206 V214 H318 V222 H326 V230 H334 V238 H342 V246" stroke={lav} strokeWidth="2.5" className="draw" fill="none" />
        {/* Tiny pixel figure inside lens — grows on hover */}
        <g style={{ transform: `scale(${active ? 1.15 : 1})`, transformOrigin: '272px 170px', transition: 'transform 0.4s ease' }}>
          <rect x="264" y="150" width="16" height="16" stroke={lime} strokeWidth={active ? 1.2 : 0.8} className="draw-delay" fill="none" />
          <path d="M258,174 H286 V188 H258 Z" stroke={lime} strokeWidth="0.6" className="draw-reverse-delay" fill="none" />
        </g>
      </g>

      {/* Research notes — stagger in on hover */}
      <g style={{ transform: `translate(${x * -6}px, ${y * -4}px)`, transition: t }}>
        <g style={{ transform: `translateX(${noteShift}px)`, transition: 'transform 0.3s ease 0s' }}>
          <rect x="48" y="268" width="4" height="4" fill={lime} className="dot" />
          <line x1="60" y1="270" x2="128" y2="270" stroke={active ? dimLime : faint} strokeWidth="2" className="draw-reverse-delay" style={{ transition: 'stroke 0.3s ease' }} />
        </g>
        <g style={{ transform: `translateX(${noteShift * 1.5}px)`, transition: 'transform 0.3s ease 0.06s' }}>
          <rect x="48" y="284" width="4" height="4" fill={lime} className="dot" />
          <line x1="60" y1="286" x2="108" y2="286" stroke={active ? dimLime : faint} strokeWidth="2" className="draw-delay" style={{ transition: 'stroke 0.3s ease' }} />
        </g>
        <g style={{ transform: `translateX(${noteShift * 2}px)`, transition: 'transform 0.3s ease 0.12s' }}>
          <rect x="48" y="300" width="4" height="4" fill={lime} className="dot" />
          <line x1="60" y1="302" x2="120" y2="302" stroke={active ? dimLime : faint} strokeWidth="2" className="draw-reverse-delay" style={{ transition: 'stroke 0.3s ease' }} />
        </g>
      </g>

      {/* Stepped connection path */}
      <path d="M130,196 V236 H96 V264" stroke={dimLime} strokeWidth="0.8" className="draw-delay" fill="none" />
    </AnimatedSVG>
  );
}

/*
  DEFINE: Pixel compass pointing north
  8-bit style: octagonal rings, stepped diamond needle, block marks
*/
function PictogramDefine({ visible }) {
  const svgRef = useRef(null);
  const measuredRef = useRef(false);
  const [needleAngle, setNeedleAngle] = useState(0);

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
        else if (tag === 'rect') {
          const w = parseFloat(el.getAttribute('width') || 100);
          const h = parseFloat(el.getAttribute('height') || 100);
          len = 2 * (w + h);
        } else if (tag === 'line') {
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
    setNeedleAngle(0);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      fill="none"
      className={`process-pictogram ${visible ? 'process-pictogram--visible' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'crosshair', shapeRendering: 'crispEdges' }}
    >
      {/* Pixel compass outer ring — octagonal */}
      <path d={pxCircle(200, 200, 140)} stroke={faint} strokeWidth="0.8" className="draw-reverse" fill="none" />
      {/* Inner ring — octagonal */}
      <path d={pxCircle(200, 200, 100)} stroke={lav} strokeWidth="1.2" className="draw" fill="none" />

      {/* Cardinal marks — small blocks */}
      <rect x="196" y="52" width="8" height="20" stroke={lime} strokeWidth="1.2" className="draw-delay" fill="none" />
      <rect x="196" y="328" width="8" height="20" stroke={faint} strokeWidth="0.8" className="draw-reverse-delay" fill="none" />
      <rect x="52" y="196" width="20" height="8" stroke={faint} strokeWidth="0.8" className="draw-delay" fill="none" />
      <rect x="328" y="196" width="20" height="8" stroke={faint} strokeWidth="0.8" className="draw-reverse-delay" fill="none" />

      {/* Diagonal tick marks */}
      {[45, 135, 225, 315].map((deg) => {
        const r1 = 96, r2 = 104;
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={deg}
            x1={Math.round(200 + r1 * Math.sin(rad))} y1={Math.round(200 - r1 * Math.cos(rad))}
            x2={Math.round(200 + r2 * Math.sin(rad))} y2={Math.round(200 - r2 * Math.cos(rad))}
            stroke={faint} strokeWidth="0.8" className="draw-reverse-delay"
          />
        );
      })}

      {/* Needle group — rotates with mouse */}
      <g style={{
        transformOrigin: '200px 200px',
        transform: `rotate(${needleAngle}deg)`,
        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {/* North needle — stepped pixel diamond */}
        <path d="M196,190 V148 H192 V132 H188 V116 H196 V100 H204 V116 H212 V132 H208 V148 H204 V190 Z"
          stroke={lime} strokeWidth="1" className="draw-delay" fill="none" />
        {/* Fill right half */}
        <path d="M200,100 H204 V116 H212 V132 H208 V148 H204 V190 H200 Z" fill={dimLime} className="fade" />
        {/* South needle — smaller pixel shape */}
        <path d="M196,210 V252 H192 V268 H196 V300 H204 V268 H208 V252 H204 V210 Z"
          stroke={dimLav} strokeWidth="0.6" className="draw-reverse-delay" fill="none" />
      </g>

      {/* Center pivot — pixel block */}
      <rect x="194" y="194" width="12" height="12" fill={lime} className="dot" />

      {/* "N" label — rotates with needle */}
      <g style={{
        transformOrigin: '200px 200px',
        transform: `rotate(${needleAngle}deg)`,
        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <text x="200" y="44" textAnchor="middle" fill={lime} fontSize="14" fontFamily="'IBM Plex Mono', monospace" fontWeight="700" className="fade-delay">N</text>
      </g>
    </svg>
  );
}

/*
  ENVISION: Pixel people around a whiteboard with sticky notes
  8-bit style: block sprites, grid-aligned notes, stepped connections
  Hover: notes scatter wider, people lean in, board border pulses
*/
function PictogramEnvision({ visible }) {
  const { x, y, onMouse, active } = useMouseOffset();
  const t = active ? 'transform 0.12s ease' : 'transform 0.5s ease';
  // Notes scatter more on hover
  const mult = active ? 1.6 : 1;
  const n1 = { x: x * 8 * mult, y: y * 6 * mult };
  const n2 = { x: x * -5 * mult, y: y * 10 * mult };
  const n3 = { x: x * 12 * mult, y: y * -4 * mult };
  const n4 = { x: x * -10 * mult, y: y * 8 * mult };
  const n5 = { x: x * 6 * mult, y: y * -8 * mult };
  // People lean toward board center on hover
  const leanL = active ? 6 : 0;
  const leanR = active ? -6 : 0;

  return (
    <AnimatedSVG visible={visible} onMouse={onMouse} cursor="grab">
      {/* Pixel whiteboard — border brightens on hover */}
      <rect x="100" y="80" width="200" height="140" stroke={active ? lav : faint} strokeWidth={active ? 1.6 : 1.2} className="draw-reverse" fill="none" style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }} />
      {/* Grid lines on board */}
      <line x1="200" y1="80" x2="200" y2="220" stroke={faint} strokeWidth="0.4" className="draw-delay" />
      <line x1="100" y1="150" x2="300" y2="150" stroke={faint} strokeWidth="0.4" className="draw-reverse-delay" />

      {/* Sticky notes — pixel blocks that scatter with mouse, brighten on hover */}
      <g style={{ transform: `translate(${n1.x}px, ${n1.y}px)`, transition: t }}>
        <rect x="112" y="92" width="36" height="28" stroke={active ? lime : dimLime} strokeWidth={active ? 1.2 : 1} className="draw-delay" fill="none" style={{ transition: 'stroke 0.2s ease' }} />
        <line x1="118" y1="102" x2="142" y2="102" stroke={dimLime} strokeWidth="1.5" className="draw-delay" />
        <line x1="118" y1="110" x2="138" y2="110" stroke={dimLime} strokeWidth="1.5" className="draw-delay" />
      </g>
      <g style={{ transform: `translate(${n2.x}px, ${n2.y}px)`, transition: t }}>
        <rect x="160" y="88" width="36" height="28" stroke={active ? lime : dimLime} strokeWidth={active ? 1.2 : 1} className="draw-reverse-delay" fill="none" style={{ transition: 'stroke 0.2s ease' }} />
        <line x1="166" y1="98" x2="190" y2="98" stroke={dimLime} strokeWidth="1.5" className="draw-delay" />
        <line x1="166" y1="106" x2="186" y2="106" stroke={dimLime} strokeWidth="1.5" className="draw-delay" />
      </g>
      <g style={{ transform: `translate(${n3.x}px, ${n3.y}px)`, transition: t }}>
        <rect x="252" y="92" width="36" height="28" stroke={lav} strokeWidth="1" className="draw-delay" fill="none" />
      </g>
      <g style={{ transform: `translate(${n4.x}px, ${n4.y}px)`, transition: t }}>
        <rect x="120" y="158" width="36" height="28" stroke={lav} strokeWidth="1" className="draw-reverse-delay" fill="none" />
      </g>
      <g style={{ transform: `translate(${n5.x}px, ${n5.y}px)`, transition: t }}>
        <rect x="220" y="154" width="36" height="28" stroke={active ? lime : dimLime} strokeWidth={active ? 1.2 : 1} className="draw-delay" fill="none" style={{ transition: 'stroke 0.2s ease' }} />
      </g>

      {/* Pixel person 1 (left) — leans toward board */}
      <g style={{ transform: `translate(${x * 3 + leanL}px, ${y * 2 + (active ? -4 : 0)}px)`, transition: t }}>
        <rect x="94" y="264" width="24" height="24" stroke={lime} strokeWidth="1" className="draw-reverse-delay" fill="none" />
        <rect x={100 + (active ? x * 1.5 : 0)} y="272" width="4" height="4" fill={lime} className="dot" />
        <rect x={112 + (active ? x * 1.5 : 0)} y="272" width="4" height="4" fill={lime} className="dot" />
        <path d="M88,296 H124 V332 H88 Z" stroke={lime} strokeWidth="0.8" className="draw-delay" fill="none" />
      </g>

      {/* Pixel person 2 (center) — bobs up on hover */}
      <g style={{ transform: `translate(${x * -2}px, ${y * 3 + (active ? -6 : 0)}px)`, transition: t }}>
        <rect x="184" y="260" width="24" height="24" stroke={lav} strokeWidth="1" className="draw-delay" fill="none" />
        <rect x={190 + (active ? x * 1.5 : 0)} y="268" width="4" height="4" fill={lav} className="dot" />
        <rect x={200 + (active ? x * 1.5 : 0)} y="268" width="4" height="4" fill={lav} className="dot" />
        <path d="M178,292 H214 V328 H178 Z" stroke={lav} strokeWidth="0.8" className="draw-reverse-delay" fill="none" />
      </g>

      {/* Pixel person 3 (right) — leans toward board */}
      <g style={{ transform: `translate(${x * 4 + leanR}px, ${y * -2 + (active ? -4 : 0)}px)`, transition: t }}>
        <rect x="274" y="264" width="24" height="24" stroke={lime} strokeWidth="1" className="draw-delay" fill="none" />
        <rect x={280 + (active ? x * 1.5 : 0)} y="272" width="4" height="4" fill={lime} className="dot" />
        <rect x={290 + (active ? x * 1.5 : 0)} y="272" width="4" height="4" fill={lime} className="dot" />
        <path d="M268,296 H304 V332 H268 Z" stroke={lime} strokeWidth="0.8" className="draw-reverse-delay" fill="none" />
      </g>

      {/* Stepped connection lines — brighten on hover */}
      <path d="M106,264 V240 H140 V220" stroke={active ? lime : dimLime} strokeWidth={active ? 0.8 : 0.5} className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
      <path d="M196,260 V220" stroke={active ? lav : dimLav} strokeWidth={active ? 0.8 : 0.5} className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
      <path d="M286,264 V240 H260 V220" stroke={active ? lime : dimLime} strokeWidth={active ? 0.8 : 0.5} className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
    </AnimatedSVG>
  );
}

/*
  PROTOTYPE: Pixel screen mockup with person testing, feedback loop
  8-bit style: blocky device, crosshair tap, stepped feedback arrow
  Hover: screen content shuffles, tester leans in, crosshair pulses
*/
function PictogramPrototype({ visible }) {
  const { x, y, onMouse, active } = useMouseOffset();
  const t = active ? 'transform 0.12s ease' : 'transform 0.5s ease';
  const tapX = 107 + x * 40;
  const tapY = 175 + y * 50;
  const arrowShift = x * 10;
  const bubbleY = y * -12;
  // Screen content shuffles more on hover
  const screenMult = active ? 1.8 : 1;
  // Tester leans toward screen
  const testerLean = active ? -8 : 0;
  // Crosshair grows on hover
  const crossSize = active ? 1.3 : 1;

  return (
    <AnimatedSVG visible={visible} onMouse={onMouse} cursor="pointer">
      {/* Pixel device screen — border brightens on hover */}
      <rect x="60" y="70" width="170" height="240" stroke={active ? lav : dimLav} strokeWidth={active ? 1.8 : 1.5} className="draw-reverse" fill="none" style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }} />
      <line x1="60" y1="100" x2="230" y2="100" stroke={dimLav} strokeWidth="1" className="draw" />
      {/* Pixel status bar dots — pulse on hover */}
      <rect x="68" y="78" width="6" height="6" fill={active ? lav : dimLav} className="dot" style={{ transition: 'fill 0.2s ease' }} />
      <rect x="80" y="78" width="6" height="6" fill={active ? lav : dimLav} className="dot" style={{ transition: 'fill 0.2s ease 0.05s' }} />
      <rect x="92" y="78" width="6" height="6" fill={active ? lav : dimLav} className="dot" style={{ transition: 'fill 0.2s ease 0.1s' }} />

      {/* UI elements on screen — shuffle more on hover */}
      <g style={{ transform: `translate(${x * 3 * screenMult}px, ${y * 2 * screenMult}px)`, transition: t }}>
        <rect x="76" y="112" width="136" height="8" stroke={faint} strokeWidth="1" className="draw-reverse-delay" fill="none" />
      </g>
      <g style={{ transform: `translate(${x * -2 * screenMult}px, ${y * 3 * screenMult}px)`, transition: t }}>
        <rect x="76" y="132" width="136" height="52" stroke={active ? lime : dimLime} strokeWidth={active ? 1 : 0.8} className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
        <line x1="84" y1="144" x2="204" y2="144" stroke={faint} strokeWidth="1" className="draw-delay" />
        <line x1="84" y1="156" x2="196" y2="156" stroke={faint} strokeWidth="1" className="draw-delay" />
        <line x1="84" y1="168" x2="180" y2="168" stroke={faint} strokeWidth="1" className="draw-delay" />
      </g>
      <g style={{ transform: `translate(${x * 4 * screenMult}px, ${y * -1 * screenMult}px)`, transition: t }}>
        <rect x="76" y="200" width="56" height="20" stroke={lime} strokeWidth="1" className="draw-reverse-delay" fill="none" />
        <rect x="144" y="200" width="56" height="20" stroke={faint} strokeWidth="0.6" className="draw-delay" fill="none" />
      </g>

      {/* Crosshair touch indicator — scales up on hover */}
      <g style={{ transform: `translate(${tapX - 107}px, ${tapY - 215}px) scale(${crossSize})`, transformOrigin: '107px 215px', transition: `${t}, transform 0.25s ease` }}>
        <line x1="107" y1="207" x2="107" y2="223" stroke={lime} strokeWidth="1" className="draw-delay" />
        <line x1="99" y1="215" x2="115" y2="215" stroke={lime} strokeWidth="1" className="draw-delay" />
        <rect x="103" y="211" width="8" height="8" fill={lime} className="dot" />
      </g>

      {/* Pixel person (tester) — leans toward screen on hover */}
      <g style={{ transform: `translateX(${testerLean}px)`, transition: 'transform 0.3s ease' }}>
        <rect x="298" y="140" width="24" height="24" stroke={lav} strokeWidth="1" className="draw-delay" fill="none" />
        <rect x={304 + (active ? x * -1.5 : 0)} y="148" width="4" height="4" fill={lav} className="dot" />
        <rect x={314 + (active ? x * -1.5 : 0)} y="148" width="4" height="4" fill={lav} className="dot" />
        <path d="M290,172 H330 V212 H290 Z" stroke={lav} strokeWidth="0.8" className="draw-delay" fill="none" />
      </g>

      {/* Feedback loop — stepped arrow, brightens on hover */}
      <g style={{ transform: `translate(${arrowShift}px, ${y * 5}px)`, transition: t }}>
        <path d="M286,220 V260 H196 V280 H108 V300 H68 V284" stroke={active ? lime : dimLime} strokeWidth={active ? 1.2 : 1} className="draw-delay" fill="none" strokeDasharray="4 4" style={{ transition: 'stroke 0.3s ease' }} />
        <path d="M60,288 H68 V296 M76,288 H68" stroke={lime} strokeWidth="1" className="draw-delay" fill="none" />
      </g>

      {/* Speech blocks — float more on hover */}
      <g style={{ transform: `translate(${x * 6}px, ${bubbleY + (active ? -8 : 0)}px)`, transition: t }}>
        <rect x="340" y="108" width="4" height="4" fill={lime} className="dot-delay" />
        <rect x="350" y="96" width="4" height="4" fill={lime} className="dot-delay" />
        <rect x="348" y="76" width="20" height="16" stroke={lime} strokeWidth={active ? 1.2 : 0.8} className="draw-delay" fill="none" style={{ transition: 'stroke-width 0.3s ease' }} />
        <line x1="352" y1="82" x2="364" y2="82" stroke={lime} strokeWidth="1" className="draw-delay" />
        <line x1="352" y1="88" x2="360" y2="88" stroke={lime} strokeWidth="1" className="draw-delay" />
      </g>
    </AnimatedSVG>
  );
}

/*
  REFINE: Pixel before/after with polish details, slider in between
  8-bit style: sharp-edged panels, block slider, pixel cross sparkle
  Hover: panels separate more, before fades/after brightens, sparkle spins faster
*/
function PictogramRefine({ visible }) {
  const { x, y, onMouse, active } = useMouseOffset();
  const t = active ? 'transform 0.12s ease' : 'transform 0.5s ease';
  const sliderX = x * 30;
  // Panels separate more on hover
  const beforeX = x * (active ? -12 : -8);
  const afterX = x * (active ? 12 : 8);
  const sparkleR = x * (active ? 35 : 20);
  // Before panel dims, after panel brightens
  const beforeOpacity = active ? 0.6 : 1;
  const afterStroke = active ? lime : lav;

  return (
    <AnimatedSVG visible={visible} onMouse={onMouse} cursor="col-resize">
      {/* "Before" rough panel — dims and separates on hover */}
      <g style={{ transform: `translate(${beforeX}px, 0)`, opacity: beforeOpacity, transition: `${t}, opacity 0.3s ease` }}>
        <rect x="40" y="100" width="130" height="180" stroke={faint} strokeWidth="1" className="draw-reverse" fill="none" />
        <text x="105" y="90" textAnchor="middle" fill={faint} fontSize="11" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">before</text>
        <rect x="56" y="120" width="98" height="8" stroke={faint} strokeWidth="0.6" className="draw-reverse-delay" fill="none" />
        <rect x="56" y="140" width="98" height="40" stroke={faint} strokeWidth="0.6" className="draw-delay" fill="none" />
        <line x1="64" y1="152" x2="146" y2="152" stroke={faint} strokeWidth="0.4" className="draw-delay" />
        <line x1="64" y1="164" x2="132" y2="164" stroke={faint} strokeWidth="0.4" className="draw-delay" />
        <rect x="56" y="196" width="56" height="16" stroke={faint} strokeWidth="0.6" className="draw-reverse-delay" fill="none" />
        <path d="M56,240 H72 V236 H80 V244 H96 V232 H112 V240 H128 V236 H148" stroke={faint} strokeWidth="0.6" className="draw-delay" fill="none" />
      </g>

      {/* Center divider / slider — moves with mouse X */}
      <g style={{ transform: `translate(${sliderX}px, 0)`, transition: t }}>
        <line x1="200" y1="80" x2="200" y2="300" stroke={lime} strokeWidth="1.5" className="draw" />
        <rect x="192" y="182" width="16" height="16" stroke={lime} strokeWidth={active ? 1.6 : 1.2} fill="#0e0c24" className="draw" style={{ transition: 'stroke-width 0.2s ease' }} />
        <path d="M194,188 H188" stroke={lime} strokeWidth="1" fill="none" className="draw-delay" />
        <path d="M206,188 H212" stroke={lime} strokeWidth="1" fill="none" className="draw-delay" />
        <path d="M194,192 H188" stroke={lime} strokeWidth="1" fill="none" className="draw-delay" />
        <path d="M206,192 H212" stroke={lime} strokeWidth="1" fill="none" className="draw-delay" />
      </g>

      {/* "After" polished panel — brightens and separates on hover */}
      <g style={{ transform: `translate(${afterX}px, 0)`, transition: t }}>
        <rect x="230" y="100" width="130" height="180" stroke={afterStroke} strokeWidth={active ? 1.5 : 1.2} className="draw" fill="none" style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }} />
        <text x="295" y="90" textAnchor="middle" fill={active ? lime : lav} fontSize="11" fontFamily="'IBM Plex Mono', monospace" className="fade-delay" style={{ transition: 'fill 0.3s ease' }}>after</text>
        <rect x="246" y="120" width="98" height="8" stroke={active ? lime : lav} strokeWidth="0.8" className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
        <rect x="246" y="140" width="98" height="40" stroke={active ? lime : lav} strokeWidth="0.8" className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
        <line x1="254" y1="152" x2="336" y2="152" stroke={dimLav} strokeWidth="0.5" className="draw-delay" />
        <line x1="254" y1="164" x2="328" y2="164" stroke={dimLav} strokeWidth="0.5" className="draw-delay" />
        <rect x="246" y="196" width="56" height="16" stroke={lime} strokeWidth={active ? 1.3 : 1} className="draw-delay" fill="none" style={{ transition: 'stroke-width 0.3s ease' }} />
        {/* Pixel cross sparkle — spins faster on hover */}
        <g style={{ transform: `rotate(${sparkleR}deg)`, transformOrigin: '324px 208px', transition: active ? 'transform 0.15s ease' : 'transform 0.3s ease' }}>
          <line x1="324" y1="200" x2="324" y2="216" stroke={lime} strokeWidth="1" className="draw-delay" />
          <line x1="316" y1="208" x2="332" y2="208" stroke={lime} strokeWidth="1" className="draw-delay" />
          <rect x="322" y="206" width="4" height="4" fill={lime} className="dot-delay" />
        </g>
        <path d="M246,240 H270 V236 H294 V240 H318 V236 H344" stroke={lav} strokeWidth="0.6" className="draw-delay" fill="none" />
      </g>
    </AnimatedSVG>
  );
}

/*
  EVOLVE: Pixel growth chart with staircase trend and bar segments
  8-bit style: stepped bars instead of smooth curve, block data points
*/
/*
  EVOLVE: Pixel growth chart with staircase, bar segments
  8-bit style: blocky bars, stepped growth path, pixel arrow
  Hover: bars pulse/grow, staircase brightens, arrow bounces, users multiply
*/
function PictogramEvolve({ visible }) {
  const { x, y, onMouse, active } = useMouseOffset();
  const t = active ? 'transform 0.12s ease' : 'transform 0.5s ease';
  // Bars lift more on hover
  const hoverMult = active ? 1.6 : 1;
  const d1 = y * -5 * hoverMult;
  const d2 = y * -10 * hoverMult;
  const d3 = y * -16 * hoverMult;
  const d4 = y * -22 * hoverMult;
  const arrowR = x * (active ? 25 : 15);
  const spread = x * (active ? 10 : 6);
  // Arrow bounces on hover
  const arrowBounce = active ? Math.abs(y) * -8 : 0;

  return (
    <AnimatedSVG visible={visible} onMouse={onMouse} cursor="ns-resize">
      {/* Pixel axes — brighten on hover */}
      <line x1="70" y1="330" x2="350" y2="330" stroke={active ? dimLav : faint} strokeWidth="1.5" className="draw" style={{ transition: 'stroke 0.3s ease' }} />
      <line x1="70" y1="330" x2="70" y2="70" stroke={active ? dimLav : faint} strokeWidth="1.5" className="draw" style={{ transition: 'stroke 0.3s ease' }} />

      {/* Grid lines — brighten on hover */}
      {[130, 195, 260].map(gy => (
        <line key={gy} x1="72" y1={gy} x2="348" y2={gy} stroke={active ? dimLav : faint} strokeWidth="0.4" strokeDasharray="4 8" className="draw-delay" style={{ transition: 'stroke 0.3s ease' }} />
      ))}

      {/* Staircase growth — brightens on hover */}
      <path d="M80,310 H140 V280 H200 V200 H260 V130 H320 V85 H348"
        stroke={active ? lime : lime} strokeWidth={active ? 2.5 : 2} className="draw-slow" fill="none" style={{ transition: 'stroke-width 0.3s ease' }} />
      <path d="M80,310 H140 V280 H200 V200 H260 V130 H320 V85 H348 V330 H80 Z"
        fill={dimLime} opacity={active ? 0.6 : 0.4} className="fade" style={{ transition: 'opacity 0.3s ease' }} />

      {/* Pixel bar segments — lift more on hover, strokes brighten */}
      <g style={{ transform: `translate(0, ${d1}px)`, transition: t }}>
        <rect x="108" y="280" width="56" height="48" stroke={active ? lime : dimLime} strokeWidth={active ? 1.3 : 1} className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }} />
        <text x="136" y="342" textAnchor="middle" fill={dimLime} fontSize="10" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">v1</text>
      </g>
      <g style={{ transform: `translate(0, ${d2}px)`, transition: t }}>
        <rect x="172" y="200" width="56" height="128" stroke={active ? lime : dimLime} strokeWidth={active ? 1.3 : 1} className="draw-reverse-delay" fill="none" style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }} />
        <text x="200" y="342" textAnchor="middle" fill={dimLime} fontSize="10" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">v2</text>
      </g>
      <g style={{ transform: `translate(0, ${d3}px)`, transition: t }}>
        <rect x="232" y="130" width="56" height="198" stroke={active ? lav : dimLav} strokeWidth={active ? 1.3 : 1} className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }} />
        <text x="260" y="342" textAnchor="middle" fill={lime} fontSize="10" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">v3</text>
      </g>
      <g style={{ transform: `translate(0, ${d4}px)`, transition: t }}>
        <rect x="296" y="85" width="56" height="243" stroke={active ? lav : dimLav} strokeWidth={active ? 1.6 : 1.2} className="draw-reverse-delay" fill="none" style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }} />
        <text x="324" y="76" textAnchor="middle" fill={lime} fontSize="11" fontFamily="'IBM Plex Mono', monospace" fontWeight="700" className="fade-delay">v4</text>
        {/* Pixel arrow at top — tilts more + bounces on hover */}
        <g style={{ transform: `rotate(${arrowR}deg) translateY(${arrowBounce}px)`, transformOrigin: '324px 76px', transition: active ? 'transform 0.15s ease' : 'transform 0.4s ease' }}>
          <path d="M320,80 V68 H316 V60 H324 V52 H332 V60 H328 V68 H324 V80" stroke={lime} strokeWidth={active ? 1.2 : 0.8} fill="none" className="draw-delay" style={{ transition: 'stroke-width 0.2s ease' }} />
        </g>
      </g>

      {/* Pixel user count — squares spread more on hover, brighten */}
      <g style={{ transform: `translate(${-spread * 2}px, 0)`, transition: t }}>
        <rect x="126" y="352" width="8" height="8" stroke={active ? lav : dimLav} strokeWidth="0.6" className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
      </g>
      <g style={{ transform: `translate(${-spread}px, 0)`, transition: t }}>
        <rect x="196" y="352" width="8" height="8" stroke={active ? lav : dimLav} strokeWidth="0.6" className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
        <rect x="208" y="352" width="8" height="8" stroke={active ? lav : dimLav} strokeWidth="0.6" className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
      </g>
      <g style={{ transform: `translate(${spread}px, 0)`, transition: t }}>
        <rect x="268" y="352" width="8" height="8" stroke={active ? lime : lav} strokeWidth={active ? 0.9 : 0.6} className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
        <rect x="280" y="352" width="8" height="8" stroke={active ? lime : lav} strokeWidth={active ? 0.9 : 0.6} className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
        <rect x="292" y="352" width="8" height="8" stroke={active ? lime : lav} strokeWidth={active ? 0.9 : 0.6} className="draw-delay" fill="none" style={{ transition: 'stroke 0.3s ease' }} />
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
        <div className="process-panel__pictogram">
          <Pictogram visible={visible} />
        </div>
      </motion.div>
    </div>
  );
}

export default function HowIWorkSection() {
  const introRef = useRef(null);
  const introVisible = useScrollVisible(introRef, 0.3);

  return (
    <div className="process-section" style={{ background: '#0e0c24' }}>
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
