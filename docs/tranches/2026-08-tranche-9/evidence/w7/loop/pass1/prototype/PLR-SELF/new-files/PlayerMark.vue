<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useId, watch } from "vue";
import PlayerStub from "../icons/PlayerStub.vue";
import PlayerLobby from "./PlayerLobby.vue";
import type { LobbyLine, MarkRow } from "./types";
import { headDisclosures, useHoverCard } from "../AttributionCard/useHoverCard";
import { MOTION } from "@pencil/config/pencilConfig";

/**
 * YOUR MARK, IN YOUR INK (T9-W7 §11 · M14) — the head's second mark, and the one thing in the
 * head that ever changes colour.
 *
 * The mark is a crayon stub, never a written name: it is 44 × 44 in every cell measured, where
 * a slug runs 3 to 13 characters and breathes 4× beside a fixed 75.5px `@mbabb`; and because it
 * draws no word, its accessible name is free to be exactly the state line (WCAG 2.5.3 forbids
 * that of a mark that letters a name, and the estate's one-name law wants it).
 *
 * It rests graphite. Colour arrives on it — over 400ms, on the same `join` the board's wash
 * rides — when the room becomes two, and leaves when it drops back to one. That is the whole
 * sentence: a colour in the corner you look at first means somebody else is here.
 *
 * Pencil-pure: this component knows nothing about sessions. `App.vue` hands it the state line,
 * the ink, the rows and a reader for how long each peer has been quiet.
 */
const props = withDefaults(
  defineProps<{
    /** The accessible name AND the sheet's first line: `no other players` / `3 other players`. */
    stateLine: string;
    /** This page's own ink in this room — bound on the mark, spent when the room is ≥2. */
    ink: Record<string, string>;
    /** You first, then arrival order. Empty on a board with no room. */
    rows: MarkRow[];
    /** Silence past this is worth saying out loud. The session's own `PRESENCE_QUIET_MS`. */
    quietAfterMs?: number;
    /** How long a peer has been silent, in ms — read at OPEN, never on a timer. */
    quietMsOf?: (id: string) => number | null;
  }>(),
  { quietAfterMs: 20000, quietMsOf: undefined },
);

const { isOpen, toggle, close } = useHoverCard();
const lobbyId = useId();
/** ≥2 at the table. One row (or none) is a board you are alone on, and it stays graphite. */
const live = computed(() => props.rows.length > 1);

// The head's disclosures share one origin, so they share one open (see `useHoverCard`).
const disc = inject(headDisclosures, null);
const unregister = disc?.register(close);
onBeforeUnmount(() => unregister?.());
watch(isOpen, (open) => {
  if (!open) return;
  disc?.claim(close);
  // THE QUALIFIERS ARE READ AT THE OPEN AND NEVER AGAIN. A held-open sheet that counted
  // upwards would need a clock the estate does not keep, and would rewrite a line under a
  // reader who is reading it. What it says is true of the moment they asked.
  quietAt.value = Object.fromEntries(
    props.rows.map((r) => [r.id, r.self ? null : (props.quietMsOf?.(r.id) ?? null)]),
  );
});

const quietAt = ref<Record<string, number | null>>({});

/** SIX LINES, and the sheet never scrolls: state + up to 5 rows, or state + 4 rows + `and N
 *  more`. On a phone that is 76 + 22 · 6 = 208px against the 208.5 between the head and the
 *  board's top — measured, both engines. */
const LINE_BUDGET = 6;
const shown = computed(() =>
  props.rows.length <= LINE_BUDGET - 1
    ? props.rows
    : props.rows.slice(0, LINE_BUDGET - 2),
);
const overflow = computed(() =>
  props.rows.length > shown.value.length
    ? `and ${props.rows.length - shown.value.length} more`
    : "",
);

const lines = computed<LobbyLine[]>(() =>
  shown.value.map((r) => {
    const quiet = quietAt.value[r.id];
    return {
      id: r.id,
      name: r.name,
      ink: r.ink,
      qualifier: r.self
        ? "you"
        : quiet !== null && quiet !== undefined && quiet >= props.quietAfterMs
          ? `${Math.floor(quiet / 1000)} seconds ago`
          : "",
    };
  }),
);
</script>

<template>
  <button
    type="button"
    data-player-mark
    class="player-mark"
    :class="{ 'is-live': live }"
    :style="[live ? ink : null, { '--presence-ink-dur': `${MOTION.presenceInkMs}ms` }]"
    :aria-label="stateLine"
    :aria-expanded="isOpen"
    :aria-controls="lobbyId"
    @click.stop="toggle"
    @keydown.enter.stop="toggle"
  >
    <PlayerStub :size="20" />
  </button>
  <PlayerLobby
    :id="lobbyId"
    :open="isOpen"
    :state-line="stateLine"
    :lines="lines"
    :overflow="overflow"
  />
</template>

<style scoped>
/* The `@mbabb` trigger's own √φ rungs, so the two marks share one centre line: 20px of stub
   plus 2 × 9.888 is 39.8 tall, exactly the trigger's height at a fine pointer. */
.player-mark {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  padding: 0.618rem 0.786rem;
  cursor: pointer;
  color: var(--ink-press-quiet);
  transition: color var(--presence-ink-dur) var(--ease-standard);
}

/* THE ONE SENTENCE. Your own index in the room's `k` is bound on this button by `App.vue`, so
   `--color-user-ink` here is the colour every other page paints you — which is why the mark
   going coloured means somebody else arrived, and not merely that a feature exists. */
.player-mark.is-live {
  color: var(--color-user-ink);
}

/* ONE affordance, the same ink lift `@mbabb` takes (muted → foreground): no ground, no border,
   no travel. Fine pointers only — there is no hover on touch, and a `:hover` that latches after
   a tap would leave the mark reading as live when it is not. */
@media (hover: hover) {
  .player-mark:hover {
    color: var(--color-pencil-graphite);
  }
}

.player-mark:focus-visible {
  color: var(--color-pencil-graphite);
  outline: 2px dashed currentColor;
  outline-offset: 3px;
}

/* The floor is two-dimensional and it is declared ON THE MARK: `.attribution-trigger` is
   excluded from the estate's coarse `min-width` arm (index.css:849) because it re-measured
   full-width there, and this control is 45.2 wide at a fine pointer — under 44 in neither
   dimension only because it says so here. */
@media (pointer: coarse) {
  .player-mark {
    min-width: var(--tap-floor, 2.75rem);
    min-height: var(--tap-floor, 2.75rem);
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .player-mark {
    transition-duration: 0s;
  }
}
</style>
