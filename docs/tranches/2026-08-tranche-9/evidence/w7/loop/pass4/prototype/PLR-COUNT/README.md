# PLR-COUNT · pass 4 (PROTOTYPE) — the tally of everyone, seated on the leader's substrate

T9-W7 §11. RUNNING on the real surface, both engines. Nothing committed. U-10: this proposes.

| | |
|---|---|
| work tree | `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52`, base **`74a2b5d9`** |
| lane server | dev `127.0.0.1:4242`, private cacheDir `<work>/.vite-cache-plr-count`, **killed by PID** (npm 18136 / node 18258) |
| HEAD control | `127.0.0.1:4230`, `w7-control` dist, verified by **`index-CubiZsMVSwTc.js`**, **killed by PID** (18137 / 18257) |
| this tree's dist | built with `<work>/.vite-cache-plr-count-build`, identity **`index-DNEPsusRQXVl.js`**, 43 files, served on `:4231`, **killed by PID** (twice: 52679/52724, 68528/68583) |
| one board | every π / dist / arms row loads `?board=ATMuNTMwMDcw…MDc5` — the app's codec, `toBase64Url("\x01" + "3." + "530070000600195000098000060800060003400803001700020006060000280000419005000080079")`; cell 0 reads `5` on both arms in every π scene |
| frames | 4 crops, 64,223 B, each a REPLACEMENT (§7) |

## 0 · Gaps first

1. **The swap is not monotone, and cannot be inside a 36 px head** (charter 4). Shipped here at `--type-title`, six people paint **84.96** px² against five people's **230.73** (chromium light), **36.8 %**; dark 118.77 vs 273.89, **43.4 %**. The rung that would match five strokes is about 2.1× the heading's size (ink scales with size²), roughly 54 px. The head can't hold it. **The owner's (ballot B-COUNT-1, §6).**
2. **G16 was RED under an honest instrument, and pass 3's green was an artefact.** Pass 3's `ink-weight.mjs` normalised every crop by its own darkest pixel, so a pale digit and a graphite stroke both scored full ink. Re-cut with ONE normaliser per run (§3). At pass 3's heading rung the room-inked `6` paints **53.67 / 53.17** against one graphite stroke's **60.42–62.73** in light, both engines. That's **RED**. The cure is §2 row 3. G16 is still an instrument, not an estate row: no CI surface fails if the rung drops back.
3. **`check-pw-projects` EXIT 1, check 8 (FLOOR BAND) only.** Live 261 chromium / 258 webkit vs floors 214 / 212. The script's own law says the restamp is WGATE's (`--restamp` "WGATE only"). The dry run is banked at `logs/pw-restamp-dry.log`: 214→234, 212→232. Not restamped here. Checks 1–7 are green, including check 6 now that `player-mark.spec.ts` is in the manifest (§2 row 5).
4. **An unreproduced room collapse (INCIDENT 2).** In one census run (`logs/census-both-2.log`, strips only) the light strip read **N=5 as a solo graphite stroke, then N=6 as two strokes**, identically in chromium AND webkit. That's the page dropping its room around t≈7–8 s. Three later runs of the same instrument, with the label traced per step, read `1…6 players` cleanly both engines. I didn't isolate the cause, so it could be a product race in `wire=local` presence. **Open.** No number below comes from that run.
5. **The short regime is still a height query** (charter 9). The leader's `(pointer: coarse) and (max-height: 799px)` no longer fires on a desk: a 1280×720 desk draws 4 rows + `and 12 more`, both engines (`player-tally.spec.ts`, the sheet's-ground row). But LAWS still say to key a regime on the space the sheet has, and this one isn't. It's the leader's substrate line, so it isn't re-cut here. My objection travels to the leader.
6. **Two substrate defects cured here are the LEADER's lines** (§2 rows 1–2): Escape's focus theft and the `@focusout` leave. Both are measured and born-RED on this tree. PLR-SELF lands them or refuses them, and the hand-off is this row.
7. **Not run:** the §10 reachability probe at 844×390 / 812×375 (π was read there, the probe is §10's); `multiplayer.spec.ts` and any relay arm beyond `?wire=local`; the deck swatch (F1's fourth surface, the leader's open gap); real iOS (M19); `poseFronts` (ACC-FIVE's cured export isn't on this base, so segment counts are banked instead, §3); the `--ring-ink` consumer (no declaration on this base; the ring stays `currentColor`).
8. **The painted AA is core-and-slice, not a threshold-free read.** Every number is off screenshot bytes (dpr 3). The worst slice at 50 % median mass is **3.70** (chromium light N=4, run 3) / **3.849** (run 4) against a 3:1 non-text floor. The fraction of slices under 3:1 is **0** in every crop. A different slice rule could read lower.
9. **The @mbabb hover region is 2.5 % smaller** (76 px², §4). The mark's left edge takes one column of the disclosure's box. That's priced, not cured, and it's the leader's `AttributionCard.vue`.

## 1 · The replay route, and INCIDENT 1

**The tree was NOT the pass-3 record at start.** The chair reset it to `pass3.diff`, but a later dead attempt of this lane (files dated 15:12–15:22 on 2026-09-22) had advanced it before dying:

- it applied PLR-SELF's `substrate.diff` (20 files; at start 12 byte-identical to the substrate, 8 re-cut for the tally — `PlayerMark.vue`, `PlayerLobby.vue`, `copy.ts`, `App.vue`, `pencilConfig.ts`, `check-font-coverage.mjs`, `player-mark.spec.ts`, and `PlayerStub.vue` deleted);
- it moved `useTallyStrokes` to `src/pencil/composables/` and deleted pass 3's `games/shared/PlayerTally.vue` / `PlayerLobby.vue`;
- it replaced the leader's `PlayerStub.vue` with the tally stroke (file deleted, `PlayerLobby` rows draw `tallyPose0`);
- it deleted `pw.tally.config.ts`, `pw.instruments.config.ts` and `.tally-instruments/` (charter 11);
- it left two orphaned servers: `:4242` (this lane's dev, PID 3596) and `:4230` (control, 3597). Both were identified by their `.plr-count` config and cwd, then **killed by PID**.

`git diff --stat` therefore disagreed with the pass-3 README's file list: 16 tracked + 6 untracked vs 7 + 6. **I said so before touching a file, didn't reset (the brief forbids it), and advanced in place.** Route: **in place**. The state I found is banked whole as `logs/tree-at-start-15-41.diff` (3,397 lines) and the state I return as `logs/tree-at-return.diff` (3,470 lines). The substrate was checked against `pass4/prototype/PLR-SELF/substrate.diff` applied to a `git archive 74a2b5d9` scratch tree (the per-file diff counts are the ones above).

## 2 · What this pass changed (on top of the found state)

| # | change | why, with the number |
|---|---|---|
| 1 | `PlayerMark.vue`: Escape's `el.value?.focus()` **struck** | After a mouse open (`@pointerdown.prevent` keeps the caret in the cell), Escape moved focus INPUT → **BUTTON**. Born-RED: the planted line fails `Space and Escape…` in **both engines** (`logs/escape-bornred-planted.log`). Cured: green both (`escape-cured.log`). Nothing in the sheet can hold focus, so there's nothing to return focus FROM. |
| 2 | `@focusout="close"` → a document `focusin` bound only while open (PLR-PLACE's graft) | A mouse open never focuses the mark, so the caret moving on through the board left the sheet open. New row `focus moving anywhere else shuts the sheet…`, with its negative control (focus on the mark keeps it open). On the planted leader form it's **RED both engines**, `afterCaretMoved: "true"`. Cured: `{"afterCaretMoved":"false","afterMarkFocused":"true"}` both engines. My first cut of the row could NOT fail (the control ran first and focused the mark), so it was re-cut before it counted. |
| 3 | `.pt-count` `--type-heading` → **`--type-title`** (32.9 px) | G16 (§3): the smallest rung on the φ ladder whose painted ink clears one graphite stroke in both themes and both engines. The head doesn't step: `.corner-left` stays **39.75** tall at N=6 desk and 44 × 44 coarse (π, both engines). |
| 4 | `player-tally.spec.ts` G8: `< 221.73` literal → `< boardTop` read in the same run | A literal passes on a board that moved. Measured bottom 214.53 vs top 221.73 / 221.42. |
| 5 | `check-pw-projects.mjs`: `player-mark.spec.ts` into `SPEC_MANIFEST` | It's the substrate's omission, and check 6 was RED on the found tree. The HOLDOUT text now says **press 6** (measured) and cites `:362-371`. |
| 6 | `prettier --write` on `DifficultyTally.vue`, `check-font-coverage.mjs` | Prettier was EXIT 1 on the found tree; it's EXIT 0 now. |

## 3 · The numbers

**Estate rows, final run** (`logs/estate-final.log`, dev server, both engines): **47 passed · 1 skipped (webkit Tab, declared per row) · 0 failed**. That's `player-tally.spec.ts` 17 rows + `player-mark.spec.ts` 7 rows.

| gate | reading, chromium / webkit |
|---|---|
| G3 width | **44 · 44 · 51.66 · 62.28 · 72.92 · 44** at N=1…6, to 0.02, both engines |
| G7 one base | `1 player`…`16 players`; strokes 1–5 then 0; the numeral's digits ⊂ the name; numeral > 32 px |
| G9 inner leaver | at six, `q1` leaves. First frame `["0","0","0","0","100"]` / `[…,"96.53"]`: no survivor re-draws, the promoted sixth draws in. The law is restated: *no survivor re-draws; only a stroke the tally didn't hold a tick ago draws* |
| G9b departure mid-draw | per-rAF trace, **rises 0** both engines; on the first frame after the leave the newcomer is still drawing (42.33 / 40.52), never jumped to 0 |
| G10/G11 | Space opens, Escape shuts, caret stays INPUT across press and Escape (row 1 above); Tab reaches the mark at **press 6** chromium, webkit skipped with its reason |
| leave | row 2 above |
| G4 authorInk | two pages, one context, product invite: **0 / 0 / 1** (none / self write / peer write), peer half by `expect.poll`, both engines |
| G15 M19-whole | third join: label `2 players` → `3 players`, `aria-expanded` false→false, focus stays in cell 40, both engines |
| quiet | `page.clock.setFixedTime`: at T+5 s `[]`, at T+26 s **`["26 seconds ago"]`**, both engines |
| G8 | short phone 390×664 coarse: sheet **103.36**, 1 named row + `and 2 more` (the leader's budget); tall 390×844: 4 rows + `and 12 more`, bottom 214.53 < board top |
| G12 | 0 marks at `?view=gallery` |
| G17 solo | arm A: one stroke `rgb(38,38,38)`; arms driven in §5 |

**G16 · ink weight, DEFINED ONCE.** Σ over pixels with manhattan distance d > 8 from the crop's modal-corner ground of `min(1, d / D)`, ÷ dpr² (CSS px²). **D is ONE normaliser per run**: the largest core d in any crop of that engine × theme (603 light, 548 dark). Crops are 390×844 coarse, dpr 3, rest pose after 700 ms, from `instruments/plrc-strip.mjs`. Run 4:

| | N1 | N2 | N3 | N4 | N5 | **6 title (shipped)** | 6 heading (p3) | 6 subheading (p2) |
|---|---|---|---|---|---|---|---|---|
| chromium light | 62.73 | 90.91 | 135.11 | 181.06 | 230.73 | **84.96** | 53.67 | 33.95 |
| webkit light | 62.05 | 94.75 | 132.36 | 177.75 | 233.31 | **84.38** | 53.17 | 33.55 |
| chromium dark | 62.42 | 104.30 | 167.30 | 217.93 | 273.89 | **118.77** | 75.28 | 47.76 |
| webkit dark | 59.82 | 106.69 | 166.61 | 214.50 | 267.59 | **116.53** | 73.40 | 46.29 |

- Floor `ink(6) ≥ ink(1)`: title **GREEN in all four cells**. Heading **RED in both light cells**; subheading RED everywhere. These are the negative controls, from the same page in the same run.
- Against the state it replaces: title/N5 = **0.368 · 0.362 · 0.434 · 0.435**. **Not monotone, in any cell.**
- Noise: N1 moved 60.42 → 62.73 between runs 3 and 4 (boil pose). The band is about ±2.3 px².
- Rename: G16 is the **floor against the solo stroke**, not "ink-floor". It says nothing about monotonicity.

**G1 runs** (same crops): 1/2/3/4/5 runs at N=1…5 and 1 at N=6, in **all four engine × theme cells**. That covers pass 3's missing N=2 and N=4.

**G2 painted contrast** (core on ground; the floor is 3:1):
- Head strokes, light: worst core **4.771** (N5, both engines). Slice sensitivity 50/70/90/100 % is worst 3.849 / 4.706 / 4.771 / 4.771 (chromium). Fraction under 3:1 is **0**.
- Head strokes, dark: worst core **8.831 / 8.862**. The numeral is 6.136 light / 9.711 dark.
- Sheet row strokes (`.pl-stub`, 4.4 × 22 px): light worst core **5.014 / 4.955**, slice-50 % worst **4.654**; dark worst **8.669 / 8.796**. Under 3:1: **0**.

**Hue (the 13.3° family law, charter 12): it's F1's, not the walk's.** Minimum painted pairwise hue separation at 390 coarse:

| | N=3 | N=5 | your own ink |
|---|---|---|---|
| F1 true (shipped substrate) | **82.2° / 83.5°** | **52.5° / 52.4°** | `oklch(0.5 0.11 0)` (hue 358.5) |
| F1 false | **13.3° / 12.7°** | **13.3° / 12.7°** | `rgb(37,99,235)` (hue 263) |

Pass 3's 13.3° reproduces exactly under F1 false. It's the incumbent self-blue (263°) sitting beside k=2's painted 276.3°. Under F1 true the collision is gone. **Handed to PAL-WALK and to the F1 ballot with this number**; no claim above it.

**π against `74a2b5d9`** (`instruments/plrc-census.spec.ts`; computed color, background-color, font-family/size/line-height/weight, tagName, rect; 10 keys; regime witnessed by matchMedia on both pages of one context), both engines. Scenes: desk solo, desk room 3, desk room 6, phone 390×844 coarse, landscape 844×390 coarse. **Exactly one key differs in every scene**: the corner holding the mark, width only (75.53 → **119.53** at N=1 and N=6, **127.19** at N=3). Height is unchanged (39.75 fine / 44 coarse), and paint and tag are identical. Cell 0 reads `5` on both arms.

**Live regions**, DOM order: control **6 / 6 / 8** (solo / room of 3 / deck), prototype **6 / 6 / 8**, same order in all three, both engines. The only difference is `p.players-status` taking `sr-only` in a room (the substrate). The spec's "deck +1" was wrong: the deck is +2 over playing and +0 over control. `PlayerLobby`'s "three before, three after" comment no longer exists on this tree.

**Filter budget on the BUILT, SERVED dist.**
- The estate's `filter-census.spec.ts` under its own `playwright-throttle.config.ts`, with `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4231`: **12/12 passed**, both engines.
- My dist census, room of five with the sheet open, normal + PRM, both engines: **9 elements, 3 distinct `url(#)` ids, 0 inside the mark or sheet**. That's identical to the control's 9 / 3 in all four cells.
- **The critic's "defect" is REFUTED.** The default config's `npm run dev` webServer `testIgnore`s `filter-census.spec.ts`. The spec rides `playwright-throttle.config.ts`, which builds and previews (`:4188`) unless handed an external base. Pass 3 ran it on the dev server through its OWN scratch config.
- **Reconciled 11 vs 9:** pass 3 counted distinct ids (11) including `display:none` pose siblings' `filter=` attributes. The budget counts ELEMENTS (9) under the display rule.

**Other readings**
- **Goldens**: `playwright-golden.config.ts` on the served dist, **4/4 passed** (darwin). No golden move.
- **G13**: 20 `.dt-pose .dt-stroke` `d` values **byte-identical** to the control, both engines. Negative control: `tallyBoil` 0.6→0.61 reads `20 20 false`, RED (`logs/g13-negative.log`), then restored and `cmp`-verified. The row loads `?difficulty=EASY` without `?board=` (a shared board has no dealt difficulty, and the `d` values depend on no cell).
- **Dash survivors** (chair §4 §6.9, banked in place of `poseFronts`): tally stroke **4 segments, 1 subpath**; sheet row stroke 4; DifficultyTally 4/4/4/4/8. Both engines, far under the ~128-segment WebKit trap.
- **R6 hue census** (r0's, copied and re-pointed): tree vs control **byte-identical, diff exit 0**.
- **r0 I3 MOVED**: the pass-3 proposed form, carried as `instruments/r0-I3-moved.PROPOSED.spec.ts` and never applied to r0. `candidates=1`, **green both engines**.
- **Undefined-token read** on `PlayerMark.vue`'s nine `var()`s: all declared; `--presence-ink-dur` is bound inline from `MOTION.presenceInkMs`. This is a source grep; MOT-VERB owns the census proper.

**Batteries, bare, on the return tree** (`logs/gates-2.log`, `logs/units-2.log`):
- `vue-tsc -b` 0 · `typecheck:e2e` 0 · eslint src/e2e/scripts 0 · prettier 0 · knip 0 · boundary 0 · lint:motion 0 (36 specs) · live-regions 0 · theme-tokens 0.
- `lint:copy` **0**: 0 dashes, 0 unadmitted, 0 admissions. No new strings this pass.
- `test:font-coverage` **0**: Patrick Hand 46 cp / 4,312 B, and the dist's `patrickhand-subset-BqV1besB36ib.woff2` is 4,312 B. **Born-RED:** planting `and ${n} more, jinxed` in `LOBBY_COPY` makes it EXIT 1 and name the string ("THIS IS THE RANSOM NOTE"); restoring gives EXIT 0. So the gate looks at `LOBBY_COPY` through the `lobbyStrings` derive (charter 8 closed).
- `check-pw-projects` **1** (check 8 only, gap 3).
- vitest, chunked: **68 files / 829 tests, 0 failed** (shared 34/428 · games 21/293 · cards+posters 2/19 · pencil 8/73 · composables 3/16).

## 4 · The @mbabb hover region, priced (charter 10)

The owner box is `.corner-left` on the control and `.attribution-disclosure` on the prototype; both are **75.53 × 39.75**. An `elementFromPoint` sweep at 2 px pitch reads **760 → 741 points (3,040 → 2,964 px², −2.5 %)** in both engines. All 19 lost points land on `button.player-mark`: its left edge overlaps the disclosure by one column. The mark's own +44 px doesn't open the card.

## 5 · The forks, driven (U-10)

- **SOLO arm** (`SOLO_ARM`, one const). On a board with **no room**, arm A `keep` shows 1 graphite stroke `1 player` with corner 119.53. Arm B `gate-on-a-room` shows **0 marks** with corner **75.53**, byte-equal to the control. In a room alone (`?s=`, nobody else), both arms show `1 player`: arm B gates on a room, not on company. With two people, both arms show `2 players`. Both engines. Frame 3.
- **F1** (`SELF_TAKES_ROOM_INK`): the hue table in §3. Frame 4.
- **The 5↔6 swap**: frames 1–2 carry title / heading / subheading beside N=1…5.

Every const flip was scripted, restored and `cmp`-verified (`instruments/plrc-arms.sh`, `logs/arms-*.log`). The shipped values stand: `keep`, F1 `true`, `--type-title`.

## 6 · Ballots for the owner (both frames each)

- **B-COUNT-1 — the swap at six.** (a) numeral at `--type-title` (shipped here, floor green, 36.8–43.5 % of five strokes); (b) pass 3's `--type-heading` (floor RED in light, 23 %); (c) no swap: five strokes and a written remainder. Arm (c) is unbuilt, so it's a gap if chosen. Frames 1 + 2. **Default: (a).**
- **B-COUNT-2 — SOLO.** `keep` vs `gate-on-a-room`, frame 3. **Default: `keep`** (M14's "coloured when live" presupposes a mark present when not).
- **F1 (chair §6.10), new evidence:** F1 false re-creates the 13.3° hue collision at N=3 and N=5, both engines; F1 true clears it to 52.5°. Frame 4. The leader holds the ballot; this is data for it.

## 7 · Frames (4 · 64,223 B · each a REPLACEMENT)

| frame | engine · theme · viewport · pointer | retires |
|---|---|---|
| `frames/1-strip-light-chromium.png` (18,879 B) | chromium · light · 390×844 · coarse (`hasTouch`) · dpr 3 | pass-3 `frame1-strip-390-coarse.png` (15,139 B) |
| `frames/2-strip-dark-webkit.png` (18,310 B) | webkit · dark · 390×844 · coarse (`hasTouch`) · dpr 3 | pass-3 `frame4-dark-N3.png` (37,146 B) |
| `frames/3-solo-arms-desk-chromium.png` (12,897 B) | chromium · light · 1280×800 · fine (mouse, no hover) · dpr 2 | pass-3 `frame2-desk-register.png` (47,594 B) |
| `frames/4-f1-hue-N5-chromium.png` (14,137 B) | chromium · light · 390×844 · coarse (`hasTouch`) · dpr 3 | pass-3 `frame3-phone664-N3.png` (32,673 B) |

## 8 · R6 / r0 rows

- **r0 I3: MOVED**, a PROPOSED diff, never applied (above).
- **R6 L5**: no border minted; the mark is `border: none`.
- **Law 39**: the ring is `DrawerTab`'s form in `currentColor`.
- **T7-W2 A4**: inherited from the leader's drafted row; I have nothing to add.
- **No r0/R6 law was edited by this lane.**

## 9 · Incidents, self-declared

1. The found tree was a dead attempt's state, not the pass-3 record (§1). Two orphaned servers from it were killed by PID.
2. The unreproduced room collapse in census run 2 (gap 4).
3. Three of my own instruments were wrong before they were right:
   - the leave row's negative control ran first and made the row unable to fail;
   - G13's first negative control failed on a missing output dir, not the perturbation;
   - G13's first cut loaded `?board=`, under which the difficulty tally doesn't render (timed out).

   All three were re-cut and re-run before counting.
4. A `copy.ts` plant (the font born-RED) overlapped the first `player-mark.spec.ts` run by about a second. That run was green; the counted run is the final one.
5. Work-tree hygiene at return: `git status` shows product files only. `.plr-count/`, `.vite-cache-plr-count*` and `playwright-report*` were removed. The ignored `.vite-cache/`, `web/frontend/dist/` and `test-results/` date from pass 3 (2026-09-19) and were left alone.
