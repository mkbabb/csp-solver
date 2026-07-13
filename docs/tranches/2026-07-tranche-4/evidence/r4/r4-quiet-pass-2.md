# r4-quiet-pass-2 — the SECOND quiet-pass (round 4, closing verification)

Read: full registry, every r1/r2/r3/x report. Hunted the mandated checklist + free, all against
app HEAD `65425697` (master) and pencil-boil `0.8.1`. NO source edits; :3001 untouched; never
bare `npm run lint`. Verdict at bottom; machine block mirrors StructuredOutput.

Quiet-pass ONE (r3) came back NEW-FINDINGS (N1 PNG-bloat P2, N3 browser-matrix, N7 en-only). This
is the pass that decides whether the audit closes. I swept the seven named never-swept corners plus
free-hunt. **Every one holds.** The only residue is two P3 undeclared-decision notes that fold into
existing families — no new family, no new live P0/P1/P2, no lie in the record.

---

## The seven mandated corners

### 1. Futoshiki size matrix / 16×16 sanity — CLEAN (reconfirms r3 C-futoshiki-size)
`futoshiki/ControlPanel/constants.ts` offers **4–7** (value = board side length); `sudoku/
ControlPanel/constants.ts` offers **4/9/16** (value = subgrid 2/3/4). Divergent axes BY DESIGN —
no 16×16 futoshiki, and that's not a parity bug (a 16×16 Latin-square-with-inequalities has no
practical hand-solve idiom). r3 certified this; I reconfirm the constants unchanged at HEAD.

### 2. Local-persistence semantics / localStorage census — CLEAN (sound fail-closed; two P3 notes)
**No round did a keys census before.** Full census — **five** keys:
| key | owner | shape | migration story |
|---|---|---|---|
| `sudoku-board-state` | `sudoku/composables/useUrlState.ts:4` | JSON `PersistedBoard` | shape-validated on load → **null on mismatch** (`:56-63`), i.e. fail-closed reset |
| `futoshiki-board-state` | `futoshiki/composables/useUrlState.ts:14` | JSON | same fail-closed validation |
| `csp-drawer-open` | `shared/useControlsDrawer.ts:56` | `"0"`/`"1"` | trivial, default-open on absence (`:74`) |
| `csp-drawer-hint-spoken` | `shared/useControlsDrawer.ts:57` | presence flag | one-shot |
| **`vueuse-color-scheme`** | **@vueuse/core `useDark` default** (`composables/useTheme.ts`) | `auto`/`dark`/`light` | **dependency-owned, implicit** |

- **Migration story = fail-closed reset**, which is a legitimate answer: a schema change to the
  board blobs drops to a fresh deal, never a corrupt board. No version field is NEEDED because the
  validator gates every field the restore path reads. CLEAN.
- **P3 NOTE (fold to FAM-7 / undeclared-decision, sibling of N7 en-only):** the theme key is owned
  by @vueuse/core's default `storageKey`, not the app. If the dep ever changes its default (a major
  bump), theme preference silently resets once to system default — a soft, one-time hazard, pinned
  today by the lockfile. Also un-namespaced vs the app's own convention: keys split three ways
  (`csp-*`, `sudoku-*`/`futoshiki-*`, and vueuse's own) with **no unified prefix**. Marginal P3
  debt, not a live defect.

### 3. URL-scheme codec versioning — CLEAN (self-describing + fail-closed; extends FAM-13, no new family)
Sudoku `?board=` = base64url of `${size}.${cells}` (`useUrlState.ts:80-88`); futoshiki =
`${boardSize}.${cells}.${ineqs}` (`:83-93`). **Neither carries a version tag.** BUT both are
**self-describing** (carry their own size, distinguished by part-count 2 vs 3) and **fail closed**
on every malformed/out-of-range/size-mismatched blob (strict `^\d+$` size, range checks, length
checks → return null → degrade to size/difficulty-only). r2 banked codec-harden 18/18 and FAM-13's
"corrupt share-link degrades silently". 
- **P3 NOTE (extends FAM-13, no elevation):** the absence of a version byte means a FUTURE breaking
  codec revision that kept the same structural shape could decode an old link to a *different* board
  with no error. This is speculative (no codec change planned) and the self-describing/fail-closed
  design is the accepted tradeoff. Not a live trigger.

### 4. Print stylesheet — CLEAN (comprehensive, exists)
A paper-idiom app that CAN print: `index.css:529 @media print` hides chrome (controls, wordmark,
attribution, toggle, celebration, margin, laminate), inks every stroke true black over bare paper,
redefines `--grid-line-color`/`--color-user-ink` to black, strips filters/shadows, and correctly
exploits `@layer base` precedence-inversion under `!important` (documented `:524-528`). Plus
`DrawerTab.vue:121 @media print` hides the tab. The comment-claim "prints the COMPLETE solution
(givens too)" at `:332` is about `prefers-reduced-transparency`, not print — no doc/behavior gap.

### 5. Solve-tally / stat-line truth post-W13 — CLEAN (verified typing adversarially)
`shared/solveTally.ts` formats `"128 backtracks — 42ms"` from `SolveStats`. Truth chain:
`solver.worker.ts:83-97` measures `elapsedMs = performance.now()-t0` around the **actual wasm
solve** and sends `backtracks: result.backtracks.toString()` (u64→string, structured-clone-safe).
`useSolver.ts:201` converts back with `Number(res.backtracks)`; `SolveStats.backtracks` is `number`
(`types.ts:16`). So the singular guard `stats.backtracks === 1 ? 'backtrack'` in `solveTally.ts:14`
compares number-to-number and **correctly** yields "1 backtrack" — I chased the string-vs-number
pluralization hazard specifically and it's guarded. Present on 'solved' AND 'failed', nulled
elsewhere upstream. Real search effort, real wall clock. No fabricated stat.

### 6. pencil-boil 0.8.1 scheduler in background tabs — CLEAN (visibility parking implemented + correct)
`pencil-boil/src/vue.ts:269-286`: a module-level `visibilitychange` listener. On `document.hidden`
→ `stopChain()` cancels **both** the beat timer AND the rAF (0 ticks), leaving `schedulerRunning`
intact for resume. On visible → resumes **only** with a live subscriber (`hasActiveSubscriber()`),
resets each frame subscriber's `lastTick=0` so an elapsed-time jump can't fast-forward frame indices
en masse, and `armScheduler()` is idempotent (no double-wake). The empty-subscriber branch disarms
cleanly. Backs the memory "idle 0 paints" claim structurally. (Prior rounds touched this listener
only in TEST-HARNESS/installEnv context — r2 pencil-boil-audit:145, r3-verify-new:58 — never as a
product functional cert. This is the first product-behavior certification.)

### 7. wasm streaming instantiation + MIME — CLEAN (streaming happy-path + headers correct)
Glue `csp_solver_wasm.js:659-673` prefers `WebAssembly.instantiateStreaming` and falls back to
`arrayBuffer`+`instantiate` only if streaming throws AND Content-Type ≠ `application/wasm`. The
worker (`sudoku/futoshiki/solver.worker.ts:37,43`) hands `init({ module_or_path: wasmUrl })` via
Vite's `?url` pipeline (hashed emitted asset). `public/_headers` pins `/assets/*.wasm →
Content-Type: application/wasm` (documented MANDATORY, doubled-directive fix at T3-W2), which keeps
streaming on the happy path AND — because the SW stores the Response with headers — the offline
cache-served wasm keeps the right MIME. `X-Content-Type-Options: nosniff` + correct MIME are
consistent (nosniff doesn't break streaming when the type is right). CSP carries `wasm-unsafe-eval`
+ `worker-src 'self' blob:`. All aligned. (Live-edge deploy staleness is a deploy concern, out of
scope; r2 already certified "headers live, record stale the other way".)

---

## Free-hunt

### Active-game persistence — CLEAN
Active game lives in the URL only (`?game=futoshiki`, `App.vue:40-44,80-88` via `replaceState`),
NOT localStorage. A reload preserves it; a bare-domain fresh nav resets to sudoku. Coherent split:
game in URL, board/drawer/theme in localStorage. On switch, both games' `board`/`size`/`difficulty`/
`board_size` params are stripped so a stale `?board=` can't bleed cross-game (`:86-87`). No bug.

### Persisted-board field-completeness — CLEAN (defense-in-depth note only)
`loadPersistedBoard` validates `size`/`difficulty`/`values`/`givenCells` but not the newer
`originalGivenCells`/`overriddenCells`/`solvedValues`/`boardGeneration`. In practice the app only
ever writes the full shape, so this is a non-trigger; a hand-corrupted blob missing those fields is
a same-origin self-inflicted edge, not an attack surface. No finding.

---

## Verdict

**QUIET.** The seven mandated never-swept corners and the free-hunt all HOLD:
- **Five CLEAN product certifications** no prior round made: localStorage keys census (sound
  fail-closed migration), print stylesheet (exists + comprehensive), solve-tally truth (real
  stats, pluralization-guarded), scheduler visibility-parking (correct, first product cert), wasm
  streaming instantiation + `application/wasm` headers (happy-path aligned).
- **Two reconfirms:** futoshiki size-axis divergence (r3), headers-live (r2).
- **Residue = two P3 debt NOTES only**, both folding into EXISTING families with no elevation:
  (a) theme key is @vueuse/core-owned + un-namespaced → FAM-7/undeclared-decision, sibling of N7;
  (b) share codec has no version byte but is self-describing + fail-closed → extends FAM-13.

No new family. No new live P0/P1/P2 defect. No lie in the record surfaced. The registry is STABLE.
Quiet-pass ONE (r3) returned findings; quiet-pass TWO returns none of consequence — **two
consecutive-quiet condition is now met on my lane; the audit may close and authoring may follow.**
