# PASS-2 CRITIQUE · PLR-COUNT · The tally

Adversarial read by a lane that wrote neither the spec nor the prototype. Everything below that
carries a number was read off the prototype's own worktree on this lane's own servers
(`127.0.0.1:4243` prototype, `127.0.0.1:4244` the MAIN tree at HEAD `a8fee1f5` as a read-only
control), chromium AND webkit, both killed before this return. Instruments and readings:
`critique/PLR-COUNT/instruments/` · `critique/PLR-COUNT/readings/` (56 KB, no frames — the
prototype's four crops are the family's four).

**CONVERGENCE: 82%. VERDICT: ADVANCE.**

---

## 1 · What I re-measured, and what held

| row | the prototype's claim | my reading | verdict |
|---|---|---|---|
| G3 width | 44 · 51.66 · 72.92 · 44 | **44.00 · 51.66 · 72.92 · 44.00**, h 36 at every N, chromium and webkit | HOLDS |
| G7 one base | `1 player` / `N players`, strokes == N ≤5, the digit inside the name | `1 player`, `3 players`, `5 players`, `6 players`; strokes 1/3/5/**0**; `.pt-count` `6` ⊂ `6 players` | HOLDS |
| G5 filters | 9 live, 15 defs | **9 live / 15 defs** with the tally boiling, both engines | HOLDS |
| G14 sheet AA | 5.159 / 6.021–6.099 quiet, 14.651 / 12.163 name | computed off the tokens independently: quiet **5.236 / 6.099**, name **14.651 / 12.163**, self ink@0.95 on the sheet **4.579 / 6.849**, head stroke@0.95 on the page **4.495 / 6.901**, written count **4.912 / 7.519**. Painted `.pl-state` reads `color(srgb 0.15 0.15 0.15 / 0.68)` over `rgb(252,251,251)` — the opaque ground is real | HOLDS; pass 1's 4.166 is cured |
| R6 decided history | "byte-identical to r0's" | I ran their re-pointed census and diffed it against **r0's own `hue-census-HEAD.txt`**: identical, 29 rows | HOLDS (stronger than claimed) |
| M16 | 0 dashes, 0 unadmitted jargon | `check-copy-register` EXIT 0, 2 admitted hits, both pre-existing | HOLDS |
| unit rows | 807 passing | the three touched files: **3 files / 52 tests**, all passing | HOLDS |
| **π** | not claimed as a census | my own: `.attribution-trigger` box is **byte-identical** proto vs HEAD at desk-playing, desk-gallery, phone-playing, phone-gallery; `svg.handwritten-logo`, `.controls-card` identical everywhere. `.corner-left` grows **75.53 → 119.53** on the PLAYING view only, exactly the mark's own 44px | **CLEAN** — the deck moves nothing, and the one moved box is the declared mark |

Three pass-1 defects are cured and each cure is a measurement, not a sentence: the crossing
(dashoffset never leaves `0` downward), the two popovers on one anchor (`elementFromPoint` at a
row is the row; the card holds `opacity 0`), and the number that read two ways.

## 2 · The defect this diff ships

**C1 — the peer's ink no longer reaches the well's text, and three estate reads were not
re-pointed.** The diff deletes `.player-row { color: var(--color-user-ink) }` and `.player-name`'s
whole rule from `GameControlPanel.vue` while keeping `.player-swatch`'s (chair §7, correctly).
`.player-swatch` is not the only reader of that ink. Measured on a real `?wire=local` room, three
people, **both engines** (`readings/c1-roster-ink-{chromium,webkit}.json`):

```
peerRowColor   rgb(10, 10, 10)      selfRowColor  rgb(10, 10, 10)      <- identical
peerNameColor  rgb(10, 10, 10)
peerSwatchBg   oklch(0.5 0.11 137.5)                                   <- still the peer's ink
peerRow --color-user-ink  oklch(0.5 0.11 137.5deg)                     <- bound, unread
```

So, in the diff as it stands:

- `e2e/join-language.spec.ts:97–104` — `expect(stroke).toBe(rosterInk)`, where `rosterInk` is
  `getComputedStyle(peerRow).color`. Now `rgb(10,10,10)` against the trace's oklch. **FAILS.**
- `e2e/join-language.spec.ts:163–176` — `expect(peerColor).not.toBe(selfColor)` and
  `expect(swatch).toBe(peerColor)`. Both **FAIL**: the two rows are one colour now.
- `e2e/join-language-prm.spec.ts:83–100` — reads `.player-name`'s `animationName` and `clipPath`
  and asserts `none`, and asserts the row has no `is-arriving`/`is-returning`. Every one of those
  classes, keyframes and rules is deleted by this diff, so the four assertions are now **true by
  construction**: a PRM spec that can no longer fail. Item 7 of the PLAN says
  "join-language-prm:97 re-aimed"; the file is untouched in `git status`.

This is the chair's §7 rule applied to only one of the two halves it governs: the swatch stayed,
the rule that carried the same ink to the same row's TEXT did not, and its readers were not
re-pointed in the same diff. Mechanical to close — three reads, one file each — but it is a
shipped regression, not a gap.

## 3 · The gaps, exactly

1. **`e2e/join-language.spec.ts:97` and `:165` read `.player-row`'s computed `color` as the peer's
   ink; the rule that set it is deleted, so both now read `rgb(10,10,10)` and both fail — re-point
   them at `.player-swatch`'s `backgroundColor` (or at `[data-lobby] .pl-row .pl-row-mark path`)
   in this diff.**
2. **`e2e/join-language-prm.spec.ts`'s four row assertions are now vacuous — the classes,
   keyframes and rules they name no longer exist — so the spec must be re-cut against what
   survives (the ring's `progress`, the register's own still-ness) or struck.**
3. **`N seconds ago` never renders on any measured surface: every banked and re-run reading shows
   `qualifiers: ["you"]` and nothing else, so one of the five `LOBBY_COPY` strings — and its AA on
   the opaque ground — is asserted by the font cut and the copy census but proven by no gate;
   drive a peer past `PRESENCE_QUIET_MS` (20 s) with a frozen clock and read it.**
4. **On a short phone the register names nobody: `ROWS.short = 2` means `shown = slice(0, 1)`, so
   from N=3 upward the sheet lists only YOU and says `and N−1 more` (frame 3 at N=16 is the
   picture) — the surface whose office is "who is here" degrades to a second saying of "how many"
   in the regime the family priced the lap for.**
5. **The most-seen state of this family is undecided: with no room at all, `SOLO` gives every
   ordinary single-player board a permanent 44×44 head control reading `1 player` whose register
   is one nameless row (measured: the plain `?size=3&difficulty=EASY` board carries the mark) —
   the spec decides the deck's asymmetry and not this one.**
6. **G13 is inherited, not run: `DifficultyTally`'s `d` attributes were never diffed against HEAD
   on this tree, and the control now exists — serve the main tree read-only on a second port (as
   this critique did for π) and diff the serialized `d` set.**
7. **The register is unreachable to a focus-driven AT: the mark publishes `aria-expanded` and
   `aria-controls`, the sheet holds zero focusables, and `@focusout` closes it — so the disclosed
   content can only be read by a virtual cursor, and the family's own gap 9 names only the
   narration half.**
8. **`LOBBY_SAMPLES` is exported with zero consumers — both derives (`check-font-coverage`'s
   `lobbyStrings`, `check-copy-register`'s `COPY_SOURCES`) read the source text by regex and never
   the export — so it is a substrate nothing uses; delete it or make a derive import it.**
9. **Both new census arms fail OPEN: `check-copy-register`'s `if (!block) continue` and
   `check-font-coverage`'s `if (!block) return []` mean a rename, a move, or a reformat of
   `LOBBY_COPY` silently drops a whole surface's copy from the census instead of reddening it.**
10. **`.pt-mark` reads `var(--tap-floor)` twice with no fallback, against the token's own declared
    law (`index.css:821`: "The fallback is the shipped literal, so a consumer mounted outside
    `.page-root` still lands on 44px rather than on `initial`") — and the family's gap 8
    misattributes the empty `documentElement` read to a media query when the token lives on
    `.page-root`.**
11. **The 5↔6 swap is declared as geometry and never judged as a look: frame 1 shows five bold
    coloured strokes giving way to one small blue digit, so the mark reads LESS present at six
    people than at five — the family measured that no neighbour moves and never asked whether the
    magnitude reads monotonically.**
12. **The banked probe cannot be re-run as its own README §5 documents: `npx playwright test
    --config <probe>/pw.config.ts` from the worktree dies with `Cannot find module
    '@playwright/test'` (reproduced against the prototype's own config), because nothing above
    `docs/` resolves `node_modules` — bank the `NODE_PATH` the run actually used.**
13. **G4's peer half is unreadable in PW-WebKit (0/0/0, each page seeing only its own digit), so
    the authorship law is proven in one engine and named in the other.**
14. **The Tab route is not PLR-SELF §3.1's: chromium reaches the mark at press 4 (@mbabb → 2 card
    links → DEV toggle → mark), webkit never reaches it at all.**
15. **The deck's own count is unowned: `N other players` was retired on the board and the deck now
    carries no mark, so nothing anywhere says how many people are at the table you are leaving —
    self-declared as "and then the hard part", and still nobody's row.**
16. **The family law is unmovable here: 12.7° webkit / 13.3° chromium minimum painted pairwise hue
    separation from N=3 (visible in frame 2 — the self blue and walk index 2 read as one colour at
    row scale), handed to PAL-TIN with `pixels.mjs`; 100% is unreachable inside this family.**

## 4 · Checklist

- **gates that cannot fail** — G13 (inherited, never run); `join-language-prm`'s four rows (now
  true by construction); the width probe asserts `< 1.5` px against a table reported "to 0.01".
- **consumer-less substrate** — `LOBBY_SAMPLES`; `export { tall }` (no importer outside the file).
- **masked fallbacks** — both new census arms' silent `continue` / `return []`; `var(--tap-floor)`
  with no fallback.
- **legacy alias** — `.player-swatch` kept as an explicit debt (chair-sanctioned, and the debt is
  now larger than the chair priced it, per §2).
- **the constraint it forgot** — the estate's own instruments (§2) and `--tap-floor`'s fallback
  law. AA, filterBudget 9, M16, W2's sticky tag / dock / bottom tab and the decided history at R6
  are all clear, each verified here rather than accepted.
- **unverified gestalt** — the quiet rung (gap 3) and the 5↔6 step (gap 11).
- **the elegant-reduction trap** — the deck's count (gap 15), self-declared.
- **π** — clean, and now measured against a HEAD control rather than asserted.
- **vacuous convergence · spec-cites-itself · the generic default** — no hits. The spec's numbers
  are falsifiable and every one I re-ran reproduced.

## 5 · Strengths

- **One counting base is real, not rhetorical.** The glyph's digits are a substring of the
  accessible name at every N I drove (1, 3, 5, 6), and the name counts what the strokes count —
  2.5.3 by construction rather than by assertion.
- **The crossing cure is mechanism.** `watch(drawn, …)` settling on `!was || now < was`, plus
  `useTallyStrokes`' per-stroke `Map<number, SequenceHandle>` (so re-arming one member cannot
  un-draw another), is a general repair of a defect class, not a patch on one symptom.
- **The pose is the person's, and the geometry proves it**: one local origin, the slot as a
  `transform`, `:key` the id — a middle departure changes four transforms and no `d`.
- **The opaque ground is earned.** It is the one declared delta from the @mbabb pose, it is
  measured (0.00% ground spread), and it is what moves the quiet rungs from 4.166 to 5.236/6.099.
- **`claimHeadDisclosure`** solves the two-popovers-on-one-anchor class at the anchor rather than
  per surface, and the cure carries a measured negative (frame 2).
- **The deletions are honest.** `useJoinWash`'s roster half, the three one-shots, the scrollport
  and its tab stop go with the pixels they animated, each with its reasoning left at the site.

## 6 · Cross-pollination

1. `claimHeadDisclosure(close)` — every family hanging a popover on the head corner (UI-6's card,
   the marks families, the gallery's own) should consume this one Set rather than mint a second
   coordination.
2. The per-member draw map in `useTallyStrokes` — the general cure for any staggered set reveal
   (the reveal wave, the join wash, the difficulty tally) where re-arming one member silently
   stranded another at `reveal = 0`.
3. Geometry at a local origin + slot as `transform` — hand to every family drawing a list of
   objects that can lose a middle member.
4. The `COPY_SOURCES` class rule ("a constant declared as one surface's copy renders copy") is the
   right generalization for every family moving copy out of templates — but it must fail closed
   before anyone else adopts it (gap 9).
5. The π rect census against a read-only HEAD control server (this critique's C3) is cheap, and
   every pass-2 family that claims "costs zero pixels" should run it.
6. The one-base gate shape — the drawn mark's digits ⊆ the accessible name — belongs to any family
   putting a number on a control.

## 7 · The verdict

**ADVANCE at 82%.** A running prototype on the real surface in both engines, three pass-1 defects
cured with measurements, every constraint I could check independently (AA, filterBudget, M16, π,
the decided history at R6) holding, and a spec whose numbers reproduce. It is not 100 and not
close to it: it ships one regression in two estate specs (§2), leaves one of its own five strings
unrendered by any gate, degrades to naming nobody in the short regime, and has not decided the
state its every solo player will see. None of those needs a primitive this family does not have —
they are a pass-3 diff, which is what ADVANCE means here rather than BANK.
