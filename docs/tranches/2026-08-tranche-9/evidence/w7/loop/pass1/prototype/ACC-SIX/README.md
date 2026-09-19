# ACC-SIX — the sixth crayon · pass-1 PROTOTYPE (it runs)

Arm (b), plan steps 1-8, built in a throwaway worktree and measured on the real surface.
Nothing committed. The diff is `proto/acc-six-proto.diff` (11 files, +377/−88).

- Worktree: `.claude/worktrees/wf_e58b4764-0fc-41`, branch `worktree-wf_e58b4764-0fc-41`, off `aab67b92`.
- Dev server: `npx vite --host 127.0.0.1 --port 4241 --strictPort` (4235, the charter's port, was
  held by a concurrent lane; 4241 is the next free in the band). Preview of the built dist on 4242
  for the goldens only.
- Probe: `probe/acc-six-proto.probe.ts` + `probe/acc-six-proto.config.ts` (a copy of the estate's,
  no `webServer`, no `globalSetup`, baseURL :4241), chromium + webkit headless, 1280×800 /
  393×699 dpr3 / 900×450, light and dark. No osascript, no Safari.
- Census JSON: `census/`. Crops: `frames/` (13 files, largest 71 KB; the family's evidence is 508 KB).

## What the surface says

| row | reading | gate |
|---|---|---|
| kinship, six anchors, KIN_DEG 5 | every non-excepted accent KIN, both engines both themes; `user-ink`/`blue-ink` 0.0° off crayon-blue, `progress-ink` 0.3° light / 0.0° dark off the sixth, solver stop 2 0.0°/0.6° | GREEN (RED at HEAD) |
| `--color-focus-sketch` | `getPropertyValue` on `:root` returns `""` and no rule in any sheet mentions it, both engines | GREEN (RED at HEAD) |
| painted dark ring | 6.46 chromium / 6.45 webkit at stroke-opacity 0.9 (modal blue pixel over the dark card) | GREEN, gate ≥6.4 |
| painted light ring | **3.91** both engines (HEAD 3.67; the spec claimed 4.01) | ≥3:1 GREEN, spec number missed by 0.10 |
| the four 1.4.11 ratios | tokens resolve to `rgb(139,92,246)` light / `rgb(124,58,237)` dark — byte-identical to HEAD; arithmetic at 0.95: 3.36 grid-line / 3.85 card light, 3.46 / 3.07 dark; painted readings 3.05–4.46, min 3.05 (webkit light over the frame) | GREEN |
| the digit | 4.64 on card / 4.53 on background light, 7.70 / 7.86 dark | GREEN, AA both themes |
| off-ANCHOR full-board share | light 27.29 chromium / 27.35 webkit (HEAD 64.29, gate ≤30); dark 1.48 / 2.62 (HEAD 49.15, gate ≤5) | GREEN both engines |
| print + forced colours | `.progress-trace` paints `rgb(0,0,0)` under print and under `forced-colors: active`, both engines (HEAD `rgb(139,92,246)`) | GREEN (RED at HEAD) |
| the armed confirm | verb `deal`, chroma 0.1997 light / 0.198 dark, **4.87** light / **6.44** dark, both engines, 1 ribbon per engine per theme | GREEN — see the ground below |
| the glow names a token | computed `drop-shadow` colour == resolved `--sparkle-glow-soft` == `color(srgb 0.768627 0.709804 0.992157 / 0.3)` in 5/5 runs, both engines; `transition: filter 0.2s` (was `all`) | GREEN, 0 flakes (RED at HEAD) |
| the count tape | laid down at fill 1, count updates in place at 2/3/4, gone after the rest window; drawn literal == `aria-valuetext` == `N of M written` at every step; all three viewports, both engines | GREEN (RED at HEAD) |
| tape box | desk 93.3×23.0 at (7.48, −11.5), 14.7% of the board; phone 82.7×20.1 at (4.25, −10.0), 22.6%; short 88.8×21.8, 31.1%. Above the board's top edge and inside its left quarter everywhere | box measured; the spec's 75×23 / 18.3% was an overlay estimate |
| masthead | box intersection **1073 px² chromium / 1089 webkit at 1280×800**, 414 / 411 at 393×699, **0** at 900×450 | RED as the gate is written |
| meter symmetry | \|top − left\| 1.80 chromium / 1.54 webkit at 1280, 0.72 / 0.88 at 393, 0.56 / 0.70 at 900 (HEAD 6.00) | gate ≤0.5 MISSED; all four overhangs now INSIDE the board box (desk 4.89 / 3.09 / 2.98 / 6.89) |
| filter census | 8 filtered elements at rest, union 90,778 px², identical both engines; the sparkle stays ONE `drop-shadow` | unmoved by construction |
| ring geometry | `d` length 627, 34 vertices, σ 72.4662, stroke-width 7, opacity 0.9, fill-opacity 0.08 — identical both engines; the path generator is untouched by the diff | unmoved |
| goldens (darwin, built dist on :4242, the estate's own golden config) | **4/4 PASS** against the committed baselines | the declared π DELTA did not materialise — see gaps |
| unit battery / vue-tsc | 810/810 over 66 files, vue-tsc 0 | GREEN |
| gates | eslint · boundary · ink · theme-selectors · theme-tokens · copy-register · live-regions · motion · knip · font-coverage · golden-bytes — all GREEN | |

## Two rulings the measurement forced

**The confirm's ground is deleted, not reduced.** The spec said 5% and, if that missed, 0. It
missed: red-ink over the 5% neutral measures **4.38** (both engines), under AA, exactly as it
measures 4.14 over the 8%. Over the plain card the same word is 4.87 light / 6.44 dark. The wash
goes; the stroke-weight mark still carries the marked/bare distinction, so the non-colour cue is
intact and the word is finally legible.

**Font coverage would have shipped a blind string.** `check-font-coverage.mjs` REDs on a
`:text="tapeText"` binding it cannot read — the gate biting exactly as designed. Cured inside the
gate, not around it: a `countTape` extractor reads the template where it is authored and emits the
alphabet it can render (`0123456789 of 0123456789 written`), the corpus declares it, and the census
pins the binding. Patrick Hand's 46-codepoint cut already holds every glyph: **zero re-cut**.

## Gaps, named

1. **The frame did not move 7.63 px.** The dark-row profile of the golden's own 180×180 corner
   crop puts the painted top edge 3 device px (1.5 CSS px) lower than the committed baseline, and
   all four darwin goldens stay green. The trace's own overhang did move (HEAD +3.22 outside top →
   −4.89 inside). Either the spec's 7.63 is wrong or the edge a reader sees at that crop is
   `.board-wrapper`'s 2px CSS border rather than the drawn frame-line — which would mean A-1c's
   "one source" does not reach the visible edge. Unresolved; the adjudicator should settle it
   before the DELTA is declared. Linux goldens can only be re-minted from the runner artifact.
2. **The meter-symmetry gate (≤0.5 px) is below the hand's own amplitude.** 1.5–1.8 px at 1280 is
   what a wobbled, grain-baked path leaves after the two pads are made one. The design claim (the
   trace hugs the frame on all four sides) is met — every overhang is inside now, where two were
   outside at HEAD. The gate's number needs re-cutting or the ruling needs to be "inside on all
   four sides".
3. **The masthead overlap is non-zero at two of three viewports.** The intersecting band is the
   masthead's transparent bottom margin (`background: rgba(0,0,0,0)`, `z-index: auto`, its bottom
   edge exactly the board's top edge), and the crops show clear paper above the tape in both
   themes and on the phone. But I did not isolate masthead INK from masthead BOX — my ink probe
   read the board under the tape, not the masthead — so as the gate is written this is RED. Cure
   candidates: stop straddling (`top: 0`, no lift), or re-word the gate as an ink test.
4. **The tape is still up at fill 4.** The rest timer starts on the third fill, so a fourth write
   inside 2.4 s is shown before the lift. That is the spec's own lifecycle; the gate's "gone by
   fill 4" reads as if it should already be gone. Measured: gone after `tapeRestMs + chromeLeaveMs`
   in every viewport and both engines.
5. **Not done, hand-offs.** The r0 `accent-kinship.probe.ts` still carries the FIVE-anchor ruling —
   the six-anchor version lives only in this prototype's probe (plan step 9's first half).
   `check-live-regions.mjs` gained no row asserting valuetext == the tape's literal (the property
   is measured here in both engines, but no gate holds it). The six reserved arcs (§11c) and the
   mark's live colour (§11) are stated, not designed.
6. **R6's heading census is not comparable.** My selector reads 2 voices over 3 heading nodes on the
   play view; R6 counts 3 over its own corpus. The diff contains no type or heading change, so the
   claim "unmoved" rests on the diff, not on a matched instrument.
7. **The census's off-WARM share rose** (light full board 0.545, dark 0.690) while off-ANCHOR fell.
   That is the arm working as designed — R2's warm band excludes crayon-blue and the sixth, so
   every newly-kin pixel reads "off-warm". The off-ANCHOR reading is the one that answers the law.
