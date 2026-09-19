# CTRL-FACE — pass 3 PROTOTYPE · the printed face, re-priced on the real word

**It RUNS.** Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33`,
branch `wf_f72f3b5a-83a-33`, cut from **`74a2b5d9`**, uncommitted (the agglomerator reads
`git diff --stat`). Prototype server `127.0.0.1:4234`, HEAD control `127.0.0.1:4235`
(`git archive HEAD` of `74a2b5d9`, its own `cacheDir`, node_modules symlinked), dist preview
`127.0.0.1:4236`. Both engines everywhere. **All three killed; the band holds none of this
lane's ports.**

**One sentence:** three of the spec's rules did not survive the surface — the mark's overhang was
being clipped away by the box it was painted in, the caption's line count was being read off a
flex item that generates one box however many lines it takes, and the tape's paper-over-glyph was
being read off a `Range` that is the font's ascent+descent and sits OUTSIDE the paper by design at
1.05 leading — and each of the three is now measured off the bitmap, where it can fail.

---

## 0 · The replay (chair §7)

`git` aimed at the pass-2 worktree is refused by this session's isolation, so the route taken was
better than a file copy: pass 2's diff is BANKED at
`pass2/prototype/CTRL-FACE/proto/ctrl-face-p2.diff` and was applied with `git apply --3way`.
**Eleven of twelve files clean, including both woff2 cuts** (the banked diff carries them as
binary; `fraunces-subset.woff2` 14,896 B and `patrickhand-subset.woff2` 4,896 B landed
byte-for-byte, and the coverage gate's own cmap read confirms 31 / 53 codepoints). `vue-tsc
--noEmit` **exit 0** on the replayed tree before any pass-3 edit.

**One conflict, in `scripts/check-font-coverage.mjs`, resolved TOWARD THE FOLD** (the chair's
rule), in two hunks: the fold's `paperNoteCopy` extractor and pass 2's `deckOptionLabels` both
live; the fold's `.error-note-text` corpus row and pass 2's `.tray-well .ctrl-btn +
.heading-value` row both live. One further re-cut the fold forced and the merge could not: **the
fold renamed `candidates` -> `what fits`**, so the Fraunces corpus's caption row carried a string
the card no longer ships, and the fold's own caption row sat in the PATRICK HAND corpus (true at
its HEAD, false under the face law). The pair moves to Fraunces with the new word; the hand's copy
is deleted with its reason written where it stood.

---

## 1 · What the surface refuted this pass

| the spec said | MEASURED, both engines | what it took |
|---|---|---|
| `background-size: calc(100% + 0.5rem)` gives a 4px overhang each side | **0.33px left / 0.67px right** (chromium), 0.33 / 1.00 (webkit): the painted mark was **25.00px over a 24.48px word** | a background is CLIPPED to its element's box, so the word's PAINT box has to be the wider one. `padding-inline: 0.25rem` with `margin-inline: -0.25rem`, which hands the same 8px straight back to the flow. -> **4.33 / 4.33** and **4.33 / 4.00** |
| `.mobile-heading-row { padding-top: 0.35rem }` stands | 0.35rem reads **+1.72 / +2.30** (chromium under the +2.0 floor); 0 reads -3.87 / -3.29 | pass 2's **0.5rem** stays. Swept in place at five cells; shipped reads **+4.13 / +4.71**, 0px^2 |
| a caption's line count is `getClientRects().length` | with `white-space: normal` the same caption **still reports one rect** while its height goes 31.06 -> 62.13 | a caption is a FLEX ITEM: one box, any number of lines. The count is `height / line-height`, and the ablation reds it |
| paper-over-glyph gated per tape on a Range basis | the Range box is ascent+descent: **-2.53 / -1.36** (chromium), -1.91 / -1.91 (webkit) on a tape whose every letter is visibly inside it | the Range basis is not asserted at all (it would red a correct card). The painted basis is, off the tape's own bitmap |

---

## 2 · Every gate, with its number

| # | gate | reading | |
|---|---|---|---|
| 1 | heading-voice ROW 1 | **1 voice** `Fraunces · 25.89 · 800 · lowercase`, n=8, at desk 1280 / dock 390x844 / land 900x500 / gallery, both engines (**HEAD: 3 voices** — `Patrick Hand · 14 · 500 · lowercase`, `Patrick Hand · 14 · 400 · none`, `Fraunces · 20.35 · 800 · lowercase`) | GREEN |
| 1 | ROW 3 | **1.2945** at all four cells both engines (**HEAD 1.0175**) | GREEN |
| — | ROW 2 | **2 of 8** document headings, unchanged from HEAD. Recorded, NOT claimed — W3's row; the instrument is left failing on it | RED, declared |
| 2 | CHECK 6 re-cut + derive floors | `font coverage OK`, 3 faces, cmaps **31 / 53 / 22**, bytes **14,896 / 4,896 / 3,624**. F2's hole CLOSED: `.washi-label` is a listed site now and reads `--face-written` (it and `.washi-tag` are two face homes on ONE element, and the unlisted one was invisible to both closures). `atLeast` floors: washiTags 4, zoneRowLabels 2 | GREEN |
| 3 | THE CAPTION IS ONE LINE | **1 line** at 320 / 360 / 375 / 390 / 430 / 900x500, both engines. `marks` 87.00 (wk 87.03), `what fits` **120.69** (wk 120.72), each 31.06 tall against a 31.07 leading. Ablated: `white-space: normal` -> 68.13 x **62.13** (wk 68.14 x 62.09) | GREEN |
| 3b | the two-chip row still fits | `.options-row` **159.31** at 320 · 199.31 at 360 · 214.31 at 375 · 229.31 at 390 · 269.31 at 430 · 739.31 at 900x500, against the 95.2 floor (44 + 7.2 + 44) | GREEN |
| 4 | THE INK GATE on `what fits` | `checking`'s paper over the caption's ink **+11.39 / +10.91**; worst descender **+0.98 / +0.00** — see §4.2 | GREEN, with a gap |
| 5 | ENGINE IDENTITY of the chip mark | the card's mark is derived from the WORD: painted **32.67px** (chromium) / **32.00** (webkit) over a 24.48px word — **0.67px apart**, against HEAD's `ch` pricing which is **8.00px apart**. The structural half reds if `ch` returns | GREEN |
| 6 | PAINTED OVERHANG | from the chip's bitmap: mark cols [24, 121] vs glyph cols [37, 108] @dpr3 -> **left 4.33 right 4.33** chromium; [24, 119] vs [37, 107] -> **4.33 / 4.00** webkit. Band [2, 8] | GREEN |
| 7 | THE OPEN HEAD IS INERT | press it: `aria-expanded` true -> true, **0 mutations**, innerHTML length unchanged (238,163 chromium / 238,282 webkit). No head carries an underline; open ink != shut ink. Ablation is by DELETING the hover rule, never `color: inherit` | GREEN |
| 8 | PRINTED COUNT == the derivation | **8 == 4 tapes + 2 captions + 2 sections** at every cell both engines | GREEN |
| 9 | `lh` FEATURE FLOOR | `check-support-floor.mjs` **check 6**, re-derived against browserslist the way check 2 re-derives Lightning's: chrome 111 >= 109, edge 111 >= 109, firefox 128 >= 120, safari 16.4 >= 16.4, ios_saf 16.4 >= 16.4. Self-test **BITES** on a firefox floor of 119. The built-css `-1lh` grep is kept, LABELLED a guard, and it is present in `dist/assets/index-*.css` | GREEN |
| 10 | CONTRAST, two cells, tabs opened | 1280 fine **n=28**; 390 coarse **n=32** — the coarse cell is where `.heading-value` exists at all, which is F3's whole point. Worst light **4.66** `.icon-sublabel`, worst dark **6.05** `.heading-value` | GREEN |
| 11 | hand weight 400 | every card `.ctrl-btn` computes `Patrick Hand · 400 · lowercase` (**HEAD: Fira Code, 400 and 700**) | GREEN |
| 12 | GALLERY pi | **328 numbers** paired against the `74a2b5d9` control at 1280 fine / 390 fine / 900x500 coarse / 768x1024 coarse, both engines: **worst abs delta = 0.0000px**. Deck labels `Patrick Hand · 16 · 800`, deck chips `Fira Code · 16 · 400`, identical both trees | GREEN |
| 13 | tape covenant AT THE CONSUMER | per well, box-with-tape minus box-with-`display:none`: max abs delta **0.016px**, four wells, both engines (+/-0.25). On the gallery route the card's tape margin goes -24.712 -> -30.796 and its BOX does not move — the `1lh` pull, proved twice | GREEN |
| 14 | paper over the PAINTED glyph, per tape | `new game` 7.67/2.54 of 31.54 · `pencils` 3.33/**-0.02** · `checking` 4.00/2.87 (chromium); 9.33/2.52 · 5.00/**-0.04** · 4.67/3.85 (webkit). `players` EXCLUDED BY NAME (`opacity: 0` at rest, its own admission gate) and the exclusion is counted, so a tape that stops painting for any other reason reds | GREEN, with a gap |
| 15 | the seal, restamped ONCE with both controls | shipped **1258.47 chromium / 1259.34 webkit** at 1280 coarse; the `74a2b5d9` control reads **1227.09 / 1228.06** and the ablation moves it **0.00** there (the born-RED half). Negative control 0 (captions to the hand rung) drops the card **31.25 / 31.21**, floor 28. SEAL stays **1261** — 1.66px of headroom on the taller engine, TAPE's one §6.1 restamp, not a second constant | GREEN |
| — | standing | vitest **68 files / 830 tests**, 0 failed · face-law + access + zone-grammar + font-census **both engines, 0 failed** · filter-census **12/12 off the dist** · goldens **4/4 off the dist preview** · lint:copy/ink/motion/theme-tokens/theme-selectors/boundary/live-regions/catch/sleep/lanes, test:e2e:projects, test:e2e:retries, support-floor, font-coverage, eslint, prettier, `vue-tsc` and `vue-tsc -p tsconfig.e2e.json` — **all exit 0** | GREEN |

Card heights, paired, both engines: 320 **352 == 352** · 360 **524 == 524** · 375 **596 == 596** ·
390 **628 == 628**. The dock card is bounded by its sheet's scrollport, so the card's own box is
pi at every phone cell; the height the face buys is the 1280-coarse rail's, in row 15. Chip box
**44.00 x 44.00**, HEAD and prototype alike, at every coarse cell.

---

## 3 · What this pass built that pass 2 did not

**`e2e/face-law.spec.ts`** — the pass-2 critique's F1 was that this family's law lived in
`readings/` and the estate had acquired five of fifteen rows, so a rung change on
`--type-group-title` redded nothing. The file carries ten: the printed voice and the derived count
(x3 cells), the caption lane (x6 cells), the clearances and the per-tape paper (x4 cells), the
written chips, the painted overhang, law 14's inertness, the tape covenant, and the `-1lh` guard
labelled as a guard. It is in `SPEC_MANIFEST` in both engines, and the pw census is restamped.

Its instrument is one helper, `paintedExtent(page, target, suppress, byRow)`: two crops of the
SAME element differenced, so the pixels a layer painted are the pixels the two bitmaps disagree
on. It answers the two questions no API answers — WebKit's `actualBoundingBoxLeft/Right` is the
advance box, and a `Range` is ascent+descent — and it is the same instrument for a mark and for a
word. Its settle is two animation frames, not a clock (`lint:sleep` refused the first form and was
right to).

**`scripts/check-support-floor.mjs` check 6, UNITS REACHABLE.** The `-1lh` build grep cannot fail:
Lightning CSS does not down-level a unit at any target, so the token ships verbatim whatever the
floor is. The row that CAN fail is the promise — below the unit the whole `calc()` is invalid at
computed-value time and the margin shorthand is dropped, which is
`GameControlPanel:1536-1540`'s documented class, in production, silently. `CSS_UNIT_FLOORS`
declares `lh` with its per-engine first version and the browserslist floor is re-derived against
it; the self-test bites on a firefox floor of 119.

**CHECK 6's hole, closed where it was.** `.washi-label` and `.washi-tag` are two face homes on one
element (`span.washi-label.washi-tag`, 97 lines apart in one file), and the check builds its class
list from the selectors it names — so the unlisted home was invisible to both closures, and the
critic falsified it by pointing `.washi-label` at the display face for a green `font coverage OK`.
Both homes are named now; the label reads `--face-written`, zero paint change.

**`atLeast`, the derive-count floor.** The existing check catches only a derivation that found
NOTHING. A rename that leaves one of two captions still derives a non-empty subset of a declared
list and stays green while the corpus quietly becomes hand-written again — which is the exact
shape of the move this pass had to absorb.

**The motion window left the template.** `duration-250` (HEAD) then `duration-150` (pass 2) were
Tailwind utilities spelling a motion number where no rung could reach it and no PRM arm could see
it. It is a CSS declaration on the two spans that move, reading the rung, with a PRM arm at 0ms.

---

## 4 · Gaps — every one of them

1. **`pencils` has ZERO paper under its descender.** -0.02px chromium / -0.04px webkit on the
   painted basis: at the display leading (1.05) the `p` lands exactly ON the tape's bottom edge.
   The gate's bottom floor is -0.5 (a third of a device pixel at dpr 3 is the whole of the
   difference; the sweep that priced this rung read -0.59 at leading 0.95, a real overhang, and
   that reds). REPORTED, not tuned away: the tape has 0.32px of vertical padding and the pull is
   arithmetic on its line box, so buying headroom here costs flow. **For the chair.**
2. **The INK gate's worst-descender arm reads +0.00 on webkit** (+0.98 chromium). `what fits` has
   no descender, so the arm is a synthetic `pgjqy` measured as a font metric at a fixed position,
   and the two engines disagree by ~1px on how deep this face draws at this rung. The row is GREEN
   because the floor is +0.5 against a clearance of +10.91 — but the worst-case arm itself sits at
   zero on one engine. **Named.**
3. **`--motion-whisper` does not exist on this tree.** It is §13's token (TAPE registers it, §10's
   leader publishes it) and this family only consumes it — but §6.5's no-fallback form is invalid
   at computed-value time against an absent publisher, which drops the whole declaration and ships
   a SNAP dressed as a law. The consumption is `var(--motion-whisper, 150ms)`, the same shape pass
   2 used for `--ring-ink` and for the same reason, with the estate's own shipped number as the
   fallback. **A declared divergence from §6.5; the chair owns it.**
4. **ROW 2 (document rank) is RED and stays RED.** 2 of 8. W3's row; the moved instrument is left
   failing rather than softened.
5. **The deck's `ch` split is NOT cured, it is NAMED.** Measured on this tree at 1280 fine:
   `9x9`'s mark is **38.4062px chromium vs 32.00px webkit**, `16x16`'s **57.6094 vs 48.00** — one
   `ch` is 9.6016 vs 8.0000 at the deck's pinned 16px, a **20.0% split shipped today**. Fira
   Code's subset carries no `0`, so webkit takes the 0.5em fallback. The cure is the card's: price
   the mark off the rendered word. The deck is pi for this wave, so it is a **ledger row for the
   deck's owner** with the cure stated, and one reviewed re-mint at the fold with the owner's eye.
6. **Check 6's per-engine versions are MDN facts written in the file**, not derived from anything
   on disk. Cited inline; they are the only constants the row has.
7. **No 844x390 landscape reading.** §6.2 scopes the seam law to portrait and asks every §10 lane
   for W2 §2.2's reachability probe at that cell. This lane measured 900x500 coarse and not
   844x390. **Not done.**
8. **The wobble probe was NOT run.** No board mark, cell or glyph is touched by this diff
   (`git diff --stat` names no board file). Stated, not measured.
9. **The hue census was NOT re-run.** Delta 0 by construction: **zero hex added** to `src/` in this
   diff (grepped: 0 matches on added lines), zero palette token re-valued; the caption's ink moves
   from one existing token to another (`--ink-press-quiet` -> `--printed-ink`, which resolves to
   `--color-foreground`).
10. **`shared-class-census.mjs` does not exist in `scripts/`.** The consumer census was taken by
    grep instead: `SheetWashiLabel` has **4** consumers (GameBoard, GameControlPanel, StagingBand,
    GameCard), `OptionSelector` **3** (GameControlPanel, StagingBand, GameCard), `.ctrl-word` **2**
    (GameControlPanel, OptionSelector). Every non-card consumer is at HEAD's face — proved by the
    gallery pi row, not by the grep.
11. **The first goldens run answered on a foreign `:3000`** (the estate's golden config falls back
    there) and passed 4/4 in 3.4s before I noticed. It is DISCARDED; the run of record is
    `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4236`, this lane's own dist preview, 4/4.
12. **And then the hard part.** Nothing here adjudicates whether a card that speaks in one
    25.888px printed voice at 320px wide is the card the owner wants. `marks` takes the row's first
    line at 320 and 360 and sits beside its chips from 375 up; `what fits` sits beside its two
    chips at every cell. Both are HEAD's own wrap doing its job, and both are U-10's to accept.

---

## 5 · Files

Product (in the worktree, uncommitted): `e2e/face-law.spec.ts` (new) · `e2e/access.spec.ts` ·
`e2e/font-census.spec.ts` · `e2e/visual-regression.spec.ts` · `e2e/zone-grammar.spec.ts` ·
`scripts/check-font-coverage.mjs` · `scripts/check-support-floor.mjs` ·
`scripts/check-pw-projects.mjs` · `scripts/census.stamp.json` ·
`src/assets/fonts/{fraunces,patrickhand}-subset.woff2` · `src/assets/index.css` ·
`src/assets/typography.css` · `src/games/shared/GameControlPanel.vue` ·
`src/pencil/chrome/OptionSelector/OptionSelector.vue` · `src/pencil/sheet/SheetWashiLabel.vue`.

Evidence here: `readings/` (the paired card and gallery censuses, the ablations, vitest) ·
`probe/` (every instrument this lane wrote, plus the scratch vite and playwright configs) ·
`instruments/heading-voice.moved.spec.ts` + `.r0-MOVED.diff` (**r0 row MOVED**: a landscape cell,
a gallery cell pinned `?view=gallery&size=3&difficulty=MEDIUM`, and the base URL off r0's dead
`:4231` — the LAW is untouched, and the diff is PROPOSED here, never applied to r0) · `frames/`.

## 6 · Frames (4, 58 KB total)

1. `f1-dock-dark-pencils-lane-chromium.png` — 390x844 dark, the pencils well: `marks` and
   `what fits` in the printed face, each on one line, the hand's chips beside them with the
   scribble under `normal` and `off`. The lane as HEAD's own pose.
2. `f2-dock-light-checking-over-what-fits-chromium.png` — 390x844 light, the re-priced ink gate:
   `checking`'s paper over `what fits`'s ink (+11.39).
3. `f3a-chip-mark-4x-chromium.png` / `f3b-chip-mark-4x-webkit.png` — one card chip at 4x, both
   engines, the mark's painted extent over the word. The engine-identity row, seen once.

---

## 7 · Addendum 2026-09-19 — the resumed lane, three rows re-read

The session that wrote §0–§6 was killed by the stall wall after it banked its evidence and before
it returned. The worktree, the servers' logs and every reading above survived and were re-verified
on resume (`vue-tsc --noEmit` exit 0 on the standing diff; frames 4, 58 KB; ports empty). Three
rows were then re-read, because two of them were claims this lane had made on instruments that
could not have caught themselves being wrong.

### 7.1 The gallery π row was GREEN on a LOOSE SELECTOR. Re-aimed; it holds.

`gallery-pi.log` ends `328 numbers compared, worst |delta| = 0.0000px, **8 beyond 0.25**`, and the
eight are all one row: `deck tape voice Patrick Hand · 14.048 · 500 → Fraunces · 25.888 · 800`.
Row 12 above calls that GREEN without reconciling it. The reason it is green is NOT in that log.

`p3-gallery.mjs:31` reads the tape as `document.querySelector(".staging-band .washi-tag,
.washi-tag")` — a FALLBACK. The staging band's tape is not the first `.washi-tag` in the document
on the live-board fold, so the selector returned the CONTROLS CARD's tape and the probe printed it
under the name `deck tape`. A π fence that silently measures the claimed surface is not a fence.

`probe/p3-gallery-tapes.mjs` (new) names EVERY `.washi-tag` / `.washi-label` on
`?view=gallery&size=3&difficulty=MEDIUM` at 1280×800, with the region that owns it, paired against
the `74a2b5d9` control. `readings/gallery-tapes-reaimed.log`:

| | |
|---|---|
| tapes paired | **15 == 15**, chromium and webkit |
| moved | **4**, every one inside `tray-well (THE CARD)` — `new game` · `pencils` · `checking` · `players`, Patrick Hand 14.048/500 → Fraunces 25.888/800 |
| π | **11**, face, size, weight AND box: the staging band's own `new game` tape (Patrick Hand 14.048 · 500, unmoved), five card tooltips and five `controls-card` tooltips, all `\|dBox\| 0.0000` |

**The fence holds** — the four that move are the family's claimed surface and the deck's tape never
moves — but it held by luck of a selector, and row 12's evidence is this file, not `gallery-pi.log`.

### 7.2 Gap 7 CLOSED — the chair's §6.2 reachability probe at 844×390

§6.2 asks every §10 lane for W2 §2.2's probe at that cell and the card's height as a reading.
`probe/p3-land-844.mjs` → `readings/land-844x390.log`, both engines, both trees, settled 900 ms:

| | chromium | webkit |
|---|---|---|
| the cued entry | `.drawer-tab` "controls" **48×92**, onscreen, before the gesture | same |
| before it | deal `inert=true`, offscreen; level offscreen | same |
| **ONE gesture** (tap the tab) | case opens; **deal REACHED 56×70.39**; **level REACHED** | same |
| card `clientHeight` — A READING | proto **723**, HEAD **719** (+4) | proto **723**, HEAD **719** |
| the printed voice at this cell | **1** — `Fraunces · 25.89 · 800 · lowercase`, n=2 sections | same |

The seam law is not asserted here and the +4 is not a red, per the ruling. Note HEAD reads the same
face at this cell: at ≥768 `--type-group-title` was already `--type-heading`, so the section
heading is π in landscape and the family's move is the phone's.

### 7.3 `mark NaN` — the annotation was printing a number that cannot exist

`e2e-final-annotations.log`'s `chips` row reads `mark NaN vs word 32.48` three times.
`parseFloat("calc(100% + 0.5rem)")` is NaN by construction — both engines leave the term
unresolved, which is exactly WHY the row asserts the term string and the row below asserts the
painted width. The assertion was sound; the annotation was printing the one quantity that is
meaningless, so a reader checking the engine-identity row saw `NaN` and could not tell.
`markW` is deleted and the annotation prints `mark calc(100% + 0.5rem) over word 32.48`.
`face-law.spec.ts` re-run on the prototype server: **38 passed**, both engines,
`vue-tsc -p tsconfig.e2e.json` exit 0, prettier clean.

### 7.4 What this addendum did NOT re-run

The vitest suite, the standing gate battery, the goldens, the filter census, the seal, the card
census and the e2e estate are the pre-stall session's runs, unchanged and cited above; only
`face-law.spec.ts` was re-run, because only it was edited. Gaps 1–6 and 8–12 of §4 stand exactly
as written. **Servers killed: 4234, 4235; the band reads empty.**
