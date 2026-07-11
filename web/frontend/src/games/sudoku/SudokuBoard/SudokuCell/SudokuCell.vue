<script setup lang="ts">
import { computed, ref } from "vue";
import HandwrittenGlyph from "@pencil/glyph/HandwrittenGlyph.vue";
import { getVariant, toDisplayChar } from "@pencil/glyph/glyphRegistry";

const props = defineProps<{
    position: number;
    value: number;
    isGiven: boolean;
    isOverridden: boolean;
    isSolved: boolean;
    isRevealed: boolean;
    noiseDelay: number;
    boardSize: number;
    subgridSize: number;
    /** Pre-computed ghost rect path in 1000×1000 board viewBox coords */
    ghostPath: string;
    /** 1-based grid coordinates (ARIA grid + aria-label derivation, §4.1) */
    rowIndex: number;
    colIndex: number;
    /** Roving tabindex (§4.1): 0 for the one focused cell, -1 for every other. */
    tabIndex: number;
    /** This cell participates in a duplicate the teacher circled (§1.4/§4.2). */
    isInvalid: boolean;
    /** Engine-domains pencil marks (W6 beat 9): surviving candidate values from
     *  the solver's own propagation, present only while the peek gesture is held.
     *  Rendered only while the cell is empty. */
    marks?: number[];
    /** DigitPad live (T3-W11 U-A): the OS virtual keyboard yields to the pad
     *  (`inputmode="none"`) so focusing a cell doesn't eclipse half the board with
     *  a keyboard the pad replaces. Hardware keyboards are unaffected. */
    suppressVirtualKeyboard?: boolean;
}>();

const emit = defineEmits<{
    (e: "update", position: number, value: number): void;
    (e: "cellFocus", position: number): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isHovered = ref(false);
const isFocused = ref(false);

// Cell is "active" when hovered or focused
const isActive = computed(() => isHovered.value || isFocused.value);

// Compute the cell's viewBox region in 1000×1000 board coords
const cellViewBox = computed(() => {
    const cellSize = 1000 / props.boardSize;
    const col = props.position % props.boardSize;
    const row = Math.floor(props.position / props.boardSize);
    // Pad outward by half a cell to allow the ghost stroke to render without clipping
    const pad = cellSize * 0.15;
    const x = col * cellSize - pad;
    const y = row * cellSize - pad;
    const w = cellSize + pad * 2;
    const h = cellSize + pad * 2;
    return `${x} ${y} ${w} ${h}`;
});

// Hidden input keeps the raw numeric string; the glyph overlay renders the display CHARACTER
// (hex A–G for 16×16 via toDisplayChar). Wiring this is what lets values 10–16 render a glyph
// at all — String(10) has no key in glyphPaths, so those cells rendered blank AND registered
// no wiggle/murmur subscriber before this (the 10–16 glyph *variants* themselves ride W9).
const displayValue = computed(() => {
    if (props.value === 0) return "";
    return String(props.value);
});

const glyphChar = computed(() => toDisplayChar(props.value, props.boardSize));

// cellKind (fe-components-audit §12) drives the accessible name (§4.1). Order matters:
// solver's answers and overrides can also be "given" positions, so test the richer
// states first.
const cellKind = computed<"empty" | "given" | "user" | "solved">(() => {
    if (props.value === 0) return "empty";
    if (props.isSolved) return "solved";
    if (props.isGiven && !props.isOverridden) return "given";
    return "user";
});

const ariaLabel = computed(() => {
    const loc = `Row ${props.rowIndex}, column ${props.colIndex}`;
    switch (cellKind.value) {
        case "given":
            return `${loc}, given clue ${glyphChar.value}`;
        case "user":
            return `${loc}, your entry ${glyphChar.value}`;
        case "solved":
            return `${loc}, solver's answer ${glyphChar.value}`;
        default:
            return `${loc}, empty`;
    }
});

function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const raw = target.value.replace(/\D/g, "");

    if (raw === "") {
        emit("update", props.position, 0);
        target.value = "";
        return;
    }

    // For single-digit boards (≤9), take only the last digit to allow one-click override.
    // For larger boards, try the full string first, then the last 2 chars, then the last char.
    const maxLen = props.boardSize >= 10 ? 2 : 1;
    const trimmed = raw.slice(-maxLen);
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
    // Arrow / Home / End navigation deliberately falls through to the board's roving-tabindex
    // controller (bubbles to `.board-cells`); handling it there keeps one keyboard model.
}

function focusInput() {
    inputRef.value?.focus();
}

function onFocus() {
    isFocused.value = true;
    emit("cellFocus", props.position);
}

// ── Engine-domains pencil marks (W6 beat 9) ──────────────────────────
// The n×n mini-grid uses the classic pencil-mark convention: value v always
// sits at slot v (row-major), so a candidate's *position* encodes its value
// even at mark sizes too small to read comfortably. Each mark reuses the
// hand-drawn glyph paths (variant picked per cell+value so neighboring
// marks don't stamp identically), stroked in faint graphite.
const showMarks = computed(() => props.value === 0 && (props.marks?.length ?? 0) > 0);
function markPath(v: number): string {
    return (
        getVariant(toDisplayChar(v, props.boardSize), props.position * 31 + v)?.d ?? ""
    );
}
const marksGridStyle = computed(() => ({
    gridTemplateColumns: `repeat(${props.subgridSize}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${props.subgridSize}, minmax(0, 1fr))`,
}));

// The board's roving controller focuses cells programmatically after an arrow key (§4.1).
defineExpose({ focus: focusInput });
</script>

<template>
    <div
        class="sudoku-cell relative flex items-center justify-center"
        role="gridcell"
        :aria-rowindex="rowIndex"
        :aria-colindex="colIndex"
        :class="{
            'cell-reveal-animated': isRevealed,
            'is-active': isActive,
            'is-invalid': isInvalid,
        }"
        :style="isRevealed ? { '--reveal-delay': `${noiseDelay}ms` } : undefined"
        @click="focusInput"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >
        <!-- Hidden input for keyboard interaction -->
        <input
            ref="inputRef"
            type="text"
            :inputmode="suppressVirtualKeyboard ? 'none' : 'numeric'"
            :value="displayValue"
            :maxlength="boardSize >= 10 ? 3 : 2"
            :tabindex="tabIndex"
            :aria-label="ariaLabel"
            :aria-invalid="isInvalid || undefined"
            @input="handleInput"
            @keydown="handleKeydown"
            @focus="onFocus"
            @blur="isFocused = false"
            class="absolute inset-0 h-full w-full cursor-pointer bg-transparent text-center opacity-0 outline-none"
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
                <svg
                    v-if="marks!.includes(v)"
                    class="mark-glyph"
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

<style scoped>
/* ── Engine-domains pencil marks (W6 beat 9) ─────────────────────────
   Faint graphite, deliberately lighter than any inked glyph — these are
   the solver thinking in the margins, not an answer. The soft fade-in
   keeps marks from popping as the peek lays down (opacity-only, Band C
   one-shot; from-only keyframe so the settled opacity is the cascade
   value — the contrast arm below still wins). Static under PRM: no
   boil, no fade, the marks are simply there while the peek is held. */
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
.sudoku-cell.is-invalid .cell-ghost {
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

/* Tier 2 — keyboard focus: crayon-blue, heavier, sketched on over 180ms. Driven by real
   :focus-visible so a mouse click keeps the instant graphite tier and only keyboard focus
   gets the drawn-on ring. */
.sudoku-cell:has(input:focus-visible) .cell-ghost-path {
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
.sudoku-cell.is-invalid .cell-ghost-path {
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
.sudoku-cell.is-invalid:has(input:focus-visible) .cell-ghost-path {
    fill: var(--color-teacher-red, var(--color-crayon-rose));
    fill-opacity: 0.16;
    stroke: var(--color-teacher-red, var(--color-crayon-rose));
    stroke-width: 10;
    stroke-opacity: 1;
}

/* Neutralize the generic global focus-within ring (index.css:190-195) — the SVG ghost is
   the focus affordance now. Scoped selector ([data-v-*]) outweighs the global one. The
   input keeps Tailwind's `outline-none` (a transparent 2px outline) so forced-colors /
   Windows High Contrast still paints its own visible ring where SVG strokes are ignored. */
.sudoku-cell:focus-within {
    background: transparent;
    outline: none;
}

@media (prefers-reduced-motion: reduce) {
    .sudoku-cell:has(input:focus-visible) .cell-ghost-path {
        animation: none;
        stroke-dashoffset: 0;
    }
}

/* prefers-contrast: press the pencil harder (§4.4). */
@media (prefers-contrast: more) {
    .cell-ghost-path {
        stroke-opacity: 0.9;
    }
    .sudoku-cell.is-invalid .cell-ghost-path {
        stroke-opacity: 1;
    }
}

/* Ensure ghost overflow is not clipped */
.sudoku-cell {
    overflow: visible;
    contain: layout style;
}
.sudoku-cell.is-active {
    z-index: 10;
}
</style>
