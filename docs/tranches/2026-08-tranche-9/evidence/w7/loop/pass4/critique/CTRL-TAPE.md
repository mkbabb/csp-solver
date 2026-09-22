# T9-W7 · pass 4 · CRITIQUE · CTRL-TAPE — the taped case

Adversarial, non-author. Everything marked MEASURED was run by me against the work tree
`.claude/worktrees/wf_f72f3b5a-83a-27`, served three ways and killed by recorded PID:

| server | port | what | verified by |
|---|---|---|---|
| prototype, dev | **4243** | my own two-line scratch config, private `cacheDir` `.vite-cache-critic-tape` | vite banner + 200 |
| HEAD control, preview | **4244** | the shared read-only `.claude/worktrees/w7-control` at `74a2b5d9`, its own `.vite-control.config.ts` | **asset hash `index-CubiZsMVSwTc.js`** |
| prototype, built dist | **4245** | the lane's own dist, untouched (only `e2e/viewport-law.spec.ts` is newer than it) | **asset hash `index-3gxpxZJXYNsI.js`** |

Never edited, built or `git`-touched the control tree. 4239/4240/4241 were a sibling lane's and
were left alone. Every π row names `74a2b5d9`.

**Convergence: 78%.** Verdict **ADVANCE.** Pass 3 wrote and did not run; pass 4 ran, and I
re-ran it. Every number in the lane's return that I re-took came back to the hundredth. What
holds the number down is one row the lane never ran at all: **the estate's own W2 §2.5 — "no
washi tape covers any part of an interactive element", the exact class law this family's whole
pin-band design is built to close — is RED on this tree in BOTH engines, on the dev server AND
on the built dist, against a control that is GREEN.** The return does not mention it.

---

## 0 · What I re-ran, and what it said

| row | who | result |
|---|---|---|
| **THE SEAL**, 1280×800 `hasTouch+isMobile`, regime witnessed `{coarse,row,rail}` | **me**, my own instrument, both engines | **1303.44 chromium / 1303.31 webkit** — the lane's number to the hundredth |
| **THE CROSSING** against the declared line (painted bbox top of the well's own `<path>`) | **me**, both engines | `new game` **−4.22**/38.64 · `pencils` +0.81/31.52 · `checking` +7.36/26.08 · `players` +12.19/21.23; container over-report +5.04/+0.56/−5.44/−10.28. Identical, and **the first well's tape does not straddle** |
| the seal e2e row at the restamped `SEAL = 1306.0` | **me**, both engines | **PASS**, and its negative control still breaks the seal by >30px |
| `zone-grammar` whole file | **me**, both engines | **26 passed** (13 + 13). Every new row green WITH its in-run negative control |
| `viewport-law` whole file | **me**, both engines | **26 passed, 6 FAILED** — §2.6 ×2 cells ×2 engines (declared, §2) and **§2.5 ×2 engines (UNDECLARED, §1)** |
| the same two rows against the **control** `74a2b5d9` dist | **me**, both engines | **6/6 PASS** |
| the same two rows against the **prototype's built dist** | **me**, both engines | **6/6 FAIL** — not a dev-mode artifact |
| **filter census on the BUILT dist** | **me**, `PLAYWRIGHT_BASE_URL=:4245`, both engines | **12/12 PASS** — the exact-match against `filterBudget.ts` (9) holds |
| **goldens on the BUILT dist** | **me** | **4/4 PASS**, no move, no re-mint |
| **π from computed PAINT, PROD vs PROD** (the lane compared dev vs preview) | **me**, both engines, 1440×900 + 390×844 `hasTouch` | deck tape `new game` **65.39×19.63 @14.384px lh 21.576px ls 0.3596px** and axis label **48×19.69 @16.4px weight 800** byte-identical proto-dist vs control-dist. **π holds, on a cleaner control than the lane's** |
| §2.6's red: latency or pose? | **me**, both engines | **latency.** SYNC `{position: static, released, tagVisible 0}`; SETTLED +600 ms `{sticky, not released, tagVisible 1}`, well 0.856 in view. The lane's diagnosis reproduces |
| gates bare (exit unpiped) | **me** | copy-register **0** (0 admitted, lexicon 25, 138 files) · ink-pressure **0** · sleep-lint **0** (34 specs / 43 sites / 2 `sleep-ok`) · theme-tokens **0** · theme-selectors **0** · motion-contract **0** · lane-membership **0** · live-regions **0** · empty-catch **0** · font-coverage **0** · prettier **0**. **Every one of these ran its `--self-test` and the plant went RED as required** |
| `vitest src/games/shared src/pencil/sheet` | **me** | **35 files / 436 tests, all passed** |

---

## 1 · THE ONE RED THE RETURN DOES NOT CONTAIN

### 1.1 W2 §2.5 is red on this tree, both engines, dev and dist — control green

```
[W2-§2.5] 1440×900 overlaps=[
  {"tape":"pencils","own":false,"target":"Clear the board","frac":0.188,"px":486.7},
  {"tape":"pencils","own":false,"target":"Fill in every cell that has only one possible number","frac":0.135,"px":349.3}]
✘ viewport-law.spec.ts:396 §2.5 no washi tape covers any part of an interactive element   [chromium]
✘ same                                                                                     [webkit]  (488.3 / 351.0)
```

Same six-row verdict on the **built dist** (`index-3gxpxZJXYNsI.js`). The same two rows on the
**control** (`index-CubiZsMVSwTc.js`, `74a2b5d9`) read `overlaps=[]` and **pass in both engines**.
So this is the design's, and §2.5's settled census (poll-to-rest, two clear readings) is not a
flake: it forgives an overlap that stops being one and this one never stops.

**The mechanism, measured.** At rest the `pencils` tape's visible height inside the card's
scrollport is **0.00** (`tapeVisibleH 0.00 / tapeH 32.32`) and `elementFromPoint` at the overlap's
centre returns `SPAN.icon-sublabel` / `BUTTON.icon-btn` — **not the tape**. It is an UNCLIPPED-RECT
reading: the design moved `.action-bar` to `#card-foot`, *outside* the scrollport, so the rect of a
tape that has scrolled out of the port now reaches down into the foot's verbs, and §2.5 clips
nothing to the port.

That is the identical artifact this lane **proved and cured for I2 in this same pass** ("a well
scrolled out of view whose rect still reaches into the foot"; `pencils` unclipped 0.312 → clipped
**0.000**). The lane wrote a PROPOSED diff for r0's copy of the predicate and never asked whether
the estate's own row had the same subject. It does.

**This is a gap however the chair rules it.** If the row's predicate is right, the design covers a
control and the section's headline claim is false. If the predicate is wrong — which the numbers
say — then the tree ships a W2 row RED in both engines and the lane owed a third PROPOSED diff and
a row reported MOVED. Neither was done, and the return's silence is the defect: a family whose
section spec says *"§2.5 closes in closed form"* ran §2.5**b** (its own new row) and not §2.5.

### 1.2 And §2.5b cannot see what §2.5 is asking about

`PIN_CENSUS` subtracts the pin band from every overlap, unconditionally:

```ts
const liveTop = cb.top + card.clientTop + padTop;              // ALWAYS
const h = Math.max(0, Math.min(b.bottom, t.bottom) - Math.max(b.top, t.top, liveTop));
if (w * h <= 0.5) continue;                                     // → hitIsTarget never computed
```

§2.5's own `liveTop` is conditional — it applies **only while `data-fold-above` is set**, which is
the chair's ruling ("a reserved band is paper by construction"). §2.5b applies it at every offset
and to every tape, pinned or not. The consequence is exact: a pinned tape lives *inside* the band
by construction, so its overlap is zeroed before the row's advertised **sign bit** (`hitIsTarget`,
"whether the covered pixel still belongs to the control") is ever taken. Measured at rail
1440×900, frac 0.25, with the SHIPPED band:

| | tape | target | px² chromium / webkit | `elementFromPoint` |
|---|---|---|---|---|
| my census | `new game` (sticky, fully visible) | `9×9` | **2197.1 / 2196.8** | **the tape itself** (`H2.washi-label washi-tag`) |
| my census | `new game` | `16×16` | 749.6 / 749.2 | the tape itself |
| my census, frac 1 | `pencils` (sticky, visible) | `Corner` | **2316.5 / 2238.9** | the tape itself |
| **§2.5b's own print** | — | — | **`overlaps: []`** | never reached |

In fairness to the design: at frac 0.25 the `9×9` chip's own top (165.1) is **above the card's clip
line** (174.6) and `data-fold-above` is set, so the chip there is card chrome and not a pressable
control — the chair's ruling covers it. But that is exactly why the row's green is arithmetic and
not a census: **it prints `[]` at every offset because the band is subtracted, not because nothing
is covered**, and its born-RED fires only because ablating the band to 20px moves `liveTop`. The
row proves the subtraction is live. It does not prove the law.

The closable cure is one line and the lane already owns both halves: apply §2.5's own
`data-fold-above` condition to §2.5b's `liveTop`, and clip both censuses to the scrollport.

---

## 2 · What the lane declared and I confirmed

- **§2.6 is red and the red is latency, and I reproduce it independently.** `STICKY_CENSUS` writes
  `scrollTop` and reads `getComputedStyle` in one synchronous task; the pose is an
  IntersectionObserver's. My read at the same offset: SYNC `{static, data-released, tagVisible 0}`,
  SETTLED +600 ms `{sticky, not released, tagVisible 1}`, well **0.856** in view, chromium and
  webkit identical. The pose is right; the read is a frame early. The row is the chair's, and the
  lane's PROPOSED diff touches the assertion, the thresholds and the 40 px offset not at all.
- **The publisher is dead and landed.** `--card-pad-t` computes to **`""`** on the card (I read it):
  the `setProperty`, the `@property` registration and the five reader sites are gone, and
  `--pin-band` computes 43.8656 px / 43.865601 px (chromium / webkit) from the derived calc alone.
  COST's centre folds as a graft, with a number on this tree.
- **π holds on a stronger control than the lane's.** The lane compared a DEV server to a preview
  build — two different CSS pipelines, one of which emits the down-level `:root, :host` twin the
  lane's own §1.2 finding turns on. I re-took it prod-vs-prod and the deck tape and the axis labels
  are identical in size, family, weight, **line-height**, colour and letter-spacing at both cells in
  both engines. The estate-wide leading leak is genuinely gone.
- **The gates are real.** Eleven node gates bare at 0 **and** each `--self-test` plant went RED in
  the same run. The four new e2e rows each carry an in-run negative control and each one fired
  (§2.5b's ablation puts `new game` on `16×16` at 2449.2 px² and `pencils` on `Corner` at 1798.7).
- **The build's two guards are paid**: 12/12 filter census and 4/4 goldens on the built dist, run
  by me, no move.
- **The moves in the two gate SCRIPTS are declared moves, not re-wordings.** `check-ink-pressure`'s
  closure 3 keeps its floor, its banned raw wax and its assertion and only follows the subject;
  `check-font-coverage`'s `.section-heading` row changes face because the card changed face, and the
  lowercase corpus is backed by a real source change (five `spec.ts` files author `size`/`level`),
  which the comment declares as a COPY ruling for U-10 rather than hiding. My π read confirms the
  rendered gallery word was already `size` at `74a2b5d9` — the casing moved in the source, not on
  the deck.

---

## 3 · The findings the lane did not report

### 3.1 The seal's new stamp carries 2.56 px of unearned room, and the return calls it "engine slack"

Measured 1303.44 / 1303.31; stamped **1306.0**. The two engines differ by **0.13**. The row's own
precedent, on the base this diff starts from, is `SEAL = 1227.5` against a head of **1227.09** —
**0.41** of room. The new stamp is **six times looser** than the number it replaces and **twenty
times** the engine spread it is named for. A drift bound with 2.56 px of slack is 2.56 px of drift
nobody will see. State the rule (engine spread × N, or the measured max + a named margin) or stamp
1303.6.

### 3.2 The seal's shipped comment claims a cause its own table refutes — the pass-3 §3.4 class, third occurrence

The comment prices the +19.9 as W2 §2.5's closed form: *"the pin band is `0.6rem + tapeH` … Both
terms are in the two −113 rows above."* The same table books **the pin band at 0.00 / 0.00**. I
measured why: the row's quantity is `.control-panel-wrap`'s height, which is **inside** the card's
padding — ablating `padding-top` to 20px moves `panelH` by **0.00** and `cardH` by **0.00** in both
engines. The pin band is not in the sealed number at all and cannot be. The pass-3 critic booked
"a comment in shipped source is a claim, and a claim whose own reading sits in this lane's
`readings/` must match it" as a class on its second occurrence. This is the third.

### 3.3 The heading lock was weakened in the moving (`zone-grammar.spec.ts:895`)

```ts
expect(headings.every((h) => h.inButton)).toBe(false);
```

The comment says *"the heading is the button's SIBLING now, so the ink is not inside a control"*.
The assertion says "not all eight are inside a button": **seven of eight inside a button still
passes.** The sentence the comment states is `expect(headings.some((h) => h.inButton)).toBe(false)`.
The old row pinned a shape with `.every(...) === true`; its replacement pins almost nothing.

### 3.4 "The bar never covers a control" is card-scoped — 48,613 px² of buried controls are invisible to it

`BAR_IN_FRAME`'s `covers` iterates `card.querySelectorAll(...)` clipped to the card's scrollport.
I laid `.action-bar` over the board (`position: fixed; left: 0; top: 30%; width: 40vw; height:
180px`) and read both terms in the same task:

| | the row's `covers` | interactive area buried OUTSIDE the card |
|---|---|---|
| chromium | **0.00** | **48,613 px²** |
| webkit | **0.00** | **52,065.7 px²** |

The row passes. Its negative control only fires because `top: 40%` happens to land the bar on the
card. T9-M04 term 2 is about a floating bar over the play surface; the row cannot see that case.
One line: take the census over `document`, minus the bar's own subtree.

### 3.5 The `@property` discriminator reads the INHERITED value, not the initial — and says otherwise

`zone-grammar.spec.ts:536` writes `zzz-not-a-length` to `--pin-band` on the card and asserts
`"0px"`, with the comment *"a registered `<length>` rejects an invalid value at computed-value time
and falls back to **its initial**"*. For `inherits: true` the fallback is the **inherited** value.
Measured, both engines:

| state | computed `--pin-band` on the card |
|---|---|
| live | 43.8656 px |
| invalid, no ancestor declaration | **0px** |
| invalid, with `:root { --pin-band: 7px }` | **7px** |

The row still discriminates registered from unregistered (an unregistered name keeps its token
text — its negative control proves that, and I re-ran it). But the green is a coincidence of the
ancestor chain, and the build's own down-level `:root, :host` twin — the very block §1.2 of the
lane's README turns on — declares these names at the root. Assert `parseFloat(after) === 0` with
the ancestor stated, or read the initial where nothing above declares it, and fix the sentence.

### 3.6 Method: the π control was a preview build and the prototype a dev server

The lane's π rows compare `vite dev` (`:4230`) against `vite preview` on a dist (`:4231`). Those
are two CSS pipelines: only one of them emits the down-level twin, and only one of them minifies.
The conclusion survives — I re-ran it dist-vs-dist and it is identical — but the banked evidence
compares arms that differ by more than the commit. Re-point it or cite mine.

---

## 4 · Constraints, checked

| constraint | verdict |
|---|---|
| **M16 plain copy** | **PASS** — `check-copy-register` bare exit 0, 0 em dashes, **0 admitted**, 0 unadmitted, 138 files; the self-test's ghost admission goes RED. Run by me |
| **filterBudget 9 on a built dist** | **PASS** — 12/12, both engines, board + coarse + picker, run by me on `index-3gxpxZJXYNsI.js` |
| **goldens** | **PASS** — 4/4 on the same dist, run by me, no re-mint |
| **AA from PAINTED bytes** | **PARTIAL** — the lane painted the ring's band on ONE ground (the card), 4.289 light / 4.286 dark, both engines. The charter asked four grounds. Not re-run by me; declared as the lane's gap 3 and it stands |
| **π on unclaimed surfaces vs `74a2b5d9`** | **PASS**, re-measured by me prod-vs-prod from computed paint (§0). The gallery's `<h2>` population moves 2 → 8 as a DOM fact; the aria heading roster is 1 on both trees, so the surface the wave does not claim is unmoved to a reader |
| **W2's landed mechanics** | **QUESTIONED** — the sticky tag's row (§2.6) is RED at both cells in both engines (latency, confirmed) and §2.5 is RED in both engines (§1.1). The dock, the bottom tab and the 44 px floor all pass |
| **the decided history (r0/R6, chair §1.3)** | **PASS** — no `r0/` path written by either of us; three PROPOSED diffs under `instruments/`; the one gate landed (`check-ink-pressure` closure 3) is reported MOVED with its self-test green |
| **the @property law's four clauses** | **PASS on three, AMBER on the third** — registration in the static sheet, `inherits: true`, negative control on a DECLARING host. The `initial-value: 0px` is computationally independent but **0px is not a visible failure** the way §6.5's third clause asks; and the discriminator's mechanism is mis-stated (§3.5) |
| **the undefined-token census** | **PASS for this section** — the six `--motion-*` registrations are struck with the reason written; my own referenced-but-undeclared sweep over `src/` turns up nothing this diff introduced (`--card-foot-h`, `--card-pad-x`, `--card-pad-b`, `--masthead-foot`, `--case-offset` are all registered in the §6.5 block; the residue is pre-existing estate names) |
| **the dock sheet SLIDES** | **PASS** — §2.5b's dock arm polls the sheet's own settled top (two 80 ms samples, ≤5 s) instead of sleeping; `check-sleep-lint` bare 0 after |
| **the record is frozen** | **PASS** — nothing under `r0/`, `pass1/`, `pass2/`, `pass3/` touched by either of us |
| **evidence cap / crops** | **PASS** — four crops, 50 KB total, each naming the pass-3 crop it retires. c3 now shows its claim (the pinned tape in the band with the first chip beneath it); c4 shows the §14 mechanic |

---

## 5 · The checklist

- **gates that cannot fail** — **HIT, twice.** §2.5b's `overlaps` is zeroed by an unconditional band
  subtraction before its own sign bit is taken (§1.2); the moved-bar row's `covers` cannot see a bar
  over anything but the card (§3.4).
- **the constraint it forgot** — **HIT.** W2 §2.5, the section's own class law, never run (§1.1).
- **the elegant-reduction trap** — **HIT, narrowly.** "`--pin-band` closes §2.5 in closed form" is
  true of the top edge and silent about the bottom one, where the moved foot now lives; the estate
  row that reads the whole card is the one that reds.
- **spec-cites-itself circularity** — **HIT.** The seal comment's causal sentence is refuted by its
  own ablation row and by the geometry of the quantity it measures (§3.2).
- **masked fallbacks** — **NOT HIT, and cured**: the `styleSheets` walk's `catch` is now a refused-
  sheet count asserted at 0, and I watched the row go green with its planted reader.
- **unverified gestalt** — **PARTIAL.** c1/c2/c3/c4 each show their claim on the real surface in the
  named engine and pointer class. The STRIKE arm of the quick-set ballot is measured and unframed
  (declared), and the fresh-reader protocol is unrun (declared).
- **the pixel it moves that it did not declare** — **NOT HIT this pass**: the quick set is now
  declared and priced (+158.3 px of flank, +1266.4 px² of board overlap). It remains a mechanic the
  spec does not name, which is the chair's row, not a hidden one.
- **legacy aliases / consumer-less substrate** — **NOT HIT, actively cured**: `--card-pad-t` deleted
  with its readers re-pointed, six publisher-less registrations struck, `--ring-ink` one declaration
  consumed bare.
- **the generic default** — **NOT HIT.** Patrick Hand at 25.888 on washi, rank by placement, no
  eyebrow caps, no identical cards, no arrows.

---

## 6 · For the adjudicator, in order

1. **Run §2.5, then rule on its predicate** (§1.1). Six red estate rows on this tree, two of them
   undeclared. The cure is the clip the lane already wrote for I2, as a third PROPOSED diff plus a
   row reported MOVED — or the design owes a foot that a scrolled-out tape's rect cannot reach.
2. **§2.5b's band subtraction** (§1.2) — make it conditional on `data-fold-above` like §2.5's, or
   the section's flagship row keeps printing `[]` by arithmetic.
3. **§2.6** — the chair's row; the latency diagnosis reproduces independently and the proposal
   touches nothing but the moment of the read.
4. **Three one-line gate repairs**: the heading lock's `.every` → `.some` (§3.3), the bar census's
   scope (§3.4), the `@property` discriminator's assertion and sentence (§3.5).
5. **The stamp** (§3.1) — 2.56 px of room wants a stated rule or a tighter number.
6. The open fork rows go up as the lane wrote them: T9-B8's MOVE arm is built, framed and paying
   §6.1's inset condition; the FACE/TAPE fork is answered by a number (the printed rung is a
   ceiling with 1.20 px of band left); the COST merge watch is landed, not asserted; the quick set
   and the red word are the owner's.
