# CTRL-TAPE · pass-7 adversarial critique (§10 controls: the tape, the band, the foot)

I wrote neither the charter nor the prototype. Every number below that isn't credited to the lane I took myself on
2026-09-24, in chromium and webkit, on my own servers. Box load (1-min) ran 20–64 over the session: 33.99 at the start,
64.06 at the peak, 47.42 at the ring read.

**The rig.**

- **Tree.** I built the work tree `wf_f72f3b5a-83a-27` myself (scratch ESM config, private cacheDir, `outDir` outside
  the tree). It reproduced the lane's identity **`index-C0UL6nygNq7X.js`**, served on **:4232**.
- **Merged.** A fresh `git archive 74a2b5d9` plus `pass6/integrate/s10.diff` plus the lane's `pass7-on-s10.diff`, built
  in scratch. It reproduced **`index-C3xGb3Gj9lX8.js`**, served on **:4243**.
- **Control.** The shared `w7-control` dist, **`index-CubiZsMVSwTc.js`** (`74a2b5d9`), on **:4233** with its own config.
  It was never edited, built or git-touched.
- **Pass 6.** The pass-6 critic's build, **`index-BBBYNWxB0Bv8.js`**, on **:4244** (the lapse born-RED and the in-case π).
- **Identity and payload.** Every port was verified by asset hash. Every probe row dealt PINNED_GIVENS
  (`?board=ATMuNTA4…`), and the givens read back `0:5,2:8,11:3,18:6,20:9` on every arm. keys-crib deals its own
  `?size=3&difficulty=EASY`.
- **Clean-up.** The servers were killed by recorded PID (npx/vite pairs 11832/11878, 12463/12491, 22398/22510,
  45845/46175), and all four ports read free. My PW config dir `.ctrl-tape-crit7/` was `mv`ed to
  `<scratchpad>/trash-ctrl-tape-crit7/`. No `rm` was used and nothing was committed.
- **The tree afterwards.** `git status` shows 28 M + 3 ??, product files only, as at the start.

My instruments are in `critique/CTRL-TAPE/instruments/`, and the summarised readings in `readings/`. I banked no frame.
I looked at the two standing ballot frames (p6-c1, p6-c4).

**Verdict: ADVANCE. Convergence 85% (up from 84).**

- **Advanced.** Five things are real, and I reproduced each to the hundredth in both engines:
  - G3 post-paint on the merged tree;
  - the inset row, cured of the boil flake;
  - the lapse focus theft, cured;
  - the flex column's in-case π of ≤ 0.02 px;
  - the regime composed.
- **Held down by one thing, for the FOURTH pass: `check-tape-foot` is cured for its plants, not for the class.**
  - All 14 of pass 6's K-plants red now.
  - **26 of 29 new one-line siblings stay GREEN**, and four of them erase or displace the foot on paint.
  - Two of the four revert this pass's own product seam, the flex column. That throws the verbs 162–285 px below the
    viewport (rail 1280×800 / dock 390×844), and CI (browserless) passes it.
  - The row-5 ring closes only on the lane's own re-parameterised probe. At the chair's default it is RED in WebKit on
    all four bands, in both themes.

---

## 0 · What I re-ran myself (both engines unless named)

| row | lane's claim | critic | verdict |
|---|---|---|---|
| **pass-6 plant first**: the pass-6 critic's K1–K15, re-pointed to pass 7's path-keyed overlay (pass 6's harness keyed `panel`/`scene`, which pass 7's `check()` would read as new, unparsed files) | in the self-test | **14/14 RED** (K10 lives only in the lane's self-test); live 0 fails | reproduced |
| `lint:tape-foot` bare (`--self-test`) | 54 plants red, live green | **54 red, live green, exit 0** | reproduced; but see §1 |
| row 1, keys-crib G3 post-paint, merged tree, whole file ×2 | 0 px 16/16; plant 49.36–50.89 | **0 px 16/16** (open and close, 4 cells × 2 engines × 2 runs; in-rAF also 0). Grow-the-case plant **50.89 / 49.42** (chromium), **50.89 / 49.36** (webkit). File **8 passed ×2, exit 0** | reproduced; cells 1280×800 and 1024×768 fine only (§4) |
| row 3, the inset row, `--repeat-each 6` | 10/10 per engine | **12/12 green**. Chromium CDP 34: lowest ink **805**, bar bottom 798, pad 46 (line 810), NEG `max()` 817, red 6/6. WebKit inset 0: **839**, pad 12, NEG 0.5rem 843, red 6/6. Not one reading moved across 12 repeats | reproduced; closed for this cell |
| lapse row, ×5 per engine; pass-6 dist ×2 per engine | 5/5 per engine; born-RED on p6 | tree **10/10**. Pass-6 dist **4/4 RED**, arm 2 (`Expected "Normal"`, `Received "Deal a new board"`), both engines | reproduced |
| row 5, the foot ring on four bands (the lane's `ring7.mjs` copy, coarse 1280, DPR 2, PRM) | ≥ 3.338 at station 8 | **Station 8** (the lane's PROPOSED pool) is GREEN: chromium light 4.145–4.188, dark left 3.338; webkit light 4.106–4.188, dark left 3.338. **Station 1** (the chair's instrument default) is **RED in WebKit on all four bands, both themes**: light 1.741 / 1.286 / 2.063 / 1.846, dark 1.717 / 1.232 / 2.073 / 1.703, exit 1 ×2. Chromium station 1 is green, but 39–50 % of stations read under 3. Plants 24/24 red | the lane's numbers reproduced to the thousandth. The closure is the lane's re-parameterisation (§2) |
| π inside the case, pass 6 → pass 7 (case, card, foot, bar, verbs, board, card client/scroll heights) | ≤ 0.02 px over 20 cells | **max \|Δ\| ≤ 0.02 at 22 cells** (11 × 2 engines: rails 1440/1280/1024, coarse 1280, short 1280×620, dock 390/430/360×800, land 844/812, 820×1180) | reproduced |
| π outside the case vs `74a2b5d9` (the pass-6 critic's ancestry-keyed whole-DOM probe, computed paint + rect, with a control-vs-control arm) | holds | **rect 0, paint 0** in all 12 cells (rail1440 / dock390 shut / coarse1280 × 2 themes × 2 engines), n 772. One tag delta (the declared structural wrapper). Control-vs-control 0/0/0 | holds |
| filterBudget on the built dist (`filter-census.spec.ts`, whole file) | not reported by the lane | tree **12/12 passed, exit 0**; control 12/12, exit 0 | holds (the lane owed this row) |
| M16 | 0 | `check-copy-register` bare **0** on the tree and on the control | holds |
| @property | 0 | `check-property-block` (pass-6 copy) GREEN on the tree (served 55 registrations, stamp `index-C0UL6nygNq7X.js`), the merged tree and the control | holds |
| undefined-token census (pass-6 copy) | 3 + 1 stale | tree **exit 1**: `--tap-floor` ×2 (ConfirmRibbon.vue:140/141), `--washi-tag-h` (GameControlPanel.vue:1849) + STALE `--refuse-dur`. Merged the same. Control 0 + 1 stale | reproduced. The PROPOSED A.3 rows are carried a second pass |
| row 12, apply | 0 / 0 | pass6.diff + pass7-delta.diff on a fresh `74a2b5d9` archive: **0**, and the result is byte-equal to the work tree's product files (every changed and untracked path `cmp`'d). `pass7-on-s10.diff` on 74a2b5d9 + s10: **0**. The delta alone on s10 fails at index.css:166 and GameControlPanel.vue:783, exactly as declared | reproduced |
| static battery, bare (tree / control) | all 0/0 except tape-foot 0/1 | `lint:tape-foot` 0/1 (no script on the control) · lanes, theme-tokens, sleep, `test:e2e:projects`, copy, motion, ink, theme-selectors, live-regions, catch, boundary, `npm run lint` (scoped prettier), `check-pw-projects`, `check-copy-register`, `eslint .`: **0/0** | reproduced. `lint:bands`/`lint:verbs` exist on neither tree |
| zone-grammar whole file (tree) | 18/18 per engine | **36 passed, exit 0** | reproduced |
| vitest `src/games/shared` (on an archive byte-equal to the tree) | 68 files / 831 (all) | **34 files / 429 tests, exit 0**, the same count as pass 6. The lapse has no unit row | holds |

---

## 1 · `check-tape-foot` is keyed on class names, not on the elements (26 of 29 new siblings GREEN; 4 move paint)

The re-cut is real. It reads every stylesheet and SFC block, `index.html` and `public/**`, unwraps `:deep()`/`:is()`,
whitelists the frame's layout, adds a CLIP clause, and carries 54 plants. But it decides "does this rule reach the
foot?" by asking whether the SUBJECT COMPOUND names `card-foot`/`action-bar`/`bar-frame`/`drawer-case`. It never asks
whether the selector matches the ELEMENTS. It also reads script writes for nine props, in three files, through one
syntax.

I fed `check()` 29 one-line regressions in memory (`instruments/breaks7.mjs`; the tree is untouched). Twenty-six stay
GREEN:

| break | gate | on paint (my probe; `readings/paint-breaks.txt`) |
|---|---|---|
| **F1** `.drawer-case { display: block }` (revert this pass's seam) | GREEN | dock 390×844: foot **1064.23–1143** against vh 844 (chromium), 1064.91–1143.67 (webkit); frame ink in view **6944 → 0** / 6890 → 0; verbs bottom 1128.61. Rail 1280×800 (merged): verbs bottom **961.78** vs vh 800 and the info glyph 78 px below the fold, both engines |
| **F2** `.controls-card { flex-shrink: 0 }` | GREEN | identical to F1 in both engines and both cells |
| F3 `.card-foot { flex: 1 1 0; min-height: 0 }` · F4 `.drawer-case { flex-direction: row }` | GREEN | (the same seam; not painted) |
| **S10** `.bar-frame { inset: 0 0 100% 0 }` (a WHITELISTED layout prop) | GREEN | frame ink **6944 → 0** (chromium), **6890 → 0** (webkit) |
| **S2** `.drawer-case > div:last-of-type { overflow: clip }` (structural subject) | GREEN | frame ink **6944 → 4000** / 6890 → 3943 (the top stroke clipped, K9's class) |
| **S14** `.action-bar { top: 2.875rem }` (the bar is `position: relative`) | GREEN | verbs bottom **829.61 → 875.61** against vh 844, so the verbs hang 31.6 px below the viewport; frame ink 6944 → 4120 / 6890 → 3448 |
| S13 `.card-foot { translate: 0 2.875rem }` · S15 `.card-foot { margin-bottom: -2.875rem }` · S16 `.action-bar { transform: scaleY(0) }` | GREEN | (S14's class: the bar moved into the inset band or off the fold) |
| S12 `calc(0.75rem + env(safe-area-inset-bottom) * 0)` | GREEN | arithmetic: the pad is 12 px under a 34 px inset, which is pass 5's refuted pose |
| S1 a second class on the foot's element + `.foot-x { overflow: clip }` · S3 `div:last-of-type { padding-bottom: 0 }` · S4 `[id="card-foot"] { padding-bottom: 0 }` · S5 `[class~="action-bar"] { overflow: hidden }` | GREEN | S1 = S2 on paint; S3/S4 = K6 on paint |
| S8a–e utility classes on the bar's element: `opacity-[0.15]`, `sr-only`, `blur-sm`, `contain-[paint]`, `translate-y-12` | GREEN | the header says "by any selector, utility class or inline style"; `UTIL_CLIP` matches `opacity-\d+`, never `opacity-[…]` |
| S9a `bar.style.filter = "opacity(0.1)"` in the panel · S9b `style.cssText` · S9c `setAttribute("style")` · S9d `classList.add("overflow-hidden")` · S9e a write from `App.vue` | GREEN | the header says "script style writes in the foot's owners"; the list omits `filter`, `display`, `mask`, `clip`, and every write that isn't `.style.x =` / `setProperty` / `Object.assign` |
| RED: S6 `:where(.action-bar)`, S7 CSS nesting, S11 `overflow: var(--nope, hidden)` | RED (8) | — |

**What this means.**

- LAWS P6 §F names the class: "keys on the SUBJECT COMPOUND … a renamed selector with a dead decoy all reach the
  subject", and "whitelists VALUES".
- The gate is on its FOURTH pass of "cured for its plants" (pass 5 B1–B8; pass 6 K1–K15; pass 7 S/F).
- The new finding is F1/F2. The pass-7 product seam (the case as a flex column, `.card-foot { flex: none }`, the cap
  moved to the case) has **no clause at all**. A revert passes CI and hangs the foot off the viewport.
- Locally, keys-crib and the inset row would see it: at the rail the verbs sit 161.78 px below the fold before any
  press. CI is browserless (O-12), though, and there the only witness is this gate.

**The re-cut.**

- Resolve the three subjects to the template ELEMENTS they live on: `#card-foot` in GameScene, `.action-bar`/`.bar-frame`
  in the panel.
- Ask of every rule whether its selector can match those elements or their chain. That covers an extra class, an
  attribute, `:nth-*`/`:last-*`, `:where()`, and nesting.
- Read VALUES on the whitelisted layout props: `.bar-frame` gets `inset: 0` and `position: absolute`, nothing else.
- Red any `top`/`translate`/`transform`/`margin-block-end` on the bar or the foot.
- Scan every script write tree-wide through the library's `census()` rather than a nine-prop list in three files, and
  add `cssText`, `setAttribute("style")` and `classList`.
- Add a clause for the column itself: the case `display: flex; flex-direction: column` with its cap, the card
  shrinkable, the foot `flex: none`, and no cap left on the card.
- Ship F1–F4 and S1–S16 as `--self-test` plants in the same batch.

## 2 · Row 5 closes on a probe the lane re-parameterised (the chair's default reds WebKit on all four bands)

- **What the lane's copy of `edge-bands.mjs` adds.** A PROPOSED `station` option: each station takes the best of
  `station` adjacent columns. At the chair's default (`station = 1`), the tree's foot ring reads **RED in WebKit, all
  four bands, both themes** (1.232–2.073), and 39–54 % of one-column stations sit under 3 in both engines. At 8 it is
  green.
- **Why the lane took 8.** It names the reason: the ring is dashed, and the gaps read 1.00. That's a physical fact.
- **What the pool gives away.** A station now passes if ANY one of its 8 columns clears 3. By the code's own
  arithmetic (`for (let k = s; k < s + station; k++)`, best of the window), a ring inked in 1 column of 8 reads the same
  core median as a solid one.
  - The row's plants (X6 bottom erased, X4 opacity, FAINT 15 %) red at both stations.
  - No plant thins the dash. So the pool is unproven against the one degradation it newly admits.
- **Against the control.** The control's ring on its card ground reads 1.0 on every WebKit band (no ring painted) and
  1.203 on chromium dark left/right. So the tree beats the control at both stations. That comparison is not a closure,
  though. LAWS C: "never re-word a gate to pass". The station is the chair's ruling (the lane's gap 2).
- **What I'd accept.** Station 1 with the fraction under 3 bounded per engine (the tree's own 0.39–0.54 + 0.05 until
  stamped), or station 8 with a 1-in-8 dash plant that reds it.

## 3 · The G3 re-cut is honest, and its negative is the case's cap rather than the seam

- **Reproduced.** 0 px post-paint and in-rAF on the merged tree, both engines. The grow plant `max-height: none` reds it
  at ~50 px.
- **What the in-rAF read shows.** It now reads 0 too. The flex column removed the pre-callback discrepancy, not just
  masked it.
- **What the row's negative covers.** The plant reds "the case uncapped". It doesn't red "the column reverted"; F1/F2
  are a different plant.
- **What my probe found.** Under F1/F2 at 1280×800 the verbs are already 161.78 px below the fold at rest, so the G3 row
  would fail for a different reason (a press on an off-screen glyph).
- **The cure.** Plant F1 in the same run, and assert the verbs' bottom ≤ vh at rest before the press.
- **§I.** The row's post-paint sampler (MessageChannel from rAF) is hand-rolled in the spec rather than the chair's
  `postpaint.mjs` `installSampler`. LAWS P6 §I makes a re-implementation a row. The mechanism is the chair's, so the
  numbers stand.

## 4 · Findings the lane did not report, and readings that change a row

- **Charter row 1's cells.** The charter asked for "both engines, 1280/1440 + 844×390". The spec reads 1280×800 and
  1024×768 fine. 1440 and 844×390 are unread, so row 1 is CLOSED at two of its three cells.
- **INTAKE-22 row 20 is claimed CLOSED as row 3, but its gate names more cells than row 3 read.** It names "0.625rem
  AND 0.75rem, at DPR 2 AND 3, 390×844 + 430×932 hasTouch settled, both engines".
  - The row reads 390×844 at DPR 2 only.
  - The WebKit arm is the flat phone (inset 0, NEG 0.5rem).
  - 430×932, DPR 3 and the 0.625rem arm are unread.
  - Row 20 stays OPEN.
- **INTAKE-22 row 23 is declared "cannot close: `e2e/tool-strip.spec.ts` exists on neither tree".** The row's substance
  still applies to the rows that DO exist:
  - every foot row carries a control that changes its verdict;
  - zone-grammar :323's control strikes a hand-placed `top: 100%`, not `display: grid` alone;
  - G11 is two-sided;
  - G13 asserts ink ≥ 2 with a control.

  Porting the substance to the spec that owns the foot is the closure. A missing file is not a state.
- **The lapse row's two arms pin the ribbon branch, not the body branch.** `lapseAsk` returns home when `activeElement`
  is `<body>`, which is WebKit's Tab-skips-buttons path (pass-6 critic §3). No arm drives it, and there is no unit row
  (vitest shared 34/429, unchanged).
- **No BANKED.txt sits beside `pass7-delta.diff` or `pass7-on-s10.diff`.** The sha1s are in the README only (LAWS P6
  §C: "a BANKED.txt … sits beside every bank"). The chair banks the tree, so this is minor.
- **The filter census was not in the lane's return.** It holds (tree = control, 12/12 both engines).

## 5 · Constraints, checked

| constraint | verdict |
|---|---|
| M16 | **PASS**: `check-copy-register` bare 0 on the tree and the control |
| filterBudget, built dist | **PASS**: `filter-census.spec.ts` 12/12 on the tree and 12/12 on the control, both engines |
| AA from painted bytes | **PARTIAL**: ring core medians ≥ 3.338 only at the lane's station 8. At the chair's station 1, WebKit is 1.232–2.073 (§2) |
| π vs `74a2b5d9` from computed paint | **PASS**: rect 0 and paint 0 in 12 cells with a control-vs-control arm; in-case p6 → p7 ≤ 0.02 at 22 cells; the 844 tab +79.15 / +79.30 is s10's declared row |
| W2's landed mechanics | **PASS**: the dock sheet is polled to rest in every probe; zone-grammar 36/36; viewport-law §2.6 declared, as in pass 6 (not re-run by me) |
| decided history (r0/R6) | **PASS**: no r0 path written; the frame is a `HandDrawnOutline` (R3); L1 untouched |
| @property law | **PASS**: `check-property-block` GREEN on the tree, merged tree and control; `--card-foot-h`'s block deleted with its publisher and dropped from REGISTRATION |
| undefined-token census | **PASS as declared**: 3 findings + 1 stale, each with a PROPOSED A.3-form row (a second pass carried) |
| ballot pairs, one variable | **PASS, no new frame**: p6-c4 (T9-B12) is one variable on one payload; p6-c1 is a FORM frame. The third arm is stated in numbers (2 headings vs 8), not framed (§G: "framed where it differs") |

## 6 · Checklist

- **Gates that cannot fail**: **HIT**.
  - `check-tape-foot` stays green on 26/29 siblings, four of them paint-verified:
    - S10: frame 6944/6890 → 0;
    - S2: → 4000/3943;
    - S14: verbs 31.6 px below the viewport;
    - F1/F2: foot 220–299 px below the viewport at the dock, verbs 161.78 below at the rail.
  - This pass's own product seam has no CI clause.
- **Spec-cites-itself / re-worded gate**: **HIT, narrow**. Row 5 is closed on the lane's own station-8 pool. The chair's
  default statistic is RED in WebKit (§2).
- **The constraint it forgot**: **HIT**.
  - LAWS §I: a hand-rolled post-paint sampler.
  - INTAKE-22 row 20's cells, claimed CLOSED, are unread (430×932, DPR 3, 0.625rem).
  - The charter's G3 cells 1440 and 844×390 are unread.
- **Elegant-reduction trap**: not hit. The flex column is a deletion (publisher and `@property` gone), and it's proved on
  paint (G3 0/16, π ≤ 0.02 at 22 cells).
- **Masked fallback**: not hit. The inset row's intersected pairs under PRM read identically across 12 repeats, and its
  negative reds 12/12 for the right reason.
- **The pixel it moves that it did not declare (π)**: not hit.
- **Vacuous convergence, legacy alias, consumer-less substrate, generic default, unverified gestalt**: not hit.
  `--card-foot-h` is gone from source, spec and registration (grep 0 outside comments).

## 7 · Strengths (reproduced)

- **The cap is one layout.**
  - `display: flex; flex-direction: column` on the case, and `flex: none` on the foot.
  - It deletes the ResizeObserver publisher and its `@property`.
  - G3 reads 0 px painted and 0 px in-rAF in 16/16, both engines. The in-case geometry moved ≤ 0.02 px at 22 cells.
- **The inset row is deterministic.**
  - PRM, two intersected on/off pairs, and the bar's columns only.
  - 12/12 identical readings (805 / 839).
  - The negative reds 12/12 for the right reason. Pass 6 was flaky 4/7.
- **The lapse returns focus only to a reader still in the question.** 10/10 on the tree, and 4/4 RED on the pass-6 dist,
  both engines.
- **`check-tape-foot` now reds every pass-6 K-plant (14/14) and reads regimes as one predicate** (R1–R5).
- **The foot's ring on four bands beats the control in both engines at either station** (the control's card ground is
  1.0 on every WebKit band).
- **Row 12's replay is exact.** The cumulative apply is byte-equal to the tree.

## 8 · Open gaps (each closable)

1. Re-key `check-tape-foot` on the ELEMENTS, per §1's re-cut, and add a clause for the flex column. The gate must red
   F1–F4 and S1–S5, S8a–e, S9a–e, S10 and S12–S16 in `--self-test`, in the same batch. Today it reds 3 of 29, and F1/F2
   hang the foot 220–299 px below the dock viewport with CI green.
2. Row 5: the chair rules on the station. Otherwise the lane either bounds the station-1 fraction per engine (WebKit
   station-1 medians 1.232–2.073 RED on all four bands today), or ships a 1-in-8 dash plant that reds the station-8 pool.
3. Row 1: read G3 at 1440×900 fine and 844×390 coarse, both engines. Add F1 as an in-run plant and assert that the verbs
   are in view at rest (F1 puts their bottom at 961.78 against vh 800).
4. INTAKE-22 row 20: read the foot's lowest ink at 430×932, at DPR 3 and at a 0.625rem pad, both engines. Until then,
   row 20 is OPEN, not CLOSED as row 3.
5. INTAKE-22 row 23: port its substance (a verdict-changing control on every foot row; :323's `top: 100%` control; G11
   two-sided; G13 ink ≥ 2 with a control) into zone-grammar.
6. Row 4, the junction: 1/24 zero column on the merged tree (chromium land844 frac 0.9, x 840.5; 8/24 on the tree). The
   mechanism is still unnamed, and the chair's wording of INTAKE-22 row 22 is still owed.
7. The lapse: an arm that drops focus to `<body>` (WebKit's Tab path) before the lapse, plus a unit row on `lapseAsk`.
8. keys-crib's post-paint read imports the chair's `postpaint.mjs` sampler (LAWS P6 §I) instead of re-implementing it.
9. The ballots' third arm (the integrated tree's 2 headings vs the tape tree's 8) framed when a crop slot frees, or
   stated in the ballot text by the chair.
10. Carried, unchanged:
    - the coarse note row's in-run discriminator (pass-6 gap 6);
    - COST's three grafts, unlanded for a THIRD pass;
    - LIFT for the first tape;
    - the coarse-landscape seal cell;
    - the G2 leak sweep;
    - the chromium-only golden config;
    - viewport-law §2.6 14+2F on the tree (16/16 merged);
    - the undefined-token census's three PROPOSED A.3 rows.

## 9 · Cross-pollination

- **Every lane on the shape-census library** (FACE CHECK 7, LEDGER's reserve law, WALK check 4, TIN GATE 4): keying on
  the subject COMPOUND misses an extra class on the element, a structural or attribute selector, and a whitelisted prop
  whose VALUE erases the edge. Resolve the subject to its template elements and read values. Four of TAPE's 26 green
  siblings erase or displace paint.
- **Every layout seam that replaces a publisher** (FACE's parked `--action-bar-h`: on the merged tree, `if (!keysFolding)
  publishBar()` still parks it): the flex column shows a cap can live in one layout with nothing to publish. The seam
  then needs a DECLARATION clause in CI, or a one-line revert ships green.
- **Every ring row** (LIVE, FACE, SELF): on dashed rings the station width decides WebKit's verdict (1.23–2.07 at 1 vs
  ≥ 3.338 at 8 on the same photograph). The chair rules once for the estate, with a dash-thinning plant.
