# T9-W8 §8.3 — NON-AUTHOR VERIFY, ROUND 2 (the repair round)

2026-09-17 · track `probe` · worktree `.claude/worktrees/w8-probe` · branch `w8/probe`
preSha `9ddc0026` → HEAD `80d61906` · verdict **ACCEPT**

I did not write this cure and I did not write the repair. I read the diff, confirmed the arms,
re-measured on the author's own banked instrument, ran π and the gates bare, and walked the
must-nots. Every number below is mine unless it names whose it is.

## 1 THE DIFF — what the repair actually is

`git diff 9ddc0026..80d61906` is **two files, 23 insertions, 3 deletions**:

| file | what |
|---|---|
| `web/frontend/scripts/check-pw-projects.mjs:235` | one line: `"device-probe.spec.ts",` in `SPEC_MANIFEST`, sorted |
| `web/frontend/e2e/device-probe.spec.ts:113-135` | the readout's honesty row, cut back to what it reads |

Nothing under `src/`. Nothing under `e2e/goldens/`. `public/_headers`, `perf-rig/gates.json`
and `src/pencil/` are untouched across the WHOLE cure (`git diff --name-only 7b0610cc..HEAD`
over those paths returns empty). The mechanism is **instrumentation, gated** — a URL read at the
boot seam and a lazily imported same-origin chunk. It draws NOTHING less: no bake dropped, no
boil thinned, no filter removed, no transition shortened, no DPR lowered, no `cacheKey`
theme-stripped. Checked against the REFUSED list by name: it re-proposes none of the fourteen,
and against REFUTED: it proposes no mechanism at all.

F3 (`evidence/w8/device/RUNSHEET.md`, the `probeArmedMs` section at lines 62-69) and F4
(`playwright-scratch.config.ts`'s `NODE_PATH` header) are on disk and correct, but they are
main-tree docs and so are NOT in commit `80d61906`. See finding V3.

## 2 THE ARMS — confirmed, both ends

```
base  index-9rZPzI5DEcpe.js · md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB
cured index-BRDVCwHoo2FI.js · md5 819e5816db9118d894e85c64451dd9c0 · 44 files / 819.8 KB
served :4251 -> index-9rZPzI5DEcpe.js   :4260 -> index-BRDVCwHoo2FI.js
entry bytes 215,299 -> 215,440 = +141 B raw
```

Both match the author's report exactly. I did not rebuild. The base is the chair's
`58014efd` copy. `dist/assets/devicePaint-DYfALhM0r-4G.js` is 13,835 B and is the ONLY new
file. The entry carries `__probe` and the `mountDeviceProbe` call site and nothing else:
`Speed check`, `data-device-probe` and `probeArmedMs` all read 0 in the entry and 1 in the
chunk. The probe's code is not in the boot bundle.

`sysctl -n vm.loadavg`: noflag set 9.92 -> 20.26 · armed set 19.42 -> 37.20 · final 23.23.

## 3 THE REPAIR'S OWN NUMBER — reproduced

`npm run test:e2e:projects`, run bare, exit read from `$?`:

- **base state**, independently in the prior verifier's banked `verify-r1/v-pw-projects.txt`:
  **exit 1**, `✗ 6 SPEC MANIFEST — 1`, `device-probe.spec.ts: on disk, NOT in SPEC_MANIFEST`,
  34 manifest specs.
- **my run at HEAD**: **exit 0**, all 8 checks green, **35 specs, 553 resolved tests**, the
  23-case self-test still RED-on-known-bad in the same run (`v2-gate-projects.txt`).

**1 -> 0.** The move is deterministic, not statistical, and it is in the direction claimed.
The +1 manifest spec is visible in the header line (34 -> 35).

## 4 THE COST NUMBERS — re-measured, 5/5 interleaved, mine

Regime for every row: **chromium · 4x CPU · link unthrottled · cold (CDP cache-disabled) ·
390x844 · dpr 3**, order `bcbcbcbcbc`, 0 tainted, 0 errored, `readiness-ab.mjs` unmodified
(`--cells mob-cr-4x-unthr-cold --windows 5 --wait 8000`).

### 4.1 A load WITHOUT the flag — the player's load (`v2-noflag.jsonl`)

| mark | base med (range) | cured med (range) | delta | inside spread |
|---|---|---|---|---|
| `resourceCount` | 29 (29-29) | 29 (29-29) | **0** | n/a — exact |
| `transferBytes` | 212,064 (5/5 identical) | 212,124 (5/5 identical) | **+60 B** | n/a — exact |
| `boardReadyMs` | 297.3 (277.8-307.0) | 311.9 (304.6-335.6) | +14.6 | yes, barely (2.4 ms overlap) |
| `firstBoilTickMs` | 2,942.0 (2,815.0-3,068.2) | 2,947.3 (2,823.1-3,071.2) | +5.3 | yes |
| `tbt3000Ms` | 1,097 (979-1,145) | 1,120 (1,023-1,143) | +23 | yes |
| `rafGapProxyTbtMs` | 1,371 (1,236-1,432) | 1,404 (1,274-1,438) | +33 | yes |

**resourceCount 29 = 29 is now the FOURTH independent reading that agrees exactly** (author
round 0, verifier round 1, author fix round 1, me). **transferBytes +60 B reproduces to the
byte for the fourth time.** The claim the cure actually makes — the player's load gains no
request and 60 gzipped bytes — is CONFIRMED.

`boardReadyMs` is the one row worth naming. Mine is the tightest-overlapping of the four
readings. But the sign flips across them (-16.5 / +6.0 / +8.4 / +14.6) and my own ARMED set
reads **-40.6** on the same mark in the same session, so it is host noise on a box carrying
ten lanes at load 20-37. No timing win is claimed and none exists; no timing loss is
demonstrable either. The honest line stays `insideSpread: true`.

### 4.2 A load WITH `?__probe=1` — what the owner's run costs (`v2-armed.jsonl`)

| mark | base med (range) | cured med (range) | delta |
|---|---|---|---|
| `resourceCount` | 29 (29-29) | 30 (30-30) | **+1 request** |
| `transferBytes` | 212,064 | 217,563 | **+5,499 B** |
| `firstBoilTickMs` | 2,952.4 (2,805.4-3,405.7) | 2,943.0 (2,808.6-3,095.0) | -9.4, inside spread |
| `boardReadyMs` | 347.3 (277.3-454.6) | 306.7 (273.7-326.1) | -40.6, inside spread |

+1 request and +5,499 B reproduce EXACTLY against round 0, the verifier and the fix round.
The instrument does not perturb what it measures: `firstBoilTickMs` moves -9.4 here where the
author read +2.0 and round 0 read +0.7 — three signs, one spread.

### 4.3 The classic lies, hunted

- **Arms swapped?** No. `:4251` serves the 43-file base entry, `:4260` the 44-file cured entry;
  the cured arm is the one that gains the request, and only under the flag.
- **Wrong regime?** No. Every row is `mob 390x844 dpr 3 · cpu 4 · net unthrottled ·
  cache cold-disabled · chromium`, read out of the rows themselves.
- **Warm posing as cold?** No. `cache: cold-disabled` in all 20 rows, CDP cache disabled.
- **Masked fallback?** No. The e2e `is inert without the flag` row passes in both engines
  against this dist, and `resourceCount` 29 = 29 proves the chunk is not fetched.
- **Gate piped to tail?** No. Every gate below ran bare, exit from `$?`.

## 5 π IDENTITY — mine

- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4260 npx playwright test --config playwright-golden.config.ts`,
  **no `--update-snapshots`**: **exit 0, 4 passed** (`v2-goldens.txt`).
- `playwright-throttle.config.ts` (the BUILT-dist suite) against the cured arm, both engines:
  **exit 0, 67 passed** (`v2-builtdist.txt`) — wordmark-integrity, theme-bake-freshness and the
  6-row filter census per engine against the built dist are green inside it.
- `filterBudget` **9** (`FILTER_BUDGET_TOTAL` derived; `src/pencil/config/filterBudget.ts` is
  not in the cure's diff at all). Pose count **4**, unchanged.

## 6 GATES — mine, bare, exit codes as read

| gate | exit | note |
|---|---|---|
| `npm run test:unit` | 0 | **Test Files 67 passed (67) · Tests 827 passed (827)** |
| `npm run test:e2e:projects` | 0 | THE REPAIR. 8/8 checks, 35 specs / 553 tests |
| `npm run lint:eslint` | 0 | |
| `npm run lint` | 0 | prettier; `e2e/` never `--write`n |
| `npm run lint:knip` | 0 | the dynamic-only probe chunk is not called dead |
| `npm run lint:boundary` | 0 | |
| `npm run lint:tdz` | 0 | |
| `npm run lint:copy` | 0 | |
| `npm run lint:live-regions` | 0 | |
| `npm run lint:motion` | 0 | `device-probe.spec.ts` keeps its `// PRM: live` head |
| `npm run typecheck:e2e` | 0 | no `.at()` in the diff |
| `npm run typecheck:node` | 0 | |
| `e2e/device-probe.spec.ts`, banked scratch config, cured dist, BOTH engines | 0 | **6 passed** |

The scratch config's F4 header works verbatim: `NODE_PATH=$PWD/node_modules npx playwright test
--config <banked path>` from `web/frontend` resolves and runs.

**F2's assertion is not vacuous.** `prose = shown.split(json).join(' ')` removes the JSON block
from the card text; if it did NOT, `prose` would still carry `rafGapProxyTbtMs` and the
case-insensitive `not.toContain('tbt')` would go red. It passes, and `expect(prose).toContain(
'Speed check')` proves the prose survived the split. The key-set pin `['rafGapProxyTbtMs',
'tbt3000Ms']` holds against a row that also carries `firstToggleBlockingProxyMs` and
`blockingProxyMs` — the proxy names itself before it names Tbt, and nothing else borrows the
word. The readout's own prose says `this engine has no long task census, so every blocking
figure here is a frame gap proxy` (`devicePaint.ts:146`) — plain English, no TBT.

## 7 GATE D — not re-run, and why

`perf-rig/ci-subset.mjs` is not in this fix's diff, so re-running it would measure an unchanged
file. I confirmed the three amendments AT SOURCE instead: the `mobile 390x844 dpr3` pose at
`:176-179`, `ANCHOR_CEILING_MS` applied **per window** as a filter at `:826-829` (not on the
median), and the PROVISIONAL grade-and-print path at `:863-866` / `:984`. `perf-rig/gates.json`
is untouched, so the dpr-3 pose grades nothing by design. See finding V2 on the numbers quoted.

## 8 THE MUST-NOTS, one by one

| must-not | mine |
|---|---|
| MAIN TREE product files | `git status` over `web/frontend/src`, `web/frontend/scripts`, `web/frontend/e2e`, `.github`, `scripts` in the main tree: **empty**. My only writes are this dir. |
| node_modules / pkg symlinks | No `npm install`, `npm ci`, `npm audit fix`, no write under `node_modules` or `csp-solver/wasm/pkg`. Only `npm run <script>`. |
| GIT | I committed nothing and touched no branch. |
| M19 DEVICE | No real Safari, no iOS, no `osascript`, no `open -a Safari`, none of `run-safari.sh` / `run-sim.sh` / `cpu-attrib.sh` / `matrix.sh`. Every number here is a proxy and says so. |
| π | Goldens 4/4 with no `--update-snapshots`; built-dist 67/67; filterBudget 9; pose count 4. |
| NO HEADER CHANGE | `public/_headers` not in `7b0610cc..HEAD`. The chunk is content-hashed, same-origin, `script-src 'self'`; no inline script. |
| NO THRESHOLD RESTAMPED | `perf-rig/gates.json` not in the diff; the dpr-3 pose prints PROVISIONAL. |
| PORTS | 4251 (base) and 4260 (cured) only. Both killed; `lsof` reads 4251, 4260 and 4390 FREE at exit. Never :3000/:3001, never 4230-4249. |
| COPY LAW M16 | The cure adds no user-readable app string. The readout's own prose is plain English. RUNSHEET.md's new section carries no em or en dash. |
| PRETTIER under e2e/ | Never `--write`n; `npm run lint` exit 0 with the spec's hand single quotes. |
| REFUSED / REFUTED | Nothing re-proposed. |

## 9 FINDINGS (all non-blocking)

**V1 — `boardReadyMs` no-flag, my window pair overlaps by 2.4 ms.** Base 297.3 (277.8-307.0)
vs cured 311.9 (304.6-335.6). Not a claimed number and not a claimed direction, and my own
armed set reads -40.6 on the same mark in the same hour, so it is noise on a load-20-to-37 host.
Recorded so the chair is not surprised by a fifth reading that lands the other way.

**V2 — the GATE D row quotes the wrong banked file.** The return's GATE D row says
"verifier-reproduced ... desk 251 ms ... mobile 1,013 ms" and names
`verify-r1/v-gated-poses.txt` first among its instruments. Those two numbers are in
`verify-r1/v-canary-fail.txt`; `v-gated-poses.txt` reads **296 ms desk / 2,040 ms mobile** on
the same amended file. The claim's SUBSTANCE survives every banked run — the dpr-3 pose costs
multiples of the desk pose and grades nothing — but the ratio is **3.9x to 6.9x** across four
runs (247/987, 250/980, 251/1013, 296/2040), not the single "4.0x" the row states. Fix the
citation and give the range at the fold.

**V3 — "all four landed in commit 80d61906" is false for F3 and F4.** The commit is two files.
`RUNSHEET.md` and `playwright-scratch.config.ts` are main-tree docs and cannot be in a worktree
commit; both are on disk and both are correct (I read the `probeArmedMs` section and ran the
`NODE_PATH` invocation verbatim). Say "landed, two in the commit and two in the evidence tree".

**V4 — `RUNSHEET.md` lives at `evidence/w8/device/`, outside `evidence/w8/cures/<id>/`.** The
track's law names the cure dir as the only main-tree write. The charter itself names this
deliverable and the device dir is where the owner's readings go, so it is the right home; the
chair should ratify it rather than let it sit as an unremarked exception.

## 10 VERDICT — ACCEPT

The repair does what it says. Its own number moves 1 -> 0 and the base state is independently
confirmed from the prior round's banked run with the identical failure message. The cost numbers
it re-measured reproduce on my hands to the byte: 29 = 29 requests and +60 B without the flag,
+1 request and +5,499 B with it. π is green, 12 repo gates are green bare, the spec passes 6/6
in both engines against the cured dist, and every must-not holds. The three findings are record
hygiene, not mechanism, and none of them touches a number.

**Held, as the author says: every B1-B6 RED. No device number exists. This instrument is not a
device reading and no proxy here may be quoted as one.**

## Files

`v2-noflag.jsonl` · `v2-armed.jsonl` · `v2-arms.txt` · `loadavg.txt` · `v2-goldens.txt` ·
`v2-builtdist.txt` · `v2-e2e-device-probe.txt` · `v2-gate-unit.txt` · `v2-gate-projects.txt` ·
`v2-gate-lint-*.txt` · `v2-gate-typecheck-*.txt`

Trimmed for the wave's 40 KiB text cap, after every number above was read off the full output:
the two `.jsonl` files keep the 20 fields the marks need and drop the rest of each row (the
regime fields, the taint list and the per-window `load` are all kept); `v2-builtdist.txt` keeps
its result line and its twelve filter-census rows verbatim; `v2-gate-projects.txt` keeps the
matrix, all 8 check lines and the result; `v2-gate-lint-copy.txt` keeps its head and result.
Dir total 33,704 B.
