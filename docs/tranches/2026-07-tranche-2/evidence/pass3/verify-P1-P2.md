# Pass-3 critique — lane verify-P1-P2 (data prototypes)

**Adversarial re-verification of the P1 and P2 Pass-2 prototype reports.**
Repo HEAD `8913023e` (confirmed via `git rev-parse`). Everything below re-derived
fresh — reshape re-run from the committed bank, worktree rebuilt + tested, wasm
timings re-measured across 8 fresh browser runs. Toolchain `rustc 1.98.0-nightly`,
Node `v26.0.0`, Playwright Chromium 1208 (`hardwareConcurrency=18`, same box class
as P2's harness).

---

## P1 — sparse+compact embed reshape → **CONFIRMED** (both gates + diff)

### Gate A — embed ≤ 82 KB: **CONFIRMED, byte-exact**
Copied the committed bank (`298,006 B` confirmed on disk) to scratch and re-ran
`P1-reshape_bank.py` from scratch. Output reproduced P1.md **to the byte**:

```
TOTAL embed: 298006 -> 81963 B  (-72.5%)
  N=2:  30 files    9239 ->   1854 B
  N=3:  52 files   77062 ->  15260 B
  N=4:  25 files  127936 ->  28942 B
  N=5:   9 files   83769 ->  35907 B
N=5 subtree (dies with R1): 35907 B
surviving embed (excl N=5): 46056 B
```
81,963 B ≤ 82,000 (37 B headroom) and ≤ 82 KiB (83,968; 2,005 B). N=5 subtree
35,907 B and surviving-46,056 B both byte-exact to the report. The transform is
genuinely deterministic (drops `solution`/`backtracks`, drops zero-holes, strips
whitespace; preserves the nonzero-given set per file).

### Gate B — all green: **CONFIRMED**
Rebuilt the worktree at HEAD, applied the full `P1.diff` (119 files: 116 data + 2
source + 1 new example) — on-disk embed after apply = **81,963 B** exact, sample
file confirmed sparse+compact wrapped `{"puzzle":{"0":5,...}}`.

- **Uniqueness sweep** (`cargo run --release --example verify_bank_uniqueness`,
  driving the compile-time `include_dir!` embed → `parse_puzzle_field`):
  `total 116 · unique 116 · non_unique 0 · unsat 0 · budget_trunc 0 ·
  max_backtracks 158 · elapsed 0.079s · VERDICT PASS`. Byte-exact to P1's
  116/116, max_bt 158, ~0.08 s.
- **`cargo test --workspace`**: tallied **150 passed · 0 failed · 6 ignored**
  (5+6+8+6+7+2+11+16+5+16+11+4+42+7+0+0+0 +4 = 150; 6 ignored in `solver.rs`).
  Matches P1's claim and D24's 150/0/6 headline. No `error:`/`warning: unused`
  lines surfaced — the `dense_json` removal left zero dead-code warnings.
- **Both consumers accept.** Rust `parse_puzzle_field` covered by the sweep.
  Frontend Vite-plugin parse replicated in node against the reshaped worktree
  files: `files=116 boards=116 malformed=0`. Statically confirmed the plugin
  reads `data.puzzle` into `new Array(total).fill(0)` (`vite.config.ts` render
  fn) — the wrapped form is a true drop-in; P1's "wrapper is load-bearing" (bare
  `{…}` would break `data.puzzle`) is correct.

### Diff re-applicability: **CONFIRMED**
`git apply --check` clean at HEAD for `P1.diff` (full), `P1-source.diff`, and
(bonus) `P2.diff`. W4 can re-materialize via `P1-reshape_bank.py` or apply the
patch directly — both land.

**P1 verdict: CONFIRMED. No amendment — holds as authored.**

---

## P2 — wasm hole-dig gen cost → gate **CONFIRMED**, device-sensitivity **SHAKY**

### Artifact integrity: CONFIRMED
Harness wasm `csp_solver_wasm_bg.wasm` = **87,853 B**,
sha256 `03bcbbc2a8f61f19…3fc59be5` — matches P2's claim exactly. Export scan:
`generateSudoku/generateFutoshiki/solveSudoku/solveFutoshiki` present,
`assignment`/`isomorphic` absent → lean build confirmed. (Carried-over caveat,
unchanged: the artifact was not independently rebuilt here; HEAD-faithfulness
still rests on the D21/D24/verify-27 byte/hash chain — out of this lane's scope,
already A-graded there.)

### Gate — all six tiers p95 ≤ 50 ms: **CONFIRMED**
Re-ran the Playwright harness **8 fresh times** (3 warmup + 25 timed × 6 tiers).
Given-fractions reproduce byte-exact every run — N2 `12/7/4`(=0.75/0.44/0.25),
N3 `61/35/23`(=0.75/0.43/0.28) — i.e. genuine seed-deterministic hole-dig, not a
stub. Load-bearing N3 p95 (ms):

| tier | P2 recorded (worst/3) | my clean runs 4–8 | my loaded runs 1–3 |
|---|---|---|---|
| N3-easy  | 2.98 | 2.78–2.90 | 2.90–3.36 |
| N3-medium| 6.84 | 6.28–6.38 | 6.78–8.92 |
| N3-hard  | **23.98** (max 27.9) | **22.20–24.88** (max 26.4–28.4) | 25.10–31.50 (max 33.3) |

Runs 1–3 ran while the P1 cargo build was still resident (elevated by CPU
contention). Once quiet, N3-hard p95 lands 22–25 ms — P2's 24 ms reference is
fair, even slightly conservative (my run6 hit 24.88). Every tier clears 50 ms;
even the worst contended sample I saw (31.5 ms p95 / 33.3 ms max) clears. Gate
holds.

### N3-hard device-sensitivity honestly bounded? **SHAKY** (honest direction, optimistic number)
P2's *qualitative* posture is sound and I endorse it: it singles out N3-hard as
"the one device-sensitive tier," states the busting condition, and offers the
safe fallback (real-device confirmation run **or** keep the N3-hard bank). But two
things make the specific reassurance optimistic:

1. **The "survives a 2× mobile penalty (~48 ms)" bound is razor-thin and
   best-case.** It rests on the 24 ms quiet-machine reference. Under realistic
   same-desktop CPU contention p95 rose to 26–31 ms in my runs (headroom shrinks
   from 2.1× to ~1.6×); a 2× penalty on a 28 ms contended p95 is 56 ms — a bust.
   A 2× mobile penalty is *at the edge*, not a clearance. Honest phrasing:
   "≥2× busts," not "2× still clears."

2. **P2's embed rationale is REFUTED by the sparse measurement.** P2 says
   "N=3-hard is where the N=3 embed savings mostly live." Measured on the
   *reshaped* (actually-embedded) files:

   ```
   N=3 easy   8633 B   ← the real N=3 embed weight
   N=3 medium 3036 B
   N=3 hard   3591 B   ← the SMALLEST tier to keep, yet the only risky one
   ```
   Excising N3-hard saves just **3,591 B** while surrendering the sole mobile
   safety margin. The N=3 embed win is dominated by N3-**easy** (8,633 B), which
   is unconditionally excise-safe (p95 ≤ 2.9 ms). So the device-sensitive tier is
   the *cheapest* to keep — the opposite of P2's "substantive win" framing.

**P2 verdict: gate PASS (all tiers clear), but the N3-hard excision recommendation
needs the tightening below.**

---

## WAVE-SPEC AMENDMENT (T2-W4 §2, + P2 row §3)

**P1: no amendment — holds as authored.** The 81,963 B embed, 116/116 green
(`cargo test` 150/0/6 + uniqueness sweep), and diff re-applicability all reproduce
byte-exact. W4 re-materializes via `P1-reshape_bank.py` (or applies `P1.diff`).

**P2: amend the N=3 excision beat.** Replace W4's
> "N=2 (and possibly N=3) bank excision → live-gen IF P2 clears…"

with the concrete, byte-costed split:

- **Excise unconditionally** (all reproduced with ≥7× headroom): N=2 all tiers
  (1,854 B), **N=3-easy** (8,633 B), **N=3-medium** (3,036 B). Total shed 13,523 B.
- **KEEP the N=3-hard bank** (3,591 B sparse) **unless** a confirmation run on a
  genuine low-power device clears p95 ≤ 50 ms. Rationale: desktop headroom is only
  ~1.6–2.1× (run-and-contention dependent), any ≥2× mobile penalty busts, and
  N3-hard is the *cheapest* N=3 tier to retain — keeping it buys full mobile
  safety for 3,591 B.
- **Correct P2.md**: strike "N=3-hard is where the N=3 embed savings mostly live"
  (false — sparse N3-easy 8,633 B > N3-hard 3,591 B).
- **Tooling gap the diff must cover**: `P2.diff` only flips `SIZES=[4]` — an
  all-or-nothing-per-size switch. The conservative split (keep only N3-hard) is
  **not** expressible through `P2.diff` as written: the plugin's
  `for (const d of DIFFICULTIES) readdirSync(dir)` loop throws ENOENT on any
  git-rm'd difficulty dir. Keeping N3-hard requires `SIZES=[3,4]` **plus** an
  `existsSync(dir)` guard (missing dir → `bank[n][d]=[]` → `?? []` → live-gen).
  W4 must author that guard; it is not in the prototype's diff.

Resulting surviving embed (post N=5 kill, which is separate/ER):
- aggressive (P2 headline, excise all N=3): **N=4 only = 28,942 B**
- conservative (keep N3-hard): **28,942 + 3,591 = 32,533 B**

Both far under any gate; the 3,591 B delta is the price of zero-mobile-risk.

---

## Verdict summary
- **P1 Gate A (embed ≤82 KB):** CONFIRMED — 81,963 B byte-exact, reshape re-run.
- **P1 Gate B (all green):** CONFIRMED — 150/0/6 + sweep 116/116, both consumers.
- **P1 diff re-applicable at HEAD:** CONFIRMED (full + source + P2).
- **P2 gate (6 tiers p95 ≤50 ms):** CONFIRMED — reproduced 8×, given-fractions
  byte-exact, all tiers clear (N3-hard clean p95 22–25 ms).
- **P2 N3-hard device-sensitivity honestly bounded:** SHAKY — direction sound,
  but "2× mobile penalty still clears" is best-case; and the embed rationale is
  refuted (N3-hard is the cheapest, not the most valuable, N=3 tier to excise).
