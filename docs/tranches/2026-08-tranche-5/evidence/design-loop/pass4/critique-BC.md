# NON-AUTHOR CRITIQUE — pass-4 stage BC (Lanes B + C) · 2026-08-01

Bar: pass3-registry §2's numbered work orders for Lane B (7 rows) and Lane C (5 rows). Verified
against the ACTUAL diffs at `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`
(`daca28ee..347826be`, four commits), the banked logs under `pass4/logs/BC/` (39 files on disk),
and MEASURE's `pass4/measure/RESULTS.md`. Two a11y hypotheses were tested on a live AX tree
rather than asserted (§4). Read-only: nothing in the repo was modified; probe scripts live in
`scratchpad/audit-BC/`.

**Verdict: ADVANCE. 12/12 numbered rows closed with banked evidence or struck in the open. Zero
blocking gaps. 3 major, 6 minor. Convergence 88%.** This is the first lane in the loop to close
every row it was given, and the first whose headline number a non-author reproduced independently
(MEASURE §0/§2: 1067.86 / 1067.83, −30.39 against the 1098.25 seal). The pass-3 offenses it was
charged with — unbanked gates (B2/C4) and a stale table (C1/C2) — are genuinely gone.

---

## 1 · THE NUMBERED ROWS, ONE BY ONE

### Lane B

| row | verdict | the evidence that closes it |
|---|---|---|
| **B-1** the +65px booked on the right surface AND reconciled; iPad card ≤ 1098.25 | **CLOSED**, one major gap attached | `d3a4d534` ships two structural payments (`options-pair` 95.19→44.00; `my-2` off `.peek-hold-surface` −16.00). `measure-FINAL.log` 1067.86/1067.83 vs `measure-p4base.log` 1135.05/1135.02, both engines, `regimeOk` first. `gate1-seal-RED-on-prior-build.log` reds at 1135.05 against the 1098.25 bound; `gate1-seal-GREEN.log` green. MEASURE reproduced both arms. The +64.8px is named to `a2865f29` and to `.ctrl-options{gap:.45rem}`, on a cell whose JSON says `mqCoarse: true` |
| **B-2** every gate banked, GATE-1 first | **CLOSED** | 39 files in `logs/BC/`; two GATE-1 reds taken at the source, not narrated (`gate1-seal-RED-on-prior-build.log`, `gate1-newrows-RED-on-prior-build.log` — the latter reds font-census AND the peek-name row with the real `Received: ""`) |
| **B-3** idle probe gains an injected control | **CLOSED** | `idle-controlled.log`: temporal 0 long → **12** long under a 60ms/250ms task; structural 11p/8wc → **14p/11wc** with three `will-change` siblings re-mounted. Both counters shown able to count |
| **B-4** dominance pinned by rendered text in fact | **CLOSED** | `dominance-pinned.log` + `out-dominance-pinned.json`: `pin=true sel=true` on all four driven rows, `rectStable=true` on all fourteen, two engines agreeing to 0.23% on the row that swung 30%. Pass 3's contaminated `caption_candidates` now reads 610.5 tight in both engines and is banked rather than struck |
| **B-5** aria-hidden h2 decided | **CLOSED**, minor scope gap | Measured first: no `.section-heading` carries `aria-hidden` and none sits in a hidden subtree (verified in the template — the four `aria-hidden="true"` are `.icon-sublabel` and the tally's drawn parts). Shipped as a property lock, not an allowlist. Honestly labelled "a lock, not a cure — it passes on both builds" |
| **B-6** DOM-order dump delivered | **CLOSED** | `domorder.log` (19 KB) + `out-domorder.json`, three cells × two engines, per-element document index and offset. Deal at #18/#16/#16 with 22–25 named surfaces after it — §3's refusal of the keypad cure now rests on the artifact it was ordered to rest on |
| **B-7** washi role gated in-repo + peek surface named | **CLOSED**, minor | `6316ac53`: `role="separator"` + a 117-char `aria-label` on BOTH `.peek-hold-surface` branches; the gate asserts all four permanent tapes carry NO role **and** that the transient washi KEEPS `role="tooltip"` — asserting only the first half would have licensed deleting the role estate-wide, and the row says so |

### Lane C

| row | verdict | the evidence that closes it |
|---|---|---|
| **C-1** coarse table republished from the committed build | **CLOSED**, minor | §1's table off `dist-FINAL`; **375×812 printed as −11.23, not −32.57**, with "the claim that survives measurement is −32.55 at 390 only" in the open and the irrecoverable source delta disclosed rather than papered. MEASURE §2 reproduces every cell |
| **C-2** the settle re-opened or refused in the open, device cells taken | **CLOSED** | `device-cells.jsonl`: two real-MobileSafari cells. iPad Pro 13 (1032×1248, row regime, drawer mounted): **four glides, four blocks of 282–358 ms**, 2.4–3.0× the whole 520 ms choreography, `framesIn120ms` 3–4; idle in the same session 43.47 fps / 0 long-100s. iPhone 16 (393×699): `drawerMounted false`, blast §2.5 confirmed on glass, 60.20 fps idle. Refused **conditionally and in the open** ("refused, not withdrawn, and not deferred… the refusal expires if the block is cured") — which is exactly what pass 3's "WITHDRAWN" would not say. Simulator limit disclosed; the ratio and the per-glide structure are what is claimed |
| **C-3** gate logs banked | **CLOSED** | as B-2 |
| **C-4** G9 dispositioned, G12 given a control | **CLOSED** | G9 struck in the open as a symbol-import count that cannot fail for the property anyone cares about; its successor row now carries the control it never could (clone 3 `will-change` siblings → must count 4 painted / 3 promoted). G12 re-cut from a chain of assertions into a probe over data and re-taken with the id moved to a decoy sibling → `agree:false, accessible:"decoy", drawn:"new game"` |
| **C-5** Patrick Hand mixed face cured + font-coverage taught the second face | **CLOSED for the instance**, major gap on the claim | `CheckStatus.vue` re-cut (`·`→`—`, `Ask`→`ask`, zero bytes); `check-font-coverage.mjs` grows a second face (`gates-FINAL-static.log`: 2 faces, Patrick Hand 46 cp / 10 strings, covered as authored AND transformed); `e2e/font-census.spec.ts` reads the rendered page with a 22-row ledger and a planted `Xylophone` control; `mixedface-AFTER.log` (second instrument, both engines, both cells) shows zero visible mixed strings at `.check-status`, only the never-painted `sr-only` sentence |

---

## 2 · GAPS

### MAJOR

**BC-M1 · The new layout branch is gated only as a ceiling — it cannot red if it collapses.**
`.options-pair` was sold on a safety property: *"each half is 78.96 × 44 against the 60.02 / 48.02
the two words need… the target grows on the axis a thumb was short of."* Nothing gates that. The
only row that touches the branch is the seal row (`visual-regression.spec.ts:608`), whose bound is
`panelH ≤ 1098.25` — an **upper** bound, so a pair that shrank to 20px tall would make it *greener*.
The 44px two-dimensional floor (`zone-grammar.spec.ts:377-378`) runs only inside the `coarse regime`
describe at iPhone-13 geometry, where the branch does not exist (mobile takes `.options-row`).
`grep -rn "options-pair" e2e` returns exactly three hits and all three are in the negative control's
revert stylesheet and a comment. So the property the cure was justified by has zero witness at any
cell where the branch is live. The measurement exists (`out-FINAL-*.json`, `device-cells.jsonl`
`pairRow {n:2, h:44, w:77.45}`); it was banked and never gated — the pass's own charge against
pass 3, one rank down.

**BC-M2 · "The population cannot grow silently again" is not what the shipped census delivers.**
`playwright.config.ts` declares one project at `viewport {1280, 800}`, fine pointer, and
`font-census.spec.ts` loads **sudoku only**. So the rendered census covers one game, one viewport,
one regime. The lane's own rig instrument (`mixedface.mjs`) censused two cells and found the coarse
card carries strings the gate can never see (`span.heading-value "Easy" → U+0045`, coarse-only per
`mixedface-AFTER.log`) — and those very strings sit in the shipped LEDGER, where they will never
red and never retire. A new mixed string in futoshiki/thermo/killer/kenken, or at any coarse cell,
is invisible. Separately, the ledger is checked in ONE direction (`unledgered == []`); the
`filterBudget.ts` pattern it names asserts set equality, so a retired row rots in place. The row's
substance is real and the instance is cured; the estate-wide claim over-reaches its instrument.
(This is pass-3 C11 — "census assertions sudoku-shaped for an estate-wide floor" — recurring on a
new gate.)

**BC-M3 · Deal's fine-1440 headroom: pass-3 B1's second charge disposed by an unbanked sentence.**
Pass 3 charged that B "flips Deal's fine-1440 headroom +18.47 → −10.28, unreported." §1 answers:
*"The desktop cells read negative in every arm including the P1 base."* **No P1-base arm exists.**
`pass4/dist-{p4base,recon,BChead,FINAL}` are all pass-3-close-or-later; no seal dist was ever served
by this stage, and both banked arms read `deal=-16.28` (chromium) / `-15.94` (webkit) — a third
number, neither reconciled with pass 3's −10.28 nor with its +18.47. MEASURE publishes Deal
headroom for the two phone cells only, so the seal arm is absent from the evidence set of record
too. The charge is answered by narration, on the one row where narration was the original offense.

### MINOR

**BC-m1 · The "P1 seal" column of §1 is quoted, not measured, under a heading that says
"REPUBLISHED FROM THE COMMITTED BUILD".** `dist-FINAL` cannot produce 1098.25 / 590.84 / 590.94.
It survives only because MEASURE re-served `6800af04` in-session and reproduced all three (and
supplied the 987.77 that BC prints as "—"). Disclose the provenance per column.

**BC-m2 · Count and arithmetic slips in the gate section.** (a) "38 files in `logs/BC/`" — there
are **39**, all timestamped before the report. (b) "default e2e 105/105 (was 101 — **+3
zone-grammar rows**, +1 font-census, +1 seal row, **−1 net after the pass-3 baseline moved under
Lane D**)": the diff `daca28ee..347826be` adds exactly **four** `test(` blocks and removes none —
2 in zone-grammar, 1 in font-census, 1 in visual-regression — and Lane D's own dossier banks
**101/101 at `daca28ee`**. 101 + 4 = 105. Two errors that cancel, one of which invents a deletion
by another lane. (c) §1's Δ column is headed "Δ vs seal" and its 1440 cell reads "−61.19 vs pass 3".

**BC-m3 · The LOC ledger does not reproduce.** Stripping comments and blank lines from both
`daca28ee` and `347826be`, the product net is **+16** — `OptionSelector.vue` **+12** (report: +8),
`GameControlPanel.vue` +4 (✓), `CheckStatus.vue` **0** (report: +1). The gate rows are looser still
(`visual-regression` +76 vs 64, `check-font-coverage` +46 vs 69). "Same stripper both sides" is
asserted and the stripper is never named, so the ledger is unreproducible by construction. "Thirteen
product lines bought 67.19px" should read sixteen.

**BC-m4 · "Verified in all five `constants.ts`."** There are **three**
(`sudoku`, `futoshiki`, `kenken`); thermo and killer import sudoku's. The substance holds — size
axes are 3/3/4/3/3 and difficulty is 3 everywhere, so `options.length === 2` really does hit exactly
one group today, and StagingBand's two selectors both pass `mobile` and so take `.options-row`
regardless. The bookkeeping does not.

**BC-m5 · B-5's lock is regime-scoped.** The heading row runs at the default 1280 fine project and
asserts `headings.length === 2` inside `.controls-card`, so it only ever sees the rail's two h2s.
At the coarse card those same h2s render inside `<button class="mobile-heading-btn">` and are never
visited by the lock. `zone-grammar.spec.ts` already carries a `coarse regime` describe — the second
arm was one `test.use` away. (The a11y consequence was tested and is benign — §4.)

**BC-m6 · Two gates carry timestamps ahead of the last commit.** `gates-vue-tsc.log` (22:21) and
`gates-vitest.log` (22:22) predate `347826be` (22:25:02), which rewrote four gate files including
`check-font-coverage.mjs`. `gates-FINAL-static.log` does re-run vitest at 22:25:40, so only
`vue-tsc` is genuinely stale, and MEASURE re-ran it at 0 on a later HEAD. Named because §4's
sentence is "one run, on the committed tree, after the last edit" and for one gate it isn't.

---

## 3 · FAILURE-MODE CHECKLIST

- **Stale tables** — CLEAR. Every figure in §0/§1 comes off `dist-FINAL` and MEASURE reproduced all
  five cells independently on a later HEAD. The pass-3 C1 offense (a headline banked from a
  superseded build) is not repeated; the discrepancy is printed as the number and the
  irrecoverable cause is disclosed instead of narrated away.
- **Gates that cannot fail** — TWO INSTANCES (BC-M1, BC-M2 second half). Against that: three of the
  pass's new rows ship in-run negative controls (seal revert > 30px, seam collapse, decoy name,
  un-pruned pose clones, planted `Xylophone`), which is the strongest control discipline in the
  loop so far.
- **Undisclosed deletions** — CLEAR. `my-2`, both string re-cuts and the `.options-row,
  .flex.flex-col` → `.ctrl-options` locator swap are all disclosed; the locator swap broadens
  rather than narrows and is argued in the commit body. The prettier global-shadow (17 files
  rewritten, backed out) is disclosed in §6.6.
- **Surface-name bookkeeping** — PRESENT BUT COSMETIC (BC-m2, m3, m4). Add: the report numbers its
  Lane-C rows C1–C6 while the commit table numbers the same rows to the pass-3 work order
  (`6316ac53` = "B7 + B5 + C4"), so "C4" means two different rows two paragraphs apart.
- **Unbanked claims** — ONE (BC-M3), plus the quoted seal column (BC-m1).
- **Regime witnesses** — EXEMPLARY. Every cell banks `regimeOk` from three observables before a
  figure; the seal row refuses to read a number at `pointer: fine`; both device cells print
  `coarse/hoverNone/rowRegime` and an error trap installed ahead of the module script, so
  `errors: []` is a measurement.

---

## 4 · TWO a11y HYPOTHESES, TESTED RATHER THAN ASSERTED

Both would have been major findings. Both are refuted on a live tree, and I am recording the
refutations so no later pass re-raises them from the spec text.

1. **`role="separator"` and presentational children.** ARIA 1.2 lists non-focusable `separator`
   under Children Presentational, which would drop the "hold to peek" tape — one of the four
   permanent tapes the estate defines as labels — out of the a11y tree, invisibly to B-7's
   DOM-only gate. **Refuted.** Chrome's own tree via CDP `Accessibility.getFullAXTree` at
   1280×800-coarse: the splitter node is `ignored: false`, keeps 2 children, and `hold to peek`
   survives as an un-ignored `StaticText`. WebKit's aria snapshot shows the same. The tape's text
   is still exposed.
2. **`.section-heading` inside `<button>` at the coarse card.** `button` IS unambiguously
   Children-Presentational, which would make B-5's "HEADINGS for AT" false at the one regime its
   gate never visits. **Refuted.** AX heading nodes at 390×844 isMobile: 3, including `Size` and
   `difficulty` — Chrome exposes them. B-5's decision stands; only its gate's scope is narrow
   (BC-m5).

Residual, unevidenced either way: a 117-character `aria-label` on a **non-focusable** separator is
announced inconsistently across screen readers and cannot be reached by keyboard from the element
itself. The property "an AT user can discover the peek affordance" has no witness in this pass. It
belongs beside the standing M4/M2 blind-read owner row, not in a lane.

---

## 5 · STRENGTHS WORTH CARRYING FORWARD

- **The price was paid, not argued.** Two structural payments (51.19 + 16.00 = 67.19) against a
  64.8px bill, neither touching the seam nor the 44px floor, and the rejected alternatives are
  printed **with their arithmetic** (row-packing: max-content 204/240/288/192 against a 165.11px
  rail; a tighter gap: 9 × 0.8 = 7.2px, one fifth of the debt, spent on the seam it just bought).
  A refusal with a number in it is a different object from a refusal.
- **The refusal that names its own expiry.** C-2 declines a numbered order on four glides of device
  evidence, states the simulator's limit, and says what would reverse it. That is the shape every
  future refusal in this loop should take.
- **GATE-1 at the source, twice, with the reds on disk** — including a red whose text is the actual
  `Received: ""` on the un-cured build, not a recital.
- **G9 struck rather than defended**, and its successor given the control the struck row could
  never carry. Striking is the underused move in this loop; this is the model.
- **The mixed-face finding itself.** A codepoint outside a declared `unicode-range` falls through
  silently forever, and thirteen gates were blind to it. Finding it, curing it for zero bytes, and
  ledgering the 22 pre-existing instances with a reason per row is the best diagnostic work of the
  stage — the over-claim in BC-M2 is about the gate's reach, not about the finding.

---

## 6 · ROUTING

- **No blocking gaps. BC posts the loop's first clean-by-the-letter pass**, and under the
  convergence law its second clean pass (pass 5, fresh non-author audit) would start the clock —
  provided BC-M1/M2/M3 close without opening new rows.
- **Pass-5 work order for BC**: (1) gate the pair branch's own floor at a cell where it is live —
  ≥44px in both dimensions at 1280-coarse, with the revert as its control; (2) run the rendered
  font census at the coarse cell and across the five games, or re-word the purchase to
  "sudoku at 1280 fine"; make the ledger bidirectional so retired rows red; (3) serve the seal and
  print Deal's fine-1440 headroom for all three arms, or withdraw the "including the P1 base"
  sentence; (4) republish the LOC ledger with the stripper named, and correct the four count slips.
- **To the adjudicator, unchanged by this critique**: the two eyebrows at one rank in two crayon
  registers (third pass carrying it); mass-vs-density still disagreeing on Deal's die and printed
  as unresolved — B-4 did what it was asked and the disagreement is a design question, not a gap.
- **To the deploy gate**: BC's contribution to §5 is PASS on the one row it owned
  (iPad ≤ 1098.25 → 1067.86, re-measured by a non-author on a later HEAD).
