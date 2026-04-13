import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

const steps = [
  {
    num: '01',
    title: 'Business Envisioning',
    subtitle: 'Develop and prioritize use cases',
    duration: '1-2 days',
    desc: 'Build your path to innovation through human-centered design thinking. We explore opportunities, uncover challenges, and define concrete next steps with your team.',
    output: 'Use cases and prioritization matrix',
  },
  {
    num: '02',
    title: 'Solution Envisioning',
    subtitle: 'Agree on technical direction',
    duration: '1-2 days',
    desc: 'A strategic business and technical discussion to understand goals, offer insights, and imagine the solution with Microsoft and partner capabilities.',
    output: 'Solution mapping',
  },
  {
    num: '03',
    title: 'Architecture Design',
    subtitle: 'Architect your solution',
    duration: '1-3 days',
    desc: 'Synthesize the business and technical requirements including initial scope and alignment to reference architectures. Define the blueprint.',
    output: 'Architecture blueprint',
  },
  {
    num: '04',
    title: 'Rapid Prototype',
    subtitle: 'Validate capabilities',
    duration: '2-5 days',
    desc: 'Demonstrate key technical capabilities of a solution and address challenges to accelerate decision making. Working code, real results.',
    output: 'Code and configuration',
  },
];

export default function ProcessSection() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section className="section section--blue" data-section="3">
      <div className="section-inner">
        <ScrollReveal blur>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '16px' }}>Our process</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: '600px' }}>
            From problem exploration to technical proof
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="process-tabs">
            {steps.map((s, i) => (
              <button
                key={s.num}
                className={"process-tab" + (i === active ? " process-tab--active" : "")}
                onClick={() => setActive(i)}
              >
                <span className="process-tab__num">{s.num}</span>
                <span className="process-tab__label">{s.title}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="process-content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div>
              <h3 className="process-content__title">{step.title}</h3>
              <p className="process-content__sub">{step.subtitle}</p>
            </div>
            <div>
              <p className="process-content__desc">{step.desc}</p>
              <div className="process-content__meta">
                <div>
                  <div className="process-meta__label">Duration</div>
                  <div className="process-meta__value">{step.duration}</div>
                </div>
                <div>
                  <div className="process-meta__label">Output</div>
                  <div className="process-meta__value">{step.output}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
