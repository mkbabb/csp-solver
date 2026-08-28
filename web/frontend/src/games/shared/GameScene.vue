<script setup lang="ts">
/**
 * GameScene — the game-agnostic scene scaffold (T4-W11 R4). Both scenes (SudokuGame,
 * FutoshikiGame) shared the same board+controls layout, the drawer registration, and the
 * controls card in its two regimes (stacked <lg + row-regime ≥lg). That scaffold — the
 * `.app-layout` row, the `.board-peek-host` (with the pull-`DrawerTab`), the `HandDrawnOutline`
 * controls card of the live regime, the drawer's scene registration + Esc-close wiring, and the
 * shared `scene.css` (the class-name contract) — lives HERE, once. The game supplies its board +
 * answer-key laminate (`#board` slot) and its control panel (`#controls` scoped slot, rendered
 * in whichever card the regime mounts, told which one by `mobile`).
 *
 * The drawer GLIDE ENGINE is untouched (it lives in useControlsDrawer + scene.css); this
 * shell only plumbs the refs the engine reads (host/rail/panel/tab) and registers them.
 */
import { computed, onMounted, onUnmounted, ref } from "vue";
import DrawerTab from "@games/shared/DrawerTab.vue";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import {
  mobileDock,
  portraitDock,
  registerDrawerScene,
  useControlsDrawer,
} from "@games/shared/useControlsDrawer";
import { useLiveFace } from "@games/shared/useLiveFace";
import { useRowRegime } from "@games/shared/useCoarsePointer";

defineProps<{ leaving?: boolean }>();

// ── The live-center-face projection (T4-W12 Wave C2 §choreography, deviation 1) ────────
// When the gallery is open on THIS game, App sets `faceTarget` to the center card's live-face
// mount; the `.board-peek-host` below teleports into it (the ONE board, reparented — never a
// second live scene), so the center card's face IS the live board with its marks. `null` parks
// it home (disabled Teleport renders in place), where `v-show` hides it — the playing view and
// every drawer/golden path see the byte-identical home DOM (a disabled Teleport is a no-op).
const { faceTarget } = useLiveFace();

// ── The drawer (T3-W12 §6) ───────────────────────────────────────────
// The row-regime rail becomes the pencil case: the tab (inside .board-peek-host, so it
// rides the board's glide) toggles; the shared composable owns state, persistence, the
// ~480ms FLIP glide, and focus. Esc closes from within (the rail's keydown).
const { drawerOpen, drawerInert, toggleDrawer, closeDrawer } = useControlsDrawer();

/** THE TONGUE HANGS OFF THE BOARD'S SLACK EDGE (T9-W2 §2.7, the owner's M10 — a DECLARED
 *  DELTA re-aiming T6.2 mark A). ONE instance, one drawn word, one `aria-expanded` /
 *  `aria-controls` pair; what moves is which berth holds it, and there are exactly three:
 *
 *    · `null` — the DESK, and the LANDSCAPE dock with the sheet shut. A disabled Teleport
 *      renders in place inside `.board-peek-host`, which is the shipped desk pose: the tongue
 *      tucked under the board's right edge. A landscape phone is a wide-and-short cell exactly
 *      like the desk, so it takes that pose verbatim rather than inventing a fourth one.
 *    · `#board-edge` — the PORTRAIT dock, sheet shut: the zero-box berth at the board's own
 *      bottom rail (`GameBoard`), where the tongue hangs off the paper's bottom-right corner.
 *      This is the M10 mark: the desk's side tab, quarter-turned onto the edge a narrow-and-
 *      tall viewport gives. It replaces mark A's ribbon berth, where the chip floated 54.8px
 *      below the board in dead space (measured at 390×844, 375×812 and 430×932 — identical,
 *      so the gap was structural rather than a pose accident).
 *    · `#drawer-handle` — EITHER orientation, sheet up. The risen sheet is full-width and
 *      covers the board whole, so a berth that stayed on the board would be a drawer that
 *      cannot be shut; the same button rides up as the case's handle, the pose every drawer
 *      row already exercises.
 *
 *  `defer` because all three berths are minted later in this same template (or, for
 *  `#board-edge`, inside the board slot below it). */
const tongueBerth = computed(() =>
  mobileDock.value && drawerOpen.value
    ? "#drawer-handle"
    : portraitDock.value
      ? "#board-edge"
      : null,
);

// ── ONE control-panel CARD, full stop (T5-W4 pass 6) ─────────────────────────────────────
// P1-W4's rule was "one twin, never both"; it RETIRES BY CONSTRUCTION here, because there is
// no longer a second card to be the other twin. The stacked `<lg` card is deleted and its two
// offices pass to the one `#controls-drawer`: below 1024 in LANDSCAPE it takes the in-flow
// static pose the twin used to hold (byte-identical box — the lead's charter (c) holds that
// rung RATIFIED), and below 1024 in PORTRAIT it becomes the fixed sheet the covis row was
// waiting for. `rowRegime` still decides which INTERIOR the card renders (`:mobile`), so the
// mobile arm — the pass-5 cure — carries down whole and nothing the owner marked is
// re-imported.
const rowRegime = useRowRegime();
const peekHost = ref<HTMLElement | null>(null);
const railEl = ref<HTMLElement | null>(null);
const panelEl = ref<HTMLElement | null>(null);
const drawerTab = ref<InstanceType<typeof DrawerTab> | null>(null);
let unregisterDrawer: (() => void) | null = null;
onMounted(() => {
  unregisterDrawer = registerDrawerScene(() => ({
    host: peekHost.value,
    rail: railEl.value,
    panel: panelEl.value,
    tab: (drawerTab.value?.el as HTMLElement | undefined) ?? null,
  }));
});
onUnmounted(() => unregisterDrawer?.());
</script>

<template>
  <div class="app-layout" :class="{ 'scene-leaving': leaving }">
    <!-- Board + the held answer-key laminate (a sibling over the board, never inside the
         grid's filtered group — kill-gate rule 6). The host tightly wraps the board box so
         the laminate's inset:0 aligns to .board-cells.

         Wave C2: the whole host is a Teleport mover — when the gallery is open on this game,
         it relocates into the center card's live face (`.in-live-face` scales it to fit); when
         `faceTarget` is null the Teleport is DISABLED (renders here, unchanged). ONE instance
         throughout — marks/Worker/solve state survive the reparent. -->
    <Teleport :to="faceTarget" :disabled="!faceTarget">
      <div
        ref="peekHost"
        class="board-peek-host"
        :class="{ 'in-live-face': !!faceTarget }"
      >
        <slot name="board" />
        <!-- The pull-tab (T3-W12 §6): the tucked case's tongue at the board's right edge —
             inside the peek host so it rides the glide, outside the board wrapper's
             containment (§2 P2).

             T5-W4 pass 6 — IT RIDES THE CASE, NOT THE BOARD, ON PORTRAIT, and that was born of
             a red rather than of taste: a board-anchored tongue is COVERED by the risen sheet,
             so the drawer becomes untouchable the moment it opens. On the desk the case slides
             AWAY from the board and the board's own edge is exactly where the tongue belongs;
             on the phone the case slides OVER it. ONE component, one word, one ARIA pair — a
             Teleport, not a second tab (a second tab is a second `aria-controls` claiming the
             same region).

             T9-W2 §2.7 — RE-AIMED AT THE BOARD'S OWN EDGE (the owner's M10). The berth is
             `tongueBerth` (above), and `null` is the pose that renders HERE: the desk, and the
             landscape dock with the sheet shut. Pass 6's reason for leaving the board — "a
             board-anchored tongue is COVERED by the risen sheet" — is answered by the OPEN
             berth rather than by the shut one, which is what mark A had not separated: only
             the risen pose needs to leave the board, and only it does.
             The `:to` fallback is a live selector on purpose. Vue resolves `to` even for a
             disabled Teleport in dev, and `#drawer-handle` is always mounted (zero-box outside
             the dock), so the disabled arm names a target that exists. -->
        <Teleport defer :to="tongueBerth ?? '#drawer-handle'" :disabled="!tongueBerth">
          <DrawerTab ref="drawerTab" :expanded="drawerOpen" @toggle="toggleDrawer" />
        </Teleport>
      </div>
    </Teleport>

    <!-- THE FOLD'S RIBBON (pass 6; T6.2 mark A) — the berth `GameControlPanel` teleports
         `.play-controls` into on the portrait dock, and the berth the drawer's own tongue takes
         while the sheet is shut. Undo · redo · hint · peek · controls, in flow, always on
         screen, because the sheet that holds every between-moves act is a gesture away and
         PLAYING must never need it. Coarse-only and portrait-only by CSS, exactly like the
         `.play-controls` row it receives; empty and display:none everywhere else, so no regime
         but the dock's pays a box for it. -->
    <div id="fold-tools" class="fold-tools" />

    <!-- Row-regime sidebar (≥lg — R3: iPad portrait clips at md): controls card,
         vertically centered against the board (H8-centering-only). T3-W12 §6: the rail
         IS the drawer — closed it parks under the board (scene.css), inert +
         visibility:hidden at rest (no invisible tab stops, W11 UI-6); Esc from within
         closes and returns focus to the tab. -->
    <!-- a11y r1 M7: the rail moves focus like a dialog (`useControlsDrawer.focusPanel`) into a
         region that had no accessible name, so the arrival was announced by nothing —
         `aria-controls` can only name a region that HAS a name. `region` + the tab's own word:
         one string for the drawn tongue and the AT label, so opening speaks "controls". At
         closed-idle the rail is inert + visibility:hidden, so the landmark is absent at rest,
         which is what it should be. -->
    <!-- T5-W4 pass 6 — the `v-if="rowRegime"` is GONE. One card, three poses (scene.css), and
         `inert` splits by regime because an inert rail is an unopenable drawer: on the desk the
         WHOLE region goes inert at closed-idle (shipped, byte-untouched); on the portrait dock
         the CASE goes inert and the region keeps carrying its tongue. Disclosed AX change, the
         owner's to accept: below 1024 the named `controls` region is present in the tree at
         rest, holding exactly one named button. Not a modal — same landmark, same
         `aria-expanded`/`aria-controls` on the same button, Esc closes from within. -->
    <div
      id="controls-drawer"
      ref="railEl"
      role="region"
      aria-label="controls"
      class="scene-controls lg:flex lg:flex-col lg:items-start"
      :inert="rowRegime ? drawerInert : undefined"
      @keydown.escape.stop="closeDrawer"
    >
      <!-- The tongue's berth while the sheet is UP: the case's top-right corner (T6.2 mark A —
           shut, the tongue is a verb in the ribbon and this berth stands empty). Zero box
           outside the dock. -->
      <div id="drawer-handle" class="drawer-handle" />
      <HandDrawnOutline
        :stroke-width="3"
        class="drawer-case"
        :inert="!rowRegime && drawerInert"
      >
        <!-- T9-W2 §2.3/§2.5 — THE CARD'S PADDING IS READ IN TWO OTHER PLACES NOW, and both
             are noted at their own end too. `scene.css` takes the rail's 6px scrollbar gutter
             back out of `p-5`'s right side (so the card's outer box, and the board it is
             centred against, do not move) and overrides the BOTTOM to reserve the note berth
             under the action bar; `GameControlPanel` publishes the resulting `padding-bottom`
             as `--card-pad-b` / `--action-bar-h`. Re-cut this binding and re-cut those. -->
        <div
          ref="panelEl"
          class="controls-card bg-card"
          :class="rowRegime ? 'rounded-xl p-5' : 'rounded-lg px-2 py-1.5'"
        >
          <slot name="controls" :mobile="!rowRegime" />
        </div>
      </HandDrawnOutline>
    </div>
  </div>
</template>

<style scoped src="@/games/shared/scene.css"></style>

<style scoped>
/* ── The live-center-face pose (T4-W12 Wave C2) ───────────────────────────
   When teleported into the gallery card, the host renders at its natural board size inside
   the card's `.live-face-fit` wrapper (which owns the absolute-center position + the
   `scale(--live-fit)` that shrinks a full board into the card face — a COMPOSITOR transform,
   so the board keeps its playing-view raster: the crit-kill "layout size is never tweened"
   holds, the board just travels). The scoped data-v attribute rides the element through the
   Teleport, so these rules reach it in its new parent. */
.board-peek-host.in-live-face {
  /* A card face is a preview — the GameCard owns click-to-select; the projected board must
     not swallow the pointer (else selecting the centered card would miss). */
  pointer-events: none;
}

/* No pull-tab, no drawer furniture on a card face. */
.board-peek-host.in-live-face :deep(.drawer-tab) {
  display: none;
}
</style>
