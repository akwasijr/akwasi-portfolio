import ScrollReveal from '../components/ScrollReveal';

export default function CTASection() {
  return (
    <section className="section section--dark" data-section="6">
      <img src="/assets/patch-light.svg" alt="" className="patch-decoration"
        style={{ width: '500px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.03 }}
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
