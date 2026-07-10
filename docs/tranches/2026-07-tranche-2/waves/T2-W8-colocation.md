# T2-W8 — Grand recursive colocation (frontend + backend)

**The owner's edict, restated 2026-07-10 and binding on ALL file directories,
both stacks**: components COLOCATED with their sub-components, composables,
skeletons, constants, styles — recursively for nested components. Only truly
module-/global-level composables (and styles, constants, etc.) live in a shared
`composables/` (etc.) dir. Long-running flat dirs are always broken into common
modules and encapsulated. Backend receives the same treatment, abstracted
befitting the language (Rust module dirs + `tests/` mirrors; the surviving
Python under its package shape).

**Dependencies**: ← W2 (the backend tree is final only post-abrogation),
← W5/W6 (colocation moves the FINAL files — hardening + affordances land
first). **Effort**: M (2–3 days). **Seeds**: `pass1/19-repo-org.md` (grade A)
+ `pass1-critique/verify-19.md` — the drift manifest is the base; re-derive
against the post-W6 tree, never apply stale rows blind.

---

## Scope

### Frontend (`web/frontend/src`)

- **Post-tranche-1 drift sweep** (lane 19's measured rows, re-derived at the
  landing tree): the `games/*/{lib,protocol.ts,solver.worker.ts}` sprawl —
  worker + protocol + solverError colocate under a `solver/` module per game
  (they are one encapsulated concern); `apiError.ts`'s post-W2-split remainder
  colocates with its sole consumer.
- **`pencil/chrome/` break-up** (10+ flat files — the edict's long-dir clause):
  sub-group by concern — the W7-era folder convention (`AttributionCard/`,
  `OptionSelector/`, `HandwrittenLogo/`) generalizes to the remaining flat
  members; single-file components with no satellites stay flat (colocation is
  for families, not ceremony).
- **New-since-W7 satellites**: every composable/constant/util added by
  W8/W9/W10/tranche-2 waves audits against the rule — one consumer → colocate;
  ≥2 cross-family consumers → the shared dir with a one-line justification.
- **Styles**: component-scoped styles already ride the SFCs; `index.css` keeps
  only tokens + true globals (the type scale, arms, resets) — anything
  component-specific found there moves into its SFC.

### Backend (`csp-solver`, post-abrogation)

- **Rust module encapsulation**: any src dir whose flat-file count outgrew its
  cohesion since W1's split (re-measure; candidates from lane 19: `solver/`
  post-substrate-excision is SMALLER — verify nothing else bloated);
  `tests-py/` (W2's new home) organized per the wheel-contract concern set.
- **`tests/` mirror discipline**: the tests-of-record doc-comment convention
  (W1) re-verified against the moved tree; every `src/` module names its
  `tests/` file(s); the inline-test ban (R-inline, W3) holds — zero
  `#[cfg(test)]` in `src/` post-W3, asserted here again as a gate.
- **Workspace-level**: `examples/` dispositions from lane 09 execute here if
  W3 didn't carry them (the stale-construction fixes ride W3; the
  keep-vs-move calls land here).

### Enforcement (the edict made mechanical)

- The ESLint boundary generalizes: the existing three blocks stay; NO
  finer-grained per-folder rules (the folder convention is the signal — the
  tranche-1 ruling stands).
- A structure manifest (old→new, every moved path) rides the wave record —
  the colocation edict's standing requirement.

## Acceptance gates

| Gate | Bar |
|---|---|
| Static | vue-tsc 0 · eslint 0 (boundary probes re-run) · vite build green · `cargo test --workspace` green at the landed counts |
| Behavior | soul SSIM 1.0 (settled board, both themes) · e2e green at the landed tree · chains=1/floor 10 |
| Structure | the manifest is total (no unlisted moves; `git log --follow` traceability); zero `#[cfg(test)]` in src; shared-dir members each carry their ≥2-consumer justification |

## Residual risks

- Colocation is churn-heavy and gate-cheap — the risk is REVIEW fatigue, not
  breakage; the manifest + `--follow` discipline is the mitigation.
- Import-cycle surprises when satellites move inside component dirs — the
  Vite/TS resolver handles relative depth fine; the probe set catches boundary
  regressions.
