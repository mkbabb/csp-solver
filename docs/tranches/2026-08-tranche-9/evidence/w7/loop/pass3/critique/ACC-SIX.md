# ACC-SIX — pass-3 CRITIQUE (adversarial, non-author)

Subject: `docs/.../pass3/synthesize/ACC-SIX.md` + the prototype at
`.claude/worktrees/wf_f72f3b5a-83a-45` (base `74a2b5d9`, 14 M + 2 ??, +722/−104) and its
evidence at `pass3/prototype/ACC-SIX/`.

What I did myself, and nothing here is quoted from the prototype's return: read the whole diff;
looked at both cited crops; re-ran `check-theme-tokens --self-test`, `check-copy-register` bare,
`check-font-coverage` bare and the two unit files (19/19) in the prototype's worktree; served the
prototype's OWN dist (built inside that tree at 00:19) on **:4237** and re-ran G5 in **chromium
and webkit** at 393×699 dpr3 with a MutationObserver on the strip and a dataset marker on the
drawn line; recomputed every token contrast ratio in the ledger from first principles; and
planted two holes in the new law-20 arm, one of them into the estate's real
`GameControlPanel.vue`. Instrument: `critique/ACC-SIX/instruments/g5-recheck.mjs`; readings:
`critique/ACC-SIX/logs/g5-recheck.json`. My server was closed by the script; :4237 reads free
(:4231/:4232/:4243 are other lanes').

**Convergence earned: 72%. Verdict: ADVANCE.**

---

## 1. What is genuinely converged (and I reproduced)

**G0 — the segment law.** The pass-2 declaration-form thesis is falsified by the lane's own
control and the cure is ACC-FIVE's `poseFronts` consumed verbatim (merge-watch condition met, one
scanner, nothing re-minted). `pathLength` and both `stroke-dasharray`s are gone from the served
tree; the degenerate pose fails to nothing drawn. This is the strongest row in the family.

**G5's core — re-measured by me, both engines, on the dist.** Drawn line == `aria-valuetext`
word for word; `aria-valuenow`/`-valuemax` == count/writable; `aria-label` `board fill`;
`aria-hidden="true"` on the drawn half. `.board-margin` height **48.00 px at fill 0, 1, 2, 3 and
after the lift, both engines** — Δ 0.00 px across the count's whole life. The line lifts after the
third write and `aria-valuetext` keeps speaking. Occlusion is zero **by construction**, because
the label is off the board — the one claim no corner could meet, and it is the family's best idea.

**Contrast, recomputed from the hexes.** `#2f76bd` on `hsl(48 12% 99%)` = **4.640** (exact);
`#9b74f7` vs paper = **3.309** (exact); `#7c3aed` vs dark card = **3.284** (exact). The painted
ledger's arithmetic is honest where I could check it.

**Deletions that are real:** `#2563eb`, `#60a5fa`, two `rgba(196,181,253,…)` literals, the glyph
fallback, `transition: all`, `pathLength` ×2 + both dashes, the guard's 8% ground,
`props.text.charCodeAt(0)`, pass 2's whole tape substrate and `MOTION.tapeRestMs`. Nothing is
kept under a new name except the one case in §2.9.

**Gates I ran bare, green:** `check-copy-register` 0 offences / 0 admissions / lexicon 25;
`check-font-coverage` 4 bound tapes pinned, no re-cut; `check-theme-tokens --self-test` 5/5 plants
as required; 19 unit rows.

---

## 2. THE OPEN GAPS

### 2.1 The count does NOT update in place — measured, both engines (NEW; the lane does not report it)

`GameBoard.vue`'s shipped comment says "The count then updates IN PLACE (one node, `:key`
unchanged, so the write-in does not re-run)". `MarginNote.vue:83` binds
`:key="meta"` — the key **is** the string that changes. On the prototype's own dist:

| write | chromium mutation on `.board-margin` | marker set at fill 1 |
|---|---|---|
| 1 | `+P:1 of 20 on the board` | set |
| 2 | `−P:1 of 20…` then `+P:2 of 20…` | **gone** |
| 3 | `−P:2 of 20…` then `+P:3 of 20…` | **gone** |

Identical in webkit (`1/2/3 of 46`), and webkit's fill-3 read caught `ink-write-in` **running
again** on the replacement node. So the sentence is torn off and re-inked on every write, three
times per deal, where the spec promises one write-in and an in-place update. Closable in one
attribute: give the meta line a stable key (or none) and let the text patch.

### 2.2 The unit row that should have caught it CANNOT fail

`GameBoard.count.test.ts`'s `MarginNote` stub renders
`<p v-if="meta" class="margin-note-meta">` — **without** the real component's `:key="meta"`. The
row named "updates in place on the writes that follow" therefore asserts only the text, and the
mechanism it is named for is deleted by its own stub. Re-key the stub to the real template (or
mount the real `MarginNote`) and the row reds today.

### 2.3 The escape byte was minted on a ground the lane itself calls unstable

`#8b5cf6`'s trigger reading, worst **3.072**, is the ratio against a painted line gray of **49**
— I reproduce it exactly, `CR(#8b5cf6, rgb(49,49,49)) = 3.072`. The escape arm's own `vs line`
column, **5.878** chromium, is the ratio against gray **10** — `CR(#9b74f7, rgb(10,10,10)) =
5.878` — which is precisely the contaminated glyph read (`#0a0a0a`) the lane's gap 5 names. **The
two arms were read against different grounds.** And at the token's own light `--grid-line-color`,
`hsl(0 0% 15%)` = gray 38, `#8b5cf6` reads **3.574** — over the 3.10 trigger, no escape, no new
byte:

| line ground | `#8b5cf6` | `#9b74f7` |
|---|---|---|
| 10 (a given's glyph) | 4.676 | 5.878 |
| 38 (`--grid-line-color`) | 3.574 | 4.493 |
| 49 (the trigger's read) | **3.072** | 3.862 |

The pre-declared rule was the right method and I credit it; the number it was applied to is not
reproducible run to run by the lane's own admission. Close it by re-reading both rungs in ONE run,
same column, with the line ground pinned to the frame's modal core and glyph pixels excluded, and
report both worsts against that single ground. Until then "one new colour byte" is unearned.

### 2.4 `undo-to-empty does not re-teach` is false, by the family's own test

The shipped row of that name writes 1 → 0 → 1 and **asserts the line comes back**
(`expect(line(w)).toBe("1 of 16 on the board")`). The code agrees: `taught` is set only in the
rest timer, so any undo to empty inside the lesson re-arms the 0→1 lay-down. The return's bullet
("undo-to-empty does not re-teach") and `GameBoard.vue`'s comment ("an undo back to empty inside
the lesson cannot re-teach it either") both say the opposite of what ships. Decide the behaviour,
then make the row's name and the two comments match its assertion.

### 2.5 G8 is unmet (the lane says so)

76.76 % light / 75.18 % dark against a charter of ≤30 / ≤5, on an instrument whose negative
control moves 0.39 points. The honest report is to its credit; the gate is still red. Closable:
re-run r0's own census at `CHROMA_FLOOR 0.012` over r0's subject, as a MOVED diff, with the six
anchors substituted and nothing else changed.

### 2.6 The reserve's phone price, and what nobody asserted around it

13.6 px of board at 393×699 (their gap 2; I confirm the mechanism — `.board-margin` is
`position:absolute` at ≥1024 and in flow below it, which is exactly why the desk is unmoved at
636.00 and the phone is not). Two things nobody measured: the band this strip **shares with W2's
tongue** (`margin-right: 6.5rem`, §2.7) is untested after the strip doubles to 48 px — no tongue
geometry, no bottom-tab reachability, no tap-floor token read — and the count has **no wrap arm**:
`12 of 200 on the board` at 16×16 inside the 258 px the tongue leaves would wrap, and a wrapped
second line blows the very `2lh` reserve that buys Δ 0.

### 2.7 The wrong π number ships in the source

`SheetWashiLabel.vue`'s new comment still reads "all 16 instances re-tear ONCE … the bounding
boxes move at most 0.55px". The lane measured **14** instances moving up to **4.60 / 4.82 px**.
The return declares it; the file does not. A declared π that is wrong by 8× inside the diff is the
class the estate books rows against. One comment, corrected in the same diff as the decision.

### 2.8 The "ONE RATIO LEDGER" carries a number it did not paint

The block declares itself "PAINTED BYTES … the single place any of these numbers is written down"
and then lists the dark digit at **7.70** — that is the token arithmetic (`#6aabeb` on
`hsl(24 6% 7%)` = 7.696, which I recompute); the lane's own painted read is **7.608**, outside the
brief's ±0.02. Either paint the row or mark it arithmetic; a painted ledger with one arithmetic
row is the shape this family exists to delete.

### 2.9 Law 20's admission is a proximity window, not a name

`lawTwenty` admits any stop reference whose surrounding ±400/200 characters contain the substring
`sparkle-rainbow`. I planted a chrome rule 60 characters after a `url(#sparkle-rainbow)` line →
**0 offences**; then injected `.injected { color: var(--color-solver-ink-3) }` into the real
`GameControlPanel.vue`, 300 characters after its own `#sparkle-rainbow` at :2083 → **0 offences**.
The gate's own comment promises "never a pattern that would quietly admit the next one". Admit by
FILE + selector id, or by an explicit line pin, not by a text window.

Beside it: `check-font-coverage`'s generalised bound census builds its `surfaces` list **from
`BOUND_TAPES` itself**, so a drawn binding on a third tag stays invisible; the gate discovers only
what it already knows, and the comment "a new binding reds" holds only inside its own allowlist.

### 2.10 Two R6 rows moved without a disposition, and are unreported

`index.css` writes "**LAW 19, amended in this commit**" (wax for strokes → ink on the light paper)
— law 19 is not in the chair's §6.7 list, so this is a lane amending decided history in a code
comment. And law 21 ("no player is ever assigned wax or a rainbow stop") is touched: dark
`--color-user-ink: var(--color-crayon-blue)` binds the local player's ink to a crayon, where HEAD
had a stock hex. The return reports laws 20, 25 and 39 and is silent on both. By the chair's own
standard (§6.7, law 39) unreported is a gap.

### 2.11 Neither crop shows what its caption claims

Frame 2 is captioned "the answer's violet as the revealed digits and as the trace at once — the
kill-by-form". The image shows the solved digits in the **five-stop rainbow** (pink → teal) and
**no trace at all**: renaming stop 2 does not make a revealed digit read violet, so the palette's
central claim — violet ⇒ the answer — is asserted, not shown. Frame 1's caption says "the ring's
first arc whole above it"; the crop carries no violet pixel. Two of four crops spent, and the
gestalt is still unverified. A third crop at a fill where the arc is in frame would close it.

### 2.12 Declared, not paid; and not run

The step price (~31 px/digit at 9×9, ~158 at 4×4) ships only if ACC-FIVE's tween lands in the same
fold — the geometric front alone is a visibly stepping gauge. Arm A was not built though the brief
asked for it; the 16×16 arm, the 844×390 arm with W2 §2.2's reachability, the visual goldens
(`cell-light`'s declared pen delta, `grid-corner-light`'s 0 px), R6's heading census and R3's
wobble are all unrun; the G6 seed arm never reached the fold's own attribution tape across two
peers, which is the fix's motivating consumer.

### 2.13 One alias survived the law the family enforced on others

`--color-answer-mid` was deleted for having one consumer; `--color-answer-ink` now has exactly one
(`--color-progress-ink`, light) and survives only because the new allowlist was widened to name
it. Role-token-over-rung is a defensible reading — the theme inversion needs the indirection — but
it should be argued once, not settled by an allowlist entry.

---

## 3. Checklist

| item | verdict |
|---|---|
| vacuous convergence | clear — the spec is falsifiable and one of its own theses was falsified |
| spec-cites-itself | **hit** (§2.3, §2.8): the painted ledger is the single source and two of its rows are not what they say |
| gates that cannot fail | **hit ×3** (§2.2 the stub, §2.9 the proximity admission, §2.9 the self-referential surface list) |
| elegant-reduction trap | **hit** (§2.12): the front is geometry "and then" someone else's tween |
| legacy aliases | borderline (§2.13) |
| masked fallbacks | minor: `tally \|\| countLine` hides the count entirely whenever debug ink is on |
| unverified gestalt | **hit** (§2.11) |
| consumer-less substrate | clear |
| generic default | clear — nothing here reads templated |
| the pixel it moves and did not declare | **hit in the source** (§2.7); the phone's 13.6 px IS declared (§2.6) |
| constraints (AA / filterBudget / M16 / W2 / decided history) | AA recomputed and holds; filterBudget 9 held by the estate's own census; M16 clean; **W2's shared band unasserted (§2.6)**; **R6 19/21 moved unreported (§2.10)** |

---

## 4. Verdict

**ADVANCE, at 72%.** The centre is real and mostly measured: the segment law is closed with a
mechanism and a 74-point control, the count off the board is the right answer to a question three
corners could not answer, and the family found and reported its own worst gaps. Nothing here is a
missing primitive as hard as the problem, and nothing is a rewording — so not BLOCK, not RETIRE.
But the percentage does not go higher while a shipped comment, a shipped test name and a shipped π
figure each say the opposite of what the tree does (§2.1, §2.2, §2.4, §2.7), a palette byte is
minted on a ratio the lane cannot reproduce (§2.3), a charter gate is unmet (§2.5), two new gates
have holes I walked through (§2.9), and the look is still unphotographed (§2.11).

Nine of these close with edits measured in lines, not designs. The one that needs a decision
rather than a measurement is §2.3 — and it is the one that spends the palette's byte.
