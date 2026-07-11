# Evidence — scratchpad → durable path map

The loop corpus lived at a session scratchpad (`/private/tmp/claude-504/…/scratchpad/tranche3/`) that does not survive cleanup. This directory is the durable copy, opened under the **A24-G2 policy** (README §6: the tranche-II corpus was 47 MB / 287 files / 115 PNGs — prune to load-bearing from day one, not a mirror). Every wave-file seed citation of the form `pass1/…`, `pass2/…`, `pass3/…`, `audit32/…` resolves against this directory (`evidence/` is a sibling of `waves/`, both one level under the tranche root), so the correct href from a `waves/*.md` file is `../evidence/<subdir>/<file>` — e.g. `../evidence/pass3/G6-baseline-run.md`. All twelve wave files carry that resolving form. The four earliest-authored waves (W0, W2, W3, W4) once carried a stale four-up form (`../../../../pass3/…`) that overshot to the repo root; the 13 links were rewritten to `../evidence/…` at the tranche's authoring close, and every internal `.md` link across the tranche now resolves.

**Copied 2026-07-10, T3-W-evidence lane.** 110 files, 1.9 MB total — see per-subdir counts below. Confirmed under the ~5 MB ceiling by a wide margin; nothing here needs LFS.

## What's here vs what was pruned

Kept, per the task's explicit enumeration: the four spine documents (pass1 agglomeration + synthesis, pass2 agglomeration, pass3 reconciliation, audit32 synthesis) · every lane's final `.md` report (21 + 12 + 6 + 32 = 71 lanes) · the three owner-shot PNGs · the named harnesses (`probe-felt.mjs`, `fuzz.mjs`, the g10 shot set, the G6 baseline logs).

Pruned — session-scratchpad-only, not copied, cited by name in wave/appendix prose but not needed as artifacts for authoring or execution:

| Scratchpad path | Size | Why pruned |
|---|---|---|
| `pass1/p6/` | 832 K | prototype build output (before/after CSS, probe JSON, 6 PNGs) for the index.css spike — superseded by the HELD-again record itself (Q4); the record's conclusion is what's load-bearing, not the scratch build |
| `pass2/p6-accepted/` | 32 K | the accepted-variant partials tree for the same spike — same disposition |
| `pass2/shot.mjs`, `pass2/baseline-verify.log`, `pass2/hmr-dev.log`, `pass2/treatment-verify.log` | 84 K combined | pass-2's own in-lane verification runs, superseded by pass-3's G6 baseline (the citable figure set, README §1) |
| `pass3/g7-shots/` | 2.1 M | four PNGs illustrating the felt-perf trace visually; the trace's numbers (99–103 ms / 87–91 ms @4×) are what W8's gate cites, carried in `G7-felt-perf-trace.md` itself — `probe-felt.mjs` (kept) re-derives the pictures on demand |
| `audit32/a23-shots/` | 3.8 M | 20 PNGs from the UI-completeness live probe — single largest scratchpad directory; `A23-ui-completeness.md` (kept) carries the file:line findings the shots illustrate; W11 re-runs its own probe suite rather than diffing against banked screenshots |
| `audit32/a23-harness/` | 52 K | the five probe scripts that produced the above — same disposition, re-derivable |
| `audit32/f4-harness/` | 372 K | the dark-toggle SVG harness (`harness.html` + 7 zoom/compare PNGs) for F4/F5 — `f4-darkmode-toggle-svgs.md` and `F5-dark-toggle-storybook.md` (both kept) carry the findings; W9/W10 re-probe live |
| `pass3/g10-harness/` | 36 K | the five probe scripts (`probe-darkflip`, `probe-dawn`, `probe-hidpi`, `probe-switch`, `probe-toggle`) + two JSON result files behind the g10 shots — the shots themselves (kept) are the cited exhibits (T3-W7 §`g10-shots/first-select-void-400ms.png`); the scripts re-derive them |
| `p2l6shots/`, `p2l6shots-rm/`, `p4shots/` (scratchpad top level) | 1.3 M + 1.2 M + 2.7 M | intermediate prototype screenshot dumps predating the pass-3 gap-lane re-probe; superseded, never cited by path in any wave file |
| `popover-{dark,light}.png`, `probe-f1.mjs`, `vite-f1.log` (scratchpad top level) | 28 K | loose pre-pass-3 F1 exploration, superseded by `pass3/G10-design-reprobe.md`'s F1 finding |

Total pruned: roughly 12.5 MB across six directories and change — the A24-G2 lesson applied in the same session that named it.

## Path map — copied files

### Spines

| Scratchpad | Evidence |
|---|---|
| `pass1/pass1-agglomeration.md` | `evidence/pass1/pass1-agglomeration.md` |
| `pass1/synthesis.md` | `evidence/pass1/synthesis.md` |
| `pass2/pass2-agglomeration.md` | `evidence/pass2/pass2-agglomeration.md` |
| `pass3/reconciliation.md` | `evidence/pass3/reconciliation.md` |
| `audit32/synthesis-path-forward.md` | `evidence/audit32/synthesis-path-forward.md` |

### pass1 — 8 research + 6 prototypes + 7 critiques (21 lanes)

`pass1/{R1-pyo3-python-native-sota,R2-py-dissection,R3-isomorphic-dissection,R4-py-game-api-disposition,R5-fe-structure-audit,R6-be-structure-audit,R7-tranche-record-mining,R8-web-research-structure-conventions}.md`, `pass1/{proto-P1-isomorphic-excision,proto-P2-py-dead-surface-prune,proto-P3-py-stub-shipping-spike,proto-P4-fe-sudoku-game-extraction,proto-P5-pub-surface-sweep,proto-P6-indexcss-partials-under-hold}.md`, `pass1/{crit-P3-py-stub-shipping-spike,crit-proto-P1-isomorphic-excision,crit-proto-P2-py-dead-surface-prune,crit-proto-P4-fe-sudoku-game-extraction,crit-proto-P5-pub-surface-sweep,crit-proto-P6-indexcss-partials-under-hold,crit-spec-coherence}.md` → same relative names under `evidence/pass1/`.

### pass2 — 8 lanes + 4 critiques (12 lanes)

`pass2/{P2-L1,P2-L2,P2-L3,P2-L4,P2-L5,P2-L6,P2-L7,P2-L8}.md`, `pass2/{crit-be,crit-coherence,crit-fe,crit-py}.md` → same relative names under `evidence/pass2/`.

### pass3 — 6 gap-lanes + named harnesses

| Scratchpad | Evidence |
|---|---|
| `pass3/{G3-pencil-boil-pin,G5-morph-census,G6-baseline-run,G7-felt-perf-trace,G8-security-probe,G10-design-reprobe}.md` | `evidence/pass3/` (same names) |
| `pass3/fuzz.mjs` (G8's 33-case decoder fuzz) | `evidence/pass3/fuzz.mjs` |
| `pass3/g6/{criterion,criterion2,criterion3,e2e,e2e-3210,gac_timing_probe,maturin-build,pytest,rust-test}.log` | `evidence/pass3/g6/` (same names) — the G6 baseline logs W0 names explicitly (`rust-test.log` 151/0/6, `pytest.log` 27/2, `e2e-3210.log` 33/33, `gac_timing_probe.log`, `criterion3.log`; `criterion.log`/`criterion2.log` carry the `--workspace --save-baseline` rejection W6 cites, `e2e.log`/`maturin-build.log` are the supporting runs) |
| `pass3/g7-harness/{probe-felt.mjs,felt-results.json,felt-results-run1.json}` | `evidence/pass3/g7-harness/` (same names) — the W8 before/after instrument |
| `pass3/g10-shots/*.png` (18 files) | `evidence/pass3/g10-shots/` (same names) — includes `first-select-void-400ms.png`, the D3 throttled-void exhibit T3-W7 cites by exact filename |

Note: `target/criterion/*/pre-t3/` (the actual criterion baseline dirs G6/W0/W6 reference) never existed under the scratchpad — they live in the repo's own `target/` (gitignored, machine-local), not the session scratchpad. W0's "carried" language refers to the *procedure* (banked in-tree at the authoring machine), not a scratchpad artifact; nothing to copy here.

### audit32 — 32 read-only lanes

`audit32/{A1-prompts-recap,A2-prompt-recap-verification,A4-precepts-conformance,A5,A6-wave-reaudit-w2-abrogation,A7-wave-reaudit-w3,A8,A9-wave-reaudit-w5,A10-wave-reaudit-w6,A11,A12-wave-reaudit-w8-edict,A13-deferred-delineation,A14-chronically-deferred,A15-legacy-hunt-rust,A16-legacy-hunt-fe,A17-performance-fe,A18-performance-rust-wasm,A19-library-audit-fe,A20-library-audit,A21-module-structure-be,A22-module-structure-fe,A23-ui-completeness,a24-completeness,a3-prompts-recap}.md`, `audit32/{F2-completion-formulation,F5-dark-toggle-storybook,F6-game-switch-transition,F7-heart-yoshi,F8-design-system-statement,design-f1-dropdown-border,f3-completion-metadata,f4-darkmode-toggle-svgs}.md` → same relative names under `evidence/audit32/`.

### owner-shots

`owner-shots/{dropdown-border,heart,solved-star}.png` → same relative names under `evidence/owner-shots/` — the four owner design findings' staged exhibits (README §1: dropdown-frame border misregistration, golden completion, heart-in-Yoshi's-Story, T3-W9 §`owner-shots/{solved-star,heart}.png`).

## Per-subdir counts (measured at copy time)

| Subdir | Files | Size |
|---|---|---|
| `pass1/` | 23 | 336 K |
| `pass2/` | 13 | 204 K |
| `pass3/` (incl. `g6/`, `g7-harness/`, `g10-shots/`) | 8 + 9 + 3 + 18 = 38 | 868 K |
| `audit32/` | 33 | 456 K |
| `owner-shots/` | 3 | 104 K |
| **Total** | **110** | **1.9 M** |

Well inside the ~5 MB ceiling this document's own policy sets. No LFS needed.

## Addendum 2026-07-11 — the owner live audit (T3-W12)

Copied at W12 authoring; scratchpad root `…/scratchpad/tranche3/`.

### owner-audit-2 — the five owner shots (the audit of record)

`owner-audit-2/{completion-area,boil-hairline,sun-spiral,board-artifact,controls-drawer-context}.png` → same names under `evidence/owner-audit-2/` (368 K).

### addendum — the loop reports + load-bearing exhibits

`addendum/{a1-completion-perf,a2-boil-outline,a3-toggle-recut,a4-artifact,crit-design,crit-forensics}.md` → same names under `evidence/addendum/`. Exhibits carried: `a1-solved-1440.png` + `a1-completion-live.png` (the fold-clip + fragmentation exhibits), `tl-zoom.png`/`tl-crop.png` (the miter barb), and `a2-shots/` pruned to the card crops + TL zooms + `snap.txt` (the bad/before/fix/fixspec quadruple — the near-pixel-match proof T3-W12 §3 gates against). **Excluded with rationale (G2 policy):** the six a1 trace JSONs (11–58 MB each, ~190 MB total — the elimination-ladder numbers are folded into `a1-completion-perf.md` §(c); the gate re-traces live rather than re-reading these), `a1-completion-scrolled.png` (near-duplicate of `-live`), the five full-viewport `a2-shots/live-viewport-*.png` (the card crops carry the claim), `addendum/shots/desktop-1440.png` (superseded context shot). a5 (drawer) and a6 (attribution) were never produced — no files to carry; their gaps are recorded in both critiques and in T3-W12 §Provenance.

| Subdir | Files | Size |
|---|---|---|
| `owner-audit-2/` | 5 | 368 K |
| `addendum/` (incl. `a2-shots/`) | 10 + 9 | 1.6 M |

Running total ~3.9 M — still inside the ~5 MB ceiling.
