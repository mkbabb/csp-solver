# LANE A / STAGE A — F4's PICKER STAGING, PASS 3

Tree: **MAIN**, `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`, three commits
`7ad0f821` → `269039e8` → `ca8bb001` on top of `18f92c26`. Ported from wt-1
(`wf_6e1b18f4-0f2-1`, 13 commits behind) onto current HEAD — the port was clean because P1 had
moved almost nothing under the gallery (`GameGallery.vue` gained only `heldFrameCount`).

Built to the **STANDING RULING** (pass2-registry §2): the everyday re-deal lives in the drawer;
the picker owns the cross-game switch. The original fusion thesis is not what got built.

Spec of record: **`f4-spec.md`** (this directory) — it supersedes `pass1/f4-spec.md` and
`pass2/laneA-report.md`, and it carries the struck claims with their refutations.
Shots: `shots-A/` (26, chromium + webkit × 1440/375-coarse/320 + dark). Rigs: `rigA/`.

---

## 1 · THE FOUR BLOCKERS

| # | blocker | closed by | witness |
|---|---|---|---|
| 1 | target-board destruction | `attemptDeal` reads the TARGET id's ledger row (`board && userMoves`); `d` routes through the same call; `aria-keyshortcuts` on listbox + verb | 2 e2e rows + a negative control row (untouched target deals through) · GATE-1 reds both on the pass-2 shape |
| 2 | half-fused safe verb | `start` DEALS the staged pair; `resume` PRINTS the saved pair on the verb the moment the chips diverge; picks are per-open so a divergence can't outlive a visit | 3 e2e rows · GATE-1 reds `start` when un-fused, reds `resume` when the sublabel is stripped |
| 3 | cold-start falsity | `backfillLedger(GAMES)` at boot from the five persisted keys, missing rows only; `board` and `userMoves` split into two fields | 3 e2e rows + 6 vitest rows · GATE-1 reds 4 e2e rows with the backfill removed, reds 3 vitest rows on the pass-2 `userMoves` |
| 4 | mark-4 composition breach | discharged at source by P1-W3 (the `.ctrl-btn:hover` filter is gone); **proven** by the rendered census | 8 census cells, 2 engines × 2 scenes × 2 builds, built dist, injected-node control fires in all 8 |

**Census result — the mark-4 gate of record for this lane:**

```
gallery scene   base 17 surfaces / 0 html boxes / 385,463 px²
                treat 17 surfaces / 0 html boxes / 385,463 px²    ← identical, both engines
board scene     base  9 / 0 /  90,183      treat  9 / 0 /  90,183 ← identical, both engines
```

Zero new filtered surfaces, area growth **exactly 0**. `rigA/census.mjs`, raw `rigA/census.json`.

---

## 2 · THE VERB MODEL — DECIDED STRUCTURALLY (the blind read has no cold readers)

`deal` carries the estate's **own die** (`DiceIcon` — the drawer Deal button's mark) plus the
guard ribbon's heavier ink; the safe verb carries **no mark**. Icon-presence against
icon-absence survives greyscale, a small crop, a low-res render, and a reader who can resolve
neither border weight nor colour — the four conditions pass 2's border-weight-only distinction
does not survive, and three of them are the owner's own LOW-RES mark. **No new ink vocabulary.**
Guarded on every path (tap · `d` · ribbon confirm) through one `attemptDeal`.

**OWNER ROW — the M4 blind read.** ≥4 uninstructed readers, captioned-free crops of
`shots-A/{chromium,webkit}-1440-band-{start,resume,diverged}.png`, one question: *"which of these
two words will replace your board?"* This lane does not grade it.

---

## 3 · WHAT DID NOT SURVIVE, AND IS STRUCK ON THE PAGE

- **The M5 kenken-Safari claim is dead.** Pass 2's "shipped WebKit carousel defect, in production
  today" is a Playwright-WebKit artefact and does not reproduce on real MobileSafari. My own shot
  rig carries a bounded corrective loop for it, named at the site — stepping blind would have shot
  the wrong card and blamed the band.
- **"The chips visibly snap on `resume`" is not delivered on the everyday path.** The write
  happens, but `select` unmounts the deck in the same handler, so it never paints. The cure is
  sold on the branch that IS delivered — the divergence printed on the verb before the click —
  and the spec row is named for that. The snap earns its two lines only on the guard-armed path.
- **"`board` counts user moves, not givens"** is half-adopted, deliberately: one flag cannot carry
  "is there a board to resume" and "is there work to destroy". Two fields, two names, both gated.
- **"`canRestore` consults the ledger"** is not adopted: the ledger is a cache derived from
  `canRestore`'s own source, and wiring it back in inverts the dependency. `canRestore` gains one
  clause, `!staged`.

---

## 4 · ESTATE, GREEN — SINGLE TREE, ONE RUN, AFTER THE LAST EDIT

Every row below was taken on `ca8bb001`, one build, one artifact set (the named pass-2 offense
was a gate that predated its own last edit).

```
vue-tsc --noEmit            OK
vitest                      330 / 31 files          (was 313; +17 useStagingBridge rows)
eslint .                    clean  (pencil ↛ games holds — the band takes plain data)
knip                        clean
prettier --check src/       clean
test:font-coverage          OK — 28 codepoints, 13,788 B
e2e default                 97 passed               (was 85; +12 gallery-deal rows)
  PLAYWRIGHT_BASE_URL=http://127.0.0.1:5301 (explicit — :3000 is the foreign palette-api)
built-dist lane             13 passed  — filter-census 3 · theme-bake ×2 engines · wordmark 7
  PLAYWRIGHT_BASE_URL=http://127.0.0.1:4803  (:4188 verified free before the run)
goldens                     4 passed · golden-bytes PASS  (no golden clips the band — as mapped)
lint:ink                    runs; its one ungoverned-register finding is Lane D's, unchanged
```

**LOC + bundle** (honest, both new files counted in full):

```
+1,703 / −16   of which 662 lines are tests (392 e2e + 270 vitest)
  useStagingBridge.ts   255 (~143 code)      StagingBand.vue  300 (~216 code)
bundle index-*.js  230,913 → 238,351 B raw (+7,438) · 84,579 → 86,958 gz (+2,379)
```

No offsetting deletion, and none claimed — §0's ruling is what keeps the drawer's staged zone.

---

## 5 · ONE UNORDERED FIX, AND WHY

Pass 2's open item 6 (the guard ribbon overlapping the band at 375) became worse with the
divergence sublabel: the ribbon landed **halfway across the first chip row** — half a control
showing under a note that had already disabled it. Below 40rem (the same breakpoint at which the
slip stacks) the ribbon now anchors to the slip's box instead of the deck's centre, so while it is
up it stands **in the slip's place**, which is what it means. Five lines, one media query.
Before/after in `shots-A/*-375-deal-ribbon.png`.

---

## 6 · OWNER / TEAM-LEAD ROWS

1. **M4 blind read** (§2) — needs ≥4 uninstructed cold readers. Artifacts staged.
2. **The gallery-regime filter census is not a permanent gate.** Population derived and in hand:
   17 = the board scene's 9 + `svg.handwritten-logo g.logo-pose` ×4 + `svg.poster-grid g` ×4;
   0 HTML boxes; 385,463 px². Folding it into `filterBudget.ts` + `filter-census.spec.ts` is
   Lane-D-shaped infra; the budget file did **not** move for this lane because the board
   population is byte-identical.
3. **81 focusables inside `role="option"`** — Wave C2's live-face projection, shipped, nobody's.
   This lane's delta is zero and the gate asserts it in that scope, with the reason at the site.
4. **The everyday re-deal's permanent home** stays the adjudicator's residue row (registry §2).
   Nothing was excised.
5. **Crayon tints on the band's difficulty chips** — blocked on the AA re-verify against
   `--color-card`. The band ships monochrome deliberately.
