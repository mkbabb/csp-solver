import { describe, it, expect, beforeEach } from "vitest";
import { useGameGallery } from "./useGameGallery";

// FE-unit layer (T4-W12 Wave B): the gallery VIEW state machine — a module-level singleton
// (the useControlsDrawer pattern). Covers the four transitions, the snap clamp, and the
// `?view=gallery` URL truth (added on open, cleared on select/cancel via replaceState). The
// `?game=` half is App.vue's, never this machine's — the gallery is a view over the one app,
// not a route.

const g = useGameGallery();

function viewParam(): string | null {
  return new URLSearchParams(window.location.search).get("view");
}

beforeEach(() => {
  // Reset to a known playing state with a clean URL between cases (the singleton persists).
  history.replaceState(null, "", "http://localhost/");
  g.cancel();
});

describe("useGameGallery", () => {
  it("defaults to the playing view with a valid snapped index", () => {
    expect(g.view.value).toBe("playing");
    expect(g.snappedIndex.value).toBeGreaterThanOrEqual(0);
  });

  it("openGallery enters the carousel, snaps to the from-game, and writes ?view=gallery", () => {
    g.openGallery("futoshiki");
    expect(g.view.value).toBe("gallery");
    expect(g.enteredFrom.value).toBe("futoshiki");
    expect(g.snappedIndex.value).toBe(1); // GAMES = [sudoku, futoshiki, thermo, killer, kenken]
    expect(viewParam()).toBe("gallery");
  });

  it("snapTo moves + clamps in the gallery, and is a no-op while playing", () => {
    g.openGallery("sudoku");
    g.snapTo(1);
    expect(g.snappedIndex.value).toBe(1);
    g.snapTo(99); // past the end → clamps to the last card (index 4 — five games, T4-W13)
    expect(g.snappedIndex.value).toBe(4);
    g.snapTo(-5); // before the start → clamps to 0
    expect(g.snappedIndex.value).toBe(0);

    g.cancel();
    g.snapTo(1); // playing → ignored
    expect(g.snappedIndex.value).toBe(0);
  });

  it("select returns to playing and clears ?view", () => {
    g.openGallery("sudoku");
    expect(viewParam()).toBe("gallery");
    g.select();
    expect(g.view.value).toBe("playing");
    expect(viewParam()).toBeNull();
  });

  it("cancel returns to playing and clears ?view", () => {
    g.openGallery("futoshiki");
    g.cancel();
    expect(g.view.value).toBe("playing");
    expect(viewParam()).toBeNull();
  });

  it("openGallery is idempotent while already in the gallery", () => {
    g.openGallery("sudoku");
    g.snapTo(1);
    g.openGallery("futoshiki"); // already open → no re-entry, index unchanged
    expect(g.snappedIndex.value).toBe(1);
    expect(g.enteredFrom.value).toBe("sudoku");
  });
});
