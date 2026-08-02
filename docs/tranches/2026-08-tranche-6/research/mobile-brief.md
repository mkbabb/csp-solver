# Mobile brief — MARK 9: centre the worksheet, attach the tongue

Adjudicated 2026-08-02, mobile lane. Two designs read the same tree correctly and split only
on the attachment mechanism. This brief is the apotheosis: **Design 1's mechanism, Design 2's
composition** — one JS-published layout edge consumed by one CSS clamp, inside Design 2's
tighter file plan.

## Decision

**WINNER: Design 1 (fold-edge publisher + `min()` clamp).** Design 2's `anchor()` mechanism is
killed on the campaign's own law: CSS Anchor Positioning needs Safari 26/Chrome 125, both
Playwright engines pass it, and real Safari overrules the rig (the T4-P1 scar; proxy≠surface).
On iOS <26 the declaration drops at parse and MARK 9's tongue defect survives on exactly the
surface class that earned the mark — a cure that may not land on the mark's own phone is no
cure, and Design 2's named escalation is ~8 LOC of JS anyway. One mechanism that works on every
engine beats a bleeding-edge mechanism plus its fallback mechanism.

**GRAFTED from Design 2** (each verified against the tree):
1. `--board-col` DRY hoist — the column width `min(42rem, calc(100vw - 1.5rem))` is written
   twice today (scene.css:165 `.scene-controls`, :257 `.fold-tools`); it becomes one token.
2. The in-flow reservation — `padding-bottom: 3rem` on `.fold-tools` instead of Design 1's
   `.main-content` padding. It rides the fold column itself, the centring counts it, and it
   deletes the `+ 3rem` constant from the clamp (the published edge is the padded bottom).
3. The column-aligned berth — `.drawer-handle { right: 1rem }` (scene.css:248) is
   viewport-relative; at 820×1180 it strands the tongue ~58px outside the fold band. It insets
   to the column edge in both poses (no x-hop for the glide to absorb).
4. The spec debts — the covis docGrowth prose re-derivation (its 62.84/123.53 arithmetic,
   board-covisibility.spec.ts:284–307, goes stale by design) and two born-RED relational locks.
5. The named trap — closed pose as `position: absolute; top: 100%` reads cheaper but an
   absolutely-positioned ~527px case contributes scrollable overflow and kills `maxScroll 0`.
   Fixed-in-both-states is non-negotiable; no implementer may "simplify" into it.

**KILLED as ornament:** `anchor-name`/`anchor()` and its parse-drop fallback ceremony;
`justify-content: safe center` (Design 1's `margin-block: auto` is the same semantics — auto
margins collapse to 0 under overflow, can never clip — with zero engine-support question);
Design 1's `.main-content` padding (redundant under graft 2).

## Mechanism

Two independent defects, two independent cures, portrait-scoped only:

**CENTRE.** `.board-group { margin-block: auto }` under
`@media (max-width: 1023.98px) and (orientation: portrait)`. The App.vue:731 `<1023px`
`justify-content: flex-start` rule stays byte-untouched — landscape (which really scrolls,
ratified pageVh 2.882) keeps it; portrait's auto margins absorb the free space that rule was
leaving at the bottom. Under overflow they collapse to 0 — identical to flex-start, never clips
(covis CONTROL A's 300px spacer arm stays red-capable).

**ATTACH.** The closed rest pose lifts off the viewport floor to the fold's bottom edge,
clamped so it can never sit below the visual viewport:

- `.fold-tools` gains `padding-bottom: 3rem` (the tongue's 48px, reserved in flow) and
  `width: var(--board-col)`.
- JS publishes `--fold-bottom` on `<html>`: the `.app-layout` border-box bottom + scrollY.
  `#fold-tools` is `.app-layout`'s last in-flow child on the dock (`#controls-drawer` is fixed,
  out of flow), so the published edge IS the padded fold bottom.
- The closed pose's one changed declaration (scene.css portrait-dock block):

```css
html.drawer-closed .scene-controls {
  translate: 0 min(0px, calc(var(--fold-bottom, 200dvh) - var(--vv-height, 100dvh)));
}
```

`top: var(--vv-height)` stays byte-untouched — the standing keyboard trigger honoured verbatim.
Rest pose stays on the `translate:` channel (F1-phantom law; no mover animates translate). The
case top lands at the padded fold bottom, so the tongue (`bottom: 100%` of the `#drawer-handle`
berth, DrawerTab.vue:135) spans exactly the 3rem reservation — flush under the verbs band.
Degradation is total-order safe: var unset → `min()` picks the `200dvh` arm → clamp yields
`0px` → the shipped screen-bottom pose. Keyboard up → `--vv-height` shrinks → clamp pins to the
visual floor → the shipped keyboard pose exactly.

**ZERO ENGINE CHANGES.** The glide is classic FLIP — `useFlipGlide` measures first/last rects
at gesture time, so the lifted rest pose is absorbed into the rail mover's deltas. Retarget,
reverse, PRM same-frame swap, focus, ARIA, G3 portrait-always-closed, the open pose
(`translate: 0 -100%`) and cap (`calc(100dvh - 12rem)`), the ≥1024 rail: all byte-untouched.
Proven by injection prototype on :4248 (chromium, DPR2) at 390×844/390×664/430×932: closed
tab.top ≡ fold bottom, maxScroll 0, pageVh 1.000; open sheet at its shipped cap, `.board-cells`
rect identical across the gesture. Artifacts:
`scratchpad/t6-research/proto-{390x844,390x664,430x932}-{closed,open}.png` + `proto-m9.mjs`
(m9-*.png = the marked defect, before).

## Files

1. **`web/frontend/src/games/shared/scene.css`**
   - `<1023px` block: `.app-layout` gains `--board-col: min(42rem, calc(100vw - 1.5rem))`;
     `.scene-controls { width: var(--board-col) }` (identical computed value).
   - Portrait-dock block: `.fold-tools` → `width: var(--board-col); padding-bottom: 3rem;`;
     `.drawer-handle` → `right: calc((100vw - var(--board-col)) / 2 + 1rem)`;
     `html.drawer-closed .scene-controls` → the `min()` lift above (replacing `translate: 0 0`).
   - Header comment's three-poses paragraph gains the closed pose's fold anchor + the
     fallback/clamp law + the absolute-position trap, named.
2. **`web/frontend/src/App.vue`** — scoped style: new
   `@media (max-width: 1023.98px) and (orientation: portrait)` block,
   `.board-group { margin-block: auto }`. The :731 flex-start block stays verbatim.
3. **`web/frontend/src/games/shared/GameScene.vue`** — `ref="layoutEl"` on the root
   `.app-layout` div; `layout: layoutEl.value` joins the existing `registerDrawerScene` payload.
4. **`web/frontend/src/games/shared/useControlsDrawer.ts`** — `DrawerSceneEls` gains
   `layout: HTMLElement | null`; `registerDrawerScene` mounts ONE ResizeObserver observing
   `layout` + `layout.parentElement` (`.board-group` — catches attribution/masthead/status/
   keyboard-inset reflows) plus a window `resize` listener; handler reads
   `layout.getBoundingClientRect()`, skips at height 0 (gallery `v-show` off), else sets
   `--fold-bottom` = `(rect.bottom + scrollY).toFixed(2) + 'px'` on `documentElement`.
   Publish unconditionally (the portrait CSS is the only consumer — fewer branches than gating
   on `portraitDock`). Disposer disconnects + removes the listener.
5. **`web/frontend/e2e/board-covisibility.spec.ts`** — same commit:
   - Re-derive the docGrowth headroom paragraph (:284–307): headroom 62.84 → ~13, measured
     docGrowth ~109/108 both engines; the `> 30` floor stands unchanged.
   - Add MARK 9's own locks to the fold-census row, born-RED on head, at 390×664 and 390×844:
     `|tongueTop − foldBottom| ≤ 1` (attachment) and `|boardCentreY − vh/2| ≤ vh × 0.06`
     (centring).
   - Re-cut any absolute rest-pose comments (board-top 132.22 etc.) to relational prose;
     `drawer.spec.ts` needs nothing — its portrait row asserts `position: fixed` + board-rect
     identity, both still true.

## Price

**LOC: ~+45/−15** (source ~+33/−7: scene.css +12/−5, App.vue +4, GameScene +2/−1,
useControlsDrawer +15/−1; spec +12/−8). **Dependencies: zero new** — plain CSS custom
properties + `calc`/`min`, platform ResizeObserver, the incumbent FLIP glide and `--vv-height`
publisher consumed unchanged.

## Visual verification (the standard of proof)

Surface: the built dist at `http://localhost:4248/?size=3&difficulty=MEDIUM` (and :3001 after
the patch). Rig: playwright, **chromium AND webkit**, deviceScaleFactor 2, isMobile+hasTouch.
Screenshot + rect read per cell:

1. **390×664 closed (the shortest cell)** — tongue top ≡ `#fold-tools` padded bottom ±1px;
   board centre within 6% of viewport centre; no tongue/peek-chip overlap. (Slack here is
   ~7px/side — the centring is nearly invisible at this rung by construction; show the owner so
   it isn't read as the change not landing.)
2. **390×844 closed** — same two reads, plus the eye: one cohesive block (masthead, board,
   reserved line, verbs, tongue) with air above and below, nothing orphaned at the screen edge.
3. **430×932 closed** — same reads (the prototype's third cell).
4. **820×1180 closed** — tongue's right edge 1rem inside the fold band's right edge, not the
   viewport's (the cell where `right: 1rem` re-earns the mark).
5. **Each portrait cell OPEN via a real tap on `.drawer-tab`** — sheet stops below the
   masthead at the shipped cap; tongue rides the case's top-right, tappable; board rect
   identical to its closed rect.
6. **844×390 landscape + 1280×800 desk, closed and open** — every rect and pageVh identical to
   the pre-change read, checked as a diff, not by eye (every new rule is portrait-scoped or
   value-identical; this is the HOLD's proof).
7. **Dark theme, portrait closed** — the tongue overlaps a region it didn't before.
8. **Gate read alongside every shot**: pageVh ≤ 1.000, maxScroll 0, ≥4 painted play verbs each
   ≥44×44, plus both covis controls (300px spacer → pageVh > 1; band hidden → verbs 0).
9. **The owner's own iPhone at 390×844** — the mark came from a real phone; it closes on one
   (E8 stands open).
10. **Keyboard ablation re-run** — the pass-6 `bottom: 0` ablation (deepest chip strands at
    616.92 under a 368 band edge) re-derived against the new closed pose before the row banks.

## Risks

1. **Portrait pixels move by design** — absolute fold-census figures shift (board top 132.22 →
   centred); goldens are 1280×800-only and unaffected; any spec pinning portrait absolutes
   re-cuts to the relational locks. NEVER re-baseline on a single red.
2. **RO blind spot** — a pure position shift of `.app-layout` with no size change of it,
   `.board-group`, or the window escapes the publisher. No known trigger (viewport moves fire
   `resize`; content changes resize an observed box). Degradation is a mis-attached tongue,
   never a broken drawer (clamp + fallback → shipped pose).
3. **Open-pose berth inset is a disclosed change to a ratified surface** — the tongue insets to
   the column edge in the open pose too (390: right 374→362; 820: 804→730). Deliberate: both
   poses align to the column and the glide has no unanimated x-hop.
4. **Chromium-only prototype for the assembled graft** — the parts are measured in both engines
   but the final assembly's webkit re-derivation is owed at land (the pass-6 rig runs both).
5. **`--board-col` inherits from `.app-layout`** — a future consumer teleported out of that
   subtree (the live-face projection is the standing example) reads it unset. All three
   consumers are in-subtree today.
6. **Keyboard-while-closed is characterized, not engineered** — the clamp reproduces the
   shipped pose exactly; the ablation re-run (verify §10) is the proof, not this prose.

## MVP cut (if phased)

Not recommended — the whole cut is ~45 LOC. If forced: **phase 1 = centring alone** (App.vue's
one rule, +4 LOC, half the mark); phase 2 = the attachment (everything else). The tongue is the
louder half of the mark; don't ship phase 1 alone past a single review beat.

## Owner's-eye questions (not blockers)

- Flush attachment vs a 0.25rem breath between the verbs band and the tongue — one constant.
- Should the masthead ride the centred worksheet (it does — it's inside `.board-group`) or stay
  pinned high? The former is what "centre the board" reads as; the latter is a different design.
- Board GROWTH into the reclaimed slack (~100px above/below a 362px board at 390×844) — the
  richer answer to "a HUGE empty region," but it lives in five games' shellClasses and reopens
  the settled cap ladder. Held out deliberately; the owner may have meant it.
- `.app-layout { gap: 1.25rem }` → 0.75rem would make the assembly hug harder — pure taste.
- At rest the tongue now reads as a drawn box attached under the worksheet rather than poking
  from under the screen edge; keeping the poking fiction = hide its bottom stroke, +2 LOC.

---

## AUDIT RIDER (2026-08-02 — overrides the body where they conflict)

1. **Re-derive, don't land, the numbers** — docGrowth/pageVh constants (`~109/108`,
   headroom 62.84→~13) were measured at formation HEAD; controls merges first and
   grows the card (`.icon-sublabel` always-on, sticky bar, `.dt-marks` 1.9em). The
   born-RED locks keep their relational shape; constants re-measure post-controls.
2. **Gallery pairing is a named gate at your merge**: the `--fold-bottom` publisher
   must still no-op at fold height 0 in gallery view (gallery moved the v-show your
   skip keys on — it survives via the scene root, verified, but gated not assumed);
   and `.board-group { margin-block: auto }` now applies in gallery view too — the
   chair looks at gallery-view portrait explicitly.
3. **Risk 5 re-check post-gallery**: the masthead now lives inside `.board-group`
   but outside the v-show'd subtree — verify no `--board-col` reader crosses.
