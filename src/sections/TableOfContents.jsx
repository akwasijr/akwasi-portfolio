import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Starfield from '../components/Starfield';

const items = [
  {
    title: 'Team', label: 'Who we are', section: 2, num: '01',
    detail: 'A global, cross-functional team blending UX, engineering, and data science to bring ideas to life.',
  },
  {
    title: 'Process', label: 'How we work', section: 4, num: '02',
    detail: 'From business envisioning to rapid prototype. We meet customers where they are and accelerate decisions.',
  },
  {
    title: 'Working with Us', label: 'Studio 42 + You', section: 6, num: '03',
    detail: 'Experience-led presales through storytelling and engineered prototypes. No NBUE required.',
  },
  {
    title: 'Vibe Prototyping', label: 'Our approach', section: 3, num: '04',
    detail: 'Six disciplines orbiting one mission. Design, engineering, and product at the core.',
  },
  {
    title: 'Selected Work', label: 'Case studies', section: 5, num: '05',
    detail: 'Heineken, Novartis, and more. Platform journeys to AI innovation.',
  },
];

const ease = [0.22, 1, 0.36, 1];

const rowVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.3 + i * 0.1, ease },
  }),
};

export default function TableOfContentsSection({ onNavigate }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

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
    <section ref={ref} className="section section--blue toc-section" data-section="1">
      <Starfield count={35} />
      <div className="section-inner">
        <motion.div
          className="toc-header"
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
        >
          <img src="/assets/logo.svg" alt="Studio 42" style={{ width: '180px', height: 'auto' }} />
          <p className="toc-desc">
            Experience-led presales through storytelling
            and engineered prototypes.
          </p>
        </motion.div>

        <div className="toc-list">
          {items.map((item, i) => {
            const isHovered = hoveredIdx === i;

            return (
              <motion.div
                key={item.num}
                className="toc-row"
                custom={i}
                variants={rowVariants}
                initial="hidden"
                animate={visible ? "visible" : "hidden"}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => onNavigate && onNavigate(item.section)}
                style={{
                  backgroundColor: isHovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
                  color: isHovered ? '#0C0E13' : '#ffffff',
                }}
              >
                <div className="toc-row__center">
                  <span className="toc-row__title">{item.title}</span>
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
