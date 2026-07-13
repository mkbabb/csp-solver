# T4-WU · Lane V — adversarial verification (consolidated gates)

Lane V of workflow T4-WU. Base = the {W8, W9} sealed HEAD **`df013a36`** (`git rev-parse HEAD`
→ `df013a36c…`; working tree carries U1+U2+U3 additively, HEAD unmoved). Port **4391**.
DO-NOT-COMMIT honored — no git commit/push/reset; my preview killed after; owner `:3000`
(still 200) / `:3001` never touched. Every figure below is **my own measurement**, not a lane
claim adopted.

## Verdict: **PASS**

Every born-RED defect re-proven red at the clean base; every gate green under independent
measurement; battery 6/6; default e2e 62/62; darwin goldens 4/4 with **zero re-baselines**
(`git status e2e/goldens/` clean). Two non-blocking notes for the team lead (below) — neither
is a gate failure.

---

## 1 · Born-RED re-confirmation (clean base `df013a36`, via `git show HEAD:<file>`)

| # | Gate | Probe (base blob) | Result |
|---|---|---|---|
| BR1 | marks undo | `grep -E "recordEdit|record|undo|history" useUserMarks.ts` | **zero hits** — `toggleUserMark` never touched the log. RED ✓ |
| BR2 | board undo | grep useSudoku.ts | `clearUndo()` in `randomize:231` / `clearBoard:161` / `restoreBoard:468`; `inkReveal` "NOT recorded":329; `solve` (248–) had no recorder. RED ✓ |
| BR3 | race | `grep loading {Sudoku,Futoshiki}Board.vue` | **zero hits** both boards — keyboard Z ungated during `loading`. RED ✓ |
| BR4 | epoch parity | grep useSudoku.ts | `boardGeneration.value++` at `initBoard:135`/`clearBoard:162`/`restoreBoard:461` only — **absent from `randomize` (199–246)**; futoshiki DOES bump (`:232`). RED ✓ |
| BR5 | dirty confirm | grep sudoku ControlPanel.vue | `onRandomize:204-206` bare (`trigger`+`emit`, no dirty); `onClear:226` arms `if (isCoarse && !clearArmed)` — no `isDirty`. RED ✓ |
| BR6 | staged size | `grep -A4 watch(size` | `watch(size){clearPersistedBoard();initBoard();randomize();}` `:528`; futoshiki `watch(boardSize)` `:515` twin — live wipe. RED ✓ |
| BR7 | futoshiki difficulty | grep futoshiki/useUrlState.ts | `PersistedBoard:30` = `boardSize` only, doc line 7 "There is no difficulty (F3)"; `difficulty = ref("EASY"):63` hardcoded. RED ✓ |

All seven RED at base.

## 2 · Gate table (working tree, built dist :4391)

| Gate | Verdict | My measurement |
|---|---|---|
| **Headline / every action undoes** | GREEN | Spine = tagged union (`value`/`mark`/`board`) + dispatcher, one `pushEntry`. `useUndoHistory.test.ts`: value/hint-ink/mark(1+2 slot)/board round-trips all assert real replay. 267 unit pass. |
| **marks undo** | GREEN | born-RED closed; `recordMark`/`setMarkSlot`/`setUserMarks` seam; unit `mark delta` suite green. |
| **board undo (+ restore-order)** | GREEN | `recordBoard` pooled; `restoreBoard` under `restoring` flag; `useUserMarks.test.ts:169` asserts `restoring=true` no-ops the void-watch on a gen bump. DELTA (deal→edit→mark→deal→undo restores marks) asserted at `useUndoHistory.test.ts:139`. |
| **race / refuse-while-pending** | GREEN | `undo`/`redo` guard `effects.pending()` (`useUndoHistory.ts:225/231`); both boards `if (props.loading) break;` in keydown (`SudokuBoard.vue:426`, futoshiki twin). Unit `refuse-while-pending` asserts no-op. |
| **epoch parity** | GREEN | sudoku `randomize` now captures `dispatchGen:306`, drops on mismatch `:313`, bumps gen `:343`; futoshiki twin. Both games parity. |
| **dirty confirm (two verbs)** | GREEN | `isDirty=computed(undoDepth>0)`; Deal + Clear coarse two-tap gated on `props.isDirty`. e2e `Deal is dirty-gated`:341 + `coarse affordances`:268 pass vs my dist. |
| **staged size (role=group, Deal commits)** | GREEN | `watch(size)`/`watch(boardSize)` retired; `role="group"`+`aria-labelledby` both panels; runtime `hasGroup:true, hasDeal:true`; e2e size-switching (`visual-regression:346`, `futoshiki:2`) stage-then-Deal, pass. |
| **futoshiki difficulty persists** | GREEN | folded into `PersistedBoard.difficulty`/`?difficulty=`/localStorage; `useUrlState.test.ts:158-212` 7 cases (url-only, case-insensitive, bare-arms, invalid→EASY, storage round-trip, board adopts, url-wins) all pass. |
| **cap + pool + FIFO + dedup** | GREEN | `UNDO_CAP=200`; `pushEntry` FIFO `shift()` at cap, releases refs. Unit: 202 edits→len 200 (`applyValue` ×200); 201 board entries→len 200, poolSize 401; same content→one slot; refcount survives one referrer, GCs on last drop. |
| **KISS audit** | GREEN | `package.json`/lockfile: **no** immutable/hamt/trie/immer dep added; no persistent-lib import in `src/`. Spine = tagged union + dispatcher + refcounted `Map` over the existing shape. |
| **KB figures** | GREEN (independent of lane arithmetic) | delta-dominated by construction (value≈43 B, board node holds no blob, 16×16 blob≈2.9 KB deduped); the forbidden 200-raw-16×16 ring (~500 KB) is structurally unreachable — board entries store pool refs, not inline boards. |

## 3 · Full battery (my run, working tree)

| Step | Result |
|---|---|
| `vue-tsc -b --force` | exit 0 |
| `npm run test:unit` | **267 passed / 21 files** |
| `lint:eslint` | exit 0 |
| `lint:knip` | exit 0 |
| `prettier --check src/` | "All matched files use Prettier code style" |
| `npm run build` | exit 0 — index **193.05 kB / gzip 69.44 kB** |
| default e2e (`PLAYWRIGHT_BASE_URL=…:4391`) | **62 passed** |
| `test:golden` (darwin) | **4 passed**; `git status e2e/goldens/` **clean — zero re-baselines** |

## 4 · Invariants

| Invariant | Verdict | Basis |
|---|---|---|
| E7 idle-paint (undo adds zero idle work) | PASS **(structural proxy, not CDP)** | `grep requestAnimationFrame|setInterval|setTimeout` in `useUndoHistory.ts`+`useUserMarks.ts` → **zero**; spine is pure reactive computed + `Map` ops, touches no animation/CSS/scheduler. See note (a). |
| controls-card cap holds | GREEN | my Playwright probe: **1280×800 → 608 px** (bottom 763 < 800), **1440×900 → 640 px** (bottom 829 < 900), both games; scrollHeight 1026 > cap → content scrolls inside, never above the sheet. No `*.css` cap file changed (`git diff HEAD`). |
| WM affordances | GREEN | `mobile-affordances.spec.ts` (tests 45–54) + `mobile-platform.spec.ts` (55–62) all pass vs my dist; native `.cell-native-input` untouched. |
| no modal | GREEN | `git diff HEAD -- '*.vue'` → no `role="dialog"`/`<dialog`/`showModal`/`alertdialog` added. |
| PRM | GREEN (structural) | spine adds no motion/animation; no new keyframes or transition. |

## 5 · Cross-seam

| Seam | Verdict | Basis |
|---|---|---|
| W8 user marks survive pin/unpin + peek | GREEN | `useUserMarks.test.ts:102` collision gate (engine peek marks never touch user notes) passes in the 267. |
| W9 tally + progress border | GREEN | no tally/progress/Difficulty file touched by the wave (`git diff --name-only`); board render e2e green. |
| W6 gen-bump parity vs futoshiki epoch consumers | GREEN | the parity change targeted **sudoku** randomize; futoshiki already bumped — its peek cache/void-watch unchanged; `futoshiki.spec.ts` + futoshiki unit green. |

---

## Team-lead outstanding

- **(a) E7 idle-paint measured by structural proxy, NOT the prescribed CDP 5 s-idle Performance
  delta.** The proxy is decisive (zero rAF/timers/scheduled work in the spine; no animation/CSS
  touched — for the undo machinery to add idle paint it would need a scheduled effect, and there
  is none), but it is not the literal CDP measurement the spec named. If the owner wants the
  CDP figure banked, run it against the dist; I judged the structural proof sufficient for a
  PASS and flag the method openly.
- **(b) Doc-truth nit — stale comment.** `web/frontend/src/games/futoshiki/composables/useUrlState.ts:7`
  still reads `- There is no difficulty (F3).` — now **false** after U2 folded `?difficulty=` into
  `PersistedBoard` (line 18 adds the corrective note but line 7 was not retracted). Cosmetic;
  contradicts the doc-truth discipline. One-line fix for the team lead; not a gate failure.
- **(c) Pre-existing tree state, not WU's:** `D CONTRIBUTING.md` was already staged-deleted at
  session start (outside `web/frontend`, no lane touched it). Flagged so it is not mistaken for a
  wave artifact.
- **Owner-taste / ratify-me flags carried up from the lanes** (unchanged by this verification,
  restated for the seal): B5 hint-ink-in-history (reverses "a reveal is not a user edit"); the
  verb label "Deal" vs owner's "bake"; coarse-only two-tap (no fine-pointer confirm variant);
  consecutive-coarse-deals re-arm (KISS consequence of `isDirty`=undo-depth); history is
  session-only (no reload rehydrate). All named in u1/u2/u3; none is a defect.
