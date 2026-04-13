import { useRef, useEffect } from 'react';
import lottie from 'lottie-web';

export default function LottieLogo({ width = 180, loop = false, autoplay = true, variant = 'dark', style = {} }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const hasPlayed = useRef(false);

  const path = variant === 'light'
    ? '/assets/logo-animation-light.json'
    : '/assets/logo-animation.json';

  useEffect(() => {
    if (!containerRef.current) return;

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay: false,
      path,
    });

    return () => {
      if (animRef.current) animRef.current.destroy();
      hasPlayed.current = false;
    };
  }, [loop, path]);

  // Play only when autoplay becomes true, reset when false
  useEffect(() => {
    if (autoplay && animRef.current && !hasPlayed.current) {
      hasPlayed.current = true;
      animRef.current.goToAndPlay(0, true);
    }
    if (!autoplay) {
      hasPlayed.current = false;
    }
  }, [autoplay]);

  return (
    <div
      ref={containerRef}
      style={{ width, height: 'auto', ...style }}
    />
  );
}
