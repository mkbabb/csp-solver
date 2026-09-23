# G-DRAWIN critique (T9-M20): the page-load draw-in

Adversarial critic (Opus). I didn't write the design or the prototype. Subject: the worktree
`.claude/worktrees/wf_b6676cd9-8c6-13` at `1d0dc4fd`, uncommitted diff of 7 tracked files plus 2 new ones,
about +662/−138 lines. I rebuilt the default arm A×Q from the FINAL source (`index-QGY5VR1WCliP.js`, the fold
greps `order:"serial",layer:"mask"`), because the prototype's measured dists predate its last edits. I served it
on :4253 and HEAD's census dist (`index-ChSrVSqM0j8q.js`) on :4254, both 127.0.0.1 with `--strictPort`. Both
servers were killed by recorded PID (60437, 60438) and the ports read free afterwards. Box load ran 27–75.
Nothing was committed, no `rm` was used, and :3001 wasn't touched. Scratch went to
`<scratchpad>/trash-drawcrit-1/` with `mv`.

## 0 · Verdict: ADVANCE at 63, as pass-7 charter rows. Not a fold candidate.

The thesis holds where it was built. The capped clock, the serial order, pose 0 first and the PRM cut are all
real, and I reproduced them on both engines. Three things keep this from being a fold candidate:

1. **The default layer arm paints marks the brief never declared.** Arm A shows ghost crossings (§3.1).
2. **The prototype inverts the page's order.** Digits are inked on an unruled page (§3.2), which runs against
   the mark's own word, "pencil like".
3. **The gates that read green read the code's own writes, not the paint.** My painted-frame read disagrees on
   two clauses (§2).

The layer arm is undecided in both directions, and the owner's surface (:3001) was never run.

## 1 · Re-measured (numbers first; min–max; post-rAF sampler = the prototype's `init3.js`/`an3.mjs`, re-run on my build)

| row | engine · regime | prototype (final source) | HEAD | reading |
|---|---|---|---|---|
| G-D1 worst Δ/rAF sample, frame % perim / sub % / cell %, 150 ms busy loop at stroke+~200 | chromium d light n3 | 3.8–4.0 / 8.1–8.3 / 13.8–14.4 | 39.5–49.6 / 68.9–90 / 100 (n2) | REPRODUCED (prototype's 3.8–5.3 / 8.5–15.9 / 13.9–25.5) |
| same | WebKit d dark n3 (+ light n3, m hasTouch n2, no inj) | 7.5 / 15.8–16.1 / 26.2–26.3 (every run, injected or not) | — | REPRODUCED, but it's **the cap itself**: 2.394×17/D evaluated. See the checklist, "gate that cannot fail" |
| G-D3 max fronts | both engines, 16 runs | 2 (tips 2) | 9 (chromium), HEAD WebKit 2 of 17 lines ever partial | REPRODUCED |
| G-D11 painted-interval proxy (rAF dt in the draw) | WebKit d light n3, m n2, no inj | dtMax 20–38, >34 ms: 2/0/0/0/0 | dtMax 517–535, 15–17 lines never partial | better than the prototype's loaded-box 0–17: **load-sensitive**, not attributed |
| G-D8 erases on a late deal (worker +3.5 s, default boot) | chromium n2, WebKit n2 | 0 erases, all 4 | (prototype's 6/6 = 1) | REPRODUCED on WebKit too (the prototype only ran chromium) |
| **G-D2 encodes, rubbing → the wave's last stroke** | same late-deal runs, chromium n2 + WebKit n2 | **8 in window, every run** (4 grid at 3020–3303 ms, 4 wordmark at 3448–3574 ms); chromium LoAF **2 × 190–195 ms** (IMG blob decode) at 3020–3269 ms | 16 | **RED in the :3001-shaped regime.** The prototype's own `an-all.json` reads AQ2-DEAL3500 `encIn 8` ×3 while its README says G-D2 "0 in every run": a misreport |
| D15 order, default boot (painted, see §2) | chromium n2 | digits 95 % inked at 1098–1509 ms, grid 95 % ruled at 2577–2641; digits at grid-50 % = **100 %** | grid 95 % at 598–633; digits at grid-50 % = 7–40 % | **CONFIRMED order inversion** |
| tempo (d cold, 9×9) | WebKit d light / m DEF dark | first stroke 965–1074 / **1221–1767**; drawn 3118–3341 / **3536–4145** | first stroke 316–357, drawn 891–912 | REPORTED. Phone WebKit shows a blank board for up to 1.8 s |
| unit | `handStroke.test.ts` | 4/4 | — | curve arithmetic holds |

## 2 · My own instrument: the painted-frame recorder the prototype owed (row 40, chromium only)

I built a chromium CDP `Page.startScreencast` recorder (1280×800 DPR1 light, JPEG q92), with per-line
painted coverage read along each detected ruling (crossings excluded) and digit ink in the cell interiors.
Runs: n3 AQ, n3 AQ plus the 150 ms injection, n2 AQ default boot, and the same shapes n2 on HEAD. The recorder
captures compositor frames at a median of 9 ms. It can't see a main-thread stall as a gap: HEAD's 150 ms
injection shows as dtMax 107–110 ms, and the prototype's shows as 23–27 ms. So this is a reading of the
painted Δ, not of cadence.

- **Painted fronts: 2** (HEAD 13). Lines never partial in ≥2 painted frames: 0 (HEAD 1–2). The order claim
  holds on the paint.
- **The painted per-frame Δ exceeds the gate's cell cap.** The worst interior line moves 25.6–35.9 % in one
  painted frame. That's above the 27.1 % cell bound in 3 of 6 runs, with and without the injection.
  - The worst frame side is 25.1–32.0 % of a side, about 6.3–8.0 % of the perimeter, over the 7.8 % bound in
    1 of 8 runs.
  - The cap bounds the clock per rAF tick, not per PAINTED frame: a tick that runs without a present moves
    the hand unseen. Whether these gaps are the recorder's or the compositor's is unresolved. That's exactly
    why G-D1 has to be read on paint, and the prototype read it on its own style writes.
- **Painted order (k2):**
  - At t=1518 ms on the default boot the prototype has **95.3 % of the digits inked on a page 35.6 % ruled**.
  - HEAD at 815 ms: 99.9 % ruled, 98.0 % inked.
  - On a `?board=` restore (the shared-link and returning-player boot), the givens are whole at 128–175 ms, and
    the page stays partly unruled from about 0.6 s to 2.7 s (HEAD: 0.16 → 0.65 s).
- **Handoff dips:** none seen after `drawEnd` in any run.

## 3 · Findings the prototype didn't declare

1. **Ghost crossings in arm A (the default), both engines** (k1; also visible in the prototype's own c2).
   - The mask is each line at width+4 over the WHOLE pose-0 bitmap. Every drawn line therefore reveals a
     (w+4)-unit stub of every undrawn line crossing it. Tick marks appear along each ruled line at every future
     crossing, and bumps appear on the frame where the interior lines will end.
   - A hand ruling one line leaves no marks of lines it hasn't drawn yet.
   - The pad is there to keep the grain's edge. Narrowing it moves the defect into G-D6's chromium edge step.
     Arm A has no pad value that is clean on both counts from a single merged pose.
   - The cure is structural: per-tier pose-0 bakes (+2 encodes before the hand), arm B, or a mask that
     subtracts the undrawn lines (a second mask, which is G-D6b's cost).
2. **The digits are written before the page is ruled (D15, CONFIRMED).**
   - The prototype flagged this as a hidden ballot price. I measured it on paint as a regression against HEAD
     on both boots.
   - This isn't a tempo cost the ballot can price. The ONE HAND arm can't ship without D15, which is a new W1
     mechanic: the wave waits for the last lift.
   - Under THE RULING FRONT (F: first stroke 851–947 ms, drawn 1409–1505 ms) the inversion should shrink but
     not vanish, because the wave doesn't depend on the arm. That's inferred from the prototype's tempo table;
     F's default boot wasn't run.
3. **G-D2 is regime-dependent.** Under a late deal the stack opens (poll on `kinds.sequence === 0`) after the
   ruling and before the wave.
   - Both 190 ms decode LoAFs then land at about 3.0–3.3 s, in the first-touch window. The page looks settled
     there and the player is most likely to tap.
   - G-D12 was never measured. The prototype moved HEAD's boot-time long frames (about 0.2–0.4 s, before anyone
     can act) to the moment the player first acts.
4. **G-D6's arm A chromium step.** It's partial RED, as the prototype said (p95 25–29, p99 33–37,
   52–62 k px > 16/255). "No handoff frame exists" therefore holds on WebKit only.
   - The gate's median clause can't fail on thin lines: most band pixels are paper. It needs a p95 clause.
5. **G-D9 is mis-specified, not missed.**
   - A 0.35 em feather at 105° spans 0.35 / cos 15° = 0.362 em horizontally, and 0.326 em between the 5 %
     and 95 % isolines. The clause "≥ 0.35 em at 5–95 %" can't be met by the token it gates.
   - The adjudicator's gate and `rubFeatherEm` have to agree: feather ≥ 0.376 em, or a 0–100 % span.
   - The lean isn't measured: the prototype's slant estimator reads 47.6°. So 105° holds by construction only.
6. **`jointed()` assumes four equal sides starting at a corner.** The frame's "one bell per side" is only true
   if `gridPaths`' closed frame starts at a vertex and the sides are equal in length. Neither was read. The
   corner minima (G-D4) are unmeasured.
7. **The boot-deal skip rests on the heuristic "every value 0 at setup".** A restored empty save, or a board
   mounted blank for any other reason, skips the erase on the player's first real New Game. Fable's
   `source:'boot'` provenance is the honest form (D13).
8. **The wordmark ceiling and constants.**
   - `RUB_EM = 52` duplicates `.logo-text`'s font-size as a magic number, so it will drift.
   - `html.hand-pending` is a global class toggled by one component instance. Every grid remount and deal
     re-enters it.
   - The ceiling timers (2.5 s and 6 s) fire on every mount, even after residency.
9. **The chrome and the PRM wordmark move.**
   - The controls' fade now waits for the first stroke: chrome at about 0.85–1.2 s, against HEAD's about 0.4 s.
   - Under PRM the wordmark is absent until its pose-0 bake (0.4–0.9 s), then cuts in. HEAD showed it, live
     filter and all, from the first paint.
   - Both are declared in spirit but carry no row in the ballot text.

## 4 · Checklist hits

- **Gates that can't fail / spec-cites-itself.**
  - G-D1's caps are the construction's own arithmetic (2.394 × stepMs / D), read off the code's own
    `strokeDashoffset` writes. WebKit lands exactly on the cap in every run, injected or not.
  - G-D3 and G-D4 are read the same way.
  - The painted read disagrees on the cell clause (§2).
- **Unverified gestalt.** "Pencil-like" is asserted and never judged:
  - The bead is a crisp, grain-free, full-opacity round cap 1.35× wide over a grained line. In c1 it reads as
    a marker blob. At touch-down it's a lone dot (k1, the new line's first frame).
  - The rubbing is a soft gradient wipe with no graphite in its front (c3).
  - G-D5 proves visibility, not pencil. Only the owner's eye can pass this.
- **The generic default.** A feathered linear-gradient mask wipe is the stock web reveal, one step softer than
  the clip-wipe it replaces.
- **The pixel it moves that it didn't declare:** the ghost crossings, the digit-before-rule order, the
  first-touch LoAFs, the chrome onset, and the PRM wordmark absence.
- **Masked fallback.** `poseZero()`'s 1200 ms ceiling silently falls back to crisp stand-ins and brings back
  HEAD's crisp→grain step. No run exercised it and no row counts it.
- **Evidence law.** The painted-frame recorder, the primary read the brief required, wasn't built.
  - Five negative controls weren't built either (stepMs unset, poseCount=n, FAINT-INK, widthK 1.0, feather 0).
  - The README's G-D2 line contradicts its own series.
- **Constraints checked:**
  - M16: copy is untouched.
  - filterBudget: no filter was added. The masks aren't filters, but `filterBudget.ts`'s census wasn't run.
  - @property: none added.
  - R6 law 1: the drawer is untouched.
  - W2 mechanics are untouched.
  - M09 isn't violated on its face (quality bought at tempo), but the WebKit phone boot (blank up to 1.8 s,
    drawn at 4.1 s) is the ballot's to price.
  - The owner's regime (:3001 dev server, deal ≥ 1.2 s) wasn't run by either lane.

## 5 · What holds (reproduced)

- The capped clock cures the teleport. The worst injected Δ fell from HEAD's 40–50 / 69–90 / 100 to
  3.8 / 8.2 / 14 on chromium, and every line is seen partial.
- ONE HAND really puts 2 fronts on the page, rAF-read and painted (HEAD 9–15).
- No encode under a moving hand in the payload and default boots. The wordmark's pose-0 wait cured the WebKit
  9/21 case.
- 0 live-filter samples on the boot in both motion and PRM. PRM is a cut.
- The boot deal no longer turns the page (both engines, 3.5 s deal). A second deal still erases.
- Settled bytes and the rest-state census are unchanged. `handStroke`'s solver agrees with the parametric curve
  to 1e-4.
- The WebKit draw window went from dtMax 517–535 on HEAD to 20–38 in my quieter runs.

## 6 · Charter-row amendments for the fold (pass 7)

- **D2 (MOT-VERB), the layer:**
  - Arm A has to cure the ghost crossings, or lose the default to arm B.
  - G-D6 gains a p95 clause.
  - G-D6b needs a real paint-time read before the arm is chosen.
  - The mask/pad trade-off (§3.1) is the row's first reading.
- **D15 (MOT-VERB × W1), new, BLOCKING for arm (a):**
  - The deal's wave waits for the last lift.
  - Gate: painted digit ink ≤ 5 % while ruled coverage < 95 % on the default boot, both engines.
  - `?board=` restores get the same clause, or a declared exemption with its frame.
- **D5/G-D12:**
  - The stack-open bakes move out of the first-touch window: 0.12.1's `yieldBetweenPoses`, or open at idle
    after the first input.
  - G-D2's window runs through the late-deal regime (worker +1.5 s and +3.5 s).
- **D7 (row 40):** the painted-frame recorder, in both engines, is the primary read for G-D1, D3, D4, D6 and
  D11. G-D1's clause becomes per PAINTED frame.
- **G-D9:** re-cut the clause or the token so they agree. Measure the lean.
- **D13:** `source:'boot'` provenance in place of the values-all-zero heuristic.
- **Ballot B-DRAWIN-1:** the price text names:
  - "every deal", about 2.5 s to settle;
  - the phone WebKit blank board of up to 1.8 s;
  - D15.
- **The gestalt pair** (bead and rubbing) goes to the owner's re-look as frames. Nothing here passes it.

## 7 · Crops (engine · theme · viewport · pointer)

- `G-DRAWIN/k1-chromium-light-1280x800-fine-ghost-crossings-AQ.jpg` (34 KB): the frozen DPR2 two-fronts
  instant, t = 1763 ms. Ticks on the drawn cell and subgrid lines at every undrawn crossing, and a lone
  touch-down dot on line 6. WebKit shows the same at t = 2629 ms (not banked).
- `G-DRAWIN/k2-chromium-light-1280x800-fine-digits-before-ruling-AQ-vs-HEAD.jpg` (103 KB): painted
  (screencast) default boot, AQ t = 1518 ms (digits 95.3 %, grid 35.6 %) beside HEAD t = 815 ms (grid 99.9 %,
  digits 98.0 %).

Nothing here retires T9-M20 (U-10).
