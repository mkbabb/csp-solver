> **CLOSED 2026-09-17, no edit needed — by the owning lane, exactly as predicted.** `npx vue-tsc
> --noEmit` is EXIT 0 at FA1's lane end: the presence lane wired the beat and both TS6133 rows
> went with it. Kept as the record of a red that was read off FA1's lane end and was never FA1's.

# fold-FA1-1 — `vue-tsc --noEmit` is RED at the fold on a seam FA1 cannot reach

FA1's fence is five `e2e/*.spec.ts` files. Its lane-end law includes `npx vue-tsc --noEmit`
exit 0, and that gate is RED at this tree on a file no e2e lane owns.

## The exact seam

```
src/games/shared/useSession.ts(607,7): error TS6133: 'HEARTBEAT_MS' is declared but its value is never read.
src/games/shared/useSession.ts(621,10): error TS6133: 'armPresenceExpiry' is declared but its value is never read.
```

`HEARTBEAT_MS` (`:607`) and `armPresenceExpiry` (`:621`) are both declared, both carry their
own doc comment, and neither is referenced. `PRESENCE_EXPIRY_MS`, `beat` and `presenceExpiry`
beside them are declared in the same block. This is a half-written heartbeat: the constants and
the arming function exist, the beat that spends them does not.

## Whose it is

The presence lane's, in flight. `web/frontend/src/games/shared/useSession.ts` was written inside
the fold window (mtime during FA1's run), and the fold roster has a lane adding
`e2e/presence.spec.ts`. FA1 touched no `src/` file — `git status --porcelain web/frontend/src`
carries FA1's name nowhere.

## What FA1 asks

Nothing, if the owning lane's own commit wires the beat: `armPresenceExpiry` called on every
frame a peer sends and `HEARTBEAT_MS` driving `beat` closes both rows with no separate edit.
This file exists so the red is on the record with its owner named rather than read off FA1's
lane end as FA1's.

`npm run typecheck:e2e` is exit 0, and `npx eslint` is clean on all five files FA1 touched.
