# G-FAVICON: the adversarial critic's read (T9-M22, "the favicon s, which is a bit too thick and needs to reflect our design language more")

Critic: Opus, not the designer and not the prototyper. Subject: worktree `.claude/worktrees/wf_b6676cd9-8c6-17`
off main `1d0dc4fd`, nine product files (icon.svg +496 B, favicon.svg −, apple-touch-icon.png +2,473 B,
index.html two links, check-favicon.mjs, icons.mjs, package.json, ci.yml, .gitignore). U-10 applies: this
file retires nothing, and the owner disposes at the re-look.

**Verdict: ADVANCE at 60, earned and no higher.** The "too thick" half is answered, and I re-measured it:
ink 0.52 → 0.23, both engines, every cell. The engineering reproduces exactly: the dist diff, the estate, and
the painted numbers down to the thousandth. Four things hold the number down:
- **The CI gate can't fail on the mark's own axis.** A CSS `stroke-width:9px` passes it. So does faint ink
  set by a later CSS rule (the A.5.3 class), and so does a solid-red touch icon. 8/8 escapes read GREEN.
- **The design's identity claim is refuted in paint.** "The digits' pen at the digit's line (0.156)" came
  from a source ratio. The board's given digits paint at stroke/H **0.103–0.115**, and the icon paints at
  0.167, 1.5× the digits' relative weight. The window [0.15, 0.17] traces to nothing the page paints as a
  line. That moves B-FAV-2's framing.
- **The "design language" half isn't answered.** A smooth, symmetric monoline S on a flat square is the
  generic default: the letter tile a browser draws when a site has no icon. None of the house hand's marks
  are in the geometry: no flat top stroke or angular join like the 5's, no wobble like the grid's, no grain.
- **Two G-TAB-2 rows are RED as written.** G1 is a contradiction inside the spec. On G2 the firing default
  loses to the control in chromium light (0.375 against 0.289), and LAWS P5 requires that loss to be named.

## 0 · What I ran (independent, not the prototype's instrument)

- **Fresh build** of the prototype tree into `<scratchpad>/crit-gfav/dist-crit` (vite 4.74 s). `diff -rq`
  against the lane's `dist-base` (the control): only `index.html` (the two link lines), `+icon.svg`,
  `+apple-touch-icon.png` and `−favicon.svg` differ, and every `assets/` file is byte-identical. My dist ==
  the prototype's `dist-proto`. **π holds by construction**: no product byte moved except the head.
- **G-TAB-4 re-read** on `vite preview`: lane on 4257 (npx 47269, listener 47419), control `dist-base` on
  4258 (npx 47270, listener 47423). Both were killed by PID and both ports read free.

  | path | lane | control |
  |---|---|---|
  | `/icon.svg` | 200 `image/svg+xml` 496 B | 200 `text/html` (fallback) |
  | `/apple-touch-icon.png` | 200 `image/png` 2,473 B | 200 `text/html` |
  | `/favicon.svg` | 200 `text/html` | 200 `image/svg+xml` 1,961 B |

  This reproduces. G3 stands: the 404 is the edge's (`_redirects` `/* /404.html 404`), not the preview's.
- **Painted, independent** (`critique/G-FAVICON/crit-shoot.mjs` + `crit-an.py`): `<img>` of the served
  `/icon.svg` and the control's `/favicon.svg`, chromium and webkit, DPR 1/2, 16/32 px, `colorScheme`
  light/dark on each scheme's two strips, two bare photographs per cell. Δ between photographs was 0 in all
  128. My statistic code is my own, with the same definitions as the census. At 16 DPR1 (`painted-16dpr1.txt`):

  | reading, W | chromium | webkit | prototype's claim |
  |---|---|---|---|
  | coverage | 0.225 dark / 0.226 light | 0.229 / 0.230 | 0.225–0.230 ✓ |
  | centre-column apertures | [3, 3] | [3, 3] | [3, 3] ✓ (at the floor) |
  | tile | (17,15,14) / (251,250,249) | same | ✓ |
  | tile on strip | #fff 1.04 · #dee1e6 1.26 · #202124 1.19 · **#35363a 1.58** | same | ✓ (G1 RED) |
  | core median | light 17.90 · dark 14.83 | light 18.25 · dark 15.18 | ✓ |
  | frac < 4.5 (count) | light **0.375 (33)** · dark 0.326 (28) | light 0.360 (31) · dark 0.337 (29) | ✓ (G2 RED) |
  | main, frac < 4.5 light | 0.289 (50) | (tile sample hits WebKit's blur, not compared) | 0.289 ✓ |

  Every W number the prototype printed reproduces to the thousandth.
- **The page's paper, painted** (`crit-paper.mjs`): the lane and control apps, 1280×800 fine and
  390×844 `hasTouch` coarse (`pointer: coarse` read true), both engines, both schemes, PRM reduce.
  - The body's computed background and ink equal the icon's literals exactly: (251,250,249)/(10,10,10)
    light and (17,15,14)/(237,236,233) dark, lane = control, all 16 loads.
  - First load follows the OS (`html.dark` true under dark), so the OS-vs-page mismatch opens only after a
    toggle.
  - **But the desk's DOMINANT painted colour is (253,253,252) light and (19,18,17) dark**, about 50 % of
    pixels. The phone's is (251,250,249) and (17,15,14). Clause c binds the token, not what the desk paints
    (contrast 1.02, invisible; stated, not a gap).
- **The digits' line, painted** (the lane's 1280×800 chromium light frame, skeleton median over the
  ≥ 0.5-coverage ink, the census's statistic):

  | glyph | H px | stroke med px | stroke/H |
  |---|---|---|---|
  | given 5 r1c1 | 39 | 4.00 | 0.103 |
  | given 8 r1c8 | 42 | 4.47 | 0.106 |
  | given 9 r2c5 | 37 | 4.00 | 0.108 |
  | given 3 r2c1 | 39 | 4.47 | 0.115 |
  | given 5 r2c6 | 37 | 4.00 | 0.108 |
  | wordmark s | 51 | 8.71 (max 20.88) | 0.171 (max/med 2.40) |

  The source agrees with the paint. `glyphPaths.ts` "5"[0] spans y 8 → ~48 (a 40-unit centreline), so
  stroke 5 gives 5 / (40 + 5) = **0.111**. The census's "stroke 5 on a 32-unit ink height, 0.156 H"
  (census README:53–54, which the adjudication carries at lines 29, 51 and 80) has the wrong height.
- **Gate escapes** (`escape-plants.sh`, `escape-plants.txt`): eight planted trees. Each re-stamps the
  provenance sha as `icons.mjs` would, and `node scripts/check-favicon.mjs --root <plant>` reads each one.
  **8/8 GREEN.**
- **Static, re-run:**
  - `lint:favicon --self-test` on the tree: exit 0, 7/7 plants RED. `--root` main: exit 1, 26 failures.
  - `check-theme-tokens --self-test` 0, `check-copy-register` bare 0, `knip` 0.
  - prettier clean on the four files, eslint 0 on the two scripts.

## 1 · The gate can't fail where the mark lives (G-TAB-1, the only row that runs in CI)

Clause b reads the **presentation attribute** `stroke-width`, and clause c reads the **first** `path{stroke:…}`
rule. The painted value is the cascade's, and CSS beats presentation attributes. The escapes:

| plant | what it paints | gate |
|---|---|---|
| E1 `path{stroke-width:9px}` in `<style>` | the thick s again, **the owner's own defect** | GREEN |
| E2 a later `path{stroke:#e8e6e3}` | faint ink at ~1.2:1, **A.5.3's class** (the gate's P5 catches only the attribute form) | GREEN |
| E3 `<circle r=12 fill=#0a0a0a>` beside the path | a black disc; clause b counts `<path>` only | GREEN |
| E4 `path{visibility:hidden}` | an empty tile | GREEN |
| E5 any 180×180 PNG (solid red) | a red touch icon; e hashes the **SVG**, never the PNG | GREEN |
| E6 `<rect width=8 height=8>` | paper that doesn't cover | GREEN |
| E7 `viewBox="0 0 64 64"` | the ink painted at half size; d assumes 32 | GREEN |
| E8 `path{stroke-dasharray:1 6}` | a dotted s | GREEN |

Under A.5.3 ("existence is not visibility"), a drawn-thing gate carries a painted core-median row. G-TAB-2 is
that row, and it's local-only. So CI holds the icon's identity with a source reader that the obvious drift
(a CSS edit) walks straight past.

The cure is small and browserless:
- Forbid any property in `<style>` other than `fill` on `rect` and `stroke` on `path`. That's an allowlist
  parse of the style body, not a first-match regex.
- Forbid every element except `svg`, `style`, one `rect` and one `path`.
- Require the rect to be `0 0 32 32` and the viewBox to be `0 0 32 32`.
- Stamp the **PNG's** sha beside the SVG's, and gate both.
- Add plants E1, E2, E3 and E5 to the self-test.

`icons.mjs` rewriting its own source to carry the stamp is a smell. A sidecar or a constant in the gate is
the ordinary form.

## 2 · The identity claim is refuted in paint (spec-cites-itself)

The apotheosis, the ballots and the gate's clause d all call stroke/H ∈ [0.15, 0.17] "the digit's window" or
"the digits' pen at the digit's line". The board paints its digits at **0.103–0.115**, and the source's own
geometry gives 0.111. The window's only surviving anchor is the wordmark's skeleton **median** (0.164–0.183;
I read 0.171). That's the median of a Fraunces Black s whose spine is 2.4× its median (census spine 0.40), so
a contrast glyph's median gets compared to a monoline's constant width. The icon sits between the house's two
hands by construction, and matches neither:
- **The digits (0.11).** The icon is 1.5× heavier relative to height.
- **The wordmark.** Its spine is 0.40 and its ink 0.70 in-box. The icon's is 0.167 and 0.23.

Consequences:
- **B-FAV-2's cost line for arm B** ("0.208 OUTSIDE the digit's window") and **for arm A** ("inside the
  digit's window") both rest on the false 0.156. At the true 0.111, both arms are outside the digits' line.
  A is 1.5× the digits and B 1.8×. The ballot must be restated with the painted digit number. A stroke at
  the digits' true proportion in the 20×24 box is ~2.7 units, 1.33 px at 16, and that thin line would read
  grey at the tab. That's the real trade, and it's the owner's.
- **The ink went from 0.52 to 0.23**, less than half. "A bit too thick" read literally is nearer arm B
  (0.28–0.29). The ballot already names this, and the numbers now say the default is the larger departure.
  That's not a defect, but the ballot's text should say it.

## 3 · The design-language half: the generic default (unverified gestalt)

Crops c1, c3 and c4 at 48 and 180, set beside the live page (the lane's own 1280×800 frame: a grain-edged
Fraunces Black wordmark, handwritten digits with flat tops and angular joins, a wavy hand-ruled grid, paper):
- **The W cut is a smooth, symmetric, geometric monoline S.** Every segment is a cubic, with no straight run,
  no angular join, no overshoot and no wobble. "In glyphPaths' grammar" is true only of the command letters.
  The 5 it cites opens `M30,8 L12,8 L10,26`: a flat top stroke and a hard corner. The icon has neither.
- **At 180 (c3), the touch icon, the one size where the hand could show, it reads as a rounded-sans S on a
  flat square.** It's the tile a browser draws when a site ships no icon.
- **At 16 the hand can't show at all**, and W's legibility there is a real gain: apertures [3,3] against
  main's [2,2], and a clean 2 px line.

The house's own lawful technique for a hand without a filter is **wobble baked into the path geometry**
(boil's path-swap variants). A 32-unit path can carry a flat or slightly tilted top stroke, one hard join and
a ±0.3–0.6-unit irregularity that vanishes at 16 and reads at 48/180, with no filter and filterBudget
untouched.

Neither ballot arm carries "the wordmark's pencil", which is the marks file's own gloss:
- **W** is clean geometry.
- **P** is clean Fraunces without the wordmark's grain edge.

**The owner is shown no arm that tries.**

## 4 · The ballots are framed by gates built from the default arm

- **G-TAB-2's windows are W's own numbers.** stroke/H [0.15, 0.17] is 4/24 ± slack, and max/med ≤ 1.25 is a
  monoline's signature. So **arm P fails by construction**: a contrast serif has max/med ≥ 2 at any weight.
  The prototype's own sweep confirms it, with no wght satisfying both windows. Crop 4 prints "FAILS" beside
  P, and that steers a ballot the loop says is the owner's (CTRL-FACE's law "reads either way").
- **Lawful framing:** print P's numbers without the W-derived pass/fail, or scope those rows to the written
  arm and give P its own (ink mass, apertures, core median, the fraction under 4.5).
- **P was also built at wght 550**, picked on a librsvg proxy the engines refuted (painted 0.118–0.125).
  The pair is honestly matched on mass (0.228 vs 0.229). The ballot's text must say that's what it is.

## 5 · The two RED rows, and what the laws allow

- **G1, tile on strip ≤ 1.3, #35363a 1.58 (reproduced).** This is a **contradiction inside the spec**, not a
  prototype defect:
  - Clause c binds the paper byte-equal to the page token (17,15,14), luminance 0.005.
  - The row needs 0.016–0.035 to sit within 1.3 of both dark strips.
  - The adjudicator measured only #202124.

  It can't be cured without breaking c. A.1.1 ("nobody re-words a gate to pass") holds, so the chair picks
  one of two:
  - strike the row as mis-specified, with the reason printed; or
  - keep it RED and name the cost: a visible dark square on Chrome's dark active tab, which is still far
    better than main's cream square at 11.38.
- **G2, frac < 4.5 at 16 DPR1 chromium light, 0.375 > 0.36 (reproduced).** Beyond the threshold, **the
  firing default loses to the control on this statistic in this cell**: main reads 0.289 (a fringe rate,
  though the count falls 50 → 33).
  - LAWS P5 and A.6 require the loss named with both numbers in the ballot, and forbid re-wording the row.
    The prototype's "restate as the count" is a re-word.
  - The 4.5 rung was probed and refuted (webkit 0.378, apertures [2,3]). That's correct, and it leaves no
    lawful cure inside the brief.
  - WebKit light (0.360) sits on the edge, and both dark cells pass.

## 6 · Constraints checked

| constraint | reading |
|---|---|
| M16 plain copy | no UI copy touched; `check-copy-register` bare 0 ✓ |
| filterBudget 9 | the icon carries no filter; the product's assets are byte-identical ✓ |
| AA from painted bytes, both themes | core median 14.8–19.0 ✓; the fraction row is G2 |
| π | dist assets byte-identical, only the head moves ✓ (stronger than the census) |
| W2 mechanics, R6 curve, @property, PRM, M09 | untouched: no `src/` diff ✓ |
| legacy aliases | favicon.svg deleted, not aliased ✓; `/favicon.ico` still unshipped (same as main) |
| consumer-less substrate | `icons.mjs` has no CI consumer (NOT-A-LANE declared) ✓ declared |
| .gitignore | F1 negation correct and necessary ✓; the og-card comment ("the one committed public PNG") is now stale, and the three `!pwa-*.png` lines name no files |
| sharp | undeclared transitive (miniflare 0.35.4). The vendored-PNG recommendation holds only if §1's PNG-sha stamp lands, or E5 walks through |

## 7 · Strengths (earned)

- Every painted number reproduces **exactly** on an independent statistic, both engines. The in-run
  control reproduces the census.
- "Too thick" is answered where the owner saw it, at 16:
  - ink 0.52 → 0.23;
  - apertures [2,2] → [3,3];
  - WebKit's blur σ 0.35–1.0 → 0, because the dead feDisplacementMap made WebKit blur and Chromium no-op;
  - the webkit/chromium core Δ 0.89 → 0.35.
- **The paper follows the scheme.** Main paints cream under dark (11.38–15.19 on the dark strips), and W
  paints the page's own dark paper. Its tokens are proven equal to the painted body in 16/16 loads, desk
  and phone, both engines.
- **The smallest possible product diff**: no `src/`, assets byte-identical, the estate reads right locally,
  and F1 was found before it shipped a CI red.
- **Honesty.** Both RED rows are reported, the refuted rung is reported with its numbers, and the arm-B
  arithmetic is corrected (5/25, not 5/24).

## 8 · Pass-7 charter rows (TAB-PEN unless named)

1. **Harden G-TAB-1 against the cascade.**
   - Allowlist the `<style>` body (`rect{fill}` and `path{stroke}` only, inside and outside the dark
     `@media`).
   - Allow exactly the elements `svg, style, rect, path`, with the rect at `0 0 32 32` and the viewBox at
     `0 0 32 32`.
   - Stamp and gate the PNG's own sha beside the SVG's.
   - Add plants E1, E2, E3, E5, E7.
   - Closes at 8/8 escapes RED, the existing 7 plants still RED, clean GREEN.
2. **Restate the line's anchor with painted numbers.**
   - Strike "the digit's window 0.156" from the apotheosis, clause d's comment, and B-FAV-1 and B-FAV-2.
   - Print the digits' painted 0.103–0.115 and the wordmark's median 0.171 and spine 0.40 beside each other.
   - Re-derive the window as a tab-size legibility window, which is what it is. The census README:53–54 row
     is corrected at the fold.
3. **A hand arm that tries (B-FAV-1 grows arm H, or W is re-cut).**
   - The same box, pen and paper, with the 5's grammar actually borrowed: a flat or tilted top stroke with
     one hard join, and a baked irregularity of ±0.3–0.6 units in `d`.
   - No filter, ≤ 600 B.
   - Framed at 16/32/48/180 beside W, with G-TAB-2 printed.
   - The non-author reading of "generic letter tile" at 48 and 180 is the row's gate, on two photographs,
     both engines.
4. **Re-frame B-FAV-1's arm P fairly.** Drop the W-derived FAIL labels from crop 4, and give P its own rows
   (mass, apertures, core, fraction). Optionally add a P′ carrying the wordmark's grain edge baked into the
   outline, not a filter.
5. **B-FAV-2 restated.** A (0.167, mass 0.23) against B (0.20, 0.29), each against the digits' painted 0.11
   and main's 0.52. "A bit" is named as the owner's reading.
6. **G2 named, not re-worded.** B-FAV-2's text carries "at 16 DPR1 chromium light the default's sub-4.5
   fringe rate is 0.375 against main's 0.289 (the count 33 against 50)".
7. **G1 ruled by the chair**: strike it as a spec contradiction with c, or keep it RED with the cost named.
   It's not the lane's to re-word.
8. **The chair's .gitignore rows**: the og-card comment, and the three dead `!pwa-*.png` negations.

Unwitnessed and carried, all M19. Every painted number is headless `<img>`, not Chrome's favicon service,
Safari's icon database, iOS's web-clip mask, Android without a manifest, or Firefox tabs. These cells stay
rows until the owner's own re-look:
- the real tab-strip colours;
- whether Safari shows `icon.svg` or honours its in-SVG query;
- the librsvg PNG, which no engine photographed.

## 9 · Discipline

No commit, push, stash, deploy or install. No `rm`. No Safari or osascript. :3001 and 4230–4249 untouched.
Ports 4257/4258 were bound on 127.0.0.1 `--strictPort` and killed by PID (47269/47270 npx, 47419/47423
listeners), both read free. The one file I wrote into the worktree (`.gfav-scratch/crit-vite.mts`) was moved
to `<scratchpad>/trash-gfavcrit-1/`. My build, shots and planted trees are in `<scratchpad>/crit-gfav/`.
Banked beside this file: `critique/G-FAVICON/{crit-shoot.mjs, crit-an.py, crit-paper.mjs,
escape-plants.sh, escape-plants.txt, painted-16dpr1.txt}`, no images. Nothing retires T9-M22 (U-10).
