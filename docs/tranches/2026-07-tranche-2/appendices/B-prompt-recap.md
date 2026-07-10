# Appendix B — Prompt-recap coverage matrix (both campaigns)

The L22 master matrix (verify-22 grade A; 29-completeness Part A: no mandate clause orphaned — 27/27 wave-commit hashes real), re-stated with every tranche-II row now carrying its wave. **Status vocabulary**: ADDRESSED (landed commit) / IN-FLIGHT (process) / SPECIFIED→wave (this tranche discharges it).

## 1. Campaign 1 (Grand Uplift) — ADDRESSED, complete

Execution complete 2026-07-06; every R/M/D/G/C mandate, all 8 OD decisions, the 2026-07-04 ratifications, and the 2026-07-05 colocation edict verified as landed commits (L22 §1–2, wave→commit map W0=`6c547e34`… W13=`dc5bd4c4`, deploy `d43fae28`, logo/type `8913023e`). Nothing from campaign 1 is unaccounted for.

**Three campaign-1 dispositions the owner has since REVERSED** (the record W7 writes):

| Reversal | Was | Now |
|---|---|---|
| R4 inline-tests | HELD (2 inline exceptions blessed by W13) | **REVOKED** — tests never inline → **T2-W3** migrates both modules |
| D2 CLAUDE.md | ADDRESSED (rewritten pithy) | **SUPERSEDED** — removal + fold → **T2-W7** |
| N9 repo split | re-booked "next tranche" | **VOID** — the demo stays; de-booked → **T2-W7** records; appendix C L25-10 |

Plus: **R9 (2026-07-09)** retires the never-push-csp-solver-origin order (0.2.0 published from here; identity current); **bbnf-lang's own never-push STANDS** (T2-W3's sync is LOCAL-ONLY).

## 2. Campaign 2, class A — concrete asks already executed

| Ask | Disposition | Where |
|---|---|---|
| Logo → game-selector (wordmark IS the picker) | **ADDRESSED** | `8913023e`; certified gate-final (board SSIM 1.000000) |
| Golden √φ typography (31 `--type-*` tokens, 39 sites) | **ADDRESSED** | `8913023e` |
| @mbabb attribution fix | **ADDRESSED** | `8913023e` |
| Dev server + deploy (CF Pages cutover) | **ADDRESSED** | `d43fae28` |
| Fable-for-design directive (2026-07-07) | **IN-FLIGHT** (process) | binds all design lanes; Q8/verify-P3-P4 ran under it |
| Residual D-size-token (logo heights off-token) | **SPECIFIED** | → **T2-W5** H4 (ladder-bind; closes L25-49 as re-based by verify-25) |
| Residual D1 (CDN fonts not closed) | **SPECIFIED** | → **T2-W5** (P5 self-host; CSP drops both font hosts) |

## 3. Campaign 2, class B — the nine binding constraints → waves

| # | Constraint | Disposition → wave |
|---|---|---|
| T2-1 | Demo stays; repo split DEAD | **VOID recorded** → W7 (de-booking); no code work |
| T2-2 | Server abrogation IFF parity + perf; py/ KEPT | **CONDITION MET, R1 ratified** → **W2** (execution), W1 (py toolchain), evidence D1–D3 |
| T2-3 | Tests never inline | → **W3** (error.rs + generate.rs migration, verify-08-compiled) |
| T2-4 | ALL CLAUDE.md + meta docs removed | **R2: fold-not-delete + MIT** → **W7** |
| T2-5 | Most-modern Rust/wasm; legacy interrogated | → **W1** (stable pin, MSRV 1.88, PyO3 0.29, Node 24, Vite 8, TS 6.0.3) + **W3** (substrate excision @0.3.0, R4) |
| T2-6 | Interrogate examples/ benches/ data/ | → **W3** (fc_chrono excise, sweep-variant, iai-CI per P6, baseline discipline) + **W4** (bank reshape per P1/P2; N=5 kill per R1) + W0 (gac_ab_corpus honesty) |
| T2-7 | Docker removed IFF server goes | **fires with R1** → **W2** (compose trio, both Dockerfiles, .dockerignore, nginx/, deploy.sh, dev.sh reduction) |
| T2-8 | UI affordances / mobile / glass gaps / KISS; pencil-boil in scope | → **W5** (mobile, hardening slate, glass pure-math vendor, pencil-boil 0.7.0, grain-hoist) + **W6** (the R3 bound order 1–8) |
| T2-9 | Fold ALL deferred; recap ALL prompts; precepts; grounded | → this appendix (recap) + **appendix C** (58+1 items, every row homed) + the measurement discipline running through every gate; precepts upstream flag → W7 |

**Process directives** (32-agent passes, Fable orchestrates/designs, Opus/Sonnet fanout, 3-wide batches): IN-FLIGHT — this campaign executed under them (33 + 40 + 7 + 13 lanes).

## 4. The 2026-07-09 ratifications — discharge map

| R | Discharged by |
|---|---|
| R1 full abrogation (+ N=5 kill, box decommission, apiError split, tests-py rehome) | W2 (execution) + W4 (embed) |
| R2 fold + MIT | W7 |
| R3 affordances + hardening ten | W6 + W5 (the four verify-33 amendment clauses ride the one owner line — README §4) |
| R4 substrate @0.3.0 | W3 |
| R5 worktree purge + java branch | owner-side, booked with W0's hygiene beat window |
| R6 e2e into CI | W0 |
| R7 stable pin | W1 |
| R8 keyframes.js excision | W5 |
| R9 never-push retirement | W7 (record only) |

Nothing in either campaign's ask-set lacks a row above; the tranche-1 claim "nothing unaccounted" holds against `git log`, and the tranche-2 requirement set is exactly the SPECIFIED column (L22 §5, verified).
