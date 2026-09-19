# C06 — NON-AUTHOR VERIFY, round 1, RE-RUN 2026-09-18

A second independent pass by a different non-author agent. It does not overwrite the
2026-09-17 record beside it (`README.md`, `readings.txt`); it re-derives every number from
its own builds. Verdict: **ACCEPT**, with two clauses named as NOT CLOSABLE on this host.

## Why the arms had to be rebuilt

`w8-app` HEAD is no longer C06. Two C10 commits landed on `w8/app` after it
(`83ee20b6`, `db43df48`), and C10's author followed the track protocol — `rm -rf dist-base &&
mv dist dist-base` — so at the time of this pass:

- `w8-app/web/frontend/dist-base` = `index-CydLs17Yb6Kt.js` (C06's CURED build)
- `w8-app/web/frontend/dist` = `index-DjKBBtRFWqfO.js`, 46 files (C10's build)

Neither arm was C06's pair any more, and rebuilding inside `w8-app` would have destroyed
C10's arms mid-lane. So this pass built both arms itself, in a detached scratch worktree
under the session scratchpad (`node_modules` and `csp-solver/wasm/pkg` symlinked read-only,
nothing written to any lane's tree, no commit, no push):

| arm | tree | entry | index.html md5 | files / size |
|---|---|---|---|---|
| base | `7b0610cc` (preSha) | `index-9rZPzI5DEcpe.js` | `fa3d1af9870916cc728de11e97f57a90` | 43 / 806.1 KB |
| cured | `0bf9cb0e` (C06) | `index-CydLs17Yb6Kt.js` | `a5354065621a844ebf02a51cfc966251` | 43 / 806.2 KB |

Both reproduce the chair's and the author's reported identities **exactly**, from source, on
this host. `flip-glide` appears once in the cured bundle and zero times in the base bundle.
Served: base `:4256`, cured `:4257`, `vite preview --strictPort --host 127.0.0.1`, verified by
reading the entry hash out of each port's `index.html`; both killed at the end.

Instruments are byte-identical to the banked 8.1 originals (`diff` clean, md5s match):
`fold-geometry.mjs` `a896a2891fdffd76819d11764bda5bfd`, `mover-census.mjs`
`5dd109139a51b8c81be665f10e09c805`, `fold-frames.mjs` `dffc1cc571c9068ec44c18f3878b145f`.

## Host load — read this before any timing number below

`sysctl -n vm.loadavg` across the pass: start `{ 109.64 45.38 44.83 }`, mid
`{ 281.92 160.11 94.49 }`, end `{ 271.79 346.55 321.33 }`, peak `{ 524.55 410.82 297.77 }`.
Ten-plus sibling lanes shared this machine. Geometry and census marks are categorical and
survive that. Frame-timing marks do not, and are reported as such.

## The mechanism, read from the diff

`0bf9cb0e` touches two files, 20 insertions / 1 deletion:
`src/games/shared/useFlipGlide.ts` (`export const FLIP_GLIDE_ANIM_ID = "flip-glide"`, and
`anim.id = FLIP_GLIDE_ANIM_ID` after `spec.el.animate(...)` in `run()`), and `src/App.vue`
(`boardAnimations()` filters that id; the named import). Ownership, not drawing less. It
draws MORE. Nothing on the REFUSED list is touched by name or by effect: no bake, no boil,
no filter, no DPR, no `cacheKey`, no subset, no Bloom, no celestial, no `captureSide`, no
`DEFAULT_POSE_CACHE`, no `BOIL_CONFIG.frameCount`. `src/pencil/config/filterBudget.ts` and
`src/pencil/config/pencilConfig.ts` are outside the diff. The only `getAnimations` consumer
in `src/` is `App.vue:435`; no other code reads `Animation.id`, so the tag is inert elsewhere.

## Reproduced — exit `boardTravel` (fold-geometry.mjs)

6 windows per arm per regime (2 invocations x 3 cycles), interleaved b,c,b,c, medians. Warm
cache, unthrottled link, `?game=sudoku&size=3&difficulty=EASY`.

| regime (viewport · dpr) | base exit | cured exit | delta |
|---|---|---|---|
| chromium 1x · 1280x800 · dpr 2 | span 0.0 distinct 1 — 2 CUT / 4 NO TRAVEL | GLIDE 6/6, span 296.7, distinct 35, share 0.126 | 0 -> 296.7 px |
| chromium 4x CDP · 1280x800 · dpr 2 | span 0.0 distinct 1 — 2 CUT / 4 NO TRAVEL | span 296.3, distinct 20, share 0.844 (2 GLIDE / 4 CUT) | 0 -> 296.3 px |
| chromium 1x · 390x844 touch · dpr 3 | span 0.0 distinct 1 — 2 CUT / 4 NO TRAVEL | GLIDE 6/6, span 78.0, distinct 29, share 0.120 | 0 -> 78.0 px |
| chromium 4x CDP · 390x844 touch · dpr 3 | span 0.0 distinct 1 — 3 CUT / 3 NO TRAVEL | span 78.0, distinct 14, share 0.478 (4 GLIDE / 2 CUT) | 0 -> 78.0 px |
| webkit · 1280x800 · dpr 2 (PROXY) | span 0.0 distinct 1 — 3 CUT / 3 NO TRAVEL | GLIDE 6/6, span 218.3, distinct 18, share 0.660 | 0 -> 218.3 px |
| webkit · 390x844 touch · dpr 3 (PROXY) | span 0.0 distinct 1 — 1 CUT / 5 NO TRAVEL | GLIDE 6/6, span 64.1, distinct 16, share 0.486 | 0 -> 64.1 px |

The base arm reads **distinct 1 or 2 in 36 of 36 windows** — the CUT windows carry share
1.000 over two widths, which is the instant swap sampled across two frames. Its spread is
zero. The cured arm reads distinct 6-36 with a real span in 36 of 36. The move is not inside
any spread; it is a channel that did not exist. Direction as claimed.

**The 4x and WebKit `CUT` verdicts on the CURED arm are the host, not the cure**: in those
same windows the WORDMARK — which C06 does not touch and which glides on both arms — also
reads `CUT` (chromium 4x desk: logo CUT in 4/6 base and 5/6 cured). A verdict of CUT at
distinct 20 and span 296 px is a coarse sampling of a curve, not a swap; base CUT at distinct
2 is the swap.

## The share sub-clause — NOT CLOSABLE at this load (finding 1)

The charter accepts "biggest step share in entry's band (0.067-0.08 chromium, 0.138-0.198
WebKit)". Neither band is reproducible here in absolute terms, on either direction: the
ENTRY, the charter's own control, reads share median 0.172 / 0.130 (chromium 1x desk /
mobile), 0.835 / 0.852 (chromium 4x), 0.471 / 0.392 (WebKit desk / mobile) in the very same
windows. Judged comparatively, in the same windows:

- chromium 1x desk: exit 0.126 vs entry 0.172 — exit smoother ✔
- chromium 1x mobile: exit 0.120 vs entry 0.130 — exit smoother ✔
- chromium 4x desk: exit 0.844 vs entry 0.835 — level, both coarse ✔
- chromium 4x mobile: exit 0.478 vs entry 0.852 — exit smoother ✔
- **webkit desk: exit 0.660 vs entry 0.471 — exit COARSER by 0.19** ✗
- **webkit mobile: exit 0.486 vs entry 0.392 — exit coarser by 0.09** ✗

The author and the 2026-09-17 verifier both read the WebKit exit inside or below the entry
band on a quieter host (0.185/0.146 and 0.180/0.156). At load 100-170 the WebKit rAF stream
here delivers only 46-82 samples per 1,400 ms window, so both directions coarsen and the
exit's larger absolute travel takes the bigger single step. This is not evidence of a defect
and it is not evidence of its absence. It closes on a quiet host or on the device through
§8.3; it does not block the cure, whose claim is a glide where there was none.

## Reproduced — the mover's lifetime (mover-census.mjs)

chromium · warm · 1280x800 · dpr 2, 4 exit cycles per arm, interleaved. Load 225 -> 236.

- base, 4/4: `board-peek-host@20.2-28.7ms/520ms` then `FINISH:board-peek-host` **0.3-1.4 ms
  later**; `CANCEL` at 525.7-531.7 ms.
- cured, 4/4: `board-peek-host@15.7-18.5ms/520ms`, **no FINISH**, `CANCEL` at 521.0-525.9 ms.
- `SWEEP:board-peek-host` x4 per exit on BOTH arms — park count was never the defect.
- `/520ms` prints on the mover in both arms: the fold was not shortened.

That is the charter's named mechanism, exactly, and it proves the filter is live on the path
measured — no masked fallback.

## Reproduced — T8-M7b's guard (m7b-guard.mjs)

- `--mode settled`, chromium and webkit, 1280x800 dpr 2, 2 invocations per arm per engine:
  the EXIT reads `cell-reveal` runs 0, `armedAfter` 0 in **16/16** windows, both arms. Two
  ENTRY windows (one base webkit, one cured webkit) read 31-32 runs — the boot deal's tail
  slipping past the instrument's 3,600 ms wait at load ~200; symmetric across arms, named
  and excluded.
- `--mode inwave --at 790`, chromium dpr 2, 3 per arm interleaved, 61 cells armed: base
  71 / 70 / 71, cured 71 / 71 / 69, medians **71 -> 71, delta 0**; `armedAfter` 0 in all six.
  Cured invocation 3 landed at 1,906 ms with 0 cells armed (tainted, named; its 69 is in
  band anyway). The restore is still custodying real reveals on the cured arm.

## The exit's worst frame — NOT MEASURABLE at this load (finding 2)

fold-frames.mjs, chromium · 4x CDP · warm · 1280x800 · dpr 2, 2 invocations per arm
interleaved (4 windows per arm — under the >=5 the law asks, because each run cost minutes
at load 340-420 and the number is host-bound regardless).

| mark | base | cured | delta |
|---|---|---|---|
| exit worst | 159.8 / 133.3 ms | 182.1 / 166.4 ms | +27 ms |
| **entry worst (control C06 does not touch)** | 266.5 / 198.8 ms | 282.4 / 241.3 ms | **+29 ms** |
| exit bakes | 4 | 4 | 0 |
| entry bakes | 8 (one window 12) | 8 | 0 |

The untouched control moved by the same sign and the same magnitude, which is the definition
of host drift, and every figure here is 2-3x the author's own reading of the same mark on the
same instrument (base 66.5 / cured 60.2 ms). Three independent passes now bracket zero on
this clause: author -6.3 ms, 2026-09-17 verifier +1.5 ms, this pass +27 ms against a +29 ms
control. **No C06-attributable regression is demonstrable, and no gain is claimed.** The
clause belongs to the device instrument in §8.3.

Animation census, exit, reproduced exactly: base 5 alive at 185/186/216/300 ms and 2 at
451 ms; cured **6** alive at 213/215/216/300 ms and **3** at 451 ms. Exactly one more live
animation across the fold. That one is the board. The motion delta, as a number.

## pi

- goldens, run by this pass against the CURED dist:
  `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4257 npx playwright test --config playwright-golden.config.ts`
  -> **4 passed, exit 0**, never `--update-snapshots`. `git status` in the build worktree
  clean afterwards: no golden touched, re-minted or re-baselined.
- baked-bitmap projects against the CURED dist through `playwright-throttle.config.ts`
  (which drops its webServer when `PLAYWRIGHT_BASE_URL` is set): `filter-census-chromium`,
  `filter-census-webkit`, `theme-bake-chromium`, `theme-bake-webkit`, `wordmark-webkit`
  -> **38 passed, exit 0**. `filter-census` is the exact-match live-filter allowlist against
  the BUILT dist, so **filterBudget 9 is closed against the cured artifact**, not just source.
- pose count 4: exit bakes 4 per fold on both arms in every fold-frames window; entry 8.
  No bake dropped, no boil thinned, no filter removed, no transition shortened.

## Gates, run bare in the scratch worktree at `0bf9cb0e`

| gate | exit |
|---|---|
| `npm run test:unit` | 0 — **Test Files 66 passed (66)** · **Tests 810 passed (810)**, both lines read |
| `npm run lint:eslint` | 0 |
| `npm run lint` | 0 |
| `npm run lint:knip` | 0 |
| `npm run lint:boundary` | 0 |
| `npm run lint:tdz` | 0 |
| `npm run lint:copy` | 0 |
| `npm run lint:live-regions` | 0 |
| `npm run lint:motion` | 0 — 34 specs, every one declaring its motion state |
| `npm run typecheck:e2e` | 0 |
| `npm run typecheck:node` | 0 |
| goldens vs cured dist | 0 — 4 passed |
| baked-bitmap pi projects vs cured dist | 0 — 38 passed |
| e2e surface, both engines, scratch config -> :4257 | **1 — 166 passed, 4 failed (all webkit, all host; proven on dist-base)** |

### The e2e red, proven on the base arm (finding 3)

First run (gallery, gallery-deal, gallery-guard, board-covisibility, drawer,
masthead-alignment, sudoku-interaction, both engines, load 76 -> 138): 166 passed, 4 failed,
all WebKit — two `gallery.spec.ts` drag rows and two `masthead-alignment.spec.ts` rows. Every
failure is a 30,000 ms timeout on `page.goto` / `waitForSelector` / `addStyleTag`, or a null
`boundingBox` (`TypeError: Cannot read properties of null (reading 'x')`) — starvation
signatures, not assertions.

Proven a host fact, not the cure, by re-running the same scopes on BOTH arms:

- `masthead-alignment.spec.ts` webkit alone: **base 6 passed exit 0**, **cured 6 passed exit 0**
  (load ~380). The reds only appear when the whole surface runs in parallel.
- `gallery.spec.ts` webkit alone, interleaved at load ~360: **base 1 failed / 30 passed**
  (`drag: a flick moves exactly one card`), **cured 1 failed / 30 passed** (`drag: kenken —
  the LAST card`). Both arms red one drag row, and a DIFFERENT one each time.

The 2026-09-17 pass read 170/170 on the same specs at a quieter hour. The surface is green;
this host is not.

## The must-nots, one by one

1. **Disable `restoreBoardAnims`** — not disabled. `SWEEP` x4 per exit on the cured arm, and
   the in-wave guard reads 69-71 reveals custodied with `armedAfter` 0 on both arms. It still
   finishes every untagged animation; it only stops finishing the fold's own mover.
2. **Shorten the 520 ms fold** — `MOTION.boardFoldMs: 520` at `pencilConfig.ts:157`, outside
   the diff; the census prints `/520ms` on the mover in BOTH arms; the cured mover's `CANCEL`
   lands at 521-526 ms, i.e. it now reaches the end of its own clock instead of dying at 0.3 ms.
3. **Fix the cut by cutting the wordmark too** — the logo reads GLIDE on both arms in every
   unthrottled window (desk span 143-150 px base, 143-150 px cured; mobile 94-98 px both;
   WebKit desk 100-150 px both). At 4x the logo reads CUT on both arms equally. Nothing was
   cut to buy the board's travel.

## Deviations from the author's return

- Base chromium 1x desk: author read NO TRAVEL 6/6; this pass read 4 NO TRAVEL + 2 CUT (share
  1.000, distinct 2). Same species — no glide either way.
- WebKit exit share above the entry's in the same windows (finding 1), where the author and
  the first verifier read it inside. Host load; named, not resolved.
- Exit worst frame +27 ms against a +29 ms untouched control (finding 2), where the author
  read -6.3 ms. Host load; no regression demonstrable, no gain claimed.
- m7b in-wave absolutes 69-71 vs the author's 66-67: the press landed later. The delta is the
  claim, and the delta is 0 on both readings.

## Housekeeping

Servers on 4256 and 4257 killed. The scratch build worktree was removed; nothing was written
to `w8-app`, to any other lane, or to the main tree outside this evidence directory. No
commit, no push, no golden update.
