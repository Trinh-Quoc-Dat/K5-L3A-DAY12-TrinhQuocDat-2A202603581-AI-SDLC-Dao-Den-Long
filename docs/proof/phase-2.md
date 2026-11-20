# Phase 2 · Verification evidence

Run `node tests/run.mjs` to recreate the headless evidence. The runner creates outputs in the operating system's temporary folder and checks the JSON values/events directly; it does not edit output by hand.

## Acceptance matrix

| Requirement | Evidence | Result |
|---|---|---|
| Fixed tick, snapshot tick 0, seeded deterministic output, JSONL end | Repeated seed 77 run for 240 ticks; compare output bytes | Pass |
| Pickup, deposit and light; Phase 1 event/data continuity | `pickup_scenario.json`, `pickup_inputs.json` | Pass |
| Pulse stuns shades, including an initially stunned target; cooldown and score | `pulse_scenario.json`, `pulse_inputs.json` | Pass |
| Night victory and no-flame loss; `player_hit.lost` | `win_*` and `hit_scenario.json` | Pass |
| Dash direction, 14 m/s × 12 ticks, cooldown | `dash_*` | Pass |
| Night 2 charm pickup and timer | `charm_scenario.json` | Pass |
| Night 2 jump pad reaches island B with grounded landing | `pad_scenario.json`, 85-tick run | Pass |
| Gió Lạc steals up to 3, and pulse drops carried motes | `drifter_scenario.json`, `drifter_drop_scenario.json` | Pass |
| Pause/resume event and frozen `sim_tick` | `pause_*`, snapshots at ticks 1 and 5 | Pass |
| Night 1/2/3 lantern and mote layouts; Night 3 home spawn | default map snapshots | Pass |
| Night 1 first shade wave; spawn IDs and count | `schedule_scenario.json`, 300-tick run | Pass |
| Night 3 wind timing and selected direction | `night3_scenario.json`, 1,800-tick run | Pass |
| Input/scenario malformed JSON shape returns exit 2 | duplicate input ticks and invalid player vector | Pass |
| 3D menu, Night 1 scene, live HUD and browser console | A prior browser check exposed a missing `DT` import that stopped the render loop; fixed in follow-up commit, fresh browser verification still pending | Needs manual check |

## Full headless duration

The Node.js simulation ran Night 3 through 18,000 steps (300 seconds) and wrote JSONL in **0.21 seconds** in the local measurement. Machine: Windows x64, Node.js v24.22.3, Intel Core i7-11370H, 8 reported logical CPUs, 15.7 GiB RAM. Scenario `tests/fixtures/perf_scenario.json` disables pursuers/wind so the run reaches dawn instead of ending early from a loss. Reproduce with:

```sh
Measure-Command { node src/headless.mjs --seed 2026 --night 3 --ticks 21600 --snapshot-every 900 --scenario tests/fixtures/perf_scenario.json --out result.jsonl }
```

## Visual check

A prior local browser check displayed a static HUD over an empty canvas. The render loop referenced `DT` without importing it, so animation stopped on its first frame. The fix exports `DT` from `src/game.mjs` and imports it in `src/view.mjs`. Syntax checks, the 60 Hz export check, and the headless suite pass after the fix. The browser could not reconnect to a fresh local server in this environment, so a post-fix visual/FPS check remains outstanding. Open the current build with `python3 src/run.py` on a machine with Internet access to load Three.js from its CDN; confirm the island and player render and average at least 30 FPS.

## Ticket assumptions

The supplied ticket omitted the canonical tuning table and RGB rows it referenced. The user authorized original choices; all selected values and the Night 3 spawn choice are listed in [`../spec/phase-2.md`](../spec/phase-2.md). If the instructor later supplies a canonical table, compare it to `game.contract.json` and adjust before release.
