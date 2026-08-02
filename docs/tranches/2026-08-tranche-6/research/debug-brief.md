# Mark 16 — the hidden DEBUG toggle · adjudicated brief

**Decision: Design 2 (minimal-delta) wins.** One 3-line global ref in the estate's own
`createGlobalState` idiom, one button inside the already-hidden @mbabb hover card, one gated
computed, two gated console lines. Grafts from Design 1: the born-RED negative assertion
(tally absent with debug off) and per-test e2e seeding (not helper-wide). Killed from Design 1:
the `?debug` URL param — `persistence.ts` `syncToUrl` rebuilds from `new URL(window.location.href)`
(persistence.ts:298–302), so the param would persist in the address bar and ride every copied
link; a second entry point AND a leak. Also killed: the hand-rolled `ref`+`watch`+`localStorage`
module (a second global-state idiom beside `useTheme.ts`) and the unnamespaced `"debug"` storage
key (estate law is namespaced — `sudoku-color-scheme` precedent, useTheme.ts:9).

Every file:line below was verified against the tree 2026-08-02. Neither design cited a phantom
path.

## Mechanism — one ref, one gate, one button

### 1. The ref — NEW `src/composables/useDebug.ts` (~4 lines)

```ts
import { createGlobalState, useStorage } from "@vueuse/core";
/** The hidden DEBUG flag — one ref, persisted, read by every telemetry surface. */
export const useDebug = createGlobalState(() => useStorage("sudoku-debug", false));
```

Twin of `useTheme.ts` (same dir, same `@vueuse/core` import, already at ^14.3.0 — package.json:56).
`createGlobalState` memoizes: both AttributionCard mounts, GameBoard, and transport.ts read the
SAME ref; works outside component setup (effectScope), so transport.ts can call it. `useStorage`
persists across reload/deal and syncs cross-tab. No new dependency. ESLint boundaries permit
`@/composables/*` from both layers (pencil already imports `@/composables/useShortcutPolicy` at
KeyboardLegend.vue:26; only pencil→games, cross-game, and pencil-depth are restricted).

### 2. The button — `src/pencil/chrome/AttributionCard/AttributionCard.vue`

After the GitHub link (line 72–78), inside the existing `<hr>`-divided card body:

```vue
<button
  type="button"
  class="text-muted-foreground hover:text-foreground mt-1 block font-mono text-xs"
  :aria-pressed="debug"
  @click.stop="debug = !debug"
>debug · {{ debug ? "on" : "off" }}</button>
```

Plus `import { useDebug } from "@/composables/useDebug"; const debug = useDebug();` in script.
The hover card is already the hidden disclosure the mark asks for (`useHoverCard`, opens on
hover/click/focus-within; `visibility:hidden` closed — AttributionCard.vue:143). Both mounts
(desktop `.corner-left` App.vue:498, mobile App.vue:512) get the row from the one template.
`@click.stop` matches the trigger's stance (line 31) — the card stays open across the toggle.
Zero new CSS; the card's utility register already styles this rank. Keyboard: the card's
focus-within disclosure (lines 23–24) puts the button on the Tab walk after the GitHub link.

### 3. The gate — `src/games/shared/GameBoard.vue:663`

```ts
const debug = useDebug();
const tally = computed(() => (debug.value ? formatSolveTally(props.solveStats) : ""));
```

The single point ALL tally ink flows through. Both mounts — CompletionVignette `:meta`
(GameBoard.vue:809) and MarginNote `:meta` (GameBoard.vue:838, the `vignetteHasTally` ternary) —
guard with `v-if="meta"` (MarginNote.vue:84, CompletionVignette.vue:60); `""` unmounts both, all
five games, solved AND failed grades. `formatSolveTally` (solveTally.ts:12–22) already returns
`""` for null stats — the empty string is the contract's own idle value. Layout is safe:
`.margin-note`'s `min-height: 1.3em` (MarginNote.vue:106) reserves the voice line regardless.

### 4. The console gate — `src/games/shared/solver/transport.ts:137,142`

The two `console.debug('[<tag>] prewarm: …')` lines ship in the prod bundle (fired on the live
dist at :4248). Same ref: `if (useDebug().value) console.debug(...)` on each (module import at
top). Kept as a ref gate rather than `import.meta.env.DEV`-stripped — the toggle can then reveal
prewarm health IN production, which is the point of a debug mode (Design 1's argument, adopted).

### 5. Tests — same commit as the gate (ruling lands with its enforcing config)

Per-test seeding, before the `loadSudoku` call (addInitScript must precede goto):

```ts
await page.addInitScript(() => localStorage.setItem("sudoku-debug", "true"));
```

- `e2e/affordances.spec.ts:214` (tally test, loads at :217) — +1 line.
- `e2e/board-covisibility.spec.ts:156` ("prints its tally exactly once", loads at :159) — +1 line.
- BORN-RED graft: one new short test in affordances — solve WITHOUT the flag, assert
  `.margin-note-meta` count 0 (~5 lines). Red before the gate lands, green after.
- Literal discipline: the seeded value MUST be the string `"true"` — useStorage's boolean codec
  reads `"1"` as false, silently.

Sweep confirmed: only these two specs reference `.margin-note-meta`/`.vignette-meta`/backtracks;
nothing else in e2e asserts prewarm. `solveTally.test.ts` (pure formatter) untouched.

## Complete telemetry inventory (the deliverable)

**GATED BY THIS CHANGE (production-visible today):**
- `src/games/shared/GameBoard.vue:663` (derivation) → :809 CompletionVignette meta, :838
  MarginNote meta — the "0 backtracks — 8ms" tally. Formatter `src/games/shared/solveTally.ts:12–22`;
  rendered at `src/pencil/chrome/MarginNote.vue:84` and `src/pencil/chrome/CompletionVignette.vue:60`.
- `src/games/shared/solver/transport.ts:137` and `:142` — console.debug prewarm smoke, present in
  the prod bundle.

**ALREADY DEV-ONLY, ABSENT FROM PROD (no change; `import.meta.env.DEV` statically stripped):**
- `src/App.vue:105` + `:495` — FilterTuner (`src/pencil/dev/FilterTuner.vue`), env-gated dynamic
  import; its console.warn (FilterTuner.vue:30) rides with it.
- `src/main.ts:5` → `src/pencil/dev/rafInstrumentation.ts:61,66,72` —
  `window.__rafChainCount` / `__schedulerDebug` / `__rafChainSample`.

**RULED PRODUCT, NOT TELEMETRY (stay visible):**
- `src/games/shared/DifficultyTally.vue` — the deal's difficulty signal (lives in the ticket's
  deal row since T4-P1 mark 6).
- `src/games/shared/CheckStatus.vue` — assist-state sentence.
- MarginNote voice lines (techniqueVoice) — product voice, no machine numbers.
- `SolverErrorNote` — a user-facing fault, not diagnostics.

**CARRIED BUT NEVER RENDERED (no surface to gate; listed for completeness):**
- `SolveStats.nodesExplored`/`.propagations` — types.ts:28–29, useGameState.ts:82–83/516–517,
  solver/client.ts:100–101/216–217; reach the client and stop — formatSolveTally prints
  backtracks+elapsed alone. No second leak path.
- `src/pencil/config/filterBudget.ts` + `e2e/filter-census.spec.ts` — test-time allowlist, no
  runtime readout.

## Price

- **LOC:** ~+27/−3 (useDebug.ts +4; AttributionCard +10; GameBoard +2/−1; transport +3/−2;
  e2e +8). No new deps, no new CSS, no new chrome outside the existing card.
- **Files touched:** 6 (1 new).

## Visual verification (built dist, http://localhost:4248; playwright from web/frontend)

1. **Debug OFF (default):** load `?size=3&difficulty=MEDIUM`, click Solve, wait
   `.board-wrapper.solve-success`. At 1440×900 (vignette mount), 1100×800 (strip mount),
   390×760 (phone): `document.querySelectorAll('.vignette-meta, .margin-note-meta').length === 0`;
   screenshot the vignette — "solved it!" with NO tally beneath. Console at verbose: zero
   `prewarm:` lines.
2. **The toggle:** click `.attribution-trigger`, screenshot the open `.hover-card` at 1440 and
   390 (mobile twin) — "debug · off" sits under the divider without widening the 16rem card or
   colliding with the CrayonHeart; Tab reaches it with the card open. Click → "debug · on",
   `aria-pressed=true`.
3. **Debug ON:** re-Solve — tally renders exactly once per viewport (the covisibility
   invariant): vignette meta at ≥1280 celebrating, margin meta otherwise. Prewarm lines present
   on a fresh reload.
4. **Persistence:** reload — flag holds; toggle off — tally gone, `.board-margin` height back to
   the one reserved line.
5. Repeat step 1's OFF check on one non-sudoku game (kenken) — the gate is in shared GameBoard,
   one spot-check suffices.

## Risks

- The two e2e tally tests go RED without their seeding line — land spec edits in the SAME commit.
- Solved-phone layout: with debug off the meta line no longer appears below 1024 — intended
  (less standing chrome); verify nothing crosses the fold differently at 390×760.
- Any hover on @mbabb reveals a "debug" row to visitors. If the owner wants it invisible, the
  cheapest escalation is a modifier-click on the existing trigger (−8 template lines) — flagged,
  not assumed.
- localStorage persistence: a debug-on session shows telemetry in later screenshots; the golden
  suite never sets the key, so goldens are unaffected.

## MVP cut (if phased)

Phase 1 = items 1–3 + the two e2e seed lines (the mark's literal ask: tally behind the toggle).
Phase 2 = transport.ts console gate + the born-RED negative test. Both fit one commit and should
ship as one; the split exists only if the tranche needs a wave seam.

## Open questions for the owner

- Surface `nodesExplored`/`propagations` in the tally now that a debug channel exists? One line
  in GameBoard's computed if wanted; minimal-delta says no.
- Button copy: "debug · off" (proposed) vs something quieter ("telemetry").
