# T9-W7 execution lanes — FOLD MANIFEST

Branch `w7/exec`, worktree `.claude/worktrees/w7-exec`, base `aab67b92`, slice-1 HEAD `e4c45f53`, slice-2 HEAD `8d334845` (§6).
Slice 1: six commits, three cures, each ACCEPTED at a non-author verify round 2 after one REPAIR round.
Slice 2: six commits, three cures, ACCEPTED at r2 / r1 / r3 (§6.1).
Worktree status at fold: clean but for untracked `web/frontend/.vite-exec.config.ts` (not picked).
The evidence under `docs/tranches/2026-08-tranche-9/evidence/w7/exec/` lives in the MAIN tree
(untracked at `master`), not in the branch; the fold commits it beside the picks.

## 1. Cherry-pick order (oldest first; the intake's own order 3B-1 → 3C-4, then B1)

| # | sha | cure | files | verdict chain |
|---|---|---|---|---|
| 1 | `0a08a3cf` | 3B-1 cure | `BoardHost.vue` (+17/−1), `BoardHost.authors.test.ts` (new, 215) | r1 REPAIR (1 MUST, 4 NOTE) |
| 2 | `881be039` | 3B-1 repair r1 | `BoardHost.authors.test.ts` header only | r2 ACCEPT (0 MUST, 5 NOTE) |
| 3 | `ddfab36b` | 3C-4 cure | `GameBoard.vue` (+31/−14 incl. one deleted `@media` rule), `GameBoard.coarseTape.test.ts` (new, 219) | r1 REPAIR (1 MUST, 6 NOTE) |
| 4 | `2b6b8b7b` | 3C-4 repair r1 | `DigitCell.vue`, `BoardHost.vue`, `DigitCell.attribution.test.ts` — comments only | r2 ACCEPT (0 MUST, 2 NOTE) |
| 5 | `c391665c` | B1 cure | `GameControlPanel.vue:1297`, `useGameCell.ts:158`, `DigitCell.attribution.test.ts`, `BoardHost.authors.test.ts`, `e2e/a11y.spec.ts:587`, `e2e/sudoku-interaction.spec.ts:87`, `scripts/check-copy-register.mjs` (admission struck), `scripts/check-font-coverage.mjs:220` | r1 REPAIR (2 MUST, 4 NOTE) |
| 6 | `e4c45f53` | B1 repair r1 | `scripts/check-copy-register.mjs` (header + `why`), `BoardHost.authors.test.ts:19`, `e2e/a11y.spec.ts:123` — no bundle byte | r2 ACCEPT (0 MUST, 3 NOTE) |

Bundle identity per cure: 3B-1 cured dist `index-DNGqF0dwwhHF.js` (sha256 `55857b73…fd3fbfa3`, rebuilt from source by r2); 3C-4 dist name not banked (CSS deletion verified: 0 hits of `not all and (hover:hover) and (pointer:fine)` across seven built stylesheets; main's pre-cure `index-BMuoFtzKf9_k.css` carries it); B1 dist `index-Cc6TqSXYnbfW.js`, three independent reproductions, unchanged across `c391665c` → `e4c45f53`. HEAD control throughout: main's `index-9rZPzI5DEcpe.js` (W8 §8.1's pin, mtime 13:53, never rebuilt, never served from the main tree).

## 2. Per cure

### 3B-1 — ACCEPTED — `0a08a3cf` + `881be039`

Seam: `BoardHost.vue:88`, `cellAuthors` computed drops positions in `model.solvedValues`, in `model.givenCells`, or with `model.values` entry 0. Handoff option A verbatim.

DELTA declared: ONE rendered surface — the hover-only, fine-pointer, in-session `.attribution-tape` stops mounting over a peer-stamped cell whose digit is solver-filled, given, or erased; still mounts over the peer's own live digit. The cell's spoken name was already truthful at `aab67b92` (`useGameCell.ts` kind-branch, `DigitCell.attribution.test.ts` rows at 111 / 120-124 / 127-132); r1 corrected the record to say so.

| arm | viewport / engine | HEAD dist | cured dist |
|---|---|---|---|
| hover solver-filled peer-stamped cell | 1280×800 chromium | count 1, `imperial-rodent` | count 0 |
| hover peer's live digit | 1280×800 chromium | count 1 | count 1, `enchanting-thrush` |
| hover solver-filled peer-stamped cell | 1280×800 webkit (r1) | count 1, `personal-bedbug` | count 0 |
| hover peer's live digit | 1280×800 webkit (r1) | count 1 | count 1, `imperial-coral` |
| verifier r1 chromium / r2 both engines | same arm, own runs | 1 / 1 | 0 / 1 (`uptight-cow`, `safe-stork`, `formidable-alligator`) |

Frames (4, chromium, 103,559 B): `frames/head-solved-cell-tape-claims-peer.png`, `frames/cured-solved-cell-no-tape.png`, `frames/head-live-digit-tape-claims-peer.png`, `frames/cured-live-digit-tape-kept.png`. Webkit ships as numbers (`delta-arm-webkit.txt`), no crops.

π (pinned `?board=` permalink, `reducedMotion: reduce`, 2.5 s settle, HEAD :4258 vs cured :4259): board-1280×800 1089/1089 · board-390×844 1049/1049 · gallery-1280×800 1807/1807 · gallery-390×844 1767/1767 — **0.00 px over 5,712 rects**, identical key sets (`census/diff-pinned.txt`). Verifier r1 and r2 both engines at 1280×800: 0.00 px over 5,792 rects. Surfaces moved: none. Not re-measured at r1 (no bundled file changed; dist byte-identical).

Born-RED: `BoardHost.authors.test.ts` — RED at `aab67b92` exit 1, Tests 5 failed | 2 passed (7); GREEN exit 0, 7 passed (7); reproduced off-branch by r1 and r2.

| gate | exit |
|---|---|
| row RED at HEAD / GREEN cured / GREEN r1 | 1 (designed) / 0 / 0 |
| `npx vue-tsc -b --force` | 0 |
| `npx vitest run` | 0 — 67 files / 817 tests (r1 and r2 confirm) |
| `npm run lint` · `lint:eslint` · `lint:boundary` · `lint:copy` · `lint:live-regions` · `lint:motion` · `test:font-coverage` | 0 ×7 |
| goldens vs cured dist :4259 | 0 — 4 passed, no baseline moved |
| webkit tape DELTA both dists | 0 both |
| session e2e chromium (multiplayer + presence + follow-still-authorship) vs cured dist | **1** — 18 passed, 1 skipped, 1 failed (`presence.spec.ts:177`); same row RED against HEAD dist; NOT re-run at r1 |
| full e2e suite, both engines | **NOT RUN** (`playwright.config.ts` webServer binds :3000, outside the lane's fence) |
| π rect census at r1 | **NOT RE-RUN** (bundle identity) |
| `test:font-coverage` by verifiers | NOT re-run (author's 0 stands) |

### 3C-4 — ACCEPTED — `ddfab36b` + `2b6b8b7b`

Seam: `GameBoard.vue:487`, `hoveredPos` becomes `computed(() => isCoarse ? (pointedPos ?? (unitFocused ? focusedPos : null)) : pointedPos)`; `onCellHover` writes `pointedPos`; the rule `@media not all and (hover: hover) and (pointer: fine) { .attribution-tape { display: none } }` deleted. Two declared departures from the handoff: the `unitFocused` gate (the handoff's ungated `focusedPos` is `ref(0)` and would tape cell 0 at load and strand after focus leaves — reads D and E measure it), and the deleted rule the handoff never named (pre-cure browser arm: count 1, `display: none`, 0 × 0 px painted).

DELTA declared: a new `.attribution-tape` box over a peer-authored cell while that cell holds the board's focus, coarse pointers only. Widths are the slug's; the invariant is 0 × 0 → non-zero.

| run | viewport | engine | tape |
|---|---|---|---|
| before | 390×844 | chromium | `display: none`, 0 × 0 px |
| after | 390×844 | chromium | `scrawny-gerbil`, 109.59 × 33.58 px |
| after | 390×844 | webkit | `genuine-scallop`, 118.70 × 33.89 px (top-row `is-below` flip) |
| after | 820×1180 | chromium | `civilian-crocodile`, 122.28 × 33.53 px |
| own cell tapped | all | all | 0 instances |

Focus arm isolated (`verify-r1/focus-arm.mjs`, 390×844, `pointerCoarse: true, hoverNone: true`): A tap peer cell → tape; B `mouseleave` on cell root → tape STANDS; C ArrowRight onto peer cell, no pointer event → tape rises; D ArrowLeft onto unauthored cell → 0; E tap drawer tab off the grid → 0, focus off board. Witnesses: r1 both engines; author r1 both engines (`repair-r1/focus-arm-390-{chromium,webkit}.txt`); r2 chromium only. Webkit half has two witnesses (author, r1), 820×1180 chromium only.

Frames (4, 128,153 B): `frames/before-390-chromium-peer-cell-focused.png` (21,071), `frames/after-390-chromium-peer-cell-focused.png` (25,961), `frames/after-390-webkit-peer-cell-focused.png` (35,745; crop clamps at x=0), `frames/after-820-chromium-peer-cell-focused.png` (45,376). No new frame at r1.

π: (a) fine-pointer chromium census before/after the edit, 1089/1049/1807/1767 rects, **0.00 px over 5,712**; repaired build vs `ddfab36b` bank likewise 0.00 px (`repair-r1/fine-census/diff.txt`). (b) coarse census, 390×844, `hasTouch: true`, both engines, main's pre-cure dist (copied, served read-only) vs cured build: chromium 1049 + 1767 rects 0.00 px, webkit 1049 + 1767 rects 0.00 px, `coarse=true`, `.attribution-tape` 0 (`repair-r1/coarse-census/diff.txt`; r2 reproduced against both banked sides on its own build, `verify-r2/census/`). The tape is `position: absolute; width: 0; height: 0; pointer-events: none`. Surfaces moved: none. Occlusion measured by r2 (not a π breach): the standing tape at cell 10 covers three cells of the row above at 68.6 / 81.2 / 68.6 % over 83 % alpha for the whole selection (`verify-r2/occlusion-390-chromium.txt`).

Born-RED: `GameBoard.coarseTape.test.ts` — RED at the pre-cure tree, Tests 3 failed | 6 passed (9) (the three coarse-mount rows); GREEN 9 passed (9); reproduced off-branch by r1 and r2. jsdom cannot see the deleted CSS rule; the browser before/after pair holds that half.

| gate | exit |
|---|---|
| `npx vue-tsc -b --force` | 0 |
| `npx vitest run` | 0 — 68 files / 826 tests (at `ddfab36b` and `2b6b8b7b`; r1, r2 confirm) |
| `npm run lint` | 0 (cure round: exit 1 once on the new test's formatting, `prettier --write` that file, then 0; r1: 0 first try) |
| `lint:copy` · `lint:live-regions` · `lint:motion` · `lint:eslint` · `lint:boundary` · `lint:theme-selectors` · `lint:lanes` · `lint:ink` · `test:font-coverage` | 0 ×9 |
| `npx vite build --config .vite-exec.config.ts` | 0; media rule greps 0 in built CSS |
| goldens vs :4259 | 0 — 4 passed, run twice at cure, once at r1, nothing re-baselined |
| `e2e/visual-regression.spec.ts` | NOT RUN at `ddfab36b`; **0 — 24 passed** (12 rows × chromium + webkit) at r1 by author, r1 verifier, r2 verifier |
| full e2e suite | **NOT RUN** |
| real device / Safari / simulator | **NOT RUN** (M19) |

### B1 — ACCEPTED — `c391665c` + `e4c45f53`

Seam: `GameControlPanel.vue:1297` Solve tape `the solver finishes the board` → `finishes the board for you`; `useGameCell.ts:158` spoken core `solver's answer N` → `revealed answer N`. Scope: the ballot's two strings only (DISPOSITIONS row T9-B1 enumerates exactly these). Gate not loosened: lexicon 25 entries, self-test 18 colours, `candidates` admission stands; the struck admission was compelled by the gate's third check (Case C) and the strike buys the regression guard (Case B).

DELTA declared: the Solve tape's rendered sentence and its own box width — chromium 184.61 → 168.09 px, webkit 197.05 → 179.20 px; nothing else on any surface. Frames taken on hover (tape is `opacity: 0` at rest), 1280×800 only, 43,260 B: `frames/before-1280-chromium-solve-tape.png` (9,679), `frames/after-1280-chromium-solve-tape.png` (9,462), `frames/before-1280-webkit-solve-tape.png` (12,241), `frames/after-1280-webkit-solve-tape.png` (11,878). No new frame at r1. The spoken core reaches no visible surface (ear-only).

π (chromium whole-tree, `probe/rect-census.mjs`, before/after the diff): board-1280×800 1089 rects, **1 moved, max 16.52 px** (`…/button:3/span:3`, the tape's own box, `895.69,693.42,184.61,30.05 → 903.96,693.78,168.09,29.32`; Solve button `978.81,634.03,46,56.03` unchanged); board-390×844 1049 / 0 / 0.00 (tape `v-if="!mobile"`); gallery-1280×800 1807 / 0 / 0.00; gallery-390×844 1767 / 0 / 0.00. TOTAL 5,712 rects. 0.73 px of height is the charCode-seeded tilt re-roll (−0.390° → −0.180°), inside the claimed box. Webkit whole-tree by DOM swap (r1, r2): 1089 rects, 1 moved, 17.75 px, same span; chromium 16.42 px. At r1: 0.00 px over 1,089 rects vs the `c391665c` bank (r2 measured), bundle hash unchanged.

Born-RED: `npm run lint:copy` with the admission struck and copy not yet recut — exit 1, `1 unadmitted`, `GameControlPanel.vue:1297 [@text] "solver"`; GREEN exit 0, `1 hit / 1 admitted / 0 unadmitted`. Three-case matrix reproduced by r1 and r2 (A parent/parent 0; B parent copy/cured gate 1; C cured copy/parent gate 1 "strike the entry"). `DigitCell.attribution.test.ts` pins `Row 2, column 3, revealed answer 4` and `not.toContain("solver")`.

| gate | exit |
|---|---|
| `npx vue-tsc --noEmit` · `typecheck:e2e` · `typecheck:node` | 0 ×3 |
| `npx vitest run` | 0 — 68 files / 826 tests (r1, r2 confirm) |
| `npm run lint` · `lint:eslint` (`npx eslint .`) · `lint:copy` · `lint:live-regions` · `lint:motion` | 0 ×5 |
| `test:font-coverage` | 0 — no new glyph (Patrick Hand 46 codepoints / 4312 B, 17 declared strings) |
| `npx vite build --config .vite-exec.config.ts` | 0 — `index-Cc6TqSXYnbfW.js` |
| goldens vs :4259 | 0 — 4 passed, nothing re-baselined |
| `e2e/a11y.spec.ts` + `e2e/sudoku-interaction.spec.ts`, both engines | NOT RUN at `c391665c`; **0 — 44 passed** at r1 (author; r1 and r2 verifiers) via a throwaway config, deleted |
| `npm run test:e2e` (full battery) | **NOT RUN** |
| whole-tree π in webkit by the estate's instrument | **NOT RUN** (probe launches chromium only; webkit reading exists via DOM swap in verify-r1 §3 / verify-r2 §3) |
| re-census at r1 | NOT RUN by author (identity); r2 measured 0.00 px / 1,089 rects |

## 3. Ballot T9-B1 — firing line for DISPOSITIONS §2

```
- **T9-B1 — FIRED 2026-09-17 at W7's execution lanes** (commit c391665c + repair e4c45f53 on w7/exec, landing on master at the W7 execution fold; trigger: W7 execution, default fired — M16's own law). The words chosen: the Solve tape `the solver finishes the board` → `finishes the board for you` (GameControlPanel.vue:1297); the cell's spoken core `solver's answer N` → `revealed answer N` (useGameCell.ts:158). The copy gate's admission for the old tape string struck, so a regression reds (check-copy-register Case B); the spoken row pins the sentence and `not.toContain("solver")`. SCOPE IS THE BALLOT'S TWO STRINGS: `classifyError.ts:51-52` (`the solver ran out of steps on this board.` / `couldn't reach the solver.`, rendered via SolverErrorNote.vue:46) and the admitted `candidates` caption (GameControlPanel.vue:980) still name the machine and are the chair's ruling (B1 README §7 gaps 1, 5). π: 1 rect of 5,712 moved, the tape's own box, 16.52 px chromium / 17.75 px webkit.
```

Fact for the chair: `c391665c`'s author date is 2026-09-18; the FIRING line already in DISPOSITIONS carries 2026-09-17. `c391665c`'s commit message ("the machine stops naming itself to a player") overclaims and stands unrewritten; the firing line above and B1 README §1 are the correction of record.

## 4. Chair's order

Preconditions, both required before any pick:

1. T9-W7 pass 2 (`wf_1f5bb044-d1a` lineage) has returned — main's `index-9rZPzI5DEcpe.js` is the live HEAD control until then.
2. W8 §8.1 (`wf_f75e8216-d11`) has released its dist pin — the same file; no `npm run build` on master while it runs.

Then, on master:

1. `git cherry-pick 0a08a3cf 881be039 ddfab36b 2b6b8b7b c391665c e4c45f53 a649cf5e e1f2304b 06fee424 7686f904 4235e382 8d334845` in that order (slice 1, then slice 2 — §6.1). Do not pick `.vite-exec.config.ts` (untracked, never committed). §6.5 amends the counts and greps of step 4 for the twelve picks.
2. `git add docs/tranches/2026-08-tranche-9/evidence/w7/exec/` (3B-1/, 3C-4/, B1/, this manifest) and commit with the picks or as the fold commit.
3. DISPOSITIONS §2: replace the T9-B1 FIRING line with §3 above. LEDGER: book the open gaps of §5 as rows with the owners named there.
4. Re-run on master, bare, exit codes read per gate (the local seal battery is a SUBSET of CI):
   - `cd web/frontend && npm ci --dry-run && npm ci`
   - `npx vue-tsc --noEmit` · `npm run typecheck:e2e` · `npm run typecheck:node` · `npm run typecheck:relay`
   - `npm run lint` · `lint:eslint` · `lint:relay` · `lint:knip` · `lint:boundary`
   - `npm run test:font-coverage` · `lint:ink` · `lint:catch` · `lint:theme-selectors` · `lint:theme-tokens` · `lint:tdz` · `lint:lanes` · `lint:sleep` · `lint:motion` · `lint:copy` · `lint:live-regions` · `test:support-floor`
   - `npm run test:unit:report -- --coverage` · `test:unit:count` · `test:e2e:projects` · `test:coverage:floor` · `test:unit:relay` (expected 68 files / 826 tests + the new rows in count)
   - `node scripts/dist-identity.mjs --self-test` · `npm run test:golden:bytes` · `npx vite build --logLevel warn` · `node scripts/dist-identity.mjs --dist dist` · `npm run test:prod-shake -- dist` · `test:deploy-gate` · `test:edge-probe` — the built dist must carry the CH-69 wasm (memory: WGATE rebuild) and grep 0 for `not all and (hover:hover) and (pointer:fine)`, 0 for `solver finishes the board` and `solver's answer`
   - repo root: `node scripts/check-doc-truth.mjs --self-test && node scripts/check-doc-truth.mjs` · `node scripts/ledger-diff.mjs --require-ledger --assert-state --verify-cites --self-test` · `node scripts/check-evidence-policy.mjs --self-test` (the new evidence dirs must clear its caps) · `npm audit --audit-level=high --package-lock-only` · `npm run test:gen-latency`
   - goldens OFF THE BUILT DIST: `vite preview` on a fenced port, `PLAYWRIGHT_BASE_URL=… npx playwright test -c playwright-golden.config.ts` — 4/4, no `--update-snapshots`
   - `e2e/visual-regression.spec.ts` at the intake's three viewports, both engines: 390×844, 820×1180, 1280×800 (the lanes' 24-row runs were the spec's own rows; the chair confirms the three viewports are among them or adds the missing ones)
   - `npm run test:e2e` full battery, both engines (NOT RUN by any lane) — read `presence.spec.ts:177` and `multiplayer.spec.ts:320` as the known symmetric local reds, not as fold blockers
5. Push only after every gate above is green bare; CI must be 16/16 + dist on the fold commit before any deploy (CH-57 gate).

## 5. Gaps left open — each with an owner

| # | cure | gap | owner |
|---|---|---|---|
| G1 | 3B-1 | `presence.spec.ts:177` RED symmetric HEAD/cured (`roster` count 1 of 3); `multiplayer.spec.ts:320` RED cured ×2 / HEAD ×1 (`digitAt` "" after 10 s); the local session e2e arm is unstable on this box | chair — CONFIRMED on the integration chain 2026-09-18 (`integrate/BATTERY-script.md` 9a/9b/9c): `presence.spec.ts:177` red on the cured dist AND on the base dist, both engines, every run (SYMMETRIC); `multiplayer.spec.ts:320` did not red in the full run. LEDGER row lands at the fold commit |
| G2 | 3B-1 · 3C-4 · B1 | full Playwright battery NOT RUN by any lane | chair — RUN 2026-09-18 on `t9/integrate` @ `cf8d53f4` (the six picks over `a8fee1f5`) by a deterministic script (`integrate/BATTERY-script.md`, logs under `integrate/logs-script/`): 48 gates, 45 exit 0 — vue-tsc/typecheck ×4, lint ×5, 12 gate scripts, unit 68 files / 826 tests, coverage floor, dist identity `index-Cc6TqSXYnbfW.js`, CH-69 wasm sha b908e586 in dist, dist greps 0/0/0, doc-truth 42/42, ledger-diff GREEN, evidence-policy PASS (tracked estate), npm audit high 0, goldens 4/4 unmoved, visual-regression 24/24 both engines. Full e2e both engines: 468 passed / 4 failed / 4 skipped (7.0 min) — the four reds classified by the non-author refuter (`integrate/REFUTE-script.md`, 40 logs, two full runs 468/4/4 with DISJOINT non-presence red sets): `presence.spec.ts:177` red 5/5 cured and 3/3 base, both engines — STRUCTURAL, not flake: `?wire=local` is `import.meta.env.DEV`-gated (0 grep hits in either dist) and the spec black-holes every socket at `:174`, so the row cannot pass against ANY built dist (its habitat is the default config's dev server); `sudoku-interaction.spec.ts:69` red on base only, 3/3 — BASE-ONLY BY CONSTRUCTION (the picks rewrote its matcher to `/revealed answer/`; the base dist is not a control for rows the picks moved; same for `a11y.spec.ts:587`); `sudoku-interaction.spec.ts:51` webkit (an 18,292 ms boot once) and `visual-regression.spec.ts:790` webkit (its negative control re-measured before the injected rule landed; the seal cell reads 1227.09/1227.06 on BOTH arms, cure moves it 0.00 px), `multiplayer.spec.ts:320` chromium and `viewport-law.spec.ts:396` webkit each red in one run of one arm — FLAKY. No ASYMMETRIC red. The refuter also ran what the script omitted: `test:e2e:projects` (34 specs / 547 tests, green), `test:e2e:retries` (green), and the FIVE built-dist specs under `playwright-throttle.config.ts` (67 passed, 8 projects — three of them assert over the artifact 3C-4 edits). Verdict CONFIRMED; the picks are not fold-blocked |
| G3 | 3B-1 | a peer-stamped GIVEN cell cannot be driven live (`applyCellValue` refuses a given before `noteWrite`; ledger cleared per epoch); unit row cell `2` is defence in depth | chair — record as defence in depth (r2 NOTE-2 wording) |
| G4 | 3B-1 | `cellAuthors` computed now wakes on `values` + `givenCells` + `solvedValues`, allocates a fresh map per digit write; recorded, unmeasured | chair — expectation, not measurement; perf row only if one opens |
| G5 | 3B-1 | `authorInk` (`useSession.ts:402`) is unnarrowed; its silence on the three kinds depends on paint order in `HandwrittenGlyph.vue:83-85` | W7 §6 — class row in the chair's ledger |
| G6 | 3B-1 · 3C-4 | no browser-level gate names `.attribution-tape` / `cellAuthors`; regression gate is the unit rows only | W7 §6 — book a spec row if the chair wants the two-tab surface gated |
| G7 | 3B-1 | record hygiene: `gates/` count "17" vs 18 on disk; three `DigitCell.attribution.test.ts` cites anchored inconsistently (111 `it`, 121/129 fixture lines) | chair — DONE 2026-09-18: the cites re-anchored to the `it` lines 111/120/127 in 3B-1/README.md §1; no "17" claim survives in the README (gates/ holds 18 logs) |
| G8 | 3C-4 | stranded hover: a hover-in with no hover-out plus a non-pointer focus move leaves the tape on the first cell (external keyboard on a phone); hardening named: clear `pointedPos` on the grid's `focusout` | CLOSED by slice 2's 3C-4b `a649cf5e` + `e1f2304b` (§6.2) with the named hardening; read F STRANDED → PASS both engines; the family's residue (no focus in the grid at all) is G24 |
| G9 | 3C-4 | occlusion: standing tape covers three cells of the row above at 68.6 / 81.2 / 68.6 % over 83 % alpha for the selection's duration on the phone surface (r2 NOTE-1); one measured row still owed in the README's DELTA | W7 §6 (design: dwell-out / drop on keypad) + owner U-10 re-look |
| G10 | 3C-4 | no real device; emulation proves the media match and the paint under it | owner U-10 re-look + W8 §8.3 iOS instrument (owner-run) |
| G11 | 3C-4 | `peerSlug` roster cross-read empty at dock viewports (roster is inside the shut sheet); tape slug checked against the tape alone | W7 §6 — probe row |
| G12 | 3C-4 | 820×1180 chromium only; webkit focus arm A–E has author + r1 witnesses, not r2 | chair — §4.4 visual-regression at 820×1180 both engines |
| G13 | 3C-4 | coarse census BEFORE side is an earlier lane's dist (pre-cure verified by its CSS), not a build the lane made | chair — accept as verified artifact, or rebuild the control on master |
| G14 | 3C-4 | jsdom applies no stylesheet; the deleted rule's half is held by the browser pair only | chair — record; no row owed |
| G15 | B1 | `classifyError.ts:51-52` still renders `the solver ran out of steps on this board.` / `couldn't reach the solver.` (via `GameBoard.vue:45 → :896 → SolverErrorNote.vue:46`, `role="alert"`); enumeration exhaustive per r2; a re-word is in flow (real π) and must keep saying what broke | CLOSED by slice 2's B1b `06fee424` (§6.2) on the chair's ruling of 2026-09-18 (third recut with its own census): `this board took too many steps to finish.` / `the board's helper stopped working. reload the page.`; driven π 1 rect of 1,103 per arm (the note's own `<p>`); the words-by-ear residue is G29 |
| G16 | B1 | `candidates` caption (`GameControlPanel.vue:980`) still ADMITTED; in flow, unpaid π | CLOSED by slice 2's B1b `06fee424` (§6.2): `what fits`, admission STRUCK, `ADMITTED` empty; label box byte-identical both engines at 1280×800 and 390×844 |
| G17 | B1 | copy gate blind spots: the cell core template literal (gap 2) and the domain-keyed `PAPER_NOTE_COPY` vs `COPY_KEYS` (gap 6, `check-copy-register.mjs:243`); class on second occurrence | CLOSED by slice 2: gap 6 by B1b `06fee424` (`COPY_TABLE_NAME`), gap 2 + the template-literal grammar by G17 `7686f904` + `4235e382` + `8d334845` (§6.2) — 15 live shapes planted past the gate now RED, self-test 18 → 52 colours, lexicon 25 unchanged, `ADMITTED` empty; the surviving blind-shape family is G31/G32 (W5 gate estate) |
| G18 | B1 | whole-tree π instrument `probe/rect-census.mjs` launches chromium only; webkit whole-tree readings exist only in verify-r1 §3 / verify-r2 §3 by DOM swap | chair — probe widening booked to the estate, not this lane |
| G19 | B1 | `c391665c` commit message overclaims ("the machine stops naming itself to a player"); stands unrewritten | chair — firing line + README §1 are the correction of record |
| G20 | B1 | README record: §8 MUST-2 cite `check-copy-register.mjs:141-148` should be `:137-145` (or `:143-145`); §7 gap 4 names three residues, grep finds seven (four are the recut's own narration); §8 MUST-1 row should name `e4c45f53` as the narrowing commit | chair — DONE 2026-09-18: all three edits in B1/README.md (§8 MUST-2 `:137-145`, §7 gap 4 names the seven hits, §8 MUST-1 names `e4c45f53` and the chair's ruling that G15/G16 are cured by exec slice 2's B1b) |
| G21 | B1 | copy by ear — `finishes the board for you` (third-person indicative beside imperative siblings) and `revealed answer N` — verifier-read, not owner-read | owner U-10 re-look |
| G22 | all | 390×844 and 820×1180 are engine viewport emulation, not devices | owner U-10 re-look + W8 §8.3 |
| G23 | all | production carries none of this until WGATE (rebuild so dist ships the CH-69 wasm; production pass; ballots; floors restamp) | chair — WGATE |

### 5b. Rows from the integration refute (`integrate/REFUTE-script.md`, 2026-09-18)

| # | finding | owner |
|---|---|---|
| R0 | BLOCKING for the fold COMMIT, not the picks: `check-evidence-policy` is green in the integration worktree (no W7 evidence there) and RED in the main tree — `evidence/w7` = 5,794,248 B (264 png) against the 2,097,152 B wave cap. The sweep (keep only adjudication-cited frames) precedes any `git add` of W7 evidence | chair — SWEEP DONE 2026-09-18 (`loop/pass1/SWEEP.md`: 21 adjudication-cited frames kept, 186 deleted, 3.81 MB freed; exec frames recompressed lossless to 342,333 B). The tree still reads 2,149,109 B because pass 2's lanes are banking their own frames (794,614 B live); those sweep at pass 2's bank. What the FOLD COMMIT tracks is r0 (554,594 B, already tracked) + exec (342,333 B) = 896,927 B, under the cap; pass-1/2 frames are tracked only at the W7 record commit after their sweeps |
| R1 | `presence.spec.ts:177` is a DEV-wire row (`?wire=local` behind `import.meta.env.DEV`); a built-dist arm of the default suite can never pass it. Book it with the mechanism, and re-audition it ONCE on master through the default config (dev server) at the fold | chair — LEDGER row + fold re-audition |
| R2 | 17 passing `multiplayer` rows × 2 engines run with `?wire=local` inert on a built dist, i.e. over the LIVE `wss://sudoku-relay.mkbabb.workers.dev` — the e2e green depends on a production service (the WGATE's `T62_REAL_RELAY` knob names the same seam) | chair — record in the wave's e2e row; WGATE |
| R3 | class, second occurrence: `visual-regression.spec.ts`'s in-page negative controls re-measure before the injected rule lands (`:866` a fixed 120 ms wait; `:659` a settle satisfied by two pre-injection reads); `check-sleep-lint` is blind to `:861` because `PANEL_H` is a hoisted probe | W5 gate estate — chair books (trap → config on the 2nd bite) |
| R4 | the script's `5h-dist-greps` exit code proves nothing (only its printed counts do); the refuter's paired-control greps are the record (cured 0/0/0, base 1/1/1, controls hit) | chair — record only |
| R5 | 820×1180 is exercised by no `visual-regression` row (G12 stands); `npm audit` carries 3 moderates under the high gate (vitest `<4.1.11`, dependabot #78/#80) | chair — G12 at the fold's visual pass; the vitest bump lands when no lane shares node_modules |
| R6 | `test:e2e:projects` was absent from the script's 48 (green when the refuter ran it); the throttle built-dist specs were not in the "full battery" wording (67/67 when run) | chair — both rows added to the fold battery list |

## 6. Second slice

Branch `w7/exec` from `e4c45f53` to `8d334845`. Six commits, three cures, in sequence: 3C-4b → B1b → G17. Worktree status at fold: clean but for untracked `web/frontend/.vite-exec.config.ts` (not picked). `git diff --numstat e4c45f53 8d334845`: 9 files — `check-copy-register.mjs` +889/−39, `check-font-coverage.mjs` +31/−1, `GameBoard.vue` +12/−1, `GameBoard.coarseTape.test.ts` +86/−0, `GameBoard.notes.test.ts` +10/−4, `GameControlPanel.vue` +9/−2, `GameControlPanel.test.ts` +3/−1, `classifyError.ts` +16/−2, `e2e/zone-grammar.spec.ts` +3/−1. Evidence under `exec/{3C-4b,B1b,G17}/` lives in the MAIN tree, untracked at `master`: 627,155 B over 139 files, of which 114,740 B is png (3C-4b 2 crops 74,185 B; B1b 4 crops 40,555 B; G17 none).

### 6.1 Cherry-pick order (continuing §1; oldest first)

| # | sha | cure | files | verdict chain |
|---|---|---|---|---|
| 7 | `a649cf5e` | 3C-4b cure | `GameBoard.vue` (+12/−1, one statement at `onGridFocusout` :472), `GameBoard.coarseTape.test.ts` (+71/−0, `keyFocus` helper + 3 rows) | r1 REPAIR (1 MUST, 2 NOTE) |
| 8 | `e1f2304b` | 3C-4b repair r1 | `GameBoard.coarseTape.test.ts` (+15/−0, the off-board row); `GameBoard.vue` untouched (`git diff a649cf5e -- GameBoard.vue` empty) | r2 ACCEPT (0 MUST, 4 NOTE) |
| 9 | `06fee424` | B1b cure | `classifyError.ts:51-52`, `GameControlPanel.vue:980`, `check-copy-register.mjs` (`candidates` admission struck; `COPY_TABLE_NAME` arm; 2 self-test colours), `check-font-coverage.mjs` (`paperNoteCopy` group), `GameBoard.notes.test.ts`, `GameControlPanel.test.ts`, `e2e/zone-grammar.spec.ts` | r1 ACCEPT (0 MUST, 6 NOTE) |
| 10 | `7686f904` | G17 cure | `check-copy-register.mjs` (+263/−13): `SPOKEN_SOURCE_NAME`, `SPOKEN_SOURCE_PROP`, `staticParts`, dedup | r1 REPAIR (3 MUST, 3 NOTE) |
| 11 | `4235e382` | G17 repair r1 | `check-copy-register.mjs` (+305/−43): `SPOKEN_SOURCE_FN`, SCREAMING_SNAKE suffixes, bound `:attr`, assignment arm, `--reach`, byte-offset dedup | r2 REPAIR (2 MUST, 2 NOTE) |
| 12 | `8d334845` | G17 repair r2 | `check-copy-register.mjs` (+292/−8): `UTTERANCE_RETURNS` + `utterers()` (SEED/FORWARD/PASS), `COPY_KEYS` initializer read, plural suffix | r3 ACCEPT (0 MUST, 4 NOTE) |

Bundle identity per cure: 3C-4b cured dist `index-DAj5SdL4MZJz.js`, re-derived by a fresh build at `e1f2304b` (author) and by `cmp` against an independent `--outDir` build (r2); HEAD control `index-Cc6TqSXYnbfW.js` (the `e4c45f53` build; the clear is absent in its `onGridFocusout` at the bundle, present in the cured one, `hoveredPos` compiled identically). B1b cured dist `index-CubiZsMVSwTc.js`, reproduced by author (twice) and r1; control `index-DAj5SdL4MZJz.js`. G17: `index-CubiZsMVSwTc.js` unchanged across `7686f904` → `4235e382` → `8d334845`, `diff -r dist-before dist` exit 0 at every round (r2 verifier: a third independent build agrees); `dist-before/` at G17 is the `06fee424` build (serves `index-CubiZsMVSwTc.js` — see G36). No commit in this slice touches main's `index-9rZPzI5DEcpe.js`.

### 6.2 Per cure

#### 3C-4b — ACCEPTED — `a649cf5e` + `e1f2304b` — closes G8

Seam: `GameBoard.vue:472` `onGridFocusout` gains `if (isCoarse.value) pointedPos.value = null;` — the manifest's own named hardening. `hoveredPos` (:515) untouched, so 3C-4's precedence row stays green. Fine pointer byte-identical. Fires on every grid `focusout`, cell-to-cell and off-board (r1 NOTE-1 measured the off-board arm HEAD `true` → cured `false`; the fourth row pins it).

DELTA declared: none. The cure changes WHICH cell a transient coarse tape names; the resting board is 0.00 px identical. Two crops (74,185 B, chromium 390×844, cells + tape berth): `frames/before-390-chromium-F3.png` (29,397 B, HEAD, focus cell 26, tape anchor x 315.66 unmoved), `frames/after-390-chromium-F3.png` (44,788 B, cured, focus cell 3, anchor 114.55 → 154.77). NOT a matched pair — separate runs, separate rooms, opposite tape orientation (§6 caption at repair r1); the §5.1 anchor table is the proof.

| read F (`probe/strand-arm.mjs`: tap A, `mouseenter` never withdrawn, ArrowRight to peer B) | engine | HEAD | cured |
|---|---|---|---|
| author | chromium | 25→26, anchor col 7 x 315.66 unmoved — STRANDED | 2→3, x 114.55 → 154.77 — PASS |
| author | webkit | 9→10, x 34.11 unmoved — STRANDED | 19→20, x 74.33 → 114.55 — PASS |
| r1 | chromium / webkit | 72→73 x 34.11 unmoved ×2 — STRANDED | 18→19 / 0→1, x 34.11 → 74.33 — PASS ×2 |
| r2 | chromium / webkit | 12→13 x 154.77 unmoved — STRANDED | 10→11 x 74.33 → 114.55; 49→50 x 195.00 → 235.22 — PASS |

Tape count 1 on every read. Reads A–E (`3C-4/verify-r1/focus-arm.mjs`, unmodified) match the banked pose in both engines vs the cured dist.

π (`3B-1/probe/rect-census.mjs`, pinned `?board=`, `reducedMotion: reduce`, HEAD :4258 vs cured :4259, chromium): 1089/1089 · 1049/1049 · 1807/1807 · 1767/1767 — **0.00 px over 5,712 rects**, identical key sets. r1 added webkit 390×844 (1049 + 1767, 0.00 px); r2 re-took 390×844 both engines (5,632 rects, 0.00 px). Surfaces moved: none. Not re-measured at `e1f2304b` (source byte-identical, same bundle hash).

Born-RED: `GameBoard.coarseTape.test.ts` — at `e4c45f53` (cure reverted) exit 1, Tests 2 failed | 10 passed (12) (`expected 'brave-otter' to contain 'quiet-lynx'`; `nobody wrote cell 8: expected true to be false`); GREEN 12 passed. Repair r1's fourth row on the reverted twin: exit 1, 3 failed | 10 passed (13) (`nobody is on the board: expected true to be false` at :286); GREEN 13 passed. Reproduced off-branch by r1 and r2. Gate attacked: r1 planted guard-removed / clear-moved-inside-`!contains` / precedence-inverted, each red on a different row (the inversion caught by 3C-4's own banked row); r2 planted the clear moved to `onGridFocusin` — the ONLY row that reds is the fourth row.

| gate | exit |
|---|---|
| rows RED at `e4c45f53` / GREEN cured / fourth row RED on twin / GREEN | 1 (designed) / 0 / 1 (designed) / 0 |
| `npx vue-tsc --noEmit` · `typecheck:e2e` | 0 ×2 |
| `npx vitest run` | 0 — 68 files / 829 tests at `a649cf5e`, 830 at `e1f2304b` (r1 confirms; r2 read 68/830 with exit 1 on two wall-clock rows that pass alone — G28) |
| `npm run lint` · `lint:eslint` · `lint:copy` · `lint:live-regions` · `lint:motion` · `lint:boundary` · `lint:tdz` · `lint:ink` · `lint:theme-selectors` · `lint:lanes` · `test:font-coverage` | 0 ×11 (r1, r2 confirm ×12 bare) |
| `npx vite build --config .vite-exec.config.ts` | 0 — `index-DAj5SdL4MZJz.js`; built CSS greps 0 of `not all and (hover:hover) and (pointer:fine)` across 7 stylesheets |
| goldens vs :4259 | 0 — 4 passed at cure, repair, r1, r2; nothing re-baselined |
| `e2e/visual-regression.spec.ts` chromium + webkit | 0 — 24 passed at `--workers=2` at `a649cf5e` after two contention reds (`browserContext.close`, symmetric on HEAD); NOT re-run at `e1f2304b` or by either verifier |
| `node scripts/check-evidence-policy.mjs` | **1** — wave-level, pre-dating (5,515,159 → 5,793,986 B across the rounds; now G35) |
| `npm run test:e2e` full battery | **NOT RUN** (port fence; G42) |
| real device / Safari / simulator | **NOT RUN** (M19; G10/G22) |

#### B1b — ACCEPTED — `06fee424` — closes G15 + G16

Seam: `classifyError.ts:51` `PAPER_NOTE_COPY.budget` `the solver ran out of steps on this board.` → `this board took too many steps to finish.`; `:52` `.network` `couldn't reach the solver.` → `the board's helper stopped working. reload the page.` (both via `GameBoard.vue:45 → :904 → :1167 → SolverErrorNote.vue:46`, `role="alert"`); `GameControlPanel.vue:980` caption `candidates` → `what fits`, admission STRUCK, `ADMITTED` empty. Gate tightened: `COPY_TABLE_NAME` arm (a declaration whose NAME says COPY is a copy table), 18 → 20 self-test colours, stale-admission colour re-minted from a synthetic entry; `check-font-coverage` gains `paperNoteCopy` (the note's four sentences under the ransom-note check for the first time; 0 new glyphs, no re-cut). Enumeration (author + r1 sweep of `src/**`): no other machine-naming string reaches a player; `solver.worker.ts`/`transport.ts` messages end in `SolverError.message` → `useGameState.errorMessage`, read by no component (G30).

DELTA declared: (1) caption ink inside an unchanged box; (2) the note's `<p>` width inside an unchanged card. Alert widths chromium / webkit: budget 283.13 → 280.05 / 283.20 → 280.14; network 174.67 → 357.75 / 174.73 → 357.86. Card `133.89,751.03,632.00,48.78` and `try again` `676.52,759.03,75.78,32.78` identical every run; `retryButton=1` on all four arms (`classifyCode`'s `retryable` defaults true). Frames (4, 40,555 B, 1280×800): `before-1280-chromium-caption.png` (8,634), `after-1280-chromium-caption.png` (8,467), `after-1280-chromium-note-budget.png` (10,051), `after-1280-webkit-note-network.png` (13,403). The alert's before side ships as numbers. Alert driven by fault injection at the network layer (`probe/note-arm.mjs` fulfils the built worker chunk with a stub; shipped page, bundle, classifier).

| caption label box (`probe/caption-box.mjs`) | before | after |
|---|---|---|
| 1280×800 chromium / webkit | `853.89,855.80,268.22,15.44` / `853.84,855.47,268.31,15.44` | identical |
| 390×844 chromium / webkit (r1; the `flex: 0 0 3.75rem` phone branch) | `16,1191.55,60,13.38` / `16,1191.53,60,13.38` — one line | identical |

π rest pose (chromium, control = `e1f2304b` build `index-DAj5SdL4MZJz.js` :4258 vs `index-CubiZsMVSwTc.js` :4259): 1089/1089 · 1049/1049 · 1807/1807 · 1767/1767 — **0.00 px over 5,712 rects**. r1 re-took all four in BOTH engines with a full-enumeration diff: moved 0, onlyA 0, onlyB 0. Driven π (alert up, chromium, 1,103 rects): BUDGET_EXCEEDED max 3.08 px, WORKER_FAILURE 183.08 px, exactly 1 rect moved per arm (the note's `<p>`; r1 reproduced the count with a full-enumeration diff — the banked `diff-note.txt` shows only the worst rect, G34).

Born-RED: `npm run lint:copy` with both admissions struck and the words not yet recut — exit 1, 3 failures (`GameControlPanel.vue:980 "candidates"`, `classifyError.ts:51 "solver"`, `:52 "solver"`); GREEN exit 0, 0 hits / 0 admitted / 0 unadmitted. The parent gate over the same parent sources exits 0 (1 hit, 1 admitted; the two `solver` sentences unseen) — the blind spot measured. Reproduced off-branch by r1. Unit rows: words reverted → exit 1, Test Files 2 failed (2), Tests 3 failed | 45 passed (48). Gate attacked (r1): RED on single quotes and on a `.vue` script-setup table; blind on `Object.freeze`, `export default`, class `static COPY`, lowercase `copy`; over-reads quoted keys and nested non-copy values (loud direction).

| gate | exit |
|---|---|
| `npx vue-tsc --noEmit` · `typecheck:e2e` | 0 ×2 |
| `npx vitest run` | 0 — 68 files / 830 tests (r1 confirms) |
| `npm run lint` · `npx eslint .` · `lint:copy` (20 colours) · `lint:live-regions` · `lint:motion` (34 specs) · `lint:boundary` · `lint:ink` · `lint:theme-selectors` | 0 ×8 |
| `test:font-coverage` | 0 — Patrick Hand 46 codepoints / 4312 B, 21 declared strings over 4 groups |
| `npx vite build --config .vite-exec.config.ts` | 0 — `index-CubiZsMVSwTc.js` (author ×2, r1) |
| goldens vs cured dist | 0 — 4 passed (author :4259, r1 :4257), nothing re-baselined |
| `e2e/zone-grammar.spec.ts`, both engines | 0 — 22 passed (throwaway config, deleted); NOT re-run by r1 (same assertion read directly) |
| note arm, both engines × both codes | 0 ×4 — `role=alert`, `retryButton=1`, names-the-machine true → false |
| `e2e/a11y.spec.ts` · `visual-regression.spec.ts` | NOT RUN — neither reads a moved string (grepped) |
| whole-tree π webkit by the estate's instrument | NOT RUN (G18); webkit read at both DELTA surfaces directly |
| `node scripts/check-evidence-policy.mjs` | **1** — pre-existing (G35) |
| `npm run test:e2e` · real device | **NOT RUN** (G42; M19) |

#### G17 — ACCEPTED — `7686f904` + `4235e382` + `8d334845` — closes G17

Seam: `web/frontend/scripts/check-copy-register.mjs` only, 876 → 1,422 lines across three commits; enters no bundle graph. Rule: the gate DISCOVERS its subjects — a NAME that says copy (`aria*`, `*Label/Text/Caption/Heading/Sublabel/Placeholder/Title/Note/Line/Word/Name/Message/Sentence/Announce/Announcement`, TitleCase and SCREAMING_SNAKE, singular and plural) on a declaration, an object property, a `function` whose declared return type contains `string`, or an assignment (`.value` allowed); a bound `:attr` / `v-bind:attr`; a `COPY_KEY` read through its initializer; and the VOICE a `useLiveRegion()` destructure hands back, followed through a `function` wrapper (FORWARD) and a passed parameter (PASS) to a fixed point. Template literals read by STATIC segments only. De-duplication by byte offset. `--reach` (new) prints matches / distinct sources / literal-holding sources and the utterance census. Lexicon 25 → 25, `ADMITTED` empty, `ALLOW` 2 files, no `JARGON`/`ADMITTED`/`ALLOW` hunk in any of the three diffs. Finding at r0: half of the manifest's G17 row (gap 6) was already cured by B1b `06fee424`; the manifest row is re-read accordingly (§5, G17).

DELTA declared: none; no product string, template, style or bundled module in any diff. `frames/` absent by intent. Measurable deltas are in the gate's reach: self-test 20 → 28 → 40 → 52 colours; spoken subjects 0 → 33 matches → 51/51/28 (17 files) → 63/63/29 (21 files) + 6 voices across 3 files (`sayBoard, announce` · `sayCopy, say` · `sayDeck, sayGuard`); gate wall time 0.09–0.17 s over 137 files, unchanged across rounds.

| plants on the REAL tree (each reverted, `git status src/` clean) | blind at | RED at |
|---|---|---|
| r0 ablations: `useGameCell.ts:158` core, `GameBoard.vue:702` deal line, `techniqueVoice.ts:190` `ariaLabel:` | `e4c45f53` | `7686f904` ×3 |
| r1's P1–P5: `FURNITURE_NOTE` value, `formatHintNote` return, `StagingBand.vue:200` `:aria-label` template, `useGameState.ts:700` assignment, `DarkModeToggle.vue:7` `:aria-label` ternary | `7686f904` ×5 (exit 0) | `4235e382` ×5 (exit 1, each naming its line) |
| r2's V1–V4/V6/V7: `announce()` `GameBoard.vue:883`, `say()` `GameControlPanel.vue:320`, `sublabel:`/`washi:` call values :363/:364, plural tables `techniqueVoice.ts:75/:76` | `4235e382` ×6 (exit 0) | `8d334845` ×6 (exit 1) |
| r3's own: `sayDeck()` `GameGallery.vue:405`, `sayGuard()` `:815` (`engine`), plus VR3-A wrapper-over-wrapper, VR3-E/G/N/J | `4235e382` | `8d334845` |

Born-RED per commit: self-test controls spliced into the parent scanner — at `e4c45f53` 4/4 `0 offence(s), FAILED` exit 2 (at `06fee424` 2/4 FAILED — the §1 finding); at `7686f904` 6 FAILED exit 2; at `4235e382` 6 FAILED exit 2. GREEN at each cured commit, all colours "as required". Twins and fences GREEN on both scanners at every round. Reproduced off-branch by r1, r2, r3.

π: 0.00 px over 5,712 rects at every round (chromium, `dist-before` :4258 vs `dist` :4259), and byte-identity underneath: `diff -r dist-before dist` exit 0 at r0/r1/r2; r2 verifier built a third `--outDir` and `diff -r` agrees both ways. Surfaces moved: none.

| gate | exit |
|---|---|
| `--self-test` (cured) | 0 — 28 / 40 / 52 colours |
| `--reach` | 0 — 63 / 63 / 29 / 21 files; 6 voices / 3 files (r3 byte-identical) |
| `npm run lint:copy` | 0 — 137 files, 0 dashes, 0 hits, 0 admitted, 0 unadmitted (r1, r2, r3 confirm) |
| `npm run lint` · `lint:eslint` · `vue-tsc --noEmit` · `typecheck:e2e` · `typecheck:node` · `lint:live-regions` · `lint:motion` · `test:font-coverage` · `lint:boundary` · `lint:ink` · `lint:theme-selectors` · `lint:lanes` | 0 ×12 at each commit (r3 re-ran eslint, prettier, live-regions only) |
| `npx vitest run` | 0 — 68 files / 830 tests (r1, r2, r3 confirm) |
| `npx vite build` · `diff -r dist-before dist` | 0 / 0 — `index-CubiZsMVSwTc.js` |
| goldens | 0 — 4 passed at every round on the verifier's own port and build |
| π census | 0 — 0.00 px / 5,712 (author each round; r1–r3 did not re-run: null test over identical bytes) |
| `npm run test:e2e` · `visual-regression.spec.ts` · any WebKit arm | **NOT RUN** — no browser arm owed (dist byte-identical); WebKit never launched |
| `lint:knip` · `lint:relay` · `lint:catch` · `lint:theme-tokens` · `lint:tdz` · `lint:sleep` · `test:support-floor` · `test:coverage:floor` · `npm audit` | **NOT RUN** — the fold's battery (§4.4) |
| real device / Safari / simulator | **NOT RUN** (M19) |

### 6.3 Ballot T9-B1 — amendment to §3's firing line

Replace the SCOPE sentence of §3's line with:

```
SCOPE WAS THE BALLOT'S TWO STRINGS; the three residues B1 §7 named (`classifyError.ts:51-52`, rendered via SolverErrorNote.vue:46 in role="alert", and the admitted `candidates` caption at GameControlPanel.vue:980) were recut as their own slice on the chair's ruling of 2026-09-18 — B1b `06fee424` on w7/exec: `this board took too many steps to finish.` / `the board's helper stopped working. reload the page.` / `what fits`; the `candidates` admission struck, ADMITTED empty; the copy gate's copy-table arm born (B1b) and its discovery grammar widened (G17 `7686f904` + `4235e382` + `8d334845`, 15 planted shapes now RED). π: rest pose 0.00 px / 5,712; with the alert up, 1 rect of 1,103 (the note's own <p>, 3.08 px budget / 183.08 px network). The words are gate- and verifier-read, owner-read at U-10 (G29).
```

### 6.4 Gaps — numbered from G24, each with an owner

| # | cure | gap | owner |
|---|---|---|---|
| G24 | 3C-4b | a coarse hover with NO focus anywhere in the grid mounts a tape (`hoveredPos` short-circuits at `pointedPos ?? …`, `unitFocused` never read), at HEAD and cured alike (r1 ADV4 true/true); narrow only because a real pointer also fires `mouseleave` (`DigitCell.vue:227-228`); the device that synthesises one and not the other with no focus in the grid is G8's family, not this cure's | W7 §6 — chair's row (book it as a row, not a gap list) |
| G25 | 3C-4b | pointer-residue design pair: a coarse device that really hovers (tablet + trackpad, `matchMedia("(pointer: coarse)")` is the PRIMARY pointer) now has a live, correct hover dropped on every keyboard focus move until the pointer re-enters a cell (r2 NOTE-4, unbooked in the README); its mirror, a fine pointer hovering A with focus on B still tapes A by design (README gap 9) | chair — record both as shipped grammar; W7 §6 only if the design is reopened |
| G26 | 3C-4b | the off-board-blur arm is pinned by a jsdom row only; no browser instrument reads focus leaving the board with a coarse hover live (an F4 step for `strand-arm.mjs`); the arm has no guard against `boardGeneration` bumping mid-read (`GameBoard.vue:824` resets `focusedPos`; one run discarded at the cure) | W7 §6 — probe row (class of G6/G11) |
| G27 | 3C-4b | record hygiene (r2 NOTEs 1–3): README §1 says `GameBoard.vue` +13/−1 (numstat 12/1) and the test file +71/−0 three rows (now +71 at `a649cf5e` + 15 at `e1f2304b`, four rows); §1 "pinned by the third new row" now points at the off-board row, not the fine-pointer control; §9.1 "the verifier measured it wrong on both sides" reads backwards | chair — three README edits (class of G7/G20) |
| G28 | 3C-4b · all | this box's contention now reds bare gates: r2's full `npx vitest run` exit 1 on two wall-clock rows (`technique.test.ts` latency worst 563.03 ms; `useSession.stress.test.ts` 55.7 s vs 30 s timeout), both green alone; `visual-regression.spec.ts` red twice on `browserContext.close` before 24/24 at `--workers=2`, symmetric on HEAD; NOT re-run at `e1f2304b`, `06fee424` or any G17 commit by anyone | chair — §4.4 runs both on master with the box quiet; a lane reading a bare vitest exit under contention chunks or re-runs before calling a regression (lane law) |
| G29 | B1b | copy by ear: `what fits`, `this board took too many steps to finish.`, `the board's helper stopped working. reload the page.` are author-, gate- and verifier-read, not owner-read; the network note says `reload the page.` beside a `try again` button drawn on EVERY paper note (`classifyCode`'s `retryable` defaults true; `RETRYABLE_CODES` excludes WORKER_FAILURE) — the button-on-a-non-retryable-fault predates the slice, the competing sentence does not | owner U-10 re-look (class of G21); chair rules whether `GameBoard.vue:904` should pass `retryable` from `RETRYABLE_CODES` |
| G30 | B1b | `useGameState.errorMessage` is a dangling ref: written at :623/:700/:823 with raw `Error.message` (`solver worker crashed`, `Failed to get board`, `Solve failed`, `Hint unavailable`), exported at :1171, read by no component or spec; G17 r1's assignment arm now reads the literal fallbacks, but the `e.message` path carries `transport.ts`'s machine-naming sentences past every gate the day a component renders it | W5 gate estate / W7 §6 — chair books (delete the ref or gate its readers) |
| G31 | B1b · G17 | copy-gate blind shapes, silent-miss direction (every one stated and none live in `src/` today, by grep not proof): name-rule heuristic (`blurb`, `banner`); `Record<…, string>` whose TYPE says copy (want-0 control, fixture `ROWS`); `Object.freeze`, `export default`, class `static COPY`, lowercase `copy`; un-annotated copy `function`; class member `get ariaLabel()`; aliased/member assignment (`this.x =`); single-quoted bound attribute; FORWARD on an arrow (`const announce = (l) => sayBoard(l)`); a transforming wrapper (`sayBoard(line.trim())`); optional call `sayBoard?.()`; destructure default `{ say: sayBoard = noop }`; PASS receiver declared as an arrow; a voice across a module boundary; PASS length disagreement; nested backtick in an interpolation; `initializer()`'s semicolon trust; regex over masked source, not a parser; no unit row over the scanner | W5 gate estate — chair books; the parser-backed arm is the terminal cure |
| G32 | B1b · G17 | copy-gate false-RED classes, loud direction: quoted KEYS and nested non-copy values inside a copy table are read (`"worker": …`, `filter: "url(#solver-ink)"`); the plural suffix reads `const LINES = ["worker-ready", …]` as a copy table (green at `4235e382`, red at `8d334845`, undisclosed in §10.3); a local name shadowing a voice is a voice (file scope); a `COPY_KEY` in a TYPE position reds (pre-existing) — the only escape is an `ADMITTED` entry, which the slice emptied on purpose | W5 gate estate — chair books beside G31 |
| G33 | B1b | the alert is `role="alert"` and its text is all a screen reader gets; no browser spec asserts the alert's spoken text (unit rows hold it); the alert was reached by fault injection, never by a real budget exhaustion (needs a 16×16 HARD board, W4's subject) or a real dead worker | W7 §6 — book a spec row if the chair wants the alert gated; injection recorded, no row owed |
| G34 | B1b | record hygiene (r1 NOTEs 1/3/4/6): §8 gap 3 says "two instead of three" blind spots (r1 planted five more — state the shape family `const|let|var <…COPY…> = {`); "ONE rect of 1,103" rests on an instrument whose full-enumeration output is not banked (`diff-note.txt` prints the worst rect only; r1 reproduced moved 1 / onlyA 0 / onlyB 0); §8 gap 7 says the phone branch was "never photographed" where r1 measured it (label 60 × 13.38, one line, both engines); §8 gap 5 says "168 KB" where the tree is 97,043 B at r1 (108,411 B with verify-r1.md) | chair — four README edits (class of G20) |
| G35 | all | `check-evidence-policy` at the main tree TODAY: per-wave 3,013,564 B > 2,097,152 B on `evidence/w7` (the R0 sweep landed; pass-2 lanes are banking) plus ONE per-image breach, `loop/pass2/prototype/CTRL-TABS/frames/f4-390-light-board-edge-berth.png` 174,499 B > 153,600 B. Slice 2 adds 114,740 B of png (all under the per-image cap). What the FOLD COMMIT tracks: r0 554,594 + exec slice 1 342,333 + exec slice 2 114,740 = **1,011,667 B**, under the cap; the pass-2 breach and the per-image breach sweep at pass 2's bank, not at the fold | chair — R0's disposition extended; the per-image row is pass 2's lane, not the fold's |
| G36 | G17 | the r2 RETURN's π field says `dist-before/` is "the build at `e4c45f53`, before any of the three commits"; the worktree's `dist-before/index.html` serves `index-CubiZsMVSwTc.js`, which is the `06fee424` build (r0's own §0: "dist-before rebuilt before it"; `e4c45f53`'s bundle is `index-Cc6TqSXYnbfW.js`). The byte-identity chain (dist-before == r0 == r1 == r2 dist) holds; only the provenance sentence is wrong, and it is not in the README | chair — record; G13's class (rebuild the control on master rather than trust a lane's) |
| G37 | G17 | record hygiene (r3 NOTEs 1–4): four blind utterance shapes unnamed in §10.6 (transforming wrapper, optional call, destructure default, arrow PASS receiver — fixtures in `verify-r3/vr3-controls-injector.mjs`); the plural false-RED class undisclosed beside the `NOTES → ROWS` rename in §10.3; the header's fixed-point claim ("a wrapper over a wrapper") has no self-test colour (VR3-A proves it works); `--reach`'s utterance census prints seeded and derived voices flat | chair — §10.3/§10.6 edits; VR3-A as a 53rd colour is one splice, chair's call |
| G38 | G17 | CLASS, third occurrence: three verify rounds each found live copy the gate could not read, every one by a PLANT, never by a census; two of r2's four were shapes the gate's own header already claimed in prose. Rule for every name-rule gate: ship its subject listing (`--reach`), a plant per shape its header claims, and the list of CALL SITES its subjects' values pass through | W5 gate estate — chair books as a class row (trap → config on the 2nd bite; this is the 3rd) |
| G39 | G17 · lanes | port-fence incident (G17 verify-r1 §5): the verifier killed a listener on :4259 by PORT without re-reading its process line; it was `w8-bake`'s `perf-rig/probe-server.mjs`, restarted by that lane within seconds, no file touched. The slice brief's allocation (4257–4259 to the exec lane) is STALE while w8-bake holds 4259 | chair — lane law: kill by PID banked at start, never by port at the end; re-issue the port allocation per lane |
| G40 | 3C-4b · B1b | `e2e/visual-regression.spec.ts` and `e2e/a11y.spec.ts` NOT run against `06fee424` or any G17 commit (B1b grepped: neither reads a moved string; G17: dist byte-identical); the 24/24 stands only at `a649cf5e` | chair — §4.4 runs both on the fold commit at the three viewports (G12) |
| G41 | 3C-4b · B1b | no real device; the shape 3C-4b is FOR (a phone with an external keyboard) is a hand-dispatched `mouseenter` plus a key; B1b's phone caption branch is engine emulation | owner U-10 + W8 §8.3 (G10/G22 stand) |
| G42 | all | the integration battery + refute (G2, `integrate/BATTERY-script.md` on `t9/integrate` @ `cf8d53f4`) covered the SIX slice-1 picks only; `npm run test:e2e` was run by no slice-2 lane. The twelve picks need the same deterministic battery + non-author refute before the fold; expected deltas are §6.5 | chair — re-run `integrate-battery.sh` on the twelve picks over `a8fee1f5`; one Opus refuter after |

### 6.5 Amendments to §4.4 for the twelve picks

- `npx vitest run` expected **68 files / 830 tests** (826 + 3C-4b's four rows), not 826.
- Dist identity on master after the picks: `index-CubiZsMVSwTc.js` (B1b's; G17 adds no byte) — subject to the CH-69 wasm rebuild the chair already owes, which mints a new hash; the invariant is the strings, not the hash.
- Dist greps, all 0: `not all and (hover:hover) and (pointer:fine)`, `solver finishes the board`, `solver's answer`, **`ran out of steps`, `reach the solver`, `"candidates"`** (the quoted text node — bare `candidates` hits 26 identifiers such as `candidatesId`/`candidatesPinned` in either bundle and proves nothing); paired controls hit once each: `took too many steps`, `helper stopped working`, `what fits` (read 1/1/1 and 0/0/0 on the worktree's `index-CubiZsMVSwTc.js` at `8d334845`).
- `npm run lint:copy` expected `0 hit(s), 0 admitted, 0 unadmitted (lexicon: 25 entries)`, `--self-test` 52 colours; `node scripts/check-copy-register.mjs --reach` prints 63 / 63 / 29 / 21 files and 6 voices — a different count on master is a finding, not noise.
- `npm run test:font-coverage`: 21 declared strings over 4 groups (the `paperNoteCopy` group is new; the woff2 is unchanged — 46 codepoints / 4312 B).
- `check-evidence-policy` on the fold commit's TRACKED set: 1,011,667 B of png under `evidence/w7` (G35); the main-tree reading stays RED until pass 2 sweeps.
- DISPOSITIONS §2: the T9-B1 line is §3 with §6.3's SCOPE sentence.
- LEDGER: G24–G42 with the owners above; G8, G15, G16, G17 closed with the shas on their §5 rows.

## 7. The fold battery (chair, 2026-09-18) — `t9/integrate` @ `4b3b19b3` = `a8fee1f5` + the twelve picks

Run by the same deterministic script as §5's G2 row (`integrate/BATTERY-logs-fold.md`, one log per gate under `integrate/logs-fold/`, exit codes read from the field), then `integrate/logs-fold/results-extras.tsv` for §5b R6's two rows and T9-R1's re-audition. The host had rebooted at 12:25; the box was unloaded (48 gates in 7 minutes where the 2026-09-18 morning run took the afternoon).

| arm | reading |
|---|---|
| typecheck ×4 · lint ×5 · gate scripts ×12 | exit 0 ×21 |
| `test:unit:report -- --coverage` · `test:unit:count` · `test:coverage:floor` · `test:unit:relay` | 0 ×4 — **68 files / 830 tests** (§6.5's count), floor 729; coverage floor GREEN, 12 scopes |
| `vite build` (`.vite-integrate.config.ts`) · dist-identity | 0 — `index-CubiZsMVSwTc.js` (§6.5's identity) · index.html md5 `a8421b0ffe8ad72809f86fdb4ac50732` · 43 files / 806.3 KB; wasm `csp_solver_wasm_bg-BJYevEYE.wasm` 123,336 B sha256 `b908e586…2fc50` = `csp-solver/wasm/pkg` byte-for-byte (the CH-69 rebuild is G23's, unchanged here) |
| dist greps (`logs-fold/5h2-dist-greps-slice2.log`; the script's own `5h` row printed 112 for the four new strings — a quoting fault in the chair's edit, the row is void, this log is the record) | 0 files: `solver finishes the board`, `solver's answer`, `ran out of steps`, `reach the solver`, `"candidates"`, `not all and (hover:hover) and (pointer:fine)`; 1 file each: `finishes the board for you`, `revealed answer`, `what fits`, `took too many steps` |
| prod-shake · deploy-gate · edge-probe · golden-bytes · gen-latency | 0 ×5 (gen-latency 10/10 cells under ceiling) |
| doc-truth · ledger-diff · evidence-policy · npm audit high | 0 ×4 — 42/42; GREEN, 7 open rows after T9-R1/R2/R3 were booked (`6b2`/`6c2` logs re-run after the edit; the battery's own `6c` read 4 rows, pre-edit); evidence-policy PASS in the worktree (no W7 evidence there — the main tree's reading stays RED on `evidence/w7` until the pass sweeps, G35); audit 0 high (3 moderates, R5) |
| goldens off the built dist (:4254) | 0 — 4 passed, `git status e2e` empty |
| `visual-regression.spec.ts` both engines | 0 — 24 passed (the spec is a 1280×800 instrument: one `viewport:` at `:824`; the intake's other two viewports are read by the π census below, not by this spec — G12's reading) |
| `npm run test:e2e` full, both engines, `--workers 4` | **1** — 469 passed / 3 failed / 4 skipped: `presence.spec.ts:177` chromium + webkit (T9-R1), `multiplayer.spec.ts:320` chromium (T9-R2). Reds re-run on the base dist (:4255): 7 failed (`:241` ×2, `:265`, `:320` ×2, `:177` ×2); on the cured dist again: 4 failed (`:241`, `:320`, `:177` ×2). No red is cured-only; the base arm is the worse of the two under contention. |
| R6 — `test:e2e:projects` · `test:e2e:retries` | 0 ×2 |
| R6 — throttle built-dist specs (`playwright-throttle.config.ts`, `PLAYWRIGHT_BASE_URL` at the cured :4254) | 0 — 67 passed |
| T9-R1 re-audition — `e2e/presence.spec.ts` through a DEV server (`playwright-presence-dev.config.ts`: the default config with its webServer on :4256 instead of :3000, `reuseExistingServer: false`) | **0 — 2 passed** (chromium + webkit). The row passes where `?wire=local` is honoured and can only fail on a built dist: the ledger row's mechanism is confirmed, not a defect |
| π, the whole tree, three viewports × two engines (`integrate/rect-census-fold.mjs` = 3B-1's probe + `ENGINE` + 820×1180; base `index-9rZPzI5DEcpe.js` :4255 vs cured :4254; `logs-fold/pi/diff-*.log`) | board 1280×800: **1 rect of 1,089** moved in each engine — the Solve tape's span (`…/button:3/span:3`), width 184.61 → 168.09 chromium (16.52 px, B1's declared number), 197.05 → 179.20 webkit (17.85 px; B1 declared 17.75 — a 0.10 px difference on the webkit reading, recorded, not explained). Every other surface **0.00 px**: board 390×844 (1049) and 820×1180 (1049), gallery 1280×800 (1807), 390×844 (1767), 820×1180 (1767), both engines. 820×1180 now has a webkit witness (G12 closes at this row). |

Not run, by law: `npm ci` (node_modules is shared with the live W7 pass-2 and W8 lanes); real Safari / iOS (M19). The fold onto master waits on §4's precondition 1 (pass 2's last prototype batch has started); master then fast-forwards to `t9/integrate` (which carries the DISPOSITIONS + LEDGER edits as its thirteenth commit) and the fold commit adds `evidence/w7/exec/`.
