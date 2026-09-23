# NOTE-ERASE · pass-6 prototype: the three blind gates re-cut, the fold rehearsed, the question framed

Worktree `.claude/worktrees/wf_f72f3b5a-83a-47`, advanced IN PLACE on the banked pass-5 diff (base and π control
`74a2b5d9`). Nothing committed. Every browser row deals ONE codec payload, `?board=` +
`ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5`
(the classic easy 9×9, 30 givens), and every page reads the given-set back through BOTH the input values
and the aria-label corpus (`given clue N`) before it reads anything. The one exception is the 16×16 π row,
which uses a shifted-pattern 16×16 with 128 givens (minted in `probe/p6-pi.probe.ts`, count asserted).

Dist: the final tree builds **`index-B5bclKNTuHnj.js`, `diff -r` byte-identical** to pass 5's dist and to
the tree's own `dist/`. It was rebuilt AFTER the last source edit (a `.ts` comment). This pass's edits are
tests, a script, an e2e spec and one `.ts` comment, so none of them reaches the bundle. Control: the shared
`w7-control` dist `index-CubiZsMVSwTc.js`, verified by hash, never git-touched. Servers (killed by
recorded PID; band re-scanned, 4238/4239 held by other lanes): tree dist :4248, control :4249, the
whisper↔dusk SWAP dist `index-BnqayoxIayCI.js` :4246, dev :4247 (the `?wire=local` row), LEDGER's four
arm dists one at a time on :4245.

## The replay route

**None, in place.** At open, `git diff --stat` read 14 files +852/−78 plus 2 untracked tests. That is exactly
pass-5 README's list, so the bank `pass5/prototype/NOTE-ERASE/pass5.diff` stands. At return the tree reads
**15 files +951/−80 plus the same 2 untracked tests**. The new tracked file is
`scripts/check-theme-tokens.mjs`. The pass-6 delta is in:
- `marginNote.motion.test.ts` (G5 re-cut, G16 VTU unit)
- `check-theme-tokens.mjs` (the registration row)
- `e2e/affordances.spec.ts` (+3: the import and the tightened bound)
- `pencilConfig.ts` (one stale comment: "six blocks" → "one block of seven")

## Numbers first

### Row 1 · G5 checks the VALUE map; the e2e row is tightened

`expect({...MOTION.rungs}).toEqual({whisper:150, leave:200, note:250, dusk:350, step:440, throw:520, rise:520})`.
That is §13's map as banked at `pass5/prototype/MOT-VERB/pass5.diff:7005-7068` (verified).

Break-tests ran in one batch and were restored by sha1 (`ec263af6… d616d279… 82a3be4b…` before = after).
Logs: `readings/gates-break.log`, re-run on the final files as `readings/gates-break-final.log`.

| plant | G5 (pass 5: all but the mint GREEN) |
|---|---|
| as built | GREEN, 12/12 |
| SWAP whisper↔dusk (150↔350) | **RED** |
| rise 520→600 (T9-B11's other arm) | **RED** |
| step 440→1 | **RED** |
| whisper 150→125 | **RED** |
| mint `erase: 125` | **RED** |

The e2e drop-clock row's `< 500` becomes **`< MOTION.rungs.note`** (250), because the erase is shorter than
the arrival by design. On the SWAP dist (`BnqayoxI…`, pencilConfig restored by sha1 after the build) the
row is **RED, exit 1, both engines: 364.9 ms (chromium) / 368 ms (webkit) against < 250**. On the tree the
row alone passes (exit 0). `readings/e2e-swap-bornred.log`.

### Row 2 · G16's CI half is behaviour (VTU, Transition unstubbed)

The unit mounts `MarginNote` with `stubs: {transition: false}`, replaces the line, and reads the LEAVING
span. Before the leave its inline `transition` is `""`. After the replacement it must read
`none|important`.

| tree | G16 VTU | G16 text row |
|---|---|---|
| as built | GREEN | GREEN |
| DEAD HOOK (`if (el) return;` as `stopTheClock`'s first line, every string intact) | **RED** | still GREEN (11/12 in the same run) |

This is now the hook's only CI gate under O-12. The drop-clock e2e row remains the local browser proof,
and it reds on the dead hook (pass-5 critic E2).

### Row 3 · the static registration gated: `check-theme-tokens`' "static and complete" row, landed

`lint:theme-tokens` runs in CI (`ci.yml:988`). It now reads `MOTION.rungs`' keys from `pencilConfig.ts`
and asserts, for each rung, exactly one `@property --motion-<rung>` at brace depth 0 in `index.css`, with
`syntax "<time>"`, `inherits: true` and `initial-value: 0ms`. It also asserts that no other `--motion-*`
is registered. The self-test carries the two named negatives, keyed on the rule's SHAPE (every
`@property --motion-*` block wherever it sits): delete `--motion-whisper`'s block, and nest every rung in
`:root {}`.

| file plant (bare `node scripts/check-theme-tokens.mjs`) | exit | unit file |
|---|---|---|
| clean | 0 | 12/12 |
| delete `@property --motion-whisper` | **1** (`registered 0×`) | 12/12 (the unit cannot see it: vitest serves `*.css?raw` as `""`, measured 0 bytes) |
| nest all seven in `:root {}` | **1** (7 × `brace depth 1`) | 12/12 |
| `inherits: false` on whisper | **1** | — |
| a stray `--motion-erase` registration | **1** | — |
| self-test on this tree / on the §13 rehearsal tree | 0 / 0 (every plant RED) | — |

The chair's `check-property-block.mjs` (the fold gate) reads the tree GREEN: source 7, served 49 in
`index-WpYtDViEpjUl.css`, stamped `index-B5bclKNTuHnj.js` against :4248. Its self-test on the tree exits 0.
It has no COMPLETENESS clause: a deleted rung block is invisible to it. The row above is that clause.

### Row 4 · whole-DOM π with its in-run floor (`readings/pi-classified.txt`; raw JSON summarised, kept in scratch)

- **Coverage.** Every element under `#app`, keyed by semantic ancestry (nearest landmark + tag + stable
  classes + ordinal): 1,092 elements at 1280, 1,052 at 390, 1,051 in landscape, 2,185 on the 16×16. Each
  element is read for rect and 12 paint properties.
- **Arms and floor.** Tree vs control, with a second control arm as the floor. The floor is 1 element
  empty (the logo clip), and 0–12 fresh/settled (boil-pose swaps).
- **Pointer.** `(pointer: coarse)` is witnessed true on both arms at every coarse cell.

| cell (both engines agree) | at rest (empty) | after speech (fresh / settled) |
|---|---|---|
| 1280×800 fine | strip +2.83 (23.63 vs 20.80), `min-height`. Nothing else | strip +0.02; the claimed settle colour |
| 390×844 coarse | **0** (both 20.80) | the claimed settle colour only |
| 844×390 coarse | **21 elements**: strip / column / board-shell / app-layout +1.29, **`button.drawer-tab` y 167.23 vs 166.59 (+0.64)** with its tongue, outline and text, `p.board-voice` +1.29, docH +1 | tab 167.23 vs 167.23 (chromium) / 167.22 (webkit): the fork, gone on first speech. WebKit keeps 20 rects at ≤0.03 px (HEAD's line box 22.06) |
| 812×375 coarse | **21**: +1.18/1.19, **tab 159.69 vs 159.09 (+0.60)**, voice +1.19, docH +1 | 20 rects at ≤0.02 px (HEAD's line 21.97 vs the reserve 21.986), tab 159.69 vs 159.67 |
| **812×375 coarse, 16×16 copy** ("the answer is 2") | the same 21, the same +0.60 tab, docH +1 | the same ≤0.02 residue; the line fits one row |

**The tab move is DECLARED** (charter 4, registry §6.3). W2's drawer tab sits +0.60 px (812×375) and +0.64
px (844×390) lower at rest in this tree, both engines, against a floor of 1 element that does not include
the tab. HEAD moves it by the same amount on its first speech. It is F-ERASE-1's fork expressed on W2's
control, not a defect. The chair reads it as ONE π row across four trees at the fold.

### Row 6 · the settled rung against the GLYPH-TEXT statistic (registry §2.11), DPR 1/2/3

Method (`logs/aa-glyph-*.json`, 1280×800 fine):
- **Photographs.** The ink twice, then the same box with the ink `transparent !important` twice. A
  pixel that moves between the pair is dropped (noise = 0 in every arm).
- **Coverage.** A pixel's change over the change a fully inked pixel would make on its own ground (the
  computed colour composited over it).
- **The gate.** Core median over coverage ≥ 0.5 must be ≥ 4.5. The fraction of that population under
  4.5 is stated beside the control's.

| arm · theme | chromium median · fraction (DPR 1 / 2 / 3) | webkit median · fraction (DPR 1 / 2 / 3) |
|---|---|---|
| HEAD line · light | 14.52 · 0.154 / 0.070 / 0.051 | 11.42 · 0.148 / 14.52 · 0.080 / 14.52 · 0.051 |
| **settled · light** | **5.17** · **0.458 / 0.221 / 0.150** | **4.36 (RED) · 0.515** / 5.17 · 0.253 / 5.17 · 0.166 |
| HEAD line · dark | 11.66 · 0.044 / 12.25 · 0.021 / 12.25 · 0.014 | 11.41 · 0.044 / 12.25 · 0.033 / 12.25 · 0.022 |
| **settled · dark** | 5.86 · 0.272 / 6.07 · 0.145 / 6.07 · 0.113 | 5.69 · 0.315 / 6.13 · 0.176 / 6.13 · 0.115 |

- **The gate fails at one cell.** The settled rung FAILS the glyph-text median at **WebKit DPR 1
  light: 4.357**. That is WebKit's own DPR-1 raster; its fresh line also reads 11.42 against
  chromium's 14.52. Every other cell clears it.
- **The fraction exceeds the control's at every DPR.** It exceeds it by +0.30/+0.37 at DPR 1,
  +0.15/+0.17 at DPR 2 and +0.10/+0.12 at DPR 3 (light, chromium/webkit).
- **The minimum.** 2.04–2.06 light and 2.38–2.41 dark, the same at every DPR, taken over the doubled
  photograph.
- **Ownership.** The chair booked this row as T9-R6, one estate row ("ERASE's settled rung" is named in
  it). The lane owns no floor on it, and I did not move the rung's ink.

### Row 5 · F-ERASE-2 re-read (one arm)

Parked by `g` at 1280, the ink rect is at y 543.57 (chromium) / 543.28 (webkit), under the
`.live-face-slot` clip at 540.55 / 540.25. `elementFromPoint` returns `div.game-card-paper`. The ink box's
bytes are **612 px, all `rgb(253,253,252)`**, on both engines. Arm 2 (the strip inside the fold's clip)
belongs to the §10 integrator (batch 6) and is unbuilt at this return, so there is still one arm and no pair.

### Row 8 · the `2lh` seating, built IN PAGE on the tree dist (an injected rule; not in source)

Arm A = the shipped one-line reserve, B = two lines of the same derivation, C = `min-height: 2lh`
(ACC-SIX's form). `logs/seat-*.json`; both engines agree to 0.3 px.

| cell | strip A / B / C | the block's `1lh` / the voice's line | column split (board y, controls y) B · C | docH A / B / C |
|---|---|---|---|---|
| 390×844 coarse | 20.80 / 41.59 / 48.00 | **24.00 / 20.80** | −10.40 / +10.39 · −13.60 / +13.59 | 844 / 844 / 844 |
| 393×699 coarse | 20.80 / 41.59 / 48.00 | 24.00 / 20.80 | −10.40 / +10.39 · **−13.60 / +13.59** | 699 / 699 / 699 |
| 1280×800 fine | 23.63 / 47.25 / 48.00 | 24.00 / 23.63 | 0 · 0 | **800 / 818 / 819** |
| 844×390 coarse | 22.09 / 44.19 / 48.00 | 24.00 / 22.10 | tab +11.05 · +12.96 | 410 / 433 / 436 |
| 812×375 coarse | 21.98 / 43.97 / 48.00 | 24.00 / 21.99 | tab +10.98 · +13.00 | 395 / 417 / 421 |

**THE 6.4 px, RECONCILED.** ACC-SIX's 27.2 = 2lh (48) − 20.8, and the derived second line is +20.79. `lh`
resolves against the BLOCK's own line-height, 24 px (16 px × 1.5 inherited from `body`), not against the
voice's line (`--type-body` × `--type-leading-caption` = 20.8 at 390). The gap is 2 × (24 − 20.8) = 6.4 px.

SIX's ±13.6 split reproduces exactly (C at 393×699). The one seating is the derived form, or `2lh` after
setting the block's `line-height` to the voice's line. Either way, a second IN-FLOW line costs +18/+19 px
of document height at the desk and +22/+23 px in landscape. That backs LEDGER's refusal of an in-flow
reserve. The seating lands ONCE at the §7 fold (chair §1.4); it is not landed here.

### Row 9 · §7's rest-state question, FRAMED (LEDGER's builds, one payload, four values)

LEDGER's pass-5 bank was applied to a scratch archive of `74a2b5d9`, never to LEDGER's tree. This is the
shipping `min-height: inherit` form. It was built four times with only `LEDGER_FULFILLED` flipped:

| arm | build |
|---|---|
| HOLD | `index-Cder9HygqQ5l.js` |
| AGE | `index-DTnv7bkPq3ie.js` |
| STEP | `index-DQqkONEsGFmQ.js` |
| TINT | `index-BXE037scA9iq.js` |

HOLD and TINT are the ids LEDGER's critic cited, so the builds reproduce. Each arm was served on :4245,
checked by hash and driven by LEDGER's own keyboard driver (copied). Panels are chromium, at rest 1.5 s
past the settle. Columns: P1 ask·answer · P2 +next write · P4 ask·answer ×2 · P1 dark.
`logs/arms-*-chromium.json` carries each panel's lines.

- `f1-s7-four-arms-P1-P2-P4-dark-chromium-light-390x844-coarse.png` (125,894 B; DPR 3 at 0.5; the dark column is dark)
- `f2-s7-four-arms-P1-P2-P4-dark-chromium-light-1280x800-fine.png` (66,933 B; DPR 2 at 0.5)

I looked at both. Within each column only the arm moves:
- STEP = HOLD at P1 and = AGE at P2.
- TINT keeps HOLD's size and place at the quiet pressure.
- AGE leaves an empty line one with the record as the quiet line two.
- At P4 HOLD/STEP/TINT show two lines and AGE one.

**The uncontrolled variable runs across columns only:** the next write moves the selection wash. Both
frames were shot on the PASS-5 bank, so TINT's one-rung re-darkening (a motion defect, keyframe 0) cannot
appear in a rest frame. The P4 and dark columns are the ones registry §2.10 asked for. LEDGER's batch-2
re-shoot on its fixed tree supersedes these frames if it lands.

**THE QUESTION, with the KIND rule.** How a line ages is decided by what it IS (record, state, grade,
reply), never by its tone or a timer. So after a record comes true, what does line one hold?
- **HOLD**: the record keeps its line.
- **AGE**: fulfilment empties it; it leaves as the verb and survives as line two.
- **STEP**: hold until the next write anywhere, then age.
- **TINT**: hold the line at the quiet pressure.

**My read, as a read and not a ruling: HOLD.** On this tree a `record` is one of the two kinds that
settle, so a held record already steps down to the quiet rung eight beats in. That is TINT's spent ink
on a clock instead of on a write. The **§7 merge watch**: if HOLD is the answer and arm 2 lands, the fold
takes ONE clock home, `MOTION.rungs.leave`, and ONE ledger (LEDGER's line two). ERASE's verbs carry the
exit; LEDGER's ledger carries the memory.

### Row 10 · the §13 fold rehearsed on `MarginNote.vue` (`fold/`)

`git archive 74a2b5d9` + `pass5/prototype/MOT-VERB/pass5.diff` (clean), then `git merge-file` of this tree's
SFC against it. **2 conflict blocks**: the write-in line, and `.margin-note-meta`'s ease.

They are resolved toward one line (`fold/s13-MarginNote.resolved.diff`, against §13's file):
- `.note-enter-active` carries the arrival, on `var(--verb-writeIn-ease)` (the meta takes the same).
- The rub-out is ONE animation,
  `ink-rub-out var(--motion-whisper) var(--verb-rubOut-ease) backwards`. At zero delay `backwards`
  retains nothing, and `.note-leave-to` is the rest pose.

**A THIRD conflict that the textual merge is SILENT on:** both trees define `@keyframes ink-rub-out`.
- §13's clips from the START (`inset(0 0 0 100%)`, opacity in one keyframe).
- ERASE's clips from the END (`inset(0 100% 0 0)`, the write-in run backwards) with a twin
  `ink-rub-out-fade`.
- Resolved to ERASE's direction in §13's single-keyframe shape, with `-fade` deleted.

**A pass-5 claim retracted:** `--ease-accelIn` (0.55, 0.055, 0.675, 0.19) is NOT byte-identical to
`--verb-rubOut-ease` (0.32, 0, 0.67, 0). The maximum progress difference is 0.032, at t = 0.86.

On the rehearsal tree:

| check | result |
|---|---|
| `marginNote.motion.test.ts` | **12/12** |
| `check-theme-tokens` with this row | exit 0, both plants RED |
| `check-property-block` | GREEN, 8 registrations / 8 names |

### Row 7 · the fold checklist (`fold/s13-s7-checklist.txt`, for the §13+§7+§3 integrator)

Ten rows:
- delete this graft's `MOTION.rungs` and its seven `@property` blocks
- **four consumer-less rungs** (leave, step, throw, rise: 0 code consumers; whisper 2, note 2, dusk 1)
- **`chromeLeaveMs`** (pencilConfig:163; one consumer, App.vue:639) re-pointed to `MOTION.rungs.leave`
  and deleted
- one publisher
- the two conflicts plus the silent keyframe conflict
- the curve delta
- the gates that survive
- G15's handoff

### Row 11 · F-ERASE-1 goes to the owner as NUMBERS ONLY, said so

On this tree the fork's only painted consequence is:
- **desk and phone:** nothing moves. The strip is +2.83 px of empty paper at 1280 with nothing below it;
  at 390 it is 0.
- **landscape:** W2's tab sits 0.60/0.64 px lower at rest, and docH is +1.

A frame of either is sub-perceptual, so no crop is banked. Pass-5's `c2-ferase1-strip-pair-…` is retired
by name.

### Row 12 · re-run once (both engines)

| row | chromium | webkit |
|---|---|---|
| `becauseMember`, peer room (dev, `?wire=local`, pinned) | hint "8 goes nowhere else in this column", named cell 5, because `[5,14,23,…,77]`; peer writes member **23** (≠ named): delivered, note after `""` | identical |
| the solve act (EASY) | armed "only 5 fits here" rubbed out at 157 ms (2.8 ms PRM), then "solved it!" gold, `age fresh` | 152 ms (16 ms PRM) |
| PRM leave | `animation-duration 0s`, node gone **11.1 ms** | **8 ms** |
| the repeat's hole | **126.1 ms** (PRM 127.9) | **126** (128) |
| the board-voice hole (repeated deal) | tree `X,'',X` **123.7 ms**; control `X` (no re-announce) | **116 ms**; control `X` |

### Row 13 · the clock's bound, and the hook's price, measured once

**The bound is the AUTHOR origin.** User-origin and UA-origin `!important` are untested, and a page cannot
plant them. That is a sentence, not a gate.

**The price** (`probe/p6-price.probe.ts`, `logs/price-*.json`): the leave is started ~100 ms into the
350 ms dusk tween. Every frame's computed colour is sampled.

| arm | α on the frame before → leave frame 1 → frame 2 | leave → node gone |
|---|---|---|
| hook, chromium | 0.908 → **0.680** → 0.680 | 154.1 ms |
| hook, webkit | 0.912 → **0.680** → 0.680 | 153 ms |
| hook BLOCKED at source, chromium | 0.920 → 0.902 → 0.882 (still tweening) | 256.5 ms |
| hook BLOCKED at source, webkit | 0.914 → 0.890 → 0.865 (still tweening) | 255 ms |

The price is one step of **Δα −0.23 on the rub-out's first frame**, both engines. At that frame the clip
has moved 0.5 % and the opacity reads 0.995. The first cut's control (strip in a MutationObserver) could
not separate the arms; see incident 3.

## Constraints

- **M16:** `check-copy-register` bare exit 0. No product string was added.
- **filterBudget:** the dist is byte-identical to pass 5's `B5bcl…`, where the critic read tree = control
  (light 8/8, dark 9/9, both engines). The census was not re-run because the bytes did not move. The dark
  `crayon-heart` is inherited: the chair's fold pick, ACC-SIX's born-RED.
- **@property law:** one block of seven at file scope, `inherits: true`. `check-property-block` is GREEN,
  and the completeness row is new.
- **W2:** no W2 file touched. The tab's sub-pixel move is declared (row 4).
- **R6:** no colour minted.

## Units and types

vitest, chunked:

| chunk | files | tests |
|---|---|---|
| composables | 3 | 16 |
| pencil | 9 | 85 (was 84; +G16 VTU) |
| games | 58 | 749 |

`vue-tsc --noEmit` 0 (after incident 1). `typecheck:e2e` 0.

## The pre-return battery (each gate BARE; the control is a `git archive 74a2b5d9` copy in scratch)

The whole spec file ran with an exact-path filter (`/(^|\/)affordances\.spec\.ts$/`).

| gate | tree | control |
|---|---|---|
| `e2e/affordances.spec.ts` whole, both engines | **0** (26/26) | **0** (own spec, 24/24) |
| `lint:lanes` · `lint:theme-tokens` · `lint:sleep` | 0 · 0 · 0 | 0 · 0 · 0 |
| `test:e2e:projects` · `check-pw-projects.mjs` | 0 · 0 | 0 · 0 |
| `eslint .` | 0 | 0 |
| `npm run lint` (the scoped prettier: `src/ scripts/ ../../scripts/ ../relay/`) | **1 → 0** (incident 1) | 0 |
| `lint:copy` · `check-copy-register` bare | 0 · 0 | 0 · 0 |
| `lint:motion` · `lint:ink` · `check-ink-pressure` bare | 0 · 0 · 0 | 0 · 0 · 0 |
| `lint:live-regions` · `lint:theme-selectors` · `lint:knip` | 0 · 0 · 0 | 0 · 0 · 0 |
| `vue-tsc --noEmit` · `typecheck:e2e` | **2 → 0** (incident 1) · 0 | 0 · 0 |
| `check-property-block` (chair's instrument) | 0 (source + served, stamped) | 0 (source) |

Nothing inherited is red. `readings/battery-sitting1.log` has the first sitting and
`readings/battery-sitting2.log` the final.

## Gaps, every one

1. **The settled rung FAILS the glyph-text median at WebKit DPR 1 light (4.357 < 4.5).** Its fraction under
   4.5 exceeds the control's by +0.10 to +0.37 at every DPR. This is T9-R6, booked by the chair; I did not
   move the ink. If the estate cures the rung's light ink, this row clears. If not, the settle carries a
   light-theme AA debt on WebKit's DPR-1 raster.
2. **F-ERASE-2 is uncured and has one arm.** §10's integrator builds arm 2 in batch 6, after this return.
   The ballot has no pair until ERASE reads that arm.
3. **The `2lh` seating is built in page, not in source.** The chair books it to the §7 fold. The numbers
   above are the seating's price, not its landing.
4. **§7's frames are on LEDGER's PASS-5 bank.** TINT's keyframe-0 flash is a motion defect that a rest frame
   cannot show. LEDGER's batch-2 re-shoot is the ballot's source if it lands. Chromium light only, plus one
   dark column; no webkit panel.
5. **The hook is a runtime fence bounded by the author origin.** A later lane that replaces the
   `<Transition>` or drops `@before-leave` now reds the VTU unit in CI, but the fence is still
   origin-bounded (user/UA `!important` untested).
6. **G5's map is a second copy of §13's.** It moves in §13's fold commit by design, and a §13 retune reds it
   until then.
7. **The registration row reads `MOTION.rungs` by regex** over `pencilConfig.ts` (comment-stripped, first
   `rungs: {` block). A rung written in another shape (a spread, a computed key) would escape it. It was
   tested on this tree and on the §13 rehearsal tree only.
8. **The four consumer-less rungs and the `chromeLeaveMs` alias still stand on this tree.** They are
   written into the fold checklist, and they retire at the fold, not here.
9. **The landscape tab is ONE π row across four trees** (chair). This tree's +0.60/+0.64 is declared; the
   other trees' are not this lane's.
10. **The first price cut was unable to separate its arms** (incident 3). The re-cut is the reading.
11. **The 16×16 row reads one hint string** ("the answer is 2"). "Landscape safe" is claimed for that copy,
    not for every 16×16 string.
12. **LEDGER's rows are not seen closed** (the undo gate, row 7's reserve gate, ARM C-step on the wire, the
    berth through the tab). They are batch 2, after this lane. G15's handoff stays mine.

## Ballot rows for the owner

- **F-ERASE-1 · the strip's resting height**, five cells, NUMBERS ONLY (no frame can show it).
  - **ARM 1 (this diff):** the reserve is the line, and nothing moves when the voice speaks. At rest it is
    +2.83 px of empty strip at 1280, 0 at 390, and at 844×390 / 812×375 it is +1.29/+1.18 px of strip plus
    **W2's tab +0.64/+0.60 px** and docH +1.
  - **ARM 2 (HEAD):** the same amounts arrive as a jump on first speech.
  - The 16×16 copy at 812×375 reads the same.
- **F-ERASE-2 · the parked record paints nothing.** One arm: 612 px of paper at 1280, both engines. Arm 2
  is §10's integrator's.
- **§7's rest state, four values** (HOLD default / AGE / STEP / TINT), frames `f1-…` and `f2-…`, one
  payload, one variable per column. The KIND rule states the question, and my read is HOLD.

## Frames (2, both replacements, author looked at both)

| file | engine · theme · viewport · pointer | retires (`pass5/SWEEP.md`) |
|---|---|---|
| `f1-s7-four-arms-P1-P2-P4-dark-chromium-light-390x844-coarse.png` (125,894 B) | chromium · light (+ dark column) · 390×844 · coarse (hasTouch + isMobile, witnessed `coarse: true`) · DPR 3 | `prototype/NOTE-LEDGER/B-LEDGER-390x844-light-coarse-four-arms-P1-P2-chromium.png` and `prototype/NOTE-ERASE/c1-midverb-50pct-dark-390x844-coarse-chromium.png` |
| `f2-s7-four-arms-P1-P2-P4-dark-chromium-light-1280x800-fine.png` (66,933 B) | chromium · light (+ dark column) · 1280×800 · fine · DPR 2 | `prototype/NOTE-LEDGER/B-LEDGER-1280x800-light-fine-four-arms-P1-P2-chromium.png` and `prototype/NOTE-ERASE/c2-ferase1-strip-pair-light-1280x800-fine-chromium.png` |

Total 192,827 B against the four retired (112,495 B).

## r0 rows

**R3-g: MOVED**, still the pass-4 PROPOSED diff (`pass4/prototype/NOTE-ERASE/instruments/r3g-age.diff`).
The rest are unmoved:
- the R6 hue census (no colour minted)
- L1 (the dist is byte-identical to pass 5's)
- every other r0 row

## Incidents, self-declared

1. **`vue-tsc` exit 2 and prettier exit 1 on the first battery sitting.** G16's
   `w.element.querySelector<HTMLElement>` is an untyped call with a type argument, and two files were
   unformatted. Both were fixed (a cast; the tree's own prettier, which leaves `e2e/` alone as ignored),
   and every gate was re-run: all 0.
2. **The registration row's self-test nest plant was keyed on this file's LAYOUT** (a slice before
   `@layer base`). On the §13 rehearsal tree it reported "FAILED: the row did not catch it" (exit 2). It
   was re-keyed on the rule's SHAPE (every `@property --motion-*` block) and is RED on both trees. This is
   the P5 law, "key on the rule's SHAPE", biting my own first cut.
3. **The first price cut's control was void.** It stripped the hook's inline write in a MutationObserver,
   but the write had already cancelled the running dusk tween, so both arms snapped to α 0.68. The re-cut
   blocks the write at source (an init-script `setProperty` shim, the pass-5 critic's form). The first
   cut's JSON is kept in scratch, not banked. `p6-price`'s `settledEnd` field is also void (an unscoped
   probe span read `rgb(38,38,38)`); the settled end is α 0.68 from the π rows.
4. **The first battery's whole-spec rows exited 1 on config load**, not on a test: a `.mts` Playwright
   config in the scratchpad could not resolve `@playwright/test`. The configs were placed in
   `<tree>/.erase6/` and `<control>/.erase6/`, run, then moved to `<scratchpad>/trash-erase6-3/`. The E1
   run earlier matched `mobile-affordances.spec.ts` too (46 rows, pass 5's incident 4 again). The
   exact-path run is the one in the table.
5. **A pass-5 README claim was false:** "`--ease-accelIn` … byte-identical curve `0.32,0,0.67,0`". The
   curves differ (row 10). I found it while rehearsing the fold.
6. **A dev cacheDir landed at the worktree root** (`.vite-cache-note-erase-p6-dev/`, untracked). It was
   moved to `<scratchpad>/trash-erase6-4/` after the dev server was killed.
7. **Two listeners in the band at open were not mine** (4238, 4239) and were left untouched. Mine were
   4245–4249, all killed by recorded PID (npx wrapper + listener).

## Files

Product (the work tree), this pass:
- `src/pencil/chrome/marginNote.motion.test.ts` (untracked; G5 map, G16 VTU)
- `scripts/check-theme-tokens.mjs` (registration row + plants)
- `e2e/affordances.spec.ts` (bound on `MOTION.rungs.note`)
- `src/pencil/config/pencilConfig.ts` (one comment)

Evidence:
- `readings/` (gates, battery, π classified, the swap born-RED)
- `logs/` (per-row readings, ~128 KB)
- `probe/` (the pass-6 probes and configs)
- `instruments/` (scripts, vite configs, the composite)
- `fold/` (the resolved diff, the checklist, the rehearsal logs)
