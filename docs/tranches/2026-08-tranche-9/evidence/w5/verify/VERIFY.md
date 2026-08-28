# T9-W5 — NON-AUTHOR VERIFY

The lanes' reports were not read as evidence. Every exit code below was read BARE
(`cmd >file 2>&1; echo $?`), never through a pipe. Every canary was re-planted and
re-executed by this lane; a lane transcript was never accepted as proof of its own RED.

- tree: `4dd9ec9c` + working tree, 2026-08-28, darwin, node v26.0.0
- concurrent: the viewport (W2) and design (W7) workflows were writing `web/frontend/src/**`
  and `e2e/viewport-law.spec.ts` throughout. Those paths are radioactive to this lane —
  read, never written. `src/` grew four more dirty files mid-run
  (`assets/index.css`, `assets/typography.css`, `games/shared/GameBoard.vue`,
  `pencil/chrome/OptionSelector/OptionSelector.vue`), so every src-reading gate was
  re-run at the end of the pass; the closing sweep is the reading that stands.

---

## 1 · Every gate the wave touched, run bare

| Gate | Invocation | Exit | Verdict |
|---|---|---|---|
| doc-truth self-test | `node scripts/check-doc-truth.mjs --self-test` | **0** | 125 PASS / 0 FAIL |
| doc-truth tree | `node scripts/check-doc-truth.mjs` | **1** | **3 RED / 38 GREEN — see §5 F-1, F-2** |
| ledger-diff (CI arms) | `--require-ledger --assert-state --verify-cites` | **0** | 9 arms, GREEN |
| ledger-diff self-test | `… --self-test` | **0** | 19 arms × (violation RED / control GREEN) |
| check-unit-count | `check-unit-count.mjs <report>` | **0** | 735 ≥ 661, band 625 |
| check-unit-count self-test | `--self-test` | **0** | 2 reds / 2 greens |
| check-unit-count restamp | `--restamp --dry <report>` | **0** | round-trips: 661 → 661 |
| check-pw-projects | `check-pw-projects.mjs` | **0** | 8 checks, 11 projects |
| check-pw-projects self-test | `--self-test` | **0** | all arms both colours |
| check-pw-projects restamp | `--restamp --dry` | **0** | **0 of 11 floors move** |
| deploy gate refusals | `deploy-gated.sh --self-test` | **0** | 11/11 (4 cleanliness + 7 pair) |
| deploy gate cleanliness | `deploy-gated.sh --check-tree` | **1** | RED on the live dirty tree — correct |
| edge-probe self-test | `edge-probe.mjs --self-test` | **0** | 14/14 offline |
| edge-probe local | `edge-probe.mjs --local` | **0** | 2 GREEN through a Pages emulator |
| knip | `npx knip` | **0** | clean |
| vite build | `npx vite build` | **0** | `index-D_2r8xxEbj54.js` |
| dist-identity self-test | `--self-test` | **0** | 6/6, real socket |
| dist-identity dist | `--dist dist` | **0** | 43 files / 801.5 KB |
| prod-shake --dist | `test:prod-shake -- dist` | **0** | 25 chunks, 5 symbols absent |
| **golden-bytes** | `test:golden:bytes` | **1** | **RED — see §5 F-4 (local-only)** |
| check-copy-register | `check-copy-register.mjs` | **0** | 136 files, 25-entry lexicon, 2 admitted |
| check-copy-register self-test | `--self-test` | **0** | dash + jargon + admissions arms |
| check-font-coverage | `check-font-coverage.mjs` | **0** | 2 faces, both directions derived |
| check-ink-pressure | `--self-test` | **0** | crossing GATED, one admitted ruling |
| check-lane-membership | `--self-test` | **0** | corpus = both script dirs |
| check-theme-selectors | `--self-test` | **0** | + in-band population canary over 140 files |
| lint:sleep / lint:motion | `--self-test` | **0 / 0** | executed in the frontend lane |
| lint:catch / lint:tdz / lint:theme-tokens | `--self-test` | **0 / 0 / 0** | |
| check-evidence-policy | bare | **0** | |
| check-inline-tests | bare | **0** | |
| check-support-floor | `--self-test` | **0** | |
| check-gen-latency | `--self-test` | **0** | 10/10 under ceiling |
| **coverage floor** | `npm run test:coverage:floor` | **1** | **RED — see §5 F-3** |
| prettier | `npm run lint` | **0** | |
| eslint | `npm run lint:eslint` | **0** | |
| boundary law | `npm run lint:boundary` | **0** | |
| relay units | `npm run test:unit:relay` | **0** | 1 file / 24 tests |

### doc-truth's self-test, audited row by row

The sentence "every row proved both colours" was not taken on the script's word. Parsing
its own transcript: **41 rows exercised, 125 fixtures, 0 rows missing a colour**. Every
row carries at least one `expect RED · got RED` **and** one `expect GREEN · got GREEN`.
The charter's 11 no-RED-fixture rows are closed, and the corpus is 125 fixtures, not the
49-over-21 the ci.yml comment at :1409 still quotes (F-6).

The tree run resolves the same 41 rows (3 RED / 38 GREEN), so the self-test corpus and
the graded corpus are the same set — no row proves itself on a fixture it never grades.

### The two restamp arms — V4's mechanism, checked

`--restamp --dry` on both gates moves **0 floors**. On `theme-quadrants-{chromium,webkit}`
it derives 12 and keeps 14 under `max(banked, derived)` — the exact site where V4
reproduced the arm exiting 1 on an unmoved tree. The ratchet is the cure and it holds.

---

## 2 · Canary audit — every RED below was planted and executed by THIS lane

Restores verified by md5 against a pre-plant copy, not by inspection.

| # | Gate | Plant (in the real tree, never a fixture) | Plant | Restore |
|---|---|---|---|---|
| C1 | knip | delete `scripts.test:golden:magnitude` from package.json | **1** — "Unused files (1) scripts/golden-magnitude.mjs" | **0**, md5 identical |
| C2 | lane-membership | new `web/frontend/scripts/zzz-verify-canary.mjs`, no lane, no declaration | **1** — "NOTHING RUNS IT" | **0** |
| C3 | lane-membership | new `scripts/zzz-root-canary.mjs` declaring NOT-A-LANE with a 20-char shrug | **1** — check 2, floor 40 chars | **0** |
| C4 | check-unit-count | `unit.floor` 661 → 624 in the real stamp | **1** — out of band, owes 625 | **0**, md5 identical |
| C5 | check-unit-count | `unit.census.executed` 735 → 900 (the stamp as a wish) | **1** — stamp above the tree | **0** |
| C6 | check-pw-projects | `chromium.floor` 198 → 170 in the real stamp | **1** — check 8, owes 188 | **0** |
| C7 | check-copy-register | empty the `ADMITTED` ledger | **1** — 2 unadmitted hits at **real** sites `GameControlPanel.vue:917` and `:1210` | **0**, md5 identical |
| C8 | check-font-coverage | drop `"Level"` from the Fraunces corpus | **1** — named **five real** `src/games/*/spec.ts` files: "THIS IS THE RANSOM NOTE" | **0**, md5 identical |
| C9 | check-font-coverage | declare `"Zwölf"` (glyphs outside the cut) | **1** — `misses "Z" "ö"` against the parsed woff2 cmap | **0** |
| C10 | check-ink-pressure | move `RANK_RULING.dark` to a rank the tree does not have | **1** — "a rung, a register or a ground was re-pitched" | **0**, md5 identical |
| C11 | ledger-diff DUPLICATE | second `CH-65` row in real §1 | **1** — 1 finding, arm reaches 172 rows | **0**, md5 identical |
| C12 | ledger-diff TERMINALITY | `CH-98 \| OPEN (T8-W3)` in real §1 | **1** — 1 finding | **0** |
| C13 | ledger-diff CITES | `web/frontend/src/App.vue:99999` in a real row | **1** — 1 finding | **0** |
| C14 | doc-truth | `tests/ 25` → `tests/ 999` in the real README | **1** — 4 RED, exactly one more than the tree's 3 | **0**, md5 identical |
| C15 | prod-shake (dist lane's own negative control) | `vite build --mode ch62-probe` | **1** — `__bakeAdmission` in `dist-ch62/assets/index-DpbjoC3MdVm9.js` | **0** on `dist` |
| C16 | deploy gate | none needed — RED live on the dirty tree | **1** | n/a |

**No gate was found rigged to red only on its fixture.** C7, C8 and C14 are the decisive
ones: each printed real file paths and real line numbers from the tree, not fixture stubs.
C2/C3 confirm the lane-membership corpus reaches **both** `web/frontend/scripts/` and root
`scripts/` — V5's name-shaped escape is closed in both directions.

`git status | grep -c zzz` = 0. No canary residue.

### A trap this lane fell into and reports against itself

A bare `node scripts/ledger-diff.mjs` runs **ORPHAN + FREEZE only**. C11–C13 all returned
**exit 0 on the plant** under that invocation and looked like three dead arms. They are
not: `TERMINALITY, FOLD-TARGET, PROBE, DUPLICATE, ONE-HOME, LIVE-REGION` are gated behind
`--assert-state` and `CITES` behind `--verify-cites` (ledger-diff.mjs:1864-1870). Both
call sites that matter carry all three flags — ci.yml:1422 and deploy-gated.sh:436 — and
the lane's own banked evidence used the full invocation. `--self-test` does **not**
short-circuit the tree grading: the CI line grades 41 rows and 9 arms after its fixtures.
Booked as F-7: the bare invocation is a false-GREEN generator for any human who types it.

---

## 3 · ci.yml

- **YAML parses whole** (`yaml.safe_load`), **18 jobs**, up from 17 at HEAD — `dist` is the
  new one, `needs: [build-lean-wasm]`, 14 steps.
- **Browserless holds.** `grep -nE '^\s+(run|uses):.*(playwright|puppeteer|browser-actions|setup-chrome)'`
  returns **no hits** (exit 1). Every `playwright`/`webkit`/`chromium` token in the file is
  inside a comment. The `dist` lane builds and reads bytes; it starts no browser.
- **The lane-map header agrees with the jobs**: the numbered rows name 18 distinct job ids
  and every one exists (`lint, rust, py-compile, py-runtime, wasm, build-lean-wasm, twiggy,
  wasm-publish-dryrun, frontend, fe-unit, boundary, iai, cargo-audit, evidence-policy,
  doc-truth, npm-audit, gen-latency, dist`). Numbering skips 9 and 14 and doubles 2/3 onto
  `rust`; that is cosmetic and pre-existing.
- **`ch62-probe.yml` is intact** — not deleted, as instructed. Its live function
  (the `__bakeAdmission` census) now also rides the `dist` lane's negative control.
- **The floors' provenance split is closed in ci.yml**: the ">=300" prose at :55 and the
  "300 … live is 477 … 59% of slack" block at :919 are both gone, replaced by rows that
  name `web/frontend/scripts/census.stamp.json` and deliberately carry no number. The
  stamp's own `_ci_prose` field and gates.json's `ciProseHandoff` both still describe this
  as OPEN — they are stale (F-5).

---

## 4 · Suites

- `npx vitest run` → **`Test Files 57 passed (57)` · `Tests 735 passed (735)`**, matching
  the stamp's `census.executed 735 / files 57` exactly. The floor is not stamped from a
  stale count.
- `web/relay` → 1 file / 24 tests, exit 0.
- **`cargo test --workspace` was NOT run and did not need to be**: `git status csp-solver/`
  is **empty**. No lane touched rust. No red flag.

---

## 5 · Findings

**F-1 · BLOCKING — the wave's own change reds its own gate.** `ci-lane-count` is RED:
ci.yml now runs **18** jobs and `README.md:112` still says *"seventeen (17) lanes"*, with a
prose list that ends at npm-audit. The `dist` lane is W5 §5.3's; README is untouched at
HEAD. `gates.json:58` compounds it, calling dist the *"17th browserless lane"*.
Seam: `README.md:112`, `docs/tranches/2026-08-tranche-9/gates.json:58`.

**F-2 · Not W5's, but it reds W5's gate.** `root-readme-e2e-counts` and
`e2e-total-arithmetic` are RED: derived 437 tests / 24 files (508 total), README says
409 / 23 (480). The delta is **exactly 28** — `playwright test --list | grep -c viewport-law`
= 28 — so this is the concurrent viewport wave's untracked `e2e/viewport-law.spec.ts`.
It also means the pw stamp's `chromium 221 / webkit 216` bakes in an **untracked** file;
gates.json names this and gives tracked-only lives of 207/202, both above the 198/194
floors, so the band absorbs it. Whoever lands viewport-law owes README:96 and :99.

**F-3 · BLOCKING — the coverage floor was wired and the tree is RED.** §5.4's first row
moved `test:coverage:floor` from `--self-test` to the real run and wired it at ci.yml:1067.
`npm run test:coverage:floor` exits **1** on three branch floors:
`src/games/futoshiki.branches 90.24% < 93.47%`, `killer.branches 95.45% < 100%`,
`kenken.branches 96.00% < 100%`. None of those three directories is dirty, so the breach
is at HEAD and the wiring merely revealed it — which is the row working. It is still an
uncured RED in the `fe-unit` lane and must be cured or given a decided row before the seal.
Never by re-cutting the T5-W1.14 baseline, which the script's own failure text forbids.

**F-4 · Local-only, and the gate is right.** `test:golden:bytes` exits **1** on two
defects, both caused by one thing: 8 fossil PNGs in the **gitignored**
`e2e/visual-golden.spec.ts-snapshots/`, minted by a local Playwright golden run in this
working tree. Measured: goldens **94,768 B**, fossils **50,266 B**, total **145,034 B**
against a 112,640 B ceiling. Goldens alone are 15.9% under it, so the `dist` lane is GREEN
on a fresh CI checkout. The chair must know that running this gate locally after a golden
run reds it — and that the RED is the fossil class the gate exists to catch, not a bug.

**F-5 · Two stale self-descriptions of a handoff that is already closed.**
`census.stamp.json._ci_prose` and `gates.json.floors.ciProseHandoff` both assert ci.yml
"still carries the third home in prose — line ~55 … lines ~919-922". It does not; both
sites now point at the stamp. Two documents describing an open hole that was cured is the
precise disease §5.2 was formed to kill.
Seam: `web/frontend/scripts/census.stamp.json` key `_ci_prose`;
`docs/tranches/2026-08-tranche-9/gates.json` key `floors.ciProseHandoff`.

**F-6 · A count that moved and a comment that did not.** ci.yml:1409 says doc-truth
self-tests "49 fixtures over 21 rows at land". Measured now: **125 fixtures over 41 rows**.
Seam: `.github/workflows/ci.yml:1409`.

**F-7 · The bare ledger-diff invocation is a false-GREEN generator.** Seven of nine arms
are flag-gated. `node scripts/ledger-diff.mjs` prints `GREEN … exit 0` over a ledger
carrying a duplicate id, a sealed-tranche wave on an open row, or a cite past EOF — this
lane produced all three. Both real call sites carry the flags, so nothing enforced is
broken; the hazard is the human at a terminal, and the verdict line names only the arms it
ran without saying which it skipped.
Seam: `scripts/ledger-diff.mjs:1864-1870`, and the `VERDICT` printer at :1975.

**F-8 · The wave retired the SPA fallback and left the README claiming it.**
`_redirects` now ships `/*  /404.html  404` with the fallback deliberately retired.
`README.md:116` still reads *"`_redirects` carries two rules: the `/assets/*` → `/404.html`
guard … and the SPA fallback."* — unchanged from HEAD (md5-verified), now false.
doc-truth's `redirects-rule-count` row passes because it counts **rules** (2) and derives
their targets correctly; no row grades the **claim about what the second rule does**.
Seam: `README.md:116` (and :41's "SPA fallback — inert at the edge", now doubly wrong);
gate seam `scripts/check-doc-truth.mjs` row `redirects-rule-count`.

**F-9 · `dist-ch62/` is not gitignored.** `web/frontend/.gitignore` covers `dist/` and
`dist-throttle/` only. The dist lane's negative control writes `dist-ch62/`, which on a
developer machine becomes untracked dirt inside a **shipped path** — and
`deploy-gated.sh`'s cleanliness arm then refuses the deploy. Harmless in CI (fresh runner),
a real footgun locally. This lane created and removed its own `dist-ch62/`.
Seam: `web/frontend/.gitignore`.

**F-10 · No deploy or network act occurred.** No `~/.wrangler` and no wrangler credential
store exists on this machine. `web/relay/.wrangler` and `web/frontend/.wrangler` hold only
local `dev` state directories with **no file newer than 2026-08-27**. The only network
reads this lane made were to `127.0.0.1` sockets it started itself
(`dist-identity --self-test`, `edge-probe --local`). Nothing was published anywhere.

### Not findings — checked and clean

- **No gate rigged to its fixture** — C7/C8/C14 print real tree paths (§2).
- **No floor stamped from a stale count** — 735/57 measured live equals the stamp (§4).
- **No deleted gate with a surviving script** — every `check-*.mjs`, `golden-*.mjs` and
  `dist-identity.mjs` in both script dirs is named by a lane or declares NOT-A-LANE with a
  cite ≥40 chars; `lint:lanes` GREEN and C2/C3 prove it bites. `deploy:raw` is gone from
  package.json **and** its knip appeasement moved to `ignoreDependencies: ["wrangler"]`
  with the consumer named — C1 proves knip resolves referents rather than trusting comments.
- **No doc-truth fixture proving one colour twice** — 41/41 rows carry both (§1).
- **`golden-magnitude.mjs`** — §5.4's "wired or deleted" resolved as KEPT-and-declared: the
  false knip `entry` is gone, the real referent is `scripts.test:golden:magnitude`, and the
  file carries a NOT-A-LANE header citing O-12 and this wave's evidence.
- **`check-theme-selectors`** — V5-C2's vacuity is cured in-band, not only in `--self-test`:
  check 0 plants `[data-canary-theme]` over the live 140-file corpus every run.
- **`check-golden-bytes.mjs`'s carve-out** — the dated NOT-A-LANE header is retired in the
  same diff as the ci.yml step that runs it, as §5.3 requires.
- **`ch62-probe.yml`** — present, untouched.

---

## 6 · git status census — every dirty path, and who owns it

| Path | Owner | Verified |
|---|---|---|
| `.github/workflows/ci.yml` | W5 dist + floors | 18 jobs, browserless, header agrees |
| `docs/benchmarks.md` | W5 doc-truth | lean-wasm platform stamps; `lean-wasm-4-sites` GREEN |
| `docs/tranches/2026-08-tranche-9/gates.json` | W5 floors | F-1, F-5 |
| `docs/tranches/LEDGER.md` | W5 ledger | GREEN under all 9 arms; C11–C13 |
| `scripts/check-doc-truth.mjs` | W5 doc-truth | +1344 lines; 41 rows / 125 fixtures |
| `scripts/deploy-gated.sh` | W5 deploy | 11/11 refusals; RED on the live dirty tree |
| `scripts/ledger-diff.mjs` | W5 ledger | 9 arms; F-7 |
| `?? scripts/edge-probe.mjs` | W5 deploy | 14/14 self-test, `--local` GREEN |
| `?? scripts/rollback-to-seal.sh` | W5 deploy | worktree recipe, replaces the never-moves-HEAD precept |
| `web/frontend/knip.json` | W5 wired-or-deleted | C1 |
| `web/frontend/package.json` | W5 wired-or-deleted | `deploy:raw` gone; 3 scripts added |
| `web/frontend/public/{404.html,_redirects}` | W5 deploy | fallback retired; F-8 |
| `web/frontend/scripts/check-copy-register.mjs` | W5 wired-or-deleted | C7 |
| `web/frontend/scripts/check-font-coverage.mjs` | W5 wired-or-deleted | C8, C9 |
| `web/frontend/scripts/check-golden-bytes.mjs` | W5 dist | carve-out retired; F-4 |
| `web/frontend/scripts/check-ink-pressure.mjs` | W5 wired-or-deleted | C10 |
| `web/frontend/scripts/check-lane-membership.mjs` | W5 wired-or-deleted | C2, C3 |
| `web/frontend/scripts/check-prod-shake.mjs` | W5 dist | C15 |
| `web/frontend/scripts/check-pw-projects.mjs` | W5 floors | C6, restamp round-trip |
| `web/frontend/scripts/check-theme-selectors.mjs` | W5 wired-or-deleted | in-band population canary |
| `web/frontend/scripts/check-unit-count.mjs` | W5 floors | C4, C5, restamp round-trip |
| `web/frontend/scripts/dist-identity.mjs` | W5 dist | 6/6 |
| `web/frontend/scripts/{golden-magnitude,golden-selfdelta}.mjs` | W5 wired-or-deleted | NOT-A-LANE declarations |
| `?? web/frontend/scripts/census.stamp.json` | W5 floors | the one stamp; F-5 |
| `web/relay/{relay.ts,relay.test.ts,wrangler.toml}` | W5 deploy | `/revision`, `RELAY_REVISION` var, bare-deploy line removed; 24/24 |
| `web/frontend/src/**` (16 files) | **NOT W5** — concurrent viewport/design waves | read only; grew 4 files mid-run |
| `?? web/frontend/e2e/viewport-law.spec.ts` | **NOT W5** — viewport wave | 28 tests; drives F-2 |
| `?? docs/…/evidence/w2/` | **NOT W5** — viewport wave | |
| `?? docs/…/evidence/w5/` | W5, all six lanes + this record | |
| `?? web/frontend/dist-w2{-before,-after,b}/` | **NOT W5** — viewport wave build scratch | **unowned by any gate; see below** |

**One unowned residue.** `web/frontend/dist-w2-before/`, `dist-w2-after/` and `dist-w2b/`
are untracked build scratch in a shipped path. No `.gitignore` rule covers them (unlike
`dist/` and `dist-throttle/`), so they refuse `deploy-gated.sh --check-tree` and would be
committed by a `git add -A`. They belong to the concurrent viewport wave, not to W5. They
must be deleted or ignored before any deploy — the same class as F-9.
