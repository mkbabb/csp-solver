# 3C-4b — non-author verify, round 2 (the repair)

Verifier did not write the cure or the repair. Everything below was re-run from `e1f2304b` on
`w7/exec`, on this verifier's own ports, with every earlier lane's server already down.

**VERDICT: ACCEPT** — zero BLOCKING, zero MUST, four NOTEs, none of which touch a shipped byte.
The r1 MUST is struck and the replacement sentence is true by reading and by cite. The r1 NOTE-1
row is real, born-RED, and — measured below against a wrong placement nobody had planted — it is
the ONLY row in the estate that catches it.

## 1. What the repair actually is

`git diff a649cf5e e1f2304b --numstat` = **15 / 0 / `GameBoard.coarseTape.test.ts`**, and nothing
else. `git diff a649cf5e -- web/frontend/src/games/shared/GameBoard.vue` is **empty** (0 lines).
The author's central claim — the shipped behaviour is byte-for-byte what r1 measured — holds, and
is proven twice over below (bundle read, and an independent rebuild).

## 2. Every claim, re-run

| claim | this verifier's own run | agrees |
|---|---|---|
| born-RED, the fourth row, on the reverted parent | parent twin off-branch (below): exit **1**, `Test Files 1 failed (1)`, `Tests 3 failed \| 10 passed (13)`, all three assertion strings identical, the new one `nobody is on the board: expected true to be false` at `:286` | yes |
| GREEN cured | bare `npx vitest run src/games/shared/GameBoard.coarseTape.test.ts`: exit **0**, `Test Files 1 passed (1)`, `Tests 13 passed (13)` | yes |
| whole suite 830 | bare `npx vitest run`: **68 files, 830 tests** — but exit **1** here, 2 failed under load (NOTE-4); both green re-run alone (`Test Files 2 passed (2)`, `Tests 21 passed (21)`, exit 0) | count yes, exit no (contention) |
| `npm run lint` · `lint:copy` · `lint:live-regions` · `lint:motion` · `lint:boundary` · `lint:tdz` · `lint:ink` · `lint:theme-selectors` · `lint:lanes` · `test:font-coverage` · `typecheck:e2e` · `npx vue-tsc --noEmit` | exit **0** ×12, bare, each read from `$?` | yes |
| goldens | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4259 npx playwright test -c playwright-golden.config.ts` → **4 passed (44.0s)**, exit 0, no `--update-snapshots`, `git status --porcelain` after = only `.vite-exec.config.ts` | yes |
| build reproducibility (the r1 NOT-RUN row the author claims to close) | `npx vite build --config .vite-exec.config.ts --outDir dist-verify-r2 --emptyOutDir` → exit 0, `assets/index-DAj5SdL4MZJz.js`, and `cmp` against `dist/assets/index-DAj5SdL4MZJz.js` is **IDENTICAL byte for byte**. Scratch dir deleted. | yes |
| the HEAD control really lacks the clear | read at the bundle myself: `dist-before/…Cc6TqSXYnbfW.js` `function te(A){const Y=A.currentTarget,…}` vs `dist/…DAj5SdL4MZJz.js` `function te(A){W.value&&(I.value=null);const Y=…}` | yes |
| π 0.00 px | my own census, my own ports (below) | yes |
| read F STRANDED at HEAD / PASS cured | three fresh runs of `probe/strand-arm.mjs`, fresh rooms, fresh cells (below) | yes |
| `check-evidence-policy.mjs` exit 1, wave-level, pre-dating | exit **1**, now **5,793,986 B** > 2,097,152 B on `evidence/w7` (r1 read 5,567,361 B; the author read 5,662,986 B at the repair). The number climbs with other lanes' banking; this repair banked zero bytes. | yes |
| gap 7's replacement cites | `DigitCell.vue` `onCellEnter` at **:176**, `onCellLeave` at **:180**, `@mouseenter`/`@mouseleave` at **:227-228** — all exact. `GameBoard.vue` `onGridFocusout` **:472**, the appended `hoveredPos` sentence ending **:515**, `focusedPos.value = 0` under the `boardGeneration` watch **:824** | yes |

### π — re-taken, one viewport, BOTH engines

`3B-1/probe/rect-census.mjs` with the engine parameterised and the viewport list cut to 390×844
(derived copy kept in scratch, the census code itself unmodified). HEAD control `dist-before/`
served on `127.0.0.1:4258`, cured `dist/` on `:4259`, both `vite preview --strictPort`, verified
by the bundle name in the served HTML before either run.

```
chromium  board-390x844.json:   rects 1049/1049  max|d| 0.00px
chromium  gallery-390x844.json: rects 1767/1767  max|d| 0.00px
webkit    board-390x844.json:   rects 1049/1049  max|d| 0.00px
webkit    gallery-390x844.json: rects 1767/1767  max|d| 0.00px
WORST max|d| 0.00px, both engines
```

**5,632 rects, 0.00 px, identical key sets, no rect on one side only.** Rects that moved: none.

### Read F, re-run by this verifier

`probe/strand-arm.mjs` unmodified; every run printed `pointerCoarse: true, hoverNone: true`.

| run | dist | A→B | tape after F2 | tape after F3 | focus after F3 | verdict |
|---|---|---|---|---|---|---|
| chromium | HEAD | 12→13 | col 3, x 154.77 | **col 3, x 154.77** | cell 13 | STRANDED |
| chromium | cured | 10→11 | col 1, x 74.33 | **col 2, x 114.55** | cell 11 | PASS |
| webkit | cured | 49→50 | col 4, x 195.00 | **col 5, x 235.22** | cell 50 | PASS |

Tape count 1 on all nine reads. Different rooms and different cells from both the author's and
r1's, which is what makes them a third independent reading rather than a re-print.

## 3. The gate was attacked on an axis r1 did not use

r1 planted three wrong cures (guard removed, clear moved inside the `!contains` branch,
precedence inverted). This round planted a fourth that none of them covers, and that a careless
author would plausibly write: **the clear moved from `onGridFocusout` to `onGridFocusin`.** It is
the tempting placement — focus arriving is when the fallback is about to be read.

```
twin: GameBoardFocusinTwin.vue  (cured source, the one statement moved into onGridFocusin)
bare npx vitest run src/games/shared/GameBoardFocusinTwin.test.ts
  Test Files  1 failed (1)
       Tests  1 failed | 12 passed (13)      exit 1
  × drops the tape when focus leaves the board with the hover still live
    AssertionError: nobody is on the board: expected true to be false
```

The **only** row that reds is the row this repair added. Without it the misplacement ships green
across the whole estate: the three coarse rows of 3C-4, the cell-to-cell rows of 3C-4b, and the
fine-pointer control all pass on the twin. NOTE-1's fix is therefore not bookkeeping — it is the
one thing holding the placement, and its absence was a real hole.

All twins (`GameBoardParentTwin.vue`, `GameBoardParentTwin.test.ts`, `GameBoardFocusinTwin.vue`,
`GameBoardFocusinTwin.test.ts`) and the scratch `dist-verify-r2/` are deleted;
`git status --porcelain` on `w7/exec` is `?? web/frontend/.vite-exec.config.ts` and nothing else.

## 4. The MUST was actually fixed

Gap 7 no longer says "the tape needs `unitFocused` anyway, so nothing paints". It now says the
residue is narrow because a pointer that really hovers also fires `mouseleave` and nulls
`pointedPos`. Both halves check out by reading: `hoveredPos` is
`isCoarse ? (pointedPos ?? (unitFocused ? focusedPos : null)) : pointedPos`, so a non-null
`pointedPos` short-circuits and `unitFocused` is never read; and `DigitCell.vue` binds
`@mouseenter="onCellEnter"` / `@mouseleave="onCellLeave"` on the same root (`:227-228`), the
second emitting `cellHover(null)` (`:180-183`). The gap stays open and is booked to the chair as
G8's family, which is where it belongs.

W3's spoken contract is untouched by any of this: the tape's label is `aria-hidden` by
`SheetWashiLabel`'s own default-anchor rule (`SheetWashiLabel.vue:85`), and the name a player
hears comes from the cell's own accessible name, so which cell the tape names changes a look and
not a sentence. `lint:live-regions` exit 0. M16: the repair moved no product string at all —
`lint:copy` exit 0 without touching the gate, and the diff is a test row and a record.

## 5. Findings

### NOTE-1 — §1's diff figures do not re-derive

README §1: *"Diff: `GameBoard.vue` +13/−1 (one statement, twelve lines of comment),
`GameBoard.coarseTape.test.ts` +71/−0 (one helper, three rows)."*

`git show a649cf5e --numstat` says **12 / 1** for `GameBoard.vue` — nine comment lines at the
handler plus two appended at the `hoveredPos` block plus the one statement. And after `e1f2304b`
the test file is **+86/−0** across the two commits, four rows, while the sentence still reads
+71/−0 and three. Fix: restate as `+12/−1 (one statement, eleven lines of comment)` and give the
test file's figure per commit. One line of README, no code.

### NOTE-2 — the repair made an ordinal in §1 stale

§1 bullet one: *"Pinned by the **third new row** and by the two fine-pointer rows already in the
file."* At `a649cf5e` the third new row was the fine-pointer control. At `e1f2304b` the third row
in that `describe` is the new off-board row and the fine-pointer control is the fourth, so a
reader following the pointer lands on the wrong row. Fix: name it — "pinned by
`leaves a fine pointer's hover exactly where it was`". Ordinals in a record that grows rows are
the wrong handle.

### NOTE-3 — §9.1 has a sentence that reads backwards

*"That reason is wrong, and the verifier measured it wrong on both sides"* parses first as
*the verifier measured incorrectly*, which is the opposite of what happened (the verifier
measured the behaviour, and found the tape mounting on both sides). One clause: "…and r1
measured the true behaviour on both sides: the tape mounts."

### NOTE-4 — a residue of the cure's own arm that no gap books

`useCoarsePointer` is `matchMedia("(pointer: coarse)")` — the PRIMARY pointer. A tablet driving a
real hovering pointer (an iPad with a trackpad, an Android tablet with a mouse) is coarse AND
hovers. On that device the cure now drops a **live, correct** hover on every keyboard focus move,
and the pointer will not re-announce itself until it leaves a cell and re-enters one, so the tape
sits on the focused cell while the pointer rests elsewhere. Nothing is wrong — the fallback names
the cell the player is on — but it is the exact mirror of gap 9 (a fine pointer keeps its hover by
design) and it is unbooked. One gap line; no code, and certainly no re-opened design.

Also carried, not as a finding: my whole-suite run reds where the author's did not —
`technique.test.ts > grades the dealt 9×9 hard bank well within a frame` (worst 563.03 ms against
a frame budget) and `useSession.stress.test.ts > the cap holds at 200 through 20,000 …` (55.7 s
against a 30 s test timeout). Both are wall-clock rows, both pass re-run alone (21/21, exit 0),
and neither is reachable from a test-file diff. This box runs several lanes at once; read it as
contention, exactly as the author read `visual-regression`'s.

## 6. Not run by this verifier

- `e2e/visual-regression.spec.ts` — **NOT RUN**. The author did not re-run it at the repair
  either; the `a649cf5e` reading (24 passed at `--workers=2`, after two contention reds) is
  unchecked by both verifiers. It reads the dist, and the dist is now proven byte-identical by an
  independent rebuild, so the argument is sound — but it is an argument, not a run.
- `npm run test:e2e` (full battery) — **NOT RUN**, `webServer` binds :3000, outside the fence.
  Manifest G2, chair's on master.
- Real device / Safari / iOS simulator — **NOT RUN**. M19. G10/G22 stand; W8 §8.3 is where a
  device reads this.
- π at 1280×800 — **NOT RE-RUN** by this round. I re-took 390×844 in both engines (5,632 rects);
  the 1280×800 pair is the author's and r1's, 0.00 px over 2,896 rects.

## 7. Hygiene

Servers `127.0.0.1:4258` (HEAD control) and `:4259` (cured) were started by this verifier and are
**killed**; both ports read free by `lsof` after. Port 4257 was already held by another lane and
was never touched. The MAIN tree was never edited, built or served —
`git status --porcelain web/frontend/src web/frontend/dist` in the main tree is empty, and the
only file this round wrote into it is this record. Worktree `w7/exec` at `e1f2304b`, status
`?? web/frontend/.vite-exec.config.ts`.
