<script setup lang="ts">
/**
 * PlayerLobby — THE ROOM AT THE TABLE (T9-W7 PLR-PLACE §3.2).
 *
 * A disclosure the reader OPENED, in the @mbabb card's own pose: the state line, the board
 * drawn at 96px with the room on it, and a row per player beneath it at the card's full width.
 * Mounted only while open — the chart re-renders when a peer settles, and a shut sheet must do
 * no work at all.
 *
 * THE TWO READINGS DO NOT JOIN PAST FOUR, and the spec says so rather than asking a reader to
 * discriminate 12.5° of hue: the chart is where the room is WORKING, the rows are who is IN
 * it, and the swatch is the dot so the one join that costs nothing is kept.
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import PlaceChart from "@games/shared/PlaceChart.vue";
import { useBoardShape } from "@games/shared/useBoardShape";
import { useCoarsePointer } from "@games/shared/useCoarsePointer";
import { WASH } from "@games/shared/useJoinWash";
import {
  PRESENCE_QUIET_MS,
  peerCursors,
  quietMs,
  selfCursor,
  session,
} from "@games/shared/useSession";

const shape = useBoardShape();
const coarse = useCoarsePointer();

// ── WHERE EVERYONE HAS SETTLED ────────────────────────────────────────────────────────────
//
// The wire sends one `cur` per focus CHANGE and nothing at all while a peer sits still, so
// "settled" cannot be read off arrivals: it is a timer here. Hold the latest arrival, restart
// on a newer one, paint when it fires. Measured on the banked traces, `placeSettleMs` 700 takes
// ordinary play from 74.7/71.4 moves a minute to 33.3/37.2 and a 20 s key-repeat sweep to 3.0,
// and costs a peer who is thinking nothing whatever.
//
// What is NOT damped is the FIRST reading: the sheet opens on where the room is now, because
// everything in `peerCursors` at that moment has already been still long enough to be sent.
const settled = ref<Record<string, number | null>>({ ...peerCursors.value });
const timers: Record<string, ReturnType<typeof setTimeout>> = {};

watch(
  peerCursors,
  (now) => {
    for (const [id, pos] of Object.entries(now)) {
      if (settled.value[id] === pos) continue;
      clearTimeout(timers[id]);
      timers[id] = setTimeout(() => {
        settled.value = { ...settled.value, [id]: pos };
      }, WASH.placeSettleMs);
    }
    for (const id of Object.keys(settled.value)) {
      if (id in now) continue;
      clearTimeout(timers[id]);
      delete timers[id];
      const { [id]: _gone, ...rest } = settled.value;
      settled.value = rest;
    }
  },
  { deep: true },
);

onBeforeUnmount(() => {
  for (const t of Object.values(timers)) clearTimeout(t);
});

/** A peer with a settled cell gets a dot. `null` — looked away, or their cell is hidden —
 *  keeps its row and has no place, which is the truth and not an omission. */
const dots = computed(() =>
  session.players.value
    .filter((p) => !p.self && typeof settled.value[p.id] === "number")
    .map((p) => ({
      id: p.id,
      ink: p.ink["--color-user-ink"] ?? "var(--color-user-ink)",
      pos: settled.value[p.id] as number,
    })),
);

const others = computed(() => Math.max(0, session.players.value.length - 1));
const stateLine = computed(() =>
  others.value === 0
    ? "no other players"
    : others.value === 1
      ? "1 other player"
      : `${others.value} other players`,
);

// The qualifier is read ONCE, at open: a clock ticking inside a sheet would be motion nobody
// asked for, in a surface whose whole claim is that its motion was asked for.
const openedQuiet: Record<string, number> = {};
for (const p of session.players.value) openedQuiet[p.id] = quietMs(p.id);

function qualifier(id: string, self: boolean): string {
  if (self) return "you";
  const ms = openedQuiet[id] ?? Infinity;
  if (!Number.isFinite(ms) || ms < PRESENCE_QUIET_MS) return "";
  return `${Math.round(ms / 1000)} seconds ago`;
}

/** The sheet is a line budget, not a list: a phone's is 208.5px tall. Past the last slot the
 *  count carries the remainder, and the sr-only roster in the well holds every name. */
const slots = computed(() => (coarse.value ? 3 : 5));
const rows = computed(() => {
  const all = session.players.value;
  if (all.length <= slots.value) return all;
  return all.slice(0, slots.value - 1);
});
const more = computed(() => session.players.value.length - rows.value.length);
</script>

<template>
  <div class="player-lobby" data-lobby @click.stop>
    <p class="lobby-state">{{ stateLine }}</p>
    <PlaceChart
      :size="shape.size"
      :subgrid="shape.subgrid"
      :peers="dots"
      :self="selfCursor"
    />
    <ul class="lobby-rows">
      <li v-for="p in rows" :key="p.id" class="lobby-row" :style="p.ink">
        <svg
          class="lobby-swatch"
          viewBox="0 0 8 8"
          width="8"
          height="8"
          aria-hidden="true"
        >
          <circle v-if="!p.self" cx="4" cy="4" r="4" fill="var(--color-user-ink)" />
          <circle
            v-else
            cx="4"
            cy="4"
            r="3.25"
            fill="none"
            stroke="var(--color-user-ink)"
            stroke-width="1.5"
          />
        </svg>
        <span class="lobby-name">{{ p.slug }}</span>
        <span class="lobby-qualifier">{{ qualifier(p.id, p.self) }}</span>
      </li>
      <li v-if="more > 0" class="lobby-row lobby-more">and {{ more }} more</li>
    </ul>
  </div>
</template>

<style scoped>
/* THE @mbabb CARD'S POSE, and deliberately the same one: a card that already opens on press
   from exactly this corner, at both widths — 256 wide, popover at 80%, a 2px border at 30%,
   radius 16, padding 16. `left: 0` is the PAGE's left edge, because this box's containing
   block is the head corner itself, which is what hangs both marks off `--head-rule`. */
.player-lobby {
  position: absolute;
  top: 100%;
  left: 0;
  width: 16rem;
  padding: 1rem;
  background: color-mix(in srgb, var(--color-popover) 80%, transparent);
  border: 2px solid color-mix(in srgb, var(--color-border) 30%, transparent);
  border-radius: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: var(--font-hand);
}

.lobby-state {
  font-size: var(--type-tag);
  font-weight: 500;
  color: var(--ink-press-quiet);
  margin: 0;
}

.lobby-rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.lobby-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 1.4rem;
}

.lobby-swatch {
  flex: 0 0 auto;
  overflow: visible;
}

.lobby-name {
  font-size: var(--type-small);
  color: var(--color-pencil-graphite);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* The qualifier sits BESIDE the name it qualifies, not at the far edge of the box — R5's F10,
   which measured `you` 145px of empty from its own row's name. */
.lobby-qualifier:not(:empty) {
  font-size: var(--type-tag);
  color: var(--ink-press-quiet);
  white-space: nowrap;
}

.lobby-more {
  font-size: var(--type-tag);
  color: var(--ink-press-quiet);
  padding-left: 0.8rem;
}

/* Reduced transparency: the sheet stops being a film over the board. */
@media (prefers-reduced-transparency: reduce) {
  .player-lobby {
    background: var(--color-popover);
  }
}
</style>
