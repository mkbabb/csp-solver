# T9-W2 chosen design — mobile-mechanics (§2.6+§2.7) — the opus arm, adjudicated 2026-08-25

See adjudication.md for the ruling, grafts, and rejected arms.

## decision

ONE LAW IN THREE CLAUSES — **the coarse pointer is a regime, not a narrower desk**: (1) the type ladder gets a single `@media (pointer: coarse)` band that re-floors its four control rungs, read through five *role* tokens so W7's sizes land as a five-line remap and never a call-site sweep; (2) a compartment's tape stops straddling its frame and becomes an in-flow `position: sticky` header inside the card's own scroll case — which cures the pin, the Frame-B clip and §2.3's "chrome never straddles its case edge" with one geometric change; (3) the drawer's tongue leaves the ribbon and hangs off **whichever board edge faces the page's slack** — bottom in portrait, right in landscape and on the desk — so the desk's side-tab is not an exception to the mobile tab but the same law read on the axis the viewport gives, and short landscape inherits its §2.2 entry for free.

## mechanism

**Measured at HEAD (built dist, chromium, 2× dpr, hasTouch — my own run, the born-RED baselines):**

- 390×844 / 390×664 coarse portrait: `.icon-sublabel` **12.179px**, `.zone-row-label` 12.179, `.washi-tag` 12.179, `.heading-value` 12.179, `.ctrl-btn` 16.000 (a hardcoded `text-[1rem]`), `.section-heading` 20.352. The same tokens at the 1440 rail read 14.38 / 16.40 — **the phone is the MINIMUM of every fluid rung.**
- Drawer open at 390×844: card `scrollHeight 660 / clientHeight 628 / maxScroll 32`; the `new game` tag's top is **7.46px** inside the card's top edge at rest and lands at **y 191.46 against a card top of 216** at `scrollTop 32` — `tagVisible false` while its well still straddles the edge. Frame B's clipped tab, reproduced.
- The stranded chip: board bottom → `.drawer-tab` top = **54.78px** at 390×844, 390×664 and at 572×720 fine-portrait (m09's pose, where the ribbon holds the chip ALONE because `.play-controls` is coarse-gated). Frame D, measured.
- 844×390 / 812×375: `.drawer-tab` **0×0**, `#fold-tools` **0×0**, `docScrollH 1157 / 1152`, `maxScroll 767`. No controls entry exists at all.

**(a) THE SCALE ENTERS AS TOKENS, IN ONE BAND.** Three layers, each with exactly one job:

1. *Rungs* — `assets/typography.css` gains one `@media (pointer: coarse) { :root { … } }` block that re-declares `--type-caption / --type-small / --type-body / --type-micro` with the **same clamp shape and the same ceilings**; only the minimum moves. Nothing about the ladder's mathematics changes, and every existing consumer inherits with zero edits. It rides the exact media key the ≥44px floor already rides (`index.css`'s coarse block, `.icon-btn`'s floors, `.play-controls`, `.washi-persistent`) — so tap floor and read floor are ONE regime, which is what M01 asks for.
2. *Roles* — five tokens on `:root`, named for W7's own §1/§2 taxonomy so the two waves speak one vocabulary: `--type-act` (the primary verb), `--type-verb` (the action bar), `--type-tool` (icon-tool sublabels + the tongue's word + the peek chip), `--type-tag` (group tape + row caption + closed-tab value), `--type-group-title` (the section heading). Every site is re-pointed to a role; **W7's decision is then five `var()` right-hand sides**, and the roles can diverge (today the toolbar label and the group tape are both `--type-caption` by coincidence, not by law).
3. *Icons and floor* — `--icon-act / --icon-verb / --icon-tool` and `--tap-floor: 2.75rem`, with the same coarse arm. The SVG `:size` props stay as the first-paint default and CSS overrides them, which is the estate's own precedent (`.action-verbs .icon-btn svg { width: 30px }` already does exactly this). `--tap-floor` replaces the four spelled `2.75rem`s; the census asserts it never resolves below 44.

The one template edit this needs is real and is itself a defect cure: `OptionSelector.vue` sets its type with four **arbitrary Tailwind utilities** (`text-[1rem] md:text-[1.375rem]` …) that are invisible to the ladder. They are deleted for `font-size: var(--type-option)` in the component's own `<style>`.

Two derived layout budgets are already authored as formulas on `--type-body` (App.vue's `.board-group { padding-bottom: calc(0.4rem + var(--type-body) * var(--type-leading-caption)) }`, GameBoard's 896px cap derivation), so **they follow the new scale automatically** — that self-following property is why the cure is a token edit and not a re-derivation.

**(b) THE TAPE STOPS STRADDLING, AND THAT IS WHY IT CAN PIN.** The finding, stated as the law: *a tape that hangs above its own border box cannot pin at a clip edge — the straddle IS the clip.* `.washi-tag` today is `position: absolute; top: 0; transform: translateY(-52%)` — out of flow (so `sticky` is unreachable) and hanging 52% of itself above the well, which is precisely the 24.5px that shears off the case edge in Frame B. The cure makes it the well's first **in-flow** child at `position: sticky; top: 0`.

The scroll case is `.controls-card` — the SAME element in both scrolling regimes (`scene.css` gives it `overflow-y: auto` under `min-width: 1024px` and under `max-width: 1023.98px and (orientation: portrait)`), so **one rule cures desktop and mobile together**, which is exactly what M03 asks ("on both desktop and mobile"). Every ancestor between tag and card (`.outline-container` = `position: relative; overflow: visible`, `.control-panel-wrap`, `.control-panel-filtered` = `display: block`) is sticky-transparent; the tag's containing block is its own well, so **the tape pins at the card's top while its group is in view and leaves WITH its group** — no orphan headers.

Z-order: the tag takes `z-index: 3` — over the well's `.outline-svg` (1) and its rows, under `SheetWashiLabel`'s hover tapes (50) so a hint still paints over its own tag, and under the sticky `.action-bar` (60) so scrolled chrome still dissolves into the bar. **The documented 50↔60 pair is untouched.**

Focus-scroll gets the mirror of T7-W2's A1 cure: the card already spends `scroll-padding-bottom: var(--action-bar-h)` so a focused control clears the bar it sticks to; it now also spends `scroll-padding-top: var(--tag-band)`, published by the SAME `useResizeObserver` in `GameControlPanel` off the first tape's own border box. One publisher, two edges, measured-never-spelled.

**(c) THE TONGUE HANGS OFF THE BOARD'S SLACK EDGE.** `DrawerTab.vue` is already one instance with one drawn word and one `aria-expanded`/`aria-controls` pair that axis-swaps between poses (48×92 on the desk, 92×48 on the dock's handle). The law generalises what the desk already does — "the case rests tucked BEHIND the board's right edge, z-under the sheet" — into: *the tongue tucks under the board's paper on the edge that faces the page's slack.*

- **Desk (≥1024):** right edge, vertically centred. **Byte-untouched.**
- **Mobile portrait:** the board's **bottom-right corner**, `top: calc(100% - 0.5rem)` of a zero-box berth at the paper's own edge, `z-index: -1` so it paints under the opaque `.board-wrapper` (a stacking context via `will-change: transform`, so the tuck resolves exactly as it does on the desk), 92×48, protruding 40px. Bottom-**right**, not centre, for four reasons that are arguments and not dodges: it is the desk's own far-corner reading quarter-turned; it leaves the board's bottom-left to the marginalia, which reads left-to-right; it lands under a thumb instead of under the OS home indicator; and it shares an x with `#drawer-handle`, so **the sheet rises straight out from under its own tongue** with no lateral jump.
- **Mobile landscape (short):** the right edge — the desk's pose verbatim — because a landscape phone is a wide-and-short cell exactly like the desk, with ~239px of dead gutter each side (App.vue's own §M20 measurement). This is what gives §2.2 its cure with **no new control and no new geometry**: the media key on the desk's arm widens, and the drawer's regime ref goes `portraitDock` → `mobileDock` (`!rowRegime`), extending the sheet pose — with its cap re-derived from landscape's own chrome (`100dvh - 4rem` = handle 3rem + page gutter 1rem; the masthead is out of flow in the left gutter there, so portrait's 9rem masthead band is not owed).

The berth: `GameBoard.vue` mints a zero-box `#board-edge` (`position: relative; width: 100%; height: 0`) as a flow sibling immediately after `.board-wrapper`. This is the estate's own Teleport-berth discipline ("a Teleport target with a box is a box every regime pays for" — `#fold-tools`, `#drawer-handle`), and it is what makes the anchor **the board's paper edge and not the shell's** — immune to `.board-margin`'s in-flow height and to a `SolverErrorNote` arriving. Zero height with no border/padding, so `.board-margin`'s `margin-top: 0.4rem` collapses through it: layout-neutral by construction.

`GameScene.vue`'s `tongueBerth` becomes `!mobileDock ? null : drawerOpen ? '#drawer-handle' : '#board-edge'`, with the Teleport disabled when null (the desk renders in place inside `.board-peek-host`, untouched). `#fold-tools` keeps the four play verbs and stops being the tongue's home.

**Hit area and M13's quick actions:** the tongue's box law is stated once so W7 can fill it without W2 re-cutting geometry — *cross-axis = `var(--tap-floor)`, main-axis = content, minimum 5.75rem*. A tongue carrying 0–3 quick glyphs above its word grows along its main axis only and stays anchored at the edge's midpoint-or-corner.

**Safe areas:** the tongue hangs off the BOARD (centred, with gutters), so it never meets a notch. What does is the risen sheet: `.scene-controls` in the dock takes `padding-inline: env(safe-area-inset-left) env(safe-area-inset-right)` and the card takes `padding-bottom: env(safe-area-inset-bottom)` — and because `--card-pad-b` / `--action-bar-h` are *measured* off `getComputedStyle(card).paddingBottom`, the bar's skirt and the focus-scroll band absorb the inset for free. `--head-rule` already folds the top inset.

**One collision, one declaration:** the tongue's 40px of protrusion shares the band with `.board-margin`'s single line (6.4→27.2px below the paper). `.board-margin { margin-right: 6.5rem }` at `<1024` yields the tongue's column. Zero column cost; the note's 286px of remaining width carries the M16-register plain sentences the estate ships.

**Motion / PRM:** nothing new is animated. The re-berth is a Teleport, the pin is paint-time, the scale is layout at load. A pin *transition* is refused outright — a header that eases into place is a header that is briefly in the wrong place. The drawer's existing WAAPI glide and its PRM arm are untouched; `useControlsDrawer`'s G3 ("portrait always lands closed") widens to `mobileDock`, since an open sheet on a 390-tall landscape is the covered board the covis row exists to kill.

**Filter census:** zero delta. `HandDrawnOutline` mints no live filter (its grain is baked into filterless opacity-swapped siblings), so the tongue newly appearing in landscape costs the budget nothing; nothing is added and nothing removed. **9 stands.**

## sketch

## 1 · `assets/typography.css` — one band, five roles

```css
/* ── THE THUMB'S RUNG (T9-W2 §2.6, the owner's M01) ───────────────────────────────────────
   The ladder's fluid term is a WIDTH slope, and a phone is the narrow end of it. Measured on
   the built dist at 390 coarse, every control rung bottoms out at its own minimum — the
   toolbar's sublabels, the compartment tapes, the row captions and the closed-tab values all
   draw at 12.179px — while the 1440 rail reads those SAME tokens at 14.38 and 16.40. Width is
   the wrong axis: a desk is 60cm away under a mouse, a phone is at arm's length under a thumb,
   and the thumb's surface is the one that needs the larger ink.
   So the coarse pointer re-floors the LADDER rather than the sites. Same clamp shape, same
   ceilings, same vw slope — only the minimum moves, so nothing about the desk's rendering can
   change and every consumer inherits with no edit. The key is the one the ≥44px floor already
   rides (index.css's coarse block, .icon-btn, .play-controls, .washi-persistent): tap floor
   and read floor are ONE regime, which is what the mark asks for.
   THE NUMBERS BELOW ARE W7'S (§2.6: "the VOICE is W7's"). These are the mechanism's floor —
   ≥14px on any control label — and W7 re-cuts them here, in this block, and nowhere else. */
@media (pointer: coarse) {
  :root {
    --type-caption: clamp(0.875rem, 0.83rem + 0.21vw, 1rem);      /* 14→16  (was 12→16) */
    --type-small:   clamp(1rem,     0.93rem + 0.25vw, 1.25rem);   /* 16→20  (was 14→20) */
    --type-body:    clamp(1.125rem, 1.05rem + 0.27vw, 1.375rem);  /* 18→22  (was 16→22) */
    --type-micro:   0.8125rem;                                     /* 13     (was 11)    */
  }
}

/* ── THE CONTROL ROLES (T9-W2 §2.6) ───────────────────────────────────────────────────────
   Five names for W7's own taxonomy (§1 the heading voice, §2 primary act / option row / icon
   tool / info whisper), each pointing at ONE rung. The sites read the ROLE; the role reads the
   rung. That indirection is the whole of "W7's sizes drop in without rework": re-pointing a
   role is five right-hand sides in this block, never a sweep of call sites — and two surfaces
   that happen to share a rung today (the toolbar sublabel and the compartment tape are both
   --type-caption BY COINCIDENCE) can part company without either learning a literal. */
:root {
  --type-act:         var(--type-small);       /* Deal — the card's one primary verb */
  --type-verb:        var(--type-caption);     /* clear · fill · solve · share */
  --type-tool:        var(--type-caption);     /* undo · redo · hint · peek · the tongue */
  --type-tag:         var(--type-caption);     /* compartment tape · row caption · tab value */
  --type-group-title: var(--type-subheading);  /* the section heading */
}
```

## 2 · `assets/index.css` — the floor and the glyphs become tokens

```css
:root {
  /* THE A3 FLOOR, WRITTEN ONCE. It was spelled `2.75rem` at four sites (this file's coarse
     block, .icon-btn's two dimensions, .players-leave). W7 may raise it; it may NEVER resolve
     below 44px, and `e2e/mobile-scale.spec.ts` asserts exactly that with the token forced. */
  --tap-floor: 2.75rem;
  /* The drawn glyphs' three ranks, mirroring the type roles 1:1. The SVG `:size` props stay as
     the first-paint default and CSS overrides them — the estate's own precedent
     (`.action-verbs .icon-btn svg { width: 30px }` has done this since T6 mark 8). */
  --icon-act: 36px;
  --icon-verb: 30px;
  --icon-tool: 26px;
}

@media (pointer: coarse) {
  :root {
    --icon-act: 40px;
    --icon-verb: 34px;
    --icon-tool: 30px;
  }
}

@media (pointer: coarse) {
  .ctrl-btn,
  .mobile-heading-btn,
  .attribution-trigger,
  .error-note-retry { min-height: var(--tap-floor); }
  .ctrl-btn,
  .mobile-heading-btn { min-width: var(--tap-floor); }
}
```

## 3 · `SheetWashiLabel.vue` — the tag pins because it stopped straddling

```css
/* ── THE COMPARTMENT'S NAME PINS (T9-W2 §2.6, the owner's M03) ─────────────────────────────
   THE FINDING, and it is one sentence: a tape that hangs above its own border box cannot pin
   at a clip edge — THE STRADDLE IS THE CLIP. `translateY(-52%)` off an absolutely-positioned
   box put 52% of this tape outside the well it names, and the card is a scrollport: measured
   at 390×844 the `new game` tape sits 7.46px inside the card's top edge at rest and lands at
   y 191.46 against a card top of 216 after the card's own 32px of scroll — gone, while its
   group is still 200px on screen. That is the owner's Frame B, and it is also §2.3's "the
   card's own chrome never straddles its case edge". One geometry cures all three.
   So the tape joins the flow as the well's first child and sticks at the case's top edge. Its
   containing block is its own well, which is what makes it a SECTION header rather than a
   floating one: it pins while its group is in view and leaves WITH its group.
   The scroll case is `.controls-card` — the SAME element in both scrolling regimes (scene.css
   gives it `overflow-y:auto` at ≥1024 AND on the portrait dock), so this one rule is the
   desktop cure and the mobile cure at once, which is what M03 asks for by name.
   W7 owns how the tape meets the frame's drawn stroke; W2 owns only that it no longer hangs
   off its own box. */
.washi-tag {
  position: sticky;
  top: 0;
  bottom: auto;
  align-self: flex-start;
  margin: 0 0 0 0.85rem;
  padding: 0.02rem 0.4rem;
  font-size: var(--type-tag);
  font-weight: 500;
  letter-spacing: var(--type-tracking-wide);
  text-transform: lowercase;
  opacity: 1;
  /* The translateY leaves; the tilt stays. A sticky box may carry a transform — it is a paint
     offset on the sticky rect — but a translate ACROSS the clip edge paints outside it, which
     is the defect above. Rotation is in-plane and costs the rect nothing. */
  transform: rotate(var(--washi-tilt));
  /* Over the well's outline (1) and its rows; UNDER SheetWashiLabel's own hover tapes (50), so
     a `.zone-hint` still paints over the tag it hangs off; UNDER `.action-bar` (60), so the bar
     still occludes what scrolls behind it. The documented 50↔60 pair is not re-cut. */
  z-index: 3;
}
```

`GameControlPanel.vue` — the well's padding now pays for a flow child, and the focus band gets its second edge:

```css
.tray-well {
  /* was 0.55rem 0.5rem 0.35rem — the top term existed ONLY to clear the tape's 8.2px overhang
     (its own comment says so). The overhang is gone with the straddle, so the term goes with
     the reason for it. */
  padding: 0.15rem 0.5rem 0.35rem;
}
/* The hint hangs UNDER its tape; the tape is in flow now, so the offset is the tape's own
   line box rather than a spelled 1.1rem. */
.tray-well .zone-hint { top: calc(var(--type-tag) * 1.5 + 0.15rem); }
```

```ts
// ── T9-W2 §2.6 — THE SCROLLPORT CLEARS THE HEADER THAT STICKS TO ITS OTHER EDGE.
// The exact mirror of T7-W2's A1: `scroll-padding-bottom` lifts a focused control clear of the
// sticky bar; `scroll-padding-top` drops it clear of the sticky tape. Same publisher, same
// observer, same measured-never-spelled discipline — the tape's height is `--type-tag` times a
// line box plus its own padding, and a number written here would go stale the first time W7
// re-points the role.
useResizeObserver(firstTagEl, () => {
  const tag = firstTagEl.value;
  const card = tag?.closest<HTMLElement>(".controls-card");
  if (!tag || !card) return;
  card.style.setProperty("--tag-band", `${Math.ceil(tag.getBoundingClientRect().height)}px`);
});
```
```css
/* scene.css, on .controls-card, beside the existing scroll-padding-bottom */
scroll-padding-top: var(--tag-band, 0px);
```

## 4 · `OptionSelector.vue` — the option row rejoins the ladder

```diff
-        mobile
-          ? 'text-[1rem] md:text-[1.375rem]'
-          : 'text-[1.375rem] md:py-0.5 md:text-left md:text-[1.25rem]',
+        mobile ? '' : 'md:py-0.5 md:text-left',
```
```css
/* T9-W2 §2.6 — the chips' type was FOUR arbitrary Tailwind utilities in a template, invisible
   to the ladder and unreachable from any token: a 390 phone drew its option words at a spelled
   1rem while every other control on the card slid down the fluid rung. One role, one rule. */
.ctrl-btn { font-family: "Fira Code", monospace; font-size: var(--type-option); }
```
(`--type-option: var(--type-small)` joins the role block; `.section-heading` in typography.css takes `font-size: var(--type-group-title)`, `.icon-sublabel` → `--type-tool`, `.deal-btn .icon-sublabel` → `--type-act`, `.action-verbs .icon-sublabel` → `--type-verb`, `.zone-row-label` / `.heading-value` / `.player-row` → `--type-tag`, `.peek-chip-word` and `.drawer-tab-text` → `--type-tool`; `.icon-btn svg { width: var(--icon-tool); height: var(--icon-tool) }` with `.deal-btn svg` → `--icon-act` and `.action-verbs .icon-btn svg` → `--icon-verb`.)

## 5 · `GameBoard.vue` — the berth at the paper's own edge

```html
<!-- THE BOARD'S BOTTOM RAIL (T9-W2 §2.7, the owner's M10) — a zero-box berth AT THE PAPER'S OWN
     EDGE, and that is why it exists rather than an anchor on the peek host: `.board-shell`'s
     bottom is the STRIP's bottom, not the board's, so a host-anchored tongue would drift with
     the status line and jump the moment a SolverErrorNote arrives. Zero box by construction —
     the `#fold-tools` / `#drawer-handle` rule, verbatim: a berth with a box is a box every
     regime pays for. Layout-neutral: no border, no padding, no height, so `.board-margin`'s
     0.4rem top margin collapses through it and the column is byte-identical. -->
<div id="board-edge" class="board-edge" />
```
```css
.board-edge { position: relative; width: 100%; height: 0; }

/* THE TONGUE'S BAND IS THE STRIP'S BAND (T9-W2 §2.7). The tongue tucks 8px under the paper and
   protrudes 40 into the 49.19px the column already leaves below the board (measured at 390);
   the strip's one line owns 6.4→27.2 of it. They share the band and differ only in x, so the
   strip yields the tongue's column rather than the assembly spending 40px it does not have —
   headroom at 390×664 is 60.42px total and the type scale is already spending some of it.
   6.5rem = the tongue's 5.75rem berth + the 0.75rem of air the desk's own tuck spends. */
@media (max-width: 1023.98px) {
  .board-margin { margin-right: 6.5rem; }
}
```

## 6 · `DrawerTab.vue` — one law, three edges

```css
/* ── THE TONGUE HANGS OFF THE BOARD'S SLACK EDGE (T9-W2 §2.7, the owner's M10/M13) ─────────
   The desk's rule generalises rather than gets an exception: "the case rests tucked BEHIND the
   board's right edge, z-under the sheet" is the tongue hanging off the edge that faces the
   page's slack. A desk and a landscape phone are wide-and-short, so that edge is the RIGHT one;
   a portrait phone is narrow-and-tall, so it is the BOTTOM. The owner's "like on desktop (just
   not on the side)" is that same sentence read on the axis a portrait viewport gives.
   THE MOBILE PORTRAIT POSE — the bottom-RIGHT corner, and each of the four reasons is load-
   bearing: it is the desk's own far-corner reading quarter-turned; it leaves the board's
   bottom-left to the marginalia, which reads left-to-right; it lands under a thumb rather than
   under the OS home indicator; and it shares an x with `#drawer-handle`, so the sheet rises
   STRAIGHT OUT from under its own tongue with no lateral jump. */
@media (max-width: 1023.98px) and (orientation: portrait) {
  .drawer-tab {
    display: block;
    left: auto;
    right: 0;
    top: calc(100% - 0.5rem);     /* the 8px tuck, on the other axis */
    bottom: auto;
    z-index: -1;                  /* under the opaque paper — the desk's tuck fiction, kept */
    width: 5.75rem;               /* 92 × 48: the axes swap, both clear var(--tap-floor) */
    height: 3rem;
    min-height: var(--tap-floor);
    transform: none;
  }
  .drawer-tab-tongue { border-radius: 0 0 0.75rem 0.75rem; }
  .drawer-tab-text { writing-mode: horizontal-tb; padding: 0.15rem 0.5rem; font-size: var(--type-tool); }

  /* SHEET UP: the case's own corner, the shipped pose, unchanged. */
  html:not(.drawer-closed) .drawer-tab {
    top: auto;
    bottom: 100%;
    z-index: 1;
    border-radius: 0.75rem 0.75rem 0 0;
  }
}

/* THE SHORT-LANDSCAPE POSE IS THE DESK'S POSE (T9-W2 §2.2 + §2.7). Measured at HEAD: at
   844×390 and 812×375 the tab's box is 0×0, `#fold-tools` is 0×0, and the controls card sits
   767px below a fold the first screen gives no hint of. The board takes 366 of 844 and leaves
   ~239px of gutter each side (App.vue §M20's own figure) — the same wide-and-short cell the
   desk's tongue was designed for. So the desk's arm widens rather than a fourth pose being
   invented: same 48×92, same right edge, same tuck, same vertical washi. */
@media (min-width: 1024px),
       (max-width: 1023.98px) and (orientation: landscape) {
  .drawer-tab { display: block; }
}
```

## 7 · `GameScene.vue` / `useControlsDrawer.ts` — one ref widens, one berth swaps

```ts
/** THE DOCK IS EVERY MOBILE POSE NOW (T9-W2 §2.2). `portraitDock` survives beside it — the
 *  fold's ribbon and its play verbs stay portrait-only, because a 390-tall landscape has no
 *  band under the board to put them in — but the DRAWER is live wherever the rail is not, so
 *  the landscape rung stops being the one regime with no controls entry at all. */
export const mobileDock = computed(() => !rowRegime.value);
export const portraitDock = computed(() => mobileDock.value && portrait.value);
// drawerLive collapses to `true`; G3 ("portrait always lands closed") widens to mobileDock —
// an open sheet on a 390-tall landscape is the covered board the covis row exists to kill.
```
```ts
/** THE TONGUE'S TWO BERTHS ON MOBILE (T9-W2 §2.7): the board's own edge while the sheet is
 *  shut, the case's top-right corner while it is up — the SAME column, so the sheet rises out
 *  from under its own tongue. `null` disables the Teleport, which is the desk rendering it in
 *  place inside `.board-peek-host`, byte-untouched. */
const tongueBerth = computed(() =>
  !mobileDock.value ? null : drawerOpen.value ? "#drawer-handle" : "#board-edge",
);
```
```html
<Teleport defer :to="tongueBerth ?? '#drawer-handle'" :disabled="!tongueBerth">
  <DrawerTab ref="drawerTab" :expanded="drawerOpen" @toggle="toggleDrawer" />
</Teleport>
```

## 8 · `scene.css` — the landscape sheet, and the handle's inset re-derived

```css
/* THE LANDSCAPE DOCK (T9-W2 §2.2). The portrait sheet's mechanism, with its cap re-derived
   from LANDSCAPE's own chrome rather than inherited: portrait's 12rem is 9rem of masthead band
   + 3rem of handle riding proud, and in the landscape dock the masthead is out of flow in the
   left gutter (App.vue §M20), so there is no band above the board to clear — only the handle
   and the page's own 1rem gutter. 4rem, derived, not tuned. */
@media (max-width: 1023.98px) and (orientation: landscape) and (max-height: 500px) {
  .scene-controls {
    position: fixed;
    left: 0; right: 0; width: auto;
    top: var(--vv-height, 100dvh);
    max-height: calc(100dvh - 4rem);
    z-index: 60;
    display: flex; flex-direction: column; align-items: stretch;
    translate: 0 -100%;
    /* The notch's OTHER edges. The top inset is already in --head-rule; a full-width fixed
       sheet owes the side and bottom ones. `--card-pad-b` / `--action-bar-h` are measured off
       the card's computed padding, so the bar's skirt and the focus band absorb this for free. */
    padding-inline: env(safe-area-inset-left, 0px) env(safe-area-inset-right, 0px);
  }
  html.drawer-closed .scene-controls { translate: 0; }
  html.drawer-closed .drawer-case { visibility: hidden; }
  .controls-card {
    max-height: calc(100dvh - 5.5rem);   /* the cap less the outline outset + card padding */
    padding-bottom: env(safe-area-inset-bottom, 0px);
    overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin;
  }
  .drawer-case { width: 100%; }
  .drawer-handle { display: block; position: absolute; top: 0; right: 1rem; width: 0; height: 0; }
}

/* THE HANDLE COMES ONTO THE TONGUE'S COLUMN (T9-W2 §2.7). The `+ 1rem` was derived at
   820×1180 to keep the handle inside the FOLD BAND; the tongue is not in that band any more,
   so the reason for the inset retires with the pose that needed it. Dropped, the shut tongue
   (the board's bottom-right corner) and the risen handle share an x exactly — at 390,
   `--board-col` resolves to the board's own 366, so the two edges are one line. */
@media (max-width: 1023.98px) and (orientation: portrait) {
  .drawer-handle { right: calc((100vw - var(--board-col)) / 2); }
}
```

## probeImpact

Every baseline below is **my own measurement on the built dist** (chromium, 2× dpr, `hasTouch`+`isMobile`, preview on 127.0.0.1:4237, torn down). The V7 scripts stay the instruments of record; these are the cells this wave's four rows fire at.

**§2.6-A · the mobile type-scale census — RED at HEAD.**
*Red now:* at 390×844 coarse the census reads `.icon-sublabel` 12.179px (×4 in the ribbon), `.washi-tag` 12.179 (×4 wells), `.zone-row-label` 12.179 (×2), `.heading-value` 12.179, `.ctrl-btn` 16.000, `.section-heading` 20.352 — six distinct surfaces at or under the ladder's own minimum, on the one viewport where the ink is furthest from the eye.
*Green under the law:* the `(pointer: coarse)` band lifts `--type-caption` 12.179 → 14.000 at 390 and every role that reads it moves with it, in one recalc, with no site edit. The row asserts `computedStyle.fontSize ≥ TYPE_FLOOR_COARSE` over the union of `#fold-tools *`, `.controls-card .ctrl-btn`, `.washi-tag`, `.zone-row-label`, `.heading-value`, and `min(width,height) ≥ 44` over every `.icon-btn`/`.ctrl-btn` in the same pass — **read floor and tap floor in one census, which is the mark's own pairing.**
*Negative control, in-run:* `addStyleTag` re-declaring the four rungs at their non-coarse minimums; the census must red on ≥6 surfaces. Without it a census that has stopped finding its candidates passes vacuously (the filter-census file's own lesson).

**§2.6-B · the sticky-tag probe — RED at HEAD.**
*Red now, measured to the pixel:* card `scrollHeight 660 / clientHeight 628 / maxScroll 32` at 390×844 open; the `new game` tape's top is **223.46 against a card top of 216** at rest (7.46px of margin), and at `scrollTop = maxScroll` it is at **191.46 — 24.54px above the clip edge, `tagVisible false`** — while `wellStraddlesTop` is `true`, i.e. the group is still on screen with its name gone. That is the probe's red and it is also Frame B's photograph.
*Green under the law:* in flow at `position: sticky; top: 0`, the tape's rect is clamped to the scrollport's top edge and released only when its own well's bottom passes — so `tagTop ≥ cardTop` and `tagVisible` hold for **every** `scrollTop` in `[0, maxScroll]` while `wellStraddlesTop || wellInView`. Asserted at 390×844 (dock) **and 1440×900 (rail)**, because the scroll case is one element and M03 names both platforms.
*Negative control:* force `.washi-tag { position: absolute; transform: translateY(-52%) }` back and the same sweep must red at 32px of scroll.

**§2.7 · the edge-attachment probe (M10) — RED at HEAD.**
*Red now:* `boardBottom → drawerTab.top = **54.78px**` at 390×844, at 390×664, and at 572×720 fine-portrait — the last being Frame C/D's exact pose, where the ribbon holds the chip **alone** (`.play-controls` is coarse-gated, so the toolbar array is empty). Frame D measures that 54.78 and the owner drew a box around it.
*Green under the law:* the tongue is a child of `#board-edge` at `top: calc(100% - 0.5rem)`, so the assertion inverts to **`tongueTop - boardBottom ∈ [-8.5, -7.5]`** — attachment as a tuck, not as a gap — plus `contains(#board-edge, .drawer-tab)`, `tongue.right ≤ board.right + 0.5`, and `min(w,h) ≥ 44`, at **every mobile pose**: 390×844, 390×664, 844×390, 812×375, 572×720 fine.
*Negative control, and it is a neat inversion:* re-parent the tongue into `#fold-tools`, which is HEAD's shipped berth and today's *passing* covis lock — the new row must red at exactly 54.78. **The old lock's pass state is the new lock's control.**

**§2.2 · the short-landscape reachability probe — RED at HEAD.**
*Red now:* at 844×390 and 812×375 the tab's box is **0×0**, `#fold-tools` is **0×0**, `docScrollH` is **1157 / 1152** against an inner height of 390/375 (`maxScroll 767`), and the controls card's top is far below the fold. There is no cued path to deal/level at all — the charter's P0, confirmed.
*Green under the law:* the desk's arm widens to short landscape, so the tongue is painted at the board's right edge inside the first viewport (`tongue.top < innerHeight && tongue.bottom > 0`, `min(w,h) ≥ 44`), and **one tap** raises the sheet with `.deal-btn` and both section selectors on screen (`deal.bottom ≤ innerHeight`). The row is written as a gesture, not a geometry: read the first viewport, click the one visible drawer control, assert the deal verb is now in it.
*Rider (N1):* with the card fixed rather than in flow, `docScrollH` at 844×390 falls **1157 → ~409** and the status line's 19.19px is one flick rather than a 767px scroll context. Closing it to `maxScroll 0` costs either the board's ratified 40.67px cell (reserving the strip in the cap) or a re-home of the strip into the 229px left gutter — **both named, neither taken here**; the chair's call, and I recommend the gutter because it costs no cell.

**Count pins.** Two new spec files (`e2e/mobile-scale.spec.ts` — the M01 census + the M03 sticky rows; `e2e/board-edge-tab.spec.ts` — the M10 attachment + the §2.2 reachability rows), and one re-aim in `board-covisibility.spec.ts`. The doc gates and `gates.json` move in the same commit, per the wave's gate spine.

## risks

**1 · The covis ribbon lock must be re-aimed — a declared DELTA, not a break.** `e2e/board-covisibility.spec.ts` holds T6.2 mark A's three-arm lock: MEMBERSHIP (`#fold-tools` contains the opener), ONE LINE (its top within 1px of the first play verb's), IN BAND. §2.7 supersedes mark A's berth by the owner's own later word (M10, 2026-08-25 — "should be a tab on the bottom of the board"), so the three arms retire and §2.7's attachment row replaces them with the old berth as its negative control. **What must NOT move, and I measured that it does not:** `pageVh 1.000` / `maxScroll 0` at 390×664 survive because removing the tongue from the ribbon shrinks nothing — the row's height is `max(verbs 50.16, tongue 44 + 0.35rem)` = 50.16 either way — and `verbsInFold ≥ 4` still holds on undo·redo·hint·peek. `offCentre ≤ 6%` is untouched (the tongue is out of flow).

**2 · The tape joining the flow grows every well by its own line box (~19–20px × 4 ≈ 80px).** The card scrolls, so this is height the fold absorbs: `scrollHeight 660 → ~740` against `clientHeight 628`, i.e. `maxScroll 32 → ~112`. §2.3 owes that fold a designed affordance in this same wave, so the two cures must land together or the card gets more hidden content with the same weak cue. **The desk risk is the one to check first:** the rail is shrink-to-fit and its max-content sizes the board's position (`card 330 / boardLeft 191`, the `cell-light` golden's own dependency). An in-flow tape contributes to max-content *width* where an absolute one did not — but the widest tape is `new game` at 57.77px against a 330px rail set by `KeyboardLegend`'s two-column grid, so it cannot bind. Verify with a rail-width read before/after; if it ever moves, the golden re-mints and that is a hard stop.

**3 · The straddle is a designed idiom being retired.** `.washi-tag`'s astride pose is documented as "the one asymmetry in a card of centred stanzas, and the thing that makes a well read as a labelled compartment rather than a second card." The tilt, the torn ends, the 0.85rem left inset and the lower-case hand all survive; what changes is ~10px of vertical offset. W7 owns the controls system re-cut under the fired B6 scope and should rule on how the tape meets the drawn stroke. If W7 wants the straddle back, it costs the pin — they are geometrically exclusive at a clip edge, which is the finding, and the honest fallback is a *pinned* pose distinct from the *resting* pose (astride at rest, flush when stuck), which is two looks for one object and I do not recommend it.

**4 · Extending the dock to short landscape moves a RATIFIED rung.** T5-W4's charter (c) ratified the landscape card's in-flow presentation (`pageVh 2.882`, geometry-identical to the deleted `.mobile-board-width` twin), and `useControlsDrawer`'s header says a width-only rule would move it. This proposal moves it deliberately: §2.2 rules that presentation a P0 (every game control unreachable, no cue, `docScrollH 1157`), so the ratification is superseded **by the wave, on the owner's marks**, not by taste. If the chair declines, the fallback keeps the landscape card in flow and the tongue becomes a scroll-to affordance — one control with two behaviours, which I judge worse, and which leaves §2.2 cured only in the letter.

**5 · `(pointer: coarse)` also catches a coarse iPad in the ROW regime.** That is deliberate and consistent (the estate already gives that surface the sublabels, the play-tools row and the 44px floors on this same key), and the clamp ceilings are unchanged so the delta at 1024 is +1.92px on caption. But it means the desk-width iPad's card grows a little; if the chair wants the scale phone-only, the band takes `and (max-width: 1023.98px)` at the cost of the tap-floor/read-floor unity.

**6 · The tongue's tuck depends on a stacking-context fact.** `z-index: -1` reads correctly only because `.board-wrapper` makes a stacking context (`will-change: transform`) and `#board-edge`/`.board-shell`/`.board-peek-host` do not below 1024. Anything that later gives `.board-peek-host` a `z-index` at `<1024` — or gives `#board-edge` one — flips the tongue over the paper. Write the dependency at both ends, the estate's pair idiom.

**7 · The strip's `margin-right: 6.5rem` can push a long note to two lines** at 390 (286px of remaining width against ~250px for the m01 exemplar). Mitigated by the M16 plain-copy law, but a long conflict sentence from W1 would spend ~21px of a 60.42px headroom at 390×664. Worth one probe row on the tallest live note.

**8 · Untouched by construction, and each should be asserted rather than assumed:** the filter census (9 — `HandDrawnOutline` mints no live filter, and nothing is added or removed); the four goldens (all desk-cell, element-anchored on the board/wordmark/toggle; `(pointer: coarse)` does not match a Playwright desktop context); the ≥1024 drawer glide, its WAAPI movers and `drawer.spec.ts`'s ≤6px case-drift bound; the ≤400 open-tongue masthead-collision rule, which still governs the risen pose; PRM, since nothing new is animated and a pin transition is refused outright.

## files (as proposed)

- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/assets/typography.css
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/assets/index.css
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/sheet/SheetWashiLabel.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/chrome/OptionSelector/OptionSelector.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/games/shared/GameControlPanel.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/games/shared/DrawerTab.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/games/shared/GameBoard.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/games/shared/GameScene.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/games/shared/useControlsDrawer.ts
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/games/shared/scene.css
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/e2e/board-covisibility.spec.ts
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/e2e/mobile-scale.spec.ts
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/e2e/board-edge-tab.spec.ts
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/gates.json
