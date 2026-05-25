import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];
const s = 'rgba(255,255,255,0.18)';
const s2 = 'rgba(255,255,255,0.08)';
const dot = 'rgba(255,255,255,0.9)';

function useScrollVisible(ref, threshold = 0.2) {
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

/* Discover: radar/compass with concentric rings + crosshairs + scanning dots */
function PictogramDiscover() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="process-pictogram">
      {/* Outer dashed ring */}
      <circle cx="200" cy="200" r="180" stroke={s} strokeWidth="0.8" strokeDasharray="4 3" />
      {/* Middle ring */}
      <circle cx="200" cy="200" r="130" stroke={s} strokeWidth="0.6" />
      {/* Inner ring */}
      <circle cx="200" cy="200" r="70" stroke={s} strokeWidth="0.8" />
      {/* Crosshairs */}
      <line x1="200" y1="20" x2="200" y2="120" stroke={s} strokeWidth="0.5" />
      <line x1="200" y1="280" x2="200" y2="380" stroke={s} strokeWidth="0.5" />
      <line x1="20" y1="200" x2="120" y2="200" stroke={s} strokeWidth="0.5" />
      <line x1="280" y1="200" x2="380" y2="200" stroke={s} strokeWidth="0.5" />
      {/* Scanner sweep line */}
      <line x1="200" y1="200" x2="320" y2="90" stroke={s} strokeWidth="0.6" />
      {/* Detected points */}
      <circle cx="280" cy="120" r="4" fill={dot} />
      <circle cx="310" cy="180" r="2.5" fill={dot} />
      <circle cx="140" cy="290" r="3" fill={dot} />
      <circle cx="170" cy="100" r="2" fill={dot} />
      {/* Compass triangle */}
      <polygon points="200,125 194,145 206,145" stroke={s} strokeWidth="0.6" fill="none" />
    </svg>
  );
}

/* Define: geometric grid with aligned nodes and structured connections */
function PictogramDefine() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="process-pictogram">
      {/* Outer circle context */}
      <circle cx="200" cy="200" r="180" stroke={s2} strokeWidth="0.6" strokeDasharray="4 3" />
      {/* Bounding frame */}
      <rect x="100" y="80" width="200" height="240" stroke={s} strokeWidth="0.8" />
      {/* Vertical center line */}
      <line x1="200" y1="80" x2="200" y2="320" stroke={s} strokeWidth="0.5" />
      {/* Horizontal divisions */}
      <line x1="100" y1="160" x2="300" y2="160" stroke={s2} strokeWidth="0.4" />
      <line x1="100" y1="240" x2="300" y2="240" stroke={s2} strokeWidth="0.4" />
      {/* Funnel shape: convergence */}
      <line x1="120" y1="100" x2="200" y2="200" stroke={s} strokeWidth="0.7" />
      <line x1="280" y1="100" x2="200" y2="200" stroke={s} strokeWidth="0.7" />
      <line x1="200" y1="200" x2="160" y2="300" stroke={s} strokeWidth="0.7" />
      <line x1="200" y1="200" x2="240" y2="300" stroke={s} strokeWidth="0.7" />
      {/* Key nodes */}
      <circle cx="120" cy="100" r="3" fill={dot} />
      <circle cx="280" cy="100" r="3" fill={dot} />
      <circle cx="200" cy="200" r="5" fill={dot} />
      <circle cx="160" cy="300" r="3" fill={dot} />
      <circle cx="240" cy="300" r="3" fill={dot} />
      {/* Arrows pointing up from bottom */}
      <line x1="200" y1="60" x2="200" y2="30" stroke={s} strokeWidth="0.6" />
      <polyline points="194,38 200,28 206,38" stroke={s} strokeWidth="0.6" fill="none" />
    </svg>
  );
}

/* Envision: interconnected constellation / network with orbital paths */
function PictogramEnvision() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="process-pictogram">
      {/* Orbital rings */}
      <ellipse cx="200" cy="200" rx="170" ry="100" stroke={s2} strokeWidth="0.5" transform="rotate(-20 200 200)" />
      <ellipse cx="200" cy="200" rx="170" ry="100" stroke={s2} strokeWidth="0.5" transform="rotate(40 200 200)" />
      <ellipse cx="200" cy="200" rx="170" ry="100" stroke={s2} strokeWidth="0.5" transform="rotate(100 200 200)" />
      {/* Center hub */}
      <circle cx="200" cy="200" r="24" stroke={s} strokeWidth="0.8" />
      <circle cx="200" cy="200" r="6" fill={dot} />
      {/* Constellation nodes */}
      <circle cx="100" cy="140" r="10" stroke={s} strokeWidth="0.6" />
      <circle cx="100" cy="140" r="3" fill={dot} />
      <circle cx="300" cy="150" r="8" stroke={s} strokeWidth="0.6" />
      <circle cx="300" cy="150" r="2.5" fill={dot} />
      <circle cx="140" cy="310" r="12" stroke={s} strokeWidth="0.6" />
      <circle cx="140" cy="310" r="3.5" fill={dot} />
      <circle cx="290" cy="280" r="7" stroke={s} strokeWidth="0.6" />
      <circle cx="290" cy="280" r="2" fill={dot} />
      <circle cx="200" cy="80" r="6" stroke={s} strokeWidth="0.6" />
      <circle cx="200" cy="80" r="2" fill={dot} />
      {/* Connection lines */}
      <line x1="110" y1="145" x2="190" y2="195" stroke={s} strokeWidth="0.4" />
      <line x1="292" y1="155" x2="215" y2="195" stroke={s} strokeWidth="0.4" />
      <line x1="148" y1="302" x2="192" y2="215" stroke={s} strokeWidth="0.4" />
      <line x1="285" y1="275" x2="215" y2="212" stroke={s} strokeWidth="0.4" />
      <line x1="200" y1="86" x2="200" y2="176" stroke={s} strokeWidth="0.4" />
    </svg>
  );
}

/* Prototype & Test: wireframe + iteration arrows */
function PictogramPrototype() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="process-pictogram">
      {/* Outer context ring */}
      <circle cx="200" cy="200" r="180" stroke={s2} strokeWidth="0.5" strokeDasharray="4 3" />
      {/* Screen frame */}
      <rect x="110" y="100" width="180" height="200" rx="4" stroke={s} strokeWidth="0.8" />
      {/* Top bar */}
      <line x1="110" y1="130" x2="290" y2="130" stroke={s} strokeWidth="0.5" />
      <circle cx="128" cy="115" r="4" stroke={s} strokeWidth="0.5" />
      <circle cx="142" cy="115" r="4" stroke={s} strokeWidth="0.5" />
      <circle cx="156" cy="115" r="4" stroke={s} strokeWidth="0.5" />
      {/* Content blocks */}
      <rect x="125" y="145" width="70" height="8" rx="2" stroke={s2} strokeWidth="0.4" />
      <rect x="125" y="165" width="150" height="40" rx="2" stroke={s2} strokeWidth="0.4" />
      <rect x="125" y="218" width="65" height="24" rx="2" stroke={s} strokeWidth="0.5" />
      <rect x="200" y="218" width="65" height="24" rx="2" stroke={s2} strokeWidth="0.4" />
      <rect x="125" y="255" width="150" height="6" rx="2" stroke={s2} strokeWidth="0.3" />
      <rect x="125" y="268" width="110" height="6" rx="2" stroke={s2} strokeWidth="0.3" />
      {/* Iteration cycle arrow (outside frame) */}
      <path d="M 310 160 A 80 80 0 0 1 310 260" stroke={s} strokeWidth="0.7" fill="none" />
      <polyline points="306,255 312,265 318,255" stroke={s} strokeWidth="0.6" fill="none" />
      {/* Test indicator dots */}
      <circle cx="330" cy="200" r="3" fill={dot} />
      <circle cx="340" cy="220" r="2" fill={dot} />
    </svg>
  );
}

/* Refine: precision instrument, concentric focus with detail markers */
function PictogramRefine() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="process-pictogram">
      {/* Outer dashed ring with tick marks */}
      <circle cx="200" cy="200" r="175" stroke={s} strokeWidth="0.6" strokeDasharray="2 4" />
      {/* Tick marks around outer ring */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10) * Math.PI / 180;
        const x1 = 200 + 165 * Math.cos(angle);
        const y1 = 200 + 165 * Math.sin(angle);
        const x2 = 200 + 175 * Math.cos(angle);
        const y2 = 200 + 175 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={s} strokeWidth="0.5" />;
      })}
      {/* Middle precision ring */}
      <circle cx="200" cy="200" r="110" stroke={s} strokeWidth="0.7" />
      {/* Inner focus ring */}
      <circle cx="200" cy="200" r="50" stroke={s} strokeWidth="0.8" />
      {/* Center target */}
      <circle cx="200" cy="200" r="8" fill={dot} fillOpacity="0.3" stroke={dot} strokeWidth="0.8" />
      <circle cx="200" cy="200" r="2.5" fill={dot} />
      {/* Alignment crosshairs (short) */}
      <line x1="200" y1="145" x2="200" y2="185" stroke={s} strokeWidth="0.4" />
      <line x1="200" y1="215" x2="200" y2="255" stroke={s} strokeWidth="0.4" />
      <line x1="145" y1="200" x2="185" y2="200" stroke={s} strokeWidth="0.4" />
      <line x1="215" y1="200" x2="255" y2="200" stroke={s} strokeWidth="0.4" />
      {/* Detail adjustment markers */}
      <polygon points="200,90 196,100 204,100" stroke={s} strokeWidth="0.5" fill="none" />
      <polygon points="310,200 300,196 300,204" stroke={s} strokeWidth="0.5" fill="none" />
      <polygon points="200,310 204,300 196,300" stroke={s} strokeWidth="0.5" fill="none" />
      <polygon points="90,200 100,204 100,196" stroke={s} strokeWidth="0.5" fill="none" />
    </svg>
  );
}

/* Evolve: expanding growth rings, outward radiation */
function PictogramEvolve() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="process-pictogram">
      {/* Growth rings expanding outward */}
      <circle cx="200" cy="200" r="40" stroke={s} strokeWidth="0.8" />
      <circle cx="200" cy="200" r="80" stroke={s} strokeWidth="0.6" />
      <circle cx="200" cy="200" r="120" stroke={s2} strokeWidth="0.5" />
      <circle cx="200" cy="200" r="160" stroke={s2} strokeWidth="0.4" strokeDasharray="6 4" />
      {/* Center seed */}
      <circle cx="200" cy="200" r="6" fill={dot} />
      {/* Outward arrows at cardinal points */}
      <line x1="200" y1="155" x2="200" y2="90" stroke={s} strokeWidth="0.6" />
      <polyline points="194,98 200,85 206,98" stroke={s} strokeWidth="0.6" fill="none" />
      <line x1="245" y1="200" x2="310" y2="200" stroke={s} strokeWidth="0.6" />
      <polyline points="302,194 315,200 302,206" stroke={s} strokeWidth="0.6" fill="none" />
      <line x1="200" y1="245" x2="200" y2="310" stroke={s} strokeWidth="0.6" />
      <polyline points="194,302 200,315 206,302" stroke={s} strokeWidth="0.6" fill="none" />
      <line x1="155" y1="200" x2="90" y2="200" stroke={s} strokeWidth="0.6" />
      <polyline points="98,194 85,200 98,206" stroke={s} strokeWidth="0.6" fill="none" />
      {/* Diagonal growth nodes */}
      <circle cx="260" cy="130" r="3" fill={dot} />
      <circle cx="130" cy="270" r="2.5" fill={dot} />
      <circle cx="290" cy="280" r="2" fill={dot} />
      <circle cx="120" cy="130" r="2" fill={dot} />
      {/* Connection from center to diagonal nodes */}
      <line x1="205" y1="195" x2="255" y2="135" stroke={s2} strokeWidth="0.3" />
      <line x1="195" y1="205" x2="135" y2="265" stroke={s2} strokeWidth="0.3" />
    </svg>
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

  return (
    <div ref={ref} className="process-panel">
      <div className="process-panel__text">
        <motion.h2
          className="process-panel__title"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.9, ease }}
        >
          {step.title.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </motion.h2>
        <motion.p
          className="process-panel__desc"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          {step.desc}
        </motion.p>
      </div>
      <motion.div
        className="process-panel__pictogram"
        animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 1, delay: 0.1, ease }}
      >
        <Pictogram />
      </motion.div>
    </div>
  );
}

/* ─── COMBINED SECTION ─── */

export default function HowIWorkSection() {
  const introRef = useRef(null);
  const introVisible = useScrollVisible(introRef, 0.3);

  return (
    <div className="process-section">
      {/* Section intro */}
      <div ref={introRef} className="process-intro">
        <motion.h2
          className="process-intro__heading"
          animate={introVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease }}
        >
          People-first<br />design process
        </motion.h2>
      </div>

      {/* Full-viewport panels */}
      {steps.map((step, i) => (
        <ProcessPanel key={i} step={step} index={i} />
      ))}
    </div>
  );
}
