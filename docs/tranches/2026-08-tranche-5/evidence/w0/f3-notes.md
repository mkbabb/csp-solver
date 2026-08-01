# W0 · row 0.3 — derivation notes

**Tree:** `e961bdb7e34fc08cb459ff6330c781dcf7c7cec3` (master, clean but for untracked T5 dirs + the two W0 scripts)
**Host:** Apple M5 Max, darwin/arm64 · **Date:** 2026-08-01 · **Lane:** Opus, under the W0 team lead

Line numbers are as of this writing; sibling W0 lanes are editing the same files, so anchor on the quoted text rather than the number.

Every figure below came off a binary or a file on this box. Nothing was copied from the audit prose, the wave spec, or the prompt; where the audit happens to agree, that's a second derivation, not the source.

Banked alongside this file:

| File | What it is |
|---|---|
| `f3-gac-ab-corpus.txt` | verbatim `cargo run -p csp-solver --release --example gac_ab_corpus`, with `/usr/bin/time -p` |
| `f3-time-sudoku.txt` | verbatim `cargo run -p csp-solver --release --example time_sudoku` |
| `f3-gac-timing-probe.txt` | verbatim `gac_timing_probe`, which **aborts** on today's bank (§a.3) |
| `f3-doc-truth-after.txt` | `node scripts/check-doc-truth.mjs` after the cures |

---

## (a) The node spine, re-stamped from the binary

### a.1 Which binary the doc cites

`docs/benchmarks.md` § Reproducing names `cargo run --release --example gac_ab_corpus` and `cargo run --release --example time_sudoku`, and its verbatim output block quotes both. Those are the invocations, so those are what ran. `cargo bench` was not run: the doc quotes no criterion figure that this row touches, and its own § Posture forbids quoting a criterion delta taken without a named `--baseline` on the same host in the same session.

Wall time: `gac_ab_corpus` 61.92 s real, `time_sudoku` sub-second, `gac_timing_probe` 84.87 s to its abort. All well inside the 10-minute clause; no subsetting needed.

### a.2 What the binary printed

```
# GAC A/B false-UNSAT corpus — 50 boards (production config: Ac3 + Mrv)
false-UNSAT (GAC off): 0/50
false-UNSAT (GAC on):  0/50
TOTAL false-UNSAT across both GAC states: 0
node-count spine (GAC off→on): 4153388 → 8222 (expected 4153388 → 8222) — HOLD
VERDICT: 0/50 false-UNSAT + spine HOLD — PASS
```

Derived from that: the spine is **4,153,388 → 8,222**, ratio 4153388 / 8222 = **505.16**, quoted as 505×. The doc read 40,513 → 4,678 (8.66×), which is 100× off on both limbs.

`time_sudoku` reproduced the backtrack/propagation counts byte-for-byte against § Kernel soundness parity (62/962, 207/789, 3/293, 0/242, 105/1539, 501/1765). Only the wall-time column moved, which is what the doc says to expect of it. The whole block was re-stamped so one stamp covers both commands.

### a.3 Provenance, dug out rather than assumed

- `d4faa412` (2026-07-13) re-cut the N=4 hard templates, `4/hard/template-0…4.json` among them.
- `602c8de9` (2026-07-13) re-minted the spine assert against that new fixture. Its own subject line: "the fixture moved, not GAC."
- So the doc's node row and its timing rows were never the same 50 boards. The timing stamp `ede25188` (2026-07-10) predates the re-cut by three days.
- The doc attributed the node row to `gac_timing_probe`. Wrong binary: the spine lives in `gac_ab_corpus`, which is also what CI asserts on (`ci.yml:140-147`). Re-attributed.

**Finding, beyond this row and worth the lead's eye:** `gac_timing_probe` no longer completes. It panics at `examples/gac_timing_probe.rs:264` — `template::N4/hard/template-1 unsolved under production config (off=false, on=true)`. GAC-off can't clear that board inside the production budget, and the probe asserts both states solve. So the **12.6–12.7× aggregate** and the **≈25.7–26.8× bucket win** aren't re-runnable as they stand. Soundness is untouched by this: `gac_ab_corpus` scores a false UNSAT only when the budget wasn't exhausted, and it reads 0/50 both ways. I disclosed the abort in the doc with its stamp and left the two figures standing under their `ede25188` stamp; retiring or re-deriving them is a decision above this row (it wants either a budget-aware probe or a re-cut-era re-measure).

### a.4 What moved in `docs/benchmarks.md`

| Site | Was | Now |
|---|---|---|
| table, node row | `40,513 → 4,678 (8.66× fewer)` · source `ibid.` | `4,153,388 → 8,222 (505× fewer)` · source `gac_ab_corpus` @ `e961bdb7` |
| table, bucket row | `ibid.` (dangling once the row above was re-sourced) | `gac_timing_probe` @ `ede25188`, named outright |
| §GAC prose | `gac_ab_corpus` "reports false-UNSAT counts only… not the source of the timing rows" | reports counts **and** the spine; named as the node row's source |
| after the table | absent | the two-stamps-two-banks paragraph, with `d4faa412` / `602c8de9` and the probe abort |
| §Reproducing comment | "reports false-UNSAT counts only, not timing or search-node counts" | counts and spine, no timing; points at the right row |
| verbatim block + stamp | `c14995eb`, 2026-07-10; old `VERDICT: 0/50 — PASS`, no spine line | `e961bdb7`, 2026-08-01; both commands' live output including the spine line |
| §Kernel soundness parity | "re-derived locally at c14995eb" | "re-derived locally at e961bdb7… spine HOLD" |

No meta-vocabulary entered the file: SHAs and dates carry the provenance, so the meta-leak-zero property holds.

---

## (b) The lean-wasm figure at its four sites

### b.1 Derivation

```
$ wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm            → 122385
$ wc -c web/frontend/dist/assets/csp_solver_wasm_bg-B_bsll75.wasm → 122385
$ shasum -a 256 …  both → cdabecfb240b63ea984f152956d12d2c98e0df8f92d46f6cc788b4de5297f9b2
```

**122,385 B on darwin.** The identity claim (`pkg/` byte-identical to the shipped `dist/` asset) holds by sha256, not by length alone. `scripts/check-doc-truth.mjs` derives the same 122,385 B off the same artifact independently.

The artifact is the right one to measure:

- it's the **lean** build — `pkg/csp_solver_wasm.d.ts` exports 10 solve/generate entry points across all five families and **zero** `solveAssignmentCop`;
- it's **current** — last touch to `csp-solver/src`, `csp-solver/wasm/src`, or either `Cargo.toml` is `c49a73ca` (2026-07-15); the artifact's mtime is 2026-08-01 03:52, so it postdates its own sources, and `e961bdb7` is docs-only over the audit tree;
- it's what the frontend actually loads — `web/frontend/node_modules/@mkbabb/csp-solver-wasm` is a symlink to `csp-solver/wasm/pkg`.

No rebuild was run. A rebuild would have clobbered the one artifact that currently proves the `pkg/`↔`dist/` identity, and the row permits deriving from the on-disk build.

Delta and headroom, re-derived: 122,385 − 121,855 = **+530 B** over the darwin figure the docs carried. Band headroom 127,500 − 122,385 = **5,115 B** (4.18%). Analytic ceiling headroom 124,500 − 122,385 = **2,115 B**. Both bands hold; neither was touched.

### b.2 The runner half, and why it kept its number

124,091 B is runner-measured and **not derivable on this box**. Provenance: the twiggy lane's own echo at the T4 gate SHA `d70073f3`, banked verbatim in `docs/tranches/2026-07-tranche-4/evidence/wgate/g2-counts.md:140` (`lean artifact raw size: 124091 B`) and tabled at `:219`. Against that same gate's darwin build it's +2,236 B (124,091 − 121,855), the known toolchain divergence. It hasn't been re-measured since, so every site that quotes it now says whose measurement it is and when; the lane echoes its live `$RAW` each run regardless.

### b.3 The four sites

| Site | Was | Now |
|---|---|---|
| `docs/benchmarks.md:51` (§ Wasm artifact sizes) | 121,855 B darwin @ `826f16e3`; "the CI runner measures 124,091 B" | 122,385 B darwin @ `e961bdb7` + sha256 identity; runner 124,091 B stamped to `d70073f3` with the +2,236 B delta and a note that it's stale-by-absence |
| `csp-solver/wasm/README.md:57` | "measures 121,855 B", no platform | "measures 122,385 B on darwin (`wc -c pkg/…`, measured at e961bdb7, 2026-08-01)" plus the runner-adds-a-couple-KB clause |
| `csp-solver/wasm/pkg/README.md:57` | same text (wasm-pack copies the crate README) | re-synced by `cp`; `diff` clean, so the npm tarball's README stops shipping the stale figure |
| `.github/workflows/ci.yml:461` (lean-band comment) | "darwin measures 121,855 B" | "darwin measures 122,385 B at e961bdb7"; the `runner measures 124,091 B` phrasing kept intact (see the trap below) |

The darwin-vs-runner distinction is preserved everywhere the doc drew it. The crate README never drew it; it now carries the platform qualifier without pretending to a runner figure.

---

## (c) CH-32 — the `ci.yml` band comment

### c.1 The defect

`.github/workflows/ci.yml:403-416` claimed `wasm-release` "yields 222,436 B full / 90,602 B lean" as a present-tense fact. Both limbs are dead:

- the lean literal was **31,783 B** off the artifact (122,385 − 90,602);
- `docs/benchmarks.md` itself declares 222,436 B stale and says not to quote it as current, so the workflow was quoting a number its own canon had retired;
- the full module's last real measurement is **227,385 B**, taken by this very lane on the runner at `d70073f3` (`g2-counts.md:141` `full module raw size: 227385 B`; tabled `:220` and `WGATE-record.md:51`), inside both enforced bands.

Booked at 2026-07-15, rode three closes, and the P1 patch edited the same file without refreshing it.

### c.2 The cure

Comment-only, and mechanical rather than cosmetic. The comment no longer restamps a current size at all: both `run:` steps already print the size they measured, so the block now carries the rationale (`wasm-release` is required; plain release measured 270,179 B at T2, over the 240 KB fail budget), the non-rotting architectural fact (the assignment surface's Hungarian dispatch drags in `ndarray`), the last figure of record with its gate SHA, and the prior re-measures demoted to an explicitly dated historical log. That's the class cure the second-occurrence rule asks for: stop hand-copying measurements into comments.

**The enforced band values did not move.** `-gt 240000`, `-gt 230000`, `-gt 127500` are all untouched; the script re-derives them from the workflow's own guards as full fail >240,000 / warn >230,000 / lean fail >127,500.

### c.3 Comment-only, proved

```
$ git diff -U0 .github/workflows/ci.yml | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' \
    | grep -vE '^[+-][[:space:]]*#' | wc -l
0
```

Zero non-comment changed lines, over both comment edits (the CH-32 block and the lean-band block). The workflow still parses: `yaml.safe_load` yields the same 11 jobs (`build-lean-wasm, cargo-audit, e2e, frontend, iai, lint, py-compile, py-runtime, rust, twiggy, wasm`).

### c.4 A trap this row nearly set, caught and closed

`check-doc-truth.mjs`'s `deriveBands()` reads each budget by scanning **25 lines** from its `- name:` anchor for `-gt (\d+)`. My first lean-band comment ran four lines longer and pushed `-gt 127500` to distance 25, exactly one line out of the window: the gate silently re-derived the lean band as **>0 B** and still printed GREEN. Tightened the comment back to distance 23 and the derivation reads 127,500 B again.

Two things follow, both for the lead:

1. **Standing trap for the ledger:** a comment edit in `ci.yml` can silently break a *derived* band figure without failing anything. Anyone editing comments near a budget anchor re-runs `check-doc-truth.mjs` and reads the `derived:` line, not just the verdict.
2. **Script row for whoever owns `check-doc-truth.mjs`:** the fixed 25-line window is brittle, and a `null`/0 band should be loud rather than GREEN. Not touched here, since that file belongs to row 0.2's lane and edits would collide.

---

## Gate state after the cures

`node scripts/check-doc-truth.mjs` → **9 GREEN / 1 RED**, both of this row's rows green:

```
GREEN  lean-wasm-4-sites      derived: 122,385 B ← csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm
GREEN  ci-band-comment-406    derived: full fail >240,000 B / warn >230,000 B · lean fail >127,500 B;
                              lean artifact 122,385 B; canon-declared stale: 222,436 B (docs/benchmarks.md:53)
```

The lone RED is `test-count-208-vs-204` at `csp-solver/README.md:216` (204 static `#[test]` vs a quoted 208 with no doctest split declared, 26 binaries vs a quoted 28). That's another lane's file and another row's charter; `docs/benchmarks.md:45-46`'s own 208/26 pair is not flagged.

## Carried forward, deliberately not touched

| Item | Why it stayed |
|---|---|
| `ci.yml:472` echo, `(runner-measured 124,091 B; fail >127,500)` | it's a `run:` line, not a comment; touching it would break this row's comment-only law. The honest cure is deleting the literal, since the line already prints the live `$RAW`. Wants a row that may edit non-comment lines. |
| `docs/benchmarks.md` full-module paragraph | the audit adjudicated it TRUE (the doc already self-flags 222,436 B). Rewriting it would also feed 227,385 B into the gate's stale-figure scraper, which reads any line carrying both "stale" and a byte figure. |
| `csp-solver/wasm/README.md:38` (`make wasm` documented as the full build, Makefile builds lean) | audit S12, not this row. Ships in the npm tarball, so it wants an owner. |
| `csp-solver/wasm/Makefile:16` (`--no-default-features` = "sudoku + futoshiki only", five families ship) | audit S13. Same hand-copied-comment class as CH-32; a source comment, and no row ordered it. |
| `csp-solver/benches/iai_queens.rs:8` + `docs/benchmarks.md:86` quoting 1,585,722 against the enforced golden 1,529,452 | audit S14. Same class again, third site; wants a row. |
| `gac_timing_probe`'s two wall-time rows | the harness aborts (§a.3). Disclosed in the doc, not silently retired. |
