# T9-W7 · pass 2 · PROTOTYPE · CTRL-RULE — the ruled page, arm (b)

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-29`
(branch `master`, uncommitted diff — 13 files modified, 4 new). Server `127.0.0.1:4231`, private
`cacheDir`, killed on return. Every number below was read on the real surface in this session,
both engines except where the row says otherwise. Nothing under `loop/r0/` or `loop/pass1/` was
written; r0's probes were copied and re-pointed here.

## 0 · What the replay carried, and what pass 2 did to it

Arm (a)'s diff replayed clean (no conflicts — HEAD moved by docs only since). It carried:
`RuledGroup`/`RuledLine`/`ConfirmRibbon`, the seven names, the tabs' and compartments' death,
`what fits`, the bar as `#card-foot` (graft 1), `--ring-ink`, the three MOTION windows, and the
two gate scripts' re-cuts.

Pass 2 then **deleted arm (a)'s head machinery** — `.head-pin`, the release box, the flow spacer,
`--rp-head-h` and its publisher, and `scene.css`'s `scroll-padding-top: max(2.4rem, …)` lift —
and rebuilt the group as a **two-column grid**: `[--rp-margin 7.6rem] [0.5rem] [minmax(0,1fr)]`,
the name at 1/1, the field at 1/3, the rule at row 2 spanning `1 / -1`, `align-items: first
baseline`. Also new in pass 2: one ink on all seven names (`headingClass`/`activeColorClass`
deleted), `.rp-name` reading `--type-heading` **directly** so `typography.css`'s
`.section-heading` and `--type-group-title` go back to HEAD byte-for-byte, `.rp-field
{ flex-wrap: wrap }`, the chip's 8px inline padding scoped to `.controls-card`, the ring moved to
an unscoped home, the 8% destructive ground deleted in BOTH ribbons, `keep` made bare, the
Fraunces `p` re-cut, `confirmWindowMs` wired, `[data-under-bar]` deleted with its writer, and the
masked `--masthead-foot` fallback deleted.

## 1 · R1 — the heading voice (`readings/census.json`, 7 cells × 2 engines)

| row | HEAD | arm (b) |
|---|---|---|
| name voices in the card | 3 | **1** at every cell, both engines |
| names at the heading rung | 2 of 6 | **7 of 7** at every cell, both engines |
| name : chip ratio | 1.0175 (dock) | **1.2944** at 390 · 1280 · 900×500 · 844×390 · 375×812 · 430×932 |
| the 320 cell | — | **1.0176** — the name drops to √φ under 375; REPORTED, not claimed |

`--type-option` reads 20px at 390 coarse (M01 held); chips carry `padding-inline: 8px` in the
card and `0.65rem` in the gallery (pi).

## 2 · The occlusion predicate — 5 scroll states × 7 cells × 2 engines

`pins 0 · violations 0 · barWorstFrac 0.00` at **every** state, cell and engine.
HEAD: `play` 100% at dock scrollTop 0, `Ask` 100% at desk 350, `Hard` 13%, bar 0.874.
The predicate is VACUOUS by construction and is labelled so rather than claimed: there is no
sticky or fixed surface left inside the scrollport, and the foot is outside it.
`[role=dialog]` in the card: 0.

## 3 · The rule — σ per rule, and the ink (`readings/rule-ink.json`, `seed-sweep.json`)

**σ** (R3's own method, 33 samples, band [0.722, 2.886]) on the eight pinned seeds:
chromium `1.1963 · 1.1484 · 0.8849 · 0.9222 · 0.9348 · 0.9581 · 0.9883 · 0.8824`,
webkit within 0.0002 of each. Worst headroom 0.160 at the low edge. A CSS hairline is σ 0 —
`.staged-section + .staged-section` is deleted.

`RP_SEEDS` is a SWEEP RESULT: seeds 1–64 through the component's own generator at both chords
(300 nominal, 284.67), 26 clear the band with ≥0.1 headroom, and the first eleven of them are
pinned in order.

**The ink** — worst PAINTED column against the card's paper, light, at the shipped stroke:

| cell / engine | worst column |
|---|---|
| 390×844 chromium | **3.304** |
| 1280×800 chromium | **3.347** |
| 390×844 webkit | **3.483** |
| 1280×800 webkit | **3.483** |

**THE SHIPPED STROKE IS 2.0.** At 1.8 the seven card rules read 2.946–2.983 in chromium — under
1.4.11's 3:1 — so 1.8 is refused by measurement, not by taste. `--ink-press-rule` is NOT moved:
it is `check-ink-pressure`'s ramp and re-pitching a shared ramp for one consumer is how a ladder
stops meaning anything.

**THE FOOT'S RULE TAKES 3**, the stroke ladder's case rung, and the finding is why. At stroke 2
it read 2.413 where the seven card rules read 3.53 in the same session. Fifteen seeds were swept
at the foot (`readings/bar-seed-sweep.txt`) and every one landed 2.41–2.59, so it is not the
hand; the strokes 2 / 2.25 / 2.5 / 3 read 2.413 / 2.789 / 2.789 / 3.330
(`readings/bar-stroke-sweep.txt`). The foot's band sits at a device-pixel phase where a 2px
stroke splits across two rows and paints neither whole. The rung is the one the ladder already
gave the case's own edge, which is what this line is.

## 4 · The ring (`readings/census2.json`)

Under a real `Tab` (a programmatic focus is not `:focus-visible` on a touch context — census 1
read 0/20 for that reason and the row says so):

| cell | authored / focusable |
|---|---|
| 1280×800 desk, chromium · webkit | **21 / 21** |
| 390×844 dock, chromium · webkit | **20 / 20** |

HEAD: 14 unringed, WebKit's UA ring at 2.147:1 on `--color-card`.
`--ring-ink` is `color-mix(--color-foreground 50%, transparent)` — light `rgb(131,131,131)` on
`rgb(253,253,252)` = **3.72:1**, dark ≈ **4.66:1**. Those two are DERIVED from the token and the
census's recorded outline colour, not read from bytes in this session; the painted read is a gap
(§9).

**The finding that made it work**: the rule could not live in the panel's scoped block. Written
there it compiles to `…:focus-visible[data-v-<panel>]`, and an option chip carries
`OptionSelector`'s scope id instead — eight of twenty-one controls, the ones a reader arrows
through most, were outside the only ring the card has. It lives in `scene.css` now.

## 5 · The height ledger (scrollHeight / clientHeight, chromium; webkit within 1px)

| cell | HEAD | arm (b) | arm (a) |
|---|---|---|---|
| 390×844 | 699 / 628 | **683 / 540** | 999 |
| 1280×800 | 1142 / 608 | **952 / 531** | — |
| 844×390 | 743 / 284 | **669 / 224** | — |

Target ≤740 at 390: **683**. The port is 88px shorter at the dock because the bar left it — the
price, stated. `marks` takes the one wrap at 390 (chipRows 2, 264.05 of chips into 244.41 of
field); every other field is one row; `level` clears by 28.41.

## 6 · The confirm (`readings/ribbon-floor.json`, frame 3)

**Both engines**, 390×844, armed on a dirty board, identical to the digit: `clear the board?` · `keep` **bare** (`drawn: false`,
foreground `rgb(10,10,10)`) · `clear` **boxed at 2.5** (`drawn: true`) in `rgb(208,42,82)` =
`--color-red-ink`, background `rgba(0,0,0,0)` — the 8% ground is gone here AND in
`GameGallery.vue`, one commit. `role="alertdialog"`. Both verbs **≥44 in both dimensions**
(keep 51.73×44, clear 54.39×44).

Three channels, all live and each independently readable: the sentence NAMES the act · one verb is
drawn and one is not · one is red. Pass 1 drew BOTH verbs, which spent the middle channel on
nothing; `keep` was made bare in this pass and the `drawn` flags above are the proof.

**THE NEGATIVE CONTROL FIRES**, on the surface the claim is about: strip `min-inline-size` and
`min-height` from `.confirm-face` and both verbs fall to **24.22px tall**. Per dimension the
control is honest about which half is load-bearing — the HEIGHT is the floor's doing; the WIDTH
(51.73 / 54.39) is already carried by the chip's padding, so the width half of the row is
VACUOUS and is labelled so rather than claimed.

The `--color-red-ink` word reads 4.99:1 on bare card in light (registry §6.4) against 4.20
composed on the 8% wash HEAD ships — which is why the wash dies rather than being tuned.

**A probe defect found and cured mid-pass, worth the chair's eye**: the first probe typed one
digit into the first `:not([readonly])` cell and read `present: false` on two of three runs. The
deal is random and `[readonly]` is not the whole of W1's law — a given refuses the write at the
model too — so on some deals the board never went dirty and the arm's own predicate
(`isCoarse && isDirty`) was false — and WebKit read `present: false` on all three runs, which
this lane nearly banked as "WebKit cannot be put in a coarse context". It can. The probe now types
until a digit actually lands, and both engines read the ribbon identically. A flaky red here would
have been banked as a broken confirm and as an engine limitation that does not exist.

## 7 · Pi — the surfaces this wave does not claim

Gallery, `.staging-axis-label`, both engines, identical to the digit:

| reading | 390 | 1280 |
|---|---|---|
| box left | 17.59 | 384.00 |
| padding-left | 0px | 12px |
| font-size | 16 | 16 |
| chip `padding-inline` | 10.4px (0.65rem) | 10.4px |
| `.section-heading` size / align | 16 / left | 16 / left |

Four of the five reconcile exactly with the brief's HEAD figures once the origin is named: the
brief's "glyph x 396.00" is this box-left 384.00 plus the label's own 12px padding. The fifth —
the label's font-size, 16 at both cells where the brief records 14/16 — does NOT reconcile, and
Δ 0.00 is therefore **reported, not claimed** (§9). By construction nothing in this diff is on
that property's path: `.section-heading` and `--type-group-title` are restored to HEAD
byte-for-byte and the card's names read `--type-heading` through their own class.

## 8 · The gates run bare

| gate | result |
|---|---|
| `vue-tsc --noEmit -p tsconfig.json` | **exit 0** |
| `vitest run` (full battery) | **66 files / 811 tests, all passed** |
| `check-copy-register` | **exit 0** (the `candidates` ADMITTED row is struck with its string) |
| `check-font-coverage` | **exit 0** — `players` draws its `p` in Fraunces |
| `check-theme-selectors` · `check-theme-tokens` | exit 0 · exit 0 |
| `check-ink-pressure` · `check-motion-contract` · `check-live-regions` | exit 0 · exit 0 · exit 0 |

**The `p` re-cut, banked**: upstream `Fraunces[SOFT,WONK,opsz,wght].ttf` → `varLib.instancer
SOFT=0 WONK=1` → `pyftsubset` (the P5 recipe verbatim). 14,636 B shipped → **14,912 B** (+276 B);
the same recipe at the OLD 30-codepoint band cuts to 14,632 B, so the glyph's own cost is
**+280 B** and the remaining −4 B is toolchain drift, stated rather than hidden. The file carries
31 codepoints and axes `opsz, wght` (SOFT/WONK pinned out), verified from the cut file's cmap.

## 9 · Every gap, named

1. **ARM (b) RETIRES W2 §2.6's STICKY SECTION TAG, and that is a W2 ruling to re-open rather
   than a voice's call.** The charter says W2's landed mechanics are designed ON, never replaced.
   Arm (b)'s whole answer to the class invariant is *nothing in the port pins*, so the pinned tag
   has no subject left: `viewport-law.spec.ts:575` (rail) and `:610` (drawer) are its two gates
   and both are RED here. Arm (a) honoured the pin and died of it (the pinned head cut `Normal`
   38.8%). The chair/owner decides which of the two W2 wanted; this lane cannot.
2. **The seam at 844×390 is RED**: the risen case sits **120.87px (chromium) / 121.30 (webkit)
   ABOVE** the wordmark's bottom. It is HEAD's `--sheet-chrome: 4rem` landscape arm and this
   family did not move it — census 2's `landscape` row reads `derived` and `literalFourRem`
   identical. Curing it costs ~129px of a 390px-tall sheet, which is a W2 layout ruling. The
   other three cells clear: 375 +19.41 · 390 +10.91 · 430 +31.53 (webkit within 0.5).
3. **The consumed seam derivation is not consumable on this tree.** `--masthead-foot` (W2 §2.5 /
   CTRL-TAPE pass-2 §1.5) is not published here, and `var(--masthead-foot)` with NO fallback
   makes the whole `max-height` invalid. Pass 1's `var(--masthead-foot, 0px)` masked that, so the
   fallback is DELETED and the value is written as the constant it always was (12.6rem), with the
   replacement named in the comment for the commit that lands the publisher.
4. **`--card-foot-h, 0px` keeps its fallback — a declared deviation from the spec's "three
   fallbacks DIE".** Its publisher IS in this tree; the 0px is the honest pre-measure value of a
   real publisher, not a mask for a missing one, and removing it makes the card's cap invalid for
   one frame. Objection carried here rather than in the diff, per the chair's §7.
5. **The ring's painted ratio is derived, not read from bytes** in this session (3.72 light /
   4.66 dark, from the token's resolved value and the census's recorded outline colour). The
   authored/painted-declaration census is 21/21 desk and 20/20 dock in both engines; a byte-level
   read of the ring band is not banked.
6. **The gallery's fifth reading does not reconcile** (label font-size 16 at both cells against
   the brief's HEAD figure of 14/16). Δ 0.00 is NOT claimed. The other four reconcile exactly
   once the origin is named. A HEAD control run of the same instrument is what would settle it,
   and this lane had no second server to run one.
7. **The desk rail spends 129.6px of 324 on the margin**, so at 1280 every field stacks one chip
   per line (frame 2). That is the form-tell's worst case and it is exactly where a fresh reader
   should be asked (U-10): the phone reads as a worksheet, the rail reads closer to a settings
   list. The four separators still hold there (display type at φ/800, the rule across both
   columns, the shared first baseline, left-alignment to a margin) — but 324px is thinner ice
   than 374.
8. **The armed ribbon floats over the card's last row** (frame 3). It is `bottom: 100%` of the
   foot, out of flow, so Δ is 0 on four sides — but while armed it is a layer over controls. It
   is transient, takes focus and is the house's own guard-ribbon shape; still, it is the one
   surface in the port that paints over a control and the record should say so.
9. **The six e2e specs were run BARE, chromium only** — the webkit half was not run, for time.
   **22 failed, 19 passed of 41.** Every failure addresses grammar this family deleted:
   `zone-grammar` 9 (tapes-as-names, the two eyebrows, the wells, the bar inside the scrollport),
   `viewport-law` 4 (§2.6's pin ×2 — see gap 1 — plus §2.5's tape and §2.4's toggle),
   `share-truth` 3, `access` 2, `font-census` 2, `join-language` 2. They are re-aim work for the
   landing commit, not defects — but 22 is a large re-aim and the count belongs in the open.
10. **The filter census is UNREAD, not green.** The lane's instrument counts 24 elements painting
    a `filter: url(#…)` document-wide and 28 `url(#` references; `filterBudget`'s own 9 is
    `e2e/filter-census.spec.ts` against a BUILT dist, and this lane did not run `vite build`.
    Goldens 4/4 likewise not run. Both guards are open.
11. **`confirmWindowMs` is newly wired and unverified on the surface.** The lapse returns focus to
    the verb that armed it, and any keystroke or pointer inside the note cancels it — so the
    window can only expire on a note nobody is using. That path has no measured row in this pass.
12. **`.rp-name`'s 320-cell rung is set with a `:deep()` from the panel** rather than in
    `RuledGroup`'s own block, because the media arm lives beside `--rp-margin`'s. It works
    (ratio 1.0176 measured) but it is the panel reaching into a child's class, and a later hand
    should move both into `RuledGroup`.

## 10 · Frames (4, cited)

1. `frames/1-dock-390-dark.png` — 390×844 dark, sheet up: seven printed names in the margin, each
   on its own hand-ruled line, `new game` wrapped at its space, `marks` wrapped to two chip rows,
   the boxed `deal`, the foot below the card's end.
2. `frames/2-rail-1280-light.png` — the desk rail mid-scroll: nothing pinned, each name beside its
   own field. The form-tell control, and the gap in §9.7.
3. `frames/3-ribbon-390.png` — the confirm in the foot's row: `clear the board?`, `keep` BARE and
   `clear` boxed red on bare card, both on their 44px floor.
4. `frames/4-narrow-320.png` — the narrow arm: the name at √φ, ratio 1.0176. Reported, not claimed.
