# MOT-VERB · pass 6 CRITIQUE (adversarial, non-author)

Subject: the §13 tree `.claude/worktrees/wf_f72f3b5a-83a-59`, write-tree **3d25f02a** (recomputed by me through a
temporary index; the same id at return). `pass6-verb.diff` re-cut by me as `diff --binary 53a73123 3d25f02a` is
**byte-identical** to the banked file (57,984 B, 10 files, +701/−118). The dist was **rebuilt by me** outside the tree
(own cacheDir, own outDir): all 44 files sha-identical to the lane's `motverb6-dist-tree5`, entry `index-ICe9_X4WHUBR.js`.
Served on 127.0.0.1:**4230** (tree) beside the shared control `index-CubiZsMVSwTc.js` (74a2b5d9) on **:4231**, each
verified by the asset hash, both killed by recorded PID (listeners 99731/99726, npx parents 99644/99646); the band
4230–4249 read empty at return. The box was loaded (load 42–114) the whole time. I did not serve main-HEAD, so the
main-HEAD figures below are the lane's.

**CONVERGENCE: 82** (pass 5: 81). The pass-5 plants now red where the lane says they do. I re-ran Plant K and the
census scope plants, and both hold. GA1 is cured on the real surface in both engines. Against that, the new GA1 gate
**cannot see a skip inside the product's own rAF**: a runtime plant paints frame 1 at 150 ms, 142.9 px off, and the
lane's spec passes 8/8. The census cure is for the planted shapes, not the class: the `:style` OBJECT form, script
style writes and a `:not(.tail)` consumer all stay green. The pass's hard rows are still open: GB1 WebKit, GB7, the
wordmark, arm B, the recorder, and the split-arm regime.

---

## 1 · What I re-ran (tree :4230 vs control :4231, both engines, bare)

| reading | result |
| --- | --- |
| **GA1, the lane's `e2e/fold-verb.spec.ts`** | tree **8/8 pass**: frame 1 at ct 0, centre 0.00–0.03 px, width 0.00, visible min 1.000. Frame 2 at ct 24.9–41.8 ms (Chromium) and 40–66 ms (WebKit). Control **8/8 RED**: Chromium 93.11 / 92.92 / 21.33 / **161.16** (kenken, visible 0.000); WebKit 131.71 / 133.68 / 40.80 / **294.41** (visible 0.197). **Reproduced** |
| **GA1 with PLANT skip** (runtime: every explicit `startTime` write lands 150 ms early, so the fold jumps 150 ms in on the frame after the hold) | the lane's spec **8/8 PASS**: frame 1 "ct 0, centre 0.00" in every cell and engine, and frame 2 at ct 170–202. **The gate cannot fail on this break.** §2.1 |
| **GA1 critic read** (`ga1crit.spec.ts`: an in-rAF read beside a POST-PAINT read, `setTimeout 0` queued from each rAF) | clean tree: post-paint frame 1 = ct 0, c 0.00 in both engines (the cure is real). Skip plant: **post-paint frame 1 = ct 150, centre 142.9 px, width −280 px**, while the in-rAF read at the same frame says ct 0, c 0.00. Control, WebKit 1280: in-rAF c 117.87 vs post-paint **133.68** on the same frame, so in WebKit the rAF read is not the painted frame |
| **the first motion interval** (step = Δcentre + \|Δwidth\|, frame 1 → frame 2) | tree Chromium 1280: **81.9 / 105.1** after a 33.5 / 41.7 ms gap. WebKit 1280: **103.1 / 124.2** after 40 / 46 ms. Chromium 390: 29.0 / 29.5. WebKit 390: 38.7 / 28.4. Control rest → frame 1 (its jump): Chromium 1280 **107.0 / 105.5**, WebKit 233–255, Chromium 390 26.2. Control frame 1 → frame 2 gap: 33–42 ms. **The stall after the fold's mount is pre-existing and equal in both arms. The tree moved the geometry error off frame 1 but not the gap.** At Chromium 1280 its first motion step is 77–99 % of the control's jump |
| **`theme-bake-freshness`, grid half PAINTED** (copy with a PLANT hook, `tbf-plant.spec.ts`) | clean **20/20** (10 per engine); painted **8.04–14.75 %**, drift ≤ 1.4 %, core rgb(49,49,49) / rgb(199,197,190) vs live rgb(38,38,38) / rgb(209,207,199) (ΔE ≈ 17–19, cap 32). **Plant K 20/20 FAIL** (painted 95.69–96.19 %). **Plant HALF** (`.grid-ink { opacity: .45 }`) **20/20 FAIL** (core rgb(99–100) / rgb(161–162)). Plant SHIFT (`mask-position 5.5 %`) 20/20 pass, but I looked at the board and the plant moved no rule (`mask-size` makes position inert), so it is **void** and I claim nothing from it |
| **undefined-token census**, tree `check-theme-tokens --self-test` | **exit 0**; controls 1–10d all as required (S1/S4/S3 scoped, 7d `:global`, S2 tailed, 8b/8c, 9 `@media`, 10/10b/10c/10d) |
| **census, my plants** (`census-plants.mjs` through `undefinedTokens(extra)`; no tree byte touched) | RED: X5 sanity, X9 `<style>` fallback on a registered rung, X8 a different `@media`. **GREEN (holes):** X5d `:style="{ animationDuration: 'var(--ghost)' }"`, X5e the kebab-key object, **X5f the object form with a fallback on the registered `--motion-note`** (the A.5 ruling-5 masked default by another spelling), X6 `el.style.animationDuration = 'var(--ghost)'`, X6b `style.setProperty('animation-duration', 'var(--ghost)')`, X6c `var(--ease-${x})` (the stem exemption), **X7 `html:not(.theme-turning) .x` consuming a turning-only token**, X7b `.theme-turning-done .x` (a substring tail). §2.2 |
| **π, whole-DOM paint** (30 computed paint properties + tag keys, PRM-parked, one payload with the 71 aria-label givens read back equal in all arms; playing + gallery × 1280 light / 1280 dark / 390 coarse × both engines) | **moved 0 in 12/12 cells.** Only one-sided nodes: 5 tree (`div.grid-ink` + 4 boxes) vs 4 control (`svg>image[0–3]`), the declared tag change. Control-vs-control 0/0/0 |
| **filterBudget** | the estate `filter-census.spec.ts` on the served dists: **12/12 tree, 12/12 control** (light regime). My both-themes count of computed `url()` filters (hidden included): **24 = 24** tree/control, light and dark, both engines. It does not grow |
| **check-property-block** `--served :4230 --dist <my rebuild>` | **GREEN**: 8 source registrations / 8 names, 49 served (all `index-DZBxfh4CjCIq.css`), stamp `index-ICe9_X4WHUBR.js`; self-test **0** |
| **M16** `check-copy-register --self-test` | **0** tree, 0 control |
| **the battery, BARE** (tree / control) | copy 0/0 · lint:lanes 0/0 · lint:theme-tokens 0/0 · lint:sleep 0/0 · test:e2e:projects 0/0 · check-pw-projects 0/0 (37 specs, 565 tests, fold-verb in the manifest) · lint:motion 0/0 · lint:bands **0/1** · lint:verbs **0/1** (the scripts are absent on the control, inherited and declared) · `eslint .` 0/0 · `npm run lint` (the scoped prettier) 0/0 |

## 2 · Open rows the return does not name

### 2.1 GA1 reads the pre-callback state, so it cannot see the product's own first-frame write. STRUCK until re-cut.

`foldFrames` samples in the spec's rAF. It was registered a frame before the keypress, so it runs BEFORE the
`holdFirstFrame` rAF that sets `startTime`. It therefore always reads the paused, ct-0 state of frame 1, whatever
that callback then paints. PLANT skip (startTime − 150) paints frame 1 at 150 ms (post-paint centre 142.9 px, width
−280 px, both engines), and the lane's spec passes **8/8**. Plant P only ablated the hold; nothing planted a write
after it. The spec also bounds nothing after frame 1. In WebKit the in-rAF rect is not the painted rect even on the
control (117.87 vs 133.68 px), so "measured by rAF" is not "the first painted frame" in the engine the owner audits on.
**Closable:** read each frame POST-PAINT (a `setTimeout 0` queued from the rAF, or the next frame's read with its
timeline time), and assert the clock identity `ct(frame k) = timeline(k) − timeline(frame 1) ± 2 ms` for k = 2, 3.
Ship PLANT skip as the negative control in the same batch (it reds on ct(frame 2) 170–202 against a 25–66 ms interval).

### 2.2 The census is cured for the planted shapes, not the class (LAWS P5: "key on the rule's SHAPE").

The template arm reads a declaration opened by a quote or a comma. A Vue style OBJECT
(`{ animationDuration: 'var(--x)' }`) puts the quote AFTER the colon, so the `var()` is never scanned. X5f, the
masked default of A.5 ruling 5 written as an object, is green. So are script writes (`el.style.x = 'var(--x)'` and
`setProperty`) and the stem exemption (LAWS P5: "reds dynamic ids and non-literal binds"). The live estate already
carries the object form in TS: `playerIdentity.ts:69` `"--color-user-ink": \`oklch(var(--peer-ink-l) …)\``. It is
unread today, although it is declared. The conditional arm matches a tail as a SUBSTRING of the consumer's selector
chain. `html:not(.theme-turning) .x` is exactly the rule that runs when the token is absent, and it reads green.
**Closable:** scan every `var(--…)` in a string literal of a `.vue`/`.ts` file whose enclosing key or call names a
CSS property: object keys in both cases, `.style.<prop> =`, `setProperty('<prop>'`. Red a non-literal stem, or
ledger each stem site with its value set. Match a tail as a compound (`.theme-turning` not inside `:not(…)`, word-
bounded). Add X5d/X5f/X6/X7 to the self-test as controls 11–14.

### 2.3 The M19 split arms were declared unframeable, but the intake offers the regime.

INTAKE row 40 names GA8's regime: "844×390 or 568×320, **or a planted height**". The lane found the gallery never
scrolls at the first two and stopped there. So `DECK_PIN` viewport/document is two code paths with no pixel the owner
can choose between, which U-10 does not meet. **Closable:** plant a document height (a spacer, or a `min-height` on
the gallery's page) so the page scrolls under the leave. Frame both arms at one scroll offset on one payload, or state
that the arms are the same design and retire one.

### 2.4 Arm B (B22) is unbuilt on a reading the charter contradicts.

The pass-6 charter row 10 and registry-v5 §5 order it BUILT (U-10). The lane reads INTAKE's "built on the chair's or
owner's word" as unmet. The charter is the chair's instrument. This is the chair's to rule. Until then B22 goes to the
owner with one arm, and GB6 cannot adjudicate it (§3).

## 3 · Rows the return names, which I confirm are open

- **GB1 WebKit NOT met** (the lane's cold 95–265 ms, 4–7 frames > 34, loaded box). **Chromium's 34 ms clause fails
  in 4/6.** The quiet-box read is still owed. My fold-interval numbers (§1) show a 33–46 ms gap after the fold's
  mount in both arms, and no gate bounds it.
- **GB7 PRM cold cut NOT met** in either engine. The WebKit warm PRM flip is ~+25 ms against main-HEAD (lane).
- **The wordmark half is BLOCKED with no candidate tried** (a device-px mask, a mask `<image>` with a resolution,
  `warm()` on 0.12.1). This is the third pass it has been open.
- **Row 40 / GB6**: the recorder does not discriminate. 19–25 toggle poses were read with or without a 300 ms stall,
  so GA3/GA4/GA7/GA8, the recordVideo WebKit arm and GB4's raster union are unread. INTAKE says "RED by construction".
  The instrument that should show it does not.
- **Rows 32 (poster exit, maxStep 0.0–634 run to run) and 34 (held wordmark)** are unmeasured. The classic-scrollbar
  regime was not reached. GB4 idle and GA9 were not re-read. Row 39's estate is partial (gallery, visual-golden,
  visual-regression and multiplayer not run). The M15 crop instants were not re-cropped.

## 4 · CHECKLIST

| item | reading |
| --- | --- |
| vacuous convergence | **HIT**: GA1 passes a tree whose painted frame 1 is 150 ms in (§2.1) |
| spec-cites-itself | clear. tbf now reads ON−OFF paint, and K and HALF red it (I reproduced both) |
| gates that cannot fail | **HIT**: GA1 on a post-hold skip. The census on object/script consumers, stems and `:not()` tails (§2.2). GB6 is non-discriminating (declared) |
| elegant-reduction trap | **HIT, declared**: the grid half only (the wordmark BLOCKED); GA1 cures frame 1 while the 33–46 ms gap after it stands in both arms |
| legacy aliases | narrowed: `--ease-prmFade` admitted by the chair as a PRM carve-out, bound by value (LADDER's B8) |
| masked fallbacks | **HIT**: X5f, a fallback on a registered rung in a `:style` object, is not seen |
| unverified gestalt | clear on B21/B23: I looked at both crops, one payload and one constant each. No M19 split-arm crop (§2.3) |
| consumer-less substrate | `ink-rub-out` is still consumer-less; the fold checklist carries it by name. The B23 arm-(b) rule is dead CSS under the default, by U-10 design |
| generic default | clear |
| π | **clear at rest**: 0 moved in 12 cells, both engines, control-vs-control 0 |
| the constraint it forgot | AA: rest paint unchanged (π 0 moved; tbf core colours equal both themes); I did not take a fresh glyph-text read, and the carry is DECLARED. filterBudget equal to the control. M16 0. @property GREEN. W2 untouched. Decided history: none moved (B10 stated SHIPPING). Undefined-token census **HIT** (§2.2) |

## 5 · STRENGTHS

1. **GA1 is cured in both engines on the real surface.** Frame 1 is at rest (0.00–0.03 px, post-paint confirmed)
   where the control jumps 93/161 px in Chromium and 132/294 px in WebKit. The kenken regression (the lane's own pass-5
   lift) was found by the lane's own new estate spec, cured, and kept as a negative control.
2. **The pass-5 tautology is gone.** The grid half reads PAINT (ON−OFF). Plant K reds 20/20 and a faint-ink plant reds
   20/20. I reproduced both, which answers the Plant K species cleanly.
3. **The census scope holes (S1–S4, S2, the @media arm, the template string, the masked default in `style=`) are
   cured**, with tree-agnostic plants in the self-test.
4. **The ballots are honest**: B21 and B23 are each one constant, one payload, both arms built and looked at. B10 is
   restated as SHIPPING with dense-grid numbers. The WebKit price is carried into B22's text.
5. **The record reproduces**: the diff is byte-identical and the dist is byte-identical on my clean rebuild.

## 6 · VERDICT

**ADVANCE at 82.** The pass closed its three struck gates (census, tbf, B8 via LADDER) and cured GA1, and I
reproduced every one of those. The number rises by one and not more. The new GA1 gate is blind to the write it exists
to police, which is the family's fourth gate-that-cannot-fail in two passes. The census's cure is shape-enumerated.
The pass's hard rows are untouched or declared blocked: GB1/GB7 WebKit, the wordmark, arm B, the recorder, the
scrolling regime. Nothing here is a rewording, and no constraint is broken in paint.

## 7 · CROSS-POLLINATION

1. **Every rAF-sampled first-frame or rate row (LADDER, FACE's dock, FIVE's G10) ← §2.1**: a sampler registered
   before the product's rAF reads the pre-callback state. Read post-paint, and plant a write inside the product's own
   rAF.
2. **The chair's one census copy and every rung consumer ← §2.2**: the object form, script writes and `:not()` tails.
   PLR-SELF's and MRK-LIVE's inherited rows (A.3) ride the same scanner.
3. **GB1/GB7 and the §10 dock ← the post-mount gap**: a 33–46 ms interval right after a held frame is a stall moved,
   not a stall cured. Bound the first MOTION interval, not only frame 1.
4. **Any lane with a U-10 pair that "paints the same" ← §2.3**: plant the regime that tells the arms apart, or retire
   an arm.

### Incidents (mine)

- My first battery run reported **false zeros**: `$?` was read after a command substitution in the same `echo`. I
  caught it on the control's absent-script rows reading 0. I re-ran with the exit captured first (`battery2.sh`), and
  only that table is cited.
- One Bash call's redirect path had a `/tmp/../` typo. The shell refused the redirect, so the script never ran and no
  file was written. I re-ran it.
- Plant SHIFT was void (the mask position has no effect). I checked it by eye and cite nothing from it.
- Scratch configs lived in `<tree>/web/frontend/.verbcrit6/` and were `mv`ed to `<scratchpad>/trash-verbcrit6-1/`.
  Nothing was `rm`'d. No git in the control tree. The tree's write-tree at return is 3d25f02a, as found.
- Banked here: instruments (`ga1crit`, `foldverb-plant`, `tbf-plant` as a diff, `census-plants.mjs`, `pi6`,
  `filtercount`, `battery2.sh`) and summarised logs only. No crop banked.
