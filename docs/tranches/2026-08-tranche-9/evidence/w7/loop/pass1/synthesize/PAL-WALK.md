# PAL-WALK · pass-1 SYNTHESIS — the walk over open arcs, hue exact

Section §11c the per-player colour system · §3's peer exception · §12. Synthesized from the
pass-1 research at `../research/PAL-WALK/` (verdict ADJUST) and the r0 ground (R2, R5, R6).
Nothing here is closed; U-10 holds. Read-only on the product.

## 0 · The design plan, and the review against the tells

**Tokens.** No new hex. One formula, re-cut: a golden walk over the arcs the house has not
reserved, at a chroma that is the wax's where the gamut allows it and the gamut's ceiling
where it does not. `--peer-ink-l` stays 0.5 / 0.8.
**Type.** Unchanged (Patrick Hand at `--type-tag` on the row; the glyph hand on the board).
**Layout.** Unchanged; W2's mechanics are landed and the row's grammar is PLR-PLACE's.
**Principles.** (1) What is constructed is what is painted: hue exact, no engine rotation.
(2) No peer is ever a crayon, a verdict, the machine, or you. (3) Solo is byte-identical.
(4) The walk never runs out, and the spec says out loud how many it keeps apart.

**Tells checked.** The generic "user colours" answer is avatar bubbles, initials, a
presence dot, a cursor arrow with a name flag, a stock palette. None is taken. The one
tell the incumbent itself carries is that YOU are a stock Tailwind blue beside generated
peers (R2 §7); this family cures it by binding `k[self]` in a room. Changed on review:
the charter's flat 0.166 is dropped (it rotates hue 15.33° and re-lands index 2 inside
crayon-blue's arc), and the charter's literal step `137.5 mod OPEN` is dropped (a 9.7°
backward crawl); both replaced by the research's measured forms.

## 1 · The spec

### 1.1 The walk

```
RESERVED (29 hexes in index.css, ±12.25° guard = law 12° + 0.25° numerical margin):
  [0.0,26.2] [52.2,107.7] [135.0,177.6] [237.3,274.9] [280.7,305.6] [334.0,360.0]
OPEN  = the complement, five arcs, 144.75° total (147.2° at the bare law)
STEP  = OPEN / φ²  = 55.29°            (the golden FRACTION of the open arclength)
t(i)  = (i × STEP) mod OPEN            (arclength along the concatenated open arcs)
h(i)  = the hue at arclength t(i)      (walk the five arcs in order, skip the reserved)
```

The reserved set and the arcs are a CONSTANT in `playerIdentity.ts` and a GATE re-derives
them from `index.css` (§4, born-RED on drift). A hex that moves reds the gate; nobody
edits the constant by hand.

### 1.2 The chroma — per hue, in gamut, one string

```
C(h) = min(0.166, ceil(h, L=0.5), ceil(h, L=0.8))
ink  = oklch(var(--peer-ink-l) C(h) h deg)
```

`ceil(h, L)` is the largest chroma at which `oklch(L C h)` is inside sRGB, by bisection on
the OKLab→linear-sRGB conversion (≈30 LOC in `playerIdentity.ts`, memoised per index).
Taking the minimum over BOTH bands keeps the ink ONE string that survives a theme flip
without re-minting (`p.ink` is not re-derived when `.dark` toggles). Cost, from the research's
exact bisection: light min ceiling 0.0851, mean 0.1459; dark min 0.1011, mean 0.1480; so the
single-chroma mean lands between 0.13 and 0.14 — above the incumbent's 0.110, under the wax.
Predicted contrast (the per-hue cap on the full-circle walk measured 5.37 / 5.50 light,
9.49 / 9.29 dark): light IMPROVES on the incumbent 5.22 / 5.35. The prototype measures it.

Fallback if the prototype's mean chroma reads under 0.125: two vars per element
(`--peer-c-l`, `--peer-c-d`) with `--peer-ink-c: var(--peer-c-l)` declared on the three
binding hosts (`.player-row`, `.game-cell`, the join trace) and the `.dark` twin. Three
rules, three files; only if the single chroma is too flat.

### 1.3 Capacity, stated

By construction with hue exact: requested separation over the first 4 / 8 / 16 is
21.5° / 13.05° / 4.99°. At the family law's own 12° floor the walk keeps **eight** pencils
apart; the ninth is the first under 12°, and at sixteen the closest pair is 4.99°. The
research's painted figure (seven) was taken under the rotation this spec removes; the
prototype's painted number governs. **If the owner's "16+ within reason" binds on
distinguishability, this family yields the 16-player case** to PAL-TIN's sharing axis; if
eight apart is enough for a worksheet, this is the richer colour. The product says nothing
about capacity; the roster simply keeps listing.

### 1.4 You join

`k[self]` binds your ink on your own page when a room exists. Three sites, one condition:

```
mint()      ink = id === selfId && !roomId ? {} : inkFor(index)   useSession.ts:537
adoptInk()  same condition                                        useSession.ts:556
authorInk   drop the self `continue` when roomId is non-null       useSession.ts:406
```

Solo binds nothing anywhere (byte-identical: 0 elements carrying `--color-user-ink`,
root and cell ink `#2563eb`, glyph stroke `rgb(10,10,10)`, measured both engines). The
binding lands per element where `authorInk` already puts it (the row's `:style`, the cell,
the join trace), never on `:root`; `--color-user-ink` has 24 consumers (gallery dot, cell
name anchor, posters) that must keep the solo blue. Print and forced-colours are untouched
by construction (`@layer base` at `index.css:925-952` outranks any binding).

**Rider, same commit:** a guard on `adoptInk` (never rewrite an index this page already
holds for an id; `useSession.ts:554`). Without it, binding self hands your own handwriting
to F6 (a rival `st` re-inks you before the board is believed) and F5 (eviction mints a new
index on return). This spec refuses to bind self without the guard.

### 1.5 The four surfaces

| surface | the design | states |
|---|---|---|
| board digit | glyph stroke = the ink, unchanged mechanism; the memorable thing is that every hand in the room has its own hue and none is a crayon | peer-authored: bound; yours in a room: bound; yours solo: nothing |
| roster row | swatch 0.7rem circle + slug, both in the ink (unchanged); your row joins the system (no Tailwind blue beside generated oklch) | arriving 320ms / returning 280ms / leaving 320ms+420ms hold, all existing |
| peer cursor ring | `gameCell.css:236` stroke-opacity **0.55 → 0.80**; stroke-width 4 and fill 0.04 unchanged; still lighter than your focus ring on both axes (7 / 0.9) | drawn on 180ms `--ease-ghostDraw` `backwards`, unchanged |
| join trace | stroke-width 8, 0.95 join (passes 3:1 at 4.32+), 0.65 rejoin / 0.45 leave unchanged and DECLARED transient decoration (740–1180ms, not a component) | unchanged |

The ring's number is the wave's, not this family's: at HEAD the ring reads 2.28–2.31:1 in
light for every index (144/144 under WCAG 1.4.11). 0.70 reaches 3.05:1 at L 0.5; 0.80 is
chosen so ONE number serves this family and PAL-TIN (whose sticks need 0.80 for 3.20:1),
with ~0.5 of margin over the floor here.

### 1.6 Copy

None minted. A continuous hue cannot be named in plain words, so the walk is never spoken;
the slug is the name (the cell's accessible name already reads
`Row 1, column 4, tragic-mockingbird's entry 7`). Zero woff2 re-cut, zero
`check-copy-register` rows.

### 1.7 Motion

No new verb, no new constant. The one new moment: when a room opens (`roomId` goes
non-null) your own digits take your room ink. It SNAPS on the same frame the join trace
starts drawing (`useJoinWash` join, 1180ms at 0.95) so the trace is the explanation; no
stroke tween on 81 paths. PRM: the same snap. `pencilConfig MOTION` is not touched.

### 1.8 Both platforms, both themes

Colour is viewport-independent. Phone (390): row 19px, swatch 11.2px, unchanged. Dark: the
same hues at L 0.8; the chroma is the SAME string (the min over both bands). Predicted
dark contrast 9.3–9.5:1; measured by the prototype over 144 indices on four grounds.

## 2 · Plan — files, order, what dies

1. `web/frontend/scripts/check-peer-arcs.mjs` (NEW gate, born-RED at HEAD: the incumbent
   has no arcs) — derives the 29 hexes → six reserved arcs at 12.25° from `index.css`,
   diffs against `playerIdentity.ts`'s constant, exits 1 on drift. Wire into
   `npm run check` beside `check-ink-pressure`.
2. `web/frontend/src/games/shared/playerIdentity.ts:62-70` — `inkFor` becomes the arc walk
   + per-hue chroma; the header (`:1-15`, the 5.26/9.56 claim) rewritten to the measured
   numbers; the "never reassigned" comment at `:78` corrected to name `adoptInk`.
3. `web/frontend/src/games/shared/useSession.ts:406, :537, :554-556` — the three self
   sites take the `roomId` condition; `adoptInk` gains the never-rewrite guard.
4. `web/frontend/src/games/shared/gameCell.css:236` — stroke-opacity 0.80.
5. Tests pinning the walk's string: `useSession.test.ts:127-132, :338`,
   `useJoinWash.test.ts`, `useStagingBridge.test.ts`, `posters.test.ts` — re-pinned to the
   arc walk's first indices (bookkeeping).
6. `index.css:155-162` — the `--peer-ink-l` comment's 5.26/9.56 line re-derived.

**Dies:** the flat `0.11`, the full-circle `137.5°` step, self's `ink: {}` in a room, the
ring's 0.55. **Does not die:** `--peer-ink-l`, the one-binding mechanism, IDENTITY_CAP.

**Couplings:** if §3 (ACC-FIVE/ACC-SIX) moves `--color-user-ink` to a crayon-blue ink tier
or adds a sixth anchor, the gate in step 1 reds and the arcs re-derive: a sixth anchor costs
24.5° of open wheel (sep@16 4.99 → 4.14); user-ink going kin widens OPEN to ~146°. The
walk is hostage to §3 and says so.

## 3 · Prototype brief

Build on a throwaway worktree under the scratchpad (never committed): steps 2–4 above as a
`.diff` banked under `pass1/prototype/PAL-WALK/proto/`. Dev server `npx vite --host
127.0.0.1 --port 4244 --strictPort`; scratch Playwright config (copy, drop `webServer`,
`baseURL` 127.0.0.1:4244), chromium + webkit, light + dark.

Prove, in this order (numbers first, frames last):

1. **Hue exact.** Canvas read-back of all 144 indices, four grounds: painted hue vs requested
   hue, max |Δh| **≤ 0.5°** both bands (born-RED at flat 0.166: 15.33°). Mean painted chroma
   reported; success ≥ 0.125 (else the §1.2 fallback).
2. **The law, painted.** `research/PAL-WALK/probe/painted-law.mjs` on the new bytes: **0
   collisions** over the first 16, 24, 40, both themes (born-RED at 0.166: 14 light / 1 dark).
   `probe/family-law-arcwalk.mjs` on requested: GREEN (construction, not evidence).
3. **AA.** Worst of 144 × 4 grounds ≥ 4.5:1; report the four worst cases (predicted light
   ≥ 5.3, dark ≥ 9.2).
4. **Ring 3:1.** Peer cursor ring at 0.80 over `--color-card` and `--color-background`, both
   themes, worst of 144 ≥ 3.0:1 (born-RED at HEAD: 2.28).
5. **Solo byte-identical.** The r5 fingerprint (boundCount 0, root/cell ink `#2563eb`, glyph
   stroke `rgb(10,10,10)`, leave false) identical before/after in both engines.
6. **I2 both directions** (r5 `instruments.spec.ts`): GREEN; I4 GREEN after the adoptInk
   guard (born-RED at HEAD); I3 stays RED (not claimed); I5 re-run and reported per engine.
7. **Painted separation** at 4 / 8 / 16 and the honest room size at the 12° floor: the
   number this spec quotes as "eight" is REPLACED by the measured one.
8. **filterBudget** census 9 (r3 `budget.probe.ts`); r2 `accent-kinship.probe.ts` with the
   peer walk's toll row re-run (≥ 4.5:1 over 40); the four goldens unmoved solo.

Frames (≤150 KB each, few): (a) dpr3 board crop of the closest pair among the first eight
in adjacent cells, light; (b) the same pair at sixteen (the yield case, honestly shown);
(c) the roster with your row in the system, light. Three crops, ~50 KB.

## 4 · Born-RED gates this family lands with

| gate | file | HEAD | after |
|---|---|---|---|
| reserved arcs derive from index.css | `scripts/check-peer-arcs.mjs` (new) | RED (no arcs) | GREEN |
| family law on PAINTED bytes, first 16/24/40 | `painted-law.mjs` promoted to `e2e/` | RED 14/1 (at 0.166) · RED 37 (HEAD walk) | GREEN 0 |
| painted hue = requested ±0.5° | new row in the same spec | RED 15.33° (0.166) · 4.41° (HEAD) | GREEN |
| peer ring ≥ 3:1 at the DRAWN opacity | new row | RED 2.28 | GREEN ≥ 3.0 |
| I2 own swatch = room's colour, both directions | r5 `instruments.spec.ts` | RED | GREEN |
| I4 agreed index survives a rival `st` | r5 `instruments.spec.ts` | RED | GREEN |
| solo fingerprint byte-identical | r5 probe promoted | GREEN | GREEN (regression) |
| AA over 144 × 4 grounds | r5 F3 rig | GREEN | GREEN (re-derived) |
| filterBudget = 9 · goldens 4/4 | existing | GREEN | GREEN |

## 5 · What this family asks the owner (U-10)

One question: is eight pencils apart enough? If yes, this is the colour: hue exact, richer
than today, never a crayon, you inside the system. If sixteen must read as sixteen, the
arcs cannot do it and PAL-TIN's tick must. The two families are not mergeable on this
axis; the agglomerator decides whether the per-hue chroma cap (which improves the
full-circle walk too) rides either answer.
