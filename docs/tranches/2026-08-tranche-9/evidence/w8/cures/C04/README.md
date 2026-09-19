# T9-W8 §8.2 — C04, SINGLE-FLIGHT THE WASM: **NOT LANDED**

2026-09-17 · track `wasm` · worktree `.claude/worktrees/w8-wasm`, branch `w8/wasm` ·
preSha `7b0610cc4256332f0069d76cf4a20020995ef728` · **no commit; the branch was left at preSha.**

The cure was written, it works, every gate is green — and **the number it had to move did not
move**. Row 5's "593 ms removable" is an artifact of the counterfactual that priced it. The
mechanism (2 wasm GETs → 1) moved 13/13 windows across both engines; the milliseconds moved
−15.2 (gap) and +0.6 (time-to-givens) against a ≥100 ms spread. By the wave's own rule — a cure
whose number doesn't move doesn't land — it is reported, not landed.

## 1 — The arms

    BASE   AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB
    CURED  AUDIT: build-identity — dist entry index-CQVyu1rBXYzS.js · index.html md5 f25d2d461f08aab64493c8229cfeeb31 · 43 files / 807.4 KB

Printed at both ends of every reading set, unmoved; the served pages were asserted against
both hashes at both ends (`http://127.0.0.1:4254` base, `:4255` cured, `vite preview
--strictPort` from the worktree's `web/frontend`). `dist-base` is the chair's frozen copy and
was verified byte-identical to the 8.1 line before the first edit.

Host darwin 25.4.0, up to ten sibling lanes live. `sysctl -n vm.loadavg`:
13.44 at the first build · 11.82 → 19.89 across headline set 1 · 6.29 → 12.61 across headline
set 2 · 6.61 → 6.84 across the 1× and unthrottled sets · 5.50 at the close.

## 2 — The numbers

Every row: **chromium · CDP CPU rate · CDP link · true first visit (fresh context, HTTP cache
enabled but empty, one navigation) · 1280×800 · deviceScaleFactor 1**, unless the row says
WebKit (Playwright WebKit, no CDP: no rate, no link, unthrottled localhost; a WebKit number is
not a Safari number and no row here is an iOS claim). Windows INTERLEAVED b,c,b,c inside one
browser. Medians; no window dropped.

| mark | regime | base | cured | Δ | windows |
|---|---|---|---|---|---|
| **`tGivens` − `tCells`** (B5's gap) | 4× · Fast-3G | **1,712.0** | **1,696.8** | **−15.2** | 10 / 10 |
| **`tGivens`** (B5) | 4× · Fast-3G | **3,051.9** | **3,052.5** | **+0.6** | 10 / 10 |
| `boardReady` | 4× · Fast-3G | 1,405.3 | 1,415.6 | +10.3 | 10 / 10 |
| **cold wasm GETs** | 4× · Fast-3G | **2** | **1** | **−1** | 10 / 10 |
| `tGivens` − `tCells` | 1× · Fast-3G | 1,304.5 | 1,296.8 | −7.7 | 3 / 3 |
| `tGivens` | 1× · Fast-3G | 2,478.0 | 2,469.8 | −8.2 | 3 / 3 |
| `tGivens` − `tCells` | 4× · unthrottled | 775.3 | 763.1 | −12.2 | 3 / 3 |
| `tGivens` | 4× · unthrottled | 1,021.5 | 983.0 | −38.5 | 3 / 3 |
| cold wasm GETs | WebKit · cold | 2 | 1 | −1 | 3 / 3 |
| `tGivens` | WebKit · cold | 379.0 | 396.0 | +17.0 | 3 / 3 |
| `tGivens` warm | 4× · Fast-3G · warm | 466.0 | 471.3 | +5.3 | 3 / 3 |
| warm wasm GETs | 4× · Fast-3G · warm | 1 | 1 | 0 | 3 / 3 |

The 4× Fast-3G spread within an arm is ~100 ms across the clean windows (base
1,661.9–1,759.3, cured 1,678.6–1,815.7) and 970 ms across all ten (two windows per arm ran
under a load spike to 19.89 and are in the medians, not excluded). **−15.2 ms is inside the
spread.** Ten sibling agents measure on this host; a delta this size is not a move.

Raw: `raw/head-4x-fast3g.jsonl` (20 windows), `raw/head-1x-fast3g.jsonl`,
`raw/head-4x-none.jsonl`, `raw/webkit-cold.jsonl`, `raw/warm-base.jsonl`,
`raw/warm-cured.jsonl`, `raw/when-4x-fast3g.jsonl`, `raw/wire-4x-fast3g.jsonl`.

## 3 — Why it doesn't move: the second GET was already free

`refute/A3/R3-wasm-single-flight.mjs` prices the duplicate flight by fetching the same URL
twice with `cache: "no-store"` — one fetch 744.6 ms, two concurrent 1,338.0, removable 593.
`no-store` is exactly the directive that forbids the HTTP cache from joining the second
request to the first. **The page does not use it.** Both workers GET the same cacheable
`/assets/csp_solver_wasm_bg-*.wasm`, the second lands ~35 ms into the first's flight, and
Chromium joins it: one transfer, billed once.

Read off the page, `request.sizes()` on the context's `requestfinished` (`raw/wire-4x-fast3g.jsonl`):

| arm | wasm entries | response bodies | wire (bodies + headers) |
|---|---|---|---|
| base | 2 | **0 B**, 123,336 B | 123,739 B |
| cured | 1 | 123,336 B | 123,612 B |

**127 B.** That is the whole wire cost of the duplicate, and the two arms' flight WINDOWS agree
to the millisecond (`raw/when-4x-fast3g.jsonl`: first wasm request → last wasm finish, base
872 / 869 / 872 ms, cured 860 / 873 / 873 ms). On the lane's own banked probe the base's
second entry and the cured's only entry are the same reading — `reqStart` 0.1–0.2,
`respStart` 161–166, `respEnd` 871–881 — and both arms finish the flight at wall 3,010 ms.
The base's FIRST entry is the join: `reqStart` 473–492, `respStart` 629–656, zero bytes.

So row 5's mechanism is confirmed (two fetches, two compiles, 2/2 windows, both engines) and
its **price is refuted**: the removable share on this tree is 127 B of headers and one wasm
compile on a worker thread, not 593 ms. The 1,714 ms of blank board is the flight's START
(~2,100 ms wall, behind the bake burst) plus its ~870 ms body — C01/C03's ground, not C04's.
Nothing here licenses moving the fetch earlier: the charter refuses a boot-burst preload on a
guess, and this lane measured no ms to win by removing a request that costs none.

## 4 — What the cure was, and that it is sound

`C04-not-landed.patch` (28,061 B, `git diff` at the reading set's close) is the whole change,
kept so the chair can re-land it without rework if it re-charters C04 as a bytes-and-compile
cure rather than a milliseconds one.

- `protocol.ts` — two frames beside the request wire: `WasmHandoff` (main → worker: the
  compiled module, or which side of the flight this worker is on) and `WasmModuleOffer`
  (worker → main), with their guards. No `id`, so they correlate to nothing.
- `solver.worker.ts` — `ensureInit` splits compile from instantiate: the owner does
  `WebAssembly.compileStreaming(fetch(wasmUrl))` and offers the module back; a worker told to
  wait awaits the module and instantiates it; a worker handed one instantiates it. The
  library's own fetch path stays as the fallback (a mislabelled MIME, an engine without
  `compileStreaming`, an engine that will not clone a module).
- `transport.ts` — the broker, scoped to the transport because the workers are: it says who
  owns the flight at mint, keeps the offered module, hands it to every worker minted
  afterwards, and passes the flight on if the owner dies before offering anything.

Held: two workers, two instances, `solverSpine.workers` 2, the leash and its supersede (the
re-minted deal worker is handed the module — it re-mints without refetching, which is the W4
contract kept and strengthened). Four new units pin the flight, the handoff, the offer-is-not-a-
response rule and the owner's death. Cost: entry chunk +406 B, page wire 188,822 → 189,228 B.

**Gates, run bare in the worktree** — `test:unit` 66 files / 814 tests, exit 0 · `lint:eslint`
0 · `lint` 0 · `lint:knip` 0 · `lint:boundary` 0 · `lint:tdz` 0 · `lint:copy` 0 ·
`lint:live-regions` 0 · `lint:motion` 0 · `typecheck:e2e` 0 · `typecheck:node` 0.
**π NOT RUN**: the cure draws no pixel and the tree was reset, so no golden claim is made here.
No user-readable string changed, so M16 has nothing to read.

## 5 — For the chair

1. **ATTRIBUTION row 5's "593 removable" should be struck or restated.** The mechanism stands;
   the price is 127 B and one compile. The refuter's `cache: "no-store"` is the whole gap
   between 593 and 0.
2. **B5's 1,714 ms gap is unexplained by this row.** What remains of it is the flight's start
   at ~2,100 ms (behind the bake burst) and ~870 ms of body on a 1.6 Mbps link. C01 and C03 own
   the first; C09/C10 own the second.
3. **If the request census is wanted anyway** — one fewer origin connection, one fewer compile,
   a deal re-mint that never refetches — the patch is here, green, and costs 406 B. That is a
   decision about bytes and connections, not about milliseconds, and it needs a charter that
   says so.
4. **The device may disagree** and only the device can. Safari's cache may not join the second
   GET the way Chromium does, and a cellular link would then pay for it twice. 8.3 can settle
   it with the request census alone — timing-free, load-proof, two lines of
   `getEntriesByType('resource')`.

## 6 — The instruments

`instrument/` — `C04-interleave.mjs` (the acceptance probe: `A3-truecold-probe.mjs`'s init and
marks, byte-identical, plus `A3-wasm-probe.mjs`'s request census, pointed at two ports and
interleaved; the header states every change), `C04-wasm-when.mjs` (the same census with
request/finish wall offsets, to place the flights against `tGivens`), `C04-wire.mjs` (the wire
bytes off `request.sizes()` — worker requests are invisible to the page's resource timeline),
`C04-wasm-bytes.mjs` (the page-level census; it is what PROVED the wasm is invisible there —
29 requests and 188,822 B page-side in both arms), `A3-wasm-probe.mjs` (the banked lane
instrument, verbatim but for the `createRequire` path, run once per arm for the warm rows),
`fold.mjs` (medians; drops nothing).

Both preview servers were killed at the close. The worktree was reset to `7b0610cc` and the
cured `dist` removed; `dist-base` is untouched for the next cure on this track.
