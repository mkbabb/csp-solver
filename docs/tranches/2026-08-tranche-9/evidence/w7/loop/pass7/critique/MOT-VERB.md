# MOT-VERB · pass 7 CRITIQUE (adversarial, non-author)

Subject: the §13 tree `.claude/worktrees/wf_f72f3b5a-83a-59`. I recomputed its write-tree through a private
temporary index and got **`e7cc2ae8`**, the lane's figure. `git diff --binary cb17b5f3 e7cc2ae8` is sha1
`54f68192b2ad`, byte-identical to the banked `pass7-verb-delta.diff`. I **rebuilt the dist myself** outside the
tree (my own cacheDir and outDir; the only scratch inside the tree was `.verbcrit7/`, which holds no class-like
strings). Entry: **`index-BHJMbOny6cIs.js`**, 44 files. Served on 127.0.0.1:**4236** (listener 57973), beside the
shared control `index-CubiZsMVSwTc.js` (74a2b5d9) on **:4237** (listener 57974). I verified each by its asset
hash. Box load: 9–15 on the GA1 and boot rows, rising to 36 on the late painted rows (foreign lanes). I did not
serve main-HEAD or the integrated tree.

**CONVERGENCE: 83** (pass 6: 82). GA1's re-cut is real: it reads post-paint, and PLANT skip reds it 3/3 in both
engines on my rebuild. M20's draw-in cure is real on the surface. The digits never ink on an unruled page, and
the in-draw stall is gone. The hinge holds graphite over the first 120 ms of the dusk in PAINTED bytes (the
control drops it to 1.43). Against that, the number rises by one and no more, for five reasons:
- The re-cut GA1 is **blind in WebKit** to a 150 ms skip one frame later.
- The census cure is again enumerated to its plants: six new shapes read green.
- The hand's clock **halves its speed at 30 Hz**.
- No shipped gate reads the hinge, D15 or the hand's consumers.
- **Every dist the lane cited except its ablation dist is Tailwind-contaminated** by a scratch spec inside the tree.

Most owner rows (INTAKE-23 rows 2, 3, 4, 10–13, 15; T9-B24/B26) are unbuilt, as the lane declares.

---

## 1 · What I re-ran (tree :4236 = my clean rebuild of `e7cc2ae8`; control :4237 = 74a2b5d9; bare)

| reading | result |
| --- | --- |
| **identity** | write-tree `e7cc2ae8` ✓. Delta sha1 `54f68192b2ad` ✓. apply `--check`: the delta on `cb17b5f3` **0**, cumulative on a fresh `74a2b5d9` **0**, the pass-7 delta (vs `3d25f02a`) on `74a2b5d9 + s13-s7-s3.diff` **1**, and only `HandDrawnGrid.vue:2` rejects. All three reproduce the lane's figures |
| **the dist the lane cited is not the product's** | my clean rebuild = `index-BHJMbOny6cIs.js`, which is **byte-identical, all 44 files**, to the lane's "ablation" dist `verb7/d1noio`. The lane's final `index-Bdk03-EiIrzu.js` and **every arm dist** (front `BvAflQVX3mt-`, sheet `B_ta0Cug9pdj`, snap `CIntNN44-4dm`, theme-color `DapFRFOZ56Au`, and the five `dist-*` builds) ship `.backdrop-filter{…}`, 9 extra `@property --tw-backdrop-*` registrations (**58 served vs 49**) and the matching `*,:before,:after` initial block. The control ships none of them. The source is `web/frontend/.verb7/pi7.spec.ts`, a scratch π spec that lived inside the tree at build time and names `backdrop-filter`: Tailwind scanned it (LAWS P6 §B). §2.5 |
| **GA1, the lane's `e2e/fold-verb.spec.ts`**, ×3 per cell | chromium **12/12 GREEN** (frame 1 ct 0, centre 0.00, width 0.00; CI k2/k3 0.0); webkit **12/12 GREEN** (centre 0.00–0.03; its CI prints **0.0 ms in 12/12**). **PLANT skip RED 3/3 chromium (142.93 px), 3/3 webkit (142.89 px).** Reproduced. Reads dropped: 1/12 chromium, 1/12 webkit |
| **PLANT f2 (mine: frame 1 held at rest, the mover's clock +150 ms on the 2nd rAF after `animate()`)** | frame 2 paints 150 ms in: a **432–443 px** step at 1280 and **157–162 px** at 390 coarse. Chromium **RED 6/6** (CI k2/k3 150.0). **WebKit GREEN 6/6**, although its own CI reads exactly **150.0 ms** on every run. **The gate cannot fail on this break in the engine the owner audits on.** §2.1 |
| **first motion interval** (row 2, printed by the spec) | tree chromium **7.6–18.6 ms** (headless chromium here runs rAF at ~120 Hz) and webkit **15–22 ms**, at load 11.3–12.7. The pass-6 33–46 ms gap is absent, as the lane reports. Still ungated |
| **boot probe** (the lane's `boot-probe.mjs`, copied, 1280 light, random deal ×3) | tree chromium: first stroke 320–358, **ruled95 2303–2349**, digits>5 % **2512–2566** ms. webkit: 490–576 → **2489–2559** → **2706–2825**. Frames with digits>5 % while ruled<95 %: **0** in 6/6 runs. In-draw gaps >34 ms: 0. Long tasks in the draw: 0. Ceiling fires: 0. Fronts: 2. Control chromium digits at **354–403 ms**, before its ruled95 of 555–562. **Reproduced.** |
| **the same, 30 Hz** (my `RAF30` shim: every rAF callback deferred one frame; on WebKit's 60 Hz = 30 Hz, on chromium's 120 Hz = 60 Hz) | **webkit @30 Hz: ruled95 4387–4399 ms, digits 4720–4764 ms** (×1.75 of its 60 Hz boot). Chromium @60 Hz: 2283–2292 / 2483–2542 (unchanged). Control webkit @30 Hz: digits **324–426 ms**. **The hand's clock is frame-rate dependent: `MOTION.hand.stepMs` 17 treats every frame longer than 17 ms as a stall.** §2.3 |
| **per-frame Δ caps (row 1: 7.8/16.3/27.1 %) vs refresh** | chromium @120 Hz: 3.8–4.5 / 8.2–9.7 / 15.2–15.8. **Chromium @60 Hz: 7.2–7.3 / 15.8–16.1 / 25.9–26.3**, and WebKit @60 Hz 7.1–7.5 / 15.8–16.1 / 26.3. So the lane's chromium "held with margin" is a 120 Hz reading. At 60 Hz both engines clear the frame tier by **0.3–0.7 pt**. The cap is per FRAME, not per second (LAWS: budgets are RATES). §2.3 |
| **the ink at the flip, PAINTED, chromium** (mine, `flip-painted.mjs`: 390×844 coarse DPR 2, the lane's payload, 71 givens read back, typed user 5 in r1c1, every animation frozen at +T by the lane's freeze, ink = mean of the 8 % of cell pixels farthest in luminance from the cell median, WCAG ratio; the freeze is VALID in chromium: `flip-diag.mjs` lists the user cell's hinge transitions paused at ct 60 of their 120 ms delay) | **L→D, tree / control. User ink: +60 4.93 / 1.50 · +95 2.83 / 1.67 · +122 2.63 / 2.62 · +130 2.95 / 2.94 · +150 3.96 / 3.94 · +200 6.52 / 6.48. Given: +60 11.69 / 1.43 · +95 6.37 / 2.63 · +122 4.24 / 4.24 · +130 4.79 / 4.79.** D→L: user +60 4.70 / 1.77 · +95 2.24 / 2.10 · +122 3.28 / 3.22; given +60 7.71 / 2.17 · +95 4.80 / 4.80. **In painted bytes, graphite never reads under 4.24 in the tree (the control reads 1.43–2.63 before its step). User ink reads under 3:1 at +95…+130 L→D and at +95 D→L in BOTH arms, and the tree never loses to the control.** After the step the tree equals the control to ±0.06 |
| **the ink at the flip, WebKit** | **my frozen painted read is VOID in WebKit.** `flip-diag.mjs` at +200 finds the user cell's hinge transitions **running, not frozen** (ct 51 of the 120 ms delay; 281 animations vs chromium's 30). WebKit creates or restarts them after the freeze's rAF, so the photograph shows old ink on late paper (user 1.87–2.56). That is an instrument artifact, and I cite none of those numbers. The **LIVE computed read** (post-paint, unfrozen, 390 coarse L→D): the user stroke steps between **+108 and +144** (`#2563eb` → `#60a5fa`). Old blue on paper rgb(142,142,141) at +108 computes to ≈ **1.58**, new blue on rgb(100,100,99) at +144 to ≈ **2.33**, and rgb(77) at +170 to ≈ 3.33. That agrees with the lane's computed WebKit rows (1.14–2.30 for 2–11 frames). Aside: in WebKit the glyph `path`'s inherited `color` holds its old value until **~+397 ms**, because the dusking ancestor restarts the 0s + 120 ms transition every frame; chromium steps it at ~+159. It is inert today (the glyph strokes I read are explicit, not `currentColor`), and a trap for any `currentColor` consumer the hinge lists |
| **filter census, boot AND rest** (mine: computed `filter` naming `url()`, every element, sampled every 100 ms through 0–4.5 s, then at +7 s; the payload; 1280) | **tree boot-max 24 = rest 24 = control 24/24**, in light and dark, in both engines. It does not grow at boot, and the tree's max lands at 2.5–2.7 s, inside its longer boot. (My whole-element count is not INTAKE §0.5's 11-vs-9 statistic. That statistic is still unread on any tree) |
| **check-property-block** (pass6 instrument) `--served :4236 --dist <my rebuild>` | **0**: source 8/8, **served 49**, all in `index-DyUCrBvpPVyw.css`; stamp `index-BHJMbOny6cIs.js` |
| **the battery on a `git archive e7cc2ae8`** (bash, exit captured first; `lint:bands` with the repo's object store as `GIT_DIR`) | lint:bands **0** · lint:theme-tokens **0** (controls 11–14b RED as required) · lint:motion **0** · lint:copy (M16) **0** · lint:verbs **0** · lint:lanes **0** · lint:sleep **0** · check-theme-selectors 0 · `eslint .` **0** · `npm run lint` form (prettier src/ scripts/ ../../scripts/ ../relay/) **0**. The control reds on bands/verbs are inherited (the scripts are absent), per the lane |

### 1b · π at rest (whole-DOM, the pass-6 critic's `pi6.spec.ts` re-pointed: 30 computed paint properties + tag keys, PRM-parked, the payload with 71 givens read back, playing + gallery × 1280 light / 1280 dark / 390 coarse × both engines, a control-vs-control arm in the same run)

**moved 0 in 12/12 cells, both engines; control-vs-control 0/0/0.** The only one-sided nodes are the declared tag
change (5 tree `div.grid-ink` + 4 boxes vs 4 control `svg>image`), and the 71 givens are equal in every arm. This
π is PRM-parked. It therefore does not read the new no-preference paths (the hand, the hinge), which only move
paint in motion (§1 and §2.6). At rest the tree is π-identical to 74a2b5d9.

## 2 · Open rows the return does not name, or names wrongly

### 2.1 The re-cut GA1 cannot fail in WebKit on a skip one frame later. STRUCK in WebKit until re-cut.

The lane gates the clock identity (CI) in chromium only, because WebKit's "post task can run after its next
animation update". My PLANT f2 holds frame 1 at rest and jumps the mover 150 ms on the next frame. It paints a
432–443 px step at 1280, and 157–162 px at 390 coarse. The spec passes it **6/6 in WebKit**. The same spec's WebKit
CI column reads **exactly 150.0 ms** under the plant and **0.0 ms on 12/12 clean runs**. The limit the lane cites
is real for frame 1's POSE (its one 1/20 red), but it does not reach the CI arithmetic on this box. The skip
that GA1 exists to police therefore walks through in the engine the owner audits on.
**Closable:** gate CI in WebKit with the same ±2 ms (or state a WebKit bound with its distribution, n ≥ 20), and
ship PLANT f2 beside PLANT skip as the in-run negative in `fold-verb.spec.ts`. It must RED in both engines.

### 2.2 The census is cured for its planted shapes again, not for the class (LAWS P6 §F, the SHAPE law).

Through `undefinedTokens(extra)`, with no tree byte touched (`census-plants7.mjs`). The controls reproduce: s12 and
s14 RED, and `Object.assign(el.style, …)` and `style.cssText` RED as well. Six shapes read **GREEN**:
- **X15** `var(--motion-${k})`: the stem is "declared" because `--motion-whisper` exists. **X15b**
  `var(--verb-${k}-bogus)`: a tail nothing declares. The cure asks whether SOME name carries the stem; the law
  says to read the template "as every stem", which means naming the value set or redding the site.
- **X16** `html:is(.theme-turning, .x) .y` and **X16b** `:where(.theme-turning, html) .y`: `hasCompound` strips
  only `:not()`, so a disjunction's tail reads as present on the rule that runs without it.
- **X17** `setProperty(name, 'var(--ghost)')`: a computed property name, which the law lists by name ("incl.
  concatenated and computed keys"). Branch (d) requires a quoted literal.
- **X18** `const v = 'var(--ghost)'; el.style.animationDuration = v`: a value carried through a binding.

**Closable:** read `:is()`/`:where()` arms as alternatives (a tail holds only if every arm carries it). Red, or
ledger with a value set, every stem site whose tail is not a literal. Read `setProperty(<non-literal>, …)` as a `?`
site like `style[k]`. Resolve a same-file const binding, or red a non-literal write. Add X15–X18 as controls 15–18
in the same batch.

### 2.3 The hand's clock is frame-rate dependent. It is a regression at 30 Hz, and the B25 price is quoted at 60 Hz only.

`bootHand.tick` advances by `min(dt, MOTION.hand.stepMs = 17)`. Any refresh slower than ~59 Hz is therefore read
as a stall every frame. The docstring says "a healthy 60 Hz frame is never slowed", and that is literally true:
under 30 Hz rAF (iOS Low Power Mode's Safari cap, a throttled tab), the WebKit ruling takes **4.39–4.40 s** and the
digits wait until **4.72–4.76 s**. The control inks at 0.32–0.43 s. T9-B25's stated loss (ruled95 2.33–2.69 s,
digits 2.54–2.94 s) is the 60 Hz price. The same 30 Hz boot pays ×1.75. Separately, row 1's per-frame Δ caps are
per FRAME. The lane's chromium figures are a 120 Hz reading (4 %), and at 60 Hz both engines sit **0.3–0.7 pt** under
the 7.8 % frame cap. The row-1 gate therefore changes verdict with the refresh rate, not the design.
**Closable:** key the cap on the observed frame interval (e.g. `min(dt, max(stepMs, 2 × median dt))`), or state the
cap as a rate (% of line per second), and re-read ruled95/digits at 30 Hz both engines with the result beside
B25's price. The EXEMPT row stays pinned. (I tried it: `stepMs 5` reds `lint:bands` "an exemption licenses ONE
value", which is a strength.)

### 2.4 No shipped gate reads the hinge, the wave's hold, or the hand's consumers.

`grep` over `e2e/`, `scripts/` and every test for `ink-hinge|ink-sheet|INK_AT_FLIP|theme-color|afterRuling|
beginRuling|stacksResident|holdRuling|data-hand-ceiling` finds only `bootHand.test.ts` (the primitive) and
`check-motion-bands.mjs`'s EXEMPT rows. **Plant: the hinge's delays 120/87 → 330/340 ms**, so the ink steps at
94–97 % of the dusk and old ink sits on nearly final paper. With that plant, `lint:bands 0 · lint:theme-tokens 0 ·
lint:motion 0 · lint:copy 0 · lint:verbs 0 · lint:lanes 0 · lint:sleep 0 · check-theme-selectors 0 · prettier 0`.
The comment's "a retune of `dusk` or its curve re-derives both" has no enforcer. D1, D5 and D15 are "CLOSED"
on instruments (`boot-probe`, the recorder). No e2e row ships that would red a consumer that stops awaiting
`afterRuling()`. INTAKE-22 row 40 asks for the recorder as estate specs, and this is that row, still open.
**Closable:** (a) derive 120/87 from `MOTION.rungs.dusk` and the dusk curve in `publish-verbs`, or have a
`lint:bands` row that recomputes the equal-contrast instant and reds a drift > 1 frame; (b) ship
`boot-hand.spec.ts`: digits>5 % never while ruled<95 %, 0 in-draw gaps >34 ms, both engines. Its negative is the
control (it reds there today) plus a consumer plant (`afterRuling` bypassed).

### 2.5 Every cited dist but one is contaminated, and the incident is misdiagnosed. This is a LAWS P6 §B breach.

The lane's incident note says the ablation dist's different hash is because "paths differ in the bundle". The
cause is different. `.verb7/pi7.spec.ts` sat inside `web/frontend` during every build, and Tailwind's content scan
shipped `.backdrop-filter` plus 9 `@property --tw-backdrop-*` registrations. The ablation dist (built from a
snapshot without `.verb7/`) is the clean product, and it equals my rebuild byte for byte. What it moves:
- The battery's "served 58 registrations" is the contamination's figure. The product's is **49**.
- The cited "final dist" `index-Bdk03-EiIrzu.js` is not what the fold would ship.
- GA1, the flips, meta, PRM and the frame all ran on contaminated builds.

The ballot pair is contaminated identically on both arms, so its one variable holds. I found no element that
carries `.backdrop-filter`, and my GA1 and boot rows on the clean build reproduce the lane's, so I read it as
paint-neutral (π in §1b). **Closable:** re-stamp the bank's dist identity as `index-BHJMbOny6cIs.js` with 49
registrations, and re-cut the arm dists with scratch outside the tree. The chair books the incident against
LAWS §B by name.

### 2.6 The B23 frame is taken at the default's best instant, and the default's loss is not framed. The painted gate is still unbuilt.

The frame freezes at **+100 ms**, before the hinge's 120 ms step. There, (c) holds old graphite and wins
(chromium painted: given 6.37–11.69 against the control's 1.43–2.63). The default's loss is user ink under 3:1. In
painted chromium bytes it sits at **+95…+130** (2.63–2.95), where the tree equals the control. In WebKit, the lane's
computed read and mine put it at **+108…+165** (≈ 1.6–2.3). The owner is not shown either instant. LAWS P6 §G: "a
ballot names the LOSS of its default where the default loses"; P6 §C: "a ballot arm is FRAMED where it differs".
Row 9 also asks for the §2.11 painted statistic with FAINT/TAIL born-RED. My chromium read is a stand-in (user +
two givens, no marks, conflict or solver hues, no plants). **The lane's own freeze instrument is void in WebKit**
(§1), so a WebKit painted row needs a different capture: a WebKit freeze keyed after the transitions exist (e.g. freeze
on the first `transitionrun` of `.board-wrapper .glyph-svg path`), or the recorder.
**Closable:** add a second crop of the pair at +122 (chromium) or +144 (WebKit, with a capture that holds), and build
row 9's painted gate over all inks with both plants. The gate must red the snap arm (a) and the control.

## 3 · Rows the return names, which I confirm are open

- INTAKE-23 rows **2, 3, 4, 10, 11, 12, 13, 15** and T9-B24/T9-B26: unbuilt. Row 5's stack-open move, the late-deal
  regime and G-D12: unbuilt. Row 9: painted now (by me) for user + two givens only; the §2.11 glyph-text
  statistic with FAINT/TAIL plants over all five hues, conflict, solver ink and marks is still unbuilt. Row 14
  (P7-π on the merged tree, goldens, dark-boot census): not run. Row 16: settled only.
- Charter rows **4** (GB1 WebKit / chromium 34 ms clause, GB7): not re-read. **5** (row 37, the wordmark half):
  no candidate, **the fourth pass**. **6** (T9-B22): no arm. **7** (M19 split arms): untouched. **8** (GB6, rows 32/34,
  the classic scrollbar): untouched. **11**: the integrated tree's boot census unread (my tree-vs-control census is
  §1).
- The front arm's chromium busy plant is unseen by the recorder's photographs (lane gap 4). Not found by me either.
- The recorder rows are n = 3, never on a quiet box. Drawn-at-20 % is read on the curve only.

## 4 · CHECKLIST

| item | reading |
| --- | --- |
| vacuous convergence | **HIT**: GA1's WebKit arm passes a 150 ms skip on frame 2 (§2.1) |
| spec-cites-itself | clear. The fold spec's negative is a runtime plant, and the control reds 40/40 (lane), 0 of mine contradict |
| gates that cannot fail | **HIT**: GA1 WebKit on PLANT f2; the census on X15–X18 (§2.2); the hinge's derivation (a 330/340 ms plant passes 9 gates, §2.4). There is no gate at all on D15/D5 consumers |
| elegant-reduction trap | **HIT, declared**: M21's Bloom, boil, settle and fence, M20 rows 2–4, and the wordmark half. The hand cures the stall "and then" costs the boot 2.5 s (60 Hz) or 4.7 s (30 Hz) to its digits (§2.3) |
| legacy aliases | clear. Arm (b) `INK_JOINS_DUSK` was deleted, not renamed |
| masked fallbacks | **HIT**: `bakeCeilingMs` is counted (`data-hand-ceiling`, 0 fires in 12 of my boots), which is good. But the stem check passes any stem that some name prefixes (§2.2 X15), and the hand's cap masks a 30 Hz device as a stall (§2.3) |
| unverified gestalt | **HIT (partial)**: I looked at the B23 frame. It is honest at +100 but is the default's best instant (§2.6). T9-B25 is built and unframed |
| consumer-less substrate | `handStroke` has a JS consumer only. The CSS twin is declared deferred, by the docstring. Fine. `ink-rub-out` on the union: unread |
| generic default | clear |
| π | **clear at rest**: 0 moved in 12/12 cells, both engines (§1b). In motion, the flip's paint moves in 0–120 ms (the hinge, declared as T9-B23 (c)) and the boot's timeline moves (declared as T9-B25) |
| the constraint it forgot | **filterBudget**: equal at boot and rest, both themes, both engines (§1). **M16**: 0. **@property**: 0 on the clean build (49). **AA**: in painted chromium bytes, user ink reads < 3:1 at +95…+130 in both arms and the tree never loses to the control. Graphite holds ≥ 4.24. WebKit's painted flip is unread (the freeze is void there, §1), and row 9's gate is unbuilt (§2.6). **LAWS P6 §B**: the Tailwind-contaminated dists (§2.5). **Rates, not per-frame budgets** (§2.3). Decided history: none moved. W2: untouched |

## 5 · STRENGTHS

1. **GA1 is read post-paint, and its plant reds.** PLANT skip reds 3/3 in both engines on a clean rebuild. The
   lane found and removed its own product "cure" when the ablation showed a reader artifact. That is the right
   instinct, and the finding (key frame 1 on the mover's first IO entry) belongs in the chair's `postpaint.mjs`.
2. **M20's draw-in is cured on the surface.** 0 in-draw gaps > 34 ms against the control's 2 per boot of 78–95 ms,
   0 long tasks in the draw, and 2 fronts against 15. **The digits never ink on an unruled page** (0 frames, both
   engines), where the control inks them at 354–403 ms with the page 60–70 % ruled.
3. **The hinge is a painted win in its window.** Over 0–120 ms L→D, graphite reads 11.69 (control 1.43) and user
   ink 4.93 (control 1.50). It costs nothing after the step, where it equals the control.
4. **The EXEMPT rows pin values**: `stepMs 5` and `bakeCeilingMs 60000` each red `lint:bands`. The PRM regression
   the dead attempts left (the grid held behind the bake wait) was found and cured.
5. **The record reproduces**: write-tree, delta sha1, the three apply exits and the one integrated reject all
   match. The theme-color option ships nothing by default.

## 6 · VERDICT

**ADVANCE at 83.** The pass built the owner's M20 draw-in and the M21 hinge's mechanism, and cured GA1's reader.
I reproduced each of those on a clean rebuild. The number rises by one. Against it:
- The new GA1 gate is blind in WebKit one frame later. That makes the fifth gate-that-cannot-fail in three passes.
- The census cure is plant-enumerated again.
- The hand buys its smoothness with a frame-rate-dependent clock and a 2.5–4.7 s wait before the digits appear.
- None of the new mechanisms has a shipped gate.
- The cited dists breach LAWS §B.

Nothing here is a rewording. No constraint breaks in paint at rest, as far as I read it, so this is not RETIRE.
Nothing needs a primitive as hard as the problem, so it is not BLOCK.

## 7 · CROSS-POLLINATION

1. **Every post-paint first-frame row (LADDER, FACE's dock, FIVE's G10) ← §2.1**: a frame-1 plant is not enough.
   Ship a frame-2 plant, and gate the clock identity in WebKit where its CI reads clean.
2. **The chair's `shape-census.mjs` ← §2.2**: `:is()`/`:where()` alternatives, stems by value set, computed
   `setProperty` names, and const-carried values. Every consumer of the one library inherits the fix.
3. **ACC-FIVE / SIX / GRAPHITE (`frontGate`, registry-v6 §6 row 629) ← §2.3**: a per-frame clock cap that assumes
   60 Hz reads 30 Hz as a stall. Key caps on the observed interval, and state budgets as rates.
4. **Every lane that builds with scratch inside `web/frontend` ← §2.5**: diff the served CSS against a clean
   out-of-tree build before citing a dist (TAB-PEN and PAL-WALK hit the same scan at pass 6).
5. **Every ballot with a timed arm ← §2.6**: frame the default at its losing instant, not only its winning one.

### Incidents (mine)

- My first gate loop ran under zsh and passed `"node scripts/x --self-test"` as one word (MODULE_NOT_FOUND ×4). That
  is LAWS P5's trap. I re-ran it under bash (`gates.sh`), and only that run is cited.
- On the bare archive, `lint:bands` first red with "74a2b5d9 is not in this clone" (the archive has no `.git`). I
  re-ran it with `GIT_DIR` pointed at the repo's object store (its git calls are `show`/`grep`/`rev-parse` at a
  revision, all read-only). It then read 0, and that is the reading cited.
- The hinge and hand plants were edits to MY archive copy only, each restored by `cp` from a saved original and
  checked with `cmp`. No tree byte was touched.
- **My WebKit painted flip rows were an instrument artifact.** The lane's freeze runs before WebKit creates the
  hinge's transitions, so they were still running (ct 51 at a nominal +200). I found it with `flip-diag.mjs` before
  citing anything. The WebKit rows are VOID, and the WebKit reading cited is the live computed one. The same
  artifact would void any WebKit frame the lane's `frame-b23.mjs` takes after the step. Its banked frame is
  chromium, so it stands.
- Headless chromium runs rAF at ~120 Hz on this box, so my 30 Hz shim is 30 Hz in WebKit only. The chromium row is
  labelled 60 Hz.
- My scratch lived in `<tree>/web/frontend/.verbcrit7/` (configs and specs, no class-like strings) and in
  `<scratchpad>/verbcrit7/`. It was `mv`ed to `<scratchpad>/trash-verbcrit7-1/`. Nothing was `rm`'d. No git in the
  control tree. Servers were killed by recorded PIDs (listeners 57973/57974, npx parents 57918/57919), and the
  4230–4249 band read empty afterwards. The tree's write-tree at return is `e7cc2ae8`, as found, and its `git
  status` shows 64 product entries.
- Banked here: `instruments/` (census-plants7, crit-f2 spec, boot-probe-crit with RAF30, flip-painted, flip-diag,
  filterboot spec, pi7crit spec, pw.config, gates.sh, boot-batch.sh, batch3.sh) and `logs/` (summaries only). No
  crop banked.
