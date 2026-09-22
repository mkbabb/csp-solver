# CTRL-COST — pass 4 PROTOTYPE (the consequence ladder)

**RUNNING on the real surface, both engines, built dist against built dist.** Work tree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29`,
at **`74a2b5d9`**, uncommitted. `git -C <work> diff --stat` now reads **21 files, +2,196 /
−1,557**, plus one untracked file (`web/frontend/scripts/check-cost-face.mjs`).

## 0 · THE REPLAY ROUTE

**IN PLACE. Nothing was replayed and nothing was reset.** At agent start
`git -C <work> diff --stat` read 18 files / +1,980 / −1,547 plus the untracked
`scripts/check-cost-face.mjs` — which AGREES with the pass-3 README's file list line for line, so
the tree is the pass-3 prototype and the chair's banked `pass3/prototype/CTRL-COST/pass3.diff` is
the record. No `git archive`, no `diff3 -m`, so no line-count check is owed. The three new files
in the diff are e2e specs (`access`, `font-census`, `mobile-affordances`) — the charter's row 9.

**Servers.** Prototype dev `127.0.0.1:4233`; prototype BUILT preview `127.0.0.1:4235`
(`index-BUIDrd-OiOrV.js`); the shared HEAD control `127.0.0.1:4234` served read-only from
`.claude/worktrees/w7-control` and **verified by its asset hash `index-CubiZsMVSwTc.js`**, never
by a 200. All three killed by recorded PID (30549 / 59338 / 32290); 4233/4234/4235 read clear.
4230 and 4231 belonged to sibling lanes and were left alone.

---

## 1 · THE NUMBERS, gaps first

### GAPS STILL OPEN (five, each with the number that holds it)

1. **The e2e estate is 30 rows red and they are NOT re-aims** (charter row 9, half open).
   `zone-grammar` + `viewport-law` + `board-covisibility` + `join-language`, both engines:
   **48 passed / 30 failed.** Every one of the 30 asserts over furniture this design DELETES —
   `.tray-well`, `.washi-tag`, `.action-bar`, `.mobile-heading-btn`. Re-aiming them would be
   re-wording a gate to pass over a subject two owner marks still own (T9-M03, T9-M04), so they
   stand red and travel with the ballots in §4. **What WAS re-aimed and run: 32 passed / 0 failed**
   (`access` + `mobile-affordances`, both engines) and **2 passed / 2 failed** (`font-census`).
2. **`font-census.spec.ts:231` stays RED, both engines** — three ledger rows produce no cell,
   the named one being **`Patrick Hand|Easy`**, whose own comment reads *"closed-tab value
   (UI-12)"*. The section tabs are deleted by this design, so the row is stale by consequence.
   The file's own precedent (T6 mark 12 retired four rows here) says retire with the reason; a
   ledger retirement is a copy-corpus act and this lane does not take it unilaterally.
3. **Owner mark T9-M03's sticky tag is still retired with no ballot** (the critic's §2.2; NOT in
   this charter's numbered list, carried anyway). `.washi-tag` falls from 12 references at HEAD
   to 1 in `GameControlPanel.vue` (a comment). Chair §6.3(a) REFUSED exactly this. The intent
   arguably survives in kind — a sticky band head is a name pinned over its group, and §3's
   numbers show that head covering 0 controls at every offset where HEAD's covers 1–3 — but that
   is an argument for the owner's eye. **A second ballot is owed and is written in §4.**
4. **A touch-armer who reaches for the keyboard still has no focused answer.** Measured, not
   implied: `focusAfterArm` reads **BUTTON on chromium and BODY on WebKit** in all six cells —
   the input split working as designed. They are covered by the 2,500 ms window and by
   `disarmElsewhere`; the ask lapses, it does not fire. Still unclosed as its own row.
5. **`--tap-floor`'s `, 2.75rem` fallback survives in this tree** (four consumers). It is HEAD's
   own idiom and `--tap-floor` is declared in `App.vue` on `.page-root`, not in `index.css`, so
   §6.5's "a static token in index.css is always present" does not straightforwardly reach it.
   Named here because PLR-SELF's gap list names it too; it is the leader's row, not a lane's.

### CLOSED, each at its number

| charter row | the number, on this tree | verdict |
|---|---|---|
| **1 π at 390×844** | `.masthead`, `.board-wrapper` and `#fold-tools` are **byte-identical to the control** at 390×844 dark **sheet-UP**, 390×844 light sheet-shut and 1280×800, **both engines**. Phone: masthead `[58.14, 143.52, 273.72, 78.22]` ck / `[58.73, 143.8, 272.53, 77.63]` wk on BOTH arms; board `[12, 219.73, 366, 366]` ck / `[12, 219.42, …]` wk on both; `#fold-tools` **61.58 = 61.58**. The 2.21–2.22 px lift is gone. | **CLOSED** |
| **2 the berth reaches a coarse pointer** | ARMED is a third path to the berth now, and it outranks the hovered one. Measured after a real **TAP**: `berth: "a new board replaces this one"`, opacity **1**, `armed: true` — **chromium 390×844 touch, webkit 390×844 touch, webkit 844×390 touch**, plus the three mouse cells. Pass 3 read `text: ""` in the two touch cells. | **CLOSED** |
| **3 re-shoot the 390 pair with a TOUCH tap** | f1/f2/f3 are all `hasTouch: true` contexts armed with `locator.tap()`; the caption names the pointer class. | **CLOSED** |
| **4 T7-W2 A2's disposition** | The row is written in the ESTATE's e2e (`access.spec.ts:333`), not in a probe file, per chair T9-D1: **0 focusables in the covered ribbon region, both engines**, with its **negative control in the same run** (a planted button at the ribbon's centre IS found, so the census can see into the region). The verbs are not inert — they are **not rendered there**: 3 of them ride into the card (`.controls-card .play-controls button` = 3, `#fold-tools .play-controls` = 0); the 4th, the peek chip, is `v-if`'d away because there is no board to peek at. | **CLOSED** |
| **5 T9-M04 ballot** | Written in §4 as **T9-B8** with both frames named and the chair's firing default restated. The MOVED row is withdrawn as a disposition; R3 stays RED on the r0 probe and this lane's re-wording stays a PROPOSED diff. | **CLOSED as a ballot** |
| **6 the exempt count beside the covered count** | One predicate, stated once, run on BOTH trees (`probe/p4-occlusion.mjs`): occluder = the nearest `position: sticky` ancestor of the hit inside the card; exempt = a hit whose centre is inside the card's OWN top-padding strip. **Prototype 390×844 (both engines): 0 covered at every offset, exempt 0/0/0/3/2/2 of 25. HEAD 390×844: 1 covered at scrollTop 0, exempt 0, of 19. Prototype 1280×800: 0 covered, exempt 0/0/3/0/0/0 of 26. HEAD 1280×800: 1/2/3/3/3/2 covered of 21, exempt 0.** Exempt strips: 47.07 px here, 6 px (phone) / 20 px (desk) at HEAD. | **CLOSED** |
| **7 register `--fold-tools-h`** | `@property --fold-tools-h { syntax: "<length>"; inherits: true; initial-value: 0px }`, in `scene.css` beside the other two, shipped in the dist (`@property --fold-tools-h{syntax:"<length>";inherits:true;initial-value:0}`). The `initial-value` fails VISIBLY and does not re-create the struck `3.5rem`. The publisher now reads the row's MARGIN box at two decimals — `Math.ceil` was itself a 0.42 px lie on a centred column. | **CLOSED** |
| **8 `--ring-ink` copied and measured** | MRK-LIVE's declaration copied **verbatim and cited** (`index.css:233-236` on `wf_f72f3b5a-83a-35`); both consumers write it **bare** (`, currentColor` struck ×2). Computed on the tree: `--ring-ink: #3a7bc4` here vs **`""` on the control**. Painted ring: `rgb(58,123,196)` @2px — **4.289 : 1 light, 4.286 : 1 dark**, against both the face's ground and the card's paper (the WCAG 1.4.11 non-text floor is 3.0). One focused frame: **f4**. | **CLOSED** |
| **9 the 22 e2e re-aims** | WRITTEN AND RUN. `access.spec.ts` ×2 rows, `mobile-affordances.spec.ts` ×3 rows, `font-census.spec.ts` ×2 rows, `GameControlPanel.test.ts` ×3 rows — addresses moved to `.band-row` / `.band-row-caption` / `.act-word.is-shown` / `.deal-face[data-armed] .act-verb` / `.deal-face .act-answer`. **32/0 both engines** on access + mobile-affordances. The other 30 are gap 1. | **HALF CLOSED** |
| **10 the ruler law's CI witness** | `check-cost-face.mjs` grows from 7 checks to **11**, all GREEN, with **11 planted defects each redding its own check and nothing else**. Check 9 IS the ruler: `.band-acts-rungs` must be one `minmax(0, max-content)` column, the marks row must be `contain: inline-size`, and **a SECOND `contain: inline-size` in the panel is a RED** — contain every child and the card has no intrinsic width for the law to be measured against. | **CLOSED** |
| **11 W2 §2.2 at 844×390 AND 812×375** | The probe, not a reading. Both widths, **both engines, `hasTouch: true`, regime witnessed on the page** (`coarse: true`), opened through the **tab**: **4/4 bands' first control reachable** — scrolled into the card, inside its box, hit-testing to itself, ≥44 px. Card `clientHeight` **302** at 844×390 and **287** at 812×375, `scrollHeight` **878**. **The negative control reds in the same run** (the first control shrunk to 1 px → unreachable), all four cells. | **CLOSED** |
| **12 the resting verb word at 4.382** | DECLARED with HEAD provenance, and the provenance is measured, not asserted: the same verb, hovered with a **real mouse**, reads `rgb(115,115,115)` on `rgb(246,246,244)` = **4.382 light / 6.188 dark on the PROTOTYPE and 4.382 / 6.188 on the CONTROL**, both engines, identical to three decimals. It is `.icon-btn:hover`'s pair, inherited; this family neither made it nor can fix it without a palette act (§11c's). | **CLOSED as an inherited row** |
| **13 the TAPE collision** | Named in §5, both seats. | **CLOSED** |
| **14 the unmatched π paths** | Printed, counted and classified. At 1280×800 and at 390×844 dark sheet-up: **CHROME moved 0, CHROME repainted 0, CHROME unmatched 0** either side (both engines). At 390×844 light sheet-shut: **CHROME moved 14**, all inside `.play-controls`, all Δx **±0.80**, zero Δy, zero Δh — the ribbon is centred and the boxed `hint` is 1.59 px wider. CHROME unmatched = the hint's own `div.outline-container.act-face` and its 4 outline `g > path`s. Everything else unmatched is `game-cell > svg > path` — the board's hand-drawn digits, which differ because **`?board=` does not pin this app's deal** (stated as a fact, not assumed away). | **CLOSED** |
| **15 the two faces' heights** | DECLARED as the estate's own icon rank (T9-W2 §2.6 M01: act · verb · tool), and the rank is measured: **deal's glyph is 36 px (40 coarse) = `--icon-act`; clear's is 28 px (30 coarse) = `--icon-verb`.** Faces: deal 73.59 × 123.97 vs clear 61.59 × 104.38 at 390×844; 61.59 × 110.38 vs 61.59 × 102.38 at 1280×800. The words do not share a baseline (icon y 609.08 vs 604.28 at 390) and that is what a rank looks like — Deal is the card's one primary verb. | **CLOSED as a declared rank** |
| **16 WebKit crops; dark and 900×500 press cells** | f2 and f3 are WebKit. The arm battery runs **six** cells including **webkit 1280×800 DARK** and **chromium 900×500**: armed in all six, berth shown in all six. | **CLOSED** |
| **the critic's §2.5 (double-speak)** | Not in the charter's list; closed anyway. The armed verb's `aria-label` no longer swaps to the ask — the NAME is the act, the DESCRIPTION is the state. `nameEqualsDesc` can no longer be true by construction. | **CLOSED** |
| **the critic's §2.7 (the floor's width half)** | `.act-answer` declares `min-width: var(--tap-floor)`, and **check 8** of the node gate holds it with its own planted defect. | **CLOSED** |

### GUARDS AND GATES, all bare

| gate | number | exit |
|---|---|---|
| `node scripts/check-cost-face.mjs --self-test` | **11 checks GREEN, 11 plants each RED on its own check** | 0 |
| `npm run lint:copy` (M16, bare) | 0 em/en dashes, 0 unadmitted, 0 ADMITTED | 0 |
| `npm run lint:motion` | — | 0 |
| `npm run lint:theme-selectors` · `lint:theme-tokens` · `lint:ink` | — | 0 |
| `node scripts/check-font-coverage.mjs` | — | 0 |
| `node scripts/check-live-regions.mjs --self-test` | — | 0 |
| `npx prettier --check src/ scripts/` | all files clean — it redded TWICE and was re-formatted each time (`check-cost-face.mjs` after the new checks, `GameControlPanel.test.ts` after the address re-aim), then re-run clean with both gates still green | 0 |
| `npx vue-tsc --noEmit -p tsconfig.json` | — | 0 |
| `npx vue-tsc --noEmit -p tsconfig.e2e.json` | — | 0 |
| `npx vitest run` | **68 files / 836 tests, all pass** | 0 |
| `npx vite build` | dist built in the work tree, own cacheDir — `index-BUIDrd-OiOrV.js`, 37 assets | 0 |

**NOT RUN this pass, and named:** the filter census and the four goldens off the built dist
(pass 3 read 12/12 at budget 9 and 4/4 with no re-mint; this pass rebuilt the dist and did not
re-run them). The dist was deleted at return along with the scratch caches.

---

## 2 · WHAT PASS 4 CHANGED, and why each line exists

1. **`GameControlPanel.vue` — `.icon-btn:has(> .act-face) { padding: 0 }`.** The π row's whole
   mechanism. `.icon-btn` pads 0.3rem 0.5rem and the face pads 0.32rem 0.9rem *inside* it, so the
   boxed `hint` measured **65.58** against its bare siblings' **55.98** — 9.6 px of doubled
   padding. The ribbon's row grew, its reserve grew, and the stacked column being centred, HALF
   the growth lifted the masthead and the board **2.21 px**. The gallery's `.guard-btn` has
   carried `padding: 0` under the same face since the face was minted; this is the card catching
   up, not a new idea.
2. **`GameControlPanel.vue` — `@media (pointer: coarse) { .play-controls { margin-top: 0.35rem } }`.**
   HEAD hangs this row 5.6 px below the ribbon's top edge and pass 3 dropped it with the coarse
   gate. Restored where HEAD keeps it; the gate itself stays dropped (the row is the band's at
   every pointer, which was pass 3's real argument).
3. **`GameControlPanel.vue` — the publisher reads the row's MARGIN box, at two decimals.**
   `Math.ceil` published 62 for a 61.58 row; on a centred column that is 0.21 px of board.
4. **`scene.css` — `@property --fold-tools-h`**, `inherits: true`, `initial-value: 0px`, beside
   the two the same file already registers, with the reason written at the block.
5. **`GameControlPanel.vue` — `armedNoteKey`, and `noteOf` reads it first.** An armed act holds
   its own note for as long as the question stands, on every pointer class, and it outranks the
   hovered one: the berth is one slot and the standing question owns it.
6. **`GameControlPanel.vue` — the armed verb's `aria-label` stops swapping.** The name is the
   act; the description is the state.
7. **`GameControlPanel.vue` — `.act-answer { min-width: var(--tap-floor) }`.**
8. **`index.css` — `--ring-ink` declared (MRK-LIVE's line, cited) and consumed bare ×2.**
9. **`scripts/check-cost-face.mjs` — checks 8–11 and their plants.**
10. **Three e2e specs + one unit spec re-aimed** (§1 row 9).

---

## 3 · THE MERGE-WATCH STATEMENT (chair §4, verbatim in the return)

**The pin band is ONE mechanism and `useTwoTap` / `askingAct` is ONE machinery — YES on both
halves, and the number is the derived one.** `--pin-band` computes **47.0656 px** (chromium) /
**47.065601 px** (webkit) on this tree at every cell, from `calc()` alone, with **no JavaScript
publisher and no ResizeObserver term**; TAPE's 43.8656 px is the same closed form fed by a
sampled head, and the sample is the defect pass 3 killed (38 / 41 / 42 across the three regimes,
engine-split and order-dependent). What is left when the publisher dies is TAPE's derived form,
and this tree already is it. `useTwoTap` and `askingAct` are one machinery — armed ref, one
timer, `confirmWindowMs`, fire-on-second-press, teardown — with two POLICIES. **This lane's
pass-4 return is therefore a GRAFT LIST, not a rival design**, and the cell that would have made
it a fork does not exist on the readings.

**GRAFT LIST (what §10's file should take):** `.act-face` + the drawn `no` at 1.5 inside 2.5 ·
the input-split focus contract and the null-`relatedTarget` belt · **the face is the button's
air** (`padding: 0` on the button that holds a face — the π row) · the berth-in-the-head at 1px
**with ARMED as a summoning path** · the derived band · the ruler law and its two cures ·
`check-cost-face.mjs`'s shape, now with a floor in two dimensions and a static ruler witness ·
the occlusion predicate with its exempt count printed beside the covered count.

**POLICY ROWS THAT MUST NOT DIE (→ W1 §1.5 / U-10):** (i) the ask is POINTER-AGNOSTIC, and so is
the CONSEQUENCE SENTENCE — measured armed and berthed on touch and on mouse, both engines;
(ii) the answer is a REAL control, ≥44 px in BOTH dimensions, in the a11y tree, with its own name
and its own description.

---

## 4 · THE TWO BALLOTS FOR THE OWNER (U-10)

### T9-B8 — the `.action-bar` (owner mark T9-M04's subject)

| arm | what it is | the frame |
|---|---|---|
| **A — this lane: DELETE** | `--action-bar-h`, `scroll-padding-bottom`, `.action-bar::before` and the bar go; the foot fade re-homes to `.controls-card::after` spending `--card-pad-b`. Population **0** in src and in the rendered DOM at desk · dock · landscape, both engines. Nothing straddles the case edge because there is no foot. | **f1 / f2 / f3** — the card with no foot at all, phone, both engines, both themes |
| **B — CTRL-TAPE/RULE: MOVE to `#card-foot`** | chair §6.3(c), W2 §2.3's own discipline; RED until `padding-bottom: max(<foot pad>, env(safe-area-inset-bottom))` is landed AND measured (chair §6.1). | CTRL-TAPE's `c1-foot-inset34-390-dark-chromium` (swept; cited by number in `pass3/SWEEP.md`) |

**Chair's firing default stands: the bar MOVES to `#card-foot` and wears its drawn edge in the
house hand.** This lane does not contest it — it reports that its own arm is lawful, built and
framed, and that **a MOVED row does not retire a mark**, so the r0 probe's R3 row stays as
written and this lane's re-wording stays a PROPOSED diff, unapplied.

### T9-B9 (NEW, this lane's, owed since pass 3) — the sticky tag (owner mark T9-M03)

| arm | what it is | the number |
|---|---|---|
| **A — this lane: the pin moves from the TAG to the BAND HEAD** | `.washi-tag` and the four wells retire; a `position: sticky` band head carries the group's name inside a reserved 47.07 px strip. | **0 of 25/26 controls covered at every scroll offset, both engines, both regimes** — against HEAD's own sticky heading covering **1–3 of 21** at the desk and **1 of 19** on the phone, under one shared predicate |
| **B — keep the tag and cure the pin** | chair §6.3(a): the orphan-field readings (4/14 chromium, 4/13 webkit) are a DEFECT of the pin to cure, not a reason to retire the tag. | not built by this lane — the fork is stated, not pre-empted |

**No default is proposed. Only the owner retires a mark.** The intent — a name pinned over its
group, which does not park on the group's own controls — is satisfied by arm A and measured; the
MECHANISM is the mark's, and the mechanism is what changed.

---

## 5 · UNCOORDINATED SEATS (the collision list, charter row 13)

1. **`--motion-whisper: 150ms`** is seated in this tree's `index.css` (§13's rung, here so the
   lane builds standalone) — **CTRL-TAPE seats its own.** Duplicate declaration to strike at the
   fold; §13's is the home.
2. **The `@property` block** (`--card-pad-b`, `--pin-band`, now `--fold-tools-h`) is seated in
   this tree's `scene.css` — **§10's leader lands ONE block** (registry §6.8). Three rows to
   move, unchanged, not re-minted.
3. **THE FOOT.** This lane deletes `.action-bar` / `--action-bar-h` / `scroll-padding-bottom` and
   re-homes the fade to `.controls-card::after` spending `--card-pad-b`; **CTRL-TAPE lands
   `.card-foot` + `--card-foot-h` + `--safe-b`.** The two cannot both be the card's foot, and the
   sentinel's spend is the same token. **This is the collision pass 3 named the first of and not
   the second; it is named here, and T9-B8 decides it.**
4. **`--ring-ink`** is COPIED here, not minted — one declaration, MRK-LIVE's, cited. When LIVE's
   diff lands, this copy is **struck**, not merged.

---

## 6 · FRAMES (4, each a REPLACEMENT, ≤150 KB)

| file | engine · theme · viewport · pointer | retires |
|---|---|---|
| `f1-ask-390x844-light-armed-TOUCH-chromium.png` (39,520 B) | chromium · light · 390×844 · **coarse, `hasTouch`, armed by `tap()`** | `pass3/…/frames/ask-390-light-armed.png` (40,618 B — the crop taken with a MOUSE inside a `hasTouch` context) |
| `f2-ask-390x844-light-armed-TOUCH-webkit.png` (49,246 B) | webkit · light · 390×844 · **coarse, `hasTouch`, armed by `tap()`** | `pass3/…/frames/ask-390-light-rest.png` (29,815 B — chromium-only pair) |
| `f3-ask-390x844-dark-armed-TOUCH-webkit.png` (54,096 B) | webkit · dark · 390×844 · **coarse, `hasTouch`, armed by `tap()`** | `pass3/…/frames/ask-390-dark-armed.png` (46,332 B) |
| `f4-ring-1280x800-light-keyboard-focus-chromium.png` (26,754 B) | chromium · light · 1280×800 · **fine, keyboard focus** | `pass3/…/frames/ruler-rungs-1280.png` (25,402 B) |

Total 169,616 B against 142,167 B retired — **+27,449 B** on the wave's image budget. All four
pass-3 files were already deleted by the chair's sweep (`pass3/SWEEP.md`), so the retirement is
of the CITATION, and this README cites the numbers those crops illustrated.

---

## 7 · INSTRUMENTS AND READINGS

Raw π census JSON is SUMMARISED, never banked whole (LAWS): `readings/pi-SUMMARY.json` holds the
12 censuses’ node counts and named boxes; the 5.7 MB of raw rects was deleted after the diffs ran.

Under `probe/`, all new this pass and all re-pointed at this lane's own ports:
`p4-pi-rects.mjs` (π: 11 computed PAINT properties + tag name + rect per node, a viewport/theme
argument and a SHEET-UP state) · `p4-pi-diff.mjs` (the diff; prints CHROME vs glyph columns and
**names the unmatched paths**) · `p4-arm-berth.mjs` (the arm on each pointer class, the berth,
the two faces' boxes, the ring, the regime witnessed) · `p4-occlusion.mjs` (one predicate, both
trees, exempt printed beside covered) · `p4-reach.mjs` (W2 §2.2, born-RED, negative control in
the same run) · `p4-ink.mjs` (painted contrast, real `hover()`, both trees) · `p4-frames.mjs` ·
`p4-ringframe.mjs`. Readings under `readings/` (36 JSON).

**Nothing under `loop/r0/`, `pass1/`, `pass2/` or `pass3/` was written.** No r0 instrument was
run this pass; **the r0 rows this lane MOVED are unchanged from pass 3** — L3 is the chair's and
is landed (pass4 §1.1); **R3 stays RED** and this lane's re-wording remains a PROPOSED diff at
`pass3/prototype/CTRL-COST/instruments/law-probe.PROPOSED.diff`, unapplied, pending T9-B8.

---

## 8 · INCIDENTS, self-declared

1. **A probe banked under `docs/` cannot resolve `playwright`** (ESM; `NODE_PATH` does not help).
   The canonical copy is banked here; execution ran from a copy at
   `<work>/web/frontend/.cost/probe/`, deleted before return. Same class as the LAWS' note about
   PW configs under `docs/`.
2. **The first arm battery read `armed: false` in five of six cells** because the probe typed
   into `input:not([readonly])` `.first()` — a GIVEN, which accepts nothing, so the board stayed
   pristine and the verb correctly DEALT instead of asking. Fixed by finding the first EMPTY
   input; the fixed battery reports the dirty value it typed, in every row.
3. **My own A2 census was wrong before it was right.** The first cut counted any focusable whose
   centre lay inside the ribbon's rectangle and found three — the CARD's own controls, sitting in
   front of the cover, not behind it. The predicate now excludes the covering surface
   (`#controls-drawer`) and says so in the spec; the negative control is what keeps that
   exclusion from being a way to pass.
4. **`prettier` redded TWICE**, once on `check-cost-face.mjs` after the new checks landed and once
   on `GameControlPanel.test.ts` after the armed address moved. Re-formatted and re-run each
   time; the node gate still reads 11/11 with 11 plants and the unit file still reads 40/40.
5. **`vitest --reporter=basic` is not a reporter in this vitest** (4.1.x) — startup error, no
   tests run. Re-run bare: 68 files / 836 tests.
6. **`?board=` does not pin this app's deal.** Both arms were given it and the two boards differ
   in their givens, which is why 9–37 `game-cell > svg > path` nodes move and 4–102 are unmatched
   per cell. Reported as a fact about the instrument's confound, not swept: the CHROME columns
   are the π claim and they are separated in the tool, not in the prose.
