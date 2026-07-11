<script setup lang="ts">
/**
 * The drawer's pull-tab (T3-W12 §6) — the tongue of the pencil case tucked under the
 * worksheet. A paper tab at the board's right edge, HandDrawnOutline-framed, with a
 * vertical washi label ("controls") that is persistent — the W11 UI-4/5 affordance
 * grammar inherited, not reinvented (a tab is furniture, its name stays on it).
 *
 * Lives INSIDE `.board-peek-host` (so it rides the board's glide transform and stays
 * outside `.board-wrapper`'s containment/promotion — §2 P2), painted at negative z
 * within the host's stacking context: under the board's opaque paper, over the case.
 * ≥1024 only (display:none below — the stacked regime has no drawer). 48×92px ≥ the
 * 44px floor. `aria-expanded` rides the shared intent ref (truthful at click);
 * `aria-controls` names the rail.
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

/* During the glide the host scales; the tongue counter-scales on the same spring so
   its 48px never pops at the settle's layout step (product ≈ 1 throughout). */
html.drawer-gesturing .drawer-tab {
    transform: translateY(-50%) scale(calc(1 / var(--drawer-glide-scale, 1)));
    transition: transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1);
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

@media (prefers-reduced-motion: reduce) {
    html.drawer-gesturing .drawer-tab {
        transition: none;
        transform: translateY(-50%);
    }
}

@media print {
    .drawer-tab {
        display: none !important;
    }
}
</style>
