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
| No god modules over 500 lines | 2026-07-04 · 3× | none—U-09's two splits landed (`builder/assignment.rs` 284 L, `cage.rs` tests extracted); the budget itself is BAL-10's question, default = the budget retires at the T7 WGATE |
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
| **A rig states which tree it measured, before it measures.** `web/frontend/dist/` is `.gitignore`d, carries no commit, and belongs to whichever lane last ran `npm run build` — so an unstamped run's numbers are attached to nothing. Every rig's AUDIT prepend opens with the build-identity line, and a rig that cannot derive one does not print numbers. Two banked bites: pass 5's `dist/` held an **ABLATE** build and every lane that measured `npm run preview` without rebuilding measured the ablation unknowingly (D6-G3); and the class reproduced **inside the session that closed it** — the same dist changed entry chunk between two readings five minutes apart, rebuilt by a concurrent lane (`…/pass7/D/logs/g3-caught-live.log`). The `--served` arm subsumes §3's `assert-the-SPA is tree-blind` trap: the SPA gate proves the port serves THE app, this proves it serves YOUR app | 2026-08-02 (D6-G3, pass-6 lane D) | `web/frontend/scripts/dist-identity.mjs` (`--self-test` **6/6**, mismatch arm reds against a real socket) — called by `perf-rig/run-safari.sh` and `run-sim.sh`, both **exit 4** when identity won't derive; discipline row 2 of `perf-rig/README.md` §Banked-run-id |
| Evidence isn't an exemption: text-first, crops only, ≤150 KB per image, ≤2 MB per wave; a breach blocks the gate | 2026-07-12 (T4-W0 ballot B1) | `docs/tranches/EVIDENCE-POLICY.md` + `scripts/check-evidence-policy.mjs`, enforced for the first time at T5-W1.3 |
| Deploys stand alone; runs are SHA-pinned; conclusions read from the field—never gate on an echo after a pipe | 2026-08-01 (CH-57, after a deploy ran on a RED CI) | `scripts/ci-conclusion.sh` (own `gh run view --json conclusion` call, verdict off a variable) feeding `scripts/deploy-gated.sh`, which refuses a stale, unpinned, or non-success artifact |
| Deploy only via `npm run deploy`; never bare `npx wrangler`—the packument re-resolution OOMs node's heap | 2026-07-12 | `web/frontend/package.json` `deploy` → `scripts/deploy-gated.sh` (the wrangler line moved verbatim) + the pinned `wrangler ~4.116.0` devDep; the deploy stays owner-authorized per deploy |
| npm ≥11—npm 10 mis-resolves the lockfile | 2026-07-15 | `web/frontend/package.json` engines `{node:>=24, npm:>=11}` + eight `Pin npm >=11` steps across `ci.yml` |
| Numbers are re-derived on the enforcing platform at the citing commit; if one command can't re-derive it, it doesn't get stated | 2026-07-31 (lessons, family 5) | `scripts/check-doc-truth.mjs`—13 canon rows, ten of them born RED at `71456713`; CI `doc-truth` job |
| **An unbanked `2>/dev/null` is how a false number is born.** No instrument discards a stream it didn't bank: a rig line that silences stderr banks the silenced stream beside its output, or the number it prints does not exist. MEASURE's "an unbanked gate does not exist" (`2026-08-tranche-5/evidence/audit/r2/design-loop-open-rows.md:291`, discipline item 3) one stream down—a gate that never ran leaves a hole, a gate whose stderr was eaten leaves a number, and the second is worse | 2026-08-02 (A6-G4, pass-6 Lane A) | convention—**two banked bites, both re-derived at citation**: (1) `git show "$sha:path"` under zsh mangles the ref, and with `2>/dev/null` on the line the `grep -c` downstream returns a silent, confident **0** on five refs whose true count is **1**—reproduced with its own falsifier at `2026-08-tranche-5/evidence/design-loop/pass7/A/logs/A7-10-zsh-swallowed-stderr-bite.log`, the trap row itself in §3; (2) pass-5 lane A's `vite --port 4231 --strictPort` bind failure, **banked and discarded on discovery**, which left a run against another lane's tree looking valid all the way through assert-the-SPA (`…/design-loop/pass5/A/A-report.md` §5.3). No script greps a rig for a swallowed stream |
| A ruling lands in the same commit as the diff to its enforcing config or job, born-RED proven; a ruling that exists only in prose doesn't exist | 2026-07-31 (family 2) | convention—the discipline this whole file serves |
| A platform claim closes only on that platform's real engine or device; harness numbers are footnotes, never gates | 2026-07-31 (family 1) | convention—E8 device smoke is still the only thing that closes an iOS claim |
| The second occurrence of a defect class means write the countable invariant first, then fix; every exception ships a named re-entry trigger | 2026-07-31 (family 3) | `e2e/filter-census.spec.ts` against `src/pencil/config/filterBudget.ts` is the worked example (census 9, exact-match allowlist) |
| Deploy per seal; the production pass—console/CSP clean, assets 200, one real interaction—is inside the close gate | 2026-07-31 (family 4) | `2026-08-tranche-5/waves/T5-WGATE.md` |
| Audition the incumbent or native alternative on the real surface before building its replacement; measure a change against its own stated metric | 2026-07-31 (family 6) | convention—the digit pad was built, shipped, and deleted without the native input ever being tried |
| A trap converts to repo config on its second bite—a pin, an engines field, a fail-fast assertion—never another ledger row | 2026-07-31 (family 7) | convention; the pins that exist (wrangler, in-repo prettier config, engines) are what it looks like when honored |
| **An SFC comment edit is an artifact change.** `@vitejs/plugin-vue` hashes the WHOLE source text — comments included — into the `data-v-` scoped id, so a comment-only restamp in any `<style scoped>` SFC moves the entry hash and renames every chunk downstream of the import map. Re-derive the artifact hash after ANY `.vue` edit; never assert comment-neutrality. Blast radius measured on the worked example: one comment restamp in `GameBoard.vue` swapped 1 of 32 scoped ids and RENAMED 17 of 39 assets with zero real content differences | 2026-08-02 (P7F3-G1, pass-7 F3 — ablation-proven both directions) | convention + the worked example at `2026-08-tranche-5/evidence/design-loop/pass7/F3/logs/artifact-hashes.log`; the one-artifact discipline (audit builds once, md5s) is the standing catch |
| **The π attestation reads the estate, not `e2e/goldens/` alone.** `.gitignore:48`'s `*.png` makes `git status --porcelain e2e/goldens/` structurally blind to PNGs minted elsewhere under `e2e/` — eight fossils sat in a `-snapshots/` dir through a whole pass, invisible to every porcelain check. A lane's close runs `check-golden-bytes.mjs` (its fossil arm sweeps all of `e2e/`), not a porcelain glance | 2026-08-02 (P7X-B4, pass-7 audit) | `web/frontend/scripts/check-golden-bytes.mjs` fossil arm — already CI-enforced (`test:golden:bytes`); the lane-close half is convention, written here |

---

## 3. Traps carried

Environment failures that bit, got diagnosed, and stay written so nobody rediscovers them from zero.

- **prettier global-shadow**—closed by the in-repo `web/frontend/.prettierrc.json` **for files under `web/frontend/` only**, which is narrower than this row read until 2026-08-02. Prettier resolves config per FILE, walking up from that file's directory: the repo-root `scripts/` walks past a repo that has no config of its own and lands on `$HOME/.prettierrc.json`—measured, not supposed (`prettier --find-config-path ../../scripts/ledger-diff.mjs` → `$HOME`, `tabWidth: 4`), while a runner with no `$HOME` config answers with prettier's own defaults. Two answers for one file. Closed the rest of the way by pinning `--config .prettierrc.json` on the gate line. Re-entry: any bare `--write` lint, or any new format scope OUTSIDE `web/frontend/` added without the pin.
- **prettier scope**—**RESTAMPED 2026-08-02 (D6-G1/D6-G5, pass-7 lane D).** Was `prettier --check src/` only. Now `--check --config .prettierrc.json src/ scripts/ ../../scripts/`: **both** script directories are in scope and named—`web/frontend/scripts/` and the repo-root `scripts/` (its three `.sh` have no prettier parser and are skipped). Ten files were unformatted at `4b28f034` and were formatted in the same commit as the gate line, all ten proven behaviour-identical pre/post (stdout+exit byte-equal modulo two self-printed timestamps). `e2e/` is still hand-matched and never swept—that half of the row stands.
- **K46**—`hmr.port: 3000` desyncs from `--port` overrides by construction; name the app port explicitly or check `lsof`.
- **cp314**—host Python 3.14 is PyO3-incompatible; the backend runs 3.13 via `uv`.
- **fmt-in-gates**—the format check belongs in its own CI gate, never folded into a build lane that masks it.
- **cwd-drift**—compound shell inherits a drifted working directory; every compound command opens with an absolute path.
- **hand-rolled wire fixture**—a spec that re-types a versioned wire format drifts from the codec's grammar, and the drift is INVISIBLE: the app fails closed, degrades to a fresh deal, and the test measures a random board while believing it pinned one (green for the wrong reason, or red misread as a race). FOUR per-spec encoder copies existed; TWO were untagged v0—`share-truth.spec.ts` green-but-hollow for a full wave, the pass-8 affordances harden red-on-the-runner and chased as a permalink/auto-deal race until a replaceState ledger proved the strip was W2's own cure firing on a malformed link (`2026-08-tranche-5/evidence/design-loop/pass8/wire-forensics.md`). The class was DOCUMENTED at W2 in two spec headers and still spawned twice more—a documented trap without an enforcing module converts nothing. Cure: `e2e/wire.ts`, the one encoder every spec imports; `encodeUntagged` exists there solely to assert the refusal. Re-entry: any new spec that puts a board on the wire, any codec version bump.
- **shared-tree HMR**—a dev server reloads under ANOTHER lane's edit and the reload lands mid-test: 5 of 36 rows failed with `navigated to …` in the call log and the deck reset to card 0 (T5-W4 pass-5 Lane A, `A1-40` attempt 1; the same churn is legible in pass 4's own `vite-5321.log`). Not K46—that's a port desync, this is a foreign edit. Re-run on a quiesced server (36/36) or measure a built dist. Re-entry: any e2e or rig run against a dev server on a tree another lane is editing.
- **zsh eats `git show $sha:path`**—zsh applies history-style modifiers after a colon, so `git show "$c:web/…"` expands to a mangled path and `git` errors; with `2>/dev/null` on the line it returns a silent, confident **0** from the `grep -c` downstream. Brace the ref: `git show "${c}":"path"`. It bit a pass-6 Lane-A verification and produced a wrong count on five commits before the stderr was looked at. Re-entry: any loop that pins a number at a historical SHA.
- **assert-the-SPA is tree-blind**—`global-setup`'s gate (status, `#app`, title) proves the port serves THE app, never YOUR app: a lane port already holding another lane's dist passes it, and `vite --strictPort`'s failed bind backgrounds silently (pass-5 Lane A banked and discarded one such log). `lsof` the port, then diff the served entry against your own build—`curl -s $BASE | grep -o 'assets/index-[A-Za-z0-9_-]*\.js'` vs `ls dist/assets` (pass-6 Lane A: `index-BNMQu01IbxTY.js` both sides, checked before the arm measured anything). Re-entry: any base URL you did not start this session.
- **wrangler wants node 22**—wrangler segfaults on the node this repo pins, and the repo pins 24 in both places that matter: `web/frontend/package.json`'s `engines` reads `{node: ">=24", npm: ">=11"}`, and every `actions/setup-node` step in `ci.yml` sets `node-version: '24'`. So the deploy path and the pin disagree by construction, and it gates EVERY worker deploy—`web/relay/wrangler.toml` is the relay's whole deploy surface, and `deploy:raw`'s `wrangler pages deploy` is the frontend's. Run the deploy under node 22; the pinned `wrangler ~4.116.0` devDep and `scripts/deploy-gated.sh` are unaffected either way. Re-entry: any wrangler bump, or a node bump on either side—the two pins are cured when one command satisfies both. Booked into this list at T7-W0 on P-6's order.
- **the PyPI name is not ours**—`csp_solver` on PyPI is third-party-owned, so `maturin publish` from `csp-solver/pyproject.toml` (whose `name` and `module-name` both read `csp_solver`) 403s. Nothing in the estate depends on it: the T3 ballot ruled NO PyPI, the Python surface ships through `uv` against the local build, and the crate publishes to crates.io under its own name. Re-entry: an owner reversal of that ballot, at which point the owner is the only actor—a rename or a name claim is account state, not a repo edit. Booked into this list at T7-W0 on P-6's order, from T7-R13b.

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

## The :3000 squat (born T5-W3, third bite)

On any dev box where another service holds `:3000`, both Playwright configs' `webServer
{port: 3000, reuseExistingServer: true}` will latch onto the stranger — on the campaign
machine that stranger is a foreign `palette-api`, and it has eaten three lanes' first runs
(W3 probes, W3 verify, the W3 seal). The enforcing config already exists and held all three
times: `global-setup.ts` asserts the SPA (status, `#app`, title) and throws loudly rather
than letting a foreign page grade the suite. THE PRECEPT: local e2e runs on a contended box
set `PLAYWRIGHT_BASE_URL` at a dev/preview server they started themselves (bands: 4230-4260
for lanes, 4188 reserved for the golden/throttle configs' own webServer), and kill it at
close. CI is unaffected — its `:3000` is the app. Re-entry to silence: none; the guard stays.
