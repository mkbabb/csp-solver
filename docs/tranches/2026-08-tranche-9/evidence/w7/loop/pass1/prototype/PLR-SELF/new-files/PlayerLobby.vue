<script setup lang="ts">
import PlayerStub from "../icons/PlayerStub.vue";
import type { LobbyLine } from "./types";

defineProps<{
  id: string;
  open: boolean;
  stateLine: string;
  lines: LobbyLine[];
  /** `and 3 more` — the compression line, or empty. */
  overflow: string;
}>();
</script>

<template>
  <!-- THE @mbabb CARD'S POSE, BYTE FOR BYTE (T9-W7 §11): `top: 100%; left: 0` off the head's
       fixed wrapper, popover at 80%, a 2px border at 30%, radius and padding 1rem,
       `min-width: 16rem`. Hung off the wrapper rather than off the mark, it opens at the PAGE's
       left edge — right edge 256, which clears the sun's x = 326 by 70px on a phone. Hung at the
       mark's own x = 76 it lapped the sun by 6 × 20px, and the sun (z 60) painted over it.

       NO `role`, NO `aria-live`. The room's one `role="log"` stays mounted in the controls card
       where it can speak whether this sheet is open or shut; a region inside a closed disclosure
       announces nothing. These rows are plain markup, reachable by Tab — a disclosure, not a
       dialog. `@click.stop` sits on the box, as it does on the attribution card: the page root's
       `closeAll` is the outside-click dismissal, and shut this box is `pointer-events: none`. -->
  <div
    :id="id"
    data-lobby
    class="player-lobby"
    :class="{ 'is-open': open }"
    @click.stop
  >
    <p class="lobby-state">{{ stateLine }}</p>
    <ul v-if="lines.length" class="lobby-rows">
      <li v-for="p in lines" :key="p.id" class="lobby-row" :style="p.ink">
        <PlayerStub :size="14" class="lobby-stub" />
        <span class="lobby-name">{{ p.name }}</span>
        <span v-if="p.qualifier" class="lobby-qualifier">{{ p.qualifier }}</span>
      </li>
    </ul>
    <p v-if="overflow" class="lobby-overflow">{{ overflow }}</p>
  </div>
</template>

<style scoped>
.player-lobby {
  position: absolute;
  top: 100%;
  left: 0;
  padding: 1rem;
  background: color-mix(in srgb, var(--color-popover) 80%, transparent);
  border: 2px solid color-mix(in srgb, var(--color-border) 30%, transparent);
  border-radius: 1rem;
  min-width: 16rem;
  opacity: 0;
  /* UI-6, the attribution card's own reasoning: `visibility: hidden` pulls the rows out of the
     tab order and the a11y tree while the sheet is shut, and it is delayed to the fade's end on
     close so the transition still reads as a fade. */
  visibility: hidden;
  pointer-events: none;
  transform: scale(0.9) translateY(8px);
  transition:
    opacity 150ms var(--ease-standard),
    transform 150ms var(--ease-standard),
    visibility 0s linear 150ms;
  z-index: 50;
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

/* Law 44: a reader who has asked for less transparency, or more contrast, gets the solid
   ground. The same arm the estate's other translucent surfaces wear. */
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .player-lobby {
    background: var(--color-popover);
  }
}

.lobby-state {
  margin: 0;
  font-family: var(--font-hand);
  font-size: var(--type-tag);
  font-weight: 500;
  line-height: 1.35;
  color: var(--ink-press-quiet);
}

.lobby-rows {
  margin: 0.15rem 0 0;
  padding: 0;
  list-style: none;
}

/* ONE RUNG ABOVE THE WELL'S TAG (M01: raise, never lower) — 16px on the desk and on a coarse
   phone against the roster's 14. The row carries the peer's own ink, so `currentColor` inks the
   stub and `--color-user-ink` inks the name from the one binding. */
.lobby-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-hand);
  font-size: var(--type-small);
  line-height: 1.35;
  color: var(--color-user-ink);
}

.lobby-stub {
  flex: 0 0 auto;
}

.lobby-name {
  color: var(--color-user-ink);
}

/* The qualifier's berth is the ROW's own 0.35rem gap and nothing besides — a `margin-left` on
   top of it measured 11.2px, which is two spacings for one relationship. In the well this fact
   sat at the row's far edge, 153.3px from the last letter it qualifies: a column, not a
   sentence. Here it is 5.6px, and it reads as part of the line. */
.lobby-qualifier {
  font-size: var(--type-tag);
  font-weight: 400;
  color: var(--ink-press-quiet);
}

.lobby-overflow {
  margin: 0;
  font-family: var(--font-hand);
  font-size: var(--type-tag);
  line-height: 1.35;
  color: var(--ink-press-quiet);
}
</style>
