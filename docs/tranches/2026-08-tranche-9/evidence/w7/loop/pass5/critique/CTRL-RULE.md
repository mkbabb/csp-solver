# T9-W7 · pass 5 · CRITIQUE · CTRL-RULE — the ruled page

I wrote neither the charter nor the prototype. I re-measured on the lane's own work tree
`wf_f72f3b5a-83a-28` (detached `74a2b5d9`, 30 M + 3 untracked, +1769/−1227, unchanged at my return).

**Rig.** I rebuilt the tree myself, with scratch outside it (a two-line `.mts` config and a private
cacheDir under my scratchpad, outDir in scratch). The result is `index-BEfGHg9Q2Vmx.js`. The lane's
`dist/` is `index-WZNIEzYskWke.js`. I diffed the two CSS bundles: they differ ONLY in App.vue's
scoped id (`data-v-882496c8` vs `data-v-2ae8d6d8`), the `prettier --write` the lane ran after its
build. The lane's dist is stale by whitespace and nothing else.

I served my dist on `127.0.0.1:4236` and the shared `w7-control` dist on `:4237`
(`index-CubiZsMVSwTc.js`), both verified by asset hash. Both were killed by recorded PID (listeners
65339/65346, parents 65292/65293). My scratch PW config dir `web/frontend/.rulecrit/` was deleted,
and the work tree's `git status` is product files only.

Every browser row deals the lane's encoded payload `ATMuNTMw…MDc5`, and both arms read back the
same 30-given set at every cell. The pass-5 advance was read as `git diff` of the tree against
`pass4/prototype/CTRL-RULE/pass4.diff` applied to a `git archive 74a2b5d9`. Ten files moved this
pass; `GameControlPanel.vue` moved by 332 lines.

Instruments are in `critique/CTRL-RULE/instruments/`, all six mine. Readings are in `readings/`,
with the battery in `critic-battery.txt`. No crop is banked: every claim below is a number.

---

## 0 · Numbers I re-ran myself (both engines unless marked)

| row | chromium | webkit | lane's | verdict |
|---|---|---|---|---|
| card `scrollWidth − clientWidth`, 8 cells (1024/1280/1440 fine, 1280 coarse, 390 c/f, 320 c, 844×390) | **0** everywhere; control 0 except **64** at the 1280 coarse rail | 0 everywhere; control 64 (1280 c), 1 (320 c) | 0 at 11 cells | REPRODUCED |
| π desk 1024/1280/1440 light: masthead, wordmark, tab, cell, board, toggle, case | Δ 0.00, paint + tag identical, control-vs-control noise 0 | same | Δ 0.00 | REPRODUCED |
| **π 1280×800 COARSE rail** | masthead/wordmark/tab/cell/board **dx −35.19**, case **+70.38** wide, noise 0 | same | −35.19 / +70.38 (gap 2) | REPRODUCED, a constraint row (§1.1) |
| case top over the masthead, 390×844 FINE | **26.91** (control 3.69) | **26.2** (control 3.2) | 26.91 / 26.2 | REPRODUCED (§1.2) |
| same, 390×844 coarse | −3.88 (control 5.73) | −4.58 (control 5.42) | same | REPRODUCED |
| card clientHeight lane/control | 501/576 · 532/608 · 564/640 · 540/628 · 544/595 · 264/352 · 224/302 | same (control 591 at 1280 c: its scrollbar) | same | REPRODUCED |
| W2 §2.4, toggle HOVERED ∩ every live control in the case, 7 desk cells × {direct, live resize from 1440×900} | **0 px²** at 14/14; head-clear 12 px (0 at 1024×1366) | 0 px² at 11/11 read (partial, incident 1); head-clear **13 px** at 1280×720/1366×768 | 0 at 11 cells | CURED, and it holds beyond its one gated cell |
| deal's question at 390×844 coarse | ∩ **0**; question 11.19 below the verb's top | ∩ 0; 11.19 | gap 0 | REPRODUCED |
| **my break**: the asked verbs un-hidden by CSS only, no DOM move | ∩ **0.7114** (reds alone) | **0.7114** | — | the ∩ clause has teeth for deal on its own |
| keep keeps the board / the answer deals a new one / keyboard arm → `keep` / Escape → `Deal a new board` | all true | all true | 20/20 | REPRODUCED |
| **cross tap**: deal asking → tap Clear; clear asking → tap Deal | the second verb is visible, enabled, and `elementFromPoint` = itself; **the tap does nothing** (ribbons 1, board unchanged) | same | not measured | NEW DEFECT (§1.4) |
| same cross tap on the CONTROL `74a2b5d9` | the second tap ARMS (sublabels `sure?\|…\|sure?`) | — | — | the lane's tree regresses the control |
| CDP `setSafeAreaInsetsOverride` → `#card-foot` padding-bottom | lane 34 → **34px**, 0 → 2.4px; control **2.4px** at 34 | — (source arm only) | same | REPRODUCED, discriminating |
| **foot rule painted, my CORE statistic**, DPR 2, scroll end, ground = paper (L 0.982 / 0.006) on both sides | light, best pixel **3.530** · core@90 3.365 · core@70 3.048 · **core@50 worst 2.672, 26.1 % of columns < 3** (390 c) / 2.729, 21.9 % (1280 f) · dark worst ≥ 3.943, 0 % | light core@50 **2.724, 20.5 % / 22.4 %** · dark ≥ 4.05 | 3.530 / 4.364, "0 % under 3:1" | the lane's 0 % is a BEST-PIXEL CEILING (§1.3) |
| same at **DPR 1**, chromium | light 1280 fine: core@50 median **3.063**, **42.2 %** < 3; core@70 16.8 %. 390: core@50 median 2.712, 96.4 % | — | — | §1.3 |
| lines-floor row as shipped (1280×800) | min in-card 52.27, fold 101.08 ≥ 31.07 | same | 52.27 | REPRODUCED |
| **my break**: the foot's `svg.ruled-line` DELETED | the row stays **GREEN** (fold falls back to the foot's box: 130.23) | GREEN | — | the M18 edge has no holding gate (§1.5) |
| **my break**: `.sun-moon-toggle:hover{scale(1.25)}` | `zone-grammar:731` stays **GREEN**; the hovered box overlaps the first chip **5.7 × 126.8 px** | GREEN; 6 × 126.8 | — | the lane's :731 is circular (§1.6) |
| undefined-token census, src, comments stripped, tree vs control | **9 vs 5**: +`--washi-tag-top/-lift/-gap/-inset` | — | not run | NEW (§1.7) |
| e2e whole spec files `viewport-law`, `zone-grammar`, `visual-regression` on my dist | **46 passed, exit 0** | **45 passed, 1 skipped, exit 0** | 105 / 103 over 12 files | REPRODUCED for these three |
| filter census (`playwright-throttle.config.ts`, both projects) on my dist | 12/12, exit 0 (budget 9 exact) | | 67/67 incl. others | REPRODUCED |
| bare: `check-copy-register`, lint:copy, lint:lanes, lint:theme-tokens, lint:sleep, lint:motion, test:e2e:projects, check-pw-projects, font-coverage, `npm run lint` (prettier), `eslint .` | all **exit 0** | | all 0 | REPRODUCED |
| vitest `src/games/shared` | 34 files / 430 tests, exit 0 | | 68 / 831 overall | REPRODUCED for the touched dir |
| ConfirmRibbon.vue vs TAPE's pass-5 tree `-27` | md5 `bd205599…` both | | byte-identical | REPRODUCED |

---

## 1 · GAPS: what holds the number (each closable, numbers attached)

### 1.1 · π breaks on five unclaimed surfaces at the coarse rail (a constraint, not a note)

At 1280×800 with `hasTouch`, the masthead, wordmark, drawer tab, board cells and board host move
**−35.19 px** in x in both engines, with control-vs-control noise 0. The case is **+70.38** wide
(224 → 294.38). Chair §6.4 says "the foot takes the case's width and never gives it one". This
pass made `contain: inline-size` fine-pointer-only, and the foot's own max-content at coarse is
70 px wider than the control's bar there, because the verbs regained 0.5rem of padding and the
foot adds `--card-pad-x`. The control's 64 px sideways scroll at that cell is cured, but the cure
spends π on surfaces the family does not claim.

**Close:** hold the case at the control's 224.00 at 1280×800 coarse (π 0.00 on the five surfaces,
both engines) with overflow 0. For example, the foot contained at coarse with the verbs sized to
fit 224, or the rail's stacked field as the ruler. Ship an e2e row with its negative control, the
current tree, reading −35.19.

### 1.2 · 390×844 FINE: the case rides over the masthead by 26.91 / 26.2 (control 3.69 / 3.2)

This is worse than pass 4's 10.86. The mechanism is THIS lane's: the foot left the scroll content,
so the case is content 587 plus foot 74.14 against the sheet cap 618.39. The case grew **23.22**
(the tab moves −23.22 with it) and hits the leader's cap. The cap bounds the damage but did not
cause it. "Report, do not tune" was the charter's word for a 10.86 inherited from the cap; a 16 px
worsening from the family's own move is the family's row.

**Close:** at 390×844 fine the case top sits no higher over the masthead than the control's
3.69 / 3.2. Either the card's cap subtracts the foot at fine phone widths, or the leader's
`--sheet-chrome` is re-cut with this number cited.

### 1.3 · The light rule's 1.4.11 is a best-pixel ceiling (LAWS P4 / registry §2.12)

The foot rule paints `color(srgb 0.149 … / 0.55)` on paper L 0.982. Its fully inked pixel IS
3.530, a structural ceiling that no pixel can exceed. Every antialiased pixel is below it. The
lane's per-column statistic is the column's most-contrasting pixel, and its sensitivity row
(worst / p10 / p30 / median of those maxima) is not the LAWS row (50/70/90/100 % of ink mass).
Under the section's adopted CORE statistic (chair §2.4: pixels ≥ 50 % of the column's max):

- **DPR 2**: light worst **2.672 – 2.729**, **20.5 – 26.1 %** of columns under 3:1, both engines
  and both cells. Clean at ≥ 70 %.
- **DPR 1** (a desk monitor): 1280 fine core@50 median **3.063** with **42.2 %** under 3:1, and
  16.8 % under even at core@70.
- Dark clears everywhere (core@50 worst 3.29 at DPR 1, 3.94 at DPR 2).

The same ink draws the seven page rules, so the 3 px vs 2 px ballot rows (3.53/3.304 vs
3.347/2.338) are best-pixel figures too.

**Close:** re-read the rule, all seven page rules and both weights with the core statistic at
DPR 1 and 2, both engines, and state the pass/fail under the section's statistic. Either the rule
ink rises (the alpha, not the width) or the row says, with numbers, that 1.4.11 is not claimed for
a decorative rule, and the owner sees it in the ballot.

### 1.4 · NEW: while a question stands, the other guarded verb is a dead tap (regression vs `74a2b5d9`)

With deal's question in deal's row, **Clear stays visible, enabled and hit-testable**
(`elementFromPoint` returns it). A tap does nothing: no ribbon change, no board change, no
feedback. The reverse holds too (clear asking, tap Deal), in both engines. The cause is
`useTwoTap`'s `if (askingAct.value) return;`. In pass 4 the foot's question hid the verbs, so a
Clear could not be tapped while deal asked; the in-row berth (the cure for 1.3 of the pass-4
record) exposed it. On the control the second tap ARMS the second verb (both sublabels read
`sure?`). The ∩ gate counts Clear as a "live control" it does not cover, and the census cannot
see that the control is dead.

**Close:** while one question stands, a tap on another guarded verb either re-targets (the
standing question yields and the tapped verb asks, the control's behaviour) or the verb is
visibly and semantically inert (`aria-disabled`, muted ink). Add an e2e row, both directions,
both engines, whose negative control is this tree (ribbons 1, board unchanged, zero feedback).

### 1.5 · The M18 edge has NO holding gate on the tree

With the foot's `RuledLine` deleted at runtime, the lane's lines-floor row stays GREEN in both
engines: its fold term falls back to the foot's BOX (`foot.querySelector("svg.ruled-line") ??
foot`), reading 101.08 → 130.23. That is a masked fallback inside a gate. The chair's R3 greens
on the same deletion (the lane's own `r3-breaks.txt`, break 1). No e2e or unit row names
`#card-foot svg.ruled-line` (grep over `e2e/` and `GameControlPanel.test.ts`). The owner's mark
is therefore held by nothing but the PROPOSED R3 re-cut, which is the chair's to land.

**Close:** an estate row asserting the foot's drawn edge is present and PAINTED (elementFromPoint
plus a byte read on the stroke), with the rule's deletion as its negative control, same batch.
Drop the `?? foot` fallback from the lines row, so a missing rule reds instead of measuring a box.

### 1.6 · `zone-grammar:731` is circular: the 1.08 is written three times and read zero times

`--toggle-foot` bakes the hover bound as `hit × 0.54` (App.vue). The gate's `box` term bakes it as
`t.height × 0.04`, read at rest. `DarkModeToggle.vue` owns `scale(1.08)`. With the hover raised to
**1.25**, the hovered toggle overlaps the first chip by **5.7 × 126.8 px** (chromium) /
**6 × 126.8** (webkit), and :731 stays **GREEN**, because both sides of its equality moved by
none. Only `viewport-law:287` (one cell, 1024×768) would see it. The row is the spec citing
itself.

**Close:** the gate reads the toggle's HOVERED box (hover it, poll the transform to settle) and
asserts the first live control starts below that. Its negative control is the scale plant above,
same batch.

### 1.7 · NEW: +4 undeclared tokens, a consumer-less substrate reading only its fallbacks

The undefined-token census (src, comments stripped) reads **9 on the tree vs 5 on `74a2b5d9`**:
`--washi-tag-top`, `--washi-tag-lift`, `--washi-tag-gap` and `--washi-tag-inset`. Their
declarations died with the wells in `GameControlPanel.vue`. `SheetWashiLabel.vue`'s `.washi-tag`
block (`var(--washi-tag-top, 0.3rem)` …) and its `anchor === 'tag'` branch survive, though
nothing renders a `tag` anchor any more (the lane's own unit row asserts 0 `.washi-tag`). The lane
edited this file this pass (deleting `[data-under-bar]`) and left the rest standing. It is the
CTRL-TABS graft's exact catch (registry §3.19), and the pass-4 critic missed it.

**Close:** delete the `tag` anchor variant and its block, or re-declare the four tokens with a
renderer. The census diff must read +0.

### 1.8 · Carried, declared by the lane, still open (numbers as re-read or as the lane's where not re-run)

- Mid-scroll, an in-card line crosses the foot's rule (−0.08 to −2.46; BoilDivider → foot
  0.47–2.5, −0.45 webkit 1280 coarse). The gate reads scroll END only.
- The coarse rail's names do not pin (`position: static`). This is a declared M03 loss and a U-10
  row for the owner, not a lane close.
- M12 membership is deal + clear here and four verbs on TAPE's tree. The two §10 trees' POLICY
  diverges, and the fold must pick one. Fill writes 50–56 cells on one tap (control 49–52), which
  is W1 §1.5's.
- T9-M16's foot arm (G1–G5 of FACE's crib on this foot) is unmeasured, as is `.info-btn`'s ring
  against the new edge (MRK-ABS 2.61/2.42).
- `@property` clause 3 AMBER on `--toggle-foot` and `--card-head-clear` (`initial-value: 0px`).
  These are the leader's rows.
- σ floor margin 0.002. INTAKE row 28's fallback clause (`scene.css` `var(--vv-height, 100dvh)`,
  inherited) is open. The flake is bounded (≤ 2.5 %/arm) but not named. The seal at 1227.5 leaves
  77.8 of headroom; that is the chair's one fold stamp.
- The pointer arm drops focus to `BODY` in both engines, because the tapped verb goes
  `visibility: hidden`. This is consistent with COST's contract and stated nowhere as the hide's
  consequence (pass-4 1.11, carried).

### 1.9 · Smaller rows (true, each a sentence to close)

- `publishHeadClear` is a NEW JS layout publisher, card top vs the derived foot. It re-introduces
  `Math.ceil`, the rounding TAPE's graft struck one function above it. The engines therefore split
  **12 px chromium / 13 px webkit** at 1280×720 and 1366×768. Publish it unrounded, or derive it in
  CSS.
- The B13 pair f1 changes the card's scroll-end pose between arms: arm A's 12 px pad shortens the
  card, so `players` is clipped on the right and whole on the left. The caption says the pad
  belongs to the arm but not that the content window moved. State it.
- R3 on the r0 probe literally requires `<HandDrawnOutline`. INTAKE row 27 admits
  `RuledLine/HandDrawnOutline`. The lane's PROPOSED re-cut widens R3 to admit its own arm (b).
  That is correct procedure (it is PROPOSED, not landed), but the reconciliation is the chair's
  row. On the current tree arm (b) is GREEN only through the fooled window.

---

## 2 · The checklist

- **gates that cannot fail / masked fallbacks**: the lines row's `?? foot` greens with the foot
  rule deleted (1.5); the chair's R3 greens on the same deletion (the lane's break 1). Not
  vacuous: the ∩ gate (my CSS-only break reads 0.7114 in both engines), the overflow row, the
  CDP inset row (control 2.4px at inset 34).
- **spec-cites-itself circularity**: `zone-grammar:731` (1.6).
- **the pixel it moves that it did not claim**: π −35.19 on five surfaces at the coarse rail
  (1.1). It is declared, but it is a violation of chair §6.4, not a claim.
- **the constraint it forgot**: AA from painted bytes under the section's core statistic, light
  arm (1.3); the undefined-token census (+4, 1.7).
- **consumer-less substrate / legacy alias**: the `tag` anchor variant of `SheetWashiLabel` (1.7).
- **unverified gestalt**: the cross tap was never driven (1.4), so the design's "the question
  stands in its verb's row" left two live-looking dead verbs.
- **Clear**: M16 (copy-register bare 0), filterBudget (12/12 built, both engines), π at the desk
  (0.00, paint and tag, noise 0), W2 §2.4 (0 px² at 14 desk readings incl. live resize), §2.6
  (lane's, green in the whole spec file both engines), no generic-default tell, decided history
  (the moved rows are PROPOSED, r0 untouched), the pre-return battery (11 static gates bare at 0,
  three whole spec files both engines at 0).

## 3 · Strengths (earned, reproduced)

1. **Seven pass-4 reds are cured, and every one reproduced in my hands in both engines.** The
   sideways scroll is 0 at 8 cells, where the control reads 64. §2.4 is 0 px², and holds at seven
   desk cells and after a live resize, well beyond the one cell W2 gates. Deal's question stands
   in deal's row (11.19 px from the verb's top, not 317). The rule/divider double band is gone.
   The seal is restored.
2. **The merge watch is met.** `ConfirmRibbon.vue` is byte-identical with TAPE's pass-5 tree and
   the arming machine is TAPE's shape. The one kept delta (focus home on a keyboard arm) is
   COST's contract, and I reproduced it: keyboard → `keep`, Escape → `Deal a new board`.
3. **The foot-on-the-inset row now discriminates.** CDP reads 34px on the lane and 2.4px on the
   control, as an estate row in `e2e/`, answering pass-4 1.9 in full.
4. **Honest self-reporting.** The lane's R3 break test indicts the chair's own re-cut with five
   cases. Its instrument bugs were declared (23 % false columns; the band start). The masthead
   and π regressions were reported rather than hidden.
5. **Clean battery.** Eleven static gates bare at 0, three whole spec files both engines exit 0,
   the census 12/12, and 430 unit tests in the touched dir.

## 4 · Convergence: **73**, and why not more

Pass 4 was 68. The seven cures are real, reproduced and gated with negative controls. What holds
the number:

- a π break on five unclaimed surfaces at the coarse rail (1.1);
- a masthead crossing the family's own move made 2.5× worse (1.2);
- a light-theme AA claim that is a best-pixel ceiling, with 20–26 % of columns under 3:1 at the
  core at DPR 2 and 42 % at DPR 1 (1.3);
- a new dead-tap regression against the control (1.4);
- the owner's mark (M18) held by no gate on the tree (1.5);
- one circular gate (1.6);
- a +4 undefined-token diff (1.7).

None is a missing primitive. Each closes with a measurement, a containment, a re-target rule or a
deleted block. **ADVANCE.**

First cures: 1.4 (the cross tap: it changes behaviour), then 1.5 (gate the edge), then 1.1 (π at
the rail), then 1.3 (re-read AA at the core, then decide the ink).

## 5 · Cross-pollination

- **CTRL-TAPE ← 1.4**: `useTwoTap`'s `press` returns silently on ANY standing ask. On TAPE's tree
  `deal` stays in the card while a foot question stands, which is the same dead tap. Drive the
  cross tap both directions.
- **CTRL-FACE (leader) ← 1.5, 1.6, 1.1, 1.2**: the M18 edge-existence row as an ESTATE spec; any
  derived geometry token reads the element's live transform, never a literal; §6.4's "never gives
  it one" is violated at the coarse rail by any uncontained foot; the `--sheet-chrome` cap at 390
  fine now carries a 23.22 px case growth.
- **Every painted-contrast lane ← 1.3**: a flat translucent ink has a structural best-pixel
  ceiling. A per-column MAX distribution is still a best-pixel reading; run the 50/70/90/100 %
  ink-mass rows and DPR 1.
- **Every lane that deletes a declaration ← 1.7**: run the undefined-token census DIFFED
  tree − control. A surviving `var(--x, fallback)` consumer of a deleted declaration reads +N
  there and 0 in a per-file lint.
- **Every gate with a `?? <box>` fallback in its census ← 1.5**: a missing subject must red, not
  measure its container.

## 6 · Incidents (the critic's own)

1. I killed both servers while the WebKit toggle probe was still running its last three rows. The
   WebKit table is **11/14**, banked as `readings/critic-toggle-webkit-PARTIAL.txt`. Chromium is
   14/14.
2. My first scratch build failed: a `.ts` config outside the tree bundles as CJS, and
   `@tailwindcss/vite` is ESM. Renamed to `.mts`, it rebuilt clean.
3. I ran three of the lane's twelve spec files whole, not twelve. Its other nine are the lane's
   reading, not mine.
