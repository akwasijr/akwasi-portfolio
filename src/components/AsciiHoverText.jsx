import { useState, useEffect, useRef } from 'react';

const GLYPHS = '░▒▓█╔╗╚╝═║┃┏┓┗┛━╋┣┫╬▀▄▐▌■□▪▫●○◆◇';

function randomize(text) {
  return text.split('').map(ch =>
    ch === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  ).join('');
}

export default function AsciiHoverText({ text, className, style }) {
  const [hovered, setHovered] = useState(false);
  const [display, setDisplay] = useState(text);
  const timersRef = useRef([]);

  useEffect(() => {
    // Clear any pending timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (hovered) {
      // Frame 1: scrambled glyphs (immediate)
      setDisplay(randomize(text));
      // Frame 2: different scrambled glyphs (after 400ms)
      timersRef.current.push(setTimeout(() => setDisplay(randomize(text)), 400));
      // Frame 3: resolve to final text in monospace (after 800ms)
      timersRef.current.push(setTimeout(() => setDisplay(text), 800));
    } else {
      setDisplay(text);
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [hovered, text]);

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
