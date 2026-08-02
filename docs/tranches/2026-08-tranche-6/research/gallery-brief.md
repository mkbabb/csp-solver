# Gallery brief — marks 2 + 7 (drag, header persist/transform, band⇄drawer consistency)

**Adjudicated 2026-08-02. Winner: DESIGN 2 (minimal-delta), with three grafts from Design 1 and two cuts.**
Both designs cite only real paths — every file claim below was verified against the tree. Zero new dependencies.

## Decision

Design 2 wins on verified estate knowledge and on correctness:

- It caught a **real latent bug** Design 1's drag would also hit: `useCarouselGlide.glideTo`'s
  "already centered" early return (line 211) precedes `suspendSnap()` today, so it's harmless for
  every current caller — but a drag release arrives with snap ALREADY suspended and `gen` bumped,
  so that return strands `scroll-snap-type: none` forever. The `rearmSnap(myGen)` amendment is
  load-bearing, not optional.
- Its drag release is simpler (direction flick, one threshold) than Design 1's momentum
  projection (velocity ring + 160ms extrapolation + ±1.25-slot clamp) and lands the same carousel
  physics — a flick moves one card. Parsimony law rules for the flick.
- Its header actually TRANSFORMS — the masthead rides the existing `foldCtl.run(movers[])` as a
  second array element, both ways. `useFlipGlide.run()` takes `FlipMover[]` today (verified,
  `useFlipGlide.ts:102`); App has always passed one element. Design 1's header pops between poses
  at the view flip (drawer-closed `--logo-scale: 1.05` centered vs the gallery pose) — "holds
  still" was the claim, a same-frame jump is the fact.
- Its inert-header ruling is correct: the deck is the ONE game-select surface (the ruling that
  retired the dropdown, App.vue:513–517), and a wordmark that names the SNAPPED card but acts as
  cancel-to-the-ENTERED game is a mislabeled control. Design 1's toggle-wordmark is cut.

**Grafts from Design 1** (each cheaper than Design 2's counterpart, same mark satisfied):

1. **The exit fade replaces the exit gather.** `<Transition name="gallery-fade">` — a leave-only
   ~200ms opacity fade on the whole deck (the `chromeLeaveMs` twin) — instead of Design 2's
   `runFlanks(-1)` mirror (`leaving` ref + `playExit` + `defineExpose` + async `unfoldToBoard` +
   busy-gating, ≤290ms added exit latency). The fold already animates the exit's protagonist; the
   deck dissolving under it closes the "hard cut" hole for ~8 lines and zero latency. Safe because
   `unfoldToBoard` parks the live board home BEFORE the view flips — the fading deck never
   contains the board. The gather is banked as an owner election (below), not built.
2. **Crayon utilities land in `assets/index.css`**, unlayered, beside the ink-tier tokens and
   their AA ledger (index.css:164–181) — not in `typography.css @layer components`. Layered rules
   lose to every unlayered author rule; the ledger comment and the classes reading it belong on
   the same page.
3. **The `.icon-btn` family hoist is cut** (see cuts).

**Cuts** (ornament under the parsimony law):

- Design 2's band-verb re-grammar onto `.icon-btn`/`.deal-btn` + the hoist of that family into
  `@layer components`. The band's verb grammar is the guard ribbon's ON PURPOSE (StagingBand's own
  header documents it); the die is already the SAME `DiceIcon`; the destructive-verb ink is
  already the drawer's distinction. The color gap the mark names is closed by two small moves
  instead: the accent hover (below) and the crayon tint. The full transplant costs a cascade risk
  (its own design flags it), a `--staging-reserve` re-derivation, and two geometry gates — for a
  shape change the mark doesn't require. Phase 2 if the owner's eye asks for it.
- Design 1's wordmark-as-toggle (expanded prop, caret flip, click-to-cancel) — wrong control, cut.
- Design 2's exit gather — banked, not built.

## Mechanism

### Mark 2 — pointer drag (all inside `useCarouselGlide.ts`)

Touch already drags (native `scroll-snap-type: x mandatory` + inertia — untouched). The gap is
mouse/pen. One truth stays one truth: drag writes `vp.scrollLeft`, release settles through the
existing `glideTo` → the same glass curve, the same `onSnap` seam, a11y byte-identical.

- Constants: `DRAG_SLOP = 5` px, `FLICK_VPX = 0.45` px/ms. State: `drag {x0, sl0, t, v} | null`,
  `dragging`, `suppressClick`.
- `pointerdown` (viewport): bail on `pointerType === "touch"` or `button !== 0`. **Mid-glide
  freeze, order load-bearing**: read `tx = new DOMMatrixReadOnly(getComputedStyle(track).transform).m41`
  BEFORE `clearAnim()`, then `vp.scrollLeft -= tx` — visual x = layout − scrollLeft + tx, so the
  grab lands on the visual pose, no jump. Then `setPointerCapture`, record `x0/sl0/t`.
- `pointermove`: below slop, nothing (a press stays a click). First crossing: `dragging = true`,
  `++gen` (voids any pending re-arm), `suspendSnap()`, add `is-dragging` class. Then
  `vp.scrollLeft = sl0 − (e.clientX − x0)` + a 0.7/0.3 EMA of px/ms into `drag.v`.
- `pointerup`/`pointercancel`: release capture; if never dragged, drop out. Else
  `suppressClick = true`; `from = centeredIndex()` (read the position BACK — the engine clamps
  writes, the WebKit maxScroll discipline already documented in the file);
  `dir = v < −FLICK_VPX ? 1 : v > FLICK_VPX ? −1 : 0`; `target = clamp(from + dir)`; clear
  dragging state; `options.onSnap(target)` then `glideTo(target)`. `onSnap` is the touch path's
  own seam (`syncFromScroll`: activeIndex, aria-activedescendant, announce, guard-dismiss — never
  re-glides).
- **The latent fix**: `glideTo`'s `if (Math.abs(first − last) < 0.5) return;` (line 211) becomes
  a `rearmSnap(myGen)` return — it must re-arm when reached with snap suspended. (Requires the
  `myGen = ++gen` hoisted above the early return, or a rearm using a fresh gen — implementer's
  choice; the invariant is: no path out of a drag leaves snap suspended.)
- `reportSnap` gains `|| dragging` on its `if (anim) return` guard.
- Click suppression: ONE capture-phase `click` listener on the viewport —
  `if (suppressClick) { suppressClick = false; e.stopPropagation(); e.preventDefault(); }` —
  capture on the ancestor means GameCard's bubble `@click` (GameCard.vue:237) never fires off a
  drag release. Plus `dragstart → preventDefault` (kills native text/image drag).
- Teardown: all listeners off in the existing `onBeforeUnmount`.
- CSS (GameGallery.vue, ~8 lines): `cursor: grab` on the viewport and `grabbing` +
  `user-select: none` under `.is-dragging`, fenced `(hover: hover) and (pointer: fine)`.
- PRM: drag is direct manipulation — it stays; the release's `glideTo` already collapses to
  `jumpTo` inside the composable.

### Mark 7a — header persists and travels

- **The v-show moves DOWN one level** (App.vue:510): `.board-group` renders always; the scene
  `<component>` (line 532) and the mobile `AttributionCard` (line 515) take
  `v-show="view === 'playing'"`. The masthead `<h1>` never moves in the DOM — every rule hanging
  off `.board-group` parentage (the landscape dock, the drawer-closed centering) is untouched.
  The teleported `.board-peek-host` keeps painting: Teleport has relocated that node out of the
  scene root before the face is live — same one-frame characteristics as today's `v-show`.
  **LOOK FIRST**: open the gallery on :3001 and confirm the board renders in the card face before
  building anything on this line. Also confirm the portrait drawer-tab (teleports to
  `#drawer-handle` inside the scene) leaves no stranded hit target.
- `.board-group` gains `:class="{ 'is-gallery': view === 'gallery' }"` + two scoped rules at
  (0,3,0) — they must beat `html.drawer-closed .masthead` (0,2,1) and the landscape dock's
  `.masthead` (0,1,0):
  ```css
  .board-group.is-gallery { align-items: center; }
  .board-group.is-gallery .masthead {
    position: static; align-items: center; margin: 0 0 .25rem;
    translate: none; --logo-scale: .72;
  }
  ```
  (`translate: none` neutralizes the landscape dock's `translate: 0 -50%`; verify at 844×390.)
- **Changes with the selected game**: `headerName = computed(() => view === 'gallery'
  ? (GAMES[snappedIndex]?.name ?? game) : game)`, bound as `:game` on HandwrittenLogo. The
  wordmark already re-measures + re-bakes on a label change and already declines to re-reveal
  (its I2 ruling, HandwrittenLogo.vue:127–131) — a snap redraws it for free.
- **Transforms**: the masthead is the SECOND mover in the existing fold, both ways.
  - Enter: `enterGallery` reads `pendingHeadFrom = mastheadEl.value?.getBoundingClientRect()`
    beside `pendingFoldFrom`; `onLiveFace`'s fold pushes
    `{ el: mastheadEl.value, from: flipTransform(pendingHeadFrom, head.getBoundingClientRect()), to: "translate(0px, 0px) scale(1)", transformOrigin: "50% 50%" }`
    into the same `foldCtl.run([...])`.
  - Exit: `runFold(first, getMover)` generalizes to
    `runFold(pairs: { first: DOMRect | null; el: () => HTMLElement | null }[])` — same body, a
    loop; `unfoldToBoard` reads BOTH firsts before `applyState()`.
  - `--logo-scale` is a layout size landing at onset (classic FLIP); the transform covers the
    move on the baked poses — compositor-only, one re-bake at settle. The drawer's own masthead
    precedent, reused verbatim.
- **Exit fade (D1 graft)**: wrap `<GameGallery v-if>` in `<Transition name="gallery-fade">`,
  leave-only, ~200ms opacity on `var(--ease-glassGlide)`; `prefers-reduced-motion: reduce` →
  `transition: none`. Entry needs nothing (BEAT 2 already animates it).
- **Inert heading in gallery**: HandwrittenLogo gains one optional prop `inertHeading?: boolean`
  — `<component :is="inertHeading ? 'span' : 'button'">`, caret `v-if="!inertHeading"`, click
  guarded, `<span class="sr-only">` carrying the label so the h1 keeps an accessible name (the
  svg is aria-hidden). App passes `:inert-heading="view === 'gallery'"`.

### Mark 7b — band ⇄ drawer consistency (reuse + deletion, no new vocabulary)

1. **Zone name**: `<SheetWashiLabel :id="zoneId" text="new game" :seed="13" anchor="tag" />`
   inside the band's `HandDrawnOutline`, `role="group" :aria-labelledby="zoneId"` on the slip —
   the drawer's staged zone's exact component, text, and seed (GameControlPanel.vue:464). Import
   `@pencil/sheet/SheetWashiLabel.vue` — pencil→pencil, boundary intact.
2. **Headings**: `.staging-axis-label` takes `class="section-heading staging-axis-label"`; its
   bespoke hand-font type block dies; the scoped remainder keeps `min-width` (re-pin ≈4.6rem),
   `text-align: left`, `padding-left: 0`, and a font-size pin one rung under the register (the
   drawer's eyebrows in miniature). `.section-heading` already lives in
   `assets/typography.css @layer components` as the shared register — color deliberately not
   baked there.
3. **The axis speaks the drawer's word**: `cards.ts`'s three `label: "level"` → `"difficulty"`
   (lines 89, 118, 178). VERIFIED: `announce()`/`stagedLine` speak OPTION labels, never the axis
   label — the polite live region's strings don't change. What changes: the group accessible
   names, asserted at `e2e/gallery-deal.spec.ts:66,128,175,499,714` and `cards.test.ts:107` —
   expectation updates only.
4. **Colors**: `tiers()` carries `colorClass` through (the stripping map + its 4-line comment at
   cards.ts:36–38,77–78 die; `StagingAxis` options gain `colorClass?`). OptionSelector already
   renders `opt.colorClass` on the selected chip (OptionSelector.vue:58). The difficulty axis
   label tints in the SELECTED tier's crayon — the drawer's `headingClass` rule (tone read from
   the selected option, never a flag), computed locally in StagingBand.
5. **The hoist**: the four `.crayon-*` utilities move from GameControlPanel's scoped block
   (lines 1000–1011) to `assets/index.css`, unlayered, beside the ink tiers they read.
   **KNOWN VISIBLE SIDE-EFFECT, name it in the commit**: these classes are currently INERT on
   OptionSelector's chips (scoped selectors never reached child-component internals — the drawer's
   selected difficulty chip renders `crayon-orange` today and paints nothing from it). Going
   global lights up the DRAWER's selected difficulty chip in crayon too. That's the consistency
   the mark asks for, on both surfaces at once — but it changes drawer pixels, so the drawer
   goldens re-mint alongside the gallery's, and the AA question below gets answered first.
6. **Accent hover** (the one color still missing): band chips/verbs gain
   `@media (hover:hover) { :hover { background: var(--color-accent); color: var(--color-foreground) } }`
   in StagingBand's scoped block — `--color-accent` finally appears in the band without any
   grammar transplant. Then `filter-census` G3.5 re-runs with the pointer walked over the new
   hover states.

## Files (exact, with per-file notes)

| File | Change |
|---|---|
| `web/frontend/src/pencil/chrome/GameGallery/useCarouselGlide.ts` | The whole of mark 2: pointer handlers (down/move/up/cancel/click-capture/dragstart), mid-glide transform fold-in, EMA flick, `dragging` guard on `reportSnap`, the `rearmSnap` fix in `glideTo`'s no-op branch, teardown. ~+75 |
| `web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue` | grab/grabbing cursor + `user-select` CSS only; no script change. ~+8 |
| `web/frontend/src/App.vue` | v-show moves to scene + mobile AttributionCard; `.is-gallery` class + 2 scoped rules; `headerName` computed; `:inert-heading`; `pendingHeadFrom`; masthead as second mover (enter); `runFold` → pairs (exit); `<Transition name="gallery-fade">` + its 2 CSS rules + PRM rule. ~+35/−8 |
| `web/frontend/src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue` | `inertHeading?: boolean` — span-vs-button, caret hidden, click guarded, sr-only name. ~+12 |
| `web/frontend/src/pencil/chrome/GameGallery/StagingBand.vue` | washi zone tag + group labelling; `.section-heading` adoption (bespoke type block deleted); difficulty label crayon tint; accent hover; `--staging-reserve` re-derived after the tape lands (measure the tallest card at 375 and 1280 — the no-shift-on-snap purpose is the gate, not the numbers). ~+20/−10 |
| `web/frontend/src/games/cards.ts` | `tiers()` carries `colorClass`; stripping comment dies; `StagingAxis` gains `colorClass?`; three `"level"` → `"difficulty"`. ~+4/−7 |
| `web/frontend/src/games/shared/GameControlPanel.vue` | DELETE the scoped `.crayon-*` block (hoisted); markup untouched. −14 |
| `web/frontend/src/assets/index.css` | Receives the four `.crayon-*` utilities beside the ink-tier ledger, comment intact. +14 |
| `web/frontend/e2e/gallery.spec.ts` | Fix the stale line-14 comment (board-group is no longer hidden in gallery); new rows: drag advances + announces; flick advances one card; drag-release over the centered card does not select; grab during a keyboard glide doesn't pop; header persists and tracks the snap; kenken reachable BY DRAG on WebKit. ~+60 |
| `web/frontend/e2e/gallery-deal.spec.ts` + `src/games/cards.test.ts` | `'level'` → `'difficulty'` literals (5 + 1 sites). ~±6 |
| `web/frontend/e2e/visual-golden.spec.ts` goldens | Gallery + drawer goldens re-mint FROM THE RUNNER ARTIFACT (band, header, and the newly-lit drawer chip all changed). Never from a local run. |

**LOC**: ~+170/−40 product, ~+70 test. **New dependencies: none.** Platform only: Pointer Events +
`setPointerCapture` + `DOMMatrixReadOnly`; Vue `<Transition>`; the existing `useFlipGlide`,
`useCarouselGlide` primitives, `MOTION.chromeLeaveMs`/`cardStepMs`/`drawerGlide` (no new timing
constants, no new curves), `SheetWashiLabel`, `OptionSelector`'s existing `colorClass` arm,
`.section-heading`, the crayon ink tokens, `DiceIcon` (unchanged).

## Build order (each step visually verified before the next)

1. **The look-first probe**: move the v-show down on :3001, open the gallery, confirm the board
   paints in the card face and the portrait drawer-tab isn't stranded. Everything else stacks on
   this line.
2. Mark 2 drag (composable + CSS + the rearm fix).
3. Header persist + movers + inert heading + exit fade.
4. Band consistency (washi, register, rename, colorClass, hoist, hover).
5. Spec/golden true-up.

## Visual verification (the standard of proof — real surfaces, not assertions)

On **:4248** (built dist) AND **:3001** (HMR), Chromium AND WebKit, light + dark, at 1280×860,
390×844, 844×390; screenshots to
`/private/tmp/claude-504/…/scratchpad/t6-research/` as before/after pairs.

1. **Drag** (1280, fine pointer): cursor grab at rest / grabbing held; three mid-drag screenshots
   proving the deck tracks the pointer 1:1 (no snap fighting); a flick settles exactly one card
   over on the glass curve with pips + band + aria following; a slow release between cards lands
   nearest and announces; a click immediately after release does NOT select; a plain click still
   selects; a grab 100ms into a keyboard glide — two frames 30ms apart, no pop; a drag with the
   guard ribbon armed dismisses it. Kenken reachable by drag on WebKit specifically. Touch
   emulation re-run: native inertia untouched.
2. **Header**: frame strips at t = 0/80/160/240/400ms after Enter and after Escape — wordmark
   TRAVELING and scaling both ways, never popping at final size; deck fading under the unfolding
   board on exit; arrow through all five cards, one shot per snap: sudoku→futoshiki→thermo→
   killer→kenken. Cancel from a DIFFERENT snapped card must restore the played game's name.
3. **Regimes**: 844×390 gallery — masthead static at top, no 50dvh dock, nothing parked over
   nothing; 390×844 — header + deck + band + pips all fit; 1280 with drawer open AND closed —
   `.is-gallery` beats `html.drawer-closed`.
4. **Band ⇄ drawer**: side-by-side crops of the drawer's new-game zone and the band at 1280 and
   390, light + dark, Easy/Medium/Hard each selected: same washi tape, same heading register,
   same crayon ink on chip + label (and the drawer's own chip now inked — capture it), same
   accent hover. `filter-census` G3.5 with the pointer walked over the band's hover states.
5. **PRM emulation**: drag works, release is an instant jump, enter/exit are cuts, no fade.
6. **Rapid-arrow Safari probe** (the T4-P1 rig): hold ArrowRight through five cards — if the
   per-snap wordmark re-bake stutters on real Safari, debounce the label fed to HandwrittenLogo
   by `MOTION.cardStepMs` while in gallery (cheap cure, only if the surface shows it).

## Risks

1. **THE ONE HIGH-RISK LINE** — v-show moving off `.board-group`. Correct by construction
   (Teleport relocates the board out of the scene root) but it gates the whole of mark 7: probe
   first (build order step 1). Watch the portrait drawer-tab teleport target too.
2. **Mid-glide grab ordering** — the computed-transform read MUST precede `anim.cancel()`, or the
   freeze compensation reads identity and the deck jumps under the cursor. Test by grabbing
   during a keyboard glide.
3. **Click swallow** — a wrong slop or an unswallowed click makes a release select the centered
   card, or a plain click stop selecting. Both cases in the spec rows.
4. **Crayon hoist lights the drawer chip** — a deliberate, named change, but the tint now paints
   1rem bold CHIP text, so plain AA (4.5:1) applies, not AA-large. The ink tiers clear it on
   paper (green 4.95 / orange 4.91 / rose 4.98 on `--color-card`); confirm in dark, where ink
   aliases raw wax. Grep for `.crayon-*` collisions outside the intended surfaces before landing
   (CrayonHeart's `.crayon-heart` is a different name — verified no collision).
5. **Spec literals** — `gallery.spec.ts:14` comment (masthead hidden) becomes false;
   `gallery-deal.spec.ts` × 5 and `cards.test.ts:107` carry `'level'`; a11y's landmark census now
   sees the h1 in gallery view — confirm exactly one h1 and that the sr-only name is what it
   reads.
6. **Drag on clamped WebKit builds** — the release reads `centeredIndex()` back rather than
   assuming the write took (the file's own maxScroll discipline); assert kenken-by-drag on WebKit.
7. **`--staging-reserve`** — re-derive after the washi tape lands; measured, not guessed.
8. **Banked, out of scope** (observed during research, not in these marks): at 390×844 the live
   center face can crop a taller-than-wide board — `--live-fit` derives from width alone
   (App.vue:303–310). Ledger it deliberately; don't fix it by accident here.

## Owner elections (banked, default = not built)

- **The exit gather** (Design 2's `runFlanks(-1)` mirror): full enter/exit symmetry at ≤290ms
  added exit latency + interaction gating. The fade ships; the owner's eye on the real surface
  rules whether the mirror earns its cost.
- **The `.icon-btn` verb transplant** for the band (28px die column, `@layer` hoist of the
  icon-btn family): phase 2 only if the side-by-side crops still read as two controls after the
  washi + register + ink land.

## MVP cut (if phased)

- **P0** (mark 2 whole): drag + rearm fix + cursor CSS + drag spec rows.
- **P1** (mark 7 core): v-show move + `.is-gallery` rules + `headerName` + masthead movers +
  inert heading + exit fade.
- **P2** (consistency): washi tag + `.section-heading` adoption + `level→difficulty` +
  `colorClass` through `tiers()` + crayon hoist + accent hover + reserve re-pin + golden re-mint.

Each phase leaves the estate whole and shippable; none depends on a later one.

---

## AUDIT RIDER (2026-08-02 — overrides the body where they conflict)

1. **The `level→difficulty` rename is STRUCK** (README ruling 1): §7b.3 dies; the
   `cards.ts` ×3 and `gallery-deal.spec.ts` ×5 + `cards.test.ts` ×1 rows leave the
   files table; risk 5 and MVP P2 die. §7b.4's prose reads "the level axis label
   tints…". `gallery-deal.spec.ts:66` is a type union — untouched.
2. **The golden re-mint is a phantom** — no gallery or drawer golden exists. The
   crayon-hoist chip change is proven by measured contrast ≥4.5:1 (1rem bold) plus
   the chair's crop look. Strike the re-mint row.
3. **`gallery.spec.ts:119` re-aims** — under the v-show move it stops
   discriminating; the Escape row asserts board visible AND `.is-gallery` absent.
4. **Mobile interaction (batch-B pairing)**: the v-show you move is the anchor of
   mobile's `--fold-bottom` height-0 skip — it survives (the scene component's root
   is `.app-layout`), but the pairing is gated at mobile's merge, not assumed.
