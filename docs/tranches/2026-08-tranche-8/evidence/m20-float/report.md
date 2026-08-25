# M20 — the wordmark floats on the board (owner's mark, 2026-08-04)

> **SUPERSEDED (T9-W0, 2026-08-25).** The cure this report describes — the height-only
> media key (`max-height: 500px`), `top: 50dvh`, and the gate's "the graze is the pose"
> tolerance — is NOT what shipped. The live pass of 2026-08-04 red-flagged it (§6.1 FAIL
> rows 1 and 7, both adjunct NOTEs), and the second cure replaced it on 2026-08-05: an
> **aspect gate** (`min-aspect-ratio: 2/1`, so 900×500 at 1.80 falls to flow), a
> **page-edge anchor** (`.board-group` at `width: 100%`, anchoring `left: 0` to the page
> gutter instead of a content-box gutter that shrinks as phones get taller — the mechanism
> behind the whole 932×430…844×430 class), and **`top: calc(50dvh - 1rem)`** retiring the
> 14px-low centring arithmetic. GameBoard's flow-band cap gained its second arm for short
> landscape under 2/1. The §M20 gate grew from this report's battery to seven poses. The
> shipped mechanism and its live proof are
> `docs/tranches/2026-08-tranche-8/evidence/wgate/close-record.md` §6.2 (the cure) and §6.3
> (the re-verify: 17 PASS at eight poses, both engines, overlap 0.00 everywhere) — plus
> §9.2 for the T8.1 continuation. Read what follows as the FIRST attempt and its forensics;
> the mechanism section below still holds, because the disease it names is the one the
> second cure actually killed.

The shot: a ~900-css-px-wide dark-mode window, the board filling the page top-to-bottom,
"sudoku" + caret lying mid-left ON the grid.

## The mechanism

`App.vue`'s landscape masthead dock — `@media (max-width: 1023.98px) and (orientation:
landscape)` — was derived at 844×390: board 366 fills the short edge, 153px side gutters,
wordmark docked `left: 0` at `--logo-scale: 0.38`, `top: 50dvh`. The key matched any window
under 1024 wide with width > height, including a 900×676 desktop window — where the board
takes 648 of 900, the gutter inside the group is 12px, and the docked wordmark lies 143px
deep on the grid, vertically centred. The regime key encoded "landscape ⇒ phone"; false at
desktop heights.

Swept before the cure (viewport grid, both engines): every 900-wide cell overlapped
(`scratchpad` sweep; wm 155×41 at x 114 vs grid at x 126). The chromium rows at
1440/1914/2200 in the raw sweep are a hit-test epsilon at exact adjacency (wm bottom =
grid top to the sub-pixel) — G2's gap-0 rule measured true, not a defect.

## The cure (2 declarations, 1 media-key edit)

- `App.vue`: the dock's key gains `and (max-height: 500px)` — landscape phones top out at
  430 css px (iPhone Pro Max); above the cut the band falls back to the portrait grammar
  (masthead in flow above the board).
- `GameBoard.vue` §M20: the fallback band caps the shell at the desk's own `100dvh − 10rem`
  (the `lg:` arm verbatim) — a board still sized to the whole short edge hung 88px below the
  fold under the in-flow masthead (measured both engines). Scoped HERE because scene.css is
  GameScene-scoped and its selectors can never reach the shell (first attempt landed there
  and built inert — caught by the born-RED rows, kept as the lesson).

After: 900×676 board 516 + masthead ≈118 = 634, whole in the first viewport; the sweep
reports no overlap at any size, both engines; the 844×390 dock is byte-identical.

## The gate

`e2e/masthead-alignment.spec.ts` §M20 (both engines): the fallback rows assert grid below
the title, no masthead×grid interpenetration, board whole above the fold — with the
un-height-scoped dock re-injected as the in-run control (the float must return, and does);
the dock row asserts the 50dvh centre and the gutter at 844×390. The GRID is the referent:
the wrapper's paper frame carries its own inset, and the ratified dock's box grazes the grid
box by 0.66px (the caret's right edge) — the graze is the pose; 2px is the line.

Ladder: CURED — PENDING OWNER RE-LOOK (the owner's own window is the eye).
