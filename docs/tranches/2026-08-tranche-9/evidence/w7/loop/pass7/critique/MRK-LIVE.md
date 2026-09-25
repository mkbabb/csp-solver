# Pass 7 · MRK-LIVE · adversarial critique

**Convergence 86 (pass 6: 85) · Verdict ADVANCE**

The pass did what the pass-6 critique asked, and it reproduces to the byte:
- the graft is gone from the default (resident `d` = `74a2b5d9`'s recipe; whole ring 44/24 · 66 · 0 = the control's);
- X4, X4b and X5 now red, whole file, both engines;
- the ballot is restated with HEAD's true numbers and names HEAD's losses.

My rebuild of the tree gives the lane's own dist hash (`index-B72YBnilT3zJ.js` / `index-CmuiKvTTB16E.css`). The product diff is the lane's to the byte (181,195 B, sha1 `5874d446`, `git apply --check` 0 on a fresh `74a2b5d9`).

It is not converged, because the three gates this pass built or re-cut are each cured for their plants and not for the class (registry-v6 §2.10, LAWS P6 §E/§F):
- **G-LIVE-23 reads visibility in ONE regime only** (reduced motion, fine pointer, no contrast preference). With the chrome ring at 0.15 and tier 2 at 0.2 for every reader who has NOT asked for reduced motion, the whole file is **20 passed, EXIT 0**. The plant is proven live: the computed ring opacity is 0.15 and the ghost's 0.2 under `no-preference` in both engines, and 1 / 1 under `reduce`.
- **G-LIVE-19's masked-default scan is a hand-rolled regex** over the library's walkers. Uppercase `VAR(--motion-note, 280ms)` (proven to resolve to 0.28 s in both engines), a `var(--motion-${rung}, 280ms)` stem template and a concatenated `"var(--motion-note" + ", 280ms)"` each leave it **2 passed, EXIT 0**. The SHAPE law names the stem template and concatenation by name.
- **G-LIVE-21 judges the deck card and the staging face by computed outline properties, not paint.** Under forced colours, `clip-path: inset(0)` on both hosts leaves it **2 passed, EXIT 0**; on those two hosts the outline then paints **0 px** in both engines (clean: 1,392 / 358 px chromium, 1,074 / 261 px webkit, focused vs blurred), while every property the row reads (solid, 2px, the engine's Highlight) is unchanged.

The shipped default also carries a 3:1 failure that no row reads: on the 9×9 board (the default size), the frame-corner cell's whole left side reads under 3:1 (median 2.40–2.85). G-LIVE-23 judges tier 2 only at interior cell 40, where every arm passes.

## Open gaps (exact, each closable)

1. **G-LIVE-23 (and G-LIVE-16) read the ring only under `reducedMotion: reduce`, at 1280×800 fine, with no contrast preference.**
   - NOPREF2 (index.css `@media (prefers-reduced-motion: no-preference) { .focus-ring { opacity: .15 !important } }` + gameCell.css tier 2 at 0.2 in the same arm): the whole file is 20 passed, EXIT 0. Liveness, both engines: `no-preference` ring 0.15, ghost 0.2; `reduce` ring 1, ghost 1.
   - COARSE2 (the same plant under `pointer: coarse`): 20 passed, EXIT 0 (live: ring 0.15, ghost 0.2, `pointer: coarse` matched in both engines).
   - MORE2 (the chrome ring at 0.15 under `prefers-contrast: more`, the arm where it should press HARDER): 20 passed, EXIT 0 (live: ring 0.15 with `prefers-contrast: more` matched, both engines).
   - The dark walk is sound: DARKX4b (`.dark .focus-ring` at 0.15, proven live) reds G-LIVE-23 in both engines (2 failed, "every side of every ring reads … 3:1").
   - Close: read the walk's verdict (not its plants) in `no-preference` too (the living mark rests on pose 0 after its four beats, so `docSettled` holds). Add one coarse stop and one `prefers-contrast: more` stop to the four-band read. Ship NOPREF/COARSE/MORE-shaped plants as in-run negatives beside X4.
2. **G-LIVE-19 misses three SHAPE-law siblings (LAWS P6 §F; §I forbids a hand-rolled second copy).**
   - `maskedIn` is `/var\(\s*(--[\w-]+)\s*,/g` on the library's stripped text. It is case-sensitive, blind to `${…}` stems, and blind to concatenation.
   - X7 `<i style="animation-duration: VAR(--motion-note, 280ms)">`, X8 `setProperty("animation-duration", \`var(--motion-${rung}, 280ms)\`)` and X9 `"var(--motion-note" + ", 280ms)"` in AnswerKeyLaminate.vue: **each G-LIVE-19 2 passed, EXIT 0**, file restored sha1-equal each time.
   - The runtime half reads only stylesheet `cssText`, so it cannot see any of the three either.
   - Close: match case-insensitively, expand `${…}` stems against the registered set, and fold string concatenation before matching (or take the library's `tokens`/`resolve` path). Add X7–X9 to the in-run overlay list.
3. **G-LIVE-21's deck-card and staging-face clauses are existence clauses** (style ≠ none, width > 0, colour = Highlight), the class A.5.3 names.
   - FCCLIP2 (`@media (forced-colors: active) { .game-card.is-center, .staging-btn { clip-path: inset(0) !important } }` in index.css): **2 passed, EXIT 0**; on those two hosts the outline then paints **0 px** in both engines (clean: 1,392 / 358 px chromium, 1,074 / 261 px webkit, focused vs blurred), while every property the row reads (solid, 2px, the engine's Highlight) is unchanged.
   - Only the guard carries a paint clause (260 / 256 px).
   - Close: give the card and the staging face the guard's focused/blurred/focused paint count, with a clip-path plant as the in-run negative.
4. **The shipped default's 9×9 frame-edge failure is carried by no row.**
   - Whole ring, cell 0, lane dist vs control dist, two runs, two photographs each: **9×9 66/240 under 3:1 on lane and control in all four engine×theme cells.**
   - The left side's MEDIAN is under 3:1: lane 2.812 / 2.404 (chromium light/dark), 2.85 / 2.404 (webkit); control 2.698 / 2.312, 2.693 / 2.316.
   - So on the default board size, the frame-corner cell's focus ring has a whole side under 3:1. Only cell 0 was read. That the other left-edge and top-edge cells share it is an inference from the geometry, not a measurement. 16×16 is 44 / 24 on both trees.
   - G-LIVE-23's tier-2 subject is interior cell 40 (3.92–3.997). No arm fails there, so the row cannot see the ballot's trade or a worsening of it.
   - The whole-ring statistic lives in an evidence-dir CLI (`whole-ring.mjs`), not in the spec. Registry-v6 §5 row (4) asked for the §3.1 dowry "landed as rows".
   - Close: a G-LIVE-23 clause on 9×9 and 16×16 cell 0, with HEAD's counts ADMITTED at a floor = shipped − 0.05 and a STALE clause. A worse ring then reds, and the owner's `sized` strikes it.
5. **T9-B8 (the ring's ink, an open owner ballot) has lost its frames.**
   - The two pass-7 crops retire `ballot-ring-token-3arms-16x16-cells0-1-{light,dark}-…png`, T9-B8's only three-arm pair, and replace it with T9-B29's HEAD|graft pair. That pair shows arm A only.
   - The retired pair was shot on the graft geometry, which no longer ships.
   - So arms B (`#4589d2`@0.95) and C (`#2f68aa`@1.0) are framed nowhere on the shipping geometry (U-10, registry-v4 §2.9).
   - Close: re-shoot T9-B8's three arms on HEAD geometry, one payload, as the kept replacement. The chair has to rule which pair the cap keeps.
6. **T9-B29's `sized`-vs-HEAD choice is unframed where it lives.**
   - The arms differ only below 16×16, and the ballot's number there is the 9×9 frame-edge cell (66 vs 0).
   - The only 9×9 frame cited is the pass-6 critic's interior cell 40 hover/invalid pair. It shows the graft's crumple, not the corner's cure.
   - LAWS P6 §C says a ballot arm is framed where it differs.
   - Close: a HEAD|sized pair at 9×9 cell 0 focused, light, one payload.
7. **The pass left two false cross-references in product comments.**
   - `gameCell.css:320–326` (tier 2) still says "index.css `--color-focus-sketch` carries the table, the frame row it fails, and the threshold row". This pass deleted that table from index.css. The comment also restates painted figures 3.619 / 3.691 (webkit 3.615 / 3.695) that were not re-measured this pass ("over its own fill", README gap 12) and that no gate holds. It names "MRK-ABS's comments", a retired family.
   - `FocusRing.vue:315` cites `index.css:233` for `--ring-ink`, which is at :228 (:232 at pass 6).
   - The figure clause covers only the `RING_GEOMETRY` comment.
   - Close: strike the figures and the pointer from gameCell.css and cite the rule by name, not by line number.
8. **The deck card's admitted floor is 0.21 below its lowest reading.**
   - The right/bottom admission floor is 1.5 against readings of 1.709 (webkit light bottom), 1.729 (chromium light bottom), 2.226–2.964, so a worsening to 1.51 passes.
   - D0 (the deck ring at offset 0) is unbuilt, and it is the deck owners' (CTRL-FACE/CTRL-TAPE) and the chair's.
   - Close: set the floor at each side's shipped reading − 0.05 until D0 lands.
9. **INTAKE-22 §7 row 44 is OPEN, reproduced on both dists.**
   - `.info-btn .info-glyph` at rest, DPR 2: chromium light **2.510**, lane = control (RED G2).
   - The one "green" rest reading (chromium dark 4.697) exits **3**: the probe's TAIL12 plant stays GREEN at 4.743 on a one-glyph 'i'. That reading is unproven by its own negatives, and the README quotes it as clearing.
   - The intake's 4.66 / 7.68 do not reproduce (the lane's finding, which I confirm).
   - The ink is §10's or T9-R8's. Close there, and state the exit-3 caveat beside every glyph-pop row on the 'i'.
10. **eslint . adds 4 warnings over the control's 0**: unused `eslint-disable-next-line @typescript-eslint/no-explicit-any` at `focus-ring.spec.ts:67/790/800/802`. The exit is 0 on both trees, but the README's "eslint . 0" hides them. Close: delete the four directives.
11. **The instruments are imported by path from the loop's record.** G-LIVE-19 and G-LIVE-23 import `pass7/instruments/{shape-census,edge-bands}.mjs` from `docs/…/evidence`. CI is browserless (O-12), so the README's "CI cannot run these rows" is moot. But a fold that moves or freezes the evidence tree breaks the spec. The fold must vendor them. Declared by the lane; confirmed.
12. **Carried and declared, all confirmed:**
    - The undefined-token census is +2 bare `--color-peer-cursor-ink` (gameCell.css:300/302) on the lane (EXIT 1: 2 bare + STALE `--refuse-dur`) against control 0 bare (EXIT 1: STALE). This is A.3's admitted row, and the integrator's ledger carries it.
    - The dark filter census is 4 failed / 8 passed on both dists, crayon-heart.
    - The graphite arm's rules ship dead (gameCell.css:424–436), a consumer-less substrate under an unframable U-10 arm.
    - G-LIVE-4's at-least-one-reversal clause is checked only when both engines run in one invocation.
    - G-LIVE-17's covering is a room-deal reading (6 / 3,499 px² and 8 / 4,056 px² this run).
    - INTAKE-23 §4 row 37 is OPEN (the fold's read of row 9's composed tree).
    - Not re-run: 60/120 Hz, R2 in WebKit, the over-own-fill column.
    - D0 and the law-39 tab deletion are PROPOSED (the deck owners' and the chair's).

## Checklist hits

- **Gates that cannot fail / cured for the plants, not the class.**
  - G-LIVE-23 and G-LIVE-16 read only under `reduce`. NOPREF2 20/20 green; COARSE2 20/20 green; MORE2 20/20 green.
  - G-LIVE-19: X7 (`VAR()`), X8 (stem template) and X9 (concatenation) each stay green in both engines.
  - G-LIVE-21: a clipped forced-colours outline stays green.
- **Existence is not visibility (A.5.3).** G-LIVE-21's deck-card and staging clauses read computed outline style/width/colour, not paint.
- **Masked fallback in the choice of subject.** Tier 2 is judged only at interior cell 40, where the default passes. The default's 9×9 edge failure (left median 2.40–2.85) is read by no row.
- **The constraint it forgot.**
  - U-10: T9-B8's arms B/C are unframed after their pair was retired.
  - The SHAPE law: stems and concatenation are named, not implemented.
  - LAWS §I: a hand-rolled matcher beside the chair's library.
- **Stale substrate.** The gameCell.css pointer to a deleted table. Ungated painted figures in a product comment. A line-number cite that drifted twice.
- **Consumer-less substrate.** The graphite-arm rules (declared, carried).
- **Not hit.**
  - π: the geometry is `74a2b5d9`'s, byte for byte. The whole ring reproduces the control's counts. The page-width clip is claimed.
  - M16: `lint:copy` 0.
  - filterBudget: lane = control, both themes.
  - The @property law: `check-property-block` source + served 0.
  - The generic-default tell list: nothing.

## Strengths

- **The pass-6 plants are closed, whole file, both engines.** I ran them first:
  - X4 → G-LIVE-23 ×2 (2 failed / 18 passed);
  - X4b → G-LIVE-23 ×2 + G-LIVE-16 ×2 (4 / 16; the G-LIVE-16 red is the plant interaction the lane declared);
  - X5 → G-LIVE-19 ×2 (2 / 18).
  - Every file was restored sha1-equal.
- **The regression is gone and pinned.**
  - `gridPaths.test.ts` 4/4. Flipping `RING_GEOMETRY.arm` to `sized` or `graft` reds it (1 failed / 3 passed each; restored `ea683d12`).
  - G-LIVE-22's DOM figures match the comment within 0.01 px in both engines (webkit 9×9 5.383 / 6.882 against 5.382 / 6.880).
- **Exact reproducibility.**
  - Dist hash identical.
  - Whole ring identical to the digit on two runs. The lane's README left-median 3.92 matches my dist read, though the lane's own dev log printed 3.207 for the same row once.
  - G-LIVE-23's four-band table identical: tuner-toggle 4.188 ×4; X4 1.199; FADE15 1.054; X4b 1.278; tier 2 3.972 / 3.92.
  - Forced-colours inks identical: `rgba(5, 0, 73, 0.8)` / `rgba(128, 188, 254, 0.6)`; guard 260 / 256 px.
- **The dark walk works.** DARKX4b (proven live) reds G-LIVE-23 in both engines.
- **An honest ballot.** T9-B29 names HEAD's losses (the 9×9 corner 66 vs 0; MA-N headroom below 16×16). It gives `sized`'s cost and says the peer-cursor coupling is declared only if the graft fires. The two frames are one payload and one variable, and I looked at both: HEAD's ring is a square on the cell's own edges, and at cell 0 its left side lies on the frame rule. The graft's is the crumpled quadrilateral. Both are labelled in frame. 13.6 KB retires 20.5 KB.

## Re-measured by the critic (both engines unless stated)

- **Whole spec, lane dev :4238, spec sha1 `4dd6ac5d`:** 20 passed, EXIT 0 (load 38.7 → 57.3).
- **Lane dist rebuilt outside the tree:** `index-B72YBnilT3zJ.js` / `index-CmuiKvTTB16E.css`, identical to the lane's.
- **Whole ring, cell 0, 240 stations, dropped counted, two photographs each** (the lane's `whole-ring.mjs` copied to `critique/MRK-LIVE/instruments/`), lane dist :4236 ×2 runs vs control dist :4239 (`index-CubiZsMVSwTc.js`, hash-verified), load 60–67:

  | tree | 16×16 cr / wk | 9×9 | 4×4 | 16×16 worst cr L/D | 9×9 left median cr L/D · wk L/D |
  |---|---|---|---|---|---|
  | lane | 44 / 24 | 66 | 0 | 2.812 / 2.404 | 2.812 / 2.404 · 2.85 / 2.404 |
  | control | 44 / 24 | 66 | 0 | 2.69 / 2.309 | 2.698 / 2.312 · 2.693 / 2.316 |

- **Plants, whole file unless named, on a scratch copy of the tree (dev :4235), each restored sha1-equal:**

  | plant | result |
  |---|---|
  | X4 (pass 6) | 2 failed (G-LIVE-23 ×2), EXIT 1 |
  | X4b (pass 6) | 4 failed (G-LIVE-16 ×2, G-LIVE-23 ×2), EXIT 1 |
  | X5 (pass 6) | 2 failed (G-LIVE-19 ×2), EXIT 1 |
  | NOPREF2 (live: ring 0.15 / ghost 0.2 under no-preference) | 20 passed, EXIT 0 |
  | COARSE2 | 20 passed, EXIT 0 (live: ring 0.15, ghost 0.2, `pointer: coarse` matched in both engines) |
  | MORE2 | 20 passed, EXIT 0 (live: ring 0.15 with `prefers-contrast: more` matched, both engines) |
  | DARKX4b, G-LIVE-23 (live: ring 0.15 in dark) | 2 failed, EXIT 1 |
  | X7 `VAR()`, G-LIVE-19 | 2 passed, EXIT 0 |
  | X8 stem template, G-LIVE-19 | 2 passed, EXIT 0 |
  | X9 concatenation, G-LIVE-19 | 2 passed, EXIT 0 |
  | FCCLIP2, G-LIVE-21 | 2 passed, EXIT 0 |

- **Filter census (built dists, 1280×800):** light 12/12 on lane and control. Dark 4 failed / 8 passed on both, every failure `crayon-heart.idle ⟨saturate(0.85)⟩`.
- **check-property-block** (pass-6 copy): lane source+served 0 (45 registrations in 7 css, stamp `index-B72YBnilT3zJ.js`); control 0.
- **Undefined-token census** (pass-6 copy): lane EXIT 1 (timing 0, other 2, STALE 1); control EXIT 1 (timing 0, other 0, STALE 1).
- **Lint battery, bare, lane | control `git archive 74a2b5d9`:**

  | gate | lane | control |
  |---|---|---|
  | lint:copy | 0 | 0 |
  | lint:theme-tokens | 0 | 0 |
  | lint:sleep | 0 | 0 |
  | lint:lanes | 0 | 0 |
  | lint:motion | 0 | 0 |
  | test:e2e:projects | 0 | 0 |
  | `npm run lint` | 0 | 2 (my archive lacked `web/relay`; incident 3) |
  | eslint . | 0 (4 warnings) | 0 |

- **gridPaths.test.ts** on a scratch copy: 4/4; arm `sized` 1 failed; arm `graft` 1 failed.
- **INTAKE-22 row 44** (the chair's `paint-probes.mjs --probe glyph --plants`, DPR 2, dists): chromium light rest 2.510 RED on both trees; chromium dark rest 4.697 on both, EXIT 3 (TAIL12 GREEN at 4.743).
- **The product diff through a temporary index:** 22 files +2,697/−175, 181,195 B, sha1 `5874d446`; `git apply --check` on a fresh `74a2b5d9` archive: 0.

## Frames

None banked. The lane's two crops are lawful for T9-B29 (one payload `?size=4&board=mintSudoku(4)`, one variable `RING_GEOMETRY.arm`, chromium, 1280×800, fine, DPR 1, ×3), and I looked at both. The frames the ballots owe (gaps 5 and 6) are the lane's to shoot at pass 8, within the chair's cap ruling.

## Cross-pollination

- **Every paint gate in the estate (CTRL-FACE, CTRL-RULE, PLR-SELF, CTRL-TAPE, the chair's four-band probe):** a row that emulates `reduce` to settle its photographs reads only the reduced-motion reader. Read the verdict in `no-preference` too, and plant in the arm the row does not emulate. My NOPREF plant is the shape.
- **The chair's shape-census library:** export ONE `maskedDefaults(text, registered)` that matches case-insensitively, expands `${…}` stems and folds concatenation. Every census then stops hand-rolling `/var\(/`: LIVE's G-LIVE-19, MOT-VERB's census, the undefined-token census.
- **Forced-colours rows (FACE, TAPE, SELF):** Highlight on a computed outline is existence. `clip-path: inset(0)` on the host keeps every property green.
- **The chair (cap):** T9-B8 and T9-B29 compete for one slot. Rule which ballot keeps a frame pair on the shipping geometry.
- **A critic's own incident, for every lane:** gameCell.css ships as `<style scoped src>`, so a plant appended there never reaches an element outside DigitCell. Plant chrome rules in `index.css`, and prove the plant live (computed value) before reading a green.

## Setup, incidents, cleanup

- **Servers**, each started by `exec` so the recorded PID is the node process:
  - lane dev :4238 (pid 9686);
  - plant-copy dev :4235 (pid 9688);
  - control dev from a `git archive 74a2b5d9` scratch tree :4234 (pid 10607);
  - control dist :4239 (pid 8944, the chair's `.vite-control.config.ts`, hash-verified);
  - lane dist preview :4236 (pid 12185).

  Every cacheDir is under my scratch, outside the project root. No git ran in the control tree.
- **Incidents, self-declared:**
  1. My first three dev servers (pids 8942/8946/8948) died at config load: a `.ts` config outside a `"type": "module"` package. They were re-made as `.mts`. Port 4237 was then taken by a sibling (pid 9311, not mine), so my control dev moved to 4234.
  2. **My first battery's chrome plants were VACUOUS.** NOPREF/COARSE/MORE/DARKX4 were appended to gameCell.css, which DigitCell includes as `<style scoped src>`, so `.focus-ring` never matched. Those four rows are struck. I re-ran them as NOPREF2/COARSE2/MORE2/DARKX4b, with the chrome half in index.css and a liveness read before each spec run. The tier-2 half of NOPREF/COARSE was live (scoped to the cell), and those runs were also 20/20 green, which is consistent with the re-run.
  3. The control `npm run lint` read 2, because my archive lacked `web/relay`. The lane's read on a full archive is 0.
  4. A heredoc edit briefly broke `plants.py`'s syntax mid-battery. It was repaired before the next plant applied: the X5 header had already printed, and every later plant applied cleanly.
  5. The first filter-census attempt found no tests (the default config ignores the spec). It was re-run with a dedicated config.
  6. One zsh loop mis-split its arguments (LAWS P5) and exited before any read. It was re-run as a bash script.
  7. The first forced-colours paint probe threw on an unused `pngjs` resolve before any read. The line was deleted and the probe re-run: clean, then planted, then restored sha1-equal (`index.css` `9a2878b9`).
  8. The control dev server (:4234) was served and never used for a spec row. The lane's control reading (16 failed / 4 passed) is NOT re-run here. It was killed by PID, as was the lane dev (:4238), once the whole-spec run was done.
- **Box load** 29–93 (1-min) over the run. No timing verdict is claimed.
- **The work tree:** `git status` shows the lane's 22 paths, unchanged. No file in it was edited, and every plant ran on scratch copies. Nothing was committed, pushed, stashed, installed or deployed. No `rm` was used.
- **Evidence:** `critique/MRK-LIVE/{instruments,logs}/` (copied instruments, summaries only).

## The number

**86**, up one from 85. The pass removed the regression, closed every pass-6 plant in both engines, and restated the ballot honestly. It also reproduces to the byte. That would be the 87 the section held before the graft.

It stops at 86 because the three gates it built each fall to a sibling of their own plant:
- a ring faint for the no-preference majority;
- `VAR()`, a stem, a concatenation;
- a clipped forced-colours outline.

Those are the siblings the chair's law names. The default it ships also fails 3:1 on the 9×9 frame edge with no row carrying it. Pass 8's shortest path:
1. gap 1 (the regime);
2. gap 2 (the matcher through the library);
3. gap 3 (paint for the card and the staging face);
4. gap 4 (the edge-cell row);
5. gaps 5–6 (the two owed frames, under the chair's cap ruling).
