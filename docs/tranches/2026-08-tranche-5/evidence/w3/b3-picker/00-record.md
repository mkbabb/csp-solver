# T5-W3 lane B3 — row 3.3, THE PICKER PUBLISHES FIVE

Tip `78448760`. Charter `waves/T5-W3-a11y.md` row 3.3; sources `evidence/audit/r1/a11y.md` H3,
`r2/verify-gate-criticals.md` §H3.

## The defect, and where it actually was

`GameCard.vue` put `:inert` on the `role="option"` ROOT for every non-centered card. `inert`
strips a node and its whole subtree from the accessibility tree, so the deck's four flanks left
it entirely: Chrome published a **one-item listbox** — `["sudoku, 1 of 5"]` — against five cards
that had correct names and correct `aria-selected` the whole time. Nothing could read them. A
screen-reader user could not know four other puzzles existed.

## The cure — one attribute, one node down

`:inert` moved from the option root to `.game-card-deal`, the wrapper holding every interactive
internal. The root stays live and named; the internals stay inert, which is what actually bought
the property the placement was defended by (no invisible tab stops, no hit targets in a flank).
The pointer half is carried by `onCardClick`'s own `isActive && !guard` guard, which predates
this change and is now gated by three unit rows rather than trusted.

Semantics only. No class, no style, no node added or removed; no CSS in the app selects
`[inert]` (grep-verified), and no golden frames the gallery. **π: no pixel should move.**

Carousel behaviour (`useCarouselGlide`, the snap, the chime, the deal, the live-face teleport) is
byte-untouched.

## Evidence

| file | what |
|---|---|
| `01-units-born-red.txt` | the battery RED at HEAD — 3 gate rows red, 4 control rows green |
| `02-probe-3.3-green.txt` | `a11y.spec.ts` 3.3, **2/2 chromium + webkit** (born-red at `probes/03`) |
| `03-units-green.txt` | the same seven rows, **7/7**, no assertion weakened |
| `04-ax-tree-live.txt` | live CDP + DOM, both engines: 5 named options, `strippedBy: null` ×5, `tabbables: 0` on every flank |
| `05-collision-gallery-spec.md` | the one out-of-fence casualty + its patch + the measured blast radius |
| `06-blast-radius.txt` | serial webkit run: 11 passed, 3 failed, all three the `inert`-on-root rows |
| `ax-probe.mjs` | the standalone probe, for re-derivation |

Full unit suite after the cure: **37 files / 413 tests, all green**. `prettier --check`, `eslint`
and `vue-tsc --noEmit` clean on both touched files. `permalink` / `futoshiki` /
`mobile-affordances` / `gallery-deal` / `board-covisibility` all green.

## The one thing the lead must land

`e2e/gallery.spec.ts` :39, :67, :156 assert `inert` on the option root — the defect itself. They
are outside this lane's fence and were not touched. Retarget to `#gallery-card-N .game-card-deal`
(table in `05`). No formulation keeps them green: `#gallery-card-{i}` IS the option node, so any
`inert` on it or above it re-eats the card.
