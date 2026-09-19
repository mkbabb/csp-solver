# PASS-2 PROTOTYPE · MRK-ABS · One visible hand

It RUNS. Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-46`,
branch `worktree-wf_8630d340-e56-46`, off `a8fee1f5`, uncommitted, 12 files, +145/−37. Dev server
127.0.0.1:4239 (`--strictPort`, private `cacheDir`), killed before this was returned. Both engines.

---

## 0 · What the replay carried

The pass-1 worktree's diff is 10 files; `git -C <other worktree>` is refused to a worktree-isolated
agent, so the patch was taken as a plain `diff -u` per file against this tree's HEAD copies
(+122/−37 — identical content, and the absence of any unrelated hunk is itself the proof that HEAD
moved by docs only) and applied by copying those 10 files across. Nothing conflicted. Carried:
`index.css` (the token pair, the `@layer base` block, the `.dark` alias, the `:219` comment,
`outline-ring/50` deleted), `DrawerTab.vue` (dashed rule deleted), `gameCell.css` (tier-2 comment),
`DarkModeToggle.vue` (colour → token, ornament offset kept), `GameCard.vue` / `StagingBand.vue` /
`GameGallery.vue` (token pair), `HandwrittenLogo.vue` (rule + radius deleted), `pencilConfig.ts` +
`gridPaths.ts` (pass-1's `ringSigmaUnits`/`ringK` and `cellSegments = 4`). The pass-1 worktree was
not edited. The one untracked file it carried (`pw-mrkabs-scratch.config.ts`) is superseded here.

## 1 · The pass-2 delta on top of it (~30 lines net)

1. `pencilConfig.ts` — `ringSigmaUnits`/`ringK` OUT of `BoilConfig` and `DEFAULT_BOIL_CONFIG`;
   `export const RING_GEOMETRY = Object.freeze({ wanderUnits: 5.4, inset: 0.86, kW4: 0.443 })`.
2. `gridPaths.ts` — the rect is drawn INSET (`f·cellSize`, centred), `roughness = wanderUnits /
   (0.015 · inset · cellSize)`, `cellSegments = 4`, LRU key untouched, bytes comment re-measured.
3. `OptionSelector.vue:52` + `AttributionCard.vue:45` — `transition-[color,background-color]`.
4. `GameCard.vue` — `border-radius: 0.5rem` DELETED from the focus rule (the last minted radius).
5. `gameCell.css` — tier 2 `stroke-opacity` 0.9 → 0.95.
6. Three comments rewritten from THIS run's measurements (see §4 for the corrections).

## 2 · Gates, measured

| gate | reading | verdict |
|---|---|---|
| G-ABS-1 ring σ ÷ rule σ, one window (W4), same board | px 0.657 / 0.695 / 0.657 at 4×4 / 9×9 / 16×16 (units 0.854 / 0.903 / 0.854) | GREEN, inside [0.5, 2.0] |
| G-ABS-2 one constant with its window | W4 σ 2.4004 / 2.3777 / 2.4148 units (dev +0.34% / −0.61% / +0.95% of 2.3922); n=4096 population 2.3918 (−0.02%) | GREEN (±5% and ±0.5%) |
| G-ABS-3 focus contrast from the ring's own band | chromium + webkit, light + dark: `.info-btn` `.icon-btn` `.ctrl-btn` 4.29 / 7.70, `.logo-trigger` `.attribution-trigger` 4.19 / 7.86, `.staging-face` (deck) token, `.guard-face` 7.8 dark, deck card token, board ring 3.92 light / 7.02 dark; every authored stop `isTheRing=true` | GREEN except `.drawer-tab`, below |
| G-ABS-4 one colour, same-frame | tab walk at a 400 ms settle: ONE painted colour, `2px solid rgb(58,123,196)` @ offset 3 (dark `rgb(106,171,235)`); `outline-style: auto` appears nowhere in `src/`; arrival 1 ms on 9/9 shipped stops | GREEN, two DEV-only stops named |
| G-ABS-5 the dark arm | `.dark` computes `--color-focus-sketch` = `--color-crayon-blue` = `#6aabeb`; hex census byte-identical to HEAD; the extended census's delta is exactly one ALIAS row | GREEN |
| G-ABS-6 MA-R, ring never shares ink with the rule | boundary B at f = 0.86, per cell: 256/256 at 16×16 desktop (worst +0.783 px, median +1.051) and 256/256 phone (worst +0.449 px); 81/81 and 16/16 at the smaller boards | GREEN (RED on pass 1: −1.358 / −0.779) |
| G-ABS-7 MA-N, no ring enters the neighbour | boundary C worst +3.963 px desktop / +2.274 px phone at 16×16, 256/256 | GREEN |
| G-ABS-8 pose 0 is the shipped artifact | the focused cell's resident `d` equals `wobbleRect` recomputed offline with the same seed and `RING_GEOMETRY`: byte-identical, 479 B chromium / 477 B webkit, both themes | GREEN |
| G-ABS-9 a focus rule mints no radius | source grep: 0 `border-radius` inside any `:focus-visible` block; `.live-face-slot` computed radius `0px` blurred and `0px` focused, both engines, both themes | GREEN |
| G-ABS-10 the constants cannot be mutated | `RING_GEOMETRY` frozen; `grep -rn "ringSigmaUnits\|ringK" src/` = 0; `vue-tsc -b --noEmit` exit 0 | GREEN |
| G-ABS-11 the dock sheet, opened | 393×699, sheet settled 900 ms, clipper `.controls-card` (`overflow: auto`): 22 stops, 19 reachable, tightest ordinary control clears by 8.39 px against the token's reach of 5; exactly ONE not WHOLE — the full-width sticky `.icon-btn.invite-btn` at −32.2 px (chromium) / −32.05 px (webkit), W2's declared clip | GREEN with the one named clip |

Guards: filter budget 9 / 9 / 9 and ghosts 16 / 81 / 256 with `filter: none` on every ghost at
every board size; `spoken-gallery.spec.ts` + `access.spec.ts` + `a11y.spec.ts` 29/29 chromium
(including "the deck focus ring rides the ACTIVE option"); deck reach 5, air 9.59, headroom 4.59,
WHOLE, one owner, `.gallery-viewport` `outline-style: none`; toggle ring painted at both viewports
(offset 54 desk / 12 phone, the declared range); `lint:theme-tokens` `lint:theme-selectors`
`lint:ink` `lint:motion` `lint:copy` all exit 0, copy register 0/0; unit battery 66 files / 810
tests passed; `vue-tsc -b --noEmit` exit 0; R6 law probe L1 = 9 and R1 RED→GREEN on this route.

## 3 · The gaps, named

1. **`.drawer-tab` is the one stop the band instrument cannot read whole.** Pooled over all four
   sides it returns 2.96 light / 2.68 dark (chromium), 2.98 / 2.43 (webkit), `isTheRing=false`.
   Per side (`logs/diag-drawer-*.json`): the OUTWARD side reads the token exactly — ink
   `[58,123,196]` at 3.21:1 light and `[106,171,235]` at 5.72:1 dark (webkit 3.36 / 3.82) — the
   LEFT side returns 0 changed samples (`elementFromPoint` there is `input.cell-native-input`: the
   tongue's ring is behind the board), and the top/bottom samples change to the tongue's own ink
   ([9,11,14] light), not the ring's. So the tongue's ring clears 3:1 where a reader can see it,
   and the pooled median is the instrument mixing a co-changing element into the band. The same
   occlusion existed at HEAD under the dashed rule; this is not a regression, and it is not proven
   clean either. A per-side form of `ring-band.probe.ts` (or an `elementFromPoint` filter on the
   sample points) is the pass-3 instrument row.
2. **The guard face's band was read in webkit only** (7.8:1, dark). In chromium the before/after
   pair returned 0 changed samples because `Shift+Tab` did not leave the armed ribbon — the guard
   is `aria-modal` with focus contained (a11y 3.2), so the "unfocused" frame was never unfocused.
   Its computed style is the token in both engines (`2px solid rgb(106,171,235)`, offset 3,
   `:focus-visible` true), and the crop is banked, but chromium has no painted ratio.
3. **The guard arms on the DEAL verb, not on a select.** `attemptSelect` arms only on a shared
   table (`GameGallery.vue:546`); the solo arm lives on `attemptDeal`. The brief's recipe (digit →
   wordmark → arrow → Enter) switches the game silently. Arming it needs: write a digit into an
   empty editable cell, open the deck, click `.staging-deal`, then Tab (Chromium grants
   `:focus-visible` to a programmatic focus only when the last modality was the keyboard, and the
   verb was clicked).
4. **The dark ring-on-rule reading does not reproduce.** The spec's §1.3 says light 4.11 / dark
   1.86, i.e. the hazard is dark. Measured from painted bytes at 16×16, dpr 3: ring vs rule ink is
   **1.39 light** and **5.42 dark** — the near-merge is in LIGHT. The cure is unchanged (the inset
   keeps them apart in both themes) but the sentence in §1.3 is backwards and should be re-cut
   from this reading before it is quoted again.
5. **The surface adjacency walk cannot resolve B at dpr 1** and, at dpr 3, measures a much larger
   gap than the worst case because a single scanline crosses the ring at one `y`, not at its
   outermost excursion: rule ink ends at device x = 0 and ring ink begins at device x = 20 (19
   device px ≈ 6.3 CSS px of clean paper at that `y`). The per-cell worst case is the closed form's
   +0.783 px, and it is trustworthy because the DOM's `d` IS the library's `d` (G-ABS-8). A pixel
   gate on B needs a per-cell walk at the ring's own extremum, not a mid-cell scanline.
6. **The attribution hover-card's three inner stops were never read focused.** They are rendered
   but shut on this route; a programmatic focus gave `:focus-visible false`, so they compute
   `outline-style: none` in the census and are neither covered nor excluded by evidence.
7. **Dist-bound suites are not run** (W8 §8.1 holds `dist`), per the brief: sequenced, not skipped.
8. **No phone frame trace**: the box ran four playwright batteries and a vitest run in this window,
   so the "quiet box (load < 2)" condition was not met. Not attempted rather than reported loosely.
9. **The 0.90 crop is a rebuild, not a live toggle**: `RING_GEOMETRY.inset` was set to 0.9, the
   crop taken through HMR (`d` starts at the 0.90 pad, x = 315.625 → 314.72 wobbled), and the file
   put straight back to 0.86. The shipped diff is 0.86.
10. **The webkit toggle at 393 dark reads `outline-offset: 0`** where every other arm reads 12
    (`logs/diag-toggle-webkit.json`). The ornament offset is `calc(2px − var(--toggle-bleed))`, so
    a theme-dependent `--toggle-bleed` on that viewport is the likely cause. Unexplained here.

## 4 · Numbers in the spec this run corrected

| spec said | measured here |
|---|---|
| grid W4 σ 2.744 / 2.621 / 2.499 at n = 16 / 48 / 96 rules | 2.810 / 2.632 / 2.827 at n = 6 / 16 / 30 — the board draws `2(N−1)` rules, so 16/48/96 is not a rule count |
| bytes 58,761 → 114,263 B at 16×16 | 58,761 → **119,894** B (57.4 → 117.1 KiB); segments 6 = 215,431 B |
| ceilings: board 16 on A, board 26 on C | those are the f = 1.00 ceilings (reproduced exactly). Under the shipped inset: **A 24, B 18, C 38** |
| C = +1.823 px at 16×16 | +1.822 at f = 1.00 (reproduced); **+3.963** under the inset |
| dock: 22 focusables / 18 reachable / 3 `display: none` | 22 / **19** reachable / **0** `display: none`, both engines |
| arrival same-frame on 11/11 shipped stops | 11 distinct stop classes, of which 2 are DEV-only (`.tuner-toggle` 250 ms, DebugToggle 200 ms): **9/9 shipped** stops arrive at 1 ms |
| board ring 3.68 light / 6.52 dark | **3.92 / 7.02** against bare paper, **3.64 / 6.36** against the ring's own washed interior |
| ring-on-rule: light 4.11, dark 1.86 | **light 1.39, dark 5.42** (gap 3 above) |

## 5 · MOVED, not re-cut

- `r0/r6-idiom-history/hue-census.mjs` — copied, re-pointed at this worktree, and EXTENDED with an
  alias section (a hex census is blind to a `var()` dark arm by construction).
  `instruments/hue-census-alias-row.diff`; the r0 file is untouched. Delta HEAD → prototype with
  the extended instrument: exactly one line,
  `--color-focus-sketch,dark,var(--color-crayon-blue) -> #6aabeb,0.724,0.115,249.3`.
- `r0/r6-idiom-history/law-probe.mjs` — copied and re-pointed (`FE_ROOT`);
  `instruments/law-probe-repoint.diff`. Row R1 goes RED → GREEN on this route; L1 stays 9.
- `r0/r3-marks/probe/budget.probe.ts` — copied and re-pointed (`PROBE_OUT`);
  `instruments/budget-probe-out.diff`.
- `r0/r3-marks`'s wobble row (W1, chord-fit, n = 1 rule) is MOVED to W4 over every rule and every
  cell; the replacement instrument is `probe/k-window-p2.mjs` and both σ come from one run.

## 6 · Files

- `probe/` — every instrument this lane ran (`k-window-p2.mjs`, `clearance-p2.mjs`, `dbytes-p2.mjs`,
  `identity-p2.mjs`, `proto.probe.ts`, `board2.probe.ts`, `diag.probe.ts`, `crop2.probe.ts`, the
  re-pointed `hue-census.mjs` / `law-probe.mjs` / `budget.probe.ts`, and the three scratch configs).
- `logs/` — the readings each one banked.
- `frames/` — four cited crops plus the two drawer-tab diagnostics:
  1. `crop1-cell-16x16-dark-f086.png` — the focused cell and its neighbours at 16×16, dark,
     chromium, dpr 3, f = 0.86: the lozenge is inside its square and the two inks are apart
     (against `r0/r3-marks/frames/ring-on-grid.png`, which is the defect).
  2. `crop2-cell-16x16-dark-f090.png` — the same at f = 0.90, U-10's alternate lever.
  3. `crop3-deck-centre-light-webkit.png` — the deck's centre card focused, light, webkit: square
     corners, the token, the live face's clip unchanged.
  4. `crop4-guard-face-dark.png` — the armed `.guard-face`, focused, dark: the surface no
     automation had reached in two passes.
