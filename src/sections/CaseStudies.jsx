import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const ease = [0.22, 1, 0.36, 1];

const projects = [
  {
    id: 'icc-cpo',
    client: 'International Commercial Court',
    title: 'CPO Case Assistant',
    color: '#0f2e2a',
    image: '/assets/projects/difc-case-detail.png',
    tags: ['AI Experience', 'Legal Tech'],
    sections: [
      {
        heading: 'Problem',
        body: 'Case Progression Officers at an international commercial court managed active cases across spreadsheets, disconnected systems, and manual tracking. Finding case history, checking deadlines, and responding to party enquiries consumed hours daily. Officers had no unified view of their caseload or workload.',
      },
      {
        heading: 'Definition',
        body: 'We mapped the CPO daily workflow: morning triage of new filings and deadlines, midday case research and status checks, afternoon party communications. Each step involved switching between multiple disconnected tools with no single source of truth.',
      },
      {
        heading: 'Output',
        body: 'A triage dashboard with KPI cards, case type breakdowns, and fee tracking charts. A filterable case list with status badges, deadline alerts, and AI "Explore Mode" for natural-language case queries. Context-aware AI copilot on every screen providing page-specific prompt packs: workload triage on the dashboard, case-specific queries in list views, and timeline analysis in detail views.',
      },
    ],
    images: [
      { src: '/assets/projects/difc-case-detail.png', caption: 'Case detail with claim data and sidebar' },
      { src: '/assets/projects/difc-ai-summary.png', caption: 'AI-generated case summary and next steps' },
      { src: '/assets/projects/difc-courtx-ai.png', caption: 'AI assistant with suggested queries' },
      { src: '/assets/projects/difc-cases-list.png', caption: 'Case list with status filters and deadlines' },
      { src: '/assets/projects/difc-dashboard.png', caption: 'Dashboard with KPIs and analytics' },
    ],
  },
  {
    id: 'icc-drafting',
    client: 'International Commercial Court',
    title: 'Judicial Drafting',
    color: '#142f2b',
    image: '/assets/projects/difc-editor-resume.png',
    tags: ['AI Drafting', 'Judicial'],
    sections: [
      {
        heading: 'Problem',
        body: 'Drafting court judgments and orders required judges and their assistants to spend weeks manually gathering evidence, assembling legal references from multiple sources, and structuring complex reasoning into formal documents. The process was slow, repetitive, and left little room to focus on the quality of judicial decisions.',
      },
      {
        heading: 'Definition',
        body: 'We identified the core bottleneck: information assembly. Judges and their teams needed to pull from case filings, precedents, external legal references, and internal documentation, then synthesize it all into a structured draft. The drafting itself followed repeatable patterns, but the research and compilation did not.',
      },
      {
        heading: 'Output',
        body: 'A guided drafting workflow where AI gathers information from multiple sources (case filings, uploaded documents, external references) and generates a first draft with proper legal formatting and citations. Judges review the draft using built-in AI tools: improve text clarity, verify citations against source material to guard against hallucination, proofread, and refine judicial reasoning. The human remains at the center. AI accelerates the assembly, the judge owns the decision.',
      },
    ],
    images: [
      { src: '/assets/projects/difc-workflow-step3.png', caption: 'External sources: uploads, links, shared references' },
      { src: '/assets/projects/difc-workflow-step4.png', caption: 'Judicial reasoning guidance with structured prompts' },
      { src: '/assets/projects/difc-editor-resume.png', caption: 'Document editor with court formatting' },
      { src: '/assets/projects/difc-editor-content.png', caption: 'AI-drafted court order with legal citations' },
      { src: '/assets/projects/difc-editor-assist.png', caption: 'AI Assist panel: verify citations, proofread' },
      { src: '/assets/projects/difc-editor-review.png', caption: 'Collaborative review with judicial comments' },
    ],
  },
  {
    id: 'gcha-dashboards',
    client: 'Gulf Cultural Heritage Authority',
    title: 'Operational Excellence Suite',
    color: '#0e1614',
    image: '/assets/projects/aha-executive.png',
    tags: ['Enterprise AI', 'Government'],
    sections: [
      {
        heading: 'Problem',
        body: 'Six operational departments (Finance, HR, Legal, Procurement, Strategy, Events) ran on disconnected tools with no shared intelligence layer. Manual archiving, limited searchability across Arabic and English, and siloed reporting made cross-departmental decisions slow.',
      },
      {
        heading: 'Discovery',
        body: 'Each department had unique domain complexity: Finance needed compliance automation, HR required cultural-knowledge screening for heritage roles, Legal dealt with high-volume contract review, Procurement lacked demand forecasting, Strategy had no cross-department KPI visibility.',
      },
      {
        heading: 'Solution',
        body: 'A unified AI ecosystem with a portal hub connecting six domain modules. Finance: budget prediction and anomaly detection. HR: CV screening with cultural-fit assessment. Legal: contract risk highlighting and clause revision. Procurement: demand forecasting and AI-assisted RFP generation. Strategy: KPI tracking and executive reporting. Events: festival planning with live monitoring.',
      },
      {
        heading: 'AI impact',
        body: 'Each department moved from reactive to predictive. Finance detects fraud automatically. HR screens niche heritage roles (dialect knowledge, traditional poetry, historical expertise) at scale. Legal reviews contracts in minutes. A unified search layer lets executives query across all six domains in natural language.',
      },
    ],
    images: [
      { src: '/assets/projects/aha-executive.png', caption: 'Executive overview dashboard' },
      { src: '/assets/projects/aha-finance.png', caption: 'Finance and fraud detection' },
      { src: '/assets/projects/aha-legal.png', caption: 'Legal contract review' },
      { src: '/assets/projects/aha-hr.png', caption: 'HR talent screening' },
      { src: '/assets/projects/aha-strategy.png', caption: 'Strategy and planning' },
      { src: '/assets/projects/aha-events.png', caption: 'Events management' },
    ],
  },
  {
    id: 'gcha-heritage',
    client: 'Gulf Cultural Heritage Authority',
    title: 'Cultural Guardians',
    color: '#101412',
    image: '/assets/projects/aha-sanaa.png',
    tags: ['Immersive Design', 'Cultural Heritage'],
    sections: [
      {
        heading: 'Problem',
        body: 'Regional cultural heritage (Bedouin traditions, pearl diving, falconry, trade routes) was being lost to younger generations. Traditional education formats felt passive. The authority needed immersive experiences for audiences who grew up on interactive media.',
      },
      {
        heading: 'Discovery',
        body: 'People connect with cultural identity through personal stories, moral choices, and emotional resonance, not facts and dates. The strongest learning happens when people face dilemmas in context and reflect on consequences.',
      },
      {
        heading: 'Solution',
        body: 'An immersive simulation on public kiosks and web. Users create an avatar and enter a hub connecting cultural realms. Time-travel experiences drop users into historical moments with branching dilemma scenarios. A journey map tracks progress across all realms. An AI guide avatar adapts narration to user choices.',
      },
      {
        heading: 'AI impact',
        body: 'The AI guide provides contextual cultural knowledge and adapts to user choices. Speech recognition enables spoken interactions in Arabic. AI generates personalized reflection summaries connecting historical decisions to modern values. Engagement tracking identifies which cultural topics resonate most.',
      },
    ],
    images: [
      { src: '/assets/projects/aha-sanaa.png', caption: 'Sanaa, the AI cultural guide' },
    ],
  },
  {
    id: 'terminal42',
    client: 'Design Experiment',
    title: 'Terminal 42',
    color: '#1a1d23',
    image: '/assets/projects/terminal42-splash.png',
    tags: ['Design Experiment', 'AI Workspace', 'Developer Tools'],
    sections: [
      {
        heading: 'The experiment',
        body: 'Terminal 42 is a design thought experiment exploring what happens when you rethink the developer workspace from scratch. Instead of adding AI to an existing IDE, the question was: what would a workspace look like if AI collaboration was the starting point, not an afterthought? The result is a fully designed and built Electron application that treats the terminal, design tools, and persistent memory as equal first-class surfaces.',
      },
      {
        heading: 'Terminal workspace',
        body: 'A full terminal environment built with xterm.js, with an integrated AI copilot panel. The copilot sits alongside the command line, not in a separate window. Conversations persist across sessions. The interface is designed so the AI feels like a collaborator sitting next to you, not a chatbot in another tab.',
      },
      {
        heading: 'Design studio',
        body: 'A built-in design canvas where you go from a text prompt to a live visual preview. Components render in real time as the AI generates them. From there you can refine, iterate, and export directly to Figma without leaving the app. The idea: code and design should live in the same space, not require context-switching between tools.',
      },
      {
        heading: 'Brain and memory',
        body: 'A persistent memory system that learns your preferences, coding patterns, project rules, and context over time. Instead of re-explaining your stack or style every session, the brain carries that forward. It surfaces relevant context automatically so the AI can make better suggestions from the start.',
      },
      {
        heading: 'Activity and sessions',
        body: 'A dashboard tracking session history, token usage, and activity patterns. It gives visibility into how you work with AI over time, what tasks you delegate most, and where the collaboration is most effective. Designed to make the human-AI working relationship transparent and reflective.',
      },
    ],
    images: [
      { src: '/assets/projects/terminal42-workspace.png', caption: 'Terminal workspace with AI copilot' },
      { src: '/assets/projects/terminal42-design.png', caption: 'Design studio with live canvas preview' },
      { src: '/assets/projects/terminal42-brain.png', caption: 'Brain memory system for persistent context' },
      { src: '/assets/projects/terminal42-activity.png', caption: 'AI design review with live site preview' },
      { src: '/assets/projects/terminal42-sessions.png', caption: 'Design studio project type picker' },
    ],
  },
  {
    id: 'starkit',
    client: 'Experiment',
    title: 'Starkit',
    color: '#1e293b',
    image: '/assets/projects/starkit-dashboard.png',
    tags: ['Design Systems', 'Rapid Prototyping'],
    sections: [
      {
        heading: 'Problem',
        body: 'Pre-sales engagements needed working prototypes in days, not weeks. Designers rebuilt the same dashboard patterns (KPI cards, charts, data tables) from scratch every time. AI could generate code fast, but without structured briefs the output was inconsistent.',
      },
      {
        heading: 'Solution',
        body: 'Two rebrandable Next.js starters: an admin dashboard with KPI cards, analytics charts, user management, and settings; and a consumer app with wallet, transactions, onboarding, and authentication flows. Includes a structured project brief template that feeds directly into AI-assisted code generation.',
      },
      {
        heading: 'AI impact',
        body: 'The project brief format is designed as direct AI input: personas, features, and acceptance criteria feed into code generation prompts. Structured templates mean AI produces consistent output with clear guardrails. Teams go from client brief to deployed prototype in under a week.',
      },
    ],
    images: [
      { src: '/assets/projects/starkit-01-dashboard.png', caption: 'KPI dashboard with revenue charts and activity feed' },
      { src: '/assets/projects/starkit-02-analytics.png', caption: 'Analytics: traffic trends, top pages, device breakdown' },
      { src: '/assets/projects/starkit-03-users.png', caption: 'User management with roles, status, and search' },
      { src: '/assets/projects/starkit-04-settings.png', caption: 'Rebrandable settings: logo, colors, company info' },
    ],
  },
];

function getFanTransform(offset) {
  const abs = Math.abs(offset);
  const sign = offset > 0 ? 1 : offset < 0 ? -1 : 0;
  if (abs === 0) return { x: 0, rotate: 0, scale: 1, zIndex: 10, opacity: 1 };
  if (abs === 1) return { x: sign * 180, rotate: sign * 5, scale: 0.92, zIndex: 5, opacity: 0.95 };
  if (abs === 2) return { x: sign * 320, rotate: sign * 10, scale: 0.84, zIndex: 2, opacity: 0.8 };
  return { x: sign * 420, rotate: sign * 14, scale: 0.78, zIndex: 1, opacity: 0.6 };
}

function ExpandedCard({ project, cardRect, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Animate from card position to fullscreen
  const startX = cardRect ? cardRect.x + cardRect.width / 2 - window.innerWidth / 2 : 0;
  const startY = cardRect ? cardRect.y + cardRect.height / 2 - window.innerHeight / 2 : 0;
  const startScaleX = cardRect ? cardRect.width / window.innerWidth : 0.3;
  const startScaleY = cardRect ? cardRect.height / window.innerHeight : 0.4;

  const [activeImg, setActiveImg] = useState(0);
  const hasImages = project.images && project.images.length > 0;

  return (
    <motion.div
      className="case-expanded"
      style={{ background: project.color }}
      initial={{
        x: startX,
        y: startY,
        scaleX: startScaleX,
        scaleY: startScaleY,
        borderRadius: '20px',
      }}
      animate={{
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        borderRadius: '0px',
      }}
      exit={{
        x: startX,
        y: startY,
        scaleX: startScaleX,
        scaleY: startScaleY,
        borderRadius: '20px',
      }}
      transition={{ duration: 0.55, ease }}
      onClick={onClose}
    >
      <motion.div
        className="case-expanded__inner"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: 0.25, ease }}
        onClick={(e) => e.stopPropagation()}
        style={hasImages ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1200px', alignItems: 'start' } : { maxWidth: '720px' }}
      >
        <div>
          <div className="case-expanded__tags">
            {project.tags.map(t => <span key={t} className="case-expanded__tag">{t}</span>)}
          </div>
          <span className="case-expanded__client">{project.client}</span>
          <h2 className="case-expanded__title">{project.title}</h2>
          {project.sections ? (
            <div className="case-expanded__sections">
              {project.sections.map((s, i) => (
                <div key={i} className="case-expanded__section">
                  <h4 className="case-expanded__section-heading">{s.heading}</h4>
                  <p className="case-expanded__body">{s.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="case-expanded__body">{project.full}</p>
          )}
        </div>
        {hasImages && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'sticky', top: '48px' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.3)',
              aspectRatio: '16/10',
            }}>
              <img
                src={project.images[activeImg]?.src || project.images[activeImg]}
                alt={`${project.title} screenshot`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {project.images[activeImg]?.caption && (
              <p style={{
                fontSize: '13px', color: 'rgba(255,255,255,0.5)',
                fontFamily: "'IBM Plex Mono', monospace",
                textAlign: 'center', margin: 0,
              }}>
                {project.images[activeImg].caption}
              </p>
            )}
            {project.images.length > 1 && (
              <div style={{
                display: 'flex', gap: '8px', overflowX: 'auto',
                paddingBottom: '4px',
              }}>
                {project.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      flex: '0 0 64px', height: '40px', borderRadius: '6px',
                      overflow: 'hidden', border: i === activeImg ? '2px solid #fff' : '2px solid transparent',
                      opacity: i === activeImg ? 1 : 0.5,
                      cursor: 'pointer', padding: 0, background: 'rgba(0,0,0,0.3)',
                      transition: 'opacity 0.2s, border-color 0.2s',
                    }}
                  >
                    <img src={img?.src || img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function CaseStudiesSection() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [cardRect, setCardRect] = useState(null);
  const frontCardRef = useRef(null);
  const timerRef = useRef(null);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  // Intercept overlay back/close — close expanded card first
  useEffect(() => {
    const handler = (e) => {
      if (expandedRef.current !== null) {
        e.preventDefault();
        setExpanded(null);
      }
    };
    window.addEventListener('overlay-back', handler);
    return () => window.removeEventListener('overlay-back', handler);
  }, []);

  const go = useCallback((dir) => {
    setActive(i => {
      const next = i + dir;
      if (next < 0) return projects.length - 1;
      if (next >= projects.length) return 0;
      return next;
    });
  }, []);

  useEffect(() => {
    if (expanded !== null) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => go(1), 5000);
    return () => clearInterval(timerRef.current);
  }, [go, expanded]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go(1), 5000);
  };

  const handleCardClick = (i, e) => {
    if (i === active) {
      const el = e.currentTarget;
      setCardRect(el.getBoundingClientRect());
      setExpanded(i);
    } else {
      setActive(i);
      resetTimer();
    }
  };

  return (
    <section className="section section--dark" data-section="5">
      <Starfield count={22} />
      <div className="section-inner">
        <ScrollReveal>
          <h2 className="cases-heading">Selected work</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="fan-carousel">
            {projects.map((p, i) => {
              let offset = i - active;
              if (offset > 4) offset -= projects.length;
              if (offset < -4) offset += projects.length;
              const t = getFanTransform(offset);
              const isFront = i === active;

              const isLight = p.color === '#e8e0d4';
              const textColor = isLight ? '#1a1a1a' : '#fff';

              return (
                <motion.div
                  key={p.id}
                  className={'fan-card' + (isFront ? ' fan-card--front' : '')}
                  onClick={(e) => handleCardClick(i, e)}
                  animate={{ x: t.x, rotate: t.rotate, scale: t.scale, opacity: t.opacity }}
                  whileHover={isFront ? { scale: 1.04, y: -8 } : {}}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  style={{ zIndex: t.zIndex, background: p.color, transformOrigin: 'bottom center', overflow: 'hidden' }}
                >
                  {p.image && (
                    <img
                      src={p.image}
                      alt=""
                      style={{
                        position: 'absolute', inset: 0, width: '100%', height: '100%',
                        objectFit: 'cover', opacity: 0.55,
                      }}
                    />
                  )}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '24px', zIndex: 1,
                    background: `linear-gradient(to top, ${p.color} 30%, transparent 100%)`,
                  }}>
                    <span style={{
                      fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                      letterSpacing: '0.08em', opacity: 0.7, color: textColor,
                    }}>{p.client}</span>
                    <h3 style={{
                      fontSize: '18px', fontWeight: 600, lineHeight: 1.2,
                      marginTop: '4px', color: textColor,
                    }}>{p.title}</h3>
                  </div>
                  {isFront && <span className="fan-card__hint" style={{ color: textColor }}>Click to expand</span>}
                </motion.div>
              );
            })}
          </div>

          <div className="fan-nav">
            <button className="fan-arrow" onClick={() => { go(-1); resetTimer(); }}>&#8592;</button>
            <div className="fan-dots">
              {projects.map((_, i) => (
                <button
                  key={i}
                  className={"fan-dot" + (i === active ? " fan-dot--active" : "")}
                  onClick={() => { setActive(i); resetTimer(); }}
                />
              ))}
            </div>
            <button className="fan-arrow" onClick={() => { go(1); resetTimer(); }}>&#8594;</button>
          </div>
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {expanded !== null && (
          <ExpandedCard
            project={projects[expanded]}
            cardRect={cardRect}
            onClose={() => setExpanded(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
