# LANE C — F2 NARROWED · THE ZONE GRAMMAR · pass-2 dossier

**Worktree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_6e1b18f4-0f2-3`** — in-tree, built, nothing committed.

Shots: `pass2/lane-c-shots/` · rig: `pass2/rig/` · raw output: `pass2/out/` ·
dists: `pass2/dist-{base,f2type,f2pen}` · measurer's brief: `pass2/lane-c-MEASURE-REQUESTS.md`.

Every number below came off a **built dist** served read-only, through a harness whose pointer
regime is asserted by three independent observables before any figure is banked. `vue-tsc` green;
`vitest` 307/307; the scoped CSS really compiles (it caught two of my own defects that no mock
could have — §6).

---

## 0 · THE HEADLINE — THE COARSE GATE IS GREEN, HONESTLY, ON BOTH ENGINES

Pass 1's family died on one number: its mobile gate ran at `pointer: fine`, and under the only
regime a phone is ever in it came back **+7 px versus today**. That number is now closed, and closed
by donors rather than by hope.

| cell | base | Lane C | Δ | engines agree |
|---|---:|---:|---:|:--:|
| **390×844 COARSE** | 619 | **586** | **−33** | chromium = webkit |
| **375×812 COARSE** | 619 | **586** | **−33** | chromium = webkit |
| **1280×800 COARSE** (iPad row regime) | 1138 | **1116** | **−22** | chromium = webkit |
| 1280×800 fine | 1026 | 1014 | −12 | 1029 → 1017 on webkit |
| 390×844 fine | 476 | 452 | −24 | chromium = webkit |

The base column reproduces the pass-1 critique's independent re-derivation **exactly** (1026 / 1138
/ 476 / 619), which is the calibration that lets the deltas mean anything.

**The gate is shown able to fail.** `pass2/out/negctrl-harness.json`: the *pass-1 harness*
(`hasTouch` forced off) run against the *same build* reports **452 px** where the real regime reports
586, and all four regime witnesses fail — `mqCoarse`, `mqHover`, `playControlsPainted`,
`sublabelBlock`. That is the pass-1 defect reproduced on demand, and it is why every cell in this
lane carries a `regimeOk` flag that refuses its own numbers when the witness misses.

The witness needed correcting once mid-pass: `.deal-btn`'s sublabel is `display: block` at every
pointer by design, so using it as a coarse witness flagged the *fine* cells as broken. Scoped to
`.icon-btn:not(.deal-btn)` it is sound.

---

## 1 · WHAT THE ZONE GRAMMAR IS

Six display-caps eyebrows — NEW GAME / SIZE / DIFFICULTY / MARKS / CHECK / CANDIDATES — stacked over
six near-identical Fira Code segmented rows, every one at the same rank, three of them naming
standing *preferences* louder than the verb that deals a board. That is the owner's "contrived."

**Six become two.** Size and Difficulty keep the eyebrow register: they caption the staged inputs
and they earn it. The other four zones are named the way a pencil case names its compartments — a
strip of washi taped across a drawn frame, lower case, in the hand.

- `new game` — the staged sections + the Deal commit
- `pencils` — marks *and* candidates
- `teacher's` — check + whether she's marking

**The taxonomy is re-cut on the way, and this is a design claim, not a move.** Candidates were
filed under "board assists" beside Check. But candidates *are* pencil marks — the engine's, next to
yours — while checking is what the teacher does. Moving candidates into `pencils` leaves the
teacher's compartment holding exactly one idea, which is what lets its status line be about one
thing.

Each well is `HandDrawnOutline :stroke-width="1.5" :outset="4" :radius="3" :pose="0"` — frozen at
setup, enrolling **no beat** by construction (`HandDrawnOutline.vue:66-72`) — plus a
`SheetWashiLabel anchor="tag"`, which is *also* the zone's accessible name via `aria-labelledby`.
The visible tape **is** the name: nothing duplicated, nothing that can drift.

`anchor="tag"` is a new value on the shared washi primitive (+14 code lines) rather than four
override declarations fighting a tooltip from the outside, as pass 1 did. A zone name is a label,
not a tooltip, so the tag also drops `role="tooltip"` — which is what makes it legal as an
`aria-labelledby` target. Lower case is not only voice: Patrick Hand's uppercase subset is
{C,R,S}, so every lower-case tape is chimera-free by construction (F5's shared finding, taken).

**The tab-toggle stays.** Pass 1 deleted its 83 lines and then could not pay for them; it is the
card's largest single height saving on a phone. Deleting a component is not the same as deleting
its work.

### Donors, priced

`New game` eyebrow · `Marks` heading · `Check` heading · `Candidates` heading · the `<hr>` between
the desktop sections (the compartment's own frame is the separation now) · `AssistSettings.vue`
(−91) · `PencilModeToggle.vue` (−47).

The well chrome had to be **priced, not chosen**. At 0.75 rem margin / 0.55 rem padding the three
wells cost 122 px and the coarse desktop card went **UP 9 px** — a compartment grammar that charges
more than the eyebrows it deletes is redecoration. The shipped figures (0.35 rem/0.5 rem, then
0.5 rem margin once the frames were found to be colliding) are the measured floor at which the box
still reads as a box.

---

## 2 · GATES CLOSED IN THIS LANE

| # | gate | result | negative control, shown able to fail |
|---|---|---|---|
| G1 | coarse height, 3 cells × 2 engines | **PASS** −33/−33/−22 | pass-1 harness on the same build: 452 vs 586, 4/4 witnesses fail |
| G2 | fine height, 2 cells × 2 engines | **PASS** −12/−24 | same harness rig |
| G3 | `.section-heading` 6 → 2 per panel | **PASS** (12 → 4 over both mounts) | counted live, per panel host |
| G4 | Deal die ink ≥ the heading it commits | **PASS** 0.2315 vs 0.2035 | **base FAILS** 0.1059 vs 0.1924 |
| G5 | die overflows its control | **0 px in every cell** | base at fine renders a 17.97 px die in a 44 px box |
| G6 | min tap target, coarse | 43.2/43.7 → **44.0** | the sub-floor control is base's own |
| G7 | mark-4: added lines with `filter:` | **0** | pass-1's own F2 diff: **1** |
| G8 | live-filtered nodes in the card | 26 → **26** | counted live in both builds |
| G9 | `useRasterStack` consumers | 3 (+1 definition), unchanged | — |
| G10 | WCAG 2.5.3 label-in-name, 8 new controls | **PASS**, 0 aria-hidden visible labels | **pass-1's own markup planted live: FAILS** |
| G11 | no announced-but-unimplemented radiogroup | **PASS**, `role=radio/radiogroup` count 0 | — |
| G12 | zone name = visible tape | **PASS** ×3, `aria-labelledby` resolves, tape visible | — |
| G13 | `checkArmed` named to AT | **PASS** `role="status"`, text changes with state | asserted by diffing the live-region text across a state change |
| G14 | contrast, every new voice, both themes | **PASS**, AA clear, ladder monotone | §5 |
| G15 | `share-truth.spec:57` nth(4) = Share | **identical to base** | measured on the dist, not reasoned |
| G16 | `visual-regression.spec:150` first `.ctrl-btn` ≥19 px | **identical to base** (`4×4`, 20 px) | measured on the dist |
| G17 | unit suite | **307/307** | — |
| G18 | settle inside `GLIDE_MS` 520 | **PASS** last tape 139.6–143.7 ms (chromium, n=2) | drawer-already-open records **no settle at all** |
| G19 | PRM snaps | **PASS**, zero tape animation | the non-PRM run records 4 intermediate frames per tape, so "snaps" is an observation |

---

## 3 · THE BAKE-OFF — BOTH RENDERINGS BUILT, BOTH SHOT, BOTH ENGINES

`useAssists` has carried a fourth state since T4-W8 that the UI has never shown. Tapping "Ask" arms
a point-in-time snapshot (`:44`); the next board edit clears it (`:63`). So a player taps Ask, types
a digit, and the check silently goes stale — and the cure is re-tapping an option that already looks
selected. That same-value re-emit is why `errorCheckMode` is still a manual prop+emit rather than
`defineModel`. It is load-bearing and it is invisible.

`CheckStatus.vue` renders `proactiveCheck` — *is the teacher marking your board right now* — and
names the reason. One file, one exported word (`CHECK_RENDERING`) switches the rendering; the
loser's branch is deleted at ship, not left beside the winner.

**Both renderings are the same live region with the same words to assistive tech.** The blind read
therefore discriminates on legibility and ink weight alone — never on a11y, which is where pass 1's
"sighted-only" verdict came from.

| | TYPE | PEN |
|---|---|---|
| what it is | a state-named sentence in the hand; **pressure = state, words = reason** | a two-pose drawn pencil + a two-word caption |
| off | `not marking` | `put away` |
| ask + armed | `marked · showing mistakes` | `marking` |
| **ask + stale** | **`board changed · Ask again`** | `put away` |
| live | `marking as you go` | `marking` |
| ink mass (same slot) | **251.08** | 170.89 (glyph alone 85.18) |
| ink density | **0.0665** | 0.0265 (glyph alone 0.0653) |
| code lines | ~66 | ~108 (the pen adds ~42) |
| rose spent | none — pressure only | the lead + its mark |

Shots: `{TYPE,PEN}-chromium-teachers-{off,ask_armed,ask_stale,live}.png` and `-wk` WebKit twins.
States are reached the way a player reaches them — `ask_stale` arms the check and then **types a
digit into a real cell**, driving the real `useAssists`, not a reimplementation of it. Pass 1's D4
gate was verified against a vanilla-JS rewrite of both the component and the state machine; this one
is verified against the shipped composable through the built bundle.

**The pen was redrawn twice and both failures are worth recording.** Draft 1 drew the barrel as a
thick stroke with a V on the end and read as an **arrow**. Draft 2 capped it and read as a **USB
stick**. The shipped drawing is a proper barrel — outlined box, facet line, eraser block, wood cone —
in *one* geometry with two poses, differing by angle, lead colour, and the mark it has just left.
Both poses now read as a pencil. That is a better pen than pass 1's, at a sixth of pass 1's lines.

**My measured verdict, offered to the adjudicator, not substituted for the read.** The pen is the
lightest mark in its own compartment: density 0.0653 against the washi tags' 0.138 and a quarter of
the headings'. In the same slot the sentence puts **47 % more ink on the paper at 2.5× the density**.
And in the state that matters — `ask_stale` — the pen says `put away` while the row still reads
"Ask": it carries the state but not the reason. The sentence carries both. On the half of the
charter's centre pass 1 never measured, **the pen does not pay its 42 lines**, and `CHECK_RENDERING`
ships as `"type"` pending the device read (M2).

---

## 4 · RANK BY INK, NOT BY BOX — AND THE CASCADE FIX

Pass 1 grew the die 28 → 56 px and that single move tipped its mobile gate: at `pointer: coarse`
`.icon-btn` is `height: auto`, so **every px of glyph is a px of card on every phone**. The box was
never free.

So the box holds at 28 px and the rank is paid in stroke mass — a firmer barrel and full-graphite
ink, with the sublabel promoted to the firm rung. `:deep(svg *)`, not `:deep(svg)`: the rects carry
their own `stroke-width` presentation attribute, which beats an inherited value from the parent.

| | base | Lane C |
|---|---:|---:|
| die ink mass | 56.35 | **194.71** (**×3.46**) |
| die ink density | 0.1059 | **0.2315** |
| vs DIFFICULTY heading density | 0.1924 → **FAIL** | 0.2035 → **PASS** |
| rendered die, fine pointer | **17.97 px** | 28 px |
| glyph overflow of its control | 0 | 0 |
| height cost, coarse | — | **0 px** |

The `.deal-btn`/`.icon-btn` cascade defect (Lane D ships it standalone; replicated here so this
lane's numbers are the real ones) is settled by **specificity** — `.icon-btn.deal-btn` — rather than
by source order, which is order-proof against the next edit to this sheet. It costs +10 px at fine
desktop and **nothing at coarse**, and it is what makes the die render at its declared size at all.

**Not fully cured, said plainly:** the die is heavier but it still sits in air at the bottom of the
staging compartment. "Bigger and darker" answers *weight*; it does not answer *orphaned*. The well
at least gives it a home with a name on it, which is more than the shipped card does.

---

## 5 · CONTRAST — MEASURED, AND MY FIRST MEASUREMENT WAS WRONG

| voice | light | dark | floor |
|---|---:|---:|---|
| zone tape (`new game` / `pencils` / `teacher's`) | 17.36 | 8.96 | AA 4.5 |
| row label + quiet status rung (68 % graphite) | 5.25 | 6.05 | AA 4.5 |
| firm status rung + Deal sublabel | 19.45 | 15.84 | AA 4.5 |
| shipped peek chip (unchanged control) | 17.36 | 8.96 | — |

The ladder is **monotone in both themes** — 5.25 → 19.45 light, 6.05 → 15.84 dark — over both rungs.
There are only two rungs and one bit, so G6's inversion has nowhere to relocate to.

The 68 % rung independently reproduces F5's ledger for the same recipe (5.23 / 6.06), which is the
corroboration that says the probe is right. **It was not right the first time.** `getComputedStyle`
returns `color(srgb …)` with 0–1 channels for anything `color-mix()` touches, and my parser scaled
those like 0–255 — reporting washi tape at **1.41:1 in light**, a defect the screenshots plainly
refute. A rig that disagrees with the render is wrong until proven otherwise.

---

## 6 · THREE DEFECTS THE RIG CAUGHT IN MY OWN WORK

Recorded because two of them were invisible to every instrument except the one built to catch them —
which is the rig mandate's whole point.

1. **A dangling comment terminator killed the scoped stylesheet.** `vue-tsc` was green; the *build*
   failed with `Expected a pseudo-class or pseudo-element`. Real scoped-CSS compilation, exactly the
   class of defect pass 1's no-Vue mock could not see.
2. **The wells' drawn frames collided.** `HandDrawnOutline`'s `outset` extends the stroke *beyond*
   the border box, so at outset 7 with 5.6 px of margin the teacher's tape landed on the pencils
   well's bottom stroke. Visible only in a render. Margin must clear `outset` **plus** the tape's
   8.2 px overhang; padding-top must clear the overhang or the rail's first row label sits under
   the tape.
3. **The settle silently did not run.** Instrumented, the taping class lived **2 frames (~32 ms)**
   while tapes 2 and 3 carried 30 ms and 60 ms of `transition-delay` — so only the first tape ever
   moved, and a naive opacity probe reported `dipped: false` and would have been read as "no
   regression." A transition cleared by a double-rAF is the wrong primitive; a **delayed keyframe
   with `both` fill** holds the from-state through its own delay. Measured after the fix, chromium,
   two runs: **102.3 / 116.3 / 143.7 ms** and **86.4 / 113.3 / 139.6 ms**, 3–4 intermediate frames
   per tape, against a nominal 60 / 90 / 120. The excess over nominal is the ~12 ms the class takes
   to land plus sampling latency; the last tape lands **inside `GLIDE_MS` 520 with ~376 ms of
   margin** in both runs.

---

## 7 · THE SETTLE, AND THE THING I FOUND UNDER IT

Three movers, and they are the three **tapes** — not the wells. That is the whole perf argument: a
tape is an unfiltered `<span>`, so the settle touches no ancestor and no descendant of
`.control-panel-filtered`'s three-pass chain, which is where `BoilDivider.vue:42-47` ledgers what
WebKit actually does under motion (~10 fps steady-state; it paints SVG content unlayered, so
`will-change` buys nothing). It also reads right: the compartments are already drawn, and their
labels get taped on as the case pulls out. `translate`, not `transform`, so the tape's seeded tilt
composes rather than being overwritten. Rail only — the mobile card never glides.

**Headless WebKit cannot answer this row.** Across the glide it delivers **34 frames in 900 ms** and
the sampler catches the taping class in one of them; the settle reports 282 ms because rAF is
starved, not because the animation is slow.

**The finding under it is bigger than this lane.** rAF is starved at glide onset for **339–538 ms on
BOTH builds** (n=2 each: base 538/355, f2type 373/339 — the variance swamps the build difference, so
I claim nothing about which is better). Chromium's worst gap on the same gesture is 31–154 ms. If a
~300 ms main-thread stall at drawer-open reproduces on real Safari, that is a T4-P1 finding in its
own right and it is **upstream of every family in this loop** — the FLIP's forced layout plus the
three-pass stroke filter, not anyone's content grammar. Rig: `pass2/rig/framegap.mjs`. This is M1's
standing question.

---

## 8 · PARSIMONY, HONESTLY

| | raw | code-only (comments stripped, same stripper both sides) |
|---|---:|---:|
| `GameControlPanel.vue` | +349 / −53 | 757 → 969 (**+212**) |
| `CheckStatus.vue` (new, holds BOTH renderings) | +168 | **+108** |
| `SheetWashiLabel.vue` (`anchor="tag"`) | +26 / −3 | **+14** |
| `AssistSettings.vue` | −91 | **−64** |
| `PencilModeToggle.vue` | −47 | **−32** |
| plumbing: 5 games + 2 relays + 2 unit tests | +12 | **+12** |
| **total** | **+376** | **+255** |

**This family does not win on subtraction and I will not claim it does.** It wins on 6→2 headings,
−33 px of coarse phone card, an ink rank that beats the heading it commits, four a11y closures, and
a state the app has had for a tranche and never shown.

The priced closure is named: **~half of `GameControlPanel`'s +212 is the well markup written twice**,
once per template branch. Pass 1's banked T′ collapse (one tree driven by `mobile`, −155 lines) takes
most of it back. I did not do it here — it widens the diff across every golden surface and this is a
design pass, not a refactor — but it is the first thing to cash if the family advances.

If the pen loses M2, `CheckStatus` sheds ~42 code lines and the total lands near **+213 code-only**.

---

## 9 · WHAT IS STILL OPEN

1. **M1 — the settle on real WebKit during real motion.** Headless cannot answer it. Blocking.
2. **M2 — the blind read.** My ink measurement says the pen loses; a device read decides.
3. **Research open Q5, still open** — three `:pose="0"` frozen frames inside one boiling 3 px frame
   have never been *watched*, only screenshotted. Static PNGs cannot tell still from dead. Needs
   video (M4). If dead, the priced alternative is a taped top rule on wells 2–3 with the drawn box
   reserved for staging.
4. **Goldens not run** — they mint from a built dist and the runner mints the linux set. `e2e/`
   greps clean for every deleted label and class, and both *positional* couplings were verified on
   the dist rather than reasoned about, but 8/8 remains unverified by this lane.
5. **Deal is heavier, not un-orphaned** (§4).
6. **Mark 1 (picker hierarchy) is not addressed and is not claimed.** Pass 1 claimed it at zero
   artifacts; this lane does not claim it at all.
7. **Dark tape is a perception question, not a contrast one** (M5) — 8.96:1 measured, but translucent
   tape on a near-black card *looks* washed out, and that belongs to `--sheet-washi-neutral`
   estate-wide, i.e. Lane D.

---

## 10 · FOR THE REGISTRY

Portable regardless of which family wins:

- **`SheetWashiLabel anchor="tag"`** — the estate's zone-naming primitive: zero raster, zero beat,
  its visible text *is* the accessible name, lower case so it is chimera-free.
- **The regime witness** — three observables, not one media query, asserted per cell against what the
  cell *claims*, with the pass-1 harness reproducible on demand as the negative control.
- **Ink mass as a measurement** (`pass2/rig/inkmass.mjs`) — rendered stroke mass and density from a
  DPR2 clip. It answers "does this glyph put less ink on the paper than the heading it commits," which
  a bounding-box ratio cannot, and it separates base from head where the box ratio does not.
- **Rank by ink, not by box** — the height-free way to promote a control in a card whose every
  coarse-pointer control is `height: auto`.
- **Delayed keyframes with `both` fill** for any staggered interior settle. A transition cleared by
  a double-rAF cannot stagger: the class does not outlive the delays.
- **`pressure = state, words = reason`** — a two-rung graphite ladder for a boolean, with the words
  carrying the why. Monotone by construction, AA at both rungs, and free to assistive tech.
