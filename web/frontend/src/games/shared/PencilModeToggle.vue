<script setup lang="ts">
/**
 * Pencil-marks mode toggle (T4-W8 ROW 1) — the single control that arms user pencil marks and
 * picks the placement slot: Normal (a digit is a value, the frozen T4-WM native entry) / Corner
 * / Center (Snyder notation). Game-agnostic chrome: it owns no domain state, just relays the
 * mode, so both games mount the identical component (`update:mode` is a v-model seam). It rides
 * the app's own segmented-control primitive (OptionSelector) so the scribble-underline grammar
 * matches Size/Difficulty exactly — one grammar, not a second look.
 */
import OptionSelector from "@pencil/chrome/OptionSelector/OptionSelector.vue";
import type { PencilMode } from "./useUserMarks";

defineProps<{ mode: PencilMode; mobile?: boolean }>();
const emit = defineEmits<{ (e: "update:mode", value: PencilMode): void }>();

const MODE_OPTIONS: { value: PencilMode; label: string }[] = [
  { value: "off", label: "Normal" },
  { value: "corner", label: "Corner" },
  { value: "center", label: "Center" },
];

function onChange(v: string | number) {
  emit("update:mode", v as PencilMode);
}
</script>

<template>
  <div
    class="pencil-mode-toggle flex flex-col items-center gap-1 md:items-stretch"
    role="group"
    aria-label="Pencil marks mode"
  >
    <h2 class="section-heading text-muted-foreground" aria-label="Pencil marks">
      Marks
    </h2>
    <OptionSelector
      :options="MODE_OPTIONS"
      :selected="mode"
      :boil-frame="0"
      :mobile="mobile"
      @change="onChange"
    />
  </div>
</template>
