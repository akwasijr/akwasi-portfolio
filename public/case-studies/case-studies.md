# Case Studies — Akwasi Fosuhene

Use this file to feed into a chat model to build a mini case-study site. Each entry includes the screenshot filename, a short UX description, and grouping metadata.

---

## Group 1: Industry Dashboards — AI-Powered Operations

These projects explore how AI copilot patterns and data-dense interfaces can be designed for high-stakes, regulated industries. Each one translates complex operational data into something a human operator can scan, trust, and act on in seconds.

---

### 1. Banking & Wealth Management

**Screenshot:** `industry-banking.png`

**What it is:**
A portfolio management dashboard for a fictional wealth platform (Apex Wealth). The interface gives relationship managers a single-screen view of client portfolios — total value, daily P&L, asset allocation, risk scoring, and active alerts.

**UX approach:**
The design challenge was density without overload. A three-column layout separates navigation/search (left), analytical visualisation (centre), and contextual detail (right). Portfolio health is communicated through colour-coded status badges (Healthy, Warning, Critical) so a manager can triage at a glance. The Sankey-style asset allocation flow chart was chosen over a pie chart to show *how* money moves across asset classes, not just where it sits. An AI Portfolio Optimizer nudge at the bottom introduces a copilot pattern — the system recommends a rebalance action with a single-click CTA, reducing a multi-step workflow to one decision point.

**Key design decisions:**
- Dark theme with amber/gold accent to reinforce a premium, finance-first tone
- Status badges use traffic-light semantics (green/amber/red) — universally scannable
- Right panel acts as a "detail on demand" inspector, keeping the main view uncluttered
- AI recommendation surfaces inline, not in a modal — respects the user's flow

---

### 2. Energy Grid Management

**Screenshot:** `industry-energy.png`

**What it is:**
A real-time energy grid monitoring dashboard (GridPower). Designed for grid operators who need to track power generation, efficiency, alerts, and carbon metrics across an entire network.

**UX approach:**
Energy operators work in shifts, often monitoring screens for hours. The design prioritises scannability — four KPI cards at top with sparklines give an instant pulse check. The power generation heatmap (Mon–Sun × hourly) lets operators spot production patterns and anomalies without reading numbers. Weekly output bars provide a secondary rhythm view. The AI Grid Optimizer section at the bottom surfaces predictive insights (peak demand, solar output, grid stress) with confidence scores — a deliberate design pattern that shows the AI's certainty level so operators know when to trust the recommendation versus investigate further.

**Key design decisions:**
- Heatmap uses intensity-coded green shades — maps to energy/sustainability mental model
- Light/Dark mode toggle in sidebar — critical for shift workers in different lighting conditions
- Confidence percentages on AI predictions build trust and support human-in-the-loop decision making
- Alert badge (3) on sidebar provides persistent awareness without interrupting the main view

---

### 3. Smart Factory Operations

**Screenshot:** `industry-smart-factory.png`

**What it is:**
A factory operations overview panel for monitoring processing rates, data synchronisation, anomaly detection, and team activity. Includes an integrated AI assistant (Atlas) for conversational querying of production data.

**UX approach:**
Factory managers juggle multiple systems. This design consolidates everything into a single overview with date-range filtering and partner segmentation. The top card row uses a progressive disclosure pattern — each card shows one hero metric with supporting detail beneath. The anomaly card uses a percentage + absolute count pair so users understand both the rate and the scale. The AI Assistant panel on the right is the centrepiece UX innovation — it's a persistent conversational interface where a manager can ask natural language questions ("check for discrepancies in production vs. projected values") and get structured, actionable responses with file/image attachments. This sidesteps the traditional drill-down reporting workflow entirely.

**Key design decisions:**
- Horizontal top navigation with search — optimised for wide monitors common in factory control rooms
- Donut chart for sync verification rate — immediately shows "how much is left" at a glance
- AI chat panel is always visible, not hidden behind a button — signals it's a first-class tool, not a gimmick
- Account Insights banner at top right proactively surfaces AI-generated summaries without being asked

---

### 4. Supply Chain & Cargo Distribution

**Screenshot:** `industry-supply-chain.png`

**What it is:**
A cargo distribution and logistics interface (GlobalFreight) for planning shipments across international routes. Users manage available flights, visualise container loading, route parcels, and calculate freight costs.

**UX approach:**
Logistics is inherently spatial and sequential — you're moving physical things through physical space. The design reflects this with a four-panel layout that mirrors the planning workflow left-to-right: (1) select a flight, (2) see the aircraft cargo hold visually, (3) assign cargo to route segments, (4) manage parcel details and costs. The aircraft cross-section visualisation is the key UX choice — rather than a spreadsheet of cargo slots, operators see a schematic of the actual hold with labelled containers. This reduces cognitive load because the mental model matches the physical reality. Route segments (SWC → NYK → LDN → BRN) are shown as a horizontal timeline with colour-coded nodes.

**Key design decisions:**
- Multi-panel layout follows the user's task flow (select → visualise → assign → confirm)
- Aircraft hold diagram bridges the gap between abstract data and physical cargo placement
- Weight indicators (4000 kg) shown inline in cargo slots — prevents overloading errors at the point of decision
- Checkout/Share/Delete actions are co-located with the cost summary — decision and action in one place

---

### 5. Telecom Network Operations

**Screenshot:** `industry-telco.png`

**What it is:**
A live network health monitoring dashboard for telecom operators. Shows real-time network sector status, issue distribution (latency, packet loss, DDoS, etc.), and per-sector health scoring.

**UX approach:**
Network operations centres (NOCs) need instant pattern recognition. The bubble chart at centre is the hero — each circle represents an issue category, sized by frequency, colour-coded by severity (red dot = critical, green = healthy). This gives operators an immediate "shape of the problem" that a table or bar chart can't match. The left panel lists network sectors with event counts, functioning as both navigation and triage list. The right sidebar shows a per-sector health bar chart for comparative analysis. The overall network health score (75%) at the bottom anchors all the detail to one number the team can rally around.

**Key design decisions:**
- Bubble chart communicates proportional severity faster than ranked lists
- Icon-only sidebar navigation maximises horizontal space for the visualisation
- Sector list uses a highlight + card pattern for the selected item — clear wayfinding
- Cyan/teal palette differentiates from the green (energy) and amber (finance) dashboards — each industry gets its own colour identity
- Live indicator (green dot next to "Live Now") gives confidence that data is current, not stale

---

## Group 2: Other Selected Work

*(Add additional case studies here — personal projects, freelance work, open source contributions, design systems, etc. Follow the same format above.)*

### Template

**Screenshot:** `filename.png`

**What it is:**
One sentence describing the product/feature.

**UX approach:**
2–3 sentences on the design thinking, user needs, and key interaction patterns.

**Key design decisions:**
- Bullet points on specific choices and why

---

## How to Use This File

Feed this markdown into a chat model with a prompt like:

> "Using the case studies below, build me a minimal portfolio case study site. Each case study should have a hero image (use the screenshot filename), the title, and the description text. Group them by the headings provided. Use a clean, editorial layout with dark theme."

The screenshots are located in: `public/case-studies/screenshots/`
