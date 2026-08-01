# T5-W6 — WAVE RECORD (team-lead seal, 2026-08-01)

Three lanes, all complete, all gates banked in this directory.

| Row | State | Gate bank |
|---|---|---|
| 6.1 precepts file | **LANDED** at `docs/tranches/PRECEPTS.md` — the W0-seal submodule ruling executed (docs/precepts/ is a `160000` submodule of mkbabb/precepts @ `8781ebb0`; the deviation-with-rationale heads the file) | `precepts-coverage.txt` (every §10 friction row mapped), `precepts-leak-grep.txt` (consumer surfaces zero-reference) |
| 6.2 gated-chain laws mechanized | **LANDED**: `scripts/ci-conclusion.sh` (SHA-pinned run resolution, conclusion read in its own invocation, artifact out) + `scripts/deploy-gated.sh` (refuses without a fresh HEAD-matching success artifact; wrangler line moved verbatim; deploy stays owner-authorized per-deploy) + `package.json scripts.deploy` rewired to the wrapper | `deploy-gate-canary-RED.txt` (both refusal arms, no wrangler reached), `deploy-gate-dry-GREEN.txt` |
| 6.3 background rig | **BALLOT dispatched at W5-open** (W6.3 = ballot 5); the headless-only default stands WRITTEN as a precept row with its flip-on-grant re-entry note | PRECEPTS.md §rig row |
| 6.4 cron hygiene | **RECORDED**: the 52-replay loop documented; the T5 heartbeat cron (id `1bc8d5b2`, `17,52 * * * *`) quoted verbatim as the cure's shape — names the live-state file, self-acks in flight, carries its own deletion clause | `cron-hygiene.md` |
| 6.5 instrument laws → precepts | **LANDED** (state-pinning, interleaved-or-quiesced, evidence-not-exemption, a-settle-is-polled, quiet-window, mint-from-runner, sun-crest floors, deploy-standalone/SHA-pin/field-conclusions, npm≥11, trap→config) | PRECEPTS.md + `precepts-coverage.txt` |
| 6.6 the living ledger | **SEEDED**: `docs/tranches/LEDGER.md` — all 61 CH rows one line each (terminal or open-with-trigger), the 7 PR orphans homed, U-01…U-11 + S-01…S-11 with T5 homes | **`node scripts/ledger-diff.mjs --require-ledger` → GREEN, 220/220, exit 0 — re-run by the team lead in their own tool result.** W5's closeCondition is MET; WGATE re-runs it at close |

Gate spine verdict: precepts grep banked · mechanized-deploy canary banked (nonzero without artifact, no deploy executed) · ledger-diff exit 0 with the ledger required. The wave's DAG condition (after W5 ratifies) was met at the tranche open; 6.3/6.4 owner-paced halves are default-terminal at WGATE per their ballots.
