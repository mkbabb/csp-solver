# T9-W7 pass 5 · the fold-order rehearsal (batch 6)

Opus lane, 2026-09-23. Read-only on every worktree and on main. Scratch trees came from
`git archive 74a2b5d9`, `git init`, commit `base`. Each step ran `git apply --3way`, then a
commit. **The resolution policy that let the chain keep going is mechanical and it is NOT a
proposed merge.** Stages 1/2/3 went through `git merge-file --ours`: every clean hunk of the
incoming lane lands, and where hunks conflict the side already folded wins. Binaries keep
ours. Every conflicted file was saved with its markers before the resolve. The scratch trees
are deleted.

## Numbers first

| sequence | arm | step → conflict blocks (files) | total | files touched |
|---|---|---|---|---|
| §10 FACE → TAPE → RULE | **bank** (reported) | FACE 0 · TAPE 24 (6) · RULE 66 (14) + 1 binary | **90** | 45 |
| §10 FACE → TAPE → RULE | live | FACE 0 · TAPE 28 (6) · RULE 63 (15) + 1 binary | 91 | 49 |
| §13 → §7 (ERASE, LEDGER) → §3 (FIVE, SIX, GRAPHITE) | **bank** (reported) | VERB 0 · ERASE 6 (3) · LEDGER 24 (6) · FIVE 2 (2) · SIX 33 (11) · GRAPHITE 32 (8) | **97** | 77 |
| same | live | VERB 0 · ERASE 6 (3) · LEDGER 24 (6) · FIVE 2 (2) · SIX 38 (11) · GRAPHITE 34 (8) | 104 | 86 |
| §7 at the chair's seating (LEDGER → ERASE, §6.6), then §3 | bank | VERB 0 · LEDGER 4 (3) · ERASE 26 (6) · FIVE 2 · SIX 33 · GRAPHITE 32 | 97 | 77 |
| §13's bank laid onto the merged §10 tree (collision probe) | bank | 5 blocks (3 files); **index.css merged CLEAN and so seated the rungs three times** | 5 | 83 |

**vue-tsc -b** (web/frontend, node_modules symlinked from main, background and polled):
- merged §10 bank tree: **exit 1**, 9 errors, all in `GameControlPanel.vue`: `sectionIds`,
  `expandedPanel` ×6, `pencilsId` ×2, and an unused `uid`.
- merged §10 live tree: **exit 1**, 19 errors, all in `GameControlPanel.vue`. The nine above
  plus `onMounted` ×2, `useMediaQuery`, `clearArmed` ×3, `keepAsk`, `disarmClock` ×2 and an
  unused `barAsking`.
- control, FACE's bank alone: **exit 0**.

The three banks do NOT apply as a stack. The red is the ours-policy hybrid: RULE's clean
hunks delete the tabs' state and imports, while the conflicting template hunks keep
FACE/TAPE's tabs that read it. No lane is red on its own.

Order sweeps (bank patches, cumulative blocks as a proxy for merge cost):
- §10, all six orders: F-T-R 90 · F-R-T 90 · T-F-R 90 · T-R-F 89 · R-F-T 83 · **R-T-F 81**.
  The spread is 9 blocks (10%). RULE and FACE collide 18 blocks when paired and TAPE and RULE
  60, so the cost is the RULE × {FACE ∪ TAPE} overlap whatever the order. The chair's
  **F-T-R** (the leader's block lands first) costs 9 blocks more than the cheapest order and
  keeps the leader's `@property` block as the base every later lane merges against.
- §3 onto §13+§7, all six orders: **F-S-G 67** · F-G-S 66 · S-F-G 69 · S-G-F 69 · G-F-S 71 ·
  G-S-F 72. The leader goes first (FIVE, 2 blocks against §13), and the other two cost ~65
  whichever comes second.
- §7: ERASE→LEDGER 6+24 and LEDGER→ERASE 4+26, 30 either way. The chair's LEDGER-first
  seating moves the cost onto ERASE and does not change it.

## Which arm is reported: bank, with live beside it

A live patch is the same cut the chair made: a temporary index, `add -A` (tracked + untracked),
then `diff --cached --binary 74a2b5d9`. The tree's own index is not touched. `git diff --binary
HEAD` was also taken, but it drops untracked files: FACE's `keys-crib.spec.ts`, TAPE's and
RULE's `ConfirmRibbon.vue`, RULE's `RuledGroup/RuledLine.vue`, and VERB's seven new files. So
it is not a foldable patch.

| lane (tree) | bank B / files | live B / files | moved past bank |
|---|---|---|---|
| CTRL-FACE `-33` | 255,009 / 20 | 323,903 / 24 | yes |
| CTRL-TAPE `-27` | 218,064 / 22 | 257,319 / 26 | yes |
| CTRL-RULE `-28` | 264,849 / 32 | 291,132 / 33 | yes |
| MOT-VERB `-59` (merged §13) | 282,146 / 50 | 359,787 / 55 | yes (pass-5 LADDER + VERB deltas) |
| NOTE-ERASE `-47` | 80,332 / 15 | 84,487 / 16 | yes |
| NOTE-LEDGER `-46` | 95,021 / 11 | 100,008 / 11 | yes |
| ACC-FIVE `-41` | 91,903 / 12 | 107,515 / 15 | yes |
| ACC-SIX `-45` | 92,497 / 15 | 112,985 / 17 | yes |
| ACC-GRAPHITE `-40` | 109,086 / 19 | 109,086 / 19 | **no, byte-identical when I cut it.** Its batch-6 lane is running beside this one: the tree read 19 porcelain entries at the cut and 22 at my return. |

## §10 — the conflicts, file:hunk, both sides (bank arm)

**TAPE onto FACE (24 blocks, 6 files).**
- `src/assets/index.css` (6 blocks, base lines 104-109, 220-225).
  - [1] header of the §6.5 block. FACE: "§10's leader", taken verbatim from TAPE and cited.
    TAPE: its own "CTRL-TAPE, §10's leader" header.
  - [2] the clauses. FACE: four numbered clauses (first static sheet, `inherits: true`, an
    initial that fails visibly, ablation on a declaring host) cited to `face-law.spec.ts`.
    TAPE: the loudness row in `zone-grammar.spec.ts` plus "initial must be absolute".
  - [3] the out-list. FACE adds `--printed-*` and `--ring-ink`. TAPE keeps `--face-*` only,
    and its `--washi-tag-rung` ablation prose is longer.
  - [4] FACE registers `--card-pad-t`. TAPE has no such registration.
  - [5] FACE registers `--fold-tools-h`, `--strip-len`, `--head-rule` and **the six §13 rungs
    at 0ms**. TAPE's paragraph says the six rungs are struck here and belong to MOT-LADDER.
    **This is the @property collision.**
  - [6] the `--ring-ink` seam. The two lanes word the same copy-of-LIVE's-line note differently.
- `src/assets/typography.css` (2).
  - [1] FACE adds the face law (`--face-printed/written/mono`, `--printed-weight`). TAPE adds
    `--type-name: var(--type-heading)` (25.888px) and re-points `--type-group-title`.
  - [2] `.section-heading`: FACE reads `--face-printed`. TAPE deletes the display face from
    the rule.
- `src/games/shared/GameControlPanel.vue` (13).
  - [1] `headingClass`: FACE keeps `activeColorClass`. TAPE deletes `headingClass` and its two
    inks.
  - [2] the mobile tab head: FACE's `mobile-heading-btn` pressure form. TAPE's `<h2
    class="tape-host">` tape.
  - [3] the `what fits` caption: FACE strikes the 3.75rem column. TAPE wraps it in
    `<h2 class="tape-host">`.
  - [4] FACE's leading-covenant note. TAPE's "second axis: rank is where the tape is stuck".
  - [5] first-well margin: FACE keeps HEAD's 0.35rem and buys the clearance in the leading.
    TAPE kills the 2rem through `--pin-band`.
  - [6]–[7] `.zone-row-label`: FACE's printed caption on the left axis. TAPE's "fixed column
    dead", with the row caption as a flat row tape.
  - [8] FACE keeps `.zone-row-stacked`. TAPE deletes it.
  - [9] `.mobile-heading-row`: FACE's 8px daylight. TAPE's "the tabs are two row tapes".
  - [10] FACE's ring on the tab (`--ring-ink`, bare). TAPE's `.mobile-heading-head
    .section-heading { margin: 0 }`.
  - [11] `.heading-value`: FACE's `--face-written`. TAPE's `--font-hand` + `transform: none`.
  - [12] tab switch: FACE's ink move on `--motion-whisper`. TAPE's pressed/lifted pose at 0.68.
  - [13] hover: FACE fences the lift to `[aria-expanded=false]`. TAPE's lift runs 0.68 → 1 on
    opacity.
- `src/pencil/sheet/SheetWashiLabel.vue` (1). FACE declares `font-family: var(--face-written)`
  on `.washi-tag`. TAPE adds `--washi-tag-leading` (1.5 fallback, the card asks for 1.2).
- `scripts/check-font-coverage.mjs` (1). FACE moves the row captions to the Fraunces corpus.
  TAPE moves `.section-heading` into Patrick Hand and re-cases `Size`/`Level`.
- `e2e/visual-regression.spec.ts` (1, the seal's comment block). FACE prices 1258.47/1259.34.
  TAPE prices 1303.44/1303.31.

**RULE onto FACE+TAPE (66 blocks + 1 binary, 14 files).** Pairwise, RULE onto FACE alone
costs 18 blocks + the binary across 8 files, and RULE onto TAPE alone costs 60 across 11. The
ruled page deletes the tapes, the tabs and the captions that FACE and TAPE both re-dress.
- `src/games/shared/GameControlPanel.vue` (39). RULE deletes things the others keep:
  - `showTabs`, `expandedPanel`, `valueLabel` and the sections' ids [3][5];
  - the mobile tab row's whole block, where ours has 149 lines [39];
  - `.zone-row-label` [29];
  - the `useMediaQuery` import [1];
  - the `($event)` args on the verbs [21][23].

  RULE adds `RuledGroup`/`RuledLine`, a `HandDrawnOutline` act-face on every verb [20][22][24][25]
  and "acts are the only boxed things" [32] against FACE's "one ring for the whole card".
  The foot's teleport/berth [8][11][19] and the confirm's cell [36] were written twice, by
  TAPE and by RULE. Each side's `data-under-bar` retirement prose conflicts [9]. The `.info-btn`
  ring deletion is worded twice [37].
- `src/assets/index.css` (6).
  - [1] Fraunces re-cut note: FACE's "face law". RULE's "`p`, for `players`".
  - [2] the §6.5 header: FACE/TAPE's landed block. RULE's "PROVISIONAL, the leader's to land".
  - [3]/[5] RULE registers `--card-foot-h` in its own spot. Ours carries `--card-pad-b`,
    `--pin-band` and the rest.
  - [6] `--ring-ink`: ours says "nothing is declared at this seam". RULE re-declares LIVE's
    line verbatim at this seam.
- `src/games/shared/scene.css` (5).
  - [1] card cap less the foot: TAPE's §1.3 prose. RULE's §2.6 prose.
  - [2] the pin band: TAPE's closed-form `--pin-band`. RULE's focus-scroll block.
  - [3] the sticky pin: `top: calc(-1 * var(--pin-band))` against RULE's `--card-pad-t`.
  - [4] the 390 seam: TAPE's `--masthead-foot`. RULE's +6.00 floor.
  - [5] RULE's "less the case's foot" comment against no counterpart in ours.
- `e2e/zone-grammar.spec.ts` (4). Ours pins eyebrow = 2, the bar outside the card and the
  button's sibling heading. RULE pins "0 eyebrows, tapes and captions", a
  `.drawer-case .action-bar`, `inFoot`, and no heading in a button.
- `scripts/check-font-coverage.mjs` (3). Ours has FACE's `deckOptionLabels` and value
  corpus. RULE has its group-name extractor and the confirm line.
- `e2e/font-census.spec.ts` (2). RULE retires `Easy/Medium/Hard`. Ours keeps a different
  comment.
- `typography.css` (1). FACE's face tokens against RULE's "the chip is one number" (20px).
- `GameScene.vue` (1). TAPE's foot-berth comment against RULE's.
- `OptionSelector.vue` (1). The base `.ctrl-word` box against RULE's 8px inline padding in
  the card.
- `pencilConfig.ts` (1). TAPE's "ink lift is not a row" against RULE's deletion of
  `ruleDrawMs/inkLiftMs/ribbonMs`.
- `SheetWashiLabel.vue` (1). Both delete `[data-under-bar]` in different words.
- `GameControlPanel.test.ts` (1). The APG disclosure test against RULE's "three voices
  become one".
- `visual-regression.spec.ts` (1). FACE's priced comment against RULE's 1043.98 restamp prose.
- **`src/assets/fonts/fraunces-subset.woff2`**. Base 14,636 B, ours 14,896 B (FACE's re-cut),
  RULE 14,912 B. Both add `p` by the same recipe, but the bytes differ. **ONE re-cut at the
  fold, from the union corpus.**

`ConfirmRibbon.vue` is new in TAPE and in RULE, byte-identical (blob `9b9f01eb`, md5
`64917ca1…`), so it merged clean.

Live arm differences:
- TAPE onto FACE has 28 blocks, 17 of them in GCP.vue.
- RULE has 63 blocks. `visual-regression.spec.ts` drops out because RULE reverted its seal,
  and `e2e/share-truth.spec.ts` comes in (`.controls-card .action-verbs … :not(.info-btn)`
  against `.drawer-case .action-verbs`).
- index.css has 8 blocks: RULE now also registers `--toggle-foot` and `--card-head-clear`
  (W2 §2.4 PROPOSED), and FACE registers `--zone-step` (M17).

## §13 → §7 → §3 — the conflicts (bank arm)

- **VERB** onto base: clean (50 files).
- **ERASE** onto §13 (6 blocks, 3 files):
  - `index.css` [1] the `--ease-accelIn` comment (base 96-101 / 338-347). [2] RUB OUT: VERB's
    clip-retreat keyframes against ERASE's rub-back, half the arrival and a Vue leave
    (base 1121-1126).
  - `MarginNote.vue` [1] VERB writes `ink-write-in … var(--verb-writeIn-ease)` and ERASE
    re-forms the arrival over 77 lines. [2] `--verb-writeIn-ease` against
    `--ease-noteWrite`.
  - `pencilConfig.ts` [1] VERB's 271-line ladder doc against ERASE's 57. [2] VERB's
    rendered-values function ("the registration is not here") against ERASE's
    `publishMotionRungs` emitter.
- **LEDGER** onto §13+ERASE (24 blocks, 6 files):
  - `GameBoard.vue` (10): ERASE's `marginKind` state/record/grade against LEDGER's
    `marginLive` + `previous`, and the same call sites write `"state"` against `"empty"`.
  - `MarginNote.vue` (6): ERASE's out-in rub against LEDGER's line-two ledger (`previous`,
    `previousSeq`, `hidePrevious`).
  - `check-ink-pressure.mjs` (5): two `gateNote` shapes.
  - `main.ts` (1): `publishMotionRungs` imported from `pencilConfig` against LEDGER's
    `motionRungs.ts`.
  - `index.css` (1): the rub-out keyframes.
  - `pencilConfig.ts` (1): the ladder doc.
- **FIVE** onto §13+§7 (2 blocks):
  - `GameControlPanel.vue` `.sparkle-icon`: VERB's rung transitions against FIVE's
    `--sparkle-glow-soft` + 200ms.
  - `HandDrawnGrid.vue` `.progress-trace`: VERB's rungs against FIVE's
    `v-bind(traceWinMs)`.
- **SIX** onto FIVE (33 blocks, 11 files):
  - `index.css` (7): the user-ink tier (FIVE's crayon-blue ink tier against SIX's "blue has
    one job"), the focus-sketch note, the progress ink (FIVE's gold against SIX's sixth-anchor
    violet, 118 lines), the dark arms of both, and the two print/forced-colour arms.
  - `HandDrawnGrid.vue` (8): FIVE's `fillFraction`/`traceFront` against SIX's `progress`
    counts/`traceFrames`, FIVE's rate gate, and the dash transition kept or deleted.
  - `gridPaths.ts` (6): FIVE's memoised `poseGeometry` against SIX's `poseLengths`.
  - `check-theme-tokens.mjs` (3): FIVE's reverse census against SIX's law 20.
  - `GameGallery.vue` (2), `GameBoard.vue` (2, including the `:meta` count line),
    `DifficultyTally.vue` (1), `MarginNote.vue` (1), `HandwrittenGlyph.vue` (1),
    `GameControlPanel.vue` (1, the glow gold against a named violet), `check-font-coverage`
    (1).
- **GRAPHITE** onto FIVE+SIX (32 blocks, 8 files):
  - `HandDrawnGrid.vue` (12): the gold gauge against GRAPHITE's graphite tick tally
    (`--color-pencil-graphite`, stroke 10), `joinFront` against `joinFrontFrames`, and a
    win tween against no tween.
  - `index.css` (5): FIVE's crayon-blue ink against GRAPHITE's "the default is the pencil",
    GRAPHITE deferring `--color-focus-sketch` to §6, and the gold progress ink against
    GRAPHITE's ground wash.
  - `gridPaths.ts` (5): the same function, formatted differently (prettier-wrapped), plus
    GRAPHITE's `poseLengths` off the memo.
  - `DifficultyTally.vue` (4), `GameBoard.vue` (3, `fillCount` against `fillProgress`),
    `GameControlPanel.vue` (1, gold glow against no glow), `HandwrittenGlyph.vue` (1).
  - `gridPaths.poseFronts.test.ts` (1): **a new file in FIVE and in GRAPHITE, not identical**.

## The `@property` collision (registry-v4 §6.5: ONE block — §13's rungs, §10's lengths)

| tree | registrations of the six §13 rungs | where |
|---|---|---|
| FACE bank / live | 6, at 0ms | FACE's §10 block (`index.css`, file scope). FACE also registers 11 lengths (live 12, adding `--zone-step`). |
| TAPE bank / live | 0, struck (correct) | 7 lengths in the bank, 5 live |
| RULE bank / live | 0 | its own `--card-pad-t`, `--card-foot-h`, `--card-pad-x`; live adds `--toggle-foot`, `--card-head-clear` |
| MOT-VERB bank | **12 + `--motion-rise`**: once at file scope (bank index.css ~398) and once **nested in `:root {}`** (~582) | the §6.5 "twice in source" breach |
| MOT-VERB live | 7 (six + `--motion-rise`), once, at file scope (~418) | cured in pass 5 |
| NOTE-ERASE | 6 at file scope (live 7), its own block | a re-mint |
| NOTE-LEDGER | emits `@property --motion-${n}` from `motionRungs.ts` | clause-1 breach (publisher-emitted) |

Merged trees:
- **§10 merged (s10):** one block, with 11 lengths plus FACE's six rungs.
- **§13 laid onto s10:** index.css merged WITHOUT a conflict, and each rung is registered
  **three times**. The copies sit at FACE's ~251-276, VERB's file scope ~588-613 and VERB's
  nested ~783-808, plus `--motion-rise` once. **The textual merge is silent on the
  collision, so the fold has to delete by hand.**
- **§13+§7+§3 merged:** the rungs appear ×3 in the bank arm (ERASE ~113, VERB ×2) and ×2 in
  the live arm (ERASE, VERB). The live arm adds `--live-fit` (VERB), and `motionRungs.ts`
  keeps its emitter.

The fold keeps LADDER's seven at file scope and FACE's lengths beside them. It deletes FACE's
six rungs, ERASE's block, VERB's nested `:root` copy (the bank arm only) and LEDGER's emitter.

## index.css hunks that overlap (base lines at 74a2b5d9, ±3)

- **§10:**
  - FACE×TAPE: 104-109 (the `@theme` head, where the block is seated) and 220-225 (the
    `--color-focus-sketch` line).
  - FACE×RULE: 64-76 (the Fraunces re-cut note) and 104-109.
  - TAPE×RULE: 104-109 and 264-269 (the `--ring-ink` seam).
  - The live arm adds FACE×VERB 3-8/1-5 (file head) and TAPE×VERB 662-668/664-672.
- **§13×§7:** VERB×ERASE 338-361/339-347 (`--ease-accelIn`) and 1121-1126 (the note
  keyframes). VERB×LEDGER 1121-1126. ERASE×LEDGER 1121-1126.
- **§13×§3:** VERB×FIVE 587-614/580-602 (merged clean).
- **§3:**
  - FIVE×SIX: 7 overlaps (147-154, 219-229, 264-281, 369-375, 393-410, 919-928, 945-953).
  - FIVE×GRAPHITE: 7 (147-154, 170-185, 216-229, 264-281, 369-384, 400-411).
  - SIX×GRAPHITE: 6.
- **Across sections** (no rehearsal joined these, but the wave fold will):
  - §10×§3 at 220-225 (focus-sketch) and 264-269/264-281 (the ring seam against the accent
    inks).
  - §10×§7 at 96-109.
  - FACE×GRAPHITE at 461-466/453-465.

## The seal constant's sites

There is one product site: `web/frontend/e2e/visual-regression.spec.ts` test 10, "the iPad
coarse card stays under the P1 seal", `const SEAL`. Its teeth are `toBeLessThanOrEqual(SEAL)`,
the negative control `toBeGreaterThan(SEAL)` and `reverted - shipped > 30`.

| tree | value | line |
|---|---|---|
| base `74a2b5d9` | 1227.5 | :821 |
| FACE | 1261 (shipped 1258.47 / 1259.34 + 2.6 slack) | :844 |
| TAPE | 1306.0 (shipped 1303.44 / 1303.31, name rung 25.888) | :850 |
| RULE bank | 1046.5 (1043.98 + 2.52) | — |
| RULE live | 1227.5, **reverted per the chair's no-in-lane-restamp rule** | :845 |
| merged §10 (ours policy) | 1261, FACE's (bank :863, live :868) | — |

The inputs the seal prices are written in three places, and each is a conflict above:
- TAPE's `scene.css` publishes `--pin-band: calc(0.6rem + var(--washi-tag-h))`.
- FACE's block registers `--pin-band`.
- RULE's sticky pin reads `--card-pad-t`.

One evidence-only copy carries the old value: `evidence/w7/exec/integrate/seal-probe.mjs:7`,
1227.5.

**The chair's one stamp has to come from the tree the §10 hand-merge produces.** No lane's
number survives that merge: FACE's 1261 is ours-by-policy, and it prices a tree that no longer
exists.

## Findings for the chair

1. §10 is not a stack of three patches. It is a hand-merge centred on `GameControlPanel.vue`
   (TAPE+RULE 52 blocks, 13 + 39). RULE's ruled page deletes the tab/tape/caption surfaces
   that FACE and TAPE both re-dress. Of RULE's 66 blocks, 60 are against TAPE and 18 against
   FACE; blocks are counted per pair, so they overlap.
2. The `@property` collision is textually SILENT across sections: §13 onto §10 gives 3× rung
   registrations and no conflict. A census gate (`@property` names unique, none nested, none
   emitted) belongs in the fold battery.
3. `fraunces-subset.woff2` was re-cut twice (FACE and RULE) with different bytes, so it needs
   one re-cut from the merged corpus.
4. `gridPaths.poseFronts.test.ts` was born twice (FIVE and GRAPHITE) and differs, so it needs
   one file.
5. §7's order does not change the cost (30 blocks either way). The chair's LEDGER-first
   seating stands on design grounds alone.
6. `vue-tsc -b` on the rehearsal's §10 tree exits 1, with the red confined to
   `GameControlPanel.vue`. FACE alone is 0.
