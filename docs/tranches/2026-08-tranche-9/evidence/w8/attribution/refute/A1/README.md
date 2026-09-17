# T9-W8 §8.1 · ADVERSARIAL REFUTATION of lane A1 (THE BAKE PIPELINE AT FIRST PAINT)

Refuter did not write lane A1. Attribution only; nothing under `src/` touched, no build run.
Port 4255 (`vite preview --outDir dist --strictPort --host 127.0.0.1`), killed at the end.
Dist FIXED: `dist-identity-{before,after}.txt` both read the chair's line
`index-9rZPzI5DEcpe.js · md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB`,
served-vs-disk asserted on :4255 at both ends. **The dist did not move; no reading is void.**

## Re-runs

| file | what |
| --- | --- |
| `raw/re-c-4x-fast3g-cold-desk.jsonl` | A1's `bake-census.mjs`, verbatim, chromium 4×/Fast-3G/cold/desk, 3 windows, load { 3.72 … } |
| `raw/lowload-c-4x-fast3g-cold-desk.jsonl` | the same at the quietest load reached, { 3.33 4.39 5.40 } — **lens 2** |
| `raw/re-w-1x-none-cold-desk.jsonl` | A1's instrument, webkit cold desk, unthrottled (no CDP), 3 windows |
| `raw/cp-w-cold-desk.jsonl` | **my** probe `cp-probe.mjs`, webkit cold desk — **lens 3** |
| `re-bake-table.md`, `re-double-bake-proof.txt` | A1's `summarize.mjs` / `double-bake-proof.mjs` over my raws |
| `retakes.jsonl` | one compact line per window: engine/throttle/net/cache/vp, load, taint, board-ready, per-surface sync-encode ms, longtask count/summed/TBT |

All nine windows taint 0 (no blur, no visibilitychange). A1's instruments ran as banked, first try.

## Lens 1 — REPRODUCE (chromium 4×/Fast-3G/cold/desk, median of 3)

| quantity | A1 | refuter (load 3.72) | refuter (load 3.33) |
| --- | --- | --- | --- |
| board-ready | 1387.1 | 1384.8 | 1416.3 |
| grid sync-encode ms (8 encodes) | 1672.3 | 1765.8 | 1710.7 |
| toggle-sun + toggle-moon | 150.0 + 151.2 | 160.7 + 158.8 | 156.5 + 153.5 |
| logo | 77.7 | 79.2 | 78.8 |
| toggle #1 blocking | 905.5 | 942.4 | 930.6 |
| toggle #2 blocking | 0 | 0 | 0 |
| grid discarded round | 799.4–850.3 | 848.2–887.7 | — |

webkit cold desk: board-ready 451 → **441**; grid 508 → **513**; discarded 1240 px round
259–288 ms → **258–289 ms**; `bytes identical: false`, `1240px→1272px`, 3/3 windows.

## Lens 2 — HOST vs BUNDLE

Nothing halves at low load. A1 read at load 5.34–7.74; I read at 3.33–4.90 and every number
came back **equal or larger**. These are bundle facts, not host facts. No finding is adjusted
downward for contention.

## Lens 3 — THE CRITICAL PATH (`cp-probe.mjs`)

A1 stamps board-ready inside a rAF, so "board-ready 441" is ambiguous between *the board was
not ready* and *the board was ready and the encode starved the stamp*. `cp-probe.mjs` records
the full condition state at **every** rAF tick. On webkit cold desk, 3/3 windows:

```
w1 firstTrue=125  boardReady=412   w2 firstTrue=118  boardReady=401   w3 firstTrue=115  boardReady=397
tick t=118  vis=true bgW=1028.3 cellW=4.4 nCells=337 cond=TRUE
tick t=401  Δ283ms                                    <- one starved rAF, no tick between
toBlob 1240px [142→399] [234→399] [288→399] [343→399]  <- all four land 2 ms before the stamp
```

**The board-ready condition holds at 115–125 ms. The stamp lands at 397–412 ms.** The four
discarded-round encodes occupy the whole interval and the poll's rAF cannot run inside them.
So deferring that round moves the readiness mark by ~282 ms: `onCriticalPath: true` **stands**
— by main-thread contention, which the charter names as a qualifying mechanism.

**But the qualification A1 does not state:** layout is *not* delayed. `.board-group` is visible
with 337 `.cell` children at 118 ms and FCP is 143 ms. What the encode delays is the stamp,
the paint after 143 ms, and interactivity — not the board's arrival.

On chromium the ordering is inverted and A1 says so honestly: grid `poseSvg` at 1395.5 vs
board-ready 1384.8, i.e. **10.7 ms after**. No bake starts before board-ready in any chromium
regime. `onCriticalPath: false` is correct there.

## What did not survive

1. **"the grid bake is ~96% of TBT"** — unit mismatch. 1399 ms is the grid's *summed longtask*
   ms; 1455 ms is TBT (Σ dur−50). The grid's own TBT share is 1399 − 50×6.7 = **1064 ms, 73% of
   TBT**. Mine: 1546 − 350 = 1196 / 1555 = 77%; low-load 1592 − 365 = 1227 / 1539 = 80%.
   The grid is still the dominant blocking surface. It is not 96%.
2. **finding #1 and finding #2 double-count.** grid = 8 encodes = *both* rounds, so the
   1672.3 ms already contains the 799.4 ms discard. Grid's kept round alone ≈ **834 ms**.
3. **799.4 ms is the grid's discard alone, not the three-surface discard** the note describes
   ("grid + toggle-sun + toggle-moon = 1,246,892 B and 799.4–850.3 ms"). From A1's own banked
   windows the whole discard is 948.0 / 1001.0 / 992.8 → median **992.8 ms**; mine 1005.9 /
   1034.3 / 1047.5 → median **1034.3 ms**. Understated by ~24%.
4. **the logo is not blocked behind the font fetch.** `fetch:end` for
   `fraunces-subset-qp6ShjBRhfYB.woff2` is 1384.3 ms and `fonts.ready` 1414.6 ms, both **before
   the first encode of any surface** (toggle-sun `toBlob:start` 1457.8). The logo's first
   `poseSvg` is 2654.6 ms — 1,270 ms later, arriving in the queue only after the grid's four
   1272 px encodes finish at 2538.4. The gate is main-thread queue position behind the grid and
   the celestials, not the fetch. The 77.7 ms number itself reproduces at 79.2.

## What verified at the source

`node_modules/@mkbabb/pencil-boil/dist/vue.js` (0.12.0) line 603:
`void fontsReady.then(() => { clearStacks(); return bake(); });` — verbatim as cited.
`DEFAULT_POSE_CACHE = 4` confirmed. Mechanism 1 is real.

Corroboration A1's prose misses: the warm arm runs **20** encodes, not 28 (celestials single
round, bytes 2,262,095 vs 2,580,978). So README §5's "the encode work is unchanged (1,888 ms
warm vs 2,051 ms cold)" is wrong — warm escapes 8 encodes because the cached font resolves
`fonts.ready` before the celestials register. That *strengthens* mechanism 1.

## The Quality Law (M09)

No cure lands here. Candidates a reader would draw from these findings, adjudicated:
lawful (mechanism) — gate `clearStacks()` on stacks that actually contain `<text>`; debounce the
first grid bake until the capture box settles; defer the not-yet-shown celestial; pre-warm the
dark stacks at idle. REFUSED (draws less) — shrink captureSide/DPR, thin the 4-pose stacks,
cut `DEFAULT_POSE_CACHE`, make the grid cacheKey theme-independent, drop a celestial.
π identity and filterBudget 9 bind every one of them.

**WebKit here is Playwright WebKit. It is not Safari and it is not an iOS number.**

## Byte cap (refuter share ≤ 30 KiB)

`raw/cp-w-cold-desk.jsonl.gz` is kept because `cp-probe.mjs` is this refutation's own novel
instrument and its per-tick log is the decisive lens-3 evidence. The three A1-instrument raws
(`re-c-…`, `lowload-c-…`, `re-w-…`) were deleted to fit the cap: every number they carry is
banked in `retakes.jsonl` (per-window, with load + taint), `re-bake-table.md` and
`re-double-bake-proof.txt`, and all three regenerate in ~90 s each with A1's banked instrument:

```
cd web/frontend
npx vite preview --outDir dist --port 4255 --strictPort --host 127.0.0.1 &
node <A1>/bake-census.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp desk \
  --port 4255 --windows 3 --out raw/re-c-4x-fast3g-cold-desk.jsonl
node <A1>/bake-census.mjs --engine webkit --cache cold --vp desk \
  --port 4255 --windows 3 --out raw/re-w-1x-none-cold-desk.jsonl
node <refute/A1>/cp-probe.mjs --engine webkit --port 4255 --windows 3 --out raw/cp-w-cold-desk.jsonl
```
