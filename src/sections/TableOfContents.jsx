import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Starfield from '../components/Starfield';
import AsciiHoverText from '../components/AsciiHoverText';

const items = [
  {
    id: 'about',
    title: 'About', label: 'Who I am',
    detail: 'At Microsoft. 11+ years in product design, the last 4 focused on AI experiences.',
  },
  {
    id: 'selected-work',
    title: 'Selected Work', label: 'Projects',
    detail: 'International Commercial Court, Gulf Cultural Heritage Authority, Terminal 42, Starkit.',
  },
  {
    id: 'how-i-work',
    title: 'Process', label: 'Craft + Process + Tools',
    detail: 'AI experience design, copilot interfaces, and the process from problem to prototype.',
  },
  {
    id: 'contact',
    title: 'Contact', label: 'Get in touch',
    detail: 'Available for consulting and collaboration.',
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
  const hasOpened = useRef(false);

  // Reset when page opens, re-animate when it closes
  useEffect(() => {
    if (pageOpen) {
      hasOpened.current = true;
      setVisible(false);
    } else if (hasOpened.current) {
      // Only re-trigger if we actually came back from a page
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
          <AsciiHoverText
            text="AF"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700, fontSize: '48px', color: '#c6ef4d',
              letterSpacing: '-0.02em',
              display: 'block',
            }}
          />
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
                  backgroundColor: isHovered ? '#c6ef4d' : 'rgba(255,255,255,0)',
                  color: isHovered ? '#00330f' : '#ffffff',
                }}
              >
                <span
                  className="toc-row__label"
                  style={{ color: isHovered ? 'rgba(0,51,15,0.5)' : undefined }}
                >
                  {item.label}
                </span>
                <div className="toc-row__center">
                  <AsciiHoverText
                    text={item.title}
                    className="toc-row__title"
                    style={{ fontStyle: isHovered ? 'normal' : 'italic' }}
                  />
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
