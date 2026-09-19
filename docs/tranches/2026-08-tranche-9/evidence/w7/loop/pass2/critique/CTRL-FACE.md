# CTRL-FACE — pass 2 CRITIQUE (adversarial, non-author)

Read the diff in its worktree (`wf_8630d340-e56-34`, 12 files, 652/140, tree clean and unstaged),
looked at all three frames, and re-measured on my own servers: **127.0.0.1:4238** (the prototype,
scratch vite config with a private `cacheDir`) and **127.0.0.1:4239** (a `git archive HEAD` tree,
node_modules symlinked, its own `cacheDir`). Both engines, both themes. Both killed.

**Convergence: 78%. Verdict: ADVANCE.** The design survives the surface — I reproduced its load-bearing
numbers to the hundredth without using any of its instruments. What has not converged is the
ENFORCEMENT: the plan's step 6 promised `e2e/face-law.spec.ts` and it does not exist, so most of
what this family claims ships as a probe reading with no home in the estate.

---

## 1. What I re-measured, independently

My own probe (`scratchpad/critic-card.mjs`, written from scratch, not a copy of `p2-card.mjs`),
cells 320×568 / 360×740 / 375×812 / 390×844 / 900×500 / 1280×800, both engines, light and dark:

| row | prototype claims | I read | |
|---|---|---|---|
| tab head daylight, `new game` over `size`/`level` | +4.13 / +4.71, 0px² | **+4.13 / +4.71, 0px²** | ✓ |
| ink gate, `checking` paper over `candidates` ink | +11.39 / +10.90 | **+11.39 / +10.91** | ✓ |
| the same, worst-case `pgjqy` descender | +5.39 / +4.90 | **+5.39 / +4.91** | ✓ |
| one voice on the eight names | 1, `Fraunces · 25.89 · 800 · lowercase` | **1**, at every one of six cells, both engines | ✓ |
| printed count | 8 | **8** at every cell | ✓ |
| card heights | 685 dock · 747 at 900×500 · 1173 desk | **685 · 747 · 1173** | ✓ |
| card chips under coarse | 44 | **44.00 × 44.00**, every chip | ✓ |

Two things the prototype did not measure and I did:

- **Narrow cells.** 360×740 and 320×568, coarse, both engines: still one voice, still 8 printed,
  `chipRows = 1` on both zone rows, `scrollWidth == clientWidth` on the card and on the document,
  zero spill. The caption lane is the risk here — `candidates` is **148.08px** of a ~343px usable
  lane at 375 — and `.zone-row { flex-wrap: wrap }` would turn any further shortfall into a silent
  second line worth ~44px of card. It does not wrap at 320. Nothing gates that it never will.
- **The deck at cells outside the prototype's fence.** `?view=gallery` at **900×500 coarse**,
  **768×1024 coarse**, **390×844 FINE** and 1280×800 fine, paired proto-vs-HEAD, 296 values:
  `.staging-axis-label` `Patrick Hand · 16 · 800 · lowercase` identical, deck chips
  `Fira Code · 16 · 400` identical, band and first-card geometry identical. The only deck delta is
  the deck tape's own pull, **−21.7025 vs −21.712px** (and −18.890 vs −18.9085 at 390) — the `1lh`
  rounding, 0.0095–0.019px, inside the declared 0.02. **π holds, and it holds at two cells the
  prototype never looked at.** (`.staging-axis` pins `font-size: 1rem` on its chips and
  `.staging-axis-label` pins face and rung, which is why `--type-option` 16→20 at fine-<768 and
  22→20 at 768–1023 cannot reach the deck. That is luck the diff did not buy and does not gate.)

Estate instruments, run bare by me on the prototype tree: `check-copy-register` **exit 0** (0 dashes,
2 admitted jargon, self-tests red-where-required), `check-font-coverage.mjs` **exit 0** (3 faces,
31/53/22 cmaps, 14,896/4,896/3,624 B), `lint:motion` **OK 34 specs**, `lint:ink` OK,
`access.spec 2.3` **6/6 both engines both themes**.

---

## 2. The findings

### F1 — `e2e/face-law.spec.ts` does not exist. Most of this family's law is ungated. (BLOCKING for pass 3)

`git status` on the worktree: four spec files modified, **no spec file added**. `grep -rn "1lh" e2e/
scripts/` returns one comment. `grep -rn "overrun\|daylight\|printedCount"` returns one comment.

So of the fifteen rows the charter lists as gates, the estate actually acquires five: the re-priced
seal + its second negative control (`visual-regression:821`), `CONTRAST_TARGETS` 4→8
(`access.spec:439`), the eleven retired census rows, the `zone-grammar` selector repair, and CHECK 6.
The other ten — **the ink gate (+2.0 / +0.5), the tab-head daylight (≥2.0 with 0px²), the tape
covenant at the consumer (±0.25 per well), printed count ≤8, heading-voice ROW 1 and ROW 3, the chip
metrics and the 768–1023 re-cut, the scribble overrun band, the ransom advance, and "the built css
contains `-1lh`"** — exist only as numbers in `readings/`. A later rung change on
`--type-group-title` reds nothing. This is the gap between a family that is measured and a family
that is landed, and it is the whole of the distance left.

### F2 — CHECK 6's closure has a hole at the same element it governs, and I falsified it

`SheetWashiLabel.vue:98` — `.washi-label { font-family: var(--font-hand) }`. The tape is
`span.washi-label.washi-tag`: **one element, two face homes, 97 lines apart in one file.** CHECK 6
builds `LISTED` from the class names inside its own keys, so `.washi-label` names no listed class and
the block is invisible.

Falsified, not argued. I copied `src/` + `scripts/` to a scratch tree, re-pointed `.washi-label` to
`var(--font-display)` — which would paint every note, tooltip and peek tape in a 31-codepoint cut with
no apostrophe and no digits — and ran the gate:

```
font coverage OK — 3 subset faces … exit 0
```

That is precisely the failure the check's own header says it was written to close ("this gate printed
`font coverage OK` while `pencils` and `players` painted their `p` in Georgia"). The check is not
vacuous — my two positive controls both bite (`--face-printed → --font-hand` reds 3 sites by name;
a stray `.ctrl-btn { font-family: Georgia }` in `StagingBand` reds with the right sentence) — it has
one specific hole, and the hole is on the family's own subject.

Scope, for the record: `grep -rn "font-family: var(--font-" src/` returns **51 sites**. The law has
eight members. The other 43 still read the binding, which is by design; `.washi-label` is not, because
it is the same node as a member.

### F3 — the contrast gate grew to eight selectors and measures five of them

`access.spec`'s 2.3 describe carries no `test.use`, so it runs at the config default **1280×800 fine**.
At that cell `.heading-value` **is not in the DOM** — the shut-tab value word only exists in the mobile
tab regime — so the one ink this family newly binds to data (`:class="activeColorClass(section)"`, the
tier crayon on the shut tab) is never sampled. The muted shut `.section-heading` is likewise absent.
The guard is `expect(samples.length).toBeGreaterThan(8)`, and the other five selectors supply ~26
samples, so the absence cannot red the row.

It passes when measured: I read `.heading-value[easy]` **4.984** light / 10.089 dark and the shut
`.section-heading` **4.659** / 7.681 at 390×844 and 900×500. But the crayon tiers sit at 4.91–4.99
light — **0.41 over the floor, on the one site whose ink became data** — and no gate looks at them.
The fix is one `test.use` cell, not a new instrument.

### F4 — the scribble-overrun gate cannot fail

`.tray-well :deep(.ctrl-btn .ctrl-word) { background-size: 120% }` with `background-origin: content-box`
on a span with no horizontal padding. The reading divides that by the span's own ink box, which is the
same box. **1.200 by construction, at any face, any rung, any word.** The prototype names this in its
gaps and is right to; it is still a band that admits every possible value, and it replaced a band
(1.46–1.50) that was measured against glyph ink. Measuring the mark against the *glyph* advance, or
against the word's `TextMetrics.width`, restores a gate that can move.

### F5 — `-1lh` survives on one hand-run grep, and browserslist is not what decides

`check-support-floor.mjs`'s own header: Tailwind v4 compiles CSS against Lightning CSS targets
**hard-coded in `@tailwindcss/node`**, and "neither consults browserslist". So the declared floor
(safari ≥16.4, where `lh` shipped) is a promise, not the compile target. If a toolchain bump lowers
that target under Safari 16.4, Lightning CSS drops a declaration it cannot lower, the pull vanishes,
and each of the four card tapes stops costing 0.00px and starts costing ~30px of flow — silently, at
build time, on the one property the whole composition is priced against. The prototype grepped the
dist once by hand and banked the string. Nothing re-grep it.

### F6 — law 14 and the open tab head

R6 law 14: *every interactive text surface takes EXACTLY ONE hover affordance; inert text takes none.*
The diff fences the ink lift to `[aria-expanded="false"]`, so the OPEN head — still an enabled,
focusable `<button>` with a live handler — now takes **zero**. The spec cites law 14 as its reason,
which reads the law backwards. Either the open head is inert (and should say so:
`aria-disabled`/`disabled`), or it keeps an affordance. No gate covers it, and the same slice deleted
`.is-active`'s underline, which was the open head's only non-ink cue.

### F7 — the one thing the frames say that no number does

`pose3-rail-light-new-game-chromium.png`: on the rail the `new game` tape and the `size` caption are
the same face, the same 25.888px rung, the same 800, ~30px apart. The compartment and the row inside
it are one voice with no rank between them — the tape's paper is the entire distinction. That is the
family's claim working exactly as written, and it is also the thing the owner is being asked to
dispose of at the re-look (U-10). The frame asks it honestly; I am flagging it so the adjudicator does
not read "one voice" as settled hierarchy.

### F8 — smaller, verified

- **Printed count is 8 and the ceiling is 8.** Zero headroom; a ninth compartment reds a gate that
  does not exist yet (F1).
- **ROW 2 stays red** (2 of 8 group names are document headings). W3's row, correctly left failing.
- **The ransom advance was not re-run**, the hue census and wobble probe were not run. Each argued,
  each named. The advance is the one the charter listed as a gate.
- **The gallery's selected chip is persisted state**, so paired runs disagree on which tier is bold. I
  reproduced this (`Easy` 700 on one server, `Medium` on the other). Pin the selection through the URL.
- **Paper-over-ink is +1.99px and lives only in a comment.**
- **`.staging-axis-label`** is a second unlisted face home (the prototype's own gap; F2 is its twin and
  worse).
- **The dock card is 685**, not the spec's ~683.

---

## 3. Checklist

| item | verdict |
|---|---|
| vacuous convergence | **HIT** — the overrun band admits every value (F4) |
| gates that cannot fail | **HIT** — F3 (`samples.length > 8` over an absent selector) and F4 |
| spec-cites-itself | clear — every number I re-took came off the surface |
| the elegant-reduction trap | **soft hit** — "TAPE stays a separate spec" and "RULE re-prices its own height" defer real composition work |
| legacy aliases | clear in intent (`--font-*` is the file, `--face-*` the law) — but see F2 |
| masked fallbacks | **soft hit** — `var(--ring-ink, currentColor)` is the chair's ruling honoured, yet the shipped ring is the fallback, and only the fallback was measured |
| unverified gestalt | clear — three frames, both engines shot, the poses are the ones that matter |
| consumer-less substrate | clear — all five new tokens have consumers |
| the generic default | clear — this is the estate's own two faces, not a template voice |
| the pixel it did not declare (π) | clear, and stronger than claimed: I hold it at 900×500, 768×1024 and 390 fine too |
| the constraint it forgot | AA ✓ (access 2.3 6/6, but F3) · filterBudget ✓ (no filter minted; 12/12 banked) · M16 ✓ (exit 0, bare) · W2's mechanics ✓ (sticky tag, dock, bottom tab, tap floor 44.00 exact, all intact) · decided history — law 14 (F6), law 28/29/30 ✓, law 24 ✓, law 39 form ✓ |

---

## 4. Verdict

**ADVANCE at 78%.** The design is real, it runs, its two refuted clearances were refuted honestly and
cured with a declaration cheaper than either budgeted lever, and I could not move any of its numbers.
What stops it from being converged is that its laws are mostly unenforced: land
`e2e/face-law.spec.ts` with the ten homeless rows, close CHECK 6 over `.washi-label`, give the
contrast row a mobile cell, and re-base the overrun on glyph ink. None of that needs a new primitive,
which is why this is not BLOCK.

## 5. Cross-pollination

1. **The consumer hook as the general answer to a shared component's register.**
   `.tray-well :deep(.x)` at (0,3,0) — and (0,4,0) where the component's own rule is itself a
   descendant — is the estate's idiom for "two decks, two voices, one component, no prop". Every
   §10 control family and the TAPE family should use it rather than editing `SheetWashiLabel` or
   `OptionSelector`.
2. **`1lh` for any pull that must track a leading it does not own.** It retires a whole class of
   two-ended variable covenants (pass 1's `--washi-tag-lh`). Worth a line in the idiom history — with
   F5's caveat attached.
3. **`align-self: flex-start` on a caption in a chip row.** 10.47px of clearance for 0.00px of flow,
   and it makes the stacked card agree with the rail. Any family fighting a row-caption collision
   should try the alignment before it buys margin.
4. **A gate keyed by EXACT selector text, with closure both ways** (undeclared home / law with no
   home). The pattern generalises past faces — ink, rung, tap floor — and F2 is the lesson that the
   key set must be closed over the *element*, not over the selectors someone remembered.
5. **The second negative control as the seal's own ablation** ("put the captions back and the card
   must FALL ≥28"). Every family that re-prices a seal should ship one.
