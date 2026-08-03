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
 * On the PORTRAIT DOCK (T5-W4 pass 6) the scene teleports this same instance into
 * `#drawer-handle` on the case itself, and the pose axis-swaps to 92×48 (styles below). ONE
 * component, one drawn word, one `aria-expanded`/`aria-controls` pair — a second tab would be
 * a second control claiming the same region. Landscape below 1024 keeps `display: none`: that
 * rung has no drawer, as shipped.
 *
 * T6.2 mark A — ON THE DOCK IT HAS TWO POSES, and `html.drawer-closed` is the whole switch.
 * SHUT it is a PEER VERB in the fold's ribbon: in flow, last in the row, wearing the play
 * verbs' own box (the `.icon-btn` 44px floor). UP it is the case's handle at the risen corner,
 * exactly as shipped. The scene moves the one instance between the two berths on the same
 * state, so no rule here needs to know which parent it woke up in.
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
  transform: translateY(-50%);
}

@media (min-width: 1024px) {
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

/* ── THE PORTRAIT DOCK'S TONGUE (T5-W4 pass 6) — the same tab, axis-swapped ──────────────
   Same component, same drawn word, same ARIA pair; what changes is the axis, because the case
   it belongs to now slides UP instead of sideways. It is teleported into `#drawer-handle`
   inside `#controls-drawer` — it rides the CASE, not the board — so `bottom: 100%` puts it
   immediately above the case's top edge: closed (case below the screen's bottom edge) that is
   48px poking up from under the fold; open it is the handle at the case's top-right corner.

   Positive `z-index` here, where the desk's tongue paints at `-1`: on the desk the tongue
   tucks UNDER the board's opaque paper, which is the tuck's whole fiction; on the dock there
   is no paper above it and a negative layer would put the one control that opens the drawer
   behind the page. Portrait-scoped so the desk's `-1` is untouched. */
@media (max-width: 1023.98px) and (orientation: portrait) {
  .drawer-tab {
    display: block;
    left: auto;
    right: 0;
    top: auto;
    bottom: 100%;
    z-index: 1;
    width: 5.75rem; /* 92px — the axes swap, the 44px floor is cleared on both */
    height: 3rem; /* 48px */
    transform: none;
  }

  .drawer-tab-tongue {
    border-radius: 0.75rem 0.75rem 0 0;
  }

  /* The washi label turns with the tongue — horizontal down a horizontal tab. */
  .drawer-tab-text {
    writing-mode: horizontal-tb;
    padding: 0.15rem 0.5rem;
  }

  /* THE RIBBON POSE (T6.2 mark A) — shut, the opener is a verb among verbs. Out of the case's
     positioning entirely and into the fold's flow row: `order` puts it after the four the panel
     teleports in (nothing else in the row sets one, so 1 is last), the box is `.icon-btn`'s own
     44px floor, and the 0.35rem crown matches `.play-controls`' own top margin so the five
     tops sit on ONE line — which is the shape `board-covisibility.spec.ts` now locks. */
  html.drawer-closed .drawer-tab {
    position: static;
    order: 1;
    width: auto;
    height: auto;
    min-width: 2.75rem;
    min-height: 2.75rem;
    margin-top: 0.35rem;
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
