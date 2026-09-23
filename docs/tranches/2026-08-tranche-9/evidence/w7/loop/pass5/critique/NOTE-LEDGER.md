# T9-W7 pass 5 · NOTE-LEDGER — the adversarial critique

I wrote neither the charter nor the prototype. Everything marked **(mine)** I measured on my own
servers and dists: the shared HEAD control `.claude/worktrees/w7-control` on `:4230` (its pre-built
dist, verified by `index-CubiZsMVSwTc.js` on every load), and two dists I BUILT myself from the work
tree `wf_f72f3b5a-83a-46` with the token flipped: HOLD on `:4231`, TINT on `:4232`. I built with
`outDir` and `cacheDir` in the scratchpad, outside the tree, and restored the tree by sha1
(`a9e8142f`). My builds came out byte-identical in name to the prototype's reported arm identities
(`index-Cder9HygqQ5l.js` HOLD, `index-BXE037scA9iq.js` TINT), so the dists the return cites are
this source. Payload: one codec mint of the classic easy 9×9 (30 givens) from its givens,
`ATMuNTMw…ODAwNzk` (full string in `logs/critic-*.json`). Before every read, each arm read the
dealt given-set back equal to it. I ran chromium and webkit throughout, with `hasTouch` +
`isMobile` on the phone rigs and `(pointer: coarse)` witnessed true. My instrument is
`critique/NOTE-LEDGER/instruments/critic.mjs`. For π it reads EVERY element in `<body>` outside
`.board-margin` (1,081–1,122 of them): tag + class + rect + 8 computed paint properties. The
prototype read nine keys. Servers were killed by recorded PID (and their vite children), and
the three ports read empty afterwards. The work tree's `git status` shows the ten product files
plus `motionRungs.ts`, at +1445 −68.

---

## 0 · Numbers first (mine)

| row | reading | verdict on the return |
|---|---|---|
| arm census, both unit files, token flipped, sha1 restored | HOLD 45/45 exit 0 · AGE 3 failed (GATE 1, **GATE 1b re-cut** `expected '' to be 'only 2 fits here'`, GATE 1c) · STEP 1 failed (GATE 1c text) · TINT 1 failed (GATE 1c class) | **CONFIRMED exactly** |
| π POPULATED vs `74a2b5d9`, HOLD dist vs control dist, whole body outside the strip | P3 (two lines) and P4 (two answers), 1280×800 fine and 390×844 coarse, **both engines: rect 0 · paint 0 · scrollHeight 800/800, 844/844 · computed filters 25/25**. Key deltas are only boil-phase classes (`rest-pose.is-pose-active`, `boil-frame-bitmap.is-active`): 12 on webkit P3, and the control-vs-control row in the same run reads 12/12 (webkit) and 14 (chromium phone P3). At P4 the control's line one is EMPTY while HOLD holds two lines, and still 0 unclaimed | **CONFIRMED, on a wider census than the return's** |
| painted AA, 390×844 coarse, text Range, modal-pixel ground, per-column max contrast | HOLD line one median **14.52 L / 12.25 D** both engines. TINT spent line one median **5.17 L / 6.07 D chr, 6.13 D wk**; p30 **2.66 / 2.69 L, 4.98 / 3.54 D**; fraction of columns < 4.5 **0.33 / 0.32 L, 0.29 / 0.31 D**; worst column at 50/70/90/100 % median mass chr L [2.66 ×4], wk L [2.36/2.73/2.83/2.83], chr D [4.98 ×4], wk D [3.03/3.54/3.68/3.68]. Line two at P3 median 5.17 L / 6.07–6.13 D, under 4.5 0.10–0.12 | **CONFIRMED** (core median clears; no per-column floor, as the return says) |
| **TINT's push, WAAPI hooked** (new) | displacing a SPENT record at P3: keyframe 0 `color` = **`#262626` (L) / `#d1cfc7` (D)**, keyframe 1 = `color(srgb … / 0.68)`, both engines. The record was painted at α 0.68 the frame before | **UNDECLARED DEFECT** (§2.1) |
| filters, dark, 1280×800 P3 | control 27 · HOLD 27 · TINT 27 (chromium). Light phone 25/25, dark phone 27/27, both engines | CONFIRMED, never grows |
| landscape 844×390 coarse, P3 | HOLD line two in the DOM with its text, `display: none`, scrollHeight 410 = control 410, both engines | CONFIRMED |
| scoped undefined-token census (the lane's copy, run by me) | proto 19 unresolved / 5 timing, control 15 / 1; PLANT B RED, PLANT P green on both; exit 1 on both | CONFIRMED. The cite drifted, though: the fourth row is `MarginNote.vue:492` on the final tree (the return and README say `:491`, from a census log written at 20:57, before MarginNote's last write at 20:59:37) |
| break-test: un-spend-on-undo clause deleted, TINT arm | **1 failed / 45, the same GATE 1c row as intact TINT** (control in the same batch) | **UNGATED** (§2.2) |
| break-test: row 7's `.margin-note { min-height: inherit }` deleted | both unit files **45/45**, `lint:ink` 0, `lint:motion` 0 | **UNGATED** (§2.3) |
| break-test: the call site `setMargin("solved it!", …)` deleted | `test:font-coverage` **exit 0**; prints `departures … "solved it!"` | **the in-file claim is FALSE** (§2.4) |
| pre-return battery, bare, the work tree | `vue-tsc` 0 · `eslint .` 0 · `npm run lint` (prettier --check) 0 · `lint:lanes` 0 · `lint:sleep` 0 · `test:e2e:projects` 0 · `check-pw-projects` 0 · `lint:knip` 0 · `lint:boundary` 0 · `lint:live-regions` 0 · `lint:copy` 0 · `lint:theme-tokens` 0 · `lint:ink` 0 · `lint:motion` 0 · `test:font-coverage` 0 | CONFIRMED (the control's column is the return's; I did not run tools inside the read-only control tree) |
| evidence cap | `scripts/check-evidence-policy.mjs`: per-wave **3,177,069 B > 2,097,152 B** (the return read 3,114,009; siblings have added since) | RED, the chair's; this lane holds 102,197 B in 2 crops |

## 1 · What pass 5 closed (the charter's ten rows)

1. **GATE 1b re-cut**: it now ends on the second ANSWER and reds on AGE, with HOLD green in the same
   run. **Closed**, and GATE 1c tells all four values apart. Both are reproduced exactly.
2. **The undefined-token census, run**: 19/5 vs 15/1, the +4 are the family's, the plants
   discriminate. The count is **closed**. The CURE is §13's fold, and the cite needs one fix
   (`:492`).
3. **π populated**: 0/0 at P3 and P4, both cells, both engines, on a census 120× wider than the
   nine keys. **Closed.** The pass-4 +2.81 px stays inside `.board-margin` and moves nothing
   outside it.
4. **ARM C built in both forms**, measured and costed. **Closed as a build.** One arm carries an
   undeclared defect (§2.1).
5. **The fork on ONE payload**, arm the only variable per column. **Closed, with a hole**: the
   thesis pose is not in any frame (§2.5).
6. **Landscape**: line two is `display: none`, priced at +17/+16 px shown. The depth is the
   owner's. **The berth through the tab is still NOT BUILT**: pass-3 rulings §6.2 ("reachable
   through the tab, priced once"), two passes running.
7. **Row 7**: `min-height: inherit` cures the 0×0 push at zero rest-π. **Cured, not gated** (§2.3).
8. **L2 on the wire** 12/12 for HOLD (I did not re-run it). The r0 R3-d/R3-g rows are MOVED, with
   the PROPOSED diff under `instruments/`, and I checked the act: "second H press" consumes the
   hint by writing its digit, so it is a fulfilment, not a dismissal, and the MOVED reading is the
   design's own. The L9 cite is correct at `:1336`. The desk run-on of 7.19 px is priced, not
   cured.
9. **The hand's cut, re-derived**: eight rows give 46 → 54 ≈ +750 B at 93.7 B/cp. **Closed**, and
   the arithmetic is correct.
10. **The self-test**: the DECLARED-deletion direction reds. The call-site direction the file
    claims does not (§2.4).

## 2 · What does not

### 2.1 TINT re-darkens a spent record at the moment it ages. **(mine, undeclared)**

`MarginNote.vue`'s push hard-codes keyframe 0 to `--color-pencil-graphite` ("FULL-PRESSURE
GRAPHITE, not the live line's own colour"). That is right when a live record ages: it WAS full
pressure. Under TINT, though, the record being displaced is already SPENT, painted at
`color(srgb … / 0.68)`. The push then starts it at `#262626` / `#d1cfc7` and fades it back to
α 0.68 over the note rung. Measured both engines, both themes, at P3 on the TINT dist. The
arm's whole claim is "the strip's loudest ink is never a settled question", and for one rung
the settled question is the loudest ink in the column. Its pressure runs quiet → full → quiet.
The ballot frames cannot show it (they are rest poses), and the README's push table lists only
transforms. Fix: take keyframe 0's colour from line one's computed colour when the displaced
record was spent (one predicate at the call). Or declare the flash in the ballot row, with the
number, so the owner votes on it.

### 2.2 "Cleared on undo" has no row.

The README and the deltas both claim the `spent` stamp "un-spends when the proof is taken back
(an undo)". I deleted `else if (live.spent) live.spent = undefined;` on the TINT arm, and the
unit census reads the same as intact TINT: 1 failed / 45, the same GATE 1c row. No row in
either file ever undoes a proved record. Under TINT that clause is the difference between a
retracted proof reading quiet (wrong: the question is open again) and full (right). It is one
row: prove, undo, and assert no `is-spent` class. It should be born-RED with the clause deleted.

### 2.3 Row 7's cure is a probe reading, not a gate.

Pass 4's critique asked for "one declaration, or the guard". The declaration landed and the
guard did not. Deleting `.margin-note { min-height: inherit }` leaves both unit files at 45/45,
`lint:ink` at 0 and `lint:motion` at 0. The only instrument that sees the 0×0 push is the lane's
throwaway WAAPI probe. The cure is real (the return's keyframe `translate(0, −15.39) scale(1.1429)`
on fulfilment equals the displacement path), but a future writer can delete it and nothing
shipping goes red. That is the same class as NOTE-ERASE's pass-4 finding ("every live gate is a
throwaway probe").

### 2.4 The derived+declared corpus does not red on a deleted call site, and the wave carries the false sentence.

The pass-4 comment in `check-font-coverage.mjs` says: *"Named here as well as derived so a deleted
call site reds the row instead of silently shrinking the corpus."* I deleted the call site
`setMargin("solved it!", "gold-star", "empty")` outright, and the gate **exits 0**. It prints
`departures (declared, no longer rendered …): "solved it!"`, because the file's own law (lines
44–46) is "Departures are printed, never red." What the declaration buys is that the corpus
cannot SHRINK (the glyphs stay in the cut's test). A deleted call site does not red anything.
The break-test that DOES red (the lane's, and pass 4's critic's) deletes the DECLARED string,
which is the other direction (DERIVED ⊆ DECLARED). The false form of the sentence travelled as
a wave-wide graft: registry-v4 §3.8 and LAWS P4 ("a derived corpus whose strings are also
DECLARED reds when a call site is deleted"). Two fixes are possible: re-word the comment and the
graft to the true direction, or make a departure inside a declared-AND-derived group RED. The
second is the gate the sentence promised.

### 2.5 The ballot frames never show the ledger.

Both crops hold rows HOLD/AGE/STEP/TINT and columns P1 (ask, answer) and P2 (… next write).
Every cell paints at most ONE sentence. The two-line column at rest, the family's thesis, is
the pose where AGE ("one caption under an empty line") and the other three ("two sentences")
differ in SHAPE. It exists only at P3/P4, and no frame on record shows it now that pass 4's F2
crops are swept. The owner is asked what line one holds after its proof without seeing the
column that question serves. A P4 column in the same composite, same payload, is the fix. It
costs about 30 KB, and the wave's cap is the chair's problem either way. Also uncontrolled:
both crops are chromium light only. TINT's cost is a dark/light AA question (6.07 vs 5.17 core
median) and no dark frame of it exists. Finally, the crops were shot on the calc form of row 7,
not on the tree that ships. The argument that they match by construction holds at those two
cells, but it is an argument, not a re-shoot.

### 2.6 Carried, declared by the lane, re-read by me where marked

- **STEP breaks L2 for a spent record**: a peer's digit anywhere steps my proof down. It was not
  driven on the wire. It is declared, and it is the strongest reason STEP should not be the
  default.
- **TINT fails a per-column floor** (mine: 29–33 % of columns under 4.5, worst column at 50 %
  mass 2.36–4.98). The full-graphite line also has 28–30 % under, so this is the hand's class,
  not the tint's.
- **@property clause 1**: `MarginNote.vue:282/296/297/492` are runtime-only (§13's node, gone at
  the fold commit).
- **The landscape berth through the tab**: not built (row 6 above).
- **The desk run-on**: 7.19 px, priced, not cured.
- **The watch now joins the whole board on every write** (81–256 values). No rate was measured.
  The cost is trivially small, but LAWS say budgets are RATES, and the number is one
  `performance.now()` pair away.
- **HOLD ships ARM C's bookkeeping**: the `spent` stamp runs on every arm, and `.is-spent` is dead
  on three of four builds. It is a fold row once the owner rules.
- **Stub isomorphism is partial**. The receipt stub's `.margin-note` omits the `tone` class the
  component binds. The notes stub's block omits `margin-note-block` / `is-quiet` / `has-previous`.
  Neither carries the `meta` line. No row I read turns on those today, but the pass-4 rule was
  "diff the stub's template against the component's bindings once", and that diff is not
  empty.
- **The fork's token is a four-valued `as`-widened const** where the charter asked for a boolean
  per arm or a const compared nowhere. It is lawful under vue-tsc/eslint, and the lane carried
  the objection. I accept the form.
- **The fork, the landscape depth, the hand's cut**: the owner's (U-10). No non-author reader
  has looked at the frames except me.

## 3 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | clear: GATE 1b now reds on AGE, and GATE 1c reds each non-default arm (reproduced) |
| gates that cannot fail | **HIT**: the derived+declared corpus's call-site direction (§2.4); the un-spend clause and row 7 have no gate (§2.2, §2.3) |
| spec-cites-itself | clear |
| elegant-reduction trap | **narrow HIT, carried**: the rungs' static declaration is §13's "and then" |
| legacy aliases | clear |
| masked fallbacks | **HIT, carried**: landscape `display: none` hides the thesis where it does not fit, and the berth is unbuilt |
| unverified gestalt | **HIT**: the two-line pose is unframed; TINT's push flash is unframed and unnumbered in the return; no dark frame of the tint |
| consumer-less substrate | narrow: `.margin-note.is-spent` and the `spent` stamp are consumer-less on HOLD/AGE/STEP builds (declared) |
| the generic default | clear |
| the pixel it moves that it did not declare (π) | **clear at rest and populated** (mine, whole-body census). **HIT in motion**: TINT's push paints full graphite over a spent record (§2.1) |
| the constraint it forgot | AA from painted bytes: clear with the sensitivity row. filterBudget: 25/27 = control, both themes. M16: `lint:copy` 0, no new strings. W2's mechanics: no new mechanic. Decided history: law 27 obeyed, L17 at the chair's wording, R3 rows MOVED as a PROPOSED diff. @property clause 1: breached, §13's, declared. Undefined-token census: run, +4 runtime-only, declared |

## 4 · Verdict

**ADVANCE at 87 %** (pass 4: 84).

Three points are earned, by the rows I could reproduce and widen. The arm census is exact. π
with the ledger populated reads 0 over the whole body in both engines, including P4 where the
control's strip is empty. ARM C exists in both forms behind one token, and every value has a
row that sees it. The census was run and discriminates. The hand's cut arithmetic is right.
The pre-return battery is bare and green.

Thirteen points are refused. One of the two new arms paints the very thing it exists to
prevent, for one rung, in both engines and both themes, and the return does not know it. Two
claimed behaviours (un-spend on undo; the voice's reserve) can be deleted with every shipping
gate green. The self-test's advertised direction does not red, and the false sentence is
already a wave-wide graft. The owner's ballot frames omit the pose the family is named for.
The berth ruling from pass 3 is unbuilt. None of this is a missing primitive or a constraint
violation, and none of it is a rewording, so ADVANCE, not BLOCK or RETIRE. Each gap is one row
or one predicate.

## 5 · Worth grafting elsewhere

1. **The arm census as a shell script**: flip the one token, run the WHOLE files, and restore by
   sha1. Every value must red at least one row, which proves each arm is live code. Any lane with
   a U-10 fork should ship this.
2. **π over the whole body outside the claimed subtree**, with control-vs-control in the same
   run, instead of a key list. It cost nothing extra here, and it classifies the boil-phase noise
   (12–14 class flips) that a nine-key list would never see.
3. **Hook `Element.prototype.animate` before any script** to read keyframe 0 of every mover.
   Rest-pose frames and rect probes cannot see a colour that exists for one rung. This is how
   §2.1 was found, and it applies to every lane with a FLIP or push (§13, the dock, the fold).
4. **Correction for registry §3.8 / LAWS P4**: a derived+declared corpus reds when the
   DECLARATION is deleted. When a CALL SITE is deleted it prints a departure and exits 0, unless
   the gate is re-cut so a departure in a declared-and-derived group is red.
