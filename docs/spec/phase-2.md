# Phase 2 · Ticket-02 · Acceptance criteria

Contract target: v1.1. These criteria are transcribed from the supplied Ticket-02. The attachment omitted its referenced canonical tuning table and RGB rows; the user authorized original design choices. Phase 1 values are retained where compatible, while the ticket's explicit capacity/HUD is set to 10. Selected values and this limitation are recorded in the Phase 2 assumptions log.

## Core simulation and normalized rules

- [ ] Simulation advances at fixed 60 Hz and follows the ticket's ordered update phases; spawning during a tick cannot interact until the following tick.
- [ ] Pausing increments wall simulation `tick` only; gameplay `sim_tick`, timers, cooldowns, spawns, TTL and charm recovery remain frozen. Snapshots use `state: "paused"`.
- [ ] Coordinates use meters, Y up; angle convention is +X counterclockwise viewed from above.
- [ ] Use the canonical Night 1 circle (radius 40), start pose, five lantern coordinates, mote spawn points and shade spawn schedule/rules.
- [ ] Implement the supplied Night 2 twin islands, bridge, six lanterns, per-island spawn points, jump pads and transition velocities.
- [ ] Implement the supplied Night 3 three-height island, walkable levels, vertical drops, two ramps, jump pad, bell tower, lantern and spawn points.
- [ ] Standard score: mote pickup +10, lantern lit +100, each successful pulse hit +5, and night victory adds `floor(seconds left) × 2 + 50 × remaining flames`. Overall score sums only nights won.
- [ ] Use the chosen and documented base tuning for movement, capacity, lantern costs/radii, pulse, lives, invulnerability, enemy speed, night duration and dash timing. Repeatedly run Phase 1 test scenarios.

## Phase 2 features (ticket sections 1–8)

1. **Gió Lạc, Night 2–3:** spawn at ticks 1200, 2400, … on deterministic seed-selected mist points; max 2; idle/chase/flee/removed transitions, threshold/range, one-time theft, flee duration, pulse interactions and nonlethal contact all match the ticket.
2. **Wind Charm:** collectable C1/C2, duration 600 ticks, running speed 7.2 m/s, dash cooldown removed during charm while retaining dash press/active behavior; respawn after 2700 ticks at the given per-night positions.
3. **Three-night flow:** main menu → night introduction (island name and Ông Đăng narration) → play → result → next night; win Night 3 displays dawn and cumulative score; defeat retries that same night.
4. **Pause:** Esc/P toggles pause; Continue, Retry Night, Settings, Main Menu work; simulation obeys frozen-state semantics.
5. **Settings:** volume and mouse sensitivity persist across reloads.
6. **Audio:** night music and event cues for mote pickup, lantern lighting, pulse, hit, jump, dash, win, loss, shade spawn and final-ten-second countdown.
7. **HUD:** lives, centered timer with low-time red blink, lantern count and score, 10-slot mote bar, dash/pulse cooldowns, nearby lantern prompt (`E — Nạp ánh sáng (x/10)`), off-screen nearest-dark-lantern pointer.
8. **Palette/environment:** use an original warm amber, teal and deep indigo palette; environment intensity follows `0.15 + 0.55 × lit / total`. The source RGB rows were omitted; this build uses a coherent original palette authorized by the user.

## Test Contract v1.1

- [ ] `game.contract.json` declares version 1.1, canonical tuning and `dash_speed`, `dash_duration_s`, `dash_cooldown_s`, `night2_duration_s`, `night3_duration_s`.
- [ ] Headless `--night` accepts 1, 2, 3; each night can run to completion in at most 21,600 ticks and in no more than 30 seconds.
- [ ] Snapshot includes night, wind, player velocity/grounded/invulnerability/dash cooldown/pulse cooldown/charm time, motes with kind and TTL, drifters and charms.
- [ ] Scenario supports player cooldowns/charm, shade state/timer, replacement drifter/charm lists, random-drifter and wind flags.
- [ ] Inputs support rising-edge dash and pause.
- [ ] Emit all new events using the specified names/data; `player_hit` includes `lost`.
- [ ] Shades use exactly `spawning`, `wander`, `chase`, `recoil`, `stunned`.
- [ ] Preserve all Phase 1 hidden-test behaviors with canonical settings.
- [ ] Test each new feature with at least one reproducible headless scenario.
- [ ] Normal gameplay averages at least 30 FPS at 1280×720.

## Verification plan

Add one deterministic headless scenario for each changed mechanic: dash and jump-pad trajectories; pause/resume tick accounting; Night 1/2/3 map, pickups and interactions; charm pick-up/refresh/respawn; drifter thresholds/theft/pulse/drop/expiry; wind start/stop; shade state names and scheduling; win/lose/retry/progression and aggregate score; scenario overrides and every v1.1 snapshot/event field. Run the existing Phase 1 scenarios against the v1.1 engine as regression checks.

## Assumptions made with user authorization

- Keep Phase 1's player speed (6 m/s), pickup/interact radii (1.5/2.5 m), pulse cost/radius (1/8 m), 3 flames, invulnerability (1.5 s), 50% hit drop, 3 s stun, 5 m push, 1 s pulse cooldown, 5 m safe radius, shade speed (2.4 m/s) and 1.2 m hit radius.
- Set carry capacity and lantern cost to 10, matching the ticket's 10-slot bar and `x/10` interaction prompt.
- Use 300 seconds for each night because the supplied ticket omits the referenced night duration values.
- Dash is 14 m/s for 12 ticks; choose a 90-tick (1.5 s) ordinary cooldown. Charm behavior follows its specified 600-tick duration and overrides cooldown.
- Use a self-authored palette of moonlit indigo, teal and lantern amber; preserve high contrast and warm-up lighting formula from the ticket.
- Shade warning/spawning phase: 30 ticks. This phase length is not present in the supplied ticket; record as a chosen implementation detail and keep state visible in snapshots.
- Seed controls all randomized mist points, spawn choices, and wind directions.
