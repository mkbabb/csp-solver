# C06 — NON-AUTHOR VERIFY, round 1

2026-09-17 · track `app` · worktree `.claude/worktrees/w8-app` @ `0bf9cb0e` (preSha `7b0610cc`).
Ports 4256 base / 4257 cured, both killed at the end. Verdict: **ACCEPT**.
All readings in `readings.txt` (214 rows); scratch e2e config in `playwright-c06-verify.config.ts`.

## Arms

| arm | entry | index.html md5 | files / size |
|---|---|---|---|
| base `dist-base` | `index-9rZPzI5DEcpe.js` | `fa3d1af9870916cc728de11e97f57a90` | 43 / 806.1 KB |
| cured `dist` | `index-CydLs17Yb6Kt.js` | `a5354065621a844ebf02a51cfc966251` | 43 / 806.2 KB |

Both printed at the start and the end of the reading set, unmoved, and both match the author's
report. `npm run build` from `0bf9cb0e` reproduces the cured entry hash and index.html md5
exactly, so the measured dist is HEAD's tree and nothing was masked. `flip-glide` appears once
in the cured bundle and zero times in the base bundle.

Load: start `{ 16.40 13.76 12.88 }`, per-set values on each block below, final
`{ 22.86 16.04 13.10 }`. Up to ten sibling lanes shared the host.

## The mechanism

Two files, 20 insertions / 1 deletion. `useFlipGlide.run()` stamps `anim.id = "flip-glide"` on
each mover it starts; `App.vue`'s `boardAnimations()` filters that id out of the set both
`snapshotBoardAnims` and `restoreBoardAnims` read. Ownership, not drawing less. It draws MORE:
one extra live animation across the fold. Nothing on the REFUSED or REFUTED list is touched.

## Reproduced — exit `boardTravel` (fold-geometry.mjs, md5 `a896a2891fdffd76819d11764bda5bfd`,
byte-identical to `attribution/A7/fold-geometry.mjs`)

6 windows per arm per regime, interleaved b,c,b,c,b,c (3 invocations x 2 cycles), medians.
Warm cache, unthrottled link, `?game=sudoku&size=3&difficulty=EASY`.

| regime (viewport · dpr) | base exit | cured exit | delta |
|---|---|---|---|
| chromium 1x · 1280x800 · dpr 2 | NO TRAVEL span 0.0 distinct 1 (5/6; 1 CUT share 1.000) | GLIDE span 295.9 distinct 44 share 0.0725 | 0 -> 295.9 px |
| chromium 4x CDP · 1280x800 · dpr 2 | NO TRAVEL span 0.0 distinct 1 (6/6) | GLIDE span 295.2 distinct 38 share 0.336 | 0 -> 295.2 px |
| chromium 1x · 390x844 touch · dpr 3 | NO TRAVEL span 0.0 distinct 1 (6/6) | GLIDE span 78.2 distinct 31 share 0.0745 | 0 -> 78.2 px |
| chromium 4x CDP · 390x844 touch · dpr 3 | NO TRAVEL span 0.0 distinct 1 (6/6) | GLIDE span 78.2 distinct 25 share 0.289 | 0 -> 78.2 px |
| webkit · 1280x800 · dpr 2 (PROXY) | NO TRAVEL span 0.0 distinct 1 (5/6; 1 CUT share 1.000) | GLIDE span 263.4 distinct 24 share 0.180 | 0 -> 263.4 px |
| webkit · 390x844 touch · dpr 3 (PROXY) | NO TRAVEL span 0.0 distinct 1 (5/6; 1 CUT share 1.000) | GLIDE span 72.8 distinct 19 share 0.156 | 0 -> 72.8 px |

The base spread is zero in every window that read NO TRAVEL, and the one-window CUTs carry
share 1.000 over 2 distinct widths, which is the same instant swap sampled across two frames.
The move is not inside any spread; it is a channel that did not exist. Cured is GLIDE 36/36.

Biggest-step share, cured exit against the charter's entry band: chromium desk 0.0725 and
chromium mobile 0.0745 both inside 0.067-0.08; webkit desk 0.180 and webkit mobile 0.156 both
inside 0.138-0.198. At 4x both directions coarsen together and the exit stays the smoother.

Set loads: chr1x-desk 10.96 -> 6.88 · chr4x-mobile 6.59 -> 8.73 · wk-desk 8.00 -> 16.44 ·
wk-mobile 14.68 -> 10.29 · chr1x-mobile 9.87 -> 9.57 · chr4x-desk 9.29 -> 9.08.

## Reproduced — the mover's lifetime (mover-census.mjs, md5 `5dd109139a51b8c81be665f10e09c805`)

chromium · 1x · warm · 1280x800 · dpr 2, 4 exit cycles per arm, interleaved. Load 8.54 -> 7.69.

- base exit, 4/4: `board-peek-host@6.5-7.8ms/520ms` then `FINISH:board-peek-host` 0.2-0.4 ms
  later; `CANCEL` at 517.6-523.7 ms.
- cured exit, 4/4: `board-peek-host@6.3-7.4ms/520ms`, **no FINISH**, `CANCEL` at 516.7-522.1 ms.
- SWEEP count 4 per exit on both arms. Park count was never the defect.
- Entry 14 calls with no FINISH on both arms, unchanged.
- The mover's own `520ms` duration is printed on both arms: the fold was not shortened.

## Reproduced — T8-M7b's guard (m7b-guard.mjs, this cure's instrument)

- settled, chromium and webkit, 1280x800 dpr 2, 3 invocations per arm per engine, interleaved:
  `cell-reveal` runs 0 and `armedAfter` 0 in **24/24** windows. The guard holds.
- in-wave, chromium dpr 2, press at ~880 ms with 61 cells armed, 3 per arm interleaved:
  base 62 / 63 / 63, cured 62 / 63 / 62. Median 63 -> 62, delta -1, inside a +/-1 spread.
  `armedAfter` 0 everywhere. Unmoved, which is all C06 owes.

## Reproduced — the exit's worst frame (fold-frames.mjs, md5 `dffc1cc571c9068ec44c18f3878b145f`)

chromium · 4x CDP · unthrottled link · warm · 1280x800 · dpr 2, 3 invocations per arm
interleaved. Load 6.59 -> 6.06.

- exit worst: base 56.4 / 73.7 / 58.3 -> median 58.3 ms; cured 59.8 / 66.2 / 58.3 -> median
  59.8 ms. Delta +1.5 ms, inside the base arm's own 56.4-73.7 ms spread. Not worse; the sign
  is not stable across authors, which is what "inside spread" means. long33 1, long50 1,
  p95 10.1-10.2 ms, bakes 4 on both arms.
- entry control worst: base median 85.0 ms, cured median 91.1 ms, both inside their own
  spread; long33 2, long50 2, bakes 8 on both arms. The entry is not disturbed.
- anim census, exit: base 5 alive at 74/123/210 ms and 2 at 300 ms; cured 6 alive at
  75-78/121/210 ms and 3 at 300 ms. Exactly one more live animation throughout the fold, and
  that one is the board. The motion delta, stated as a number.

## pi

- goldens, run by me against the CURED dist, never `--update-snapshots`:
  `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4257 npx playwright test --config playwright-golden.config.ts`
  -> **4 passed, exit 0**. The config honours the external base and drops its webServer, so
  :3000 was never touched. Worktree `git status` clean after: no golden re-minted.
- the baked-bitmap specs the author flagged as not-run, I ran, against the cured dist through
  `playwright-throttle.config.ts` with `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4257` (which
  suppresses its build+preview): projects `filter-census-chromium`, `filter-census-webkit`,
  `wordmark-webkit`, `theme-bake-chromium`, `theme-bake-webkit`, `theme-quadrants-chromium`,
  `theme-quadrants-webkit` -> **66 passed, exit 0**. `filter-census` is the exact-match filter
  allowlist against the built dist, so filterBudget 9 is closed against the cured artifact and
  not merely against source.
- `src/pencil/config/filterBudget.ts` is untouched by the diff; its census unit test is inside
  the 810/810.
- pose count 4: exit bakes 4 per fold on both arms in every fold-frames window, entry bakes 8
  on both. No bake dropped, no boil thinned, no filter removed, no transition shortened.

## Gates, run bare in the worktree

| gate | exit |
|---|---|
| `npm run test:unit` | 0 — Test Files 66 passed (66) · Tests 810 passed (810), both lines read |
| `npm run lint:eslint` | 0 |
| `npm run lint` | 0 |
| `npm run lint:knip` | 0 |
| `npm run lint:boundary` | 0 |
| `npm run lint:tdz` | 0 |
| `npm run lint:copy` | 0 |
| `npm run lint:live-regions` | 0 |
| `npm run lint:motion` | 0 |
| `npm run typecheck:e2e` | 0 |
| `npm run typecheck:node` | 0 |
| goldens vs cured dist | 0 — 4 passed |
| baked-bitmap pi projects vs cured dist | 0 — 66 passed |
| e2e surface, both engines, scratch config -> :4257 | 0 — 170 passed in 41.8s |

The scratch config is a faithful copy of `web/frontend/playwright.config.ts`: same
`testIgnore`, `timeout` 30000, `expect.timeout` 10000, `retries` 0, the same two engine
projects, the same `globalSetup`, the same viewport. Only `webServer` is dropped and `baseURL`
is pinned. It was copied into `web/frontend`, run, and deleted; nothing scratch was committed.

## The must-nots

1. **Disable `restoreBoardAnims`** — not disabled. It still runs and still finishes every
   untagged animation: the in-wave guard reads 62-63 reveals custodied on both arms with
   `armedAfter` 0, which is the restore doing its job on the cured arm.
2. **Shorten the 520 ms fold** — `MOTION.boardFoldMs` is 520 at `pencilConfig.ts:157`,
   untouched by the diff, and the census prints `/520ms` on the mover in both arms.
3. **Fix the cut by cutting the wordmark too** — the logo reads GLIDE in every window of every
   regime on both arms (desk span 123-150 px over 19-39 distinct widths, mobile 84-98 px over
   20-34). Nothing was cut to buy the board's travel.

## Deviations from the author's return (none material)

- chromium 1x desk base: the author read NO TRAVEL 6/6; I read 5/6 NO TRAVEL plus one CUT at
  share 1.000 / distinct 2. Same species, no glide either way; the author already named that
  species on WebKit.
- chromium 4x mobile exit share: author 0.412, mine 0.289. Both smoother than the entry in the
  same windows. Host load.
- exit worst frame at 4x desk: author -6.3 ms, mine +1.5 ms. Both inside the arm's own spread
  and neither is claimed as a gain.
- m7b in-wave absolute counts: author 66-67, mine 62-63, because my press landed at ~880 ms
  rather than ~790. The delta is the claim and the delta reproduces.
