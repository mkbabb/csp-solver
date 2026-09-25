# ACC-SIX: pass-7 critique (adversarial, non-author)

Subject: the tree `.claude/worktrees/wf_f72f3b5a-83a-45` (base `74a2b5d9`, 21 M + 6 ??, 27 product paths; not
edited by this critic) and its evidence at `pass7/prototype/ACC-SIX/`. π control: `74a2b5d9`, the chair's shared
`w7-control` (dist `index-CubiZsMVSwTc.js`, served read-only, never built or git-touched).

**Convergence earned: 85 (up from 82). Verdict: ADVANCE.**

## 0 · What I did (no number below is quoted from the lane)

- **My build.** The tree built into scratch with a cacheDir outside the root: `index-Dx4v3BgsblSf.js` /
  `index-dSDbKN3CCoP9.css`, 37 files, `diff -rq` IDENTICAL to the lane's cited dist. Pass 6's contamination
  (§2.6 there) is gone.
- **Servers** (all 127.0.0.1, `--strictPort`): tree preview :4232, control preview :4233 (hash-verified), two
  plant dev servers :4234/:4235, the lane's integrated dist :4236 (read-only, hash `index-C4rwyft5SG8y.js`). All
  killed by recorded PID (14908/14853, 14917/14855, 19801/19766, 19827, 23717/23661, 34436/34401); every port read
  free afterwards. No `rm`, no `pkill`, no git in the control. My scratch PW config was moved to
  `<scratchpad>/trash-acc6crit7-1/`; the tree's `git status` is its 27 product paths.
- **Box load** 22–57 (1-min) through the session, 250–265 sibling node processes. Every timing row is a
  loaded-box reading.
- **Instruments** in `critique/ACC-SIX/instruments/`: `c7-yield-paint.mjs` (NEW: post-paint frames across the
  yield, the fit arm, the strip on real hints, resize-at-rest), `c7-plant.mts` (NEW in-memory plants `overyield`,
  `late300`, `late150`), `c7-inject-artifact.mjs` (NEW), `c7-count-aa.mjs` (NEW, imports the chair's
  `paint-lib`/`glyph-pop` plants), `c7-gate-plants.sh` (NEW), copies of the lane's battery, filter count and
  G10 runner (re-pointed). Summaries in `readings/`; no raw JSON banked. No frame banked.

## 1 · Re-measured (numbers)

| row | result |
|---|---|
| **Yield row, landed spec, bare** (`count-yield.spec.ts` bd15d767ff55, my built dist) | chromium **exit 0**, webkit **exit 0**; every pose reproduces the lane's figures (393: strip 20.8, tab 508.73 / 508.42; 812: 20.8 → 21.97, tab 159.09 → 159.67) |
| **The row against MY plants** (same spec, dev servers with one in-memory rewrite each) | `late300` (the report 300 ms late): **exit 1** both engines. `late150` (150 ms late): **exit 0** both engines. `overyield` (yield whenever the voice is over 20 characters, not when it wraps): **exit 0** both engines (§2.1, §2.2) |
| **Post-paint frames across the yielding press** (P16, 393×699 coarse hasTouch, DPR 2, PRM, the product's hint ×3; rAF → MessageChannel read; 2 runs/engine) | tree: count on row two in **0 of 146/146** frames (chromium) and **0 of 72/74** (webkit), present only on the frame before the press. `late150`: **18 of 144/145** frames on row two (chromium, 6–149 ms) and **10 of 72/73** (webkit). The press speaks "E goes nowhere else in this column" (34 chars) |
| **The fit arm** (P16, hint ×4, 1280×800 fine and 844×390 coarse) | tree keeps "1 of 170 on the board" beside the 34-char line at p3 and "2 of 170" at p4, both cells, both engines. `overyield` drops it at p3 in every cell and engine: **LESSON CUT ON A FITTING CELL: YES** |
| **Resize at rest** (count laid beside the 34-char line at 844×390 coarse, then 393×699) | yields on the resize alone, **0 of 144 / 0 of 69** frames on row two, both engines |
| **The strip on REAL hints** (P16, 4 presses, control vs tree) | 393×699: **20.8 at every press, tab 508.73 / 508.42, control = tree**, both engines. 812×375: 20.8 → 21.97 → 20.8 → 21.97 with tab 159.09 ↔ 159.67, **control = tree**. The column's π on real hints is 0 |
| **The spec's own press-3 pose, replayed** (`c7-inject-artifact`) | after the spec injects its widest voice, the product's next hint patches its line in BESIDE the injected span: **2 ink spans**, voice "E goes nowhere else in this columnG goes nowhere else in this column", strip **41.59**; at press 4 the injected span survives alone. Both engines (§2.3) |
| **G10** (landed `front-rate.spec.ts`, my built dist, CLOCK=driven; load 39.6–45.9, 63–79 siblings) | chromium **3/3 exit 0**, clock 122.0–123.5 Hz, worst gauge 49.1–50.5/s, min gap **16.0 ms (DOM 15.8)**. webkit **3/3 exit 0**, 125.0 Hz, worst gauge 46.1–48.0/s, min gap **17.0 ms (DOM 16.0)**. CLOCK=60: **exit 1 both**, on the precondition (60.2 / 58.8 Hz). The ablated plant not re-run by me |
| **Filter census, boot / rest** (1280×800, both engines) | light: control, integrated and tree **25 / 9**. Dark: control **27 / 11** (crayon-heart 2), integrated **25 / 9**, tree **27 / 11** (crayon-heart 2). Both engines agree. REPRODUCED |
| **The count line's glyph-text AA** (NEW; P1, one legal write, "1 of 51 on the board", ink `color(srgb .149 .149 .149 / .68)` light; DPR 2; the clip is the text's Range, because the yielding meta's box is 0 px tall) | light: median **4.667** chromium / **4.600** webkit, fraction under 4.5 **0.500 / 0.495**. Dark: **5.934 / 5.912**, fraction **0.331 / 0.396**. FAINT30, FADE65, FADE80, EMPTY all **RED** in every cell. No gate holds it (§2.6) |
| **Gate plants** (`c7-gate-plants.sh` on a mirror; shas 4e986f901533 / bc6216683278 / 3ba7738ee8d4) | pass 6's T1, T4, F1, F4 re-run first: **all exit 1**. Controls exit 1. **Twelve new shapes exit 0** (§2.4, §2.5). Mirror restored cmp-identical; clean 0/0 |
| **Unit row** (`GameBoard.count.test.ts` on the bank applied to a fresh archive) | 11/11 exit 0; with `@yielded="endCountLesson"` deleted, **exit 1** (the YIELD row) |
| **Battery, bare, tree / control** (control = a fresh `git archive 74a2b5d9`) | check-copy-register 0/0 · lint-copy 0/0 · check-theme-tokens 0/0 · lint-theme-tokens 0/0 · check-font-coverage 0/0 · test-font-coverage 0/0 · lint-lanes 0/0 · lint-sleep 0/0 · lint-motion 0/0 · lint-ink 0/0 · lint-live-regions 0/0 · lint-theme-selectors 0/0 · check-property-block source 0/0, built dist 0/0 · eslint . 0/0 · npm run lint (prettier --check) 0/0 · knip 0/0 · test-e2e-projects **1**/0 and check-pw-projects **1**/0 (check 8 FLOOR BAND only: filter-census stamped 6, live 8; declared) · undefined-token census **1/1** (one STALE row; declared) |
| **Bank = tree; apply** | `pass7.cum.diff` (2d83be22cb82, 243,779 B) `--check` **0** on a fresh `74a2b5d9`; applied, all 27 status paths cmp-identical to the tree. `s13-s7-s3.diff` then `pass7.delta.on-s13-s7-s3.diff` (22e1956e5776) `--check` **0** |

Not re-run by me: the 10-deal strobe sample (my post-paint, strip and fit rows read P16 on real hints instead),
the whole-DOM π at four cells, the heart pair's pixel counts, vue-tsc, the full vitest chunks.

## 2 · Open gaps (each closable, numbers attached)

### 2.1 The yield row has no FIT arm: a yield keyed on copy length passes it

`overyield` yields whenever the voice is over 20 characters. It exits 0 on the landed row in both engines.
It also ends the lesson at 1280×800 fine and 844×390 coarse on the first long hint, where the tree keeps
"1 of 170 on the board" beside the 34-character line. The row only reads cells where the pair cannot fit, so it
can't tell a yield keyed on the space from one keyed on the hint's length. Pass 6's critique named that same
failure ("keyed on hint length, not any hint").

To close: add a fitting cell (844×390 coarse or 1280×800 fine, P16, the product's own long hint). It asserts the
count stays on the voice's row, with `overyield` as its negative.

### 2.2 "Before paint" is claimed but no gate reads it

MarginNote says the owner takes the meta down "in the same frame, before paint". The clip that used to guarantee
this is gone, so a late report paints the count below the strip with nothing clipping it:
- `late150` exits 0 on the row in both engines, while my post-paint read counts **18** frames (chromium) and **10**
  (webkit) with the count on row two.
- The tree reads **0** such frames. So the claim is true, but it's ungated.
- The row polls poses 250 ms apart and settles on two equal reads, so it can't see anything shorter.

To close: land a post-paint frame clause across the yielding press (rAF, then a MessageChannel read, or the
chair's recorder), 0 row-two frames in both engines, with `late150` as the negative in the same run.

### 2.3 The spec reads a DOM the product never makes, and gap 4's premise is false

The row sets its widest voice by removing the ink span and appending a hand-made one. The product's next hint
then patches its own line in beside that span: two spans, "E goes nowhere else in this columnG goes nowhere
else in this column", strip 41.59. So the press3 and press4 poses read a note the product never paints.

The lane's gap 4 ("the voice wraps to 2 rows on its own at 393 and 812 on a real hint, 41.59/43.94") is that
artifact. On real hints the strip at 393×699 is **20.8 at every press on the tree AND the control**, in both
engines. At 812×375 the 21.97 ↔ 20.8 oscillation is the control's own.

The row swapped ruling 12's absolute clause ("strip height and `.drawer-tab` y equal to rest") for a with-vs-without
differential on this false premise. Once the count has yielded, that differential compares two identical reads,
so it can't fail.

To close:
- Drive the widest voice through the product. P16's press 3 at 393×699 speaks 34 characters and yields.
- Restore the absolute clause: strip and tab equal to the control's reading at every pose.
- Strike gap 4.

### 2.4 Law 20 greens six more legal shapes (the fourth pass on the class)

All exit 0 on the mirror, with the literal control at 1:
- **T6**: `const filter = \`url(#${inkId})\`` bound as `:stroke="filter"`. The holding NAME spells a non-paint
  property, and `consumersOf` returns it as the consumer.
- **T6b**: the same with `const clipPath` bound to `:fill`.
- **T7**: `url(${base}#${id})`, the `<base href>` idiom. `DYN_URL_RE` needs `#` right after `url(`.
- **T8**: `` `url(${'#' + inkId})` ``.
- **T9**: `stroke="url(&#35;solver-ink)"`. Vue compiles this to `url(#solver-ink)` (checked with
  `@vue/compiler-sfc`).
- **T10**: a CSS `url(#solver\-ink)`, which computes to `url("#solver-ink")` in chromium and webkit.

To close:
- Red any `url(` whose argument carries an interpolation or a `+` anywhere until it resolves.
- Resolve the consumer by the binding that reads the name, never by the name itself.
- Decode HTML entities and CSS escapes before `REF_RE`.
- Plant each shape.

### 2.5 The font census greens six more, and the class is a fail-open

All exit 0, with the plain-tag control at 1:
- **F5**: `h(StagingBand, { ...bandProps })`. The spread is dropped, where it should read as a `v-bind="obj"`.
- **F6**: a computed key `{ ["safeVerb"]: x }`.
- **F7**: `createVNode(StagingBand, { safeVerb })`.
- **F8**: a barrel alias `import { Band as Band8 } from "./plantBands"` over `export { default as Band }`.
- **F9**: `<NoSuchSink :safe-verb>`, a PascalCase tag the map can't resolve to any file. It's read as a sink that
  paints nothing. This is the class: an unresolvable TAG fails open, while only `:is` and a `defineAsyncComponent`
  whose loader names no `.vue` fail closed.
- **F10**: a second bind at the pinned `App.vue` `:is="sceneFor(scene)"` site. The pin's text says "the one bind
  here is `:leaving`", but `UNRESOLVED_SINKS` carries no value. It keys on the site, where law 20's admissions
  carry a count.

To close:
- A tag that resolves to no file is UNRESOLVED (red until pinned).
- A spread or computed key in `h()` counts as `v-bind="obj"`.
- `createVNode` and an aliased `h` are read.
- A pin carries its bind set.
- Plant each.

### 2.6 The count line's AA is unlanded, and it clears light by 0.10

Light median **4.600** (webkit) / **4.667** (chromium). Half the glyph population is under 4.5 (0.495/0.500).
Dark is 5.91–5.93. The statistic is sensitive (every plant reds), but no gate holds it. The pass-6 critique listed
it as unread, and the lane did not read it in pass 7.

To close: land the glyph-population clause on `.margin-note-meta` with the text Range as the clip (the box is 0 px
tall, so the chair's `glyph-pop` reads G1 EMPTY there), median ≥ 4.5, and fraction ≤ shipped + 0.05.

### 2.7 The hold's cost is not named (LAWS P6 §G)

B-YIELD is "resolved by the hold, no ballot", which ruling 12 allows. But the hold loses on a measured axis:
- On the lane's own 393×699 traces the lesson ends at its **first write in 4 of 10 deals** (HARD ×3, P16) and its
  second in 1. Pass 6 still showed the count at the second write in those deals, blinking.
- The sample is 393 only, and 812×375 yields too (my strip row: the count is gone at p3).

To close: state the loss in the disposition, and sample 812×375.

### 2.8 The ballot frame decides nothing the owner can see

T9-B-ACC6-2 re-uses the pass-6 id, whose variable was the claim's scope, for a different variable (the dark
saturate):
- The frame has no in-frame arm label.
- Its name carries no DPR or payload (the README does).
- The two arms differ by 1,461–1,538 px at a mean |Δ|R of 1.1–1.3/255, which is invisible.
- The deletion is already ratified (pass-7 chair §2).

To close: strike the ballot to its numbers, or re-mint it under its own id with a firing default.

### 2.9 Declared and inherited (not SIX's to cure; carried)

- check 8 FLOOR BAND: filter-census stamped 6, live 8.
- The undefined-token census's STALE row (1/1).
- The tree's dark rest count is 11, the control's own; the integrated tree reads 9.
- FIVE's 60 Hz floor and tally flash, grafted by sha.
- The kenken `+`/`÷` coverage row pinned OPEN at `spec.clues.overlay`.

## 3 · Closed this pass (verified)

- **The clip and its 2–3 px trim are gone.** The clip is deleted, and the count never paints on row two: 0 frames
  post-paint in both engines, on a real hint and on a resize at rest.
- **The strobe is cured by the hold.** On P16 the count is laid, yields at the long hint and stays gone. It does
  not return on the short line at p4 in either engine (post-paint, strip and fit rows).
- **The yield lives where it should.** It fires at 393×699 and 812×375, and holds the count where the pair fits
  (1280×800, 844×390).
- **The column's π on real hints is 0** against the control at both phone cells, both engines.
- **G10 is cured by FIVE's A.6 graft.** 3/3 per engine on my build under a heavier load than the lane's (min gap
  16.0 / 17.0 ms). CLOCK=60 reds on the precondition in both engines. Pass 6's Chromium "gauge never re-cut"
  control is fixed.
- **Pass 6's eight gate doors are shut.** The 58-row self-test holds.
- **The yield has a landed e2e row and a unit row, each with a working negative.** Row: yieldoff, pass6, unheight
  and late300 red. Unit: the listener deleted reds.
- **The crayon-heart born-RED reproduces** on three dists, both themes, both engines, boot and rest.
- **Housekeeping:**
  - The dist identity is clean.
  - The bank equals the tree.
  - Both apply checks are 0.
  - The battery reproduces bare.

## 4 · Checklist

| item | verdict |
|---|---|
| vacuous convergence | clear |
| spec-cites-itself | **hit**: the row's differential rests on an artifact of its own DOM injection (§2.3) |
| gates that cannot fail | **hit ×3**: the yield row greens `overyield` and `late150`; law 20 greens six shapes; the font census greens six (§2.1, §2.2, §2.4, §2.5) |
| elegant-reduction trap | clear (the mechanism is 40 lines and it holds on paint) |
| legacy aliases | clear (the clip rule is deleted, not renamed) |
| masked fallbacks | **partial**: the hold hides the count for the rest of the deal, and the loss is unnamed (§2.7) |
| unverified gestalt | **partial**: the ballot frame's difference is invisible (§2.8) |
| consumer-less substrate | clear (`yielded` has one consumer, and its unit reds without it) |
| generic default | clear |
| the pixel it moves and did not declare | clear on the column (π 0 on real hints); the lane's four-cell π not re-run |
| constraints | M16 0/0. filterBudget: the tree is the control's 11 in dark (inherited), 9 on the integrated tree. @property 0/0 source and dist. Undefined-token census: STALE only. W2's tab holds on real hints. AA: the count line is thin and ungated (§2.6). Decided history: MOVED rows PROPOSED only |

## 5 · Verdict

**ADVANCE at 85.** The family's centre converged on paint. The yield reads the wrap, the count leaves before the
frame paints, and it never returns within the deal. This holds on real hints, on a resize at rest, and where it
fits, in both engines, with the column's π at 0. The co-landing's rate gate is green on a loaded box.

It doesn't go higher, for three reasons:
- **The yield's landed row is blind** to a length-keyed yield and to a 150 ms late report, and two of its poses
  read a DOM of its own making.
- **Both source-shape gates are on their fourth pass**, with twelve more legal doors and a fail-open class in the
  font census.
- **The count line's AA and the hold's cost are unlanded and unnamed.**

None of these is a missing primitive: each is a row, a plant, or a sentence.

## Cross-pollination

- **Every e2e row that writes into a Vue-owned node** (a hand-made span, a `textContent`): the product's next
  patch sits BESIDE the injection. Drive the product, or the row reads a DOM nobody ships.
- **Every "keyed on the space" design** (PLACE's yield, the §7 merged note, TAB-PEN's H): ship the FIT arm. A
  length-keyed plant passes a row that only reads cells that don't fit.
- **Every "same frame, before paint" claim**: settle-polls 250 ms apart can't see a 150 ms paint. Read post-paint
  with a late-report plant.
- **Every source-shape gate on the chair's library** (FACE, RULE, TAPE, WALK, LADDER, VERB):
  - A variable NAMED like a property is not its consumer.
  - `url(${base}#${id})` is a live SVG idiom.
  - Decode `&#35;` and CSS escapes before any id regex.
  - A tag that resolves to no file is unresolved, never a non-painter.
- **The §7 merged note (ERASE, LEDGER)**: `yielded` is the note's emit. Its landed row's absolute clause belongs on
  the integrated tree too.
