# PASS-2 CRITIQUE · PLR-PLACE · The seating chart

Adversarial, non-author. Read the spec (`../synthesize/PLR-PLACE.md`), the diff
(`git -C .claude/worktrees/wf_8630d340-e56-54 diff`, 14 tracked + 6 new files), the three banked
frames, and then re-measured on my own servers: the prototype worktree on **127.0.0.1:4247** and
the **MAIN tree at `a8fee1f5`** on **127.0.0.1:4248**, both from two-line scratch vite configs
with private `cacheDir`s, `--strictPort`, both killed before this was written. Probes in
`PLR-PLACE/probe/`, readings in `PLR-PLACE/logs/`. Nothing under `loop/r0/` or `loop/pass1/` was
written; nothing was committed, pushed or stashed in any tree; no product file was edited.

**VERDICT: ADVANCE at 70%.** The retire trigger is answered and it reproduces in a second hand.
Four things stop it short of higher, and three of them are things I measured that the lane did
not: π is broken at phone width and it is **not** the emulation artefact the return calls it;
PRM never reaches the open sheet; two **landed** estate gates go RED on this diff; and the lap
law's residual survives with all three of the lane's named candidates now refuted.

---

## 1 · What I reproduced (the family's own claim, independently)

`crit-seam.spec.ts`, desk 1280×800, one regime, a REAL mouse press on cell 40 then a REAL mouse
press on the sign. Both engines:

| reading | chromium | webkit |
|---|---|---|
| `document.activeElement` **before** the press | `INPUT/Row 5, column 5, given clue 8` | `INPUT/Row 5, column 5, given clue 3` |
| the same, **after** the press | identical | identical |
| `.chart-self` after the press | **1** | **1** |
| `[data-lobby]:visible` | 1 | 1 |
| filters, sheet shut → open | **9 → 9** | **9 → 9** |
| chart box at 9×9 | **96.00 × 96.00** | **96.00 × 96.00** |
| ring stroke / ink / ratio on the sheet's own opaque ground | `20.83` viewBox units = 2 CSS px · `rgb(37,99,235)` · **5.00** | same · **5.00** |
| Escape closes a MOUSE-opened sheet | yes | yes |

Two corrections to the record, in the family's favour:

1. **The lane's gap 6 is CLOSED.** Its `focusBeforePress` read `""` because it walked to
   `.closest(".sudoku-cell")`, whose `aria-label` lives on the input inside it. Read off
   `document.activeElement` itself the cell names itself, identically before and after the press,
   in both engines. The seam is not carried by inference any more.
2. **`--color-popover` really is opaque** — `hsl(48 10% 98.5%)` / `hsl(24 7% 6.5%)` at
   `index.css:137/:366`, no alpha anywhere. The "opaque ground" is true at the token, not just
   at the sample. (The incumbent `.hover-card` composes it at 80%; that card is untouched, as
   declared.)

And one gate I ran that the lane did not, which is **stronger** than the one it ran:
**the estate's own `e2e/filter-census.spec.ts` passes against this prototype — 6/6, chromium**,
including the coarse-regime arm and both `:hover` arms. That is the EXACT-MATCH allowlist in
`filterBudget.ts`, not a total of nine, so the chart, the sign and the open sheet perturb no
budget row in either direction. (Caveat: run against the dev server, not a built dist — the
estate's spec titles say "built dist" and that arm is still owed.)

`vitest run src/games` re-run bare: **56 files / 727 tests passed** (the estate's "Test Files vs
Tests" trap noted — 56 is files). `npm run lint:motion`: **34 specs, green**.
`node scripts/check-copy-register.mjs`: **0 em/en dashes, 0 unadmitted jargon over 142 files**,
2 admitted with their cures. The r0 hue census the lane copied and re-pointed is byte-identical
to r0's HEAD — this family mints no chromatic token.

---

## 2 · π IS BROKEN, AND IT IS NOT THE EMULATION

The return says G18 "WAS NOT RUN AT ALL" and that "the +32.83 the gate exists for was an
emulation artefact". I ran it. Two servers, **one** pointer regime declared at the context and
identical on both sides (`hasTouch: false`, `isMobile: false`, `deviceScaleFactor: 1`), same
viewport, same engine, same seed board, sixteen surfaces. Desk 1280×800: **every row identical,
both engines — π holds.** Phone 390×844:

| surface | HEAD (`a8fee1f5`) | prototype | Δ |
|---|---|---|---|
| `.controls-card` (chromium) | `[0, 844, 390, 595.17]` | `[0, 844, 390, 628.00]` | **+32.83 h** |
| `.controls-card` (webkit) | `[0, 844, 390, 595.16]` | `[0, 844, 390, 627.98]` | **+32.82 h** |
| `.action-bar` (chromium) | `[8, 1370.23, 374, 62.94]` | `[8, 1403.06, 374, 62.94]` | **+32.83 y** |
| `.action-bar` (webkit) | `[8, 1370.22, 374, 62.94]` | `[8, 1403.05, 374, 62.94]` | **+32.82 y** |

The number pass 1 saw is the number one regime gives, in both engines, to the hundredth. It is
not an artefact. Its author is named: `crit-scene.spec.ts` arm A reads the card's captions at 390
as `marks (h 44) · candidates (h 44) · your cell (h 44)` and the roster's box as **1 × 1** — the
roster was already `sr-only` in the solo scene at HEAD, so **the well pays 32.83 px for the new
`your cell` row and is given nothing back**. The action bar — the row that carries the invite
verb the family cites (R5 F8: "the invite verb sits 111px below a phone's fold") as its reason
for existing — moves **32.83 px further down the page**.

This is curable by declaring it. It is not curable by calling it an emulation.

## 3 · PRM NEVER REACHES THE OPEN SHEET

`PlayerLobby.vue:306-310` ships
`@media (prefers-reduced-motion: reduce) { .player-lobby { transition-duration: 0s, 0s, 0s } }`
— specificity (0,1,0). `.player-lobby.is-open` (0,2,0) re-declares the whole `transition`
shorthand at `:250-253`. A media query adds no specificity, so the override loses on the one
state that matters. Measured under `reducedMotion: "reduce"`, both engines, identical:

```
shut : transition-duration "0s, 0s, 0s"      (the rule bites)
open : transition-duration "0.15s, 0.15s, 0s"  (it does not)
```

So under PRM the sheet **fades and scales for 150 ms on open** and only the close is frozen. The
spec's §5 row says "the sheet · 150ms `--ease-standard`, `.hover-card` verbatim" and asserts PRM
only for the sign's ink — so the design never claimed this, but it wrote a rule that looks like
compliance and does nothing, and CH-65's estate is a PRM-void campaign. The cure is one
selector (`.player-lobby, .player-lobby.is-open`) plus one born-RED assertion on the computed
duration in the OPEN state. Note also that HEAD's `.hover-card` carries **no** PRM block at all —
the incumbent has the same defect un-papered, which is a cross-pollination row, not this
family's.

## 4 · TWO LANDED ESTATE GATES GO RED, UN-RE-CUT AND UNREPORTED

`e2e/zone-grammar.spec.ts` against the prototype, chromium: **9 passed, 2 failed.**

```
:55  rendered-name census, rail  → captions ["marks","candidates"] + "your cell"   RED
:548 coarse regime, the card     → countAt(names,"caption")  expected 2, got 3     RED
```

The lane re-cut the UNIT twin of exactly this census (`GameControlPanel.test.ts:325` "THREE",
`:410` "FIVE") with a reason in the diff, and left the e2e half alone — and did not run it, so
the return does not carry the row. This is the estate's own banked rule (a ruling lands with its
enforcing config in the same commit) failing on the one surface the family added to. Both are
re-cuttable with the same sentence the unit twin already carries; neither is re-cut.

## 5 · THE LAP LAW'S RESIDUAL — THE LANE'S THREE CANDIDATES ARE ALL REFUTED

The return leaves `+4.73 / +4.71` open and offers three candidates: "the `.lobby-rows` 0.1rem gap
accumulating, the `and N more` line's own rung, a qualifier row being taller". I measured every
drawn row's own box at 390×844 with six in the room, sheet opened by a real press, both engines
identical:

```
sheet 284.58   rows: 22.39 "…-rooster you" · 22.39 · 22.39 · 22.39 · 22.39 "and 4 more" (.pl-more)
```

Every row is **22.39 px**, the `and N more` line included — it carries class `pl-row` and is the
same height as a named row — and the `0.1rem` gap gives exactly the law's **23.99 px per row**.
So the gap does not accumulate, the `and N more` line has no rung of its own, and no qualifier
row is taller. **The residual is not in the rows.** It is in the sheet's own furniture: the
`display:flex; gap: 0.5rem` chain between the state line, the chart and the `<ul>`, the chart's
own box, or the state line. The candidate list is spent and the term is still unnamed.

---

## 6 · THE REST OF THE OPEN GAPS

- **No gate lands anywhere.** Plan step 7's `e2e/player-place.spec.ts` **does not exist**; every
  G-row lives in `web/frontend/probe/`, untracked, outside `tsconfig.e2e.json` and outside
  `lint:motion`'s 34 specs. Everything proven this pass is proven once, by hand, and enforced by
  nothing. The `PRM:` line the plan promised has no file to sit in.
- **Plan step 1's `join-language-prm.spec.ts:97` re-aim never happened.** `arriving`/`departing`
  left the card, but the spec still reads `.controls-card .player-row`'s `animationName`,
  `clipPath` and `.player-name` — now on an `sr-only` clipped list — so it passes on a surface
  that no longer draws. Four more estate specs read the same roster selectors
  (`presence.spec.ts:48`, `session-substrate.spec.ts:29/:206/:225`, `access.spec.ts:370`,
  `follow-still-authorship.spec.ts:71`) and none of the five was run.
- **The sign has no `:focus-visible` rule.** §1's token row and §3.2's state table both promise
  `2px dashed currentColor` offset 3; `PlayerSign.vue` ships none (`grep focus-visible` over the
  three new components: zero hits), so the keyboard ring is the UA's — the same ring the chair's
  §6.1 measured at 2.147:1 on the chips.
- **The gate the family minted cannot fail for the string that varies.** `N other players` — the
  sign's accessible NAME in every room of ≥2, and the sheet's state line — is composed as a
  template literal at `lobbyCopy.ts:25`, OUTSIDE `LOBBY_COPY`. Neither the `lobbyStrings` font
  derive (`/^\s*\w+:\s*"([^"]*)"/`) nor `COPY_SOURCES`' jargon arm reads it. Its codepoints
  survive by accident, through `no other players` and `1 other player`.
- **WebKit's G1 is still the one number owed** (the lane's own gap 4): 40.6 at 700, 0.6 over,
  reproduced from pass 1 to the decimal, and the 800 arm landed only on chromium. The SLOW
  control that would say whether 40.6 is a reading or a floor has never completed, in five
  attempts across two passes.
- **The count and the chart disagree and nothing reconciles them.** The banked 9×9 frame reads
  `4 other players` over a chart carrying **2 dots and a ring**, and the rows give a dot-less peer
  no qualifier — `you` and `N seconds ago` are the only two. A peer with no ink, one who looked
  away and one on `Hidden` are indistinguishable from a peer the chart simply failed to draw.
- **T7-W2 A4 is retired without a disposition.** "A log you can hear added to but never read back
  is half a cure" loses its `tabindex="0"` and its unit row is rewritten in this diff. The
  argument is good (an `sr-only` list is read end to end, and the sign is a Tab stop that opens
  the drawn list) — but retiring a previous wave's ruling is a chair/owner row, not a lane's.
- **An r0 row moved and was not reported.** `r0/r2-accent-family/census/census-*.json` carries
  `.player-swatch` as a selector row in all four files; this diff deletes that class. Only I3 was
  filed MOVED.
- **The re-pointed instrument is one room away from throwing.** `.pl-more` carries class
  `pl-row` and holds no `.pl-swatch`; `join-language.spec.ts:175` finds the first row whose
  `.pl-qualifier` is not `you` and then non-null-asserts `.pl-swatch circle`. At `slots: 2` with
  three in the room the drawn rows are `you` + `and N more`, and the instrument throws rather
  than fails.
- **Still open from the lane's own list, unclosed here**: G15 is unit-only (gap 13), the desk lap
  is unmeasured (gap 9), the `your cell` crop is unbanked (§13), the lap probe / crops / units
  are chromium-only (gap 11), G5 showed two nulls where the gate says one (gap 5), and the
  subgrid rule paints 4:1 brighter than the spec's `color-mix` model (gap 10) — a model wrong by
  4× on one row, reported rather than buried, which is the right instinct and still an open
  question about the other eight rows.
- **Frame captions do not match their frames.** The return calls the phone crop "N=3 … 2 dots +
  1 ring"; it reads `4 other players` over 5 rows. The dark crop is called "N=6 … 5 dots"; it
  reads `7 other players` over 6 dots. The pictures are fine; the captions are not the pictures.

---

## 7 · FAILURE-MODE CHECKLIST

| item | verdict |
|---|---|
| vacuous convergence | CLEAR — every G-row is a number that could have come out the other way, and G1 did |
| spec cites itself | CLEAR — the tokens trace to `index.css` and the measured bytes |
| gates that cannot fail | **HIT** — no `e2e/player-place.spec.ts`, so no gate lands at HEAD at all; and `LOBBY_COPY`'s two gates miss `N other players`, the one lobby string that varies |
| the elegant-reduction trap | **HIT (soft)** — the lap law is a law with an unnamed term; "and then the hard part" is `+4.7` |
| legacy aliases | CLEAR — `selfCursor`, the 96px box, the 1.5px ring, the 80% ground, `@click.stop` and the `?? --color-user-ink` fallback are deleted, not renamed |
| masked fallbacks | CLEAR — the `?? var(--color-user-ink)` default is the one this family went out of its way to kill |
| unverified gestalt | **HIT (soft)** — three crops, each captioned for a scene it does not show; the `your cell` row has no crop at all |
| consumer-less substrate | CLEAR — `useBoardShape` (written at `BoardHost:108`, read by the lobby), `PRESENCE_QUIET_MS`/`quietMs`, `shareCursor` and `lastCell` each have exactly one reader |
| the generic default | CLEAR — no eyebrow, no marker, no arrow; the chart is the board's own `generateGridBoilFrames` paths at pose 0 and the swatch IS the dot |
| the pixel it moves that it did not declare | **HIT, measured** — `.controls-card` +32.83 and `.action-bar` +32.83 at 390×844, both engines, one regime (§2) |
| the constraint it forgot | **HIT ×3** — PRM on the open sheet (§3); the `:focus-visible` ring §1 promises and no file writes; `zone-grammar`'s landed census (§4) |
| AA | HOLDS where I could re-derive it (ring 5.00 on the opaque ground, both engines, matching the lane to the hundredth). My own model reading of `--ink-press-quiet` is **void** — it computes to `color(srgb 0.15 0.15 0.15 / 0.68)` and a naive ratio ignores the alpha; the lane's painted-byte 5.16 / 6.02–6.10 stands as the reading, and it stands on the right condition (the sheet lapping the wordmark by ~7,300 px² while it is taken) |
| filterBudget | **HOLDS, at the estate's own gate** — `e2e/filter-census.spec.ts` 6/6 on the prototype, exact-match allowlist, coarse arm included |
| M16 | HOLDS — `check-copy-register` 0/0 over 142 files, re-run by me |
| W2's landed mechanics | HOLDS as mechanism (the sticky tag, dock and bottom tab are untouched; `--tap-floor` is read, never written; the option row is `OptionSelector`'s own grammar with `aria-pressed`) — but see §4: the well's own census is not re-cut |
| the decided history (r0/R6) | MOSTLY — hue census byte-identical, law 14's one affordance honoured, law 32/33 honoured; two misses: the unreported `.player-swatch` r0 row and T7-W2 A4's undisposed retirement |

---

## 8 · WHY 70, AND WHY ADVANCE

70 is what is left after the family's own claim is granted in full. The retire trigger is the
reason this family exists and it is answered in two one-site lines that I re-measured in both
engines without the lane's help. The chart is a real seating chart at every board size, the
budget is unmoved at the estate's own exact-match gate, the copy register is clean, no chromatic
token is minted, and the one-CSS-state query is the right grammar for attribution. Nothing here
is a rewording and no primitive is missing, so this is not RETIRE and not BLOCK.

What holds it at 70 is that three of the four hardest findings in this critique are things the
lane could have measured and did not, and one of them it explicitly explained away. π is the
gate this family declared a gap and the gap was hiding a real +32.83; PRM is a rule that exists
and does not fire; `zone-grammar` is a landed gate this diff reds. None is expensive to cure —
a declaration, a selector, a re-cut with the sentence the unit twin already has — but until they
are, "earned" is the wrong word for anything above the seventies.

**Conditions on ADVANCE, in order of weight:** declare the well's +32.83 in §6 and re-read the
invite verb's distance below the phone fold · make the PRM override reach `.is-open` and gate it
born-RED · re-cut `zone-grammar.spec.ts:55` and `:548` in the same diff as the row that reds them
· land `e2e/player-place.spec.ts` so a single G-row survives this pass · re-aim
`join-language-prm.spec.ts:97` and run the four other roster specs · get WebKit's 800 ms reading
and a SLOW control that completes · name the lap law's missing term outside the rows, or drop the
law to a measured table.
