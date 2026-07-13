<script setup lang="ts">
/**
 * Futoshiki control panel — own file, not shared with Sudoku's (games never import each
 * other; F5 flags `size` vs `board_size` as a live footgun against any shared-panel
 * temptation). Structurally the Sudoku panel minus the difficulty section (F3): a single
 * board-size selector, the hold-to-peek BoilDivider, and the three action buttons.
 */
import { computed, ref, onBeforeUnmount } from "vue";
import {
    SolveIcon,
    DiceIcon,
    EraserIcon,
    ShareIcon,
    OptionSelector,
    KeyboardLegend,
} from "@pencil/chrome";
import BoilDivider from "@pencil/chrome/BoilDivider.vue";
import SheetWashiLabel from "@pencil/sheet/SheetWashiLabel.vue";
import ScribbleLoader from "@pencil/chrome/ScribbleLoader.vue";
import { useTheme } from "@/composables/useTheme";
import { useButtonAnimation } from "@games/shared/useButtonAnimation";
import { useCoarsePointer } from "@games/shared/useCoarsePointer";
import { boardSizeOptions } from "./constants";

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
    loading: boolean;
    solveState: string;
    mobile?: boolean;
    // T4-W3 share-truth (twin of the sudoku panel's): the parent's share act as a callback,
    // not an emit, so the OUTCOME travels back — it resolves iff the clipboard copy landed.
    share: () => Promise<void>;
}>();

const emit = defineEmits<{
    (e: "update:boardSize", value: number): void;
    (e: "randomize"): void;
    (e: "clear"): void;
    (e: "solve"): void;
    (e: "peek-start"): void;
    (e: "peek-end"): void;
}>();

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
const { animating: randomizeAnimating, trigger: triggerRandomize } =
    useButtonAnimation(500);
const { animating: clearAnimating, trigger: triggerClear } = useButtonAnimation(400);

function onRandomize() {
    triggerRandomize();
    emit("randomize");
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

function onBoardSizeChange(val: string | number) {
    emit("update:boardSize", val as number);
    triggerBoil();
}
</script>

<template>
    <!-- Mobile layout -->
    <div v-if="mobile" class="control-panel-wrap mobile-control-panel mt-3">
        <div class="control-panel-filtered">
            <div class="mobile-heading-row">
                <h2
                    class="section-heading text-muted-foreground"
                    aria-label="Board size"
                >
                    Board Size
                </h2>
            </div>

            <OptionSelector
                :options="boardSizeOptions"
                :selected="boardSize"
                :boil-frame="boilFrame"
                mobile
                @change="onBoardSizeChange"
            />
        </div>

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
            <SheetWashiLabel
                text="hold to peek"
                :seed="53"
                anchor="center"
                persistent
            />
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
                <SolveIcon
                    v-else
                    :size="28"
                    class="sparkle-icon"
                    :playing="solveAnimating"
                />
                <span class="icon-sublabel" aria-hidden="true">Solve</span>
            </button>
            <button
                @click="onShare()"
                :disabled="loading"
                class="icon-btn"
                :aria-label="shareAria"
            >
                <ShareIcon :size="26" :class="{ 'share-pop': shareAnimating }" />
                <span class="icon-sublabel" aria-hidden="true">{{
                    shareSublabel
                }}</span>
            </button>
        </div>
    </div>

    <!-- Desktop layout -->
    <div v-else class="control-panel-wrap flex flex-col items-center md:items-stretch">
        <div class="control-panel-filtered flex flex-col items-center md:items-stretch">
            <div class="flex flex-col items-center gap-1 md:items-stretch">
                <h2
                    class="section-heading text-muted-foreground"
                    aria-label="Board size"
                >
                    Board Size
                </h2>
                <OptionSelector
                    :options="boardSizeOptions"
                    :selected="boardSize"
                    :boil-frame="boilFrame"
                    @change="onBoardSizeChange"
                />
            </div>
        </div>

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
            <SheetWashiLabel
                text="hold to peek"
                :seed="53"
                anchor="center"
                persistent
            />
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
                <SolveIcon
                    v-else
                    :size="28"
                    class="sparkle-icon"
                    :playing="solveAnimating"
                />
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
                <span class="icon-sublabel" aria-hidden="true">{{
                    shareSublabel
                }}</span>
                <SheetWashiLabel
                    :text="shareWashi"
                    :seed="71"
                    :wide="shareState === 'failed'"
                />
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

/* .section-heading type register lives in assets/typography.css (@layer
   components) — the √φ subheading→heading eyebrow, shared with sudoku (D4).
   Only the component-local hover flourish stays scoped here. */

/* Hover flourishes, FROZEN at one pose (T3-W13 §1-P4-ii): the per-beat filter
   write is retired (SvgFilters), so these static wobbles raster once per hover —
   a resting pointer never re-enrolls a live painter (the b1 node-1006 finding). */
.section-heading:hover {
    filter: url(#wobble-heart);
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

.icon-btn:hover {
    color: var(--color-foreground);
    background: var(--color-accent);
    filter: url(#wobble-celestial);
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

.icon-btn:hover .sparkle-icon {
    filter: drop-shadow(0 0 5px rgba(196, 181, 253, 0.6));
}

.mobile-control-panel {
    font-family: var(--font-display);
    font-optical-sizing: auto;
}

.mobile-heading-row {
    display: flex;
    justify-content: center;
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
