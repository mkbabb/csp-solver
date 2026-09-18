import { computed, onUnmounted, ref, useTemplateRef } from "vue";
import { getVariant, toDisplayChar } from "@pencil/glyph/glyphRegistry";
import { useLongPress } from "@games/shared/useLongPress";
import type { PencilMode } from "@games/shared/useUserMarks";

/**
 * The cell-shell (T4-W11 Row 3) — the twin cell logic both games ran byte-identical
 * (pencil-mark grid, native bounded entry, long-press peek, selection/hover model, the
 * accessible-name derivation) lifted to ONE composable. NOT a wrapper component: this adds
 * zero vnode layers and zero reactivity depth — the same refs/computeds each cell already
 * declared, defined once. Each game's Cell.vue stays the mounted component (its template,
 * root class, and the WM-FROZEN `<input>` are untouched); its `<script setup>` shrinks to a
 * defineProps/defineEmits stub + this call + defineExpose.
 *
 * The genuine per-game divergence is passed as FURNITURE functions (KISS guard: a slot/
 * function, never a config boolean): the accessible-name suffix (futoshiki's folded
 * inequality) and the engine-marks mini-grid template (sudoku's subgrid ticks vs futoshiki's
 * ceil-√ rectangle). Everything else — including handleInput's digit-width clamp
 * (`boardSize >= 10 ? 2 : 1`, which reduces to futoshiki's single-digit slice on its 4..7
 * boards) — is the shared intersection.
 */

/** The common cell props both games share (the shell's intersection). Per-game props
 *  (`subgridSize` / `constraintLabel`) stay on each cell and feed the furniture below; the
 *  cell's own props object is a structural superset of this, so it passes straight through. */
export interface GameCellProps {
  position: number;
  value: number;
  /** A printed clue. INVIOLABLE since T9-W1 §1.1: the model refuses every write to one, so
   *  this is a permanent property of the cell rather than a state a keystroke can end. The
   *  companion `isOverridden` retired with the demotion it existed to render. */
  isGiven: boolean;
  isSolved: boolean;
  isRevealed: boolean;
  noiseDelay: number;
  boardSize: number;
  ghostPath: string;
  rowIndex: number;
  colIndex: number;
  tabIndex: number;
  isInvalid: boolean;
  isBecause?: boolean;
  isPeer?: boolean;
  /** The slug of the PEER who wrote this cell's digit, empty for your own and for the
   *  unauthored (`BoardHost.authorNameAt`). It is part of the name's CORE rather than a tail
   *  (T9-W3 §3.3) — see `ariaLabel`. */
  authorName?: string;
  marks?: number[];
  cornerMarks?: number[];
  centerMarks?: number[];
  pencilMode?: PencilMode;
}

export interface GameCellEmit {
  (e: "update", position: number, value: number): void;
  (e: "mark", position: number, value: number): void;
  (e: "cellFocus", position: number): void;
  (e: "candidatePeekStart"): void;
  (e: "candidatePeekEnd"): void;
}

/** Per-game furniture the shell can't intersect — each is a function, never a flag.
 *  `ariaSuffix` appends a game-specific tail to the accessible name (futoshiki's inequality;
 *  sudoku returns `""`, which yields the identical name). `marksGridStyle` lays out the
 *  engine-marks mini-grid. */
export interface GameCellFurniture {
  ariaSuffix: () => string;
  marksGridStyle: () => Record<string, string>;
}

export function useGameCell(
  props: GameCellProps,
  emit: GameCellEmit,
  furniture: GameCellFurniture,
) {
  // The cell's opacity-0 native input, resolved by its static `ref="cellInput"` template key so
  // the shell can own it without the thin cell declaring a binding (Vue 3.5 useTemplateRef).
  const inputRef = useTemplateRef<HTMLInputElement>("cellInput");
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

  // cellKind (fe-components-audit §12) drives the accessible name (§4.1). Order matters: a
  // revealed answer can also sit on a "given" position, so the richer state is tested first.
  //
  // T9-W1 §1.1 — the `!props.isOverridden` term is gone with the demotion. It was the clause
  // that let one keystroke turn "given clue 5" into "your entry 7"; nothing re-labels a clue
  // now, so the name a given publishes is true for the life of the board.
  const cellKind = computed<"empty" | "given" | "user" | "solved">(() => {
    if (props.value === 0) return "empty";
    if (props.isSolved) return "solved";
    if (props.isGiven) return "given";
    return "user";
  });

  /**
   * ONE HAND, NAMED ONCE (T9-W3 §3.3).
   *
   * The core is the clause that says whose digit this is, and until this wave a second clause
   * said it again and disagreed: `authorName` arrived as a tail, so a peer's digit announced
   * "your entry 4, written by brave-otter" — one sentence claiming two hands, and the unit gate
   * pinned it verbatim. The branch belongs HERE, where the cell's kind is known, because
   * authorship is a property of the core and not an addition to it.
   *
   * `authorName` is a PEER's slug and only ever that (`BoardHost.authorNameAt` returns "" for
   * your own cells and for the unauthored), so the test is the whole rule: a slug means someone
   * else's hand, no slug means yours. The other kinds name a different hand already and take no
   * clause at all — a printed clue was written by nobody, and a revealed cell was filled in for
   * the player, which is the ink it visibly wears whoever asked for it (`HandwrittenGlyph`'s
   * `#solver-ink` outranks the author's hue). An emptied cell keeps its ledger stamp and has no
   * digit to own, so it says "empty" and stops.
   *
   * T9-W7 · B1 — the third core USED to read `solver's answer N`: the machine naming itself in
   * a sentence a reader hears, which is M16's own prohibition, and the ballot's default fired
   * here. `revealed answer N` is the same fact in the player's words (a reveal is what they
   * asked for) and still tells the three authorships apart in the ear — clue, entry, revealed.
   */
  const ariaLabel = computed(() => {
    const loc = `Row ${props.rowIndex}, column ${props.colIndex}`;
    let core: string;
    switch (cellKind.value) {
      case "given":
        core = `given clue ${glyphChar.value}`;
        break;
      case "user":
        core = props.authorName
          ? `${props.authorName}'s entry ${glyphChar.value}`
          : `your entry ${glyphChar.value}`;
        break;
      case "solved":
        core = `revealed answer ${glyphChar.value}`;
        break;
      default:
        core = "empty";
    }
    const base = `${loc}, ${core}`;
    // The game may append a per-cell relation (futoshiki's inequality is a property of the CELL
    // to the reader, not a free-floating glyph); sudoku's suffix is empty → the identical name.
    const suffix = furniture.ariaSuffix();
    return suffix ? `${base}, ${suffix}` : base;
  });

  // T4-W8 ROW 1 — pencil mode reinterprets the FROZEN native input (the WM seam: mode toggle
  // only, never a second input surface). While a slot is armed AND the cell is empty, a digit
  // authors a mark and the input is cleared so it never fills with a value; a filled cell has no
  // note surface (switch to Normal to overwrite it), so its keystroke is ignored.
  const pencilArmed = computed(
    () => props.pencilMode === "corner" || props.pencilMode === "center",
  );

  // ── THE REFUSAL'S VISIBLE HALF (T9-W1 §1.1) ──────────────────────────
  // A write the model refuses has to be FELT, or the board reads as broken rather than firm.
  // The cue is the house's own ERROR verb — `refuse-shake`, the keyframes the solve verdict
  // already shakes with — worn for one window and then dropped: a pulse, not a state, so no
  // cell can be left wearing a refusal it has finished saying. No new keyframes, no new
  // filters; the duration rides out as a bound custom property (the `--draw-dur` precedent).
  const REFUSE_MS = 600;
  const refuseArmed = ref(false);
  let refuseTimer: ReturnType<typeof setTimeout> | null = null;
  function armRefusal() {
    if (refuseTimer) clearTimeout(refuseTimer);
    refuseArmed.value = true;
    refuseTimer = setTimeout(() => {
      refuseArmed.value = false;
      refuseTimer = null;
    }, REFUSE_MS);
  }
  onUnmounted(() => {
    if (refuseTimer) clearTimeout(refuseTimer);
  });

  /** Put the cell's own digit back in the native input and say the refusal (T9-W1 §1.1). The
   *  input has ALREADY taken the keystroke — it is a real `<input>`, not a display — so the
   *  clue would sit there overwritten until the next render that happened to touch it. */
  function refuseAtCell(target: HTMLInputElement) {
    target.value = displayValue.value;
    armRefusal();
  }

  /**
   * THE TYPED CHARACTER WINS (T9-W1 §1.1's P1 rider — V8's swallow).
   *
   * `maxlength` lets the input hold one char more than the board's digit width, and the clamp
   * used to read `raw.slice(-maxLen)` — the LAST digits of the whole field, wherever the
   * character actually landed. With the caret parked at the head of a filled cell (the pose an
   * arrow key or a tap on the left of the glyph leaves), typing 7 over a 5 produced "75" and
   * committed the 5: the keystroke was swallowed, and on a clue the demotion fired anyway, so
   * a given was reclassified by a write of nothing.
   *
   * The clamp reads the digits ENDING AT THE CARET instead, which is where the character just
   * went. An append (the caret at the end) is the incumbent expression exactly, so the
   * one-keystroke override and 16×16's two-digit accumulation are untouched.
   */
  function digitsAtCaret(target: HTMLInputElement, raw: string): string {
    const caret = target.selectionStart ?? target.value.length;
    // The caret indexes the RAW field, punctuation and all; the clamp works in digits.
    const upToCaret = target.value.slice(0, caret).replace(/\D/g, "");
    const maxLen = props.boardSize >= 10 ? 2 : 1;
    // No digit before the caret is not a keystroke this path can attribute (a paste, a drop) —
    // fall back to the whole field, which is what the estate always did.
    return (upToCaret || raw).slice(-maxLen);
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const raw = target.value.replace(/\D/g, "");

    if (raw === "") {
      // A cleared input is an erase in Normal mode; in pencil mode the value stays (Backspace
      // owns the note erase via handleKeydown), so never fall through to update(0) there.
      if (pencilArmed.value) {
        target.value = "";
        return;
      }
      // AN ERASE IS A WRITE, so a clue refuses it like any other. The write still travels: the
      // model rules once and the undo spine, the room and the status region all hear one answer.
      emit("update", props.position, 0);
      if (props.isGiven) refuseAtCell(target);
      else target.value = "";
      return;
    }

    const num = parseInt(digitsAtCaret(target, raw), 10);
    if (num >= 1 && num <= props.boardSize) {
      if (pencilArmed.value) {
        // Pencil mode: the digit toggles a note on an EMPTY cell; the input never keeps it.
        if (props.value === 0) emit("mark", props.position, num);
        target.value = "";
      } else {
        emit("update", props.position, num);
        if (props.isGiven) refuseAtCell(target);
        else target.value = String(num);
      }
    } else {
      target.value = displayValue.value;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    if (event.key === "Backspace" || event.key === "Delete") {
      // In pencil mode an empty cell's Backspace erases its notes (both slots); a filled cell
      // still erases the value (revealing any hidden notes beneath). Normal mode is unchanged.
      if (pencilArmed.value && props.value === 0) {
        emit("mark", props.position, 0);
      } else {
        emit("update", props.position, 0);
        if (props.isGiven) refuseAtCell(target);
        else target.value = "";
      }
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

  // ── Long-press peek (T4-WM §3, lane E) ───────────────────────────────
  // A press-and-hold on an EMPTY cell opens its candidate glimpse — the engine-domains pencil
  // marks the answer-key peek already rides, marks-only (no laminate) — mirroring the shipped
  // hold-to-peek grammar. The gesture funnels up (cell → board → game) to the shared marks
  // activation; release, cancel, or a drift-off leave dismisses it. Pointer Events only
  // (contextmenu never fires on iOS); `useLongPress` fires the honest `vibrateOnce` on recognition
  // (Android buzzes, iOS silently no-ops). Read-only — the peek never touches `value` (the W8 seam
  // holds long-press at peek). A recognized hold sets `suppressClick` so the tap that ends it can't
  // focus/raise the keyboard; a plain tap (no peek) still focuses through the native-entry path. The
  // flag resets at the next pointerdown so a drift-off release never swallows a later tap's focus.
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
  // The mini-grid uses the classic pencil-mark convention: value v always sits at slot v
  // (row-major), so a candidate's *position* encodes its value even at mark sizes too small to
  // read comfortably. Each mark reuses the hand-drawn glyph paths (variant picked per cell+value
  // so neighboring marks don't stamp identically), stroked in faint graphite. The grid template
  // itself is furniture (sudoku borrows its subgrid; futoshiki, a plain Latin square, uses the
  // tightest ceil-√ rectangle).
  const showMarks = computed(() => props.value === 0 && (props.marks?.length ?? 0) > 0);
  function markPath(v: number): string {
    return (
      getVariant(toDisplayChar(v, props.boardSize), props.position * 31 + v)?.d ?? ""
    );
  }
  const marksGridStyle = computed(() => furniture.marksGridStyle());

  // ── User pencil marks (T4-W8 ROW 1) — the player's own notes ──────────
  // Distinct from the engine peek marks above in tone (crayon-blue) AND placement, so the two
  // never read as one: CORNER marks hug the cell in a 3×3 Snyder grid (order below), CENTER marks
  // sit in a centred row. Both reuse the hand-drawn glyph paths and, like the engine marks, show
  // only on an empty cell (a filled cell hides its notes; erasing the digit brings them back).
  const showCornerMarks = computed(
    () => props.value === 0 && (props.cornerMarks?.length ?? 0) > 0,
  );
  const showCenterMarks = computed(
    () => props.value === 0 && (props.centerMarks?.length ?? 0) > 0,
  );
  // Snyder corner order: the four corners first, then the edge midpoints, then centre — a 3×3
  // grid addressed by (row, col). Wraps for the rare cell carrying more notes than slots.
  const CORNER_ORDER: [number, number][] = [
    [1, 1],
    [1, 3],
    [3, 1],
    [3, 3],
    [1, 2],
    [3, 2],
    [2, 1],
    [2, 3],
    [2, 2],
  ];
  function cornerSlot(i: number) {
    const [row, col] = CORNER_ORDER[i % CORNER_ORDER.length];
    return { gridRow: String(row), gridColumn: String(col) };
  }

  return {
    isHovered,
    isFocused,
    isActive,
    cellViewBox,
    displayValue,
    glyphChar,
    ariaLabel,
    /** T9-W1 §1.1 — the refusal cue is armed for one window after a refused keystroke. */
    refuseArmed,
    refuseDurMs: REFUSE_MS,
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
  };
}
