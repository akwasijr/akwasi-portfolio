import { useRef, useEffect } from 'react';
import lottie from 'lottie-web';

export default function LottieLogo({ width = 180, loop = false, autoplay = true, variant = 'dark', style = {} }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  const path = variant === 'light'
    ? '/assets/logo-animation-light.json'
    : '/assets/logo-animation.json';

  useEffect(() => {
    if (!containerRef.current) return;

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay,
      path,
    });

    return () => {
      if (animRef.current) animRef.current.destroy();
    };
  }, [loop, autoplay, path]);

  return (
    <div
      ref={containerRef}
      style={{ width, height: 'auto', ...style }}
    />
  );
}
