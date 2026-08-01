# F1 "CADENCE STRATA" — SPEC + PLAN (pass 1 synthesis)

All paths relative to `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`.

## The center, resolved

Placement = cadence, with the keyboard map as the oracle (`K H P ⌘Z ⇧Z`). Three homes:

- **Per-move → `GameToolbar.vue`** (new, `src/games/shared/`), ONE component mounted once per game
  via a new `#toolbar` slot inside `.board-peek-host` — it rides the Teleport fold and the drawer
  glide. Roster (7): Undo · Redo · Hint · Peek(hold-350ms) · Marks(cycle chip) · Check-now(chip,
  `v-if="errorCheckMode === 'on-demand'"`) · Candidates(pin chip, `aria-pressed`).
- **Per-game → the ticket**: `GameControlPanel.vue` recomposed into ONE composed "next board"
  object (eyebrow → inline-labelled horizontal section rows → Deal dominant) + the live verbs row
  (Clear·Fill·Solve·Share) below the BoilDivider. Fill stays here — doctrine: the toolbar is the
  player's pencil; the card is the dealer's/solver's hand (resolves open question 1).
- **Per-preference → the card's foot**: the check MODE (Off/Ask/Live) alone, demoted to a caption-
  register footnote row inside the card. No flip-side, no margin note, no settings surface.

## Contradiction resolutions (each is a decision, not a restatement)

1. **Check splits.** The mode row (Off/Ask/Live) is the preference and retreats to the card foot;
   the *act* becomes the toolbar's Check chip, which emits `update:errorCheckMode` with
   `'on-demand'` — literally the load-bearing same-value re-emit, now wearing per-move clothes.
   Zero changes to `useAssists` semantics; the manual prop+emit seam survives verbatim. The chip
   renders only in on-demand mode (off = opted out of the verb; live = continuous, verb meaningless).
2. **Candidates does NOT retreat** (HIG: show/hide-interface options stay in context). It moves
   *toward the board*: a pin toggle on the toolbar, beside Peek — pinned candidates ARE the held
   peek made persistent. `AssistSettings.vue` loses the row.
3. **Mobile's scroll is a PAGE scroll; the fix is a fixed tray, not a card cap.** `<lg` the toolbar
   is `position: fixed`, bottom-centered, `bottom: calc(var(--keyboard-inset, 0px) +
   env(safe-area-inset-bottom) + 0.5rem)` — above the OS keypad by construction (the one placement
   the dossier's occlusion analysis leaves standing that stays reachable mid-entry). `z-index: 55`
   (under `.corner-right` 60, over `.board-margin` 50). The `.controls-card` desktop cap is then
   deleted once the card measurably stops overflowing (see success test).
4. **"Rides the glide for free" is paid for explicitly**: the toolbar is a `position: absolute`
   child of the host (≥lg pose: `right: calc(100% + 0.75rem); top: 50%;
   transform: translateY(-50%)` — the DrawerTab's mirror on the left edge, z 30, HandDrawnOutline
   `:stroke-width="2.5"` paper strip), plus a fifth counter-scale `FlipMover` cloned from the tab's
   (`useControlsDrawer.ts:228-236` pattern, ~7 lines), plus the one kill rule
   `.board-peek-host.in-live-face :deep(.game-toolbar) { display: none; }`. It never touches the
   `translate:` channel (the F1-phantom guard holds).
5. **The desktop overflow root cause is the vertical OptionSelector.** The non-mobile
   `flex flex-col` branch (`OptionSelector.vue:28`) is deleted; `options-row` (horizontal) becomes
   the only form at every width; the `mobile` prop dies. This alone removes ~12 stacked option rows
   (~370px) from the desktop card.
6. **The 122-line branch unification is a requirement, not a bonus.** `GameControlPanel.vue`
   collapses to ONE template (tab-toggle machinery, `showTabs`, `expandedPanel`, `valueLabel`,
   `heading-value`/`mobile-heading-*` CSS, and the dead n=1 branch all deleted — horizontal rows
   make both sections fit without tabs). The DOUBLE MOUNT stays (GameScene's two cards unchanged)
   so all 35 `.controls-card`-scoped e2e locators keep their disambiguation premise.

## Change inventory (file → change, est. Δ)

| File | Change | Δ |
|---|---|---|
| `src/games/shared/GameToolbar.vue` | NEW: 7-item toolbar; icons (Undo/Redo/Hint) + hand-font typographic chips (Peek/Marks/Check/Candidates, `var(--font-hand)`, `var(--type-caption)`, scribble underline on active via existing `scribbleUnderline()`); `.icon-btn`/`.icon-sublabel` classes reused (frozen `#grain-static` filter — no new filter surface); `role="toolbar"` aria-label "Play tools", `aria-keyshortcuts` mirroring the legend; peek gesture (350ms pointerdown/up, moved verbatim from the panel); two poses (fixed tray `<lg` / left strip ≥lg), 44px floors both | +130 |
| `src/games/shared/GameScene.vue` | `<slot name="toolbar" />` inside `.board-peek-host`; `toolbarEl` ref piped into `registerDrawerScene`; the `.in-live-face` kill rule | +8 |
| `src/games/shared/useControlsDrawer.ts` | scene shape gains `toolbar`; fifth counter-scale mover cloned from the tab's | +8 |
| `src/games/shared/GameControlPanel.vue` | ONE template: ticket (inline caption labels replace `section-heading` stanzas; Deal dominant — `DiceIcon :size="34"` + written verb at `--type-subheading`; dirty-gated coarse two-tap, `role="group"`+`useId`, arm-not-live, `triggerBoil` all kept) → BoilDivider (plain, gesture removed) → action row (order FROZEN: Deal in ticket; Clear·Fill·Solve·Share so `share-truth.spec.ts:57` `nth(4)` stays Share) → check footnote (`AssistSettings`) → `KeyboardLegend` (fine only). Deleted: mobile/desktop branches, tabs, play-controls row+CSS, peek surface, PencilModeToggle+AssistSettings mid-panel mounts, `headingClass` crayon-heading plumbing | ~−520 |
| `src/games/shared/AssistSettings.vue` | Candidates row deleted; check row demoted to inline caption register; manual prop+emit untouched | −46 |
| `src/games/shared/PencilModeToggle.vue` | DELETED — the toolbar's Marks chip cycles `off→corner→center` inline (3 lines, the `P`-key grammar) | −47 |
| `src/games/shared/useAssists.ts` | dead `ERROR_CHECK_CYCLE`/`cycleErrorCheckMode`/`toggleCandidates` deleted | −13 |
| `src/pencil/chrome/OptionSelector/OptionSelector.vue` | non-mobile vertical branch + `mobile` prop deleted; one size class set (`text-[1rem] md:text-[1.25rem]`) | −10 |
| `src/games/shared/scene.css` | `.controls-card` max-height block deleted; `.game-toolbar` added to the three fade selector lists (controls-fade-in / scene-leaving / gallery-leaving) | −14 |
| 5 × `src/games/*/{*Game.vue,ControlPanel/*}` | `#toolbar` mount + wiring (undo/redo/hint/peek/pencilMode/candidatesPinned/errorCheckMode move from the panel slot to the toolbar slot) | +25 |
| e2e | play-tool + peek + candidates locators re-scope from `.controls-card` to `.game-toolbar`; 3 panel goldens re-baselined ONCE at tranche end from the runner artifact | ~±0 |

**Net-LOC sign: NEGATIVE, est. −200 to −280** (panel system 1583 → ~1100 incl. the new toolbar).

## Motion + soul

No new curves, no new movers beyond the cloned counter-scale (same glass curve, same clock, same
520ms). Tray/strip fade rides the existing 250ms `var(--ease-drawOn)` chrome fade + both leaving
fades; PRM gates inherited wholesale. No transition on the tray's `bottom` (the keypad's own
animation carries it). Soul: HandDrawnOutline paper strip (the tab's sibling tongue), hand-font
chips, scribble underlines — the estate's vocabulary only; controls stay typographic/segmented.

## Success test (the family's own)

1. Desktop card: `scrollHeight === clientHeight` at 1024×768 AND 1440×900 (today: +300–360px).
2. Mobile 390×664: every per-move act tappable with the OS keypad RAISED (tray bottom ≥ keypad
   top, real Safari on the `perf-rig-iphone16` sim); page ≤ 1.15 viewports (today 1.6).
3. Check act ≤ 1 tap from the board in default mode, without scrolling (today: scroll + re-tap Ask).
4. Glide: strip width visually constant across the 520ms (host × toolbar ≈ 1); zero writes to the
   `translate:` channel; toolbar absent from the gallery card face.
5. `share-truth.spec.ts` nth(4) green WITHOUT edit; all remaining `.controls-card` locators green;
   net LOC ≤ −150.

## Prototype slice (ordered — the smallest artifact that can FALSIFY the center)

1. `GameToolbar.vue` minimal: Undo/Redo/Hint icons + Check chip only; `#toolbar` slot; sudoku wired
   alone; both poses.
2. The fifth mover + scene registration + `.in-live-face` kill rule.
3. In the untouched panel, temporary `v-if="false"` on PencilModeToggle/AssistSettings/play-controls
   (measurement scaffolding, not the rewrite).
4. Falsify: (a) iPhone 16 sim, keypad raised mid-entry → tap Undo/Check on the tray — if
   `--keyboard-inset` fails the tray in real Safari, the mobile claim DIES (fallback to test: board
   top-edge row; if that's also occluded, the family folds); (b) card scroll gone at 1024×768 with
   the three rows off — if it persists, the real-estate claim dies; (c) drawer open/close ×2 at
   1024 + 1440 — strip distortion or tongue pop kills the "rides the glide" premise; (d) gallery
   fold — toolbar must vanish on the card face.

## Banked (out of F1 scope)

Thermo/killer's cross-game constants import (dossier §8) — the ticket consumes `ControlSection[]`
generically, unaffected; a `C` key for Check-now (KeyboardLegend row) — follow-up, not this family;
handedness setting for the ≥lg left strip — revisit only if critique surfaces reach data.
