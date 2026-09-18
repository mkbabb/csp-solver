# T9-W7 exec · 3B-1 — the attribution tape stops claiming a peer over a solved, given or erased cell

**commits** `0a08a3cf` (the cure) and `881be039` (repair r1, record only) on `w7/exec`, from
`aab67b92` · **handoff** `evidence/w3/handoffs/3B-1.md` (option A) · **intake**
`evidence/w7/intake-from-w3.md` row 1. Repair r1 is the last section.

## The seam

`web/frontend/src/games/shared/BoardHost.vue:88` — one computed, read by two consumers:
`GameBoard`'s washi tape (`:cell-authors`, `hoveredAuthor` at `GameBoard.vue:498`) and each
cell's own accessible name (`authorNameAt` → `:author-name`).

```ts
const cellAuthors = computed(() => props.model.cellAuthors.value);
```

`!a.self` was the whole gate, so a position the ledger stamped stayed claimed after the digit
stopped being that hand's. Three writes do that: a reveal (the digit is the SOLVER's and wears
`#solver-ink`), a deal (a printed clue is nobody's), an erase (no digit left to own).

**ONE rendered surface was lying at `aab67b92`, and this cure moves that one: the washi tape.**
The second consumer — the cell's own accessible name — already spoke the truth for all three
kinds before this cure. T9-W3 §3.3 moved authorship into the name's kind-branch
(`useGameCell.ts:140`), so a solved cell says "solver's answer 4", a clue says "given clue 4"
and an emptied cell says "empty" no matter what slug arrives;
`DigitCell.attribution.test.ts:111,120,127` (the three `it` lines at `aab67b92`; the fold's G7 re-anchored 121/129, which were fixture lines) pins each of the three with `authorName` set, and
those rows were green before this commit (the commit touches two files, neither of them
`DigitCell.vue` or `useGameCell.ts`). Narrowing the map at its single source is
**surface-agreement at the source**, not a second cured lie: it stops the name's consumer from
being handed a slug it would have had to discard. The `named()` assertions in the row hold the
PROP the cell receives (the stub echoes `authorName` into `data-author`), not the sentence the
cell speaks — that sentence is `DigitCell.attribution.test.ts`'s to hold.

**The computed's wake-up set widened.** It read `model.cellAuthors` alone; it now also reads
`model.solvedValues`, `model.givenCells` and `model.values`, and `values` is a tracked deep
mutation on every digit write (`useGameState.applyCellValue`). So the computed re-runs and
allocates a fresh map per keystroke and pushes a new prop identity to `GameBoard` — on a solo
board the ledger is `{}` and the loop is free. `BoardHost` already re-renders on `values`, so
no gate moved and nothing here measured a regression; the dependency change is recorded because
the next reader of this computed should know it now wakes on every write.

**Field names verified on `GameModel` before writing** (`defineGame.ts:52,66,91`):
`values: ReadRef<Record<string, number>>`, `givenCells: ReadRef<Set<string>>`,
`solvedValues: ReadRef<Record<string, number>>`,
`cellAuthors: ReadRef<Record<string, { slug: string; self: boolean }>>`. All four are the real
names — no substitution to report.

## The diff

Two files, 232 insertions, 1 deletion.

- `BoardHost.vue` (+17/−1) — the computed narrows the map once, at the single source: skip a
  position in `model.solvedValues`, in `model.givenCells`, or whose `model.values` entry is 0.
  Nothing else in the file moved; no template line, no style.
- `BoardHost.authors.test.ts` (new, 215 lines) — the born-RED row, mounting `BoardHost` with a
  stubbed `GameBoard` (one prop: `cellAuthors`) and a stubbed cell (one prop: `authorName`), so
  both consumers are read off one mount. The cell side holds the prop, not the spoken name
  (above).

Option B (a solved set propped into `GameBoard`) was not taken: it costs a new prop for one
consumer and leaves the cell's name reading the unnarrowed map.

## Born RED

Four cells, one peer stamp each: `0` a peer's live digit, `1` solver-filled, `2` a printed
clue, `3` erased.

RED at `aab67b92` (`gates/row-RED-at-aab67b92.txt`, exit 1):

```
 Test Files  1 failed (1)
      Tests  5 failed | 2 passed (7)
```

with, e.g. `AssertionError: expected [ '0', '1', '2', '3' ] to not include '1'` at
`BoardHost.authors.test.ts:153` and `expected [ '0', '1', '2', '3' ] to deeply equal [ '0' ]`
at `:176`. The two that passed RED are the controls — the peer's live digit (claimed, rightly)
and the solo board (an empty ledger claims nothing).

GREEN after the cure (`gates/row-GREEN.txt`, exit 0):

```
 Test Files  1 passed (1)
      Tests  7 passed (7)
```

## Gates

| gate | command | exit |
|---|---|---|
| the row, RED at HEAD | `npx vitest run src/games/shared/BoardHost.authors.test.ts` | 1 (as designed) |
| the row, GREEN | same | 0 |
| typecheck | `npx vue-tsc -b --force` | 0 (empty log) |
| unit battery | `npx vitest run` | 0 — **Test Files 67 passed (67)**, Tests 817 passed (817) |
| prettier | `npm run lint` | 0 |
| eslint | `npm run lint:eslint` | 0 |
| boundaries | `npm run lint:boundary` | 0 |
| copy register | `npm run lint:copy` | 0 |
| live regions | `npm run lint:live-regions` | 0 |
| motion contract | `npm run lint:motion` | 0 |
| font coverage | `npm run test:font-coverage` | 0 |
| goldens | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4259 npx playwright test -c playwright-golden.config.ts` | 0 — **4 passed**, none re-baselined |
| session e2e (chromium) | `multiplayer + presence + follow-still-authorship` against the cured dist | 1 — 18 passed, 1 skipped, 1 failed; the failure reproduces at HEAD (see gaps) |

Logs: `gates/`. No `--update-snapshots` was run and no baseline was touched.

## π — the rect census

Every element's `getBoundingClientRect` at 1280×800 and 390×844, on the pinned board
(`?board=` permalink, eight fixed givens) and the gallery over that same pinned board, with
`reducedMotion: 'reduce'` and a 2.5s settle. Probe: `probe/rect-census.mjs`,
diff: `probe/rect-diff.mjs`.

The paired run serves the **HEAD dist** (`index-9rZPzI5DEcpe.js`, built from `aab67b92`'s
`BoardHost.vue`) on :4258 and the **cured dist** (`index-DNGqF0dwwhHF.js`) on :4259, side by
side (`census/before-pinned` vs `census/after-pinned`, `census/diff-pinned.txt`):

```
board-1280x800.json:   rects 1089/1089  max|d| 0.00px
board-390x844.json:    rects 1049/1049  max|d| 0.00px
gallery-1280x800.json: rects 1807/1807  max|d| 0.00px
gallery-390x844.json:  rects 1767/1767  max|d| 0.00px
WORST max|d| across all surfaces: 0.00px
```

5,712 rects, identical key sets, **0.00px** everywhere. The cure claims no resting pixel and
moved none.

The step-2 before-census (taken on the un-edited worktree before any edit, `census/before`,
gzipped) and its after (`census/after`) read the same 0.00px on every shared key
(`census/diff-before-after.txt`); that pair's gallery route was dealt at random rather than
pinned, so its key set churns run to run — a HEAD-vs-HEAD control run reproduces exactly that
churn at 0.00px (`census/diff-head-vs-head-control.txt`), which is why the pinned pair above is
the one that carries the claim.

## DELTA — what the tape does now

Two pages, ONE chromium context, `?wire=local`. Page A minted the room from the well's own verb
and page B opened the link A wrote into its address bar; A typed a digit into an empty cell
(op `solved:0`) and pressed Fill (ops `solved:1`); B hovered one cell of each kind. Numbers in
`delta-arm.txt`, probe in `probe/tape-delta.mjs`. **This is the real two-tab arm, not the
stubbed one.**

| hovered cell on B | HEAD dist | cured dist |
|---|---|---|
| the SOLVER's digit, ledger-stamped to the peer | `.attribution-tape` count **1**, text `imperial-rodent` | count **0** |
| the peer's own live digit | count **1**, text `imperial-rodent` | count **1**, text `enchanting-thrush` |

Re-driven in **webkit** at repair r1, same arm, numbers in `delta-arm-webkit.txt`:

| hovered cell on B (webkit) | HEAD dist | cured dist |
|---|---|---|
| the SOLVER's digit, ledger-stamped to the peer | count **1**, text `personal-bedbug` | count **0** |
| the peer's own live digit | count **1** | count **1**, text `imperial-coral` |

Frames (chromium; the tape is one box of CSS with no engine branch, and webkit's numbers agree
above), 4 crops, 103 KB total:

- `frames/head-solved-cell-tape-claims-peer.png` — the lie: the tape reads `imperial-rodent`
  under a cell the solver filled (count 1).
- `frames/cured-solved-cell-no-tape.png` — the same hover on the cured dist: no tape (count 0).
- `frames/head-live-digit-tape-claims-peer.png` — the control at HEAD: the tape over a peer's
  live digit (count 1).
- `frames/cured-live-digit-tape-kept.png` — the claim the cure keeps: `enchanting-thrush` over
  the peer's live digit (count 1).

No golden covers the tape (`test:golden` is 4 crops: a given glyph, the grid corner, the
wordmark, the toggle crest) and no e2e spec names `.attribution-tape` or `cellAuthors`.

## Gaps

1. **`presence.spec.ts:177` is RED, and was RED before this cure.**
   `expect(roster(p)).toHaveCount(3)` receives 1 at `presence.spec.ts:199`. The same row, same
   command, fails against the **HEAD dist** on :4258 (`gates/e2e-presence-HEAD-control.txt`) —
   a three-page local-arm timing red that pre-dates the branch. Named, not adopted.
2. **The full e2e suite is NOT RUN.** `playwright.config.ts` carries a `webServer` that binds
   :3000, outside this lane's port fence, and the suite is two engines. Only the three
   session-shaped specs were run, through a scratch config that dropped `webServer` and pinned
   chromium; that config was deleted before the commit.
3. **webkit: the tape arm is now run** (repair r1, `delta-arm-webkit.txt`) and the verifier's
   own rect census ran both engines at 0.00px. What stays chromium-only is the goldens' config
   (chromium by declaration) and the 4 banked crops.
4. **A peer-stamped GIVEN cell was not driven live.** A deal writes no op, so the live arm has
   no way to stamp a clue; that third kind is held by the unit row alone (cell `2`).
5. The 390×844 census is chromium's viewport emulation, not a device.
6. The scratch rig — `web/frontend/.vite-exec.config.ts`, `web/frontend/dist-before/`,
   `.vite-cache/` — is the census rig, not the cure. At repair r1 it was deleted from the
   worktree and the lane's block in the shared `.git/info/exclude` was pruned with it, so
   nothing of this lane is hidden from the main tree any more (`dist-before/` rebuilds from
   `aab67b92` in one `vite build`).
7. **The local session e2e arm is unstable on this box.** `presence.spec.ts:177` reds at HEAD
   and cured alike (gap 1), and the verifier's independent run reds `multiplayer.spec.ts:320`
   ("a deal is an epoch") — cured ×2, HEAD ×1, always `digitAt` receiving "" after a 10s poll —
   where this lane's single run had it green. Symmetric across HEAD and cured either way, so
   not this cure's; read the arm as flaky rather than as a steady state.

## Repair r1

Non-author verify ruled REPAIR: one MUST (a framing claim) and four NOTEs. No behavioural code
changed in this round — the cured diff at `0a08a3cf` stands as verified. Commit `881be039` on
`w7/exec` carries the one file that moved.

| finding | disposition |
|---|---|
| MUST — the record claimed a SECOND cured rendered surface (the cell's name) that was already truthful at `aab67b92` | **ACCEPTED, record corrected.** The verifier is right: `DigitCell.attribution.test.ts:111,121,129` pins "solver's answer 4", "given clue 4" and "empty" with `authorName` set, and those rows were green before this commit. The seam section above now says it outright — one lying rendered surface, the tape; the second consumer is surface-agreement at the source; the `named()` rows hold the PROP, not the spoken sentence. The header of `BoardHost.authors.test.ts` was rewritten to the same effect (the only file in the r1 commit). |
| NOTE — webkit narrowed but not closed; the tape DELTA was chromium-only | **CLOSED, not waived.** `probe/tape-delta.mjs` takes its engine as argv[4] and both arms were re-driven in webkit: HEAD count **1** over the solver-filled cell, cured count **0**; the peer's own live digit keeps its tape, text `imperial-coral`, the slug the roster names. `delta-arm-webkit.txt`. Frames not banked — the crop budget is 4 and the chromium crops hold it. |
| NOTE — the computed's wake-up set widened to `values` + `givenCells` + `solvedValues` | **RECORDED** in the seam section, as asked: it re-runs and allocates a fresh map on every digit write, `BoardHost` already re-rendered on `values`, no gate moved, no code change. |
| NOTE — two session e2e rows red, symmetric across HEAD and cured | **RECORDED** as gap 7, with the verifier's `multiplayer.spec.ts:320` result named beside this lane's single green. Nothing inside the cure. |
| NOTE — the lane's excludes were appended to the shared `.git/info/exclude` | **PRUNED.** The "T9-W7 exec worktree scratch" block is gone from `.git/info/exclude` and the scratch it named (`.vite-exec.config.ts`, `dist-before/`, `.vite-cache/`) was deleted from the worktree. The W8 lane's own block is untouched. |

Battery re-run at r1, bare, in the worktree:

| gate | exit |
|---|---|
| `npx vitest run src/games/shared/BoardHost.authors.test.ts` | 0 — Test Files 1 passed (1), Tests 7 passed (7) (`gates/row-GREEN-r1.txt`) |
| `npx vitest run` | 0 — **Test Files 67 passed (67)**, Tests 817 passed (817) (`gates/vitest-full-r1.txt`) |
| `npx vue-tsc -b --force` | 0 (empty log) |
| `npm run lint` / `lint:eslint` / `lint:boundary` / `lint:copy` / `lint:live-regions` / `lint:motion` / `test:font-coverage` | 0, all seven |
| goldens vs the cured dist on :4259 | 0 — **4 passed**, no `--update-snapshots`, `git status` shows no baseline moved (`gates/goldens-r1.txt`) |
| webkit DELTA, both dists | 0 both runs (`delta-arm-webkit.txt`) |

π was not re-measured at r1 and needs no re-measure: no bundled file changed, so the cured dist
served at :4259 is byte-identical to the one both censuses read (`index-DNGqF0dwwhHF.js`). The
r1 commit touches a test header only.

Servers on :4258 and :4259 killed; ports free. Worktree clean at the r1 commit; the main tree's
`src/` and `dist/` were never touched (main still serves `index-9rZPzI5DEcpe.js`).
