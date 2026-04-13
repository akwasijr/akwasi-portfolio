import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Starfield from '../components/Starfield';

const disciplines = [
  { abbr: 'PM', name: 'Product Management', color: '#F2A573' },
  { abbr: 'UXD', name: 'UX Designers', color: '#7E80EE' },
  { abbr: 'UXE', name: 'UX Engineers', color: '#1376BF' },
  { abbr: 'DS', name: 'Data Science', color: '#F45A9B' },
  { abbr: 'SEC', name: 'Security', color: '#4AA75F' },
  { abbr: 'TA', name: 'Technical Architects', color: '#F2A573' },
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

function VennDiagram() {
  const ref = useRef(null);
  const isInView = useScrollVisible(ref, 0.3);

  return (
    <div ref={ref} className="venn-wrap">
      <svg viewBox="0 0 600 400" className="venn-svg">
        {/* Left circle - Design */}
        <motion.circle
          cx="240" cy="200" r="160"
          fill="none" stroke="rgba(126,128,238,0.3)" strokeWidth="1.5"
          animate={isInView ? { r: 160, opacity: 1 } : { r: 80, opacity: 0 }}
          transition={{ duration: 1, ease }}
        />
        {/* Right circle - Engineering */}
        <motion.circle
          cx="360" cy="200" r="160"
          fill="none" stroke="rgba(126,128,238,0.3)" strokeWidth="1.5"
          animate={isInView ? { r: 160, opacity: 1 } : { r: 80, opacity: 0 }}
          transition={{ duration: 1, delay: 0.15, ease }}
        />
        {/* Intersection fill */}
        <motion.path
          d="M300,73.6 A160,160,0,0,1,300,326.4 A160,160,0,0,1,300,73.6Z"
          fill="#7E80EE"
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
        />
        {/* Labels */}
        <motion.text
          x="190" y="206" textAnchor="middle" fill="rgba(255,255,255,0.5)"
          fontSize="16" fontWeight="400"
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >Design</motion.text>
        <motion.text
          x="300" y="206" textAnchor="middle" fill="#fff"
          fontSize="16" fontWeight="600"
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >S42</motion.text>
        <motion.text
          x="410" y="206" textAnchor="middle" fill="rgba(255,255,255,0.5)"
          fontSize="16" fontWeight="400"
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >Engineering</motion.text>
      </svg>
    </div>
  );
}

function BigStatement() {
  const ref = useRef(null);
  const isInView = useScrollVisible(ref, 0.2);

  const lines = [
    { text: 'The idea behind ', em: 'Studio 42', after: ' is simple:' },
    { text: 'Turning complex AI capabilities' },
    { text: 'into human-centered experiences.' },
    { text: 'We validate feasibility from day one,' },
    { text: 'bridging vision with deep technical insight.' },
    { text: 'We are fast-paced, precise and strategic.' },
    { text: 'From pixel to production.' },
  ];

  return (
    <div ref={ref} className="editorial-statement">
      <p className="editorial-statement__text">
        {lines.map((line, i) => (
          <span key={i} style={{ overflow: 'hidden', display: 'block' }}>
            <motion.span
              style={{ display: 'block' }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease }}
            >
              {line.text}{line.em && <em>{line.em}</em>}{line.after}
            </motion.span>
          </span>
        ))}
      </p>
    </div>
  );
}

function TeamSection() {
  const ref = useRef(null);
  const isInView = useScrollVisible(ref, 0.3);

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
          Our Team
        </motion.h2>
        <motion.p
          className="editorial-team-section__sub"
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
        >
          Only the best in their field
        </motion.p>
        <motion.span
          className="editorial-team-section__count"
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          6 disciplines
        </motion.span>
      </div>

      <div className="editorial-team-grid">
        {disciplines.map((d, i) => (
          <motion.div
            key={d.abbr}
            className="editorial-team-card"
            animate={isInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease }}
          >
            <div className="editorial-team-card__badge" style={{ borderColor: d.color }}>
              {d.abbr}
            </div>
            <span className="editorial-team-card__name">{d.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import TeamMap from '../components/TeamMap';

export default function AboutSection() {
  return (
    <div className="editorial-page">
      <Starfield count={25} />

      <section className="editorial-hero">
        <VennDiagram />
      </section>

      <BigStatement />
      <TeamSection />
      <TeamMap />
    </div>
  );
}
