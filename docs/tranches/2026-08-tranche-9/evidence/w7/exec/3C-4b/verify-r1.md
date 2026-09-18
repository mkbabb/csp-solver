# 3C-4b — non-author verify, round 1

Verifier did not write the cure. Everything below was re-run from the author's commit `a649cf5e`
on `w7/exec`, on this verifier's own ports, with the author's servers already down.

**VERDICT: REPAIR** — one MUST (a measurably false sentence in the record's own gap list), two
NOTEs. The code is right, the born-RED gate is right and discriminating, and every number the
author banked reproduced.

## 1. What reproduced

| claim | verifier's own run | agrees |
|---|---|---|
| born-RED at `e4c45f53`, GREEN at `a649cf5e` | parent twin off-branch (below): exit **1**, `Test Files 1 failed (1)`, `Tests 2 failed \| 10 passed (12)`, both assertion strings identical | yes |
| whole suite | bare `npx vitest run`: exit 0, **Test Files 68 passed (68)**, Tests 829 passed (829) | yes |
| `npm run lint` · `lint:copy` · `lint:live-regions` · `lint:motion` · `lint:boundary` · `lint:tdz` · `lint:ink` · `lint:theme-selectors` · `lint:lanes` · `test:font-coverage` · `typecheck:e2e` · `npx vue-tsc --noEmit` | exit **0** ×12, bare, each exit read from `$?` | yes |
| goldens, `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4259 npx playwright test -c playwright-golden.config.ts` | **4 passed**, exit 0; no `--update-snapshots`; `git status --porcelain` after = only `.vite-exec.config.ts` | yes |
| built CSS carries 0 hits of `not all and (hover:hover) and (pointer:fine)` | 7 stylesheets, **0** each | yes |
| π 0.00 px, chromium, 5,712 rects | verifier's own banks, HEAD on :4258 vs cured on :4259: board-1280x800 1089/1089 · board-390x844 1049/1049 · gallery-1280x800 1807/1807 · gallery-390x844 1767/1767, **WORST 0.00 px** | yes |
| read F STRANDED at HEAD / PASS cured, both engines | four fresh runs of `probe/strand-arm.mjs`, different rooms and different cells from the author's | yes |
| `check-evidence-policy.mjs` exit 1 at the wave level, pre-dating this lane | exit 1, now **5,567,361 B** > 2,097,152 B on `evidence/w7` (the author read 5,515,159 B; other lanes have banked since). Minus this lane's 74,185 B it is 5,493,176 B, still over | yes |
| cites re-derived | `onGridFocusout` at `GameBoard.vue:472` ✓, the appended `hoveredPos` sentence at `:515` ✓, `focusedPos.value = 0` under the `boardGeneration` watch at `:824` ✓ | yes |

### The HEAD control is genuine

Not trusted on its label. Both bundles were read for the handler itself:

```
dist-before/assets/index-Cc6TqSXYnbfW.js   function te(A){const Y=A.currentTarget,E=A.relatedTarget;(!E||!Y.contains(E))&&(z.value=!1,gr(null))}
dist/assets/index-DAj5SdL4MZJz.js          function te(A){W.value&&(I.value=null);const Y=A.currentTarget,E=A.relatedTarget;(!E||!Y.contains(E))&&(z.value=!1,gr(null))}
```

`W` = `useCoarsePointer()`, `I` = `pointedPos`. The control lacks the clear, the cured build has
it, and `hoveredPos` compiles identically on both sides
(`W.value?I.value??(z.value?N.value:null):I.value`) — the precedence really was not rewritten.

### Born-RED, reproduced off-branch without a stash

`git show e4c45f53:…/GameBoard.vue` was checked out to `src/games/shared/GameBoardParentTwin.vue`
and a copy of the cured row file pointed at it. Bare `npx vitest run` on that one file: exit 1,
`Tests 2 failed | 10 passed (12)`, with `expected 'brave-otter' to contain 'quiet-lynx'` and
`nobody wrote cell 8: expected true to be false`. Line for line the author's pair. The
fine-pointer control row passed on the parent, as the README says it must.

### The census, extended to a second engine

The author's census is chromium only. Re-taken in **webkit** at 390×844, HEAD vs cured, same
probe with the engine swapped: board **1049/1049 0.00 px**, gallery **1767/1767 0.00 px** —
2,816 more rects, identical key sets. π holds in both engines.

### Read F, re-run four times by the verifier

`probe/strand-arm.mjs` unmodified, 390×844, `hasTouch`, `reducedMotion: reduce`; every run
printed `pointerCoarse: true, hoverNone: true`. Fresh rooms, so fresh cells:

| run | dist | A→B | tape after F2 | tape after F3 | focus after F3 | verdict |
|---|---|---|---|---|---|---|
| chromium | HEAD | 72→73 | col 0, x 34.11 | **col 0, x 34.11** | cell 73 | STRANDED |
| chromium | cured | 18→19 | col 0, x 34.11 | **col 1, x 74.33** | cell 19 | PASS |
| webkit | HEAD | 72→73 | col 0, x 34.11 | **col 0, x 34.11** | cell 73 | STRANDED |
| webkit | cured | 0→1 | col 0, x 34.11 | **col 1, x 74.33** | cell 1 | PASS |

Tape count 1 on all twelve reads. The HEAD runs are also what proves the arm's F2 is not a
no-op: if the hand-dispatched `mouseenter` never reached `onCellHover`, `pointedPos` would be
null and even HEAD would have followed the focus. It did not.

## 2. The gate was attacked

Three wrong implementations were planted in the worktree as twins and run against the author's
row set. Each one reds, and on a different row — the gate discriminates the guard, the placement
and the precedence:

| planted wrong cure | which row reds |
|---|---|
| **V1** — the clear with the `isCoarse` guard removed | `leaves a fine pointer's hover exactly where it was` (1 failed / 11 passed) |
| **V2** — the clear moved inside the `!grid.contains(next)` branch, so it fires only when focus leaves the board | both new coarse rows (2 failed / 10 passed) |
| **V3** — no clear at all; `hoveredPos` inverted so focus outranks the pointer on coarse | 3C-4's banked `a synthesised coarse hover takes the focused cell's place while it lasts` (1 failed / 11 passed) |

V3 is the one that matters most: the cheap alternative cure is caught by a row that was already
in the file, so the precedence 3C-4 pinned cannot be traded away for this fix by accident.

All twins and their test files were deleted; `git status --porcelain` on `w7/exec` is
`?? web/frontend/.vite-exec.config.ts` and nothing else.

## 3. Findings

### MUST-1 — gap 7's reason is false, and measurably so

README §7 gap 7: *"`pointedPos` is not cleared when a coarse pointer leaves the grid without a
focus move … **The tape needs `unitFocused` anyway, so nothing paints**; the ref just holds a
stale number."*

The second clause is wrong. `hoveredPos` is

```
isCoarse.value ? (pointedPos.value ?? (unitFocused.value ? focusedPos.value : null)) : pointedPos.value
```

— when `pointedPos` is non-null the `??` short-circuits and `unitFocused` is **never read**. So a
coarse hover with no focus anywhere in the grid mounts a tape.

Measured, both sides, with an adversarial row (coarse, `onCellHover(PEER)`, no tap, no focus):

```
ADV4 HEAD  tape with hover but no focus: true
ADV4 cured tape with hover but no focus: true
```

The behaviour is unchanged by the cure — this is not a regression — but the record hands the
chair a false reason for leaving the residue open, and the residue is the same family G8 names.
What is actually true: the residue is narrow because any pointer that really hovers also fires
`mouseleave` (`DigitCell.vue:227-228` binds both), which nulls `pointedPos`; it is `unitFocused`
that does **not** cover it.

**Fix (inside this cure):** strike the "so nothing paints" clause from gap 7 and put the
`mouseleave` reason in its place. One sentence of README. No code.

### NOTE-1 — the cure is wider than the sentence that claims it

The commit message and the author's return both scope the cure to focus moving *between cells*.
The statement is unguarded on that axis: it fires on **every** grid `focusout`, including focus
leaving the board entirely. Measured:

```
ADV1 HEAD  tape after off-board blur (with a live coarse hover): true
ADV1 cured tape after off-board blur (with a live coarse hover): false
```

At HEAD a live coarse hover kept a tape on screen after focus walked off the board; cured, it
goes. That is the better behaviour — it is what the file's own row `drops the tape when focus
leaves the board` is for, and what its message calls *"a tape left behind names a cell nobody is
on"* — but no row and no browser read pins it (3C-4's read E cannot discriminate: `pointedPos` is
already null there). README §1 does name the off-board case in passing, so this is a gap in the
pinning, not in the honesty.

**Suggested:** a fourth row in `GameBoard.coarseTape.test.ts` — coarse, tap A, `onCellHover(A)`,
`blurBoard` → no tape. It reds on the parent and is green cured, so it is free.

### NOTE-2 — the two crops are not a matched pair

`frames/before-390-chromium-F3.png` and `frames/after-390-chromium-F3.png` come from two
different rooms: before is cells 25/26 in row 2 with the tape above, after is cells 2/3 in row 0
where the tape flips below the cell. Both were read; each is consistent with its own row of the
§5.1 table, and the README says outright that the numbers are the proof. A reader who skims them
as a before/after pair will read a difference that is the puzzle, not the cure. Worth one clause
of caption; the crops themselves are compliant (2 files, 74,185 B, cropped to the cells and the
tape's berth, never a viewport).

## 4. Not run by this verifier

- `e2e/visual-regression.spec.ts` — **NOT RUN** by the verifier. The author's account (two
  contention reds on `option chips keep their separation` with `browserContext.close`, symmetric
  against both dists, then 24 passed at `--workers=2`) is unchecked here.
- `npm run test:e2e` (full battery) — **NOT RUN**, same reason as the author's: its `webServer`
  binds :3000, outside the lane's port fence. Manifest G2.
- Real device / Safari / simulator — **NOT RUN**. M19.
- Build reproducibility — **NOT RUN**. `dist/` was served as the author left it; that it carries
  the cure and `dist-before/` does not is proven at the bundle (§1), but the hash
  `index-DAj5SdL4MZJz.js` was not re-derived by a fresh build.

## 5. Hygiene

Servers on 127.0.0.1:4258 (HEAD control, static) and :4259 (cured, `vite preview --config
.vite-exec.config.ts --strictPort`) were started by this verifier and are **killed**; both ports
read free. The main tree was never built, edited or served — only `docs/…/3C-4b/verify-r1.md`
(this file) was written into it. Worktree `w7/exec` at `a649cf5e`, status
`?? web/frontend/.vite-exec.config.ts`.
