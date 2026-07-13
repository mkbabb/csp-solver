# impl-C — iOS platform discipline: visualViewport + global touch CSS + landscape/iPad (T4-WM §1/§5)

**Lane C of T4-WM.** Charge (spec §1 platform rows + §5): wire the `visualViewport`
keyboard-avoidance the pad papered over; apply the global iOS/mobile touch discipline
deliberately (not scattershot); cure/probe the landscape + iPad geometry rows with born-RED
Playwright viewport probes; keep the board's gesture surface clean for lane E's coming
pointerdown long-press. Text-first; every command + output banked. Lane A's entry (pad
excision + native bounded entry) is the substrate; concurrent-lane reds (W6 futoshiki worker
arg, the §4 `rasterPose` async-bake rework) are demarcated below and are NOT this lane's.

## What changed

- **`src/games/shared/useKeyboardViewport.ts`** (NEW) — the keyboard-avoidance composable. On
  iOS the OS keyboard shrinks the VISUAL viewport while the LAYOUT viewport stays full-height
  (WebKit ships no `interactive-widget` / VirtualKeyboard — r3 2b/2c, hard refusals), so a
  focused board cell below the keyboard fold is eclipsed. `visualViewport` is the one
  cross-engine path (r3 2d, the primary path — VirtualKeyboard deliberately NOT used). Two
  PURE, exported helpers carry the geometry (`computeKeyboardInset`, `computeScrollDelta`) so
  the contract is unit-provable without a real keyboard; the composable wires document
  `focusin`/`focusout` + `visualViewport` `resize`/`scroll` to them. It publishes the keyboard
  occlusion height as `--keyboard-inset` (scroll-room, below) and scrolls the focused cell
  clear of the band — a MINIMAL reveal, not hard-centering (the spec's own residual-risk:
  centering can demand more scroll room than the boil scene has; minimal-reveal never fights
  the layout, so the §residual "fixed entry strip" fallback stays unspent). One
  document-scoped install from App.vue covers both games (keys on the shared `.board-cells`
  contract, no-ops elsewhere); on desktop the maths self-gate to zero delta (no jank).
- **`src/games/shared/useKeyboardViewport.test.ts`** (NEW) — 9 unit contracts over the two
  pure helpers (inset math incl. the pinch offsetTop + never-negative; minimal-reveal below/
  above the band, already-visible → 0, tall-cell top-seat).
- **`index.html`** — `viewport-fit=cover` added to the viewport meta (enables `env(safe-area-
  inset-*)`); no `maximum-scale`/`user-scalable` (pinch-zoom preserved, WCAG 1.4.4 — the iOS
  focus-zoom is defeated by lane A's 16px input font, not by killing zoom).
- **`src/assets/index.css`** — the deliberate platform block. `html { overscroll-behavior:
  contain }` (the app is an h-screen scene with no inner scroll container → the page IS the
  board scene's scroller; stops rubber-band / scroll-chain / pull-to-refresh). `.board-cells {
  -webkit-touch-callout:none; -webkit-user-select:none; user-select:none; touch-action:
  manipulation }` — the GAME-SURFACE-ONLY suppression (both games' shared `BOARD_CELLS_CLASS`
  grid): callout/user-select kill the iOS long-press loupe (user-select is the load-bearing
  half, r3 4b) so lane E's peek-hold has a clean surface; `manipulation` drops the double-tap-
  zoom delay without stealing pan/scroll or the long-press. Text everywhere else stays
  selectable. `-webkit-tap-highlight-color:transparent` + `-webkit-text-size-adjust:100%` are
  **deliberately NOT re-declared** — Tailwind preflight already sets both on `html,:host`
  (verified computed in the e2e); re-declaring would be the exact scatter the spec forbids.
- **`src/App.vue`** — `useKeyboardViewport()` installed in setup; `.corner-right` (the fixed
  top-right toggle chrome, at −4px under the notch today) gains `padding-top/right:
  env(safe-area-inset-*, 0px)` (0 on non-notched/desktop, a real clearance under a notch/
  Dynamic Island); `.board-group` (<1024) gains `padding-bottom: var(--keyboard-inset, 0px)`
  — the composable's inset becomes real scroll-room so a below-fold cell has somewhere to
  scroll up TO.
- **`e2e/mobile-platform.spec.ts`** (NEW) — 8 probes across five device geometries (all
  chromium, coarse via hasTouch+isMobile): ios-discipline ×4, keyboard-avoid (emulated
  visualViewport) ×1, landscape/iPad/large-iPad ×3.

## The `-webkit-touch-callout` verification note (the load-bearing test call)

Chromium DROPS unknown (WebKit-only) properties from the parsed CSSOM, so
`rule.style.getPropertyValue("-webkit-touch-callout")` returns "" even when authored — the
first probe cut failed on exactly this. The callout is therefore verified against the RAW
loaded CSS (the `<style>` tags vite dev injects + fetched linked stylesheets), regex-matched
inside the `.board-cells` rule. `user-select:none` (the reliable, computable half) is asserted
via computed style on both the container and an inherited child cell. The callout's real
device behavior is the owner-smoke row (r3 flags it flaky on iOS 26.1; user-select carries it).

## Gate rows: born-RED → close

| gate | born-RED (at HEAD) | close |
|---|---|---|
| **keyboard-avoid** | zero `visualViewport` references in src (the pad's `inputmode=none` masked the whole problem); the two geometry helpers do not exist | unit: **9 passed** (`useKeyboardViewport.test.ts` — inset math + minimal-reveal). e2e (emulated visualViewport, 390×640 coarse): the bottom-right cell is tapped while the band is full (RED precondition asserted: its bottom is BELOW the 360px keyboard line), the visual viewport is then shrunk to 360 + a resize fired, and the composable scrolls it so its bottom ≤ 360 — **never eclipsed. 1 passed** |
| **ios-discipline** | crit-mobile grep: overscroll/`-webkit-touch-callout`/`visualViewport` zero in src; user-select computes `text` on cells; no `env()`/`viewport-fit`; toggle at −4px | e2e (iPhone-geometry coarse, **4 passed**): `overscrollBehaviorY==='contain'` on `<html>`; `.board-cells` computes `touch-action:manipulation` + `user-select:none` (container + inherited cell); `-webkit-touch-callout:none` authored on `.board-cells` (raw-CSS proof); `-webkit-tap-highlight-color:rgba(0,0,0,0)` on a live interactive + `-webkit-text-size-adjust:100%` on `<html>` (preflight-delivered); viewport meta carries `viewport-fit=cover` and NOT `maximum-scale`; `env(safe-area-inset)` padding authored on `.corner-right` |
| **landscape-ipad** | R1/R2 profiles portrait-only; landscape + iPad entirely un-probed (crit gaps #3/#4) | e2e (**3 passed**): landscape phone (844×390) — no horizontal overflow (`scrollWidth ≤ clientWidth`), entry works, the tall board scrolls vertically (§5's expected non-goal, banked); iPad portrait (820×1180, 16×16 widest board) — no horizontal overflow, entry works; large iPad landscape (1194×834, coarse ≥1024 → desktop drawer) — the drawer tab is visible, ≥44px, and its tap toggles `aria-expanded` (clean touch target). No structural landscape re-layout needed — the geometry holds in-grammar |
| **parity** | — | full sudoku e2e green (47 passed); the 9 reds are ALL futoshiki, owned by concurrent lanes (see below); the toggle-crest-dark golden regression is the §4 `rasterPose` bake, PROVEN not-mine by isolation |

## Battery (this lane green; concurrent-lane reds demarcated)

```
npx vue-tsc -b --force   → my files CLEAN; sole error is W6's src/games/futoshiki/solver/
                            solver.worker.ts(101,24) TS2554 (generateFutoshiki 2 args, W6's rebuilt
                            binding wants 3) — NOT this lane
npm run test:unit        → 100 passed (11 files); incl. the 9 new keyboard-geometry contracts
npm run lint:eslint      → clean (exit 0)
npm run lint:knip        → clean (exit 0)
npx prettier --check src → clean (my files); the concurrent §4 rasterPose.ts/HandDrawnGrid.vue
                            mid-edit is that lane's, not checked here
npx vite build           → ✓ built in 660ms (app bundles; npm run build's vue-tsc prefix is blocked
                            ONLY by the W6 worker TS error above)
e2e mobile-platform.spec → 8 passed (ios-discipline ×4, keyboard-avoid ×1, landscape/iPad ×3)
e2e (full default suite) → 47 passed / 9 failed — every failure is FUTOSHIKI (futoshiki.spec ×4,
                            + the futoshiki twins of affordances/mobile-affordances/permalink/
                            share-truth ×5): the board never generates (W6 worker arg error) /
                            the lazy-scene bake throws (§4 rasterPose OffscreenCanvas rework,
                            +71/+58 uncommitted lines). ALL sudoku + all my probes pass; matches
                            lane A's identical futoshiki demarcation
goldens (test:golden)    → 3 passed (logo-light, cell-light, grid-corner-light); 1 failed
                            (toggle-crest-dark)
```

## The toggle-golden isolation (proof it is §4, not lane C)

`toggle-crest-dark` fails. `DarkModeToggle` consumes `bitmapsToUrls`/`revokeUrls` from
`rasterPose.ts`, which the §4 lane rewrote sync→async (`toDataURL`/`string[]` →
`convertToBlob`/`createObjectURL`/`Promise<string[]>` + `bm.close()`) — a bake-timing/output
change to the dark moon rest pose (a golden its own comment flags non-deterministic). My only
toggle-adjacent change is `.corner-right`'s `env(safe-area-inset,0px)` padding = **0 on the
non-notched darwin capture** (visually inert). Decisive isolation: with my env-padding
reverted, the golden **still fails** (banked); restored + re-verified. The regression is owned
by §4's `rasterPose` rework, not this lane. No golden re-baseline (parity: goldens unchanged).

## Notes / coordination

- **Lane E (long-press) hand-off**: the board gesture surface is left clean — NO JS touch
  handlers, no `preventDefault`. `.board-cells` carries `touch-action:manipulation` (allows
  pan/scroll + pointerdown long-press) and the `-webkit-touch-callout:none`/`user-select:none`
  suppression lane E's peek-hold declares as its prerequisite (spec §3). A cell-level
  `touch-action:none` on the hold interaction (r3 4b) will win over the container's
  `manipulation` by specificity — no conflict.
- **Concurrent-wave re-read discipline**: every Edit re-read its target region fresh (W6 edits
  SudokuBoard margin copy / futoshiki ControlPanel / worker; the §4 lane edits
  rasterPose/HandDrawnGrid — none overlap this lane's files: App.vue, index.css, index.html,
  the two new shared files, the new e2e spec). Ports 3000 (test) used; :3001 (owner) untouched.
- **Not this lane** (other WM lanes): the pad abrogation + native input (A, landed); the touch
  affordances (hint/undo/redo buttons, attribution tap, `@media (hover:hover)` hover-gating);
  long-press peek + haptics (E); the DPR2 perf cap + `rasterPose` async bake (§4). §1's
  platform discipline + §5's geometry are landed here; those ride their own lanes.
- **Real-device truth is the E8 close**: emulation cannot see the notch/Dynamic-Island
  clearance (env=0 headless), the iOS loupe suppression, or Low-Power-Mode/ProMotion — the
  deploy-at-seal + owner smoke carries them, exactly as W1's real-Safari row was owner-verified.
```
