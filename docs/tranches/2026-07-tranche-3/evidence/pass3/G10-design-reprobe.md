# G10 — design re-probe: F4/F5/F6 code-inferred claims verified on a known-live instance

Lane: PASS 3, Fable design lane, frontend-design skill loaded. Read-only against the repo; probes
driven headless (Playwright from `web/frontend/node_modules`) against the **live dev instance**.
Charter: synthesis-path-forward.md §"Open questions" item 13 + A24 G10 row — re-verify F4/F5/F6's
code-inferred claims live; tag every design row's evidence basis.

Harness: `pass3/g10-harness/` (`probe-toggle.mjs`, `probe-darkflip.mjs`, `probe-hidpi.mjs`,
`probe-dawn.mjs`, `probe-switch.mjs`; raw JSON in `toggle-results.json`, `switch-results.json`).
Shots: `pass3/g10-shots/` (17 captures, both themes, three size rungs, mid-transition frames,
throttled first-select void).

---

## 0. The :3000 mystery, solved mechanically

The brief's ":3000" server is real but is **not the app** — it's Vite's HMR websocket listener.
`vite.config.ts:206-209` pins `hmr: { host: 'localhost', port: 3000 }`; the running server
(PID 89929, started 2026-07-10 15:59) was launched `--port 3210 --strictPort`, so Vite binds the
app to `*:3210` and opens a *separate* HMR socket on `[::1]:3000` — which answers a plain GET with
**426 Upgrade Required** (reproduced this session, `curl -w` → `426 text/plain`). This is exactly
the shape A24 diagnosed ("alive-as-a-socket, un-GET-able") and why A23 read :3000 as dead. The
known-live instance is **http://localhost:3210** (serves this repo's `index.html`, title
"Sudoku - CSP Solver"); all probes below ran against it. Nothing was killed or restarted.

Browser-extension substrate was unavailable this session too (the same failure that grounded
F4/F5/F6) — the probes use the A23-proven Playwright path, which is a driven real Chromium against
the live Vite app: real pixels, real CSS engine, real module graph. That satisfies the charter's
"known-live instance" bar; it is not the interactive-extension path.

---

## 1. F4 (dark-toggle SVGs) — replica-harness claims, now live

F4's method was a byte-identical offline replica rendered in headless Chrome — never the app.
Live captures: `sun-{208,80,64}px-light.png`, `moon-{208,80}px-dark.png`, `hidpi-*` (3× DPR).

| F4 row | Claim | Live verdict | Evidence |
|---|---|---|---|
| size rungs | 13rem/5rem/4rem at ≥1024/default/≤480 | **CONFIRMED** — measured 208/80/64 px (`toggle-results.json` statics13rem/5rem/4rem) | DOM rects at 1440/800/375 |
| S1 | spiral reads as "G" at 80px | **CONFIRMED** — the inner-terminal bar is visible live at both 80px and 208px (`hidpi-sun-80px-light.png`, `dawn-230ms.png`); the G-hook is unmistakable | live pixels |
| S2 | spiral 1.17:1 vs disc, nearly tonal | **CONFIRMED at 1×** — 80px/1× crop is a smudge; at 3× DPR it articulates. Non-retina 5rem is the failing case | `sun-80px-light.png` vs `hidpi-` |
| S3 | sparkle diamonds invisible at rendered size | **CONFIRMED** — invisible at 1×/80px; marginal pale smudges even at 3× | both 80px crops |
| S4 | disc is the only compass-drawn primitive | **CONFIRMED (DOM)** — `.sun-disc circle` present live | statics13rem.discIsCircle |
| S5 | inner ray line = edge dirt at 80px | **PLAUSIBLE** — consistent with the 1× crop's dirty ray edges; not separately discriminable live | `sun-80px-light.png` |
| M1 | lower horn blunt/chopped | **CONFIRMED** — plainly visible at 208px dark: upper horn tapers, lower horn ends as a wedge | `hidpi-moon-208px-dark.png` |
| M2 | cracked upper tip (crease/notch at cusp) | **CONFIRMED** — the doubled-over notch renders live at 208px | same shot |
| M3 | white dot stars are chromatic strays | **CONFIRMED (DOM + pixels)** — three `#FFFFFF` circles live in the moon SVG; perfect circles among wobbled polygons, white-vs-butter split visible at 208px | statics13rem.whiteDotsInsideMoonSvg |
| M4 | incoming moon ghosts over still-light paper during the 800ms crossfade | **REFUTED AS STATED, re-scoped** — `html.dark` lands ~4ms after click and body has **no** color transition (`bodyTransition: "all | 0s"`), so paper snaps dark on frame 1; the incoming moon never sits on light paper. The moon-on-light exposure exists only in the **dawn** direction, on the *outgoing* shrinking crescent (~scale ≤0.5 past 230ms, `dawn-230ms.png`) — smaller and briefer than F4 implied. F4 already marked the fix optional; this downgrades it further | probe-darkflip + dawn frames |
| F4-F1 | filter bound only to active icon | **CONFIRMED (live DOM)** — sun `filter="url(#wobble-celestial)"`, moon `null` in light theme; outgoing exits filterless after the flip re-render | statics13rem |
| F4-F2 | `#storybook-texture` has zero consumers | **CONFIRMED** — grep over `src/` returns only the definition (`SvgFilters.vue:164`); live DOM: def present, `[filter*="storybook-texture"]` → **0** consumers | grep + DOM |

**Net for F4:** the replica harness was faithful — every geometry/legibility claim that could be
checked live held. Its one refuted row (M4) was a *transition-context* claim, i.e. exactly the
category a static replica can't see. The W10 "F4 slight pass" specs (W1, S1-S3, M1-M3) go into
authoring on live footing; M4's optional stroke-deepening should be re-argued against the dawn
direction or dropped.

## 2. F5 (sun↔moon transition) — code-only claims, now live

Raw dynamics: `toggle-results.json` §transition (rAF-sampled opacities over 1s post-click),
`probe-darkflip` (theme-flip latency), frames `transition-{120,300,500}ms.png`, `dawn-*.png`.

| F5 row | Claim | Live verdict | Evidence |
|---|---|---|---|
| §1 CSS table | inactive pose `translateX(-50%) rotate(-270deg) scale(0.1)`, opacity 800ms +100ms delay / active 300ms, spring transform 800ms | **CONFIRMED verbatim** — computed inactive transform `matrix(0, 0.1, -0.1, 0, -104, 0)` (≡ that pose at 208px), transitions `opacity 0.8s cubic-bezier(0.4,0,0.2,1) 0.1s, transform 0.8s cubic-bezier(0.34,1.56,0.64,1)` / active `opacity 0.3s` | computed styles, live |
| D1 | exit target == entry origin (same leftward spiral, no horizon story) | **CONFIRMED** — one shared inactive pose measured; both icons use it | computed styles |
| D2 | ~300ms double-exposure, both near-opaque | **CONFIRMED, with a nuance** — measured max co-opacity **0.93 at 269ms**, both >0.5 for **~247ms**; at 120ms both mascots visibly co-present and overlapping (`transition-120ms.png`). Nuance: past ~250ms the outgoing is at ~scale 0.1 and half-translated off, so the tail of the overlap reads as a smeared speck (`hidpi-transition-250ms-208px.png`, orange dot at left edge), not two stacked mascots. The muddle is real but front-loaded | rAF samples + frames |
| D3 | world flips before the mascot moves | **CONFIRMED** — `html.dark` lands on the **microtask** after click (~4ms; sync read is `false`, microtask read `true` — F5's "instantly on click" is one tick loose, immaterial), body color snaps (no transition), and at 120ms the paper is full night while the sun is still mid-exit | probe-darkflip + `transition-120ms.png` |
| D4 | outgoing loses wobble at flip (filter only on active) | **CONFIRMED** — live DOM filter attrs; outgoing crossfades filterless | statics13rem |
| D5 | stars welded inside the moon SVG | **CONFIRMED** — 3 star polygons + 3 dot circles are children of `.toggle-moon` live | statics13rem.starsInsideMoonSvg |

**Net for F5:** all five defects live-verified; the Set-and-Rise spec's premises hold. The D2
nuance slightly *strengthens* the spec's case: what the eye gets today is neither a clean
crossfade nor a readable exit — an overlap muddle for ~250ms, then a speck.

## 3. F6 (game-switch) — code-only claims, now live

Instrumented swap (MutationObserver + per-frame poll), `switch-results.json`.

| F6 row | Claim | Live verdict | Evidence |
|---|---|---|---|
| §1.5 | the switch is an unchoreographed hard cut | **CONFIRMED** — menu item click at t=0: menu card and the entire sudoku scene detach at **t=6ms, same frame**; `board-shell` count 0 during t=6-20ms (blank paper); futoshiki mounts at **t=20ms**; the outgoing grid's `stroke-dashoffset`s never moved (`eraseObserved: false`) — no erase beat of any kind | switch.events + firstSamples |
| D1 | menu close is instant, no leave motion (the `:94` comment cites a phantom) | **CONFIRMED** — open plays `logo-menu-in 250ms` (computed animation observed); close is a same-frame v-if pop (gone by 6ms) | menuOpen + menuGoneBy |
| D2 | switch-back replays the full cell reveal wave | **CONFIRMED** — futoshiki→sudoku switch-back: **24 cells** took `.cell-reveal-animated` with **24 running animations** at peak, on a remount with no new puzzle | switchBackRevealWave |
| D3 | first futoshiki select renders nothing during the chunk fetch | **CONFIRMED, dramatically** — fresh context, throttle applied *after* initial load (CDP 30KB/s, 500ms latency): blank board area with **no loader, no loading text, zero `board-shell`** at 150/400/800/1500/3000ms; `first-select-void-400ms.png` shows the wordmark reading "futoshiki" over pure empty paper. On the untrottled localhost path the void is ~14ms — invisible locally, which is why it survived; on any real network it's the F6 spec's ScribbleLoader case | firstSelectThrottled + shot |
| D4 | draw-in with no erase (one-armed gesture) | **CONFIRMED** — erase never fired on the switch path (above); the enter draw-in on mount is undisputed (A23's settled shots + code) | eraseObserved: false |

**Net for F6:** every defect live-verified. The "turn to the next exercise" spec's factual
substrate is sound; D3's throttled void is the strongest single argument for the beat-2
chunk-preload row.

## 4. Contradiction settled: F7 vs F4 on `#storybook-texture` (synthesis item 14, adjacent)

One grep settles it, as predicted: `grep -rn "storybook-texture" web/frontend/src/` → exactly one
hit, the definition (`SvgFilters.vue:164`). Live DOM concurs: def present, **0** elements
reference it. **F4 is right (dead filter def); F7's "used by the celestial mascot" (F7:50, :133)
is false** — the celestial mascot uses `wobble-celestial` (live DOM, §1). F7's felt-nap plan for
the heart should cite the filter as *available-but-unconsumed*, and the W3/W7 dead-surface sweep
can excise or adopt it deliberately.

## 5. The evidence-basis ledger (every design row tagged, per the A24 G10 mandate)

| Lane | Pre-G10 basis | Post-G10 basis |
|---|---|---|
| F1 (dropdown border) | LIVE — Playwright vs :3011, px-measured (design-f1:3-5) | LIVE (unchanged; not re-probed — already pixel-footed) |
| A23 (UI completeness) | LIVE — Playwright vs :3210 + own :3210 instance | LIVE (unchanged) |
| F2 (completion formulation) | CODE + owner shots (static) | CODE + owner shots — no live-contingent claims; contrast math is arithmetic. No re-probe needed |
| F3 (completion metadata) | CODE-ONLY | CODE-ONLY — structural/a11y analysis, no pixel claims. No re-probe needed |
| F4 (toggle SVGs) | REPLICA HARNESS (offline byte-identical render) | **LIVE-VERIFIED** — all rows confirmed except M4 (refuted as stated, re-scoped to dawn-direction outgoing; was already optional) |
| F5 (toggle transition) | CODE-ONLY (disclosed at F5:3) | **LIVE-VERIFIED** — D1-D5 + the §1 CSS table all confirmed; two nuances (D3 microtask, D2 overlap-then-speck shape) |
| F6 (game switch) | CODE-ONLY (disclosed at F6:3) | **LIVE-VERIFIED** — cut + D1-D4 all confirmed, incl. throttled D3 void |
| F7 (heart) | CODE + owner shot | CODE + owner shot, **one row refuted** (`#storybook-texture` consumer claim, §4); heart path geometry remains code-inferred (heart not probed — it renders on solve; A23's `heart-zoom-*.png` cover its at-size read) |
| F8 (design-system statement) | SYNTHESIS of F1-F6 + computed contrast | inherits the upgrades above; its F7 omission (G9) still stands and must be re-folded before authoring |

## 6. What this means for the wave plan

- **T3-W10's dependency "pass-2 live re-probe (G10)" is satisfied.** F5's set-and-rise, F4's
  slight pass, and F6's page-turn all enter authoring on live-verified premises. No spec row
  collapsed; one (F4-M4) was refuted-as-stated and was already optional.
- **Corrections to carry into authoring:** (a) M4 re-scoped to the dawn-direction outgoing
  crescent or dropped; (b) F5-D3's wording "instantly on click" → "on the following microtask,
  ~4ms" (the deferred-flip design is unaffected); (c) F7's storybook-texture line must not be
  cited as precedent for the felt-nap treatment — the filter is defined but dead.
- **Process row (A24 G10 ADOPT):** the ":3000" instruction in lane briefs should name the app
  port explicitly or say "the running Vite instance (check `lsof`)" — the HMR-socket-on-3000
  shape (`vite.config.ts:206-209`) will keep eating lanes that trust the brief. The hmr.port
  pin itself is a candidate for the W7 hygiene sweep: it only exists to keep HMR on a fixed
  port, and it desynchronizes from `--port` overrides by construction.
- **Throttled-D3 shot** (`first-select-void-400ms.png`) is the exhibit for the W7 e2e row's
  chunk-preload gate: assert a loader or a mounted shell within N ms of select under throttle.

*All figures measured this session (2026-07-10) against localhost:3210, repo at working tree of
`5f9980c8`+dirty, Apple M5 Max, headless Chromium via the frontend's own Playwright install.*
