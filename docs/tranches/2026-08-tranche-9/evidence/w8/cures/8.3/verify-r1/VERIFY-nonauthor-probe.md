# T9-W8 §8.3 — NON-AUTHOR VERIFICATION, track `probe`, round 1 (second reader)

2026-09-18 · worktree `.claude/worktrees/w8-probe` · branch `w8/probe` · HEAD `80d61906`
(the cure `9ddc0026` plus its fix `80d61906`; the author's return names only the first).
Ports: base `4251` = `dist-base`, cured `4260` = `dist`. All files here are prefixed `nv-`
so nothing an earlier reader banked is disturbed.

Host load, `sysctl -n vm.loadavg`: start `{ 77.40 34.75 41.21 }`, end `{ 135.52 164.42
112.58 }`. Up to ten sibling lanes were measuring throughout. Every absolute timing below is
therefore two to three times the author's; the interleaved design is what makes the
comparison survive that, and the deterministic marks (`resourceCount`, `transferBytes`)
survive it outright.

## 1 · The arms, at both ends and at the wire

    dist-base  index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB
    dist       index-BRDVCwHoo2FI.js · index.html md5 819e5816db9118d894e85c64451dd9c0 · 44 files / 819.8 KB

Both match the author's report. `curl` of each preview root returns exactly those md5s, so
the arm on the wire is the arm on disk. `dist` carries no build newer than the fix commit,
and the fix touched only `e2e/` and `scripts/`, neither of which is bundled.

Chunk graph, checked rather than taken: `dist/assets/devicePaint-DYfALhM0r-4G.js` is 13,835 B
and is named nowhere but the entry chunk; `index.html` differs from the base arm's in the
entry hash and in nothing else (no `modulepreload` for the probe); `grep -rl __probe dist-base`
returns nothing. Entry chunk 215,299 B → 215,440 B, +141 B raw.

## 2 · The numbers, re-measured (nv-noflag.jsonl, nv-armed.jsonl)

chromium · 4x CPU · link unthrottled · cold (CDP cache-disabled) · 390x844 · dpr 3 ·
cell `mob-cr-4x-unthr-cold` · 5 windows per arm, interleaved b,c,b,c · 0 tainted, 0 errored.

| mark | base | cured | mine | author |
|---|---|---|---|---|
| resourceCount, no flag | 29 (5/5) | 29 (5/5) | 0 | 0 — AGREES |
| transferBytes, no flag | 212,064 (5/5) | 212,124 (5/5) | +60 B | +60 B — AGREES |
| resourceCount, `?__probe=1` | 29 (5/5) | 30 (5/5) | +1 | +1 — AGREES |
| transferBytes, `?__probe=1` | 212,064 | 217,563 | +5,499 B | +5,499 B — AGREES |
| boardReadyMs, no flag | 723.8 | 746.4 | +22.6 | -16.5 — both inside spread |
| firstBoilTickMs, no flag | 5,255.0 | 4,853.7 | -401 | -4.5 — both inside spread |
| tbt3000Ms, no flag | 2,229 | 2,058 | -171 | -29 — both inside spread |
| rafGapProxyTbtMs, no flag | 2,290 | 2,199 | -91 | -27 — both inside spread |
| firstBoilTickMs, armed | 5,763.9 | 5,147.6 | -616 | +0.7 — both inside spread |

The four deterministic figures reproduce to the byte. The timing deltas sign-flip between
the author's run and mine and are smaller than the within-arm spread in both (base boil
4,105-5,547 against cured 4,205-6,174), which is the claim the cure actually makes: the
player's boot does not move, and the instrument does not perturb what it measures. No swap,
no regime switch, no warm cache posing as cold: every row carries `cache: "cold-disabled"`,
`vp: "mob"`, `cpu: 4`, and the base arm ignores `?__probe=1` because it has no probe.

## 3 · GATE D's three amendments, re-run

- **Amendment 1** (`nv-gated-poses.txt`, `--runs 1 --engines chromium`, exit 0): two rows.
  `desk 1440x900 dpr1` graded 1,304 ms against 1,750 PASS; `mobile 390x844 dpr3` 2,366 ms
  `(unstamped) PROVISIONAL`, gating nothing, with the printed reason. The mechanism
  reproduces. The MAGNITUDE does not: mine is +1,062 ms / 1.81x where the author banked
  +740 ms / 4.0x, both n=1 and on hosts an order of magnitude apart in load. See finding F2.
- **Amendment 2** (`nv-canary-anchor.txt`, `--runs 3 --boot-poses desk --canary-anchor 900`,
  exit 0): anchors 132, 192, 900; the 900 ms window is dropped BY NAME (`dropped 900ms`),
  2 windows grade, and the counterfactual prints from the same data ("the OLD median rule
  would have graded 848ms over 3 window(s) INCLUDING the blown one").
- **Amendment 3** (`nv-canary-fail-AMENDED.txt`, `--canary-fail chromium`, exit 3): the
  engine's idle verdict still dies (`NOT MEASURED [chromium]`), the exit code is still 3, and
  the two measured boot windows are graded instead of discarded. The pre-amendment behaviour
  is plain in the diff (both instrument-failure branches `continue`d without pushing a
  result, so `bootLines` never reached the GATE D table); I read it there rather than running
  the old binary out of the worktree.

Note, not a defect: a breach found in those newly graded windows outranks the instrument
failure and returns 1 instead of 3. That precedence is this file's own standing ruling ("A
breach outranks everything"), unchanged by the cure. No npm script and no workflow invokes
`ci-subset.mjs`, so the doubled boot loads cost CI nothing (O-12).

## 4 · pi identity

- Goldens 4/4 PASS against the cured preview, `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4260
  npx playwright test --config playwright-golden.config.ts`, exit 0, no `--update-snapshots`.
- Built-dist suite `playwright-throttle.config.ts` against the cured preview: **67 passed**,
  exit 0, both engines — filter-census (the exact-match allowlist over the built dist),
  wordmark-integrity and theme-bake-freshness over the baked pose bitmaps, theme-quadrants,
  throttled-void.
- `src/pencil/config/filterBudget.ts` untouched (budget 9); `pencilConfig.ts` `frameCount: 4`
  untouched. The whole `src/` diff is `main.ts` (+12) and three new files under `src/probe/`.

## 5 · Gates, bare, with exit codes

`test:unit` 0 (Test Files 67 passed (67) · Tests 827 passed (827)) · `lint:eslint` 0 ·
`lint` 0 · `lint:knip` 0 · `lint:boundary` 0 · `lint:tdz` 0 · `lint:copy` 0 ·
`lint:live-regions` 0 · `lint:motion` 0 · `typecheck:e2e` 0 · `typecheck:node` 0 ·
`test:e2e:projects` **0** (the author's one non-green; the fix commit closed it — 35 specs,
553 resolved tests) · `e2e/device-probe.spec.ts` both engines through the banked scratch
config against the cured dist: **6 passed**, exit 0.

`lint:copy` does police this cure: `src/probe/` is in no ALLOW entry of
`scripts/check-copy-register.mjs`, and an independent scan finds 0 em or en dashes in any of
the 157 string literals in the two probe sources.

## 6 · The must-nots

Nothing draws less: the diff adds observers, a readout and a rig pose, and removes no bake,
boil, filter or transition. Nothing on the REFUSED list appears by name or in effect.
`public/_headers` untouched; the probe is a content-hashed same-origin chunk, so
`script-src 'self'` holds as written. filterBudget 9, pose count 4. M19 honoured: every
number here is chromium or WebKit through Playwright and says so; no `osascript`, no
`open -a Safari`, none of `run-safari.sh` / `run-sim.sh` / `cpu-attrib.sh` / `matrix.sh`, no
simulator. The main tree has no tracked modification.

Instrument shape, captured myself at 390x844 dpr 3 against the cured dist
(`nv-probe-row-cr.jsonl`, `nv-probe-row-wk.jsonl`): 66 keys each. WebKit reports
`ltSupported false` and the words NOT MEASURED for `firstPaintMs`, `tbt3000Ms`,
`longtasks3000`, `longestTaskMs`, `busyToBoardReadyMs` — never a 0 — while
`rafGapProxyTbtMs` is a number and the notes line calls it a proxy. Chromium fills every
mark. Both runs read `firstToggleBakes 8` and WebKit `woff2Requests 7`, the figures G1 and
C07 already hold, which is the instrument agreeing with the wave's own census.

## Findings

- **F1 (bookkeeping).** The author's return names `commitShas: ["9ddc0026"]` and reports
  `test:e2e:projects` exit 1. HEAD is `80d61906`, which closes that gate and amends the e2e
  row. The return is stale against the branch it describes; the record should carry both
  commits.
- **F2 (honesty, amendment 1's number).** `perf-rig/README.md:79` and the return quote
  "247 ms vs 987 ms, 4.0x" from one window per pose. I read 1,304 vs 2,366 (1.81x) on the
  same binary. The pose gap is real and directional in both, but the ratio is host-bound at
  n=1 and should not be quoted as a measured attribution; the charter's own 221 / 1,020
  figures from ATTRIBUTION §5 are the ones with provenance. Costs nothing at the gate: the
  mobile row is PROVISIONAL and grades nothing.
- **F3 (note only).** `devicePaint.ts`'s local `median` takes the lower middle of an even
  list (`s[(s.length - 1) >> 1]`). With the run sheet's four taps the later-tap list is odd
  and the value is exact; a run sheet asking for an even count would read low by half a step.
