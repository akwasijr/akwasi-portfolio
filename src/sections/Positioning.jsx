import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const teams = [
  { name: 'Innovation Hub', desc: 'Early-stage ideation and inspiration to help customers envision possibilities.', phase: 'Inspire + Design' },
  { name: 'Studio 42', desc: 'Experience-led presales through storytelling and engineered prototypes.', phase: 'Inspire + Design', highlight: true },
  { name: 'Custom Consulting', desc: 'Architects supporting custom and complex solution envisioning.', phase: 'Inspire + Design' },
  { name: 'FDE', desc: 'Co-engineering transformational AI solutions with strategic customers.', phase: 'Empower + Achieve' },
  { name: 'ISD', desc: 'End-to-end custom industry solutions: architecture, engineering, change readiness.', phase: 'Empower + Achieve' },
  { name: 'ISE', desc: 'Engineering-led teams building complex, scalable, production-grade solutions.', phase: 'Empower + Achieve' },
];

export default function PositioningSection() {
  return (
    <section className="section section--purple" data-section="6">
      <Starfield count={20} />
      <div className="section-inner">
        <div className="pos-layout">
          <ScrollReveal>
            <h2 className="pos-heading-dark">Where<br />we fit</h2>
            <p className="pos-body-dark">
              Studio 42 sits in the Inspire + Design phase of MCEM,
              bridging vision with technical proof alongside peer teams.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="pos-teams-dark">
              {teams.map((team, i) => (
                <div key={i} className={"pos-team-dark" + (team.highlight ? " pos-team-dark--hl" : "")}>
                  <span className="pos-team-dark__name">{team.name}</span>
                  <span className="pos-team-dark__desc">{team.desc}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
