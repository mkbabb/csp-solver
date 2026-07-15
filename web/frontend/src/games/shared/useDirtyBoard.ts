import { ref, watch, type Ref, type WatchStopHandle } from "vue";

/**
 * The mid-game guard's dirty bridge (T4-W12 Wave D §7) — a module-level singleton, the
 * `useControlsDrawer` / `registerDrawerMasthead` pattern.
 *
 * The mounted scene's board owns the ONE dirty signal: `useGameState`'s `isDirty`
 * (`undoDepth > 0`, T4-WU/U3). This bridge FORWARDS that signal up to the app shell (App.vue
 * reads it, passes the boolean into the pencil-pure gallery as a prop, since
 * `pencil/** ↛ games/**`). `dirty` is a strict MIRROR of the registered `isDirty` — a watch
 * with `{ immediate: true }` copies its value, nothing else feeds it, so it is a transport of
 * the single WU signal, NOT a parallel dirtiness computation (the spec's "reuse WU's
 * undo-depth signal, no parallel bool").
 *
 * Only ONE live board is ever mounted (the poster/live-face split holds the perf floor), so a
 * single slot suffices. A page-turn / gallery cut swaps scenes: the new scene registers
 * synchronously at setup (its source syncs before it paints); the old scene's `onUnmounted`
 * clears — but ONLY if it still owns the slot (the identity guard), so a mount-before-unmount
 * ordering can never null out the incoming scene's source.
 */

const dirty = ref(false);
let current: Ref<boolean> | null = null;
let stop: WatchStopHandle | null = null;

/** The mounted scene registers its board's `isDirty` here (synchronously at setup). A new
 *  registration supersedes the old; `dirty` mirrors the new source from this instant. */
export function registerDirtySource(isDirty: Ref<boolean>): void {
  if (current === isDirty) return;
  stop?.();
  current = isDirty;
  stop = watch(isDirty, (v) => (dirty.value = v), { immediate: true });
}

/** The scene drops its source on unmount. Identity-guarded: a no-op if a newer scene has
 *  already taken the slot (mount-before-unmount ordering during a swap). */
export function clearDirtySource(isDirty: Ref<boolean>): void {
  if (current !== isDirty) return;
  stop?.();
  stop = null;
  current = null;
  dirty.value = false;
}

export function useBoardDirty(): Readonly<Ref<boolean>> {
  return dirty;
}
