import { useRef, useEffect, useState } from 'react';

export default function CircleWipe({ children }) {
  const wrapRef = useRef(null);
  const [clipPercent, setClipPercent] = useState(150);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const scroller = wrap.closest('.scroll-container');
    if (!scroller) return;

    const handleScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();

      const scrolled = scrollerRect.top - rect.top;
      const viewH = scrollerRect.height;
      const travelDist = viewH * 2;

      const p = Math.max(0, Math.min(1, scrolled / travelDist));
      setProgress(p);
      setClipPercent(150 * (1 - p));
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, []);

  const childArray = Array.isArray(children) ? children : [children];

  // Bottom (revealed) section fades in from 30% progress
  const bottomOpacity = Math.max(0, (progress - 0.3) / 0.7);
  const bottomScale = 0.94 + bottomOpacity * 0.06;

  return (
    <div ref={wrapRef} style={{ position: 'relative', height: '300vh' }}>
      {/* Revealed section: sticky behind */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', zIndex: 1 }}>
        <div style={{
          width: '100%', height: '100%',
          opacity: bottomOpacity,
          transform: `scale(${bottomScale})`,
        }}>
          {childArray[1]}
        </div>
      </div>

      {/* Clipped section: overlays on top, circle shrinks */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        zIndex: 3,
        clipPath: `circle(${clipPercent}% at 50% 50%)`,
        marginTop: '-100vh',
      }}>
        {childArray[0]}
      </div>
    </div>
  );
}
