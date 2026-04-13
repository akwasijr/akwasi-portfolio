import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Starfield from '../components/Starfield';
import LottieLogo from '../components/LottieLogo';

const items = [
  {
    id: 'team',
    title: 'Team', label: 'Who we are',
    detail: 'A global, cross-functional team blending UX, engineering, and data science to bring ideas to life.',
  },
  {
    id: 'what-we-do',
    title: 'What We Do', label: 'Our offering',
    detail: 'Storytelling, VIBE prototyping, and product delivery that drives adoption and measurable consumption.',
  },
  {
    id: 'process',
    title: 'Process', label: 'How we work',
    detail: 'From business envisioning to rapid prototype. We meet customers where they are and accelerate decisions.',
  },
  {
    id: 'working-with-us',
    title: 'Working with Us', label: 'Studio 42 + You',
    detail: 'Experience-led presales through storytelling and engineered prototypes. No NBUE required.',
  },
  {
    id: 'vibe-prototyping',
    title: 'Vibe Prototyping', label: 'Our approach',
    detail: 'AI-first design thinking coupled with live AI-powered prototyping to validate concepts fast.',
  },
  {
    id: 'selected-work',
    title: 'Selected Work', label: 'Case studies',
    detail: 'Heineken, Novartis, and more. Platform journeys to AI innovation.',
  },
];

export { items as tocItems };

const ease = [0.22, 1, 0.36, 1];

const rowVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.3 + i * 0.1, ease },
  }),
};

export default function TableOfContentsSection({ onOpenPage, pageOpen }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  // Reset when page opens, re-animate when it closes
  useEffect(() => {
    if (pageOpen) {
      setVisible(false);
    } else {
      // Re-animate after curtains close
      const timer = setTimeout(() => setVisible(true), 700);
      return () => clearTimeout(timer);
    }
  }, [pageOpen]);

  // Initial entrance via scroll
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section section--blue toc-section" data-section="1">
      <Starfield count={18} />
      <div className="section-inner">
        <motion.div
          className="toc-header"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease }}
        >
          <LottieLogo width={180} autoplay={visible} loop={false} variant="light" />
        </motion.div>

        <div className="toc-list">
          {items.map((item, i) => {
            const isHovered = hoveredIdx === i;

            return (
              <motion.div
                key={item.id}
                className="toc-row"
                animate={visible
                  ? { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3 + i * 0.1, ease } }
                  : { opacity: 0, y: 60, transition: { duration: 0.3, delay: 0, ease } }
                }
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = rect.top + rect.height / 2;
                  onOpenPage && onOpenPage(item.id, y);
                }}
                style={{
                  backgroundColor: isHovered ? '#ffffff' : 'rgba(255,255,255,0)',
                  color: isHovered ? '#0059A3' : '#ffffff',
                }}
              >
                <span
                  className="toc-row__label"
                  style={{ color: isHovered ? 'rgba(0,89,163,0.5)' : undefined }}
                >
                  {item.label}
                </span>
                <div className="toc-row__center">
                  <span
                    className="toc-row__title"
                    style={{ fontStyle: isHovered ? 'normal' : 'italic' }}
                  >
                    {item.title}
                  </span>
                  <AnimatePresence>
                    {isHovered && (
                      <motion.p
                        className="toc-row__detail"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        {item.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
