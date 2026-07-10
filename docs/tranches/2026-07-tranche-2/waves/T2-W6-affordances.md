# T2-W6 — Affordances

**R3 GO: the bound order, with the Q7 interlock fixes folded and the Q4 SW strategy written out.** Depends on W5 because fonts must be self-hosted before the PWA precache is honest, and the SW composes with (never contradicts) the W5 cache-header add.

**Dependencies**: ← W5. **Effort**: L.

---

## Scope — strictly in the ratified order

1. **Print CSS** — ~20 L `@media print` in `index.css`: hide chrome, black glyph strokes, strip solve-washes.
2. **K-peek input-exemption** — `t.closest('.board-cells')` replacing the tag-based block (1 line ×2 games); the guard blocks exactly the roving-tabindex resting state. Lives entirely inside the `'k'`/`'K'` branch—shares no code path with undo.
3. **Stale-note clear** — on `'idle'`, clear any **non-graphite** tone (verify-14's widening: the gold-star note goes stale by the same path).
4. **Backtracks stat-line**, both games — widen `useSolver.ts:166-172`'s return (+`backtracks`, `solutionCount`; optional worker `elapsedMs`); the payload is already on the wire (`solver.worker.ts:81`, `protocol.ts:29,32`). The cheapest high-value change in the tranche.
5. **Bounded undo (Q7-amended)** — capped `{pos,prev,next}[]` per game composable. Shortcut set: **Ctrl+Z / Cmd+Z / Ctrl+Shift+Z / Cmd+Shift+Z** with `preventDefault`—**gate on `e.ctrlKey || e.metaKey`, never `ctrlKey` alone**: the original native-undo phantom was reproduced via Cmd+Z on macOS; a ctrl-only guard ships the fix unfixed on the platform it was caught on (zero `metaKey` reads exist in the codebase today—clean omission, not handled elsewhere). Also gate the `handled`/`preventDefault` path on the modifier being true—a plain `z` keystroke must not be swallowed. **Placement**: a sibling case in `onBoardKeydown` (`SudokuBoard.vue`/`FutoshikiBoard.vue`'s `.board-cells` handler)—never the per-cell `handleKeydown` (Backspace/Delete only) or the window-level K-peek handler (`'k'`/`'Escape'` only). The three layers key on disjoint `e.key` sets and `preventDefault()` doesn't stop bubbling—this placement is structurally incapable of regressing K-peek or roving tabindex (traced at HEAD, all three handlers).
6. **Share-on-demand permalink (Q7-amended)** — `?board=` base64url written on an explicit act wearing the `SheetWashiLabel` grammar. **Real new branching, not a hookup**—the "scaffolding exists" reading transfers the principle, not the code: (a) `hasUrl` in `resolveInitialState()` must OR in board-param presence (today it's `size`/`difficulty` only—a board-only link is silently dropped); (b) a `PersistedBoard`-shaped object must be synthesizable from the decoded `?board=` (no such constructor exists—the type is only ever built from `localStorage`); (c) a length/size mismatch between `?board=` and `?size=` **fails closed** to the size/difficulty-only path, never renders a corrupt board. URL wins over storage on load; Randomize/Clear drop the param via a new `.delete()`-based helper (the existing `syncToUrl` never deletes keys, by design). **Accretion fix**: `setGame` strips the outgoing game's `size`/`difficulty`/`board`/`board_size` params on switch—the by-design param co-existence generalizes mechanically to `?board=`, and a ~256-char blob riding into futoshiki's URL defeats the clean-URL rationale that made the permalink share-on-demand in the first place (lane 14's "cosmetic" verdict predates `?board=`—don't inherit it).
7. **PWA-minimal (Q4's written SW strategy)** — manifest + `vite-plugin-pwa` generateSW precache only; no sync, no toasts. **The hashed wasm in one line**: *precache-first as a `revision:null` entry—the content hash in the filename is the version, served immutable over HTTP for the install/first-load fetch and cache-first from Cache Storage at runtime; no runtime route, no size bump.* The W5 immutable header and the precache are the SAME decision at two layers—the install fetch is satisfied from the warm HTTP cache, zero extra bytes. Config, the one deliberate decision plus pins:
   - **`workbox.globPatterns: ['**/*.{js,css,html,wasm,woff2,svg}']`** — MANDATORY widening: the default `{js,wasm,css,html}` precaches the wasm but silently DROPS the P5 woff2 faces (and `favicon.svg`), negating the very fonts-before-PWA dependency this wave records.
   - Keep the plugin defaults `dontCacheBustURLsMatching: /^assets\//` (hashed → `revision:null`, no `__WB_REVISION__`) and `cleanupOutdatedCaches: true` (evicts superseded wasm/font hashes on activate); `navigateFallback: 'index.html'`.
   - **Forbid any `runtimeCaching` route on `/assets/*`** (a second CacheFirst route would double-store the wasm and fight precache). No `maximumFileSizeToCacheInBytes` bump (87,853 B ≪ the 2 MiB default).
   - **Pin `start_url: '/'` explicitly** (Q7)—icon launches always take the clean fresh/storage precedence, never replay a captured `?board=`. No structural collision with regular link opens (`start_url`/the navigation fallback intercept the document fetch, never `location.search`).
8. **Hint tier** — `H` fills the focused cell from the peek cache, solver-ink; **hard-gated AFTER undo lands**. No bookkeeping, no penalties.

Plus the L14 bonus: a washi discoverability label on the hold-to-peek surface (the grammar already exists).

**REJECTED, stand**: manual pencil marks (the engine-domains variant is the tranche-III booking—README §4; W6 does NOT depend on it), upfront hints, input-mode toggle, timer, anything past precache.

## Gates

| Gate | Value |
|---|---|
| e2e | one spec per affordance (`.controls-card` scoping) **plus one shared keyboard spec** exercising K-peek + roving tabindex (Ctrl+Home/End) + undo together in one page session—cross-handler regressions pass three isolated specs and fail only the composed one; this is the FIRST keyboard codification (0 keyboard assertions exist pre-W6) (Q7) |
| Permalink | board-only URL loads; mismatched `?board=`/`?size=` falls closed; game-switch leaves no foreign params |
| Play-log | re-run |
| Offline | reload works with **fonts AND wasm both served from Cache Storage**, not just the shell (Q4's tightening) |

## Seeds

- [`../evidence/pass3/Q7-affordance-interlocks.md`](../evidence/pass3/Q7-affordance-interlocks.md) — the interlock traces (three-layer keydown chain, resolver shape, accretion mechanics).
- [`../evidence/pass3/Q4-w5-w6-pwa-cache.md`](../evidence/pass3/Q4-w5-w6-pwa-cache.md) — the SW strategy, read from installed plugin source (vite-plugin-pwa 1.3.0 / workbox-build 7.4.1 defaults).
- [`../evidence/synthesis-pass1.md`](../evidence/synthesis-pass1.md) D11 (verify-14 chain: 0 refuted, play-log corroborated).

## Residual risks

- The permalink resolver branching is the wave's only genuinely new state logic—budget it as such (Q7's deviation note to estimators).
- PWA install-while-deep-linked means later icon launches go to `start_url`, not the link—expected platform behavior, out of scope per "nothing past precache"; documented so nobody re-litigates it.
- `vite-plugin-pwa` under Vite 8: the plugin's peer range spanned ^8 at verification (D26/verify-32); if the W1 Vite-8 beat and this wave land far apart, re-check the pin.
