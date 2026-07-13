# M3 — attribution parity + the fill-forced button + the record · T4-W8 ROW 5/6 + the W7 seam

**Lane M3 of T4-W8.** Charge: ROW 5 — futoshiki gets the attribution surface and the app's SOLE
third-party network hit is localized (self-hosted), zero per-game outbound dependency after, the
credited content + license obligations preserved. The fill-forced partial-solve button — a
control-panel affordance calling **W7's** `fillAllForced` (never re-implementing the detector),
the sweep riding the existing fill/draw-in grammar, both games, ≥44px touch per the WM idiom.
ROW 6 — the three B3 DECIDED-retire rows written on the record with rationale; the preserved
differentiators (A15/A16/A17) declared. Born-RED first; DELTA captures banked; the full battery.

Base SHA **`ae2517c2`**. Working tree carries the concurrent T4-W8 sibling lanes (M1 user marks,
M2 assist modes) and T4-W9 (progress border / tally) — their reds are demarcated below, NOT this
lane's.

## What changed

- **ROW 5 — the avatar localized (FAM-14).** The author avatar was the app's *only* third-party
  network hit: `<img src="https://avatars.githubusercontent.com/…">` in `AttributionCard.vue`,
  kept alive by the lone non-`self`/non-`data:` source in the CSP (`img-src … avatars.github
  usercontent.com`, `public/_headers`). Now **bundled**: the 64px PNG (6 KB) is committed at
  `src/pencil/chrome/AttributionCard/avatar.png`, imported through Vite (`import avatarUrl from
  "./avatar.png"`), emitted content-hashed under `/assets/` (`dist/assets/avatar-biqsjs3d.png`,
  immutable-cached by the existing `/assets/*` rule) and served same-origin. The
  `avatars.githubusercontent.com` allowance is **gone** from the CSP — the whole policy is now
  `img-src 'self' data:`, with no non-`self`/non-`data:` source anywhere. Credited content
  preserved verbatim (the same avatar bytes, the `@mbabb` link, the csp-solver project link). No
  OFL/font obligation touched — the fonts were already self-hosted (P5); this closes the last
  remote asset the same way.
- **ROW 5 — parity.** `AttributionCard` already mounts app-level (`App.vue`, desktop `.corner-left`
  + mobile), so it renders on BOTH games; the gap was the *copy* — `"CSP-powered Sudoku solver"`
  lied on futoshiki. Made game-agnostic: **`"CSP-powered logic puzzles"`** (twin of `index.html`'s
  deliberately game-neutral social head). Verified identical on both games (capture below).
- **The fill-forced button (the W7 seam).** New `fillForced()` on both composables
  (`useSudoku`/`useFutoshiki`) calls W7's `fillForcedSudoku`/`fillForcedFutoshiki` —
  `techniqueEngine.fillAllForced` over the adapter's self-computed candidates — and inks every
  returned naked+hidden single in ONE sweep through the **existing reveal draw-in**: `solvedValues`
  (solver-ink tone) + `animatingCells` (the board-normalized reveal wave), the identical bulk path
  `solve()` uses. Zero new timing constants; synchronous (no worker, no loading/solve state); not
  recorded on the undo stack (a forced fill is app-ink, like a reveal). One sweep by contract — a
  cell forced only *after* the sweep is left for the next press (the honest "fill what's forced,"
  distinct from the whole-board solve). The detector is **never** re-implemented here.
- **New icon** `src/pencil/chrome/icons/FillForcedIcon.vue` — a hand-drawn 2×2 grid with two cells
  penciled in (top-left + bottom-right), the other two open ("fill only what's forced"); on
  `:playing` the two marks draw themselves in on the same 350ms `drawIn` curve `SolveIcon`'s check
  uses (the icon echo of the board's reveal wave). Same outline register as `HintIcon`/`EraserIcon`.
- **Both ControlPanels** (mobile + desktop, each game): a **Fill** button in the action row, placed
  between Clear and Solve — the escalating-assistance order **Randomize · Clear · Fill · Solve ·
  Share** (Fill is the partial solve just under the full Solve). Plain `.icon-btn` grammar, so the
  ≥44px WM floor rides that class; a `useButtonAnimation(500)` press flourish; written `Fill`
  sublabel on coarse; a `fill forced` washi on the desktop hover. Emits `fill-forced`; the panel
  only reports the press.
- **Both Game.vue** shells wire `@fill-forced` to the composable's `fillForced` on both mounts.
- **Tests** — `+3` each to `sudoku`/`futoshiki` `ControlPanel.test.ts`: the Fill button renders in
  the `.icon-btn` grammar with the `Fill` sublabel, emits `fill-forced` on tap, and disables with
  the board (no forced fill mid-solve). `+6` total.

## Gate rows: born-RED → close

| gate | born-RED (base SHA `ae2517c2`) | close |
|---|---|---|
| **attribution parity** (born RED) | the card's copy is sudoku-only (`"CSP-powered Sudoku solver"`, `AttributionCard.vue:59`) — lies on futoshiki; and the author avatar is the app's SOLE third-party network hit (`img-src … avatars.githubusercontent.com`, `_headers:81`) | both games carry the app-level card with **game-agnostic** copy (`"CSP-powered logic puzzles"`); the avatar is **bundled same-origin** (`/assets/avatar-*.png`), the `avatars.githubusercontent.com` allowance removed — the CSP is `img-src 'self' data:`, **zero** third-party network dependency. Network-panel capture below: 64 requests, all self, 0 third-party, 0 CSP violations. |
| **fill-forced button** (born RED · the W7 seam) | `grep -rn 'fillForced\|fill-forced' src` → **0 matches** — no partial-solve affordance exists; the player fills every forced cell by hand or nukes the board with Solve | a control-panel **Fill** button in both games (mobile + desktop) calls W7's `fillAllForced` via the composable's `fillForced`, inking every naked+hidden single in one sweep through the existing reveal draw-in; ≥44px (`.icon-btn`); the detector is consumed, never re-implemented. DELTA banked (glyphs 61 → 80, +19). |
| **game-agnostic** | — | ROW 5's card + the fill button land identically in both games; the fill logic is W7's shared `techniqueEngine` via the two thin per-game adapters — no second implementation. `FillForcedIcon` is one shared pencil icon. |
| **B3 non-goals on the record** (ROW 6) | the engagement stack was a scattered set of assay rows with no terminal disposition on the wave record | the three DECIDED-retire rows carried below with rationale + re-entry criterion; A15/A16/A17 declared preserved. Nothing silently dropped. |

## π / DELTA (the facilities are visible)

- **DELTA (attribution network) — before → after.** *Before*: the CSP carried
  `img-src 'self' data: https://avatars.githubusercontent.com` and the card's `<img>` fetched
  `avatars.githubusercontent.com/u/2848617` — one live cross-origin GET when the card opened.
  *After* (built `dist/`, `vite preview :4188`, Playwright request log): **64 requests, every one
  from `http://127.0.0.1:4188`; third-party (http, non-self) = `[]`; the avatar loads from
  `/assets/avatar-biqsjs3d.png` (naturalWidth 64 — actually rendered); `securitypolicyviolation`
  events = `[]`.** The sole outbound dependency is retired.
- **π (attribution parity)** — `crops/pi-attribution-card-sudoku.png`, `…-futoshiki.png`: the same
  card on both games — bundled avatar, `@mbabb`, the crayon heart, `View project on GitHub`, and
  the game-neutral caption **`CSP-powered logic puzzles`** (read via `textContent` on both:
  identical). The born-RED sudoku-only copy is gone.
- **DELTA (fill-forced) — before → after.** `crops/pi-fill-forced-before.png` (a dealt board with
  ~20 empty cells, all graphite givens) → `crops/pi-fill-forced-after.png` (press **Fill**: the
  empty cells inked in the **solver-ink rainbow** tone via the reveal-wave draw-in). Runtime drive:
  `.sudoku-cell .glyph-svg` count **61 → 80 (+19 forced singles in one sweep)**; the single cell
  left empty is the honest one-sweep boundary (forced only after the sweep — the next press takes
  it). The solver-ink tone marks these as app-fills, distinct from the player's graphite.

## ROW 6 — the B3 non-goal retirements (DECIDED, on the record)

Ratified at ballot **B3** (README §3, 2026-07-12: *retire all three*). Written here so the wave
record carries them; not re-booked (M2/M6). The tranche-level anchor is README §4e; this is the
W8 wave-record twin.

| Affordance | x1 | Rationale | Disposition + re-entry criterion |
|---|---|---|---|
| **Dailies / streak / calendar** (A12) | sudoku.com stack | Needs dated-puzzle infrastructure + persistent identity our stateless `?board=` model doesn't carry; the streak-pressure frame IS the engagement stack the calm, ad-free product defines itself against. | **DECIDED-retire.** Re-entry only if the owner elects dated puzzles AND a persistent-identity store lands — neither is on any roadmap. |
| **Statistics / leaderboard / trophies** (A13) | sudoku.com stack | Competitive/monetization-adjacent; clashes with the calm, ad-free product; needs the persistent identity the stateless permalink model refuses. | **DECIDED-retire.** No re-entry criterion recorded — out of idiom by design. |
| **Pressure timers** (A11) | universal | A countdown clashes with the calm pencil idiom. | **DECIDED-retire.** Sole re-entry: if the owner elects a timer at all, it lands **off-by-default and non-punitive** — never a mistake-limit, never 3-strikes. |

**Preserved as differentiators (declared, not built):**

- **A15 — accessibility.** ARIA grid + roving tabindex + live regions + on-screen DigitPad. A
  genuine market lead (the mass market ships canvas grids with few live regions). Guard it.
- **A16 — permalink share / auto-save.** At/above market — the `?board=` permalink + localStorage
  auto-save (`useUrlState.ts`). The stateless share model is the thing the engagement stack can't
  coexist with, and it stays.
- **A17 — ad-free / no-mistake-limit / no-forced-login.** A design *law*, not a feature. The
  market's monetization noise (ads, hearts/lives, 3-mistakes-and-out, forced accounts,
  auto-fill-clutter) is our contrast. This wave's error-check mode (M2) defaults to on-demand and
  promotes *off* as skill-building — never a mistake-counter. The law is untouched.

## Battery (this lane green; concurrent-lane reds demarcated)

```
npx vue-tsc -b --force   → PASS (clean; +1 composable return each, +1 panel emit each, +1 png
                            import typed via vite/client)
npm run test:unit        → 244 passed (21 files); +6 new (fill-forced button render/emit/disable,
                            both ControlPanels)
npm run lint:eslint      → my 13 changed/added files CLEAN (scoped eslint exit 0). Sole repo-wide
                            error is T4-W9's untracked __p2capture.mjs (no-undef 'Buffer') — NOT
                            this lane (same red M2 demarcated).
npm run lint:knip        → PASS (exit 0)
npx prettier --check src → CLEAN (useSudoku.ts formatted by --write; the rest hand-matched; e2e
                            hand-matched, never --write'd)
npm run build            → ✓ vue-tsc -b && vite build, 190 modules; avatar emitted at
                            dist/assets/avatar-biqsjs3d.png (6.09 kB); index 188.16 kB (67.83 kB gz)
e2e (built dist)         → vite preview 127.0.0.1:4188 (:3000 squatted by a DIFFERENT project's
                            palette-api — left alone; :3001 owner untouched). 55 passed / 6 failed.
                            The 6 are a CONCURRENT-LANE (M1+M2) desktop overflow, NOT M3 — see below.
                            share-truth 5/5 GREEN with this lane's nth(3)→nth(4) Share-locator fix.
```

**The 6 e2e failures are a concurrent-lane regression, not this lane's.** All six
(`drawer:58`, `futoshiki:39/66/88/122`, `permalink:71`) fail on `button.logo-trigger` /
board-centering at 1280×800. Measured cause: the desktop `.controls-card` is **936px** tall
(> the 800px viewport), so the vertically-centered `.board-group` (1055px) overflows and pushes
the wordmark to **y = −127** (above the viewport — Playwright can't click it). The card grew that
tall from the **M1 `pencil-mode-toggle` + M2 `assist-settings`** rows added to the same panel;
M2's own evidence exercised only the 760×1040 stacked layout, never this row-regime, so the
overflow shipped uncaught. **This lane's Fill button is a single-line `justify-evenly` action-row
addition — height-invariant by CSS (4→5 buttons, no wrap, same 44px row) — so it neither causes nor
worsens the overflow.** Flagged for the integrating lead / M1·M2 to resolve (a scrollable or
height-capped desktop controls-card); out of M3's scope.

## Notes / seam decisions

- **The detector belongs to W7; W8 wires the button.** `fillForced` is ~12 lines of state plumbing
  over `fillForcedSudoku`/`fillForcedFutoshiki` — it computes nothing about singles itself. The
  load-bearing invariant (grade over self-computed candidates, never GAC masks) is entirely W7's
  and untouched.
- **Solver-ink tone, not a new tone.** Forced fills land in `solvedValues` (the sparkle-rainbow
  the solve/reveal use) + `animatingCells` (the reveal wave). This is the honest signal — the app
  filled these, not the player — and reuses the exact grammar, so no new draw-in code, no new
  timing constant, and the celebration stays closed (fill leaves `solveState` idle; the star gates
  on `'solved'`).
- **Not undoable, like a reveal.** `solve()` and `inkReveal` don't record on the undo stack; a bulk
  forced fill follows that convention (app-fills aren't user edits). Clear resets the board.
- **The card was already app-agnostic in MOUNT; the gap was CONTENT.** ROW 5 parity is a copy fix
  (+ the network localization), not a second mount — the diff adds no futoshiki-specific card
  component, honoring the game-agnostic gate.
- **Share-locator fix is mine to own.** Inserting Fill before Solve shifted the desktop Share
  button from the 4th to the 5th action `.icon-btn`; `share-truth.spec.ts`'s positional locator
  (position is used *because* Share's aria-label mutates on click) updated `nth(3)→nth(4)` by hand
  (e2e never `--write`'d). Every other action-button e2e locator is aria-label-based and robust to
  the insertion (Fill carries its own `Fill in the forced cells` label).
```
