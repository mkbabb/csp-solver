# T9-W7 · pass 4 · PROTOTYPE · CTRL-TABS: the unblock rows (BLOCKED at 55)

Work tree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-34`
(detached at `74a2b5d9`, uncommitted). Lane dev server `127.0.0.1:4232` (private cacheDir), HEAD
control `127.0.0.1:4233` = the chair's `w7-control` dist, verified by its hash `index-CubiZsMVSwTc.js`.
Built dist preview `127.0.0.1:4234`, verified by its hash `index-D8OwVfe4bGG9.js`. All three were
killed by recorded PID, and the band was confirmed empty afterwards. One encoded board on every arm:
`?board=ATMuNTMw…MDc5`, which is `toBase64Url("\x01" + "3." + <81 cells>)`, the app's own codec
(chair addendum). Coarse rows ran `hasTouch: true` with `matchMedia('(pointer: coarse)')` witnessed on
every page (`mq c1` in `readings/cells-*.txt`). Settle time was 1000 ms.
No new design was added. Every edit below either restores HEAD or copies a line from the section's
leader.

## Numbers first

### Unblock 1: the declared fallback, built and read at six portrait cells in both engines (coarse)

| reading (390×844 · 375×812 · 430×932 · 360×640 · 412×915 · 390×664) | HEAD `74a2b5d9` | FALLBACK (this tree) | DELETION arm (proposed diff) |
|---|---|---|---|
| `#fold-tools` | present, h 61.58 | **present, h 61.58**, y **+20.00** vs HEAD | absent |
| play tools fully in view | 4/4 (in the fold) | **4/4 (in the fold)** | 4/4 (board-edge tongues) |
| tongue.top − paper.bottom | −6.00 | **−6.00** | −6.00 |
| tongue.bottom − berth.bottom · berth.h | +40.00 · 0 | **0.00 · 40.00** | 0.00 · 40.00 |
| offCentre (paper centre − vh/2) chromium / webkit | 19.27 / 19.58 (360×640: 23.69 / 23.98) | **39.27 / 39.58** (43.69 / 43.98) | **1.52 / 1.20** (2.89 / 3.20) |
| paper.y − HEAD | 0 | **−20.00** | **+20.79** |
| card scrollHeight / clientHeight, 390×844 | 699 / 628 | 332 / 332 | 304 / 304 |
| the four tags (`anchor="tag"`) | 4 | **4/4 present, sticky, visible, h 22.01–23.32, overlapping 0 interactive elements** (390 coarse, 1280 fine, both engines) | 0 |

All six cells read identically in chromium and webkit to within 0.32 px. **Pass 3's centring win
was a fine-pointer artefact.** The spec cited HEAD at 19.27 / 19.58, and pass 3 "refuted" that
figure with a 11.52 / 11.20 reading. The spec's figure was the COARSE one. On a phone the berth
moves the board UP 20.00 when the fold stays (the fallback) and DOWN 20.79 when the fold goes (the
deletion arm). Only the deletion arm centres (1.52 / 1.20).

**The fallback as banked did not work.** In the pass-3 record, `.play-controls` was teleported into
`#fold-tools` while still wearing the board-edge's `position: absolute; top: −8px`. The row
resolved against the page and sat at **y −6.41, off-screen**, at 390×844 coarse. The critic never
saw this because pass 3's frames were fine-pointer. The pass-4 cure scopes the edge pose to
`#board-edge-tools > .play-controls`, and inside the fold the row is HEAD's own: no outline, 1rem
gap, the icon-btn's padding. Declared deltas remaining in the ribbon: `peek` is the pass-2 bare
word, **44×44 vs HEAD's 59.83×44** washi chip, and the row starts at x 80.00 vs 72.08.

### Unblock 2: W2 §2.2's reachability at 844×390 and 812×375 (`hasTouch`), the tab as cued entry

| | HEAD | FALLBACK | DELETION |
|---|---|---|---|
| `viewport-law.spec.ts` §2.2 rows (the estate's own e2e) | GREEN (chromium) | **GREEN chromium + webkit**, opener `drawerTab` [597,166.6,48,92] / [573.5,159.1,48,92] | GREEN (chromium) |
| undo · redo · hint fully in view | **0/3** (y 1070.61 / 1055.61 / 1180.61 at 844 / 812 / 900×500) | **3/3** on the board's flank, 44×49.58 each, both engines | 3/3 |
| card clientHeight (the reading §6.2 asks for) · scrollHeight | 302 · 743 / 287 · 743 / 284 · 743 | **295 · 295 / 287 · 295 / 284 · 295** | 268 · 268 at all three |
| `controls` tongue hit share (63-point grid, `elementFromPoint`) | 54/63 · 54/63 · 54/63 | **54 · 48 · 42 /63** | 54 · 48 · 42 /63 |

The hit-test found a defect that the §2.2 row cannot see, because it tests presence and not
occlusion. The pass-3 record put `peek` on the landscape flank as a fourth tongue, and the strip
then covered the `controls` tongue: **24 / 18 / 12 of 63 hit points** stayed the tongue's, against
HEAD's 54, in both engines. `peek` is back to HEAD's `v-if="portraitDock"`, which gives parity at
844×390. The three-tool strip still takes **6 points (11.8 % of the rect) at 812×375 and 12 (17.1 %)
at 900×500**, in both arms and both engines. Frame f4 shows it.

### Unblock 3: the ballot (T9-B-TABS, to the owner, U-10)

- **Arm A, FALLBACK (the tree; the stated DEFAULT).** `#fold-tools` stays, carrying undo · redo ·
  hint · peek in portrait exactly as HEAD does. The board's edge berth carries undo · redo · hint in
  landscape only, which is where HEAD has no home for them. The four section tags stay, one per
  face-up tray (T9-M03). Frames **f1** (portrait edge + ribbon) and **f3** (the tag under its tab),
  plus **f4** (the landscape flank, the same in both arms).
- **Arm B, DELETION (`instruments/deletion-arm.PROPOSED.diff`, 65 changed lines, applies with
  `git apply` on this tree and reverts cleanly: verified by `git diff` byte-compare).** It deletes
  `#fold-tools` and its rules, puts four tongues on the board's bottom edge in portrait, and deletes
  the four tags. Frame **f2**.
- **Default = A.** The reason is the chair's own §6.3(a)(b): only the owner retires a mark, and both
  `#fold-tools` (T6.2 mark A) and the sticky tag (T9-M03) are marked surfaces.
- **What each arm costs, measured:** A moves the board up 20.00 on a phone (offCentre 39.27 vs
  HEAD's 19.27). Its tag repeats the tab's word inside the tray (the word shows twice, and AT hears
  both the tab name and the tape text). Its card overflows in landscape by +8 at 812×375 and +11 at
  900×500. B centres the board (1.52) and fits every cell (268). It retires two owner-marked surfaces,
  and it reds 11 of 32 e2e rows where A reds 7.
- **Declared deviation:** the charter's fallback reads "the board's edge strip DUPLICATING the acts,
  the fold kept". This tree PARTITIONS by regime instead (portrait → fold, landscape → edge), so no
  act is offered twice. That choice was in the tree when pass 4 opened, not minted here. The
  duplicating form was not built.

### R6 rows: L5 restored, L1 proposed with its control

| row | r0 probe COPY on this tree | PROPOSED probe | control |
|---|---|---|---|
| **L5** | **GREEN**. `GameGallery.vue` is sha1 `61c10e22…`, byte-identical to the control (the pass-3 hunk and the 8% ground's retirement are reverted and banked as `instruments/L5-gallery-guard.PROPOSED.diff`, with the bare `keep` and the goldens still to price) | n/a | uncut `generateRectBoilFrames` is **90/90 byte-identical** to HEAD across 5 boxes × 3 radii × 3 seeds × 2 frame counts; a cut ring differs (`gp-cmp.mjs`) |
| **L1** | **RED** (sum 5): **MOVED** by design, because the divider's four poses leave with the zones | `instruments/law-probe.L1.PROPOSED.diff`: "never grows past 9" (a ceiling, L3's form) → **GREEN at 5, exit 0** | **firing negative control**: a plant raising the budget to 10 → **RED, exit 1**; the control tree at 9 → GREEN |
| **R3** | born-RED **RED → GREEN, MOVED**, but see gap 9 | | |

## Other charter rows with a number

- **Row 6, the built dist.** `vite build` exits 0 → `index-D8OwVfe4bGG9.js`. Served with `vite
  preview`: **filter-census 12/12, chromium and webkit** (G3.1 row + G3.3 coarse, union arms inside
  the spec's tolerance, with the injected-node control inside the spec). **Goldens 4/4.** **`url(#`
  inside `.tray[inert]` = 0** at 1280 fine and 390 coarse (sheet open) in both engines; the same
  counter reads 20 over the document, so it can see a filter. The `filterBudget.ts` DEV-server caveat
  is struck. That comment edit came after the build and changes no emitted byte.
- **Row 12.** `--ring-ink` is MRK-LIVE's line copied verbatim (source `wf_…-35` index.css:238-241).
  Both consumers write it bare, and the tree's struck-mint comment is gone. `ribbonMs` / `inkLiftMs`
  were already struck on the tree. **Open:** the ink lift is a literal `150ms`, not the rung.
- **Row 13, closed as a browser row.** `@property --strip-len` now lives in the first static
  stylesheet: the leader's line (CTRL-FACE `wf_…-33` index.css:239-243) is copied, and the SFC's own
  registration is deleted. The consumer is bare. Born-RED `instruments/tabs-strip-publisher.mjs`:
  arm A (publisher) is **GREEN** with padding-top **101 = 95 + 6** and 0 tabs over the tray; arm B
  (publisher outranked, `initial` taken) is **RED**, with padding **6** and **5 tabs over the tray**,
  at 1280×800 and 1440×900 in both engines, exit 0 = the gate bites. The first draft removed the
  inline property; the ResizeObserver re-published it and both arms read GREEN, so that draft could
  not fail (incident 3).
- **Row 14, closed.** `peek` is in the portrait fold again (0 taps, 4 tools, both arms), not on the
  landscape flank.
- **Rows 7 / 8 / 9 (desk, fine), carried.** Δ board.x = Δ masthead.x = Δ wordmark.x at
  1024/1280/1360/1440/1600 = **0 / −2.16 / −2.37 / −2.58 / −3.14** (chromium), **0 / −2.18 / −2.42 /
  −2.61 / −3.14** (webkit), with card width +4.31/+4.75/+5.14/+6.26. This is chair §6.4's fork, and
  the masthead and wordmark move with the board. The strip runs **2 rows at every rung, with the
  raised tab in row 0** (the first). The berth costs **101 px** of content box (strip 95 + seam 6),
  not 40 and not the critic's 98.
- **Unit.** `vue-tsc --noEmit` exits **0**. `vitest run src/pencil`: **9/9 files, 79/79**, including
  `gridPaths.cuts.test.ts`'s four silences (radius ≠ 0 THROWS in dev). `vitest run src/games/shared`:
  **32/34 files, 415/429, 14 failed**. The same 14 names fail on the pass-3 record (the tree was
  swapped to `pass3.diff`, run, and restored byte-identically), so this pass adds 0 unit reds and
  carries 14: 8 in `liveRegions` (`TypeError … 'emitsOptions'`) and 6 in `GameControlPanel.test.ts`.
- **e2e: `viewport-law` + `board-covisibility` + `mobile-affordances`**, against the dev servers:
  control **32/32**; fallback **25/32 in chromium and 25/32 in webkit (the same 7)**; deletion
  **21/32** (chromium). See `readings/e2e-*.txt`.
- **Gates run bare:** `check-copy-register` exit 0 (0 dashes, 0 unadmitted, 0 admitted).
  `check-font-coverage` exit **1 → 0**: it redded the first tag draft's bound `:text="TAB_WORD[…]"`
  (three unpinned bindings). The tags now carry static literals, as HEAD's did. That is the gate
  biting on this tree.

## Gaps (open, with the number that holds each)

1. **The fallback de-centres the phone board**: offCentre 39.27 / 39.58 vs HEAD's 19.27 / 19.58
   (coarse, six cells). The berth (40) plus the kept fold is the cause.
2. **The landscape flank still covers the cued entry**: 48/63 and 42/63 hit points at 812×375 and
   900×500 (HEAD 54/63), in both arms.
3. **§2.4 toggle theft is a new RED, in both arms and both engines**: at 1024×768 the desk `pencils`
   tab sits under the toggle's hit circle (1264 px², circleFrac 0.417). Control is GREEN.
4. **The fold chrome's retirement (row 19) now rests on a false premise.** The card DOES scroll:
   desk 671–676 / 608–640 in both arms, landscape +8 / +11 in the fallback. `publishFold`, the
   sentinel and `scroll-padding` are gone, so there is no fade cue. Neither restored nor declared
   against W2 §2.3.
5. **Seven fallback e2e reds**, not re-aimed (row 10): board-covisibility:70 (tally in the deal
   ticket), :397 (its stray-tongue ablation reads tuck −483.73 against the berth form),
   viewport-law:287 (gap 3), :575 and :610 (§2.6: the card does not overflow ≥ 40, so the sticky
   state the mark names cannot be reached; T9-M03's row asks a question the tabs remove),
   mobile-affordances:339 (peek as `role=separator` divider) and :435 (Deal's `sure?` arm → the
   ribbon).
6. **14 unit reds carried** (row 10). None was re-aimed this pass.
7. **The raised tab sits in the first of two desk rows** (row 8); the berth is 101 px (row 9). The
   shortest desk's reading was not re-derived. Neither is cured, because that would be design.
8. **The desk band fork** (row 7) goes to the chair: the card's width is W2's token (chair §6.4).
9. **R3 turns GREEN on a CSS `border-top: 2.5px solid` on `.action-bar`.** Chair §1.3 counts a
   border on chrome as an L5 RED row. R3's GREEN is therefore not earned, and the floor's edge owes
   `HandDrawnOutline` (T9-B8's default form).
10. **Row 11's browser half** (open feet within 2.5 of the lid) is unmeasured. SILENCE 4's negative
    control (the throw removed → red) was not demonstrated.
11. **Row 16**: confirm contrast, the `confirmWindowMs` LAPSE row and the press-count row were not
    run. **Row 17**: the armed confirm and the tab-swap glide were not framed. **Row 18**: only the
    R6 law probe was copied and run. Hue census, accent kinship, TAPE's two rows and R7 I2 / I3 / I4
    were not run. **Row 15**: the scroll gate CAN fail on this tree (it fails at 812×375 and
    900×500), but no ablated negative control was written.
12. **Gallery π** is proved for the guard by sha1 and the uncut-path identity. The tree's
    `typography.css` / `index.css` deltas were not read on the gallery surface.
13. **The two-confirms disagreement**: `GameControlPanel`'s ribbon has `keep` bare, while the
    gallery's keeps HEAD's boxed face until L5's proposal is ruled.

## Incidents (self-declared)

1. **The tree was not the pass-3 README's tree.** `git diff --stat` carries an untracked
   `gridPaths.cuts.test.ts` that the README does not list (its gap 3 says the join's unit gates were
   not written), and the content carries post-critique edits: `#fold-tools` restored in
   `GameScene`, `keep`'s outline restored, the ring mint struck, `@property --strip-len`, the radius
   throw, peek back with the play verbs. `pass3.diff` (banked 09-19 05:24) postdates both the README
   (09-18 22:46) and the critique (22:59). This was declared before any file was touched. The
   tracked file list matches the README's 16.
2. **The banked fallback hid the portrait tools off-screen** (y −6.41). Pass 4 found and cured it.
3. **The first publisher born-RED could not fail** (the ResizeObserver re-published). It was re-cut
   before it counted.
4. **The first tag draft failed `check-font-coverage`** (bound text). It was cured with static
   literals.
5. The deletion arm was measured by applying its patch to this tree, with HMR on the dev server,
   then reversed. The fallback state was verified byte-identical afterwards (`git diff` compare),
   and the same was done for the unit-baseline swap to `pass3.diff`.
6. The e2e runs wrote `test-results/` into the work tree; it was deleted. A pre-existing ignored
   `.vite-cache/` at the work tree root is not this lane's, and was left untouched.

## Replay route

In place. The tree was the chair's reset (`pass3.diff` applied at `74a2b5d9`), advanced by edit.
No git history was touched. The pass-4 delta over the pass-3 record is banked as
`pass4-over-pass3.diff` (5 files: GameControlPanel.vue, GameScene.vue, index.css, filterBudget.ts,
and GameGallery.vue reverted to HEAD; 128 changed lines). It was derived by applying `pass3.diff` to
a `git show 74a2b5d9` copy of the 17 paths and running `diff -ru` against this tree.

## Frames (4, ≤150 KB; they replace the swept pass-3 f1/f2/f3, `pass3/SWEEP.md` lines 32–36)

- `frames/f1-fallback-390x844-light-coarse-chromium-edge.png` (20.8 KB): ARM A, the portrait edge:
  the tongue in its berth and HEAD's ribbon under it. Replaces `f2-…-board-edge-proto.png`.
- `frames/f2-deletion-390x844-light-coarse-chromium-edge.png` (25.4 KB): ARM B, four tongues on the
  board's edge, no ribbon. Replaces `f2-…-board-edge-head.png`.
- `frames/f3-fallback-390x844-dark-coarse-webkit-tray-tag.png` (54.9 KB): ARM A, sheet up, the
  `new game` tag under the `new game` tab. Replaces `f1-390x844-dark-pencils-raised.png`.
- `frames/f4-fallback-812x375-light-coarse-webkit-flank.png` (78.4 KB): both arms, the landscape
  flank, with the strip's foot over the `controls` tongue (gap 2). Replaces
  `f3-1280x800-light-desk-top-edge-{proto,head}.png`.

## r0 rows MOVED

**L1** MOVED (5; proposed ceiling). **R3** MOVED RED→GREEN (the GREEN is contested by gap 9). **L5**
restored, not moved.

## Files

Instruments: `instruments/` (tabs-cells, tabs-tapes, tabs-tongue-hit, tabs-strip-publisher,
tabs-inert-filter, tabs-frame, gp-cmp, sum, del.py, law-probe.COPY / PROPOSED + the L1 diff,
deletion-arm.PROPOSED.diff, L5-gallery-guard.PROPOSED.diff). Readings: `readings/` (cell censuses
summarised, e2e summaries, law-probe runs incl. the plant).
