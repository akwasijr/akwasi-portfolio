import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const pillars = [
  {
    num: '01',
    title: 'Storytelling',
    desc: 'We craft compelling narratives around Microsoft AI and Cloud capabilities that resonate with customers and inspire action.',
    bullets: [
      'Customer presentations and executive briefings',
      'Vision videos and interactive demos',
      'Narrative-driven solution showcases',
    ],
  },
  {
    num: '02',
    title: 'Vibe Prototyping',
    desc: 'Using AI-assisted development to rapidly prototype functional experiences that bring ideas to life in days, not months.',
    bullets: [
      'Functional prototypes in days',
      'AI-paired programming workflows',
      'Real working code, not mockups',
    ],
  },
  {
    num: '03',
    title: 'Product Delivery',
    desc: 'From prototype to production. We build scalable, enterprise-grade solutions on Microsoft technologies.',
    bullets: [
      'End-to-end development',
      'Azure-native architecture',
      'Production-grade code and handoff',
    ],
  },
];

export default function AboutSection() {
  return (
    <section className="section section--dark" data-section="2">
      <Starfield count={50} />
      <div className="section-inner">
        <ScrollReveal blur>
          <p className="wwd-label">What we do</p>
          <h2 className="wwd-heading">
            We turn complex AI capabilities into human-centered
            experiences that inspire action.
          </h2>
        </ScrollReveal>

        <div className="wwd-grid">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.num} delay={0.1 + i * 0.12} y={40}>
              <div className="wwd-card">
                <span className="wwd-card__num">{p.num}</span>
                <h3 className="wwd-card__title">{p.title}</h3>
                <p className="wwd-card__desc">{p.desc}</p>
                <ul className="wwd-card__bullets">
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
