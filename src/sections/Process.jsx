import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const steps = [
  {
    icon: '/assets/icons/01.svg',
    title: 'Discovery and Alignment',
    desc: 'We start by understanding your business goals, customer needs, and technical landscape. Together we define the challenge and align on what success looks like.',
  },
  {
    icon: '/assets/icons/02.svg',
    title: 'Storytelling and Vision',
    desc: 'We craft a compelling narrative that connects your goals to Microsoft capabilities, building a shared vision that resonates with stakeholders at every level.',
  },
  {
    icon: '/assets/icons/03.svg',
    title: 'Solution Envisioning',
    desc: 'Through collaborative workshops we explore possibilities, map user journeys, and define the solution space where technology meets real human needs.',
  },
  {
    icon: '/assets/icons/04.svg',
    title: 'Vibe Prototyping',
    desc: 'Using AI-paired development we rapidly build functional prototypes that bring ideas to life. Real code, real interactions, validated in days.',
  },
  {
    icon: '/assets/icons/05.svg',
    title: 'Architecture Design',
    desc: 'We synthesize requirements into a scalable, Azure-native architecture blueprint. Security, performance, and integration built in from the start.',
  },
  {
    icon: '/assets/icons/06.svg',
    title: 'Delivery and Handoff',
    desc: 'Production-grade code, documentation, and knowledge transfer. We ensure your team is empowered to own, extend, and scale the solution forward.',
  },
];

const ease = [0.4, 0, 0.2, 1];

export default function ProcessSection() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section className="section section--dark">
      <Starfield count={40} />
      <div className="section-inner">
        <ScrollReveal blur>
          <p className="proc-label">Our process</p>
          <h2 className="proc-heading">
            From problem exploration to technical proof
          </h2>
        </ScrollReveal>

        <div className="proc-journey">
          <div className="proc-journey__steps">
            {steps.map((s, i) => (
              <button
                key={i}
                className={'proc-step' + (i === active ? ' proc-step--active' : '') + (i < active ? ' proc-step--done' : '')}
                onClick={() => setActive(i)}
              >
                <img
                  src={s.icon}
                  alt=""
                  className="proc-step__icon"
                />
                <span className="proc-step__title">{s.title}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="proc-journey__detail"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease }}
            >
              <motion.img
                src={step.icon}
                alt=""
                className="proc-detail__icon"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
              />
              <h3 className="proc-detail__title">{step.title}</h3>
              <p className="proc-detail__desc">{step.desc}</p>

              <div className="proc-detail__nav">
                <button
                  className="proc-detail__btn"
                  disabled={active === 0}
                  onClick={() => setActive(active - 1)}
                >
                  Previous
                </button>
                <span className="proc-detail__progress">
                  {active + 1} / {steps.length}
                </span>
                <button
                  className="proc-detail__btn proc-detail__btn--next"
                  disabled={active === steps.length - 1}
                  onClick={() => setActive(active + 1)}
                >
                  Next
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
