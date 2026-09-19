<script setup lang="ts">
/**
 * PlayerSign — THE STILL SIGN IN THE HEAD (T9-W7 PLR-PLACE §3.2).
 *
 * A 28 × 28 drawn box wearing `HandDrawnOutline :pose="0"` — the estate's ONE box grammar, the
 * guard ribbon's own keep width — and, centred in it, the count of OTHER players. Empty when
 * you are alone, which is the honest empty: it teaches the reader what the box is before
 * anybody arrives.
 *
 * IT IS NOT A MINIATURE OF THE BOARD, and the numbers are why. At 24px the board's frame is
 * 0.288px of stroke carrying 0.170px of wobble (sub-pixel at dpr 2), it reads 1.52:1 on both
 * light grounds in both engines, and a dot inside it reads 2.35–2.69:1. The chart lives at
 * 10.667 · N px inside the sheet instead.
 *
 * `@pointerdown.prevent` IS THE WHOLE SEAM (pass 2). A press on this button used to move focus,
 * which fired the grid's `focusout`, which sent `cur {p: null}` — so opening the chart told the
 * room you had looked away and then drew you a chart with your own place missing. Preventing
 * the default on `pointerdown` suppresses the focus move and nothing else: the click still
 * fires exactly once, `aria-expanded` still moves, and Enter and Space still open it, because a
 * keyboard activation never went through `pointerdown` at all. The `relatedTarget` cure this
 * replaces was measured dead — WebKit hands `null` on a press AND on a Tab, so the grid could
 * not tell them apart.
 *
 * AND IT IS STILL. Nothing here reads `cur`: a peer sweeping a board with a held arrow key
 * mutates nothing in the head (G4 counts DOM mutations under `[data-player-mark]` over 60 s of
 * exactly that, with the sheet shut). The one event-driven motion is the ink, 400ms, when the
 * room becomes ≥ 2 or drops back to 1.
 */
import { computed, onBeforeUnmount, ref, useId, watch } from "vue";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import PlayerLobby from "@games/shared/PlayerLobby.vue";
import { session } from "@games/shared/useSession";
import { stateLine as line } from "@games/shared/lobbyCopy";
import { MOTION } from "@pencil/config/pencilConfig";

const isOpen = ref(false);
const lobbyId = useId();

const others = computed(() => Math.max(0, session.players.value.length - 1));
/** The sign's accessible NAME is the state line: a count, which is R6 law 32's own idiom, and
 *  not the roster's `who's on this board` (law 33 — one name per act). It MUTATES on a join
 *  and moves nothing: M19 whole. */
const stateLine = computed(() => line(others.value));

function toggle(): void {
  isOpen.value = !isOpen.value;
}
function close(): void {
  isOpen.value = false;
}

/**
 * ESCAPE HAS ONE OWNER while the sheet is open, and it has to be the window: after
 * `@pointerdown.prevent` the sheet never holds focus, so a key event never reaches it. Bound on
 * open, unbound on close — never a standing listener — and `defaultPrevented` is honoured so a
 * deeper owner (a modal that opened over this) keeps its own key.
 */
function onWindowKey(e: KeyboardEvent): void {
  if (e.key !== "Escape" || e.defaultPrevented) return;
  close();
}
watch(isOpen, (open) => {
  if (open) window.addEventListener("keydown", onWindowKey);
  else window.removeEventListener("keydown", onWindowKey);
});
onBeforeUnmount(() => window.removeEventListener("keydown", onWindowKey));

/** A keyboard reader who tabs off the sign is done with it. The sheet holds nothing focusable,
 *  so this cannot fire from inside the sheet — and a mouse press never focused the button. */
function onFocusOut(e: FocusEvent): void {
  const root = e.currentTarget as HTMLElement;
  const next = e.relatedTarget as Node | null;
  if (!next || !root.contains(next)) close();
}

defineExpose({ close });
</script>

<template>
  <div
    class="player-sign"
    :class="{ 'is-live': others > 0 }"
    :style="{ '--presence-ink-ms': `${MOTION.presenceInkMs}ms` }"
    @focusout="onFocusOut"
  >
    <button
      type="button"
      class="player-sign-btn"
      data-player-mark
      :aria-label="stateLine"
      :aria-expanded="isOpen"
      :aria-controls="lobbyId"
      @click.stop="toggle"
      @pointerdown.prevent
    >
      <span class="player-sign-box">
        <HandDrawnOutline
          class="player-sign-frame"
          :stroke-width="2"
          :outset="0"
          :pose="0"
        >
          <span class="player-sign-count" aria-hidden="true">{{
            others > 0 ? others : ""
          }}</span>
        </HandDrawnOutline>
      </span>
    </button>
    <!-- MOUNTED, not `v-if`: the pose box is the `.hover-card` rule verbatim, and a box that
         does not exist cannot fade. The CHART inside it is the `v-if`, so a shut sheet still
         does no `cur` work — which is the thing the `v-if` was actually for. -->
    <PlayerLobby :id="lobbyId" :open="isOpen" />
  </div>
</template>

<style scoped>
/* Inline-block, top-aligned: it shares the head corner's inline formatting context with the
   `@mbabb` disclosure (AttributionCard's note). Deliberately NOT positioned — the sheet's
   `left: 0` is the PAGE's left edge, so its containing block must stay the fixed corner. */
.player-sign {
  display: inline-block;
  vertical-align: top;
}

/* The trigger's own pose beside it: the √φ padding rungs the @mbabb button wears, so the two
   marks on this line are padded alike. */
.player-sign-btn {
  background: transparent;
  border: none;
  padding: 0.618rem 0.786rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  /* THE FLOOR IS DECLARED HERE, BOTH DIMENSIONS. `--tap-floor` lives on `.page-root`, and the
     coarse `min-width` arm in index.css names `.ctrl-btn` and `.mobile-heading-btn` only — a
     head mark that inherits neither must say it itself or ship a 24px target. */
  color: var(--ink-press-quiet);
  transition: color var(--presence-ink-ms, 400ms) var(--ease-standard);
}

@media (pointer: coarse) {
  .player-sign-btn {
    min-width: var(--tap-floor, 2.75rem);
    min-height: var(--tap-floor, 2.75rem);
  }
}

/* The ink lift, solo only — a room's colour is a STATE and a hover must not be able to say it. */
@media (hover: hover) and (pointer: fine) {
  .player-sign:not(.is-live) .player-sign-btn:hover {
    color: var(--color-pencil-graphite);
  }
}

.player-sign.is-live .player-sign-btn {
  color: var(--color-user-ink);
}

.player-sign-box {
  display: block;
  width: 28px;
  height: 28px;
}

/* `HandDrawnOutline` draws in `currentColor`, so the frame and the numeral are one ink by
   construction and the 400ms above carries both. */
.player-sign-frame {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}

.player-sign-count {
  font-family: var(--font-hand);
  font-size: var(--type-small);
  font-weight: 500;
  line-height: 1;
  color: currentColor;
}

@media (prefers-reduced-motion: reduce) {
  .player-sign-btn {
    transition-duration: 0s;
  }
}
</style>
