# PLR-PLACE — pass 2 (PROTOTYPE) · the seating chart, and the seam that earns it

T9-W7 §11 · §12 · mark M14. Built 2026-09-18 from `../../synthesize/PLR-PLACE.md` §7 on top of
the replayed pass-1 prototype, in a throwaway worktree. Nothing is committed; the main tree is
untouched.

```
worktree   /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-54
branch     worktree-wf_8630d340-e56-54   (off a8fee1f5)
server     npx vite --config <scratch .mts, private cacheDir> --host 127.0.0.1 --port 4243 --strictPort
config     probe/pw.config.ts  (no webServer, baseURL 127.0.0.1:4243, chromium + webkit)
```

**IT RUNS.** Every number below is read off that server in the engines named — no overlay, no
injected geometry, no mock: the product's own `PlayerSign`, `PlayerLobby` and `PlaceChart`,
mounted in `AttributionCard`'s `#mark` slot at both widths. **Every opening is a REAL press**
(`locator.click()` / a real `Enter` after `focus()`), never `el.click()` inside `page.evaluate`
— which is the whole point, because what this family had to prove is what a real press does to
focus.

**U-10: this proposes.** If the owner disposes against the size split the family is a KILL; the
24px miniature was never built and cannot be.

---

## 1 · THE REPLAY

`pass1/prototype/PLR-PLACE/patch-tracked.diff` applied `--3way` into the fresh worktree: **10
files, all clean, zero conflicts** (HEAD moved by docs only since pass 1). The four `new-files/`
copied to `src/games/shared/`. The pass-1 worktree `wf_e58b4764-0fc-48` still exists and was
**not** touched — the replay came from the banked evidence diff, not from it.

## 2 · WHAT PASS 2 CHANGED (the §7 plan, as executed)

| step | file | what landed |
|---|---|---|
| 2 | `useSession.ts` | `selfCursor` **DIES**; `lastCell` is born. Written at ONE site (`GameBoard.onCellFocus`), cleared at ONE (`clearCursors`), read at ONE (the chart). |
| — | `GameBoard.vue:458` | `lastCell.value = pos`, deliberately not paired with the `focusout`'s `noteFocus(null)` |
| 3 | `PlayerSign.vue` | `@pointerdown.prevent`; the `@keydown.enter` handler **deleted**; window-bound Escape armed on open and unbound on close; `@focusout` close; `PlayerLobby` now always mounted with `:open` |
| 4 | `PlaceChart.vue` | pitch HELD at `32/3` CSS px per cell; dot r 4 at every size; ring stroke **2**; the `queried` prop and the one-state dim; `data-peer` on every dot |
| 4 | `PlayerLobby.vue` | ground **opaque**; `@click.stop` **deleted**; the `.hover-card` rule verbatim (the declared 150ms, now implemented) with the chart as the `v-if`; `ROWS` on `(min-height: 800px)`; the `mouseenter` query behind `(hover: hover) and (pointer: fine)`; `LOBBY_COPY`; no-ink-no-dot; `.pl-row` / `.pl-swatch` / `.pl-name` |
| 4 | `lobbyCopy.ts` (new) | the five strings + the three composers, in one place both gates read |
| 5 | `GameControlPanel.vue` | the chips Capitalised (`Shown` / `Hidden`) — the estate's own chip register, which pass 1 broke |
| 7 | `check-font-coverage.mjs` | a `lobbyStrings` derive over `LOBBY_COPY`, and its corpus group |
| 7 | `check-copy-register.mjs` | `COPY_SOURCES` — a named constant whose every literal is read as copy (the `NARRATION_CALLS` class, at the other end) |
| 8 | `e2e/join-language.spec.ts` · `e2e/multiplayer.spec.ts` ×2 | `.player-swatch` **re-pointed** at `[data-lobby] .pl-row .pl-swatch circle`, in this diff — the chair's §7 condition |
| — | `PlaceChart.test.ts` (new) | G14 / G15 / G16 as units — 6 tests |

`git diff --stat`: **14 files changed, +371 / −256**, plus 6 new files (`PlayerSign.vue`,
`PlayerLobby.vue`, `PlaceChart.vue`, `useBoardShape.ts`, `lobbyCopy.ts`, `PlaceChart.test.ts` —
copies in `new-files/`, the tracked half in `patch-tracked.diff`).

## 3 · THE RETIRE TRIGGER, ANSWERED IN MEASURED BYTES

The family's whole existence turned on one question: does opening the chart cost you your place
on the board? Pass 1 could not paint `.chart-self` under a real press. Pass 2 can, and the two
lines that do it are both measured.

| reading | chromium | webkit |
|---|---|---|
| `.chart-self` after a REAL MOUSE press, solo | **1** | **1** |
| the cell still holds focus after that press | **yes** | **yes** |
| `.chart-self` after `focus()` + `Enter` (an honest keyboard leave) | **1** | **1** |
| new `cur` frames on the wire caused by the press | **0** | **0** |
| the peer's ghost of you, before → after the press | **1 → 1** | **1 → 1** |
| `aria-expanded` after the press | `true` | `true` |

`@pointerdown.prevent` is why the mouse arm holds; `lastCell` outliving the focus is why the
keyboard arm does. Neither alone is sufficient and the gates read both.

## 4 · THE GATES

| id | asserts | reading | verdict |
|---|---|---|---|
| r0 I3 (MOVED) | `[data-lobby]:visible` 1 of 2 after a press; the Enter arm opens it | 2 nodes mounted · 0 visible shut · **1 visible after a real press** · `Enter` opens with `aria-expanded="true"` · candidate `(75.5, 12, 53.1, 47.8)` named `no other players` | **GREEN both engines** (RED at HEAD) |
| G1 rate | ≤40 moves/min/peer at 700; ≤3 on the sweep; the 800 arm reported | see §5 | see §5 |
| G2 self-ring | `.chart-self` under a REAL press, mouse AND keyboard, both engines | **1 / 1 / 1 / 1** | **GREEN both** (RED pass 1) |
| G3 seam | a mouse press sends no `cur`; the ghost stays; the cell keeps focus | **0 new frames · ghost 1 → 1 · focus kept** | **GREEN both** |
| G4 head-still | zero mutations under `[data-player-mark]` over a peer's key sweep | **0 mutations / 60 held keys**, sheet shut | **GREEN both** |
| G5 opt-out | `Hidden`: one `cur {p:null}` then silence; opening sends nothing | **0 frames on open** · first null at **25ms** (chromium) / **40ms** (webkit) · nothing but `null` after two further moves · the peer's row survives (5) and its dot does not (4 → 3) · your own ring goes out with it (0) | **GREEN both**, with one caveat (§7) |
| G6 M19-whole | focus unmoved, sheet shut, label mutated on a third join | focus `Row 1, column 1, given clue 1` → unchanged · sheet 0 · label **`5 other players` → `6 other players`** | **GREEN both** |
| G7 filter-census | exactly 9 with the sign and the open chart, polled to settled | desk shut **9** · desk open solo **9** · desk open live **9** · phone shut **9** | **GREEN both** |
| G8 lap-law | measured lap == `417.07 + 24L − 0.5vh` ±4, and every lapped tap dismisses, no control | see §6 — **the law is right where it applies and wrong where the row cap bites** | **SPLIT** |
| G9 caption-width | `your cell` fits at 390 and 1023 | 1023: **w 60.0, scrollWidth 60, no wrap** both engines | **GREEN both** |
| G10 board-unbound | 81 cells, 0 ink bindings solo and after a self write | **81 cells, 0 bound** after writing a 5 in a room | **GREEN both** |
| G11 live-regions | six in order | `margin-note` · `board-voice` · `players-status` · `players-roster` (`role=log`) · `players-alone` · `copy-status` — **6, in order**, and the chart is `aria-hidden="true"` | **GREEN both** |
| G12 font/copy | woff2 4,312 B; `lobbyStrings` derives; no dash, no jargon | **4,312 B** (unmoved) · Patrick Hand 46 codepoints, 25 declared strings over 4 groups, each derived · **0 dashes, 0 unadmitted jargon** over 142 files | **GREEN** |
| G13 sheet-AA | quiet ≥4.5, rule ≥3, ring ≥3, worst dot ≥3, on the opaque ground over the wordmark | see §6 | **GREEN both engines, both themes** (RED at 4.20 on the 80% ground) |
| G14 pitch | dot 8.00 and gap 2.667 at 4×4, 9×9, 16×16; chart == 10.667·N | **42.66 / 96.00 / 170.66** on the real surface, both engines; ring box 8.00 at every size; unit test proves r and gap in viewBox units | **GREEN both** |
| G15 no-ink-no-dot | a peer with no ink renders no dot; a peer at `p:null` keeps its row | unit: 2 peers in, 2 dots out, **no `fill="var(--color-user-ink)"` anywhere** | **GREEN (unit)** |
| G16 query | hover a row: its dot 1, the rest 0.55; on leave all 1 | hovered **`"1"`**, other three **`"0.55"`**; after leave **`["1","1","1","1"]`** | **GREEN both** |
| G17 keys | Space / Enter / Escape off `el.focus()`, both engines | Enter opens · **Escape closes a keyboard-opened sheet (1 → 0)** · Space opens then closes (1 → 0) | **GREEN both** |
| G18 pi-regime | the rect census runs both pages in ONE pointer regime | see §7 — **NOT RUN, a declared gap** | **GAP** |
| G19 tap-floor | 44×44 coarse, with a negative control | `min-width` / `min-height` computed **44px / 44px**; the box is **53.13 × 47.75** (the padding already clears it); **negative control: the floor forced to 40px with padding zeroed gives 40 × 40 and FAILS** | **GREEN**, with the honest note that the floor is a guarantee here, not the binding constraint |

Unit battery in the worktree: `vitest run src/games` → **56 files / 727 tests, all passed**
(`PlaceChart.test.ts`'s 6 among them). Typecheck: `vue-tsc -b --force` → **exit 0**
(`logs/tsc-build-exit0.log`) and `vue-tsc --noEmit -p tsconfig.e2e.json` → **exit 0**
(`logs/tsc-e2e-exit0.log`, which is what covers the two re-pointed e2e specs). ESLint over the
seven changed and six new source files → clean.

**A CORRECTION THIS LANE OWES ITS OWN RECORD.** Three earlier typecheck runs in this session
were reported green and were not. The command was `vue-tsc --noEmit -p tsconfig.app.json`; this
repo has no `tsconfig.app.json` (it has `tsconfig.json`, `tsconfig.e2e.json`,
`tsconfig.node.json`), so every one failed with `TS5058` — and because the invocation was
`cmd > log 2>&1; echo "EXIT=$?" >> log`, the `$?` read the **`echo`'s** status and the harness
read the compound's. Three green readings, zero typechecks. This is the estate's own banked trap
(`cmd | tail` eats the exit code) wearing a different coat, and it is banked here in the shape
it actually took: **a trailing `echo` in the same compound eats it just as well.** The real
readings above were taken bare, with the exit code on its own line.

## 5 · G1 — the rate, on the banked traces

The pass-1 research banked four real traces of the product's own wire. They are replayed here at
their recorded cadence onto a live room, and what is counted is what a READER sees: the dot's
`(cx, cy)` sampled once per animation frame, and the frames where it differs from the one
before. No batching artefact, no double count when Vue writes `cx` and `cy` in two patches.

| arm | raw wire | at 700 | at 800 | gate |
|---|---|---|---|---|
| ordinary play, chromium | 74.7 moves/min | **37.8** | **31.8** | ≤40 · **GREEN at both** |
| ordinary play, **webkit** | 71.4 moves/min | **40.6** | see below | ≤40 · **0.6 OVER at 700** |
| the 20 s key-repeat sweep, chromium | 469.8 moves/min | **2.9** | **2.9** | ≤3 · **GREEN at both** |
| the 20 s key-repeat sweep, webkit | 463.6 moves/min | **2.9** | see below | ≤3 · **GREEN at 700** |

The sweep is the number that matters, and it is the same at both settle values: 165 frames of a
held arrow key produce **one** step. The damping is doing its whole job, and it costs a peer who
is thinking nothing.

**The ordinary arm is where the gate bites, and only in WebKit.** 40.6 at 700 reproduces pass
1's reading to the decimal — this is not a flake, it is the number. The spec's answer was to run
the 800 arm and report it rather than predict it; the 800 arm moves chromium from 37.8 to
**31.8**, a 16% drop, and if WebKit moves by the same proportion it lands near 34 and clears.
**That inference is NOT a reading**, and the WebKit 800 figure is owed (§9.4). The chromium
pair (37.8 → 31.8) is banked at `logs/rate2-700-and-800.txt` and is what the inference rests on.

The SLOW control (the ordinary trace at ⅓ cadence) did not complete inside the probe's budget in
either run — §9.3.

## 6 · G8 — the lap law, split

**The tap half is GREEN on every arm.** Six configurations, both viewports, every row count:

| vh | drawn `.pl-row` | lapped cells | taps that dismissed | taps that reached a control |
|---|---|---|---|---|
| 664 | 0 | 12 | **12** | **0** |
| 664 | 2 | 18 | **18** | **0** |
| 664 | 2 (L=5 clamps) | 18 | **18** | **0** |
| 844 | 0 | 0 | — | — |
| 844 | 4 | 12 | **12** | **0** |
| 844 | 5 | 18 | **18** | **0** |

That is 78 lapped-cell taps, every one of which dismissed the sheet, and not one of which
reached a link, a button or anything else focusable. The incumbent `@mbabb` card steals 12 cells
on chromium (its GitHub link sits under them); deleting the sheet's `@click.stop` and giving it
zero focusable children is what buys this, and it is measured rather than argued.

**The law half is RIGHT where it applies and WRONG in two named ways.** Both are this lane's,
and neither is re-worded to pass.

The `−0.5·vh` term is **exact**: the grid's top read **131.73** at vh 664 and **221.73** at vh
844 — a difference of **90.00 px** for a 180 px viewport change, to the hundredth.

| arm | lap measured | `417.07 + 24L − 0.5vh` as written | re-indexed on DRAWN rows | Δ |
|---|---|---|---|---|
| 664 × L0 | 85.02 | 85.07 | 85.07 | **−0.05** |
| 664 × L2 | 133.00 | 133.07 | 133.07 | **−0.07** |
| 664 × L5 | 133.00 | 205.07 | 133.07 | **−0.07** |
| 844 × L0 | 0 | −4.93 | −4.93 (no lap predicted, none measured) | clamp |
| 844 × 4 rows | 95.80 | 43.07 | 91.07 | **+4.73** |
| 844 × 5 rows | 119.78 | 115.07 | 115.07 | **+4.71** |

1. **The law is indexed on the ROOM and the sheet draws `ROWS`.** `{tall: 5, short: 2}` on
   `(min-height: 800px)` means every L ≥ 2 at vh 664 is the SAME sheet. The law must read
   `lap(vh, R) = 417.07 + 24.0·min(R, ROWS(vh)) − 0.5·vh`. Re-indexed, the 664 × L5 arm goes
   from **Δ −72.07** to **Δ −0.07**. This is the spec's own `ROWS` rule meeting the spec's own
   lap law, and the lap law was written first.
2. **A residual +4.7 px survives at four and five rows** — `+4.73` and `+4.71`, the same
   constant twice, so it is a term the law is missing and not noise. Measured sheet heights:
   169.00 at 0 rows, 216.98 at 2 (23.99 a row, which IS the law's 24.0), 269.78 at 4, 293.77 at
   5 (23.99 again on the last step). The lane did NOT close this and reports it as a gap.
3. **The 844 × L0 −4.93 is the probe's artefact, not the design's**: a lap cannot be negative,
   the measurement clamps at 0, and comparing a clamped reading to an unclamped law manufactures
   a 4.93 delta. `max(0, law)` is the right comparison and gives Δ 0.

## 7 · G13 — the painted bytes on the opaque ground, over the wordmark

Not a rig: the sheet is opened by a real press, screenshotted where it lives, and the ground it
is read against is its OWN painted background, sampled from its own padding corner. The sheet
laps the wordmark's box by **7,277 px²** (chromium) / **7,317 px²** (webkit) while this is read,
which is exactly the condition that made pass 1's 80% ground fail.

| reading | light | dark | spec said | gate |
|---|---|---|---|---|
| `--ink-press-quiet` (state line, qualifier, foot) | **5.16** | **6.02** ch / **6.10** wk | 5.20 / 6.11 | ≥4.5 · **GREEN** (4.20 on the 80% ground) |
| the row name (graphite) | **14.65** | **12.16** | 14.65 / 12.19 | **GREEN** |
| the chart frame (graphite 0.95) | **12.96** ch / **12.59** wk | **10.95** ch / **11.20** wk | 12.48 / 10.95 | **GREEN** |
| your ring (`--color-user-ink`, stroke 2) | **5.00** | **7.46** | 4.96 / 7.52 | ≥3 · **GREEN** |
| the worst of four peer dots at r 4 | **5.31** | **9.67** | ≥5.23 / 9.52–10.63 | ≥3 · **GREEN** |
| the subgrid rule (`--ink-press-rule` 55%) | **7.66** ch / **7.56** wk | **7.97** | 3.52 / 4.37 | ≥3 · **GREEN**, and see below |
| chart box · dot · ring box | 96.00 · 8.00 · 8.00 | same | 96 · 8.00 · 8.00 | **GREEN** |

Eight of the nine readings land within 0.1 of what the spec projected, in both engines. The
NINTH does not: the subgrid rule reads **7.6–8.0** where the spec projected **3.52 / 4.37**. The
spec's number is a computed `color-mix` ratio; this one is the darkest byte the engine actually
painted for a 1.25 px stroke carrying the grid's own grain. The gate passes either way, but the
projection and the paint disagree by 4:1 and the lane reports that rather than quietly banking
the friendlier number.

## 8 · r0 AND THE INSTRUMENTS

| row | disposition | reading |
|---|---|---|
| **I3** | **MOVED** — diff proposed at `instruments/r0-I3-enter-arm.md` | the subject gained a mounted twin (so the row reads `:visible`) and a keyboard route (the Enter arm). Both halves GREEN on the prototype, both engines; both RED at HEAD. |
| **I2** | **RED by ruling** | not this lane's to cure (spec §0) |
| I4 / I5 | unmoved | run bare, unchanged |
| R6 family-law probe | unmoved | unchanged |
| **R6 hue census** | **unmoved — re-run and byte-identical** | the instrument was COPIED to `instruments/hue-census.mjs` and re-pointed at this worktree's `index.css` before running. **29 token rows**, `diff` against `r0/r6-idiom-history/hue-census-HEAD.txt` is **empty**. This family mints no chromatic token, and the `user-ink` vs `focus-sketch` gap is the same 9.6° it was at round zero. |
| `.player-swatch` re-point (§6.8 / chair's §7) | **landed in this diff** | `join-language:175`, `multiplayer:193`, `multiplayer:580` all re-pointed at `[data-lobby] .pl-row .pl-swatch circle`, reading `fill` (a peer) or `stroke` (your ring). The assertions are unchanged; what moved is where the ink is drawn. |

`filterBudget` is **exactly 9** at every reading (§4, G7): shut, open solo, open live, desk and
phone, both engines. The chart mints none — `pose 0` enrols no beat, and the grain is already
baked into the paths `generateGridBoilFrames` hands back.

## 9 · EVERY GAP, NAMED

1. **The +4.7 px residual in the lap law at four and five rows** (§6). Two arms, the same
   constant to 0.02 px, so it is a missing term and not noise. Not closed.
2. **G18 (pi-regime) WAS NOT RUN.** The gate exists because pass 1's +32.83 π rect delta was an
   artefact of running the two pages in different pointer regimes. This pass did not re-take the
   rect census at all. That is a gap, not a pass: the family moved the head's geometry (the sign
   is a new box on the head line) and the census that would catch a knock-on was skipped for
   time. **Whoever runs it must declare ONE pointer regime for both pages.**
3. **The SLOW control on G1 never completed, in three attempts.** The `ordinary` and `sweep`
   arms are banked; the ⅓-cadence control is three minutes of wall-clock replay and it hung past
   even a 300 s budget every time, taking the arms behind it with it. It is now gated behind
   `PLC_SLOW=1` in the probe so it cannot eat another run. The counter is therefore unvalidated
   against a known-slower input — which matters, because if the counter UNDER-reads, 40.6 is a
   floor and not a reading.
4. **The 800 ms arm is half-banked: chromium yes, WEBKIT NO.** `WASH.placeSettleMs` is a module
   constant, so the arm needs a tree whose constant IS 800 — a re-run, not a page flag. That run
   was made (the constant flipped, the probe run, the constant flipped back) and chromium
   returned **31.8 ordinary / 2.9 sweep** against 37.8 / 2.9 at 700. **WebKit's 800 reading did
   not land inside the session** — the SLOW control (gap 3) ate the budget ahead of it, and a
   second attempt with that control cut hung in WebKit after the peer joined and before the
   replay produced a number. The 700 run's WebKit arms had completed normally, so this is a run
   that did not finish, not an engine that cannot. WebKit is the ONLY engine that fails the gate (40.6 at 700, 0.6 over, reproducing pass
   1's number to the decimal), so the one number that decides G1 is the one still owed. Nothing
   here should be read as "800 fixes WebKit": chromium's 16% drop is a chromium fact.
5. **G5's "one null then silence" showed TWO nulls**, not one, on both engines. Every frame after
   `Hidden` is `null` (so the opt-out works and the wire learns nothing further), and the second
   null's `from` was not read. It is probably the tapping page hearing its own `BroadcastChannel`
   frame — the tap and the product share a channel name in the same context — but that is a
   hypothesis, not a reading, and the gate's wording says ONE.
6. **G2's `focusBeforePress` read empty.** The ring assertions are sound (`selfRings` 1 in all
   four arms, and G3's independent `cellKeptFocus` is `true`), but the label probe that was meant
   to name the cell returned `""` because `document.activeElement.closest(".sudoku-cell")`
   resolves to an element whose `aria-label` lives on the input inside it. Cosmetic; the claim
   is carried by G3.
7. **G19's floor is a guarantee, not the binding constraint.** The sign's natural box is
   53.13 × 47.75, which already clears 44 × 44 by padding alone; the `min-width` /
   `min-height` computed at 44px are what stop a future re-pad from breaking it, and the
   negative control proves the declaration bites (40 px → 40 × 40 → fails). Honest, but it
   means the row is not testing what a reader might think it tests.
8. **`--tap-floor` reads EMPTY off `documentElement`** and `2.75rem` off `.page-root`, exactly as
   the spec warned. Anything probing this token elsewhere will silently read nothing.
9. **The desk lap is structural and unmeasured here.** The sheet laps the board's top-left at
   1280 by construction; the lap probe only ran at phone widths. Booked U-10, as the spec says,
   but not measured.
10. **The subgrid rule's paint is 4:1 brighter than the spec's projection** (§7). The gate
    passes; the model does not, and a model that is wrong by 4× on one row may be wrong
    elsewhere.
11. **Only the scene and paint probes ran in BOTH engines.** The lap probe, the crops and the
    unit battery are chromium-only (the lap is a layout law and the crops are pictures), which
    is a defensible split but is a split.
12. **The `ROWS` clamp changes what a phone shows, and no gate reads it as copy.** At 664 a room
    of six shows two rows and `and 4 more`; the sr-only roster holds every name, so nothing is
    lost to a screen reader, but nothing asserts that the drawn remainder and the spoken list
    agree.

## 10 · WHAT DIED, AS THE PLAN SAID

The 24px miniature (never built) · the `?? --color-user-ink` fallback · the 1.5px ring · the
fixed 96px box · the claim-to-four sentence · the `v-if` pose box · the 80% ground · the sheet's
`@click.stop` · the coarse-only opaque arm · `selfCursor` · the sign's `@keydown.enter` ·
lowercase chips.

## 11 · THE SEAM, IN THE SOURCE

Two lines carry this family, and both are one-site facts.

```ts
// useSession.ts — the ONE ref, written at one site, cleared at one, read at one
export const lastCell = ref<number | null>(null);

// GameBoard.vue:458 — the write. Deliberately NOT paired with the focusout's noteFocus(null):
// a Tab off the board is an honest leave to say on the wire, and it is not you forgetting
// which cell you were on.
function onCellFocus(pos: number) {
  focusedPos.value = pos;
  lastCell.value = pos;
  noteFocus(pos);
}
```

```html
<!-- PlayerSign.vue — the seam. The click still fires exactly once, aria-expanded still moves,
     and Enter and Space still open it, because a keyboard activation never went through
     pointerdown at all. -->
<button ... @click.stop="toggle" @pointerdown.prevent>
```

The `relatedTarget` cure this replaces is dead on the measurement, not on the argument: WebKit
hands `null` on a press AND on a Tab, so the grid could never tell them apart.

## 12 · FILES

```
new-files/       PlayerSign.vue · PlayerLobby.vue · PlaceChart.vue · useBoardShape.ts
                 lobbyCopy.ts · PlaceChart.test.ts
patch-tracked.diff   the 14 tracked files, +371 / −256
probe/           place-scene2 · place-paint2 · place-phone2 · place-rate2 · place-crop2 · pw.config.ts
logs/            scene2-{chromium,webkit}.json · paint2-{chromium,webkit}.json
                 phone2-chromium-{664,844}-L{0,2,5}.json · rate2-700-{chromium,webkit}.json
                 hue-census-PLR-PLACE.txt (29 rows, identical to r0's HEAD)
instruments/     r0-I3-enter-arm.md (the MOVED row's diff) · hue-census.mjs (copied, re-pointed)
frames/          the four crops
```

## 13 · THE FRAMES

Four crops, each under 150 KB, each here because a number could not say it.

| file | what it shows | the number beside it |
|---|---|---|
| `chart-9x9-n3-390-light.png` | **the frame pass 1 could not take**: the 9×9 chart on a phone, light, with `.chart-self` PAINTED under a real press | 2 dots + **1 ring**, the sheet opened by `locator.click()` after a real press on cell 40 |
| `chart-16x16-n6-1280-dark.png` | the 16×16 chart, desk, dark — the pitch held rather than the box | chart **170.66 px**, 5 dots at 8.00 px, gap 2.667 |
| `chart-hover-query-1280-light.png` | the query: one row pointed at, the rest of the dots at 0.55 | hovered `"1"`, others `"0.55"` |
| `your-cell-row-1280-light.png` | **NOT BANKED** — `locator.screenshot()` on the row hung twice and the run was killed. The row itself reads correctly: `"your celleveryone on this board can see which cell you are onShownHidden"`, caption 60.0 px, no wrap, chips Capitalised. A gap. |

## 14 · HOW TO RE-RUN THIS

```sh
# the server (private cache, strict port, 127.0.0.1)
cd <worktree>/web/frontend
npx vite --config <scratch>/vite.place.mts --host 127.0.0.1 --port 4243 --strictPort

# the probes
npx playwright test --config probe/pw.config.ts place-scene2   # both engines, ~35s each
npx playwright test --config probe/pw.config.ts place-paint2   # both engines, ~11s
npx playwright test --config probe/pw.config.ts --project=chromium place-phone2
PLC_ARM=700 npx playwright test --config probe/pw.config.ts place-rate2

# the 800 arm needs a tree whose constant IS 800 — WASH.placeSettleMs is a module const
sed -i '' 's/placeSettleMs: 700/placeSettleMs: 800/' src/games/shared/useJoinWash.ts
PLC_ARM=800 npx playwright test --config probe/pw.config.ts place-rate2
sed -i '' 's/placeSettleMs: 800/placeSettleMs: 700/' src/games/shared/useJoinWash.ts

# the gates that need no browser
node scripts/check-font-coverage.mjs && node scripts/check-copy-register.mjs
npx vitest run src/games && npx vue-tsc --noEmit -p tsconfig.app.json
node <evidence>/instruments/hue-census.mjs
```

**Three traps this pass paid for, banked so the next lane does not:**

1. **At phone width the invite verb is behind the drawer tab.** Every probe that needs a room on
   a 390-wide viewport must open `.drawer-tab`, click the verb, and shut the tab again before
   measuring — a probe that just clicks the verb hangs until its timeout, which is how this pass
   lost two runs.
2. **`document.querySelector("[data-lobby]")` is the WRONG one at phone width.** The head mounts
   a desktop `AttributionCard` and a mobile one; the hidden one comes first in the DOM. Every
   geometry read must find the one with a non-zero box, or it reads `{0,0,0,0}` and every number
   downstream is a fiction. This pass shipped that bug once and caught it.
3. **A `test()` with six configurations in it loses all six to one timeout.** One `test()` per
   arm, banking its JSON before its assertions, so a kill costs one arm and not the run.
4. **`cmd > log 2>&1; echo "EXIT=$?" >> log` reports the `echo`'s status, not the command's.**
   The estate already banks `cmd | tail` for eating exit codes; this is the same bite from the
   other side, and it cost this lane three false-green typechecks before the fourth run was made
   bare. Run gates bare, and read the tool's own exit, never a line the shell appended after it.
5. **There is no `tsconfig.app.json`.** The typecheck is `vue-tsc -b` for `src/` and
   `vue-tsc --noEmit -p tsconfig.e2e.json` for `e2e/` — and `-p <a name that does not exist>`
   fails with `TS5058`, which looks nothing like a type error in a log you are skimming.
