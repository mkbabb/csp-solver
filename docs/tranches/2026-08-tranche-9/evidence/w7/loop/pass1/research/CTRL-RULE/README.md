# T9-W7 pass 1 · RESEARCH · CTRL-RULE — the ruled page

Section §10 (with §1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13 · lane port 4231.

Read-only on the product. Every number below was measured on THIS tree (HEAD `7b0610cc` +
the working tree) against `npx vite --host 127.0.0.1 --port 4231 --strictPort`, chromium and
webkit headless, on this lane's own probes. The prototype is an injected module
(`proto/ruled-page.js`); no file under `src/`, `e2e/` or `scripts/` was touched, and no
worktree was cut.

| file | what it holds |
|---|---|
| `probe/base.mjs` → `base-head.json` | the card at HEAD: 4 cells × 2 engines, boxes, voices, tokens |
| `probe/overlay.mjs` → `overlay.json` | the ruled page, both arms, 3 cells × 2 engines, ROW 1/2/3 + I3 |
| `probe/fix2.mjs` → `fix2.json` | the card's ancestry; arm (b)'s margin sweep at 390 |
| `probe/fix3.mjs` → `fix3.json` | the bar outside the scrollport; arm (a′)'s release; painted contrast; the masthead seam |
| `probe/fix4.mjs` → `fix4.json` | the bar as the case's foot; access 2.1/2.2/2.3; the draw-on cost |
| `probe/fix5.mjs` → `fix5.json` | I2's coverage **clipped to the scrollport**; the board's free edge |
| `probe/fix6.mjs` / `focusring.mjs` → `fix6.json`, `focusring.json` | every name's ink width; the focus ring, painted |
| `proto/ruled-page.js` | the replayable overlay (`window.__rp(opts)` / `window.__rpConfirm(face)`) |
| `frames/` | 2 crops, 26 KB total |

---

## 0 · The substrate, verified

| the charter's citation | what is there, re-derived |
|---|---|
| `GameControlPanel.vue:769 :952 :1006 :1042` | four `.tray-well` `HandDrawnOutline`s, `:stroke-width="1.5" :outset="4" :radius="3" :pose="0"`. Padding `11.2px 8px 3.2px`, `margin-block: 0.5rem` (`:1466-1512`). The file prices them itself: "the three wells cost 122px". |
| `:826 :789` the two `<h2>`s | `.section-heading`, Fraunces 25.89/800/lowercase at ≥768, 20.35 below |
| `:959 :980` the `.zone-row-label`s | Patrick Hand `--type-tag` 400 at `--ink-press-quiet` (68%) |
| the inactive panel's `display: none` | it is `v-show` on `OptionSelector` (`:843-848`), measured 0×0 with 3 options at **390 and 900**; `hiddenOptionRows: 1` at both (`base-head.json`) |
| `:2284` the zone disclosure tween | `.legend-fold { transition: grid-template-rows 200ms var(--ease-drawOn) }` — the crib behind the `i`, fine-pointer only. **It is not a group and this family does not touch it.** What changes at that node is one line: `.info-glyph`'s `border: 1.5px solid var(--ink-press-rule)` (`:2321`) goes, because acts are the only boxed things. |
| `typography.css:133-137` | `@media (min-width: 768px) { --type-group-title: var(--type-heading) }` — the second arm this family deletes |
| `typography.css:146-168` | `--type-option` in **three width arms**: 20px desk · **22px at 768–1023** · 16px phone, re-floored to 20px on `(max-width: 767.98px) and (pointer: coarse)` |
| the rule primitive | `wobbleLine` / `wobbleLinePoints` from `@mkbabb/pencil-boil@0.12.0` (`dist/path.js:51-63`, `maxDisplace = roughness * len * 0.015`) — the board's own generator — drawn on with `index.css:765-791`'s `.pencil-draw-on` (`pathLength="1"`, `--draw-dur`) |
| `GameGallery.vue:1003-1065` | the guard ribbon: `role="alertdialog"`, verbs are bare hit targets wrapping a `.guard-face` at `HandDrawnOutline :pose="0"` stroke 2 (2.5 destructive), ring `2px solid color-mix(foreground 45%)` offset 4, coarse `min-height: 44px` |
| `:506-566` | Deal/Clear's two-tap arms — `isCoarse && props.isDirty`, sublabel → `sure?`. **W1.1 has not executed**: no `fill`/`solve` arm exists to dress (R7 I4 at HEAD: Fill wrote 52 cells on one tap). |
| `:2096-2104 :2173` | `.action-bar { position: relative; background: var(--color-card) }`, sticky only under `(min-width: 1024px), (max-width: 1023.98px) and (orientation: portrait)`; **no border, no shadow, no drawn edge** — confirmed computed at every cell |
| `scene.css:467` | `--sheet-chrome: 12rem` — the one number the masthead seam hangs off |
| W2 §2.5's berth, §2.6's tag | `.action-bar .washi-label { top: 100% }` (the one berth, below the bar's rule); `SheetWashiLabel` `anchor="tag"` sticky, `z-index: 35` |

**The estate already ships both arms of this family's fork, and it chose by width.**
`GameControlPanel.vue:1558-1633`: `.zone-row` is a flex row whose caption is a fixed
**3.75rem (60px)** column *beside* the chips on the phone, and `.zone-row-stacked` puts the
same caption *over* them on the desk rail. The file's own comment prices it: "measured 3.75rem
clears `candidates` at every width this branch mounts at". The rail is the narrow surface
(wrap 284.22px at 1280, 290px at 1440); the phone card is the wide one (374px). So the
product's incumbent law is **beside on the phone, above on the rail** — the exact inverse of
arm (b)'s proposal, and the reason is measured below.

---

## 1 · The card at HEAD (`base-head.json`, both engines identical unless noted)

| cell | content / scrollport | below the fold | wrap width | bar |
|---|---|---|---|---|
| desk 1280×800 | **1142 / 608** | 46.8% | 284.22 (card 324.22) | sticky, covers `new game` 8.3% |
| dock 390×844 | **699 / 628** | 10.2% | 374 | sticky, covers `players` **88.9%** |
| landscape 900×500 | **743 / 284** | 61.8% | 884 | **`position: relative`** — not sticky, covers nothing because it holds nothing up |
| rail 1440×900 | 1144 / 640 | 44.1% | 290 (card 330) | sticky, covers `pencils` 11.6% |

8 names · **3 voices** · **2 of 8** document headings — the census's figures, unmoved.
`--type-option` resolves to 20px at 1280 and at 390-coarse but **22px at 900×500**; that third
arm is load-bearing below.

`r0/r1-controls/probe/heading-voice.spec.ts` re-run unchanged on this port: **4 cells, 4
failed** (ROW 1 expected 1 voice, received 3 · ROW 2 expected 8 headings, received 2 · ROW 3
dock 1.0175 against the 1.23 floor). Born-RED reproduces.

---

## 2 · The ruled page, prototyped

`window.__rp({arm, release, barOut, drawOn, rule:{roughness, segments}})`. It deletes the old
names rather than hiding them (a hidden node still answers a census), strips the wells' frames,
padding and margins, opens both mobile panels, kills the `staged-section` CSS hairline, draws
one wobbled rule per group, boxes the acts at `:pose="0"` stroke 2, draws the bar's top rule,
and moves the explication tapes onto the new names.

### 2.1 VOICE — one tuple, one rung, both viewports

**Fraunces · `--type-heading` (1.618rem = 25.89px, the φ identity rung) · 800 · lowercase**, at
every viewport. That is `typography.css:124` re-pointed and `:133-137` deleted — **one
right-hand side**, exactly as W2 §2.6 promised. Ink stays a fourth axis inside the one voice:
`size` at `--color-muted-foreground`, `level` in the selected tier's crayon (data, not voice).

| row | HEAD | overlay |
|---|---|---|
| ROW 1 · one voice | 3 | **1** — `Fraunces · 25.89 · 800 · lowercase`, every cell, both engines |
| ROW 2 · one rank | 2 of 8 | **7 of 7** document headings |
| ROW 3 · name ÷ option ≥ 1.23 | desk 1.294 / dock 1.0175 | desk **1.2945** · dock **1.2945** · **900×500 1.1768 — RED** |

**The row this lane adds beside the instrument, born-RED:** ROW 3 must hold at 900×500 too,
and it does not, because `--type-option` is **22px** in the 768–1023 arm (`typography.css:151`).
25.89/22 = 1.1768 against the 1.23 floor. The r0 instrument runs at desk and dock only, so it
would have gone green on a card that still fails a third of its viewports. **The cure is one
more right-hand side: the 768–1023 arm of `--type-option` joins the other two at 20px** (the
arm is the tablet's, the phone already reads 20 by M01's lift, the desk ships 20). Then the
option rung is ONE number and ROW 3 reads 1.2945 at every cell.

### 2.2 The name count — 7, and why

`size · level · new game · marks · candidates · checking · players`.

- **`pencils` dies.** It named a *container* of two groups. With one rule per group, `marks`
  and `candidates` are the names, and a name over two names is the nesting this family refuses.
- **`checking` and `players` survive** unchanged: each named exactly one idea already.
- **`new game` survives**, and it is the only interesting one. It stops naming a compartment
  that held `size`, `level` and the verb, and starts naming the group that is the **deal**
  itself (the die, its sublabel, its tally receipt). A page reading `size · level · new game`
  under three rules reads as three asks and one commit, in order; a page whose third group is
  unnamed has six names and one silent act, which breaks "every group name in one voice at one
  rung". Six names was prototyped (`opts.names = 6`) and reads as a dropped stitch.
- The count is 7 and not 8 because the fourth well's tape (`pencils`) was never a group name.

### 2.3 HEIGHT — the kill condition, met by one arm and cleared by the other

Content height / scrollport, both engines to 1px:

| cell | HEAD | arm (a) name ABOVE | arm (b) name BESIDE |
|---|---|---|---|
| desk 1280×800 | 1142 / 608 · 46.8% | **1305** / 608 · 53.4% (+163) | **1087** / 608 · 44.1% (**−55**) |
| dock 390×844 | 699 / 628 · 10.2% | **999** / 628 · 37.1% (+300) | **781** / 628 · 19.6% (+82) |
| landscape 900×500 | 743 / 284 · 61.8% | **1065** / 284 · 73.3% (+322) | **848** / 284 · 66.5% (+105) |

The gap between the arms is **217.4px at every cell** — 7 names × the φ heading's 31.06px line
box, to the pixel. That is the charter's HEIGHT kill stated exactly: *the name above costs its
own line, seven times.* The compartment's retirement pays back 122px of the 217 (the wells'
padding and margins, the file's own figure re-derived); the tabs' death spends 52px back (the
`level` row is now open); the CSS hairline's death returns 17.2px.

Arm (b) is the only arrangement in this family that leaves the desk card **shorter than it
ships**. Arm (a) adds 43% to the phone card.

### 2.4 WIDTH — arm (b)'s kill, in one line of arithmetic

Every name's ink at the φ rung (identical at 390 and 1280; the rung is a fixed rem):

| name | size | level | marks | players | checking | new game | candidates |
|---|---|---|---|---|---|---|---|
| ink px | 49.48 | 60.50 | 83.77 | 96.84 | 117.41 | 129.19 | **141.61** |

The margin sweep at 390 (`fix2.json`, the `marks` group, 14 margins × 2 engines): the three
`Normal · Corner · Center` chips are 96.02px natural and stop being squeezed past their own
padding at **margin ≤ 64px** (chromium 0.14px residual) / **≤ 56px** (webkit). At the charter's
`clamp(88px, 22%, 132px)` the margin resolves to **88px**, the field to **278px**, and each
chip's word overruns its content box by **8.14px (chromium) / 9.05px (webkit)** — the padding
is eaten, not the layout. So the field's floor at 390 is **302px**.

    141.61 (widest name, one line) + 8 (gap) + 302 (field floor) = 451.6px
    available at 390:                                              374.0px
    short by                                                        77.6px

At the clamp's own maximum (132px) it is still short by 68px, and `new game` already wraps to
two lines at 88 (name box h **62.13** = 2 × 31.06, measured at 1280 and 390). **Arm (b) cannot
hold both halves on the phone.** It fits the desk comfortably — 141.61 + 8 + 84 = 233.6 against
284.22 — which is why it is the only arm that makes the desk card shorter.

Per the charter: the margin must collapse on the phone, so **arm (b) has collapsed into a pure
type law**, and shipping it above 1024 only would be the split grammar B6 fired against.

`frames/armb-margin-column-1280.png` (14 KB) is the second half of the kill: right-aligned
names in a fixed column against a field column is the **settings-form tell**, unmistakably, and
the crop shows `new game` broken across two lines in its margin.

### 2.5 The sticky fork — and the one mechanism that greens I3

R7's I3 at HEAD: `new game` is the only tape that ever pins, and at **3 of 5** desk scroll
states its own group is under half on screen (0.401 / 0.058 / 0.050 at 1440×900).

| arrangement | I3 violations (5 scroll states) |
|---|---|
| HEAD | 3 (desk 1440×900) |
| arm (a), head sticky to its whole group (the push law) | desk **4** · dock **1–3** by pose |
| arm (a′), head sticky to the group's **top half** | **0** · desk and dock · both engines |
| arm (b), no sticky at all | **0** · every cell · both engines |

**Why the push law cannot green it, as geometry rather than taste.** A head that sticks to its
whole group stays pinned until the group's last pixel, so the group's visible fraction can fall
to `headHeight / groupHeight` while its name is still at the top of the scrollport. At the dock
that is 31.06 / 101.66 = **0.306**. For the floor to clear 0.5 the group must be no taller than
**2 × 31.06 = 62.1px**, and the shortest group this card can build is **70.59px** (a name plus
one 44px coarse chip row plus its padding). **No group in this product can be short enough.**

**The release.** The head's sticky containing block becomes the group's top half — an
out-of-flow box (`position: absolute; inset: 0 0 50% 0`) with the head sticky inside it — so a
name un-pins exactly when its group is half gone. Measured: **0 violations at 5 scroll states,
desk and dock, both engines**. It is layout-neutral (the box is out of flow) and mints no
filter. It is also a MECHANISM, and W2 owns mechanisms: the synthesizer must route it through
W2 rather than land it here.

Two defects of the prototype's own release, both real and both cheap:

1. It clones the head, so the DOM carries **14 headings** for 7 groups (the twin is
   `aria-hidden`, so the accessibility tree still reads 7, and the rule count doubles 7 → 14).
   The cure is to put the **real** head in the sticky box and give the group a spacer of the
   head's height — one node per group, not two.
2. The pinned head is opaque (`background: var(--color-card)`, z 34) and **paints over the
   focus ring of the first control in its own field** — the ring measured 1:1 against the card
   under a head and 3.15:1 with air above it. The head's background must stop at its own rule,
   or the field must carry `scroll-margin-top` equal to the head.

### 2.6 THE RULE — pencil, measured against the board's own

`wobbleLine(0, 2.5, W, 2.5, { roughness: 0.4, segments: 8, seed })`, one seed per name, stroke
1.6 at `--ink-press-rule`, `pathLength="1"` + `.pencil-draw-on` at `--draw-dur: 260ms` with a
`(seed % 7) × 22ms` delay.

| subject | σ (CSS px) | max deviation | chord |
|---|---|---|---|
| this family's group rule | **1.0509** (chromium) / **1.0507** (webkit) | 1.734 | 284.67 |
| the board's cell rule, same page, same run | 1.1078 | — | — |
| R3's grid band `[0.5σ, 2.0σ]` | **[0.722, 2.886]** | | |

**Inside the band, and within 6% of the board's own rule on the same screen.** A CSS hairline
is σ 0 by construction; this is not one. The incumbent 1.5px `border-top` at
`GameControlPanel.vue:1543` was chosen because a second `BoilDivider` would take the filter
census 9 → 13 (R6 law 11) — that constraint does not bind a **static** path: the filter census
reads **9** under every overlay pose, both arms, both engines, at every cell
(`overlay.json`, `fix4.json`). Zero live filters, zero beats, zero new keyframes.

Painted contrast, canvas read-back of the engine's own bytes, never hex arithmetic:

| ground | light | dark |
|---|---|---|
| `--color-card` (the only ground a group rule sits on) | **3.53:1** | **4.35:1** |
| worst single sample, webkit light, stroke 1.6 | **3.06:1** | 3.79:1 |

Both clear the 3:1 non-text floor; the 3.06 is the antialiased minimum at stroke 1.6 and is the
number to watch if a synthesizer thins the rule. `--color-background` is not a ground for this
mark — the rule never leaves the card.

Cost at mount: **22.6ms chromium / 55ms webkit** to build 14 rules plus the acts' faces and the
bar's rule; the draw-on class adds ~1ms (22.6 vs 21.7 with it off).

`frames/rule-vs-hairline-390-above.png` (12 KB) is the rule beside the acts' boxes at 390.

### 2.7 THE BAR — M04 is a layout row wearing a chrome row's clothes

The drawn top rule greens I2's first half: `ownChrome = true` at three cells, both engines (the
rule is a one-sided `svg.outline-svg`, the one box grammar's own class, not a CSS border).

Its second half — *covers no option group* — does not move while the bar is sticky, and the
reason is not z-order. Coverage measured **clipped to the scrollport's client box** (a group
scrolled out of sight is not a group the bar covers — the r0 reading did not clip, which is why
it reads one pose rather than a law):

| the bar | dock 390×844 | landscape 900×500 | desk 1280×800 |
|---|---|---|---|
| `sticky; bottom: 0` **inside** the card | 85.6% worst | 90.1% worst | 37.1% worst |
| **the case's foot** — outside the scrollport, card shortened by the bar's band | **0.0%** | **0.0%** | **0.0%** |

Zero at every scroll state, three cells, both engines, with the bar's top edge landing
**0.19–0.23px** below the card's bottom. `position: sticky; bottom: 0` *means* "over the
content" — reserved padding inside the scrollport cannot cure it, because the bar floats over
whatever the scroll has put beneath it at every offset but the last. **So M04's cure is: the
bar leaves the scrollport and becomes the case's foot; the drawn top rule is its face.** That
also gives the landscape dock its sticky bar (`scene.css`'s media pair was written when there
were two scrollports and there are now three) for free, since a foot is a foot in all three.

The price is honest and should be stated to the owner: the scrollport loses the bar's band
(67px at the dock, 65px at the desk), so the card scrolls 67px sooner.

### 2.8 TABS DIE

`size` and `level` become two open groups. At 390 and at 900 the hidden option row count goes
**1 → 0**; `level` carries 3 options that are always laid down; the tap count from the playing
view goes **3 → 2** (open the sheet, tap the tier), which is §8's ask in one number. Price: the
dock card +82px under arm (b), +300px under arm (a).

### 2.9 CONFIRM — both faces, and both need one more number

| face | Δ verb box | Δ bar | Δ wrap | reach |
|---|---|---|---|---|
| in place (`sure?` + a bare `no`) | **left −8.06, right −8.06**, top/bottom 0 | 0 0 0 0 | 0 0 0 0 | the `no` measures **12 × 21px** |
| ribbon in the bar's note berth | **0 0 0 0** | 0 0 0 0 | 0 0 0 0 | lands 1.59px below the bar, both verbs in the viewport; `keep` **39×44**, `clear` **41.6×44** |

Both engines identical. Two findings:

- **The in-place face is not Δ=0.** The band does not move (bar and wrap are 0 on four sides,
  so nothing reflows), but the verb's own box shrinks 16.1px because `Clear` → `sure?` is a
  narrower word. The cure is a reserved width on `.icon-sublabel` equal to the wider of its two
  words, or a fixed column in `.action-verbs`. Until then the charter's "Δ = 0 on four sides"
  is false for the verb itself.
- **Both faces fail the 44px floor in one dimension** — the in-place `no` in both, the ribbon's
  verbs in width (39 and 41.6). The gallery's ribbon carries `min-height: 44px` only; a
  destructive confirm on a thumb needs the floor in **both**, with the per-dimension negative
  control `e2e/zone-grammar.spec.ts` already models.

**I4 cannot be greened from this lane and should not be claimed.** W1.1 has not executed:
`fill` and `solve` carry no arm on this tree (R7's reading — Fill writes 52–57 cells on one
tap), so there is no arming to dress. This family prototypes the FACE; the verdict stays with
W1 §1.5. On the evidence above, the **ribbon in the note berth** is the one to develop: it is
zero-reflow on all four sides at every box, it is the house's twice-owner-passed shape, and one
mechanism then serves deal · clear · fill · solve. The in-place face costs a reserved width and
still puts a destructive answer inside the same box as the destructive verb.

### 2.10 ACCESS + the floor

Against the overlay at 390, both engines, bar as foot:

- **2.1** — 0 controls focus into a ≥96% burial (HEAD's failure mode was the bar painting over
  the control it scrolled to).
- **2.2** — 21 tabbables in the drawer subtree, none covered; nothing to make inert, because
  nothing is buried.
- **2.3** — 14 of 14 chips carry text and `aria-pressed`; the chip and sublabel ratios are
  `--type-option` / `--ink-press-quiet` on `--color-card` and this family does not move them.
- **The 44 floor** — 0 controls under 44 in either dimension inside the card. The two
  exceptions are the confirm faces in §2.9.
- **Focus ring** — the gallery ribbon's own, `2px solid color-mix(in srgb, var(--color-foreground) 45%, transparent)`
  at `outline-offset: 4px`, painted: **3.145 (chromium) / 3.206 (webkit) light**, **3.973 /
  3.993 dark** on `--color-card`. It clears 3:1 with 0.145 of headroom in light; at 50% instead
  of 45% the margin is comfortable. Adopting it gives the card its first authored ring (the
  census found none — chromium 1px auto, webkit 3px auto).

### 2.11 THE 390 SEAM and the quick set

The case's painted top band against the wordmark's box, re-derived (band = the `outline-svg`'s
top, stroke 3):

| viewport | clearance chromium / webkit |
|---|---|
| 375×812 | **+5.77 / +5.48** |
| 390×844 | **−2.73 / −3.02** (overlap) |
| 430×932 | +14.11 / +13.98 |

Two stroke widths is 6px, so 390 fails outright and 375 misses by 0.23/0.52px. The band is one
right-hand side: `scene.css:467`'s `--sheet-chrome: 12rem` → **≥ 12.6rem** (+9.6px) puts 390 at
+6.3 and 375 at +14.8. It costs the sheet 9.6px of height.

The quick set (M13): the board's paper is 366px wide, the shut tongue spends 92, leaving
**274px of free bottom edge** — two 44px targets plus their seams. The portrait fold already
carries undo 46×56 · redo 46×56 · hint 46×56 · peek 59.8×44 in a 366×61.6 row; **at 900×500
that row is `display: none` and the tongue is the only control in the viewport**, which is
where the quick set actually earns its place. So: `hint` and the pencil **mode** chip (the
deepest well's most-changed setting, showing its current word), riding the tongue's own band on
the board's bottom edge, never `deal` and never `clear` — arming a guarded act and then making
it cheaper works against W1 §1.5.

### 2.12 The tape's remaining office

`SheetWashiLabel`'s `tag` anchor retires as a NAME (that is what makes 8 names into 7 headings).
The tape keeps three jobs and they are all it ever did well: the **hover/focus explication**
(the five `.zone-hint` tapes — under the overlay their reveal seam moves from the dead caption
to the new name, `:has(.rp-name:hover)`, so R6 law 14's "exactly one hover affordance" holds),
the **`center` anchor on the divider's ruled line** ("hold to peek"), and the **bar's one berth
note**. Washi stays neutral paper; nothing about it becomes a heading.

---

## 2.13 The three sketches

**(1) Arm (a′) at 390 — the page, with the release and the foot.** The rule is drawn, the name
sits on it at the φ rung, nothing nests, nothing hides.

    ┌ case ────────────────────────────────────────────┐  ← 6px below the wordmark's box
    │ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ │     (--sheet-chrome +9.6px)
    │  size                                       ▲    │  ← head sticky inside the group's
    │   [ 4×4 ]  [ 9×9 ]  [ 16×16 ]               │    │     TOP HALF; it un-pins at 50%
    │ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ │    │
    │  level                                      │ s  │
    │   [ Easy ]  [ Medium ]  [ Hard ]            │ c  │  ← the tabs are dead: 2 taps, not 3
    │ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ │ r  │
    │  new game                                   │ o  │
    │   ┌──────┐                                  │ l  │  ← acts are the ONLY boxed things
    │   │ ⚄    │  medium · 34 given               │ l  │     (pose-0, stroke 2)
    │   │ Deal │                                  │ p  │
    │   └──────┘                                  │ o  │
    │ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ │ r  │
    │  marks                                      │ t  │
    │   [ Normal ] [ Corner ] [ Center ]          ▼    │
    ├──────────────────────────────────────────────────┤  ← the card ENDS here (0.2px gap)
    │ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ │  ← the bar's ONE drawn top rule
    │  ┌────┐  ┌────┐  ┌────┐  ┌────┐                  │
    │  │ 🧽 │  │ ▦  │  │ ✦  │  │ ⤴  │        (i)       │  the bar is the CASE'S FOOT:
    │  │clear│ │fill│  │solve│ │share│                  │  coverage 0.0% at every state
    │  └────┘  └────┘  └────┘  └────┘                  │
    └──────────────────────────────────────────────────┘

**(2) The release, as geometry — why the push law cannot green I3.**

      push law (head sticks to the whole group)      the release (top half only)
      ┌─ group ─────────────┐                        ┌─ group ─────────────┐
      │ ▓ name  (pinned)    │ ← still pinned         │ ▓ name  (pinned)    │
      │ ░░░░░░░░░░░░░░░░░░░ │                        │ ░░░░░░░░░░░░░░░░░░░ │ ← sticky box
    ──┼─────────────────────┼── scrollport top     ──┼─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┼── ends at 50%
      │ ░░░ 26% visible ░░░ │                        │  the name goes with │
      └─────────────────────┘                        └─ its own half ──────┘
      floor on groupVis = headH/groupH               floor on groupVis = 0.50
                        = 31.06/101.66 = 0.306       measured: 0 violations / 5 states
      needs groupH ≤ 62.1px; shortest is 70.59       desk + dock, both engines

**(3) Arm (b) at 390 — the arithmetic that kills it.**

    |←88→|←8→|←────────── 278 ──────────→|        available: 374
    ┌────┬───┬──────────────────────────┐
    │new │   │ [Normal][Corner][Center] │        each chip 96.02 natural,
    │game│   │  ↑ 8.14px of the word    │        squeezed to 87.88 — the word
    └────┴───┴──── overruns its padding ┘        overruns its own content box
      ↑ wraps to 2 lines (62.13px tall)

    what it actually needs:  141.61 ("candidates" at the φ rung, one line)
                           +   8   (gap)
                           + 302   (the field's floor: 3 × 96.02 unsqueezed)
                           ═ 451.6  against 374  →  short by 77.6px

---

## 3 · Kill conditions

| condition | verdict |
|---|---|
| **HEIGHT** — six-to-eight headings at a heading rung in a 324px rail | **MET for arm (a)**: +163px desk, **+300px dock**, +322px landscape; 217.4px of it is the seven name lines. **CLEARED for arm (b)**: −55px desk, +82px dock. |
| **WIDTH** — a margin that collapses at 390 | **MET for arm (b)**: 141.61 + 8 + 302 = 451.6 needed against 374 available; short by 77.6px, and `new game` wraps at 88. |
| a rule that reads as a broadsheet hairline | **CLEARED**: σ 1.051px against the board's 1.108 and R3's band [0.722, 2.886]; zero live filters; the CSS hairline is deleted, not imitated. |
| a margin that reads as a form's label column | **MET for arm (b)** — `frames/armb-margin-column-1280.png`. |
| the ribbon reachable while the bar's verbs are inert | prototyped; the ribbon lands 1.59px below the bar with both verbs in the viewport, but its verbs are 39 and 41.6px wide — the floor needs the second dimension. |
| the in-place face must not push the band's height | **CLEARED** (Δbar and Δwrap 0 on four sides) — but the verb's own box moves 16.1px, so the charter's Δ=0 is not met as written. |

---

## 3.1 Prior art (background only — the verdict is the codebase's)

- **The sentinel pattern for sticky section headers** (Chrome for Developers, *An event for CSS
  position: sticky*): waypoint nodes at each section's top and bottom, watched by an
  IntersectionObserver, are the standard way to know when a header enters and leaves its pin.
  The CSS-only half of that page states the rule this lane measured: *a sticky element can only
  travel inside its own parent*, so where the parent begins and ends IS the release. The 2026
  CSS answer to the same problem is `container-type: scroll-state` with
  `@container scroll-state(stuck: top)`, which styles a pinned header with no JavaScript —
  relevant if the synthesizer wants the pinned head to look different from the resting one.
- **Tufte CSS** is the canonical name-beside-content page, and its own answer to the phone is
  the finding this lane reproduces independently: *on large viewports the margin carries the
  sidenotes; on small viewports the margin's contents are hidden until toggled*. The margin
  column is a desk idiom in its own reference implementation, which is what arm (b)'s 77.6px
  shortfall at 390 says in pixels.

Sources: [developer.chrome.com/docs/css-ui/sticky-headers](https://developer.chrome.com/docs/css-ui/sticky-headers) ·
[purecss.com/examples/sticky-sections](https://purecss.com/examples/sticky-sections/) ·
[edwardtufte.github.io/tufte-css](https://edwardtufte.github.io/tufte-css/)

---

## 4 · Recommendation — DEVELOP, with two adjustments

The idea holds. One drawn graphite rule per group, one voice at one rung, nothing nested and
nothing hidden, acts as the only boxed things: it greens ROW 1 (3 voices → 1), ROW 2 (2 of 8 →
7 of 7), ROW 3 at desk and dock (1.0175 → 1.2945), I2's own-chrome half, `access.spec` 2.1 and
2.2, and it takes `level` from three taps to two — with the filter census unmoved at 9 and the
rule's wobble inside the board's own measured band on the same screen. **Two things must
change before the synthesizer writes the spec.** First, the fork resolves to **the name ABOVE
its rule (arm a), with the release** — not because above is prettier but because BESIDE is
77.6px too wide at 390 and reads as a settings form at 1280, while the push law is provably
unable to green I3 for any group taller than twice its name and the release greens it at 0
violations, both engines, desk and dock. Arm (a)'s price is real and must be paid in the same
breath it is incurred: the phone card grows 300px, of which 217 is the seven names, so the
family owes the synthesizer its own height budget — the wells' 122px, the hairline's 17px, and
a hard look at whether `deal`'s 181px group and the players roster can give back the rest.
Second, **M04 is a layout row, not a chrome row**: the drawn top rule is the face, but the
coverage only reaches 0.0% when the bar leaves the scrollport and becomes the case's foot, and
that is the only shape in which the landscape dock gets a sticky bar at all. Three smaller
numbers travel with it and none of them are taste: `--type-option`'s 768–1023 arm must join the
other two at 20px or ROW 3 stays red at 900×500; both confirm faces need the 44px floor in
**both** dimensions and the in-place face needs a reserved word width before anyone calls it
Δ=0; and `--sheet-chrome` needs +9.6px or the sheet keeps cutting the wordmark at 390. Nothing
here closes a mark — U-10 stands, and the owner disposes at the re-look.
