# W0 row 0.1 — `web/frontend/README.md` rewrite: derivation notes

Row: T5-W0 §0.1. Source of the defect: `evidence/audit/r1/doc-canon-drift.md` §S1 (CRITICAL)
+ §S4. Verdict there was **rewrite, not patch** — the file at HEAD described a product that
no longer exists. Executed as a whole-file rewrite (154 lines at HEAD → 213 lines now).

Every figure below was measured against the working tree on 2026-08-01, host darwin/arm64.
Nothing inherited from the row text, the audit prose, or the prior README.

## Gate

```
$ grep -nEi "two games|0\.7\.0|prettier --write" web/frontend/README.md
(no output) — exit 1
$ node scripts/check-doc-truth.mjs
GREEN  frontend-readme-two-games
        derived: 5 games registered (sudoku, futoshiki, thermo, killer, kenken) ·
                 pencil-boil ^0.10.1 · lint script "prettier --check src/"
```

Whole-run posture at the time of this write: `4 RED / 6 GREEN` (the remaining reds belong to
rows 0.2/0.3/W2's re-stamps, not this one). `pencil-boil-0.9.2` also flipped GREEN — its
second site was `web/frontend/README.md:11`, cleared here.

Meta-leak grep over the new file — `\b(tranche|wave [0-9]|WGATE|ballot|Fable|Opus|ultracode|the
owner|owner-audit|T\d-W\d+|P\d-W\d)\b`, case-insensitive — **zero hits**. The corpus invariant
holds.

## Derivations

| Claim in the file | Derived from | Value |
|---|---|---|
| five games | `src/games/registry.ts` — `GAMES` array holds `sudokuCard, futoshikiCard, thermoCard, killerCard, kenkenCard`; `src/games/` holds 5 concrete game dirs | 5 (sudoku, futoshiki, thermo, killer, kenken) |
| pencil-boil `^0.10.1` | `web/frontend/package.json` `dependencies["@mkbabb/pencil-boil"]` | `^0.10.1` |
| `npm run lint` | `package.json` `scripts.lint` | `prettier --check src/` |
| script list | `package.json` `scripts` (wasm, prebuild, dev, build, preview, lint, lint:eslint, lint:knip, test:unit, test:e2e, test:golden, deploy) | verbatim |
| Node ≥24, npm ≥11 | `package.json` `engines` | `{"node": ">=24", "npm": ">=11"}` |
| dev port 3000 | `vite.config.ts` `server.port` | 3000 |
| wasm ship recipe | `csp-solver/wasm/Makefile:19-21` | `wasm-pack build --scope mkbabb --target web --profile wasm-release --no-default-features` |
| wasm dep is a `file:` link | `package.json` `dependencies["@mkbabb/csp-solver-wasm"]` | `file:../../csp-solver/wasm/pkg` |
| vite plugins | `vite.config.ts` `plugins: [vue(), tailwindcss(), sudokuTemplates(), headHints()]` | 4 |
| ESM Workers | `vite.config.ts` `worker.format: 'es'` | — |
| aliases | `vite.config.ts` `resolve.alias` + `tsconfig.json` `paths` | `@pencil`, `@games`, `@` |
| two Playwright engines | `playwright.config.ts` `projects` | `chromium`, `webkit` |
| golden config posture | `playwright-golden.config.ts` — `deviceScaleFactor: 2`, `reducedMotion: 'reduce'`, `launchOptions.args: ['--force-color-profile=srgb']` | — |
| throttle preview port | `playwright-throttle.config.ts:39` `const PREVIEW_PORT = 4188` | 4188 |
| vitest scope | `vitest.config.ts` — `environment: 'jsdom'`, `include: ['src/**/*.test.ts']` | — |
| 4 `scripts/*.mjs` gates | `ls web/frontend/scripts/` | check-font-coverage, check-golden-bytes, check-ink-pressure, check-prod-shake |
| 8 icons | `ls src/pencil/chrome/icons/` | Dice, Eraser, FillForced, Hint, Redo, Share, Solve, Undo |
| glyph coverage | `src/pencil/glyph/glyphPaths.ts:2` | digits 1–9, 0, and A–G (16×16) |
| undo cap 200 | `src/games/shared/useUndoHistory.ts:45` `const UNDO_CAP = 200` | 200 |
| five workers | `find src -name solver.worker.ts` | sudoku, futoshiki, thermo, killer, kenken |
| five per-game protocols + one shared | `find src -name protocol.ts` | 5 game + `shared/solver/protocol.ts` |
| one transport | `src/games/shared/solver/transport.ts` — singleton + pending map + `prewarm` + bounded respawn (`WORKER_FAILURE` rejects in-flight, retires the singleton) | — |
| `BUDGET_EXCEEDED`, `maxSolutions: 1`, node budget | `src/games/sudoku/solver/useSolver.ts:131,143,148`; `transport.test.ts:142-148`; `useGameState.ts:540` | — |
| technique-engine substrate | `src/games/shared/techniqueEngine.ts` header — grades over self-computed basic-elimination candidates, never `propagateBoard`'s post-GAC masks | — |
| sudoku eager, rest lazy | `src/games/registry.ts` — `eager: true` on `sudokuCard` only; every other card's `scene` is a dynamic `import()` | — |
| one live board / Teleport | `src/games/shared/GameScene.vue:75` `<Teleport :to="faceTarget" :disabled="!faceTarget">`; `src/games/shared/useLiveFace.ts`; `App.vue:269` `setLiveFaceTarget(el)` | — |
| ARIA grid + roving tabindex + Ctrl+Home/End | `src/games/shared/GameBoard.vue:369,453-456,734-735` (`aria-rowcount`/`aria-colcount`) | — |
| `role="status"` / `role="alert"` split | `src/pencil/chrome/MarginNote.vue:57` (tones `graphite \| teacher-red \| gold-star`, line 30) vs `src/games/shared/SolverErrorNote.vue:43` | — |
| no Rough.js | `grep -rni "roughjs\|rough.js" package.json src` | zero hits |
| fonts | `src/assets/fonts/` — 3 woff2 subsets + 3 OFL texts; `typography.css:15-16` | Fraunces display · Patrick Hand hand · Fira Code mono |

## Two corrections the rewrite makes beyond the row text

1. **Ink semantics.** The HEAD file said givens carry the `sparkle-rainbow` gradient and
   revert to `user-ink` on override. `src/pencil/glyph/HandwrittenGlyph.vue:81-85` is the
   authority and says otherwise: `isSolved → url(#solver-ink)`, given-and-not-overridden →
   `var(--color-foreground)`, everything else → `var(--color-user-ink, #2563eb)`. The
   sparkle-rainbow now belongs to chrome's sparkle icon; solver-filled cells take the
   theme-resolved `#solver-ink`, and only that ink celebrates (`:221`). Note that
   `src/assets/index.css:796` still carries the old prose in a comment — a source comment,
   out of this row's scope (docs/records/scripts only).
2. **Boundary coverage.** The HEAD file claimed "exactly two real boundaries". `eslint.config.js`
   carries four rules: pencil ↛ games; sudoku ↮ futoshiki; shared ↛ concrete game; and the
   pencil-depth rule (no 4+ levels into pencil internals, appended into each game rule's own
   `patterns` array). The cross-game rule's glob set names the sudoku/futoshiki pair alone,
   while the variants genuinely import their base game — `thermo` (8 sites) and `killer`
   (8 sites) reach `@games/sudoku`; `kenken` (7 sites) reaches `@games/futoshiki`, all for the
   cell component, the tier constants, and the technique module. The README states that as
   convention-not-lint rather than repeating the "two boundaries" fiction.

Also newly stated, from `*UrlState.ts` headers: the `?board=` share permalink is wired for
sudoku and futoshiki only; thermo/killer/kenken persist to their own `localStorage` keys with
`boardLink` pinned to `"absent"` and `writeShareUrl` a no-op
(`thermoUrlState.ts:7-8,104-108`, `killerUrlState.ts:105-109`, `kenkenUrlState.ts:105-109`).

## Not carried

- e2e test totals (206/15/20) — row 0.2's ground, cited in the root README, deliberately
  absent here so the count lives in one home.
- The lean-wasm byte figure — row 0.3's ground.
- `npm 10 mis-resolves the lockfile` — unsubstantiated in-tree; the file states `engines` and
  stops there.
