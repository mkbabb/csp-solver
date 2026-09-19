# r0 I3 — MOVED (proposed diff, T9-W7 PLR-PLACE pass 2)

The r0 row is NOT re-cut in place (the record is frozen). This is the diff the row takes when
this family lands, with the reason each half moves, and the reading of the moved row against the
pass-2 prototype.

Subject: `evidence/w7/loop/r0/r5-player-mark/instruments.spec.ts:71-94`
(`I3 — the top-left carries a player mark that opens a lobby`).

## Why it moves

Two things the design changed reach this row.

1. **The sheet's box is MOUNTED now.** Pass 1 mounted `PlayerLobby` behind `v-if`, so
   `[data-lobby]` was 0 nodes shut and 1 open, and `toBeVisible()` on the bare locator was
   unambiguous. Pass 2 keeps the pose box mounted so it can actually fade (the `.hover-card`
   rule verbatim; a `v-if` box cannot transition) and puts the CHART behind the `v-if` instead,
   which is what the `v-if` was for. `[data-lobby]` is therefore **2 nodes at every moment** —
   the head mounts a desktop `AttributionCard` and a mobile one — and Playwright's strict mode
   fails an assertion against a 2-element locator. The row must say `:visible`, which is what it
   always meant.

2. **The row never tried the keyboard.** `@pointerdown.prevent` is the seam this family turns
   on, and the one thing a reader could reasonably fear from it is that it breaks activation.
   It does not — a keyboard activation never goes through `pointerdown` — but a row that only
   ever clicks cannot say so. The Enter arm is one `focus()` + one `press("Enter")`.

## The diff

```diff
@@ instruments.spec.ts:71
   const mark = a.getByRole("button", { name: /player|lobby|who.s (here|on this board)/i });
   console.log(`R5-I3|candidates=${await mark.count()}`);
   await expect(mark, "a player mark lives in the head").toHaveCount(1);
   const box = await mark.first().boundingBox();
   expect(box!.x, "it is in the LEFT of the head").toBeLessThan(200);
   expect(box!.y, "it is in the head, not the card").toBeLessThan(120);
+  // The pose box is MOUNTED so it can fade, at both widths, so the subject is the VISIBLE one.
+  const lobby = a.locator("[data-lobby]:visible");
+  await expect(lobby, "shut, no lobby is visible").toHaveCount(0);
   await mark.first().click();
-  await expect(
-    a.getByRole("dialog").or(a.locator("[data-lobby]")),
-    "pressing it opens the lobby",
-  ).toBeVisible();
+  await expect(lobby, "a press opens the lobby").toHaveCount(1);
+
+  // THE ENTER ARM. The mark suppresses the default on `pointerdown` so a mouse press never
+  // moves focus off the board; a keyboard activation never went through `pointerdown` at all,
+  // and this is the row that says so.
+  await a.keyboard.press("Escape");
+  await expect(lobby).toHaveCount(0);
+  await mark.first().focus();
+  await a.keyboard.press("Enter");
+  await expect(lobby, "Enter opens it too, exactly once").toHaveCount(1);
+  expect(await mark.first().getAttribute("aria-expanded")).toBe("true");
   await ctx.close();
```

## The reading against the pass-2 prototype

| arm | chromium | webkit |
|---|---|---|
| `[data-lobby]` nodes mounted | 2 | 2 |
| `[data-lobby]:visible` before the press | 0 | 0 |
| candidates named `/player/` in the head's left corner | 1 · `(75.5, 12, 53.1, 47.8)` · `no other players` | 1 · same |
| `[data-lobby]:visible` after a REAL press | 1 | 1 |
| Enter after `focus()` opens it | yes, `aria-expanded="true"` | yes, `aria-expanded="true"` |
| Escape closes a mouse-opened sheet | yes | yes |
| Space toggles (open then close) | 1 → 0 | 1 → 0 |

At HEAD both halves are RED: there is no head mark at all, so the count row fails before the
Enter arm is reached.

## r0 rows this family reports MOVED

| row | disposition |
|---|---|
| I3 | **MOVED** — the diff above; the subject gained a mounted twin and a keyboard route |
| I2 | **RED by ruling** (spec §0) — not this lane's to cure |
| I4 / I5 | unmoved; run bare, unchanged |
| R6 family-law probe | unmoved; run bare, unchanged |
| R6 hue census | unmoved — **29 rows byte-identical** to `r0/r6-idiom-history/hue-census-HEAD.txt`; this family mints no chromatic token |

## The re-point that rides with it (§6.8 / the chair's §7)

`.player-swatch` leaves with the roster's pixels, so the three instruments that read it are
re-pointed in the SAME diff, at the element that now carries the ink:

| instrument | was | now |
|---|---|---|
| `e2e/join-language.spec.ts:175` | `.controls-card .player-row .player-swatch` → `backgroundColor` | `[data-lobby] .pl-row .pl-swatch circle` → `fill`, sheet opened by a real press |
| `e2e/multiplayer.spec.ts:193` | `roster(a).locator(".player-swatch")` | `lobbySwatchInks(a)` — the same N-distinct-inks assertion, at the lobby row |
| `e2e/multiplayer.spec.ts:580` | same, at N=4 | same helper |

The assertions are unchanged. What moved is where the ink is drawn.
