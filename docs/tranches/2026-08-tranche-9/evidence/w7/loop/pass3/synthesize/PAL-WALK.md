# PAL-WALK · pass-3 SYNTHESIS — the law held, the ring pressed harder on the axis nobody ranks, the ring given words

Section §11c the per-player colour system · §12 · leader. Synthesized from the pass-3 research
(`../research/PAL-WALK/README.md`, three instruments, every figure re-derived at `74a2b5d9`),
the chair's rulings (`../CHAIR-RULINGS.md` §6.6, §6.5, §6.8, §7), the pass-2 synthesis and
critique, PAL-TIN's pass-3 research (the tape ground, the laminate ground, the `getBBox`
correction) and r0's ground (R5, R6 laws 20–25). Bound by the frontend-design two-pass method.
Read-only on the product; U-10 holds; nothing here is closed.

Pass 3 adds no arithmetic of its own: every number below is the research's, cited by file, and
the prototype's job is to read each one off painted bytes.

## 0 · The design plan, and the review against the tells

**Tokens.** No new hex. The formula stands as pass 2 wrote it (a golden step over the arclength
of the open complement, chroma capped at the pen's own 0.215, `--peer-ink-l` 0.44 / 0.65). ONE
new two-arm scalar, `--peer-ring-l`, the ring's own lightness, same form as `--peer-ink-l`.
**Type · layout.** Unchanged. **Copy.** One clause, for the ring (§1.6). **Motion.** None new.

**Principles.** (1) The colour law is converged (a third independent implementation reproduces
it to five decimals, research §1) and is not touched. (2) The ring is the same pencil pressed
harder: same hue, its own lightness. T8-W3 M1 ranks width, stroke-opacity and fill-opacity; it
does not rank lightness, and lightness is the axis this family already owns. (3) A peer surface
carried by colour alone is the one 1.4.11 fails on; the fold gave the digit words and left the
ring mute, and this pass gives the ring the same words. (4) A gate discovers by RESOLVED VALUE:
a name is not a colour, a var is not a colour, a block is not an arm. (5) The gate that counts
compares against a ceiling it re-derives in the same run (PAL-TIN's shape, grafted).

**Tells checked, and what the review changed.** No avatar, initial, dot, flag or stock set; the
walk is a formula, not a swatch card. Changed on review, each on a number: (a) pass 2 cured the
ring by raising alpha to 0.80, which inverted a decided ladder (tier 1 hover 0.65) and reds
`join-language-prm:153`; the chair's §6.6 sends alpha to §6, and the research shows the honest
mechanism was never alpha (graphite clears at 0.65 because it is a luminance extreme; a
mid-lightness hand cannot) — so the cure moves to lightness and `gameCell.css` is untouched;
(b) pass 2 measured the ring only at its own tree and read a light-arm sentence; the π row
(`readings/head-vs-walk-ring.json`) shows the dark arm was COMPLIANT at HEAD for all 144 and
the band breaks it for all 144 — a regression this family owns and books, not a gap; (c) pass
2's `?board=` window is struck: the decoder makes every shared digit a given and `authored()`
excludes givens (`persistence.ts:207-209`); (d) the count assertion (`underReference ≤ 5`) reds
at 94 of 360 hues under a sibling's one new token, so it becomes a ratio.

## 1 · The spec

### 1.1 The walk — unchanged, and the sentence that goes with it

```
RESERVED = every declaration in index.css whose OKLCH chroma > 0.06, RESOLVED per arm
           (var() aliases followed, hsl() parsed, @media blocks excluded), each ±13°
OPEN     = the complement (HEAD: 6 arcs, span 137.2481°)        STEP = OPEN × (3 − √5)/2 = 52.4241°
h(i)     = hue at arclength (i × STEP) mod OPEN                  C(h) = min(0.215, chromaAt(h, 0.44), chromaAt(h, 0.65))
digit    = oklch(var(--peer-ink-l) C(h) h)                       ring = oklch(var(--peer-ring-l) C'(h) h)
```

`C'(h)` is `chromaAt` at the ring's own lightness (min over both arms, cap 0.215): the ring
keeps the hand's hue and takes what sRGB holds there. Nothing else in the formula moves.

The module header carries the three sentences the research owes, verbatim in substance:
- the 0.0764 reference is the LIGHT-arm crayon pair (`--color-crayon-orange` vs
  `--color-crayon-gold`, 0.076410); at night the same pair is 0.060481, and the walk's dark
  worst (0.07088) sits above it. One sentence, both arms.
- the palest hand (i=38, chroma 0.07490) is a colour by the same measure the census uses to
  decide what counts as one (1.248× the 0.06 floor; ΔE 0.0751 from neutral), and by no more.
- capacity: N=2 0.2527 · N=3 and N=4 0.0758 (the closest pair of four is among the first three)
  · N=5 0.0264 · N=8 0.0229 · N=16 0.0084 (light; dark within 0.001). "Four hands read as four
  people; the fall is between four and five." The unit pins `near(8) < 0.05` as a CEILING with
  the sentence "an improvement edits this line upward, and that is the point."

### 1.2 The tokens

| token | light | dark | where | status |
|---|---|---|---|---|
| `--peer-ink-l` | `0.44` | `0.65` | `index.css:162` / `:375` | pass 2's move, held |
| `--peer-ring-l` | **`0.32`** | **`0.79`** | beside each `--peer-ink-l` arm | NEW, this pass |
| `--color-user-ink` | `#2563eb` | `#60a5fa` | `:151` / `:372`; `#000` at `:935` print/forced | untouched |
| `--color-peer-cursor-ink` | bound inline | — | `BoardHost.vue:78` → `gameCell.css:230,:232` | now the SECOND key of `inkFor` |

The ring band, priced at the chair's α 0.55 (`readings/ring-band-at-055.json`), worst of 144:

| `--peer-ring-l` | vs own 4% fill (light / dark) | vs the card | min ring chroma (light / dark) | M1 ladder |
|---|---|---|---|---|
| 0.34 / 0.77 | 3.051 / 3.219 | 3.113 / 3.234 | 0.0580 / 0.1178 | intact (4<5, 0.55<0.65, 0.04<0.06) |
| **0.32 / 0.79 (authored)** | **3.165 / 3.409** | 3.227 / 3.427 | **0.0546** / 0.1067 | intact |

0.32 / 0.79 is authored, not 0.34 / 0.77, for one reason: every number in that table is token
arithmetic and ACC-FIVE's painted-line law says a 4px antialiased stroke never reaches its
token (graphite (38,38,38) paints (49,49,49)). The prototype reads the ring PAINTED with
MRK-ABS's `isTheRing` sampler and pins the shipped band as the LIGHTEST light arm and DARKEST
dark arm that clear 3.0 painted with ≥ 0.10 of headroom; the authored value is the starting
point, and the rule is written into the `index.css` comment so a later hand cannot raise the
band to pass.

**The price, stated in the comment and the return.** At the ruled α 0.55 the palest hand's ring
falls under the 0.06 the census uses to call a declaration chromatic (0.0546 authored, 0.0580
at 0.34). The ring's job under 1.4.11 is a BOUNDARY, and the digit inside it keeps the hand's
full chroma; the ring's hue is a secondary channel and the words (§1.6) are the third. That is
the sentence; it is not hidden. **Route B, §6's option, built nowhere:** α 0.64 (still under
tier 1's 0.65) with `--peer-ring-l` 0.40 / 0.72 reads 3.344 / 3.390 with ~0.35 of headroom and
both ring chromas above the floor (0.0681 / 0.1224); it moves `join-language-prm:153`, which
the chair reserves to §6. Stated in the return with these numbers.

**What the palette survives on the opacity axis alone (the §6.6 answer):** α ≥ 0.69 and nothing
below (0.65 leaves 57 of 144 dark hands under 3:1; 0.69 is the first to clear both arms:
3.391 / 3.021). With the ring band, 0.55 survives.

**The LEDGER row this family books** (its own, caused by `--peer-ink-l`, not by `gameCell.css`):
at α 0.55 HEAD's palette reads the dark ring at 3.591 worst, 0 of 144 under 3:1; the band at
0.65 alone reads 2.360, 144 under. The light arm is pre-existing and improved (HEAD 2.264,
144 under → 2.541, 112 under). The ring band closes both arms; the row records that the
tranche would have shipped a night-time regression without it.

The comment beside `--peer-ring-l` says the mechanism once, in the house register: the ring is
the same hand at its own lightness because the ladder ranks width and opacity and a mid-tone
colour cannot buy 3:1 at a graphite's alpha; the numbers cite `readings/ring-band-at-055.json`.
No `, fallback` in any `var()` (chair §6.5); the scalar is a design token, not a measured one,
so no `@property` is registered for it — the row says so.

### 1.3 The wire: one key becomes two, at the one site that reads it

`inkFor(index)` returns
`{ "--color-user-ink": "oklch(var(--peer-ink-l) C h)", "--color-peer-cursor-ink": "oklch(var(--peer-ring-l) C' h)" }`.
`BoardHost.vue:66-79` (the FOLD's version, +23 lines at `74a2b5d9`; the hunk is re-cut against
it and named in the return) reads `inkOf.get(id)?.["--color-peer-cursor-ink"]` and rebinds it
— it stops re-deriving the digit key. Every other consumer (`:311-312` `authorInk`,
`GameControlPanel.vue:1153/:1171` `p.ink`/`r.ink`, the tape at `GameBoard.vue:1093`, the
posters) spreads the record and paints `--color-user-ink`; a second key on the record is inert
for them. `gameCell.css:230/:232`'s `var(--color-peer-cursor-ink, var(--color-user-ink))`
fallback stays as HEAD wrote it (it is §6's file, and the unbound case still resolves).

The unit (`BoardHost.authors.test.ts`'s harness, the fold's own file): a cursored cell's
`--color-peer-cursor-ink` differs from the same author's `--color-user-ink` and parses as
`oklch(var(--peer-ring-l) …)`; born-RED at HEAD, where the two are the same string.

### 1.4 The session half — the rows closed by reading the code, each with one unit

All through the existing harness (`useSession.test.ts:185` `bootPage`, `:224` `hear`, `:235`
`stFrame`); the file reads `authored`/`bindSelfInk`/`roomHasOthers`/`mint(`/`inkAgreed`/
`adoptInk` 0 times at pass 2 and that count is the born-RED.

| unit | proves | HEAD |
|---|---|---|
| U1 | an agreed index survives a non-author's rival `st` | RED |
| U2 | a page's own publish agrees nothing | GREEN (RED at the pass-1 rider) |
| U3 | no two known ids share an ink string across two epochs | GREEN |
| U4 | a non-author `st` FILLS an unmet id (the doc says AGREED, and the code is right) | GREEN, doc RED |
| U5 | once agreed, `inkIndex[id]` beats `k` for the same author's later epochs; a new AUTHOR clears | RED |
| U6 | a `[0, self]` stamp is replaced by a newer-epoch `st` together with the board it described (`useSession.ts:762` replaces the clock wholesale) | GREEN |
| U7 | self binds only on the second known id; the invite press recolours nothing; solo binds nothing | RED |
| U8 | the room of one: write, invite, write — both strokes `--color-user-ink`; the peer arrives, both snap | RED |

`adoptInk`'s doc: "a non-author `st` cannot move an index that is AGREED; it fills the ones it
does not yet have, which is how a page learns a peer who left before it sat down." The branch
does not move. Charter row 6 closes with U6 and one sentence; no measured window.

### 1.5 The gate, three tiers, each honest about what it can see

| tier | home | proves | negative control |
|---|---|---|---|
| 1 | `scripts/check-peer-arcs.mjs`, `lint:arcs` | the RESOLVED census: hex, `hsl()`, `var()` aliases followed to their hex, per arm by brace-matched block (`.dark`), `@media print`/`forced-colors` excluded; every chromatic declaration inside a declared arc | `--self-test`: a hex moved → RED; a token renamed → RED; **an alias re-pointed at a new hex → RED** (`--color-teacher-red` → a 192° hex); **an hsl-authored chromatic → RED**; the print block's `#000` never reserves |
| 1 (check 2) | same file | DECLARED A DECOY, renamed to what it proves: the complement is non-empty and a golden step over it yields no duplicate hue in 144 | none claimed |
| 2 | `useSession.test.ts` (`inkFor` imported at `:127`) | the MODULE's 144 hues clear every arc; the ring key parses; U1–U8 | `STEP = 0.5` → RED |
| 3 | `e2e/peer-walk.spec.ts` (`PRM:` declared; local instrument, O-12) | α and fill read off `.game-cell.is-peer-cursor .cell-ghost-path` through `getComputedStyle` (0.55 / 0.04) and PRINTED; the ring PAINTED (`isTheRing`: median of changed samples, verified against computed style) worst of 144 vs its own fill ≥ 3.0 both arms, both engines, dpr3, and the count under 3 printed; `nearest ≥ 0.07` ABSOLUTE; `underReference` as a RATIO to the count the house's own chromatic tokens produce among themselves, re-derived in the same run; AA worst of 144 on SIX grounds (background, card, popover, selection wash, **the tape's `--sheet-washi-neutral`**, **the hint laminate**), darkest-byte by WCAG luminance (PLR-SELF's sampler) | revert `--peer-ring-l` → the ring row RED (2.360 dark); a literal `5` with a 192° token → the ratio row's own control |

The tape and laminate grounds are REPORTED rows, not gates, this pass: HEAD's own
`--color-user-ink` reads 4.232 on the dark tape (PAL-TIN's `readings/grounds.txt`), so the
tape is an estate LEDGER candidate owned by the fold's 3C-4, and the walk prices its worst of
144 on it in both arms so the row has the number the section needs. The laminate (peer digit
under an armed hint, 4.403 dark at HEAD's mix) is the same kind of row.

### 1.6 The ring's words — the one clause this family mints

The fold's `BoardHost.vue:84-115` gives every digit its author's slug in the cell's accessible
name. The ring has 12 hits across `src/`+`e2e/` and none is spoken. `cursorNameAt(pos)` sits
beside `authorNameAt(pos)` off the same `peerCursorInk` key set (`:67-79`), and the cell's
accessible name gains one clause when a peer is on it:

> `{slug} is here`

Plain English, no dash, one lexicon entry, `lint:copy` admissions 0. It rides the accessible
name (no live region, no announcement on every move — W3's idiom is that the indication
speaks when asked). The section's row (PLR-PLACE's "no ink, no dot" principle), carried once
by the leader because the cursor key is this family's. Nothing else is minted.

### 1.7 The four surfaces, both platforms, both themes

| surface | the design (light / dark) | states |
|---|---|---|
| board digit | the hand at L 0.44 / 0.65, mechanism unchanged (`HandwrittenGlyph.vue:85`) | peer bound; you in a room of two or more bound (F1 YES, both arms buildable, chair §6.8); solo nothing |
| peer cursor ring | the same hand at L 0.32 / 0.79, width 4, α 0.55, fill 0.04 — §6's file untouched; spoken as `{slug} is here` | drawn on 180ms `--ease-ghostDraw`, unchanged |
| roster row + swatch | `p.ink` spreads the two-key record; the swatch paints `--color-user-ink` (re-pointed once under PLR-SELF, chair §6.9 — no hunk here) | arriving/returning/leaving as landed |
| attribution tape | the digit's ink on `--sheet-washi-neutral`; PRICED, not changed | the fold's surface |

Phone 390: the dock sheet's `--color-popover` ground is priced for the RING once (worst of 144,
dark, the first time any ring row has been), the row's number reported. Landscape 844×390: the
board's cell is the same cell. Print / forced colours: a room prints in one ink (`index.css:935`).

### 1.8 Motion

None. `pencilConfig MOTION` untouched; the ring's 180ms `--ease-ghostDraw` and the join wash's
snap (1180ms at 0.95, `useJoinWash.WASH`) are the existing homes. PRM: the same.

### 1.9 Couplings and the rows this pass reports MOVED

- R6 law 22 / L6: MOVED as pass 2 re-cut it (a formula, no hexes; L6 asserts a formula and no
  hue table). Law 21's cite `index.css:154-161` → the block at `:153-162` plus the ring scalar.
  PAL-TIN's L6 diff folds into this row (one MOVED per section).
- r2 `accent-kinship.probe.ts`: COPIED, `OUT` re-pointed, toll row over 40 hands ≥ 4.5 — and a
  proposed diff under `instruments/` adding the tape ground to its collection (it collects
  `--color-card` and `--color-background` only, `:267-275, :319`).
- §3's renames: tier 1 by resolved value is the cure; the count assertion as a ratio is the
  second half. Safe span with the literal: 266°; with the ratio: the whole wheel (the sweep
  re-run under the ratio is the prototype's row).
- PAL-TIN's `seedFor(peerId)` hoisted (`playerIdentity.ts:53` in worktree -58): GRAFTED, kills
  `p.id.length` as a seed.
- `BoardHost.vue`: the fold touched it; the §1.3 hunk is cut against `74a2b5d9`.

## 2 · Plan — files, order, what dies

1. `playerIdentity.ts` — `inkFor` emits the second key; `C'` via the existing `chromaAt`;
   `seedFor` hoisted; header re-cut with §1.1's three sentences.
2. `index.css:162, :375` — `--peer-ring-l` beside `--peer-ink-l`, the comment with the
   pin rule and the price; `--peer-ink-l` 0.44 / 0.65 held.
3. `BoardHost.vue:66-79` — read the second key (fold's version); `cursorNameAt` beside
   `authorNameAt`, the clause into the accessible name; `BoardHost.authors.test.ts` +2 units.
4. `useSession.ts` — the wire rule once for the section (`adoptInk(k, from === e[1])`, `fresh`
   before the epoch write), the doc sentence AGREED, `known > 1` self binding, the session-start
   stamp through a DECLARED accessor (`writtenPositions: () => number[]` on `SessionSource`,
   PAL-TIN's seam, grafted); `useSession.test.ts` U1–U8.
5. `scripts/check-peer-arcs.mjs` — resolved-value census; check 2 renamed; two new self-tests.
6. `e2e/peer-walk.spec.ts` — reads α/fill off the cascade; painted ring; absolute + ratio;
   six grounds; the popover ground for the ring.
7. Copy: one lexicon entry for `{slug} is here`; `check-copy-register` exit 0.
8. MOVED rows and the proposed instrument diffs under `pass3/prototype/PAL-WALK/instruments/`.

**Dies:** pass 2's `gameCell.css` hunk (0.80); the literal `5`; the `?board=` window sentence;
`peer-walk.spec`'s hardcoded 0.8/0.04; the "cannot move the ones it has" sentence; check 2's
claim to carry the law; `p.id.length` as a seed. **Does not die:** the walk, the arcs, the
band, `chromaAt`, `intoArc`, `join-language-prm:153`, `gameCell.css` entire, the single
`--color-user-ink` binding at `HandwrittenGlyph.vue:85`.

## 3 · Prototype brief

Replay the pass-2 diff (worktree `wf_8630d340-e56-59`, 11 M + 2 new; zero intersection with
the fold's 16 files, clean apply) onto a fresh worktree off `74a2b5d9`; drop the `gameCell.css`
hunk; apply §2. Dev server 127.0.0.1:4244 `--strictPort` (next free in 4230–4249 if held) via a
two-line vite config with a private `cacheDir` in the evidence dir; HEAD control on the next
free port, commit `74a2b5d9` named; scratch Playwright config inside the package, no
`webServer`; chromium + webkit; dark via `localStorage["sudoku-color-scheme"]` settled on a
rAF. Batteries as shell scripts, >90 s in the background with a log. KILL both servers; the
band reads empty.

Prove, numbers first:

1. Tier 1 bare exit 0; `--self-test` exit 0 with FOUR controls RED (moved hex, renamed token,
   **re-pointed alias**, **hsl chromatic**); check 2 renamed and its old STEP=0.5 blindness
   stated in its own comment.
2. Tier 2 bare: U1/U5/U7/U8 RED at HEAD, GREEN after; U2/U3/U4/U6 GREEN; STEP=0.5 reds; the
   ring-key unit RED at HEAD.
3. **The ring PAINTED** (`isTheRing`, dpr3, both engines, both arms): worst of 144 vs own fill
   with `--peer-ring-l` at 0.32/0.79 AND at 0.34/0.77; the shipped band pinned by the rule in
   §1.2 (≥ 3.0 with ≥ 0.10 headroom, lightest/darkest that does); α read off the cascade = 0.55,
   `join-language-prm:153` GREEN both engines. Report the min painted ring chroma. Report the
   ring on `--color-popover` (phone). Report the opacity-only survival row (α ≥ 0.69).
4. The law painted: 144 × 2 arms, 0 arc collisions over 16/24/40, `nearest ≥ 0.070`
   (expected 0.0716 / 0.0709), the house ratio printed and the count as a ratio (expected
   5 / the house's own count, light); the 360° sweep re-run under the ratio, degrees that red it
   (expected 0).
5. AA worst of 144 on six grounds, both arms (expected 7.110 / 5.210 on background/card; the
   tape and laminate REPORTED with HEAD's own reading beside them).
6. Capacity painted N=2/3/4/5/8/16 (expected 0.253 / 0.0758 / 0.0758 / 0.0264 / 0.0229 / 0.0084).
7. The ring's clause: `{slug} is here` in the cursored cell's accessible name, both engines;
   absent when no peer is on it; `lint:copy` 0 admissions, lexicon 26.
8. The room of one (U8 on the real surface); solo fingerprint on a seeded board identical.
9. Censuses: filterBudget 9; goldens 4/4 against the built dist (a move is a STOP, chair §6.4);
   accent-kinship copied/re-pointed ≥ 4.5 over 40; L6 re-cut GREEN, its literal-table control
   RED; `check-copy-register`, `check-motion-contract`, `check-pw-projects`, knip all 0.
10. **Crops, at most four, ≤150 KB:** (i) four hands on one board, light, with the floor hand
    i=38 beside a cap hand; (ii) the same, dark; (iii) eight hands, light; (iv) one peer ring,
    dark, at the shipped band beside the same cell at HEAD's band — the regression and its cure
    in one frame. These are the owner's U-10 picture; nothing else is banked.

Success in one sentence: the walk unchanged to the digit, the ring the same hand pressed
harder and legal in both arms at the ruled alpha, the ring spoken, the gate seeing through
aliases and blocks, the count no longer a literal.

## 4 · Born-RED gates this family lands with

| gate | file | HEAD | after |
|---|---|---|---|
| ring PAINTED ≥ 3.0 worst of 144 vs own fill, both arms, α read off the cascade (0.55) | `e2e/peer-walk.spec.ts` | RED 2.360 dark (band) / 2.264 light (HEAD) | GREEN ≥ 3.1 |
| ring key: cursored cell's `--color-peer-cursor-ink` ≠ its `--color-user-ink`, parses `oklch(var(--peer-ring-l)` | `BoardHost.authors.test.ts` | RED | GREEN |
| `{slug} is here` in the cursored cell's accessible name; absent otherwise | `BoardHost.authors.test.ts` + e2e | RED | GREEN |
| tier 1 resolved census + 4 controls (moved, renamed, re-pointed alias, hsl) | `check-peer-arcs.mjs --self-test` | RED (2 controls green-lit) | GREEN |
| tier 3 `nearest ≥ 0.07` absolute AND count as a ratio to the re-derived house count | `e2e/peer-walk.spec.ts` | RED (literal 5; 94° red it) | GREEN (0° red it) |
| U1 U5 U7 U8 (agreed survives rival; agreed beats `k`; self binds on the second id; the room of one) | `useSession.test.ts` | RED | GREEN |
| U2 U3 U4 U6 (publish agrees nothing; no shared ink; non-author fills unmet; `[0,self]` cleared by a newer epoch) | `useSession.test.ts` | GREEN | GREEN |
| tier 2: 144 hues clear every arc; STEP=0.5 reds | `useSession.test.ts` | RED | GREEN |
| `join-language-prm.spec.ts:153` reads 0.55 | existing | GREEN | GREEN |
| AA six grounds worst of 144 ≥ 4.5 on background/card/popover/wash; tape + laminate REPORTED | `e2e/peer-walk.spec.ts` | GREEN / n.a. | GREEN / reported |
| R6 L6 re-cut, literal-table control RED | r0 MOVED row | GREEN | GREEN |
| filterBudget 9 · goldens 4/4 · copy 0 · motion contract · pw-projects · knip | existing | GREEN | GREEN |

## 5 · What this family asks the owner (U-10)

One question with a picture this time: four hands, then eight, both themes, the palest beside
the fullest — is four legible at a glance and eight side by side enough? If yes, this is the
colour, and the ring is the same hand pressed harder. If sixteen must read as sixteen, the
walk yields the axis to PAL-TIN's second channel. F1 (you take a room colour on the second
id) leans YES on the artifacts; both arms are framed.

## 6 · Risks carried forward

1. The ring band's light arm spends the chroma margin (0.0546 authored); painted may push the
   pin to 0.30 and lower. The return states the painted number; if it falls under 0.05 the
   family says so and Route B is §6's.
2. Every ring number is token arithmetic until step 3 runs; ACC-FIVE's law says down.
3. `nearest` at 0.0709 has 0.0009 of room against a band change; `--peer-ring-l` is a different
   token and the digit band does not move, so the row holds — but the return re-reads it.
4. The clause is copy; the copy gate's discovery grammar at `5f8e1a7b` reads it by name, and a
   wrong register word reds the lane.
5. The tape and laminate grounds are the fold's surfaces; this family prices and does not cure.
6. The relay arm is a row, not a gate; no real device.
