# R3-d, and the r0 row that MOVED — proposed diff, not applied

`r0/r3-marks/probe/marks.probe.ts` R3-d ("THE HINT NOTE — what retracts it, and what does
not") is the one r0 instrument whose SUBJECT this family moves. The r0 file is frozen: it was
copied to `instruments/r0-copies/marks.probe.ts`, run unmodified against this build (its `OUT`
is relative to its own file, so the copy re-points itself), and its output banked to
`logs/r0-rerun/hintnote-chromium.json`. Nothing under `loop/r0/` was written.

## The readings did not move. The MECHANISM did.

All ten acts read identically to r0 (`logs/r0-rerun/` vs `r0/r3-marks/logs/`):

| act | r0 | this build |
|---|---|---|
| wait 30 s | stands | stands |
| arrow to another cell | stands | stands |
| **type a digit** | **`""`** | **`""`** |
| undo (Meta+z) | stands | stands |
| toggle dark mode | stands | stands |
| press P (pencil mode) | stands | stands |
| hold K (engine peek) | stands | stands |
| blur the board | stands | stands |
| scroll the page | stands | stands |
| open the gallery (Escape) | stands | stands |

R3-g's five board-changing acts are identical too (`""` / `""` / `the board is clear` / `""` /
`solved it!`).

So the census cannot tell the two builds apart, and that is precisely the row it is missing.
At r0 the third act empties the line because the MODEL nulled `hint` and W1 §1.2's falsy arm
retracted whatever the hint had written — for ANY digit, anywhere, including a peer's. Here it
empties because the digit landed ON THE REFERENT, and a digit elsewhere leaves the line
standing (`logs/A1-strike-depth1-*.json`: chromium wrote 5 into cell 76 with the hint armed on
cell 6 and `only 2 fits here` stood; webkit wrote into cell 80 against a referent of cell 1 and
`only 4 fits here` stood).

R3-d walks nine acts and none of them is "a digit somewhere else", so it grades the cure and
the disease the same.

## The proposed row (for §6's leader to land, or for pass 3)

Two acts added after "type a digit", using the reasoning the note already carries in the DOM:

```diff
@@ r3-marks/probe/marks.probe.ts  R3-d, after the `type a digit` act
+    // T9-W7 §7 — the two acts that separate "the model nulled the hint" from "the sentence
+    // lost its referent". The because-cells are in the DOM while the hint is armed, so the
+    // probe can aim without knowing the puzzle.
+    {
+      act: "type a digit in a cell the note does NOT name",
+      run: async (page) => {
+        const away = await page.evaluate(() => {
+          const inputs = [...document.querySelectorAll(".board-cells input")];
+          const because = new Set(
+            inputs.flatMap((el, i) =>
+              (el.closest(".game-cell") ?? el.parentElement)?.querySelector(".cell-because")
+                ? [i]
+                : [],
+            ),
+          );
+          return inputs.findIndex(
+            (el, i) => !because.has(i) && !el.value && !el.readOnly && !el.disabled,
+          );
+        });
+        await writeDigit(page, away, "5");
+      },
+      expect: "stands",
+    },
+    {
+      act: "type a digit IN a cell the note names",
+      run: async (page) => writeDigit(page, await firstBecause(page), "6"),
+      expect: "empty",
+    },
```

Born-RED against r0's build on the first of the two (it empties there and must stand), green
against this one. The r0 row is reported **MOVED**; the r0 file is not re-cut and no gate is
re-worded.

## The rows that did NOT move

| instrument | r0 | this build |
|---|---|---|
| `wobble.probe.ts` R3-a | grid σ 1.443 · frame σ 1.145 · ring σ 0.092 · `ringInBand: false` | **identical, to the third decimal** |
| `budget.probe.ts` R3-h | 9 / 9 / 9 at 4×4, 9×9, 16×16 | **9 / 9 / 9** |
| `marks.probe.ts` R3-b | RED (the focus-ring census) | RED, unchanged — §6's row per CHAIR-RULINGS §6.1; this family writes no ring |
| `marks2.probe.ts` R3-g | five acts | five acts, identical |

R3-a's red and R3-b's red are both pre-existing and both belong to §6. This family draws
nothing, mints no token and moves no filter, so the π rows are the control they were meant to
be and they held.
