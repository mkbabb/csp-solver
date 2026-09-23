# G-PANEL critique: T9-M17 (the new-game panel), adversarial read

Opus critic, 2026-09-22. I didn't write the design or the prototype. The prototype is in worktree `.claude/worktrees/wf_3b66f064-970-20` (HEAD `b9ba5c42`, and `web/` is byte-equal to `1e6cfbbf`). Three files are touched, +124 −40. The owner decides at the re-look (U-10). Nothing here retires the mark.

**Verdict: ADVANCE at 72.** On the desk rail the core cure is real and I reproduced it to the hundredth on my own builds. Gaps remain on four fronts:
- the coarse rail's look
- ARM A's live wells
- one moved W2 surface nobody declared
- the fold's substrate: the `@property` home, the dead scope prop and the tests that must move with the product

## 1 · What I re-ran

I rebuilt both dists myself. The prototype came from the worktree. The control came from `git archive HEAD` of the same tree into my scratchpad. The hashes reproduced the prototyper's exactly: proto `index-1KzgJ-HoWD7T.js`, control `index-ChSrVSqM0j8q.js`.

I served both with `vite preview` on 127.0.0.1:4257 and :4258 (`--strictPort`, scratch cacheDir) and killed them by recorded PID (4812/4821 and 4759/4760). The owner's server on 3001 was untouched, and so were 4230–4249 and 4259/4260, which another lane holds.

Every read used encoded payloads (sudoku 9×9 and futoshiki 5×5), both engines, and my own probe rather than the lane's `gpanel.mjs`.

| read | cell | proto (chromium / webkit) | control | agrees with lane |
|---|---|---|---|---|
| G1 `.new-game-zone` h | 1280×800 fine | **303.25 / 304.22** | 503.19 / 504.16 | yes |
| G1 | 1024 fine sudoku | 302.63 / 303.58 | 502.56 / 503.52 | yes |
| G1 | 1024 fine futoshiki | **347.81** (latin 3+1) / 303.58 | 547.75 / 548.70 | yes |
| G3 verb bottom vs bar top | 1280 fine | 466.11 vs 627.64 / 466.78 vs 627.34 | 633.27 | yes |
| G3 at the coarse rail (not gated) | 1280 hasTouch | **625.27 vs 627.64 / 625.94 vs 610.34** (still under the fade) | 662.86 / 663.53 | yes |
| G5 PAINTED ink-bottom Δ, Deal vs dealt (my own read, not text boxes) | 1280 fine · 1280 coarse · 390 coarse | **0 / 0** at every cell; clearance 7.19 | 29.5–33.5, gap −71 to −81 | yes |
| G8 card w / board.x | 1024 · 1280 fine, 1280 coarse, 390 coarse, both games | Δ **0.00 / 0.00** at every cell | — | yes |
| G8 scrollW/clientW | 1280 coarse | 282/218 on BOTH arms | 282/218 | yes (a HEAD defect) |
| G2 staged lines | 1280 fine | 1/1 | 3/3 (futoshiki 4/3) | yes |
| staged / live lines | 1280 coarse | staged **2/3**, live **3/1/2** | 3/3 · 3/1/3 | yes (see §2.1) |
| G4 tape→h2 | 1280 fine | 15.78 / 15.78 | 2.19 | yes |
| rule→h2 (section top) | 1280 fine | 14.59 / 15.09 | 14.59 / 15.09 | not read by the lane (see §2.6) |
| G13 chip transition under PRM | every cell | `color … 0.15s` | same | yes, RED |
| G10 painted AA, column distribution (LAWS P4) | 1280 fine, light | chip median = p30 = **4.66**; Deal sublabel 4.66; dealt 5.24; edge columns under 4.5: 7–14 % | Deal sublabel 4.66 | yes, thin |
| G10 | 1280 fine, dark | 7.68 / 7.68 / 6.01–6.07 | same | yes |
| phone sheet | 390×844 hasTouch | card 216/628, tab 124, bar 771.23: **identical**; deal row 117.77 → 84.98 | — | yes |
| **phone sheet** | **430×932 hasTouch** | card top 256.84 → **289.63**; **drawer tab y 208.84 → 241.63** (Δ +32.79 / +32.5); webkit bar 859.39 → 859.11 | — | **no**: the lane read "tabs identical" at 390 only |

## 2 · Open gaps

1. **The coarse rail's gestalt (iPad landscape, 1280 hasTouch) is incoherent.** `size` wraps 2+1 with `16×16` orphaned on a full-width 168 line (crop c3). `level` stays a three-line column, the marks well a column, and checking 2+1. That puts four layouts in one card. It is the M05 two-grammar disease, now INSIDE the new-game zone, and no ballot frames it. Deal still sits under the fade at scrollTop 0 in both engines. G9 greens the widths; nothing greens the look.
2. **ARM A, the default, ships a jag in the live wells** (crop c2):
   - `Center` is orphaned on the marks well's second line.
   - The line's intrinsic chips (Normal · Corner) sit over the what-fits pair's `flex: 1 1 0` halves (Off · On), so the x columns disagree inside one well.

   Ballots 1 and 3 name this. The default should not be the arm that shows it, or ballot 3's fallback (a kept column for marks) should be built and framed, not only described.
3. **π undeclared: the W2 drawer tab moves.** At 430×932 the content-sized sheet shrinks by the deal row's 32.79. The tab, a landed W2 mechanic on G11's list, rides +32.79 (chromium) and +32.5 (webkit), and webkit's bar moves −0.28. G11 names four deltas and this is not among them. A declared delta needs its own before/after crop, and the owner has to see the sheet's new pose.
4. **Deal's hit box shrinks at the fine pointer:** 71.19 → 60 wide, −16 %, on the card's one primary verb. M01 ("larger targets") is not a ballot for the verb, only for the chips (ballot 4). On the phone the verb now wears 0.75rem while every other icon button wears 0.5rem. That breaks the strip's uniform gutter, which the overwritten comment existed to keep. Neither change is declared as a trade.
5. **G6 is RED:** the die's ink sits 1.0 (chromium) and 1.0–1.5 (webkit) off the h2's ink, against 0.5. The chip reads 1.0 at 1024 and 1728 in chromium. The bar was set on arithmetic the glyphs don't honour. The chair either restates it as ≤ 1.5, with the DiceIcon's stroke inset named, or it stays red.
6. **Comments assert what the numbers deny:**
   - (a) index.css and GameControlPanel say "tape → name = rule air 13.6". Tape→h2 is 15.78, and rule→h2 inside the section is 13.09 / 13.59 after the 1.5 border. The ladder's top rung is not one step, and the engines differ by 0.5 there (inherited from HEAD).
   - (b) "Too narrow a rail wraps the receipt beneath (today's pose)": a wrapped flex receipt lands LEFT-flush under the die, which is not today's centred pose. The PROPOSED 8b reds on it (gap < 7.15), so the declared fallback is a pose the lane's own gate forbids.
7. **The substrate for the fold:**
   - (a) `--zone-step` is a NEW `@property` block in main's index.css. The chair's §6.7/§6.8 ruling is one block per home, in §10's leader's file (CTRL-FACE's index.css:163 on its tree). "A lane that registers a token elsewhere has re-minted and the row is a gap." It has to fold into FACE's block, not beside it.
   - (b) `LINE_SCOPE` plus the `line` prop is ballot scaffolding. Under ARM A the prop has no reader, which makes it consumer-less substrate. One arm dies at the ruling.
   - (c) The tree's own e2e 8b and test 10 red on this product until `PROPOSED-visual-regression.diff` folds with it. Test 10's seal stamp (shipped 1105.53 / 1106.50; extended control 1313.88 / 1315.02, against 1227.5) is the chair's single act.
8. **G2's census floors are RED for `size`** (span-x 0.72 / 0.70, ink 0.22 / 0.21). The adjudication computed 0.81 from chip boxes, not ink. That makes the floor spec-cites-itself until the chair re-derives it from ink.
9. **G13's PRM half is RED on both arms** (150 ms colour under reduce). This is FACE row 9, pre-existing, cited and not cured.
10. **Carried as the lane stated:**
    - the phone still 38 px under its case
    - the coarse `level` at 3 lines
    - futoshiki latin 3+1 at 1024 in chromium only (the webkit rail is 8 px wider)
    - the armed pose simulated by swapping text, not reached by dirtying the board
    - the `-1lh` guard unread
    - union raster area not run separately
    - G12 not re-run by me

## 3 · Checklist hits

- **The pixel it moves that it didn't declare (π):** the 430×932 drawer tab and sheet top move +32.8, and the webkit bar moves −0.28.
- **Unverified gestalt:** the coarse rail's four-layout card and ARM A's orphan and misaligned columns are green by width and wrong by look.
- **Spec-cites-itself:** two CSS comments state equalities the reads deny, and G2's floor was derived from boxes, not ink.
- **Consumer-less substrate:** the `line` prop under `LINE_SCOPE = "component"`.
- **The constraint it forgot:**
  - the @property one-home ruling (§6.8)
  - M01 on the verb's fine hit box
  - LAWS P4's painted-contrast distribution row. The lane read a p98 best pixel; my column distribution holds it at a flat 4.66.
- **Gates that can't fail:** the lane caught and fixed this in two places. The +120 growth control became +200, and test 10's unextended control only reverts to 1172.72, under the 1227.5 seal.

## 4 · Strengths (earned)

- The mark's pose is cured and reproduced on independent builds: 503.19 → 303.25 at 1280 fine, the verb 129 px clear of the fade, the next well's tape out from under the bar.
- The receipt sits on Deal's baseline to the painted pixel in both engines, at rest and coarse. The lane's `align-items: baseline` inside the tally found the 9.2 px error that `last baseline` alone leaves.
- The row never sizes the card: card width Δ 0.00 and board.x Δ 0.00 at every cell, both games, both engines. The negative control bites hard: the coarse rail 224 → 358, the board walks 67 px.
- The deck is π by construction: every deck OptionSelector passes `mobile`, so `.options-line` can't reach it.
- Nothing minted: no copy, hue, filter, timing or rung. filterBudget untouched. AA inks unchanged from HEAD, both themes.
- The lane refused the stale `w7-control` (74a2b5d9, before W8) and built a true 1e6cfbbf control, and it reported every RED, including its own.

## 5 · Charter rows for the owning families (pass 5)

- **CTRL-FACE (§10):** re-home `--zone-step` into its one block; frame ballot 3's kept-column arm as a BUILT frame; frame the coarse rail's layouts as one ballot (grown 2+1 vs a kept column for 3-value groups at coarse); declare or cure the 430 sheet/tab move with a crop; rule the verb's fine hit box against M01; correct the two comments; re-derive G2's floor from ink and G6's bar with the die's inset named; row 9 carries G13.
- **The chair:** books the T6-mark-8 reversal, rules ARM A vs B and stamps test 10 once at the fold.
