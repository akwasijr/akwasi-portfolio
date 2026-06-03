import { useState, useCallback, useEffect, useRef, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const ease = [0.22, 1, 0.36, 1];

const projects = [
  {
    id: 'ey-fs-review',
    client: 'EY',
    title: 'AI FS Review Tool',
    color: '#14130e',
    image: '/assets/projects/ey-results.png',
    tags: ['Enterprise AI', 'Audit & Assurance'],
    lead: 'A financial-statement review that once took auditors several days, rebuilt as a guided AI workflow that runs the full disclosure checklist in minutes - while the auditor still signs off on every call.',
    meta: {
      capabilities: ['Product Design', 'AI UX', 'Design System'],
      role: 'Product Strategy & UX design',
      timeline: '2025',
      platform: 'Web application',
    },
    sections: [
      {
        heading: 'The context',
        body: 'EY teams reviewing client financial statements worked through long compliance checklists by hand. A single engagement could carry hundreds of items, spanning everything from simple presentation and formatting checks to complex cross-referencing between the notes, the cash flow statement, and the statement of financial position. The work was slow, repetitive, and easy to lose hours in.',
      },
      {
        heading: 'Why it mattered',
        body: 'In assurance, a missed disclosure is not a small thing - it is a quality and reputational risk. Yet the sheer volume of manual checking meant reviewers spent their sharpest attention on mechanical comparison rather than judgment. The goal was never to replace the auditor; it was to give them their time and focus back for the calls that actually need a human.',
      },
      {
        heading: 'Where AI earned its place',
        body: 'AI is strong at exactly the part that was draining people: reading every page, matching figures across statements, and applying a known checklist consistently at scale. So we pointed it there - executing the disclosure checklist, surfacing each finding with a citation, and flagging cross-reference breaks. We deliberately kept AI away from the final verdict. It proposes and evidences; the reviewer decides.',
      },
      {
        heading: 'Designing for trust',
        body: 'Auditors will not trust a black box, and they should not have to. Every screen was designed to make the AI legible: live progress as the checklist runs, an honest breakdown of what was executed, skipped, or errored, a citation on every finding, and simple Approve / Not Applicable controls. That is why the design work mattered - the hard part was not generating answers, it was presenting them so a professional could verify and own them quickly.',
      },
    ],
    process: [
      {
        title: 'Set up the engagement',
        body: 'The reviewer names the engagement and entity, then picks the accounting standard (IFRS / PFRS), regulatory framework, country, and year under review. These choices tell the AI which checklist and rules to apply, so the review is scoped correctly before a single document is touched.',
      },
      {
        title: 'Choose the review areas',
        body: 'Rather than running everything blindly, the reviewer selects which statements and disclosures are in scope - basis of preparation, cover page, management responsibility, profit or loss, financial position. The work matches the engagement instead of a one-size checklist.',
      },
      {
        title: 'Add the document sources',
        body: 'The reviewer uploads the financial statements and supporting files. Clear states for uploading, parsing, and ready keep them oriented while the system ingests potentially hundreds of pages.',
      },
      {
        title: 'Let the AI execute the checklist',
        body: 'The AI runs each checklist item against the source documents, showing live progress and a transparent count of what was executed, skipped, or errored - never a silent black box.',
      },
      {
        title: 'Review findings and cross-references',
        body: 'Each item returns an AI finding with a citation back to the exact source, plus cross-referencing checks that flag inconsistencies like unlinked notes ("Note 15 and 23 are not linked"). The reviewer reads the reasoning, not just a verdict.',
      },
      {
        title: 'Approve, flag, or mark not applicable',
        body: 'The reviewer confirms each result with Approve / Not Applicable controls and thumbs feedback. The human signs off on every line; the AI just removed the hours of manual scanning needed to get there.',
      },
    ],
    outcomes: [
      { value: 'Days to minutes', label: 'A full statement review that took several days now runs in minutes' },
      { value: 'Every item cited', label: 'Each AI finding links back to its source for fast verification' },
      { value: '100% human sign-off', label: 'Reviewers approve, reject, or exempt every checklist result' },
      { value: 'End to end', label: 'From basis of preparation to financial position in one flow' },
    ],
    problems: [
      'A single review ran for several days of manual checklist work',
      'Hundreds of disclosure items were checked by hand per engagement',
      'A missed disclosure is a real quality and reputational risk',
      'Sharp attention was spent on mechanical comparison, not judgment',
    ],
    images: [
      { src: '/assets/projects/ey-results.png', caption: 'Results dashboard: items reviewed, passed, failed, to confirm', device: 'desktop' },
      { src: '/assets/projects/ey-overview.png', caption: 'FS Review overview - checklists by client, period, and status', device: 'browser' },
      { src: '/assets/projects/ey-setup.png', caption: 'Guided review setup: engagement, standard, framework, year', device: 'tablet' },
      { src: '/assets/projects/ey-executing.png', caption: 'AI executing the checklist against the uploaded documents', device: 'browser' },
      { src: '/assets/projects/ey-checklist.png', caption: 'Checklist findings with citations, cross-references, and approve controls', device: 'laptop' },
    ],
  },
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
    problems: [
      'Active cases tracked across spreadsheets and disconnected systems',
      'Hours lost daily finding case history and checking deadlines',
      'No unified view of an officer caseload or workload',
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
    problems: [
      'Drafting judgments took weeks of manual evidence gathering',
      'Legal references were scattered across multiple sources',
      'Repetitive assembly left little time for decision quality',
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
    problems: [
      'Six departments ran on disconnected tools with no shared intelligence',
      'Manual archiving and limited Arabic / English searchability',
      'Siloed reporting slowed every cross-departmental decision',
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
    problems: [
      'Regional heritage was being lost to younger generations',
      'Traditional education formats felt passive and one-directional',
      'No immersive format existed for interactive-media audiences',
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
    video: '/assets/projects/terminal42-demo.mp4',
    videoPoster: '/assets/projects/terminal42-splash.png',
    videoCaption: 'Terminal 42 v0.12 - live product demo',
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
    problems: [
      'AI was bolted onto IDEs as an afterthought, not a starting point',
      'Constant context-switching between code and design tools',
      'Re-explaining your stack and style every single session',
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
    id: 'industry-dashboards',
    client: 'Industry Concepts',
    title: 'Other Projects',
    color: '#141e30',
    image: '/case-studies/industry-banking/industry-banking.png',
    tags: ['Dashboard Design', 'AI Integration'],
    sections: [
      {
        heading: 'Context',
        body: 'A collection of industry-specific dashboard concepts, each designed around the operational realities of a different sector. Banking, energy, manufacturing, logistics, and telecom - five verticals, five different user contexts, one shared design challenge: making dense, real-time data immediately actionable without overwhelming the operator.',
      },
      {
        heading: 'Design approach',
        body: 'Each dashboard starts from the domain. A wealth management interface uses a Sankey-style flow to show how money moves across asset classes. An energy grid dashboard uses heatmaps so shift operators can spot production anomalies at a glance. A cargo distribution panel mirrors the physical planning workflow - select a flight, see the aircraft hold, assign containers, confirm costs. The telecom NOC uses a bubble chart sized by frequency and colour-coded by severity so operators read the shape of a problem before reading any numbers. Every layout choice maps to how people in that industry actually think and work.',
      },
      {
        heading: 'AI patterns',
        body: 'Each concept integrates AI differently based on the task. The banking dashboard surfaces a portfolio rebalance recommendation inline with a single-click action. The energy grid shows predictive insights with confidence scores so operators know when to trust versus investigate. The smart factory includes a persistent conversational assistant for natural-language queries against production data. The common thread: AI appears where it reduces a multi-step workflow to one decision point, never as a standalone feature.',
      },
    ],
    problems: [
      'Dense, real-time data overwhelmed operators on every screen',
      'Generic dashboards ignored real domain workflows',
      'AI features bolted on as standalone, never in the flow of work',
    ],
    images: [
      { src: '/case-studies/industry-banking/industry-banking.png', caption: 'Banking: portfolio management with AI rebalance recommendations' },
      { src: '/case-studies/industry-energy/industry-energy.png', caption: 'Energy: grid monitoring with heatmaps and predictive insights' },
      { src: '/case-studies/industry-smart-factory/industry-smart-factory.png', caption: 'Manufacturing: factory operations with conversational AI assistant' },
      { src: '/case-studies/industry-supply-chain/industry-supply-chain.png', caption: 'Logistics: cargo distribution with aircraft hold visualisation' },
      { src: '/case-studies/industry-telco/industry-telco.png', caption: 'Telecom: network health with severity bubble chart' },
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

function DeviceImage({ src, caption, device = 'browser', alt, video, poster }) {
  const img = video
    ? <video src={video} poster={poster} controls playsInline preload="metadata" />
    : <img src={src} alt={alt} loading="lazy" />;
  let frame;
  if (device === 'laptop') {
    frame = (
      <div className="device device--laptop">
        <div className="device__screen">{img}</div>
        <div className="device__base"><span className="device__notch" /></div>
      </div>
    );
  } else if (device === 'phone') {
    frame = (
      <div className="device device--phone">
        <span className="device__camera" />
        <div className="device__screen">{img}</div>
      </div>
    );
  } else if (device === 'tablet') {
    frame = (
      <div className="device device--tablet">
        <span className="device__camera" />
        <div className="device__screen">{img}</div>
      </div>
    );
  } else if (device === 'desktop') {
    frame = (
      <div className="device device--desktop">
        <div className="device__screen">{img}</div>
        <div className="device__stand"><span className="device__neck" /><span className="device__foot" /></div>
      </div>
    );
  } else if (device === 'plain') {
    frame = <div className="device device--plain"><div className="device__screen">{img}</div></div>;
  } else {
    frame = (
      <div className="device device--browser">
        <div className="device__bar">
          <span className="device__dot" /><span className="device__dot" /><span className="device__dot" />
          <span className="device__url" />
        </div>
        <div className="device__screen">{img}</div>
      </div>
    );
  }
  return (
    <figure className="case-figure">
      {frame}
      {caption && <figcaption className="case-figure__caption">{caption}</figcaption>}
    </figure>
  );
}

function mixHex(hex, target, amt) {
  const h = (hex || '#141414').replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const tr = parseInt(target.slice(1, 3), 16);
  const tg = parseInt(target.slice(3, 5), 16);
  const tb = parseInt(target.slice(5, 7), 16);
  const mix = (a, t) => Math.round(a + (t - a) * amt);
  const to2 = (v) => v.toString(16).padStart(2, '0');
  return `#${to2(mix(r, tr))}${to2(mix(g, tg))}${to2(mix(b, tb))}`;
}

function surfacesFor(color) {
  const h = (color || '#141414').replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const towards = lum < 0.5 ? '#ffffff' : '#000000';
  return {
    panel: mixHex(color, towards, lum < 0.5 ? 0.08 : 0.07),
    panelStrong: mixHex(color, towards, lum < 0.5 ? 0.14 : 0.12),
  };
}

function ImageSlider({ images, title, projectTitle }) {
  const trackRef = useRef(null);
  const scrollByDir = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelector('.case-slide');
    const amount = slide ? slide.getBoundingClientRect().width + 24 : track.clientWidth;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };
  return (
    <section className="case-block case-slider">
      <div className="case-slider__head">
        <h3 className="case-block__label">{title}</h3>
        <div className="case-slider__nav">
          <button type="button" className="fan-arrow" aria-label="Previous image" onClick={() => scrollByDir(-1)}>&#8592;</button>
          <button type="button" className="fan-arrow" aria-label="Next image" onClick={() => scrollByDir(1)}>&#8594;</button>
        </div>
      </div>
      <div className="case-slider__track" ref={trackRef}>
        {images.map((img, i) => (
          <div className="case-slide" key={i}>
            <DeviceImage
              src={img.src || img}
              caption={img.caption}
              device={img.device || 'browser'}
              alt={`${projectTitle} - ${img.caption || 'product screenshot'}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
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

  const images = project.images || [];
  const heroImage = images[0];
  const galleryImages = images.slice(1);
  const meta = project.meta || {};
  const surfaces = surfacesFor(project.color);
  const metaItems = [
    ['Client', project.client],
    ['Capabilities', meta.capabilities],
    ['Role', meta.role],
    ['Platform', meta.platform],
    ['Timeline', meta.timeline],
  ].filter(([, v]) => v && (!Array.isArray(v) || v.length));

  return (
    <motion.div
      className="case-expanded"
      style={{ background: project.color, '--panel': surfaces.panel, '--panel-strong': surfaces.panelStrong }}
      initial={{ x: startX, y: startY, scaleX: startScaleX, scaleY: startScaleY, borderRadius: '0px' }}
      animate={{ x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: '0px' }}
      exit={{ x: startX, y: startY, scaleX: startScaleX, scaleY: startScaleY, borderRadius: '0px' }}
      transition={{ duration: 0.55, ease }}
      onClick={onClose}
    >
      <motion.div
        className="case-detail"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: 0.25, ease }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="case-detail__hero">
          <h2 className="case-detail__title">{project.title}</h2>
          {project.lead && <p className="case-detail__lead">{project.lead}</p>}
          {metaItems.length > 0 && (
            <dl className="case-detail__meta">
              {metaItems.map(([label, value]) => (
                <div className="case-detail__meta-item" key={label}>
                  <dt>{label}</dt>
                  <dd>{Array.isArray(value) ? value.join(', ') : value}</dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        {heroImage && (
          <DeviceImage
            src={heroImage.src || heroImage}
            caption={heroImage.caption}
            device={heroImage.device || 'browser'}
            alt={`${project.title} - ${heroImage.caption || 'product screenshot'}`}
          />
        )}

        {project.video && (
          <section className="case-block case-demo">
            <h3 className="case-block__label">Live demo</h3>
            <DeviceImage
              video={project.video}
              poster={project.videoPoster}
              caption={project.videoCaption}
              device="laptop"
              alt={`${project.title} demo video`}
            />
          </section>
        )}

        {project.sections && (
          <div className="case-detail__sections">
            {project.sections.map((s, i) => (
              <section className="case-section" key={i}>
                <h3 className="case-section__label">{s.heading}</h3>
                <p className="case-section__body">{s.body}</p>
              </section>
            ))}
          </div>
        )}

        {project.problems && project.problems.length > 0 && (
          <section className="case-block case-problems">
            <h3 className="case-block__label">The problems</h3>
            <ul className="case-problems__list">
              {project.problems.map((p, i) => (
                <li className="case-problems__item" key={i}>
                  <span className="case-problems__mark" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="case-problems__text">{p}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.process && project.process.length > 0 && (
          <section className="case-block case-journey-block">
            <h3 className="case-block__label">The UX journey</h3>
            <ol className="case-journey">
              {project.process.map((step, i) => (
                <Fragment key={i}>
                  <li className="case-journey__step">
                    <span className="case-journey__num">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className="case-journey__title">{step.title}</h4>
                  </li>
                  {i < project.process.length - 1 && (
                    <li className="case-journey__arrow" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </li>
                  )}
                </Fragment>
              ))}
            </ol>
          </section>
        )}

        {project.outcomes && project.outcomes.length > 0 && (
          <section className="case-block case-outcomes">
            <h3 className="case-block__label">Outcomes</h3>
            <div className="case-outcomes__grid">
              {project.outcomes.map((o, i) => (
                <div className="case-outcome" key={i}>
                  <span className="case-outcome__value">{o.value}</span>
                  <span className="case-outcome__label">{o.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {galleryImages.length > 0 && (
          <ImageSlider images={galleryImages} title="Inside the product" projectTitle={project.title} />
        )}
      </motion.div>
    </motion.div>
  );
}

export default function CaseStudiesSection() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [cardRect, setCardRect] = useState(null);
  const [entered, setEntered] = useState(false);
  const frontCardRef = useRef(null);
  const timerRef = useRef(null);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  // Stagger cards fanning out on mount
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 400);
    return () => clearTimeout(t);
  }, []);

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

  // Touch swipe handling
  const touchRef = useRef({ startX: 0, startY: 0 });
  const handleTouchStart = (e) => {
    touchRef.current.startX = e.touches[0].clientX;
    touchRef.current.startY = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const dy = e.changedTouches[0].clientY - touchRef.current.startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) { go(1); resetTimer(); }
      else { go(-1); resetTimer(); }
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
          <div
            className="fan-carousel"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
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
                  initial={{ x: 0, rotate: 0, scale: 0.85, opacity: 0, y: 60 }}
                  animate={entered
                    ? { x: t.x, rotate: t.rotate, scale: t.scale, opacity: t.opacity, y: 0 }
                    : { x: 0, rotate: 0, scale: 0.85, opacity: 0, y: 60 }
                  }
                  whileHover={isFront ? { scale: 1.04, y: -8 } : {}}
                  transition={{ duration: 0.7, delay: entered ? i * 0.06 : 0, ease: [0.22, 1, 0.36, 1] }}
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
                  {isFront && <span className="fan-card__hint" style={{ color: textColor }}>Tap to expand</span>}
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
