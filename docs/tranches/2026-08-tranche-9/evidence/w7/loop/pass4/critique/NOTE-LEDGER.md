# T9-W7 pass 4 · NOTE-LEDGER — the adversarial critique

Critic wrote neither the charter nor the prototype. Everything marked **(mine)** was measured by
this lane on its own servers: prototype dev `:4230` (work tree `wf_f72f3b5a-83a-46`, my own
two-line config with a scratchpad cacheDir), the shared HEAD control `.claude/worktrees/w7-control`
on `:4231` (verified by its own asset hash `index-CubiZsMVSwTc.js`, never by a 200), the
prototype's BUILT DIST on `:4232` (`index-CzJXFPhXEQqA.js`). Instruments:
`critic-rest.mjs` (the canonical loop · AA from painted bytes · the landscape cell),
`critic-pi.mjs` (9 chrome keys × tag × x/y/w/h × 14 computed paint properties, on a `?board=`
payload I minted myself from the control's own dealt givens with the app's codec),
`critic-pi-live.mjs` (the π row nobody has run). chromium + webkit throughout. All three servers
killed by recorded PID; `lsof -ti` empty on each; both scratch configs deleted; the work tree's
`git status` at return is the ten product files + `motionRungs.ts`, `git diff --stat` +1325 −48,
and `GameBoard.vue` / `check-font-coverage.mjs` sha1-restored after every ablation.

---

## 1 · What reproduces

| claim | mine | verdict |
|---|---|---|
| **`twoLineAtRest [false, true, true]`** — the one number that decides the family | chromium `[false,true,true]`, webkit `[false,true,true]`, canonical loop, real keystrokes, both lines read, 390×844 `hasTouch` with matchMedia witnessed (`coarse` true, `under-1024` true) | **CONFIRMED** |
| π on unclaimed surfaces vs `74a2b5d9` | 9 keys × tag × rect × 14 paint props, 390×844 and 1280×800, light and dark, both engines, on MY OWN codec payload (`\x01` + `3.<81 base36>` from the control's readOnly cells, `boardPinned` true on all 8 rows) — **0 deltas, 8/8 rows**; scrollHeight 844/844 and 800/800 | **CONFIRMED** |
| filterBudget never grows | computed-filter elements **25/25** light · **27/27** dark, `url()` filters **24/24**, proto = control, every rig both engines | **CONFIRMED** |
| AA both themes from PAINTED bytes | my own read (screenshot → canvas → extreme-luminance ink pixel vs modal backdrop pixel, so no token arithmetic anywhere): line two **7.495** light / **11.293** dark chromium, **5.172** / **11.184** webkit; line one **14.517** / **12.254** — identical to the return's line-one figures to three places | **CONFIRMED ≥4.5.** My line-two numbers run HIGHER than the return's 5.184/6.114 because I read the glyph core, not the nominal α; theirs is the conservative read and it also clears |
| landscape `display: none` | 812×375 `hasTouch`, witness `coarse`/`landscape`/`under-1024` all true: line two in the DOM with its text, computed `display: none`, rect 0×0, **both engines** | **CONFIRMED** |
| `lint:knip` cured | exit **0** bare (was 1) | **CONFIRMED** |
| the mechanical set, bare | `lint:knip` · `lint:copy` · `lint:ink` · `lint:motion` · `lint:live-regions` · `lint:boundary` · `lint:theme-tokens` · `test:font-coverage` · `vue-tsc --noEmit` — **nine, all exit 0**, exit codes unpiped | **CONFIRMED** |
| the unit | `vitest run GameBoard.receipt.test.ts GameBoard.notes.test.ts` → **2 files / 44 tests passed**, exit 0 (pass 3 read 41 — three new rows) | **CONFIRMED** |
| the built dist is the HOLD arm | the dist (`index-CzJXFPhXEQqA.js`) was built at 09:36:50 and `GameBoard.vue` last written at 09:43:07, so the README's "every row re-run on the SETTLED tree" cannot cover the build. I settled it by driving the canonical loop against the SERVED dist: chromium `[false,true,true]` — **HOLD**. The goldens, the filter census and L13 read a HOLD build | **CONFIRMED, by a different route than the return's** |
| the frames hold their subjects | F2-hold paints two sentences (`only 5 fits here` / `only 4 fits here`); F2-age paints one quiet caption under an empty gap; F3 paints the desk pair **with margin text in it** — the C4 failure is not repeated | **CONFIRMED by eye** |

**Born-RED, demonstrated by me with the negative control in the same run:**

- **GATE 1** (`the record HOLDS its line`) reds on the AGE arm: `LEDGER_FULFILLED_AGES = true` →
  `1 failed | 43 passed`, `AssertionError: proved true, and a true record is not erased by its
  proof: expected '' to be 'only 4 fits here'`. Tree restored, sha1 identical.
- **GATE 9's new receipt row** reds under ablation: neutering `if (kind === "empty")
  marginPrevious.value = null` (`GameBoard.vue:717`) → `AssertionError: the attempt is over; its
  record goes with it: expected 'only 4 fits here' to be ''`, exit 1.
- **`check-font-coverage`** reds under ablation: deleting the declared `"solved it!"` → exit 1 with
  the ransom-note sentence naming the string and its call site. Restored → exit 0.

The centre is right and the pass earned it. The family's opening sentence is now true on the real
surface in both engines, and it arrived by **deleting a rule** — `liveVerdict !== "stands"` became
`falsified || (fulfilled && LEDGER_FULFILLED_AGES)`, one boolean, read once. The pass-4 source
advance over the banked `pass3.diff` is **three source edits totalling 66 changed lines**
(the fork, `--type-tag`→`--type-caption`, the knip inline) plus 176 lines of test and gate work.
That ratio is the compliment: the constraint envelope held while the one rule came out.

---

## 2 · What does not

### 2.1 GATE 1b CANNOT FAIL ON THE ARM IT NAMES. The born-RED claim is false. **(mine)**

The return, the README and the deltas all say: *"GATE 1b minted — ask, answer, ask again, two
sentences at rest — **born RED on the AGE arm**."* The row's own comment says *"Born RED on the
`age` arm of `LEDGER_FULFILLED`."*

```
LEDGER_FULFILLED_AGES = true
npx vitest run src/games/shared/GameBoard.receipt.test.ts -t "ask, answer, ask again"
  Test Files  1 passed (1)
       Tests  1 passed | 28 skipped (29)
  exit=0
```

It passes. On AGE, fulfilment moves the record to `marginPrevious` and empties line one; the
second question then writes line one and `setMargin`'s displacement guard (`else if (text &&
live.text …)`) never fires, because `live.text` is `""` — so `marginPrevious` keeps the FIRST
record and both assertions read exactly what HOLD reads. The two arms agree at the moment GATE 1b
samples them. Only GATE 1 separates them.

This is the pass-3 finding reproduced one pass later **inside the row minted to cure it**: a gate
written so it cannot see the thing it names. It is not fatal — GATE 1 does the work, and I proved
GATE 1 reds — but under registry §2.10 a gate a critic proves cannot fail is **struck from the
convergence count until re-cut**, and the return spends it twice (deltas row 4, README rows 2
and 170). Re-cut: assert the pose at the moment the arms differ (line one non-empty immediately
after fulfilment, before the second ask) or drop the row and let GATE 1 carry it alone.

### 2.2 The two rungs it consumes are DECLARED NOWHERE STATIC, and the census that would say so was not run.

```
grep -rn -- "--motion-note\s*:" web/frontend/src/   →  0 hits
grep -rn -- "motion-note" src/assets/*.css          →  0 hits
```

`MarginNote.vue:264/278/279/462` consume `var(--motion-note)` and `var(--motion-whisper)` **bare**
(correct per §6.5 — no fallback), but their only declaration in the whole estate is the runtime
`<style data-motion-rungs>` node that `publishMotionRungs()` writes. The return names half of
this — the @property law's first clause, breached because the registration is emitted by the
publisher it guards, with the measured consequence that an absent publisher makes the rungs
resolve to `""` and the leave lose its animation entirely rather than go instant. That half is
honestly reported and correctly assigned to MOT-LADDER (registry §2.7).

The half it does not name is its OWN obligation: LAWS §Gates and registry §2.11 say *every lane
consuming a rung runs the copy* of MOT-VERB's undefined-token census. It was not run, and not
listed among the unrun instruments. `lint:theme-tokens` exits 0 and cannot substitute — I read it:
it is the forward half only (`@theme` declared → consumed), explicitly "hunts declared-but-
unreferenced", so referenced-but-undeclared is invisible to it. The family ships four `var()` in
timing slots that no static stylesheet declares and ran no instrument that can see them.

### 2.3 π HAS NEVER BEEN READ WITH THE LEDGER POPULATED — on either pass. **(mine)**

`pass4/prototype/NOTE-LEDGER/probe/pi.probe.mjs` contains no `keyboard`, no hint arm and no loop:
every one of its eight rows censuses the page **at load, with the margin empty**. Mine did the
same and also read 0/8. So the surface the family actually adds — a second line of ink under the
board — has never been compared against `74a2b5d9` in any π row that exists.

It is not an idle question. Driving two rounds of the loop before censusing **(mine)**, at
1280×800 both engines:

```
.board-margin   h  23.61 (proto)  vs  20.80 (control)   Δ +2.81 px
.board-margin   bottom 794.45 vs 791.64 (chr) · 794.16 vs 791.34 (wk)
```

I must declare my own instrument's fault: that pair is **not a valid π row**, because on the
pinned deal the prototype's line one read `"the answer is 1"` while the control's read `""` — the
arms were in different states, so the 2.81 px is a populated strip against an empty one, not the
ledger's cost. (2.81 px is also the figure registry §5 books against NOTE-ERASE at 1280.) The row
is therefore still **OWED**, and it is the one π row this family, above all others, needs:
`#fold-tools`, `.play-controls` and `scrollHeight` read with line two present at ≥1024, where
line two is in flow rather than `position: absolute`.

### 2.4 HOLD has no expiry, and the design has no sentence about that.

Read in the source, not asserted: `setMargin` displaces only on a CHANGE of sentence with
`live.kind === "record"`, and the fulfilment branch no longer fires. So a proved record holds the
live line at **full graphite** — 18.176 px, AA 14.517 — for as long as the reader asks no further
question. The strip's loudest ink is a settled question. The prototyper names this as the thing
they would attack, and they are right; the fork's ARM A has no answer to it and no third arm
(decay, a spent tint, a rung step after N writes) was built or costed. Neither arm was read by a
reader.

### 2.5 The fork's two frames are not on one board, and the pair is what the owner votes on.

Confirmed by eye: F2-hold paints `only 5 fits here` / `only 4 fits here`; F2-age paints `only 7
fits here`. Under the chair's 2026-09-19 addendum a ballot pair is **contaminated until both arms
load one encoded board**. The return declares it (gap 11) and argues the pose does not turn on the
deal, which is true — but the codec is now understood by this lane (my own payload minted in four
lines of Node), so the re-shoot is minutes, and an owner comparing two frames should not have to
take the deal on trust.

### 2.6 The AGE arm is framed but unmeasured.

Its π, AA, filter and gate readings are **assumed** to be HOLD's. They probably are — the arms
differ by one boolean in one `if` — but "probably" is not a reading, and if the owner fires ARM B
the fold inherits a whole column of numbers nobody took.

### 2.7 Still open from the charter, unchanged

- **Three r0 censuses unrun**: `marks.probe.ts` R3-d (and its two-act diff), `marks2.probe.ts`
  R3-g, `wobble.probe.ts`. Correctly reported NOT MOVED. `budget.probe.ts` R3-h's supersession by
  the estate's own dist filter census is a sound trade and I accept it.
- **L2 on the wire — two passes running.** No `?wire=local` peer staged. The predicate is
  authorship-blind by construction and the unit rows cover elsewhere/house/cell, but the row the
  charter asked for does not exist.
- **`min-height` is on `.margin-note-block`, not on the voice.** HOLD deletes the 0×0 push by
  removing its producer, not by fixing the box. The bug is dormant, not gone: any future writer
  that pushes off an empty live line inherits it, and it is one declaration.
- **The desk run-on is priced, not cured** — 7.19 px, and F3 shows exactly how it reads.
- **The ransom note** (R6 law 30, U-10, twice declined) — eight codepoints admitted by name.
- **The evidence trim** is the chair's act on a frozen path; proposed, not done. Correct call.
- **Traceability nit**: the new L9 comment cites `GameBoard.vue:1313` for `CompletionVignette`; it
  is at `:1334`, and the `:text="marginLive.text"` binding the argument rests on is at `:1336`
  (which the README gets right). A number re-derived at citation is the house rule.

---

## 3 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | **HIT** — GATE 1b passes on the arm it is declared born-RED against (§2.1) |
| gates that cannot fail | **HIT** — the same row; struck under registry §2.10 until re-cut |
| spec-cites-itself | clear |
| elegant-reduction trap | **HIT, narrowly** — "and then the hard part" is the @property node this lane must consume and may not touch (§2.2); reporting it is right, but the family ships on top of a breached clause |
| legacy aliases | clear — `motionRungsCss` deleted outright, not renamed |
| masked fallbacks | **HIT** — landscape `display: none` makes the thesis vanish where it does not fit (§2.7 of pass 3, reproduced at 812×375) |
| unverified gestalt | **clear this pass** — F2 and F3 hold their subjects; the fork PAIR is still un-paired (§2.5) |
| consumer-less substrate | **CLEARED** — `lint:knip` exit 0, verified bare |
| the generic default | clear |
| the pixel it moves that it did not declare | **HIT** — every π row on both passes was read with the strip EMPTY (§2.3) |
| the constraint it forgot | **HIT** — the undefined-token census (registry §2.11), owed by every rung consumer, not run (§2.2) |
| M16 · AA · filterBudget · W2's mechanics · the decided history | **clear** — `lint:copy` 0 bare; AA ≥4.5 both themes both engines from painted bytes (mine); filters 25/27 · url 24, proto = control (mine); no new mechanic; law 27 and L17 taken from the chair's §1.3 rows and not edited by the lane |

---

## 4 · Verdict

**ADVANCE at 84 %** (pass 3: 76).

The eight points are earned by the one thing this pass had to do and did: the family's thesis pose
exists at rest, in both engines, on the real surface, and it cost a deletion. π, AA, filterBudget,
the knip lane, the stub isomorphism, the L9 re-cut with a row that reds under ablation, the font
sweep that fired on itself, the desk crop that finally holds its subject — every one of those I
re-derived rather than re-ran, and every one holds.

The sixteen points are held back by three things the return cannot claim and one it claimed
wrongly: a gate minted this pass **cannot fail** on the arm it names; the two timing rungs the
design consumes are **undeclared in every static stylesheet** and the census that exists to catch
exactly that was not run; the **π row for the family's own pose has never been taken**; and the
fork — the pass's headline — is **undecided, un-paired on one board, and unmeasured on one arm**.

None of that is a missing primitive and none of it is a constraint violation, so it is not BLOCK
and not RETIRE. It is also not a rewording: the diff is one boolean and the boolean changes what
the reader sees. ADVANCE.

The question pass 5 has to answer is no longer "what does line one hold after its record comes
true" — HOLD answers that. It is **"and then what?"** A record that holds the live line at full
pressure forever is a ledger with no clock. The fork gave the owner two arms; the third arm
nobody built — a spent record that keeps its line but stops shouting — is the one I would put on
the ballot beside them.

---

## 5 · Worth grafting elsewhere

1. **The one-token fork.** `const LEDGER_FULFILLED_AGES = false` at a named line, both arms
   buildable, served and framed from the same tree. It is the cheapest lawful form of a U-10
   hand-off yet seen in this wave, and every lane sitting on a design question should mint a
   boolean instead of a ballot paragraph. Note the incident that shapes it: a `"hold" | "age"`
   union `const` is TS2367 the moment it is compared — the arm must be a boolean.
2. **A DERIVED corpus whose strings are also DECLARED.** `check-font-coverage`'s
   `marginVerdictCopy` derives from the call sites AND lists the strings, so a deleted call site
   REDS the row instead of silently shrinking the corpus — "a derivation that can only shrink is
   not a gate." I proved the row reds by deleting one declaration. The general shape for every
   derived-corpus gate in the wave.
3. **Stub isomorphism as a rule.** A unit stub carrying an attribute the component does not have
   can pass a row the component would fail (`:data-hidden="yes|no"` under an L17 that forbids it).
   Every family running units against a stubbed child should diff the stub's template against the
   component's real bindings once.
4. **Minting the `?board=` payload yourself**, four lines of Node, from the CONTROL's own dealt
   givens: `toBase64Url(String.fromCharCode(1) + "3." + cells.map(v => v.toString(36)).join(""))`,
   then assert both arms read back the same given-set. Satisfies the chair's 2026-09-19 addendum
   without needing the product's share UI.
5. **Prove which arm a BUILT DIST holds by driving its canonical loop**, not by reading build
   timestamps. The dist here was six minutes older than the settled source; one loop against the
   served bundle settled it in two minutes.
6. **Read AA off the screenshot, not off the tokens** — clip the element, decode it on a canvas in
   the page, take the modal pixel as backdrop and the extreme-luminance pixel as ink. It needs no
   compositing arithmetic, so it cannot make the pass-3/pass-4 parse error (an `rgba()` regex
   eating `color(srgb … / 0.68)`'s alpha as the blue channel), and it disagreed with the token
   read in the safe direction.
