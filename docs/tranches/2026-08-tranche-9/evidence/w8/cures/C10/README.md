# T9-W8 C10 — SLOW-LINK BYTES

Track `app` · worktree `.claude/worktrees/w8-app` · branch `w8/app` · ports base 4256 / cured 4257.
preSha `0bf9cb0ea24d4ee768de67fdba6b6e61d4f2a7c1` (C06's commit, the branch as found).
Commit `83ee20b6d364353728bff7699e40f3588323063c`.

## THE TWO ARMS

```
BASE  AUDIT: build-identity — dist entry index-CydLs17Yb6Kt.js · index.html md5 a5354065621a844ebf02a51cfc966251 · 43 files / 806.2 KB
CURED AUDIT: build-identity — dist entry index-Xs5kd5lwkg21.js · index.html md5 7c8ebd7d2494414d8eae3200c95cdf1d · 46 files / 807.4 KB
```

`dist-base` is HEAD as found, rebuilt (`npm run build`, `rm -rf dist-base && mv dist dist-base`) — it is
**not** 8.1's `index-9rZPzI5DEcpe.js`, because C06 landed on this track first. Both lines printed at
both ends of every reading set (`reading-set.txt`, `load-*.txt`); neither moved.

## THE FIRST ACT — 8.1's per-module figures, VERIFIED

Built with `npx vite build --outDir <scratchpad>/dist-maps --emptyOutDir --sourcemap`. The maps build
emitted **`index-CydLs17Yb6Kt.js`, the same content hash as `dist-base`** (215.39 kB vs 215.34 kB —
the difference is the appended `sourceMappingURL` comment), so the attribution is exact for the
shipped bytes. `module-map.mjs` ran on that chunk; `coverage-attrib.mjs` ran three windows against a
preview of it (chromium 4×, cold, desk dpr 1) with `--maps` pointed at the scratch build.

| row | 8.1 claimed | VERIFIED here | verdict |
|---|---|---|---|
| entry chunk executed at ready | 52.6 % | 113,229 / 215,368 = **52.6 %** (53.4 / 53.4 in w2/w3) | CONFIRMED |
| `GameGallery/*` family | 20,251 B, 6 % | 1,277 / **20,251 B = 6.3 %**, 3/3 windows identical | CONFIRMED |
| `GameGallery.vue` alone | — | 317 / 9,946 = **3 %** (the "6 %" is the family, not the file) | CLARIFIED |
| `techniqueEngine.ts` | 7,058 B, 3 % | 183 / **7,058 B = 2.6 %** | CONFIRMED to the byte |
| `useSession.ts` | 5,456 B, 13 % | 721 / **5,456 B = 13.2 %** | CONFIRMED to the byte |
| `useUndoHistory.ts` | 2,604 B, 11 % | 289 / **2,604 B = 11.1 %** | CONFIRMED to the byte |
| sudoku bank chunk | 18,164 B, 99 % evaluated | 17,986 / **18,163 B = 99 %** | CONFIRMED |

Raw: `cov-1.json`, `cov-2.json`, `cov-3.json` (+ `cov-N.txt`, the top-40 module tables).
ATTRIBUTION row 8's "per-module figures do not verify" is **DISCHARGED**: they verify exactly.

## WHAT LANDED, SPLIT BY SPLIT

### A. The gallery family is its own chunk (`App.vue`)

`GameGallery.vue` + `GameCard.vue` + `StagingBand.vue` + `useCarouselGlide.ts` leave the entry chunk,
and their scoped rules leave the render-blocking sheet with them.

A `shallowRef<Component|null>`, **not** `defineAsyncComponent`, for the reason `App.vue` already
states one screen up about the scene rows: an async wrapper mounts a resolution tick late, and the
fold's first frame may not be a module-evaluation frame. Once filled, the view flip mounts the deck
synchronously, exactly as the static import did.

Two warms, both this file's own idiom (`scheduleWarmPosters`): `requestIdleCallback` plus a 1,200 ms
timeout floor after mount (WebKit ships no `requestIdleCallback`, so the timeout is the
engine-neutral floor, not a fallback), and again **on intent** at the head of `enterGallery`, which
has BEAT 0's 200 ms of chrome-leave in front of the mount. W7 rules on idle vs intent; both run and
neither blocks.

| | base | cured |
|---|---|---|
| entry `index-*.js` | 215,345 raw / **62,548 br** / 73,452 gz | 192,282 raw / **56,211 br** / 65,811 gz |
| render-blocking `index-*.css` | 93,735 raw / **16,421 br** | 82,734 raw / **14,723 br** |
| `GameGallery-*.js` (non-blocking) | — | 21,321 raw / 7,181 br |
| `GameGallery-*.css` (non-blocking) | — | **11,002 raw / 2,310 br** |

### B. `TIER_SOURCE` is its own module (`vite.config.ts`, `useSudoku.ts`, generated `tiers.ts`)

Asking *"does this tier ride the bank?"* used to require downloading the bank: `tierSource` lived in
`templates.ts` beside 18,164 B of board literal, so the 9×9 livegen deal paid the whole chunk to hear
no. The generator emits `src/games/sudoku/data/tiers.ts` (the table and its accessor, 137 B of data);
`useSudoku` imports `tierSource` statically and keeps the `import()` of `TEMPLATE_BANK` exactly where
T9-W4 §4.4 put it, behind `tierSource(...) === 'bank'`.

**The bank fetched before board-ready: 6/6 windows → 2/6** (chromium 4× unthrottled cold desk).
It is not 0/6 and must not be reported as 0: sudoku *rolls* its opening tier
(`useSudoku.ts` `freshDifficulty`), and at n=3 only HARD is declared `bank`. Two of six is the third
that legitimately needs it. Bank chunk itself 18,164 → 17,779 raw (4,327 → 4,081 br).

`tiers.ts` stays **inside** the format gate rather than joining `templates.ts` in `.prettierignore`:
it is prose, not a board literal, so the generator emits it in the shape prettier prints and
`npm run lint` checks that it stayed there.

### C. One `app-shared` chunk, not two files (`vite.config.ts` `advancedChunks`)

Splitting the gallery out left two modules shared between the entry and the new chunk, and Rolldown
gave each its own file: a 3,015 B `pencilConfig` and an **89 B** `_plugin-vue_export-helper` — two
modulepreloads on the boot burst for one file's worth of bytes, one of them pure overhead. Measured
both ways: **+2 requests before ready → +1** (Fast-3G desk, 9 → 11 became 9 → 10).

## THE NUMBERS

Interleaved b,c,b,c,… one window per invocation so host drift falls between arms; medians; no window
reported `tainted`. Driver: `freight-run.mjs` over `boot-freight.mjs` (byte-identical copy of
`attribution/A2/boot-freight.mjs`, md5 `d1317cafe9a6d22c52081fbafa005b25`). `sysctl -n vm.loadavg` at
both ends of every set. Up to ten sibling lanes were live; the load is stated per set.

### Bytes and requests before board-ready — the mark C10 owes

| regime | base | cured | Δ | windows |
|---|---|---|---|---|
| chromium 4× Fast-3G cold desk dpr1 | 172,197 B / 9 req | **163,911 B / 10 req** | **−8,286 B**, +1 req | 5/5, identical per arm |
| chromium 4× Fast-3G cold mobile dpr3 | 172,197 B / 9 req | **163,911 B / 10 req** | **−8,286 B**, +1 req | 5/5, identical per arm |
| chromium 4× unthrottled cold desk dpr1 | 183,227 B / 11 req | **170,009 B / 11 req** | **−13,218 B**, +0 req | 6/6 |
| webkit unthrottled cold desk dpr1 (PROXY) | 210,281 B / 15 req | **197,061 B / 16 req** | **−13,220 B**, +1 req | 5/5 |

The figure is deterministic per arm (every window of an arm read the same total), so there is no
spread to be inside of. Unthrottled is the larger saving because on a fast link the bank *and* the
avatar also land before ready in the base arm, and the bank is gone from two thirds of cured windows.

At the edge's own shape (`census-bytes.mjs`, brotli q11), the boot graph — entry js+css, `vue-vendor`,
`animation-vendor`, `app-shared` — is **113,542 → 106,750 B brotli**, −6,792 B.

### board-ready

| regime | base (min–max) | cured (min–max) | Δ | inside spread? |
|---|---|---|---|---|
| 4× Fast-3G cold **mobile dpr3** | **1,377.4** (1,370.0–1,384.2) | **1,350.2** (1,342.5–1,354.5) | **−27.2 ms** | **NO** — base min > cured max, 5/5 |
| 4× Fast-3G cold desk dpr1 | 1,426.3 (1,386.5–1,550.0) | 1,407.2 (1,366.2–1,504.7) | −19.1 ms | YES — the arms overlap at load 20 |
| 4× unthrottled cold desk dpr1 | 331.8 (310.4–362.9) | 341.6 (318.0–354.6) | +9.9 ms | YES — no regression, no gain |
| webkit unthrottled cold desk (PROXY) | 261 (247–267) | 263 (259–272) | +2 ms | YES |

An earlier interleaved set at load ≈10 read Fast-3G desk **1,416.6 (1,404.6–1,426.7) → 1,369.8
(1,359.2–1,398.0), −46.8 ms non-overlapping 5/5**, and mobile −41.1 ms non-overlapping. The banked set
above was taken at load 14→22 with ten lanes live and the desk arm's spread swelled to 164 ms; the
mobile mark held non-overlapping in both. **The claimed readiness move is the mobile Fast-3G one.**
Unthrottled it is flat, exactly as the charter priced it: this is a byte cure, not a millisecond one.

### The first gallery open — the π obligation

`fold-frames.mjs` (byte-identical copy of `attribution/A7/fold-frames.mjs`), chromium 4× desk dpr 2,
warm, 3 interleaved invocations × 2 cycles per arm, load 18→16.

| mark, entry cycle 0 (the FIRST open) | base | cured |
|---|---|---|
| choreographed worst frame | 108.7 ms [100.9, 108.7, 109.5] | 91.4 ms [89.7, 91.4, 93.4] |
| long33 / long50 | 2 / 2 | **2 / 2** |
| bakes | 8 | **8** |

Entry cycle 1: 57.0 → 57.6. Exit cycle 0: 68.2 → 59.8. Exit cycle 1: 49.5 → 48.4 — all inside spread.
The obligation is met: **no new long frame, and no new bake, on the first open.** The cycle-0 worst
frame reads lower on the cured arm with non-overlapping arms, but it is not claimed as a gain — the
frame is G2's bake frame and C05's to move, and one three-invocation set on a load-22 host is not
enough to book it.

## π IDENTITY

- `playwright-golden.config.ts` against `http://127.0.0.1:4257`, no `--update-snapshots`: **4 passed**.
  No golden moved. Pose count 4.
- `filterBudget` 9: `lint:motion` and `e2e/filter-census.spec.ts` green against the cured arm.
- No bake dropped (8 and 4 per fold, both arms), no boil thinned, no filter removed, no transition
  shortened. No CSS rule dropped — the 11,002 B that left the blocking sheet are served with the
  gallery chunk; the gallery specs and the goldens are the proof there is no flash.

## GATES (bare, in the worktree, exit codes as read)

`test:unit` 0 — **Test Files 66 passed (66) · Tests 810 passed (810)** · `lint:eslint` 0 · `lint` 0 ·
`lint:knip` 0 · `lint:boundary` 0 · `lint:tdz` 0 · `lint:copy` 0 · `lint:live-regions` 0 ·
`lint:motion` 0 · `typecheck:e2e` 0 · `typecheck:node` 0.

e2e through `playwright-c10.config.ts` (this dir; `webServer` dropped, `baseURL` → :4257, `testDir`
and `globalSetup` absolutised, `@playwright/test` imported by absolute path because the config lives
under `docs/`), both engines, against the cured dist:

- `gallery` + `gallery-deal` + `gallery-guard` + `spoken-gallery` + `board-covisibility`: **128 passed**
- `sudoku-interaction` + `permalink` + `filter-census` + `visual-regression` + `a11y` +
  `theme-bake-freshness`: **88 passed**

## WHAT DID NOT LAND, BY NAME

**`import()` the technique engine.** `useGameState` calls `domain.grade` (`:600`), `domain.fillForced`
(`:748`) and `domain.hint` (`:804`) **synchronously**, on the commit path; `techniqueAdapter.ts` and
`techniqueVoice.ts` take value imports (`fullDomainMask`, `TECHNIQUE_TIER`). Deferring it puts a
microtask in the input path of every cell commit, in five games, to buy **2,054 B brotli** against
8.1's measured ceiling of ≤6 ms for 102,000 appended chars. A failure mode for 2 KB. DECLINED.

**`import()` `useSession` behind the first host/join.** It exports a module-level reactive singleton
read from `GameControlPanel.vue`'s computeds and template (`session.roomId.value`, `session.live.value`,
`session.players.value` at `:436/:455/:462/:1064/:1197/:1344`), `BoardHost.vue:69`, `GameBoard.vue`,
`useGameState.ts` and `App.vue` — it must exist at first render. Deferring needs either a shim (which
puts the bytes back) or five components tolerating an absent singleton, for **1,583 B brotli**. DECLINED.

**`loading="lazy"` on the avatar.** Already in the tree — `AttributionCard.vue:75` carries
`loading="lazy" decoding="async"` and has since T4-W8 — and it does **not** defer the fetch, because
the closed hover-card is in the viewport. ATTRIBUTION row 12's named cure is therefore already spent.
On Fast-3G the avatar lands **after** board-ready in 5/5 windows, so there is nothing to book there;
unthrottled it is 6,098 B inside the boot window, removable only by gating the `<img>`'s render on the
card ever opening — a pixel risk on the open card for 6 KB that never touches the slow link. NOT TAKEN.

**Splitting poster / celebration / attribution rules out of the sheet.** The poster rules are already
their own chunks' CSS on this tree (`PosterBoard`, `FutoshikiPoster`, `CageOverlay`, `ThermoTube`,
`AnswerKeyLaminate`, `spec-*`). What remained blocking and movable was the gallery's 11,002 B, and
split A moved it. The celebration and attribution rules belong to components that render on the first
view; moving them means an async component on the boot path, which is the resolution tick this cure
declined for the gallery. NOT TAKEN.

## A NOTE FOR THE ESTATE (an instrument fact, not a cure)

`xablate.mjs --mode jspad` **cannot be run under `--net fast3g`**: `page.route(...).fulfill()` serves
the body from the driver and bypasses CDP's `Network.emulateNetworkConditions`, so the padded arm
reads *faster* than the unpadded one (this dir's `xablate-jspad12514-fast3g.jsonl`: base 1,463.2 ms,
"ablated" 1,110.4 ms, Δ **−352.8 ms** — an artifact, not a finding). The jspad ceiling is a
parse/eval ceiling only, which is how 8.1's refuter ran it. The unthrottled run here
(`xablate-jspad12514-unthrottled.jsonl`, +12,514 chars, Δ +18.1 ms at **load 39**) is likewise
noise-dominated and is not offered as a ceiling; 8.1's ±10 ms at load ≈5 stands.

## FILES IN THIS DIRECTORY

| file | what |
|---|---|
| `boot-freight.mjs`, `census-bytes.mjs`, `module-map.mjs`, `fold-frames.mjs` | byte-identical copies of the banked lane instruments |
| `coverage-attrib.mjs` | A2's, with ONE change: `SCRATCH` reads a `--maps` argument (8.1 hard-coded `scratch-dist`, which was deleted) |
| `xablate.mjs` | the A2 refuter's, with `--dist` / `--js` / `--css` / `--pad` made arguments (it hard-coded 8.1's asset names, and 8.2 rebuilds) |
| `freight-run.mjs` | this cure's interleaving driver over `boot-freight.mjs`; derives bytes-before-ready and requests-before-ready from the same `resources` array |
| `playwright-c10.config.ts` | the scratch e2e config (see GATES) |
| `cov-*.json/.txt` | the FIRST ACT's coverage windows |
| `census-base.jsonl`, `census-cured.jsonl` | per-file raw/brotli(q11)/gzip, both arms |
| `census-splitA.jsonl` | the same census taken on the SPLIT-A-ONLY rebuild, before B and C — the per-split byte ablation |
| `xablate-jspad12514-*.jsonl` | the two declined splits' byte mass padded onto the cured entry chunk (see the estate note) |
| `freight-*.jsonl` | the interleaved reading sets, one line per window |
| `fold-4x-desk-final.jsonl` | the fold census, both arms |
| `reading-set.txt`, `load-*.txt` | dist-identity and `vm.loadavg` at both ends of every set |
