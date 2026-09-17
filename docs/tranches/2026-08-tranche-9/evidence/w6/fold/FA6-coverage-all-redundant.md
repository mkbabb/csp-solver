# FA6 — `coverage.all` decided by measurement, not by reading

Handoff `w6/handoffs/6b-2.md` §2 refused to rule on `vitest.config.ts:75` (`all: true`, an option
`CoverageOptions` does not carry at vitest 4) and handed the chair a measurement to run. The
chair's fold order: run it, and if an unimported module already reads 0% without the option, the
option is redundant — delete it and keep the header's claim. If it does not, the coverage floor
has been grading an import-scoped denominator, which is a W5 subject and not this lane's to
re-cut.

## The instrument

vitest 4.1.10, `@vitest/coverage-v8` 4.1.10. Two runs of `npm run test:unit:report -- --coverage`
from `web/frontend`, identical tree, the only difference being the two lines under test.

## The control that decides it

`all: true` present vs absent, compared on the artifact the floor actually reads
(`coverage/coverage-summary.json`):

| | files in summary | statements | branches | functions | lines |
|---|---|---|---|---|---|
| WITH `all: true` | 134 | 4170/6648 | 2187/3796 | 912/1611 | 3650/5733 |
| WITHOUT | 134 | 4168/6648 | 2188/3796 | 909/1611 | 3647/5733 |

**Zero files moved denominator** — per-file `statements.total` is identical for all 134 rows.
Three files move in `covered` (`DifficultyTally.vue` 52→50, `useThermo.ts` 16→19,
`GameCard.vue` 80→77): ordinary v8 run-to-run attribution jitter on async/timer paths, in both
directions, on a fixed denominator. A scope change cannot move `covered` down on one file and up
on another while every `total` stays put.

## The named subject

The include glob (`src/**/*.ts` + `src/**/*.vue` minus the four exclusions) enumerates 134 files
on disk. The summary carries 134. Nothing is missing from either run:

```
glob files: 134  summary files: 134  MISSING from summary: 0
```

18 of them read 0% statements in both runs. The decisive one is
`src/pencil/dev/rafInstrumentation.ts`: its only importer anywhere in `src/` is
`src/main.ts:6` (`void import('@pencil/dev/rafInstrumentation')`), and `main.ts` is itself
EXCLUDED from coverage and executed by no unit. No unit's module graph reaches it. It reads 0%
with the option and 0% without it — which is the handoff's test, answered yes.

## The verdict

The v8 provider reports the whole `include` glob by default at vitest 4. The header paragraph's
claim — *"an unimported module must read 0%, because 'collapsed five modules into one and lost
its only caller' is exactly the W2 failure the floor exists to catch"* — is TRUE of the runner
and stays. `all: true` was a second spelling of it, and a dead one: a line asserting a behaviour
through an option the runner's own types do not have.

Deleted. The header now carries the finding and this file's cite, so the next reader does not
re-litigate it from the type error alone.

**Not a W5 subject.** `scripts/check-coverage-floor.mjs` and `coverage-floor.json` need no
re-cut: the denominator this fold hands them is byte-identical to the one they were baselined
against. `npm run test:coverage:floor` green at the cure — banked in `FA6-verify.txt`.

## Raw

`FA6-coverage-denominator.tsv` beside this file — all 134 rows, `statements.total` and `pct`
under both arms, derived from the two `coverage-summary.json` artifacts rather than dumping
them (EVIDENCE-POLICY.md: text-first for anything a number can state). The last line carries
the count that decides it: `denominator rows that moved: 0`.
