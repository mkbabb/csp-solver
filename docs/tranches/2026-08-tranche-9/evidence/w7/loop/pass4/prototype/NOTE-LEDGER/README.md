# NOTE-LEDGER — pass-4 PROTOTYPE

It RUNS. Work tree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46`,
branch `master` at `74a2b5d9`, uncommitted, **10 files changed + 1 new (+1325 −48)** — pass 3's
diff ADVANCED IN PLACE, never replayed. Prototype dev on **127.0.0.1:4249**, prototype BUILT DIST
on **:4247** (`index-CzJXFPhXEQqA.js`), the `74a2b5d9` HEAD control on **:4248**
(`.claude/worktrees/w7-control`, verified by its own asset hash `index-CubiZsMVSwTc.js`, never by
a 200). chromium + webkit throughout. All three servers killed by recorded PID before this file
was written.

## THE ONE THING THIS PASS DECIDED

**The two-line column now exists at rest, and it is one deleted rule that puts it there.**

A fulfilled record no longer ages at the moment of proof. `LEDGER_FULFILLED_AGES`
(`GameBoard.vue:773`) is the fork's one token — `false` = **HOLD** (default), `true` = **AGE**
(pass 3's arm) — and both arms build, are served and are framed. The ledger's own ruling, applied
to itself: a record ages when a SENTENCE displaces it, not when the board makes it true.

| the canonical loop, real keystrokes, `{one, two}` at rest | chromium | webkit |
|---|---|---|
| round 1 (ask → write the digit) | `{"only 3 fits here", ""}` | `{"5 goes nowhere else in this row", ""}` |
| round 2 | `{"only 5 fits here", "only 3 fits here"}` | `{"only 2 fits here", "5 goes nowhere else…"}` |
| round 3 | `{"only 9 fits here", "only 5 fits here"}` | `{"only 1 fits here", "only 2 fits here"}` |
| `twoLineAtRest` | `[false, true, true]` | `[false, true, true]` |

Round 1 is `false` because nothing has been displaced yet — one question asked, one line used.
From round 2 the column is two deep and STAYS two deep. Pass 3's reading on the same loop was
`[false, false, false]`, three quiet captions under an empty gap. Frames **F2-hold** and
**F2-age** are the same pose in the two arms; the owner disposes (U-10).

## NUMBERS, FIRST

### π — the surfaces this wave does not claim, on a PINNED deal

Nine chrome keys (`[role=grid]` · `.board-margin` · `.margin-note` · `#fold-tools` ·
`.app-layout` · `#controls-drawer` · `.masthead` · `.board-card` · `.play-controls`) × tag name ×
x/y/w/h × **fourteen computed PAINT properties** (display, position, font-family/size,
line-height, letter-spacing, color, background-color, opacity, filter, transform, z-index,
overflow-x/y), prototype `:4249` vs control `:4248`, at 390×844 and 1280×800, light and dark:

| engine | rigs × themes | **deltas** | scrollHeight proto/ctrl | computed filters | `url()` filters |
|---|---|---|---|---|---|
| chromium | 4 | **0** | 844/844 · 800/800 | 25/25 light · 27/27 dark | 24/24 |
| webkit | 4 | **0** | 844/844 · 800/800 | 25/25 light · 27/27 dark | 24/24 |

The deal is PINNED, and it satisfies the chair's addendum of 2026-09-19 (`?board=` is a codec
payload, not a name): the blob is minted by **the product's own share act on the CONTROL**
(`writeShareUrl` → `location.search`), so it is a real encoded payload — 112 chars,
`ATMuMjA2MzAwMTk3MTMwNjc5MDA4NzA5MDI0…`, the leading `A` being `CODEC_VERSION` 1 — and both arms
load THAT board. `boardPinned` is `true` on all eight rows (`logs/pi.json`). Registry §2.13's
confound is closed; pass 3 could only bank the whole-page sweep with a caveat. One board is
minted per ENGINE, so chromium's four rows share one board and webkit's four share another —
every proto-vs-control comparison is same-board, which is the comparison that carries the claim.

### filterBudget, on the BUILT DIST

`playwright-throttle.config.ts --project=filter-census-chromium --project=filter-census-webkit`
against `:4247`: **12 passed**, including G3.1 *live-filter census equals `filterBudget.ts`
exactly, area and all* and G3.3 *the census holds below 1024*, both engines. It does not grow.

### AA, from painted bytes (and the parse that lied once — see INCIDENTS)

α-0.68 ink composited on the real solid backdrop, then read against that backdrop:

| | light (`#fbfaf9`) | dark (`#110f0e`) | the negative control (same ink at α 1.0) |
|---|---|---|---|
| line one | **14.517** | **12.254** | 14.517 / 12.254 (α is already 1) |
| line two | **5.184** | **6.114** | 14.470 / 12.261 — the compositor IS being exercised |

Both themes clear 4.5. Identical to the pass-3 critic's independently derived 5.18 / 6.11.

### The push — the 0×0 rect is GONE, and by construction

`Element.prototype.animate` hooked before any script runs (a `getAnimations()` sample races a
hint off a worker), reading **line ONE's rect at the instant the FLIP is called** — which is the
element the critique's §2.3 was about, and which pass 3 never recorded:

| path | pushes fired | line one's rect at the call | keyframe 0 |
|---|---|---|---|
| **FULFILMENT** | **0** / **0** (chr/wk) | — | — |
| DISPLACEMENT | 1 / 1 | `w 93.48–187.53 · h 20.797 · top 594.13 · bottom 614.92` | `translate(0px, -15.390625px) scale(1.1428571428571428)` · `{duration: 250, fill: "backwards"}` |

`h 20.797` is line one's own settled line box, inked, on both engines. The `-15.390625` is line
two's line box exactly — one line box down, which is the spec's sentence. `scale` 16/14 = 1.1429,
read off the two elements. Under HOLD the fulfilment path fires **no push at all**, so the
`translate(0, −34.17) scale(1.3137)` off a 0×0 box the critic measured has no producer left. It
is still live on the AGE arm, and that is one of the two things the fork costs.

### L13's born-RED, on the SERVED BUILT DIST (pass 3 owed this)

| arm | `--motion-note` | `--motion-whisper` | the leaving node's `animation-name` / `-duration` |
|---|---|---|---|
| shipped | `0.25s` | `0.15s` | `ink-rub-out, ink-rub-out-fade` / `0.15s, 0.15s` |
| **publisher deleted** (`style[data-motion-rungs]` removed, same bytes) | `""` | `""` | **absent** |

Both engines. The row reds. **But it reds for the wrong reason, and that is a finding** — see
gap 1.

### The desk pair, photographed WITH its subject, and the run-on priced

Crop **C4** held no margin text at all. F3 does. At 1280×800, fine pointer, both engines: the
pair sits on ONE row, line one **18.176 px** full graphite, line two **14.048 px** at α 0.68, and
the gap between the two runs of ink is **7.19 px** — the critic's number, reproduced to the
hundredth on both engines. Webkit's frame paints

> **only 6 fits here**  9 goes nowhere else in this column

Pass 1's "the desk pair reads as one run-on sentence" is **mitigated by the 4.13 px size step and
the tint step, and NOT closed**. It is priced, not cured.

### The landscape cell (W2 §2.2), witnessed coarse

`hasTouch: true`, `matchMedia` asserted on the page: `(pointer: coarse)` true,
`(orientation: landscape)` true, `(max-width: 1023.98px)` true.

| rig | line two in DOM | computed `display` | card `clientHeight` | `scrollHeight` |
|---|---|---|---|---|
| 844×390 | yes, with its text | **`none`** | 394 | 410 |
| 812×375 | yes, with its text | **`none`** | 379 | 395 |

Identical both engines. **This is in the gaps now, not in a CSS comment** — gap 3.

### L10-W at the 14 px tier

360×740 coarse: the strip is **228 px**; the longest record the vocabulary can paint
(`16 goes nowhere else in this column`) uses **191.14 / 191.13 px** — **16.17 % headroom**, both
engines. Pass 1 read 4.99 % at BODY size. (The string is written into the live element — a
declared DOM overwrite.)

### Mechanical, every one run BARE

| gate | reading |
|---|---|
| `lint:knip` | **EXIT 0** — was exit 1 (`motionRungsCss` unused). The CSS text is inlined into its one caller; one export, one consumer |
| `vue-tsc --noEmit -p tsconfig.json` | 0 |
| `vitest run src/games/shared/` | **34 files / 444 tests passed** |
| `eslint` on the five touched source files | 0 |
| `lint:boundary` | 0 |
| `lint:copy` (`check-copy-register --self-test`) | 0 — *0 em/en dashes and 0 unadmitted jargon in product copy* |
| `lint:ink` | 0 |
| `lint:motion` | 0 — 34 specs, every one declaring its motion state |
| `lint:live-regions` | 0 — 10 declared regions, 0 born speaking |
| `test:font-coverage` | 0, with the eight admissions printed |
| `vite build` (private cacheDir) | 0 → `index-CzJXFPhXEQqA.js` |
| `test:golden` against `:4247` | **4 passed / 4** on the built dist |
| filter census, built dist, both engines | **12 passed** |

Every row above was re-run BARE on the SETTLED tree (after the AGE arm was framed and the token
flipped back to HOLD), so no number here belongs to the arm that is not the default.

`check-font-coverage` **fired on the way in**: the wider sweep derived `"check "` from
`formatConflictNote`'s template and the group's declared strings did not hold it — exit 1 until
the declaration caught up with the derivation. That is the gate doing its job on its first run.

### The r0 censuses, copied and re-pointed

| instrument | run | reading |
|---|---|---|
| `board-covisibility.probe.ts` (pass-2's r0 copy) | YES, both engines, vs the prototype | **16 passed / 16** |
| `heading-voice.spec.ts` (r0 §1) | YES, both engines, **and against the control** | **4 failed / 16 passed on the prototype AND 4 failed / 16 passed on the control** — the same four rows, and the voice census is **byte-identical** proto vs control (`diff` over the banked blocks: no output) (`Fraunces · 25.89 · 800 · lowercase` / `Patrick Hand · 14.05 · 500 · lowercase` / `Patrick Hand · 14.05 · 400 · none`; ranks `H2` / `—`; docHeadings 2; namePx 20.35 vs optionPx 20 on the dock). **r0 row NOT MOVED** — this is §1's born-RED at HEAD, and §7 did not touch it |
| `budget.probe.ts` R3-h (the π-guard's filter census) | superseded, not run | the estate's own `filter-census` spec ran on the BUILT DIST, both engines, 12/12 — a broader instrument, and it is the one `filterBudget.ts` enforces against |
| `marks.probe.ts` R3-d, `marks2.probe.ts` R3-g, `wobble.probe.ts` | **NOT RUN** | gap 5 |

## THE CHARTER'S FOURTEEN ROWS, ANSWERED

| # | row | state |
|---|---|---|
| 1 | `lint:knip` exit 1 | **CLOSED** — inlined; exit 0 |
| 2 | THE REST STATE, both arms, one frame each, L1 re-cut to read both lines | **CLOSED** — `[false,true,true]` both engines; F2-hold / F2-age; GATE 1 re-cut and GATE 1b minted (born RED on the AGE arm) |
| 3 | the fulfilment push off a 0×0 rect | **CLOSED on HOLD by construction** (0 pushes); line one's rect recorded at every push that remains (h 20.797, inked). Still live on AGE — priced in the ballot |
| 4 | crop C4 holds no margin text; price the 7.19 px run-on | **CLOSED as a photograph and a number; the run-on itself is NOT cured** (gap 4) |
| 5 | `--type-tag` out of scope | **CLOSED per the chair** (pass4/CHAIR-RULINGS §1.3 act 2): the strip reads `--type-caption`; byte-identical today, no pixel moves |
| 6 | L9's second clause | **RE-CUT and given its row.** The old wording ("a solve empties both") cannot ship: `CompletionVignette` paints off line ONE (`GameBoard.vue:1336`). The gate now reads what is true — line TWO goes, and the strip stands down (`.is-quiet`) so the verdict is in exactly one place. One new receipt row asserts all three |
| 7 | landscape `display: none` declared in a CSS comment | **MOVED INTO THE GAPS** (gap 3), with both W2 §2.2 cells measured |
| 8 | L2 on the wire; L13's born-RED build | L13 **CLOSED** on the served dist (with a finding, gap 1). **L2 NOT RUN** (gap 6) |
| 9 | six censuses | **2 run + 1 superseded by a broader instrument; 3 NOT RUN** (gap 5) |
| 10 | L10-W at 14 px | **CLOSED** — 16.17 % headroom at 360 coarse |
| 11 | the stub's `data-hidden` row | **CLOSED** — both stubs are now isomorphic with what ships (`v-if="previous"`, `.is-hidden` by class, `.is-quiet` on the block); the dropped pass-2 row is re-written as a PRESENCE/class assertion and runs |
| 12 | `marginRecordCopy`'s wider sweep | **CLOSED** — `marginVerdictCopy` derives `setMargin("…")`'s five literals and `formatConflictNote`'s two registers; eight strings added; the gate fired on its first run |
| 13 | goldens 4/4 on a built dist; the seeded-deal page census | goldens **4/4 CLOSED**. The seeded deal is LANDED (`?board=` from the control's own share act) but the census over it is the 9-key chrome set, **not every rect on the page** (gap 7) |
| 14 | trim the evidence dir | **NOT A LANE'S ACT.** `pass3/` is frozen; the chair's sweep already zeroed `pass3/prototype/NOTE-LEDGER/frames/`. What is left is 415 KB of raw geometry JSON in `pass3/…/logs/`, and deleting it is the CHAIR's row — proposed, not done. This pass's whole directory is **192 KB** (40 KB logs, all summaries; three crops, 48.7 KB total) |

## GAPS — every one of them

1. **§13's borrowed rung stub breaches the @property law's FIRST CLAUSE, and the born-RED
   measurement is the proof.** The clause: the registration lives in the first STATIC stylesheet
   and is NEVER emitted by the publisher it guards (LAWS §Gates; chair §6.5). `motionRungs.ts`
   emits `@property --motion-*{…initial-value:0ms}` and the values from ONE `<style
   data-motion-rungs>` node, so deleting the publisher deletes the registration too — and the
   rungs then resolve to **`""`, not `0ms`**, which makes the `animation` shorthand invalid and
   leaves the node with **no animation at all** rather than an instant one. Measured above, both
   engines, on the served dist. The row still reds, but the designed pose ("absent publisher
   reads as reduce") does not land. **The node is MOT-LADDER's (registry §2.7) and this is
   reported, not patched.** It is also exactly what MOT-VERB's undefined-token census exists to
   catch — an undefined custom property in a timing slot.
2. **The fork is not decided, and the prototyper should not decide it.** HOLD is the default
   because it is the deletion and because it is the only arm on which the family's opening
   sentence is true at rest. What HOLD costs: a record can sit on the live line for a long time
   after it has come true, at FULL graphite pressure, and nothing on screen says it is spent.
   AGE's cost is the frame: one 14 px caption under a 20.8 px empty gap, plus the 0×0 push.
   Both frames go up. **Neither was audited by a reader.**
3. **Line two is `display: none` on EVERY landscape phone under 1024** — 844×390 and 812×375
   measured above, in the DOM with its text, zero-rect. That is the family's whole thesis
   switched off by orientation on a real device pose. Declared as depth ONE on B6's
   split-grammar row, and the owner disposes; it is a gap until they do.
4. **The desk run-on is priced, not cured.** 7.19 px between two runs of the same hand's ink on
   one row, both engines. The size step (18.18 → 14.05) and the tint step mitigate it. F3 is what
   it looks like when both sentences take the hidden-single template.
5. **Three r0 censuses were not run**: `marks.probe.ts` R3-d (and its two-act diff),
   `marks2.probe.ts` R3-g, `wobble.probe.ts`. None is reported MOVED, because none was touched.
6. **L2 was not driven on the wire.** No `?wire=local` peer was staged. The predicate is
   authorship-blind by construction (the watch reads `props.values`, the same prop a peer's digit
   lands in) and the unit rows cover elsewhere/house/cell — but "measured on the real relay" is
   still not claimed, two passes running.
7. **The whole-page rect-for-rect census is still owed.** The deal is pinned now, which was the
   blocker; what ran over it is a 9-key chrome census with 14 paint properties, not every rect on
   the page. Somebody should run the ordinal sweep over the pinned deal and read the difference.
8. **`min-height` is still on `.margin-note-block`, not on the voice.** The charter offered
   "put `min-height` on the voice, OR measure and declare the fulfilment push". The second was
   taken, because on HOLD there is no fulfilment push to measure — but the empty-line-one box is
   still 0×0 whenever line one is genuinely empty, and any FUTURE writer that pushes off an empty
   live line inherits the bug. No guard was added. It is one line if the chair wants it.
9. **The AGE arm was framed but not re-measured.** Its π, AA and gate readings are assumed to be
   HOLD's (the diff between the arms is one boolean in one `if`), not measured. If the owner
   fires AGE, the arm needs its own pass.
10. **The ransom note is still open** (U-10, R6 law 30, twice declined). Eight codepoints admitted
    by name, each with the instrument that watches it; the ledger reds from the other side the day
    a re-cut lands. `marginVerdictCopy` widens the corpus; it does not close the cut.
11. **The two FORK frames are not on one board.** The chair's 2026-09-19 addendum warns that a
    ballot pair is contaminated until both arms load one encoded board. F2-hold and F2-age each
    ran the canonical loop on the dev server's own random deal, so the two frames show different
    sentences. The POSE is the subject (two lines vs one under a gap) and the pose does not turn
    on the deal — but a same-board pair is cheap now that the codec is understood, and it is owed.
12. **Nothing here was read by a non-author.** The pass-4 number is the CRITIC's.

## INCIDENTS, SELF-DECLARED

1. **My own AA probe read the wrong channels first.** `rest.probe.mjs` parsed
   `color(srgb 0.15 0.15 0.15 / 0.68)` with the `rgba()` regex and took the ALPHA as the blue
   channel, printing 10.224 / 11.308. Caught because it disagreed with pass 3's independently
   derived 5.18 / 6.11. `aa.probe.mjs` is the corrected read and carries its own negative control
   (the same ink at α 1.0 must report HIGHER, and does: 14.470 vs 5.184). The bad numbers are in
   `logs/rest-hold.json` under `aa_light` / `aa_dark` and are superseded by `logs/aa.json`; they
   are left in place rather than edited, because a bank that can be quietly corrected is not a bank.
2. **The first F1 crops held one line.** An element screenshot of `.board-margin` cannot contain
   line two below 1024, because line two is `position: absolute; top: 100%` and sits outside the
   strip's own painted box. Both crops were deleted and re-shot as a viewport CLIP
   (`fork-frames.probe.mjs`). This is C4's failure mode in a different costume, on the same
   family, one pass later.
3. **A scratch Playwright config under `docs/` cannot resolve `@playwright/test`** — the banked
   trap, hit anyway. The r0 copies are BANKED under `instruments/` with their config removed and
   were RUN from `<worktree>/web/frontend/.ledger/`, which is deleted before return.
4. **A backgrounded command that itself backgrounds its children loses them** when the harness
   reaps the job: one vitest and one eslint run were killed mid-flight and re-run as a single
   foreground chain. No number in this file comes from a killed run.
5. **`const LEDGER_FULFILLED: "hold" | "age" = "hold"` is TS2367 the moment it is compared** — a
   `const` with a union annotation narrows to its literal, so the arm is a boolean
   (`LEDGER_FULFILLED_AGES`) and the comment carries the two names.

## THE REPLAY ROUTE

**None.** The work tree IS the pass-3 tree and it advanced IN PLACE, per pass-4 CHAIR-RULINGS §2
("continuing lanes work in place"). `git -C <work> diff --stat` at open read 10 files / +1153 −48
and the pass-3 README's own FILES list names exactly those ten plus the untracked
`motionRungs.ts` — **they agree**, and nothing was replayed, reset or 3-way merged. (The charter
header's "+881 −41" is pass 3's replay delta against its pass-2 source, a different number from
the diff against `74a2b5d9`; the README states both.) The chair's `pass3.diff` (83,581 B) remains
the pass-3 record and this tree no longer matches it — by design.

## FILES

Product (work tree, uncommitted): `src/games/shared/GameBoard.vue` ·
`src/pencil/chrome/MarginNote.vue` · `src/pencil/config/motionRungs.ts` (new, §13's, BORROWED) ·
`src/pencil/config/pencilConfig.ts` · `src/main.ts` · `src/assets/index.css` ·
`src/games/shared/GameBoard.receipt.test.ts` · `src/games/shared/GameBoard.notes.test.ts` ·
`scripts/check-font-coverage.mjs` · `scripts/check-ink-pressure.mjs` · `e2e/font-census.spec.ts`

Evidence (this dir, 192 KB): `probe/` (4 pass-4 probes) · `instruments/` (2 r0 copies, run) ·
`logs/` (6 summarised JSON, 40 KB — no raw rect dumps) · three crops, 48.7 KB total.

## THE THREE CITED CROPS — each a REPLACEMENT

| frame | engine · theme · viewport · pointer | retires |
|---|---|---|
| `F2-390x844-light-coarse-hold-at-rest-chromium.png` (20,595 B) | chromium · light · 390×844 · **coarse** (`hasTouch`, witnessed) | `pass3/…/frames/C1-390x844-dark-fulfilled-webkit.png` (57,035 B) |
| `F2-390x844-light-coarse-age-at-rest-chromium.png` (14,158 B) | chromium · light · 390×844 · **coarse** | `pass3/…/frames/C3-360x740-coarse-dark-longest-webkit.png` (54,898 B) |
| `F3-1280x800-light-fine-deskpair-webkit.png` (13,900 B) | webkit · light · 1280×800 · **fine** | `pass3/…/frames/C4-1280x800-light-desk-pair-webkit.png` (12,421 B) — the empty one |

The three replacements weigh 48,653 B against 124,354 B retired: the wave gets **75.7 KB back**.

## SERVERS

`:4249` (prototype dev), `:4248` (HEAD control preview), `:4247` (prototype dist preview) — all
killed by RECORDED PID; `lsof -ti` reads empty on each. No `pkill -f` on any shared prefix.
