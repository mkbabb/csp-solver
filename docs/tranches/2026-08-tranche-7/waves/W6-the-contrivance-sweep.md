# W6 — THE CONTRIVANCE SWEEP

The code-level half of "root out all contrivance": dead lanes, dual paths, masked fallbacks,
vacuous gates, and the two long-standing enforcement gaps (inline tests, god modules). Each
item is a clean break — no aliases, no shims, no dual paths — per the standing edict.

## Dead lanes and unheld gates

- **The relay lane** — 14 tests in no CI configuration. Wired in W4; the gate-honesty half
  lives here: `web/relay` is also outside typecheck, lint, prettier, and knip. Bring it into
  the format and lint scopes, or record the exclusion as deliberate (today `ci.yml` narrates
  the prettier gate as repo-wide while 22 `e2e/` + `web/relay/` files are non-conformant).
- **`check-theme-tokens.mjs`** and **`lint:tdz`** — both pass, both run nowhere. Cure the
  **class**, not the two instances: a `check-lane-membership` gate asserts every
  `web/frontend/scripts/check-*.mjs` and `*-probe.mjs` is either named by a CI lane or carries
  an explicit `NOT-A-LANE:` declaration with a cite. Born RED at HEAD (two unreferenced). W1's
  never-written-selector census and W2's occlusion gates land under this law on day one, so a
  new guard cannot ship unwired again. Wire the two existing guards beside `lint:ink`/`lint:catch`
  or delete them.
- **`e2e/magnitude-reporter.mjs`** — zero referents; the job it was written for is done by
  `golden-magnitude.mjs`. Retire.
- **`filterBudget.ts`** — 306 lines in `src/` but imported only by `e2e/filter-census.spec.ts`,
  sitting at a permanent 0% in the `src/pencil` coverage denominator. Move to `e2e/` or exclude
  it in `vitest.config.ts` beside `main.ts`.
- **`knip.json` scope** — `project` excludes `scripts/**` and `e2e/` non-specs, which is why the
  dead code above survived a `files: "error"` rule. Widen it.
- **`esbuild`** dep with no direct consumer — say why (wrangler's exact-version dedup) or drop.

## Dual paths

- **Permalink codec** — `persistence.ts::encodeBoard` vs `e2e/wire.ts::encodeSudoku` plus five
  unit-local `V1` spellings = seven spellings of the version byte, two grammars, zero
  cross-check. `e2e/wire.ts`'s own header records the last time this drifted. Add one
  round-trip row importing both encoders and asserting they agree; e2e already imports from
  `../src/`, so the seam exists.
- **`localWire` in the main chunk** — cured in W4 (the DEV gate); the dual-path record closes here.

## Masked fallbacks

- **`App.vue:224`** `.catch(() => {})` — a wordless swallow of a dynamic-import rejection for
  four game chunks. The `check-empty-catch.mjs` regex (`CATCH_HEAD` at `:47`) structurally
  cannot see the arrow form, so the census that exists to catch this is blind to it. Fix the
  site (the warm is opportunistic — say so in the catch) **and** extend the regex to the arrow
  form with a negative control.
- **`usePencilMarks.ts:40`** — a `propagate()` failure renders as "no pencil marks" while its
  two sibling call sites route through `classifyError`. Book the asymmetry: fix or document.

## Vacuous and green-over-broken gates (from the gate-soundness lens, all ablation-proven)

- **The perf lane** (`ci-subset.mjs`) grades after the engine loop, so a later engine's early
  return discards a measured chromium breach, and `ci.yml:1223` maps exit 3→CODE=0. Accumulate
  per-engine status and grade every result before any early return; strike the ci.yml sentence
  claiming chromium is graded first.
- **The golden estate gate** exits 0 on a wiped goldens dir. Exit 1 when `asserted.size > 0 && goldens.length === 0`.
- **`check-prod-shake.mjs`'s `schedulerDebugInfo`** can never appear (esbuild mangles it); the
  surviving symbol is `__schedulerDebug`. Swap it; note that identifier-substring policing only
  reaches dynamic-import chunk names.
- **The self-delta `invert` arm** reds the crest at its own postcondition, not the compare
  (the crest boots dark, invert leaves light). Make the delta direction-aware or parse the JSON
  report and require every golden to red with a `toHaveScreenshot` message.
- **The count floors** (`check-pw-projects.mjs`) sit 43–400% below live; deleting a whole spec
  file stays green (a vanished spec is neither orphan nor double-claim, since check 2 seeds from
  `onDisk`). Add a spec-file manifest so a deletion reds, and re-derive the floors.
- **The unit floor** is 300 against 444 executed. Re-derive to ~10% below the live census.
- **The golden band** derives `TOTAL_CEILING` from a stale "101,341 B" (today 92.5 KB), so two
  more cell goldens pass under the ceiling the doc calls a ruling. **Pin the count at 8** — a
  ninth is then a ruling by construction, not by arithmetic that must be re-derived at every
  crop-tighten (that re-derivation IS the drift mechanism). The byte band stays as a secondary
  control.

**Floor timing (binding):** every floor above lands its *mechanism* in W6 (the manifest, the
canary, the count pin) but restamps its *numbers* at WGATE, after the last row lands anywhere in
the tranche — W2/W4 both add tests. A floor derived at W6's own seal is stale on arrival, which
is the exact 43–400%-slack mechanism these rows exist to remove.
- **`undoBurst`/`hoverSweep`/`solveWindow`** are measured every run and priced in gates.json
  nowhere. Price `undoBurst` (the number exists); document the other two as diagnostic. Add
  `galleryDrag` and `drawerToggle` scenarios for the surfaces the owner's marks created.
- **WebKit lacks `longtask`** — any long-task assertion on the webkit lane is vacuous. Assert
  support first and exit setup-error otherwise, matching `ci-subset.mjs`'s exit-2 discipline.
- **The linux bake quarantine** runs 1-of-6 and 0-of-10 live webkit assertions while the count
  floors count them as coverage and `ci.yml:1077` describes them as asserting. Subtract declared
  quarantines from the floors; correct the step comment.

## The two enforcement gaps (born-RED gates)

- **Inline test module (T7-R01):** `kuhn_munkres.rs:135` carries `#[cfg(test)] mod tests`, the
  only one in `csp-solver/src`, born 19 hours after the T2 zero-declaration, with no gate. Extract
  the tests to `csp-solver/tests/` (the U-09 precedent, one dir over) and add a
  `grep -rn '#\[cfg(test)\]' csp-solver/src` gate, born RED at HEAD.
- **God modules (T7-R08) — contingent on BAL-10.** `search.rs` 534 L documents its own uncured
  breach; `GameControlPanel.vue` is 1,746 L — the component the owner marked five times — and 12
  frontend files exceed 500 with enforcement "none." But the parsimony edict never priced a line
  *ceiling*, so the budget itself is a ballot (`DISPOSITIONS.md` BAL-10). **Default arm — retire
  the budget:** strike the two prose cites (`search.rs:29`, `py.rs:14`) and land no gate. **Enforce
  arm:** a `max-lines` gate with the frontend explicitly in scope, born RED on the current
  breaches, with named waivers, and `GameControlPanel.vue` split as the cure. W6's gate lands
  **only on the enforce arm** — on the default arm W6 lands the two prose-cite strikes and nothing
  else.

## Stale-doc-in-code

The `eslint.boundary.config.js` banner ("NOT merged, EXPECTED RED" — it is merged and green),
the `vite.config.ts` head-hints two-game rationale, the `useSession.ts` "THREE MESSAGES" (four),
the self-contradicting `eslint.config.js` barrel comment — all cited in the audit, all fixed
here under the W0 cite-symbols ruling.

## The Fraunces double-ship and the LOC record

- Fraunces ships twice (16KB gz inline + standalone); lazy the inline copy into the bake
  (`fonts.ready` is already awaited) — 16KB gz off the critical path, no behavior change.
- The LOC record disagrees with itself three ways (CLOSE ≈+2,300, README/AUDIT ≈+550, measured
  +5,535/−1,007) and the "six lanes net −75" is off by ~1,270 in the wrong direction. Re-derive
  all three sites from the tree; the parsimony verdict is a separate question the honest numbers inform.

## Acceptance

Every dead lane wired or deleted; every dual path collapsed; the two masked fallbacks fixed and
the census regex extended; every vacuous gate made to bite (each ablation-proven); the inline-test
and god-module gates born-RED-landed; the stale comments corrected; Fraunces lazied; the LOC
sites re-derived. No aliases, no shims, no dual paths survive.
