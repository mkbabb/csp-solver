# T2-W5 lane S2 — wordmark hardening (H3 · H4 · I2)

**Scope.** `web/frontend/src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue` only — the wordmark is pencil-shared chrome (one copy serves both games; no D16 twin to diff). Executed per the Q8-final slate (`evidence/pass3/Q8-hardening-slate-coherence.md`: H3/H4 "as authored", I2 as promoted) on a Fable design lane; the `frontend-design` plugin skill was loaded and invoked before the work.

## What landed

### H3 — vbWidth special-case dead + caret optical-center

- Both `=== 'sudoku'` branches deleted (`estimateWidth` carve-out returning 220; `measure()`'s pin-back ternary). Every label now measures via `getBBox` to ink + a uniform 4-unit trail; estimate floor drops 220→120 (the measure floor). Measured: sudoku's box tightens **220 → 205** units; ink→caret gap **13.9 px (sudoku) vs 14.1 px (futoshiki)** at desktop, 11.2 vs 11.3 at 375 — the 41.9-vs-14.4 asymmetry is gone.
- Caret optical-center: the wordmark is lowercase on a 60-unit box, baseline y=48 — the x-height band (the ink mass the eye centers on) sits ~4.5 units below the box middle, so the flex-centered caret floated high. New `--caret-nudge: calc(var(--logo-height) * 0.075)` composes `translateY` ahead of the existing rotate on `.logo-caret` (+ its `.is-open` arm). Landed caret centerY 118.9 px vs the computed x-height band center 119.8 px at desktop (90.7 vs ~91.2 mobile) — on the band, judged by eye against screenshots at both sizes.

### H4 — ladder-bind (closes L25-49)

- `:223` `font-family` → `var(--font-display)` — resolves byte-identically (Fraunces + serif fallbacks; the register whose subset covers the wordmark repertoire, per index.css).
- `:268` → `var(--font-hand)` (byte-identical: Patrick Hand, cursive).
- `:269` `1.4rem` → `var(--type-subheading)` (1.272rem, √φ) and `:319` `1.55rem` → `var(--type-heading)` (1.618rem, φ) — the two nearest true rungs, preserving the one-rung ≥640px step. Rendered: 20.35 px mobile / 25.89 px desktop (confirmed computed).
- The 3 height literals (4.452/5.724/6.996rem) hoisted to one `--logo-height` custom property re-pinned per breakpoint — values unchanged (already golden), now single-sourced and feeding the caret nudge. This is the L25-49 "3 logo-height literals" closure.
- **`:225` `font-size: 52px` deliberately left off-token (documented in-file):** it's viewBox geometry — user units inside the fixed 60-unit box (baseline y=48). A rem rung couples glyph metrics to root font-size (clips at non-16px browser defaults); a display-clamp rung couples them to viewport width inside a viewport-independent viewBox. The wordmark's *type size* is its rendered height, which is the golden `--logo-height`. This is the lane's one deviation from a literal reading of "225 in the bind list" — fidelity ruling under the lane's design authority.

### I2 — no reveal replay on game swap

`watch(() => props.game)` no longer calls `playReveal()` — it re-seeds the estimate and re-measures only. The 1.2 s clip-path wipe stays a mount-only beat (comment updated); PRM behavior unchanged (`isDrawn` still seeds from `reducedMotion`).

## Proof (2026-07-10, Vite dev :3000, Playwright chromium, box shared with W3 cargo load — all checks count/state-based, no timing claims)

Harness: `w5-s2-shots/shoot-s2.mjs` — **14/14** across desktop (1280×900) + mobile (375×800):

| Check | Result |
|---|---|
| sudoku viewBox measured, not pinned | `0 0 205 60` (both viewports) |
| ink→caret gap uniform across labels | 13.9 vs 14.1 px desktop · 11.2 vs 11.3 px mobile |
| caret on the ink mass, below box center | caretCY 118.9 / svgCY 110.5 / band ≈119.8 (desktop) |
| wordmark family = display token | Fraunces, Georgia, Cambria, TNR, serif |
| menu item = hand token + rung | 25.888 px / 20.352 px, "Patrick Hand" |
| swap→futoshiki, no re-reveal | `is-drawn` never dropped; clip-path pinned `inset(0px 0% 0px 0px)` through 1.5 s sampling |
| swap→sudoku (listbox driven a 2nd time) | same — zero draw-in replays in 4 swaps total |

`vue-tsc -b` clean · `npm run build` clean · `eslint .` clean. Screenshots (my own eyes, both sizes, menu open + closed): `w5-s2-shots/s2-*.png` — caret sits on the lowercase body at one gap for both labels; menu underlines/highlight idiom untouched.

## Notes for sibling lanes / gates

- **Mobile lane (44 px floors):** the subheading snap shortens the base menu item ~2 px (the verify-33 "36.2 px" figure re-measures ≈33.8) — the floor fix is padding/min-height either way; the cited baseline just moved.
- **SSIM soul-gate (H4):** expected deltas are confined to the two menu font sizes and the sudoku box tightening (wordmark ink itself renders identically — same face, same 52-unit geometry, same heights).
- Prettier was NOT run on the file: the tree is prettier-dirty (67 files, no config committed), and prettier's template reflow injects whitespace into the SVG `<text>` node (bbox-shifting). Edits match the file's committed style; `npm run lint:eslint` is the enforced gate and passes.
