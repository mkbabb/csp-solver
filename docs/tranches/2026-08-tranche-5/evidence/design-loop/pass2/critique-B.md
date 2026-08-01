# CRITIQUE — LANE B (F1 rebuilt), pass 2 · adversarial, non-author

Read: `pass1-registry.md` §1 F1 work order (items 1–5, the bar) · `pass2/laneB-report.md` ·
the worktree `.claude/worktrees/wf_6e1b18f4-0f2-2` (real diffs, real files, not the banked one) ·
`pass2/laneB-rig/*.json` + `laneB-shots/` · `pass2/laneB-MEASURE-REQUESTS.md` vs
`pass2/measure/RESULTS.md` §2 and §4. Read-only throughout; nothing in the worktree was touched.

**Verdict: 62% of the lane's OWN work order closed with evidence.** Items 1 and 2 are the strongest
artifact in the loop. Items 3, 4 and 5 each carry a claim the lane's own instruments — or the
MEASURE stage's device — refute, and in every one of those three the report states the refuted
claim as settled.

---

## 0 · What survives audit (say it first, because most of it does)

Independently re-run or re-derived by me, not taken from the dossier:

- `npx vue-tsc -b` in the worktree **exits 0**. The in-tree mount is real; `dist` (05:41:01) is
  newer than every source file (last 05:41:00). No mock stands behind the ticket itself.
- **Mark-4 literal grep gate is genuinely clean on the real diff.** `git diff | grep '^+' |
  grep 'filter:'` → **zero**; the removed side returns exactly `- filter: url(#wobble-heart);`.
  Both halves reproduce.
- **The cascade diagnosis is correct and checkable.** `.icon-btn { width: 2.75rem }` (line 774 region)
  precedes `.deal-btn` at equal specificity, so `width: auto` never applied — the shipped Deal
  really was a 44×44 box its contents overflowed. `.icon-btn.deal-btn` is the right fix and it
  independently confirms F5's `28×17.63`.
- **The strip gate discriminates.** `negctl2-chromium.json`: `stripLeft` −42.7 @1024 → +48.8 @1280,
  `fitsX` false→true. The closed-form bound (`cardW ≤ 248` at 1024) is arithmetic anyone can check
  against `gutter = (V − 608 − 56 − cardW)/2`. The deletion ruling is earned.
- **Blast radius was walked, not assumed.** `a11y-chromium.json` `nth4: "Share board link"` proves
  `share-truth.spec.ts:57` survives; `.mobile-control-panel` kept verbatim to spare four spec edits;
  `useAssists.ts` untouched → `useAssists.test.ts` correctly priced at 0 rows; the golden
  re-baseline is **named as owed**, not hidden.
- **e2e 77/77 is the honest full count.** 82 `test(` across `e2e/*.spec.ts`; `playwright.config.ts:11`
  ignores `visual-golden` (4) and `throttled-void` (1). 82 − 5 = 77. Verified.
- **Scoped-CSS honesty holds in fact.** The one `:deep()` rule (`.well :deep(.washi-label)`) is
  live: `fade3-chromium.json` reads the washi at **effective opacity 1.0000 at 1440 fine-pointer,
  no hover**, where `SheetWashiLabel`'s own `.washi-label { opacity: 0 }` would otherwise hold and
  `.washi-persistent` is `@media (pointer: coarse)`-fenced. Pass 1's dead-`::v-slotted` offense is
  **not** recommitted. (The lane never makes this argument — see §5.C.)
- **Three instrument failures disclosed**, and the third is sound; the fade negative control
  (`.drawer-tab`) genuinely holds at 1.0000 in every frame the well drops.
- **The load-bearing re-emit survives**: `reemit: "Ask"`, `armNotLive {before:61, after:61}`.
- The chimera finding is first-party (`upper: []`) and was independently reproduced on real glass
  by MEASURE G5 (`BASE-negctl-headings-light.png`).
- I looked at the pixels. `final-chromium-sudoku-1024.png` and the device dark shot are a real
  ticket: two drawn wells, five docket lines, Deal dominant. The design center is not vapour.

---

## 1 · Item 1 — the one-hour decider · **~90% CLOSED**

Closed. Real constants, per-game re-derivation (269.09 identical for sudoku/futoshiki/kenken,
because the shipped desktop `OptionSelector` was a vertical *column* and no option row ever set the
card's width — a genuine correction of both the pass-1 proto and the pass-1 critique), NC-1 at four
viewports × two rosters, a screenshot, a closed-form bound, and a ruling that ships zero lines.

**One overclaim.** §1 says NC-1 is "built … out of the app's own `.icon-btn` geometry". It is not:
`negctl2.mjs` `build()` injects hand-rolled `<button class="ncbtn">` with inline
`padding:.3rem .5rem`, while the app's coarse `.icon-btn` is `padding: 0.3rem 0.5rem` on a
`min-width/min-height: 2.75rem` box **carrying `filter: url(#grain-static)`**. It borrows the app's
tokens, not the app's component. Immaterial to a deletion ruling; material in §3 below, where the
same replica is used to *refute* pass 1.

---

## 2 · Item 2 — build the ticket, Deal dominant by measured ink · **~75% CLOSED**

Built, shipping, rendered on both engines, ink measured with a real instrument and a control that
fails loudly on real input (0.07× on the shipped card). This is the best single artifact of the pass.

**2a · The headline ink table is spliced from two runs.** `Deal 766.6` is `ink-final-chromium.json`
(05:42); `Easy 502.5`, `9×9 387.7`, `Ask 238.3`, `Off 222.2`, `Normal 488.9` are all
`ink-f1-chromium.json` (05:22). The final run reads `Easy 499.2 · 9×9 382.7 · Ask 236.4 · Off 220`.
The verdict is unchanged (1.52× → 1.54×), so this is hygiene, not error — but redirect order 4
("a stale spec is a red gate") is the pass-1 rule, and the lane's own dominance table breaks it.

**2b · The pressure ladder has four voices, not three, and the fourth is unranked.** §2 declares
three grafted rungs (Deal / selected option / 68% graphite label) "verified monotone". The washi tag
is a fourth voice and it is **in the same JSON**, silently omitted from the table:
`washi:new game` **380.0**, `washi:teacher's` **365.6**. That places the compartment *name* above
every selected option in the teacher's well (`Ask` 236.4, `Off` 220) and just under `9×9` 382.7 —
i.e. the well's label out-inks the control it captions in three of five rows. F5's G6 lesson, quoted
verbatim in the registry, is "monotonicity asserted over ALL rungs, old and new, or the inversion
just relocates". The lane asserted it over the three rungs it chose to print.

**2c · The compartment names fail in dark, on glass, and Lane B's own build shows it.** The wells'
*only* name is a `SheetWashiLabel`. MEASURE M5 (Lane C) found the tape "reads as a highlighter
strike across the word, not as tape under it" in dark on the device — and it reproduces in Lane B's
own device frame `measure/laneB/B-M5-sudoku3-dark.png`: `teacher's` and `hold to peek` both read
struck-through, the apostrophe lost. Lane B deleted six eyebrows and moved 100% of the compartment
naming load onto a primitive that is confirmed illegible in one of two themes. Lane C routed the
cure to Lane D estate-wide; that is fine as ownership, but it leaves **Lane B's mark-1 hierarchy
claim unproven in dark** while the dossier's §0 states it flatly.

**2d · "No legacy aliases" is false — the donor register is orphaned.** §2 closes "No legacy aliases,
no gated branches." After this diff, `grep -rn section-heading src e2e` returns **zero template or
component uses** — yet `src/assets/typography.css:245-269` still carries the whole
`.section-heading` @layer-components rung (base + `@media (min-width: 768px)`), and
`src/assets/index.css:681` still lists `.mobile-heading-btn` in the coarse 44px-floor selector list
for a class the diff deleted every instance of. `src/games/sudoku/ControlPanel/ControlPanel.vue:37`
still cites "the shell's AssistSettings". Three orphans the exhaustive-label-grep method (F2's graft
to this very lane, per the cross-pollination register) exists to catch, none priced in the ledger.

---

## 3 · Item 3 — kill the filter-under-scale hazard · **~55% CLOSED**

The letter is met: the strip is deleted, so nothing rides the 520ms translate+scale mover, and the
rule is recorded for revival against the house precedent. Fine.

The **accounting around it is the weakest thing in the dossier**, and it is a mark-4 matter.

**3a · The mark-4 grep gate cannot see filter acquisition by class, and Lane B's own diff takes that
path.** The gate is `grep '^+' diff | grep 'filter:' = 0`. The diff adds
`+ <div class="control-panel-filtered well-rows">` (GameControlPanel.vue:382). `.control-panel-filtered`
is defined at line 594 as `filter: v-bind(panelFilter)` — the three-pass stroke filter, the exact
painter Lane C's M1 names as half the ~280ms WebKit drawer stall. Net element count is unchanged
(HEAD had two `.control-panel-filtered` divs, one per branch of the mobile/desktop fork; the merged
template has one, mounted the same number of times), so **this is not a regression** — but the
report's stated negative control ("the same grep on the removed side returns
`- filter: url(#wobble-heart);`, so the gate can see them") proves only that grep matches a literal.
It does not show the gate can fail on the mechanism the lane actually used. A gate whose control
cannot exercise its own blind spot is the checklist's *gate that cannot fail*.

**3b · "Net −1 live filter reference" is true and near-meaningless; the live-filtered *area* grew.**
The removed reference is `.section-heading:hover { filter: url(#wobble-heart) }` — a hover-only,
frozen-pose filter on a selector the same diff makes dead. Meanwhile `.icon-btn` keeps
`filter: url(#grain-static)` (GameControlPanel.vue:774, unchanged), and Lane B **grows Deal's box
from 44×44 to 128.1×44** (device: 115.9×44). That is ~2.6× the rasterized area of a live SVG filter
on the card's primary control. The metric the lane chose (references) moves −1; the metric mark 4
is about (filtered raster) moves sharply up. Neither the report nor the gate registers it.

**3c · "The wells enrol NO beat and add NO painter" — the device disagrees, and the report predicted
otherwise in its own MEASURE-REQUEST.** G7 asked for "no regression" on the stated ground that
`:pose="0"` adds no painter. `RESULTS.md` §2 G7: idle **56.98 / 57.48 / 57.10** vs base
**59.21 / 58.61 / 58.12**, and idle frames >33ms **8 / 9 / 7** vs base **4 / 4 / 3** — roughly
double. "Lane B is the only lane whose idle long-frame count moves against base, and the
expectation was *no regression*." The `:pose="0"` half of the claim is **verified true** in the
source (`HandDrawnOutline.vue`: `props.pose === undefined ? useBeatFrame(...) : null` — a posed
outline enrols nothing). The "no painter" half is not: each outline still emits `BOIL_CONFIG.frameCount = 4`
sibling `<g class="boil-pose">`, every one carrying `will-change: opacity`, i.e. **+8 permanently
promoted compositor layers plus 2 ResizeObservers in the visible card**, inside a
`will-change: transform` filtered panel. That is a named, plausible mechanism the lane never
considered, and on a T4-P1 Safari-performance campaign an unexplained doubling of idle long frames
is not a footnote.

**3d · G6 (drawer glide, no distortion) was NOT RUN for Lane B.** `RESULTS.md`: "lane B's own glide
poses are not captured." The lane's own request called *any* distortion a finding. Mark 2's motion
coverage for this build is therefore unmeasured, on the exact regime (≥lg, coarse, WebKit) where the
280ms stall lives.

---

## 4 · Item 4 — mobile ruling, occlusion in TWO dimensions · **~65% CLOSED**

Ruled, both dimensions instrumented, keypad negative control fired correctly on device. Real work.

**4a · "No mock exists in this lane" is false for the load-bearing mobile numbers.** The dossier's
header says it; §3's refutation of pass 1 says "Both pass-1 mobile facts are refuted by the shipped
app." They are not — they are refuted by `negctl2.mjs`'s **injected replica tray**, the same
hand-rolled `.ncbtn` as §1. Pass 1's 409px came from a mock's button metrics; Lane B's 346px comes
from Lane B's mock's button metrics. The correct claim is "pass 1's mock is refuted by a better
mock, built inside the real page with the real tokens" — which is a genuine improvement and should
have been written that way. As shipped, it reads as a shipped-app measurement and is not one.

**4b · "Occlusion is 0 in both dimensions *by construction*" is refuted on device.** `RESULTS.md`
G4: with the keypad up, at maximum scroll (`scrollY` 352 of 1433), **Deal's bottom is 411.9 against
a band top of 403 → clearance −8.9px**; ~20% of the 44px commit verb sits under the keypad with no
further scroll available. Lane B's own stated expected answer was "reachable by scroll, nothing
permanently occluded", and it **failed**. In-flow removed *layout* occlusion; it did not remove
keypad occlusion of the primary verb, which is the dimension the work order actually named.

**4c · The headless keypad band was assumed, not measured, and the assumption was the disputed
number.** `negctl2.mjs` hardcodes `const KEYPAD = 336` and `inKeypadBand: E.b > innerHeight - 336` —
i.e. §3's D2 table ("inside the simulated 336px keypad band") is computed against the very figure
§3's own prose faults pass 1 for assuming. Device: **296px**. The conclusion (100% occluded) survives
on device, so this costs the ruling nothing; it costs the lane's "measured, not asserted" posture.

**4d · Mark 3 conceded.** −4.8% of stack, honestly stated, F3 re-entry trigger (b) left live. Credit
for not claiming a cure. But note what the device *did* find and the dossier could not: the
393×699 numbers (1.711 → 1.632) confirm direction and magnitude within 0.007 of prediction. The
prediction instrument is good; the ruling it supports is thin.

---

## 5 · Item 5 — rig honesty, a11y to contract, LOC re-priced · **~55% CLOSED**

**5a · "DOM order = visual order" is asserted against a probe that returns the opposite.**
`a11y-chromium.json` contains exactly one field on this: **`"domEqVisual": false`**. There is no
per-element order dump anywhere in `laneB-rig/`. The report (§4) states: "DOM order = visual order
at ≥lg for every rendered control (probe dump in §rig). The only DOM-after-visual rows are the
`.play-controls` buttons, which are `display: none` on a fine pointer — not an order break." That
exception exists nowhere in the artifact and cannot be checked from it. This is the checklist's
*spec-cites-itself*: the citation points at a file whose only relevant value is `false`.
(Aggravating, minor: the probe ran 05:38, the final `dist` was built 05:41. I diffed the banked
`laneB.diff` against the live tree — the post-05:37 delta is comment prose plus one prettier
line-wrap, so nothing rendering changed. The staleness is benign; the uncited claim is not.)

**5b · The LOC ledger was NOT re-derived on the shipped diff.** §5 prints
`GameControlPanel 286/373`, src `303/520`, TOTAL `333/535 = −202`. Those are the numbers of
`laneB-rig/laneB.diff` (banked 05:37; I re-derived them from it: 286/373). The worktree at the time
of the report and now is:

| file | + | − |
|---|---:|---:|
| `GameControlPanel.vue` | **303** | **380** |
| `AssistSettings.vue` | 0 | 91 |
| `PencilModeToggle.vue` | 0 | 47 |
| `OptionSelector.vue` | 13 | 8 |
| `GameScene.vue` | 4 | 1 |
| `mobile-affordances.spec.ts` | 8 | 5 |
| `visual-regression.spec.ts` | 22 | 10 |
| **TOTAL** | **350** | **542** |

**Net −192, not −202.** The lane's parsimony headline overstates its own deletion currency by 10
lines (5%). The work order's item 5 is literally "LOC ledger re-priced"; it was priced once and not
re-priced after the last edit. Everything else in §5 (the e2e rows, the `useAssists.test.ts` zero,
the golden row named as owed) is correct — which makes the one stale table more conspicuous, not
less.

**5c · Scoped-CSS honesty is proven, but not by the lane.** §4 argues the point structurally ("Lane B
adds nothing to those selector lists") and never addresses the one `:deep()` it shipped. The proof
exists — `fade3-chromium.json` washi = 1.0000 at fine pointer — and it is incidental. The work order
asked for `::v-slotted`/`:deep` *proven rendered*; the lane proved it by accident and argued it by
assertion.

**5d · A gate was LOOSENED in the same change that shrank the thing it guards.**
`visual-regression.spec.ts`: `ctrlBtnFontSize >= 19` → `>= 17`. In the same diff,
`OptionSelector.vue` goes `px-3` → `px-1.5` (12px → 6px per side) and `.options-row` gap
`0.25rem` → `0.1rem` (4px → 1.6px). MEASURE G2, on glass:

- `.ctrl-btn` neighbour gap **1.6px in every row of every regime**, against Lane B's **own ≥6px
  threshold** — ✗ FAIL. "This is the row lane B named as most likely to fail a real thumb, and it does."
- narrowest chip `On` **31.3 × 44**, against base **43.3** wide.

The suite asserts height ≥28 and font ≥17 and **nothing about separation**. The one assertion that
would have flagged the shrink was the one relaxed. Argued in-file, disclosed in the report as "two
e2e assertion edits are genuine design costs" — but the cost it names is Deal's selector rename, not
the target-size floor. That is the *masked fallback* pattern, and the device caught what the suite
now cannot.

**5e · A11y: two undisclosed costs.**
- Every `h2` in the panel is now `aria-hidden="true"` (`a11y-chromium.json` `headings[].hidden: "true"`
  ×5). The card previously exposed five/six `h2.section-heading` with `aria-label`s. Heading-level
  navigation inside the controls is now **empty**. The naming is correct (groups carry it) and
  label-in-name holds — but "no label doubles a group name to AT" is presented as pure gain, and
  losing every heading landmark is a cost that is not named. Related: keeping `<h2>` markup for an
  element that is no longer a heading to anyone is itself a legacy alias; it should be a `<span>`.
- `SheetWashiLabel` carries `role="tooltip"`. Lane B turned it into a *permanent compartment name*
  (persistent, `opacity: 1` forced via `:deep`). A tooltip that never hides and describes nothing
  is a wrong role on the element the design leans hardest on. The lane's own comment shows it knew
  ("a tooltip-role chip is not an id target") and routed around the symptom rather than the role.
- `aria-orientation` deliberately absent: **correct**, and I checked — it is not in `role="group"`'s
  supported states, and the `role="toolbar"` that needed it was deleted. Item 5's clause is
  legitimately discharged.

---

## 6 · Failure-mode checklist — where Lane B lands

| mode | verdict |
|---|---|
| **vacuous convergence** | **HIT, partial.** Two "by construction" closures. Item 3's is legitimate (no strip → no hazard). Item 4's — "occlusion is 0 in both dimensions by construction" — is **refuted on glass** (−8.9px, G4). The Deal-dominance gate also cannot fail on any plausible variant of the new build; its control only fails on the old one. |
| **spec-cites-itself** | **HIT.** §4's "DOM order = visual order … (probe dump in §rig)" cites an artifact whose only field on the matter is `domEqVisual: false`, with no dump. |
| **gates that cannot fail** | **HIT.** Mark-4 grep is literal-only; the lane acquired a live filter by class reference and tripled a `grain-static`-filtered box, both invisible to it. Its negative control exercises grep, not the mechanism. |
| **elegant-reduction** | **HIT, mild.** The reduction is real and earned (two components absorbed into one `v-for` over a shape the games already supply). But the currency is misquoted (−202 vs −192) and three donor orphans are left standing. |
| **legacy aliases** | **HIT.** `.section-heading` rung in `typography.css:245-269` with zero consumers; `.mobile-heading-btn` in `index.css:681` with zero instances; stale `AssistSettings` comment in `sudoku/ControlPanel.vue:37`. §2 claims "No legacy aliases." |
| **masked fallbacks** | **HIT.** `ctrl-btn` font-size floor 19 → 17 loosened in the same diff that cut the chip padding and gap; no separation assertion added; device then failed the lane's own 6px threshold at 1.6px. |
| **unverified gestalt** | **HIT, partial.** Both engines, both themes, real device frames — genuinely good. But the two things the pixels show and the dossier never reads: the washi names read **struck-through in dark** on glass, and every option row still paints the Fira Code fallback chimera the lane itself documents in §6.2, so each docket line renders in two typefaces at war. Neither is adjudicated. |
| **consumer-less substrate** | **MISS (clean).** `assistSections` feeds the same `v-for` that draws the ticket; `OptionSelector`'s `mobile` prop dies with its only consumer; no orphan primitive is introduced. |

**Pass-1's named offenses:** the fabricated `25×25` constant is **not** recommitted (real constants,
measured). The dead `::v-slotted` fades are **not** recommitted (the one `:deep` is live). The
missing test/e2e ledger rows **are** enumerated. Redirect order 4 ("a stale spec is a red gate") is
recommitted in miniature, twice: the ink table and the LOC ledger both cite pre-final runs.

---

## 7 · The three things that decide whether this lane advances

1. **The idle long-frame doubling (G7).** On a T4-P1 Safari-performance campaign, the only lane that
   moved against base on paint cost is the one claiming "adds no painter". Explain it or cure it —
   the `frameCount × will-change: opacity` layer promotion from two extra `HandDrawnOutline` mounts,
   and the 2.6× growth of the `grain-static`-filtered Deal box, are the two named suspects.
2. **The 1.6px option gap (G2).** The lane's own thumb threshold, failed on glass, in the row the
   lane predicted would fail, with the guarding assertion relaxed in the same diff. This is a
   shipped coarse-target regression against a shipped 43.3px chip, not a design preference.
3. **The washi in dark (M5) + the option chimera (§6.2).** The ticket's two compartment names and
   every one of its five option rows currently render wrong in one theme or one face. The grammar
   is right; the ink is not yet.

Fix 1 and 2 and re-price the ledger, and items 3–5 close. Item 1 and the ticket itself already stand.
