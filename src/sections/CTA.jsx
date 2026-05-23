import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

export default function CTASection() {
  return (
    <section className="section section--dark" data-section="7">
      <Starfield count={20} />

      <div className="section-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ScrollReveal blur>
          <h2 className="cta-heading">Let's build<br />something together.</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="cta-body">
            From AI strategy to working product. Available for<br />
            enterprise engagements and collaborations.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>akwasi@outlook.com</span>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>+1 470 244 9539 · +31 6 340 15 149</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.35}>
          <a href="mailto:akwasi@outlook.com" className="cta-btn">
            Say hello <span className="cta-btn__arrow">&#8594;</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
