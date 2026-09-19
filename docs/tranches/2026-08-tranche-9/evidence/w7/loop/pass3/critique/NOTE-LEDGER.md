# T9-W7 pass 3 · NOTE-LEDGER — the adversarial critique

Critic did not write the spec or the prototype. Everything below marked **(mine)** was measured
by this lane on its own servers: prototype `wf_f72f3b5a-83a-46` on `:4231`, HEAD control
`74a2b5d9` on `:4232` (the scratch `head-control` tree, verified byte-identical to `74a2b5d9`
for `MarginNote.vue`, `GameBoard.vue`, `index.css`, `main.ts` by sha1). Instruments:
`critique/NOTE-LEDGER/probe/{audit,dupes,fulfilled-rest}.probe.mjs`, chromium + webkit. Both
servers killed at return.

---

## 1. What reproduces

Every one of these I re-derived rather than re-ran the family's script.

| claim | mine | verdict |
|---|---|---|
| π on unclaimed surfaces | `.board-margin` `.margin-note` `#fold-tools` `.app-layout` `#controls-drawer` `.masthead` `[role=grid]` — **0.00 / 0.00 / 0.00 / 0.00** on x/y/w/h at 390×844 and 1280×800, both engines, proto vs `74a2b5d9` | CONFIRMED |
| scrollHeight | 844/844 and 800/800, proto = control, both engines | CONFIRMED |
| filterBudget | 25 computed-filter elements, 24 `url()` filters — proto = control, both rigs both engines | CONFIRMED, never grows |
| AA both themes | resolved paint, α 0.68 composited on the real backdrop: line two **5.184** light / **6.114** dark; line one **14.52** / **12.25** | CONFIRMED ≥4.5 |
| L5 clearance, my own reference line + my own interactive sweep | first painted interactive box below the strip is **`button.icon-btn`**, not `#fold-tools`: **8.03–8.10 px** at 360×740 / 390×844 / 390×664, both engines, both themes; to `#fold-tools`' own box **2.43–2.50** | CONFIRMED, including the subject correction |
| L11b the true sentence stands | live, both engines: `6 goes nowhere else in this row` + a `1` typed elsewhere in the row → line one unchanged | CONFIRMED |
| L14 the floor as a gate | used width **516.97** (chr) / **516.94** (wk) vs 12×1ch = 75.48/75.52; `clipped 0`, `min-width 0px`, `flex-basis 0px`, **0** interactive overlaps, block one row (23.61) | CONFIRMED |
| L17 no state `data-*` | line two's attributes are exactly `["data-v-c6e01808","class"]`, `role` null, `user-select: auto` | CONFIRMED (narrowed sense) |
| one region | one `.margin-note`, one `.margin-note-previous`, one `role=status` **in the strip**; the page's other two are `.board-voice.sr-only` and `.copy-status.sr-only`, both pre-existing | CONFIRMED, honestly scoped |
| gateNote non-vacuous | `check-ink-pressure.mjs --self-test` exit 0 — all three note modes (rung / consumer / discovery) fail as required | CONFIRMED |
| mechanical | vue-tsc 0 · typecheck:node 0 · vitest 2 files / **41** tests · lint:ink 0 · lint:copy 0 · lint:motion 0 · lint:live-regions 0 · check-font-coverage 0 (8 admissions printed) · lint:boundary 0 · lint:theme-tokens 0 · lint:theme-selectors 0 · lint:sleep 0 · lint:catch 0 · lint:tdz 0 · lint:lanes 0 | CONFIRMED |

The centre is real. `MarginRecord.value` — the record's own digit — is the one field that cures
the canonical loop and the house over-strike together, and pass 2's `openCells()` derivation
deserved to die. The clearance correction is the best thing in the return: it found that
`#fold-tools` is a container, that the class law's subject is an interactive element 5.6 px
lower, and it withdrew a ballot that would have cost the owner 3–5 px of page. That is the
shape of an honest lane.

---

## 2. What does not

### 2.1 A CI lane reds. `lint:knip` exit 1.

```
Unused exports (1)
motionRungsCss  function  src/pencil/config/motionRungs.ts:18:17
```

The return's "MECHANICAL, all run BARE" list names eight gates and omits `lint:knip`,
`lint:boundary`, `lint:theme-tokens`, `lint:theme-selectors`, `lint:sleep`, `lint:catch`,
`lint:tdz`, `lint:lanes`. Seven of those eight are green. The eighth is not, and it is a lane.

### 2.2 The two-line column does not exist at rest on the family's own canonical loop.

Three rounds, real keystrokes, both engines **(mine)**:

```
chromium  only 1 fits here → typed 1 → { one: "",  two: "only 1 fits here" }
          only 3 fits here → typed 3 → { one: "",  two: "only 3 fits here" }
          only 7 fits here → typed 7 → { one: "",  two: "only 7 fits here" }
webkit    4 goes nowhere else in this column → typed 4 → { one: "", two: "4 goes …" }
          …  twoLineAtRest [false, false, false]  both engines
```

`L1` passes because `L1` reads line two. What the reader is left holding is one 14 px grey
caption line sitting under a 20.8 px empty gap where line one was — see
`critique/NOTE-LEDGER/frames/CR-390x844-chromium-fulfilled-at-rest.png`. It does not read as a
ledger accumulating; it reads as the hint you asked for going pale. The spec's opening sentence
("line one the live record, line two the aged one") describes a pose that only exists in the
window between asking hint N+1 and answering it — which is exactly the window frame C1 was shot
in. The gate was written so it cannot see this.

### 2.3 The push's declared numbers cover the wrong path.

The return measures the push as `{duration: 250, fill: "backwards"}`, `translate(0px,
-15.390625px) scale(1.1428…)` — the DISPLACEMENT path. On the FULFILMENT path, hooked at
`Element.prototype.animate` **(mine)**:

```
translate(0px, -34.171875px) scale(1.3137367599967156)   390×844, chromium
.margin-note rect at that moment = { width: 0, height: 0, top: 624.906, bottom: 624.906 }
```

`min-height: 1.3em` sits on `.margin-note-block` (`MarginNote.vue:216`), not on the voice, so an
empty line one collapses to a **0×0** box and the FLIP's `from` is read off ink that is not
there. The aged line therefore flies down 34 px and shrinks 31 % — landing under nothing —
where the spec's sentence is "steps down a rung, a size and a line, as the new one writes in
above". Neither number appears in the return and no frame shows the motion on this path.

### 2.4 Crop C4 does not contain its subject.

`C4-1280x800-light-desk-pair-webkit.png` is **1296×80** and holds a sliver of board and a pink
dot. There is no margin text in it. The ≥1024 berth — the one berth whose readability is
argued rather than measured — is therefore unphotographed. My own desk crop
(`CR-1280x800-chromium-deskpair.png`) shows what it looks like: the pair sits on one row with a
**7.19 px** gap (line one right 241.73 / line two left 248.92 chromium; 237.72 / 244.91
webkit), and when both sentences take the hidden-single template it paints

> **2 goes nowhere else in this row**  9 goes nowhere else in this row

Pass 1's "the desk pair read as one run-on sentence" is mitigated by the size and tint step, not
closed. The C2 crop was deliberately withheld on a sound argument; C4 was shot and missed.

### 2.5 `--type-tag` is consumed outside its declared scope with the ASK unanswered.

`typography.css:123` scopes the role to "row caption · closed-tab value · roster"; R6 law 27
names the set "the CONTROLS estate reads a ROLE". The margin strip is the board's. The spec
raised this as an ASK to the chair; `pass3/CHAIR-RULINGS.md` answers no §7 token question. The
prototype shipped the consumption anyway. (`--type-caption` is byte-identical today, so nothing
moves — the seam is the point, not the pixel.)

### 2.6 L9's solve clause is unmet as written and untested.

Gate: "a conflict never lands in line two; **a solve empties both** before celebrating." The
implementation is `setMargin("solved it!", "gold-star", "empty")` — `kind: "empty"` clears line
two and line one keeps the verdict, because `CompletionVignette` reads `marginLive.text`. Line
one is not `""`. No new receipt row covers a solve; the file's only solved assertion is the
pre-existing `expect(receipt(w)).toBe("solved it!")` at `:550`.

### 2.7 The ledger is `display: none` on every landscape phone.

`@media (max-width: 1023.98px) and (orientation: landscape) { .margin-note-previous { display:
none } }`. Live at 844×390, both engines **(mine)**: line two's text is in the DOM
(`"only 3 fits here"`), its computed `display` is `none`, its rect is 0×0. Declared as "depth
ONE, B6's split-grammar row, the owner disposes" — but it is the family's whole thesis switched
off by orientation, and the declaration is in a CSS comment rather than in the return's gaps.

### 2.8 The unit stub is not isomorphic with what ships.

`GameBoard.notes.test.ts`'s `MarginNote` stub renders
`<p class="margin-note-previous" :data-hidden="hidePrevious ? 'yes' : 'no'">`. That is precisely
the state `data-*` L17 forbids on the real element, which ships `:class="{'is-hidden': …}"` +
`display: none`. The stub that the ledger's twelve unit rows run against carries an attribute
the component does not have, and the pass-2 row that asserted the behaviour was dropped rather
than re-written, so `hidePrevious` is now ungated at the unit.

### 2.9 Unrun

- **L2** — no `?wire=local` peer was staged. Authorship-blindness is argued from the prop.
- **L13's born-RED** — no build with `publishMotionRungs()` deleted was ever served.
- **L10-W** — 99 strings at 360 coarse, pass 1 RED at 4.99 % headroom.
- **Six of seven censuses** — `marks.probe.ts` R3-d (and its two-act diff), `marks2.probe.ts`
  R3-g, `wobble.probe.ts`, `budget.probe.ts`, `heading-voice.spec.ts`,
  `board-covisibility.spec.ts`. Only `hue-census.mjs` was copied and re-run (byte-identical,
  correctly reported NOT MOVED).
- **Goldens 4/4** owed; no build anywhere.
- **The whole-page ordinal π sweep** is confounded by independent random deals and was banked
  with the caveat. Mine is chrome-key-only for the same reason. A seeded-deal rect-for-rect
  sweep is still owed by somebody.

### 2.10 Two smaller things

`marginRecordCopy` reads `techniqueVoice.ts` only — `that's a given clue`, `the board is
clear`, `still solving…`, `solved it!` and the conflict verdicts stay outside the font corpus,
and all of them now sit on screen twice as long. And 812 KB of evidence for one family is 40 %
of a 2 MB **wave** cap; `P1-geom-chromium.json` + `P1-geom-webkit.json` alone are 415 KB of raw
JSON.

---

## 3. Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | **HIT** — L1 reads line two and cannot see that line one emptied (§2.2); L9's solve clause has no row (§2.6) |
| spec-cites-itself | clear — `gateNote`'s floor is a regression floor with three self-tested negative controls |
| gates that cannot fail | **HIT** — same two |
| elegant-reduction trap | **HIT** — "and then the hard part" is the chair's ruling on the class law's subject (§2.4 of the return's own gaps) and the §13 ladder borrowed whole |
| legacy aliases | clear — `referent`/`openCells()` deleted outright, the four literals and their byte-equal fallbacks gone |
| masked fallbacks | **HIT** — landscape `display: none` makes the feature vanish where it does not fit (§2.7) |
| unverified gestalt | **HIT** — C4 holds no text (§2.4); the loop's most common pose is unshot (§2.2); the desk run-on is unmeasured |
| consumer-less substrate | **HIT** — `motionRungsCss` unused (knip, §2.1); the two-rung stub is a ladder nothing else consumes |
| the generic default | clear — the tier step is the estate's own row caption, cited declaration for declaration |
| the pixel it moves it did not declare | **clear** — π 0.000 on every chrome key both engines, independently (mine) |
| the constraint it forgot | **HIT** — `--type-tag`'s declared scope / R6 law 27 (§2.5); `lint:knip` as a lane (§2.1) |
| M16 · filterBudget · AA · W2's mechanics · decided history | clear — `lint:copy` 0, filters 25/24 unmoved, 5.18/6.11 both themes, no new mechanic, R6 law 30 honoured by census rather than by a re-cut |

---

## 4. Verdict

**ADVANCE at 76 %.** The predicate is right and it is the family's real contribution; π, AA,
filterBudget and fourteen of fifteen mechanical gates are clean under an independent hand. What
it has not earned is the last quarter: one lane reds, the thesis sentence is not what the
canonical loop paints, the push's numbers are for the other path, the desk crop is empty, a
token ask is open, a gate is unmet as written, and eight instruments were not run. None of that
is a missing primitive and none of it is a constraint violation, so it is not BLOCK and not
RETIRE — but it is not 100 and the return's "every gate the brief named as the family's own cut
is green" overstates by at least L9.

The one design question the next pass has to answer, not measure: **what does line one hold
after the record it carries comes true?** Today it holds nothing, and the answer decides whether
this family is a ledger or a fade.

---

## 5. Worth grafting elsewhere

1. **The class law's subject is the interactive element, not the container.** Every §10 / W2
   tape lane should re-read its clearance the same way; here it moved 2.43 → 8.03 and withdrew
   a ballot worth 3–5 px of page.
2. **An admission ledger closed both ways** — a licence that reds when the cut absorbs the
   codepoint it excused. The general shape for any gate that tolerates a known defect.
3. **`overflow-x: clip` + `overflow-y: visible` + `text-overflow: ellipsis`** as the hand-face
   clip idiom: the run is bounded, descenders survive, the ellipsis still paints (proved on both
   engines by negative control).
4. **A readable floor as a GATE on used width, never a CSS `min-width`** — it refuses to buy
   legibility with a wrap that overlays an interactive element.
5. **Hook `Element.prototype.animate`** rather than sampling `getAnimations()` when the trigger
   rides a worker; and settle an ellipsis by rendering the same string forced to
   `text-overflow: clip` and diffing the tail, because a gap-then-ink scan is device-scale
   sensitive (phone dsf 3 vs desk dsf 2 read a false RED).
