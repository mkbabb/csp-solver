# CTRL-TAPE · pass-6 adversarial critique (§10 controls: the tape, the band, the foot)

I wrote neither the charter nor the prototype. Every number below that isn't credited to the lane I took myself on
2026-09-23, in chromium and webkit, on my own servers. The box was loaded (load average 755 at the start).

**The rig.**

- **Proto.** I built the work tree `wf_f72f3b5a-83a-27` myself, with a scratch ESM config, a private cacheDir and
  `outDir` outside the tree. It reproduced the lane's final identity **`index-BBBYNWxB0Bv8.js`**. Served by
  `vite preview` on **:4232**.
- **Control.** The shared `w7-control` dist, `index-CubiZsMVSwTc.js` (`74a2b5d9`), served on **:4233** with its own
  config. It was never edited, built or git-touched.
- **Identity.** Both ports were verified by asset hash.
- **Payload.** Every row dealt PINNED_GIVENS (`?board=ATMuNTA4…`), and the givens read back
  `0:5,2:8,11:3,18:6,20:9` on every arm.
- **Clean-up.** The servers were killed by recorded PID (vite 5382/5396, npx 5152/5150), and both ports read free.
  My scratch PW config `.ctrl-tape-crit6/` was `mv`ed to `<scratchpad>/trash-ctrl-tape-crit6/`; no `rm` was used.
- **The tree afterwards.** `git status` shows 26 M + 2 ??, product files only.

My instruments are in `critique/CTRL-TAPE/instruments/` and the classified readings in `readings/critic-readings.txt`.
I banked no frame. I looked at all three of the lane's crops.

**Verdict: ADVANCE. Convergence 84% (up from 81).**

- **Advanced.** Six of the pass-5 critic's rows are cured, and I reproduced each to the hundredth in both engines:
  - the note regime;
  - the junction (bar one column);
  - the real inset;
  - §2.5b's STUCK sweep;
  - the one-frame release lag;
  - the pass-5 plant (8/8 red).
- **Held down by three things this pass found:**
  - `check-tape-foot`, the only CI witness of the edge, is cured only for the plants it lists. **15 of 15** new one-line
    breaks stay GREEN, and four of them erase the frame's ink on paint in both engines.
  - The new CDP inset e2e row reds the correct tree **4 of 7** runs, because a one-shot photograph pair catches the
    case's boil.
  - COST's new lapse path **steals keyboard focus** back to the verb after the reader has moved on (chromium). The
    control doesn't do this, and no row gates the lapse.

---

## 0 · What I re-ran myself (both engines unless named)

| row | lane's claim | critic | verdict |
|---|---|---|---|
| **pass-5 plant first**: the pass-5 critic's B1–B8, anchor re-pointed (`p6-foot-breaks.p6.mjs`) | 8/8 RED | **8/8 RED**, and the live source 0 findings | reproduced |
| `lint:tape-foot` (`--self-test`) | 23 plants red, live green | **23 plants red, live green, exit 0** | reproduced; but see §1 |
| row 2, the notes at coarse 1280×800 (hasTouch, keyboard focus-visible on every foot verb) | 0 notes mount; control inside | proto **0 mounted, 0 visible** on all 4 verbs + the keys glyph. Control: 5 mounted; spill past the case −24.31 / −4.35 / −82.88 / −83.11 (chromium), −41.22 / −21.35 / −99.89 / −100.14 (webkit) | reproduced to the hundredth |
| row 4, the real inset (chromium CDP 34 px, 390×844 DPR 2, PRM) | pad 46, bar 798, ink 5 css above 810 | pad **46px**, bar bottom **798**, lowest lip ink bottom **805.5**, so **4.5 css** above the inset line. At inset 0: 839.5, 4.5 above the viewport. The control has no foot or frame (null) | reproduced (the lane counts the row top, I count its bottom) |
| row 3, junction (the lane's `p6-junction`, copied; dark, DPR 2; fracs 0/0.1/0.25/0.5/0.75/0.9) | 6.5–10.5 css, one-column residual | min 6.5–8 css at 16 of 24 poses. **One column at 0 css at 8 of 24 poses:** chromium land844 0.1/0.75/0.9 (x 840.5), webkit land844 0.1/0.75/0.9 (x 840.5), webkit dock390 rest (x 386.5) and 0.75 (x 3). land844 0.25 reads no well above the lip (the pose is blind) | reproduced. The residual is at the frame's corner column (outline span 4–840, card pad 8); the mechanism isn't named |
| row 5, §2.5b STUCK over 101 poses (whole viewport-law file) | stuck 52/48, pinned-out 0 | rail **stuck 52, pinned-out 0**; dock **stuck 48, pinned-out 0**, both engines. The dock's forgiven rows now name `size` / `level Easy` | reproduced |
| row 6, §2.6 ladder (`pass6/instruments/sticky-ladder.mjs`) | lag 2 → 1 | proto `pencils` **lag 1** (`static·rel/0 → sticky/1 → sticky/1`) at 4 of 4 engine × cell. Control: `pencils` unreachable (the ladder only sees `new game`, lag 0). viewport-law whole file: **28 passed / 4 failed, exit 1**, the four §2.6 sync reds (:630, :665 × 2 engines) | reproduced. The row stays red as the lane declares |
| row 7, COST focus contract; row 8, cross tap (whole mobile-affordances file) | 24/24 | **12 + 12 passed, exit 0** | reproduced; but see §3 |
| row 9, ring on the foot at coarse 1280 (`Clear the board`, keyboard, DPR 2, **two bare photographs**) | foot dark 3.338 · 0.216 / 0.264 | proto foot dark **3.338 · fracUnder3 0.216** chromium / **0.264** webkit (both photographs identical); light 4.188 · 0.165 / 0.129. **Control, same verb (on the card):** chromium dark **15.553 · 0**, light 3.675 · 0.115; webkit dark **1.867 · 1.0**, light 2.147 · 1.0 | reproduced; control numbers are new (§4) |
| π, whole DOM outside the case (ancestry-keyed, computed paint + rect, control-vs-control arm), rail1440 / dock390 shut / coarse1280 × 2 themes × 2 engines | board, cell and wordmark identical | **rect 0, paint 0** in all 12 cells. One extra zero-paint structural node in proto (the quick-set/fold wrapper index shift the lane declared). Control-vs-control 0/0/0 | holds |
| filterBudget, built dist | 12/12 filter-census | computed `filter ≠ none` **25 light / 27 dark** and SVG `<filter>` **15**, proto = control in every cell, both engines, both themes. The dark +2 is the inherited `crayon-heart` row that the chair booked as the fold's first pick | holds |
| M16 | 0 | `check-copy-register` bare **0** (0 dashes, 0 unadmitted) | holds |
| @property | 0 | `check-property-block` (pass-6 copy, against my build) **0**: names unique, one block per home, every ladder inherits; served 47 registrations, stamp `index-BBBYNWxB0Bv8.js` | holds |
| undefined-token census | 3 findings + 1 STALE; 0 + 1 with the PROPOSED rows | chair's copy **exit 1**: `--tap-floor` ×2 (ConfirmRibbon.vue:140/141) and `--washi-tag-h` (GameControlPanel.vue:1855) + the STALE `--refuse-dur` | reproduced; the PROPOSED diff is in A.3's form |
| static battery | all 0 | `lint:lanes` 0 · `lint:theme-tokens` 0 · `lint:sleep` 0 · `test:e2e:projects` 0 · `check-pw-projects` 0 · `eslint .` 0 · `npm run lint` (scoped prettier) 0 · `vue-tsc -b` 0 · vitest `src/games/shared` **34 files / 429 tests** exit 0 | reproduced. Control: the chair's record, 0s |
| zone-grammar, whole file | 35 passed, 1 skipped, exit 0 | chromium **17 passed, 1 FAILED** (the new CDP inset row), webkit 17 passed, 1 skipped: **exit 1** | **not reproduced** (§2) |

---

## 1 · `check-tape-foot` is cured for its 23 plants, not for the class (15 of 15 new breaks GREEN)

The lane's re-cut is real: B1–B8, X1, X2 and FAINT all red now, and clause 3 became a whitelist on every rule whose
selector names `.bar-frame`. The rest of the gate is still an enumeration:

- clause 4 lists the props it forbids on `.action-bar`/`.action-verbs`/`.card-foot`;
- clause 1 reads only `padding-bottom` on the literal `.card-foot`;
- clause 3's tag check reads only the lip's own tag.

I fed `check()` one-line regressions in memory, with the tree untouched (`instruments/tape-foot-breaks-k.mjs`). Each
breaks the edge or the inset, and every one is **GREEN**:

| break | gate | on paint (390×844 dock, DPR 2, frame-hidden minus shown) |
|---|---|---|
| K1 `.action-bar { overflow: hidden }` | GREEN | frame ink **6944 → 0 px** chromium, **6890 → 0** webkit (the outset frame lies wholly outside the bar's padding box) |
| K2 `.action-bar { contain: paint }` | GREEN | **→ 0 px** both engines |
| K4 `.action-bar :deep(.outline-svg) { display: none }` | GREEN | **→ 0 px** both engines |
| K9 `.card-foot { overflow: clip }` | GREEN | top side **3065 → 122 px** chromium, **3068 → 121** webkit (the top stroke is clipped away) |
| K3 `filter: opacity(0.15)`, K11 `clip-path`, K12 `mask-image` on `.action-bar` | GREEN | (class of K1/K2) |
| K5 `.action-bar > :first-child { visibility: hidden }` | GREEN | (the descendant/structural selector class of K4) |
| K10 `<template v-if="false">` wrapped around the lip | GREEN | (the lip unmounted; B3 by another spelling) |
| K6 `#card-foot { padding-bottom: 0 }` · K7 `.card-foot { padding-block-end: 0 }` · K8 `.card-foot { padding: 0 }` · K14 `.drawer-case .card-foot { padding-bottom: 0 }` · K15 `calc(0.75rem + env() − 0.75rem)` | GREEN | the inset clause's subject by another selector or longhand; the pad is gone |
| K13 `#card-foot { z-index: 0 }` | GREEN | clause 2 by an id selector |

The paint-reading e2e row (zone-grammar M18, coverage ≥ 0.9 on four sides + core median ≥ 3.0) would catch
K1/K2/K4/K9. It is a local instrument, though, and CI is browserless (O-12), so in CI the edge still has a witness that
passes the fault. LAWS P5 says: "a gate that enumerates plants is cured for those plants, not for the class — key on
the rule's SHAPE." The re-cut to earn clause 1 and clause 4:

- read every rule whose selector's SUBJECT resolves to the foot (`.card-foot`, `#card-foot`, compounds), and every pad
  longhand and shorthand (physical and logical);
- whitelist the bar's and foot's own props the way clause 3 does, so any `overflow`, `contain`, `clip-path`, `mask`,
  `filter` or `opacity` reds;
- treat any rule whose selector descends from `.action-bar` into the frame's subtree as reaching the drawn layer;
- make clause 3 read the lip's ancestor tags inside the template, not only its own tag.

K1–K15 then go into `--self-test` as plants.

## 2 · The new CDP inset row reds the correct tree 4 of 7 times: a one-shot photograph over a boiling case

`zone-grammar.spec.ts:672` photographs the foot with the frame shown and then hidden, and takes the LOWEST changed row
as the frame's lowest ink. The drawer case's own outline boils on the shared beat, and the spec sets no PRM:

- **The transient, measured.** I photographed the unchanged foot twice, 150 ms apart (`critic-boil.mjs`). **7 of 8**
  pairs differ by 3–8 px, all at **y 843**, the case's bottom stroke.
- **How it reds.** When the beat ticks between the two shots, the row reads `lowestInk 843` and reds (`line − 843 =
  −33`). That happened in my whole-file run and in 3 of 6 `--repeat-each` runs: **4 of 7 red**.
- **Why the NEG proves nothing.** The same transient makes its negative control (pass 5's `max()`) red for the wrong
  reason. Whenever the beat ticks, the NEG is green whatever the pad.
- **Why the lane saw 35/35.** It was a lucky draw.
- **Which law it breaks.** LAWS P5: "a painted minimum takes a SECOND bare photograph (a one-shot minimum reds on a
  transient ground pixel)".
- **The cure.** Intersect two frame-OFF photographs (or park the beat with PRM, as my probe did: 805.5 every time), and
  key the lowest ink on columns under the bar's own x-span.

## 3 · COST's lapse steals focus (a new defect the COST row can't see)

`arm()` now schedules `keepAsk` for the lapse, and `keepAsk` focuses the asking verb whatever `activeElement` is at the
time. `onFocusOut` keeps the question standing while focus moves inside the wrap or the bar, so a keyboard reader who
has moved on still gets pulled back 2.5 s later (`critic-crit.mjs lapse`, 390×844 hasTouch, the board dirtied by a
typed 5):

| arm | engine | Enter on Deal → | Tab, Tab → | the question | after 3.2 s |
|---|---|---|---|---|---|
| proto | chromium | `keep` | `deal` → **`Normal`** (a difficulty chip, in the panel) | still standing | **focus on `Deal a new board`**: stolen |
| proto | webkit | `keep` | `<body>` (Tab skips buttons) | still standing | focus on `Deal a new board` (a return from body, arguably right) |
| control | chromium | `Press again…` | `Normal` | lapsed | stays on `Normal` |
| control | webkit | `Press again…` | `<body>` | — | stays on body |

The mobile-affordances COST row tests Escape only. It never exercises the lapse or a move-on, so it can't red this.

- **The cure.** On the lapse, return focus only when `activeElement` is inside the ribbon or is `<body>`.
- **The row.** A lapse row with a Tab-away arm, whose negative control is today's tree.

Pass 5 cleared on lapse with no focus move, so this is new in pass 6. It also moves focus on a timer, which is the
class of context change the focus contract exists to prevent.

## 4 · Findings the lane did not report, and readings that change a row

- **The ring on the foot loses to the control in chromium dark.**
  - The same verb (`Clear the board`, coarse 1280) reads **15.553 · 0 % under 3** on the control's card in chromium
    dark, and **3.338 · 21.6 %** on the proto's foot.
  - In webkit the control is WORSE (1.867 · 100 % dark, 2.147 · 100 % light), and the proto clears it (3.338 / 4.188).
  - The row passes the median. The fraction is not bounded against the control; LAWS P5 bounds a fraction by the
    control's own + slack. The chromium-dark delta belongs in the row as a stated regression with both numbers, or the
    foot's ring ground is cured.
- **The coarse note row has no in-run negative control.** `zone-grammar` "no foot note reaches the page at coarse
  1280×800" is born-RED only against another dist (pass 5's). The fine row has an in-run NEG (unpaid berth); the coarse
  row doesn't, and it reads 3 of the foot's 5 noted surfaces (share's note and the invite's `berth-note` go unread).
  Proposed in-run arm: a style tag that forces `.action-bar .washi-label { display:block; opacity:1 }` has nothing to
  mount on this tree, so the discriminator must be a mount. The honest form is a unit row on `useNoteBerth` beside the
  e2e row.
- **The junction's residual column is a corner, not a well.** All four wells and the lip span x 4–840 at land844 (card
  pad 8, outset 4). The zero column is the frame's outermost device-px column, x 840.5 (land) and 386.5/3 (dock), where
  the lip's radius-3 corner turns down beside the well's faded side stroke. It shows at **8 of 24** poses, not "one
  pose per cell".
- **c3 was re-banked byte-identical after the chair's sweep deleted it** (74,908 B, 62 % of the lane's new bytes). It is
  a lawful one-variable pair (`.quick-frame` display) and v5 §9 lists it, so the chair decides whether it is kept.
- **§2.6.** The lane's claim that a scroll event "is already dispatched once per frame, before that frame's rAF
  callbacks" holds on the numbers (lag 1, both engines). The SYNC read is still static, so the landed row stays red
  until the chair's settle, as declared.

## 5 · Constraints, checked

| constraint | verdict |
|---|---|
| M16 | **PASS**: check-copy-register bare 0 |
| filterBudget 9, built dist | **PASS**: 25/27 css + 15 svg, proto = control, both themes, both engines (the dark +2 is inherited, and the chair booked it) |
| AA from painted bytes | **PARTIAL**: the lip 8.31 / 8.99 core median (lane; the M18 row reproduced 8.305 in my run). The ring's worst ground (the foot, coarse1280 dark) is 3.338 with 21.6–26.4 % under 3, below the chromium control's 0 % (§4). Card ground ABSENT is structural (0 focusables abut it), which I accept as the closure |
| π vs `74a2b5d9` from computed paint | **PASS**: rect 0 and paint 0 in 12 cells, with a control-vs-control arm; the landscape tab +79.15/+79.30 is declared (§6.3's one row) |
| W2's landed mechanics | **PASS** with the §2.6 sync reds declared; the dock sheet SLIDES (polled to rest in every row) |
| decided history (r0/R6) | **PASS**: no r0 path written; §2.5/§2.5b/§2.6 and the census rows are PROPOSED diffs; R7 I2–I4 unmoved |
| @property law | **PASS**: check-property-block 0 |
| undefined-token census | **PASS as declared**: 3 findings on the chair's copy, each with a PROPOSED A.3-form row |
| ballot pairs, one variable | **PASS** for c3 (quick set) and c4 (T9-B12, the lip's three props on one build variable; the naked `i` and the 56 px berth both show in both arms). c1 is a multi-variable FORM frame, captioned as such (T9-B13). LIFT has numbers only, and the cap is spent (c1, c3, c4 + pass-5 c2 = 4 cited) |

## 6 · Checklist

- **Gates that cannot fail**: **HIT**.
  - `check-tape-foot` is green on 15/15 new breaks, four of them paint-verified erasures (§1).
  - The CDP inset row's NEG is green for the wrong reason whenever the beat ticks (§2).
- **Masked fallback / transient**: **HIT**. A one-shot photograph pair takes the case boil for the frame's ink, so the
  row reds 4/7 on a correct tree (§2).
- **The constraint it forgot**: **HIT**. The focus contract's lapse moves focus the reader has already moved (§3). The
  ring fraction isn't bounded against the control (§4).
- **The pixel it moves that it did not declare**: not hit. π holds, and the tab is declared.
- **Unverified gestalt**: narrow. The junction's corner column shows at 8/24 poses (declared as "one column", but not
  at its frequency).
- **Vacuous convergence / spec cites itself**: not hit. The STUCK predicate carries a vacuity red (> 10 stuck poses),
  and I reproduced it (52/48).
- **The elegant-reduction trap**: not hit this pass. "The pad stacks on the inset" is proved on paint at 34 px.
- **Legacy aliases / consumer-less substrate**: not hit. `landscapeFlank` and the berth are module singletons with
  consumers, and the rAF deferral is deleted along with its cancel.
- **The generic default**: not hit.

## 7 · Strengths (reproduced)

- **One regime for berth, mount and reveal.** 0 notes mount at coarse ≥1024 in both engines. The fine berth keeps them
  −26…−5.7 inside the case, with an in-run unpaid-berth NEG (+17.92/+38.26/+16.79).
- **The foot stands on a real inset on paint.** Pad 46, bar 798, ink 4.5 css above the inset line at 34 px (was −7).
- **The junction goes from 0 to 6.5–10 css at 0 layout cost** (a `border-image` fill with an inline outset), at 16 of 24
  poses, both engines.
- **§2.5b is a STUCK census over 101 poses** with a vacuity guard (stuck 52/48, pinned-out 0), and the forgiven rows
  are named by `aria-labelledby`.
- **The release lands in the jump's first painted frame** (lag 2 → 1, both engines). The mechanism is a deletion.
- **The pass-5 plant is cured** (8/8 red), and the M18 row now gates paint with X1/X2/FAINT in-run.
- **Two stale-red estate rows found and re-cut**, and the cross tap measured instead of inspected (registry-v5 §2.2's
  "same dead tap" refuted on TAPE's tree).

## 8 · Open gaps (each closable)

1. Re-cut `check-tape-foot` on the rule's shape, as the §1 re-cut says. K1–K15 go in as `--self-test` plants, run in
   the same batch.
2. Make the CDP inset row immune to the case boil: two bare photographs intersected, or PRM, and the lowest ink keyed
   to the bar's x-span. Show 0 reds over ≥ 10 repeats with the `max()` NEG red on every repeat.
3. Gate COST's lapse to return focus only from inside the ribbon or from `<body>`, with a lapse + Tab-away row whose
   negative control is today's tree. Chromium today: focus pulled from `Normal` to `Deal a new board` at 2.5 s.
4. State the foot ring's chromium-dark loss against the control (3.338 · 21.6 % vs 15.553 · 0 %) in the ring row, or
   cure the ground. Bound the fraction by the control's + slack per engine.
5. Find the corner column's mechanism (x 840.5 / 386.5 / 3; 8 of 24 poses at 0 css) or caption it in the B13 frame
   with its frequency.
6. Give the coarse note row an in-run discriminator (a unit row on `useNoteBerth`'s one query, or an e2e arm that
   remounts) and read share's note and the invite's `berth-note` too.
7. §2.6: the chair lands the settle (booked). The lane's ceiling-1 PROPOSED and a frame-based `pub30` plant go with it.
8. COST's three grafts (ARMED as the third berth path, the input split, the pointer-agnostic ask: fine 1440 still clears
   in one click) are carried for the second pass as W1/U-10 rows. The "face is the button's air" N/A needs the chair's
   ruling.
9. The first tape −4.42/−4.41: LIFT a (Δseal 0) vs as built, framed on one payload when a crop slot frees, or landed.
10. The coarse-landscape seal: the chair defines the cell (`seal.mjs` times out at 844×390, where the card is behind
    the tongue) or retires the row.
11. Carried from the lane, unchanged: FACE's case-wide gate on this tree, the G2 leak sweep, DPR 3 on a device, the /8
    reader, M16's foot arm (FACE's crib), G-INFO's co-sign on `.legend-fold { contain: layout }`, T9-B14's `i`, intake
    rows 21 and 22.

## 9 · Cross-pollination

- **Every drawn-edge source gate** (the chair's R3, FACE, RULE, SELF, LIVE): `overflow: hidden`/`contain: paint`/
  `clip-path` on the host box erases an outset frame entirely. A source gate must whitelist the host's props, not list
  the forbidden ones.
- **Every painted row that differences two photographs near a boiling outline** (the case, the wells, the board): take
  two OFF photographs and intersect them, or park the beat. A case boil puts 3–8 changed px on its stroke in 7 of 8
  pairs 150 ms apart.
- **RULE (shares `useTwoTap`) and every focus-return contract**: a timer-driven focus return must check that the reader
  is still in the question.
- **FACE and RULE rings on the foot**: the same verb reads 15.553 on the control's card and 3.338 on the foot in
  chromium dark, and 1.867 → 3.338 in webkit. Each foot-bearing tree reads its ring against the control, per engine.
  The mechanism of the chromium delta (the ring treatment or the ground) is unread.
