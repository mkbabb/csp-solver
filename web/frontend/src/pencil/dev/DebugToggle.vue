<script setup lang="ts">
// T6 mark 16's disclosure row, DEV-ONLY — the toggle that flips the hidden debug flag every
// telemetry surface reads (the solve tally, the prewarm smoke lines).
//
// WHY IT LIVES HERE AND NOT IN THE CARD. The live pass of 2026-08-04 found this row on the
// PRODUCTION site, under the project link, reading "debug · off": dev furniture on a visitor's
// surface, and its label breaks the copy register outright (M16 bans the middot). Rewording it
// would have kept dev chrome on the product; hiding it at runtime would have kept the string
// in the shipped bundle. So the row moved to `src/pencil/dev/`, the estate's fence for exactly
// this, and `AttributionCard.vue` reaches it through an `import.meta.env.DEV` ternary — the
// same seam App.vue uses for FilterTuner and main.ts for the rAF probe. That ternary folds at
// build time, the dynamic import goes with it, and this component's chunk is never emitted:
// the row is ABSENT FROM DIST rather than merely unrendered. Measured, not assumed — a
// production build's assets carry no `debug ·` at all.
import { useDebug } from "@/composables/useDebug";

const debug = useDebug();
</script>

<template>
  <!-- `@click.stop` matches the attribution trigger's stance, so the card stays open across
       the toggle on a fine pointer; the card's own focus-within disclosure puts this on the
       Tab walk right after the GitHub link. The coarse self-close this row diagnosed is cured
       in TWO places, because the tap fired two closers and each was sufficient on its own: the
       bubbling click on the disclosure, and `useHoverCard`'s pending-close timer, which
       `onHoverEnter` cancels BEFORE the coarse gate rather than after it. -->
  <button
    type="button"
    class="text-muted-foreground hover:text-foreground mt-1 block font-mono text-xs transition-colors duration-200"
    :aria-pressed="debug"
    @click.stop="debug = !debug"
  >
    debug · {{ debug ? "on" : "off" }}
  </button>
</template>
