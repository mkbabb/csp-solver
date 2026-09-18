# 3B-1 · NON-AUTHOR VERIFY, round 2 — ACCEPT

Round 2 verifier wrote none of this cure and none of repair r1. Every number below is this
verifier's own re-measurement in the worktree at `881be039`, against a HEAD control this
verifier built itself. Logs under `verify-r2/`.

**Verdict: ACCEPT** — zero BLOCKING, zero MUST. Round 1's MUST is discharged at the record and
at the row's header; the mechanism, π, the DELTA and every gate reproduce, and the DELTA now
reproduces in both engines off this verifier's own rig. Five NOTEs, all for the chair's ledger,
none fixable-inside or blocking.

## The strongest check: both dists rebuilt from source, byte-for-byte

Rather than take either party's dist, this round rebuilt both sides in the worktree with a
private cache (`--config .vite-r2.config.ts`, `cacheDir` under the worktree, both scratch trees
deleted afterwards):

| build | source | emitted bundle | sha256 vs the author's |
|---|---|---|---|
| HEAD control | `aab67b92`'s `BoardHost.vue` checked out, built, file restored | `index-9rZPzI5DEcpe.js` | same name as main's pinned dist (mtime 13:53, W8 §8.1's control) |
| cured | the worktree at `881be039` | `index-DNGqF0dwwhHF.js` | `55857b73…fd3fbfa3` — **identical** to `dist/assets/index-DNGqF0dwwhHF.js` the author served |

So the author's two served dists were the two sides of the claim, and r1's "π needs no re-measure,
the bundle is byte-identical" is not an assertion to be taken — it reproduces from source.

Served bytes carry the narrowing on one side and not the other:
`solvedValues.value||r.model.givenCells.value.has(x)||(r.model.values.value[x]??0)!==0&&(y[x]=P)`
on :4259; bare `cellAuthors.value)` on :4258.

## Re-run, bare, exit codes read

| arm | command | this verifier's result |
|---|---|---|
| the row RED at the parent | parent `BoardHost.vue` → `BoardHostR2Head.vue`, the row copied beside it importing that file | **exit 1 — Test Files 1 failed (1), Tests 5 failed \| 2 passed (7)**; `expected [ '0', '1', '2', '3' ] to not include '1'` (:162), `… to not include '2'` (:169), `… to not include '3'` (:176), `… to deeply equal [ '0' ]` (:185), `… to deeply equal [ '0', '3' ]` (:221). Both temp files deleted; worktree clean. |
| the row GREEN | `npx vitest run src/games/shared/BoardHost.authors.test.ts` | exit 0 — Test Files 1 passed (1), Tests 7 passed (7) |
| unit battery | `npx vitest run` | exit 0 — **Test Files 67 passed (67)**, Tests 817 passed (817) (`verify-r2/vitest-full-r2.txt`) |
| typecheck | `npx vue-tsc -b --force` | exit 0, empty log |
| M16 copy | `npm run lint:copy` | exit 0 — "0 em/en dashes and 0 unadmitted jargon in product copy (2 admitted…)", self-test controls all as required (`verify-r2/lint-copy-r2.txt`) |
| prettier / eslint / boundary / live-regions / motion | `npm run lint`, `lint:eslint`, `lint:boundary`, `lint:live-regions`, `lint:motion` | all exit **0** |
| goldens vs the cured dist on :4259 | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4259 npx playwright test -c playwright-golden.config.ts` | exit 0 — **4 passed**, no `--update-snapshots`; `git status` after showed only this verifier's own scratch, no baseline moved (`verify-r2/goldens-r2.txt`) |
| full e2e / session specs | — | **NOT RUN** this round (the :3000 `webServer` is outside the fence; r1 ran them and found the arm flaky symmetrically) |

## π — re-taken, one viewport, BOTH engines, own rig

`verify-r2/r2-census.mjs` (this verifier's, not the author's probe): every element's
`getBoundingClientRect` keyed by structural path, 1280×800, `reducedMotion: 'reduce'`, 2.5s
settle, the same pinned `?board=` permalink, HEAD dist :4258 vs cured dist :4259.

```
chromium  board     keys 1089 / 1089   shared 1089  onlyA 0  onlyB 0   max|Δ| 0.00px
chromium  gallery   keys 1807 / 1807   shared 1807  onlyA 0  onlyB 0   max|Δ| 0.00px
webkit    board     keys 1089 / 1089   shared 1089  onlyA 0  onlyB 0   max|Δ| 0.00px
webkit    gallery   keys 1807 / 1807   shared 1807  onlyA 0  onlyB 0   max|Δ| 0.00px
WORST across both engines: 0.00px over 5,792 rects, identical key sets, zero orphan keys
```

The author's counts (1089 / 1807) reproduce exactly, in both engines. 390×844 was not re-taken
this round; the author's and r1's numbers stand and the mechanism is viewport-free.

## DELTA — re-driven by this verifier, both engines, both dists

`probe/tape-delta.mjs` read first (it hovers the real cell on page B and counts `.attribution-tape`
in the DOM, with the peer's slug read off B's roster; the live-digit hover in the same run is the
control that keeps a count of 0 from being a dead page):

| engine | hovered cell on B | HEAD dist :4258 | cured dist :4259 |
|---|---|---|---|
| webkit | the SOLVER-filled, peer-stamped cell | count **1**, text `important-guan` | count **0**, text `""` |
| webkit | the peer's own live digit | count **1**, text `important-guan` | count **1**, text `safe-stork` |
| chromium | the SOLVER-filled, peer-stamped cell | count **1**, text `zoophagous-tarantula` | count **0**, text `""` |
| chromium | the peer's own live digit | count **1**, text `zoophagous-tarantula` | count **1**, text `formidable-alligator` |

Four runs, all exit 0, slugs read off the roster each run (different from the author's and from
r1's — they are minted per session). r1's webkit claim is upheld by an independent run.

All four banked crops were opened. `head-solved-cell-tape-claims-peer.png` shows the washi label
reading `imperial-rodent` beneath a hovered cell whose digit is in solver ink; `cured-solved-cell-no-tape.png`
shows the same hover with no label; the two live-digit crops show the label kept
(`imperial-rodent` at HEAD, `enchanting-thrush` cured) over a digit in the peer's own hue. Each
crop shows what the README pins to it. 4 crops, 108 KB on disk — inside the DELTA budget.

## The mechanism, audited independently

- **No false negative.** `solve()` writes `newlySolved` only where `values[pos] === 0`
  (`useGameState.ts:662-670`) and `fillForced()` skips any non-empty cell (`:754`), so
  `solvedValues` is never a solution dump — a peer's standing digit cannot be swept into it.
  `applyCellValue` strips the key the moment anyone overwrites a revealed cell (`:482-484`), and
  undo of hint ink strips it too (`:549-557`), so a peer who writes over a reveal gets their
  claim back. The remote path lands through the same primitives (`:374-376`).
- **Only value writes stamp the ledger** (`noteWrite` at `:298`, `:302`, `:306`, `:322-324`), so
  a peer's pencil marks never mint a claim the narrowing would have to drop.
- **The three predicates are the cell's own.** `givenCells.has(String(pos))` and
  `String(pos) in solvedValues.value` are exactly what `BoardHost` binds `:is-given` and
  `:is-solved` from (`BoardHost.vue:297-299`), so the tape and the cell now derive kind from one
  rule.
- **The second consumer was already truthful at `aab67b92`**, as r1 now says: the kind-branch is
  at `useGameCell.ts:140` and `DigitCell.attribution.test.ts` pins "solver's answer 4" (`it` at
  :111), "given clue 4" (:120-124) and "empty" (:127-132) with `authorName` set — none of those
  three files is in either commit. r1's correction is accurate, and the row's rewritten header
  says the right thing: the `named()` rows hold the PROP, the sentence is DigitCell's row's.
- **Nothing outside the claimed surface moved.** `0a08a3cf` is two files (the computed and the
  new row), `881be039` is one file, header only. No template line, no style, no other component.
  `grep` over `web/frontend/e2e/` finds no spec naming `.attribution-tape`, `cellAuthors`,
  `author-name` or `authorName` — nothing was widened, because nothing was there.
- **M16 by ear.** The cure ships no new product string. The only thing the tape prints is a
  player's animal slug, which the roster already prints; a player reads "enchanting-thrush" as a
  name and needs no knowledge of the app to do it. `lint:copy` exit 0 with its self-test controls
  firing.
- **Lane hygiene.** Worktree clean at `881be039`; the main tree's `src/` and `dist/` untouched
  (`index-9rZPzI5DEcpe.js`, mtime 13:53) and main's untracked set is unchanged; `.git/info/exclude`
  carries only the W8 block, the lane's own block pruned as r1 claims; :4257/:4258/:4259 free
  after this round (this verifier's two previews killed).

## Findings — five NOTEs, no MUST

### NOTE-1 — the colour half of the same ledger is still unnarrowed

`authorInk` (`useSession.ts:402`) rebinds `--color-user-ink` per cell straight off
`ledger.clock`, with no narrowing at all, and `BoardHost` binds it to the cell's `:style`. After
this cure the tape declines to name a hand on a solved, given or erased cell while the ink under
that same cell is still the peer's. Nothing is visibly wrong today: `HandwrittenGlyph.vue:83-85`
returns `url(#solver-ink)` when `isSolved` and `var(--color-foreground)` for an unoverridden
given — both outrank the rebound var — and an erased cell has no glyph, while user pencil marks
are `--color-crayon-blue`, not user ink. So the silence and the hue agree only because a paint
order in another file makes the hue unreachable on exactly these three kinds. Worth the chair's
ledger as the class, so a later change to that order does not re-open the same lie quietly.

### NOTE-2 — the row's given-cell arm is defence in depth, likelier unreachable than merely undrivable

The README says a peer-stamped GIVEN cell "cannot be driven live (a deal writes no op)". It looks
stronger than that: `applyCellValue` refuses a write to a given before `noteWrite` ever runs
(`useGameState.ts:476-479`), and `ledger.clock` is cleared on a new board/epoch
(`useSession.ts:876`, `:991`), so the wire has no ordinary way to mint that stamp at all. Keep
cell `2` — it is cheap and it pins the rule — but the record should call it defence in depth
rather than a live state nobody could reach with the rig.

### NOTE-3 — no browser-level gate guards this behaviour

The regression gate for 3B-1 is the unit row, which is real and in CI. The DELTA arm is a probe
in the evidence folder, not a spec, and no e2e spec names the tape. If the chair wants the two-tab
behaviour gated rather than evidenced, that is a separate row (3C-4's lane is the natural place).
Stated, not charged to this cure.

### NOTE-4 — the widened wake-up set is recorded, still unmeasured

The computed now wakes on `values`, `givenCells` and `solvedValues` and allocates a fresh map per
digit write, pushing a new prop identity to `GameBoard`. r1 recorded it in the seam section, as
round 1 asked. Nobody has measured it, including this round; `BoardHost` already re-rendered on
`values` and the loop is ≤ n² over an object that is `{}` on a solo board, so the expectation is
free, but the record should not read as if it had been measured.

### NOTE-5 — two small record numbers

The author's return says `gates/` holds "17 logs"; it holds 18. And the three `DigitCell.attribution.test.ts`
cites anchor inconsistently (111 is the `it` line, 121 and 129 are fixture lines) — all three land
inside the right rows, so nothing misleads, but the estate re-derives numbers at citation.

## Not re-measured this round

- The 390×844 census (author's and r1's stand; 1280×800 is exact in two engines off an
  independently rebuilt pair).
- The session e2e specs (the :3000 `webServer` is outside the fence; r1 ran them in both engines
  and found `presence.spec.ts:177` and `multiplayer.spec.ts:320` red symmetrically at HEAD and
  cured — the arm, not the cure).
- `test:font-coverage` (nothing in this cure touches a rendered string; the author's exit 0
  stands).

Servers started by this round (`vite preview` on :4258 and :4259) are killed; both ports free.
Scratch (`.vite-r2.config.ts`, `dist-head-r2/`, `dist-cured-r2/`, `.vite-cache-r2/`, the two
`BoardHostR2Head.*` temp files) deleted; `git status --porcelain` in the worktree is empty.
