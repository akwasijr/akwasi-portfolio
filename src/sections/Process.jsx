import { useRef, useEffect, useState } from 'react';
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

function JourneyStep({ step, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, margin: '-10% 0px -10% 0px' });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={'pj-step' + (isEven ? '' : ' pj-step--alt')}>
      {/* Dot on the center line */}
      <div className="pj-step__line">
        <motion.div
          className="pj-step__dot"
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease }}
        />
      </div>

      {/* Animated SVG icon */}
      <motion.div
        className="pj-step__icon-wrap"
        animate={isInView
          ? { opacity: 1, scale: 1, rotate: 0, y: 0 }
          : { opacity: 0, scale: 0.4, rotate: -20, y: 30 }
        }
        transition={{ duration: 0.7, delay: 0.1, ease }}
      >
        <motion.img
          src={step.icon}
          alt=""
          className="pj-step__icon"
          animate={isInView
            ? { y: [0, -6, 0] }
            : { y: 0 }
          }
          transition={isInView
            ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
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
            : { opacity: 0, y: 60, filter: 'blur(8px)' }
          }
          transition={{ duration: 0.7, delay: 0.05, ease }}
        >
          {step.title.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </motion.h3>
        <motion.p
          className="pj-step__desc"
          animate={isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.6, delay: 0.2, ease }}
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
  return (
    <div className="pj-wrapper">
      <Starfield count={50} />

      <JourneyIntro />

      <div className="pj-timeline">
        {/* Continuous center line */}
        <div className="pj-timeline__line" />

        {steps.map((step, i) => (
          <JourneyStep
            key={i}
            step={step}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
