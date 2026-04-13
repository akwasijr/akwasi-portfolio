import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0, className = '', style = {}, y = 40, blur = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y, filter: blur ? 'blur(10px)' : 'none' }}
      animate={visible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y, filter: blur ? 'blur(10px)' : 'none' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
