import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

export default function AboutSection() {
  return (
    <section className="section section--purple" data-section="2">
      <Starfield count={45} />
      <div className="section-inner">
        <ScrollReveal blur>
          <h2 className="about-heading-white">
            Studio 42 is a global, cross-functional team blending UX,
            engineering, and data science to bring ideas to life.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15} blur>
          <div className="about-body">
            <p>
              We validate feasibility from day one. Our unique strength
              lies in bridging early concepting with deep technical insight.
              From visionary prototypes to complex custom-built solutions,
              we make innovation tangible.
            </p>
            <p>
              Experience-led presales through storytelling and engineered
              prototypes. We meet customers where they are and help them
              envision what is possible with Microsoft technologies.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
