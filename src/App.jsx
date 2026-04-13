import { useEffect, useRef, useState, useCallback } from 'react';
import './styles/global.css';

import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import CircleWipe from './components/CircleWipe';
import HeroSection from './sections/Hero';
import AboutSection from './sections/About';
import CapabilitiesSection from './sections/Capabilities';
import ProcessSection from './sections/Process';
import CaseStudiesSection from './sections/CaseStudies';
import PositioningSection from './sections/Positioning';
import CTASection from './sections/CTA';

const TOTAL_SECTIONS = 7;

export default function App() {
  const containerRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);

  const scrollToSection = useCallback((index) => {
    const container = containerRef.current;
    if (!container) return;
    const sections = container.querySelectorAll('.section');
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Track current section via IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const sections = container.querySelectorAll('.section');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = Array.from(sections).indexOf(entry.target);
            if (idx >= 0) setCurrentSection(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToSection(Math.min(currentSection + 1, TOTAL_SECTIONS - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToSection(Math.max(currentSection - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, scrollToSection]);

  return (
    <>
      <CustomCursor />
      <Navigation
        currentSection={currentSection}
        totalSections={TOTAL_SECTIONS}
        onDotClick={scrollToSection}
      />
      <div ref={containerRef} className="scroll-container">
        <HeroSection />
        <CircleWipe>
          <AboutSection />
          <CapabilitiesSection />
        </CircleWipe>
        <ProcessSection />
        <CaseStudiesSection />
        <PositioningSection />
        <CTASection />
      </div>
    </>
  );
}
