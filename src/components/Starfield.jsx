import { useRef, useEffect, useMemo } from 'react';

export default function Starfield({ count = 40 }) {
  // Generate star positions once at mount — pure CSS animation, no RAF loop
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
      type: Math.random(),
    })),
    [count]
  );

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className={s.type < 0.6 ? 'star star--dot' : 'star star--cross'}
          style={{
            left: s.x + '%',
            top: s.y + '%',
            '--size': s.size + 'px',
            '--delay': s.delay + 's',
            '--dur': s.duration + 's',
          }}
        />
      ))}
    </div>
  );
}
