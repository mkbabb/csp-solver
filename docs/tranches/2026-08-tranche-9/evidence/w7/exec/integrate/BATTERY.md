# T9 integration battery — `t9/integrate` @ `cf8d53f4`

Worktree `.claude/worktrees/t9-integrate`, branch `t9/integrate`, HEAD `cf8d53f4` = master `a8fee1f5`
+ the six `w7/exec` picks in manifest order (3B-1 · 3B-1 r1 · 3C-4 · 3C-4 r1 · B1 · B1 r1).
Every gate run bare, one log per gate under `logs/`, exit read from an `echo "exit $?"`, never a pipe.
Run 2026-09-18 on darwin/arm64, node 26.0.0.

**VERDICT — GREEN WITH ONE SYMMETRIC RED.** 47 gate rows green. The one e2e row that reds and
stays red, `presence.spec.ts:177`, reds identically on the `a8fee1f5` build; it is the manifest's
G1, already owed to the LEDGER. No asymmetric red anywhere in the battery.

## 0. Preconditions

| check | result |
|---|---|
| `git rev-parse --short HEAD` | `cf8d53f4` |
| `git log --oneline a8fee1f5..HEAD` | six commits, manifest order |
| `git diff a8fee1f5 --stat -- web/frontend/package-lock.json` | empty — lockfile byte-identical to master |
| tree at battery's end | clean but for the two untracked scratch configs below |
| `npm ci` | **NOT RUN by design.** `node_modules` is a symlink to main's, under live W7 pass-2 / W8 lanes; the lockfile is unchanged, so the install proves nothing here and running it would rewrite main's tree. |

Picks touch 12 files — 8 source/spec, 2 scripts, 2 new test files. Zero Rust, zero wasm, zero solver.

Scratch, untracked, never committed: `web/frontend/.vite-integrate.config.ts` (private `cacheDir`),
`web/frontend/playwright-integrate.config.ts` (spreads `playwright.config.ts`, **deletes** its
`:3000` `webServer`, points `baseURL` at the fenced preview). `dist-base/` is locally excluded.

## 1. Typecheck

| gate | command | exit | proof |
|---|---|---|---|
| vue-tsc | `npx vue-tsc --noEmit` | 0 | zero diagnostic lines |
| e2e | `npm run typecheck:e2e` | 0 | clean |
| node | `npm run typecheck:node` | 0 | clean |
| relay | `npm run typecheck:relay` | 0 | clean |

## 2. Lint

| gate | command | exit | proof |
|---|---|---|---|
| prettier | `npm run lint` | 0 | `All matched files use Prettier code style!` |
| eslint | `npm run lint:eslint` | 0 | clean |
| relay eslint | `npm run lint:relay` | 0 | clean |
| knip | `npm run lint:knip` | 0 | clean |
| boundary | `npm run lint:boundary` | 0 | clean |

## 3. The contract gates

| gate | exit | proof |
|---|---|---|
| `test:font-coverage` | 0 | `2 subset faces, each covered as authored AND as transformed`, corpus a superset of what 150 src files render |
| `lint:ink` | 0 | ramp/register crossing gated to exactly one admitted ruling |
| `lint:catch` | 0 | `0 swallow(s), GREEN as required` |
| `lint:theme-selectors` | 0 | every data-attribute selector has a runtime writer; table closed |
| `lint:theme-tokens` | 0 | `0 unreferenced @theme tokens`; negative control RED as required |
| `lint:tdz` | 0 | `TDZ severed structurally — 0 cycle edges, reproduction both ways` |
| `lint:lanes` | 0 | every `.mjs` named by a lane, or NOT-A-LANE with a cite, or exempt with one |
| `lint:sleep` | 0 | no fixed-duration wait before a one-shot assertion, 34 specs |
| `lint:motion` | 0 | `34 specs, every one declaring its motion state` |
| `lint:copy` | 0 | `0 offence(s), GREEN as required` — the gate whose admission B1 struck |
| `lint:live-regions` | 0 | `0 finding(s), GREEN as required` |
| `test:support-floor` | 0 | `0 violation(s), 0 blind check(s)` |

All twelve exist; none reported NOT PRESENT. Each carries its own `--self-test`, so a green here
is a green gate proven able to red.

## 4. Unit

| gate | exit | proof |
|---|---|---|
| `test:unit:report -- --coverage` | 0 | **Test Files 68 passed (68) · Tests 826 passed (826)** — the manifest's expectation exactly |
| `test:unit:count` | 0 | `826 >= 729`; 269 suites; band slack 13% |
| `test:e2e:projects` | 0 | `34 specs, 547 resolved tests`, both engines but the 6 recorded holdouts |
| `test:coverage:floor` | 0 | `GREEN — 12 scopes at or above the W1.14 baseline`; TOTAL 64.47% stmts |
| `test:unit:relay` | 0 | Test Files 1 passed (1) · Tests 24 passed (24) |

The three cure test files (`BoardHost.authors`, `GameBoard.coarseTape`, `DigitCell.attribution`)
all appear in the report.

## 5. Build and dist

| gate | exit | proof |
|---|---|---|
| `dist-identity.mjs --self-test` | 0 | `self-test 6/6 — the instrument can fail on a known-bad dist` |
| `test:golden:bytes` | 0 | `8 goldens (pinned at 8), 92.5 KB of a 110.0 KB estate band; no fossils` |
| `npx vite build --config .vite-integrate.config.ts` | 0 | built to `dist/` on the private cache |
| `dist-identity.mjs --dist dist` | 0 | `index-Cc6TqSXYnbfW.js · index.html md5 2d70ff282b24c8ce0185761beb6fd827 · 43 files / 806.3 KB` |
| `test:prod-shake -- dist` | 0 | `25 bundle chunk(s)`, 5 dev-only symbols absent — `the dev tuner is fully tree-shaken` |
| `test:deploy-gate` | 0 | `11/11 — every refusal this script owns proved able to fire`, none deployed |
| `test:edge-probe` | 0 | `14/14 — every arm proved on fixtures, offline` |

### Dist identity

Entry **`index-Cc6TqSXYnbfW.js`** — the exact name B1 banked across `c391665c` → `e4c45f53`,
now reproduced a fourth time, here, from a clean tree.

wasm in dist: `dist/assets/csp_solver_wasm_bg-BJYevEYE.wasm`, **123,336 B**,
sha256 `b908e586ad84508829edcbcf49080cf05d3bd63d5110390dd078425a9db2fc50` —
byte-identical to `csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm`. **The dist ships the CH-69 build.**

### The forbidden strings, in the built bundle

| string | hits | |
|---|---|---|
| `not all and (hover:hover) and (pointer:fine)` | **0** | minified spelling |
| `not all and (hover: hover) and (pointer: fine)` | **0** | authored spelling |
| `solver finishes the board` | **0** | |
| `solver's answer` | **0** | |
| *positive control* `finishes the board for you` | 1 | present — the grep is proven able to hit |
| *positive control* `revealed answer` | 1 | present |

The deletion is proven against its own control, not merely asserted: the `a8fee1f5` build's
stylesheet **`index-BMuoFtzKf9_k.css`** (the name the manifest banked for main's pre-cure sheet)
carries the minified rule **and** `.attribution-tape[data-v-8195081d]{display:none`. The cured
build's `index-CnZ6MOgqddOE.css` carries zero hits. 7 stylesheets both sides.

## 6. Repo root

| gate | exit | proof |
|---|---|---|
| `check-doc-truth.mjs --self-test` | 0 | `129 PASS / 0 FAIL — every row proved both colours` |
| `check-doc-truth.mjs` | 0 | `0 RED / 42 GREEN — canon holds` |
| `ledger-diff.mjs --require-ledger --assert-state --verify-cites --self-test` | 0 | `GREEN — 5 audited rows present-or-cited; 4 open ledger rows current` |
| `check-evidence-policy.mjs --self-test` | 0 | self-test clean |
| `check-evidence-policy.mjs` | 0 | `64 image pin(s), 5 wave pin(s), 0 dist pin(s)` — **PASS** |
| `npm audit --audit-level=high --package-lock-only` | 0 | 3 moderate, zero high or critical |
| `test:gen-latency` | **1, then 0** | see below |

**What evidence-policy actually read.** This worktree carries no untracked evidence: the
`w7/exec/` tree lives in the MAIN tree, untracked at master. So the gate read the *tracked*
estate only — 64 grandfathered image pins, 5 wave pins, 0 banked dists. The manifest's
"the new evidence dirs must clear its caps" is therefore **NOT PROVEN HERE**; it must be re-run
in the tree where those directories are staged, at the fold.

### `test:gen-latency` — a red that was the box, proven

First run exit 1: `killer/16x16/MEDIUM` max 2476 ms vs a 1200 ms ceiling; `killer/16x16/HARD`
max 8672 ms vs 2100 ms. Two of ten cells bust.

The picks contain no Rust, no wasm and no change to `check-gen-latency.mjs`
(`git diff a8fee1f5..HEAD` on that path is empty; `cmp` against `git show a8fee1f5:…` says
IDENTICAL), and `csp-solver/wasm/pkg` is a symlink — so base and HEAD are the *same program on
the same binary with the same seeds*. Run that way:

| run | killer 16×16 MEDIUM max | killer 16×16 HARD max | exit |
|---|---|---|---|
| HEAD, first | 2476 ms | 8672 ms | 1 |
| **base program**, same binary | 237 ms | 918 ms | 0 |
| HEAD, re-run quiet | 494 ms | 1947 ms | 0 — `10/10 cells under ceiling` |

A ~10× wall-time swing on identical work: machine load, not code. **Gate green on re-run.**
One row worth booking anyway: killer 16×16 HARD at 1947 ms leaves only 7% under its 2100 ms
ceiling on a quiet box — a thin margin this battery did not cause and does not cure.

## 7. Goldens, off the built dist

Preview: `npx vite preview --config .vite-integrate.config.ts --host 127.0.0.1 --port 4254
--strictPort`, serving `index-Cc6TqSXYnbfW.js` (confirmed over the wire).

| gate | exit | proof |
|---|---|---|
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4254 npx playwright test -c playwright-golden.config.ts` | 0 | **4 passed (16.9s)** |

No `--update-snapshots`. No baseline moved.

## 8. `visual-regression.spec.ts`, both engines

**Viewport coverage — the chair's question answered: ONE of the intake's three.** Every row in
this spec rides the config default **1280×800**; the only explicit `viewport:` in the file
(`:790`, the iPad coarse card) re-declares 1280×800 to pair it with a coarse pointer. **Neither
390×844 nor 820×1180 is exercised by this spec.** So gap **G12** (820×1180, both engines) is
*not* closed by gate 8 — it stays open.

| run | exit | rows |
|---|---|---|
| cured, first | 1 | 23 passed, **1 failed** — `[webkit] :569 the deal receipt keeps off the commit verb, hover included` |
| cured, re-run | **0** | **24 passed (50.6s)** |
| base (`dist-base`) | 0 | 24 passed (41.7s) |
| the row alone, cured, ×3 | 0 ×3 | passed every time |
| the row alone, base, ×3 | 0 ×3 | passed every time |

The failing assertion is **the spec's own injected negative control**, `:659`
`expect(broken.gap).toBeLessThan(0)` — it adds a broken `grid-area: 1 / 1` style and requires the
clearance to collapse. On webkit under load it read 2.39 instead of < 0. The two *product*
assertions above it (rest clearance, hovered clearance, receipt width) passed in every run,
including the failing one. Nothing in the picks touches `.deal-row` or `.difficulty-tally`.
**Gate green; the flake is the control arm, and it is load-bound.**

All 24 rows, both engines, green on the settled run:
12 chromium (`:124 :231 :263 :322 :388 :404 :466 :544 :569 :707 :790 :875`) and the same 12 webkit.

## 9. The full e2e battery, both engines, against the built dist

The gate no lane had run (manifest G2).

| run | exit | result |
|---|---|---|
| full, both engines, parallel | 1 | **448 passed · 24 failed · 4 skipped (17.9m)** |
| the 24 reds, re-run serially `--workers=1` | — | **21 cleared**, 3 persisted |
| the 3, run quiet | — | **2 cleared** (masthead ×2), **1 persists** |

Every one of the 24 first-run failures landed at 22–37 s, i.e. *at* the 30 s test timeout —
the signature of starvation, not of assertion. The box was carrying two preview servers, the
full parallel battery, and main's live lanes.

### The 21 that cleared on a serial re-run

chromium `font-census:231`, `multiplayer:728`; webkit `access:375`, `drawer:394`, `drawer:453`,
`font-census:231`, `futoshiki:107`, `gallery:860`, `join-language:69`, `join-language:134`,
`masthead:112` (light + dark), `multiplayer:320`, `multiplayer:347`, `multiplayer:649`,
`multiplayer:728`, `spoken-controls:174`, `viewport-law:136`, and chromium `gallery:860`,
`join-language:107`.

`multiplayer.spec.ts:320` — the manifest's *second* known red — **passed** on the serial re-run.

`font-census.spec.ts:231` deserves its own line, because B1 changed rendered strings and this is
the spec that would catch a ransom note: it red on *both* engines in the parallel run and
**green on both** serially. `test:font-coverage` is green independently, and the B1 pick updated
the corpus at `check-font-coverage.mjs:220` (`the solver finishes the board` →
`finishes the board for you`). No ransom note.

### The 3 that persisted, and what each turned out to be

| row | cured, serial | cured, quiet | base (`dist-base`) | reading |
|---|---|---|---|---|
| `[webkit] masthead-alignment:158` @1280 | fail 1.4m | **pass 3.7s, then 4.6s** | pass 5.4s | webkit launch starvation |
| `[webkit] masthead-alignment:158` @1440 | fail 15.1m | **pass 5.3s, then 2.9s** | pass 7.7s | same |
| `presence.spec.ts:177` (chromium **and** webkit) | fail | fail | **fail** | **SYMMETRIC** |

The masthead rows are decisive: on the quiet re-run the wall clock was 15.2 minutes while the
rows themselves reported **3.7 s and 5.3 s**. The time was spent before the test, launching
webkit under contention — the assertions were never slow. Second run: 2/2 in 8.3 s total.

### The one standing red

```
[chromium] and [webkit] › e2e/presence.spec.ts:177:1
  a page that dies without a bye leaves the roster on a clock, and the quiet pages keep theirs

  e2e/presence.spec.ts:199
  > 199 |   for (const p of [a, b, c]) await expect(roster(p)).toHaveCount(3);
  Error: expect(locator).toHaveCount(expected) failed
  Expected: 3
  Received: 1
```

`roster` count 1 of 3 — **verbatim the failure the manifest's G1 describes.** It reds on the
cured dist and on the `a8fee1f5` dist, on both engines, serially and quiet. Three booting pages
against a 45 s expiry inside a 180 s window: the local session-e2e arm is unstable on this box,
as G1 says. **Symmetric. Booked, not a fold blocker.**

4 skipped throughout, all recorded holdouts: `multiplayer:950` (real relay, both engines),
`share-truth:63` (webkit), `spoken-controls:324` (webkit).

## 10. The control build

`dist-base/` built from `git archive a8fee1f5` in the scratchpad, same node_modules, same wasm,
own cache. Entry: **`index-9rZPzI5DEcpe.js`**.

That is main's W8 §8.1 pinned HEAD control, reproduced here independently — which does two
things at once: it証 proves the control is the real base, and it proves this box reproduces
main's build byte-for-byte. It carries `solver finishes the board` (1 hit) where the cured build
carries 0, so the B1 delta is measured against a control that demonstrably holds the old string.

## 11. Servers

4254 cured preview, 4255 base preview, both `127.0.0.1` + `--strictPort`, both on the private
`.vite-cache`. 4256 never needed. Never :3000, never :3001. `playwright.config.ts`'s `:3000`
`webServer` never started — the scratch config deletes the key. **Both killed; all three ports
verified empty; no stray `vite preview` or `playwright test` process remains.**

## 12. What this battery did NOT prove

| # | gate | why |
|---|---|---|
| N1 | `npm ci` | NOT RUN by design — symlinked `node_modules` under live lanes, lockfile unchanged |
| N2 | `check-evidence-policy` over the **new** `w7/exec` evidence dirs | they are untracked in the MAIN tree, absent here; must re-run at the fold |
| N3 | 390×844 and 820×1180, both engines | `visual-regression.spec.ts` is a 1280×800 spec — **G12 stays open** |
| N4 | production / CI | 16/16 CI and the CH-57 deploy gate remain WGATE's, per manifest §4.5 and G23 |

## 13. Rows to book

- **G1 confirmed and sharpened**: `presence.spec.ts:177` is symmetric on both engines against the
  `a8fee1f5` build. `multiplayer.spec.ts:320` is *not* a standing red — it cleared serially.
- **New, small**: `killer/16x16/HARD` sits 7% under its `test:gen-latency` ceiling on a quiet box.
- **New, procedural**: this box cannot run the full parallel e2e battery honestly while other
  lanes work — 24 of 24 first-run reds were starvation. A serial confirmation pass is not
  optional here; it is the reading.
- **G12 unchanged**: gate 8 does not cover 820×1180.
