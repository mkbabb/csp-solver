# CTRL-RULE — PASS-1 CRITIQUE (adversarial, non-author)

**Verdict ADVANCE · convergence 60% earned.** The ruled page is real, it runs in both engines, and
eleven of its gates go green on the live surface. It is not converged: its own class invariant is
broken worse than the prototype reported (the pinned head takes the chip's TAPS, not just its
pixels), it moves a pixel on a surface the wave does not claim (the gallery's staging band, 12.00px,
measured HEAD vs proto), its rule misses the 3:1 floor in light, its one new token is spent on 5 of
19 controls while the other 14 keep the 2.15:1 UA ring the token exists to kill, and two of its
numbers (the seam at 430, the dock height) went backwards.

## 0 · What I did

Read `git -C .claude/worktrees/wf_e58b4764-0fc-38 diff` whole (8 tracked files, +825/−896, three new
components at 431 lines). Looked at all four banked frame pairs. Served the worktree at
`127.0.0.1:4240 --strictPort` and HEAD (main tree, read-only) at `:4236`, and re-ran my own probes in
chromium **and** webkit at 390×844 / 1280×800, light **and** dark: the heading census, the rule's
painted contrast from bytes, the pinned-head occlusion, a hit test the prototype did not run, the
ring's consumers, the bar's coverage, and a HEAD-vs-proto pi census on the gallery. Ran
`check-copy-register.mjs` (exit 0), `check-font-coverage.mjs` (exit 1), and the panel's unit file.
Probes and readings banked beside this file (`critique/CTRL-RULE/`).

**Rig hazard for the other lanes:** the worktree's `web/frontend/node_modules` is a SYMLINK to the
main tree's, so two vite servers share one `node_modules/.vite` and the second one to boot poisons
the first with `504 (Outdated Optimize Dep)` — a blank page that looks like a product bug. HEAD and
proto must be served sequentially, or one of them given its own `cacheDir`.

## 1 · What reproduced (the prototype's numbers are honest)

| Row | Prototype | Mine |
|---|---|---|
| Heading count in the card | exactly 7 | 7 at every cell, both engines (clone trap holds) |
| Voices | 1 | 1 — `Fraunces \| 25.888px \| 800 \| lowercase` |
| ROW 3 name/chip | 1.2945 | 1.2944 at 390 and 1280, both engines (25.888/20) |
| Pinned-head occlusion desk | 38.8/38.9% of `Normal` | 38.8% chromium / 38.9% webkit at scrollTop 500 |
| Pinned-head occlusion dock | 13.6% of `Deal` | 13.6% both engines at scrollTop 217 |
| Live `url(#…)` population | 24 → 24 | 24 at all four cells, both engines |
| M16 | exit 0, `candidates` struck | exit 0, 1 admitted (B1's Solve tape) |
| Font coverage | RED, one glyph | RED, exactly `Fraunces · .section-heading: "players" misses "p"` |
| Units | 7 rows red in one file | 7 failed / 27 passed, `GameControlPanel.test.ts` |
| Bar out of the scrollport | `inCard=false`, gap 0.00px | `inCard=false`, bar top − card bottom = 0.00px |

The bar's clipped-coverage claim holds and I can state why it cannot be otherwise: the bar's top
equals the card's border-box bottom, so every overlap lies at or below the client box and is clipped
by construction. My deliberately UNCLIPPED predicate reads 69.4% at the dock and 55.2% at the
desk — the same figure the r0 instrument reported, on air.

## 2 · The chief finding, escalated

The spec writes its own class invariant: *a sticky surface with a ground never paints over a
control*. The build breaks it, and the break is not only visual.

`document.elementFromPoint` at the midpoint of the covered band, 1280×800, `.controls-card`
scrollTop 500, both engines:

```
head "marks" · control "Normal" · covered 14.7px = 38.8% (chromium) / 14.8px = 38.9% (webkit)
hit at that point → h2.section-heading     hitIsTheControl = FALSE
```

`.head-pin` carries `pointer-events: none`, but `.group-head` takes its events back with
`pointer-events: auto`, so the pinned name's opaque ground is also its hit area. The `Normal` chip's
live target shrinks 38px → 23.3px at the desk and rail; at the dock `Deal` loses 13.6%. Nothing in
the suite fires: access 2.1 wants ≥96% burial, I3 asks a different question, and `scroll-padding-top`
answers a focus landing. The frame shows it (`prototype/…/frames/2-pinned-name-1440-chromium.png`,
and mine in light at `critique/CTRL-RULE/marks-chromium-1280-light.png`).

The prototype names the cure — a reserve of ~31px per pinned group — and that is the
elegant-reduction tell: the release greens I3 and hands the hard part to the next pass, at a price
the height budget has already overspent (see §5).

## 3 · The pixel it moves that it did not declare (pi) — NEW, and not in the prototype's gaps

`typography.css` deletes the `.section-heading` ≥768 arm and folds `text-align: left` +
`padding-left: 0.75rem` into the BASE. `.section-heading` has a consumer outside this card:
`pencil/chrome/GameGallery/StagingBand.vue:140,154` — the gallery's `size` and `level` axis labels.

Measured, chromium 390×844, gallery open (`g`), text-node range rect:

```
HEAD  (:4236)  size glyphX 17.59  level glyphX 17.59   padding-left 0px
PROTO (:4240)  size glyphX 29.59  level glyphX 29.59   padding-left 12px    Δ +12.00px
```

At 900×500 and 1280 the labels were already at 12px, so the move is the sub-768 band exactly. The
band's own `font-size: 16px` override absorbs the √φ→φ rung and the `--type-option` 22→20 arm, so
those two are clean — the padding is the whole of it, and it is 12px on a surface W7 does not claim.
The cure is one line: scope the base arm to the card (`.controls-card .section-heading`, or give the
staging band its own left inset) and re-measure the gallery in the same commit.

## 4 · The floors the spec sits on rather than above

**The rule, painted, LIGHT.** Canvas read-back, per column, 282–370 columns per rule, my own
instrument:

```
chromium light   Size 2.451 worst · new game 2.422 · marks 2.451 · what fits 2.451 · Level 2.451
                 columns under 3:1 — 15.7% … 37.0% (Level worst)
webkit  light    2.603–2.635 worst; Level 47.0% of columns under 3:1
both dark        worst 2.937–3.252; 0–19% under 3:1
medians          3.53 light / 4.364 dark — the spec's headline, and it is the MEDIAN
```

The spec's "worst antialiased sample 3.06" is the p25. The gate as the brief wrote it (worst sample
≥3.0) is RED in light on every rule I could read, and `Level`'s seed is half again worse than its
siblings — the wobble's sub-pixel y placement, not the ink, decides whether a column clears. The
spec's two floors (never thinner than 1.6px, never below 55%) are exactly the numbers that produce
this, so one of them has to move (1.8px or 60%) or the gate has to be restated as a distribution
with its own floor, in the open, before the re-look.

**The ring.** `--ring-ink` is authored in exactly two places — `GameControlPanel.vue:1867`
(`.icon-btn, .info-btn, .players-leave`) and `ConfirmRibbon.vue:183`. The spec's token table gives
the ring to CHIP as well. Measured with a real focus on the `9×9` chip, 1280×800 light:

```
chromium  outline 1px auto (UA)  painted best 3.725
webkit    outline 3px auto (UA)  painted best 2.147     ← the exact defect the token was minted for
card census: 19 buttons, 5 ringed, 14 unringed (every size/level/marks/what-fits/checking chip)
```

So the gate "the card's authored focus ring ≥3:1 from painted bytes" is green on 5 controls and red
on 14, in the engine that motivated it. A token spent on a quarter of its subject is not a cured
census.

**The names' ink.** The spec says muted, with `level` in the tier's ink. The build paints THREE inks:
`Size` `rgb(115,115,115)` muted, `Level` `rgb(29,127,53)` crayon-green, and `new game` / `marks` /
`what fits` / `checking` / `players` at `rgb(10,10,10)` foreground. Each clears AA as large text, so
this is not a contrast defect — it is the spec and the build disagreeing about the page's one voice,
undeclared in the deltas.

## 5 · The rows that went backwards, and the ones left standing

- **The 430 seam is a new RED** (+14.11/+13.98 → −17.09/−17.02) because
  `max(12.6rem, calc(var(--masthead-foot, 0px) + 8px))` resolves to its floor: the `0px` fallback is a
  masked default that hides the missing W2 §2.5 publisher rather than failing loudly. The same shape
  is in `--card-foot-h, 0px` and `--rp-head-h, 2.35rem` — if the observer never fires, the card's cap
  silently stops reserving the foot and nothing reads red.
- **The dock height target is missed**: 733 in 540 against the brief's ≤660 in 628, 28.7% below the
  fold where HEAD was 10.2%. The occlusion cure in §2 costs ~31px per pinned group against that.
- **The per-dimension tap-floor control never fired.** `min-inline-size: var(--tap-floor)` is inside
  `@media (pointer: coarse)` and the two words measure 51.73 and 54.39 wide on their own ink, so
  ablating the declaration changes nothing. The gallery ribbon's 39×44 — the named negative control —
  was never armed from the game route. I could not arm the confirm either (a clean board does not arm
  `clear`): the predicate remains unproven on a live surface in both hands.
- **σ is RED per-rule** against R3's band floor 0.722 (two of eight seeds at 0.549 / 0.555) and green
  per-population. Restating the gate as a mean AFTER seeing the result is the circularity to refuse;
  pick seeds, or declare the band a population statistic in r0 and re-cut the predicate there.
- **Still open, correctly reported, not claimed**: I4 (`fill`/`solve` write on one tap until W1 §1.5),
  §14's quick set NOT BUILT, the r0 R3 law-probe blind to a template-drawn bar edge, the goldens and
  `filter-census.spec.ts` not run (they want a built dist), 7 unit rows addressing the dead grammar.
- **The armed ribbon paints over the card's last ~87px.** Transient and `role=alertdialog`, so it is
  not the sticky invariant — but it needs a ruling in the spec, not a footnote in the gaps.

## 6 · What is strong, and should survive whatever else changes

1. The memorable thing is on the real surface in both engines, and it is not the generic default:
   seven printed names on hand-ruled graphite, one voice, one rung, one margin. No cream-and-terracotta
   tell, no eyebrow, no card grid, no arrow.
2. `wobbleLine` as ONE static path is the right primitive — the board's own generator, no beat, no
   subscriber, no `url(#…)`: the filter population does not move (24 → 24) and `filterBudget.ts` is
   untouched. Any family that wants a drawn edge should take this and not invent a second one.
3. The death of the tabs is paid for in a number, not a claim: `level` at 2 taps, 0 hidden option rows.
4. The bar as the case's foot makes I2 true by construction rather than by reserve — the strongest
   structural move in the pass, and it belongs to W2 whichever family wins.
5. The gate that caught the family's own rename (`ruledGroupNames` re-pointing `check-font-coverage`
   at `<RuledGroup name>`, then failing on `players`) is the derivation discipline working exactly as
   its §3 asks. Keep the extractor even if the family retires.

## 7 · The exact open gaps

See the returned data. Each is one sentence and each is closable in a pass.
