# MOT-DERIVE · pass-1 CRITIQUE · Distance and material

**Convergence: 78 · Verdict: ADVANCE**

Adversarial read by a lane that wrote neither the spec nor the prototype. Everything below
was re-derived on this machine: the diff read in its worktree, both crops looked at, the
prototype's dist re-served on `127.0.0.1:4244` (my own port, `--strictPort`), and a probe
of my own run in chromium AND webkit across the whole viewport band the new constant
governs. Instrument and data banked at `data/` beside this file.

---

## 1. What I re-ran

| check | how | reading |
| --- | --- | --- |
| the diff | `git -C <worktree> diff` | 3 files, 69/18. No CSS, no `.vue`, no copy, no curve. The claim is the whole claim. |
| the dist carries it | `grep ':600,' dist/assets/index-rx2K2-oRgmZi.js` | 3 hits — the measured bundle is the changed bundle, not a stale build |
| **G-MOT-D3 (i7)** | `FE=<main tree>` then `FE=<worktree>`, bare | **HEAD: RED, exit 1**, 0 of 2 in scope, and it prints the reason the drawer is not in scope. **DIFF: GREEN, exit 0**, 4 of 4, every declared px/ms within 0.5% |
| **G-MOT-D1 (i3 B2)** | same, both trees | **HEAD: RED on exactly one row** (`useControlsDrawer.ts:232` spends `GLIDE_MS`, decl `:86`). **DIFF: B2 GREEN**, 5 sites / 0 homeless. i3's overall stays RED in both trees on the CSS arm — 8 homeless CSS durations, identical rosters, untouched and declared |
| **the band sweep (mine)** | 6 viewports × 2 engines on the prototype's dist | §2 — the finding |
| AA both themes | computed ratios on the settled sheet, 390×844 | light min **18.99**, dark min **15.84** (the three sub-4.5 webkit rows are my own parser reading an oklab float triple, not a contrast failure). Structurally the diff touches zero CSS, so AA cannot have moved |
| M16 | `npm run lint:copy` in the worktree | GREEN — 0 em/en dashes, 0 unadmitted jargon, no string minted |
| motion contract | `npm run lint:motion` | GREEN — 34 specs |
| π on the desk | my own sweep at 1440×900 | 4 movers, one clock, `duration 520`, travels 193 / 209 / 317.6 / 0 — matching r0's `r4-probe3.json` roster and order |
| π at the dock | r0's `390x844-phone` bank vs my sweep | travel **628px both**, only the clock moved (520 → 600). No pixel of rest pose moved: settled `{0, 216, 390, 628}`, identical to the crops |
| W2's mechanics | the diff | sticky tag, dock, bottom tab, tap-floor: zero bytes |
| the masked-fallback risk | `grep` every `run(` site | exactly one drawer run site (`:331`) and it always passes the ternary. There is no path where the dock inherits the desk's default. **Cleared.** |

The two crops are honest: both engines land the same open rest pose, and the README says
outright that a crop cannot carry smoothness. Good.

## 2. THE FINDING — the constant was auditioned at one pose and governs five

`dockGlideMs` is spent by `mobileDock = !rowRegime`, and `rowRegime` is exactly
`(min-width: 1024px)`. So **600ms governs every viewport under 1024 in both orientations.**
The audition measured one of them. My sweep, both engines, on the prototype's own dist:

| viewport | sheet travel (chromium / webkit) | clock | px/ms |
| --- | --- | --- | --- |
| 844×390 landscape phone | 302.0 / 302.0 px | 600 | **0.503** |
| 360×640 small phone | 424.0 / 424.0 px | 600 | 0.707 |
| 1023×700 just under the rail | 484.0 / 484.0 px | 600 | 0.807 |
| **390×844 — the audited pose** | **628.0 / 628.0 px** | 600 | **1.047** |
| 768×1024 tablet portrait | 681.0 / 681.5 px | 600 | **1.136** |
| *1440×900 desk (control)* | *209.0 / 213.0 px* | *520* | *0.402* |

That is a **2.26× travel spread on one constant**, which is a 2.26× velocity spread. The
family's own README states the principle: *"one constant duration across a 3× travel is a 3×
velocity, which is the family's own inversion read forward."* It says that about desk-vs-dock
and then reproduces it **inside the dock**, unremarked. The audited pose is not even the
band's worst case: 768×1024 is 8% faster than the number the banked sentence was written
against, and 844×390 is barely above the desk's own velocity — where 600ms on a 302px throw
is the "drag" the sentence rejects 680 for.

This does not sink the design. The clock is still a decision rather than an inheritance, and
that was the point. But the config line **`travel: 628px @390x844 (sheet) · 1.05 px/ms · the
sheet's own height`** reads as *the dock's travel* and is one of at least five, and i7's
grammar already permits the second ` · ` clause that would tell the truth.

## 3. The memorable sentence is disproved by the prototype's own table

The spec's closing promise: *"the dock's rise reads at the desk's weight."* At 600 the dock
runs 1.047 px/ms against the desk's 0.402 — **2.6× the weight**, and the README concedes
"no candidate brings the dock near the desk's per-frame displacement, and none can." The
prototype is honest; the spec sentence is not, and it is the one line a reader carries. What
is actually true and worth keeping: *the dock's clock is its own named decision, seen against
its own pose.* Restate it or change the design so the weights meet (which the family has
already shown one constant cannot do).

## 4. M06 is cited in the wrong direction

The config rejects 680 as reading like "drag on a surface the owner already calls slow to
draw (M06)." T9-M06 is the owner's **first-paint / render-performance** mark ("poor for
drawing, dark mode toggle… subsequent invocations are better") — W8's subject, an attribution
about how long the surface takes to *render*, not about how long a transition should *last*.
If anything a slow-to-render phone argues for more milliseconds per frame, not fewer. The
mark this family actually serves is M02, "the controls drawer animation is not smooth," and
M02 is the cite that belongs there. A mis-citation inside a banked sentence propagates.

## 5. The grammar's enforcer is evidence-side

i7 is real (derived scope, exits 1 on RED — I checked bare, the `| tail` trap eats it), and
it is the only consumer the travel lines have. The plan promotes it to `scripts/` **only if**
the agglomerated §13 lands a motion gate. Land the lines without the gate and the grammar is
prose in four docstrings: a substrate with no standing consumer. Its arithmetic check is also
self-consistent by construction — declared px/ms against declared travel ÷ ruled duration —
so a travel that goes stale passes forever. §10 of this wave re-cuts the controls card, whose
height *is* the 628. The prototype names this; the band data makes it live today rather than
someday.

## 6. Checklist

| item | reading |
| --- | --- |
| vacuous convergence | **clear** — three gates born-RED at HEAD on exactly the named rows, re-run by me |
| spec cites itself | **clear** for the gates; but M06's cite (§4) is a mis-citation |
| gates that cannot fail | **clear** — i7's scope is censused from the call sites, not listed; exit 1 on RED |
| elegant-reduction trap | **soft hit** — "the prototyper's eye at the local preview picks" and the device reading is W8's. The hard part is real and deferred, but it is deferred *by name*, with the dist and the hook banked for it |
| legacy aliases | **soft hit** — `GLIDE_MS` dies in the drawer and survives one file over in `useCarouselGlide` (the estate's second FLIP engine, untouched) |
| masked fallbacks | **clear** — one run site, always explicit; verified by grep |
| unverified gestalt | **HIT** — "reads at the desk's weight" (§3), asserted and disproved; and smoothness itself is unwitnessed by any eye |
| consumer-less substrate | **HIT (conditional)** — the travel grammar's only enforcer may not land (§5) |
| the generic default | n/a — no visual design minted |
| the pixel it did not declare (π) | **clear** — desk keyframes byte-identical to r0, dock rest pose identical, verified independently in both engines |
| the constraint it forgot | **HIT** — the band (§2): the constant governs `<1024` whole and was auditioned at one pose. AA, filterBudget, M16, W2's mechanics and R6's laws are all intact (R6 law 1: one curve across both poses — honored; law 2's scope fence — honored, no other surface re-eased; law 4, no timing constant outside pencilConfig — this diff is the law being *obeyed* for the first time at this seam) |

## 7. Strengths worth carrying

1. **The paired HEAD control dist** — a second build from HEAD in the same worktree, same
   machine, same hour, through the same instruments. It is what lets the 4× long frame be
   reported as the estate's rather than the diff's. This should be the wave's default method.
2. **Naming the ungateable** — "a static reader cannot see a travel" is said plainly instead
   of dressed as a gate.
3. **Refusing to narrow a gate to go green** — i3's CSS arm is left RED in both trees.
4. **The audition hook** — `Element.prototype.animate` rewritten for one selector, three
   candidates on one dist, the desk provably untouched. No rebuild per candidate.
5. **The 60Hz resample** — headless rAF runs ~120Hz, so a raw per-frame figure is the
   instrument's cadence. Catching that is the difference between a number and a fact.
6. **It kills a literal.** `GLIDE_MS` contradicted the covenant its own file quotes.

## 8. Verdict

**ADVANCE at 78.** The mechanism is right and minimal, the seam (`run(specs, durationMs?)`)
is the smallest one that buys a per-pose clock, the gates are real and born-RED where the
spec said, and nothing this family does not claim moved by a pixel. What is not earned is the
**number**: 600 was auditioned at one of five poses it governs, the sentence banked beside it
speaks for that one pose, its supporting cite points at the wrong mark, and the promise the
spec closes on is contradicted by the prototype's own table. None of that is a missing
primitive (not BLOCK) and none of it is a reworded incumbent (not RETIRE) — it is an
audition that has to run across the band, with the owner's eye at the end of it (U-10).
