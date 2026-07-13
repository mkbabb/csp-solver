# Auditor context sheet — tranche-IV formulation campaign

## The subject
- App repo: /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion (origin github.com/mkbabb/csp-solver), HEAD 65425697 on master.
  - Rust workspace: csp-solver/ (+ csp-solver/wasm/); Python bindings csp-solver/src/py/ + csp_solver.pyi; tests-py/.
  - Frontend: web/frontend/ (Vue 3 + Vite; src/pencil/ + src/games/{sudoku,futoshiki} + src/games/shared/).
  - Plans/records: docs/tranches/2026-07-tranche-2/ and 2026-07-tranche-3/ (READMEs, waves/, evidence/). These are AUDIT TARGETS, not gospel.
  - CI: .github/workflows/ci.yml (9 lanes).
- Sibling library: /Users/mkbabb/Programming/pencil-boil (v0.8.1 on npm; the animation scheduler + boil facilities).
- Memory ledgers (campaign records, audit targets for the chronic census): /Users/mkbabb/.claude/projects/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/memory/*.md
- The Safari profile evidence (fresh, verified at 66% w/ six folded kills): scratchpad sibling dir ../safari/ (s1/s2/s3/crit-safari reports + rerunnable probes).
- Style canon for the docs re-formulation: /Users/mkbabb/Programming/sci-report/reports/style/MIKE-STYLE.md

## Hard rules
- NO source edits. You are an auditor: read, build, run tests, run probes, screenshot, write ONLY under your scratchpad report dir. If a probe needs a code mutation to demonstrate a defect, do it in a throwaway `git worktree add` and remove it after, or demonstrate by injection at runtime.
- The owner dev server at :3001 is live — never kill, occupy, or mutate it. Serve your own preview on a free port.
- Never run `npm run lint` (global prettier shadow) — `npm run lint:eslint` and `npm run lint:knip` are safe.
- Deploys are out of scope for auditors.

## Evidence discipline (binding)
Every finding carries: file:line anchors, and at least one of {a failing probe (banked, rerunnable), a reproduction recipe, a concrete diff-of-record (plan text vs tree truth)}. Status reports, vague optimism, and "routine" claims about unverified global properties are rejected in synthesis. Rank findings by severity: P0 = user-facing broken or a lie in the record; P1 = defect with a live trigger; P2 = debt with a named cost; P3 = polish.

## The close-class lies (audit adversarially against these)
green-over-broken · vacuous-green gates (a gate that cannot fail) · declared captures missing on disk · masked fallbacks · alias smuggling · re-booked chronics · per-mechanism green over gestalt broken.

## Finding families
Group findings by UNDERLYING DEFECT MECHANISM, not wording. Your report assigns each finding a family_hint (a short mechanism slug, e.g. `webkit-filter-recache`, `gate-cannot-fail`, `doc-meta-leak`, `dep-major-lag`, `test-overfit-timing`). The orchestrator merges hints into the campaign registry between rounds.
