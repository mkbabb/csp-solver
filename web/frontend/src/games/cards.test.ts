/**
 * THE TABLE's acceptance proof (T5-W2 2.1) — the card contract, and the spec seam under it.
 *
 * `cards.ts` is the estate's only registration table now. What this pins:
 *   1. the five rows, their ids, and the id ⇄ name identity;
 *   2. the main-chunk/lazy chunking asymmetry, read off the SHAPE of `mount` (sudoku carries
 *      its spec outright, the other four carry a thunk) — one slot, no second claim to drift;
 *   3. every row resolves BOTH its poster and its mount — one arm, five games, always a
 *      `GameSpec` — so a broken loader can never pass silently;
 *   4. the migrated row's `persistKey` NAMES its spec's `urlCodec.key` rather than mirroring
 *      the string, which is what keeps one source for a game's board on disk;
 *   5. the drop-in invariant: a sixth game is one row plus its own spec, with no edit
 *      anywhere else.
 */
import { describe, it, expect } from "vitest";
import { defineComponent } from "vue";
import { GAMES, type GameCard } from "./cards";
import { sudokuSpec } from "@games/sudoku/spec";

describe("the game table (T5-W2 — the one registration list)", () => {
  it("exposes all five games as rows; id === name", () => {
    expect(GAMES.map((c) => c.id)).toEqual([
      "sudoku",
      "futoshiki",
      "thermo",
      "killer",
      "kenken",
    ]);
    // The card names the SAME game its id registers under — never a parallel identity.
    for (const card of GAMES) expect(card.name).toBe(card.id);
  });

  it("preserves the Sudoku-main-chunk / everything-else-lazy chunking asymmetry", () => {
    // T9-W6 §6.1: the asymmetry used to be a BOOLEAN (`eager`) beside a loader that the eager
    // row never called, and App read the boolean and then mounted a spec it had imported
    // itself. Now the shape of `mount` IS the claim — a spec means the main chunk, a thunk
    // means that game's own chunk — so there is nothing left for a boolean to disagree with.
    const [sudoku, futoshiki] = GAMES;
    expect(typeof sudoku.mount).not.toBe("function");
    expect(sudoku.mount).toBe(sudokuSpec);
    expect(typeof futoshiki.mount).toBe("function");
    for (const card of GAMES.slice(1)) expect(typeof card.mount).toBe("function");
  });

  it("carries a size sub-line derived from each game's own selector vocabulary", () => {
    const [sudoku, futoshiki] = GAMES;
    expect(sudoku.range.levels).toEqual(["4×4", "9×9", "16×16"]);
    expect(futoshiki.range.levels).toEqual(["4×4", "5×5", "6×6", "7×7"]);
  });

  it("gives every row the same single mount — its spec, and nothing else", () => {
    // ONE slot, two shapes, and every row fills it. A row that filled neither, or that
    // carried a mount arm nothing reads, is the class this replaced.
    for (const card of GAMES)
      expect(typeof card.mount === "function" || typeof card.mount === "object").toBe(
        true,
      );
    // The F1 `scene` arm is gone: five of five rows hand `GameShell` a spec, so the union
    // that carried the unmigrated families collapsed to its first arm and the interim with
    // it. The order IS the carousel's order.
    expect(GAMES.map((c) => c.id)).toEqual([
      "sudoku",
      "futoshiki",
      "thermo",
      "killer",
      "kenken",
    ]);
  });

  it("resolves every row's poster and its mount", async () => {
    for (const card of GAMES) {
      expect(await card.poster()).toBeTruthy();
      const spec = typeof card.mount === "function" ? await card.mount() : card.mount;
      {
        // The eight slots, live: the shell reads exactly these at mount.
        expect(spec.id).toBe(card.id);
        expect(typeof spec.model).toBe("function");
        expect(spec.grammar.geometry).toMatch(/^(boxed|latin)$/);
        expect(spec.clues === null || typeof spec.clues.props === "function").toBe(
          true,
        );
        expect(spec.furniture.cell).toBeTruthy();
        expect(typeof spec.solver.nodeBudget).toBe("function");
        // The cold-start warm is no longer a slot: 2.2 left ONE Worker over the one wasm
        // binary, so `GameShell` warms it directly and no game holds a handle onto it.
        expect(spec.urlCodec.key).toBeTruthy();
        // `deal` carries the drawer's section builder and nothing else since T9-W6 §6.1: its
        // `sizes`/`difficulty` bands were declared by all five games and readable by one, so
        // they retired to `@games/shared/selectors`, where the table already read them.
        expect(typeof spec.deal.options).toBe("function");
        expect(Object.keys(spec.deal)).toEqual(["options"]);
        // ONE board on disk, whether the row names the spec's key (an eager row can) or
        // spells it (a lazy row must, so the ledger backfill loads no specs). Drift here
        // would strand a saved board behind a key nothing reads.
        expect(spec.urlCodec.key).toBe(card.persistKey);
      }
    }
  });

  it("sources the migrated row's persistKey from its spec — one string, not two", () => {
    const [sudoku] = GAMES;
    expect(sudoku.persistKey).toBe(sudokuSpec.urlCodec.key);
    expect(sudoku.persistKey).toBe("sudoku-board-state");
  });

  it("drops a sixth game in with ZERO edits outside the table (id is a loose string)", () => {
    const DemoPoster = defineComponent({ name: "DemoPoster", render: () => null });
    // The drop-in claim is about the TABLE: a sixth game is one row here, satisfying the same
    // card shape as the five, and no edit anywhere else. The spec behind `mount` is the
    // sixth game's own module — stood in for by a real one, because what is under test is
    // that the row type demands nothing a new game cannot supply. A drop-in takes the LAZY
    // shape, which is every row but the one that ships in the main chunk.
    const demoCard: GameCard = {
      id: "demo",
      name: "demo",
      range: { label: "size", levels: ["3×3"] },
      // T4-P1 F4: a drop-in also declares what the picker stages for it — its OWN selector
      // options, the same two axes every shell carries — and where its board lives on disk
      // (the staging ledger's cold-start backfill reads it through this key).
      staging: {
        size: { label: "size", options: [{ value: 3, label: "3×3" }], default: 3 },
        difficulty: {
          label: "level",
          options: [{ value: "EASY", label: "Easy" }],
          default: "EASY",
        },
      },
      persistKey: "demo-board-v1",
      poster: () => Promise.resolve(DemoPoster),
      mount: () => Promise.resolve(sudokuSpec),
    };
    const withDemo: GameCard[] = [...GAMES, demoCard];
    expect(withDemo).toHaveLength(GAMES.length + 1); // the five landed games + the drop-in
  });
});
