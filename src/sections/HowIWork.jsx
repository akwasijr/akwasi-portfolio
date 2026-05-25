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

const steps = [
  {
    title: 'Discover',
    desc: 'Listen before designing. Stakeholder interviews, user research, landscape analysis. Understand the people, the friction, and the real problem beneath the brief.',
  },
  {
    title: 'Define',
    desc: 'Frame the challenge clearly. Align on what success looks like, who it serves, and what constraints matter. Speed is easy. Definition makes sure we\'re building the right thing.',
  },
  {
    title: 'Envision',
    desc: 'Workshops, journey maps, and design thinking. Map where intelligence meets real human needs. Use delegation ladders and trust models to shape how people and AI work together.',
  },
  {
    title: 'Prototype & Test',
    desc: 'Tangible concepts people can react to, not decks or wireframes in isolation. Test with real users early. When tools can generate anything, knowing what to keep matters most.',
  },
  {
    title: 'Refine',
    desc: 'Iterate on what the testing reveals. Sweat the details that build trust: micro-interactions, error states, moments of delight. Good design is invisible until it isn\'t.',
  },
  {
    title: 'Evolve',
    desc: 'Design doesn\'t end at handoff. Measure, learn, adapt. The best experiences are living systems that grow with their users, not static deliverables that gather dust.',
  },
];

function GridCard({ step, index }) {
  const ref = useRef(null);
  const visible = useScrollVisible(ref, 0.2);
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      className="process-card"
      animate={visible
        ? { opacity: 1, y: 0, filter: 'blur(0px)' }
        : { opacity: 0, y: 40, filter: 'blur(8px)' }
      }
      transition={{ duration: 0.7, delay: (index % 2) * 0.12, ease }}
    >
      <span className="process-card__num">{num}</span>
      <h3 className="process-card__title">{step.title.replace('\n', ' ')}</h3>
      <p className="process-card__desc">{step.desc}</p>
    </motion.div>
  );
}

/* ─── COMBINED SECTION ─── */

export default function HowIWorkSection() {
  const introRef = useRef(null);
  const introVisible = useScrollVisible(introRef, 0.3);

  return (
    <div style={{ position: 'relative', background: '#00330f' }}>
      <Starfield count={25} />

      {/* Section intro */}
      <div ref={introRef} className="pj-intro">
        <motion.p
          className="pj-intro__label"
          animate={introVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease }}
        >
          Process
        </motion.p>
        <h2 className="pj-intro__heading">
          {['Design that', 'starts with', 'people'].map((line, i) => (
            <span key={i} style={{ overflow: 'hidden', display: 'block' }}>
              <motion.span
                style={{ display: 'block' }}
                animate={introVisible ? { y: 0 } : { y: '120%' }}
                transition={{ duration: 1, delay: 0.1 + i * 0.14, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>
      </div>

      {/* Intro paragraph */}
      <section style={{
        padding: 'clamp(24px, 5vw, 48px) clamp(24px, 5vw, 80px)',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <motion.p
          style={{ fontSize: '16px', lineHeight: 1.7, color: 'rgba(255,255,255,0.5)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease }}
        >
          Every project starts the same way: understanding people. What they need, where they struggle, what would make their work feel effortless. I shape experiences through research, prototyping, and testing, making sure what gets built actually works for the people using it.
        </motion.p>
      </section>

      {/* 2×3 Grid */}
      <div className="process-grid">
        {steps.map((step, i) => (
          <GridCard key={i} step={step} index={i} />
        ))}
      </div>
    </div>
  );
}
