import { ref, type Ref } from "vue";

/**
 * The live-center-face bridge (T4-W12 Wave C2 §choreography deviation 1) — a module-level
 * singleton, the `useControlsDrawer` / `useDirtyBoard` pattern.
 *
 * THE ONE LIVE BOARD, PROJECTED. The spec's marquee: on the desk the CENTER card's face is
 * the *live current board* (state + marks preserved), flanks are static posters. The board is
 * never duplicated — it is REPARENTED. The scene scaffold (`GameScene`) wraps its
 * `.board-peek-host` in a `<Teleport :to="faceTarget">`; App.vue (the app shell — it owns
 * `games/**`) sets `faceTarget` to the gallery's live-face mount element, and the ONE mounted
 * board's DOM relocates into the center card's face. The component instance never re-mounts
 * (Teleport moves DOM, not vnodes), so the Worker/solve state/user marks all survive — the
 * V-flagged "marks lost at center" gap closed by construction.
 *
 * THE BOUNDARY (pencil ↛ games). The teleport target is a bare positioned `<div>` the gallery
 * card renders and emits UP as a DOM element; App feeds it here. Pencil imports nothing from
 * games — the projected CONTENT (the board subtree) belongs to App's context, the gallery only
 * positions the slot. `null` parks the board back home (its `v-show`-hidden scene node), so
 * flanks/off-current navigation show posters and exactly ONE live board exists on the page.
 *
 * A single slot suffices: only one scene is mounted at a time (`v-if` on the game), so there is
 * only ever one `.board-peek-host` and one Teleport reading this ref.
 */

/** The gallery's live-face mount element, or null (board parks home). A reactive ref so the
 *  scene's `<Teleport :to>` follows it; App sets it, GameScene consumes it. */
const faceTarget = ref<HTMLElement | null>(null);

export function setLiveFaceTarget(el: HTMLElement | null): void {
  faceTarget.value = el;
}

export function useLiveFace(): { faceTarget: Readonly<Ref<HTMLElement | null>> } {
  return { faceTarget };
}
