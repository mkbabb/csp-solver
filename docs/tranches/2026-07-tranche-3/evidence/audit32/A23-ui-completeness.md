# A23 — UI Completeness: the live app played as a fresh user

Lane: A23 (design, Fable, frontend-design skill invoked). Read-only; nothing shipped.
Repo: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`

## Method

The mandated dev server at `:3000` was dead (`curl http://localhost:3000/` → connection refused; the only Vite on `:5173` is a different project — `lsof -p 8965` cwd `/Users/mkbabb/Programming/sci-report`). Launched this repo's frontend on **`http://localhost:3210`** (`npm run dev -- --port 3210 --strictPort`, log at `audit32/a23-harness/vite.log`) — left running. Drove it headless via the repo's own Playwright (`web/frontend/node_modules/playwright`), plus a parity pass on **https://sudoku.babb.dev**.

Harness: `audit32/a23-harness/probe{1..5}*.mjs` (+ `/tmp/a23-probe6.mjs`, focus probe). Screenshots: `audit32/a23-shots/` (28 files). Viewports: 1440×900 (light+dark), 375×812 touch (light+dark, dpr 2), 834×1194 touch. Owner shots consumed from `tranche3/owner-shots/` (3 present: dropdown-border, solved-star, heart).

## A. What verifiably works (carry as strengths, don't re-litigate)

- **Game-menu a11y is genuinely good**: trigger `aria-haspopup="listbox"` + `aria-expanded`, menu `role="listbox"`, `aria-activedescendant` (`logo-game-opt-0`) with `is-highlighted` roving state; Enter opens, ArrowDown+Enter switches game, Esc closes (probe1 `menuA11y`, probe2 `menuOpenViaEnter/gameAfterEnter=futoshiki`).
- **Grid semantics**: roving tabindex (one Tab stop into the grid, cells `tabindex="-1"`); rich cell names — "Row 4, column 9, given clue 5" / "your entry 4" (probe1 inventory, probe4 `labelAfterPress`).
- **Futoshiki inequality constraints ARE in accessible names**: "Row 1, column 1, empty, less than the cell below" (probe5 `futoshikiCellAria`). Grid labeled "5 by 5 futoshiki board".
- **Failed-solve grading works end-to-end**: duplicate entry + Solve → 3 `aria-invalid` cells, teacher's-red frames, grid ink shifts maroon, marginalia announces "not quite — check row 1" politely (probe5 `failed`, `desk-failed-zoom.png`).
- **prefers-reduced-motion honored**: the `index.css:374-379` global kill leaves every animation at 0.01ms/1-iteration under `reducedMotion: 'reduce'` (probe3 `rmDurations`; earlier raw `getAnimations()` count was a false alarm — durations are neutered).
- **Mobile 375 layout**: no horizontal overflow (`docW 375 = winW 375`, both games); 44px floor honored on real controls (probe3 `mobTapTargets` — only the dev-only tuner 40×40, in-card text links, and the design-exempted 39×39 cells fall below).
- **Live parity**: sudoku.babb.dev is the post-tranche build (logo-trigger + 5 washi labels present; `live-light-initial.png` matches local).
- **Peek gesture itself is excellent once found**: hold divider → answer-key laminate in teacher's red + tiny graphite candidate marks (`desk-peek-held.png`); K toggles it (probe2 `kPeek: true`).

## B. UI rows for the design waves (ranked)

### UI-1 — Game-menu popover: outer sketch border misaligned with the card (owner finding 1) — CONFIRMED LIVE, WORST ON MOBILE
On sudoku.babb.dev the hand-drawn outline sits offset up-left of the rounded card, corners overshooting (`live-menu-zoom.png`). At 375×812 dark the outer white rectangle floats well clear of the dark card on all sides — the board reads through the gap — reproducing `owner-shots/dropdown-border.png` almost exactly (`mob375-dark-menu.png`). In the light failed-state shot the gap even lets the maroon grid bleed through above the card (`desk-light-menu-zoom.png`). Root-cause ownership: `design-f1-dropdown-border.md` lane; this lane adds: **the defect scales with viewport** — any fix must be verified at 375, not just desktop.
Surrounding care (same outline machinery): `HandDrawnOutline` around both control panels stayed aligned in every shot — the drift is specific to the logo-menu pop's outline sizing.

### UI-2 — Celebration star occludes "solved it!" and the stats line (owner finding 2) — ROOT CAUSE FOUND
Every viewport, both themes: star renders directly on the status text (`desk-{light,dark}-solved-board.png`; mobile star box (18,495) 52×52 vs status (16,502) 343×21 — full overlap, probe5 `mobStar`; `mob375-dark-solved.png` shows "solved it!" and "0 backtracks — 3ms" struck through). Cause: `pencil/chrome/CelebrationStar.vue:123-129` — the H6 enlargement (2.5→3.25rem) kept the old top-left anchor (`left: 0.25rem; top: calc(100% + 0.25rem)`), the comment even says "No reposition"; but MarginNote's status voice occupies exactly that below-board slot (`SudokuBoard.vue:411-414`). The star and the sentence want to be composed together (star as bullet/flourish beside the text), not stacked. Related lane: F2-completion-formulation.

### UI-3 — CrayonHeart is theme-static; muddy in dark (owner finding 3) — CONFIRMED + MEASURED
Identical paint both themes: base `rgb(201,24,74)` + `rgb(255,77,109)` + black stroke details, while the card bg flips cream↔near-black (probe4 `heart_light/heart_dark`; `heart-zoom-dark.png` — crimson sinks into the dark card, the smiley reads as smudges; light is crisp). The heart needs a dark-theme variant (lighter pink body or a light halo/stroke), same treatment question for any other theme-static pencil pigment. Related lane: F7-heart-yoshi.

### UI-4 — The peek/marks gesture is undiscoverable on every touch device
The app's best moment is invisible to a whole input class:
- Mobile branch of the hold surface has **no washi label at all** — `title="Hold to peek at the answer key"` only, and title tooltips don't exist on touch (`games/sudoku/ControlPanel/ControlPanel.vue:187-191`; probe3 `mobPeek`: `washiText: null`, surface 335×14).
- Desktop's washi "hold to peek" is `opacity: 0` at steady state, revealed only on hover (probe2 `washiSteady`) — so iPad (touch, no hover; `ipad834-light.png` uses the stacked/mobile panel per probe3 `ipadLayout`) also never sees it.
- The hold surface is **14px tall** (desktop 211×14, mobile 335×14) — under any tap-target floor, and visually just a hairline divider; the panel's *other* divider (after SIZE) looks identical but does nothing, teaching users that dividers are inert.
Row for the wave: give the peek an honest affordance — persistent washi (or a peek icon in the icon row) on coarse pointers, and a taller hit area.

### UI-5 — All four icon actions are unlabeled on touch
Randomize/Clear/Solve/Share washi labels are hover-only (probe2 `washiSteady`: five labels, all `opacity: 0`). On touch the icon row is pictograms-only (dice/eraser/check/share — eraser-vs-dice intent is guessable but not certain for the destructive "Clear"). `aria-label`s exist (`ControlPanel.vue:205,213,223,232`), so SRs are fine — it's sighted touch users who get no text. Consider: labels persistent on coarse pointers, or a confirm beat on Clear.

### UI-6 — Keyboard focus falls into the invisible attribution card (original find, WCAG 2.4.7 shape)
Closed `.hover-card` is `opacity: 0; pointer-events: none` but **not** `visibility: hidden`/`inert`, and `useHoverCard` has no focus trigger (`pencil/chrome/AttributionCard/useHoverCard.ts:1-30` — hover/toggle only). Tab stops 3-4 land on the invisible "@mbabb" and "View project on GitHub" links (probe6: focused `A @mbabb`, opacity chain `1,1,1,0`; probe1 `tabWalk` steps 3-4; `focus-into-closed-card.png`). Focus visibly disappears for two stops. Fix shape: open the card on `focus-within`, or `visibility: hidden` + transition, or `inert` while closed.

### UI-7 — K-peek is dead from the grid's own resting state; shortcuts have no on-surface legend
`App.vue:124` guards K away when focus is inside `.board-cells` — but a board cell input *is* the roving-tabindex resting state, so a keyboard player who has entered the grid (the normal state of play) presses K and gets nothing (the cell rejects it as a non-digit; no peek). And neither K nor Cmd/Ctrl+Z / Shift+Z (undo/redo, `SudokuBoard.vue:192-200`) is written anywhere on the surface — no keyboard legend, no title hint. Undo/redo consequently has **zero affordance for mouse/touch users**. Rows: (a) let K work from cell focus (it can't collide with digit entry), (b) a small hand-written keyboard legend or margin note.

### UI-8 — Static `<title>`, no `h1`
`document.title` is "Sudoku - CSP Solver" on Futoshiki too, after both URL load and in-app switch (probe2 `titleAfterSwitch`/`futoshikiTitle`; also true on the live site). The wordmark is a `<button>` with no heading semantics; the only headings on the page are the control-panel `h2`s ("Size", "Difficulty") (probe1 `landmarks`: `h1: []`). Row: per-game title (`futoshiki — CSP Solver`) + wrap the masthead in an `h1`.

### UI-9 — "hold to peek" washi chip collides with the "Hard" option when it does appear
On desktop hover the chip renders overlapping the "Hard" row's text instead of sitting on the divider (`desk-peek-hover.png`, also visible mid-hold in `desk-peek-held.png`). The one moment the affordance shows itself, it's broken typography. Anchor it to the divider's own box.

### UI-10 — Solved rainbow digits are near-invisible in light theme
Solver-filled digits render as pastel rainbow strokes; on the cream paper they drop to roughly 1.3-1.5:1 against `rgb(251,250,249)` (approximate, sampled from `desk-light-solved-board.png` swatches — e.g. the pastel-cyan 9s/4s) vs crisp on dark (`mob375-dark-solved.png`). Values stay readable via cell inputs/aria, so it's a legibility-of-the-moment row, not a data loss — but the payoff of "watch it solve" is washed out in the default light theme. The user-entry blue `rgb(37,99,235)` (probe4 `solvedGlyph`) is fine in both.

### UI-11 — Futoshiki's margin voice is empty on desktop, present on mobile
Desktop `?game=futoshiki`: the live region exists but is empty and no status line renders under the board (probe2 `futoshikiLive: [""]`; `desk-light-futoshiki.png`). Mobile shows "a fresh 5×5" (`mob375-dark-futoshiki.png`). Sudoku says "a fresh 9×9, medium" everywhere. MarginNote is "in flow when stacked, overlay in the row regime" (`SudokuBoard.vue:411-414` for sudoku's) — the futoshiki row-regime overlay appears to be the broken/empty leg. Reproduce and fix in the wave; also decide whether Futoshiki's generation line should name a difficulty the way Sudoku's does (Futoshiki v1 has none — the sparser BOARD SIZE-only panel is correct, but the voice should still speak).

### UI-12 — Mobile SIZE/DIFFICULTY tabs read as headings, and the inactive tab hides its value
375: the two headings sit side-by-side; only the active tab's options render (`mob375-light-bottom.png`; probe3 `mobPanels`: `Size expanded=true, Difficulty expanded=false`, 44px targets — good). Nothing signals the headings are tappable except the active underline, and current difficulty is invisible while Size is open (mitigated by the status line "a fresh 9×9, hard"). Low-priority row: a subtle affordance on the inactive heading (e.g. its current value in small graphite beneath it).

### UI-13 — Conflict feedback only arrives after a failed solve (deliberate — decide, then say it)
Typing a visibly duplicate digit produces no mark at entry time: `SudokuBoard.vue:79-84` gates `findConflicts` on `solveState === 'failed'` ("the teacher grades actual work", conflicts.ts docstring). Verified: duplicate committed with zero `aria-invalid` (probe4), red circles + "not quite — check row 1" only after Solve (probe5). The pedagogy is defensible and on-soul; the completeness gap is that a fresh user doesn't know grading exists until they happen to press the checkmark. If the model stays, consider the margin voice hinting it ("mark it and I'll grade") the first time a duplicate is present.

## C. A11y spot-audit summary

| Check | Verdict | Evidence |
|---|---|---|
| Focus order | Mostly logical (chrome → toggle → wordmark → grid → controls) but stops 3-4 are invisible links (UI-6); first stop is the dev-only tuner (dev builds only) | probe1 `tabWalk` |
| Focus visibility | Buttons: visible (`outline: auto/solid`); grid cell: custom ghost path on `:focus-visible` with RM fallback (`SudokuCell.vue:381-386`) | probe1 `tabWalk`, probe3 `clickFocusStyle` |
| ARIA | Listbox pattern correct; cells labeled given/entry/empty; `aria-invalid` tier real (post-grade); futoshiki inequalities named | §A |
| Live regions | Sudoku: polite marginalia for fresh-board, solved ("solved it!"), failed ("not quite — check row 1"). Futoshiki desktop leg empty (UI-11). Stats line not announced (minor) | probe2 `liveAfterSolve`, probe5 `failed` |
| Contrast (light) | Muted UI text 4.55-4.66:1 — AA pass at its sizes; status line 14.5:1; solved rainbow digits fail hard (UI-10) | probe3 `contrastLight` |
| Contrast (dark) | Digits/labels strong; heart fails (UI-3) | shots |
| Marks gesture discoverability | The audit's worst area — UI-4/UI-7 | probes 2/3 |
| Tap targets | 44px floor honored (R3, `index.css:382-386`) except the 14px peek divider (UI-4) | probe3 `mobTapTargets` |
| Reduced motion | Honored via 0.01ms global kill; component fallbacks (DarkModeToggle opacity fade `DarkModeToggle.vue:252-262`) | probe3 `rmDurations` |
| `<title>`/headings | Static title, no h1 (UI-8) | probe1 `landmarks` |

## D. Owner-shot ledger

| Owner shot | Status | This lane's addition |
|---|---|---|
| dropdown-border.png | Reproduced on live + local; worst at 375 dark | Verify fix at mobile scale; the panels' HandDrawnOutline is healthy — defect is menu-pop-specific (UI-1) |
| solved-star.png | Reproduced everywhere | Root cause `CelebrationStar.vue:123-129` anchor vs MarginNote slot (UI-2) |
| heart.png | Reproduced; colors measured theme-static | Needs a dark variant, not a filter tweak (UI-3) |
| (4th finding — no shot present; only 3 files in owner-shots/) | — | Nearest-neighbor care rows: UI-9 (washi collides with "Hard"), UI-11 (futoshiki margin voice) |

## E. Notes for the wave authors

- The dev server situation: anything probing ":3000" from the tranche brief will hit a dead port; my `:3210` instance is up (kill freely — it's mine, not the owner's).
- The failed-state maroon ink + red framing is a strong, coherent beat — protect it during any conflict-timing change (UI-13).
- Fix verification for UI-1/UI-2/UI-4 should re-run `a23-harness/probe{1,2,5}` — they encode the reproductions.
