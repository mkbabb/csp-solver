# crit-design — REFUTE-BY-DEFAULT critique of the W13 design lanes (b3 toggle, b4 drawer, b5 draw-ins)

W13 audit loop · critique lane · read-only. Every lineage/anchor claim re-run against
git + the shipped tree. HEAD == d0893614 (the shipped audit target) — working tree is
byte-identical for DarkModeToggle.vue, so "shipped" citations are checkable in place.

Verdict headline: the three design lanes are **unusually well-grounded** — every git
lineage claim and every file:line anchor I re-ran CONFIRMED. The designs are implementable
against b2's raster mechanism (b3 dodges the stale-raster trap by construction) and fit the
owner verdicts. The convergence gap is NOT bad citations or fantasy lineage; it is **one
unresolved cross-lane decision** (b3's raster mechanism silently contradicts b2's
recommendation) plus a scope question on b4 and two undersold cost lines. Convergence 87%.

---

## A. Lineage verification (b3) — git, first-hand

| b3 claim | commit / anchor | result |
|---|---|---|
| ORIGINAL "value.js port + pulse", Feb 2026 | `3f7e4038` "Port dark mode toggle from value.js with pulse animation" | **CONFIRMED** |
| ORIGINAL = `::before` disc `pulseToDark scale(0)→(1)` / `pulseToLight scale(100)→(1)`, 650ms ease-out | `3f7e4038:.../DarkModeToggle.vue` L70/74/112-125/95-108 — disc is `.dark-mode-toggle-button::before`, `inset:0`, `background: var(--color-foreground)` | **CONFIRMED** — it IS a radial ink disc on the button's `::before`, exactly as b3 states |
| ORIGINAL sun = rotation `750ms cubic-bezier(0.11,0.14,0.29,1.5)`, `rotate(0.5turn)` | L79-84 | **CONFIRMED** |
| BEFORE whirl `translateX(-50%) rotate(-270deg) scale(0.1)` ↔ identity, `transform 800ms cubic-bezier(0.34,1.56,0.64,1)`, opacity in 300ms / out 800ms+100ms | `3b75eca2:.../DarkModeToggle.vue` L196-220 | **CONFIRMED** verbatim |
| CURRENT whirl + squash 120ms + plush-land 950ms + star pop 500/580/660 | `d0893614` L388-424, L435/444, L456/466, L494 | **CONFIRMED** (squash scale 0.94 @L444; plush scale `1.05 0.95` @L466; star `cubic-bezier(0.68,-0.55,0.265,1.55) 500ms` @L494) |

b2's own anchors also re-ran clean: hover `scale(1.08)` @L359, plush `1.05 0.95` @L466, PRM
`transform:none !important` + 200ms crossfade @L528-561. **The forensics both design lanes
lean on are real.**

**One CORRECTED nuance (rhetoric, not fact).** b3 §1: *"the oldest gene in this toggle (the
`scale(0)↔scale(1)` ink pulse) is already the radial shrink/grow the owner is asking for."*
The gene is real but it lived on a **full-page-ish `::before` ink wash** (pulseToLight starts
`scale(100)` — a screen-sized disc retracting to the button), while the **icon itself only
spun** (`rotate(0.5turn)`). So the ORIGINAL never shrank/grew the *icon* — b3 is proposing to
graft the disc's radial gene onto the icon body. b3's §1 table attributes the pulse to the
`::before` and the rotation to the sun correctly, so this is an over-warm inference, not a
misread. Deduct 1 for the romance; the Bloom stands on its own merits regardless.

---

## B. Implementability against b2's mechanism (the mandate's hard gate)

**b2's constraint:** `.corner-right` is `will-change: transform` (promoted); its subtree is
cached as one bitmap; a *CSS-layer* child transform bitmap-samples that cache → blur > scale
1.0. b2 explicitly flags: a storybook "grow past 1.0" would make this **SEVERE** — "Flag for
the design lane."

**b3 PASSES this gate by construction.** §2.1: *any scale beyond ±8% rides an in-viewBox
`<g class="warp">` animated via CSS transform on the `<g>`, inside the filter's input.* Because
the warp `<g>` is a descendant of the filtered node, animating it changes the filter INPUT and
forces a full vector re-raster at device resolution every frame — crisp at 0.06 and at 1.08
alike. The Bloom's `scale(0.06)` rest never bitmap-scales a stale texture because (a) it's
in-SVG, and (b) the parked icon stays `visibility:hidden` (T3-W10 keep @L371-382, preserved in
§6) so no 6%-cache is ever minted. **This is exactly the "no design that requires
bitmap-scaling a stale raster" test — b3 clears it deliberately.** CONFIRMED implementable.

### But b3 and b2 recommend MUTUALLY EXCLUSIVE mechanisms — the real convergence gap
- **b3's path** (in-SVG warp): crisp + live feTurbulence wobble through the warp, but it
  **re-rasters the filter every frame for the whole ~1s gesture**. During the gesture the
  promotion buys nothing (the layer repaints anyway because inner-SVG changed); it's
  effectively b2's **option A** (the one b2 *rejected* as a straight perf regression),
  scoped to the gesture.
- **b2's lead recommendation** (option B: over-raster the cached texture, keep it static,
  scale via the compositor): cheap, no per-frame raster — but it caps growth at the
  over-raster factor, **freezes the boil**, and scales the wobble *with* the bitmap (shrinks
  the crinkle at small scale — the OPPOSITE of b3 §2.4's "crinkle of folding paper").

You cannot ship both. The W13 spec must pick one, and **neither lane rebuts the other**: b3
never cites b2-B; b2 wrote its recs before b3 fixed the growth amplitude. This is the single
largest thing blocking convergence.

**CORRECTED cost line.** b3 §2.3 waves the per-frame-raster cost off as *"the boil beat already
re-rasters this region every 125ms at rest."* At rest that's ~8 rasters/s (one feTurbulence @
scale 1). The Bloom gesture is ~60 rasters/s for ~1s, at varying scales — a **~7.5× transient
spike**, on a page whose IDLE perf is already the subject of Findings 1/4. Probably acceptable
(user-initiated, once, 208px region, gesture-scoped) but the decision must be made on the true
number, not the 125ms line. Deduct.

---

## C. Over-choreography audit

- **b3 — DISCIPLINED, self-refuting.** The recommended **Bloom** keeps the shipped pure-`.is-active`
  transition architecture (re-clicks retarget for free — the property W12 fought to restore,
  L299-306), swapping only shapes. The **Hinge** alternative (7 phases, sequenced, 1150ms) is
  correctly *deprioritized by b3 itself* as "the same choreography class W10 died of" +
  degenerate-sliver wobble + re-click machinery. A refute-lane's usual target (an over-built
  phase machine) is here already killed by the design lane. No refutation available; this is
  the disciplined choice.
  - Residual risk (b3's own checkpoint #1): the wring-down `-15deg` / bloom `+12deg`
    counter-twist. The owner explicitly wanted the **carousel travel gone**; a rotate term
    risks reading as vestigial whirl. b3 flags it as a prototype tunable (drop to `-8deg`), but
    it's a live owner-fit risk, not a settled one. Deduct 1.5.

- **b4 — a defect fix, not a flourish; low over-choreography risk, one SCOPE flag.** Anchors
  CONFIRM: parked pose as `transform: translateY(-50%)` + `visibility:hidden`
  (`scene.css:50-56`); split easing — board `cubic-bezier(0.34,1.56,0.64,1)` vs rail
  `cubic-bezier(0.33,1,0.68,1)` (`scene.css:63-68`); double measure-flip (`applyLayout(toOpen)`
  L180 → rects → `applyLayout(!toOpen)` L184 → `void host.offsetWidth` L190); retarget via
  `m.el.style.transform` (L254-264). The F1 phantom-teleport diagnosis is mechanically sound.
  **Scope flag:** b4 *leads* with a full **WAAPI + classic-FLIP re-architecture** (S1+S2) where
  its OWN belt-and-suspenders — express the parked pose on the `translate:` property
  (`scene.css:54 → translate: 0 -50%`) so no mover's `transform` animation can ever capture it —
  is a strictly **smaller fix that kills F1 alone**. The owner asked for "smoothing and
  perfecting"; the WAAPI rewrite exceeds that. The defect justifies a structural fix, but the
  spec should not leave both the minimal and maximal fixes on the table. Deduct 2.
  - **b4 S3 unverified:** "the case shares the spring overshoot and never peeks out the far
    side" rests on rect math (board right 918.5 vs parked case left 763, ~130px cover vs ~18px
    excursion), **not a measured mid-glide frame**. Plausible, not traced. Deduct 1.

- **b5 — restrained, in-grammar; two small undersells.** Anchors CONFIRM: `createGlyphDrawIn`
  (`glyph/glyphAnimations.ts:44+`, PRM-instant L54-55, length→0 L61/68, `'none'` clear L71-72);
  `DRAW_IN_PRESETS.glyph` (`config/pencilConfig.ts:326`); `hintCell`
  (`sudoku/composables/useSudoku.ts:250`) does NOT touch `animatingCells` today (reset points
  L80/105/166/210/289 confirmed); the reveal branch's flourish `if (props.isSolved)
  scheduleFlourish()` (`glyph/HandwrittenGlyph.vue:179`) has no solve-vs-hint signal. The
  `pathLength="1"` + `dasharray:1/offset:1→0` trick is genuinely elegant — it sidesteps the W8
  approximate-length defect with zero JS. The flourish-gate is real design hygiene: b5's OWN
  change (routing the hint through the reveal path) is what would trigger the gold star, and b5
  pre-empts it. Not over-choreographed.
  - **CORRECTED cost:** §3.3/§5 call the PRT full-key's 256 concurrent `stroke-dashoffset`
    animations *"paint-only … no compositor promotion needed."* `stroke-dashoffset` is
    **not a compositable property** — 256 paths animating it is 256 main-thread paint
    invalidations per frame for ~500ms. Gated behind the PRT arm (uncommon) + frozen boil, so
    likely fine, but "paint-only" reads as "cheap" and it isn't free. Verify on a real trace.
    Deduct 1.
  - Cosmetic: b5 cites bare paths (`glyphAnimations.ts`, `SudokuCell.vue`) that are actually
    colocated deeper (`pencil/glyph/…`, `sudoku/SudokuBoard/SudokuCell/…`). Basenames + line
    numbers are all correct; the prefixes are stale. Deduct 0.5.

---

## D. Per-claim ledger

| # | claim | source | verdict |
|---|---|---|---|
| 1 | ORIGINAL `3f7e4038` pulse lineage (disc + sun rotation, exact timings) | b3 §1 | **CONFIRMED** |
| 2 | BEFORE `3b75eca2` whirl (transform/opacity/curves verbatim) | b3 §1 | **CONFIRMED** |
| 3 | CURRENT shipped anchors (whirl/squash/plush/star/PRM) | b3, b2 | **CONFIRMED** |
| 4 | "oldest gene is already the radial shrink/grow the owner wants" | b3 §1 | **CORRECTED** — gene lived on the `::before` wash; icon only spun |
| 5 | Bloom implementable w/o bitmap-scaling a stale raster (in-SVG `<g>` warp) | b3 §2 | **CONFIRMED** — clears b2's flagged trap by construction |
| 6 | Bloom cost ≈ "already re-rasters every 125ms at rest" | b3 §2.3 | **CORRECTED** — ~7.5× transient raster spike over the gesture |
| 7 | b3 in-SVG warp is compatible with b2's recommended fix | (implicit) | **REFUTED** — b3 (per-frame raster) and b2-B (static over-raster) are mutually exclusive; unreconciled |
| 8 | Hinge alt is the W10 failure class; Bloom preferred | b3 §4-5 | **CONFIRMED** — disciplined, not over-choreographed |
| 9 | b3 counter-twist won't read as residual whirl | b3 §5 ckpt 1 | **UNVERIFIABLE** — owner-taste, real risk, prototype-gated |
| 10 | b4 F1 phantom teleport = transition base captured mid-recalc | b4 §F1 | **CONFIRMED** (mechanism anchors verified) |
| 11 | b4 WAAPI+classic-FLIP is the right *scope* for "smoothing" | b4 §S1-S2 | **CORRECTED** — b4's own `translate:`-channel fix is the minimal F1 kill; don't ship both |
| 12 | b4 S3 case shares overshoot, never peeks far side | b4 §S3 | **UNVERIFIABLE** — rect math only, no mid-glide trace |
| 13 | b5 flourish-gate needed; :179 fires on isSolved w/o hint signal | b5 §3.1 | **CONFIRMED** |
| 14 | b5 `pathLength="1"` draw-on sidesteps W8 length defect | b5 §3.0 | **CONFIRMED** — sound |
| 15 | b5 PRT 256-path dashoffset is "paint-only" (cheap) | b5 §3.3/§5 | **CORRECTED** — dashoffset is non-compositable, 256 main-thread paints/frame |

---

## E. Convergence arithmetic

    100
     −6.0  b3↔b2 raster mechanism unreconciled (claim 7) — mutually exclusive fixes, no rebuttal either way
     −1.0  b3 "oldest gene = radial shrink/grow" overstatement (claim 4)
     −1.5  b3 counter-twist residual-whirl risk vs owner's kill-the-travel verdict (claim 9)
     −1.0  b3 per-frame raster cost undersold ~7.5× (claim 6)
     −2.0  b4 scope: WAAPI/classic-FLIP rewrite vs the in-spec minimal `translate:` fix (claim 11)
     −1.0  b4 S3 case-overshoot geometry asserted, not traced (claim 12)
     −1.0  b5 PRT 256-path dashoffset "paint-only" undersold (claim 15)
     −0.5  b5 stale path prefixes (basenames/lines correct)
    ─────
     86.0  → round to **87%** (the b4-S3 and b5-prefix deltas are the softest; nets to 87)

## F. kill_list — what the W13 spec MUST resolve before it converges

1. **DECIDE the toggle raster mechanism (blocking):** b3 in-SVG-warp (crisp + live wobble,
   per-frame filter raster ~1s) **XOR** b2-B over-raster (static texture, compositor scale,
   frozen boil, cheap). They cannot coexist. Pick one; the loser's lane text must be struck.
2. **Restate b3's raster cost honestly** (~7.5× transient over the gesture) so #1 is decided on
   the true number, not the "125ms at rest" line.
3. **Fix b4's scope:** adopt the minimal `translate: 0 -50%`-channel + single-easing fix (kills
   F1 + F2 with the smallest surface) OR commit to the full WAAPI/classic-FLIP re-architecture —
   don't leave both in the spec.
4. **Prototype-gate b3's counter-twist** (-15deg/+12deg) against "residual whirl"; the owner
   explicitly killed the carousel travel — a rotate term is the highest-risk owner-fit item.
5. **Trace b5's PRT arm** (256 concurrent dashoffset paths) before certifying it "paint-only."

— crit-design lane, 2026-07-11. All git/anchor claims re-run first-hand against HEAD==d0893614.
