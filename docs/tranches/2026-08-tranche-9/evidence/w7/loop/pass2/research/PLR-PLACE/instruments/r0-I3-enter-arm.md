# PROPOSED INSTRUMENT DIFF · r0 I3 gains an Enter arm

**r0 row reported MOVED.** `r0/r5-player-mark/instruments.spec.ts` is frozen (chair §7); this is
the diff proposed against it, never applied there. Same for the family's G6, which presses with
the mouse for the same reason.

## Why the subject moved

I3 presses the mark with `mark.first().click()` and nothing else
(`r0/r5-player-mark/instruments.spec.ts:88`). A reader presses it with Enter too, and the idiom the
family copied — `@click.stop="toggle"` beside `@keydown.enter.stop="toggle"`,
`AttributionCard.vue:48-49` — makes a button toggle **twice** on Enter, because `click` is Enter's
default action on a `<button>`.

Measured this pass on HEAD's own `AttributionCard`, both engines (`logs/r2-*.json`, arm A4): with
the card already open (a fine pointer's `focusin` opened it), Enter leaves it open,
`aria-expanded="true"`; Space then closes it. **The double toggle is real and the incumbent masks
it** — it lands on an already-open card. `PlayerSign` deliberately has no hover-open, so under it
the mask is gone and Enter opens nothing at all (pass-1 critique §2.3, `k1.enter.lobbyCount 0`,
both engines).

A mouse-only instrument cannot see this. The arm below is what makes the gate press the way a
reader does.

## The diff

```diff
--- a/evidence/w7/loop/r0/r5-player-mark/instruments.spec.ts
+++ b/<the wave's copy>
@@ test("I3 — the top-left carries a player mark that opens a lobby")
   await mark.first().click();
   await expect(
     a.getByRole("dialog").or(a.locator("[data-lobby]")),
     "pressing it opens the lobby",
   ).toBeVisible();
+
+  // THE ENTER ARM (T9-W7 pass 2, PLR-PLACE). A button fires `click` as Enter's default action,
+  // so a mark carrying BOTH @click and @keydown.enter toggles twice and opens nothing. The
+  // mouse arm above cannot see it. Measured on the incumbent AttributionCard, both engines:
+  // the defect is there too and is masked only by that card's focus-open.
+  await a.keyboard.press("Escape");
+  await expect(a.locator("[data-lobby]")).toBeHidden();
+  await mark.first().focus();
+  await a.keyboard.press("Enter");
+  await expect(
+    a.getByRole("dialog").or(a.locator("[data-lobby]")),
+    "ENTER opens the lobby — one activation, not two",
+  ).toBeVisible();
+  expect(await mark.first().getAttribute("aria-expanded")).toBe("true");
+  await a.keyboard.press("Enter");
+  await expect(
+    a.locator("[data-lobby]"),
+    "and a second Enter closes it — the toggle is symmetric",
+  ).toBeHidden();
   await ctx.close();
 });
```

## The coupling the arm must survive

§0 of this lane's research proposes `@pointerdown.prevent` on the sign, so a **mouse**-opened sheet
leaves focus in the grid. The Enter arm above focuses the mark explicitly before pressing, so it is
unaffected — but the `Escape` on its first line is only reachable if Escape is bound on the
**window** (`GameGallery.vue:696-721`'s one-owner idiom) rather than on the sheet. If the family
binds Escape on the sheet instead, this arm's first line must become an outside click, and the gate
should say why.

## Status

PROPOSED. Not applied to `r0/`. The r0 row for I3 is reported **MOVED** in this lane's return.
