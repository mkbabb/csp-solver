# r2 — ADVERSARIAL VERIFY of the r1 gate criticals

**Tree** `71456713d9f7361af80f09e1a456fc9787507e78` (`71456713`, master, clean).
**Posture** hostile. The brief was to break each claim — hunt the escape hatch the finder missed and confirm only what survives. Read-only on source and configs; nothing built, installed, committed or deployed; no lockfile touched. Ports 3001/4288/3000/4188 untouched. `:4177` was free, used for the live AX probe, and released (`lsof -nP -iTCP:4177 -sTCP:LISTEN` → free before and after).
**Live probe** the committed `web/frontend/dist/` (built 2026-08-01 03:52; last `web/frontend/src` commit `515bc537` 03:39, and `find src -newer dist/index.html` is empty — so the artifact is fresh for HEAD's source), served on `:4177`, driven by the repo's own `playwright` 1.61.1 Chromium, AX read via CDP `Accessibility.getFullAXTree`. Probe scripts (scratchpad, disposable): `r2probe.mjs`, `r2probe2.mjs`.

**Scoreboard**

| # | Claim | Verdict |
|---|---|---|
| 1 | A1 — 332 FE unit blocks run in NO CI lane | **CONFIRMED** (no escape hatch found; every candidate closed) |
| 2 | A3 — EVIDENCE-POLICY byte-cap gate never built | **CONFIRMED, and worse than stated** (the estate is in live breach) |
| 3 | B1 — wordmark `test.skip` swallows the edge-clip assertion on linux | **NARROWED** (conditional on an empty bake — but the author's own ablation records the lane exiting 0 with all five rows dark, and a second hole r1 missed) |
| 4 | A5 — cargo-audit has no `schedule:` | **CONFIRMED**, with one partial out-of-band oracle named |
| 5 | a11y H1 / H2 / H3 | **CONFIRMED ×3**, independently reproduced live; H2 reproduced through to the destroyed board |

---

## 1 · A1 — "332 FE unit test blocks run in NO CI lane" → **CONFIRMED**

### The claim, re-derived from scratch

```
find web/frontend/src -name "*.test.ts" | wc -l        → 31
grep -cE "^\s*(it|test)\(" over those 31 files, summed → 332
grep -rn "\.skip|\.only|\.todo" over those 31 files     → 0
```

`web/frontend/package.json` declares `"test:unit": "vitest run"`; `vitest.config.ts` `include: ['src/**/*.test.ts']`.

### Every escape hatch I could think of, and how each closed

| Hatch hunted | Command | Result |
|---|---|---|
| A second workflow file | `find . \( -name '*.yml' -o -name '*.yaml' \) …` filtered to workflow paths, node_modules/target/worktrees pruned | **only** `./.github/workflows/ci.yml` |
| A composite action running it | `find . -name action.yml -o -name action.yaml` | **zero results** — no composite actions exist in this repo |
| Another CI provider | `ls -a \| grep -Ei "circleci\|gitlab\|travis\|jenkins\|buildkite\|azure\|drone\|woodpecker\|teamcity"` | **none** |
| `.github` holding anything else | `find .github -type f` | exactly one file: `.github/workflows/ci.yml` |
| Any CI step naming it | `grep -rni "vitest\|test:unit\|npm test\|npm run test\|yarn test" .github/` | four hits, all other scripts: `:541` `test:font-coverage`, `:617` `test:golden:bytes`, `:631` `test:e2e:throttle`, `:638` `test:prod-shake` |
| A husky / git hook | `ls -la .husky` → absent; `ls -la .git/hooks/ \| grep -v sample` → nothing but `.`/`..` | **no hooks installed** |
| lint-staged / simple-git-hooks | `grep -rn "lint-staged\|husky\|pre-commit\|simple-git-hooks" web/frontend/package.json` | **none** |
| An npm lifecycle chain (`prepare`/`postinstall`/`pretest`) firing on `npm ci` | `grep -rn '"prepare"\|"postinstall"\|"pretest"\|"posttest"\|"prepublish' web/frontend/package.json csp-solver/wasm/package.json` | **none.** The only lifecycle script in the tree is `prebuild → npm run wasm` (`make -C ../../csp-solver/wasm wasm`) — and no CI lane runs `npm run build` at all |
| A second `package.json` with its own test wiring | `find . -name package.json -not -path "*/node_modules/*" …` | one real one (`web/frontend`); the rest are `.vite/deps`, the wasm `pkg/`, and six throwaway design-loop rigs under `docs/` |
| Playwright transitively collecting the units | `testDir` is `./e2e` in all three configs (`playwright.config.ts:28`, `playwright-golden.config.ts:29`, `playwright-throttle.config.ts:46`); `grep -rn "vitest" web/frontend/e2e/` → **none** | vitest specs are unreachable from every Playwright config |
| `vue-tsc` executing them | `npx vue-tsc --noEmit` (`ci.yml:507`) is a typechecker; it emits nothing and runs nothing | typecheck ≠ execute — this is precisely why the omission looks green |
| `wrangler` / deploy running them | no deploy job in `ci.yml`; `deploy` = `npm run build && wrangler pages deploy dist` and is never invoked by CI | closed |
| knip / eslint | static analysers; neither executes a test | closed |

### Verdict

**CONFIRMED.** There is exactly one workflow file, no composite actions, no second CI provider, no git hooks, no lifecycle chain, and no runner that reaches `src/**/*.test.ts`. The ungated subjects, by block count:

```
23  src/games/sudoku/SudokuBoard/SudokuCell/SudokuCell.test.ts
23  src/games/futoshiki/composables/useUrlState.test.ts
21  src/games/shared/techniqueEngine.test.ts
21  src/games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.test.ts
20  src/games/shared/useUndoHistory.test.ts
19  src/games/sudoku/composables/useUrlState.test.ts
17  src/games/sudoku/solver/protocol.test.ts
17  src/games/shared/useStagingBridge.test.ts
17  src/games/futoshiki/technique/futoshikiTechnique.test.ts
16  src/games/sudoku/technique/sudokuTechnique.test.ts
16  src/games/shared/techniqueVoice.test.ts
15  src/games/shared/GameControlPanel.test.ts
…  (31 files, 332 blocks, zero skipped)
```

The undo spine, the technique engine, the solver wire protocol and both URL codecs are gated by nothing on a push.

---

## 2 · A3 — "EVIDENCE-POLICY byte-cap gate never built" → **CONFIRMED, and the estate is in live breach**

### What the policy actually promises

`docs/tranches/EVIDENCE-POLICY.md` (41 lines, ratified T4-W0 ballot B1, "binds every future evidence dir under `docs/tranches/**`"):

- `:10` — **Per-image cap: ≤150 KB.**
- `:11` — **Per-wave cap: ≤2 MB of images.**
- `:12` — "**Goldens are separate.** π/pixel goldens live under the W2 capture machinery with their own budget line—they're regression fixtures, not wave evidence, and they don't draw against the 2 MB."
- `:13` — "**Enforcement.** A violation … blocks the wave gate. **The gate greps the wave's evidence dir for `*.png`, sums bytes, and fails on breach.**"

### The escape hatch I hunted, and why it does not hold

`scripts/check-golden-bytes.mjs` **is** an EVIDENCE-POLICY artefact — it says so at `:2` ("FAM-15 / EVIDENCE-POLICY B1") and `:22` (`PER_IMAGE_CEILING = 150 * 1024; // 150 KB — EVIDENCE-POLICY per-image cap`), and it is wired into CI at `ci.yml:617`. That is the strongest candidate for a refutation.

It does not refute the claim, because `check-golden-bytes.mjs:21` scopes it to

```js
const GOLDENS_DIR = join(FRONTEND_ROOT, 'e2e', 'goldens');
```

— the **regression-fixture** estate that `EVIDENCE-POLICY.md:12` explicitly carves *out* of the wave budget. The gate the policy's Enforcement clause describes greps *the wave's evidence dir*. Nothing does.

```
grep -rn "docs/tranches" web/frontend/scripts/ scripts/ .github/workflows/ci.yml web/frontend/*.ts
  → .github/workflows/ci.yml:11  (a prose comment citing a wave doc)
grep -rln "per-wave cap|2 MB|evidence dir|evidence-bytes|check-evidence" over *.mjs *.js *.sh *.yml *.ts
  → NO ENFORCEMENT SCRIPT ANYWHERE
ls scripts/                    → dev.sh          (only)
ls web/frontend/scripts/       → check-font-coverage.mjs, check-golden-bytes.mjs,
                                 check-ink-pressure.mjs, check-prod-shake.mjs
ls .husky / .git/hooks (non-sample) → none
```

### The escalation r1 stopped short of: the tree is in breach *now*

The policy binds every evidence dir authored under it. Tranche 4 is that tranche.

```
git ls-files "docs/tranches/**/*.png"                          → 290 files, 29,902,027 B (28.5 MB)
git ls-files "docs/tranches/2026-07-tranche-4/**/*.png"        → 175 files, 16,085,672 B (15.3 MB)
  … of which > 150 KB (the per-image cap)                      → 31 files
  largest: 375,931 B  docs/tranches/2026-07-tranche-4/evidence/w13/killer-furniture-face.png   (2.5× cap)
           310,453 B  …/w10/parity-sudoku-dark-full-2.png
           310,415 B  …/w10/parity-sudoku-dark-full.png
           293,016 B  …/w10/parity-sudoku-light-full-2.png
per-wave totals vs the 2 MB cap:
  4,324,819 B  …/evidence/w12/captures   (2.16×)
  4,236,208 B  …/evidence/w10            (2.12×)
  2,583,004 B  …/evidence/w13            (1.29×)
  1,696,948 B  …/evidence/w9             (under)
```

Four filenames in the top-four list literally end `-full.png` / `-full-2.png` — the "full viewport, not a crop" violation the policy's `:9` names by hand. Three T4 waves are over the per-wave cap and 31 T4 images are over the per-image cap, on the post-ratification side of the line.

Tranche 5 is clean by absence, not by enforcement: `find docs/tranches/2026-08-tranche-5 -name "*.png"` → **0**.

### Verdict

**CONFIRMED.** The declared enforcement — grep the wave's evidence dir, sum bytes, fail on breach — exists in no script, no hook, and no CI step. `check-golden-bytes.mjs` implements the *number* (150 KB) against the one directory the policy exempts from the wave budget, which makes the gap easy to mistake for coverage. And the absence is not hypothetical: the tranche authored under the policy carries 31 over-cap images and three over-cap waves.

---

## 3 · B1 — wordmark-integrity's linux `test.skip` → **NARROWED** (and it hides a second hole r1 did not state)

`web/frontend/e2e/wordmark-integrity.spec.ts`, read in full (209 lines).

### Exact scope of the skip — the escape hatch is real but small

The skip is **not** at describe or test scope. It sits inside a conditional branch:

```ts
:112   const r = await settledPoseInk(page);
:116   if (r.top < 0) {                       // ← the empty-bake branch, and ONLY it
:117     await attachBakeEvidence(…);
:151     test.skip(
:152       process.platform === "linux",
:153       `${game}: the pose baked EMPTY on linux — see the attached bitmap (…)`,
:154     );
:155   }
:156   expect(r.top, "no ink in the baked pose at all").toBeGreaterThanOrEqual(0);
:157   const clipped = [
:158     r.top === 0 && "top",
:159     r.bot === r.H - 1 && "bottom",
:160     r.left === 0 && "left",
:161     r.right === r.W - 1 && "right",
:162   ].filter(Boolean);
:163   expect(clipped, `${game} ink touches its bitmap edge (${r.W}×${r.H})`).toEqual([]);
```

So the assertion matrix is:

| bake state | darwin (local) | **linux (the only CI platform)** |
|---|---|---|
| inks (green path) | `:156` + `:157-165` both run | **`:156` + `:157-165` both run** |
| reads empty | `:156` **FAILS** (evidence attached) | `test.skip` aborts → `:156` **and** `:157-165` never execute |

**Consequence for the born-RED defect.** The defect the row was born for — "ink reached the FINAL COLUMN of all five bitmaps" (`:15-17`) — is an *inked* bake. `r.top >= 0`, the branch is not entered, and the edge-clip assertion runs at full width on linux. **A recurrence of the original opsz overrun would still red CI.** That is a genuine escape hatch and it is why the verdict is NARROWED rather than CONFIRMED.

### What survives the narrowing — and it is not small

**(a) The author's own ablation records the lane going green with all five rows dark.** Commit `71456713`'s message, verbatim:

> "Red-green, forced blank: darwin 5 failed with evidence attached; **linux 5 skipped, 1 passed, exit 0.**"

That is a first-party, recorded demonstration that under the failure mode the runner has actually produced, five of the six rows in the `wordmark-webkit` project stop asserting and the lane exits 0. The mode is not speculative: run 30690204551 hit four of five rows at once, and the same commit records the blob is **terminal** ("`useRasterStack` re-bakes on cacheKey / cssSize / dpr / mount and nothing else … No poll can settle it and no retry can clear it"), so once it fires it is not a one-frame sampling artefact.

**(b) The edge-clip invariant exists in exactly one place in the estate.** Verified across all 20 spec files:

```
grep -rn "r.W - 1|W - 1|touches its bitmap edge|clipped" --include="*.spec.ts" e2e/
  → wordmark-integrity.spec.ts:67, :157, :161, :163   (and nothing else)
grep -rln "logo-pose-bmp|getImageData|naturalWidth" e2e/
  → visual-regression.spec.ts (opacity-swap only, :157/:170/:175 — no ink-box read),
    theme-bake-freshness.spec.ts, bake-evidence.ts, wordmark-integrity.spec.ts
```

**The golden gate cannot substitute.** `playwright-golden.config.ts` declares **no `projects` and no `browserName`** (`grep -c browserName playwright-golden.config.ts` → `0`), so `golden · logo wordmark (light)` runs in **Chromium only** — while the wordmark defect is by construction a WebKit one (`wordmark-integrity.spec.ts:8-10`: WebKit resolves `font-optical-sizing: auto` to the opsz axis minimum). A WebKit-only clip is invisible to a Chromium golden, on top of the linux `maxDiffPixelRatio: 0.05` relaxation at `visual-golden.spec.ts:179`.

**(c) r1's residual-guard credit is true — but four-fifths narrower than r1 states.** I verified the mechanism:

```
grep -rn "test.skip|test.fixme|test.fail" e2e/*.spec.ts
  → wordmark-integrity.spec.ts:151   (the only runtime skip in the whole e2e estate;
     the one hit in affordances.spec.ts:158 is a prose comment)
grep -n "platform|linux|darwin|skip" e2e/theme-bake-freshness.spec.ts  → ZERO
theme-bake-freshness.spec.ts:194   expect(s.logoInk, "…the logo bake decoded to nothing").not.toBe("no-ink")   ← unconditional
playwright-throttle.config.ts:109-114   theme-bake-{chromium,webkit}, retries: 0
```

So "the logo bake has ink at all" really is guarded on linux in both engines at `retries: 0`. **But `theme-bake-freshness.spec.ts:152` is `page.goto("./?size=3&difficulty=EASY")` — no `game=` parameter, i.e. the default board, sudoku.** All four of its rows read the **sudoku** wordmark. `wordmark-integrity` covers five per-game labels (`:32`), and run 30690204551's blanks included `futoshiki`, `thermo` and `kenken`. **Four of the five wordmark labels therefore have no linux vacuity guard anywhere** — for those, an empty bake is skipped by wordmark-integrity and never looked at by theme-bake-freshness. r1's V3 states the residual guard without this qualification; it should carry it.

**(d) An unresolved tension in the empty-bake attribution.** `theme-bake-freshness` and `wordmark-integrity` run in the same throttle config, same preview, same WebKit, same runner, and both decode `svg.handwritten-logo image.logo-pose-bmp` for the *same sudoku* label — one by alpha (`wordmark-integrity.spec.ts:56`, `alpha > 24`), one by opaque-pixel mean (`theme-bake-freshness.spec.ts:80`, `alpha > 200`, `n === 0 → "no-ink"`). A "valid, correctly sized, entirely TRANSPARENT PNG" (71456713's own description) fails **both** thresholds, so theme-bake-freshness should have red at `retries: 0` in those runs. No record in this tree says it did. Either the blank is narrower than "the runner's", or theme-bake's status in runs 30684983201 / 30690204551 is unrecorded. **UNKNOWN** from this checkout — GitHub run logs were not fetched. Flagged because the skip's entire justification rests on that attribution.

### `playwright-throttle.config.ts` `retries: 1` — scope, and whether a flake-green is real

**Scope.** There is no top-level `retries` key in the throttle config, so unspecified projects default to 0. Full census of the six projects:

| project | testMatch | retries | line |
|---|---|---|---|
| `throttled-void` | `throttled-void.spec.ts` | **1** | `:63`, `:66` |
| `filter-census-chromium` | `filter-census.spec.ts` | 0 | `:75-77` |
| `filter-census-webkit` | `filter-census.spec.ts` | 0 | `:75-77` |
| `wordmark-webkit` | `wordmark-integrity.spec.ts` | **1** | `:85`, `:102`, `use.browserName: "webkit"` `:103` |
| `theme-bake-chromium` | `theme-bake-freshness.spec.ts` | 0 | `:111-113` |
| `theme-bake-webkit` | `theme-bake-freshness.spec.ts` | 0 | `:111-113` |

So `retries: 1` governs exactly two spec files. The other two configs are `retries: 0` (`playwright.config.ts:33`, `playwright-golden.config.ts:60`).

**Is a flake-green real there? Yes — it has already happened.** Commit `71456713` records run 30690204551 as "`sudoku` **flaky**, `futoshiki`, `thermo` and `kenken` failed BOTH attempts" — i.e. the sudoku row went red on attempt 1 and green on attempt 2, in the `wordmark-webkit` project. And nothing converts that into a lane failure:

```
grep -rn "failOnFlakyTests|maxFailures|forbidOnly" web/frontend/playwright*.config.ts  → NONE
```

With `failOnFlakyTests` unset (default false in Playwright 1.61.1, the installed version), a retried pass exits 0. The Playwright *report* still labels it flaky — nothing is hidden from a reader — but the **lane**, which is what a seal gate reads, is green. On the edge-clip half specifically this matters more than r1 credits: since the clip assertion runs whenever the bake inks, a genuine one-shot clip red on linux is exactly the shape `retries: 1` converts into a flaky-green.

One interaction is **UNKNOWN** without executing: attempt 1 failing on edge-clip and attempt 2 hitting an empty bake and skipping. Playwright's outcome for a fail-then-skip sequence was not determined here.

### Verdict

**NARROWED.** The skip is conditional on an empty bake, not unconditional, and the original opsz-overrun defect (an *inked* clip) would still red on linux — that is the escape hatch r1's headline framing understates, though r1's V3 body states the condition correctly. What survives: under the empty-bake mode the runner has demonstrably produced, the author's own forced-blank ablation records "linux 5 skipped … exit 0"; the edge-clip invariant is asserted in no other spec and the logo golden is Chromium-only so it cannot stand in; the residual vacuity guard covers **1 of 5** labels, not all five; and `retries: 1` on `wordmark-webkit` has already produced a real flake-green with no `failOnFlakyTests` to catch it.

---

## 4 · A5 — "cargo-audit has no `schedule:`" → **CONFIRMED** (one partial out-of-band oracle named)

`.github/workflows/ci.yml:71-75`, verbatim:

```yaml
on:
    pull_request:
        branches: [main, master]
    push:
        branches: [main, master]
```

That is the entire trigger block. Corroborated negatively:

```
grep -n "schedule|cron|workflow_dispatch|repository_dispatch|workflow_call" .github/workflows/ci.yml
  → :633  "# rafInstrumentation / schedulerDebugInfo must be tree-shaken out of the"
```

The single hit is the substring `schedule` inside `schedulerDebugInfo` — a false positive in a prose comment. **There is no `schedule:`, no `cron:`, no `workflow_dispatch:`, no `repository_dispatch:` and no `workflow_call:` anywhere in the only workflow file this repo has.** The lane itself is `ci.yml:769-777` (`cargo-audit`, `ubuntu-latest`, `taiki-e/install-action@v2`, `run: cargo audit`), and its own comment at `:762-766` states the purpose is "a **forward** tripwire against a future RustSec vulnerability … not a fix for a live CVE" — a time-varying oracle over a static `Cargo.lock`, fired only by a human push.

**The escape hatch I found, and its limit.** Dependabot alerts are a repo-level GitHub feature that needs no workflow file, and this repo has them **live**: r1's own `chronic-ledger.md:91` records `#69 high postcss` and `#68 high sharp` verified open, and `chronic-ledger.md:40` records the `gh api repos/mkbabb/csp-solver/dependabot/alerts` query behind them. `git remote -v` → `git@github.com:mkbabb/csp-solver.git`, so those alerts are against this repo. That is a genuinely scheduled advisory oracle running out of band.

Its limit: **both live alerts are against `web/frontend/package-lock.json`** (npm), and there is **no `.github/dependabot.yml`** in the tree (`ls .github/dependabot.yml` → absent; `find .github -type f` → `ci.yml` only). Whether GitHub's dependency graph is ingesting `Cargo.lock` for this repo — the manifest `cargo audit` actually reads — is **UNKNOWN** from this checkout; no Cargo-manifest alert appears anywhere in the record.

**Verdict: CONFIRMED** on the literal claim — the workflow has no scheduled trigger and the RustSec check fires only on push/PR to main|master. Narrow the *consequence* wording by one notch: "between pushes the advisory surface is unmonitored" is proven for the `cargo audit` lane, but the repo does carry a live Dependabot alert channel; that channel is only *demonstrated* over the npm manifest, so the Cargo side remains push-only unless someone verifies Cargo coverage in the security tab.

---

## 5 · a11y H1 / H2 / H3 — independent live re-probe → **CONFIRMED ×3**

Independent of r1's scripts: my own server, my own CDP session, my own assertions. `dist/` fresh for HEAD's source (see header).

### H1 — `role="grid"` owns 81 `gridcell`s with no `row` layer → **CONFIRMED**

Live AX tree, `?game=sudoku&size=3&difficulty=EASY`:

```json
"H1_axRoles":        { "grid": 1, "row": 0, "rowgroup": 0, "gridcell": 81, "cell": 0, "textbox": 81 },
"H1_gridChildRoles": ["gridcell"],
"H1_gridChildCount": 81,
"H1_domRowRoles":    0,
"H1_domGridcells":   81,
"H1_gridAttrs":      { "rowcount": "9", "colcount": "9", "label": "9 by 9 sudoku board, easy" }
```

Stronger than r1's role census: I resolved the grid AX node's own `childIds` and every one of the 81 resolves to role `gridcell`. The `gridcell`s are **direct AX children of the `grid`** — the `row` layer is not merely unlabelled, it does not exist at any level. `document.querySelectorAll('[role="row"],[role="rowgroup"]')` → 0.

**Escape hatches hunted and closed:**
- `aria-rowcount="9"` / `aria-colcount="9"` are present (`GameBoard.vue:734-735`) and each cell carries `aria-rowindex`/`aria-colindex` (`SudokuCell.vue:95-96`, `FutoshikiCell.vue:100-101`). These are mitigations for coordinate reporting; ARIA's required-owned-elements for `grid` is `row` or `rowgroup`, which neither supplies.
- No `display: contents` row wrapper hiding a row role — the DOM count is literally 0.
- **All five games are affected, and I verified it structurally rather than assuming it.** `grep -rn 'role=' src/games/{thermo,killer,kenken}/` returns *nothing*, which initially looked like a worse defect (a `grid` owning role-less children). It is not: `thermo/ThermoBoard.vue:14` and `killer/KillerBoard.vue:14` import `SudokuCell`, `kenken/KenKenBoard.vue:15` imports `FutoshikiCell`, and all five boards render `GameBoard` (`grep -rln GameBoard` over the five families → all five). So all five inherit `role="gridcell"` and all five inherit the missing `row` layer. r1's "all five games" is correct.

*(Incidental corroboration of r1's V4: `ThermoBoard.vue:14` → `@games/sudoku/…` and `KenKenBoard.vue:15` → `@games/futoshiki/…` are live cross-game imports. `eslint.config.js:56-141` names only sudoku↮futoshiki, so these are unpoliced by construction — V4's hole is exercised in the tree today, not theoretical.)*

### H2 — the destructive-work guard is silent to AT, and the next Enter destroys the board → **CONFIRMED, through to the destroyed board**

Reproduced the full gesture on the built artifact: click an empty cell → type `5` → blur → `g` → ArrowRight → Enter → Enter.

```json
"clickedCell": "Row 1, column 1, empty",
"dirtyState":  ["Row 1, column 1, your entry 5"],
"afterG":      { "listbox": true, "live": "sudoku, 1 of 5. 9×9 easy, in progress", "active": "listbox" },
"afterArrow":  { "live": "futoshiki, 2 of 5. 5×5 easy, new game",                  "active": "listbox" },

"guard": {
  "present": true,
  "label": "Leave this puzzle?",
  "ariaModal": null,
  "describedby": null,
  "tabindex": null,
  "noteText": "leave this puzzle?your marks aren't saved",
  "activeTag": "DIV", "activeRole": "listbox", "activeLabel": "Choose a puzzle",
  "activeInsideDialog": false,
  "liveTextNow": "futoshiki, 2 of 5. 5×5 easy, new game",
  "allLiveRegions": [
    { "role": "status", "live": "polite", "text": "a fresh 9×9 — singles only" },
    { "role": "status", "live": null,     "text": "board changed — ask again…" },
    { "role": "status", "live": "polite", "text": "futoshiki, 2 of 5. 5×5 easy, new game" }
  ]
},
"guardAX": [ { "name": "Leave this puzzle?", "props": ["modal=false"], "childRoles": ["generic"] } ],

"entriesBefore": 1,
"afterSecondEnter": {
  "guardStillUp": false,
  "url": "?game=futoshiki&board_size=5&difficulty=EASY",
  "gridLabel": "5 by 5 futoshiki board",
  "userEntries": 0
}
```

Every element of the claim reproduces, and the harm is demonstrated rather than argued:

- The ribbon is present with `role="alertdialog"` and `aria-label="Leave this puzzle?"` (`GameGallery.vue:596-603`).
- **`aria-modal` is null and Chrome's AX node reports `modal=false`.** `aria-describedby` is null. `grep -n "aria-modal\|aria-describedby" src/pencil/chrome/GameGallery/GameGallery.vue` → **zero hits** in the whole file. `.guard-note-text` ("your marks aren't saved") is referenced by nothing.
- **Focus never enters it** — `activeRole: "listbox"`, `activeInsideDialog: false`, and the ribbon has no `tabindex`.
- **No live region says anything about it.** All three live regions are enumerated above; the only polite one that changed still reads the *card* announcement. Statically: `liveText` is written at `GameGallery.vue:225` (`announce()`, on step/snap) and `:245` (`announceStaged()`); the two guard-arming sites, `:288-289` and `:406-407`, write `guardIntent`/`guardIndex` and **call neither**.
- `role="alertdialog"` carries no implicit live-region semantics (unlike `role="alert"`), and Chrome's AX node for it exposes no `live` property — so an alertdialog that never receives focus is announced by nothing. Confirmed empirically, not just cited.
- **The second Enter destroys the work**: `GameGallery.vue:431-443` resolves `Enter`/`Space` to `guardLeave()` while armed. Measured: user entries `1 → 0`, URL `?game=sudoku…` → `?game=futoshiki&board_size=5&difficulty=EASY`, grid label → "5 by 5 futoshiki board". The board is gone, and nothing was ever spoken between the arm and the destruction.

*(One mechanism r1 does not state, verified in passing: `g` is correctly inert while focus is in a cell input — my first attempt failed to open the picker because `App.vue`'s handler exempts editable targets. That is right, and it means the reported path — blur, then `g` — is the real one.)*

### H3 — the game picker exposes 1 of its 5 options to AT → **CONFIRMED**

```json
"H3_axRoles":       { "listbox": 1, "option": 1 },
"H3_axOptionNames": ["sudoku, 1 of 5"],
"H3_domOptions": [
  { "label": "sudoku, 1 of 5",    "inert": false, "selected": "true"  },
  { "label": "futoshiki, 2 of 5", "inert": true,  "selected": "false" },
  { "label": "thermo, 3 of 5",    "inert": true,  "selected": "false" },
  { "label": "killer, 4 of 5",    "inert": true,  "selected": "false" },
  { "label": "kenken, 5 of 5",    "inert": true,  "selected": "false" }
]
```

Exactly as claimed: the DOM carries five `role="option"` nodes with resolving labels and truthful `aria-selected`, and `GameCard.vue:233` `:inert="!isActive || undefined"` strips the four flanks from the accessibility tree. Chrome publishes a **one-item listbox**. No escape hatch: there is no `aria-owns` re-parenting, no off-screen duplicate list, and no `aria-setsize` compensation on the surviving option.

**Scope limit carried forward from r1 and not closed here:** Chromium only. WebKit/VoiceOver and Gecko map `inert`, bare `<svg>` and `role="alertdialog"` differently; H3 under VoiceOver remains **UNKNOWN**.

---

## Standing UNKNOWNs (stated, not guessed)

- No GitHub Actions run history was fetched. Every claim about what runs 30684983201 / 30690204551 did to *other* projects — in particular whether `theme-bake-{chromium,webkit}` red alongside the wordmark rows — is unverified from this checkout (§3d).
- Playwright's reported outcome for a fail-on-attempt-1 / skip-on-attempt-2 sequence in the `wordmark-webkit` project was not determined; nothing was executed against the throttle config.
- Whether GitHub's dependency graph ingests `Cargo.lock` for `mkbabb/csp-solver` (the A5 partial oracle) is not observable from the tree.
- The live a11y probe is Chromium-only and read the committed `dist/`, not a fresh `npm run build` — no build was run, per the read-only constraint.

ROW-COMPLETE
