import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

/* ── Article data ── */
const articles = [
  {
    id: 'why-this-matters',
    number: '00',
    title: 'Why I wrote this',
    subtitle: 'Design got a new material. We need new rules for it.',
    date: 'May 2026',
    readTime: '4 min read',
    tags: ['Design', 'AI'],
    lede: 'I have been designing digital products for over a decade. In the last few years, something fundamental shifted. The thing we are designing is no longer just an interface. It is a relationship between a person and a system that acts on their behalf. That changes everything about how I think about my craft.',
    sections: [
      {
        heading: 'A design problem, not a technology problem',
        body: `There is no shortage of writing about AI. Most of it is about what the technology can do. Very little of it is about what it should do, and even less about how to design the experience around it.\n\nThat gap is what motivated this series. I kept running into the same problems across different projects and different industries. An agent that technically worked but that nobody trusted. A dashboard that showed everything the AI was doing but helped nobody make a decision. An approval flow that felt like bureaucracy instead of collaboration.\n\nThese are not engineering failures. They are design failures. And they happen because we are applying old design patterns to a fundamentally new kind of interaction.`,
      },
      {
        heading: 'The shift from tools to teammates',
        body: `For most of software history, we designed tools. The user has intent, the tool executes. Click here, get that. The interface is a control panel.\n\nAgents are different. They have their own intent (or at least the appearance of it). They make decisions. They take actions. They come back and tell you what they did. That is not a tool. That is a working relationship.\n\nAnd working relationships require a completely different design vocabulary. Trust. Delegation. Accountability. Repair. These are words from organizational psychology, not interface design. But they are exactly the words we need.\n\nI spent the last year pulling together the patterns and principles that actually work. Not the theoretical frameworks that sound good in a presentation, but the specific design decisions that made real products better for real people.`,
      },
      {
        heading: 'What this series covers',
        body: `Seven articles, each tackling a different dimension of designing for agents.\n\nI start with three principles that kept showing up across every project I worked on. Then trust, because without it nothing else matters. Then the coordination model I use instead of the overused "human in the loop" framing. Then the core UI patterns for approvals and delegation. Then agentic sludge, which is the dark pattern conversation the industry is not having yet. Then multi-agent systems, because the future is teams of agents, not solo ones. And finally the workshop exercises I use to get organizations aligned before a single pixel is designed.\n\nEvery article is grounded in work I have actually done. No hypothetical scenarios. No "imagine a world where." Just the patterns I have tested, the mistakes I have made, and the things I wish I had known earlier.`,
      },
    ],
  },
  {
    id: 'core-principles',
    number: '01',
    title: 'Outcomes, Exceptions, Values',
    subtitle: 'Three rules I keep coming back to when designing for agents',
    date: 'May 2026',
    readTime: '6 min read',
    tags: ['Agent UX', 'Principles'],
    lede: 'I spent the better part of last year designing interfaces where AI does the work and humans make the calls. Somewhere in that process, three principles kept showing up. They are not groundbreaking on their own, but every time I ignored one of them, the design fell apart.',
    sections: [
      {
        heading: 'Show results, not steps',
        body: `Here is something I see constantly in agent interfaces: "Processing record 4,532 of 12,000. Step 3 of 7: Validating compliance." Nobody needs that. Nobody wants that. It is the software equivalent of someone narrating every turn they take while driving you somewhere.\n\nWhat people actually want to know is: did it work, what changed, and do I need to do anything?\n\nSo I started stacking information in priority order. The outcome comes first and it is always visible. The impact comes next because people want to know what it means for them. Then any decisions that still need a human. Everything else, the how-it-was-done summary and the detailed logs, those go behind a click.\n\nCompare "Portfolio rebalancing complete. Estimated annual savings: $45K. 3 positions need your review" to a progress bar with seven steps. The first one lets you get on with your day. The second one makes you watch.`,
      },
      {
        heading: 'Only interrupt when it matters',
        body: `Human attention is the most expensive resource in any system. Every notification, every alert, every "just letting you know" carries a cost. The question is whether the information is worth that cost.\n\nI keep a short list of the situations where a human genuinely needs to be pulled in: the data is ambiguous and requires judgment. The action exceeds what the agent is allowed to do. There is an ethical dimension. It is a situation nobody has seen before. The agent is not confident. Or two goals are competing with each other.\n\nEverything else? Handle it and tell me later.\n\nThe tricky part is the silence. When an agent is quietly doing its job, people get nervous. "Is it still working? Did it miss something?" So you need those periodic reassurances. "47 items processed normally today." "No unusual patterns detected." It sounds simple but getting that balance right is honestly the hardest design challenge in this space.\n\nI call the anti-pattern "The Everything Dashboard." It shows every action the agent took, which completely defeats the purpose of having an agent in the first place.`,
      },
      {
        heading: 'Let people talk like people',
        body: `Nobody thinks in thresholds. Nobody wakes up and says "I want my response_time_sla set to 3600." They say "respond to client emails within a business day." That is the same instruction but one of them feels like configuring a router and the other feels like talking to a colleague.\n\nThe design shift is small but it changes everything. Instead of risk_score_threshold: 0.65, you get "be conservative, when you're unsure, ask me." Instead of max_autonomy_level: 3, you get "handle routine tasks but check with me on anything unusual."\n\nI think about values in three layers. Some are non-negotiable, set at the org level, and nobody can override them. Some are recommended by leadership but you can adjust them if you have a reason. And some are personal preferences that just make the experience feel like yours.\n\nThe interesting design moment is when values conflict. "You said you want speed and accuracy. Right now those are pulling in different directions. Which one matters more here?" That is a real conversation, not a settings panel.`,
      },
    ],
  },
  {
    id: 'trust-building',
    number: '02',
    title: 'The trust journey',
    subtitle: 'Nobody trusts a new coworker on day one. Same goes for agents.',
    date: 'May 2026',
    readTime: '7 min read',
    tags: ['Trust', 'Agent UX'],
    lede: 'Every product manager I have worked with wants to skip to the part where the agent runs everything. But trust does not work that way. You would not hand a new team member the keys to production on their first week. Agents earn trust the same way people do, by showing up and getting things right, repeatedly.',
    sections: [
      {
        heading: 'Four stages, not a switch',
        body: `I think about trust in four stages and each one has completely different design needs.\n\nIn the Supervised stage, the agent asks before doing anything. Every decision gets shown with full reasoning. It is high overhead and that is the point. This is where the human is learning what this thing can actually do.\n\nIn the Guided stage, the agent starts handling routine stuff on its own. Big decisions still come to you. This is where credibility gets built.\n\nIn the Collaborative stage, you have a working rhythm. The agent knows when to act and when to ask. You are mostly dealing with exceptions. This is where it starts to feel like a real working relationship.\n\nIn the Trusted stage, the agent operates independently. You get summaries. You step in when something goes sideways. This is the goal but you cannot start here.\n\nThe key thing about transitions: they need to be gradual, based on track record not time, and always reversible. If the agent messes up at stage three, it should drop back to stage two for a while. Nobody should have to rebuild from zero.`,
      },
      {
        heading: 'What happens when it breaks',
        body: `Trust breaks. It just does. The question is what happens next.\n\nI have seen teams try to hide errors or minimize them. That is the worst thing you can do. When something goes wrong, you need immediate transparency about what happened. Then an honest assessment of the impact. Then whether this was a one-off or a pattern. Then what you are changing to prevent it. And then, critically, the agent needs to step back and operate with less independence for a while.\n\nHere is the uncomfortable truth about trust: the more of it you have, the less you are watching, which means errors are harder to catch. I call this the trust paradox. The counter is to keep automated monitoring running at every trust level, sample decisions periodically even when things are going well, and have the agent proactively flag edge cases it handled successfully. "I encountered something unusual but resolved it. Here is what I did." That builds more trust than silence ever will.`,
      },
      {
        heading: 'Measuring what you cannot see',
        body: `Trust is a feeling but you can measure the behaviors around it.\n\nAcceptance ratio: how often do people approve the agent's plans without editing them? If that drops below 70%, the agent is not aligned with what people actually want.\n\nOverride frequency: how often do people click "I'll handle this myself"? Above 15% and you have a trust problem.\n\nSetting churn: how often do people change the agent's autonomy settings? If they keep toggling things, they have not found a comfortable level yet.\n\nRecovery speed: after a mistake, how long until the user returns to their previous comfort level? If they never do, that is permanent damage.\n\nThe one I find most telling is what I call "why?" tickets. Support tickets where people are confused about what the agent did or why. If that number is rising, your explainability is failing.\n\nOne rule I keep coming back to: if override frequency exceeds 10%, audit the agent's decision model. Not the user. The user is telling you something.`,
      },
      {
        heading: 'Make the system adapt, not the person',
        body: `Instead of making people manually configure how much they trust the agent, the system should adjust visibility based on what is actually happening.\n\nHigher risk task? Show more. The user is experienced and comfortable? Show less. Strong track record? Less friction. User is in focus mode or in a meeting? Fewer interruptions.\n\nWhen trust is low or the stakes are high, give richer explanations and more approval gates. When trust is high and the risk is low, work quietly and batch the updates.\n\nThe important thing to remember is that people are different. Some want every detail. Some want silence unless something is on fire. The best systems make it easy to express that preference naturally, not through a settings page with 40 toggles.`,
      },
    ],
  },
  {
    id: 'coordination-zones',
    number: '03',
    title: 'Beyond "in the loop"',
    subtitle: 'The human-in-the-loop framing is too simple. Here is what I use instead.',
    date: 'May 2026',
    readTime: '5 min read',
    tags: ['Coordination', 'Framework'],
    lede: 'Every conversation about AI agents eventually hits the same question: "But is there a human in the loop?" It is a yes-or-no question for a problem that is not yes-or-no. I have been using a different framing that maps much closer to how people and agents actually work together.',
    sections: [
      {
        heading: 'Three zones instead of two',
        body: `I think about collaboration in three zones.\n\n"Done with me" is real-time collaboration. The agent and the human are both fully engaged, going back and forth. This is where you want to be for complex decisions, creative work, high-stakes situations, or anytime you are still building trust.\n\n"Done for me" is delegation. The agent handles it, the human kicks it off and reviews the result. This works well for well-defined tasks, research, synthesis, anything repetitive.\n\n"Done under me" is background assistance. The agent is working but the user might not even notice. Low-risk, high-frequency stuff. Personalization. Systems that have earned deep trust.\n\nThe mistake most teams make is treating these as permanent labels. "This feature is a done-for-me feature." That is not how work actually flows.`,
      },
      {
        heading: 'A single task moves between zones',
        body: `Here is a real example from a financial analysis workflow I designed.\n\nOvernight, the agent monitors data feeds. That is "done under me." Nobody is watching.\n\nIn the morning, it compiles an initial analysis. "Done for me." The analyst will review it later.\n\nBut the analysis surfaces a surprising trend. Now the analyst and the agent need to interpret it together. "Done with me." Real collaboration.\n\nOnce they agree on the interpretation, the agent formats the final output. Back to "done for me."\n\nOne workflow, four zone transitions. The design challenge is not picking a zone. It is making those transitions feel smooth and natural.`,
      },
      {
        heading: 'The transitions are where things break',
        body: `Zone transitions are the highest-risk moments in any agent experience. This is where context gets lost, where people feel confused, where the agent does something unexpected.\n\nWhen the agent needs to pull a human in (an upward transition), it needs to provide context before asking for a decision. Why does this moment need human judgment? And it needs to make it easy to say "not now, remind me in an hour." People are busy.\n\nWhen the agent takes back control (a downward transition), it needs to confirm the handoff. "Got it. I'll proceed with option B and check back when the draft is ready." Set expectations about what happens next and when. And always give the person an easy way to jump back in if they change their mind.\n\nI have found that most "the agent did something weird" complaints trace back to a poorly designed transition, not a bad agent decision.`,
      },
    ],
  },
  {
    id: 'approval-flows',
    number: '04',
    title: 'The proposal card',
    subtitle: 'A small UI pattern that carries a lot of weight',
    date: 'May 2026',
    readTime: '6 min read',
    tags: ['Patterns', 'Approval'],
    lede: 'Agent proposes, human reviews, human decides, agent learns. That loop is the foundation of every agent experience I have designed. And the proposal card is where it all comes together in the interface.',
    sections: [
      {
        heading: 'Everything you need to decide, nothing you do not',
        body: `A proposal card needs to be self-contained. The person looking at it should have enough context to make a decision without going anywhere else.\n\nThat means: what the agent wants to do, in plain language. Why it thinks this is the right call. What could go wrong. What other options it considered. How urgent it is. And then the actions: approve, adjust, reject, defer, or delegate to someone else.\n\nBut here is the thing. Not every decision deserves the same amount of ceremony. Low-risk routine stuff gets a streamlined card. Standard decisions get the full layout. And for big decisions with real consequences, you pull in the full analysis with data and implications.\n\nGetting this graduation right is important. If you give every decision the same weight, people stop paying attention. If you underplay a big decision, people lose trust.`,
      },
      {
        heading: 'Not all tasks deserve the same leash',
        body: `There is a model from Parasuraman, Sheridan and Wickens that maps levels of automation. I have adapted it into something I use in workshops all the time.\n\nAt one end: "Watch Me." The agent just observes. At the other: "Do It." The agent handles everything end to end. In between you have "Help Me" where it assists when asked, "Advise Me" where it proactively suggests, "Do It I'll Check" where it acts but you review before it is final, and "Do It Tell Me" where it acts and reports after.\n\nThe key insight is that you calibrate this per task type, not globally. Schedule a meeting? Act with confirmation. Send an email on my behalf? Let me review the draft first. File an expense under $50? Just do it and tell me. Reallocate the budget? I want to see your analysis first.\n\nWhen I run these exercises with stakeholders, the disagreements about where to place each task are the most valuable output. Those disagreements reveal risk tolerance, political dynamics, and the places where the organization is not aligned.`,
      },
      {
        heading: 'The agent gets smarter over time',
        body: `Every approval is a signal. When you approve something, the agent learns "more of this." When you reject something and explain why, the agent adjusts. When you modify a proposal, the agent sees exactly how to improve.\n\nOver time, fewer decisions need human review. That is the whole point.\n\nBatch processing makes this practical at scale. "These 15 items match past approvals. Approve all?" Or even better: "For items like this, proceed without asking." The agent creates categories from your behavior and you confirm the rules.\n\nThe result is a system that starts cautious and gradually earns its way to independence. Not because someone flipped a switch, but because it demonstrated that it understands what you want.`,
      },
    ],
  },
  {
    id: 'agentic-sludge',
    number: '05',
    title: 'Agentic sludge',
    subtitle: 'The dark patterns nobody is talking about yet',
    date: 'May 2026',
    readTime: '7 min read',
    tags: ['Ethics', 'Dark Patterns'],
    lede: 'We spent years identifying dark patterns in interfaces. Trick buttons, hidden fees, confusing opt-outs. Now agents are making decisions on behalf of users and a whole new category of manipulation is emerging. I am calling it agentic sludge.',
    sections: [
      {
        heading: 'Six ways agents manipulate without you noticing',
        body: `Traditional dark patterns manipulate what you see. Agentic sludge manipulates what happens.\n\nOpaque Autonomy: the agent does things without explaining what or why. You find out after the fact, or you don't find out at all.\n\nConsent Erosion: the agent gradually expands what it does without re-confirming that you are OK with it. You approved email sorting. Now it is drafting replies. When did you agree to that?\n\nRecovery Friction: it is hard to undo what the agent did. The undo button is buried, or it does not exist, or "undo" only partially reverses the action.\n\nAttention Manipulation: the agent floods you with low-stakes notifications so you stop reading them, then buries the high-stakes alert in the noise.\n\nAutonomy Creep: the system quietly increases the agent's independence without asking. What started as "suggest and wait" becomes "act and inform" with no opt-in.\n\nOpaque Optimization: the agent says it is working for you but it is actually optimizing for the platform's goals. More engagement, more upsells, more data collection.`,
      },
      {
        heading: 'Six tests to run on every agent feature',
        body: `I built a sludge audit. Six questions you run against any feature where an agent acts autonomously.\n\nTransparency: can the user see what happened, why, and what data was used? All three need to be available within one interaction step.\n\nConsent: did the user explicitly authorize this scope of action? Not "they agreed to the terms of service." Explicit, specific authorization.\n\nRecovery: can the user reverse this within a reasonable time? Undo needs to be available, discoverable, and actually functional.\n\nAttention: are notifications proportional to the stakes? The highest-stakes items should get the most prominent treatment.\n\nDrift: has the agent's autonomy changed since setup? Was the user informed? Every scope change should be logged and presented for approval.\n\nAlignment: is the agent optimizing for user goals or platform goals? The objective function should be documented and auditable.\n\nI have yet to run this audit on a product without finding at least two failures.`,
      },
      {
        heading: 'For every problem, a counter',
        body: `Each form of sludge has a design counter-pattern.\n\nFor opaque autonomy: the Intent Preview. Before acting, the agent shows its plan. "Here is what I am about to do. Proceed?"\n\nFor consent erosion: the Autonomy Dial with explicit re-authorization. The scope never expands silently.\n\nFor recovery friction: Action Audit with undo within two clicks. Every action logged, every action reversible.\n\nFor attention manipulation: notification filtering ranked by stakes. Critical things look critical. Routine things batch quietly.\n\nFor autonomy creep: autonomy change notifications. "I've been handling these on my own for two weeks. Want to make that permanent?"\n\nFor opaque optimization: goal alignment transparency. Show users what the agent is optimizing for and let them change it.\n\nHere is my rule: every autonomous action must be able to answer five questions. What was done? Why? What data was used? What alternatives were considered? Can it be undone?\n\nIf the system cannot generate those answers, the action should not be autonomous.`,
      },
    ],
  },
  {
    id: 'multi-agent',
    number: '06',
    title: 'Orchestrating agent teams',
    subtitle: 'When one agent is not enough and you need to design for many',
    date: 'May 2026',
    readTime: '6 min read',
    tags: ['Multi-Agent', 'Architecture'],
    lede: 'Single-agent experiences are hard enough. But the real world is heading toward teams of specialized agents working together. A research agent hands off to an analysis agent which hands off to a reporting agent. And somewhere in that chain, a human needs to understand what is going on.',
    sections: [
      {
        heading: 'Think conductor, not micromanager',
        body: `When multiple agents are collaborating, the human needs to see the big picture. Which agent is handling the current phase? Where did the last handoff happen? What information was passed along? And most importantly, where is work stuck?\n\nI think about it like an orchestra conductor's score. You are looking at the whole composition, not following individual instruments. You step in when something is off, not when everything is working.\n\nThe critical moments are the handoffs. That is where information gets lost, where approaches conflict, where delays pile up. In every multi-agent system I have designed, the handoffs got more design attention than the individual agent interfaces. Making handoffs visible, reviewable, and adjustable turned out to be the single most impactful design decision.`,
      },
      {
        heading: 'How agent teams are structured',
        body: `I have been working with a four-layer model.\n\nFront-line agents do the actual work. They execute tasks, process data, generate outputs.\n\nSupervisory agents coordinate the front-line. They manage handoffs, resolve conflicts between agents, and escalate when needed.\n\nStrategic agents sit above that. They do analysis, planning, and pattern recognition across the whole system.\n\nAnd then humans. Direction-setting and judgment. The things that require context, values, and accountability.\n\nOn the protocol side, MCP (Model Context Protocol) standardizes how agents access tools and data. A2A (Agent-to-Agent Protocol) standardizes how agents discover each other and communicate. Agent Cards describe what each agent can do so others can find it, negotiate with it, and delegate to it.\n\nThis is still early. The protocols are evolving fast. But the design patterns for how humans interact with agent teams are more stable than you might think.`,
      },
      {
        heading: 'The morning briefing',
        body: `Every agent team needs a command center. A single surface that shows the state of everything.\n\nI design these around the "morning briefing" model. Imagine the first 10 minutes of your workday. What do you need to know?\n\nCompleted work, described as outcomes not processes. Pending decisions that need your judgment. Blocked items where agents are stuck and cannot proceed. Performance signals showing trends. And the exception queue, which is honestly the most important element.\n\nThe design principles: summary first, details on demand. Every item has a clear next action, not just information. And comparative context: "this is unusual" versus "this is expected." That comparison is what turns raw data into something actionable.`,
      },
      {
        heading: 'Staying aware without being overwhelmed',
        body: `The goal is peripheral awareness. Like a manager with an open office door. You are not watching every conversation but you notice when something sounds wrong.\n\nI use a simple matrix for interruptions. High urgency and low confidence? Interrupt immediately. High urgency and high confidence? Brief notification. Low urgency and low confidence? Queue it for later. Low urgency and high confidence? Handle it silently.\n\nThe shift from binary notifications to continuous signals is important. Instead of "alert" or "no alert," you have subtle visual indicators for ongoing status. A gentle "busy" or "idle" or "waiting for input." Natural summaries at meaningful intervals instead of real-time feeds.\n\nThere is a real tension here. Too many interruptions and people ignore everything, including the important stuff. Too few and people lose trust because they cannot see what is happening. Getting that balance right is an ongoing calibration, not a one-time decision.`,
      },
    ],
  },
  {
    id: 'workshop-toolkit',
    number: '07',
    title: 'The workshop toolkit',
    subtitle: 'Four exercises I run to get stakeholders aligned on agent design',
    date: 'May 2026',
    readTime: '5 min read',
    tags: ['Workshop', 'Facilitation'],
    lede: 'The hardest part of designing agent experiences is not the design. It is getting the organization aligned on what the agent should and should not do. I developed four workshop exercises for this. The disagreements they surface are the most valuable output.',
    sections: [
      {
        heading: 'The delegation ladder',
        body: `Take a stack of cards, each one describing a task the agent could handle. Place each card on a ladder from "Watch Me" (agent just observes) to "Do It" (agent handles everything).\n\nThe magic is not in the final placement. It is in the arguments. When a product manager puts "send customer emails" at "Do It" and the legal team puts it at "Watch Me," that disagreement is the design requirement. It tells you where the organization's risk tolerance fractures, where the political dynamics live, and where you need the most nuanced controls.\n\nI have run this exercise dozens of times. It consistently surfaces things that months of meetings and documents never would.`,
      },
      {
        heading: 'The trust battery',
        body: `Every agent starts at about 50% charge. Successful interactions charge the battery. Mistakes drain it.\n\nThe exercise is built around three questions: What charges it fast? Is it transparency, speed, or accuracy? What drains it immediately? And at what battery level would you let the agent act without checking?\n\nThe answers vary wildly between roles. Engineers tend to trust quickly if the accuracy is high. Legal teams drain the battery on any edge case. Executives care about speed. Product teams care about user feedback.\n\nThose differences are not problems. They are design inputs. They tell you which signals to surface for which audience. Remote teams can do this with dot voting. In person, I use physical battery visualizations that people can walk up to and adjust.`,
      },
      {
        heading: 'The blast radius map',
        body: `For every agent action, ask one question: "If the agent gets this wrong, what is the worst that happens?"\n\nDraw three rings. Inner ring: low impact, reversible. The agent can do this on its own. Middle ring: costly but reversible. The agent needs confirmation. Outer ring: irreversible or high impact. Human approval mandatory.\n\nThis exercise consistently reveals something interesting. Stakeholders dramatically disagree about what counts as "low impact." The finance team thinks a $500 error is nothing. The customer success team thinks it is a relationship-ending event. Those disagreements are the most valuable design input you will get.\n\nThe blast radius map gives you a principled framework for deciding where to put approval gates. Not based on gut feel or the loudest person in the room, but on actual risk assessment.`,
      },
      {
        heading: 'The information asymmetry grid',
        body: `A simple 2x2: what the agent knows versus what the user knows.\n\nWhen both know the same thing, you are on solid ground. The agent acts confidently because they are aligned.\n\nWhen the agent knows something the user does not, the agent needs to explain proactively. Design for disclosure.\n\nWhen the user knows something the agent does not, you need to design for easy input. How does the user share context naturally?\n\nAnd when neither knows? That is the danger zone. Design for caution and escalation.\n\nMost teams only think about the first quadrant. But the most interesting design challenges live in the other three, especially the one where nobody knows what is going on. That is where you need the most careful guardrails and the clearest escalation paths.`,
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
      style={{ cursor: 'pointer' }}
    >
      <div className="blog-card__inner">
        <div className="blog-card__top">
          <span className="blog-card__number">{article.number}</span>
          <span className="blog-card__meta">{article.date} · {article.readTime}</span>
        </div>
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
      </div>
      <motion.span
        className="blog-card__arrow"
        animate={{ x: hovered ? 4 : 0, opacity: hovered ? 0.8 : 0.2 }}
        transition={{ duration: 0.25, ease }}
      >
        →
      </motion.span>
    </motion.article>
  );
}


/* ── Article detail view ── */
function ArticleView({ article, onBack }) {
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
          {article.date} · {article.readTime}
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
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = el.closest('.overlay') || null;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { root, threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.section
      ref={ref}
      className="blog-article__section"
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease }}
    >
      <h2>{section.heading}</h2>
      {section.body.split('\n\n').map((para, j) => (
        <p key={j}>{para}</p>
      ))}
    </motion.section>
  );
}


/* ── Blog section (list + detail) ── */
export default function BlogSection() {
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    if (!activeArticle) return;
    const handler = (e) => {
      e.preventDefault();
      setActiveArticle(null);
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
            onBack={() => setActiveArticle(null)}
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
              <motion.p
                className="blog-list__label"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
              >
                Writing
              </motion.p>
              <motion.h2
                className="blog-list__title"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08, ease }}
              >
                From UX to AX
              </motion.h2>
              <motion.p
                className="blog-list__desc"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16, ease }}
              >
                A framework for designing agent experiences.<br />
                Eight articles on what changes when AI acts on behalf of people.
              </motion.p>
            </header>

            <div className="blog-list__grid">
              {articles.map((article, i) => (
                <BlogCard
                  key={article.id}
                  article={article}
                  index={i}
                  onClick={() => setActiveArticle(article)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
