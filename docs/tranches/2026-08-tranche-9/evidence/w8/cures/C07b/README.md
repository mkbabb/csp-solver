# C07b — the bake's face is acquired after first paint, and what the charter's other half runs into

2026-09-18 · track `bake` · worktree `.claude/worktrees/w8-bake`, branch `w8/bake` ·
preSha `66e34b23` · commit `e694cc8c` · charter `../charters/C07.md` (second half) ·
law and acceptance `../charters/README.md`.

**Verdict, in two parts.**

1. **LANDED.** `bakeFace()` no longer runs inside the first-paint window. The request, the
   base64 pass and C01's ink gate all move behind `document.fonts.ready` plus an idle slot.
   Boot TBT at chromium 4× on a true first visit goes **151.5 ms → 134.0 ms, disjoint in 10
   of 10 interleaved windows**, and the fourth woff2 GET leaves the pre-board-ready window in
   every window of every regime read — which on a cache-disabled arm is **14,936 B off the
   boot wire** on both engines. π holds: every surface's shown stack is byte-identical, pose
   for pose, in both engines, and the four goldens pass.
2. **REFUTED, with the mechanism named.** The charter's "no second network request for the
   face on any engine" is **not reachable from this file**, and the B6 gate line "fraunces ≤ 2
   until C07's bake half lands" cannot go to 1 by any scheduling or request-shaping cure.
   WebKit keys the entry on the request's DESTINATION: a `font` request cannot be handed to a
   `fetch`, and no web API asks for BYTES with a font destination. Four request shapes ×
   two timings × two engines were measured against a server answering exactly as the edge
   answers, counted AT THE SERVER. Every WebKit arm reads a fourth GET of 14,936 B. §3.

## 1. Identity and load, both ends

    dist-base (the branch as found, built at 66e34b23)
      AUDIT: build-identity — dist entry index-LjRNU9f7iIUb.js · index.html md5
      b4865f796519e83934879968e3fbd4f0 · 43 files / 811.3 KB      (open and close, unmoved)
    dist (the cure, built at e694cc8c)
      AUDIT: build-identity — dist entry index-DT3aGxCK2_YJ.js · index.html md5
      71db526c330253b274d0895282c9134e · 43 files / 811.6 KB      (open and close, unmoved)

`sysctl -n vm.loadavg`, per reading set, is printed inside each `raw/*.jsonl` as
`LOADAVG-OPEN` / `LOADAVG-CLOSE`; the session ran between 4.50 and 29.69 with up to ten
sibling lanes live. Servers: `vite preview --outDir dist-base --port 4252` and
`--outDir dist --port 4253` from the worktree's `web/frontend`; plus, for §3 only, two
copies of C07a's `lab/edge-serve.mjs` on 4256 / 4257, which answer with the live edge's
headers (`access-control-allow-origin: *`, `/assets/*` immutable, **no `Vary`**) because
`vite preview` sends `Vary: Origin` and the edge does not — C07a's finding, and the reason a
`vite preview` WebKit census reads 7 GETs where the edge reads 4.

**Every millisecond here is a proxy** on a contended darwin host. Playwright WebKit is not
Safari and none of this is an iOS claim; 8.3 closes B6 on the device.

## 2. The seam

`src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:117-167` — `bakeFace()` now resolves
`afterFirstPaint()` before `loadBakeFace()`. `afterFirstPaint()` waits on
`document.fonts.ready` and then one `requestIdleCallback` slot with a 1,000 ms timeout
(a 200 ms timer where `requestIdleCallback` does not exist). Nothing else moved:
`loadBakeFace`, its chunked base64, its fallback contract and C01's `warmBakeFace` ink gate
are untouched, and `index.html`'s hints, the `@font-face` block in `src/assets/index.css` and
the three subsets were never opened (they are C07a's half, in another track).

**App-side, not library.** Nothing in `@mkbabb/pencil-boil` decides when the app asks for the
face; the app does, in this file, in one expression.

**The order is the mechanism, not a delay for its own sake.** The page's own `@font-face`
load is what puts the subset in the HTTP cache, so asking after `fonts.ready` is asking for
bytes the page already holds — which is what the charter's sentence wanted and what chromium
now does with no server hit at all (§3).

**What it costs.** The wordmark's baked stack mounts later: first encode `t0` moves
84–343 ms → 343–375 ms (chromium 1×, 3 windows) and 179–199 ms → 505–546 ms (WebKit,
3 windows). During that window the wordmark is its pose-0 LIVE filter, which paints the
page's own loaded Fraunces — the same face, not a fallback face, and the FOUT window itself
is untouched (the `link` and `css` woff2 loads start at the same 172–186 ms in both arms).
The charter's "must not" is about a fallback FACE, and no fallback face paints for one
millisecond longer.

## 3. The half that is not reachable from this file (the count)

Counted at the SERVER, one fresh server per run, log at `raw/hits-*.log`, against
`edge-serve.mjs` — so a cache hit and a network GET can be told apart, which the driver's
request stream cannot do:

Both runs boot the **same frozen `dist-base`**; what differs is the shape of this one `fetch`,
applied by the lab's monkeypatch, so the count is attributed to the shape and to nothing else.

| engine | shape | server GETs for woff2 | the bake's own GET |
|---|---|---|---|
| chromium | v0, as built | **3** (the three preloads) | never reaches the server |
| chromium | v2 / v6 / v8 | **3** | never reaches the server |
| webkit | v0, as built | **4** | a full 14,936 B, and it sends `origin: -` where the preload sends the page origin |
| webkit | v2 / v6 / v8 | **4** | a full 14,936 B |

The same split shows in the product's own two arms, on the banked census
(`raw/census-both-arms.txt`): against the edge-faithful server the bake's fetch reads
`transferSize` 0 in chromium and 14,936 B in WebKit, in **both** `dist-base` and the cured
`dist` — only its start time moves (19 → 74 ms chromium, 38 → 304 ms WebKit).

`instrument/fetch-shape-lab.mjs` monkeypatches only this one `fetch`'s options, before any
app code runs, so every arm boots the same frozen dist. WebKit, 2 reps each, on the
edge-faithful server (`raw/fetch-shape-lab-webkit.txt`):

| variant | shape | bake transferSize |
|---|---|---|
| v0 | `{credentials:'omit'}` — the product as built | 14,936 |
| v1 | no options | 14,936 |
| v2 | `{credentials:'omit',cache:'force-cache'}` | 14,936 |
| v3 | `{cache:'force-cache'}` | 14,936 |
| v4 | `{mode:'same-origin'}` | 14,936 |
| v5 | as built, awaited on `document.fonts.ready` | 14,936 |
| v6 | force-cache, awaited on `fonts.ready` | 14,936 |
| v7 | same-origin + force-cache, awaited on `fonts.ready` | 14,936 |
| v8 | same-origin, awaited on `fonts.ready` | 14,936 |

The header dump says why: WebKit's preload and `@font-face` both carry
`sec-fetch-dest: font`; this `fetch` carries none, and the two do not share an entry however
the credentials, mode, cache mode or timing are set. C07a found the mirror image of the same
fact from the other side (chromium puts a same-origin font load in CORS mode and WebKit does
not). The only ways left to one request are (a) load the page's Fraunces from JS out of the
same bytes, which crosses into C07a's half and puts the page's own face behind the module
graph, or (b) ship the base64 in a chunk, which is the 16,038 B of render-blocking freight
T7-W6 removed. Neither is C07b's, and the second is worse than the defect.

**So B6's gate line should be restated, not chased**: max GETs per subset is 1 for fira and
patrick and **2 for fraunces on WebKit, 1 on chromium**, against an edge-faithful server —
and the second is a property of WebKit's cache keying, not of the bake's schedule.

## 4. The numbers

Instrument: `instrument/boot-freight.mjs`, the banked A2 instrument **copied verbatim**; only
`--port` differs between arms. `instrument/interleave.sh` calls it one window at a time,
b,c,b,c,…, so host drift cancels; `instrument/stats.py` reads the medians and the ranges and
names every excluded window (none were excluded in any set below). "disjoint" means the two
arms' full ranges do not overlap.

### 4a. chromium · 4× · Fast-3G · **true first visit** (cache ENABLED, a fresh context) · desk 1280×800 dpr 1 · 10 + 10 windows

`raw/c-4x-fast3g-firstvisit{,-set2,-pooled}.jsonl`, load 4.50 → 10.31.

| mark | base | cured | Δ | disjoint |
|---|---|---|---|---|
| **TBT** (Σ longtask − 50) | **151.5 ms** (144–166) | **134.0 ms** (132–141) | **−17.5 ms** | **yes** |
| board-ready | 1,390.6 ms (1,377.8–1,417.7) | 1,368.6 ms (1,366.3–1,388.4) | −22.0 ms | no — NOT A MOVE |
| woff2 GETs started before board-ready | 4.0 | 3.0 | −1 | yes, 10/10 |
| woff2 wire bytes before board-ready | 23,772 B | 23,472 B | −300 B | yes, 10/10 |

The 300 B is chromium's accounting for a memory-cache hit; the request is free on the wire
and was never the point. The point is the 4th row's other half: in base the bake's
acquisition fires at **1,172–1,187 ms, ~200 ms BEFORE board-ready, in 10 of 10 windows**; in
cured it is not in the boot window at all, in 10 of 10.

### 4b. chromium · 4× · unthrottled · **cache disabled** · desk dpr 1 · 5 + 5 windows

`raw/c-4x-cold.jsonl`, load 4.61 → 13.97 (rising — a sibling lane started mid-set, which is
why the two ms rows below are reported as NOT MOVES).

| mark | base | cured | Δ | disjoint |
|---|---|---|---|---|
| **woff2 wire bytes before board-ready** | **38,408 B** | **23,472 B** | **−14,936 B** | **yes, 5/5** |
| woff2 GETs before board-ready | 4.0 | 3.0 | −1 | yes, 5/5 |
| board-ready | 301.0 ms (289.9–303.9) | 282.0 ms (279.3–315.5) | −19.0 ms | no — NOT A MOVE |
| TBT | 156.0 ms (147–159) | 138.0 ms (136–171) | −18.0 ms | no at this load |

### 4c. webkit · unthrottled, **no CDP** · cold · desk dpr 1 · 5 + 5 windows

`raw/w-cold.jsonl`, load 13.97 → 13.65. Served by `vite preview`, so the census reads 7 GETs
(C07a: `Vary: Origin`, a preview artifact); the arms differ by exactly the bake's own.

| mark | base | cured | Δ | disjoint |
|---|---|---|---|---|
| **woff2 wire bytes before board-ready** | **61,880 B** | **46,944 B** | **−14,936 B** | **yes, 5/5** |
| woff2 GETs before board-ready | 7.0 | 6.0 | −1 | yes, 5/5 |
| board-ready | 172.0 ms (171–191) | 175.0 ms (170–183) | +3.0 ms | no — NOT A MOVE |
| TBT / busy / per-stage | **NOT MEASURED** — no CDP, no `longtask` in Playwright WebKit | | | |

WebKit board-ready was never expected to move and did not: C07a measured the whole cost of
every font load on that mark at 21 ms, and this cure moves one cached-or-not GET out of a
window the mark does not wait on. **A WebKit number is not a Safari number.**

## 5. π and the gates

- **Per-pose hashes, both engines, 3 + 3 windows** (`pi-c1x-desk.txt`, `pi-w-desk.txt`, on
  C01's banked `pose-hash.mjs` + `pi-compare.mjs`): *π: HOLDS — every surface's shown stack is
  byte-identical, pose for pose, to the round the estate keeps today.* The wordmark's four
  digests are equal arm to arm in every window on both engines; grid, sun and moon likewise.
- **Encode counts equal arm to arm**, surface for surface, in both engines: nothing was
  dropped and nothing was added. Pose count 4.
- **Goldens 4/4, exit 0**, against the cured dist on :4253, no `--update-snapshots` — the
  wordmark golden among them.
- **`filterBudget` untouched** (no file under `src/pencil/config/` was opened);
  `filter-census.spec.ts` green in both engines against the cured dist.
- **`npm run test:font-coverage` exit 0** — the same three subsets ship, letter-exact.
- `test:unit` **exit 0 — Test Files 66 passed (66), Tests 810 passed (810)**.
- `lint`, `lint:eslint`, `lint:knip`, `lint:boundary`, `lint:tdz`, `lint:copy`,
  `lint:live-regions`, `lint:motion`, `typecheck:node`, `typecheck:e2e` — **all exit 0**.
- **Surface battery, both engines, against the cured dist** through the scratch config
  `instrument/playwright-c07b.config.ts` (C01's, with the six-spec `testIgnore` dropped so the
  bundled-preview specs can be selected by name): `font-census`, `wordmark-integrity`,
  `filter-census`, `theme-bake-freshness`, `theme-quadrants`, `masthead-alignment` —
  **88 passed, exit 0**; `throttled-void` chromium (it opens a CDP session, so it is
  chromium's by construction) — **1 passed, exit 0**.
- **Whole default suite**, both engines, cured dist: **469 passed, 4 skipped, 3 failed** —
  `presence.spec.ts:177` in both engines and `multiplayer.spec.ts:265` in WebKit. The same
  specs red **on dist-base** at the same moment (4 failed there, a superset): they want the
  relay Worker, which is not running in this session. A host fact, proven on the base arm, not
  this cure's.

## 6. The must-nots, answered one by one

| must not | reading |
|---|---|
| drop or narrow a subset | `src/assets/index.css` never opened; `test:font-coverage` exit 0 |
| delete the data-URI bake | the bake runs, later; per-pose digests equal |
| let the wordmark paint a **fallback face** longer than today | the FOUT window is the `@font-face` load's and is unmoved (`link`/`css` starts 172–186 ms in both arms). What is later is BITMAPS-instead-of-live-filter, ~330 ms, and the live filter paints the page's own Fraunces |
| no bake dropped, no boil thinned, no filter removed, no transition shortened | encode counts equal per surface per engine; `filter-census` green; no config or motion file opened |
| a golden may not move | 4/4 pass, no `--update-snapshots` |

## 7. What the chair owes

1. **Restate B6's gate line.** "fraunces ≤ 2 until C07's bake half lands" implies 1 afterwards.
   1 is not reachable while the bake needs BYTES and WebKit hands a `fetch` no font-destination
   entry. The honest gate is **≤ 1 per subset, fraunces ≤ 2 on WebKit**, against an
   edge-faithful server — met today on both engines by C07a's server finding.
2. **ATTRIBUTION row 10** ("`bakeFace()` re-fetches Fraunces", CONFIRMED) stands as a fact and
   its cure is now priced: the request cannot be removed, only moved. Row 6's `C07` cure
   pointer should read C07a for the count and C07b for the schedule.
3. **No doc-truth row, no SPEC_MANIFEST entry, no README count, no library publish** is owed:
   one app-side file changed, no README number moved, no public surface changed, and
   `@mkbabb/pencil-boil` was not opened.
4. **The floors.** Boot TBT is inside GATE D's own subject; the restamp is 8.3's per the
   attribution's §5, not this cure's.

## 8. Held for the device (8.3)

- **B6's count on real Safari against the real edge.** Everything here says Safari should read
  4 GETs (three preloads consumed, plus the bake's). Playwright WebKit is not Safari and
  `vite preview` is not the CF edge.
- **Whether Safari, like Playwright WebKit, refuses to hand the `fetch` the font entry.** If it
  does not, fraunces reads 1 on the device with no further code, and §3's refutation is
  proxy-only.
- **Whether the 17.5 ms of TBT is worth the ~330 ms later bitmap mount on a real phone.** The
  proxy says the trade is free (board-ready unmoved, goldens unmoved); the owner's eye on the
  wordmark decides it.

## 9. Files

    instrument/boot-freight.mjs             the banked A2 instrument, copied verbatim
    instrument/webkit-font-confirm.mjs      the banked A2 census, copied verbatim
    instrument/interleave.sh                one window at a time, b,c,b,c, into raw/<tag>.jsonl
    instrument/stats.py                     medians, ranges, disjointness, excluded windows
    instrument/fetch-shape-lab.mjs          nine shapes/timings of the bake's own fetch, §3
    instrument/edge-serve.mjs               C07a's lab server, plus a woff2 hit log
    instrument/pose-hash.mjs, pi-compare.mjs   C01's banked π instruments, copied verbatim
    instrument/playwright-c07b.config.ts    C01's scratch config with the six-spec ignore dropped
    pi-c1x-desk.txt, pi-w-desk.txt          the π verdicts
    raw/                                    every window, every arm, plus the server hit logs
