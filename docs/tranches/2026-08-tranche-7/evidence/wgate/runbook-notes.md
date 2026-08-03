# WGATE runbook — debts banked during execution (accrete here, consume at the seal)

1. **Close-record ordering (binding):** `ledger-diff`'s TERMINALITY arm reads a bare `W<n>`
   as the CURRENT tranche — the moment the T7 close record lands, every §1 row still naming
   a T7 wave reds. The close must move those rows in the SAME commit that writes the close
   record, never after.
2. **N-12's wider scope:** `--verify-cites` covers LEDGER only. At the close, run the same
   file+row-token check over the T7 ballot-resolution record (one scoped file — the arm's
   rule is implemented and self-tested; the widening is priced here).
3. **T7 gates.json:** mint with the nine new W0 doc-truth row ids (permalink-games,
   cited-paths-exist, worker-topology, e2e-total-arithmetic, constraint-enum-variants,
   frontend-scripts-roster, bench-target-roster, redirects-rule-count,
   perf-rig-scenario-roster) + W5's ten; rename the `pencil-boil-0.9.2` row id (stale version
   literal in a label — the CH-32 class) in the same act, with the T5 gates.json left
   untouched as history.
4. **Counts block carries its SHA** (N-11's law) — derive every count at the close SHA, stamp it.
5. **Floors restamp** (W6's mechanisms): unit floor, count floors, coverage floor, golden
   count pin — numbers re-derived AFTER the last row lands anywhere in the tranche.
6. **Owner block = `ledger-diff --owner-block` output**, embedded verbatim (T7-R14).
7. **Ballots fire:** unanswered §8 rows stamp their defaults, dated; BAL-01's permanent
   clause and BAL-10's PRECEPTS row (already restamped to the default arm) get their final
   stamps; answered rows stamp the owner's word.
8. **Optional (chair's call):** move the ledger-diff CI step off the doc-truth job's wasm
   critical path into its own ~2s job beside evidence-policy.
9. **Deploy:** only via `npm run deploy` (`set -a && source ~/Programming/value.js/.env`);
   wrangler needs node@22; post-deploy `dist-identity.mjs --served https://sudoku.babb.dev`.
10. **Memory + crons:** delete the durability cron at the seal; update the campaign memory.
11. **Count reds mid-tranche are the gate working, not a defect:** every wave that adds
    tests reds `root-readme-e2e-counts`/`e2e-total-arithmetic`/`test-count-208-vs-204` until
    its seal trues the README figures — each wave-seal commit runs `check-doc-truth` locally
    and trues what its wave moved (W3: +prm-void-audition + access already on disk; W4: +6
    e2e rows + relay lane; W6: rust 28→29 binaries post-extraction); WGATE restamps final.
    Intermediate pushed heads `af508288`/`53a6b56d` red on exactly this and are so noted.
12. **The webkit contention roster is WANDERING** (three consecutive runner reds:
    futoshiki:131 ×3; a11y:490, gallery-deal:485, permalink:52, multiplayer:454 each once) —
    corroborates W3's sharding adoption; the close needs the sharding wiring landed and a
    green run under it.
13. **GATE D debts (w3/gate-d-restamp.txt, 2026-08-03)** — the 1750 restamp is provisional
    at n=2 VMs: re-derive at n≥3 runner `tbt/anchor` readings; TRANSPOSE onto the measured
    CPU anchor or refute it with the same readings; GATE D still has NO control (measured
    load exposure 3.40× — an `anchorMs` admissibility ceiling is one line and the biggest
    open perf item); price `galleryDrag`/`drawerToggle` in the same sitting (W6 §3).
14. **Self-delta arm law (w3/selfdelta-wordmark-arm-cure.txt + §ADDENDUM)** — the runner
    must prove the covered arm (linux is argued until the next push's step speaks);
    MIN_ARM_RATIO 0.10 grades the blind band closed; any future golden cropping outside
    the three DELTA_ANCHORS must register there — the hit-test makes omission a setup
    error, and the close should re-read that clause if the golden estate grew.
15. **CH-66 scheduling (2026-08-03)** — the dropped-press PRODUCT cure (wordmark dead
    ≈7% at first contact in real Safari during the bake window) must land after W7's
    seal frees the src/ surface, inside T7 — or go DATED to the owner block; do not
    close with the row silently open. The multiplayer.spec.ts unguarded-press sites
    (listed in w3/futoshiki-coldchunk-forensics.txt's addendum) convert at W4's seal —
    its file, its wave. Item 12's requirement stands, re-read: the close needs a green
    run under sharding B WITH the guarded-press helper landed — the sharding alone was
    proven insufficient (burst-forensics §8).
