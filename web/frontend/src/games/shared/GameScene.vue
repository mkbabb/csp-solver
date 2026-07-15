<script setup lang="ts">
/**
 * GameScene — the game-agnostic scene scaffold (T4-W11 R4). Both scenes (SudokuGame,
 * FutoshikiGame) shared the same board+controls layout, the drawer registration, and the
 * doubled controls card (stacked <lg + row-regime ≥lg). That scaffold — the `.app-layout`
 * row, the `.board-peek-host` (with the pull-`DrawerTab`), the two `HandDrawnOutline`
 * controls cards, the drawer's scene registration + Esc-close wiring, and the shared
 * `scene.css` (the class-name contract) — lives HERE, once. The game supplies its board +
 * answer-key laminate (`#board` slot) and its control panel (`#controls` scoped slot,
 * rendered in both cards, told which regime by `mobile`).
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

defineProps<{ leaving?: boolean }>();

// ── The drawer (T3-W12 §6) ───────────────────────────────────────────
// The row-regime rail becomes the pencil case: the tab (inside .board-peek-host, so it
// rides the board's glide) toggles; the shared composable owns state, persistence, the
// ~480ms FLIP glide, and focus. Esc closes from within (the rail's keydown).
const { drawerOpen, drawerInert, toggleDrawer, closeDrawer } = useControlsDrawer();
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
         the laminate's inset:0 aligns to .board-cells. -->
    <div ref="peekHost" class="board-peek-host">
      <slot name="board" />
      <!-- The pull-tab (T3-W12 §6): the tucked case's tongue at the board's right edge —
           inside the peek host so it rides the glide, outside the board wrapper's
           containment (§2 P2). ≥1024 only (its own display gate). -->
      <DrawerTab ref="drawerTab" :expanded="drawerOpen" @toggle="toggleDrawer" />
    </div>

    <!-- Stacked (<lg, incl. iPad portrait — R3): unified controls card below board -->
    <div class="mobile-board-width lg:hidden">
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
    <div
      id="controls-drawer"
      ref="railEl"
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
