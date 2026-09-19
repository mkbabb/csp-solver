# PAL-WALK — PASS-1 CRITIQUE (adversarial, non-author)

**Convergence earned: 62%. Verdict: ADVANCE — the mechanism is real and replicated; the
question the family exists to settle is still open, and one of its selling claims is refuted by
its own bytes.**

I did not write the spec or the prototype. I read the diff in its worktree, looked at the three
frames, re-measured the headline numbers myself on my own server (:4248, chromium + webkit,
both bands), mutation-tested the new gate, re-ran the wave's own decided-history probe against
the patched tree, and measured two things nobody measured: the room with one person in it, and
the walk's distance to the tokens it claims never to be mistakable for.

My instruments: `critique/PAL-WALK/probe/{pw.config.ts,recheck.spec.ts,verify.mjs,alone.spec.ts}`,
readings in `critique/PAL-WALK/readings/` (84 KB total).

---

## 1 · What I reproduced (independently, and it holds)

I served the worktree myself (`npx vite --port 4248 --strictPort`, private cache dir so the
shared `node_modules/.vite` could not hand me a stale dep), asked the page for the real module's
144 inks, painted them, read the bytes back, and did the arithmetic in my own script. Every
headline number lands where the prototype put it, in BOTH engines:

| claim | prototype | my read (chromium · webkit) |
|---|---|---|
| painted hue error, max | 0.96° light / 0.75° dark | **0.96° @i=119 / 0.75° @i=46**, identical both engines |
| AA light worst (bg / card) | 5.45 / 5.59 | **5.453 @i=1 / 5.585 @i=1**, 0/144 under 4.5 |
| AA dark worst (bg / card) | 9.51 / 9.31 | **9.511 / 9.309 @i=123**, 0/144 under 4.5 |
| painted family law, first 16/24/40 | 0 collisions | **0 collisions**, closest 13.26° light (i=0 vs crayon-rose), 13.54° dark |
| chroma requested / painted | 0.1139 / 0.1138 | **0.1139 / 0.1138**, min 0.0845, at the wax 13/144 |
| separation 4 / 8 / 16 painted | 19.35 / 11.69 / 5.05 | **19.36 / 11.69 / 5.05** light, room at 12° floor = **7** |
| ΔE at 8 | 0.0237 | **0.0237** (dark 0.0241) |
| ring at 0.80 | 3.67 / 3.71 | **3.667 / 3.728** light, 6.393 / 6.298 dark, 0/144 under 3 |
| ring born-RED at 0.55 | 2.29 / 2.32 | **2.310 / 2.332 light, 144/144 under** |
| unit battery · types | 810/810, vue-tsc 0 | **810 passed in 66 files · vue-tsc exit 0** |
| copy register · lane census · the new gate | GREEN | **GREEN, GREEN, GREEN + both self-tests red on bad input** |
| leave path (my own addition) | not claimed | **back to solo bytes, both engines** — boundCount 0, rootInk #2563eb |

One correction of emphasis: the 0.55 born-RED is a LIGHT failure. At 0.55 the dark ring already
measured 3.591 / 3.576 — over the floor. "144/144 under 3:1" is true of light only, and the
record should say which theme it is talking about.

## 2 · What I found that the prototype did not

**a · The new gate is blind to the walk it is gating.** `check-peer-arcs.mjs` re-derives the
arcs from `index.css`, then re-derives ITS OWN walk from those arcs and checks that. It never
asks `playerIdentity.ts` what hues it actually emits. I proved it: copy the three files into a
scratch tree, replace the module's `const STEP = SPAN * ((3 - Math.sqrt(5)) / 2)` with
`const STEP = 0.5` — every hand then lands inside the first reserved arc, on top of crayon-rose —
and the gate still prints **"✓ 2 THE LAW HOLDS" and exits 0**. The gate proves a property of the
arcs, not of the product. Import `inkFor` (or run the walk through the module) and it becomes a
gate; as written it is a decoy with a self-test. This sits on top of the prototype's own gap 13
(floating point, no byte margin) and is the more serious half.

**b · The wave's own decided-history probe goes RED, unannounced.** `r0/r6-idiom-history/law-probe.mjs`
row **L6** is a π row — GREEN at HEAD, and the file's contract is "exit 1 when a standing law has
been broken". Pointed at the worktree it prints `L6 GREEN → RED · golden-angle walk: false`,
`BROKEN: L6`, **exit 1**. The law's substance (a formula, not a palette; a banded lightness)
survives the re-cut; its literal (`137.5`, `0.11`) does not. The prototype noticed r2's
hardcoded probe and missed this one. The house rule is that a ruling lands with its enforcing
config in the same commit: R6 §2 law 22 must be re-worded to the arc walk and L6 re-pinned in
the same change, or the family lands with a red π row.

**c · The family's core promise is unproven in the currency the family itself chose.** The
promise is "no hand is ever mistakable for a crayon, a verdict, the machine or you", enforced as
a 12° HUE floor. The family then argues — correctly, and this is its best work — that at this
chroma a hue gap is not a perceptual gap, and prices peer-vs-peer in OKLab ΔE. Nobody priced
peer-vs-TOKEN in the same currency. I did, on the painted bytes (`readings/token-dE.txt`):

| hand | nearest reserved ink | ΔE |
|---|---|---|
| i=1 | `--color-solver-ink-4` (#047857) | **0.0315** |
| i=6 | `--color-green-ink` | 0.0583 |
| i=3 | `--color-solver-ink-5` | 0.0627 |
| i=4 | `--color-solver-ink-4` | 0.0633 |
| i=0 | `--color-orange-ink` | 0.0902 |

The family calls ΔE 0.0237 "two teals a reader would not call two people" and banks a frame to
prove it. The second hand dealt in every room is ΔE 0.0315 from a solver-revealed answer — 33%
more than the distance it just called indistinguishable, and well under the 0.0764 it uses as
the house's own reference. The 12° law therefore does not deliver the sentence it is sold as
delivering. Either the guard is re-cut in ΔE (which will cost more open wheel and shrink the
room further) or the promise is restated as "never within 13° of a token", which is a statement
about the wheel, not about a reader.

**d · The one-person room was never measured, and the motion story does not cover it.**
`roomId` goes non-null at the invite press (`shareSession` = `startSession()` + `shareBoard()`),
before any peer exists. Measured, both engines (`readings/alone.txt`): at that press exactly one
element binds — `LI.player-row` takes `oklch(var(--peer-ink-l) 0.1145 27.16deg)` — while the
board stays `#2563eb`. So in the commonest room state (you invited, nobody has arrived) your
roster row is in your walk hue and your handwriting is not, and there is no join trace on screen
— the spec's stated explanation for the snap ("the join trace's first frame is the
explanation", 1180ms/0.95) does not exist in that state. The prototype's solo fingerprint covers
`roomId === null` and its two-page room covers both peers; the state between them is unread.

**e · The landed unit test now certifies a capacity the bytes refute.** `useSession.test.ts`
asserts `sep(8) >= 12` and `sep(9) < 12` on REQUESTED hues, with a comment that says "eight
hands (12.38°)". The prototype's own finding is that the PAINTED room is seven (11.69°). The
estate will carry a green test whose sentence the family's own README calls wrong.

**f · The `inkAgreed` race is worse than its own gap says.** The gap says two epoch authors can
hold different indices for a third peer. The sharper consequence: `mint` gives every page's self
`inkCursor++` starting at 0, and `sendState` marks everything a page holds as agreed the moment
that page is the epoch's author. A page that publishes before it adopts pins ITS OWN index at 0
and then refuses the room's assignment — two rows in one colour on that page, which is the one
thing this family exists to prevent. No gate asserts the room-level invariant "no two known ids
share an ink string". That gate is cheap and missing.

**g · The proposed solo-fingerprint regression gate reads a puzzle-dependent field.** Its
`glyphStroke` comes from the first `.sudoku-cell .glyph-svg path`, which is a given or a user
entry depending on the generated board. My probe read `rgb(10,10,10)` and `rgb(37,99,235)` for
the same field, same engine, on different runs. Promoted as-is it flakes; it needs a seeded
board or a field that does not depend on the deal.

**h · The gestalt is half-shot.** Three frames, all light, all chromium: two staged pairs (the
prototype says so) and one honest roster. There is **no frame of the ring at 0.80** — the cure
whose whole justification is that a reader can see it — and **no dark frame at all**, on a
change whose dark arm is a different lightness band. The ring also narrows the distance between
"someone else's cursor" (4px / 0.80) and "your own focus" (7px / 0.90) to width alone, and that
comparison is neither measured nor pictured.

## 3 · Strengths (these are real and separable)

- The prototype's central discovery is correct and I reproduced it: a screen is 8 bits, the byte
  round trip rotates hue up to 0.96°, and a walk built 0.25° clear of a reserved arc paints
  inside it. The 13° re-cut clears the painted law by 1.26°, measured, both engines.
- Honesty under its own knife: the richness claim is refuted in the prototype's own README, the
  0.5° gate is named unmeetable, the capacity is re-cast in ΔE, the frames that flatter are
  labelled staged. This is the behaviour the loop is supposed to reward.
- The ring cure is cheap, measured and true (2.31 → 3.67 light, 0/144 under 3), and it belongs
  to whatever palette wins.
- The per-hue gamut ceiling is the right mechanism regardless of family: asking for chroma sRGB
  cannot hold does not fail loudly, it clips and rotates hue, and that is what made the old flat
  0.166 walk a lie in the pixels.
- `adoptInk`'s "agreed, not held" invariant is a genuine correction to the synthesis, discovered
  by measurement (the spec's wording reds I2).
- Solo and the leave path are byte-identical to HEAD in both engines — I verified leave myself,
  which the prototype did not claim.

## 4 · Checklist

| item | reading |
|---|---|
| vacuous convergence | clear — every gate has a born-RED control with a number |
| spec-cites-itself circularity | **HIT** — the gate re-derives its own walk instead of the module's (§2a, mutation-proved) |
| gates that cannot fail | **HIT** — same; and the 0.5° hue gate is the mirror image, a gate that can only fail |
| elegant-reduction trap | **HIT** — §1.2's fallback fired and is priced, not built; "three CSS rules" is the hard part deferred |
| legacy aliases | clear |
| masked fallbacks | minor — `min(ceil_L0.5, ceil_L0.8)` silently spends the dark band's headroom to keep one string |
| unverified gestalt | **HIT** — no ring frame, no dark frame, both staged pairs chromium-light only |
| consumer-less substrate | clear — every new line has a consumer |
| the generic default | clear |
| the pixel it moves that it did not declare | **HIT** — the roster row recolours at the invite press with nobody there (§2d) |
| the constraint it forgot | **HIT** — R6 law 22 / law-probe L6 reds unannounced (§2b) |
| AA · filterBudget · M16 · W2 mechanics | all clear, re-measured: 0/144 under 4.5 on four grounds; budget rows sum to 9; copy register GREEN with zero strings minted; W2's dock/tab/tag untouched |

## 5 · The exact open gaps

1. `check-peer-arcs.mjs` re-derives its own walk instead of running `playerIdentity.inkFor`, so a
   change to `STEP`, `hueAt` or the chroma cap passes it green — proved by mutation (`STEP = 0.5`
   → gate exit 0 while every hand sits inside crayon-rose's arc).
2. The R6 law probe's π row L6 goes RED on this tree (`BROKEN: L6`, exit 1) and neither the
   README nor the return names it; law 22's text and L6's assertion must be re-cut in the same
   change that lands the walk.
3. Peer-vs-token distance is unmeasured in ΔE: hand 1 sits 0.0315 from `--color-solver-ink-4`,
   below the family's own "indistinguishable" reference, so "never mistakable for the machine" is
   asserted in degrees and unproven in perception.
4. The state `roomId !== null` with an empty roster is unprobed: measured here, the roster row
   takes the walk ink at the invite press while the board keeps the solo blue and no join trace
   exists to explain the change.
5. Mean painted chroma 0.1139 is under §1.2's own 0.125 trigger, so the fallback has fired and is
   priced (0.1243 / 0.1416) but not built, and the family's "richer" claim is +0.004 over HEAD.
6. The painted room is 7 at the 12° floor while the landed unit test asserts eight on requested
   hues — the estate would carry a green test whose sentence the family's README calls wrong.
7. No gate asserts the room-level invariant that no two known ids share an ink string, which is
   the failure `inkAgreed` can now produce when a page publishes as epoch author before adopting.
8. The two-author `inkAgreed` race is undriven by any probe, and its stated cost (a third peer's
   index diverging) understates the reachable one (two rows in one colour on one page).
9. The proposed solo-fingerprint regression gate reads `glyphStroke` off a puzzle-dependent cell
   and returned two different values for the same field across my runs.
10. No frame shows the 0.80 ring on a real board, in either theme, and no frame is dark.
11. The ring at 0.80 / width 4 against the focus ring at 0.90 / width 7 is unmeasured as a
    distinction, though the change narrows it.
12. The 0.5° hue-exactness gate is unmeetable (the 8-bit round trip alone is 0.72–0.96°) and must
    be retired in favour of the painted-law gate before anything is graded against it.
13. Dark was read by toggling `.dark` on the probe rather than through the product's theme verb,
    and no P3 / wide-gamut arm exists, so the ceilings are the sRGB ceilings by construction.
14. The relay arm is untested — every reading is `?wire=local`.

## 6 · Verdict

**ADVANCE**, with the palette axis adjudicated against PAL-TIN in ΔE rather than degrees, and
with §5.1–5.4 closed before pass 2 claims anything above 80%. This is not a rewording (a real
mechanism, a real gate, a real product diff, 810/810 and vue-tsc 0) and it does not violate a
standing constraint outright — L6 is an amendment to book, not a law broken in substance. But
the family's own best measurement, ΔE, is the one that undercuts it: at the chroma the gamut
allows, the arcs keep three to four hands apart where the incumbent full-circle walk keeps five,
and the hands sit closer to the house's reserved inks than the family's own indistinguishability
reference. If the owner's "16+ within reason" binds on distinguishability, this family yields
the palette and what survives is the four separable wins below.

## 7 · Cross-pollination

- The per-hue sRGB gamut ceiling (`chromaAt`, ~30 LOC memoised) belongs to ANY palette family:
  asking for chroma the gamut cannot hold rotates hue silently, which is a class bug, not a
  PAL-WALK bug.
- The peer cursor ring at 0.80 (2.31 → 3.67, 1.4.11 cleared for all 144) is palette-independent
  and should land whoever wins.
- `inkAgreed` — "an index is agreed once it has been on the wire, and only the epoch's author
  speaks for the room" — is an identity invariant every PLR-* family needs the moment self is
  inked; so is the missing "no two rows share an ink" gate.
- The method — build in floating point, measure on the engine's painted bytes, and let the
  8-bit round trip set the margin — is the wave's most transferable finding, and every family
  that reasons about colour in W7 should inherit it.
- ΔE over painted bytes as the currency for "can a reader tell these apart" should replace hue
  degrees in every W7 colour argument, including PAL-TIN's.
