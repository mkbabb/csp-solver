# Evidence — scratchpad → durable path map

The audit corpus lived at a session scratchpad (`/private/tmp/claude-504/…/scratchpad/tranche4/`, with the Safari lanes at `…/scratchpad/tranche3/safari/`) that does not survive cleanup. This directory is the durable copy.

**The copy is `.md`-ONLY, by the audit's own finding.** FAM-15 indicted repo bloat — 420 PNGs, 70 MB, 95% of the tracked tree, no LFS, a 97 MB clone — and ballot B1 rules prune-to-essentials + a size policy. That policy governs this evidence dir **from the first commit**: the finding is the whole point, so re-creating it by banking every capture would be self-refuting. Every lane's reasoning is in its `.md`; the screenshots, DevTools traces, probe scripts, and wasm build artifacts stay in the scratchpad and are cited by name below with their recipe path.

**Copied 2026-07-12, lane a1-readme-ledger. 45 `.md` files, 648 KB total** — three orders of magnitude under the ≤ 3 MB text budget, and no LFS anywhere. Per-dir counts at the foot.

## Resolution rule (how wave-file seed citations resolve)

The wave files under [`../waves/`](../waves/) cite seeds in the **bare scratchpad form** — `r3/r3-expansion-crit.md`, `x/x3-hint-heuristics.md`, `registry/families.md`, `corpus/owner-prompts.md`, `safari/s1.md`, `r2/mike-style-spec.md`. Each resolves against **this directory**, subdir-preserved: `<subdir>/<file>` → `evidence/<subdir>/<file>`. From inside a `waves/*.md` file the correct relative href is therefore `../evidence/<subdir>/<file>` (both `waves/` and `evidence/` are one level under the tranche root). Nine subdirs carry the whole audit: the five audit rounds (`r1`–`r5`), the six expansion lanes (`x/`), the Safari perf core (`safari/`), the two registry spines (`registry/`), and the owner/context corpus (`corpus/`).

## What's here — the `.md` corpus (kept)

### registry/ — the two spines (2 files, 28 KB)

| File | What it is |
|---|---|
| `registry/tranche-skeleton.md` | the orchestrator's adjudicated frame — the 14+WGATE wave set, the DAG, the five ballots, the disposition-ledger seeds, and every r3/r4/r5 correction folded (two cage primitives; technique engine over self-computed candidates; ~1,600–1,900 LOC floor; non-blue progress ink; codec version byte; compute-cost CI DAG) |
| `registry/families.md` | the 15-family registry with per-round verdicts (r1→r5) and the Round-5 STABILITY CERTIFICATION |

### corpus/ — the owner + auditor context (2 files, 16 KB)

`corpus/owner-prompts.md` (every ask G1→M10 + the standing constraints, the source the README §4 disposition ledger walks row by row) · `corpus/audit-context.md` (the auditor context sheet — subject, hard rules, the close-class lies, the family-hint convention).

### r1/ — round 1, 16 lanes, 94 findings (16 files, 180 KB)

`r1-{a11y,config-census,consumer-truth,dead-code,deps-js,deps-rust,doc-drift,gate-soundness,gestalt,perf,plan-diff,prompt-recap,pwa,tests-audit}.md` + `chronic-ledger.md` (the chronic/deferred census with the two-close DISEASE traces) + `vue-glass.md` (the FAM-11 idiom lane).

### r2/ — round 2, adversarial verify + deep lanes (9 files, 156 KB)

`r2-{arch-transposition,cross-repo,generation-truth,plan-diff-deep,security,verify-p01}.md` + `gaps-sweep.md` + `pencil-boil-audit.md` (the sibling-library census) + `mike-style-spec.md` (the doc-register spec W14 binds to).

### r3/ — round 3 (3 files, 44 KB)

`r3-verify-new.md` (verify round-2 NEW rows) · `r3-expansion-crit.md` (the BINDING refutation of x1–x6 — every correction folded into the skeleton) · `r3-quiet-pass.md` (the sweep that surfaced FAM-15).

### r4/ — round 4 (2 files, 20 KB)

`r4-verify-r3new.md` (verify the four FAM-15 rows — all confirmed; CI-DAG corrected to compute-cost) · `r4-quiet-pass-2.md` (the near-quiet second sweep, five fresh CLEAN certs).

### r5/ — round 5 + certification (1 file, 12 KB)

`r5-quiet-pass-3.md` — the closing sweep; three new CLEAN certs, one P3 into FAM-13; the STABILITY CERTIFICATION that ended the audit.

### x/ — the six expansion lanes (6 files, 136 KB)

`x1-market-assay.md` (W8 facilities) · `x2-engine-fit.md` (W13 game survey) · `x3-hint-heuristics.md` (W7 technique engine) · `x4-carousel-select.md` (W12) · `x5-progress-quality.md` (W9) · `x6-distillation.md` (W11 LOC math).

### safari/ — the Safari perf core (4 files, 56 KB)

`s1.md` · `s2.md` · `s3.md` · `crit-safari.md` — the four E7-driven profiling lanes (verified at 66% with six folded kills) that W1's mechanism section cites. These lived under the tranche-3 scratchpad (`…/scratchpad/tranche3/safari/`), the fresh Safari profile referenced as W1's anchor; copied here so W1's `safari/*.md` seed citations resolve in-tree.

## What was pruned — cited by name, kept in the scratchpad

Excluded under ballot B1 / the FAM-15 policy. Every item below is **load-bearing only as a re-derivation recipe** — its numbers are already histogrammed into the owning `.md`, and the born-RED gates in `waves/` re-run the recipe live rather than diffing a banked artifact.

| Scratchpad class | Approx size | Why pruned |
|---|---|---|
| DevTools idle-trace JSONs (`idle-wgate.json`, `idle-wgate2.json`, the r1 perf-probe out-*.json) | ~390 MB (two files alone are ~195 MB each) | the single largest bloat class the audit exists to prevent — every load-bearing number is in `r1/r1-perf.md` and `safari/*.md`; W1's gate re-traces live with the banked recipe |
| Evidence PNGs — `r1/shots/` (44), `r1/probes/*.png`, the top-level burst/diff/solved/print captures (`shots/`, `film/`, `traces/`) | ~70 MB, 400+ files | the exact class FAM-15 indicts (95% of the tracked tree in the source repo); the `.md` reports carry the file:line findings the shots illustrate, and each visual gate re-shoots on a self-served preview port |
| Probe scripts — `r1/probe-{iai-vacuous.sh,no-visual-compare.sh,difficulty.mjs,share.mjs}`, `r1/perf-probes/*.mjs`, `r1/probes/*.cjs`, `r2/probe-{codec-harden,futoshiki-density}.mjs`, `r3/firefox-smoke.mjs` | ~120 KB | the rerunnable failing-probe recipes the wave gate tables cite by name (e.g. `probe-iai-vacuous.sh`: `abs-instrs=3171444 delta=0.000000% gate=PASS` — the vacuous-green proof W2 inverts); re-derivable, and the born-RED gates re-run them at merged HEAD |
| `wasmbuild/{full,makefile,ship,v1}/` — the four wasm build profiles + their LICENSE/`.wasm`/`.js` outputs | a few MB | W5's Makefile-ship-recipe truth artifacts; the byte figures (lean 86,746 B vs source 188,095 B) are carried in `r1/r1-deps-rust.md` and the W5 wave; the `cmp` invariant re-derives them |

**Recipe locations (for the executor):** the failing probes are at `…/scratchpad/tranche4/r1/`, `…/tranche4/r1/perf-probes/`, `…/tranche4/r1/probes/`, `…/tranche4/r2/`; the Safari probes at `…/scratchpad/tranche3/safari/*.mjs`. They are the gate recipes — the waves re-run them live, they are not authoring artifacts.

## Per-subdir counts (measured at copy)

| Subdir | Files | Size |
|---|---|---|
| `registry/` | 2 | 28 K |
| `corpus/` | 2 | 16 K |
| `r1/` | 16 | 180 K |
| `r2/` | 9 | 156 K |
| `r3/` | 3 | 44 K |
| `r4/` | 2 | 20 K |
| `r5/` | 1 | 12 K |
| `x/` | 6 | 136 K |
| `safari/` | 4 | 56 K |
| **Total** | **45** | **648 K** |

Well inside the ≤ 3 MB budget the task sets and the size policy ballot B1 ratifies. No LFS. No single file exceeds ~24 KB. This is the shape FAM-15 wants — reasoning in text, captures and traces re-derivable on demand.
