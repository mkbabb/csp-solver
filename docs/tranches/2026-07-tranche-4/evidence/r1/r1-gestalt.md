# r1-gestalt — DESIGN LENS: the naive-eye whole-product read

Fresh build (`npm run build`, clean, 500ms) served from `dist/` on a free port (`vite preview --port 4290`);
:3001 left untouched. Browser extension was NOT connected, so I drove Chromium via the project's own
Playwright (1.61.1) — headless, deviceScaleFactor 2, clipboard perms, touch emulation for mobile. Both games,
both themes, 375 / 768 / 1440, mouse + keyboard, solved boards end-to-end, peeked, hinted, shared, cleared,
randomized, opened/closed the drawer, switched games, changed sizes.

Screenshots: `shots/` beside this file. Probes: `tour-desktop2.mjs`, `tour-mobile.mjs`, `tour-futoshiki.mjs`,
`probe-difficulty.mjs`, `probe-share.mjs` (all rerunnable: `node <file>` from `web/frontend`).

Verdict up front: the object largely coheres — one hand-drawn workbook, consistent ink/paper/celestial
grammar across games and themes, no crashes, no dead controls, no broken solves. The weak moments below are
mostly polish and one gameplay-depth hole; none is a hard break. Two things I chased turned out to be
non-issues and are recorded so the next round doesn't re-chase them.

## Dismissed (checked, NOT defects)
- **Difficulty "changing" MEDIUM→HARD across a tour** — difficulty is *randomized per fresh load*
  (EASY/MEDIUM/HARD all observed), self-consistent with the margin note each time. `probe-difficulty.mjs`
  shows H/K never mutate it. Not a bug.
- **Dark-mode Futoshiki carets look black-on-black** — a runtime probe caught a *transient* `fill:rgb(0,0,0)`
  path mid draw-in; once settled the caret strokes foreground off-white (`rgb(237,236,233)`, sw 5px) and is
  legible. `shots/f-caret-dark-crop.png` confirms. Only the low-salience angle survives (F9 below).
- **Clear not arming on desktop** — arming ("sure?") is coarse-pointer-only by design
  (`ControlPanel.vue:152` `if (isCoarse.value && !clearArmed.value)`). Desktop clears one-tap. Correct.

---

## Ranked weakest moments

### F1 [P2] Futoshiki ships as a non-puzzle — 19/25 given, 6 blanks, and no difficulty control
`family_hint: puzzle-gen-density`
A fresh 5×5 Futoshiki renders **19 given clues of 25 cells — only 6 to solve** (76% pre-filled). Sudoku 9×9
by contrast is 35/81 given (43%), a real puzzle. Measured by aria-label census:
`probe`: futoshiki aria-labels → `givenClue:19, empty:6`; sudoku → `givenClue:35, empty:46`
(run: the last `node -e` block; both games). Screens `shots/f01-load-desktop-light.png`,
`shots/m07-futoshiki.png` show it by eye. Compounding it, Futoshiki's control card has **only BOARD SIZE**
— no Easy/Medium/Hard — so a player can't ask for a harder board. The whole point of a futoshiki (deduce
from inequalities) never engages when the grid arrives near-complete. Weakest *product* moment on the page.
(Hedge: 5×5 unique-solution generation with few givens is genuinely hard; this may be a deliberate generator
floor. Still reads as trivial to a naive player.)

### F2 [P2] The wasm preload is wasted and the module is fetched twice on every cold load
`family_hint: preload-hint-mistuned`
`dist/index.html` carries `<link rel="preload" as="fetch" type="application/wasm" ...
csp_solver_wasm_bg-DMt0Bldp.wasm>`, but the solver runs in a Worker that fetches its own copy on first use.
Result on **every** page load (desktop, mobile, tablet, both games):
- console warning: `The resource .../csp_solver_wasm_bg-DMt0Bldp.wasm was preloaded using link preload but
  not used within a few seconds from the window's load event.` (captured in every tour's ERRORS block)
- network shows **two** requests for the same 86.74 KB wasm (`probe`: `wasm requests: [..., ...]` — two
  entries). The preload's ~39 KB gzip is downloaded, aged out unused, then re-fetched by the worker.
Named cost: wasted bandwidth on the critical path + a warning that pollutes the console of a product that is
otherwise console-clean.

### F3 [P2] The peek is visually overloaded — three ink layers at once
`family_hint: peek-layer-overload`
Hold-to-peek / K lays the teacher's key down as **red solution digits on the empty cells** while ALSO
mirroring **gray candidate-mark superscripts** into those cells, on top of the **black givens**. Three inks,
two of them in most empty cells. `shots/d10-peek-key.png` (sudoku) is dense to the point where reading "did I
have this right?" is work; `shots/f04-peek.png` (futoshiki) same. The peek's job is a fast glance at the
answer; the candidate-mark layer fights that. (Marks-on-peek is deliberate per source comments, but the
gestalt cost is real.)

### F4 [P3] Iridescent rainbow solved-ink reads loud against a restrained hand-drawn palette
`family_hint: celebration-ink-loud`
Every solved (non-given) cell fills with a saturated rainbow gradient. One or two would delight; a full 9×9
of rainbow digits (`shots/d13-solved.png`, `shots/m05-solved.png`, futoshiki `shots/f05-solved.png`) is a
wall of chroma against the otherwise disciplined graphite-on-cream, hand-drawn world. It tips from "gold
star" toward busy/juvenile and is the single biggest tonal outlier on the page.

### F5 [P3] Action-button hover tooltip pops up INTO the divider / difficulty label
`family_hint: washi-anchor-collision`
Hovering Solve (and its siblings) reveals a washi tape label anchored *above* the button, landing on the
"hold to peek" divider and the "Hard" difficulty word rather than beside the icon it names.
`shots/d13-solved.png` and `shots/f05-solved.png` both catch the "Solve" chip floating over the divider line,
colliding with the difficulty text above the button row. Reads as a mispositioned tooltip.

### F6 [P3] Closing the drawer to "grow the board" overflows the fold at 1440×900
`family_hint: drawer-closed-overflow`
The drawer-closed regime centers and enlarges the board (`html.drawer-closed`), but at a common 1440×900 the
result pushes the below-board margin note past the viewport: measured `boardBottom 878`, `marginBottom 911`,
`document.scrollHeight 911` vs `clientHeight 900` — an 11px vertical scroll appears and the
"your pencil case is under the board" hint is clipped. `shots/d18-drawer-closed.png`. The gesture that's
supposed to give the board room instead spills it.

### F7 [P3] The 4×4 board floats small in a large void beside the open drawer
`family_hint: small-board-void`
At size 4×4 (drawer open, desktop) the board does not scale up to the available space — it stays a small
square parked left of the drawer with a wide empty gap on its left and below. `shots/d20-size-4x4.png`. The
composition reads unbalanced/under-filled at the smallest size, where 9×9 and 16×16 feel intentional.

### F8 [P3] Mobile game-picker menu opens overlapping the board's top-left corner
`family_hint: picker-overlaps-board`
On 375, tapping the wordmark opens the games listbox as a paper note whose heavy black border sits **over**
the top-left cells of the board (`shots/m06-game-menu.png`). It reads as a z-layer collision rather than a
note placed on the paper — the one moment the two "objects" visibly clip instead of composing.

### F9 [P3] Futoshiki inequality carets are low-salience against the bold digits
`family_hint: caret-underweight`
The `>` `<` `^` carets are thin, light-gray, and small relative to the heavy hand-drawn digits, in BOTH
themes (`shots/f01-load-desktop-light.png`, `shots/f03-dark.png`; `f-caret-dark-crop.png` for the settled
dark state). They're legible but visually subordinate — the one mechanic that distinguishes Futoshiki from a
Latin square is the quietest mark on its board.

### F10 [P3] The desktop "controls" drawer tab is a tiny vertical-text sliver
`family_hint: drawer-tab-discoverability`
When the drawer is closed the entire control surface (size, difficulty, peek, all four actions) hides behind
a small vertical-text "controls" tab on the board's right edge, backed only by the margin line
"your pencil case is under the board" (`shots/d18-drawer-closed.png`). Low-affordance for first-time users
who close it and lose every control but the toggle.

---

## Coverage notes / gaps (why status is partial)
- Drove via Playwright/Chromium, not the (unavailable) browser extension — WebKit/Safari behavior is the
  sibling `../safari/` lane's job, not re-verified here.
- Did not exhaustively exercise: undo/redo chains, the mobile DigitPad full 1–9 entry to a hand-solve,
  16×16 solve-to-celebration, reduced-motion path. No blockers observed in what I did drive.
- Motion "feel" (jank/latency) judged from sampled frames (`shots/sw*.png` game-switch draw-in) not a
  profiler; the page-turn reads intentional and lands in ~0.7–1.0s.
