# PAL-WALK — the walk, the ring pressed harder, and the ring given words · pass-3 PROTOTYPE

Built and measured on the real surface, both engines, 2026-09-19. Worktree
`.claude/worktrees/wf_308fa864-c94-1`, branch `worktree-wf_308fa864-c94-1`, off **`74a2b5d9`**
(the W7 execution fold), uncommitted diff — 14 modified, 2 new. Prototype server
127.0.0.1:4244, HEAD control 127.0.0.1:4247 serving **`74a2b5d9`**, both with private vite
`cacheDir`s, both killed; the 4230–4249 band reads empty. Probe sources in `probe/`, the two
r0 instruments in `instruments/`, numbers in `readings/`, four crops in `frames/`.

## What the replay carried, and by which route

`git` aimed at the pass-2 worktree is refused by this session's isolation, so the chair's
declared fallback was taken: the pass-2 delta was re-derived by extracting `a8fee1f5` with
`git archive` into a scratch tree, diffing it against `wf_8630d340-e56-59` file by file, and
COPYING the twelve that differed. The list is 10 modified + 2 new, not the brief's 11 + 2 — the
twelfth was `e2e/visual-golden.spec.ts-snapshots/`, a generated directory, not a source file.

**Zero intersection with the fold, verified rather than assumed**: every one of the ten
modified files reads byte-identical at `a8fee1f5` and at `74a2b5d9`, so the copy IS the pass-2
delta. Carried: the arcs constant, the arclength walk with `intoArc`, `chromaAt`, the wire rule
(`adoptInk(k, from === e[1])`, `fresh` before the epoch write), `bindSelfInk`, the solo-era
stamp, `lint:arcs`, tier 1, tier 3, U1–U3. **Dropped, as the brief directs:** pass 2's
`gameCell.css` hunk (α 0.80). `vue-tsc -b` exited 0 on the replayed tree before any pass-3 edit.

## The numbers, painted

`readings/tier3-both-engines.txt`, `e2e/peer-walk.spec.ts`, dpr 3, chromium + webkit.

| row | light (band 0.44) | dark (band 0.65) | synthesis said |
|---|---|---|---|
| ring alpha / fill / width, READ OFF THE CASCADE | 0.55 / 0.04 / 4 | 0.55 / 0.04 / 4 | 0.55 / 0.04 ✓ |
| nearest house ink, worst of 144 | **0.0716** at i=112 | **0.0709** at i=0 | 0.0716 / 0.0709 ✓ |
| crayon reference, RE-DERIVED in the run | **0.076410** | **0.060481** | 0.076410 / 0.060481 ✓ |
| hands under it | **5/144 = 0.0347** | **0/144** | 5 / (dark not predicted) |
| the house crowds ITSELF | 78.9% of 19 tokens | 10.5% of 19 tokens | the ratio's ceiling |
| AA background / card | **7.098 / 7.270** | **5.310 / 5.197** | 7.110 / 5.210 ✓ |
| AA popover / selection wash | 7.164 / 6.687 (wk 6.730) | 5.270 / 4.708 (wk 4.614) | — |
| AA **tape** (`--sheet-washi-neutral`), REPORTED | 6.321 | **2.813** | HEAD's own is 4.232 dark |
| AA **laminate** (15% teacher-red on card), REPORTED | 5.861 | 4.310 (wk 4.306) | HEAD's own is 4.403 dark |
| AA accent, watched | 6.839 | 4.188 | 4.19 ✓ |
| **ring, token arithmetic, shipped band** | **3.158** at i=6 | **3.430** at i=5 (wk 3.450 at i=107) | 3.165 / 3.409 |
| ring, alternate band 0.34 / 0.77 | **3.000** at i=6 (wk 3.034) | 3.267 at i=102 (wk 3.272) | 3.051 / 3.219 |
| ring on `--color-popover` (the phone) | 3.111 | 3.438 (wk 3.472) | never priced before |
| min ring chroma, shipped band | **0.0544** | 0.0545 (wk 0.0543) | 0.0546 ✓ |
| collisions over the first 16 / 24 / 40 | 0 / 0 / 0 | 0 / 0 / 0 | 0 ✓ |
| capacity N=2/3/4/5/8/16 | 0.2527 / 0.0758 / 0.0758 / 0.0264 / 0.0229 / 0.0084 | 0.2532 / 0.0762 / 0.0762 / 0.0268 / 0.0226 / 0.0090 | exact ✓ |

**THE RING, PHOTOGRAPHED** (`isTheRing`, five hands per arm per band, both engines, dpr 3 — the
sampler scans perpendicular from the path's own bounding box and verifies its median against
what the cascade says the stroke composites to):

| arm · band | i=0 | i=5 | i=6 | i=38 (the floor hand) | i=112 | Δ to computed |
|---|---|---|---|---|---|---|
| light · **0.32 shipped** | 3.596 | 3.681 | **3.158** | 3.231 | 3.275 | 0.0–1.0 |
| light · 0.34 alternate | 3.431 | 3.459 | **3.035** | 3.088 | 3.148 | 0.0–1.7 |
| dark · **0.79 shipped** | 3.475 | 3.485 | 3.690 | 3.688 | 3.590 | 0.0 |
| dark · 0.77 alternate | 3.332 | — | — | — | — | 0.0 |

**The pin rule ran, and it picked.** Lightest light arm / darkest dark arm clearing 3.0 PAINTED
with ≥ 0.10 headroom: 0.34 paints **3.035** worst (headroom 0.035 — REFUSED), 0.32 paints
**3.158** (headroom 0.158 — taken). Dark: 0.77 clears, 0.79 clears with more, and 0.79 is the
darker arm, so 0.79. The shipped band is `0.32 / 0.79` and it was chosen by the rule, not
asserted into place.

**ACC-FIVE's painted-line law does NOT bite here, and the return says so.** The measured Δ from
the sampled stroke to the computed composite is **0.0–1.7 of 255** across forty photographs —
at dpr 3 a 4-user-unit stroke renders 1.89 CSS px wide, and its centreline reaches its token.
The over-report ACC-FIVE measured is a property of thin/1px lines, and the ring is not one. The
band still carries its headroom because the rule demanded it, not because the shortfall was
real.

**The opacity axis alone, for §6** (`alphaOnly`, measured): with no ring band, α must reach
**0.63 light and 0.70 dark** (webkit 0.69 dark) for all 144 to clear 3:1; at 0.65 the light arm
is already clear and **57 of 144 dark hands are under**. The synthesis predicted 0.69 for both;
the light arm is cheaper and the dark arm is 0.70, one hundredth dearer. With the ring band,
0.55 survives and `join-language-prm.spec.ts:153` is untouched and green.

**The LEDGER row this family books.** At α 0.55 with `--peer-ring-l` reverted to the digit's own
band, the light arm reads **2.517 arithmetic / 2.752 painted**, worst of 144 — RED, and the gate
names it (`readings/born-red.txt` row A). That is the regression the tranche would have shipped;
the band closes it. (The synthesis predicted 2.264 light at HEAD's own `--peer-ink-l` 0.5/0.8 —
this tree carries pass 2's 0.44/0.65, so the reverted number is 2.517, not 2.264. Stated, not
smoothed.)

## The gate, tiered, and every control fired

`readings/born-red.txt` (rounds 2 and 3), `readings/tier1-self-test.txt`,
`readings/pass2-gate-control.txt`.

| row | at HEAD / under control | after | control |
|---|---|---|---|
| tier 1 bare | — | **exit 0** — 35 resolved chromatic declarations → the same 6 arcs | — |
| tier 1 `--self-test` | — | **exit 0** | moved hex REDS · a rename is BLIND · a renamed token still RESERVES · a re-pointed alias REDS · **an hsl chromatic REDS** · **@media print stays quiet** · the decoy reds on an empty complement |
| tier 2 · the ring key | **RED** (one-key `inkFor` → 1 unit + 2 BoardHost rows) | GREEN | single-key `inkFor` |
| tier 2 · `STEP = 0.5` | **RED** (2 units) | GREEN | the capacity row is what a broken step destroys |
| U1 / U5 | **RED** | GREEN | `adoptInk(k, false)` — nothing is ever AGREED |
| U3 | **RED** | GREEN | the re-seat loop's ten lines deleted |
| U7 / U8 | **RED** | GREEN | `mint` stops gating the solo page on the room |
| U6 / U8 | **RED** | GREEN | the solo-era stamp deleted |
| the DECLARED accessor | **RED at the type** | GREEN | `writtenPositions?:` made optional again |
| tier 3 · the ring painted | **RED 2.752 light** | GREEN ≥ 3.158 | `--peer-ring-l` reverted to the digit's band |
| the copy gate reads the clause | **RED, 1 unadmitted** | GREEN | the clause made to say `cursor` |
| U2 / U4 | GREEN, kept as guards | GREEN | — |

**Round 2 corrected round 1, and both are banked.** Round 1 reported three GREENs that were
CONTROLS aimed at the wrong branch, not gates failing: `adoptInk(k, true)` cannot move an index
the first frame already agreed, and `bindSelfInk` is not what gates a solo page (`mint` is).
Re-aimed in round 3, every branch reds. The battery verifies each substitution landed before it
believes a verdict — round 1's `writtenPositions` control silently failed to match because
prettier had wrapped the line.

**The tier-1 census's own finding, stated honestly.** The resolved rule counts **35** chromatic
declarations where the hex-only rule counted 29. The six are all `var()` aliases —
`--color-teacher-red`, `--color-gold-star` and the four `*-ink` aliases in the dark arm — and
every one resolves onto a hue its own crayon already reserves, which is why the arcs are
unchanged and why the old count was wrong without being visibly wrong. Of the four new controls,
the **hsl chromatic** is the one the pass-2 gate is genuinely blind to (measured: it counts 29
either way and reds nothing), and the **print exclusion** is where the pass-2 gate was wrong in
the other direction (a chromatic planted in `@media print` reserved a screen arc). The
re-pointed-alias control reds under both gates, because the doctored declaration carries a hex;
that is said in the gate's own comment rather than claimed as a discriminator.

## π, and the surfaces this family does not claim

`readings/pi-and-r2.txt`. The two servers each deal their own puzzle, so the first census
compared two different boards and reported 60 DOM keys on one side only; the instrument was
re-cut to pin ONE board on both trees (`?board=` permalink) and to skip SVG geometry (a path's
`className` is an `SVGAnimatedString` that buckets every path on the page, and glyph geometry is
the dealt puzzle's, not a layout fact).

**Worst |Δ| 0.00px over 404 rects, chromium and webkit, light and dark, 0 keys on one side
only**, against the HEAD control at `74a2b5d9`. A solo page binds no player ink at all, and
nothing in this diff moves a rect.

## Censuses and the estate

| census | reading |
|---|---|
| `vue-tsc -b` · `vue-tsc -p tsconfig.e2e.json` | 0 · 0 |
| vitest, whole battery | **68 files / 844 tests, 0 failed** (`readings/vitest-full.txt`) |
| `check-peer-arcs --self-test` | 0, eight self-test rows |
| `check-copy-register` · `--self-test` | 0 · 0 — **lexicon 26**, 0 admissions |
| `check-motion-contract` (PRM on the new spec) · `check-pw-projects` | 0 · 0 |
| `check-theme-tokens` · `check-theme-selectors` · `check-ink-pressure` · `check-empty-catch` | 0 |
| knip · eslint (`src scripts e2e`) · prettier (`src scripts`) | 0 · 0 · 0 |
| r0 law probe, L6 re-cut | **GREEN**, hex literals 0, `--peer-ink-l` arms 2 |
| r2 accent-kinship, copied and re-pointed | peer worst over 40 on the card **7.27** (floor 4.5); rainbow 5.29–6.21 |

## MOVED r0 rows

1. **R6 law 22 / law-probe L6** (`instruments/law-probe.L6-recut.mjs`) — pass 2's re-cut, re-run
   at this tree: GREEN, and the module still mints no hex. Law 21's cite moves from
   `index.css:154-161` to the block at **`:153-194`** (the `--peer-ink-l` comment, the token, and
   the new `--peer-ring-l` comment and token), with the dark arm at `:386-415`.
2. **r2 `accent-kinship.probe.ts`** (`instruments/accent-kinship.probe.MOVED.ts`) — COPIED, `OUT`
   re-pointed into this lane's `readings/`, and a **PROPOSED** diff adds the tape ground
   (`--sheet-washi-neutral`) to its collection. **The proposed row does not work yet and says so:
   it reads 7.27, identical to the card, because the tape is a `color-mix()` and the probe's
   `parseCss` cannot resolve one — it falls back to the card.** The honest tape number is tier
   3's, which paints it through a canvas: **6.321 light / 2.813 dark**. The proposed diff needs a
   `getComputedStyle` read off a node that wears the tape, and that is the fix the row carries.
3. **r0's R2 born-RED row is stale by the FOLD's hand, not this lane's.** `law-probe` still reds
   "the copy register cannot reach `solver's answer`" and cites `useGameCell.ts:153`; ballot T9-B1
   landed at `74a2b5d9` and that string is now `revealed answer`. Reported, not re-cut — it is
   the fold's row.

## Corrections this lane owns

1. **The reference is TWO numbers, not one, and both are re-derived.** 0.076410 is the light
   arm's orange-against-gold; the same pair at night is 0.060481. The dark arm's 0/144 under it
   is a stronger reading than the light arm's 5/144, and the old literal `0.0764` was measuring
   the dark arm against a daylight number.
2. **The count as a ratio needed a ceiling, and the ceiling is the house's own crowding.** The
   first cut compared the walk against the two nearest CHROMATIC TOKENS (0.0236 light) and read
   0/144 — true and useless. The row now asks whether the walk crowds the house's inks harder
   than the house crowds itself: 3.47% of hands against 78.9% of tokens, light; 0% against 10.5%,
   dark.
3. **A gate may not set the token it asserts on.** The first cut of tier 3 wrote `--peer-ring-l`
   onto the page before reading it, so reverting `index.css` could not red it — the born-RED
   battery caught that, and the shipped band now comes off the cascade with only the ALTERNATE
   overridden.
4. **`sharp` is not a declared dependency of this package.** The first sampler imported it to
   decode a screenshot and knip red. The page already holds a canvas, so the PNG is decoded by
   the browser that took it and the dependency is gone.
5. **The boil re-renders the cell and Vue writes `class` whole**, so a class set from outside the
   component survives one tick. The probe re-asserts the seat through a `MutationObserver` — a
   test affordance, and not one declaration of `gameCell.css` is restated.

## Gaps, honestly

1. **The ring is seated by a probe, not by a peer on the wire.** Every painted ring number comes
   from the product's own class and the product's own var on a real cell, but the SESSION did not
   put it there. A two-page relay run with a real peer cursor is still a row.
2. **The relay arm is untested.** Everything is `?wire=local` `BroadcastChannel`. Unchanged from
   pass 2.
3. **Five hands per arm are photographed, not 144.** The painted sweep would be 144 × 2 × 2
   screenshot pairs; the five chosen are the arithmetic worst of each arm (i=6, i=5), the floor
   hand (i=38), the nearest-token hand (i=112) and index 0. The worst photographed number equals
   the worst arithmetic number to three decimals in both arms, which is the evidence that the
   arithmetic sweep is trustworthy — but it is inference, not 144 photographs.
4. **The proposed accent-kinship tape row is broken as written** (see MOVED §2). It is proposed
   under `instruments/`, not applied, and the defect is named.
5. **`filterBudget` was not re-counted by hand and no filter census was run this pass.** Nothing
   in this diff touches a filter; the row is carried from pass 2's built-dist reading.
6. **Goldens were not run.** The prototype tree's dist was not built this pass, so the 4/4
   against a built dist is NOT re-proven here. π at 0.00px over 404 rects on the dev server is
   the layout evidence this lane has; the golden row is a gap and a STOP if it ever moves.
7. **No phone viewport was measured.** The ring's popover ground is priced by arithmetic (3.111
   light / 3.438 dark) but no 390-wide board was photographed.
8. **`seedFor` is hoisted but NOT exported.** The brief grafts PAL-TIN's seam; an exported symbol
   with no consumer in this tree reds knip, and `p.id.length` — the thing the graft kills — does
   not exist on this family's surface. The arithmetic is hoisted and named; the export is
   PAL-TIN's to add when its roster tick lands beside it.
9. **The eight-hands crop uses eight of the walk's first indices in board order**, not a real
   eight-player room. The colours are the walk's own; the seating is the probe's.

## The crops (four, 375 KB total)

- `frames/four-hands-light.png` (110 KB) — four hands, light, with the floor hand **i=38** (the
  teal 2, chroma 0.0749) beside a cap hand (**i=0**, the rose 1 at 0.1796).
- `frames/four-hands-dark.png` (132 KB) — the same four at night.
- `frames/eight-hands-light.png` (119 KB) — eight, light. The owner's second question.
- `frames/ring-dark-shipped-vs-head.png` (14 KB) — one frame, two cells: the ring at the shipped
  band beside the same ring at HEAD's (the digit's) band. The regression and its cure, dark.

## What the owner is asked (U-10)

Unchanged in substance, now with the picture. Four hands, then eight, both themes, the palest
beside the fullest: **is four legible at a glance, and are eight distinguishable side by side?**
If yes, this is the colour, and the ring is the same hand pressed harder — legal in both arms at
the ladder's own alpha, spoken in the cell's name, and costing the palest ring 0.0544 of chroma,
which is under the 0.06 the census uses to call a declaration a colour. If sixteen must read as
sixteen, the walk yields the axis to PAL-TIN's second channel. F1 — you take a room colour on the
second known id — leans YES on the artifacts and both arms are buildable.
