# Precepts

The standing edicts and instrument laws, one row each, with the thing that actually enforces them.

**Why this file exists.** An edict re-uttered is an edict unencoded. The three most re-uttered orders in
this estate—no-workarounds 8×, model routing 8×, no-legacy 6×—are the three with the weakest repo-durable
encoding; the two edicts that did get mechanical enforcement haven't been re-uttered since T3. So every row
below carries its enforcement pointer, and where none exists the row says so in plain words. Counts and
born-dates come from `2026-08-tranche-5/evidence/audit/r2/prompt-recap-matrix.md` §10 and
`.../r1/cc-prompt-ledger.md` §2, re-read at `71456713`.

**Home, and why it's here.** T5-W6.1 specified `docs/precepts/working-precepts.md`. That path is a `160000`
submodule of `mkbabb/precepts` (`8781ebb06c03`)—a file written there lands in another repo or fails. The W0
seal's adjudication 4 ruled the file into this repo's own campaign home instead: here, beside
`EVIDENCE-POLICY.md`, submodule untouched. `scripts/check-doc-truth.mjs`'s `install-pin-0.5` row already
forbids any published README or `docs/*.md` from linking into `docs/precepts/`; this file's own consumer
cleanliness is proven separately by W6's four-probe leak grep (`evidence/w6/precepts-leak-grep.txt`, zero on
all four across 14 surfaces).

**Reading a row:** precept · born · enforced by. "Convention" means exactly that—a rule people follow, with
no gate that bites. It's stated, never dressed up.

---

## 1. The re-exhorted edicts

| Precept | Born · re-uttered | Enforced by |
|---|---|---|
| No quick solutions, no workarounds—idiomatic, gestalt; architectural transposition over the patch | 2026-03-04 · **8×** | convention—no mechanization exists, and it's the most-repeated order in the estate |
| No legacy code: clean breaks, no aliases, shims, dual paths, masking fallbacks | 2026-03-04 · **6×** | `web/frontend/knip.json` via `npm run lint:knip`, CI `frontend` job (`ci.yml:658`) |
| Recap ALL prompts; silent drops forbidden | 2026-07-04 · **6×** | convention—the 137-row recap matrix is the artifact, no script re-derives it |
| Fold every deferred and chronic row; re-booking forbidden | 2026-07-04 · **6×** | `scripts/ledger-diff.mjs --require-ledger` against `docs/tranches/LEDGER.md`—mechanized at T5 after nine rows were dropped, not decided, at T4 (U-11) |
| Batches of 5–6 agents in parallel (3 before the 2026-07-31 loop) | 2026-07-04 · 52 cron replays + 3 | convention—the workflow scripts, session-side |
| No unsubstantiated claims, editorializing, or comparison sentiments; docs carry no meta language | 2026-03-04 · 3×, then MIKE-STYLE | convention—T4-W14's meta-leak grep was a one-time sweep; no script survives it |
| Recursive colocation, all directories, both stacks | 2026-03-04 · **4×** | `web/frontend/eslint.config.js` + `eslint.boundary.config.js`; CI `frontend` (`ci.yml:650`) and `boundary` (`ci.yml:831`) jobs |
| All design routes through a Fable agent and the frontend-design plugin, actually invoked | 2026-07-04 · **6×** | convention—the design-loop charters (`evidence/design-loop/charter-f{1..5}.md`) |
| Core model orchestrates and adjudicates; Opus fans out; every spawn declares its model | 2026-07-04 · **8×** | convention—the routing lives in session memory, outside this repo |
| No god modules over 500 lines | 2026-07-04 · 3× | none—regressed (U-09: `builder/assignment.rs` 607 L, `constraint/cage.rs` 558 L); T5-W2.7 splits them |
| Tranche development only—no source edits land from a formulation prompt | 2026-07-04 · 5× | convention—the plan-folder-only write surface |
| Concrete deliverables: file:line, a failing probe, a named defect row; status reports rejected | 2026-07-12 · 4× | convention—the born-RED gate table in every wave file |
| Withhold the favored success narrative from most auditors | 2026-07-12 · 3× | convention—the R1/R2 lane briefs |
| Born-RED gates; π and DELTA for every visual claim, the red re-proven at the base SHA | 2026-07-12 · 4× | `gates.json` `bornRed` rows + the wave-file grammar; W0's ten RED rows are the worked example |
| Never push bbnf-lang origin | 2026-07-06 · every close | `sync-csp-solver-vendor.sh`—bbnf-side, not in this repo; here it's convention (CH-50) |
| The java branch stays | 2026-07-11 · 6 standing blocks | convention (CH-17) |
| The owner's dev server on :3001 stays alive, never killed | 2026-07-06 · **4×** | convention; `:3000` strays killable per K46, `:4288`/`:3001` untouched |
| SOTA dep currency both stacks—no 2021 cargos, no stale deps | 2026-07-07 · 3× | CI `cargo-audit` (daily) and `npm-audit` jobs; the dependabot zero-open gate |
| Session durability—lose no progress to a rate or session wall | 2026-07-10 · 3× | the wall runbook lives in session memory, outside the repo; the AUDIT-prepend, null-guard, and run-id-at-launch conventions ride the workflow scripts |
| Continue indefatigably; don't relinquish control until the plan is complete in totality | 2026-07-05 · **5×** | convention—no mechanization exists |
| The thrice design protocol—Fable ∥ Opus compete orthogonally, a third Fable adjudicates into an apotheosis | 2026-07-31 · 2× | convention—the protocol lives in session memory, outside the repo |
| Extreme parsimony: process-lite, code-heavy, fewer LOC, library-level thinking | 2026-07-31 · 2× | convention—same home, same gap |
| Convergence is earned: ≥3 full passes, zero enumerated gaps, a non-author audit, two clean passes | 2026-07-31 · 1× | `evidence/design-loop/pass{1..4}-registry.md`—the loop's own law, no script |
| Full shadcn abrogation, components and style; prune the unused, overfit, and contrived | 2026-08-01 (as a recall) · 1× | none—U-01, the original utterance is in neither corpus; W2 executes the order's concrete kills |
| Background-only browser and simulator sessions; never steal the owner's focus | 2026-08-01 · 1× | §4's headless-only law—U-02/CH-45 |
| A design mark closes only on an owner-side re-look, never on an internal gate; until then the record states the ladder position, not the closure | 2026-08-01 (U-10, T5-W0.10) | convention—the toggle mark took three attempts and the Safari mark two before this rule existed |

---

## 2. Instrument laws

What the record can't verify, an instrument verifies—and the instrument has its own discipline.

| Law | Born | Enforced by |
|---|---|---|
| State-pinning: every rig comparison pins `game/size/difficulty` on the URL—state is localStorage-per-origin, so two ports don't share a board | 2026-07-31 (CH-55) | `web/frontend/perf-rig/README.md:110`; convention—the rig doesn't refuse an unpinned run |
| Interleaved or quiesced only: theme and gallery cells adjudicate interleaved with their control or on a quiet host—never as a block, never against a number 20 minutes old | 2026-07-31 (CH-55) | `perf-rig/README.md:137-140`; the drift is measured (galleryGlide 85.16→81.33 over 23 min, monotone) |
| A settle is polled, never slept | 2026-07-31 (P1 goldens) | `web/frontend/e2e/visual-golden.spec.ts:23,106,122`—`.poll()` on the `.is-active` handoff, then on the glyph |
| The quiet window: after `npm run deploy`, idle ~2 minutes polling only the HTML before touching any `/assets/*` through the zone | 2026-07-31 (edge-cache poisoning, reproduced twice) | convention, atop the `_redirects` 404-guard and 12-char hashed URLs (`981353c0`) |
| Mint from the runner: a shifted linux golden is re-minted from the CI runner artifact of record, never re-baselined locally | 2026-07-15 (T4 traps) | the `playwright-report` artifact, CI `e2e` job (`ci.yml:1070-1073`); convention on top of it |
| Sun-crest floors: darwin soul 0.017; linux coarse 0.05 on the two non-convergent surfaces (logo-light, toggle-crest-dark) | 2026-07-15 | `e2e/visual-golden.spec.ts:50,193`—and never re-baseline on a single red |
| Goldens run against the built `dist`, never a live dev server | 2026-07-15 | `web/frontend/playwright-golden.config.ts`; the foreign `:3000` and the owner's `:3001` stay untouched |
| Evidence isn't an exemption: text-first, crops only, ≤150 KB per image, ≤2 MB per wave; a breach blocks the gate | 2026-07-12 (T4-W0 ballot B1) | `docs/tranches/EVIDENCE-POLICY.md` + `scripts/check-evidence-policy.mjs`, enforced for the first time at T5-W1.3 |
| Deploys stand alone; runs are SHA-pinned; conclusions read from the field—never gate on an echo after a pipe | 2026-08-01 (CH-57, after a deploy ran on a RED CI) | `scripts/ci-conclusion.sh` (own `gh run view --json conclusion` call, verdict off a variable) feeding `scripts/deploy-gated.sh`, which refuses a stale, unpinned, or non-success artifact |
| Deploy only via `npm run deploy`; never bare `npx wrangler`—the packument re-resolution OOMs node's heap | 2026-07-12 | `web/frontend/package.json` `deploy` → `scripts/deploy-gated.sh` (the wrangler line moved verbatim) + the pinned `wrangler ~4.116.0` devDep; the deploy stays owner-authorized per deploy |
| npm ≥11—npm 10 mis-resolves the lockfile | 2026-07-15 | `web/frontend/package.json` engines `{node:>=24, npm:>=11}` + eight `Pin npm >=11` steps across `ci.yml` |
| Numbers are re-derived on the enforcing platform at the citing commit; if one command can't re-derive it, it doesn't get stated | 2026-07-31 (lessons, family 5) | `scripts/check-doc-truth.mjs`—13 canon rows, ten of them born RED at `71456713`; CI `doc-truth` job |
| A ruling lands in the same commit as the diff to its enforcing config or job, born-RED proven; a ruling that exists only in prose doesn't exist | 2026-07-31 (family 2) | convention—the discipline this whole file serves |
| A platform claim closes only on that platform's real engine or device; harness numbers are footnotes, never gates | 2026-07-31 (family 1) | convention—E8 device smoke is still the only thing that closes an iOS claim |
| The second occurrence of a defect class means write the countable invariant first, then fix; every exception ships a named re-entry trigger | 2026-07-31 (family 3) | `e2e/filter-census.spec.ts` against `src/pencil/config/filterBudget.ts` is the worked example (census 9, exact-match allowlist) |
| Deploy per seal; the production pass—console/CSP clean, assets 200, one real interaction—is inside the close gate | 2026-07-31 (family 4) | `2026-08-tranche-5/waves/T5-WGATE.md` |
| Audition the incumbent or native alternative on the real surface before building its replacement; measure a change against its own stated metric | 2026-07-31 (family 6) | convention—the digit pad was built, shipped, and deleted without the native input ever being tried |
| A trap converts to repo config on its second bite—a pin, an engines field, a fail-fast assertion—never another ledger row | 2026-07-31 (family 7) | convention; the pins that exist (wrangler, in-repo prettier config, engines) are what it looks like when honored |

---

## 3. Traps carried

Environment failures that bit, got diagnosed, and stay written so nobody rediscovers them from zero.

- **prettier global-shadow**—closed by the in-repo `web/frontend/.prettierrc.json`; the shadow re-forms if that file goes. Re-entry: any bare `--write` lint.
- **prettier scope**—`prettier --check src/` only; `e2e/` is hand-matched and never swept.
- **K46**—`hmr.port: 3000` desyncs from `--port` overrides by construction; name the app port explicitly or check `lsof`.
- **cp314**—host Python 3.14 is PyO3-incompatible; the backend runs 3.13 via `uv`.
- **fmt-in-gates**—the format check belongs in its own CI gate, never folded into a build lane that masks it.
- **cwd-drift**—compound shell inherits a drifted working directory; every compound command opens with an absolute path.

---

## 4. The rig

**Headless-only, until the owner provisions otherwise.** GUI Safari and simulator sessions don't run in
these sessions: the owner's standing order is that no browser or simulation session steals his focus, and no
WebKit or macOS-automation MCP is configured. Real-Safari work therefore runs headless—`perf-rig/run-safari.sh`
restores the previous frontmost app unless `KEEP_SAFARI_FRONT=1`, and `perf-rig/validate-headless.mjs` drives
Playwright WebKit as a *driver smoke only*, never as a source of numbers (Playwright WebKit ≠ real Safari).

Born 2026-08-01 (U-02 / CH-45). This is the **default of T5's owner ballot 5**—"provision a WebKit/automation
MCP, or the headless-only law stands written"—which fires at the close if the ballot goes unanswered.

**Re-entry.** The owner provisioning a WebKit or macOS-automation MCP flips this row: the law relaxes to
background-GUI-permitted, and CH-35's device script, CH-39's rotation eye, and CH-40's re-entry unblock with
it. Nothing else reopens it.
