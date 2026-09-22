# T9-W7 · pass 4 · PROTOTYPE · CTRL-TAPE — the taped case, RUN

Work tree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27`
(branch `worktree-wf_f72f3b5a-83a-27`, base `74a2b5d9`, **uncommitted** — the pass-3 diff advanced
IN PLACE, no replay). Prototype dev server 127.0.0.1:**4230**; the shared HEAD control
`.claude/worktrees/w7-control` served at 127.0.0.1:**4231** and verified by its own asset hash
`index-CubiZsMVSwTc.js`; the built dist served at 127.0.0.1:**4232**, identity
`index-3gxpxZJXYNsI.js`. All three killed by recorded PID. Every π row names `74a2b5d9`.

---

## 0 · The numbers first

| row | reading | where |
|---|---|---|
| **THE SEAL, read** | **1303.44 chromium / 1303.31 webkit** at 1280×800 coarse `isMobile`, regime witnessed `{coarse, row, rail}` | `readings/r4-seal.json` |
| the declared delta | **+19.94 / +19.81** over the 1283.5 it shipped; stamp restamped to **1306.0** (2.56 of engine slack) | `visual-regression.spec.ts:847` |
| **THE CROSSING** (declared line: the painted bbox top of the well's own `<path>`) | `new game` **−4.22 / +38.64** · `pencils` **+0.81 / +31.52** · `checking` **+7.36 / +26.08** · `players` **+12.19 / +21.23** (above/below, chromium; webkit within 0.02) | `readings/r4-seal.json` |
| §2.5b, five offsets × two cells × two engines | **4/4 GREEN**, `worstBelow` −1.20/−1.24 at frac .25, −2.25/−2.28 at frac 1, overlaps `[]` everywhere; born-RED fires in the same run at **2452.5 / 2449.2 px²** over `16×16` and **1801 / 1798.7** over `Corner` | `logs/` + the e2e run |
| the moved bar row + `position: fixed` control | **GREEN both engines**, control fires | `zone-grammar.spec.ts:354` |
| `--sheet-chrome` desk-rung walk + planted spender | **GREEN both engines** (was RED both, two causes, §2) | `zone-grammar.spec.ts:456` |
| W2 §2.2 @ 844×390 / 812×375 `hasTouch` | **GREEN both engines**; tab 48×92 at `belowFold` **−144.11 / −136.61**; card `clientHeight` **739.14 chromium / 739.05 webkit**; `deal` 215.27 below the fold, reachable in one cued gesture | `viewport-law.spec.ts:195` |
| **filter census on the BUILT dist** | **12/12 PASS**, both engines, both regimes — exact match against `filterBudget.ts` (9) | `playwright-throttle.config.ts` |
| **goldens** | **4/4 PASS** on the built dist. No re-mint, no move. | `playwright-golden.config.ts` |
| **THE VOICE TEST** | ONE VOICE, and the ceiling is the printed rung | §3 |
| **THE PIN-BAND TEST** | the derived form HOLDS at every cell; the sampler is dead and LANDED | §4 |
| **π, read from PAINT** | deck tape, axis labels, board and cell **byte-identical** proto vs `74a2b5d9` at four cells × two engines, `line-height` included | `readings/r4-pi.json` |
| **the ring, PAINTED** | `--ring-ink` `#3a7bc4`, consumed bare; painted ink `rgb(58,123,196)`, band **4.289 light / 4.286 dark**, BOTH engines | `readings/r4-ring.json` |
| the confirm's face, **three cells** | ribbon = row width, Δ **0.00** at 390×844, 1440×900, 844×390, 812×375; ink ratio **1.712–1.713** (floor 1.5); frame now `rgb(10,10,10)` / `rgb(237,236,233)`, word `rgb(208,42,82)` / `rgb(255,92,124)` | `readings/r4-face.json` |
| gates, bare | copy-register **0** (0 admitted, 138 files) · theme-selectors **0** · theme-tokens **0** · font-coverage **0** · motion-contract **0** · lane-membership **0** · ink-pressure **0** · live-regions **0** · empty-catch **0** · **sleep-lint 0** (was 1, §7) · prettier **0** · knip **0** · `vue-tsc -b` **0** | |
| unit | **68 files / 831 tests**, all passed (chunked 42/503 + 26/328, then whole) | |

---

## 1 · THE SEAL, READ NOT CARRIED (charter 1) — closed

Measured on THIS tree, in the same run as its ablations. `SEAL` moves 1283.5 → **1306.0** with the
delta declared in the comment and W2's row cited by path (`waves/T9-W2-viewport-law.md` §2.5).
The pass-1 `ablate.json` cite is STRUCK; the comment now cites `readings/r4-seal.json`, taken here.

| term (one declaration reverted in page) | chromium | webkit |
|---|---|---|
| the name rung 25.888 → 14.05 | −113.75 | −113.62 |
| the wells' top padding back at 0.35rem | −113.85 | −113.84 |
| the tape's leading 1.2 → 1.5 | +31.06 | +31.07 |
| the first well's `margin-top` 0.35rem → 2rem | +26.40 | +26.41 |
| the pin band back at the utility class's 20px | 0.00 | 0.00 |
| the bar back in flow inside the card | 0.00 | 0.00 |

The ablations are not additive. The two zeros are the readings worth keeping: the pin band is the
CARD's padding and the probe measures the WRAP inside it, and a sticky bar already occupies its
normal-flow slot.

**THE CROSSING, with its reference line declared once** (chair §6.1): the painted bounding-box top
of the well's own `HandDrawnOutline` `<path>`, taken on the `<path>` element, not the `<svg>` and
not the `.tray-well` — the container over-reports by the stroke's own excursion (measured
+5.04 / +0.56 / −5.44 / −10.28 across the four wells). Read once per well, both engines, at
scrollTop 0, iPad coarse:

| well | above the line | below it | container over-report |
|---|---|---|---|
| new game | **−4.22** | 38.64 | +5.04 |
| pencils | +0.81 | 31.52 | +0.56 |
| checking | +7.36 | 26.08 | −5.44 |
| players | +12.19 | 21.23 | −10.28 |

**The first well's tape does not straddle: it lies wholly BELOW its frame's painted top edge, by
4.22px, in both engines.** The `−3.47` that pass 2 could not reproduce reproduces here at −4.22
against a reference line that is now named. The spec's "taped across its drawn frame" is true of
three wells and false of the first. Reported, not smoothed (§8 gap 1).

## 2 · `--sheet-chrome` — the row was RED twice, both cured

Cause A, the branch order: `CSSStyleRule` implements `CSSGroupingRule` under CSS nesting, so
`"cssRules" in rule` is true for every style rule and the walk examined none. `instanceof
CSSStyleRule` is tested first now and the rule is still recursed into afterwards.

Cause B, the `:root, :host` spender: it is the build's own down-level twin of this tree's
`@property` block. **The row's subject narrows to READERS** (`var(--sheet-chrome)`) and the comment
says why the choice is the law's meaning and not a convenience: a registration at its initial
cannot go stale, and an authored declaration at a desk rung is dead ink unless a reader at that
rung spends it — which is the thing the law forbids. The negative control plants a reader. The
masked `catch` is gone: the walk counts sheets it cannot enter and asserts that count is **0**.

**AND THE COMMENT THAT CLAIMED TWO GATES NOW HAS ONE.** `index.css` §6.5 said the trade was held
by "two e2e rows"; they lived in a probe. `zone-grammar.spec.ts:536` is that row, green both
engines, with the DISCRIMINATOR the critic asked for: a registered `<length>` handed
`zzz-not-a-length` computes to its **initial**, an unregistered one keeps its token text. Its
negative control is an unregistered name on the same host (chair §6.5's fourth clause).

## 3 · THE VOICE TEST — ONE VOICE, and the number that ends it

`--type-name` already resolves to CTRL-FACE's printed rung, and spelling `--face-printed`'s
25.888px changes nothing (identical to the hundredth at every cell). Swept over the rung, five
cells × two engines, §2.5's closed form re-read at each (`readings/r4-forks.json`):

| rung | dock `worstBelow` | overlaps | panelH rail / iPad |
|---|---|---|---|
| head's own 14.05 | −15.97 / −15.99 | 0 | 1029.22 / 1189.69 |
| **printed 25.888 (shipped)** | **−1.20 / −1.24** | **0** | 1142.97 / 1303.44 |
| one rung up 31.4 | **+5.67 / +5.63** | 0 | 1195.98 / 1356.45 |

**REPORT: one voice, and the printed rung is the CEILING, with 1.20px of band left.** One rung
higher and the pinned tape hangs 5.67px below the exempt band at the dock in both engines — §2.5's
closed form breaks. The fork is answered by the number: FACE's rung is the largest single voice the
card's own geometry admits.

## 4 · THE PIN-BAND TEST — the derived form holds, and the publisher is DEAD

On this tree `--pin-band` was ALREADY COST's derived calc (`scene.css`: `0.6rem + --washi-tag-h`,
no JS). What was published was `--card-pad-t`, a `ResizeObserver` SAMPLE of the card's computed
`padding-top` — which has exactly one declaration in the estate and it is `var(--pin-band)`. So the
test this tree can run is the one the merge watch means: kill the sampler, point its three readers
(the top sentinel, `--washi-tag-top`, §2.5's exemption line) at the band.

Read both ways at five cells × two engines: **43.8656px either way, the same `worstBelow`
(−1.20 / −1.24 at the dock, null where no tape pins), the same zero overlaps.**

**LANDED.** `card.style.setProperty("--card-pad-t", …)` deleted; `@property --card-pad-t` deleted;
five reader sites re-pointed at `var(--pin-band)`. A derived band also lands before first paint
where a published one lands after it. **COST's centre is a graft and the merge watch's condition is
met on this tree with a number.**

## 5 · THE LEADING WAS ESTATE-WIDE — scoped the way the rung is

`.washi-tag`'s `line-height: 1.2` was written into the shared rule, and `.washi-tag` is
StagingBand's deck tape too. `--washi-tag-leading` is now a CONSUMER-declared token with the
estate's 1.5 as its defended fallback, declared on `.controls-card` beside `--washi-tag-rung`;
`--washi-tag-h` reads it, so the pin band stays one number. Measured after the scoping, deck tape
`new game`, proto vs `74a2b5d9`, both engines:

| cell | proto | control |
|---|---|---|
| 1440×900 | 65.39×19.63 @ 14.384px, **lh 21.576px** | 65.39×19.63 @ 14.384px, **lh 21.576px** |
| 1280×800 | 64.16×19.63 @ 14.048px, lh 21.072px | identical |
| 390×844 · 844×390 | 64.00×19.63 @ 14px, lh 21px | identical |

Pass 3's leak (18.27 → 14.61px of line box at 390, 21.58 → 17.26 at 1440) is gone.

## 6 · π, AND THE r0 ROW THAT MOVED (charter 6, 7)

The pass-3 instrument took `".washi-tag, .staging-axis-label"` — index 0 on the gallery is the
card's own hidden 0×0 tape, so every "Δ 0.00" compared 0 to 0. This one selects
`:not(.controls-card *)`, asserts a box, and reads computed PAINT (size, family, weight,
line-height, colour, letter-spacing, transform) plus tag names, at four cells × two engines,
against the `74a2b5d9` server, both arms on the same pinned board. **Every deck tape, every axis
label, the board and the cell are identical, byte for byte.**

**THE MOVED ROW — r0's heading instrument (`r0/r1-controls/probe/heading-voice.spec.ts` ROW 2).**
Its RED at HEAD was "only 2 of 8 group names are document headings". Measured now
(`readings/r4-heads.json`):

| route | tree | `<h#>` in DOM | in the card | aria headings |
|---|---|---|---|---|
| play | control | 3 | 2 | **2** |
| play | proto | 9 | 8 | **8** |
| gallery | control | 3 | 0 exposed | **1** |
| gallery | proto | 9 | 0 exposed | **1** |

ROW 2 is cured: 8 of 8. The document's `<h2>` population moves 2 → 8 wherever the card mounts,
**including `/?view=gallery`** — and that is a DOM fact, not a reader-visible one: the gallery's
aria heading roster is **1 on both trees, both engines**, because no card heading is exposed there.
π holds in the accessibility tree on the surface this wave does not claim. (Note against my own
instrument: `marks` and `what fits` are `display: contents`, so they have no box and my `exposed`
predicate misses them while `ariaSnapshot` counts them — the ariaSnapshot number is the authority.)

## 7 · THE OWNER'S EYE — I1 green, I2 / I3 / I4 RED on moved subjects, and each re-read

The r0 instrument, COPIED with BASE and OUT re-pointed (`instruments/p4-owners-eye.mjs`), reads
**5 RED / 7** here. I1 is GREEN (**1 voice at 1440×900: 25.888px | Patrick Hand | 500**). I5 and I6
are §11's and §13's rows, not this family's, reported unchanged. **I2, I3 and I4 are each the
instrument reading a subject this design moved**, re-read with the subject where it now is
(`instruments/p4-i234.mjs`, both engines identical) and PROPOSED as a diff, never applied
(`instruments/PROPOSED-r7-I2-I3-I4-subjects-moved.diff`):

- **I2 (M04 term 1)** — bar box [769.23, 836.00], scrollport [253.47, 769.23]; the bar's top edge
  IS the port's bottom edge; `barInFoot: true`. `pencils` unclipped **0.312**, **clipped to the
  scrollport 0.000** — as are all four wells. The bar covers nothing; r0's 31.2% is a well
  scrolled out of view whose rect still reaches into the foot.
- **I3 (M03)** — every tape r0 calls pinned, with its pose: at 160 `new game` sticky / not
  released / **visible**, well 0.794. At 327 / 500 / 717 it is `static`, `released: true`,
  **`tapeVisible: false`**, well 0.483 / 0.161 / 0.000. At 717 `pencils` is sticky / not released /
  visible at well 0.635. Every tape that is pinned AND in the port names a well ≥ half on screen.
- **I4 (M12)** — four verbs, one tap each, dirty board: `r0Armed false` (the `sure?` pose §15
  deleted) but `ribbonArmed true` with "start a new board?" · "clear the board?" · "fill in the
  sure cells?" · "fill in the whole board?", role `group`, and **`cellsWritten: 0` on all four** —
  the law's own clause was green all along.

**§2.6 IS RED ON THIS TREE IN BOTH ENGINES AND THE RED IS LATENCY, NOT THE POSE.** `STICKY_CENSUS`
writes `scrollTop` and reads `getComputedStyle` in one synchronous task; `data-released` is an
`IntersectionObserver`'s. SYNC reads `pencils` static/visFrac 0; SETTLED (+400ms) reads
**sticky / visFrac 1** at both cells in both engines. The control is green only because at
`74a2b5d9` the card's scroll range is 504/248 and `pencils` needs 599.2/361.7 — the row never had a
second subject. Proposed, not applied:
`instruments/PROPOSED-viewport-law-2.6-settle.diff`. **The row is the chair's.**

**`check-sleep-lint` was RED on this diff's own §2.5b row** (a fixed 900ms in front of a one-shot
geometry read) and is CURED, not tagged: the dock's settled pose is POLLED (the sheet's own top,
unchanged across two 80ms samples, ≤5s), which is the law's own instruction. Bare exit 0 after.

## 8 · The other closures, with their numbers

- **THE RING (charter 10).** MRK-LIVE's line is copied verbatim into `index.css` at
  `--color-focus-sketch`, cited to `pass3/prototype/MRK-LIVE/pass3.diff`; the consumer is
  `var(--ring-ink)` **BARE** (registry §2.9 supersedes the `, currentColor` form). Painted from
  bytes at DPR 2 — focused frame minus blurred frame, the ring's own core pixel against the same
  pixel's ground — **`rgb(58,123,196)` ink, band 4.289 light / 4.286 dark, chromium AND webkit**.
  **AND THE 50% MIX PASS 3 COULD NOT ATTRIBUTE IS NAMED**: Tailwind v4 preflight's
  `* { outline-color: color-mix(in srgb, rgb(10,10,10), transparent) }`, read at t=0 of the chip's
  own `.transition-colors` (which lists `outline-color`). At pass 3 it won outright because
  `--ring-ink` computed to `""`; here it is only the start of the transition.
- **THE RED FRAME (charter 9).** `HandDrawnOutline` strokes in `currentColor`, so `color:
  var(--color-red-ink)` on the BUTTON painted the frame red too. The red moved inward one element
  (`.confirm-go > span`); both frames are the case's own ink. Measured, both engines, both themes:
  frame `rgb(10,10,10)` / `rgb(237,236,233)`, word `rgb(208,42,82)` / `rgb(255,92,124)`. **The
  density ratio is unmoved at 1.712 (rail 1.713)** — the ladder is stroke × path length and colour
  never entered it. `check-ink-pressure`'s closure 3 followed the subject (`.icon-sublabel.is-armed`
  → `.confirm-go>span`), reported MOVED, self-test green.
- **THE CONFIRM AT THREE CELLS (charter 9).** ribbon = row at 390×844 (390.00), 1440×900
  (204.55/204.58), 844×390 (844.00), 812×375 (812.00) — Δ 0.00 everywhere, `keep` 48.36×44 @1.5,
  `clear` 51.36×44 @2.5, both ≥ the 44 floor on both dimensions.
- **THE DOCK RATIO (charter 11).** It was never the dock: `typography.css`'s claim is amended to
  what reproduces — 390×844, both engines, no touch emulation **16px → 1.618**; `hasTouch`
  **20px → 1.2944**; `hasTouch + isMobile` **20px → 1.2944**. A fine pointer under 768 (a narrowed
  desktop window) is the one cell that reads 1.618.
- **THE SIX `--motion-*` RUNGS (charter 14).** STRUCK, not stood in for: registry §2.7 gives §13's
  vocabulary, publisher AND registrations to MOT-LADDER, so a copy here is a re-mint of the same
  names in a second file. Nothing in this section reads a rung; the eight measured `<length>`
  names stay, each with a publisher in this tree and a row that deletes it.
- **THE ARM IS PROBE-CALLABLE (charter 13).** `dirtyBoard(page)` is exported from
  `instruments/p4-face.mjs` — `gallery-deal.spec.ts::dirtySudoku`'s recipe verbatim (blank cell,
  native value setter, dispatched `input`). Both fork probes and the crops use it.
- **THE QUICK SET, DECLARED AND PRICED.** §14/M13 is inside §10's scope (registry §10's own
  header), but the spec, the plan and the pass-3 return never named it. Its price, measured at
  844×390 and 812×375, both engines, both themes, against its own ablation:

  | | strip box | quick set | acts in view | strip ∩ board |
  |---|---|---|---|---|
  | shipped | 48 × 250.3 | 48 × 158.3 | undo · redo · hint, 44 × 52.77, all true | **2002.4 px²** |
  | `#quick-set` ablated | 48 × 92 | — | 0 × 0, all false | **736 px²** |

  It costs **+158.3px of flank and +1266.4px² of board overlap** and buys three acts at zero taps
  where they are otherwise sheet-only. It is in the diff, named here, and it is still a MECHANIC —
  the chair's to keep or to strike (§10 gap 5).

---

## 9 · GAPS, honestly, and the hard parts named

1. **The first well's tape does not straddle its frame (−4.22px, both engines).** The crossing is
   now read against a declared line and the design's own sentence is false for one of four wells.
   Not cured: a lift on the first well moves the seal, and the seal was just restamped. Open.
2. **§2.6 is RED on this tree** (§7). The cure is the chair's ruling, not this lane's edit. If the
   chair rules the row keeps its synchronous read, the family owes a release pose that does not
   lag a frame, and that is a mechanic this pass did not build.
3. **The ring's four grounds are two.** The band is painted on the CARD in both themes and both
   engines (4.289 / 4.286). The well, the tape and the foot were not painted-read — the chip the
   keyboard walk lands on sits on the card. The charter asked for four grounds ≥3:1 and this
   delivers one ground × two themes × two engines.
4. **The ribbon's discriminating occlusion read is non-zero at two cells and UNRESOLVED.** My
   `liveIntersectWorst` reads **237.49 px² over `Deal a new board` at 1440×900** and **577.07 at
   844×390**, 0.00 at 390×844 and 812×375. I did not establish whether that is paint or the same
   unclipped-rect artifact I just proved for I2 — my clip term divides by the box height and is
   not the same predicate CTRL-RULE's critic cured three ways. **Treat the 237/577 as unverified.**
   CTRL-RULE's `ribbon-critic.mjs` is the authority and I did not run it (charter graft, unmet).
5. **The quick set is still an undeclared-by-the-spec mechanic** (§8). Priced here for the first
   time; the spec still does not name it.
6. **The fresh-reader protocol (U-10) was not run.** It needs another lane's agent and this lane
   has no way to summon one. Crop c3 is re-cut so the question ("which of these names are
   groups?") can finally be asked of it; /8 is unbanked.
7. **The case-wide occlusion gate (FACE owns it, charter graft) was not run**, nor CTRL-COST's
   `check-cost-face.mjs`, nor CTRL-FACE's `paintedExtent()` as such — my painted reads are a
   two-frame difference of my own, which is the same idea and not the same instrument.
8. **`--card-pad-b` and `--card-pad-x` are still sampled.** The pin-band test killed one publisher;
   the other two were not audited for the same redundancy. `padding-bottom` has more than one
   declaration on the card, so it is probably genuine; `--card-pad-x` was not checked at all.
9. **No coarse LANDSCAPE reading of the seal.** The seal is the iPad coarse cell only, as W2's row
   defines it; the landscape card's `clientHeight` is reported (739.14 / 739.05) and is not a seal.
10. **I5 and I6 stay RED** and are not this family's (§11's player mark, §13's duration
    vocabulary). Reported, not touched.
11. **The webkit ring needed a scripted focus after one Tab** — WebKit's Tab does not reach a
    `<button>` under the platform's default keyboard access, so `presses=0` and the route is
    `tab-then-focus`. `:focus-visible` is witnessed `true` on the chip either way, but the webkit
    row is not a pure keyboard walk and says so.

---

## 10 · Crops — FOUR, 50 KB total, each a REPLACEMENT

| file | retires | what it shows |
|---|---|---|
| `c1-confirm-redword-390x844-dark-chromium-coarse.png` (6.1 KB) | pass-3 `c2-confirm-armed-390-dark-chromium.png` | the corrected face: `clear the board?`, `keep` at 1.5 and `clear` at 2.5, **both frames in the case's ink, the word alone red**. chromium · dark · 390×844 · **coarse (`hasTouch`)** |
| `c2-confirm-redword-390x844-light-webkit-coarse.png` (8.0 KB) | pass-3 `c1-foot-flush-390-dark-chromium.png` | the same pose in the other engine and theme. webkit · light · 390×844 · **coarse** |
| `c3-pinband-band-and-chip-1440x900-light-chromium-fine.png` (19.6 KB) | pass-3 `c3-pinband-1440-chromium.png` (the mis-cited one) | **the claim, at last**: the pinned `new game` tape inside the band at the card's top edge with the first chip (`16×16`) clear beneath it, at scrollTop frac **0.25** — frac 0.5 is where the first tape has already released, which is why pass 3's crop had no tape in it. chromium · light · 1440×900 · **fine (mouse)** |
| `c4-quickset-flank-844x390-light-chromium-coarse.png` (16.3 KB) | pass-3 `c1-foot-inset34-390-dark-chromium.png` | the §14 mechanic this diff carries, seen: undo · redo · hint above the `controls` tongue under one drawn outline on the board's right flank. chromium · light · 844×390 · **coarse** |

---

## 11 · The replay route

**IN PLACE.** The chair banked the pass-3 tree at `pass3/prototype/CTRL-TAPE/pass3.diff`, so the
record is safe and this worktree advanced forward. Nothing was replayed, reset or re-applied.
`git -C <work> diff --stat` at open read **20 files, +1967 / −632**, which agrees with the pass-3
README's file list (20 modified + `ConfirmRibbon.vue` untracked); the pass-3 README's own count is
the same twenty, and the untracked file is the section's confirm face, named in its §2.

---

## 12 · Incidents, self-declared

1. **The first π run banked eight `ERR PAINT is not defined` rows** — a helper defined in node
   scope and called inside `page.evaluate`. Caught by the instrument's own error field, fixed by
   inlining, re-run whole. No number from that run is in this README.
2. **The first ring probe measured nothing useful and I nearly reported it as a finding.** Two
   defects at once: the painted band took the WEAKEST-changed pixel (a dashed stroke's AA fringe,
   worst 1.072 — meaningless), and the WebKit Tab walk never reached a chip (`presses=0`), so the
   row read whatever had focus. Both are in the instrument's header now; the numbers in §8 are
   from the second run.
3. **My first ring reading said the ring does NOT drink from `--ring-ink`** — `oklab(0.144521 …
   /0.5)`. That was the transition's start value, read in the same task as the focus. It is also
   exactly what pass 3 read and could not attribute, so the mistake turned into §8's attribution.
   I state it because a return that only shows the corrected reading hides how close it came.
4. **The first build shared the serve's `cacheDir`** (LAWS forbid it). Killed within a second and
   re-run against `.vite-cache-ctrl-tape-build`; the dist reported here is the second build's.
5. **No server was killed by a path prefix this pass** — the pass-3 incident's cure held. Three
   PIDs recorded at launch, three killed by PID, band verified free at return.
