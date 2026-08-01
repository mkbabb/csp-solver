# T5-WGATE — THE CLOSE THAT CANNOT LIE

The T4 close claimed 100% and dropped nine rows; the second occurrence made it a class defect (chronic-ledger §2d). This gate replaces trust with an instrument.

## The ledger-diff instrument (built at W5, wielded here)

`scripts/ledger-diff.mjs` — inputs: (1) the close's disposition ledger, (2) `evidence/audit/r1/chronic-ledger.md` CH-01…61, (3) `evidence/audit/r2/prompt-recap-matrix.md` U/S rows + the 137-row matrix, (4) `docs/tranches/LEDGER.md` (the living ledger, W6.6). Every input row must be present-or-cited in the close ledger or the tool exits nonzero, printing the orphans. **Born RED against a deliberately-omitted canary row** at W5; green at the close means arithmetically zero drops — the record no longer verifies the record.

## Close protocol (the banked laws, mechanized where possible)

1. Full gate table re-run: every wave's gates green IN THIS TREE, each with run-id/output banked — no gate cites a stale run (numbers re-derived at citation, lessons rule 5).
2. CI: run pinned by head SHA; conclusion read from `gh run view --json conclusion` in its own tool result; no pipe-gating (CH-57's mechanized form from W6.2 in force for any deploy).
3. Deploy (owner-authorized, `npm run deploy` only) + the ~2-minute quiet window + production re-pass of the gate subset that can run against the edge; production state recorded with deployment-id VOCABULARY (D11's cure — never in commit position).
4. The ledger-diff instrument exits zero.
5. Owner ballots: every W5 BALLOT row resolved or its stated default fired and recorded. No row rides.
6. The close record states counts that a script derived (`g2-counts` discipline), and the WGATE record's CI claims cite run-ids only — never prose ("green throughout" died at D2).
7. Design marks in the close claim ONLY what U-10 permits: owner-re-looked marks close; the rest state their exact ladder position.

## Definition of done for the tranche

W0–W6 gates green · ledger-diff zero · production deployed and re-passed · the living ledger seeded · the precepts file landed · marks at their honest ladder state · every U-row, S-row, CH-row, and audit family row traceable to a disposition in this folder.
