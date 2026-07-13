<script setup lang="ts">
/**
 * Board-assist settings (T4-W8 ROW 2 + ROW 3) — the two check preferences beside the Marks
 * toggle: the error-check MODE (Off / Ask / Live) and the persistent-candidates toggle (Off / On).
 * Game-agnostic chrome: it owns no domain state, just relays the two settings (`update:*` v-model
 * seams), so both games mount the identical component. It rides the app's own segmented-control
 * primitive (OptionSelector) so the scribble-underline grammar matches Size / Difficulty / Marks
 * exactly — one grammar, not a second look.
 *
 * "Ask" is the on-demand check: OptionSelector emits on every click (not only a value change), so
 * re-tapping Ask re-arms a fresh point-in-time snapshot — the on-demand trigger needs no separate
 * button. "Live" is the as-you-go continuous check; "Off" trains you (the Solve grade still grades).
 */
import OptionSelector from "@pencil/chrome/OptionSelector/OptionSelector.vue";
import type { ErrorCheckMode } from "./useAssists";

defineProps<{
  errorCheckMode: ErrorCheckMode;
  candidatesPinned: boolean;
  mobile?: boolean;
}>();
const emit = defineEmits<{
  (e: "update:errorCheckMode", value: ErrorCheckMode): void;
  (e: "update:candidatesPinned", value: boolean): void;
}>();

const CHECK_OPTIONS: { value: ErrorCheckMode; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "on-demand", label: "Ask" },
  { value: "live", label: "Live" },
];
const CANDIDATE_OPTIONS = [
  { value: "off", label: "Off" },
  { value: "on", label: "On" },
];

function onCheckChange(v: string | number) {
  emit("update:errorCheckMode", v as ErrorCheckMode);
}
function onCandidatesChange(v: string | number) {
  emit("update:candidatesPinned", v === "on");
}
</script>

<template>
  <div
    class="assist-settings flex flex-col gap-2"
    role="group"
    aria-label="Board assists"
  >
    <!-- Error-check mode (ROW 2): Off (train yourself) / Ask (check-anytime) / Live (as-you-go).
         Re-tapping Ask re-checks — OptionSelector emits on every click, so the on-demand snapshot
         needs no separate trigger. Default Ask, never a mistake-counter (§B3 design law). -->
    <div class="flex flex-col items-center gap-1 md:items-stretch">
      <h2 class="section-heading text-muted-foreground" aria-label="Check for errors">
        Check
      </h2>
      <OptionSelector
        :options="CHECK_OPTIONS"
        :selected="errorCheckMode"
        :boil-frame="0"
        :mobile="mobile"
        @change="onCheckChange"
      />
    </div>

    <!-- Persistent auto-candidates (ROW 3): the engine's surviving domains, un-gated from the
         held-peek behind a persistent, opt-in toggle. Default Off (the NYT clutter lesson). -->
    <div class="flex flex-col items-center gap-1 md:items-stretch">
      <h2
        class="section-heading text-muted-foreground"
        aria-label="Show candidate marks"
      >
        Candidates
      </h2>
      <OptionSelector
        :options="CANDIDATE_OPTIONS"
        :selected="candidatesPinned ? 'on' : 'off'"
        :boil-frame="0"
        :mobile="mobile"
        @change="onCandidatesChange"
      />
    </div>
  </div>
</template>
