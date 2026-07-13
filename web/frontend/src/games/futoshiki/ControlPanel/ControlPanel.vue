<script setup lang="ts">
/**
 * Futoshiki control panel — own file, not shared with Sudoku's (games never import each
 * other; F5 flags `size` vs `board_size` as a live footgun against any shared-panel
 * temptation). The twin of the Sudoku panel: a board-size selector, a difficulty selector
 * (T4-W6 GEN-2 grew the axis — no longer size-only), the hold-to-peek BoilDivider, and the
 * action + play-tool buttons.
 */
import { computed, ref, onBeforeUnmount } from "vue";
import SolveIcon from "@pencil/chrome/icons/SolveIcon.vue";
import FillForcedIcon from "@pencil/chrome/icons/FillForcedIcon.vue";
import DiceIcon from "@pencil/chrome/icons/DiceIcon.vue";
import EraserIcon from "@pencil/chrome/icons/EraserIcon.vue";
import ShareIcon from "@pencil/chrome/icons/ShareIcon.vue";
import UndoIcon from "@pencil/chrome/icons/UndoIcon.vue";
import RedoIcon from "@pencil/chrome/icons/RedoIcon.vue";
import HintIcon from "@pencil/chrome/icons/HintIcon.vue";
import OptionSelector from "@pencil/chrome/OptionSelector/OptionSelector.vue";
import KeyboardLegend from "@pencil/chrome/KeyboardLegend.vue";
import PencilModeToggle from "@games/shared/PencilModeToggle.vue";
import AssistSettings from "@games/shared/AssistSettings.vue";
import BoilDivider from "@pencil/chrome/BoilDivider.vue";
import SheetWashiLabel from "@pencil/sheet/SheetWashiLabel.vue";
import ScribbleLoader from "@pencil/chrome/ScribbleLoader.vue";
import { useTheme } from "@/composables/useTheme";
import { useButtonAnimation } from "@games/shared/useButtonAnimation";
import { useCoarsePointer } from "@games/shared/useCoarsePointer";
import type { Difficulty } from "@games/futoshiki/types";
import type { PencilMode } from "@games/shared/useUserMarks";
import type { ErrorCheckMode } from "@games/shared/useAssists";
import { boardSizeOptions, difficultyOptions } from "./constants";

const { isDark } = useTheme();

// Underline boil: brief burst on selection change, then settle
const boilFrame = ref(0);
let boilTimer: ReturnType<typeof setTimeout> | null = null;

function triggerBoil() {
  if (boilTimer) clearTimeout(boilTimer);
  let frame = 1;
  boilFrame.value = frame;
  const tick = () => {
    frame++;
    if (frame >= 5) {
      boilFrame.value = 0;
      boilTimer = null;
      return;
    }
    boilFrame.value = frame;
    boilTimer = setTimeout(tick, 120);
  };
  boilTimer = setTimeout(tick, 120);
}

const panelFilter = computed(() =>
  isDark.value ? "url(#stroke-dark)" : "url(#stroke-light)",
);

const props = defineProps<{
  boardSize: number;
  difficulty: Difficulty;
  loading: boolean;
  solveState: string;
  mobile?: boolean;
  // T4-W8 ROW 1 (twin of the sudoku panel's) — the active pencil-marks mode, relayed to the
  // shared PencilModeToggle; the panel just plumbs the game-agnostic chrome.
  pencilMode: PencilMode;
  // T4-W8 ROW 2 + ROW 3 (twin of the sudoku panel's) — the board-assist settings relayed to the
  // shared AssistSettings: the error-check mode + the persistent-candidates pin.
  errorCheckMode: ErrorCheckMode;
  candidatesPinned: boolean;
  // T4-W3 share-truth (twin of the sudoku panel's): the parent's share act as a callback,
  // not an emit, so the OUTCOME travels back — it resolves iff the clipboard copy landed.
  share: () => Promise<void>;
}>();

const emit = defineEmits<{
  (e: "update:boardSize", value: number): void;
  (e: "update:difficulty", value: Difficulty): void;
  (e: "randomize"): void;
  (e: "clear"): void;
  (e: "solve"): void;
  // T4-W8 (twin of the sudoku panel's) — the fill-forced partial solve (W7's fillAllForced):
  // ink every naked+hidden single now present in one sweep. The game routes it to the
  // composable's `fillForced`, which rides the existing reveal draw-in; the panel reports the press.
  (e: "fill-forced"): void;
  (e: "peek-start"): void;
  (e: "peek-end"): void;
  // T4-WM §2 — the touch surface for the play tools (twin of the sudoku panel's): undo/redo
  // carry no argument; hint routes through the board's own focused-cell method (this panel is
  // the board's sibling and holds no focus state), riding the same emit path as the board's H.
  (e: "undo"): void;
  (e: "redo"): void;
  (e: "hint"): void;
  // T4-W8 ROW 1 — the pencil-marks mode changed (v-model seam to the game's user-mark store).
  (e: "update:pencilMode", value: PencilMode): void;
  // T4-W8 ROW 2 + ROW 3 — the assist settings changed (v-model seams to the game's useAssists).
  (e: "update:errorCheckMode", value: ErrorCheckMode): void;
  (e: "update:candidatesPinned", value: boolean): void;
}>();

// UI-12 (twin of the sudoku panel's): the mobile Board-Size / Difficulty tabs each show only
// the active panel's options, so the inactive tab's current value would be invisible while the
// other is open — surface it small + graphite beneath the inactive heading (`heading-value`).
const expandedPanel = ref<"boardSize" | "difficulty">("boardSize");
const boardSizeValueLabel = computed(
  () => boardSizeOptions.find((o) => o.value === props.boardSize)?.label ?? "",
);
const difficultyValueLabel = computed(
  () => difficultyOptions.find((o) => o.value === props.difficulty)?.label ?? "",
);

// ── Hold-to-peek gesture on the BoilDivider (the hold surface) ──
const PEEK_HOLD_MS = 350;
let peekTimer: ReturnType<typeof setTimeout> | null = null;
const isPeeking = ref(false);

function onDividerHoldStart() {
  if (peekTimer) clearTimeout(peekTimer);
  peekTimer = setTimeout(() => {
    peekTimer = null;
    isPeeking.value = true;
    emit("peek-start");
  }, PEEK_HOLD_MS);
}

function onDividerHoldEnd() {
  if (peekTimer) {
    clearTimeout(peekTimer);
    peekTimer = null;
  }
  if (isPeeking.value) {
    isPeeking.value = false;
    emit("peek-end");
  }
}

onBeforeUnmount(() => {
  if (peekTimer) clearTimeout(peekTimer);
  if (isPeeking.value) emit("peek-end");
  if (shareConfirmTimer) clearTimeout(shareConfirmTimer);
  if (clearArmTimer) clearTimeout(clearArmTimer);
});

// ── Share-on-demand permalink (W6; T4-W3 share-truth) — twin of the sudoku panel's ──
// `props.share()` resolves iff the clipboard copy actually landed. Confirm ("copied!") ONLY
// on resolve; on reject (insecure context, permission-policy denial, absent Clipboard API)
// the `?board=` link is still live in the address bar — so say exactly that. The washi,
// sublabel, and aria-label all track the REAL outcome, never an optimistic assertion.
const { animating: shareAnimating, trigger: triggerShare } = useButtonAnimation(500);
const shareState = ref<"idle" | "copied" | "failed">("idle");
let shareConfirmTimer: ReturnType<typeof setTimeout> | null = null;
async function onShare() {
  triggerShare();
  let copied = true;
  try {
    await props.share();
  } catch {
    copied = false;
  }
  shareState.value = copied ? "copied" : "failed";
  if (shareConfirmTimer) clearTimeout(shareConfirmTimer);
  // The failure line runs longer — it points the reader to the address bar, more to read.
  shareConfirmTimer = setTimeout(
    () => {
      shareState.value = "idle";
    },
    copied ? 1600 : 3600,
  );
}
const shareAria = computed(() =>
  shareState.value === "copied"
    ? "Link copied"
    : shareState.value === "failed"
      ? "couldn't copy — link is in the address bar"
      : "Share board link",
);
const shareSublabel = computed(() =>
  shareState.value === "copied"
    ? "copied!"
    : shareState.value === "failed"
      ? "in address bar"
      : "Share",
);
const shareWashi = computed(() =>
  shareState.value === "copied"
    ? "copied!"
    : shareState.value === "failed"
      ? "couldn't copy — link is in the address bar"
      : "share link",
);

const { animating: solveAnimating, trigger: triggerSolve } = useButtonAnimation(500);
const { animating: fillAnimating, trigger: triggerFill } = useButtonAnimation(500);
const { animating: randomizeAnimating, trigger: triggerRandomize } =
  useButtonAnimation(500);
const { animating: clearAnimating, trigger: triggerClear } = useButtonAnimation(400);

function onRandomize() {
  triggerRandomize();
  emit("randomize");
}

// T4-W8 (twin of the sudoku panel's) — fill-forced (W7's fillAllForced): the icon marks draw
// themselves in on the press, and the game inks the forced cells through the board's reveal wave.
function onFillForced() {
  triggerFill();
  emit("fill-forced");
}

// UI-5 confirm beat on Clear — twin of the sudoku panel's (recorded design call there):
// destructive (wipes board + undo history), so coarse pointers take two taps in the
// transient-label grammar; fine pointers keep the one-click Clear.
const isCoarse = useCoarsePointer();
const clearArmed = ref(false);
let clearArmTimer: ReturnType<typeof setTimeout> | null = null;
function onClear() {
  if (isCoarse.value && !clearArmed.value) {
    clearArmed.value = true;
    clearArmTimer = setTimeout(() => {
      clearArmed.value = false;
    }, 2500);
    return;
  }
  if (clearArmTimer) {
    clearTimeout(clearArmTimer);
    clearArmTimer = null;
  }
  clearArmed.value = false;
  triggerClear();
  emit("clear");
}

function onSolve() {
  triggerSolve();
  emit("solve");
}

// T4-WM §2 — the play tools (twin of the sudoku panel's). Plain relays; the :active
// press-scale is the tap feedback and the game owns the undo/redo/hint act.
function onUndo() {
  emit("undo");
}
function onRedo() {
  emit("redo");
}
function onHint() {
  emit("hint");
}

function onBoardSizeChange(val: string | number) {
  emit("update:boardSize", val as number);
  triggerBoil();
}

function onDifficultyChange(val: string | number) {
  emit("update:difficulty", val as Difficulty);
  triggerBoil();
}
</script>

<template>
  <!-- Mobile layout -->
  <div v-if="mobile" class="control-panel-wrap mobile-control-panel mt-3">
    <div class="control-panel-filtered">
      <div class="mobile-heading-row">
        <button
          class="mobile-heading-btn"
          :aria-expanded="expandedPanel === 'boardSize'"
          @click="expandedPanel = 'boardSize'"
        >
          <h2
            class="section-heading text-muted-foreground"
            :class="{ 'is-active': expandedPanel === 'boardSize' }"
            aria-label="Board size"
          >
            Board Size
          </h2>
          <!-- UI-12: the current value, shown only while this tab is closed. -->
          <span v-if="expandedPanel !== 'boardSize'" class="heading-value">{{
            boardSizeValueLabel
          }}</span>
        </button>
        <button
          class="mobile-heading-btn"
          :aria-expanded="expandedPanel === 'difficulty'"
          @click="expandedPanel = 'difficulty'"
        >
          <h2
            class="section-heading transition-colors duration-250"
            :class="[
              difficulty === 'EASY'
                ? 'crayon-green'
                : difficulty === 'MEDIUM'
                  ? 'crayon-orange'
                  : 'crayon-rose',
              { 'is-active': expandedPanel === 'difficulty' },
            ]"
          >
            Difficulty
          </h2>
          <span v-if="expandedPanel !== 'difficulty'" class="heading-value">{{
            difficultyValueLabel
          }}</span>
        </button>
      </div>

      <OptionSelector
        v-show="expandedPanel === 'boardSize'"
        :options="boardSizeOptions"
        :selected="boardSize"
        :boil-frame="boilFrame"
        mobile
        @change="onBoardSizeChange"
      />

      <OptionSelector
        v-show="expandedPanel === 'difficulty'"
        :options="difficultyOptions"
        :selected="difficulty"
        :boil-frame="boilFrame"
        mobile
        @change="onDifficultyChange"
      />
    </div>

    <!-- Pencil-marks mode (T4-W8 ROW 1) — the shared toggle (Normal / Corner / Center); one
         component, both games. Arms the user-mark authoring seam on the frozen native input. -->
    <PencilModeToggle
      :mode="pencilMode"
      mobile
      @update:mode="emit('update:pencilMode', $event)"
    />

    <!-- Board assists (T4-W8 ROW 2 + ROW 3) — twin of the sudoku panel's: the error-check mode +
         persistent candidates, one shared component, both games. -->
    <AssistSettings
      :error-check-mode="errorCheckMode"
      :candidates-pinned="candidatesPinned"
      mobile
      @update:error-check-mode="emit('update:errorCheckMode', $event)"
      @update:candidates-pinned="emit('update:candidatesPinned', $event)"
    />

    <!-- Hold the boiling divider to peek at the answer key.
         UI-4: persistent washi on coarse pointers, pinned to the divider's own box;
         the surface pads to a ≥44px target there (CSS). -->
    <div
      class="peek-hold-surface group relative"
      @pointerdown="onDividerHoldStart()"
      @pointerup="onDividerHoldEnd()"
      @pointerleave="onDividerHoldEnd()"
      @pointercancel="onDividerHoldEnd()"
    >
      <BoilDivider />
      <SheetWashiLabel text="hold to peek" :seed="53" anchor="center" persistent />
    </div>

    <!-- Action buttons — UI-5: persistent sublabels in the pencil hand on coarse pointers. -->
    <div class="flex items-center justify-evenly">
      <button
        @click="onRandomize()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Randomize board"
      >
        <DiceIcon :size="28" :playing="randomizeAnimating" />
        <span class="icon-sublabel" aria-hidden="true">Randomize</span>
      </button>
      <button
        @click="onClear()"
        :disabled="loading"
        class="icon-btn"
        :aria-label="clearArmed ? 'Tap again to clear board' : 'Clear board'"
      >
        <span :class="{ 'eraser-scrub': clearAnimating }">
          <EraserIcon :size="28" />
        </span>
        <span
          class="icon-sublabel"
          :class="{ 'is-armed': clearArmed }"
          aria-hidden="true"
          >{{ clearArmed ? "sure?" : "Clear" }}</span
        >
      </button>
      <button
        @click="onFillForced()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Fill in the forced cells"
      >
        <FillForcedIcon :size="26" :playing="fillAnimating" />
        <span class="icon-sublabel" aria-hidden="true">Fill</span>
      </button>
      <button
        @click="onSolve()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Solve puzzle"
      >
        <ScribbleLoader
          v-if="loading && !solveAnimating"
          :size="22"
          class="text-muted-foreground"
        />
        <SolveIcon v-else :size="28" class="sparkle-icon" :playing="solveAnimating" />
        <span class="icon-sublabel" aria-hidden="true">Solve</span>
      </button>
      <button
        @click="onShare()"
        :disabled="loading"
        class="icon-btn"
        :aria-label="shareAria"
      >
        <ShareIcon :size="26" :class="{ 'share-pop': shareAnimating }" />
        <span class="icon-sublabel" aria-hidden="true">{{ shareSublabel }}</span>
      </button>
    </div>

    <!-- Play tools (T4-WM §2) — twin of the sudoku panel's coarse touch row for
         undo / redo / hint (the acts a fine pointer reaches by ⌘Z / ⇧⌘Z / H). Coarse-only
         (CSS gate): the desktop keeps its keys + legend, unchanged. -->
    <div class="play-controls">
      <button
        @click="onUndo()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Undo last move"
      >
        <UndoIcon :size="26" />
        <span class="icon-sublabel" aria-hidden="true">Undo</span>
      </button>
      <button
        @click="onRedo()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Redo move"
      >
        <RedoIcon :size="26" />
        <span class="icon-sublabel" aria-hidden="true">Redo</span>
      </button>
      <button
        @click="onHint()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Reveal a hint in the selected cell"
      >
        <HintIcon :size="26" />
        <span class="icon-sublabel" aria-hidden="true">Hint</span>
      </button>
    </div>
  </div>

  <!-- Desktop layout -->
  <div v-else class="control-panel-wrap flex flex-col items-center md:items-stretch">
    <div class="control-panel-filtered flex flex-col items-center md:items-stretch">
      <div class="flex flex-col items-center gap-1 md:items-stretch">
        <h2 class="section-heading text-muted-foreground" aria-label="Board size">
          Board Size
        </h2>
        <OptionSelector
          :options="boardSizeOptions"
          :selected="boardSize"
          :boil-frame="boilFrame"
          @change="onBoardSizeChange"
        />
      </div>

      <hr class="border-border/50 my-3 w-full" />

      <!-- Difficulty selector (T4-W6 GEN-2) — the twin of the sudoku panel's. -->
      <div class="flex flex-col items-center gap-1 md:items-stretch">
        <h2
          class="section-heading transition-colors duration-250"
          :class="
            difficulty === 'EASY'
              ? 'crayon-green'
              : difficulty === 'MEDIUM'
                ? 'crayon-orange'
                : 'crayon-rose'
          "
        >
          Difficulty
        </h2>
        <OptionSelector
          :options="difficultyOptions"
          :selected="difficulty"
          :boil-frame="boilFrame"
          @change="onDifficultyChange"
        />
      </div>
    </div>

    <!-- Pencil-marks mode (T4-W8 ROW 1) — the shared toggle (Normal / Corner / Center); the
         desktop twin of the mobile mount above. One component, both games. -->
    <PencilModeToggle
      :mode="pencilMode"
      @update:mode="emit('update:pencilMode', $event)"
    />

    <!-- Board assists (T4-W8 ROW 2 + ROW 3) — the desktop twin of the mobile mount above. -->
    <AssistSettings
      :error-check-mode="errorCheckMode"
      :candidates-pinned="candidatesPinned"
      @update:error-check-mode="emit('update:errorCheckMode', $event)"
      @update:candidates-pinned="emit('update:candidatesPinned', $event)"
    />

    <!-- Hold the boiling divider to peek at the answer key.
         L14: a washi label makes the hidden affordance discoverable — same tape
         grammar as the buttons; the native title yields to it (no double tooltip).
         UI-9: anchored to the divider's OWN box (the chip sits ON the ruled line);
         UI-4: persistent on coarse pointers, padded ≥44px target (CSS). -->
    <div
      class="peek-hold-surface group relative my-2"
      @pointerdown="onDividerHoldStart()"
      @pointerup="onDividerHoldEnd()"
      @pointerleave="onDividerHoldEnd()"
      @pointercancel="onDividerHoldEnd()"
    >
      <BoilDivider />
      <SheetWashiLabel text="hold to peek" :seed="53" anchor="center" persistent />
    </div>

    <!-- Action buttons — hover washi for fine pointers, persistent sublabels on coarse
         (UI-5: an iPad in the row regime reaches this layout with no hover). -->
    <div class="flex items-center justify-evenly">
      <button
        @click="onRandomize()"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Randomize board"
      >
        <DiceIcon :size="28" :playing="randomizeAnimating" />
        <span class="icon-sublabel" aria-hidden="true">Randomize</span>
        <SheetWashiLabel text="Randomize" :seed="11" />
      </button>

      <button
        @click="onClear()"
        :disabled="loading"
        class="icon-btn group relative"
        :aria-label="clearArmed ? 'Tap again to clear board' : 'Clear board'"
      >
        <span :class="{ 'eraser-scrub': clearAnimating }">
          <EraserIcon :size="28" />
        </span>
        <span
          class="icon-sublabel"
          :class="{ 'is-armed': clearArmed }"
          aria-hidden="true"
          >{{ clearArmed ? "sure?" : "Clear" }}</span
        >
        <SheetWashiLabel text="Clear" :seed="23" />
      </button>

      <button
        @click="onFillForced()"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Fill in the forced cells"
      >
        <FillForcedIcon :size="26" :playing="fillAnimating" />
        <span class="icon-sublabel" aria-hidden="true">Fill</span>
        <SheetWashiLabel text="fill forced" :seed="43" />
      </button>

      <button
        @click="onSolve()"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Solve puzzle"
      >
        <ScribbleLoader
          v-if="loading && !solveAnimating"
          :size="22"
          class="text-muted-foreground"
        />
        <SolveIcon v-else :size="28" class="sparkle-icon" :playing="solveAnimating" />
        <span class="icon-sublabel" aria-hidden="true">Solve</span>
        <SheetWashiLabel text="Solve" :seed="37" />
      </button>

      <button
        @click="onShare()"
        :disabled="loading"
        class="icon-btn group relative"
        :aria-label="shareAria"
      >
        <ShareIcon :size="26" :class="{ 'share-pop': shareAnimating }" />
        <span class="icon-sublabel" aria-hidden="true">{{ shareSublabel }}</span>
        <SheetWashiLabel
          :text="shareWashi"
          :seed="71"
          :wide="shareState === 'failed'"
        />
      </button>
    </div>

    <!-- Play tools (T4-WM §2) — coarse-only twin of the sudoku panel's: a fine desktop
         shows the legend below, a coarse iPad in this row-regime gets the tappable row. -->
    <div class="play-controls">
      <button
        @click="onUndo()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Undo last move"
      >
        <UndoIcon :size="26" />
        <span class="icon-sublabel" aria-hidden="true">Undo</span>
      </button>
      <button
        @click="onRedo()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Redo move"
      >
        <RedoIcon :size="26" />
        <span class="icon-sublabel" aria-hidden="true">Redo</span>
      </button>
      <button
        @click="onHint()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Reveal a hint in the selected cell"
      >
        <HintIcon :size="26" />
        <span class="icon-sublabel" aria-hidden="true">Hint</span>
      </button>
    </div>

    <!-- UI-7b: the keyboard legend (fine-pointer only — a keyboard is implied there). -->
    <KeyboardLegend />
  </div>
</template>

<style scoped>
.control-panel-wrap {
  font-family: var(--font-display);
  font-optical-sizing: auto;
}

.control-panel-filtered {
  filter: v-bind(panelFilter);
  /* R3 (W5 repair): own compositing layer — same defect as the sudoku panel
     (see its rule): H8's centered .app-layout moves this filtered card on any
     board-height change, and unlayered that move re-runs the 3-pass stroke
     filter raster. Layerized, a move is a compositor offset. */
  will-change: transform;
}

/* Crayon color utilities — the difficulty heading's tier tone (twin of the sudoku panel's).
   The heading is the panel's own element, so these scoped rules reach it; the OptionSelector
   option's `colorClass` is a child element in another scope (parity-latent, as in sudoku). */
.crayon-green {
  color: var(--color-crayon-green);
}
.crayon-orange {
  color: var(--color-crayon-orange);
}
.crayon-rose {
  color: var(--color-crayon-rose);
}

/* .section-heading type register lives in assets/typography.css (@layer
   components) — the √φ subheading→heading eyebrow, shared with sudoku (D4).
   Only the component-local hover flourish stays scoped here. */

/* Hover flourishes, FROZEN at one pose (T3-W13 §1-P4-ii): the per-beat filter
   write is retired (SvgFilters), so these static wobbles raster once per hover —
   a resting pointer never re-enrolls a live painter (the b1 node-1006 finding).
   T4-WM §2: fenced behind (hover: hover) — on touch the wobble filter stuck to the
   last-tapped heading (r2 §4 sticky-hover leak); a coarse pointer sees none of it. */
@media (hover: hover) {
  .section-heading:hover {
    filter: url(#wobble-heart);
  }
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.5rem;
  color: var(--color-muted-foreground);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 150ms;
  filter: url(#grain-static);
}

/* T4-WM §2: the icon-btn hover paint (bg + celestial wobble) stuck after a tap on touch
   (r2 §4) — fenced to hover-capable pointers. Coarse gets its sublabel + :active scale. */
@media (hover: hover) {
  .icon-btn:hover {
    color: var(--color-foreground);
    background: var(--color-accent);
    filter: url(#wobble-celestial);
  }
}

.icon-btn:active {
  transform: scale(0.93);
}

.icon-btn:disabled {
  opacity: 0.4;
  pointer-events: none;
}

.peek-hold-surface {
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.peek-hold-surface:active {
  cursor: grabbing;
}

/* UI-5: persistent icon sublabels — the pencil hand at caption scale, muted. Hidden on
   fine pointers (the hover washi carries the name there); written down on coarse. */
.icon-sublabel {
  display: none;
  font-family: var(--font-hand);
  font-size: var(--type-caption);
  line-height: 1;
  letter-spacing: var(--type-tracking-wide);
  color: var(--color-muted-foreground);
}

/* The armed Clear asks in the teacher's rose — the one moment a sublabel raises its voice. */
.icon-sublabel.is-armed {
  color: var(--color-crayon-rose);
  font-weight: 600;
}

/* ── Coarse pointers (T3-W11 U-A) — twin of the sudoku panel's block ────
   UI-4: ≥44px peek target (the divider stays a hairline visually; the persistent washi
   labels it). UI-5: icon actions write their names beneath the icon. Fine pointers
   match none of this. */
@media (pointer: coarse) {
  .peek-hold-surface {
    padding-block: 1rem;
  }

  .icon-btn {
    flex-direction: column;
    gap: 0.15rem;
    width: auto;
    height: auto;
    min-width: 2.75rem;
    min-height: 2.75rem;
    padding: 0.3rem 0.5rem;
  }

  .icon-sublabel {
    display: block;
  }
}

.sparkle-icon :deep(*) {
  stroke: url(#sparkle-rainbow) !important;
  fill: url(#sparkle-rainbow) !important;
}

.sparkle-icon {
  filter: drop-shadow(0 0 2px rgba(196, 181, 253, 0.3));
  transition: all 200ms;
}

@media (hover: hover) {
  .icon-btn:hover .sparkle-icon {
    filter: drop-shadow(0 0 5px rgba(196, 181, 253, 0.6));
  }
}

/* Play tools row (T4-WM §2) — undo / redo / hint, twin of the sudoku panel's. A COARSE
   affordance: hidden on a fine pointer (desktop keeps its keys + legend), shown as a
   tappable row on coarse (mobile card <lg OR iPad row-regime ≥lg). The buttons are plain
   .icon-btn, so the coarse block above gives them the 44px floor + written sublabels. */
.play-controls {
  display: none;
}

@media (pointer: coarse) {
  .play-controls {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 1rem;
    margin-top: 0.35rem;
  }
}

.mobile-control-panel {
  font-family: var(--font-display);
  font-optical-sizing: auto;
}

.mobile-heading-row {
  display: flex;
  justify-content: space-evenly;
}

.mobile-heading-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.05rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

/* UI-12: the inactive tab's current value — the pencil hand at caption scale, reduced-
   pressure graphite. Deliberately quiet: it names what's closed without competing with
   the active tab's underline. */
.heading-value {
  font-family: var(--font-hand);
  font-size: var(--type-caption);
  line-height: 1;
  letter-spacing: var(--type-tracking-wide);
  color: color-mix(
    in srgb,
    var(--color-pencil-graphite, var(--grid-line-color)) 60%,
    transparent
  );
}

.mobile-heading-btn .section-heading.is-active {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

/* Share pop — a small tape-press flourish on the share act (Band C one-shot). */
.share-pop {
  display: inline-flex;
  animation: sharePop 500ms ease;
}

@keyframes sharePop {
  0% {
    transform: scale(1) rotate(0deg);
  }
  30% {
    transform: scale(1.18) rotate(-6deg);
  }
  55% {
    transform: scale(0.96) rotate(4deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* Eraser scrub animation */
.eraser-scrub {
  display: inline-flex;
  animation: eraserScrub 400ms ease;
}

@keyframes eraserScrub {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  15% {
    transform: translateX(-4px) rotate(-8deg);
  }
  30% {
    transform: translateX(4px) rotate(6deg);
  }
  45% {
    transform: translateX(-3px) rotate(-5deg);
  }
  60% {
    transform: translateX(3px) rotate(4deg);
  }
  80% {
    transform: translateX(-1px) rotate(-1deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}
</style>
