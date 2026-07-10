# A2 — Prompt-recap verification against the landed tree

**Instrument:** `docs/tranches/2026-07-tranche-2/appendices/B-prompt-recap.md`
**Tree state:** HEAD = `3b75eca2` (`T2-WGATE`); working tree CLEAN (`git status --short` → 0). The large uncommitted diff shown in the session-start snapshot was pre-landing; it is fully committed now.
**Wave→commit map (all real):** W0 `7c245bed`, W1 `5f9980c8`, W2 `98fe2562`, W3 `ed07ba6b` (+fixup `260bfe0f`), W4 `22514bae` (+fixup `54aa94a5`), W5 `49506bf8`, W6 `b36b7b9f`, W7 `ede25188`, W8 `c14995eb`, WGATE `3b75eca2`.

**Verdict: every recap row that claims a landed commit is corroborated in-tree. No execution is missing at the code level. The single genuinely-outstanding item (R5 worktree purge) is one the recap itself books owner-side, so it is not a recap defect.** Four precision notes below.

## §3 — the nine class-B constraints (T2-1…T2-9)

| # | Recap claim | Verified at HEAD | Evidence |
|---|---|---|---|
| T2-1 | Demo stays; repo split VOID → W7, no code | Confirmed — repo intact, single monorepo | (record-only; consistent) |
| T2-2 | Server abrogation, py/ KEPT → W2 | Confirmed — `web/api` GONE (only `web/frontend` remains); `csp-solver/src/py/` KEPT (mod.rs, sudoku_api.rs, futoshiki_api.rs, errors.rs, …) | `ls web/` → `frontend`; `ls csp-solver/src/py` |
| T2-3 | Tests never inline → W3 (error.rs + generate.rs) | Confirmed — zero `#[cfg(test)]` in `src/error.rs` and `src/puzzles/sudoku/generate.rs`; rehomed to `tests/error.rs`, `tests/sudoku_generate.rs` | `grep cfg(test)` empty; `ls csp-solver/tests/` |
| T2-4 | ALL CLAUDE.md removed, R2 fold+MIT → W7 | Confirmed — no live `CLAUDE.md` anywhere (only stale copies in `target/package/csp-solver-0.{1,2}.0/`); READMEs at root, `csp-solver/`, `web/frontend/`; MIT `## License` in README | `find … -name CLAUDE.md`; `ls README.md …` |
| T2-5 | SOTA Rust/wasm; substrate excise @0.3.0 → W1+W3 | Confirmed — `channel="stable"` in rust-toolchain.toml; csp-solver `version="0.3.0"`; PyO3 `0.29`; Vite `^8.1.4`; TS `~6.0.3`; Node `'24'` in CI | `Cargo.toml`, `rust-toolchain.toml`, `package.json`, `ci.yml:349,402` |
| T2-6 | Interrogate examples/benches/data → W3+W4+W0 (fc_chrono excise, N=5 kill, iai) | Confirmed w/ scope note — sudoku fc_chrono excised (`benches/sudoku.rs:125`); N=5 killed (`generate.rs:110,129-133` locked N=5 policy); iai lane live (`benches/iai_queens.rs`, `ci.yml:456`) | see Precision Note 2 |
| T2-7 | Docker removed IFF server → W2 | Confirmed — no `docker-compose*.yml`, no `Dockerfile*`, no `web/nginx/`; `scripts/` reduced to `dev.sh` only (deploy.sh gone) | `ls docker-compose*` no matches; `ls scripts/` → `dev.sh` |
| T2-8 | UI affordances/mobile/glass/KISS; pencil-boil → W5+W6 | Confirmed — `@mkbabb/pencil-boil` `^0.7.0`; fonts self-hosted; affordances landed W6 (`b36b7b9f`) | `package.json`; `index.css` @font-face |
| T2-9 | Fold ALL deferred; recap; precepts → this appendix + appendix C | Confirmed — appendix C present (127 lines), D-convergence present | `ls appendices/` |

## §4 — the nine 2026-07-09 ratifications

| R | Recap discharge | Verified |
|---|---|---|
| R1 full abrogation (+N=5 kill, box decommission, apiError split, tests-py rehome) | W2+W4 | Confirmed — server gone; N=5 killed; python tests rehomed to `csp-solver/tests-py/` (test_rust_backend.py, test_panic_contract.py, test_wheel_contracts.py, test_bench_compare.py) |
| R2 fold + MIT | W7 | Confirmed (see T2-4) |
| R3 affordances + hardening ten | W6+W5 | Confirmed — W6 `b36b7b9f` "affordances — the bound order". See Precision Note 3 on the README §4 pointer |
| R4 substrate @0.3.0 | W3 | Confirmed — `soft.rs`, `heuristic.rs`, `nogoods.rs`, `restart.rs` all absent; version 0.3.0 |
| R5 worktree purge + java branch | owner-side, booked W0 window | **STILL OUTSTANDING** — `.claude/worktrees/` holds many live worktrees (agent-a9702…, wf_0c754e24-*, wf_34cf008e-*, wf_8f3bd831-*). Recap correctly labels it owner-side/booked, so not a recap defect, but it is an open action tranche-III inherits |
| R6 e2e into CI | W0 | Confirmed — Playwright `e2e` lane at `ci.yml:376-429` (`npx playwright test`) |
| R7 stable pin | W1 | Confirmed — `channel="stable"` |
| R8 keyframes.js excision | W5 | Confirmed — no `keyframes*` under `web/frontend` (excluding node_modules) |
| R9 never-push retirement | W7 record | Confirmed as record-only; bbnf-lang never-push STANDS (consistent w/ §1) |

## §2 — class-A concrete asks (campaign 2)

- Logo→game-selector, golden √φ typography, @mbabb attribution, CF Pages cutover — all **ADDRESSED** at `8913023e`/`d43fae28` (campaign-1 commits). `--type-*` tokens present in bulk (111 refs under `src/`); `@mbabb` → `github.com/mkbabb` in `AttributionCard.vue:27,47`. Fable directive is process/IN-FLIGHT (no tree artifact expected). D-size-token (H4/W5) and D1 CDN-fonts (W5) both discharged — fonts self-hosted, CSP `font-src 'self'` with no gstatic/googleapis (`public/_headers:74`).

## §1 — campaign-1 reversals

- R4 inline-tests REVOKED → migrated (T2-3, confirmed). D2 CLAUDE.md SUPERSEDED → folded (T2-4, confirmed). N9 repo split VOID → demo stays (confirmed). All three land.

## Precision notes (not missed executions — flags for tranche-III accuracy)

1. **R5 worktree purge is genuinely un-done.** Worktrees persist under `.claude/worktrees/`. The recap's owner-side booking is honest, but tranche-III should carry R5 forward as an open owner action, not treat it as closed.
2. **"fc_chrono excise" (T2-6) is scoped to the sudoku bench only.** `benches/sudoku.rs:125` documents the excision; `benches/queens.rs:113-121` legitimately RETAINS a `"fc_chrono"` (ForwardChecking+Chronological) label inside its `queens_configs` comparison group. The recap's bare "fc_chrono excise" could read as total removal — it is not. Correct as a sudoku-scoped excise; phrasing is loose.
3. **README "§4" cross-ref (recap §4/R3 row) is imprecise.** By `##`-header count, README §4 is "The two games"; the affordances content the clause points at is not there under that number. The R3 affordance work itself landed (W6). Cosmetic doc-pointer drift.
4. **Live-site status.** Recap marks the CF Pages cutover ADDRESSED at the code level (`d43fae28`); MEMORY.md notes the live `sudoku.babb.dev` may still be pre-tranche pending an owner Pages redeploy. Consistent — recap's scope is code, redeploy is an owner action — but worth surfacing so tranche-III doesn't assume the live artifact reflects HEAD.

## Bottom line

The recap is a faithful ledger: 9/9 class-B constraints and 8/9 ratifications land verifiably in the tree; the 9th (R5) is correctly deferred owner-side and remains open. Zero rows claim a landed commit that HEAD contradicts. The only substantive carry-forward is R5; the other three notes are phrasing/pointer precision, not execution gaps.
