import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import './styles/global.css';

import CustomCursor from './components/CustomCursor';
import FullPageOverlay from './components/FullPageOverlay';
import CircleWipe from './components/CircleWipe';
import HeroSection from './sections/Hero';
import TableOfContentsSection from './sections/TableOfContents';
import AboutSection from './sections/About';
import HowIWorkSection from './sections/HowIWork';
import CaseStudiesSection from './sections/CaseStudies';
import CTASection from './sections/CTA';

const pageComponents = {
  'about': () => <AboutSection />,
  'how-i-work': () => <HowIWorkSection />,
  'selected-work': () => <CaseStudiesSection />,
  'contact': () => (
    <section className="section section--dark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: 'var(--font-family-display)' }}>
          Let's talk
        </h2>
        <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', marginTop: '24px', maxWidth: '500px', margin: '24px auto 0' }}>
          akwasi@outlook.com
        </p>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>
          +1 470 244 9539 / +31 6 340 15 149
        </p>
      </div>
    </section>
  ),
};

const pageTitles = {
  'about': 'About',
  'how-i-work': 'How I Work',
  'selected-work': 'Selected Work',
  'contact': 'Contact',
};

export default function App() {
  const containerRef = useRef(null);
  const [activePage, setActivePage] = useState(null);
  const [originY, setOriginY] = useState(50);

  const handleOpenPage = useCallback((pageId, clickY) => {
    const pct = clickY ? (clickY / window.innerHeight) * 100 : 50;
    setOriginY(pct);
    setActivePage(pageId);
  }, []);

  const handleClosePage = useCallback(() => {
    // Dispatch a "try-close" event — if a nested view (e.g. expanded card)
    // is open, it handles the event and prevents going all the way home
    const event = new CustomEvent('overlay-back', { cancelable: true });
    const cancelled = !window.dispatchEvent(event);
    if (!cancelled) {
      setActivePage(null);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activePage) {
        handleClosePage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePage, handleClosePage]);

  const PageContent = activePage ? pageComponents[activePage] : null;

  return (
    <>
      <CustomCursor />
      <div ref={containerRef} className="scroll-container">
        <HeroSection />
        <TableOfContentsSection onOpenPage={handleOpenPage} pageOpen={!!activePage} />
        <CTASection />
      </div>

      <AnimatePresence mode="wait">
        {activePage && PageContent && (
          <FullPageOverlay
            key={activePage}
            pageId={activePage}
            pageTitle={pageTitles[activePage] || ''}
            originY={originY}
            onClose={handleClosePage}
          >
            <PageContent />
          </FullPageOverlay>
        )}
      </AnimatePresence>
    </>
  );
}
