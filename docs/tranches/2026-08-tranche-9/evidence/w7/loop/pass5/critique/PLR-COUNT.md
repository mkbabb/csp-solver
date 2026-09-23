# PASS-5 CRITIQUE · PLR-COUNT · the tally in the head (§11)

Adversarial. I didn't write the charter or the prototype. Work tree `.claude/worktrees/wf_f72f3b5a-83a-52`, base and π control `74a2b5d9`. At my start and at my return the tree's temp-index diff against `74a2b5d9` was sha1 `7e4085e51382`, byte-identical to the banked `pass5/prototype/PLR-COUNT/tree-at-return.diff`. Every break I planted was restored and sha1-checked.

**VERDICT: ADVANCE · convergence 85 % (pass 4: 80).**

## 0 · Gaps first

1. **G14's contrast half is a best-pixel ceiling.** It reads the one pixel farthest from the ground, which is the declared ink at full coverage (5.159 in every run). It can't see a partial fade.
   - **X1b:** I masked everything after the first 1.2em of each quiet line to 25 % alpha. "16 p|layers" and "and |12 more" painted mostly ghosted. The landed row stayed **GREEN ×2**: core 5.159 both engines, `fracUnder` 0.053–0.059 against 0.029 unplanted.
   - The logged sensitivity statistic is blind too. Its mass test keeps pixels at ≥ 50 % of the crop's max distance, so faded columns leave the population. In X1 (first geometry) the faded `you` read *better*: worst column 5.159, 0 columns under.
   - **Closable:** read each line with PAL-WALK's painted-text instrument (§3.11: photograph twice, text transparent, every changed pixel against the painted ground). Gate the population's core median, and ship X1b as the negative control in the same run.
2. **G14 runs in light only.** X2 set the quiet lines to `rgb(70,68,66)` on the dark ground (`:global(.dark)`); the row stayed **GREEN ×2**. My dark read passes today (core median 6.021 / 6.099 on `rgb(18,16,15)`, both engines), but nothing holds it. **Closable:** give the row a dark arm with X2 as its negative control.
3. **Arm (c) isn't a lawful arm as built.** It fails WCAG 2.5.3 and reds two estate rows. With `SIX_ARM = "remainder"` (X3, both engines):
   - `writtenInName` is false at N = 6, 9, 14, 15, 16. The glyphs are `1 / 4 / 9 / 10 / 11`; the names are `N players`.
   - **G7 reds ×2.**
   - **G16 reds ×2** on its own negative control. The heading plant is arm (c)'s shipped rung, so `sixAtHeading == six`: 273.92 / 268.53. The README's gap 6 says "arm (c) would pass it too". That's false.
   - The head width is 97.06 at six, 108.66 at 15 and 106.45 at 16. It grows +11.6 px at two digits and isn't monotone in N. The README gives 95.42 and "unmeasured past 9".
   - **Closable:** arm (c)'s accessible name carries its visible remainder, and G7/G16 key on `SIX_ARM`, one row per arm, each run under its arm. Otherwise the ballot marks (c) as failing 2.5.3.
4. **Frames 2 and 3 aren't on one payload (§2.9).** Each arm "minted per run", so the two page sessions dealt two boards. The board isn't in either crop, but the law holds the board and a row with no stated payload is unpinned. Frame 1's (c) crop also carries other peer ids (other wobble seeds) than the (a)/(b) crops. **Closable:** mint once, pass one `?board=` and fixed peer ids (`from: "b1-0…4"`) to every arm, and re-shoot.
5. **The G16 estate row is keyed to arm (a) and runs at one cell.** Light, desk, 1280×800 dpr 2. It has no dark arm and no monotonicity clause; see gap 3 for arm (c).
6. **`useTallyStrokes` returns `reveal`, which neither caller destructures.** It's a member nothing uses, and knip can't see an object member. Strike it.
7. **The π census declares no DOM wrapper.** The leader's `div.attribution-disclosure` is a new element in both head corners, tag `DIV`, with no scoped rule. It's paint-neutral, but the README's "exactly 10 deltas" comes from a 13-selector list that can't see it. Declare it as the leader's.
8. **Carried, correctly cited, and still open:**
   - `check-pw-projects` check 8 RED: 267 / 264 against floors 214 / 212, control 0. It's the chair's fold restamp (pass5/CHAIR-RULINGS §1.4).
   - The landscape sheet laps 6 / 5 cells (the leader's `shortBand`).
   - Room rows are dev-vs-dev; the relay arm is W8 §8.3's.
   - `--ring-ink` stays `currentColor` (§6.7).
   - `poseFronts` isn't on the base (segment counts are banked).
   - The @mbabb hover region is −2.5 % (the leader's).
   - `DifficultyTally`'s segment count was read in chromium only.
   - Real iOS (M19).

## 1 · Servers, dist identity, payloads

| port | what | how I verified it |
|---|---|---|
| 4236 | the work tree, dev | two-line config in the scratchpad, cacheDir `vc-dev-plrc-critic` |
| 4237 | the control dist | served `index-CubiZsMVSwTc.js` |
| 4238 | a dev-mode control | two-line config over `w7-control`, own cacheDir; never git-touched |
| 4239 | **my own build** of the work tree | config outside the tree, built before any scratch existed inside it: **`index-CJR4iuiZgxXR.js`, 43 files**. The prototype's identity reproduces. |

- Every server was killed by its recorded listener PID, and the band 4230–4249 read 0 listeners at return.
- **Payloads:** every π reading mints `?board=` from the control's deal (for example `ATMuMjE0NjMwOTA1…`) and asserts all three arms read the same given-set: true in 48 of 48 arm-reads.

## 2 · What I re-ran myself (both engines)

| claim | prototype | my re-run | |
|---|---|---|---|
| π, dist vs dist, the whole document | 10 claimed deltas over 13 selectors | **every** element in `body` (1,155 / 1,157 nodes desk; 1,115 / 1,117 phone) minus the mark, sheet and edge subtrees, 24 paint props + tag + rect. Cells: desk 1280×800 fine and phone 390×844 `hasTouch` dpr 3 (coarse witnessed), light and dark, PRM. **Noise 0 in 16 readings.** Outside the head the only deltas are `ul.players-roster`: `display` flex → block, a 1×1 `sr-only` box moving 1–3 px | REPRODUCES, with a wider net |
| π, the head subtree with the card DRIVEN open | the corner 75.53 → 119.53, the edge ×2 | keyed by semantic ancestry; the card is witnessed at opacity 1 on both arms. **Noise 0, 16 deltas, identical in all 16 readings** (2 cells × 2 themes × open/shut × 2 engines): corner width 75.5 → 119.5 and `display` block → flex; both `.hover-card`s border 2 → 0 px and padding 16 → 18 px with the rect UNCHANGED (the box holds); plus the one undeclared wrapper `div` per corner (gap 7) | REPRODUCES |
| filterBudget on a BUILT dist | light 9 = 9, dark 11 = 11, 0 in the mark | my dist vs the control dist at 1280×800: **light 9 = 9, dark 11 = 11** in both engines, the mark's sheet open; the populations are identical; **0 inside the mark and sheet** | REPRODUCES |
| the whole spec files | tally + mark 59 / 1 / 0 | **59 passed / 1 skipped (webkit Tab) / 0 failed** (`logs/estate-1.log`) | REPRODUCES |
| multiplayer + join-language-prm, whole | 17 / 1 per engine | **40 passed / 2 skipped (the real relay) / 0 failed** (`logs/mp.log`) | REPRODUCES |
| G14 core and columns | cores 5.159; worst 50 % column 2.071–3.622; 1.4–3.8 % under | cores 5.159 ×3 both engines. `.pl-qual` `fracUnder` reads **0.04 chromium / 0.077 webkit** (the prototype's own runs span 0–0.04). The statistic moves run to run, so it isn't a stable number yet | the core REPRODUCES; the range is understated |
| two movers | 17.9 / 18.1 at the second's landing | 17.56 / 20.69, rises 0 / 0, both land 0 | REPRODUCES |
| PRM mid-draw | 45.2 / 44.9, then 0 | 46.16 / 46.42 before; inked from frame 1 / 0 and held 0 | REPRODUCES |
| G16 | one 60.98 / 62.72 · six 88.47 / 87.57 · heading 56.35 / 55.57 | one **63.70** / 60.63 · six 88.47 / 87.57 · heading 56.35 / 55.57. Solo `one` drifts ~4.5 % run to run (the pose index at the shot), so the margin to the control is 8–13 % | REPRODUCES |
| M16 | 0 unadmitted | `check-copy-register` bare: **EXIT 0**, 0 dashes, 0 jargon hits | CLEAN |
| undefined tokens | clean | the mark's and sheet's 13 `var()`s are each declared (index.css, typography.css, App.vue `--tap-floor`); `--presence-ink-dur` is published inline on the button and consumed there and on its descendant `.pt-stroke`; none resolves empty | CLEAN |

**Painted AA of the sheet, BOTH themes** (independent rig: the crop's outer 2 px ring as ground, the §2.4 core at ≥ 50 % of max |ΔL|, full distribution; `readings/sheet-aa.classified.txt`):

| theme | line | chromium: max / p30 / core MEDIAN | webkit: max / p30 / core MEDIAN |
|---|---|---|---|
| dark | `.pl-state` | 6.021 / 6.021 / 6.021 | 6.099 / 6.099 / 6.099 |
| dark | `.pl-qual` | 6.021 / 5.814 / 6.021 | 6.099 / 6.021 / 6.099 |
| dark | `.pl-more` | 6.021 / 5.868 / 6.021 | 6.099 / 6.099 / 6.099 |
| light | `.pl-state` | 5.159 / 4.335 / 5.159 | 5.159 / 3.71 / 5.159 |
| light | `.pl-qual` | 5.159 / 4.098 / 5.159 | 5.159 / 3.812 / 5.159 |
| light | `.pl-more` | 5.159 / 3.973 / 5.159 | 5.159 / 3.812 / 5.159 |

- **Dark clears 4.5 at the core median**: 0 columns under in dark except `.pl-qual` chromium at 0.038 and `.pl-more` at 0.013.
- **Light clears at the median**, but 31–40 % of core pixels sit under 4.5 (p30 3.71–4.34). The worst 50 %-mass column is 1.895 (`.pl-state`, chromium). That's the tag rung's thinness, the leader's booked class, and it's worse than the README's worst figure of 2.071.

## 3 · Break tests (edit the tree, run the LANDED row, restore with sha1)

| # | plant | landed row | result |
|---|---|---|---|
| X4 | `watch(reducedMotion, …)` struck (`PlayerMark.vue` 95af2b77 → 3a97082c) | PRM mid-draw | **RED ×2**: stranded at 43.01 / 45.91, `firstInked −1`. Restored OK. The settle cure is gated; striking the stop lines is right (the pencil-boil PRM listener sets `prmRef` and clears `subscribers` in one synchronous handler, before Vue's watcher runs) |
| X1b | mask all but the first 1.2em of `.pl-state/.pl-qual/.pl-more` to 25 % alpha (`PlayerLobby.vue` 2660643c → b453f09c), computed mask witnessed both engines | G14 | **GREEN ×2**: the gate misses a line that's two-thirds ghosted (gap 1). Restored OK |
| X1 | the same mask at 25 % of the box | G14 | GREEN ×2, and the column statistic *improved* (`.pl-qual` worst 5.159, 0 under) |
| X2 | dark-only quiet lines `rgb(70,68,66)` | G14 | **GREEN ×2** (gap 2) |
| X3 | `SIX_ARM = "remainder"` | G7, G16, and a probe | G7 **RED ×2**; G16 **RED ×2** on its negative control; 2.5.3 false at every N ≥ 6 (gap 3) |

The prototype's own B-14, B-S, B-W, B-G and B-16 are banked in its `logs/breaks-1.log` with `restored=OK`. I reproduced B-W as X4. B-14 is the opaque half's source plant; that half now fails when broken.

## 4 · Checklist

| item | hit |
|---|---|
| gates that cannot fail | G14's contrast half only fails if the declared ink or ground changes; it's a colour check wearing a pixel read (gap 1). G14's opaque half is now REAL (in-run plant + B-14) |
| the constraint it forgot | WCAG 2.5.3 on arm (c) (gap 3); §2.9's one payload on frames 2–3 (gap 4); both themes on G14/G16 (gaps 2, 5) |
| the elegant-reduction trap | "arm (c) would pass [G16] too": it doesn't. The estate rows are arm (a)'s, not the fork's |
| consumer-less substrate | `reveal` in `useTallyStrokes`'s return (gap 6) |
| π | one undeclared wrapper `div`, paint-neutral, the leader's (gap 7); every paint delta claimed |
| vacuous / circular · legacy alias · masked fallback · generic default · filterBudget · M16 · @property · undefined tokens · W2's mechanics | clear. `--head-rule` is the leader's one file-scope registration in index.css; `--tap-floor` is consumed bare; no new filter; hand strokes, no cards or eyebrows |
| unverified gestalt | frames are chromium light only; the phone head in context now exists (frame 4, looked at: the mark beside `@mbabb`, the sun at the right) |

## 5 · Strengths

1. **Every pass-4 red has a real answer.**
   - G14's opaque half now fails (the alpha is parsed from any form, with an in-run plant).
   - The `settle` stop lines are proven redundant by ablation, and the watch they stood behind is proven load-bearing: I reproduced it RED at 43.01 / 45.91.
   - The dist/room rows are re-titled and re-run like-for-like.
   - `lint:sleep` went from 6 to 0.
   - The PlayerMark comment cites one G16 run.
2. **The two-movers row is real.** It found its own instrument error (two mounted heads), re-scoped, and it reds under pass 2's global cancel.
3. **The substrate was replayed, not scaffolded.** There are two temp indexes and a named merge, and 17 of 23 files are byte-identical to the leader's pass-5 substrate. The three duplicate cures are stripped by name.
4. **π survives a much harder census than the lane ran.** Whole-document and head-subtree, both themes, card driven open, both engines: noise 0, every paint delta claimed. The filter population is identical to the control in both themes.
5. **The dist reproduces from source** (`index-CJR4iuiZgxXR.js`, 43 files), and the four crops are replacements naming their pass-4 crops.

## 6 · Convergence: 85 %

The centre holds and is proven in both engines: the set law, the crossing, two movers, PRM mid-draw, one counting base, zero filters, π and painted AA at the core median in both themes.

Against it:
- a re-cut gate whose contrast half can't see a fade (the §2.10 re-cut is half done);
- a light-only row;
- a ballot arm that fails WCAG 2.5.3 and reds two estate rows the README says it passes;
- two frames on two boards;
- a consumer-less return member.

These aren't zero gaps, and the streak is 0.

## 7 · Cross-pollination

- **Every painted-text AA gate in the wave:** a core defined by "≥ 50 % of the crop's max" and a column mass keyed to the same core both drop faded ink out of the population, so a fade reads as better. Key the population on the glyph's coverage (the painted-text instrument), never on the ink's own maximum.
- **Every lane with an owner fork (`*_ARM` consts):** run the estate under EACH arm before you write "the other arm passes too". A negative control planted as one arm's rung is that arm's shipped state.
- **Every §11 lane (PLACE, SELF):** a written count or remainder that isn't a substring of the accessible name is a 2.5.3 fail. G7's `label.includes(written)` is the reusable row.

## 8 · Pre-return battery (bare, tree / control)

| gate | tree | control |
|---|---|---|
| vue-tsc -b | 0 | not run (it writes build info) |
| typecheck:e2e · eslint . · prettier (`lint`) · lint:lanes · lint:theme-tokens · lint:sleep | 0 each | 0 each |
| **test:e2e:projects (check-pw-projects)** | **1** (check 8 FLOOR BAND, 267 / 264 vs 214 / 212; the chair's) | 0 |
| check-copy-register (bare) · lint:copy · test:font-coverage · lint:motion · lint:live-regions · lint:knip · lint:boundary | 0 each | 0 each |

The whole spec files: tally + mark 59 / 1 / 0, and multiplayer + join-language-prm 40 / 2 / 0, both engines, dev.

## 9 · Incidents (mine)

1. My first whole-document π keyed elements by their full class chain. The leader's new wrapper re-parented the head, so 94 of its 96 deltas read as presence-only. I re-cut to semantic-ancestry keys (`crit2.spec.ts`) and re-ran.
2. My first card-open drive clicked after the hover had already opened the card, which toggled it shut: 6 reds, and pi-wide's `cardDrive=true` rows are shut-state reads (noted in the reading). Coarse `focus()` doesn't open (the coarse gate). I re-drove with desk hover and a phone synthetic click, and witnessed opacity 1.
3. One stray write outside the scratchpad: `/tmp/ccr-plrc.txt`, the copy-register output. It was left in place (no rm law).
4. Scratch PW specs lived in `<work>/web/frontend/.plrc-critic/` (after my build, so no Tailwind contamination of the cited dist). They were `mv`ed to `scratchpad/crit-count/trash-plrc-critic-1/` before the battery; `eslint .` then ran clean. No rm was used.

Instruments (copies): `critique/PLR-COUNT/instruments/`. Classified readings: `readings/`. Logs: `logs/`. Raw census JSON isn't banked.
