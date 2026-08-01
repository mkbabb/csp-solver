# STAGE BC — THE PRICE RECONCILIATION · pass-4 dossier

Tree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` — **MAIN**, base
`daca28ee` (Lane D's pass-4 close, ≥ `5873a920`), clean before and after. **Four commits,
nothing pushed, nothing deployed.** One lane because the blocking rows of B and C were one
question.

| commit | rows |
|---|---|
| `d3a4d534` | B1 + C1 + C2 — the reconciliation, measured, gated, GATE-1'd |
| `34e17771` | C5 — one face at the caption rank; font-coverage taught the second |
| `6316ac53` | B7 + B5 + C4 — the peek surface named, the washi role gated, G12 controlled, G9 struck |
| `347826be` | the eslint `no-undef` the second face introduced; prettier scoped to this stage's files |

Evidence: **`pass4/logs/BC/`** — 38 files, every gate and every rig run banked to disk (pass 3's
B2/C4 offense; an unbanked gate does not exist). Rig `pass4/rigBC/` (7 instruments), shots
`pass4/shots-BC/` (24 rail crops: BEFORE/AFTER/FINAL × 2 cells × 2 themes × 2 engines), device
lines `pass4/logs/BC/device-cells.jsonl`. Dists `pass4/dist-{p4base,recon,BChead,FINAL}`.
`frontend-design` invoked before the visual work; its artifact is the BEFORE/AFTER crop pair,
not a claim of restraint (pass-3 B15).

Ports: `:4501/:4502/:4503/:4504` (static rig servers), `:4877` (device host), `:4188` (the
throttle lane's own preview, orphan killed first). `:4894`/`:4895`/`:3001`/`:4288`/`:3000` never
addressed. Sims `iPad Pro 13-inch (M4)` and `perf-rig-iphone16` booted for their cells and **shut
down at the close** (0 booted at exit).

---

## 0 · THE RECONCILED NUMBER

**1067.86 against the 1098.25 seal bar** (webkit 1067.83). Both cures intact: B's seam reads
**7.19px at every group, both axes, both engines, and on Apple glass**; C's coarse cure is not
merely restored but improved on — the iPad card ends **30.39px under the seal** and **2.50px
under C's own banked 1070.36**.

The +64.8px was not argued away and not shaved. It is PAID, structurally, twice:

**Payment 1 — a binary is a pair, not a stack.** The rail is 165.11px wide and every option in it
is a full-width chip on its own line. `candidates` is two options; stacked it read as two more
entries in a list of fourteen, and it cost two 44px tap targets plus a seam. As one row of two
halves it costs one: **95.19 → 44.00** at 1280-coarse, 83.19 → 38.00 at the fine rail. Each half
is **78.96 × 44** against the 60.02 / 48.02 the two words need at max-content, so nothing is
crowded and the target grows on the axis a thumb was short of. The rule is the DATA's —
`options.length === 2` — so no caller learns a flag; the estate has exactly one binary today and
every game's size and difficulty axis carries 3–4 (verified in all five `constants.ts`).
**The phone has always drawn it this way** (`.options-row`); the rail was the outlier, and the
branches now agree.

**Payment 2 — the divider stops doubling a margin it does not own.** Both wells carry
`margin-block: 0.5rem`, priced at C's frame-daylight floor. The peek surface is not a drawn
frame, and its own `my-2` put a second 8px on each side of a 14px rule — 32px of margin around a
divider. The mobile twin has never carried it. **−16.00px**, the ≥44px hold target and its 16px
internal padding untouched.

Row-packing the triples was measured and REJECTED, not skipped: max-content sums are 204 / 240 /
288 / 192px against a 165.11px rail, so `flex-wrap` would give ragged 1-vs-2-vs-3-line groups —
C's own "two captions at two different x reads accidental", one rank down. A tighter gap was also
measured and rejected on arithmetic: 0.45rem → 0.40rem is 9 × 0.8 = **7.2px**, one fifth of the
36.80 owed, and it spends the seam to buy it. Widening the rail moves the board and `cell-light`
is a committed golden (C's own 3.45px finding).

---

## 1 · THE FULL COARSE TABLE, REPUBLISHED FROM THE COMMITTED BUILD

`rigBC/measureBC.mjs`, off `dist-FINAL` (`index-CePRW1yWbvW_.js` — the tree's own build, hash
verified after the last edit), both engines, every cell carrying `regimeOk` from three
independent observables before a figure is banked. `panelH` is the panel's own box, the number
the seal was set on.

| cell | P1 seal | pass-3 HEAD | **pass-4 HEAD** | Δ vs seal | webkit |
|---|---|---|---|---|---|
| **1280×800 coarse** (the iPad card) | **1098.25** | 1135.05 **(+36.80, inverted)** | **1067.86** | **−30.39 ✓** | 1067.83 |
| **375×812 coarse** | 590.84 | 579.61 (−11.23) | **579.61** | −11.23 | 579.61 |
| **390×844 coarse** | 590.94 | 558.39 (−32.55) | **558.39** | −32.55 | 558.39 |
| **1440×900 fine** (rail) | — | 1036.13 | **974.94** | −61.19 vs pass 3 | 974.80 |
| 390×844 fine — NEG CTRL | — | 423.88 | 423.88 | the pass-1 harness, on demand | 423.86 |

`minGap` is **7.19 at every cell in both engines, before and after** — the seam is not what paid.
Both phone cells are **byte-unmoved by this stage** (558.39 / 579.61 in both arms).

**C's row 1, republished honestly.** The pass-3 headline was "−33px at every coarse cell". On the
committed build it never was: **375×812 is −11.23, not −32.57**, and the report's own final-build
artifact said so seven minutes before it was written. The claim that survives measurement is
**−32.55 at 390 only**; 375 buys a third of that, and the reason is not recoverable from disk
(the earlier dist was overwritten). It is printed here as the number, not as the claim.

**The 1280 inversion, named with its cause beside it.** `a2865f29`'s `.ctrl-options{gap:.45rem}`
spends 7.2px on each of NINE column neighbours (14 chips in 5 groups) = **+64.8px**, which is the
entire 1070.36 → 1135.05 movement. It was booked as "rail scrollHeight"; the cell is `mqCoarse:
true, mqHover: false` — an iPad card, and `panelH`, not `scrollH`. Repaid in full above.

**Deal's headroom, honestly.** The two phone cells are the keypad cells and both clear:
+110.05 / +131.08 chromium, +109.64 / +130.67 webkit — unchanged by this stage to 0.00px. The
desktop cells read negative in every arm including the P1 base; a 296px soft-keypad band at a
1440 rail is not a keypad cell and is reported, not banked as a regression.

---

## 2 · LANE C — ROW BY ROW

**C1/C2 · the coarse table republished from the committed build — CLOSED.** §1 above.

**C3 · the settle — REFUSED against the numbered order, IN THE OPEN, with the device measurement
that justifies refusal.** Pass 3 closed item 1 by subtraction on the one session its precondition
had cleared and took zero device cells. This stage took two, on real MobileSafari
(`logs/BC/device-cells.jsonl`, error trap installed in `<head>` ahead of the module script, so
`errors: []` is a measurement):

*Cell 1 — `iPad Pro 13-inch (M4)`, 1032×1248 dpr2, Version/19.0, coarse + row regime, drawer
mounted, `index-CePRW1yWbvW_.js`.* Four REAL drawer glides driven through `.drawer-tab`, each
sampled 900ms across the 520ms transition:

| act | frames | fps | >50ms | >100ms | worst gap | blocked in 900ms | frames a 120ms settle would get |
|---|---|---|---|---|---|---|---|
| close | 29 | 30.75 | 2 | 1 | **358ms** | 497.8 | 4 |
| open | 28 | 30.17 | 4 | 1 | **285ms** | 461.4 | 4 |
| close | 30 | 33.22 | 1 | 1 | **282ms** | 380.5 | 4 |
| open | 27 | 28.75 | 4 | 1 | **293ms** | 472.1 | 3 |
| *idle, same session* | 176/4s | 43.47 | 27 | **0** | 79ms | 1383.9/4s | — |

**Every glide contains exactly one main-thread block of 282–358ms — 2.4× to 3.0× the whole
choreography's duration — and a 120ms interior settle would be drawn in three to four frames.**
It would not be seen as motion; it would be a jump inside a stall. This is the stall lane's
188–233ms desktop-Safari finding reproduced at the coarse row regime on the engine that owns it,
and it is the measurement pass 3 asserted without taking.

*Cell 2 — `perf-rig-iphone16`, 393×699 dpr3, Version/19.0 Mobile.* `drawerMounted: false`,
`.drawer-tab` `display: none`, `rowRegime: false` — **blast §2.5 confirmed on glass**: there is no
drawer below 1024, so the settle could never have served the phone at all. That arm idles at
**60.20 fps, 0 long frames, 18.3ms blocked over 4s** — the contrast that makes the iPad glide
figure a finding rather than a simulator artifact.

Refusal, stated plainly: **the settle is refused, not withdrawn, and not deferred.** It is item 1
of a numbered order and it is being declined on evidence — a choreography whose entire duration
is shorter than the single blocking frame it would run inside, on the only regime where the
surface it would decorate exists. Honest limit: a simulator's WebKit runs on the host CPU; its
absolute fps is not an iPad's. What carries is the RATIO (glide 30fps vs idle 43fps in the same
session) and the structural fact (one block per glide, every glide, four for four).

Both device cells also re-read this stage's own deliverables on glass: **panelH 1060.58** at
1032-coarse (under the seal), **seam 7.19 at all five groups** including the new pair row (2 chips,
77.45 wide, axis `row`), `peekMargin {mt: 0px, mb: 0px, role: separator, named: true}`, and the
cured status line `board changed — ask again`.

**C4 · gate logs banked — CLOSED.** 38 files in `logs/BC/`. Every count in §4 has a file.

**C5 · G9 struck, G12 controlled — CLOSED.** G9 ("`useRasterStack` consumers = 3") is **struck in
the open**: a count of a symbol's import sites cannot fail for the property anyone cares about.
Its successor already existed — "a frozen well mints ONE pose node and promotes nothing" — and
now carries the control G9 never could: three `will-change: opacity` siblings cloned in-page, and
the probe must count **4 painted / 3 promoted** back. G12 ("the accessible name and the drawn one
are one string") was a chain of assertions over a single shared text node and could not tell
whether it had ever observed the two separately; re-cut as a probe over data and re-taken with the
name decoupled in-page, it must report `agree: false`, `accessible: "decoy"`, `drawn: "new game"`.

**C6 · the Patrick Hand mixed face — CURED, and the gate taught the second face — CLOSED.**
Cured by re-cutting the string (the option the order offered, zero bytes): `·` → `—` (U+2014, in
the cut, and the spoken line's own punctuation) and `Ask` → `ask` (the caption rank's register —
`marks`, `candidates`, `pencils`, `hold to peek`, `new game` are all lowercase). Verified
rendered: `rigBC/mixedface.mjs` on the final build reports **zero** visible mixed-face strings at
`.check-status` in both engines and both cells; the only survivor is the `sr-only` sentence, which
is never painted.

Taught twice, because the old gate was blind in two directions:

- `check-font-coverage.mjs` gains the second face — Patrick Hand's cmap against the register this
  loop owns (3 tapes, 2 captions, 4 status lines), both cases, plus range≡cmap both directions.
  **Proven able to red**: re-adding the old string exits 1 naming `"·" "A"`.
- `e2e/font-census.spec.ts` (new) reads the RENDERED page instead of a corpus — every visible text
  node's first family resolved against that face's range parsed from the LIVE stylesheet,
  `text-transform` applied, compared to an exact-match LEDGER. Planted control (`Xylophone` in the
  hand face) must be seen with `U+0058`.

**The census found the condition is estate-wide and older than this loop** — 22 mixed strings
across BOTH subset faces, unledgered anywhere until now. Fira Code's cut only ever held the size
and difficulty words, so **every live-zone chip** (`Normal` `Corner` `Center` `Off` `On` `Ask`
`Live`) renders part Fira Code, part system monospace; Patrick Hand declares C/R/S as its only
capitals, so four icon sublabels, three closed-tab values and the keycaps fall through. Re-cutting
two woff2 files is a font job with an owner-declined byte cost attached (P1-W3). What ships is the
ledger with a reason per row, so the population cannot grow silently again.

---

## 3 · LANE B — ROW BY ROW

**B1 · the +65 booked honestly and reconciled — CLOSED.** §0–§1.

**B2 · every gate banked, GATE-1 first — CLOSED.** `logs/BC/`, and the two GATE-1s ran at the
source, not in narration:

| GATE-1 | prior build (`dist-p4base` :4501) | cure (:4188) |
|---|---|---|
| "the iPad coarse card stays under the P1 seal" | **RED — 1135.05 against 1098.25** | GREEN — 1067.86 |
| "no string renders in two faces except the ledgered" | **RED — `board changed · Ask again` unledgered** | GREEN |
| "the permanent tape is a LABEL … the surface it names has a name" | **RED — `role` null on `.peek-hold-surface`** | GREEN |
| "option chips keep their separation" | GREEN both (unchanged by this stage — the seam is not what paid) | GREEN |

The seal row also carries an in-run negative control: both payments reverted in-page must break
the seal, and the delta must exceed 30px.

**B3 · the idle probe gains injected controls — CLOSED.** Pass 3 read `0/0/0` on both arms with no
control, so the metric had no dynamic range in either direction. Two controls, one per metric, in
the same session as the reading (`rigBC/idle.mjs`, `logs/BC/idle-controlled.log`):

| | shipped | injected control |
|---|---|---|
| temporal (8s idle → 3s with a 60ms task every 250ms) | 1064 frames, **0** long >50ms, worst 10.3ms, 132.92 fps | **12** long >50ms, worst 60.6ms, 108.23 fps |
| structural (poses painted / promoted) | 11 / **8** | 14 / **11** (3 `will-change` siblings re-mounted) |

Both counters are now shown able to count what they claim. The shipped zero means something.

**B4 · dominance references pinned by rendered text IN FACT — CLOSED.** Pass 3's locators were
regexes over three alternatives, so `sel_difficulty` resolved to whichever word was selected —
"Normal" in one engine, "Easy" in the other, **426.72 vs 553.29, a 30% swing on re-run**. The
selection is now DRIVEN to a named literal through the panel's own wiring before any pixel is
read, and every row carries `pinnedText` / `pinHeld` / `selected`
(`logs/BC/dominance-pinned.log`, `out-dominance-pinned.json`, 1280×900 light, both engines):

| rung | mass chromium · webkit | density (tight) | vs Deal |
|---|---|---|---|
| `difficulty` eyebrow | 682.65 · 677.74 | 0.20047 · 0.19980 | 3.56× |
| **`Medium` selected chip** (pinned) | **626.34 · 627.80** | 0.35775 · 0.36331 | 3.27× |
| **`Corner` selected chip** (pinned) | 518.98 · 568.08 | 0.35724 · 0.35864 | 2.71× |
| **`Live` selected chip** (pinned) | 339.17 · 332.69 | 0.25550 · 0.30176 | 1.77× |
| `teacher's` tape | 290.73 · 303.46 | 0.20510 · 0.21408 | 1.52× |
| **`9×9` selected chip** (pinned) | 294.97 · 273.60 | 0.30293 · 0.33788 | 1.54× |
| `size` eyebrow | 242.61 · 240.52 | 0.24021 · 0.23580 | 1.27× |
| `new game` tape | 224.36 · 226.41 | 0.15689 · 0.16201 | 1.17× |
| **Deal (whole button)** | **191.62 · 194.41** | 0.16790 · 0.16531 | 1.00× |
| `pencils` tape | 178.08 · 179.25 | 0.15220 · 0.15669 | 0.93× |
| Deal's die alone | 138.14 · 138.53 | **0.22102 · 0.22165** | 0.72× |
| `candidates` caption | 110.74 · 112.71 | 0.18139 · 0.18461 | 0.58× |
| `marks` caption | 59.55 · 60.65 | 0.16406 · 0.16707 | 0.31× |
| Deal's verb alone | 53.48 · 55.88 | 0.17680 · 0.18142 | 0.28× |

`pinHeld: true` and `selected: true` on all four driven rows, `rectStable: true` on all fourteen.
The two engines now agree to **0.23%** on the row that swung 30%. Pass 3's disclosed §5a
contamination was the unpinned reference: `caption_candidates` now reads 610.5 tight in BOTH
engines (was 2997 vs 610.5), so that row's density is banked rather than struck. **Deal ranks 9th
of 14 by mass** — F1's pass-2 "dominant at 1.52–1.54×" stays refuted, now on a stable instrument.
By density the die (0.22102) still out-inks the eyebrow it commits (0.20047). Mass and density
still disagree; still printed, still not resolved.

**B5 · the aria-hidden h2 decided — CLOSED, and locked.** Measured first: on this tree **no
`.section-heading` is `aria-hidden`** and none sits inside a hidden subtree — the four
`aria-hidden="true"` on the card are `.icon-sublabel` and the tally's drawn parts, decorative text
whose control carries its own `aria-label`. So the estate has already chosen HEADINGS FOR AT and
there is no "both" to remove. The decision is now a gate stated as the property rather than a
class allowlist: every `.section-heading` is an `<h2>` with a non-empty accessible name, none is
hidden, and **no `aria-hidden` subtree on the card may contain a heading**. It is a lock, not a
cure, and it is labelled as one — it passes on both builds.

**B6 · the DOM-order dump delivered — CLOSED.** `rigBC/domorder.mjs`,
`logs/BC/{domorder.log,out-domorder.json}`, three cells, both engines, per-element document index
+ box + offset from the panel's top. §3's refusal of the keypad cure now rests on the artifact it
was ordered to rest on:

| cell | Deal at | named surfaces after Deal | peek divider | last |
|---|---|---|---|---|
| 390×844 coarse | #18, top 110.39 | **25** | #69, top 176.14 | action `Hint`, top 508.23 |
| 1280×800 coarse | #16, top 392.45 | **25** | #68, top 460.08 | action `Hint`, top 1015.83 |
| 1440×900 fine | #16, top 356.45 | **22** | #68, top 424.42 | legend, top 903.73 |

Deal is not last on any cell in either engine; the divider, four actions, the play tools and (at
fine) the legend all follow it.

**B7 · the washi role gated in-repo + the peek surface named — CLOSED.** `.peek-hold-surface` was
a bare `<div>` with five pointer handlers, no role, no name; pass 3 diagnosed it and cured the
tape's role instead. It is the zone separator and its gesture has a keyboard twin, so it says
both: `role="separator"` + *"Staged controls above, play tools below — press and hold, or press K,
to peek at the answer key"*, on both branches, confirmed on the device (`named: true`). The role
cure is now gated: all four permanent tapes carry no role AND the transient hover washi **keeps**
`role="tooltip"` — asserting only the first half would have licensed deleting the role everywhere.

---

## 4 · GATES — one run, on the committed tree, after the last edit

`vue-tsc` **0** · `prettier --check src/` clean · `eslint` clean · `knip` clean ·
`test:font-coverage` **2 faces / 18 strings** (Fraunces 28 cp / 13,788 B · Patrick Hand 46 cp /
4,312 B) · `lint:ink` exit 0 · `test:golden:bytes` PASS · `vitest` **332 / 31 files** ·
**default e2e 105 / 105** (was 101 — +3 zone-grammar rows, +1 font-census, +1 seal row, −1 net
after the pass-3 baseline moved under Lane D) · **built-dist lane 14 / 14** (filter-census 3,
theme-bake ×4, wordmark-webkit 6) · `npm run build` green, `index-CePRW1yWbvW_.js`.

Logs: `gates-FINAL-static.log` · `gates-FINAL-e2e-default.log` · `gates-FINAL-e2e-builtdist.log` ·
`build-FINAL.log`. Goldens not re-run and **nothing re-baselined** — Lane D re-minted
`logo-light`'s darwin baseline at `64fa37a4` this pass and no golden clips a control panel
(blast §0).

---

## 5 · LOC — code-only, same stripper both sides, against `daca28ee`

| file | net |
|---|---|
| `OptionSelector.vue` | **+8** (the pair branch + its two rules) |
| `GameControlPanel.vue` | **+4** (`role`/`aria-label` ×2, `my-2` removed) |
| `CheckStatus.vue` | **+1** (two strings re-cut) |
| **product total** | **+13** |
| `e2e/visual-regression.spec.ts` (the seal row + its control) | +64 |
| `e2e/zone-grammar.spec.ts` (3 rows + 2 controls) | +155 |
| `e2e/font-census.spec.ts` (new) | +187 |
| `scripts/check-font-coverage.mjs` (the second face) | +69 |
| unit text updates | +0 |
| **total** | **+488** |

Thirteen product lines bought 67.19px, a cured caption and two named surfaces; the rest is gate.

---

## 6 · WHAT IS OPEN, PLAINLY

1. **22 pre-existing mixed-face strings**, both subset faces, now LEDGERED and gated but not
   cured. The cure is a woff2 re-cut whose byte cost the owner declined once (P1-W3). An owner
   row, not a lane row.
2. **375×812 buys −11.23, not −32.57.** Republished. The 17:59→18:16 source delta that produced
   the discrepancy is not recoverable from disk; the number is banked, the cause is not named.
3. **The settle is refused, not impossible.** If the ~200–360ms glide block is ever cured, the
   ≤120ms interior choreography becomes affordable and the refusal expires with it. It is a
   conditional refusal and it is labelled as one — which is precisely what pass 3's "WITHDRAWN,
   not deferred" would not say.
4. **The sim is not an iPad.** The glide figures are a simulator's WebKit on host silicon. The
   ratio and the per-glide structure carry; the absolute fps does not. The owner's E8 device smoke
   still owns the iOS claim.
5. **The rail is still a 1067.86px column in a 608px window** at the iPad. Under the seal, and
   still a long scroll. Nothing in this stage argues the rail's total height down; C's uncashed
   T′ collapse (~half of `GameControlPanel`'s +178 is the well markup written twice) remains the
   named closure.
6. **Prettier global-shadow, hit and backed out.** `npm run lint` is `--check src/`, so `e2e/` and
   `scripts/` have never been formatted; running the formatter over them rewrote 17 files this
   stage never opened. Reverted, and the standing trap re-confirmed.
