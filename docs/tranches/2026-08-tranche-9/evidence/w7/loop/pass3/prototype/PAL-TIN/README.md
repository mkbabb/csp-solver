# PAL-TIN — pass-3 PROTOTYPE, and it runs

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2`,
branch `worktree-wf_308fa864-c94-2`, cut from `74a2b5d9`. Nothing committed; the diff IS the
prototype: a diff of **18 files changed, 591 insertions, 83 deletions**, plus three new untracked
files (`e2e/peer-tin.spec.ts`, `scripts/check-peer-tin.mjs`, `src/games/shared/PlayerTick.vue`).
Three scratch files were removed at return and are banked in `probe/`.
Servers: prototype `127.0.0.1:4245`, HEAD control (`74a2b5d9`) `127.0.0.1:4246`, both
`--strictPort`, both with a private `cacheDir` under the session scratchpad, both KILLED — 4245
and 4246 read empty at return. Two ports in the band are still listening and are NOT this lane's:
4244 and 4247 belong to the concurrent sibling worktree `wf_308fa864-c94-1`, left alone.

## 0 · What the replay carried, and by which route

`git -C <pass-2 worktree>` is REFUSED by this lane's isolation (the chair's §"The base moved"
anticipated it). Route taken instead, and it is a true 3-way merge rather than a copy:

1. the pass-2 branch resolved from my own object store — `refs/heads/worktree-wf_8630d340-e56-58`
   = `a8fee1f5`, the base the chair names;
2. `git archive a8fee1f5 web/frontend .github | tar -x` into the scratchpad = the BASE tree;
3. `diff -rq BASE <pass-2 worktree>` = the pass-2 delta's file list — **19 M + 2 new**
   (the brief said 18 M + 2; the nineteenth is `gameCell.css`, which the brief tells this lane
   to drop, so 18 is the number that was meant to land and 18 is what landed);
4. `git merge-file -L fold -L base -L pass2 <my file> <base file> <pass-2 file>` per file,
   which is exactly the 3-way the brief asked for.

**Every one of the eighteen merged at exit 0 — ZERO conflicts**, including the three the chair
flagged as the fold's (`GameControlPanel.vue`, `DigitCell.vue`, `BoardHost.vue`): pass 2's
hunks in those files sit away from `74a2b5d9`'s twelve picks. `gameCell.css` dropped per §3.
`vue-tsc --noEmit` exit 0 immediately after the replay (pass 2's own replay was RED here; the
fold's `useSession.ts` no longer names its identity imports one at a time).

## 1 · The gate — `node scripts/check-peer-tin.mjs`, bare

```
tin: 5 sticks × 2 arms · 19 reserved inks resolved per arm (9 paint in a cell)
GATE 1a  THE FAMILY LAW               GREEN · nearest anchor 13.57°        (floor 12)
GATE 1b  THE READER'S LAW             GREEN · worst ΔE to a CELL ink 0.082 · ceiling ΔE 0.103
                                            at ≥40°, AA ≥4.5 (37.5/100.5/211.5/285.5/325.5)
                                            · score 0.80                    (floors 0.075 / 0.75)
GATE 2   THE SEPARATION LAW           GREEN · worst pair ΔE 0.116          (floor 0.10)
GATE 3   ANCHOR + THE WHOLE TIN       GREEN · light 5 sticks + 5 rings · dark 5 sticks + 5 rings
GATE 3b  THE SAME PENCIL              GREEN · worst |Δh| 0.879°            (cap 1°)
EXIT 0
```

The brief expected 1a "≥ 13.7°"; the instrument reads **13.57°**. It is the same sticks and the
same resolved reserved set pass 2 shipped — 13.7 is a transcription, 13.57 is the reading, and
the floor is 12 either way. Reported rather than rounded.

`--self-test` exit 0 with **SIX** negative controls RED, not four: the two new laws needed
their own, because "a gate that cannot be shown failing is not a gate" is this file's own rule.

| control | gate | result |
|---|---|---|
| peer-3 light moved to `--color-user-ink`'s hue + 6° | 1a | RED |
| peer-4 dark cut to ΔE 0.02 of `--color-solver-ink-2` | 1b | RED |
| a sixth stick 0.002 off amber, both arms | 2 | RED |
| peer-2 dark replaced by `--color-crayon-blue`'s literal | 3 | RED |
| **`--color-peer-3-ring` DELETED from the light arm** | 3 (whole tin) | RED |
| **peer-1's light ring arm swung 4° off its stick** | 3b | RED |

Honest impurity: the 1a / 1b / 3 controls move a STICK and leave its ring where it was, so they
also red 3b as collateral. Each control still reds the gate it is named for, which is what the
self-test asserts.

Against `74a2b5d9`'s `index.css`: **exit 2**, `INSTRUMENT BROKEN: 0 light sticks and 0 dark` —
born-RED at HEAD. `package.json` carries `lint:tin`; `.github/workflows/ci.yml` carries the step
beside `lint:ink` (`:942-944`'s shape — comment block, name, working-directory, run).

## 2 · The ring arms, priced then painted

`probe/ring.mjs` (this lane's, zero-dependency) swept `--peer-ring-l` in 0.005 steps and PINNED
the lightest light / darkest dark clearing 3.0 PAINTED with ≥0.10 headroom. PAL-WALK's scalar is
reported beside the pin, because the graft is the point:

| arm | walk's scalar | worst painted there | PINNED | worst painted at the pin |
|---|---|---|---|---|
| light | 0.32 | **3.000** — exactly the floor, zero headroom | **0.295** | 3.135 (green) |
| dark | 0.79 | 3.288 | **0.775** | 3.145 (pink) |

The walk's own light value fails the headroom rule by construction, which is why the tin does
not simply inherit it. Ten declarations landed; teal's ring chroma is **0.050 light / 0.132
dark** — the stick that pays most, as the spec predicted, and it still clears (3.170 / 3.462).

**PAINTED on the engines' bytes**, `e2e/peer-tin.spec.ts`, chromium AND webkit, identical to
three decimals:

```
RING light  peer-1 3.266 · peer-2 3.134 · peer-3 3.170 · peer-4 3.703 · peer-5 3.565
            worst 3.134 | the DIGIT ink in the same ring 2.436          (floor 3.0)
RING dark   peer-1 3.263 · peer-2 3.467 · peer-3 3.460 · peer-4 3.334 · peer-5 3.146
            worst 3.146 | the DIGIT ink in the same ring 2.281
on --color-popover: 3.143…3.711 light · 3.138…3.459 dark   (REPORTED, never below the bg row)
```

The row asserts BOTH directions: the arms clear 3.0 and the digit ink does not. The §6.6 answer,
restated from the same probe: on opacity alone the digit ink needs 0.80 (4.210 / 3.632); 0.65
clears the light arm only (3.005 / 2.757). Stated, not built — `gameCell.css` is untouched.

**α read off the cascade**, live peer cursor, dark, 7-player room:
`stroke rgb(255, 151, 94)` = `#ff975e` = `--color-peer-1-ring` dark · `stroke-opacity 0.55` ·
`stroke-width 4px` · `fill` the same colour at `fill-opacity 0.04`. `join-language-prm.spec.ts:153`
reads that same 0.55 and is untouched.

## 3 · AA, on engine bytes, four grounds

```
LIGHT  worst over background / card / popover  7.151      (floor 4.5)   GREEN
DARK   worst over background / card / popover  5.178      (floor 4.5)   GREEN
REPORTED  the attribution tape   light 6.511 (HEAD's own blue 4.514)
                                 dark  2.977 (HEAD's own blue 4.231)   ← estate row, both fail
REPORTED  the hint laminate      light 5.789 · dark 4.397 (blue 6.249)  ← estate row
```

Both engines identical. The tape at night is the tin's worst reading anywhere and HEAD fails the
same ground with its own ink — an estate LEDGER candidate either way, with the cure PROPOSED and
not landed (`instruments/`, §7).

TRAP banked for the next lane: both engines serialise `--sheet-washi-neutral`'s `color-mix` as
`color(srgb r g b / a)` with 0–1 channels. Read as bytes the tape's paper comes out near-black
and the whole reading INVERTS — 1.626 light where the paper reads 6.511. Measured, then cured in
the spec, with the cure's reason on the line.

## 4 · Zero in-cell marks, and the number that killed them

`.glyph-tick` count **0** on all 7 pages of a 7-player room, chromium and webkit. It is 0 by
construction: `PlayerTick.vue` has one mode, `DigitCell.vue` is byte-identical to `74a2b5d9`
(the `:author-ticks` prop, `.glyph-tick`, the corner geometry and the `boardSize` stroke law are
all gone with the pass-2 hunk), and `BoardHost.vue` no longer passes the prop. A revert reds.

The killing number is the pass-3 research's, re-derived in `probe/ring.mjs`'s sibling table and
NOT re-measured on the surface — that is this lane's first gap (§8).

## 5 · The two homes, at seven, both engines

```
roster rows 7 · swatch colours 5 · .roster-tick 2 · .player-name .roster-tick 2
gap (tick left − slug text right): 0.349 em chromium · 0.348 em webkit      (cap 0.4 em)
tick height 14.05 px on an 18.95 px desk row · 12.17 px on a phone row       (= 1 em)
`you` pill x  five players 1104.891 → seven players 1104.891  (chromium, Δ 0.000)
              five players 1104.922 → seven players 1104.922  (webkit,   Δ 0.000)
row children at five  swatch 853.89/11.19 · name 871.47/227.03 · you 1104.89/17.22
```

The pill does not move because `.player-name { flex: 1 1 auto }` (the B1b fold, `:1786`) is
UNTOUCHED and the tally lives INSIDE the name. Pass 2's `0 1 auto` and its 156 px are gone.

**The tape**, dark, over a digit whose author shares a stick: `text="loyal-roadrunner"`,
`.roster-tick` count **1**. Over an unshared one the tape mounts no tick at all, because
`authorLap` holds no entry below the sixth player.

**Painted stroke 1.5 px** at the desk row AND the phone row, both engines — exactly, not within
a tolerance, because the stroke is `vector-effect: non-scaling-stroke`. An authored width would
have painted 2.02 px desk / 1.71 px phone (`ifScaled` is printed beside it). This is a pass-3
CORRECTION found on the surface: pass 2's `stroke-width: 2.3` measured 2.019 px, outside the
brief's 1.5 ± 0.2.

**A second surface defect the frames caught**: Tailwind's preflight puts every `svg` at
`display: block`, which dropped the tally onto a line of its OWN at the start of the name box —
the mark sat 61 px LEFT of the word it belongs to, both engines, `gapEm −4.19`. `display:
inline-block` cures it; the reason is on the rule.

## 6 · Print, forced colours, solo, and the censuses

```
print   .roster-tick path stroke  rgb(0, 0, 0)     through index.css:926's widened pair
forced  .roster-tick path stroke  rgb(0, 0, 0)     (Playwright's forced-colors surface)
control .player-swatch backgroundColor rgb(133, 57, 0) = #853900 = --color-peer-1 light
        — the un-widened selector keeps the player's ink, which is what names the rule
solo    .roster-tick 0 · .glyph-tick 0 · cells carrying an INK BINDING 0
        (61 cells carry SOME inline style — the ghost path's own geometry, the estate's, not
        the tin's; counting those was this lane's own first mis-probe and it is named here)
filter census, 8-player room, 3 ticks mounted:  EXACTLY 9
        g. · g. · svg.toggle-icon.toggle-sun · svg.toggle-icon.toggle-moon · g.boil-pose ×3 ·
        g.boil-pose.is-active · svg.sparkle-icon        — the tally adds none, being a frozen
        pose with no live filter at all
roster ticks at 8 players: 3 (indices 5, 6, 7 — one lap each)
dev-wire probe  style[data-vite-dev-id*=PlayerTick]: 1 in DEV (the preview half unproven — §8)
vitest  68 files / 836 tests PASS (exit 0)          vue-tsc --noEmit exit 0
knip    clean (no consumer-less TIN export)
check-copy-register  0 dashes · 0 unadmitted jargon · lexicon 25 · exit 0   (no copy minted)
--peer-ink-l  0 references anywhere in src, e2e, scripts
```

## 7 · r0 rows, re-run and MOVED

Both r0 instruments were COPIED into `instruments/` and re-pointed at this tree; r0 itself is
untouched.

- **R6 L6 → MOVED.** `law-probe.mjs` re-pointed reads `L6 GREEN → RED` on the prototype
  (`golden-angle walk: false; --peer-ink-l arms: 0`) and `L6 GREEN → GREEN` on the `74a2b5d9`
  control. The re-cut row is PROPOSED as a diff (`instruments/law-probe-L6.diff`), folds into
  PAL-WALK's L6 row, and reads GREEN here when applied (`sticks 10; ring arms 10; lint:tin
  present: true`). Law 21 re-cites `index.css:153-162`; law 22's formula half is ballot B-TIN-1;
  law 23 knowingly excepted.
- **NOT THIS FAMILY'S, and reported because unreported is a gap**: the same probe reads
  `L3 RED` on BOTH trees — the prototype's and `74a2b5d9`'s. `check-copy-register.mjs` itself
  exits 0 here with 0 dashes and 0 unadmitted jargon, so L3's own regex has drifted from the
  gate since the copy gate's discovery grammar was re-cut (`5f8e1a7b`…`4b3b19b3`). An estate
  row for the chair.
- **hue-census re-cut**: re-pointed and run (`readings/hue-census-prototype.csv`). It prints the
  named-token census and then a hard-coded "player walk … i × 137.5°" tail that no longer
  describes this estate — the tail is the part that must move with L6, and the re-cut is in the
  same proposed diff rather than applied here.
- **The tape cure, PROPOSED and not landed** (`instruments/`): the label in `--color-foreground`
  with the stick as a 2 px rule under the slug — text AA by construction, the stick a non-text
  boundary at 3:1. The fold's 3C-4 owns that surface.

## 8 · Gaps, every one of them

1. **The killing number was not re-read on the surface.** The 2.67 px / negative-at-16×16 band
   is the research's arithmetic, carried. I did not measure an ink box on a live cell this pass.
   The design does not depend on it being re-measured — nothing is drawn there — but the brief
   asked and the answer is "not done".
2. **The goldens were not run.** `visual-golden` needs a built dist and the build did not fit
   the batch after the two surface corrections. Twenty moved declarations plus a roster row that
   now carries an inline SVG: a golden move is a STOP by chair §6.4, and this lane has not
   proven there is none. **The single largest open risk.**
3. **π against the HEAD control was not run.** The control server ran on 4246 and served, and
   the `you`-pill and row-children readings are π-shaped, but a rect-by-rect sweep of an
   unclaimed surface against `74a2b5d9` did not happen.
4. **The filter census ran at EIGHT players, not sixteen.** Sixteen pages in one context did
   not reach a 16-row roster inside a 60 s poll (`toHaveCount` timeout — a rig limit, not a
   product one). Eight players with three ticks mounted reads exactly 9, and the tally mounts no
   filter at all, so the shape of the claim is proven and its stated width is not.
5. **Wobble σ and accent-kinship were not run.** The dev-style probe WAS read: 1 tag in dev.
   Its other half (0 in a built preview) needs the build that gap 2 also needs.
6. **`e2e/peer-tin.spec.ts` does not yet carry the ROW-CHILDREN π assertion at ≤5 players.** It
   PRINTS them and asserts only the `you` pill. The no-move guard is half-built.
7. **The relay arm and a real device are untested** (as the spec says; W8 §8.3 owns the phone).
8. **`authorLap` changed shape** from `Record<string, number>` to `Record<string, {lap, seed}>`
   and the dead `GameModel.authorLap` field + its `useGameState` pass-through were DELETED —
   the cell tick was its only consumer. The spec's plan did not say to delete it; deleting a
   field nothing reads is the parsimonious reading of the same plan, and it is named here
   because it is a departure from the letter.
9. **The seed moved onto `Player`** (`Player.seed`) rather than being recomputed at each
   consumer. `playerIdentity` is a LAZY import — a module-scope computed cannot reach for it —
   so `seedFor(p.id)` at the two homes was not buildable as written. Same value, one place.
10. **`ci.yml` was momentarily edited on the MAIN tree by mistake** (a `cd` to the repo root).
    Caught immediately, reverted, and the main tree's file verified byte-for-byte identical to
    `HEAD:.github/workflows/ci.yml` before the worktree copy was edited. Reported because a
    silent near-miss on the frozen tree is exactly the kind of thing a return must carry.

## 9 · Crops (4, all ≤150 KB; 215 KB total)

| file | KB | what it is for |
|---|---|---|
| `roster-seven-light.png` | 12.5 | the roster at seven, light — two ticks against their words, the `you` pill where five players left it |
| `tape-shared-stick-dark.png` | 97 | the attribution tape over a shared-stick digit, dark — the reading beside it is **2.977** (HEAD's own blue 4.231) |
| `ring-dark.png` | 88 | a dark board with two sticks and the peer ring at the ring arm (`#ff975e`, α 0.55, width 4) |
| `amber-beside-amber-light.png` | 12.5 | the amber-beside-amber pair with the tape open, light |

## 10 · Files

Product: `src/assets/index.css` · `src/games/shared/playerIdentity.ts` · `useSession.ts` ·
`useGameState.ts` · `defineGame.ts` · `GameControlPanel.vue` · `GameBoard.vue` · `BoardHost.vue`
· `PlayerTick.vue` (new) · `src/pencil/sheet/SheetWashiLabel.vue` · `pencilConfig.ts` ·
`DifficultyTally.vue` · `HandDrawnGrid.vue` · `scripts/check-peer-tin.mjs` (new) ·
`package.json` · `.github/workflows/ci.yml`.
Tests: `e2e/peer-tin.spec.ts` (new) · `e2e/multiplayer.spec.ts` · `useSession.test.ts` ·
`posters.test.ts` · `PosterBoard.test.ts` · `useStagingBridge.test.ts`.
`DigitCell.vue` is byte-identical to `74a2b5d9` — the cell mark left no trace.
Scratch, removed at return, banked here: `vite.tin.config.ts`, `pw-tin.config.ts`,
`e2e/tin-frames.scratch.ts`.
