# GOLDENS-ESTATE — the audit of the estate itself

**Scope** `web/frontend` at HEAD `71456713` (2026-08-01 04:23 -0400). Read-only; nothing built,
committed, deployed. Ports 3001/4288/3000/4188 untouched. The one command run against the tree is
`node scripts/check-golden-bytes.mjs` (a `statSync` walk) plus `gh run view` reads.

**Headline.** The estate is small, correctly paired, and fully consumed — zero orphans among the
eight tracked goldens, zero specs pointing at a missing one. What's wrong isn't the inventory,
it's the *exercisers*. Three findings carry: (1) the sun-crest clause opens a **blind band
[0.017, 0.05]** on linux, and **every drift the campaign has ever measured — logo and crest
alike — sits at ratio 0.03, inside it**, on the only platform CI runs; (2) a fifth, sixth,
seventh and eighth golden exist on disk — `e2e/visual-golden.spec.ts-snapshots/*-webkit-darwin.png`,
31.5 KB — **untracked, unpoliced, and read by no config**; (3) the byte gate polices a failure mode
that has never occurred (largest golden = 15.8% of its cap) while policing none of the ones that
have. The `toggle-crest-dark` watch row is undecidable **not for want of runs — 67 are banked — but
for want of an instrument**: the estate records a verdict where it should record a magnitude, and
throws away 51 of 67 observations.

---

## 1 · Inventory

### 1.1 The tracked estate — `web/frontend/e2e/goldens/`

`git ls-files` → 8 files. Tracked despite the global `*.png` ignore, negated at `.gitignore:52-53`
(`!web/frontend/e2e/goldens/`, `!web/frontend/e2e/goldens/**/*.png`).

| golden | bytes | sha1 | minted at | date | age @ 2026-08-01 |
|---|---:|---|---|---|---:|
| `cell-light-darwin.png` | 3,915 | `81114414` | `0ea30223` | 2026-07-13 | 19 d |
| `cell-light-linux.png` | 3,898 | `6a0917d3` | `0ea30223` | 2026-07-13 | 19 d |
| `grid-corner-light-darwin.png` | 15,811 | `d3e38058` | `0ea30223` | 2026-07-13 | 19 d |
| `grid-corner-light-linux.png` | 15,691 | `0b0aca4c` | `0ea30223` | 2026-07-13 | 19 d |
| `logo-light-darwin.png` | 24,062 | `56e1fdcd` | **`64fa37a4`** | **2026-07-31** | **1 d** |
| `logo-light-linux.png` | 24,284 | `29503360` | `098de1c9` | 2026-07-13 | 19 d |
| `toggle-crest-dark-darwin.png` | 6,697 | `8ce98524` | `b8acf3f7` | 2026-07-13 | 19 d |
| `toggle-crest-dark-linux.png` | 6,983 | `b8f10649` | `8c6af343` | 2026-07-13 | 19 d |

Totals: **101,341 B = 99.0 KB**; darwin half 50,485 B, linux half 50,856 B. Every mint commit is a
*reviewed re-baseline* — `0ea30223` the T4-W2 birth, `098de1c9`/`8c6af343`/`b8acf3f7` the T4-WM/W5
runner re-mints, `64fa37a4` Lane D's darwin logo re-mint (ratified, CH-43).

### 1.2 Orphans — goldens with no consuming spec

**Among the tracked eight: zero.** All four names are asserted, each exactly once, in
`e2e/visual-golden.spec.ts`:

- `logo-light.png` → `:182` (`svg.handwritten-logo`, `LOGO_FLOOR`)
- `toggle-crest-dark.png` → `:206` (page + 110×110 centered clip, `CREST_FLOOR`)
- `cell-light.png` → `:212` (`.sudoku-cell` first, `FLOOR` 0.02)
- `grid-corner-light.png` → `:223` (page + 180×180 corner clip, `SOUL_FLOOR` 0.017)

`grep -rn toHaveScreenshot e2e/` returns assertions in **one file only**; `visual-regression.spec.ts`
mentions it in prose (`:9`) and asserts none. The write-only `page.screenshot()` half T4-W2 killed is
gone — `grep -rn "screenshot(" e2e/` finds no live call site.

### 1.3 Specs referencing a missing golden — **zero**, on both platforms

Darwin: all four `-darwin` files present at HEAD. Linux: the runner is green at HEAD — run
**30691714480**, job `e2e`, step *"Run the visual golden gate"* → `success`. A missing baseline
cannot pass silently: `playwright-golden.config.ts:60` sets `retries: 0`, which blocks the
write-then-pass-on-retry path.

### 1.4 The SHADOW ESTATE — four goldens no config reads

```
e2e/visual-golden.spec.ts-snapshots/
  cell-light-webkit-darwin.png          2,638 B  5ad6299f
  grid-corner-light-webkit-darwin.png  10,474 B  45b7851c
  logo-light-webkit-darwin.png         13,250 B  d9b1956977
  toggle-crest-dark-webkit-darwin.png   5,854 B  8f9502b0
```

**32,216 B = 31.5 KB.** All four **untracked** — `git check-ignore -v` →
`.gitignore:41:*.png`; the `:52-53` negation covers `e2e/goldens/` only. All four **unread**: the
golden config rewrites every capture path to `{testDir}/goldens/{arg}-{platform}{ext}`
(`playwright-golden.config.ts:56`), so nothing under `*-snapshots/` is ever resolved, and the
default config `testIgnore`s the spec in **both** projects (`playwright.config.ts:29` top-level,
`:57` inside `webkit`).

**Provenance, from the mtimes and the history.** The files are stamped `2026-08-01 01:40`; so is
`playwright.config.ts`. Commit **`242fad7b`** (2026-08-01 01:54, *"the suite gets its second engine,
and goes red the hour it does"*) is the sole commit matching `git log -S'OTHER_CONFIGS' --
playwright.config.ts`, and its own header records the mechanism: *"a PROJECT's `testIgnore`
REPLACES the top-level one rather than merging"* (`:16-18`). Between the webkit project appearing
and its `testIgnore` being written, `visual-golden.spec.ts` ran under project `webkit` with
Playwright's **default** path template — which is where `{arg}-{projectName}-{platform}{ext}` comes
from. These are the fossil of that window: four baselines auto-written by a failing first run.

They are harmless today and will stay harmless. They are also **31.5 KB of golden-shaped bytes the
bloat guard cannot see**, in a repo whose golden discipline exists because a PNG estate once hit
70 MB. Row: delete, or extend the guard (§2). Not a code change this audit makes.

---

## 2 · `check-golden-bytes.mjs` coverage vs the whole estate

Run at HEAD:

```
[golden-bytes] 8 golden(s), 99.0 KB total; per-image ceiling 150 KB
  ok   ... (8 rows, all ok) ...
[golden-bytes] PASS — every golden within the per-image ceiling.   EXIT=0
```

**What it covers.** One rule: per-image bytes ≤ 150 KB (`scripts/check-golden-bytes.mjs:22`),
applied to a recursive `*.png` walk of `e2e/goldens` (`:21`, `:25-40`). It correctly refuses to
celebrate an empty dir (`:44-52`).

**What it does not cover — six holes, in descending order of bite:**

| # | hole | evidence | why it matters |
|---|---|---|---|
| B1 | **Scans one directory.** `GOLDENS_DIR` is hard-pinned to `e2e/goldens` | `:21` | The 31.5 KB shadow estate (§1.4) is invisible. Any future snapshot dir is too |
| B2 | **No total ceiling.** `totalBytes` is summed at `:59`, printed at `:67`, and **never compared to anything** | `:72` gates on `breaches` only | 100 goldens at 149 KB each = 14.5 MB, PASS. The failure the gate was born for (EVIDENCE-POLICY B1, "70 MB of hoarded captures") is a *total*, and the total is the one number not gated |
| B3 | **No floor and no decode.** `statSync(p).size` only | `:58` | A 0-byte, truncated, or solid-transparent PNG passes. Compare `wordmark-integrity`, which polls for *ink* before believing a bake |
| B4 | **No orphan check** | — | A golden whose assertion is deleted lives forever and reports `ok`. Today's count is zero by luck, not by gate |
| B5 | **No platform-pairing check** | — | A darwin-only or linux-only mint passes locally; the miss surfaces as a CI red on the *other* platform, one push later |
| B6 | **No tracked-ness check** | — | A golden minted into `e2e/goldens` but never `git add`ed reports `ok` locally while CI has no baseline at all |

**Calibration.** The largest tracked golden is `logo-light-linux.png` at 24,284 B = **15.8% of the
150 KB cap**. Nothing has ever come within 6× of it. The gate is sound and cheap; it simply polices
the one dimension that has never moved. B2 and B4 are the two that would have caught something.

---

## 3 · `toggle-crest-dark` — what the estate needs to make the watch row decidable

**Formulation only.** The standing prohibition is unconditional and this section does not touch it:
*no re-baseline on any of these rates* (`design-loop-open-rows.md:242`, `:344`;
`pass4-registry.md:266-268`; `chronic-ledger.md:96` CH-42, WATCH-ONLY).

### 3.1 The three published rates, re-derived from the banked logs

Not taken on trust. Every log under `docs/.../design-loop/pass{3,4}` was re-read and the crest row
attributed per run (`✓/✘` on `visual-golden.spec.ts:203:1`):

| arm | log(s) | runs | crest red | rate |
|---|---|---:|---:|---:|
| MEASURE | `pass4/logs/measure/gates-golden-head-r1r2r3.log`, `-r4r8.log` | 8 | 0 | **0/8** |
| Lane D, post-remint | `D/gates-golden-AFTER-r1r2r3.log` (✓✘✘), `-r4r8.log` (✘✓✓✓✓), `D/gates-FINAL-e2e.log` (✘✓✘) | 11 | 5 | **5/11** |
| F3 head | `F3/final/goldens-head-{1..14}.log` (red at 1,2,6,7,8) | 14 | 5 | **5/14** |
| F3 no-op control | `F3/final/goldens-noop-{1..14}.log` (red at 3,8,9) | 14 | 3 | **3/14** |
| F3 base | `F3/final/goldens-base-{1..7}.log` | 7 | 0 | **0/7** |
| F3 pre-final | `goldens-base-run1/2`, `goldens-head-run1/2`, `goldens.log` | 5 | 3 | 3/5 |
| Lane A | `A/gates-goldens.log` | 1 | 0 | 0/1 |
| Lane D pre-remint | `D/gates-golden-BEFORE.log` | 1 | 0 | 0/1 |
| pass 3 MEASURE | `pass3/measure/gates-golden-{BASE-,}r{1,2,3}.log` | 6 | 0 | **0/6** |

The published `0/8 · 5/11 · 5/14` all reconcile to the logs. Pass 3's six reds were **`logo-light`,
not the crest** — `grep -oE "Snapshot: .*png"` returns `logo-light.png` in all six.

**Pooled darwin corpus, all against the same never-re-minted baseline `8ce98524`:
67 runs, 16 red = 23.9%.** (Conservative floor 15/66 = 22.7% if `goldens.log` duplicates
`goldens-head-run2.log`; the two files differ in sha1 but carry identical tallies.) Note
`chronic-ledger.md:96`'s *"12/25 vs 19/25"* reconciles to no pair of arms above and does not sum to
25 — **UNKNOWN provenance**; the three canonical rates are the ones re-derived here.

### 3.2 The measurement the estate is missing

The red logs record it and no one has read it as a number:

```
F3/final/goldens-head-1.log:18   1028 pixels (ratio 0.03 of all image pixels) are different.
F3/final/goldens-head-1.log:35   1194 pixels (ratio 0.03 ...)
D-report.md:70                   logo-light: 3948 px ratio 0.03 every run
```

**The crest is not binary. It's a continuous diff ratio that the gate thresholds at 0.017 and then
discards.** On a green run Playwright writes nothing — no `-actual.png`, no `-diff.png`, no ratio.
So of the 67 banked observations, **51 carry no magnitude at all**. A rate over a censored variable
cannot separate the three live hypotheses (settle race · load sensitivity · floor mis-set), which
is exactly why three lanes measured three rates and the row stayed open.

### 3.3 The instrument — parsimonious, no new script

Playwright already ships the repeat primitive. The harness is a flag, not a file:

```
npx playwright test --config playwright-golden.config.ts \
    -g "celestial rest pose" --repeat-each=25 --workers=1
```

`--workers=1` matters: the hypothesis on the table is *load/session sensitivity*
(`open-rows:242`), and parallel workers **are** the load — `fullyParallel: true`
(`playwright-golden.config.ts:57`) means every lane's rate was measured under a different
concurrency it never recorded. Two arms at the same n (`--workers=1` vs `--workers=4`) turn the
load hypothesis into a controlled experiment instead of narration.

**The magnitude probe** is the one piece that doesn't exist. It is not the gate and must never
become one: a sibling `test.describe('probe')` skipped by default (`GOLDEN_PROBE=1`), asserting at
`maxDiffPixelRatio: 0` so **every** capture reports its ratio, banked to JSONL. ~25 lines. It reuses
`loadSettled()` and `center()` verbatim, so it measures the gate's own capture, not a lookalike.

### 3.4 Why n-run CI sampling is the WRONG instrument here — and the estate proves it

Censused across all **42 CI runs since 2026-07-13** (`gh run view <id> --json jobs`, step *"Run the
visual golden gate"*): **success 28 · failure 7 · skipped 2 · absent 5**. All seven reds are the
mint window — six on 2026-07-13 (`7393e7df`, `c1dc6f20`, `c2dd6476`, `33066681`, `602c8de9`,
`098de1c9`) and one on 2026-07-15 (run **29445149519**, `3781ec14`, T4-W12). **Since 2026-07-15 the
gate has executed 17 times on linux and gone green 17/17.** (Step-level conclusions don't attribute
*which* golden failed; the seven aren't necessarily crest reds — two re-mint commits sit in that
window. Per-golden attribution needs the job logs: **UNKNOWN**, not fetched.)

Seventeen consecutive greens buy **nothing** for this row. The linux crest floor is
**0.05** (`visual-golden.spec.ts:201-202`); every drift the campaign has ever measured is
**0.03**. Sampling under a threshold the phenomenon cannot cross measures the threshold, not the
surface. And an informative CI sample would have to run at the **darwin** floor — which CI has no
runner for (§5). So: either a `macos-latest` golden lane (cost: one job, four tests, ~2 s of
compare) or the harness stays a banked local darwin instrument. **n-run CI sampling on the existing
ubuntu lane is a null instrument for CH-42 and should not be proposed as one.**

### 3.5 The decision rule — written before the runs, or a fourth rate accrues

Bank per-capture ratios (not verdicts) for `--repeat-each=25` × {workers 1, workers 4}, one quiet
darwin host, one session, one tree, HEAD. Then:

| observation | reading | disposition |
|---|---|---|
| p95 < 0.017 at workers=1, ≥ 0.017 only at workers=4 | harness load, not the surface | pin `workers: 1` in the golden config — one line. **CH-42 closes.** No re-baseline |
| p95 ≥ 0.017 in both arms, distribution **bimodal** | a settle condition is missing (a captured beat phase / twinkle raster) | tighten the crop onto the disc core as the clause already describes (`:187-195`), re-run the same harness. **No re-baseline** |
| unimodal with a tail crossing 0.017 | the 0.017 darwin floor is wrong **for this surface** | a **floor election** to the measured p99, ruled and landed with its histogram at the site (`:201-202`). **Still no re-baseline** — the baseline is not the thing that's wrong |

Three of three branches forbid re-minting, which is the right shape: re-minting a flaky subject
relocates the flake (D-report `:81-88`).

### 3.6 The blind spot nobody has named

**The goldens have never run in WebKit.** `playwright-golden.config.ts` declares no `projects` and
no `browserName` → one implicit **chromium** project. The crest is a WebKit-baked pose surface at
the centre of a WebKit performance patch, and its entire 67-run corpus is chromium-on-darwin. A
webkit golden arm has a hard pre-req: `snapshotPathTemplate` is
`'{testDir}/goldens/{arg}-{platform}{ext}'` (`:56`) with **no `{projectName}`** — add a second
engine today and both collide onto one file, silently. Any webkit lane must land the template
change in the same commit.

---

## 4 · Throttle config projects vs the main config's two engines

### 4.1 The four configs, side by side

| config | projects | spec files | engines |
|---|---|---|---|
| `playwright.config.ts` (dev server :3000) | `chromium`, `webkit` (`:52-59`) | 15 of 20 (5 held out, `:19-25`) | chromium 15 · webkit **12** (`:57` also drops `mobile-*`, `share-truth`) |
| `playwright-throttle.config.ts` (built dist :4188) | **6**: `throttled-void`, `filter-census-{chromium,webkit}`, `wordmark-webkit`, `theme-bake-{chromium,webkit}` (`:60-114`) | 4 | see 4.2 |
| `playwright-golden.config.ts` (dev server :3000) | **none** → 1 implicit | 1 | **chromium only** |
| `vitest.config.ts` | — | jsdom units | n/a |

20 spec files; every one is claimed by exactly one config. No spec is dark.

### 4.2 What actually runs *throttled* — one spec, one engine

The filename is a fossil; its own header says so (`:4`, *"historically, and still by filename"*).
**Throttling lives in the spec, not the config**: `throttled-void.spec.ts:50-58` opens a CDP session
and sends `Network.emulateNetworkConditions` at **30 KB/s down/up + 500 ms latency**, applied
*after* first paint. The spec's own comment (`:48-49`): *"Chromium-only (the default project); CDP
is unavailable on other engines."*

- **Throttled surfaces:** `throttled-void.spec.ts`, chromium, network only.
- **Never throttled:** the other 19 spec files — all four goldens, the filter census, the wordmark
  bake, the theme bake, every mobile spec, the whole default suite.
- **CPU throttling: nowhere.** `grep -rn "setCPUThrottlingRate\|cpuThrottling" e2e/` → 0 hits. On a
  campaign whose root cause was per-beat filter re-execution burning a third of a core, no gate ever
  runs the app on a slow processor.

### 4.3 Per-engine holes, argued vs unargued

| lane | chromium | webkit | argued? |
|---|---|---|---|
| `filter-census` | ✅ | ✅ | yes, and measured (`throttle:68-72`) |
| `theme-bake-freshness` | ✅ | ✅ | yes (`:105-108`) |
| `wordmark-integrity` | ✗ | ✅ | **yes** — the defects are WebKit's (`:80-83`) |
| `throttled-void` | ✅ | ✗ | **yes** — CDP is chromium-only (spec `:48-49`) |
| **`visual-golden`** | ✅ | ✗ | **NO — the config carries no engine note at all** |
| **`mobile-affordances` / `mobile-platform`** | ✅ | ✗ | **argued on a premise that has expired** |

**The mobile pin's premise is stale.** `mobile-platform.spec.ts:21` and
`mobile-affordances.spec.ts:20` pin `browserName: "chromium"` at file scope; `playwright.config.ts:45-47`
justifies it as *"the iPhone/iPad descriptors default to webkit, **which the historical chromium-only
lane did not install**"*. That lane now installs it — `ci.yml`, step *"Install Playwright chromium +
webkit (+ deps)"*, `npx playwright install --with-deps chromium webkit`, `success` on run
30691714480. So on a Safari/iOS campaign the two specs named *mobile* run `devices["iPhone 13"]`
traits over the engine iOS does not use, and the reason on record no longer holds. The
`webkit`-project exclusion at `:57` remains correct (it would duplicate); what's now unearned is the
**file-scope** pin. Formulation-grade note, not a change made here.

---

## 5 · Per-platform coverage holes

### 5.1 Pairing — clean

Four names × {darwin, linux} = 8 files, **zero unpaired**. No darwin-only golden, no linux-only
golden. The `-webkit-darwin` quartet (§1.4) has no twin, but it has no reader either.

### 5.2 The real holes are on the exerciser side

**H1 — the darwin half has no automated exerciser.** Every CI lane is `ubuntu-latest`
(`ci.yml:82, 108, 182, 224, 299, 340, 378, 479, 565, 701, 768`). The four `-darwin` goldens — 50,485 B,
half the estate — are touched only by a developer running `npm run test:golden` on a mac. The
0.017 soul floor, the campaign's tightest visual gate, **never runs on a machine anyone owns
collectively.**

**H2 — the linux half has no local exerciser.** Symmetric and worse: on a darwin host
`process.platform === 'linux'` is false, so `LOGO_FLOOR`/`CREST_FLOOR` take the soul branch and the
`-linux` baselines are never even opened. They can only be validated by pushing.

**H3 — the blind band, and it is not hypothetical.** For the two clause-relaxed goldens:

```
darwin soul floor   0.017
observed drift      0.03      ← logo-light (3948 px) AND toggle-crest-dark (1028/1194 px)
linux clause floor  0.05
```

Every magnitude the campaign has recorded lands **between the two floors**. Concretely:
`logo-light-darwin` went **6/6 deterministic red at ratio 0.03** across two trees and was re-minted
(`64fa37a4`); `logo-light-linux` has **not been re-minted since `098de1c9`, 2026-07-13** — before
`387cceea` (P1-W3: the opsz pin and the re-derived Fraunces subset) and before all of P1-W4 — and
the linux gate is **green at HEAD** (run 30691714480). Two readings survive: the wordmark work
didn't move the linux raster, or it moved it by less than 0.05. **The gate cannot tell them apart.**
On linux, `logo-light` and `toggle-crest-dark` are tripwires for catastrophe (inversion, glyph loss,
pose-set drift) and blind to everything the campaign has actually done. `cell-light` (0.02) and
`grid-corner-light` (0.017, no platform branch, `visual-golden.spec.ts:223`) keep their bite on both.

**H4 — age skew inside a pair.** `logo-light` is now darwin 2026-07-31 / linux 2026-07-13 — **18
days and two waves apart**, straddling `387cceea`. The pair no longer describes the same surface at
the same tree, and per H3 the linux side cannot report that it's stale.

**H5 — no third platform, and no WebKit anywhere (§3.6).** Production is Cloudflare Pages served to
Safari; the goldens are chromium on two Linux/macOS rasters.

**H6 — the machinery's own acceptance test is manual.** `GOLDEN_DELTA=black|invert`
(`visual-golden.spec.ts:123-144`) is the π/DELTA self-delta that proves the compare bites.
`grep -rn GOLDEN_DELTA` finds it in the spec and in prose; **no CI step sets it** — confirming
`gate-soundness.md:114` at r3. The gate that proves the gate has never run on a runner.

---

## 6 · Rows out of this audit

*Formulation only. Nothing here was executed; every one is a team-lead or owner election.*

| # | row | class | evidence |
|---|---|---|---|
| G-1 | **Shadow estate** — 4 untracked `-webkit-darwin` PNGs, 31.5 KB, read by no config. Delete, or widen `GOLDENS_DIR` to catch the next one | hygiene / gate | §1.4, `.gitignore:41` vs `:52-53`, `242fad7b` |
| G-2 | **Byte gate B2** — `totalBytes` is computed and never gated. The estate ceiling is the one EVIDENCE-POLICY number with no enforcement | gate | `check-golden-bytes.mjs:59, 67, 72` |
| G-3 | **Byte gate B4/B5/B6** — no orphan, pairing, or tracked-ness check. All three are one `git ls-files` + one spec grep | gate | §2 |
| G-4 | **CH-42 instrument** — `--repeat-each` × 2 worker arms + a ~25-line magnitude probe; decision rule §3.5 fixed **before** the runs. No re-baseline in any branch | formulation | §3.2-3.5 |
| G-5 | **n-run CI sampling is a null instrument for CH-42** on the ubuntu lane (floor 0.05 vs drift 0.03; 17/17 green since 2026-07-15 proves nothing). A `macos-latest` golden lane is the only CI form that would inform it | ruling | §3.4, §5.2 H1/H3 |
| G-6 | **`logo-light-linux` staleness is unfalsifiable** at the 0.05 floor across `387cceea`+P1-W4. Either accept the band explicitly at the site, or the runner re-mints deliberately | ruling | §5.2 H3/H4 |
| G-7 | **No WebKit golden.** Pre-req: `snapshotPathTemplate` must gain `{projectName}` in the same commit or two engines collide on one file | design | §3.6, `playwright-golden.config.ts:56` |
| G-8 | **Mobile chromium pin's premise expired** — CI now installs webkit; the file-scope pin costs the campaign its only mobile-WebKit cell | design | §4.3, `ci.yml` install step, `playwright.config.ts:45-47` |
| G-9 | **`GOLDEN_DELTA` never set in CI** — the compare's own acceptance test is manual-only. Confirms `gate-soundness.md:114` | gate | §5.2 H6 |
| G-10 | **No CPU throttling anywhere** in an estate whose root cause was CPU-bound filter re-execution | coverage | §4.2 |

---

## 7 · Commands of record

```
node scripts/check-golden-bytes.mjs                 # 8 goldens, 99.0 KB, PASS, exit 0
git ls-files web/frontend/e2e/goldens               # 8 tracked
git check-ignore -v .../visual-golden.spec.ts-snapshots/logo-light-webkit-darwin.png
                                                    # .gitignore:41  *.png
git log --format='%h %ad %s' --date=short -- <each golden>
grep -rn toHaveScreenshot e2e/                      # 4 assertions, 1 file
grep -rn "setCPUThrottlingRate|cpuThrottling" e2e/  # 0
gh run view <id> --json jobs --jq '.jobs[]|select(.name=="e2e")|.steps[]
    |select(.name=="Run the visual golden gate")|.conclusion'   # ×42 runs since 2026-07-13
```

Per-run crest verdicts were re-derived by grepping
`✓|✘ .* visual-golden.spec.ts:203:1` across every `*golden*.log` under
`docs/tranches/2026-08-tranche-5/evidence/design-loop/pass{3,4}/`. All three published rates
reconcile; `chronic-ledger.md:96`'s `12/25 vs 19/25` does not, and is marked UNKNOWN.

ROW-COMPLETE
