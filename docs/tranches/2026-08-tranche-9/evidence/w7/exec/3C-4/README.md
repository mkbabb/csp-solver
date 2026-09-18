# T9-W7 exec 3C-4 — a finger has no hover

Commits `ddfab36b` (the cure) and `2b6b8b7b` (repair r1) on `w7/exec`, on top of 3B-1
(`0a08a3cf` + repair r1 `881be039`), which narrowed the map this cure widens the readers of.

Handoff: `evidence/w3/handoffs/3C-4.md`. Intake: `evidence/w7/intake-from-w3.md`.

## The seam

`web/frontend/src/games/shared/GameBoard.vue:487`. `focusedPos` (`:427`) is confirmed to be the
board's roving-tabindex position ref in this file — it is written by `focusCell` (`:452`) and
`onCellFocus` (`:457`), read by the grid's `tabindex`, the peer wash and the hint verb.

```
-const hoveredPos = ref<number | null>(null);
+const pointedPos = ref<number | null>(null);
+const isCoarse = useCoarsePointer();
+const hoveredPos = computed(() =>
+  isCoarse.value
+    ? (pointedPos.value ?? (unitFocused.value ? focusedPos.value : null))
+    : pointedPos.value,
+);
```

`onCellHover` writes `pointedPos`; `hoveredAuthor` and `tapeAnchor` are untouched and still
gate on `session.roomId` and on the author not being you, so a solo board mints nothing.

### Two departures from the handoff's literal text, both deliberate

1. **`unitFocused` gates the coarse arm.** The handoff wrote
   `isCoarse ? (pointedPos ?? focusedPos) : pointedPos`. `focusedPos` is `ref(0)`, and the
   comment eight lines above the seam already says why that matters: "a fresh load — focusedPos
   0 with nothing selected — washes nothing". Ungated, a coarse player joining a session where a
   peer owns cell 0 would find a tape on screen before touching anything, and it would stay
   there after focus walked off the board. The same `unitFocused` gate the peer-unit wash has
   carried since T4-W8 fixes both; it is the grid's own `focusin`/`focusout`, so the tape lives
   exactly as long as the selection it names. Two rows pin it (`a resting board is bare`,
   `drops the tape when focus leaves the board`).

2. **A stylesheet rule the handoff did not name had to go.** `GameBoard.vue` carried

   ```css
   @media not all and (hover: hover) and (pointer: fine) {
     .attribution-tape { display: none; }
   }
   ```

   which hid the tape on exactly the surfaces this cure is for. The script seam alone would have
   shipped a mounted, invisible element. Measured, not reasoned: at the pre-cure tree the arm
   below reports `count: 1, display: "none"`, painted box **0 × 0 px**
   (`delta-before-390-chromium.txt`) — chromium's emulated tap synthesises a `mouseenter`, so the
   old JS arm did mount the node there and the CSS was what a thumb actually hit. Both halves
   earn their keep: the CSS deletion is what paints, the focus arm is what makes the tape follow
   the SELECTION rather than a synthesised hover that no engine promises.

The template comment's closing clause ("which is also the only route a coarse pointer has") and
the deleted rule's prose were both false after the cure and were rewritten in the same commit.

## The born-RED row

`web/frontend/src/games/shared/GameBoard.coarseTape.test.ts` — nine rows, `useCoarsePointer`
stubbed through `vi.mock` (the real one is a module-level `matchMedia` ref that jsdom pins
false). Six coarse rows, two fine rows, one precedence row.

RED at the pre-cure tree (`aab67b92` + 3B-1, cure not yet applied):

```
 Test Files  1 failed (1)
      Tests  3 failed | 6 passed (9)
```

failing on `raises the tape on a peer-authored cell the finger has focused` —
`AssertionError: a tap is the coarse pointer's only hover: expected false to be true`.

GREEN after (`ddfab36b`):

```
 Test Files  1 passed (1)
      Tests  9 passed (9)
```

The three rows that were RED are the three coarse-mount rows; the six that were already green
are the silences (own cell, unauthored cell, solo board, resting board, and both fine-pointer
rows), which is the shape a cure that only ADDS should have.

**What this layer cannot see:** jsdom applies no stylesheet, so the deleted `display: none` is
invisible to it. That half is proved in the browser arm below, not here, and the test file says
so in its own header.

## Gates

Run bare in `.claude/worktrees/w7-exec/web/frontend`, exit codes read from `$?`.

| gate | result |
|---|---|
| `npx vue-tsc -b --force` | exit 0 |
| `npx vitest run` | exit 0 — **Test Files 68 passed (68)**, Tests 826 passed (826) |
| `npx vitest run src/games/shared/GameBoard.coarseTape.test.ts` | exit 0 — Test Files 1 passed (1), Tests 9 passed (9) |
| `npm run lint` | exit 0 |
| `npm run lint:copy` | exit 0 |
| `npm run lint:live-regions` | exit 0 |
| `npm run lint:motion` | exit 0 |
| `npm run lint:eslint` | exit 0 |
| `npm run lint:boundary` | exit 0 |
| `npm run lint:theme-selectors` | exit 0 |
| `npm run lint:lanes` | exit 0 |
| `npm run lint:ink` | exit 0 |
| `npm run test:font-coverage` | exit 0 |
| `npx vite build --config .vite-exec.config.ts` | exit 0 |
| goldens (`playwright-golden.config.ts`, base `http://127.0.0.1:4259`) | exit 0 — **4 passed**, no snapshot updated, run twice (before and after the before-frame detour) |

`npm run lint` first came back exit 1 on the new test file's formatting; `prettier --write` on
that one file only, then exit 0. `e2e/` was never touched.

## π — the rect census

`probe/rect-census.mjs` (3B-1's, unmodified): every element's `getBoundingClientRect` on a
PINNED permalink board and on the gallery, at 1280×800 and 390×844, `reducedMotion: reduce`,
chromium. Taken on the worktree's own build BEFORE the edit and again AFTER, same server, same
port. `census/diff-before-after.txt`:

```
board-1280x800.json:   rects 1089/1089  max|d| 0.00px
board-390x844.json:    rects 1049/1049  max|d| 0.00px
gallery-1280x800.json: rects 1807/1807  max|d| 0.00px
gallery-390x844.json:  rects 1767/1767  max|d| 0.00px
WORST max|d| across all surfaces: 0.00px
```

**5,712 rects, 0.00px, and no element present on one side only.** Surfaces moved: none. The tape
is `position: absolute; width: 0; height: 0; pointer-events: none`, so even where it paints it
moves no layout.

**This census is a FINE-pointer number, at both viewports.** `rect-census.mjs` passes no
`hasTouch`, so `(pointer: coarse)` is false in it and the cured computed can only return what the
old ref returned — the 390×844 column is a narrow phone with a mouse, not a phone. (The second
reason holds too: the census board carries no session, and a solo board mints no tape by
construction.) The census the claim needs is coarse, and it is taken in "Repair r1" below: the
main tree's pre-cure dist against the cured build, 390×844, `hasTouch: true`, **both engines** —
0.00px over 2,816 rects each, `coarse=true`, `.attribution-tape` count 0.

## DELTA — what pixels the cure claims

`probe/coarse-tape-delta.mjs`, adapted from 3B-1's arm: one context, `?wire=local`, page A
widened to 1280×800 to reach the invite verb on the card, page B left on the phone's viewport
and driven by `tap()`. The context is a touch context, and the arm PRINTS the media match
rather than assuming it: `pointerCoarse: true, hoverNone: true` on every run.

The claim: **a new `.attribution-tape` box over a peer-authored cell while that cell holds the
board's focus, on coarse pointers only.** This arm only ever taps, and chromium's emulated tap
synthesises a `mouseenter`, so it cannot by itself tell the focus fallback from `pointedPos`; the
focus half is measured separately by `verify-r1/focus-arm.mjs` (reads B and C, both engines —
banked for this build at `repair-r1/focus-arm-390-{chromium,webkit}.txt`, and read again in
"Repair r1" below). Painted box of `.washi-label`, opacity 1:

| run | viewport | engine | peer cell tapped | tape | own cell tapped |
|---|---|---|---|---|---|
| `delta-before-390-chromium.txt` | 390×844 | chromium | 1 | `display: none`, **0 × 0 px** | 0 instances |
| `delta-after-390-chromium.txt` | 390×844 | chromium | 7 | "scrawny-gerbil", **109.59 × 33.58 px** | 0 instances |
| `delta-after-390-webkit.txt` | 390×844 | webkit | 0 | "genuine-scallop", **118.70 × 33.89 px** | 0 instances |
| `delta-after-820-chromium.txt` | 820×1180 | chromium | 2 | "civilian-crocodile", **122.28 × 33.53 px** | 0 instances |

**The widths are the slug's, not the cure's.** Each session mints its own player name, so the
tape is as wide as the name it carries: 109.59 / 118.70 / 122.28 px belong to "scrawny-gerbil",
"genuine-scallop" and "civilian-crocodile". Later runs on the same build measured 91.84–119.01 px
for other slugs. The invariant this cure proves is **0 × 0 → non-zero**; no particular width is
reproducible.

Frames (4, 128 KB total, all well under 150 KB each), cropped to the tapped cell and the berth
the tape hangs in — never a viewport:

- `frames/before-390-chromium-peer-cell-focused.png` (21 KB) — the pre-cure tree, same emulation,
  same gesture: the peer's digit is focused and the berth below it is **empty**. This is the
  0 × 0 row above.
- `frames/after-390-chromium-peer-cell-focused.png` (26 KB) — the same state cured:
  "scrawny-gerbil" in the peer's own ink, 109.59 × 33.58 px.
- `frames/after-390-webkit-peer-cell-focused.png` (35 KB) — webkit, 118.70 × 33.89 px. The peer
  cell was 0, so this frame also exercises the top-row `is-below` flip. The crop clamps at x=0,
  so the slug reads "…nuine-scallop"; the width above is the measured box, not the crop.
- `frames/after-820-chromium-peer-cell-focused.png` (45 KB) — the tablet viewport the intake
  names, 122.28 × 33.53 px.

Every run also taps a cell the local player wrote: **0 tape instances**, on every engine and
viewport. Nothing was added to the accessibility tree — the tape is `aria-hidden` by its own
anchor rule and stayed so; the coarse route to authorship in the spoken tree is still
`DigitCell`'s `authorName`, which 3B-1/W3 §3.3 already corrected.

## Gaps

- **`peerSlug` reads empty in every run.** The arm's roster selector
  (`.players-roster .player-row:not(:has(.player-self)) .player-name`) finds nothing at dock
  viewports, because the roster lives inside the sheet the arm shuts to reach the board. The
  slug in the tape is therefore checked against the tape alone, not cross-read from the roster.
  The class of thing it would catch — the tape naming the WRONG peer — is out of this cure's
  reach anyway: `hoveredAuthor` is unchanged and 3B-1 measured the map it reads.
- **Real devices are not measured.** `hasTouch` + `isMobile` emulation is what the estate has
  locally (M19 forbids Safari/simulator focus theft from this lane); the iOS instrument is
  W8 §8.3's, owner-run. What the emulation proves is the media match and the paint under it.
- **The synthesised-hover precedence row is emulation-shaped.** Chromium's emulated tap fires a
  `mouseenter`, so `pointedPos` wins over `focusedPos` there; a real device that fires no such
  event falls to the focus arm. Both paths are pinned by rows, but which one a given device
  takes is not measured here.
- **`820×1180` was run on chromium only** (one crop, as the brief allows). No webkit tablet run.
- **A hover that arrives and never leaves outranks the focus arm** — by design, and the precedence
  row pins it. A live emulated-tap hover on one cell with focus walked to another by ArrowLeft
  leaves the tape on the first. Every ordinary touch flow clears it: withdraw the hover and the
  tape falls through to focus, arrow off with no stale hover and it drops, tap a control off the
  grid and it drops (reads B, D and E, both engines). The residue needs a device that fires a
  hover-in with no hover-out plus a non-pointer focus move — an external keyboard on a phone.
  Chair's row, not a repair; the cheap hardening, if it is ever wanted, is clearing `pointedPos`
  on the grid's `focusout`.

`visual-regression.spec.ts` was a gap at `ddfab36b` and is not one now: **24 passed**, chromium
and webkit, exit 0, nothing re-baselined (Repair r1 below).

## Files

`ddfab36b`:

- `web/frontend/src/games/shared/GameBoard.vue` — the seam, the deleted media rule, two comments
- `web/frontend/src/games/shared/GameBoard.coarseTape.test.ts` — new, 9 rows

`2b6b8b7b` (repair r1, comments only):

- `web/frontend/src/games/shared/DigitCell.vue`
- `web/frontend/src/games/shared/BoardHost.vue`
- `web/frontend/src/games/shared/DigitCell.attribution.test.ts`

`web/frontend/.vite-exec.config.ts` is the scratch build config named by the standing laws; it is
untracked (`??` in `git status`), not committed, and not in any ignore file. The preview server
(127.0.0.1:4259) was killed.

---

## Repair r1 — commit `2b6b8b7b`

Verifier's round 1 ruled REPAIR on one MUST and five NOTEs; the mechanism and every number
reproduced. `verify-r1.md` is the ruling, `verify-r1/` its two probes.

### MUST-1 — three comments still called the asymmetry settled design

The cure rewrote the two comments in the file it opened and left three standing in neighbours,
one of them in the file 3B-1 edited a commit earlier. All three said a coarse pointer gets the
accessible name or nothing, which stopped being true at `ddfab36b`. Rewritten to the truth that
now ships — the name is the SPOKEN answer on every pointer, and the LOOK is no longer withheld
from a thumb:

| file | was | is |
|---|---|---|
| `src/games/shared/DigitCell.vue:71-75` | "coarse pointers have no hover to spend on the washi tape … a sighted touch user still gets nothing" | the spoken half, identical on every pointer; 3C-4 named as what closed the other half |
| `src/games/shared/BoardHost.vue:85-87` | the cell's name is "the only answer a coarse pointer can be given" | the tape rides the focused cell where there is no hover, so a coarse pointer is given it too |
| `src/games/shared/DigitCell.attribution.test.ts:14-17` | "hover is a fine-pointer grammar … so a thumb gets the NAME or it gets nothing" | the spoken route on every pointer, with the tape reaching a touch user as well |

Comments only — no behaviour, no template, no style. A grep of `src/` and `e2e/` for `coarse`
crossed with tape/hover/attribution finds no fourth site making the claim; the remaining coarse
comments are about other surfaces (the control panel's persistent sublabels, the hover card's tap
gate, the gallery's no-hover cards), each still true.

### NOTE-1 — the focus arm, cited beside the claim

The DELTA section now says outright that its tapping arm cannot separate the two paths, and cites
`verify-r1/focus-arm.mjs`. Re-run by the author on this build, in a live session, both engines:

| read | chromium | webkit |
|---|---|---|
| A — tap the peer cell | tape "dizzy-reptile", 98.78 × 33.76 | tape "active-emu", 91.84 × 33.64 |
| B — `mouseleave` dispatched on the cell root (a device with no hover at all) | **tape STANDS**, same box | **tape STANDS**, same box |
| C — ArrowRight back onto the peer cell, no pointer event at all | **tape rises**, same box | **tape rises**, same box |
| D — ArrowLeft onto an unauthored cell | count **0** | count **0** |
| E — tap the drawer tab, a control off the grid | count **0**, focus off the board | count **0**, focus off the board |

`pointerCoarse: true, hoverNone: true` printed on both runs.
`repair-r1/focus-arm-390-{chromium,webkit}.txt`. Reads D and E are also the proof that the
`unitFocused` gate earns its departure from the handoff: the handoff's ungated `focusedPos` would
have stranded a tape in both.

### NOTE-2 — the widths belong to the slugs

One clause added above the frames. This run's slugs measured 98.78 and 91.84 px for the same
state the commit message cites at 109.59 px. The invariant is 0 × 0 → non-zero.

### NOTE-3 — the coarse census, both engines

Taken by the author this round. BEFORE: the main tree's existing dist, which still carries the
`@media not all and (hover:hover) and (pointer:fine)` rule this cure deleted, so it is a genuine
pre-cure artifact — **copied** to the scratchpad and served read-only on 127.0.0.1:4258 (the main
tree was never built, edited or served). AFTER: the repaired worktree build on 127.0.0.1:4259.
390×844, `hasTouch: true`, `reducedMotion: reduce`, `verify-r1/census2.mjs`:

```
chromium  board 1049/1049 0.00px · gallery 1767/1767 0.00px · coarse=true · .attribution-tape 0
webkit    board 1049/1049 0.00px · gallery 1767/1767 0.00px · coarse=true · .attribution-tape 0
```

**2,816 rects per engine, 0.00px, no key on one side only.** `repair-r1/coarse-census/`.

And the repair's own π, since a comment can still change a build: the fine census of the repaired
build against `ddfab36b`'s banked `census/after/` — **1089/1049/1807/1767 rects, WORST 0.00px
over 5,712**, `repair-r1/fine-census/diff.txt`.

### NOTE-4 — the stranded hover

Recorded as a gap above, with the hardening named (`pointedPos` cleared on the grid's
`focusout`). Not taken here: `pointedPos` outranking focus is the cure's pinned precedence and
changing it would move a row this lane did not open.

### NOTE-5 / NOTE-6 — the sweep and the scratch config

`visual-regression.spec.ts` run bare by the author against the repaired build: **24 passed**
(12 rows × chromium + webkit), exit 0, `git status` clean after, nothing re-baselined. The gap is
struck. The `.vite-exec.config.ts` line now says untracked rather than excluded.

### The battery, re-run whole at `2b6b8b7b`

Bare, `$?` per gate, in `.claude/worktrees/w7-exec/web/frontend`.

| gate | result |
|---|---|
| `npx vitest run` | exit 0 — **Test Files 68 passed (68)**, Tests 826 passed (826) |
| `npx vue-tsc -b --force` | exit 0 |
| `npm run lint` | exit 0 (no prettier pass needed this round) |
| `lint:copy` `lint:live-regions` `lint:motion` `lint:eslint` `lint:boundary` `lint:theme-selectors` `lint:lanes` `lint:ink` `test:font-coverage` | all exit 0 |
| `npx vite build --config .vite-exec.config.ts` | exit 0 — and the built CSS greps **0** occurrences of `not all and (hover:hover) and (pointer:fine)` across all seven stylesheets, so the deletion still ships |
| goldens (`playwright-golden.config.ts`, base `http://127.0.0.1:4259`) | exit 0 — **4 passed**, `git status` clean after, no `--update-snapshots` |
| `e2e/visual-regression.spec.ts` | exit 0 — **24 passed**, chromium + webkit |

The born-RED row is untouched by this commit and stands as banked: 3 failed | 6 passed (9) at the
pre-cure tree, 9 passed (9) cured, re-run independently by the verifier.

Servers killed: 4259 (`vite preview`) and 4258 (the read-only copy of the pre-cure dist). The
scratchpad copy was removed. Worktree `git status` at return: clean but for the permitted
untracked `.vite-exec.config.ts`.
