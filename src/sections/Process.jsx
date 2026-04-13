import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Starfield from '../components/Starfield';

const steps = [
  {
    icon: '/assets/icons/01.svg',
    title: 'Discovery\nand Alignment',
    desc: 'We start by understanding your business goals, customer needs, and technical landscape. Together we define the challenge and align on what success looks like.',
  },
  {
    icon: '/assets/icons/02.svg',
    title: 'Storytelling\nand Vision',
    desc: 'We craft a compelling narrative that connects your goals to Microsoft capabilities, building a shared vision that resonates with stakeholders at every level.',
  },
  {
    icon: '/assets/icons/03.svg',
    title: 'Solution\nEnvisioning',
    desc: 'Through collaborative workshops we explore possibilities, map user journeys, and define the solution space where technology meets real human needs.',
  },
  {
    icon: '/assets/icons/04.svg',
    title: 'Vibe\nPrototyping',
    desc: 'Using AI-paired development we rapidly build functional prototypes that bring ideas to life. Real code, real interactions, validated in days.',
  },
  {
    icon: '/assets/icons/05.svg',
    title: 'Architecture\nDesign',
    desc: 'We synthesize requirements into a scalable, Azure-native architecture blueprint. Security, performance, and integration built in from the start.',
  },
  {
    icon: '/assets/icons/06.svg',
    title: 'Delivery\nand Handoff',
    desc: 'Production-grade code, documentation, and knowledge transfer. We ensure your team is empowered to own, extend, and scale the solution forward.',
  },
];

const ease = [0.22, 1, 0.36, 1];

function ScrollPath({ wrapperRef }) {
  const pathRef = useRef(null);
  const [dashOffset, setDashOffset] = useState(1);

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
      const offset = len * (1 - progress);
      path.style.strokeDashoffset = offset;
      setDashOffset(1 - progress);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [wrapperRef]);

  // Build a curving S-path through 6 steps
  // Each step is ~500px tall, alternating left/right
  const w = 1100;
  const stepH = 500;
  const totalH = stepH * 6;
  const cx = w / 2; // center x
  const amp = 200;  // curve amplitude

  // Build cubic bezier S-curves
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
  // Extend to bottom
  const lastP = points[points.length - 1];
  d += ` C ${lastP.x} ${lastP.y + 100}, ${cx} ${totalH - 50}, ${cx} ${totalH}`;

  return (
    <svg
      className="pj-svg-path"
      viewBox={`0 0 ${w} ${totalH}`}
      preserveAspectRatio="none"
      style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    >
      {/* Ghost line */}
      <path d={d} fill="none" stroke="rgba(126,128,238,0.08)" strokeWidth="2" />
      {/* Drawing line */}
      <path ref={pathRef} d={d} fill="none" stroke="url(#pathGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7E80EE" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#1376BF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7E80EE" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function JourneyStep({ step, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25, margin: '-5% 0px -5% 0px' });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={'pj-step' + (isEven ? '' : ' pj-step--alt')}>
      {/* Big animated icon */}
      <motion.div
        className="pj-step__icon-wrap"
        animate={isInView
          ? { opacity: 1, scale: 1, rotate: 0, y: 0 }
          : { opacity: 0, scale: 0.3, rotate: -25, y: 40 }
        }
        transition={{ duration: 0.8, delay: 0.05, ease }}
      >
        <motion.img
          src={step.icon}
          alt=""
          className="pj-step__icon"
          animate={isInView ? { y: [0, -10, 0] } : { y: 0 }}
          transition={isInView
            ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
          }
        />
      </motion.div>

      {/* Text content */}
      <div className="pj-step__content">
        <motion.h3
          className="pj-step__title"
          animate={isInView
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
          animate={isInView
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
  const isInView = useInView(ref, { amount: 0.4 });

  return (
    <div ref={ref} className="pj-intro">
      <motion.p
        className="pj-intro__label"
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease }}
      >
        Our process
      </motion.p>
      <motion.h2
        className="pj-intro__heading"
        animate={isInView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y: 60, filter: 'blur(10px)' }
        }
        transition={{ duration: 0.8, delay: 0.1, ease }}
      >
        From problem exploration<br />to technical proof
      </motion.h2>
      <motion.p
        className="pj-intro__sub"
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
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
