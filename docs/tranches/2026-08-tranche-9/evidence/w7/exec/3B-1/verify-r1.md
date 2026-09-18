# 3B-1 · NON-AUTHOR VERIFY, round 1 — REPAIR

Verifier did not write the cure. Every number below is the verifier's own re-measurement on
`w7/exec` at `0a08a3cf`, against the author's own HEAD control build.

**Verdict: REPAIR** — one MUST, and it is a sentence, not a line of code. The mechanism, the
π identity and the DELTA all reproduce; one claim about the SECOND consumer does not.

## What was re-run, and what it read

| arm | command (bare, no pipe) | verifier's result |
|---|---|---|
| the row RED at the parent | parent `BoardHost.vue` checked out to `BoardHostVerifyHead.vue`, the row copied beside it importing that file, `npx vitest run src/games/shared/BoardHostVerifyHead.authors.test.ts` | **Test Files 1 failed (1), Tests 5 failed \| 2 passed (7)** — the same five assertions, the same messages (`expected [ '0', '1', '2', '3' ] to not include '1'`, `… to deeply equal [ '0' ]`). Both temp files deleted; worktree clean. |
| unit battery at the cure | `npx vitest run` | exit 0 — **Test Files 67 passed (67), Tests 817 passed (817)** |
| typecheck | `npx vue-tsc -b --force` | exit 0 |
| prettier / eslint / boundary / copy / live-regions / motion | `npm run lint`, `lint:eslint`, `lint:boundary`, `lint:copy`, `lint:live-regions`, `lint:motion` | all exit **0** |
| goldens vs the cured dist | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4259 npx playwright test -c playwright-golden.config.ts` | exit 0 — **4 passed**, no `--update-snapshots`, `git status` clean after (no baseline moved) |
| presence red, HEAD control | `presence.spec.ts:177` against the **HEAD dist** on :4258 | **1 failed** — the pre-existing red reproduces off this branch. Named, not adopted. Author's claim upheld. |
| session specs, BOTH engines, cured dist | `multiplayer.spec.ts` + `follow-still-authorship.spec.ts`, chromium + **webkit** | **35 passed, 2 skipped, 1 failed** — every webkit row green. The one red is `multiplayer.spec.ts:320` (chromium), which on this machine reds **identically against the HEAD dist** run alone at one worker (cured ×2 red, HEAD ×1 red): `digitAt(a, cell)` never returns `"6"`. Symmetric, environmental, not this cure. The author's log has that row green, so it is a local-arm instability, not a regression either way. |

**Bundle forensics (served bytes, not file names).** :4259 served `index-DNGqF0dwwhHF.js` and
carries the narrowing —
`x in r.model.solvedValues.value||r.model.givenCells.value.has(x)||(r.model.values.value[x]??0)!==0&&(y[x]=P)`;
:4258 served `index-9rZPzI5DEcpe.js` and carries `cellAuthors.value)` bare. The two dists are
the two sides of the claim.

**MAIN tree untouched.** `web/frontend/dist/index.html` still names `index-9rZPzI5DEcpe.js`,
mtime 13:53 (W8 §8.1's pinned control intact); main's `git status` is byte-for-byte the set it
carried at the lane's open. Worktree `git status --porcelain` is empty at `0a08a3cf`.

## π — re-measured, and in a SECOND engine

The author measured chromium. The verifier re-took the census with its own rig
(`scratchpad/verify-census.mjs`, same structural-path keying, `reducedMotion: 'reduce'`, 2.5s
settle, the same pinned `?board=` permalink) at 1280×800, **HEAD dist :4258 vs cured dist :4259**,
in chromium AND webkit:

```
chromium  board-1280x800     rects 1089/1089   max|Δ| 0.00px
chromium  gallery-1280x800   rects 1807/1807   max|Δ| 0.00px
webkit    board-1280x800     rects 1089/1089   max|Δ| 0.00px
webkit    gallery-1280x800   rects 1807/1807   max|Δ| 0.00px
WORST across both engines: 0.00px over 5,792 rects, identical key sets
```

The cure claims no resting pixel and moves none, in both engines. The author's 390×844 pair was
not re-taken; the mechanism is viewport-free and the 1280×800 pair is exact in two engines.

## DELTA — re-driven on the real two-tab arm

The verifier ran the author's probe itself against both dists (two pages, one chromium context,
`?wire=local`, the room minted from the product's own verb, B hovering a cell of each kind):

| hovered cell on B | HEAD dist :4258 | cured dist :4259 |
|---|---|---|
| the SOLVER-filled cell, ledger-stamped to the peer | `.attribution-tape` count **1**, text `underground-wombat` | count **0** |
| the peer's own live digit | count **1**, text `underground-wombat` | count **1**, text `uptight-cow` |

Peer slug read off the roster both runs, so the tape's text is checkable rather than assumed.
Different slugs from the author's run (they are minted per session) — same shape, same numbers.
All four cited frames were opened: each shows exactly the count and the text the README pins to
it (the HEAD crops show the washi label under a solver-ink glyph; the cured solved-cell crop
shows the hovered glyph with no label; the cured live-digit crop shows `enchanting-thrush`).
4 crops, 103,559 bytes total — inside the DELTA budget.

## The mechanism, audited rather than taken

- Field names are the real ones (`defineGame.ts:52/53/66/91`), and the three predicates are the
  SAME ones the cell's own kinds are bound from at `BoardHost.vue:298-299`
  (`givenCells.value.has(String(pos))`, `String(pos) in solvedValues.value`), so the tape and
  the cell can no longer disagree about what kind a square is.
- `solvedValues` is solver-ink membership, never a solution dump: `solve()` and `fillForced()`
  add only cells they filled from empty (`useGameState.ts:667-670`, `:756-762`), and
  `applyCellValue` STRIPS the key the moment anybody overwrites it (`:482-484`). A peer writing
  over a revealed cell therefore gets their claim back — the cure introduces no false negative
  there. A remote write lands through that same primitive (`sessionSource.applyValue` →
  `applyCellValue` / `applyHintInk`, `:374-376`), so the narrowing sees the wire's writes exactly
  as it sees the keyboard's.
- The README's supporting claim that a revealed digit visibly wears the solver's ink is true at
  the source: `HandwrittenGlyph.vue:83` — `if (props.isSolved) return "url(#solver-ink)"`, which
  outranks the peer's `--color-user-ink` rebinding. So the tape's new silence leaves no square
  painted in a hand nobody is allowed to name.
- The cure is the handoff's option A **verbatim**, including its comment. Option B's cost (a new
  prop on one consumer) is stated correctly.
- No e2e spec names `.attribution-tape`, `cellAuthors`, `author-name` or `authorName` — verified
  by grep over `web/frontend/e2e/`. Nothing was widened, because nothing was there; the regression
  gate for this cure is the unit row, and it is in the battery CI runs.

## Findings

### MUST-1 — the record claims a second cured surface that was already true

The row's file header states the defect was on two rendered surfaces: *"the map the board reads
claimed a peer over cells they never wrote — on the washi tape (`cell-authors` → `GameBoard`) and
in the cell's own name (`author-name` → the cell)"*, and the README repeats the framing. The cell's
own name was **not** claiming a peer at `aab67b92`. `DigitCell`/`useGameCell` already drop the
authorship clause for exactly these three kinds (T9-W3 §3.3), and
`DigitCell.attribution.test.ts` pins it — green at HEAD, untouched by this commit:

- `isSolved: true, authorName: "brave-otter"` → `"Row 2, column 3, solver's answer 4"`
- `isGiven: true, authorName: "brave-otter"` → `"Row 2, column 3, given clue 4"`
- `value: 0, authorName: "brave-otter"` → `"Row 2, column 3, empty"`

The handoff says so itself ("the name's kind-branch in `useGameCell` stays either way"), and the
cure's own comment in `BoardHost.vue` says so ("which is why the cell's own name already dropped
the clause at §3.3") — the two records disagree with each other. The born-RED row's `named()`
assertions run against a **stub cell that echoes the prop**, so they prove a prop narrowed, not a
sentence corrected; a reader of the row would take them for a spoken-surface cure.

Consequence if unrepaired: the chair's ledger records 3B-1 as curing two lying surfaces when it
cures one, and a later reader could conclude W3 §3.3 had not landed.

**Fix (no code change):** one sentence in `README.md` and in the test-file header — at HEAD the
rendered accessible name already spoke the truth for all three kinds (cite
`DigitCell.attribution.test.ts`), so narrowing the second consumer is defence in depth and
surface-agreement at the source, and the ONE rendered surface this cure moves is the tape. The
`named()` rows should say they hold the prop, not the sentence.

### NOTE-1 — webkit is narrowed, not closed

The author ran no webkit arm. The verifier added two: the rect census above (0.00px) and the
session specs against the cured dist (every webkit row green). The tape DELTA itself is still
chromium-only — the probe hard-codes `chromium`, and the tape is one CSS box with one
fine-pointer media query and no engine branch. Nothing here measured the tape in webkit, so
nothing here claims it.

### NOTE-2 — the computed's dependency set widened

`cellAuthors` used to wake on the ledger alone; it now wakes on `values`, `givenCells` and
`solvedValues` too, so it re-runs and allocates a fresh object on every digit write — including a
solo board, where the loop is over `{}` and the fresh `{}` still pushes a new prop identity to
`GameBoard`. `BoardHost` already re-renders on `values`, so the additional work is a ≤81-step
loop per keystroke. Not measured as a regression, and no perf gate moved; recorded so the next
reader of this seam knows the wake-up set changed.

### NOTE-3 — two session rows are red on this machine, both symmetric

`presence.spec.ts:177` reds against the HEAD dist (verifier's own run) — the author's
pre-existing claim holds. `multiplayer.spec.ts:320` also reds against both dists here, alone at
one worker, where the author's log has it green. Neither red is attributable to the cure; both
are the local session arm, and the chair should know the arm is unstable on this box rather than
read the author's single green as the arm's steady state.

### NOTE-4 — the local excludes are repo-wide

The lane's scratch paths (`web/frontend/.vite-exec.config.ts`, `dist-before/`, `.vite-cache/`,
`playwright-exec.config.ts`) were appended to `.git/info/exclude`, which the main tree shares.
Confirmed present. Harmless for this cure; it hides those names in the main tree too, and it
outlives the lane unless someone prunes it. The author names this in their gaps.

## Not re-measured

- The 390×844 census (author's numbers stand; mechanism is viewport-free and 1280×800 is exact
  in two engines).
- The tape on a peer-stamped GIVEN cell live — a deal writes no op, as the author says; the unit
  row's cell `2` is the only holder, and it is a real hold.
- The full e2e suite (the :3000 `webServer` is outside the port fence, as declared).
- `test:font-coverage` (the author's exit 0 stands; nothing in this cure touches a rendered
  string).

Servers started by this verify (`vite preview` on :4258 and :4259) are killed; both ports free.
The only preview processes left on the box are the w8-bake lane's, on :4252/:4253.
