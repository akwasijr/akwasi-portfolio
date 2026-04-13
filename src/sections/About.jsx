import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const disciplines = [
  { abbr: 'PM', name: 'Product Management', color: '#F2A573' },
  { abbr: 'UXD', name: 'UX Designers', color: '#7E80EE' },
  { abbr: 'UXE', name: 'UX Engineers', color: '#1376BF' },
  { abbr: 'DS', name: 'Data Science', color: '#F45A9B' },
  { abbr: 'SEC', name: 'Security', color: '#4AA75F' },
  { abbr: 'TA', name: 'Technical Architects', color: '#F2A573' },
];

export default function AboutSection() {
  return (
    <section className="section section--dark">
      <Starfield count={50} />
      <div className="section-inner">
        <ScrollReveal blur>
          <p className="wwd-label">Our team</p>
          <h2 className="wwd-heading">
            A global, cross-functional team blending UX,
            engineering, and data science to bring ideas to life.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', maxWidth: '640px', marginTop: '32px' }}>
            We validate feasibility from day one. Our unique strength lies
            in bridging early concepting with deep technical insight. From
            visionary prototypes to complex custom-built solutions, we make
            innovation tangible.
          </p>
        </ScrollReveal>

        <div className="team-grid">
          {disciplines.map((d, i) => (
            <ScrollReveal key={d.abbr} delay={0.1 + i * 0.08} y={30}>
              <div className="team-card">
                <div className="team-card__badge" style={{ borderColor: d.color }}>
                  {d.abbr}
                </div>
                <span className="team-card__name">{d.name}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
