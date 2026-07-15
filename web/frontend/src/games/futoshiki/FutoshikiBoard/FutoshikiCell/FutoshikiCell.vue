<script setup lang="ts">
import { computed } from "vue";
import HandwrittenGlyph from "@pencil/glyph/HandwrittenGlyph.vue";
import { useGameCell } from "@games/shared/useGameCell";
import type { PencilMode } from "@games/shared/useUserMarks";

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
  /** T4-W7 — this cell is part of the armed hint's reasoning (twin of SudokuCell's): a laminate
   *  wash lights in the peek-laminate tone on its own layer (behind the glyph + focus ring). */
  isBecause?: boolean;
  /** T4-W8 ROW 4 (twin of SudokuCell's) — this cell shares the focused cell's row or column: a
   *  faint crayon-blue wash lights on selection so the active unit reads at a glance. */
  isPeer?: boolean;
  /** Folded inequality constraints touching this cell (F6) — e.g. "greater than the cell to
   *  the right and less than the cell below". Empty when the cell borders no caret. Appended
   *  to the accessible name so a screen reader hears the relation while arrowing the grid; the
   *  caret glyphs themselves are aria-hidden. */
  constraintLabel: string;
  /** Engine-domains pencil marks (W6 beat 9; twin of SudokuCell's): surviving candidate values
   *  from the solver's own propagation, present only while the peek gesture is held. Empty cells. */
  marks?: number[];
  /** T4-W8 ROW 1 — the player's OWN corner (Snyder) pencil marks (crayon-blue). Empty cells only. */
  cornerMarks?: number[];
  /** T4-W8 ROW 1 — the player's own center marks (Snyder), a centred row. Empty cells only. */
  centerMarks?: number[];
  /** T4-W8 ROW 1 — the active pencil mode; 'corner'/'center' authors a mark on the FROZEN native
   *  input instead of a value, 'off'/undefined keeps the byte-identical value write. */
  pencilMode?: PencilMode;
}>();

const emit = defineEmits<{
  (e: "update", position: number, value: number): void;
  (e: "mark", position: number, value: number): void;
  (e: "cellFocus", position: number): void;
  (e: "candidatePeekStart"): void;
  (e: "candidatePeekEnd"): void;
}>();

// The cell-shell (T4-W11 Row 3): all twin cell logic lives in the composable. Futoshiki's
// furniture appends the folded inequality (F6) to the accessible name, and — with no subgrid to
// borrow (a plain Latin square, boardSize 4..7) — lays the engine-marks mini-grid on the tightest
// ceil-√ rectangle: 2×2 for 4, 3 columns for 5..7.
const markCols = computed(() => Math.ceil(Math.sqrt(props.boardSize)));
const {
  isHovered,
  isFocused,
  isActive,
  cellViewBox,
  displayValue,
  glyphChar,
  ariaLabel,
  handleInput,
  handleKeydown,
  focusInput,
  onFocus,
  longPress,
  onCellPointerDown,
  onCellClick,
  showMarks,
  markPath,
  marksGridStyle,
  showCornerMarks,
  showCenterMarks,
  cornerSlot,
} = useGameCell(props, emit, {
  ariaSuffix: () => props.constraintLabel,
  marksGridStyle: () => ({
    gridTemplateColumns: `repeat(${markCols.value}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${Math.ceil(props.boardSize / markCols.value)}, minmax(0, 1fr))`,
  }),
});

// T4-W10 idiom (§:ref) — `position` is exposed alongside `focus` so the board's STABLE
// `setCellApi` bound handler keys the cellApi registry off the instance (el.position), not a
// per-render inline closure. Position is invariant per instance (`:key === :position`).
defineExpose({ focus: focusInput, position: props.position });
</script>

<template>
  <div
    class="game-cell futoshiki-cell relative flex items-center justify-center"
    role="gridcell"
    :aria-rowindex="rowIndex"
    :aria-colindex="colIndex"
    :class="{
      'cell-reveal-animated': isRevealed,
      'is-active': isActive,
      'is-invalid': isInvalid,
      'is-because': isBecause,
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
      ref="cellInput"
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

    <!-- Peer-unit wash (T4-W8 ROW 4; twin of SudokuCell's) — a faint crayon-blue fill over every
         cell sharing the focused cell's row / column (Latin square, no box), so the active unit
         reads at a glance on selection. Its own layer behind the glyph + marks + ghost. -->
    <div
      v-if="isPeer"
      class="cell-peer pointer-events-none absolute inset-0"
      aria-hidden="true"
    />

    <!-- T4-W7 hint laminate (twin of SudokuCell's): the becauseCells wash in the peek-laminate
         tone, its own layer behind the glyph + focus ghost, so the tone shows even on the focused
         cell. Decorative; the margin voice carries the name. -->
    <div
      v-if="isBecause"
      class="cell-because pointer-events-none absolute"
      aria-hidden="true"
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

    <!-- User pencil marks — CORNER slot (T4-W8 ROW 1; twin of SudokuCell's): the player's own
         notes in a 3×3 Snyder grid, crayon-blue so they never read as the engine's graphite peek
         marks. Its own layer + class (never `.pencil-marks`). Decorative. -->
    <div
      v-if="showCornerMarks"
      class="user-marks user-corner-marks pointer-events-none absolute grid"
      aria-hidden="true"
    >
      <span
        v-for="(v, i) in cornerMarks"
        :key="v"
        class="user-mark-slot"
        :style="cornerSlot(i)"
      >
        <svg
          class="user-mark-glyph"
          viewBox="0 0 40 56"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :d="markPath(v)"
            fill="none"
            stroke="currentColor"
            stroke-width="4.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>

    <!-- User pencil marks — CENTER slot (T4-W8 ROW 1): a centred, wrapping row of the chosen
         digits, the second placement of the one user-mark surface. -->
    <div
      v-if="showCenterMarks"
      class="user-marks user-center-marks pointer-events-none absolute flex flex-wrap"
      aria-hidden="true"
    >
      <span v-for="v in centerMarks" :key="v" class="user-mark-slot">
        <svg
          class="user-mark-glyph"
          viewBox="0 0 40 56"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :d="markPath(v)"
            fill="none"
            stroke="currentColor"
            stroke-width="4.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
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

<style scoped src="@/games/shared/gameCell.css"></style>
