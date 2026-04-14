import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

export default function CTASection() {
  return (
    <section className="section section--dark" data-section="7">
      <Starfield count={20} />
      <img src="/assets/circle-badge.svg" alt="" className="hero-badge"
        style={{ opacity: 0.12, right: '8%', bottom: '8%' }}
        role="presentation" />

      <div className="section-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ScrollReveal blur>
          <h2 className="cta-heading">Ready to<br />take the leap?</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="cta-body">
            From strategy to use cases, to patterns, to platforms.
            Let us help you move from vision to value.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <a href="https://aka.ms/studio42" target="_blank" rel="noopener noreferrer" className="cta-btn">
            Get in touch <span className="cta-btn__arrow">&#8594;</span>
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <img src="/assets/logo.svg" alt="Studio 42"
            style={{ width: '100px', marginTop: '64px', opacity: 0.2 }} />
        </ScrollReveal>
      </div>
    </section>
  );
}
