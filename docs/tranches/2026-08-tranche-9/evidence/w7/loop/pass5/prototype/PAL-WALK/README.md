# PAL-WALK · pass-5 prototype (§11c, the hue walk; the palette's leader)

The work tree is `.claude/worktrees/wf_308fa864-c94-1`. Base and π control are **`74a2b5d9`**, and the work is uncommitted.
It advanced in place on top of the chair's bank (`pass4/prototype/PAL-WALK/pass4.diff`). At the start, `git diff --stat`
read 16 files modified plus 2 untracked, which matched the pass-4 README's list. It now reads **16 files modified, +1068/−89, plus 2 untracked**
(`e2e/peer-walk.spec.ts` at 1,031 lines, `scripts/check-peer-arcs.mjs` at 743).

These are the servers I ran, all on 127.0.0.1. Each was killed by its recorded listener PID:

- 4244: the lane's dev server.
- 4245: the HEAD control dist, verified `index-CubiZsMVSwTc.js`.
- 4246: a watcher-free dev server for the sweeps.
- 4247: PAL-TIN's tree `c94-2`, served read-only in dev. I checked its status and diff by sha before and after, and they are unchanged.
- 4230: my built dist, `index-iqdYCvIZwvfI.js`.
- 4231: the `w7-control` tree in dev, read-only, for the session π. Its status is unchanged.

The ports 4232–4243 and 4248–4249 were held by siblings, so I scanned the band before binding each one.

The pass-5 number is the critic's.

## Gaps first

1. **Two F1 switches meet at the fold.** PLR-SELF's `substrate.diff` carries its own F1 const, `SELF_TAKES_ROOM_INK`. It is not exported,
   because knip complains about an export with no importer. This tree carries `SELF_TAKES_A_HAND`, which I now export because the units
   read it. These are two publishers of one owner's ballot. Three of the substrate's four rejected hunks on this tree are exactly that
   switch (the fourth is BoardHost's self-row guard), so the fold has to pick one name and one home. I didn't pick, because
   it's a §11 and §11c seam and belongs to the chair or the fold. Price, in full, under G6.
2. **The ring's fringe still reads under 3.0 at low density.** The core median clears 3.10 at every density: worst 3.133 light,
   3.341/3.344 dark, the same at dpr 1, 2 and 3. That's because it's the stroke's solid interior. At dpr 1, though, the p30 falls to
   2.444 (chromium) / 2.539 (webkit), and 34.7–39.7 % of core pixels read under 3.0 on average. The ruling names the median, and the
   fringe columns travel with it. Any line 1.89 px wide has them.
3. **The painted glyph pixels of the tape's name don't reach their spec colour at the antialiased edge.** In the dark arm, at ≥50 % of
   the most-changed pixel, 433/3,033 (chromium) and 197/2,606 (webkit) glyph pixels read under 4.5 against their own ground. At ≥90 % it's 0.
   The asserted row is the spec colour against the painted ground, which is the critic's headline statistic and now reads 5.691 with 0 px
   under 4.5. The glyph-fringe column is printed and not asserted, and I'm saying so.
4. **The fork and gestalt frames aren't a four- or eight-page room.** The inks are bound on the cells the way the product binds an author's
   entry (the cell's own `--color-user-ink`, on each tree from its own source). The F1 and B-TAPE pairs, by contrast, *are* real two-page rooms.
5. **The dark washi-tape class is cured for WALK's tape only.** PAL-TIN's sticks fail on the flat composite too: that's their
   ink, not the paper. HEAD's self blue is HEAD's own row. Pass-5 chair rulings §1.4 book it as one estate row, and it's stated once below.
6. **The filter census ran LIGHT only, which is the spec's regime.** It read 12/12. The DARK arm, and its red at HEAD (`crayon-heart`), are
   ACC-SIX's born-RED and the chair's cure (pass-5 chair rulings §1.4). This tree adds no filter, and `filterBudget.ts` is `cmp`-identical to the control.
7. **Tier 3 stays a local instrument (O-12).** CI sees check 1/3/4 (lint:arcs) and the tier-2 units. It doesn't see the photographs.

## Numbers (control `74a2b5d9`, payload `ATMuMzkx…YxMDYx`)

Every browser row loads ONE encoded board, minted with the app's codec from the control's deal. It decodes to
`39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61`, and both arms asserted that decode
in every run where two arms were compared (π, session π, the §C room, all frames).

### The charter's rows

| # | row | reading on this tree | control / negative |
|---|---|---|---|
| G1 | same-epoch wire rule | The `st` handler's `!newer` branch now runs `adoptInk(k, true)` when the frame is the SAME epoch and its sender is the epoch's author. The board is not re-adopted (S1 asserts `adopted` length 1). S1 and S2 are landed. U1 and U9 are re-dated to the same epoch (e: 3 / e: 3) | Break-test (branch removed): **U9 and S1 red, 2/45**, restored by sha1 |
| G2 | the tape name on the PAINTED ground | Cured: `.attribution-tape .washi-label` lays the washi on the card (`background: linear-gradient(washi, washi), var(--color-card)`), this tape only. Painted, dark, spec vs painted ground: **5.691, 0 px under 4.5**, at all four cells (3 with a given above the line, 1 top-row flip), both engines, dpr 3. Light: 11.891, 0 px | Break-test (paper back to translucent): §C **RED both engines**. webkit dark cell 11 read **4.364, 157/4,605 px under 4.5**; chromium red on the light top-row flip (the digit under the paper). Critic's pass-4 figure: 4.374/4.378. HEAD i=1: 4.589/4.594 (critic's) |
| G3 | check 3 src-wide | New **check 4 ONE PUBLISHER** reads 248 files under `src/` and `e2e/` with comments stripped. It reds any `--peer-*-l` declaration outside index.css's two arms, any band-shaped literal under a ring/band/peer/hand name, any hex table under a player-shaped name, and any `--color-peer-*` written as a literal. On its first run it found **this family's own `e2e/peer-walk.spec.ts`** (`ALTERNATE_BAND` and a runtime `setProperty`), and both were deleted | Self-test rows B1, B3, B2, A1, A2, A4, A6, plus a spec `setProperty`, all red, and a consumer plus a comment stay green. On the TREE (edit, run bare, restore by sha1): B1 exit 1 · B3 1 · B2 1 · A1 1 · A2 1 · A4 1 · A6 1 · control 0 (`readings/gate4-break-battery.txt`) |
| G4 | the F1 pair on one payload | Real two-page `?wire=local` room. A (the starter) writes cells 11 and 14, and B writes 12 and 16, with the solved digits and the same cells in both arms. Crops are equal (rows 0–2). The one variable is `SELF_TAKES_A_HAND`, flipped over HMR and restored by sha1. **U2/U7/U8 re-aimed** through `selfInk()`, so the NO arm is green: `useSession` + `BoardHost.authors` **55/55**, `src/games` **57 files / 759**, `vue-tsc -b` 0 (in a scratch copy with the switch false) | Frame 1 |
| G5 | the headroom sentence and "4px" | The pin rule is rewritten to the section's statistic. The core median is density-free (3.133 at dpr 1/2/3, 144 hands, both engines), so the dpr-1 caveat moves to the fringe columns (p30 and the fraction), which are stated. "4px" became "1.89 CSS px" in index.css and in the spec header | — |
| G6 | the graft row | Not taken, and here's why: `LOBBY_COPY` exists to feed the HAND FACE's font-coverage derivation ("every literal in that object is a string the hand face is asked to paint"). `{slug} is here` is a clause in the cell's ACCESSIBLE NAME and is never painted, so declaring it there would ask the 46-codepoint cut for glyphs nothing draws. M16 is held by `check-copy-register` (0 dashes, 0 unadmitted). **Overlap priced on this tree**: the substrate touches 3 of this family's files with 7 hunks. index.css 1/1 applies clean. **BoardHost.vue 1/1 and useSession.ts 3/5 reject (38 ± lines)**: the F1 const (gap 1) plus the self-row guard in `peerCursorInk` | `git apply --reject` on an archive plus this diff |
| 7 | gestalt frames | Re-shot as frame 3 (four hands \| eight hands). ΔE stands, re-read at the pair: **N=4 0.0758 · N=5 0.0264 · N=8 0.0229 · N=16 0.0084** (light; dark N=4 0.0762, N=8 0.0226) | — |
| 8 | π on a dist that postdates every edit | The dist was built from a CLEAN archive outside the tree. After the final comment edits I rebuilt, and the result is **byte-identical** to the first build (`diff -rq`, `index-iqdYCvIZwvfI.js`, 43 files, the same count as the control). **Solo π 854 nodes: 0 one-sided, 0 paint/tag, 0 rects**, chromium and webkit, light and dark. Negative head-vs-head 0/0/0, positive light-vs-dark 854. **Session π** (dev vs the control in dev, `?wire=local`, claimed cells excluded): **551 nodes 0/0/0** in both engines, negative 0, positive (claimed included) 563 nodes with **1 paint delta** (the ring). **Goldens 4/4. Filter census 12/12** (6/6 per engine, light) | — |

### THE RING PAIR (registry §2.4), published once and re-read on both trees

`index.css` now publishes `--peer-ring-l: 0.295` (light) and `0.79` (dark), and `RING_BANDS = [0.295, 0.79]`. Check 3 holds the pair, check 4
holds everything else, and **L6 PROPOSED is re-cut to carry the pair as a VALUE** (`instruments/law-probe.L6.PROPOSED.diff` against r0's
current probe). It reads GREEN on this tree. It reads **RED** on the control (no ring band), on the pass-4 state (0.32/0.79), and on PAL-TIN's tree (0.295/0.775, hexes).

The statistic is the CORE MEDIAN: ring-off subtracted, every moved pixel ≥50 % of the most-moved one against the ring's own fill, and a second OFF photograph drops the boil
noise. I photographed **all 144 hands at dpr 1, 2 and 3 in both engines, 1,728 photographs, 0 isTheRing false**:

| arm · engine | core median worst (all dpr) | under 3.10 | p30 worst dpr 1 / 2 / 3 | mean frac<3 dpr 1 / 2 / 3 |
|---|---|---|---|---|
| light · chromium | **3.133 (i=6)** | 0/432 | 2.444 / 3.133 / 3.133 | 39.7 / 19.3 / 12.9 % |
| light · webkit | **3.133 (i=6)** | 0/432 | 2.539 / 3.071 / 3.133 | 37.2 / 20.8 / 14.0 % |
| dark · chromium | **3.341 (i=86)** | 0/432 | 2.633 / 3.341 / 3.341 | 37.7 / 16.3 / 11.1 % |
| dark · webkit | **3.344 (i=89)** | 0/432 | 2.749 / 3.344 / 3.344 | 34.7 / 15.2 / 11.7 % |

**PAL-TIN's tree, same instrument** (`instruments/ring-core.spec.ts`, its five `--color-peer-k-ring`, its own shipped 0.295/0.775). The core median is the same
at every dpr: light 3.163–3.718 in chromium and **3.133** worst in webkit (arm 2). Dark: **3.127** chromium / **3.125** webkit (arm 5), 3.248–3.474 for the rest.
At dpr 1, 32.5–43.4 % of core pixels read under 3.0.

Cross-check: the same instrument on this tree at i=0..4 reads the spec's own numbers (light i=1 3.184, dark i=0 3.364/3.394).

**The section at the pair**: light 0.295 clears 3.10 on both palettes (3.133 WALK / 3.133 TIN). The dark arm clears it on WALK's 0.79 (3.341) and
misses it on TIN's shipped 0.775 (3.125–3.127).

**The born-RED is on this tree.** With 0.32 on both publishers (the comparer stays green, exit 0), §B reads **i=6 core median 2.995** and fails in both
engines. The pass-4 band failed the floor itself. Restored by sha1, and the same batch reran green.

The §A arithmetic at the pair: ring worst **3.306** light / **3.458** dark (webkit 3.461). Min ring chroma **0.0502**, down from 0.0544; that's the price. The §6
candidates are 0.55 → 3.306/3.458, 0.65 → 4.345/4.345, and 0.80 → 6.799/5.912. Painted hue: ring drift 1.712° (light) / 1.617° (dark), nearest token 13.008°,
so the ≥12° law holds. `join-language-prm:153` is untouched at 0.55. The 90 % flank statistic from pass 4 is banked there and doesn't bind.

### The dark washi-tape AA class — ONE estate row (for the chair)

| tape | ink | paper | dark, painted (spec vs painted ground) |
|---|---|---|---|
| WALK, this tree | ring string (0.79) | washi laid on the card | **5.691, 0 px < 4.5** (i=1, both engines). §A worst of 144 on the same composite: **5.250** (i=47) |
| WALK, pass-4 paper | ring string | translucent washi | 4.364–4.378, 93–477 px < 4.5 per hover (the line and digit show through) |
| HEAD `74a2b5d9` | its i=1 walk ink | translucent | 4.589 / 4.594, 0 px (critic's). HEAD self blue 4.231 (TIN's critic) |
| PAL-TIN `c94-2` | five sticks | translucent | 2.98–3.50, 100 % of ink px < 4.5 (TIN's critic). The flat composite fails too, so the paper can't cure it |

W2 §2.5 for the attribution tape (ten cells, 4,521.72 px² at HEAD) is not moved by this tree. It's the §10 fold's, or T9-R5.

### Units, types and gates

| row | tree | control |
|---|---|---|
| vitest, chunked | `src/games` 57 files / **759** · `src/pencil` 8/73 · `src/composables` 3/16 = **68 files / 848, 0 failed** (+S1 +S2) | — |
| `vue-tsc -b` · `-p tsconfig.e2e.json` | 0 · 0 | — |
| `e2e/peer-walk.spec.ts`, WHOLE file, both engines | **3/3 dpr 3 · 3/3 dpr 1** (the estate's density), chromium and webkit | — |
| lint:lanes · lint:theme-tokens · lint:sleep · test:e2e:projects · check-pw-projects (check 8 FLOOR BAND ✓) | 0 · 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 · 0 |
| lint:arcs (checks 1/3/4 + 20 self-test rows) | 0 | 1 (the script is absent at base) |
| lint:copy · lint:motion · lint:theme-selectors · lint:ink · lint:catch · lint:live-regions · knip | all 0 | all 0 |
| `prettier --check` (src/ scripts/ ../../scripts/ ../relay/) | 0 | 0 |
| `eslint .` | **0** (after the scratch left; it was 1 on the scratch alone: `.palwalk5/` instruments) | 0 |
| `check-copy-register` bare | 0 dashes, 0 unadmitted (no new rendered string) | — |

## Ballots for the owner (U-10), both frames on one payload

- **B-TAPE**: the attribution tape's paper, (a) translucent washi [pass 4] versus (b) the washi laid on the card [shipped]. Frame 2. The name is in the ring's string in both,
  and the one variable is the tape's `background`. (a) shows the given 6 and the grid line through the tape and reads 4.364 painted. (b) hides them and
  reads 5.691. The glyph under the tape (B's `1`) is a different boil pose in the two shots; that variable isn't controlled.
- **F1** (chair §6.8): your hand takes a room colour on the second known id. YES [the lean] versus NO (you stay `#2563eb`). Frame 1 shows YES with your 5/9 in
  the walk's i=0 red and NO with them in the house blue. The peer's 1/7 are i=1 teal in both. **NO no longer costs units**: U2/U7/U8 read the switch.
  The fold question is gap 1 (two switch names).
- **The section's fork**: TIN's five sticks versus the 144-hue walk, frame 4. Same board, same eight cells, same viewport, chromium, light. The left is TIN's `--color-peer-1..4`
  (the roster-seven-tallies crop was swept; this replaces it with the board), and the right is WALK's i=0..3.
- **The gestalt**: four hands versus eight, frame 3. The ΔE falls between four and five (0.0758 → 0.0264).

## Frames (four, 111,236 B, each a replacement)

| file | engine · theme · viewport · pointer | retires (pass4/SWEEP.md) |
|---|---|---|
| `frames/1-f1-yes-vs-no-1280-light-chromium-fine.png` (30,526 B) | chromium · light · 1280×800 dpr 2, scaled 36 % · fine (mouse). Cell 14 holds A's focus in both arms | `prototype/PAL-WALK/frames/3-f1-yes-vs-no-1280-light-chromium-fine.png` |
| `frames/2-tape-translucent-vs-card-1280-dark-chromium-fine.png` (11,409 B) | chromium · dark · 1280×800 dpr 3 · fine (hover on cell 12) | `prototype/PAL-WALK/frames/4-tape-ring-vs-digit-1280-dark-chromium-fine.png` |
| `frames/3-gestalt-four-vs-eight-1280-light-chromium-fine.png` (34,973 B) | chromium · light · 1280×800 dpr 2, scaled 36 % · fine. Cell 24 holds focus in both | `prototype/PAL-WALK/frames/1-ring-relay-desk-1280-light-dark-chromium-fine.png` |
| `frames/4-fork-tin-four-sticks-vs-walk-four-hands-1280-light-chromium-fine.png` (34,328 B) | chromium · light · 1280×800 dpr 2, scaled 36 % · fine. Cell 24 holds focus in both | `prototype/PAL-TIN/roster-seven-tallies-light.png` and `prototype/PAL-WALK/frames/2-ring-relay-390x844-light-webkit-coarse.png` |

## What moved this pass

- `useSession.ts`: the same-epoch author branch (G1), and `SELF_TAKES_A_HAND` exported (the units read it).
- `useSession.test.ts`: S1 and S2 landed, U1 and U9 re-dated, U2/U7/U8 read through `selfInk()`, and the rounding figure updated to 1.712°.
- `index.css`: `--peer-ring-l` 0.32 → **0.295**. The pin-rule, 3.0 and price comments are re-derived from this pass's numbers.
- `playerIdentity.ts`: `RING_BANDS = [0.295, 0.79]`, and its comments.
- `GameBoard.vue`: the attribution tape's paper is laid on the card (G2).
- `check-peer-arcs.mjs`: check 4 ONE PUBLISHER, with nine self-test rows.
- `e2e/peer-walk.spec.ts`:
  - pinned to the encoded board;
  - `ALTERNATE_BAND` and its `setProperty` deleted;
  - §B reads the core distribution and asserts median ≥ 3.10 on five hands per arm (i=5, 6, 86, 89, 95), with a noise shot;
  - §C is the painted-text instrument (Range-bounded clip, noise shot, sensitivity row) over four cells, asserting the spec vs the painted ground ≥ 4.5.

## r0 / R6 rows MOVED (proposed; the chair lands them)

- **R6 L6**: `instruments/law-probe.L6.PROPOSED.diff` carries the pair as a value. GREEN on the tree; RED on the control, the 0.32 state and TIN's tree
  (`readings/law-probe-*.txt`). The probe copy on this tree reads 6 standing laws GREEN and R1/R2/R3 born-RED, exit 0.
- **Law 21's cite** moves to `index.css` `--peer-ink-l` / `--peer-ring-l`, now 0.295/0.79.
- **r2 kinship** stays MOVED as pass 4 banked it (`pass4/.../accent-kinship.probe.MOVED.ts`). Its tape row now reads the painted composite on the
  card, which is what the paper now is. It wasn't re-run this pass.
- **R2** stays stale (the fold's), and wasn't touched.

## Incidents (self-declared)

1. **A break-test edit killed both sweeps.** The G1 break-test edited `useSession.ts` while the first sweeps ran against the HMR dev server (4244). The page reloaded under
   them and both died at dpr 2 (`path` null). I killed them by PID and relaunched them on a watcher-free server (4246, `hmr: false, watch: null`). All 1,728 photographs
   are from the relaunch.
2. **A restore edit broke one negative-control row.** In the born-RED battery, the restore edits HMR-reloaded 4244 mid-row, and chromium's restored-tree §B died of "execution context destroyed".
   webkit's restored §C dropped a first hover once. The hover is now re-made until the tape mounts. The final whole-file runs (dpr 3 and dpr 1, both engines,
   3/3 each) are the clean negative control.
3. **The painted-name instrument had two defects, both fixed before any number was banked.**
   - The critic's form clipped to the label's box, so boil pixels beyond the torn ends read as "text over a dark ground" (1–49 px). I clipped the census to a Range over the text instead.
   - The glyph-core minimum (4.28–4.32) can't clear 4.5 on any antialiased text, so it's printed with the sensitivity row, not asserted.
4. **The wave is over its image cap, and I didn't cause it alone.** The first composites came to 320 KB and I re-cut them to 111 KB (36 % scale, pngquant). `scripts/check-evidence-policy.mjs` on main still reads **RED**: the per-wave total is ~2.77 MB against the 2,097,152 B cap, and without this family's four frames it is 2,656,729 B. The red was already there from other lanes and the intake crops since the sweep; I'm declaring it, not causing it alone. The chair sweeps.
5. **The TIN tree and the control tree were served in dev** with an external config and cacheDir, which means the Vite config's template plugin ran in their trees.
   It writes only on drift, and each tree's status and diff sha are unchanged.
6. **Scratch.** `.palwalk5/` and three `.vite-cache-palwalk5-*` dirs lived in the work tree during the pass and are deleted. `git status` is product files only.
   The dist was built from an archive outside the tree, so no Tailwind mint came from scratch.

## Replay route

In place, no replay. At the start the tree's `git diff --stat` (16 modified, 2 untracked) matched the pass-4 README list and the chair's `pass4.diff`, and I advanced on top of it.
