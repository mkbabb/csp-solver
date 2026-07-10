# T2-W7 — Docs + record

**R2 GO: fold-not-delete into lean per-package READMEs, MIT coherence, and the tranche's written record.** Runs last—the docs describe the post-excision tree. The fold plan is the L20 disposition (2,158 L, corrected total) adjusted for R1 and amended by Q10 (destination granularity + the two files the plan missed).

**Dependencies**: ← all prior. **Effort**: M.

---

## Scope

### The fold (Q10-amended)

- **Root**: root `CLAUDE.md` + root `README.md` → **one** root README; register rewritten (archaic-academic retired—"aforesaid"/"serveth" go; house style, ~5% florid ceiling). Named corrections that must NOT ride the fold verbatim: the N=5-easy claims (`CLAUDE.md:82,140,169`, `README.md:43,96`—Q2), "Nightly toolchain" → stable-pinned, dev commands lose the Docker path, test counts per the corrected ledger only.
- **`csp-solver/CLAUDE.md`** (218 L) → fold into `csp-solver/README.md`, adding whatever of `## Public API`, `## BBNF Integration`, `## Build & Test` the content needs beyond the two originally-named sections—`## Structure`/`## Conventions` alone under-fits five structurally distinct categories, and `## Conventions` doesn't exist on the live README yet (needs authoring, not just filling). The perimeter precept permits extra sections below the canonical five—executable, not blocked (Q10 Finding 3).
- **`web/frontend/CLAUDE.md`** → new `web/frontend/README.md`, correcting both the Finding-3 drift AND any dead Option-A/`useApi` framing W2's sweep didn't reach. The ~80-line Animation System block fails the plan's own lean-vs-deep-dive test (the same test that keeps `docs/algorithms.md`/`docs/sudoku.md` separate): **default = hive it to a new `docs/animation.md`** peer; the deliberately-deep-README alternative needs an owner word at review (wave-internal checkpoint, not the README register).
- **`web/api/CLAUDE.md`** — died with the package in W2; no fold target needed (verified sound file-by-file: every fact either internal to the dead service or already duplicated in a surviving doc—Q10).
- **`games/futoshiki/README.md`** — verify W2's sweep stripped the dead `useApi` fallback line (line 5); then author **`games/sudoku/README.md`** mirroring it (closes the §7-idiom asymmetry)—authored AFTER the strip so the new file doesn't copy the dead pattern (Q10 Finding 2).

### EXCISE

`csp-solver/CONTRIBUTING.md` (stale on its own central claim—fold any contributor flow into a README section) · `web/frontend/ANIMATION.md` (superseded; carries drift W13's own ledger claimed fixed) · `web/api/docs/csp_optimization.md` (moot post-W2 regardless).

### RELOCATE

`docs/grand-audit-2026-06-02.md` → `docs/tranches/` (clears W2's enumerated grep exemption).

### License coherence (R2)

Root Unlicense → **MIT**; license fields in the npm/py manifests; coherent across root/crates/npm/py.

### The record

- **Reversals**: R4 inline-tests (revoked), D2 CLAUDE.md (rewrite→removal), N9 repo-split (VOID) + the T2-1 de-booking, R9's never-push retirement (bbnf-lang's own order STANDS).
- **Deferred-ledger fold**: appendix C is the instrument—verify-25's four edits applied, every row homed, the NEW deferrals recorded (opt-level=s w/ felt-latency trigger · H7/H10 · the engine-domains tranche-III booking per the amended P4 row · §8b bitset-parallel GAC · TS 7.x · mobile digit pad · apiError/solverError twins · CSR/Vec-cache/mimalloc/GAC-policy (D20) · memoized transition path regen (P3's CPU half) · N=3-hard aggressive excision, device-gated).
- **Prototype-record corrections** (they're now citable artifacts—correct them where they're wrong): P1's blast-radius counts two consumers → **three** (`gac_ab_corpus::parse_int_map` panics on the bare form) and its consumer census omits that reader (Q5) · P2's "N=3-hard is where the N=3 embed savings mostly live" → struck (sparse N3-easy 8,633 B > N3-hard 3,591 B) and "2× mobile penalty still clears" → "≥2× busts" (verify-P1-P2) · P4's "HARD sample C {1:46}" was a MEDIUM board (verify-P3-P4) · P6's run-3 "~2m" → ~40 s cache-warm (verify-P5-P7).
- **Microcopy pass** (29-completeness G3).
- **Upstream flag to precepts, broadened** (Q10 Finding 4): `canonical-readme-shape.md`'s csc411 divergence row is stale on BOTH the artifact count (4→2) and the structural claim ("one README at root" vs this wave's one-README-per-package shape)—flag both in the same upstream note, or the next precept sync re-imports a superseded model.

## Gates

| Gate | Value |
|---|---|
| CLAUDE.md | zero tracked |
| Facts | every surviving fact single-homed; **zero retired facts carried forward** (the N=5-easy claims are the named test case—Q2) |
| Ledger | zero stale-echo blacklist entries in any surviving doc (appendix A's list is the grep source) |
| Links | link check green |
| Register | root-README sample owner-reviewed (taste-gated—the one W7 gate that isn't mechanical) |

## Seeds

- [`../evidence/pass3/Q10-w7-fold-fidelity.md`](../evidence/pass3/Q10-w7-fold-fidelity.md) — the fold audit (lane-20's disposition table re-verified 21/21 rows at HEAD).
- [`../evidence/pass3/Q2-n5-kill-blast-radius.md`](../evidence/pass3/Q2-n5-kill-blast-radius.md) — the named root-doc corrections.
- [`appendices/A-corrections-ledger.md`](../appendices/A-corrections-ledger.md) / [`B-prompt-recap.md`](../appendices/B-prompt-recap.md) / [`C-deferred-foldin.md`](../appendices/C-deferred-foldin.md) — the record's instruments.
- [`../evidence/synthesis-pass1.md`](../evidence/synthesis-pass1.md) D17/D18/D19 (verify-20/-25/-22 chains).

## Residual risks

- The register rewrite is judgment-heavy—the owner sample review is the gate, not a formality.
- Fold compression is where retired facts sneak through; the Q2 named-correction list + the blacklist grep are the two nets. Run both before the sample review, not after.
- `docs/animation.md` vs deep-README is a real fork (one flag, cheap either way)—don't split the difference by duplicating content in both.
