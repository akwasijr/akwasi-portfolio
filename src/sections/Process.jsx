import { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Starfield from '../components/Starfield';

const steps = [
  {
    icon: '/assets/icons/01.svg',
    title: 'Understand\nthe Problem',
    desc: 'I start by understanding business goals, user needs, and the technical landscape. Together we define the challenge and align on what success looks like.',
  },
  {
    icon: '/assets/icons/02.svg',
    title: 'Story\nand Vision',
    desc: 'I craft a compelling narrative that connects goals to capabilities, building a shared vision that resonates with stakeholders at every level.',
  },
  {
    icon: '/assets/icons/03.svg',
    title: 'Solution\nEnvisioning',
    desc: 'Through workshops and design thinking I explore possibilities, map user journeys, and define the solution space where AI meets real human needs.',
  },
  {
    icon: '/assets/icons/04.svg',
    title: 'Rapid\nPrototyping',
    desc: 'Using AI-paired development I rapidly build functional prototypes that bring ideas to life. Real code, real interactions, validated in days not months.',
  },
  {
    icon: '/assets/icons/05.svg',
    title: 'Design\nSystem',
    desc: 'I synthesize requirements into scalable design systems and component libraries. Consistency, accessibility, and brand alignment built in from the start.',
  },
  {
    icon: '/assets/icons/06.svg',
    title: 'Ship\nand Iterate',
    desc: 'Production-grade code and pixel-perfect handoffs. I ensure the design intent survives to production and the team can extend and scale the experience.',
  },
];

const ease = [0.22, 1, 0.36, 1];

// Hook that works inside overlay scroll containers
function useScrollVisible(ref, threshold = 0.2) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Find the scrollable overlay ancestor
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

// SVG icon: stroke draws in on scroll, then fills to original colors
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

  // Animate stroke draw, then after it finishes, show fill
  useEffect(() => {
    const el = strokeRef.current;
    if (!el || !strokeSvg) return;

    const paths = el.querySelectorAll('path, circle, rect, line, polyline, polygon');

    if (visible) {
      // Draw stroke left→right (offset from +len to 0)
      setDrawn(false);
      paths.forEach(path => {
        try {
          const len = path.getTotalLength();
          path.style.strokeDasharray = len;
          path.style.transition = 'none';
          path.style.strokeDashoffset = String(len);
          // Force reflow then animate
          path.getBoundingClientRect();
          path.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
          path.style.strokeDashoffset = '0';
        } catch (e) {}
      });
      const timer = setTimeout(() => setDrawn(true), 1300);
      return () => clearTimeout(timer);
    } else {
      // Close stroke right→left (offset from 0 to -len)
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
          style={{
            opacity: drawn ? 0 : 1,
            transition: drawn ? 'opacity 1s ease 0.4s' : 'none',
          }}
          dangerouslySetInnerHTML={{ __html: strokeSvg }}
        />
      )}
      {/* Filled original — fades in only after stroke is done drawing */}
      {originalSvg && (
        <div
          className="pj-icon-fill"
          style={{
            opacity: drawn ? 1 : 0,
            transition: drawn ? 'opacity 1.2s cubic-bezier(0.22,1,0.36,1)' : 'none',
          }}
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
      {/* Stroke-animated SVG icon */}
      <div className="pj-step__icon-wrap">
        <StrokeIcon src={step.icon} visible={visible} />
      </div>

      {/* Text content */}
      <div className="pj-step__content">
        <motion.h3
          className="pj-step__title"
          animate={visible
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 70, filter: 'blur(12px)' }
          }
          transition={{ duration: 0.8, ease }}
        >
          {step.title.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </motion.h3>
        <motion.p
          className="pj-step__desc"
          animate={visible
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 40 }
          }
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          {step.desc}
        </motion.p>
      </div>
    </div>
  );
}

function JourneyIntro() {
  const ref = useRef(null);
  const visible = useScrollVisible(ref, 0.3);

  const headingLines = ['From problem', 'exploration', 'to working product'];

  return (
    <div ref={ref} className="pj-intro">
      <motion.p
        className="pj-intro__label"
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease }}
      >
        My process
      </motion.p>
      <h2 className="pj-intro__heading">
        {headingLines.map((line, i) => (
          <span key={i} style={{ overflow: 'hidden', display: 'block' }}>
            <motion.span
              style={{ display: 'block' }}
              animate={visible ? { y: 0 } : { y: '120%' }}
              transition={{ duration: 1, delay: 0.1 + i * 0.14, ease }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>
      <motion.p
        className="pj-intro__sub"
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      >
        Scroll to explore each stage of our journey
      </motion.p>
    </div>
  );
}

export default function ProcessSection() {
  const timelineRef = useRef(null);

  return (
    <div className="pj-wrapper">
      <Starfield count={25} />

      <JourneyIntro />

      <div className="pj-timeline" ref={timelineRef}>
        <ScrollPath wrapperRef={timelineRef} />

        {steps.map((step, i) => (
          <JourneyStep key={i} step={step} index={i} />
        ))}
      </div>
    </div>
  );
}
