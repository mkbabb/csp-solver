# T9-W8 C11 — NON-AUTHOR VERIFICATION, ROUND 1 · VERDICT: **ACCEPT**

Track `bake`, worktree `.claude/worktrees/w8-bake`, branch `w8/bake` at `7c6c5bea`
(preSha `e694cc8c`). I did not write this cure. Ports: base 4252 (`dist-base`), cured 4253
(`dist`). Servers killed at the end; the worktree is as I found it (`git status` empty, the
scratch `dist-verify` removed).

    base   AUDIT: build-identity — dist entry index-DT3aGxCK2_YJ.js · index.html md5 71db526c330253b274d0895282c9134e · 43 files / 811.6 KB
    cured  AUDIT: build-identity — dist entry index-B0401ox6qFDa.js · index.html md5 5e94cf595194ab26c719dc00b59bf078 · 43 files / 816.4 KB

Both printed at the start and the end of the work; both match the author's return.

**The arms are what they claim.** `dist-base` carries no `indexedDB` and no `pencil-bake`
string; `dist` carries both, in the entry chunk. And the cured arm is provably the committed
HEAD: `npx vite build --outDir dist-verify` at `7c6c5bea` re-emitted entry
`index-B0401ox6qFDa.js` and `diff -r dist dist-verify` exited **0** — byte for byte the tree
that was served for every number below.

## 1. THE DIFF — the mechanism is memoization, which the law names

Three files, +516/−5: one new `src/pencil/composables/bakeStore.ts` (505 lines) and three
call-site swaps (`HandDrawnGrid.vue:258`, `DarkModeToggle.vue:571,579`). No library change;
`filterBudget.ts` is not in the diff (last touched at `060792a2`, T7).

Nothing draws less. No bake is dropped (a miss is today's bake, one read later), no boil is
thinned, no filter is removed, no transition is shortened, no DPR is lowered, and the `cacheKey`
is not theme-stripped — the theme token is still the library's, and it is *inside* the store
key, which I read off a live store: `index-B0401ox6qFDa.js|1wwtsnt|grid-9-3-l|3|364x364|4`.
Checked by name against the REFUSED and REFUTED lists in `charters/README.md`: none of them.

The wordmark is deliberately not stored. Its stack still bakes every load.

## 2. THE NUMBERS, RE-RUN BY ME

Every set interleaved b,c,b,c…, 5 windows per arm, 0 tainted of 10, medians with ranges,
`sysctl -n vm.loadavg` at both ends, both engines named with viewport AND deviceScaleFactor.
Raw in `verify-r1/raw/`.

### 2a. The encode census — `attribution/A1/bake-census.mjs`, UNMODIFIED (only `--port`)

chromium · CPU 4× · unthrottled link · **warm** · 390×844 · **dpr 3** · load `9.46 → 3.43`

| mark | base | cured | Δ | disjoint | author |
|---|---|---|---|---|---|
| **PNG encodes** | **24** (24–24) | **12** (12–12) | −12 | yes | 24 → 12 ✓ |
| **`toBlob` bill** | **3,704.9 ms** (3,608.3–3,913.2) | **320.8 ms** (306.6–348.6) | −3,384.1 | yes | 10,057.9 → 1,030.9 |
| pipeline wall | 3,076.9 | 3,025.2 | −51.7 | yes | 3,642.4 → 3,566.9 |
| board-ready | 172.6 | 175.7 | +3.1 | no | +6.8, also not a move |
| per-surface | sun 4 · moon 4 · logo 8 · grid 8 | logo 8 · grid 4 | — | — | identical ✓ |

The structural mark reproduces EXACTLY, per surface. The absolute `toBlob` bill does not: my
host ran the bake ~2.7× cheaper than the author's did (ten sibling lanes, a different hour).
The RATIO is the stable statement — base/cured 11.5× here against the author's 9.8× — and the
direction and disjointness hold. Read the author's 10,057.9 ms as that host-hour's figure, not
as a constant.

### 2b. The charter's Accept marks — `readiness-timeline-c11.mjs`

I diffed the instrument against the banked `A6/readiness-timeline.mjs`: **exactly the two
declared edits** and nothing else (warm primer `2500` → `--primer 9000`, and the added
`mob-wk-1x-unthr-warm` cell). Both arms get the same primer.

chromium · 4× · unthrottled · **warm** · 390×844 · **dpr 3** · load `4.52 → 3.27`

| mark | base | cured | Δ | disjoint | author |
|---|---|---|---|---|---|
| **warm boardDrawn** (`firstBoilTickMs`) | **1,296.6** (1,292.2–1,427.4) | **923.3** (918.8–923.5) | **−373.3** | yes | −371.4 ✓ |
| **warm TBT(3000)** | **485.0** (476–520) | **62.0** (60–65) | **−423.0** | yes | −435 ✓ |
| first bake mounted | 1,176.8 | 742.4 | −434.4 | yes | −446.0 ✓ |
| LCP | 1,180.0 | 748.0 | −432.0 | yes | −448 ✓ |
| longest task | 155.0 | 112.0 | −43.0 | yes | −43 ✓ |
| rAF-gap blocking proxy | 576.0 | 97.0 | −479.0 | yes | −484 ✓ |
| worst rAF gap | 196.5 | 159.2 | −37.3 | yes | −39.0 ✓ |
| board-ready | 184.8 | 170.1 | −14.7 | **no** | +0.9, also inside the spread |
| **bake layers mounted** | **4** | **4** | 0 | — | pose count unchanged ✓ |

### 2c. Cold not worse — chromium · 4× · **cold** · 390×844 dpr 3 · load `3.06 → 3.62`

Not one mark is disjoint, in either direction: boardDrawn 1,559.5 → 1,558.8, TBT 542 → 540,
firstBake 1,384.7 → 1,389.3, board-ready 255.8 → 256.9, LCP 1,400 → 1,408, longest task
176 → 176, worst rAF gap 209.6 → 199.2. The largest excursion is +8 ms of LCP inside a 88 ms
spread. **Cold is not worse.** (The author reported every cold delta ≤ 0; mine are ± and all
inside the spread. Same conclusion, and the honest phrasing is "unmoved", not "improved".)

### 2d. WebKit warm — webkit · unthrottled, NO CDP · 390×844 dpr 3 · load `22.45 → 4.45`

| mark | base | cured | Δ | disjoint | author |
|---|---|---|---|---|---|
| **rAF-gap blocking proxy** | **80** (72–87) | **13** (5–21) | **−67** | yes | −66 ✓ |
| **worst rAF gap** | **113** (110–120) | **63** (55–71) | **−50** | yes | −54 ✓ |
| firstBoilTick | 910 | 902 | −8 | no | −4 ✓ |
| first bake / LCP / board-ready | 683 / 697 / 119 | 687 / 703 / 111 | +4 / +6 / −8 | no | unmoved ✓ |
| TBT(3000), longtasks | NOT MEASURED — WebKit exposes no `longtask`; the rAF gap is the only proxy | | | | |

The author's sentence stands: on WebKit the readiness stamps do not move and the blocking does,
by a factor of six. A WebKit number is not a Safari number and is not an iOS claim; 8.3 closes
it on the device.

### The lies I hunted and did not find

Arms not swapped (the base entry carries no store code and is the slower arm). Regime is the
charter's, stated with dpr 3 at both ends. The warm cell really is warm (a primer navigation in
the same context, cache re-enabled before the measured load). No masked fallback: the cure is
demonstrably live on the measured path — 12 encodes, and the restored sun/moon/grid are missing
from the census by name. No gate piped to `tail`; every gate below was run bare and its `$?`
read.

## 3. π — I TOOK THE BYTES MYSELF

- **Goldens**: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config
  playwright-golden.config.ts` → **4 passed, exit 0**, no `--update-snapshots`
  (`verify-r1/goldens.txt`). Note what this does and does not prove: a golden run gets a fresh
  context, so the store is empty and the cure is inert there. It is a no-regression check on the
  bake path.
- **The store chain, which is the real π evidence** (`verify-r1/theme-race-probe.mjs`, three
  runs): a persistent chromium profile at 390×844 dpr 3 boots, and the sha-256 of the four
  mounted grid pose bitmaps EQUALS the sha-256 of the four PNGs in the stored row; the page then
  reloads and the four mounted bitmaps are that same row again. **mounted-at-bake == stored ==
  mounted-at-restore, 4 of 4 poses, in all three runs.** This closes the gap in the author's
  `pi-bytes-probe.mjs`, whose arm 3 cannot by itself distinguish a restore from a
  deterministic re-bake.
- **Pose count 4**: `bakeLayers` 4 in both arms, 5 of 5 windows, both engines; and 4 mounted
  bitmaps in every store dump.
- **`filterBudget` 9**: the file is not in the diff, and `filter-census.spec.ts` (exact-match
  allowlist against the built dist, both engines, both width regimes) is green in §5.
- **A build change re-keys**: not argued, read — the entry chunk's hashed name is the first
  field of every key in the live store (`index-B0401ox6qFDa.js|…`), so a rebuild misses every
  row by construction.

## 4. THE MUST-NOTS

| clause | verdict |
|---|---|
| ship a stale bitmap | HELD under attack. I built a flip-back probe specifically to make the write watch (`bakeStore.ts:437`) store one theme's PNGs under the other theme's key — it keys the write on the identity current when the library's set lands, not on the identity that set was baked under. Six flip-back timings (40/70/110/150/350/800 ms, chromium 4× mobile dpr 3): the light row was never rewritten (`at` unchanged, sha unchanged), the dark row was always stored correctly, and the reload always served the boot's light pixels. The two guards (`restored.has(key)` at schedule time, `handle.urls.value !== next` at idle) held every time. See finding F3. |
| ship a LOWER-RESOLUTION bitmap | `adoptStack` (:294) decodes every restored pose and compares its intrinsic to `cssSize × dpr` (±1) before serving; a short, blank or mis-sized set is dropped and the surface bakes. The restored set then still faces `retainedPoseUrls`'s CH-62 ink probe, which calls `rebake()` on a blank one. |
| grow without bound | `ROW_CAP` 16 **and** `BYTE_CAP` 8 MB, enforced on every write, evicting least-recently-stored on the `at` index. Measured on a live store: 1,815,513 B for both themes' grids plus both celestials at 390×844 dpr 3. |
| write on the boot's critical window | the only write is `atIdle` after the bake landed, re-checking identity and live set. Cold arm §2c: no mark worse. |
| drop a bake / thin a boil / remove a filter / shorten a transition | none. |

## 5. GATES — re-run by me, bare, in the worktree

| gate | exit | note |
|---|---|---|
| `npm run test:unit` | 0 | **Test Files 66 passed (66) · Tests 810 passed (810)** — both lines read |
| `npm run lint:eslint` | 0 | |
| `npm run lint:knip` | 0 | |
| `npm run lint:motion` | 0 | 34 specs, every one declaring its motion state |
| `npm run lint` | 0 | prettier clean as committed |
| `playwright-throttle.config.ts` → :4253, both engines | 0 | **67 passed** (filter-census, wordmark-integrity, theme-bake-freshness, theme-quadrants, throttled-void) |
| scratch config → :4253, both engines | 0 | **178 passed** (gallery, visual-regression, a11y, access). The scratch config is `../playwright-c11.config.ts`, which I diffed against the worktree's `playwright.config.ts`: four edits and no others — the `webServer` block dropped, `baseURL` pinned to :4253, and import/testDir/globalSetup made absolute. The estate default :3000 was never used |
| golden battery → :4253 | 0 | **4 passed** |

## 6. FINDINGS (none blocking)

- **F1 · a wrong number in the shipped source and in the record.** `bakeStore.ts:20` and
  `RECORD.md` §1 both say the wordmark is "4 of the 24 boot encodes, ~400 ms of a 9,132 ms
  bill". The author's own census table and my reproduction both count **logo 8** of 24. The
  safety argument is unchanged; the arithmetic is wrong in a source comment. M09.
- **F2 · `census-stats.mjs` prints "dpr 2" for the mobile cell** (it tests `m0.vp === "mobile"`
  where the field is `"mob"`). Every mobile reading in this cure is dpr 3 — `bake-census.mjs`'s
  own `VIEWPORTS.mob` says so, and `RECORD.md` states it correctly. Label-only, in an evidence
  reducer, but the law asks each number to name its dpr.
- **F3 · hardening, not a defect: `bakeStore.ts:437` should key the write on the identity the
  library baked under**, not on `identityOf(toValue(opts))` at the moment the set lands. It is
  safe today only because two other guards happen to catch the flip-back case; I could not fire
  it in six attempts, but the invariant would be cheaper to state than to defend.
- **F4 · a small handle leak on the rejected-restore path.** `rebake()` (:475) calls
  `forget(key)` while `held.value` still points at those urls, so `forget` skips the revoke;
  `held.value = null` then orphans them, unrevoked. Bounded by how often the ink probe rejects a
  restored set, which is rare.
- **F5 · the 9,000 ms warm primer is load-bearing, and should be read as a condition on the
  cure, not as a knob.** The author declared it and applied it to both arms, which is lawful. It
  is worth saying plainly at the fold: the cure pays off on a *second* visit only if the *first*
  visit stayed open long enough for the idle write to land. A 2.5 s first visit stores nothing.
- **F6 · the goldens are inert for this cure** (fresh context, empty store). Said by the author;
  repeated here so the fold does not read "4 passed" as evidence about restored pixels. §3's
  store chain is that evidence.

## 7. WHAT I DID NOT DO

No real Safari, no iOS, no simulator (M19). No product file edited, nothing committed, nothing
pushed. The per-window JSONL readings are not banked here — this dir is capped at 40 KiB, so it
carries the reducers' tables, the four `loadavg` files, the probe and its summary. Every table
was produced by the author's own reducers (`census-stats.mjs`, `readiness-stats.mjs`), which I
read before running: they are pure medians over the arms' files. The spike's own tables (`SPIKE.md`, the store choice, the WebKit persistence control)
were read, not re-run: the landing's numbers are what the charter accepts on, and they
reproduce.
