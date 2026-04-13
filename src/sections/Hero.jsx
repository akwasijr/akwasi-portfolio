import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Starfield from '../components/Starfield';

const ease = [0.22, 1, 0.36, 1];

const headingLines = ['From Vision', 'to Value', 'at Scale'];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(true);
  const [reveal, setReveal] = useState(false);
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
    <section ref={sectionRef} className="section section--dark" data-section="0">
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
          <img src="/assets/logo.svg" alt="Studio 42" className="hero-logo" style={{ margin: '0 auto' }} />
        </motion.div>

        <motion.h1 className="hero-mega" style={{ y: headingY }}>
          {headingLines.map((line, i) => (
            <span key={i} style={{ overflow: 'hidden', display: 'block' }}>
              <motion.span
                style={{ display: 'block' }}
                initial={{ y: '120%' }}
                animate={reveal ? { y: 0 } : {}}
                transition={{ duration: 1, delay: 0.15 + i * 0.14, ease }}
              >
                {line}
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
