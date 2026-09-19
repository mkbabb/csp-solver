# C01 repair round 2 — the wordmark waits for its face to PAINT

2026-09-17 · track `bake` · worktree `.claude/worktrees/w8-bake`, branch `w8/bake` ·
preSha `67545682` · fix commit `854b562b` · ports 4252 (base) / 4253 (cured).

The non-author verification at `../verify-r2/README.md` ruled REPAIR on one finding and named
one residue. Both are closed here, and closing the first one moved the mechanism: the
verifier's own remedy does not hold, and the measurement that shows why is in §2.

## The arms

| arm | served | dist-identity |
|---|---|---|
| base | :4252 `dist-base` | `index-9rZPzI5DEcpe.js` · index.html md5 `fa3d1af9870916cc728de11e97f57a90` · 43 files / 806.1 KB |
| cured | :4253 `dist` | `index-DOFGihfY7ZtC.js` · index.html md5 `7241f47bba33881658ad9e63061fa9e3` · 43 files / 807.4 KB |

Both printed at both ends of every reading set (`dist-identity.txt`) and both verified on the
WIRE (`curl … | md5` equals the index.html md5 of the arm the port serves).

`dist/assets/animation-vendor-CrUpJv3U-YcU.js` is the same NAME and the same md5
`248be219af42f4b079ef2070678815ab` in both arms, and `node_modules/@mkbabb/pencil-boil/dist/vue.js`
is md5 `e4527557bd917949724aeca81b06ae46` — the registry 0.12.0, `fontGateOpen` absent. The
cure is entirely app-side and the library is untouched.

**A TRAP worth banking: a comment-only edit MOVES the entry hash.** Two builds of the same
source are byte-identical (verified), but rewording a comment changed
`index-Byg5dfXqjLsz.js` → `index-DOFGihfY7ZtC.js` with the same 807.4 KB. So every reading in
this dir was re-taken after the last comment edit; the arm measured is the arm committed.
**A second trap:** Tailwind v4 scans every directory the repo does not ignore, so a scratch
`--outDir` or a renamed `node_modules` copy left in the tree inflates the CSS (93.7 kB →
229.0 kB) and moves the entry hash. Build with a clean tree or the arm is not the arm.

## 1. The residue, closed: `node_modules` is the chair's SYMLINK again

The verifier found the worktree's `node_modules` a real directory whose
`.package-lock.json` still recorded `"resolved": "file:…/mkbabb-pencil-boil-0.12.0.tgz"`.
It is now `web/frontend/node_modules -> <main tree>/web/frontend/node_modules`, exactly as the
chair made it, and the private install is gone. Proven harmless before it was adopted: HEAD
built through the symlink gives `index-BUi8Y5fyFrJc.js` / md5 `3adf593a01bb5f0e28ab2d2a991174df`
/ 806.4 KB — byte-for-byte the tree the verifier read. (An `npm ci` from the committed lock was
taken first and gave the same build with registry provenance; the symlink then reproduced it,
so the private copy was deleted rather than kept.)

## 2. The finding, closed — and the verifier's remedy measured, not assumed

The verifier found the wordmark baking a BLANK round in nearly every cold WebKit load, and
prescribed: drop `fontGatedBox` from `HandwrittenLogo.vue`, which "restores the base arm's
single correct WebKit round and moves no chromium number."

**Dropped, rebuilt, measured: it does not restore it.** webkit · unthrottled · cold · desk
dpr2, 5 + 5 interleaved, raws at `raw/w-diag-nogate/`:

| arm | logo encodes | what round 1 was |
|---|---|---|
| base | 4 in 5 of 5 | — |
| gate dropped | **8 in 5 of 5** | 3,152 B × 3 + one real, 31,699 B discarded, 55–216 ms |

So the wordmark's single round in the base arm was never a property of the wordmark. It was
CONTENTION: the grid's discarded 1240 px round held the main thread long enough that the
logo's bake always fell on the late side of a race. C01 hands that time back, and the race
comes out.

**What the race actually is.** The same window, read at event grain
(`raw/w-diag-nogate/cured-w5.jsonl`):

```
fetch:start  /assets/fraunces-subset-…woff2   t=57
fonts.ready                                   t=179
fetch:end    /assets/fraunces-subset-…woff2   t=211
poseSvg logo ×4                               t=257  svgBytes=20432   ← round 1
toBlob:end   logo 3152 B ×3 · 22243 B ×1      t=310, 348
poseSvg logo ×4                               t=370  svgBytes=20432   ← round 2
toBlob:end   logo 22243/22252/22095/22205 B   t=846
```

The pose SVG is IDENTICAL in both rounds — 20,432 B, the face already inlined. What differs
is the RASTER. A pose blob is drawn through an `<img>`, which is a document of its own; the
`@font-face` inside it loads there asynchronously, and during `font-display`'s block period
the text paints NOTHING — not a fallback glyph, no ink. A round started 46 ms after the woff2
landed encoded three blank poses; a round started 85 ms after it painted all four. Neither
`document.fonts.ready` nor `FontFace.load()` closes that gap — both were measured
(`raw/w-diag-decodeonly/`, blank round still in 2 of 3 windows): they settle the PAGE's font
set and the raster reads the IMAGE's.

**The cure, therefore, is the thing itself.** `warmBakeFace()` rasters one 16 px image
carrying this face and one glyph and reads the pixels back, one attempt every 16 ms inside a
192 ms budget, before `bakeFace()` resolves. No ink means the face has not landed in an image
document yet. It can only delay the bake, never prevent one: the budget expires and the bake
proceeds, the wait is a TIMER so a background tab (where `requestAnimationFrame` stops) still
gets its wordmark, and a refused decode or read-back falls through the `catch`.

**Measured, webkit · unthrottled · cold · desk dpr2, 10 + 10 interleaved** (`raw/w-cold-desk/`
+ `raw/w-cold-desk-b/`, pooled in `stats-w-cold-desk-pooled.txt`):

| logo rounds | base | cured |
|---|---|---|
| single (4 encodes) | 9 of 10 | **10 of 10** |
| double, first blank | 1 of 10 | **0 of 10** |

The regression the verifier ruled on (cured 8 of 8) is gone, and the base arm's own
intermittent blank round is gone with it.

## 3. The numbers, all against the arms' own spreads

Instruments are A1's banked copies run unmodified — only `--port` differs — through
`interleave.sh` (b,c,b,c…), medians with spreads, taint 0 in every window of every set,
`sysctl -n vm.loadavg` stamped at both ends of each set inside each `stats-*.txt`. **This was
the loaded end of the session: up to ten sibling lanes, load 31 → 97.** Interleaving cancels
the drift; it cannot narrow a spread.

### chromium · 4× · Fast-3G · cold · 1280×800 dpr 2 · 5 + 5 · load 31.6 → 96.8

| quantity | base (spread) | cured (spread) | Δ | outside both spreads |
|---|---|---|---|---|
| encodes | 28 (28–28) | 16 (16–16) | −12 | YES |
| discarded ms | 1599.8 (1423.3–1720.7) | 0.0 | −1599.8 | YES |
| whole encode bill | 3241.0 (2703.9–3451.6) | 1654.2 (1189.8–1844.6) | −1586.8 | YES |
| last encode | 5764.0 (5030.7–5882.6) | 3858.9 (3140.5–4094.6) | −1905.1 | YES |
| TBT | 2660 (2099–2732) | 1480 (1033–1674) | −1180 | YES |
| board-ready | 1528.3 (1517.3–1664.8) | 1611.7 (1515.4–1635.5) | +83.4 | no — not a move |

Per surface, 5/5 in both arms: base `grid 8 · sun 8 · moon 8 · logo 4`, cured
`grid 4 · sun 4 · moon 4 · logo 4` (`double-bake-c4x.txt`). The charter's row 2 target is
992.8 ms of discarded blocking; this host reads the same round at 1,599.8.

### chromium · 1× · unthrottled · cold · desk dpr 2 · 3 + 3 · load 67.9 → 47.5

encodes 28 → 16 · discarded 426.0 (394.7–445.1) → 0 · bill 850.1 → 467.4 · last encode
1250.6 → 808.0 · TBT 336 → 208. All five disjoint. board-ready +13.0, inside the spread.
The charter's π TRAP is visible here in the base arm: 1 of 3 windows has the grid's two rounds
NOT byte-identical (`double-bake-c1x.txt`), which is why the cure keeps the SECOND round's
moment and proves it by digest rather than by byte count.

### webkit · unthrottled, NO CDP · cold · desk dpr 2 · 10 + 10 · load 72.4 → 54.8

| quantity | base (spread) | cured (spread) | Δ | outside both spreads |
|---|---|---|---|---|
| board-ready | 854.5 (682–1243) | 421.5 (359–482) | −433.0 | YES |
| whole encode bill | 1098.0 (621–1634) | 595.5 (496–784) | −502.5 | no — see below |
| encodes | 20 (16–24) | 16 (16–16) | −4 | no — see below |
| discarded ms | 449.0 (0–494) | 0.0 | −449.0 | no — see below |

**Read this honestly.** Under a host at load 54–97, 2 of 10 base windows had the grid's box
land before its first bake, so the base arm itself ran single-round in those two (16 encodes,
0 discarded) and its spread reaches the cured value. The median moves and the cured arm is
invariant — 16 encodes and 0 discarded in 10 of 10 windows, every window of every WebKit set
in this dir — but the strict disjointness rule is not met on those three rows at this host,
and they are reported as not-disjoint rather than claimed. The same set read earlier on a
quieter host (load 22–33, behaviourally identical build) was disjoint: encodes 20 (20–24) → 16,
discarded 380 (305–429) → 0, bill 852 → 514, board-ready 619 → 366.

The categorical row does not depend on spreads — per surface, 10 base and 10 cured windows:

| surface | base | cured |
|---|---|---|
| grid | 8 encodes in 8 of 10, 4 in 2 of 10 | **4 in 10 of 10** |
| logo | 4 in 9 of 10, 8 in 1 of 10 | **4 in 10 of 10** |
| sun / moon | 4 in 10 of 10 | 4 in 10 of 10 |

### webkit · cp-probe · desk dpr 2 · 5 + 5 · load 42.0 → 49.2 (`cp-w-desk.txt`)

condition-true 232 → 245 (unmoved, inside both spreads) · stamp 799 → 417 ·
**gap 562 (503–619) → 169 (154–186), disjoint.** The board is ready at the same moment in both
arms; the cure stops the bake sitting on the stamp. The charter's accept row (≤ 2 frames ≈
33 ms) is NOT met at 169 ms and HEAD misses it by 562 — banked as a residue with its number
and routed to C03, whose subject is scheduling among the KEPT rounds.

## 4. π

`pose-hash.mjs` + `pi-compare.mjs`, 3 windows per arm, three regimes, all re-run against the
committed build: `pi-c4x-desk.txt`, `pi-c1x-desk.txt` (the charter's 1× trap), `pi-w-desk.txt`.
Every surface, every regime: **`cured == base LAST round true`**, exit 0, verdict
"π: HOLDS". Boxes unchanged in both arms — grid 1272 (1240 appears only inside base's
discarded round), logo 765 chromium / 762 webkit, sun and moon 416. Nothing bakes smaller.

`playwright-golden.config.ts` against :4253, no `--update-snapshots`: **4 passed, exit 0**, and
`git status` clean afterwards — no golden file touched. `filterBudget` 9 (`filter-census` green
both engines) and `BOIL_CONFIG.frameCount` 4, untouched; pose count 4 on every surface in both
arms.

## 5. Gates, bare, in the worktree at `854b562b`

| gate | exit |
|---|---|
| `npm run test:unit` | 0 — **Test Files 66 passed (66)**, **Tests 810 passed (810)** |
| `npm run lint:eslint` · `lint` · `lint:knip` · `lint:boundary` · `lint:tdz` | 0 |
| `npm run lint:copy` · `lint:live-regions` · `lint:motion` | 0 |
| `npm run typecheck:e2e` · `typecheck:node` · `npx vue-tsc -b` | 0 |
| goldens → :4253 | 0 — 4 passed |
| `filter-census` + `wordmark-integrity` + `theme-bake-freshness`, both engines → :4253 | 0 — 44 passed |
| `gallery` (incl. CH-67) + `visual-regression` + `font-census` + `masthead-alignment`, both engines → :4253 | 0 — 86 passed |

One red appeared and did not survive: `masthead-alignment` M18 (webkit) failed once in a
combined run at load ~61 and passed on re-run, and the SAME suite run against the BASE arm at
that load redded a different spec (`gallery` keyboard step, chromium). A host fact, named
rather than swept.

## 6. The must-nots, one by one

| clause | reading |
|---|---|
| bake at a smaller box | NO. Grid 1272, logo 765/762, sun/moon 416 — identical in both arms, printed per encode in the π runs. |
| skip the post-font wordmark bake | NOT SKIPPED. The wordmark's one round is the one with the real face, and its digests equal base's in all three regimes. What is gone is the round with NO face in it. |
| theme-strip a `cacheKey` | NO. No cacheKey line moves in this commit. |
| trade the draw-in's frames for the bake's | NO. Nothing touches leg 1; `lint:motion` 0. |
| credited with rows 1 + 2 + 4 | NOT CLAIMED. Row 2 only; the stamp-condition residue goes to C03 with its number. |
| a bake dropped / boil thinned / filter removed / transition shortened / DPR lowered | NO on all five: `frameCount` 4, `filterBudget` 9, pose count 4, the DPR cap untouched. |
| the REFUSED list | Nothing on it is approached. The added warm-up rasters a 16 px throwaway; it is not a pose, not a bake, and it is never shown. |
| the REFUTED list | Nothing re-proposed. |

## 7. What did not land, and what is held for the device

- The charter's `stamp − condition-true ≤ 2 frames` is NOT met (169 ms cured, 562 base).
- `firstBakeMs` / mobile dpr-3 (A6 `readiness-timeline.mjs`) were NOT re-read in this round;
  the charter's "`firstBakeMs` moves and the move is printed" stands UNDEMONSTRATED, as the
  verifier left it.
- Every number here is Playwright WebKit or headless chromium on one loaded laptop. No number
  here is a Safari number and none is an iOS claim; 8.3 closes the budgets on the device.
