# Project guide

- Keep the deterministic simulation in `src/game.mjs`; browser rendering must not change simulation rules.
- Contract v1.1: `node src/headless.mjs --seed N --night 1|2|3 --ticks N --out FILE [--scenario FILE] [--inputs FILE] [--snapshot-every N]`.
- Run `node --check src/game.mjs && node --check src/headless.mjs && node --check src/view.mjs`, then `node tests/run.mjs` after edits.
- Preserve phase-1 scenarios and JSONL behavior while adding v1.1 fields, pause, nights, physics, drifters and charms.
- Keep snapshots/events deterministic; visual-only entities stay out of headless outputs.
- Update `game.contract.json` whenever tuning changes; record assumptions, spec coverage and evidence in `docs/`.
