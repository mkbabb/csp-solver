# T3-W9 gate — the gold move, certified

Gate lane (Fable), 2026-07-10. Repo at ed439104 + the W9 working tree (no commit — wave rule).
Probes ran against the DEV server on :3000 (Chromium via Playwright); harness banked beside this
file as `w9-gate-probes.mjs`. A CONCURRENT wave (T3-W6) runs cargo-heavy work on this machine —
wall-clock timings herein are load-confounded and none are load-bearing.

**Verdict: ALL NINE GATES GREEN.** 14/14 live probes, 34/34 e2e, contrast ledger recomputed AA-clean,
`#wobble-heart` byte-identical, the F8 grammar checklist holds on every touched surface.

## The gate table

| Gate | Verdict | Evidence |
|---|---|---|
| token truthing | **PASS** | `--color-gold-star: var(--color-crayon-gold)` (light `#C99A2E`, dark `#E5C74D`). The pre-existing `.solve-success` stroke/shadow rules are UNMODIFIED in the diff — the re-ink rode the alias alone (the only `.solve-success` addition is the separately-mandated PRM guard, see PRM gate). Live computed success shadow: `color(srgb 0.788235 0.603922 0.180392 / 0.25)` = #C99A2E at 25% — gold, `shadowGreen=false`. Verdict line computes `rgb(140, 105, 29)` = #8C691D gold-ink. Green absent from the success register; EASY keeps its crayon. |
| contrast | **PASS** | Recomputed (WCAG 2.x, live tokens at HEAD): gold-ink #8C691D **4.85:1** bg / **4.97:1** card (light); red-ink #D02A52 **4.87 / 4.99**; dark gold #E5C74D **11.48 / 11.23**; dark rose #FF5C7C **6.44 / 6.30**. UI-10 solver inks light **5.17–6.21:1** (≥4.5 body-text AA at any size), dark pastels **10.14–15.35:1**. Full ledger below. |
| collision | **PASS** | probe5 reconstructed (no banked a23-harness): star box vs status-TEXT box (DOM Range over the ink span), both regimes. Row: star `[182.3,785.8 52×52]`, text `[242.3,784.8 86.6×25.0]` — disjoint (8px slot gap). Stacked: star `[68.0,793.0 52×52]`, text `[128.0,792.0 80.4×23.0]` — disjoint. Heart `[786.7,749.0 44×44]` / `[704.4,756.2 44×44]` clear of text and meta in both. One grid composition (`auto 1fr`), star slot and voice on one row. |
| twins | **PASS** | `grep -rn "statLine\|stat-line" web/frontend/src/` → zero code hits (comments/doc references only). Both boards' computed + `.stat-line` CSS deleted; `formatSolveTally` (games/shared/solveTally.ts) → MarginNote `meta` is the sole home. |
| heart | **PASS** | Crests board bottom-right (diagonal opposite of the voice). Dark-mode ROSY: `html.dark=true`, host `opacity=1 filter=none`, body fill `#FF4D6D`, stem+leaf present, blush deepened via color-mix — `heart-crest-dark{,-zoom}.png` (plush + stitch + Heart-Fruit stem, nothing maroon). Murmur exactly 1-in-8: `Math.floor(rng()*8)===0`, gate draw consumed unconditionally (celebration.ts). Budget at settle AND post-solve settle: `chains=1 subs=10 (frame=10, sequence=0)` — at the envelope, both regimes. `#wobble-heart` preset block byte-identical HEAD↔worktree (`diff` = empty); all bounce/squash/blink transforms on the host wrapper / interior eyes group, never the filtered `<g>`. |
| PRM | **PASS** | New `@media (prefers-reduced-motion: reduce)` block gates `.solve-success` + `.solve-success .grid-line` to `transition: none` — computed `transitionProperty=none` for both under emulated PRM. Heart mounts static `matrix(1,0,0,1,0,0)`, note ink + meta `animationName=none`, star mounted without draw-on race. Driven, not assumed: `prm-solved-instant.png` (gold frame landed instantly, heart seated). All 81 glyphs DOM-present ≤200ms post-success under PRM. |
| star-form | **PASS** (confirmation — ratified round 2) | The inline glyph IS in the note line: `.margin-note .note-star` 20.0×20.0px (row) / 18.6×18.6px (stacked), the sticker's own STAR_D at half scale, foil pair #FDE68A/#F0B030, seated on the baseline, wiping in with the note's own 250ms clip-path. `star-form-inline-{row,stacked}.png`: ★ solved it! / 0 backtracks — 1ms. |
| grammar | **PASS** | F8 checklist over every touched surface, computed at runtime: masthead, washi, laminate, difficulty chips, tally — zero gold hits in BOTH states (`gilded=[]`). Tally graphite at ink-level 62% `color(srgb 0.15 0.15 0.15 / 0.62)` in success AND failure (metadata never inherits tone; meta present on failed — honest refutation effort). Failure state driven: verdict `rgb(208, 42, 82)` = red-ink #D02A52, no sticker slot, no note-star, no heart, no solve-success — `failure-red-graphite-zero-gold.png` (red frame, graphite tally, the only gold on the page is the sun — which is sky, where gold lives). Board content ink untouched: user digits blue, solver digits #solver-ink board-only (the chrome sparkle keeps #sparkle-rainbow). No gold difficulty tier exists. |
| e2e | **PASS** | **34 passed** (0 failed, full suite, ~19s). Two specs asserted the OLD truth and were updated per the wave's own provision: `affordances.spec.ts` "stat-line" test → `.margin-note-meta` completion-block DOM (cited T3-W9 §2 in-file); `sudoku-interaction.spec.ts` test 4 → solved cells `url(#solver-ink)` not `url(#sparkle-rainbow)` (cited UI-10 in-file). First run pre-update: 32 passed / 1 failed (the sparkle assert) / 1 skipped (deal-dependent row-blank skip; passed on re-run). |

## Contrast ledger (recomputed, not assumed)

WCAG 2.x over literal hexes; papers from index.css at merged HEAD:
light bg `hsl(48 15% 98%)`, light card `hsl(48 12% 99%)`, dark bg `hsl(24 8% 6%)`, dark card `hsl(24 6% 7%)`.

| token / hex | theme | vs background | vs card | bar |
|---|---|---|---|---|
| gold-ink #8C691D (verdict text) | light | 4.85:1 | 4.97:1 | ≥4.5 ✓ |
| red-ink #D02A52 (verdict/error text) | light | 4.87:1 | 4.99:1 | ≥4.5 ✓ |
| crayon-gold #C99A2E (wax, non-text) | light | 2.47:1 | 2.53:1 | non-text |
| gold ink=wax #E5C74D | dark | 11.48:1 | 11.23:1 | ≥4.5 ✓ |
| red ink=rose #FF5C7C | dark | 6.44:1 | 6.30:1 | ≥4.5 ✓ |
| solver-ink 1–5 (light) | light | 5.17–6.06:1 | 5.29–6.21:1 | ≥4.5 ✓ |
| solver-ink 1–5 (dark pastels) | dark | 10.36–15.35:1 | 10.14–15.02:1 | ≥4.5 ✓ |
| old green wax #2DC653 (retired verdict) | light | 2.16:1 | 2.22:1 | the bug F8 found |
| old rose wax #E8315B (retired verdict) | light | 4.01:1 | 4.11:1 | the near-miss, fixed |

## Probe log (verbatim, 14/14)

```
PASS | probe5 collision (row) | star=[x=182.3 y=785.8 w=52.0 h=52.0] heart=[x=786.7 y=749.0 w=44.0 h=44.0] statusText=[x=242.3 y=784.8 w=86.6 h=25.0] meta=[x=242.3 y=806.3 w=106.4 h=18.3]
PASS | star-form inline glyph (row) | note-star 20.0x20.0px in the verdict line
PASS | subscriber budget (row) | settle floor: chains=1 subs=10 (frame=10, sequence=0); post-solve settled floor: chains=1 subs=10 (frame=10, sequence=0)
PASS | grammar: nothing gilded (row) | gilded=[] verdict=rgb(140, 105, 29) tally=color(srgb 0.15 0.15 0.15 / 0.62) shadowGreen=false
PASS | token truthing: verdict inks gold-ink (row) | verdict color=rgb(140, 105, 29); success shadow="color(srgb 0.788235 0.603922 0.180392 / 0.25) 8px 5px 0px 0px, ..."
PASS | probe5 collision (stacked) | star=[x=68.0 y=793.0 w=52.0 h=52.0] heart=[x=704.4 y=756.2 w=44.0 h=44.0] statusText=[x=128.0 y=792.0 w=80.4 h=23.0] meta=[x=128.0 y=811.7 w=98.8 h=17.0]
PASS | star-form inline glyph (stacked) | note-star 18.6x18.6px in the verdict line
PASS | subscriber budget (stacked) | settle floor: chains=1 subs=10 (frame=10, sequence=0); post-solve settled floor: chains=1 subs=10 (frame=10, sequence=0)
PASS | grammar: nothing gilded (stacked) | gilded=[] verdict=rgb(140, 105, 29) tally=color(srgb 0.15 0.15 0.15 / 0.62) shadowGreen=false
PASS | token truthing: verdict inks gold-ink (stacked) | verdict color=rgb(140, 105, 29)
PASS | heart: dark-mode ROSY (celebration exempt from dimming) | html.dark=true opacity=1 filter=none bodyFill=#FF4D6D stem+leaf=true blush=color(srgb 0.925882 0.489216 0.606275) transform=matrix(1, 0, 0, 1, 0, 0)
PASS | PRM: success transitions instant + heart/note static | board transition=none grid-line=none heart transform=matrix(1, 0, 0, 1, 0, 0) ink anim=none meta anim=none star mounted=true
PASS | failure grammar: red verdict, graphite tally, zero gold | verdict=rgb(208, 42, 82) tally=color(srgb 0.15 0.15 0.15 / 0.62) starSlotVisible=false noteStar=false heart=false solveSuccess=false gilded=[]
PASS | green in EASY only: EASY chip register | BUTTON:color=rgb(10, 10, 10);bg=rgba(0, 0, 0, 0);border=rgb(230, 230, 228)
```

Probe-harness notes (the three iterations that mattered): (1) probe5's "status text box" is
the Range over the ink span — the `.margin-note` element spans the full 1fr column, so an
element-box test false-collides with the heart's corner straddle 550px away from any ink;
(2) the subscriber envelope is the settled floor (the gate's own words: "at settle + post-solve") —
mid-flight solve reveal runs ~80 transient one-shot sequences by design and settles back to
exactly 10; (3) the grammar sweep exempts the DarkModeToggle's celestial svg — the sun IS gold
because gold lives in the sky. Nothing else on either page carries a gold computed value.

## Design-authority read (F8 checklist, the earn-test)

Looked at, not just measured (`probe5-solved-row-light.png`, `failure-red-graphite-zero-gold.png`,
`heart-crest-dark-zoom.png`): the solved page reads as ONE statement — the frame and margin turn
gold, the written ink never recolors, the verdict opens with the demoted star, the tally sits
subordinate in graphite, and the felt heart (plush silhouette, stitch dash, stem+leaf tell) crests
the opposite corner in the sticker register. The failed page is the same composition with the gold
simply absent — red frame, red verdict, graphite tally, and the sun still holding the only gold on
the page, exactly the fiction: the work wasn't finished, so the light stayed in the sky. The
solver-ink deepening reads as pressed crayon, not a new palette — board-content only. Earned: yes,
every surface.

## Spec updates (e2e gate provision)

- `web/frontend/e2e/affordances.spec.ts` — "stat-line" test renamed to the tally; selectors
  `.stat-line` → `.margin-note-meta` (T3-W9 §2 cited in-file). Same lifecycle assertions.
- `web/frontend/e2e/sudoku-interaction.spec.ts` — test 4 asserts `url(#solver-ink)` for
  solver-filled digits (UI-10 cited in-file); given-ink assertion untouched.

## git status --short, fully classified

**T3-W9 (this wave — implementation lane):** `web/frontend/src/assets/index.css`,
`games/{sudoku,futoshiki}/…/{SudokuBoard,FutoshikiBoard,SolverErrorNote}.vue`,
`pencil/chrome/{MarginNote,CelebrationStar,SvgFilters}.vue`,
`pencil/chrome/AttributionCard/CrayonHeart.vue`, `pencil/composables/celebration.ts`,
`pencil/config/pencilConfig.ts`, `pencil/glyph/HandwrittenGlyph.vue` (all M);
new: `games/shared/solveTally.ts`, `pencil/chrome/CelebrationHeart.vue`,
`pencil/chrome/AttributionCard/heartPaths.ts`, evidence `t3-w9-g3/`, `w9-proofs/`.

**T3-W9 (this wave — gate lane, this session):** `web/frontend/e2e/affordances.spec.ts` (M),
`web/frontend/e2e/sudoku-interaction.spec.ts` (M), evidence `T3-W9-gate/` (new).

**Cross-wave T3-W6 (cargo-heavy, NOT this wave):** `.github/workflows/ci.yml`,
`csp-solver/Cargo.toml`, `csp-solver/benches/sudoku.rs`, `csp-solver/examples/gac_ab_corpus.rs`,
`csp-solver/src/solver/gac/{matching,mod,scratch}.rs` (all M); new:
`csp-solver/benches/{futoshiki,gac_ab}.rs`, `csp-solver/tests/{futoshiki_engine_probe,gac_alldiff_oracle}.rs`.

## Artifacts in this directory

- `probe5-solved-{row,stacked}-light.png` — the solved composition, both regimes
- `star-form-inline-{row,stacked}.png` — the completion block closeup (sticker slot + inline ★ + tally)
- `heart-crest-dark.png`, `heart-crest-dark-zoom.png` — the rosy reward at crest, dark
- `prm-solved-instant.png` — PRM drive: gold landed instantly, everything static
- `failure-red-graphite-zero-gold.png` — the failure register, ungilded
- `w9-gate-probes.mjs` — the reconstruction harness (probe5 + all live gates)
- `gate-report.md` — this file
