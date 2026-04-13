import { motion } from 'framer-motion';
import Starfield from './Starfield';

const ease = [0.22, 1, 0.36, 1];

export default function FullPageOverlay({ pageId, pageTitle, onClose, children }) {
  return (
    <motion.div
      className="overlay"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.7, ease }}
    >
      <Starfield count={25} />

      {/* Big title that shows during transition */}
      <motion.div
        className="overlay__title-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, y: -60 }}
        transition={{ duration: 0.6, delay: 0.5, ease }}
      >
        <motion.h1
          className="overlay__title"
          initial={{ scale: 0.6, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
        >
          {pageTitle}
        </motion.h1>
      </motion.div>

      {/* Back button */}
      <motion.button
        className="overlay__back"
        onClick={onClose}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.9, ease }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </motion.button>

      {/* Page content — slides up after title fades */}
      <motion.div
        className="overlay__content"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.7, delay: 0.7, ease }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
