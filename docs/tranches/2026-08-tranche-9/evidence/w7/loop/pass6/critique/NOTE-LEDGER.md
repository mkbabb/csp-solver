# T9-W7 pass 6 · NOTE-LEDGER — the adversarial critique

I wrote neither the charter nor the prototype. **Convergence 90 (↑87). Verdict: ADVANCE.**

Everything marked **(mine)** I measured myself. I never touched the lane's tree
(`wf_f72f3b5a-83a-46`). My plants ran on a scratch REPLICA: a `git archive 74a2b5d9` with the
tree's twelve product files copied over, `cmp`-identical to the tree, and `node_modules`
symlinked. My dists were built from that replica with a private cacheDir and outDir. They came
out **byte-identical in name** to the lane's: HOLD `index-KMC3d3TWjLH2.js`, TINT
`index-DxPFe6yRCpJz.js` (`logs/build-arms.txt`). So the cited dists are this source.

Servers, each verified by asset hash:

| port | serves | pids |
|---|---|---|
| :4231 | the shared control `w7-control`, `index-CubiZsMVSwTc.js` | 87221/87428 |
| :4232 | HOLD | 87223/87418 |
| :4233 | TINT | 87226/87376 |

All three were killed by recorded PID, and all three ports read free afterwards.

Every browser row:
- deals ONE payload: the section's classic easy 9×9, 30 givens, codec-minted (`ATMuNTMw…`);
- reads the given set back before any read;
- runs both engines;
- runs the phone rigs with `hasTouch` and `(pointer: coarse)` witnessed true.

The instrument is `critique/NOTE-LEDGER/instruments/critic6.mjs`. It keeps the lane's helper
block, including its `glyphText` port of ERASE's painted-text method, and adds my own modes:
- a per-frame rAF colour sampler on the mover;
- every mover's keyframes, not just line two's;
- a π differ that normalises the boil-phase classes, so the floor is compared rather than
  skipped;
- a landscape hit test and a11y read.

Raw JSON stays in scratch (`logs/RAW-JSON-sha1.txt`). The classified summaries are
`logs/probe-{chromium,webkit}.summary.txt`.

---

## 0 · Numbers first (mine)

| row | reading (mine) | verdict on the return |
|---|---|---|
| **pass-5 plants, run FIRST** (`logs/breaks.txt`) | un-spend deleted: HOLD 0 · 50/50 (vacuous by construction), STEP 1 · 2 failed, TINT 1 · 2 failed (+GATE 1d). kf0 reverted: 1 failed / 50. Reserve deleted: 2 failed / 50. Call site `setMargin("solved it!", …)` deleted: `check-font-coverage` exit 1. Declared string deleted: exit 1. Clean: 0 | **all four pass-5 holes now RED, reproduced exactly** |
| arm census, the three ledger files whole | HOLD 0 · 50/50 · AGE 4 failed · STEP 1 · TINT 1 | **CONFIRMED** (= `breaks-final.txt`) |
| **my kf0 plants** | K1 (pre-read moved to `flush: "post"`) → RED 1 failed. K2 (the `is-spent` key dropped, so every record ages from its own ink) → RED on the open-record twin | the kf0 pair **holds** |
| **my reserve-law plants** | E1 (`min-height: 0` after `inherit` in the SAME rule) **GREEN 50/50** · E2 (override in a second `<style scoped>`) **GREEN** · E2b (`.margin-note-block > .margin-note { min-height: 0 }` inside the one block the law reads) **GREEN** · E3 (the block's reserve `1.3em → 1px`) **GREEN** · E4 (`min-height: 0 !important` in the landscape block) **GREEN** | **the row-3 law is keyed on SPELLING: five evasions** (§2.1) |
| my font-coverage plants | call site re-worded (`"solved it !"`) → exit 1. `closed: true` removed + call site deleted → exit 0 | re-cut holds; the flag has no shipped plant (§2.4) |
| stub-iso | tree 0 drift (exit 0). My plant (line one's `role`/`aria-live`/`aria-atomic` stripped from the receipt stub) → 3 drift, exit 1 | **CONFIRMED, can fail** |
| **TINT push, WAAPI hooked + per-frame colour sampled**, P3, 390×844 coarse DPR2 and 1280 DPR2, light and dark, **both engines** | Line one before the push: `.is-spent`, `color(srgb 0.149… / 0.68)` L / `(0.8196… / 0.68)` D. **kf0 = kf1 = that ink.** Animated frames sampled: 30–31 chromium / 15–16 WebKit, **max α 0.68 on every one** (pass 5: `#262626`/`#d1cfc7`, α 1). HOLD: kf0 `#262626`/`#d1cfc7` → kf1 α 0.68, max α 1 (0.994 WebKit desk dark), the designed fade. **Movers per push: exactly 1** (`margin-note-previous note-previous-enter`) in all 16 cells | **CURED, reproduced at paint-property level per frame.** Lane gap 5 ("every mover half taken") is **closed at P3** by this read |
| **landscape** 844×390 / 812×375 coarse DPR3, HOLD P3, both engines | line two `clip-path: inset(50%)`, absolute, 1×1 at (243, 388.39) / (234.5, 373.39). Strip bytes clipped vs `display:none`: **0 / 19,764** and **0 / 18,954** px (self-noise 0). scrollHeight **410/410/410**, **395/395/395** (tree / `display:none` / control). a11y: `status: only 2 fits here` + **`paragraph: only 5 fits here`** (control: status only). `elementFromPoint` at line two's pixel → `board-peek-host` (the clip takes no hits) | **CONFIRMED, both engines, to the pixel** |
| **glyph-text statistic** (§2.11), TINT spent line one vs control vs HOLD | 1280 DPR1 light: TINT **5.172 · 0.458** chr / **4.357 · 0.515** wk; control 14.517 · 0.154 / 11.419 · 0.148. 1280 DPR1 dark: 5.857 · 0.272 / 5.691 · 0.315 vs 11.656 · 0.044 / 11.41 · 0.044. 390 DPR2 light: 5.172 · 0.279 / 5.172 · 0.296 vs 0.095 / 0.102. **HOLD = control to the thousandth** on all six. Noise 0 on every read (second bare photograph) | **CONFIRMED to the thousandth.** TINT fails the median at WebKit DPR1 light, and fails the control+slack fraction everywhere |
| **π, whole body outside `.board-margin`**, HOLD vs control and control vs control, P4, both engines | 390 coarse: 1,082 elements, rect 0 · paint 0 · hard-key 0, sh 844/844, filters 25/25. 1280 fine: 1,122 elements, rect 0 · paint 0. Phase-class elements now COMPARED (keys normalised): chromium 12 H-vs-C / 14 C-vs-C; WebKit 12/12 phone and 10/0 desk. **Rect 0 on every one**; paint differs only by the phase flip, which the control-vs-control floor also shows | **CONFIRMED.** Lane gap 8 (the masked phase population) is **closed** by comparing rather than skipping |
| **filterBudget**: `filter-census.spec.ts` whole, on built dists, both projects | control 12/12 · HOLD 12/12 · TINT 12/12 (exit 0 each; the spec is light-only at 1280 and <1024) | **clear.** First run of the real gate on this family's dists; the lane read an element count |
| `@property` / undefined-token census (`pass6/instruments`, bare) | census: tree exit 1, **4 timing** (`MarginNote.vue:299/313/314/518`), control exit 1, 0 timing, 1 STALE `--refuse-dur` each (declared, A.1 ruling 4). `check-property-block --dist` (my HOLD dist): tree **RED C4 `motionRungs.ts:26`**, control GREEN; stamp `index-KMC3d3TWjLH2.js`, 42 served | **CONFIRMED**, still breached (§2.3) |
| pre-return battery (bare, tree vs a `git archive 74a2b5d9` control with `.github`) | `lint:lanes` 0/0 · `lint:theme-tokens` 0/0 · `lint:sleep` 0/0 · `test:e2e:projects` 0/0 · `check-pw-projects` 0/0 · `lint:copy` 0/0 · `check-copy-register` (bare) 0/0 · `lint:ink` 0/0 · `lint:motion` 0/0 · `lint:live-regions` 0/0 · `test:font-coverage` 0/0 · `eslint .` 0/0 · `npm run lint` (scoped prettier: `src/ scripts/ ../../scripts/ ../relay/`) 0/0 · `vue-tsc --noEmit -p tsconfig.json` 0/0 · the three ledger unit files 50/50 · unit estate (see the tail) | **CONFIRMED green**. The control's first `lint:lanes` read 2 because my archive lacked `ci.yml`; with `.github` added it reads 0 |

## 1 · What pass 6 closed (the charter's thirteen rows)

1. **TINT's flash is cured, gated and seen in paint.** The pre-flush `displacedInk` read feeds
   keyframe 0. The VTU pair reds on the reverted term and on both of my plants, K1 and K2. In
   both browsers the displaced spent record never paints above α 0.68 on any animated frame.
   **Closed.**
2. **'Cleared on undo' is gated.** GATE 1d is born-RED on STEP and TINT with the clause deleted.
   HOLD is vacuous by construction, and the lane declared it. **Closed.**
3. **Row 7's reserve has a shipping law with in-file plants.** It reds the five plants it names,
   and it is green on five I wrote (§2.1). **Partly closed.**
4. **The corpus gate is re-cut.** A closed group reds a deleted or re-worded call site; open
   groups keep the true comment. **Closed**, with two small defects (§2.4).
5. **The frames were re-shot on the shipping dists.** I looked at both:
   - P1 · P2 · **P4** light plus P4 dark, chromium and WebKit, one payload;
   - within each column only the arm moves;
   - P4 shows the thesis pose: three arms stand two sentences, and AGE one caption under an empty
     line.

   **Lawful pair. Closed** for the ledger's own question (the merged-tree coupling is §2.5).
6. **Landscape.** The berth is not built. The lane asks the chair to book §6.2 as superseded,
   which is the charter's own "or", so it is **the chair's act, not the lane's gap**. The
   unrequested clip is declared and is identical in bytes (mine) (§2.2).
7. **STEP on the wire:** authorship-blind, read on a DEV `?wire=local` room with the DEV
   control. I did not re-run it. The lane's run script shows the control served with
   `root = w7-control` from a lane-named cacheDir. The control tree's `templates.ts` mtime is
   still Sep 19, so it was not written. **Closed as a reading.**
8. **TINT under the glyph-text statistic:** measured, reproduced to the thousandth, and booked
   as the estate row. **Closed as a measurement**; the cost stands in the ballot.
9. **`@property` clause 1:** cited correctly (`:299/313/314/518` = the bank's `:282/296/297/492`).
   The emitter is named as the fold's deletion. **Still breached** (§2.3).
10. **The watch's rate:** 0.066/0.068 ms per 256-value join, about 0.7–0.9 ms/s at 10 writes/s.
    **Closed.** The payload is synthetic and was not read back (declared).
11. **Stub isomorphism:** 0 drift, and an instrument that reds. **Closed.**
12. **HOLD carries ARM C's bookkeeping:** a fold checklist row with file:line. **Booked.**
13. **The desk run-on 7.19 px** is priced, and the 2lh 6.4 px is cited to ERASE/SIX. **Booked.**

## 2 · What does not

### 2.1 The reserve law gates a spelling, not the reserve. **(mine)**

`reserveLaw()` in `MarginNote.test.ts` has three blind spots:
- It reads only the FIRST `<style scoped>`.
- It matches rules whose prelude is exactly `.margin-note`.
- It takes the FIRST `min-height` declaration in a rule.

Five one-line edits restore the 0×0 push, and each leaves all three files at 50/50:

| plant | edit |
|---|---|
| E1 | a shadowing `min-height: 0` after `inherit` in the same rule |
| E2 | the override in a second style block |
| E2b | a compound selector `.margin-note-block > .margin-note { min-height: 0 }` in the same block |
| E3 | the block's own reserve cut to 1px (the law only asks "not zero") |
| E4 | a `!important` zero in the landscape block |

This is LAWS P5's "gate a name's VALUE, never its spelling" and "a gate that enumerates plants is
cured for those plants, not for the class", for the second pass running on this row (pass 5:
ungated; pass 6: gated for its own five plants).

**The PROPOSED cure is banked:** `critique/NOTE-LEDGER/instruments/reserve-law.PROPOSED.mjs`.
- What it reads: every `<style>` block, every rule at any depth whose SUBJECT compound carries
  `.margin-note`, and every `min-height` in source order.
- The law: exactly one voice `min-height` in the SFC, the value `inherit`, seated in the <1024
  block, and the block's reserve ≥ 1em.
- Readings: tree GREEN; all seven plants (deleted, zeroed, E1–E4 with E2b) RED; the control
  `74a2b5d9` RED (0 voice reserves), so it is born-RED.

It still does not see a `:deep(.margin-note)` override from another SFC. A local e2e row reading
the empty voice's computed `min-height` against the block's at 390×844 and 844×390 is the
behavioural half.

### 2.2 The landscape clip is declared, and "the quiet voice's own pattern" is not quite true.

The lane's clip is `top:0; width:1px; height:1px; overflow:hidden; clip-path:inset(50%)`. The
quiet voice's pattern (`MarginNote.vue:256–262`) also carries `white-space: nowrap`. Without it,
line two wraps word-per-line inside a 1px box. That is the reason the sr-only idiom carries
nowrap: some screen readers read wrapped clipped text as separate lines.

Paint is unaffected (0 px, mine). The a11y change is real and good: line two is in the tree at
landscape, which the component's own comment always promised. It is still an unrequested change
to a U-10 depth ballot, now three arms (clip / `display:none` / in flow +17/+16 px). The owner
must see it as an arm, not a default slipped in.

### 2.3 `@property` clause 1 and C4 still breach on this tree.

The census reads 4 bare timing `var()`s against 0 on the control. `check-property-block` reds C4
at `motionRungs.ts:26` against the control's GREEN.

Both close only at the §13+§7+§3 fold:
- LADDER's seven static registrations;
- `motionRungs.ts` and `publishMotionRungs()` (`main.ts:14/16`) deleted.

A family whose tree breaches a constraint cannot read 100 until that fold lands. The lane is
right not to mint a second static block.

### 2.4 The corpus re-cut has no shipped negative control, and one comment is wrong.

`check-font-coverage.mjs` has no `--self-test`. The closed-group plant (a deleted call site)
lives only in the lane's `breaks.sh`. Deleting `closed: true` is one line and every shipping gate
stays green (mine: exit 0). LAWS: "every re-cut gate SHIPS WITH the negative control that reds it."

Separately, the comment at `:326` says the group is `closed` "(below)". The flag is at `:316`,
above it.

### 2.5 The ballot's frames are the ledger alone, not the section. **(coupling)**

NOTE-ERASE's pass-6 critic reads it from the other side. On ERASE's tree a HOLD record settles to
α 0.68 eight beats in (`types.ts:10`). On the merged §7 tree, HOLD at rest therefore paints what
TINT paints; they differ only in size and in the first eight beats. The T9-B-LEDGER row does not
say so.

The owner is asked HOLD vs TINT on pictures the fold will not ship. The integrator is the lane to
re-shoot them. LEDGER must state that Δ in the ballot row, in numbers:
- the time to α 0.68 on HOLD merged vs TINT;
- that TINT's AA cost then equals ERASE's settled rung.

Until then the ballot's HOLD/TINT distinction is unmeasured on the shipping section.

### 2.6 Carried and declared (re-read where marked)

- **TINT fails the glyph-text gate** (mine: WebKit DPR1 light 4.357; fraction 2–5× the
  control's). This is the estate row, loop-local "T9-R6" per chair §1.4/A.4, and TINT's ballot
  cost. The default, HOLD, equals the control to the thousandth. So the firing default does not
  lose to the control on the named statistic (on this tree; see §2.5 for the merged one).
- **STEP breaks L2 for a spent record, authorship-blind.** A ballot cost, stated.
- **The desk ballot crop was retired without a desk replacement.** The desk Δ is a number
  (7.19 px); accepted.
- **Row 10's 16×16 deal was not read back.**
- **No non-author has read the frames except me.**

## 3 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | clear: the arm census reds every non-default value; GATE 1d HOLD-vacuity declared |
| spec-cites-itself | clear |
| **gates that cannot fail** | **HIT (narrowed)**: the reserve law is evaded five ways (§2.1). The corpus flag has no shipped plant (§2.4). The pass-5 holes are all RED now |
| elegant-reduction trap | narrow HIT, carried: the rung registration is "§13's fold" |
| legacy aliases | narrow, carried: `motionRungs.ts`'s emitter vs `MOTION.rungs.leave` dies at the fold (chair §1.4) |
| masked fallbacks | the `displacedInk \|\| graphite \|\| style.color` chain: the first term is keyed on `.is-spent` and both branches are gated (K2 reds the unkeyed form). Clear |
| unverified gestalt | clear for the ledger: P4 framed, dark, WebKit, looked at. HIT for the section: the merged HOLD settle is unframed (§2.5) |
| consumer-less substrate | carried: `.is-spent` and the stamp are dead on HOLD/AGE/STEP builds (fold row 12) |
| the generic default | clear |
| π | clear: whole-body 0/0 at P4 both engines, phase population compared (mine). The landscape clip moves no painted byte (mine) |
| the constraint it forgot | AA: HOLD = control; TINT's cost booked. filterBudget: 12/12 on all three dists (mine). M16: `check-copy-register` 0/0, no new strings. W2's mechanics: untouched. Decided history: L17 (no `data-*` state), law 27 kept; R3-d/R3-g MOVED on the pass-5 PROPOSED diff, not re-run, nothing moved their subject. **@property clause 1: BREACHED** (§2.3). Undefined-token census: +4, declared |

## 4 · Verdict

**ADVANCE at 90 %** (pass 5: 87).

**+3 earned.** Every pass-5 hole is RED and reproduced. The flash cure holds per frame in paint,
both engines, both themes, both rigs. The landscape clip is byte-identical. The glyph-text
numbers reproduce to the thousandth. π is 0 with the phase population now compared. The real
filter census passes on all three dists. The battery is bare and green against a real control
archive. The frames finally show the thesis pose.

**10 refused:**
- The shipping reserve law can be passed with the reserve gone, five ways (§2.1).
- The tree still breaches `@property` clause 1 and C4 until the fold (§2.3).
- The ballot does not account for ERASE's settle on the merged section (§2.5).
- The berth waits on a chair booking.
- The corpus flag ships without its plant (§2.4).
- The clip's claim of pattern-identity is inexact (§2.2).

None is a missing primitive, a rewording or a constraint violation of the lane's own making (the
@property breach is the fold's booked node). So the verdict is ADVANCE. **The earliest 100 is
after the §13+§7+§3 fold** (C4) and a clean pass on the merged tree.

## 5 · Worth grafting elsewhere

1. **Sample the mover's computed colour every rAF during the animation**, not only keyframe 0.
   It proves "no frame darker than X" at paint-property level. Keyframes can be right while a
   composite or a second animation is wrong.
2. **π differs normalise the boil-phase classes and COMPARE them** instead of skipping keyed
   mismatches. The masked population drops to 0 hard mismatches, with rect 0 read on every
   phase element.
3. **Source-shape laws read the cascade's outcome:**
   - every `<style>` block;
   - the subject compound, not the exact prelude;
   - every declaration of the property in source order (the last one wins);
   - the value of the thing it inherits from.

   Every lane with a source-law row (ERASE's registration row, RULE's, TAPE's) should run
   E1/E2/E2b/E4-shaped plants against it.
4. **A re-cut gate that hangs on a config flag** (`closed: true`) ships a `--self-test` plant that
   deletes the flag.

## Tail · unit estate (mine, the replica)

`npx vitest run` exit **0 · 69 files / 851 tests** (= the return). `logs/unit-estate.txt`.
