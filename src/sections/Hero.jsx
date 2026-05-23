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
  '  █████  ██  ██ ██    ██  █████  ███████ ██',
  ' ██   ██ ██ ██  ██    ██ ██   ██ ██      ██',
  ' ███████ █████  ██ █  ██ ███████ ███████ ██',
  ' ██   ██ ██  ██ ██ ██ ██ ██   ██      ██ ██',
  ' ██   ██ ██  ██  ███ ███ ██   ██ ███████ ██',
];

const ASCII_SURNAME = [
  ' ███████  ██████  ███████ ██   ██ ██  ██ ███████ ███   ██ ███████',
  ' ██      ██    ██ ██      ██   ██ ██  ██ ██      ████  ██ ██     ',
  ' █████   ██    ██ ███████ ██   ██ ██████ █████   ██ ██ ██ █████  ',
  ' ██      ██    ██      ██ ██   ██ ██  ██ ██      ██  ████ ██     ',
  ' ██       ██████  ███████  █████  ██  ██ ███████ ██   ███ ███████',
];

const ROLE_LINE = '  >> AI × UX × PRODUCT';

const headingLines = [
  { text: 'Making ', word: 'AI', color: '#c6ef4d' },
  { text: 'work for ', word: 'People', color: '#7779f0' },
];

const scrollFrames = [
  '  ║  \n  ║  \n  ╨  ',
  '  │  \n  ║  \n  ▼  ',
  '  ·  \n  │  \n  ▼  ',
  '     \n  ·  \n  ▼  ',
  '  ·  \n  │  \n  ▼  ',
  '  │  \n  ║  \n  ▼  ',
];

function ScrollHint({ reveal }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % scrollFrames.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="hero-scroll-hint"
      initial={{ opacity: 0 }}
      animate={reveal ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 1.0 }}
      style={{
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
      }}
    >
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '11px',
        letterSpacing: '0.15em',
        opacity: 0.6,
      }}>
        [ SCROLL ]
      </span>
      <pre style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '14px',
        lineHeight: 1.1,
        margin: 0,
        color: '#c6ef4d',
        textAlign: 'center',
      }}>
        {scrollFrames[frame]}
      </pre>
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

/* ASCII block transition — lime characters build up then dissolve to reveal page */
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

    const cellW = 12;
    const cellH = 16;
    const cols = Math.ceil(w / cellW) + 1;
    const rows = Math.ceil(h / cellH) + 1;
    const totalCells = cols * rows;

    // ASCII chars that cycle during build-up
    const chars = '░▒▓█▓▒░';
    const glyphs = '╔═╗║█║╚═╝┬┴┤├┼─│';

    // Phase 1: build up (black bg, green chars appear) 0–700ms
    // Phase 2: hold solid 700–850ms  
    // Phase 3: dissolve away (chars + bg fade) 850–1500ms
    const buildDur = 700;
    const holdDur = 150;
    const dissolveDur = 650;
    const totalDuration = buildDur + holdDur + dissolveDur;
    let start = null;
    let rafId;

    const noise = new Float32Array(totalCells);
    for (let i = 0; i < totalCells; i++) noise[i] = Math.random();

    // Pre-pick a random glyph per cell
    const cellGlyph = new Uint8Array(totalCells);
    for (let i = 0; i < totalCells; i++) cellGlyph[i] = Math.floor(Math.random() * glyphs.length);

    ctx.font = `${cellH - 2}px "IBM Plex Mono", monospace`;
    ctx.textBaseline = 'top';

    function draw(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      ctx.clearRect(0, 0, w, h);

      // Black background
      if (elapsed < buildDur + holdDur) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);
      } else {
        const dT = (elapsed - buildDur - holdDur) / dissolveDur;
        const alpha = Math.max(0, 1 - dT * dT);
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fillRect(0, 0, w, h);
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const n = noise[idx];
          const x = c * cellW;
          const y = r * cellH;

          // Distance from top-left for wave direction
          const normDist = (r / rows * 0.6 + c / cols * 0.4);

          if (elapsed < buildDur) {
            // Build phase: chars appear from top-left sweeping to bottom-right
            const t = elapsed / buildDur;
            const threshold = normDist * 0.7;
            if (t > threshold + n * 0.1) {
              const localT = Math.min((t - threshold) / 0.3, 1);
              // Cycle through density chars as they appear
              const charIdx = Math.min(Math.floor(localT * chars.length), chars.length - 1);
              ctx.fillStyle = `rgba(198,239,77,${0.3 + localT * 0.6})`;
              ctx.fillText(chars[charIdx], x + 1, y + 1);
            }
          } else if (elapsed < buildDur + holdDur) {
            // Hold: all cells show a glyph
            ctx.fillStyle = 'rgba(198,239,77,0.9)';
            ctx.fillText(glyphs[cellGlyph[idx]], x + 1, y + 1);
          } else {
            // Dissolve: chars fade from top-left to bottom-right
            const dT = (elapsed - buildDur - holdDur) / dissolveDur;
            const threshold = normDist * 0.6;
            if (dT < threshold + n * 0.15 + 0.4) {
              const fadeT = Math.max(0, (dT - threshold) / 0.4);
              const alpha = Math.max(0, 0.9 - fadeT);
              if (alpha > 0.01) {
                ctx.fillStyle = `rgba(198,239,77,${alpha})`;
                ctx.fillText(glyphs[cellGlyph[idx]], x + 1, y + 1);
              }
            }
          }
        }
      }

      if (elapsed < totalDuration) {
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
      </motion.div>

      <ScrollHint reveal={reveal} />
    </section>
  );
}
