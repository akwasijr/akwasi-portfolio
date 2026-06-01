# Smart Factory Operations

**Screenshot:** `industry-smart-factory.png`

## What it is
A factory operations overview panel for monitoring processing rates, data synchronisation, anomaly detection, and team activity. Includes an integrated AI assistant (Atlas) for conversational querying of production data.

## UX approach
Factory managers juggle multiple systems. This design consolidates everything into a single overview with date-range filtering and partner segmentation. The top card row uses a progressive disclosure pattern — each card shows one hero metric with supporting detail beneath. The anomaly card uses a percentage + absolute count pair so users understand both the rate and the scale. The AI Assistant panel on the right is the centrepiece UX innovation — it's a persistent conversational interface where a manager can ask natural language questions ("check for discrepancies in production vs. projected values") and get structured, actionable responses with file/image attachments. This sidesteps the traditional drill-down reporting workflow entirely.

## Key design decisions
- Horizontal top navigation with search — optimised for wide monitors common in factory control rooms
- Donut chart for sync verification rate — immediately shows "how much is left" at a glance
- AI chat panel is always visible, not hidden behind a button — signals it's a first-class tool, not a gimmick
- Account Insights banner at top right proactively surfaces AI-generated summaries without being asked
