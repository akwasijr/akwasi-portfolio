# Supply Chain & Cargo Distribution

**Screenshot:** `industry-supply-chain.png`

## What it is
A cargo distribution and logistics interface (GlobalFreight) for planning shipments across international routes. Users manage available flights, visualise container loading, route parcels, and calculate freight costs.

## UX approach
Logistics is inherently spatial and sequential — you're moving physical things through physical space. The design reflects this with a four-panel layout that mirrors the planning workflow left-to-right: (1) select a flight, (2) see the aircraft cargo hold visually, (3) assign cargo to route segments, (4) manage parcel details and costs. The aircraft cross-section visualisation is the key UX choice — rather than a spreadsheet of cargo slots, operators see a schematic of the actual hold with labelled containers. This reduces cognitive load because the mental model matches the physical reality. Route segments (SWC → NYK → LDN → BRN) are shown as a horizontal timeline with colour-coded nodes.

## Key design decisions
- Multi-panel layout follows the user's task flow (select → visualise → assign → confirm)
- Aircraft hold diagram bridges the gap between abstract data and physical cargo placement
- Weight indicators (4000 kg) shown inline in cargo slots — prevents overloading errors at the point of decision
- Checkout/Share/Delete actions are co-located with the cost summary — decision and action in one place
