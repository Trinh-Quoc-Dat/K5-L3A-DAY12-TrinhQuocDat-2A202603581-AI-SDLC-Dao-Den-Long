# Phase 3 · AI log and retro

## Decisions and assumptions

- Implemented fuel as integer 1/60 units: 60 units per fuel, 1 unit passive decay per tick, 5 units per draining shade per tick.
- `fuel_drain.fuel` records remaining lamp fuel after that shade's drain on each 60th sim tick.
- Ejection uses a 30-tick no-hit window and moves a shade to the five-meter edge; this satisfies the ticket's maximum 30 ticks while retaining a visible safety boundary.
- Scenario lit lamps with omitted fuel start at 100; unlit lamps always snapshot fuel 0. Scenario preset lights do not increment successful lights or award points.
- The earlier missing `DT` import that stopped the browser render loop was fixed in commit `514e85b`; it remains part of the Phase 2 history.

## AI/tool log

- Codex implemented the v1.2 simulation changes, HUD, color setting, scenarios, tests and this documentation.
- Exact token/credit usage was not available in the interface and is recorded as not measured.
- Reused one deterministic simulation for headless and browser play; no new external game engine dependency was added.

## Retro

The old early-win fixture was not skipped: it was replaced by paired tests for dawn threshold and all-lamps-lit-but-time-remains. Integer fuel made exact threshold and end-of-night tests straightforward. A remaining manual task is to measure browser FPS and inspect the low-fuel/colorblind visuals on the user's machine with a running local server.
