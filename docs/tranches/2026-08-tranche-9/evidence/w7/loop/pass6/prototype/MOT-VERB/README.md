# MOT-VERB · pass 6 PROTOTYPE

T9-W7 §13, the transition grammar, the section's second lane. Work tree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59`, advanced in place
on LADDER's pass-6 bank. At open it was write-tree **`53a73123`**: `74a2b5d9` + `pass5/prototype/MOT-VERB/pass5.diff` +
`pass6/prototype/MOT-LADDER/pass6-ladder.diff`, matching LADDER's return. At return it is write-tree **`3d25f02a`**:
`pass6-verb.diff`, 10 files, +701/−118, 57,984 B, apply-verified. The diff is uncommitted.

**The served arms**, each read by its `index-*.js` from the port, all on 127.0.0.1:

| port | arm | dist |
| --- | --- | --- |
| :4242 | **tree5** = the returned src | `index-ICe9_X4WHUBR.js` |
| :4247 | tree4 | `index-DLvZ2xI1Rcq9.js` |
| :4248 | control `74a2b5d9` | `index-CubiZsMVSwTc.js` |
| :4249 | main-HEAD | `index-ChSrVSqM0j8q.js` |
| :4243 | B23 arm (b) | `index-aSKggRqWKuhs.js` |
| :4244 | B21 arm (b) | `index-Co-Wvm_RuN_A.js` |
| :4245 | M19 `DECK_PIN="document"` | `index-CgMg5NJ_D7VI.js` |
| :4246 | plant P (the hold ablated) | `index-DFaXnaB5_He9.js` |

tree4 and tree5 differ only in `useCarouselGlide.ts`. Their CSS is byte-identical: 7 files, the same names. So the
GB3, beats and M15 paint rows read on tree4 hold for tree5.

**The payload** in every sudoku row is `encodeSudoku(3, <71 givens>, 81)`. It is read back as **71 `given clue`
aria-labels** (`fold-verb.spec.ts` asserts it).

**THE BOX WAS LOADED THROUGHOUT.** Load averages ran 57–200, where a quiet box is under 10. Every timing row below is a
loaded-box reading, interleaved with its control. None of them is the quiet-box read the gates ask for.

---

## 0 · Gaps first

1. **GB1 WebKit is NOT MET.** On the cold flip the tree reads 95–265 ms max, 4–7 frames over 34 ms, and dS 0.14–0.52.
   Main-HEAD reads 199–702 ms with 2–5 frames over 34, and the control 130–507. Chromium is also not met to the
   letter: 1 frame over 34 ms in 4 of 6 cold flips (41.1–49.9 ms). The quiet-box read is still owed.
2. **GB7 (the PRM cold cut) is NOT MET.**
   - Chromium: the tree reads 50.7–74.9 ms with 1–2 frames over 34 ms; main-HEAD reads 116.7–184 ms with 2–6.
   - WebKit: the tree reads 92–527 ms; main-HEAD reads 186–572 ms.
   - The **WebKit warm PRM** flip is slower on the tree. At 1280 light-boot the median max is **~100 ms against
     ~75 ms** on main-HEAD. That is row 38's price, and it is larger under load. It belongs in T9-B22's text (§4).
3. **Row 9, the wordmark half, stays BLOCKED.** No ink-path candidate was tried: not a device-px mask, not a mask
   `<image>` with a resolution, not `warm()` on pencil-boil 0.12.1. GB2 therefore reads **4 draws / 4 href swaps per
   flip** on the tree, against **8 / 8** on the control and main-HEAD. Those are the wordmark's; the grid's are 0.
4. **Row 10, arm B (G-MOTION GM-1, Opus's flight sheet), is NOT BUILT.** INTAKE T9-B22(b) says "built on the chair's
   or owner's word". The pass-5 and pass-6 CHAIR-RULINGS carry no such word, and the charter's "BUILT" contradicts the
   ballot's text. This conflict is declared again, not resolved by the lane. The M19 split arms ARE built (§4).
5. **Row 11 / INTAKE 40: the painted-frame recorder does not discriminate on this box.** GB6, the 300 ms stall
   injector at gesture +100 with Chromium CDP screencast, was cut two ways:
   - whole viewport: `specs/gb6`
   - cropped to the toggle's box and hashed per frame: `specs/gb6b`

   Both cuts read **19–25 distinct toggle poses in +100…+400 with or without the stall, in both arms** (tree and
   main-HEAD). The largest frame gap under the stall is 36–86 ms, so the compositor kept producing toggle frames through
   a 300 ms main-thread stall. No control changes the verdict, so GB6 is **not a gate**. The intake's "RED by
   construction" is not observed by this instrument. GA3 (the first painted frame on a screencast) and GA4 are unread
   for the same reason: frame gaps of 100–280 ms with no stall. GA7, GA8 and the recordVideo WebKit arm were not built.
6. **Row 12's cells:**
   - **Row 34** (the held wordmark mid-unfold vs rest): UNMEASURED.
   - **Row 32** (the poster exit): OPEN. Every arm is a same-frame cut with 0 fold frames and 1 mover. The maxStep read
     is unstable run to run within one arm: tree 632.4 / 3.0 and main 0.0 / 634.3 at 1280. No cure was attempted.
   - **The classic-scrollbar regime was NOT REACHED.** Removing Chromium's `--hide-scrollbars` still reports
     `scrollbarW 0`, so those rows read the default regime twice.
7. **GB4 was not re-read this pass:** idle ≥ 97.6 with long33 at 0, the filter census, and the fold's raster union.
   Neither was GA9 (a re-press mid-verb).
8. **Row 39's estate is only partly run.** `theme-bake-freshness` and `wordmark-integrity` ran on their own config.
   `gallery`, `visual-golden`, `visual-regression` and `multiplayer` were NOT run: the main `playwright.config.ts`
   webServer latches **:3000**, which is foreign, and the lane may not start or reuse it. `src/probe/devicePaint.ts`
   is W8's row.
9. **The M15 crop's instants** (charter row 14's second half) were not re-cropped. The beat table is on fixed t (§1).
   No pass-5 M15 crop survives the sweep to be matched.

---

## 1 · Numbers first, by charter row

| # | row | tree | control `74a2b5d9` / main-HEAD | verdict |
| --- | --- | --- | --- | --- |
| 1 | undefined-token census: template sites + masked defaults | gate **0**; self-test **0** (controls 1–10d red as required) | control **1** (the declared STALE `--refuse-dur`, A.1 ruling 4); the chair's copy on the same plants **0 / 0 / 0** | CLOSED |
| 1 | plant X5 `style="animation-duration: var(--motion-note, 280ms)"` on AnswerKeyLaminate's root | **exit 1**, MASKED | chair copy **0** | the chair's copy is blind to template sites |
| 1 | X5b `style=` undefined token · X5c `:style` string | **1 · 1** | chair copy **0 · 0** | — |
| 2 | `theme-bake-freshness`, grid half PAINTED (tree5, served) | **10/10 chromium · 10/10 webkit**, painted fraction 8.7–14.8 %, ink rgb(49,49,49) ↔ rgb(199,197,190) at load and after the toggle | — | CLOSED |
| 2 | Plant K `mask-image: none !important` | **10/10 FAIL ×2 engines**, painted 96–100 % (band) | — | negative control |
| 2 | Plant S (stale colour) · Plant F (faint ink, opacity 0.15) | **10/10 FAIL ×2** (computed ΔE) · **10/10 FAIL ×2** (the PAINTED colour ΔE alone) | — | negative controls |
| 3 | B8 by value | LADDER's row: P5 `--ease-starTuck: ease-in` exits **1**; `lint:bands` / `lint:verbs` bare **0 / 0** | control 1 / 1 (the scripts are absent) | CLOSED (LADDER) |
| 4 | `--ease-prmFade` | ADMITTED as the PRM-fallback carve-out (pass-6 chair §1.4), stated at `index.css`, bound by value in KEYWORD_TWINS | — | CLOSED |
| 5 | fixed-t table on ONE dense grid (`readings/fixed-t-dense.txt`) | **48 terms**: 30 RE-CURVE, 2 nudge, 16 re-name; worst `App.vue:1265` deck leave **0.8521 @ t 0.40** | — | printed |
| 5 | 240→250 (`HandDrawnGrid.vue:603` dash, `CrayonHeart.vue:329`, `GameGallery.vue:1493` ×2) · 500→520 (`index.css:704/722`, `HandDrawnGrid.vue:603` opacity) | joint Δ **0.3629 · 0.3537 · 0.0293** (curve identical) · **0.3545 ×3** | — | **SHIPPING** on the tree; T9-B10's text restated (§4) |
| 6 | GB1 cold flip, Chromium (M15, 3 cells × 2 boots, r1+r2) | born **0.222–0.225**; max **33.3–49.9 ms**; > 34 ms **0–1**; dS **0.040–0.079**; draws/hrefs **4/4**; bitmap style mutations **0** | control 0.466–0.734 / 113.6–174.8 ms / 2–5 / dS 0.03–0.435 / 8/8; main 0.446–0.686 / 108.2–167.2 ms / 2–4 / 8/8 | born and dS met; the 34 ms clause fails in 4/6 (loaded box) |
| 6 | GB1 cold flip, WebKit | born 0.345–0.578; max **95–265 ms**; > 34 ms 4–7; dS 0.143–0.524 | control 1.04–1.09 / 348–507 ms (plus one born-less read at 130 ms, href 0); main 0.139–1.068 / 199–702 ms | **NOT MET** (gap 1) |
| 6 | warm flips, WebKit 1280 light-boot | max 81–117 ms (median 84) | main 59–96 ms (median 80) | about +4 ms, loaded |
| 7 | GB3 rest identity, painted bytes | WebKit light **Δ9** (px>1 138,977; px>4 586; px>16 0; ink −0.664 %) · dark **Δ2**; Chromium light **Δ2** (74 px) · dark **Δ2** (21 px) | control-vs-control **0** everywhere; after-vs-main identical to after-vs-control | **MET at the chair's tolerances** (WebKit Δ ≤ 9, Chromium Δ ≤ 3) |
| 8 | GA1 as the chair defined it (raw frame-1 centre ≤ 3 px AND width ≤ 3 px, rAF, frame index printed) in the NEW estate spec `e2e/fold-verb.spec.ts` | tree5 **4/4 chromium, 4/4 webkit**; frame 1 at ct 0: centre **0.00–0.03 px**, width **0.00**; frame 2 at ct 33–55; visible min **1.000** (GA2) | control **6/6 RED** (Chromium 92.81 / 93.00 / 21.57 px; WebKit 121.43 / 141.63 / 33.98 px); main-HEAD 92.89 Chromium / 129 WebKit | CLOSED |
| 8 | its negative controls | plant P (hold ablated, pinned clock): **6/6 RED** (Chromium 7.00/−13.74 · 6.61/−12.97 · 2.17/−4.80; WebKit 65.08/−127.70 · 21.42/−47.48). tree4 without the snap cure, kenken cell: **RED both engines** (Chromium centre **569.05 px / width −416**; WebKit "the centre card lost the live board", visible 0.000) | — | the spec can fail |
| 9 | wordmark half | BLOCKED, nothing tried | — | gap 3 |
| 10 | arm B (GM-1) · M19 split arms | NOT BUILT (gap 4) · BUILT: `DECK_PIN` viewport / document | — | see §4 |
| 11 | recorder / GB6 / GA7 / GA8 / GA9 / GB4 raster | GB6 does not discriminate (gap 5) | — | OPEN |
| 12 | row 31 at a non-zero deck index (kenken, index 4) | tree5 frame-1 centre **0.00 / 0.00** at 1280 and 390, both engines; doc scroll excess **0** on every frame; deck scrollLeft held **704/704**, **1217/1217** | main-HEAD Chromium **160.62 / 21.45 px** (dw −4.02 / −4.74); WebKit **251.05 / 32.12 px** (dw −29.51 / −41.13); control 161.88 / 21.53 · 280.13 / 30.61 | CLOSED for the index; the classic regime was not reached (gap 6) |
| 12 | row 32 · row 34 | see gap 6 | — | OPEN |
| 13 | `ink-rub-out` · `chromeLeaveMs` | consumer-less on the tree; the fold checklist names the landing or the deletion (`fold-checklist-s13.txt` rows 8–11); `chromeLeaveMs` is gone from code (`MOTION.rungs.leave` is its one home) | — | carried by name |
| 14 | toggle beats at fixed t on the LIVE curves (`readings/toggle-beats-fixed-t-live.txt`) | Chromium **28/28** transitions, max \|Δprogress\| **0.000000** over 13 t, both themes; WebKit 16–18 matched at **0**, and the 5–6 tuck rows present only on the tree equal Chromium's curve to 0 | control 28 / 16–18 | CLOSED; the crop instants are gap 9 |
| 15 | INTAKE 30–41, two numbers each | §2 | — | — |

**The leader's `@property` duty.** Run as `check-property-block --dist tree5 --served :4242`:

- It reads **GREEN**: 8 source registrations and 8 names; the served CSS carries 49 registrations, all in `index-*.css`.
- The stamp is `index-ICe9_X4WHUBR.js`, and the self-test exits **0** (C1–C6 each red when planted).
- The negative control is `--served :4247`, a different dist. It exits **1**.

The fold's deletions, and the `MarginNote.vue` two-conflict resolution with ERASE, are listed by file:row in
`fold-checklist-s13.txt`.

---

## 2 · INTAKE §7 rows 30–41 (tree · main-HEAD)

| row | tree5 | main-HEAD `index-ChSrVSqM0j8q.js` |
| --- | --- | --- |
| 30 GA1 frame-1 centre (Chromium · WebKit, 1280 fine) | **0.00 · 0.00 px** | **92.89 · 129 px** |
| 30 GA2 visible fraction min over the fold | **1.000** | 0.235 (pass-5 read at `74a2b5d9`; not re-read on main) |
| 31 doc scroll excess at kenken (index 4), every frame | **0** | 0 (main has no lift) |
| 31 frame-1 centre at kenken, Chromium 1280 | **0.00 px** | **160.62 px** |
| 32 GA6 centre-card height while it fades | **407.9 / 357.8 constant** | control min **104** |
| 32 poster exit maxStep (Chromium 390) | 461.5 (1 step > 100) | 343.5 (2 steps > 100); OPEN |
| 33 fit unset → a same-frame cut | LADDER's GC1: board **0×0** | control board **672×672** |
| 34 held wordmark | UNMEASURED | UNMEASURED |
| 35 M16 escalation M1 | FACE's row, not VERB's | — |
| 36 GB1 cold born / max (Chromium 1280 light) | **0.222 / 33.3 ms** | **0.66 / 167.2 ms** |
| 36 GB2 draws · hrefs · bitmap style mutations per cold flip | **4 · 4 · 0** (the wordmark's) | **8 · 8 · 0** |
| 36 GB3 max channel Δ (WebKit light · Chromium light) | **9 · 2** vs main | — (the reference) |
| 37 wordmark ink path | BLOCKED | theme-keyed bake |
| 38 WebKit warm PRM flip, median max (1280 light-boot, loaded) | **~100 ms** | **~75 ms** |
| 39 `theme-bake-freshness` · `wordmark-integrity` (estate configs, served) | **10/10 ×2 engines · 6/6 webkit** | `wordmark-integrity` **6/6**; tbf not run on main |
| 40 GB6 distinct toggle poses in +100…+400 under a 300 ms stall (whole-frame · toggle-cropped) | 22, 19 · 23, 23 | 24, 21 · 25, 25 (not discriminating) |
| 41 PRM cold toggle max (Chromium 1280 light) | **59.3 / 66.4 ms** | **184 / 174.6 ms** |

---

## 3 · Frames: two crops, both lawful pairs (one payload, one variable)

| file | engine · theme · viewport · pointer | the one variable | reading |
| --- | --- | --- | --- |
| `t9-b21-deal-fold-t282-under-left-after-right-chromium-light-1280x800-fine.png` (18,525 B) | chromium · light · 1280×800 · fine | `DEAL_AFTER_SETTLE` false (left, arm a) / true (right, arm b) | fold +282 ms, animations frozen and seeked: **22,165 px differ** (> 8/255). Arm (a) shows futoshiki dealing from under the board; arm (b) shows no flank |
| `t9-b23-ink-at-flip-t175-snap-left-dusk-right-chromium-light2dark-1280x800-fine.png` (12,751 B) | chromium · light→dark · 1280×800 · fine | `INK_JOINS_DUSK` false (left, arm a) / true (right, arm b) | +175 ms of the dusk: **12,664 px differ**, max 34. Arm (b)'s ink is rgb(175,174,167) in the dusk where arm (a) has snapped |

- **Retires:** neither crop retires one. `pass4/SWEEP.md` banked no B21 or B23 frame; the intake's c2 showed arm (a)
  only.
- **T9-B10's frame** is pass 5's surviving `t9-b10-deckleave-t040-after-left-control-right-…png`, which stands.
- **No M19 split-arm crop was made, and here is why.**
  - The gallery page never scrolls: `scrollHeight == innerHeight` at 844×390, 568×320 and 1280×800 in both engines.
  - So the viewport pin and the document pin paint the same, apart from a ≤ 0.4 px snap, because `offsetTop` rounds
    to an integer.
  - With no pixels to tell the arms apart, there is no lawful differing pair to crop.

---

## 4 · Ballots

**T9-B10 (the re-curves).** Restated as SHIPPING, because the tree carries them:

- 30 RE-CURVE terms.
- The lengths 240→250: joint Δ 0.3629 / 0.3537 / 0.0293.
- The lengths 500→520: joint Δ 0.3545 ×3.
- The dense-grid worst is 0.8521 (the deck leave). The frame is pass 5's.

**T9-B21 (the deal under the sheet).**

- (a) The default, `DEAL_AFTER_SETTLE=false`: the flanks deal at 0.42·520 plus the stagger.
- (b) `true`: the deal waits for the settle.
- Framed in §3, one constant.

**T9-B22 (who plays the Bloom).**

- (a) is built. Its measured price, stated for the ballot text: **WebKit warm PRM flips run ~+25 ms slower than
  main-HEAD** (median ~100 vs ~75 ms, loaded box). Cold WebKit is still 95–265 ms, with 4–7 frames over 34 ms. That is
  better than main-HEAD's 199–702 ms, but it is not the ≤ 34 ms the gate asks for.
- (b) is NOT built, per gap 4. It is framed on paper only, as the intake says.
- GB6 cannot yet adjudicate the two arms (gap 5).

**T9-B23 (the ink at the flip).**

- (a) The default, `INK_JOINS_DUSK=false`: the ink snaps.
- (b) The ink joins the dusk. It needs `!important`, because VueUse's `disableTransition` stamps
  `*{transition:none!important}` at the flip. Without it, arm (b) was blind (incident 4).
- Framed in §3.

**M19's split arms (U-10).** `DECK_PIN` "viewport" (Opus's held card box, the default) against "document" (Fable's
`--deck-top`). Both are built and served on :4242 and :4245, and they paint the same (§3). The owner's choice reduces to
the code path alone.

---

## 5 · The pre-return battery, BARE (tree · control `74a2b5d9` read-only)

The table puts each gate's exit code for the tree beside the control's.

| gate | tree | control |
| --- | --- | --- |
| lint:bands · --self-test | 0 · 0 | 1 · 1 (script absent) |
| lint:verbs (publish-verbs --check && check-pencil-verbs --self-test) | 0 | 1 (script absent) |
| lint:theme-tokens --self-test | 0 | 0 |
| lint:motion · copy · lanes · sleep | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 |
| check-pw-projects · --self-test | 0 · 0 | 0 · 0 |
| eslint . | **0** (it was 1 before the §6 cure) | 0 |
| prettier --check (npm run lint) | 0 | 0 |
| knip | 0 | 0 |
| lint:ink · catch · theme-sel · live-regions · tdz · boundary | 0 ×6 | 0 ×6 |
| vue-tsc app · e2e · node | 0 · 0 · 0 | 0 · 0 · 0 |
| vitest src/pencil · src/games · src/composables | 9 files / 80 tests · **57 / 741** · 3 / 16, all pass | 8 / 73 · 57 / 741 · 3 / 16, all pass |
| check-property-block (served, tree5) · --self-test | 0 · 0 | — |

**vitest `src/games` on the tree timed out on its first run.** It read 5 failed of 741 Tests (5 Test Files) at load
~150–200: five tests hit their 5 s / 30 s limits, and fork workers were terminated. The wrapper still printed exit 0. It
was re-run bare at load ~100 and passed **57 / 741**, exit 0. "Test Files" and "Tests" are quoted separately.

---

## 6 · What the tree carries (pass 6 alone = `pass6-verb.diff`)

- `scripts/check-theme-tokens.mjs`: the chair's cured census, plus these additions:
  - template sites (`style=`, `:style` strings);
  - a masked default on a `@property`-registered token;
  - self-test controls 10–10d.
  - **Also a cure to the chair's copy:** it carries two dead functions, `enclosingSelector` and `isGlobalRule`, which
    red `eslint .` once landed as `scripts/`. Both are deleted.
  - PROPOSED to the chair as `instruments/undefined-token-census.template-sites.PROPOSED.diff` (206 lines, against a
    prettier-normalised chair copy). Not applied to the chair's file.
- `e2e/theme-bake-freshness.spec.ts`: the grid half asserts PAINTED ink. It photographs with `.grid-ink` on and hidden
  and reads only the difference. The checks are a band of 2–40 %, a drift of ≤ 0.25 and a painted ΔE ≤ 32, all
  against the fresh load.
- `e2e/fold-verb.spec.ts` (NEW) holds GA1 and GA2. Four cells: 1280 fine light and dark, 390×844 coarse, and 1280
  kenken. `// PRM: live`; the chair's definition is in its docstring. It is added to `check-pw-projects`' manifest.
- `src/games/shared/useFlipGlide.ts`: `holdFirstFrame` pauses at time 0 and then sets
  `startTime = document.timeline.currentTime` on the first rAF. Before, the UA resolved a pending start and the fold
  started part-way in.
- `src/pencil/chrome/GameGallery/useCarouselGlide.ts`: `reportSnap` ignores scroll events while the viewport is
  `overflow-x: clip`. The fold's lift resets Chromium's `scrollLeft` to 0, and the deck used to re-centre card 1 under
  a kenken fold. This was VERB's own pass-5 regression, found and cured in this pass.
- `src/App.vue` `DECK_PIN` · `GameGallery.vue` `DEAL_AFTER_SETTLE` · `HandDrawnGrid.vue` `INK_JOINS_DUSK`: the owner's
  arms. Each is one constant, with arm (a) as the default.
- `src/assets/index.css`: the `--ease-prmFade` comment restated as the chair's carve-out.

---

## 7 · The replay route

The work was done in place, with no replay. The open state was LADDER's T6 = `53a73123`.

To bank `pass6-verb.diff` (the diff of `53a73123` against the tree's write-tree, `--binary`), take the tree's
write-tree through a temporary `GIT_INDEX_FILE` (`read-tree HEAD`, `add -A`, `write-tree`) and diff it against
`53a73123`. It then **apply-verified**: `read-tree 53a73123`, `apply --cached --binary`, and `write-tree` must
reproduce the tree's id.

Nothing was committed, stashed or pushed. The real index was never touched.

---

## 8 · Incidents

1. **`/tmp/null` was written once.** A redirect typo went outside the scratchpad.
2. **The box was loaded, 57–200, for the whole pass.** Every timing row is a loaded reading (§0).
3. **The kenken regression was VERB's own**, from its pass-5 `.is-folding` lift. The estate spec found it: frame 1 read
   0×0 and 569 px off, with the deck re-centred on sudoku. It is cured in `useCarouselGlide.ts`. tree4 without the cure
   stays RED as the negative control.
4. **The first B23 arm (b) was blind.** `disableTransition` suppressed the ink transition. It was rebuilt with
   `!important` (b23 → b23b2), and the frozen frame then differed.
5. **The first GA1 mover key was `a.id === 'flip-glide'`.** That id is absent on the control, so the spec would have
   gone red for the wrong reason. It is re-keyed to "the one script animation" (not a CSSTransition or CSSAnimation).
6. **`prettier --write` was invoked on an e2e file.** It was a no-op, since e2e/ is prettier-ignored.
7. **The chair's census copy redded `eslint .` with two dead functions** once it was landed as a script. Cured in the
   tree (§6).
8. **The first vitest `src/games` run timed out under load** (§5).
9. **Scratch configs sat in the tree as `web/frontend/.mot-verb/`.** They were moved to
   `<scratchpad>/trash-motverb6/mot-verb-dir/` before return. The same went for an ignored
   `tsconfig.tsbuildinfo` (13:08) this pass's type-checks left behind. Nothing was `rm`'d. The eight lane servers were
   killed by recorded PID, and :4230–4249 are empty after.

**r0 / R6 rows moved:** none. The 240→250 and 500→520 lengths are stated as SHIPPING, not moved. The pass-6 number is
the critic's.
