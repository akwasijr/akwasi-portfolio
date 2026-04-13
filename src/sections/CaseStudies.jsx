import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const projects = [
  {
    id: 'heineken-rtc',
    client: 'Heineken',
    title: 'Route to Consumer Platform',
    color: '#4AA75F',
    tags: ['AI Platform', 'Copilot'],
    stat: '6 use cases',
    desc: 'AI-powered venue insights delivering recommendations that drive engagement across markets.',
  },
  {
    id: 'heineken-bpm',
    client: 'Heineken',
    title: 'Business Performance Management',
    color: '#0059A3',
    tags: ['Power BI', 'Finance'],
    stat: '3 use cases',
    desc: 'Modernized monthly reporting for Europe regional finance. Now expanding globally.',
  },
  {
    id: 'heineken-supply',
    client: 'Heineken',
    title: 'Supply Chain Out-of-Stock',
    color: '#F2A573',
    tags: ['AI Platform', 'Supply Chain'],
    stat: '3 use cases',
    desc: 'Use-case driven approach building platform capabilities at scale across markets.',
  },
  {
    id: 'novartis',
    client: 'Novartis',
    title: 'Synthetic Respondents',
    color: '#F45A9B',
    tags: ['AI Agents', 'Pharma'],
    stat: '4 UX paths',
    desc: 'Synthetic patient and physician personas for early insight validation, prototyped end-to-end in Microsoft Teams.',
  },
  {
    id: 'wsp',
    client: 'WSP',
    title: 'AI-Driven Impact Assessment',
    color: '#7E80EE',
    tags: ['AI Intelligence', 'Environment'],
    stat: 'VIBE prototype',
    desc: 'Reimagining environmental monitoring and impact assessment with AI-driven intelligence.',
  },
  {
    id: 'enbridge',
    client: 'Enbridge',
    title: 'Voice-First Move Services',
    color: '#4AA75F',
    tags: ['Voice AI', 'Real-time'],
    stat: 'VIBE prototype',
    desc: 'Natural conversation interface for Move-In, Move-Out, and Transfer requests replacing complex multi-screen workflows.',
  },
  {
    id: 'kantar',
    client: 'Kantar',
    title: 'AI Design Transformation',
    color: '#F2A573',
    tags: ['Design Leadership', 'AI'],
    stat: 'Scalable innovation',
    desc: 'Design leadership accelerating delivery, unifying experiences, and building scalable innovation across Kantar\'s AI ecosystem.',
  },
  {
    id: 'ey',
    client: 'EY',
    title: 'AI Financial Statement Review',
    color: '#0059A3',
    tags: ['AI Review', 'Finance'],
    stat: '8M hours saved',
    desc: 'Re-imagined AI-driven financial review process saving 8 million hours and $32 million.',
  },
];

function getFanTransform(offset) {
  const abs = Math.abs(offset);
  const sign = offset > 0 ? 1 : offset < 0 ? -1 : 0;
  if (abs === 0) return { x: 0, rotate: 0, scale: 1, zIndex: 10, opacity: 1 };
  if (abs === 1) return { x: sign * 180, rotate: sign * 5, scale: 0.92, zIndex: 5, opacity: 0.85 };
  if (abs === 2) return { x: sign * 320, rotate: sign * 10, scale: 0.84, zIndex: 2, opacity: 0.5 };
  return { x: sign * 420, rotate: sign * 14, scale: 0.78, zIndex: 1, opacity: 0.25 };
}

export default function CaseStudiesSection() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const go = useCallback((dir) => {
    setActive(i => {
      const next = i + dir;
      if (next < 0) return projects.length - 1;
      if (next >= projects.length) return 0;
      return next;
    });
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 5000);
    return () => clearInterval(timerRef.current);
  }, [go]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go(1), 5000);
  };

  return (
    <section className="section section--dark" data-section="5">
      <Starfield count={22} />
      <div className="section-inner">
        <ScrollReveal>
          <h2 className="cases-heading">Selected<br />projects</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="fan-carousel">
            {projects.map((p, i) => {
              let offset = i - active;
              if (offset > 4) offset -= projects.length;
              if (offset < -4) offset += projects.length;
              const t = getFanTransform(offset);

              return (
                <motion.div
                  key={p.id}
                  className="fan-card"
                  onClick={() => { setActive(i); resetTimer(); }}
                  animate={{ x: t.x, rotate: t.rotate, scale: t.scale, opacity: t.opacity }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  style={{ zIndex: t.zIndex, background: p.color, transformOrigin: 'bottom center' }}
                >
                  <div className="fan-card__inner">
                    <span className="fan-card__client">{p.client}</span>
                    <div className="fan-card__tags">
                      {p.tags.map(tag => <span key={tag} className="fan-card__tag">{tag}</span>)}
                    </div>
                    <div>
                      <h3 className="fan-card__title">{p.title}</h3>
                      <p className="fan-card__desc">{p.desc}</p>
                      <span className="fan-card__stat">{p.stat}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="fan-nav">
            <button className="fan-arrow" onClick={() => { go(-1); resetTimer(); }}>&#8592;</button>
            <div className="fan-dots">
              {projects.map((_, i) => (
                <button
                  key={i}
                  className={"fan-dot" + (i === active ? " fan-dot--active" : "")}
                  onClick={() => { setActive(i); resetTimer(); }}
                />
              ))}
            </div>
            <button className="fan-arrow" onClick={() => { go(1); resetTimer(); }}>&#8594;</button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
