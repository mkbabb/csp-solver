# MOT-LADDER · pass 5 PROTOTYPE

T9-W7 §13, the transition grammar. Worktree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59`
(the merged §13 tree, LADDER first in batch 3, VERB on top after this return). Base and π control
in every row: **`74a2b5d9`**. Second control for the owner's mark rows only: **main `1e6cfbbf`**,
served from a `git archive` scratch tree outside every worktree (own cacheDir), dist
`index-ChSrVSqM0j8q.js`.

Served arms, each verified by its own asset hash and never by a 200:
after **`index-C1yHADtfrqWN.js`** (css `index-5wEA1lZUVGOG.css`) on 127.0.0.1:4246 · control
**`index-CubiZsMVSwTc.js`** on :4237 (the chair's `w7-control`, untouched) · the exit-ballot variant
**`index-qLfHgNrWcGeR.js`** on :4238, then main `1e6cfbbf` on :4238. Every server killed by its
recorded listener PID; the band reads free at return (§8).

**The payload, stated.** Every browser row below loads
`?game=sudoku&board=` + `encodeSudoku(3, <the 71 givens pass 4 used>, 81)` (the estate's own codec,
`e2e/wire.ts`, CODEC_VERSION 1 + `3.<81 base-36 cells>`); the string is written into every reading
(`readings/*.json`, field `payload`), and π reads the given-set back from all three pages of every
pose: **equal in 16/16 poses** (8 × 2 engines).

---

## 0 · Numbers first

| reading | control `74a2b5d9` | after | engines |
| --- | --- | --- | --- |
| **π at rest**, 8 poses (4 playing light, 1 playing dark, 3 gallery DRIVEN incl. dark), three pages per pose | — | **0 keys on one side · 0 moved rects · maxΔ 0.01 px (gallery) / 0.000 (playing) · paint Δ opacity only** | both |
| π paint Δ (after vs control) vs the NEGATIVE arm (control vs control, same run) | — | opacity 0–10 elements vs 0–10 noise, every pose; **0 colour / background / border / font / line-height / tag / transform / filter** | both |
| the gallery face's `transform` (the `--live-fit` consumer) | `matrix(0.452358 …)` · `matrix(0.651877 …)` | **identical** at 1440 and 390, light and dark | both |
| **PRM**: rendered elements tweening under `reduce` | **62** | **16**, inherited 16, **unaccounted 0**; every rung `0s` | identical |
| `e2e/ladder-prm.spec.ts` (the class clause as a row, NEW) | **2/2 RED** (born-RED: no ladder) | **2/2 green** | both |
| **mid-gesture trace**, 15 gestures × 8 movers at 1×, with a control-vs-control arm | — | chromium 37 mover-rows within noise, 13 flagged · webkit 45 within noise, 5 flagged — every flag attributed in §3 | both |
| **exit ballot** `app-exit-last-rect.diff`, built as a second dist | wordmark exit 9.97 px @390 | **9.97 px @390 — the diff moves NOTHING** (§1 row 4) | both |
| GC1 ablation: strip the inline fit on the declaring host | board **672×672** spilling (main `1e6cfbbf` the same) | board **0×0** — the visible failure | both |
| filter census (the estate's spec, against this dist) | — | **12 passed** | both |
| goldens (`PLAYWRIGHT_BASE_URL` → this dist) | — | **4/4**, no re-mint | chromium |
| r6 `law-probe` (copied, re-pointed) | 6 GREEN · R1/R2/R3 RED | **identical** | — |
| r6 `hue-census` (copied, re-pointed) | — | **byte-identical output** | — |
| `lint:bands` **BARE** (CI's `--self-test`) | exit 1 (script absent) | **exit 1 — B8 = 5, every other check green** | — |
| `MOTION_LADDER_B8_OWNED=1 npm run lint:bands` (CI's exact lane) | exit 1 (absent) | **exit 0** | — |
| `--self-test` | — | **45 negative controls RED, 4 negative-negatives HELD, 0 vacuous** | — |
| break-tests on the tree, CI's exact invocation (sha1-restored) | — | **9/9 RED**, row 0 (the landed tree) exit 0 | — |
| bundle, css + js, against the control's dist | — | **+4,751 raw / +1,243 gz** (38 vs 37 files) — the merged §13 tree | — |
| `vue-tsc -b` | — | **0** | — |
| unit | — | **69 files / 837 tests, exit 0** (vitest 4.1.11; the floor is 729; main's 847 carries W8's tests, which the §13 tree does not) | — |

---

## 1 · The charter's ten rows

**1 · B6's escape classes carry their VALUE — CLOSED.** A RETUNE row now carries `to: <ms>` and
B6 REDs unless the shipped value IS that number; a MOVED row carries `newKey` and B6 REDs unless
that key is live (or is a bound character, `MOTION.characters.<name>`) at ≥ the banked value; both
classes are keyed on the SUBJECT (the rung, or the full `file :: selector :: term` site) and the
file-keyed exemption is gone; every escape row whose subject no longer needs it reds STALE. The
three live rows carry values: `rise` RETUNE `to: 520`; `.solve-failure :: refuse-shake` MOVED
`newKey: MOTION.characters.refuse` (600 = 600); `.sparkle-icon :: all` MOVED `newKey: … :: filter`
(200 = 200). The critic's four-edit commit is in the self-test in all three doors (no newKey /
newKey at 150 < 300 / a file-keyed valueless RETUNE) plus the lawful rename HELD, and it is
BREAK-TESTED on the tree through CI's exact invocation (`MOTION_LADDER_B8_OWNED=1 … --self-test`):
row 1 (MOVED, no newKey) **exit 1**, row 2 (newKey at 150) **exit 1**, row 3 (`rise` 520 → 100
behind `to: 520`) **exit 1** (B6 + B2 + G-DOCK-BAND), row 4 (`to:` deleted) **exit 1**
(`logs/break-tests.log`).

**2 · ONE `@property` block — CLOSED.** The seven nested inside `:root {}` are deleted; the
file-scope block in `index.css` now holds all seven rungs and `--live-fit` (eight registrations,
571 B in the built CSS). B3 reads registrations off the COMMENT-MASKED sheet at brace depth 0 only,
REDs on one found inside a brace, REDs on a `@property --motion-*|--live-fit` anywhere else in src,
and REDs on a `.ts`/`.vue` script that EMITS `@property` (the LEDGER stub's shape, NOTE-ERASE rows
I/E). Born-RED on the tree: `rise` re-nested → exit 1 (two findings: "published but never
registered" + "INSIDE a brace (depth 1)"); `--motion-note`'s block deleted → exit 1.

**3 · `lint:bands` BARE exit 0 — OPEN, and priced.** Bare exit **1 at B8 = 5**, the same five
sites. I tried the one cure that moves no pixel — `opacity 200ms ease` → `var(--verb-dusk-ease)`,
which IS `cubic-bezier(0.25, 0.1, 0.25, 1)` = CSS `ease` — and `lint:verbs` refused it (dusk does
not move opacity; the admission key goes stale), so it was reverted (`DarkModeToggle.vue` is
byte-identical to the bank, blob `acbb3f24`). Every other cure moves a curve on M15's surface; the
fixed-t price of the nearest house curve at each site:

| site | keyword | nearest house curve | max \|ΔP\| (t) |
| --- | --- | --- | --- |
| toggle star tuck, `scale 150ms` | `ease-in` | `--ease-accelIn` | 0.198 (0.635) |
| toggle star tuck, `opacity 100ms` | `ease-in` | `--ease-accelIn` | 0.198 (0.635) |
| toggle star pop, `opacity 120ms @560` | `ease-out` | `--ease-standard` | 0.177 (0.180) |
| toggle PRM crossfade, `opacity 200ms` | `ease` | `--verb-dusk-ease` (exact) | 0.000 — refused by `lint:verbs` |
| laminate PRM fade, `opacity 150ms` | `linear` | `--ease-standard` | 0.282 (0.550) |

MOT-VERB's charter row 5 carries these sites ("LADDER's row; you carry the sites"), so the env var
stays in `ci.yml` with its retirement condition and this table beside it; it dies in VERB's cure
commit. Not closed by this lane, said so.

**4 · The exit ballot — CLOSED BY FALSIFICATION.** Built `app-exit-last-rect.diff` into a second
dist (`index-qLfHgNrWcGeR.js`, one variable: `runFold` reads LAST one animation frame later) and
read every WAAPI mover's FIRST keyframe at the `Element.prototype.animate` seam. §7(h)'s three
numbers, both engines:

| | chromium tree | chromium +diff | webkit tree | webkit +diff |
| --- | --- | --- | --- | --- |
| wordmark rest distance @390×844 | 145.49 | 145.49 | 145.77 | 145.77 |
| wordmark EXIT travel @390 (target within 10 % of rest) | **9.97** | **9.97** | **9.97** | **9.97** |
| board host exit / entry @390 (target within 10 %) | 43.94 / 57.59 | 43.94 / 57.59 | 44.22 / 57.53 | 44.22 / 57.53 |
| desk 1440×900 wordmark exit / rest | 316.59 / 319.10 | 316.59 / 319.10 | 314.52 / 320.06 | 314.52 / 320.06 |

The diff changes nothing, in either engine, at either pose. Pass 3's mechanism (LAST read before
the playing layout exists) is **refuted**: one frame later the layout still holds the deck, because
the deck leaves on a 200 ms transition and stays IN FLOW until it unmounts. The residue is
145.49 − 9.97 = **135.52 px**, which is the census's "135.3 / 135.7 px drop at deck unmount" on
main. The cure is the deck out of flow during its leave — M19's P5-M19-2 (the fixed pin in
`@before-leave`), MOT-VERB's row — and this measurement is its born-RED: exit wordmark travel at
390 must land within 10 % of 145.5. **One measurement, two owners: LADDER measured it, VERB cures
it.** The ballot is WITHDRAWN (nothing to dispose); the diff is not carried further.
The rest geometry, re-read on current dists: 145.49 / 145.77 at 390 (pass 2's numbers stand) and
**319.10 / 320.06 at 1440** (pass 2's webkit 324.02 does not reproduce). Main `1e6cfbbf` (W8
touched the exit mover, C06): **identical to the tree in every cell, both engines** (390: wordmark exit 9.97, rest 145.49 / 145.77, host 43.94 / 44.22 against entry 57.59 / 57.53; 1440: 316.59 / 314.52 against 319.10 / 320.06; `readings/exit5-main-*.json`). W8's fold did not move the exit's declared travel, so the residue is on main too and the M19 cure is still open there.
**G-EXIT-MIRROR is struck from the record**: `check-motion-bands.mjs` never carried it (the
critic's count: fifteen checks, none is it); it was a row in the pass-3 synthesis's table only.

**5 · The PRM class clause as a GATE — CLOSED as an estate row; the CI half is O-12's.**
`e2e/ladder-prm.spec.ts` (NEW, in SPEC_MANIFEST, `PRM: frozen` via `emulateMedia`): the regime
witnessed; every rung `0s` at `:root`; every element still spending time under reduce inside
`.sun-moon-toggle` (the inherited residue, named by its occluder) and at most 16 of them (a CEILING,
never a count that grows); and the walk's own NEGATIVE CONTROL in the same page — a stranded 300 ms
transition planted after the read and FOUND. Tree **2/2 green**; control `74a2b5d9` **2/2 RED**
(no ladder: the rung row reads `''`). It cannot join a CI lane: O-12 (owner's standing ruling) makes
CI browserless, and the Playwright estate is local instruments — stated rather than worked around.
B5's static half (the CI half) is re-cut off the script's own constant: it now counts reduce-block
literal SITES on the tree against a ceiling of 2 and reds a PRM-FALLBACK row no site consumes
(STALE); its new control is one row consuming TWO reduce-block sites, which pass 4's
`fallbackRows.length !== 2` could not see.

**6 · The ballot re-cut on the matched series — CLOSED.** `dockPick` now prices only MATCHED cells
(travel spread ≤ 1 px across the six rounds): all four webkit cells (0.00 px) and none of chromium's
(24.9–56.8 px — the instrument's defect, stated at the rung). The rung's docstring, re-cut: worst
matched rate 440 6203 · 480 5725 · **520 5314** · 560 4994 · **600 4607** · 700 4011 px/s; the
ballot sentence "Choosing 520 over 600 is choosing 5314px/s over 4607px/s at the worst MATCHED cell
(768x1024, webkit)"; and 844×390's fact: webkit clears 2400 at 520 (2322) and chromium misses by
134 (2534, unmatched). G-DOCK-BAND gained a sixth clause that RECOMPUTES the sentence, its cell and
every ballot-table row from the series; controls: pass 4's chromium sentence → RED; right numbers,
wrong cell → RED; one table row falsified → RED; the break-test on the tree → exit 1. The series
itself is pass 4's (the dock's code did not move this pass; not re-audited — §5 gap 5).

**7 · The bundle ceiling — NOT MET; re-derived with the reason.** css + js against the control's
dist: **+4,751 raw / +1,243 gz** (css +2,392 / +288; js +2,359 / +955; 38 files vs 37, the
`glyphRegistry` chunk split). This is the MERGED §13 tree (LADDER + VERB); pass 4's +2,947 / +849
was LADDER's tree before the merge and is not separable now. What the ruled mechanisms cost by
themselves, measured in the built CSS: the eight registrations **571 B** (the @property law, chair
§6.5 — one registration alone is ~70 B, seven rungs ~500 B, so **+400 raw is unmeetable under the
ruling that requires them**); 58 `var(--motion-*)` reads replacing 5-byte literals (~+750 B); VERB's
six `--verb-*-ease` declarations 286 B and 47 reads. Paid down this pass: the gates' own
negative-control text had minted `.duration-300` and `.ease-in-out` into the SHIPPED CSS (Tailwind
reads every scanned word), and one line — `@source not "../../scripts"` — removes them and the
control's own dead `.inset-ring` (a script at 74a2b5d9 minted it too). RE-DERIVED CEILING, for the
chair: the ruled floor (registrations + rung reads ≈ 1.3 KB raw) + the verbs' tokens (VERB's to
state); the +400 / +150 figure predates the registration law and should be re-cut to it.
The commit shape (§4: ≤ 3 patches): still ONE delta in one tree; the bank of this pass's delta is
`pass5-ladder.diff` (§6).

**8 · The undefined-token census, knip, the R6 diff — CLOSED.** `lint:theme-tokens` on the tree:
151 custom properties declared in src; bare `var()` naming no declaration — **timing slots 0, any
other slot 0**; its three reverse controls fire. `--live-fit` resolves (registered + written by
`setProperty`) and the census's scope-blindness is VERB's row (PLANT B), not re-cut here.
`npm run lint:knip` **exit 0** on the tree and on the control (pass 4's "knip does not exist" was
a wrong invocation, corrected). The R6 MOVED diff is carried verbatim to
`instruments/R6-moved-rows.diff` with ONE change: law 4's `+` line names `dealStaggerMs` (homed this
pass). PROPOSED; r0 untouched.

**9 · Mid-gesture π and the four unrun instruments — CLOSED for the trace, the law probe and the
hue census; two r0 probes still unrun.** The trace (`instruments/trace5.spec.ts`): 15 gestures
(gallery in/out at desk, phone and landscape; card step both ways; theme flip at desk and phone;
dock open/close at phone and tablet; dock open landscape) × 8 movers, rAF-sampled from the input's
own `timeStamp` for 1.3 s, resampled on a 60 Hz grid, AFTER vs CONTROL with a CONTROL-vs-CONTROL arm;
a flag needs rect Δ > 2 × noise + 3 px or opacity Δ > noise + 0.10. Every flag is attributed in §3.
The r6 `law-probe` and `hue-census` ran on the tree and the control: identical. §7(l) theme flips ×6
at 4×, r1 `heading-voice.spec.ts` and r3 `wobble.probe.ts` did NOT run — §5.

**10 · The mark rows that are yours (M15/M19; INTAKE.md rows 42 + 43).**
- `--live-fit` **registered** in the ONE block (`<number>`, `inherits: true`, `initial-value: 0`),
  consumed BARE (`GameCard.vue`: `scale(var(--live-fit))`), the fallback struck, and the SCRIPT twin
  (`getPropertyValue("--live-fit")) || 1`, INTAKE row 33) now reds in B3 before VERB's fold can
  land it. GC1: the ablation on the declaring host (the inline fit removed from `.live-face-fit`)
  reads board **0×0** on the tree and **672×672 spilling** on `74a2b5d9` AND on main `1e6cfbbf`,
  both engines; π reads the face identical at rest. Break-tests 7 and 8 (fallback returns;
  initial 1) → exit 1. `elementFromPoint` at the face centre reads false on EVERY arm (the face is
  not a hit target) — a void read, dropped.
- `--deck-top` **NOT registered** — the adjudication (§2.1) and INTAKE row 42 refuse it (the pinned
  leave uses inline px); the charter's row named it. Followed the later, more specific brief; a
  fork for the chair only if it disagrees.
- **The deal's stagger homed**: `MOTION.dealStaggerMs: 90`, EXEMPT by cite (a delay, B9's axis),
  `GameGallery.vue` reads it; same 90, and π reads the deck identical. B11 learned that a `stagger`
  is a clock (read off its OWN line — the neighbour reading `MOTION.rungs.throw` had been homing it
  by context): the break-test (`stagger = 90` restored) → B11 RED at 1, sha1-restored.
- **App.vue:1228's 200 ms, the crib fold's 200 ms, the foot fade's 150 ms**: on this tree all three
  already read `var(--motion-leave)` / `var(--motion-leave)` / `var(--motion-whisper)` (pass 3/4);
  closed here by citation, not re-landed.
- **B6/`lint:bands` see the toggle's lengths**: 12 DarkModeToggle sites are banked in the ratchet
  and live on the tree (the whole Bloom: 340 / 800 / 300 / 100 / 150 / 120 / 1010 / 120 / 200 …).
- **GM-2, `MOTION.characters.bloom` with `park.scale` derived — NOT BUILT.** The adjudication
  REFUSES it outside T9-B11 arm B ("park 0.182 / twist on glass / crest 1.0802 /
  `MOTION.characters.bloom` … outside that arm (chair §1.3)"); derived in code, `park.scale` is
  0.182, not the shipped 0.06, so it is a re-time of a ratified pose. Its stated purpose (the
  ratchet sees the toggle) already holds (above). Charter row vs adjudication: **the chair's fork**.
- Two controls where W8 touched the surface: GC1 and the exit rows read on main `1e6cfbbf` beside
  the tree (above and §1 row 4).

---

## 2 · The owner's rows (U-10)

### T9-B11 — the dock's clock, `rise` 520 vs 600 (MOT-LADDER's, pass-5 rulings §1.3)

Ruling 1's 520 is the shipped default; 600 is one line away. The criterion prices the trade on the
MATCHED series (webkit): **520 = 5314 px/s, 600 = 4607 px/s at the worst matched cell (768×1024,
webkit)**. The ceiling is the owner's PARAMETER, not a finding; at the wave's own 2400 px/s no
audited clock clears (4011 at 700 ms) — the sheet travels its own height at the tall poses; at
844×390 webkit clears at 520 (2322).

| ceiling (px/s) | ≥6203 | 5725 | **5314** | 4994 | **4607** | 4011 | <4011 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| pick | 440 | 480 | **520** | 560 | **600** | 700 | none clears |

The frame (ONE crop, one variable): `t9-b11-dock-520-vs-600-webkit-light-768x1024-coarse-strip.png` (77 KB). Webkit · light ·
768×1024 · coarse (`hasTouch`) · the pinned payload · the dock's clock SUBSTITUTED on one dist (the
running animation's `effect.updateTiming({duration})`, recorded as `[520]` / `[600]`), paused and
seeked to 80 / 160 / 240 / 320 / 400 / 480 ms. Top row 520, bottom row 600. At every instant the 600
sheet trails the 520 sheet by roughly one control group. The 520 sheet is home by 400 ms; the 600
sheet is still settling at 480 ms. It
RETIRES pass 4's `frame-dock-520ms-webkit-768x1024-light-coarse.png` and
`frame-dock-600ms-webkit-768x1024-light-coarse.png` (pass4/SWEEP.md lines 36–37): two rest poses
that showed no clock became one strip of the clock. Recommendation, not a ruling: 520 (the shipped
default); the owner's eye on this strip is the deciding read.

---

## 3 · The mid-gesture trace, every flag attributed

Attribution is by a THIRD arm wherever one exists: main `1e6cfbbf` carries W8's C06 for real, so
a flag this tree shares with main is W8's C06 graft (the §13 tree carries it), not the ladder.

| engine · gesture · mover | A−C (noise) | attribution | owner |
| --- | --- | --- | --- |
| chromium · gallery-out desk · `.board-peek-host` | travel 325 vs 65, Δ298 (1.5) | **the C06 graft**: against main the same mover reads 351.5 vs 349.3 (Δ25 on noise 7.6) — the exit glides on main too | W8 (landed) |
| chromium · gallery-out desk · track, controls card | unmount-timing movers | C06, same gesture | W8 |
| chromium · gallery-out phone · masthead | 81 (30) | the in-flow deck leave (§1 row 4's 135.5 px): the wordmark's rest pose moves while the deck leaves | MOT-VERB (P5-M19-2) |
| chromium · dock-close phone · `.drawer-case` | 6.62 (0.62) | **unclaimed**: the drawer's close re-curve (VERB's `layDown` on the sheet) is the candidate; not proven | MOT-VERB, open |
| chromium · gallery-in landscape | the noise arm reads 10–40 px | not a finding: the control disagrees with itself | — |
| webkit · gallery-in desk · masthead | 5.96 (0.8) | small; VERB's `lift` on the wordmark's fade is the candidate | MOT-VERB, open |
| both · theme-flip desk + phone · `.toggle-icon.is-active` | opacity 0.18–0.83 (0.05–0.12), rect 1.7–4.3 px | REPRODUCED on a second run. The toggle's eleven beats are byte-identical to the control (`DarkModeToggle.vue`'s diff is ONE line, the button's `transform 200ms ease` → `var(--motion-leave) var(--verb-layDown-ease)`), which accounts for the rect delta (the press scale re-curved). The opacity delta rides `.is-active`, a selector whose ELEMENT changes at the flip: a one-frame offset in the class flip reads as up to 1.0. The first frame after the click lands later on the tree in 3 of 4 cells (chromium phone 21.7 vs 7.4 / 6.2 ms; webkit desk 47 vs 37 / 35; webkit phone 61 vs 35 / 28; chromium desk 5.8 vs 1.1 / 6.4). The candidate is the flip frame's style recalc with eight registered properties; not proven, and a per-element trace would settle it | open, §5 gap 3 |

**Tree vs main at gallery-out, webkit phone and landscape: 10 flagged.** The tree moves the track,
the centre card, the drawer case and the controls card (346–844 px) and so does `74a2b5d9`
(373 vs 360, 844 vs 814 at phone); main reads **0** on all four in both of its arms. Main's W8 fold
changed how the deck leaves in webkit at the handheld poses, and the §13 tree does not carry that.
It is a fold row for the chair (the §13 tree meets main at fold), not a ladder finding.
Frame gaps: chromium 10–18 ms max in every arm; webkit 16–31 ms at gallery-out and **50–127 ms at
the theme flip** (every arm, control included). Headless webkit samples a flip at under 10 fps, so
its flip rows carry that caveat. Readings: `readings/trace5-*.json`, `trace5-flip-*.json`,
`trace5-vs-main-*.json`.

---

## 4 · The pre-return battery (each bare; the control's exit code beside it)

Run after scratch deletion by `instruments/battery.sh`, each row unpiped. The control is the
read-only `w7-control` at `74a2b5d9`.

| row | tree | control `74a2b5d9` |
| --- | --- | --- |
| `lint:bands` BARE | **1** (B8 = 5, nothing else) | 1 (script absent) |
| `MOTION_LADDER_B8_OWNED=1 lint:bands` (CI's lane) | **0** | 1 (absent) |
| `lint:verbs` | 0 | 1 (absent) |
| `lint:motion` · `lint:copy` · `lint:lanes` · `lint:theme-tokens` · `lint:sleep` · `test:e2e:projects` | 0 · 0 · 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 · 0 · 0 |
| `eslint .` · `prettier --check` · `knip` | 0 · 0 · 0 | 0 · 0 · 0 |
| `lint:ink` · `catch` · `theme-selectors` · `live-regions` · `tdz` · `boundary` | 0 ×6 | 0 ×6 |
| `npm audit --audit-level=high` | 0 | 0 |
| `vue-tsc -b` | 0 | — (the control is never built) |
| vitest | 69 / 837, 0 | — |
| break-tests (`logs/break-tests.log`) | row 0 exit 0; rows 1–9 exit 1, every restore sha1-verified; the tree's write-tree after them equals the bank's (`56d78d71`) | — |
| B11 stagger break (the literal `stagger = 90` restored) | exit 1 (B11) | — |

GC2 (INTAKE row 43): over the §13 diff outside `pencilConfig`, the only added line that carries a
timing literal is `scene.css:612`'s `150ms`, a DELAY that is byte-identical on the control
(`controls-fade-in 250ms … 150ms backwards`) and sits on B9's axis. No duration literal is added.

---

## 5 · Gaps, the hard parts first

1. **`lint:bands` BARE is not 0.** B8 = 5 on the toggle and the laminate, and every cure but one
   moves a curve on M15's surface. The one exact cure, the dusk token, is refused by `lint:verbs`.
   Handed to MOT-VERB with the table in §1 row 3. The env var stays in `ci.yml` until then.
2. **The bundle ceiling (+400 / +150) is not met** and cannot be under the registration ruling: the
   eight registrations cost 571 B raw by themselves. The ceiling needs a re-cut, which is the chair's
   (§1 row 7). The merged tree's figure cannot be split between LADDER and VERB.
3. **The theme flip's toggle opacity delta is reproduced but not proven.** The first-frame lag is the
   candidate. A per-element trace (the rising and falling icon traced as elements, not through
   `.is-active`) would settle it. Headless webkit samples the flip under 10 fps.
4. **The exit residue is open on the tree and on main.** It is measured here and cured by VERB's
   P5-M19-2. The exit ballot is withdrawn, not answered.
5. **The dock series is pass 4's**, not re-measured. The dock's code did not move, and the strip was
   taken on the tree at 520 and 600 by clock substitution rather than by two builds.
6. **Unrun r0/r1/r3 rows**: §7(l) theme flips ×6 at 4×, r1 `heading-voice`, r3 `wobble`.
7. **`ladder-prm.spec.ts` is an estate row, not CI** (O-12). It ran against the built dist through a
   scratch config, not the dev server.
8. **GM-2 (`MOTION.characters.bloom`) not built.** The charter row and the adjudication disagree;
   it's the chair's fork.
9. **`--deck-top` not registered**, per the adjudication and INTAKE row 42. It conflicts with the
   charter row as written.
10. **Main's webkit gallery-out** differs from both the tree and `74a2b5d9` at phone and landscape
    (§3). It's a fold row, not this lane's.

---

## 6 · Replay route and the bank

No replay. At open, the tree's `git diff` (44 modified + 6 untracked, 50 files) was checked against
the chair's bank of the merged §13 tree (`pass4/prototype/MOT-VERB/pass4.diff`) through a temporary
index: **byte-identical, 282,146 B** — it disagrees with LADDER's own pass-4 README's "43 modified +
3 untracked" by exactly VERB's merged work, as the charter says it must. Nothing reset or rebased.
**The bank**: `pass5-ladder.diff` (54,057 B, 1,173 lines, 8 files, +718 / −97) =
(this tree) − (`74a2b5d9` + `pass4/prototype/MOT-VERB/pass4.diff`), cut through a temporary index
(`instruments/bank-delta.sh`, scratch excluded). **Apply-verified**: `74a2b5d9` + the pass-4 bank +
this diff, applied `--cached --binary`, writes tree `56d78d71`, which is the tree's own write-tree.
The files: `ci.yml` (the comment only), `e2e/ladder-prm.spec.ts` (new),
`scripts/check-motion-bands.mjs`, `scripts/check-pw-projects.mjs`, `src/assets/index.css`,
`GameCard.vue`, `GameGallery.vue` and `pencilConfig.ts`. `DarkModeToggle.vue` and `App.vue` are
byte-identical to the pass-4 bank (the dusk cure and the exit variant were both reverted). VERB works
on top of this bank. Nothing is committed.

---

## 7 · Instruments (copied, OUT re-pointed to this directory; none applied to a frozen path)

| instrument | what |
| --- | --- |
| `instruments/break-tests.sh` | the ten break rows on the tree, CI's invocation, sha1 restore |
| `instruments/battery.sh` | §2.11's battery, bare, tree and control |
| `instruments/trace5.spec.ts`, `trace-classify.py` | the fifteen-gesture mid-gesture π |
| `instruments/pi5.spec.ts` | π at rest, 8 poses, three pages (after / control / control) |
| `instruments/exit5.spec.ts` | the exit ballot's declared travel, tree vs variant vs main |
| `instruments/gc1.spec.ts` | the `--live-fit` ablation on the declaring host |
| `instruments/prm-roster5.spec.ts` | pass 4's roster, re-pointed (MOVED: control port) |
| `instruments/ballot5.spec.ts`, `ballot-strip.py` | T9-B11's seeked strip |
| `instruments/law-probe.copy.mjs`, `hue-census.copy.mjs` | r6's two, `FE` re-pointed |
| `instruments/R6-moved-rows.diff` | PROPOSED, the chair's |
| `instruments/bank-delta.sh` | the pass-5 bank through a temporary index |

---

## 8 · Incidents, self-declared

- **INTAKE.md was absent when the lane opened** (the pass-5 listing held adjudicate, census,
  critique, portfolio and prototype). It landed mid-lane (`intake-owner-2026-09-22/INTAKE.md`), and
  rows 42–43 were read then and are answered in §1 row 10.
- **vite wrote `.vite-temp/` into main's `node_modules`** through the worktree's symlink (the scratch
  configs' `cacheDir` was private, but vite's config bundling isn't covered by it). The directory
  is empty at return. No `npm install` was run anywhere.
- **The main control needed `csp-solver/data`** to build. The first archive held `web/frontend` only
  and the build failed. It was re-archived with the data and rebuilt; nothing else changed.
- **Two scripted edits went wrong and were caught by the gates**: a `sed` on `admits` renamed B1's
  loop variable, so `ledger` was undefined; and a slice duplicated `dockPick`. Both were fixed
  before any reading was taken.
- **B11 first read `stagger = 90` as travel**, by the neighbouring line's context. The rule was fixed
  to read a stagger's kind off its own line, and the break-test now reds.
- **The dusk-curve cure was attempted and reverted** (§1 row 3). `DarkModeToggle.vue` is
  byte-identical to the bank.
- **The GC1 `elementFromPoint` read is void**: the face isn't a hit target, so every arm reads false.
  The board rect is the reading.
- **Over-polling**: several Monitor and wait loops ran against the same logs.
- Servers: after (4246, PID 68361), control (4237, PID 68360), exit variant and then main (4238,
  PID 91213), with their npm wrappers 68296, 68297 and 91186, all killed by PID. `lsof` reads 4237,
  4238 and 4246 free. `web/frontend/.mot-ladder/` was deleted before the final battery. No port
  outside 4230–4249 was used.
