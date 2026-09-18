# 3C-4 — non-author verification, round 1

Verifier ran against `ddfab36b` on `w7/exec`. Nothing in the worktree was edited or stashed;
the two scratch files used for the born-RED re-run were deleted before any gate. Servers on
127.0.0.1:4259 (the worktree's own `vite preview`) and 127.0.0.1:4258 (a COPY of the main tree's
existing dist, served read-only from the scratchpad) were both killed at the end; 4259/4258/4257
free at return. The main tree's `src`/`dist` was never built, edited or served.

**Verdict: REPAIR** — one MUST, five NOTEs. The mechanism is sound and every number in the
author's return reproduced. The repair is three stale comments in files the cure did not open.

## What I re-measured myself

| claim | author | mine | verdict |
|---|---|---|---|
| born-RED at the pre-cure tree | 3 failed \| 6 passed (9) | **3 failed \| 6 passed (9)**, same three rows | CONFIRMED |
| the row GREEN at the cure | Test Files 1 passed, Tests 9 passed | **1 passed (1) / 9 passed (9)** | CONFIRMED |
| full unit battery | Test Files 68 (68), Tests 826 (826) | **68 passed (68), 826 passed (826)**, exit 0 | CONFIRMED |
| `npx vue-tsc -b --force` | exit 0 | exit 0 | CONFIRMED |
| `npm run lint`, `lint:copy` | exit 0 | exit 0, exit 0 | CONFIRMED |
| `lint:live-regions` `lint:motion` `lint:ink` `lint:boundary` `lint:lanes` `lint:theme-selectors` `test:font-coverage` | exit 0 | **all exit 0** (run bare, `$?` read per gate) | CONFIRMED |
| `npx vite build --config .vite-exec.config.ts` | exit 0 | exit 0 (rebuilt from HEAD myself) | CONFIRMED |
| goldens 4/4, none re-baselined | 4 passed | **4 passed**, `git status` clean after | CONFIRMED |
| π rect census 0.00px / 5,712 rects | 0.00px | **0.00px**, and the author's `before/` and `after/` JSONs are **byte-identical** | CONFIRMED |
| pre-cure browser row: tape mounts, `display: none`, 0 × 0 px | count 1, none, 0×0 | **count 1, `display: none`, 0 × 0** on the MAIN tree's independently built dist | CONFIRMED |
| `visual-regression.spec.ts` | NOT RUN | **24 passed (12 rows × chromium + webkit)**, exit 0 | GAP CLOSED |

### The born-RED, re-run without touching the tree

`git show ddfab36b^:…/GameBoard.vue` → `src/games/shared/GameBoardPrecure.vue`, the row copied
beside it with its import repointed, `npx vitest run` on that one file, both scratch files deleted
straight after (worktree `git status` clean, only the permitted `.vite-exec.config.ts`):

```
 FAIL … > raises the tape on a peer-authored cell the finger has focused
 FAIL … > drops the tape when focus leaves the board
 FAIL … > a synthesised coarse hover takes the focused cell's place while it lasts
 Test Files  1 failed (1)
      Tests  3 failed | 6 passed (9)
```

The three RED rows are the three that need the cure; the six silences were already green. The
row is born RED for the right reason and for no other.

### π, stronger than the author's

The author's census is chromium-only and, crucially, **not a touch context** — `rect-census.mjs`
passes no `hasTouch`, so `(pointer: coarse)` is false there and the cured computed can only
return exactly what the old ref returned. That census proves the fine-pointer surfaces and
nothing about the surfaces the cure is for. I reproduced it (0.00px over 5,712 rects against the
author's banked `after/`) and then took the census the claim actually needs: the main tree's
existing dist — which still carries the deleted `@media not all and (hover:hover) and
(pointer:fine)` rule, so it is a genuine pre-cure artifact — against the worktree's cured build,
at 390×844, `hasTouch: true`, **both engines**:

```
chromium  coarse=true   board 1049/1049  0.00px   gallery 1767/1767  0.00px
webkit    coarse=true   board 1049/1049  0.00px   gallery 1767/1767  0.00px
.attribution-tape node count on a solo board: 0, both engines, both routes
```

2,816 rects per engine, no key present on one side only, 0.00px. Surfaces moved: none.
Probe banked at `verify-r1/census2.mjs`.

### The focus arm, isolated — the half the author's arm could not prove

The author's delta arm taps, and chromium's emulated tap synthesises a `mouseenter`, so
`pointedPos` may be what carried every AFTER number: the arm proves the CSS deletion, not the
focus fallback. `verify-r1/focus-arm.mjs` separates them on the cured build, in a session, both
engines (slugs differ per run — they are minted per session):

| read | chromium | webkit |
|---|---|---|
| A — tap the peer cell | tape, 119.01 × 34.12 | tape, 99.19 × 33.24 |
| B — `mouseleave` dispatched on the cell root (a device that fires no hover at all) | **tape STANDS**, same box | **tape STANDS**, same box |
| C — ArrowRight onto the peer cell, no pointer event whatsoever | **tape rises** | **tape rises** |
| D — ArrowLeft off it onto an unauthored cell | tape count **0** | tape count **0** |
| E — tap a control outside the grid (the drawer tab) | tape count **0**, focus off the board | tape count **0** |

The focus fallback is real in a browser, in both engines, and the `unitFocused` gate drops the
tape on the two ways a finger leaves a cell. The author's departure from the handoff's literal
text is not just defensible, it is load-bearing: with the handoff's ungated `focusedPos`, reads
D and E would both have left a tape behind.

### Frames

All four read honestly and each is a crop, never a viewport: 21,071 / 25,961 / 35,745 / 45,376 B,
all far under 150 KB. The BEFORE frame's berth is empty above and below the focused peer digit;
the three AFTER frames carry the slug in the peer's ink, below the cell on the top row
(`is-below`) exactly as `tapeAnchor` says. The webkit crop's clamp at x=0 is disclosed in the
README and visible in the frame.

### Copy, by ear (M16)

The cure ships no new product string. What a player reads is the peer's own slug, which is the
estate's existing player-name grammar; no jargon, no machine naming itself, no dash.
`lint:copy` exit 0 in my hands.

### Spoken contract

`SheetWashiLabel` sets `aria-hidden="true"` for every anchor but `tag`/`persistent`, and the tape
uses the default anchor — so the tape is out of the accessibility tree before and after, and the
cure adds nothing to it. No a11y spec, no `DigitCell.attribution.test.ts` intent and no live-region
source was touched (the commit is two files). `lint:live-regions` exit 0.

---

## Findings

### MUST-1 — three comments in src/ still assert the asymmetry this cure abolishes

The cure rewrote the two comments in the file it opened and left three elsewhere, each stating as
settled design the exact thing that no longer ships:

- `web/frontend/src/games/shared/DigitCell.vue:73-75` — "coarse pointers have no hover to spend on
  the washi tape … a sighted touch user still gets nothing."
- `web/frontend/src/games/shared/BoardHost.vue:85-86` — the cell's accessible name is "the only
  answer a coarse pointer can be given."
- `web/frontend/src/games/shared/DigitCell.attribution.test.ts:14-17` — "hover is a fine-pointer
  grammar … so a thumb gets the NAME or it gets nothing."

`BoardHost.vue` is the file 3B-1 opened one commit earlier, so the drift is inside this lane's own
blast radius. The estate's standing lesson is that a ruling lands with its enforcing text in the
same commit, and that a stale row survives two closes when nobody re-reads it (T7 audit F-2).
FIX: three short comment edits in the 3C-4 commit — the name is still the spoken answer on every
pointer; what changed is that the LOOK is no longer withheld from a thumb. No behaviour moves, so
the battery and the census stand as measured.

### NOTE-1 — the DELTA's headline claim outruns the arm that produced it

`README.md:143-145` claims the box paints "while that cell holds the board's focus." The arm that
produced 109.59 × 33.58 taps, and a tap in chromium emulation synthesises a hover, so that run
cannot tell the focus arm from `pointedPos`. The author names this in the gaps but not beside the
claim. It is now measured (reads B and C above, both engines); cite `verify-r1/focus-arm.mjs`
beside the number and the claim earns its wording.

### NOTE-2 — the cited widths are slug-dependent, not constants

109.59 / 118.70 / 122.28 px are the widths of "scrawny-gerbil", "genuine-scallop" and
"civilian-crocodile". My runs, with the slugs a fresh session minted, measured 99.19–119.01 px for
the same state. The number that proves the cure is **0 × 0 → non-zero**, not any particular width.
Worth one clause in the README so a later lane does not chase a 109.59 that was never reproducible.

### NOTE-3 — the census's 0.00px at 390×844 is a fine-pointer number

The README explains it by "the census board carries no session," which is true but not the whole
reason: the census context is not a touch context at all, so `isCoarse` is false in it. The
coarse, two-engine census is above; fold the number or the caveat into the README.

### NOTE-4 — a synthesised hover that never leaves can strand the tape

Measured: with a live emulated-tap hover on cell 3 and focus walked to cell 2 by ArrowLeft, the
tape stayed on cell 3, naming a peer the selection had left. `pointedPos` outranks the focus arm
by design (the author's own precedence row pins it), and every realistic touch flow clears it —
tapping another cell moves it, tapping a control drops it, withdrawing the hover falls through to
focus (reads B, D, E, both engines). The residue needs a device that fires a hover-in with no
hover-out and a non-pointer focus move (an external keyboard on a phone). Chair's row, not a
repair: the cheap hardening, if it is ever wanted, is clearing `pointedPos` on the grid's
`focusout`.

### NOTE-5 — `visual-regression.spec.ts` is no longer an expectation

The handoff asked for the sweep and the author reported it NOT RUN. I ran it against the cured
build: **24 passed**, chromium and webkit, exit 0. Nothing about it was re-baselined. The gap can
be struck from the README.

### NOTE-6 — a trivial accuracy

The README says `.vite-exec.config.ts` "is locally excluded." It shows as untracked (`??`) in
`git status`, not excluded. It is correctly left uncommitted either way.

## What I did not run

- No real device, and no Safari or simulator was touched (M19 honored end to end — playwright
  chromium and webkit only).
- No webkit run at 820×1180, and no second BEFORE frame; the brief caps the bank at four crops and
  the author spent them well.
- The roster cross-read of the slug (the author's own gap) stays open; it is out of this cure's
  reach, as the author says — `hoveredAuthor` is untouched and 3B-1 measured the map it reads.
