import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Starfield from '../components/Starfield';

const ease = [0.22, 1, 0.36, 1];

/* ── Article data ── */
const articles = [
  {
    id: 'core-principles',
    number: '01',
    title: 'Outcomes, Exceptions, Values',
    subtitle: 'Three principles for agent experience design',
    date: 'May 2026',
    readTime: '6 min read',
    tags: ['Agent UX', 'Principles'],
    lede: 'When AI agents act on behalf of people, the design rules change. Three principles govern every interaction: show what was achieved not how, surface only what needs human attention, and let people express preferences in their own words.',
    sections: [
      {
        heading: 'Outcomes over processes',
        body: `Show what was achieved, not the steps taken.\n\nInformation hierarchy by priority:\n\n1. Outcome: what was achieved (always visible)\n2. Impact: what this means for the user (always visible)\n3. Decisions remaining: what needs human input (always visible)\n4. Summary of approach: how the agent did it (on demand)\n5. Detailed process log: every step (audit only)\n\nThe anti-pattern is "Agent processed record 4,532 of 12,000. Step 3 of 7: Validating compliance." Better: "Portfolio rebalancing complete. Estimated annual savings: $45K. 3 positions need your review."\n\nProcess details create cognitive overhead. Only show them when trust is forming, outcomes are wrong, or audits are required.`,
      },
      {
        heading: 'Exceptions over routine',
        body: `Human attention is the scarcest resource. Only surface what genuinely requires human involvement.\n\nSix exception categories that require human attention:\n\n• Judgment needed: ambiguous data, unclear best path\n• Authority exceeded: action exceeds approved scope\n• Ethical dimension: values and moral considerations at stake\n• Novel situation: unprecedented, never encountered\n• Confidence gap: multiple equally probable outcomes\n• Conflict: competing objectives\n\nHandle the "quiet confidence problem." Silence must feel reassuring:\n\n• Periodic summaries: "47 items processed normally today"\n• Anomaly absence confirmation: "No unusual patterns detected"\n• Performance trends: "Accuracy remains at 99.2%"\n\nThe anti-pattern is "The Everything Dashboard," showing every action. The courage is in what you choose not to show.`,
      },
      {
        heading: 'Values over settings',
        body: `Humans express what they care about in natural language, not technical thresholds.\n\nWrong: response_time_sla: 3600\nRight: "Respond to client emails within a business day"\n\nWrong: risk_score_threshold: 0.65\nRight: "Be conservative. When you're unsure, ask me"\n\nThree value layers:\n\n1. Non-negotiable: org-set, cannot be overridden ("Never share customer financial data externally")\n2. Recommended: leadership-set, adjustable with justification\n3. Personal: user-set ("I like concise summaries")\n\nWhen values conflict, surface the tension: "You've prioritized both speed and accuracy. In this situation, those are in tension. What matters more here?"`,
      },
    ],
  },
  {
    id: 'trust-building',
    number: '02',
    title: 'The trust journey',
    subtitle: 'How humans learn to rely on AI agents',
    date: 'May 2026',
    readTime: '7 min read',
    tags: ['Trust', 'Agent UX'],
    lede: 'Trust is not a toggle. It is a journey with four stages, each with different design requirements. The hardest part is not building trust but repairing it when it breaks.',
    sections: [
      {
        heading: 'Four stages of trust',
        body: `Supervised, Guided, Collaborative, Trusted.\n\nSupervised: agent asks permission before acting. Every decision presented with full reasoning. Highest overhead.\n\nGuided: routine decisions handled independently. Major decisions still need approval. Agent building credibility.\n\nCollaborative: established working rhythm. Agent knows when to act and when to ask. Human focuses on exceptions.\n\nTrusted: agent operates independently. Human receives outcome summaries only. Intervention by exception.\n\nTransitions must be gradual (smooth expansion, not sudden switches), evidence-based (triggered by track record, not time elapsed), reversible (trust decreases if errors occur), and transparent (humans understand where they are and why).`,
      },
      {
        heading: 'When trust breaks',
        body: `Five steps to repair:\n\n1. Immediate transparency: full disclosure of what went wrong\n2. Impact assessment: consequences and remediation\n3. Root cause: one-time error or systemic issue?\n4. Adjustment: changes to prevent recurrence\n5. Autonomy recalibration: temporarily reduced independence\n\nThe trust paradox: more trust equals less oversight equals errors harder to catch. Counter with automated monitoring at all trust levels, periodic audits sampling agent decisions, proactive reporting on edge cases (even successfully handled ones), and external validation via cross-checking systems.`,
      },
      {
        heading: 'Measuring trust',
        body: `Six metrics that matter:\n\n• Acceptance ratio: plans accepted without edit / total shown. Below 70% signals agent misalignment.\n• Override frequency: "handle it myself" clicks / total shown. Above 15% signals trust breakdown.\n• Setting churn: autonomy setting changes per active user per month. High churn signals trust volatility.\n• Trust density: percentage breakdown of users per autonomy level. Clustering at lowest signals adoption failure.\n• Recovery speed: time from trust-break to pre-event autonomy level. Never recovering signals permanent damage.\n• "Why?" tickets: support tickets about unclear agent behavior per 1K users. Rising trend signals explainability gap.\n\nIf override frequency exceeds 10%, audit the agent's decision model, not the user.`,
      },
      {
        heading: 'Responsive salience',
        body: `Instead of manual trust settings, the system auto-adjusts visibility based on signals:\n\n• Task complexity and risk: higher means more visible\n• User expertise and comfort: higher means less visible\n• Historical trust signals: stronger track record means less friction\n• User state (focus mode, meeting, etc.): busy means fewer interruptions\n\nWhen trust is low or risk is high: richer explanations, more approval gates, step-by-step visibility. When trust is high and risk is low: work quietly, report results, batch updates.\n\nPreferences diverge between individuals. Some want detail, some want silence. Make this easy to express and adjust.`,
      },
    ],
  },
  {
    id: 'coordination-zones',
    number: '03',
    title: 'Beyond "in the loop"',
    subtitle: 'Three coordination zones that replace binary thinking',
    date: 'May 2026',
    readTime: '5 min read',
    tags: ['Coordination', 'Framework'],
    lede: 'The binary of "human in the loop" versus "fully autonomous" is a false choice. Three coordination zones, shifting dynamically through a workflow, better describe how humans and agents actually collaborate.',
    sections: [
      {
        heading: 'Done with me, done for me, done under me',
        body: `Three zones replace the binary:\n\nDone with me: high AI salience, high human involvement. Mutual collaboration, frequent back-and-forth. Use for complex decisions, creative work, high stakes, early trust-building.\n\nDone for me: high AI salience, low human involvement. Agent handles it, user initiates and reviews. Use for well-defined tasks, research and synthesis, repetitive workflows.\n\nDone under me: low AI salience, low human involvement. Background assistance, user may not notice AI. Use for low-risk/high-frequency tasks, personalization, mature trusted systems.`,
      },
      {
        heading: 'Zones are not fixed',
        body: `A single workflow moves between zones.\n\nExample:\n1. Done under me: agent monitors data feeds overnight\n2. Done for me: agent compiles initial analysis\n3. Done with me: analyst and agent interpret surprising trend together\n4. Done for me: agent formats final output\n\nThe design challenge is not picking a zone but designing smooth transitions between them.`,
      },
      {
        heading: 'Designing transitions',
        body: `Transitions between zones are the highest-risk UX moments.\n\nUpward transitions (agent requests human involvement):\n• Provide context before asking for a decision\n• Explain why this moment requires human judgment\n• Make it easy to defer ("not now, remind me in an hour")\n\nDownward transitions (agent resumes independent work):\n• Confirm the handoff ("Got it. I'll proceed with option B and check back when the draft is ready.")\n• Set expectations about what happens next and when\n• Provide easy way to re-engage`,
      },
    ],
  },
  {
    id: 'approval-flows',
    number: '04',
    title: 'The proposal card',
    subtitle: 'Designing agent approval flows',
    date: 'May 2026',
    readTime: '6 min read',
    tags: ['Patterns', 'Approval'],
    lede: 'The core UX primitive for agent experiences: agent proposes, human reviews, human approves or adjusts or rejects, agent learns. The proposal card is where this happens.',
    sections: [
      {
        heading: 'Anatomy of a proposal card',
        body: `A self-contained summary with enough context to decide:\n\n• What: proposed action in plain language\n• Why: agent's reasoning\n• Risk: what could go wrong\n• Alternatives: other options considered\n• Urgency: time-sensitivity\n• Actions: Approve / Adjust / Reject / Defer / Delegate\n\nGraduated detail levels:\n• Quick approvals: low-risk, streamlined card\n• Standard approvals: full proposal card\n• Deep reviews: full analysis with data and implications`,
      },
      {
        heading: 'The delegation ladder',
        body: `Based on Parasuraman, Sheridan and Wickens' Levels of Automation model (2000).\n\n• Watch Me: agent observes the human working. Human is performer.\n• Help Me: agent assists when asked. Human is director.\n• Advise Me: agent proactively suggests. Human is decision-maker.\n• Do It, I'll Check: agent acts, human reviews before final. Human is reviewer.\n• Do It, Tell Me: agent acts and reports after. Human is monitor.\n• Do It: agent handles end to end. Human is escalation point.\n\nCalibrate per task type, not globally. Schedule meetings might be "act with confirmation." Sending emails might be "plan and propose." Budget reallocation might be "observe and suggest."`,
      },
      {
        heading: 'Learning from approvals',
        body: `The learning loop: approvals reinforce approach. Rejections with explanation adjust behavior. Adjustments show agent how to improve. Over time, fewer decisions need human review.\n\nBatch processing patterns:\n• Batch approval: "These 15 items match past approvals: approve all?"\n• Category rules: "For items like this, proceed without asking"\n• Smart grouping: similar decisions clustered for efficient review`,
      },
    ],
  },
  {
    id: 'agentic-sludge',
    number: '05',
    title: 'Agentic sludge',
    subtitle: 'Dark patterns in autonomous systems',
    date: 'May 2026',
    readTime: '7 min read',
    tags: ['Ethics', 'Dark Patterns'],
    lede: 'Agentic sludge is friction, ambiguity, or manipulation by autonomous agents that makes it harder for users to understand, influence, or override automated decisions. Traditional dark patterns manipulate interfaces. Agentic sludge manipulates outcomes.',
    sections: [
      {
        heading: 'The six forms',
        body: `1. Opaque Autonomy: agent acts without clear explanation of what or why.\n\n2. Consent Erosion: agent gradually expands scope without re-confirming boundaries.\n\n3. Recovery Friction: making it hard to undo, reverse, or escalate agent actions.\n\n4. Attention Manipulation: over-notifying on low stakes, under-reporting high stakes.\n\n5. Autonomy Creep: system silently increases agent independence without opt-in.\n\n6. Opaque Optimization: agent optimizes for platform goals, not user goals.`,
      },
      {
        heading: 'The sludge audit',
        body: `Six tests to run against every feature with autonomous agent behavior:\n\n• Transparency: Can the user see what happened, why, and what data was used? All three available within one interaction step.\n• Consent: Did the user explicitly authorize this scope of action? Every autonomous action traces to explicit approval.\n• Recovery: Can the user reverse this within a reasonable time? Undo available, discoverable, functional.\n• Attention: Are notifications proportional to stakes? Highest-stakes items get most prominent treatment.\n• Drift: Has autonomy changed since setup? Was the user informed? Every scope change logged and presented for approval.\n• Alignment: Is the agent optimizing for user goals or platform goals? Objective function documented, auditable, user-aligned.`,
      },
      {
        heading: 'Counter-patterns',
        body: `For every form of sludge, a counter-pattern:\n\n• Opaque Autonomy → Intent Preview (show plan before acting)\n• Consent Erosion → Autonomy Dial with explicit re-auth\n• Recovery Friction → Action Audit + Undo within 2 clicks\n• Attention Manipulation → Notification filtering ranked by stakes\n• Autonomy Creep → Autonomy change notifications\n• Opaque Optimization → Goal alignment transparency\n\nEvery autonomous action must answer: What action was taken? Why? What data was used? What alternatives were considered? Can this be undone, and how?\n\nIf the system cannot generate this explanation, the action should not be autonomous.`,
      },
    ],
  },
  {
    id: 'multi-agent',
    number: '06',
    title: 'Orchestrating agent teams',
    subtitle: 'Multi-agent choreography and the command center',
    date: 'May 2026',
    readTime: '6 min read',
    tags: ['Multi-Agent', 'Architecture'],
    lede: 'When multiple specialized agents collaborate, the human needs to see the choreography: handoffs, bottlenecks, conflicts. Think orchestra conductor, not micromanager.',
    sections: [
      {
        heading: 'The choreography view',
        body: `Show: which agent handles the current phase, where the last handoff happened, what information was passed, where work is stuck.\n\nThink orchestra conductor's score: the whole composition, not individual parts.\n\nHandoffs are the most critical moments: where information is lost, approaches conflict, delays accumulate. Make them reviewable, auditable, adjustable.\n\nWhen agents have competing priorities, surface what each agent optimizes for, where objectives conflict, and the trade-offs and resolution options.`,
      },
      {
        heading: 'Agent team composition',
        body: `Four layers:\n\n• Front-line agents: direct execution\n• Supervisory agents: coordinating front-line work\n• Strategic agents: analysis and planning\n• Humans: direction-setting and judgment\n\nProtocol layer:\n• MCP (Model Context Protocol): standardizes how agents access tools and data\n• A2A (Agent-to-Agent Protocol): standardizes how agents discover and communicate with each other\n• Agent Cards describe capabilities; other agents can discover, negotiate, and delegate`,
      },
      {
        heading: 'The command center',
        body: `The daily starting point. A single surface showing the state of your agent team.\n\nStructure:\n• Completed work (outcomes, not processes)\n• Pending decisions (items needing judgment)\n• Blocked items (where agents are stuck)\n• Performance signals (trends and metrics)\n• Exception queue (the most critical element)\n\nDesign for the morning briefing model: the first 10 minutes of the workday. Progressive disclosure: summary first, details on demand. Every item has a clear next action. Comparative context: "this is unusual" vs "this is expected."`,
      },
      {
        heading: 'Ambient awareness',
        body: `Maintain peripheral awareness of agent activity, like a manager with an open office door.\n\nIntelligent interruption matrix:\n• High urgency + low confidence: interrupt immediately\n• High urgency + high confidence: brief notification\n• Low urgency + low confidence: queue for review\n• Low urgency + high confidence: handle silently\n\nUse continuous signals instead of binary notifications. Subtle visual indicators for ongoing status. Natural summaries at meaningful intervals. Too many interruptions and users ignore everything. Too few and users lose trust.`,
      },
    ],
  },
  {
    id: 'workshop-toolkit',
    number: '07',
    title: 'The workshop toolkit',
    subtitle: 'Facilitating agent design decisions with stakeholders',
    date: 'May 2026',
    readTime: '5 min read',
    tags: ['Workshop', 'Facilitation'],
    lede: 'Four workshop frameworks for surfacing design requirements for agent experiences. The disagreements between stakeholders are the design input.',
    sections: [
      {
        heading: 'The delegation ladder',
        body: `Place every task on a spectrum from "Watch Me" to "Do It." The disagreements between stakeholders are the design input.\n\nSix levels: Watch Me (agent observes), Help Me (agent assists when asked), Advise Me (agent proactively suggests), Do It I'll Check (agent acts, human reviews), Do It Tell Me (agent acts and reports), Do It (agent handles end to end).\n\nIn-person: sort task cards onto ladder. Where people disagree reveals risk tolerance differences and political dynamics.`,
      },
      {
        heading: 'The trust battery',
        body: `Every agent starts at about 50%. Successful interactions charge it. Mistakes drain it.\n\nThree questions to ask:\n• What charges it fast? (Transparency? Speed? Accuracy?)\n• What drains it immediately?\n• At what level would you let the agent act without checking?\n\nDot voting works well for remote teams. In-person, use physical "battery" visualizations.`,
      },
      {
        heading: 'The blast radius map',
        body: `For every agent action: "If the agent gets this wrong, what's the worst that happens?"\n\n• Inner ring (low impact, reversible): autonomous\n• Middle ring (costly but reversible): confirmation required\n• Outer ring (irreversible/high impact): human approval mandatory\n\nThis exercise often reveals that stakeholders dramatically disagree about what's "low impact." Those disagreements are the most valuable design input.`,
      },
      {
        heading: 'The information asymmetry grid',
        body: `A 2x2 grid: what the agent knows vs. what the user knows.\n\n• Agent knows, user knows: shared ground. Agent acts confidently.\n• Agent knows, user doesn't: agent must explain. Design for proactive disclosure.\n• Agent doesn't know, user knows: user must inform agent. Design for easy input.\n• Neither knows: danger zone. Design for caution and escalation.\n\nThis grid surfaces the real communication design challenges. Most teams only think about the "shared ground" quadrant.`,
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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.08, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="blog-card__number">{article.number}</div>
      <div className="blog-card__content">
        <div className="blog-card__meta">
          <span>{article.date}</span>
          <span className="blog-card__dot">·</span>
          <span>{article.readTime}</span>
        </div>
        <h3 className="blog-card__title">
          <motion.span
            animate={{ x: hovered ? 8 : 0 }}
            transition={{ duration: 0.3, ease }}
          >
            {article.title}
          </motion.span>
        </h3>
        <p className="blog-card__subtitle">{article.subtitle}</p>
        <div className="blog-card__tags">
          {article.tags.map((tag) => (
            <span key={tag} className="blog-card__tag">{tag}</span>
          ))}
        </div>
      </div>
      <motion.div
        className="blog-card__arrow"
        animate={{ x: hovered ? 6 : 0, opacity: hovered ? 1 : 0.3 }}
        transition={{ duration: 0.3, ease }}
      >
        →
      </motion.div>
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
      transition={{ duration: 0.4, ease }}
    >
      <div className="blog-article__header">
        <button className="blog-article__back" onClick={onBack}>
          ← Back to articles
        </button>
        <div className="blog-article__meta">
          <span>{article.date}</span>
          <span className="blog-card__dot">·</span>
          <span>{article.readTime}</span>
        </div>
        <motion.h1
          className="blog-article__title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          {article.title}
        </motion.h1>
        <motion.p
          className="blog-article__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          {article.subtitle}
        </motion.p>
        <div className="blog-article__tags">
          {article.tags.map((tag) => (
            <span key={tag} className="blog-card__tag">{tag}</span>
          ))}
        </div>
      </div>

      <motion.div
        className="blog-article__lede"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      >
        <p>{article.lede}</p>
      </motion.div>

      <div className="blog-article__body">
        {article.sections.map((section, i) => (
          <ArticleSection key={i} section={section} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

function ArticleSection({ section, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = el.closest('.overlay') || null;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { root, threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.section
      ref={ref}
      className="blog-article__section"
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: 0.1, ease }}
    >
      <h2 className="blog-article__section-heading">{section.heading}</h2>
      <div className="blog-article__section-body">
        {section.body.split('\n\n').map((para, j) => (
          <p key={j}>{para}</p>
        ))}
      </div>
    </motion.section>
  );
}


/* ── Blog section (list + detail) ── */
export default function BlogSection() {
  const [activeArticle, setActiveArticle] = useState(null);

  // Intercept the overlay-back event to go from article → list
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
    <div className="blog-section" style={{ background: '#00330f' }}>
      <Starfield count={20} />

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
            <div className="blog-list__header">
              <motion.p
                className="blog-list__label"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
              >
                Writing
              </motion.p>
              <motion.h2
                className="blog-list__title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease }}
              >
                From UX to AX
              </motion.h2>
              <motion.p
                className="blog-list__desc"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
              >
                A design framework for agent-managed experiences.
                How to design systems where AI acts on behalf of people.
              </motion.p>
            </div>

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
