import { motion } from 'framer-motion';
import Starfield from './Starfield';

const ease = [0.22, 1, 0.36, 1];

export default function FullPageOverlay({ pageId, pageTitle, originY, onClose, children }) {
  // Two curtains split from the clicked row's horizontal line
  // Top half slides up, bottom half slides down, revealing the page
  const topH = originY; // percent from top
  const bottomH = 100 - originY;

  return (
    <div className="overlay">
      <Starfield count={25} />

      {/* Top curtain — slides up */}
      <motion.div
        className="overlay__curtain overlay__curtain--top"
        style={{ height: topH + 'vh' }}
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        exit={{ y: 0 }}
        transition={{ duration: 0.8, ease }}
      />

      {/* Bottom curtain — slides down */}
      <motion.div
        className="overlay__curtain overlay__curtain--bottom"
        style={{ height: bottomH + 'vh' }}
        initial={{ y: 0 }}
        animate={{ y: '100%' }}
        exit={{ y: 0 }}
        transition={{ duration: 0.8, ease }}
      />

      {/* Horizontal line draws left to right, then disappears */}
      <motion.div
        className="overlay__split-line"
        style={{ top: originY + 'vh' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 1, 0] }}
        exit={{ scaleX: 0 }}
        transition={{ duration: 1.2, times: [0, 0.4, 0.7, 1], ease }}
      />

      {/* Back button */}
      <motion.button
        className="overlay__back"
        onClick={onClose}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </motion.button>

      {/* Page content — fades up after curtains open */}
      <motion.div
        className="overlay__content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.7, delay: 0.4, ease }}
      >
        {children}
      </motion.div>
    </div>
  );
}
