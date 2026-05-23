import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
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

/* ─── PILLARS (from WhatWeDo) ─── */

/* ─── PROCESS STEPS (from Process) ─── */

const steps = [
  {
    icon: '/assets/icons/01.svg',
    title: 'Understand\nthe Problem',
    desc: 'Business goals, user needs, technical landscape. Define the challenge and align on success.',
  },
  {
    icon: '/assets/icons/02.svg',
    title: 'Story\nand Vision',
    desc: 'Craft a narrative that connects goals to capabilities, a shared vision for every stakeholder.',
  },
  {
    icon: '/assets/icons/03.svg',
    title: 'Solution\nEnvisioning',
    desc: 'Workshops, user journeys, and design thinking to map where AI meets real human needs.',
  },
  {
    icon: '/assets/icons/04.svg',
    title: 'Rapid\nPrototyping',
    desc: 'Functional prototypes in days not months. Real code, real interactions, validated fast.',
  },
  {
    icon: '/assets/icons/05.svg',
    title: 'Design\nSystem',
    desc: 'Scalable component libraries. Consistency, accessibility, and brand alignment from the start.',
  },
  {
    icon: '/assets/icons/06.svg',
    title: 'Ship\nand Iterate',
    desc: 'Production-grade code. Design intent survives to production and scales with the team.',
  },
];

function StrokeIcon({ src, visible }) {
  const [originalSvg, setOriginalSvg] = useState(null);
  const [strokeSvg, setStrokeSvg] = useState(null);
  const strokeRef = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    fetch(src)
      .then(r => r.text())
      .then(text => {
        setOriginalSvg(text);
        const stroked = text
          .replace(/fill="(?!none)[^"]*"/g, 'fill="none"')
          .replace(/<path(?![^>]*stroke)/g, '<path stroke="#7779f0" stroke-width="0.7"')
          .replace(/<circle(?![^>]*stroke)/g, '<circle stroke="#7779f0" stroke-width="0.7"')
          .replace(/<rect(?![^>]*stroke)/g, '<rect stroke="#7779f0" stroke-width="0.7"');
        setStrokeSvg(stroked);
      });
  }, [src]);

  useEffect(() => {
    const el = strokeRef.current;
    if (!el || !strokeSvg) return;
    const paths = el.querySelectorAll('path, circle, rect, line, polyline, polygon');
    if (visible) {
      setDrawn(false);
      paths.forEach(path => {
        try {
          const len = path.getTotalLength();
          path.style.strokeDasharray = len;
          path.style.transition = 'none';
          path.style.strokeDashoffset = String(len);
          path.getBoundingClientRect();
          path.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
          path.style.strokeDashoffset = '0';
        } catch (e) {}
      });
      const timer = setTimeout(() => setDrawn(true), 1300);
      return () => clearTimeout(timer);
    } else {
      paths.forEach(path => {
        try {
          const len = path.getTotalLength();
          path.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)';
          path.style.strokeDashoffset = String(-len);
        } catch (e) {}
      });
      setTimeout(() => setDrawn(false), 100);
    }
  }, [visible, strokeSvg]);

  return (
    <div className="pj-step__icon" style={{ position: 'relative' }}>
      {strokeSvg && (
        <div
          ref={strokeRef}
          className="pj-icon-stroke"
          style={{ opacity: drawn ? 0 : 1, transition: drawn ? 'opacity 1s ease 0.4s' : 'none' }}
          dangerouslySetInnerHTML={{ __html: strokeSvg }}
        />
      )}
      {originalSvg && (
        <div
          className="pj-icon-fill"
          style={{ opacity: drawn ? 1 : 0, transition: drawn ? 'opacity 1.2s cubic-bezier(0.22,1,0.36,1)' : 'none' }}
          dangerouslySetInnerHTML={{ __html: originalSvg }}
        />
      )}
    </div>
  );
}

function ScrollPath({ wrapperRef }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const wrapper = wrapperRef.current;
    if (!path || !wrapper) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;

    const overlay = wrapper.closest('.overlay');
    const scroller = overlay || document.querySelector('.scroll-container') || window;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const viewH = window.innerHeight;
      const total = rect.height + viewH;
      const scrolled = viewH - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      path.style.strokeDashoffset = len * (1 - progress);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [wrapperRef]);

  const w = 1100;
  const stepH = 500;
  const totalH = stepH * 6;
  const cx = w / 2;
  const amp = 200;

  const points = steps.map((_, i) => {
    const y = stepH * i + stepH * 0.4;
    const x = i % 2 === 0 ? cx - amp : cx + amp;
    return { x, y };
  });

  let d = `M ${cx} 0`;
  points.forEach((p, i) => {
    const prevY = i === 0 ? 0 : points[i - 1].y;
    const prevX = i === 0 ? cx : points[i - 1].x;
    const cpY1 = prevY + (p.y - prevY) * 0.5;
    const cpY2 = prevY + (p.y - prevY) * 0.5;
    d += ` C ${prevX} ${cpY1}, ${p.x} ${cpY2}, ${p.x} ${p.y}`;
  });
  const lastP = points[points.length - 1];
  d += ` C ${lastP.x} ${lastP.y + 100}, ${cx} ${totalH - 50}, ${cx} ${totalH}`;

  return (
    <svg
      className="pj-svg-path"
      viewBox={`0 0 ${w} ${totalH}`}
      preserveAspectRatio="none"
      style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    >
      <path d={d} fill="none" stroke="rgba(198,239,77,0.08)" strokeWidth="2" />
      <path ref={pathRef} d={d} fill="none" stroke="#c6ef4d" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
  );
}

function JourneyStep({ step, index }) {
  const ref = useRef(null);
  const visible = useScrollVisible(ref, 0.2);
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={'pj-step' + (isEven ? '' : ' pj-step--alt')}>
      <div className="pj-step__icon-wrap">
        <StrokeIcon src={step.icon} visible={visible} />
      </div>
      <div className="pj-step__content">
        <motion.h3
          className="pj-step__title"
          animate={visible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 70, filter: 'blur(12px)' }}
          transition={{ duration: 0.8, ease }}
        >
          {step.title.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </motion.h3>
        <motion.p
          className="pj-step__desc"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          {step.desc}
        </motion.p>
      </div>
    </div>
  );
}

/* ─── COMBINED SECTION ─── */

export default function HowIWorkSection() {
  const timelineRef = useRef(null);
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
          How I work
        </motion.p>
        <h2 className="pj-intro__heading">
          {['From problem', 'to working', 'product'].map((line, i) => (
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

      {/* What I do — single condensed block */}
      <section ref={useRef(null)} style={{
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
          I design AI experiences: copilot interfaces, agent workflows, intelligent dashboards, and build them in production-grade code. React, TypeScript, Electron, design systems with Fluent UI and Figma. From workshop facilitation and strategy through to shipped product.
        </motion.p>
      </section>

      {/* Process timeline */}
      <div className="pj-timeline" ref={timelineRef}>
        <ScrollPath wrapperRef={timelineRef} />
        {steps.map((step, i) => (
          <JourneyStep key={i} step={step} index={i} />
        ))}
      </div>
    </div>
  );
}
