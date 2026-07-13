# r3-verify-new — adversarial verification of the round-2 NEW P1/P2 rows

Subject csc411 HEAD `65425697` (master); pencil-boil `da51edb` (v0.8.1). All probes rerun
by this lane, 2026-07-12. Method: refute by default; every verdict rests on my own re-run,
not a re-read of the r2 prose. Tree left clean (one throwaway Rust example created + deleted).

**Scoreboard: 9 CONFIRMED · 1 CORRECTED · 0 REFUTED.** The single correction (G1 worker) keeps
the P2 outcome but overturns r2's stated mechanism/trigger — the headline "hangs forever on a
wasm-instantiate failure" is REFUTED; the session-poison stands via a different, more robust path.

---

## (1) worker-no-respawn (G1) — CORRECTED (outcome stands, mechanism/trigger overturned)
family_hint: `worker-no-respawn`

**Structural facts CONFIRMED** — `web/frontend/src/games/{sudoku,futoshiki}/solver/useSolver.ts`:
- `ensureWorker()` caches a module-singleton `worker`; the `error` handler rejects all `pending`
  but **never sets `worker = null`** (sudoku :73-81, futoshiki :52-60). grep for
  `setTimeout|AbortController|worker = null|clearTimeout` across both files → **NONE**.
- `call()` registers the promise and `postMessage`s with **no per-call timeout** (sudoku :115-119).

**But r2's stated trigger is REFUTED by the worker source.** `solver.worker.ts:68-134` wraps the
**entire** handler — including `await ensureInit()` (the wasm instantiation) — in one try/catch. A
wasm-instantiate failure is therefore **caught** (`:130`) → `describeError` → posts back
`{ok:false, code:'WORKER_FAILURE'}` (`:132-133`). That RESOLVES the promise; it does **not** hang,
does **not** fire the Worker-level `error` event, and surfaces the existing error PaperNote + retry
(r2-gaps parity ledger). So the exact case the useSolver comment names ("the wasm module failed to
instantiate", sudoku useSolver.ts:74) does **not** route through the un-nulling error handler and
does **not** hang. r2 mis-attributed the hang to wasm-instantiate.

**The hang trigger is narrower than stated.** The Worker-level `error` event fires only on
worker-**script** module-load failure (the chunk `/assets/solver.worker-*.js` or a static import
fails to fetch/parse/link) — before the `message` listener is ever installed. Only then does
`postMessage` reach a permanently-broken worker that never replies; with no timeout that promise
hangs. That's a bad-deploy / mid-session-network-drop path, not the common wasm hiccup.

**The session-poison OUTCOME nonetheless CONFIRMED — via a different, more reliable mechanism r2
missed.** `ensureInit()` memoizes `ready = init(...)` (`solver.worker.ts:42-45`). If wasm-instantiate
fails once, `ready` is a **permanently-rejected** promise; every later call (including a user
"Retry") `await`s the same rejected `ready` → `WORKER_FAILURE` forever, and useSolver **never
recreates the worker** (worker never nulled). So the graceful path also poisons for the session:
Retry can never recover; only a full page reload does. That upholds G1's headline ("singleton
poisons for the session; recovery needs page reload") on firmer ground than the hang.

Verdict: **CORRECTED.** P2 severity holds. Reframe the finding: the defect is *no worker respawn +
sticky memoized-init rejection* (retry is futile session-wide), not *unbounded hang on
wasm-instantiate*. The unbounded-hang exists but only on the rarer worker-chunk-load failure.
Probe: read `solver.worker.ts:68-134` (try wraps ensureInit) + `useSolver.ts:73-81,115-119`
(no null, no timeout); grep above.

## (2) 0.9.0 proof-harness gap — CONFIRMED (forward-looking release gate, as framed)
family_hint: `proof-harness-cannot-reach-dom`

pencil-boil `proofs/` = boil-guard, cache, celestial, frames, prebake — run via
`node --import ./proofs/loader.mjs` (`package.json:21`). grep across `src` + `proofs` for
`ImageBitmap|getImageData|rasterizePoseStack|createCanvas|OffscreenCanvas|playwright` → **NONE**;
no `@playwright/test`/`canvas`/`jsdom` devDep. boil-guard's `installEnv` explicitly runs
`No document => the visibilitychange listener registration is skipped` (`:99`). So the harness has
no canvas/DOM; the untainted-canvas / `getImageData`-doesn't-throw identity invariant is genuinely
**unassertable in Node**. `rasterizePoseStack` doesn't exist in the tree yet (proposed 0.9.0), so
this is a *release-planning* gate, not a live defect — correct as the registry frames it
(P1-for-the-release / latent vacuous-green if shipped Node-only). CONFIRMED.

## (3) forked boil-frame primitive drift — CONFIRMED (drift real; consequential to any adoption, cosmetic to the user)
family_hint: `hoist-never-adopted`

Byte-diff of the two implementations:
- pencil-boil `boilLineFrames` — per-frame seed `seed + f * 1013` (`path.ts:249`), default serializer
  `catmullRomToBezier` (`:243`, unless `jagged`).
- app gridPaths hand-rolled — per-frame seed `... + f * 997` at **four** sites (`gridPaths.ts:359,
  395, 444, 506`), serializer **always** `pointsToLinear`.

The `997` vs `1013` stride is a real divergence in the RNG feed → different perturbation offsets on
frames ≥1 (frame 0 = shared base). Swapping the consumer onto `boilLineFrames` would change **every**
boil frame (stride *and* serializer default differ) — a pixel change, i.e. a soul-gate. So the drift
is **consequential to adoption** (the helper cannot replace the live code silently) yet **cosmetic to
the end user** (two equally-valid random boil-noise patterns; neither is "wrong"). CONFIRMED as real
+ consequential-for-swap.

## (4) 44 orphan worktree-* branches — CONFIRMED (exact)
family_hint: `branch-estate-rot`

`git branch | wc -l` → **50**. `git branch --merged master | grep -c worktree` → **44**.
`git worktree list` → **master only** (all worktree-* dirs removed, branches orphaned).
`git branch --no-merged master` → java, pass3-composition, spike/iai-callgrind, + 2 stray worktrees
(`worktree-wf_34cf008e-c2c-17`, `worktree-wf_977ec162-15b-2`). Matches G4 to the branch. CONFIRMED.

## (5) meta/social absence — CONFIRMED
family_hint: `meta-social-absent`

`curl -sS https://sudoku.babb.dev/` head carries **only** charset, viewport,
`<title>Sudoku - CSP Solver</title>` (ASCII hyphen), and one favicon link. grep of the live HTML for
`og:|twitter:|theme-color|name="description"|apple-touch` → **zero**. Tree `index.html` identical
(only the fonts comment differs). Static title is sudoku-only → a `?game=futoshiki` deep-link
unfurls as "Sudoku". CONFIRMED.

## (6) deploy-doc mismatch — CONFIRMED
family_hint: `deploy-doc-mismatch`

`web/frontend/package.json:17` deploy = `wrangler pages deploy dist --project-name=sudoku
--branch=master --commit-dirty=true` (Cloudflare Pages static; `--commit-dirty=true` ships the
working tree, not the committed SHA). The only in-repo deploy doc, `docs/precepts/infra/deploy.md`,
describes the **fourier-analysis** project: an `adnanh/webhook` HMAC-signed receiver, docker-compose
stack, `/api/health` gating, on-host `deploy-hook.sh` rollback (`:1-38`). None of that infra exists
for this Pages SPA. CONFIRMED.

## (7) 0.7.0 hoist-never-adopted + wrong seed stride — CONFIRMED
family_hint: `hoist-never-adopted`

`boilLineFrames` shipped at pencil-boil 0.7.0 (`path.ts:228`, CHANGELOG "the loop every consumer
wrote by hand, in one call"). The consumer **still** hand-rolls that exact loop —
`wobbleLinePoints` → per-frame `perturbPoints` → `pointsToLinear`, frame 0 = base — at
`gridPaths.ts:438-446` and `:496-508`. Never swapped in. And it cannot be swapped without a pixel
change: library stride `f*1013` (`path.ts:249`) vs consumer `f*997` (`gridPaths.ts:444,506`). The
hoist froze the wrong constant; a public API duplicates live app code it can't replace. CONFIRMED.

## (8) boilHoldGate zero-proof — CONFIRMED
family_hint: `proof-gap-consumed-surface`

`ls pencil-boil/proofs/` = boil-guard, cache, celestial, frames, prebake (+ loader/resolver). grep
across `proofs/` for `boilHoldGate|acquireHold|heldFrameCount|releaseHold|isBoilHeld` → **NONE**.
Per r2's consumption table these are consumed by the app (AnswerKeyLaminate acquire/release,
HandDrawnGrid + BoilDivider `heldFrameCount`), so the collapse-to-1 → freeze → re-enrol contract on
the app's hold-to-peek surface is ungated. CONFIRMED.

## (9) sudoku difficulty non-monotonic — CONFIRMED (independently reproduced, 25 deals/band)
family_hint: `difficulty-label-nonmonotonic`

I rebuilt the measurement from scratch (throwaway `examples/zzz_r3_difficulty.rs`, since deleted;
tree clean) driving the exact wasm-called path — `generate_board_with_templates_seeded` +
`measure_difficulty` (FC+FailFirst backtracks) — **25 seeded deals per (size,band)**, uniqueness via
Ac3/Mrv `max_solutions:2` budget 50M. Output:

```
N=2 easy   givens 12/12/12/12   bt 0/0/0/0            uniq 25/25
N=2 medium givens  7/ 7/ 7/ 7   bt 0/0/0/0            uniq 25/25
N=2 hard   givens  4/ 4/ 4/ 5   bt 0/0/0/0            uniq 25/25
N=3 easy   givens 61/61/61/61   bt 0/0/0/0            uniq 25/25
N=3 medium givens 35/35/35/35   bt 0/0/0/0            uniq 25/25
N=3 hard   givens 22/25/24/27   bt 0/714487/143/3170385   uniq 25/25
N=4 easy   givens 192/…/192     bt 0/0/0/0            uniq 25/25
N=4 medium givens 110/113/…/119 bt 0/204272/0/2701707 uniq 25/25   <-- up to 2.7M backtracks
N=4 hard   givens 102/105/…/107 bt 0/0/0/0            uniq 25/25   <-- 0 backtracks, FEWER givens
```

Both claims reproduce:
- **9×9 Easy ≡ Medium** in search cost (both 0 backtracks, all 25 deals).
- **16×16 Hard is EASIER than 16×16 Medium** — Hard 0 backtracks every deal at 102-107 givens;
  Medium up to 2,701,707 backtracks at 110-119 givens. Fewer givens AND less search → the label
  ordering is inverted in the shipped corpus. INVERSION CONFIRMED.
- Uniqueness 25/25 in every cell (matches r2's by-construction guarantee).

My numbers agree with r2 GEN-1 within seeded variance (r2 ran 30). CONFIRMED.

## (10) W13 band-ledger gate measured the wrong file — CONFIRMED
family_hint: `gate-scope-narrowing`

`docs/animation.md:26` (Band D, the ledger the tranche-3 README:93 names by path —
"band ledger row (`docs/animation.md` …)") still ships: `theme page-turn ~950 ms, controls-drawer
glide ~480 ms`. `grep -c "1010\|1030\|520" docs/animation.md` → **0** — the W13 re-derive never
landed. Tree truth: `useControlsDrawer.ts:61` `GLIDE_MS = 520` (drawer is 520ms, ledger says 480);
the theme gesture ships ~1029ms (per rg1/g2), ledger says ~950. The W13 wave gate row required it:
`waves/T3-W13-motion-perf-recut.md:134` — *"band ledger row re-derives ~950ms → ~1010ms"*. Yet the
owning gate discharged PASS by looking at the **wrong file**:
`evidence/w13-impl/g2-motion.md:72` — *"no pencilConfig ledger row exists to edit"* — g2 grepped
`pencilConfig.ts`/`DarkModeToggle.vue`, found no constant, called it moot, and **never opened
`docs/animation.md`**, the artifact the row names. Gate-scope-narrowing confirmed: a PASS resting on
a probe scoped narrower than the row, leaving the named ledger stale on two shipped-motion figures.
CONFIRMED.

---

## Rerunnable probe bank
```
# (1) worker
sed -n '68,134p' web/frontend/src/games/sudoku/solver/solver.worker.ts   # try wraps ensureInit -> wasm fail is CAUGHT
grep -nE 'setTimeout|AbortController|worker = null' web/frontend/src/games/{sudoku,futoshiki}/solver/useSolver.ts  # none
# (2) proof harness
cd /Users/mkbabb/Programming/pencil-boil; ls proofs; grep -rl 'ImageBitmap\|getImageData\|playwright' src proofs  # empty
# (3)(7) drift
grep -n '1013\|f \* 1013' src/path.ts ; grep -n '997' ../csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/grid/gridPaths.ts
# (4) branches
git branch | wc -l ; git branch --merged master | grep -c worktree ; git worktree list
# (5) meta
curl -sS https://sudoku.babb.dev/ | grep -iE 'og:|twitter:|theme-color|apple-touch|<title'
# (6) deploy
grep -n '"deploy"' web/frontend/package.json ; sed -n '1,20p' docs/precepts/infra/deploy.md
# (8) hold proof
grep -rln 'boilHoldGate\|acquireHold\|heldFrameCount' /Users/mkbabb/Programming/pencil-boil/proofs  # empty
# (9) difficulty  — drop the example below into csp-solver/examples/, cargo run --release --example zzz_r3_difficulty, rm
#   (full source archived in this lane's turn; 25 deals/band, generate_board_with_templates_seeded + measure_difficulty)
# (10) band ledger
grep -n 'theme page-turn\|controls-drawer glide' docs/animation.md ; grep -c '1010\|1030\|520' docs/animation.md
grep -n 'GLIDE_MS = 520' web/frontend/src/games/shared/useControlsDrawer.ts
grep -n 'band ledger row re-derives' docs/tranches/2026-07-tranche-3/waves/T3-W13-motion-perf-recut.md
grep -n 'no pencilConfig ledger row exists' docs/tranches/2026-07-tranche-3/evidence/w13-impl/g2-motion.md
```

## Net for synthesis
- One reframe needed: **G1 worker** — keep P2, but the finding is *no-respawn + sticky memoized-init
  rejection* (retry futile session-wide), NOT *unbounded hang on wasm-instantiate* (that's caught).
  The unbounded hang is real only on worker-chunk-load failure. Fix is the same: null `worker` on
  `error` + a per-call timeout/AbortController + reset the worker's memoized `ready` on respawn.
- The other nine r2 NEW rows survive adversarial re-run unchanged. Difficulty inversion and the
  band-ledger gate-scope-narrowing are the two most load-bearing and both reproduce cleanly.
