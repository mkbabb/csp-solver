# LANE C — MEASURE REQUESTS (pass 2, F2 narrowed · the zone grammar)

Worktree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_6e1b18f4-0f2-3`
Built dists, ready to serve read-only (no build step needed):

| dir | what it is |
|---|---|
| `pass2/dist-base` | shipped HEAD `32198688`, the control |
| `pass2/dist-f2type` | zone grammar, checkArmed rendered TYPOGRAPHICALLY (`CHECK_RENDERING = "type"`) |
| `pass2/dist-f2pen` | zone grammar, checkArmed rendered as the drawn PEN (`CHECK_RENDERING = "pen"`) |

`pass2/rig/serve.mjs` serves any of them; every rig script takes `--root=<dir> --port=<n>`.
Ports used here: 8801–8903. **Never 3000/3001/4288/4894/4895.**

Everything below is a row this lane could NOT close in headless. Rows I did close are in
`lane-c-report.md` §2 and are not repeated here.

---

## M1 — THE SETTLE ON REAL WEBKIT DURING REAL MOTION (blocking; registry §1 F2 item 3)

**Why it must be on device.** `BoilDivider.vue:42-47` is the house's contrary ledger: *"WebKit
paints SVG content unlayered — `will-change: opacity` on an inner `<g>` earns no compositor layer
there … measured ~10 fps steady-state on desktop Safari against the deployed edge (2026-07-15),
recovering to 98 fps with the divider pinned."* Pass 1 asserted its settle was "a compositor
offset, never a descendant transform," which is the Chromium story and was never asked of the
other engine. This lane's settle is deliberately built to sit outside that hazard — the movers are
three unfiltered `<span>` tapes, not the wells, and never `.control-panel-filtered` — but "outside
the hazard" is a claim, and on this engine it is the claim that has been wrong before.

**What I measured headless, and why it isn't enough.** Chromium: all three tapes dip and settle at
**102.3 / 116.3 / 143.7 ms** with 4 intermediate frames each — the choreography is real and lands
inside `GLIDE_MS` 520 with 376 ms of margin. Headless WebKit: the same build delivers **34 frames
in 900 ms** across the glide and the sampler catches the taping class in **1** frame; the settle
reports 282 ms because rAF is starved, not because the animation is slow. A frame-starved headless
engine cannot answer this.

**Capture, on the booted `perf-rig-iphone16` and on desktop Safari:**

| cell | build | scenario |
|---|---|---|
| M1-a | `dist-f2type` | drawer CLOSED → tap the pull-tab → open. Paint/raster timeline for 1.2 s from the tap. |
| M1-b | `dist-base` | same gesture. **This is the negative control** — the stall is upstream of this lane and the two must be compared, never M1-a alone. |
| M1-c | `dist-f2type` | same gesture with Reduce Motion ON. |
| M1-d | `dist-f2type` | drawer already OPEN, 3 s idle. |

**Numbers wanted per cell:** frame count and worst inter-frame gap over the 1.2 s; paint count and
total raster area; whether `.control-panel-filtered` re-rasters during the glide; fps floor.

**Thresholds (mine, state the measurement even if it misses them):**
- T1 `f2type` worst inter-frame gap ≤ `base` worst gap **+ 0 ms** — the settle must be free. Any
  positive delta is charged to this lane.
- T2 M1-d idle paints = 0, matching base. A tape that costs an idle painter is retired.
- T3 M1-c records zero tape animation.

**Negative control that must be shown able to fail:** M1-b. If base and f2type come back
indistinguishable to within noise, say so — that is the honest result and it retires T1 as a
discriminator rather than passing it.

**Standing finding to confirm or refute (this is the campaign-relevant one).** Headless WebKit
starves rAF for **339–538 ms at glide onset on BOTH builds** (n=2 per build: base 538/355 ms,
f2type 373/339 ms — the variance swamps the build difference, so I claim nothing about which is
better). Chromium's worst gap on the same gesture is 31–154 ms. If a ~300 ms main-thread stall at
drawer-open reproduces on the real device, that is a T4-P1 finding in its own right and it is
upstream of every family in this loop — the FLIP's forced layout plus the three-pass stroke filter,
not anyone's content grammar. Rig: `pass2/rig/framegap.mjs`.

---

## M2 — THE checkArmed BAKE-OFF, BLIND READ ON DEVICE (blocking; registry §1 F2 items 2 + 5)

Two builds, same slot, same words to assistive tech, same accessible structure. The only
difference is whether the state leads with a drawn object or with ink pressure. **Do not tell the
reader which is which and do not show them the two together.**

**Pair:** `dist-f2pen` vs `dist-f2type`, phone viewport, teacher's compartment.
Shots already banked for reference (do not substitute them for a device read):
`lane-c-shots/PEN-chromium-teachers-{off,ask_armed,ask_stale,live}.png`,
`lane-c-shots/TYPE-chromium-teachers-{...}.png`, plus `-wk` WebKit twins.

**Reach the states the way a player does** (scripted in `pass2/rig/bakeoff.mjs`):
`off` → tap Off · `ask_armed` → tap Ask · **`ask_stale` → tap Ask, then type a digit into a cell**
(a real board edit is the only thing that clears `checkArmed`, `useAssists.ts:63`) · `live` → Live.

**`ask_stale` is the whole experiment.** It is the state the app has always had and never shown:
the row still reads "Ask" as selected while nothing is being checked. Ask each reader, cold:

1. *Right now, is the teacher marking your board?* (correct: no)
2. *Why not?* (correct: you wrote something since the last check)
3. *What would you tap to make her?* (correct: Ask, again)

Q2 is the discriminator I expect to decide this. The pen says `put away`; it carries the state but
not the reason. The sentence says `board changed · Ask again`; it carries both. If readers get Q1
right from the pen and Q2 wrong, the pen is an indicator and the sentence is an explanation, and
the compartment needs the explanation.

**Wanted:** ≥4 uninstructed readers, per-question correct/incorrect, plus the time to first answer
on Q1. Report the pen's Q1 latency separately — colour recognition should beat reading, and if it
doesn't the pen has no case at all.

**My measured evidence, for the adjudicator to weigh against the read (§3 of the report):** in the
same slot the pen puts **170.89** units of ink on the paper at density **0.0265**; the sentence puts
**251.08** at **0.0665**. The pen is the lightest mark in its own compartment — lighter than the
washi tags (0.138) and a quarter the density of the headings. It costs ~42 code lines. On ink
weight, the half of the charter's centre pass 1 never measured, the pen loses.

---

## M3 — THE COARSE HEIGHT GATE, CONFIRMED ON GLASS (registry §1 F2 item 1)

Closed headless in both engines and both regimes; wanted on device because a real phone has a
dynamic viewport and a real font stack, and this gate is the one pass 1 got wrong.

Capture `.mobile-board-width` scrollHeight and the visible co-visibility of board + card on the
booted sim at 390×844 and 375×812, on `dist-base` and `dist-f2type`.

| gate | base (headless, both engines) | f2type | verdict |
|---|---:|---:|---|
| 390×844 coarse | 619 | **586** | −33 px |
| 375×812 coarse | 619 | **586** | −33 px |
| 1280×800 coarse | 1138 | **1116** | −22 px |
| min tap target, coarse | 43.2 (chromium) / 43.7 (webkit) | **44.0** | floor closed |

**Threshold:** f2type < base at every coarse cell. **Negative control already run and banked:**
`pass2/out/negctrl-harness.json` — the pass-1 harness (`hasTouch` forced off) on the *same build*
reports 452 px instead of 586 and all four regime witnesses fail. The gate is not vacuous.

---

## M4 — THE ZONE GRAMMAR IN THE CARD'S OWN BOILING FRAME (research open Q5, still open)

Three `:pose="0"` frozen wells now sit inside a card whose own `HandDrawnOutline :stroke-width="3"`
boils on the shared beat. Static PNGs cannot answer whether that reads *still* or *dead*. Wanted:
10 s of video of the open card at rest, light and dark, desktop Safari and the sim.

**Question for the owner, not a threshold:** do three motionless 1.5 px frames inside one moving
3 px frame read as a pencil case sitting on a sheet, or as three dead boxes? If dead, the priced
alternative is to drop wells 2–3 to a taped top rule only and keep the drawn box for the staging
zone alone — the tape is doing most of the naming work already.

---

## M5 — DARK-THEME TAPE, PERCEPTUAL CHECK ONLY

Not a defect: measured, every new voice clears AA in both themes (report §5). The zone tape is
**17.36:1 light / 8.96:1 dark**, and the shipped peek chip measures identically, so the tape is no
worse than what already ships. But translucent tape over a near-black card *looks* washed out in
the dark screenshots, and contrast ratios do not capture that. One owner glance in dark on real
glass; if it reads struck-through rather than taped, the fix is `--sheet-washi-neutral`'s dark
value and it belongs to Lane D, estate-wide, not to this lane.
