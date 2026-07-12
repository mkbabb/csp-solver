<script setup lang="ts">
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
import type { Difficulty } from "@games/sudoku/types";
import { useTheme } from "@/composables/useTheme";
import { useButtonAnimation } from "@games/shared/useButtonAnimation";
import { useCoarsePointer } from "@games/shared/useCoarsePointer";
import { sizeOptions, difficultyOptions } from "./constants";

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

// Reactive filter URL for control panel — avoids :global(.dark) CSS scoping bug
const panelFilter = computed(() =>
    isDark.value ? "url(#stroke-dark)" : "url(#stroke-light)",
);

const props = defineProps<{
    size: number;
    difficulty: Difficulty;
    loading: boolean;
    solveState: string;
    mobile?: boolean;
}>();

// UI-12: the mobile SIZE/DIFFICULTY tabs show only the active panel's options, so the
// inactive tab's current value is invisible while the other is open. Surface it small +
// graphite beneath the inactive heading — quiet, never louder than the active underline.
const sizeValueLabel = computed(
    () => sizeOptions.find((o) => o.value === props.size)?.label ?? "",
);
const difficultyValueLabel = computed(
    () => difficultyOptions.find((o) => o.value === props.difficulty)?.label ?? "",
);

const emit = defineEmits<{
    (e: "update:size", value: number): void;
    (e: "update:difficulty", value: Difficulty): void;
    (e: "randomize"): void;
    (e: "clear"): void;
    (e: "solve"): void;
    (e: "share"): void;
    (e: "peek-start"): void;
    (e: "peek-end"): void;
}>();

// ── Hold-to-peek gesture on the BoilDivider (the hold surface, fe-composition
// §7b — the union diff held Solve, stale post-extraction). Press-and-hold ≥350ms
// → the answer-key laminate; a shorter press does nothing (the divider has no
// click action, so no click-suppression bookkeeping is needed). App.vue owns the
// peek state; this only reports the gesture. Keyboard peek rides App.vue's K/Esc.
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

// ── Share-on-demand permalink (W6): copy a `?board=` link, confirm in the washi ──
// The parent owns the encode + address-bar write + clipboard copy (@share); this only
// flips the washi label to a transient "copied!" so the confirmation wears the same
// tape grammar as every other button tooltip.
const { animating: shareAnimating, trigger: triggerShare } = useButtonAnimation(500);
const shareConfirm = ref(false);
let shareConfirmTimer: ReturnType<typeof setTimeout> | null = null;
function onShare() {
    triggerShare();
    emit("share");
    shareConfirm.value = true;
    if (shareConfirmTimer) clearTimeout(shareConfirmTimer);
    shareConfirmTimer = setTimeout(() => {
        shareConfirm.value = false;
    }, 1600);
}

const expandedPanel = ref<"size" | "difficulty">("size");

const { animating: solveAnimating, trigger: triggerSolve } = useButtonAnimation(500);
const { animating: randomizeAnimating, trigger: triggerRandomize } =
    useButtonAnimation(500);
const { animating: clearAnimating, trigger: triggerClear } = useButtonAnimation(400);

function onRandomize() {
    triggerRandomize();
    emit("randomize");
}

// UI-5 confirm beat on Clear (recorded design call): Clear wipes the board AND the undo
// history (clearUndo in the composable) — genuinely destructive, no take-back. On coarse
// pointers, where stray taps are routine, the act takes two taps: the first arms (the
// sublabel asks "sure?" in the hand, rose), the second within 2.5s clears; the window
// lapsing disarms quietly. Fine pointers keep the one-click Clear — the confirm rides
// the same transient-label grammar as the share "copied!" flip, no dialog machinery.
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

function onSizeChange(val: string | number) {
    emit("update:size", val as number);
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
                    :aria-expanded="expandedPanel === 'size'"
                    @click="expandedPanel = 'size'"
                >
                    <h2
                        class="section-heading text-muted-foreground"
                        :class="{ 'is-active': expandedPanel === 'size' }"
                    >
                        Size
                    </h2>
                    <!-- UI-12: the current value, shown only while this tab is closed. -->
                    <span v-if="expandedPanel !== 'size'" class="heading-value">{{
                        sizeValueLabel
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
                v-show="expandedPanel === 'size'"
                :options="sizeOptions"
                :selected="size"
                :boil-frame="boilFrame"
                mobile
                @change="onSizeChange"
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

        <!-- Hold the boiling divider to peek at the answer key (the hold surface).
         UI-4: the washi is PERSISTENT on coarse pointers (title tooltips don't exist on
         touch) and pinned to the divider's own box; the surface pads to a ≥44px target
         there (CSS). Narrow fine-pointer windows keep the hover/focus reveal. -->
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

        <!-- Action buttons — UI-5: persistent sublabels in the pencil hand on coarse
         pointers (the washi is a hover grammar; sighted touch users got no text). -->
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
                :aria-label="shareConfirm ? 'Link copied' : 'Share board link'"
            >
                <ShareIcon :size="26" :class="{ 'share-pop': shareAnimating }" />
                <span class="icon-sublabel" aria-hidden="true">{{
                    shareConfirm ? "copied!" : "Share"
                }}</span>
            </button>
        </div>
    </div>

    <!-- Desktop layout -->
    <div v-else class="control-panel-wrap flex flex-col items-center md:items-stretch">
        <div class="control-panel-filtered flex flex-col items-center md:items-stretch">
            <!-- Size selector -->
            <div class="flex flex-col items-center gap-1 md:items-stretch">
                <h2 class="section-heading text-muted-foreground" aria-label="Size">
                    Size
                </h2>
                <OptionSelector
                    :options="sizeOptions"
                    :selected="size"
                    :boil-frame="boilFrame"
                    @change="onSizeChange"
                />
            </div>

            <hr class="my-3 w-full border-border/50" />

            <!-- Difficulty selector -->
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

        <!-- Hold the boiling divider to peek at the answer key (the hold surface).
         L14: a washi label makes the hidden affordance discoverable — same tape
         grammar as the buttons; the native title yields to it (no double tooltip).
         UI-9: anchored to the divider's OWN box, so the revealed chip sits ON the
         ruled line instead of floating up into the Hard option's text. UI-4: also
         persistent on coarse pointers (iPad row regime), with a padded ≥44px target. -->
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
                :aria-label="shareConfirm ? 'Link copied' : 'Share board link'"
            >
                <ShareIcon :size="26" :class="{ 'share-pop': shareAnimating }" />
                <span class="icon-sublabel" aria-hidden="true">{{
                    shareConfirm ? "copied!" : "Share"
                }}</span>
                <SheetWashiLabel
                    :text="shareConfirm ? 'copied!' : 'share link'"
                    :seed="71"
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
    /* R3 (W5 repair): own compositing layer. Unlayered, this 3-pass stroke filter
     re-rasterizes whenever the panel repaints OR MOVES — and H8's centered
     .app-layout moves it on every board-height change (a size switch re-centers
     the card), which carried ~+125 ms of size-switch raster past the p3 class.
     Layerized, a move is a compositor offset and boil-tick invalidations stop
     sharing tiles with the filter (measured −57% switch raster vs unlayered). */
    will-change: transform;
}

/* .section-heading type register lives in assets/typography.css (@layer
   components) — the √φ subheading→heading eyebrow, shared with futoshiki (D4).
   Only the component-local hover flourish stays scoped here. */

/* Crayon color utilities */
.crayon-green {
    color: var(--color-crayon-green);
}
.crayon-orange {
    color: var(--color-crayon-orange);
}
.crayon-rose {
    color: var(--color-crayon-rose);
}
.crayon-blue {
    color: var(--color-crayon-blue);
}

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

/* Hold surface for the answer-key peek — hosts the BoilDivider, giving the
   press-and-hold a comfortable target and disabling text-select / touch-scroll
   so the browser doesn't swallow the gesture. The button tooltips are now washi
   labels (SheetWashiLabel), which carry their own hover + :focus-visible reveal. */
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

/* ── Coarse pointers (T3-W11 U-A): the honest touch affordances ─────────
   UI-4: the 14px peek hairline was under every tap floor — pad the hold surface to a
   ≥44px target (the divider stays a hairline visually; the persistent washi labels it).
   UI-5: the icon actions write their names beneath the icon. Fine pointers match none
   of this — the hover grammar is structurally untouched. */
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

/* Sparkle icon - pastel rainbow filled */
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

/* Mobile layout */
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
