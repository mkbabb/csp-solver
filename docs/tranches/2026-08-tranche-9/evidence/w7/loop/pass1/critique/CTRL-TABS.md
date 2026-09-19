# CTRL-TABS · pass 1 (CRITIQUE) — the adversarial read

Critic: Opus 5, and it wrote neither the spec nor the prototype. Section §10 (§1 §2 §8 §14 §15 inside).
Nothing closes here (U-10). Verdict at the foot.

    WHAT I DID     read the worktree's whole diff (`git -C .claude/worktrees/wf_e58b4764-0fc-39 diff`,
                   10 files, +1,269/−1,431); looked at all nine frames; stood the PROTOTYPE on
                   127.0.0.1:4240 and HEAD on 127.0.0.1:4242 (both `npx vite --strictPort`, my own
                   band, never :3000, no Safari, no osascript) and ran five probes of my own across
                   chromium AND webkit. Probes and readings banked beside this file in
                   `critique/CTRL-TABS/`.
    HEADLINE       the prototype is REAL — five of its headline numbers reproduced on my instrument
                   to the hundredth. It also carries an AA FAILURE nobody measured, and it moves
                   40.78px of the primary surface without declaring it.

---

## 1 · What I reproduced (the prototype is not asserting; it measured)

`critique/CTRL-TABS/crit-contrast.mjs` → `crit-contrast.json`, 390×844, both engines, both themes.
Analytic composite (ink alpha over the effective ground, multiplying the ancestor `opacity` chain),
so it is not the extreme-pixel reader that ran hot in webkit for the prototype.

| row | prototype claimed | I read | engines |
|---|---|---|---|
| `.controls-card` scrollHeight / clientHeight, 390×844 | 296 / 296 FIT | **296 / 296 FIT** | chromium + webkit, light + dark |
| unraised tab word, one dimming | 5.24 light / 6.01 dark | **5.24 light / 6.05 dark** | both |
| raised tab word | 19.45 / 15.84 | **19.45 / 15.84** | both |
| tab boxes at 390 | 103.61 · 79.88 · 95.13 · 83.39 × 44 | **identical** (webkit 103.39/79.98/95.27/83.36) | both |
| board left edge, 1280×800 webkit | 129.84 → 129.89 (Δ 0.05) | **129.84 → 129.89** | webkit |

**ONE DIMMING HOLDS.** The law is real and the ratio clears 4.5:1 in both themes on an
engine-independent reader. The prototype's own webkit 14.49 was an artefact of its sampler, and its
caution about that was correct.

`crit-falsify.mjs` also settles a fair suspicion: **the NO-SCROLL gate can fail.** Inject 400px into
the face-up tray and it reds at every cell in both engines (390: 660/610; 900×500: 660/266). It is
not the unfalsifiable shape a one-grid-cell layout invites.

Gates I ran bare in the worktree: `check-copy-register` **exit 0** (0 em dashes, 1 admitted, 0
unadmitted); `check-font-coverage` **exit 0**; R6 `law-probe` on the patched tree — **L2/L4/L5/L6
GREEN, R3 RED→GREEN as claimed, L1/L3 RED as the HEAD-pinned literals the cure moved, R1/R2 red and
not this family's**. Every one of those is as the prototype reported it.

---

## 2 · What nobody measured — the AA failure in §15's own mechanism

`crit-guard.mjs`, computed from the tree's own tokens in a live document, **both engines, both themes**.

    .guard-go { color: var(--color-red-ink) }                                  #d02a52 light
    .guard-go .guard-face { background: color-mix(in srgb, var(--color-foreground) 8%, transparent) }
    .guard-btn { font-size: var(--type-verb) }                                 → 14px at 390

| reading | light | dark |
|---|---|---|
| **`clear` (the destructive verb) on its own 8% face** | **4.20:1 — UNDER 4.5** | 5.26:1 |
| the same ink on the bare card, if the face were absent | 4.99:1 | 6.30:1 |
| `keep` on the card | 19.45:1 | 15.84:1 |
| the 8% face against the card — the "marked" cue itself | **1.19:1** | 1.20:1 |

Two things, and the second is worse than the first.

1. The destructive verb fails AA on the light theme at 14px normal weight. It is not large text under
   any reading of 1.4.3. **The family's own device is what breaks it**: on the bare card the ink
   clears at 4.99, and the 8% graphite face the spec adds to mark it is exactly what pushes it under.
2. The spec's redundancy claim — "a reader who can see neither colour nor weight still meets one verb
   marked and one bare" — rests on a fill that measures **1.19:1** against its ground. That is not a
   cue anyone meets. The stroke ladder (2.5 against `keep`'s 2) is doing all of the non-colour work,
   alone.

The prototype reported the ribbon's BOXES (48.78 row, 45.33×44 and 47.98×44 verbs, focus return,
`role="group"`) and never its INK. The geometry the research owed got paid; the contrast did not.

---

## 3 · The 40.78px it moved and did not declare

`crit-board.mjs`, sheet SHUT, five cells × two engines, prototype against HEAD on two servers.

| cell | board `y` | masthead `y` | engines |
|---|---|---|---|
| **390×844** | 219.73 → **260.52** (+40.79) | 143.52 → **184.30** | chromium AND webkit (webkit 219.42 → 260.20) |
| **375×812** | 211.23 → **252.02** (+40.79) | 135.02 → **175.80** | both |
| 900×500 | — | — | **pi holds, byte-identical** |
| 844×390 | — | — | **pi holds, byte-identical** |
| 1280×800 | 129.84 → 129.89 (webkit, +0.05) | same | as the prototype reported |

The whole playing block drops **40.78px on the two commonest phone cells**, both engines, with the
sheet shut. Board width, height and shell height are unchanged, so it is a pure translation. The
cause is in the diff: `--sheet-chrome: 12rem` → `max(12.6rem, calc(var(--masthead-foot, 12.6rem) + 8px))`
(`scene.css`), which the spec declares as a SEAM change and prices as a seam number (292.06 at 390)
— not as a board move.

The family declared exactly one geometry invariant and it is the desk's: "the desk board's left edge
within 0.5px at 1280 and 1440, goldens byte-identical." That guard holds. The phone's board is
outside it, was not measured, and any portrait golden reds on it. Whether the drop is an improvement
is a separate question and may well be yes — but it is undeclared, and "the pixel it moves that it
did not declare" is the checklist item it is.

To the family's credit, the pi I feared most is clean: the gallery is untouched. `--type-option`
22→20 at ≤1023.98px moves the TOKEN at 800×600 and 900×500, but `StagingBand`'s chips paint at 16px
in both arms at all five cells and both engines, and `.staging-axis-label` overrides
`--type-group-title` with `--type-small`, so the section heading does not move either
(`crit-gallery.mjs`). The board, masthead, logo, sun and shell are byte-identical at 900×500,
844×390 and 1280×800 chromium.

---

## 4 · Where the card still scrolls, and the cells nobody priced

`crit-falsify.mjs`, sheet open, every tray face-up:

| cell | prototype's claim | I read | fits |
|---|---|---|---|
| 390×844 | 296/296 | 296/296 | yes |
| 900×500 · 844×390 | 260/260 | 260/260 | yes |
| **320×480** | not priced | **296 / 246** | **NO** |
| **360×400** | not priced | **296 / 166**, live tray overflows the card by **+44.9px** | **NO** |

The card's height is its content's (296 portrait, 260 landscape) and does not respond to a short
viewport; `overflow-y` is still `auto`. Below roughly 375×560 the disease returns, in both engines,
and the family states no minimum viewport. The five priced cells are all it holds at.

---

## 5 · What the frames say and the numbers did not

Reading all nine, beyond the two the prototype already confessed (the 900×500 two-objects-on-one-flank
and the armed card's 296.42 → 276.81 shrink, both of which I confirm from the frames):

- **THE FLOOR WRAPS TO TWO ROWS ON THE DESK.** `f3b-desk-rail-1280x800`: row one is
  `deal · dealt ⊪ · clear`, row two is `fill · solve · share · peek`. The spec's sentence is "deal ·
  clear · fill · solve · share · peek in ONE ROW (299.83 of 374)", priced at 390 only. Two rows also
  scrambles the reading order — `clear` sits beside `deal` while `fill` and `solve`, destructive by
  the family's own I4, drop below. Unpriced, unmeasured, and it contradicts the spec in writing.
- **THE DESK CARD IS DOUBLE-FRAMED WITH AN ASYMMETRIC GUTTER.** Two nested hand-drawn rectangles,
  wide on the tab flank and tight on the right, and the strip's foot (`keys`) ends ~90px above the
  inner frame's bottom, leaving a bare flank. The "min-height = the strip's length" the spec declared
  is not what ships (§7 below), and the frame shows what that costs.
- **The floor's ink hierarchy is inverted**, and this one is measured, not impressionistic:

| act | ink | light ratio |
|---|---|---|
| `deal` — "the card's one primary verb" (`--type-act`) | `--color-muted-foreground` | 4.66:1 |
| `clear` · `fill` · `solve` · `share` | same | 4.66:1 |
| **`peek`** — a hold-to-reveal convenience | near-black on its own #F0F0F0 chip | **17.36:1** |

  The least consequential act is by far the loudest thing on the floor, and the declared primary reads
  identically to the four secondaries. `solve` carries the blue accent on top of that, making it the
  second loudest. Nothing in the return names a floor ink ratio.
- **The memorable thing DOES land on the phone.** `f1` in both engines: `pencils` raised, its bottom
  edge omitted, running unbroken into its tray, the floor drawn as one piece beneath. That is the
  claim, screenshotted on the real surface in both engines, and it works.

---

## 6 · Residue the patch leaves behind

- **`--type-group-title` is now a consumer-less alias.** Its only class, `.section-heading`, survives
  in exactly one template (`StagingBand.vue`) where `.staging-axis-label` overrides the font-size
  with `--type-small`; the panel's own users were deleted. Measured: `--type-group-title` goes
  1.272rem → 1.618rem at 390 and **no glyph moves anywhere**. The patch keeps the token with a
  comment reading "the section heading / the row caption", and the row caption reads `--type-name`
  directly. A token nothing reads, carrying a comment that claims two consumers it has not got.
- **`check-font-coverage`'s new group is only half derived.** Its own output puts `keep` and `peek`
  in the DEPARTURES bucket — declared, not rendered — because no extractor reaches them (`keep` is
  authored in the template, not through `armFor`; the peek chip likewise). The patch's comment says
  the corpus is "compared to the tree rather than asserted"; for two of its eleven strings it is
  asserted, in the one bucket the gate cannot red on. The whole `.washi-tag` group (eight strings) is
  now departures too — a declared group with zero live consumers.
- **The seam gate is vacuous now, and unlike I3 it is not labelled so.** `≥6.00px` reads 292.06 at
  390 because the card shrank ~400px, not because a seam was decided. The prototype says as much
  ("cleared for a structural reason") and then reports it as a cleared gate. It belongs beside I3 in
  the vacuous column.

---

## 7 · Spec against prototype — two declared mechanisms are not what ships

Not fatal, but the spec is what pass 2 and the owner read, so it must be corrected rather than left:

- The spec says the three trays not face-up are **`inert` + `display: none`**. They ship as `inert` +
  **`visibility: hidden`** (`GameControlPanel.vue:1393`), and the source comment at :208 still says
  `display: none`. The difference is load-bearing: `visibility: hidden` is what keeps all four trays
  in one grid cell and gives the 0.00px height invariant, and it is also what kills the live regions.
- The spec says **"the desk card takes min-height = the strip's length (declared)"**. The prototype's
  own README reports that a min-height floor left `new game` 33.72px proud at 1280, so it shipped the
  shared grid cell instead. The declared mechanism was replaced by a better one and the spec still
  carries the old sentence.

---

## 8 · Two W2 rulings, not one

The charter is explicit: W2's mechanics (sticky tag, dock, bottom tab, tap-floor token) are LANDED —
design the voice on top of them, never new mechanics. This family needs W2 twice:

1. It **mints** a new W2 layout mechanic — the rail's pinned `inline-size` (324.22 at 1280 / 330 at
   1440) with the flank strip absolute. The spec names this honestly as "the hardest dependency",
   and the prototype proves it does not disturb the goldens' subject (|Δ| 0.00 / 0.05px). This is the
   good kind of dependency: implemented, measured, awaiting a ruling.
2. It **retires** a landed one — W2 §2.6's sticky tag with its four terms and the dissolve, plus the
   bar's sticky arm, `--action-bar-h`, `scroll-padding-bottom`, `#fold-tools` and the portraitDock
   Teleport. The reason is structural and stated (a card that does not scroll has nothing to stick
   to), and I accept it, but deleting a landed W2 mechanic is not "the voice on top of it". W2 has to
   say so, and the family should ask rather than assume.

Neither is a BLOCK — the primitive is built and proven, not missing — but the family owns two
rulings it cannot make itself, and only one of them is currently written down as a dependency.

---

## 9 · Verdict

**ADVANCE, at 62% earned**, with one blocking condition.

It advances because the idea works where it matters and the work is honest: a running patch, a paired
HEAD column on one server reproducing the research's born-RED to the unit, both engines at seven
cells, two cures its own instruments found mid-pass, the desk kill-condition guarded rather than
asserted, the family's own idea biting back reported in full rather than buried, and the memorable
thing visible in a frame in both engines. I re-ran five of its numbers and five of its numbers came
back.

It is 62 and not more because: the destructive verb fails AA in the light theme, in the one mechanism
this pass was specifically told to deliver; 40.78px of the primary surface moves at the two commonest
phone cells with nothing declaring it; the card still scrolls below the priced cells with no minimum
stated; thirty-two estate rows across three suites are red and un-re-aimed; the seal-grade filter
constant was read off a dev server; the goldens were not run; and the roster's live regions stop
announcing when another tab is face up.

**The blocking condition:** the 4.20:1 must be cured before this family is scored again — and cured
without losing the marked/bare redundancy, whose non-colour half currently measures 1.19:1. If pass 2
finds that the confirm cannot be both AA-clean and redundantly marked inside the floor's row, that is
a constraint the idea cannot pay and the verdict becomes RETIRE. I do not expect that: dropping the
8% face restores 4.99:1 on its own, and raising `--type-verb` for the guard alone buys the rest.
