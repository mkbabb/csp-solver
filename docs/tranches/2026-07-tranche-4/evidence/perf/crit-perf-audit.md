# crit-perf-audit — refute-by-default pass over p1/p2/p3

**Lane:** crit-perf-audit · Tranche IV pre-execution perf-audit critique.
**Targets:** p1-safari-load.md, p2-solver-backend.md, p3-wasm-facilities.md.
**Box during THIS pass:** Mac17,7, 18 logical cores, macOS 25.4. **loadavg 26.5 → 9.7 over the run**
(18-core box, heavily oversubscribed at start). Every rerun stamps its own loadavg. Owner `:3001`
untouched throughout (verified LISTEN pid 41133 pre+post); my preview served on `:4501`, killed after.
No source edits: `git status --short` = only pre-existing `D CONTRIBUTING.md`. Fresh probe builds banked
in `crit-node-base/`, `crit-node-simd/`; preview log `crit-preview.log`.

**Method:** re-ran each lane's top claims on its own banked recipes; rebuilt one wasm arm from source;
tested p1's central CPU-method mechanism directly. Verdicts CONFIRMED / CORRECTED / REFUTED per row.

---

## THE HEADLINE QUIET-BOX FINDING (applies to all three lanes)

**No lane ran on a quiet box, and only p2 disclosed it.** p2 stamped load 8–14 (and defended with
deterministic node/alloc oracles + best-of-min ratios — the right discipline). **p1 and p3 disclosed
NO loadavg.** This pass reproduced the box at load 9.7–26.5. Consequence, proven below: `top -l 3 -s 1`
**times out (12 s) even on a nearly-idle process** on this box — which both (a) reproduces p1's
"top times out" observation and (b) refutes p1's *interpretation* of it (the timeout is a loaded-box
scheduling artifact, not a property of the "saturated" GPU process). Wall-clock figures (p1 fps, p2 GAC
wall ratio) are load-sensitive and drift on rerun; deterministic figures (node counts, alloc counts,
wasm bytes) reproduce byte-exact.

---

## p1-safari-load — 7 dispositions

### Row 1 — CPU gate re-anchor [NEW-ROW] → **CORRECTED** (the flagship; overclaims disposition + recommendation)

**Reran the banked `cpu-crossmethod.mjs` (load ~10–15):** GPU pid idle `ps 721→595`,
**`cputime_delta 574`**, `top` = `ETIMEDOUT`. Solved-state `cputime_delta 512.8`. Boil confirmed live
(4 `.boil-frame-layer` siblings flipping, `grain-static` filter, 81 cells).

- **CONFIRMED (measurement):** the playwright-webkit GPU process genuinely consumes **~5.7–6 cores**
  (my 574%, p1's 623–647%) at idle — decisively **not 2 cores**. `cputime-delta` is the accounting
  arbiter (real CPU-seconds / wallclock; if anything *under*-reports under load since `sleep` dilates the
  denominator). So crit-safari's binding "**208% top-interval ≈ 2 cores**" is a **top under-count** of
  the playwright surface, not its true consumption. p1 is right to challenge it. Solved-state stays
  GPU-pinned (my 512.8% ≈ p1's 514%) — CONFIRMED.
- **CORRECTED (disposition):** marking this **[NEW-ROW] is wrong — it is a FOLD-INTO-W1** gate-wording
  correction. W1 already frames the CPU gate as **two surfaces** ("208% top-interval / **194% real
  Safari** ≈ 2 cores") and its residual-risks already say "the 60 fps target is a playwright-webkit
  number, cross-checked only by CPU against real Safari (~2 cores)... verified by the owner." p1 corrects
  one number inside an existing W1 gate; it does not open a net-new row.
- **CORRECTED (recommendation — the load-bearing kill):** p1 recommends **re-anchoring the gate headline
  to ~640% playwright**. **Reject.** That is the *headless-software-raster* surface, which p1's OWN data
  puts at **3.3–3.7× the device** (real Safari ~175% by p1, ~194% by s1). The owner's edict is about the
  **owner's Safari**, whose truth is ~2 cores — and **p1's own real-Safari 175% CONFIRMS W1's 194%
  anchor.** The correct fold: **keep the real-Safari device anchor (~175–194% ≈ 2 cores)** as the gate
  headline; **drop the confused "208% top-interval" clause** (it is neither the playwright consumption
  ~640% nor the device ~194%); footnote playwright ~6 cores as the headless proxy only. The **fix
  (bitmap-pose-cache) is unchanged** — p1 concedes this.
- **DING (method):** p1's inference "top times out → 208% is a tool artifact" is unsound. **I reproduced
  `top -l 3 -s 1` timing out at 12 s on the owner's *idle* node pid (0.0% pcpu)** on this loaded box.
  The timeout is a loaded-box artifact; it cannot discredit crit-safari's quiet-box top-interval. (Note
  lib.mjs's own comments bake in "ps pcpu ~3× inflated per crit-safari" — the harness assumes the very
  correction the writeup then reverses.)

### Row 2 — 16×16 deal = D7/W8 mount idle-chunking [FOLD-W1] → **CONFIRMED**
Correctly W1-owned (D7 explicitly "fold vs retire-with-measurement"). The 680 ms webkit-freeze / 100–117 ms
chromium-@4× evidence is legitimate new input to D7's fold call. Not a re-tread — marked FOLD-W1. Accepted.
(Render hitch numbers are wall-clock/load-sensitive, unverified here, but the fold argument stands on the
deterministic mount-cost class already in the record.)

### Row 3 — WebKit grid raster-latency-bound [FOLD-W1] → **CONFIRMED**
Matches s1/crit and W1's own mechanism; the boil-flip mechanism reproduced in Row 1's run. W1 owns the
cache. Correctly ceded.

### Row 4 — Toggle/Bloom degrades first under Chromium load [REJECTED-quality] → **CONFIRMED**
Correct quality rejection: the only lever (thin/pre-raster the live warp) moves pixels. Respects the
absolute quality constraint. Banked as a datum, no action. Correct.

### Row 5 — Cold-load unaffected by precache death [CLEAN] → **CONFIRMED (plausible)**
W3 territory, first-party, no W1/W5 action claimed. Not reran (needs Slow-3G rig; low stakes, W3-owned).
No quality/disposition issue.

### Row 6 — Preload hygiene [FOLD-W1] → **CONFIRMED**
W1 **explicitly** owns this (wasm double-fetch + per-game-worker modulepreload, `vite.config.ts:143-147`).
Correct fold, not a re-tread.

### Row 7 — Idle-solved stays GPU-pinned + murmur [FOLD-W1] → **CONFIRMED**
**Reproduced: solved `cputime_delta 512.8%`** (p1: 514%) with boil still flipping over 81 filled cells.
Murmur full-viewport damage is W1-owned (D3). Correct.

---

## p2-solver-backend — 10 rows

### P2-SPINE — node spine 40513→4678 + GAC 13.84× [CLEAN] → **CORRECTED**
- **CONFIRMED (deterministic):** reran `gac_ab_corpus` → **`40513 → 4678 — HOLD`**, `0/50 false-UNSAT`.
  Reran `alloc_census` → **16×16 Hard 590 allocs/44,588 B, 9×9 Medium deal 38,147 allocs/3,768,616 B** —
  byte-exact to p2's tables. Load-immune, rock-solid.
- **CORRECTED (the wall multiplier):** reran `gac_timing_probe` → **corpus wall ratio 12.84×, node ratio
  8.66×**. p2 banked **"13.84× today."** I could not reproduce 13.84× — got **12.84×** (a full 1.0× lower).
  The wall ratio is a **load-stamped Σoff/Σon**, not a quiet-box number; it drifts. **Bank the deterministic
  node ratio 8.66× (40513→4678), not the point wall figure.** The headline still holds directionally
  (12.84× ≥ the 12.5–12.7× target), so the CLEAN disposition survives — but "13.84×, if anything understates"
  is a load artifact and must not be banked as *the* measurement.

### P2-GEN16 — 16×16 is corpus fast-path, not a stall [CLEAN] → **CONFIRMED**
`alloc_census`: 16×16 Hard deal = **16 allocs / 1,672 B (FAST transform)** vs 9×9 Medium slow-dig 38,147.
Confirms the 16×16-stall hypothesis is refuted. Correct.

### P2-GENREUSE — reuse CSP skeleton across hole candidates [NEW-ROW→W6] → **CORRECTED**
- **Disposition CONFIRMED net-new:** W6-generation-truth owns grading / bank-filling / uniqueness gates /
  futoshiki difficulty — **not** the per-hole `Csp::finalize` malloc-elision. W1 owns no solver/gen perf.
  So this is genuinely net-new, correctly routed to feed W6's substrate. Not a re-tread.
- **CORRECTED (gain inflation):** the **alloc** reduction is real and large (**38,147 → solve-order ~600**,
  confirmed). But p2 labels the row "large" without separating alloc-count from **user-visible wall**: this
  fires only on the **live hole-dig path (9×9 easy/medium + 4×4), once per new-board (non-chatty)**, and p2
  itself measures that path at **~3.5 ms native**. Cutting its ~40% malloc mass saves single-digit ms per
  deal on a once-per-board path — a **modest** user-visible win, not "large." Ship the row to W6 with the
  gain restated as "large alloc reduction / modest once-per-deal wall gain," gated on W6/W2's dealt-board
  identity invariant (the "identical dig sequence & dealt board" claim is unverified-by-construction here).

### P2-VALUES (SmallVec) / P2-MRV (frozen wdeg) [NEW-ROW] → **CONFIRMED**
Both small, output-identical-by-construction, not owned by W1/W5, honestly scoped (<5% wall / marginal).
No quality risk (Feasibility value-order is a no-op; weights==1 ⇒ wdeg==constraint-count). Accepted as-stated.

### P2-GACCORE / P2-TLSCRATCH / P2-RELPROFILE / P2-PGO [CLEAN] → **CONFIRMED**
No hidden actionable row. GAC core at optimum (per-propagate ≈0 heap alloc — consistent with the
allocs/node ~3.9 census). RELPROFILE correctly W5-homed; PGO/LTO rejected on cost, not quality. Correct.

### P2-GENSHORT — dig short-circuit [REJECTED-quality] → **CONFIRMED**
Correctly rejected: reordering/short-circuiting the dig changes which cells are removed ⇒ a different puzzle.
Respects the quality constraint.

---

## p3-wasm-facilities — 12 rows (the cleanest lane)

Every size figure is **load-immune** and reproduced byte-exact. I **rebuilt the base + SIMD nodejs arms from
source** (task requirement) and re-measured solve time.

- **p3-r1 size truth → CONFIRMED.** Fresh `wasm-pack … --profile wasm-release --no-default-features` → lean
  **86,746 B**, `cmp` **BYTE-IDENTICAL** to committed `pkg/…_bg.wasm`; full **188,095 B**. Matches W5.
- **p3-r8 SIMD no-op → CONFIRMED (fresh rebuild).** Rebuilt both arms: base **86,746 B**, simd **86,371 B**
  (**−375 B**, exact). Re-measured (load ~10): solve 9×9 min base 0.514 / simd 0.533 ms; 16×16 min base
  1.694 / simd 1.695 ms; propagate 16×16 base 3.51 / simd 3.42 ms — **within run-to-run noise, a wash**.
  REJECTED disposition correct (capability floor for zero-to-negative gain, no pixel movement).
- **p3-r9 bulk-memory FOLD-W5 → CONFIRMED.** `wasm-opt --print` → **27 `memory.copy` + 5 `memory.fill`**;
  the flag is redundant. W5 owns the Cargo.toml `[profile.custom]` cleanup — correct fold, not a re-tread.
- **p3-r10 ref-types/multivalue → CONFIRMED.** `wopt/rt-base-oz`, `rt-mv-oz`, `rt-on-oz` all **86,746 B**
  byte-identical. No lever.
- **p3-r11 wasm-opt -Oz → CONFIRMED.** `wopt/out/` sweep reproduces **exactly**: -O0 100,762 / -O1 93,324 /
  -O2 88,424 / -O3 87,938 / -O4 87,963 / -Os 87,508 / **-Oz 86,746** (smallest). (Aside: my first `ls`
  hit the finished pkg dirs, all 86,746 — self-corrected against `wopt/out/`.)
- **p3-r2/r3/r4/r5/r6/r7/r12 → CONFIRMED.** propagate 9×9 reran **0.287 ms** (matches p3's 0.28). Twiggy
  no-clean-prune, instantiate sub-ms, flat typed-array protocol, panic-hook REJECTED-quality (diagnostic
  regression), threads REJECTED (COOP/COEP cost, solve already <2 ms) — all sound. **No CLEAN hides a row;
  no proposed change moves a pixel.**
- **DING (recipe):** p3's banked builds are `--target web` (import.meta) but `bench-solve.mjs` uses
  `require()` and the recipe passes a **bare specifier** (`builds/node-base`) → `MODULE_NOT_FOUND`. The
  banked re-measure recipe does **not** run as written; needs `--target nodejs` + a `./` path prefix
  (both applied here). Process ding, not a result ding.

---

## Quality-constraint sweep (absolute) — **PASS across all three lanes**

No lane proposes an optimization that thins poses, slows cadence, reduces sizes/quality tiers, or moves a
pixel as if it were clean. Every pixel-touching candidate is named a **rejected row**: p1-Row4 (Bloom warp),
p2-GENSHORT (dig reorder), p3-r3 (panic hook), p3-r8 SIMD / p3-r12 threads. W1's bitmap-cache pixel trade
(SSIM ≥ 0.98, disclosed ~6% WebKit edge shift) is W1's own owned gate, not introduced by these lanes.

## Disposition-correctness sweep

- **NEW-ROW that W1/W5 already owns:** only **p1-Row1** (mis-marked NEW-ROW; it is a FOLD-INTO-W1 gate
  correction). p2-GENREUSE→W6 verified net-new (W6 owns generation *truth*, not this malloc-elision).
- **CLEAN that hides a row:** none found. p2/p3 CLEANs are at genuine floor; small wins are surfaced as
  their own NEW-ROWs, not buried.

---

## Per-row verdict tally

| lane | rows | CONFIRMED | CORRECTED | REFUTED |
|---|--:|--:|--:|--:|
| p1 | 7 | 6 | 1 | 0 |
| p2 | 10 | 8 | 2 | 0 |
| p3 | 12 | 12 | 0 | 0 |
| **Σ** | **29** | **26** | **3** | **0** |

**convergence_pct = 26 / 29 = 89.7%** (CONFIRMED / total). Counting the 3 CORRECTED rows — all
directionally intact (fix unchanged, headline holds) — at half weight: (26 + 1.5)/29 = **94.8%**. Reported
convergence **≈ 90%** (conservative, full-confirm basis). Zero refutations: no lane's core finding is false;
the corrections are a mis-scaled gate anchor (p1), a load-variant wall multiplier (p2-SPINE), and a
gain-inflation qualifier (p2-GENREUSE).

## kill_list

1. **p1: do NOT re-anchor W1's `webkit-cpu` gate headline to ~640% playwright-headless.** It is a
   software-raster figure ~3.3–3.7× the owner's device. Keep the **real-Safari ~175–194% ≈ 2 cores** anchor
   (p1's own 175% confirms W1's 194%); footnote ~6 cores as the headless proxy only.
2. **p1: strike the [NEW-ROW] class on the CPU re-anchor** → it is a **FOLD-INTO-W1** gate-wording fix
   (W1 already frames both surfaces). Drop the confused "208% top-interval" clause, but not for p1's stated
   reason.
3. **p1: strike the reasoning "top times out ⇒ 208% is a tool artifact."** `top -l 3 -s 1` times out on this
   box on an *idle* process — the timeout is a loaded-box artifact, not evidence against a quiet-box
   top-interval. (The 208% is still wrong for the playwright surface — because cputime-delta = ~640% there —
   but establish that from cputime-delta, not from top's failure.)
4. **p2: do NOT bank "GAC 13.84×" as today's measurement.** Reran to **12.84×** (load-variant wall ratio).
   Bank the deterministic **node ratio 8.66× (40513→4678)**; report the wall ratio only with its load stamp.
5. **p2-GENREUSE: qualify the "large" gain** → large **alloc** reduction (38,147→~600, confirmed) but
   **modest user-visible wall** (once-per-deal live hole-dig, ~3.5 ms native); gate on W6/W2's dealt-board
   identity invariant.
6. **p1 & p3: disclose loadavg and fix banked recipes.** p1 fps figures uncertified (undisclosed load, box
   runs top-to-timeout); p3's `bench-solve` recipe needs `--target nodejs` + `./`-prefixed path to run.

## Reruns banked (this pass)
```
# deterministic (load-immune) — reproduced byte-exact:
(cd .../csc411/CSC411_HW2_ProgrammingQuestion && cargo run --release --example gac_ab_corpus)     # 40513→4678 HOLD
(cd probe && ./target/release/alloc_census)                                                        # 590/solve, 38147/deal
(cd .../csc411/CSC411_HW2_ProgrammingQuestion && cargo run --release --example gac_timing_probe)    # 12.84× (NOT 13.84×)
cmp .../pkg/csp_solver_wasm_bg.wasm builds/lean/csp_solver_wasm_bg.wasm                             # byte-identical
# fresh rebuild (task requirement) — reproduced byte-exact + solve within noise:
wasm-pack build csp-solver/wasm --scope mkbabb --target nodejs --profile wasm-release --out-dir crit-node-base  --no-default-features   # 86,746
RUSTFLAGS="-C target-feature=+simd128" wasm-pack build … --out-dir crit-node-simd --no-default-features                                 # 86,371 (−375)
node bench-solve.mjs ./crit-node-base baseline ; node bench-solve.mjs ./crit-node-simd simd        # wash
# p1 mechanism:
(npx vite preview --port 4501 --strictPort &) ; node cpu-crossmethod.mjs                            # GPU cputime-delta 574% ≈ 6 cores; top ETIMEDOUT
timeout 12 top -l 3 -s 1 -pid <idle-pid> -stats cpu                                                 # TIMES OUT on an idle proc → loaded-box artifact
```
