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
import { onMounted, onUnmounted, ref } from "vue";
import DrawerTab from "@games/shared/DrawerTab.vue";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import {
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

// ── ONE control-panel twin, never both (P1-W4, the banked P-W3 conditional) ──────────────
// Its trigger fired: themeToggle came in at 83.80 against the gates.json ≥85 floor, and the
// two twins were the last always-mounted duplicate on the theme swap's recalc path — every
// control, icon and pose in the unpainted card is still style-resolved and still rasters (the
// filter census counted the hidden twin's 4 divider poses at every width, which is the proof).
// The Tailwind classes below STAY: they are the synchronous regime (a v-if flushes on the next
// tick) and they define the same 1024 boundary this ref reads, so no frame can show neither.
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
             containment (§2 P2). ≥1024 only (its own display gate). -->
        <DrawerTab ref="drawerTab" :expanded="drawerOpen" @toggle="toggleDrawer" />
      </div>
    </Teleport>

    <!-- Stacked (<lg, incl. iPad portrait — R3): unified controls card below board -->
    <div v-if="!rowRegime" class="mobile-board-width lg:hidden">
      <HandDrawnOutline :stroke-width="3">
        <div class="bg-card rounded-lg px-2 py-1.5">
          <slot name="controls" :mobile="true" />
        </div>
      </HandDrawnOutline>
    </div>

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
    <div
      v-if="rowRegime"
      id="controls-drawer"
      ref="railEl"
      role="region"
      aria-label="controls"
      class="scene-controls hidden lg:flex lg:flex-col lg:items-start"
      :inert="drawerInert"
      @keydown.escape.stop="closeDrawer"
    >
      <HandDrawnOutline :stroke-width="3">
        <div ref="panelEl" class="controls-card bg-card rounded-xl p-5">
          <slot name="controls" :mobile="false" />
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
