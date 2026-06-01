# Banking & Wealth Management

**Screenshot:** `industry-banking.png`

## What it is
A portfolio management dashboard for a fictional wealth platform (Apex Wealth). The interface gives relationship managers a single-screen view of client portfolios — total value, daily P&L, asset allocation, risk scoring, and active alerts.

## UX approach
The design challenge was density without overload. A three-column layout separates navigation/search (left), analytical visualisation (centre), and contextual detail (right). Portfolio health is communicated through colour-coded status badges (Healthy, Warning, Critical) so a manager can triage at a glance. The Sankey-style asset allocation flow chart was chosen over a pie chart to show *how* money moves across asset classes, not just where it sits. An AI Portfolio Optimizer nudge at the bottom introduces a copilot pattern — the system recommends a rebalance action with a single-click CTA, reducing a multi-step workflow to one decision point.

## Key design decisions
- Dark theme with amber/gold accent to reinforce a premium, finance-first tone
- Status badges use traffic-light semantics (green/amber/red) — universally scannable
- Right panel acts as a "detail on demand" inspector, keeping the main view uncluttered
- AI recommendation surfaces inline, not in a modal — respects the user's flow
