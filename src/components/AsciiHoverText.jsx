import { useState, useEffect, useRef, useCallback } from 'react';

const GLYPHS = '░▒▓█╔╗╚╝═║┃┏┓┗┛━╋┣┫╬▀▄▐▌■□▪▫●○◆◇';

export default function AsciiHoverText({ text, className, style }) {
  const [hovered, setHovered] = useState(false);
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  const scramble = useCallback(() => {
    const duration = 2800; // very slow scramble
    const chars = text.split('');

    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const result = chars.map((ch, i) => {
        if (ch === ' ') return ' ';
        const charThreshold = i / chars.length;
        if (progress > charThreshold + 0.4) return ch;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join('');

      setDisplay(result);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    startRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [text]);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (hovered) {
      scramble();
    } else {
      // Instantly revert to original text
      setDisplay(text);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [hovered, scramble, text]);

  return (
    <span
      className={className}
      style={{
        ...style,
        fontFamily: hovered ? "'IBM Plex Mono', monospace" : undefined,
        fontStyle: hovered ? 'normal' : undefined,
        letterSpacing: hovered ? '0.02em' : undefined,
        transition: 'font-family 0.15s, letter-spacing 0.15s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {display}
    </span>
  );
}
