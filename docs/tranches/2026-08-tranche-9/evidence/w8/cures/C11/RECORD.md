# T9-W8 C11 — PERSIST THE BAKED STACKS ACROSS LOADS · LANDED ON `w8/bake`

Track **bake**, worktree `.claude/worktrees/w8-bake`, branch `w8/bake`.
preSha `e694cc8c8da4a21c345bfcb06249e12fbecf7164` (C07b, the track's tip).
Spike branch `w8/bake-c11-spike`, commit `47d7dd6023207dc1a973b6f1f7ad73a8dece8cfe`, kept for
the record. Cherry-picked onto `w8/bake` as **`7c6c5bea026ec75234de0f0aeed696a85aa2b94c`**.

    base   AUDIT: build-identity — dist entry index-DT3aGxCK2_YJ.js · index.html md5 71db526c330253b274d0895282c9134e · 43 files / 811.6 KB
    cured  AUDIT: build-identity — dist entry index-B0401ox6qFDa.js · index.html md5 5e94cf595194ab26c719dc00b59bf078 · 43 files / 816.4 KB

Base arm = the build of the branch as it was found (C07b's HEAD), frozen as `dist-base`, served
:4252. Cured arm = `dist`, served :4253. Both identities re-printed at the end of every reading
set and at the end of the work; the cured entry hash is the one every number below was taken on
(the re-key probe moved it to `index-DQix3bkLrlaX.js` on purpose and it was moved back and
re-verified before the gates ran).

**The spike came first and is written up whole in `SPIKE.md`** with its own margin declared
before any reading (`MARGIN.md`): 3× on wall and on blocking, both engines, plus a 400 ms floor.
It returned 19.2× / 75.5× (chromium) and 55.8× / 12.0× (WebKit). This record is the landing.

## 1. THE CURE, AND WHERE IT LIVES

**App-side, one new file and two one-line call-site swaps.** No library change: pencil-boil
already owns the contract this needs on both halves — a non-positive `cssSize` means "not
measured yet" and the cache is the sole owner of what it holds — and what was missing was not in
the library at all. It was that nothing in this app ever wrote a baked pose down.

- `web/frontend/src/pencil/composables/bakeStore.ts` (new, 505 lines with its doc):
  `usePersistedRasterStack(opts, stepEveryBeats)` wraps `useRasterStack` and puts an IndexedDB
  store in front of it. `bakeStore.ts:352` is the composable; the store is `:113` (the build
  tag), `:148` (open), `:187` (read), `:216` (write), `:242` (the cap), `:294` (adopt and
  check the intrinsic).
- `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:258` — the grid's stack.
- `web/frontend/src/pencil/celestial/DarkModeToggle.vue:570,578` — the two celestial stacks.

**The gate is the library's own contract, used a second time.** While a stored stack is being
looked up — and for as long as one is being SERVED — the wrapper hands `useRasterStack` a zero
box, so no bake is ever started for an identity the store answers. C01 opened that seam for the
font gate; this is the same seam, keyed per identity. The lookup watcher is created BEFORE
`useRasterStack` so that Vue's creation-ordered pre-flush watchers shut the gate in the same
flush the capture box lands in, rather than racing a bake against the read.

**The returned handle is the library's, with `urls` shadowed when a restored set is live.** Every
consumer — `retainedPoseUrls`, its CH-62 ink probe, the atomic-swap discipline — goes on reading
one ref and cannot tell which path filled it. A restored set therefore faces the same admission
a baked one does.

**The wordmark is NOT stored.** It is the one surface that can bake WRONG rather than merely
early: a pose rastered before the face paints inside the image document is a fallback-glyph
wordmark, and C01's face gate holds that window open with a budget that can expire. Freezing
that is the one way this cure could ship a stale bitmap. It is also 4 of 24 encodes and ~400 ms
of a 9,132 ms bill, so the safety is nearly free.

## 2. THE NUMBERS

Every set interleaved b,c,b,c…, 5 windows per arm, 0 tainted of 10, medians, ranges in brackets.
`sysctl -n vm.loadavg` at both ends of each set (banked per set in `raw/<tag>/loadavg.txt`).

### 2a. The encode census — `attribution/A1/bake-census.mjs`, UNMODIFIED (only `--port` differs)

chromium · 4× · unthrottled link · **warm** · 390×844 · **dpr 3** · `raw/warm-c4x-mob/`,
load 3.23 → 4.40

| mark | base | cured | Δ | disjoint |
|---|---|---|---|---|
| **PNG encodes on a warm load** | **24** (24–24) | **12** (12–12) | −12 | yes |
| **the `toBlob` bill** | **10,057.9 ms** (9,686.1–10,269.4) | **1,030.9 ms** (989.2–1,063.2) | **−9,027.0 ms** | yes |
| pipeline wall | 3,642.4 (3,636.7–3,674.4) | 3,566.9 (3,554.6–3,569.9) | −75.5 | yes |
| last encode | 3,887.1 | 3,890.7 | +3.6 | no — C02's idle warm still runs there |
| board-ready | 182.0 (175.4–191.7) | 188.8 (170.3–200.5) | +6.8 | no, and never expected: no bake precedes it |
| per surface | sun 4 · moon 4 · logo 8 · grid 8 | logo 8 · grid 4 | sun, moon and the boot grid are RESTORED, not baked | — |

The twelve encodes that remain are the wordmark's eight (deliberately unstored) and C02's idle
pre-warm of the other theme's grid — a set the library bakes into its own cache and never hands
out, so the app cannot write it down. Stated as a limit, not hidden: a theme the user has
actually SHOWN is stored on the next load; one only pre-warmed is not.

### 2b. The charter's Accept marks — `A6/readiness-timeline.mjs`

Two edits to the banked instrument, both named in the file (`readiness-timeline-c11.mjs`) and
both applied to BOTH arms: the warm primer waits 9,000 ms instead of a literal 2,500 (the boot
bake pipeline runs 3.6 s at this regime, so a 2.5 s primer navigates away mid-bake and the
"warm" load is not warm in the sense C11 is about), and a `mob-wk-1x-unthr-warm` cell was added
because A6 banked WebKit warm at desk only.

**chromium · 4× · unthrottled · warm · mob 390×844 dpr 3** — `raw/rd-c4x-mob-warm/`, load 5.99 → 4.93

| mark | base | cured | Δ | disjoint |
|---|---|---|---|---|
| **warm boardDrawn** (`firstBoilTickMs`, B1's definition) | **1,297.4 ms** (1,293.4–1,423.1) | **926.0 ms** (919.1–926.7) | **−371.4** | yes |
| **warm TBT(3000)** | **502 ms** (475–509) | **67 ms** (61–76) | **−435** | yes |
| first bake mounted | 1,192.6 (1,148.3–1,219.0) | 746.6 (737.3–757.0) | −446.0 | yes |
| LCP | 1,200 (1,152–1,224) | 752 (744–764) | −448 | yes |
| longest task | 160 (155–163) | 117 (111–126) | −43 | yes |
| rAF-gap blocking proxy | 589 (566–604) | 105 (93–115) | −484 | yes |
| worst rAF gap | 199.3 | 160.3 | −39.0 | yes |
| board-ready | 183.8 (168.6–189.7) | 184.7 (168.3–190.5) | +0.9 | no — unmoved, as it must be |
| bake layers mounted | 4 | 4 | 0 | pose count unchanged |

**webkit · unthrottled (NO CDP) · warm · mob 390×844 dpr 3** — `raw/rd-wk-mob-warm/`, load 4.08 → 4.65

| mark | base | cured | Δ | disjoint |
|---|---|---|---|---|
| **rAF-gap blocking proxy** (WebKit's only task proxy) | **79 ms** (71–81) | **13 ms** (9–20) | **−66** | yes |
| **worst rAF gap** | **117 ms** (112–119) | **63 ms** (59–70) | **−54** | yes |
| firstBoilTick | 910 (895–913) | 906 (897–918) | −4 | no |
| first bake mounted | 680 | 690 | +10 | no |
| LCP | 694 | 707 | +13 | no |
| board-ready | 113 | 114 | +1 | no |

Said plainly: **on WebKit the readiness stamps do not move.** Playwright WebKit takes no CPU
throttle, and its whole bake bill is ~1,155 ms against chromium-at-4×'s 10,058, so the bake is
not what holds its first paint; the draw-in transition is. What moves there is the BLOCKING, and
it moves by a factor of six. A WebKit number is not a Safari number and is not an iOS claim —
8.3 closes this on the device.

### 2c. Cold not worse — `raw/rd-c4x-mob-cold/`, chromium 4× · cold · mob dpr 3, load 5.29 → 4.60

Every mark inside the spread and every delta ≤ 0: boardDrawn 1,685.0 → 1,561.9, TBT(3000)
554 → 537, firstBake 1,451.9 → 1,414.7, board-ready 262.2 → 254.7, longest task 180 → 176,
worst rAF gap 212.6 → 199.1. **Nothing regressed.** The cold path pays one `indexedDB.open`
(5.0 ms) and one keyed `get` (4.5 ms) per surface, and writes nothing until idle.

## 3. π — NO GOLDEN MOVES, AND THE BYTES SAY WHY

- **`pi-bytes-probe.mjs`, the strong form.** Arm 1: a fresh profile bakes → sha-256 per mounted
  pose. Arm 2 (**the control**): a SECOND fresh profile bakes → are the hashes even
  deterministic? Arm 3: arm 1's profile loads again, so the store answers.
  **chromium: 16 of 16 identical, bake vs bake AND bake vs restored. webkit: 16 of 16, both.**
  (`raw/pi-bytes-c.json`, `raw/pi-bytes-w.json`.) Without arm 2, arm 3 would prove only that a
  store returns what it was given.
- **Goldens**: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config playwright-golden.config.ts`
  → **4 passed**, no `--update-snapshots`. (`goldens-cured.txt`.)
- **`filterBudget` stays 9** — `filter-census.spec.ts` is one of the 67 green rows in §5.
- **Pose count 4** — `bakeLayers` 4 in both arms, 5 of 5 windows, both engines.
- **A build change provably re-bakes** (`raw/rekey-seed.json`, `raw/rekey-after.json`): one
  chromium profile, one port, one origin. At `index-B0401ox6qFDa.js` the first load bakes 24 and
  the second 12. Rebuild, restart the same port, entry now `index-DQix3bkLrlaX.js`: the first
  load bakes **24 again** — every stored row carries the old entry name and cannot match — and
  the second is back to **12** under the new key.

## 4. THE MUST-NOTS, EACH ANSWERED

| clause | how it is met |
|---|---|
| ship a stale bitmap | the key carries build + agent + the library's whole capture identity; the wordmark (the one surface that can bake wrong) is not stored at all |
| ship a LOWER-RESOLUTION bitmap | every restored pose is decoded and its intrinsic size checked against `cssSize × dpr` (±1 px) before it is served — CH-67's invariant read from the other end; a short, blank or mis-sized set is dropped and the surface bakes |
| grow without bound | `ROW_CAP` 16 stacks **and** `BYTE_CAP` 8 MB, enforced on every write, evicting least-recently-stored first on an `at` index. Measured footprint: 2,098,690 B for 32 poses (chromium mobile dpr 3) against a 10.7 GB quota. Rows from other builds are purged at idle |
| write on the boot's critical window | the only write is scheduled through `requestIdleCallback` (400 ms timeout fallback) AFTER the bake has landed, and re-checks the identity and the live set before it runs. Cold arm: no mark worse |
| drop a bake / thin the boil / remove a filter / shorten a transition | none touched; a miss is exactly today's behaviour, one 4.5 ms read later |

Fail-open everywhere: no `indexedDB`, a private window, a full disk, a refused Blob put, a
quota error, a hung decode — each falls through to the bake. In dev the file is off entirely
(`import.meta.env.DEV`): the dev server's entry carries no content hash, so a source edit could
not re-key what it stored.

## 5. GATES (`gates.txt`, run bare in the worktree, exit codes read from `$?`)

| gate | exit | note |
|---|---|---|
| `npm run test:unit` | 0 | **Test Files 66 passed (66) · Tests 810 passed (810)** |
| `npm run lint:eslint` | 0 | |
| `npm run lint` | 0 | red once on the new file's formatting; `prettier --write` on that one file, re-run green, and the rebuild did not move the entry hash |
| `npm run lint:knip` | 0 | |
| `npm run lint:boundary` | 0 | |
| `npm run lint:tdz` | 0 | |
| `npm run lint:copy` | 0 | the cure adds no string a user can read |
| `npm run lint:live-regions` | 0 | |
| `npm run lint:motion` | 0 | |
| `npm run typecheck:e2e` | 0 | |
| `npm run typecheck:node` | 0 | |

**e2e against the cured dist, both engines** (`e2e-cured.txt`):
- `playwright-throttle.config.ts` with `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253` — the bundled-preview
  suite that owns the baked-surface specs: filter-census, wordmark-integrity, theme-bake-freshness,
  theme-quadrants, throttled-void → **67 passed**.
- `playwright-c11.config.ts` (this dir: `playwright.config.ts` with the `webServer` block removed,
  `baseURL` pinned to :4253, and imports/testDir/globalSetup absolute because the file lives under
  `docs/`) running gallery, visual-regression, a11y, access → **128 passed**.

## 6. WHAT THIS DOES NOT CLAIM

- No iOS or Safari claim. Every number here is Playwright chromium under CDP throttle or
  Playwright WebKit unthrottled, on darwin, with up to ten sibling lanes on the host.
- WebKit's readiness stamps do not move (§2b), and the WebKit blob store needed an on-disk
  profile to be priced at all (`SPIKE.md` §2) — a real browser always has one; Playwright's
  default context does not.
- Eviction on a real device is not measured. Its only effect is a miss, which is today's bake.
- The 12 encodes that remain on a warm load are named in §2a, not rounded away.
