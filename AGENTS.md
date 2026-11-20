# Project guide

- Keep the deterministic simulation in `src/game.mjs`; browser rendering must not change simulation rules.
- Contract: `node src/headless.mjs --seed N --night 1 --ticks N --out FILE [--scenario FILE] [--inputs FILE] [--snapshot-every N]`.
- Run `node --check src/game.mjs && node --check src/headless.mjs` after edits and run `node tests/run.mjs` for the contract scenarios.
- Keep snapshots/events JSONL stable, deterministic and free of presentation-only entities.
- Update `game.contract.json` whenever gameplay tuning changes; record evidence and assumptions in `docs/`.
