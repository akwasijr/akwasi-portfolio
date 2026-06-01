# Telecom Network Operations

**Screenshot:** `industry-telco.png`

## What it is
A live network health monitoring dashboard for telecom operators. Shows real-time network sector status, issue distribution (latency, packet loss, DDoS, etc.), and per-sector health scoring.

## UX approach
Network operations centres (NOCs) need instant pattern recognition. The bubble chart at centre is the hero — each circle represents an issue category, sized by frequency, colour-coded by severity (red dot = critical, green = healthy). This gives operators an immediate "shape of the problem" that a table or bar chart can't match. The left panel lists network sectors with event counts, functioning as both navigation and triage list. The right sidebar shows a per-sector health bar chart for comparative analysis. The overall network health score (75%) at the bottom anchors all the detail to one number the team can rally around.

## Key design decisions
- Bubble chart communicates proportional severity faster than ranked lists
- Icon-only sidebar navigation maximises horizontal space for the visualisation
- Sector list uses a highlight + card pattern for the selected item — clear wayfinding
- Cyan/teal palette differentiates from the green (energy) and amber (finance) dashboards — each industry gets its own colour identity
- Live indicator (green dot next to "Live Now") gives confidence that data is current, not stale
