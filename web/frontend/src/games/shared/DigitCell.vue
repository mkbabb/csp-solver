<script setup lang="ts">
/**
 * DigitCell — THE cell. One module, five games (T5-W2 2.1).
 *
 * `SudokuCell` and `FutoshikiCell` were 2.7% apart: 220 of ~226 lines identical, the six
 * divergent ones being the root class, the accessible-name suffix, and the engine-marks
 * mini-grid template. All three are now DATA — `geometry` off `BoardGrammar`, and a
 * `constraintLabel` string the clue seam supplies — so the divergence rides fields instead
 * of forking a component. Thermo and Killer already mounted the sudoku cell verbatim and
 * KenKen the futoshiki one; there was never a third cell to write.
 *
 * The twin logic itself (pencil-mark grid, native bounded entry, long-press peek,
 * selection/hover model, accessible-name derivation) has lived in `useGameCell` since
 * T4-W11; this file is the one template that composable was always addressing.
 */
import { computed } from "vue";
import HandwrittenGlyph from "@pencil/glyph/HandwrittenGlyph.vue";
import { useGameCell } from "@games/shared/useGameCell";
import type { PencilMode } from "@games/shared/useUserMarks";

const props = withDefaults(
  defineProps<{
    position: number;
    value: number;
    isGiven: boolean;
    isOverridden: boolean;
    isSolved: boolean;
    isRevealed: boolean;
    noiseDelay: number;
    boardSize: number;
    /** The grid family, off `BoardGrammar` — the ONE axis the cell diverges on. It picks the
     *  family class (`.sudoku-cell` / `.futoshiki-cell`), which is a frozen DOM contract:
     *  `index.css`'s `:focus-within` ring and `useKeyboardViewport`'s CELL_SELECTOR key on
     *  it, and the e2e estate counts cells through it. */
    geometry: "boxed" | "latin";
    /** Pre-computed ghost rect path in 1000×1000 board viewBox coords */
    ghostPath: string;
    /** 1-based grid coordinates (ARIA grid + aria-label derivation, §4.1) */
    rowIndex: number;
    colIndex: number;
    /** Roving tabindex (§4.1): 0 for the one focused cell, -1 for every other. */
    tabIndex: number;
    /** This cell participates in a duplicate the teacher circled (§1.4/§4.2) — a Latin-square
     *  or box duplicate, or a clue violation the board's own adjacency reported. */
    isInvalid: boolean;
    /** T4-W7 — this cell is part of the armed hint's reasoning (the `becauseCells`): a laminate
     *  wash lights in the peek-laminate tone (its own layer, behind the glyph + focus ring) so the
     *  answer key visibly points here before the digit inks. */
    isBecause?: boolean;
    /** T4-W8 ROW 4 — this cell shares a unit (row / column / box) with the focused cell: a faint
     *  crayon-blue wash lights on selection so the active unit reads at a glance. */
    isPeer?: boolean;
    /** The clue clauses touching this cell, folded into the accessible name (F6) — e.g.
     *  "greater than the cell to the right". Empty for a game whose clues are off-cell (or
     *  which prints none at all), which yields the identical name. */
    constraintLabel?: string;
    /** Engine-domains pencil marks (W6 beat 9): surviving candidate values from the solver's own
     *  propagation, present only while the peek gesture is held. Rendered only while empty. */
    marks?: number[];
    /** T4-W8 ROW 1 — the player's OWN corner (Snyder) pencil marks (crayon-blue). Empty cells only. */
    cornerMarks?: number[];
    /** T4-W8 ROW 1 — the player's own center marks, a centred row in the same tone. Empty cells only. */
    centerMarks?: number[];
    /** T4-W8 ROW 1 — the active pencil mode; 'corner'/'center' authors a mark on the FROZEN native
     *  input instead of a value, 'off'/undefined keeps the byte-identical value write. */
    pencilMode?: PencilMode;
  }>(),
  { constraintLabel: "" },
);

const emit = defineEmits<{
  (e: "update", position: number, value: number): void;
  (e: "mark", position: number, value: number): void;
  (e: "cellFocus", position: number): void;
  (e: "candidatePeekStart"): void;
  (e: "candidatePeekEnd"): void;
}>();

/** The family class — the frozen DOM contract, partitioned exactly by geometry. */
const familyClass = computed(() =>
  props.geometry === "boxed" ? "sudoku-cell" : "futoshiki-cell",
);

// The engine-marks mini-grid: the tightest ceil-√ rectangle over the board's digits. On a
// BOXED board `boardSize` is a perfect square (`size**2`), so this reduces EXACTLY to the
// sub-grid an n×n Snyder grid borrowed (9 → 3×3, 16 → 4×4); on a LATIN board (4..7) it is
// futoshiki's 2×2 / 3-column rectangle. One expression, both families — the "divergence"
// was arithmetic that already agreed.
const markCols = computed(() => Math.ceil(Math.sqrt(props.boardSize)));
const markRows = computed(() => Math.ceil(props.boardSize / markCols.value));

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
    gridTemplateRows: `repeat(${markRows.value}, minmax(0, 1fr))`,
  }),
});

// T4-W10 idiom (§:ref) — `position` is exposed alongside `focus` so the board's STABLE
// `setCellApi` bound handler keys the cellApi registry off the instance (el.position) instead
// of a per-render inline closure that captured the loop index. Position is invariant per
// instance (`:key === :position`), so a set-time capture stays correct across reuse.
defineExpose({ focus: focusInput, position: props.position });
</script>

<template>
  <div
    class="game-cell relative flex items-center justify-center"
    :class="[
      familyClass,
      {
        'cell-reveal-animated': isRevealed,
        'is-active': isActive,
        'is-invalid': isInvalid,
        'is-because': isBecause,
      },
    ]"
    role="gridcell"
    :aria-rowindex="rowIndex"
    :aria-colindex="colIndex"
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
    <!-- Native bounded entry (T4-WM §1): the cell's own opacity-0 input is the sole entry
         surface on every pointer. `inputmode=numeric` raises the iOS digit pad; `type=text`
         (not number) is what lets `maxlength` bound the cell (maxlength is spec-ignored on
         number). The autocorrect/autocapitalize/spellcheck trio + `enterkeyhint` are the iOS
         congruence set. The write path (@input/@keydown) is byte-identical to the keyboard's.
         `maxlength` = the digit width + 1 in-place-override char handleInput slices down;
         on a Latin board (4..7) the expression yields futoshiki's frozen `2`. -->
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
      :maxlength="boardSize >= 10 ? 3 : 2"
      :tabindex="tabIndex"
      :aria-label="ariaLabel"
      :aria-invalid="isInvalid || undefined"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="onFocus"
      @blur="isFocused = false"
      class="cell-native-input absolute inset-0 h-full w-full cursor-pointer bg-transparent text-center opacity-0 outline-none"
    />

    <!-- Peer-unit wash (T4-W8 ROW 4): a faint crayon-blue fill over every cell sharing the
         focused cell's row / column (and, on a boxed board, its box), so the active unit reads
         at a glance on selection. Its own layer, behind the glyph + marks + ghost; decorative
         (the value carries the name). -->
    <div
      v-if="isPeer"
      class="cell-peer pointer-events-none absolute inset-0"
      aria-hidden="true"
    />

    <!-- T4-W7 hint laminate (lane E3): the becauseCells wash in the peek-laminate tone (the
         answer key's teacher-red), a translucent square sitting BEHIND the glyph and the focus
         ghost so both a filled house cell's digit and the keyboard-focus blue ring read over it.
         Its own layer — no collision with the ghost's focus/invalid tiers — so the tone shows
         even on the very cell you focused to ask. Decorative; the margin voice carries the name. -->
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
                 candidate ORDER (compact: a 3-candidate cell spans 0–40ms), so the
                 pencil enumerates ascending candidates left-to-right through the
                 mini-grid — thinking written, not stamped. The container owns the
                 graphite tone (--draw-opacity stays 1). -->
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

    <!-- User pencil marks — CORNER slot (T4-W8 ROW 1): the player's own notes in a 3×3 Snyder
         grid hugging the cell, crayon-blue so they never read as the engine's graphite peek
         marks. Its own layer + class (never `.pencil-marks`) — the two mark systems share the
         cell but never the store or the render. Decorative (the value carries the a11y name). -->
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
         digits, the second placement of the one user-mark surface. Same tone, distinct place. -->
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

    <!-- Ghost cell highlight — the three-tier pencil-sketch focus/hover/invalid ring (§4.2).
         Hover = graphite (instant); :focus-visible = crayon-blue sketched-on; conflict = the
         teacher's red circle (doubles as the aria-invalid indicator). -->
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
