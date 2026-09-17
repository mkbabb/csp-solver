> **SPENT 2026-09-17, by the chair fold (lane Restamp).** All four seams re-measured at the fold close and all four are CLOSED. (1) prettier on `../../scripts/check-doc-truth.mjs` — `npm run lint` EXIT 0 over `src/ scripts/ ../../scripts/ ../relay/`; the owning lane formatted it. (2) `useSession.ts:607,621` — `npx eslint .` EXIT 0 and `npx vue-tsc --noEmit` EXIT 0; the presence lane (FA4) wired the heartbeat and the dead bindings went with it. (3) `check-copy-register.mjs` — EXIT 0, and it is prettier-clean under the same lint. (4) The `web/frontend/README.md` scripts pin, which this file correctly named as the Restamp lane's: landed here, `21 .mjs` → `22 .mjs` at :56, and `check-doc-truth.mjs`'s `directory-count-claims` row is GREEN. CAVEAT the chair owns: the 22nd script, `web/frontend/scripts/check-live-regions.mjs`, is UNTRACKED — the pin is true of the disk and becomes a lie if that file is not staged with this fold.

# FOLD-FA6-1 → `scripts/check-doc-truth.mjs` is unformatted, and it reds `npm run lint`

Not the coverage handoff 6b-2 §2 anticipated. That measurement came back YES — `coverage.all` is
redundant at vitest 4, it was deleted, the denominator did not move, and the W5 floor needs no
re-cut (`evidence/w6/fold/FA6-coverage-all-redundant.md`). No handoff was owed for it. This file
is the one seam FA6 found that it may not close.

## The red

From `web/frontend`, bare:

```
$ npm run lint
Checking formatting...
[warn] ../../scripts/check-doc-truth.mjs
[warn] Code style issues found in the above file. Run Prettier with --write to fix.
EXIT=1
```

`npm run lint` is `prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/
../relay/`, and the repo-root `scripts/` tree has been in that scope since long before this
tranche. The `frontend` lane runs it. As the working tree stands, **the chair's commit reds CI.**

## It is a working-tree edit, not a HEAD condition

HEAD's own copy of the file is clean — measured, not assumed:

```
$ git show HEAD:scripts/check-doc-truth.mjs > /tmp/head-check-doc-truth.mjs
$ npx prettier --check --config .prettierrc.json /tmp/head-check-doc-truth.mjs
All matched files use Prettier code style!
EXIT=0
```

```
$ git diff --stat scripts/check-doc-truth.mjs
 scripts/check-doc-truth.mjs | 199 +++++++++++++++++++++++++++++++++-----
 1 file changed, 191 insertions(+), 8 deletions(-)
```

So a lane in this fold added 191 lines to the doc-truth gate and did not run the formatter over
them.

## The cure, and why FA6 did not apply it

From `web/frontend`:

```
npx prettier --write --config .prettierrc.json ../../scripts/check-doc-truth.mjs
```

FA6's fence names five frontend files, `ci.yml` and `web/frontend/README.md`. `scripts/
check-doc-truth.mjs` is none of them, and it is mid-flight in another lane's hands — reformatting
191 lines someone is still writing is how two lanes lose each other's work (6b-1's own reasoning,
one wave earlier). Whichever lane owns those insertions should run the line above in the commit
that carries them.

## While the chair is in that file

`node scripts/check-doc-truth.mjs` is **4 RED / 38 GREEN** at this fold. One row names a file FA6
edited and is still not FA6's to cure:

```
RED    directory-count-claims
       web/frontend/README.md:56  scripts/ 21 .mjs → web/frontend/scripts has 22
```

The claim went stale because W3 landed `web/frontend/scripts/check-live-regions.mjs` (untracked:
`git ls-files` counts 21, the directory holds 22), not because of anything this lane wrote. The
README pins belong to the Restamp lane and FA6's fence forbids them by name. The line moved from
`:53` to `:56` under FA6's three new tree rows (`tsconfig.e2e.json`, `tsconfig.node.json`,
`config-node.d.ts`) — the count itself is untouched.

The other three (`root-readme-e2e-counts`, `e2e-total-arithmetic`, `index-css-bound`) name no
file FA6 touched.

## And one more, which appeared DURING this lane's verify pass

`npx vue-tsc --noEmit` and `npx eslint .` were both EXIT 0 at 11:55. At 12:07 both were red on
the same two bindings, in a file FA6 does not touch:

```
src/games/shared/useSession.ts(607,7):  error TS6133: 'HEARTBEAT_MS' is declared but its value is never read.
src/games/shared/useSession.ts(621,10): error TS6133: 'armPresenceExpiry' is declared but its value is never read.
  607:7   error  'HEARTBEAT_MS' is assigned a value but never used       @typescript-eslint/no-unused-vars
  621:10  error  'armPresenceExpiry' is defined but never used           @typescript-eslint/no-unused-vars
```

Neither name exists in `git show HEAD:web/frontend/src/games/shared/useSession.ts`, and the file
is ` M` in the worktree — a live edit by whichever lane owns the presence/heartbeat seam. Exactly
the shape 6b-1 named one wave earlier, now in `src/` instead of `e2e/`: two gates saying the same
thing independently about a helper written for a row that has not landed yet. It reds the
`frontend` lane as it stands. Cure it, or use it, in the commit that carries the file — and NOT
by renaming to `_`, for 6b-1's reason.

`web/frontend/scripts/check-copy-register.mjs` is in the same state and is still moving: 12:01
reported `NARRATION_CALLS` (:239) and `callArgs` (:260), 12:02 reported `m` (:319). A lane is
writing it as this is banked, so the chair should read `npx eslint .` fresh rather than trust
these line numbers — the durable claim is only that the file carries unused-binding reds and is
` M`. FA6 does not touch it either.

**The four files FA6 touched are EXIT 0 under `npx eslint` in every run**, and FA6's own gates
(`typecheck:node`, `typecheck:e2e`, `typecheck:relay`, `lint:lanes`, `lint:knip`, `lint:copy`,
`test:coverage:floor`, `ci.yml` at 18 jobs) are all EXIT 0. Full log:
`evidence/w6/fold/FA6-verify.txt`.
