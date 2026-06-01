import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

/* ── Article data ── */
const articles = [
  {
    id: 'why-this-matters',
    number: '00',
    title: 'Interfaces where AI agents',
    subtitle: '',
    date: 'May 2026',
    readTime: '4 min read',
    tags: ['Design', 'AI', 'Agents'],
    lede: `Designing digital products used to be straightforward. Someone clicks something and something happens. Now the thing on the other side of the screen can suggest, act, and decide, which turns a familiar interface problem into a very different design problem that most teams are still learning how to handle.`,
    sections: [
      {
        heading: 'Agents are the new interface',
        body: `There is a shift happening that goes well beyond chatbots and copilots. People are starting to hand over real tasks to AI systems, not just "summarize this document" but "handle a calendar," "review these contracts," and "manage an investment portfolio overnight."

The moment software acts on someone's behalf, it stops feeling like a simple tool and starts feeling like a relationship that has to carry trust, delegation, and accountability all at once. That requires a different design vocabulary from the one most product teams have been using.

The problem is that many agent interfaces are still built by engineers for engineers, so they expose the wiring instead of supporting the person trying to get work done. For non-technical users, that is less like good software and more like being asked to babysit a machine that was supposed to help in the first place.`,
      },
      {
        heading: 'The gap between what is possible and what is usable',
        body: `The technology is moving fast, but the design still lags behind in all the places that actually determine whether a product feels usable.

The same pattern keeps showing up. A team builds something genuinely impressive, an agent that can research, synthesize, draft, schedule, and execute across multiple systems, then wraps it in an interface that feels like a control panel for the people who built it. That is like building a car and handing someone a terminal instead of a steering wheel.

The opportunity sits in that gap. Agents are getting more capable, but ordinary people still need a product that feels clear, calm, and legible, especially when the stakes are real and the work is messy. Making the technical accessible without hiding what matters is where the interesting design work now lives.`,
      },
      {
        heading: 'What this space explores',
        body: `This is not a textbook. It is a running collection of patterns, failures, and emerging ideas shaped by what agent products are actually asking people to do.

Some pieces look at the broad shifts in interaction design. Others focus on practical patterns for delegation, review, coordination, and oversight. A few go after the darker side of the space, because the manipulative version of agent design is arriving just as quickly as the useful version.

What matters most right now is not whether agents are coming, because they already are, but which design principles keep products usable once software starts acting with more independence. That question sits underneath everything that follows, and it is the right place to begin.`,
      },
    ],
  },
  {
    id: 'core-principles',
    number: '01',
    title: 'Outcomes, Exceptions, Values',
    subtitle: '',
    date: 'May 2026',
    readTime: '6 min read',
    tags: ['Agent UX', 'Principles'],
    lede: `Interfaces where AI does the work and humans make the calls tend to break in predictable places. Three principles keep showing up, and none of them is flashy, but ignoring any one of them is usually where the experience starts to wobble.`,
    sections: [
      {
        heading: 'Show results, not steps',
        body: `Most agent interfaces still sound like internal status reports: "Analyzing 12,000 compliance records. Step 3 of 7. Estimated time remaining: 14 minutes." That kind of running commentary usually answers the least important question in the room.

What people actually want to know is whether it worked, what changed, and whether anything now needs their attention. The strongest designs stack information in that order, with the outcome first, the impact second, and any required human decisions immediately after that. Detailed reasoning and logs can still exist, but they should sit behind a click instead of hijacking the whole screen.

Compare "Portfolio rebalancing complete. Estimated annual savings: $45K. Three positions need review" with a progress bar that narrates seven internal steps. The first version respects the person's time, while the second asks them to watch work they delegated on purpose.`,
      },
      {
        heading: 'Only interrupt when it matters',
        body: `Human attention is the most expensive resource in any system, which means every alert, every banner, and every "just letting you know" message needs to earn its place.

There is a short list of moments where interruption makes sense: the information is ambiguous and needs judgment, the action exceeds what the agent is allowed to do, the situation carries ethical weight, the agent has run into something unfamiliar, confidence is low, or two goals are competing with each other. Most other cases should be handled quietly and reported back in a calmer rhythm.

Silence is tricky, though, because people get uneasy when an agent disappears from view for too long. Good design solves that with low-drama reassurance, like "47 items processed normally today" or "No unusual patterns detected," instead of flooding the interface with activity that does not matter. The anti-pattern is the everything dashboard, which turns delegation into surveillance and defeats the point of having an agent at all.`,
      },
      {
        heading: 'Let people express intent, not system settings',
        body: `Nobody wakes up wanting to configure a maze of thresholds and internal rules. People describe work in human terms, so the interface should meet them there.

"Respond to client emails within a business day" is a better design surface than "set response_time_sla to 3600," not because it is simpler language but because it mirrors how people already think about responsibility. The same pattern holds across the board. "Be conservative and ask for review when unsure" is easier to trust than a cryptic confidence slider, and "handle routine tasks but check with a person on anything unusual" communicates far more than an abstract autonomy level ever will.

Values usually operate across three layers: non-negotiable rules set by the organization, recommended defaults that can be adjusted with a reason, and personal preferences that shape tone and working style. Once those principles are in place, the next question is whether the system can earn enough trust for people to rely on them in practice, because principles only matter if the relationship holds under pressure.`,
      },
    ],
  },
  {
    id: 'trust-building',
    number: '02',
    title: 'The trust journey',
    subtitle: '',
    date: 'May 2026',
    readTime: '7 min read',
    tags: ['Trust', 'Agent UX'],
    lede: `Every roadmap wants to skip to the part where the agent runs everything. Trust does not work that way. Nobody hands a new hire the keys on day one, and agents earn confidence the same way people do, by showing up and getting important work right over time.`,
    sections: [
      {
        heading: 'Four stages, not a switch',
        body: `Trust unfolds in stages, and each stage asks for a different interface.

In the supervised stage, the agent asks before doing almost anything meaningful, and the design needs to make reasoning visible because the human is still learning what the system can and cannot do. In the guided stage, the agent starts handling routine work independently while bigger decisions still come forward for review, which is where credibility begins to build.

In the collaborative stage, there is a working rhythm. The agent knows when to act, when to ask, and when to surface an exception, so the relationship starts to feel real instead of experimental. In the trusted stage, the agent operates with much more independence, summaries replace constant approvals, and people step in mainly when something unusual happens. The important thing is that movement between stages should be gradual, based on track record rather than elapsed time, and always reversible when performance slips.`,
      },
      {
        heading: 'What happens when it breaks',
        body: `Trust always breaks eventually. The real design question is whether the system makes recovery possible or makes the damage worse.

Teams often try to soften mistakes with vague language, partial explanations, or quiet fixes in the background. That is almost always the wrong move. When something goes wrong, the system should show what happened, describe the impact plainly, explain whether the issue looks isolated or systemic, and make it clear what the agent will do differently next time. It should also scale back the agent's independence for a while instead of acting as if nothing changed.

There is an awkward truth here. The more trust an agent earns, the less anyone watches it closely, which means the failures that do happen are easier to miss and more unsettling when they surface. That is why healthy trust design pairs autonomy with ongoing monitoring, periodic review, and proactive reporting on unusual cases even when the agent handled them successfully. Silence is rarely reassuring after a system has already asked people to rely on it.`,
      },
      {
        heading: 'How trust gets measured',
        body: `Trust feels emotional, but the behavior around it is visible if the product pays attention to the right signals.

Approval rates show whether people accept the agent's recommendations without rewriting them. Override frequency shows how often they decide to handle something manually instead. Setting churn reveals whether they keep changing autonomy levels because the current arrangement still feels wrong. Recovery speed shows how quickly they return to the previous comfort level after a mistake, which is often the clearest sign of whether confidence is actually rebuilding.

The most useful metric is usually the simplest one: how often people ask "why did it do that?" If that question starts appearing more often in support conversations, trust is already slipping. Once a team can see how trust rises, breaks, and recovers, the next problem becomes coordination, because even a trusted agent still needs clear rules for when it works alone, when it works with a person, and when it should step back.`,
      },
    ],
  },
  {
    id: 'coordination-zones',
    number: '03',
    title: 'Beyond "in the loop"',
    subtitle: '',
    date: 'May 2026',
    readTime: '5 min read',
    tags: ['Coordination', 'Framework'],
    lede: `Every conversation about AI agents eventually lands on the same question: "Is there a human in the loop?" That framing is too blunt for the way real work actually happens. A better model treats collaboration as movement between clear coordination zones rather than a yes-or-no control switch.`,
    sections: [
      {
        heading: 'Three zones instead of two',
        body: `Collaboration works better as three zones, each with a distinct pace and responsibility split.

Done together is real-time collaboration, where the person and the agent are both actively engaged. This is the right zone for complex decisions, creative exploration, high-stakes work, and any moment where trust is still forming. Done by delegation is the middle ground, where the agent handles the task and the person reviews the result later. It fits research, synthesis, and repetitive work with clear boundaries. Done in the background is the quietest zone, where the agent works continuously on low-risk, high-frequency tasks that do not deserve active supervision.

The common mistake is treating those zones like permanent labels attached to features. Work does not behave that neatly, and the best systems assume that a single task may travel across all three depending on what happens next.`,
      },
      {
        heading: 'A single task moves between zones',
        body: `Take a financial analysis workflow. Overnight, the agent monitors feeds in the background while nobody is watching. In the morning, it compiles an initial analysis by delegation so the analyst can review it on their own time. Then the analysis surfaces a surprising trend, and suddenly the work needs to shift into done together because interpretation now matters more than speed.

Once the analyst and the agent agree on the interpretation, the task can slip back into delegation while the final materials get drafted and formatted. One workflow can move through four transitions without feeling strange, but only if the interface makes those changes legible.

That is why zone design is less about naming categories and more about helping people understand the current mode of work, the next likely handoff, and what level of attention is expected from them right now.`,
      },
      {
        heading: 'Transitions are the real product',
        body: `Zone transitions are where agent experiences usually crack. Context gets lost, expectations get fuzzy, and people end up saying the system behaved strangely when the real problem was that the handoff was poorly designed.

When the agent needs to pull a human upward into the work, it should explain why this moment needs judgment before it asks for anything. It should also make timing flexible, because "not now" is often a reasonable answer. When the agent takes work back down into delegation or the background, it needs to confirm the handoff, state what will happen next, and leave an obvious way back in if the situation changes.

Once those transitions are stable, the next design surface comes into focus: the approval moment itself. That is where proposal cards, review flows, and automation levels stop being abstract governance ideas and start becoming interface decisions people actually feel.`,
      },
    ],
  },
  {
    id: 'approval-flows',
    number: '04',
    title: 'The proposal card',
    subtitle: '',
    date: 'May 2026',
    readTime: '6 min read',
    tags: ['Patterns', 'Approval'],
    lede: `Agent proposes, human reviews, human decides, agent adjusts. That loop is the foundation of a solid agent experience, and the proposal card is usually the place where that loop either becomes clear and usable or collapses into noise.`,
    sections: [
      {
        heading: 'Everything needed to decide, nothing extra',
        body: `A proposal card should be self-contained enough that the person reviewing it does not need to open three other screens just to understand the ask.

That means showing the action in plain language, the reason the agent thinks it is the right move, the main risks, any meaningful alternatives, the urgency, and the available responses, whether that is approve, adjust, reject, defer, or hand the decision to someone else. The card does not need to feel heavy every time, but it does need to feel complete.

The important design judgment is matching the amount of ceremony to the stakes. Low-risk routine decisions deserve a lighter card, standard decisions need the full layout, and major decisions should expand into deeper context and implications. If every proposal looks equally dramatic, people stop caring. If a consequential one looks lightweight, they stop trusting the system.`,
      },
      {
        heading: 'Approval flows depend on task type',
        body: `Not every task deserves the same leash, which is why automation levels need to be set per task type rather than as one global rule.

Some tasks belong in watch mode, where the agent only observes. Some fit assist mode, where it helps when asked. Others work best in advise mode, where it brings recommendations forward proactively. Then there are tasks where the agent can act and wait for confirmation before anything becomes final, and tasks where it can act first and report afterward because the cost of delay is higher than the cost of review.

That calibration exercise matters because it forces a real conversation about stakes. Scheduling a meeting is not the same as drafting an email in someone's voice, and neither is the same as reallocating a budget. The value of the workshop is rarely the final map alone. It is the disagreement that surfaces while people decide what should be automated, what still needs approval, and why.`,
      },
      {
        heading: 'Good approvals teach the system',
        body: `Every approval, edit, rejection, and defer action is a useful signal if the product is designed to learn from it.

When a person approves a proposal unchanged, the system learns what aligned well. When they rewrite part of it, the system gets a much sharper lesson about tone, timing, or judgment. When they reject a proposal and explain why, the product gains a boundary it should respect next time. Over time, that means fewer decisions need full review because the agent is learning the shape of acceptable action instead of asking the same question forever.

That is the upside. The risk is that teams become so focused on speeding up approvals that they start designing people into thoughtless consent, and that is exactly where useful automation turns into sludge. The next problem is not how to make approvals faster, but how to recognize when an agent experience is quietly becoming manipulative.`,
      },
    ],
  },
  {
    id: 'agentic-sludge',
    number: '05',
    title: 'When agents work against you',
    subtitle: '',
    date: 'May 2026',
    readTime: '7 min read',
    tags: ['Ethics', 'Dark Patterns'],
    lede: `Years went into naming dark patterns in interfaces, from trick buttons to hidden fees and exhausting opt-outs. Agents introduce a more slippery version of the same problem because the manipulation moves from what people see to what the system quietly does on their behalf.`,
    sections: [
      {
        heading: 'Six ways agents manipulate without notice',
        body: `Traditional dark patterns manipulate what people click. Agent-driven manipulation goes further, affecting what happens after the click, or sometimes without any meaningful click at all.

Opaque autonomy hides what the agent did and why. Consent erosion slowly expands the scope of action until the original agreement barely matters. Recovery friction makes reversal slow, partial, or practically impossible. Attention manipulation floods people with low-stakes noise so the truly important alert disappears into the pile. Autonomy creep nudges the system from suggest and wait into act and inform without a clear moment of permission. Goal drift makes the agent serve the platform's incentives while pretending it still serves the user.

None of these patterns needs a hostile interface to do harm. In fact, the dangerous version usually looks smooth, helpful, and oddly effortless right up until someone notices that the system has been moving faster than their consent.`,
      },
      {
        heading: 'A simple sludge audit',
        body: `Every autonomous feature deserves a short audit before it ships. The questions are simple, which is exactly why they work.

Can the person see what happened, why it happened, and what information shaped the decision without digging through layers of UI? Did they explicitly authorize this scope of action, not in a vague terms page but in a way that matches what the agent is now doing? Can they reverse the outcome within a reasonable amount of time, with a real undo path instead of a dead end? Are notifications proportional to the stakes instead of optimized for attention farming? Has the agent's level of independence changed since setup, and if it has, was that change visible and approved? Most importantly, is the system still serving the person's goals, or has it started serving the product's business goals instead?

A feature does not need to fail all six questions to have a problem. Two weak answers are usually enough to tell a team that the experience is drifting somewhere ugly.`,
      },
      {
        heading: 'Design counters for sludge',
        body: `Each form of sludge has a fairly direct counter if a team decides to design for dignity instead of extraction.

Opaque autonomy gets an intent preview or an action summary that is easy to inspect. Consent erosion gets explicit re-authorization whenever scope expands. Recovery friction gets a visible audit trail and a real undo path. Attention manipulation gets ranking based on stakes rather than engagement. Autonomy creep gets clear change notices with meaningful approval. Goal drift gets plain language that states whose interests the agent is serving and where the boundaries are.

This matters even more once a product moves from one agent to several, because bad patterns scale fast when tasks are bouncing between specialized systems. The next challenge is orchestration, and it raises a harder question than whether one agent can be trusted: how people stay oriented when an entire team of agents is working at once.`,
      },
    ],
  },
  {
    id: 'agents-across-industries',
    number: '06',
    title: 'Emerging agent trends across industries',
    subtitle: '',
    date: 'May 2026',
    readTime: '6 min read',
    tags: ['Use Cases', 'Industry'],
    lede: `Agent experiences are not a single-industry trend. They are showing up across commerce, healthcare, finance, legal, logistics, and enterprise operations, and each domain keeps exposing the same design question in a slightly different costume.`,
    sections: [
      {
        heading: 'The dual-mode question',
        body: `Every industry is hitting the same fork in the road. One path rebuilds the experience around agents, letting them handle research, comparison, scheduling, negotiation, and routine decisions while people step in only for the moments that truly deserve judgment. The other path keeps the experience human-first but adds a structured layer underneath so agents can act on behalf of people who would rather delegate the busywork.

That tension matters because both modes are likely to coexist for a long time. A person may want to browse products directly, review medical results personally, or explore investment options on their own, while still expecting an agent to do the repetitive sorting, drafting, checking, and scheduling around the edges. Good design has to support both without making either mode feel secondary.

The pattern holds across sectors even when the stakes vary wildly, which means the interesting work is not choosing one mode forever but designing a product that can shift between them without confusing the person who is still accountable at the end.`,
      },
      {
        heading: 'Where the patterns change by sector',
        body: `Commerce makes the shift easiest to see. Agents can compare prices, assemble carts, and shortlist options, while the customer confirms the final purchase. In B2B procurement, they can compare suppliers, flag anomalies, and prepare negotiation positions before a buyer ever opens the screen.

Healthcare changes the equation because the trust threshold is far higher and the cost of overconfidence is not a bad purchase but real harm. Finance puts pressure on auditability because every recommendation and action needs a trace people can review later. Legal work brings an adversarial edge, which means the interface has to support caution, argument, and review rather than just efficiency. Logistics pushes toward orchestration at scale because hundreds of small decisions happen every hour and nobody can approve each one manually.

Different sectors stretch different parts of the design, but they all keep returning to the same split of authority: where the agent can act alone, where it should check in, and where a human must take over.`,
      },
      {
        heading: 'When agents negotiate with other agents',
        body: `The most interesting frontier may be agent-to-agent interaction, where systems represent different organizations and negotiate directly within clear boundaries. Procurement is the cleanest example. One side knows the budget, quality requirements, and delivery window. The other knows inventory, pricing flexibility, and production constraints. Instead of waiting through a long chain of emails, the agents can exchange proposals, counter within approved limits, flag deadlocks, and hand only the hard calls back to people.

That changes the design problem completely. The interface is no longer just about helping one person supervise one agent. It has to explain a fast negotiation that happened between systems, show what each side was allowed to concede, reveal where the process paused for review, and make the final outcome easy to audit. Review surfaces, escalation paths, and boundary-setting tools become just as important as the negotiation itself.

That is probably the clearest sign of where this space is heading. The products that matter will not simply bolt an agent onto an old interface. They will redesign the experience around delegated work, visible boundaries, and human judgment that still arrives at the moments that count.`,
      },
    ],
  },
];


/* ── Blog list card ── */
function BlogCard({ article, index, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      className="blog-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.06, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="blog-card__inner">
        <h3 className="blog-card__title">
          <motion.span
            style={{ display: 'inline-block' }}
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.25, ease }}
          >
            {article.title}
          </motion.span>
        </h3>
        <p className="blog-card__subtitle">{article.subtitle}</p>
        <div className="blog-card__tags">
          {article.tags.map(t => <span key={t} className="blog-card__tag">{t}</span>)}
          <span className="blog-card__read-time">{article.readTime}</span>
        </div>
      </div>
      <div className="blog-card__pictogram">
        <BlogPictogram index={index} hovered={hovered} />
      </div>
    </motion.article>
  );
}

/* ── Inline pictograms for each article ── */
function BlogPictogram({ index, hovered }) {
  const stroke = hovered ? '#1a1a1a' : '#999';
  const accent = hovered ? '#7779f0' : '#bbb';
  const sw = 1.2;

  const pictograms = [
    // 00 - Why I wrote this: pen/writing
    <svg viewBox="0 0 80 80" fill="none" key="p0">
      <path d="M20 60L55 25l5 5-35 35-8 3z" stroke={stroke} strokeWidth={sw} />
      <path d="M50 30l5-5 5 5-5 5z" stroke={accent} strokeWidth={sw} />
      <line x1="20" y1="60" x2="25" y2="57" stroke={accent} strokeWidth={sw * 0.7} />
    </svg>,
    // 01 - Outcomes, Exceptions, Values: three stacked layers
    <svg viewBox="0 0 80 80" fill="none" key="p1">
      <path d="M15 50l25-12 25 12-25 12z" stroke={stroke} strokeWidth={sw} />
      <path d="M15 40l25-12 25 12" stroke={accent} strokeWidth={sw} />
      <path d="M15 30l25-12 25 12" stroke={stroke} strokeWidth={sw} opacity={0.5} />
    </svg>,
    // 02 - Trust journey: battery/charge
    <svg viewBox="0 0 80 80" fill="none" key="p2">
      <rect x="18" y="22" width="40" height="36" stroke={stroke} strokeWidth={sw} />
      <rect x="58" y="32" width="6" height="16" stroke={stroke} strokeWidth={sw} />
      <rect x="22" y="26" width="12" height="28" fill={accent} opacity={0.3} />
      <rect x="36" y="34" width="12" height="20" fill={accent} opacity={0.2} />
    </svg>,
    // 03 - Beyond in the loop: three connected zones
    <svg viewBox="0 0 80 80" fill="none" key="p3">
      <rect x="10" y="30" width="16" height="16" stroke={stroke} strokeWidth={sw} />
      <rect x="32" y="30" width="16" height="16" stroke={accent} strokeWidth={sw} />
      <rect x="54" y="30" width="16" height="16" stroke={stroke} strokeWidth={sw} />
      <line x1="26" y1="38" x2="32" y2="38" stroke={stroke} strokeWidth={sw * 0.7} />
      <line x1="48" y1="38" x2="54" y2="38" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d="M18 52v8h44v-8" stroke={accent} strokeWidth={sw * 0.7} opacity={0.4} />
    </svg>,
    // 04 - Proposal card: card with checkmark
    <svg viewBox="0 0 80 80" fill="none" key="p4">
      <rect x="16" y="16" width="48" height="48" stroke={stroke} strokeWidth={sw} />
      <line x1="24" y1="28" x2="56" y2="28" stroke={accent} strokeWidth={sw * 0.7} opacity={0.4} />
      <line x1="24" y1="36" x2="48" y2="36" stroke={stroke} strokeWidth={sw * 0.7} opacity={0.3} />
      <line x1="24" y1="42" x2="44" y2="42" stroke={stroke} strokeWidth={sw * 0.7} opacity={0.3} />
      <polyline points="30,52 36,58 50,44" stroke={accent} strokeWidth={sw * 1.2} fill="none" />
    </svg>,
    // 05 - Agentic sludge: warning/caution
    <svg viewBox="0 0 80 80" fill="none" key="p5">
      <path d="M40 16L12 64h56z" stroke={stroke} strokeWidth={sw} />
      <line x1="40" y1="32" x2="40" y2="48" stroke={accent} strokeWidth={sw * 1.2} />
      <rect x="38" y="53" width="4" height="4" fill={accent} />
    </svg>,
  ];

  return pictograms[index] || pictograms[0];
}


/* ── Large pictogram for article detail view ── */
function ArticlePictogram({ index }) {
  const s = '#bbb';
  const a = '#7779f0';
  const w = 1;

  const pictograms = [
    // 00 - Interfaces where AI agents: cursor + agent window
    <svg viewBox="0 0 200 120" fill="none" key="ap0">
      <rect x="30" y="10" width="100" height="70" stroke={s} strokeWidth={w} />
      <line x1="30" y1="24" x2="130" y2="24" stroke={s} strokeWidth={w} opacity={0.4} />
      <rect x="38" y="32" width="40" height="4" fill={s} opacity={0.3} />
      <rect x="38" y="42" width="55" height="4" fill={s} opacity={0.2} />
      <rect x="38" y="52" width="30" height="4" fill={s} opacity={0.2} />
      <rect x="38" y="62" width="48" height="4" fill={a} opacity={0.3} />
      <path d="M150 50l-10 6v-12z" fill={a} opacity={0.5} />
      <circle cx="165" cy="50" r="12" stroke={a} strokeWidth={w} />
      <circle cx="165" cy="46" r="3" stroke={a} strokeWidth={w * 0.7} />
      <path d="M158 56a7 7 0 0114 0" stroke={a} strokeWidth={w * 0.7} />
    </svg>,
    // 01 - Outcomes, Exceptions, Values: stacked result cards
    <svg viewBox="0 0 200 120" fill="none" key="ap1">
      <rect x="25" y="20" width="70" height="80" stroke={s} strokeWidth={w} />
      <rect x="33" y="30" width="30" height="4" fill={a} opacity={0.4} />
      <rect x="33" y="40" width="50" height="3" fill={s} opacity={0.2} />
      <rect x="33" y="48" width="45" height="3" fill={s} opacity={0.2} />
      <polyline points="33,64 39,70 51,58" stroke={a} strokeWidth={w} fill="none" />
      <rect x="33" y="78" width="50" height="12" stroke={a} strokeWidth={w} opacity={0.3} />
      <rect x="110" y="10" width="65" height="24" stroke={s} strokeWidth={w} opacity={0.5} />
      <rect x="116" y="16" width="28" height="3" fill={s} opacity={0.3} />
      <rect x="116" y="23" width="40" height="3" fill={s} opacity={0.2} />
      <rect x="110" y="44" width="65" height="24" stroke={a} strokeWidth={w} opacity={0.4} />
      <rect x="116" y="50" width="32" height="3" fill={a} opacity={0.3} />
      <rect x="116" y="57" width="45" height="3" fill={s} opacity={0.2} />
      <rect x="110" y="78" width="65" height="24" stroke={s} strokeWidth={w} opacity={0.3} />
      <rect x="116" y="84" width="25" height="3" fill={s} opacity={0.2} />
      <rect x="116" y="91" width="38" height="3" fill={s} opacity={0.15} />
    </svg>,
    // 02 - Trust journey: battery charging through stages
    <svg viewBox="0 0 200 120" fill="none" key="ap2">
      <rect x="20" y="35" width="120" height="50" stroke={s} strokeWidth={w} />
      <rect x="140" y="48" width="10" height="24" stroke={s} strokeWidth={w} />
      <rect x="28" y="43" width="20" height="34" fill={a} opacity={0.15} />
      <rect x="52" y="43" width="20" height="34" fill={a} opacity={0.25} />
      <rect x="76" y="43" width="20" height="34" fill={a} opacity={0.35} />
      <rect x="100" y="43" width="20" height="34" fill={a} opacity={0.5} />
      <line x1="28" y1="95" x2="132" y2="95" stroke={s} strokeWidth={w} opacity={0.3} />
      <circle cx="28" cy="95" r="2" fill={s} opacity={0.4} />
      <circle cx="62" cy="95" r="2" fill={s} opacity={0.4} />
      <circle cx="97" cy="95" r="2" fill={a} opacity={0.5} />
      <circle cx="132" cy="95" r="2" fill={a} opacity={0.6} />
      <text x="24" y="110" fill={s} fontSize="7" fontFamily="monospace" opacity={0.4}>supervised</text>
      <text x="73" y="110" fill={s} fontSize="7" fontFamily="monospace" opacity={0.4}>guided</text>
      <text x="110" y="110" fill={a} fontSize="7" fontFamily="monospace" opacity={0.5}>trusted</text>
    </svg>,
    // 03 - Beyond in the loop: three connected zones with flow
    <svg viewBox="0 0 200 120" fill="none" key="ap3">
      <rect x="10" y="35" width="50" height="50" stroke={s} strokeWidth={w} />
      <rect x="75" y="35" width="50" height="50" stroke={a} strokeWidth={w} />
      <rect x="140" y="35" width="50" height="50" stroke={s} strokeWidth={w} />
      <path d="M60 60h15" stroke={s} strokeWidth={w} strokeDasharray="3 2" />
      <path d="M125 60h15" stroke={s} strokeWidth={w} strokeDasharray="3 2" />
      <circle cx="35" cy="55" r="6" stroke={s} strokeWidth={w * 0.7} />
      <circle cx="35" cy="53" r="2" fill={s} opacity={0.3} />
      <circle cx="100" cy="52" r="5" stroke={a} strokeWidth={w * 0.7} />
      <rect x="93" y="62" width="14" height="10" stroke={a} strokeWidth={w * 0.7} opacity={0.4} />
      <circle cx="165" cy="55" r="6" stroke={s} strokeWidth={w * 0.7} opacity={0.5} />
      <text x="17" y="100" fill={s} fontSize="7" fontFamily="monospace" opacity={0.4}>together</text>
      <text x="78" y="100" fill={a} fontSize="7" fontFamily="monospace" opacity={0.5}>delegated</text>
      <text x="140" y="100" fill={s} fontSize="7" fontFamily="monospace" opacity={0.4}>background</text>
    </svg>,
    // 04 - Proposal card: approval interface
    <svg viewBox="0 0 200 120" fill="none" key="ap4">
      <rect x="40" y="10" width="120" height="100" stroke={s} strokeWidth={w} />
      <rect x="52" y="22" width="50" height="5" fill={s} opacity={0.3} />
      <rect x="52" y="34" width="90" height="3" fill={s} opacity={0.15} />
      <rect x="52" y="42" width="80" height="3" fill={s} opacity={0.15} />
      <rect x="52" y="50" width="70" height="3" fill={s} opacity={0.15} />
      <line x1="52" y1="62" x2="148" y2="62" stroke={s} strokeWidth={w} opacity={0.2} />
      <rect x="52" y="72" width="40" height="18" stroke={a} strokeWidth={w} />
      <text x="60" y="84" fill={a} fontSize="8" fontFamily="monospace" opacity={0.6}>approve</text>
      <rect x="100" y="72" width="40" height="18" stroke={s} strokeWidth={w} opacity={0.5} />
      <text x="110" y="84" fill={s} fontSize="8" fontFamily="monospace" opacity={0.4}>adjust</text>
    </svg>,
    // 05 - Agentic sludge: warning with hidden layers
    <svg viewBox="0 0 200 120" fill="none" key="ap5">
      <path d="M100 10L40 100h120z" stroke={s} strokeWidth={w} />
      <line x1="100" y1="40" x2="100" y2="70" stroke={a} strokeWidth={w * 1.5} />
      <rect x="97" y="78" width="6" height="6" fill={a} />
      <line x1="60" y1="85" x2="80" y2="85" stroke={s} strokeWidth={w * 0.7} opacity={0.2} />
      <line x1="120" y1="85" x2="140" y2="85" stroke={s} strokeWidth={w * 0.7} opacity={0.2} />
      <line x1="55" y1="92" x2="75" y2="92" stroke={s} strokeWidth={w * 0.7} opacity={0.15} />
      <line x1="125" y1="92" x2="145" y2="92" stroke={s} strokeWidth={w * 0.7} opacity={0.15} />
    </svg>,
    // 06 - Where agents show up: multi-industry grid
    <svg viewBox="0 0 200 120" fill="none" key="ap6">
      <rect x="10" y="10" width="55" height="45" stroke={s} strokeWidth={w} />
      <rect x="18" y="18" width="20" height="3" fill={s} opacity={0.3} />
      <rect x="18" y="26" width="35" height="3" fill={s} opacity={0.15} />
      <rect x="18" y="34" width="28" height="3" fill={a} opacity={0.3} />
      <rect x="73" y="10" width="55" height="45" stroke={a} strokeWidth={w} opacity={0.6} />
      <rect x="81" y="18" width="24" height="3" fill={a} opacity={0.3} />
      <rect x="81" y="26" width="38" height="3" fill={s} opacity={0.15} />
      <rect x="81" y="34" width="30" height="3" fill={s} opacity={0.15} />
      <rect x="136" y="10" width="55" height="45" stroke={s} strokeWidth={w} />
      <rect x="144" y="18" width="18" height="3" fill={s} opacity={0.3} />
      <rect x="144" y="26" width="32" height="3" fill={s} opacity={0.15} />
      <rect x="144" y="34" width="26" height="3" fill={a} opacity={0.2} />
      <rect x="10" y="65" width="55" height="45" stroke={s} strokeWidth={w} opacity={0.6} />
      <rect x="18" y="73" width="22" height="3" fill={s} opacity={0.2} />
      <rect x="18" y="81" width="36" height="3" fill={s} opacity={0.15} />
      <rect x="73" y="65" width="55" height="45" stroke={s} strokeWidth={w} opacity={0.4} />
      <rect x="81" y="73" width="26" height="3" fill={s} opacity={0.2} />
      <rect x="81" y="81" width="32" height="3" fill={s} opacity={0.15} />
      <path d="M145 78l8 8 8-8" stroke={a} strokeWidth={w} fill="none" />
      <path d="M145 92l8 8 8-8" stroke={s} strokeWidth={w} fill="none" opacity={0.3} />
    </svg>,
  ];

  return (
    <motion.div
      className="blog-article__pictogram"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease }}
    >
      {pictograms[index] || pictograms[0]}
    </motion.div>
  );
}

/* ── Article detail view ── */
function ArticleView({ article, articleIndex, onBack }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const overlay = containerRef.current.closest('.overlay');
      if (overlay) overlay.scrollTop = 0;
    }
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="blog-article"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease }}
    >
      <nav className="blog-article__nav">
        <button className="blog-article__back" onClick={onBack}>
          ← All articles
        </button>
      </nav>

      <header className="blog-article__header">
        <div className="blog-article__meta">
          {article.readTime}
        </div>
        <motion.h1
          className="blog-article__title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease }}
        >
          {article.title}
        </motion.h1>
        <motion.p
          className="blog-article__subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease }}
        >
          {article.subtitle}
        </motion.p>
      </header>

      <ArticlePictogram index={articleIndex} />

      <motion.div
        className="blog-article__lede"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.24, ease }}
      >
        <p>{article.lede}</p>
      </motion.div>

      <div className="blog-article__body">
        {article.sections.map((section, i) => (
          <ArticleSection key={i} section={section} />
        ))}
      </div>

      <footer className="blog-article__footer">
        <button className="blog-article__back" onClick={onBack}>
          ← All articles
        </button>
      </footer>
    </motion.div>
  );
}

function ArticleSection({ section }) {
  return (
    <section className="blog-article__section">
      <h2>{section.heading}</h2>
      {section.body.split('\n\n').map((para, j) => (
        <p key={j}>{para}</p>
      ))}
    </section>
  );
}


/* ── Blog section (list + detail) ── */
export default function BlogSection() {
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!activeArticle) return;
    const handler = (e) => {
      e.preventDefault();
      setActiveArticle(null);
      setActiveIndex(0);
    };
    window.addEventListener('overlay-back', handler);
    return () => window.removeEventListener('overlay-back', handler);
  }, [activeArticle]);

  return (
    <div className="blog-section">
      <AnimatePresence mode="wait">
        {activeArticle ? (
          <ArticleView
            key={activeArticle.id}
            article={activeArticle}
            articleIndex={activeIndex}
            onBack={() => { setActiveArticle(null); setActiveIndex(0); }}
          />
        ) : (
          <motion.div
            key="list"
            className="blog-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <header className="blog-list__header">
              <motion.h2
                className="blog-list__title"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08, ease }}
              >
                Blog
              </motion.h2>
              <motion.p
                className="blog-list__desc"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16, ease }}
              >
                Thinking out loud about what happens when interfaces<br />
                start acting on your behalf. New patterns, emerging<br />
                trends, and the design questions nobody has good answers to yet.
              </motion.p>
            </header>

            <div className="blog-list__grid">
              {articles.map((article, i) => (
                <BlogCard
                  key={article.id}
                  article={article}
                  index={i}
                  onClick={() => { setActiveArticle(article); setActiveIndex(i); }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
