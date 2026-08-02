# `filterBudget.ts` placement — the recorded verdict (2.3's obligation)

2.3 requires a **recorded** decision, not a relocation. Here it is, with the data re-derived on
the exit tree.

## The data

`src/pencil/config/filterBudget.ts`, 298 lines. Its **only import** in the whole repo:

```
e2e/filter-census.spec.ts:13   } from "../src/pencil/config/filterBudget";
```

Four other files NAME it, in prose only, as the record they are measured against:

```
src/pencil/config/pencilConfig.ts:242    "…enforced against the built dist by **pencil/config/filterBudget.ts**"
src/pencil/chrome/SvgFilters.test.ts:38  "…(2 + 2 of the budget's 14), so the two facts agree"
src/pencil/glyph/HandwrittenGlyph.vue:58 "…`pencil/config/filterBudget.ts`."
e2e/visual-regression.spec.ts:221        "…record is `src/pencil/config/filterBudget.ts`, enforced by `e2e/filter-census.spec.ts`"
```

So: an app-tree module with zero app-tree importers and one e2e importer.

## The verdict — DEFER, and the deferral IS the decision

Three reasons, in the order they carry weight:

1. **It is a statement about the source, and it belongs beside the source.** `filterBudget.ts`
   declares what filter population the app is allowed to render; `e2e/filter-census.spec.ts`
   *enforces* that declaration against the built dist. Moving the declaration into `e2e/` inverts
   the relationship — the design would then live in the test suite, and the four `src/` files
   that cite it as the record would be citing across into a test tree. The "app-orphan" reading
   counts importers; the honest reading counts what the module IS. A budget with one enforcer is
   not an orphan.

2. **It ships nothing.** `npm run test:prod-shake` passes on the exit tree — 22 chunks under
   `dist-throttle`, dev-only symbols absent — and `filterBudget` appears in no production chunk.
   The cost of the placement is zero bytes, so the argument for moving it is aesthetic, and 2.3
   is not an aesthetics row.

3. **A live cure owns its prose.** The design loop's lane D holds the filter-budget prose
   mid-cure (design-loop D-M2, the pre-settle 21). Relocating the module now would collide a
   mechanical move with an in-flight editorial one, and the merge would be paid twice. The wave's
   own sequencing rule — a ruling lands with its enforcing config, same commit — argues for
   moving it only when whoever owns its text moves it.

**Decision: the placement stands. Re-visit after design-loop pass 5**, when lane D's prose
settles, and only then — and if it moves, it moves with its four citations in one act.

## The one thing this does NOT decide

Whether `filterBudget.ts` should be *smaller*. 298 lines to state a 14-row budget is a separate
question with a separate owner, and this row deliberately does not smuggle it in.
