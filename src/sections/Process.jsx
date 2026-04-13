import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

function JourneyStep({ step, index, isLast }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={'pj-step' + (isEven ? '' : ' pj-step--alt')}>
      {/* Vertical line */}
      <div className="pj-step__line">
        <motion.div
          className="pj-step__dot"
          initial={{ scale: 0 }}
          animate={visible ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
        />
        {!isLast && (
          <motion.div
            className="pj-step__connector"
            initial={{ scaleY: 0 }}
            animate={visible ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
          />
        )}
      </div>

      {/* Icon */}
      <motion.div
        className="pj-step__icon-wrap"
        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
        animate={visible ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      >
        <img src={step.icon} alt="" className="pj-step__icon" />
      </motion.div>

      {/* Content */}
      <div className="pj-step__content">
        <motion.h3
          className="pj-step__title"
          initial={{ opacity: 0, y: 50 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          {step.title.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </motion.h3>
        <motion.p
          className="pj-step__desc"
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease }}
        >
          {step.desc}
        </motion.p>
      </div>
    </div>
  );
}

function JourneyIntro() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="pj-intro">
      <motion.p
        className="pj-intro__label"
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
      >
        Our process
      </motion.p>
      <motion.h2
        className="pj-intro__heading"
        initial={{ opacity: 0, y: 50 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease }}
      >
        From problem exploration<br />to technical proof
      </motion.h2>
      <motion.p
        className="pj-intro__sub"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      >
        Scroll to explore each stage of our journey
      </motion.p>
    </div>
  );
}

export default function ProcessSection() {
  return (
    <div className="pj-wrapper">
      <Starfield count={50} />

      <JourneyIntro />

      <div className="pj-timeline">
        {steps.map((step, i) => (
          <JourneyStep
            key={i}
            step={step}
            index={i}
            isLast={i === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
