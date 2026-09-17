# T9-W7 round zero · lane R7 — THE OWNER'S EYE

The ten marks of the animation-and-controls half, each pinned to the pixel it points at in
the owner's own frame, then re-measured on THIS tree. Round zero is read-only: nothing under
`web/frontend/` was touched.

    TREE        4686436f + the uncommitted W3/W6 work being sealed alongside (46 modified,
                21 untracked at read time)
    SERVER      npx vite --host 127.0.0.1 --port 4247 --strictPort   (dev, in band)
    ENGINES     playwright webkit + chromium, headless, own scripts — never the estate's
                default config. No Safari, no osascript, no :3000. M19 clean.
    POSES       390×844 dark playing · 390×844 dark sheet-open · 390×844 light playing ·
                844×390 + 900×500 landscape · 900×{480…1000} dark · 1280×800 · 1440×900
    SETTLE      the dock sheet slides — every open-sheet read is taken ≥900ms after the tap
    PROBES      probe-r7.mjs / r7b / r7c / r7d / r7e / r7f / r7g  (+ the .json each wrote)
    FRAMES      frames/, 8 crops, 412 KB total, largest 103.7 KB

The formation census (registry.md F18, 2026-08-10) predates W1–W6. Every number below was
re-derived here; where a formation figure is quoted it is marked as such and its movement
stated.

---

## 1 · The mark → pixel map

### T9-M01 — "all buttons and text for controls need to be larger on mobile"

**The pixel (Frame A, `m01-playing-dark-iphone.png`, 331×720).** The bottom toolbar — the
`undo · redo · hint` icon column with its three words beneath, the `peek` washi chip, the
`controls` chip — sitting alone in the page's lower half. The three words are the smallest
type on the screen; the toolbar is the only control furniture in the pose.

**Now, 390×844 coarse, both engines** (`probe-r7.json:phone-dark-*.playControls`):

| control | box | label |
|---|---|---|
| undo / redo / hint | 46 × 56 each | 14px Patrick Hand |
| peek | 59.8 × 44 | 16px Patrick Hand |
| clear · fill · solve · share (in the sheet) | 48 × 58 each | 14px Patrick Hand |
| option chips (4×4 · Normal · Off …) | 96.9 × 44 / 60.9 × 44 / 48.6 × 44 | **20px Fira Code** |

**What W2 moved.** §2.6 minted the mechanism and moved exactly one number.
`typography.css:101-105` floors `--type-caption` at 14px and `--type-small` at 16px under
`(max-width: 1023.98px) and (pointer: coarse)`; `typography.css:162-167` lifts the phone's
`--type-option` **16px → 20px**; `index.css:821-834` makes `--tap-floor` a token (44px);
`index.css:864-868` ranks the drawn glyphs `--icon-act 36 / --icon-verb 30 / --icon-tool 26`.
Six role tokens now exist (`--type-act/verb/tool/tag/group-title/option`,
`typography.css:119-124`). The type ladder itself is **byte-identical** to the marks-era
commit `c917f9a7` (`diff` over every `--type-*` declaration: no output).

**Still as the owner saw it.** Every control word that is not an option chip sits exactly ON
the 14px floor — the toolbar's three verbs, the bar's four verbs, all four compartment tags,
both zone captions. Four of the six new roles (`verb`, `tool`, `tag`, and the zone caption
that has no role at all) resolve to the same rung, `--type-caption`. W2's own comment says so
in as many words: *"THE NUMBERS ARE W7'S… These are the mechanism's floor — ≥14px on any
control label — and W7 re-cuts them HERE"* (`typography.css:98-100`).

Frame: `frames/p1-webkit-dark-boardedge-tab-bar.png`.

---

### T9-M03 — "the controls panel on both desktop and mobile need better delineation—the section titles need to be larger and properly be sticky"

**The pixel (Frame B, `m03-controls-open-iphone.png`).** Two things at once. (a) The risen
sheet's top border is the full-width bright row at **y = 173** of the 331×720 frame (254 of
331 px above luminance 150) — it crosses the wordmark's glyph body, leaving "sudok" above the
line. (b) Inside the card, `pencils` / `checking` / `players` are tiny hand-lettered tapes
while `Size` and `Level` are large serif headings: one card, two ranks of "title", and the
tape that names a group does not hold when you scroll past it.

**Now (a) — the sheet's top edge vs. the wordmark**, 390×844 dark, sheet settled
(`probe-r7.json:phone-dark-webkit.sheet.topEdgeVsWordmark`):

    caseTop 216.0    wordmark [58.7, 143.8, 242.1, 71.2] → bottom 215.0
    caseTopCrossesWordmark  FALSE      wordmarkFracCovered  0.0000

It clears — **by 1.0px**. The risen tongue also no longer sits on the moon: toggle
[336, 10, 44, 44] vs tongue [342, 124, 44, 92], overlap **0.0 px²**, both engines
(`probe-r7e.json:barChrome_*.moon`). Frame B's "controls chip over the moon" is gone.

**Now (b) — the heading census.** Desktop rail, 1440×900 (`probe-r7c.json:rail_webkit`):

| voice | sites | size | family / weight | position |
|---|---|---|---|---|
| section heading | Size, Level | **25.888px** | Fraunces 800 | static |
| compartment tape | new game, pencils, checking, players | **14.384px** | Patrick Hand 500 | sticky |
| zone caption | marks, candidates | **14.384px** | Patrick Hand 400 @ 68% α | static |

Ratio 25.888 / 14.384 = **1.800**. F18's formation figure was "25.9 vs 14.4, 1.80× ratio" —
**unmoved to three decimals**. On the phone the heading drops a rung to 20.352px (the tab
regime), which makes a fourth size without making a fourth voice.

**Now (b′) — "properly be sticky", and this is the one that did not close.** W2 §2.6 gave the
tapes `position: sticky` and proved `tagVisFrac 1.0000` at both poses. Measured here at
1440×900, card overflow 504px, at five scroll states:

    scrollTop    pinned tape     that tape's own group, fraction on screen
        0        new game        1.000
      160        new game        0.733
      327        new game        0.401
      500        new game        0.058      ← pencils/checking/players all 1.000, none pinned
      504        new game        0.050

`new game` is the only tape that ever pins, at all five states. At three of them (327, 500,
504) its own group is under half on screen — instrument I3's violating set — and at four of
five the groups actually under the reader's eye carry no pinned title at all. The W2 prove
record flagged exactly this and deferred it here: *"§2.6 asserts a tag stays while its group
is in view; it does not assert a tag LEAVES when its group does. Not a row — a question for
W7's voice"* (`evidence/w2/prove/prove-record.md:47-49`).

Frames: `frames/p2-webkit-dark-sheet-top-wordmark.png`,
`frames/p7-webkit-rail-wrongtag-1440x900.png`.

---

### T9-M04 — "on mobile—the main floating controls bar needs a proper border"

**The pixel (Frame B).** The `clear · fill · solve · share` row at the sheet's foot: four
glyphs and four words on bare paper, with no box around them and nothing separating them from
the compartment above.

**Now.** Two bars answer to "the main floating controls bar", and neither has chrome of its
own:

    .play-controls   (the fold: undo · redo · hint · peek)   390×844
        border 0px · outline none · box-shadow none · background rgba(0,0,0,0)
    .action-bar      (the sheet: clear · fill · solve · share)
        border 0px/0px/0px/0px · outline none · box-shadow none
        position sticky · z-index 60 · background rgb(19,18,17) (opaque)
    .action-bar CSS is byte-identical to c917f9a7 — no border declared then, none now.

**The box the eye reads around the bar belongs to something else, and that is the finding.**
The only drawn outline enclosing `.action-bar` is `outline-svg` at [4, 759.9, 382, 78.3] —
the **`players` tray-well's** frame. The bar is opaque, sticky at z-60, and sits on top of
that well: `players` box [8, 763.9, 374, 70.3], overlap with the bar **23,585 px²** =
**89.6%** of the group (`probe-r7g-barwell.mjs`; instrument I2 reads **88.9%** at
`deviceScaleFactor: 1`, the same defect one settle apart), and the figure agrees to 0.1px
across both engines (`probe-r7e.json`). So the "border" a reader perceives is the outline of
the compartment the bar is burying.

Frame: `frames/p2-webkit-dark-sheet-bar.png` — the drawn rectangle around the four verbs is
the `players` well.

---

### T9-M05 — "The entire controls section needs better design hierarchy and development for clarity."

**The pixel (Frame B).** The whole card. Four ranks of information — compartment, title,
option, act — drawn in three type voices, two lettering families and four button treatments,
with no visual law saying which outranks which.

**Now, one pose, 390×844 sheet-open, counted:**

* **3 type voices** across 5 identical option groups (§M03's table) — the F18 count, unmoved.
* **4 button treatments in one card**: washi-chip (`peek`), bare icon + word (`undo/redo/hint`,
  `clear/fill/solve/share`), underlined text option (`Normal`, `9×9`, `Off`), drawn-outline
  icon tile (`deal`). Visible together in `p1-…-boardedge-tab-bar.png` and
  `p2-…-sheet-bar.png`.
* **1 group of 5 obliterated**: the `players` compartment, 89.6% under the bar (§M04).
* **1 group's title pinned while its group is gone**, 4 scroll states of 5 (§M03).
* **6 role tokens collapsing onto 3 rungs** (§M01).

---

### T9-M07 — "Colors, animations, and multiplayer could be refined and made more idiomatic to our design language."

**The pixel (Frames A and B).** The blue `2`/`4`/`9` entered digits against the white given
digits on Frame A's board; on Frame B the green `level` heading and the rainbow `solve` tick
in an otherwise warm-neutral card.

**The hue census, re-derived from `index.css` at HEAD:**

| token | light | hue | dark | hue | job |
|---|---|---|---|---|---|
| `--color-user-ink` | `#2563eb` | 221.2° | `#60a5fa` | 213.1° | the player's own digits |
| `--color-focus-sketch` | `#3a7bc4` | 211.7° | *(no dark override)* | 211.7° | keyboard focus ring |
| `--color-progress-ink` | `#8b5cf6` | 258.3° | `#7c3aed` | 262.1° | the unlabeled fill meter |
| `--color-crayon-green` | `#1d7f35` | 135° | `#3dd968` | 136.6° | the ACTIVE section heading |

Resting palette: `--color-background hsl(24 8% 6%)`, `--color-card hsl(24 6% 7%)`,
`--color-accent hsl(24 5% 15%)`, `--color-foreground hsl(48 10% 92%)` — one warm family,
which is F18's 99.2% figure holding.

Two corrections to the formation text, both measured here: the two blues are **9.5° apart in
light and 1.4° apart in dark**, not the 15° booked (`index.css:269` already carries the 212°
figure for the focus ring). And the violet is not alone any more — `Level`'s active heading
resolves to `rgb(61, 217, 104)` = `--color-crayon-green` dark
(`probe-r7.json:phone-dark-webkit.sheet.headings`), a fourth interactive job and a fifth hue
family in a card whose rest state is one warm hue.

Frame: `frames/p2-webkit-dark-sheet-top-wordmark.png` — green `level` beside grey `size`.

---

### T9-M09 (the animation half) — "the animations from going into and out of game selection view are not properly defined and smoothed--as is the controls drawer animation"

**The pixel (Frame C, `m09-board-light-sim.png`).** A still cannot hold a transition; the
mark's animation half is read against the definitions, and the definitions are countable.

**What is DEFINED.** `pencilConfig.ts:121-195` names four motion facts and no more:
`beatMs 125`, `cardStepMs 440`, `boardFoldMs 520`, `chromeLeaveMs 200`, plus one curve,
`curves.drawerGlide = cubic-bezier(0.32, 0.72, 0, 1)`. `index.css`'s `@theme` names **11**
`--ease-*` curves.

**What is NOT.** Across `src/` (`.vue`/`.css`/`.ts`), **77** `transition:`/`animation:`
declarations carry a literal duration, spelling **35 distinct duration values** between them
(150ms ×21, 200ms ×16, 250ms ×9, 500ms ×6, then 31 more used once to three times) — instrument
I6's reading, which supersedes a single-line `grep` pass in this lane that undercounted at
64/30 by missing multi-line declarations. One duration variable exists in the whole estate
(`--draw-dur`). So the easing half is a system and the duration half is not — which is §13's
gap, priced.

**The drawer, measured** (rAF trace of `.drawer-case` top through one open gesture, headless
desktop):

| engine | travel | settle | median frame | max frame | frames >32ms |
|---|---|---|---|---|---|
| webkit | 576.4px | **481.0ms** | 17.0ms | 22.0ms | 0 |
| chromium | 604.6px | **481.5ms** | 8.3ms | 10.4ms | 0 |

Monotone to settle under the 520ms named ceiling, zero long frames — on this machine. The
owner's "not smooth" is a real-device claim and stays W8's to prove or refute; nothing here
acquits it.

**The dark toggle, measured** (rAF trace of `body` background across one flip):

| engine | distinct body colours | max frame | frames >32ms |
|---|---|---|---|
| webkit | 16 | **121.0ms** | 1 |
| chromium | 33 | **86.2ms** | 1 |

Every flip costs one frame of 86–121ms on a desktop-class headless engine. `useTheme.ts:35`
sets `disableTransition: true` and its own comment records the consequence: *"the T3-W10 dusk
ease remains inert… page colour snaps; if the owner wants the dusk back the cure is to NARROW
the 46 tweening selectors, not to re-blanket them."* The toggle has no defined transition by
construction — it has a repaint.

---

### T9-M10 — "The controls button on mobile should be a tab on the bottom of the board, like on desktop (just not on the side)"

**The pixel (Frames C + D).** In `m09` the board's bottom rule is the full-width dark row at
**y = 568** and the `controls` chip's top border is at **y = 650** — **82 frame px** of empty
paper between them (≈60 CSS px at that crop's scale). `m10` is the close-up of exactly that
void. The formation instrument read the gap as **54.8px, identical at 390×844, 375×812 and
430×932** — structural, not a rounding.

**Now — CURED, and it is the clearest cure of the ten.** `DrawerTab.vue` was re-cut at W2 §2.7
into one law with three berths: right flank on the desk and in short landscape, the board's
bottom-right corner in portrait, the case's top-right corner when the sheet is up.

    390×844 portrait, shut (webkit ≡ chromium)
      .drawer-tab  box [286.0, 579.4, 92, 48]   display block   z-index -1
      paper bottom 587.4 · paper right 378.0
      gapToPaperBottom  −8.0    ← the tongue tucks UNDER the paper, it does not float below it
      label "controls" · aria-expanded false · buttons inside: 0

    844×390 landscape          tab [597, 166.6, 48, 92]   tuck −8.0   docScrollH 409 / innerH 390
    900×500 landscape          tab [612, 251.6, 48, 92]   right flank  docScrollH 500 / innerH 500

The stranded chip is gone from the fold entirely — `.play-controls` now holds four buttons
(undo · redo · hint · peek), not five. F12's landscape P0 ("zero reachable controls at
844×390, scrollHeight 1157") reads **409** here with the tongue visible.

Frames: `frames/p1-webkit-light-boardedge-tab-bar.png` is the owner's Frame C/D pose on this
tree; `frames/p1-webkit-dark-boardedge-tab-bar.png` is Frame A's.

---

### T9-M12 — "If you input a value into the board and then attempt a destructive action (any) you should be asked to confirm (simply, without contrivance or large modals)"

**The pixel (Frame B).** The `clear · fill · solve · share` bar, and `deal` in the well above
it — the four acts that can take a board away.

**Now.** Fresh board, `localStorage` cleared, one digit typed by the probe, sheet open, coarse
pointer, **one tap per verb on its own fresh page** (`probe-r7d.json` — probe 3's reading was
confounded twice, by persistence restoring a solved board and by a text-coupled locator that
stops matching the instant a verb arms):

| verb | sublabel after one tap | armed | board changed | cells written | guarded |
|---|---|---|---|---|---|
| Deal | `sure?` | yes | no | 0 | **YES** |
| Clear | `sure?` | yes | no | 0 | **YES** |
| Fill | `Fill` | no | **yes** | **52–57** | **NO** |
| Solve | `Solve` | no | no* | 0 | **NO** |

\* Solve neither armed nor wrote within a 4,000ms settle; it carries no guard either way.
Fill's count is per-board (57 in `probe-r7d.json`, 52 in instrument I4's run) — the defect is
that the count is non-zero on the first tap.

The two guards that exist are T4-WU/U3's, not W1's: `GameControlPanel.vue:506-530` (Deal) and
`:542-566` (Clear), both `isCoarse && props.isDirty`, both the two-tap sublabel idiom. **W1
§1.4/§1.5 — the W1.1 slice that owns M11 and M12 — has not executed**: the commit log runs
W0 `f48c43f1` → W1 `1453eb60` → W4 → W2 → W5 with no W1.1, and the source carries no `fill`
or `solve` arm, no dirty-gated guard ribbon outside the gallery. The guard-ribbon idiom W1
§1.5 names as the house shape lives only in `GameGallery.vue:1003` (`<Transition
name="guard-ribbon">`); the controls card speaks a different, older dialect.

---

### T9-M13 — "The controls tab on mobile should have a few quick actions that are frequently used."

**The pixel (Frames A, C, D).** The `controls` chip, one word, one act.

**Now.** The tongue is in its new berth and still carries exactly one act:
`buttons inside .drawer-tab: 0`, one drawn word, one `aria-expanded`/`aria-controls` pair. The
mark is **untouched**.

Where it bites hardest is landscape. At 844×390 the tongue is the **only** control in the
viewport — `.play-controls` measures 0×0, so undo, redo, hint and peek have no home outside
the sheet at all (`frames/p8-webkit-landscape844x390.png`, the whole viewport because the
claim is that nothing else is in it).

---

### T9-M14 — "We should have player indication in the top left of the screen with a player icon…"

**The pixel (Frame A).** `@mbabb` alone at the top-left, at [0, 0, 76, 44]; the moon at the
top-right.

**Now.** Unbuilt, and cleanly so. A sweep of every element whose box lies in the top-left
140×170 region at 390×844 returns nine nodes, all of them the attribution card and its hover
panel: `.mobile-attribution` [0,0,76,44] → `.attribution-trigger` [0,0,76,44] → `.hover-card`
[13,59,230,136] and its children. `document.querySelector("[data-player-mark], .player-mark,
.presence-mark, .player-icon")` → **null**. There is no player icon, no lobby surface, and no
per-player colour system; `.player-swatch` exists only inside the controls card's roster rows.

---

## 2 · The two carried rows, re-measured

### T8-M20 — the wordmark float

The mark: *"in a ~900-css-px-wide dark-mode window with the board filling the page top to
bottom, 'sudoku' and its caret lie mid-left ON the grid"*
(`2026-08-tranche-8/design-marks-2026-08-03.md:35`).

Swept at 900 CSS wide, dark, ten heights from 1000 down to 480
(`probe-r7f-m20sweep.json`):

    webkit    gap 4.4px at EVERY height · overlap 0.0px² at every height
    chromium  gap 5.0px at EVERY height · overlap 0.0px² at every height
    e.g. h=760: wordmark [275.9, 16, 311.4, 91.6] → bottom 107.6 · board [150, 112, 600, 600]

**HOLDS.** "sudoku" does not lie on the grid at any rung, in either engine. The constancy of
the gap across a 520px range says the cure is structural rather than incidental. The number
itself is worth a design opinion: 4.4px is the entire separation between the masthead and a
600px board, and it is the same 4.4px at 390×844 (`gapWordmarkBottomToBoardTop 4.4`).

Frame: `frames/p5-webkit-wordmark-float-900.png`.

### The W2 residual — "Medium partly outside the card at 1280×800"

`evidence/w2/prove/prove-record.md:67` and its §2. Reproduced at 1280×800, card scrolled to
`scrollTop 327` (`probe-r7.json:residual-*`):

    card [825.8, 140.2, 324.3, 608]     cardPadT 20px     new game tag [859.2, 141.7, 64.7, 23.3] sticky
    Easy   [853.8,  76.6, 268.3, 38]   insideFrac 0.0000
    Medium [853.8, 121.8, 268.3, 38]   insideFrac 0.5169   ← chromium 0.5169, webkit 0.5160
    Hard   [853.8, 167.0, 268.3, 38]   insideFrac 1.0000

Geometrically the row is half outside the card's box; **visually it is not painted at all** —
the crop shows the pinned `new game` tape on plain paper with `Hard` beneath it and no
"Medium" anywhere. The prove record's ruling stands: the overlap lies inside
`.controls-card::before`'s solid reserved band, so the tape covers paper, not a control.

What the row leaves for this wave is not a clipping bug but a legibility question: at this
scroll state a whole difficulty option is invisible with nothing saying it exists, under a
pinned tape naming a group whose options have left the frame — the same mechanism as §M03's
wrong-pinned-tape, one viewport class over.

Frame: `frames/p6-webkit-residual-1280x800.png`.

---

## 3 · The ledger — what moved, what is still as the owner saw it

| mark | state at HEAD-of-W7 | the mover |
|---|---|---|
| M01 | **partly moved** — option chip 16→20px; every other control word on the 14px floor | W2 §2.6 (tokens + floor; the numbers deferred here in writing) |
| M03 (a) sheet edge / wordmark | **moved** — clears by 1.0px, was cutting the glyph body | W2 §2.7 berth re-cut |
| M03 (a′) chip over the moon | **moved** — overlap 0.0px² | W2 §2.7 / T7-W7 ≤400 dock |
| M03 (b) titles larger | **unmoved** — 3 voices, ratio 1.800, F18's own figure | — |
| M03 (b′) properly sticky | **half moved** — `position: sticky` lands; only `new game` ever pins, and at 3 of 5 states its own group is under half on screen | W2 §2.6 gave the mechanism, named the residue |
| M04 | **unmoved** — neither bar has a border; the `players` well is 89.6% under the bar | — |
| M05 | **unmoved** — 3 voices, 4 button treatments, 6 roles on 3 rungs, 1 group buried | — |
| M07 | **unmoved** — 4 interactive hues off the warm family; 2 blues 1.4° apart in dark | — |
| M09 (animation half) | **unmoved** — 30 literal durations vs 4 named; dark flip costs one 121ms frame | — |
| M10 | **CURED** — tongue on the board's bottom-right, tuck −8.0px, all three portrait widths + both landscapes | W2 §2.7 |
| M12 | **partly present, and not from T9** — Deal + Clear guarded (T4-WU/U3); Fill writes 57 cells on one tap; Solve unguarded | W1.1 unexecuted |
| M13 | **unmoved** — the tab carries 0 quick actions; at 844×390 it is the only control | — |
| M14 | **unbuilt** — no player icon, no lobby, no per-player ink | — |
| T8-M20 | **HOLDS** — 0.0px² overlap, ten heights, both engines | T8.1 |
| W2 residual | **as ruled** — geometrically half-out, visually unpainted; a legibility row, not a clip | W2 prove |

**Still open, ranked by what a re-look will land on first:** M04 (the bar burying the players
group is visible in one glance), M13 (the tab is one word), M14 (nothing at all in the top
left), M03-b/b′ (the pinned tape naming an absent group), M05, M01's remaining rungs, M07,
M09's definitions, M12's Fill and Solve.

---

## 4 · The acceptance frame — what the owner will look for, mark by mark

Each paragraph is what a re-look has to satisfy for that mark to close under U-10. The wave
seals cured-pending-re-look; this is the list the owner reads against.

**M01.** He will open the sheet on the phone and read the words, not measure them. The option
chips already lifted to 20px and they will look right; the test is everything *around* them —
`clear`, `fill`, `solve`, `share`, `undo`, `redo`, `hint`, and the four compartment tapes, all
of which still sit on the 14px floor and will read as a smaller, fainter class than the chips
they label. If the wave raises the chip and leaves the verbs, the mark re-opens on the
contrast the raise created. What closes it is a ladder where the verb under an icon and the
tape naming a group each read as deliberately sized rather than floored.

**M03.** Two looks. First he will open the sheet and check the wordmark: it clears by 1.0px
now, which will read as touching, so the re-look wants visible air, not arithmetic clearance.
Second — and this is the one that decides the mark — he will scroll the card, on the desk
especially, and watch which title holds. Today `new game` pins through every state while
`pencils`, `checking` and `players` scroll past titleless; at `scrollTop 500` the pinned tape
names a group 5% on screen. He asked for "properly sticky" and he will know it when the tape
at the top of the card is the tape for the group under his eye.

**M04.** He will look at the bottom of the sheet on the phone and ask whether that bar is a
thing. Right now something *does* look like a border there, and the wave must not mistake that
for a pass: the box is the `players` compartment's outline, and the bar is sitting on 89.6% of
that group. Two failures are possible at the re-look and they read identically — a bar with no
chrome, and a bar with chrome that is really someone else's. What closes it is a bar drawn in
the house hand that also stops eating the compartment beneath it.

**M05.** He will not enumerate; he will scan the card once and say whether it looks designed.
The countable things he is reacting to are three type voices, four button treatments, six role
tokens landing on three rungs, one group buried and one title pinned wrong. A re-cut that
fixes any one of those in isolation will still read as the same card. What closes it is the
four ranks — compartment, title, option, act — being visibly four ranks, in the same grammar
on the desk and on the phone.

**M07.** He will look at a board with his own digits on it, in dark, and then at the sheet. In
dark the entered-digit blue (213.1°) and the focus ring (211.7°) are 1.4° apart doing
different jobs, the fill meter is violet at 262° and nothing else in the product is violet,
and the active section heading is crayon green. He will read that as four accents borrowed
from four places. What closes it is either accents drawn from the house crayons or a stated,
visible reason for each exception — and the fill meter, which §4 of this wave owns separately,
either explaining itself or going quiet.

**M09 (animation half).** He will toggle dark mode on a real device, enter and leave the game
picker, and open and shut the drawer, and he will judge all three in about four seconds. On
this machine the drawer is clean — monotone, settled at 481ms, zero frames over 32ms — so if
it still reads badly to him the cause is the device, which is W8's. The dark toggle is
different: it has no transition at all by construction and costs one 86–121ms frame even
headless, so it will read as a hard snap with a hitch. What closes the design half is a named
curve and a named duration for each of the three, living in `pencilConfig`'s MOTION bands
beside the four that are already there, rather than among the 30 literal durations spread
across 64 declarations.

**M10.** The fastest close of the ten. He will look at the board's bottom-right corner on the
phone and see the tongue tucked 8px under the paper where a chip used to float 55px below it,
and he will see the same tongue on the board's right flank in landscape. The one thing that
could still fail his eye is the tuck reading as a clipping accident rather than as a tongue —
it is drawn at negative z under the paper on purpose, and in the light frame the 40px that
protrude want to look deliberate. Frame C's pose is `p1-webkit-light-boardedge-tab-bar.png`;
put it beside `m09`/`m10` and the mark answers itself.

**M12.** He will type a digit and then press things. Deal and Clear will ask "sure?" and pass.
Fill will write 57 cells under his hand with no question asked, and that is the one he will
find, because Fill is the act most likely to be pressed by accident while reading the card.
Solve asks nothing either. He also said "simply, without contrivance or large modals", so a
dialog would fail the mark even while guarding the act — the two-tap sublabel already in the
card is the register he has accepted twice. What closes it is the same small question on the
whole destructive set, in one mechanism rather than two.

**M13.** He will press the tab and notice that pressing it is all it does. He asked for "a few
quick actions that are frequently used", and the honest reading of "frequently used" on this
product is undo, redo and hint — which is exactly the set that has no home at all at 844×390,
where the tongue is the only control in the viewport. What closes it is a tab that carries two
or three acts without becoming a second toolbar, and a landscape pose where undo is reachable
without opening the sheet.

**M14.** He will glance at the top left and see `@mbabb` and nothing else, because nothing else
exists. The mark is specific enough to be checked in one look: a player icon, coloured when a
session is live, a unique colour per player, and a click that opens a lobby listing them. Two
further conditions ride it that a first pass will miss — the icon has to sit beside the
`@mbabb` mark without crowding it (that mark is 76×44 at the origin today), and W3's idiom
requires the indication to speak, not only to colour.

---

## 5 · The instruments — born RED at HEAD

`instruments/owners-eye.instruments.mjs`, readings banked at
`instruments/readings-at-head.json`. Seven assertions, each stating the law its mark asks
for. They live here and not in `e2e/` because round zero is read-only on the product; a cure
wave lifts the bodies into the estate's suite. `node owners-eye.instruments.mjs` against a
dev server at 127.0.0.1:4247.

| id | mark | the law it asserts | at HEAD |
|---|---|---|---|
| I1 | M03 / M05 | the controls card titles its option groups in ONE typographic voice | **RED** — 3 voices at 1440×900 (25.888 Fraunces 800 · 14.384 Patrick Hand 500 · 14.384 Patrick Hand 400) |
| I2 | M04 | the mobile floating bar carries chrome of its own and covers no option group | **RED** — ownChrome false (border 0px, shadow none); `players` 88.9% covered |
| I3 | M03 | a pinned compartment tape names a group at least half on screen, at every scroll state | **RED** — 3 violating states: `new game` at 0.401 / 0.058 / 0.050 |
| I4 | M12 | on a dirty board every destructive verb asks before it acts | **RED** — Deal armed, Clear armed, **Fill wrote 52 cells**, Solve neither |
| I5 | M14 | a player mark sits in the top left of every viewport and opens the lobby | **RED** — no player mark in the DOM |
| I6 | M09 §13 | every transition duration is a named decision, not a literal in a rule | **RED** — 77 declarations, 35 distinct literals, 4 named in MOTION |
| I7 | T8-M20 | in a ~900px dark window "sudoku" never lies on the grid | **GREEN** — 0px² worst overlap, min gap 4.4px over ten heights (a regression guard, not born-RED, and labeled so in the file) |

**6 RED / 7 at HEAD.**

Two marks the census cannot instrument from here and that stay with their owning waves:
M01's "larger" has no law until W7 picks the numbers (the tap floor and the 14px read floor
already pass, which is the point), and M13's quick-action set cannot be asserted before the
design chooses which acts they are.

## 6 · Notes for the wave

1. **`.action-bar` over `.players` is a new defect, not a design question** — 23,585px² at the
   owner's own pose, both engines. Whatever §2 and §10 decide about bar chrome, this overlap
   is a layout row and someone should own it explicitly.
2. **Persistence confounds every act probe.** A reload restores the board but not the undo
   stack, so `isDirty` reads false and a guard that exists does not arm. Any born-RED
   instrument for M12 must clear `localStorage` per case and use a locator that does not key
   on the label under test (probe 3 failed both ways; probe 4 is the shape that works).
3. **W1.1 is not in the tree.** M11's widened undo spine and M12's general confirm are
   specified (`waves/T9-W1-board-law.md:67-82`) and unexecuted. W7 §15 owns the confirm's
   face; there is no arming to dress yet.
4. **The drawer's frame budget is clean on desktop headless and that proves nothing about
   M02/M09.** The owner's word is a real-iOS reading and the real-iOS law stands.
