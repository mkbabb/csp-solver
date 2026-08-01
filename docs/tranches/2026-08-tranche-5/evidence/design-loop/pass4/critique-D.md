# CRITIQUE — pass 4, stage D (INK/CONTRAST ESTATE) · non-author · 2026-08-01

Bar: pass3-registry §2's seven numbered Lane-D work orders, plus the two cross-cutting rows D
elected to take. Verified against the six commits themselves (`469f248d beed5b5f 49341832
8fcafd7b 64fa37a4 daca28ee`), the banked logs under `pass4/logs/D/`, the twelve crops under
`pass4/shots-D/`, the golden evidence under `pass4/goldens-logo-light/`, and MEASURE's
`pass4/measure/RESULTS.md`. Read-only; nothing in the tree was touched.

**Verdict: ZERO BLOCKING GAPS — the first Lane-D pass with none.** Both pass-3 blockers (D1's
hold violation, D2's R3b) are discharged the way the order permitted, and the two that carried
the most rhetorical weight in pass 3 (§6 ladder derivation, §7 tape) are the strongest closes in
the stage. Three major gaps remain, and all three are of the same family: the lane counts its
own logs wrong, omits a reading its own log took, and takes a decision the registry reserved
for someone else.

**Convergence 83%** (7.5 of 9 deliverables clean). 0 blocking · 3 major · 6 minor.

---

## 1 · ROW BY ROW

### Row 1 — the `d4e8e41e` boot hazard on JavaScriptCore · **CLOSED**
`logs/D/r3b.jsonl` exists and reads what §1 quotes: real MobileSafari on `perf-rig-iphone16`,
iOS 19, `index-DTLxUr3ZTp-8.js`, `booted true · cells 81 · ctrlBtns 14 · headings
["Size","Difficulty"] · dealFound true · boardChanged true · errors [] · 2015 ms`. Three things
a critic has to check, and all three hold:
- the trap really is ahead of the module script — `rig/r3b-server.mjs` injects it on the
  `<head>` opener, before Vite's `<script type="module">`, so `errors: []` is a measurement;
- the fingerprint defect is disclosed and cured — `r3b-headless-webkit.jsonl` caught the
  textContent trap in the dry run and the shipped probe fingerprints readonly-input givens;
- the attribution landed in the source, not the dossier — `SudokuGame.vue:+44..51`, at the TDZ
  rule's own site, in the diff.

Independently re-taken by MEASURE (§6) on a build five commits newer: identical reading. The
order allowed attribution *or* revert; D attributed, disclosed the process question, routed it.

### Row 2 — goldens disposition corrected to the logs · **CLOSED IN SUBSTANCE, COUNT WRONG (major)**
The correction itself is right and it's against the lane's own pass-3 text: `toggle-crest-dark`
is green 6/6 in pass 3's banked runs (verified in `pass3/measure/gates-golden-{,BASE-}r1..r3`),
so "deterministic red, re-baseline candidate" was never true of it, and the pair the pass-3
report named is verbatim the sun-crest clause's own pair. `logo-light` reds 3948 px at ratio
0.03 in all six of those runs — I counted them.

But the rate D publishes does not survive its own logs. Post-remint runs on disk: `r1..r8`
(`gates-golden-AFTER-r1r2r3.log` + `-r4r8.log`) and three more in `gates-FINAL-e2e.log` —
**eleven runs, `toggle-crest-dark` red in r2, r3, r4, FINAL-1 and FINAL-3 = 5 red / 6 green.**
The dossier's §2 table and §10 sweep both say **✓ 7/11 · ✘ 4/11**, and §2 quotes "~36%" off it;
the true rate is 5/11, 45%. Commit `64fa37a4`'s body is wrong the same way and in the same
direction — "green 6/8 here, reding twice at 1028 px" against 5/8 with three reds, and both
those logs predate the commit by two minutes. In the one row whose whole assignment was *stop
reciting and count*, the count is off by one, twice, flattering both times.

### Row 3 — ship 1's durability bound rewritten so it can fail · **CLOSED**
`beed5b5f` writes the bound against `die.w` with `padY`/`gap` read off the box, and moves all
three geometry rows to `expect.soft` — the structural half, correctly diagnosed (a hard first
assertion means a negative control only ever proves the row it stops at).
`gate1-dealbox-control.log` is banked and shows the pass-3 defect restored reding **all three
rows by name**, the new one printing *"Deal's box is 44.00px for content demanding 54.05px (die
28.00 square + label 14.05 + padding 9.60 + gap 2.40)"*, green on the fix. Real range, real
control, real log.

*Minor:* at the healthy pose the bound is an identity, not a margin — `btn.h` is auto and equals
`die.h + labelH + padY + gap`, so 54.38 demanded against 54.38 delivered is 0.00 of headroom
inside a 0.5 tolerance. It has range in the direction the defect travels (height pinned, die
squashed, width intact) and the control proves it; the report should still say that the row's
slack is half a pixel by construction.

### Row 4 — census union-area + injected control + the 9-vs-17 budget · **CLOSED, with one omission (major)**
The spec half is genuine and it *survived the pass*: `git diff 469f248d..HEAD` on
`e2e/filter-census.spec.ts` shows Lane A only appended G3.5 — the union-area assertion, the
injected-node control and G3.3's coarse arm are all intact at HEAD. Both GATE-1 controls are
banked in `gate-filter-census-controls.log`: the injected node patched to `filter:none` reds
both regimes, the row budget moved 45,315 → 41,000 reds naming the delta. The cross-engine claim
is banked too — `census-3rule{,-dark}.json` reads spec 9 / device 13 / union 45,315 row and
6,488 coarse, **identical in chromium and webkit, light and dark**. The 9-vs-17 reconciliation
rides in `filterBudget.ts`, its members are named, and MEASURE re-took it on a fresh origin (9 /
13) and named the rig-state trap that inflates it to 11/15.

*Major:* the lane's own `r3b.jsonl` holds a fourth board reading the dossier never prints.
`censusBeforeDeal`, board arm, on the phone: **spec 21 · device 21** — eight `svg.rest-pose` and
four `g.logo-pose` live on top of the settled nine, none of them `display:none`. §4 states flatly
that *"the board budget was never breached, and the budget file's header claim was never false"*,
and `filterBudget.ts` now carries a four-row table that starts at 9. The gated census settles
past that window by construction (`settleBoard` waits on the bake and on zero running
animations), which is defensible — but this campaign is about cold-load paint on a phone, the
21 is the lane's own measurement of exactly that window, and it appears nowhere. Print it, or
qualify the sentence to the settled scene.

*Minor:* the coarse union-area budget has no negative control of its own. Control B moved the
row budget only, and in the coarse arm control A stops at the population assertion before it
reaches the area row.

### Row 5 — ship 4's six surfaces, one rendered witness each · **CLOSED**
Twelve crops on disk against the built dist, dpr 2, both themes. I opened three of them:
`3-legend-sep-light` shows the `⌘ / Ctrl Z undo` row with the separator's ink;
`5-armed-clear-light` shows the eraser with **sure?** in `--color-red-ink`; `6-vignette-light`
shows the star, "solved it!" and the `0 backtracks — 1ms` meta line the ship re-pitched. The two
facts the crops forced out are the best part of the row and both check against source:
`clearArmed` gates `isCoarse && isDirty` (so the armed sublabel doesn't exist on a desktop
pointer at all, which is how ship 4 described it), and `.vignette-meta` is docked-hidden below
1280, so a 1280 crop would have shown none of the ink the ship moved.

*Minors:* the witness rig is **chromium-only** on a WebKit campaign; there is no BEFORE arm, so
the crops witness a state rather than a movement; nothing entered the repo, so the next re-pitch
of these six surfaces ships unwitnessed again; and the rig's own run has no log banked (only its
twelve artifacts, all present — the rig swallows a failed crop into stderr).

### Row 6 — `gateFloors` derived from `index.css`, third scope covered · **CLOSED — the stage's strongest row**
`themesOf(css)` takes the stylesheet as a parameter and **throws** when the print scope stops
stating its ink or its paper — no silent fallback, which is the failure mode that made the
pass-3 version vacuous. `--self-test` grows to six cases and the new `theme-drift` case hands in
a stylesheet whose light card has moved, so the derivation itself is what's falsified. Two
probes banked (`lint-ink-drift-probe.log`): card 99% → 40% reds all three rungs plus red-ink;
print ink #000 → 78% grey reds all three. Digits unchanged to the hundredth, which is the only
way to learn the literal was right today.

The `prefers-contrast` strike is correct and I verified it independently: that block sets
`.sheet-laminate`'s background to `var(--color-card)` and its border-color, and touches no ramp
input — under `prefers-contrast: more` the laminate becomes *the paper the ladder already
evaluates against*. The citations check out too, which is worth saying in a loop that keeps
getting them wrong: at `49341832^` the `prefers-contrast` block is at :557 and `@media print`
opens at :794, exactly as §6 states — D cited the tree the audit was written against, not its
own post-commit numbering. `index.css`'s diff in that commit is **comment-only**; no rendered
byte moved.

### Row 7 — `--sheet-washi-neutral` dark · **PREMISE STRUCK IN THE OPEN, REAL CHARGE CLOSED**
The registry row's premise was stale and D says so with the commit beside it: the dark arm
landed at `e982a403` (verified in that commit's `index.css` diff), Lane C's, not D's. What was
still live — blast §2.7's "zero assertions and zero goldens read the token" — is closed by
`gateTape`, which composites the mix premultiplied over `--color-card` and asserts
`--color-foreground` on it at the AA floor: 17.36 light / 9.06 dark. `selfTest`'s sixth case
reverts the dark arm to the light arm's white base and the probe log reads **1.231:1** with the
consumers named. A ratio against the paper measured 8.96 and was wrong; the bound picks the
word on the tape instead. That's the right instrument, argued and gated.

### Cross-cutting — `lint:ink` into CI · **CLOSED**
`.github/workflows/ci.yml` +12 lines, inside the frontend job, `working-directory: web/frontend`,
after `npm ci`, beside `test:font-coverage`, running `npm run lint:ink` — which is
`check-ink-pressure.mjs --self-test`, so CI re-proves all six gates able to fail before trusting
the green. Standing since pass 2, closed here.
*Minor:* parse-verified only. Nothing was pushed, so the step has never executed on a runner and
there is no run id to bank.

### Cross-cutting — the `logo-light` darwin re-baseline · **DONE, BUT NOT THE LANE'S TO DO (major)**
The evidence is the strongest in the campaign for a re-mint: 6/6 isolated runs across two trees
at 3948 px / ratio 0.03 (I counted them in `pass3/measure/`), one more at the pass-4 open
(`gates-golden-BEFORE.log`), the diff reviewed rather than trusted (`goldens-logo-light/` holds
before, after, expected, actual and the diff), a scoped `-g "logo wordmark"` re-mint that left
the other three subjects untouched, 11/11 green after, `golden:bytes` PASS, and MEASURE reading
8/8 green on the final tree.

And the pass-3 registry put that election somewhere else, twice, in words: §2 —
*"a re-baseline decision row for the team lead, **not any lane**"*; §4 row 6 — *"Team-lead
election."* It is absent from Lane D's seven numbered work orders. The lane executed it anyway
and mutated a committed baseline (24,161 → 24,062 B) that the pass-4 cut now carries. Disclosed
in the open with the election cited in the commit body, so this is an authority finding, not a
concealment one — but a work order that says *not any lane* is not discharged by a lane doing it
well.

---

## 2 · THE NAMED PASS-3 OFFENSES, checked

| offense | Lane D, pass 4 |
|---|---|
| stale tables | **FOUND, once** — §2/§10's 7/11 · 4/11 against 6/11 · 5/11 on disk, and `64fa37a4`'s 6/8 against 5/8. Everything else re-derives: §10's `101/101`, `15/15`, `332/31`, the ladder digits and `golden:bytes` all match their logs line for line |
| gates that cannot fail | **NONE FOUND.** `themesOf` throws instead of defaulting; the drift case mutates the css handed in; the injected-node control runs every time; the ownership fixture is a real directory the real collector walks; the ship-1 bound reds by name. Residual vacuity risk is thin and named above (coarse area budget uncontrolled; CI step never executed) |
| undisclosed deletions | **NONE.** All six commits read end to end. The census spec's 23 deleted lines are the refactor into `assertCensus` with every assertion carried and strengthened; `index.css` in `49341832` is comment-only; the sole binary mutation is the scoped golden re-mint, banked with its diff |
| surface-name bookkeeping | **CLEAN.** The 9-vs-17 rows name their members and reproduce in two engines and two themes; §5's six surfaces match the crops I opened; §6's line cites are exact against the pre-commit tree |
| unbanked gates | **CLEAN** for gates; the ink-witness rig is the only unbanked *run*, and its twelve artifacts are all on disk |
| claims that don't reproduce | R3b re-taken by MEASURE five commits later — same reading. Census 9/13 re-taken by MEASURE on a fresh origin — same reading. Neither needed the lane's word |

---

## 3 · WHAT I'D PUT IN FRONT OF THE ADJUDICATOR

1. **Re-publish the toggle-crest rate from the logs** — 5 red / 11 here, and note it beside F3's
   5/14 and MEASURE's 0/8. The row is already correctly routed as a team-lead flake; only the
   arithmetic needs fixing, and it's the second document in two passes to get this subject's
   count wrong by recitation.
2. **Print the 21.** One line in `filterBudget.ts` and one row in §4's table: the cold-load board
   window carries 21 spec-rule filters before the bake, the gate measures the settled scene, and
   that is a deliberate choice rather than an unmeasured one.
3. **Who owns a re-baseline.** The re-mint should stand — the evidence is overwhelming and it's
   already in the tree — but the team lead should ratify it explicitly, because the registry
   reserved it and the next lane will read this as precedent.
4. Not gaps, worth an eye: the ink witnesses are chromium-only on a Safari patch, and `lint:ink`
   has never run on a runner.
