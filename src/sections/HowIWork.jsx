import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Starfield from '../components/Starfield';

const ease = [0.22, 1, 0.36, 1];
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

/* ShuffleText — gentle letter scramble on hover */
function ShuffleText({ text, className }) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(null);
  const iterRef = useRef(0);

  const scramble = useCallback(() => {
    iterRef.current = 0;
    const resolve = () => {
      iterRef.current += 2; // resolve 2 chars at a time
      const result = text.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < iterRef.current) return text[i];
        // only scramble ~25% of remaining chars each tick
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

/* Animated SVG wrapper: measures real stroke lengths and draws them on */
function AnimatedSVG({ visible, children, className }) {
  const svgRef = useRef(null);
  const measuredRef = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || measuredRef.current) return;
    measuredRef.current = true;

    const drawEls = svg.querySelectorAll('.draw, .draw-delay, .draw-slow');
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

      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      el.dataset.len = len;
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const drawEls = svg.querySelectorAll('.draw, .draw-delay, .draw-slow');
    drawEls.forEach(el => {
      const len = el.dataset.len || '1000';
      if (visible) {
        const isDelay = el.classList.contains('draw-delay');
        const isSlow = el.classList.contains('draw-slow');
        const dur = isSlow ? '2.5s' : '1.8s';
        const delay = isDelay ? '0.7s' : isSlow ? '0.3s' : '0s';
        el.style.transition = `stroke-dashoffset ${dur} cubic-bezier(0.22, 1, 0.36, 1) ${delay}`;
        el.style.strokeDashoffset = '0';
      } else {
        el.style.transition = 'none';
        el.style.strokeDashoffset = len;
      }
    });
  }, [visible]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      fill="none"
      className={`process-pictogram ${visible ? 'process-pictogram--visible' : ''} ${className || ''}`}
    >
      {children}
    </svg>
  );
}

/*
  DISCOVER: Person with magnifying glass examining user personas
  Story: You're looking closely at real people to understand their needs
*/
function PictogramDiscover({ visible }) {
  return (
    <AnimatedSVG visible={visible}>
      {/* Person silhouette (the researcher) */}
      <circle cx="140" cy="130" r="22" stroke={lime} strokeWidth="1.2" className="draw" />
      <path d="M100 220 Q100 175 140 175 Q180 175 180 220" stroke={lime} strokeWidth="1.2" className="draw" fill="none" />

      {/* Magnifying glass */}
      <circle cx="270" cy="170" r="50" stroke={lav} strokeWidth="1.5" className="draw" />
      <line x1="305" y1="205" x2="340" y2="240" stroke={lav} strokeWidth="2" className="draw" />

      {/* Inside magnifying glass: a simplified user face being examined */}
      <circle cx="270" cy="160" r="10" stroke={lime} strokeWidth="0.8" className="draw-delay" />
      <path d="M255 182 Q255 172 270 172 Q285 172 285 182" stroke={lime} strokeWidth="0.8" className="draw-delay" fill="none" />

      {/* Research notes / data points floating around */}
      <line x1="60" y1="270" x2="130" y2="270" stroke={faint} strokeWidth="0.8" className="draw-delay" />
      <line x1="60" y1="285" x2="110" y2="285" stroke={faint} strokeWidth="0.8" className="draw-delay" />
      <line x1="60" y1="300" x2="120" y2="300" stroke={faint} strokeWidth="0.8" className="draw-delay" />
      <circle cx="50" cy="270" r="3" className="dot" fill={lime} />
      <circle cx="50" cy="285" r="3" className="dot" fill={lime} />
      <circle cx="50" cy="300" r="3" className="dot" fill={lime} />

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
  return (
    <AnimatedSVG visible={visible}>
      {/* Compass outer ring */}
      <circle cx="200" cy="200" r="140" stroke={faint} strokeWidth="0.8" className="draw" />
      <circle cx="200" cy="200" r="100" stroke={lav} strokeWidth="1" className="draw" />

      {/* Cardinal marks */}
      <line x1="200" y1="55" x2="200" y2="75" stroke={lime} strokeWidth="1.2" className="draw-delay" />
      <line x1="200" y1="325" x2="200" y2="345" stroke={faint} strokeWidth="0.8" className="draw-delay" />
      <line x1="55" y1="200" x2="75" y2="200" stroke={faint} strokeWidth="0.8" className="draw-delay" />
      <line x1="325" y1="200" x2="345" y2="200" stroke={faint} strokeWidth="0.8" className="draw-delay" />

      {/* Compass needle pointing up/north */}
      <polygon points="200,100 188,210 200,190 212,210" stroke={lime} strokeWidth="1" className="draw-delay" fill="none" />
      <polygon points="200,100 200,190 212,210" fill={dimLime} className="fade" />

      {/* South half of needle */}
      <polygon points="200,300 188,190 200,210 212,190" stroke={dimLav} strokeWidth="0.6" className="draw-delay" fill="none" />

      {/* Center pivot */}
      <circle cx="200" cy="200" r="6" fill={lime} className="dot" />

      {/* "N" label */}
      <text x="200" y="48" textAnchor="middle" fill={lime} fontSize="14" fontFamily="'IBM Plex Mono', monospace" fontWeight="500" className="fade-delay">N</text>

      {/* Tick marks */}
      {[45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r1 = 95, r2 = 105;
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={deg}
            x1={200 + r1 * Math.sin(rad)} y1={200 - r1 * Math.cos(rad)}
            x2={200 + r2 * Math.sin(rad)} y2={200 - r2 * Math.cos(rad)}
            stroke={faint} strokeWidth="0.6" className="draw-delay"
          />
        );
      })}
    </AnimatedSVG>
  );
}

/*
  ENVISION: People around a table/whiteboard with sticky notes
  Story: Collaborative workshops mapping out possibilities
*/
function PictogramEnvision({ visible }) {
  return (
    <AnimatedSVG visible={visible}>
      {/* Whiteboard/canvas */}
      <rect x="100" y="80" width="200" height="140" rx="4" stroke={lav} strokeWidth="1" className="draw" />

      {/* Sticky notes on the board */}
      <rect x="120" y="100" width="40" height="35" rx="2" stroke={lime} strokeWidth="0.8" className="draw-delay" />
      <rect x="175" y="95" width="40" height="35" rx="2" stroke={lime} strokeWidth="0.8" className="draw-delay" />
      <rect x="230" y="100" width="40" height="35" rx="2" stroke={lav} strokeWidth="0.8" className="draw-delay" />
      <rect x="145" y="155" width="40" height="35" rx="2" stroke={lav} strokeWidth="0.8" className="draw-delay" />
      <rect x="205" y="150" width="40" height="35" rx="2" stroke={lime} strokeWidth="0.8" className="draw-delay" />

      {/* Lines inside sticky notes (text) */}
      <line x1="126" y1="112" x2="152" y2="112" stroke={dimLime} strokeWidth="0.5" className="draw-delay" />
      <line x1="126" y1="120" x2="148" y2="120" stroke={dimLime} strokeWidth="0.5" className="draw-delay" />
      <line x1="181" y1="107" x2="207" y2="107" stroke={dimLime} strokeWidth="0.5" className="draw-delay" />
      <line x1="181" y1="115" x2="203" y2="115" stroke={dimLime} strokeWidth="0.5" className="draw-delay" />

      {/* Person 1 (left) */}
      <circle cx="110" cy="280" r="16" stroke={lime} strokeWidth="0.8" className="draw-delay" />
      <path d="M85 330 Q85 300 110 300 Q135 300 135 330" stroke={lime} strokeWidth="0.8" className="draw-delay" fill="none" />

      {/* Person 2 (center) */}
      <circle cx="200" cy="275" r="16" stroke={lav} strokeWidth="0.8" className="draw-delay" />
      <path d="M175 325 Q175 295 200 295 Q225 295 225 325" stroke={lav} strokeWidth="0.8" className="draw-delay" fill="none" />

      {/* Person 3 (right) */}
      <circle cx="290" cy="280" r="16" stroke={lime} strokeWidth="0.8" className="draw-delay" />
      <path d="M265 330 Q265 300 290 300 Q315 300 315 330" stroke={lime} strokeWidth="0.8" className="draw-delay" fill="none" />

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
  return (
    <AnimatedSVG visible={visible}>
      {/* Device screen */}
      <rect x="60" y="70" width="170" height="240" rx="6" stroke={lav} strokeWidth="1.2" className="draw" />
      {/* Screen top bar */}
      <line x1="60" y1="100" x2="230" y2="100" stroke={dimLav} strokeWidth="0.6" className="draw" />

      {/* UI elements on screen */}
      <rect x="80" y="115" width="130" height="12" rx="2" stroke={faint} strokeWidth="0.5" className="draw-delay" />
      <rect x="80" y="140" width="130" height="50" rx="2" stroke={dimLime} strokeWidth="0.6" className="draw-delay" />
      <rect x="80" y="205" width="55" height="20" rx="3" stroke={lime} strokeWidth="0.8" className="draw-delay" />
      <rect x="145" y="205" width="55" height="20" rx="3" stroke={faint} strokeWidth="0.5" className="draw-delay" />

      {/* Touch/click indicator (finger tap) */}
      <circle cx="107" cy="215" r="12" stroke={lime} strokeWidth="0.6" className="pulse" fill="none" />
      <circle cx="107" cy="215" r="4" fill={lime} className="dot" />

      {/* Person (tester) on the right */}
      <circle cx="310" cy="160" r="20" stroke={lav} strokeWidth="0.8" className="draw-delay" />
      <path d="M282 220 Q282 185 310 185 Q338 185 338 220" stroke={lav} strokeWidth="0.8" className="draw-delay" fill="none" />

      {/* Feedback loop arrow from person back to screen */}
      <path d="M285 230 Q200 310 100 310 Q60 310 60 280" stroke={lime} strokeWidth="0.8" className="draw-delay" fill="none" strokeDasharray="4 3" />
      <polyline points="55,288 60,275 68,286" stroke={lime} strokeWidth="0.8" className="draw-delay" fill="none" />

      {/* Feedback speech bubbles */}
      <circle cx="330" cy="120" r="3" fill={lime} className="dot-delay" />
      <circle cx="345" cy="108" r="3" fill={lime} className="dot-delay" />
      <circle cx="355" cy="90" r="8" stroke={lime} strokeWidth="0.6" className="draw-delay" />
      <line x1="350" y1="88" x2="360" y2="88" stroke={lime} strokeWidth="0.5" className="draw-delay" />
      <line x1="349" y1="93" x2="358" y2="93" stroke={lime} strokeWidth="0.5" className="draw-delay" />
    </AnimatedSVG>
  );
}

/*
  REFINE: Before/after with polish details, slider in between
  Story: Sweating the details, polishing micro-interactions
*/
function PictogramRefine({ visible }) {
  return (
    <AnimatedSVG visible={visible}>
      {/* "Before" rough shape (left) */}
      <rect x="40" y="100" width="130" height="180" rx="4" stroke={faint} strokeWidth="0.8" className="draw" />
      <text x="105" y="90" textAnchor="middle" fill={faint} fontSize="11" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">before</text>
      {/* Rough content */}
      <rect x="55" y="125" width="100" height="10" rx="2" stroke={faint} strokeWidth="0.4" className="draw-delay" />
      <rect x="55" y="150" width="100" height="40" rx="2" stroke={faint} strokeWidth="0.4" className="draw-delay" />
      <rect x="55" y="205" width="60" height="14" rx="2" stroke={faint} strokeWidth="0.5" className="draw-delay" />
      {/* Rough edges (jagged line) */}
      <polyline points="55,245 70,240 80,250 95,238 110,248 125,240 140,245" stroke={faint} strokeWidth="0.5" className="draw-delay" fill="none" />

      {/* Center divider / slider */}
      <line x1="200" y1="80" x2="200" y2="300" stroke={lime} strokeWidth="1" className="draw" />
      <circle cx="200" cy="190" r="8" stroke={lime} strokeWidth="1" fill="#00330f" className="draw" />
      <polyline points="195,188 199,192 195,196" stroke={lime} strokeWidth="0.6" fill="none" className="draw-delay" />
      <polyline points="205,188 201,192 205,196" stroke={lime} strokeWidth="0.6" fill="none" className="draw-delay" />

      {/* "After" polished shape (right) */}
      <rect x="230" y="100" width="130" height="180" rx="8" stroke={lav} strokeWidth="1.2" className="draw" />
      <text x="295" y="90" textAnchor="middle" fill={lav} fontSize="11" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">after</text>
      {/* Clean content */}
      <rect x="248" y="125" width="95" height="10" rx="3" stroke={lav} strokeWidth="0.6" className="draw-delay" />
      <rect x="248" y="150" width="95" height="40" rx="4" stroke={lav} strokeWidth="0.6" className="draw-delay" />
      <rect x="248" y="205" width="55" height="14" rx="7" stroke={lime} strokeWidth="0.8" className="draw-delay" />
      {/* Sparkle/polish indicator */}
      <line x1="320" y1="210" x2="320" y2="222" stroke={lime} strokeWidth="0.6" className="draw-delay" />
      <line x1="314" y1="216" x2="326" y2="216" stroke={lime} strokeWidth="0.6" className="draw-delay" />

      {/* Smooth curve (refined) */}
      <path d="M248 245 Q270 235 295 245 Q320 255 343 245" stroke={lav} strokeWidth="0.6" className="draw-delay" fill="none" />
    </AnimatedSVG>
  );
}

/*
  EVOLVE: Growth chart with upward trend, branching iterations
  Story: Measuring, learning, the experience keeps growing
*/
function PictogramEvolve({ visible }) {
  return (
    <AnimatedSVG visible={visible}>
      {/* Axis lines */}
      <line x1="70" y1="330" x2="350" y2="330" stroke={faint} strokeWidth="0.8" className="draw" />
      <line x1="70" y1="330" x2="70" y2="70" stroke={faint} strokeWidth="0.8" className="draw" />

      {/* Grid lines */}
      {[130, 195, 260].map(y => (
        <line key={y} x1="70" y1={y} x2="350" y2={y} stroke={faint} strokeWidth="0.3" strokeDasharray="3 4" className="draw-delay" />
      ))}

      {/* Growth curve */}
      <path d="M80 310 Q130 300 160 280 Q200 250 230 200 Q260 160 290 130 Q310 110 340 85"
        stroke={lime} strokeWidth="1.8" className="draw-slow" fill="none" strokeLinecap="round" />

      {/* Data points on the curve */}
      <circle cx="160" cy="280" r="4" fill={lime} className="dot" />
      <circle cx="230" cy="200" r="4" fill={lime} className="dot-delay" />
      <circle cx="290" cy="130" r="5" fill={lime} className="dot-delay" />
      <circle cx="340" cy="85" r="6" fill={lime} className="dot-delay" />

      {/* Iteration markers (version labels) */}
      <text x="160" y="300" textAnchor="middle" fill={dimLime} fontSize="9" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">v1</text>
      <text x="230" y="220" textAnchor="middle" fill={dimLime} fontSize="9" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">v2</text>
      <text x="290" y="150" textAnchor="middle" fill={lime} fontSize="9" fontFamily="'IBM Plex Mono', monospace" className="fade-delay">v3</text>
      <text x="340" y="75" textAnchor="middle" fill={lime} fontSize="10" fontFamily="'IBM Plex Mono', monospace" fontWeight="500" className="fade-delay">v4</text>

      {/* Small upward arrow at the end */}
      <polyline points="335,80 340,68 345,80" stroke={lime} strokeWidth="0.8" fill="none" className="draw-delay" />

      {/* User count growing (small person icons along bottom) */}
      <circle cx="130" cy="355" r="5" stroke={dimLav} strokeWidth="0.5" className="draw-delay" />
      <circle cx="200" cy="355" r="5" stroke={dimLav} strokeWidth="0.5" className="draw-delay" />
      <circle cx="210" cy="355" r="5" stroke={dimLav} strokeWidth="0.5" className="draw-delay" />
      <circle cx="275" cy="355" r="5" stroke={lav} strokeWidth="0.5" className="draw-delay" />
      <circle cx="285" cy="355" r="5" stroke={lav} strokeWidth="0.5" className="draw-delay" />
      <circle cx="295" cy="355" r="5" stroke={lav} strokeWidth="0.5" className="draw-delay" />
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
              <ShuffleText text={line} className="process-panel__title-line" />
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
