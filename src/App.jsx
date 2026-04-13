import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import './styles/global.css';

import CustomCursor from './components/CustomCursor';
import FullPageOverlay from './components/FullPageOverlay';
import CircleWipe from './components/CircleWipe';
import HeroSection from './sections/Hero';
import TableOfContentsSection from './sections/TableOfContents';
import AboutSection from './sections/About';
import CapabilitiesSection from './sections/Capabilities';
import WhatWeDoSection from './sections/WhatWeDo';
import ProcessSection from './sections/Process';
import CaseStudiesSection from './sections/CaseStudies';
import PositioningSection from './sections/Positioning';
import CTASection from './sections/CTA';

import TeamMap from './components/TeamMap';

const pageComponents = {
  'team': () => (
    <>
      <AboutSection />
      <CapabilitiesSection />
      <TeamMap />
    </>
  ),
  'process': () => <ProcessSection />,
  'what-we-do': () => <WhatWeDoSection />,
  'working-with-us': () => <PositioningSection />,
  'vibe-prototyping': () => (
    <section className="section section--dark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Vibe Prototyping
        </h2>
        <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', marginTop: '24px', maxWidth: '500px', margin: '24px auto 0' }}>
          Coming soon. We are building something exciting.
        </p>
      </div>
    </section>
  ),
  'selected-work': () => <CaseStudiesSection />,
};

const pageTitles = {
  'team': 'Team',
  'what-we-do': 'What We Do',
  'process': 'Process',
  'working-with-us': 'Working with Us',
  'vibe-prototyping': 'Vibe Prototyping',
  'selected-work': 'Selected Work',
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
    setActivePage(null);
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
