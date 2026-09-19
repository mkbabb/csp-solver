# PASS-3 PROTOTYPE · PLR-COUNT · The tally is the mark

RUNNING on the real surface, both engines. Worktree
`.claude/worktrees/wf_f72f3b5a-83a-52`, branch `worktree-wf_f72f3b5a-83a-52`, base `74a2b5d9`.
Prototype server 127.0.0.1:4242; HEAD control (the MAIN tree at `74a2b5d9`, read-only)
127.0.0.1:4230. Both killed before this return.

## 1 · The replay, and what it carried

`git -C <pass-2 worktree>` is REFUSED by this lane's isolation ("a worktree-isolated agent's git
operations must target its own worktree"), so the chair's declared fallback was taken: the
changed files were COPIED from `wf_8630d340-e56-53` and the strip list applied by hand. Copied:
`PlayerTally.vue`, `PlayerLobby.vue`, `useTallyStrokes.ts`, `pencilConfig.ts`,
`DifficultyTally.vue`, `e2e/player-tally.spec.ts`. None conflicted with the fold — the fold's
twelve picks touch `DigitCell`, `GameBoard`, `useGameCell`, `check-copy-register.mjs` and the
ballot copy, and this family's centre touches none of them.

**STRIPPED per §7.6, each named:** `check-copy-register.mjs` (the `COPY_SOURCES` arm whole — the
fold's own discovery grammar at `74a2b5d9` already finds `LOBBY_COPY` by name; `lint:copy` EXIT
0 with 0 admissions on this tree), `check-font-coverage.mjs`, `GameControlPanel.vue`'s roster
hunk (so `.player-row { color }` STAYS and gaps 1/2 close by not happening),
`useJoinWash.ts`, `join-language.spec.ts`, `join-language-prm.spec.ts`, `multiplayer.spec.ts`,
`liveRegions.test.ts`.

**CARRIED AS DECLARED SCAFFOLD, not this family's design.** PLR-SELF's pass-3 substrate does not
exist on disk — no sibling worktree in this batch holds `PlayerLobby.vue`/`PlayerTally.vue`, and
`pass3/prototype/PLR-SELF/` is absent — so the brief's "take the substrate from PLR-SELF's
worktree" had nothing to take. To keep a RUNNING surface these four hunks were replayed from
pass 2 and are marked SCAFFOLD in the source, to be deleted at the fold in favour of the
leader's: `App.vue`'s `#mark` mount, `AttributionCard.vue`'s `head-left-row` + slot,
`useHoverCard.ts`'s `claimHeadDisclosure`, `useSession.ts`'s `lastHeard`/`PRESENCE_QUIET_MS`.
The window-bound Escape in `PlayerTally.vue` is scaffold too, and says so at the site.

## 2 · What this pass changed in the centre

| # | change | why |
|---|---|---|
| 1 | `draws: Map<string, SequenceHandle>`, `reveal` keyed by the same string, `forget(keys)` | the crossing defect below |
| 2 | `ids` computed over `people.slice(0, TALLY_MAX)` — NOT over `drawn` | pass 2's set was EMPTY past the threshold, so the watch could not see a swap at six |
| 3 | `watch(ids, …)` diffs the SET: gone → `forget`, fresh → `drawIn`, else `settle` | a depart and an arrive in ONE tick left the count unmoved, the watch silent, and the newcomer wearing the departed person's reveal |
| 4 | `.pt-count` at `--type-heading` (25.888) | the ink floor, §4 |
| 5 | short regime: `min(N,2)` rows and NO foot | pass 2's two-row budget spent one row on the foot and named exactly ONE person from N=3 up |
| 6 | `min-width: var(--tap-floor, 2.75rem)` with both citations | gap 10; index.css:821-828 is the law, App.vue:982 (`.page-root`) is the declaration — the spec's "index.css:825" is the LAW's line, not the token's |
| 7 | `LOBBY_SAMPLES` deleted; `tall` and `tallyFrames` un-exported | knip EXIT 0 |
| 8 | SOLO behind one const, `SOLO_ARM: "keep" \| "gate-on-a-room"` | gap 5, U-10 |
| 9 | `@focusout` off the mark | `@pointerdown.prevent` means a press never took focus |
| 10 | `player-tally.spec.ts` in `SPEC_MANIFEST` + a per-row HOLDOUT for the webkit Tab row | check-pw-projects EXIT 0 |

## 3 · The gates, measured

| gate | reading | verdict |
|---|---|---|
| G1 runs | painted runs == N: 1/1, 3/3, 5/5 (`pixels.mjs`), 1 run at N=6 | GREEN (N=2/4 shot but not run through `pixels.mjs` — see gaps) |
| G2 stroke-contrast | worst stroke at 0.95 **4.537** light, **6.849** dark, on page AND sheet grounds | GREEN (floor 3:1) |
| G3 width | **44.00 · 44.00 · 51.66 · 62.28 · 72.92 · 44.00**, asserted to 0.02, both engines | GREEN |
| G5 filter census | the ESTATE's `filter-census.spec.ts`, **12/12 both engines**, with the tally on the page | GREEN |
| G7 one base | `1 player`…`16 players`; strokes 1/2/3/4/5/0; `6` ⊂ `6 players`; numeral 25.888 | GREEN |
| G8 bounds | tall phone sheet (0,44) 256×**173.75**, bottom 217.75 < board top **221.73** chromium / 221.42 webkit; short phone H **106.08**, `.pl-row` 2, `.pl-more` 0 | GREEN |
| G9 crossing | 6→5: dashoffset `0` on all five at every poll; a middle bye: 4 of 4 `d` byte-identical; **depart+arrive in one tick: exactly 1 of 4 strokes mid-draw, 3 of 4 `d` survive** | GREEN |
| G10 seam | press: `activeElement` stays `INPUT`, before AND after Escape | GREEN |
| G11 keys | Space opens, Escape closes, both engines off `el.focus()`; Tab reaches the mark at press **6** chromium, webkit SKIPPED loudly and declared per row | GREEN |
| G12 pre-game | `[data-player-mark]` count 0 at `?view=gallery` | GREEN |
| G13 tally-shared | **20 `.dt-pose .dt-stroke` `d` values byte-identical** to the HEAD control at `74a2b5d9` | GREEN (never run in pass 2) |
| G14 sheet-AA | ground `rgb(252,251,251)` / `rgb(18,16,15)`, no alpha; worst sheet word **5.159** light, **6.021** dark | GREEN |
| G16 ink-floor | **ink(6) 74.21 px² ≥ ink(1) 64.52 px²**, and the ABLATION: the same frame at the subheading rung reads **46.94**, which FAILS the floor | GREEN, with its own negative control |
| G17 solo-arm | arm A: one stroke, `rgb(38,38,38)` graphite, name `1 player`, register one row | GREEN on arm A |
| G18 knip · manifest | `npx knip` EXIT 0 · `check-pw-projects.mjs` EXIT 0, 8/8 checks, no restamp owed | GREEN |
| r0 I3 (MOVED) | candidates 1, box x 75.53 y 12, `[data-lobby]` count 2 and `:visible` count 1 after the press | GREEN through the proposed diff |
| π | **two boxes move, both +44.00 width, both PLAYING-only** (`.corner-left` desk, `.mobile-attribution` phone) — the mark's own tap floor. `.attribution-trigger`, `svg.handwritten-logo`, `.controls-card`, `.corner-right`, `.sudoku-cell`, `.game-card`: 0.00 on all four scenes; the DECK moves nothing | CLEAN |
| R6 hue census | r0's census copied and re-pointed: **byte-identical, `diff` exit 0** | GREEN |
| family law | min painted pairwise hue separation **13.3°** at N=3 and N=5, chromium | reproduces the handed-on number; PAL-WALK's |

vue-tsc EXIT 0 · vitest `src/games/shared` **34 files / 429 tests, 0 failures** · `lint:copy`
EXIT 0, 0 dashes, 0 unadmitted jargon, 0 admissions.

## 4 · The ink table (the owner's frame, U-10)

Coverage-weighted painted ink on the mark's own box, 390 coarse light, dpr 3, `ink-weight.mjs`:

| N | 1 | 2 | 3 | 4 | 5 | 6 (heading, shipped) | 6 (subheading, ablated) |
|---|---|---|---|---|---|---|---|
| px² | 64.52 | 105.86 | 151.24 | 215.80 | 278.83 | **74.21** | 46.94 |

The floor holds by 15.0%. **The swap is still not monotone**: six people paint 26.6% of what five
paint. The rung buys the mark back above its own smallest state and no further, and whether five
strokes giving way to one digit READS as more people is the owner's call. `frames/frame1-strip-390-coarse.png`
is that frame — N=1/3/5/6 on one line, with the ablated rung beneath it as the negative control.

These absolute figures do NOT reproduce pass 2's (309.28 / 839.01 / 1416.95 / 206.79). Pass 2's
instrument and crop are not this one's; what travels is the RATIO and the ablation, both measured
here in one run. Named as a gap rather than reconciled.

## 5 · Frames (4 cited, 236 KB total including the instrument strips)

1. `frames/frame1-strip-390-coarse.png` — the head at N=1/3/5/6 plus the ablated rung (U-10).
2. `frames/frame2-desk-register.png` — the register open over the board; the @mbabb card reads
   `opacity 0 / visibility hidden` in the same frame (`readings/frame2-card-state.json`).
3. `frames/frame3-phone664-N3.png` — 390×664 coarse, three people: two NAMED rows, no foot.
4. `frames/frame4-dark-N3.png` — 1280 dark, three people.

## 6 · Instruments

`instruments/` carries the two vite scratch configs, the PW config, `pixels.mjs` (PROMOTED with
one repair — see gaps), `ink-weight.mjs`, `aa.mjs`, `hue-census-repointed.mjs` (r0's, copied and
re-pointed at THIS worktree; r0 untouched), `compose-strip.mjs`, and the four probe specs
(`pi`, `i3-moved`, `aa-probe`, `rung-ablation`, `tally-census`). The probe specs live under
`web/frontend/.tally-instruments/` in the worktree, NOT under `e2e/` — a new file in `e2e/` is a
`SPEC_MANIFEST` row and a floor-band move, and these are instruments, not estate specs.
