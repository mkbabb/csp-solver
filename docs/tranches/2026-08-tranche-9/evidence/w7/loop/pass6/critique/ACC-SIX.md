# ACC-SIX: pass-6 critique (adversarial, non-author)

Subject: the tree `.claude/worktrees/wf_f72f3b5a-83a-45` (base `74a2b5d9`, 17 M + 4 ??, +1900/−146,
unchanged by this critic before and after) and its evidence at `pass6/prototype/ACC-SIX/`. π control:
`74a2b5d9`, the chair's shared `w7-control` (dist `index-CubiZsMVSwTc.js`, served read-only, never
built or git-touched).

**Convergence earned: 82 (up from 80). Verdict: ADVANCE.**

## 0 · What I did (no number below is quoted from the lane)

- **The pass-6 advance, isolated.** `git archive 74a2b5d9` + the chair's `pass5/prototype/ACC-SIX/pass5.diff`
  applied clean in scratch, then diffed against the tree. Substance moved in `MarginNote.vue` (the yield),
  `GameBoard.vue` (the portrait reserve deleted, `:meta-yields="!tally"`), `index.css` (the rung
  #8b5cf6 → #8f61f6 and THE WINDOW ledger paragraph), the two gates, and the ACC-FIVE graft. The four
  grafted files are sha-identical to FIVE's tree (`9c7899ca` / `3c559e26` / `f358ed02` / `145ec491`);
  `gridPaths.ts` differs from FIVE's by two comment words. Confirmed.
- **My build.** Built into scratch with a private cacheDir OUTSIDE the tree: `index-8C-1kWQrhqY7.js` /
  `index-BM6A5sIYccvM.css`. It is NOT the lane's cited dist (§2.6). Every browser row below ran on MY
  dist (:4237) beside the control (:4238), identity read by asset hash; the G10 rows on my dev server of
  the tree (:4246; 4239 was held by another lane). Payloads: P1 (the lane's 9×9 codec payload, deal read
  back `dealOk: true` on every arm) and P16 (the lane's 16×16 payload).
- **Servers** killed by recorded PID: preview 48112/npx 47915 (:4237), control 48139/47917 (:4238), dev
  60746/60717 (:4246); all three ports read free afterwards. No `rm`, no `pkill`, no git in the control.
- **Instruments** (`critique/ACC-SIX/instruments/`): `c6-trace.mjs` + `c6-common.mjs` (the lane's copies,
  re-pointed), `c6-yieldclip.mjs` (NEW: the clip's trim, the lesson's life), `c6-gate-plants.sh` (NEW
  plants), `c5-gate-plants.COPY.sh` (the pass-5 plant, run first), `front-rate.min-gap.CRITIC.spec.ts` +
  `c6-g10.sh` (G10 with one min-gap print line, assertions untouched), `c6-battery.sh`. Classified
  summaries in `readings/`; raw JSON stayed in scratch.

## 1 · Re-measured (numbers)

| row | result |
|---|---|
| **Light trace, three grounds, differencing** (P1, 8 legal writes, 1280×800, chromium + webkit, dpr 1/3; hide-vs-hide noise **0** in 24/24; second bare photograph **identical** in 16/16 tree and 8/8 control cells) | Tree `#8f61f6`@1: line **3.227** (webkit dpr3 **3.273**), edge **3.226**, paper **3.867**; k .9 worst column **3.006–3.198**, fraction under 3.0 **0** in all four cells. Arm `#8b5cf6`@1: **3.072** (3.117) / **3.388** / **4.062**, k .9 under 3.10 **1.0** at chromium dpr1/dpr3 and webkit dpr1 (webkit dpr3 .014). Control: **2.876–2.946 / 3.170–3.184 / 3.751–3.760**. **REPRODUCED to the thousandth** on a clean build |
| **Dark trace** (same run) | tree `#7c3aed`@1: line **3.275–3.299**, edge **2.575**, paper **3.355**; control **3.106–3.148 / 2.441 / 3.139**. The tree beats the control on every dark median. REPRODUCED |
| **The ballot's sensitivity row, all four cells** | `#8f61f6` k .9 fraction under 3.10: **.031** chromium dpr1, **.115** chromium dpr3, **.032** webkit dpr1, **.003** webkit dpr3. The lane's ballot row prints "0–.031"; its `trace-sensitivity.txt` carries only two of the four cells (§2.7) |
| **The yield's clip, trimming paint** (NEW; `c6-yieldclip` row T: clip as shipped vs `clip-path: none` injected, meta hidden so the voice's ink is read alone; noise 0 in every cell) | count alone: **0 px** trimmed at 393×699 / 844×390 coarse and 1280×800 fine, both engines. Hint + count ("only 5 fits here" + "1 of 51 on the board"): chromium **3 px** at 393×699 and **2 px** at 1280×800 of the VOICE's own ink trimmed (all below the block's edge at 1280); webkit **0**. Undeclared (§2.3) |
| **The lesson's life** (NEW; row L: a hint-first play, meta PAINTED px after every press) | P1, every cell both engines: the hints speak "only N fits here" and the pair fits; the count paints **523–1785 px** throughout. P16 at **393×699**, both engines: **1829 → 0 → 1852 → 0 → 1883** (chromium; webkit 1782 → 0 → 1831 → 0 → 1854): the count vanishes on every hidden-single hint ("E goes nowhere else in this column") and returns on the write. At 844×390 the same presses paint 1828–1883 every time. The count strobes on a phone (§2.4) |
| **G10, bare, the tree** (the landed spec + a min-gap print, driven 125 Hz, dev :4246) | **webkit 6 runs: 5 exit 0, 1 exit 1** (run 5: gauge **62.8/s** against 62.5). Two green runs sit AT the budget (join 62.5, gauge 62.5). Every webkit run has gaps under 15.5 ms; min gap **1.00 ms** in 5 of 6 (tally or join), 7–8 ms in the rest. **chromium 3 runs: 3 exit 0** (47.1–51.8/s), but sub-15.5 ms gaps in 3/3 (min 6.2–7.5 ms). CLOCK=60: webkit exit 1 on the precondition (58.8 Hz); chromium exit 1 on "**gauge never re-cut**", not on the precondition (§2.2) |
| **The pass-5 plant, run first** (`c5-gate-plants.COPY.sh` on a mirror of THIS tree) | font census: control + alias + kebab + `v-bind="obj"` + unquoted + `v-bind:[k]` **all exit 1**. Law 20: control + href inheritance + `:stroke="\`url(#${inkId})\`"` + comment-kept count **all exit 1**. Pass 5's eight doors are CLOSED. Mirror restored cmp-identical |
| **New plants** (`c6-gate-plants.sh`, same mirror) | law 20: CONTROL literal consumer **1**, CONTROL-2 the lane's `:style` shape **1**; **green (exit 0)**: T1 `url(#${id})` built in script and bound by name (`:stroke="inkUrl"`); T2 concatenation `:stroke="'url(#' + 'solver-ink' + ')'"`; T3 gradient `:href="inkHref"`; T4 `accept="image/*"` ahead of a literal consumer (the comment stripper's `/*` swallows it). Font census: CONTROL **1**; **green**: F1 `<component :is="StagingBand" :safe-verb>`; F2 `defineAsyncComponent` alias; F3 `import { default as Band3 }`; F4 `h(StagingBand, { safeVerb })` (§2.1) |
| **Battery, bare, tree / control** | check-copy-register **0/0** (and `--self-test` 0/0) · lint:theme-tokens 0/0 · test-font-coverage 0/0 · lint:lanes 0/0 · lint:sleep 0/0 · lint:motion 0/0 · lint:live-regions 0/0 · check-property-block (chair's) 0/0 · `check-pw-projects --self-test` **1**/0 (check 8 FLOOR BAND only: chromium live 238 / floor 214, webkit 236/212; declared, the chair's restamp) · undefined-token census (chair's) **1/1** (one STALE `--refuse-dur` row on both; 0 bare undefined var(); net GREEN per A.1 ruling 4). Not re-run by me: eslint, prettier, vue-tsc, knip, vitest, filter-census (the diff adds no filter; the dist's `"filter"` token count is 11/11 against the control) |
| **Dist identity** | my clean build `index-8C-1kWQrhqY7.js` against the lane's `index-DGB-edb6nfWg.js`: the lane's CSS carries two extra rules, `.text-wrap{text-wrap:wrap}` and `.capitalize{text-transform:capitalize}` (+64 B), minted by Tailwind from the lane's `.vite-cache-acc6p6-dev/deps/@vueuse_core.js` sitting under `web/frontend` at build time; the JS differs in 280 bytes, every one a chunk-hash reference (§2.6) |

Not re-run by me: whole-DOM π at four cells (my T/L rows are narrower), G0, Arm A's occlusion, R3/R6,
the aria contract, the ABLATE yield run.

## 2 · Open gaps (each closable, numbers attached)

### 2.1 Both re-cut gates are cured for their plants, not for the class (the third pass on each)

Pass 5's eight doors are shut (all red, above). Eight more exit 0 on a broken mirror:
- **Law 20:** T1 a dynamic id built in `<script>` and bound by name (`const inkUrl = \`url(#${inkId})\``;
  `:stroke="inkUrl"`); T2 string concatenation; T3 `:href` bound by name; T4 any `/*` in a string
  (`accept="image/*"`) blanks everything up to the next `*/`, a consumer included. `DYN_PAINT_RE` keys on
  `fill|stroke` being adjacent to the literal; `stripAllComments` is regex, not a tokenizer.
- **Font census:** F1 `<component :is>`, F2 a `defineAsyncComponent` alias, F3 a named-default import,
  F4 a render function `h()`. `importMap` reads only `import X from "….vue"`. F1 and F2 are LIVE estate
  idioms (`App.vue:799/862`, `AttributionCard.vue:106`; `GameShell.vue:42`, `GameCard.vue:96`), though no
  painting binding runs through them today.

To close: key law 20 on the VALUE (any string that can evaluate to `#solver-ink`/`url(#solver-ink)`,
and any `url(#${…})`/`'url(#' +` in a file that also paints, red until resolved), and strip comments
with a string-aware scanner; resolve `:is` targets, `defineAsyncComponent` bindings and named imports
through the same map, and red an `h(<Sink>, {…})` whose object keys hit a painted prop. Land each as a
plant with its control.

### 2.2 G10 reds on THIS tree: 1 of 6 WebKit runs, and the floor fails in both engines

The co-landing is paid in code but not in the gate. WebKit run 5: gauge **62.8/s** (exit 1). Two green
runs sit at **62.5** exactly. The min gap between a consumer's re-cut frames is **1.00 ms** in 5 of 6
WebKit runs and **6.2–7.5 ms** in all three Chromium runs, against `FRONT_MIN_MS = 16`. The site is
`HandDrawnGrid.vue:178` on this tree, `fillGate.write(to, true)`: the forced end-write A.6 named on FIVE's.
The lane ran three WebKit runs, didn't print the gap, and reported G10 green, with A.6 in force. And the
CLOCK=60 negative control reds in Chromium on "gauge never re-cut" (the hint press flake FIVE's critic
names), not on the precondition, so that control isn't demonstrated there.

To close: take the leader's cure (the end-write deferred to `last + FRONT_MIN_MS`, the comparison on the
rAF timestamp or `FRONT_MIN_MS − 1`). Then show ≥ 5 runs per engine 0-red with min gap ≥ 15.5 ms on every
burst, and a CLOCK=60 row that reds on the precondition in both engines (poll the hint to a filled cell
first).

### 2.3 The yield has no gate, and its π census can't see its own property

- **No landed row holds it.** `grep` for `meta-yields`/`metaYields` in `src/**/*.test.*`, `e2e/` and
  `scripts/` returns nothing; no e2e reads `.board-margin`'s height under the count. Delete the two
  CSS rules and every suite stays green: the strip returns to 38.98 at 393×699 and 40.16 at 812×375 (the
  lane's own ABLATE), W2's tab moves ±9.10, and nothing reds. The born-RED lives only in an evidence
  instrument.
- **It trims paint, undeclared.** With the count up and a hint spoken, the clip cuts **3 px** (393×699)
  and **2 px** (1280×800) of the voice's own ink in Chromium; WebKit 0. The lane's whole-DOM π reads
  color/background/opacity/visibility/filter/fill/stroke/stroke-opacity/font, and not `clip-path`, the one
  paint property this design adds.

To close: land an e2e row (393×699 and 812×375 coarse, P16's widest pair: strip height and `.drawer-tab`
y equal to rest) with the rule deletion as its negative control. Add `clip-path` (and the pixel diff at
the block's edge) to the π census, and declare or cure the 2–3 px (a clip inset of a descender's depth
below the edge, or `overflow-clip-margin`).

### 2.4 The yield's price is a strobe, and it's keyed on hint length, not "any hint"

On P16 at 393×699 a hint-first play paints the count **1829 → 0 → 1852 → 0 → 1883 px**: it vanishes on
each press that names a hidden single and returns on the press that writes, both engines. On P1 the
naked-single copy ("only 5 fits here") fits beside the count and it paints throughout. So the lane's gap
("393 with any hint up") overstates the cell and understates the motion: the count blinks. Nothing
measures how often the first three writes meet a long hint.

To close: price the strobe (blinks per lesson across a sample of deals and both hint copies at 393 and
812×375), then either hold the count's visibility for the lesson window once it's been hidden (no
return), or ballot the strobe against the reserve's ±9.1 (the fork row, with this number in it).

### 2.5 c2 is not a lawful ballot pair

T9-B-ACC6-2's variable is the CLAIM's scope (arm (a) vs (b) differ in ledger words; the pixels are the
same). c2 frames a byte neither arm ships: `#2178a5`, a blue, beside blue user digits, the collision this
family exists to prevent. Under §2.9 and LAWS P5, a crop is banked only for a lawful pair. Strike c2 to its
numbers (2.575 shipped, 2.893 the best of any hue) and return its 24,693 B to the wave.

### 2.6 The cited dist is not the tree's

Every painted row names `index-DGB-edb6nfWg.js`. That build carries `.text-wrap` and `.capitalize`,
minted from the lane's dev cacheDir under `web/frontend` (incident 1 names the cache for `eslint .` but
not for the build). The tree's clean build is `index-8C-1kWQrhqY7.js` / `index-BM6A5sIYccvM.css`. The paint
is unaffected (two dead utilities; my trace reproduces every figure on the clean build), but the identity
is wrong and "byte-identical rebuild" was a rebuild with the same contamination. To close: cite the clean
identity and add the build contamination to the incidents.

### 2.7 Carried and small

- **The ballot row's fraction** is "0–.031"; four cells read **.003–.115** (§1).
- **The hue** moves 0.7° (293.4 against 292.7), inside the ramp's own spread (pale 293.6, deep 293.0).
  But the lock has no stated tolerance, and no tree gate reads it: r0's hue census drops the token
  (NULL) until the chair applies the PROPOSED alias diff. `#8c64f1` (292.5°, the same minimum) is unread
  painted.
- **The dark card edge** stays 2.575 (infeasible for any colour, 2.893 at best). T9-B-ACC6-2 (b) scopes
  it; FRAME_PAD is unbuilt.
- **Declared, not yours:** filter-census dark 4/16 red on both arms (the chair's fold pick); check 8.
- **Unread:** the count line's glyph-text AA (the §2.11 estate row); the r0 law-probe R1–R3/L1–L6; G0
  outside 1280×800; Arm A is still an injected clone; forced-colors / print / 200 % zoom / RTL under the
  clip.

## 3 · Closed this pass (verified)

- **§2.1 (pass 5): the balanced rung SHIPS.** `#8f61f6`@1 clears all three light grounds in both
  engines at both DPRs, beats the control on every median, and the ledger's "the ONE arm" sentence is
  struck. The window was searched before minting.
- **§2.2: the ballot's second arm clears the floor.** `#8b5cf6`@1 reads 3.072/3.388/4.062; c1 is one
  token on one page, and a lawful pair.
- **§2.3: the dark impossibility is ledgered** (the empty band, 2.893, FRAME_PAD named).
- **§2.4: the reserve is deleted and the strip holds** at 20.8 where the pair doesn't fit (the lane's P16
  rows; my T/L rows agree on the strip's content, and the clip trims 0 px of the count).
- **The 6.4 px reconciled** by arithmetic that checks: `2lh` read the block's inherited 24 px line-height,
  so 48 − 20.8 = 27.2 measured and 2 × (24 − 20.8) = 6.4 off the token arithmetic.
- **§2.5/§2.6: pass 5's eight doors red** (re-run first, above).
- **The graft is byte for byte**; the progressbar contract is ONE (valuenow = percent, valuetext = count).
- **G0, Arm A priced with digits, R3/R6 run** (the lane's rows; not re-run by me).

## 4 · Checklist

| item | verdict |
|---|---|
| vacuous convergence | clear |
| spec-cites-itself | clear (every ledger number re-read painted) |
| gates that cannot fail | **hit ×3**: law 20 on four more shapes and the font census on four (the third pass for each class); the yield has no gate at all |
| elegant-reduction trap | **hit**: the co-landing "paid" with G10 red 1/6 in WebKit and 1 ms gaps in both engines |
| legacy aliases | clear |
| masked fallbacks | **partial**: the yield hides the count whenever a long hint speaks, and the count strobes |
| unverified gestalt | partial: c2 frames an arm neither ballot arm ships |
| consumer-less substrate | clear |
| generic default | clear |
| the pixel it moves and did not declare | **hit**: 2–3 px of voice ink clipped in Chromium; the π census omits `clip-path` |
| constraints | AA from painted bytes: clear in light; the dark edge is infeasible and scoped. filterBudget: unmoved (no filter added; light 12/12 per the lane, dark inherited). M16: 0/0. @property: none added, check-property-block 0. Undefined-token census: net green. W2's mechanics: the tab holds, but ungated (§2.3). Decided history: PROPOSED only. The cited dist identity is wrong (§2.6) |

## 5 · Verdict

**ADVANCE at 82.** The family's centre moved and holds up under a clean build. The balanced rung ships
and reproduces to the thousandth in both engines. The reserve is replaced by a yield that costs the column
nothing. The 6.4 px is reconciled, and pass 5's eight gate doors are shut.

It doesn't reach the leader's number for three reasons:
- **The co-landing's gate reds on this tree** (the leader's defect, carried and unmeasured).
- **The yield, the pass's main mechanism, has no gate**, and its π census can't see its property.
- **Both source-text gates are on their third pass** with eight new Vue-legal doors open.

None of these is a missing primitive.

## Cross-pollination

- **Every lane that grafts `frontGate`** (GRAPHITE; the §3 integrator): print the min gap per burst; the
  end-write's 1 ms gap shows on green runs.
- **Every π census**: read the properties your own diff adds (`clip-path`, `mask`, `contain`), or the
  census is blind by construction.
- **Every source-text gate** (FACE, RULE, TAPE, the chair's census): a regex comment-stripper is defeated
  by `/*` inside a string (`accept="image/*"`); `<component :is>` and `defineAsyncComponent` are live
  idioms here.
- **Every lane building a dist beside a dev server**: Tailwind scans a cacheDir under the project root;
  build with the cache outside it, or the identity carries dead utilities.
- **Every "keyed on the space" design**: price the strobe, not only the hidden state.
