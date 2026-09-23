# MOT-LADDER — pass 5 CRITIQUE (adversarial, non-author)

T9-W7 §13 the transition grammar. Subject: the pass-5 prototype in the merged §13 tree
`.claude/worktrees/wf_f72f3b5a-83a-59` (tree `56d78d71` at my open, re-derived through a temporary
index: identical to the bank) and `pass5/prototype/MOT-LADDER/README.md`. Base and π control in
every row: **`74a2b5d9`** (`w7-control`, dist `index-CubiZsMVSwTc.js`, served read-only, never built
or edited). A third arm isolates THIS pass: **T4** = `74a2b5d9` + `pass4/prototype/MOT-VERB/pass4.diff`
(tree `68be3384`), built by me. Payload in every browser row: `?game=sudoku&board=` +
`encodeSudoku(3, <71 givens>, 81)` = `ATMuMDM0NjA4OTEy…`.

**CONVERGENCE: 76 %. VERDICT: ADVANCE.**

The pass moved real things: the registrations are one block (eight, depth 0, both engines, in the
CSSOM), the class clause is a spec that reds on a real regression, the exit ballot was finally built
and falsified, and the pass-5 advance moves **zero painted bytes** against both the pass-4 tree and
the control. The title claim still fails. **The ratchet lets a real 300 → 150 ms shortening through
CI's exact invocation by three new routes.** One of them is the same unvalued-escape class the
pass-4 critic named, now the fourth time it has turned up. On top of that, this pass added a new
unvalued escape row of its own.

---

## 0 · Numbers first (re-measured by me, both engines)

| reading | control `74a2b5d9` | T4 (pass-4 tree) | **T5 (this tree)** |
| --- | --- | --- | --- |
| dist, **clean build** of the returned tree | `index-CubiZsMVSwTc.js` | `index-DkuI4zTVEX9A.js` | **`index-Dn-LDSadV1ia.js`**, not the cited `index-C1yHADtfrqWN.js` (§2.4) |
| given-set read back (`.board-cells [aria-label]`) | 71 givens, sha1 `9c301f2981a8` | same | **same**, all four pages, both engines |
| π at rest, 5 poses (play 1440 light/dark fine, play 390×844 coarse, gallery 1440 fine, gallery 390×844 dark coarse) | — | T5−T4: 0 one-sided keys, maxΔ 0/0.01 px, **opacity-only 4–12 vs noise 4–12, 0 timing deltas** | T5−CTL: 0 one-sided of 825–934 keys, 0 moved, paint deltas **opacity only**; 0 colour/bg/4 border colours+widths/box-shadow/outline/fill/stroke/stroke-width/fill-/stroke-opacity/font/line-height/transform/filter/visibility/clip-path |
| **painted bytes**, reduce, rest, light+dark × 1440 fine / 390 coarse | CTL−CTLb 0 px | T4−T4b 0 px | **T5−T4 0 px · T5−CTL 0 px**, every cell, both engines |
| gallery face transform | `matrix(0.452358…)` / `(0.651877…)` | same | **identical** |
| PRM, tweening rendered elements under `reduce` (4 poses) | 62 / 57 / 70 / 65 (45 / 40 / 53 / 48 outside the toggle) | — | **16 / 16 / 16 / 16, all inside `.sun-moon-toggle`, 0 outside**, every rung `0s` |
| CSSOM registrations | 0 | 7, depth 0 | **8, depth 0**, `--live-fit` `<number>`/inherits/`0` |
| absence = reduce (publisher node removed, a `throw` consumer) | `0s`, property `all` | `0.52s → 0s`, `opacity` | `0.52s → 0s`, `opacity` |
| GC1 (inline fit stripped on the declaring host) | board 672×672 | 672×672 | **0×0** |
| `ladder-prm.spec.ts` | **2/2 RED** (at the rung row) | — | **2/2 green**; my **break** (one rung consumer typed back to `150ms`) **2/2 RED** at the roster row |
| theme flip, T5 vs **T4** (isolates this pass) | — | — | toggle opacity Δ 0.005–0.077 vs noise 0.015–0.218; first frame 4.5 vs 5.1/6.3 ms (chromium desk), 46 vs 47/48 (webkit desk) |
| dock-close phone `.drawer-case`, T5 vs T4 | — | — | 6.56 vs noise 6.95 (chromium); 1.14 vs 3.78 (webkit) |
| filter census (estate spec, my dist) | — | — | **12 passed** |
| bundle css+js, per-file gzip -9 | 524,594 / 172,954 | 529,586 / 174,242 | 529,304 / 174,214 → **+4,710 / +1,260 vs CTL; −282 / −28 vs T4** |
| `lint:bands` BARE / CI's env / `--self-test` | absent | — | **exit 1 (B8 = 5)** / exit 0 / 45 RED · 4 HELD (reproduced) |
| **my attacks on CI's exact invocation** | — | — | **A1, A2, A3 each exit 0 printing "nothing shortened"** (§2.1); `inherits: false` on a rung exit 0; `--live-fit` initial 0.99 exit 0; `dealStaggerMs` 90 → 10 exit 0 |
| `lint:copy` (M16) · `lint:motion` · `lint:lanes` · `lint:theme-tokens` · `lint:sleep` · `test:e2e:projects` · `lint:verbs` · `check-pw-projects` | 0 unadmitted | — | **0 · 0 · 0 · 0 · 0 · 0 · 0 · 0**, bare on a snapshot of the tree |

Summaries in `critique/MOT-LADDER/readings-summary.txt`; attack log in `attacks.log`; my instruments
in `instruments/`. No frames: every claim here is a number, and the wave's cap is better spent on a
ballot pair.

---

## 1 · Strengths, re-measured rather than accepted

1. **The pass-5 advance is pixel-silent, and now there is a byte-level proof of it.** A census with
   19 paint keys (the lane's had 9) plus six timing keys reads T5 against T4 as opacity-only
   inside the T4-vs-T4 noise, with **zero timing deltas at rest**. A byte diff of the painted frame
   reads **0 differing pixels** T5 = T4 = CTL on both themes, two viewports and both engines, with
   the noise arms also at 0. AA is therefore settled from painted bytes, not argued: no byte moves,
   so no ratio can. The T5-vs-CTL timing deltas (`ttf` 12–25, `td` 1–2 at rest: `0.5s → 0.52s` on
   the solve sweep, the `controls-fade-in` curve) are pass-4 content and are declared there.
2. **The class clause is now a spec that can fail, and I made it fail.** The in-run plant is not
   the only control: I typed one rung consumer (`.drawer-tab-text`, whisper) back to its control
   literal `150ms`, rebuilt, and the spec went **2/2 RED at "tweening under reduce outside
   .sun-moon-toggle"** in both engines. Restored by sha1. My roster also covers the three poses the
   spec does not (phone play, gallery desk and gallery phone dark coarse), and they read **16/16/16,
   0 outside** against the control's 57/70/65.
3. **ONE block, verified in the CSSOM rather than in source.** There are eight `CSSPropertyRule`s
   at depth 0 in both engines and none nested; the built CSS carries each name once. T4's CSSOM had
   seven because lightningcss collapsed the illegal nested twin, which is why this row mattered.
   The four break rows the lane claims all RED on my copy: `rise` → 100 (B2, B6 and G-DOCK-BAND),
   `--motion-note` deleted (B3), `--motion-step` nested in `:root` (B3 ×2), and `stagger = 90`
   restored (B11). The self-test's 45 RED and 4 HELD reproduce.
4. **GC1 reproduces three ways.** With the inline fit stripped on the declaring host, T5 draws 0×0
   (`matrix(0,…)`), while T4 and the control both draw 672×672, in both engines. The visible-failure
   clause of the @property law is landed at `initial-value: 0`.
5. **The exit ballot was paid, and paid against interest.** A second dist was built, it moved
   nothing, and the ballot is withdrawn with a mechanism named (the deck stays in flow for its 200 ms
   leave) and handed to VERB with its born-RED number. G-EXIT-MIRROR is struck honestly. I did not
   re-run §7(h). The `readings/exit5-*.json` agree with the README cell for cell.
6. **The pass-5 advance falsified one of its own hypotheses, although it was the critic who ran the
   falsifying measurement.** The theme-flip opacity delta the lane reproduced against the control
   is **not this pass's work**: T5 against T4 reads 0.005–0.077 against noise of 0.015–0.218, with
   the first frame the same in both engines. The candidate "an eighth registered property lags the
   flip frame" is refuted for pass 5; whatever produces the delta arrived with pass 4's merged tree.
   The unclaimed `.drawer-case` Δ6.62 on chromium dock-close is also inside noise against T4
   (6.56 vs 6.95), so it is not this pass's either.
7. **The ballot re-cut is correct.** `dockPick` prices only matched cells, the docstring carries
   webkit's 5314 vs 4607 and the 844×390 fact, and the sixth G-DOCK-BAND clause recomputes the
   sentence. The strip is one dist and one variable (the clock substituted at the `animate()` seam),
   on one payload, webkit, light, 768×1024, coarse. I looked at it: the 600 row trails the 520 row
   at every instant, which is what the caption says.

---

## 2 · What is NOT converged — demonstrated, not argued

### 2.1 THE RATCHET STILL PASSES A REAL SHORTENING — three new routes, the class's fourth appearance

Each attack ran on a scratch copy of the tree through **CI's exact lane**
(`MOTION_LADDER_B8_OWNED=1 npm run lint:bands`) and, where it applied, also through `lint:verbs`.
Every one exits 0 and prints *"…and nothing shortened."*

- **A1 · a MOVED row whose `newKey` is somebody else's.** `.cell-reveal-animated` at `0.3s` is renamed
  to `.cell-reveal-anim` at `0.15s`, in the CSS and in both consumers (`DigitCell.vue`,
  `filterBudget.ts`). One MOVED row is added:
  `{ key: "…:: .cell-reveal-animated :: cell-reveal", newKey: "MOTION.characters.refuse" }`
  (600 ≥ 300). The CHARACTER row is retargeted to `[150]`, and VERB's literal-keyed admission is
  re-keyed to `0.15s`. Result: `lint:bands` 0 and `lint:verbs` 0. B6 checks that `newKey` exists
  at ≥ the banked value. It never checks that `newKey` is the moved site: it does not require a key
  the bank does not already hold, it does not require one claim per new key, and it accepts any
  `MOTION.characters.*`. The self-test's door 2 (newKey at 150) cannot see this, because the
  attacker points the key somewhere else.
- **A2 · the floor is an unstamped file.** Four one-line edits pass: `motion-bank.json`'s
  cell-reveal site 300 → 150, the CSS to `0.15s`, the CHARACTER row `[150]` and VERB's admission.
  `readBank` prefers the disk file and never re-derives it against `BASE_REF`. CI's checkout sets
  no `fetch-depth`, so `74a2b5d9` is unreachable there and **the file is the only floor CI has**.
  The gate's own docstring says "a bank written from the tree it guards is a ratchet that cannot
  catch its own author". The file can now be written by that author.
- **A3 · the whole-file skip.** `CaretOverlay.vue`'s one length (`.board-leaving .caret-layer`,
  `leave` 200) is deleted there and appended to `index.css` at `var(--motion-whisper)` (150), with
  **zero ledger rows**. B6 skips an orphan whose file no longer carries lengths ("B1's ledger owns
  that case"), but a rung consumer has no B1 row, so nothing owns it. Ten files hold exactly one
  banked site each, so this route is open across the estate.

The cure is three sentences of code, and each ships with its attack as a self-test control:
(i) a MOVED `newKey` must be a live site key **absent from the bank**, claimed by exactly one row,
and a `MOTION.characters.*` newKey only when the renamed site consumes that character;
(ii) the bank carries a sha256 stamp that the script holds (or B6 re-derives the floor from
`BASE_REF` whenever it is reachable and reds on any bank key below it);
(iii) an orphaned bank key reds unconditionally unless a MOVED or DELETED row names it with its value.

### 2.2 THE @PROPERTY LAW'S SECOND CLAUSE IS UNGATED ON THE LADDER'S OWN BLOCK

B3 checks that each rung is registered, at depth 0, with `initial-value: 0ms`. **It never reads
`inherits`.** On the copy, `@property --motion-throw { inherits: false }` → `lint:bands` 0,
`lint:verbs` 0, `lint:theme-tokens` 0. The consequence is measured in the page, in both engines: a
child of a non-inherited `<time>` set on `:root` reads **`0s`**. That silently reduces every
`throw` consumer below `:root` (the fold, the solve sweep) with no gate noticing. The estate spec
can't see it either, because under `reduce` everything is already 0s. Separately,
`liveFitLaw`'s `/initial-value:\s*0\s*;?/` accepts **`0.99`** (exit 0), which defeats the
visible-failure clause it exists to enforce: an unmeasured fit would paint a 665 px board, not an
empty face. The cure is to assert `inherits:\s*true\s*;` on every ladder registration and anchor
the initial to `/initial-value:\s*0\s*;/` (or parse the number). Each ships with its plant.

### 2.3 THIS PASS MINTED A NEW UNVALUED ESCAPE ROW

`EXEMPT_KEYS.dealStaggerMs` names a cite and no number. `dealStaggerMs: 90 → 10` exits 0: the deal's
visible cadence can collapse by 89 % and no gate reads it. LAWS P4 is explicit that an escape row
in any ledger carries its VALUE, and that a row with a cite and no number disarms the gate
permanently. The stagger is a delay (B9's axis), so it isn't a length, but it is now a homed
clock that nothing bounds. The cure is `{ why, ms: 90 }` in the exemption, with B2 reddening when
the shipped value differs.

### 2.4 THE CITED DIST IS NOT THE RETURNED TREE'S

Every browser reading in the README was taken on `index-C1yHADtfrqWN.js` / `index-5wEA1lZUVGOG.css`.
A clean build of tree `56d78d71` gives **`index-Dn-LDSadV1ia.js` / `index-CzMcUNChD8Q5.css`**. I built
it twice: once from a `git archive` snapshot, and once from the work tree itself with config, outDir
and cacheDir outside it. Both builds match each other. The JS sizes are identical (+2,359 against
the control). The CSS differs by **41 B** (99,151 here against the 99,192 that the lane's +2,392
implies). Tailwind mints utilities from scanned scratch, and `.mot-ladder/` was present while the
lane built. This is the LAWS P4 row ("build with scratch OUTSIDE the tree … rebuild the dist you cite
and compare its identity"). The pass-4 critic listed it as a graft. No reading is voided, because
my own π, PRM, filter and bundle rows on the clean dist agree with the lane's, but the identity
claim is false as written.

### 2.5 THE PAYLOAD READ-BACK WAS VACUOUS

`pi5.spec.ts` compares `.board-cells.innerText`. The digits are SVG glyphs, so the string is empty
on every arm: `readings/pi5-*.json` records `givensLen: [0, 0, 0]` in all 16 poses. The README's
"givens read back equal 16/16" therefore compares three empty strings. **The pin is real**: my
read-back through the cells' `aria-label`s finds 71 `given clue` labels with the same sha1
`9c301f2981a8` on all four arms in both engines. The row stands by my measurement, not the lane's.
The instrument should read the ARIA corpus and assert the count > 0.

### 2.6 GC2 IS MIS-STATED

The README says that over the §13 diff outside `pencilConfig`, the only literal on a changed line
is `scene.css:612`'s 150 ms delay. That's wrong. `AnswerKeyLaminate.vue`'s changed lines carry
**`opacity 280ms` and `transform 280ms`**: a re-curve that kept its literal and is admitted by a
SIGNATURE row. INTAKE row 43's GC2 reads "no timing literal outside `pencilConfig` in the §10/§13
diffs". The row stays open until the 280 is either named on `MOTION` (a graded pair with
`leave` 200, R6 §1.2) or carried as GC2's declared exception with its value.

### 2.7 The smaller owed rows

- **`lint:bands` BARE exits 1 (B8 = 5)** and the env var stays in `ci.yml`. This is declared,
  priced and handed to VERB (charter row 3 open). The ci.yml comment says "four of the five" have
  no exact twin, and the README table agrees.
- **The spec covers one pose of the four** where the clause matters. My roster shows the other
  three clean today, but the row does not hold them. On the control the spec reds at the rung
  assertion and never reaches the roster clause (my break-test shows that clause can fail on the
  tree, but that is a critic's run, not the lane's).
- **GC1 is a hand probe, not an estate row**, and its static half is the 0.99-blind regex above.
- **The bundle**: +4,710 / +1,260 on the clean merged dist, against the +400 / +150 ceiling. The
  lane under-claimed one thing: **this pass alone is −282 raw / −28 gz against T4** (the
  `@source not` strip outweighs the added registration). The chair's re-cut stands as the lane
  asks.
- **Unrun**: §7(l) theme flips ×6 at 4×, r1 `heading-voice.spec.ts`, r3 `wobble.probe.ts`
  (declared).
- **Record**: `pass5-ladder.diff` on disk is the chair's cumulative re-cut (311,449 B, 52 files;
  `pass5-ladder.diff.md` says so). The README's "54,057 B, 1,173 lines, 8 files" is the pure delta.
  I reproduced it exactly as T5 − (74a2b5d9 + pass4.diff), `+718/−97`. The README sentence should
  point at the note.
- **The forks are the chair's**: GM-2 (`MOTION.characters.bloom`, park 0.182 against the shipped
  0.06) was not built, because the adjudication refuses it outside T9-B11 arm B. `--deck-top` was
  not registered, and INTAKE row 42 says the same, so that row reads closed against the later
  brief.

---

## 3 · Failure-mode checklist

| item | verdict |
| --- | --- |
| vacuous convergence | **HIT**: the π given-set read-back compared empty strings in 16/16 poses (§2.5); the pin holds by my read |
| spec-cites-itself circularity | **clear**: G-DOCK-BAND recomputes the sentence, the cell and the table from the series |
| gates that cannot fail | **HIT**: B6 passes three real shortenings on CI's invocation (§2.1); B3 cannot fail on `inherits: false` or an initial of 0.99 (§2.2) |
| the elegant-reduction trap | **partial**: the exit ballot was paid; B8's cure ("MOT-VERB's") is handed on for the third pass |
| legacy aliases | **clear**: the nested twin is deleted, not renamed; `--live-fit, 1` and the script twin are red |
| masked fallbacks | **clear on the surface**: 0 `var(--motion-*, …)` and 0 `var(--live-fit, …)` in the built CSS; absence reads `0s` / `opacity` in both engines |
| unverified gestalt | **clear**: π, painted bytes, PRM at four poses, GC1, the flip and the dock trace re-run by me on both engines; the strip looked at |
| consumer-less substrate | **clear**: `--live-fit`'s one consumer reads it bare, and every rung has consumers |
| the generic default | **clear**: nothing new is visible; the pass moves no pixel |
| the pixel it moves that it did not declare (π) | **clear**: T5 = T4 = CTL in painted bytes at rest; T5 vs T4 mid-gesture sits inside noise on the flip and the dock close |
| the constraint it forgot | **HIT**: the @property law's `inherits` clause is ungated (§2.2); LAWS P4's value law is broken by a new EXEMPT row (§2.3); the P4 dist-identity law (§2.4); GC2 (§2.6). AA, filterBudget (12 passed), M16 (0 unadmitted), W2's mechanics, the decided history and the undefined-token census all hold |

---

## 4 · Convergence, earned

**76 %** (from 74). Earned, net of pass 4: the one block closed and verified in the CSSOM in both
engines (+2); the class clause turned into a spec that reds on a real regression, with the clause
holding at four poses (+2); the exit ballot built and falsified with a named mechanism (+2); a
pass that is pixel-silent to the byte, with AA settled from painted bytes (+1); the ballot re-cut on
the matched series (+1). Withheld: B6 passes a real shortening by three new routes, the title claim
failing a fourth time (−3 held against the pass-4 withholding that this pass was meant to cure);
the `inherits` clause and the 0.99 initial ungated (−1); a new unvalued EXEMPT row (−1); the cited
dist not the tree's, and the payload read-back vacuous (−1); GC2 mis-stated (−0.5); B8 bare 1 still
open (−0.5).

**ADVANCE.** Nothing here is a missing primitive and nothing is a rewording: every cure is a line or
three of gate code with its attack as the self-test control, and the family's hard idea (that
absence and reduce are the same value) is settled on the surface in both engines. It doesn't close
because the ratchet can still be made to lie, and the reason is the one the pass-4 critic named:
an escape row's value has to be bound to its **subject**, not merely present.

**The next pass closes it by** adding §2.1's three sentences with A1/A2/A3 as self-test controls, all
break-tested through CI's invocation; `inherits: true` plus an anchored initial in B3, with their
plants; a value on every EXEMPT row; a clean rebuild with its identity cited; the ARIA read-back in
every π instrument; GC2's 280 homed or declared with its value; the spec widened to the four poses;
and B8 at 0 with the env var deleted (VERB's commit).

---

## 5 · Cross-pollination

1. **An escape row's value must be bound to its SUBJECT, not just present.** A `newKey` that can
   name any live key is a value with no subject. This applies to every ledger with a MOVED or
   renamed class (`check-copy-register`, VERB's `--why` ledger, NOTE-*'s admitted rows).
2. **A ratchet's floor file is part of the gate.** Stamp it or re-derive it. With CI at checkout
   depth 1, `BASE_REF` fallbacks never run, so the disk file is the whole floor.
3. **Read a pinned board back through the ARIA corpus**, never `innerText`, on any SVG-glyph board.
   Any lane whose π row says "givens equal" off `innerText` compared empty strings. I found this
   instrument copied from the shared shape.
4. **Isolate a pass by building its predecessor as a third arm.** T4 (the base plus the previous
   bank) turned an unattributed flip delta into "not this pass" in one run, and it priced this
   pass's bundle at −282 raw where the merged figure hid it.
5. **A painted-bytes diff with noise arms is the cheapest AA row for a timing-only family.** Zero
   differing pixels on both themes and both engines is a stronger statement than any ratio.
6. **An @property gate reads all four descriptors.** `inherits: false` on a `<time>` set on `:root`
   silently zeroes every descendant consumer, measured in both engines.

---

## 6 · Incidents, self-declared

1. **The lane's tree was snapshotted, not served in place.** I verified the work tree's write-tree
   = `56d78d71` at open, then `git archive`d that tree object (and T4's `68be3384`) into my
   scratchpad, because VERB works on top of the same tree next. One build ran from the work tree
   itself with config, outDir and cacheDir all outside it, to test the dist identity. Its
   `git status` is unchanged at return (52 entries, the same ignored set).
2. **My first build config failed twice** (`--configLoader runner`: `__dirname` undefined; a `.ts`
   config outside a package compiled as CJS). A `.mts` config fixed it. A pre-existing
   `dist-tree/` in the shared scratchpad belongs to another agent and was not used.
3. **One read-only `git grep` was aimed at the control tree** (`git -C w7-control grep`) to find a
   Tailwind duration class. It wrote nothing. It should have been `git grep 74a2b5d9` from the main
   repo, and I declare it.
4. **My first break-test didn't break.** `.logo-caret` has its own reduce `transition: none`, so
   typing it back to `200ms` could not tween under reduce, and the spec stayed green correctly. The
   second break (`.drawer-tab-text`) is the one reported.
5. **My first given-set read used `innerText`**, reproducing the lane's vacuous read (`givens=false`
   on my own guard of `length > 0`). It was replaced by the ARIA read before any number was taken
   from it.
6. **Servers**: T5 :4243 (pid 24507), control :4244 (24510), T4 :4245 (26106), and the two break
   dists on :4247 (37425, then 38625). All were killed by PID. Afterwards 4246 and 4247 are held by
   another lane (`-33`'s preview and the shared control), not mine. Main's
   `node_modules/.vite-temp` is empty. Every config of mine lived in the scratchpad, where no
   `node_modules` ancestor exists.
7. **Attacks ran on a scratch copy**, restored between rows from the snapshot. The snapshot's
   `HandwrittenLogo.vue` and `DrawerTab.vue` were sha1-restored after the break builds. No product
   file in any worktree or on main was edited.
