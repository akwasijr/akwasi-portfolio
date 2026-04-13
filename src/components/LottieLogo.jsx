import { useRef, useEffect } from 'react';
import lottie from 'lottie-web';

export default function LottieLogo({ width = 180, loop = false, autoplay = true, style = {} }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay,
      path: '/assets/logo-animation.json',
    });

    return () => {
      if (animRef.current) animRef.current.destroy();
    };
  }, [loop, autoplay]);

  return (
    <div
      ref={containerRef}
      style={{ width, height: 'auto', ...style }}
    />
  );
}
