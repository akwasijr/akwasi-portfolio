import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const headingLines = ['From Vision', 'to Value', 'at Scale'];

export default function HeroSection() {
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

  return (
    <section className="section section--dark" data-section="0">
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

      <div className="section-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={reveal ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <img src="/assets/logo.svg" alt="Studio 42" className="hero-logo" style={{ margin: '0 auto' }} />
        </motion.div>

        <h1 className="hero-mega">
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
        </h1>

        <motion.div
          className="hero-scroll-hint"
          initial={{ opacity: 0 }}
          animate={reveal ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <span>Scroll</span><span style={{ fontSize: '20px' }}>&#8595;</span>
        </motion.div>
      </div>
    </section>
  );
}
