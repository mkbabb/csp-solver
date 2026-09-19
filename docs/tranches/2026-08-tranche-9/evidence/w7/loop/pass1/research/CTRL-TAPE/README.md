# T9-W7 pass 1 · CTRL-TAPE — THE TAPED CASE

Section §10 (with §1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13.
Lane port 127.0.0.1:4230 · overlay proxy 127.0.0.1:4233 · chromium + webkit, headless, own
config. Read-only on the product: nothing under `src/`, `e2e/` or `scripts/` was touched, and
every figure below was re-derived on THIS tree (HEAD `7b0610cc` + the untracked W7/W8 evidence).

    THE IDEA         the washi tape is the ONE heading voice, and RANK IS WHERE THE TAPE IS
                     STUCK — astride the compartment's drawn top edge = a group, flat inside
                     it = a row. Same tuple, eight names, eight document headings.
    VERDICT          DEVELOP, with two named adjustments (§C·2 the seal, §C·5 the bar) and one
                     deletion (§C·6 the portrait quick set).
    FILES            readings-digest.json (every number cited below) ·
                     readings-{before,after,naive}.json.gz (the raw, gunzip to replay) ·
                     acts-{before,after}.json · heading-voice-{head,overlaid}.txt ·
                     access-{head,overlaid}.txt · probe/ (4 runnable probes + the scratch pw
                     config) · proto/ (the overlay, the DOM patch, the serving proxy) ·
                     frames/ (4 crops, 172 KB) — 444 KB for the lane

    REPLAY           npx vite --host 127.0.0.1 --port 4230 --strictPort   (from web/frontend)
                     node proto/overlay-proxy.mjs                          (4233 -> 4230)
                     node probe/ctrl-tape.probe.mjs [--overlay|--naive]
                     node probe/acts.probe.mjs [--overlay] · node probe/frames.mjs [--overlay]
                     LANE_TESTDIR=<dir> PLAYWRIGHT_BASE_URL=http://127.0.0.1:4233 \
                       npx playwright test --config=probe/pw.config.ts <spec>

---

## A · THE SUBSTRATE, VERIFIED ON THE TREE

Every claim the charter asked me to verify, checked against source and then against the engine.

| claim | verdict | cite |
|---|---|---|
| `SheetWashiLabel` `anchor="tag"` is sticky, in flow, net flow height zero by construction | TRUE | `src/pencil/sheet/SheetWashiLabel.vue:164-181`; the pull `calc(-1.5em - 0.04rem - lift)` and the give-back are :171-173 |
| `typography.css` role tokens; `--type-group-title`'s two arms; `--type-option`'s four width arms | TRUE | `src/assets/typography.css:119-125` (five roles), :133-137 (the md arm), :145-168 (20 / 22 / 16 / 20-coarse) |
| the phone's `--type-option` arm is 20px and collapses the ratio to 1.0175 | TRUE, re-measured | 20.35 / 20.00 = **1.0175** at 390×844, both engines (`readings-digest.json`) |
| `GameControlPanel.vue:786-793` is a `display: contents` heading host | TRUE | `.mobile-heading-head { display: contents }` at :2386-2388; the one-string law at :19-38 / :415-417 |
| `DrawerTab.vue:151-154` is the estate's one authored focus ring | TRUE | `2px dashed currentColor`, offset 3 |
| `.action-bar` has no border, a `::before` fade and an `::after` skirt | TRUE | `:2097-2104`, `:2116-2128`, `:2221-2227`; skirt height `var(--card-pad-b)` |
| the sticky key is missing the `<1024 landscape` arm | TRUE | `:2173` — `(min-width: 1024px), (max-width: 1023.98px) and (orientation: portrait)`; measured `position: relative` at 900×500 |
| the Deal/Clear two-tap arms are coarse + dirty | TRUE | `:506-533` (Deal), `:542-567` (Clear), both `isCoarse && props.isDirty`, both 2500 ms |
| `scene.css:468` `--sheet-chrome: 12rem`; `GameScene.vue:183` `.outline-svg` outset −4 stroke 3 | TRUE | `scene.css:466-474`; `GameScene.vue:182-184` (`HandDrawnOutline :stroke-width="3"` on `.drawer-case`) |

**One substrate fact the charter got wrong, and it changes the cheapest lever.** The charter
says "re-point `--type-tag` → `--type-heading`". `--type-tag` has **six** consumers on this tree
and only **two** are names:

| site | what it is | cite |
|---|---|---|
| `.washi-tag` | the compartment's NAME | `SheetWashiLabel.vue:175` |
| `.zone-row-label` | the row's NAME | `GameControlPanel.vue:1612` |
| `.player-row` | a roster slug | `:1661` |
| `.player-self` / `.players-status` | a status line | `:1781` |
| `.players-leave` | a CONTROL | `:1797` |
| `.heading-value` | the closed tab's VALUE word | `:2406` |

Re-pointing the token wholesale draws the roster, the leave control and the tab's value at
25.888px. Measured with the charter's literal re-point (`readings-naive.json.gz`, digest under `naive`): `.heading-value`
goes **14.00 → 25.89** at 390 and `.players-status` **14.00 → 25.89**. The role seam is not
one-name-per-role yet; **the family needs a seventh role, `--type-name`**, and the two name
sites move onto it. That is still one right-hand side, and it leaves the four non-names alone.

**The `.zone-row-label` column is priced at 3.75rem** (`:1556-1557`, "48.8px at 390, 54px at
1023, against 60"). At the name rung `candidates` measures 158px. The row caption therefore
cannot stay a right-aligned column beside its selector; it stacks above it at every width,
which is the rail's own `zone-row-stacked` pose generalised. That move is most of the height
price in §C·2.

---

## B · THE PROTOTYPE, AND WHAT IT SHOWED

`proto/overlay.mjs` (stylesheet + DOM patch) and `proto/overlay-proxy.mjs`, which splices both
into the dev server's HTML so the estate's own instruments run **byte-unchanged** against an
overlaid product. No product file moved; no worktree was needed.

What the overlay does: mints `--type-name` at `--type-heading` and puts all eight names on one
tuple; turns the compartment tape's own element into an `<h2>` **in place** (so
`.tray-well > .washi-tag`, which the r0 instrument and `zone-grammar` both address it by, keeps
matching) and gives the two row captions and the two staged names a `display: contents` host;
adds the half-life release; draws the bar at 1.5 and Deal at 2.5 as pre-baked geometry; retires
the `.info-glyph` ring and the `.players-leave` underline; sets radii 0-drawn / 8-invisible;
drops the hover ground for the ink lift alone; puts the dashed ring on every control; makes the
tabs two pressed/lifted row-tapes; adds the landscape sticky arm; derives `--sheet-chrome`.

### B.1 · THE NUMBERS, BEFORE → AFTER (chromium; webkit agrees to the hundredth unless stated)

| reading | 390×844 dock | 1280×800 desk | 1280×800 **coarse** | 1440×900 rail | 900×500 land |
|---|---|---|---|---|---|
| voices | 3 → **1** | 3 → **1** | 3 → **1** | 3 → **1** | 3 → **1** |
| names that are document headings | 2/8 → **8/8** | 2/8 → **8/8** | 2/8 → **8/8** | 2/8 → **8/8** | 2/8 → **8/8** |
| name ÷ option | 1.0175 → **1.2945** | 1.2945 → 1.2945 | 1.2945 → 1.2945 | 1.2945 → 1.2945 | 1.1768 → **1.1768** |
| tape overhang above its well | 13.63–14.25 → **16.96 / 31.60 / 32.16 / 32.15** | 13.71–14.33 → 24.55 / 31.60 / 32.16 / 32.15 | same | 14.21–14.85 → same | same |
| first tape's clearance from the card's top | 3.75 → **1.04** (webkit 1.02) | 11.26 → 1.04 | 11.26 → 1.04 | 10.75 → 1.04 | 3.75 → 1.04 |
| `.control-panel-wrap` height | 674.55 → 803.14 | 1065.88 → 1208.23 | **1227.09 → 1369.45** | 1067.81 → 1209.69 | 718.59 → 868.72 |
| bar: chrome of its own | false → **true** (drawn 1.5) | false → true | false → true | false → true | false → true |
| bar: worst group covered (I2's raw measure) | 0.889 → 0.856 | 0.083 → 0.123 | 0.122 → 0.117 | 0.116 → **0.064** | 0 → 0.204 |
| bar: worst VISIBLE burial (added row) | 0.889 → 0.856 | 0.083 → 0.123 | 0.122 → 0.117 | 0.307 → **0.064** | 0 → 0.204 |
| bar `position` | sticky → sticky | sticky → sticky | sticky → sticky | sticky → sticky | **relative → sticky** |
| I3 violating states (r0's own test) | 0 → 4 | 3 → 3 | 3 → 4 | 3 → 3 | 6 → 7 |
| I3′ violating states (added row, §B.3) | 0 → 0 | **2 → 0** | **2 → 0** | **3 → 0** | **1 → 0** |
| case stroke vs wordmark foot | **−2.73 → +8.00** (wk −3.02 → +7.98) | — | — | — | +104.42 → +104.42 |
| card width (the goldens' 6px) | 390 → 390 | 324.22 → **324.22** | 224 → **224** | 330 → **330** | 900 → 900 |
| elements carrying a `url()` filter | 24 → **24** | 24 → 24 | 24 → 24 | 24 → 24 | 24 → 24 |

### B.2 · THE INSTRUMENTS, RE-RUN UNCHANGED

| instrument | at HEAD (my server, my config) | under the overlay |
|---|---|---|
| `r0/r1-controls/probe/heading-voice.spec.ts` ROW 1 / 2 / 3 | **4 cells, 4 failed** (`heading-voice-head.txt`) | **4 passed** (`heading-voice-overlaid.txt`) — `voices` 1, `ranks` ["H2"], `docHeadings` **8**, `namePx` 25.89, `optionPx` 20 at BOTH cells, both engines. No row weakened: the population stays 8 because the tape's own element becomes the heading. |
| `e2e/access.spec.ts` 2.1 · 2.2 · 2.3 (6 tests × 2 engines) | **12 passed** (`access-head.txt`) | **12 passed** (`access-overlaid.txt`) — no focus-occlusion burial, no covered tabbable, both contrast floors held in light and dark |
| R7 I2 (bar) | ownChrome **false**, 88.9% of `players` | ownChrome **true**; coverage still 6.4–85.6% → **term 1 GREEN, term 2 RED** (§C·5) |
| R7 I3 (sticky) | 3 violating states at 1440×900 | 3 — see §B.3, the test cannot see the cure |
| R7 I4 (confirm) | Deal armed · Clear armed · **Fill wrote 43 (chromium) / 49 (webkit)** · Solve neither | **all four armed, `sure?`, 0 cells written, no dialog**, both engines → **GREEN** |
| the 44×44 floor, per dimension, with a per-dimension negative control | tabs 44×44 and 50.38×44 | tabs **52.52×44** and **94.78×44**; control: kill `min-width` → 12×44 (width fails, height holds), kill `min-height` → 52.52×12 (height fails, width holds) |

### B.3 · I3 CANNOT SEE ITS OWN CURE, AND THAT IS A FINDING, NOT AN EXCUSE

I3's pinned-test is `b.top <= scb.top + 30` — one-sided. A tape that has **left upward** with its
group satisfies it exactly as a pinned tape does, so any geometry that releases a tape by pushing
it out the top of the scrollport still reads as "pinned over a group that is 5% on screen". No
sticky geometry can green I3 as written; only removing the node from `.tray-well .washi-tag`
could, and that is a mechanism, not a voice.

So the family's row is added **beside** I3, not in place of it, and it is the same law with the
band made explicit: **a tape that is actually IN the card's pin band (`b.top <= scb.top + 30`
AND `b.bottom >= scb.top`) names a group at least half on screen, at every scroll state.**
Born-RED at HEAD — **2** violating states at 1280×800, **3** at 1440×900, **1** at 900×500, both
engines. **GREEN at every cell under the half-life release.** `frames/p2-rail1440-scroll500-after.png`
is the picture: at R7's own `p7` pose the tape at the top of the card reads `pencils`, the group
under the eye, and `new game` has gone. That is the owner's acceptance sentence for M03
(r7 §4: "he will know it when the tape at the top of the card is the tape for the group under
his eye").

**The implementation moved, and the move matters.** The charter's half-life container (a wrapper
at `inset: 0 0 50% 0` with the tape sticky inside it) works, but it stops the tape being the
well's direct first child — and `.tray-well > .washi-tag` is how the r0 instrument, the estate's
own rules (`GameControlPanel.vue:1523`, `:1575`) and `zone-grammar.spec.ts` all address it. With
the wrapper in place the r0 instrument's own population silently fell from 8 names to 4 and ROW 2
passed vacuously. The prototype therefore carries the law as **one attribute**: a well whose
visible fraction in the card falls under 0.5 sets `data-released` on its tape, and the released
tape is `position: static` — it goes back to riding its own well and leaves the band with it.
Same verdicts, no wrapper, no selector broken. A real implementation is one `IntersectionObserver`
at `threshold: 0.5` per well.

### B.4 · THE W2 RESIDUAL, re-measured at its own pose

1280×800, `scrollTop 327` (`prove-record.md:67`, R7 §2): `Medium` `insideFrac` **0.5169**
chromium / **0.5160** webkit at HEAD → **1.0000** in both engines under the overlay. The card's
own max scroll moves 534 → 676, so this is a cure at the reported pose rather than a proof about
every offset; the legibility question the residual raised is answered by §B.3's row, which holds
at all five.

---

## C · THE EIGHT QUESTIONS, ANSWERED

### C.1 · VOICE — the tape's rung, and whether 25.9px still reads as tape

**The rung holds at every width.** All eight names compute to `Patrick Hand · 25.89 · 500 ·
lowercase`, identical at 390 and at 1280 and in both engines, because the name rung is
`--type-heading` — a fixed rem, per R6 law 26 (a heading is an identity, a control is a clamp).
That is what takes the phone's ratio from 1.0175 to **1.2945**, the desk's own shipped figure,
by construction rather than by a second number.

**The overhang is 32.15px, not the charter's predicted ~22.** An unpinned tape's box now rises
**32.15/32.16px** above its well's border box (13.63–14.25 today). A pinned one is clamped at
16.96 (dock) / 24.55 (desk). Against the dock card's **3.75px** of top clearance the first tape
now lands **1.04px** inside the card's top edge (webkit 1.02) — **the F12 clip does NOT return,
and it clears by one pixel.** One pixel is a measurement, not a margin. Two cheap ways out, both
for the synthesizer: declare the tape's `line-height` at 1.2 instead of 1.5 (the pull is exact
arithmetic on the tape's own box, `SheetWashiLabel.vue:158-160`), or pin the first tape 2px
lower. The charter's third option — moving the card's top padding — is the expensive one and
§C.2 is why.

**A second rung is unpaid.** At the 768–1023 arm (`900×500`) `--type-option` is **22px**, so the
ratio is **25.888 / 22 = 1.1767** — under the instrument's own 1.23 floor. The instrument does
not run that cell, but the law does not stop at 1023. Either `--type-option`'s 22px arm drops to
20 (ratio 1.294, and M01 loses nothing on a phone because the phone arm is already 20) or the
name takes `--type-title` (32.9px) there. **State the choice in the spec; do not let it fall
out.**

**Does 25.9px read as a tape or as a banner?** `frames/p1-dock390-sheet-after.png`: it reads as
tape — the torn clip, the tilt and the neutral ground survive the scale, and the drawn
compartment under it is what stops it being a banner. The honest weakness is the opposite one:
**the two ranks are carried by about 8px of vertical offset and one crossed stroke.** `pencils`
(astride) and `marks` (inside) are the same tuple 40px apart, and in the crop they read as
siblings rather than as parent and child. The family's claim survives on the compartment, not on
the tape. If a critique pass wants one more axis, the cheapest that stays inside the laws is the
tape's INSET: a group's tape at the well's 0.35rem, a row's tape one option-gutter further in.

**The font is free.** `node scripts/check-font-coverage.mjs` is green at HEAD, and the Patrick
Hand corpus already declares `size` and `level` (`scripts/check-font-coverage.mjs:223-235`, the
picker's axis captions), so moving `.section-heading` from Fraunces to the hand mints **no new
codepoint and no woff2 re-cut**. Worth flagging as a class, though: the gate binds a string to a
face by a hand-declared `where`, not by the computed `font-family`, so a CSS-only face swap is
invisible to it. Benign here; name it in the spec so the next one is not.

### C.2 · THE HEIGHT, AND THE ONE HARD COLLISION

`visual-regression.spec.ts` test 10 bounds `.control-panel-wrap` at **1227.5px** at 1280×800
**coarse**. Measured at HEAD on this tree: **1227.09px** — **0.41px of headroom**. Under the
overlay: **1369.45px**, which **breaks the seal by 141.95px**.

The price is itemised, and it is nearly all the row captions:

| item | where it lands |
|---|---|
| eight names 14.0/20.35 → 25.89 | ~8 × 12–16px of line box |
| the two row captions leaving their 3.75rem column for their own row | the `pencils` well grows by two full lines |
| the bar's reserved flow height | +64.81px at this cell |

**This is the family's ADJUST, and it is arithmetic, not taste.** Three levers, in the order a
synthesizer should spend them: (1) drop the bar's reserved flow height — it buys nothing anyway
(§C.5), −64.81; (2) declare the tape's `line-height: 1.2`, which also buys back §C.1's one
pixel, ~−40 over eight names; (3) keep the row caption beside its selector at ≥768 by cutting
the row-tape rung to `--type-subheading` (20.35px) on rows only — but that costs the family its
own centre (one tuple) and should be the last resort. If none of the three closes 142px, the
seal itself is the row to re-price with its own ablation, exactly as T6 and mark 13 re-priced it
before (the test's own comment is the precedent: "named, measured, ablated").

**The goldens are safe.** The card's width is **byte-identical** at every cell — 324.22 at 1280,
330 at 1440, 224 at 1280-coarse — so `cell-light` and `grid-corner-light`, which walk on 6px of
card width, do not move. The live-filter population is **24 → 24** on my own count (the budget's
own census is `filterBudget.ts`; the overlay adds no `filter` declaration and no `url()`
reference, and the two drawn edges are pre-baked geometry per R6 law 37).

### C.3 · BUTTONS — three treatments, radii, the hover lift, the ring

**Three treatments, applied to all seven censused controls.** BOXED: `deal` alone, a drawn
outline at the tongue's 2.5 (`drawn['.icon-btn.deal-btn'].drawnStroke` null → **2.5**). BARE:
every other verb and tool — `.info-glyph` loses its 1.5px ring and its 50% radius (border `1px`
→ **0px**, radius `50%` → **0px**), `.players-leave` loses `text-decoration: underline`. CHIP:
options keep the seeded scribble untouched.

**Radii, measured:** `.ctrl-btn` 6 → **8**, `.info-btn` 0 → **8**, `.mobile-heading-btn` 0 → **8**
(invisible hit boxes); `.deal-btn` 8 → **0**, `.info-glyph` 50% → **0**, `.action-bar` 0 → **0**
(anything drawn). Five radii become two.

**The hover fill retires** and the ink lift stands alone — the 2.9-point lightness step R1
measured is inside the noise anyway, and a ground under a bare word is R6 law 14's fourth form.

**The dashed ring, from painted bytes** (each reading is a difference of two paints of the same
clip, focused and blurred, keyboard modality set first — so the ring's own pixels are the ones
that changed and the ground is what those pixels were):

| ground | HEAD chromium | HEAD webkit | overlay chromium | overlay webkit |
|---|---|---|---|---|
| option chip · the well's paper | 3.72 | **2.15** | 19.45 | 4.59 |
| the primary act · the well's paper | 3.72 | **2.15** | 4.66 | 4.66 |
| a bar verb · the bar's plane | 3.72 | **2.15** | 4.66 | 4.66 |
| the tongue · the page | 18.99 | 18.99 | 18.99 | 18.99 |

Two things fall out. **The shipped WebKit default ring measures 2.15:1 on the card's paper — it
fails the 3:1 non-text floor today**, at HEAD, in the engine the owner actually uses. That is a
live row this family's cure happens to close, and it belongs in the spec as its own line. And
the answer to the charter's question: `currentColor` on the quiet rung is **fine** — the card's
verbs carry `--color-muted-foreground` `rgb(115,115,115)`, which the bytes read at **4.66:1**,
and the lower rung `--ink-press-quiet` is ledgered at 5.23:1 light / 6.06:1 dark
(`GameControlPanel.vue:1615-1617`). `.players-leave` could not be read — it only exists inside a
session — so the spec should carry it as a named check, not as an assumption.

### C.4 · MOBILE TABS — two row-tapes, pressed and lifted

| reading | HEAD | overlay |
|---|---|---|
| `size` box | 44 × 44 | **52.52 × 44** |
| `level` box | 50.38 × 44 | **94.78 × 44** |
| active affordance | `text-decoration: underline` 2px/offset 4 | **none** — the CSS underline dies |
| pressed | — | 0° (`matrix(1,0,0,1,0,0)`), opacity 1, washi ground |
| lifted | — | **1.5°** (`matrix(0.999657, 0.026177, …)`), opacity **0.68**, washi ground, value word on its right end |
| inactive panel's options | `display: none`, 0×0, 3 options | **unchanged** — W2's one-panel mechanic untouched |

The 44 floor holds in **both** dimensions on both tabs, and the per-dimension negative control
breaks on the axis it strips and only that one: `min-width: 0` → 12×44, `min-height: 0` →
52.52×12, identical in both engines.

**How a reader learns the lifted tape is a tab.** Three tells, in order of strength, and none of
them is new vocabulary: it is a tape **beside** a tape at the same rung, inside the same
compartment, which is the one place in the card two names share a row; it is **lifted** — the
tilt is the estate's own washi signature and the 0° pressed pose is the one flat tape on the
screen; and it carries its **value word** on its right end, which a pressed tape never does. The
honest gap is the same one the shipped card has: `aria-expanded` is the only programmatic
statement, and it is W3's to strengthen, not this family's.

### C.5 · THE BAR — chrome yes, burial no, and why the reserve does not pay

**Term 1 greens outright.** The bar draws at the wells' own 1.5 as a fifth compartment; its
`ownChrome` reads true in both engines at every cell; the skirt stays an outset (`::after`,
`inset: 100% 0 auto 0`, height `--card-pad-b`) and the z-ladder is unchanged — frames/content ≤1
< sentinel 30 < pinned tag 35 < hover tape 50 < **bar 60** (`GameControlPanel.vue:1518-1524`,
`:2187`, `SheetWashiLabel.vue:110-116`).

**The landscape arm works and costs what it should.** Adding
`(max-width: 1023.98px) and (orientation: landscape)` to the sticky key takes the bar from
`position: relative` to `sticky` at 900×500, which is the cure for R1's measured defect
(`clear · fill · solve · share` at visFrac 0 with no bar to hold them). Its price is the burial
it brings with it: 0 → **0.204**.

**Term 2 does not green, and the reserved flow height is not why.** Reserving the bar's own
height at the card's foot guarantees the card's END state and nothing else: at any intermediate
scroll a sticky bar covers whatever is passing under it, by construction. Measured worst
coverage after the reserve is 0.856 (dock) / 0.123 (desk) / 0.117 (coarse) / 0.064 (rail) /
0.204 (landscape) — better in one cell, worse in two. I added the honest measure beside I2 (the
well's box clipped to the card's scrollport first, so a group scrolled out of view is not
counted as "buried") and it agrees: 0.889 → 0.856 on the dock.

**So M04 splits in two and the spec should say so.** The chrome is a design row and it is done.
The burial is a **layout** row — R7 §6.1 called it "a layout row and someone should own it
explicitly" — and the only shape that closes it is the bar leaving the scrollport: the card's
`max-height` shrinks by the bar's height and the bar becomes a band in the sheet below it. That
is W2 mechanics, not W7 voice, and this lane recommends the spec name it as a dependency rather
than claim it.

### C.6 · THE QUICK SET — earns its place in landscape, is a second toolbar in portrait

Three tongues under one outline (`undo · redo · controls`), measured at the three cells:

| cell | free board edge | strip | tap floor | acts at 0 taps before → after | duplicated by the ribbon |
|---|---|---|---|---|---|
| 390×844 portrait | **274 → 90px** | 276 × 48, right-aligned | 3 × 92×48, both dims ≥44 | undo ✓ redo ✓ controls ✓ → same | **2 of 3** |
| 844×390 landscape | 318 → 318px | 48 × 276, right flank | 3 × 48×92 | undo ✗ redo ✗ controls ✓ → **undo ✓ redo ✓ controls ✓** | 0 |
| 900×500 landscape | 292 → 292px | 48 × 276, right flank | 3 × 48×92 | undo ✗ redo ✗ controls ✓ → **undo ✓ redo ✓ controls ✓** | 0 |

M13's own fence fires in portrait and only in portrait. `#fold-tools` already carries
`undo · redo · hint · peek` at zero taps there (366 × 61.58, four acts), so a strip that repeats
two of them is a second toolbar by the measure, not by taste — and it spends 184 of the board's
274px of free edge to do it. In landscape the ribbon is `display: none` (`scene.css:551`, the
portrait-only `.fold-tools` block) and the tongue is the only control in the viewport; the strip
is the only thing that puts undo and redo on screen without opening the sheet, which is exactly
what the owner asked for.

**The verdict for §14: keep the quick set, LANDSCAPE ONLY.** One law, two poses, same as the
tongue's own: the edge that faces the page's slack carries the strip where there is no ribbon,
and carries the single tongue where there is. That is not a compromise; it is the same sentence
`DrawerTab.vue:13-40` already writes for the tongue's three berths.

### C.7 · THE CONFIRM — the two-tap sublabel over the whole destructive set

R7's I4 measure, re-run one verb per fresh page with `localStorage` cleared and a locator that
does not key on the label under test:

| verb | HEAD | overlay |
|---|---|---|
| Deal | armed, `sure?`, 0 cells | armed, `sure?`, 0 cells |
| Clear | armed, `sure?`, 0 cells | armed, `sure?`, 0 cells |
| Fill | **not armed, 43 cells (chromium) / 49 (webkit)** | **armed, `sure?`, 0 cells** |
| Solve | **not armed, no guard either way** | **armed, `sure?`, 0 cells** |

**I4 GREEN, both engines, no dialog anywhere in the DOM.** The face is the one the owner has
passed twice: `--color-red-ink` at weight 600 — measured `rgb(208, 42, 82)` light and
`rgb(255, 92, 124)` dark off the engine's own resolved colour, which computes **4.99:1** light
and **6.39:1** dark on `--color-card`, clearing the 4.5:1 text floor in both regimes
(`GameControlPanel.vue:2043-2052` is the record for the token). The charter's 4s disarm window
is the one number that differs from the incumbent's 2500ms; the spec should either move both or
neither, because two windows on one idiom is how a second grammar is born.

W1 §1.5 owns the arming and has not executed (R7 §6.3). This lane proved the FACE only, with a
capture-phase guard in the overlay; `proto/` banks it so the next pass can replay it.

### C.8 · THE 390 SEAM

`--sheet-chrome` derived off the seam itself (the case's drawn stroke against the wordmark's
foot) plus 8px of air:

| width | HEAD chromium / webkit | overlay | `--sheet-chrome` |
|---|---|---|---|
| 390×844 | **−2.73 / −3.02** | **+8.00 / +7.98** | 192 → 202.73 / 203.02px |
| 375×812 | +5.77 / +5.48 | **+8.00 / +8.48** | 192 → 194.23 / 194.52px |
| 430×932 | +14.11 / +13.98 | +8.00 / +7.98 | 192 → 226.73 / 227.02px |

Two stroke widths is 6.00px, so **375 clears by 8.00 ≥ 6.00** and the kill condition is cleared
at every width. Two cautions for the spec. The derivation must be **one-sided** — `max(shipped,
needed)`, never "exactly 8" — or 430 loses air it already had (14.11 → 8.00 above). And the seam
is **coupled to the voice**: at 430 the shipped case is content-sized, and the taller card makes
it hit its cap, which re-opens a seam that was clear at HEAD. Derive after the voice, not before.

**The masthead-to-board gap is untouched: 7.00px chromium / 6.41px webkit, before and after, at
every width.** `--sheet-chrome` caps a fixed sheet; it never reaches the masthead. (T8-M20's own
4.4px reading at 900 stands on its own pose in R7 §2; my 7.00/6.41 are this deal at these cells
and are cited as such.)

---

## D · KILL CONDITIONS

| condition | verdict |
|---|---|
| the F12 clip returns if the tape's overhang exceeds the dock card's 3.75px top clearance | **CLEARED, by 1.04px.** The clip does not return. One pixel is not a margin — §C.1 names two ways to buy back 10 and neither touches the card's padding, so the iPad seal and the two 6px goldens pay nothing. |
| three tongues on one edge reading as a toolbar | **FIRES IN PORTRAIT** (2 of 3 acts already at zero taps in the ribbon, 184 of 274px spent), **CLEAR IN LANDSCAPE** (the ribbon does not exist there; the strip is the only home undo and redo have). The quick set is landscape-only, and the family is unharmed — the charter's own words: "the family's quick set is dead, not the family". |
| the tape astride every compartment is the "label above every block" tell | **SURVIVES, thinly.** The size ratio is 1.2945 against the chips and the drawn compartment sits under every tape, which is the proof the charter asked for rather than an assertion. But the two RANKS are carried by ~8px of offset and one crossed stroke (§C.1), and that is the thing a critique pass should hunt. |
| a dashed `currentColor` ring on a quiet-rung control may fall under 3:1 | **CLEARED on four grounds, both engines: worst 4.59:1** from painted bytes. The reverse turned up instead — WebKit's shipped default ring reads **2.15:1** on the card's paper at HEAD. |
| **(new) the iPad coarse seal** | **BROKEN: 1227.09 → 1369.45 against a 1227.5 seal, +141.95px.** Not a kill — the price is itemised and three levers are named — but it is the row the family must land before anything else. |
| **(new) I2 term 2** | **NOT GREENED.** Chrome yes, burial no; the burial is W2 layout, not W7 voice (§C.5). |

---

## E · THE RECOMMENDATION

**DEVELOP**, with the adjustments named.

The centre held where it was tested. One tuple for all eight names greens the born-RED
instrument at every cell in both engines with no row weakened and the full population of eight;
the phone's ratio goes 1.0175 → 1.2945 by construction, not by a second number; the half-life
release puts the right tape at the top of the card at every scroll state, which is the owner's
own acceptance sentence for M03; the drawn 1.5 bar, the three button treatments, the two radii,
the pressed/lifted tabs and the dashed ring all land inside the standing laws — one box grammar,
neutral washi, filter budget unmoved, card width unmoved, `access.spec` 2.1/2.2/2.3 green in both
engines before and after — and the destructive set finally asks the same small question four
times over with no modal anywhere. The register question the charter feared ("a 25.9px tape
reads as a banner") answered the other way: it reads as tape because the compartment under it
does the work.

Three adjustments, in order. **First, the height**: the card runs 142px past the iPad coarse
seal and that is the only number here that stops a spec being written today; drop the bar's
reserved flow height, declare the tape's line-height at 1.2, and re-measure before reaching for
the seal itself. **Second, the bar**: M04 splits — the chrome is done, the burial is a layout row
that needs the bar out of the scrollport, and the spec should name that as a dependency on W2
rather than claim it. **Third, the quick set**: landscape only, one law and two poses, because in
portrait it repeats two acts the ribbon already gives at zero taps. Two smaller things that will
otherwise fall out of the spec: the family needs a seventh role token (`--type-name`) because
`--type-tag` is carrying four non-names, and the 768–1023 option arm's 22px chip leaves the ratio
at 1.177, under the law's own floor, at a cell the instrument does not visit.

Nothing here closes a mark. U-10.
