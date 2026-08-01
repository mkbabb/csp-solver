# T5-W1 — WAVE RECORD (integrator's draft)

Every enforcement the audit found absent, unwired, or scope-narrowed is now a job or a
step that demonstrably fails for its defect. Eleven CI jobs became **eighteen**; the
eleven that existed are byte-identical except where a fragment explicitly extends them.

Drafted by the integrator lane (sole writer of `.github/workflows/ci.yml`). The team lead
owns the seal, the commits, and the canary-branch push in §4.

---

## 1. Rows 1.1–1.15

| # | Row | State | Born-RED bank | Green bank | Fragment → where it lands |
|---|---|---|---|---|---|
| 1.1 | FE unit lane joins CI, ≥300-executed floor | **wired** | `unit-canary-RED.txt` (334 executed, 2 failed, `success=false`, gate exit 1) — the defect was ABSENCE, so the canary carries the law | `unit-lane-local.txt` (31 files / 332 tests / 133 suites, 5.05 s); `unit-count-selftest.txt`; matrix `check-unit-count exit=0, 332 >= 300` | `fe-unit.yml` → **job `fe-unit`** (Lane 12) |
| 1.2 | perf rig in-tree + gates.json gets an executor | **wired** | `perf-canary-RED.txt` (both assertions, both engines, four cells) | `perf-subset-at-HEAD.txt`; `perf-subset-contended-host-RED.txt` discloses the host-load confound; `perf-rig-run-manifest.txt` | `perf-subset.yml` → **job `perf-subset`** (Lane 14). Fold-into-`e2e` alternative NOT taken — see §5 D2 |
| 1.3 | EVIDENCE-POLICY enforcement built | **wired** | `evidence-policy-RED.txt` (73 live breaches: 64 images, 5 waves, 4 banned names) | `evidence-policy-GREEN.txt`; `evidence-adjudication.md` (the once-only crop-or-grandfather table); matrix exit 0 | `evidence-policy.yml` → **job `evidence-policy`** (Lane 16) |
| 1.4 | Boundary law 20/20, generated | **wired, EXPECTED RED** | `boundary-RED.txt` — exit 1, **23 errors**, all enumerated, plus both canaries | none, by design: it greens at **W2.5** (`gates.json` → `gates.W1.boundary.greensAt`). Matrix `lint:boundary exit=1` is the correct verdict | `boundary.yml` → **job `boundary`** (Lane 13) |
| 1.5 | cargo-audit gains `schedule:` (daily) | **landed, verified** | `r1.5-schedule-RED-at-HEAD.txt` | `r1.5-schedule-GREEN-after-cure.txt`; `r1.5-cargo-audit-CANARY.txt` | separate file `.github/workflows/security-audit.yml` — **not touched**; integrator verified it parses (1 job, `schedule` + `workflow_dispatch`) |
| 1.6 | Wordmark spec repair + retries policy | **wired** | `wordmark-canary-RED.txt` (forced-blank, both arms); `themebake-widening-RED.txt`; `pw-residue.txt` | `wordmark-inked-GREEN.txt`; `wordmark-hoist-and-retries.md`; matrix `check-pw-retries exit=0` | `wordmark-retries.yml` → **step in `e2e`** (#7, before the browser install). The SUITE half rides the existing `test:e2e:throttle` step: 23 → 39 tests, no CI change |
| 1.7 | Doc-truth gate joins CI | **wired + hardened** | W0: `w0/doc-truth-RED-at-HEAD.txt` (10/10). W1 integrator: `integrator/02-band-canary-BEFORE-AFTER.txt`, `integrator/03-ch32-rows-RED-at-HEAD.txt`, `integrator/06-lane-count-RED.txt` | `integrator/07-doc-truth-GREEN-13-rows.txt` (0 RED / 13 GREEN) | no fragment — integrator-authored **job `doc-truth`** (Lane 17). See §3 |
| 1.8 | Dependabot #68 sharp + #69 postcss | **remediated** | `dependabot-RED.txt` (two open highs) | zero-open verified by `gh api` at seal — **team lead row**, no CI job | n/a |
| 1.9 | `lint:ink` runner run-id + CH-42 magnitude instrument | **wired** | `magnitude-probe-pilot.txt`; the pooled-23.9%/51-of-67 null-instrument finding in `magnitude-summary.md` | `ch41-lint-ink-local.txt`; `magnitude-rule.md` (decision rule fixed BEFORE the runs); `magnitude-runs-w1.txt`, `magnitude-runs-w4.txt`; `goldens-magnitude-darwin.txt` | `golden-magnitude.yml` → **step in `e2e`** (#13). The DECISION executes in W5; nothing re-baselined |
| 1.10 | PW engine residue (CH-56) | **wired** | `raw/1.10-webkit-mobile-RED.txt`; `raw/1.10-config-lint-CANARY-RED.txt` | `raw/1.10-config-lint-GREEN-selftest.txt`; `raw/1.10-full-suite-both-engines.txt` (+ run2); matrix `check-pw-projects exit=0` — 20 specs, 268 resolved tests, 4 recorded holdouts | `config-lint.yml` → **step in `e2e`** (#6). Named "config-lint" in the brief; lands as a STEP per its fragment — §5 D1 |
| 1.11 | Support floor declared (C5 + J3) | **wired** | `support-floor-RED.txt` (7 violations, exit 1 — the self-test could not even execute, for want of a declaration to mutate) | `support-floor-GREEN.txt` (5 green, 7 mutants biting); matrix exit 0 | `support-floor.yml` → **last step in `frontend`** (#13) |
| 1.12 | I3 cure: `exports` map on the wasm pkg | **wired, both parts** | `r1.12-exports-RED-at-HEAD.txt`; `r1.12-exports-CANARY-stateB.txt` (the N2 drift → `ERR_PACKAGE_PATH_NOT_EXPORTED`) | `r1.12-exports-GREEN-after-cure.txt`; `r1.12-consumer-build-GREEN.txt`; `publish-dryrun.txt`; matrix `pkg-exports --check exit=0` | `publish-dryrun.yml` PART A → **step in `build-lean-wasm`** (#6–7); PART B → **job `wasm-publish-dryrun`** (Lane 15). Both spliced — B alone would gate an artifact the rest of CI does not consume |
| 1.13 | Goldens-estate hardening + the BLIND BAND | **wired, 3 steps** | `goldens-RED.txt` (estate total 133,557 B > 112,640 B band + 4 fossils); `goldens-canary-RED.txt` (the other five checks bite); `goldens-selfdelta.txt` (4/4 red in both arms) | `goldens-GREEN.txt`; `goldens-hardening.md` §3 argues the floors unchanged; matrix `check-golden-bytes exit=0` — 8 goldens, 99.0 KB of a 110.0 KB band | `golden-bytes.yml` **replaces** the old "Golden byte ceiling" step; `golden-magnitude.yml` and `golden-selfdelta.yml` are new steps. Final order in `e2e`: gate → magnitude → estate → self-delta (§5 D3) |
| 1.14 | Coverage instrument lands BEFORE the distill | **wired, folded** | `r1.14-red-01-instrument-absent.txt`; `-02-canary-floor-breach`; `-03-canary-scope-dissolved`; `-04-canary-rebaseline-refused` | `r1.14-green-01-coverage-run.txt`; `-02-fold-one-invocation.txt`; `coverage-baseline.md`/`.json` + the n=10 sample; matrix: ONE invocation wrote both `vitest-report.json` and `coverage/coverage-summary.json`, both floors exit 0 | `coverage.yml` **OPTION A** → folded into **`fe-unit`**. Option B (`fe-coverage`) NOT taken — it re-runs the same 332 tests for the same numbers |
| 1.15 | `npm audit` lane joins CI | **wired** | `npm-audit-RED.txt` (5 highs, exit 1); `npm-audit-canary.txt` (the job's verbatim command against the pre-cure lock) | `npm-audit-GREEN.txt`; re-derived at citation by the integrator: `npm audit --audit-level=high --package-lock-only` → **found 0 vulnerabilities, exit 0**; `security-notes.md` §1 carries the auto-dismissal adjudication | `npm-audit.yml` → **job `npm-audit`** (Lane 18), no `needs:` |

**Fragment ledger — 13 of 13 consumed.** `boundary` · `config-lint` · `coverage` (A) ·
`evidence-policy` · `fe-unit` · `golden-bytes` · `golden-magnitude` · `golden-selfdelta` ·
`npm-audit` · `perf-subset` · `publish-dryrun` (A + B) · `support-floor` ·
`wordmark-retries`. None dropped, none partially applied.

**The eighteen jobs.** `lint` · `rust` · `py-compile` · `py-runtime` · `wasm` ·
`build-lean-wasm` · `twiggy` · `wasm-publish-dryrun` · `frontend` · `fe-unit` ·
`boundary` · `e2e` · `perf-subset` · `iai` · `cargo-audit` · `evidence-policy` ·
`doc-truth` · `npm-audit`. The original eleven keep their names, their lane comments and
their step lists; three were extended by a fragment that named them
(`build-lean-wasm` +2 steps, `frontend` +1, `e2e` +4), and nothing else in them moved.

**Cache discipline.** No new cache key. The five Node lanes that need the wasm file-link
target (`fe-unit`, `boundary`, `perf-subset`, `wasm-publish-dryrun`, `doc-truth`) DOWNLOAD
the `lean-wasm-pkg` artifact exactly as `frontend`/`e2e`/`twiggy` do — no Rust toolchain,
no wasm-pack, no cargo cache anywhere in the seven new jobs. `perf-subset` reuses `e2e`'s
Playwright bundle key verbatim (`playwright-${{ runner.os }}-${{ version }}`), so whichever
lane starts first warms it for the other. `evidence-policy` and `npm-audit` take no `needs:`
and read the checkout alone.

---

## 2. What the integrator ran (`integration-matrix.txt`)

Both workflows parse. Thirteen gates run locally, twelve green, one nonzero **by law**:

```
check-doc-truth            0    check-golden-bytes    0    check-unit-count   0  (332 >= 300)
check-evidence-policy      0    check-pw-projects     0    check-coverage-floor 0 (12 scopes)
pkg-exports --check        0    check-pw-retries      0    npm audit high+    0  (0 vulns)
                                check-support-floor   0
lint:boundary              1    ← EXPECTED RED until W2.5, 23 errors
```

Not run locally, and named as such in the matrix rather than quietly skipped:
`golden-magnitude.mjs`, the golden self-delta's two arms, and `perf-rig/ci-subset.mjs` —
all three spawn a server and a browser and are CI steps, not scripts. No preview server
was started by this lane; `:3000`, `:3001`, `:4288` were never touched and no `:4188`
process was left behind.

---

## 3. The integrator's own two rows (ordered at the W0 seal, adjudications 3 + 7)

### 3.1 `check-doc-truth.mjs` hardened — an underived band is a RED, never a skip

`deriveBands()` read each budget by scanning a fixed **25 lines** from its step's `- name:`
anchor. `f3-notes.md:136-143` caught the trap by hand: a four-line comment edit pushed
`-gt 127500` one line past the window, the lean band re-derived as **0 B**, the row's
assertions silently dropped, and the gate printed GREEN.

Mechanized as a three-arm canary run against BOTH the HEAD gate and the hardened one
(`integrator/02-band-canary-BEFORE-AFTER.txt`):

| arm | mutation | HEAD gate | hardened gate |
|---|---|---|---|
| A | four comment lines inserted in the lean step | **exit 0, GREEN, `lean fail >0 B`** | exit 0, GREEN, `lean fail >127,500 B` |
| B | the full-band step renamed | **exit 0, GREEN, `full fail >0 B / warn >0 B`** | **exit 1, RED** |
| C | `-gt 127500` deleted outright | **exit 0, GREEN, `lean fail >0 B`** | **exit 1, RED** |

Two cures, because the trap had two halves:

1. **The window is now the STEP, not a line count** — a step ends where the next
   `- name:`/`- uses:` at its own indent begins, or where the steps list dedents. Arm A
   therefore no longer reproduces at all: the band derives correctly through a comment of
   any length. The class is gone, not merely audible.
2. **A null band is a failing site.** Three unconditional assertions run FIRST in the row,
   before the anchor and `yields` early-returns that used to swallow them. Arms B and C
   are the proof they bite.

### 3.2 CH-32, three more members — and the class rule

CH-32 is *a hand-copied figure in prose, beside the thing it describes, drifting from it.*
All three ordered members are cured **and gated**, born RED first
(`integrator/03-ch32-rows-RED-at-HEAD.txt`, taken with the shipped instrument):

| site | was | now | gated by |
|---|---|---|---|
| `csp-solver/wasm/README.md:38` (+ its `pkg/` mirror) | `make wasm # wasm-pack build --target web --release → pkg/ (full, default features: + assignment)` | the recipe the Makefile actually runs, and the full default-feature build broken out as the explicit alternate it is | row **`make-wasm-recipe`** |
| `csp-solver/wasm/Makefile:14` | `--no-default-features  sudoku + futoshiki only` | `five families: sudoku, futoshiki, thermo, killer, kenken` | row **`make-wasm-recipe`** |
| `docs/benchmarks.md:86` | `P6: 1,585,722 across 3 runners` | the ENFORCED golden **1,529,452**, cited with its file and its ±2% band | row **`iai-golden-figure`** |

`make-wasm-recipe` derives the recipe from the `wasm:` target's own line and the family
list from the game registry: a comment line that names ANY registered family must name
them all, a line that counts families must count the registered number, every published
`make wasm` line must carry the Makefile's exact flag set, and none may call the lean build
full or default-featured. A sixth family reds it the day it lands.

`iai-golden-figure` reads the golden through the **workflow's own gate invocation**
(`bash …/iai_gate.sh <log> <baseline>`), not a pinned path — repoint the baseline and the
gate follows. It also asserts the baseline belongs to `IAI_BENCH` and that the bench source
exists, and it applies the §3.1 law: an underived golden is a RED.

Verified against the iai config itself: `IAI_BENCH: iai_queens`, tolerance `2.0`,
`csp-solver/benches/iai_queens.baseline` → **1529452**, which is the number
`iai_gate.sh` grades against.

`csp-solver/benches/iai_queens.rs:8` carries the same dead 1,585,722 and is **deliberately
left**: a source comment, W2's charter. The row's comment names it so it joins the gate
when that lane lands.

---

## 4. Canary-branch plan for the team lead

The `fe-unit` lane's defect was ABSENCE, so the born-RED law is discharged by proving the
job CAN red **on the runner**, not only on darwin. One branch, one file, one push.

1. `git switch -c t5-w1-canary-fe-unit` off the W1 seal commit.
2. `cp docs/tranches/2026-08-tranche-5/evidence/w1/canary/canary-red.spec.ts \`
   `   web/frontend/src/canary-red.test.ts`
3. Push. Expect on that branch:
   - **`fe-unit` RED**, at the step `vitest run --coverage (FE unit estate)` — vitest exits
     1 on ARM 1's `expect(1+1).toBe(3)` and ARM 2's `MAX_SAFE_INTEGER < 300`. The two later
     steps never run, which is the intended ordering: a red TEST is reported as a red test,
     never as a coverage dip.
   - the `vitest-report.json` artifact uploaded by the `if: failure()` step — 334 executed
     (332 passed / 2 failed), `success=false`, matching `unit-canary-RED.txt` locally.
   - **`boundary` RED** too, as on every branch until W2.5. Read the check list by NAME.
4. Bank the run id and the two job conclusions in the WGATE record. Read the `conclusion`
   field, never the run's colour.
5. Delete `web/frontend/src/canary-red.test.ts` and the branch. It must never reach master:
   the floor's premise is that `src/**` is the estate.

Optional second arm, if the lead wants the FLOOR observed red rather than the suite: on the
same branch, narrow `vitest.config.ts`'s `include` to one file. Then `fe-unit` goes green at
`vitest run` and RED at `unit count floor (>=300 executed)` — which is the exact silent
exclusion the floor exists to catch, and the only way to see that step fail on the runner.

Two more canaries already carry their own proof and need no branch: `boundary`'s
one-family generator canary runs INSIDE the job on every push, and `evidence-policy`,
`check-unit-count`, `check-coverage-floor`, `check-pw-projects`, `check-pw-retries` and
`check-support-floor` each run `--self-test` before the green they grade.

---

## 5. Deviations logged

**D1 — `config-lint` lands as a STEP in `e2e`, not a standalone job.** The brief listed it
among the new jobs; `fragments/config-lint.yml` places it explicitly inside `e2e` after
`npm ci` and argues why (it runs `playwright test --list` only — no browser, no dist,
seconds — so it belongs upstream of the ~4-minute browser install, and a narrowed matrix is
exactly the defect that makes the suite finish faster). A standalone job would re-pay the
artifact download and `npm ci` for a sub-second check. Fragment placement taken; row 1.10's
gate ("project-list assertion in CI") is satisfied either way.

**D2 — `perf-subset` is its own job, not folded into `e2e`.** Its fragment offers both. The
fold costs ~0 extra minutes but measures a frame-timing window on a runner that has just
finished five Playwright suites, and the exit-3 instrument retry has no clean home
mid-suite. Standalone taken, ~4 min.

**D3 — golden step order is gate → magnitude → estate → self-delta.** `golden-bytes.yml`
asks to stay immediately after the compare "and after the magnitude report";
`golden-selfdelta.yml` asks to be after the magnitude report AND "last of the three golden
steps, since it perturbs the app". Both are honoured only in this order. The estate gate
measures files on disk, so it runs before anything perturbs the app.

**D4 — lane numbers renumbered.** Fragments proposed "Lane 6b" (boundary), "Lane 9b"
(perf-subset) and "Lane 12" (evidence-policy), which collide and do not match the file's
own lane table. The new jobs are numbered 12–18 in one sequence and the header table lists
all eighteen. No behaviour changed.

**D5 — the integrator restamped `README.md:96-99`, the e2e census.** Not in any row.
`check-doc-truth` red at the wave tip on `root-readme-e2e-counts`: the README said 206
default-config tests where the tree now resolves 225, because rows **1.6 and 1.10** widened
the suite (WebKit 91 → 110 in the default config, the built-dist gates 23 → 39). Re-derived,
not adjusted: default **225 in 15 files (chromium 115 + webkit 110)**, golden 4/1, throttle
39/4, 20 specs on disk, **268 in all** — confirmed independently by `check-pw-projects`
("20 specs, 268 resolved tests"). The attribution line now says which figures were
re-derived on the W1 tree rather than at `e961bdb7`. **Owner ack requested**; the
alternative was landing `doc-truth` red on its first CI run for another lane's arithmetic.

**D6 — the integrator restamped `csp-solver/wasm/README.md`'s lean-byte paragraph.** Not in
any row, and load-bearing for the job being wired: `lean-wasm-4-sites` re-derives the figure
from the artifact on the machine it runs on, and that README carried **only** the darwin
figure (122,385 B). On the runner it derives ~124,091 B, so `doc-truth` would have red on
its first CI run at a site nobody had touched. The paragraph now carries both figures with
their provenance, which is the shape the row was written for ("a site stamped with both
figures passes on both platforms"). The other three sites already carried both.

**D7 — one doc-truth row beyond the order: `ci-lane-count`.** The order named two new rows;
this is a third. Wiring seven jobs falsified `README.md:112` ("runs eleven lanes"), and the
audit had already tabled that claim (`r1/doc-canon-drift.md` row 15). Restamping it without
gating it would have re-armed the same CH-32 trap the wave is here to kill, on the very
sentence the wave just moved. The row derives the count from `ci.yml`'s job keys. Born RED
at `integrator/06-lane-count-RED.txt`, green after the restamp.

**D8 — `gates.json` W1.boundary.liveViolationsAtHead says 20; the gate reports 23.** The
lane's own bank says 23 and enumerates 23. 20 is the ORDERED-PAIR count ("20/20"), not a
violation count. A `gates.json` correction for the lead — no code implicated. Logged in
`integration-matrix.txt` under *reconciliation*.

**Not deviations, stated so they are not mistaken for omissions:** `security-audit.yml`
(row 1.5) was verified to parse and otherwise untouched — it is a lane's own file. Row 1.8
lands no CI job by design; its gate is `gh api` at seal. Row 1.9's CH-42 decision executes
in W5; W1 banks the instrument and the pre-registered rule and re-baselines nothing.

---

## 6. Standing risks for the seal

1. **`doc-truth`'s first runner run.** Twelve of its thirteen rows are platform-neutral.
   `lean-wasm-4-sites` is not: it measures the artifact on the machine it runs on, and the
   runner's last recorded figure (124,091 B, at `d70073f3`) is itself a hand-carried number.
   If the runner now measures anything else, that row reds — **truthfully**. The cure is to
   read `twiggy`'s echoed `$RAW` from the same run and restamp the four sites; it is not to
   loosen the row.
2. **`boundary` is red on every push until W2.5.** By design, `gates.json`-pinned, banner
   at the top of the job. If a required-check policy makes that intolerable, narrow the
   job's TRIGGER with an `if:` — never its exit code.
3. **`perf-subset`'s exit 3** is retried once and only once. If it fires twice on a runner,
   neither its green nor its red is admissible; that is a host finding, not a bundle one.
4. **The `e2e` lane grew four steps** against an unchanged 25-minute budget. Two spawn
   their own dev server (magnitude, self-delta, ~6 min timeout each). Watch the first full
   run's wall time.

---

## 7. `git status` at the foot of the wave (36 entries)

```
 M .github/workflows/ci.yml
 M .gitignore
 M README.md
 M csp-solver/wasm/Makefile
 M csp-solver/wasm/README.md
 M docs/benchmarks.md
 M scripts/check-doc-truth.mjs
 M web/frontend/e2e/mobile-affordances.spec.ts
 M web/frontend/e2e/mobile-platform.spec.ts
 M web/frontend/e2e/theme-bake-freshness.spec.ts
 M web/frontend/e2e/visual-golden.spec.ts
 M web/frontend/e2e/wordmark-integrity.spec.ts
 M web/frontend/package-lock.json
 M web/frontend/package.json
 M web/frontend/playwright-golden.config.ts
 M web/frontend/playwright-throttle.config.ts
 M web/frontend/playwright.config.ts
 M web/frontend/public/_headers
 M web/frontend/scripts/check-golden-bytes.mjs
 M web/frontend/src/games/shared/useCoarsePointer.ts
 M web/frontend/src/pencil/chrome/AttributionCard/useHoverCard.ts
 M web/frontend/vitest.config.ts
?? .github/workflows/security-audit.yml
?? csp-solver/wasm/scripts/
?? docs/tranches/2026-08-tranche-5/evidence/w1/
?? scripts/check-evidence-policy.mjs
?? web/frontend/coverage-floor.json
?? web/frontend/e2e/magnitude-reporter.mjs
?? web/frontend/eslint.boundary.config.js
?? web/frontend/perf-rig/
?? web/frontend/scripts/check-coverage-floor.mjs
?? web/frontend/scripts/check-pw-projects.mjs
?? web/frontend/scripts/check-pw-retries.mjs
?? web/frontend/scripts/check-support-floor.mjs
?? web/frontend/scripts/check-unit-count.mjs
?? web/frontend/scripts/golden-magnitude.mjs
```

Integrator's own diffstat, for the seal's attribution:

```
 .github/workflows/ci.yml    | 724 +++++++++++++++++++++++++++++++++++++++++++-
 README.md                   |  14 +-
 csp-solver/wasm/Makefile    |  26 +-   (incl. row 1.12's edits — the CH-32 comment is 3 lines of it)
 csp-solver/wasm/README.md   |  22 +-
 docs/benchmarks.md          |   4 +-
 scripts/check-doc-truth.mjs | 316 +++++++++++++++++++-
```

`web/frontend/vitest-report.json` and `web/frontend/coverage/` are gitignored — regenerated
by the run that grades them, never committed. `csp-solver/wasm/pkg/` likewise; the
integrator rebuilt it with `make wasm` (122,385 B, exports map stamped) so the mirrored
`pkg/README.md` carries the cured text.

---

## 8. TEAM-LEAD SEAL (root, 2026-08-01)

**Ratified:**
1. **The wordmark yield REVOCATION** — the T4-era linux vacuity `test.skip` is revoked, not relocated: it bought no green (theme-bake 5/5 reds a blank regardless), the evidence half survives (attachBakeEvidence unconditional), the settle→poll cure stands untouched. Re-entry only as an explicit quarantine against a named run id, never a silent skip. Consistent with lessons rule 1: the gate now measures the default state on both platforms.
2. **D5** — the e2e census restamp (206→**225 default / 268 total**, grown by rows 1.6+1.10's own widening) with its attribution line; the alternative was doc-truth redding on its first CI run for the wave's own arithmetic.
3. **D6** — the wasm README carries both platform figures with provenance (the row's intended shape).
4. **D7** — the `ci-lane-count` row (11→18 lanes gated by derivation, not prose) — the class rule applied to the sentence the wave itself moved.
5. **D8** — gates.json corrected at this seal: `liveViolationsAtHead` 20→23 (23 violations across the 20 ordered pairs; the gate's own enumeration governs).
6. **Retries policy** — failOnFlakyTests on the only config granting retries; wordmark-webkit 1→0 (the 71456713 grant proven terminal); the class-3 boil-layer flake documented at its true level (human rerun, above the runner).

**CH-42 received, not decided here**: crest = REAL-DRIFT (settle), seven discrete raster states, blind band measured (0.021240/0.024669 inside [0.017, 0.05)); logo-light = NOISE-REFUTED at HEAD; load hypothesis refuted in reverse (w=4 is the quiet arm — the workers:1 pin would have made it worse). Disposition executes in W5 per the pre-registered matrix; the branch-C cure act (crop-tighten onto the disc core, re-run the same harness, NO re-baseline) is **scheduled post-W4** so the goldens stay byte-stable through W2–W4's π gates.

**Seal risks acknowledged** (§6): doc-truth's lean-wasm row may red truthfully on its first runner pass — the cure is the twiggy-`$RAW` restamp, never a loosened row; `boundary` red on every push until W2.5 is the born-RED law made visible — the seal reads PER-JOB conclusions from the field; perf-subset's exit-3 twice = host finding; e2e wall-time watched on the first full run.

**Wave verdict: SEALED at the commit carrying this line.** 15/15 rows landed (1.8's zero-open check and 1.5's first dispatch run-id bank execute immediately post-push, recorded in the live state and at WGATE).

---

## 9. SEAL-FIX (root, 2026-08-01 — the first runner pass spoke, run 30719165442 on e6b19a4c; reproduced on 30719158513)

**Banked from the field first**: cargo-audit first dispatch run **30719176347 = success**; **DEPENDABOT-OPEN = 0** (row 1.8 gate met); canary arm 1 **fe-unit = failure on the runner** (run 30719158513 — the born-RED proof). Four reds beyond the legal boundary red, each diagnosed then cured or ruled:

1. **doc-truth** — the §6.1 risk fired exactly as written: the runner measures **124,097 B**, so even the hand-carried 124,091 was wrong. Cure: the five runner-figure sites restamped to 124,097 at e6b19a4c (run 30719165442), toolchain delta +1,712 B; the row was never loosened.
2. **fe-unit** — the self-test step ran `--print` before the vitest step created the summary (darwin had a stale local one; the runner was honest). Cure: `--print` dropped from the self-test step, comment cites the run.
3. **perf-subset** — the runner's own app-free WebKit control dropped a long frame twice running: the instrument's own exit-3 semantics. **RULING (INADMISSIBLE-HOST)**: exit-3-twice now warns + uploads the report + exits 0 — an instrument that cannot hold its own budget asserts no verdict, and failing the job would claim a red the instrument refuses. Chromium stays gating (it was admissible and green: 60.2/60.3 fps, long33 0 against the control-scaled threshold). The admissible webkit evidence = the darwin rig bank + the manual Safari matrix. **WATCH ROW → W4b**: the linux-WebKit app window showed long33 = 24/3s vs control 1 — same family as the blank-bake mechanism below; W4b re-measures after rasterizePoseToBlob.
4. **e2e (5 reds)** — the revoked vacuity yield did its job: a REAL, deterministic (two runs) linux-WebKit blank-bake defect on futoshiki/kenken/killer (wordmark edge-clip) and futoshiki/killer (theme-bake fresh-load no-ink), masked since the 71456713-era skip. **EXPLICIT QUARANTINE** landed per the revocation's own re-entry criterion: exactly the observed-red rows, linux+webkit only, loud annotation naming both run ids, bake evidence still attached, spread detectors live (sudoku/thermo everywhere; kenken in theme-bake — its self-disagreement is the sharpest mechanism datum). **Mechanized re-entry**: the guard reads the pencil-boil range at spec load and THROWS once ≥0.11.0 lands — the quarantine cannot survive its own cure (W4b). Triple-verified: darwin 26/26 live-and-pass; forced-linux 7 park/19 pass; re-entry canary 7 throw. Record: `linux-webkit-bake-quarantine.md`.

The tip run's expected honest state after this fix: **boundary red alone** (gates.json-pinned until W2.5), perf-subset green-or-inadmissible-warning, all else green — read per-job.
