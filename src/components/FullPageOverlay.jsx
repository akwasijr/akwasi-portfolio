import { motion } from 'framer-motion';
import Starfield from './Starfield';

const ease = [0.22, 1, 0.36, 1];

export default function FullPageOverlay({ pageId, pageTitle, originY, onClose, children }) {
  const topH = originY;
  const bottomH = 100 - originY;

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <Starfield count={25} />

      {/* Top curtain — slides up on enter, slides back down on exit */}
      <motion.div
        className="overlay__curtain overlay__curtain--top"
        style={{ height: topH + 'vh' }}
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        exit={{ y: 0 }}
        transition={{ duration: 0.8, ease }}
      />

      {/* Bottom curtain — slides down on enter, slides back up on exit */}
      <motion.div
        className="overlay__curtain overlay__curtain--bottom"
        style={{ height: bottomH + 'vh' }}
        initial={{ y: 0 }}
        animate={{ y: '100%' }}
        exit={{ y: 0 }}
        transition={{ duration: 0.8, ease }}
      />

      {/* Line draws left→right on enter, right→left on exit */}
      <motion.div
        className="overlay__split-line"
        style={{ top: originY + 'vh' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 1, 0] }}
        exit={{ scaleX: [0, 1, 1, 0] }}
        transition={{ duration: 1.2, times: [0, 0.4, 0.7, 1], ease }}
      />

      {/* Back button */}
      <motion.button
        className="overlay__back"
        onClick={onClose}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, delay: 0.6, ease }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </motion.button>

      {/* Page content — slides up on enter, slides down and fades on exit */}
      <motion.div
        className="overlay__content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{
          duration: 0.6,
          delay: 0.4,
          ease,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
