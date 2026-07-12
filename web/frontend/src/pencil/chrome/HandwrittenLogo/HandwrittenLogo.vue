<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { usePrefersReducedMotion } from '@mkbabb/pencil-boil'
import { useTheme } from '@/composables/useTheme'
import {
    FILTER_PRESETS,
    MOTION,
    beatsFor,
    wobblePoseFrequencies,
    wobblePoseId,
} from '@pencil/config/pencilConfig'
import { useBeatFrame } from '@pencil/composables/boilBeat'
import HandwrittenGlyph from '@pencil/glyph/HandwrittenGlyph.vue'
import HandDrawnOutline from '@pencil/grid/HandDrawnOutline.vue'
import { ghostUnderline, scribbleUnderline } from '@pencil/chrome/OptionSelector/scribbleUnderline'
import { useGameMenu, type GameMenuOption } from './useGameMenu'

// The wordmark IS the game picker. It renders the CURRENT game's name in the display face
// (live SVG <text>, so any label renders — no per-glyph art), and the whole thing is a real
// <button> that opens a hand-drawn paper-note listbox of both games. Pencil never imports
// games: the game id + option list arrive as props; selection is emitted back to App.vue,
// which owns the `?game=` swap.
const props = defineProps<{
    game: string
    options: GameMenuOption[]
}>()

const emit = defineEmits<{
    (e: 'select', value: string): void
    /** Fires the moment the picker opens (click OR keyboard) — App warms the other
     *  scene's lazy chunk on this signal (F6-D3), so by selection time it's cached. */
    (e: 'open'): void
}>()

const { isDark } = useTheme()
const reducedMotion = usePrefersReducedMotion()

// ── The wordmark boil, pose-stacked (T3-W13 §1-P3) ──
// The label used to ride ONE live #wobble-logo whose baseFrequency was re-written
// every 4th beat — a full DPR2 filter re-raster on a ~734×238 region, riding the
// root scrolling layer's damage (b1's painter inventory). The boil is stop-motion
// over a finite pose set, so the poses render as N static siblings, each filtered
// by a FROZEN variant (#wobble-logo-p{i}, SvgFilters), and the beat flips opacity —
// compositor-only, zero steady-state raster (the grid hoist's discipline). Cadence
// is unchanged: `beatsFor(intervalMs)` = every 4th beat, exactly the band the
// retired SvgFilters watcher stepped on. PRM freezes the shared beat centrally, so
// the stack rests on pose 0.
const logoPreset = FILTER_PRESETS['wobble-logo']
const logoPoseIds = computed(() =>
    wobblePoseFrequencies(logoPreset).map((_, i) => wobblePoseId(logoPreset.id, i)),
)
const logoPose = useBeatFrame(
    () => logoPoseIds.value.length,
    () => beatsFor(logoPreset.wobble?.intervalMs ?? MOTION.beatMs * 4),
)

const label = computed(() => props.options.find((o) => o.value === props.game)?.label ?? props.game)

// ── Menu state (collapsible listbox; DOM focus stays on the trigger) ──
const { isOpen, highlighted, toggle, close, selectIndex, onKeydown } = useGameMenu(
    () => props.options,
    () => props.game,
    (v) => emit('select', v),
)
const hovered = ref(false)
defineExpose({ close })

// F6-D3: announce every open (a watch, not the click handler, so keyboard opens count too).
watch(isOpen, (open) => {
    if (open) emit('open')
})

function seedFor(value: string): number {
    return value.charCodeAt(0)
}
function inkColor(): string {
    return isDark.value ? '#ffffff' : '#1a1a1a'
}

// ── Clip-path wipe reveal — a mount-time beat, played ONCE (see the game watch) ──
const isDrawn = ref(reducedMotion.value)
function playReveal() {
    if (reducedMotion.value) {
        isDrawn.value = true
        return
    }
    isDrawn.value = false
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            isDrawn.value = true
        })
    })
}

// ── Variable-width viewBox ──
// EVERY label is measured — no per-label special case (H3: the old vbWidth=220 carve-out
// for 'sudoku' left a 41.9 px trailing gap to the caret where measured labels get ~14.4).
// A generous estimate seeds the first paint (never clips), then getBBox tightens the box
// to the real glyph run + a uniform 4-unit trail, so the caret sits at one gap for all.
const textRef = ref<SVGTextElement | null>(null)
// Function ref for pose 0's <text> — every pose renders identical glyph geometry,
// so measuring one suffices (getBBox works at opacity 0; only display:none throws).
function setTextRef(el: unknown) {
    textRef.value = (el as SVGTextElement | null) ?? null
}
function estimateWidth(text: string): number {
    return Math.max(120, Math.ceil(text.length * 34) + 12)
}
const vbWidth = ref(estimateWidth(label.value))
async function measure() {
    await nextTick()
    const el = textRef.value
    if (!el) return
    try {
        const box = el.getBBox()
        const fit = Math.ceil(box.x + box.width + 4)
        vbWidth.value = Math.max(120, fit)
    } catch {
        // getBBox can throw if the element isn't laid out yet — keep the estimate.
    }
}

onMounted(() => {
    playReveal()
    measure()
    // Fonts load async (Fraunces): re-measure once the real face is in so the box fits.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (fonts?.ready) fonts.ready.then(() => measure())
})

// I2: a game swap RE-MEASURES the box for the new label — it never re-reveals. The 1.2 s
// clip-path wipe is a mount-time beat; replaying it on every swap reads as a page reload,
// not a label change (the menu-close motion already carries the swap).
watch(
    () => props.game,
    () => {
        vbWidth.value = estimateWidth(label.value)
        measure()
    },
)
</script>

<template>
    <div class="logo-menu" @keydown="onKeydown">
        <button
            type="button"
            class="logo-trigger"
            aria-haspopup="listbox"
            :aria-expanded="isOpen"
            aria-controls="logo-game-listbox"
            :aria-activedescendant="isOpen ? `logo-game-opt-${highlighted}` : undefined"
            :aria-label="`Puzzle: ${label}. Choose a puzzle`"
            @click.stop="toggle"
            @pointerenter="hovered = true"
            @pointerleave="hovered = false"
        >
            <svg
                class="handwritten-logo"
                :class="{ 'is-drawn': isDrawn }"
                :viewBox="`0 0 ${vbWidth} 60`"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <!-- T3-W13 §1-P3: the pose stack. Geometry + filter are STATIC per
                     sibling; only `is-active` (opacity) flips on the beat. -->
                <g
                    v-for="(pid, f) in logoPoseIds"
                    :key="pid"
                    class="logo-pose"
                    :class="{ 'is-active': logoPose === f }"
                    :filter="`url(#${pid})`"
                >
                    <text
                        :ref="f === 0 ? setTextRef : undefined"
                        class="logo-text"
                        x="4"
                        y="48"
                        text-anchor="start"
                    >{{ label }}</text>
                </g>
            </svg>
            <span class="logo-caret" :class="{ 'is-open': isOpen }" aria-hidden="true">
                <HandwrittenGlyph
                    value=">"
                    :is-given="true"
                    :is-overridden="false"
                    :is-solved="false"
                    :is-revealed="false"
                    :noise-delay="0"
                    :position="0"
                    :board-size="5"
                    :is-hovered="hovered"
                />
            </span>
        </button>

        <!-- F6-D1 (T3-W10): the close now carries a REAL leave — 140ms ease-out reverse of
             logo-menu-in — making I2's "the menu-close motion already carries the swap"
             comment true instead of aspirational. Enter is untouched (the card's own
             logo-menu-in plays on mount as before). -->
        <Transition name="logo-menu">
        <div v-if="isOpen" class="logo-menu-pop">
            <HandDrawnOutline :stroke-width="3">
                <ul
                    id="logo-game-listbox"
                    class="logo-menu-card cartoon-shadow-md edge-outlined bg-popover"
                    role="listbox"
                    aria-label="Choose a puzzle"
                >
                    <li
                        v-for="(opt, i) in props.options"
                        :id="`logo-game-opt-${i}`"
                        :key="opt.value"
                        role="option"
                        :aria-selected="opt.value === props.game"
                        class="logo-menu-item"
                        :class="{
                            'is-active': opt.value === props.game,
                            'is-highlighted': i === highlighted,
                        }"
                        :style="opt.value === props.game
                            ? { '--scribble-underline': scribbleUnderline(seedFor(opt.value), inkColor()), '--scribble-width': `${opt.label.length + 1}ch` }
                            : { '--ghost-underline': ghostUnderline(seedFor(opt.value) + 500, inkColor()), '--ghost-width': `${opt.label.length + 1}ch` }"
                        @click.stop="selectIndex(i)"
                        @pointermove="highlighted = i"
                    >{{ opt.label }}</li>
                </ul>
            </HandDrawnOutline>
        </div>
        </Transition>
    </div>
</template>

<style scoped>
.logo-menu {
    position: relative;
    align-self: flex-start;
    display: inline-block;
    --caret-size: 1.5rem;
    /* One golden rung up (×√φ, 1.272) from the shipped 3.5/4.5/5.5rem ladder — the
       single source for the wordmark's rendered size (L25-49: no scattered height
       literals; each breakpoint re-pins this var). */
    --logo-height: 4.452rem;
    /* Caret optical center (H3): the wordmark is lowercase on a 60-unit box with its
       baseline at y=48, so the x-height band — the ink mass the eye centers on —
       sits ~4.5 units BELOW the box's geometric middle. Flex centers the box; this
       nudge (4.5/60 of the rendered height) re-centers the caret on the ink. */
    --caret-nudge: calc(var(--logo-height) * 0.075);
}

/* Reset the trigger back to bare inline content — the wordmark IS the affordance (mirrors
   AttributionCard.attribution-trigger). font-family is set explicitly, NOT `inherit`, so the
   Fraunces display face is unambiguous (avoids the inherit-specificity defeat, type-audit D2). */
.logo-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: var(--color-foreground);
    -webkit-tap-highlight-color: transparent;
}

.logo-trigger:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--color-foreground) 40%, transparent);
    outline-offset: 4px;
    border-radius: 0.35rem;
}

.handwritten-logo {
    /* --logo-scale (default 1) is the drawer's grow hook (T3-W12 §6): the closed
       regime pins 1.05 from App.vue and the wordmark takes it as a LAYOUT size at
       the settle's one layout step — never a filtered-element size tween (the glide
       itself covers the move with a transform on the masthead h1). */
    height: calc(var(--logo-height) * var(--logo-scale, 1));
    width: auto;
    color: var(--color-foreground);
    display: block;
    clip-path: inset(0 100% 0 0);
    transition: clip-path 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.handwritten-logo.is-drawn {
    clip-path: inset(0 0% 0 0);
}

/* T3-W13 §1-P3 — pose-stack siblings: each is its own composited layer so the
   beat's opacity flip is compositor-only, never a repaint (the grid's
   boil-frame-layer discipline, HandDrawnGrid.vue). */
.logo-pose {
    opacity: 0;
    will-change: opacity;
}

.logo-pose.is-active {
    opacity: 1;
}

.logo-text {
    /* The display register token (--font-display ← Fraunces + the serif fallbacks) —
       H4 ladder-bind; resolves byte-identically to the old inline stack. */
    font-family: var(--font-display);
    font-weight: 900;
    /* 52px here is viewBox GEOMETRY, not a type rung: user units inside the 60-unit
       box (baseline y=48). The rendered size rides --logo-height's golden ladder; a
       rem/clamp rung would couple glyph metrics to root font-size / viewport width
       and clip the fixed box. Deliberately off-token. */
    font-size: 52px;
    font-optical-sizing: auto;
    fill: currentColor;
    letter-spacing: 0.02em;
}

/* The interactive tell: the futoshiki '>' glyph rotated to a downward chevron; flips up when
   open. Hover wiggle rides HandwrittenGlyph's own glyph-wiggle (PRM-gated inside the glyph). */
.logo-caret {
    position: relative;
    flex: none;
    width: var(--caret-size);
    height: var(--caret-size);
    color: var(--color-foreground);
    transform: translateY(var(--caret-nudge)) rotate(90deg);
    transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

.logo-caret.is-open {
    transform: translateY(var(--caret-nudge)) rotate(-90deg);
}

.logo-menu-pop {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.45rem;
    z-index: 50;
}

/* H2-elevation-only: the floating paper note reads as a lifted sheet — popover bg
   (one tone off the card) + the md cartoon shadow, via the template classes. The
   placement half stays dead (the menu is ~99px; it never fights the fold). */
.logo-menu-card {
    list-style: none;
    margin: 0;
    padding: 0.45rem;
    border-radius: 0.75rem;
    min-width: max(9rem, 100%);
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    animation: logo-menu-in 250ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* H2's dark hairline is gone with the border (T3-W10 F1 one-edge ownership): the
   wobble frame draws the floating edge now, in both themes. */

.logo-menu-item {
    /* The hand register token (--font-hand ← Patrick Hand) + a true √φ ladder rung —
       H4 ladder-bind: 1.4rem was bespoke; --type-subheading (1.272rem) is the
       nearest rung. The ≥640px arm steps one rung to --type-heading (φ). */
    font-family: var(--font-hand);
    font-size: var(--type-subheading);
    line-height: 1.15;
    letter-spacing: 0.02em;
    color: var(--color-muted-foreground);
    padding: 0.15rem 0.65rem 0.5rem;
    border-radius: 0.4rem;
    cursor: pointer;
    user-select: none;
    background-repeat: no-repeat;
    background-origin: content-box;
    background-position: left bottom;
    transition: color 120ms, background-color 120ms;
}

.logo-menu-item.is-highlighted {
    color: var(--color-foreground);
    background-color: color-mix(in srgb, var(--color-foreground) 7%, transparent);
}

.logo-menu-item.is-highlighted:not(.is-active) {
    background-image: var(--ghost-underline);
    background-size: var(--ghost-width, 4ch) 8px;
}

/* The active game carries the scribble underline (scribbleUnderline.ts, same as OptionSelector). */
.logo-menu-item.is-active {
    color: var(--color-foreground);
    background-image: var(--scribble-underline);
    background-size: var(--scribble-width, 4ch) 8px;
}

/* R5 transform truthing (T3-W10 F1): cartoon-shadow-md's -2px lift was silently dead
   here (this animation fills forward at translateY(0)) — and folding it in measured as
   a 2px frame/card skew, since the wobble frame registers to the layout box transforms
   don't move. `edge-outlined` drops the lift instead (index.css); the keyframes stay at
   the shipped pose. Declared == rendered, under animation and PRM alike. */
@keyframes logo-menu-in {
    from {
        transform: translateY(-6px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* F6-D1 — the leave beat (page-turn beat 0): 140ms ease-out reverse of logo-menu-in
   (fade + 6px lift-up), Band C's tooltip-fade rung. Declared on the Transition ROOT
   (Vue watches this element's animation to time the DOM removal); pointer-events cut
   so a closing menu never intercepts the click that closed it. */
.logo-menu-leave-active {
    animation: logo-menu-out 140ms cubic-bezier(0.22, 1, 0.36, 1) both;
    pointer-events: none;
}

@keyframes logo-menu-out {
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(-6px);
        opacity: 0;
    }
}

@media (min-width: 640px) {
    .logo-menu {
        --caret-size: 1.9rem;
        --logo-height: 5.724rem;
    }
    .logo-menu-item {
        font-size: var(--type-heading);
    }
}

@media (min-width: 1024px) {
    .logo-menu {
        --caret-size: 2.3rem;
        --logo-height: 6.996rem;
    }
}

@media (prefers-reduced-motion: reduce) {
    .handwritten-logo {
        clip-path: none;
        transition: none;
    }
    .logo-caret {
        transition: none;
    }
    .logo-menu-card {
        animation: none;
    }
    /* No leave animation → Vue removes the node on the next tick (instant close). */
    .logo-menu-leave-active {
        animation: none;
    }
}
</style>
