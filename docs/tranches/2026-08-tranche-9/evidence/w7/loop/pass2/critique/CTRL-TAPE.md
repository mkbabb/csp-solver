# T9-W7 · pass 2 · CRITIQUE · CTRL-TAPE — the taped case

Adversarial read by a lane that wrote neither the spec nor the prototype. Every number below
marked **(mine)** was re-measured in this critique on the prototype's own worktree
(`wf_8630d340-e56-28`) served on 127.0.0.1:4233 (scratch vite config, private `cacheDir`,
killed and verified free before return), chromium AND webkit. Instruments and raw readings:
`critique/CTRL-TAPE/probe/` (`crit.mjs`, `crit2.mjs`, `crit3.mjs`, three JSON banks). No crops
banked by this lane — nothing here needed one. 136 KB total.

**Convergence: 72 %. Verdict: ADVANCE**, with two numbers the adjudicator must rule on and one
booked gap that does not reproduce.

---

## 0 · What I reproduced, independently

| row | prototype | mine (chromium / webkit) | verdict |
|---|---|---|---|
| pin band, every cell | 43.87 | **43.8656 / 43.8656** at all 5 cells | CONFIRMED |
| the seal, `.control-panel-wrap` @1280×800 coarse | 1303.44 / 1303.31 | **1303.44 / 1303.31** vs bound 1283.5 | CONFIRMED — **+19.94 / +19.81 over** |
| rest-state tape ∩ control, all wells, 5 cells | 0.00px² | **0 overlapping pairs**, every cell, both engines | CONFIRMED |
| bar ∩ visible control | 0.00 | **0.00** at every cell; `inCard: false`, `bar.top − card.bottom = 0.00` | CONFIRMED |
| ring from painted bytes | 3.72 / 4.68 chip, 18.83 / 14.99 Deal | **3.72 / 4.68** chosen `level` chip AND size chip, **18.83 / 14.99** Deal, `:focus-visible` witnessed | CONFIRMED to 2 dp |
| the card's voice | one rung | **one** distinct tape font-size, `25.888px`, every cell | CONFIRMED |
| the card's headings | 8/8 | **8/8**, exactly `new game · size · level · pencils · marks · what fits · checking · players` | CONFIRMED |
| deck π (gallery up) | band 192/136 · tape SPAN 57.31×17.63 / 64.16×19.63 · first card y 151.84/149.41 · AX headings 1 | **192 / 136** · **SPAN**, 57.31×17.63 / 64.16×19.63 (wk 57.33×17.12 / 64.17×19.65) · **151.84 / 149.41** (wk 151.53 / 149.11) · **`ariaSnapshot` headings = 1** (`sudoku` [level=1]) | CONFIRMED |
| landscape 844×390 card | 72.3px, scrollH 809 | **maxH 72.3 / clientH 72 / scrollH 809** | CONFIRMED |
| the foot's berth | flush at the viewport bottom | `foot.bottom == innerHeight` **844/844, 500/500, 390/390** | CONFIRMED |
| `check-copy-register` · `check-font-coverage` · `check-theme-selectors` | exit 0 ×3 | **exit 0 ×3**, run bare | CONFIRMED |

The prototype's numbers are honest. That is worth saying plainly before the rest: I went looking
for inflation and found, on eleven rows, agreement to the second decimal on two engines.

---

## 1 · THE THREE FINDINGS THIS LANE ADDS

### 1.1 The crossing's number does not reproduce — and it is the gap the adjudicator is being asked to weigh against the seal

Gap 2 of the return says the memorable thing is "materially quieter": a table of `+0.54 / +7.64 /
+11.35 / +13.49` at the rail and **`−3.47` (no crossing at all)** on the first well at the iPad
coarse cell, against pass 1's ~29–32px straddle.

I measured the same quantity against **both** reference lines a reader could mean **(mine)**:

| cell | reference | new game | pencils | checking | players |
|---|---|---|---|---|---|
| rail 1440×900 | painted path bbox top | **34.63** | 25.43 | 22.85 | 20.68 |
| rail 1440×900 | well border-box top | 33.60 | 30.96 | 31.52 | 31.51 |
| iPad coarse 1280×800 | painted path bbox top | **34.79** | 25.46 | 22.80 | 20.58 |
| dock 390×844 | painted path bbox top | 26.09 | 23.15 | 20.98 | 21.05 |

Every well crosses its stroke by **20.6–34.8px on every cell**, and the first well at the seal
cell — the one the return says does not cross at all — crosses by **34.79px**, the widest
straddle on the card. Both engines agree; the numbers are stable across three runs.

The return never names the line its numbers are taken from, so I cannot say which read is right.
What I can say is that the gap as booked is **not reproducible from the return**, and it is
precisely the gap that asks the adjudicator to trade the owner's re-look pose against the seal.
A gap that moves a ruling has to carry its reference line.

> CLOSABLE: state the crossing's reference line in the return and re-take the four wells' numbers
> at all three cells; if the `−3.47` stands under a named line, keep gap 2, and if it does not,
> strike gap 2 and the seal is the pass's only real question.

### 1.2 The no-fallback chain has a boot window, and its failure shape is not the one the spec describes

`--sheet-chrome: max(12rem|4rem, calc(var(--masthead-foot) + 8px - var(--case-offset)))` carries
no fallback by design, and the comment argues the absence makes failure "LOUD, which is the only
failure a gate can read." Gap 5 concedes the gate was never built. **I built it** (`crit2.mjs`
§A) — strip both published terms at 390×844 with the sheet up:

| reading | publisher present | publisher absent | Δ |
|---|---|---|---|
| card `max-height` | 523.77px | **`none`** | cap gone |
| card `clientHeight` | 524 | **809** | +285 |
| `.drawer-case` height | 590.53 | **875.77** | +285.24 |
| `.scene-controls` top | 253.47 | **−31.77** | the sheet rises **31.77px above the viewport's top edge** |
| the seam (wordmark foot 214.73 → sheet top) | +38.74 | **−246.50** | inverted |

WebKit: sheet top **−32.00**, case **875.67**, identical class. So the loud failure is not a
conspicuous 12rem band — `var()` invalid-at-computed-value-time propagates through
`.controls-card`'s `max-height` and the sheet swallows the masthead whole and overruns the
viewport. That is worse than the masked fallback it replaced, and still ungated.

**And the state is not hypothetical — it is the first painted frame of every load (mine).**
Sampling the card's cap every `rAF` from first paint at 390×844:

| engine | first sample | second sample | window |
|---|---|---|---|
| chromium | t 97.4ms · `max-height: none` · h **809** | t 120.1ms · 523.77px | **~23ms** |
| webkit | t 158ms · `max-height: none` · h **808.91** | t 274ms · 523.48px | **~116ms** |

The `ResizeObserver` callback lands after first paint, so the uncapped pose is real and painted.
On the dock the sheet is closed at boot, so I could not establish that a reader sees it — but a
116ms uncapped frame on WebKit is one resize, one orientation flip or one deep-link-with-sheet-up
away from being visible, and no instrument in this diff would notice.

> CLOSABLE (two sentences, both gates): assert at <1024 that `--masthead-foot` is a non-empty px
> AND `.controls-card`'s computed `max-height` is not `none`, born-RED by deleting the publisher;
> and publish both terms synchronously before first paint (or from a `@property`-registered
> custom property with an initial value) so the boot frame carries a cap.

### 1.3 The re-cut zone-grammar bar row visits three offsets and the known WebKit red lives at the other two

The row now sweeps `frac ∈ {0, 0.5, 1}` and asserts `Math.round(covers) === 0`. The prototype's
own return records a WebKit residue of **68.41px²** "at fractional offsets" — and `Math.round`
does not hide 68.41, so the row is green only because it does not visit `.25` and `.75`, which is
where the residue was measured. The `position: fixed` negative control proves the prober works;
it does not rescue the sampling.

This is the checklist's *gate that cannot fail* in its subtle form: a census whose offsets were
chosen after its reds were known.

> CLOSABLE: sweep the same five offsets §2.5b sweeps, and either the residue reds the row or the
> row states the sub-pixel tolerance it allows and why 0.23px of clip-seam height is not a
> covered control.

---

## 2 · The gaps the return already books, confirmed with my own numbers

1. **The seal is broken by +19.94 / +19.81 (mine, both engines)** and the spec's one lever is
   correctly refused: I accept the lane's ablation table, which reconciles to 1303.45 against
   1303.44 measured. The lever buys the seal by reopening §2.5 at 412.4px². This is a genuine
   budget conflict, not a defect of the design, and it is the adjudicator's.
2. **The landscape arm's collision at 844×390 (mine: card 72.3px against 809px of content, both
   engines within 0.5px)** — a 9 % window onto the card. The seam law and W2's `4rem` decision
   cannot both hold at that cell. Also the adjudicator's.
3. **The foot sits flush at the viewport's bottom edge (mine: 844/844, 500/500, 390/390)**, with
   no `env(safe-area-inset-bottom)` spent. On a home-indicator iPhone the fifth compartment's
   verbs sit under the indicator. This one is a CURE, not a ruling: the berth is the lane's own
   new box and it can pay its own inset.
4. Publisher staleness on WebKit's two DESK rungs where the token is inert; the loud-fallback
   assertion (now superseded by §1.2 above); R7's I2/I3/I4 not re-run; the U-10 fresh-reader
   protocol not run; §2.5b born-RED by ablation rather than by a second tree.

---

## 3 · The failure-mode checklist, item by item

| item | reading |
|---|---|
| vacuous convergence | **CLEAR.** §2.5b's law is an inequality with an in-run negative control that fires at 2452.5px²; the rest-state row, the ring and the tree all read numbers that could have come out otherwise. |
| spec-cites-itself | **CLEAR.** Every §-number resolves to a measured rect or to a chair ruling with its cite (`--ring-ink` carries §6.1 in its declaration). |
| gates that cannot fail | **ONE HIT** (§1.3, the bar row's three offsets). A second, milder: the seam row's `≥ 8.00` is a floor on the CAP, and the realized seam is content-driven (31.80 at 390), so the row greens wherever content is short. It can red — HEAD read −2.73 at 390 — but the row should say which regime it discriminates. |
| the elegant-reduction trap | **CLEAR.** Nothing is deferred with an "and then"; the two hard things (the seal, the landscape arm) are named as unresolved and handed up with numbers rather than papered. |
| legacy aliases | **ONE MILD HIT.** `typography.css`'s `.section-heading` still declares `font-family: var(--font-display)` (Fraunces) while `GameControlPanel.vue:1845`'s scoped rule overrides it to `--font-hand`. Two rules for one role, the loser still naming the face the gate no longer checks. Not a defect today; it is how the next face swap goes silent. |
| masked fallbacks | **CLEAR, deliberately** — and §1.2 is the price of that choice, measured. `--card-foot-h, 0px` and `--card-pad-x, 0px` do keep fallbacks, correctly: those are inert-when-absent, not load-bearing. |
| unverified gestalt | **CLEAR.** Five frames on the real surface, seam frame on both engines. I read all five; crop 3 shows the crossing plainly and crop 4 shows the foot's fifth compartment. Note the chair's cap is **four** crops and five files were banked (two of them the same frame on two engines) — at the letter, over; at the intent, fine. |
| consumer-less substrate | **CLEAR.** `--washi-tag-h` has three readers, `--pin-band` one declaration and three consumers, `--washi-tag-rung` is read by `SheetWashiLabel` with a `--type-tag` fallback, `--card-pad-b` outlives the deleted skirt as the bottom sentinel's reach, `--ring-ink` is spent on every control. `--action-bar-h`, `data-under-bar`, `scroll-padding-bottom` and the union media key all die with their surfaces. |
| the generic default | **CLEAR.** No cream-and-terracotta, no all-caps eyebrow (the eyebrows are lowercase and now in the hand), no numbered markers, no arrow-on-every-link. The card's chrome census is three treatments, one of them boxed. |
| the pixel it moves that it did not declare (π) | **CLEAR on the surfaces I could check.** Deck: five readings Δ 0.00 on both engines, AX headings 1 **(mine)**. I traced `--type-option`'s 22→20 change to its only consumer (`OptionSelector`) and measured the deck's staging chips at the 768–1023 rung where the change bites: **16px at 800×1000 and 900×500 (mine)** — `StagingBand` overrides the token, so the deck does not move. `--type-group-title`'s re-point reaches `.section-heading`, whose only consumer is the card. |
| the constraint it forgot | **AA: CLEAR** — ring ≥ 3:1 on three grounds I sampled, both themes, both engines, `:focus-visible` witnessed. **filterBudget: CLEAR** — untouched; the two new `HandDrawnOutline`s are `:pose="0"`, pre-baked, and the dist census reads 6/6 with the allowlist. **M16: CLEAR** — `check-copy-register` exit 0 bare, and the `candidates` admission is struck in the same commit that cures the string, which is what the admission's own text demanded. **W2's four named mechanics: CLEAR** — sticky tag kept, dock kept, bottom tab kept, tap floor **preserved by a declared delta** (the floor moves to `.mobile-heading-head`, measured 52.53×44 and 94.80×44; the spec's literal shape would have emptied it). |

### The one scope flag

The charter says design the voice on W2's landed mechanics, never new mechanics. Two things in
this diff are mechanics, not voice: the **half-life release** (`data-released`, published from
`publishFold`) and the **bar's move out of the scrollport** into `#card-foot`. Neither is one of
the four mechanics the charter enumerates, and the lane's own pass-1 comment says the bar's move
"is W2 layout" — it then took it anyway, because M04 term 2 cannot be answered inside the port.
I do not read this as a violation; I read it as a decision the adjudicator should make
knowingly rather than inherit.

### On the moved instruments

The five MOVED rows are honest: the subject moved and the row was re-cut in the same diff, each
with its reason, and none was re-worded to pass. The r0 law-probe copies are correctly re-pointed
at the worktree and the r0 originals untouched. One caveat: **L3's re-aim is weaker than the row
it replaces.** The old row asserted the admission ledger held exactly two entries; the new one
asserts the gate exits 0. The re-aim is justified (a cure turning a law red is an instrument bug)
but the new form stays green while a future wave adds admissions. Say so in the row.

---

## 4 · Strengths worth carrying

- **One number, three readers.** `--pin-band` is the card's padding, §2.5's exemption line and
  the well's resting hang, and the pin's offset cancels it. The law is a closed-form inequality
  rather than a census result, which is why the rest-state row reads 0.00 and not 0.212.
- **M04 term 2 closed by construction, not by pricing.** Moving the bar out of the scrollport
  turns a coverage number into a layout property. No offset can put a control under a box that
  is not in the port.
- **The consumer declares the rung.** Pass 1 wrote `--type-name` into the shared component and
  re-cut the deck; pass 2 makes the rung a token the card asks for and the component falls back
  to `--type-tag`. This is the correct shape for any shared primitive with two voices, and it is
  the reason π holds on the deck — I confirmed the whole five-reading table on both engines.
- **The publisher reads the ink.** `svg.handwritten-logo`'s bottom, not the menu host's box, with
  the 7.00px "staleness" correctly re-diagnosed as a BOX and not a clock. The wrong first
  selector (the Deal button's icon, 230px wrong) was found by a red and written down.
- **Two refusals with their numbers.** The spec's one lever is refused with the 412.4px² it costs,
  and 45 % of foreground is refused with the 3.15 it reads. A lane that prices its refusals is
  a lane whose acceptances mean something.

---

## 5 · Verdict

**ADVANCE at 72 %.** The design is built, runs on both engines, and pays every law it set out to
pay with numbers I could reproduce. It is not at 100 because eleven gaps stand open, two of them
are design choices this lane correctly declines to make alone, one booked gap does not reproduce
(§1.1), one failure mode is measured here for the first time and ungated (§1.2), and one re-cut
gate samples around its own known red (§1.3).

Nothing here is a RETIRE: no constraint is violated, no rewording, AA and filterBudget and M16
and π and W2's four mechanics all hold. Nothing here is a BLOCK: the seal is a budget conflict
inside a known trade space, not a missing primitive.

**For the adjudicator, in order:** the seal's +19.9 with the lever refused; the crossing's
reference line (§1.1) before gap 2 is weighed; the landscape arm's 72.3px card. The other eight
are cures the lane can take in pass 3.
