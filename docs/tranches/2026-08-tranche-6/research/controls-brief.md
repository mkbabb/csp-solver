# Controls brief — marks 3 · 4 · 5 · 8 · 12

Adjudicated 2026-08-02. Winner: **Design 2 (minimal-delta)**, with three grafts from Design 1.
Every load-bearing claim was verified against the tree and the live dist before ruling.

## Decision

Design 2 wins on measurement and on gate-literacy. Its head-state numbers reproduce exactly on
the built dist at 1440×900 (`.controls-card` scrollHeight 1039 / clientHeight 640 / width 330,
`boardLeft` 191 — re-measured during adjudication), and its mechanism survives every e2e gate it
names. Design 1 loses on three confirmed defects, each checked against the actual specs:

1. **Its info button reds a11y 3.4.** `e2e/a11y.spec.ts:397` requires
   `getByLabel(/keyboard shortcuts/i)` to resolve to exactly ONE node (the `<dl>`); Design 1
   labels its toggle `aria-label="Keyboard shortcuts"` → count 2.
2. **Its closed-by-default `v-show` legend reds a11y 3.4 twice more.** The same test asserts, at
   rest, that `.keyboard-legend` is not stripped from the AX tree (`a11y.spec.ts:402`) and that
   `help.innerText()` names k/g/h/p/d (`:409`). `v-show` is `display:none`: innerText returns
   empty, axStrip reds.
3. **It walks the board.** The crib's 2-column `<dl>` sets the rail's shrink-to-fit max-content
   width; `display:none`-ing it narrows the card 330→~282 at 1440 and moves the centered board
   ~24px — the exact sub-pixel class that redded the `cell-light` golden in T4-P1 pass 4. Design
   2's `grid-template-rows: 0fr` collapse keeps the crib in flow (width contribution intact,
   AX-visible, innerText intact) and was verified byte-identical on card width and boardLeft.

Design 2's other claims also check out verbatim: the four `Patrick Hand|Deal/Fill/Undo/Hint`
LEDGER rows exist at `font-census.spec.ts:58–61` with a backward staleness gate at `:291`;
`zone-grammar.spec.ts:17`'s NAME_SELECTOR (`.section-heading, .washi-tag, .zone-row-label`)
cannot see a default-anchor hint tape; `share-truth.spec.ts:67/88` pins the share washi's
stateful strings; a stock `BoilDivider` mounts 4 `url(#grain-static)` poses and would red the
exact-match `filter-census` (budget 9); `scene.css:60/191/230` confirms the two scrollport
regimes and the landscape in-flow card the sticky gate must exclude.

## Grafts from Design 1 (the loser's genuinely better ideas)

- **G1 — fine-pointer gate on the `i` button.** Design 2 gated it `v-if="!mobile"` only; an
  iPad rail (≥1024, coarse) would render a toggle for a legend whose own CSS keeps it
  `display:none`. Wrap `.info-btn { display:none }` +
  `@media (hover:hover) and (pointer:fine) { .info-btn { display:inline-flex } }` — the
  legend's own gate, restated (`KeyboardLegend.vue:58`).
- **G2 — Deal die at 36, strip verbs at 30.** The mark says "a bit bigger", not "primary-loud";
  36 is Design 1's number and Design 2's own offered dial-back. Design 2's two-row receipt cure
  stays regardless (it retires the clearance-arithmetic hazard class, not just the collision).
- **G3 — keyboard reveal for the well hints.** One selector:
  `.tray-well:focus-within > .zone-hint { opacity: 1 }` — tabbing into a compartment reveals its
  tag's hint (direct-child scoped so the pencils well doesn't bloom all three tapes at once).

## Killed as ornament or as gate-illiterate

- `InfoIcon.vue` (new component) — a CSS circle + hand-face "i" glyph does it with zero files.
- `BoilDivider static` prop — a second divider grammar inside the well could read as a second
  hold-to-peek surface, and one CSS declaration does the job.
- `SheetWashiLabel` hint/hintId props — sibling default-anchor tapes use the component unchanged
  (a child's root span inherits the parent's `data-v` scope, so no `:deep` either).
- `aria-describedby` wiring on the wells — reds `zone-grammar.spec.ts:199`'s transient-tape
  `aria-hidden` clause as written; held back as an owner question, per the estate's standing
  ruling that a second recitation buys the reader nothing.

## Mechanism (build-ready)

All in the existing estate; **zero new components, zero new dependencies, one new `ref`**.

### MARK 5 — sticky action bar; crib folds behind `i`

In `GameControlPanel.vue`: the action row (`:680`, `class="flex items-center justify-evenly"`)
becomes `.action-bar` (grid: `1fr auto`) holding `.action-verbs` (the four buttons, markup
unchanged) plus the `i` toggle. Above it, `.legend-fold` (id `keys-fold`) wraps
`<KeyboardLegend />`; the standalone mount at `:812` is deleted.

```html
<div id="keys-fold" class="legend-fold" :class="{ 'is-open': keysOpen }" v-if="!mobile">
  <div><KeyboardLegend /></div>
</div>
<div class="action-bar">
  <div class="action-verbs"> …Clear / Fill / Solve / Share… </div>
  <button v-if="!mobile" type="button" class="info-btn" aria-label="what the keys do"
          :aria-expanded="keysOpen" aria-controls="keys-fold" @click="keysOpen = !keysOpen">
    <span class="info-glyph" aria-hidden="true">i</span>
  </button>
</div>
```

`const keysOpen = ref(false)` is the entire state (session-transient). CSS:

```css
.action-bar { position: relative; display: grid; grid-template-columns: 1fr auto;
  align-items: center; background: var(--color-card); padding-block: .4rem .15rem; }
.action-bar::before { content:""; position:absolute; inset:auto 0 100% 0; height:.9rem;
  background: linear-gradient(to top, var(--color-card), transparent); pointer-events:none; }
.action-verbs { display:flex; justify-content:space-evenly; align-items:flex-start; flex:1; }
/* Sticky ONLY where scene.css makes the card a scrollport (scene.css:60 rail, :230 portrait
   sheet). The <1024 LANDSCAPE card is in-flow (scene.css:191 regime key) — bottom:0 there
   would pin the bar to the viewport and move a ratified rung. Cite scene.css in the comment. */
@media (min-width:1024px), (max-width:1023.98px) and (orientation:portrait) {
  .action-bar { position: sticky; bottom: 0; z-index: 3; }
}
.legend-fold { display:grid; grid-template-rows:0fr; overflow:hidden;
  transition: grid-template-rows 200ms var(--ease-drawOn); }
.legend-fold.is-open { grid-template-rows:1fr; }
.legend-fold > div { min-height:0; }
@media (prefers-reduced-motion: reduce) { .legend-fold { transition:none; } }
.info-btn { display:none; }
@media (hover:hover) and (pointer:fine) { .info-btn { display:inline-flex;
  align-items:center; justify-content:center; width:2rem; height:2rem;
  padding:0; border:none; background:none; cursor:pointer; } }   /* G1 */
.info-glyph { display:inline-flex; align-items:center; justify-content:center;
  width:1.75rem; height:1.75rem; border:1.5px solid var(--ink-press-rule); border-radius:50%;
  font-family:var(--font-hand); font-size:var(--type-small); line-height:1;
  color:var(--ink-press-quiet); }
.info-btn[aria-expanded="true"] .info-glyph { color:var(--color-foreground);
  border-color:currentColor; }
```

**The 0fr collapse is load-bearing — comment it in the source.** It keeps the crib's
max-content width in the rail's shrink-to-fit computation (card 330 / boardLeft 191 must hold
byte-identical), keeps the crib in the AX tree, and keeps `innerText` non-empty for a11y 3.4.
The `i` button's label is `what the keys do` — NEVER "keyboard shortcuts" (count-1 gate).
`KeyboardLegend.vue` gets one edit: `margin: 0.75rem 0 0` → `margin: 0 0 .5rem` (it now sits
above the bar, not at the card's tail).

### MARK 12 — sublabels always on, lowercase; washi become explications

- Delete `display:none` from `.icon-sublabel` (`:1111`); delete the coarse re-enable
  (`:1157–1159`); hoist the coarse `.icon-btn` column geometry (`:1139–1147`) onto the base
  `.icon-btn` verbatim, leaving the coarse block holding only `.peek-hold-surface` padding and
  the `.icon-btn.deal-btn` restatement. Net deletion of one duplicated block.
- Add `text-transform: lowercase` to `.icon-sublabel` — the chimera cure (Patrick Hand's only
  capitals are {C,R,S}; `Deal/Fill/Undo/Hint` have always painted their initial in the system
  face). **Same commit: delete the four stale LEDGER rows** at `font-census.spec.ts:58–61`
  (`Patrick Hand|Deal`, `|Fill`, `|Undo`, `|Hint`) — the backward staleness check at `:291`
  reds if they stay. (The `"Deal"` literal at `:310` is a regex negative control — leave it.)
- Retext the five default-anchor washi from names to explications (all lowercase; no `+ · ;` —
  outside the hand cut): Deal → `deal a new board with the settings above`; Clear → `wipe every
  digit you've written`; Fill → `ink the cells that have only one digit left`; Solve → `let the
  solver finish the board`; Share idle → `copy a link to this exact board`. Share's stateful
  `copied!` / `couldn't copy — link is in the address bar` strings are UNTOUCHED
  (`share-truth.spec.ts:67/88` pins them). Add `wide` where a tape now wraps.

### MARK 4 — hover hints on the sub-tags, component unchanged

After each `anchor="tag"` tape (new game `:464`, pencils `:621`, teacher's `:663`) and after
each `.zone-row-label` (marks `:628`, candidates `:643`), drop a sibling
`<SheetWashiLabel class="zone-hint" :text="…" :seed="…" wide />` (default anchor →
auto `aria-hidden="true"`, invisible to zone-grammar's NAME_SELECTOR and permanent-tape
censuses). Scoped CSS (child root inherits the parent's `data-v` hash — no `:deep`):

```css
.tray-well .washi-tag, .zone-row-label { pointer-events: auto; cursor: help; }
.washi-tag:hover + .zone-hint, .zone-row-label:hover + .zone-hint,
.tray-well:focus-within > .zone-hint { opacity: 1; }   /* G3 */
.zone-row { position: relative; }
/* Hang UNDER the tape: the card is a scrollport and the default bottom:100% clips the first
   well's note against the card's top edge. */
.zone-hint { top: 1.1rem; left: .85rem; bottom: auto; margin-bottom: 0;
  transform: rotate(var(--washi-tilt)); transform-origin: left top; }
```

Texts (lowercase, em-dash): new game → `settings for your next board — nothing changes until
you deal`; pencils → `how your marks are written, and whether the solver shows its candidates`;
teacher's → `when your mistakes get marked`; marks → `normal writes a digit — corner and center
write small pencil marks`; candidates → `show every digit still legal in a cell`.

### MARK 3 — the rule between size and difficulty

Replace `.staged-section + .staged-section { margin-top: 0.6rem }` (`:876`) with:

```css
.staged-section + .staged-section { margin-top:.85rem; padding-top:.85rem;
  border-top: 1.5px solid var(--ink-press-rule); }
```

`--ink-press-rule` already draws the crib's keycap borders in this same card (precedent). Rail
only by construction (the phone shows one section behind tabs). A BoilDivider here is refused:
4 live `grain-static` poses → filter census 9→13, red in both regimes.

### MARK 8 — Deal and its receipt

- `DiceIcon :size="28"` → `36` (G2); `.icon-btn.deal-btn { padding: .5rem 1.1rem; gap: .3rem }`;
  `.deal-btn .icon-sublabel { font-size: var(--type-small) }` (strip stays `--type-caption` —
  that IS the hierarchy).
- `.action-verbs .icon-btn svg { width:30px; height:30px }` — scoped to the bar so the fold's
  undo/redo/hint/peek keep their shipped 26px on the dock.
- `DifficultyTally.vue`: `.dt-marks` height `1.5em` → `1.9em`; `.dt-label` font-size caption →
  small. Edited in the component, not via `:deep` — `.deal-row` is its only mount and a rule
  scoped there is estate-wide while pretending not to be (the pass-4 lesson).
- **The receipt leaves Deal's cell**: `.deal-row > .difficulty-tally { grid-area: 2/1;
  justify-self: center; margin-top: .15rem }` — die + `deal` on row 1, `dealt |卅` centered
  beneath. Row max-content ≈ 92px < the old shared-cell 274, so the rail cannot widen; retires
  the documented clearance hazard (`GameControlPanel.vue:924–939` comment) outright.

## Files

| File | Change |
|---|---|
| `web/frontend/src/games/shared/GameControlPanel.vue` | The whole delta: `keysOpen` ref; action row → `.action-bar` + `.action-verbs` + `i` button; `.legend-fold` above the bar; standalone `KeyboardLegend` mount (`:812`) deleted; five `.zone-hint` sibling tapes + hover/focus-within CSS; five washi retexts; `.icon-sublabel` always-on + lowercase; coarse geometry hoisted to base; staged-section rule; Deal 36 + receipt to row 2; strip svg 30px |
| `web/frontend/src/games/shared/DifficultyTally.vue` | Two values: `.dt-marks` 1.5em→1.9em, `.dt-label` caption→small |
| `web/frontend/src/pencil/chrome/KeyboardLegend.vue` | One declaration: margin `0.75rem 0 0` → `0 0 .5rem` |
| `web/frontend/e2e/font-census.spec.ts` | Delete stale LEDGER rows `:58–61` (Deal/Fill/Undo/Hint) |
| `web/frontend/e2e/zone-grammar.spec.ts` | ONE new row: scroll `.controls-card` to end; `.action-bar` bottom within 1px of the card's bottom while `.tray-well:first-child` is out of view; injected `position:static` negative control |
| `web/frontend/src/games/shared/GameControlPanel.test.ts` | Unit rows: `keysOpen` toggle flips `aria-expanded` + `.is-open`; info button absent when `mobile`; hint tapes render `aria-hidden` |

**Price: net ≈ +95 LOC** (+140/−45; the deleted half is the coarse sublabel/geometry
duplication, the four ledger rows, and the name-echo washi). Zero new dependencies, zero new
components, zero new filters (census stays 9), one new `ref`.

## Libraries

Vue 3 (one `ref`), `SheetWashiLabel` unchanged, `KeyboardLegend` + `SINGLE_KEY_SHORTCUTS`
(`src/composables/useShortcutPolicy.ts:42`) reparented not rewritten, `DifficultyTally` +
existing icons via props, platform CSS (`position:sticky`, `grid-template-rows: 0fr→1fr`),
existing tokens only.

## Visual verification (the standard of proof)

Surface: **http://localhost:4248** (built dist), screenshots to
`/private/tmp/claude-504/…/scratchpad/t6-research/`. Run `e2e/a11y.spec.ts` 3.4 and
`font-census.spec.ts` FIRST — they are the tightest gates.

1. **Rail 1440×900 dark + 1024×820 light**: scroll `.controls-card` to bottom — four-verb bar
   flush at the card's edge, lowercase names under every icon, `i` at right, fade seam clean.
2. **Scrolled to top**: bar overlays the pencils well; size/difficulty rule visible in new game.
3. **Click `i`**: crib unfolds ABOVE the bar (bar does not move), glyph inks; click closes.
4. **Hover each of 3 tags + 2 captions**: one torn tape under the hovered tape, wrapped, never
   clipped at the scrollport top. Tab into each well: hint reveals on focus-within (G3).
5. **Hover each verb**: washi reads the explication; sublabel still reads the name.
6. **New-game well**: 36px die over `deal`, `dealt |卅` centered beneath, no overlap at 1024.
7. **Portrait dock 390×844 dark + short cell 390×664**: bar sticks at the sheet's bottom on the
   short cell; NO `i`, NO legend on coarse; `#fold-tools` verbs still 26px; page doesn't scroll;
   coarse two-tap `sure?` screenshot (armed sublabel must not reflow the well).
8. **Landscape 844×390**: bar NOT viewport-pinned — the ratified rung unmoved.
9. **NUMBERS, both engines, before/after, required byte-identical**: `.controls-card` width
   292.34@1024 / 330@1440; `.board-peek-host` left 1.83@1024 / 191@1440 (adjudication
   re-measured 330/191 at head).

## Risks

- **The fold must stay in flow.** Any future absolute popover / `<details>` drops the crib's
  max-content width → rail 330→~282 → board walks ~24px (the `cell-light` class). Comment it.
- **a11y 3.4 is the tightest gate**: `i` never labelled "keyboard shortcuts"; fold never
  `aria-hidden` / `visibility:hidden` / `display:none`. Re-run the spec first.
- **font-census is exact-match both directions**: lowercase without the four row deletions reds
  stale; every new hint/washi string must stay lowercase and clear of `+ · ;`.
- **The sticky media condition duplicates scene.css's regime key** (`:60` / `:191`) in a second
  file — cite it; a future regime re-cut silently viewport-pins the landscape bar otherwise.
- **The straight border-top is the card's one un-pencilled stroke** (precedent: crib keycaps).
  If the owner objects at the glass, the upgrade is a baked `generateLineBoilFrames(...)[0]`
  static path — filterless, census-safe, ~15 LOC.
- **Icon geometry changes for every fine-pointer `.icon-btn`** (44px square → ~44×57 column);
  `visual-regression.spec.ts` test 8 derives soft bounds from computed padding/gap and should
  hold, but any golden framing the card's lower third needs a look; landscape-rung and pass-5
  pageVh identity numbers must be re-derived, not assumed.

## MVP cut (if phased)

- **Phase 1 (marks 5 + 12 + 8, one file + tally + ledger)**: sticky `.action-bar` + `i` fold,
  always-on lowercase sublabels + coarse-block hoist + the 4 ledger deletions, washi
  explication retexts, Deal 36 + receipt row 2, tally sizes. This is the visible spine.
- **Phase 2 (marks 3 + 4, CSS + template only)**: the staged-section rule, the five hint tapes
  + hover/focus CSS.
- Owner dials at the glass: die 36 vs 40; hint texts; whether `keysOpen` persists (one
  localStorage line if wanted).

---

## AUDIT RIDER (2026-08-02 — overrides the body where they conflict)

1. **`visual-regression.spec.ts` joins the files table** — the MARK 8 receipt move
   reds `:565` ("receipt keeps off the commit verb": horizontal clearance) and
   inverts its `:618` negative control. Same-commit re-aim: the row asserts
   vertical clearance (receipt.top ≥ deal.bottom, centres aligned within 1px); the
   negative control (`grid-area: auto` injection) collapses that clearance and reds.
2. **The sticky-bar zone-grammar row re-aims** — the scroll-end read cannot red (a
   static last child also sits at the card's bottom). The discriminating read is at
   `scrollTop 0` with the card scrollable: assert the bar visible inside the
   scrollport (bar.bottom ≤ card's visible bottom + 1); the `position:static`
   negative control puts the bar out of frame and reds.
3. **Register ownership (README ruling 6)**: the ten new strings are written to
   voice's rules; the teacher's hint says "when your mistakes get **checked**", not
   "marked". You own the Fill washi's final text — voice's edit is withdrawn.
4. **Priced watch**: the action bar's own max-content contribution to
   `.controls-card` width (the `cell-light` board-walk class) — verify boardLeft
   unmoved at 1440 in the crops, alongside the crib-collapse row already priced.
5. **Band-vs-drawer icon scale after MARK 8** is the chair's call at merge, on
   crops (parity is hierarchy/icons/colors, not absolute size); if the band reads
   as a different family, its die goes to 24.
