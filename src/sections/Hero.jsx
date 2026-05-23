import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Starfield from '../components/Starfield';
import ShootingStars from '../components/ShootingStars';

const ease = [0.22, 1, 0.36, 1];

/* DOS-style blocky ASCII — built with ░▒▓█ characters */
const BOOT_LINES = [
  { text: 'C:\\> loading profile...', delay: 0, color: '#7a7a7a' },
  { text: 'BIOS v11.0 // Design Systems Initialized', delay: 300, color: '#7a7a7a' },
  { text: 'MEM: AI ██████████ UX ██████████ DEV ██████████ OK', delay: 600, color: '#7a7a7a' },
  { text: '', delay: 900, color: '#7a7a7a' },
];

const ASCII_NAME = [
  ' ▄▄▄       ██ ▄█▀ █     █░ ▄▄▄        ██████  ██▓',
  '▒████▄     ██▄█▒ ▓█░ █ ░█░▒████▄    ▒██    ▒ ▓██▒',
  '▒██  ▀█▄  ▓███▄░ ▒█░ █ ░█ ▒██  ▀█▄  ░ ▓██▄   ▒██▒',
  '░██▄▄▄▄██ ▓██ █▄ ░█░ █ ░█ ░██▄▄▄▄██   ▒   ██▒░██░',
  ' ▓█   ▓██▒▒██▒ █▄░░██▒██▓  ▓█   ▓██▒▒██████▒▒░██░',
  ' ▒▒   ▓▒█░▒ ▒▒ ▓▒░ ▓░▒ ▒   ▒▒   ▓▒█░▒ ▒▓▒ ▒ ░▓  ',
  '  ▒   ▒▒ ░░ ░▒ ▒░  ▒ ░ ░   ▒   ▒▒ ░░ ░▒  ░  ▒ ░',
  '  ░   ▒   ░ ░░ ░   ░   ░   ░   ▒   ░  ░  ░  ▒ ░',
];

const ASCII_SURNAME = [
  '  █████▒ ▒█████    ██████  █    ██  ██░ ██  ▓█████  ███▄    █ ▓█████ ',
  '▓██   ▒ ▒██▒  ██▒▒██    ▒ ██  ▓██▒▓██░ ██▒ ▓█   ▀  ██ ▀█   █ ▓█   ▀ ',
  '▒████ ░ ▒██░  ██▒░ ▓██▄  ▓██  ▒██░▒██▀▀██░ ▒███    ▓██  ▀█ ██▒▒███   ',
  '░▓█▒  ░ ▒██   ██░  ▒   ██▒▓▓█  ░██░░▓█ ░██  ▒▓█  ▄  ▓██▒  ▐▌██▒▒▓█  ▄ ',
  '░▒█░    ░ ████▓▒░▒██████▒▒▒▒█████▓ ░▒▓███▀▒ ░▒████▒ ▒██░   ▓██░░▒████▒',
  ' ▒ ░    ░ ▒░▒░▒░ ▒ ▒▓▒ ▒ ░░▒▓▒ ▒ ▒ ▒░▒   ░  ░░ ▒░ ░ ░ ▒░   ▒ ▒░░ ▒░ ░',
  ' ░        ░ ▒ ▒░ ░ ░▒  ░ ░░░▒░ ░ ░  ░    ░   ░ ░  ░ ░ ░░   ░ ▒░ ░ ░  ░',
  ' ░ ░    ░ ░ ░ ▒  ░  ░  ░   ░░░ ░ ░░ ░         ░      ░   ░ ░    ░   ',
];

const ROLE_LINE = '  >> DESIGN CONSULTANT  //  AI × UX × ENGINEERING';

const headingLines = [
  { text: 'Making ', word: 'AI', color: '#c6ef4d' },
  { text: 'work for ', word: 'People', color: '#7779f0' },
];

const scrollIcons = ['↓', '▼', '⬇', '⇣', '↡'];

function ScrollHint({ reveal }) {
  const [iconIdx, setIconIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered) return;
    const interval = setInterval(() => {
      setIconIdx(i => (i + 1) % scrollIcons.length);
    }, 300);
    return () => clearInterval(interval);
  }, [hovered]);

  return (
    <motion.div
      className="hero-scroll-hint"
      initial={{ opacity: 0 }}
      animate={reveal ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 1.0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setIconIdx(0); }}
      style={{ cursor: 'pointer' }}
    >
      <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Scroll</span>
      <span style={{
        fontSize: '20px', transition: 'transform 0.2s ease',
        transform: hovered ? 'translateY(4px)' : 'translateY(0)',
        fontFamily: "'IBM Plex Mono', monospace",
      }}>
        {scrollIcons[iconIdx]}
      </span>
    </motion.div>
  );
}

function AsciiSplash({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0=boot, 1=name, 2=surname, 3=role, 4=done
  const [charIndex, setCharIndex] = useState(0);
  const [bootLine, setBootLine] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const fired = useRef(false);

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(blink);
  }, []);

  // Boot sequence
  useEffect(() => {
    if (phase !== 0) return;
    if (bootLine >= BOOT_LINES.length) { setPhase(1); setCharIndex(0); return; }
    const t = setTimeout(() => setBootLine(b => b + 1), BOOT_LINES[bootLine].delay || 300);
    return () => clearTimeout(t);
  }, [phase, bootLine]);

  // Name typing
  useEffect(() => {
    if (phase !== 1) return;
    const maxLen = ASCII_NAME[0].length;
    const interval = setInterval(() => {
      setCharIndex(prev => {
        const next = prev + 2;
        if (next >= maxLen) { setTimeout(() => { setPhase(2); setCharIndex(0); }, 200); }
        return Math.min(next, maxLen);
      });
    }, 15);
    return () => clearInterval(interval);
  }, [phase]);

  // Surname typing
  useEffect(() => {
    if (phase !== 2) return;
    const maxLen = ASCII_SURNAME[0].length;
    const interval = setInterval(() => {
      setCharIndex(prev => {
        const next = prev + 2;
        if (next >= maxLen) { setTimeout(() => { setPhase(3); setCharIndex(0); }, 200); }
        return Math.min(next, maxLen);
      });
    }, 12);
    return () => clearInterval(interval);
  }, [phase]);

  // Role line typing
  useEffect(() => {
    if (phase !== 3) return;
    const interval = setInterval(() => {
      setCharIndex(prev => {
        const next = prev + 1;
        if (next >= ROLE_LINE.length && !fired.current) {
          fired.current = true;
          setTimeout(onComplete, 1200);
        }
        return Math.min(next, ROLE_LINE.length);
      });
    }, 25);
    return () => clearInterval(interval);
  }, [phase, onComplete]);

  const cursor = cursorVisible ? '█' : ' ';

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', zIndex: 50,
        background: '#000', cursor: 'pointer',
      }}
      onClick={onComplete}
    >
      {/* CRT scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, rgba(0,255,60,0.03) 0px, transparent 1px, transparent 3px)',
        zIndex: 2,
      }} />

      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 'clamp(6px, 1.05vw, 11px)',
        lineHeight: 1.3,
        whiteSpace: 'pre',
        maxWidth: '90vw',
        position: 'relative', zIndex: 1,
      }}>
        {/* Boot lines */}
        {BOOT_LINES.slice(0, bootLine).map((line, i) => (
          <div key={`b${i}`} style={{ color: line.color, marginBottom: '2px' }}>
            {line.text}
          </div>
        ))}

        {/* Name */}
        {phase >= 1 && (
          <pre style={{ color: '#c6ef4d', margin: 0, lineHeight: 1.15 }}>
            {ASCII_NAME.map((line, i) => (
              <span key={`n${i}`} style={{ display: 'block' }}>
                {line.slice(0, phase === 1 ? charIndex : line.length)}
              </span>
            ))}
          </pre>
        )}

        {/* Surname */}
        {phase >= 2 && (
          <pre style={{ color: '#a5a5f6', margin: 0, marginTop: '2px', lineHeight: 1.15 }}>
            {ASCII_SURNAME.map((line, i) => (
              <span key={`s${i}`} style={{ display: 'block' }}>
                {line.slice(0, phase === 2 ? charIndex : line.length)}
              </span>
            ))}
          </pre>
        )}

        {/* Role line */}
        {phase >= 3 && (
          <div style={{
            color: '#c6ef4d', marginTop: '16px',
            borderTop: '1px solid rgba(198,239,77,0.2)', paddingTop: '12px',
          }}>
            {ROLE_LINE.slice(0, charIndex)}
            <span style={{ opacity: cursorVisible ? 1 : 0 }}>█</span>
          </div>
        )}

        {/* Blinking cursor during boot/type */}
        {phase < 3 && (
          <span style={{ color: '#c6ef4d' }}>{cursor}</span>
        )}
      </div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 && charIndex >= ROLE_LINE.length ? 0.3 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ color: '#7a7a7a', fontSize: '12px', marginTop: '40px', fontFamily: "'IBM Plex Mono', monospace", position: 'relative', zIndex: 1 }}
      >
        [ press any key ]
      </motion.span>
    </motion.div>
  );
}

/* ASCII block dissolve — scanline wipe with ████→▓▓▓→▒▒▒→░░░→clear */
function CheckeredReveal({ onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cellW = 8;
    const cellH = 8;
    const cols = Math.ceil(w / cellW) + 1;
    const rows = Math.ceil(h / cellH) + 1;
    const totalDuration = 1200;
    let start = null;
    let rafId;

    // Small random offset per cell for organic edges
    const jitter = new Float32Array(cols * rows);
    for (let i = 0; i < jitter.length; i++) jitter[i] = Math.random() * 0.08;

    function draw(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / totalDuration, 1);

      // Start fully black, then clear cells top-to-bottom
      ctx.clearRect(0, 0, w, h);

      let anyVisible = false;

      for (let r = 0; r < rows; r++) {
        const rowNorm = r / rows;
        // Row starts dissolving at its position (top=0, bottom=0.55)
        const rowStart = rowNorm * 0.55;
        const rowT = Math.max(0, Math.min((t - rowStart) / 0.45, 1));

        if (rowT <= 0) {
          // Row hasn't started — draw solid black
          ctx.fillStyle = '#000';
          ctx.fillRect(0, r * cellH, w, cellH);
          anyVisible = true;
          continue;
        }

        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const cellT = Math.min(rowT + jitter[idx], 1);
          const x = c * cellW;
          const y = r * cellH;

          if (cellT >= 1) continue; // fully clear

          anyVisible = true;

          if (cellT < 0.25) {
            // █ solid black
            ctx.fillStyle = '#000';
            ctx.fillRect(x, y, cellW, cellH);
          } else if (cellT < 0.5) {
            // ▓ dense dither — 75% filled
            ctx.fillStyle = '#000';
            for (let dy = 0; dy < cellH; dy++) {
              for (let dx = 0; dx < cellW; dx++) {
                if ((dx + dy) % 2 === 0 || (dx % 3 === 0)) {
                  ctx.fillRect(x + dx, y + dy, 1, 1);
                }
              }
            }
          } else if (cellT < 0.75) {
            // ▒ medium dither — checkerboard
            ctx.fillStyle = '#000';
            for (let dy = 0; dy < cellH; dy += 2) {
              for (let dx = (dy % 4 === 0 ? 0 : 1); dx < cellW; dx += 2) {
                ctx.fillRect(x + dx, y + dy, 1, 1);
              }
            }
          } else {
            // ░ sparse dots
            ctx.fillStyle = '#000';
            for (let dy = 1; dy < cellH; dy += 4) {
              for (let dx = 1; dx < cellW; dx += 4) {
                ctx.fillRect(x + dx, y + dy, 1, 1);
              }
            }
          }
        }
      }

      if (anyVisible && t < 1) {
        rafId = requestAnimationFrame(draw);
      } else {
        onComplete();
      }
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0, zIndex: 45, pointerEvents: 'none',
      width: '100vw', height: '100vh',
    }} />
  );
}

export default function HeroSection() {
  const sectionRef = useRef(null);
  const [showSplash, setShowSplash] = useState(true);
  const [showCheckered, setShowCheckered] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [hoveredLine, setHoveredLine] = useState(null);

  const startReveal = useCallback(() => {
    setShowSplash(false);
    // Wait for splash to fully unmount before starting dissolve
    setTimeout(() => {
      setShowCheckered(true);
      setTimeout(() => setReveal(true), 200);
    }, 400);
  }, []);

  const onCheckeredDone = useCallback(() => {
    setShowCheckered(false);
  }, []);

  const [scrollContainer, setScrollContainer] = useState(null);
  useEffect(() => {
    setScrollContainer(document.querySelector('.scroll-container'));
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer ? { current: scrollContainer } : undefined,
    offset: ['start start', 'end start'],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);

  return (
    <section ref={sectionRef} className="section section--hero-gradient" data-section="0">
      <Starfield count={25} />
      <ShootingStars />

      {/* Name — top right */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={reveal ? { opacity: 0.8 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease }}
        style={{
          position: 'absolute', top: '32px', right: '40px', zIndex: 5,
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 'clamp(16px, 2vw, 22px)',
          fontWeight: 600, color: '#c6ef4d', letterSpacing: '0.04em',
        }}
      >
        Akwasi Fosuhene
      </motion.span>

      <AnimatePresence>
        {showSplash && (
          <AsciiSplash key="splash" onComplete={startReveal} />
        )}
      </AnimatePresence>

      {showCheckered && (
        <CheckeredReveal onComplete={onCheckeredDone} />
      )}

      <motion.div
        className="section-inner"
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          opacity: contentOpacity,
          scale: contentScale,
        }}
      >
        {/* Interactive heading with hover effects */}
        <motion.h1 className="hero-mega" style={{ y: headingY }}>
          {headingLines.map((line, i) => {
            const isHovered = hoveredLine === i;
            return (
              <span
                key={i}
                className="hero-line"
                onMouseEnter={() => setHoveredLine(i)}
                onMouseLeave={() => setHoveredLine(null)}
                style={{ overflow: reveal ? 'visible' : 'hidden', display: 'block' }}
              >
                <motion.span
                  style={{ display: 'inline-block' }}
                  initial={{ y: '120%' }}
                  animate={reveal ? { y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.15 + i * 0.14, ease }}
                >
                  {line.text}
                  <span style={{ position: 'relative', display: 'inline-block' }}>
                    <motion.span
                      style={{ display: 'inline-block', color: line.color }}
                      animate={isHovered
                        ? { opacity: 0, scale: 0.7, filter: 'blur(8px)' }
                        : { opacity: 1, scale: 1, filter: 'blur(0px)' }
                      }
                      transition={{ duration: 0.4, ease }}
                    >
                      {line.word}
                    </motion.span>
                    <motion.span
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        display: 'inline-block',
                        fontSize: '0.8em',
                        color: line.color,
                      }}
                      animate={isHovered
                        ? { opacity: 1, scale: 1, x: '-50%', y: '-50%', rotate: 0 }
                        : { opacity: 0, scale: 0.3, x: '-50%', y: '-50%', rotate: -30 }
                      }
                      transition={{ duration: 0.4, ease }}
                    >
                      {i === 0 ? '✦' : '●'}
                    </motion.span>
                  </span>
                </motion.span>
              </span>
            );
          })}
        </motion.h1>

        <ScrollHint reveal={reveal} />
      </motion.div>
    </section>
  );
}
