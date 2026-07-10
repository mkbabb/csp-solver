# T2-W0 — Gates + hygiene

**Opens the tranche: make the regression net real, then true up every stale literal the campaign proved wrong.** No ratification dependencies—everything here is R5/R6-resolved or plain hygiene.

**Dependencies**: none. **Effort**: S.

---

## Scope

### e2e — from 12/14 to green, then into CI (R6)

- Current state is **measured at HEAD**, not inherited: 14 specs, **12 passed / 2 failed**, reproduced twice on independent runs ([`../evidence/pass2/P7.md`](../evidence/pass2/P7.md) §2 baseline; re-reproduced with identical failing assertions by [`../evidence/pass3/verify-P5-P7.md`](../evidence/pass3/verify-P5-P7.md)). The two reds: `round9.spec.ts:162` "grid draw-in completes" and `round9.spec.ts:249` "size switching", both `expect(frameLines).toBe(1)` receiving `4`—a pre-existing rendering-logic bug, build-tool-independent. Fix both.
- Author the **first futoshiki spec** (coverage is zero today).
- **Wire the suite into CI** (R6 GO). New specs inherit the `.controls-card button[…]` scoping discipline—the bare `aria-label` selector resolves to the hidden mobile panel and hangs (L14, session-scoped).
- Note for W6: zero keyboard-interaction assertions exist in the suite today (`grep` for `\.press(`/`keyboard.` → 0 hits—[`../evidence/pass3/Q7-affordance-interlocks.md`](../evidence/pass3/Q7-affordance-interlocks.md)); W6 authors the first keyboard spec. Nothing to do here beyond knowing the net has that hole.

### Literal refresh (all proven stale)

- `ci.yml:269,295` wasm size comments → **87,853** (lean) / **211,639** (full)—byte-exact twice (verify-27/verify-30 chain, folded in [`../evidence/synthesis-pass1.md`](../evidence/synthesis-pass1.md) D21/D24).
- `gac_ab_corpus.rs` hardcoded `"0/113"` verdict string → derive from `corpus.len()` (the corpus is **112**) + repair `docs/benchmarks.md`'s "Reproducing" section—the documented command cannot produce the timing/node numbers it sits beside (verify-30).
- `docs/benchmarks.md`: 113→112, the `ac3_mrv` headline, **and drop the `"and one N=5"` composition clause at line 14 in the same edit**—the default corpus run never includes an N=5 board at all (`template_corpus()` hardcodes N∈{2,3,4}; the opt-in `--n5` path reads the already-absent `sudoku_solutions/5/`)—[`../evidence/pass3/Q2-n5-kill-blast-radius.md`](../evidence/pass3/Q2-n5-kill-blast-radius.md) amendment, bundled here rather than left to W4.
- `worker.ts:5` "148-659ms" caption.

### Hygiene

- `git rm --cached .env` (tracked-but-gitignored since tranche 1, W0→W5→still tracked; contains no secret—verify-31 F10, appendix C item L25-45).
- Kill `.env.example`'s dead `DEPLOY_HOST` (NXDOMAIN legacy host the deploy script was already hardened against).

## Gates

| Gate | Value |
|---|---|
| e2e | full suite green (14 + the new futoshiki spec) **in CI**, not just locally |
| `gac_ab_corpus` | prints derived counts—`0/112` at HEAD's dense bank |
| Literals | grep-zero for `0/113`, `148-659ms`, `72,429`, `201,053` outside `docs/tranches/` |
| `.env` | untracked; `git status` clean |

## Seeds

- e2e failure forensics: [`../evidence/pass2/P7.md`](../evidence/pass2/P7.md) §2 + [`../evidence/pass3/verify-P5-P7.md`](../evidence/pass3/verify-P5-P7.md) (exact spec lines + assertion values).
- Literal targets: [`../evidence/synthesis-pass1.md`](../evidence/synthesis-pass1.md) T2-W0 bullet + appendix A corrected values.
- Pass-1 lanes L21/L30/L31 (session-scoped scratchpad; conclusions folded above).

## Residual risks

- The 2 frame-line reds are diagnosed (4 frame-lines where 1 is expected) but the fix is unprototyped—if the root cause runs deeper than the spec's assumption, the "e2e green" gate may pull W5's grain/transition work forward. Contained: P3's transition measurements didn't disturb the failure mode (identical 12/14 under Vite 8).
- CI minutes: the e2e lane is new standing cost—R6 ratified it; keep the lane's browser cache warm.
