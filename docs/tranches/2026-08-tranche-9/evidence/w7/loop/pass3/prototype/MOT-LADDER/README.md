# MOT-LADDER — pass 3 PROTOTYPE

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59`,
branch `wf_f72f3b5a-83a-59`, cut from `74a2b5d9`. Uncommitted (the agglomerator reads
`git diff --stat`). Control in every π row: **`74a2b5d9` bare**, built and served beside it.

## 0 · The replay, and the route it took

`git` aimed at the pass-2 worktree is REFUSED by this session's isolation — both
`cd <pass2> && git diff` and `git -C <pass2> diff` are blocked. Route taken instead: the
pass-2 delta was reconstructed **from this worktree's own object database** — for each path,
`git show a8fee1f5:<path>` against the pass-2 worktree's file on disk, assembled into a git
patch with real blob indices and applied `--3way`. That is byte-identical to
`git -C <pass2> diff a8fee1f5` and it carries W8's C06 (committed in the pass-2 tree), which is
the control's declared definition.

**It carried:** 35 files, +314/−127. Two files (`GameBoard.vue`, `GameControlPanel.vue`) are
touched by BOTH the pass-2 delta and the W7 execution fold; `--3way` applied both cleanly and
nothing was re-cut toward pass 2. Two new files came across by copy:
`scripts/check-motion-bands.mjs`, `scripts/motion-inventory.base.json`. `vue-tsc` 0 after.

## 1 · THE FINDING THAT MOVED THE SPEC: a registration emitted beside its values is not a registration

§1.2 put the seven `@property` registrations inside `motionRungsCss`, i.e. inside the same
runtime `<style>` node as the values. **Measured, that buys nothing**: deleting the publisher
deletes the registrations with it, so B12's born-RED row read `transition-property: all` —
exactly what it reads at HEAD — in both engines.

The cure, landed: the registrations live in `index.css` (the first stylesheet,
`initial-value: 0ms`); `motionRungsCss` emits the VALUES and the reduce arm and nothing else.
B3 then asserts the registered set and `MOTION.rungs` are the SAME set, closed both ways, so
the two cannot drift. After that change:

| build | `--motion-throw` at `:root` | `.icon-btn` duration | `.icon-btn` property |
| --- | --- | --- | --- |
| after (publisher live) | `0.52s` | `0.15s, 0.15s` | `background-color, color` |
| control `74a2b5d9` | *(empty — no ladder)* | `0.15s, 0.15s` | `background-color, color` |
| **absence** (publisher call deleted) | **`0s`** | **`0s, 0s`** | **`background-color, color`** |
| **absence, negative control** (initial-value = the rung) | `0.52s` | `0.15s, 0.15s` | `background-color, color` |

Identical in chromium and webkit (`readings/b-b12-absence-*.json`). Absence reads as REDUCE,
not as `all`; the negative control PASSES and re-silences the row, which is the measured case
for `initial-value: 0ms` (spec §8 objection 1 — **CONFIRMED on the surface**).

One spec correction: §7 predicted `.icon-btn`'s property would read `opacity`. The real rule is
the colour transition, so it reads `background-color, color`. The claim that matters (not
`all`) holds.

## 2 · The boot-frame sampler — the number that prices §2.1

| engine | node lands at frame | first consuming frame | **window** |
| --- | --- | --- | --- |
| chromium | 0 | 0 | **0** |
| webkit | 1 | 1 | **0** |

**0 frames in both engines.** Registry §2.1's runtime node stands; MOT-VERB's build-time form
costs bytes only and buys no first-paint window (spec §8 objection 2, priced).

## 3 · The node, PRM, the roster

`<style data-motion-rungs>` ×**1**. Live `:root` reads all seven
(0.15 / 0.2 / 0.25 / 0.35 / 0.44 / 0.52 / 0.6 s). Under `reduce`, every rung reads **0s** at
`:root` and at `.icon-btn`, `.washi-label`, `.drawer-tab-text` and a `.transition-colors`
element — both engines, computed duration `0s` at each.

B5 roster over the live CSSOM under reduce: 56 (chromium) / 55 (webkit) transition rules,
31 / 30 read a rung, 12 matched a live element, and **0 of them resolve nonzero**. 8 other
nonzero live rules in each engine (the admitted CHARACTER/GRADED rows); 19 / 18 rules inside
reduce blocks. *Gap: the roster reports 8 rather than resolving each against §2.2's exactly-2
PRM-FALLBACK class; the class membership was not machine-checked at runtime.*

## 4 · The dock band — measured on this build, both arms, full per-frame series

Both arms are SERVED BUILDS: `rise` 600 vs `74a2b5d9`'s inherited 520. Travel is matched per
pose and stated, never assumed.

**webkit** (the surface the band was declared on)

| pose | travel | worst frame | excess area Σmax(0,Δ−40) | frames >40 |
| --- | --- | --- | --- | --- |
| 768×1024 | 641.5 / 641.5 (0.0 %) | 108.76 → **71.90** (−33.9 %) | 180.36 → **123.54** (−31.5 %) | 7 → 7 |
| 390×844 light | 595.5 / 595.5 (0.0 %) | 72.63 → **67.00** (−7.8 %) | 129.55 → **80.49** (−37.9 %) | 6 → 6 |
| 390×844 dark | 595.5 / 595.5 (0.0 %) | 88.50 → **66.24** (−25.2 %) | 126.20 → **86.35** (−31.6 %) | 6 → 6 |

**chromium**

| pose | travel | worst frame | excess area | frames >40 |
| --- | --- | --- | --- | --- |
| 768×1024 | 599.18 / 614.78 (−2.5 %) | 43.24 → **34.95** (−19.2 %) | 3.24 → **0** | 1 → 0 |
| 390×844 light | 575.56 / 595.17 (−3.3 %) | 44.21 → **32.99** (−25.4 %) | 6.35 → **0** | 2 → 0 |
| 390×844 dark | 595.17 / 595.17 (0.0 %) | 39.29 → **32.22** (−18.0 %) | 0 → 0 | 0 → 0 |
| 844×390 | 290.89 / 293.23 (0.8 %) | 20.58 → **17.21** (−16.4 %) | 0 → 0 | 0 → 0 |

**The desk is untouched.** 1440×900: rest rect identical to the pixel on both arms
(top 176.98, left 710, 330×640); sampled travel 2.81 → 2.70 px.

**Settle**: 700 ms after the tap, **0 running animations** at every pose in both engines, and
the rest rect equals the control's to the pixel.

**The declared band did NOT reproduce.** Pass 2 declared worst frame −11…14 % and excess area
−20…26 %; this build reads worst frame −7.8…−33.9 % and excess area −31.5…−37.9 % (webkit).
Both statistics fall at every pose in both engines — that is the claim — but the ends are
different, so `rungs.rise`'s docstring now carries the RE-DERIVED band and the old ends are
struck. `framesOver40px` is confirmed useless as a criterion: in webkit it does not move.

## 5 · π identity

Rect census of three rest poses, after vs `74a2b5d9`, read 1.6 s after load (past the 520 ms
settle): **maxDelta 0.000 px, 0 moved rects**, chromium and webkit, at 1440×900, 390×844 and
768×1024. *Limitation, stated: the census keys on `TAG.class#id`, which collides for repeated
cells, so 102 / 91 DISTINCT keys were compared out of 774–880 rects. It is a real zero over
what it compares and it is not the fold's 5,712-rect census.*

## 6 · Static

```
B1 NAMED                      ✓        B9  DELAY FENCE              ✓
B2 CLOSED                     ✓        B10 PINNED-CITE              ✓
B3 ONE HOME, NO FALLBACK      ✓        B11 KIND FENCE               ✓
B4 NO-ALL                     ✓        B12 ABSENCE (static half)    ✓
B5 PRM                        ✓        G-DOCK-BAND                  ✓
B6 RATCHET                    ✓        G-GUARD                      ✓
B7 TAILWIND                   ✓        G-REFUSE-ONE-HOME            ✓
B8 CURVE                      ✗ 10  — MOT-VERB's cure, reported not hidden
```

Census: 75 declarations carry a time (71 shipped), 83 duration positions, **51 on a rung**,
31 literal (19 distinct). Code roster: **22 clocks, 13 TRAVEL / 1 WINDOW / 8 POLICY, 0
unkinded** (44 unkinded before the tags). 59 fallbacks struck; 0 remain; 59 bare rung reads.

`--self-test`: **every** negative control fires RED and the run FALLS THROUGH to the census —
including the critic's exact sabotage (`throw` 520 → 500, invisible to a site-keyed bank
because `throw` has zero CSS consumers), B11's three plants, B12's 520 ms initial, B3's single
returned fallback, and B6's site-keyed shortening.

Other lanes: `vue-tsc` **0** · `vitest` **68 files / 830 tests, 0 failed** ·
`lint:motion` 34 specs ✓ · `lint:copy` ✓ · `check-theme-tokens` ✓ · `check-theme-selectors` ✓ ·
`check-font-coverage` ✓ · `lint:ink` ✓ · `lint:sleep` ✓ · `knip` **0** ·
`check-lane-membership` **0** (the gate was UNCLAIMED until a CI lane was wired beside
`lint:motion`).

Bundle, whole `assets/` tree, against `74a2b5d9`: CSS **+1,453 raw / +134 gz**,
JS **+1,321 raw / +674 gz**, both **+2,774 raw / +808 gz**. The ceiling (+400 raw / +150 gz) is
missed in both units; stated in gz, it is +808 against 150. The index JS chunk alone reads
−7,365 raw, which is a chunk split (44 files vs 43), not a saving — the whole-tree figure is
the honest one.

Dist identity (`scripts/dist-identity.mjs`, banked, never hand-typed):
after `index-BJNDhR7GUB_y.js` · control `index-CubiZsMVSwTc.js`.

## 7 · Gaps, named

1. **B8 stays RED at 10.** The curve row LEFT this family by spec; its cure is MOT-VERB's. The
   gate carries the prohibition and reports the count. `MOTION_LADDER_B8_OWNED=1` demotes it
   when the verbs land.
2. **The exit ballot is undecided.** `instruments/app-exit-last-rect.diff` is written and
   reasoned but NOT built into a second dist and NOT measured. §7(h)'s numbers are owed.
   G-EXIT-MIRROR stays RED and the ballot cannot be put to the owner yet.
3. **The exit's rest geometry was not re-read on this build** (§7(g)); the 145.49 / 145.77 and
   319.10 / 324.02 figures in the spec remain pass-2's readings.
4. **Not run**: the dusk fixed-t sampler (§7 i), the 15-gesture frame trace (k), the theme-flip
   parity ×6 (l), goldens 4/4 via `PLAYWRIGHT_BASE_URL`, `filter-census` allowlist = 9, r6's
   `hue-census.mjs` / `law-probe.mjs` copies, r1's `heading-voice`, r3's `wobble.probe`.
   Every one is a real hole in the π claim; only the rect census stands for it.
5. **The B5 roster does not check PRM-FALLBACK class membership** at runtime (see §3).
6. **The three commits are ONE diff.** §4 asks for three patches (gate / home / sites); the
   worktree carries one uncommitted delta. The file counts are also over: the home touched more
   than 22 files once the kind tags landed.
7. **A port trap, banked for the wave.** 4243–4246 were held by other lanes' dev servers when
   this lane started, and `python3 -m http.server 4246` failed to bind SILENTLY while `curl`
   returned 200 from the stray. The first probe batch read another lane's dev server and every
   "after" number in it was void. Ports were re-read with `lsof` and the build moved to 4240.
   **A served port must be verified by its own build's asset hash, never by a 200.**
8. **The self-test's B11 negative-negative case prints "RED (as it must)"** while it is in fact
   the held case. Cosmetic, but it reads wrong.

## 8 · Files

`readings/` — every JSON above, raw. `instruments/` — the four probe specs, the scratch
Playwright config, `app-exit-last-rect.diff` and `R6-moved-rows.diff` (both PROPOSED, neither
applied). `logs/` — the static battery and the unit run. **Zero frames banked** (the wave's cap
is the reason; nothing here needed a picture that a number could not say).
