# r3-quiet-pass — the quiet-pass sweep (round 3)

Read: full registry, all r1/r2/x reports. Hunted the explicit checklist + free. HEAD `65425697`, master.
Verdict at bottom. Machine block mirrors StructuredOutput.

## NEW findings

### N1 — evidence-PNG bloat inflates every clone (P2, NEW) — family: repo-estate-bloat
Tracked tree = **81,164 KB**; of that **77,372 KB (95%) is `docs/tranches/**` evidence**, and **71,276 KB is 420 tracked PNGs**. History carries **322 distinct PNG blob versions** (tranche-over-tranche churn). No git-LFS (`.gitattributes` absent; `git lfs ls-files` empty).
- True transfer cost, measured by bare `--no-local` clone: **full = 97 MB, `--depth 1` shallow = 48 MB.**
- Named cost: every contributor clone pulls ~97 MB to obtain ~4 MB of actual code (csp-solver 156 files + web 121 files); CI checkout likewise.
- EVIDENCE DISCIPLINE — the `du -sh .git` = **986 MB is a red herring**: `.git/lost-found` = 875 MB is LOCAL `git fsck` residue, never pushed, irrelevant to clone cost. Do not book 986 MB. The real packed history is `.git/objects` ≈ 110 MB / clone 97 MB.
- Anchors: `docs/tranches/2026-07-tranche-2/evidence/execution/T2-W8-gate/ssim-*/*.png` (24 files, ~0.6 MB each), `docs/tranches/2026-07-tranche-3/evidence/addendum/d1-shots/*.png`.
- Probe (rerunnable): `git ls-files '*.png' | wc -l` → 420; `git clone --bare --no-local file://<repo> /tmp/x.git && du -sh /tmp/x.git` → 97M. No round covered repo size / clone cost / LFS.
- Fix direction: LFS-migrate `docs/tranches/**/*.png`, or move fat evidence out of the code repo (release attachments / separate evidence repo), or shallow-by-policy.

### N3 — no declared browser-support matrix; CI is single-browser; unqualified claims mask known-broken Safari (P2, NEW framing; ties FAM-3+FAM-8) — family: browser-matrix-untested-claim
- CLAIM: `README.md:3` "solves entirely in the browser"; `README.md:107` + `README.md:59` "The PWA installs and plays offline" — **unqualified, no browser matrix anywhere** in README, web/frontend/README, or tranche READMEs.
- TEST: `web/frontend/playwright.config.ts` has **no `projects` array** → single default (chromium). `.github/workflows/ci.yml:480-482` installs **`chromium` ONLY**. No Firefox, no WebKit lane.
- REALITY: Chrome works; **Safari known-broken** (FAM-3 crit 66% w/ six folded kills, `../safari/`); Firefox **never audited until this pass** (see C4 — it passes).
- The unqualified "the browser" + universal "plays offline" copy silently excludes the one engine that degrades. This is the claim-truth surface no round named as a matrix gap (r1/r2 touched Safari perf and doc version-drift, not the support-matrix claim). Note PWA-offline is under abrogation (FAM-6), which moots the offline half but not the browser-matrix half.

### N7 — en-only / no-i18n is an undeclared design decision (P3, NEW) — family: undeclared-design-decision
- No i18n framework (`grep -rin i18n src package.json` → 0 hits; no vue-i18n dep). All copy hardcoded English; `index.html:2` `<html lang="en">`.
- "localization" in `docs/precepts/**` refers to **design-idiom (CSS-token) localization**, NOT language — a false-friend; en-only is never stated as a decision.
- Sibling to the FAM-14 "no-telemetry-by-design undeclared" row: same class, English-only is implicit-by-construction and belongs in a declared-decisions ledger.

## CLEAN certifications (checklist items that held)

### C-futoshiki-size — futoshiki 16×16 question: CLEAN
Futoshiki offers **4×4–7×7** (`web/frontend/src/games/futoshiki/ControlPanel/constants.ts:11-16`, value = board side length directly). Sudoku offers **4/9/16** (`web/frontend/src/games/sudoku/ControlPanel/constants.ts:4-8`, value = subgrid size 2/3/4). **No 16×16 futoshiki by design** — divergent axes, documented in the futoshiki constants doc-comment (F5: "board_size, never the subgrid size"; F3: single-tier, no difficulty). Intentional, not a parity bug. (r2-generation-truth covered density/difficulty; the size-axis divergence is certified here.)

### C-error-taxonomy — 7-code taxonomy post-excision: CLEAN (with one FAM-5 confirm)
`web/api` is **excised** (T2). The FastAPI **7-code taxonomy (400/404/408/422/429/500 + INVALID)** survives ONLY in **historical** `docs/tranches/2026-07-grand-uplift/**` records (not live product claims). The **live** error surface is a coherent **4-code Worker taxonomy** — `INVALID_INPUT | BUDGET_EXCEEDED | UNSAT | WORKER_FAILURE` — with the server rows explicitly **pruned as dead (K1b)** in `web/frontend/src/games/sudoku/solver/classifyError.ts:23-27`. No dangling live "7-code" claim.
- FAM-5 CONFIRM (not new family): `classifyError.ts` **code-body is byte-identical** across sudoku/futoshiki (`diff` on comment-stripped bodies → identical; comments differ). Another instance of the known solver-seam dual-path duplication (r2 arch/cross-repo). Anchors: `src/games/{sudoku,futoshiki}/solver/classifyError.ts`.

### C-css-estate — index.css + scene.css + component styles: CLEAN
Files: `src/assets/index.css` (569 L), `src/assets/typography.css` (269 L), `src/games/shared/scene.css` (143 L). **@layer discipline present** (`@layer base` / `utilities` / `components` — index.css:67,260,269; typography.css:244). **Zero dead top-level class rules**: 48/51 defined class selectors have live `.vue`/`.ts` references; the 3 non-refs (`.googleapis/.gstatic/.woff2`) are URL/comment fragments (`index.css:7-8,45-63`), not selectors. **All 4 `@keyframes` referenced** (`cell-reveal` 4, `pencil-draw-on` 11, `shake` 3, `controls-fade-in` 1). Deep descendant/pseudo-rule deadness is out of grep reach; `keyframes.js` decision already carried by FAM-5.

### C-vite-config — every plugin earns keep: CLEAN (already certified r1-config-census:183)
Re-confirmed: `sudoku-templates` codegen, `head-hints` modulepreload injector, VitePWA all consumed. (VitePWA slated for FAM-6 abrogation, not deadness.) No new finding.

### C-ci-shape — CI wall-time / lane dependency shape: CLEAN-with-note (P3)
`ci.yml` = **9 jobs, ZERO `needs:` edges** — fully flat parallel fan-out (`grep -n 'needs:' ci.yml` → none). Wall-time = **max(lane)** not sum (bounded by py-runtime/e2e timeout-30, iai timeout-20) — GOOD for latency. Cost (cache-mitigated, P3): **Rust toolchain installed 9×**; **lean-wasm artifact rebuilt in ≥3 lanes** (frontend, e2e, twiggy) with no `upload-artifact`/`needs` reuse; **no gating order** (lint never gates build). Not a bug; note for a future CI-DAG lane. Timeout ceilings are generous but not vacuous.

### C4 — Firefox smoke: FULLY FUNCTIONAL (first-ever Firefox audit) — positive cert
Playwright 1.61.1 + firefox-1532 present; :3001 live (200). Read-only smoke (`r3/firefox-smoke.mjs`, rerunnable): page loads (`title` = "sudoku — CSP Solver"), **426 cells/svg render**, **Solve clicked → full solved 9×9 with rainbow ink + "solved it!" star** (`r3/ff-solve.png`). **Zero product console errors** — only Vite **HMR websocket** failures (`ws://localhost:3000`, dev-server artifact, not product). Firefox — flagged "NEVER audited" — passes. (Does not clear WebKit/Safari, which stays FAM-3-broken.)

## Verdict
**NEW-FINDINGS.** N1 (evidence-PNG clone bloat, P2) is a genuinely new family no round touched, with a measured named cost (97 MB clone). N3 (browser-matrix untested claim) is a new framing binding FAM-3+FAM-8. N7 (en-only undeclared, P3) is a new small decision-ledger gap. Balanced by five CLEAN certifications (futoshiki-size, error-taxonomy, css-estate, vite-config, ci-shape) and a positive Firefox cert. This is quiet-pass ONE — it did NOT come back empty; a second quiet pass is still owed before the audit closes.
