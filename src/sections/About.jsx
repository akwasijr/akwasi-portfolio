import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Starfield from '../components/Starfield';

const disciplines = [
  { abbr: 'AI', name: 'AI Experience Design', color: '#8df0c6',
    details: 'Designing copilot interfaces, agent UX patterns and AI-powered dashboards for enterprise clients. Created the Agent Experience Design Framework covering trust building, delegation models and approval flows. Facilitating AI design workshops using delegation ladders, trust batteries and blast radius mapping.' },
  { abbr: 'UX', name: 'Product Design', color: '#9b9dff',
    details: 'End-to-end product design from research to high-fidelity UI. Data dashboards, SaaS platforms, design systems and component libraries. Built 20+ industry-specific templates for rapid prototyping across banking, healthcare, energy and government. Strong in information architecture, interaction design and design-to-dev handoff.' },
  { abbr: 'DEV', name: 'Product Strategy', color: '#c4c4ff',
    details: 'Bridging design and engineering through prototyping in code, building design frameworks and defining product vision. Leading cross-functional teams translating business goals into shipped product. Defined the AI-first methodology reshaping how design teams integrate AI across the full project lifecycle.' },
];

const ease = [0.22, 1, 0.36, 1];

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

/* ── Outline Portrait Pictogram (stroke-only, mouse-reactive eyes) ── */
function PixelPortrait({ active }) {
  const svgRef = useRef(null);
  const [eyeOff, setEyeOff] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e) {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.32;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      const clamp = (v, max) => Math.max(-max, Math.min(max, v));
      setEyeOff({ x: clamp(dx * 2.2, 2.2), y: clamp(dy * 1.5, 1.5) });
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const s1 = active ? '#8df0c6' : 'rgba(141,240,198,0.18)';
  const s2 = active ? '#9b9dff' : 'rgba(155,157,255,0.18)';
  const s3 = active ? '#c4c4ff' : 'rgba(196,196,255,0.18)';
  const faint = active ? 'rgba(141,240,198,0.10)' : 'rgba(141,240,198,0.04)';
  const sw = active ? 0.55 : 0.3;
  const swThin = active ? 0.35 : 0.2;

  return (
    <svg ref={svgRef} viewBox="0 0 100 130" width={280} height={364} style={{ display: 'block' }}>

      {/* Head */}
      <motion.path
        d="M50,2 Q68,2 76,14 Q82,24 82,38 L82,52
           Q82,62 78,70 L72,80
           Q66,88 60,92 L50,96
           L40,92 Q34,88 28,80
           L22,70 Q18,62 18,52 L18,38
           Q18,24 24,14 Q32,2 50,2 Z"
        fill="none" stroke={s1} strokeWidth={sw} strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 1.2, ease }}
      />

      {/* Hairline */}
      <motion.path
        d="M24,20 Q26,12 32,7 Q40,3 50,3 Q60,3 68,7 Q74,12 76,20"
        fill="none" stroke={s1} strokeWidth={sw}
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease }}
      />
      {/* Shape-up corners */}
      <motion.path
        d="M24,20 L26,17 L29,20 M71,20 L74,17 L76,20"
        fill="none" stroke={s1} strokeWidth={swThin} strokeLinecap="round"
        initial={{ opacity: 0 }} animate={{ opacity: active ? 0.8 : 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
      />

      {/* Left ear */}
      <motion.path
        d="M18,38 Q14,38 13,42 Q12.5,46 13,49 Q14,52 18,52"
        fill="none" stroke={s1} strokeWidth={swThin}
        initial={{ opacity: 0 }} animate={{ opacity: active ? 0.7 : 0 }}
        transition={{ duration: 0.3, delay: 0.45 }}
      />
      {/* Right ear */}
      <motion.path
        d="M82,38 Q86,38 87,42 Q87.5,46 87,49 Q86,52 82,52"
        fill="none" stroke={s1} strokeWidth={swThin}
        initial={{ opacity: 0 }} animate={{ opacity: active ? 0.7 : 0 }}
        transition={{ duration: 0.3, delay: 0.45 }}
      />

      {/* Left brow */}
      <motion.path
        d="M28,33 Q33,28 44,31"
        fill="none" stroke={s2} strokeWidth={sw} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.55, ease }}
      />
      {/* Right brow */}
      <motion.path
        d="M56,31 Q67,28 72,33"
        fill="none" stroke={s2} strokeWidth={sw} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.58, ease }}
      />

      {/* Left eye — upper lid */}
      <motion.path
        d="M29,39 Q33,34 37,34 Q41,34 45,39"
        fill="none" stroke={s2} strokeWidth={sw} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.35, delay: 0.62 }}
      />
      {/* Left eye — lower lid */}
      <motion.path
        d="M29,39 Q33,43 37,43.5 Q41,43 45,39"
        fill="none" stroke={s2} strokeWidth={sw} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.66 }}
      />
      {/* Left pupil */}
      <motion.circle
        cx={37 + eyeOff.x} cy={39 + eyeOff.y} r={2}
        fill={s2} stroke="none"
        initial={{ scale: 0 }} animate={{ scale: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.7 }}
      />

      {/* Right eye — upper lid */}
      <motion.path
        d="M55,39 Q59,34 63,34 Q67,34 71,39"
        fill="none" stroke={s2} strokeWidth={sw} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.35, delay: 0.62 }}
      />
      {/* Right eye — lower lid */}
      <motion.path
        d="M55,39 Q59,43 63,43.5 Q67,43 71,39"
        fill="none" stroke={s2} strokeWidth={sw} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.66 }}
      />
      {/* Right pupil */}
      <motion.circle
        cx={63 + eyeOff.x} cy={39 + eyeOff.y} r={2}
        fill={s2} stroke="none"
        initial={{ scale: 0 }} animate={{ scale: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.7 }}
      />

      {/* Nose */}
      <motion.path
        d="M44,50 Q41,55 38,58 Q42,61 50,61.5 Q58,61 62,58 Q59,55 56,50"
        fill="none" stroke={s2} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.78, ease }}
      />

      {/* Upper lip */}
      <motion.path
        d="M36,73 Q40,71 45,73 Q48,69 50,69 Q52,69 55,73 Q60,71 64,73"
        fill="none" stroke={s2} strokeWidth={sw} strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.88, ease }}
      />
      {/* Lower lip */}
      <motion.path
        d="M36,73 Q42,80 50,81 Q58,80 64,73"
        fill="none" stroke={s2} strokeWidth={sw} strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.35, delay: 0.93, ease }}
      />

      {/* Jawline stubble */}
      <motion.path
        d="M22,64 Q24,72 26,78 Q30,84 34,88 Q38,91 42,93"
        fill="none" stroke={s1} strokeWidth={swThin} strokeDasharray="1.5 2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.98, ease }}
      />
      <motion.path
        d="M58,93 Q62,91 66,88 Q70,84 74,78 Q76,72 78,64"
        fill="none" stroke={s1} strokeWidth={swThin} strokeDasharray="1.5 2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.98, ease }}
      />
      {/* Chin stubble */}
      <motion.path
        d="M42,93 Q46,95 50,95.5 Q54,95 58,93"
        fill="none" stroke={s1} strokeWidth={swThin} strokeDasharray="1 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 1.04, ease }}
      />

      {/* Neck */}
      <motion.path
        d="M42,94 Q41,100 40,108"
        fill="none" stroke={s1} strokeWidth={swThin}
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 1.08 }}
      />
      <motion.path
        d="M58,94 Q59,100 60,108"
        fill="none" stroke={s1} strokeWidth={swThin}
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 1.08 }}
      />

      {/* Shoulders */}
      <motion.path
        d="M10,128 L14,118 Q20,111 32,108 L40,108
           Q46,110 50,113
           Q54,110 60,108
           L68,108 Q80,111 86,118 L90,128"
        fill="none" stroke={s3} strokeWidth={sw} strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.12, ease }}
      />
      {/* Collar */}
      <motion.path
        d="M40,108 Q44,112 50,114 Q56,112 60,108"
        fill="none" stroke={s3} strokeWidth={sw} strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 1.2, ease }}
      />
    </svg>
  );
}

function BigStatement({ inView }) {
  const lines = [
    { text: 'I work at the intersection of ' },
    { text: '', em: 'AI, design and product', after: '.' },
    { text: 'Turning complex AI capabilities' },
    { text: 'into things people can actually use.' },
    { text: 'Copilot experiences, agent interfaces,' },
    { text: 'data dashboards, design frameworks.' },
    { text: 'From concept to production.' },
  ];

  return (
    <p className="editorial-statement__text">
      {lines.map((line, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'block' }}>
          <motion.span
            style={{ display: 'block' }}
            animate={inView ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease }}
          >
            {line.text}{line.em && <em>{line.em}</em>}{line.after}
          </motion.span>
        </span>
      ))}
    </p>
  );
}

function TeamSection() {
  const ref = useRef(null);
  const isInView = useScrollVisible(ref, 0.3);
  const [open, setOpen] = useState(null);

  return (
    <div ref={ref} className="editorial-team-section">
      <div className="editorial-team-section__divider" />
      <div className="editorial-team-section__header">
        <motion.h2
          className="editorial-team-section__title"
          animate={isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 40 }
          }
          transition={{ duration: 0.7, ease }}
        >
         Experience
        </motion.h2>
      </div>

      <div className="editorial-team-grid">
        {disciplines.map((d, i) => (
          <div key={d.abbr} className="discipline-card-wrap">
            <motion.div
              className="discipline-card"
              animate={isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="discipline-card__top">
                <div className="editorial-team-card__badge" style={{ borderColor: d.color }}>
                  {d.abbr}
                </div>
                <span className="editorial-team-card__name">{d.name}</span>
              </div>
            </motion.div>
            <motion.div
              className="discipline-card__details"
              initial={false}
              animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
              transition={{ duration: 0.35, ease }}
            >
              <p>{d.details}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

import TeamMap from '../components/TeamMap';

export default function AboutSection() {
  const heroRef = useRef(null);
  const heroVisible = useScrollVisible(heroRef, 0.2);

  return (
    <div className="editorial-page">
      <Starfield count={25} />

      <section ref={heroRef} className="about-hero-side">
        <div className="about-hero-side__text">
          <BigStatement inView={heroVisible} />
        </div>
        <div className="about-hero-side__portrait">
          <PixelPortrait active={heroVisible} />
        </div>
      </section>

      <TeamSection />
    </div>
  );
}
