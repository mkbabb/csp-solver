# PASS-3 CRITIQUE · PLR-COUNT · The tally is the mark

Adversarial. I did not write the spec or the prototype. Base `74a2b5d9`; prototype worktree
`.claude/worktrees/wf_f72f3b5a-83a-52` (uncommitted, 7 tracked / 11 untracked). I re-served that
worktree myself on `127.0.0.1:4238` with a private `cacheDir`, drove both engines programmatically
(no PW config — a config outside `web/frontend` cannot resolve `@playwright/test`, and this lane
writes nothing into another lane's tree), and killed the server before returning. The band reads
`4231` and `4241` (other lanes'); `4238` is empty.

Evidence: `critique/PLR-COUNT/instruments/` (`recheck.mjs`, `settle-race.mjs`, `vite.critique.mts`)
and `critique/PLR-COUNT/readings/` (`recheck.json`, `settle-race.json`).

**VERDICT: ADVANCE · convergence 72%.**

---

## 1 · What I re-ran, and what it said

| claim | prototype | my re-run | |
|---|---|---|---|
| G3 width table | 44 · 44 · 51.66 · 62.28 · 72.92 · 44 | **identical to 0.01, chromium AND webkit**; extended to N=7 → 44.00, `7 players`, written `7` | REPRODUCES |
| G7 one base | `1 player` / `N players`, strokes 1..5 then 0, `6` ⊂ `6 players`, 25.888px | identical both engines; height 36 at every N (no step) | REPRODUCES |
| G14 sheet AA | ground `rgb(252,251,251)` / `rgb(18,16,15)`, worst word 5.159 / 6.021 | painted the computed `color(srgb …/0.68)` onto the sheet ground in a canvas: **[107,107,107] light → 5.159**, **[147,145,139] dark → 6.020** | REPRODUCES (my first arithmetic pass mis-parsed `color(srgb …)` and read 1.069 dark; the canvas paint is the honest read and it is the prototype's) |
| G2 stroke AA | worst 4.537 light / 6.849 dark at 0.95 | row stroke on the sheet 4.60 light / 6.83 dark; graphite 12.479 | REPRODUCES |
| G12 pre-game | 0 marks at `?view=gallery` | 0, both engines | REPRODUCES |
| G18 | knip EXIT 0, check-pw-projects EXIT 0 | **knip EXIT 0 · check-pw-projects EXIT 0 (8/8) · lint:copy EXIT 0, 0 dashes, 0 unadmitted jargon, 0 admissions** | REPRODUCES |
| filterBudget | "9 by construction" | counted every element whose computed `filter !== none` with the tally drawn and the sheet open: **0 of them are inside `[data-player-mark]` or `.player-lobby`** | CONFIRMED — the family adds nothing |
| woff2 | 4,312 B | `check-font-coverage.mjs` EXIT 0, Patrick Hand 46 codepoints / 4312 B; `unicode-range` carries `U+30-39`, so the written count really is in the hand | CONFIRMED (but see §2.6) |
| short regime on a DESK | self-declared gap | **CONFIRMED, both engines**: 1280×720, N=4 → `.pl-row` 2, `.pl-more` 0, H 106.14, two names of four | CONFIRMED |
| G9 "6→5 re-draws nothing" | GREEN | **FALSE for an inner leaver** — see §2.1 | CONTRADICTED |

## 2 · What is not converged

### 2.1 G9's headline clause is measured false, and the gate is scoped to the case that passes

`e2e/player-tally.spec.ts:151` proves 6→5 by sending `bye` from `ids[4]` — the **sixth** person,
who is outside `tallied = people.slice(0, 5)`. Their departure does not move `ids`, the watch never
fires, and of course nothing re-draws. I drove the other half: at N=6 (mark reads `6`), a `bye`
from the person at index 1 — **inside** the five — promotes the sixth into the tally and draws them
in. Measured, both engines, first frame after the bye:

```
chromium  ["0","0","0","0","52.863"]      webkit  ["0","0","0","0","56.298"]
```

Four survivors at 0, one stroke tweening from ~55 to 0 over ~280ms. The behaviour is defensible
(that person's stroke genuinely appears for the first time), but the spec's law and the gate's title
both say *6→5 re-draws nothing*, and that sentence is not true. Either the law restates ("only the
promoted newcomer draws in") or the row covers both leavers. As written this is a gate fitted to
the passing case.

### 2.2 `settle()` does not stop the tween, so the watch's third branch is inert

`useTallyStrokes.ts:138` — `settle(keys) { for (const k of keys) reveal[k] = 1 }` — writes the
reveal but leaves that key's `SequenceHandle` alive in `draws`. `PlayerTally.vue`'s watch takes the
`else settle(now)` branch on a **bare departure**, which is exactly the tick where another stroke
may be mid-draw. I drove it: three settled, a fourth arrives, 80ms later a different person leaves.

```
before the bye   ["0","0","0","46.42"]
after the bye    ["0","0","27.17"] ["0","0","14.58"] ["0","0","7.42"] … → 0
```

The newcomer keeps drawing: `settle` set `reveal = 1` for one tick and the live `onProgress`
overwrote it on the next frame. So the branch neither settles nor is harmless — it is a one-frame
jump to fully inked in the middle of a draw-in, invisible at my 40ms polling and unasserted by any
row. Either `settle` calls `draws.get(k)?.stop()` first (and the branch means what it says), or the
branch excludes keys that are mid-draw. No gate covers a departure during a draw-in.

### 2.3 G16's floor is the weakest threshold the artifact clears

The table the lane measured itself: 64.52 · 105.86 · 151.24 · 215.80 · 278.83 · **74.21** (N=6,
shipped rung). The floor is `ink(6) ≥ ink(1)` and it clears by 15.0%. But `ink(6) < ink(2)` by 30%,
`< ink(3)` by 51%, `< ink(5)` by 73%. The defect the gate was written for is "a magnitude that runs
backwards", and after the cure the magnitude still runs backwards everywhere except against the
single smallest state. The ablation in the same run (pass-2's subheading rung at 46.94, failing) is
the strongest row in the return and I do not want it lost — but it proves the rung is better, not
that the swap reads. The gate's *name* (ink-floor) is honest; the gate's *sufficiency* is not
established, and the return says so.

Two further holes in the same row: the absolute figures do not reconcile with pass 2's (64.52 vs
309.28 at N=1 — different instrument, different crop, neither recoverable), and `ink-weight.mjs`
ran on **chromium crops only** though the gate asks both engines.

### 2.4 The substrate was not there, and half the diff is scaffold

Four of the seven tracked files — `App.vue`, `AttributionCard.vue`, `useHoverCard.ts`,
`useSession.ts` — are declared SCAFFOLD replayed from pass 2, plus the window-bound Escape in
`PlayerTally.vue`. `pass3/prototype/PLR-SELF/` now exists on disk (it landed after this return), so
the seating this family was told to stand on was never taken. Everything about where the mark sits,
how the head's two disclosures share an anchor, and how the sheet is dismissed is therefore
unverified against the leader's actual design.

It is worse than "unverified": `wf_f72f3b5a-83a-53` (PLR-PLACE, same base) ships its **own**
`PlayerLobby.vue` and a separate `src/games/shared/lobbyCopy.ts` whose table reads
`no other players` / `1 other player` / `N other players`. Two lanes now hold two different files
of the same name with contradictory counting bases and contradictory copy homes (an exported
`LOBBY_COPY` inside the component here; a module there that `check-font-coverage`'s `lobbyStrings`
derive and `check-copy-register`'s `COPY_SOURCES` both read). This family stripped both of those
gate arms; PLR-PLACE kept them. The agglomerator does not just pick a counting base — it picks a
file.

### 2.5 R6 law 32 does not say what gap 15 cites it for

The spec closes gap 15 "by citation: `GameGallery.vue:217-222` owns the deck's `N other players`
(R6 law 32)". Law 32 reads, whole: *"**Counts, not feelings** — '3 other players', never 'several'.
`GameGallery.vue:219`."* It is a rule about digits over vagueness. It does not scope the phrase to
the deck and it does not make "everyone" the head's base. The citation is doing work the law does
not do, which is the circularity tell: the family's own choice is being read back out of the
record. Decide the base on the artifacts and say so; do not borrow an authority.

### 2.6 Gates that did not look

- **G4 (authorInk 0/0/1, peer half by `expect.poll` on both engines) WAS NOT RUN.** No two-page
  harness was built. The return calls the row "a tautology today" and it still is.
- **G15 (M19-whole: focus unmoved, sheet shut, label mutated on a third join) WAS NOT RUN.**
- **`26 seconds ago` is rendered by no gate.** `page.clock.setFixedTime` was not built; my own
  sheet reads showed only the `you` qualifier. One of four copy strings is asserted by nothing.
- **G5 did not run on the dist.** `npm run build` returned 0 and was never served; the estate's
  `filter-census.spec.ts`, titled "(built dist)", has `npm run dev` as its `webServer`, so the
  12/12 is a dev-server reading. (My own count of live `filter: url(…)` elements says the family
  adds zero either way, so the *claim* is safe; the *gate* is mis-titled and this lane inherited it.)
- **`check-font-coverage` is blind to this family's copy.** The pass-2 declaration was stripped, and
  the gate is a declared-strings gate — it passes because it never looked. I verified empirically
  that Patrick Hand's `unicode-range` covers the table (`U+30-39` for the written count, and check
  5's WRITEABLE regex already guards slugs against the cut's missing `j`/`x`), so nothing ships as
  a ransom note today. But the next word added to `LOBBY_COPY` ships unread.
- **No live-region census.** The spec's success list says "regions 6 in order, deck +1";
  `PlayerLobby.vue`'s own comment says "Three live regions before, three after". Two numbers, no
  measurement.
- **G1's runs census ran at N=1/3/5/6.** N=2 and N=4 were shot and ink-weighted but never pushed
  through `pixels.mjs`; "runs == N for 1…5" is proven at three of five counts, chromium only.
- **G17 arm B was never driven.** The owner gets one arm's artifacts against a fork the spec calls
  theirs (U-10).

### 2.7 The short regime is keyed on viewport height alone, and it fires on a laptop

`PlayerLobby.vue:41` — `matchMedia("(min-height: 800px)")`. I confirmed at 1280×720 desk, both
engines, N=4: two named rows, `.pl-more` 0, sheet H 106.14, state line `4 players`. A 13" laptop
with browser chrome is routinely under 800 px of content, so the *tall* regime — five rows, the
`and N more` foot, the whole roll call the family is about — may be the rarer case on a desk, and
the register silently names 2 of N with no mark of omission. The lane found this by accident and
named it; it is not a phone patch, it is the default desk reading. The regime wants the space the
sheet actually has (the anchor's bottom to the viewport floor), not a height query.

### 2.8 Smaller, each closable

- `useTallyStrokes` returns `drawing()` with the comment "the crossing gate reads it, nothing
  else". Nothing reads it — `player-tally.spec.ts:178` reads `stroke-dashoffset` off the DOM.
  A consumer-less member of a new composable's surface, invisible to knip because it is a returned
  property, not an export.
- `check-pw-projects.mjs`'s new HOLDOUT rationale says the Tab route "reaches the mark in chromium
  at press 4"; the return measures press **6**. The number moved and the shipped gate config still
  carries the old one.
- `--tap-floor`: the lane's §6.5 reading is right — `grep @property` over `index.css` returns
  nothing, the estate's own law at `index.css:821-828` says the fallback *is* the shipped literal,
  and `index.css:834/849` and `GameControlPanel.vue:1947` all spell `var(--tap-floor, 2.75rem)`.
  The fallback is lawful **today** and becomes a strike the day §10/§11's leader lands the
  `@property` registration §6.5 requires. Flagged forward, not against.
- π is a **rect** census. Moving the hover handlers from `.corner-left` to
  `.attribution-disclosure` narrows @mbabb's hover region — a real behavioural delta on a surface
  this wave does not claim, argued in a code comment and measured by no number. (It is
  `AttributionCard.vue`, i.e. scaffold, so it travels to the leader — but it travels undeclared.)
- The four cited frames do not name their engine, so the 5↔6 gestalt the owner is being asked to
  rule on (U-10) is shown from one engine without saying which. `frames/` also holds eight
  uncited instrument strips beyond the four-crop cap; they are small (324 KB total, well under the
  wave's 2 MB) and are instrument output rather than cited crops, so I read this as within the
  spirit of §7 and note it only so the sweep does not delete them unread.
- The family law (13.3° minimum painted pairwise hue separation at N=3 and N=5) reproduces and is
  correctly handed to PAL-WALK. Frame 1 shows it: at N=3 the first and third strokes read as one
  blue family. Earned-100% is unreachable inside this family until the walk lands, and the return
  says so rather than rounding up.

## 3 · Strengths

1. **The set-difference cure is real, named, and proven.** Pass 2 computed `ids` off `drawn`, which
   is 0 past the threshold — at six people the watched set was *empty*. `ids` over
   `people.slice(0, TALLY_MAX)` plus a set diff is the right shape, `draws`/`reveal` keyed by id
   (not index) is the right key, and the depart-and-arrive-in-one-tick row is a defect no prior
   pass had named.
2. **Per-key tweens.** "A tally is a SET: re-arming one member must not un-draw another", with the
   measured `["0","100","0"]` that motivated it. This is the composable's best idea.
3. **G13 with a real second server.** 20 `.dt-pose .dt-stroke` `d` values byte-identical against a
   HEAD control at `74a2b5d9`, `diff` exit 0 — the refactor's only honest proof, and it was never
   run in pass 2. The three candidate movers (tallyBoil, tallyStaggerMs, wobble key order) are
   named; I read the diff and the wobble object's key order does change, which is precisely why the
   byte-diff and not an assertion was the right instrument.
4. **The ablation in the same run.** Shipped rung 74.21 passes, pass-2's rung 46.94 fails, one
   instrument, one frame, one run. That is what a negative control looks like.
5. **Three gate lanes green on a tree that reds them at pass 2**: knip 0, check-pw-projects 0 (with
   a per-row HOLDOUT carrying its cite rather than a file-wide skip), lint:copy 0 with 0 admissions.
   I re-ran all three.
6. **The press contract.** `@pointerdown.prevent` + no `@keydown.enter` (CH-70) + no `@focusout`,
   each with the reason it is absent written at the site; `activeElement` stays `INPUT` across the
   press and the Escape. A head control that does not steal the board's caret.
7. **Honest gaps.** Seventeen of them, including the three that hurt most (the substrate absent,
   the swap still non-monotone, four gates not run). The return does not round up.

## 4 · Convergence

**72%.** The centre — the stroke, the threshold, the set law, the width table, the one counting
base, the AA, the zero filters — is converged and I reproduced it in both engines. Against it: one
gate's stated law is measurably false (§2.1), one branch does not do what it says (§2.2), four
gates were not run at all, the floor gate is fitted to the case it passes, half the touched files
are scaffold against a substrate that has since landed, and the section's counting base is not
merely undecided but now materially colliding with a sibling lane's shipped file. That is not two
clean passes and it is not zero open gaps.
