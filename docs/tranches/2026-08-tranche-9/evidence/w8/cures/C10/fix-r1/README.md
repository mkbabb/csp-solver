# T9-W8 C10 — REPAIR ROUND 1 (track "app")

2026-09-17 · worktree `.claude/worktrees/w8-app`, branch `w8/app` · preSha `83ee20b6` (the cure's
own commit) · fix commit `db43df48` · ports base 4256 / cured 4257 · verdict repaired against
`../verify-r1/VERIFY.md`.

Arms, printed at both ends of every reading set, unmoved:

    dist-base  AUDIT: build-identity — dist entry index-CydLs17Yb6Kt.js · index.html md5
               a5354065621a844ebf02a51cfc966251 · 43 files / 806.2 KB
    dist       AUDIT: build-identity — dist entry index-DjKBBtRFWqfO.js · index.html md5
               3d2e12c88f34780977ce237fdddfa8ed · 46 files / 807.7 KB

`vm.loadavg` ran 10.4–53 across the session with up to ten sibling lanes live; every set banks its
own reading at both ends (`load-*.txt`). One file changed: `web/frontend/src/App.vue`,
`scheduleWarmGallery` only.

## 5a — MATERIAL, repaired as far as the link allows

The finding: the warm copied the poster schedule (`requestIdleCallback` + a 1,200 ms floor from
mount), the main thread bakes straight through idle, and on chromium 4× cold Fast-3G the chunk was
not fetched until 2,048–2,153 ms against a board ready at 1,305–1,356 ms. A deck opened in that
1.6 s window paid +412 ms.

The repair: the warm waits on TWO conditions and the later one wins — the board's cells are on
screen, and the boot burst has drained (`load`). Each engine binds on a different one.

The first cut gated on `load` alone, as the finding suggested. MEASURED, and it broke the number
the cure owes: WebKit fires `load` about 150 ms BEFORE its board paints, so the deck's two requests
landed inside the first board's freight in 5/5 cured windows and that arm's delta fell from
−13,108 B to −2,587 B (`f-freight-webkit-cold-desk.jsonl`, the rejected cut). Hence the second
condition, plus two frames of margin after the cells appear so the fetch can never be counted as
part of the first board on either engine. The cells are read for existence only, never a rect,
because the poll runs on boot frames and a rect would flush layout on every one, and `galleryWarm`
ends the poll, so a board that never paints cannot leave it looking.

| mark (chromium 4×, cold Fast-3G, 1280×800 dpr1) | before the fix | after |
|---|---|---|
| chunk fetch starts | board-ready +800 ms | **+86 to +135 ms** (loadavg 12–18; +134 to +168 at loadavg 30) |
| chunk in hand | +1,550 ms | **+290 to +310 ms** |
| first open, pressed AT board-ready | base 955.9 → cured 1,368.1 (+412, 5/5) | base 784.0 → cured 1,081.9 (**+297.9**, 5/5 non-overlapping, loadavg 12–18) |
| first open, pressed 400 ms after ready | not level (level only at 3 s) | base 317.8 → cured **299.0 — level** |
| first open, pressed 800 ms after ready | — | base 323.3 → cured 326.3 — level |

`warm-when-cured.jsonl` (no intent at all), `f4-first-open-fast3g-desk.jsonl` and
`f4-first-open-delay400.jsonl` (the committed build) carry the rows above;
`f3-first-open-fast3g-desk.jsonl` and `f2-first-open-delay400/800.jsonl` are the same marks one
build earlier, at loadavg 25–45 (+362 ms pressed at ready, level at 400 ms).

NOT CURED, named: pressed at the instant of board-ready the cured arm still pays +297.9 ms. That
residual is the link — 150 ms of latency, a 32 KB transfer, and evaluation on a saturated thread —
and the only way to buy it back is to fetch the deck before the board, which is the byte number
this cure owes. The exposed window is now ≈0.3 s instead of ≈1.6 s, and the penalty is gone by a
400 ms delay instead of 3 s. In that adversarial probe the press lands at board-ready +87 to +121
and so beats the schedule by a few ms either way: the gain is the window's width, not the worst
case's depth.

## The cure's own marks, re-read on the fixed build

Interleaved b,c,b,c, one window per invocation, `../freight-run.mjs` over `../boot-freight.mjs`
(md5 `d1317cafe9a6d22c52081fbafa005b25`, byte-identical to attribution/A2's).

| regime | base | cured | delta |
|---|---|---|---|
| chromium 4× · Fast-3G · cold · 1280×800 dpr1 | 172,197 B / 9 req (5/5, twice) | 164,023 B / 10 req (5/5, twice) | **−8,174 B, +1 req** |
| chromium 4× · Fast-3G · cold · 390×844 dpr3 | 172,197 / 9 (5/5) | 164,023 / 10 (3/5) · 149,387 / 9 (2/5, the double-font draw) | **paired −8,174 B** |
| chromium 4× · unthrottled · cold · 1280×800 dpr1 | 183,227 / 11 (6/6) | 170,121 / 11 (3/6) · 174,745 / 12 (3/6) | median **−10,794 B** |
| webkit · unthrottled · cold · 1280×800 dpr1 (PROXY; no CPU rate, longtask NOT MEASURED) | 210,281 / 15–16 (5/5) | 197,173 / 16 (4/5) · 201,813 / 17 (1/5) | median **−13,108 B** |

Static census, `../census-bytes.mjs` (md5 `bb7758014a89d69efb236c4190aaf8d6`): the boot graph at the
edge (entry js + render-blocking css + vue-vendor + animation-vendor + app-shared) 405,927 raw /
113,542 brotli / 130,511 gzip → 375,246 / 106,860 / 122,354. The gzip delta (−8,157 B) agrees with
the measured wire delta (−8,174 B) to 17 B, the extra request's headers.

Board-ready: −35.0 ms desk Fast-3G (1,455.6 → 1,420.6) and −15.2 ms on the re-read at loadavg 7–11
(1,393.5 → 1,378.3), −35.4 ms mobile Fast-3G (1,399.1 → 1,363.7), −27.6 ms unthrottled (424.9 →
397.3). Every one of them is INSIDE the arms' overlap with up to ten lanes live. NOT CLAIMED. The
cure is a byte cure.

`f4-*` is the committed build's re-read (the guard that ends the poll landed after the first
reading set): Fast-3G desk 172,197 / 9 → 164,023 / 10 and WebKit 210,281 / 15 → 197,173 / 16, the
same figures, gallery chunk never before ready in either engine.

## 5b — REPORTING, restated

The unthrottled and WebKit byte deltas are not deterministic per arm. `useSudoku` rolls the opening
tier uniformly and only 9×9 HARD is declared `bank`, so the bank rides on a 1-in-3 draw: 3/6
unthrottled windows here, 4/6 in verify r1, 2/6 in the author's first return. The honest statement:
**−8,174 B always (the split), plus ≈4,624 B on the two thirds of deals that roll livegen, on links
fast enough for the bank to land before ready.** On Fast-3G the bank lands after ready in both arms
(0/5, 0/5) and only the constant applies.

## 5c — WATCH, re-read at a calmer load

`../fold-frames.mjs`, chromium 4× warm 1280×800 dpr2, 3 interleaved invocations per arm, loadavg
37.8 → 18.7 (`fold-summary.txt`):

    entry cycle0 base : worst med 117.5 [108.7, 117.5, 199.3] long33 [2,4,2] long50 [2,3,2] bakes [8,16,8]
    entry cycle0 cured: worst med 108.7 [108.1, 108.7, 133.8] long33 [2,2,2] long50 [2,2,2] bakes [8,8,8]

The 12-bake cured window did not recur; this time a BASE window read 16 bakes and 4 long33, which
settles it as the host rather than the cure. Cured bakes are 8/8/8 and 4/4/4 on every leg, long33
and long50 identical or lower than base, animation census keys identical arm to arm
(`opacity@game-gallery` included), nodes 1,776 → 1,779 (the split's three head elements).
**The charter's π obligation holds: the first gallery open starts no long frame attributable to
chunk evaluation.**

## Gates, bare, in the worktree

    npm run test:unit          exit 0   Test Files 66 passed (66) · Tests 810 passed (810)
    npm run lint:eslint        exit 0      npm run lint:live-regions  exit 0
    npm run lint               exit 0      npm run lint:motion        exit 0
    npm run lint:knip          exit 0      npm run typecheck:e2e      exit 0
    npm run lint:boundary      exit 0      npm run typecheck:node     exit 0
    npm run lint:tdz           exit 0
    npm run lint:copy          exit 0
    golden battery (:4257)     exit 0   4 passed, never --update-snapshots
    e2e gallery set (:4257)    exit 0   112 passed — gallery, gallery-deal, gallery-guard, spoken-gallery
    e2e surface set (:4257)    exit 0   78 passed — filter-census, visual-regression, theme-bake-freshness,
                                        viewport-law, session-substrate, board-covisibility
    e2e surface set 2 (:4257)  exit 0   68 passed — a11y, throttled-void, permalink, font-census,
                                        sudoku-interaction

Both engines through `../playwright-c10.config.ts` (webServer dropped, baseURL → :4257).

## Files here

`when.mjs` — the gate probe: DOMContentLoaded, `load` and board-ready on one cold load, which is
what chose the two conditions. `first-open.mjs`, `warm-when.mjs` — verify r1's probes, copied
byte-identical. `f-*` = the rejected `load`-only cut's readings, kept because they are the proof
that gating on `load` alone breaks the WebKit arm. `f2-*` / `f3-*` = the landed build's.
`fold-*.jsonl` + `fold-summary.txt` = the A7 set. `census-*-fix.jsonl` = the static census.
`load-*.txt` = `sysctl -n vm.loadavg` at both ends of every set. Servers on 4256/4257 were killed
at the end.
