# A16 — LEGACY HUNT (FE): the kill list

Repo: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` · scope `web/frontend/src` at HEAD `3b75eca2`.
Read-only. Every claim cited file:line. Consumed pass1 `R5-fe-structure-audit.md` + `crit-proto-P6-indexcss-partials-under-hold.md` (not duplicated; this lane hunts *dead surface*, R5 hunts *structure*).

**Bottom line:** No dead *components* survive (all 15 pencil/chrome surfaces have ≥1 live importer — sweep below). The legacy is concentrated in **four kill zones**: (K1) the apiError twins' unreachable table entries — transcribed from the excised server's 7-code taxonomy, *including a live-code mismatch* (`UNSATISFIABLE` vs the client's `UNSAT`); (K2) two fully-dead config consts (`MOTION`, `YOSHI_COLORS`) totalling ~43 lines, one referencing a deleted file; (K3) one orphan CSS class (`.fira-code`); (K4) 11 unused type `export`s (knip-style, cheap). Dev tooling, PWA icons, and `_redirects`/`_headers` are **clean** — no residue.

---

## K1 — apiError twins: server-taxonomy fossils + a live-code mismatch (MEDIUM→HIGH)

`games/{sudoku,futoshiki}/solver/apiError.ts` are byte-parallel. Under the new order the solver runs **only** in the wasm Worker; the *entire* code universe the client can produce is the 4-member union `SolverErrorCode = 'INVALID_INPUT' | 'BUDGET_EXCEEDED' | 'UNSAT' | 'WORKER_FAILURE'` (`solverError.ts:14`, enforced by the worker's `describeError` allowlist at `sudoku/solver/solver.worker.ts:61` / `futoshiki/solver/solver.worker.ts:40`, both of which collapse anything else to `WORKER_FAILURE`).

But the classifier tables are transcribed from the **dead FastAPI 7-code taxonomy** (`{UNSATISFIABLE, BUDGET_EXCEEDED, INVALID_INPUT, TIMEOUT, NOT_FOUND, RATE_LIMITED, INTERNAL}` — CLAUDE.md "Error taxonomy"). The two never fully overlap:

### K1a — `'UNSATISFIABLE'` is a live-code MISMATCH, not just dead (the sharp one)
`TEACHER_RED_CODES = new Set(['UNSATISFIABLE', 'INVALID_INPUT'])` (`sudoku/solver/apiError.ts:54`, `futoshiki/solver/apiError.ts:44`). The client **never emits `'UNSATISFIABLE'`** — its UNSAT code is the string `'UNSAT'` (`solverError.ts:14`; thrown as `coded_error("UNSAT", …)` at `csp-solver/wasm/src/sudoku.rs:247` / `futoshiki.rs:296`). So a thrown `UNSAT` misses the teacher-red set, falls through `PAPER_NOTE_VARIANT` (no `UNSAT` key), and classifies as `variant:'unknown'` → paper-note card ("something went sideways") instead of teacher-red-on-board.

**Why it doesn't mis-render *today* (blast radius, precise):** `UNSAT` is thrown *only* from the **propagate** path (pencil-marks; `sudoku.rs:220-248` is the propagate fn — solve returns `solved:false` for UNSAT, `sudoku.rs:135-136`, handled at `useSudoku.ts:228` `result.solved ? 'solved' : 'failed'`, never touching the classifier). The propagate throw is swallowed by the bare `catch { pencilMasks.value = null }` at `useSudoku.ts:317-319` — marks are "a courtesy, never an error surface" (`useSudoku.ts:302-303`). So the mismatch is **latent, not live**: it costs nothing now, but it is a tripwire — the instant any future path routes a thrown `UNSAT` through `classifyError`, it silently mis-grades a provable contradiction as broken machinery. Kill by replacing `'UNSATISFIABLE'` → `'UNSAT'` (the string the engine actually stamps).

### K1b — four unreachable `PAPER_NOTE_VARIANT` keys (pure dead)
`PAPER_NOTE_VARIANT` (`sudoku/solver/apiError.ts:56-63`, `futoshiki:46-53`) maps six codes. Of those, **`TIMEOUT`, `RATE_LIMITED`, `NOT_FOUND`, `INTERNAL` can never occur** — they were server-origin codes (slowapi rate-limiter, route 404, wall-clock timeout, FastAPI 500); the worker's `describeError` allowlist (`solver.worker.ts:61`) cannot produce any of them. Only `BUDGET_EXCEEDED`→`budget` and `WORKER_FAILURE`→`network` are reachable. Correspondingly dead: the `PaperNoteVariant` members `'timeout' | 'rate-limited' | 'not-found' | 'server'` and their four `PAPER_NOTE_COPY` rows (`apiError.ts:44-51` sudoku / `33-41` futoshiki). Reachable variant set collapses to `{budget, network, unknown}`.

**Blast radius:** small + contained. Consumers are `classifyError` (`useSudoku.ts:197,242` / `useFutoshiki.ts:191,234`) and `classifyCode`+`PAPER_NOTE_COPY` (`SudokuBoard.vue:289,293` / `FutoshikiBoard.vue:344,347`). Pruning the four keys/variants/copy-rows changes no reachable behavior; it shrinks the union to what the wire can carry. `WORKER_FAILURE` correctly *added* (not a server code) → keep. This is exactly the "W2 zero-risk kept" residue the brief names — zero-risk to keep, but now legacy under the wasm-only order. R5's D3 already flags the *file name* `apiError.ts` as a fossil (no `/api/`/`fetch` inside); K1 is the *contents* fossil beneath the name.

---

## K2 — two fully-dead config consts in `pencilConfig.ts` (MEDIUM)

Zero external importers, zero in-file consumption (grep `\bMOTION\b`/`\bYOSHI_COLORS\b` over all `src/` returns only comment + definition lines):

### K2a — `export const MOTION` (`pencilConfig.ts:37-59`, 23 lines) — DEAD, references a deleted file
A cadence-band/easing **spec object**, never read at runtime. Worse, its `easings.*.resolvesVia: 'easings.ts'` (`:51-53`) points at `src/pencil/composables/easings.ts` — **deleted at HEAD** (git status `D`; the dir now holds only `celebration.ts` + `useButtonAnimation.ts`; deletion traces to T2-W5 `49506bf8`). MOTION is documentation-as-code for a module that no longer exists. Kill the const (fold any surviving prose into a `pencil/README.md` per R5-D7 if the design language is worth keeping as text, but not as an unconsumed TS export).

### K2b — `export const YOSHI_COLORS` (`pencilConfig.ts:74-93`, 20 lines) — DEAD aspirational config
A palette object authored as "the single source" for the celestial mascot, but **never wired**. Its own comment concedes the consumer rewire "is a component change, owned by the celestial lane; this lane lands the config authority only" (`:87-88`). `DarkModeToggle.vue` still **hardcodes** the identical hexes inline — `#E88845` (`:21`), `#FFF4AA` (`:65,75-81`), `#E5C74D` (`:65`) — i.e. `YOSHI_COLORS.celestial` (`:89-92`) duplicates values that live authoritatively in the template it was meant to replace. The lift never happened, so the config authority is dead weight *and* a divergence hazard (edit one, the other rots). Kill the const, or (if the celestial-palette-centralization is still wanted) that's a tranche-III *wiring* task, not a keep-as-is.

**Blast radius K2:** nil — both are unreferenced; deletion is byte-safe. ~43 lines off the "config hub" (R5-L5 notes pencilConfig is 311 lines / 8 bands; two of those bands are dead).

---

## K3 — orphan CSS class `.fira-code` (LOW)

`.fira-code` (`assets/index.css:360`, the font-utility band R5-L2 flags) has **zero references** in `src/` or `e2e/` (grep `fira-code` excluding index.css → empty). The Fira Code subset it would apply (`assets/fonts/firacode-subset.woff2`) is still loaded via `@font-face`, but no element ever requests the `.fira-code` utility. Dead selector. (Two other scan hits — `.googleapis`, `.gstatic` — are **false positives**: substrings of `fonts.googleapis.com`/`fonts.gstatic.com` inside CSS *comments*, not selectors; ignore.) Verify the woff2 itself isn't orphaned before dropping the font too — the `@font-face` may be referenced by a raw `font-family` elsewhere; scope this kill to the unused *class*, and flag the font subset for a follow-up check.

---

## K4 — 11 unused type `export`s (LOW, knip-style hygiene)

No `knip`/`depcheck` in the toolchain (`package.json` has neither; `node_modules/.bin` clean) — so these accrete silently. Each is a `type`/`interface` used **only inside its own file** (the type is live; the `export` keyword is the dead part):

| Symbol | File | In-file use |
|---|---|---|
| `BoilConfig` | `pencil/config/pencilConfig.ts:142` | `:150,159` |
| `GrainConfig` | `pencilConfig.ts:97` | `:134` |
| `WobbleConfig` | `pencilConfig.ts:104` | `:135` |
| `MultiPassConfig` | `pencilConfig.ts:118` | `:136` |
| `TextureConfig` | `pencilConfig.ts:125` | `:137` |
| `DrawInPreset` | `pencilConfig.ts:240` | interface only |
| `GlyphVariants` | `pencil/glyph/glyphPaths.ts:22` | `:28` |
| `BoilFrames` | `pencil/grid/gridPaths.ts:22` | `:31,34,211` |
| `GridPaths` | `pencil/grid/gridPaths.ts:14` | `:59` |
| `BoardSize` | `games/futoshiki/types.ts:39` | local |
| `TemplateBank` | `games/sudoku/data/templates.ts:5` | `:7` |

**Blast radius:** cosmetic — drop `export` (or leave; harmless). The real value is a **standing gate**: adding `knip` to the `frontend` CI lane (alongside `vue-tsc`) would catch K1/K2/K3/K4-class rot mechanically. Recommend it as a tranche-III lane deliverable rather than hand-maintaining kill lists.

---

## What is NOT legacy (skeptical clears — do not touch)

- **Dev tooling** — `FilterTuner.vue` + `rafInstrumentation.ts` are **live and correct**: `FilterTuner` is `import.meta.env.DEV`-gated + `defineAsyncComponent`-lazy (`App.vue:61-62,144`), DCE'd from prod; `rafInstrumentation` is `main.ts:6` DEV-gated. Not dead — env-scoped by design. (R5-§4 confirms `pencil/dev/` as clean.)
- **PWA icons** — `public/pwa-{192,512,maskable-512}.png` are the three distinct manifest sizes (`dist/manifest.webmanifest` emits all three); no dupes. `favicon.svg` is separate. Clean.
- **`_redirects` / `_headers`** — already **post-abrogation clean**: `_redirects` is SPA-fallback only, comment "there is no API origin to proxy"; `_headers` CSP is `connect-src 'self'`, comment "the frontend solves in-browser (wasm Worker); there is no cross-origin fetch" (`public/_headers:53-54,74`). No `/api/*` residue.
- **All 15 pencil/chrome components** — importer sweep (excluding self/README): `BoilDivider`(3), `MarginNote`(2), `ScribbleLoader`(2), `SheetWashiLabel`(2), `AnswerKeyLaminate`(2), `DiceIcon`(2), `SolveIcon`(2), `CelebrationStar`(2), `HandwrittenGlyph`(7), `HandDrawnOutline`(5), `HandDrawnGrid`(3), `CrayonHeart`(1), `OptionSelector`(6), `DarkModeToggle`(3), `SvgFilters`(1). None orphaned. R5-L3's "chrome grab-bag" is a *structure* concern (regroup into `icons/`/`filters/`), not dead code.
- **`SolverErrorNote.vue`** (both games) — live, imported by each Board (`SudokuBoard.vue:4,420` / `FutoshikiBoard.vue:16,486`).
- **`easings.ts`** — already deleted (K2a); the only residue is MOTION's dangling reference.

---

## Priority for tranche-III authoring
1. **K1a** — `'UNSATISFIABLE'`→`'UNSAT'` in both apiError twins (latent mis-grade; 1-line each). Highest correctness value.
2. **K1b** — prune the four server-only variants/copy/keys in both twins (dead, zero-risk). Pairs naturally with R5-D3's `apiError.ts`→`classifyError.ts` rename.
3. **K2a+K2b** — delete `MOTION` + `YOSHI_COLORS` (or, for K2b, promote to the *wiring* task the const was staged for). ~43 lines.
4. **K4 as a gate** — add `knip` to the `frontend` CI lane; it subsumes K3/K4 and prevents recurrence.
5. **K3** — drop `.fira-code` (verify the woff2 isn't separately orphaned first).
