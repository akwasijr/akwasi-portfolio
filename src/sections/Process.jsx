import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const steps = [
  {
    num: '01',
    icon: '/assets/icons/01.svg',
    title: 'Discovery and Alignment',
    desc: 'We start by understanding your business goals, customer needs, and technical landscape. Together we define the challenge and align on what success looks like.',
  },
  {
    num: '02',
    icon: '/assets/icons/02.svg',
    title: 'Storytelling and Vision',
    desc: 'We craft a compelling narrative that connects your goals to Microsoft capabilities, building a shared vision that resonates with stakeholders at every level.',
  },
  {
    num: '03',
    icon: '/assets/icons/03.svg',
    title: 'Solution Envisioning',
    desc: 'Through collaborative workshops we explore possibilities, map user journeys, and define the solution space where technology meets real human needs.',
  },
  {
    num: '04',
    icon: '/assets/icons/04.svg',
    title: 'Vibe Prototyping',
    desc: 'Using AI-paired development we rapidly build functional prototypes that bring ideas to life. Real code, real interactions, validated in days.',
  },
  {
    num: '05',
    icon: '/assets/icons/05.svg',
    title: 'Architecture Design',
    desc: 'We synthesize requirements into a scalable, Azure-native architecture blueprint. Security, performance, and integration built in from the start.',
  },
  {
    num: '06',
    icon: '/assets/icons/06.svg',
    title: 'Delivery and Handoff',
    desc: 'Production-grade code, documentation, and knowledge transfer. We ensure your team is empowered to own, extend, and scale the solution forward.',
  },
];

export default function ProcessSection() {
  return (
    <section className="section section--blue" data-section="4">
      <Starfield count={40} />
      <div className="section-inner">
        <ScrollReveal blur>
          <p className="proc-label">Our process</p>
          <h2 className="proc-heading">
            From problem exploration to technical proof
          </h2>
        </ScrollReveal>

        <div className="proc-grid">
          {steps.map((s, i) => (
            <ScrollReveal key={s.num} delay={0.08 + i * 0.08} y={36}>
              <div className="proc-item">
                <div className="proc-item__top">
                  <span className="proc-item__num">{s.num}</span>
                  <img
                    src={s.icon}
                    alt=""
                    className="proc-item__icon"
                    loading="lazy"
                  />
                </div>
                <h3 className="proc-item__title">{s.title}</h3>
                <p className="proc-item__desc">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
