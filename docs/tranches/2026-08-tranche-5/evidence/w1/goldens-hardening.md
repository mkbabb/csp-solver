# T5-W1.13 — GOLDENS-ESTATE HARDENING

**Charter** `evidence/audit/r3/goldens-estate.md`. **Scope** `web/frontend` at HEAD
`f38c5130` (T5-W0 seal), darwin, 2026-08-01. No commit, no push, no deploy, no re-baseline,
no `--update-snapshots` in any branch of this work. Ports `:3000/:3001/:4288` are the
owner's and were never touched; the one server this row started (a vite dev server on
`127.0.0.1:5199`) was killed at the end of its runs and `:4188` was never opened.

**What landed**

| # | thing | file |
|---|---|---|
| 1 | the byte guard becomes an ESTATE guard — six checks | `web/frontend/scripts/check-golden-bytes.mjs` |
| 2 | the magnitude report — the blind-band cure | `web/frontend/scripts/golden-magnitude.mjs` + `e2e/visual-golden.spec.ts` (a report-mode hook, floors untouched) |
| 3 | the four `-webkit-darwin` fossils | deleted; re-detection guarded |
| 3b | the engine pin's missing argument (r3 §4.3) | `web/frontend/playwright-golden.config.ts` — a note at the site, enforced by check 6 |
| 4 | CI fragments (the integrator lane owns `ci.yml`; nothing here edits it) | `fragments/golden-bytes.yml`, `fragments/golden-magnitude.yml`, `fragments/golden-selfdelta.yml` |

**Evidence of record** — `goldens-RED.txt` (born-RED at HEAD), `goldens-canary-RED.txt`
(eight canaries, one control), `goldens-GREEN.txt` (after the cure),
`goldens-magnitude-darwin.txt` (12 runs + synthesis), `goldens-selfdelta.txt` (both delta
arms + a control).

---

## 1 · The gate, born RED

The defect was **live**, so the gate ran first and its red is banked before any cure
(`goldens-RED.txt`). Two checks failed at HEAD:

```
[golden-bytes] FAIL — 2 defect(s):
  · estate total: 133557 B > 112640 B band (over by 20917 B)
  · fossils: 4 *.png outside e2e/goldens (31.5 KB) — auto-written baselines no config reads
EXIT=1
```

**The band is derived, not chosen to produce that red.** Re-derived at citation from
`git log` + `git cat-file -s` on all eight goldens (the full table is in `goldens-RED.txt`
§3):

| datum | value |
|---|---|
| estate total at birth `0ea30223` (2026-07-13) | 101,256 B |
| estate total at HEAD `f38c5130` | 101,341 B — **+85 B in 19 days across five reviewed re-mints** |
| worst per-file re-mint drift ever recorded | `toggle-crest-dark-linux` 6,403 → 6,983 B = **+9.06%** |
| all eight re-minted at once at that worst rate | 101,341 × 1.0906 = 110,522 B |
| **band** | **110 KB = 112,640 B** — clears that worst case by 2,118 B (11.15% headroom today) |

A ninth golden is not drift, it's a ruling — and the ruling lands with this band bumped in
the **same commit**. That is the intended bite (T2–T4 lesson: *the ruling lands with its
enforcing config, same commit*). The per-image ceiling stays 150 KB, untouched: nothing has
ever come within 6× of it (largest golden = 15.8% of the cap), which is precisely why B2's
*total* was the number worth gating.

**Six checks now, all evaluated before the verdict** (a run names every defect it finds,
not the first):

| # | check | closes | canary |
|---|---|---|---|
| 1 | per-image ≤ 150 KB | — (unchanged) | `c6-ceiling` — a valid 400×400 noise PNG, 625.6 KB |
| 2 | **estate total ≤ 110 KB** over *all* `*.png` under `e2e/` | **B2 / G-2** | born-RED at HEAD; also `c6` |
| 3 | **fossils** — zero PNGs outside `e2e/goldens/` | **B1 / G-1** | born-RED at HEAD; `c8-fossil` re-detects one reappearing |
| 4 | **decode + blank floor** — signature, every chunk CRC, IHDR, IDAT inflate, scanline arithmetic, IEND, ≥ 1 KB | **B3** | `c4-decode` (truncated 500 B), `c5-blank` (a valid, wholly transparent 220×220 capture, 268 B) |
| 5 | **pairing · orphans · missing baselines · tracked-ness** | **B4/B5/B6 / G-3** | `c1-pairing`, `c2-orphan`, `c3-missing` |
| 6 | **engine/template collision** | **G-7's pre-req** | `c7-engine` |

`c0-control` — the unperturbed copy — **passes** (exit 0), so each red above is the
perturbation and not the harness. `GOLDEN_CHECK_ROOT` reroots the scan for canaries only
and prints a `CANARY ROOT OVERRIDE — this run is NOT the gate` banner when set. The whole
battery was re-run against the **final** script, so `c6` and `c8` also re-prove the two
born-RED conditions after the fossils themselves were deleted and could no longer be run
against.

**The fossils.** `rm -rf web/frontend/e2e/visual-golden.spec.ts-snapshots` — four untracked
PNGs, 32,216 B, `.gitignore:41`, read by no config, minted inside `242fad7b`'s testIgnore
window. Their sha1s, bytes and `git check-ignore` provenance are banked in
`goldens-RED.txt` §1 **before** deletion; `git status --porcelain e2e/` after it is empty
(nothing tracked moved), and the eight goldens are byte-identical (`goldens-GREEN.txt`).
Check 3 is what stops the class from returning silently — and check 6 is what stops the
*mechanism* that produced it.

---

## 2 · The blind band — the team lead's decision, executed

```
darwin soul floor   0.017
observed drift      0.03      ← logo-light AND toggle-crest-dark
linux clause floor  0.05      ← the sun-crest clause, and CI's only platform
```

**The cure is a MAGNITUDE-REPORT STEP. Floors are unchanged.** The linux coarse floor 0.05
stands under the sun-crest clause's own authority: the clause exists because the linux logo
bake is **non-convergent run-to-run** — three consecutive runner renders sat pairwise
0.02–0.03 apart, each internally stable ×3 (`visual-golden.spec.ts:172-179`, runs
29238452743 → 29239186618 → 29239690082) — and gating a non-convergent surface at a floor it
cannot hold is the flaky-gate class T4-W2 pruned. Nothing measured this wave disturbs that
finding; W1.13 measured the *same non-convergence on darwin* (§2.2). So the floor keeps its
authority and the **blindness** — not the floor — is what gets cured.

### 2.1 What the step does

`node scripts/golden-magnitude.mjs` runs the two clause-relaxed goldens a second time with
`GOLDEN_MAGNITUDE=1`, which asserts them at `maxDiffPixelRatio: 0` — **strictly tighter**
than the shipped floors, so report mode cannot manufacture a green — and prints the ratio
Playwright then reports. Same spec, same `loadSettled()`, same `center()` clip, same
per-pixel `threshold: 0.3`, so the number is on the identical scale as the floors it is read
against. It enforces nothing: it exits non-zero for exactly one reason, that it produced
**no** measurement, because a silent instrument is the defect this row exists to kill.

One grep-able line per run — `[golden-magnitude] JSON {…}` — so magnitudes accumulate across
the campaign without re-reading prose.

**Why this and not n-run CI sampling.** r3 §3.4's ruling stands and is not re-litigated: on
the ubuntu lane the phenomenon (0.03) cannot cross the threshold (0.05), so sampling
measures the threshold, not the surface; 17/17 greens since 2026-07-15 bought nothing. A
*magnitude* under the same threshold buys everything the rate could not — it is the one
instrument that is informative precisely where sampling is null.

### 2.2 What it found on its first day

Twelve runs, one host, one tree, one session (`goldens-magnitude-darwin.txt`; three more in
`goldens-selfdelta.txt`):

- **The variate is discrete and bimodal, not drift.** `logo-light` took exactly two values
  across **thirteen** observations — **eight at 0 px, five at 3,945 px**, nothing between
  (twelve in the run table, plus the self-delta control; one run's attempt spread showed a
  third mode at 1,746). A drifting surface does not return to byte-identical; a
  missing settle condition does. That is r3 §3.5's middle row, whose disposition is *tighten
  the capture, no re-baseline*. The crest behaves identically over {0, 375, 643, 677, 1028,
  1194, 1214} px.
- **Cold/warm refuted.** A freshly restarted vite with an empty transform cache measured
  0 px; warm servers measured 3,945. Server warmth does not predict the mode. (Worker load —
  r3 §3.5's live hypothesis — is untested here by design: that is CH-42's arm, row 1.9's.)
- **The record's "0.03" is not 0.03.** Playwright **ceils** its printed ratio to two
  decimals. 1,028 px of a 220×220 crop is **0.0212** and prints "0.03"; 643 px is **0.0133**
  and prints "0.02" — *under* the 0.017 soul floor while printing above it. Every 0.03 in the
  banked corpus (`D-report:70`, `F3/final/goldens-head-1.log:18,35`) is really (0.02, 0.03].
  A decision read off the printed number is reading a **bin**, not a magnitude. The
  instrument therefore recomputes the exact ratio from the baseline's own IHDR geometry and
  prints both.
- **The darwin gate is intermittently red at HEAD** — 3 gate runs, 3 logo reds at exactly
  0.0227, one of them with the crest at 0.0212, on an otherwise green estate. **Not a W1.13
  disposition** (this row touches no floor and no baseline) and **not the linux CI state**
  (the clause floor 0.05 sits above the entire observed range). Handed up: to the team lead
  as a live darwin red, to row 1.9 as the phenomenon its {workers 1, 4} arms are chartered to
  separate.

### 2.3 What was refused, and why

**A webkit-golden baseline family — REFUSED**, on baseline-family cost and flake surface.

*Cost, measured not guessed.* The pre-req is hard: `snapshotPathTemplate` is
`'{testDir}/goldens/{arg}-{platform}{ext}'` with **no `{projectName}`**, so a second engine
collides both engines onto one file (that is exactly how the fossils were born). Adding it
renames all eight existing baselines — a **path re-baseline of the entire estate** — and
mints eight more (4 names × 2 platforms). The darwin-webkit half is the one number we can
state exactly, because the fossils *were* that half: **32,216 B** for four files
(`goldens-RED.txt` §1). The linux-webkit half is UNKNOWN (no runner has ever minted one) and
can only be minted by pushing. Estate 8 → 16 files, ~165 KB against a 110 KB band — so the
widening also forces a band election, on top of the template commit and the mint cycle.

*Flake surface.* The crest is non-convergent on chromium-darwin over a seven-value discrete
set (§2.2) and the logo is non-convergent on linux-chromium (the sun-crest clause's founding
evidence). A webkit arm doubles the non-convergent cells and adds a platform half
(linux-webkit) with **no local exerciser at all** — r3 §5.2 H2 already, symmetric and worse.

*Marginal information ≈ 0.* WebKit is not unguarded. `wordmark-integrity` asserts baked ink
inside its box and zero Georgia-fallback glyphs **in webkit** on the built dist
(`playwright-throttle.config.ts:103`); `filter-census-webkit` (`:73-77`) enforces the filter
allowlist against the deployed artifact; `theme-bake-webkit` (`:109-113`) polices bake
freshness; `playwright.config.ts:63` runs the default suite in both engines. Those are
*property* gates — they carry no baseline family and cannot go non-convergent the way a
bitmap compare does. A webkit bitmap golden would add a large flake surface for a small
increment over gates that already bite on the engine that matters.

**Also refused: a `macos-latest` golden lane** (r3 §3.4's alternative). It is the only CI
form that would sample at the 0.017 floor — and §2.2 is exactly why it must not land yet: at
HEAD that lane would be a **known-red, bimodal** job. Land the settle cure first (row 1.9's
decision), then elect the lane against a convergent surface. Recorded as a row, not taken.

---

## 3 · The chromium-only engine pin — ARGUED, and it stands

r3 §4.3 flags `visual-golden` as the one lane whose engine pin carries **no note at all**.
The pin is now argued at the site (`playwright-golden.config.ts` §engine, this record §2.3)
and **stands**, with the search for a cheap widening recorded:

| widening considered | verdict |
|---|---|
| second `projects` entry + `{projectName}` in the template + 8 new baselines | **refused** — §2.3: a full path re-baseline, an unknown linux half, a band election, doubled non-convergent cells |
| a coarse-floor "structural" webkit golden (0.10, catastrophe-only) | **refused** — still a baseline family with all the same costs, and the catastrophes it would catch (inversion, glyph loss, blank bake) are already caught by `wordmark-integrity` + `theme-bake-webkit` in webkit, without a bitmap |
| reuse the fossils as a webkit baseline | **refused** — they are the *output of a broken run*, minted by a config that no longer exists, provenance-less by construction |
| **the engine-collision guard** | **TAKEN** — 15 lines in the byte gate |

The guard is the part worth having now: `check-golden-bytes.mjs` check 6 fails if
`playwright-golden.config.ts` ever declares `projects:`/`browserName:` while
`snapshotPathTemplate` lacks `{projectName}`. It makes r3 §3.6's *"any webkit lane must land
the template change in the same commit"* an enforced condition rather than a note — the
ruling lands with its enforcing config. Canary `c7-engine` proves it bites.

Because the pin stands, **no born-RED for a widening is owed**; the born-RED that *is* owed
(check 6 can fail) is `c7-engine`.

---

## 4 · The self-delta, run at last (G-9)

`GOLDEN_DELTA=black|invert` is the compare machinery's own acceptance test
(`visual-golden.spec.ts:123-144`) and **no CI step has ever set it** — the gate that proves
the gate had never run on a runner (`gate-soundness.md:114`, confirmed at r3 §5.2 H6). Both
arms were executed here (`goldens-selfdelta.txt`):

| arm | result | wall |
|---|---|---|
| `GOLDEN_DELTA=black` | **4/4 red**, exit 1 | 3 s |
| `GOLDEN_DELTA=invert` | **4/4 red**, exit 1 | 8 s |
| control (no delta, same rig, same minutes) | 2 red / 2 green — the live darwin state of §2.2 | 4 s |

Eleven seconds of runner time buys the only proof the campaign has that its pixel compare
can bite at all. `fragments/golden-selfdelta.yml` carries the step; it asserts the run
**fails**, and reds if the delta ever passes.

---

## 5 · Disposition against r3/goldens-estate §6

| row | disposition |
|---|---|
| G-1 shadow estate | **EXECUTED** — deleted (32,216 B), and check 3 re-detects the class |
| G-2 `totalBytes` never gated | **EXECUTED** — 110 KB band, derived (§1), born-RED |
| G-3 orphan / pairing / tracked-ness | **EXECUTED** — check 5, plus B3's decode+floor, all canaried |
| G-4 CH-42 instrument | **row 1.9's.** W1.13 contributes the exact-ratio arithmetic, the ceil-print finding, and 12 banked observations; it decides nothing |
| G-5 n-run CI sampling is null | **AFFIRMED, not re-litigated** — §2.1; the cure is a magnitude, not a rate |
| G-6 `logo-light-linux` staleness unfalsifiable | **CURED as far as visibility goes** — the linux ratio now prints on every run, so "green" stops being the only observation. Whether to re-mint stays an election |
| G-7 no webkit golden | **REFUSED with cost** (§2.3), and its pre-req is now **enforced** (§3) |
| G-8 mobile chromium pin expired | **NOT THIS ROW** — CH-56 / row 1.10 |
| G-9 `GOLDEN_DELTA` never in CI | **EXECUTED** — §4, both arms + fragment |
| G-10 no CPU throttling anywhere | **NOT THIS ROW** — the perf rig, row 1.2 |

---

## 6 · Fragments (the integrator lane owns `ci.yml`)

Nothing in this row edits `.github/workflows/ci.yml`. Three standalone snippets, each valid
YAML under a `steps:` key at ci.yml's own 12-space step indent, each carrying its placement:

| fragment | placement in job `e2e` |
|---|---|
| `fragments/golden-bytes.yml` | **replaces** ci.yml:623-625 (`"Golden byte ceiling"`), renamed, `+ if: ${{ !cancelled() }}` |
| `fragments/golden-magnitude.yml` | **new**, immediately after `"Run the visual golden gate"` (ci.yml:620-622) |
| `fragments/golden-selfdelta.yml` | **new**, after the magnitude report |

The one behavioural addition in the first is `if: ${{ !cancelled() }}`: today the estate
check is skipped whenever the golden *compare* reds, which is exactly the run where an
orphan or an unpaired mint most wants to be seen. All three reuse the job's existing
checkout, `node_modules` and chromium bundle; none needs a `package.json` script (the byte
gate's `test:golden:bytes` already exists, and no lane contends for that file).

---

## 7 · Traps and handoffs

1. **The darwin gate is red at HEAD** for `logo-light` (0.0227 > 0.017), 3/3 gate runs,
   with the crest joining once (0.0212). Not this row's to fix; the lead should know before
   any darwin mint or seal.
2. **Row 1.9 inherits an instrument**, not just a probe: exact ratios, per-attempt spreads,
   and a refuted cold/warm hypothesis. Its decision rule (r3 §3.5) is unchanged and
   un-prejudged — but note that the "bimodal" branch already has evidence, and all three
   branches forbid re-minting.
3. **Numbers ceil.** Any future citation of a "ratio" from a Playwright log is a bin
   (x, x+0.01]. Cite the exact ratio the instrument prints, or say which one you mean.
4. `e2e/visual-golden.spec.ts` and `scripts/check-golden-bytes.mjs` were **prettier-dirty at
   HEAD** (`npm run lint` = `prettier --check src/` only — neither path is prettier-gated).
   Verified with `git show HEAD:… | prettier --check --stdin-filepath`; this row left the
   formatting alone rather than bury its diff in reflow. ESLint is clean on all three files.
5. **Row 1.9 / row 1.13 seam in one file.** Both touch `e2e/visual-golden.spec.ts` — this row
   only at the floor constants (a report-mode ternary, `REPORT_MAGNITUDE`), row 1.9's probe
   is expected at the file's end. Merge order does not matter; the hook and a probe are
   disjoint.
6. **Line numbers in `visual-golden.spec.ts` moved.** The report-mode block shifted the four
   assertions from `:182 · :206 · :212 · :223` (the numbers r3 and the chronic ledger cite) to
   `:195 · :221 · :228 · :236`. The estate gate prints the live `spec:line` for every golden
   on every run, so the mapping is re-derivable rather than remembered.
7. **A neighbouring config-lint exists.** Row 1.10 lands `scripts/check-pw-projects.mjs` over
   `playwright.config.ts`'s project list; check 6 here covers `playwright-golden.config.ts`'s
   engine/template pair. Complementary, not duplicative — but they should not grow into two
   half-overlapping config greps at W5.
