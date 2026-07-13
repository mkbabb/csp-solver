<script setup lang="ts">
import { computed, ref } from "vue";
import HandwrittenGlyph from "@pencil/glyph/HandwrittenGlyph.vue";
import { getVariant, toDisplayChar } from "@pencil/glyph/glyphRegistry";
import { useLongPress } from "@games/shared/useLongPress";

const props = defineProps<{
  position: number;
  value: number;
  isGiven: boolean;
  isOverridden: boolean;
  isSolved: boolean;
  isRevealed: boolean;
  noiseDelay: number;
  boardSize: number;
  /** Pre-computed ghost rect path in 1000×1000 board viewBox coords */
  ghostPath: string;
  /** 1-based grid coordinates (ARIA grid + aria-label derivation, §4.1) */
  rowIndex: number;
  colIndex: number;
  /** Roving tabindex (§4.1): 0 for the one focused cell, -1 for every other. */
  tabIndex: number;
  /** This cell participates in a Latin-square duplicate or inequality violation (§1.4/§4.2). */
  isInvalid: boolean;
  /** Folded inequality constraints touching this cell (F6) — e.g. "greater than the cell to
   *  the right and less than the cell below". Empty when the cell borders no caret. Appended
   *  to the accessible name so a screen reader hears the relation while arrowing the grid; the
   *  caret glyphs themselves are aria-hidden. */
  constraintLabel: string;
  /** Engine-domains pencil marks (W6 beat 9): surviving candidate values from
   *  the solver's own propagation, present only while the peek gesture is held.
   *  Rendered only while the cell is empty. Twin of SudokuCell's (D16). */
  marks?: number[];
  /** T3-W13 §4.1 — the board's `celebrating`, forwarded to the glyph's flourish
   *  gate: solve reveals keep beat-2, a hint stops at the written glyph. */
  flourish?: boolean;
}>();

const emit = defineEmits<{
  (e: "update", position: number, value: number): void;
  (e: "cellFocus", position: number): void;
  /** Long-press peek (T4-WM §3) — twin of SudokuCell's: a hold on this EMPTY cell opens the
   *  candidate glimpse; the board forwards these up to the game's marks activation. */
  (e: "candidatePeekStart"): void;
  (e: "candidatePeekEnd"): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isHovered = ref(false);
const isFocused = ref(false);

const isActive = computed(() => isHovered.value || isFocused.value);

// Compute the cell's viewBox region in 1000×1000 board coords
const cellViewBox = computed(() => {
  const cellSize = 1000 / props.boardSize;
  const col = props.position % props.boardSize;
  const row = Math.floor(props.position / props.boardSize);
  const pad = cellSize * 0.15;
  const x = col * cellSize - pad;
  const y = row * cellSize - pad;
  const w = cellSize + pad * 2;
  const h = cellSize + pad * 2;
  return `${x} ${y} ${w} ${h}`;
});

const displayValue = computed(() => {
  if (props.value === 0) return "";
  return String(props.value);
});

const glyphChar = computed(() => toDisplayChar(props.value, props.boardSize));

const cellKind = computed<"empty" | "given" | "user" | "solved">(() => {
  if (props.value === 0) return "empty";
  if (props.isSolved) return "solved";
  if (props.isGiven && !props.isOverridden) return "given";
  return "user";
});

const ariaLabel = computed(() => {
  const loc = `Row ${props.rowIndex}, column ${props.colIndex}`;
  let core: string;
  switch (cellKind.value) {
    case "given":
      core = `given clue ${glyphChar.value}`;
      break;
    case "user":
      core = `your entry ${glyphChar.value}`;
      break;
    case "solved":
      core = `solver's answer ${glyphChar.value}`;
      break;
    default:
      core = "empty";
  }
  const base = `${loc}, ${core}`;
  // F6: the inequality is a property of the CELL to the reader, not a free-floating glyph.
  return props.constraintLabel ? `${base}, ${props.constraintLabel}` : base;
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const raw = target.value.replace(/\D/g, "");

  if (raw === "") {
    emit("update", props.position, 0);
    target.value = "";
    return;
  }

  // Board sizes are 4..7 (single digit), so the last digit is the entry — enables one-click override.
  const trimmed = raw.slice(-1);
  const num = parseInt(trimmed, 10);
  if (num >= 1 && num <= props.boardSize) {
    emit("update", props.position, num);
    target.value = String(num);
  } else {
    target.value = displayValue.value;
  }
}

function handleKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement;
  if (event.key === "Backspace" || event.key === "Delete") {
    emit("update", props.position, 0);
    target.value = "";
    event.preventDefault();
  }
  // Arrow / Home / End fall through to the board's roving-tabindex controller.
}

function focusInput() {
  inputRef.value?.focus();
}

function onFocus() {
  isFocused.value = true;
  emit("cellFocus", props.position);
}

// ── Long-press peek (T4-WM §3, lane E) — twin of SudokuCell's ─────────
// A press-and-hold on an EMPTY cell opens its candidate glimpse (engine-domains pencil marks,
// marks-only), mirroring the shipped hold-to-peek grammar; the gesture funnels up (cell → board →
// game) to the shared marks activation, and release/cancel/leave dismisses it. Pointer Events only
// (contextmenu never fires on iOS); `useLongPress` fires the honest `vibrateOnce` on recognition.
// Read-only. A recognized hold sets `suppressClick` so the tap that ends it can't focus/raise the
// keyboard; a plain tap still focuses. The flag resets at the next pointerdown.
let suppressClick = false;
const longPress = useLongPress({
  onLongPress: () => {
    suppressClick = true;
    emit("candidatePeekStart");
  },
  onRelease: () => emit("candidatePeekEnd"),
});
function onCellPointerDown(e: PointerEvent) {
  suppressClick = false;
  if (props.value !== 0) return; // only an empty cell has a candidate glimpse to show
  longPress.onPointerDown(e);
}
function onCellClick() {
  if (suppressClick) {
    suppressClick = false;
    return;
  }
  focusInput();
}

// ── Engine-domains pencil marks (W6 beat 9) ──────────────────────────
// The mini-grid keeps the classic pencil-mark convention: value v always sits
// at slot v (row-major), so a candidate's *position* encodes its value. With
// no subgrid to borrow (Futoshiki is a plain Latin square, boardSize 4..7),
// the grid is the tightest ceil(√boardSize) rectangle — 2×2 for 4, 3 columns
// for 5..7. Each mark reuses the hand-drawn glyph paths (variant picked per
// cell+value so neighboring marks don't stamp identically), faint graphite.
const showMarks = computed(() => props.value === 0 && (props.marks?.length ?? 0) > 0);
function markPath(v: number): string {
  return (
    getVariant(toDisplayChar(v, props.boardSize), props.position * 31 + v)?.d ?? ""
  );
}
const markCols = computed(() => Math.ceil(Math.sqrt(props.boardSize)));
const marksGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${markCols.value}, minmax(0, 1fr))`,
  gridTemplateRows: `repeat(${Math.ceil(props.boardSize / markCols.value)}, minmax(0, 1fr))`,
}));

defineExpose({ focus: focusInput });
</script>

<template>
  <div
    class="futoshiki-cell relative flex items-center justify-center"
    role="gridcell"
    :aria-rowindex="rowIndex"
    :aria-colindex="colIndex"
    :class="{
      'cell-reveal-animated': isRevealed,
      'is-active': isActive,
      'is-invalid': isInvalid,
    }"
    :style="isRevealed ? { '--reveal-delay': `${noiseDelay}ms` } : undefined"
    @click="onCellClick"
    @pointerdown="onCellPointerDown"
    @pointermove="longPress.onPointerMove"
    @pointerup="longPress.onPointerUp"
    @pointercancel="longPress.onPointerCancel"
    @pointerleave="longPress.onPointerCancel"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Native bounded entry (T4-WM §1) — twin of SudokuCell's (D16): the opacity-0 input is
         the sole entry surface on every pointer. `inputmode=numeric` raises the iOS digit pad;
         `type=text` lets `maxlength` bound the cell; the autocorrect/autocapitalize/spellcheck
         trio + `enterkeyhint` are the iOS congruence set. The @input/@keydown write path is
         byte-identical to the keyboard's. Futoshiki is single-digit (4..7), maxlength 2 = the
         digit width + 1 in-place-override char handleInput slices down. -->
    <input
      ref="inputRef"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      enterkeyhint="done"
      :value="displayValue"
      maxlength="2"
      :tabindex="tabIndex"
      :aria-label="ariaLabel"
      :aria-invalid="isInvalid || undefined"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="onFocus"
      @blur="isFocused = false"
      class="cell-native-input absolute inset-0 h-full w-full cursor-pointer bg-transparent text-center opacity-0 outline-none"
    />

    <!-- Engine-domains pencil marks (W6 beat 9): the solver's propagated
         candidate domains rendered as tiny graphite marks while the peek
         gesture is held. Decorative (aria-hidden) — the peek laminate's own
         status announcement carries the gesture for AT; the candidate fold
         into the accessible name stays booked with the tranche-III row. -->
    <div
      v-if="showMarks"
      class="pencil-marks pointer-events-none absolute grid"
      :style="marksGridStyle"
      aria-hidden="true"
    >
      <div v-for="v in boardSize" :key="v" class="mark-slot">
        <!-- T3-W13 §4.2 — each mark WRITES inside the kept container fade:
                 pathLength="1" + the global pencil-draw-on primitive, staggered by
                 candidate ORDER (compact: a 3-candidate cell spans 0–40ms). Twin of
                 SudokuCell's (D16). -->
        <svg
          v-if="marks!.includes(v)"
          class="mark-glyph"
          viewBox="0 0 40 56"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :d="markPath(v)"
            pathLength="1"
            class="pencil-draw-on"
            :style="{
              '--draw-dur': '160ms',
              '--draw-delay': `${marks!.indexOf(v) * 20}ms`,
            }"
            fill="none"
            stroke="currentColor"
            stroke-width="4.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- SVG handwritten glyph overlay -->
    <HandwrittenGlyph
      v-if="value !== 0"
      :value="glyphChar"
      :is-given="isGiven"
      :is-overridden="isOverridden"
      :is-solved="isSolved"
      :is-revealed="isRevealed"
      :noise-delay="noiseDelay"
      :position="position"
      :board-size="boardSize"
      :is-hovered="isHovered"
      :flourish="flourish"
    />

    <!-- Ghost cell highlight — three-tier pencil-sketch focus/hover/invalid ring (§4.2). -->
    <div
      class="cell-ghost pointer-events-none absolute inset-0"
      :class="{ 'is-active': isActive }"
    >
      <svg
        class="absolute inset-0 h-full w-full overflow-visible"
        :viewBox="cellViewBox"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path :d="ghostPath" pathLength="1" class="cell-ghost-path" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* ── Engine-domains pencil marks (W6 beat 9) ─────────────────────────
   Faint graphite, deliberately lighter than any inked glyph — these are
   the solver thinking in the margins, not an answer. The soft fade-in
   keeps marks from popping as the peek lays down (opacity-only, Band C
   one-shot; from-only keyframe so the settled opacity is the cascade
   value — the contrast arm below still wins). Static under PRM: no
   boil, no fade, the marks are simply there while the peek is held.
   Twin of SudokuCell's (D16). */
.pencil-marks {
  inset: 12%;
  color: var(--color-pencil-graphite, var(--grid-line-color));
  opacity: 0.5;
  animation: marks-fade-in 250ms ease-out both;
}

.mark-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8%;
}

.mark-glyph {
  width: 100%;
  height: 100%;
  overflow: visible;
}

@keyframes marks-fade-in {
  from {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pencil-marks {
    animation: none;
  }
}

/* prefers-contrast: press the pencil a little harder, same as the ghost. */
@media (prefers-contrast: more) {
  .pencil-marks {
    opacity: 0.75;
  }
}

/* Ghost wrapper — instant show/hide for cursor-tracking responsiveness */
.cell-ghost {
  opacity: 0;
}

.cell-ghost.is-active {
  opacity: 1;
}

/* Conflict mark persists whether or not the cell is hovered/focused (§1.4). */
.futoshiki-cell.is-invalid .cell-ghost {
  opacity: 1;
}

/* Tier 1 — hover / base: graphite pencil border + faint tinted fill (§4.2). */
.cell-ghost-path {
  fill: var(--color-pencil-graphite, var(--grid-line-color));
  fill-opacity: 0.06;
  stroke: var(--color-pencil-graphite, var(--grid-line-color));
  stroke-width: 5;
  stroke-opacity: 0.65;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Tier 2 — keyboard focus: crayon-blue, heavier, sketched on over 180ms. */
.futoshiki-cell:has(input:focus-visible) .cell-ghost-path {
  fill: var(--color-focus-sketch, var(--color-crayon-blue));
  fill-opacity: 0.08;
  stroke: var(--color-focus-sketch, var(--color-crayon-blue));
  stroke-width: 7;
  stroke-opacity: 0.9;
  stroke-dasharray: 1;
  animation: ghost-draw-on 180ms cubic-bezier(0.215, 0.61, 0.355, 1) both;
}

@keyframes ghost-draw-on {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* Tier 3 — aria-invalid conflict: the teacher's red pencil. Tier collisions are resolved
   by specificity, never source order — this (0,3,0) rule loses every shared property to
   tier-2's (0,3,1); the focused-and-conflicting case is owned by the tier-2×3 compound
   rule below. */
.futoshiki-cell.is-invalid .cell-ghost-path {
  fill: var(--color-teacher-red, var(--color-crayon-rose));
  fill-opacity: 0.1;
  stroke: var(--color-teacher-red, var(--color-crayon-rose));
  stroke-width: 9;
  stroke-opacity: 1;
}

/* Tier 2×3 — focused AND conflicting: the teacher's red pencil, pressed harder.
   (0,4,1) beats tier-2's (0,3,1); every tier-2 paint property is re-asserted —
   partial overrides leak blue through the higher-specificity focus rule.
   ghost-draw-on is deliberately NOT suppressed: it re-sketches in red as the
   focus cue (the ghost is this cell's only focus affordance; PRM block governs). */
.futoshiki-cell.is-invalid:has(input:focus-visible) .cell-ghost-path {
  fill: var(--color-teacher-red, var(--color-crayon-rose));
  fill-opacity: 0.16;
  stroke: var(--color-teacher-red, var(--color-crayon-rose));
  stroke-width: 10;
  stroke-opacity: 1;
}

/* Neutralize the generic global focus-within ring — the SVG ghost is the focus affordance. */
.futoshiki-cell:focus-within {
  background: transparent;
  outline: none;
}

/* iOS zoom de-risk (T4-WM §1) — twin of SudokuCell's: 16px is the structural floor that keeps
   mobile Safari from zooming the focused input. The input is opacity-0, so it costs nothing
   visually and never trades away pinch-zoom (`maximum-scale`, WCAG 1.4.4). */
.cell-native-input {
  font-size: 16px;
  /* T4-WM §2 — twin of SudokuCell's: kill the iOS gray tap-flash on the opacity-0 entry
     input so the pencil ghost stays the sole focus voice on tap. Scoped to this lane's entry
     surface, additive to lane C's global sweep; the :focus-visible ring stays lane A's. */
  -webkit-tap-highlight-color: transparent;
}

@media (prefers-reduced-motion: reduce) {
  .futoshiki-cell:has(input:focus-visible) .cell-ghost-path {
    animation: none;
    stroke-dashoffset: 0;
  }
}

@media (prefers-contrast: more) {
  .cell-ghost-path {
    stroke-opacity: 0.9;
  }
  .futoshiki-cell.is-invalid .cell-ghost-path {
    stroke-opacity: 1;
  }
}

.futoshiki-cell {
  overflow: visible;
  contain: layout style;
}
.futoshiki-cell.is-active {
  z-index: 10;
}
</style>
