# PROPOSED DIFF — `check-ink-pressure.mjs` gains its seventh surface (and learns to discover)

Not applied. Research lanes are read-only on product files; this is the patch a synthesizer
hands the cure, written out so pass 2 argues with code. Line numbers are HEAD at 2026-09-18.

## Part A — the row (what the charter asks, minimum shape)

`SHIP4` (`scripts/check-ink-pressure.mjs:399-443`) is a five-row list; closure 3 owns surface 5;
the self-test at `:732-737` asserts the census still covers **6**. Adding a row means touching
three places in one diff, or the gate self-tests red:

```diff
@@ scripts/check-ink-pressure.mjs  const SHIP4 = [ … ]
   {
     n: 6,
     file: "pencil/chrome/CompletionVignette.vue",
     selector: ".vignette-meta",
     decl: "color",
     token: "--ink-press-quiet",
     was: "62% — 4.34:1 light, the second site the W10 sweep missed",
   },
+  {
+    // T9-W7 §7 — the ledger's aged line (and, under NOTE-ERASE, the settled note): the
+    // SEVENTH consumer of the quiet rung, born outside a census that enumerates six.
+    n: 7,
+    file: "pencil/chrome/MarginNote.vue",
+    selector: ".margin-note-previous",
+    decl: "color",
+    token: "--ink-press-quiet",
+    was: "born on the rung — 5.18:1 light / 6.14:1 dark over --color-background",
+  },
 ];
@@ selfTest()
-  const covered = new Set([...SHIP4.map((s) => s.n), 5]);
-  if (covered.size !== 6)
+  const covered = new Set([...SHIP4.map((s) => s.n), 5]);
+  if (covered.size !== 7)
     mute.push(
-      `ship-4 census covers ${covered.size} of the 6 re-pitched surfaces (…) — a row was dropped`,
+      `pressure census covers ${covered.size} of the 7 pinned surfaces (…) — a row was dropped`,
     );
@@ the printed census (:802-813)
-  `\nship-4 census — the six re-pitched surfaces, each pinned to the rung above …`,
+  `\npressure census — the seven pinned surfaces, each pinned to the rung above …`,
```

The row is BORN-RED against the pass-1 build only if the rule is missing; it is born GREEN
against the prototype (which writes `color: var(--ink-press-quiet)` at
`MarginNote.vue` `.margin-note-previous`). Its negative control already exists and works: the
self-test at `:685` re-runs `gateShip4` with every selector suffixed `-gone` and requires a
failure, so row 7 inherits a real negative control the day it lands.

## Part B — the DISCOVERY row (the W8 QUALITY LAW candidate, §6.10 of registry v1)

The census is blind by construction, and the size of the blindness is measurable. At HEAD:

| rung | `var(--…)` consumer SITES in `src/` | named by the census |
|---|---|---|
| `--ink-press-quiet` | **12** | 3 (`.keyboard-legend`, `.margin-note-meta`, `.vignette-meta`) |
| `--ink-press-rule` | **4** | 2 (`.legend-row kbd`, `.legend-sep` as an absence) |
| total | **16** | 5 rows + closure 3 |

(Sites: `DifficultyTally.vue:311`; `GameControlPanel.vue:1617, 1748, 1785, 1799, 2332, 2411`
and `:1546, 1865, 2327`; `scene.css:363, 387`; `KeyboardLegend.vue:68, 104`;
`CompletionVignette.vue:125`; `MarginNote.vue:178`. The ledger's line two makes 17.)

So "the seventh consumer" understates it: the gate names 5 of 16 and cannot see the other 11.
The discovery shape that keeps the doctrine (each surface pinned to a rung, never a number)
without the hand-written list:

```js
/** Every rule body in `src/` that writes a pressure rung, discovered rather than enumerated.
 *  The census then asserts a PROPERTY of the set — no open-coded percentage of the graphite
 *  ramp anywhere, and every discovered site's declaration names a rung — instead of asserting
 *  a list that a new surface silently escapes. */
function discoverPressureSites(src) {
  return sources(src).flatMap(({ file, text }) =>
    [...text.matchAll(/([^{}]+)\{([^}]*var\(--ink-press-(?:quiet|rule)\)[^}]*)\}/g)].map(
      (m) => ({ file, selector: m[1].trim().split("\n").pop().trim(), body: m[2] }),
    ),
  );
}
```

with two assertions: (1) the discovered set is a SUPERSET of the pinned rows (a pinned row that
vanishes is still a red), and (2) `discoverPressureSites(SRC).length >= 16` at HEAD, so a
consumer deleted by accident is visible too. The count is the gate's own tripwire and it is
re-derived, not typed.

## Note on the r0 row

No r0 instrument reads `.margin-note-previous`; nothing under `loop/r0/` moves for this. The
subject that moved is the estate's own gate, so the proposal lives here as a diff.
