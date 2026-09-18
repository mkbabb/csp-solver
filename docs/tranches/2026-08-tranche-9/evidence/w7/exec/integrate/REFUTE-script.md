# REFUTE — non-author audit of `BATTERY-script.md`

`t9/integrate` @ `cf8d53f4` (= `a8fee1f5` + the six `w7/exec` picks, frontend-only, 12 files,
536+/52−, zero docs). Refuter ran bare in the same worktree, own servers, own logs
(`/private/tmp/…/scratchpad/refute-logs/`, quoted inline below). No `npm ci/install/audit fix`,
no `--update-snapshots`, no `:3000`, no main-tree write.

## Verdict

**CONFIRMED.** The battery's load-bearing claim survives every attack this audit could mount:
48 gates / 45 exit 0 is accurate, every exit-0 log carries its own summary, the three non-zero
rows are the ones named, the dist greps are 0/0/0 against a control that proves the greps bite,
and **no ASYMMETRIC red exists** — nothing reds on the cured dist that does not red on the base
dist for a reason independent of the picks. **The six picks are not blocked.**

**One gate the battery reports green is red where it counts** (F-0, BLOCKING for the fold
commit): `check-evidence-policy.mjs` ran in the worktree, whose `docs/` is at `a8fee1f5` and
therefore carries none of the W7 evidence the fold will `git add`. In the main tree it fails —
`evidence/w7` is 5,794,248 B of PNG against a 2,097,152 B per-wave cap. Recrop before the fold
commit; the picks themselves are clean.

**One sub-claim is DISPUTED and must be restated** (F-1): `sudoku-interaction.spec.ts:69` is not
flaky. It is red on the base arm in 3/3 runs, both engines, deterministically, because the picks
rewrote the spec's own matcher. Filing it under FLAKY hides the fact that the base dist is not a
valid control for any row the picks moved.

## 1. Re-runs (this audit)

| # | gate | arm | workers | result | exit |
|---|---|---|---|---|---|
| R-vitest | `npx vitest run` | — | — | **Test Files 68 passed (68) · Tests 826 passed (826)**, 15.25s | 0 |
| R-lint-copy | `npm run lint:copy` | — | — | 0 em/en dashes, 0 unadmitted jargon, 1 admitted | 0 |
| R-lint-motion | `npm run lint:motion` | — | — | 34 specs, each declaring its motion state | 0 |
| R-doc-truth | `node scripts/check-doc-truth.mjs` (worktree root) | — | — | **0 RED / 42 GREEN** | 0 |
| R-dist-identity | `dist-identity.mjs --dist dist` | — | — | `index-Cc6TqSXYnbfW.js`, 43 files / 806.3 KB | 0 |
| P1 | goldens, `playwright-golden.config.ts` | cured | 4 | **4 passed** (1.1m), nothing re-baselined | 0 |
| P2 | `visual-regression.spec.ts` both engines | cured | 2 | **24 passed** (33.1s) | 0 |
| P7 | `visual-regression.spec.ts` both engines | cured | 4 | **24 passed** (41.4s) | 0 |
| P8 | `visual-regression.spec.ts` both engines | base | 4 | **24 passed** (2.4m) | 0 |
| P3 | the three red specs (40 rows) | cured | 2 | 38 passed / **2 failed** (1.4m) | 1 |
| P5 | the three red specs (40 rows) | cured | 2 | 38 passed / **2 failed** (1.0m) | 1 |
| P4 | the three red specs (40 rows) | base | 2 | 36 passed / **4 failed** (1.2m) | 1 |
| P6 | the three red specs (40 rows) | base | 2 | 36 passed / **4 failed** (1.0m) | 1 |
| C1 | full suite, both engines (476 rows) | cured | 4 | **468 passed / 4 failed / 4 skipped** (12.7m) — the battery's counts to the row, a **different** red set | 1 |
| C2 | `npx vue-tsc --noEmit` | — | — | silent | 0 |
| C3 | `npm run lint:eslint` | — | — | silent | 0 |
| C4 | `npm run lint:knip` | — | — | silent | 0 |
| D1 | the five built-dist specs the default suite ignores and the goldens don't carry (`playwright-throttle.config.ts`, 8 projects) | cured | cfg | **67 passed** (1.9m) — throttled-void · filter-census ×2 · wordmark-integrity webkit · theme-bake ×2 · theme-quadrants ×2 | 0 |
| E1 | `npm run test:e2e:projects` (chair's order §4, **missing from the 48**) | — | — | 34 specs, 547 resolved tests, both engines but the 6 recorded holdouts | 0 |
| E2 | `npm run test:e2e:retries` | — | — | 4 arms green (retries imply `failOnFlakyTests`, every retry a named grant) | 0 |
| F | `multiplayer.spec.ts:320`, both engines, ×2 per arm | both | 2 | **2 passed** in all four runs (cured 16.8s / 15.4s · base 39.8s / 13.0s) | 0 ×4 |
| G | `viewport-law.spec.ts` §2.5 washi, both engines, ×2 per arm | both | 2 | **2 passed** in all four runs; all **8** censuses print `overlaps=[]` | 0 ×4 |
| H | `check-evidence-policy.mjs` **in the main tree** (where the W7 evidence lives) | — | — | **FAIL** — `evidence/w7` 5,794,248 B > 2,097,152 B per-wave cap, 264 png | **1** |

## 2. Every red, per row × engine × arm × run

Script arms: `9a` full cured 4w, `9b` base 2w, `9c` cured 2w, `8` visual cured 2w. Audit arms:
P2–P8, C1, F, G. R = red, G = green, · = not in that arm's scope.

| row | engine | cured runs | base runs | class |
|---|---|---|---|---|
| `presence.spec.ts:177` | chromium | **R R R R R** (9a 9c P3 P5 C1) | **R R R** (9b P4 P6) | **SYMMETRIC** |
| `presence.spec.ts:177` | webkit | **R R R R R** | **R R R** | **SYMMETRIC** |
| `sudoku-interaction.spec.ts:51` | webkit | **R** (9a, 4w) · G G G G (9c P3 P5 C1) | G G G | **FLAKY** (load) |
| `sudoku-interaction.spec.ts:69` | chromium | G G G G | **R R R** | **BASE-ONLY, DETERMINISTIC** |
| `sudoku-interaction.spec.ts:69` | webkit | G G G G | **R R R** | **BASE-ONLY, DETERMINISTIC** |
| `visual-regression.spec.ts:790` | webkit | **R** (9a, 4w) · G ×7 (8 9c P2 P3 P5 P7 C1) | G ×4 (9b P4 P6 P8) | **FLAKY** (control arm) |
| `multiplayer.spec.ts:320` | both | G (9a) · **R** chromium (C1, 4w) · G G (F ×2) | G G (F ×2) | **FLAKY** (relay transit) |
| `viewport-law.spec.ts:396` §2.5 | both | G (9a) · **R** webkit (C1, 4w) · G G (G ×2) | G G (G ×2) | **FLAKY** (hover census) |

**Two full runs on the same cured dist, same counts, different reds** — the strongest single
reading in this audit:

| run | reds |
|---|---|
| script `9a` (7.0m) | `presence:177` ×2 · `sudoku-interaction:51` webkit · `visual-regression:790` webkit |
| refuter `C1` (12.7m) | `presence:177` ×2 · `multiplayer:320` chromium · `viewport-law:396` webkit |

Both **468 passed / 4 failed / 4 skipped**. The two structural rows repeat exactly; the other two
are drawn from a pool of load-bound rows and never repeat. A surface defect does not move around
like that.

**ASYMMETRIC reds: none.** Every row that reds on the cured dist either reds on the base dist in
the same run shape (presence) or is green on the cured dist in every other run (the four flakes,
each of which also greens on base).
The only row that separates the arms separates them the right way round: `:69` reds on **base**
and is green on **cured**, which is the picks landing.

## 3. Mechanisms — each red named, not just counted

### 3.1 `presence.spec.ts:177` — structurally impossible against ANY built dist (SYMMETRIC)

Not "an unstable box". The row drives `?wire=local`, and the local arm is compile-time DEV-only:

```
src/games/shared/useSession.ts:832   const local = import.meta.env.DEV && asksLocalWire();
```

`check-prod-shake.mjs` polices exactly this — `wire=local` is one of its five dev-only symbols —
and the refuter re-grepped both artifacts: **`wire=local` → 0 hits in `dist`, 0 hits in
`dist-base`**. So on a preview of a production build all three pages fall through to the real
relay, and `presence.spec.ts` is the only spec in the estate that black-holes the socket:

```
e2e/presence.spec.ts:174   await page.routeWebSocket(/.*/, () => {});
```

No wire, no peers, roster = 1 of 3, every run, both engines, both arms. **This row cannot pass
against a built dist by construction**, so it carries zero information about the picks, and it is
not evidence about the box. The ledger row the manifest promises should say so in those terms,
with a re-audition condition (run it on the dev server, or give the built dist a local wire).

### 3.2 `sudoku-interaction.spec.ts:69` — the picks moved the spec (BASE-ONLY, DETERMINISTIC)

`2bad124c` rewrote the matcher in lockstep with the copy:

```
-      if (/solver's answer/.test(inputs[i].getAttribute('aria-label') ?? '')) return i;
+      if (/revealed answer/.test(inputs[i].getAttribute('aria-label') ?? '')) return i;
```

and the differential grep proves the two artifacts differ exactly there:

| string | `dist` (cured) | `dist-base` |
|---|---|---|
| `revealed answer` | **1** | 0 |
| `solver's answer` | 0 | **1** (`solver's answer ${d.value}`) |
| `solver finishes the board` | 0 | **1** |
| `finishes the board for you` | **1** | 0 |

So the cured worktree's spec against the base bundle gives `solvedIdx = -1` every time: 3/3 runs,
both engines, identical error. `e2e/a11y.spec.ts:587` carries the same rewrite and would red on
base the same way if the base arm ever ran it. **The base arm is not a control for rows the picks
moved** — that is the correction, and it is the one thing the battery's record gets wrong.

### 3.3 `visual-regression.spec.ts:790` — the negative control re-reads before the injection lands (FLAKY)

The failing assertion is the row's own control (`:866`), not its product claim. Refuter
instrumented the row's arithmetic directly (`scratchpad/seal-probe.mjs`, 12 runs, 3 per engine
per arm, all with `regime=true/true/true` and `document.fonts.status=loaded`):

| engine | arm | `shipped` | `reverted` | delta | vs SEAL 1227.5 |
|---|---|---|---|---|---|
| chromium | cured ×3 | **1227.09** | 1294.28 | 67.19 | under by 0.41 / control over by 66.78 |
| chromium | base ×3 | **1227.09** | 1294.28 | 67.19 | identical |
| webkit | cured ×3 | **1227.06** | 1294.25 | 67.19 | under by 0.44 |
| webkit | base ×3 | **1227.06** | 1294.25 | 67.19 | identical |

The picks move this cell **0.00px** (cured == base to the last digit, both engines). And the
failing run's number convicts the instrument, not the layout: `9a` reported `reverted = 1227.06`,
which is **webkit's `shipped` value to 0.00px** — the row measured the un-injected layout,
i.e. `addStyleTag`'s rule had not applied when the fixed `waitForTimeout(120)` (`:861`) elapsed.

### 3.4 `sudoku-interaction.spec.ts:51` webkit — a boot stall (FLAKY)

`loadApp` polls `.sudoku-cell .glyph-svg > 0` with a 15s budget. In `9a` the row burned
**18,292 ms** while the same helper carried the file's six other webkit rows in 2.7–4.0s in the
same run (webkit p50 3.6s / p90 7.6s / max 21.5s across 238 rows). Green in every 2-worker run
since. Load, not surface.

### 3.5 `viewport-law.spec.ts:396` §2.5 webkit — the one red worth a second look (FLAKY)

This is the only red in the audit whose SUBJECT the picks actually move: `2bad124c` rewrites a
washi label's text (`GameControlPanel.vue:1297`, `SheetWashiLabel text="the solver finishes the
board"` → `"finishes the board for you"`, seed 37, `wide`, `v-if="!mobile"`), and this row is the
census that forbids any tape covering any control. So it was run to ground rather than filed.

- The red names a **different** tape: `{"tape":"new game","own":false,"target":"9×9","frac":0.034,"px":356.3}`.
  "new game" is the compartment tag at `GameControlPanel.vue:769` (`anchor="tag"`, seed 13) — a
  different element in a different well from the label the picks retitled.
- It greened on the cured dist in `9a`, and in 4 dedicated runs (2 cured, 2 base, both engines):
  **8 censuses, every one `overlaps=[]`**.
- The row hovers every button in the card in turn and censuses each time, with a 3s bounded
  settle that FORGIVES nothing if the bound lapses (`:455-478`) — a starved frame hands the
  assertion its last overlapping reading. That is the shape of this red.

Load, not surface. Worth a watch row all the same, because it is the one gate the picks' own
string can reach.

## 4. Findings

| # | severity | finding |
|---|---|---|
| F-0 | **BLOCKING (the fold commit, not the picks)** | `6e-evidence-policy` is green in the battery because it ran in the WORKTREE, where `docs/` sits at `a8fee1f5` and the W7 evidence dirs the fold will `git add` **do not exist** ("598 png, 40,481,932 B across 40 wave buckets — PASS"). Run in the MAIN tree, where those dirs live, the same script **FAILS**: `846 png, 45,721,586 B`, breach `per-wave docs/tranches/2026-08-tranche-9/evidence/w7 = 5,794,248 B > 2,097,152 B` (264 png). The chair's order §4 requires exactly this — "the new evidence dirs must clear its caps" — and the earlier `BATTERY.md` §12 N2 booked it as unproven. It is now proven RED. Recrop or thin `evidence/w7` before the fold commit; the script's own words: do not raise the cap, do not grandfather. (The 308 KB of text logs this audit banked are not counted — the cap is PNG bytes.) |
| F-1 | **MUST** | `sudoku-interaction.spec.ts:69` is filed as FLAKY in `BATTERY-script.md` and in FOLD-MANIFEST G2 ("base arm reds a different sudoku-interaction row, `:69`"). It is deterministic: 3/3 base runs, both engines, and 0/4 cured runs. Restate as BASE-ONLY-BY-CONSTRUCTION, and record the general rule: the base dist is not a control for `sudoku-interaction.spec.ts:69` or `a11y.spec.ts:587`, both of which the picks rewrote. |
| F-2 | **MUST** | `presence.spec.ts:177`'s mechanism is not "the local session e2e arm is unstable on this box" (G1) — it is that `?wire=local` is `import.meta.env.DEV`-gated and absent from every built dist (0 grep hits in `dist` and `dist-base`, `check-prod-shake` enforces it), while the spec black-holes every WebSocket at `:174`. The row is structurally unpassable against a preview of a production build. Book it with that mechanism and a re-audition condition, not as box flake. |
| F-3 | **MUST** | The same gate applies to the 17 `multiplayer.spec.ts` rows × 2 engines that PASS in the battery: their `?wire=local` is equally inert against the built dist, so they ran over the **live** `wss://sudoku-relay.mkbabb.workers.dev` (the URL is in the shipped bundle). The battery's e2e green therefore depends on a production network service — reachable from this box right now (`curl https://sudoku-relay.mkbabb.workers.dev/` → **426 Upgrade Required** in 0.12s). The refuter's own full run reds `multiplayer.spec.ts:320` chromium on exactly that seam (`digitAt` `""` after a 10s poll — a digit that never crossed), where the script's run greened it — and the row then passed 4/4 in dedicated runs across both arms (step F), which is what a transit flake looks like. Read the multiplayer block as a live-relay integration lane, not as the local arm its header describes. |
| F-4 | **MUST** | `npm run test:e2e:projects` is named in the chair's order §4 and is **absent from the battery's 48 gates**. Refuter ran it: exit 0, 34 specs / 547 resolved tests. Green — but a gate the order names and the record skips is a hole in the record, not in the tree. `test:e2e:retries` (not in the order) also green. |
| F-4b | NOTE | The battery's "full Playwright battery" is the DEFAULT suite: `playwright.config.ts` ignores six specs that ride `playwright-throttle.config.ts` against the built dist, and `BATTERY-script.md` runs only the golden one of them. Three of the five unrun ones assert over the SHIPPED artifact (`filter-census`, `theme-quadrants`, `theme-bake-freshness`) and 3C-4 deletes a rule from the shipped stylesheet, so the gap was load-bearing. Refuter closed it: `PLAYWRIGHT_BASE_URL=…:4254 npx playwright test -c playwright-throttle.config.ts` → **67 passed, exit 0**, 8 projects, both engines. Nothing to cure; the record should say the suite was run. |
| F-5 | NOTE | Second occurrence of one class: `visual-regression.spec.ts`'s in-page negative controls re-measure after `addStyleTag` without waiting for the injected rule to take effect — `:866` via a fixed `waitForTimeout(120)` (this battery), `:659` via `settledClearance`, whose "two consecutive reads agree" is satisfied by two identical **pre-injection** reads (the earlier `BATTERY.md`, webkit `:569`). Per the estate's own law, name the class and cure both sites (poll until the measurement has MOVED, then settle). |
| F-6 | NOTE | `check-sleep-lint.mjs` cannot see `visual-regression.spec.ts:861`. The read is `await p.evaluate(PANEL_H)` and `PANEL_H` is a hoisted in-page probe, so neither `LIVE_IN_EVALUATE` (tested against the call-site body) nor the `helpers` fixpoint (`\bPANEL_H\s*\(`, never called that way) fires — `liveReadAt` returns null and the sleep is not a finding. The gate greens over exactly the site that flaked. |
| F-7 | NOTE | The battery's `5h-dist-greps` row proves less than its exit code suggests: the row's exit is the exit of its LAST command (`ls \| grep`), and `grep -rl … \| wc -l` cannot fail. Only the printed counts are evidence. Refuter re-derived all of them and re-added the positive control the earlier `BATTERY.md` §5 carried and this row dropped (below) — the counts are right. |
| F-8 | NOTE | `visual-regression.spec.ts` rides one viewport (1280×800, plus `devices["iPhone 13"]` at `:753`); 820×1180 is exercised nowhere in it. This matches the earlier `BATTERY.md` §8 (G12 stays open) and is unchanged by this audit; the script battery's record does not repeat the answer. |
| F-9 | NOTE | Port fence: 4256 (named in the refuter's brief for the cured server) was already held by another live lane — `vite preview --outDir dist-base --port 4256` out of a `c06-check` scratchpad, serving `index-9rZPzI5DEcpe.js`. Refuter used the free 4254/4255 pair instead and left the other lane alone. |
| F-9b | NOTE | The box carried other work throughout (another lane's previews on 4256/4257, and an unrelated repo's Playwright run seen mid-audit). Every flake classification here was taken under that load, which is the honest condition — and the two full runs' disjoint red sets are the reading, exactly as the earlier `BATTERY.md` §13 says. |
| F-10 | NOTE | `6f-npm-audit` exits 0 at `--audit-level=high` while the report lists 3 moderate advisories (`@vitest/mocker` path traversal, GHSA-82fw-gwwq-j7x9, transitively `vitest` + `@vitest/coverage-v8`). Correct for the gate as specified; worth a row so the moderates are a decision rather than a silence. |

### Logs whose green rests on an echoed exit code alone

Per the audit order, every exit-0 log was opened. All 45 carry their gate's own summary except
these, which are silent-on-success tools — listed so the record says which greens are structural
and which are attested:

| log | what it carries | disposition |
|---|---|---|
| `1a-vue-tsc.log` | **`exit 0` and nothing else** (bare `npx`, no npm banner) | re-run by refuter: exit 0, silent |
| `1b/1c/1d-typecheck-*.log` | npm banner only | `tsc`/`vue-tsc` print nothing on success |
| `2b-lint-eslint.log`, `2d-lint-knip.log`, `2e-lint-boundary.log` | npm banner only | eslint/knip silent on success; refuter re-ran eslint (exit 0) and knip (exit 0) |
| `5c-vite-build.log` | the `advancedChunks` deprecation warning only | the build's proof is `5d`'s identity line, which is present |
| `7c-goldens-status.log` | the echoed `(must be empty…)` line | empty output IS the claim; refuter re-verified `git status --porcelain e2e` clean before and after its own golden run |

## 5. Artifact greps, re-derived with a control

Refuter's own run over `dist`, plus the control the battery's row lacks (a grep that must HIT):

| probe | `dist` | `dist-base` |
|---|---|---|
| `solver finishes the board` | **0** | 1 |
| `solver's answer` (straight `'`) | **0** | 1 |
| `solver’s answer` (curly `’`) | **0** | 0 |
| `not all and (hover: ?hover) and (pointer: ?fine)` in `dist/assets/*.css` | **0** | — |
| same, whole tree | **0** | 1 |
| control · `finishes the board for you` | 1 | 0 |
| control · `revealed answer` | 1 | 0 |
| control · `(hover: hover)` occurrences in `index-*.css` | 12 | 12 |

Every `@media` query naming `pointer`/`hover` in the two stylesheets, counted:

```
cured : 8 (pointer:coarse) · 8 (hover:hover) · 4 (hover:hover) and (pointer:fine)
        3 (max-width:1023.98px) and (pointer:coarse) · 1 (max-width:767.98px) and (pointer:coarse)
base  : the same five, PLUS 1 × @media not all and (hover:hover) and (pointer:fine)
```

The deleted block is the 3C-4 cure (`GameBoard.vue`, `.attribution-tape { display: none }`), and
nothing replaced it under another spelling. The grep is not vacuous: the corpus carries 12 other
`(hover: hover)` rules the pattern would have found.

wasm in `dist/assets`: `csp_solver_wasm_bg-BJYevEYE.wasm`, **123,336 B**, sha256
`b908e586ad84508829edcbcf49080cf05d3bd63d5110390dd078425a9db2fc50` — matches
`csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm` and the base dist's copy. Entry
`index-Cc6TqSXYnbfW.js`.

## 6. Goldens and tree state

`git status --porcelain web/frontend/e2e` is **empty** before and after the refuter's own
`playwright-golden.config.ts` run (4/4, no `--update-snapshots`). `test-results/` is gitignored
(`.gitignore:48`). Whole-tree status carries only the two declared scratch configs
(`.vite-integrate.config.ts`, `playwright-integrate.config.ts`). No baseline moved.

## 7. Scope the battery does not cover (not defects, boundaries)

- The nine CI lanes over Rust/Python/wasm (`lint`, `rust`, `py-compile`, `py-runtime`, `wasm`,
  `build-lean-wasm`, `twiggy`, `iai`, `cargo-audit`, `wasm-publish-dryrun`) are not in the 48 —
  defensible: `git diff a8fee1f5..cf8d53f4 --name-only` is **frontend-only**, 12 files, no
  `docs/`.
- `npm ci` — not runnable in this worktree (symlinked `node_modules`), as the earlier BATTERY
  §12 N1 already books.
- CI 16/16 and the CH-57 deploy gate remain WGATE's.

## 8. Servers

Cured `dist` on `127.0.0.1:4254`, base `dist-base` on `127.0.0.1:4255`, both
`--strictPort`, both serving the verified entries (`index-Cc6TqSXYnbfW.js` / `index-9rZPzI5DEcpe.js`,
the latter byte-identical in name to main's W8 pin). `:3000` never started — the scratch config
deletes the key. Both refuter servers killed at close; the other lane's 4256/4257 left untouched.
