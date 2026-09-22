# PASS-4 CRITIQUE · MRK-LIVE · The live ring (§5/§6 leader)

Adversarial critic, non-author. I wrote neither the charter, the spec nor the prototype. Base and
π control `74a2b5d9`. I served the lane's work tree (`.claude/worktrees/wf_f72f3b5a-83a-35`) as a
dev server on `127.0.0.1:4246` with my own cacheDir, and the chair's shared control
(`.claude/worktrees/w7-control`) as `vite preview` of the PRE-BUILT dist on `127.0.0.1:4247`,
**verified by the chair's own asset hash `assets/index-CubiZsMVSwTc.js`**, not by a 200. Both
killed by recorded PID (95412 lane, 95657 control); five sibling listeners in 4230–4249 were left
alone. My probes, logs and censuses: `critique/MRK-LIVE/probe/`, `critique/MRK-LIVE/logs/`. Zero
crops banked by me. Nothing under `r0/`, `pass1/`, `pass2/`, `pass3/` was written; nothing was
committed, pushed, stashed, built or installed; the control tree was never edited or git-touched.

**Verdict: ADVANCE at 84%** — a point below pass 3's 86. The mechanism is better than it was and I
reproduced its centre on both engines. The record and the gates went the other way: the section's
most dangerous gate is vacuous for a second consecutive pass, the `@property` block this family
owns for the whole wave breaks chair §6.5's third clause, the one fallback the diff defends is dead
by its own cited proof, the pass's headline cure ships with no gate anywhere, and two cited
artifacts (crop 3 and the phone table) do not say what the surface says.

---

## 1 · What I re-ran myself (both engines, my servers, my probes)

| row | my reading | the family's |
|---|---|---|
| **the estate spec on the LANE** | `e2e/focus-ring.spec.ts` **10 passed / 0 failed**, exit 0, chromium and webkit (`logs/estate-spec-LANE-10of10-both-engines.log`) | 10/0 — **reproduced** |
| **the estate spec on the CONTROL** (`74a2b5d9`, pre-built dist, hash-verified) | **6 failed / 4 passed**, exit 1. Red: G-LIVE-4, G-LIVE-14, G-LIVE-19 in BOTH engines (`logs/estate-spec-CONTROL-*.log`) | 6/4, same three — **reproduced exactly** |
| **`--ring-ink` consumed bare, ablated** | declared **exactly once**, at `:root, :host`, value `var(--color-focus-sketch)`; removed → `stroke` computes **`none`**, both engines; before `rgb(58,123,196)` (`logs/critic-probe2.json`) | same — **reproduced**. The consumer-less-substrate row is CLOSED |
| **π vs the chair's named control** | **20 nodes × 12 computed PAINT properties + tag names + rects, 0 paint deltas, maxRectDelta 0.00 px, both engines** — lane DEV against the PRE-BUILT DIST, which is a stronger arm than the family's dev-vs-dev (`logs/critic-pi.json`) | 17 × 11, 0 / 0.00 — **reproduced and widened**; the family's gap 10 is closed by this row |
| **the rank, live paint** | tier 2 `0.95`, tier 1 `0.65`, both engines | same — **reproduced** |
| **the mouse landing** | `.sun-moon-toggle`, real `mouse.down/up`: chromium focus on the button, webkit on `body`; `fv=false`, **0 rings**, both engines | same — **reproduced** |
| **vitest** | **69 files / 835 tests, exit 0** (`logs/vitest-69-835.log`) | 69/835 — **reproduced** |
| **M16 / lints, bare** | `lint:copy` exit 0, 0 em/en dashes, **0 unadmitted**, 0 admitted, lexicon 25; `lint:motion` exit 0, **35 specs / 35 declaring / 0 silent**; `lint:knip` exit 0 (`logs/lints-*.log`) | same — **reproduced** |
| **the teacher-red strike** | 0 `--color-teacher-red` fallbacks remain in `gameCell.css`; the only two `var(x, y)` left are the peer-cursor pair at `:302/:304` | 0 remain — **reproduced** (and see §2.3) |
| **filterBudget** | NOT re-measured by either of us. I verified statically that the 63-line delta adds no `filter`, no element and no SVG node; that is an argument, not a census | unre-measured — **agreed, still open** |

---

## 2 · What I found that the family did not

### 2.1 G-LIVE-16 CANNOT FAIL, and it is the gate guarding the most dangerous thing here

I ran the gate's own walk, instrumented, with one addition: an injected
`<button class="critic-stranded" style="outline:none!important">` carrying no ring, no board ink
and no outline. Both engines, `logs/critic-probe.json`:

```
sampled 16   judged 13   bad []        ← the gate's verdict: everybody indicated
stranded row: took=true  fv=true  drawn=false  boardInk=false  outline=TRUE   ← and it PASSED
```

Both of the gate's live clauses are dead, for two separate reasons:

- **`drawn` is `false` for all 16 stops, in both engines.** The walk focuses synchronously inside
  one `page.evaluate`; Vue never flushes, so `document.querySelectorAll(".focus-ring").length` is
  0 for the whole loop. The same page, focused once and awaited, reads **1**. The drawn-ring
  clause has never been exercised by this gate on any stop.
- **`outline` is `true` for all 16 stops, in both engines.** The gate reads
  `parseFloat(getComputedStyle(e).outlineWidth) > 0`. Measured (`logs/critic-probe2.json`):
  `.drawer-tab`, `.logo-trigger`, `.ctrl-btn` and my stranded button all compute
  `outline-width: 3px` with `outline-style: none`. `outline: none` resets the STYLE and leaves
  the WIDTH at its initial `medium`, so the clause that is supposed to catch an unindicated stop
  is true of every element in the estate, including every one this design deliberately stripped.

So `bad` is `[]` by construction. The gate greens on a focusable that matches `:focus-visible` and
has no indicator of any kind. Registry §2.10 struck G-LIVE-16 in pass 3 (the four webkit `0 == 0`
rows); a struck gate counts only if re-cut, and **the re-cut is vacuous in a new way**. That makes
five estate rows into four, three of them born-RED, and it leaves the family's own sentence —
*"suppressing the UA outline is the most dangerous thing this design does, so the walk is the
tripwire"* — carried by the pass-3 critic's 12-stop census and by nothing in CI.

The design is almost certainly fine; the pass-3 census says so and my `ringAfterAwaitedFocus = 1`
is consistent with it. It is the GATE that is broken, and it is broken in exactly the shape the
lane's own return says it caught elsewhere.

**The re-cut, if the chair wants it in one line:** await a flush after each `focus()` (or read the
ring through `document.querySelector('.focus-ring')` after `await page.waitForTimeout(0)` per stop,
outside the single `evaluate`), and judge the outline by `outlineStyle !== 'none' && width > 0`.
Then land the negative control the gate has never had: an injected stranded focusable must RED.

### 2.2 Chair §6.5 clause 3 is violated inside the `@property` block this family owns wave-wide

§6.7/§6.8 makes MRK-LIVE the one home for the registration block. Clause 3 of the four-clause law:
*the `initial-value` is computationally independent AND fails VISIBLY — an initial that re-creates
the fallback it struck is the defect (PLR-SELF's C4).* Measured on the two trees:

| | control `74a2b5d9` | lane |
|---|---|---|
| `DarkModeToggle.vue:742` | `calc(2px - var(--toggle-bleed, 0px))` | `calc(2px - var(--toggle-bleed))` |
| `:760`, `:918` | `inset: var(--toggle-bleed, 0px)` | `inset: var(--toggle-bleed)` |
| `index.css:477` | — | `@property --toggle-bleed { initial-value: 0px }` |

Three `, 0px` struck, and the registration restores **precisely 0px** as the value an absent
publisher computes to. The struck default did not die; it moved one level down and became
invisible. The publisher is `App.vue:967`; delete it and the toggle's ornament bleed silently goes
to zero with nothing failing, which is the masked fallback this diff strikes three of in the same
file. `--focus-ring-outset`'s `3px` initial raises the same question one notch more weakly (it is
the declared house default and the born-RED does fire for a non-declaring host), and I flag it for
the chair rather than call it.

And the gate over it tests neither half of its own title. `G-LIVE-19 · the outset seam has one home
and no masked default`:
- **"one home" is never counted.** The loop writes `found[n] = r.cssText` and overwrites, so a
  second registration of the same name is invisible to it.
- **"no masked default" is never scanned for.** Nothing in the gate looks at a `var(x, fallback)`
  anywhere.
- The px assertion is wrapped in `if (reg.toggleOutset)`, so a missing toggle skips it silently.

It is born-RED on the control for existence only. That half is real; the title's other two thirds
are assertions the body does not make.

### 2.3 The one fallback the diff defends is dead by its own cited proof

The new six-line head note in `gameCell.css` names one deliberate exception:

> `--color-peer-cursor-ink` KEEPS its fallback … it is declared per cell, inline, by
> `BoardHost.vue:78`, so a cell with no peer on it has no declaration at all and
> `--color-user-ink` is the value that actually paints.

The two surviving `var(--color-peer-cursor-ink, var(--color-user-ink))` sit at `gameCell.css:302`
and `:304`, under the selector `.game-cell.is-peer-cursor .cell-ghost-path`. On the same tree:

```
BoardHost.vue:78    out[String(pos)] = { "--color-peer-cursor-ink": ink }
BoardHost.vue:313   :style="{ …authorInk[pos], …peerCursorInk[pos] }"
BoardHost.vue:315   :is-peer-cursor="String(pos) in peerCursorInk"
DigitCell.vue:223   'is-peer-cursor': isPeerCursor      (on the .game-cell root, beside :style)
```

The class and the inline declaration are gated by the **same predicate on the same key**. The rule
matches if and only if the declaration exists, so "a cell with no peer on it" is a state in which
this rule never applies and the fallback can never be reached. The proof does not stop where the
note says it stops. Either strike the pair (no pixel moves) or re-word the note to the true
exception, which is about `DigitCell`'s own binding order rather than about peerless cells.

Same file, same class, not the lane's row but worth the chair's sweep: `index.css:802`
`animation-delay: var(--reveal-delay, 0ms)` and `:846` `var(--draw-dur, 160ms)` are HEAD's, in the
file this diff edits, and `--reveal-delay` is bound by `DigitCell.vue:201` under the identical
`revealArmed` predicate that adds `.cell-reveal-animated`.

### 2.4 The pass's headline cure has no gate anywhere

The 9-line departure check in `measure()` is the centre of this return. `e2e/focus-ring.spec.ts`
contains no `hasTouch`, no phone viewport, no coarse regime and no row that reds without the check.
Nothing in the estate, in `vitest`, or in a banked repeatable probe fails if those nine lines are
deleted. The wave's own rule is that a born-RED row is demonstrated on THIS tree with its negative
control in the same run; the cure has a README table instead.

### 2.5 The phone table does not reproduce at settle, and its stated finding is contradicted

Witnessed coarse regime, both engines: `hasTouch: true`, `(pointer: coarse)` **true**,
`(hover: none)` **true**, dpr 2, 393×699. Round 1 of my own probe made the family's round-A
mistake in a new place (I read the framing error against a hardcoded `.drawer-tab`); round 2 reads
it against the LIVE target the ring claims (`activeElement`, or its `aria-activedescendant`) and
names that element. `logs/critic-probe2.json`:

| instant | chromium | webkit |
|---|---|---|
| before the press | 1 ring on `button.drawer-tab`, outset 6.5, **err 0.00** | identical |
| t+120 ms | 0 rings, `activeElement` = `body` | identical |
| t+280 ms | 0 rings, `body` | identical |
| **settled (t+1.28 s)** | **1 ring on `button.mobile-heading-btn`, outset 3, err 0.00** | **identical** |
| after a mid-glide reversal | 1 ring on `button.mobile-heading-btn`, **err 0.00** | identical |

Two things follow. First, the README's *"post-cure both engines read 0 rings at every instant"* is
wrong at settle. Second, its explicit finding — *"`button.mobile-heading-btn` EXISTS at this
viewport but the estate does NOT move focus into the sheet"* — is contradicted in both engines:
the estate does move focus there, and the ring follows it at 0.00 px. The behaviour is BETTER than
claimed; the table is not what the surface does, and a leader's table is the thing other lanes
copy.

It also bounds the cure's reach. The check only runs when something calls `measure()` — an event,
the ResizeObserver, or a settle frame. A departure with no animation on the target's ancestor path
and no listener event is still unread, which is the residue of the very class the cure names.

### 2.6 A painted-contrast gate with no threshold-sensitivity row

LAWS §Gates: *a painted-contrast gate carries the threshold-sensitivity row (worst column at
50/70/90/100 % of median ink mass + fraction of columns under the floor).* The return gives one
worst column (3.571) and the recipe, and no sensitivity row at all. The numbers may well be right
— I did not re-run the bytes — but they are un-priced against the recipe's own threshold, and the
recipe is the one MRK-ABS's critic minted and this wave is now copying everywhere.

### 2.7 The rank is ruled as an ORDER and gated as half an order

§6's leader ruled the rank off live paint: tier 2 `0.95` > tier 1 `0.65` > peer `0.55`, and I
reproduced the first two rungs. G-LIVE-14 asserts `tier2 > tier1`. Nothing asserts `tier1 > peer`
as an order: `join-language-prm.spec.ts:153` pins the peer as the literal `0.55`, with tier 1's
`0.65` living in the comment beside it. Move tier 1 to 0.55 and the section's own centre — *"the
rank is an ORDER"* — stays green in both gates.

### 2.8 Crop 3 is declared DARK and is a LIGHT frame

Crop 3 (`3-toggle-mouse-landing-no-ring-dark-webkit.png`, 63.9 KB) is filenamed, tabled and prosed
as `webkit · dark`, and is claimed as the pair to crop 2 — *"same engine, same theme, same
viewport, same pointer class"*. Its pixels are a sun on a cream ground. Measured cause, webkit,
my run:

```
BEFORE  theme "dark"  body bg rgb(17, 15, 14)   rings 0
click .sun-moon-toggle (real mouse down/up)
AFTER   theme ""      body bg rgb(251, 250, 249) rings 0
```

The gesture under test flips the document's theme, so the "pair" differs in exactly the axis the
frame law makes a lane declare. The CLAIM survives (I reproduced `fv=false`, 0 rings, both
engines); the FRAME does not show what it says, and it spends 64 KB of a crop cap the wave has
already overspent to do it.

### 2.9 Record hygiene the chair should act on

`pass4/prototype/MRK-LIVE/frames/` holds three uncited PNGs (83 KB) from a prior, un-returned
pass-4 attempt, plus that attempt's `logs/A*`, `logs/B1-mouse-*`, `logs/C*`,
`logs/estate-focus-ring-RUN*`. The lane declared them and correctly refused to delete another
run's record. They are duplicates of its own crops 1–3 at a moment the wave is over its 2 MB cap.
The sweep is the chair's row.

---

## 3 · Strengths (earned, and re-run by me)

1. **The born-RED now fires where the wave needs it to.** `--ring-ink` is declared once, consumed
   bare, and deleting the declaration paints `none` — not `rgb(10,10,10)`, the colour the pass-3
   `, currentColor` form shipped. This is the line §10/§11 copy, and it is now safe to copy.
2. **The gates left the probe directory.** Three of five estate rows are born-RED against the
   chair's named control in both engines, reproduced on my own servers: 6 red / 4 green on
   `74a2b5d9`, 10/10 on the lane. `lint:motion` moved 34 → 35 declaring specs and is no longer
   vacuous for this family.
3. **π is clean on the harder arm.** 20 nodes × 12 computed paint properties and tag names, 0
   deltas and 0.00 px, lane dev against the PRE-BUILT DIST control the chair specified — the
   family only claimed dev-vs-dev and flagged the deviation. It holds against the stricter one.
4. **The instrument failures are banked as law, not buried.** A flat `document.styleSheets` walk
   deletes nothing under Tailwind v4's `@layer`; an ablation that does not force a re-measure
   reads the ring already on screen; a `cssText` scrape greens on `null`. All three are declared
   with their re-cuts, and the second is named as pass 3's own green in the opposite direction.
   I hit the first class myself and say so in §5.
5. **The pointer-class discipline paid.** Re-cutting a mouse-at-a-phone-viewport row into a
   witnessed `hasTouch` regime is what surfaced the WebKit stray ring at all. That lesson is worth
   more to the wave than the cure.
6. **G-LIVE-18's re-worded sentence is honest.** Each half now has a host where it can fail, the
   negative control runs in the same run, and the surrogate (`<angle>` re-type) is declared as a
   surrogate rather than sold as the thing.

---

## 4 · Checklist hits

- **gates that cannot fail** — G-LIVE-16 (§2.1, both clauses, both engines, with a stranded
  control that passed); G-LIVE-19's "one home" and "no masked default" (§2.2).
- **masked fallbacks** — `--toggle-bleed`'s `initial-value: 0px` re-creating the three `, 0px` the
  same diff struck (§2.2).
- **spec-cites-itself / circularity** — `index.css:491`'s comment asserts *"`marks-fade-in`'s
  computed duration reads 0s where the gate reads 250ms"*; no gate reads 250 ms. G-LIVE-19 checks
  only that the registration exists.
- **the constraint it forgot** — the painted-contrast threshold-sensitivity row (§2.6); the
  filterBudget census un-re-run on a built dist (declared by the lane, still open); the frame law's
  declared theme (§2.8).
- **the elegant-reduction trap** — the 9-line cure lands with no gate and the phone arm is "and
  then the hard part" (§2.4); G-LIVE-17 is measured, undisposed and still not an estate spec.
- **unverified gestalt** — crop 3's declared theme is not its pixels (§2.8).
- **consumer-less substrate** — NOT hit any more. Closed this pass, reproduced (§1).
- **legacy alias** — NOT hit: `--ring-ink` is an alias by ruling (§2.9) and now has its consumer.
- **the pixel it did not declare (π)** — NOT hit: 0 paint deltas, 0.00 px, both engines, against
  the pre-built dist.
- **the generic default** — NOT hit; the mark is bespoke, measured and drawn in the house hand.
- **W2's landed mechanics** — NOT hit; the design rides the tab, the dock and the coarse tape and
  mints no mechanic.
- **M16** — NOT hit; `check-copy-register` bare, 0 unadmitted.

---

## 5 · My own instruments, and where they failed first

1. **My first `--ring-ink` ablation deleted nothing and reported "the stroke did not move".** My
   recursive walk tested `if (rule.cssRules)` before `rule.style`, and a modern `CSSStyleRule`
   exposes an empty `cssRules` for CSS nesting, so every style rule was recursed into and never
   read. Banked RED at `logs/critic-probe.json` (`deleted: 0`) beside the re-cut in
   `logs/critic-probe2.json` (`declarations: 1`, `:root, :host`). **This is a second, different
   trap in the same "ablate a token" family the lane already banked one for, and the wave should
   carry both: check the declaration FIRST, then recurse.**
2. **My first phone row read the framing error against a hardcoded `.drawer-tab`** and reported
   `err 236.63` at settle in both engines. The ring was correctly framing a different element. The
   re-cut reads the live target and names it; the 236.63 is my instrument's, not the design's, and
   it is the mirror of the family's own round-A mistake.
3. My π arm is dev (lane) against a preview of the built dist (control). That is the chair's named
   control and the stricter comparison, but it is not like-for-like tooling, and a paint delta
   caused by the dev pipeline would have shown up as a delta. None did.
4. I did not re-run the painted bytes, the filterBudget census, or the coarse tape's bbox. Those
   three numbers in the return are unverified by me, and I say so rather than ratifying them.

---

## 6 · Convergence: 84%, and what the missing 16 costs

Pass 3 earned 86. This pass closed three of the biggest pass-3 reds for real — the minted token now
has a consumer and a firing born-RED, the fallbacks are struck, the gates are in the estate — and I
reproduced every one of them on both engines against the chair's own control. It also found and
cured a defect nobody had looked for, on the one surface nobody had measured in a witnessed coarse
regime, which is the best thing in this return.

The number goes DOWN one point because this family is the section's LEADER and now owns wave-wide
substrate, and the substrate regressed:

- the `@property` block every lane copies carries a clause-3 breach (`--toggle-bleed`), and the
  gate over it tests neither half of its own title;
- the safety gate over the design's most dangerous act is vacuous for the **second consecutive
  pass**, now with both of its live clauses dead and a stranded control that passes;
- the one fallback the diff argues for is unreachable by its own two cited lines;
- the headline cure has no gate anywhere;
- the phone table and crop 3 — a leader's artifacts, which other lanes copy — do not say what the
  surface says;
- three named grafts untaken, G-LIVE-17 measured and undisposed, the hint laminate unread, no dist
  built, the filterBudget census un-re-run.

None of that is a missing primitive as hard as the problem, and none of it is a rewording. Every
row above is a sentence someone can close in one pass. **ADVANCE.**

---

## 7 · Cross-pollination

1. **`outline-width` is NOT an indicator test.** `outline: none` leaves `outline-width` at
   `medium` (3px, both engines, measured). Every family that suppresses a UA affordance and then
   gates "is there still an indicator" must read `outlineStyle`, and must await a flush before
   reading a Vue-rendered ring. This retires a whole shape of green.
2. **An indicator walk needs a stranded negative control in the same run** — an injected focusable
   with no indicator — or it is a gate that greens on its own sampling.
3. **Ablate a token: check the declaration BEFORE you recurse.** A `CSSStyleRule` exposes an empty
   `cssRules` for nesting, and Tailwind v4 wraps the sheet in `@layer`. A flat walk deletes
   nothing; a naive recursive walk skips everything. Both failure modes are now banked in this
   wave, one by the lane and one by me.
4. **A class and its inline publisher bound by the same predicate make the `var()` fallback
   unreachable.** §6.5's sweep should test the PREDICATE, not the token's declaration site; this
   retires `--color-peer-cursor-ink`'s exception here and probably `--reveal-delay`'s at
   `index.css:802`.
5. **An `initial-value` equal to the fallback you struck is the fallback.** Clause 3 needs a test,
   not a sentence: register the initial at a value that FAILS VISIBLY and let the publisher supply
   the working one.
6. **Read a framing error against the element the overlay claims, never against the element you
   expected it to claim.** Both the lane and I got this wrong in opposite directions in the same
   pass; it is the cheapest wrong number in the wave.
7. **A gesture that changes the theme cannot produce a same-theme pair.** Any lane framing a
   before/after on the dark-mode toggle owes two frames per theme, or a different subject.
