# PAL-TIN — pass-4 PROTOTYPE. The three red lanes are green, the ring is SAMPLED, and paint
# refuses the tin's own scalar.

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2`,
base `74a2b5d9`, nothing committed. **19 files changed, 611 insertions, 83 deletions**, plus
three untracked product files (`e2e/peer-tin.spec.ts`, `scripts/check-peer-tin.mjs`,
`src/pencil/glyph/PlayerTick.vue`).

**REPLAY ROUTE: NONE — the prototype ADVANCED IN PLACE** (chair's pass-4 §2). At start,
`git -C <work> diff --stat` read 18 M + 3 untracked and matched the banked
`pass3/prototype/PAL-TIN/pass3.diff` file list EXACTLY, file for file. No `git apply`, no
`diff3 -m`, so no line-count check was owed. The nineteenth file this pass is `e2e/node.d.ts`
(§8 gap 12); `PlayerTick.vue` MOVED inside the untracked set, `src/games/shared/` →
`src/pencil/glyph/`.

Servers: prototype `127.0.0.1:4245` (private cacheDir `<work>/.vite-cache-tin4`), HEAD control
`127.0.0.1:4246` = `.claude/worktrees/w7-control` preview, **verified by its own asset hash
`index-CubiZsMVSwTc.js`, never by a 200**. Both KILLED BY RECORDED PID (34013 / 34065); 4245 and
4246 read empty at return. 4230/4231/4232/4237/4238 are siblings' and were left alone.

---

## 0 · NUMBERS FIRST

### 0.1 The three CI lanes the critic found RED — all GREEN, and eight more beside them

| lane | pass 3 | pass 4 |
|---|---|---|
| `npm run lint` (prettier) | **1** (3 files) | **0** |
| `npm run lint:eslint` | **1** (`SheetWashiLabel.vue:13` — pencil imports games) | **0** |
| `npm run lint:motion` | **1** (`PRM: declared` is not a mode) | **0** |
| `vue-tsc --noEmit` | 0 | **0** |
| `npm run typecheck:e2e` | not run | **0** |
| `npx knip` | clean | **0** |
| `node scripts/check-peer-tin.mjs` bare | 0 | **0**, now SIX gates |
| `… --self-test` | 0, six controls | **0, EIGHT controls, every one RED** |
| `… at 74a2b5d9` | exit 2 | **exit 2**, `INSTRUMENT BROKEN (tin): 0 light sticks and 0 dark` |
| `check-copy-register` bare | 0 | **0** · 0 dashes · 0 unadmitted · lexicon 25 |
| `npm audit --audit-level=high` | not run | **0** |
| vitest | 68 files / 836 tests | **68 files / 836 tests, exit 0** |
| `e2e/peer-tin.spec.ts` | 7 tests × 2 engines | **8 tests × 2 engines = 16 passed** |

The eslint cure is the critic's: `PlayerTick.vue` imports exactly one thing
(`@pencil/grid/gridPaths`) and was a pencil component filed in the wrong folder. It now lives at
`src/pencil/glyph/PlayerTick.vue` and both homes import `@pencil/glyph/PlayerTick.vue`. No design
change, no pixel.

The motion cure is NOT the critic's suggested wording, and the difference is the point: `PRM:
frozen` alone REDS rule 3 ROUTE, because nothing in the file applied PRM. The file now calls
`page.emulateMedia({ reducedMotion: "reduce" })` in `boot()` before every `goto` — which the new
sampled row needs anyway, since a boiling grid makes a pixel sample a lottery.

### 0.2 THE RING, SAMPLED — two pixels out of a dpr-2 screenshot, with the ring-off shot as its control

The critic's §2.2 stands as written: pass 3's "PAINTED on engine bytes" composited resolved
TOKENS with the spec's own arithmetic and sampled nothing. `e2e/peer-tin.spec.ts` §1b now
screenshots a LIVE peer cursor at `deviceScaleFactor: 2`, finds the ring's stroke by SUBTRACTING
the same clip with the ring off (the peer looks away), and ratios two sampled RGBs.

```
SAMPLED light  chromium  stroke rgb(130,137,110) @93,15  interior rgb(244,245,242)  RATIO 3.336
               webkit    stroke rgb(130,138,109) @60,16  interior rgb(244,245,242)  RATIO 3.306
SAMPLED dark   chromium  stroke rgb(95,121,7)            interior rgb(24,25,16)     RATIO 3.564
               webkit    stroke rgb(96,122,7)            interior rgb(24,25,16)     RATIO 3.614
CONTROL  the same two pixels in the RING-OFF shot:  1.000 · 1.000 · 1.000 · 1.000
         the ring moved 381 / 189 / 381 / 191 in 8-bit distance; 0 is the born-RED
```

The stick on screen is peer-2 (green), the WORST arm of the five. Two engines now differ in the
third decimal rather than agreeing exactly, which is what sampling rather than arithmetic buys.

The old §1 row survives, RENAMED to what it is: *"the ring arm's RESOLVED TOKENS clear 3.0
composited at the ruled alpha"*, printing `RING light (RESOLVED TOKEN VALUES, composited by this
row's own arithmetic)`. Worst 3.134 light / 3.146 dark; the digit ink in the same ring 2.436 /
2.281. The file header now says in its own words that two engines running the same JavaScript
agreeing to three decimals is not a finding.

### 0.3 THE RING SCALAR — paint REFUSES the tin's pin (registry §2.4), and here is the number

Registry §2.4: `--peer-ring-l` is PAL-WALK's 0.32 / 0.79 **until PAL-TIN PAINTS a reading under
3.10 at those values**. So §1b re-shoots the same two pixels with the ten ring arms overridden to
WALK's lightness (`instruments/ring-p4.mjs` prints those hexes; the spec carries them as
`WALK_RING`):

```
                       TIN's pin (0.295/0.775)      WALK's scalar (0.32/0.79)
light  chromium                 3.336                        3.187
light  webkit                   3.306                        3.189
dark   chromium                 3.564                        3.750
dark   webkit                   3.614                        3.759
```

**3.187 is not under 3.10. The condition is not met, and the tin's divergence loses on its own
chosen instrument.** This is the MOVED row the charter asked for: `--peer-ring-l` 0.295/0.775 is
withdrawn as a second scalar, the section ships WALK's 0.32 / 0.79.

NOT LANDED HERE, and the reason is a number the fold must see: at 0.32 the ARITHMETIC worst
(`ring-p4.mjs`, green) is **exactly 3.000** against the gate's own 3.0 floor — zero headroom, and
`peer-tin.spec.ts` §1 asserts `>= 3.0` on that composite. Landing WALK's scalar puts a CI row on
a rounding. The honest fold is: take WALK's scalar AND move §1's floor to the sampled row
(§1b, 3.187), or keep §1 and drop its assertion to a REPORT. That is a chair call, not a lane's,
and both numbers are above.

### 0.4 THE §6.6 ANSWER, with painted numbers (the leader's duty)

`join-language-prm.spec.ts:153` stays at 0.55 and is untouched.

| candidate | the RING ARMS (what the tin ships) | the DIGIT ink alone (no ring arm) |
|---|---|---|
| **0.55** | SURVIVES — sampled 3.336 / 3.564 (composited 3.134 / 3.146) | 2.436 / 2.281 — under the floor, both arms |
| 0.65 | survives (strictly above 0.55's reading) | 3.005 / 2.757 — light only |
| 0.80 | survives | 4.210 / 3.632 |

The palette survives §6's candidate list at **0.55**, the ruled alpha, *because of the ring arms*.
Without them it survives none below 0.80. That is the whole case for ten declarations.

### 0.5 GATE 4 — ONE PUBLISHER, the section's leader duty (registry §2.4)

```
GATE 4  ONE PUBLISHER + THE SCALAR: GREEN · scalar 0.295 light / 0.775 dark, every ring arm
        within 0.005 of it · 205 source files read, 0 band literals found, 0 tin hexes spelled in code
```

4a is the CI-reachable comparer: every `.ts`/`.vue` under `src/` is read, a tin hex spelled in
code is RED, and any `*_BANDS` / `*_L` literal in a file that mentions the peers is READ and
compared to the published scalar rather than trusted. WALK's `DIGIT_BANDS`/`RING_BANDS` are not
on this tree; the gate is the thing that would catch them at the fold.

4b is the ABLATION in an authored table's own terms. WALK's critic moved `--peer-ring-l`
0.32 → 0.20 at runtime and watched painted hue drift 18.258°; a tin cannot drift that way,
because nothing computes from the scalar. What a tin CAN do is let the scalar and the table part
company **at rest**, one hand editing the hexes and another the sentence that describes them, and
nothing on the surface would say so. 4b holds every ring arm's OKLab L within 0.005 of its arm's
declared `--peer-ring-l` (worst measured drift today 0.0015, the 8-bit round trip).

Two new negative controls, both RED:

| control | gate | result |
|---|---|---|
| `--peer-ring-l` moved 0.295 → 0.20, the table left where it was | 4b | **RED** on all five light arms (off by 0.0936–0.0958) |
| a planted source file spelling `#4b1d00` | 4a | **RED** — "one publisher, and it is the sheet" |

Eight controls now, all RED, `--self-test` exit 0.

### 0.6 The tape, the assertion it never had — and W2 §2.5 priced

`peer-tin.spec.ts` §4b is new and RUN: the tape over a shared-stick author carries **1**
`.roster-tick`; over an unshared author, **0**. Both engines.

The widening (charter row 9) is measured with the SAME TAPE as its own control — the tick
hidden, the slug, font and anchor unchanged — because the first reading (two authors, two slug
lengths) gave 62.35 px and was confounded. Both readings are reported; only the second is
claimed.

```
ABLATION  chromium  tape 186.78 → 145.19 px   Δ 41.59   tick 36.20 × 16.45 px   margin-inline-start 5.60 px (em 16)
          webkit    tape 182.79 → 141.19 px   Δ 41.60   tick 36.40 × 16.91 px   margin-inline-start 5.59 px
          cells the painted box crosses:  3 → 3 (chromium) · 2 → 2 (webkit)  — the tally moves the COUNT by ZERO
CONFOUNDED, reported not claimed:  186.78 vs 86.80 (chromium), 182.79 vs 151.85 (webkit)
```

**And the row the tin did not create and has not cured: the tape crosses 2–3 INTERACTIVE cells in
BOTH arms.** W2 §2.5 says a tape never covers an interactive element. That is the fold's surface
(the tape's anchor geometry, `GameBoard.vue:1098`), it is RED with or without a tally, and the
tin widens the paper by 41.6 px without moving the count in the measured pose. Escalated to the
chair as an estate row, with its numbers.

### 0.7 The killing number, re-read on a LIVE cell (pass-3 gap 1, the lane's own)

```
9x9 desk    cell 70.66 px · ink box 33.62 px · ghost inset 7.84–7.89 · ghost stroke 5 · grid stroke 12
            → free band under the digit  2.55 px chromium · 2.60 px webkit      (research said 2.67)
16x16 phone cell 22.63 px · ink box 9.82–12.54 px
            → free band under the digit −4.54 px chromium · −6.01 px webkit     NEGATIVE, both engines
```

The number that killed the in-cell tally is now a SURFACE reading and it holds: the research's
2.67 px was optimistic by 0.07–0.12 px, and every 16×16 arm is negative. The mark is gone and
`DigitCell.vue` is byte-identical to `74a2b5d9`.

### 0.8 Phone width, coarse, witnessed

```
REGIME  {"coarse":true,"hover":false,"w":390,"h":844} · page 2 of the same context coarse true
PHONE   you-pill x  five 356.828125 → seven 356.828125   Δ 0.000   both engines
        row children of the first five rows: identical string-for-string, five vs seven
        roster ticks at seven: 2
```

The drawer is OPENED through `.drawer-tab` and the sheet's ~700 ms slide is waited out before
anything is read.

### 0.9 The filter census, at NINE

Twenty-five nodes carry a computed filter in a nine-player room with four ticks mounted. Twelve
are `.baked-hidden` pre-rasters (8 `svg.rest-pose`, 4 `g.boil-frame-layer`) and four are
`g.logo-pose-parked` — the grain hoist's opacity-swap steady state, which the estate's own census
excludes. **The LIVE population is exactly 9**: `g` ×2, both `svg.toggle-icon`, `g.boil-pose`
×4 (one active), `svg.sparkle-icon`. The tally mounts none, being a frozen pose with no filter.

My first census counted the baked layers and printed 25; the definition was mine and wrong, and
the derivation above is shown rather than the number re-run.

### 0.10 F1's two arms, BUILDABLE behind one switch (chair §6.8/§6.10)

`useSession.ts`'s `selfTakesAStick()` reads `?selfink=0`. Default = the tin includes you.

```
YES (default)     your own digit strokes rgb(133, 57, 0)  = --color-peer-1 light (amber)
NO  (?selfink=0)  your own digit strokes rgb(37, 99, 235) = the house blue, peers unchanged
```

Both framed (§9, frames iii and iv). The owner disposes; nothing folds before the re-look.

### 0.11 R6 / r0, re-run against the CURRENT probe

| row | prototype | control `74a2b5d9` | disposition |
|---|---|---|---|
| **L6** | **RED** (`golden-angle walk: false; --peer-ink-l arms: 0`) | GREEN | **MOVED** — re-cut PROPOSED at `instruments/law-probe-L6.diff`; applied it reads **GREEN** (`readings/law-probe-L6-recut-applied.txt`). Folds under PAL-WALK's L6 row per chair §1.3. |
| **L3** | **GREEN** | **GREEN** | Pass 3's estate row is **RETIRED** — the chair's act 1 landed CTRL-COST's ADMITTED-as-ceiling hunk and L3 now reads GREEN GREEN on both trees. Nothing owed. |
| L1, L2, L4, L5 | GREEN | GREEN | untouched |
| R1, R2, R3 | RED | RED | born-RED, not this family's |

The hue census's tail still prints the golden-angle walk (`readings/hue-census-prototype-p4.csv`)
and travels with L6's re-cut; r0 is frozen and nothing there was edited.

---

## 1 · What was actually changed this pass

- `src/pencil/glyph/PlayerTick.vue` — MOVED from `src/games/shared/`; both importers re-pointed.
  The estate's boundary rule is satisfied by filing, not by argument.
- `e2e/peer-tin.spec.ts` — the PRM route lands (`emulateMedia` in `boot`); §1 renamed to what it
  measures; **§1b sampled-ring row NEW** with its ring-off control and the WALK-scalar arm; §4b
  **tape row NEW**; `rowsFive` **ASSERTED** (`toEqual`) instead of logged; `.glyph-tick` retitled
  `TRIPWIRE:` with the reason in the header; forced colours **ASSERTED** against a CanvasText
  probe with a REAL un-widened control (every other shipped `path`, not `.player-swatch`'s
  background). ~200 lines of PNG decode + WCAG-on-pixels, written out rather than a dependency.
- `scripts/check-peer-tin.mjs` — **GATE 4** and its two controls; header re-cut to six gates and
  eight controls.
- `src/games/shared/useSession.ts` — `selfTakesAStick()`, F1's switch.
- `e2e/node.d.ts` — one module declaration, `node:zlib`'s `inflateSync`.
- prettier over the three files the critic named.

**Nothing else moved. No token value changed, no rule, no pixel of the product.**

---

## 2 · Frames (4, all ≤150 KB; 116.8 KB total) — every one a REPLACEMENT

| file | KB | engine · theme · viewport · pointer | retires |
|---|---|---|---|
| `roster-seven-tallies-light.png` | 10.6 | chromium · light · 1280×1600 · FINE | `pass3/…/roster-seven-light.png` |
| `tape-tick-dark.png` | 18.0 | chromium · dark · 1280×800 · FINE (hover) | `pass3/…/tape-shared-stick-dark.png` |
| `f1-yes-self-takes-a-stick-light.png` | 44.8 | chromium · light · 1280×800 · FINE | `pass3/…/ring-dark.png` |
| `f1-no-self-in-house-ink-light.png` | 43.4 | chromium · light · 1280×800 · FINE | `pass3/…/amber-beside-amber-light.png` (the duplicate) |

Frame i is the pass-3 crop's cure and its limit both: the roster is scrolled to its own bottom,
`passive-scallop |` carries its tick fully legible against its word — and the LAST row is still
dimmed by the scroller's edge. See §3 gap 8: the `max-height: 7.5rem` window is ~5.5 rows, so the
two ambers of a lapped tin are never co-visible past six players and the brief's
"amber-beside-amber" frame cannot be taken at seven. The pair is a number, not a picture.

Frames iii and iv are the section's FORK for the owner in one pair: the same board, the same two
peers, your own digit amber and then blue.

---

## 3 · GAPS — every one, including the hard part

1. **π against the `74a2b5d9` control was NOT re-run this pass, at any width.** Carried: the
   pass-3 critic's 0.00 px over every settled roster child at 1280, both engines. The phone-width
   π above is five-vs-seven WITHIN this tree, which is a different claim. The control server ran
   and was hash-verified; the sweep did not happen. **The largest open row.**
2. **The goldens were NOT run on this tree.** The critic ran 4/4 off a built dist at pass 3,
   BEFORE this pass's moves. Nothing here changes a product paint — a folder move, a spec, a gate,
   a query switch — but "nothing changes a paint" is an argument, and a golden move is a STOP
   (chair §6.4). Unproven on this tree.
3. **The dist was not rebuilt**, so the built-dist filter census and the `data-vite-dev-id` 0
   reading are the critic's pass-3 numbers, carried.
4. **The census at SIXTEEN is still unrun.** The roster converges ONE SHORT from nine pages up in
   a single BroadcastChannel context on this box: 9→8, 10→9, 12→11, 16→15, each inside a 90 s
   poll. Nine is the measured width. The n−1 shape is consistent enough to be worth the chair's
   eye — the `hi` beat is answered by every peer, which is O(n²) — and it is NOT this family's.
5. **`.glyph-tick 0` is relabelled, not re-cut.** Registry §2.10 names it; the spec's header and
   its test title now say TRIPWIRE and say why (the class exists nowhere in the estate, so the
   assertion is `0 === 0` until a hand re-mints it; its born-RED control is the pass-2 worktree,
   which CI never sees). It should be STRUCK from the convergence count, not counted as cured.
6. **The tape ablation is ONE pose** — one cell, one slug, desk width, hover. The Δ is the mark's
   own 41.6 px in both engines and the crossed-cell count did not move, but that is one hover and
   not a sweep of the board.
7. **W2 §2.5 is RED on the estate and the tin did not cure it** (§0.6). Reported, escalated,
   untouched — the tape's anchor is the fold's surface.
8. **The roster's 7.5rem window** (§2) means the family's "two ambers, told apart" is not
   frameable past six players. A real finding about the mark's legibility, not a crop problem.
9. **The ring scalar is not landed** (§0.3). The section still carries two scalars until the fold
   rules; the fold needs the "0.32 leaves the arithmetic row zero headroom" number, which is why
   this lane refused to land its own defeat silently.
10. **4b's ablation is on TEXT, not runtime.** A tin cannot drift at runtime. Stated, not hidden.
11. **`e2e/node.d.ts` was touched and no plan step names it** — one module declaration, in that
    file's own stated discipline ("declare what you touch"). Named here because pass 3 was
    caught the same way with `HandDrawnGrid.vue`.
12. **The PNG decoder is ~60 new lines in a spec and nothing tests the decoder itself.** It
    refuses a bit depth or filter it was not written for (`INSTRUMENT BROKEN`), and the rows that
    use it carry their own ring-off control, so a decode error cannot pass as a colour — but the
    decoder has no test of its own.
13. **The relay arm and a real device are untested** (W8 §8.3's, correctly deferred).
14. **AA, ΔE and the hue rows were not re-derived** — they are pass 3's, confirmed by the critic
    on a second hand, and nothing this pass moved a token.

---

## 4 · Incidents, self-declared

- **The main tree was not touched.** `git status --porcelain -- web/frontend .github scripts` is
  EMPTY at return. Pass 3's near-miss did not recur.
- **The first tape reading was CONFOUNDED** by slug length (62.35 px between two different
  authors) and I published it as a delta for about a minute before replacing it with the
  same-tape ablation (41.59 / 41.60). Both readings are in §0.6; only the second is claimed.
- **The first filter census was mine and wrong** — it counted `.baked-hidden` pre-rasters and read
  25. The estate's definition gives exactly 9 from the same list (§0.9). The derivation is shown.
- **Frame i was re-shot three times** (clipped rows, then faded rows, then scrolled) and the
  scroller's own edge fade still dims the last row. Not hidden; §2 and gap 8 say so.
- **`lint:motion` was RED on the critic's own suggested cure.** `PRM: frozen` with no
  `emulateMedia` fails rule 3 ROUTE. The route was landed rather than the wording bent — nothing
  was re-worded to pass.
- **Two probe runs failed on the roster ceiling** (16 players → 15, 12 → 11, 10 → 9), costing
  ~10 minutes of wall clock. Banked as gap 4 rather than retried into a green.
- **knip flagged the two scratch specs** while they existed. Both deleted; `knip` exit 0 at
  return. `git status` in the work tree at return is product files only.

---

## 5 · Files

Product, this pass: `e2e/peer-tin.spec.ts` · `e2e/node.d.ts` · `scripts/check-peer-tin.mjs` ·
`src/games/shared/useSession.ts` · `src/games/shared/GameControlPanel.vue` ·
`src/pencil/sheet/SheetWashiLabel.vue` · `src/pencil/glyph/PlayerTick.vue` (moved).
Carried from pass 3: `src/assets/index.css` · `playerIdentity.ts` · `useGameState.ts` ·
`GameBoard.vue` · `BoardHost.vue` · `DifficultyTally.vue` · `HandDrawnGrid.vue` ·
`pencilConfig.ts` · `package.json` · `.github/workflows/ci.yml` · four test files.

Evidence here: `instruments/` (`ring-p4.mjs` with the WALK-scalar addendum ·
`check-peer-tin-at-head.mjs` · `law-probe-prototype.mjs` / `law-probe-control-74a2b5d9.mjs` ·
`law-probe-L6.diff` · `hue-census-repointed.mjs` · `gamecell-fallback-to-MRK-LIVE.diff`),
`readings/`, `logs/`, `probe/` (the deleted scratch configs and specs, banked).

`instruments/gamecell-fallback-to-MRK-LIVE.diff` is charter row 5: the two
`var(--color-peer-cursor-ink, var(--color-user-ink))` fallbacks struck, with the born-RED
publisher-deletion row and the 3.34 → 2.44 number the fallback hides. **PROPOSED, not landed** —
`gameCell.css` is §10's file (§6.7).
