# ACC-FIVE — five crayons, no sixth · pass 1 CRITIQUE

Adversarial read by a lane that wrote neither the spec nor the prototype. T9-W7 §3/§4/§12/§15,
mark M07. U-10: nothing here closes a mark.

**Verdict: ADVANCE. Convergence 70.** The design is right and the centre is real — but the gate
the family calls its centre **cannot fail**, and I proved it by ablation rather than by argument.

Worktree read: `.claude/worktrees/wf_e58b4764-0fc-42`, 7 files, +209/−69, nothing committed,
nothing outside those 7 touched (`git status --porcelain` = 7 ` M` rows). Served on my own
`http://127.0.0.1:4241` (`vite --strictPort`), chromium + webkit headless, light and dark,
1280×800. No osascript, no Safari, no :3000. Probes and readings banked beside this file at
`critique/ACC-FIVE/{probe,readings}`.

---

## 1. THE FINDING — the centre gate greens with the hand-off deleted

The gate as written: *">0 chromatic px in the 22×246 frame band after the win, median hue within
5° of crayon-gold, both themes, five samples"* — born RED at HEAD (0 px), GREEN on the prototype
(1,382–1,410 px).

Both halves of that are true. Neither measures the hand-off.

I re-ran the prototype's own census (`handoff-paint.mjs`'s band, floor, sample times, verbatim)
with one rule injected that **deletes the win**:

```css
@layer base { .solve-success .progress-trace { stroke: var(--color-progress-ink) !important } }
```

(`@layer base`, not unlayered: for `!important` declarations layer order INVERTS, so an unlayered
`!important` loses to the win rule's layered one. My first ablation was unlayered and silently
no-opped — the trace still read `rgb(201,154,46)`. That trap is itself worth carrying, §6.)

| chromium | pre-win px / h / L | post-win px / h / L | stroke after win | centre gate |
|---|---|---|---|---|
| light · live | 1403 · 83.7 · **0.588** | 1382 · 83.6 · **0.692** | `rgb(201,154,46)` | GREEN |
| light · **hand-off ablated** | 1403 · 83.7 · 0.588 | 1403 · 83.7 · **0.588** | `rgb(164,121,3)` | **GREEN** |
| dark · live | 1379 · — · **0.540** | 1410 · 95.7 · **0.832** | `rgb(229,199,77)` | GREEN |
| dark · **hand-off ablated** | 1330 · — · 0.548 | 1379 · 96.6 · **0.540** | `rgb(125,105,2)` | **GREEN** |

`readings/critic-ratios-ablate.json` (part B) and `readings/handoff-ablate.json`.

The trace is gold **before** the win, so ">0 chromatic px at gold's hue" is satisfied at 0%, at
50%, at 100%, and with the win rule removed entirely. The gate distinguishes *this family from
HEAD*; it does not distinguish *the win from the minute before it*. The one quantity that moves
is the one the gate does not read: **median OKLCH L of the band's chromatic pixels, +0.104 light
and +0.292 dark.** The lane's own probe records L for a single most-chromatic pixel and gates on
none of it.

This is not a reason to doubt the design — the live arm really does lift, and `handoff-strip-dark.png`
shows it plainly. It is a reason the 100 is not earned yet.

## 2. What I re-derived myself, and where it agrees

Tokens resolved off the live page, composites computed here (not read from the lane's files):
`readings/critic-ratios-ablate.json` part A, identical in both engines to three decimals.

| arm | light | dark | lane's painted figure |
|---|---|---|---|
| digit / card | **5.065** | **7.341** | 5.065 / 7.341 ✓ |
| digit / background | 4.945 | 7.501 | 4.945 / 7.501 ✓ |
| trace@0.95 / grid-line | **3.594** | **3.223** | 3.59–3.60 / 3.18–3.23 ✓ |
| trace@0.95 / card | 3.589 | 3.246 | 3.57–3.58 / 3.23–3.26 ✓ |
| ring@0.9 / card | **3.626** | **6.424** | 3.62–3.63 / 6.38–6.44 ✓ |
| verb / its own **5%** ground | **4.631** | 5.985 | 4.55 / 4.58 · 6.07 ✓ |
| verb / the incumbent **8%** ground | **4.424** | 5.768 | 4.35 / 4.36 ✓ (under AA) |
| wax / card at the win | 2.533 | 11.234 | 2.53 / 11.23 ✓ |

The ink-tier arithmetic holds: the worst of the four 1.4.11 arms **rises** in both themes and the
kinship move costs 0.013 of the digit's ratio. The 5% ground is arithmetic, not taste — I measure
the incumbent 8% ground at 4.424, under AA, exactly as the research found.

Estate gates, run by me on the worktree: `check-copy-register` **0 unadmitted** (2 pre-existing
admitted rows, M16 clear — no new rendered string), `check-theme-tokens` **0 unreferenced**,
`check-theme-selectors` closed, `check-motion-contract` 34 specs, `check-ink-pressure` green.
π on unclaimed surfaces: the diff touches 7 files and no other; the only added `filter` is the
sparkle's single `drop-shadow`, so the budget-9 population is unmoved by construction.

Frames read, both engines, both themes. `handoff-strip-light.png` measured by me: the won panel's
most-chromatic pixel is `[193,148,46]` against `[158,117,5]` in the three before it, mean of the
chromatic band `[152,119,42]` vs `[127,98,20]` — the lift is in the picture, not only in the
ledger. `confirm-chromium.png` reads as claimed.

## 3. THE OPEN GAPS

1. **The centre gate cannot fail** — proven above. Restate it as: *the band's median chromatic-pixel
   OKLCH L rises ≥0.09 across the win (light 0.588→0.692, dark 0.540→0.832) AND the post-win computed
   stroke resolves to `--color-gold-star`*, and keep the ablation arm in the probe so the gate reds
   when the rule is removed.
2. **`--color-blue-ink` has exactly one consumer** — `--color-user-ink`, in each theme, and nothing
   else in `src/`, `e2e/` or `scripts/`. The estate's own `check-theme-tokens` prints it as
   `ALIAS-ONLY`, and `index.css:143-148` — four lines above the new block — is the T5-W2 2.3 ruling
   that killed three tokens for being "a third name for a colour that already has two". The second
   consumer (§12's mark) is a hand-off the plan declares out of scope. Land that consumer in the
   cure's own commit, or collapse the pair to one name.
3. **The peer walk now collides with the gauge, and nothing measures it.** `playerIdentity.ts:68` is
   `oklch(var(--peer-ink-l) 0.11 ((i*137.5)%360)deg)` with no avoid-list: index 19 lands at **92.5°**,
   **2.7°** from the dark trace's 95.2° at near-identical chroma (0.11 vs 0.107), inside the family's
   own reserved arc 77.4–100.8. The estate already treats **17.7°** as a collision — that is the
   documented reason the join trace retraces offset (`HandDrawnGrid.vue`, `.join-pose`: "index 2 lands
   at 275deg, a hand's breadth from `--color-progress-ink`… it read as ONE ring"). The family's
   "peer worst 5.36 over 40" is a **contrast ratio** (`accent-kinship.probe.ts:394-400`), not a hue
   separation. Measure the 40 indices' OKLCH hue distance to both progress arms and gate it, or land
   the reserved-arc enforcement in the same commit as the token move.
4. **The law the family breaks is left standing in the source.** `index.css:183-185` still reads
   "Gold is earned light: it lives in the sky and comes to the page only when the work is done" while
   the trace now paints gold from the first digit. The diff rewrote the tier comment immediately below
   it and left the law untouched.
5. **Four more doc sites now lie.** `HandDrawnGrid.vue:31-34` — the `solveSuccess` prop still cites
   `.solve-success .progress-trace { opacity: 0 }` and "the 500 ms bow-out … has nothing left to fade",
   the exact rule this prototype deleted. `GameControlPanel.vue:8` — "the difficulty heading's crayon
   tone is derived from the selected option's `colorClass`", now false. `index.css:146` and `:202-209`
   — both name the section-heading as the ink tier's subject. `.join-pose`'s rationale names a 275°
   peer as near `--color-progress-ink`, true of the violet and false of gold.
6. **filterBudget and the goldens were measured against a DEV SERVER.** `e2e/filter-census.spec.ts`'s
   own header says "against the BUILT dist", and the banked golden discipline is goldens only vs a
   built dist; the lane ran both on `:4236` (its README §7 and the run list). The 12/12 and the two
   board deltas are indicative until re-run off `npm run build`.
7. **Meter symmetry misses its gate**: 1.26px at 1280, 0.72px at 393, against ≤0.5px. The lane's own
   diagnosis is right — the pads are equal at 12 and the residue is the frame's per-side wobble jitter
   (bbox L4.96 T6.94 R4.28 B9.51). Restate the gate at 1.26px or hand the jitter to whoever owns it.
8. **Paired census misses on one cell**: chromium dark mid 20.58/20.70% against ≤17%, reproducible.
   The defence is sound (10.0 of those points are the 240–270° bin — the pen and the ring, off-band by
   construction in a 40–115° census) but the gate is still red as written. Restate the threshold
   against the band it actually measures, or make the blue bins a declared term of it.
9. **The ring gate's number is the spec's mean, not a painted floor**: gate ≥6.4 against painted 6.38
   chromium / 6.44 webkit; my own composite gives 6.424. Set it at 6.38.
10. **The post-win trace sits at 2.53:1 on the light card and stays there** for as long as the solved
    board is on screen. The family exempts it as celebration under 1.4.11 by analogy to the shipped
    solved frame — but the solved frame was never a gauge carrying a live `.progress-trace-a11y`
    value. That exemption wants the owner's word (U-10), not the analogy.
11. **The confirm's recolour is bigger than the sentence it is sold as.** `color: var(--color-red-ink)`
    on `.guard-face` also flips the `HandDrawnOutline`'s `currentColor` stroke, so the drawn **box**
    turns red as well as the word (`confirm-chromium.png`). "One red word on a faint red ground" is
    not what paints. The boundary clears (red-ink 4.92 on card) but that reading is not in the ledger.
12. **Goldens not re-minted** (the lane's own row, confirmed): `grid-corner-light` 6,858 px,
    `cell-light` 2,292 px; darwin off a built dist, linux off the runner artifact.
13. **The static instruments cannot see the alias** (the lane's own row, sharpened): `consumers.mjs`
    and R6's `hue-census.mjs` each need one roster line in the cure's own commit, or the next census
    describes an estate that no longer exists.
14. **Row 3 (a control's focus ring) stays RED**, untouched — a focus-IDIOM decision, not a token
    alias, and its gate must keep R2's subject-count guard (PW-WebKit reaches 0 controls by Tab).
15. **The solved frame's own gold still does not paint** — `bakedHidden 4 / bitmaps 4`. Routed
    around, not cured; still a W7/W8 substrate row.
16. **Hand-offs not carried**: the five reserved arcs to §11c, the mark's live colour to §11 — and
    gap 3 is what makes the first of those load-bearing today rather than later.

## 4. STRENGTHS

- It **runs**, as source, both engines, both themes, both viewports, and every number I re-derived
  independently agrees to ≤0.02 of a ratio.
- The kinship is **bought, not spent**: the worst of the four 1.4.11 arms rises in both themes
  (3.35→3.57 light, 3.05→3.18 dark) while hue error falls 11.5°→0.2° and 41.3°→0.3°.
- A four-tranche-old lie in `index.css` becomes true: the dark focus ring, 3.66 → 6.424.
- The trace gains **print and forced-colours arms it never had**, and the layer/importance reasoning
  behind them is measured (print at the win reads `rgb(0,0,0)`), not asserted.
- The verb's 5% ground is arithmetic: 4.424 on the incumbent 8% ground is under AA, 4.631 on 5% is over.
- The substrate defect is **named** rather than papered over, and the cure routes around it with zero
  filters and zero re-raster — a stroke swap on geometry already on screen.
- Off-token literals fall from three to the one declared exception; no stock hex survives.

## 5. CHECKLIST

| item | hit? |
|---|---|
| gates that cannot fail | **YES — the family's centre gate, proven by ablation (§1)** |
| vacuous convergence | **YES — the same claim; its only instrument is satisfied before the win** |
| legacy alias / consumer-less substrate | **YES — `--color-blue-ink`, one consumer, against the estate's own T5-W2 2.3 ruling** |
| the elegant-reduction trap ("and then the hard part") | **YES — the bake defect routed around, the arcs and the mark's colour handed off, goldens un-minted, both static instruments blind to the alias** |
| the constraint it forgot | **YES — the peer walk's hue (§3.3); the gold law left standing in source (§3.4)** |
| the pixel it moves that it did not declare | **YES, minor — the confirm's drawn box (§3.11). The frame's 7.63px move IS declared.** |
| spec-cites-itself circularity | **soft — the ring's gate number is the spec's own two-engine mean cited back as a floor** |
| unverified gestalt | no — frames exist in both engines and both themes; I measured the hero strip myself |
| masked fallback | no — the glyph's `#2563eb` fallback is removed, which is the opposite move |
| the generic default | no |
| M16 / filterBudget / W2's landed mechanics / π | clear — copy-register 0 unadmitted, one filter added and it replaces one, the phone frame sits on W2's bottom tab, 7 files and no others |

## 6. CROSS-POLLINATION

1. **Ablate every gate once.** A pass-1 gate should be run with its own cure defeated; one that
   greens under ablation is not a gate. This caught the strongest family in the wave.
2. **Ablating a layered rule needs a layered ablation.** An unlayered `!important` loses to a layered
   one, so an ablation must be injected into a layer declared EARLIER than the rule it defeats
   (`@layer base { … !important }`). Every family touching `@layer` rules will silently no-op otherwise.
3. **Carry a state change on a live grain-baked pose stack, never on the bake-hidden vector stack.**
   Any family that wants the board to change at a moment (MOT-*, MRK-*, PLR-*) meets the same bake.
4. **The ink-tier algorithm** — hold the crayon's OKLCH hue, take the maximum chroma sRGB allows
   there, walk lightness until the floor is cleared, and when the element sits between two grounds
   that swap with the theme, solve for the lightness BAND rather than a floor. ACC-GRAPHITE, ACC-SIX
   and the PAL-* families can reuse it verbatim.
5. **`check-theme-tokens`' `ALIAS-ONLY` line is a free first read** on any family that mints a token.
6. **The 40-index peer-hue sweep against every reserved arc** belongs to PLR-SELF and PLR-PLACE as
   much as here.
7. **Measure the thing that MOVES, not the thing that is TRUE.** Hue was true before and after; the
   lightness is what the win spends. A gate should read the delta the design claims.
