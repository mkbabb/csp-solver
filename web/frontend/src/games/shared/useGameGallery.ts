import { ref } from "vue";
import { GAMES } from "@games/cards";

/**
 * The game-gallery view state machine (T4-W12 §7) — a module-level singleton, the
 * `useControlsDrawer` pattern. It owns the SELECT-SCREEN view state and the `?view=`
 * URL truth; it does NOT own the game itself (`?game=` + the page-turn stay App.vue's,
 * so the no-router "gallery is a view over the same app" invariant holds — the gallery
 * is not a route). Import boundary: this lives at `games/shared`, so it may read the
 * game-agnostic `@games/cards` (THE registration table, outside every concrete-game
 * glob) to map an `id` ⇄ carousel index; it imports NO concrete game.
 *
 *   view: 'playing' | 'gallery'   (default 'playing'; deep-link `?view=gallery` lands here)
 *   snappedIndex: number          (the centered card)
 *   enteredFrom: GameCard.id       (the fold-from / cancel target)
 *   openGallery(fromId)  playing → gallery  (snappedIndex = the current game's card)
 *   snapTo(i)            gallery             (the glide target; drives aria + the live region)
 *   select() / cancel()  gallery → playing  (both clear `?view`; App layers the `?game=`
 *                                            swap onto @select, nothing onto @cancel —
 *                                            keeping the game/URL truth in one place)
 *
 * Wave B is the STATIC cut: open/close is the PRM same-frame cut for everyone (the
 * board⇄card FLIP fold is Wave C). The `?view` param is written on open and cleared on
 * select/cancel via `history.replaceState` (App.vue's URL-truth grammar, never a router).
 */

const hasDom = typeof window !== "undefined";

type View = "playing" | "gallery";

function indexOfId(id: string): number {
  const i = GAMES.findIndex((g) => g.id === id);
  return i >= 0 ? i : 0;
}

/** The current `?game=` token, validated against the table (falls back to game #1). */
function parseGameId(): string {
  const fallback = GAMES[0]?.id ?? "sudoku";
  if (!hasDom) return fallback;
  const g = new URLSearchParams(window.location.search).get("game");
  return g && GAMES.some((c) => c.id === g) ? g : fallback;
}

/** Boot parse — a `?view=gallery` deep-link lands directly in the carousel (§7). */
function parseView(): View {
  if (!hasDom) return "playing";
  return new URLSearchParams(window.location.search).get("view") === "gallery"
    ? "gallery"
    : "playing";
}

const view = ref<View>(parseView());
const snappedIndex = ref<number>(indexOfId(parseGameId()));
const enteredFrom = ref<string>(parseGameId());

/** `?view=gallery` added on open, cleared on select/cancel (replaceState — App.vue:80-88). */
function writeViewParam(open: boolean) {
  if (!hasDom) return;
  const url = new URL(window.location.href);
  if (open) url.searchParams.set("view", "gallery");
  else url.searchParams.delete("view");
  history.replaceState(null, "", url.toString());
}

function openGallery(fromId: string) {
  if (view.value === "gallery") return;
  enteredFrom.value = fromId;
  snappedIndex.value = indexOfId(fromId);
  view.value = "gallery";
  writeViewParam(true);
}

function snapTo(i: number) {
  if (view.value !== "gallery") return;
  snappedIndex.value = Math.max(0, Math.min(GAMES.length - 1, i));
}

/** Both exits clear the view + `?view`; App.vue owns the `?game=` half (only on select). */
function closeToPlaying() {
  if (view.value !== "gallery") return;
  view.value = "playing";
  writeViewParam(false);
}

function select() {
  closeToPlaying();
}

function cancel() {
  closeToPlaying();
}

export function useGameGallery() {
  return {
    view,
    snappedIndex,
    enteredFrom,
    openGallery,
    snapTo,
    select,
    cancel,
  };
}
