# C01 · NON-AUTHOR VERIFY, ROUND 3 — VERDICT: ACCEPT

Track `bake`, worktree `.claude/worktrees/w8-bake`, branch `w8/bake`, HEAD `854b562b` (unmoved;
`git status` clean at both ends). The verifier wrote no product file and made no commit. Both
preview servers (:4252 base, :4253 cured) were started and killed inside this session. Real
Safari and iOS were not touched (M19). Every number below is Playwright.

## THE ARMS, proven not asserted

- `dist-base` — `index-9rZPzI5DEcpe.js` · index.html md5 `fa3d1af9870916cc728de11e97f57a90` ·
  43 files / 806.1 KB. Valid as the pre-cure arm: `58014efd..7b0610cc` touches no `src/` and
  only moves the `wrangler` devDependency, which is not bundled.
- `dist` — REBUILT BY THE VERIFIER from HEAD `854b562b` (`npm run build`) and byte-identical to
  the author's tree (`diff -rq` empty): `index-DOFGihfY7ZtC.js` · md5
  `7241f47bba33881658ad9e63061fa9e3` · 43 files / 807.4 KB · CSS 92 KB, not inflated.
- On the wire at both ends of every reading set: `curl | md5` returns those two md5s, unmoved.
- Library is STOCK: `@mkbabb/pencil-boil` 0.12.0 resolved from `registry.npmjs.org` in
  `package-lock.json`, `dist/vue.js` md5 `e4527557bd917949724aeca81b06ae46`, `fontGateOpen`
  absent from it; `animation-vendor-CrUpJv3U-YcU.js` same name and md5 in both arms.
  `node_modules` is a symlink into the main tree. Round 2's install-metadata residue is closed.
- Instruments: `instr/{bake-census,double-bake-proof,cp-probe}.mjs` diff EXIT 0 against the
  banked 8.1 originals under `attribution/A1/` and `attribution/refute/A1/`. Only `--port`
  differs between arms. The mobile round census lives in `stats-c4x-cold-mobile.txt`; its `double-bake` text was
dropped to hold this directory under the wave's 40 KiB cap (12 of 12 cured surface rows read
"single round", 12 of 12 base rows read 8 encodes).

`interleave.sh` here differs from the author's only in its evidence root
  (code diff exit 0).

## THE NUMBERS, re-measured (interleaved b,c,b,c…, 0 tainted, median, own-spread test)

chromium · 4× · Fast-3G · cold · 1280×800 dpr 2 · 5+5 · load 13.73 → 18.27

| quantity | base | cured | Δ | outside both spreads |
|---|---|---|---|---|
| encodes | 28 (28–28) | 16 (16–16) | −12 | YES |
| discarded ms | 1179.5 (1139.1–1433.3) | 0.0 | −1179.5 | YES |
| encode bill ms | 2454.3 (2244.4–2693.0) | 1226.6 (1122.7–1613.0) | −1227.7 | YES |
| last encode ms | 4547.5 | 3051.8 | −1495.7 | YES |
| TBT ms | 1851 (1521–2073) | 965 (881–1419) | −886 | YES |
| board-ready ms | 1448.5 | 1464.9 | +16.4 | no — NOT A MOVE |

webkit · unthrottled, no CDP · cold · desk dpr 2 · 5+5 · load 18.87 → 25.66: encodes 20 → 16,
discarded 275.0 → 0.0, bill 629 → 417, last encode 1055 → 779, **board-ready 444 → 290**, all
outside both spreads. TBT NOT MEASURED (no `longtask` on WebKit).

chromium · 4× · Fast-3G · cold · **mobile dpr 3** · 3+3: encodes 28 → 16, discarded 714.5 → 0,
bill 1514.7 → 858.5, TBT 1159 → 767, all disjoint; board-ready +24.9, inside the spread.

chromium · 4× · Fast-3G · **warm** · desk · 3+3: cured 16 encodes in 3 of 3 — the charter's
"warm ≤ 20" holds. The warm DELTA is not claimable: the base arm is bimodal there (16–28) and
its spread reaches the cured value. Reported as not a move.

Rounds per surface (`double-bake-proof.mjs`): base grid 8 · sun 8 · moon 8 · logo 4 at
chromium 4× in 5 of 5; base grid 8 (1240→1272 re-key) at WebKit in 5 of 5. Cured: grid 4 · sun
4 · moon 4 · logo 4 in 5 of 5 on BOTH engines, every regime measured. No box shrank: grid 1272
desk / 1092 mobile, logo 765 chromium / 762 webkit, celestials 416 desk / 192 mobile, in both
arms.

ROUND 2's FINDING IS CLOSED. The wordmark's four PNGs in the cured arm are the real stack in
5 of 5 WebKit windows — byte multiset {22243, 22252, 22095, 22205} at 762 px, identical to the
base arm's; no 3,152 B blank appears anywhere in the cured arm, either engine (`logo-bytes.txt`).

## π

Goldens: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config
playwright-golden.config.ts`, no `--update-snapshots` — 4 passed, EXIT 0, worktree clean after.
Per-pose SHA-256 (`pose-hash.mjs` + `pi-compare.mjs`, 3 windows per arm) at chromium 4× desk,
chromium 1× desk and WebKit desk: every surface `cured == base LAST round true`, EXIT 0,
"π: HOLDS". The charter's traps reproduce in the BASE arm and the cure keeps the second round's
moment, not the first round's bytes: WebKit base grid rounds `byte-identical as SETS: false` in
3 of 3 π windows. `FILTER_BUDGET_TOTAL` = 9 (file untouched by the diff), ceiling 14,
`BOIL_CONFIG.frameCount` = 4, pose count 4 on every surface in both arms.

## GATES (bare, exit codes read from the shell)

`test:unit` 0 — **Test Files 66 passed (66) · Tests 810 passed (810)**, both lines read ·
`lint:eslint` 0 · `lint` 0 · `lint:knip` 0 · `lint:boundary` 0 · `lint:tdz` 0 · `lint:copy` 0 ·
`lint:live-regions` 0 · `lint:motion` 0 · `typecheck:e2e` 0 · `typecheck:node` 0 ·
goldens → :4253 exit 0 · `filter-census` + `wordmark-integrity` + `theme-bake-freshness` +
`font-census`, both engines → :4253: 48 passed, exit 0.

`visual-regression` + `gallery` + `masthead-alignment`, both engines → :4253: 82 passed, exit 0
in 3 of 5 runs. HOST FACT, PROVEN ON BOTH ARMS: the reds are always the same shape — the
negative-control leg of `masthead-alignment.spec.ts:147`/`:194`, which does
`page.addStyleTag(...)` and reads the probe on the next statement with no settle, returning
EXACTLY 0 (the injected sheet had not applied). Under matched pressure (`--repeat-each=4
--workers=8`, webkit, load 137–175) the BASE arm redded M17 twice with that identical
`Expected: > 0.5 / Received: 0` while the CURED arm passed 24 of 24 in both rounds. The positive
assertions — the ones that read the real layout — never redded on either arm in any run. Tally
across all my runs at load 50–175: 3 reds on cured, 2 on base, always that leg. Named, not swept.

## THE MUST-NOTS, one by one

- *Bake at a smaller box* — NO. Every baked box is identical in both arms (above). The
  `captureSide` seed 620 → 0 removes a bake at a box the layout never had; it does not shrink a
  bake. `shrink captureSide` on the REFUSED list is not what happened.
- *Skip the post-font wordmark bake* — NO. The wordmark bakes, once, at the real box, with
  base-identical per-pose digests in all three π regimes.
- *Theme-strip a `cacheKey`* — NO. `grid-${boardSize}-${subgridSize}-${isDark ? 'd' : 'l'}`
  is unchanged in the diff.
- *Trade the draw-in's frames for the bake's* — NO. Leg 1 is untouched; `lint:motion` 0 and
  `visual-regression`'s draw-in/boil spec green on both engines.
- REFUSED list checked by name: draw-in, DPR cap, `frameCount`, `grain-static`, `captureSide`,
  `DEFAULT_POSE_CACHE`, theme-independent grid key, dropping a celestial, compositor-only whirl,
  the Bloom, boil during the flip, woff2 subsets, `bakeFace()` (warmed, not deleted), stubbed
  `toBlob` — none re-proposed. REFUTED list: none re-proposed.

## RESIDUES CARRIED, not blockers

1. The charter's accept row **WebKit stamp − condition-true ≤ 2 frames is NOT MET**, as the
   author reports. Re-measured, `cp-probe.mjs` verbatim, 5+5 interleaved, webkit cold desk dpr2,
   load 127.9 → 88.0: base gap median **473 ms** (428–640), cured **144 ms** (105–166), stamp
   699 → 368, condition-true 207 → 224 (unmoved). A large disjoint improvement that still misses
   33 ms by 111. C03 owns it; C01 must not be credited with closing it.
2. `warmBakeFace`'s 192 ms budget counts TRIES, not wall clock, and `await img.decode()` carries
   no timeout of its own. It adds no failure mode the real bake does not already carry (the same
   blob decode gates the real raster), but the charter's "it can only delay a bake, never prevent
   one" holds only while `decode()` settles.
3. `openFontGate()` opens on `document.fonts.ready`; there is no wall-clock escape if that
   promise never settles. The spec guarantees it settles, including on failure. Named for the
   record.
