<script setup lang="ts">
/**
 * GameCard — one paper worksheet on the desk (T4-W12 §6; Wave D adds the snap chime, the
 * click-to-select affordance, and the mid-game guard ribbon).
 *
 * A `HandDrawnOutline`-framed paper card (the app's `cartoon-shadow-md edge-outlined bg-card`
 * idiom): face = the game's static `poster`, name as a lowercase wordmark `<text>`, a `range`
 * sub-line in the Patrick Hand register.
 *
 * THE SOUL GATE (Wave B's sharpest). This card enrols NO beat of its own. Its frame's boil is
 * DRIVEN from the parent's `:pose` — the gallery holds the ONE shared-beat enrolment and feeds
 * the live pose to the CENTERED card only; a flank card is handed pose 0 (frozen) and
 * `is-active=false`. So exactly one card boils, flanks paint nothing.
 *
 * THE SNAP CHIME (Wave D §2, visual-only — NO audio). On becoming centered, the card plays ONE
 * `hoverWiggleDuration` (600ms) wobble bloom + draws its `scribbleUnderline` under the name — a
 * single one-shot `sequence` subscriber on the pencil-boil chain (`createSequenceSubscription`),
 * finite by construction, self-removing (never a perpetual boil). PRM: no bloom, the underline
 * lands drawn (reachable, static) — the shared beat is PRM-frozen anyway.
 *
 * Pencil purity: `card` is a `GalleryCard` (pencil-local type); the poster arrives as a loader
 * thunk (`card.poster()`); `scribbleUnderline`/`useTheme` are pencil/app modules — no `games/**`
 * import anywhere in this component.
 */
import { computed, defineAsyncComponent, nextTick, onUnmounted, ref, watch } from "vue";
import {
  createSequenceSubscription,
  easeOutCubic,
  usePrefersReducedMotion,
  type SequenceHandle,
} from "@mkbabb/pencil-boil";
import { GLYPH_ANIM } from "@pencil/config/pencilConfig";
import { useTheme } from "@/composables/useTheme";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import { scribbleUnderline } from "@pencil/chrome/OptionSelector/scribbleUnderline";
import type { GalleryCard } from "./types";

const props = defineProps<{
  card: GalleryCard;
  index: number;
  count: number;
  /** True only for the centered/snapped card — the one live, interactive, boiling card. */
  isActive: boolean;
  /** The boil pose fed by the gallery: the live shared-beat frame for the centered card,
   *  0 (frozen) for every flank. Passed straight to the frame's `HandDrawnOutline :pose`. */
  pose: number;
  /** The mid-game guard is armed ON this card (T4-W12 Wave D §4) — a dirty board + a
   *  DIFFERENT game was selected, so the leave/keep ribbon slides from it. Only ever true
   *  for the centered card (you select the centered card). */
  guard?: boolean;
  /** THE LIVE CENTER FACE (T4-W12 Wave C2). True when this card is the CURRENT game AND
   *  centered — its face becomes the live board (App teleports the board subtree into the
   *  `.live-face-fit` mount this renders, emitted up via `@face-mount`). False → the static
   *  poster face. Only ever one card is live (the one live board on the page). */
  live?: boolean;
  /** The deal reveal (Wave C2 §BEAT 2) — 0→1 as this flank draws IN onto the desk on entry
   *  (a one-shot the gallery sequences, staggered outward from center). 1 = settled/no-deal
   *  (the center card folds in, it never deals; deep-link + PRM land at 1 with no motion). */
  dealReveal?: number;
  /** THE CROSS-GAME TRUTH (T4-P1 F4) — supplied only for a card whose ledger row says a board
   *  is waiting: the sub-line then reports what is there instead of the range of sizes on
   *  offer. Absent → the range line, byte-unchanged. Every card tells you the most it can. */
  subline?: string;
}>();

const emit = defineEmits<{
  /** The centered card was chosen by pointer (click / tap). The gallery gates the guard. */
  (e: "select"): void;
  /** A FLANK was clicked (T8 M10) — the deck warps to it. Never a choice of the game: the
   *  gallery routes this through the same `go()` a keyboard step rides, so the glass curve,
   *  the `@snap` seam, aria-activedescendant and the live region all follow one path. */
  (e: "warp"): void;
  /** The live-face mount element (or null when this card stops being live) — the gallery
   *  relays it to App, which teleports the ONE board's subtree into it. A bare DOM element
   *  crosses UP; pencil imports nothing from games (the boundary holds). */
  (e: "face-mount", el: HTMLElement | null): void;
}>();

const { isDark } = useTheme();
const reducedMotion = usePrefersReducedMotion();

// The poster face — loaded through the card's own thunk (a value, not an import), so the
// pencil↛games boundary holds. Stable per instance (cards are keyed by id in the v-for).
const Poster = defineAsyncComponent(() => props.card.poster());

// Approximate wordmark box (the logo's estimate, no getBBox needed for a short caption);
// preserveAspectRatio scales the run to the caption height, so a loose box never clips.
const nameViewBox = computed(() => {
  const w = Math.max(120, Math.ceil(props.card.name.length * 34) + 12);
  return `0 0 ${w} 60`;
});

const rangeLine = computed(() => {
  if (props.subline) return props.subline;
  const { label, levels } = props.card.range;
  return levels.length ? `${label} · ${levels.join(" / ")}` : label;
});

const ariaLabel = computed(
  () => `${props.card.name}, ${props.index + 1} of ${props.count}`,
);

// ── The snap chime: wobble bloom + scribbleUnderline draw (Wave D §2) ──
// The underline ink matches the wordmark register (the logo's inkColor convention). Cached
// by (seed, color) in scribbleUnderline; theme flip re-derives. Seeded off the name so each
// game's scribble is its own stable hand.
const inkColor = computed(() => (isDark.value ? "#ffffff" : "#1a1a1a"));
const underlineImg = computed(() =>
  scribbleUnderline(props.card.name.charCodeAt(0), inkColor.value),
);

/** 0→1→0 over the chime — a subtle scale bloom on the whole worksheet (frame + face). A
 *  compositor-only transform on the frame's own promoted layer (no re-raster of the poses). */
const bloom = ref(0);
/** 0→1 over the chime — the left-to-right reveal of the scribble underline (a real draw-in). */
const draw = ref(0);

/** THE BLOOM NEVER RIDES A LIVE FACE (T8 M7b). The wobble is a scale on the FRAME, and the
 *  live board is teleported INSIDE that frame — so on every entry the 3.5% bloom multiplied the
 *  board's own 520ms fold and the fold's measured landing pose was a moving target. Measured at
 *  1280×900: the face slot travelled 304.0 → 314.7px and back while the board was folding into
 *  it, so the board settled, then rubber-banded 3.5% after the curve had finished. The chime's
 *  OTHER half — the underline drawing in under the name — is a clip on an 8px strip and touches
 *  no ancestor of the board, so it plays exactly as before. One card carries the live board and
 *  it is the one card whose entrance is already animated; the bloom belongs to the four that
 *  aren't. */
const frameStyle = computed(() => ({
  transform: `scale(${1 + (props.live ? 0 : bloom.value) * 0.035})`,
}));
const underlineStyle = computed(() => ({
  "--draw": String(draw.value),
  "background-image": underlineImg.value,
}));

let chime: SequenceHandle | null = null;
function stopChime() {
  chime?.stop();
  chime = null;
}

/** ONE one-shot sequence subscriber — never perpetual (the soul-gate discipline). Bloom rides
 *  a sin envelope (0→1→0); the underline draws on the eased progress. Settles bloom to 0 +
 *  underline fully drawn, then self-removes from the chain. */
function playChime() {
  stopChime();
  if (reducedMotion.value) {
    bloom.value = 0;
    draw.value = 1; // PRM: no wobble; the underline lands drawn (reachable, static)
    return;
  }
  bloom.value = 0;
  draw.value = 0;
  chime = createSequenceSubscription({
    durationMs: GLYPH_ANIM.hoverWiggleDuration,
    easing: easeOutCubic,
    onProgress: (eased, raw) => {
      bloom.value = Math.sin(Math.PI * raw); // bloom up then settle
      draw.value = eased; // the underline inks in
    },
    onComplete: () => {
      bloom.value = 0;
      draw.value = 1;
      chime = null;
    },
  });
  chime.start();
}

// Fire the chime when the card BECOMES centered (the snap settle), and on mount if it opens
// centered (the §settle "center card's boil wakes, one wobble bloom"). A flank losing center
// stops any in-flight chime and drops its underline (only the centered card carries one).
watch(
  () => props.isActive,
  (active, was) => {
    if (active && !was) playChime();
    else if (!active) {
      stopChime();
      bloom.value = 0;
      draw.value = 0;
    }
  },
  { immediate: true },
);

// A mid-session PRM engage strands the chime mid-tween (the chain force-clears but never
// finishes the value) — land the settled pose.
watch(reducedMotion, (reduced) => {
  if (reduced && props.isActive) {
    stopChime();
    bloom.value = 0;
    draw.value = 1;
  }
});

onUnmounted(stopChime);

// Click-to-select (Wave D) + CLICK-TO-WARP (T8 M10). A flank's internals are inert (not
// hit-testable, so the click resolves on the live root), and the root is deliberately live so
// the option stays in the accessibility tree — which is what makes a flank click reachable at
// all. Two acts on one gesture, keyed by position, and the position is the whole rule:
//
//   · centered  → SELECT. Unchanged, byte for byte: this is the choice of a game.
//   · a flank   → WARP. Wave D refused it by design ("you select the centered card"), and the
//                 owner reverses that: pointing at a card is an order to bring it to the middle,
//                 not a null gesture. It is never a select — the deck glides, the card that
//                 arrives is then the one a second click chooses.
//
// The drag swallow is untouched and still binds: `useCarouselGlide`'s capture-phase listener
// sits on the VIEWPORT, an ancestor of every card, so a release that ends over a FLANK is eaten
// before this handler is ever reached. A drag is not a warp order, and never becomes one.
//
// While the guard ribbon is armed the ribbon owns the centered card (`guard` is only ever true
// there). A flank click routes through the gallery's `go()`, which dismisses the ribbon and
// moves — the same rule an ArrowRight has held since Wave D, on the gesture that means the same
// thing.
function onCardClick() {
  if (!props.isActive) {
    emit("warp");
    return;
  }
  if (!props.guard) emit("select");
}

// ── THE LIVE CENTER FACE (Wave C2) ──
// When this card is `live`, it renders a bare `.live-face-fit` mount and hands that DOM element
// UP; App teleports the ONE board's subtree into it. On becoming un-live (navigate away / the
// gallery closing), it hands `null` so App parks the board back home. The element travels up as
// a value — pencil imports nothing from games.
const liveFaceFit = ref<HTMLElement | null>(null);
watch(
  () => props.live,
  async (isLive) => {
    if (isLive) {
      await nextTick(); // the mount exists after the patch
      emit("face-mount", liveFaceFit.value);
    } else {
      emit("face-mount", null);
    }
  },
  { immediate: true },
);
onUnmounted(() => {
  if (props.live) emit("face-mount", null); // never strand the board in an unmounting card
});

// ── THE DEAL entrance (Wave C2 §BEAT 2) ──
// A flank draws IN onto the desk: `dealReveal` 0→1 fades it up + settles a small lift. A
// compositor-only channel (opacity + translate) on its OWN wrapper — separate from the depth
// scale (`.game-card`) and the chime bloom (`.game-card-frame`), so the three never fight, and
// it leaves no steady-state cost (settles at 1, the sequence self-removes). No paint at rest.
const dealStyle = computed(() => {
  const r = props.dealReveal ?? 1;
  return {
    opacity: String(r),
    transform: `translateY(${((1 - r) * 9).toFixed(2)}px)`,
  };
});
</script>

<template>
  <div
    :id="`gallery-card-${index}`"
    class="game-card"
    :class="{ 'is-center': isActive, 'is-chiming': isActive }"
    role="option"
    :aria-selected="isActive"
    :aria-label="ariaLabel"
    @click.stop="onCardClick"
  >
    <!-- `inert` scopes to the card's INTERNALS, never the option root (T5-W3 3.3): inert on
         the root strips the whole node from the accessibility tree, and the deck published a
         one-item listbox for the life of the carousel. The internals are what carried the
         property worth having — no tab stops, no hit targets in a flank — and they still do;
         the option itself stays named and selectable-by-AT. Pointer selection is gated in
         `onCardClick`, which is why the root can afford to be live. -->
    <div class="game-card-deal" :style="dealStyle" :inert="!isActive || undefined">
      <HandDrawnOutline
        class="game-card-frame"
        :style="frameStyle"
        :pose="pose"
        :stroke-width="4"
        :outset="6"
      >
        <div class="game-card-paper cartoon-shadow-md edge-outlined bg-card">
          <div class="game-card-face">
            <!-- THE LIVE CENTER FACE (Wave C2): a bare mount App teleports the ONE live board
                 into (state + marks preserved). Rendered ONLY for the current-game centered
                 card; every other face is the static poster below. -->
            <div v-if="live" class="live-face-slot">
              <div ref="liveFaceFit" class="live-face-fit"></div>
            </div>
            <Suspense v-else>
              <component :is="Poster" />
              <template #fallback>
                <div class="game-card-face-blank" />
              </template>
            </Suspense>
          </div>
          <div class="game-card-caption">
            <svg
              class="game-card-name"
              :viewBox="nameViewBox"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <text x="4" y="46" text-anchor="start" class="card-wordmark">
                {{ card.name }}
              </text>
            </svg>
            <!-- The snap chime's scribble underline — drawn left-to-right on settle, present
               only on the centered card (§chime). Decorative; the name is the SVG above. -->
            <div
              v-if="isActive"
              class="game-card-underline"
              :style="underlineStyle"
              aria-hidden="true"
            />
            <span class="game-card-range">{{ rangeLine }}</span>
          </div>
        </div>
      </HandDrawnOutline>
    </div>
  </div>
</template>

<style scoped>
.game-card {
  /* Fill the slot so the card's width is the carousel geometry (drives the snap centering
     + the mobile neighbor peek), not intrinsic content width. */
  width: 100%;
  /* Depth without paint (§6): a flank rests scaled + dimmed, the center full. A STATIC
     state keyed off `.is-center`, not a perpetual animation — it only moves on a snap, and
     transform + opacity are compositor channels (no re-raster of the card box). */
  transform: scale(0.9);
  opacity: 0.62;
  transform-origin: center center;
  transition:
    transform var(--card-step-ms, 440ms) var(--ease-glassGlide),
    opacity var(--card-step-ms, 440ms) var(--ease-glassGlide);
  will-change: transform, opacity;
}

.game-card.is-center {
  transform: scale(1);
  opacity: 1;
}

/* The deal wrapper (Wave C2 §BEAT 2) — its OWN compositor channel (opacity + a small lift),
   driven by the gallery's one-shot deal sequence, separate from the depth scale above and the
   chime bloom on the frame. At rest it is opacity:1 / no transform (zero steady-state cost);
   the sequence eases it, so no CSS transition is needed here. */
.game-card-deal {
  display: block;
  width: 100%;
}

/* THE LIVE CENTER FACE (Wave C2) — the face box the ONE live board is teleported into. It
   reserves the poster's 1/1 geometry (so the carousel layout is byte-unchanged), clips the
   projected board to the face, and centers it. `.live-face-fit` shrink-wraps the full board
   and App scales it (`--live-fit`) to fit — a COMPOSITOR scale, so the board keeps its
   playing-view raster (the crit kill: layout size never tweened, the board only travels). */
.live-face-slot {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
}

.live-face-fit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(var(--live-fit, 1));
  transform-origin: center center;
}

/* Fine-pointer only: a card reads as pressable. Coarse pointers get NO hover state (the
   gallery's `is-coarse` guard + this media query — the pencil-pure realization of §10's "no
   hover states (coarse pointer)").
   T8 M10: the FLANKS carry it too, because they answer a click now (they warp to center). The
   deck's own `cursor: grab` still owns the air between the cards, so the two affordances stay
   legible — grab the spread, point at a card. */
@media (hover: hover) and (pointer: fine) {
  .game-gallery:not(.is-coarse) .game-card {
    cursor: pointer;
  }

  /* THE INK LIFT (T8 M5, agent C's boil census — R2 in this fence). A card's words are the
     label of a control and said nothing when pointed at.
     IT LANDS ON THE SUB-LINE ALONE, and that is a correction to the prescription rather than a
     narrowing of it: the name is already full-strength ink (`.game-card-name` declares
     `color: var(--color-foreground)` and `.card-wordmark` fills with `currentColor`), so a
     `fill: var(--color-foreground)` there computes to the value it already had — a declaration
     that says "hover" and paints nothing. The muted register on this card is the range line,
     and lifting muted → foreground is the estate's ink-lift exactly.
     EVERY card carries it, not just the centered one, and that is M10's doing: a flank answers
     a click now (it warps), so a flank is a control and has to say so. What still separates
     them is the DEPTH grammar, which is the right channel for it — a flank rests at scale 0.9
     and opacity 0.62 and stays there while its ink lifts, so the hover reads as "this one
     answers" without ever reading as "this one is live". */
  .game-gallery:not(.is-coarse) .game-card:hover .game-card-range {
    color: var(--color-foreground);
  }
}

.game-card-frame {
  display: block;
  width: 100%;
  /* The snap chime's wobble bloom rides THIS element's transform (frame + face together),
     a channel separate from the depth-scale on `.game-card` so the two never fight; promoted
     only while chiming so the bloom is compositor-only (no pose re-raster). */
  transform-origin: center center;
}

.game-card.is-chiming .game-card-frame {
  will-change: transform;
}

.game-card-paper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.9rem 0.9rem 1.05rem;
  border-radius: 0.9rem;
}

.game-card-face {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
}

.game-card-face-blank {
  width: 100%;
  height: 100%;
}

.game-card-caption {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  text-align: center;
}

.game-card-name {
  height: 1.9rem;
  width: 100%;
  max-width: 100%;
  color: var(--color-foreground);
  display: block;
}

.card-wordmark {
  font-family: var(--font-display);
  font-weight: 900;
  /* viewBox geometry, not a type rung (the logo's convention): user units in the 60-unit
     box, baseline y=46. The rendered size rides the SVG height above. */
  font-size: 48px;
  letter-spacing: 0.02em;
  fill: currentColor;
}

/* The scribble underline: a hand-drawn stroke under the name, revealed left-to-right by the
   chime (`--draw` 0→1 clips the right edge back). Sits in the caption's 0.1rem gap band. */
.game-card-underline {
  width: 62%;
  height: 8px;
  margin-top: -0.05rem;
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 100% 8px;
  clip-path: inset(0 calc((1 - var(--draw, 0)) * 100%) 0 0);
}

.game-card-range {
  font-family: var(--font-hand);
  font-size: var(--type-body, 1rem);
  line-height: 1.1;
  color: var(--color-muted-foreground);
  letter-spacing: 0.01em;
  transition: color 150ms var(--ease-standard);
}

@media (prefers-reduced-motion: reduce) {
  .game-card {
    /* Depth snaps under PRM — the state is reachable, nothing tweens. */
    transition: none;
    will-change: auto;
  }
  .game-card.is-chiming .game-card-frame {
    will-change: auto;
  }
  /* The hover lift lands, it just doesn't travel. */
  .game-card-range {
    transition: none;
  }
}
</style>
