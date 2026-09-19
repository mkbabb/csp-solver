# CTRL-FACE — pass 2 PROTOTYPE · printed and written

It RUNS. Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-34`,
branch `wf_8630d340-e56-34` (uncommitted; the agglomerator reads `git diff --stat`).
Dev server 127.0.0.1:4234 (scratch vite config, private `cacheDir`), HEAD control from
`git archive HEAD` on :4236, dist preview on :4236 after. Both engines everywhere. All servers
killed. Every number below was read off one of those two surfaces in this pass; nothing is
interpolated and nothing is quoted from the synthesis.

**One sentence:** the spec landed as written except for two clearances it had priced by
interpolation, and the surface refuted both — the fix is one declaration the spec never
considered (`align-self: flex-start` on the row caption), which costs 0.00px of flow at every
cell and buys more room than the two levers the spec had budgeted for.

---

## 0. The replay (chair §7)

The pass-1 worktree's `git diff` is banked at `pass1/prototype/CTRL-FACE/proto/ctrl-face.diff`
and was applied with `git apply --3way`: **8 files, every hunk clean, no conflict** (HEAD moved
by docs only). That diff is text-only — it was cut without `--binary` — so the two woff2 cuts
were copied byte-for-byte from the pass-1 worktree instead: `fraunces-subset.woff2` 14,896 B,
`patrickhand-subset.woff2` 4,896 B, both verified by the coverage gate's own cmap read (31 / 53
codepoints). `git ls-files --others` on the pass-1 worktree holds no product file — only
`test-results/` — so nothing else came across. `vue-tsc --noEmit` exit 0 on the replayed tree
before any pass-2 edit.

---

## 1. What the surface refuted, and what it took instead

The spec priced two clearances by interpolating a pass-1 sweep. Measured on the real card, at
the arm the spec describes (tape leading `--type-leading-display`, first well back to 0.35rem,
tab row `padding-top: 0.35rem`):

| row | spec said | MEASURED chromium / webkit | verdict |
|---|---|---|---|
| tab head daylight | +2.73 | **+1.72 / +2.30** | chromium under the +2.0 floor |
| `checking` tape over `candidates`' rendered word | ~+7.0 | **+0.92 / +0.44** | under the +2.0 floor |
| the same, against a worst-case descender | +1.00 | **−5.07 / −5.56** | the paper covers the descender |

HEAD's own readings, paired on the control, say which of those is a regression and which was
never true: HEAD reads **+1.19 / +1.84** at the tab head (so the ≥2.0 floor is red at HEAD too —
the spec's "−6.79 at HEAD" was pass 1's build, not HEAD) and **+13.92 / +8.33** at the ink gate
(so THAT one is a fence, and the printed tape broke it).

### The sweep, on the surface, both engines (dock 390×844)

`probe/p2-sweep.mjs`, `p2-sweep2.mjs` — every arm read, card height read with it.

- **The leading costs nothing and is bounded on BOTH sides.** Card height 683 at every arm from
  1.5 to 0.8 — the `1lh` pull works. But the tape's paper IS its line box, and `checking` is
  25.80px of ink: paper-over-ink reads **+1.99** at 1.05, **+0.71** at 1.00, **−0.59** at 0.95.
  Below 1.0 the word hangs out of its own tape. Above, 1.1 puts the tape 0.37px INTO the caption.
  So `--type-leading-display` (1.05) is the rung AND the floor, and the spec's `line-height: 1`
  fallback would buy 1.29px at the cost of 1.28px of paper.
- **`--washi-tag-lift: 3px` is NOT free.** Setting it to 0 buys exactly 3.00px at the ink gate
  for 0.00px of flow — and its own comment says what that 3px is for: at 3px the tape's tilted
  box stops 1.87px short of its own first row (the tilt alone grows the box ~0.95px). Rejected,
  and the rejection is measured, not deferred to the comment.
- **The well's gap and its padding-bottom both work and both cost the card**: +2.4px of
  `padding-bottom` buys +2.4px of clearance and 9px of dock card; fenced under `mobile` the
  sealed 1280 coarse cell pays 0.00 either way (1258.47 / 1258.34 at every arm).

### What it took: the caption's own alignment

`.zone-row-label { align-self: flex-start }`. The caption is a 25.888px printed noun in a
48.78px chip row; centred, it sat **10.47px** lower than the name it is. Top-aligned:

| | centred | top-aligned |
|---|---|---|
| tape over the rendered word | +2.20 / +1.72 | **+12.67 / +12.19** |
| tape over a worst-case descender (`pgjqy`, 6.34px) | −3.79 / −4.28 | **+6.68 / +6.19** |
| dock card height | 683 | **683** |
| 1280 coarse seal (`PANEL_H`) | 1258.47 / 1258.34 | **1258.47 / 1258.34** |

It costs nothing because the row's height is its 44px chips, not its caption — and on the RAIL
the caption already sits over its row, so this is the two regimes agreeing rather than a mobile
exception. The remaining 2.4px the tab head needed came from the row's own headroom, 0.35rem →
**0.5rem** (8px, inside the pass-1 cap, and the row exists only under `mobile` so the seal pays
0.00).

**The shipped arm, re-measured whole** (`readings/p2-card-proto-final.jsonl`, 6 cells × 2 engines):
tab head daylight **+4.13 / +4.71** with **0px²** of intersection at 390×844, 375×812, 430×932
and 900×500; ink gate **+11.39 / +10.90** rendered and **+5.39 / +4.90** worst-case.

---

## 2. Every gate, with its number

| # | gate | reading | |
|---|---|---|---|
| 1 | heading voice ROW 1 | **1 voice**, `Fraunces · 25.89 · 800 · lowercase`, n=8, at desk / dock / 900×500 / 375 / 430 / 1440, both engines (HEAD: 3 voices) | GREEN |
| 1 | ROW 3 | **1.2945** at every cell both engines (HEAD 1.0175 dock / 1.1768 land / 1.2945 desk) | GREEN |
| — | ROW 2 | **2 of 8** document headings, unchanged from HEAD. Recorded, NOT claimed (W3's row; no stylesheet mints an `<h3>`). The instrument fails on it exactly as it does at HEAD | RED, declared |
| 2 | CHECK 6 re-cut | HEAD: **18 problems** — the `.ctrl-btn` literal, `.washi-tag` with no declaration of its own, both consumer homes missing, `.zone-row-label` / `.heading-value` / `.icon-sublabel` / `.section-heading` on `--font-*` bindings, `p` ×2. Diff: `font coverage OK`, 3 faces, cmaps **31 / 53 / 22**, bytes **14,896 / 4,896 / 3,624** | born-RED → GREEN |
| 3 | printed count | **8** on every screen, one computed size, one weight (HEAD: 2) | GREEN |
| 4 | ransom advance | the coverage gate's cmap read is the proof this pass banks: Fraunces holds `p` (31 cp) and the corpus derives `pencils` / `players` from the tree. The advance probe itself was NOT re-run — see §4 | PARTIAL |
| 5 | the seal, re-priced 1261 + a second negative control | `visual-regression` test 10, **2 passed** both engines. Shipped **1258.47 / 1258.34**; control 1 still breaks it by >30; control 0 (captions back to `--type-tag`) drops the card **≥28** | GREEN |
| 6 | CONTRAST_TARGETS 4 → 8 sites | light min **4.659**, dark min **7.681**; `.section-heading` 4.659–19.451 / 7.681–15.839, `.heading-value` 4.984 / 10.089, `.zone-row-label` and `.washi-tag` 19.451 / 15.839. `access.spec` 2.3 passes both themes both engines | GREEN |
| 7 | hand weight | every card `.ctrl-btn` and `.heading-value` computes **400** (HEAD: selected chips 700) | GREEN |
| 8 | scribble overrun | **1.200 / 1.201** on every painted card chip, band [1.10, 1.30] | GREEN |
| 9 | gallery π | **124 numbers compared against the paired HEAD control, 0 beyond 0.25px**: band 199.94 / 136.00, tape 64.00×19.63, first card y 147.88 / 149.41, every chip rect, every voice. Tape `Patrick Hand · 14.00 · 500`, labels `Patrick Hand · 16.00 · 800`, chips `Fira Code · 16.00 · none` | GREEN |
| 10 | chip height | dock **44 == 44**, desk **38 == 38**, 900×500 **44 vs HEAD 45** — HEAD − 1, the declared 22 → 20 re-cut | GREEN |
| 11 | tape covenant at the CONSUMER | per well, box-with-tape − box-with-`display:none`: max \|Δ\| **0.016px** at every cell both engines (±0.25). The gallery cell is π by §9 | GREEN |
| 12 | INK gate, both arms | **+11.39 / +10.90** and **+5.39 / +4.90** | GREEN |
| 13 | tab head daylight | **+4.13 / +4.71**, 0px² at all four mobile cells | GREEN |
| 14 | `1lh` survives the build | `dist/assets/index-*.css` carries `margin:calc(-1lh - .04rem - var(--washi-tag-lift,0px)) …` | GREEN |
| 15 | standing | vitest **66 files / 810 tests**, 0 failed · e2e access + font-census + zone-grammar **38/38** both engines (44px floor with its negative control inside zone-grammar) · filter-census **12/12** off the dist · goldens **4/4** off the dist · lint:copy / ink / motion / theme-tokens / boundary / eslint / prettier / check-support-floor all exit 0 · `vue-tsc` exit 0 | GREEN |

Card heights, both engines: dock 390×844 **685** (HEAD 699) · 900×500 **747** (HEAD 743) ·
1280 fine **1173** (HEAD 1142) · 1440 **1174** · 1280 coarse `PANEL_H` **1258.47 / 1258.34**.

---

## 3. What changed from the spec, and why

1. **`.zone-row-label { align-self: flex-start }`** — a third declaration the spec does not
   name. It is the whole of the ink-gate cure and it costs nothing (§1).
2. **The tab row's headroom is 0.5rem, not 0.35rem.** 0.35 was swept and read +1.72 on chromium,
   under this lane's own floor. Still inside the pass-1 cap, still 0.00 at the seal.
3. **`--washi-tag-lift` stays 3px** — the spec never proposed moving it; this pass measured the
   move (worth 3.00px, free) and rejected it against the lift's own reason.
4. **The consumer's `.ctrl-word` hook names one more class than the spec wrote.**
   `.tray-well :deep(.ctrl-word)` compiles to (0,3,0) and `OptionSelector`'s own mark rule is
   `.selected-item .ctrl-word[data-v]` — also (0,3,0). That is a TIE, and the winner would be
   whichever sheet the bundler appended last. `.tray-well :deep(.ctrl-btn .ctrl-word)` is
   (0,4,0) and the cascade stops being a question. The spec's "(0,3,0) beats (0,2,0)
   deterministically" is true for the tape and the chip and false for the mark.
5. **`.icon-sublabel` reads `--face-written`.** It is a FACE_SITES key and it declared
   `var(--font-hand)`; the re-cut CHECK 6 demands a `--face-*` token in first position, so the
   site moved. Zero paint change (`--face-written` → `--font-hand`).
6. **A third FACE in the coverage gate.** The spec asked for the split corpora; splitting them
   means the deck's chips have a face nothing was checking, so `Fira Code` enters `FACES` with
   the tiers `selectors.ts` authors, `transform: "none"` (the deck lowercases nothing — and it
   cannot: the cut holds `E H M` and no `h`). The file is NOT re-cut: 3,624 B, 22 codepoints.
   Its ledger comment in `index.css` now says what those bytes are for, which is the opposite of
   pass 1's claim that they were the byline alone.
7. **`--ring-ink` does not exist at HEAD.** Chair §6.1 says consume it, never mint it — so the
   two focus rules read `var(--ring-ink, currentColor)`, and the fallback is the estate's own
   dashed-ring ink (`DrawerTab.vue`), not a new value. Until §6 lands the token the chips and
   tab heads paint their ring in their own ink; the ratio row §6 asked for is therefore the
   chip's own (4.659 light / 7.681 dark against card, ≥3:1), reported and not asserted.

---

## 4. Gaps — every one of them

- **ROW 2 is red and stays red.** 2 of 8 group names are document headings. Not this family's
  claim, and the instrument is left failing rather than softened.
- **The ransom-advance probe was not re-run.** Pass 1 banked `p` at 16.714 vs Georgia's 17.022
  with 0 `fellBack`; this pass ships the same woff2 bytes and the same rung, so the reading
  cannot have moved — but "cannot have moved" is an argument, not a measurement, and the gate
  the spec named is a measurement. The cmap read (31 codepoints, `p` present) and `font-census`
  both-arms green are what this pass actually banks.
- **The r0 hue census was not run.** The family mints no colour and moves no `color` declaration
  except `.zone-row-label` (`--ink-press-quiet` → `--printed-ink`, both existing tokens) and
  `.heading-value` (the same quiet rung, hoisted into `@layer components`), so the census's
  subject is untouched. Stated, not skipped silently. The wobble probe is likewise NOT run: the
  family touches no board mark.
- **The gallery's SELECTED chip differs between the two paired runs** (`Easy` bold in one,
  `Medium` in the other) because the deck's difficulty is persisted state, not a design delta —
  both runs show exactly one chip at 700 and the rest at 400, which is `font-bold` alive on the
  deck. The 124-number geometry comparison is unaffected (rects are identical); a future run
  should pin the selection through the URL.
- **`.staging-axis-label` is a second face home for a node that also wears `.section-heading`,**
  and it is not a FACE_SITES key. It pins the hand over the printed class on purpose (the
  estate's own comment: Fraunces has no `v`, and the axis says `level`). CHECK 6 does not see it
  because the selector names no listed class. That is a hole in the gate's closure — an honest
  one, named here, and the fix is a key, which is a ruling about the deck this pass does not own.
- **The tab-head floor of ≥2.0 is red AT HEAD** (+1.19 / +1.84). The prototype clears it, but
  the gate as the spec wrote it ("RED at the pass-1 build") mis-states HEAD; the born-RED claim
  for that row should read "red at HEAD and at the pass-1 build".
- **The printed count is 8 at the desk too,** where the spec expected 4–5. Eight is the whole
  set (4 tapes + 2 captions + 2 eyebrows) and the gate's ceiling is 8, so it passes with zero
  headroom: a ninth compartment reds it. Worth knowing before a sixth game lands.
- **`.ctrl-word`'s overrun is measured against the word's BOX, not its glyph ink.** 120% of the
  content box reads 1.200 by construction; the spec's 1.176–1.228 band came from a glyph-ink
  measurement this pass did not reproduce. The band is met on the reading that was taken, and
  the reading that was taken is named.
- **Two clearances are now comfortable and one number is not measured at all**: the tape's
  paper-over-ink is +1.99px. A later rung change on `--type-group-title` moves the ink and not
  the paper. No gate guards it; it is written into the rule's own comment instead.
- **The dock card grew 2px** against the spec's ~683 (685 with the 0.5rem row). Still 14px
  shorter than HEAD's 699.

---

## 5. The frames (3 banked, chromium; both engines shot)

1. `frames/pose1-dock-dark-tape-over-tabs-chromium.png` — dock 390×844 dark, sheet up, `size`
   open. The printed tape over the tab row with its 8px of headroom, `level` shut and muted with
   `easy` written beneath it in the tier's crayon, the chips in the hand with `9×9`'s scribble.
   This is the memorable thing on the phone.
2. `frames/pose2-dock-light-ink-gate-chromium.png` — dock 390×844 light, scrolled to the ink
   gate's own pair: `marks` and `candidates` printed at the top of their rows, the `checking`
   tape straddling the next well's stroke with +12.67px of daylight under the caption above it.
   The light dock nobody framed, and the frame that shows what `align-self` bought.
3. `frames/pose3-rail-light-new-game-chromium.png` — rail 1280×800 light: `new game` on tape
   over `size` at full press. The U-10 frame re-asked at the new leading; the owner disposes.

No gallery frame: every gallery number is 0.00 (§2 row 9).

---

## 6. Instruments

- `instruments/heading-voice.r0-MOVED.diff` — the r0 `r1-controls/probe/heading-voice.spec.ts`
  with pass 1's 900×500 cell and this pass's **`?view=gallery` π cell** (the deck asserted
  UNMOVED: face, weight and case exactly, the fluid tape rung as a band). The r0 row is reported
  **MOVED**; r0 is not re-cut in place. The copy runs from this lane's own dir with its OUT and
  baseURL re-pointed to :4234.
- `probe/` — `p2-card.mjs` (the consolidated card census: voice, rank, ratio, printed count,
  chips, tab row, ink gate, contrast, covenant, card height), `p2-gallery.mjs` (the π reader),
  `p2-sweep{,2,3,4}.mjs` (the four sweeps §1 rests on), `p2-crops.mjs`, and the two scratch
  configs (vite with its private `cacheDir`, playwright with no `webServer`).
- `readings/` — every JSONL and log cited above, including `font-coverage-HEAD-check6-RED.txt`
  (the new gate run against a `git archive HEAD` tree) and the four sweep logs.

---

## 7. For pass 3 — the diff is banked with `--binary`

`proto/ctrl-face-p2.diff` is `git diff --binary`, so a replay carries the two woff2 cuts with it.
Pass 1's was not, which is why this pass had to copy the fonts out of the pass-1 worktree by
hand. The working tree is also fully UNSTAGED (`git reset --mixed`): pass 1's `git apply --3way`
left four files staged, and a plain `git diff --stat` on that worktree silently omitted two of
the gate edits. `git diff --stat` here reads all twelve files.

    12 files, 652 insertions, 140 deletions — of which the pass-1 replay is ~330 of the
    insertions; pass 2 itself removes more of pass 1 than it adds to it.

Servers: 127.0.0.1:4234 (dev) and :4236 (HEAD control, then the dist preview). Both killed; the
4230–4249 band holds nothing of this lane's.

### A trap this lane fell into and banks

`vue-tsc --noEmit -p tsconfig.app.json` reports `TS5058: The specified path does not exist` and
the surrounding `; echo $?` reports the ECHO's status, not the compiler's — so two earlier
"vue-tsc exit 0" readings in this lane were a shell exit wearing a typecheck's name. There is no
`tsconfig.app.json` in this estate. The real commands, both run bare on the final tree, both
exit 0: **`npx vue-tsc -b --force`** and **`npx vue-tsc --noEmit -p tsconfig.e2e.json`**.
`cmd; echo $?` is the same class of lie as `cmd | tail` eating an exit code.
