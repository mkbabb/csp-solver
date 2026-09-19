# PROPOSED instrument diff · r0/R2 accent-family census — TWO authorship rows MOVED

Proposed, not applied. `loop/r0/` is frozen; this is the diff a pass-3 lane carries with its
return so the chair can dispose. Subject: `r0/r2-accent-family/probe/hue-census.probe.ts:127-128`
and the four `r0/r2-accent-family/census/census-{chromium,webkit}-{light,dark}.json` rows that
pin the same two selectors.

## The rows, as r0 wrote them

```ts
{ job: "authorship", site: "roster name",   selector: ".player-row .player-name", prop: "color" },
{ job: "authorship", site: "roster swatch", selector: ".player-swatch",           prop: "background-color" },
```

## Why both moved

`GameControlPanel.vue` at HEAD `74a2b5d9` draws the peer's ink in two places inside the well:
`:1148` the row carries `:style="p.ink"` and `:1664-1676` `.player-row { color: var(--color-user-ink) }`, and `:1689-1695` `.player-swatch` paints a 0.7rem disc in the same
value. The §11 design moves BOTH: the roster keeps its `role="log"` office and loses every
pixel, so `.player-swatch` has no element and `.player-name` has no ink — the row's inline
rebinding and the `.player-row` colour rule are deleted together. Only the swatch was reported
MOVED in pass 2 (`pass2/critique/PLR-PLACE.md §6`, `registry-v2.md §6.9`); the name row is
unreported by any lane.

The ink did not disappear — it moved to where it is now drawn, and it is drawn at one origin:
the seating chart's row swatch IS the chart's dot.

## The proposed re-point

```diff
-  { job: "authorship", site: "roster name",   selector: ".player-row .player-name", prop: "color" },
-  { job: "authorship", site: "roster swatch", selector: ".player-swatch",           prop: "background-color" },
+  // T9-W7 §11 — the roster keeps its office and loses its pixels; the peer's ink is drawn in
+  // the head's sheet, where the row swatch and the chart's dot are one element.
+  { job: "authorship", site: "lobby row name",   selector: "[data-lobby] .pl-name",          prop: "color" },
+  { job: "authorship", site: "lobby row swatch", selector: "[data-lobby] .pl-swatch circle",  prop: "fill" },
```

Both readings require the sheet OPEN (a real press on `[data-player-mark]`, then the settle),
which the r0 probe's scene does not do — so the re-point carries a one-line scene change in the
same diff, or the two rows read `null` and the census silently loses a job.

## The report line

`R2 — 2 rows MOVED` (not 1), diff proposed here, never applied to `r0/`. The hue census
(`r0/r6-idiom-history/hue-census.mjs`) is UNMOVED: this family mints no chromatic token, and
pass 2's copied-and-re-pointed run was byte-identical to `hue-census-HEAD.txt`.

---

# The one measurement that closes the lap law (recipe, for the prototype lane)

One `page.evaluate` on an already-open sheet, in a DECLARED regime, both engines, no new server:

```js
const sheet = [...document.querySelectorAll("[data-lobby]")]
  .find(el => el.getBoundingClientRect().height > 0);           // the head mounts two
const cs = getComputedStyle(sheet), ul = sheet.querySelector(".lobby-rows");
JSON.stringify({
  regime: { coarse: matchMedia("(pointer: coarse)").matches,
            tall:   matchMedia("(min-height: 800px)").matches },
  type:   { small: getComputedStyle(document.documentElement).getPropertyValue("--type-small"),
            tag:   getComputedStyle(document.documentElement).getPropertyValue("--type-tag"),
            smallPx: getComputedStyle(sheet.querySelector(".pl-name")).fontSize },
  sheetH: sheet.getBoundingClientRect().height,
  pad: cs.paddingTop, border: cs.borderTopWidth, colGap: cs.rowGap,
  state:  sheet.querySelector(".lobby-state").getBoundingClientRect().height,
  chart:  sheet.querySelector(".place-chart")?.getBoundingClientRect().height ?? 0,
  ulGap:  getComputedStyle(ul).rowGap,
  rows:   [...ul.children].map(r => ({ more: r.classList.contains("pl-more"),
                                       h: +r.getBoundingClientRect().height.toFixed(2) })),
});
```

The law is closed when `sheetH` equals `2·border + 2·pad + state + 2·colGap + chart + Σrows +
ulGap·(n−1)` to ≤0.05 px and the two row kinds read 24.00 / 22.39 at coarse and 22.39 / 22.39 at
fine. The sheet SLIDES: settle ~700 ms after the press before any of this is read.
