<script setup lang="ts">
/**
 * GameGallery — the carousel shell (T4-W12 §6). Wave B: the static deck + listbox a11y +
 * scroll-snap + glass-curve glide + page pips. Wave D: the mid-game guard ribbon + the
 * click-to-select affordance (the snap chime lives per-card in GameCard).
 *
 * A spread of paper worksheets dealt onto a desk. Pencil-pure: it takes `GalleryCard[]` +
 * the snapped index (and Wave D's `dirty`/`currentId`/`coarse` guard inputs) as PROPS and
 * emits `@snap` / `@select` / `@cancel` — it imports nothing from `games/**` (the eslint
 * boundary). App.vue owns the `useGameGallery` state machine, the dirty bridge, and the
 * `?game=` swap; this component owns the carousel DOM, the listbox a11y, the glass-curve
 * glide (`useCarouselGlide`), the page pips, and the guard-ribbon gate.
 *
 * A11y — listbox-over-carousel (W3C APG). DOM focus lives on the track container; the
 * highlighted card is tracked with `aria-activedescendant`. ←/→ step · Home/End first/last ·
 * Enter/Space select · Esc cancel. A polite live region announces each snap.
 *
 * THE SOUL GATE. This component holds the ONE shared-beat enrolment (`useBeatFrame`) on behalf
 * of the centered card, and feeds the live pose to that card ALONE; every flank gets pose 0
 * (frozen) + `inert`. Exactly one card boils; flanks paint nothing.
 *
 * THE MID-GAME GUARD (Wave D §4). A select of a DIFFERENT game while the board is `dirty`
 * (App's dirty bridge → the `dirty` prop) does NOT switch immediately: it arms a pencil-note
 * ribbon on the chosen card (keep / leave). Pristine boards and same-game selects switch
 * freely. NOT a modal, NOT confirm().
 */
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import {
  createSequenceSubscription,
  easeOutCubic,
  usePrefersReducedMotion,
  type SequenceHandle,
} from "@mkbabb/pencil-boil";
import {
  BOIL_CONFIG,
  DRAW_IN_PRESETS,
  MOTION,
  beatsFor,
} from "@pencil/config/pencilConfig";
import { useBeatFrame } from "@pencil/composables/boilBeat";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import GameCard from "./GameCard.vue";
import { useCarouselGlide } from "./useCarouselGlide";
import type { GalleryCard } from "./types";

const props = defineProps<{
  cards: readonly GalleryCard[];
  /** The centered card (from `useGameGallery`); reconciled into `activeIndex` on open. */
  snappedIndex: number;
  /** The currently-playing board is dirty (App's dirty bridge → WU's undo-depth signal).
   *  Gates the mid-game guard: a dirty + DIFFERENT select arms the ribbon. */
  dirty?: boolean;
  /** The id of the game being played (the fold-from). "Different" = chosen id ≠ this. */
  currentId?: string;
  /** Coarse primary pointer (App reads `useCoarsePointer` — pencil can't cross the boundary).
   *  Suppresses the fine-pointer hover cue on the centered card (§10 no-hover on coarse). */
  coarse?: boolean;
  /** Entry was interactive (the wordmark / `g` fold), not a `?view=gallery` deep-link boot —
   *  so BEAT 2 "the deal" (flanks draw IN) plays. Deep-link + PRM land the cards settled. */
  animateEntry?: boolean;
}>();

const emit = defineEmits<{
  (e: "snap", index: number): void;
  (e: "select", id: string): void;
  (e: "cancel"): void;
  /** THE LIVE CENTER FACE (Wave C2): the current-game centered card's live-face mount element
   *  (or null when it stops being live). Relayed straight from the card; App teleports the ONE
   *  board's subtree into it. A DOM element crosses up — pencil imports nothing from games. */
  (e: "live-face", el: HTMLElement | null): void;
}>();

const reducedMotion = usePrefersReducedMotion();

const count = computed(() => props.cards.length);
const clamp = (i: number) => Math.max(0, Math.min(count.value - 1, i));

// The internal notion of "centered". Initialized from the prop; user navigation drives it
// and emits `@snap` back to the state machine (the prop then echoes the same value — a no-op
// through the reconciling watch below, so there is no feedback loop).
const activeIndex = ref(clamp(props.snappedIndex));

// The mid-game guard: the index of the card whose leave/keep ribbon is armed (null = none).
const guardIndex = ref<number | null>(null);
function dismissGuard() {
  guardIndex.value = null;
}
/** The armed card, for the ribbon copy (rendered as an overlay centered on the deck — the
 *  chosen card IS the centered one, so it reads as "from the chosen card"). */
const guardCard = computed(() =>
  guardIndex.value != null ? props.cards[guardIndex.value] : null,
);

// THE ONE beat enrolment — driven into the centered card only (see the soul-gate note).
const centerPose = useBeatFrame(
  () => BOIL_CONFIG.frameCount,
  () => beatsFor(BOIL_CONFIG.intervalMs),
);
function poseFor(i: number): number {
  return i === activeIndex.value ? centerPose.value : 0;
}

// ── THE LIVE CENTER FACE index (Wave C2) ──
// The current game's card is `live` (its face IS the board) only when it is ALSO the centered
// card — so on open the marks show at center, and navigating to a different game reverts it to
// its poster (only ONE live board; a flank is always a poster). `currentId` absent → no live.
//
// PRM: no projection. Reduced motion collapses the whole entry to a same-frame cut (no fold, no
// deal); the live board never travels into the deck, so the deck stays a static poster grid —
// Wave B's PRM behaviour exactly (and no in-board animation is ever parented under the gallery).
const liveIndex = computed(() =>
  props.currentId != null ? props.cards.findIndex((c) => c.id === props.currentId) : -1,
);
function isLive(i: number): boolean {
  return !reducedMotion.value && i === liveIndex.value && i === activeIndex.value;
}

// ── THE DEAL (Wave C2 §BEAT 2) ──
// On an interactive entry the flanks draw IN onto the desk — one-shot sequence subscribers
// (DRAW_IN_PRESETS.gridFrame), staggered OUTWARD from center, backwards fill: `dealReveal[i]`
// 0→1 (GameCard maps it to opacity + a small lift). The center card folds in (the board FLIP),
// so it never deals (stays 1). Finite + self-removing — zero steady-state cost (the soul gate).
const dealReveal = reactive<number[]>([]);
// Seed in setup so the FIRST paint already has the flanks hidden when dealing (no flash): a
// flank starts at 0, everything else (center, deep-link, PRM) at 1 (settled).
{
  const center0 = clamp(props.snappedIndex);
  const dealing = !!props.animateEntry && !reducedMotion.value;
  for (let i = 0; i < props.cards.length; i++)
    dealReveal[i] = dealing && i !== center0 ? 0 : 1;
}
let dealHandles: SequenceHandle[] = [];
function stopDeal() {
  for (const h of dealHandles) {
    try {
      h.stop();
    } catch {
      /* ignore */
    }
  }
  dealHandles = [];
}
function startDeal() {
  stopDeal();
  const center = activeIndex.value;
  for (let i = 0; i < props.cards.length; i++) dealReveal[i] = i === center ? 1 : 0;
  if (reducedMotion.value) {
    for (let i = 0; i < props.cards.length; i++) dealReveal[i] = 1; // PRM: settled, no motion
    return;
  }
  const base = Math.round(MOTION.boardFoldMs * 0.42); // after the fold has begun
  const stagger = 90; // outward-from-center step
  props.cards.forEach((_, i) => {
    if (i === center) return;
    const dist = Math.abs(i - center);
    const h = createSequenceSubscription({
      durationMs: DRAW_IN_PRESETS.gridFrame.duration,
      delayMs: base + (dist - 1) * stagger,
      easing: easeOutCubic,
      onProgress: (eased) => {
        dealReveal[i] = eased;
      },
      onComplete: () => {
        dealReveal[i] = 1;
      },
    });
    h.start();
    dealHandles.push(h);
  });
}
onUnmounted(stopDeal);

// ── The polite live region ──
const liveText = ref("");
function announce(i: number) {
  const card = props.cards[i];
  if (card) liveText.value = `${card.name}, ${i + 1} of ${count.value}`;
}

// ── The glide (glass-curve FLIP for keyboard/button; native snap for touch) ──
const viewport = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
const glide = useCarouselGlide(viewport, track, {
  reducedMotion: () => reducedMotion.value,
  onSnap: (i) => syncFromScroll(i),
});

/** Programmatic move (keyboard / button): update state, glide the track, announce. Any move
 *  dismisses an armed guard ribbon (the user changed their mind about the switch). */
function go(i: number) {
  const next = clamp(i);
  if (next === activeIndex.value) return;
  dismissGuard();
  activeIndex.value = next;
  glide.glideTo(next);
  emit("snap", next);
  announce(next);
}
function step(delta: number) {
  go(activeIndex.value + delta);
}

/** A native (touch/trackpad) snap already moved the track — sync state, do not re-glide. */
function syncFromScroll(i: number) {
  const next = clamp(i);
  if (next === activeIndex.value) return;
  dismissGuard();
  activeIndex.value = next;
  emit("snap", next);
  announce(next);
}

// ── Select + the mid-game guard gate (Wave D §4) ──
/** Attempt to select the CENTERED card. A dirty + DIFFERENT switch arms the ribbon instead of
 *  emitting; a pristine or same-game switch emits straight through. */
function attemptSelect() {
  const card = props.cards[activeIndex.value];
  if (!card) return;
  if (props.dirty && props.currentId != null && card.id !== props.currentId) {
    guardIndex.value = activeIndex.value; // arm the ribbon on the chosen card
    return;
  }
  emit("select", card.id);
}
/** The ribbon's Leave — abandon the marked board, proceed with the switch. */
function guardLeave() {
  const i = guardIndex.value;
  guardIndex.value = null;
  const card = i != null ? props.cards[i] : null;
  if (card) emit("select", card.id);
}

function onKeydown(e: KeyboardEvent) {
  // While the guard ribbon is up, the listbox keys resolve IT: Enter/Space confirms Leave,
  // Escape dismisses (Keep). Arrows fall through to `step`, which dismisses + navigates.
  if (guardIndex.value !== null) {
    switch (e.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        e.preventDefault();
        guardLeave();
        return;
      case "Escape":
        e.preventDefault();
        dismissGuard();
        return;
    }
  }
  switch (e.key) {
    case "ArrowRight":
    case "ArrowDown":
      e.preventDefault();
      step(1);
      return;
    case "ArrowLeft":
    case "ArrowUp":
      e.preventDefault();
      step(-1);
      return;
    case "Home":
      e.preventDefault();
      go(0);
      return;
    case "End":
      e.preventDefault();
      go(count.value - 1);
      return;
    case "Enter":
    case " ":
    case "Spacebar":
      e.preventDefault();
      attemptSelect();
      return;
    case "Escape":
      e.preventDefault();
      emit("cancel");
      return;
  }
}

// External index change (e.g. a fresh open sets snappedIndex to the current game) → jump.
watch(
  () => props.snappedIndex,
  (i) => {
    const next = clamp(i);
    if (next === activeIndex.value) return;
    dismissGuard();
    activeIndex.value = next;
    glide.jumpTo(next);
    announce(next);
  },
);

// A board becoming pristine under an armed ribbon (undo back to clean) retires the guard.
watch(
  () => props.dirty,
  (d) => {
    if (!d) dismissGuard();
  },
);

onMounted(async () => {
  activeIndex.value = clamp(props.snappedIndex);
  await nextTick();
  glide.jumpTo(activeIndex.value);
  // DOM focus on the track container (aria-activedescendant model — §10 keyboard contract).
  viewport.value?.focus({ preventScroll: true });
  announce(activeIndex.value);
  // BEAT 2 — the deal: flanks draw IN (interactive entry only; deep-link/PRM stay settled).
  if (props.animateEntry) startDeal();
});
</script>

<template>
  <div
    class="game-gallery"
    :class="{ 'is-coarse': coarse }"
    :style="{ '--card-step-ms': `${MOTION.cardStepMs}ms` }"
  >
    <div
      ref="viewport"
      class="gallery-viewport"
      role="listbox"
      aria-label="Choose a puzzle"
      aria-roledescription="carousel"
      tabindex="0"
      :aria-activedescendant="`gallery-card-${activeIndex}`"
      @keydown="onKeydown"
    >
      <div ref="track" class="gallery-track">
        <div v-for="(card, i) in cards" :key="card.id" class="gallery-card-slot">
          <GameCard
            :card="card"
            :index="i"
            :count="count"
            :is-active="i === activeIndex"
            :pose="poseFor(i)"
            :guard="guardIndex === i"
            :live="isLive(i)"
            :deal-reveal="dealReveal[i]"
            @select="attemptSelect"
            @guard-keep="dismissGuard"
            @guard-leave="guardLeave"
            @face-mount="(el: HTMLElement | null) => emit('live-face', el)"
          />
        </div>
      </div>
    </div>

    <!-- Page pips: the sketchbook page-number, snapped one inked (decorative — the listbox
         already announces "N of M"; these are the visual/mobile position tell). -->
    <div class="gallery-pips" aria-hidden="true">
      <span
        v-for="(card, i) in cards"
        :key="`pip-${card.id}`"
        class="gallery-pip"
        :class="{ 'is-inked': i === activeIndex }"
      />
    </div>

    <!-- The mid-game guard ribbon (Wave D §4) — a pencil-note that SLIDES from the chosen
         (centered) card on a dirty+different switch. An overlay outside the scroll viewport
         (whose overflow would clip it), centered on the deck. NOT a modal, NOT confirm(): a
         light, dismissible note. Keep stays in the gallery; Leave abandons the marks + switches. -->
    <Transition name="guard-ribbon">
      <div
        v-if="guardCard"
        class="gallery-guard"
        role="alertdialog"
        aria-label="Leave this puzzle?"
      >
        <HandDrawnOutline class="guard-note-frame" :stroke-width="3" :outset="4">
          <div class="guard-note cartoon-shadow-md edge-outlined bg-popover">
            <p class="guard-note-text">
              leave this puzzle?<br /><span class="guard-note-sub"
                >your marks aren't saved</span
              >
            </p>
            <div class="guard-note-actions">
              <button
                type="button"
                class="guard-btn guard-keep"
                @click.stop="dismissGuard"
              >
                keep
              </button>
              <button
                type="button"
                class="guard-btn guard-leave"
                @click.stop="guardLeave"
              >
                leave
              </button>
            </div>
          </div>
        </HandDrawnOutline>
      </div>
    </Transition>

    <!-- Polite live region — announces the snapped card on every step/swipe. -->
    <div class="gallery-live" aria-live="polite" role="status">{{ liveText }}</div>
  </div>
</template>

<style scoped>
.game-gallery {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  width: 100%;
  flex: 1;
  min-height: 0;
  /* --card-w: the slot width = the carousel geometry. Mobile 375 → ~78vw, leaving ~11%
     each side so a neighbor peeks (swipe discoverability); desktop clamps to a comfortable
     worksheet. The card fills this (GameCard `width:100%`). */
  --card-w: min(78vw, 22rem);
}

.gallery-viewport {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  /* Touch/trackpad inertia snaps to card centers (§6). Keyboard/button steps set scrollLeft
     under a WAAPI transform — CSS scroll-behavior can't take the glass curve, so it stays
     auto (instant), and the transform carries the curve. */
  scroll-snap-type: x mandatory;
  scroll-behavior: auto;
  /* The frame + shadow overflow the slot; give them air, not a clipped edge. */
  padding-block: 1.5rem;
  /* Hide the scrollbar — the pips are the position tell. */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.gallery-viewport::-webkit-scrollbar {
  display: none;
}

.gallery-viewport:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-foreground) 40%, transparent);
  outline-offset: -4px;
  border-radius: 0.5rem;
}

.gallery-track {
  display: flex;
  align-items: center;
  /* Size to content (spacers + slots), so the deck genuinely overflows the viewport and
     scrolls — a width:auto flex container clips its overflowing items instead of extending
     the scroll region. */
  min-width: max-content;
  /* The FLIP glide rides this element's transform; promote for the gesture. */
  will-change: transform;
}

/* Leading/trailing air so the first and last card can scroll to TRUE center. Spacer flex
   ITEMS (not track/viewport padding: percentage padding doesn't extend a scroll container's
   scrollWidth) with a FIXED px basis (`--edge`, computed in useCarouselGlide from the live
   viewport/slot widths — a % basis collapses to 0 under max-content sizing). */
.gallery-track::before,
.gallery-track::after {
  content: "";
  flex: 0 0 var(--edge, 0px);
}

.gallery-card-slot {
  flex: 0 0 var(--card-w);
  scroll-snap-align: center;
  display: flex;
  justify-content: center;
  /* Card breathing room inside the slot (not a track gap — a gap would eat the neighbor
     peek on mobile; slot padding keeps the slot-to-slot distance as the peek geometry). */
  padding-inline: 0.6rem;
}

.gallery-pips {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.gallery-pip {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--color-foreground) 45%, transparent);
  background: transparent;
  transition: background-color 200ms var(--ease-standard);
}

.gallery-pip.is-inked {
  background: var(--color-foreground);
  border-color: var(--color-foreground);
}

/* ── The mid-game guard ribbon (Wave D §4) — an overlay centered on the deck ── */
.gallery-guard {
  position: absolute;
  left: 50%;
  /* Just below the deck center — reads as emerging from the centered (chosen) card. */
  top: calc(50% + 3.5rem);
  transform: translateX(-50%);
  z-index: 40;
  width: min(20rem, 82%);
  pointer-events: auto;
}

.guard-note-frame {
  display: block;
  width: 100%;
}

.guard-note {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.85rem 0.9rem;
  border-radius: 0.75rem;
  text-align: center;
}

.guard-note-text {
  margin: 0;
  font-family: var(--font-hand);
  font-size: var(--type-body, 1rem);
  line-height: 1.25;
  color: var(--color-foreground);
}

.guard-note-sub {
  color: var(--color-muted-foreground);
  font-size: 0.9em;
}

.guard-note-actions {
  display: flex;
  gap: 0.65rem;
}

.guard-btn {
  font-family: var(--font-hand);
  font-size: var(--type-body, 1rem);
  line-height: 1;
  padding: 0.32rem 1rem;
  border-radius: 0.45rem;
  border: 2px solid color-mix(in srgb, var(--color-foreground) 30%, transparent);
  background: transparent;
  color: var(--color-foreground);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.guard-btn:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-foreground) 45%, transparent);
  outline-offset: 2px;
}

.guard-leave {
  border-color: color-mix(in srgb, var(--color-foreground) 60%, transparent);
  background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
}

/* The ribbon SLIDES in (a note pulled from the card) — a CSS transition on the Vue
   Transition, the app's card idiom (Wave B's depth transition), not a new animation brain. */
.guard-ribbon-enter-active,
.guard-ribbon-leave-active {
  transition:
    transform 240ms var(--ease-glassGlide),
    opacity 240ms var(--ease-glassGlide);
}

.guard-ribbon-enter-from,
.guard-ribbon-leave-to {
  transform: translate(-50%, -0.75rem);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  /* Same-frame appear under PRM (reachable, no slide). */
  .guard-ribbon-enter-active,
  .guard-ribbon-leave-active {
    transition: none;
  }
  .guard-ribbon-enter-from,
  .guard-ribbon-leave-to {
    transform: translateX(-50%);
  }
}

/* Visually-hidden live region (the standard clip pattern) — announced, never painted. */
.gallery-live {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .gallery-pip {
    transition: none;
  }
}
</style>
