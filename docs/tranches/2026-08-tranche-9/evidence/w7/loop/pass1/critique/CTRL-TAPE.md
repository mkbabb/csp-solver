# T9-W7 pass 1 · CRITIQUE · CTRL-TAPE — the taped case

Adversarial lane. I did not write the spec or the prototype. Every figure below is one I took
myself, on my own server (`127.0.0.1:4248 --strictPort`, the worktree
`.claude/worktrees/wf_e58b4764-0fc-37`, scratch Playwright config, no `webServer`, chromium and
webkit). Nothing here closes (U-10).

**CONVERGENCE: 72.** Earned, not given. The build is real and most of it survives an adversarial
re-measurement — including the one test I expected to break it. It is not higher because a
STANDING W2 LAW IS RED IN BOTH ENGINES under this patch and green at HEAD, the decided-history
census exits 1, and three shipped source comments state the opposite of the lane's own readings.

**VERDICT: ADVANCE.**

---

## A · WHAT I RE-MEASURED, AND WHAT HELD

| claim | my reading | verdict |
|---|---|---|
| R1 ROW 1 · one voice tuple | `Patrick Hand · 25.89 · 500 · lowercase`, ONE tuple at desk-1280×800, dock-390×844, land-900×500 | HOLDS |
| R1 ROW 2 · 8/8 document headings | 8/8 in the DOM **and 8/8 in the REAL a11y tree** — see §B | HOLDS, and stronger than claimed |
| R1 ROW 3 · name ÷ option ≥ 1.23 | **1.2945** at all three cells — re-derived with `Math.min` over the eight names, not the instrument's `Math.max` | HOLDS |
| first tape inside the dock card ≥ 8px | **8.23 / 8.23** (chromium / webkit) | HOLDS |
| `url()` filter population unmoved | **24 / 24** both engines; R6 L1 static budget sums to **9** | HOLDS |
| bar sticky in the landscape scrollport | `position: sticky` at **844×390 AND 900×500**, both engines (the lane reported 900×500 only) | HOLDS, widened |
| quick set reachable, floor held | three acts **44 × 52.77**, all `pressable: true`, tongue still `pressable: true`, strip tucks **8.00px** under the board's right edge — the shipped tongue's own tuck — free right edge 199 / 240px | HOLDS |
| `--masthead-foot` is stale | published **221.73** against a wordmark foot of **214.73** (chromium); **221.42 / 215.02** (webkit) | the lane's gap 2 CONFIRMED |
| the card's height at 390 | `clientHeight` **590 / 591** | CONFIRMED |
| `check-copy-register` · `check-font-coverage` | both exit **0**; 0 unadmitted, the `candidates` admission struck | HOLDS |
| `vue-tsc -b` · unit battery | **exit 0** · **66 test FILES / 811 tests passed**, exit 0 (read at the file line, per the standing trap) | HOLDS |
| R6 L4 washi neutral · L5 one box grammar | **GREEN · GREEN** (the two guards the lane's own table omitted) | HOLDS |

**And I ran part of the estate the lane declared unrun.** `board-covisibility.spec.ts` **8/8
GREEN** under the build — the tongue gained a `display: contents` parent and its whole
attachment lock still holds. `filter-census.spec.ts`, `masthead-alignment.spec.ts` and
`access.spec.ts` are **GREEN** in the same run (31 passed of 32). That converts most of the
lane's gap 6 from an argument into a fact, and it makes the one failure below mean what it says.

---

## B · THE SHARPEST TEST I COULD PUT TO IT, AND IT PASSED

ROW 2 is asserted by `el.closest("h1..h6")` — a DOM ancestor walk. Four of the eight names reach
their `<h2>` through a `display: contents` host (`.tape-host`, `.mobile-heading-wrap`), and
`display: contents` is the one construct that has historically dropped an element out of the
ACCESSIBILITY tree while leaving it in the DOM. "A reader walking by heading finds eight of
eight" is a claim about the a11y tree, so I read the a11y tree.

    chromium · CDP Accessibility.getFullAXTree, unignored nodes:
      new game [lvl 2] · size [lvl 2] · level Easy [lvl 2] · pencils [lvl 2]
      checking [lvl 2] · players [lvl 2] · marks [lvl 2] · what fits [lvl 2]
    webkit · ariaSnapshot: the same eight, every one [level=2]

Eight of eight, both engines, in the engine's own computation. The `display: contents` hosts do
not drop. ROW 2 is not vacuous. (Instrument banked at `critique/CTRL-TAPE-probe/axtree.mjs`.)

One thing the tree shows that the design does not say: the `level` heading is named
**"level Easy"** — the value word rides inside the `<h2>`. It reads the same at HEAD, so it is
not this family's regression, but "eight names, one tuple" is contradicted by a ninth word in a
spoken name, and W3 has just landed the law that the tree agrees with the visible truth.

---

## C · THE RED THE LANE DID NOT FIND

**`viewport-law.spec.ts` §2.5 — "no washi tape covers any part of an interactive element" —
FAILS at 1440×900 in BOTH ENGINES.**

    UNDER THE BUILD   chromium  [{"tape":"checking","target":"Off","frac":0.212,"px":1074.8},
                                 {"tape":"players","target":"Live","frac":0.090,"px":940.8}]
                      webkit    [{"tape":"checking","target":"Off","frac":0.212,"px":1075.2},
                                 {"tape":"players","target":"Live","frac":0.090,"px":941.5}]
    AT HEAD           overlaps = []    (I swapped :4248 to the main tree and ran the same test)

This is a W2 LANDED MECHANIC, green at HEAD, red under this patch, in both engines, at the
desk — not a phone edge case. And the family already diagnosed the disease: a tape's net flow
height is ZERO, so at 25.888px it lies over whatever is under it. §C·3 of the prototype's own
README finds exactly this for the FIRST well (`new game` 19.07px on top of `size`/`level`) and
cures it with `.tray-well:first-child { margin-top: 2rem }` — a cure aimed at ONE well, found by
a crop, while the same disease sat on the `checking` and `players` wells with an estate gate
already written to catch it. The cure shape is known; what is missing is that the instrument was
never run. That is the elegant-reduction trap in its exact form: the hard part was named, priced
at one well, and the other three were assumed.

---

## D · THE DECIDED HISTORY STILL READS THE MARK UNCURED

I ran the r0 R6 law probe against the build. **It exits 1**, where HEAD exits 0.

- **L3 BROKEN** (`GREEN → RED`). The row is pinned to `admitted === 2` in
  `check-copy-register.mjs`. The build rightly strikes the `candidates` admission, leaving 1, and
  the probe reds — while `check-copy-register` itself exits 0 with zero unadmitted. The LAW holds;
  its instrument does not. A cure that reds the census that gates it has not landed with its
  enforcing config in the same commit, which is the T2–T4 rule by name.
- **R3 STILL RED** — *"the mobile floating controls bar wears a drawn edge in the house hand"*,
  detail `no border, no drawn outline — background + fade only`. The row greps the
  `.action-bar { … }` CSS block for `border|HandDrawnOutline`; the build puts the frame in the
  TEMPLATE as a sibling `<HandDrawnOutline class="bar-frame">` and styles `.bar-frame`. So the
  wave's own decided-history census carries M04 term 1 as UNCURED while the family reports it
  GREEN off its own instrument (R7 I2). Two instruments, one mark, opposite readings, and the
  disagreement is unremarked.

---

## E · THREE COMMENTS THAT SAY THE OPPOSITE OF THE LANE'S OWN NUMBERS

The prototype's README declares each of these as a delta or a gap. The SHIPPED SOURCE does not,
and the source is what the next hand reads.

1. `SheetWashiLabel.vue`, `.washi-tag[data-released]`: *"published by one `IntersectionObserver`
   at threshold 0.5 per well (`GameControlPanel`)"*. There is no IntersectionObserver in the
   tree; `publishFold` publishes it (README C·5 says so).
2. `SheetWashiLabel.vue`, the leading: 1.2 *"buys … the ~7px of top clearance the dock card's
   first tape needs"*. README C·3 ablated that lever and measured it **INERT** (1.04 → 1.04);
   `--washi-tag-top` is what bought the margin. The comment sells the refuted cause.
3. `App.vue`: *"The observer is the wordmark's OWN box (`logoMenu.$el` …), never the `<h1>`'s."*
   The code is `useResizeObserver(mastheadEl, …)` — it observes the `<h1>` and measures the
   wordmark, which is precisely why the published foot is ~7px stale (I measured 221.73 / 214.73).
   The comment asserts the cure for the gap the README admits is open.

---

## F · FAILURE-MODE CHECKLIST

| item | reading |
|---|---|
| vacuous convergence | **clear** — I tried to break ROW 2 on the a11y tree and could not; ROW 3 survives a `min` re-derivation |
| spec-cites-itself | **clear** — the 1.23 floor is the desk's shipped ratio less 5%, the 2500ms window is the incumbent's |
| gates that cannot fail | **HIT (minor)** — `@media (min-width: 1024px), (max-width: 1023.98px)` is a union matching every width; the spec asked for a landscape arm and the build deleted the distinction while keeping a comment that still describes it |
| elegant-reduction trap | **HIT (hard)** — §C. The tape-over-control disease was named, priced at one well, and the other three were assumed |
| legacy aliases | **HIT (minor)** — `--type-group-title` survives pointing at `--type-name` and is still the only consumer at `typography.css:380`. The old name under the new name. R1 ROW 1 would red on a re-point, so it is a tidiness row, not a hole |
| masked fallbacks | **HIT** — `--sheet-chrome: max(12rem, calc(var(--masthead-foot, 0px) + 8px))`. If the publisher never fires, the seam silently returns the 12rem constant the mark says had gone NEGATIVE at 390. `wordmarkEl()` also falls back to `mastheadEl`. Nothing gates either |
| unverified gestalt | **HIT** — the 390 seam, the mark's headline visual, has NO frame. The table cites `p1-dock390-dark-*` for "the wordmark clear of the case stroke"; that crop begins below the masthead and contains no wordmark. `p3` shows the bar's frame as a single top rule, which cannot show a fifth compartment |
| consumer-less substrate | **clear** — `--type-name` has consumers at both ranks; `MOTION.inkLiftMs` is declared a ledger row whose reader is the CSS, which is honest |
| the generic default | **clear** — this is the house's own hand, tape, tear and stroke ladder; nothing on frontend-design's tell list appears |
| the pixel it did not declare (pi) | **HIT** — §C is a pixel moved onto two controls' surfaces, undeclared. Everything else I could reach holds: board-covisibility 8/8, masthead-alignment green, `url()` census 24, card width unmoved |
| the constraint it forgot | **HIT** — W2 §2.5 (§C) and the R6 census (§D). AA is CLEAN: I recomputed `#D02A52` on `#FDFDFB` = **4.99:1** and `#FF5C7C` on `#131211` = **6.30:1** from first principles, and `#737373` = **4.66:1**; the 0.68 lifted word composites to ≥5.4 both themes. filterBudget 9 static, 24 `url()` live, both unmoved. M16 exits 0 |

---

## G · STRENGTHS, PLAINLY

- **It is a source patch, not an overlay**, and it typechecks, unit-tests and serves in both
  engines. Everything I re-measured reproduced to the hundredth. That is rare in this loop.
- **The height is ITEMISED BY ABLATION, six terms, in the same commit as the seal's re-price.**
  This is the discipline the whole wave should copy.
- **Two refutations of its own spec, published rather than buried**: the leading is inert on the
  clip margin, and the bar's reserved flow height is a no-op a sticky box already has (+64.81px
  for 0.033 of burial, not spent). A lane that refutes its own author is worth more than one that
  greens cleanly.
- **`useTwoTap`** closes R7 I4 in SOURCE across four verbs with one window, and brings Deal and
  Clear's shipped 2500ms literals home to `MOTION.confirmWindowMs`.
- **The quick set refuses the spec's three new tongues** and teleports the shipped
  `.play-controls` row instead — M13's fence fired on a number (0 duplicated), not on taste.
- **The per-dimension negative control** (kill `min-width` → 12×44, kill `min-height` → 52.52×12)
  is the right shape for a tap-floor claim and I reproduced the floor at both cells.
- **Two traps worth the wave's ledger**: a scoped rule that starts at someone else's class is a
  dead rule (`:deep()` is load-bearing), and a Vue template comment beside the root node makes the
  component a fragment in dev.

---

## H · THE ONE QUESTION, STILL OPEN

Put `frames/p1-dock390-dark-chromium.png` in front of a fresh reader and ask which of the eight
names are groups. I looked at it and the second axis is thin: `pencils` straddles a drawn stroke
at x≈28 and `marks` lies flat at x≈40, and the tuple is otherwise identical by design. It needs a
reader, not another probe, and it is the owner's call at the re-look (U-10).

---

## I · HOUSEKEEPING

My instruments are removed from the worktree and the worktree is back to exactly the prototype's
17 modified files (`git status --porcelain` = those 17, nothing else). The `:4248` server is
released. Frames: I banked none — every figure above is a number or a cite.
