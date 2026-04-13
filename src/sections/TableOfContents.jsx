import { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const items = [
  { title: 'Team', label: 'Who we are', section: 2, num: '01' },
  { title: 'Process', label: 'How we work', section: 4, num: '02' },
  { title: 'Working with Us', label: 'Studio 42 + You', section: 6, num: '03' },
  { title: 'Vibe Prototyping', label: 'Our approach', section: 3, num: '04' },
  { title: 'Selected Work', label: 'Case studies', section: 5, num: '05' },
];

const ease = [0.22, 1, 0.36, 1];

export default function TableOfContentsSection({ onNavigate }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="section section--dark toc-section" data-section="1">
      <Starfield count={35} />
      <div className="section-inner">
        <div className="toc-header">
          <ScrollReveal>
            <h2 className="toc-title">
              Studio 42<span className="toc-title__sup">06</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="toc-desc">
              Experience-led presales through storytelling
              and engineered prototypes.
            </p>
          </ScrollReveal>
        </div>

        <div className="toc-list">
          {items.map((item, i) => (
            <ScrollReveal key={item.num} delay={0.08 * i}>
              <motion.div
                className="toc-row"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => onNavigate && onNavigate(item.section)}
                animate={{
                  backgroundColor: hoveredIdx === i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
                  color: hoveredIdx === i ? '#0C0E13' : '#ffffff',
                }}
                transition={{ duration: 0.35, ease }}
              >
                <span className="toc-row__label"
                  style={{ color: hoveredIdx === i ? 'rgba(12,14,19,0.45)' : undefined }}>
                  {item.label}
                </span>
                <span className="toc-row__title">{item.title}</span>
                <span className="toc-row__num"
                  style={{ color: hoveredIdx === i ? 'rgba(12,14,19,0.35)' : undefined }}>
                  {item.num}
                </span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
