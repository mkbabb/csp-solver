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
