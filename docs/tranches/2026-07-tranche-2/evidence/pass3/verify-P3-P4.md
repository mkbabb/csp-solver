# Pass-3 · verify-P3-P4 — core design model re-judgment

**Lane:** verify-P3-P4 (DESIGN) · **2026-07-09** · repo HEAD `8913023e` (read-only; all work in `pass3/wt-p3v` + scratch) · adversarial re-derivation, nothing quoted where re-derivable.

## VERDICTS

| Gate | Verdict |
|---|---|
| **P3** — transition grain-hoist (trace + soul) | **CONFIRMED** — reproduced end-to-end on fresh builds; effect slightly larger than claimed; soul intact by my eyes; caveats reproduce too |
| **P4** — BOOK-for-tranche-III (spoiler + the two decisions) | **AMENDED** — BOOK stands; spoiler finding CONFIRMED and *strengthened* by full-bank re-derivation; the two decisions are the right two axes but are **coupled**, and the booking text needs three corrections |

---

## P3 — everything re-derived, nothing inherited

**Builds.** Fresh worktree at `8913023e` + `pass2/p3.diff` on wt-head's node_modules → AFTER bundle `index-fCKonWHt.js`, exact hash match to P3's claim; wt-head dist is the byte-exact HEAD BEFORE (`index-CZHZBZxm.js`); wasm 87,853 B (D21 parity).

**Source forensics (P3's F1 correction) — verified at HEAD, not trusted.** `usePathAnimation.ts` sets `pathsVisible=true` only *after* the draw-in batch completes, so the transition `<g>`'s `:filter` was `undefined` for the whole grid draw-in; the erase runs with `pathsVisible` still true (filtered, dashoffsets tweening); `HandwrittenGlyph.vue:261` carries a static `filter="url(#grain-static)"` under per-frame dash writes. P3's correction of L28 F1's root-cause narrative is right: **the draw-in was never filtered; erase + per-glyph reveal draw-ins carry the transition grain re-raster.** Its proposed §5 ledger line should be folded verbatim.

**Edge paths of the glyph edit — safe.** Under PRM `createGlyphDrawIn` fires `onComplete` synchronously (grain restored immediately, returns null after); `cleanupAnimations()` restores `grainOn` on mid-flight stops. No stranded-tooth path exists.

**Trace reproduction** (`pass3/v-{before,after}-run{1..3}.json`, verify-28 harness verbatim, 3 interleaved pairs, same box/window):

| metric (mean of 3) | BEFORE | AFTER | Δ | P3 claimed |
|---|--:|--:|--:|--:|
| desktop raster ms/s | 882 (826–946) | **337 (326–355)** | **−62%** | −60% |
| desktop raster total ms | 1068 | 418 | −61% | −60% |
| 4× raster ms/s | 474 (398–613) | **208 (197–226)** | **−56%** | −50% |
| 4× max frame ms | 108–116 | 100–117 | **wash** | wash (caveat) |
| 4× jank ms | 343–426 | 343–352 | wash | wash |
| >28 / >45 frame counts | 4/2 | 3/2 | ~identical | identical |
| settle ms | 362–377 | 348–389 | wash | wash |

Bands don't overlap on the raster cut; the ~100–150 ms-class 4× worst frame **is not cut** (P3's own caveat, reproduced — it's the CPU half: `generateGridBoilFrames` + 256 `wobbleRect` ghost regen + mounts). The 4× busy% "+4.7 pp" penalty did **not** reproduce on my box (wash, overlapping bands) — P3's caveat was conservative.

**Soul gate — my eyes rule.** Fresh settled shots from both builds, same injected board (`pass3/v-shots/`, 10/side across the boil cycle): **cross-build SSIM max = 1.0** (multiple exact pairs); the sub-1.0 spread (median .98883, min .97471) is byte-identical in character to the before/before self-band (median .98493, min .97471) — pure boil-frame mismatch, present in the unpatched build alike. Settled board pixel-identical; the SSIM=1.0 best pair is visually indistinguishable and carries the full tooth. Mid-transition (P3's shots, random boards each side, character judgment): t0110 erase and t0280–0900 reveal read as the same hand — kinks, wobble, round caps live in the baked geometry; the grain tooth is sub-threshold on moving strokes at DPR2; t1400 lands the tooth with the steady swap on both sides. **No visual regression. The soul holds.**

**Gate verdict: CONFIRMED — P3's PASS stands as authored.**

---

## P4 — spoiler finding re-derived over the full bank

**Rendering, my eyes.** The marks are genuinely pencil-soul: classic position-encodes-value mini-grid, same hand as the ink, clearly subordinate graphite; dark mode lifts to chalk correctly under white ink; 16×16 reads as honest margin scribble at desktop scale; the UNSAT beat (`04-unsat-conflict.png` — contradiction typed, every mark on the board gone) is the best design moment of the fiction, as claimed. Feasibility PASS un-contested.

**Spoiler re-derivation — native, full bank, exact op semantics** (`pass3/wt-p3v/csp-solver/examples/p4v_propagate.rs` over all 116 committed templates, `pass3/p4v-{boards,results}.txt`; pins givens via `Domain::restrict_to`, `csp.propagate()` — identical to the wasm op):

| bank | boards | fully collapsed (all-singleton) | singleton% min/med/max |
|---|--:|--:|--:|
| 4×4 easy/med/hard | 30 | **30 (100%)** | 100/100/100 |
| 9×9 easy | 20 | **20 (100%)** | 100/100/100 |
| 9×9 medium | 12 | **12 (100%)** | 100/100/100 |
| 9×9 hard | 20 | 8 (40%) | 2/49/100 |
| 16×16 easy/hard | 15 | **15 (100%)** | 100/100/100 |
| 16×16 medium | 10 | 8 (80%) | 38/100/100 |
| 25×25 easy (moot, R1-killed) | 9 | 9 (100%) | — |

**109/116 bank boards (94%) become a verbatim answer key** under the op; symmetry transforms preserve this per template, so it is what's served. The default surface is 9×9 **EASY** (`useUrlState.ts:84`) — always a full answer key. Even the survivors leak 2–53% of answers as lone marks (visible in every P4 screenshot). P4's HARD sample A {1:20,2:26,3:8,4:3} is bank hard idx=16 — my run matches it to the cell, corroborating the P2 harness. P4 said "a large fraction"; the truth is *all of easy+medium at every size, without exception*. **CONFIRMED, stronger than stated.**

**Forensic nit:** P4's "HARD samples B/C {1:58}, {1:46}" — a 46-empty hard board does not exist in the bank (hard = 54–59 empties; **every** medium template is exactly 46). Sample C was a MEDIUM board (stale-difficulty observation in the re-roll loop). Changes nothing — both collapse — but the label is wrong.

**Are the two named decisions the RIGHT two?** Yes as axes — *what the marks know* (tier) and *when they appear* (ambient vs opt-in) — but they are **coupled, not orthogonal**, and I re-derived the coupling empirically. Tier-(b) simulation (singleton-elimination-to-fixpoint = AC-3 sans Régin) on the 9×9 bank:

| tier | easy | medium | hard |
|---|--:|--:|--:|
| (a) one-pass naive peer scan | ~0–1 singletons/board | safe | safe |
| (b) AC-3 sans GAC (naked-single cascade) | **20/20 fully collapsed** | 0/12 (med 2%) | 0/20 (med 0%) |
| (c) full GAC (the op as built) | 20/20 | **12/12** | 8/20 |

So: the fixpoint cascade — not the Régin upgrade — is what spoils EASY (the default); Régin's Hall-set pruning is what eats MEDIUM. **No fixpoint tier is ambient-safe on the default surface; only one-pass naive is.** Conversely, behind a deliberate act (the peek/hint grammar), any tier is defensible. The tranche-III booking should therefore present the two questions as one joint decision with three coherent bundles: **ambient-naive** (human-marks fiction, client-derivable), **opt-in full-GAC** (the engine-domains fiction wearing the peek/hint grammar), or **hybrid** (ambient naive + opt-in engine lens).

**Two spec corrections to the booking row:**
1. Tier (b) is **currently inexpressible**: Régin runs inside `AllDifferent::revise` behind a dynamic live-count gate (`all_different.rs:46–93`), not behind `PropagationStrategy`; D20 explicitly DEFERs GAC on/off policy. It needs a new engine revise mode, not P4's "strategy param on the op".
2. If tranche III picks ambient-naive, **the P4 wasm op and protocol surface don't ship at all** (tier (a) is client-derivable — P4's own words). The BOOK row must record the +1,779 B artifact as conditional on the tier choice, not a default rider.

**Gate verdict: AMENDED — BOOK stands; fold the strengthened data + coupling + the two corrections into the row.**

---

## EXACT WAVE-SPEC AMENDMENTS

**A1 (§5 corrections ledger, add — P3-proposed, now source-verified):** "L28 F1 root cause 'draw-in phase filtered' → the grid draw-in was never filtered at HEAD (`pathsVisible` false until completion); the erase phase + per-glyph reveal draw-ins carry the transition grain re-raster. The 842 ms/s measurement stands."

**A2 (T2-W5, runtime bullet — replace):** "transition-layer grain-hoist IF P3 clears (842 ms/s raster → target the idle band; escape hatch…)" → "grain-hoist per P3 (both halves of `pass2/p3.diff`: the HandDrawnGrid transition `<g>` AND the HandwrittenGlyph reveal draw-in — the @4× cut lives in the glyph half): size-switch raster −60%-class desktop / −50%-class @4× vs a same-box HEAD baseline; residual after-side raster is legitimate one-shot paint, NOT the idle band. The ~100–150 ms-class @4× worst frame is CPU (`generateGridBoilFrames` + cell-ghost regen + mounts), untouched by design — new deferred-ledger row: memoized/idle-chunked transition path regen. Escape hatch `pencilConfig.ts:170-189` stays booked, unused."

**A3 (D22 row, one line):** append "— hoist cuts raster only; the 133 ms-class @4× frame is the CPU half, out of scope (see W5)."

**A4 (§3 P4 row / W7 deferred-ledger fold — rewrite the booking text):** "BOOK for tranche III with the joint design decision (the two axes are coupled): tier × surface. Full-bank data: 109/116 boards (100% of easy+medium at every size) collapse to an answer key under the op; AC-3-sans-GAC still collapses 20/20 EASY (the default surface, `useUrlState.ts:84`); only one-pass naive peer-scan is ambient-safe. Bundles: ambient-naive (client-derivable — **the wasm op doesn't ship**), opt-in full-GAC behind the peek/hint grammar (**the op as built**), or hybrid. Tier (b) requires a new engine revise mode (Régin is gated inside `AllDifferent::revise`, `all_different.rs:46-93` — D20's DEFER'd GAC policy), not an op param. Carried riders unchanged: a11y candidate names, futoshiki mirror, mobile/16×16 mark-legibility floor (21.7 px cells → marks are sub-legible; suppression floor is a tranche-III rendering decision)."

**Evidence:** `pass3/v-before-run{1..3}.json`, `pass3/v-after-run{1..3}.json`, `pass3/v-shots/` (fresh SSIM 1.0), `pass3/p4v-boards.txt`, `pass3/p4v-results.txt`, `pass3/wt-p3v/` (worktree: after-build + `csp-solver/examples/p4v_propagate.rs`). Preview servers stopped; repo untouched.
