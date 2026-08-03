# W1 — THE THEME MISMATCH (CRITICAL)

KenKen's cage clues are the puzzle, so the mismatch quadrants make the board unplayable — the
highest-severity row the audit measured. It is the estate's own lesson in miniature: a ruling
written without its enforcing config landing in the same commit.

## The defect

When the OS `prefers-color-scheme` disagrees with the in-app sun/moon toggle, the cage
furniture of killer and kenken, the thermo tubes, and the matching gallery poster cards
render in the **opposite theme's ink** — measured **1.13–1.36:1** against their ground
(matched quadrants: 1.98–4.94:1; WCAG floor 4.5:1 text / 3:1 non-text). KenKen has no given
digits — its cage clues *are* the puzzle — so the board is unplayable in the mismatch
quadrants. Reproduced in the built dist, both mismatch directions, with a real toggle click
(the ink does not move when the class does).

## Root cause

`CageOverlay.vue:180` and `ThermoTube.vue:127` are the only two files in `src` that key a
dark palette off `@media (prefers-color-scheme: dark)`, and their sibling blocks
(`CageOverlay.vue:189-200`, `ThermoTube.vue:136-147`) key off `:root[data-theme="light"]`
/ `:root[data-theme="dark"]`. But `useTheme.ts` writes `class="dark"` on `<html>` — **nothing
in the estate ever writes `data-theme`** (`grep -rn data-theme src/` → 8 hits, all CSS
selectors, zero writers). The `data-theme` blocks are dead selectors that nonetheless ship
in the built CSS. They read as an attempted cure whose enforcing writer was never landed.

The everything-else-is-fine scope is verified both ways: every other surface is `.dark`-class
keyed and tracks correctly in all four quadrants. The blast radius is exactly killer + kenken
cages, thermo tubes, and their three poster components (`KenKenPoster.vue`, `KillerPoster.vue`,
`ThermoPoster.vue` mount the same shared `CageOverlay`/`ThermoTube`).

## The cure

Rewrite both style blocks to the attribute the app actually sets — `:root.dark` for the dark
palette, the unprefixed rule for light — dropping the `@media (prefers-color-scheme)` and the
`:root[data-theme]` selectors entirely. The posters inherit the fix through the shared
components; verify the card art in all four quadrants.

## The gate that should have shipped with the original ruling

### Gate 1.1 — never-written-selector census (born RED)
A script over `src/**/*.{vue,css}` that collects every `:root[data-theme=…]` and
`prefers-color-scheme` selector and asserts either that a runtime writer for the attribute
exists (`setAttribute('data-theme'` or a media-query consumer the app honors) **or** the
selector is on an allowlist with a reason. Born RED: it flags the `CageOverlay`/`ThermoTube`
`data-theme` blocks at `afc72ba1`; green after the cure removes them. This is the census the
estate's "ruling lands with its enforcing config" lesson demanded and never got — knip
resolves modules, not selectors, so no gate in the estate reads this surface today.

### Gate 1.2 — four-quadrant ink IDENTITY, not an absolute floor (born RED)
A Playwright row in the built-dist config over killer/kenken cage label+boundary and thermo
tube+bulb, all four OS×app quadrants, on the built dist. **The assertion is identity, not a
contrast floor:** the computed `fill`/`stroke` in (OS=light, app=dark) must equal
(OS=dark, app=dark), and likewise for the light pair. Theme ink is a function of the app's
class alone, so identity is exactly true and greenable. A second arm asserts a real toggle
*click* (not seeded storage) moves the ink, not just the class. Born RED: at HEAD the ink is
byte-identical across the class flip (`rgba(52,56,64,0.72)` before and after), so identity
fails; green after the cure. Runs both engines, including `?view=gallery` for the three
poster cards (2.4 scope). **Why not an absolute floor:** a WCAG 3:1 gate would red the
*matched* quadrants too — the matched light cage boundary measures 2.62:1 and the matched
dark thermo tube 1.98:1 by design (cage boundaries are deliberately faint). The matched
thinness is a separate owner row (below); it does not get cured silently under the mismatch
fix and does not make this gate un-greenable. The two audits measured different mismatch
bands (1.13–1.36 vs 1.32–1.84) because they composite over the card background differently —
neither band is banked; identity sidesteps the disagreement entirely.

The contrast resolver used anywhere in this wave must handle Chromium's `color(srgb …)`
return for `color-mix` (the audit's instrument note — an `rgba?\(` regex silently skips
exactly the rung it watches).

## The matched-quadrant thinness (separate owner row)

The cage boundary (matched light 2.62:1) and the thermo tube (matched dark 1.98:1) are faint
by design and sit under the WCAG 3:1 non-text floor even when the theme is correct. This is a
real legibility question but a distinct one — curing it is a palette decision, not a theme-key
fix, and it must not ride Gate 1.2. **OWNER**; default = leave the faint furniture as shipped.

## Acceptance

All four quadrants ink-identical for killer, kenken, thermo, and their posters; the two style
blocks class-keyed; Gate 1.1 green (no unwritten-attribute selectors ship); Gate 1.2 green
both engines including the poster cards; no `prefers-color-scheme` or `data-theme` survives in
the built CSS except an allowlisted, reasoned entry. The matched-quadrant thinness carries as
an owner row, uncured by this wave.
