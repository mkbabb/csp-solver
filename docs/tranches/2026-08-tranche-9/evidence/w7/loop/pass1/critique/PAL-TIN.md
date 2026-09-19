# PAL-TIN — PASS-1 ADVERSARIAL CRITIQUE

Family: **PAL-TIN (The tin)** · T9-W7 design loop, pass 1 · critic did not write the spec,
the plan, or the prototype.

**Verdict: ADVANCE · convergence 72% (earned, not granted).**

A running prototype on the real surface, both engines, with most of its headline numbers
re-derived here independently rather than read off its own probe. One measured correctness
defect in the landed rider, one gate whose family law measures a quantity its own sibling
gate argues is the wrong one, two spec numbers that are wrong on this tree, and a handful of
smaller open gaps. None of them is a missing primitive, so the family does not BLOCK; none of
them is a rewording or a constraint violation, so it does not RETIRE.

---

## 1. WHAT I RE-RAN MYSELF

Own dev server on the prototype worktree: `npx vite --host 127.0.0.1 --port 4248
--strictPort` (4245/4246/4247 were taken by concurrent lanes). Own scratch Playwright config,
chromium + webkit, `screenshot: off`. HEAD served separately on 4244 for the pi census and
stopped afterwards. No product file touched; the worktree diff read, never edited.

| # | claim | my reading | agrees with the prototype |
|---|---|---|---|
| G1 | `check-peer-tin.mjs` run BARE on the landed tokens | exit **0** — gate 1 nearest anchor 13.3deg, gate 2 worst pair ΔE 0.139, gate 3 GREEN | yes |
| G2 | AA, five sticks × four grounds, own WCAG arithmetic off the product CSS | light worst **4.545** (teal on background), dark worst **8.679** (pink on card); min pairwise ΔE **0.145 / 0.139**; mean chroma **0.142 / 0.144** | yes |
| G3 | ring at its drawn opacity | live rule reads `stroke-opacity: 0.8` on `.cell-ghost-path`, both engines | yes |
| G4 | solo regression | 0 `.glyph-tick`, 0 `.roster-tick`, `--color-user-ink #2563eb`, glyph stroke `rgb(10,10,10)`, both engines | yes |
| G5 | the roster at sixteen, product component, product presence path | 16 rows · **5** distinct painted swatches · **11** rows with a tick · row 18.95px · every tick box inside its row's line box, both engines | yes |
| G6 | the tick under a digit, 9×9 | 1 stroke, height **12.05%** of a 70.66px cell, band **84.97 → 97.02%** (inside the lower 17.5%), **zero** overlap with the glyph box, stroke `rgb(90,97,206)` = `--color-peer-4` for index 8, both engines | yes |
| G7 | print + forced colours | print: tick `rgb(0,0,0)`, digit `rgb(0,0,0)`; forced-colors: tick `rgb(0,0,0)` (CanvasText), both engines | yes |
| G8 | pi on unclaimed surfaces — **proto (4248) vs HEAD (4244)**, rect for rect | card / action-bar / logo / first cell / last cell deltas **0.00 on every component**, cells 81=81, glyph paths 62=62, url()-filter elements 24=24, both engines | yes |
| G9 | M16 | `check-copy-register.mjs` exit **0** (no copy minted) | yes |
| G10 | the dead-code lane the prototype left unmeasured | `npx knip` exit **0**, clean — and `--peer-ink-l` has **zero** references left anywhere in `web/` | **gap closed by this critique** |
| G11 | the four re-pinned unit files | 4 files / 70 tests pass | yes |

One rig note: C2 (the sixteen-person roster) failed once on webkit at the room-open step and
passed on the rerun. The 16-peer BroadcastChannel rig is timing-fragile; that is the rig, not
the product.

---

## 2. THE DEFECT I FOUND BY MEASURING (the one that matters)

**The rider's agreement set is populated by adopting a snapshot from ANY page, not only from
the epoch's author — so a joiner can freeze an index the author disagrees with, and the room
never converges on that player's colour.**

The product answers a newcomer's `hi` from the LOWEST id present
(`useSession.ts:733 holdsTheBoard`), which need not be the page that dealt the board. That
answer carries the CURRENT epoch stamp and the answerer's OWN `inkIndex`. On the receiving
side `adoptInk` (`useSession.ts:589-604`) writes every id in that `k` into `inkAgreed`
unconditionally, and an agreed index is thereafter kept against every later `k` — including
the true epoch author's.

Measured, both engines (`c5-divergence-*.json`):

1. joiner arrives at the room by link (epoch `[0, ""]`, nothing agreed);
2. a page that is NOT the epoch's author relays the author's board with `k[self] = 7` —
   joiner paints itself **teal `rgb(0,128,134)` + 1 tick**;
3. the true author deals a newer board saying `k[self] = 3` (violet, no tick) — joiner stays
   **teal + 1 tick**, permanently.

So the family's own instrument I2 ("own swatch is the room's colour") is RED in a reachable
three-page state; the prototype's I2/I4 rig is two real pages plus a sixteen-peer rig that
deliberately hands the page the lowest id (`zz…` peers), so the answerer is ALWAYS the epoch
author and this path is never exercised. At HEAD the last-heard `k` always won, so the room
converged at the cost of a hue jump — the rider trades a visible jump for a permanent
disagreement, which is worse in a five-ink tin than in a 40-hue walk, because the two
players who now disagree are two people in one pencil.

The cure is one condition, in the family's own vocabulary: agree on adoption only when the
sender IS the epoch's author (`from === d.ea`), keeping the publish-side rule the prototype
already got right. The unit harness to prove it exists (`useSession.test.ts` `bootPage` /
`p.hear`), and the existing adoption unit hides the hole because its `st` is sent by the same
id it names as `ea`.

---

## 3. THE GATE'S FAMILY LAW MEASURES THE WRONG QUANTITY

`check-peer-tin.mjs` argues, correctly and in its own header, that hue degrees do not measure
whether two marks look like two marks — that is why gate 2 exists in ΔE. It then keeps hue
degrees as the whole of gate 1, the law that separates a player's pencil from the 29 reserved
inks. Measured here on the landed tokens (`near.mjs`, my own arithmetic, light arm):

| stick | nearest reserved ink | hue gap | **ΔE** |
|---|---|---|---|
| peer-1 `#b24f00` | `--color-orange-ink` | 15.8deg | **0.046** |
| peer-2 `#5f7d00` | `--color-green-ink` | 22.6deg | **0.059** |
| peer-3 `#008086` | `--color-solver-ink-4` | 35.0deg | **0.071** |
| peer-4 `#5a61ce` | `--color-user-ink` | 13.7deg | **0.067** |
| peer-5 `#a5439a` | `--color-solver-ink-1` | 26.8deg | **0.088** |

Every stick sits closer to a reserved ink than the 0.10 floor the tin holds its own members
to, and the solver rainbow is BOARD CONTENT (law 20) — a revealed digit and a player's digit
share the grid. The family law passes in the metric the family itself calls insufficient.
This is inherited from the 12deg incumbent rather than invented here, but PAL-TIN is the
family that MINTS the gate, so the metric is its choice now.

Related, smaller: the `--self-test` negative control exercises gate 2 only. Gates 1 and 3 are
never shown failing, in a file whose own header says a gate that cannot be shown failing is
not a gate.

---

## 4. NUMBERS THAT ARE WRONG IN THE SPEC

- "every stick ≥ **13.5°** from all 29 reserved inks" — it is **13.34°** (violet vs
  `--color-user-ink`), by the gate's own print and by my independent census. The gate's floor
  is 12, so nothing fails; the cited margin is overstated.
- "**mean** chroma 0.142" is a mean over a set whose minimum is **0.093** (light teal) — lower
  than the 0.11 chroma of the walk it replaces. The mean hides the one stick that got quieter.
- "phone row **19px**" — the prototype already caught this: the phone row is 16.42px, desk
  18.95px. Confirmed here at 18.95 desk.

---

## 5. THINGS DRAWN THAT THE SPEC DID NOT DECLARE

- **Your own digits carry your own ticks.** `authorLap` has no self exclusion, so a 6th+
  player's own board is tally-marked for them. §1.5 declares only that your digits take your
  stick.
- **The roster tick lands at the row's right edge**, not after the slug: `.player-name` grows
  in the row's flex. The prototype names this as a deviation; looked at in
  `roster-sixteen-light.png` it reads as a right-aligned tally column, which weakens
  "the same mark BESIDE the name" — the legend claim depends on a reader connecting a mark at
  the right margin with a mark under a digit.
- **A stale product comment still cites the dead walk**: `HandDrawnGrid.vue:601` — "`inkFor`
  walks the golden angle and index 2 lands at 275deg, a hand's breadth from
  `--color-progress-ink`". Under the tin, index 2 is teal at h 200.4. The comment justifies a
  landed decision (the offset retrace) with an argument that is now false, and the hazard it
  names (a peer ring fusing with the progress ink) is not re-derived for the tin — violet sits
  16.1deg / ΔE 0.097 from `--color-progress-ink` in light, 16.8deg in dark.

---

## 6. GESTALT, LOOKED AT

I looked at all four frames rather than taking the assertion.

- `two-cells-amber-and-tick-light.png` — the tick under a **1** reads as part of the numeral:
  same ink, same hand, directly below the stem. Under the **9** it is unambiguous. The digits
  most confusable with a single upright (1, 4, 7) are exactly the case the frames show and
  nothing measures.
- `tick-16x16-dark.png` — clean, legible, in family.
- `tick-16x16-phone-dpr3.png` — the hairline case the prototype is honest about: present, in
  band, about two device pixels wide, lighter than the grid rule beside it.
- `roster-sixteen-light.png` — the ticks read as a tally column at the right margin (see §5).

The owner's §5 questions ("does the sixth player carrying a tick read as a system or a bug")
are untouched by any of this and are U-10's to settle.

---

## 7. FAILURE-MODE CHECKLIST

| item | verdict |
|---|---|
| vacuous convergence | **clear** — every gate is born-RED at HEAD and the tin gate prints a falsifiable number |
| spec-cites-itself | **clear** — the gate reads the PRODUCT `index.css`, not the spec |
| gates that cannot fail | **HIT (partial)** — gates 1 and 3 have no negative control; gate 1's metric is the one the file itself argues against (§3) |
| the elegant-reduction trap | **HIT (small)** — "stroke 3% of cell width (min 1px)" has no implementation and cannot have one in user units; the hard part is deferred to a sanctioned fallback |
| legacy aliases | **clear** — `--peer-ink-l` is gone with zero references, knip clean |
| masked fallbacks | **HIT (small)** — `lap > 5` holds at five by `Math.min` with nothing measuring it; the roster-only fallback at 16×16 phone is asserted, not demonstrated on a device |
| unverified gestalt | **HIT (partial)** — screenshotted on the real surface both engines, but the readability of one upright under 1/4/7, and the right-margin tally column, are asserted |
| consumer-less substrate | **clear** — all ten tokens are named literally in `TIN`, both homes consume `PlayerTick` |
| the generic default | **clear** — no cream/serif/terracotta, no eyebrow, no card; the mark is the house's own gate-five tally in the house's own wobble |
| the pixel it did not declare | **HIT (small)** — self's own ticks (§5); pi otherwise 0.00 on every unclaimed rect, measured against HEAD |
| the constraint it forgot | **HIT** — AA holds (4.545 / 8.679 measured), M16 holds, census holds, W2's mechanics untouched, BUT laws 22 and 23 are knowingly re-litigated (said so, owner ballot) and law 21's "the three ink families never compete" is true only in degrees, not in ΔE (§3) |
| correctness | **HIT (the big one)** — §2, a measured permanent divergence |

---

## 8. STRENGTHS

- The whole claim is measured rather than argued, and the two things measurement CHANGED (the
  ink must be a presentation attribute or forced colours keeps the player's hue; agreement
  must key on the epoch author) are in the diff with their reasoning in the code.
- Born-RED gate that reads the product and carries its own negative control for the law it is
  really about.
- Solo is byte-identical by construction and by measurement: nothing mounts, nothing binds.
- pi 0.00 on every unclaimed rect against HEAD, both engines, verified here independently.
- One component, two homes: the roster row is the legend, so nothing has to be said — the
  cheapest possible answer to M16 and to law 30's ransom note.
- The tally stagger hoisted to `pencilConfig` leaves net-zero timing literals (law 4).

## 9. CROSS-POLLINATION

1. **Ink as a presentation attribute, never a scoped declaration** — an unlayered scoped SFC
   rule outranks `@layer base`, so print/forced-colours rules silently lose. Every W7 family
   that draws a coloured mark inherits this.
2. **The gate shape**: read the PRODUCT stylesheet, re-derive the number, ship a `--self-test`
   negative control, run BARE. Reusable by any family minting a palette or a law.
3. **The un-widened negative control** — proving a selector is load-bearing by running the
   page without it.
4. **Same-port server swap for pi** — swap HEAD and the prototype behind one port and diff the
   rects; cheap, and it removes the port as a variable.
5. **Agreement keys on the epoch's author** — a wire rule every family adding per-player
   shared state needs, with a unit harness (`bootPage` / `hear`) already in the tree.
6. **A drawn mark in two homes instead of a sentence** — the legend-without-copy idiom, for
   NOTE-LEDGER and PLR-COUNT.

---

## 10. OPEN GAPS (each closable)

1. `adoptInk` marks an index agreed no matter who sent the `st`; gate agreement on
   `from === d.ea` (the epoch's author) and prove it with a unit that adopts from a non-author
   then hears the author.
2. The three-page room — where the page that answers a newcomer's `hi` is not the epoch's
   author — is unmeasured; the sixteen-peer rig hands the page the lowest id by construction.
3. Gate 1 asserts hue degrees against the reserved inks while every stick sits ΔE 0.046–0.088
   from one of them; re-cut it in ΔE against the inks a player's mark shares a surface with,
   or defend the two metrics.
4. Gates 1 and 3 have no negative control in `--self-test`.
5. The spec's "≥ 13.5deg" is 13.34deg and its "mean chroma 0.142" hides a 0.093 stick; re-cut
   both numbers at their citation.
6. "stroke 3% of cell width (min 1px)" is not implemented and cannot be in user units — at
   16×16 on a phone the mark is 0.68px CSS; either take the sanctioned roster-only fallback in
   the spec text or plumb `vector-effect: non-scaling-stroke` with a cell-size property.
7. Whether one upright under a 1, a 4 or a 7 reads as a mark or as part of the numeral is
   unmeasured, and the frames show exactly that case.
8. §1.4's "swatch · slug · tick(s) · you" is not what is drawn (the tick lands at the row's
   right edge); either cure with `flex: 0 1 auto` on `.player-name` or re-cut the dot-list.
9. The spec never says whether your OWN digits carry your own ticks; the code draws them.
10. `lap > 5` (the 26th player) is held at five by construction and touched by no measurement.
11. `HandDrawnGrid.vue:601` still justifies the offset retrace with the dead golden-angle walk,
    and the ring-fusing hazard it names is not re-derived for violet (16.1deg / ΔE 0.097 from
    `--color-progress-ink`).
12. The roster tick's seed is `p.id.length`, so most rows wobble alike — cosmetic, named,
    uncured.
13. `hue-census.mjs` still prints the dead `hue = i × 137.5` tail from a hardcoded literal.
14. AA and ring contrast are composited arithmetic over live values, not sampled off painted
    pixels; no screenshot-sampled ring reading exists in either lane.
15. No real device: 390×844 at dpr3 in two desktop engines is the whole phone claim (W8's
    owner-run iOS pass is where a device lives).
16. Owner ballots stand: law 22's formula half, law 23's zero-new-hexes exception, and whether
    the sixth player's tick reads as a system or a bug. U-10.

Gap the prototype named and this critique CLOSES: `lint:knip` — run here, exit 0, and
`--peer-ink-l` has no residue anywhere in `web/`.

---

Evidence from this lane: `/private/tmp/.../scratchpad/critique/` (readings `c1`–`c5`, `pi-*`,
own `aa.mjs` / `near.mjs` arithmetic). Prototype server left up on 127.0.0.1:4248; the HEAD
server on 4244 was stopped.
