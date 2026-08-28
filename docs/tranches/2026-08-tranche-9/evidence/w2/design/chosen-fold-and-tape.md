# T9-W2 chosen design — fold-and-tape (§2.3+§2.5) — the fable arm, adjudicated 2026-08-25

See adjudication.md for the ruling, grafts, and rejected arms.

## decision

The fold becomes chrome's property, never content's: both clip edges of the controls card are owned by card-colour chrome wearing stateful fade skirts plus a graphite gutter for extent; washi tags go in-flow sticky so they pin instead of shear; and the tape class gets a lane law — a tape may cover only air, drawn frame, or the control it names — enforced by lanes priced against hit boxes with one shared note berth on the action bar.

## mechanism

§2.3 — FOUR PIECES, ALL IN THE HOUSE'S EXISTING GRAMMAR. (1) The bottom edge already has the idiom: `.action-bar::before` is "a short fade so scrolled content dissolves into the bar instead of being guillotined" — it gets deepened (0.9rem→2rem) and made HONEST: it paints only while content actually hides below. The state is published the house way (measured, not spelled): GameControlPanel's existing `--action-bar-h`/`--card-pad-b` publisher grows two siblings — a passive rAF-coalesced scroll listener + the same ResizeObserver toggle `data-fold-above`/`data-fold-below` attributes on the card when scrollTop > 4px / remaining scroll > 4px. (2) The top edge gets the mirror: a `position:sticky; top:0` `::before` sentinel on `.controls-card` (zero DOM, zero flow cost via height + negative margin-bottom), painting a 1.5rem card-colour→transparent fade, opacity-gated by `data-fold-above` — so at rest it is invisible and mid-scroll every frame stroke crossing the case edge DISSOLVES instead of shearing. (3) The gutter speaks extent: `::-webkit-scrollbar` styling (6px graphite thumb in `--ink-press-quiet`, transparent track) deliberately forces a classic scrollbar on darwin, where V7 measured the overlay bar at zero layout width — the only positional cue the fold has; `scrollbar-gutter: stable` reserves the 6px so it never flickers layout; Firefox gets `scrollbar-width: thin` behind `@supports not selector(::-webkit-scrollbar)` (Blink ignores ::-webkit-scrollbar when scrollbar-width is set — the two must never co-apply). All scoped to the exact media pair the bar's sticky block already spells (≥1024, or <1024 portrait) so the in-flow landscape card is untouched. (4) THE NEVER-STRADDLE DISCIPLINE: `anchor="tag"` tapes stop being absolutely-positioned floaters and become IN-FLOW STICKY first children of their wells — negative margins reproduce the straddle-the-stroke rest pose byte-for-byte (net flow height zero), and when the well's top stroke scrolls past the case edge the tag PINS at `top:0.3rem` (inside the fade band, over dissolving content) instead of shearing — which is simultaneously the M03 sticky-tag mechanic ("tag visible while its group scrolls"; W7 owns its type voice). The Frame-B residue (deal tab sheared at open) is closed at both ends: `useControlsDrawer` resets `panel.scrollTop = 0` at open-settle, and `scroll-padding-top: 1.6rem` on the card means focusPanel's focus-scroll can never bury a pinned tag — the exact twin of T7-W2 A1's scroll-padding-bottom. Z-ladder re-rung and documented at both ends per the T7-W7 pair idiom: frames/content ≤1 < top sentinel 30 < pinned tags 35 (was 2) < hover tapes 50 < bar 60. §2.5 — THE TAPE LAW, per family. Tag tapes: the lane is the inter-well daylight plus the well's own bottom padding, and the price the .tray-well comment already spells is re-derived against HIT boxes (the 44px tap floor is why "players" reached 68% of Live: the option's tap box outruns its visible chip) — `.tray-well` padding-bottom rises so every interactive tap box ends above the next tag's straddle, numbers taken from the census probe, not taste. Bar tapes: the four verb notes stop hanging off four buttons and share ONE NOTE BERTH anchored to the bar's own top rule, centred (drop `relative` from the bar buttons so `.action-bar`, already position:relative, becomes the containing block) — the UI-9 "tape ON the ruled line" precedent, one lane priced once; the lane above the bar is bought content-side (last well's margin-bottom grows by the measured 17–24%-of-Play deficit, ~1rem) so at every settled scroll pose the berth holds only air and fade. Hover reveal grammar (`.group:hover`/`:focus-visible`) untouched. The census e2e row is the class's permanent enforcement — any future tape-over-interactive overlap is a red gate, and `anchor="center"` (cover only the control you name) is the component's prescribed flip arm for any surface that cannot buy a lane. Filter census 9 unchanged (gradients + sticky only, zero new filters); no new product strings (M16 moot); PRM: the two fade-skirt opacity transitions ride the washi's own 150ms and are wrapped in no-preference — under PRM they snap, losing no function.

## sketch

scene.css — inside (or beside) the two scrollport blocks, scoped to the bar's exact media pair; the two existing `scrollbar-width: thin` lines (:130, :327) are DELETED (Blink kills ::-webkit-scrollbar when scrollbar-width is set):

```css
/* T9-W2 §2.3 — THE FOLD IS CHROME'S, NEVER CONTENT'S. Both clip edges of the card's
   scrollport are owned by card-colour chrome wearing a fade skirt; content and frame
   strokes DISSOLVE into chrome, never shear at the case edge. Stateful — measured,
   not spelled: GameControlPanel publishes data-fold-above/-below from the card's own
   scroll box (the --action-bar-h publisher's siblings). Z-ladder here: content/frames
   ≤1 < this sentinel 30 < pinned tags 35 < hover tapes 50 < bar 60 — re-cut together. */
@media (min-width: 1024px), (max-width: 1023.98px) and (orientation: portrait) {
  .controls-card::before {
    content: "";
    position: sticky;
    top: 0;
    z-index: 30;
    display: block;
    height: 1.5rem;
    margin-bottom: -1.5rem; /* zero flow cost */
    background: linear-gradient(to bottom, var(--color-card), transparent);
    opacity: 0;
    pointer-events: none;
  }
  .controls-card[data-fold-above]::before {
    opacity: 1;
  }
  .controls-card {
    /* the gutter speaks the extent — forced classic, so darwin's zero-width overlay
       stops eating the fold's only positional cue */
    scrollbar-gutter: stable;
    /* focus-scroll may never park chrome astride the case edge (T7-W2 A1's twin) */
    scroll-padding-top: 1.6rem;
  }
  .controls-card::-webkit-scrollbar { width: 6px; }
  .controls-card::-webkit-scrollbar-thumb {
    background: var(--ink-press-quiet);
    border-radius: 3px;
  }
  .controls-card::-webkit-scrollbar-track { background: transparent; }
}
@supports not selector(::-webkit-scrollbar) {
  .controls-card { scrollbar-width: thin; scrollbar-color: var(--ink-press-quiet) transparent; }
}
```

GameControlPanel.vue script — the publisher grows two siblings (same node, same lifecycle):

```ts
// T9-W2 §2.3 — the fold's state, published where the bar's height already lands.
function publishFold() {
  const card = actionBarEl.value?.closest<HTMLElement>(".controls-card");
  if (!card) return;
  card.toggleAttribute("data-fold-above", card.scrollTop > 4);
  card.toggleAttribute(
    "data-fold-below",
    card.scrollHeight - card.clientHeight - card.scrollTop > 4,
  );
}
// wired: card scroll listener ({ passive: true }, rAF-coalesced) on mount of the bar,
// and the existing useResizeObserver callback calls publishFold() after its vars.
```

GameControlPanel.vue styles:

```css
/* §2.3 — deepened AND honest: the dissolve paints only while content hides below. */
.action-bar::before {
  height: 2rem;
  opacity: 0;
}
.controls-card[data-fold-below] :deep(.action-bar)::before { /* or unscoped-in-file */
  opacity: 1;
}
@media (prefers-reduced-motion: no-preference) {
  .action-bar::before { transition: opacity 150ms; }
}

/* §2.5 — the tag rides the new ladder (pair-noted in scene.css). */
.tray-well :deep(.washi-tag) { z-index: 35; }

/* §2.5 — the lane is priced against HIT boxes, not visible chips: the 44px tap floor
   is how "players" reached 68% of Live. Bottom pad rises so every tap box ends inside
   the frame; the last well buys the bar-berth's lane (the measured 17–24% deficit). */
.tray-well { padding: 0.55rem 0.5rem 0.55rem; }
.tray-well:last-of-type { margin-bottom: 1.4rem; }

/* §2.5 — ONE NOTE BERTH: every bar verb's tape hangs from the bar's own top rule,
   centred (UI-9's "tape ON the ruled line"), so the lane is one and priced once. */
.action-bar .washi-label { left: 50%; bottom: 100%; margin-bottom: 0.15rem; }
```

GameControlPanel.vue template — the four bar buttons only: `:class="{ 'group relative': !mobile }"` → `:class="{ group: !mobile }"` (the bar becomes the tapes' containing block; the players-well invite button keeps `group relative`).

SheetWashiLabel.vue — the tag branch replaces its absolute pose:

```css
/* T9-W2 §2.3/§2.6 — the tag is IN FLOW now, sticky in its well: the negative pull
   reproduces the straddle at rest (net flow height zero — pull + counter-margin),
   and when the stroke scrolls past the case edge the tag PINS inside the fade band
   instead of shearing. The M03 sticky-tag mechanic and the residue-clip cure are
   this one rule. Type voice (size) is W7's; only the pose lives here. */
.washi-tag {
  position: sticky;
  top: 0.3rem;
  align-self: flex-start;
  bottom: auto;
  margin: -0.6rem 0 -0.55rem 0.85rem;
  padding: 0.02rem 0.4rem;
  font-size: var(--type-caption);
  font-weight: 500;
  letter-spacing: var(--type-tracking-wide);
  text-transform: lowercase;
  opacity: 1;
  transform: rotate(var(--washi-tilt));
}
```
(The pull constants are measured at implementation against the tag's one-line box and priced in the comment, the .tray-well way; `aria-labelledby` ids, the `+ .zone-hint` sibling reveal, and `pointer-events: auto; cursor: help` all survive — same element, same order.)

useControlsDrawer.ts — open-settle, beside the existing focusPanel() call at :216:

```ts
// T9-W2 §2.3 — the sheet always rises showing its own top edge whole (Frame B's
// sheared deal tab): rest pose is scrollTop 0; scroll-padding-top guards the rest.
panel.scrollTop = 0;
```

e2e — new file controls-fold.spec.ts (single quotes by hand, matching drawer.spec.ts's idiom) + the §2.5 census as new rows in zone-grammar.spec.ts (the tags' existing spec home), V7's hover census promoted:

```ts
test('the fold is cued while content hides below', async ({ page }) => {
  // 1280×720 rail + 390×844 dock: data-fold-below present, ::before opacity 1,
  // scrollbar-gutter offset > 0; at scroll end data-fold-below absent, fade gone
});
test('no chrome shears at the case edge', async ({ page }) => {
  // scrolled card: 1px-strip screenshot across the top clip edge reads gradient,
  // not step (max adjacent-row delta under threshold), both engines
});
test('the tag pins while its group scrolls', async ({ page }) => {
  // M03 row: scroll the pencils well past the fold; its tag rect stays inside the
  // card's clip box until the well's bottom passes — RED at HEAD
});
test('no tape covers an interactive element', async ({ page }) => {
  // §2.5 census: hover every tape-bearing control at settled poses (top, max
  // scroll), intersect every .washi-label rect with every interactive's rect —
  // zero overlap, both regimes, both engines — RED at HEAD (68% Live, 17–24% Play)
});
```

## probeImpact

§2.5 hover census (born-RED at HEAD: players tag over 68% of Live; bar tapes 17–24% over Play each): goes green three ways under the lane law — the players tag clears Live because .tray-well's bottom padding now prices the 44px TAP box (the term the original arithmetic missed), pushing the next well's straddle below every hit box; the four bar tapes stop overlapping Play entirely because they no longer rise from their buttons at all — they hang from the bar's one note berth whose lane the last well's grown margin-bottom guarantees at max scroll; the invite tape clears the checking well by the same inter-well pricing. The census asserts zero tape-over-interactive intersection at settled poses and becomes the class's standing gate. M03 sticky-tag probe (born-RED: tag scrolls away with its group): goes green because anchor="tag" is now position:sticky in flow — the tag pins at top 0.3rem while its well scrolls and releases when the well's bottom passes, exactly what the probe asserts; W7's type voice applies to the same element later without touching the mechanism. §2.3 carries no charter-born-RED, so this lane mints two: the fold-cue row is RED at HEAD trivially (no data-fold attributes exist, ::before fade absent at the top, darwin gutter width 0) and green once the publisher + sentinel + forced-classic thumb land; the shear row is RED at HEAD (Frame B's deal tab is a hard step at the case edge; V7's 32–97px residue always shears a stroke or tab) and green because every scrolled edge is either a pinned tag (never cut), a dissolving stroke under the sentinel's fade, or the bar's opaque band — plus scrollTop reset + scroll-padding-top make the rest poses land on air by construction.

## risks

(1) The forced-classic 6px scrollbar shifts the card's interior width on darwin/overlay systems — a claimed-surface DELTA on card crops must be declared; visual-regression rows touching the card need the before/after pair; the four goldens (logo/toggle) sit outside the card and stay 4/4 untouched. (2) The in-flow sticky tag must net zero flow height (pull + counter-margin priced against the tag's one-line box) — sub-pixel drift vs the shipped rest pose is possible; measure with the domsnap idiom before/after and re-price, since π on unclaimed crops is absolute. (3) .tray-well re-pricing grows the card a few px — the coarse-height gate has history (pass-1 went 7px underwater); re-run it at 390-class cells. (4) Blink silently ignores ::-webkit-scrollbar if any scrollbar-width survives — the two existing `thin` declarations MUST be deleted in the same commit or the gutter dies invisibly. (5) iOS honors ::-webkit-scrollbar inconsistently across versions — the fade is the primary cue there; the thumb is progressive enhancement, and the probe's gutter assertion should run desk-only. (6) A pinned translucent tape rides over dissolving content — legible only while the fade band ≥ the tape band; when W7 grows tag type per M03, the sentinel height and top offset re-price together (noted at both ends). (7) scrollTop-reset-at-open discards scroll position between opens — deliberate (the sheet's top edge must arrive whole) but it is a behavior change the chair may want flagged to the owner. (8) The bar's shared note berth centres tapes over the bar rather than over each verb — the hover association is carried by proximity and the reveal timing; if the chair reads it as too loose, the fallback inside the same law is anchor="center" per verb with a ~7rem cap, at the cost of covering the hovered control's own icon.

## rejected

An always-on gradient fade (no state gating) — lies at the boundary: the last row reads half-erased at scroll end; the estate prizes edge honesty, so the fade is published-state-gated instead. `scrollbar-width: thin` + `scrollbar-gutter: stable` alone — V7 measured exactly this as "an overlay scrollbar of zero layout width" on darwin; the standard properties cannot force visibility there, only ::-webkit- forced-classic can, and the two actively conflict in Blink. CSS scroll-state container queries (`@container scroll-state(stuck/scrollable)`) — the native form of my data-attributes and strictly cleaner, but not cross-engine (WebKit), and this estate is two-engine by law; the publisher idiom is already house-proven (--action-bar-h). A per-tape JS collision engine (elementsFromPoint / IntersectionObserver with a runtime flip) — heavier, boil-adjacent, and it guards the same failure the census gate already guards deterministically; lanes-by-construction is priced once in the file where the house already prices chrome ("priced, not chosen"). anchor="center" flip for the bar verbs (the UI-9 precedent applied directly) — lawful for the hovered control but a `wide` tape centred in a four-across bar overhangs the NEIGHBOR verbs, which are interactive: the violation moves sideways; traded for the single bar-top berth. A dog-ear/torn-corner fold cue or a drawn "more" chevron — a new asset (possible filter-census pressure), a control that does what scroll already does, and M16 plain-copy pressure on any worded variant; the fade + gutter say the same thing in chrome the card already owns. Quantizing the card's cap so clip edges land on well boundaries — falls apart the moment any well changes height and cannot survive W7's coming type re-cut; the fade license (chrome may cross the fold only through a dissolve) is invariant under content changes.

## files (as proposed)

- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/games/shared/scene.css
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/games/shared/GameControlPanel.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/sheet/SheetWashiLabel.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/games/shared/useControlsDrawer.ts
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/games/shared/GameScene.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/e2e/controls-fold.spec.ts
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/e2e/zone-grammar.spec.ts
