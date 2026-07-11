# T3-W8 — FE-perf GATE (measured against the BUILT `dist/`)

Gate lane for wave T3-W8. Every number below is measured against a **built preview snapshot**
(`vite preview` over an immutable `dist-*` copy on a free port :4319), never the dev server — the
wave's explicit trap. Method reuses G7's `probe-felt.mjs` verbatim (rAF-gap sampling; DPR2;
unthrottled + 4× CPU via CDP `Emulation.setCPUThrottlingRate`). Machine: Apple M5 Max, 2026-07-10.
Quiet-box honored — the concurrent T3-W5 bench lane was polled clear (`pgrep -f "cargo bench|criterion"`)
before every timed run.

**Interleave discipline.** The W8 source fixes were already landed in the working tree by the
implementation lanes. BEFORE = those fixes reverted (pure-W8 source `git checkout HEAD`; vite.config
surgically reverted to `manualChunks` + no `headHints`, **keeping** W5's autoprefixer/postcss drop so
the two builds differ only in W8). AFTER = the working tree. Both built, snapshotted immutable
(`dist-before` / `dist-after`), served in turn. The concurrent lane wiped the live `dist/` mid-run —
serving from the snapshots isolated the measurement from that churn.

Instruments (this dir): `probe-felt-gate.mjs` (G7's full battery, env-parametrized for the preview
port), `probe-stability.mjs` (focused size-switch + marks, N=6 @4×, to separate the fix delta from
throttle variance). Raw: `felt-before.json` / `felt-after.json` (N=2 full battery),
`stab-before.json` / `stab-after.json` (N=6 focused).

---

## Gate table (quoted numbers)

| Gate | Bar | Measured | Verdict |
|---|---|---|---|
| size-switch | 9→16 @4×/DPR2, after-side worst frame **below** the 99–103 ms band; ratio drop from ~3.6× | AFTER worst **97 ms** (N=2), median **88.5 ms** (N=6, 77–96); BEFORE worst 99, median 85 (84–90). Ratio ~2.9–3.5× both sides. `over100 = 0`. 256 cells / 175 mounts unchanged. | **BELOW band — but delta null.** See §1. |
| marks burst | marks/peek 16×16 @4×, worst frame **below** the 87–91 ms band; 9×9 unregressed | AFTER worst **60 ms** (marksCells 1761); BEFORE worst 76 (marksCells 1152). 9×9: AFTER 48 / BEFORE 31 — both ≪ band, unregressed-class. | **BELOW band; slight drop within variance.** §2 |
| cold-start | preview cold-cache TTI before/after; head census flips from zero | Census **zero → full**: BEFORE `{wasm:false, worker:0, font:0}` → AFTER `{wasm:true, worker:2, font:3}` + 2 worker modulepreloads. TTI localhost-flat (60→62 ms 1×, 218→212 ms 4×) — expected. | **PASS (census).** §3 |
| chunk graph | preview build: Vue runtime in its own group; husk request gone; lazy boundaries intact | `beforeCreate` moved `animation-vendor`→`vue-vendor`; vue-vendor 8,480 B husk → 69,177 B real; animation-vendor 67,626 B → 6,566 B; index→vue-vendor 4→45 sym; the 3-hop `vue-vendor→animation-vendor` (24 sym) **gone**. | **PASS (clean).** §4 |
| parity | full e2e green (34/34-class); no behavior change | **34 passed (16.7 s)** against the BUILT dist-after preview. | **PASS.** §5 |

---

## 1. size-switch 9→16 — below band, but the fix delta is null on this hardware

| @4× worst frame (ms) | BEFORE | AFTER |
|---|---|---|
| N=2 full battery (s1/s2) | 99 / 76 | 81 / 97 |
| N=6 stability | min 84, **median 85**, max 90 | min 77, **median 88.5**, max 96 |
| ratio 4×/1× | 3.54 / 2.62 | 2.89 / 3.46 |
| cells / mounts | 256 / 175 | 256 / 175 |
| over100 | 0 | 0 |

Both sides sit **below the 99–103 ms band** — but so does the BEFORE build on this machine, and the
before/after medians (85 vs 88.5) are **statistically identical**; the "~3.6× → lower" ratio drop is
**not demonstrable**. The measured cause: the burst is **mount-dominated** — 256 `.sudoku-cell`
mounts + the grid-template recalc are unchanged by the fix (mounts=175 both sides). The
`generateCellRects` extraction/LRU removes only the discarded frame/line wobble pass (~40 `wobbleLine`
ops vs 256 `wobbleRect` ghosts ≈ 13% of the path-gen), which is inside the 4×-throttle variance floor.
The fix is **architecturally sound** (the LRU is real, cache-keyed, and eliminates the redundant
regen — verified in-source; a return to a prior size is a hit) but **felt-neutral** here. The residual
headroom lives in A17 fix-direction (b)/(c) — idle-chunk / virtualize the 256 *mounts* — which this
wave did not take. G7's original 99–103 was measured with concurrent load; this interleaved run put
the before build at the band floor, leaving no room to show a drop.

## 2. marks/peek 16×16 — below band, slight drop

AFTER worst **60 ms** (N=2, marksCells peak 1761) vs BEFORE **76 ms** (marksCells 1152), both under the
87–91 band. 9×9 stays free (AFTER 48 / BEFORE 31 ms, `over100=0`) — unregressed-class. The mark-mount
cost scales with empty-cell count (varies per random board), so the drop is real-but-noisy; the
idle-chunk defers the ~2.4 k-node mount off the critical frame. The probe's marks gesture fires
correctly (marksCells reaches 1761–2430, matching G7's ~2.7 k) — `markGlyphs=0` in the JSON is only
the post-Escape count.

## 3. cold-start — census flip clean (the durable, quotable payoff)

```
BEFORE head: { modulepreload:[animation-vendor, vue-vendor], preloadWasm:false, preloadWorker:0, preloadFont:0 }
AFTER  head: { modulepreload:[vue-vendor, animation-vendor, solver.worker×2], preloadWasm:true, preloadWorker:2, preloadFont:3 }
```

The `headHints` `transformIndexHtml` plugin injects, into the built `index.html`: 2× worker
`modulepreload`, 1× wasm `preload as=fetch crossorigin type=application/wasm`, 3× subset-woff2
`preload as=font crossorigin`. TTI-to-first-cell is localhost-flat (60→62 ms 1×, 218→212 ms 4×) — the
millisecond payoff is network-bound and localhost fetch is instant; the census flip is the honest
gate deliverable (the wave's own caveat R-7/R-12).

## 4. chunk graph — husk re-derived, Vue isolated (clean pass)

| forensic marker | BEFORE (husk) | AFTER (advancedChunks) |
|---|---|---|
| `beforeCreate` (Vue option-merge) | **animation-vendor** ×3 | **vue-vendor** ×3 |
| vue-vendor size | 8,480 B (A17's 8.5 KB husk) | 69,177 B (real Vue runtime) |
| animation-vendor size | 67,626 B (Vue + pencil-boil) | 6,566 B (pencil-boil only) |
| index → vue-vendor | ~4 symbols | ~45 symbols |
| index → animation-vendor | ~61 symbols | ~18 symbols |
| vue-vendor → animation-vendor | **YES — ~24 sym (3-hop)** | **NO (husk gone)** |

The BEFORE build reproduces A17-P4 to the byte (8,480 B husk, 24-symbol back-import, the
`index → vue-vendor → animation-vendor` inversion). AFTER, `advancedChunks.groups` forces Vue's
runtime into its own cache-stable chunk; `animation-vendor` is pencil-boil alone and correctly
depends *on* `vue-vendor` (the proper base direction). Cache isolation restored — a pencil-boil bump
no longer re-downloads Vue. Lazy boundaries intact (`FutoshikiGame`, `AnswerKeyLaminate` still split).

## 5. parity — 34/34 green against the BUILT artifact

`PLAYWRIGHT_BASE_URL=http://localhost:4319 npx playwright test` (dist-after preview, port-guard
satisfied via base-URL override per e2e/global-setup.ts) → **34 passed (16.7 s)**. affordances (9),
futoshiki (4), sudoku-interaction (7), permalink (6), throttled-void (1), visual-regression (7).
The W8 fixes are cache / idle-chunk / head-hint — no behavior change, confirmed.

---

## Disposition

- **Clean gate passes:** cold-start census flip, chunk-graph re-derivation, parity 34/34 — all against
  the built `dist/`.
- **Below-band, delta-null:** size-switch — the felt hitch is remount-bound, not path-gen-bound; the
  extraction/LRU is correct but felt-neutral on the M5 Max at 4×. A measured finding, not a fix
  failure: it re-points the residual at the 256 mounts (A17 (b)/(c), unspent).
- **Below-band, noisy drop:** marks/peek 16×16 (76→60 ms), 9×9 unregressed.
</content>
