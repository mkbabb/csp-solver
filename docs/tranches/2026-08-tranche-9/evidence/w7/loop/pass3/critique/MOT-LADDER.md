# MOT-LADDER — pass 3 CRITIQUE (adversarial, non-author)

T9-W7 §13 the transition grammar. Subject: `pass3/synthesize/MOT-LADDER.md` + the prototype in
`.claude/worktrees/wf_f72f3b5a-83a-59` (cut from `74a2b5d9`, uncommitted, 44 modified + 2
untracked). Base and π control in every row below: **`74a2b5d9`**, built and served beside it.

**CONVERGENCE: 61 %. VERDICT: ADVANCE.**

The centre is real and is now better proven than the return claims. Against it: three gates in
the family's own table are demonstrably unable to fail on the thing they name, the CI lane the
diff adds exits 1 on the diff's own tree, and an axis the spec put out of scope — the curve —
moved at about ten sites with no measurement. None of that is a missing primitive and none of it
is a rewording, so the family advances; it does not close.

---

## 0 · What I did, and on what

Everything below is my own reading on my own build, not a re-print of the return.

| act | how |
| --- | --- |
| built the prototype | `npx vite build` with a private `cacheDir`, from the worktree |
| built the control | a fresh detached worktree at `74a2b5d9`, same node_modules, private cacheDir (removed at return) |
| served both | `python3 -m http.server` on 4232 (after) / 4233 (control), 127.0.0.1 |
| **verified each port by its own build's asset hash, never by a 200** | after `index-BJNDhR7GUB_y.js` · control `index-CubiZsMVSwTc.js` — the prototype's own banked law, and it reproduces its dist identity exactly |
| re-measured | the node, the PRM roster, B12 absence, a π rect census, a colour + filter census — chromium and webkit |
| ran what the lane owed | the estate's `filter-census.spec.ts` under `playwright-throttle.config.ts`, and the goldens under `playwright-golden.config.ts`, both against the prototype's dist |
| attacked the gate | three scratch-tree experiments against B6, G-DOCK-BAND, and the CI lane |
| killed | every server; the band 4230–4249 reads **empty** at return; the control worktree is removed |

Readings under `critique/MOT-LADDER/readings/` (100 KB, no frames — nothing here needed a picture
a number could not say).

---

## 1 · The strengths, measured rather than accepted

**1. The centre holds, and the return under-claimed it.** The return priced PRM over CSSOM
*rules* (56/55 rules, 31/30 reading a rung, 0 nonzero). I priced it over **rendered elements**,
after against control, at 1440×900 under `reducedMotion: reduce`:

| | chromium | webkit |
| --- | --- | --- |
| control `74a2b5d9`, live elements whose `transition-duration` resolves nonzero under reduce | **62** | **62** |
| after | **16** | **16** |

Forty-six elements that tweened under `reduce` at HEAD stop, identically in both engines. That is
the family's whole thesis on the surface, and it is a bigger number than the lane put in its own
return. (`readings/E-prm-roster-*.json`)

**2. Absence reads as reduce, and the registration is real in the shipped bytes.** I confirmed
the seven `@property --motion-*` survive the build **hoisted to top level** (brace depth 0 in
`index-WFTPcFJMLthn.css`), at `initial-value: 0s`, and that `:root{--default-transition-duration:
var(--motion-whisper)}` lands unlayered at offset 90,996 against Tailwind's own layered `.15s` at
63,659 — so the ladder wins the cascade by layer, not by luck. With the publisher node removed
live, `--motion-throw` reads `0s`, `.drawer-tab-text` reads `0s` **and keeps `transition-property:
transform`**, both engines. (`readings/B-absence-*.json`) The `0 fallbacks` claim is independently
true: I walked the live CSSOM for `var(--motion-*,` and counted **0**.

**3. The constraints the wave binds every lane to, checked and clean.**

- **filterBudget never grows.** The estate's own census, run against this dist: **12 passed**,
  chromium + webkit, including G3.1 exact-match, G3.3 coarse, G3.5 hover. My own live count:
  **9 light / 11 dark, identical to the control, both engines.**
- **AA / colour.** Motion is theme-blind here in fact, not only in prose: over 1,046 / 1,028 /
  1,022 / 1,004 shared structural keys, colour + background + border deltas after vs control are
  **0** in chromium light, chromium dark and webkit dark. webkit light shows 31 deltas that are
  **opacity only** (0.80, 0.97) — the cell-reveal stagger still running at the 1.8 s read — with
  every colour channel identical. No colour token moves, so no ratio moves.
- **M16.** `lint:copy` green, 0 unadmitted jargon, 0 dashes. `check-theme-tokens` 0 unreferenced.
  `check-lane-membership` 0.
- **W2's landed mechanics.** The sticky tag, the dock, the bottom tab and the tap-floor token are
  untouched; `DrawerTab.vue`, `scene.css` and `GameScene.vue` carry length and comment changes
  only. The tongue's deferred swap is **refuted with a number** (371.7 px jump at t=595 ms against
  a 163.6 px onset) and handed back to W2 as a mechanic, which is the correct disposal.
- **Goldens.** 4/4 green against this dist via `PLAYWRIGHT_BASE_URL`, no re-mint. This was one of
  the lane's own named gaps; it is closed.

**4. The rung half of the ratchet works.** B6 caught my exact sabotage (`throw` 520 → 500) in a
scratch copy — the pass-2 hole is genuinely shut, and it is shut by the right mechanism (keying on
the rung's own value, because `throw` has zero CSS consumers to give it away).

**5. The static gate reproduces.** 14/15 green, B8 red at 10, identical to the return.

---

## 2 · What is NOT converged — each one demonstrated, not argued

### 2.1 B6's SITE half is defeated by editing a comment — CONFIRMED by experiment

The bank is keyed `file :: selector :: term`. `selectorOf()` (line 369) reads the **original**
text, slices back to the nearest `}` / `{` / `;`, strips only complete `/* … */` pairs, and
truncates to 80 characters. When the nearest delimiter falls inside prose or template markup, the
"selector" **is** that prose. **17 of the 79 banked sites are keyed on comment text or Vue
template markup**, e.g.

```
"src/pencil/chrome/AttributionCard/AttributionCard.vue :: removed so the no-glass build ships zero blurred-backdrop surfaces). */ .hover-c :: opacity": 150
"src/games/shared/SolverErrorNote.vue :: </p> <button v-if=\"retryable\" type=\"button\" class=\"error-note-retry\" @click=\"emi :: note-in": 250
"src/assets/index.css :: opacity: 1`. But `scale(1)` does not COMPUTE to `none`, it computes to a matrix, :: cell-reveal": 300
```

The experiment, in a scratch copy of the tree (`ROOT=` override, product files untouched):

1. **Control** — shorten `DarkModeToggle.vue`'s `.toggle-icon .warp` from `340ms` to `200ms`
   alone → `✗ B6 RATCHET — 1` (and `✗ B1 NAMED — 2`). The ratchet works.
2. **The attack** — make the same 140 ms shortening, update the ADMITTED row's anchor and literal
   (a lawful ledger edit a retuner would make), and reword the comment sentence that forms the
   key (`Wring-down 0-340ms; …` → `Wring-down 0-200ms; … (retuned).`) →
   **`✓ B6 RATCHET`**. The only reds left are B8's inherited ten.

A shipped character length falls 140 ms and the ratchet says nothing. This is the second occurrence
of the class the pass-2 critique opened (pass 2: a site-keyed bank could not see a rung sabotage;
pass 3: a rung-keyed bank cannot see a site sabotage behind a prose edit) — which by the campaign's
own second-occurrence rule makes it an invariant to state, not a bug to patch. The cure is a key
that cannot be reworded: the selector taken from the **masked** text, or a structural key
(file + rule ordinal within the masked stylesheet + property), with the self-test carrying this
exact two-step attack as its control.

### 2.2 G-DOCK-BAND cannot fail on its own subject — CONFIRMED by experiment

The gate table says "`rungs.rise`'s docstring carries the band's ends … control: edit the declared
px → RED". The implementation (`gDockBand`, line 1064) is a **presence regex** for
`travel: <n>px @WxH … <n>px @WxH` plus a reference to the dock rung. In a scratch copy:

- falsified the ends, `293px @844x390` → `9999px`, `642px @768x1024` → `1px` → **`✓ G-DOCK-BAND`**
- additionally deleted the worst-frame and excess-area lines from the docstring → **`✓ G-DOCK-BAND`**

The declared control does not fire. The self-test's own case is "the rise rung declares no band" —
it deletes the prose, which is the only thing the gate reads. G-DOCK-BAND is a prose-presence
check wearing a measurement's name.

### 2.3 The two dock statistics are monotone in the clock, so they cannot pick 600

At **matched travel**, `worst frame (px per sample)` and `excess area Σmax(0, Δ−40)` both fall
mechanically as the duration rises — the same distance spread over more samples. 700 ms would
score better, 1000 ms better still. The statistics establish the direction (which is genuinely
worth having, and both do fall at every pose in both engines) but they cannot distinguish 600 from
800, so they cannot justify **600** in particular, which is the one thing the ballot asks the owner.
Compounding it: the declared band (−11…14 % / −20…26 %) did not reproduce, and the response was to
re-derive the ends **from the measurement** and write them into the rung's docstring — which
G-DOCK-BAND then "checks". That is the spec-cites-itself loop closed in one hop. The ballot needs
a criterion with an interior optimum (a settle-legibility read, an eye test at the re-look, or the
shortest clock whose worst frame clears a fixed px ceiling), not a monotone one.

### 2.4 The CI lane the diff adds is RED on the diff's own tree — CONFIRMED

```
node scripts/check-motion-bands.mjs        → exit 1
npm run lint:bands                         → exit 1
MOTION_LADDER_B8_OWNED=1 npm run lint:bands → exit 0
```

`.github/workflows/ci.yml` adds `- name: motion bands … run: npm run lint:bands` with **no**
`MOTION_LADDER_B8_OWNED`. As landed, the lane fails CI on the commit that introduces it. The
return's "check-lane-membership 0 (the gate was UNCLAIMED until the CI lane was wired)" is true and
beside the point: the lane is claimed and red. Either the escape variable is set in the lane with
its cite and its retirement condition, or B8's ten are cured before the lane lands, or the lane
lands with MOT-VERB.

### 2.5 Curves left the family in the spec and not in the diff

The spec is explicit: "CURVES: none of this family's … the pass-2 16-site curve row … LEAVES the
ladder; B8 keeps only its prohibition", and the return's delta 4 says the four pass-2 curve
conversions were reverted. The diff says otherwise. Across its own +/− lines, `var(--ease-standard)`
(Material's `cubic-bezier(0.4, 0, 0.2, 1)`) goes **5 → 10**, `--ease-drawOn` **2 → 5**,
`--ease-fadeOut` **5 → 6**; **13 removed declarations carried no house curve at all** — seven on
the UA default `ease`, three `ease-out`, two `ease`, one `linear`:

```
- transition: transform 150ms ease-out;        → transform var(--motion-whisper) var(--ease-drawOn)
- transition: opacity 150ms;                   → opacity var(--motion-whisper) var(--ease-standard)
- transition: stroke 500ms;                    → stroke var(--motion-throw) var(--ease-drawOn)
- transition: opacity 240ms ease;              → (note + a named curve)
```

`ease` is `(0.25, 0.1, 0.25, 1)`; `ease-out` is `(0, 0, 0.58, 1)`; `--ease-drawOn` is
`(0.33, 1, 0.68, 1)`; `--ease-standard` is `(0.4, 0, 0.2, 1)`. These are different shapes at every
t. So about ten sites change the curve the eye sees, in the family that declared the axis out of
scope, and **§7(i)'s fixed-t sampler was not run**, so not one of them is measured. Rest poses are
unaffected, which is exactly why the rect census reads clean and why this is the "pixel it moves
that it did not declare". It also explains B8 falling 16 → 10: six of those reds were cured by
assigning a curve. Either the assignments revert to HEAD's keyword and B8 reports the honest
larger count, or the curve row rejoins this family openly with MOT-VERB's law and a fixed-t
reading per site.

### 2.6 The lane wrote into another lane's file

The plan says "NOTHING in `gameCell.css` (§6's, chair §6.11)". The diff carries two rows in
`src/games/shared/gameCell.css` (`animation: marks-fade-in 250ms` → `var(--motion-note)`, twice).
Chair §6.6 gives every `gameCell.css` row to MRK-LIVE. Two rows is a small collision and a real
one; it belongs in MRK-LIVE's diff or in an agreed graft, named in both returns.

### 2.7 B5 passes while sixteen elements tween under reduce

The lane names this gap and under-prices it. §2.2 sizes PRM-FALLBACK at **exactly 2** (the
DarkModeToggle rest-stack crossfade, the laminate's 150 ms). My rendered-element roster finds
**16** live elements tweening under reduce after the ladder, in both engines — `0.8s` on the
toggle's warp group, `0.34s`, `0.3s`, `0.2s` ×2, and eleven `scale, opacity` pairs at
`0.15s, 0.12s` / `0.15s, 0.1s`, all inside `button > svg > g > g`. None reads a rung, so B5's
first clause is satisfied; its second clause — "every other nonzero live rule is a PRM-FALLBACK
row" — is **not executed at all**, and the unadmitted set is eight rules / sixteen elements, not
two. The residue is pre-existing at HEAD (all 16 are in the control's 62) and is not this family's
to cure, but the ledger says 2 and the surface says 16, and the gate lets the two disagree.

### 2.8 π is not proven, by either census

Neither census on the table is a clean π proof and the record should say so.

- The return's: `TAG.class#id` keys collide, so 102 / 91 **distinct** keys were compared out of
  774–880 rects. A real 0.000 px over a fifth of the page.
- Mine, with a structural key that does not collide: at the board scene the two builds deal
  **different puzzles and different glyph variants** (144 / 112 keys exist on one side only),
  giving maxDelta **17.22 px** / 44 moved at 1440×900 — noise, not regression, and therefore not
  evidence either way. The gallery is no better (maxDelta 6.07–8.18 px, 31–36 moved).

The only clean π evidence in this pass is **goldens 4/4**, which I ran and which covers four crops.
A real π census needs the scene pinned (`?board=`, the estate's own device) so both arms deal the
same board; until then the claim is four goldens wide.

### 2.9 The R6 MOVED diff cannot be applied and misquotes the row it moves

`instruments/R6-moved-rows.diff` names its target as `<the R6 law file>` — a placeholder. The rows
live at `evidence/w7/loop/r0/r6-idiom-history/R6-census.md:75` (ruling 1) and `:78` (law 4). Its
`−` line for law 4 reads `No duration outside pencilConfig.`; the record reads **"No timing
constant outside `pencilConfig` (`cardStepMs 440`, `boardFoldMs 520`, `chromeLeaveMs 200`, the
CELEBRATION budget). T4-W12's wave covenant."** A MOVED row whose diff quotes a sentence the
record does not contain is the record failing to verify the record — the lessons file's eighth
family. The substance of both re-cuts is right; the diff has to name its file and quote it.

### 2.10 The owned gaps, confirmed and still owed

- **The exit ballot is undecided.** `app-exit-last-rect.diff` is written, reasoned, and not built
  or measured; §7(h)'s three numbers are owed and the ballot cannot go to the owner without them.
  The lane's own words — "and then the hard part: those numbers need a fifth build and a fifth
  server" — are the elegant-reduction tell, stated honestly.
- **The exit's rest geometry was not re-read on this build**; 145.49 / 145.77 and 319.10 / 324.02
  remain pass-2 readings on a stale dist, which is the exact thing the brief asked to re-derive.
- **`rise: 600` ships as the dock's default with no flag.** `glideMsFor = (dock) => dock ?
  MOTION.rungs.rise : MOTION.rungs.throw`. Chair §6.7: ruling 1's 520 stands and rise 600 ships
  only on the owner's word. A prototype may propose it; the fold cannot inherit it silently, so
  the ballot needs its default stated and the diff needs to be foldable at 520 in one line (which
  the docstring promises and the code does not provide).
- **Not run, each a hole in the π claim the brief asked for**: the dusk fixed-t sampler (§7 i), the
  15-gesture frame trace (k), theme flips ×6 at 4× (l), r6's `hue-census.mjs` and `law-probe.mjs`
  copied with `OUT` re-pointed (29 rows), r1's `heading-voice.spec.ts`, r3's `wobble.probe.ts`.
  I closed goldens and the filter census; the rest stand open.
- **G-GUARD has no negative control.** 14 of the 15 gates carry a self-test case; G-GUARD carries
  none. The self-test's B11 negative-negative prints "RED (as it must)" while it is the held case.
- **The bundle ceiling is missed in both units**: +2,774 raw / **+808 gz** against +400 / +150.
  Honestly reported, not yet paid for. The 7 registrations are ~525 raw of it; the rest wants an
  account before the fold.
- **Three commits are one delta**: §4 asks ≤3 / ≤22 / ≤16 files; the worktree carries 44 modified
  + 2 untracked in one uncommitted diff.

---

## 3 · Failure-mode checklist

| item | verdict |
| --- | --- |
| vacuous convergence | **clear** — B12, B5's first clause and the ratchet's rung half all fire on real plants |
| spec-cites-itself circularity | **HIT** — the dock band was re-derived from the measurement and written into the docstring that G-DOCK-BAND then reads (§2.3) |
| gates that cannot fail | **HIT ×2** — B6's site half behind a prose edit (§2.1), G-DOCK-BAND on its own numbers (§2.2); B5's class-closure clause is unexecuted (§2.7) |
| the elegant-reduction trap | **HIT** — "and then the hard part: a fifth build and a fifth server" for the exit ballot (§2.10) |
| legacy aliases | **clear** — `cardStepMs` / `boardFoldMs` / `chromeLeaveMs` / `GLIDE_MS` / `REFUSE_MS` die rather than survive renamed |
| masked fallbacks | **clear, and cured** — 59 `var(--motion-x, Nms)` struck, 0 in the live CSSOM, and the registration that replaces them is measured |
| unverified gestalt | **partial** — the node, PRM, absence, dock band and settle are all measured in both engines; ~10 curve changes are asserted and unmeasured (§2.5) |
| consumer-less substrate | **clear** — every rung has consumers; the ADMITTED ledger is closed both ways and I saw it red when an anchor left the tree |
| the generic default | **clear** — the return reviewed itself against the tells and dropped the ordinal ramp, the `0.01ms !important` arm and the Material curve row; the last of those did not actually leave the diff (§2.5) |
| the pixel it moves that it did not declare | **HIT** — the curve changes (§2.5); and π rests on 4 goldens, not a census (§2.8) |
| the constraint it forgot | **partial HIT** — AA, filterBudget, M16 and W2 all hold, measured; `gameCell.css` is another lane's (§2.6); the bundle ceiling is missed; chair §6.7's owner-word fence on `rise` is unwired (§2.10) |

---

## 4 · Convergence, earned

**61 %.** Earned as: a running prototype proven in both engines on a real build (+25); the centre
measured rather than asserted, and measured better than claimed — 62 → 16 under reduce (+15); the
bound constraints checked and clean, AA, filterBudget, M16, W2, goldens, filter census (+12); the
gate reproducing 14/15 with real negative controls and a working rung ratchet (+9). Withheld: two
gates demonstrated unable to fail on their subject (−12); a red CI lane (−5); an out-of-scope axis
moved unmeasured at ~10 sites (−6); π unproven beyond four goldens (−5); the exit ballot, the exit
geometry, the six unrun instruments, the bundle ceiling and the commit shape (−10).

**ADVANCE.** No primitive is missing — every cure above is mechanical and named, and the family's
one hard idea (absence and reduce are the same value of the ladder) is settled on the surface in
both engines. It is not BLOCK, because nothing here is as hard as the problem. It is not RETIRE,
because nothing is a rewording and no bound constraint is broken in a way a revert does not fix.
It does not close: a ladder whose ratchet a comment can unlock, and whose band gate passes on
falsified numbers, is not yet a ladder that cannot lie — which is the family's own title.

**The next pass closes it by:** keying the bank on masked text or a structural ordinal and carrying
§2.1's two-step attack as the self-test's control; giving G-DOCK-BAND a value to check instead of a
sentence, and the dock a criterion with an interior optimum; setting or retiring
`MOTION_LADDER_B8_OWNED` in the lane; reverting the curve assignments or measuring them at fixed t;
returning `gameCell.css`'s two rows to MRK-LIVE; pinning `?board=` for a real π census; building
and measuring the exit diff; naming the file the R6 diff moves; and wiring the `rise` ballot's
default so 520 is one line away.

---

## 5 · Cross-pollination

1. **The boot-frame sampler (window = 0 frames, both engines)** prices the runtime-node-versus-
   build-time question for every lane that publishes a token, not just this one. Registry §2.1's
   node stands on a measurement now; the objection costs bytes and buys nothing at first paint.
2. **A registration emitted beside its values is not a registration.** Chair §6.5's real shape,
   learned here at a cost: the `@property` must live in the first static stylesheet or it dies with
   the publisher and the born-RED row reads `all` exactly as it does at HEAD. This binds every lane
   consuming `--masthead-foot`, `--pin-band`, `--card-pad-t`, `--washi-tag-rung`, and §10's leader
   who lands the registration once.
3. **Verify a served port by its own build's asset hash, never by a 200.** The lane's port trap
   (4243–4246 silently held, a whole probe batch void) is a wave law. I used it on both ports.
4. **Price PRM over rendered elements, not CSSOM rules.** A rule roster counts what is written; an
   element roster counts what tweens. Here that is 8 versus 16, and 62 versus 16 against the
   control. Any lane claiming a PRM number should use the element form.
5. **A bank keyed on a text window is a bank a comment can rewrite.** Likely a class, not an
   instance: any content-anchored ledger in the estate (`check-copy-register.mjs`'s admissions are
   the obvious neighbour) should be checked for the same defect.
6. **A statistic monotone in the parameter it is meant to choose cannot choose it.** Every lane
   pricing a clock, a distance or an opacity owes a criterion with an interior optimum, or an
   owner's eye — not a number that any larger value improves.
7. **`useFlipGlide`'s per-run duration + one `settleGuardMs`** is a clean primitive: one gesture,
   two distances, one guard. CTRL-* lanes with a desk/dock split can take it directly.
