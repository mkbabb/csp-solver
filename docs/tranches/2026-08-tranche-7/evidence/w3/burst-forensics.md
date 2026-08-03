# CH-64 burst forensics — the runner-rig read (2026-08-03)

The fired trigger's answer. Seven CI runs read from the field with `gh run view --log` and
`gh api`: the four W0 named (`30780222492`, `30780989714`, `30781866393`, `30786643192`), the
two T6-era bursts CH-64 banked (`30765365438`, `30770223565` — LEDGER.md:46), and one the
preflight predates (`30791082765`, W0's own head `cbf2ab49`, which lands the trigger's missing
next-pass evidence). Method: per-run job/step timings from the API, per-test position and block
wall clock parsed out of the dot reporter, failure rows and error shapes from the raw log.
Every number below is derived from those logs, not from any prior record.

---

## 1. The trigger's arithmetic is wrong — the correction that has to come first

**Run `30781866393` (`afc72ba1`) carried exactly ONE test red, not four or five.** Step 12
reports `1 failed · 2 skipped · 322 passed (13.3m)`. The "golden job 3→4 `toHaveScreenshot`
reds" the W0 preflight counted are the **self-delta canary arms** — ci.yml:1076's
`for arm in black invert` loop, which injects a regression and **fails by design**:

| run | black arm | invert arm | main suite |
|---|---|---|---|
| 30780222492 | 3 failed / 1 passed | 4 failed | **green (323 passed)** |
| 30780989714 | 3 failed / 1 passed | 4 failed | **green (323 passed)** |
| 30781866393 | 3 failed / 1 passed | 4 failed | 1 failed |
| 30786643192 | 3 failed / 1 passed | 4 failed | 2 failed |
| 30765365438 | 2 failed / 2 passed | 4 failed | 3 failed |
| 30770223565 | 2 failed / 2 passed | 4 failed | 1 failed |

The 3-then-4 pattern appears in the **fully green run** too. It's the gate proving it still
bites, and the log even says so: `ok — the black arm red the compare, as it must`. It's never
evidence of a burst.

Why the preflight saw only that: on a default-suite red the runner **skips** step 13 (visual
golden gate), step 17 (built-dist gates) and step 18 (prod-shake) — verified `skipped` in the
step API for all four red jobs. The canary at step 16 runs `if: always()`, so on a red run its
arms are the *only* golden output in the log. Reading the log top-down, they're the first
`toHaveScreenshot` failures you meet.

Second correction: **`30780222492`'s red isn't a flake at all.** Step 12 (the suite) *passed*;
the job died at step 15, the golden estate gate, on a deterministic source defect —
`orphan: cell-light is asserted by no spec` / `orphan: logo-light is asserted by no spec`. It
was cured by a source commit (`1cc8f4e4` — "Estate gate: consumer scan goes whole-file"). The
preflight's row for that run ("golden reds + a11y-webkit") is wrong twice over: no golden pixel
red, and no a11y red.

**Consequence for the bank.** Against CH-64's own definition — ≥2 reds in one settled-head run,
each green on the next runner pass with no surface change — the ledger's three bursts count:

| banked burst | run | genuine test reds | meets "≥2"? |
|---|---|---|---|
| burst 1 | 30765365438 | 3 | yes |
| burst 2 | 30770223565 | **1** | **no** |
| burst 3 | 30781866393 | **1** | **no** |

The third burst is real, but it isn't the run the preflight named: it's **`30786643192`
(`6a180b35`, 2 reds)**, and its next-pass clause resolves half-and-half at `cbf2ab49`
(`multiplayer:498` greened, `futoshiki:131` red again). The trigger deserved to fire — the
class is live, the rate is climbing, and §2 shows why — but it fired on miscounted evidence,
and the record should say so. This is the "record can't verify the record" family from
`lessons-from-t2-t4`, one surface over.

---

## 2. The evidence table — all ten reds, seven runs

Suite ordering is deterministic and validated: at N=325 the projects split chromium 165 /
webkit 160 (webkit drops `share-truth`, 5 tests), so declared indices are chromium 1–165,
webkit 166–325. `a11y:490` is webkit's 15th row and landed at dot-index 180 = 165+15 in
`afc72ba1`, and at 172 = 157+15 in burst 2's 309-test suite — the mapping checks out on the
nose. `futoshiki:131` landed at index 216 in two independent runs.

| # | run | head | row | engine | error shape | class | webkit pos |
|---|---|---|---|---|---|---|---|
| 1 | 30765365438 | 3a848258 | `futoshiki.spec.ts:97` | webkit | `locator.waitFor: Timeout 15000ms` | deadline | 47/144 (33%) |
| 2 | 30765365438 | 3a848258 | `futoshiki.spec.ts:131` | webkit | `locator.waitFor: Timeout 15000ms` | deadline | 50/144 (35%) |
| 3 | 30765365438 | 3a848258 | `gallery.spec.ts:289` | webkit | `toHaveCount` 0≠1, timeout 10000ms | deadline | 85/144 (59%) |
| 4 | 30770223565 | ccbc20bb | `a11y.spec.ts:490` | webkit | `imageCensus.unnamed` 0≠1 | one-shot read | 15/152 (10%) |
| 5 | 30781866393 | afc72ba1 | `a11y.spec.ts:490` | webkit | `imageCensus.unnamed` 0≠1 | one-shot read | 15/160 (9%) |
| 6 | 30786643192 | 6a180b35 | `futoshiki.spec.ts:131` | webkit | `locator.waitFor: Timeout 15000ms` | deadline | 51/160 (32%) |
| 7 | 30786643192 | 6a180b35 | `multiplayer.spec.ts:498` | webkit | `Test timeout of 30000ms` (4-page) | deadline | 112/160 (70%) |
| 8 | 30791082765 | cbf2ab49 | `futoshiki.spec.ts:131` | webkit | `locator.waitFor: Timeout 15000ms` | deadline | 51/160 (32%) |
| 9 | 30791082765 | cbf2ab49 | `multiplayer.spec.ts:454` | webkit | `toBeGreaterThan` 10 ≯ 10 (op flood) | boundary read | 107/160 (67%) |
| 10 | 30791082765 | cbf2ab49 | `permalink.spec.ts:52` | webkit | `waitFor .gallery-viewport 15000ms` | deadline | 117/160 (73%) |

Recurrence: `futoshiki:131` ×3, `a11y:490` ×2, the rest ×1. **`futoshiki:131` is the class's
head row**, not `a11y:490`.

---

## 3. The correlates, measured

### 3.1 Engine — the one strong signal

**10 of 10 reds are `[webkit]`. Zero chromium reds.** Across the seven runs the suite executed
**1,131 chromium rows and 1,096 webkit rows**. Under a null where reds are engine-blind,
P(all ten land in webkit) = 0.4921¹⁰ = **8.3 × 10⁻⁴**. Engine dependence is established.

And webkit is the expensive half. Per-test wall clock, derived from the dot-block boundaries:

| run | head | chromium (s/test) | webkit (s/test) | ratio | suite wall |
|---|---|---|---|---|---|
| 30765365438 | 3a848258 | 1.390 | 3.103 | 2.23× | 654s |
| 30770223565 | ccbc20bb | 1.335 | 3.753 | 2.81× | 780s |
| 30780222492 | ce7a06f9 | 1.348 | 3.635 | 2.70× | 804s |
| 30780989714 | 1cc8f4e4 | 1.082 | 3.309 | 3.06× | 708s |
| 30781866393 | afc72ba1 | 1.307 | 3.639 | 2.78× | 798s |
| 30786643192 | 6a180b35 | 1.324 | 3.547 | 2.68× | 786s |
| 30791082765 | cbf2ab49 | 1.327 | 3.657 | 2.76× | 804s |

Webkit costs **2.7–3.1×** chromium per row. The reds track the *cost*, not the surface — every
one of these rows also runs in chromium, on the same assertion, and has never red there.

### 3.2 Position — the contention-accumulation hypothesis is FALSIFIED

Reds sit at 9%, 10%, 32%, 32%, 33%, 35%, 59%, 67%, 70%, 73% into the webkit block. Mean 42%,
uniformly spread. There's **no late-suite clustering**, so no resource-leak or drift signature:
whatever fails does so as readily 15 rows in as 117 rows in. The first 160 rows (all chromium,
including the cold-cache first-N) have never produced a red in seven runs, so a cold-start
mechanism is out too.

### 3.3 Machine — infra is ruled out, box speed does NOT separate red from green

Seven distinct ephemeral runners (`GitHub Actions 1000004463`…`1000004663`), all
`ubuntu-latest` → image `ubuntu-24.04` version **20260720.247.2**, identical across all seven.
Image drift is out. Zero occurrences of `out of memory`, `segfault`, `ECONNREFUSED`,
`Target closed` or `browser has been closed` in any of the seven e2e logs. The perf-subset
artifacts confirm the runner class: **4 vCPU**, against `workers: 2`.

Box speed, proxied by the chromium half's wall clock (identical work at the five 325-test heads):

| head | chromium half | main suite |
|---|---|---|
| ce7a06f9 | 215.7s | **green** |
| 1cc8f4e4 | 173.1s | **green** |
| afc72ba1 | 209.2s | red ×1 |
| 6a180b35 | 211.9s | red ×2 |
| cbf2ab49 | 212.3s | red ×3 |

The fastest box was green — and so was the **slowest**. A naive "slow runner → red" model is
refuted at n=5. Whatever contention does here, it isn't visible in aggregate box throughput.

### 3.4 Failure shape — the strongest mechanistic tell

**7 of 10 reds are deadline-shaped**: five `locator.waitFor` 15s timeouts, one `toHaveCount`
that polled 10s and never converged, one 30s test-timeout on the four-page multiplayer row.
The three that aren't are read-discipline defects: `a11y:490` ×2 reads `imageCensus(page)`
one-shot at `:502` with no poll, and `multiplayer:454` asserts `> 10` and receives exactly 10 —
a boundary read taken a beat early.

The deadline rows are also the suite's heaviest work. `futoshiki:131` ("a fresh generated board
solves to solve-success") is a WASM generate-then-solve inside a per-game Worker; `multiplayer`
opens three-to-four pages at once. On a 4-vCPU box running two Playwright workers, each with a
webkit page plus a solver thread, two solve-shaped rows co-residing oversubscribes the box —
and the head row of the class is exactly the solve.

---

## 4. What could NOT be measured, and why

The task asked for failing rows' wall clock against their wall clock in a green run. **That
comparison is not derivable from anything CI banks today, and this is a defect in the rig, not
in the reading.**

`playwright.config.ts` declares **no reporter**. In CI that means the dot reporter and nothing
else — no HTML, no JSON, no blob. ci.yml's failure-only upload points at
`web/frontend/playwright-report`, which only ever gets written by the *golden* config (its
`reporter: [['list'], ['html', …]]`, playwright-golden.config.ts:79). So:

- The three runs whose suite actually red (`30781866393`, `30786643192`, `30791082765`) uploaded
  **no `playwright-report` artifact at all** — the upload step ran, found nothing, exited 0.
- The one run that *did* bank a `playwright-report` (`30780222492`) shipped the **golden
  config's four-test report**, because its suite passed and the golden gate wrote last. Verified
  by decoding the artifact: `stats {"total":4,…}`, `projectNames ['']`, `visual-golden.spec.ts`.

ci.yml:1121-1125 already half-diagnosed this in a comment ("`playwright-report` carried the
golden gate's report instead") and fixed the *throttle* path without ever giving the default
suite a reporter. Consequence: **per-row durations, worker index and retry attempts are lost on
exactly the runs where they matter.** Fix it before the next burst (§7).

Also lost on every red: steps 13/17/18, `skipped` in all four red jobs. One webkit flake
silently skips the visual golden gate, the 39-test built-dist battery (throttled-void,
filter-census, wordmark-integrity, theme-bake-freshness, theme-quadrants) and the prod-shake
proof. Four of the five configs CH-62 and CH-65 live in are un-run whenever CH-64 bites — and
at head that list grew a fifth, W1's built-CSS `theme-selector census` (ci.yml:1113), which
lands downstream of the same exit code.

---

## 5. Mechanism adjudication

**Not infra.** Constant image across all seven runs, seven distinct ephemeral boxes, zero
infra-shaped strings, no runner or network error anywhere in the logs.

**Contention is the leading mechanism, and it's corroborated on shape and cost — not on a
direct measurement.** For it: reds are 100% webkit, the engine that costs 2.7–3.1× per row;
7 of 10 are deadline-shaped against 15s and 30s caps; the head row is the CPU-heaviest row in
the suite (WASM solve in a Worker) and the second-heaviest recurrer opens four pages at once;
the box is 4 vCPU carrying two workers plus a dev server. Against it: aggregate box speed
doesn't separate red from green (§3.3), position shows no accumulation (§3.2), and the direct
proof — a failing row's own duration in a red run versus a green one — **cannot be produced,
because no run banks one** (§4). Honest verdict: **contention-amplified, not contention-proven.**

**And it isn't only contention.** Three of ten reds are surface defects sharding will not
touch: `a11y:490`'s unpolled `imageCensus` (×2) and `multiplayer:454`'s boundary `> 10`. These
are the settle-is-polled law one surface over — the same family as W3's two open CH-63
discipline rows, which is the wave's own thesis arriving from the field.

**The class in one line: engine-localized, contention-amplified, discipline-seeded.** Sharding
buys the deadline family and buys back the skipped gates. It does not cure `a11y:490`, and
must not be sold as if it did.

---

## 6. Sharding — the recommendation, with numbers

Baseline: e2e job wall **910s mean** (915/921/915/879/921 at the five 325-test heads), of which
**~762s is in-test**, **~70s is fixed setup** (checkout → npm ci → browser install; the
Playwright bundle cache hits, so the install is 29–45s), and the rest is the golden/gates tail.
Mean project cost: **chromium 210s, webkit 552s**, both at `workers: 2`.

Define contention-seconds = (workers − 1) × in-test wall — the co-resident worker-seconds a row
can be starved by. Today: 1 × 762 = **762**.

| option | shape | critical path | contention-sec | runner-min |
|---|---|---|---|---|
| today | 1 job, both projects, workers=2 | **15.2m** | 762 | 15.2 |
| A — gate 3 as written | 2 jobs by project, workers=2 each | 10.4m (chromium 4.7m) | **762 — unchanged** | 15.1 |
| B — **recommended** | chromium workers=2 + webkit ×3 shards workers=1 | **7.3m** | **210** | 26.6 |
| C | chromium workers=2 + webkit ×2 shards workers=1 | 10.4m | 210 | 25.4 |

**The wave's gate 3 is right about the destination and wrong about the arithmetic of getting
there.** A plain chromium/webkit split gives ~10.4m, not ~7m, and it changes contention-seconds
by **zero** — each shard still runs two workers on its own 4-vCPU box. The "~7m each, half the
contention-seconds" claim only becomes true at **three webkit shards running `workers: 1`**,
which is option B: 7.3m per shard (368s of test at 1104 single-worker webkit-seconds ÷ 3, plus
70s setup), and webkit contention-seconds driven to **0** — every webkit row gets the box to
itself. Estate contention drops 762 → 210 (**−72%**), critical path 15.2m → 7.3m (**−52%**), at
+11.4 billed runner-minutes. Every shard sits far under the 25m cap.

Chromium stays at `workers: 2`: 0 reds in 1,131 executed rows buys no case for spending
minutes there. C is dominated by B — same minutes, 3m worse wall clock.

Caveats stated plainly:

- The single-worker webkit estimate (1104s) assumes the two workers scale near-linearly on 4
  vCPU. If they don't — if webkit is I/O-bound rather than CPU-bound — single-worker cost is
  *lower* than 1104s and B gets cheaper, not dearer. The estimate is the conservative side.
- `--shard` splits by file. Webkit's 160 rows across 16 files balance to ~53/shard, but
  `gallery-deal` (18) and `a11y`/`multiplayer` (15 each) are the lumps; re-measure the split
  after landing rather than assuming thirds.
- B removes co-residency. It does not remove the 15s/30s caps, so if a row is genuinely near its
  budget on this hardware it will still red — which is the correct outcome, and now a legible
  one rather than a coin flip.

**Prediction that makes B falsifiable:** if the mechanism is co-residency, the deadline family
(7 of 10 reds: `futoshiki:97/:131`, `gallery:289`, `multiplayer:454/:498`, `permalink:52`) goes
to zero under B, while `a11y:490` keeps flaking at its present rate until its poll lands. If
`futoshiki:131` still reds under `workers: 1`, contention is refuted and the row is a genuine
webkit budget defect — either way the next burst is diagnostic instead of ambiguous. Bank this
sentence as the class's read-out.

---

## 7. What the chair has to wire (none of it is mine to edit)

1. **The sharding change** — exact ci.yml shape in `wiring_requests`.
2. **Give the default suite a reporter.** `playwright.config.ts` needs
   `reporter: [['dot'], ['html', { open: 'never' }], ['json', { outputFile: 'e2e-report.json' }]]`
   and ci.yml needs to upload `web/frontend/e2e-report.json` on failure. Without it, the next
   burst is read from an 80-character dot line again — no durations, no worker index, no
   attempts. This is the single highest-leverage row in the file.
3. **Unhitch the downstream gates from the suite's exit code.** Steps 13/17/18 — and W1's
   theme-selector census at ci.yml:1113 — skip on any default-suite red; sharding makes them
   their own job anyway, and they should be `needs:`-free of the webkit shards. Nothing else in
   ci.yml `needs:` the e2e job, so the split costs no DAG surgery.
4. **Correct the ledger.** CH-64's row cites `30781866393` as the third burst on a 1-red run;
   the qualifying third burst is `30786643192`, and burst 2 (`30770223565`) never met the ≥2
   bar. The trigger stands — the citation doesn't.
5. **The canary trap.** The self-delta arms fail by design in every run, green ones included;
   any future reading of a red log must exclude steps 14–16 before counting reds. Worth a line
   in the class's row so the misread can't recur.

---

## 8. THE FALSIFICATION FIRED — option B's field verdict (appended 2026-08-03)

§6's prediction was banked to be read out, and the field read it out. **Nothing above is
edited**; this section is the correction, and where it contradicts §5 or §6 it wins on date.

*(Numbered 8, not 7: §7 was already the chair's wiring list when this was written.)*

### 8.1 What the field returned

Option B landed at head `6d612ec5` — ci.yml `e2e-webkit`, webkit ×3 shards at `workers: 1`.
Run **`30799424855`**, shard 1, **red twice**, 56/57 both times, on a **wandering** row:

| attempt | row | site | error |
|---|---|---|---|
| 1 | `futoshiki.spec.ts:48` — gallery switches to futoshiki | `futoshiki.spec.ts:33` | `.gallery-viewport` not visible within 15,000ms |
| 2 | `futoshiki.spec.ts:75` — size switching 4×4/5×5/6×6/7×7 | `futoshiki.spec.ts:33` | `.gallery-viewport` not visible within 15,000ms |

The ROW wanders; the SITE does not. Both reds are line 33 — the deck failing to open after the
wordmark press. In attempt 2, row `:48` had opened the same deck **6 seconds earlier and
passed** ([51/57] at 09:16:04.958, [52/57] at 09:16:10.858).

### 8.2 Contention is REFUTED as a sufficient cause

One webkit worker, no neighbouring browser, no co-resident row — and the family did not go to
zero. §5's "contention-amplified, not contention-proven" was the honest verdict on the evidence
then available, and the honest verdict now is that the amplification was never the cause of
this family. §6's read-out clause is discharged as written: **the family gets per-row
forensics**, and it got them.

### 8.3 The cold-chunk waterfall is refuted too — it was never in the path

The prime suspect on re-attribution was the F3 lazy-futoshiki ESM waterfall. It is wrong at the
selector: **`.gallery-viewport` lives in `GameGallery.vue`, a STATIC import in `App.vue`
(App.vue:31) — it rides the main chunk.** No lazy chunk stands between the press and that
element. Measured anyway, on a cold vite process with a fresh context per iteration: cold and
warm click→gallery are the same number (299/231/249/313ms), and first contact with the futoshiki
chunk costs 288–577ms — two orders under the budget. Main-thread starvation by
`preloadScenes()` is refuted by its own instrument: on the reproduced failure the patched
`chromeLeaveMs` timer **fired on time at 203ms** and the gallery still never mounted.

### 8.4 The actual mechanism: WebKit drops the press

Reproduced on darwin WebKit, **2 of 30** unaided presses, no throttling. Document-level capture
listeners caught it:

```
iter 19 RED  mouseup@523->image.logo-pose-bmp     ← a lone mouseup, no mousedown, NO click
iter 26 RED  mousedown@554->text.logo-text        ← a lone mousedown, no mouseup, NO click
```

WebKit synthesizes `click` only from a mousedown/mouseup **pair**. One half never reached the
document, so no `click` was dispatched and Vue's `@click.stop` never ran — confirmed by the
state at every red: no `?view=gallery`, `html.gallery-leaving` never added, the wordmark still a
`<button>`, the app alive and dealt with no console error. The wordmark's box is byte-identical
before and after ([130,6,424,112]), so it is not a geometry race.

The two surviving targets name the cause: `image.logo-pose-bmp` and `text.logo-text` are the two
**arms of the wordmark's pose stack**. When `logoBaked` flips, the live `<g class="logo-pose">`
filter stack is torn out of the document and replaced by baked `<image>` siblings; a mouse pair
straddling that swap loses the half whose target is destroyed. `loadApp` waits on
`svg.handwritten-logo` — the earliest instant the wordmark exists — so this file's rows press
squarely inside the bake window, while every other gallery-opening spec first waits out a dealt
board and spends that window. **Chromium: 0 dropped in 25.** Engine-localized, exactly as §3.1
measured — but localized to a WebKit input defect, not to WebKit's cost.

So §5's one-line class is superseded for this family. It now reads: **engine-localized because
WebKit drops a press whose target is swapped mid-gesture; seeded by a readiness predicate that
presses inside the bake window; never contention, never a chunk.**

### 8.5 The cure

`e2e/futoshiki.spec.ts` gains `openDeck()` — poll the invariant (`.gallery-viewport` visible),
re-press if the deck did not commit, bounded 20,000ms with a 4,000ms per-press beat. Idempotent
by construction: `openGallery()` returns early on `view === 'gallery'`, and the wordmark goes
inert (`<span>`) once open, which is also how `openDeck` tells a late open from a dropped press.
No fixed wait — `lint:sleep` green. The same file also inherits W3's a11y settle before `Enter`
(activedescendant + `aria-selected`), a live trap it had never been given.

Measured: **0/30 webkit** cured vs **2/30** unaided; the cure's own counter caught **4 of 30
first presses dropped and recovered**. Proof: 7 consecutive webkit runs of the file at
`--workers=1` on a cold server (28 deck opens, 0 red) plus chromium green.

### 8.6 What stays TRUE from §6

- **The sharding arithmetic stands.** Option B still drives estate contention-seconds 762 → 210
  (**−72%**) and the critical path 15.2m → 7.3m (**−52%**) at +11.4 billed runner-minutes. The
  measurement was right; only the causal claim attached to it is withdrawn.
- **The `a11y:490` discipline cure stands** — §5 called it a surface defect sharding would not
  touch, and sharding did not touch it. That call was correct.
- **§1's canary correction, §3.2's position falsification and §3.3's infra exclusion** are
  untouched by this section.
- **§7's wiring list stands**, and item 2 (a machine-readable reporter) is vindicated: this
  investigation still had to parse the dot-reporter log by hand.

### 8.7 Residue for the chair

1. **A product row, uncured.** A real Safari user pressing the wordmark while the bake lands
   gets nothing. ≈7% at first contact on darwin. `src/` was outside this agent's fence.
   Candidate cures: keep the live arm mounted and opacity-swap it (the grid boil's own steady
   state) rather than tearing it out, or bake before the wordmark is interactive.
2. **The harness class is wider than the cured file.** `a11y.spec.ts`, `gallery-guard.spec.ts`,
   `permalink.spec.ts:64`, `gallery-deal.spec.ts` ×4 and `throttled-void.spec.ts:66` all press
   the wordmark with one unguarded `.click()`, shielded only by having waited out a dealt board
   first — a timing accident, not a contract. `openDeck` belongs in a shared e2e helper.
3. **The banked prediction is spent.** §6's read-out clause should be marked discharged rather
   than left standing as an open bet.

Full per-row forensics, every figure pasted from probe stdout:
`evidence/w3/futoshiki-coldchunk-forensics.txt`.
