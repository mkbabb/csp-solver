# R6 law 39 — reported MOVED (ACC-GRAPHITE's direct subject)

r0 is frozen. This is the report the chair's §6.7 asks for ("Law 39: STANDS; ACC-GRAPHITE
reports against it in its return — unreported is a gap").

**The law as written** (`r0/r6-idiom-history/R6-census.md:125`):

> 39. **Focus rings are non-negotiable and visible** — the estate's forms are `2px dashed
> currentColor` offset 3 (the tab), `2px solid color-mix(foreground 45%)` offset 4 (the ribbon's
> face), and the board's drawn `--color-focus-sketch` ring at stroke-width 7 / opacity 0.9 drawn
> on over 180ms.

**What this family moves, and what it does not.** Three of the law's four terms about the board's
ring change; its subject and its intent do not.

| term | HEAD, measured this pass | under this family | still true? |
|---|---|---|---|
| visible, non-negotiable | yes | yes | ✓ the law's point |
| drawn on over 180 ms | `ghost-draw-on 180ms` | unchanged | ✓ |
| the token it names | `--color-focus-sketch` `#3a7bc4`, live and painted (`rgb(58, 123, 196)`, both engines, both themes) | `--color-pencil-graphite` | **MOVED** |
| stroke-width 7 | computed `7px` in the GHOST viewBox = **3.425 px** desk / **1.966 px** phone | 12 + 12 at inset 10 = a 22-unit band = **10.764 px** desk / **6.178 px** phone | **MOVED** |
| opacity 0.9 | computed `stroke-opacity: 0.9` | 1.0 | **MOVED** |

**Proposed wording** (the chair's to take or refuse):

> 39. **Focus rings are non-negotiable and visible** — the estate's forms are `2px dashed
> currentColor` offset 3 (the tab), `2px solid color-mix(foreground 45%)` offset 4 (the ribbon's
> face), and the board's drawn ring, `--color-pencil-graphite` pressed twice (12 + 12 units at
> inset 10, a 22-unit band) at opacity 1, drawn on over 180 ms. The ring's units are the CELL's
> viewBox (144.444), never the board's (1000) — see law 39a.

**Law 39a, proposed as a NEW row** (the defect this pass found, twice-bitten inside one family):

> 39a. **A stroke width is meaningless without its viewBox.** The board's rules are declared in
> the 1000-unit board viewBox (0.636 px/unit at 1280, 0.365 at 393 dpr3); the per-cell ghost ring
> is declared in the cell's own 144.444-unit viewBox (0.48927 / 0.28082). Converting a ring width
> with the board's scale over-reports it by 1.30x. Measured at HEAD `74a2b5d9`, both engines,
> both rigs (`readings/denominators-*.json`).
