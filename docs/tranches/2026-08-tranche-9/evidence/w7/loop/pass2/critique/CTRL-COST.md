# CTRL-COST — pass 2 critique (adversarial, non-author)

**The consequence ladder.** Prototype read at `.claude/worktrees/wf_8630d340-e56-30` (18 files
uncommitted, +1,718 / −1,564); record at `pass2/prototype/CTRL-COST/README.md`. This lane read
the whole diff, looked at all four cited frames, and re-ran measurements of its own on a private
lane (`127.0.0.1:4241`, `--strictPort`, private `cacheDir`, killed at return; probes and readings
under `pass2/critique/CTRL-COST/{probe,readings}`, `c1`–`c7`, both engines).

**CONVERGENCE: 62%. VERDICT: ADVANCE — with adoption BLOCKED on two rows, one of them new here.**

The ladder is the right idea and most of it lands. But the family's central act — *press the
destructive verb twice and it happens* — **does not work at all in WebKit**, measured three ways,
and the record does not know it. That is not a polish row; it is the mechanic the family is named
for, dead on the engine half of the readers and on the owner's own surface.

---

## 1 · THE NEW BLOCKING FINDING — the tier-3 verbs never fire in WebKit

**Measured, WebKit, three independent presses, board signature unchanged every time:**

| probe | surface | engine | second press → | board |
| --- | --- | --- | --- | --- |
| `c4` row A | 390×844 touch, card at its foot | webkit | **still armed** | unchanged |
| `c5-webkit` | 390×844 touch, card mid-scroll (3 taps) | webkit | **re-arms, then re-arms again** | unchanged ×2 |
| `c6` | 1280×800 **mouse** | webkit | disarms, nothing fires | unchanged |
| `c5` / `c6` controls | same, chromium | chromium | **deals** | changed |

**The mechanism is in the trace, not in a guess** (`readings/c5-webkit.json`, listener on
`.deal-face`, capture phase):

```
pointerdown  on .act-word.is-armed          armed:true   t=5064
focusout     target .act-answer  related NULL  armed:true   t=5065   ← WebKit blurs `no` first
click        on .act-word.is-armed          armed:false  t=5066   ← press() sees armed === false
focusin      .act-answer                    armed:true            ← so it ARMS again
```

`leftFace` (`GameControlPanel.vue:619-631`) disarms when focus leaves the face:

```ts
const to = e.relatedTarget;
if (!(face instanceof Element) || !(to instanceof Node) || !face.contains(to)) disarm();
```

WebKit blurs the focused `no` button on the next `pointerdown` **with `relatedTarget: null`** —
before the click. `to` is `null`, so the guard's own `!(to instanceof Node)` branch fires and the
face disarms; the click then arrives at `press()` with `armed === false`, sees a dirty board, and
arms again. Chromium's focusout carries `relatedTarget = .act-verb`, `face.contains(to)` is true,
and the same code deals. **The cure that made `no` a real button is what broke the two-tap**: with
a span there was nothing to blur.

Why the record missed it: G5′ asserts *a press writes 0 and arms* (true on both engines), the
"second press deals" evidence is the jsdom unit row plus chromium probes, and no probe in
`readings/` presses an armed verb a second time on WebKit and then reads the board. The prototype's
own `deltas` say "RUNNING prototype on the real surface, both engines" — for arming, yes; for
firing, only one engine was ever asked.

Closable in one line (ignore a `null` `relatedTarget`, or re-check `document.activeElement` on the
next frame, or do not move focus at all for a pointer-originated arm), but it must be measured on
WebKit in pass 3, including whether ANY exit fires the act there (Shift-Tab + Enter is
chromium-only in the record by its own gap 6).

## 2 · THE SECOND BLOCKING ROW — the goldens, honestly declared, still red

The record's §2 is the best work in this batch: the battery run on a built dist, a HEAD control on
the same lane minutes apart (4/4 green), the mechanism measured to the pixel (the writing band's
act row at 325.97 max-content becomes the card's widest box, card +41.75, board column −20.87), a
cure auditioned (`contain: inline-size`) and **reverted** when it only halved the walk. Nothing
here is asserted. I did not re-run the battery (it needs a dist and the attribution is internally
consistent), and I accept it as stated: **3 of 4 goldens RED, adoption-blocking, disposition
owned by W2 and the owner, not by this family.**

One correction to its framing: this is also a **π break the family does declare but has not
priced** — the board column walks 20.87px at the desk on a surface the wave does not claim. The
goldens are the instrument that caught it; the walk is the defect.

## 3 · WHAT I RE-MEASURED AND WHAT IT SAID

**AA, and a state the gate does not reach.** G9′ measures the asked word on BARE card (4.990 light
/ 6.303 dark). But `.act-face` grounds on `--color-accent` under a fine pointer, and **a reader
hovers the verb they are about to press** — that is the state the second press happens in. Measured
myself, both engines (`readings/c4.json` row B), armed **and hovered**:

| ink | ground | ratio | floor |
| --- | --- | --- | --- |
| `sure?` #D02A52 light | accent `rgb(246,246,244)` | **4.693** | 4.5 |
| `sure?` #FF5C7C dark | accent `rgb(40,38,36)` | **5.078** | 4.5 |
| `no` light / dark | same grounds | 18.297 / 12.761 | 4.5 |

AA holds — by **0.193** in light. The row is green and the gate is not: as worded, G9′ cannot fail
in the state it exists to protect. The number belongs in the record, and the hover ground belongs
in the gate's fixture.

**The window's lapse** (`c4` row C, chromium): focus sits on `no`; at 2500ms `disarm()` moves it
silently back to the verb (`act-answer` → `deal-btn`, `armed:false`). A subsequent Enter **re-arms**
rather than dealing — the safe outcome, so the "a second Enter never deals" contract survives the
lapse. But the focus move itself is unannounced and un-gated, and it is the one moment the safe
target under a reader's hands becomes the destructive one.

**After the act fires, focus is dropped** (`c5`, `c6`, chromium): `afterSecond.focus: "BODY"`, and
still BODY 3.5s later. The verb is `:disabled` while the deal loads, so the browser drops the
reader on `<body>` — **the exact defect the family cured for the disarm leg and did not check on
the fire leg**. (The Escape-after-deal leg I measured at 1280, where `.drawer-case` is the rail, so
that half is not a sheet claim; on the dock it is unmeasured and it is the family's own argument
that matters: a reader on `<body>` is outside `#controls-drawer`.)

**G17 verifies.** My own read of the berth reproduces the record: worst head overhang **2.66**
(chromium) / **2.67** (webkit) at 1280, negative at 390 — the note is inside its budget
(`readings/c7.json`).

**But the tape's ink is no longer on its paper.** Buying that budget cost the berthed tape its
vertical padding: computed `padding: 0.32px 6.4px`, `line-height` 17.56px. The text's ink box
exceeds the label box by **0.61px at the top** and 0.08–0.46px at the bottom, all four
engine×width cells. On a **rotated** tape that is exactly what the record's own crop shows —
`frames/writing-note-1280.png`, the `fill` note's second line, "left", crossing the tilted paper
edge. The record measured the label against the head; it never measured the ink against its own
paper, and the frame it cites as proof of the berth is the frame that shows the defect.

## 4 · CHECKLIST HITS

- **Consumer-less substrate — `MOTION.inkLiftMs`.** Added to `pencilConfig.ts` with a comment that
  the 150ms "belongs here with the rest of them", and **nothing reads it**: `grep -rn inkLiftMs
  src/ e2e/ scripts/` returns the declaration alone, while 21 `150ms` literals still stand in
  `index.css`, `scene.css` and the SFC. The spec's MOTION row "inkLiftMs 150" is a token with no
  consumer. (`confirmWindowMs`, by contrast, is really spent at `:616` — that half of the row is
  real.)
- **Consumer-less substrate — the `starting over` berth.** Band 3's head renders
  `noteOf('starting')`, and no `NOTES` row carries `band: "starting"` (`:440-456`). The node can
  never hold a string; the unit row only asserts all four berths are empty at rest, so nothing
  reds. `check-font-coverage`'s `BOUND_TAPES` pins `noteOf('starting')` as a rendered binding that
  cannot render.
- **The record can't verify the record (three numbers).** (a) The `no` button is **56 × 44**
  measured (`c1`, `c4`, both engines); the spec, the source comment at `:568` and the README all
  say "73.59 × 44" — that is the FACE's width, not the button's. The floor still clears in both
  dimensions; the cited number is wrong in three places. (b) `GameScene.vue:191` still says the
  panel publishes `--card-pad-t`, which this very diff **deletes** (`:734`). (c) The README's gap 2
  says `--sheet-chrome` "does not exist in this tree" — it exists at `scene.css:505` (12rem) and
  `:655` (4rem), scoped, not on `:root`; the substantive half of the gap (the berth's clearance is
  the prototyper's arithmetic, not W2's derivation) stands, but as written the gap is false.
- **Gates that cannot fail.** G9′ pinned to the bare-card state (see §3). G6′'s Δ[0,0,0,0] is a
  LAYOUT claim presented as "nothing moves": arming also scrolls the scrollport — 16px from a
  mid-scroll park, **172px** in the record's own `c3`-shaped case (`readings/c3.json`: scrollTop
  14 → 186 with the face walking −172) — because `answerEl.focus()` scroll-into-views the newly
  visible `no`. The face's box does not move; the view under the thumb does, and no gate reads it.
- **Masked fallback, one side only.** `--pin-band` is declared with no fallback and the reasoning
  for that ("loud") is written out twice — good. The new `.controls-card::after` keeps
  `var(--card-pad-b, 0px)` on four declarations, so the foot sentinel silently collapses where its
  twin would fail loudly.
- **Dead declaration.** `.band-row` declares `gap: 0.5rem` and then `gap: 0.15rem` two lines later
  (`GameControlPanel.vue:1613-1617`); the first is unreachable and prettier cannot see it.
- **Not hits, checked and cleared:** no legacy alias (`.guard-face` → `.act-face` is a real move,
  the gallery restates nothing); no gate re-worded to pass (`check-copy-register`'s two ADMITTED
  rows were struck **by the cures that landed the strings**, and `check-font-coverage`'s new
  extractors derive from the construct that now holds the copy rather than pinning a binding);
  the r0 record is intact (two instrument COPIES re-pointed, L3/R3 proposed as diffs and reported
  MOVED, nothing written under `loop/r0/`); filterBudget 9 holds and is now censused on the built
  dist in both engines (12/12); M16 clean with the admissions empty; no `role=dialog`, no new live
  region; the elegant-reduction trap is absent — the family names its hard part (the card's width)
  rather than deferring it.
- **One record-surface note:** the banked `law-probe.txt` ends `BROKEN: L3`, and the README's gate
  table and gap list never mention it. The PROPOSED diff explains it correctly (a probe that reds
  when a debt is paid), so the discipline is right and only the record's front page is silent.

## 5 · STRENGTHS

- The golden battery finally run against a dist, with a same-lane HEAD control, a measured
  mechanism, an auditioned-and-reverted cure, and the disposition handed up instead of taken. This
  is the pass's best evidence work in any family.
- `.act-face` unified across the gallery ribbon and the card — one declaration, two surfaces, the
  second copy deleted rather than added.
- The pin band: a sticky head that lives inside a reserved strip the fold sentinel already paints,
  with the reserve MEASURED and no fallback, taking G16 from 71.5% / 63.3% occlusion to 0.00%.
- The berth-in-the-head as the general answer to "no floating layer inside a scrollport is safe",
  which pays back W2's 3.5rem foot reserve.
- The 8% ground retired on a contrast argument with both jobs named (a 1.19:1 cue that also ate
  4.99 → 4.20 of the one word that must be read), and killed in both files in one diff.
- Copy cures that strike their own admissions in the same commit; the font cut measured, not
  estimated (14,636 → 14,948 B), with a same-source control.

## 6 · OPEN GAPS (each closable)

Listed in the return data. The two that block adoption: the WebKit two-tap (§1) and the goldens
(§2).

## 7 · CROSS-POLLINATION

The WebKit `focusout`/`relatedTarget: null` trap is a LAW for the whole wave, not a note for this
family: any design that moves focus as part of a confirm, a peek or a hover-note contract
(CTRL-FACE, MOT-VERB, NOTE-ERASE, CTRL-TAPE) will disarm itself on WebKit's pre-click blur, and
every one of them should carry a both-engine "press it twice and read the board" row rather than a
both-engine "it arms" row. The golden-attribution rig (`p2e/p2f/p2g`: box geometry at the golden
viewport, per-descendant max-content contribution, per-button arithmetic) belongs to every family
that touches the card's width. `.act-face` and the pin band are substrate other control families
can consume as-is.
