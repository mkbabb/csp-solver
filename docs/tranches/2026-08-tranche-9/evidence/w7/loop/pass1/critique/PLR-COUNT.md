# PASS-1 CRITIQUE · PLR-COUNT · The tally

Adversarial, non-author. Read the spec (`../synthesize/PLR-COUNT.md`), read the whole diff in
`.claude/worktrees/wf_e58b4764-0fc-47`, looked at the prototype's frames, and re-ran the
family's own measurements on my own rig: the worktree served at `127.0.0.1:4240`
(`--strictPort`, the 4230–4249 band; 4242 was free at the scan and taken by the time I used
it, so HEAD could not be served for a side-by-side), a scratch Playwright config of my own,
chromium AND webkit, no estate config, no osascript. Probes and raw data:
`/private/tmp/…/scratchpad/crit-plrcount/`; the load-bearing bytes are banked beside this file
under `PLR-COUNT/{frames,data}`.

**Verdict: ADVANCE. Convergence 62%.** The COUNT is proven — I reproduced it to the byte. The
ATTRIBUTION is not, the family says so itself, and three defects the family did not report are
sitting on the surface it shipped.

---

## 1 · What I re-measured, and what it says

| what | my number | the prototype's | agrees |
|---|---|---|---|
| painted runs, N=3 / N=6, light, chromium | 3 / 6 | 3 / 6 | ✓ |
| painted runs, N=6, light + dark, webkit | 6 / 6 | 6 | ✓ |
| intra gap · chunk gap (device px, dpr 3) | 20–24 · 52–54 | 19–24 · 52–54 | ✓ |
| worst stroke contrast, light, painted core vs ground | **4.537** (self blue) | 4.537 | ✓ |
| worst stroke contrast, dark | **6.901** | 6.901 | ✓ |
| solo graphite | 12.479 | 12.479 | ✓ |
| min PAINTED pairwise hue separation, N=6 | **12.7° wk / 13.3° cr** light, 19.7–20.4° dark | 12.7–13.3 / 19.7–20.4 | ✓ |
| mark box width N=1…6 (phone coarse) | 44 / 44 / 51.66 / 62.28 / 72.92 / **94.2** | same | ✓ |
| filter census, tally boiling + sheet open | **9** desk, **9** phone, both engines | 9 | ✓ |
| @mbabb trigger, before and after people arrive | (0,0) 75.53 × 44, unmoved | unmoved | ✓ |
| `check-copy-register` · `check-theme-tokens` · `check-live-regions` · `check-motion-contract` in the worktree | 0 unadmitted · 0 unreferenced · 0 born speaking · 34/34 | — | ✓ |

The prototype's numbers are honest. Where it reported a gap, the gap is real and its size is
right. Nothing below disputes a figure; everything below is something the figures do not cover.

## 2 · Three defects the prototype did not report

### 2.1 THE DESK REGISTER AND THE @mbabb CARD OPEN ON ONE ANCHOR, IN ONE BOX (both engines)

The `#mark` slot lands **inside** `AttributionCard`'s root div — the div that carries
`@mouseenter="onHoverEnter"`. So at a fine pointer, hovering the tally opens the ATTRIBUTION
card. Measured, chromium and webkit, desk 1280:

```
before   card {opacity 0, visibility hidden}                 trigger aria-expanded=false
hover    card (0, 51.75) 256 × 151   opacity 1  z 50         trigger aria-expanded=true
press    card (0, 51.75) 256 × 151   +  lobby (0, 51.75) 256 × 153.33   both opacity 1, both z 50
```

Two popovers, the same anchor, the same width, 2.3px apart in height, both `z-index: 50` — and
the card is later in DOM, so the card paints over the register. `elementFromPoint` at a
register row returns `img.h-10 w-10 rounded-full`: the @mbabb avatar. The frame is banked at
`PLR-COUNT/frames/desk-two-popovers-chromium.png` — "3 other pl…", "bare-barnacle" and
"national-falcon" bleeding out from under a business card.

This is the **unverified-gestalt** row exactly. The prototype's eight crops are: the phone head
strip, one 1280 dark crop of the MARK, and two phone register crops. **The desk register with
the sheet open was never screenshotted**, and it is the one state a desk reader will be in. The
delta note even says the press/hover fight was "measured" — the half that was measured was
`useHoverCard` inside `PlayerTally`; the half that was not is that the mark now lives inside
somebody else's hover region.

### 2.2 THE 7→6 RETURN TWEENS, AND THE MOTION TABLE SAYS IT DOES NOT

Spec §5: `6 → 7 and 7 → 6 | same-frame swap | none`. Code: `watch(drawn, (now, was) => { if (now
> was) drawIn(…) })`, and at seven people `drawn` is **0**. One person leaves, `drawn` goes
0 → 6, `now > was`, and **all six strokes re-draw from zero on the 90ms stagger**. Sampled off
the live page, both engines:

```
t=2ms    ['27.5','74.8','100','100','100','100']
t=199    ['0.10','4.60','23.3','66.4','100','100']
t=552    ['0','0','0','0','0.12','4.79']      ← still drawing, ~600ms in
```

Two things break at once: a pixel the family declared it would not move (the pi row), and the
code's own law — `useTallyStrokes`'s comment says "a tally is a SET: re-arming one member must
not un-draw another", and this path re-arms every member for a departure. `settle` exists and is
the one-line cure; nobody called it on the downward crossing.

### 2.3 THE DRAWN NUMBER AND THE SPOKEN NUMBER DISAGREE BY ONE

Measured at the mark, both engines: N=7 → glyph `7`, `aria-label` "6 other players"; N=12 →
glyph `12`, `aria-label` "11 other players". A sighted reader reads twelve; a screen-reader
reader hears eleven; the same control says both.

The same seam runs through the register. My own sheet crop at six people reads `5 other players`
over a list whose first row is `skilled-minnow you` and whose last line is `and 2 more`. The
header counts others, the rows count everyone, the compression counts the remainder of
everyone. §0 of the synthesis retired the research's `1 player on this board` for precisely this
("the line and the list disagreed by one") and then shipped the disagreement one layer in.

## 3 · Gates that cannot fail

**G4 board-unbound is vacuous as run, and wrong as written.** The probe drives peers with `hi`
frames only — nobody writes a cell — so "0 `--color-user-ink` bindings in a room" is a
tautology. And the binding it counts is not self's: `useSession.ts:402` `authorInk` binds
`--color-user-ink` on **every cell a PEER authored**, applied at `BoardHost.vue:295`. The moment
a peer writes a digit — the feature's whole point — a room has bindings and this gate REDs on
correct behaviour. My own two-page attempt to land a peer write was inconclusive (my synthetic
keypress did not take), so I report the code path rather than a byte; the gate needs re-aiming
either way: the F1 ruling is *self's* cells bind nothing, and that is what should be counted.

**G10, G11 and the R6 census are "GREEN by construction".** G11 is a fair refactor guard and I
believe it (the literals all survive into `useTallyStrokes`). But R6's hue census reads
CHROMATIC TOKENS OUT OF `index.css`, and `index.css` is not in the diff — so "29 rows unchanged"
was never capable of saying anything about a family whose inks are minted at runtime by
`inkFor(index)`. The census that matters here is the painted one, which the prototype did run,
and which says 12.7°.

## 4 · The constraint nobody measured: the sheet's real ground

The register reuses the @mbabb card's pose "byte-for-byte", which includes
`color-mix(… var(--color-popover) 80%, transparent)`. The card holds two short lines; the
register holds up to six, down the page — and the page carries the `sudoku` wordmark. Read off
my own sheet crops: **inside the sheet's own box the wordmark bleeds through at rgb(204,203,203)
in light and rgb(61,60,59) in dark.** `--ink-press-quiet` paints at rgb(107,107,107); over
rgb(204) that is **≈3.3:1**, under the 4.5 AA asks of small text. The names are graphite and are
safe (≈9:1 even over the bleed). The prototype's sheet contrast numbers are against the modal
ground, which is the paper, not the worst ground a row actually sits on.

## 5 · Checked and clear

- `--color-pencil-graphite` really exists (`index.css:223`), so `var(--color-pencil-graphite,
  var(--grid-line-color))` is the estate's own belt-and-braces, not a **masked fallback**.
- `BOIL_CONFIG.tallyBoil` and `MOTION.tallyStaggerMs` each have two consumers — no
  **consumer-less substrate**.
- `.players-roster` kept `sr-only` + `role="log"` is not a **legacy alias**: a log must stay
  mounted to announce, and the two retired unit rows are re-aimed honestly.
- No **generic default** anywhere near this: the object is the house's own pencil upright.
- Outside-click dismissal works — a click on a board cell shuts the register, both engines, both
  regimes (the two added `closeAll` lines earn themselves).
- Tap floor 44 × 44 coarse; DOM carries two marks and two lobbies (desk + mobile instances) but
  exactly one of each is hit-testable and `getByRole(/player/)` finds exactly **1**.
- `filterBudget` 9 → 9 with the sheet open: the grain really is baked into the pose geometry.

## 6 · The hard part, named by the family itself

The mark's argument is "N inks read as N people". The painted minimum pairwise hue separation is
**12.7–13.3° in light from N=3 onward** — because the F1 ruling puts self at `#2563eb` (h 263)
next to walk index 2 (h 275–276), and index 2 arrives at the third person. The spec's own demand
on PAL-WALK/PAL-TIN is ≥30° for the first six. So the count converges and the attribution does
not, three people in, on the default this family itself chose. That is the elegant-reduction
row, and the family gets credit for finding it, measuring it and handing it over with an index —
but it is not closed, and it cannot be closed inside PLR-COUNT.

## 7 · Smaller, still open

- The tally stands on the head **before any game exists**: at `/` with no board and no room, one
  visible button named `no other players` and a graphite stroke, both engines. Nobody decided
  whether the pre-game head wants a player count.
- `e2e/player-tally.spec.ts` (plan step 7) was not written; the painted-run reader lives only in
  the evidence dir.
- The desk register still runs the phone's five-row budget; no per-regime `ROWS`.
- r0 I2 and I4 crash rather than read (they address the deleted `.player-swatch`); I3's final
  assertion is not strict-safe against the head's two instances. Correctly reported, correctly
  not self-cured.
- The heading census was not re-run; the hover ink lift and the 6→7 same-frame swap are asserted,
  not probed.
- G8 desk-bound: RED, and the owner disposes. The prototype's "no worse than the incumbent
  (+22.88px)" framing under-weights one thing — the incumbent is a HOVER card that leaves when
  you do, and this is a disclosure a reader can leave open over the board while playing.

## 8 · Strengths worth banking whatever happens to the family

1. **The count survives as bytes.** runs == N for 1…6, both engines, both themes, dpr 3,
   reproduced independently here from a clean rig. Gaps 20–24 intra, 52–54 at the chunk. The
   "no diagonal, ever" ruling is earned by the gate-five fusion measurement.
2. **Zero live filters.** 9 → 9 with the tally boiling and the sheet open, in both regimes, on
   both engines — the grain-in-geometry discipline applied to a new surface without a permission.
3. **The extraction is real and guarded.** `DifficultyTally` −123/+15, identical `d` attributes,
   two file-local constants promoted to the config hub with two consumers each.
4. **A live defect found and cured on the surface** (the per-stroke sequence handle: `drawIn`
   used to cancel its neighbours and strand a stroke at reveal 0 — a tally that under-counted the
   room). A spec-only pass ships that.
5. **Honest reporting.** G8's premise re-measured rather than merely failed; the dead instruments
   named; the palette demand handed on with a number and an index.

## 9 · Convergence arithmetic

Earned 62. The object is right and half of it is proven to the byte; against that: one look-level
defect on the desk surface (§2.1), one declared-motion violation (§2.2), one number that reads
two ways (§2.3), one gate that cannot fail (§3), one unmeasured AA ground (§4), one undecided
bound (G8), and the attribution half deferred whole (§6). 100 is impossible here regardless of
cures: the family's memorable thing depends on a palette it does not own.
