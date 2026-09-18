# T9 integration battery (script run) — `t9/integrate` @ `4b3b19b3`

Deterministic run of every gate, bare, one log per gate under `logs-script/`. 48 gates, 3 non-zero.

| gate | exit | command | proof (last lines) |
|---|---|---|---|
| 00-head | 0 | `git rev-parse --short HEAD; git log --oneline a8fee1f5..HEAD; git status --porcelain; git ` | 7c1fad0b T9-W7 3C-4 repair r1: three comments in neighbouring files stop calling the coarse asymmetry settled design -- the name is the spok · 2534fab0 T9-W7 3B-1 repair r1: the row's header names the ONE rendered surface this cure moves -- the tape; the cell's own name already spok · exit 0 |
| 1a-vue-tsc | 0 | `npx vue-tsc --noEmit` | exit 0 |
| 1b-typecheck-e2e | 0 | `npm run typecheck:e2e` | exit 0 |
| 1c-typecheck-node | 0 | `npm run typecheck:node` | exit 0 |
| 1d-typecheck-relay | 0 | `npm run typecheck:relay` | exit 0 |
| 2a-lint | 0 | `npm run lint` | exit 0 |
| 2b-lint-eslint | 0 | `npm run lint:eslint` | exit 0 |
| 2c-lint-relay | 0 | `npm run lint:relay` | exit 0 |
| 2d-lint-knip | 0 | `npm run lint:knip` | exit 0 |
| 2e-lint-boundary | 0 | `npm run lint:boundary` | > eslint --no-config-lookup --config eslint.boundary.config.js src/games · exit 0 |
| 3-test-font-coverage | 0 | `npm run test:font-coverage` | exit 0 |
| 3-lint-ink | 0 | `npm run lint:ink` | exit 0 |
| 3-lint-catch | 0 | `npm run lint:catch` |   arrow form      `.catch(() => {})`  →  1 swallow(s), RED as required; the pre-W6 head saw 0 — the structural miss this cures ·   quoted in prose `/** … .catch(() => {}) … */`  →  0 swallow(s), GREEN as required · exit 0 |
| 3-lint-theme-selectors | 0 | `npm run lint:theme-selectors` |       → RED (want RED) ·       → RED (want RED) · exit 0 |
| 3-lint-theme-tokens | 0 | `npm run lint:theme-tokens` | negative control (re-add --color-input): RED as required · check-theme-tokens: 0 unreferenced @theme tokens · exit 0 |
| 3-lint-tdz | 0 | `npm run lint:tdz` | negative control (a synthetic game importing the table): RED as required · exit 0 |
| 3-lint-lanes | 0 | `npm run lint:lanes` |       → GREEN (want GREEN) ·       → GREEN (want GREEN) · exit 0 |
| 3-lint-sleep | 0 | `npm run lint:sleep` |   ✓ GREEN — a sleep before a read that feeds NO assertion in the window ·   ✓ RED — an EXEMPT entry that no longer resolves to a site · exit 0 |
| 3-lint-motion | 0 | `npm run lint:motion` |       → RED (as it must) ·       → RED (as it must) · exit 0 |
| 3-lint-copy | 0 | `npm run lint:copy` |   jargon · twin — the same plural table in the player's words  →  0 offence(s), GREEN as required ·   admissions · a ghost admission is detected stale  →  1/1, RED as required · exit 0 |
| 3-lint-live-regions | 0 | `npm run lint:live-regions` |   violation · a region born under v-if with its sentence already inside  →  1 finding(s), RED as required ·   control   · the cured idiom: unconditional region, conditional content  →  0 finding(s), GREEN as required · exit 0 |
| 3-test-support-floor | 0 | `npm run test:support-floor` |   BITES  1 FLOOR DECLARED — an entry that is not a floor · PASS — 0 violation(s), 0 blind check(s) · exit 0 |
| 4a-unit-report-coverage | 0 | `npm run test:unit:report -- --coverage` |   useSudoku.ts     \|   46.66 \|       25 \|    42.1 \|   48.14 \| 72-78,127-137 ·  ...es/sudoku/data \|   33.33 \|        0 \|       0 \|   33.33 \| · exit 0 |
| 4b-unit-count | 0 | `npm run test:unit:count` | FE unit lane — 830 executed (830 passed / 0 failed), 0 skipped, 0 todo, over 68 files / 270 suites; floor 729; report age 0.2 min. ·   floor stamped: 4686436f · 2026-09-17 · T9-W3+W6 seal 2026-09-17 — the spoken product and the substrate, 810 rows · exit 0 |
| 4c-coverage-floor | 0 | `npm run test:coverage:floor` | src/games/sudoku    \|     4 \|   62.71% \|   68.75% \|   53.33% \|   60.78% · [coverage-floor] GREEN — 12 scopes at or above the W1.14 baseline (bank: f38c5130, 2026-08-01). · exit 0 |
| 4d-unit-relay | 0 | `npm run test:unit:relay` |  Test Files  1 passed (1) ·       Tests  24 passed (24) · exit 0 |
| 5a-dist-identity-selftest | 0 | `node scripts/dist-identity.mjs --self-test` |   ok   a server serving ANOTHER tree's entry is RED (as it must) ·   ok   the same entry on both sides passes · exit 0 |
| 5b-golden-bytes | 0 | `npm run test:golden:bytes` | [golden-bytes] engine/template: ok   single implicit engine (chromium), no {projectName} needed  (playwright-golden.config.ts) · [golden-bytes] PASS — 8 goldens (pinned at 8), 92.5 KB of a 110.0 KB estate band; paired, consumed, decodable, tracked; no fossils. · exit 0 |
| 5c-vite-build | 0 | `npx vite build --config .vite-integrate.config.ts --logLevel warn` | exit 0 |
| 5d-dist-identity | 0 | `node scripts/dist-identity.mjs --dist dist` | exit 0 |
| 5e-prod-shake | 0 | `npm run test:prod-shake -- dist` | [prod-shake] PASS — the dev tuner is fully tree-shaken from production. · exit 0 |
| 5f-deploy-gate | 0 | `npm run test:deploy-gate` | [self-test] ok    dirty-in-chain — RED · [self-test] pair arms: 7/7 (1 GREEN sound pair, 6 RED on a plant, none deployed) · exit 0 |
| 5g-edge-probe | 0 | `npm run test:edge-probe` | ok    no CSP is no refusal — true · ok    the refusal line is the browser's — Refused to load the script 'https://static.cloudflareinsights.com/beacon.min.js/v4513226cdae' beca · exit 0 |
| 5h-dist-greps | 0 | `echo 'solver finishes the board:'; grep -rl 'solver finishes the board' dist \| wc -l; echo` | exit 0 |
| 6a-doc-truth-selftest | 0 | `node scripts/check-doc-truth.mjs --self-test` | PASS  index-css-bound  expect RED · got RED · 129 PASS / 0 FAIL — every row proved both colours · exit 0 |
| 6b-doc-truth | 0 | `node scripts/check-doc-truth.mjs` | GREEN  index-css-bound · 0 RED / 42 GREEN — canon holds · exit 0 |
| 6c-ledger-diff | 0 | `node scripts/ledger-diff.mjs --require-ledger --assert-state --verify-cites --self-test` | VERDICT ·   GREEN — 5 audited rows present-or-cited; 4 open ledger rows current under ORPHAN · FREEZE · TERMINALITY · FOLD-TARGET · PROBE · DUPLICATE  · exit 0 |
| 6d-evidence-policy-selftest | 0 | `node scripts/check-evidence-policy.mjs --self-test` | [evidence-policy] self-test PASS — 22/22 cases. · [evidence-policy] PASS — every image, every wave and every banked dist within policy. · exit 0 |
| 6e-evidence-policy | 0 | `node scripts/check-evidence-policy.mjs` | [evidence-policy] PASS — every image, every wave and every banked dist within policy. · exit 0 |
| 6f-npm-audit | 0 | `npm audit --audit-level=high --package-lock-only` | exit 0 |
| 6g-gen-latency | 0 | `npm run test:gen-latency` | ok     kenken/6x6/MEDIUM     median       2.0 ms  max       2.6 ms  ceiling      50.0 ms  givens   3 · ok     kenken/6x6/HARD       median       1.6 ms  max       2.0 ms  ceiling      50.0 ms  givens   3 · exit 0 |
| 7a-servers | 0 | `curl -s http://127.0.0.1:4254/ \| grep -o 'index-[A-Za-z0-9_-]*\.js' \| head -1; curl -s htt` | exit 0 |
| 7b-goldens | 0 | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4254 npx playwright test -c playwright-golden.config.` |   4 passed (1.9s) · exit 0 |
| 7c-goldens-status | 0 | `git status --porcelain e2e/goldens e2e \| head -20; echo '(must be empty: no baseline moved` | exit 0 |
| 8-visual-regression | 0 | `INTEGRATE_BASE_URL=http://127.0.0.1:4254 npx playwright test -c playwright-integrate.confi` |   24 passed (14.6s) · exit 0 |
| 9a-e2e-full-cured | 1 | `INTEGRATE_BASE_URL=http://127.0.0.1:4254 PLAYWRIGHT_JSON_OUTPUT_NAME=/Users/mkbabb/Program` |   3 failed ·   469 passed (3.6m) · exit 1 |
| 9b-reds-base | 1 | `INTEGRATE_BASE_URL=http://127.0.0.1:4255 npx playwright test -c playwright-integrate.confi` |   7 failed ·   29 passed (1.3m) · exit 1 |
| 9c-reds-cured-rerun | 1 | `INTEGRATE_BASE_URL=http://127.0.0.1:4254 npx playwright test -c playwright-integrate.confi` |   4 failed ·   32 passed (1.1m) · exit 1 |

## Non-zero exits

- 9a-e2e-full-cured: exit 1
- 9b-reds-base: exit 1
- 9c-reds-cured-rerun: exit 1
