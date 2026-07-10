# T2-W4 Lane B — frontend SPA-template derivation over the reshaped bank

Machine: Apple M5 Max. Date: 2026-07-10. Repo: master (uncommitted; no commit per binding rules).

## What landed

The `sudokuTemplates` Vite plugin (`web/frontend/vite.config.ts`) now derives
`src/games/sudoku/data/templates.ts` from the W4-reshaped bank, tolerating the
excised tiers rather than crashing on their absent directories.

1. **Conservative split (`SIZES = [3, 4]` + per-difficulty guard).** P2.diff's
   `SIZES = [4]` was all-or-nothing per size and would have dropped the surviving
   N=3-hard bank. Authored instead: `SIZES = [3, 4]` plus an `existsSync(dir)`
   guard inside the difficulty loop — a git-rm'd tier dir yields `bank[n][d] = []`
   (not an `ENOENT` throw from `readdirSync`). N=3 keeps only `hard`; `easy`/`medium`
   collapse to `[]`.
2. **Sparse wrapped reader.** The plugin parses `data.puzzle` as a
   `{"<pos>":<val>}` map: `for (const [k, v] of Object.entries(data.puzzle)) flat[Number(k)] = v`
   over a zero-filled `(n*n)**2` array. (Already carried in the checked-in plugin;
   verified against the on-disk sparse JSON.)

## Verification

- On-disk bank: `3/hard` (20 boards), `4/{easy:10, medium:7, hard:5}`; no `2/`, no `5/`.
- `npx vue-tsc -b` → exit 0 (clean).
- `npx vite build` → clean; regenerated `templates.ts` is **byte-identical** to the
  committed one (45 boards, 8020 u32 cells) — regeneration is idempotent.
- `templates.ts` structure: `"3":{"easy":[],"medium":[],"hard":[[…]]}`, `"4"` all
  three tiers populated. Excised tiers are empty arrays.
- Consumer `useSolver.ts:118` — `TEMPLATE_BANK[size]?.[DIFFICULTY_KEY[difficulty]] ?? []`;
  an empty (or `undefined`-size, e.g. N=2) entry yields a zero-length `Uint32Array`
  seed → wasm live-gen. No error path.
- `npx playwright test e2e/round9.spec.ts` → **7 passed**. Includes size-switching
  (4×4=N=2, 9×9=N=3, 16×16=N=4 all render grid lines) and randomize-populates-board
  (exercises the live-gen fallback for the bankless N=2). Graceful-degradation test
  green (no console errors).

## Notes

- vite.config.ts edits (SIZES/guard) and the concurrent W6 PWA `VitePWA(...)` plugin
  both present in the working tree; no conflict.
- Docs: `docs/sudoku.md` bank language was rewritten by Lane A; no further frontend
  doc edit needed for this lane.
