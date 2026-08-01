# T5-W1 — GATES THAT CAN FAIL

Every enforcement the audit found absent, unwired, or scope-narrowed becomes a gate that demonstrably fails for its defect. The born-RED law governs: where the defect is live at HEAD, the gate's first recorded run is RED; where the defect is absence-of-gate, the gate lands with a canary proving it can fail.

**Charter**: FAM-A entire, FAM-B entire, B1's narrowed repair, CH-41/42/56, the security rows (CH-37), C5. Evidence: `r1/gate-soundness.md` (39 gate rows), `r2/verify-gate-criticals.md`, `r3/security-posture.md`, `r3/goldens-estate.md`.

## Rows

| # | Row | Source | Gate |
|---|---|---|---|
| 1.1 | **The FE unit lane joins CI** — `vitest run` as its own job (332 blocks/31 files); count-floor assertion (≥300 executed) so silent exclusion cannot green | A1 CONFIRMED | Canary: one deliberately-failing test on a branch proves the lane reds; then the floor. First run against HEAD is green-with-proof (the defect was absence) |
| 1.2 | **The perf rig lands in-tree + gates.json gets an executor** — the P1 rig scripts (run-safari.sh, sim-matrix.sh, cpu-attrib.sh, probe.js) enter `web/frontend/perf-rig/`; a CI-runnable headless subset (idle fps + long-frame census on the built dist, chromium+webkit) reads gates.json thresholds; the full Safari matrix stays a documented manual lane with its invocation + banked-run-id discipline | A2 CONFIRMED | **Born RED via threshold canary** (gate run with idle≥200 proves failure fires), then real thresholds; the manual lane's first run-id banked at W-GATE |
| 1.3 | **EVIDENCE-POLICY enforcement built** — `scripts/check-evidence-policy.mjs`: per-image ≤150KB, per-wave ≤2MB, `-full.png` name ban, wired to CI; T4's 31 breaching images + 3 breaching waves adjudicated once (crop-or-grandfather table recorded in the wave record; grandfathered paths listed IN the script, additions forbidden) | A3 CONFIRMED-worse | **Born RED at HEAD** (31 live breaches), green after the adjudicated prune/grandfather |
| 1.4 | **Boundary law 20/20** — the ESLint cross-game rule generated from the game list (no hand enumeration); thermo/killer/kenken's live imports from `@games/futoshiki` are broken by W2's estate moves (dependency: 1.4 gates AFTER W2's landing) — the rule lands here, RED, and W2 turns it green | A4 + E5 | **Born RED at HEAD** (live violations cited in census #3) |
| 1.5 | cargo-audit gains `schedule:` (daily) + the advisory-tripwire posture documented | A5 | Config-present gate; first scheduled run-id banked |
| 1.6 | **Wordmark spec repair** — the edge-clip assertion hoisted OUT of the linux skip; the theme-bake residual guard widened 1/5→5/5 labels; `retries:1` policy: `failOnFlakyTests` on where retries exist, or retries:0 with the flake-class documented | B1 NARROWED | **Born RED via forced-blank canary** re-run (the 71456713 ablation harness, both arms) proving the clip assertion now runs on linux |
| 1.7 | Doc-truth gate joins CI (`check-doc-truth.mjs` from W0.2 as a lane; re-derivation not pinning — toolchain-drift tolerant) | B2, C-family cure | Born RED pre-W0-merge in the wave branch, green at W0's landing |
| 1.8 | **Dependabot #68 sharp + #69 postcss remediated** per r3 security paths; dashboard zero-open at gate | CH-37 | RED now (two open highs), green = `gh api` zero open |
| 1.9 | `lint:ink` runner run-id banked (CH-41); **CH-42 gets a MAGNITUDE instrument, not n-runs** (r3/goldens-estate: pooled 23.9% red, 51/67 observations carry no magnitude; CI n-run sampling is a NULL instrument under the blind band): `--repeat-each=25` × workers {1,4} + the ~25-line magnitude probe, decision rule fixed BEFORE the runs, no re-baseline in any branch | CH-41/42, r3/goldens | The instrument's first sample + pre-registered decision rule banked; the decision executes in W5 |
| 1.13 | **Goldens-estate hardening** (r3/goldens-estate): `check-golden-bytes.mjs` gates `totalBytes` (currently summed, never gated) + orphan/pairing/decode checks; the 4 gitignored webkit-darwin shadow fossils deleted; **the BLIND BAND decided** — darwin floor 0.017 < observed drift 0.03 < linux 0.05 on ubuntu-only CI means both clause-relaxed goldens are blind on the only platform CI runs: the wave decides (webkit-golden arm, a magnitude-report step, or documented-accepted) with the sun-crest clause's authority cited; the goldens' chromium-only engine pin argued or widened | r3/goldens | Born RED: totalBytes-gate + fossil-grep fail at HEAD |
| 1.14 | **Coverage instrument lands BEFORE the distill** (completeness GAP-6): vitest coverage wired; a recorded baseline on the five-game estate; W2's collapsed modules carry a floor ≥ baseline | GAP-6 | Instrument-present gate + baseline banked; the floor gates W2's exit |
| 1.15 | `npm audit` lane joins CI (completeness + security: brace-expansion HIGH invisible to dependabot — divergence UNKNOWN, adjudicated here); COOP/CORP headers added (free); `style-src 'unsafe-inline'` → W5 BALLOT accepted-limitation w/ the CF-Pages-static nonce rationale | r3/security | Born RED: `npm audit --audit-level=high` fails at HEAD (brace-expansion) |
| 1.10 | PW engine residue (CH-56): a webkit arm for `mobile-*` where the API allows; `share-truth`'s exclusion documented on the config line | CH-56 | Project-list assertion in CI (config-lint) |
| 1.11 | **Support floor declared** (C5): browserslist (or the vite target block) states the floor; the two Safari<14 shims die against it (J3's residue); floor cited by README | C5, J3 | Born RED: shim-grep fails while shims live; green after their one-commit removal with the floor in place |
| 1.12 | I3 cure: `exports` map added to the wasm pkg build (wasm-pack postprocess) covering the `_bg.wasm?url` subpath; the regen gated by the existing byte-band lane | I3 NARROWED | `npm publish --dry-run` resolution check in CI (no actual publish) |

## π / DELTA
1.6's canary bitmaps (blank + inked-clip arms) land as ≤150KB crops under 1.3's own policy gate — the wave eats its own cooking.

## DAG
After W0 (needs 0.2's script). 1.4 lands RED here, greens at W2's close. 1.2's manual-lane bank lands at W-GATE.
