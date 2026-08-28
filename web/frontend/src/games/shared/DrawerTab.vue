<script setup lang="ts">
/**
 * The drawer's pull-tab (T3-W12 §6) — the tongue of the pencil case tucked under the
 * worksheet. A paper tab at the board's right edge, HandDrawnOutline-framed, with a
 * vertical washi label ("controls") that is persistent — the W11 UI-4/5 affordance
 * grammar inherited, not reinvented (a tab is furniture, its name stays on it).
 *
 * On the DESK (≥1024) it lives INSIDE `.board-peek-host` — so it rides the board's glide
 * transform and stays outside `.board-wrapper`'s containment/promotion (§2 P2) — painted at
 * negative z within the host's stacking context: under the board's opaque paper, over the
 * case. 48×92px ≥ the 44px floor.
 *
 * ── T9-W2 §2.7 — ONE LAW, THREE EDGES (the owner's M10, 2026-08-25) ─────────────────────────
 * "The controls button on mobile should be a tab on the bottom of the board, like on desktop
 * (just not on the side)." Stated as a law rather than as a third exception: THE TONGUE TUCKS
 * UNDER THE BOARD'S PAPER ON THE EDGE THAT FACES THE PAGE'S SLACK. A desk and a landscape phone
 * are wide-and-short cells, so that edge is the RIGHT one; a portrait phone is narrow-and-tall,
 * so it is the BOTTOM. The owner's "just not on the side" is that one sentence read on the axis
 * a portrait viewport gives, which is why the desk's rule generalises instead of being fenced.
 *   · DESK ≥1024 — right flank, vertically centred, 48×92. BYTE-UNTOUCHED.
 *   · <1024 LANDSCAPE, shut — the same pose, the same berth (`.board-peek-host`), the same
 *     declarations: the desk's arm simply widens. That is also §2.2's cure, and it costs no new
 *     control and no new geometry.
 *   · <1024 PORTRAIT, shut — the board's bottom-RIGHT corner, 92×48, the axes swapped. Right
 *     rather than centred, and each reason is load-bearing: it is the desk's own far corner
 *     quarter-turned; it leaves the board's bottom-left to the marginalia, which reads
 *     left-to-right; it lands under a thumb instead of under the OS home indicator; and it
 *     shares an x with `#drawer-handle`, so the sheet rises straight out from under its own
 *     tongue with no lateral jump.
 *   · <1024 EITHER, sheet UP — the case's own top-right corner, 92×48. The risen sheet is
 *     full-width and covers the board whole, so this is the one state where the tongue must
 *     leave the board or the drawer cannot be shut.
 * The scene moves the ONE instance between those berths on the same state, so no rule here
 * needs to know which parent it woke up in. One component, one drawn word, one
 * `aria-expanded`/`aria-controls` pair — a second tab would be a second control claiming the
 * same region.
 *
 * DECLARED DELTA: T6.2 mark A's shut pose — the tongue as a PEER VERB inside the fold's ribbon
 * — is retired by the owner's own later word. It is what `board-covisibility.spec.ts`'s
 * three-arm lock read, and that lock is re-aimed in the same commit.
 */
import { ref } from "vue";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";

defineProps<{ expanded: boolean }>();
defineEmits<{ (e: "toggle"): void }>();

const btn = ref<HTMLButtonElement | null>(null);
defineExpose({
  /** The button element — the composable's focus home on close. */
  el: btn,
  focus: () => btn.value?.focus({ preventScroll: true }),
});
</script>

<template>
  <button
    ref="btn"
    type="button"
    class="drawer-tab"
    :aria-expanded="expanded"
    aria-controls="controls-drawer"
    @click.stop="$emit('toggle')"
  >
    <HandDrawnOutline :stroke-width="2.5" :outset="3">
      <span class="drawer-tab-tongue">
        <span class="drawer-tab-text">controls</span>
      </span>
    </HandDrawnOutline>
  </button>
</template>

<style scoped>
/* ≥1024 only — the regime rule. Below, the stacked panel is the controls' home and
   the drawer (tab included) is a defined no-op. */
.drawer-tab {
  display: none;
  position: absolute;
  /* The tongue pokes out from UNDER the sheet: its left ~8px tuck beneath the
       board's edge (negative z paints it below the opaque paper). */
  left: calc(100% - 0.5rem);
  top: 50%;
  z-index: -1;
  width: 3rem; /* 48px ≥ the 44px floor */
  height: 5.75rem; /* 92px */
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  color: var(--color-foreground);
  cursor: pointer;
  /* THE CONTROL TAKES ITS EVENTS BACK (T9-W2 §2.7). Below 1024 the board's shell passes
     pointers through — it has to, or its own border box hit-tests over this tongue's negative
     layer (`GameBoard`, the pair's other end) — and `pointer-events` INHERITS, so a tongue
     berthed inside that shell would inherit the pass-through and answer nothing. This is the
     estate's standing shape for the idiom, not a patch: the container passes events through,
     the control takes them back (`.board-margin` / SolverErrorNote, AttributionCard's closed
     card, the celestial's keep). Unconditional, because it is inert wherever no ancestor is
     passing through. */
  pointer-events: auto;
  transform: translateY(-50%);
}

/* THE DESK'S ARM WIDENS TO SHORT LANDSCAPE (T9-W2 §2.2 + §2.7), rather than a fourth pose
   being invented. Measured at HEAD: at 844×390 and 812×375 this box is 0×0, `#fold-tools` is
   0×0, `#drawer-handle` is 0×0, and the controls card sits 767px below a fold whose first
   screen gives no hint of it. The board takes 366 of 844 and leaves ~239px of dead gutter each
   side (App.vue's §M20 measurement) — the same wide-and-short cell the desk's tongue was drawn
   for. So: same 48×92, same right flank, same 8px tuck, same vertical washi, same berth. */
@media (min-width: 1024px), (max-width: 1023.98px) and (orientation: landscape) {
  .drawer-tab {
    display: block;
  }
}

.drawer-tab :deep(.outline-container) {
  width: 100%;
  height: 100%;
}

.drawer-tab-tongue {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--color-card);
  border-radius: 0 0.75rem 0.75rem 0;
}

/* The washi label — persistent (coarse AND fine: a tab's name is on the tab),
   vertical down the tongue, the hand, a seed-stable tilt. */
.drawer-tab-text {
  writing-mode: vertical-rl;
  font-family: var(--font-hand);
  font-size: var(--type-small);
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--color-foreground);
  background: var(--sheet-washi-neutral);
  padding: 0.5rem 0.15rem;
  clip-path: polygon(4% 2%, 96% 0%, 100% 50%, 97% 94%, 5% 100%, 0% 52%);
  transform: rotate(1.4deg);
  transition: transform 150ms ease-out;
}

.drawer-tab:hover .drawer-tab-text {
  transform: rotate(0deg);
}

.drawer-tab:focus-visible {
  outline: 2px dashed currentColor;
  outline-offset: 3px;
}

/* ── THE PORTRAIT DOCK'S SHUT TONGUE — THE BOARD'S BOTTOM-RIGHT CORNER (T9-W2 §2.7) ────────
   The desk's declarations, quarter-turned: `left: calc(100% - 0.5rem)` becomes
   `top: calc(100% - 0.5rem)`, and the 48×92 box becomes 92×48. The berth is `#board-edge`
   (`GameBoard`), a zero-box at the paper's own bottom edge whose `width: 100%` is the paper's
   width — so `right: 0` is the paper's right edge and `top: calc(100% - 0.5rem)` is 8px above
   its bottom one. 40px of the tongue protrudes; 8px is the tuck.
   MEASURED, BOTH ENGINES, AT HEAD: the chip this replaces stood 54.8px below the paper at
   390×844, 375×812 AND 430×932 — the same number at all three, so the gap was structural. The
   probe now reads −8.
   `z-index: -1` is the desk's own tuck fiction, and it resolves because `scene.css` makes
   `.board-peek-host` a stacking context below 1024 (noted at both ends): the tongue paints
   above the host's transparent ground and below `.board-wrapper`, which is promoted and
   therefore a positioned-equivalent layer above it. WITHOUT that context the negative layer
   escapes to the page and the tongue disappears behind it — which is exactly what pass 6's
   comment here recorded when it chose a positive z for the risen pose. */
@media (max-width: 1023.98px) and (orientation: portrait) {
  .drawer-tab {
    display: block;
    left: auto;
    right: 0;
    top: calc(100% - 0.5rem); /* the 8px tuck, on the other axis */
    bottom: auto;
    z-index: -1;
    width: 5.75rem; /* 92px — the axes swap, the 44px floor is cleared on both */
    height: 3rem; /* 48px */
    min-width: var(--tap-floor, 2.75rem);
    min-height: var(--tap-floor, 2.75rem);
    transform: none;
  }

  .drawer-tab-tongue {
    border-radius: 0 0 0.75rem 0.75rem;
  }
}

/* ── THE RISEN HANDLE — EITHER ORIENTATION, ONE POSE (T5-W4 pass 6, widened T9-W2 §2.2) ────
   Teleported into `#drawer-handle` inside `#controls-drawer`, so it rides the CASE and not the
   board: `bottom: 100%` puts it immediately above the case's top edge, which is the 48px of
   handle riding proud of the risen corner. This is the ONE state where the tongue must leave
   the board — a full-width sheet covers it — and it is the reason the cap in `scene.css`
   reserves 3rem for a handle in both orientations.
   Positive `z-index`, where both shut poses paint at `-1`: here there is no paper above the
   tongue and a negative layer would put the one control that shuts the drawer behind the page.
   Width-only key, because the pose is the same in portrait and landscape and a rule written
   twice is a rule that drifts. Specificity (0,2,1) beats both shut poses (0,1,0) whatever the
   source order, and the ≤400 block below beats THIS one on source order alone — the estate's
   own ladder, unchanged. */
@media (max-width: 1023.98px) {
  html:not(.drawer-closed) .drawer-tab {
    display: block;
    left: auto;
    right: 0;
    top: auto;
    bottom: 100%;
    z-index: 1;
    width: 5.75rem; /* 92px */
    height: 3rem; /* 48px */
    transform: none;
  }

  html:not(.drawer-closed) .drawer-tab-tongue {
    border-radius: 0.75rem 0.75rem 0 0;
  }

  /* The washi label turns with the tongue — horizontal down a horizontal tab. */
  html:not(.drawer-closed) .drawer-tab-text {
    writing-mode: horizontal-tb;
    padding: 0.15rem 0.5rem;
  }
}

/* The shut portrait tongue turns its label too. Declared apart from the box above so the two
   orientations' shut poses each say only what differs from the desk's. */
@media (max-width: 1023.98px) and (orientation: portrait) {
  html.drawer-closed .drawer-tab-text {
    writing-mode: horizontal-tb;
    padding: 0.15rem 0.5rem;
  }
}

/* ── THE ≤400 DOCK (T7-W7) ───────────────────────────────────────────────────────────────
   Sheet UP at 390×844, the tongue lay across the wordmark's last letter and its caret — "sudok"
   — in both engines. The arithmetic leaves no room to argue with: the tongue's band is the 48px
   above the risen case, the masthead's measured box spends 58.7 → 331.3 of the 390 in exactly
   that band, and a 92-wide tongue at the column's inset starts at 270. The strip the masthead
   does NOT occupy is 58.7px, and the pose that fits it is one this component already owns — the
   DESK's vertical tongue — turned back onto the page's own right edge. 44×92: the tap floor on
   the axis the strip constrains, cleared twice over on the other, so W2's A5 reading holds.
   Measured after: clear by 10.1px at 390 and 2.6px at 375, both engines. 430 and up never
   collided and are not in this query.
   SHEET-OPEN ONLY. Shut, the tongue hangs off the board's own bottom-right corner (T9-W2 §2.7
   above) and keeps that 92×48 box to the pixel — `board-covisibility`'s attachment lock reads
   it there, tucked 6px under the paper.
   The right anchor leaves the COLUMN on purpose. The berth (`scene.css .drawer-handle`) insets
   to the column's right edge, and at this rung that inset IS the collision, so it is subtracted
   back out: the one place where the page's edge, not the column's, is the correct one to hang a
   tongue from. 0.25rem of air is left so the drawn outline's outset stays inside the viewport
   and mints no horizontal scroll.
   RE-DERIVED AT T9-W2 §2.7, because the berth's own inset changed under it. The identity this
   rule holds is `tongueRight = viewportRight − 4px`, and the berth's containing block is a
   zero-box at `viewportRight − berthInset`, so the term is `4px − berthInset`. Head:
   berthInset = (100vw − col)/2 + 1rem, giving −0.75rem − (100vw − col)/2. Now the berth lost
   its 1rem (it sits ON the column's right edge, so the shut tongue and the risen handle share
   an x), so the term is 0.25rem − (100vw − col)/2. Both resolve to −24 and −8 against a berth
   at 28 and 12 — the SAME 4px of air, the same measured clearance the T7-W7 cure banked
   (10.1px at 390, 2.6px at 375, both engines). Re-cut the berth and re-cut this. */
@media (max-width: 25rem) and (orientation: portrait) {
  html:not(.drawer-closed) .drawer-tab {
    width: 2.75rem; /* 44px — the floor, on the axis the masthead's strip constrains */
    height: 5.75rem; /* 92px */
    right: calc(0.25rem - (100vw - var(--board-col)) / 2);
  }

  /* The label turns with the tongue, back to the desk's axis. */
  html:not(.drawer-closed) .drawer-tab-text {
    writing-mode: vertical-rl;
    padding: 0.5rem 0.15rem;
  }
}

/* During the glide the host scales; the tongue counter-scales as the composable's
   fourth WAAPI mover (same glass curve, same clock — W13 §3-S3′), so its 48px never
   pops at the onset's layout step (product ≈ 1 throughout). No CSS transition here:
   the old spring-transition rule died with the audit-4 ruling — it computed identity
   (nothing writes --drawer-glide-scale since the WAAPI recut) yet still started a
   live spring-eased transition on every gesture, a second curve on the one clock. */

@media print {
  .drawer-tab {
    display: none !important;
  }
}
</style>
