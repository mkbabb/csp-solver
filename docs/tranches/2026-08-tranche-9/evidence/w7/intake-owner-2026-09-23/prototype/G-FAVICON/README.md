# G-FAVICON · prototype (T9-M22, TAB-PEN)

Opus prototyper, 2026-09-23. Worktree `.claude/worktrees/wf_b6676cd9-8c6-17`, cut from main `1d0dc4fd`,
nothing committed. Control dist = the unedited tree built first (`dist-base`, its assets byte-identical
to the lane's). Ports: a scratch `http.server` on 127.0.0.1:4257 (PIDs 86844, then 29085), then
`vite preview` lane 4257 (npx 7612, listener 7684) and control 4258 (npx 7962, listener 8060). Every PID
was killed and both ports read free. No Safari, no osascript, no `rm`, no npm install. Scratch (shots,
dists, vite cache, the two-line config) sits in the untracked `.gfav-scratch/` at the worktree root.
Nothing here retires T9-M22 (U-10).

## The diff (product)

| file | change |
|---|---|
| `web/frontend/public/icon.svg` | NEW, 496 B: square paper, one open monoline s, stroke 4, round caps/joins, page tokens both schemes, no filter |
| `web/frontend/public/favicon.svg` | DELETED (the rename busts the favicon store) |
| `web/frontend/public/apple-touch-icon.png` | NEW, 180×180 palette PNG, 2,473 B, sha-stamped |
| `web/frontend/index.html` | `href="/icon.svg"` + one `rel="apple-touch-icon"` link |
| `web/frontend/scripts/check-favicon.mjs` | NEW, G-TAB-1 (clauses a–e, six plants) |
| `web/frontend/scripts/icons.mjs` | NEW, local raster + `--check`, `NOT-A-LANE:` declared |
| `web/frontend/package.json` | `lint:favicon`, `icons` |
| `.github/workflows/ci.yml` | one step beside `lint:theme-tokens` |
| `.gitignore` | `!web/frontend/public/apple-touch-icon.png` (see F1) |

`src/` diff empty; `pencilConfig.ts` byte-identical. The dist diff is exactly `index.html` (the two link lines), `+icon.svg`, `+apple-touch-icon.png` and `−favicon.svg`. Every `assets/` file is byte-identical.

The s, as drawn (centreline in the digits' grammar, `glyphPaths.ts` "5"[0]'s upturned tail):
`M22.6,9.6 C21.4,7.1 18.6,6 15.8,6 C12,6 9.6,7.9 9.6,10.6 C9.6,13.4 12.4,14.6 16.2,15.8 C21,17.3 24,18.4 24,21.2 C24,24.4 20.4,26 15.8,26 C11.6,26 8,24.6 8,22.6`.
Centreline extrema x 8–24, y 6–26. The outer box is exactly 20 × 24 (x 6–26, y 4–28, which is whole pixels 3–13 / 2–14 at 16). The centre is (16.00, 16.00), stroke/H is 0.167, aspect 0.83, and the lower bowl (16 wide) is wider than the upper (13).

## G-TAB-1 · lint:favicon

- Tree: a b c d e all GREEN. The self-test's 7 plants each RED exactly their clause set: P1 main's file verbatim `abcd` · P2 `#1a1a1a` `c` · P3 sw 6 `bd` · P4 @media deleted `c` · P5 stroke-opacity 0.15 `b` · P5 `#e8e6e3` `c` · P6 SVG edited after the PNG `e`.
- Main (`--root` on the main tree): **26 failures, every clause RED** (`instruments/g-tab-1-on-main.txt`). d reads main at 0.825 W / 0.906 H.
- The token resolver: `@theme` (not `:root`: index.css:107, the light tokens live there) → `#fbfaf9`/`#0a0a0a`; `.dark` → `#110f0e`/`#edece9`. All four match the adjudicator's hexes.
- `icons.mjs --check`: decoded max Δ 0, provenance matches. check-lane-membership 4/4 ✓. prettier (`npm run lint`) 0. eslint 0.

## G-TAB-2 · painted (chromium + webkit, `<img>`, DPR 1/2, 16/32/48/180, 4 strips, 2 photographs/cell)

1,664 photographs + 256 (the 4.5 rung). The two photographs match in every cell (Δ 0), so the minimum is either one. Main photographed in the same run reproduces the census exactly (cov 0.520–0.527, core 16.08 / 15.19, Δ 0.89, WebKit blur σ 0.35 / 1.0), which validates the instrument. Rollup: `instruments/g-tab-2-rollup.txt`; per-cell summary `painted-census-summary.tsv` (384 rows).

| row (gate) | W, the cut (ships) | main | verdict |
|---|---|---|---|
| coverage [0.18, 0.32] | 0.225–0.230 | 0.520–0.527 | PASS |
| skel max/median ≤ 1.25 @32,180 dev px | 1.04–1.12 | 1.94–2.32 | PASS |
| stroke/H median [0.15, 0.17] @32/48/180 | median 0.167 (0.164–0.172; 44/48 cells in window) | 0.183 (0.161–0.195) | PASS |
| stroke/H @16 (printed) | 0.167 | 0.195–0.286 | printed |
| two apertures ≥ 3 px @16 DPR1 | [3, 3] every engine and strip | [2, 2] | PASS (at the floor, no slack) |
| tile under light / dark | (251,250,249) / (17,15,14), both engines | (250,248,245) in both | PASS |
| tile on its own strip ≤ 1.3 | #fff 1.04 · #dee1e6 1.26 · #202124 1.19 · **#35363a 1.58** | 1.06 · 1.24 · 15.19 · 11.38 | **FAIL on dark-active** (G1) |
| core median ≥ 12 | light 17.9–19.0 · dark 14.8–16.2 | 15.19–16.08 | PASS |
| WebKit core within 0.5 of chromium @16 DPR1 | Δ 0.36 light / 0.35 dark | 0.89 | PASS |
| fraction under 4.5 @16 DPR1 ≤ 0.36 | light **0.375 ch** / 0.360 wk · dark 0.326 / 0.337 | 0.289 / 0.385 | **FAIL chromium light** (G2) |
| sub-4.5 keyed count ≤ main's | light 33 ch / 31 wk · dark 28 / 29 | 50 / 77 | PASS |
| keyed fraction under 3 (rate) | light 0.295 / 0.302 · dark 0.233 / 0.244 | 0.202 / 0.295 | printed |
| blurfit σ vs geometry | chromium 0.15, WebKit 0 | chromium 0, WebKit 0.35–1.0 | printed |
| paper one region @16 DPR1 | 1 in both engines | chromium 2 / WebKit 1 | PASS |

**The 2 px line at 16 DPR1 doesn't read grey**: its core median is 17.9 (chromium) and 18.3 (WebKit) on light, against main's 16.1 / 15.2. So the rung's trigger isn't met. I probed the rung anyway (stroke 4.5): chromium light's fraction under 4.5 falls 0.375 → 0.337, but WebKit light's rises 0.360 → 0.378. Apertures collapse to [2, 3], stroke/H goes to 0.176–0.200 (out of window), and max/median reaches 1.26. **The rung cures nothing and costs three rows. Not taken.**

**The line weight against the wordmark** (census `wordmark-readings.json`: the painted wordmark s, scaled to like height, reads stroke/H 0.164–0.183). W's skeleton median is 2.00 / 4.00–4.12 / 6.00 / 22.1–22.4 css px at 16/32/48/180, which is stroke/H 0.164–0.172, **inside the wordmark's band** at every size, both themes, both engines. Main's is 2.83–4.00 / 5.00–5.66 / 8.00–8.12 / 26.3–29.5 (0.161–0.286).

## Ballot arms (built on the tree under `arms/`, never linked) · each arm's G-TAB-2

| arm | cov | max/med @32,180 | stroke/H @32–180 | apertures @16 DPR1 | core @16 DPR1 light ch/wk | frac<4.5 light ch/wk | gate |
|---|---|---|---|---|---|---|---|
| **W** stroke 4 (B-FAV-1 default, B-FAV-2 A) | 0.225–0.230 | 1.04–1.12 | 0.167 | [3,3] | 17.9 / 18.3 | 0.375 / 0.360 | all but G1, G2 |
| **B** stroke 5 | 0.283–0.291 | 1.04–1.06 | 0.196–0.236 (0/48 in window) | [2,3] | 19.0 / 19.0 | 0.352 / 0.360 | FAILS stroke/H and apertures |
| **P** Fraunces opsz 52, wght 550 | 0.222–0.229 | **2.17–2.55** | **0.118–0.125** | [3,4] | 14.7 / 15.3 | 0.379 / 0.341 | FAILS max/med and stroke/H |
| sibling Fable 16×25 (rx removed) | 0.192–0.195 | 1.04–1.12 | 0.155–0.162 | **[2,4]** | 16.5 / 16.7 | 0.378 / 0.390 | FAILS apertures |
| sibling Opus 23×22 | 0.250–0.255 | 1.05–1.12 | 0.178–0.182 | [2,2]/[2,3] | 18.4 / 18.5 | 0.372 / 0.330 | FAILS stroke/H and apertures |

- **Arm P's wght was chosen on a proxy that failed.** A librsvg sweep (`instruments/printed.py`; wght 300–900) put the 32 px median in the window from wght 550 up (quantised). The engines read 0.118–0.125. The geometric window needs wght ≈ 850–900 (0.161 at 900, the census's own opsz-52 figure), and there the coverage is 0.34, outside [0.18, 0.32]. **No wght satisfies the printed arm's coverage and stroke/H windows together.** A serif's skeleton median is hairline-dominated. Kept at 550 because it matches W's ink mass (0.228 vs 0.229), which makes the pair a clean one-variable read of the hand.
- **B-FAV-2 arm B's number, corrected:** the adjudication's "stroke/H 0.208" is 5/24 (A's box). By clause d's own formula it's 5/(20+5) = 0.200 geometric, painted 0.196–0.236. Either way it's outside the window. B also closes the upper aperture to 2 px.
- The shipped merge beats both auditioned cuts on the aperture row (the siblings' 2 px slits persist). Genericness at 16 and 32 is the critic's to read (crop 4).

## G-TAB-3 · π (MRK-LIVE's `pi-p6-wholedom.mjs`, lane copy adds a coarse regime + a filter count)

| regime | engine | nodes lane/ctrl | paint deltas | only-here | floor (ctrl vs ctrl) | filter census light · deck · dark (lane = ctrl) |
|---|---|---|---|---|---|---|
| fine 1280×800, PRM reduce | chromium | 4148/4145 | **0** | 3 | 0 | 9 · 14 · 11 |
| fine 1280×800, PRM reduce | webkit | 4148/4145 | **0** | 3 | 0 | 9 · 14 · 11 |
| coarse 390×844 hasTouch (pointer:coarse true, hover:none true), PRM reduce | chromium | 4028/4025 | **0** | 3 | 0 | 9 · 14 · 11 |
| coarse, same | webkit | 4028/4025 | **0** | 3 | 0 | 9 · 14 · 11 |
| fine, no-preference | chromium · webkit | 3988/3985 | 2 · 30 | 3 | 12 · 0 | 9 · 13 · 11 |

The three only-here rows are the new `<link rel="apple-touch-icon">` in each of the three states (`html>head>link:27/32/32`), the lawful diff. The no-preference deltas are all `opacity` 0↔1 on boil-pose / boil-frame siblings (the boil's phase), and chromium's own control-vs-control floor carries 12 of them. PRM parks the boil and reads 0. Themes = the page's light and `.dark` (the census drives the toggle). Filter census light 9 = control.

Static: `vue-tsc --noEmit` 0 · `typecheck:node` 0 · knip 0 · `check-copy-register` bare 0 · `check-motion-contract` bare OK (35 specs) · `lint:theme-tokens` 0 unreferenced · unit battery **69 files / 847 tests passed** · lane-membership ✓.

## G-TAB-4 · estate (vite preview)

| path | lane 4257 | control 4258 |
|---|---|---|
| `/icon.svg` | 200 `image/svg+xml` | 200 `text/html` (SPA fallback) |
| `/apple-touch-icon.png` | 200 `image/png` | 200 `text/html` |
| `/favicon.svg` | 200 **`text/html`** (SPA fallback) | 200 `image/svg+xml` |

**The gate's 404 row is unreadable on vite preview** (G3): the preview's SPA fallback answers 200 `text/html` for any missing path. So the discriminating reading is the content type. The 404 belongs to CF Pages (`public/404.html`, the census's live 404s), and that's W8's crossing row.

## Crops (4, all ≤ 39 KB)

1. `c1-contact-sheet-…` chromium+webkit · DPR 1/2 · light-active #fff / dark-strip #202124 · main vs W at 16/32/48 · pointer n/a.
2. `c2-decider-…` **the decider**: 16×16 DPR1 ×10 nearest, both engines, all four strips, main vs W, each cell's cov/core/apertures/frac printed.
3. `c3-apple-touch-icon-…` the 180 PNG (librsvg) on #ffffff and #000000, with the paper-vs-ground and ink-vs-paper contrasts computed from the PNG.
4. `c4-ballot-pairs-…` chromium DPR2 · light-active / dark-strip · 16 and 32: W | P | B | Fable | Opus | main, each cell's G-TAB-2 row.

## Findings and gaps (a gap is a gap)

- **F1 (would have shipped RED):** `.gitignore:53` ignores `*.png` repo-wide. Without the negation added here, `apple-touch-icon.png` never reaches the index, CI's `lint:favicon` (e) reds on a fresh checkout, and the edge 404s the touch icon. The og-card comment above it ("the one committed public PNG") is now one short. The three `!…/pwa-*.png` negations name files that don't exist (stale since T2), which is the chair's row, not this lane's.
- **G1 tile-on-strip ≤ 1.3 fails on Chrome's dark ACTIVE tab (#35363a): 1.58.** The adjudicator's 1.19 was #202124 only. A paper within 1.3 of both dark strips needs relative luminance of about 0.016–0.035 (a #25–#33 grey). The page's dark token `#110f0e` is 0.005. So the row passes only if it's restated per strip (dark-strip 1.19 and light-active 1.04, both PASS) or if the paper stops being the page's paper. That's the owner's or chair's call, not a cure.
- **G2 fraction under 4.5 at 16 DPR1 light, chromium 0.375 > 0.36** (WebKit 0.360 at the edge). The adjudication predicted it: a line has more fringe per ink than a Black glyph, with the count at 33 vs 50 and core 17.9 vs 16.1. No lawful cure exists in the brief (the rung makes WebKit worse; see above). Restate the row as the count, or accept the rate with both numbers named.
- **G3** G-TAB-4's 404 row isn't observable on vite preview (above).
- **The apertures sit exactly at the floor, [3, 3].** Any re-cut that thickens the pen or moves the spine off y = 16 at the centre column loses one. Arm B and the 4.5 rung both do.
- **Every painted number is headless `<img>`**, not Chrome's favicon service or Safari's icon database. **Unwitnessed rows (M19):** Safari tab (does it show `icon.svg`, honour the in-SVG query, what the overview paints); Safari/iOS use of `apple-touch-icon.png` (180 square; iOS masks the corners); Android add-to-home without a manifest; Firefox tabs; real tab-strip colours (the four are the census's Chrome approximations).
- **The scheme mismatch is declared, not cured**: the icon follows the OS, the page follows `.dark`. theme-color metas were refused (MOT-VERB's crossing).
- **`sharp` is undeclared**: `icons.mjs` resolves miniflare's transitive 0.35.4 via createRequire (header says so). The fold decides between declaring it (a lockfile act) and keeping the PNG vendored with its sha (the gate already holds sha + IHDR browserlessly). I recommend the latter: CI never rasters.
- **The shipped cut is my drawing** of the adjudicator's box law. Whether it reads as the house hand or a clean sans s at 16/32 needs the critic's non-author eye (row 10); crop 4 carries both siblings beside it.
- The PNG is librsvg's raster, not an engine's. Crop 3 reads it, and no browser photographed the touch icon.
