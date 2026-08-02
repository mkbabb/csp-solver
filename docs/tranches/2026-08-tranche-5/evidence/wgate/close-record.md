# T5-WGATE — THE CLOSE RECORD

**Tranche 5 closes 2026-08-02.** Executed under the owner's 2026-08-01 start order (full
autonomy to WGATE; ballots default-fire; deploys authorized in the order's own words).
Every CI claim below is a run-id; every count cites its deriving script or run. The
deployment id vocabulary: ids like `801ac5de` are Cloudflare deployment ids, never
commits (D11's cure).

## Close protocol, item by item

1. **Gate table re-run in this tree** — `gate-table.md` (this dir): rust suites ok ·
   units 448/448 · doc-truth 0 RED/13 GREEN · ledger-diff 220/220 exit 0 ·
   evidence-policy PASS · golden-bytes PASS (8 goldens, 92.4/110.0 KB, paired, no
   fossils). Authoritative per-job counts = the candidate run's 18 jobs (item 2).
2. **CI pinned by HEAD SHA** — deploy candidate `81214401` = run **30752757535**,
   CONCLUSION=success, 18/18 jobs, attempt 1, read from
   `gh run view --json conclusion` in its own tool result (banked artifact:
   `ci-conclusion.sh` output, sha-pinned, run_id 30752757535).
3. **Deploy + quiet window + production re-pass** — deployed via
   `npm --prefix web/frontend run deploy -- --conclusion-file …` (deploy-gated.sh:
   gate PASSED on sha/run/conclusion/freshness, fresh build inside the script);
   Cloudflare deployment **`801ac5de`**. Production re-pass banked at
   `production-repass.txt`: dist-identity served-vs-disk arm — sudoku.babb.dev serves
   `index-ZYnCGMYLIhQw.js`, the same entry as the HEAD-built dist; five game routes
   HTTP 200 each referencing that entry; two e2e smoke rows green against the edge
   (permalink board-only restore — the wire→codec→worker chain live in production —
   and the print-affordance row).
4. **ledger-diff exits zero** — re-run at this close, 220/220 present-or-cited
   (`gate-table.md` carries the output; re-run again after this file landed —
   see the seal commit).
5. **Owner ballots** — all seven resolved or defaulted, no row riding:
   `ballot-resolutions.md`. CH-38 resolved at the W4 gate (adjudicator re-scope,
   terminal); ballots 1/2/3/5/6/7 defaulted per their dispatched terms — notably
   **CH-35 E8: the iOS claim RETIRES TO SIM-SCOPE** until the owner runs the device
   script.
6. **Script-derived counts only** — `gate-table.md` states which figure comes from
   which script and defers workspace-matrix counts to run 30752757535's jobs; no
   prose figure stands without its source.
7. **Design marks at their honest ladder position** — marks 3/5/6: OPEN,
   owner-conditional (U-10), internal work sealed (W4a/b/c), no owner words exist
   and none were synthesized. M4/M2: closed at campaign level by the executed
   re-scope; cold-reader certification NOT obtained (permanent disclosure);
   the reads remain a standing non-blocking owner invitation.

## Definition of done — the walk

- **W0–W6 gates green**: W0 `f38c5130` (run 30714344815) · W1 `e6b19a4c`→`a3ada202`
  (canary ledger complete; TIP2 30720854622) · W2 `78448760` (run 30730421234,
  18/18) · W3 `9061b8c1` (run 30734036107 att 2) · W4 `b03947ec` (run 30751444365,
  18/18 att 1; earned-100% at `evidence/w4/wave-record.md`) · W5 ratified-at-open +
  ballots resolved here · W6 `baae148b` (ledger-diff born + deploy gate born).
- **ledger-diff zero** — item 4.
- **Production deployed and re-passed** — item 3.
- **The living ledger seeded** — `docs/tranches/LEDGER.md`, 220 rows audited at
  every close since W6.6.
- **The precepts file landed** — `docs/tranches/PRECEPTS.md` (§2 laws + §3 traps,
  through the hand-rolled-wire-fixture row).
- **Marks honest** — item 7.
- **Every U/S/CH/audit row traceable** — the ledger-diff instrument's own
  guarantee, exit 0 with `--require-ledger`.

## The tranche in one paragraph

Five waves of substance (truth/record, gates-that-can-fail, the distill, a11y, the
design loop to earned-100%), one decision wave, one process wave, and this close.
The distill deleted the doomed twins (codec universal, −4,806 on the priced class);
the design loop ran passes 5–9 to an earned-100% under a fresh non-author audit;
pencil-boil shipped 0.11.2 and 0.12.0; the wire grammar was single-sourced after its
four-copy fork was caught red-handed; the blank-bake race outlived two library
generations and sits parked under its third pinning with a census verdict and one
exit (the runner rig); the contention flake class is bounded, rostered, and
no-retry by law. The record can no longer verify the record — the instrument does.

## Standing rows out of the close (none silent)

- **CH-62** KEEP-PARK, third pinning; runner-rig root-cause = the ONLY exit.
- **CH-63** WATCH, no retry; 8 instances / 13 settled-tree runs ≈ 54% (in-bound);
  a11y.spec.ts:296/:305 nearest the door.
- **Owner rows**: E8 (claim retired to sim-scope until run) · 2 dependabot highs ·
  M4/M2 standing invitation · marks 3/5/6 re-look · CH-39 landscape eye · the
  fourth ≥1024 device transaction · keypad row CHARACTERIZED (W5's decision of
  record).
- **linux-webkit long33=24** watch re-measure (perf-subset window).
- **CH-42 linux clause floor 0.05** stands until the runner's convergence at the
  new crop is measured (the magnitude step prints its number every run; branch C's
  darwin cure is sealed in this dir).

## Run-id ledger for this close

| act | sha | run / id |
|---|---|---|
| W4 seal (earned-100%) | `b03947ec` | 30751444365 (18/18, att 1) |
| CH-42 branch-C cure | `49c732bc` | 30752248440 (the mint red: golden step, crest row alone) |
| linux golden mint | `81214401` | **30752757535 (18/18, att 1 — the deploy candidate)** |
| deploy | — | Cloudflare deployment `801ac5de` (sudoku.babb.dev re-passed) |
| the close seal | this commit | its run is read from the field post-push and noted in the execution memory |
