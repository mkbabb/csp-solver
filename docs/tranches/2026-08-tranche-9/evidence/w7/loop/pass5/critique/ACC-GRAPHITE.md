# ACC-GRAPHITE · pass-5 CRITIQUE (adversarial, non-author)

Critic: Opus, 2026-09-23. Base and π control `74a2b5d9`. I didn't write the charter or the prototype.
Read: pass-5 LAWS, pass-5/4/3 CHAIR-RULINGS, registry-v4 §2/§3.16/§5/§6.7, the charter, my
predecessor's pass-4 critique, the pass-5 README, the four frames, the tree's `git diff`, and the
pass-5 INTERDIFF (the tree against `pass4.diff` applied to a clean `git archive 74a2b5d9`: nine
files, 763 lines, exactly the eight edits the README lists plus the `lawA.test.ts` move).

**Convergence: 72% (68 at pass 4). Verdict: ADVANCE.** Streak 0. Not converged.

Replay: my rebuild of the tree (in-tree two-line config under `.accgcrit5/`, cacheDir in the
scratchpad, outDir in the scratchpad) is **byte-identical** to the prototype's cited dist
(`diff -rq` empty; `index-CelsBcwyiLkj.js`, 43 files). Served on :4240 beside the shared control dist
on :4241 (`index-CubiZsMVSwTc.js`), both ports verified by asset hash. Both listeners killed by
recorded PID (22371, 22380); the band 4230–4249 reads 0 listeners. The scratch config dir was moved
out of the tree (`mv`, no `rm`); the tree's `git status` is 18 modified + 2 untracked product files,
`git diff --stat` unchanged at +1183/−196. Every gate attack ran on a scratch COPY of the tree
(node_modules symlinked), never on the tree. Instruments and summaries: `critique/ACC-GRAPHITE/`
(`instruments/` 4 probes + config + battery; `readings/critic-readings.summary.json` 12.7 KB,
`readings/gate-attacks.txt`). No crop banked: the four ballot crops are the prototype's and I
looked at all four.

---

## 1 · Re-measured by me, both engines (tree dist vs control dist, one encoded payload each)

| row | prototype | mine | holds? |
|---|---|---|---|
| caret π (`span.logo-caret`, 6 futoshiki clue carets), 1280×800 dpr2, light + dark | 5 px both arms, 0 px differ | **5 px / 5 px, 0 px differ tree-vs-control AND 0 control-vs-control**, both engines, both themes (8 cells) | yes |
| given weight (declared π) | 6 vs 5 | **sudoku 30 givens 6 px vs 5; futoshiki 5 digit givens 6 vs 5**, all 8 cells | yes |
| tick-over-glyph, 16×16 ALONG (`mintBoard(4,76)`, 77 written, 24 ticks) | 431 / 451 px (2.22 / 2.33 %) | **431 / 19,378 (2.22 %) cr, 451 / 19,320 (2.33 %) wk at 60 levels**; sensitivity 40 / 90 levels: 471–494 / 386–394 px | yes, to the pixel |
| same, 9×9 (`mintBoard(3,30)`, 20 written) | 0 / 0 | **0 / 0 at 60 and 90 levels; 2 / 0 px at 40** | yes |
| the row's negative control, same run | ACROSS dist 113 / 100 at 9×9 | mine: the tally pushed inward (scale 0.94): **439 cr / 458 wk at 9×9** | the row can fail |
| perimeter median (the chair's statistic), integer α50 | 7 cr / **6 wk** desk, 4 / 4 phone | **7 / 7 desk, 4 / 4 phone** (top 3, bottom 4, left 7, right 7; identical on both arms, both engines) | WebKit's 6 does NOT reproduce |
| same, sub-pixel α50 (both crossings interpolated) | — | **6.45 / 6.45 desk, 3.457 / 3.461 phone** | — |
| band α50 (shipped 12+12), desk | 10.831 / 10.796 | integer **10 / 10**; sub-pixel **9.503 cr / 9.460 wk** (bottom side) | the number moves 1.3 px with the instrument (§2.1) |
| band α50, phone 393 coarse (hasTouch, `pointer: coarse` witnessed) | 6.273 / 6.251 | integer **6 / 6**; sub-pixel **5.815 cr / 5.844 wk** (top side) | same |
| control ring | 3.23 / 3.17 desk, 1.87 phone | sub-pixel 3.918–5.26 desk, 1.50–2.94 phone | — |
| pre-return battery, bare, tree / control | all 0 | copy-register 0/0 (0 dashes, 0 unadmitted) + self-test 0/0 · ink-pressure self-test 0/0 · lint:theme-tokens 0/0 · lint:lanes 0/0 · lint:sleep 0/0 · lint:motion 0/0 · test:e2e:projects 0/0 · check-pw-projects bare 0/0 (check 8 OK, 34 specs, 547) · `eslint .` 0/0 · prettier 0/0 | yes |
| r0 law probe (the prototype's copy), tree / control | 9 rows, L1 8 of 9 | **exit 0 / 0; L1 "sum to 8 (ceiling 9)"; R1/R2/R3 RED on both**; R1's tree sentence is the false one the prototype names | yes |

Not re-run by me (accepted as the prototype's, reproduced by pass-4's critic where the surface is
unmoved): the wash steps, painted AA, authorship, G4's decomposition, the junction-excluded rank,
the print row, `visual-regression` 11/12 vs 12/12, filter-census 6/6, vitest 843, vue-tsc.

## 2 · Gaps first

### 2.1 G2 is not just RED, it is instrument-defined; the chair's window is narrower than the instrument's spread (new)

The prototype's gap 1 stands (shipped 1.547/1.542 desk, 1.568/1.563 phone, RED). But the quantity
the window binds moves more with the instrument than any arm moves it:

- **The same painted band reads 10.83 px (prototype: fixed ink reference 37) and 9.50 px (mine: ink
  reference = the board's darkest 0.5 %, both crossings interpolated)**. A 1.33 px spread. The
  feasible desk window under the floors is 10.00–10.15 px, 0.15 px wide. Under my instrument the
  SHIPPED band is 0.5 px **under the ≥10.0 desk floor** it is said to clear.
- **The desk verdict flips with resolution.** Integer α50 (the resolution the chair's 7 px came
  from): 10 / 7 = **1.43, inside [1.35, 1.45]**. Sub-pixel: 9.503 / 6.45 = **1.473, RED**. The
  prototype's: 10.83 / 7 = 1.547, RED. The phone is RED under all three (1.50 / 1.71 / 1.568).
- **"WebKit's perimeter median is 6"** does not reproduce: 7 / 7 integer, 6.45 / 6.45 sub-pixel.
  The engines are identical on the frame; the 6 was the prototype's instrument.
- So the 8.75 u arm's "7 of 8 cells within 0.006–0.095 px" is a reading inside one instrument's
  noise, not a landing. **Closable sentence:** the chair names the INSTRUMENT with the statistic
  (the ink reference, the crossing method, one resolution for numerator and denominator), stamps
  it as one script both lanes run, and G2 is re-read once; until then no G2 margin under ~1.3 px
  is a finding.

### 2.2 This tree ships two per-frame front re-cutters it introduced, one at 2× the section's budget

The docstring is now true, which pass 4 asked for. The rate it states is a violation the tree
itself causes. The pass-4 diff (still in this tree) moved **`DifficultyTally`** from a
`stroke-dashoffset` style write to `:d="frontOf(d, i)"`, a fresh `poseFronts([d], …)` array per
call (misses the memo, re-parses) at the page's frame rate: **127.2/s at 128.6 Hz (cr), 95.8/s at
99.8 Hz (wk)** against the section's **62.5/s**. The file's own comment concedes the conversion is
"hygiene rather than a defect" (12 segments, under WebKit's ~128-segment dash restart). The join
ring's conversion cures a real WebKit fault (493 segments) and is equally ungated; its rate is
unmeasured (0 rewrites; the probe never formed the join). "Neither consumer here lands without
[the leader's] frontGate" is prose; nothing in the tree or the fold row enforces it (the
elegant-reduction trap: "and then the leader gates it"). **Closable:** revert `DifficultyTally`
to the dashoffset it had (no defect to cure there), or gate it in this tree with a
re-cuts-per-second row that reds at FRONT_MIN_MS 0; and measure the join ring in a formed room
(dev arm, two pages) at ≤ 62.5/s.

### 2.3 Three of the new gates can be passed on a broken tree (new)

All three born-REDs the prototype shows reproduce. Each gate is narrower than the claim it carries:

- **`check-theme-tokens` RETIRED reads index.css only.** `:root { --color-crayon-blue: #4a90d9; }`
  appended to `gameCell.css` → **exit 0** (the dead-token rule reads only `@theme`; the retired rule
  only index.css). The same re-mint inside index.css → exit 1. The graft's sentence ("an e2e
  `getPropertyValue` cannot keep a retired hex alive") holds for one file. **Closable:** the
  RETIRED scan walks every stylesheet and SFC `<style>` under `src/` (comments stripped), with the
  gameCell.css re-mint as its second self-test control.
- **The wash-step gate reads the `more` arm scope-blind.** `@media (prefers-contrast: more) {
  html.dark { --ground-wash-unit: … 3% } }` placed before the `:root` block → **exit 0**, and the
  gate PRINTS "more 12 % 1.281 dark" for an arm that paints 3 % at night. (A base `.dark` override
  is caught, by the ground-rank gate's per-theme rule, not by this one.) **Closable:** read each
  arm per theme scope (the cascade's winner for `html.dark` under each media arm), with the
  html.dark-3 % plant as a fourth self-test mode.
- **`gridPaths.tally.test.ts` cannot tell round from floor.** `Math.round` → `Math.floor` → **5/5
  pass**: every sampled `written · slots / writable` is an exact integer (56, 28). Under floor, one
  written cell on a 57-cell deal draws 0 ticks; under round, 1. **Closable:** one row at a
  non-integer ratio (writable 57, written 1 → 1 tick; written 29 → 28), shown RED under floor.

### 2.4 The caret closure has no landed gate (new)

The fix is real on the surface (§1). But reverting `HandwrittenGlyph`'s caret rule to `return 6`
passes **18 files / 209 tests** (`src/pencil`, `src/games/futoshiki`, DigitCell, PosterBoard,
posters), and the logo golden's locator still can't see `span.logo-caret` (registry §3.16). The
undeclared π pass 4 found can come back silently. **Closable:** a unit row on `HandwrittenGlyph`
(`value ">"`, `is-given` → stroke-width 5; a digit given → 6) shown RED on the revert.

### 2.5 The 16×16 tally has no room inside the frame (reproduced; open)

431 / 451 px at 60 levels, 386–494 across the 40/90 sensitivity, identical to the prototype's to the
pixel; 0 at 9×9. ACROSS collides at both 9×9 and 16×16. No width × inset arm clears (the
prototype's search, 59 px best). The ballot now honestly presents ALONG as NOT clear. **Closable
only by a form change** (e.g. the tally outside the frame, or a count glyph at 16×16), which the
owner picks; the clearance probe exists but is an evidence instrument, not an estate row.

### 2.6 Carried open, confirmed

- **AA rows are best-pixel ceilings.** The LAWS/§2.12 sensitivity row (50/70/90/100 % of median
  ink mass + fraction of columns under the floor) was not run on the band, the digit or the wash
  (prototype gap 5). With margins of 14.87:1 / 11.99:1 it will pass, but until it runs these are
  readings, not gates.
- **Law 39's third form is MOVED and its hunks have no carrier** (prototype gap 4): MRK-LIVE's
  pass-5 README refuses the tier-2/2×3 `fill: none` hunks and the `--color-focus-sketch` deletion.
  Naming this family as their owner "if the owner picks graphite" is conditional: at a fold where
  the owner hasn't picked, they belong to nobody. The chair's row.
- **`visual-regression` light RED on the tree, GREEN on the control** (11/12 vs 12/12, both
  engines): declared, with the fold row that applies pass-4's proposed spec diff. Open until the
  fold.
- **The R1 PROPOSED re-cut is vacuous under deletion** (new): it returns GREEN "RETIRED" whenever
  `--color-focus-sketch:` is absent. A tree that deletes the token and paints the ring with any
  chromatic hex lacking a dark arm reads GREEN. R1's law is about every chromatic token that paints
  in both themes; the re-cut should census those tokens (the ring's actual stroke token included),
  not the absence of one name. PROPOSED, not applied; the chair's row, but it is a gate re-worded
  to pass.
- **The chip at 393: no arm is free** (prototype gap 7; the frames show it). OUTSET-110 swallows
  the focused cell's grid line (0.33–0.5 px of paper). The arm is a CSS injection (`scale(1.1)` AND
  `stroke-width: 10`, the scale compensating the width: painted 6.189 vs shipped 6.273, −1.3 %),
  not a banked buildable diff, and the second change is stated only in the batch script, not in
  the caption. **Closable:** bank OUTSET as a PROPOSED product diff and caption both changes.
- **The join ring's rate** is unmeasured (§2.2), **the wash pair and the 8.75 u seam are unframed**
  (numbers only, to hold the cap), and **the wash drops HEAD's hue cue** (U-10, priced).
- **The wave is over its image cap** (3,428,754 B > 2,097,152 B, the chair's sweep).

## 3 · Checklist

- **Gates that cannot fail (on the claim they carry):** RETIRED outside index.css (§2.3); the wash
  gate's dark `more` arm (§2.3); round vs floor in the tally test (§2.3); the caret closure (no
  gate, §2.4); the R1 PROPOSED re-cut (§2.6).
- **Elegant-reduction trap:** the poseFronts rate handed to the leader's `frontGate`, which this
  tree doesn't carry, while this tree's diff created both ungated consumers (§2.2).
- **The constraint it forgot:** budgets are RATES per second (127.2/s vs 62.5/s, §2.2); the AA
  sensitivity row (§2.6); U-10's "both arms buildable" for OUTSET (§2.6).
- **Vacuous convergence:** G2's 8.75 u "landing" sits inside a 1.3 px instrument spread (§2.1).
- **Unverified gestalt:** the ballot crops exist for both engines and match their captions (I
  looked); the wash pair and the seam are unframed.
- **Clear:** π (caret 0 px, control-vs-control 0; everything else declared); filterBudget (L1 8 of
  9, the sparkle glow deleted; the census DARK arm is ACC-SIX's); M16 (0 / 0); the @property law (no
  registration in the diff); the undefined-token census (every new `var()` resolves: pencil-graphite,
  ground-wash-unit, user-ink, ease-ghostDraw, teacher-red, crayon-rose all declared); W2's landed
  mechanics (no scene/dock/tab/sticky file in the diff); the fallbacks (5 → 0, verified in the
  interdiff); generic-default tells (none). The decided history is booked MOVED (law 39, R1, R2,
  kinship), not reported STANDS.

## 4 · Strengths

- Every pass-5 number I re-ran reproduces: the dist byte-identical, the 16×16 collision to the
  pixel, the caret closure at 0 px with a zero noise arm, the born-REDs (ceil → 2 failed; the more
  arm at 3 % → exit 1; the index.css re-mint → exit 1). The battery is 0/0 on every row, bare.
- Pass 4's undeclared π is closed on the surface: carets keep 5, the printed weight is a digit's.
- LAW A now lives in one export the board calls, and the unit test holds that export.
- The return rejects its own optimism: it says where the idea dies (G2, the 16×16 frame) and that
  both need a ruling, not a re-cut. The incidents are candid, including the control-tree `git
  status` and the void CSS-injection run.
- G4 re-derived by decomposition (given-5 arm returns the deck to the control within 0.01 %), and
  the junction class named and excluded rather than argued away.

## 5 · Cross-pollination

- **The chair and every §3 lane:** a "× the frame" ratio needs one stamped instrument (ink
  reference, crossing method, one resolution for both terms). α50 moves 1.3 px with the ink
  reference on the same bytes (`instruments/band.crit.ts`, `SUB=1` for sub-pixel).
- **ACC-FIVE (leader):** `frontGate` must reach GRAPHITE's two consumers (DifficultyTally
  127.2/95.8 per s; the join ring unmeasured), or GRAPHITE reverts DifficultyTally to dashoffset.
- **Any lane with a retired-token or one-publisher claim (PAL-TIN, PAL-WALK, MRK-LIVE):** scan every
  stylesheet and SFC `<style>`, and read media-scoped arms per theme scope (the html.dark plant).
- **Every unit test of a rounding law:** sample a non-integer ratio, or round vs floor passes.
- **MRK-LIVE:** the uncarried law-39 hunks are one fold row with `--ring-ink`'s binding.

## 6 · Replay route

Rebuild: `npx vite build --config <tree>/web/frontend/.accgcrit5/vite.build.mts --outDir
<scratch>/dist-tree` (two-line config: `import base from '../vite.config.ts'`, cacheDir in the
scratchpad; a config outside the tree fails to load `@tailwindcss/vite`), then `diff -rq` against
the prototype's `accg5/dist-final`. Serve with `vite preview` on :4240 beside the control on :4241.
Run `instruments/pw.config.ts` (testDir re-pointed) with `OUTDIR` set: `-g caret-`, `-g occl-`,
`-g band-` (and `SUB=1 -g band-` for the sub-pixel arm). Gate attacks: copy
`src scripts e2e` + configs to a scratch dir, symlink node_modules, apply the plants in
`readings/gate-attacks.txt` one at a time, restore from a saved copy. Battery:
`instruments/battery.sh` (tree then control, each bare).
