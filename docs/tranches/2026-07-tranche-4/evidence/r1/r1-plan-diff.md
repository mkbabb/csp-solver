# LANE r1-plan-diff — plan-vs-landed diff (tranche-3 README §3/§3a/§3b + waves + T2 residuals)

HEAD `65425697` on master. Verdict: **the tranche-3 record lands with very high fidelity.** Every ballot row, every register disposition, and every grep-checkable wave-scope row I probed landed as specified; declared evidence dirs exist on disk. Two P3 residues only — both cosmetic staleness, no correctness or user-facing defect.

## What was verified LANDED-AS-SPECIFIED (anchored)

### Ballot Q1–Q4 (README §2, lines 39–42)
- Q1 `futoshiki_api.rs` / `sudoku_api.rs` REMOVE — grep-zero under `csp-solver/` (probe: `find csp-solver -name 'futoshiki_api.rs' -o -name 'sudoku_api.rs'` → none).
- Q1 `solve_sudoku_board` + `template_count` prune — grep-zero in `csp-solver/src`.
- Q1 `PropagationStrategy` + `propagate_with` removed from **py surface** (capability-loss scope) — absent from `csp-solver/src/py/` and `csp_solver.pyi`; correctly RETAINED in Rust core (`csp-solver/src/config.rs:32`, `src/csp/solve.rs:25`). Matches "matches the gated/spiked surface."
- Q1 stub `__all__` = 15 — `csp_solver.pyi:16` collection is exactly 15 names (probe: python re-count).
- Q2 `propagate_stratified` REMOVE — grep-zero in `csp-solver/src`.
- Q2 `CspError::Timeout` RESERVE with the exact `// reserved: no constructor until cancel-driver` note — `csp-solver/src/error.rs:63–64`. `CspTimeoutError` exported in pyi.
- Q2 version-triple → 0.4.0 together — `csp-solver/Cargo.toml:3`, `wasm/Cargo.toml:3`, `pyproject.toml:7`, `wasm/pkg/package.json:5` all `0.4.0`.
- Q2/R-3 "delete the 2 skipped py tests → tests-py 27/0" — `@pytest.mark.skip` grep-zero in `csp-solver/tests-py/`; pytest `--collect-only` in the repo venv collects **27, 0 skipped** (win32 skipif is a POSIX-only platform guard, doesn't fire here). Deleted in W4 commit `044f2526`.
- Q3 three-home rule — `web/frontend/src/games/shared/` contains `useAnswerKeyPeek.ts`, `scene.css`, `types.ts`, `constants.ts`, `useUndoHistory.ts`, `usePencilMarks.ts`, `useButtonAnimation.ts` (all named relocations present).
- Q4 index.css monolithic — single `src/assets/index.css` (typography.css is a separate pre-existing file, not an @layer split).

### §3a owner-audit-2 register (lines 77–95)
- F4-S2 REVERT to `#F0B030`, key kept — `pencilConfig.ts:52` `spiral: "#F0B030"` (see finding 2 re: the cited line number).
- Evidence banked: `evidence/owner-audit-2/` (boil-hairline.png, sun-spiral.png, board-artifact.png, completion-area.png, controls-drawer-context.png) all on disk.

### §3b owner-audit-3 / W13 (lines 99–115)
- `MOTION.curves.drawerGlide = cubic-bezier(0.32, 0.72, 0, 1)` — `pencilConfig.ts:140`, consumed by `useControlsDrawer.ts:64`, App.vue:309, scene.css:74.
- @520ms — `useControlsDrawer.ts:61` `GLIDE_MS = 520`, applied at line 181.
- pencil-boil 0.8.1 pin — `web/frontend/package.json:21` `^0.8.1`, lockfile resolves `0.8.1.tgz`.
- lean wasm 86,746 B, source==dist — `wasm/pkg/csp_solver_wasm_bg.wasm` and `dist/assets/csp_solver_wasm_bg-*.wasm` both exactly 86,746 B.
- `.pencil-draw-on` draw-ins — present in `index.css`, SudokuCell.vue, FutoshikiCell.vue, AnswerKeyLaminate.vue.
- sunRays retired / 125ms beat — `pencilConfig.ts:118` `beatMs: 125`, `:123` tombstone comment "sunRays (6 beats) RETIRED at the W13 c1 soul-gate close".
- e2e 44/44 — 44 `test(` across the 8 spec files (4+3+9+6+8+6+7+1); drawer.spec.ts + digit-pad.spec.ts present (W13/W11 surfaces).

### Wave-scope spot-checks (grep-checkable rows)
- W3 `#storybook-texture` KILL (R-4) — grep-zero in `web/frontend/src`.
- W3 retired triplet blacklist — grep-zero.
- W5 criterion `html_reports` drop — grep-zero in Cargo.toml/benches.
- W5 knip CI lane — `ci.yml:418` knip step + `web/frontend/package.json` lint:knip.
- W5 lucide-inline (no dep) — no `lucide` in package.json.
- W6 `gac_ab_corpus` — `csp-solver/examples/gac_ab_corpus.rs` exists.
- W11 mobile digit pad BUILD — `games/shared/DigitPad.vue` + `e2e/digit-pad.spec.ts`.

### T2 residual / deferred fold (appendix C)
- L25-59 skip-tests delete, propagate_stratified REMOVE, Timeout RESERVE — all homed and landed as above. Appendix C rows trace correctly.

---

## FINDINGS

### F1 (P3) — stale in-file reference to the R-3-deleted skip tests
`csp-solver/tests-py/test_wheel_contracts.py:246–248` — the docstring of `test_all_four_typed_exception_classes_exist_and_are_exceptions` still reads: *"...including the two not exercised end-to-end below; see their skip reasons for why."* W4 (`044f2526`) deleted the two `@pytest.mark.skip` tests those words point at (file now ends at line 256; no skip-decorated tests remain — `BudgetExceededError`'s end-to-end test was the deleted L25-59). The "below … skip reasons" reference now dangles. Plan (R-3, README Q2 line 40 + appendix C §1 L25-59) landed correctly at the test level (27/0), but left its own explanatory reference behind.
- Family: `doc-truth-leak` (stale-comment residue of a completed deletion).
- Probe: `grep -n "not exercised end-to-end below" csp-solver/tests-py/test_wheel_contracts.py` (hits) vs `grep -c "@pytest.mark.skip\b" csp-solver/tests-py/test_wheel_contracts.py` (0).

### F2 (P3) — disposition-register line-anchor drift on the F4-S2 revert
README §3a line 87 cites the revert as **"(`pencilConfig.ts:47` → `'#F0B030'`, keep the key)"**, but line 47 is prose comment; the actual `spiral:` key holding `#F0B030` is `pencilConfig.ts:52`. Substance landed verbatim (value + key preserved); only the cited line number is off by five (config drifted after the register was written). "The record claiming a thing" points at the wrong line for the thing.
- Family: `doc-anchor-drift`.
- Probe: `grep -n "spiral:" web/frontend/src/pencil/config/pencilConfig.ts` → `52:` (record says 47).

---

## Non-findings (checked, cleared)
- All cited evidence dirs present: owner-audit-2/, owner-shots/, addendum/{a2-shots,d1-shots}/, pass3/g7-harness/{probe-felt.mjs}, pass3/g10-shots/, pass3/g6/, pass3/fuzz.mjs. (§6 refers to "g10-shots/" without the `pass3/` prefix — findable, present; not booked.)
- `java` branch + `origin/java` STILL PRESENT — but README §4/§5 files this as an **owner-side** WGATE reminder (R5), not an executor deliverable; memory records "the java branch STAYS." Disclosed, not a lie. Worktrees now 1 (R5's "52" was the audit-time owner-side count). No finding.
- affordances.spec.ts:126 has one **data-conditional** `test.skip` (fires only when no two blank cells share the first blank row on a given deal) — not a hidden disable; 44/44 stands as the collected count.
