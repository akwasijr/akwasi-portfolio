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

function IntroSection() {
  const ref = useRef(null);
  const visible = useScrollVisible(ref, 0.3);

  const headingLines = ['What', 'We Do'];

  return (
    <section ref={ref} style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 48px 60px', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: '900px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '48px' }}>
          {headingLines.map((line, i) => (
            <span key={i} style={{ overflow: 'hidden', display: 'block' }}>
              <motion.span
                style={{
                  display: 'block',
                  fontSize: 'clamp(56px, 12vw, 140px)',
                  fontWeight: 700,
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                }}
                animate={visible ? { y: 0 } : { y: '120%' }}
                transition={{ duration: 1, delay: i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>
        <motion.p
          style={{ fontSize: '18px', lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', maxWidth: '700px', margin: '0 auto' }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          We turn complex AI capabilities into intuitive, human-centered
          experiences that drive adoption, usage, and measurable consumption.
          Design embedded from early deal shaping through implementation.
        </motion.p>
      </div>
    </section>
  );
}

function PillarBlock({ num, title, desc, bullets, flipped }) {
  const ref = useRef(null);
  const visible = useScrollVisible(ref, 0.2);

  return (
    <div ref={ref} className={'wwd-block' + (flipped ? ' wwd-block--flip' : '')}>
      <motion.div
        className="wwd-block__num-side"
        animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: flipped ? 40 : -40 }}
        transition={{ duration: 0.8, ease }}
      >
        <span className="wwd-block__num">{num}</span>
      </motion.div>
      <div className="wwd-block__content">
        <motion.h3
          className="wwd-block__title"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="wwd-block__desc"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          {desc}
        </motion.p>
        <motion.div
          className="wwd-block__divider"
          animate={visible ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          style={{ transformOrigin: flipped ? 'right' : 'left' }}
        />
        <ul className="wwd-block__list">
          {bullets.map((b, i) => (
            <motion.li
              key={i}
              animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.08, ease }}
            >
              {b}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function WhatWeDoSection() {
  return (
    <div style={{ position: 'relative', background: 'radial-gradient(ellipse at 50% 40%, #131620 0%, #0C0E13 70%)' }}>
      <Starfield count={25} />

      <IntroSection />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px 120px', position: 'relative', zIndex: 2 }}>
        <PillarBlock
          num="01"
          title="Storytelling"
          desc="We motivate customer action towards AI transformation by aligning outcomes, visualizing custom AI experiences, and crafting inspiring stories."
          bullets={[
            'Uncover real user problems early',
            'Translate strategy into clear experiences',
            'Demos and prototypes that make value tangible',
            'Reduce deal risk and accelerate decisions',
          ]}
        />
        <PillarBlock
          num="02"
          title="Product Delivery"
          desc="We collaboratively design and build production-ready solutions, grounded in the vision and strategies established in earlier phases."
          bullets={[
            'Design close to engineering and data science',
            'Validate early to reduce rework',
            'Experience intent survives to production',
            'Scale consistent, production-ready experiences',
          ]}
          flipped
        />
      </div>
    </div>
  );
}
