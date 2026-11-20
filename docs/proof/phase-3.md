# Phase 3 · Evidence · Contract v1.2

## Automated evidence

Run `node tests/run.mjs` to recreate the deterministic fixtures. The runner writes outputs to the OS temp folder and checks JSONL events/snapshots directly.

- Phase 1 pickup/deposit, hit, pulse, deterministic seeds and malformed-input exit code 2: pass.
- Phase 2 dash, charms, jump pads, drifter theft/drop, pause, 3 maps, wind and shade schedule: pass.
- Phase 3 dawn win at 3/5 lamps, dawn loss below threshold, last-flame priority, no early victory with all lamps on, first-light/relight scoring and carry increase, low-fuel refuel/ejection, drain cadence/event, extinguish, and drain pulse score: pass.
- Parser and JavaScript syntax checks: pass.

## Visual evidence

The previous browser screenshot showed the HUD over an empty canvas. The cause (missing `DT` import in the render loop) was fixed in commit `514e85b` before Phase 3. This environment could not reach the user's `127.0.0.1` server, so the current visual scene, low-fuel bar/blink, colorblind toggle and 30 FPS target still need a fresh manual check on the local machine. No visual pass or FPS measurement is claimed here.

## Replaced test

Ticket-02's “all lanterns lit ⇒ immediate win” test is obsolete. It was replaced, not skipped, by a 3-of-5 dawn win test, a 2-of-5 dawn loss test, and a test that all five lit while time remains stays in `playing`. EOL last-flame priority is checked separately.
