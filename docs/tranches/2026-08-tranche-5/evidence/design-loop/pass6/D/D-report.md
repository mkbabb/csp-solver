# PASS 6 · LANE D — INK / RECORD TRUTH

Tree `abe533c4` (T5-W4 PASS 5 SEALED). Fence: `evidence/records` + the
`e2e/visual-regression.spec.ts:491` sentence + `scripts/check-evidence-policy.mjs` + this dir.
Every number below is re-derived at citation; where a re-derivation moved a pass-5 figure, the
pass-5 figure is left visible and the correction sits beside it.

Pass-5 orders: (1) bank the four "§static" gates · (2) bank the `lint:ink` runner verification
as a transcript · (3) land ship 1's margin sentence · (4) the pre-settle 21. Plus the lead's
adjudication §2 row: the evidence-policy gate grows the banked-dist rule.

**All five closed.** Two of them closed by contradicting the record they were sent to complete.

---

## 1 · THE FOUR "§static" GATES, NOW TRANSCRIPTS — order (1), D5-G4

D5-G4 was the adjudicator's own row: four gates cited "§static" with no banked transcript,
against MEASURE discipline item 3 — *an unbanked gate does not exist*. Each is now run and
banked with the AUDIT prepend.

| gate | banked | result |
|---|---|---|
| `vue-tsc -b` | `logs/gate-vue-tsc.log` | **0**, and **0** again under `--force` |
| `prettier --check src/` | `logs/gate-prettier.log` | **clean** |
| `prettier --check scripts/` | `logs/gate-prettier.log` | **RED — 7 files** |
| `test:e2e:projects` | `logs/gate-projects-supportfloor.log` | **PASS**, 7 known-bad inputs bitten |
| `test:support-floor` | `logs/gate-projects-supportfloor.log` | **PASS**, 7 known-bad inputs bitten |

Two of these deserve their own sentence.

**`vue-tsc -b` was banked in BOTH arms, because `-b` is incremental.** A cached `.tsbuildinfo`
greens a no-op, so a bare `-b` is not evidence the graph type-checks. The transcript carries
`-b` and `-b --force` — cache discarded, whole project graph — and both exit 0. CI's step 8 runs
a third spelling (`vue-tsc --noEmit`). The substance was always fine; the arm that proves it was
never written down.

**`prettier --check scripts/` IS RED, and the pass-5 row said "clean".** Seven files:
`check-coverage-floor`, `check-golden-bytes`, `check-prod-shake`, `check-pw-projects`,
`check-theme-tokens`, `golden-magnitude`, `tdz-probe`. Scope, before anyone reaches for a fix:
CI runs `prettier --check src/` only, so `scripts/` was never gated and nothing shipped broken;
all seven are pre-existing (T4-W4 2026-07-13 through T5-W2 2026-08-01) and none is Lane D's.
This lane reformatted nothing — the row is a **record** correction, and the choice between
"format the seven" and "say scripts/ is out of format scope" belongs to whoever owns the estate
lint policy. **D6-G1.**

That is D5-G4 vindicated on its own terms. The row said an unbanked gate does not exist; run the
four and one of them turns out not to have existed in the direction that matters.

---

## 2 · `lint:ink` ON A RUNNER, PULLED NOT QUOTED — order (2), D5-G5

`logs/lint-ink-runner-verification.log` carries the `gh api` pulls verbatim, both runs, plus the
local arm.

**The pass-5 citation re-derives exact.** Run `30734036107` · job `91460503817` "frontend" ·
success · `head_sha 9061b8c1826b0e65f094e85b1854ef82ad42d5a8` · step 13 *"ink pressure (graphite
ladder + ramp ownership, self-tested)"* · success · completed `05:24:34Z`. Every field the pass-5
report printed is what the API returns. Nothing was copied wrong — the defect was that the pull
was never banked, and D5-G5 was right to book it anyway.

**The silent self-test is by design, not by omission.** The step's own echo shows
`> node scripts/check-ink-pressure.mjs --self-test`, and `check-ink-pressure.mjs:644` runs it as
`const vacuous = argv.includes("--self-test") ? selfTest() : []` — it prints only when a gate is
vacuous or fails to bite. Step 15's support-floor prints a block; step 13 does not; both ran
their self-tests. Worth stating, because "no self-test output" reads like "no self-test".

**§6's forward claim is now settled, and it settles green.** Pass 5 wrote *"from the next push,
that same step also carries closure 4's three new modes and its coverage check."* The next push
was the pass-5 seal — run `30736604333`, `abe533c4`, job `91467698015`, step 13, success. Diff
the two step-13 bodies:

```
run 30734036107 (9061b8c1, W3)    ladder (4 rungs) ........................ ungoverned register
run 30736604333 (abe533c4, seal)  ladder (4 rungs) + SHIP-4 CENSUS (6) .... ungoverned register
```

The six-surface census — `.keyboard-legend`, `.legend-row kbd`, `.legend-sep`,
`.margin-note-meta`, `.icon-sublabel.is-armed`, `.vignette-meta` — is on the seal run and not on
the W3 run. Closure 4 is on a runner, not a promise. The local arm at HEAD reproduces the seal
run's body verbatim: same rungs (3.53/4.36/4.76 · 5.23/6.06/7.86 · 4.98/6.32 · 17.36/9.06), same
six census rows, same 4.65/7.69. Two hosts, one output.

**D5-G5 CLOSES.**

---

## 3 · SHIP 1'S MARGIN SENTENCE LANDS — AND TWO OF ITS NUMBERS DO NOT — order (3)

The fence has lapsed, so the sentence goes in. The standing law says every number is re-derived
at citation, so it was measured before it was written: `rig/ship1-margin.mjs` reads exactly the
geometry the row reads — same selectors, same `getComputedStyle` spellings — at the row's own
viewport, `playwright.config.ts:85` = **1280×800**. Transcript: `logs/ship1-margin-rederived.log`.

**A trap surfaced before the first reading.** `web/frontend/dist` was holding F3's pass-5
**ABLATE** build — `md5 index.html 8cfd2f49…`, identical to `pass5/f3/dist-p5ablate`, mtime
02:13Z. Any lane running e2e against `npm run preview` without rebuilding was measuring an
ablation and calling it HEAD. This lane built its own dist to a scratch path and never wrote to
`dist/`. **D6-G3.**

The measurement, n=3, both engines, stable to the hundredth:

```
die.w 28.00 + labelH 14.05 + padY 9.60 + gap 2.40 = demanded 54.05
btn.h 54.03  (computed height 54.0312px, `auto` — no author height)
HEADROOM  btn.h - demanded = -0.02      the row allows -0.50
```

**The substance holds and gets stronger.** `btn.h` is `auto`, so the box IS its content and the
bound is an identity. The row does not clear `demanded` with room; it clears `demanded - 0.5`.
The tolerance IS the margin. That was pass 5's point and it is correct.

**"0.00 px of headroom" is wrong.** Re-derived, the headroom is **−0.02px** — negative. `btn.h`
comes in two hundredths under its own content sum, so the assertion is carried *entirely* by the
tolerance. The pass-5 sentence understated its own case.

**"54.38" is a 1440-wide number in a 1280-wide row.** Width control, same rig at 1440:
`labelH` 14.39, `demanded` 54.39, `btn.h` 54.38 — and headroom still −0.02. `labelH` tracks the
viewport; the headroom does not. The suite runs at 1280, where the row reads 54.05. The 54.38
already sitting in the file's older comment (`:489`) inherits the same mismatch: it describes the
broken pose at a width the row never runs at. Left in place — no history rewrite — and the landed
paragraph names it. **D6-G2.**

**What landed** (`e2e/visual-regression.spec.ts:493-503`): the sentence with 54.05 / 54.03 /
−0.02 / n=3, citing this rig rather than the pass-5 paragraph. Comment-only — the file's
non-comment diff is **empty**, verified. `prettier --check` on the file: clean. The row re-runs
**2/2** green both engines after the edit; the whole spec **24/24** (`logs/w3-floors-after.log`).

---

## 4 · THE PRE-SETTLE 21 GETS ITS SECOND READING — order (4), D5-G3

The order allowed either a second cold-load reading or an explicit n=1. **Both are delivered**,
and neither is dressed as the other. Rig `rig/presettle-census.mjs`, transcript
`logs/presettle-21-second-reading.log`: 393×699 dpr3 coarse, **fresh context per run** (cold
cache, cold storage), rAF-sampled from before the first page script runs until the population
holds still for 900 ms, **peak** reported, both counting rules.

```
engine    runs   PEAK spec/device   at t(ms)     settled spec/device
chromium   3        21 / 21         291-472          9 / 13
webkit     3        20 / 20          96-101          9 / 13
```

**Chromium reproduces 21 element for element** — not just the total, the arithmetic
`filterBudget.ts` prints:

```
settled nine   g 2 · toggle-sun 1 · toggle-moon 1 · boil-pose 3 + is-active 1 · sparkle 1  =  9
rest poses     svg.rest-pose 6 + svg.rest-pose.is-pose-active 2                            = +8
wordmark       g.logo-pose 3 + g.logo-pose.is-active 1                                     = +4
                                                                                     total  21
```

**Both rules agree at the peak** — row 3's whole claim — in all six runs: before the bake lands
nothing is `display: none`, so consulting own-display changes nothing. **The settled floor
re-derives too**: 9 / 13 every run, both engines, rows 1 and 2 unchanged.

**WebKit's 20 has a name**: `svg.sparkle-icon`, and every other row matches in name and count.
It is a window artifact, not an absent surface — WebKit's peak lands at t≈96 ms against
Chromium's t≈291-472 ms, before the sparkle joins, and WebKit's own settled count is 9, which
includes it. The boot window is shorter on WebKit.

**The trigger does not fire.** It reads *"a second cold-load reading above 21."* Max across six
cold contexts, two engines: **21**. Nothing above. The 21 stays UNGATED with its trigger intact.

**And the n=1 is still printed, because it is still true.** The real-device arm remains **n = 1**:
one session, one phone, `pass4/logs/D/r3b.jsonl`, real MobileSafari iOS 19. This lane could not
add a device reading — the rig is the owner's — and an emulated arm is a second *instrument*, not
a second device.

```
real device, real MobileSafari .... n = 1   21   the source of the printed figure
playwright chromium @ descriptor .. n = 3   21   element-for-element match
playwright webkit @ descriptor .... n = 3   20   sparkle outside the window
```

**D5-G3 closes as CORROBORATED-NOT-GATED.**

---

## 5 · THE BANKED-DIST RULE — the lead's adjudication §2, and the pass's real deliverable

`scripts/check-evidence-policy.mjs` grows **rule 4**. The policy the adjudication wrote: *a
banked dist ships as a `.tar.gz` with an md5 manifest, or the record says "testimony, artifact
not banked" in place.* Under `docs/tranches/**`:

- **(a)** a directory whose basename is `dist` or starts `dist-` is a breach (`dist-loose`)
  unless it carries a `TESTIMONY.md`;
- **(b)** a `TESTIMONY.md` that does not contain the literal phrase *testimony, artifact not
  banked* is not a marker (`dist-marker-mute`) — a placeholder must not buy an exemption;
- **(c)** a `dist*.tar.gz` with no non-empty sibling md5 is a breach (`dist-no-manifest`) — an
  archive nobody can verify is the same hole in a smaller box;
- **grandfather** `GRANDFATHERED_DISTS`, pinned by **file count** so a pin is a **ceiling**:
  re-filling a hollow bank loosely reds (`grandfather-dist`). That is deliberate — re-filling is
  precisely the practice the rule retires; the cure for wanting a payload back is a `.tar.gz` +
  md5 under a new name, which the list does not cover and rule 4 therefore checks properly.

**The count in the ruling is off, and it is corrected rather than copied.** The adjudication says
"all 23 banked `dist-*` directories." Re-derived at HEAD: **29 banked dist directories — 25
hollow** (`_headers` + `_redirects`, nothing else) **and 4 full** (39 files each, real builds, in
`pass5/BC/rig/` and `pass5/f3/`). The ruling's substance is untouched; only its integer moves.
The four full banks are grandfathered too — they are real evidence predating the rule, not
evidence that loose is acceptable going forward — and the list labels the two blocks so nobody
mistakes one for the other. **D6-G4.**

**Born-RED, then green, then probed for exit honesty** (`logs/gate-rule4-BORN-RED.log`):

1. **RUN 1 — born-RED.** One real hollow bank's grandfather line commented out —
   `pass3/dist-head`, 2 files, the exact BC5-G2 shape — and the gate reds with one breach,
   naming rule, path and both ways out. **EXIT 1.**
2. **RUN 2 — restored** (verified by diff against the pre-probe copy: identical) **and green**
   across the estate: 29 directory banks, 0 archives, 29 pins, PASS. Self-test **22/22**, up
   from 9.
3. **RUN 3 — exit honesty, probed adversarially.** The trap named in the order has bitten this
   estate twice: a script that self-tests and then exits 0, greening CI while auditing nothing.
   So: self-test GREEN and estate RED in one invocation. `--self-test` printed 22/22 PASS and the
   process still **exited 1** on the audit's verdict. The fall-through is load-bearing and now
   says so in a comment at the main block. Source restored byte-identical afterwards.

The 13 new self-test cases cover every arm in both directions: a new hollow bank reds; a **full**
loose bank reds too (the rule is the FORM, not the payload); a marker saying the words exempts;
one that does not say them buys nothing; an archive without a manifest reds; with a non-empty
sibling md5 passes; an **empty** manifest is not a manifest; a pin exempts at its count and reds
above it; a stale pin is reported; `distillate/` is not a dist bank (the name is anchored, not a
prefix); build output nested inside a bank is not a second bank; and an estate with no bank reds
nowhere — the anti-vacuity control.

---

## 6 · WHAT I OPEN

- **D6-G1** — `prettier --check scripts/` is RED on 7 pre-existing files while the pass-5 record
  published it clean. Not gated by CI, nothing shipped broken, none of them Lane D's. The estate
  owes a decision: format the seven, or state that `scripts/` is out of format scope. Evidence
  `logs/gate-prettier.log`.
- **D6-G2** — ship 1's healthy-pose headroom is **−0.02px**, not 0.00, and `demanded` at the
  suite's own 1280 width is **54.05**, not 54.38. Corrected in the landed comment; the older
  `:489` comment keeps its 54.38 with the mismatch named beside it. No history rewrite.
- **D6-G3** — `web/frontend/dist` was left holding pass 5's **ablate** build. Any lane measuring
  against `npm run preview` without rebuilding measured an ablation. Class, not incident: the
  shared build directory has no owner and no stamp. Cheapest cure is a build-identity line in
  every rig's AUDIT prepend, which this lane's transcripts already carry.
- **D6-G4** — the pass-5 adjudication §2 says 23 hollow dist dirs; the filesystem says 29 banks,
  25 hollow. Corrected in `GRANDFATHERED_DISTS`; flagged so the ruling's own text can be restamped
  beside its number rather than silently.
- **Carried, not mine** — `web/frontend/dist` aside, three files in the working tree at fold time
  belong to another lane (`pass4/A-report.md`, `pass5/A/A-report.md`, `PRECEPTS.md`). Untouched.

---

## 7 · GATES RUN, ALL BANKED

| gate | result | log |
|---|---|---|
| `vue-tsc -b` and `-b --force` | **0 / 0** | `logs/gate-vue-tsc.log` |
| `prettier --check src/` | **clean** | `logs/gate-prettier.log` |
| `prettier --check scripts/` | **RED, 7 files** (D6-G1) | `logs/gate-prettier.log` |
| `test:e2e:projects` (self-tested) | **PASS**, 7 bites | `logs/gate-projects-supportfloor.log` |
| `test:support-floor` (self-tested) | **PASS**, 7 bites | `logs/gate-projects-supportfloor.log` |
| `lint:ink` local + 2 runner pulls | **green ×3, bodies diffed** | `logs/lint-ink-runner-verification.log` |
| evidence-policy rule 4 | **born-RED, then 22/22 + PASS, exit-honest** | `logs/gate-rule4-BORN-RED.log` |
| ship-1 geometry, n=3 ×2 engines ×2 widths | **−0.02px, stable** | `logs/ship1-margin-rederived.log` |
| pre-settle census, 6 cold contexts | **peak 21 / 20, none above 21** | `logs/presettle-21-second-reading.log` |
| **`e2e/a11y.spec.ts` (the W3 floor)** | **30/30, both engines** | `logs/w3-floors-after.log` |
| `e2e/visual-regression.spec.ts` whole | **24/24, both engines** | `logs/w3-floors-after.log` |

**W3 floors held** after the estate change: a11y 30 rows green, options 5/5, k-peek and
`guardTitle` among them.

**π identity** — no golden was minted, re-minted, re-baselined or touched by this lane. No
screenshot was banked at all; every figure here is a number, which is what EVIDENCE-POLICY asks
for first. Source diff: `e2e/visual-regression.spec.ts` (**comment lines only**, non-comment diff
empty, verified) and `scripts/check-evidence-policy.mjs` (rule 4, its grandfather list, its 13
self-tests, one printed line).

**U-10** — nothing in this lane closes a design mark. These are gate and record rows. The marks
that need the owner's eye stay conditional in the wave charter, unchanged by anything here.
