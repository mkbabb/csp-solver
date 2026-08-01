<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
import { ghostUnderline, scribbleUnderline } from "./scribbleUnderline";

const { isDark } = useTheme();

defineProps<{
  options: { value: string | number; label: string; colorClass?: string }[];
  selected: string | number;
  boilFrame: number;
  mobile?: boolean;
}>();

const emit = defineEmits<{
  (e: "change", value: string | number): void;
}>();

/* SELECTION IS ANNOUNCED (T4-P1). These are plain <button>s and the selected one was marked
 * to sighted users alone — bold, its own crayon tone, a scribble underline — while assistive
 * tech heard eight identical unlabelled buttons per card and no state at all. `aria-pressed`
 * on every option is the whole cure: one attribute, no roving tabindex, no keyboard contract
 * to invent. It is deliberately NOT `role="radio"` — that announces arrow-key navigation this
 * control does not implement, which is the failure mode pass 1 shipped and pass 2's G11 could
 * only assert the absence of. Every click emits (a same-value re-tap re-arms the on-demand
 * check), so a toggle-button reading is also the honest one. */

function inkColor() {
  return isDark.value ? "#ffffff" : "#1a1a1a";
}

function scribbleSeed(val: string | number): number {
  return typeof val === "number" ? val : val.charCodeAt(0);
}
</script>

<template>
  <div
    class="ctrl-options"
    :class="
      mobile
        ? 'options-row'
        : options.length === 2
          ? 'options-pair'
          : 'flex flex-col items-center md:items-stretch'
    "
  >
    <button
      v-for="opt in options"
      :key="opt.value"
      @click="emit('change', opt.value)"
      :aria-pressed="selected === opt.value"
      class="ctrl-btn rounded-md px-3 py-1.5 text-center transition-colors duration-150"
      :class="[
        mobile
          ? 'text-[1rem] md:text-[1.375rem]'
          : 'text-[1.375rem] md:py-0.5 md:text-left md:text-[1.25rem]',
        selected === opt.value
          ? `selected-item font-bold ${opt.colorClass ?? 'text-foreground'}`
          : 'text-muted-foreground hover:text-foreground hover-item',
      ]"
      :style="
        selected === opt.value
          ? {
              '--scribble-underline': scribbleUnderline(
                scribbleSeed(opt.value) + boilFrame * 1000,
                inkColor(),
              ),
              '--scribble-width': `${opt.label.length + 1}ch`,
            }
          : {
              '--ghost-underline': ghostUnderline(
                scribbleSeed(opt.value) + 500,
                inkColor(),
              ),
              '--ghost-width': `${opt.label.length + 1}ch`,
            }
      "
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.ctrl-btn {
  font-family: "Fira Code", monospace;
}

/* The `.ctrl-btn:hover` wobble is DELETED (P1-W3, r3 §3.2), and `transition-all` narrowed to
   `transition-colors` in the template. `all` included `filter`, so a hover edge repainted a
   reference-filtered HTML box through every frame of the colour tween. The option's real hover
   affordance is its ink shift plus the ghost underline below — both kept. */

.selected-item,
.hover-item {
  text-decoration: none;
  background-repeat: no-repeat;
  background-origin: content-box;
  background-position: left bottom;
  padding-bottom: 6px;
}

.selected-item {
  background-image: var(--scribble-underline);
  background-size: var(--scribble-width, 4ch) 8px;
}

.hover-item {
  background-image: none;
  background-size: var(--ghost-width, 4ch) 8px;
}

/* The ghost underline is a hover preview — gated so it neither appears nor sticks on
   touch (T4-WM §2); the selected option's real scribble underline is unconditional. */
@media (hover: hover) {
  .hover-item:hover {
    background-image: var(--ghost-underline);
  }
}

/* CHIP SEPARATION (T4-P1, F1 order 1) — ONE declaration, both axes.
   Neighbouring chips are neighbouring TAP TARGETS and neighbouring WORDS, and they had
   neither seam: the coarse row sat at 4px (`gap: 0.25rem`) and the column at **0** — two
   44px coarse targets sharing an edge, with nothing an eye or a thumb can find between them.
   0.45rem (7.2px) clears the ≥6px floor everywhere with the same number. The chip's own
   `padding-bottom: 6px` is NOT separation and never was — it is the scribble underline's
   room, inside the box; the seam has to be outside it.
   Gated: `e2e/visual-regression.spec.ts` — "option chips keep their separation", every
   group, both axes, with an injected zero-gap negative control. */
.ctrl-options {
  gap: 0.45rem;
}

.options-row {
  display: flex;
  justify-content: center;
  padding: 0.25rem 0;
}

/* A BINARY IS A PAIR, NOT A STACK (T4-P1, stage BC — the price reconciliation).
   The rail is a 165px column and every option in it is a full-width chip on its own line. A
   two-option group read as two more entries in a list of fourteen; it is one control with two
   states, and the phone's row branch has always drawn it that way — the rail was the outlier.
   Split, the pair costs ONE chip-height instead of two plus a seam (95.19 → 44.00 at
   1280×800-coarse, 83.19 → 38.00 at the fine rail), which is where a third of B's column price
   is repaid without touching the seam or the 44px coarse floor: each half is 78.96 × 44, wider
   than the 60.02/48.02 the two words need and wider than the stacked chip it replaces on the
   only axis a thumb was short of.
   The rule is the DATA's, not the control's — `options.length === 2` — so no caller learns a
   flag and any future binary inherits it. Estate-wide there is exactly one today (candidates
   Off/On); every game's size and difficulty axis carries 3–4. */
.options-pair {
  display: flex;
}

.options-pair > .ctrl-btn {
  flex: 1 1 0;
}
</style>
