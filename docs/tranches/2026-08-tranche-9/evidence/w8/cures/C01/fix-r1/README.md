# C01 · REPAIR ROUND 1 — the cure moves back inside this repository, and the WebKit stamp turns

Track `bake` · worktree `.claude/worktrees/w8-bake` · branch `w8/bake` · preSha `c98e809d`
(the round-1 cure commit; the track's base is `7b0610cc`) · fix commit — see §8.
Ports 4252 (base `dist-base`) / 4253 (cured `dist`); both killed at the end.

    base   index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB
    cured  index-BUi8Y5fyFrJc.js · index.html md5 3adf593a01bb5f0e28ab2d2a991174df · 43 files / 806.4 KB

printed at both ends of every reading set (`dist-identity-after.txt`), unmoved.

Every number here is a PROXY: Playwright chromium under CDP throttle, or Playwright WebKit
with no CDP at all (no CPU rate, no link shaping, no `longtask`). No WebKit number is a Safari
number and none is an iOS claim. M19 honoured: no real Safari, no simulator, no perf-rig script.
Ten sibling lanes shared the host; `sysctl -n vm.loadavg` ran 9–42 across the session and is
stamped at both ends of every set, which is why every set is interleaved b,c,b,c and every
delta is read against BOTH arms' spreads.

## 1. WHAT THE VERIFIER FOUND, AND WHAT THIS ROUND DOES ABOUT IT

**Finding 1 — the branch delivered the WebKit half only.** The chromium headline rode on an
unreleased `pencil-boil` commit, installed as a local pack that declared version `0.12.0` while
carrying different bytes. `npm ci`, CI, or a production build would have restored stock 0.12.0
and given back the 28 encodes, silently.

**The repair: the cure moves to the app side entirely, and the library goes back to stock.**
The library's own contract was always enough — `useRasterStack` reads a non-positive `cssSize`
as "not measured yet", holds, and re-bakes the instant a real box arrives. So the app hands it
zero until `document.fonts.ready` settles. The library's post-font `clearStacks()` then clears
an empty cache and its own `bake()` is the first and only round. No library change, no release,
no pack, no lock drift.

    web/frontend/src/pencil/composables/rasterPose.ts   §THE FONT GATE — one module-level gate,
                                                        one promise, shared by all four surfaces
    HandDrawnGrid.vue · DarkModeToggle.vue (×2) · HandwrittenLogo.vue   cssSize: fontGatedBox(…)

PROOF THE LIBRARY IS STOCK, not an assertion: `node_modules/@mkbabb/pencil-boil/dist/vue.js`
is md5 `e4527557bd917949724aeca81b06ae46`, byte-identical to the main tree's registry copy;
`fontGateOpen` appears 0 times in it; and the cured build's
`dist/assets/animation-vendor-CrUpJv3U-YcU.js` is **the same name and the same md5
`248be219af42f4b079ef2070678815ab` as `dist-base`'s**. The whole cure is in the app chunk.
The shadowed tarball at `.claude/worktrees/pencil-boil-t9-packs/` is deleted.

**Finding 2 — the WebKit board-ready stamp regression is this charter's accept row.** C01
carries the fix. It is one line of the gate: **the gate opens one paint late.** Opening it
inside the `fonts.ready` callback starts four surfaces' encodes in the frame the page still
owes to its first board paint, and the board-ready stamp is a `requestAnimationFrame` that
cannot run until the encodes let go. `requestAnimationFrame(() => requestAnimationFrame(open))`
spends that frame on the page and the next on the bake. A `setTimeout` fallback opens the gate
anyway in a hidden tab, where rAF stops: the gate may delay a bake, it may never prevent one.

The regression is not merely gone. On WebKit the stamp is now **better than base**, on both
poses, spreads disjoint (§3).

**Finding 3 (watch) — a surface bakes nothing until the face lands.** Still true, by design,
and now bounded by the `setTimeout`. §6 prices the fallback window.

## 2. CHROMIUM — the half that had left the repository, read back from the branch alone

A1's banked `bake-census.mjs`, run from this evidence dir's copy of the instrument, one window
per invocation, alternating base/cured. 0 tainted windows anywhere in this document.

**chromium · 4× · Fast-3G · cold · desk 1280×800 · dpr 2 · 5 windows/arm** ·
load `{ 24.16 23.91 20.69 }` → `{ 32.69 27.17 22.67 }` · `stats-c4x-fast3g-cold-desk.txt`

| quantity | base median (spread) | cured median (spread) | Δ | outside both |
|---|---|---|---|---|
| PNG encodes | 28 (28–28) | **16** (16–16) | −12 | YES |
| discarded-round blocking ms | 986.6 (978.8–1002.2) | **0.0** | −986.6 | YES |
| whole encode bill ms | 2058.5 (2027.7–2064.7) | 1054.9 (1048.2–1057.8) | −1003.6 | YES |
| last encode ms | 4000.2 (3975.4–4104.9) | 2852.4 (2789.0–2915.1) | −1147.8 | YES |
| TBT ms | 1473 (1455–1530) | 827 (791–846) | −646 | YES |
| board-ready ms | 1421.2 (1406.3–1460.0) | 1414.6 (1390.3–1434.6) | −6.6 | no — inside |

Within 1 % of the verifier's own round-1 readings (28→16, −983.3 discarded, −636 TBT). The
charter's row-2 target is 992.8 ms discarded; base here reads 986.6 and it goes to zero.

Per surface, 5/5 windows (`double-bake-c4x.txt`): base grid 8, sun 8, moon 8, logo 4 — cured
grid **4**, sun **4**, moon **4**, logo 4. The mechanism the instrument names in every base
window is "the fonts.ready cache-clear".

**chromium · 1× · unthrottled link · cold · desk dpr 2 · 3 windows/arm** ·
load `{ 32.80 30.73 25.69 }` → `{ 21.49 27.32 24.91 }` · `stats-c1x-none-cold-desk.txt`

| quantity | base (spread) | cured (spread) | Δ | outside |
|---|---|---|---|---|
| encodes | 28 | 16 | −12 | YES |
| discarded ms | 272.4 (265.8–294.8) | 0.0 | −272.4 | YES |
| encode bill ms | 571.1 (565.4–633.3) | 297.8 (290.3–361.5) | −273.3 | YES |
| last encode ms | 828.6 (806.8–910.5) | 498.2 (495.1–586.6) | −330.4 | YES |
| board-ready ms | 84.5 (83.7–89.1) | 89.8 (88.4–95.2) | +5.3 | no — inside |
| TBT ms | 75 (69–134) | 44 (35–97) | −31 | no — inside |

**chromium · 6× · Fast-3G · cold · desk dpr 2 · 3 windows/arm** ·
load `{ 23.53 27.65 25.04 }` → `{ 17.38 24.22 24.06 }` · `stats-c6x-fast3g-cold-desk.txt`

| quantity | base (spread) | cured (spread) | Δ | outside |
|---|---|---|---|---|
| encodes | 28 | 16 | −12 | YES |
| discarded ms | 1967.3 (1478.0–2254.8) | 0.0 | −1967.3 | YES |
| encode bill ms | 3703.0 (3120.1–4697.0) | 1610.2 (1580.7–1629.9) | −2092.8 | YES |
| last encode ms | 6420.2 (5505.6–7757.7) | 3714.2 (3705.7–3878.8) | −2706.0 | YES |
| TBT ms | 3138 (2501–4099) | 1403 (1379–1482) | −1735 | YES |
| board-ready ms | 1744.8 (1566.6–1841.4) | 1562.4 (1544.5–1631.3) | −182.4 | no — inside |

**chromium · 4× · Fast-3G · WARM · desk dpr 2 · 3 windows/arm** — the charter's ≤ 20 ceiling ·
load `{ 17.03 24.04 24.00 }` → `{ 9.40 17.87 21.44 }` · `stats-c4x-fast3g-warm-desk.txt`

| quantity | base (spread) | cured (spread) | Δ | outside |
|---|---|---|---|---|
| encodes | 20 (20–28) | **16** (16–16) | −4 | YES |
| discarded ms | 800.0 (782.1–979.6) | 0.0 | −800.0 | YES |
| encode bill ms | 1835.5 (1803.3–1941.3) | 1050.8 (1048.6–1067.0) | −784.7 | YES |
| TBT ms | 1311 (1310–1339) | 733 (731–773) | −578 | YES |

The warm race A1's refuter found — a cached font sometimes beating the celestials to the gate,
so the count is 20 or 28 depending on who wins — is gone: the cured count is 16 in every window
of every regime read here.

## 3. WEBKIT — the accept row that failed in round 1, and where it stands now

**bake-census · webkit · unthrottled, NO CDP · cold · desk dpr 2 · 5 windows/arm** ·
load `{ 28.57 26.47 22.47 }` → `{ 17.21 22.70 21.63 }` · `stats-w-cold-desk.txt`

| quantity | base (spread) | cured (spread) | Δ | outside |
|---|---|---|---|---|
| grid rounds | **8**, 1240 px → 1272 px, 5/5 windows | **4**, 1272 px, 5/5 | −4 | YES |
| discarded blocking ms | 273 (261–281) | 39 (0–44) | −234 | YES |
| whole encode bill ms | 591 (575–615) | 367 (341–392) | −224 | YES |
| last encode ms | 1021 (823–1067) | 668 (623–723) | −353 | YES |
| **board-ready ms** | **424** (401–499) | **209** (193–265) | **−215** | YES |
| encodes | 20 (20–24) | 20 (16–20) | 0 | no — inside |
| TBT | NOT MEASURED (no `longtask` on WebKit) | NOT MEASURED | — | — |

Round 1 read this mark as **+76 ms, a regression**. It is now **−215 ms**. The same reversal on
the refuter's own probe, which separates the board CONDITION from the STAMP:

**cp-probe · webkit · cold · desk dpr 2 · 5 windows/arm** · load `{ 38.07 26.23 22.92 }` →
`{ 42.52 30.38 24.78 }` (the heaviest set in this document) · `cp-w-desk.txt`

| quantity | base median (spread) | cured median (spread) | Δ |
|---|---|---|---|
| condition true | 142 (128–292) | 151 (120–322) | +9 — unmoved, as it should be |
| board-ready stamp | 487 (447–898) | 258 (204–455) | −229 |
| **stamp − condition** | **355** (319–606) | **107** (82–133) | **−248** |

**cp-probe · webkit · cold · mobile 390×844 · dpr 3 · 5 windows/arm** · load
`{ 9.24 17.40 21.21 }` → `{ 19.78 19.03 21.55 }` · `cp-w-mobile.txt`

| quantity | base median (spread) | cured median (spread) | Δ | outside |
|---|---|---|---|---|
| condition true | 110 (101–168) | 122 (101–189) | +12 | no — inside |
| board-ready stamp | 391 (360–484) | 189 (157–268) | −202 | YES |
| **stamp − condition** | **282** (259–337) | **67** (55–79) | **−215** | YES |

**The accept row, read literally, is still NOT MET and was never met at HEAD.** "WebKit stamp −
condition-true ≤ 2 frames" is ≈ 33 ms; base is 355 (desk) / 282 (mobile) and cured is 107 / 67.
The cure closes 70 % of the desk gap and 76 % of the mobile one. What remains is one kept
1272²·dpr2 round that does not yield — C03's charter by name (visible-first, serialized,
yielding). Stated here as a residue with its number, not folded into a pass.

## 4. π — my own run, both engines, 1× and 4×

`pose-hash.mjs` (SHA-256 of every PNG the page encodes, taken in-page off the blob) +
`pi-compare.mjs`, 3 windows/arm each.

| set | verdict |
|---|---|
| chromium 4× Fast-3G cold desk dpr2 (`pi-c4x-desk.txt`) | **π HOLDS** — all four surfaces `cured == base LAST round true` |
| chromium 1× unthrottled cold desk dpr2 (`pi-c1x-desk.txt`) | **π HOLDS** — the trap regime |
| webkit cold desk dpr2 (`pi-w-desk.txt`) | **π HOLDS** |

Digests, unchanged from the round-1 verifier's independent run: grid `eb65657f e933f00e
6ac9fa66 f9bdc5fb` @1272 px · logo `151a026e 1d265c29 165aa06c 0c04acf5` @765 · sun `e33f39a8
410e0d7f f9c59d63 0cb30b53` @416 · moon `8e55ead1 03bc159d a0a567d0 030ed446` @416. Pose count
4 in every round of every window. Kept boxes unchanged, so no surface bakes smaller.

THE CHARTER'S TRAP, re-read: at chromium 1× the base arm's two grid rounds now compare
byte-identical as SETS once `pi-compare.mjs` splits rounds by toBlob START time rather than by
arrival order (the two rounds complete interleaved). Either way the obligation is the one the
charter wrote and it is the one measured: the cured round equals the base arm's **LAST** round.

Goldens: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config
playwright-golden.config.ts` → **4 passed, exit 0**. No `--update-snapshots`, no re-baseline.
Surface e2e through the scratch config (`instr/playwright-cured.config.ts` — `playwright.config.ts`
with the `npm run dev` webServer dropped and `baseURL` → :4253): `theme-bake-freshness`,
`filter-census`, `wordmark-integrity`, `visual-regression`, `gallery` (incl. CH-67's capture
invariant), both engines → **70 passed, exit 0**.

## 5. CHROMIUM MOBILE dpr 3 — the charter's named downstream mark

A6's banked `readiness-timeline.mjs`, cell `mob-cr-4x-f3g-cold` (390×844, dpr 3, 4×, Fast-3G,
cold), 5 windows/arm interleaved, load `{ 35.37 30.00 24.87 }` → `{ 38.23 31.54 25.85 }` —
the noisiest host window of the session, and it shows. `a6-mob-summary.txt`.

| quantity | base median (spread) | cured median (spread) | Δ | outside both |
|---|---|---|---|---|
| TBT(3000) ms | 1264 (1210–1327) | 906 (670–1026) | −358 | YES |
| longtasks in 3 s | 8 (8–9) | 6 (6–6) | −2 | YES |
| `firstBakeMs` | 3730.5 — **n = 1 of 5** | 3099.8 (2700.3–3599) | −631 against a single base window | base arm too thin to call |
| LCP ms | 3740 (1576–3752) | 3112 (2720–3620) | −628 | no — base is bimodal, two windows read an early LCP |
| board-ready ms | 1495 (1462.8–1564.3) | 1539.7 (1477.9–1561.1) | +45 | no — inside |
| `controlsInteractiveMs` | 175.2 (132.7–296.3) | 202.3 (136.3–257.5) | +27 | **no — inside both spreads** |

Two corrections to round 1's mobile reading, both against the author's own earlier claim:
`firstBakeMs` is NOT bankable here — the base arm recorded the mark in one window of five, so
there is no base median to subtract from. And `controlsInteractiveMs`, which round 1 reported
as a +38 ms regression routed to C03, sits **inside both spreads** on five interleaved windows.
It is not a move in either direction. The two rows that do carry: TBT(3000) −358 and the long
task count 8 → 6, both disjoint.

## 6. THE RESIDUE, NAMED

1. **The WebKit logo bakes twice more often than it did.** Both arms show it — base 2 windows
   of 5, cured 4 of 5 — and `pi-w-desk.txt` names the mechanism the round-1 instrument called
   "undetermined": round 1's digests are `[9e8083d8 9e8083d8 9e8083d8 03a52c87]`, three
   identical poses, which is the BLANK-BITMAP boot defect `rasterPose.ts` documents, and CH-62's
   admission gate refuses that set and calls `rebake()`. Round 2 is the inked stack in both
   arms. It costs 4 encodes / 35–44 ms and it happens more in the cured arm because the logo
   now bakes at ~226 ms instead of ~410 — earlier, therefore deeper inside WebKit's unreliable
   capture window. The gate did its job; the shown pixels are identical (§4). Pre-existing, not
   introduced, and worth a look when the capture-reliability item comes up.
2. **The hidden-tab fallback is 250 ms.** A tab that loads in the background gets no rAF, so
   the `setTimeout` opens the gate. In an ordinary foreground boot the timer never wins — the
   double-rAF fires first in every window read here.
3. **The absolute "≤ 2 frames" stamp row is unmet** (§3), by 107 ms desk / 67 ms mobile, and it
   was unmet by 355 / 282 at HEAD. That residue is C03's subject, and it now has a number.

## 7. THE MUST-NOTS

Bake at a smaller box — no: kept boxes 1272 / 765 / 416 / 416, identical both arms, digests
identical. Skip the post-font wordmark bake — no: the gate OPENS on `fonts.ready`, so the
wordmark's only bake is the post-font one, and its digests are the base arm's. Theme-strip a
`cacheKey` — no: `cacheKey` untouched at all four sites, `theme-bake-freshness` green.
Trade the draw-in's frames for the bake's — no: `BOIL_CONFIG`, the draw-in and every transition
untouched. Credited with rows 1 + 2 + 4 — no: row 2 only. `filterBudget` is 9 and its file is
not in the diff; `filter-census` green. Nothing on the REFUSED or REFUTED lists is proposed.

## 8. GATES, bare, in the worktree

| gate | exit |
|---|---|
| `npm run test:unit` | 0 — **Test Files 66 passed (66) · Tests 810 passed (810)** |
| `npm run lint:eslint` | 0 |
| `npm run lint` (prettier --check) | 0 |
| `npm run lint:knip` | 0 |
| `npm run lint:boundary` | 0 |
| `npm run lint:tdz` | 0 |
| `npm run lint:copy` | 0 |
| `npm run lint:live-regions` | 0 |
| `npm run lint:motion` | 0 |
| `npm run typecheck:e2e` | 0 |
| `npm run typecheck:node` | 0 |
| goldens vs :4253 | 0 — 4 passed |
| surface e2e, both engines, vs :4253 | 0 — 70 passed |
| `npm run build` | 0 |

## 9. WHAT THE DEVICE STILL OWES

Every number above is chromium-under-CDP or Playwright-WebKit on a host carrying ten lanes.
The encode census, the TBT and long-task moves, and above all the two WebKit board-ready
reversals want reading again on the real iOS instance through 8.3, at HEAD and with the cure,
by the same rules. The proxy iterates; the device closes.
