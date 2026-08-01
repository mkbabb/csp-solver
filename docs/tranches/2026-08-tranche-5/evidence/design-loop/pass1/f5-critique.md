# F5 — THE PROPORTION LEDGER · ADVERSARIAL CRITIQUE (pass 1)

Lane: CRITIQUE (non-author). Inputs read in full: `charter-f5.md`, `f5-research.md`,
`f5-spec.md`, `f5-proto/MANIFEST.md`, `f5-proto/code/f5-slice.diff`, `apply-slice.py`,
`mock/build-mock.mjs`, `measure/measure.mjs`, `measure/measurements.json`,
`measure/font-coverage.json`, and the rendered PNGs. Independent verification ran headless
Chromium out of the project's own playwright against purpose-built probes under
`…/pass1/f5-verify/` and against the family's own mocks. The project tree was not modified
(`git status` clean apart from the unrelated T4-P1 `docs/tranches/…/patches/`).

**Verdict: 52% converged.** The research lane is the strongest of the round — I re-derived
twelve of its numbers and every one held. The prototype is genuinely falsifiable and it
falsified things. But the family's center ("proportion alone can out-rank geometry") is
contradicted by the family's own measurements, the before-pane of its own harness is
contaminated with the after-state, and half the declared decisions (D4/D5/D6) are paper.

---

## 1 · Spot-checks against the real code

Twelve file→change claims checked; **twelve hold**, line numbers within ±3.

| claim | source | verdict |
|---|---|---|
| `.section-heading` = `--type-subheading` 1.272rem, `--type-heading` 1.618rem ≥768, Fraunces 800 caps | `typography.css:244-269` | ✓ exact, incl. the `text-align`/`padding-left` flip |
| the 17 rungs; `--type-title: 2.058rem`; caption `clamp(0.75rem,0.71rem+0.21vw,1rem)` | `typography.css:24-47` | ✓; 32.928/25.888 = **1.2719** = √φ, arithmetic signature confirmed |
| OptionSelector arms `text-[1rem] md:text-[1.375rem]` / `text-[1.375rem] md:py-0.5 md:text-[1.25rem]`; `font-family:"Fira Code", monospace` at `:67` | `OptionSelector.vue:35-37,66-68` | ✓ exact |
| `DiceIcon` props `{size?, playing?}`, `stroke-width="1.8"` on a 24-unit box, no `vector-effect` | `DiceIcon.vue:2,7-9,23,64` | ✓ — the charter's "pure prop/CSS change" is indeed false at 48–56px |
| `AssistSettings.vue` 91 LOC, two identical stanzas `:60-71`/`:75-89`, the load-bearing re-emit note `:17-21` | `AssistSettings.vue` | ✓ exact |
| `.deal-btn` at :757 / `.icon-btn` at :804, both single-class | `GameControlPanel.vue` | ✓ — and the cascade bug is real (§3) |
| `.controls-card` cap `min(42rem,85vw,100dvh−10rem)−2rem` → **640 @1440×900, 608 @1280×800** | `scene.css:38-46` | ✓ re-derived |
| `.mobile-board-width: min(42rem, 100vw−1.5rem)` = 366 @390 | `scene.css:120-122` | ✓ |
| `.game-card-name{height:1.9rem}`, `.card-wordmark{font-size:48px}` viewBox-doctrine comment, `.game-card-range{font-size:var(--type-body,1rem)}` | `GameCard.vue:385-421` | ✓; the off-token refusal is verbatim at `HandwrittenLogo/HandwrittenLogo.vue:386-394` |
| KeyboardLegend graphite 55% text / 40% kbd border | `KeyboardLegend.vue:55-59,93-99` | ✓ |
| R3 coarse floor is **`min-height` only**, `.ctrl-btn` included | `index.css:680-687` | ✓ — see G11 |
| goldens = 4 subjects × 2 platforms, none an F5 surface; **`.ctrl-btn` appears in exactly one e2e assertion** (`visual-regression.spec.ts:149-153`) | `e2e/` grep | ✓ |

**Contrast ledger re-derived from scratch** (WCAG 2.x, graphite `hsl(0 0% 15%)` composited over
`--color-card hsl(48 12% 99%)`): 85% → **9.192**, 75% → **6.554**, 68% → **5.233**,
muted-foreground → **4.646**, legend 55% → **3.531**, kbd 40% → **2.359**, foreground →
**19.407**. Every figure in D2 lands within 0.02 of mine. The dossier's method is sound and its
diagnosis — that `--color-muted-foreground` is a dead one-stop ramp and currently reads
*quieter* than the shipped "quiet" token — is correct. (Trivial internal drift: the dossier says
selected-option 19.41, the MANIFEST 19.45. 19.41 is right.)

**The diff applies clean.** `git apply --check -p1` against the real tree passes;
`git apply --stat` reports 6 files, **+126 / −58 = +68 raw**. `apply-slice.py` re-runs and
reproduces its own ledger (code-only +16). This is the most honest artifact discipline of the
round.

---

## 2 · Re-derived prototype numbers

Five re-derivations, run independently.

1. **The crushed die — CONFIRMED.** My own probe (exact source order, Tailwind-v4 preflight
   metrics, no mock code) renders the shipped desktop Deal die at **28 × 17.63** inside a
   44 × 44 button. The prototype recorded 28 × 17.6. At D1's 32px *without* the
   `.icon-btn.deal-btn` selector fix the die renders **32 × 0**. Both reproduced exactly.
   Finding 1 is real and it is a **shipped bug**, not a slice artifact.
2. **The cascade-layer mechanism — TRUE, but the prototype cannot show it.** In a probe with a
   real `@layer utilities { .text-\[1rem\]{font-size:1rem} }` against an unlayered
   `.assist-settings[data-v-abc] .ctrl-btn{font-size:var(--type-caption)}`, the scoped rule wins
   (14.384px vs 16px). D3's "OptionSelector's API gains nothing" is architecturally sound and
   the built CSS confirms Tailwind emits `@layer utilities`
   (`dist/assets/index-BvKNyweBdTtX.css`). **But `build-mock.mjs` emits zero `@layer` rules**
   (`grep -c "@layer" f5-slice-desktop.html` → 0), so in the mock the demotion wins on plain
   specificity. The mock could not have falsified the claim it exists to prove. See G-checklist
   row 3.
3. **The before-pane is contaminated — the finding that most damages the family.** Mock line
   149, `assist-settings :is(.ctrl-btn){font-size:var(--type-caption);padding-inline:.5rem}`,
   carries **no `.f5-after` prefix**, and `assistBefore()` emits `class="assist-settings …"`.
   Measured in the family's own desktop mock: BEFORE assist buttons render
   **242.4 × 29.6 @14.384px**; the shipped state is 20px (`md:text-[1.25rem]`). Mobile BEFORE:
   **12.179px**, shipped is 16px. It is visible in `shots/desktop-light-side-by-side.png` — in
   the BEFORE pane "Off / Ask / Live" are plainly smaller than "Normal / Corner / Center", which
   is precisely the uniformity the family says the before state has.
4. **Wrap threshold ≈ 370px.** Driving the family's own mobile mock at 320/360/368/372/375/390:
   at ≤368 the assist row wraps to two lines — assist zone **101px, not 53px**; panel
   542.7 vs 561.8 (**Δ −18.9px**, not −67.1). At ≥372 it does not. The one mobile width the
   lane rendered (390) sits ~20px above the cliff.
5. **Tap-target widths after D3** (coarse, sim-coarse mirror): "On" **30.6 × 44**,
   "Off" 37.9 × 44, "Live" 45.2 × 44. Height floors hold; widths do not.

**Font coverage — independently re-derived from `index.css:46-70` and it is exactly as the
prototype reports.** Fraunces' `unicode-range` admits three uppercase codepoints (U+0042 B,
U+0044 D, U+0053 S) and `.section-heading` is `text-transform: uppercase`, so NEW GAME falls
back wholly and SIZE/DIFFICULTY/MARKS/CANDIDATES fall back per-glyph. Fira Code's range has no
O, n, f, A, k, L, v, N, l, C, t → Off/On wholly, Ask→A k, Live→L v, Normal→N o l, Corner→C o n,
Center→C n t. Patrick Hand's uppercase is C, R, S only → **Deal, Fill, Undo, Hint each lose
their capital to `cursive`**. Visible at 32.93px in `shots/mobile-light-side-by-side.png`: the
"D" of "Deal" is unmistakably a different face from "eal".

---

## 3 · THE FAILURE-MODE CHECKLIST

**Vacuous convergence — PARTIAL FAIL.** The slice is a real falsification instrument and it
produced five findings the spec did not have. Against that: D4/D5/D6 are asserted as decisions
with no artifact that could have failed them; and **two of the five success-test rows fail as
measured** — desktop content ≤780px → **792**, mobile card ≤510px → **518.8** — with no failure
verdict recorded anywhere in the MANIFEST or spec.

**Spec-cites-itself circularity — LARGELY CLEAN, one exception.** Twelve independent
source checks held; the numbers trace to file:line, not to each other. The exception is the
MANIFEST's fidelity keystone: "the 934.5px before-figure independently reproduces the app's own
recorded 936px". That 936 was recorded at a different viewport (`scene.css:27-31`, "against an
800px viewport"), and the 934.5 is measured on a **contaminated** before-pane whose assist rows
are already wearing the after typography (a corrected before is ≈976px). The agreement is a
coincidence dressed as corroboration.

**Gates that cannot fail — TWO.** (a) The cascade-layer gate: the mock has no layers, so the
one mechanism that lets D3 avoid touching OptionSelector's API is untested by the artifact built
to test it. (b) The height-Δ gate: before and after panes share the demotion rule, so the assist
zone Δ (226.0 → 50.6) is measured from a partly-post-F5 baseline. A third, softer: the parsimony
gate "net LOC ≤ +20" was answered by re-defining the metric ("measures prose, not code") after
`git apply --stat` returned **+68**.

**The elegant-reduction trap — YES, structurally.** The family is a token-ladder family, and it
leaves the middle rung a literal: 14–15 `.ctrl-btn` per panel keep `text-[1.375rem]` /
`md:text-[1.25rem]` arbitrary Tailwind values *by explicit decision* ("OptionSelector's API gains
nothing — cheaper than both the charter's variant and the dossier's counter-proposal"). The
shipped ladder is therefore token · token · **20px literal** · token, and 25.89/20 = 1.294 is
not a √φ step. Separately, "and then the hard part": the Deal chimera is diagnosed, priced twice,
and left undecided ("the alternative is re-subsetting three woff2s from upstream sources that
aren't in the tree"); D4 and D5 "land only after the slice survives", and the slice's own kill
criterion 1 came back *split*.

**Legacy aliases — MINOR.** No genuine old/new name duplication; `heading-value`'s 68% literal
is properly retired into `--ink-press-light`, byte-identical. Two smells: `--ink-press-full`
ships with zero consumers, and `AssistSettings`' `mobile` prop survives with its meaning
silently changed from "regime" to "gap-x tuning" while `mobile` is now hard-passed `true` to
both child selectors — the prop name now lies about what it does.

**Masked fallbacks — YES, and the family found the biggest one itself.** (i) The subset
`unicode-range` gates mean the app *silently* renders per-glyph Fraunces/Georgia and
PatrickHand/`cursive` chimeras on every heading, every option label and four sublabels; nothing
errors, the wrong face just paints. F5 discovered it and then ships D1 anyway, magnifying it
2.29× on the one word it promotes. (ii) The `.icon-btn`/`.deal-btn` cascade silently rendered a
crushed 28×17.6 die for the whole life of the T4 panel, and D1 unfixed silently renders a 0px
die — a layout failure with no failure signal.

**Unverified gestalt — PARTIALLY CURED, three holes.** 30 screenshots, both themes, both
regimes, a live measurement ledger and seven priced variant toggles: this is more looking than
any lane should be criticised for. The holes: (1) **zero WebKit runs** — `measure.mjs` imports
`chromium` only, against a binding "Safari/iOS first-class" constraint and a live T4-P1 Safari
perf campaign; per-glyph fallback metrics, `color-mix` output and baseline-aligned wrapped flex
all differ on WebKit and all three are load-bearing here. (2) the mobile composite PNG
**occludes the BEFORE pane's CHECK/CANDIDATES zone behind the harness toolbar** — the exact
region the family reclaims is not visible in the before evidence. (3) exactly two widths were
rendered (390, 1440), and 390 sits ~20px above the wrap cliff.

**Consumer-less substrate — YES, small and exact.** `--ink-press-full` has zero consumers in the
slice (it exists only for a mock toggle). `--rhythm-1/-2/-3` are specified with zero consumers
and never built. The dossier's own sharpest indictment of the estate (Q2a: 21 registers, zero
consumers; `--type-title` unused) is reproduced by the family that wrote it.

---

## 4 · Refusals — did the family honor its own?

Charter refuses: *"moving any control anywhere; new components or objects; new motion;
layout-regime changes"*, and promises *"near-zero component surgery"*.

- **Moving controls: BREACHED.** D3 relocates Check and Candidates from two stacked column
  stanzas into a single inline row, and forces `mobile` (the row layout) on the desktop mount.
- **New objects: BREACHED.** D3 introduces an `<hr class="border-border/50 my-2 w-full">` that
  does not exist today.
- **Near-zero component surgery: BREACHED.** `AssistSettings.vue`'s template is replaced wholesale
  (+52 / −37 on a 91-line file) and a scoped `<style>` block is added where none existed.
- **Copy change, unclaimed:** the visible label "Candidates" becomes "Cands" — an abbreviation
  outside a proportion family's remit, and one whose Fraunces coverage is worse per character.
- New motion: honored. Breakpoint/regime changes: honored.

The deeper problem is not the breach but what it reveals: **F5's measured win comes
overwhelmingly from the channel its center refuses.** On mobile the type rung buys 0px (coarse
`min-height` floors, as the dossier itself states at C10) and the entire 67.1px is structural. On
desktop the rung contributes ~42px of the 142.5px. Proportion is the minority contributor to the
family's own numbers, and kill criterion 1 came back *split* with the panel's loudest ink still
the selected option (19.41:1) at 2.1× Deal's 9.27:1. Looking at
`shots/desktop-light-side-by-side.png`, Deal is bigger in point size and still not the loudest
thing in the panel; the Fraunces-800 uppercase slabs remain the authorities.

---

## 5 · Shared binding constraints

| constraint | verdict |
|---|---|
| pencil-notebook soul, estate vocabulary only | **Held** — `.eyebrow-caption` is `.section-heading`'s own grammar one rung down; the graphite mix is the shipped `heading-value` idiom hoisted. No imported vocabulary. |
| extreme parsimony / net-LOC | **Missed as gated.** Raw **+68** against a ≤+20 gate; the gate was re-defined post-measurement. 0 new components, 0 new props, OptionSelector API unchanged, `pencilConfig.ts` untouched — those sub-claims all verify. |
| no new live-filter surfaces | **Held in the letter, broken in the spirit.** No new filter def, no new preset, 32px stays inside the documented 20–32px `grain-static` HOLD band. But `.icon-btn` carries `filter: url(#grain-static)` and the Deal button's box goes 44×44 (1,936 px²) → 92.6×76.9 (**7,125 px²**, ×3.68), with the 500ms `dice-roll` transform running *inside* the filtered element, so the enlarged raster re-evaluates per frame. Unpriced. |
| Safari/iOS first-class | **Failed as evidence.** Chromium-only harness; no WebKit run of any kind. |
| a11y contracts | **Mostly held, one erosion.** `errorCheckMode` stays prop+emit; the re-tap re-arm survives; both selectors keep real `.ctrl-btn` buttons; `aria-label`s kept verbatim; the coarse `min-height: 2.75rem` floor holds (measured 44px). Eroded: target *width* falls from ~43px to **30.6px** ("On"). The estate's R3 floor is height-only so nothing reds, but F5 narrows a touch target on the surface the owner marked. |
| one live board / TS / eslint boundary | Untouched. `heading-ink` and `eyebrow-caption` live in `src/assets/typography.css`, outside both `pencil/**` and `games/**` — boundary clean. |
| goldens | **0 at risk**, verified: 4 subjects × 2 platforms, none an F5 surface. |
| e2e | `.icon-sublabel` class kept; text assertions green; the single `.ctrl-btn ≥19` assertion untouched (first-in-DOM is the mobile Size selector at 22px, and the mobile card is `lg:hidden` — in the DOM, so `getComputedStyle` still reads it). One doc drift: `mobile-affordances.spec.ts:355` says the armed sublabel shows "sure?" *in rose*; D2 makes it `--color-red-ink`. |

---

## 6 · Against the owner's marks

| mark | F5's claim | actual |
|---|---|---|
| **Deal weight** | cured by rank-1 type + pressure | **Partial.** 14.38 → 32.93px, 4.66 → 9.27:1, and the crushed-die bug found and fixed. But the family's own kill criterion returned *split*, the mass channel loses to Fraunces-800, and the promoted word renders as a two-face chimera. |
| **Drawer grammar** | conceded | **Zero.** Honestly declared. |
| **CHECK integration** | cured by demotion | **Half.** The one-line strip genuinely reads as a preference footnote and is the largest single reclamation in the panel — a real win. But "contrived, not naturally integrated" is a *belonging* complaint; F5 answers it by making the intruder quieter, not by integrating it, and the new hairline sits above the strip so the assists now group with the icon row below. |
| **Mobile geography** | "the tall card gets shorter through demotion" | **Weak, and width-fragile.** 585.9 → 518.8 at 390px (−11%); at 360/320 it is 561.8 → 542.7 (**−3.4%**). No thumb geography, no reachability, no regime change — refused by charter. |
| **Picker hierarchy** | one line, ratio 1.31 → 1.48 | **Unbuilt.** Spec-only, never rendered. And its own arithmetic decays: `--type-small` keeps climbing to 20px, so the ratio falls back to 24.3/20 = **1.215**, below √φ, on very wide viewports — the structural fault (fixed SVG height vs fluid caption rung) is improved, not fixed. |

---

## 7 · Strengths worth cross-pollinating

1. **The font-subset chimera** — the single most valuable discovery of the round, and estate-wide.
   Independently re-derivable from `index.css:46-70`; it bears directly on the owner's own
   "low-res / font loss" hypothesis for mark 4. Every family should inherit it as a shared
   finding, and whichever family owns the cure should own the woff2 re-subset.
2. **The `.icon-btn` / `.deal-btn` cascade bug** — the shipped desktop die renders 28×17.63, and
   *any* family that enlarges it renders 0px tall without the `.icon-btn.deal-btn` fix. Verified
   independently. This is a hard constraint on every family that touches Deal.
3. **The graphite pressure ladder** — 4 AA-clean rungs both themes, re-derived to ±0.02, plus the
   correct structural point that `--color-muted-foreground` cannot ramp, plus three real sub-AA
   sites closed (legend 3.53, kbd border 2.36, armed rose 4.10). This is portable to every family
   and is F5's most durable asset; it should be lifted out of F5 and made a shared token move
   regardless of which family wins.
4. **The empty blast-radius map** — 0 goldens at risk, exactly one `.ctrl-btn` e2e assertion,
   0 e2e/unit refs to the Check/Candidates/Marks headings. Verified by grep. Every family can
   move fast in this region and should be told so.
5. **The one-line assist strip as a rendered form** — it reads. Whichever family owns relocation
   should adopt the *shape* (inline eyebrow + inline selector, hairline-bounded), with the mock's
   own `assist-stack` variant on wide rails and a wrap-safe form below 370px.
6. **The harness pattern** — `apply-slice.py` (exact-string patches, a miss is a hard error) +
   a `git apply`-clean diff + before/after panes + priced variant toggles + a live in-page ledger
   is the most falsifiable prototype discipline of the round. Other lanes should copy it — with
   the before-pane contamination fixed and one WebKit run added.

---

## 8 · Open gaps, by severity

**BLOCKING**

- **G1 · The prototype's BEFORE pane is contaminated with the AFTER demotion.** `build-mock.mjs`
  line 296 / generated line 149 lacks the `.f5-after` prefix. Every Δ in the two measured tables
  is taken against a partly-post-F5 baseline; the headline fidelity claim rests on it.
- **G2 · The desktop rail grows 282.4 → 410.8px (+45%) and no fix is adopted.** This is the exact
  failure class `scene.css:27-40` records (a rail that outgrows the sheet pushes the centered
  `.app-layout`, masthead negative, wordmark off-screen). The prototype found it and priced the
  cure (`assist-stack`: 278px wide, +36px height); the spec adopts neither form. Unmeasured at
  1024px, the drawer regime's own floor.

**MAJOR**

- **G3 · The mobile win evaporates ≤370px** — measured 101px assist zone vs 53px, panel Δ −18.9
  not −67.1, at 360 and 320. One mobile width was rendered and it sits above the cliff.
- **G4 · Deal's rank-1 label ships as a per-glyph chimera** ("D" `cursive` + "eal" Patrick Hand at
  32.93px), magnified 2.29×; two cures priced, neither chosen.
- **G5 · The `#grain-static` filtered area on Deal grows ×3.68 with a per-frame transform inside
  it, verified on Chromium only**, against the Safari-first constraint and a live perf campaign.
- **G6 · The pressure inversion is relocated, not cured** — the rank-3 eyebrow (5.23) still
  out-shouts the rank-3 control it labels (unselected `.ctrl-btn`, 4.65), and `.icon-sublabel`
  (4.65) sits under the rank-4 ambient `heading-value` (5.23). "Pressure monotone" holds only over
  the new rungs.
- **G7 · Four charter refusals breached by D3** (moves controls, adds an `<hr>`, rewrites a whole
  component template, renames a visible label) while the charter's centre is "nothing moves,
  nothing is added".
- **G8 · The family's own numbers falsify its center** — proportion buys 0px on mobile and ~42 of
  142.5px on desktop; kill criterion 1 returned *split*.
- **G9 · The middle rung stays off-token by decision** — the ladder has a literal in it.
- **G10 · Two success-test rows fail as measured (792 > 780, 518.8 > 510) and the parsimony gate
  was re-defined after measuring +68.** No failure verdict recorded.

**MINOR**

- **G11 · Coarse tap-target width falls ~43 → 30.6px** ("On"); nothing reds (R3 is height-only) but
  it narrows a touch target on the marked surface.
- **G12 · `--ink-press-full` and `--rhythm-1/-2/-3` ship or are specified with zero consumers** —
  the exact defect the dossier indicts the estate for.
- **G13 · MANIFEST "Artificial: exactly one selector" is wrong** — six `.f5-after`-prefixed rules
  exist (mock lines 283, 291–295), all keying off markup present in both panes.
- **G14 · D5's ratio decays to 1.215 (below √φ) at wide viewports**, unbuilt and unrendered.
- **G15 · The mobile before/after composite occludes the before pane's reclaimed zone.**
- **G16 · Doc drift** — `mobile-affordances.spec.ts:355`'s "in rose" comment goes stale under D2;
  MANIFEST 19.45 vs dossier 19.41 for the selected-option contrast.

---

## 9 · What would move F5 past 80%

Adopt the `assist-stack` form on the wide arm and a wrap-safe form below 372px (kills G2 + G3);
pick a Deal-label cure and ship it (G4); de-contaminate the before pane and re-measure every Δ
(G1); extend the ink ladder to `.icon-sublabel` and the unselected `.ctrl-btn` so the monotone
claim is panel-wide (G6); tokenize the `.ctrl-btn` rung or drop the ladder claim (G9); run the
harness once on WebKit (G5); build D4/D5 or strike them from the family's mark coverage.
