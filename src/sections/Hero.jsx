import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Starfield from '../components/Starfield';
import LottieLogo from '../components/LottieLogo';
import AnimatedGradient from '../components/AnimatedGradient';

const ease = [0.22, 1, 0.36, 1];

const headingLines = [
  { text: 'From Vision', hoverIcon: '🔭' },
  { text: 'to Value', hoverIcon: '💎' },
  { text: 'at Scale', hoverIcon: '📐' },
];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(true);
  const [reveal, setReveal] = useState(false);
  const [hoveredLine, setHoveredLine] = useState(null);
  const fired = useRef(false);

  const startReveal = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    setShowVideo(false);
    setTimeout(() => setReveal(true), 400);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const timer = setTimeout(startReveal, 4500);
    video.addEventListener('ended', startReveal);
    return () => { clearTimeout(timer); video.removeEventListener('ended', startReveal); };
  }, [startReveal]);

  // Get scroll container ref after mount
  const [scrollContainer, setScrollContainer] = useState(null);
  useEffect(() => {
    setScrollContainer(document.querySelector('.scroll-container'));
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer ? { current: scrollContainer } : undefined,
    offset: ['start start', 'end start'],
  });

  // Logo moves up faster, heading slower, scroll hint fades out
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);

  return (
    <section ref={sectionRef} className="section section--hero-gradient" data-section="0">
      <AnimatedGradient />
      <Starfield count={25} />
      <img src="/assets/patch-dark.svg" alt="" className="patch-decoration"
        style={{ width: '400px', top: '-80px', right: '-60px' }} role="presentation" />

      <AnimatePresence>
        {showVideo && (
          <motion.div
            key="overlay"
            onClick={startReveal}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'fixed', inset: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 50, background: '#0C0E13', cursor: 'none',
            }}
          >
            <video ref={videoRef} src="/assets/logo-anim.mp4" autoPlay muted playsInline
              style={{ width: '100vw', height: '100vh', objectFit: 'contain' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="section-inner"
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          opacity: contentOpacity,
          scale: contentScale,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={reveal ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          style={{ y: logoY }}
        >
          <LottieLogo width={160} autoplay={reveal} loop={false} variant="light" style={{ margin: '0 auto', marginBottom: '48px' }} />
        </motion.div>

        <motion.h1 className="hero-mega" style={{ y: headingY }}>
          {headingLines.map((line, i) => (
            <span
              key={i}
              className="hero-line"
              onMouseEnter={() => setHoveredLine(i)}
              onMouseLeave={() => setHoveredLine(null)}
              style={{ overflow: reveal ? 'visible' : 'hidden', display: 'block', position: 'relative' }}
            >
              <motion.span
                style={{ display: 'inline-block' }}
                initial={{ y: '120%' }}
                animate={reveal ? { y: 0 } : {}}
                transition={{ duration: 1, delay: 0.15 + i * 0.14, ease }}
              >
                {line.text}
              </motion.span>
              <motion.span
                className="hero-hover-icon"
                animate={hoveredLine === i
                  ? { opacity: 1, scale: 1, rotate: 0 }
                  : { opacity: 0, scale: 0.3, rotate: -20 }
                }
                transition={{ duration: 0.35, ease }}
              >
                {line.hoverIcon}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          className="hero-scroll-hint"
          initial={{ opacity: 0 }}
          animate={reveal ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <span>Scroll</span><span style={{ fontSize: '20px' }}>&#8595;</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
