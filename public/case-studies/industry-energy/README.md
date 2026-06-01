# Energy Grid Management

**Screenshot:** `industry-energy.png`

## What it is
A real-time energy grid monitoring dashboard (GridPower). Designed for grid operators who need to track power generation, efficiency, alerts, and carbon metrics across an entire network.

## UX approach
Energy operators work in shifts, often monitoring screens for hours. The design prioritises scannability — four KPI cards at top with sparklines give an instant pulse check. The power generation heatmap (Mon–Sun × hourly) lets operators spot production patterns and anomalies without reading numbers. Weekly output bars provide a secondary rhythm view. The AI Grid Optimizer section at the bottom surfaces predictive insights (peak demand, solar output, grid stress) with confidence scores — a deliberate design pattern that shows the AI's certainty level so operators know when to trust the recommendation versus investigate further.

## Key design decisions
- Heatmap uses intensity-coded green shades — maps to energy/sustainability mental model
- Light/Dark mode toggle in sidebar — critical for shift workers in different lighting conditions
- Confidence percentages on AI predictions build trust and support human-in-the-loop decision making
- Alert badge (3) on sidebar provides persistent awareness without interrupting the main view
