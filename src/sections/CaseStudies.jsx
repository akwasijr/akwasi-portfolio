import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const ease = [0.22, 1, 0.36, 1];

const projects = [
  {
    id: 'heineken-rtc',
    client: 'Heineken',
    title: 'Route to Consumer Platform',
    color: '#4AA75F',
    tags: ['AI Platform', 'Copilot'],
    stat: '6 use cases',
    desc: 'AI-powered venue insights delivering recommendations that drive engagement across markets.',
    full: 'Studio 42 partnered with Heineken to build an AI-powered Route to Consumer platform that delivers real-time venue insights and recommendations. The platform spans 6 use cases across multiple markets, helping sales teams engage more effectively with data-driven intelligence.',
  },
  {
    id: 'heineken-bpm',
    client: 'Heineken',
    title: 'Business Performance Management',
    color: '#0059A3',
    tags: ['Power BI', 'Finance'],
    stat: '3 use cases',
    desc: 'Modernized monthly reporting for Europe regional finance. Now expanding globally.',
    full: 'We modernized Heineken\'s monthly reporting for Europe regional finance, replacing legacy workflows with interactive Power BI dashboards. The solution covers 3 core use cases and is now expanding globally across the organization.',
  },
  {
    id: 'heineken-supply',
    client: 'Heineken',
    title: 'Supply Chain Out-of-Stock',
    color: '#F2A573',
    tags: ['AI Platform', 'Supply Chain'],
    stat: '3 use cases',
    desc: 'Use-case driven approach building platform capabilities at scale across markets.',
    full: 'A use-case driven approach to building AI platform capabilities that predict and prevent out-of-stock scenarios across Heineken\'s global supply chain. The solution scales across multiple markets with 3 integrated use cases.',
  },
  {
    id: 'novartis',
    client: 'Novartis',
    title: 'Synthetic Respondents',
    color: '#F45A9B',
    tags: ['AI Agents', 'Pharma'],
    stat: '4 UX paths',
    desc: 'Synthetic patient and physician personas for early insight validation.',
    full: 'S42 partnered with Novartis\' Human Insights & Analytics team to explore how synthetic respondents could accelerate early-stage insight generation. Using VIBE prototyping, we moved from concept to a working end-to-end prototype where synthetic patients and healthcare professionals could pressure-test ideas in minutes rather than weeks.',
  },
  {
    id: 'wsp',
    client: 'WSP',
    title: 'AI-Driven Impact Assessment',
    color: '#7E80EE',
    tags: ['AI Intelligence', 'Environment'],
    stat: 'VIBE prototype',
    desc: 'Reimagining environmental monitoring with AI-driven intelligence.',
    full: 'WSP and Studio 42 reimagined impact assessment and environmental monitoring using AI-driven intelligence. The VIBE prototype demonstrated how complex environmental data could be synthesized and surfaced through intuitive experiences.',
  },
  {
    id: 'enbridge',
    client: 'Enbridge',
    title: 'Voice-First Move Services',
    color: '#4AA75F',
    tags: ['Voice AI', 'Real-time'],
    stat: 'VIBE prototype',
    desc: 'Natural conversation interface replacing complex multi-screen workflows.',
    full: 'Studio 42 partnered with Enbridge to explore a voice-first Move Services experience using rapid prototyping and Azure real-time multimodal AI. The prototype validated a future-state where customers complete Move-In, Move-Out, and Transfer requests through natural conversation instead of complex workflows.',
  },
  {
    id: 'kantar',
    client: 'Kantar',
    title: 'AI Design Transformation',
    color: '#F2A573',
    tags: ['Design Leadership', 'AI'],
    stat: 'Scalable innovation',
    desc: 'Design leadership accelerating delivery across Kantar\'s AI ecosystem.',
    full: 'Design leadership accelerating delivery, unifying experiences, and laying the foundation for scalable innovation across Kantar\'s AI ecosystem. We embedded design practice that bridges research insight with production-ready AI experiences.',
  },
  {
    id: 'ey',
    client: 'EY',
    title: 'AI Financial Statement Review',
    color: '#0059A3',
    tags: ['AI Review', 'Finance'],
    stat: '8M hours saved',
    desc: 'AI-driven financial review saving 8 million hours and $32 million.',
    full: 'We re-imagined EY\'s AI-driven financial statement review process, resulting in an impressive 8 million hours and $32 million in savings. The solution transforms how financial audits are conducted at scale.',
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

function ExpandedCard({ project, cardRect, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Animate from card position to fullscreen
  const startX = cardRect ? cardRect.x + cardRect.width / 2 - window.innerWidth / 2 : 0;
  const startY = cardRect ? cardRect.y + cardRect.height / 2 - window.innerHeight / 2 : 0;
  const startScaleX = cardRect ? cardRect.width / window.innerWidth : 0.3;
  const startScaleY = cardRect ? cardRect.height / window.innerHeight : 0.4;

  return (
    <motion.div
      className="case-expanded"
      style={{ background: project.color }}
      initial={{
        x: startX,
        y: startY,
        scaleX: startScaleX,
        scaleY: startScaleY,
        borderRadius: '20px',
      }}
      animate={{
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        borderRadius: '0px',
      }}
      exit={{
        x: startX,
        y: startY,
        scaleX: startScaleX,
        scaleY: startScaleY,
        borderRadius: '20px',
      }}
      transition={{ duration: 0.55, ease }}
      onClick={onClose}
    >
      <motion.div
        className="case-expanded__inner"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: 0.25, ease }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="case-expanded__close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div className="case-expanded__tags">
          {project.tags.map(t => <span key={t} className="case-expanded__tag">{t}</span>)}
        </div>
        <span className="case-expanded__client">{project.client}</span>
        <h2 className="case-expanded__title">{project.title}</h2>
        <p className="case-expanded__body">{project.full}</p>
        <div className="case-expanded__stat">
          <span>{project.stat}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CaseStudiesSection() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [cardRect, setCardRect] = useState(null);
  const frontCardRef = useRef(null);
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
    if (expanded !== null) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => go(1), 5000);
    return () => clearInterval(timerRef.current);
  }, [go, expanded]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go(1), 5000);
  };

  const handleCardClick = (i, e) => {
    if (i === active) {
      const el = e.currentTarget;
      setCardRect(el.getBoundingClientRect());
      setExpanded(i);
    } else {
      setActive(i);
      resetTimer();
    }
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
              const isFront = i === active;

              return (
                <motion.div
                  key={p.id}
                  className={'fan-card' + (isFront ? ' fan-card--front' : '')}
                  onClick={(e) => handleCardClick(i, e)}
                  animate={{ x: t.x, rotate: t.rotate, scale: t.scale, opacity: t.opacity }}
                  whileHover={isFront ? { scale: 1.04, y: -8 } : {}}
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
                  {isFront && <span className="fan-card__hint">Click to expand</span>}
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

      <AnimatePresence>
        {expanded !== null && (
          <ExpandedCard
            project={projects[expanded]}
            cardRect={cardRect}
            onClose={() => setExpanded(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
