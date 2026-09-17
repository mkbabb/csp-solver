# REFUTE A2 — THE MAIN CHUNK'S FREIGHT (T9-W8 §8.1)

Adversarial refuter, port 4256, 2026-09-17. I did not write lane A2. Nothing was built; identity
before and after in `evidence.txt` — it did not move. board-ready = lane A2's INIT string, verbatim.

## 1. REPRODUCE (`readings.jsonl`)

| lane number | my re-take (load: lane 6.2–9.2 / mine 4.2–5.1) |
|---|---|
| chromium 4× cold desk **317.3 ms**, FCP 44, TBT 173 | **313.2** (n=5) and **309.4** (n=5), FCP 44, TBT 166/163 |
| webkit cold desk **249.0 ms** | **228.0** (n=3) |
| CSS 93,735 raw / 16,427 br; dark-scoped 1,433 B (1.5 %); `prefers-color-scheme` 0 | identical |
| CSS used at ready **45,341 B (48.4 %)** | **44,991–44,996 B (48.0 %)**, n=5 |
| entry executed at ready **113,166 / 215,322 = 52.6 %** | **113,192–115,004 / 215,275 = 52.6–53.4 %**, n=3, re-derived WITHOUT sourcemaps |
| worker preloaded; first Worker after ready | worker req 33 ms · BOARD-READY 825 wall · worker-created 830 |
| wasm never before ready | first `.wasm` 1136 ms, from the Worker |
| templates stub = −0.1 ms | **−2.4 ms** (304.6 / 307.0, n=5) — nil either way |
| webkit woff2 **2/2/3 all 200**; chromium **1/1/2** (2nd fraunces 300 B) | identical, both engines |
| 183,194 encoded bytes before ready | 183,194, summed off my own waterfall |

**Two banked instruments do not run as banked.** `module-map.mjs` → `ENOENT … index-9rZPzI5DEcpe.js.map`
(the fixed dist ships no sourcemaps; the maps lived only in the `scratch-dist` the lane deleted, and 8.1
forbids a rebuild). `coverage-attrib.mjs` runs but returns `chunks: []`, and its CSS figure degrades to
`{"used":1145517,"total":1145517}`. So every **per-source-module** row (gallery 6 %, techniqueEngine 3 %,
useSession 13 %, the 43 % rollup) rests on evidence that cannot be re-run this wave. `xentry-coverage.mjs`
re-derives what a sourcemap is not needed for: chunk-level 52.6 % lands on the nose, gallery marker
regions read **4.5–11.4 %** executed, technique markers **9.8–14.7 %** (±3,000-char locality proxy,
coarser than the lane's fold). Direction and rough size hold; the exact per-module figures do not verify.

## 2. HOST vs BUNDLE

My re-takes ran at 1-min load 4.2–5.1, the quietest window available (watched 10 min from 19:03; load
rose to 8.1 rather than falling). The headline did not move: 317.3 → 313.2 → 309.4. No host fact here.

## 3. THE CRITICAL PATH — ablations the lane did not run (`xablate.mjs`, n=5 interleaved, 4× cold desk)

| probe | base | ablated | delta |
|---|---|---|---|
| **css2x** — sheet served concatenated with itself (+93,735 B, +100 % rules) | 299.2 | 298.7 | **−0.5 ms** |
| **jspad** — ~102,000 chars of never-called top-level functions appended to the entry chunk | 294.3 | 300.0 | **+5.7 ms** (≤ ±10 ms spread) |
| **noworkerpreload** — `solver.worker` modulepreload hint stripped | 295.9 | 302.9 | **+7.0 ms** (≤ spread) |
| **nopreload, webkit** — the three font preload hints stripped | 237.0 | **158.0** | **−79.0 ms**, −18.9 KB |
| **nopreload, chromium 4×** — same strip | 333.5 | 357.0 | **+23.5 ms** |
| **fontabort, webkit** — every woff2 aborted (corroborates the row above) | 234.0 | 157.0 | −77.0 ms |
| **css2x under Fast-3G** | 1376.8 | 1291.3 | −85.5 ms |

Readings: doubling ALL the CSS costs nothing at board-ready, so the 48.4 KB the lane calls unused is not
a readiness ms on this link. The parse/compile upper bound on removing the gallery + technique + session
freight is ≈6 ms of 313 (≈2 %), not separable from noise. Moving the worker preload off the boot burst
does not buy readiness. In WebKit the font preloads cost **79 ms** of board-ready and buy nothing; in
chromium the same three hints earn 23.5 ms — so any cure there must be engine-aware. The Fast-3G css2x
row is NOT amplification: `route.fulfill` bypasses CDP throttling, so the ablated arm is really "sheet
off the throttled link", and it prices the whole sheet's transfer at ≈85 ms on Fast-3G — the one regime
where a critical-CSS split can pay.

## 4. THE LAW (M09)

No lane-A2 candidate drops a bake, thins a boil, removes a filter, shortens a transition, moves a golden
or touches filterBudget 9. Nothing is refused by the quality law; three fail on fact — see the return.

`summarize-readings.mjs` prints webkit TBT as `0.0`, not `NOT MEASURED`. The lane's prose is honest about
this; the instrument is not, and a reader of the JSONL alone would read a clean boot.

Instruments: `xablate.mjs` (five read-only ablations), `xentry-coverage.mjs` (sourcemap-free entry
coverage). Raws: `readings.jsonl`, `evidence.txt`.
