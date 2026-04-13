import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Starfield from '../components/Starfield';

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

const pillars = [
  {
    title: 'Storytelling',
    desc: 'We motivate customer action towards AI transformation by aligning outcomes, visualizing custom AI experiences, and crafting inspiring stories.',
    bullets: [
      'Uncover real user problems early',
      'Translate strategy into clear experiences',
      'Storytelling, demos, and prototypes that make value tangible',
      'Reduce deal risk and accelerate decision making',
    ],
  },
  {
    title: 'Vibe Prototyping',
    desc: 'We couple accelerated AI first Design Thinking process with live AI powered prototyping to validate concepts and confirm outcomes prior to Build commitment.',
    bullets: [
      'Rapid exploration and prototyping',
      'Test, learn, and evolve experiences fast',
      'Balance user value, business value, and feasibility',
      'Accelerate Sprint 0 and early delivery momentum',
    ],
  },
  {
    title: 'Product Delivery',
    desc: 'We collaboratively design and build production-ready solutions, grounded in the vision and strategies established in earlier phases.',
    bullets: [
      'Design stays close to engineering, data science and security',
      'Validate early to reduce rework',
      'Ensure design and experience intent survives to production',
      'Scale consistent, production-ready experiences',
    ],
  },
];

function IntroSection() {
  const ref = useRef(null);
  const visible = useScrollVisible(ref, 0.3);

  const lines = [
    'We turn complex AI capabilities into intuitive,',
    'human-centered experiences that drive adoption,',
    'usage and measurable consumption (ACR).',
    'We embed design from early deal shaping through',
    'implementation, partnering closely with account',
    'teams, architects, and delivery leads.',
  ];

  return (
    <section ref={ref} className="section section--dark" style={{ minHeight: 'auto', padding: '120px 64px 80px' }}>
      <div className="section-inner" style={{ textAlign: 'center', maxWidth: '900px' }}>
        <motion.h2
          style={{
            fontSize: 'clamp(40px, 7vw, 80px)',
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            marginBottom: '48px',
          }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease }}
        >
          What We Do
        </motion.h2>
        <div>
          {lines.map((line, i) => (
            <span key={i} style={{ overflow: 'hidden', display: 'block' }}>
              <motion.span
                style={{
                  display: 'block',
                  fontSize: '18px',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.6)',
                }}
                animate={visible ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, index }) {
  const ref = useRef(null);
  const visible = useScrollVisible(ref, 0.2);

  return (
    <motion.div
      ref={ref}
      className="wwd-pillar"
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease }}
    >
      <h3 className="wwd-pillar__title">{pillar.title}</h3>
      <p className="wwd-pillar__desc">{pillar.desc}</p>
      <ul className="wwd-pillar__list">
        {pillar.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </motion.div>
  );
}

function PillarsSection() {
  const ref = useRef(null);
  const visible = useScrollVisible(ref, 0.15);

  return (
    <section ref={ref} className="section section--dark" style={{ minHeight: 'auto', padding: '40px 64px 120px' }}>
      <div className="section-inner">
        <div className="wwd-pillars-grid">
          {pillars.map((p, i) => (
            <PillarCard key={p.title} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WhatWeDoSection() {
  return (
    <div style={{ position: 'relative' }}>
      <Starfield count={25} />
      <IntroSection />
      <PillarsSection />
    </div>
  );
}
