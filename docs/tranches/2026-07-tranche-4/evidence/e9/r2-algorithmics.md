# R2 — Algorithmics: the undo/history spine (E9)

Lane R2 of the E9 triumvirate. Baseline of record = the last sealed commit **`7e03c5dc`** (T4-W7
addendum). Committed truth cited via `git show HEAD:<path>`; W8 marks are **in-flight/untracked**
(working tree) and marked as such. This lane writes ONLY here — zero source edits.

The owner's ask (verbatim, `corpus/owner-prompts.md §E9`): conditional confirm for board-destructive
acts *after data is input*; undo robust to ALL user actions; race-free but KISS; 100–200 items within
strict browser bounds; **indirect** (pointers not raw boards), deduped, "perhaps a trie/tree for
efficient CRUD"; and the three sub-rulings (difficulty→undo? next-game? bake-a-game surface?).

---

## 0. What I verified myself (mechanism, not the census's word)

| Claim | Verification | Verdict |
|---|---|---|
| History is already delta/pointer, not snapshot | `useUndoHistory.ts:19` `undoStack:{pos,prev,next}[]` + `undoIndex` pointer | ✓ committed |
| `UNDO_CAP=128`, FIFO shift on overflow, redo-tail splice on fork | `useUndoHistory.ts:16,28-32` | ✓ committed |
| Only user value writes recorded | `useSudoku.ts:174-181` `setCell→recordEdit`; **hint/solve deliberately unrecorded** `:310-315` (comment: "NOT recorded on the undo stack") | ✓ committed |
| randomize **wipes** history | `useSudoku.ts:213` `clearUndo()` on fresh deal | ✓ committed |
| difficulty is **armed, not live** | only `watch(size)` re-deals (`useSudoku.ts:449-454`); `watch([size,difficulty])` writes **URL only** (`:445-447`) | ✓ committed — decides the owner's Q from the mechanism |
| size is **live** re-deal | `watch(size)`→`clearPersistedBoard()+initBoard()+randomize()` (both games) | ✓ committed |
| keyboard Cmd/Ctrl+Z **not** loading-gated | `SudokuBoard.vue:337-343` emits undo/redo with zero `loading` guard; `grep loading` in that file = **empty** | ✓ committed — the one real race seam |
| buttons **are** loading-gated | `ControlPanel.vue` undo/redo/hint `:disabled="loading"` (`:380,389,398`) | ✓ committed |
| Clear confirm = coarse-only two-tap, 2.5s, arms **unconditionally** (no dirty check) | `ControlPanel.vue:186-210` `onClear` — `if(isCoarse&&!clearArmed)` has no dirty precondition | ✓ committed |
| randomize is **bare** (no confirm) | `ControlPanel.vue:181-184` `onRandomize`=trigger+emit | ✓ committed |
| Futoshiki keyboard undo is a byte-twin (same race) | `FutoshikiBoard.vue:342-344` identical metaKey/ctrlKey, no loading gate | ✓ committed |
| futoshiki difficulty runtime-only (survives nothing) | `useFutoshiki.ts:53-57` comment + absent from its `PersistedBoard` (`useUrlState.ts:30-39`) | ✓ committed |
| W8 marks NOT threaded to undo | `useUserMarks.ts` `toggleUserMark` (`:79-88`) has no `recordEdit`; `applyCellValue` is value-only | ✓ in-flight/untracked |
| **No multi-cell sweep feature exists** | `grep -niE 'forced\|sweep\|fillAll\|batch\|fill.?singles'` composables → hint is **single-cell** naked/hidden-single only | ✓ — the "sweep = 1 or N entries?" question is moot today |
| transport has monotonic id + pending map + bounded respawn, but **no abort/cancel** | `shared/solver/transport.ts` `id++`, `pending:Map<id,{resolve,reject}>`, retire-on-error; no `AbortController`, no supersede-cancel | ✓ committed — drives the race design |

### Measured bytes (my own `JSON.stringify`, `node`; census-corroborated)

```
sudoku 9x9   PersistedBoard :   822 B      (census ~959)
sudoku 16x16 PersistedBoard :  2583 B      (census ~3034; 256 cells = sudoku max)
futoshiki 7x7 PersistedBoard:   943 B      (census ~712; 49 cells = futoshiki max)
16x16 full centerMarks      : 11923 B      (census ~11.9 KB)
one value delta {pos,prev,next}     :   29 B
one board-ref pointer node          :   57 B   ({kind,ref-hash,prevGen,nextGen})
--- 200-entry ceilings ---
200 value deltas            :   5.7 KB
200 RAW 16x16 snapshots     : 504.5 KB   ← the owner's forbidden case
200 board-ref pointers      :  11.4 KB   (+ deduped pool)
pool: 40 distinct 16x16 deals: 100.9 KB
```

---

## 1. History structure — the arithmetic decides, and it says NO trie

Three candidates against the binding constraints (KISS · race-free · 100–200 · indirect/deduped · CRUD):

**(a) Pure command/delta log** — each entry the inverse-able action. `{pos,prev,next}` for writes.
*Fails one thing only*: a randomize/resize/solve is a whole-board change; its "delta" IS a full board
(2.5 KB) — a snapshot smuggled into the log, and inlining it violates "don't store raw boards."

**(b) Full-snapshot ring with structural sharing (persistent map / HAMT — the owner's "trie")** —
every step a new immutable board version, unchanged cells shared by reference. The canonical persistent
structure ([Wikipedia][pds]; [Clojure PDS][cljpds]; [Immutable.js][immjs]).
*Over-engineered here, provably*: a value edit touches **one** cell. A HAMT update copies the
root→leaf path — for a 256-entry map, ~2 levels of ~32-wide nodes allocated **per edit**, and you
**retain every intermediate root** across 200 versions, so aggregate cost ≫ the 29 B a delta spends on
the same edit. Clojure itself doesn't even use a HAMT below 8 entries ([Immutable.js write-up][immjs]).
Structural sharing shines when you must keep *full snapshots anyway*; we don't — we keep the diff. The
"shared subtree" win is moot when the diff is one cell. So (b) costs **more** bytes and **far** more
complexity than (a)+pointers for the common case, and buys nothing a delta doesn't already give.

**(c) HYBRID — RECOMMENDED.** One **tagged, linear** edit log (KISS: it's an array + an index, exactly
today's shape generalized). Cell-grain entries are inverse **deltas** (value + mark). Deal-boundary
entries are **board-pointer swaps** into a **content-hash-deduped board pool** — identical boards
collapse to one blob by hash, the entry holds only `{prevHash,nextHash}`. This is precisely the owner's
"pointers not raw boards, properly de-duplicate." The pool is a plain `Map<hash,board>` — Git's object
model in miniature: *"the hash is simultaneously identifier, dedup key, and checksum … two identical
byte-strings share one blob, at no additional cost"* ([Git internals][gitobj]). That IS the owner's
"tree/trie" intuition, correctly sited: the dedup lives in a **content-addressed pool**, not in a
persistent map of cells; the "tree of edits" is the ordered log itself (a *path*, since we truncate the
redo tail on fork — it never actually branches).

**Ruling with the arithmetic on the table.** 200 deltas = **5.7 KB**. The raw-snapshot ring the owner
forbade = **504 KB** (≈2 orders heavier). The HAMT sits between on bytes but **above both** on
complexity, satisfying no bound the hybrid misses — it fails KISS for free. **A trie is NOT warranted.**
The simplest structure meeting *every* stated bound is: **one tagged inverse-delta log + a
content-hash board pool**. The census reached the same floor; my measured bytes confirm the ratio.

> Canonical framing: commands store the *delta*, mementos store the *snapshot*; commands win on memory
> when state is large, and the two are routinely combined ([command-based undo][cmdundo];
> [memento×command][memcmd]). The hybrid is exactly that combination — deltas for the many small acts,
> memento-by-pointer for the few large ones.

---

## 2. Race-freedom — single-writer log, refuse-while-pending, epoch-guarded results

The main thread is single-threaded; there's no true data race. The hazard is **interleaving of async
continuations** (worker generate/solve, the W7 grade if async, tweens) around `await`. Discipline:

1. **Single writer.** The composable is the sole mutator of `values`/marks/history. The log has one
   author — no locks needed inside (`useUndoHistory` is already synchronous).
2. **Monotonic epoch = reuse `boardGeneration`.** Every async op captures `gen` at dispatch. On
   resolve, `if (boardGeneration.value !== gen) return;` — **latest-wins**, a stale deal/solve is
   dropped. This mirrors the transport's monotonic `id`+`pending` map, lifted to the composable.
3. **Push AFTER resolve, never before.** History entries are appended only on *successful* completion
   of an async act. A rejected/superseded generate (the transport's `WORKER_FAILURE`, or an epoch miss)
   leaves **zero orphan entries** — the log can never disagree with the board. This ordering rule is
   the crux of "race-free."
4. **Refuse-while-pending (the KISS resolution of "undo races a pending generate").** The transport has
   **no abort** — a dispatched generate runs to completion in the worker. So we don't cancel; we
   **refuse**: gate *all* mutators — including **keyboard** Cmd/Ctrl+Z/Shift+Z — on `loading`, matching
   the buttons that already are. One extra `if (props.loading) return;` in both boards' `keydown` (the
   census-flagged fix). Result: at most one destructive op in flight, undo/redo inert during it, no
   queue to reason about. Refuse ≺ queue ≺ cancel on complexity; refuse meets every bound.
5. **Redo invalidation.** Any new forward user action truncates the redo tail — already implemented
   (`recordEdit` splices at `undoIndex`); the generalized dispatcher keeps the identical rule for all
   kinds. Fork ⇒ redo tail dies. Uniform.

Net: **race-clean**, not merely race-safe. Today's posture is only race-*safe* (a mid-await keyboard
undo can't corrupt but can no-op confusingly); items (2)+(4) make it clean without a scheduler.

---

## 3. What is undoable — the taxonomy (inverse · entry shape · clears-redo)

Generalize `{pos,prev,next}` to a tagged union replayed by one dispatcher. Insertion seam mirrors how
`setCell` already pairs `applyCellValue`+`recordEdit`.

| Action | Undoable? | Inverse | Entry shape | Clears redo? |
|---|---|---|---|---|
| **cell write** (`setCell`) | yes (today) | write `prev` | `{kind:'value',pos,prev,next}` | yes |
| **cell erase** | yes | write `prev` | same, `next=0` (no new kind) | yes |
| **mark write/erase** (W8 `toggleUserMark`) | yes — **the gap** | restore prior slot list | `{kind:'mark',slot:'corner'\|'center',pos,prevList,nextList}` (≤16 nums, tiny) | yes |
| **hint ink** (`inkReveal`, single cell) | **RULE: yes** (owner: "ALL user actions" — pressing H *is* one) | write `prev` **and** drop `pos` from `solvedValues` tone-set | `{kind:'value',pos,prev,next,tone:'solved'}` | yes |
| **fill-forced sweep** | N/A today (no such feature); *if added* → **one** entry | reverse-apply all | `{kind:'batch',edits:[…]}` (one gesture = one undo) | yes |
| **randomize/deal** | **RULE: yes** (replace today's `clearUndo`) | restore prev puzzle-state | `{kind:'board',op:'deal',prevRef,nextRef,ctx}` (hashes into pool) | yes |
| **board-size change** | yes | restore prev size+board | `{kind:'board',op:'resize',prevRef,nextRef}` | yes |
| **difficulty change** | **RULE: NO — nothing to undo** | — (see below) | — | — |
| **solve** (whole board) | **RULE: yes** (owner: robust to solve) | restore pre-solve board | `{kind:'board',op:'solve',prevRef,nextRef}` (one undo, whole board) | yes |
| theme | excluded (non-destructive) | — | — | — |

**Difficulty — answered from the mechanism, not preference.** A difficulty change mutates the board
**nothing** today: only `watch(size)` re-deals; `watch([size,difficulty])` writes the URL. Difficulty is
a *staging selection* consumed by the **next** Randomize. So there is literally **nothing to undo** — it
needs no undo entry, and the honest UI framing is **next-game** (which it already is, mechanically; only
the label lies). Were difficulty ever made *live*, it would collapse into a `board/resize`-style entry —
but it isn't, and shouldn't be.

**Sharpest edge — board-undo vs the marks-void watch.** A deal bumps `boardGeneration`, whose watcher
**clears `useUserMarks`** (`useUserMarks.ts:97`). So undoing a deal must restore the *prior* marks too,
without the void-watch re-firing and wiping them. Ruling: the `board` node carries `{boardRef, marksRef,
given/solved ctx}` as one composite pointer set; undo/redo of a board node sets a transient `restoring`
flag so the generation-watch no-ops during restore (or restores marks **after** the generation write).
This is the one interaction that isn't KISS-by-default — call it out in the harden wave.

---

## 4. Persistence + bounds — session-only, drop-oldest, refcounted pool

- **Does history survive reload? NO — session/board-scoped, in-memory only.** Justified from the model,
  not laziness: the app's persisted unit is a **single-board snapshot** and the **permalink wins over
  storage on reload** (`?board=` URL-wins, census). Rehydrating a 200-entry *timeline* across reload
  would contradict that stateless single-snapshot contract and risk the URL-board and the restored
  history disagreeing. A reload is a natural history reset — the norm for editors; users don't expect
  undo to outlive a page load of a puzzle. The **board** persists (as today); the **timeline** doesn't.
  KISS dividend: no pool serialization, no load-time reconciliation with the URL board.
- **Eviction: drop-oldest (FIFO shift)** at the cap — already implemented. **Refcount the pool**: when a
  shift (or a fork-truncation) drops a `board` entry, GC its pooled blob iff no surviving entry
  references that hash. Keeps the pool bounded by *live* references, not lifetime deals.
- **Memory ceiling at 200 (recommendation).** Deltas dominate: 200 cell/mark entries ≈ **5.7 KB** JSON
  (~15–40 KB as live JS objects) — negligible. Pool: realistic session <20 deals ⇒ **<50 KB**; even 40
  distinct 16×16 boards = **~100 KB**; the absurd worst case (200 entries *all* distinct 16×16 board
  swaps) = **~500 KB**, still an order under a MB and not reachable by a human dealing between edits.
  **Realistic total < 200 KB** — trivial against a 5 MB localStorage quota or a tens-of-MB JS heap.

---

## 5. The 100–200 number — pick **200** (128 the acceptable floor)

The cost curve is **flat and delta-dominated**: within 100–200 the memory difference is a few KB, and
the pool is refcount-bounded *independently* of the entry cap — so raising the cap can't blow memory.
**The number is therefore a UX/safety-net choice, not a memory one**, and the arithmetic proves the
ceiling is free. Pick **200**:

- covers a full 9×9 session end-to-end (≤81 value edits + marks) with headroom, and most manual editing
  of a 16×16;
- maximal "undo my whole session" safety net at **~6 KB** cost;
- the existing `UNDO_CAP=128` is already in-band and defensible — the change is a **one-constant bump**
  to 200; keep 128 if a reviewer prefers the tighter reason-about window, but the arithmetic sanctions
  200 outright.

*Precedent for bounding by memory, not just count*: Emacs keeps full history but caps by **bytes**;
VS Code effectively bounds undo and has long-standing config-size requests ([vscode#75606][vsundo]).
Our entries are bounded-size (deltas + fixed pointer nodes), so an **entry cap is a faithful proxy for
a byte budget** — no need for a bespoke byte accountant. If a byte belt-and-suspenders is ever wanted,
add a soft KB ceiling on the pool and evict oldest board entries first; not required to meet any stated
bound.

---

## 6. Destructive-confirm + "bake a game" — the owner's three sub-rulings

- **Confirm precondition = `isDirty`, which does not exist yet** (census: no `isDirty/pristine` anywhere;
  Clear arms even on a blank board). Cheapest precise signal for "*after input of data*": a `userEdited`
  boolean flipped true by `setCell`/`toggleUserMark`, reset on deal (equivalently: undo-log-non-empty of
  *value/mark* kind). Expose it as a computed and thread it as the arm precondition.
- **Generalize the Clear grammar** (coarse-only two-tap, transient "sure?" sublabel, 2.5s, no dialog —
  `ControlPanel.vue:186-210`) to **Randomize** and **board-change**, but **gated on `isDirty`** — a blank
  board deals instantly, no nag (fixes Clear's unconditional arm). Same transient-label idiom, zero
  dialog machinery — KISS.
- **Undo becomes the universal backstop**, so confirm and undo are **belt-and-suspenders**, exactly the
  owner's "conditional" framing: confirm stops the *disastrous accidental tap* first-line; undo (§3, now
  covering randomize/resize/solve) recovers anything that slips through. Even an unconfirmed misfire is
  now reversible.
- **"Bake a game" surface** = make **board-size arm-not-live** (retire the `watch(size)` live re-deal),
  so **size + difficulty** become one staged input pair committed by **one guarded Deal/Randomize** —
  visibly differentiated from the live in-game controls. This resolves all three sub-questions at once:
  difficulty needs no undo (armed), it reads as next-game (it *is*), and size stops being a live hazard
  (only the Deal is destructive — the single guarded, undoable act). Cross-game caveat: **futoshiki
  difficulty survives nothing** (runtime-only, absent from its `PersistedBoard`); any staging design must
  reconcile that or it'll silently reset the "baked" difficulty each mount.

---

## Sources

- [Persistent data structure — Wikipedia][pds]
- [Clojure's Persistent Data Structures (structural sharing, path-copy cost)][cljpds]
- [Immutable.js / structural sharing — dtinth (Clojure skips HAMT <8 entries)][immjs]
- [Git object model — content-addressed dedup: hash = id + dedup key + checksum][gitobj]
- [Command-based undo for JS apps — DEV][cmdundo]
- [Memento × Command (combining snapshot + delta) — Medium][memcmd]
- [VS Code undo-history size — issue #75606][vsundo]

[pds]: https://en.wikipedia.org/wiki/Persistent_data_structure
[cljpds]: https://www.javacodegeeks.com/2026/02/clojures-persistent-data-structures-immutability-without-the-performance-hit.html
[immjs]: https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2
[gitobj]: https://singhajit.com/how-git-stores-data-internally/
[cmdundo]: https://dev.to/npbee/command-based-undo-for-js-apps-34d6
[memcmd]: https://jordansrowles.medium.com/memento-pattern-using-the-command-pattern-and-domain-events-in-net-8faa087e6eba
[vsundo]: https://github.com/microsoft/vscode/issues/75606
