<script setup lang="ts">
/**
 * PlayerLobby — THE ROOM AT THE TABLE (T9-W7 PLR-PLACE §3.3).
 *
 * A disclosure the reader OPENED, in the @mbabb card's own pose: the state line, the board drawn
 * at held pitch with the room on it, and a row per player beneath it at the card's full width.
 *
 * THE GROUND IS OPAQUE, BOTH ARMS (pass 2). Pass 1 wore the @mbabb card's 80% popover, and over
 * the wordmark `--ink-press-quiet` reads 4.20:1 in BOTH themes — a fail in real painted bytes,
 * not a projection. The desk sheet sits on the wordmark's box 19.9% of the time too, so this is
 * not a phone patch: it is one ground for the lobby, the law-44 arm promoted, and the @mbabb
 * card itself is untouched. Declared as a delta from that pose.
 *
 * THE BOX STAYS MOUNTED and the CHART is the `v-if`. `.hover-card`'s rule verbatim (the
 * declared 150ms, now actually implemented — a `v-if` box cannot fade), while the settle timers
 * and the chart's `cur` reading live behind `open`, so a shut sheet still does no work.
 *
 * THERE IS NO `@click.stop`. Nothing in here is focusable and nothing in here is a control, so a
 * tap anywhere on the sheet dismisses it — which is what a reader who has finished reading does.
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import PlaceChart from "@games/shared/PlaceChart.vue";
import { useBoardShape } from "@games/shared/useBoardShape";
import { mediaRef } from "@games/shared/useCoarsePointer";
import { WASH } from "@games/shared/useJoinWash";
import {
  PRESENCE_QUIET_MS,
  lastCell,
  peerCursors,
  quietMs,
  session,
  shareCursor,
} from "@games/shared/useSession";
import { LOBBY_COPY, moreLine, quietLine, stateLine as line } from "@games/shared/lobbyCopy";

const props = defineProps<{ open: boolean }>();

const shape = useBoardShape();
/** A hover query is only offered where a pointer can hover — one affordance, and on a phone the
 *  spec is "the chart is the settled dots and the rows are everyone", said plainly. */
const canQuery = mediaRef("(hover: hover) and (pointer: fine)");
/** ROWS: five where there is room, two where there is not. Height, not width — what runs out is
 *  vertical, and a 664-tall phone in landscape has the same problem a 390-wide one does not. */
const tall = mediaRef("(min-height: 800px)", true);

// ── WHERE EVERYONE HAS SETTLED ────────────────────────────────────────────────────────────
//
// The wire sends one `cur` per focus CHANGE and nothing at all while a peer sits still, so
// "settled" cannot be read off arrivals: it is a timer here. Hold the latest arrival, restart
// on a newer one, paint when it fires. Measured on the banked traces, `placeSettleMs` 700 takes
// ordinary play from 74.7/71.4 moves a minute to the high 30s and a 20 s key-repeat sweep to
// ~3, and costs a peer who is thinking nothing whatever.
//
// What is NOT damped is the FIRST reading: the sheet opens on where the room is now, because
// everything in `peerCursors` at that moment has already been still long enough to be sent.
const settled = ref<Record<string, number | null>>({});
const timers: Record<string, ReturnType<typeof setTimeout>> = {};

function stopTimers(): void {
  for (const id of Object.keys(timers)) {
    clearTimeout(timers[id]);
    delete timers[id];
  }
}

watch(
  [() => props.open, peerCursors],
  ([open, now]) => {
    if (!open) {
      stopTimers();
      return;
    }
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

onBeforeUnmount(stopTimers);

/**
 * A peer with a settled cell gets a dot. `null` — looked away, or their cell is Hidden — keeps
 * its row and has no place, which is the truth and not an omission. A peer with NO INK gets no
 * dot either: `BoardHost` already refuses to colour an unknown author, and a `?? blue` fallback
 * here would have drawn a stranger in YOUR colour on your own chart.
 */
const dots = computed(() =>
  session.players.value
    .filter((p) => !p.self && typeof settled.value[p.id] === "number" && p.ink["--color-user-ink"])
    .map((p) => ({
      id: p.id,
      ink: p.ink["--color-user-ink"],
      pos: settled.value[p.id] as number,
    })),
);

/** Your ring paints from `lastCell` — the cell you are ON, which a press on the sign no longer
 *  takes from you. `Hidden` puts it out with your dot: the chart you read is the chart the room
 *  reads, never a private one. */
const selfPos = computed(() => (shareCursor.value ? lastCell.value : null));

const others = computed(() => Math.max(0, session.players.value.length - 1));
const stateLine = computed(() => line(others.value));

// The qualifier is read ONCE, at open: a clock ticking inside a sheet would be motion nobody
// asked for, in a surface whose whole claim is that its motion was asked for.
const openedQuiet = ref<Record<string, number>>({});
watch(
  () => props.open,
  (open) => {
    if (!open) return;
    const stamp: Record<string, number> = {};
    for (const p of session.players.value) stamp[p.id] = quietMs(p.id);
    openedQuiet.value = stamp;
  },
  { immediate: true },
);

function qualifier(id: string, self: boolean): string {
  if (self) return LOBBY_COPY.you;
  const ms = openedQuiet.value[id] ?? Infinity;
  if (!Number.isFinite(ms) || ms < PRESENCE_QUIET_MS) return "";
  return quietLine(ms);
}

/** The sheet is a line budget, not a list. Past the last slot the count carries the remainder,
 *  and the sr-only roster in the well holds every name. */
const slots = computed(() => (tall.value ? 5 : 2));
const rows = computed(() => {
  const all = session.players.value;
  if (all.length <= slots.value) return all;
  return all.slice(0, slots.value - 1);
});
const more = computed(() => session.players.value.length - rows.value.length);

/** THE QUERY. One id, set on `mouseenter` where a pointer can hover, cleared on leave — the
 *  chart dims everybody else. Not a claim to four names: a question and its answer. */
const queried = ref<string | null>(null);
function query(id: string): void {
  if (canQuery.value) queried.value = id;
}
function unquery(): void {
  queried.value = null;
}
watch(
  () => props.open,
  (open) => {
    if (!open) queried.value = null;
  },
);
</script>

<template>
  <div class="player-lobby" :class="{ 'is-open': open }" data-lobby>
    <p class="lobby-state">{{ stateLine }}</p>
    <PlaceChart
      v-if="open"
      :size="shape.size"
      :subgrid="shape.subgrid"
      :peers="dots"
      :self="selfPos"
      :queried="queried"
    />
    <ul class="lobby-rows">
      <li
        v-for="p in rows"
        :key="p.id"
        class="pl-row"
        :data-peer="p.id"
        :style="p.ink"
        @mouseenter="query(p.id)"
        @mouseleave="unquery"
      >
        <svg
          class="pl-swatch"
          viewBox="0 0 8 8"
          width="8"
          height="8"
          aria-hidden="true"
        >
          <!-- The swatch IS the dot, at the dot's own radius: the one join between the two
               readings that costs nothing, kept. -->
          <circle v-if="!p.self" cx="4" cy="4" r="4" fill="var(--color-user-ink)" />
          <circle
            v-else
            cx="4"
            cy="4"
            r="3"
            fill="none"
            stroke="var(--color-user-ink)"
            stroke-width="2"
          />
        </svg>
        <span class="pl-name">{{ p.slug }}</span>
        <span class="pl-qualifier">{{ qualifier(p.id, p.self) }}</span>
      </li>
      <li v-if="more > 0" class="pl-row pl-more">{{ moreLine(more) }}</li>
    </ul>
  </div>
</template>

<style scoped>
/* THE @mbabb CARD'S POSE — 256 wide, a 2px border at 30%, radius 16, padding 16, `left: 0` the
   PAGE's left edge because this box's containing block is the head corner itself — with ONE
   declared change: the ground is opaque. See the header. */
.player-lobby {
  position: absolute;
  top: 100%;
  left: 0;
  width: 16rem;
  padding: 1rem;
  background: var(--color-popover);
  border: 2px solid color-mix(in srgb, var(--color-border) 30%, transparent);
  border-radius: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: var(--font-hand);
  /* `.hover-card` verbatim: the 150ms this family's spec has declared since pass 1, now the
     thing that actually runs. `visibility` is delayed to the fade's end on close and immediate
     on open, so the sheet reads as a fade and never as a snap. */
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: scale(0.9) translateY(8px);
  transition:
    opacity 150ms var(--ease-standard),
    transform 150ms var(--ease-standard),
    visibility 0s linear 150ms;
}

.player-lobby.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: scale(1) translateY(0);
  transition:
    opacity 150ms var(--ease-standard),
    transform 150ms var(--ease-standard),
    visibility 0s linear 0s;
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

.pl-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 1.4rem;
}

.pl-swatch {
  flex: 0 0 auto;
  overflow: visible;
}

.pl-name {
  font-size: var(--type-small);
  color: var(--color-pencil-graphite);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* The qualifier sits BESIDE the name it qualifies, not at the far edge of the box — R5's F10,
   which measured `you` 145px of empty from its own row's name. */
.pl-qualifier:not(:empty) {
  font-size: var(--type-tag);
  color: var(--ink-press-quiet);
  white-space: nowrap;
}

.pl-more {
  font-size: var(--type-tag);
  color: var(--ink-press-quiet);
  padding-left: 0.8rem;
}

@media (prefers-reduced-motion: reduce) {
  .player-lobby {
    transition-duration: 0s, 0s, 0s;
  }
}
</style>
