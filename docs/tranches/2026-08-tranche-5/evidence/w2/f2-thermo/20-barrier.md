# T5-W2 F2 — THE BARRIER ITEMS, AND WHY THIS LANE DID NOT LAND THEM

**Raised by** the thermo lane, 2026-08-01 · **owner** the team lead, at the F2/F3 barrier ·
**scope** shared, identical for all four clued games — which is precisely why the F2 charter
froze the surface and why a lane must raise these rather than each patch them.

Two defects sit in F1's shared surface. Neither is thermo's, neither is fixable inside
`src/games/thermo/`, and both are load-bearing: **until they land, no migrated row mounts.**
F1 set the precedent for this exact move (its own README §3 raised the conflict seam rather
than pre-solving it, "flagging early because the table fixes at open").

---

## 1 · `App.sceneFor`'s lazy arm still resolves a `scene`

`App.vue:84` reads `loader: card.scene!`. At F1 that was honest — the four unmigrated rows
carried `scene`. As of this barrier **all five rows carry `load`**, so the non-null assertion
resolves `undefined` for every lazy game and `defineAsyncComponent` has nothing to load.
`preloadScenes` (`App.vue:211`) already reads `(card.scene ?? card.load)!()` and is fine; the
mount arm is the one that was never generalised.

App.vue's own comment states the cure. It is one expression:

```diff
--- a/web/frontend/src/App.vue
+++ b/web/frontend/src/App.vue
@@
-        // F1 INTERIM: the four unmigrated rows still load their own scene component. Each
-        // F2 lane swaps its row to `load` (a spec) and this loader becomes
-        // `async () => shellFor(await card.load())` — one arm, five games.
-        loader: card.scene!,
+        // One arm, five games: a row hands the shell its spec and `GameShell` does the rest.
+        loader: async () => shellFor(await card.load!()),
```

With every row migrated, `CardMount`'s second arm and `CardFace.scene` die with it — that is
F4's collapse, and `cards.test.ts:45` ("exactly one mount") is what reads it.

---

## 2 · The clue never reaches `BoardHost` — `ClueSeam` has no member that says where it lives

`BoardHost.vue:34-37` declares

```ts
  /** The live clue value the board prints — required exactly when `spec.clues` is non-null,
   *  and handed straight back to the seam that declared it. */
  clue?: unknown;
```

and `BoardHost.vue:140` spends it: `props.spec.clues.props(props.clue, boardSize.value)`.
**`GameShell` never binds `:clue`.** Sudoku is `clues: null`, so F1 shipped green over a seam
that had never carried a value. Every clued game — thermo's `thermometers`, futoshiki's
`inequalities`, killer's and kenken's `cages` — hits it at once: `props(undefined, dim)`, and
the overlay mounts with a required prop absent.

The missing thing is not the binding alone. `ClueSeam` as fixed at open is
`{ overlay, props, encode, decode }`, and **none of those four can name the model field the
live clue lives on**. A generic shell cannot guess `thermometers` vs `inequalities` vs `cages`.
So the seam needs its own accessor, and this lane declines to smuggle one in as an excess
property (it would not compile) or route the clue around the declared seam through
provide/inject (a second path for a fact that has one — the dual-path the wave's laws forbid).

**AMENDMENT REQUEST to the fixed table (§1.2 `ClueSeam`), named cause, dated 2026-08-01:** a
fifth member, `from`, the seam's own read off the model. Cause: the clue is a LIVE model value,
the shell instantiates the model, and the seam is the only place that knows which field it is.
Without it the slot is declared and unreadable — the reconciliation's own rule (§1.3: "a slot
the shell doesn't read is deleted from the type") applied in reverse.

```diff
--- a/web/frontend/src/games/shared/defineGame.ts
+++ b/web/frontend/src/games/shared/defineGame.ts
@@
-interface ClueSeam<TClue> {
+interface ClueSeam<TModel, TClue> {
+  /** The LIVE clue, read off the model the shell instantiated. The seam owns this because
+   *  it is the only place that knows the field's name — `thermometers` / `inequalities` /
+   *  `cages` — and a shell that had to know would be five branches wearing one name. */
+  from: (model: TModel) => TClue;
   overlay: Component;
   props: (clue: TClue, dim: number) => Record<string, unknown>;
   encode: (clue: TClue) => Uint32Array;
   decode: (buf: Uint32Array, dim: number) => TClue;
 }
@@ export interface GameSpec<TModel, TClue> {
-  clues: ClueSeam<TClue> | null;
+  clues: ClueSeam<TModel, TClue> | null;
```

```diff
--- a/web/frontend/src/games/shared/GameShell.vue
+++ b/web/frontend/src/games/shared/GameShell.vue
@@
+// SLOT READ — `clues.from`. The live clue the board prints, read off the model this shell
+// just instantiated. `null` is a game's STATED absence and binds nothing.
+const clue = computed(() => props.spec.clues?.from(model));
@@
       <BoardHost
         ref="boardHost"
         :spec="spec"
         :model="model"
+        :clue="clue"
         :leaving="props.leaving"
```

Each migrated spec then adds ONE line to its `clues` literal:

| game | line |
|---|---|
| thermo | `from: (m) => m.thermometers.value,` |
| futoshiki | `from: (m) => m.inequalities.value,` |
| killer | `from: (m) => m.cages.value,` |
| kenken | `from: (m) => m.cages.value,` |

The census gains a ninth read expression per clued game, and `clues` stops being the one slot
in the union whose value is declared but never consumed.

---

## 3 · What this lane did instead

`thermoSpec.clues` is written to the table **as fixed at open** — four members, `props` taking
the clue it is handed — so the amendment above is purely additive at every call site. The seam
is proved in isolation rather than through the unbound shell: `spec.test.ts` asserts
`clues.encode === encodeThermometers` (identity, not a duplicated round-trip), that
`clues.props(thermos, 9)` is exactly `{ thermometers, boardSize }`, and that mounting
`clues.overlay` **with the seam's own output** renders one `g.thermo-tube` per thermometer on
the `svg.thermo-tube-overlay` `BoardHost` slots. That is the whole seam except the one binding
this lane may not write, and it is green.
