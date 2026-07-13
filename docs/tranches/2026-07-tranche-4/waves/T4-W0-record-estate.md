# T4-W0 — Record + estate truth

**The anchor: dismiss the phantom debt, re-true the frozen ledger, prune the estate, and put four decisions on the ballot before any demolition begins.** No product code here — this wave makes the record honest at the point the tranche opens, and lands the three estate rulings (repo bloat, 0.4.0 publish, deploy contract) the audit surfaced as orphans. Every row is a DECIDED disposition or an owner ballot; nothing is re-booked.

**Dependencies**: none. **Effort**: S.

---

## Scope

### The 9 phantom dependabot alerts — RETIRE (FAM-12 / D1, DISEASE, 2 closes)

The single hardest lie in the census. 9 open dependabot alerts, **every manifest `web/api/uv.lock`** — a path deleted wholesale at `98fe2562` (T2-W2 abrogation, 2026-07-10). Two are HIGH (starlette form-limit DoS; starlette SSRF/NTLM-via-UNC in StaticFiles), five medium, two low. Booked as a justified-hold at T2-W1, its own trigger fired at W2, folded into T2-WGATE as an owner reminder, then **dropped from the T3 census entirely** (`C-deferred-disposition.md`, A13, A14 all silent). Rode two closes unactioned.

- **DECIDED — RETIRE.** Bulk-dismiss all 9 in GitHub as `dismissed / no_longer_relevant` (reason: manifest removed at `98fe2562`). One owner-side action; empties the dashboard to its true actionable count (0) so a genuine future alert can't hide in phantom noise.
- Real exposure is nil (code deleted, never deployed) — this is record-truth, not security.

### Re-true recap appendix B — the java row FIRST (FAM-12 / F1–F4)

`docs/tranches/2026-07-tranche-3/appendices/B-prompt-recap.md` declares itself verified against base `3b75eca2` and was last written at `23e89339` (2026-07-10 19:08) — **before any execution-era owner audit**. It is frozen pre-execution and carries one live reversal.

- **F1 (borderline P0) — the java-stays reversal.** The owner ruled **"The java branch STAYS"** (E1, 2026-07-11); three record locations still order its deletion as an open action: `docs/tranches/2026-07-tranche-3/README.md:135`, `:129`, and `B-prompt-recap.md:34,110` (R5 "the one open action … `java` delete … carried to WGATE"). Appendix B §5 "Reversals registered this session" (lines 99–106) lists R4/D2/N9/R9 but **not** java-stays — §5 was authored one day before the ruling and never reconciled. An executor following the WGATE reminders would delete a branch the owner ordered kept. **Fix FIRST**: register the java-stays reversal in B §5; strike the three delete-orders; keep the worktree-purge half (valid) separately.
- **F2 — the frozen ledger.** Every E-series owner audit (E1–E7: the drawer feature, "completion still preposterous / performance god awful," the toggle recut, the boil non-performance, the OOM, "kill all crons," the Safari profile) has **zero rows** in appendix B — documented in README §3a/§3b prose only. The governing mandate is "recap ALL prompts." Absorb E1–E7 into B with dispositions.
- **F3 — E6 "Kill all crons, too" (2026-07-12) has no recap row.** `grep -rin "kill all cron" docs/tranches/` → 0. The only cron-cleanup on record is the WGATE `CronDelete efaae137` (authoring recovery-cron, predates E6, answers T2-2's guardrail — not E6's "kill ALL"). Enumerate live crons at wave start (`CronList`); kill any that survive; home the ask with the disposition.
- **F4 — T3-2's "deploy workflows to specify" sub-ask is unrecapped.** `grep -rin "deploy workflow" docs/tranches/2026-07-tranche-3/` → 0. Likely subsumed by the `npm run deploy` pipeline (`65425697`) but the connection is undrawn — a silent partial. Home it into the deploy-contract row below.

### Prune the 44 worktree-* branches + tag truth (FAM-12/14)

- **44 merged orphan `worktree-*` branches** (FAM-14, r2) — the R5 worktree-purge half, valid and owner-side. Prune the merged set; the on-disk worktree count is already 1 (r1-plan-diff), so this is branch hygiene, not worktree teardown.
- **App release tags stall at `v0.2.0`** while the crate publishes `0.3.0` (FAM-12, r2) — tag `v0.3.0` at the matching SHA so the app tag line tracks the published version.
- **`pre-morph-excision` is a byte-dup tag** (FAM-12, r2) — resolve (retag to the true excision SHA or drop the duplicate); record which.

### Repo-bloat DECISION — ballot B1 (FAM-15, CONFIRMED exact)

Measured on a fresh `--no-local` clone: **full `.git` = 97 MB, `--depth 1` shallow = 48 MB** — ~97 MB pulled to obtain ~2.6 MB of code. `docs/tranches/**` = **76 MB** of the tracked tree; all tracked `*.png` = **70 MB across 420 files** (~95% of the tracked payload). No LFS (`.gitattributes` absent, `git lfs ls-files` empty). (The local `.git/lost-found` = 875 MB is `git fsck` residue, never pushed — excluded.)

- **Ballot B1 (recommended first):** prune evidence PNGs to load-bearing + adopt a size policy going forward, vs git-LFS-migrate `docs/tranches/**/*.png`, vs status quo. The tranche-IV evidence dir opens under whatever B1 rules — small crops, not full-viewport PNGs (binds every later π golden; see W2).

### Core 0.4.0 crates.io publish DECISION — ballot B2 (FAM-12 / D5)

`csp-solver/Cargo.toml:3` and `wasm/Cargo.toml:3` both declare `0.4.0`; crates.io tip is **0.3.0** (`max_version` = 0.3.0). The tree outruns the registry by a full minor with no named owner/trigger/wave — an orphan version-ahead, one close ridden, on track to chronic.

- **Ballot B2 (recommended):** publish core 0.4.0 to crates.io at W0 (the pyo3-abi3 wheel + crate are already at 0.4.0 in-tree) vs hold with a named owner+trigger. Either kills the orphan.

### Deploy contract documented in-tree (FAM-14 + T3-2/F4 + E6)

The in-repo deploy doc **describes another project's infra** (FAM-14). Replace with the true contract, homed in-tree:

- Deploy via **`npm run deploy` only** — the npx-packument-OOM trap (bare `npx wrangler` OOMs; deploy is `wrangler 4.110.0` pinned + `npm run deploy`, resolved at `65425697` / E6).
- Cloudflare Pages project = `sudoku`, production branch = `master` (lowercase); token at `~/Programming/value.js/.env`; owner self-deploys (wrangler unauthenticated locally).
- Rollback = repin the prior version and re-run `npm run deploy`.
- This row also homes T3-2's "deploy workflows to specify" (F4).

### Browser matrix + en-only + no-telemetry DECLARED in-tree (FAM-15/14)

Three undeclared design decisions get a declared-decisions row in-tree at W0 (W14 re-states them in the product docs under MIKE-STYLE):

- **Browser matrix** (FAM-15, CONFIRMED): CI is chromium-only (`ci.yml:482` installs chromium alone; `playwright.config.ts` has no `projects` array); Safari known-broken (fixed at W1), Firefox passes (r3 C4). README carries unqualified "solves entirely in the browser" (`README.md:3`). Declare the supported set + the Safari status honestly.
- **en-only** (FAM-15, CONFIRMED): no i18n machinery (`grep -rin i18n` → 0), `index.html:2` `<html lang="en">`. Declare en-only by design.
- **no-telemetry** (FAM-14): the app makes one third-party network hit (the attribution avatar) and no telemetry. Declare no-telemetry by design.

### Estate disposition ledger — orphans DECIDED here

Terminal rows for the record-adjacent seeds (per M2/M5; re-booking forbidden):

- **`keyframes.js` → RETIRE** — the house motion grammar is settled (CSS vars + WAAPI); the T3 "keyframes.js our lib?" question is answered by the estate. CLOSED-REJECT covenant already at `App.vue:61-64`; record it terminal.
- **bbnf cadence → DECLARE** — sync-on-solver-release, scripted (`bbnf-lang/scripts/sync-csp-solver-vendor.sh`, never-push, `--check` green at HEAD, r2-cross-repo). Out-of-repo standing; declare it, no action.
- **`propagate_stratified` → confirm RETIRE** — removed from tree at `d78fef8e`, backlog-filed with owner+trigger+byte-recovery (HEALTHY). W13's cage primitives (two n-ary `revise_impls`) do **not** want it (authoring-lane check: the n-ary walls are cage-sum/cage-product, not stratified propagation). Terminal-retire.
- **`mod.rs` flip → DECIDED-build W4** (D6); **prettier shadow → DECIDED-build W4** (D2); **W8 idle-chunking → DECIDED W1** (D7); **GPU tile residue → superseded-by W1** (D4, verify at its gate) — pointered here, executed in their waves.

## Gates

| Gate | Value |
|---|---|
| Anchor | base SHA stamped; tranche-IV evidence dir opened under the B1 policy; every W0 row below green or noted owner-side |

Component checks (born RED at HEAD unless marked):

| Gate | Value (current failing probe → target) |
|---|---|
| dependabot | `gh api repos/mkbabb/csp-solver/dependabot/alerts --jq '[.[]\|select(.state=="open")]\|length'` = **9 today** (all `web/api/uv.lock`) → **0** after bulk-dismiss `no_longer_relevant` |
| recap-java | `grep -c "java.*delete\|delete.*java" docs/tranches/2026-07-tranche-3/README.md B-prompt-recap.md` = **3 delete-orders today** → **0**; B §5 lists the java-stays reversal (absent today) |
| recap-ledger | E1–E7 rows in appendix B = **0 today** (`grep -cin -E "drawer\|OOM\|safari\|kill all cron" B-prompt-recap.md` → incidental only) → E1–E7 each carry a disposition row |
| crons | `CronList` enumerated at wave start; any live cron killed; E6 "kill all crons" homed (no row today) |
| branches | merged `worktree-*` count pruned (`git branch --merged \| grep -c worktree-` → 0 after); `v0.3.0` tag present (absent today); `pre-morph-excision` dup resolved |
| bloat | B1 ratified; clone cost recorded (97 MB full / 48 MB shallow today); evidence policy in force |
| publish | B2 ratified; crates.io `max_version` = 0.3.0 today → 0.4.0 published (if B2=publish) or orphan re-filed with owner+trigger |
| deploy-doc | in-tree deploy doc names `npm run deploy` / Pages `sudoku` / branch `master` / the OOM trap; the other-project infra prose gone (`grep -c "34.197.214.67\|/var/www" <deploy-doc>` → 0 in live doc) |
| declarations | browser matrix + en-only + no-telemetry each carry a declared-decisions row in-tree (0 today) |
| ledger | `keyframes.js`, bbnf-cadence, `propagate_stratified` each terminal; the four pointered rows (mod.rs, prettier, W8-chunk, GPU-tile) name their executing wave |

## π / DELTA

No rendered-pixel surface — W0 touches record, config, and estate only. π/DELTA N/A; the invariant is that the product tree is byte-unchanged (`git diff --stat -- web/frontend/src csp-solver/src` = 0 for W0's own commits).

## Seeds

- `r1-chronic-ledger.md` §A/§C — D1 (dependabot phantom, the two-close trace), D5 (0.4.0 orphan), D6 (mod.rs), D2 (prettier); the full census table with dispositions.
- `r1-prompt-recap.md` §F1–F4 — the java reversal, the frozen appendix B, E6 kill-all-crons, T3-2 deploy-workflows.
- `r3-quiet-pass.md` §N1 + `r4-verify-r3new.md` Row 1 — the 97 MB/48 MB clone, 420 PNGs = 70 MB = 95% tree, no LFS (measured exact).
- `r4-verify-r3new.md` Rows 2/3 — browser-matrix + en-only confirmed; `r2-security.md` (d) — no-telemetry / secrets clean.
- `corpus/owner-prompts.md` E6/E1 + standing constraints — "Kill all crons, too"; "The java branch STAYS"; the deploy contract (Pages=sudoku, branch=master, token path).
- `r2-cross-repo.md` (a)/(b) — bbnf vendor clean; app tags stall at v0.2.0; `pre-morph-excision` byte-dup.

## Residual risks

- **Dependabot dismissal + 0.4.0 publish + branch prune are owner-side** — W0 lands the decisions and the record; the GitHub/registry actions execute on the owner's next pass. The gate accepts "pending-owner" as a recorded state, as T3-W2 did for the CF Pages redeploy.
- **B1's PNG prune is destructive to history** — LFS-migration rewrites tracked blobs; prune-to-load-bearing drops evidence. Ratify B1 before touching the tree; the tranche-IV evidence dir must not repeat the bloat regardless of which arm wins.
- **The java reversal must be struck in prose, not from memory** — verify the three delete-order strings against the live README/appendix text (the same grep-hole discipline as T3-W2's blacklist); a reversal registered in B §5 but left live in README:135 is still a lie in the record.

---
## Execution record (2026-07-12)

Executed at base `ed35b347` — workflow `wf_fbd2aeaa-90d`, five lanes in two 3-wide batches (A record-retrue · B branches-tags · C dependabot-publish · D contracts-ledger · E png-prune). Born-RED bank: `../evidence/w0/gates-born-red.md`.

| Gate | Born-RED | Close |
|---|---|---|
| dependabot | 9 open | **0** — #50–58 dismissed with the spec comment verbatim (API note below) |
| recap-java | 4 un-annotated delete-orders | **0 un-annotated** — 5 mentions survive, every one carrying REVERSED/SUPERSEDED/STAYS; B §5 registers the java-stays reversal |
| recap-ledger | 0 E-rows | B §6 carries E1–E7 + E6·crons + T3-2·deploy (9 rows) |
| crons | — | enumerated at open: zero live (`CronList` empty); E6 closed by enumeration |
| branches | 44 merged | **0** — 44 pruned; `worktree-wf_977ec162` deleted (content verifiably in master); `worktree-wf_34cf008e` KEPT (unlanded mimalloc/profile-split/alloc_count/restart-nogood attack work — ledgered) |
| tags | v0.3.0 absent | annotated `v0.3.0` → `3b75eca2`, pushed (crates.io 0.3.0 created 18:30:03Z; commit 18:35:53Z; `csp-solver/src` byte-identical to pre-publish HEAD); `pre-morph-excision` RESOLVED-truthful — direct parent of the excision `d9781e29`, the v0.2.0 coincidence kept |
| bloat | 420 PNGs / 70 MB | 302 orphans pruned (55.45 MB), 115 load-bearing kept (13.2 MB), zero broken references (symmetric before/after resolver); policy in force at `docs/tranches/EVIDENCE-POLICY.md` |
| publish | crates.io 0.3.0 | **0.4.0 published** (147 files, dry-run clean, no `--allow-dirty`) — `max_version` verified 0.4.0 |
| deploy-doc | 2 foreign-infra files | `deploy.md` + `domains.md` rewritten to the true contract (npm-run-deploy only, the packument trap named, Pages `sudoku`/`master`, rollback recipe); `tls.md` + `blob-backend-dr.md` excised (wholesale foreign Mongo runbooks); the IP//var/www grep CLEAN |
| declarations | 0 | `docs/precepts/declared-decisions.md` — browser matrix, en-only, no-telemetry, each stamped 2026-07-12 |
| ledger | — | keyframes.js RETIRED · bbnf cadence DECLARED · propagate_stratified RETIRED-terminal; pointered rows name their waves (mod.rs/prettier→W4, W8-chunk/GPU-tile→W1) |
| π/DELTA | — | N/A held: `git diff --stat -- web/frontend/src csp-solver/src` empty across the wave |

Reconciliations (recorded, not silent): the recap-java component probe's literal count-to-zero conflicts with F1's annotate-don't-delete order — executed to F1; zero *un-annotated* mentions is the gate's meaning, history preserved. The dependabot REST API rejects `no_longer_relevant` (422 — a code-scanning value); `not_used` is the dismissal of record, comment verbatim. `spike/iai-callgrind` (local + origin, `ff5d9de3`) recorded for W2's iai lane. `docs/precepts` is a submodule — the contract + declaration edits commit and push there; the pointer bumps here.
