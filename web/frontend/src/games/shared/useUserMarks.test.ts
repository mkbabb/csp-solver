import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ref } from "vue";
import { useUserMarks } from "./useUserMarks";
import { usePencilMarks } from "./usePencilMarks";

// FE-unit layer (T4-W8 ROW 1): the user-mark store — the player's own notes, distinct in
// state AND placement from the engine's peek marks. Covers the mode router (off/corner/center),
// the toggle-add/toggle-remove primitive, sorted order, the two-slot split (a corner mark and a
// center mark coexist untouched), the Backspace erase, the board-generation void, and — the
// residual-risk gate — that a user mark survives a peek toggle and an engine-mark refresh
// unchanged (the two systems share a cell but never share state).

describe("useUserMarks — the mode router", () => {
  it("is born 'off' — no digit becomes a note until the mode is on", () => {
    const gen = ref(0);
    const m = useUserMarks(gen);
    expect(m.pencilMode.value).toBe("off");
    m.toggleUserMark(3, 5); // ignored while off — a value keystroke, not a note
    expect(m.cornerMarks.value).toEqual({});
    expect(m.centerMarks.value).toEqual({});
  });

  it("cycles off → corner → center → off", () => {
    const m = useUserMarks(ref(0));
    m.cyclePencilMode();
    expect(m.pencilMode.value).toBe("corner");
    m.cyclePencilMode();
    expect(m.pencilMode.value).toBe("center");
    m.cyclePencilMode();
    expect(m.pencilMode.value).toBe("off");
  });

  it("setPencilMode jumps straight to a slot", () => {
    const m = useUserMarks(ref(0));
    m.setPencilMode("center");
    expect(m.pencilMode.value).toBe("center");
  });
});

describe("useUserMarks — authoring a note", () => {
  it("a corner-mode digit lands in the corner slot, sorted; re-entry toggles it off", () => {
    const m = useUserMarks(ref(0));
    m.setPencilMode("corner");
    m.toggleUserMark(3, 7);
    m.toggleUserMark(3, 2);
    m.toggleUserMark(3, 5);
    expect(m.cornerMarks.value["3"]).toEqual([2, 5, 7]); // ascending, insertion order irrelevant
    expect(m.centerMarks.value["3"]).toBeUndefined(); // the other slot is untouched
    m.toggleUserMark(3, 5); // the same digit again removes it
    expect(m.cornerMarks.value["3"]).toEqual([2, 7]);
  });

  it("the two slots are independent — a corner note and a center note coexist on one cell", () => {
    const m = useUserMarks(ref(0));
    m.setPencilMode("corner");
    m.toggleUserMark(4, 1);
    m.setPencilMode("center");
    m.toggleUserMark(4, 9);
    expect(m.cornerMarks.value["4"]).toEqual([1]);
    expect(m.centerMarks.value["4"]).toEqual([9]);
  });

  it("value 0 (the pencil-mode Backspace) erases BOTH slots at the cell", () => {
    const m = useUserMarks(ref(0));
    m.setPencilMode("corner");
    m.toggleUserMark(2, 3);
    m.setPencilMode("center");
    m.toggleUserMark(2, 8);
    m.toggleUserMark(2, 0); // erase-all at cell 2
    expect(m.cornerMarks.value["2"]).toBeUndefined();
    expect(m.centerMarks.value["2"]).toBeUndefined();
  });

  it("emptying a cell's last note drops the key (no empty arrays linger)", () => {
    const m = useUserMarks(ref(0));
    m.setPencilMode("corner");
    m.toggleUserMark(6, 4);
    m.toggleUserMark(6, 4); // off again
    expect("6" in m.cornerMarks.value).toBe(false);
  });
});

describe("useUserMarks — a fresh board voids the notes", () => {
  it("a boardGeneration bump clears every note but keeps the mode", async () => {
    const gen = ref(0);
    const m = useUserMarks(gen);
    m.setPencilMode("center");
    m.toggleUserMark(1, 5);
    gen.value++; // clear / randomize / size swap all bump this
    await Promise.resolve(); // let the watcher flush
    expect(m.centerMarks.value).toEqual({});
    expect(m.pencilMode.value).toBe("center"); // the preference survives
  });
});

// ── The collision gate (residual risk, PERMANENT) ──────────────────────────────────────────
// Two mark systems share the cell: the engine's peek marks (the solver's propagated domains,
// `usePencilMarks`) and the user's notes (`useUserMarks`). They mean different things and are
// separate stores by construction — so a peek toggle and an engine-mark refresh must leave a
// user note byte-for-byte unchanged. This test runs the engine store through a full peek cycle
// (activate → refresh → release → re-activate) and asserts the user store never moved.
describe("useUserMarks — a user note survives a peek toggle + an engine refresh (COLLISION GATE)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("the engine's peek marks never touch the user's notes", async () => {
    const gen = ref(0);
    const user = useUserMarks(gen);
    user.setPencilMode("corner");
    user.toggleUserMark(3, 5);
    user.setPencilMode("center");
    user.toggleUserMark(3, 2);
    const cornerBefore = user.cornerMarks.value;
    const centerBefore = user.centerMarks.value;

    // The engine store — a stub propagate returning a real domain mask so refreshMarks resolves.
    const boardSize = ref(9);
    const totalCells = ref(81);
    const values = ref<Record<string, number>>({});
    // Cell 3 keeps candidates {1,2} surviving (bits 1 and 2 set) — a genuine engine mark.
    const masks = new Uint32Array(81);
    masks[3] = (1 << 1) | (1 << 2);
    const propagate = vi.fn(async () => masks);
    const engine = usePencilMarks(propagate, values, boardSize, totalCells);

    // A peek toggle: hold (activate + first paint), then release, then hold again — the whole
    // gesture the user note must outlive.
    engine.setMarksActive(true);
    await vi.advanceTimersByTimeAsync(200);
    expect(engine.pencilMarks.value["3"]).toEqual([1, 2]); // the engine mark is live
    engine.setMarksActive(false);
    engine.setMarksActive(true);
    await vi.advanceTimersByTimeAsync(200);
    engine.refreshMarks(0);
    await vi.advanceTimersByTimeAsync(200);

    // The user note is untouched — same identity (never reassigned) and same content.
    expect(user.cornerMarks.value).toBe(cornerBefore);
    expect(user.centerMarks.value).toBe(centerBefore);
    expect(user.cornerMarks.value["3"]).toEqual([5]);
    expect(user.centerMarks.value["3"]).toEqual([2]);
  });
});

// ── The T4-WU history-restore seam ──────────────────────────────────────────────────────────
// The board-undo replay needs two things this store didn't expose: a slot-list write (to
// replay a `mark` entry verbatim) and a wholesale two-slot restore (to travel the marks that
// annotated a board). And the RESTORE-ORDER edge (E9 r2's sharpest): a board undo bumps
// `boardGeneration`, whose void-watch would wipe the marks it just restored — so a transient
// `restoring` flag must no-op the void-watch for exactly that restore.
describe("useUserMarks — the T4-WU history-restore seam", () => {
  it("setMarkSlot writes a slot's list verbatim (the `mark`-entry replay primitive)", () => {
    const m = useUserMarks(ref(0));
    m.setMarkSlot("corner", "3", [5, 2, 8]);
    expect(m.cornerMarks.value["3"]).toEqual([5, 2, 8]);
    m.setMarkSlot("corner", "3", []); // empty ⇒ erase the key
    expect(m.cornerMarks.value["3"]).toBeUndefined();
    m.setMarkSlot("off", "3", [1]); // 'off' is a no-op — a note is only ever a slot write
    expect(m.cornerMarks.value["3"]).toBeUndefined();
  });

  it("setUserMarks restores both slots wholesale (the board-node marks)", () => {
    const m = useUserMarks(ref(0));
    m.setUserMarks({ "1": [4] }, { "2": [7, 9] });
    expect(m.cornerMarks.value).toEqual({ "1": [4] });
    expect(m.centerMarks.value).toEqual({ "2": [7, 9] });
  });

  it("restoring=true no-ops the void-watch on a generation bump; false voids as before", async () => {
    const gen = ref(0);
    const m = useUserMarks(gen);
    m.setPencilMode("corner");
    m.toggleUserMark(3, 5);
    expect(m.cornerMarks.value["3"]).toEqual([5]);

    // A NORMAL bump (deal / clear / resize) still voids the notes.
    gen.value++;
    await Promise.resolve();
    expect(m.cornerMarks.value).toEqual({});

    // Re-hydrate, then bump UNDER `restoring` → the notes SURVIVE (the board-undo restore).
    m.setUserMarks({ "3": [5] }, {});
    m.restoring.value = true;
    gen.value++;
    await Promise.resolve();
    expect(m.cornerMarks.value["3"]).toEqual([5]); // NOT voided
    m.restoring.value = false;

    // Once the flag lowers, the void-watch is armed again.
    gen.value++;
    await Promise.resolve();
    expect(m.cornerMarks.value).toEqual({});
  });
});
