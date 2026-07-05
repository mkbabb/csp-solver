# W3 — Zero-alloc verification + build profiles

**Verifies the zero-alloc hot path on the landed tree and fixes the build posture to what the evidence actually supports.** The profile-numbers critique refuted the Pass-2 headline at load—this wave states what IS proven and ships only that.

**Dependencies**: ← W1 (the zero-alloc content is inside the composed tree). **Effort**: S (≤1 day; the optional mimalloc A/B adds ~1 day).

---

## Scope (file-level)

### Zero-alloc verification (content already landed via W1)

The composed tree carries all five Pass-2 zero-alloc items: `Domain::iter use<>` capture + 5 collects removed, O(1) bitset-mask `restrict_to`, `BitsetWorklist` as Kernel scratch, shared `bitscan.rs`, change-mask default `revise()` (which also fixed the unary-Lambda-never-propagates defect). This wave re-runs the measurement harness (`pass2/morph-lazy-cost.harness.rs`-style alloc counter, `pass2/zah-alloc-{baseline,patched}.txt` method) on the landed tree to confirm nothing regressed through composition.

### Build posture — the honest ledger (T15 refuted → re-decided)

**What was claimed (Pass 2)**: `lto=fat/cu=1/strip` + mimalloc ≈ −10–13%, +PGO −17.8%, "10–25% band met." **Measured at load-average ~50**—refuted.

**What IS proven** (quiet host, 2×30 interleaved rounds, non-overlapping distributions—`pass3/profile-numbers-and-ci-cost.md`):

| Lever | Verdict | Number |
|---|---|---|
| `lto=fat` + `cu=1` + `strip` alone | **REJECT** | +16–17% *slower* |
| mimalloc alone | the only positive lever | every per-puzzle line faster on the micro corpus |
| combined package | **REJECT as a package** | ≈0% net (−1.4 to +1.25%) |
| CI tax if profiles adopted | quantified | cold workspace 2.1–2.5×, warm 4.4–6.8×, wheel lane +36–40% cold—landing on 2 of 8 W0 gates |
| wasm across mimalloc toggle | size-stable, **not byte-identical** | 0-byte delta; lockfile-graph fingerprint differs |
| PGO | **DEFERRED** | mechanism proven (Pass 2); Docker-stage wiring vapor; re-measure post-mimalloc-decision |

**Posture shipped by this wave**:
1. Default release profile retained; no `lto=fat`/`cu=1`/`strip` anywhere.
2. **mimalloc adopted only behind a real-workload (non-micro) A/B**—and only after fixing the hard break: mimalloc's `#[global_allocator]` **conflicts with `alloc_count.rs`'s counting allocator** once composed (compile error). Fix first: feature-gate the counting allocator or cfg the example out of default builds. Until both are done, no mimalloc.
3. Panic contract (both directions) + the three-file wasm-opt atomicity are W0's lanes—this wave owns keeping them true under any profile experiment.
4. Never cite the union's +1.76 KiB as a bundle comparison point (Pass-3 #11 amendment).

## Acceptance gates

| Gate | Proven value | Evidence |
|---|---|---|
| Alloc counts | −47.8/−77.8/−78.2% (queens 8/12/enumerate), −3.0% (16×16—AllDifferent's internal collect is the known dominant residual) | `pass2/zero-alloc-hot-path.md` |
| Wall-clock | −16.8/−16.9% (16×16), −47.6% (8q), −38.7% (12q), criterion p=0.00 | ibid. |
| Outputs | byte-identical solve outputs across the harness corpus | ibid. |
| Allocator conflict | `cargo test --workspace` green with the alloc_count fix under both allocator configs | `pass3/profile-numbers-and-ci-cost.md` (the break) |
| mimalloc (only if A/B run) | a real-workload win on the service corpus, or it doesn't ship |  |

## Seed artifacts

- `pass2/zero-alloc-hot-path.diff` — historical; already inside the composed tree. **Do not re-apply.**
- `pass2/zah-alloc-baseline.txt` / `zah-alloc-patched.txt` — the measurement baselines to compare against.
- The allocator-conflict fix: re-derive (small; the conflict is a one-line `#[global_allocator]` collision).

## Residual risks

- The known residual: AllDifferent's own internal collect dominates 16×16 allocs (−3.0% only)—a booked follow-up, not a defect; touching it interacts with GAC scratch, so it belongs to a future kernel pass, not this wave.
- Real-workload A/B for mimalloc needs a service-shaped harness (solve endpoints under concurrency), which W4 builds—sequence the A/B after W4 if run at all.
