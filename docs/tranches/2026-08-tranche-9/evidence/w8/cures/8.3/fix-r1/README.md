# T9-W8 §8.3 — REPAIR ROUND 1 · track "probe"

Verdict under repair: **REPAIR** (`../verify-r1/VERIFY.md`, non-author verifier, HEAD `9ddc0026`).
Mechanism, π and every load-cost number were confirmed there; one blocking finding and three
non-blocking ones. All four are addressed below. Nothing about the instrument's mechanism
changed and no threshold was stamped.

## The four findings, and what landed

| # | finding | what landed |
|---|---|---|
| **F1** | BLOCKING. `npm run test:e2e:projects` exits 1: `device-probe.spec.ts: on disk, NOT in SPEC_MANIFEST`. The file is inside this worktree and the gate's own message names the same commit as its home; deferring it to the chair left a repo gate red on a line the author was allowed to write. | `"device-probe.spec.ts"` added to `SPEC_MANIFEST` in `web/frontend/scripts/check-pw-projects.mjs`, in sorted position between `board-covisibility` and `drawer`. **Gate now exit 0**, all 8 checks green, 35 specs / 553 resolved tests (`pw-projects.txt`). No holdout row is owed: the spec runs in both engines and declares no skip. |
| **F2** | Honesty. "the word TBT never appears on the readout" was true only of the uppercase spelling; `device-probe.spec.ts:115` asserted `not.toContain('TBT')` over the whole card, and the JSON block inside it carries `rafGapProxyTbtMs` / `tbt3000Ms` as key names. | The assertion now reads what the law actually is. The card's text minus its JSON block is asserted case-insensitively to contain no `tbt` at all, and the row's tbt-spelling keys are pinned to the closed pair `['rafGapProxyTbtMs','tbt3000Ms']` — the proxy names itself a proxy before it names Tbt, and `tbt3000Ms` is the real long task census, NOT MEASURED where the engine has none. The claim is reworded the same way in `../README.md`. |
| **F3** | Scope. The "does not perturb" proof is a chromium / desktop-host proxy; the probe's two document-wide `MutationObserver`s are unpriced on the phone. | One plain-English section in `evidence/w8/device/RUNSHEET.md`: find `probeArmedMs` on the first line you paste, it lands 80 to 122 ms in a laptop browser (the two banked captures), and say so if the phone reads much higher. Banked as the owner's own sanity check, never as a measurement. M19 still forbids closing it in session. |
| **F4** | Reproducibility. The banked scratch config cannot be run from where it is banked (`MODULE_NOT_FOUND`: `@playwright/test` does not resolve under `docs/`). | The exact `NODE_PATH=$PWD/node_modules` invocation, plus the preview command it needs, written into `playwright-scratch.config.ts`'s own header. Used verbatim to produce `e2e-device-probe.txt` below. |

## The arms did not move — the fix cannot reach the bundle

Only two files changed, neither of them bundled: a gate script and an e2e spec.

    before the fix  base   index-9rZPzI5DEcpe.js · md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB
                    cured  index-BRDVCwHoo2FI.js · md5 819e5816db9118d894e85c64451dd9c0 · 44 files / 819.8 KB
    rebuilt after   cured  index-BRDVCwHoo2FI.js · md5 819e5816db9118d894e85c64451dd9c0 · 44 files / 819.8 KB
                    base   index-9rZPzI5DEcpe.js · md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB

`npm run build` re-run after the fix reproduces the cured entry hash and the index md5 exactly,
so the artifact every round-0 number was taken on is the artifact the fix ships. Served bundles
curl-verified from :4251 and :4260 before measuring.

## Re-measured anyway — chromium · 4x CPU · link unthrottled · cold (CDP cache-disabled) · 390x844 · dpr 3

`../readiness-ab.mjs` unmodified, `--cells mob-cr-4x-unthr-cold --windows 5 --wait 8000`,
interleaved b,c,b,c. 0 tainted, 0 errored in both sets. Host load `{ 15.74 26.00 20.34 }` at the
start, `{ 22.21 23.57 20.46 }` at the end — up to ten sibling lanes on this box, which is why
the timing spreads below are wider than round 0's and why only the deterministic marks are
quoted as moves.

A load WITHOUT the flag (the player's load) — `fix-noflag.jsonl`:

| mark | base (median, n=5) | cured (median, n=5) | delta | round 0 | verifier |
|---|---|---|---|---|---|
| resourceCount | **29** (29-29) | **29** (29-29) | **0** | 0 | 0 |
| transferBytes | **212,064** (5/5) | **212,124** (5/5) | **+60 B** | +60 B | +60 B |
| boardReadyMs | 294.9 (268.1-385.0) | 303.3 (278.2-388.2) | +8.4, inside spread | -16.5 | +6.0 |
| firstBoilTickMs (B1) | 2,820.6 (2,807.9-3,583.8) | 2,944.7 (2,810.8-3,465.8) | +124, inside spread | -4.5 | +6.0 |
| tbt3000Ms | 1,022 (969-1,580) | 1,037 (1,010-1,469) | +15, inside spread | -29 | +10 |
| rafGapProxyTbtMs (PROXY) | 1,283 (1,193-1,971) | 1,302 (1,252-1,820) | +19, inside spread | -27 | +7 |

A load WITH `?__probe=1` (what the owner's run costs) — `fix-armed.jsonl`:

| mark | base (n=5) | cured (n=5) | delta |
|---|---|---|---|
| resourceCount | **29** (5/5) | **30** (5/5) | **+1 request** |
| transferBytes | **212,064** (5/5) | **217,563** (5/5) | **+5,499 B** on the wire |
| firstBoilTickMs | 2,948.0 | 2,950.0 | +2.0, inside spread |

The two deterministic marks reproduce to the byte for the third independent time (author round 0,
verifier, this round). The timing deltas sign-flip across all three readings, which is the
honest reading of `insideSpread: true`: no timing win was ever claimed and none exists. The
armed `firstBoilTickMs` cost lands +2.0 ms here against the verifier's pooled +2.6 ms at n=10.

## π, verifier-run then re-run here

| check | exit |
|---|---|
| `playwright-golden.config.ts` vs `PLAYWRIGHT_BASE_URL=:4260`, no `--update-snapshots` | 0 — 4 passed (`goldens.txt`) |
| `playwright-throttle.config.ts` vs :4260, both engines (built dist, filter census inside it) | 0 — 67 passed (`builtdist.txt`) |
| `src/pencil/config/filterBudget.ts` | not in the diff; total 9 |
| pose count 4 · no bake dropped · no boil thinned · no filter removed · no transition shortened | nothing under `src/` is in this fix's diff at all |

## Gates, bare, exit codes as read (`gates.txt`, one file per gate)

    test:unit           0   Test Files 67 passed (67) · Tests 827 passed (827)
    lint:eslint         0
    lint                0
    lint:knip           0
    lint:boundary       0
    lint:tdz            0
    lint:copy           0
    lint:live-regions   0
    lint:motion         0
    lint:sleep          0
    typecheck:e2e       0
    typecheck:node      0
    test:e2e:projects   0   <- was 1; F1
    device-probe.spec.ts, scratch config, cured dist, both engines   0 — 6 passed

GATE D's three amendments are untouched by this fix (`perf-rig/ci-subset.mjs` is not in the
diff) and were reproduced at the real site by the verifier: desk 251 ms PASS vs mobile 1,013 ms
PROVISIONAL, the canary-anchor window dropped by name, and two boot windows graded before the
instrument-failure exit 3. Not re-run here; re-running them would have measured the same file.

## What is still held

Every B1-B6 RED. No device number exists: the wave's budgets close on the owner's own reading
through this instrument, on the phone, against a deployed edge that does not yet carry the
probe. Nothing in this directory is a Safari number or an iOS claim.

Both preview servers killed; :4251, :4260 free at exit. Load at exit `{ 24.99 24.52 21.21 }`.
