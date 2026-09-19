# ACC-FIVE pass 2 — instruments PROPOSED as diffs (r0 rows reported MOVED)

The record is frozen (chair §7). Nothing here is applied to `loop/r0/` or `loop/pass1/`. Each
file below is a proposal; the r0 row it moves is named, and the reason is a measurement.

| proposal | r0 instrument | r0 row reported | why |
|---|---|---|---|
| `hue-census.roster.diff` | `r0/r6-idiom-history/hue-census.mjs` | MOVED | two defects, both created by this family's own token move and one pre-existing |
| `consumers.roster.diff` | pass-1 `prototype/ACC-FIVE/probe/consumers.mjs` (itself an r0 descendant) | MOVED | fixed roster; cannot see a token minted after it was written |
| `handoff-ablate.layered.diff` | pass-1 `critique/ACC-FIVE/probe/handoff-ablate.mjs` | **MOVED — the banked arm no-opped** | the injected ablation is unlayered and loses to the win rule; measured |

## 1. `hue-census.mjs` — three lines, two defects

Measured on the pass-1 worktree (`.claude/worktrees/wf_e58b4764-0fc-42`):

- `--color-blue-ink` is not in `TOKENS` (`hue-census.mjs:52-70`), so the hex the family mints
  is invisible to the census that exists to name every chromatic token.
- `read()` matches `--token: #hex` only, so `--color-user-ink: var(--color-blue-ink)` returns
  null and the pen's LIGHT row silently disappears from the table.
- `const dark = src.slice(darkAt)` runs to EOF, so it swallows the `@media print` arm
  (`index.css:1008`, `--color-user-ink: #000`) and prints `--color-user-ink,dark,#000` — a dark
  row that is the print arm wearing the dark arm's name. This defect is PRE-EXISTING (it fires
  at HEAD for any token redeclared under print) and only becomes visible once the dark arm is
  an alias.

Proposed, minimal:

```diff
@@ hue-census.mjs
-const darkAt = src.indexOf("\n.dark");
-const light = src.slice(0, darkAt);
-const dark = src.slice(darkAt);
+const darkAt = src.indexOf("\n.dark");
+// The dark BLOCK, not "everything after it": the @media print arm below redeclares
+// --color-user-ink as #000 and a slice-to-EOF reads the print arm as the dark arm.
+const darkEnd = src.indexOf("\n}", darkAt);
+const light = src.slice(0, darkAt);
+const dark = src.slice(darkAt, darkEnd);

 const TOKENS = [
+  "--color-blue-ink",
   "--color-user-ink",

@@ function read(block, token)
-  const m = new RegExp(`${token}:\\s*(#[0-9a-fA-F]{3,8})`).exec(block);
-  return m ? m[1] : null;
+  const m = new RegExp(`${token}:\\s*(#[0-9a-fA-F]{3,8}|var\\(--[a-z-]+\\))`).exec(block);
+  if (!m) return null;
+  // ONE level of alias, resolved in the same block: a token whose arm is another token's
+  // name is still a colour, and a hex scanner that cannot follow it reports an estate that
+  // no longer exists.
+  const v = m[1];
+  return v.startsWith("var(") ? read(block, v.slice(4, -1)) : v;
```

The recursion terminates because the estate's aliases are one deep by the T5-W2 2.3 ruling;
a two-deep alias would recurse once more and then return null on the missing hex.

## 2. `consumers.mjs` — one roster line, and an `OUT` that does not point into the record

`probe/consumers.mjs:36` is a fixed `TOKENS` object and `:23-26` defaults `OUT` to an ABSOLUTE
pass-1 path. Any lane that runs it without setting `ACC_FIVE_OUT` writes into the frozen
record.

```diff
@@ consumers.mjs
 const OUT =
   process.env.ACC_FIVE_OUT ??
-  ".../evidence/w7/loop/pass1/research/ACC-FIVE/readings/control";
+  (() => {
+    throw new Error("set ACC_FIVE_OUT — this probe must never default into a frozen record");
+  })();

 const TOKENS = {
+  "--color-blue-ink": { job: "the pen's INK TIER — the constant crayon-blue is darkened to" },
   "--color-user-ink": { job: "authorship (yours + every peer's, rebound per cell)" },
```

## 3. `handoff-ablate.mjs` — the ablation that did not ablate

`critique/ACC-FIVE/probe/handoff-ablate.mjs:30`:

```js
const ABLATE = `.solve-success .progress-trace { stroke: var(--color-progress-ink) !important; }`;
```

`page.addStyleTag` injects this UNLAYERED. The rule it must defeat lives in `@layer utilities`
(`index.css:557` opens the layer, `:662` is the rule) and is itself `!important`. For important
declarations cascade-layer order INVERTS and unlayered counts as the LAST layer — so the
unlayered important is the WEAKEST of the two and the injection is a no-op. The banked readings
say so: in `handoff-ablate.json` every `*ablated` arm reports the same post-win stroke and the
same `medianL` as its `live` twin, in all four engine x theme cells. The critique's §1 table
reports ablated post-win values (`rgb(164,121,3)`, L 0.588 / 0.540) that appear nowhere in its
own readings — they are the `before` row.

```diff
-const ABLATE = `.solve-success .progress-trace { stroke: var(--color-progress-ink) !important; }`;
+// LAYERED, and that is the whole of it: for !important declarations layer order inverts and
+// unlayered is the last layer, so an unlayered !important LOSES to the win rule's
+// `@layer utilities` one. `base` is declared before `utilities` (index.css:99), so an
+// important declaration added to `base` wins. Measured both ways: research/ACC-FIVE/
+// readings/cascade-ablate.json.
+const ABLATE = `@layer base { .solve-success .progress-trace { stroke: var(--color-progress-ink) !important; } }`;
```

`probe/cascade-ablate.mjs` beside this file is the re-cut, with both arms kept so the trap
stays visible rather than being quietly fixed.
