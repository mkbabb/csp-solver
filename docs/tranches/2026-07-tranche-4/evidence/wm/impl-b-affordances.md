# impl-B — touch affordances + focus/entry look (T4-WM §2)

**Lane B of T4-WM (the design lane).** Charge (spec §2): give hint/undo/redo real touch
surfaces in the ControlPanel icon-btn grammar (≥44px, coarse variants, both games); cure the
attribution single-tap bug (r2 §3) and the sticky-`:hover` leak (r2 §4); style lane A's native
entry congruently (`:focus-visible`, iOS-clean, component-level). One hand: same stroke
register, same paper, same cadence as the board — no new visual grammar. Text-first; every
command + output banked. The tree carries concurrent lanes (W6 futoshiki generation-truth on
the worker/wasm; the §4 perf lane on `rasterPose.ts`; a chrome lane on logo/toggle) — their reds
are demarcated below and are NOT this lane's.

## What changed

- **Three hand-drawn icons** (new, pencil register — 24×24, `currentColor`, round joins, the
  DiceIcon/EraserIcon wobble): `UndoIcon.vue` (back-curl arrow, points left), `RedoIcon.vue`
  (its x-mirror, points right), `HintIcon.vue` (a lightbulb — the idea, distinct from Solve's
  check+sparkle).
- **The play-tools row** (both ControlPanels, mobile + desktop templates): undo / redo / hint as
  `.icon-btn`s with written sublabels, in a `.play-controls` row **gated `@media (pointer:
  coarse)`** (`display:none` on fine). One mechanism covers both coarse cases — the mobile card
  (`<lg`) and the iPad row-regime card (`≥lg`) — while a fine desktop keeps its keys + legend
  byte-identical (the row never renders there). The buttons ride the existing coarse `.icon-btn`
  block, so the 44px floor + sublabels come for free.
- **Hint wiring** (the load-bearing call): the panel is the board's **sibling**, so it holds no
  focus state. Rather than lift focus into the composable, the board factors its H-key path into
  `hintFocusedCell()` (identical `emit("hint", focusedPos.value)`) and `defineExpose`s it; the
  game wires the panel's `@hint` to `boardRef?.hintFocusedCell()`. **One hint grammar, two
  triggers** (H key + button) — desktop keyboard behavior is byte-identical (the H case now
  *calls* the same emit it used to inline). undo/redo need no board ref: the panel emits them, the
  game routes to `composable.undo()/redo()`.
- **Attribution single-tap fix** (`useHoverCard.ts`): a coarse tap fires focusin (open) then
  click (toggle → closed) in one gesture — net closed (r2 §3). The composable now drops the
  focus-open half on coarse (a pencil-local `matchMedia("(pointer: coarse)")` probe — the pencil
  boundary lint forbids importing games/shared's `useCoarsePointer`); the click toggle owns
  open/close, focusout still closes on an outside tap, and fine + coarse-keyboard (Enter) paths
  are untouched.
- **Sticky-`:hover` gate** (r2 §4): every hand-written `:hover` paint fenced behind `@media
  (hover: hover)` — `.icon-btn:hover` (bg + celestial wobble) and `.icon-btn:hover .sparkle-icon`
  and `.section-heading:hover` in both panels, `.ctrl-btn:hover` + `.hover-item:hover` in
  OptionSelector. (Tailwind v4 already scopes its `hover:` utilities to hover-capable pointers,
  so only the scoped CSS leaked — exactly the set r2 named.)
- **Entry focus, component-level** (both cells): `-webkit-tap-highlight-color: transparent` on
  `.cell-native-input` — the opacity-0 input is the cell's tap target, so iOS paints its gray
  flash on it; suppressed so the pencil ghost stays the sole focus voice. Scoped to this lane's
  entry surface, additive to lane C's global sweep (identical value, no conflict). The
  `:focus-visible` crayon-blue ghost (lane A's) stays the keyboard-focus ring (tap = no ring).
- **Born-RED unit contracts** (new, colocated): `ControlPanel.test.ts` × 2 (sudoku + futoshiki).
- **Re-home / extend**: two new e2e in `mobile-affordances.spec.ts` — the touch-play-tools gate
  and the attribution-single-tap gate.

## Gate rows: born-RED → close

| gate | born-RED (at HEAD) | close |
|---|---|---|
| **touch-affordances** (present) | `git show HEAD:…/sudoku/ControlPanel.vue \| grep 'Undo last move\|UndoIcon'` → **0**; `UndoIcon.vue` absent in HEAD | undo/redo/hint render both panels (unit: **8 passed / 2 files**); coarse e2e — all three **≥44px** (measured w44×h50), sublabeled, `.icon-btn` grammar |
| **touch-affordances** (wired) | keyboard-only (H / ⌘Z) — no button path | coarse e2e end-to-end: type "5" → Undo button ⇒ `""` → Redo button ⇒ `"5"`; Hint button fills the focused cell (solver-ink). Desktop parity: affordances.spec.ts **composed-keyboard (sudoku)** green (H/roving/undo byte-identical) |
| **attribution single-tap** | r2 §3 reproduced: focusin+click net closed (`aria-expanded` stays false) | e2e: tap `@mbabb` ⇒ `aria-expanded="true"` + `.hover-card.is-open` visible; probe `attribution-opens-on-tap: PASS` |
| **hover gated** | r2 §4: `.icon-btn`/`.section-heading`/OptionSelector `:hover` stuck after tap | all fenced `@media (hover: hover)`; probe: tap undo ⇒ computed `background-color: rgba(0,0,0,0)` (no stuck accent) |
| **focus/entry** | cell tap flashed the iOS gray box; blue-ring clash | `-webkit-tap-highlight-color: transparent` on the entry input; `:focus-visible` ghost preserved (lane A), `outline-none` holds — no default ring |
| **one hand** | — | after-crop: the play row is indistinguishable in register from the action row (same icon-btn, same pencil-hand sublabels, same muted graphite) |

## Battery (this lane green; concurrent-lane reds demarcated)

```
npx vue-tsc -b --force   → my files CLEAN; sole error is W6's src/games/futoshiki/solver/
                            solver.worker.ts(101,24) TS2554 (generateFutoshiki 2 args vs 3) — NOT this lane
npm run test:unit        → 108 passed (13 files); incl. the 8 new ControlPanel touch-tool contracts
npm run lint:eslint      → clean (exit 0) — the pencil-local coarse probe respects the boundary lint
npm run lint:knip        → clean (exit 0) — the 3 new icons are all consumed
npx prettier --check …   → my 15 touched files CLEAN
npx vite build           → ✓ 171 modules, built in 478ms (app bundles; npm run build's vue-tsc
                            prefix is blocked ONLY by the W6 worker TS error above)
e2e (coarse, preview)    → mobile-affordances "T4-WM §2" ×2 PASS; standalone probe evidence-b.mjs
                            ALL PASS (coarse media, 44px×3, sublabels×3, hover-not-sticky, entry
                            commits, undo/redo round-trip via buttons, hint fills, attribution opens)
e2e (desktop, preview)   → affordances.spec.ts + sudoku-interaction.spec.ts: 20 passed. The 2 fails
                            are BOTH the futoshiki twin (composed-keyboard + native-entry): the
                            futoshiki scene never generates (glyph count 0) — the concurrent W6
                            worker arg-mismatch + §4 rasterPose drawImage-detach block lane A already
                            ledgered, upstream of any UI wiring. My futoshiki panel is unit-green (4/4).
```

## Crops (`impl-b-crops/`, all ≤150 KB; iPhone-13 coarse, DSF2)

- `control-card-after-390.png` (53 KB) — the coarse control card with the play-tools row: undo /
  redo / hint below the action row, one hand.
- `control-card-before-390.png` (45 KB) — the same card with `.play-controls` hidden (the
  lane-B-HEAD state): no touch path to undo/redo/hint.
- `attribution-open-390.png` (58 KB) — `@mbabb` open on a single tap (avatar + link + heart).
- `evidence-b.mjs` — the standalone Playwright probe (crops + end-to-end verification), banked.

## Notes / coordination

- **Desktop presentation stays.** The play row is `display:none` on fine; the desktop DOM gains
  three hidden buttons but renders nothing new, and the composed-keyboard e2e is green.
- **Lane C boundary.** The GLOBAL tap-highlight/callout/user-select sweep is lane C's; this lane
  added only the component-level `-webkit-tap-highlight-color` on the entry input (additive,
  same value — no conflict).
- **Goldens.** No golden surface (cell/grid/logo/toggle) changed visually here: the cell's
  tap-highlight is an iOS-only paint (invisible in headless chromium goldens), the play row is
  coarse-only (goldens capture DPR2 fine), hover gates leave the resting state identical. The four
  goldens are golden-safe by construction; the parity run stays owned across lanes at the WGATE.
- **Design system.** The touch-affordance component is synced to the "CSP Solver — Pencil UI"
  design project (DesignSync, `components/mobile-touch-affordances/preview.html`, group
  "Mobile · Touch affordances") — the three icons + coarse row + pointer contract, self-contained.
- **W7 seam.** This wave gives hint its surface; W7 re-voices hint content through its own gate.
```
