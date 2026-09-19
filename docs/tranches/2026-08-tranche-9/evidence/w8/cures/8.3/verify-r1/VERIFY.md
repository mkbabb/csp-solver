# T9-W8 §8.3 — NON-AUTHOR VERIFICATION, round 1 · track "probe"

Verifier did not write the cure. Worktree `.claude/worktrees/w8-probe`, branch `w8/probe`,
HEAD `9ddc0026` (clean tree, nothing uncommitted). Ports 4251 (base) / 4260 (cured), both
killed at the end. Perf rig on its own :4390 — permitted here because amendments 1-3 ARE the
perf rig's cure.

**VERDICT: REPAIR.** Mechanism lawful, π intact, every load-cost number reproduces exactly,
all three GATE D amendments reproduce at the real site. ONE blocking finding: a repo gate is
red on the branch and the gate's own message says the fix belongs in the same commit.

## 1 · THE ARMS (printed at both ends of every reading set, unmoved)

    base  index-9rZPzI5DEcpe.js · md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB
    cured index-BRDVCwHoo2FI.js · md5 819e5816db9118d894e85c64451dd9c0 · 44 files / 819.8 KB

Both match the author's report. Served bundles curl-verified from each port before measuring.
The 44th file is `assets/devicePaint-DYfALhM0r-4G.js`, 13,835 B. `dist/index.html` carries NO
modulepreload for it (`grep -c devicePaint dist/index.html` = 0); the only reference is inside
the entry chunk. `grep -c __probe`: base entry 0, cured entry 1.

loadavg: start `{ 5.93 9.11 10.67 }` · after no-flag `{ 5.47 8.10 10.13 }` ·
armed set 1 `{ 4.93 → 10.22 }` · armed set 2 `{ 10.59 → 24.61 }` · final `{ 20.98 17.28 13.96 }`.
Up to ten sibling lanes on this host; drift is why every set is interleaved b,c,b,c.

## 2 · REPRODUCTION — chromium · 4x CPU · link unthrottled · cold (CDP cache-disabled) · 390x844 dpr 3

Instrument: the author's `readiness-ab.mjs`, unmodified, `--cells mob-cr-4x-unthr-cold
--windows 5 --wait 8000`. 5 base / 5 cured interleaved. 0 tainted, 0 errored in every set.

### A load WITHOUT the flag (the player's load)

| mark | author base | author cured | MY base | MY cured | my delta | agrees |
|---|---|---|---|---|---|---|
| resourceCount | 29 | 29 | **29** (5/5) | **29** (5/5) | 0 | YES, exact |
| transferBytes | 212,064 | 212,124 | **212,064** (5/5) | **212,124** (5/5) | **+60 B** | YES, exact |
| boardReadyMs | 297.1 | 280.6 | 283.0 | 289.0 | +6.0 | inside spread (sign flips) |
| firstBoilTickMs (B1) | 2,818.2 | 2,813.7 | 2,810.7 | 2,816.7 | +6.0 | inside spread (sign flips) |
| tbt3000Ms | 1,006 | 977 | 1,005 | 1,015 | +10 | inside spread (sign flips) |
| rafGapProxyTbtMs | 1,263 | 1,236 | 1,259 | 1,266 | +7 | inside spread (sign flips) |

The two deterministic numbers reproduce to the byte in 10/10 windows. The four timing deltas
reverse sign under me, which CONFIRMS the author's own `insideSpread: true` on all four — no
timing win was claimed and none exists. The cure's real claim is the one that holds: the
player's boot is unmoved but for a deterministic +60 B of gzipped guard.

### A load WITH `?__probe=1` (what the owner's run costs)

| mark | author | MY set 1 (n=5) | MY set 2 (n=5) | MY pooled (n=10/arm) |
|---|---|---|---|---|
| resourceCount base→cured | 29→30 | 29→30 | 29→30 | **29→30, 10/10 each** |
| transferBytes base→cured | 212,064→217,563 (+5,499) | same | same | **+5,499 B, 10/10 each** |
| firstBoilTickMs base→cured | 2,812.2→2,812.9 (+0.7) | 2,814.7→2,943.7 (+129) | 2,938.9→2,815.1 (−124) | **2,815.2→2,817.8 (+2.6)** |

Set 1 alone looked like a 129 ms perturbation; set 2 reversed it; pooled at n=10 per arm the
armed cost on `firstBoilTickMs` is +2.6 ms. The author's "+0.7 ms, the instrument does not
perturb what it measures" HOLDS. I took the second set specifically to refute it and could not.

## 3 · GATE D, reproduced at the real site

Amendment 1 — the pose it never booted (`--runs 1 --engines chromium --port 4390`):

    bootTbt 1 desk   1440x900 dpr1 : tbt  296ms  anchor 117ms  → PASS vs 1750
    bootTbt 2 mobile  390x844 dpr3 : tbt 2040ms  anchor 116ms  → PROVISIONAL (unstamped)
    RESULT: GREEN

and again inside the amendment-3 canary on a quieter host: desk **251 ms**, mobile
**1,013 ms** — 4.0x, the author's own figure to within a hair. The mobile row gates NOTHING
(no `boot.tbt.poses.mob.maxTbtMs` in gates.json) and a 2,040 ms reading did not red the run,
which is the correct refusal-to-invent-a-threshold behaviour.

Amendment 2 — per-window admissibility (`--runs 3 --boot-poses desk --canary-anchor 900`):

    anchors 117, 116, 900 · median anchor 117ms
    CANARY: the OLD median rule would have graded 255ms over 3 window(s) INCLUDING the
            blown one; per window 276ms over 2
    | chromium | desk 1440x900 dpr1 | yes | 2 | 900ms | 276ms | 1750 | PASS |

The blown window is dropped BY NAME, the counterfactual is arithmetic off the same data.

Amendment 3 — grade before the instrument-failure exit (`--canary-fail chromium`):

    INSTRUMENT FAILURE: SYNTHETIC ... 2 boot window(s) WERE measured and are graded below.
    | chromium | desk   1440x900 dpr1 | yes | 1 | 0 |  251ms | 1750        | PASS        |
    | chromium | mobile  390x844 dpr3 | yes | 1 | 0 | 1013ms | (unstamped) | PROVISIONAL |
    EXIT 3 · RESULT: INADMISSIBLE — no verdict

The engine's idle verdict still dies (`NOT MEASURED` across the GATE A/B/C row) and the exit
stays 3. The pre-amendment counterfactual is readable with certainty off the diff: the old
`continue` pushed no `results` row, so the GATE D loop had nothing to iterate and the table
printed empty. I did not re-run the old binary (it would have meant writing a product file).

## 4 · π IDENTITY — verifier-run

| check | result |
|---|---|
| `playwright-golden.config.ts` vs `PLAYWRIGHT_BASE_URL=:4260`, never `--update-snapshots` | **exit 0, 4 passed** |
| `playwright-throttle.config.ts` (built dist) vs :4260, both engines | **exit 0, 67 passed** |
| filter-census (6 rows/engine, exact-match allowlist vs BUILT dist) | green inside the 67 |
| `src/pencil/config/filterBudget.ts` | NOT in the diff; total 9 |
| pose count 4 / no bake dropped / no boil thinned / no filter removed / no transition shortened | nothing under `src/pencil` or `src/games` is in the diff; wordmark-integrity + theme-bake-freshness assert the baked pose bitmaps and are green |

## 5 · GATES, bare, exit codes as read

| gate | exit |
|---|---|
| `npm run test:unit` | 0 — **Test Files 67 passed (67) · Tests 827 passed (827)** |
| `npm run lint:eslint` | 0 |
| `npm run lint` (prettier) | 0 |
| `npm run lint:knip` | 0 |
| `npm run lint:boundary` | 0 |
| `npm run lint:tdz` | 0 |
| `npm run lint:copy` | 0 |
| `npm run lint:live-regions` | 0 |
| `npm run lint:motion` | 0 |
| `npm run lint:sleep` | 0 |
| `npm run typecheck:e2e` | 0 |
| `npm run typecheck:node` | 0 |
| `e2e/device-probe.spec.ts`, scratch config, cured dist, both engines | 0 — **6 passed** |
| `playwright-golden.config.ts` vs cured dist | 0 — 4 passed |
| `playwright-throttle.config.ts` vs cured dist | 0 — 67 passed |
| **`npm run test:e2e:projects`** | **1 — check 6 SPEC MANIFEST** |

The author's own scratch config does not run as banked: `@playwright/test` will not resolve
from `docs/…/8.3/`, `MODULE_NOT_FOUND`. It runs with
`NODE_PATH=<repo>/web/frontend/node_modules` prefixed; copy kept here as `pw-scratch.config.ts`.

## 6 · THE MUST-NOTS, one by one

- **Mechanism.** It READS. Observers, a rAF ticker, a `toBlob` counter that calls straight
  through. Nothing is drawn less: no bake dropped, no boil thinned, no filter removed, no
  transition shortened, no DPR lowered, no cacheKey theme-stripped.
- **REFUSED list, by name.** The nearest row is "a free or stubbed `toBlob` (an attribution
  instrument only)". This is neither free nor stubbed — `nativeToBlob.call(this, wrapped,
  …rest)` runs the real encode and the wrapper only timestamps the completion. Clear.
- **π.** 4/4 goldens and 67/67 built-dist rows, verifier-run, no `--update-snapshots`.
- **filterBudget 9** (file untouched) · **pose count 4**.
- **No header change.** `web/frontend/public/_headers` is not in the diff. The shipped policy
  is `script-src 'self' 'wasm-unsafe-eval'` (line 138) and a content-hashed same-origin chunk
  satisfies it as written. No inline script anywhere in the diff.
- **M19.** No real Safari, no iOS, no `osascript`, no `open -a Safari`, none of
  `run-safari.sh` / `run-sim.sh` / `cpu-attrib.sh` / `matrix.sh`. Grepped the diff and the
  author's evidence for all of them: zero hits. Every number above is a proxy and says so.
- **Honesty of the readout.** WebKit banks `ltSupported false` and `tbt3000Ms`,
  `longtasks3000`, `longestTaskMs`, `busyToBoardReadyMs`, `firstPaintMs` all as the string
  `NOT MEASURED` — never 0. 66 keys. The fold through `A6/summarize-readiness.mjs` prints the
  device rows beside the proxy rows with NOT MEASURED preserved (`fold-proof.md`, last two
  rows).
- **Main tree.** My only writes are this directory. The worktree is untouched and clean.

## 7 · FINDINGS

**F1 — BLOCKING · `web/frontend/scripts/check-pw-projects.mjs:230`.**
`npm run test:e2e:projects` exits **1** on the branch:

    • [6 SPEC MANIFEST] device-probe.spec.ts: on disk, NOT in SPEC_MANIFEST. A new spec is a
      deliberate act — add it here in the same commit, and check its engine coverage while
      you are at it.

Reproduced exactly; checks 1-5, 7, 8 green (listed 241 / chromium live 240 / webkit live 238
against floors 214 / 212). The author defers this to "the chair by track order", but the file
is `web/frontend/scripts/check-pw-projects.mjs` INSIDE the author's own worktree, the fix is
one array entry, and the gate's own message names the same commit as its home. A cure does not
land leaving a repo gate red on a line it is allowed to write. Fix: add
`"device-probe.spec.ts"` to `SPEC_MANIFEST` in the sorted position, in a
`T9-W8 8.3 fix: …` commit, then re-run the gate bare.

**F2 — non-blocking, honesty.** "the word TBT never appears on the readout (asserted in e2e)"
is true only of the uppercase spelling: `device-probe.spec.ts:115` asserts
`expect(shown).not.toContain('TBT')`, while the readout does carry `rafGapProxyTbtMs` and
`tbt3000Ms` as keys. The substantive requirement holds — the proxy is named a proxy before it
is named Tbt, and `tbt3000Ms` is a real longtask TBT that reads `NOT MEASURED` on WebKit — but
the claim should be worded as "the proxy is never called a TBT", not "the word never appears".

**F3 — non-blocking, scope.** The "+0.7 ms, does not perturb" proof (mine: +2.6 ms at n=10) is
a chromium / 4x / desktop-class-host proxy. The probe holds two document-wide subtree
`MutationObserver`s, one of which re-`observe`s every `.board-group` on every childList
mutation; that churn is cheap here and unpriced on the owner's phone. M19 forbids closing it
in session — worth one line in RUNSHEET.md telling the owner that `probeArmedMs` and the armed
arm's cost are the thing to sanity-check on the first device reading.

**F4 — non-blocking, reproducibility.** `playwright-scratch.config.ts` as banked cannot be run
from where it is banked (§5). Add the `NODE_PATH` prefix to its header comment so the next
reader does not lose the minute.

## 8 · WHAT I RAN

`v-noflag.jsonl` · `v-armed.jsonl` · `v-armed2.jsonl` (30 windows total) ·
`v-gated-poses.txt` · `v-canary-anchor.txt` · `v-canary-fail.txt` · `v-goldens.txt` ·
`v-builtdist.txt` · `v-e2e-device-probe.txt` · `v-pw-projects.txt` · `loadavg.txt`.
The jsonl rows are trimmed to the marks quoted above and the rig reports to their GATE D
tables, to hold this directory inside the 40 KiB cap (30.1 KiB). Both preview servers killed;
:4251, :4260, :4390 free at exit.
