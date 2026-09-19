# PAL-TIN — pass 2 critique (adversarial, non-author)

Convergence **72%**. Verdict **ADVANCE**. The colour half is the best-measured thing in this
wave and I could not break it. The DRAWN half — the tick's corner — is refuted on the real
surface: the mark the design rests its capacity claim on is drawn inside the hint laminate's
body and across both its rim and the peer/invalid ring's stroke, in the ink those rings are
already wearing. The spec asserted the opposite ("no new tenant collision"), the prototype
banked the row as UNPROVEN, and it is now measured, both engines.

What I ran myself: my own OKLab/WCAG arithmetic off `index.css` (no estate code reused); the
gate bare; the r0 `law-probe.mjs` copied and re-pointed at the prototype tree; four Playwright
rows on my own server (127.0.0.1:**4243**, `--strictPort`, private `cacheDir`, killed; the
scratch spec and config were removed from the worktree, whose `git status` is byte-identical to
the prototype's). Instruments and readings: `critique/PAL-TIN/{instruments,readings,logs,frames}`.

---

## 1 · What holds (re-measured, not taken on trust)

**The palette is real.** My arithmetic, written from scratch against the ten declarations and
the nine cell inks, agrees with the prototype to the third decimal:

| row | mine | theirs |
|---|---|---|
| light worst AA (peer-3 on bg) | **7.163** | 7.151 |
| dark worst AA (peer-5 on card) | **5.191** | 5.178 |
| light worst ΔE to a CELL ink (peer-4 vs solver-ink-3) | **0.0822** | 0.082 |
| dark worst ΔE to a CELL ink (peer-4 vs user-ink) | **0.1003** | 0.100 |
| min pairwise ΔE light / dark | **0.1162 / 0.1724** | 0.116 / 0.172 |
| ring at 0.80 over its own 4% fill, worst light / dark | **4.290 / 3.629** | 4.263 / 3.617 |
| the same ring at HEAD's 0.55 | **2.528 / 2.345** | 2.316 / 2.342 |

(The ≤0.03 spreads are hsl()→sRGB rounding on the two grounds; the engines' own bytes are the
prototype's.) The gate runs bare at exit 0 here, exit 1 on the pass-1 tokens, exit 2 on HEAD,
and `--self-test` reds all four controls. The ceiling self-correction (0.100 → 0.103, score
0.90 → 0.80) is the single most honest act in this pass's record: a gate that refuses its own
author is the opposite of a gate that cannot fail.

**The wire rule is the wave's, not this family's, and it is right.** Agreement keyed on
`from === e[1]`, read *before* the epoch is written, cleared on a fresh author, publish-side
agreement deleted. U1/U2/U3 are born-RED against the states they name, and the spec's wrong
booking (U2 "GREEN at HEAD") is corrected in the record rather than papered over.

**Solo stays solo.** `authorInk` skips an empty ink so no `style` attribute lands on a board
with one hand on it; `withSelfInk` binds on the second known id, not on the invite press.

---

## 2 · What is refuted — the corner has three tenants, and the tick is drawn over two

Measured on my server, 6-peer room, the sixth peer's digit, dpr 2–3, chromium and webkit
(`readings/c2-*.json`, `c6-*.json`):

```
tick ink box (cell-%)        x 11.87–12.16   y 84.97–97.03   (both engines, both viewports)
laminate .cell-because       x 9–91          y 8.98–91.02    rim 2px = 2.83 cell-% at desk
   left rim band  [9, 11.83]        tick clears it by 0.17 cell-% = 0.12 px
   bottom rim band [88.19, 91.02]   tick crosses 2.83 cell-% — THE WHOLE BAND
   laminate BODY  [8.98, 91.02]     tick sits 6.04 cell-% inside the 15% teacher-red wash
peer/invalid ring .cell-ghost-path  x 11.28–88.52  y 11.16–88.79  stroke 3.46 cell-%
   left stroke band [11.28, 14.74]  the upright's whole 0.28 cell-% width is INSIDE it
   bottom stroke band [85.33, 88.79] tick crosses 3.46 cell-% — THE WHOLE BAND
```

A real hint press (`h`, `GameBoard.vue:596`) landed a `.cell-because` on a ticked cell on the
first try (`becauseOnTick: 1`, chromium desk) — so this is not a contrived state, it is the
ordinary one: nine because-cells at a time on a board six people are writing on.

`frames/tick-inside-the-ring-light.png` (7.7 KB) is the ring armed over the ticked cell. The
tick does not read as a tally beside a digit; it reads as the ring's bottom-left corner having
sprouted a tail, in the ring's own colour, because the peer-cursor ink and the author ink are
the same stick.

The spec's clearance sentence measures the wrong edges: "x 8 is 7.4% clear" compares the tick
to the laminate's *outer* edge (9%) and never mentions the bottom rim or the body at all, and
the prototype's T4 banked `ghostBottomPct 88.53` against `tickTopPct 84.97` — an inequality that
is the wrong way round for clearance — and reported it as a pass. At phone widths it gets
worse, not better: the rim is 4.97 cell-% there, so the left band runs [9, 13.97] and the
upright at 11.87–12.16 is *inside* it as well.

There is a cure and it is small — the band y 91.5…98.5 is below the laminate's 91% and below
the ring's 88.8%, which is the only 9 cell-% of the cell nothing else owns — but it is a
geometry re-cut with its own numbers, and every geometric number in §1.3/§1.4 of the spec moves
with it.

---

## 3 · The decided history: L6 is BROKEN and the record does not say so

`loop/r0/r6-idiom-history/law-probe.mjs` asserts **L6** — "the per-player ink is a formula, not
a palette: hue = i × 137.5° at a banded lightness" — as a **π row** (GREEN at HEAD, must stay
GREEN through every W7 cure). Copied and re-pointed at the prototype tree
(`instruments/law-probe-repointed.mjs`, writes nothing, r0 untouched):

```
L6   GREEN  RED   !the per-player ink is a formula, not a palette …
BROKEN: L6          exit 1
```

The tin is *entitled* to move that law — it is repealed by measurement (12 sticks at min ΔE
0.024), which is exactly how R6 law 22 should die. But the charter's rule is that an instrument
whose subject a design moves is proposed as a **diff** under `pass2/<stage>/<id>/instruments/`
and the r0 row is reported **MOVED**. The plan's MOVED list names the r6 hue-census tail and
two `multiplayer.spec.ts` comments; it does not name the law probe, the prototype never ran it,
and the record therefore leaves the estate's own law list asserting the walk this design
deletes. R6 law 21's cite (`index.css:154-161`) also now points at moved lines.

---

## 4 · The gate nobody runs, and the gates that were never landed

- `lint:tin` is added to `package.json`. **`ci.yml` has no reference to it** (`grep -r
  'check-peer-tin\|lint:tin' .github/` = zero). The sixteen lanes enumerate each `lint:*` by
  name — the file even carries the estate's own confession beside `lint:ink`: "the script
  shipped at T4-P1 Lane D ship 4 and until now nothing in CI ran it." This pass re-mints that
  exact defect.
- Every e2e row in the family's GATES list (ring ≥3:1, the tick's geometry, the stroke law,
  print/forced colours, the one-person room) lives **only** in the lane's scratch spec, which
  was deleted from the worktree. The diff lands two comment re-words in `multiplayer.spec.ts`
  and nothing else in `e2e/`. As it stands the design ships with no regression that can go red
  when someone moves the tick, the ring's opacity, or `.player-name`'s flex.
- The prototype's own gap 3 (no golden run) is real and it is the row most likely to bite:
  `index.css` moved ten declarations and `gameCell.css` moved the ring's alpha.

---

## 5 · Smaller, but each one closable

1. **"Fills gaps only" is not what the code does.** `adoptInk` guards only ids in `inkAgreed`:
   a non-authoritative `st` still *overwrites* an id this page minted provisionally. A row
   where a known-but-unagreed peer is moved by a non-author is RED against the rule as written
   and GREEN against the code. Either the sentence or the branch is wrong; U1 does not
   discriminate, because its subject was agreed first.
2. **The π census is blind to the pixel this family moved.** `.player-name { flex: 0 1 auto }`
   shrinks the name box from 227.03 px to 71.02 px and moves the `you` pill 156 px left — on a
   roster with **zero ticks** (three players, the ordinary room), measured by ablation on the
   same page, both engines (`readings/c3-roster-*.json`). The prototype's π row reads "roster
   rect delta 0.00 px" because it measures the container. The move may well be right; it is
   undeclared at the only size anyone has today, and unphotographed.
3. **Three cited crops do not show what they are cited for.** `roster-sixteen-light.png` is the
   legend claim and shows a **three-row** roster with **no tick** (the clip took the controls
   card's top 620 px). `tick-16x16-phone-dark.png` shows the deal card's "new game / size /
   4×4" chrome and **no board and no tick**. `tick-corner-under-1-light.png` is captioned
   "amber 1 beside amber 1" and shows a **green** 1 beside a black 9. The DOM numbers behind
   T6 are real and passed; the *gestalt* is still unverified, which is the checklist item.
4. **A missing token fails silently.** `TIN` names `var(--color-peer-N)` five times; nothing
   asserts that five declarations exist per arm. Delete one and the custom property is
   guaranteed-invalid, `--color-user-ink` inherits, and that player is silently drawn in the
   incumbent blue — one player wearing the estate's own ink, with no gate red. The gate reads
   `index.css`; it never reads `playerIdentity.ts`.
5. **The ring's own tenants are the same colour.** `--color-peer-cursor-ink` falls back to
   `--color-user-ink`, which in a room is now the *cell author's* stick. A peer pointing at a
   cell someone else wrote paints a ring in the writer's colour around a digit and a tick in
   the same colour. The comment at `gameCell.css` says the two are different people; the token
   chain says they can resolve to one colour.
6. `pencilConfig`'s header still says `DifficultyTally`'s stagger rides `glyph` (it now rides
   `tally`); the values are byte-identical (350/90), so nothing moved, but the comment is
   already stale in its own commit.
7. Carried from the prototype's own list and not re-tested here: r2 accent-kinship, the wobble
   σ, the print negative control, the draw-in timing, the relay arm, a real device, `domNodes`
   1234 → 1235, and the `source.snapshot()` shape seam.

---

## 6 · Checklist

| item | verdict |
|---|---|
| vacuous convergence | clear — every claim carries a number and three of them moved against the author |
| spec cites itself | clear — the gate re-derives its own ceiling in the run |
| gates that cannot fail | **HIT** — four negative controls exist, but nothing in CI runs the gate and no e2e row was landed |
| the elegant-reduction trap | clear — no "and then the hard part" |
| legacy aliases | clear — `--peer-ink-l` has zero refs, the walk is gone from source and comments |
| masked fallbacks | **HIT** — a missing `--color-peer-N` renders that player in the incumbent blue with no gate; `--color-peer-cursor-ink`'s fallback can make the cursor and the author one colour |
| unverified gestalt | **HIT** — all three cited crops show something other than their caption |
| consumer-less substrate | clear — every token and export has a reader |
| the generic default | clear — this is the house's own tally mark, not a template |
| the pixel it did not declare | **HIT** — the roster's 156 px, invisible to the π row that was run |
| the constraint it forgot | **HIT** — R6 **L6** is a π law and it is RED, unreported; the `.cell-because` rim and the ring were asserted clear and are not |
| AA / filterBudget / M16 / W2's mechanics | clear — AA re-computed here (7.16 / 5.19), census 9 with 16 players, no string minted, no new mechanic |

---

## 7 · Cross-pollination

- **The wire rule** (`adoptInk(k, from === e[1])`, agreement dies with its epoch, publish agrees
  nothing) is section-level law and should land once under §6's leader regardless of which
  palette wins. PAL-WALK's §3a is the same rule.
- **The ratio-to-a-re-derived-ceiling gate shape** — an absolute floor *and* a ratio to a
  ceiling recomputed from the same file in the same run — is the answer to "a bare number is
  gameable by lowering it". Every accent family's instrument should take it.
- **`seedFor` hoisted out of `slugFor`**: `p.id.length` was the same integer for every peer this
  estate mints, so any family seeding a wobble off an id has the same bug.
- **The corner is full.** Whichever family ends up drawing a per-player mark in a cell should
  take this measurement as given: the laminate owns 9–91% (body) with a 2 px rim, the ghost
  ring's stroke ends at 88.8%, and only y ≳ 91.5% is unowned.
- **The lightness argument** ("hue cannot separate ten inks at one lightness, lightness can",
  with the solver's dark pastels at L 0.81–0.92 measured) belongs in the registry as a finding,
  not as one family's paragraph.
