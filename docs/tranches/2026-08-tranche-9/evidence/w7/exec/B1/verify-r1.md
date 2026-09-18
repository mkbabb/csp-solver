# T9-W7 exec · B1 — non-author verify, round 1

Verifier: non-author. Subject: `c391665c` on `w7/exec` (parent `2b6b8b7b`, wave base
`aab67b92`). Everything below was re-measured by the verifier; nothing is carried from the
author's return.

**VERDICT: REPAIR** — two MUST, four NOTE, zero BLOCKING. The cure is right in kind: both
claimed sites are genuinely recut, the gate genuinely reds on a regression, and π is contained
to the one box the cure claims, on BOTH engines. What fails is the cure's *scope claim*: two
rendered product strings still name the machine to a player and the README does not say so.

---

## 1. What the verifier re-measured

All in `/Users/mkbabb/.../.claude/worktrees/w7-exec/web/frontend`, bare (no pipes), at
`c391665c`. Preview served by the verifier on **127.0.0.1:4259** (`--strictPort`, private
vite cache, own dist); killed at the end, 4257/4258/4259/3000 all free.

| Gate | Verifier's exit | Reading |
|---|---|---|
| `npx vite build --config .vite-exec.config.ts` | **0** | `dist/assets/index-Cc6TqSXYnbfW.js` — **byte-identical hash to the author's dist**, so the banked census/frames were taken from the committed source |
| `npx vitest run` | **0** | **Test Files 68 passed (68)**, Tests 826 passed (826) |
| `npm run lint:copy` | **0** | 137 files, 0 dashes, 1 hit / 1 admitted / 0 unadmitted; all 18 self-test colours as required |
| `npm run lint:live-regions` | **0** | 0 regions born speaking |
| `npm run lint:motion` | **0** | clean |
| `npm run lint` (prettier) | **0** | clean; `e2e/` never prettier'd |
| `npm run lint:eslint` | **0** | clean |
| `npx vue-tsc --noEmit` | **0** | clean |
| `npm run typecheck:e2e` / `typecheck:node` | **0** / **0** | clean |
| `npm run test:font-coverage` | **0** | Patrick Hand 46 codepoints / 4312 B, 17 declared strings, each derived — **no new glyph** |
| `npx playwright test -c playwright-golden.config.ts` | **0** | **4 passed**; no `--update-snapshots`, worktree clean afterward |
| `e2e/sudoku-interaction.spec.ts` (both engines) | **0** | **14 passed** — the author reported this NOT RUN; verifier ran it |
| `e2e/a11y.spec.ts` (both engines) | **0** | **30 passed** — the author reported this NOT RUN; verifier ran it |

The two e2e specs were run against the verifier's preview through a throwaway config
(`webServer: undefined`, `baseURL: 127.0.0.1:4259`) that was deleted immediately; the worktree
is clean but for the author's sanctioned `.vite-exec.config.ts`. **The author's gap 3 is
closed.** Both rows are load-bearing, not vacuous: `sudoku-interaction.spec.ts:90` asserts
`expect(solvedIdx).toBeGreaterThanOrEqual(0)`, so the `/revealed answer/` regex had to match a
live cell for the row to pass, and `a11y.spec.ts:592` asserts `filled.length > 0`.

## 2. The born-RED row, re-run by the verifier

Reproduced without touching the worktree: `src/`, `scripts/` and `index.html` copied to a
scratch root, individual files swapped to their `aab67b92` blobs, the gate run against that
root (its `ROOT` is `import.meta.dirname/..`). Three cases:

| Case | copy | gate | exit | line |
|---|---|---|---|---|
| A | parent | parent | **0** | `2 hit(s), 2 admitted, 0 unadmitted` |
| B | parent | cured (admission struck) | **1** | `✗ GameControlPanel.vue:1297 … "solver" (the machine's name)  the solver finishes the board` |
| C | cured | parent (admission kept) | **1** | `ADMITTED carries … "the solver finishes the board" and that string no longer trips the lexicon there. The admission outlived the copy it excused — strike the entry.` |

Case A and Case B reproduce the author's pasted RED/GREEN pair **exactly**. Case B is the
claim that matters and it holds: **with this commit's gate, a regression of the tape string
reds.** The lexicon (25 entries), the self-test and the `candidates` admission are untouched —
the gate was not loosened.

Case C is the verifier's own and qualifies the framing: the strike was **not elective**. The
gate's third check reds a stale admission, so leaving the carve-out in place with the cured
copy also exits 1. The README reads as though striking it was chosen rigor; it was forced.
The *regression guard* is nonetheless real (Case B).

## 3. π — re-measured, both engines

**Reproduction of the banked after-census.** Verifier's own chromium census of
`board-1280x800` on its own port, own instrument, compared to `census/after/board-1280x800.json.gz`:

```
A=1089  B=1089  onlyA=0  onlyB=0  moved=0  max=0.00px
```

Byte-for-byte on 1,089 rects. The author's own `before → after` diff re-run by the verifier
gives `moved=1, max=16.52px` on the path the README spells. Both numbers stand.

**WebKit containment — the gap in the banked evidence, closed.** `probe/rect-census.mjs`
launches **chromium only**; `tape-box.mjs` is the only both-engines instrument and it reads
just the tape and its button. So the banked evidence does not, by itself, carry "no sibling
and no ancestor moves … both engines" for the whole tree. The verifier closed it without
rebuilding: census the cured page, swap the tape's text node back to `the solver finishes the
board` in the DOM, re-census, diff.

```
webkit:   1089 rects, 1 moved, max 17.75px
   17.75  …/button:3/span:3   898.45,693.47,179.20,29.36  ->  889.45,693.44,196.95,29.42
chromium: 1089 rects, 1 moved, max 16.42px
   16.42  …/button:3/span:3   903.96,693.78,168.09,29.32  ->  895.74,693.76,184.51,29.38
```

**Exactly one rect answers to that sentence's length, on both engines, and it is the claimed
span.** (A DOM swap does not re-roll `SheetWashiLabel`'s charCode-seeded tilt/clip, which is
why the widths land 0.1px off the author's real-render figures of 197.05 / 184.61 — the
direction, the magnitude and the containment all agree.)

Scope of the verifier's π: `board` at 1280×800, both engines. `gallery` and 390×844 were not
re-measured; the author's four-pair census is internally consistent and its chromium
board pair reproduced at 0.00px.

**The spoken core reaches no visible surface.** `GameBoard.vue:1084`'s attribution tape renders
`hoveredAuthor.slug` only, never the cell's name, so `revealed answer N` is ear-only. That is
why the font cut is unchanged on that half and why the census is complete.

## 4. Frames

All four crops opened. They read as claimed and no glyph is missing (visual confirmation of
`test:font-coverage`): before pair reads `the solver finishes the board`, after pair reads
`finishes the board for you`, chromium and webkit. 9,462 + 11,878 + 9,679 + 12,241 =
**43,260 B**, largest 12,241 B, all well inside the 150 KB ceiling. Hover-pose substitution is
stated in the README rather than passed off as at-rest, which is the honest call — the tape is
`opacity: 0` until `:hover` / `:focus-visible`.

## 5. The copy, by ear

- **`finishes the board for you`**, under a button whose icon sublabel reads `solve`. A player
  with no knowledge of the app understands it. No jargon, no metaphor, no dash, no machine
  naming itself. Register note only: its sibling tapes are imperative (`wipe every digit you've
  written`, `fill the cells that have only one digit left`) while this one is third-person
  indicative — but so is `share this board and everyone writes on the same grid`, so the estate
  is already mixed. Not a finding.
- **`revealed answer N`**. Spoken: `Row 2, column 3, revealed answer 4`. It stays distinct from
  `given clue 4` and `your entry 4` / `brave-otter's entry 4` in the ear, it is short, and
  `revealed` is the player's own act. Neither candidate trips the lexicon (verified by running
  the gate, not by reading it).

---

## 6. Findings

### MUST-1 — two product strings still name the machine to a player, undisclosed

`src/games/shared/solver/classifyError.ts:50-55`:

```ts
export const PAPER_NOTE_COPY: Record<PaperNoteVariant, string> = {
  budget: "the solver ran out of steps on this board.",
  network: "couldn't reach the solver.",
  …
```

These are rendered copy, not comments: `GameBoard.vue:45` imports them, `:896` hands one to
`SolverErrorNote`, and `SolverErrorNote.vue:46` prints it — `<p class="error-note-text">{{ text }}</p>`.
A player whose relay drops reads **"couldn't reach the solver."** on the paper note.

The cure's own summary says *"the machine's name leaves the product copy"* and the commit
message says *"the machine stops naming itself to a player"*. Both are false while these two
ship. The README's §7 gaps name the CSS/SVG comments and the self-test fixture as deliberate
residue and does not mention these at all.

Strictly, the author was in-fence: ballot T9-B1's row enumerates two strings and the brief's
grep terms (`solver's answer` / `solver finishes`) miss these. That is exactly why it has to be
booked rather than left silent — B1 is the wave's copy ruling, and it would close with the
machine still introducing itself on an error.

This also exposes a **third blind spot in the gate**, same class as the author's gap 2: the
jargon arm reads `COPY_KEYS` (`sublabel`, `label`, `note`, `text`, `title`, …), and
`PAPER_NOTE_COPY`'s keys are `budget` / `network` / `deal-timeout` / `unknown`, so a
domain-keyed copy object is invisible to it. Verified: the gate reports `0 unadmitted` over a
tree that holds both strings.

**Fix (inside this cure):** add the row to §7 with the file:line and the render path, narrow
the cure's summary and the commit's claim to the two strings it actually cured, and book the
`COPY_KEYS`-vs-domain-keyed-object blind spot beside gap 2 for W5's gate estate. Whether B1
takes a third recut here is the chair's; the record must not close claiming it did.

### MUST-2 — the surviving admission's reason now cites a referent this commit deleted

`scripts/check-copy-register.mjs:141` — the `candidates` entry's `why` still ends:

> "… belongs to T9-W7 §9 (ballot B1) **with its sibling above**."

The sibling above was struck by this very commit. The file's own doctrine is that "a carve-out
without [a reason] is how a rule rots" and that admissions are "closed both ways … so the
record cannot outlive the copy it excuses." A reason that points at a deleted entry and names
a closing ballot as its owner is that rot, introduced here. The author's gap 1 raises the
substantive question (does `candidates` get its own recut?) and correctly leaves it to the
chair; it does not fix the dangling cite.

**Fix:** one-line reword of that `why` in the same commit — drop "with its sibling above" and
name the live owner (the chair's B1 ruling, or the seam it is re-booked to). Zero π, zero
gate movement.

### NOTE-3 — line-cite drift the commit introduced and did not chase

The commit inserts a five-line comment block above the `ariaLabel` computed, moving the
kind-branch down by five lines. Left stale:

- README §1 cites `useGameCell.ts:153` — the recut core is at **158**.
- `src/games/shared/BoardHost.authors.test.ts:19` cites `` `useGameCell.ts:140` `` for the
  name's kind-branch; line 140 is now **inside the new comment**, the switch begins at 149.
  This file is edited by the commit, so the cite was in reach.
- `e2e/a11y.spec.ts:123` cites `useGameCell.ts:114-135`, likewise shifted.

### NOTE-4 — the gate's header prose now states a falsehood about the live tree

`scripts/check-copy-register.mjs:35-38` still reads "… the live pass flagged `the solver
finishes the board` for adjudication, the adjudication never happened, **and the string is
still shipping**." After this commit it is not. Present tense in the file the commit edits.

### NOTE-5 — the full-tree census instrument is chromium-only

`probe/rect-census.mjs` launches `chromium` and nothing else; the README's π paragraph reads
as a both-engines whole-tree claim ("no sibling and no ancestor moves — … in BOTH censuses,
both engines"), which the banked artifacts support only for the button and the tape
(`tape-box.mjs`). The claim is TRUE — §3 above proves it on WebKit at 1,089 rects — but the
evidence that shipped did not carry it. Either cite this verify note or say plainly that the
whole-tree census is chromium and the both-engines reading is the tape box.

### NOTE-6 — the born-RED row's RED was mandatory, not elective

Case C in §2: with the copy cured, keeping the admission also exits 1 ("The admission outlived
the copy it excused — strike the entry"). The strike had to happen; the README's framing gives
it more volition than the gate allows. The regression guard the strike buys is real and
reproduced (Case B), so this is a record-accuracy note, not a defect in the cure.

---

## 7. What the verifier could NOT refute

- Both claimed sites are genuinely recut; no occurrence of the old strings survives under
  `src/` `e2e/` `scripts/` except the four deliberate ones the README names (two `#solver-ink`
  comments, the self-test fixture, and the new commentary that quotes the old core).
- The gate reds on a regression of the tape string (Case B, measured).
- `DigitCell.attribution.test.ts` pins `Row 2, column 3, revealed answer 4` **and**
  `not.toContain("solver")`, so the unit row reds on a revert and not only on a re-word. The
  author's gap 2 (the copy gate is blind to the cell core) is real — confirmed directly: in
  Case B the reverted `useGameCell.ts` produced **no** gate offence.
- π is contained to one span on both engines; the golden battery is 4/4 with nothing
  re-baselined; the font cut needs no re-cut.
- Both e2e specs the commit edits pass end to end, both engines, with their intents intact.

## 8. Instruments

Verifier's scratch (not banked in the repo):
`/private/tmp/claude-504/…/scratchpad/{b1-red/,census2.mjs,webkit-swap.mjs,diff.mjs,census-after/}`.
Servers started: one `vite preview` on 127.0.0.1:4259 — killed. No osascript, no Safari, no
simulator; chromium + webkit only (M19 honored). No file in the main tree's `src/` or `dist/`
was read-modified or served; the worktree's source was never edited, stashed or re-checked-out.
