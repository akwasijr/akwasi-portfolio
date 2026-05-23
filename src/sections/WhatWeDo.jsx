import { useRef, useEffect, useState, useCallback } from 'react';
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

/* Track scroll position within the overlay for parallax */
function useOverlayScroll() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const overlay = document.querySelector('.overlay');
    if (!overlay) return;
    const onScroll = () => setScrollY(overlay.scrollTop);
    overlay.addEventListener('scroll', onScroll, { passive: true });
    return () => overlay.removeEventListener('scroll', onScroll);
  }, []);
  return scrollY;
}

/* Scattered image placeholders — lower half, no cutoff */
const imagePlaceholders = [
  { top: '35%', left: '4%',   w: 200, h: 260, rotate: -3, delay: 0.15, label: 'Vision workshop', parallaxSpeed: 0.04 },
  { top: '28%', right: '5%',  w: 240, h: 170, rotate: 2,  delay: 0.25, label: 'AI prototype', parallaxSpeed: -0.03 },
  { top: '58%', left: '3%',   w: 170, h: 220, rotate: 2,  delay: 0.35, label: 'User research', parallaxSpeed: 0.05 },
  { top: '54%', right: '4%',  w: 220, h: 270, rotate: -2, delay: 0.2,  label: 'Design sprint', parallaxSpeed: -0.04 },
  { top: '76%', left: '10%',  w: 190, h: 150, rotate: -2, delay: 0.4,  label: 'Customer demo', parallaxSpeed: 0.06 },
  { top: '72%', right: '8%',  w: 250, h: 180, rotate: 1,  delay: 0.3,  label: 'Production build', parallaxSpeed: -0.05 },
];

function ImagePlaceholder({ style, w, h, rotate, delay, visible, label, parallaxY }) {
  return (
    <motion.div
      className="wwd-img-placeholder"
      style={{
        ...style,
        width: w,
        height: h,
        y: parallaxY,
      }}
      animate={visible
        ? { opacity: 1, rotate, scale: 1 }
        : { opacity: 0, rotate: rotate + 4, scale: 0.92 }
      }
      transition={{ duration: 0.9, delay, ease }}
    >
      <span className="wwd-img-placeholder__label">{label}</span>
    </motion.div>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const visible = useScrollVisible(ref, 0.15);
  const scrollY = useOverlayScroll();

  const headingLines = ['What', 'I Do'];

  return (
    <section ref={ref} className="wwd-hero">
      {imagePlaceholders.map((ph, i) => {
        const { top, left, right, w, h, rotate, delay, label, parallaxSpeed } = ph;
        const posStyle = {};
        if (top !== undefined) posStyle.top = top;
        if (left !== undefined) posStyle.left = left;
        if (right !== undefined) posStyle.right = right;
        const parallaxY = scrollY * parallaxSpeed;
        return (
          <ImagePlaceholder
            key={i}
            style={posStyle}
            w={w}
            h={h}
            rotate={rotate}
            delay={delay}
            visible={visible}
            label={label}
            parallaxY={parallaxY}
          />
        );
      })}

      <div className="wwd-hero__center">
        <h2 className="wwd-hero__heading">
          {headingLines.map((line, i) => (
            <span key={i} style={{ overflow: 'hidden', display: 'block' }}>
              <motion.span
                style={{ display: 'block' }}
                animate={visible ? { y: 0 } : { y: '120%' }}
                transition={{ duration: 1, delay: i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>
        <motion.p
          className="wwd-hero__subtitle"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          Translating complex AI capabilities into
          experiences people can actually use
        </motion.p>
      </div>
    </section>
  );
}

/* Full-bleed pillar section — each pillar gets its own viewport */
function PillarSection({ title, desc, bullets, flipped, imgLabel }) {
  const ref = useRef(null);
  const visible = useScrollVisible(ref, 0.15);
  const scrollY = useOverlayScroll();
  const sectionTop = useRef(0);

  useEffect(() => {
    if (ref.current) {
      sectionTop.current = ref.current.offsetTop;
    }
  }, []);

  const localProgress = Math.max(0, scrollY - sectionTop.current + 400);
  const imgParallax = localProgress * -0.06;

  return (
    <section ref={ref} className={'wwd-pillar' + (flipped ? ' wwd-pillar--flip' : '')}>
      {/* Text side */}
      <div className="wwd-pillar__text">
        <motion.h3
          className="wwd-pillar__title"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="wwd-pillar__desc"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
        >
          {desc}
        </motion.p>
        <ul className="wwd-pillar__list">
          {bullets.map((b, i) => (
            <motion.li
              key={i}
              animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: flipped ? -20 : 20 }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.1, ease }}
            >
              {b}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Image placeholder side */}
      <motion.div
        className="wwd-pillar__img"
        style={{ y: imgParallax }}
        animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.9, delay: 0.15, ease }}
      >
        <span className="wwd-pillar__img-label">{imgLabel}</span>
      </motion.div>
    </section>
  );
}

export default function WhatWeDoSection() {
  const scrollY = useOverlayScroll();
  const badgeY = scrollY * -0.08;

  return (
    <div style={{ position: 'relative', background: '#00330f' }}>
      <Starfield count={25} />

      {/* Circle badge — parallax + spin */}
      <motion.div
        className="wwd-badge-wrap"
        style={{ y: badgeY }}
      >
        <div
          role="presentation"
          className="wwd-badge"
          style={{
            width: '100%', height: '100%', borderRadius: '50%',
            background: '#00330f', border: '2px solid rgba(198,239,77,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700,
            fontSize: '24px', color: '#c6ef4d',
          }}
        >
          AF
        </div>
      </motion.div>

      <HeroSection />

      <PillarSection
        title="AI Experience Design"
        desc="I translate complex AI capabilities into experiences people can actually use: copilot interfaces, agent workflows, and intelligent dashboards for enterprise."
        bullets={[
          'Copilot and agent experience design',
          'AI-powered dashboards and data visualization',
          'Trust building and delegation models',
          'Workshop facilitation for AI strategy',
        ]}
        imgLabel="AI experience"
      />

      <PillarSection
        title="Building Real Products"
        desc="I bridge design and product: prototyping with code, building design systems, and shipping production-ready interfaces."
        bullets={[
          'React, TypeScript, Next.js, Tailwind',
          'Design systems with Fluent UI and Figma',
          'AI-first prototyping and vibe coding',
          'Electron apps and desktop tools',
        ]}
        flipped
        imgLabel="Code + design"
      />
    </div>
  );
}
