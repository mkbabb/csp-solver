# T5-W1.9 — CH-42: the MAGNITUDE instrument, and its decision rule fixed BEFORE the runs

**Status: PRE-REGISTERED. Written and banked before a single sample was taken.**
This file is the protocol. Everything downstream — `magnitude-runs-w1.txt`,
`magnitude-runs-w4.txt`, `magnitude-summary.md` — is data collected under it. If the data
contradicts a hope, the rule wins; if the rule is silent on an outcome, that outcome is
INCONCLUSIVE by construction, not by improvisation.

**This lane measures. It does not decide.** The disposition selected by §5's matrix is a
*candidate carried into W5*, where the decision executes. No cure lands here.

**NO RE-BASELINE. In any branch. Whatever the numbers say.** Every one of §5's five
outcomes forbids `--update-snapshots`, forbids minting, forbids touching a byte of
`e2e/goldens/`. Re-minting a flaky subject relocates the flake (`D-report.md:81-88`); the
baseline is not the thing under suspicion. The four goldens and their eight files are
read-only for the whole of this row.

---

## 1 · Why an n-run rate is a null instrument, and a magnitude is not

`r3/goldens-estate.md` §3.1–3.4, re-derived at citation:

- Pooled darwin corpus against the never-re-minted baseline `8ce98524`: **67 runs, 16 red
  = 23.9%**. Three lanes measured three different rates (0/8 · 5/11 · 5/14) and the row
  stayed open, because a rate over a censored variable cannot separate the live
  hypotheses.
- **51 of 67 observations carry no magnitude at all.** Playwright prints
  `N pixels (ratio R of all image pixels) are different` *only on failure*. A green run
  bans its own measurement.
- Every magnitude the campaign has ever recorded sits inside the blind band:

  | | ratio | source |
  |---|---|---|
  | darwin soul floor | **0.017** | `visual-golden.spec.ts` `SOUL_FLOOR` |
  | `toggle-crest-dark`, 1,028 px of 220×220 | 1028 / 48,400 = **0.021240** | `F3/final/goldens-head-1.log:18` |
  | `toggle-crest-dark`, 1,194 px of 220×220 | 1194 / 48,400 = **0.024669** | `…:35` |
  | `logo-light`, 3,948 px of 768×226 | 3948 / 173,568 = **0.022746** | `D-report.md:70` |
  | linux clause floor (the sun-crest clause) | **0.05** | `visual-golden.spec.ts` `LOGO_FLOOR`/`CREST_FLOOR` linux branch |

  Geometry re-derived from the committed baselines' own IHDR this session:
  `logo-light-darwin.png` 768×226 = 173,568 px · `toggle-crest-dark-darwin.png` 220×220 =
  48,400 px.

  Playwright ceils the printed ratio to two decimals, so every "0.03" in the record is
  really `(0.02, 0.03]` — a whole floor's width of ambiguity. The probe recomputes the
  exact ratio from the pixel count and the baseline geometry, so this sample is not bound
  by that quantization.

- CI runs **ubuntu only**. The linux floor is 0.05; the phenomenon is ~0.02–0.03. 17/17
  consecutive linux greens since 2026-07-15 sample a threshold the phenomenon cannot
  cross. **n-run CI sampling on the existing lane is a null instrument for CH-42 and is
  not proposed as one here** (estate §3.4 / ruling G-5).

The cure is to stop recording verdicts and start recording the continuous variable the
verdict was thresholding.

---

## 2 · The exact spec subset

Two tests, and only these two — the pair the sun-crest clause relaxed on linux, i.e. the
pair the blind band is *about*:

| golden key | test title (`e2e/visual-golden.spec.ts`) | floor at HEAD on darwin | baseline |
|---|---|---|---|
| `toggle-crest-dark` | `golden · toggle crest (dark, moon) — W13 soul: celestial rest pose` | `SOUL_FLOOR` 0.017 | `toggle-crest-dark-darwin.png`, 220×220 = 48,400 px |
| `logo-light` | `golden · logo wordmark (light) — W13 soul: baked logo pose stack` | `SOUL_FLOOR` 0.017 | `logo-light-darwin.png`, 768×226 = 173,568 px |

Selected by title grep: `-g "toggle crest|logo wordmark"`.

`cell-light` (0.02) and `grid-corner-light` (0.017, no platform branch) are **excluded**:
they carry no clause, no platform relaxation, and no blind band. Adding them would dilute
the sample with surfaces the hypothesis doesn't concern.

---

## 3 · The harness — fixed now, unalterable after the first sample

```
GOLDEN_MAGNITUDE=1 MAGNITUDE_OUT=<jsonl> \
npx playwright test --config playwright-golden.config.ts \
    -g "toggle crest|logo wordmark" \
    --repeat-each=25 --workers=<1|4> \
    --reporter=./e2e/magnitude-reporter.mjs,list
```

- **`--repeat-each=25`**, two arms, **`--workers=1`** and **`--workers=4`**. n = 25 per
  (golden × arm); 100 attempts total. `--workers` is the independent variable: the standing
  hypothesis is load/session sensitivity, and `fullyParallel: true` means every rate the
  campaign ever measured was taken under a concurrency it never recorded. Two arms at
  equal n turn that narration into a controlled experiment.
- **`retries: 0`** stands (config), so every attempt is an independent observation.
- **`GOLDEN_MAGNITUDE=1`** is W1.13's already-landed spec hook: it swaps both floors to
  `maxDiffPixelRatio: 0`. This is strictly **tighter** than the gate — report mode cannot
  manufacture a green — so every capture is forced to report its ratio. It changes no
  floor CI enforces and writes no baseline.
- **Against the built dist, never the dev server.** `PLAYWRIGHT_BASE_URL` points at a
  `vite preview` of `web/frontend/dist/` on **:4188**, started by this lane and killed by
  this lane. The owner's :3000/:3001/:4288 are untouched. Golden discipline: goldens run
  only against built dist.
- **One quiet darwin host, one session, one tree, one dist.** Arms run **sequentially,
  never concurrently** — a workers=1 arm sharing a host with a workers=4 arm would measure
  neither. Arm order: **w=1 first, then w=4** (fixed here so it cannot be chosen after
  seeing a result).
- Environment recorded into each runs file: HEAD sha, dist build time, `node -v`,
  Playwright version, `process.platform`, arm order, wall-clock start/end.

### 3.1 The probe

`web/frontend/e2e/magnitude-reporter.mjs` — a Playwright **reporter**, ~25 lines, added on
the command line. It is not a gate and must never become one. It touches no spec, no
config, no floor, no baseline; deleting it changes no CI outcome. Per finished test it
extracts every `N pixels (ratio …)` the comparison emitted, recomputes the exact ratio
against the baseline's own IHDR geometry, and appends one JSONL row:

```
{ts, arm, golden, repeat, retry, status, ms, geomPx, capturesPx[], verdictPx, verdictRatio, worstRatio}
```

**The statistic** is `verdictRatio` = (first reported pixel count) / (baseline pixel
count). Under `maxDiffPixelRatio: 0` the assertion never passes, so `toHaveScreenshot`
re-captures until the 15 s expect timeout; where the message carries several comparisons,
the first is the verdict analogue and the rest are banked as spread (`worstRatio`). Where
it carries one, that one is the attempt's ratio. Both shapes are handled and both are
banked; §5 reads `verdictRatio` only.

**PILOT AMENDMENT (recorded openly, made after the §3.2 pilot and before either sample arm
ran — no threshold and no §5 branch touched).** The pilot showed `logo-light` *passing*
under `GOLDEN_MAGNITUDE=1`. An assertion at `maxDiffPixelRatio: 0` passes only on zero
differing pixels, so a pass is a **measured 0.000000**, not a missing measurement. The rule
as first written left this implicit and §5.1 E-4 would have mis-read the quietest possible
surface as instrument silence. The probe now emits `verdictRatio: 0` for a passed attempt
with no reported pixel count, and **E-4 means a row that is neither passed nor
ratio-bearing**. Nothing else changed: the statistic, the estimator, the margins, the
matrix and the no-re-baseline law are as pre-registered.

**Caveat, stated before the runs:** report mode's capture path is byte-identical to the
gate's (same `loadSettled()`, same `center()`, same `threshold: 0.3`, same DPR2/PRM
contract), but its *timing envelope* is not — the gate stops at first pass, report mode
runs the stabilization loop out. The number measured is the surface's per-capture
divergence from its baseline; that is exactly the quantity all three hypotheses are
about, and it is on the same scale as the floors it will be read against.

### 3.2 Pilot, declared in advance

One `--repeat-each=1 --workers=1` pilot runs first, solely to prove the reporter emits
ratios at all. It is banked as an instrument check and is **excluded from the sample** —
declared here so its exclusion is a rule, not a post-hoc convenience. If the pilot yields
no ratio, the instrument is broken and the row returns INCONCLUSIVE-INSTRUMENT without
burning the arms.

---

## 4 · The statistics, and their estimator

Per (golden × arm), over the n = 25 `verdictRatio` values, sorted ascending, **nearest-rank**:

| statistic | rank at n=25 |
|---|---|
| p50 (median) | 13th |
| p90 | 23rd |
| p95 | 24th |
| max | 25th |

Also reported per cell: **count ≥ 0.017** and **count ≥ 0.05** (of 25).

**Modality test**, pre-registered so "bimodal" is not an eyeball verdict: sort the pooled
n=50 for a golden; the distribution is **BIMODAL** iff some adjacent pair in the sorted
sample is separated by a gap ≥ **0.010** (≈ 60% of the soul floor) with at least **5**
observations on each side of that gap. Otherwise **UNIMODAL**.

**Equivalence margin**: ±**0.002** absolute around 0.017 (≈ ⅛ of the floor; ~97 px on the
crest crop, ~347 px on the wordmark). A p95 landing in **[0.015, 0.019]** is a knife edge
and is not called.

The two goldens are classified **independently**. If they disagree, both classifications
are reported and neither is reconciled here — reconciliation is W5's.

---

## 5 · THE DECISION MATRIX — fixed before any sample

Let `P1` = p95 of `verdictRatio` at workers=1, `P4` = p95 at workers=4, for one golden.

| # | condition | classification | reading | candidate carried to W5 |
|---|---|---|---|---|
| **A** | `P1 < 0.015` and `P4 < 0.015` | **NOISE-REFUTED (no drift at HEAD)** | The surface holds the 0.017 soul floor with margin under both concurrencies. CH-42's 23.9% pooled rate does not reproduce on this tree/dist/harness | Close CH-42 as not-reproducible-at-HEAD with this sample as its evidence. Floors, clause and baselines all stand unchanged |
| **B** | `P1 < 0.015` and `P4 ≥ 0.019` | **NOISE-REFUTED (load artifact)** | Concurrency is the cause, not the surface. `fullyParallel: true` was the uncontrolled variable all along | Pin `workers: 1` in `playwright-golden.config.ts` — one line. CH-42 closes |
| **C** | `P1 ≥ 0.019` and `P4 ≥ 0.019`, **BIMODAL** | **REAL-DRIFT (settle)** | A settle condition is missing — a captured beat phase or twinkle raster lands in one of two states | Tighten the crop onto the disc core per the clause the spec already describes; re-run this same harness. **No re-baseline** |
| **D** | `P1 ≥ 0.019` and `P4 ≥ 0.019`, **UNIMODAL** | **REAL-DRIFT (floor mis-set for this surface)** | The surface's honest per-capture divergence simply exceeds 0.017; the floor, not the surface, is the wrong number | A **floor election** to the measured p99 of the pooled n=50 (nearest-rank at n=50 → the pooled maximum), ruled and landed with its histogram at the assertion site. **Still no re-baseline** |
| **E** | anything else | **INCONCLUSIVE** | see §5.1 | Re-run under a corrected harness in W5. No cure, no floor change, no mint |

### 5.1 INCONCLUSIVE is a real outcome, enumerated

- **E-1 borderline**: `P1` or `P4` lands in the equivalence margin **[0.015, 0.019]**.
- **E-2 inverted load**: `P1 ≥ 0.019` and `P4 < 0.015`. Quiescence noisier than
  concurrency is incoherent with every hypothesis on the table; it indicts the host, not
  the surface.
- **E-3 short sample**: fewer than 25 `verdictRatio` rows banked for any (golden × arm),
  for any reason — timeout, crash, settle failure, missing baseline.
- **E-4 instrument silent**: the probe emits rows with no ratio (the exact defect this row
  exists to kill).
- **E-5 gate-crossing**: any `verdictRatio ≥ 0.05`. That is past the *linux clause floor*
  and past anything the campaign has recorded; it is a live regression, not a measurement,
  and it is escalated rather than classified.

### 5.2 What no branch may do

No branch re-baselines. No branch widens a floor without a W5 ruling landing in the same
commit as the histogram. No branch touches `e2e/goldens/`. No branch proposes n-run CI
sampling on the ubuntu lane as a follow-up instrument (ruling G-5). No branch adds a
second engine to the golden config while `snapshotPathTemplate` lacks `{projectName}`
(estate §3.6 — that collision is how the four webkit-darwin fossils were written).

### 5.3 Who decides

This lane runs §3, computes §4, and applies §5 **mechanically** to produce a
classification and its candidate. **The candidate is not adopted here.** T5-W5 owns the
disposition; T5-W1 owns the number. Any cure landing in W1 would be a decision taken on
data this row was created to gather, which is the failure the row is a response to.
