# pass7/instruments — the ONE copy of each instrument every pass-7 lane runs

The chair's instruments lane (Opus, batch 0; registry-v6 §8.0 act 6, §3.9; LAWS P6 §I), 2026-09-23.
There are six instruments. Each was run on the control `74a2b5d9` (its born-RED) and against its plants
in the same batch, in both engines. Every exit code below is bare (unpiped). The last battery ran on the
FINAL files' sha1 (§7, `MANIFEST.txt`), so every row in §7 is a reading of the code banked here.

The instruments are Node ESM modules that drive Playwright 1.61 as a library. Each one is a library
that a lane imports into its own spec, and also a CLI. Playwright resolves from `web/frontend`
(`FE_PKG` overrides this). No lane worktree, and no main `src/e2e/scripts` file, was written.
The scratch trees are `git archive 74a2b5d9` plus the pass-6 bank, created by
`<scratchpad>/instr7-mktree.sh` under `<scratchpad>/instr7-{verb,ledger,self,face}`. The control was served
read-only through its own `.vite-control.config.ts` and was never git-touched.

| tree | what | served | identity |
|---|---|---|---|
| control | `.claude/worktrees/w7-control` dist | :4230 preview | `index-CubiZsMVSwTc.js` |
| VERB | 74a2b5d9 + `pass6/prototype/MOT-VERB/pass6.diff` | :4231 preview | `index-ICe9_X4WHUBR.js` |
| FACE | 74a2b5d9 + `pass6/prototype/CTRL-FACE/pass6.diff` | :4232 preview | `index-x0ZH4Sjqstwx.js` |
| SELF | 74a2b5d9 + `pass6/prototype/PLR-SELF/pass6.diff` | :4233 **dev** (`?wire=local` is DEV-only) | dev |
| LEDGER | 74a2b5d9 + `pass6/prototype/NOTE-LEDGER/pass6.diff` | source only | — |

All four banks `git apply --3way` exit 0. Payloads: GA1's pinned board
`ATMuMDM0NjA4OTEy…MTcw` (71 givens, read back through the aria corpus in every post-paint row); FACE's
critic's `ATMuNTMwMDcw…MDc5`.

**Box load: 13–52 (1-min) throughout.** A foreign workload shared the box: rustc and other headless
chromes. The load is printed on every line. Every timing number here is a loaded-box reading.

| # | instrument (this dir) | from | what it is |
|---|---|---|---|
| 1 | `painted-frames.mjs` | INTAKE-23 row 7 / M20 D7; `intake-owner-2026-09-23/prototype/G-TOGGLE/instruments/selftest.mjs` (the chromium CDP screencast) | Three tracks on one epoch clock: the photographs (chromium CDP screencast, every compositor frame; WebKit `page.screencast`); the painted timeline (rAF plus a post-paint subject read); and the rAF-frozen photograph ladder. It reports per-frame Δ, held intervals with their times, a PLANT-SEEN verdict, a self-test (a CSS spinner and a main-thread mover), and the box load |
| 2 | `postpaint.mjs` | `pass6/critique/MOT-VERB/instruments/ga1crit.spec.ts` | Reads each frame three ways side by side: in-rAF (the negative arm), POST-PAINT (a MessageChannel task queued from the rAF, which is the gated read), and rAF2 (LAWS' `rAF(rAF(read))`). It gates F1 and the clock identity CI. PLANT skip is the negative |
| 3 | `edge-bands.mjs` (+ `paint-lib.mjs`, CLI `paint-probes.mjs`) | `pass6/critique/PLR-SELF/instruments/c7-edge.spec.ts` (`edgePaint`, top/bottom only) | Four bands against edge-OFF. A per-band core median must be ≥ 3.0. A dropped station counts as 1.00 and is never skipped. An empty band is RED. Each side is photographed at its own scroll pose, with the OCCLUDER named. The TOP-ONLY reading is printed beside. Plants X6, X4, FADE15 (plus an X5 sensitivity row) |
| 4 | `glyph-pop.mjs` (+ `paint-lib.mjs`, CLI `paint-probes.mjs`) | registry-v5 §2.11 statistic; `pass6/critique/PAL-TIN/instruments/plant-faint-text.diff`; COUNT's TAIL rows | The whole glyph population (ON vs text-transparent, pixel for pixel). Clauses: G1 empty/thin (< 40 px) RED; G2 absolute median ≥ 4.5; G3 the fraction under 4.5 ≤ bound; **G4 a per-slice core, the TAIL clause** (new, §4). Plants FAINT30, FADE65, FADE80, TAIL12, TAIL35, EMPTY |
| 5 | `shape-census.mjs` (library) · `reserve-law.mjs` (the seed's law on it) · `shape-plants.mjs` (battery) | `pass6/critique/NOTE-LEDGER/instruments/reserve-law.PROPOSED.mjs` | The SHAPE law's reader: every site a declaration can reach a subject from, keyed on the SUBJECT COMPOUND; one colour parser; token resolution with stems; string-aware strippers. 19 plants and 1 negative-negative, plus a 24-row self-test |
| 6 | `rest-probes.mjs` | `pass6/critique/CTRL-FACE/instruments/park-stuck.mjs`; `pass6/critique/PLR-SELF/instruments/c6-crit.spec.ts` (C2, C3) | Four probes. `atRest` means `getAnimations()` is empty over two frames, then a post-paint beat. UN-PARK: act, rest, perturb, rest, then published vs truth. RESIZE AT REST: open at A, resize to B, compare against a fresh open at B. The RELABEL touch plant. ROW TAP KEEPS FOCUS |

## 1 · painted-frames.mjs — the painted-frame recorder, both engines

`node painted-frames.mjs --engine chromium|webkit --url <u> --trigger load|key:<k>|click:<sel> --subject <sel>|css:<sel>:<prop> --roi <sel> [--plant busy:<ms>@<delay>] [--runs n] [--held 50] [--ladder K]`.
Exit codes: 0 GREEN; 1 RED (a held interval ≥ `--held`, or an EMPTY motion window); 2 the self-test clock is < 55.

**The self-test (printed before every reading).**

| engine | photographs/s | rAF/s | clock | verdict |
|---|---|---|---|---|
| chromium | 92–94 (gap median 8.5–8.7 ms) | 120 | photographs | OK |
| webkit | **20–22** (gap median 44.6–49.9 ms) | 60 | the rAF timeline | OK on rAF |

WebKit's photographs are throttled, so they are a coarse witness and never the WebKit clock. Chromium is
gated on photographs. WebKit is gated on the post-paint SUBJECT track, and its photographs are printed beside.

**Readings** (control unless named; `load` = boot draw-in with subject `css:path.frame-line:stroke-dashoffset`,
ROI `.hand-drawn-grid`; `g` = the fold with subject and ROI `.board-peek-host`). This table is round 2
(×3 runs). The final battery (×2 runs on the banked sha1) reproduces every verdict (§7).

| motion | chromium | webkit |
|---|---|---|
| boot draw-in, clean (**the born-RED: M20's bake stalls**) | **RED 3/3**, max held (photo) 91.1–96.4 ms, two held intervals per run of 70–105 ms at +100…+235 ms | **RED 3/3**, subject held 113–152 ms |
| draw-in + busy 150 ms @300 | **PLANT SEEN photo YES 3/3** (150.0 / 150.0 / 150.8 ms at +319…+326) | **PLANT SEEN subject YES 3/3** |
| fold `g`, clean | **GREEN 3/3** (max held 16.9–25.9 ms; 47–48 changed photographs in ~500 ms) | **RED 3/3** on the subject track, 75 / 89 / 85 ms at the fold's start (+183…+208). WebKit's gap after frame 1, as VERB's critic read it (40–66 ms on a quieter box). **VERB's tree reads this row GREEN** (final: 31 moved, max gap 19 ms), which makes it a born-RED that the §13 tree cures |
| fold + busy 150 ms @450 | photographs **NOT held** (max 17.5–32.3 ms) while rAF 141.6–150 ms and subject 152–158 ms | subject YES / rAF YES 3/3 (153–160 ms); photographs too coarse |

**Finding (declared and load-bearing for every motion row): the fold is compositor-driven in chromium.**
A 150 ms main-thread stall mid-fold paints NO held frame, and the photographs keep changing every 8–17 ms.
Any track read on the main thread over-reports it as a 141–158 ms hold: the rAF timeline, the post-paint
subject read, or a `performance.now()` clock. The same holds for the theme turn, where `body` background and
the board ink moved through a 150 ms stall (`logs/1-recorder.txt`, round 1). So a busy-loop plant proves the
instrument only on a MAIN-THREAD motion, which is the draw-in (JS rAF `stroke-dashoffset`). **WebKit has no
per-paint photograph** in this Playwright build, so its held-frame clause is a main-thread reading. On a
composited WebKit motion it can red where paint did not hold. A WebKit composited-motion row states this, or
reads the ladder.

**The ladder** (`--ladder 3`, WebKit, the fold). Frame 1 is the first rAF where the subject carries a
running OR paused animation, so a held first frame counts. VERB tree: k1 ct 0, rect 640 (at rest, the held
frame); k2 ct 22 / 26, w 605.8 / 597.3; k3 ct 29 / 39 (round 3 / final). Control: k1 **ct 38 / 52, w 573.6 / 545.0**
(the frame-1 skip); k2 ct 68 / 76; k3 ct 82 / 122. An earlier cut counted only `running`, so it started a frame late on VERB. It was re-cut, and
the rows above are the re-cut's.

## 2 · postpaint.mjs — the post-paint sampler (§2.5)

`node postpaint.mjs --engine chromium|webkit --url <u> [--plant skip] [--cells desk,phone] [--reps 2]`.
There are four runs per arm: 1280×800 fine and 390×844 coarse (witnessed), two reps each. F1 = frame 1
within 3 px of rest (centre and width). CI = `ct(frame k) = tl(k) − tl(frame 1) ± 2 ms` for k = 2, 3.
Gated: F1 post-paint in both engines, CI post-paint in chromium.

| arm | tree | F1 RED: post · inRAF · rAF2 | CI RED post | exit |
|---|---|---|---|---|
| clean | VERB | 0 · 0 · 0 (chromium) / 0 · 0 · 0 (webkit) | chromium **1/4** in rounds 1 and 2, **0/4 final**; webkit 0/4 (printed) | round 2: 1 · 0; final: 0 · 0 |
| **PLANT skip** | VERB | **4 · 0 · 0** (chromium) / **4 · 0 · 0** (webkit) | 4/4 · 4/4 | **1 · 1** |
| clean | control | 4 · 4 · 4 / 4 · 4 · 4 | 4/4 · 4/4 | **1 · 1** (born-RED) |

- **The required reading.** Under PLANT skip the post-paint F1 reads **ct 150, centre 142.93 px, width
  −280.38** (chromium desk; webkit 142.89). At the phone it reads 48.06 / 48.0 px. The in-rAF read of the same
  frame says **ct 0, centre 0.00: GREEN 4/4 in both engines**. That is the hole GA1 had, reproduced and closed.
- **The control's born-RED.** Frame 1 is already 8.2–8.9 ms in, at 92.89 px (desk) / 21.5 px (phone) in
  chromium, and 37–53 ms in, at 105–123 px, in WebKit. In WebKit the in-rAF rect is not the post-paint rect
  on the same frame (112.9 vs 122.66, 105.05 vs 112.37), which is VERB's critic's finding reproduced.
- **VERB's own row (booked to MOT-VERB row 1).** Chromium 390×844 coarse, 1 of 4 in rounds 1 and 2 and
  0 of 4 in the final run (so it is intermittent, and VERB's ≥ 5-run rate law applies): post-paint
  frame 2 reads **ct 0 again** (off −8.9 ms) while the in-rAF read of that frame says ct 8.7. The hold
  re-held on frame 2, so the first pose painted twice. Only the post-paint read can see this.
- **The LAWS' spelling reads the wrong frame (booked to the chair: LAWS P6 §D).**
  `requestAnimationFrame(() => requestAnimationFrame(read))` runs at the start of frame k+1, after that
  frame's animation update. For a WAAPI subject it reports frame k+1's time, and CI reds on the CLEAN tree:
  2–4/4 in chromium and 4/4 in WebKit (final: 4/4 · 4/4). The gated read here is a MessageChannel task queued from the rAF.
- **WebKit's CI is printed and not gated.** In round 1, WebKit's post task read ct 23–30 with the rect still
  at rest on the clean VERB tree (the task ran after the next animation-time update). In round 2 it read
  ct 0, 0/4. Until that is explained, WebKit's clock identity is read on §1's ladder.

## 3 · edge-bands.mjs — the four-band edge probe (§2.9)

`node paint-probes.mjs --probe edge --engine … --scheme … --url <u> --subject <box> --edge <edge el> [--plants] [--dpr 2]`.
Exit codes: 0 clean GREEN and every required plant RED; 1 clean RED; 3 a required plant GREEN (a hole); 4 both.

| subject (control, 1280×800 fine, PRM) | light cr / wk | dark cr / wk | exit |
|---|---|---|---|
| `.drawer-case` (the card's drawn frame), clean | 17.359 / 17.197 on all four bands | 14.619 / 14.619 | 0 ×4 (+ chromium DPR 2: 17.359, n 520/974) |
| — **X6** `clip-path: inset(-8px -8px 16px -8px)` | **bottom 1.00** (261 of 261 stations dropped) while **topOnly GREEN** | same | RED ×4 |
| — **X4** opacity 0.15 | 1.365 / 1.365 every band | 1.434 / 1.419 | RED ×4 |
| — **FADE15** ink `color-mix(currentColor 15 %)` | 1.365 / 1.365 | 1.415 / 1.434 | RED ×4 |
| — X5 opacity 0.4 (sensitivity, not required) | 2.566 / 2.535 RED | **3.196 GREEN** (a bright ink at 40 % clears 3.0 on dark lawfully) | — |
| **born-RED** `.new-game-zone` (the new-game well) | top/left/right 17.78 / 17.61; **bottom 1.00 at all three scroll poses (end · center · start), occluder `div.action-bar`** | 14.31; bottom 1.00, same occluder | **1 ×4** |
| **born-RED** `.corner-left .hover-card` (hovered) | **0 edge elements**; all four bands 1.00 | same | **1 ×4** |

On the control, the new-game well's bottom edge sits under the sticky action bar at every reachable pose at
1280×800. That is a control reading, booked to the §10 owners, and it is invisible to any top-band row. The
hover card is L5b's HEAD row seen in paint: its 2 px CSS border is not a drawn edge.

## 4 · glyph-pop.mjs — the glyph-population probe (§2.9)

`node paint-probes.mjs --probe glyph --subject <text el> [--plants] [--frac-bound auto|<n>] [--dpr 2]`.
`auto` = the CLEAN photograph's fraction + 0.05, taken before any plant, never from a planted element. The
exit codes are §3's.

**G4 is new, and the plants demanded it.** In round 2, TAIL12 (the last 12 % of the TEXT RUN at 25 % α) on
the heading "Size" read **GREEN in WebKit light**: median 4.592 ≥ 4.5 and fraction 0.489 ≤ 0.499. In chromium
light it was caught by G3 alone, at a margin of 0.004. A median and a fraction cannot see a short word's tail.
G4 cuts the population into 16 columns over its own x-extent, and every column with ≥ 8 px must keep its
core (p95) ≥ max(3.0, 0.4 × the whole population's p95). The p95 matters: a thin 'i' lowers a column
MEDIAN (2.28–2.67 in round 3's median cut, a false RED on the clean heading) but never its core. G4 is
relative, so it is never the only clause, and G2 stays absolute. Also, the first TAIL plant masked the
last 12 % of the BOX. The heading box is 268 px for a 52 px run, and the tag has 0.7 rem of padding, so
that plant faded no glyph. The plant is now keyed to the run's own pixels by a Range.

Readings (control, 1280×800, PRM, DPR 1 unless named; the full rows are in `logs/34-paint.txt`):

| subject | clean: pop · median · <4.5 | FAINT30 | FADE65 | FADE80 | TAIL12 | TAIL35 | EMPTY |
|---|---|---|---|---|---|---|---|
| `.section-heading` "Size", light cr / wk | 555 / 573 · **4.659** · 0.404 / 0.449 GREEN | 1.457 RED | 2.478 RED | 3.180 RED | RED (G3 + **G4 col 15: 1.36**) | RED | pop 0 RED |
| same, dark cr / wk | 557 / 594 · 7.681 · 0.235 / 0.249 GREEN | 1.777 / 1.771 RED | 3.898 RED | 5.329 → **G3 RED** (0.318 / 0.344) | RED (G3 + G4) | RED | RED |
| same, light DPR 2 cr / wk | 2004 / 2026 · 4.659 · 0.221 / 0.254 GREEN | RED | RED | RED | RED | RED | RED |
| `.new-game-zone .washi-tag` "new game", light | **chromium 2.911 RED (born-RED, T9-R8's rung)** · webkit 5.025 GREEN | RED | RED | RED | RED | RED | RED |
| same, dark | **chromium 4.185 RED** · webkit 4.873 GREEN | RED | RED | RED | RED | RED | RED |

FADE80 in dark keeps the median at 5.329, which is above the floor. Only the fraction clause (G3) reds it.
An absolute median alone would pass an 80 % fade on a dark ground. The tag's engine split (chromium 2.911 /
4.185 vs WebKit 5.025 / 4.873) is a painted reading of T9-R8's tag rung. It is cited, not re-cured.

## 5 · shape-census.mjs — the SHAPE-census library (§2.10) and the reserve law on it

`node shape-plants.mjs <web/frontend> <scratch> --seed <reserve-law.PROPOSED.mjs>` runs the battery.
`node reserve-law.mjs <web/frontend>` runs the law. The plants are in-memory overlays, so no tree file is
written.

| run | library law | the seed (PROPOSED) | exit |
|---|---|---|---|
| LEDGER tree, clean | GREEN: 1 voice site `MarginNote.vue:429 @media (max-width: 1023.98px) .margin-note: min-height inherit`; block 1.3em | GREEN | 0 |
| **control 74a2b5d9 (born-RED)** | **RED R1: the voice's min-height is set at 0 sites** | RED (0×) | **1** |
| E1 shadowed · E2 second `<style scoped>` · E2b compound override · E3 block 1px · E4 `!important` landscape | RED ×5 | RED ×5 | — |
| **S6 var-led token** (`min-height: var(--note-reserve)`, `--note-reserve: 0px` in index.css) | RED (R2 resolves to 0px) | RED | — |
| **S7 template `style=`** · **S8 `:style` object** · **S8b quoted key** · **S9 `:style` string** | RED ×4 | **GREEN ×4 (holes)** | — |
| **S10 script write** · **S10b concatenated `setProperty("min-" + "height")`** · **S10c computed key `style[k]`** | RED ×3 (S10b/S10c as UNRESOLVED sites, never dropped) | **GREEN ×3** | — |
| **S11 `:not()` tail** `.margin-note:not(.is-spent) { min-height: 0 }` | RED | RED | — |
| X public/ stylesheet · X index.html `<style>` · X `.tsx` write | RED ×3 | cannot see (not the SFC) | — |
| X Tailwind candidate `min-h-0` · X a CSS string holding `/*` before a real rule | RED ×2 | **GREEN ×2** | — |
| **negative-negative** `.margin-note-previous:not(.margin-note) { min-height: 0 }` | **GREEN** (negated, not the subject) | **RED (false)** | — |
| self-test | 24/24: 14 colour syntaxes to ΔE ≤ 0.61 (hex 3/4/6/8, rgb/rgba, hsl in deg and turn, hwb, lab, lch, oklab, oklch, `color(srgb)`, named, `color-mix`); var-led shorthand; subject compound; `:not`/`:is`; stems; `var()` fallback; both strippers; colour literals | — | 0 |

**The eleven escapes** (the SHAPE law's pass-6 list, the siblings that broke the re-cuts) are E1, E2, E2b, E3,
E4 (LEDGER's reserve law), the var-led value/shorthand (FACE's CHECK 7), the template `style=` attribute
(FACE), `:style` objects (VERB and GRAPHITE, quoted keys included), `:style` strings (VERB), script writes
(VERB and TIN, concatenated and computed keys included) and the `:not()` tail (VERB). **Every one is RED.**
The seed read 9 of the 19 plants GREEN and could not see 3 more. The estate siblings are also RED: `public/`
and `index.html` (WALK and TIN), a Tailwind candidate (WALK), a string-aware stripper (SIX), and `.tsx` (TIN).

What the library does NOT yet read (declared): `.json` tables (listed as sources, but not parsed for
declarations); `@import` chains; `<component :is>`, `defineAsyncComponent` and `h()` (SIX's font-census
shapes: a component census is a separate reader, and none was built here); element binding of script writes
(a write of the property ANYWHERE counts as a site, which is conservative); and a Tailwind table limited
to `min-h-*`, `font-*`, `overflow-*` and arbitrary colours. A lane that needs one of these extends THIS file
and ships the plant that reds it.

## 6 · rest-probes.mjs — resize at rest, un-park, the sequence guard (§2.11)

`node rest-probes.mjs --engine … --preset unpark|self-resize|control-resize|self-touch|control-touch --url <u> [--board <payload>] [--mode double|single] [--plant relabel]`.
Exit codes: 0 GREEN, 1 RED.

| probe | tree | chromium | webkit |
|---|---|---|---|
| UN-PARK, two presses of keys in one task, then root font 18 px | FACE | **RED**: `--action-bar-h` published **121 px vs truth 132 px** | **RED**: 121 vs 132 |
| UN-PARK, one press | FACE | GREEN (244 = 244) | GREEN |
| UN-PARK, two presses | control | GREEN (132 = 132) | GREEN |
| RESIZE AT REST: sheet open 390×844 → 390×800 | SELF (dev, 6 peers) | **RED**: at rest **4 rows, 7 cells lapped**; a fresh open gives 1 row, 0 lapped | **RED**, same numbers |
| RESIZE AT REST: dock drawer open 390×844 → 390×800 | control | GREEN (case 584 = 584, board 200 = 200) | GREEN |
| one tap on the mark (sequence) | SELF | GREEN, 1 toggle (`pointerdown:touch, pointerup:touch, click:touch`) | GREEN, 1 toggle (**no click at all** after the prevented pointerdown) |
| **+ RELABEL** (one `mouse` click per touch release) | SELF | **RED, 2 toggles** (false→true→false) | **RED, 2 toggles** |
| one tap on the drawer tab (± RELABEL) | control | GREEN / GREEN (1 toggle) | GREEN / GREEN; its native click is **`pointerType: "mouse"`** |
| ROW TAP KEEPS FOCUS (sheet open, tap row 2) | SELF | **RED: focus on BODY** | **RED: BODY** |

RELABEL is the plant the critic asked for. It gives WebKit's LABEL with iOS's DELIVERY in either engine: a
trusted touch click is swallowed and re-dispatched as `mouse`, and where the engine sends none, one is
synthesised 60 ms after the release. A guard keyed on `click.pointerType` toggles twice, and a guard keyed
on the SEQUENCE toggles once. The control's drawer tab (a plain click handler) stays at 1 under RELABEL,
which is the negative-negative.

## 7 · The final-sha1 battery (the files as banked; `MANIFEST.txt`)

All 61 exits are in `logs/0-final-exits.txt`. The sha1 at start equals the sha1 at end, which equals
`MANIFEST.txt`. Each row reads chromium · webkit, and every exit matches the instrument's contract.

| instrument | arm (tree) | exit cr · wk | what that exit means |
|---|---|---|---|
| 1 recorder | boot draw-in clean (control) | **1 · 1** | born-RED: chromium held 104.3 / 109.3 ms; WebKit's subject track held 300+ ms (2–4 moves in 335–368 ms) |
| 1 | draw-in + busy 150 @300 (control) | 1 · 1 | **PLANT SEEN** photo YES 2/2 (149.2 / 150.5 ms) · subject YES 2/2 |
| 1 | fold `g` clean (control) | 0 · **1** | chromium held 18.2–25 ms; WebKit subject 2/2 RED at the fold's start |
| 1 | fold + busy 150 @450 (control) | 0 · 1 | chromium photographs NOT held (18.3 / 25.1 ms) while rAF 141.5 / 140.4: the composited fold (§1) |
| 1 | fold `g` clean + ladder K=3 (VERB) | — · **0** | WebKit GREEN (31 moved, max rAF gap 19 ms). **The control reds the same row, VERB cures it.** Ladder k1 ct 0 w 640 → k2 ct 26 w 597.31 → k3 ct 39 w 573.64 |
| 1 | fold `g` clean + ladder K=3 (control) | — · 1 | ladder k1 **ct 52, w 545.01** → k2 ct 76 → k3 ct 122 |
| 2 post-paint | clean (VERB) | 0 · 0 | F1 0/4 · CI 0/4 in both (round 1 and 2: chromium CI 1/4, the frame-1 double-hold, §2) · rAF2 CI RED 4/4 · 4/4 |
| 2 | **PLANT skip** (VERB) | **1 · 1** | post F1 RED 4/4 · 4/4; **in-rAF F1 RED 0/4 · 0/4** |
| 2 | clean (control) | **1 · 1** | born-RED: F1 RED 4/4 in every arm |
| 3 four-band | card frame + X6/X4/FADE15, light · dark · DPR 2 | 0 · 0 (×3) | clean GREEN on four bands; every required plant RED; X6 topOnly GREEN |
| 3 | new-game well (control), light · dark | **1 · 1** (×2) | born-RED: bottom band 1.00 under `div.action-bar` at three poses |
| 3 | hover card (control), light · dark | **1 · 1** (×2) | born-RED: 0 edge elements |
| 4 glyph | heading "Size" + six plants, light · dark · DPR 2 | 0 · 0 (×3) | clean GREEN; FAINT30/FADE65/FADE80/TAIL12/TAIL35/EMPTY all RED (TAIL12 WebKit light: **G4 col 15 at 1.36**) |
| 4 | tape tag "new game" + six plants, light · dark | **1** · 0 (×2) | chromium born-RED 2.911 / 4.185 (T9-R8's rung); WebKit clean GREEN with every plant RED |
| 5 shape | `shape-plants.mjs` (LEDGER) | 0 | 19/19 plants RED · NN GREEN · self-test 24/24 |
| 5 | `reserve-law.mjs` control · LEDGER | **1** · 0 | born-RED on the control (0 voice sites); GREEN on LEDGER |
| 6 rest | un-park two presses (FACE) | **1 · 1** | 121 vs 132 px |
| 6 | un-park one press (FACE) · two presses (control) | 0 · 0 / 0 · 0 | 244 = 244 · 132 = 132 |
| 6 | resize at rest (SELF) · (control drawer) | **1 · 1** / 0 · 0 | 4 rows / 7 lapped vs a fresh 1 / 0 · 584 = 584 |
| 6 | self-touch (SELF): mark tap + row tap | 1 · 1 | the mark GREEN (1 toggle); **the row tap RED (BODY)**, both engines |
| 6 | self-touch + RELABEL (SELF) | **1 · 1** | 2 toggles |
| 6 | control-touch ± RELABEL | 0 · 0 / 0 · 0 | 1 toggle |

## Gaps, first

1. **WebKit has no per-paint photograph.** Its screencast delivers 20–22 frames/s. The WebKit painted
   clause is the post-paint subject track (a main-thread read), which over-reports a hold on a composited
   motion (chromium proved it: 141–158 ms "held" on the main thread while the photographs never held).
   INTAKE-23 row 7's "self-test ≥ 55 on the box" is met by chromium's photographs and by WebKit's rAF, but
   NOT by WebKit's photographs.
2. **The box was never quiet** (load 13–52, with a foreign rustc and chromes). The self-test clock held
   (92–94 / 60), but no timing number here is a quiet-box floor.
3. **G4's parameters** (16 columns, p95, 0.4×) were fitted on two subjects × two engines × two themes ×
   two DPRs. It took three cuts: a median cut false-RED'd a thin 'i', and a p90 cut over 8 columns missed
   TAIL12 in WebKit. A lane with a longer or wrapped run states its column count and shows TAIL12 RED on its
   own subject in-run.
4. **The post-paint CI is not gated in WebKit** (round 1: ct 23–30 with the rect at rest; round 2: clean).
5. **The shape library's unread shapes** are listed in §5. The component census (SIX's four shapes) is not
   built.
6. **The rest probes' presets are bound to SELF's and FACE's pass-6 trees.** Their library functions
   (`atRest`, `openThenResize`, `unpark`, `tapToggles`, `rowTapFocus`, `RELABEL`) are generic, and a lane
   imports them into its own spec with its own subject.
7. **No worktree was cut.** Act 6's "one worktree off 74a2b5d9" is met by scratch `git archive` trees in
   the chair's scratchpad (pass-6's precedent), each `git init`-ed there. No git ran in the control or main.

## Incidents (self-declared)

- The recorder's first WebKit round read **0 photographs** (WebKit's screencast timestamp is monotonic, not
  epoch). It was re-cut to align by the least-delayed arrival, and the rows above are the re-cut's.
- The first TAIL plant masked the BOX, not the run (§4). It was re-keyed.
- The first self-touch rows read a hidden duplicate mark (0 toggles). Its state reader now takes the visible
  element, and the rows in §6 are the re-run's.
- The first RELABEL relabelled only an existing click, and WebKit sends none. It now synthesises one.
- The four-band probe first read the well's bottom band as 1.00 without saying why. The occluder and the
  scroll poses were added, and the reading stands (`div.action-bar`).
- `rm` was never invoked. Scratch lives under `<scratchpad>/instr7*`. The four servers were killed by
  their recorded listener PIDs (78208 :4230, 80150 :4231, 80151 :4232, 20219 :4233).

## Replay

1. `<scratchpad>/instr7-mktree.sh <dest> <bank>`, then build with a two-line `.mts` (private cacheDir), and
   serve (`<scratchpad>/instr7/{verb,face}-{build,serve}.mts`, `self-dev.mts`).
2. Serve the control with its own `.vite-control.config.ts` on :4230 and verify `index-CubiZsMVSwTc.js`.
3. Run `<scratchpad>/instr7/bat-final.sh` (it prints `sha1-at-start/end`). The wrapper scripts
   `rec.sh`, `rec-load.sh` and `rec-deal.sh` fix the payload and subjects.
