# T3-W2 — Packaging + doc truth

**The currency wave: true every fact the campaign proved stale, and stamp the interim pyproject.** No destructive code here — this is the §1.9 batch, run against G6's SHA-stamped counts as the single source of numbers. It lands before the 0.4.0 surface work (W3/W4) so the record is honest at the point the demolitions begin. The `_headers` fix is now **live-proven** (G8-H2 captured the doubled `Cache-Control` at `sudoku.babb.dev`), not inferred.

**Dependencies**: ← W0 (base SHA + counts). **Effort**: S–M.

---

## Scope

### Doc-truth: the retired GAC headline + the blacklist triplet

The retired `13.36× / 112-board / 1.3–2.5×` triplet survives as a **live headline** in two files, contradicting `docs/benchmarks.md`'s own first-party `12.6–12.7× / 50-board / 1.8–3.3×` landed in the same commit (`3b75eca2`) — an intra-commit inconsistency, not a lag (A7-D1, A11 §Drift):

- `README.md:113` — the 13.36×/112-board/1.3–2.5× headline + the false "first-party probe rides the W-GATE recertification" future-tense (in the commit that *is* that recertification). Retrue to benchmarks.md; `gac_timing_probe` is the correct fix-source.
- `csp-solver/README.md:102` — the same stale `1.3–2.5×` minority-cost inline, immediately above a pointer to the doc that contradicts it.
- **Blacklist:** add the retired triplet (`13.36×`, `112-board`, `1.3–2.5×`) to Appendix-A §3's literal-string net so the grep closes the hole the WGATE probe opened (A11 recommendation (a)).

### Publish-status ×2

Both describe 0.3.0 publication as pending in the commit whose message declares it done (`csp-solver/Cargo.toml:3` = `0.3.0`, no staged marker) — A11 §Drift 3:

- `README.md:107` — "0.2.0 published; 0.3.0 staged in-tree — publication rides the W-GATE recertification".
- `csp-solver/README.md:24` — "The workspace source is at 0.3.0; crates.io still carries 0.2.0 — publication rides the release gate".

The `@mkbabb/csp-solver-wasm` wasm row genuinely stayed 0.2.0 (`wasm/Cargo.toml:3`, `wasm/pkg/package.json`, `wasm/README.md:4` all agree) — **not** drift; leave it (its 0.4.0 restamp is W3's).

### pyproject interim stamp 0.2.0 → 0.3.0

Live drift confirmed at HEAD: `csp-solver/Cargo.toml` = **0.3.0** but `csp-solver/pyproject.toml` = **0.2.0**; maturin names the wheel off pyproject → `csp_solver-0.2.0-…whl` (G6 §1, S6-agg). This is the **interim truth-fix only** — the version-triple advances to 0.4.0 *together* in W3/W4 (T8). Do not leave pyproject at 0.3.0 past the crate bump (re-creates the exact S6 defect).

### `_headers` — the doubled Cache-Control (live-proven, G8-H2 / A9 / A17-P7)

`curl -sSI https://sudoku.babb.dev/assets/csp_solver_wasm_bg-*.wasm` returns `cache-control: public, max-age=31536000, immutable, public, max-age=31536000, immutable` — **doubled**. This proves the `_headers` comment "the more-specific `/assets/*.wasm` merges over `/assets/*`" **false**: Cloudflare Pages **appends** matching-rule headers, it does not replace (G8-H2). Fix: drop the redundant `Cache-Control` from the `.wasm` stanza (keep only `Content-Type`); true the comment. Neither the doubled directive nor the absent-CSP-on-`.wasm` observation is exploitable (G8-H2) — this is doc-truth + hygiene, homed here not W11.

### The rest of the §1.9 batch

- **CONTRIBUTING restore** + wire `## Contributing` (release-readiness regression, A4); **wasm LICENSE** file + `license` field + README License section; root **install matrix**; SHA-stamp the counts; em-dash-density + one-epanorthosis pass.
- `gac_ab_corpus.rs:6,12` "112 boards" comment (A8); `_headers` wasm stanza (folds into the G8-H2 fix).
- **`tests-py` count stamped 27/2** — note it goes **27/0 post-W4** (R-3, the two skipped tests delete with the Timeout reserve); stamp 27/2 now, flag the post-W4 value.
- **MEMORY live-site reconcile** — "STILL PRE-TRANCHE" is SUPERSEDED (A10/A17: PWA sw.js live, lean wasm 90,602 B, dist hashes local==live); one reconciliation line (A24 G11).
- **CI 8→9 lane count** reconciled everywhere + compile-graph dedup pass + abi3 matrix-collapse scored as the CI win it is (A24 G1).
- **A24-G2 evidence policy** recorded (47 MB / 287 files / 115 PNGs); tranche-III evidence dir under it from day one (opened in W0).
- **G6's stamped baseline** (rust 151/0/6 across 18 harnesses, py 27/2, e2e 33/33 at the base SHA) is the citable figure set; the stale CLAUDE.md cache (150/17/87,853) is **dead** (K45).
- **RES-5**: the P2-L3 memo's three "13" sites (`:183,185,362`) → 12+2+1 before any archival use (WGATE files the actual edit; note it here).

## Gates

Verbatim from the reconciliation (§2 DAG, T3-W2):

| Gate | Value |
|---|---|
| Headline | blacklist grep-zero incl. retired triplet; wheel METADATA inspected; `curl -sSI …wasm` shows single Cache-Control after redeploy (or noted as pending-Pages) |

Component checks:

| Gate | Value |
|---|---|
| Blacklist | grep-zero for `13.36×`, `112-board`, `1.3–2.5×` (new triplet) + the nine standing strings, outside `docs/tranches/` |
| Wheel | METADATA inspected on the interim 0.3.0 wheel |
| Headers | single `Cache-Control` on the `.wasm` response after CF Pages redeploy — **or** noted as pending-Pages (the fix lands in-tree; the edge picks it up on the owner's next deploy) |
| Counts | every surviving doc reads G6's 151/0/6 · 27/2 · 33/33; zero references to 150/17/87,853 |

## Seeds

- [`audit32/A7-wave-reaudit-w3.md`](../evidence/audit32/A7-wave-reaudit-w3.md) §D1 — the README:113 headline drift, gac_timing_probe as fix-source.
- [`audit32/A11.md`](../evidence/audit32/A11.md) §Drift — the three stale sentences (GAC ×2, publish-status ×2), blacklist-hole diagnosis.
- [`pass3/G8-security-probe.md`](../evidence/pass3/G8-security-probe.md) §G8-H2 — the live doubled-Cache-Control capture, the "merges over" refutation.
- [`pass3/G6-baseline-run.md`](../evidence/pass3/G6-baseline-run.md) — the stamped counts, pyproject↔Cargo drift (§1).
- Synthesis §2.7 (the currency batch enumeration), reconciliation §1.9.

## Residual risks

- **The `_headers` fix lands in-tree here but bites only at the edge on the owner's next CF Pages redeploy** — the gate accepts "pending-Pages" as a recorded state. The MEMORY reconcile confirms the Pages cutover already happened once (A10), so redeploy is a known, owner-side action.
- Blacklist additions must match the *literal* strings as they appear in prose; the WGATE probe retired the numbers after Appendix-A §3 was authored, which is exactly how the grep hole opened — verify the new triplet strings against the live README text, not from memory.
