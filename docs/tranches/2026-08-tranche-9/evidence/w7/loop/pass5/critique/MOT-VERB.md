# MOT-VERB · pass 5 CRITIQUE (adversarial, non-author)

Subject: the merged §13 tree `.claude/worktrees/wf_f72f3b5a-83a-59` at tree hash **9a5475da** (I
recomputed it through a temporary index: 55 files, +5,971/−283 vs `74a2b5d9`, the README's figure),
VERB's delta `pass5-verb.diff` (16 files, +590/−172), the README, instruments and two crops under
`pass5/prototype/MOT-VERB/`. LAWS, pass-5/4/3 chair rulings, registry-v4 §1/§2/§3/§5/§6, the
charter and INTAKE.md rows 30–41 read first.

Everything marked **(critic)** is mine, on my own servers: the tree's dist **rebuilt by me** from the
tree with a cacheDir and outDir OUTSIDE the tree (scratch), **byte-identical** to the lane's `dist/`
(`index-DWMUHdQr1EaZ.js`, every file's sha equal, so the two post-build src mtimes changed no
output), served on **127.0.0.1:4240**; the chair's control `index-CubiZsMVSwTc.js` (74a2b5d9) on
**:4241**; a planted dist on **:4242**. Each port verified by its entry hash, killed by recorded PID
(41169 / 41168 / 53528); band 4230–4249 read empty at return. Every arm dealt the lane's encoded
payload `?board=ATMuMDM0NjA4…` and the given-set read back equal in every arm. The tree was returned
at tree hash 9a5475da, the same one I found, with every plant reverted by `cp` and sha1-verified.
I did not re-run main-HEAD (the second control). Its figures below are the lane's, marked so.

**CONVERGENCE: 81** (pass 4: 78). Ten of the pass-4 critic's eleven section rows are closed on the
tree, and I re-ran and confirmed each one. Both of the owner's marks moved a long way in Chromium,
and I reproduced that. Against that, I found four defects the return does not name. One is a
second scope hole in the wave's census. One is an estate spec re-cut that can no longer fail on
the grid's paint. One is a laundering path through B8. One is a sentence about 240→250 that the
tree contradicts. The M15/M19 rows also carry their declared WebKit and arm-B gaps.

---

## 1 · WHAT I RE-RAN, AND WHAT HELD

| reading | (critic) result, tree vs 74a2b5d9, both engines |
| --- | --- |
| **M19 enter, frame-1 centre (GA1)** | chromium: **0 / 0** at 1280 and 390, visible fraction **1.0** every frame. Control: **92.96** (vis 0.235) / **21.38** (vis 0.468). webkit: **raw 3.76** at 1280 (dx −3.55, dy −1.23, dw −7.37 at ct 4 ms; residual 0.76) and 1.23 at 390. Control: 104.14 / 26.77. So the **74a2b5d9 control carries the census's jump too**, and the cure is real |
| **M19 exit (GA5/GA6)** | chromium 1280: residual **0 / 0**, card **407.9 constant** (control has no glide, card 104). 390: residual 0, card 357.8 constant, max step 3.9, 0 steps > 20 (control 2 steps, 135.5 px). webkit 1280: residual **1.95 / 1.64**, card constant, **1 step of 36.6 px** on a >34 ms frame. webkit 390: residual 0.24 / 0.6, max step 6.1 |
| **M19 encodes / scroll** | 0 encodes inside the 520 ms fold in both engines (the wordmark's 4 land at +537…+539). Control: 4 at +15…+18. scrollWidth excess 0, scrollX 0 |
| **M15 cold flip, chromium** (2 rounds, both boots, 1280 + 390) | born **0.222–0.223**, max **16.6–17.1 ms**, 0 frames > 34, dS ≤ 0.044, draws 4 / hrefs 4 (the wordmark), `.boil-frame-bitmap` style mutations 0. Control: born 0.448–0.514, max **108.7–117.8**, 2 frames > 50, dS 0.31–0.36, 8 / 8. Warm flips are equal (10–17 ms) |
| **M15 cold flip, webkit** | born **0.195–0.267** (control 0.578–1.024). max **40–69 ms** with 1–2 frames > 34 on every cold flip (control 157–354). dS **0.059–0.156**, over 0.08 in **5 of 8** cold reads. **Warm: 41–62 ms on EVERY flip** (control warm 30–42), dS 0.054–0.137. GB1 is NOT met in WebKit, and the warm flip is slower on every flip. This is the lane's declared price, reproduced |
| **π, paint properties + tags** (30 computed paint props on every rendered element, keyed by path; playing + gallery poses × 1280 light / 1280 dark / 390 coarse × both engines, PRM-parked) | **moved 0** in all 12 cells. One-sided: **5 after** (`div.grid-ink` + 4 boxes) vs **4 control** (`svg>image[0–3]`), which is the declared tag change and nothing else. Control-vs-control: 0 / 0 / 0 |
| **AA from painted bytes** (grid rules vs the median paper pixel; DPR 2; digits hidden; sensitivity row at 50/70/90/100 % of the max deviation) | chromium light p70 median **11.006 / 11.006**, under-3 0.006 / 0.004. Dark **10.833 / 10.833**, 0 / 0. webkit light p70 **11.006 vs 11.52**, p100 14.485 vs 15.251 (the declared −0.66 % tone shift). Dark 10.833 / 10.833. Every arm is far above 3:1. **AA clear**; control-vs-control is identical |
| **idle** (8 s of rAF at rest, boil running, ×2 interleaved) | chromium after on-time **99.8–100 %**, long33 **0**. Composited layers **45 / 36 drawn, 6.33 Mpx vs the control's 8.71 Mpx** (the masked boxes cost LESS layer area). webkit 100 %, long33 0 (rAF only). T4-P1's idle shape holds |
| **filterBudget** | `filter-census.spec.ts` on the BUILT dist, throttle config: **12 passed on the tree and 12 on the control** (light regime, the spec's own) |
| **gates, BARE** | `lint:bands` **0** (B1–B12 ✓, B8 ✓ with no env var; `MOTION_LADDER_B8_OWNED` is gone from ci.yml, the script and package.json) · `lint:verbs` **0** · `lint:theme-tokens` **0** · `lint:motion` **0** · `lint:copy` **0** (M16) · `lint:lanes` 0/0 · `lint:sleep` 0/0 · `test:e2e:projects` 0/0 · `lint:theme-selectors` 0/0 · `lint:live-regions` 0/0 · `lint` (prettier) **0** · prettier over `e2e/` too **0** · `eslint .` **0** |

### The gates, tried on a broken tree (every plant reverted by cp + sha1)

| plant | result |
| --- | --- |
| **B** (pass 4's): the token declared in MarginNote's scoped `.margin-note {}` | `lint:theme-tokens` **exit 1**, `SolverErrorNote.vue:65 --critic-ghost-ms`. **Closed** |
| **S1**: the same token declared as `:root { … }` INSIDE MarginNote's `<style scoped>` | **exit 0**. Vue compiles it to `[data-v-x]:root`, which matches nothing (I checked with `@vue/compiler-sfc`) |
| **S4**: `html { … }` inside the scoped block | **exit 0** (compiles to `html[data-v-x]`, matches nothing) |
| **S3**: `*.margin-note { … }` inside the scoped block | **exit 0** (ROOT_SELECTOR admits `*` + any compound tail) |
| **S2**: the token declared ONLY in `html.theme-turning {}` in index.css | **exit 0**. It resolves only during the dusk, so it is undefined at rest |
| **P1**: `opacity 100ms ease-in` back at the toggle | `lint:bands` **exit 1**, B8 at `DarkModeToggle.vue:892` |
| **P2**: `@property --motion-note` wrapped in `@media screen {}` | `lint:bands` **exit 1**: B3 reports "registered INSIDE a brace (depth 1)" AND "published but never registered". **Both arms of B3 are live** |
| **P3**: `both` on a layDown animation in MarginNote (not the self-test's site) | `lint:verbs` **exit 1**, "layDown fills none, and this declaration fills both" |
| **P5**: `--ease-starTuck: ease-in; --ease-prmLinear: linear;` (the cure's VALUES reverted to the UA keywords) | **`lint:bands` 0, `lint:verbs` 0, `lint:theme-tokens` 0, `lint:motion` 0**. See §2.3 |
| **K**: `.grid-ink .boil-frame-bitmap { mask-image: none !important }`, built and served (:4242) | the board paints **99.7 % dark pixels** (tree 11.3 %) in both engines. **`theme-bake-freshness` 20/20 PASSED**, **`visual-regression` 24/24 PASSED**, and only the darwin `visual-golden` reds (2 failed). See §2.2 |

---

## 2 · THE OPEN ROWS: four the return does not name

### 2.1 The scope-keyed census has a second scope hole, the same species as PLANT B.

`isGlobalRule` asks only whether a rule's selector is `:root`/`html`/`*` (with a compound tail). It
never asks whether the `<style>` block is **scoped**. Inside a scoped block Vue appends the scope
attribute (`:root` → `[data-v-x]:root`, `html` → `html[data-v-x]`, `*` → `[data-v-x]`), so a
declaration there is local or dead at runtime, while the census counts it GLOBAL. Plants S1/S4/S3
each give **exit 0** with an undefined timing token in SolverErrorNote's real `animation` slot. S2 is
the conditional arm: a compound tail (`html.theme-turning`, `:root.dark`) makes the declaration
exist only under that class, and the census reads it as always declared. A scan of the tree finds
**no** such declaration today (0 root-selector tokens in any scoped block), so nothing is broken
now. The check is that the scan survives one, as with pass 4's PLANT B.
**Closable:** a scoped block is never GLOBAL. A root compound with a tail counts GLOBAL only when
the same token is also declared on the bare root, otherwise CONDITIONAL, which is red when consumed
outside a same-class rule. Add S1 and S2 to the self-test as controls 7 and 8.

### 2.2 `theme-bake-freshness`'s grid half re-cut into a computed-style tautology, and no browserless or CI gate sees the grid's paint.

The re-cut compares `getComputedStyle(box).backgroundColor` (which IS `var(--grid-line-color)`) with
a probe's `color: var(--grid-line-color)` in the same cascade. That asks the property to equal
itself. Its "vacuity guard" reads the INLINE `mask-image` URL, which a stylesheet `!important`
overrides without touching. **PLANT K** turned every pose box into a solid square of ink (99.7 %
dark pixels, both engines) and the spec passed **20/20**. `visual-regression` passed **24/24**, since
it counts layers and never reads a pixel. Only the darwin `visual-golden` goldens caught it (2
failed), and they are a local instrument (O-12: CI is browserless). The spec's pre-re-cut form read
the bake's PAINTED mean ink. The re-cut kept the no-re-mint arm, which is correct and born-RED
10/10, and it dropped the painted arm. That is the "spec cites itself" failure, and the gate
cannot fail on a broken mask.
**Closable:** assert the PAINTED grid in the spec. Take an element screenshot of the grid box and
read its ink fraction within ±X % of the fresh load and its ink colour against the live line
colour (the lane's GB3 shape, moved into the estate). Ship PLANT K as its negative control in the
same batch.

### 2.3 B8's cure is a name over a keyword, and the value can go back to the keyword under a green battery.

The five sites now read `var(--ease-starTuck)` and so on, and the four new tokens carry the
keywords' control points written out. **PLANT P5** set the tokens' VALUES back to `ease-in` / `linear`
and every gate stayed at **0** (bands, verbs, theme-tokens, motion). B8 reads the declaration site,
never what the token resolves to. The paint does not change (same curve either way), which is why
this is a gate hole and not a pixel. But the pass-4 ruling was "no transition ships on the UA's
taste", and it now holds by spelling only. Separately, `--ease-prmFade` is `--verb-dusk-ease`'s
exact twin. It was minted because lint:verbs' property law REFUSES dusk on `opacity` (ci.yml's own
retired comment says so), and it is then declared a duplicate. That is a legacy alias: the refused
binding, under a new name.
**Closable:** B8 resolves `--ease-*` / `--verb-*-ease` declarations and reds on a keyword value
(P5 as its control). Then EITHER amend the verb law to admit dusk on the toggle's PRM opacity
fade (the chair's row), OR state that `--ease-prmFade` is a PRM-fallback shape outside the verb
set, with a rule that says so. The declared-duplicate row alone does not do that.

### 2.4 "240 → 250 is PROPOSED only" is false of the tree.

The return's movedRows says that "240→250 is PROPOSED only". The lane's own generated table
(`readings/fixed-t-generated.txt`, "length moved on 7 terms") shows the tree SHIPPING it:
`CrayonHeart.vue:329` (control `opacity 240ms ease` → `var(--motion-note)` = 250), `HandDrawnGrid.vue:588`,
`GameGallery.vue:1473` ×2 (240→250), and `index.css:704/722` (500→520). F7 §3.3's 240 ms wink is a
documented pose, and the pass-4 chair said "a rung is not a licence to re-time a ratified pose".
These rounds are LADDER's rung consolidation, priced at 0.0233/0.0243 in pass 4. So this is a
statement defect, not a hidden move. But the owner's ballot text must say that they ship.
**Closable:** either keep the literal lengths at those sites until the audition is disposed, or
restate the row as "240→250 and 500→520 SHIP at 4 declarations / 7 terms, joint Δ 0.3537 / 0.3545,
PROPOSED to the owner".

A smaller point on the same table: "joint length×curve differs on 31" counts sampling-grid
artifacts. The curve-only column samples 21 fractions and the joint column samples whole ms, so 24
of the 31 have equal lengths, and the 21-fraction worst figures are floors (standard→layDown:
0.5425 sampled, 0.5479 dense). Print both on the dense grid.

---

## 3 · THE ROWS THE RETURN NAMES, which I confirm are open

- **GB1 WebKit** (§1): cold max 40–69 ms, dS over 0.08 in 5/8, and warm 41–62 ms on every flip
  against the control's 30–42. Arm A's price, which T9-B22 must carry.
- **GB3**: the Δ9 WebKit light tone shift is visible in my AA read too (p70 11.006 vs 11.52). The
  chair's tolerance.
- **GA1 WebKit, raw**: **3.76 px** at 1280 in my run, over the ≤ 3 px gate. The residual is 0.76.
  The lane quotes raw 0–3.0, so the row is marginal both ways, and the gate's definition (raw or
  residual) must be written into the gate.
- **The wordmark half is BLOCKED** (row 37): 4 draws and 4 href swaps on every flip, cold and warm.
- **Arm B (GM-1/GM-3) is not built**, and **M19's two arms are not split** (`--deck-top` vs the
  held card box). U-10 wants both arms framed. The owner cannot yet dispose M15 or M19 as the
  charter framed them.
- **Row 40**: GA3 (the painted-frame recorder as an estate spec), GB6, GA7–9 and GB4's raster union
  are not built. Every M19 number, mine included, is rAF + `getBoundingClientRect`. A RECT IS
  NOT PAINT.
- **Unmeasured**: row 34 (held-wordmark softness), row 32's poster exit (632 px cut), row 31's
  classic-scrollbar regime and a non-zero deck index.
- **`ink-rub-out` is consumer-less** (index.css:1260; only comments name it). This is the second
  pass it has been open, held on NOTE-ERASE.
- **Toggle beats**: compared as serialized strings only.

## 4 · CHECKLIST

| item | reading |
| --- | --- |
| vacuous convergence | clear on the section gates (B, P1, P2, P3 red). **HIT** on the estate spec (§2.2) |
| spec-cites-itself | **HIT**: theme-bake's grid ink compares `var(--grid-line-color)` with itself (§2.2) |
| gates that cannot fail | **HIT**: the census on scoped root selectors and conditional roots (§2.1). B8 on token values (§2.3). theme-bake/visual-regression on a dead mask (§2.2) |
| elegant-reduction trap | **HIT, declared**: "arm A, the grid half" leaves the wordmark (the other half of M15's stall) BLOCKED and arm B unbuilt |
| legacy aliases | **HIT, narrow**: `--ease-prmFade` = `--verb-dusk-ease` minted around a refused binding (§2.3) |
| masked fallbacks | clear: `Number(--live-fit) \|\| 1` is gone, and an unset fit is a cut (the lane's born-RED, and the code confirms it) |
| unverified gestalt | partial: B10's crop is one payload, one instant, one engine, and I looked at it (givens match; after near-opaque, control faint). M15's crop pairs frames +84/+186/+302/+499 against +90/+183/+292/+497, uncaptioned. Every M19 claim is rAF only |
| consumer-less substrate | **HIT**: `ink-rub-out` |
| generic default | clear: no new surface |
| π | **clear at rest**: 0 paint deltas in 12 cells, both engines, with only the declared tag change. The in-flight fold's z-order deltas (`.is-folding` z 1/2, `.is-unfolding`, the band's isolation) are declared and are the chair's row |
| the constraint it forgot | AA clear (painted, sensitivity row). filterBudget 12/12 = control. M16 0. W2 untouched. @property one block with both B3 arms live. Undefined-token census **HIT** (§2.1). Decided history: **HIT** on the 240→250 statement (§2.4) |

## 5 · STRENGTHS

1. **Both of the owner's marks moved on the real surface, and I reproduced both numbers.** The
   fold's 92.96 px centre jump and the 0.235 visible fraction on the control became 0 px and 1.0
   in Chromium. The cold Bloom's 108–118 ms stall with born 0.51 became 16.7 ms with born 0.22.
   The WebKit cold stall of 157–354 ms became 40–69 ms.
2. **The grid's theme flip bakes nothing**, and the idle cost went DOWN: layer area 6.33 vs 8.71 Mpx,
   long33 0 in both engines, AA equal, π clean.
3. **Ten of the pass-4 critic's rows closed on the tree**, each one broken by me and seen red:
   PLANT B, the brace-nested registration, B3's unregistered arm, B8 bare with the env var deleted,
   and rule 9 on a new site.
4. **The payload law is honoured everywhere I looked.** The readback was re-cut after the lane
   found LADDER's innerText readback vacuous, which is a cross-lane catch.
5. **The dist is real.** A clean rebuild from the tree reproduced it byte for byte.

## 6 · VERDICT

**ADVANCE at 81.** The verb grammar is converged at the section-gate level, and the owner's marks
are cured where the lane claims (Chromium, the grid, the fold's geometry). The number is held
below 90 by what the pass did not build (arm B, the M19 arm split, the painted recorder, the
wordmark half), by WebKit's GB1/GB3, and by four holes a plant opens in one line each. Nothing
here is a rewording that retires the idea, and no constraint is violated in paint.

## 7 · CROSS-POLLINATION

1. **Every rung consumer running the census copy ← §2.1**: add the scoped-block check before any
   lane cites the copy. The copy at `instruments/undefined-token-census.copy.mjs` inherits the hole.
2. **Every lane that re-cuts an estate spec off a bake ← PLANT K**: a re-cut that reads computed
   style in place of pixels must ship a planted-paint control. "The box's colour equals the token"
   is not paint.
3. **Every ledger/token cure ← P5**: a cure by naming must gate the name's VALUE, or it can be
   un-cured with no gate turning red.
4. **MOT-LADDER ← §2.4**: rung consolidation that re-times a documented pose is stated as SHIPPING
   in the ballot text, never as "proposed".
5. **ACC-FIVE / any `poseFronts` consumer ← the idle layer census**: a `will-change` mask stack
   is measurable with `LayerTree` in one call (count, drawn, summed area). Here it came out cheaper
   than the `<image>` stack.

### Housekeeping and incidents (mine)

- My first π run keyed elements by sibling index, which the inserted `div.grid-ink` shifted
  (557/556 one-sided). It also diffed class names, where LADDER's Tailwind `duration-[var(…)]` renames
  showed as 23 "moved". I stopped it, re-keyed (grid-ink excluded from indexing, class names
  reported but not diffed) and re-ran. Only the second run is banked.
- My first AA run overflowed the stack (`Math.max(...)` over 800 k pixels). I fixed it and re-ran.
- I ran the read-only lint scripts in the control tree for the control column. Its `git status`
  is unchanged (only the chair's pre-existing `build.log` and `.vite-control.config.ts`).
- The estate runs wrote `web/frontend/test-results/` into the work tree. I deleted it (reporters
  forced to `line`, so no report folder was written). The work tree is at 9a5475da as found.
- I built the plant from the real tree with a scratch outDir OUTSIDE it, and restored
  `HandDrawnGrid.vue` by cp + sha1 before serving.
- Summaries of every run are banked under `pass5/critique/MOT-VERB/logs/`, and my four specs plus
  the plant script under `instruments/`. I banked no crop.
