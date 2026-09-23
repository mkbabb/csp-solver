# NOTE-ERASE · pass-6 CRITIQUE

I'm the critic. I didn't write the charter, the spec or the prototype. Base and π control: `74a2b5d9`.

**Convergence: 90 (held). Verdict: ADVANCE.**

The pass-5 blockers are cured, and I reproduced every cure: each pass-5 plant is now RED on its gate. Two new holes hold the number at 90:
- **The clock is only a TRANSITION fence.** Two one-line author rules beat the rub-out, and they hold it at 901–906 ms on both engines. The first is `--motion-whisper: 900ms` on `.margin-note`, with no `!important`. The second is `animation-duration: 900ms !important`. Every CI-side gate stays green on both.
- **The §7 ballot's frames don't show the section.** They were shot on LEDGER's builds, which don't have ERASE's settle. HOLD appears at full graphite. On ERASE's tree, a HOLD record settles to α 0.68 eight beats in.

The settled rung also still fails the named glyph-text median at WebKit DPR 1 light (4.357). That's estate row T9-R6. HOLD is the firing default and it includes this settle, so the default loses to the control on the same painted statistic.

## 0 · Setup

- **Rebuild.** I rebuilt the lane's tree in scratch (private cacheDir and outDir). The result is `index-B5bclKNTuHnj.js`, `diff -r` IDENTICAL to the tree's `dist/` (`logs/rebuild.log`).
- **Servers.** Tree on :4246, the shared control `w7-control` on :4247 (`index-CubiZsMVSwTc.js`), each verified by asset hash. Both are killed by PID and the ports are verified free.
- **Payload.** The lane's classic easy 9×9 (30 givens) for every row. The given-set is read back through the aria-label corpus. The drop-clock adversaries use the spec's own `CONFLICT_BOARD`.
- **Pass-6 delta.** I read it against `pass5/prototype/NOTE-ERASE/pass5.diff`, applied to a scratch archive of `74a2b5d9`. Four files differ, exactly the ones the lane named:
  - `marginNote.motion.test.ts`
  - `check-theme-tokens.mjs`
  - `e2e/affordances.spec.ts`
  - `pencilConfig.ts` (a comment)
- **Tree hygiene.** The work tree's `git status` shows 17 entries before and after. My plants ran on an rsync copy in scratch, never on the lane's tree. The `.vite-cache/` at the worktree root is dated Sep 19 and isn't mine.

## 1 · Re-measured (both engines)

### A · The pass-5 PLANT first, then mine (`logs/breaks.log`, `logs/breaks2.log`; all restored by sha1)

Plants on a scratch copy of the tree. Each row shows the unit file (`marginNote.motion.test.ts`) and then the registration row (`check-theme-tokens.mjs`, bare).

**The pass-5 plants:**

| plant | unit file | registration row |
|---|---|---|
| clean | 0 (12/12) | 0 |
| whisper 150→125 | **1** (G5) | 0 |
| rise 520→600 | **1** | 0 |
| step 440→1 | **1** | 0 |
| **swap whisper↔dusk** | **1** | 0 |
| **dead hook** `if (el) return;` | **1** (only the VTU row, 11/12) | 0 |
| delete `@property --motion-whisper` | 0 | **1** (self-test 2) |
| delete `@property --motion-rise` | 0 | **1** |
| nest all seven in `:root{}` | 0 | **1** |

**My plants:**

| plant | unit file | registration row |
|---|---|---|
| hook writes `none` without `important` | **1** (2 rows) | 0 |
| hook writes `transition-duration: 0s !important` | **1** | 0 |
| `inherits: false` on whisper | 0 | **1** |
| second `@property --motion-whisper` (inherits:false) in `typography.css` | 0 | **0** |
| **`.margin-note{--motion-whisper:900ms}` in index.css** | **0** | **0** |
| **`.margin-note-ink.note-leave-active{animation-duration:900ms !important}` in index.css** | **0** | **0** |

Where the two tables' columns don't reach:
- **`typography.css` duplicate.** `check-property-block` reds it (C1 and C5). `lint:motion`, the census and the unit file stay 0.
- **The two CSS-side retunes.** `lint:motion` 0 · `check-property-block` 0 · undefined-token census: 0 findings plus the one declared STALE `--refuse-dur` (chair A.1.4).

G5 now reads VALUES, the VTU row now reads BEHAVIOUR, and the registration row reds deletion, nesting and `inherits`. All three pass-5 "cannot fail" rows are cured on this tree.

### B · The clock, attacked on the ANIMATION axis (`logs/clock-adversaries.log`; the spec's own drop-clock code, tree dist)

| adversary (author origin) | chromium: node gone · td · ad | webkit |
|---|---|---|
| the spec's `transition: color 1000ms !important` | **152.4 ms** · 0s · 0.15s, 0.15s | **149** · 0s |
| `.margin-note { --motion-whisper: 900ms; }` (0,1,0, not important) | **904.2** · 0s · 0.9s, 0.9s | **901** |
| `.margin-note-ink.note-leave-active { animation-duration: 900ms !important; }` | **905.5** · 0s · 0.9s | **906** |

The hook fires in every arm (`transition-duration` reads `0s`), but it only stops a transition. The verb's own clock is the inherited rung. By the @property law's clause 4 it has to be `inherits: true`, so any ancestor can retune it, and any author `!important` on `animation-duration` can too.

"A clock no author rule can beat" is true for transitions only. Pass 5's adversaries were all transitions. The only gate that sees these two rules is the local e2e drop-clock row (`< MOTION.rungs.note`, 904 > 250). Under O-12 CI is browserless, so on CI nothing does (§A).

### C · Glyph-text AA of the settled rung (`logs/aa-summary.log`, `logs/aa-glyph-*.json`; the lane's probe copied, OUT re-pointed)

1280 fine. Core median over coverage ≥ 0.5, then the fraction under 4.5, then n.

| arm · theme | chromium DPR 1 / DPR 2 | webkit DPR 1 / DPR 2 |
|---|---|---|
| control line · light | 14.517 · 0.154 (389) / 14.517 · 0.070 | 11.419 · 0.148 (411) / 14.517 · 0.080 |
| **settled · light** | 5.172 · **0.458** / 5.172 · 0.221 | **4.357 · 0.515 (408)** / 5.172 · 0.253 |
| control line · dark | 11.656 · 0.044 / 12.254 · 0.021 | 11.41 · 0.044 / 12.254 · 0.033 |
| settled · dark | 5.857 · 0.272 / 6.071 · 0.145 | 5.691 · 0.315 / 6.127 · 0.176 |

- **Reproduced to the thousandth.** The lane's readings match. The fresh line is byte-for-byte the control's in every cell.
- **The median is the flat ink.** 5.172 is α 0.68 graphite on paper. At WebKit's DPR-1 raster the thin strokes pull the median below 4.5.
- **The fraction bound fails at every DPR.** The fraction exceeds the control's by +0.30/+0.37 at DPR 1 and +0.15/+0.17 at DPR 2.
- **`MarginNote.vue:288`'s comment is false for WebKit DPR 1** under the named statistic. It reads "PAINTS 5.17 light … (1280, DPR 1, both engines)".

### D · Whole-DOM π at W2's two landscape cells (`logs/pi-summary.txt`; raw JSON summarised, not banked)

This covers 1,051 elements in each arm, `hasTouch`, with `(pointer: coarse)` witnessed true on both arms. Control-vs-control floor: 1 at rest (logo clip).

| cell · state | tree vs control, both engines |
|---|---|
| 844×390 at rest | 21 elements: 20 rects + `min-height` + clip, max Δ 1.29. `button.drawer-tab` y **167.23 vs 166.59 (+0.64)**. Strip 22.09 vs 20.80. docH +1 |
| 812×375 at rest | 21 elements, max Δ 1.19. Tab **159.69 vs 159.09 (+0.60)**. Strip 21.98 vs 20.80. docH +1 |
| after speech | max rect Δ ≤ 0.03. The rest is the claimed settle colour, plus boil-pose opacity swaps (the floor reads 12 in webkit) |

The lane's declared π reproduces exactly. The tab row is declared in the README and in the F-ERASE-1 ballot.

### E · Constraints

- **filterBudget.** Computed-`filter` element count over the whole document (`logs/filter-census.log`), at load and with the hint armed, tree = control in all four cells:
  - light: 25 = 25, chromium and webkit
  - dark: 27 = 27, chromium and webkit

  This isn't the budget's own definition, but the budget cannot have grown: the dist is byte-identical to pass 5's, where the critic read 8/8 and 9/9.
- **M16.** `check-copy-register` bare: exit 0 (0 dashes, 0 unadmitted, lexicon 25).
- **@property law.** `check-property-block`:
  - served, stamped `index-B5bclKNTuHnj.js` on :4246: GREEN, 0 (source 7, served 49)
  - `--self-test`: 0
  - it reds the `typography.css` duplicate (§A)
- **Undefined-token census** (the chair's cured copy): TIMING 0 and other 0, plus the one declared STALE row. Its self-test has every control RED as required. The exit is 1 on the STALE row alone, which is the declared form.
- **Battery, on the tree, each gate bare** (`logs/battery.log`). All exit 0:
  - `lint:theme-tokens`, `lint:motion`, `lint:sleep`, `lint:lanes`
  - `test:e2e:projects`, `check-pw-projects`
  - `npm run lint` (the scoped prettier)
  - `eslint .`
  - `vitest src/pencil` (9 files / 85)

  The control's exit codes are the lane's archive readings, all 0. I didn't re-run the control, and I didn't re-run the whole `affordances.spec.ts` (§1B ran its drop-clock row's code).
- **R6 and r0.** No colour minted. R3-g is still the pass-4 PROPOSED diff (MOVED, as reported). Nothing else moved.
- **W2.** No W2 file touched. The tab move is layout inheritance and it's declared.

## 2 · The frames (looked at both)

`f1` (390×844 coarse, 125,894 B) and `f2` (1280×800 fine, 66,933 B): chromium light plus one dark column, four rows HOLD/AGE/STEP/TINT, one payload.
- **Lawful as a pair.** Within each column only the arm moves, and both frames are under the cap.
- **But they aren't the section's question.** They're LEDGER's pass-5 builds, `74a2b5d9` + LEDGER only, with no ERASE settle.
  - On ERASE's tree a `record` settles to α 0.68 at eight beats (`MarginNote.vue:32`, `types.ts:10`). The frames sit 1.5 s past arrival, so on the merged tree HOLD's P1 cell would paint the quiet rung, not the full graphite shown.
  - HOLD vs TINT at rest may then collapse to one look. The owner would be choosing between pictures the fold won't ship.
- **Chromium only.** There's no WebKit panel.

## 3 · Open gaps (each closable, numbers attached)

1. **The clock is beaten on the animation axis, and CI can't see it.** `.margin-note{--motion-whisper:900ms}` and `animation-duration:900ms !important` hold the rub-out at 904.2/905.5 ms in chromium and 901/906 in webkit. Every CI-side gate stays 0: unit 12/12, registration, `lint:motion`, `check-property-block`, the census.
   - Close it: have `stopTheClock` also write `animation-duration` inline `!important` from `MOTION.rungs.whisper` (and `0s` under PRM).
   - Give the VTU row the same read.
   - Add both adversaries to the drop-clock row.
   - Or narrow the thesis to "no author TRANSITION rule" everywhere it's stated.
2. **The settled rung fails the glyph-text median at WebKit DPR 1 light (4.357 < 4.5).** Its fraction exceeds the control's at every DPR (+0.30/+0.37 at DPR 1). HOLD, the firing default, carries this settle, so the default loses to the control on the same statistic. The chair books the ink as T9-R6. Until the estate cures the light rung's ink, the default ships the debt.
3. **The §7 frames aren't the merged section.** Re-shoot HOLD/AGE/STEP/TINT on the §13+§7+§3 integrator's tree, where ERASE's settle is live, with a WebKit panel. Or state in the ballot that on the merged tree HOLD at rest paints α 0.68, and give the HOLD-vs-TINT Δ in numbers.
4. **F-ERASE-2 has one arm.** 612 px of pure `rgb(253,253,252)`, ink y 543.57 under the clip at 540.55. Arm 2 belongs to the §10 integrator in batch 6.
5. **The `2lh` seating is in page only.** The 6.4 px is reconciled: 2 × (24 − 20.8). It lands at the §7 fold.
6. **The four consumer-less rungs are still standing.** `leave`, `step`, `throw` and `rise` have 0 consumers, and the new registration row now REQUIRES their four registrations. That's gated substrate with no consumer. The `chromeLeaveMs` alias (pencilConfig:163, App.vue:639) is also still there. Both retire at the fold, per `fold/s13-s7-checklist.txt`.
7. **`MarginNote.vue:288` claims 5.17 "both engines" at DPR 1.** Under the §2.11 statistic WebKit DPR 1 reads 4.357. Correct the comment, or name its statistic.
8. **The registration row reads `index.css` only.** A second registration elsewhere (`typography.css`, `inherits: false`) passes the tree's CI. Only the fold's `check-property-block` reds it (C1 and C5). The fold must land that instrument in CI with the row.
9. **LEDGER's rows are not seen closed:** the undo gate, row 7's reserve, STEP on the wire, the berth. The G15 handoff is still ERASE's.
10. **User-origin and UA-origin `!important` are untested.** A page can't plant them. It stays a sentence.

## 4 · Checklist

- **Gates that can't fail:** none left from pass 5 (§1A).
- **The subject the gates don't read (new):** G5 gates the publisher's VALUE in TS, but the consumer's resolved duration can be retuned in CSS with every CI gate green (§1B, gap 1).
- **Unverified gestalt:** §7's frames are chromium only, on builds without the settle (gap 3).
- **The constraint it forgot:** painted AA, where the default arm loses to the control on the glyph-text statistic (gap 2; estate-booked).
- **Consumer-less substrate and legacy alias:** gap 6.
- **Spec-cites-itself (mild):** the e2e bound reads `MOTION.rungs.note` off the subject. It's backed by G5's literal map, which matches `MOT-VERB/pass5.diff:7005-7068` (verified).
- **Clear:**
  - M16 · filterBudget (tree = control)
  - π, declared and reproduced
  - the @property law, on this tree
  - the census
  - W2
  - R6
  - the generic default (no new idiom)
  - the rebuild is byte-identical

## 5 · Strengths (proven)

- All three pass-5 "cannot fail" gates are re-cut, and each pass-5 plant now reds its gate. My plants (no-`important`, the wrong longhand, `inherits: false`) red too.
- The whole-DOM π with its in-run floor reproduces to the hundredth on both engines. The W2 tab is declared at both landscape cells.
- The 6.4 px is reconciled by arithmetic that holds: `lh` resolves against the block's 24 px, not the voice's 20.8.
- The fold rehearsal found a merge conflict that a textual merge doesn't flag: `@keyframes ink-rub-out`, with opposite clip directions. The lane also retracted its own false curve claim (max Δ 0.032).

## 6 · Cross-pollination

- **Every `@before-leave` clock in the estate:** fence the ANIMATION too. Write the rung's resolved value inline `!important`, not only `transition: none`. Test it against an ancestor custom-property override, since the @property law's `inherits: true` makes that override a live attack.
- **Every ballot framed on one lane's bank:** re-shoot it on the integrator's merged tree when another lane's mechanism changes the rest pose.
- **ACC-/PAL- lanes:** the settled-rung numbers are evidence for T9-R6: the α 0.68 graphite is flat 5.172, and at WebKit DPR 1 its median reads 4.357.

## Incidents (mine)

- My battery script built log names from `$1-$2`. Four invocations with a slash in the path failed on the redirect with exit 1: `check-copy-register`, `check-pw-projects`, and `check-property-block` twice. I re-ran all four bare and each exits 0; `logs/battery.log` records both runs.
- The first adversary run failed on a spliced helper that was missing its closing brace (a syntax error, no test ran). I fixed it and re-ran.
- I moved the raw π JSON to `<scratchpad>/trash-erasecrit6-1/`. No `rm`, no git in the control tree.
