# r1-doc-drift — doc + canon drift, meta-language census

Subject HEAD 65425697. All anchors file:line. Probes rerunnable from repo root
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`.

## P1 — Root README published-artifacts table: all three version rows stale (truth-drift)

`README.md:111-115` — the "Published artifacts" table:
- `csp-solver … 0.3.0—published` — but `csp-solver/Cargo.toml` is `version = "0.4.0"`.
- `@mkbabb/csp-solver-wasm … 0.2.0` — but `csp-solver/wasm/pkg/package.json` is `0.4.0`, `csp-solver/wasm/Cargo.toml` is `0.4.0`, and the wasm README/CHANGELOG both say 0.4.0.
- `@mkbabb/pencil-boil … ^0.7.0` — but `web/frontend/package.json:` pins `"@mkbabb/pencil-boil": "^0.8.1"` (installed 0.8.1; upstream `pencil-boil/package.json` is 0.8.1).

Every version in the table the owner calls "quite good" is wrong.

Probe:
```
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
grep -m1 '^version' csp-solver/Cargo.toml csp-solver/wasm/Cargo.toml
grep '"version"' csp-solver/wasm/pkg/package.json
grep 'pencil-boil' web/frontend/package.json
```
family_hint: `version-table-drift`

## P1 — csp-solver/README claims "both at 0.3.0 — published"; source is 0.4.0

`csp-solver/README.md:25-26`: "The workspace source and crates.io are both at `0.3.0` — published." Contradicted by `csp-solver/Cargo.toml` (`version = "0.4.0"`). Install snippet `csp-solver/README.md:32` still says `csp-solver = "0.3"`.

Compounding: the CHANGELOG has NO crates.io entry for `csp-solver@0.4.0`. `csp-solver/CHANGELOG.md:17` heads a `0.4.0` section that contains only an `### npm` subsection (the wasm 0.2.0→0.4.0 bump), yet `csp-solver/CHANGELOG.md:31` says that bump "aligns the package to the core crate's `0.4.0` surface" — asserting a core-crate 0.4.0 that the changelog never documents shipping. So three surfaces disagree: Cargo.toml says the crate IS 0.4.0; README says it's 0.3.0-published; CHANGELOG's newest crates.io row is 0.3.0. Whether 0.4.0 is actually on crates.io is unclaimed anywhere.

Probe: `grep -n '0.4.0' csp-solver/CHANGELOG.md` (only npm + the "core crate's 0.4.0 surface" line; no crates.io release row).
family_hint: `version-table-drift`

## P1/P2 — Root README links to CONTRIBUTING.md, absent from the working tree

`README.md:139`: "…is in [`CONTRIBUTING.md`](./CONTRIBUTING.md)." The file exists at HEAD (`git cat-file -e HEAD:CONTRIBUTING.md` → present, last touched `f6f28420`) but is a staged deletion in the working tree (`git status --short` → `D CONTRIBUTING.md`; no file on disk). The README routes "the full flow, plus the release posture" to a file that's being removed. Commit the deletion and the only link to the contributor/release flow dangles. No other product doc carries that content — `grep -rn CONTRIBUTING README.md csp-solver/README.md docs/*.md` returns only this one reference.
family_hint: `dangling-doc-link`

## P2 — Meta-language leaks pervade every product doc (owner bans process narration)

Tranche / wave / gate-code / campaign / audit process narration is threaded through the entire product-doc corpus. Legit technical uses of "gate" (GAC live-participant gate, bbnf sync gate, soundness gate) and "wave" (animation reveal-wavefront) are excluded below; these are the process leaks:

- `README.md:82` — "measured at the tranche-III gate SHA `b4d7aedf` (T3-W12, the tranche close)"
- `README.md:88` — "the two Timeout-gated skips deleted at W4"
- `README.md:103` — "222,436 B at the T2-WGATE re-measure … the T3-W6 engine-perf trim from 90,602 B"
- `README.md:119` — "the 50-board post-W4 A/B corpus … the pre-tranche figures … are retired"
- `docs/algorithms.md:14` — "the false-UNSAT regression the kernel wave closed -- `evidence/kernel-soundness-closure.md`"; `:47` "wrong in the pre-tranche docs"; `:49`/`:53` cite `evidence/synthesis-pass2.md`
- `docs/animation.md:46` — inlines the path `docs/tranches/2026-07-grand-uplift/waves/W8-animation-gestalt.md`; `:70` "commit-stamped in the tranche evidence"
- `docs/benchmarks.md:5,10,14,24,37,44,45,51` — dense: "pre-tranche number", "named campaign artifact under docs/tranches/2026-07-grand-uplift/evidence/", "post-W4 corpus", the `T2-WGATE-gac-probe.md` path, "tranche-1's then-113-board corpus", "b4d7aedf (T3-W12 gate)", "the tranche-III adds", "the 90,602 B tranche-II close … T2-WGATE re-measure … the W6 beat-9 propagate ops … T2-W3 stamp"
- `docs/sudoku.md:92` — "which the tranche landed"
- `csp-solver/README.md:210` — "the two Timeout-gated skips deleted at W4"
- `csp-solver/CHANGELOG.md:17,33,62,99-100` — "(tranche-3, W3 …)", "(tranche-2, W3 …)", "(grand-uplift tranche, W1–W12)", "muster tranche G release-engineering wave (G.W5 sub-wave A, CSC411-fold pass)"
- `csp-solver/wasm/README.md:46` — inlines `docs/tranches/2026-07-grand-uplift/waves/W6-deploy-c.md` as the budget's authority
- `csp-solver/wasm/CHANGELOG.md:3,19` — "(tranche-3 — dead-surface excision)", "(grand-uplift tranche)"
- `csp-solver/csp_solver.pyi:3` — module docstring: "Hand-written against the post-prune (tranche-III) surface"
- `pencil-boil/CHANGELOG.md:14,20,39,134,147` — "(tranche-3 W13 §1-P1 release)", "measured in the T3-W13 audit", "(tranche-2 W5 release)", "(tranche-C handmark cohort)", "muster tranche G release-engineering wave (G.W5 sub-wave D)"

This is the highest-cardinality defect in the lane. A doc-reformulation wave must scrub tranche/wave/gate-code/campaign/audit references and the inlined `docs/tranches/**` paths from every product surface, replacing gate-SHA provenance with plain "measured at `<sha>`, `<host>`, `<date>`" stamps where a number must be traceable.

Probe:
```
for f in README.md docs/*.md csp-solver/README.md csp-solver/CHANGELOG.md \
  csp-solver/wasm/README.md csp-solver/wasm/CHANGELOG.md csp-solver/csp_solver.pyi; do
  grep -niE 'tranche|WGATE|T[0-9]-W|\bW[0-9]+\b|campaign|muster|grand-uplift' "$f" | sed "s|^|$f:|"
done
grep -niE 'tranche|T3-W|muster' /Users/mkbabb/Programming/pencil-boil/CHANGELOG.md
```
family_hint: `doc-meta-leak`

## P3 — Root README e2e count off by one (43 vs 44)

`README.md:91` (and heading `:92`): "e2e — 43 Playwright tests in 8 files". Actual: 44 `test(` calls across the 8 `.spec.ts` files (file count correct). MEMORY ledger itself says "44 e2e".

Probe: `grep -rEho "^\s*test\(" web/frontend/e2e/*.spec.ts | wc -l` → 44.
family_hint: `count-drift`

## P3 — Root README register gap vs MIKE-STYLE: em-dash saturation + stamp-residue

MIKE-STYLE.md:19 — "Limit usage of em dashes." `README.md` carries 30 em-dashes over 143 lines (`grep -o '—' README.md | wc -l` → 30), roughly one every fifth line. The CI/testing/benchmarks sections read as a build log, not product prose: `README.md:103` and `README.md:119` pack gate SHAs, host names, byte deltas, and wave codes into parentheticals a product reader can't act on. Concretely, "refinement" of the root README means: (1) fix the three stale artifact versions and the CONTRIBUTING link above; (2) strip the wave/gate provenance to plain stamps; (3) thin the em-dash density; (4) move the exhaustive per-lane CI recitation and the byte-budget archaeology into `docs/` and leave the README a perimeter. The prose register (contractions, precise domain verbiage, no-space em-dashes) is already on-canon; the distance is in density and process residue, not voice.
family_hint: `register-density`

## Checked and NOT a defect (adversarial)

- PWA claims (`README.md:59` "PWA offline", `:107` "The PWA installs and plays offline") are CURRENT — `web/frontend/vite.config.ts:192` runs `VitePWA(...)`, `vite-plugin-pwa ^1.3.0` is a dep, and `e2e/pwa-offline-smoke.mjs` exists. The once-abrogated PWA rows are truthfully re-instated. No lie here.
- Template-bank figures cohere: `README.md:55` "45 boards, 32,533 B" == `csp-solver/README.md:173` "32,533 B" == `docs/benchmarks.md:14` "N=3-hard 20 + N=4 25" (=45).
- `node_budget = Some(1_000_000)` / "node budget 1M" (`README.md:44`) matches `csp-solver/README.md:80`.
- CI "nine jobs" (`README.md:103`) matches the 9-lane `ci.yml` per the subject map.
- The wave paths inlined at `docs/animation.md:46` and `csp-solver/wasm/README.md:46` DO exist on disk — the defect is the leak, not a broken path.
