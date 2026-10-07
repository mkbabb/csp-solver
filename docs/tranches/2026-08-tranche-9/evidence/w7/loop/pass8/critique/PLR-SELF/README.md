# PLR-SELF · pass-8 CRITIQUE

I'm the critic. I didn't write the charter, the prototype or the spec. Base and π control: `74a2b5d9`.

**Convergence: 92 (+1). Verdict: ADVANCE. §11 on the leader: 92.**

Every number I re-derived reproduces: the bank, the pass-7 plant on both re-cut rows, the dark erase, check 8, and 19 cells of the key in both engines. Pass 8 closed the four defects pass 7 named, and they now have negatives that red.

The debt guard is re-cut, but it doesn't ship its clause-sabotage battery (LAWS P7 §F(ii)). I deleted each of its three forgiveness clauses in turn:

- Every landed row stays GREEN: 10/10 per clause, both engines.
- Each deletion swallows a real activation inside the 350 ms window. The worst case is an ordinary mouse click, and a keyboard Enter is also swallowed.

The four-band row is GREEN only at a thickness the lane chose (`thick: 1.5`, against the law's 2·DPR). The key is PLACE's area *measure* with a threshold the lane fitted; it is not the chair's *no-growth* primitive. It still has a one-width cliff of pass 7's shape.

## 0 · Gaps first (exact, open)

1. **The debt guard's forgiveness clauses have no plant; each deletion is GREEN on every row and costs a real activation** (LAWS P7 §F(ii); registry-v7 §2.5).
   - **Battery.** Rows: `click with no press`, `labelled as a mouse`, `a tap opens the mark`, `a mouse press opens`, `Space and Enter`. Both engines, 10/10 GREEN for each plant:
     - S1: `onClick` no longer clears `owedAt`
     - S2: `onPress` no longer forgives
     - S3: `onKey` no longer forgives

     The lane's D1/D2 plant only the constant `TAP_CLICK_MS`.
   - **What each deletion costs** (critic probe, 390×844 coarse: a tap, then a second activation about 100 ms later; logs `forgive-*.log`). The clean tree toggles in every arm listed below:
     - **S1** swallows chromium's own-delivery press-less click at +109 ms (`["false","true"]`; clean +113 ms toggles).
     - **S2** swallows a real **mouse click** (press + release) at +111–120 ms in 3 of 4 arms: chromium withheld, WebKit own, WebKit withheld. A hybrid touch-and-mouse device pays this.
     - **S3** swallows a **keyboard Enter** at +117–143 ms in the same 3 of 4 arms.

   These are the "press, key or click ends the debt" clauses. Pass 8's own comment names them as the guard's sequence law, and nothing gates them.
2. **Row 3 is not closed under the law: B3 passes only at a thickness the lane chose.** The landed row calls `edgeGate(..., thick: 1.5)`, which gives a floor of 1.35. At the probe's default (2 × 0.9 = 1.80), B3 reds every band of the lobby in every arm I read: depth 1.49–1.51, 6 regimes × 2 engines (`critic-regimes.log`).
   - The lane declares this (its gap 1).
   - LAWS P7 §E(vi) says no lane re-parameterises the probe to pass. Registry-v7 ruling 6 sets the floor at ≥ 2·DPR.
   - The margin left at 1.5 is 0.14 px: a frame thinned to 1.4 px would pass.

   The chair must rule whether drawn frames owe 2 px (the house `HandDrawnOutline` 1.5 stroke on the wells and both head sheets). Until then row 3 is **open**, not "closed (gap 1)".
3. **The key is PLACE's area measure with a lane-fitted threshold, not the chair's primitive.**
   - Registry-v7 §3.3 grafts PLACE's rule: "add only what does not grow the covered area on both axes". The key instead keeps four rows while the added rows' covered share is ≤ `UNDER_BOARD = 0.7`, so it allows growth: the desk covers 4 cells against 2.
   - The landed row pins `UNDER_BOARD` inside (0.684, 0.719), a window read off the lane's own sweep of its own number. The row can fail (K4, and the pass-7 bytes red it), but the invariant it states is the design restated.
   - **The cliff class survives.** At 1040 → 1048×768 coarse the pose flips from 1 row / 3 cells to 4 rows / 6 cells over one 8 px step, with the board moving continuously (left 76 → 80). I re-read it in both engines. This is pass 7's shape (700 → 712: 1/4 → 4/8).
   - The comment's claim that the flip "lands on the board's move" holds only in the 800-tall class. There, 800 → 802 and 820×800 → 830 are both the layout's own step (board 640 → 672); I re-read the second, and it agrees in both engines.
4. **The fraction is blind to the cell pitch.** One fraction costs about 3× the cells on 16×16:
   - 812×375: 4 rows over 18 cells vs 12, fraction 0.100
   - 1280×800 desk: 12 vs 4
   - **1366×768 fine (unpriced): 9×9 4/2, 16×16 4/6**, both engines
   - **1194×834 coarse (unpriced; the 11-inch tablet landscape): 4/4**, both engines

   LAWS P7 §E says anything sized by `useBoardShape` reads the widest board at every cell it names. These two common cells are not in NAMES_OVER_CELLS or the comment.
5. **The four-band row reads one regime** (`reducedMotion: 'reduce'`, fine, no contrast preference). LAWS P7 §E(i) owes the `no-preference`, `pointer: coarse` and `prefers-contrast: more` arms in both themes, with plants in the arms the row doesn't emulate. The lane doesn't declare this.
   - My read of those six arms per engine holds the verdict: clean GREEN at the lane's 1.5, X4 and THIN_1PX RED in all 12.
   - Core medians: chromium 12.7–17.5, WebKit 12.6–15.8. `contrast: more` leaves the ink byte-identical.

   So the cure holds, but the landed row doesn't carry the arms.
6. **`e2e/lib/edge-bands.d.mts` lands inside the ONE copy's home as a product file**, not as a PROPOSED diff under `instruments/` (LAWS §C, §I).
   - Its `[k: string]: unknown` option bag leaves every option untyped: a misspelt `thick` compiles.
   - NOTE-ERASE lands a second hand-rolled `postpaint.d.mts` the same way. The homes ship no types, so every TS consumer will mint its own. **This is the chair's row**: types for `homes.diff`.
7. **An undeclared semantic flip.** `cramped = … || !short || …` now takes the short pose when the second trial read returns `null`. Pass 7's `!!short && …` kept the tall pose. It's a masked fallback direction change, with no row and no note.
8. **The debt's bound sits at a platform edge nobody has read.** `touch-action: manipulation` is scoped to `.board-cells` only (`index.css:529–534`); the mark lives outside it.
   - The comment asserts that 350 ms is "the longest a tap's own click can trail its release".
   - If a real iOS tap's own click lands at ≥ 350 ms, the strict `<` reads it as a new click and the sheet toggles back shut (D2's failure).
   - This is unwitnessed (M19). It is more specific than the lane's general "real iOS unwitnessed".
9. **The desk row's `top: 124` is 0.05 px from a rounding flip.** Chromium's board top reads 124.45–124.5 (`Math.round` → 124). A sub-pixel layout drift reds the sheet row for a reason that isn't the sheet's.
10. **Declared by the lane and reproduced or carried, not re-cured:**
    - check 8 FLOOR BAND: `test:e2e:projects` exit 1 on a clean archive of the bank (live 256/254, owes 218/216 vs floors 214/212); the fold's
    - T9-R8 on the state line (cited)
    - π rests on the control's own bimodal poses
    - `lint:bands` / `lint:verbs` absent on `74a2b5d9`
    - B-NAMES unframed
    - COUNT's peer-id pin not applicable on the solo desk
    - room rows dev-vs-dev
    - real iOS

## 1 · Re-derived (numbers first)

Box load was 49–256 (1-min) through every run below; no timing row is gated.

| what | lane | critic | verdict |
|---|---|---|---|
| bank: write-tree through `GIT_INDEX_FILE` | `8c810f72` | `8c810f72` | reproduces |
| `pass8.diff` sha1 / bytes | `47abd570…` / 455,936 | cut from the tree: `47abd570…` / 455,936; `apply --check` 0 on fresh `74a2b5d9`, applied 0 | reproduces |
| file sha1s (PlayerMark, spec, d.mts, HeadSheet, edge-bands.mjs) | d41d87dd, 9695e530, d8e7b9f8, f7780306 | identical on my archive + bank; 6 homes `cmp`-equal to `homes.diff` | reproduces |
| `docs/` imports in `e2e/` + `scripts/` | 0 | 0 (two comment mentions, no import); the spec imports `./lib/edge-bands.mjs` | clean |
| clean rows: key, desk, relabel, debt | GREEN ×2 | **8/8 GREEN**, chromium + WebKit, 2.3 min | reproduces |
| **pass-7 plant first** (pass-7 `PlayerMark.vue` whole, sha1 `25b082fd`) on the key + debt rows | K1 / D1 red | **RED ×2 both engines**: `712x800 coarse` → rows 4 / lapped 8 (wants 1/4); debt chromium `withheld true`, WebKit `withheld false` | born-RED on the pass-7 bytes |
| **E1** (`:global(.dark) .head-sheet-edge{opacity:0}`, HeadSheet → `51a2541b`) on the four-band row | RED ×2 | **RED both engines**: dark lobby every band 1.00, d0, 206/67 stations dropped | reproduces |
| key cells (19, both engines) | table §2 | 712×800 1/4 · 1040×768 1/3 · 1048×768 4/6 · 820×800 4/6 · 820×830 1/3 · 820×860 1/3 · 768×1024 1/0 · 1180×820 4/4 · 1280×800 4/4 · 812×375 16×16 4/18 · 1280×800 16×16 4/12. Engines agree on all 19 | reproduces; plus 1366×768 and 1194×834 unpriced (gap 4) |
| four-band arms the row doesn't emulate | — | 12/12 clean GREEN at 1.5, X4 + THIN_1PX RED 12/12, default B3 RED 12/12 | gap 2 and gap 5 |
| check 8 | exit 1 (256/254) | exit 1, same numbers | the fold's |
| `lint:copy` (M16) · `typecheck:e2e` · eslint on the 3 delta files `--max-warnings 0` | 0 · 0 · 0 | 0 · 0 · 0 (clean archive + bank) | reproduces |

Not re-derived (cited from the lane, each with a reading file I opened):

- the estate filter census 9/11 = the control's (`filters.jsonl`)
- π (`pimode.jsonl`)
- slice 13 (`slice.jsonl`)
- the edge-bands CLI sabotage battery 6/6 BITE (`edge-sabotage-*.log`)
- R1 radius (`battery-b2.txt`)
- the debt loss table (`loss.jsonl`, 20 rows)
- vitest 830 / 68

My served arms were the bank's dev server (:4241, from an out-of-tree `git archive` + `pass8.diff`) and the control's pre-built preview (:4250, `index-CubiZsMVSwTc.js` read off the served HTML).

## 2 · The charter's eleven rows, as the critic reads them

| # | lane | critic |
|---|---|---|
| 1 one-axis disjunct | closed | **cured of the one-axis proxy** (pass-7 bytes red 712×800, both engines). Not the chair's primitive (gap 3); the one-width cliff moved to 1040/1048×768 |
| 2 debt | closed | **bounded** (pass-7 bytes red both engines). The re-cut gate has no clause battery, and three clause deletions are GREEN with real costs (gap 1) |
| 3 four bands, both themes | closed (gap 1) | dark run and plants real (E1 reproduces); **open** on B3 at 1.5 (gap 2); E(i) arms unread (gap 5) |
| 4 desk | closed (priced) | closed; the row is brittle at 124.45 (gap 9) |
| 5 unpriced cells | closed | the named cells are priced. **1366×768 fine (16×16 4/6) and 1194×834 coarse (4/4) are unpriced** (gap 4) |
| 6 B-SEAM | closed | closed: the default is the shipped (b), and its loss is in the ballot with numbers. It should add that (b) also depends on the three unplanted forgiveness clauses |
| 7 census banked | closed | closed (cited) |
| 8 live radius | closed | closed (cited; R1 in the lane's battery) |
| 9 slice 13 | closed | closed (cited; the DPR-2 half-pixel gap is a reading) |
| 10 T9-R8 · check 8 | cited · declared | check 8 reproduced; T9-R8 cited |
| 11 substrate | handed | handed; sha1s reproduce |

## 3 · Constraints

- M16: `lint:copy` 0; the delta adds no UI string.
- filterBudget: unmoved (the delta touches no filter; the lane's estate census equals the control's).
- @property: the delta touches no CSS; the lane's served 43 vs 42 is `--head-rule`, pass 7's.
- AA: the delta paints no new ink; T9-R8 is cited.
- π: the delta changes only which pose is drawn. It moves no unclaimed pixel by construction; the lane's `pimode` is cited.
- Frames: none minted; 0 B of the 151,826 B headroom spent; crops pass-7 3 and pass-6 1–2 stand. I looked at pass-7 crop 3: (b) left keeps the cell's focus ring and column wash, (a) right doesn't; one payload, B pinned. It frames the look, not the debt.

## 4 · Why 92 and not more

The lane did the charter's work and every figure I checked reproduces to the reading. The number is held by what the lane's gates can't see:

- the debt guard's own sequence law, whose clauses delete GREEN with a mouse click and a keyboard Enter swallowed (gap 1)
- a paint row made GREEN by lowering a law's floor (gap 2)
- a key whose "cure" is a fitted constant with the old cliff shape and a cell-blind fraction (gaps 3–4)

None of these is an owner's question alone. Gap 1 is a lane row, gap 2 is the chair's, and gaps 3–4 are the lane's until the owner answers B-NAMES / `UNDER_BOARD`.

## 5 · Incidents (critic)

1. My first playwright config sat outside `web/frontend` and couldn't resolve `@playwright/test` (exit 1, no test ran). I moved it into my copy's `.critic8/`.
2. My probe spec was first a full copy of `player-mark.spec.ts`, so the P7 plant run executed the key and debt rows twice per engine; it gave 8 reds, all the same verdicts. The copies were then `test.skip`'d.
3. In the lane's worktree I ran `git status --porcelain` and a temporary-index `git add -A` / `write-tree` / `diff` (`GIT_INDEX_FILE` in my scratch), as the brief directs for reading the diff. `git status` may refresh the worktree index's stat cache.
4. There were no edits, no plants and no servers in the lane's tree; its three files are sha1-identical after the run.
5. Every plant ran on my out-of-tree copy (`git archive 74a2b5d9` + `pass8.diff`), restored by whole-file copy, sha1 verified (`d41d87dde1da`, `f778030625c4`).
6. I killed my servers by recorded PID after a cwd check: dev 46270 (cwd my copy, :4241) and control preview 55991 (cwd `w7-control`, :4250, started by me). I never ran git in the control tree and never used `rm`.

## 6 · Replay

- **Copy.** `git archive 74a2b5d9` + `git apply pass8/prototype/PLR-SELF/pass8.diff` + a `node_modules` symlink. Put `instruments/critic-probes.spec.ts`, appended to a skipped copy of `player-mark.spec.ts`, into `e2e/`.
- **Serve.** Dev with `instruments/vite.dev.mts` on :4241.
- **Run.**
  - `instruments/battery.sh`: the P7 plant, E1, cells, regimes.
  - `instruments/sab.sh`: S1–S3 against the five tap/click/key rows.
  - `instruments/forgive.sh`: the clean arm plus S1–S3 behavioural probe.
  - `instruments/gates.sh`: `lint:copy`, `test:e2e:projects`, `typecheck:e2e`, eslint.
- Logs are in `logs/`.
