# STAGE C — F2's ZONE GRAMMAR · NON-AUTHOR ADVERSARIAL CRITIQUE (pass 3)

Non-author, read-only. Re-derived against the real tree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` (MAIN, base `2335282c`, four
Lane C commits `043b94c0` → `573317aa`, 18:21:49–18:22:32), the lane's own raw JSON in
`pass3/rig3/`, its built dists in `pass3/dist-*`, and `pass3/measure/RESULTS.md`. Every number
below came out of the diff or the banked artifact, not off the report.

The stage's report is `pass3/lane-c-report.md` (the order's `stageC-report.md` does not exist;
this is the file at that slot).

**Verdict up front.** This stage did the single best piece of instrument work in the loop — the
inkmass decontamination is real, and I proved it from the raw JSON rather than taking the
report's word. The census that reads ranks, the `aria-pressed` coupling gate, and the pose prune
are all genuine, and the prune is corroborated on real WebKit by a lane that isn't this one. But
the stage's HEADLINE — "−33px at every coarse cell" — is banked from a build the lane itself
superseded, and **the lane's own final-build artifact, written 7 minutes before its report and 35
minutes before the commit MEASURE blames, already says the number is −11.23.** Its first-numbered
work-order item closes by deletion on a session where the precondition that blocked it had
cleared. Its gate log is a sentence, not a file.

**Honest convergence: 72%.** Advance over pass 2's 62%. Not a clean pass — the 100% clock does
not start here.

---

## 1 · THE OFFENSE THAT CARRIES THE STAGE — the banked number its own final build contradicts

Lane C ran `rig3/measure.mjs` **twice**. Run 1 at 17:59–18:11, run 2 at 18:16–18:18. The report
was written at 18:25. It banks run 1.

| `head/coarse-375x812` panelH | run 1 (`out-cells-chromium.json`, 17:59) | run 2 (`out-cells chromium-.json`, 18:16) |
|---|---|---|
| panelH | **558.27** | **579.61** |
| Δ vs base 590.84 | −32.57 | **−11.23** |
| report §1 banks | ✔ this one | never mentioned — `grep -c 579` on the report returns **0** |

Run 2 is not a different tree. `dist-head/` was rebuilt at **18:16:30** and its stylesheet is
`index-9FIqLDQQjyPt.css` — **byte-name-identical to `dist-e982a403/assets/index-9FIqLDQQjyPt.css`**,
the dist built from the lane's own committed source. `serve.log` maps `dist-head → :4252` off
disk, so run 2 read that build. Run 2 measured the committed tree. Run 1 did not.

Everything structural is identical across the two runs — `chips` arrays equal element-for-element
(11 chips, `4×4` 52.81, `9×9` 52.81, `16×16` 72), `groups` equal, `byRank {tape:3, eyebrow:2,
caption:2}`, `poses`, `chipFloorMin 44`, `ariaPressedMissing 0`. **Only the height moved**, and
only at 375. The lane had the contradiction in hand and published the favourable half.

Three consequences, each independently checkable:

1. **The report's 375 row is false on the committed tree**, in the direction that flatters it.
   Two thirds of the cure at the narrowest supported phone is gone.
2. **The webkit column for the final build has no artifact at all.** Run 2 was invoked with a
   quoting bug — `measure.mjs:285-286` reads `mode = argv[2]`, `engine = argv[3]`, and all four
   run-2 files carry `"engine": "chromium"` with mangled modes (`"ink chromium"`, `"cells"`).
   `out-cells webkit-.json` and `out-ink webkit-.json` **are chromium**. The report's "both
   engines" for the final build rests on filenames, not on engines. Filename-as-witness is the
   same species as pass 2's grep-as-witness.
3. **RESULTS' attribution is refuted by this lane's own dist.** RESULTS §2 rules "the movement is
   entirely `a2865f29`, Lane B's `.ctrl-options { gap: 0.45rem }`". `a2865f29` is timestamped
   **18:51:11**. `dist-head` is 18:16:30 and `grep -c ctrl-options` on its stylesheet returns
   **0** — the class does not exist in the build that already reads 579.61. The artifact RESULTS
   cites (`out/attrib-BA-chromium.json`) shows only that B's close ≡ A's close; it contains no
   reading at `573317aa` and therefore cannot separate Lane C's own head from Lane B's commit.
   **The 375 half of that attribution is wrong, and it is wrong in the direction that moves a
   price off this lane's ledger and onto another's.**

I do not name the cause. The 17:59→18:16 source delta is not recoverable from disk (the earlier
dist was overwritten) and the chip widths rule out the obvious candidate. What is proven is that
the lane measured its committed build, got a number 21.34px worse than the one it published, and
published the other one anyway.

The 1280×800-coarse inversion (1070.36 on both of Lane C's runs → **1135.05** at the pass close,
sign flipped) IS post-Lane-C and is somebody else's row. The 375 cell is not.

---

## 2 · THE ORDER, ITEM BY ITEM (pass2-registry §1 F2 — closure of every numbered item is the bar)

### Item 1 — the settle on the mandated rig, unlocked session · **CLOSED BY SUBTRACTION — 70%**

The settle is gone from the tree, so there is nothing left to measure. Two of the three reasons
are substantiated and I verified both: the stall lane's `188–233 ms on desktop Safari 26.4`
(`stall-attribution-report.md:6,58,82,144`) and `blast-radius.md §2.5` "there is no drawer below
1024". Not posting a 120ms choreography inside a 200ms main-thread block is correct engineering.

Three things are still wrong with how it closes:

- **The precondition cleared and the lane didn't use it.** Registry §6.1 made the settle
  conditional on an unlocked session. The session WAS unlocked — the lane says so itself (§8.4:
  "The rig session was unlocked and the stall lane used it"), and RESULTS §6.2 shows the sim
  taking device cells for F3 and Lane B. Lane C took **zero device cells**. The blocking gap that
  pass 2 charged as "settle unmet, locked screen, wrong sim" closes on a session where neither
  excuse survived.
- **"WITHDRAWN, not deferred" contradicts its own first reason**, which is explicitly temporal —
  "the wrong move *until* the stall is cured". A ruling conditioned on a future cure is a
  deferral. Calling it a withdrawal converts an open row into a closed one by wording.
- **It cites the registry against the registry.** §0 claims "the registry's own narrowing named
  wells, washi, the heading collapse and the donor deletions — not motion." The registry's
  narrowing paragraph is about the PEN alone; the settle is work-order item **1**, listed first
  and binding. The route header's "narrowed again — zone grammar only" is the only support, and
  it contradicts the numbered order it introduces. Reading the header over the order, without
  naming the conflict, is spec-cites-itself.

### Item 2 — instrument integrity · **CLOSED — 90%, and it is the best work in the stage**

I re-derived this from `rig3/out-ink-chromium.json` rather than reading §3.

- Every shared reference is **byte-identical between arms**: `heading_difficulty` 682.65 mass /
  3405.25 tight / 0.20047 density in base AND head; `heading_size` 242.61 / 1010 / 0.24021 in
  both; `deal_btn`, `deal_die`, `deal_sublabel` identical to the last digit. `rectStable: true`
  on every row, both arms.
- The contamination is **demonstrated, not asserted**: the layout box moves (`areaCssPx2` 7616 →
  7104) while the tight box does not, and `boxDensity` rises +7.2% on both headings with nothing
  drawn differently. That is the pass-2 defect reproduced as a control on the fixed instrument.
- References pinned by rendered text (`pinnedText: "Difficulty"`, `"Size"`) — the denominator can
  no longer move with the treatment. Pass 2's `.section-heading:not([class*=crayon])` offense is
  retired.
- The `.zone-tag` → `.washi-tag` dead probe is fixed (`zone-grammar.spec.ts:16` `NAME_SELECTOR`).
- Contrast artifacts BANKED: `rig3/contrast.mjs` + `out-contrast-chromium.json` on disk, 16 `C-*`
  shots across both engines, both themes. Pass 2's "no artifact on disk" charge is discharged.
- Item 3 answered **in the ordered metric**: mass, not density — 682.65 / 138.13 = **4.94×**
  (arithmetic checks), argued openly as unmeetable rather than substituted quietly, and no ink
  moved to fake it. Corroborated independently at the final tree by RESULTS §3.3 (682.65 /
  242.61 / 138.14).

Deductions: the ink run is from the superseded build, and the "WebKit ink run" the order names is
run 1's, not the committed tree's — run 2 produced no ink at all because of the argv bug. The
contrast probe is chromium-only while §5 reads as both-engine.

### Item 3 — selection announced, G11 given a control that can fail · **CLOSED — 90%**

`OptionSelector.vue:42` `:aria-pressed="selected === opt.value"`, verified in the diff. The gate
(`zone-grammar.spec.ts:119`) does better than the order asked: it asserts every chip carries
`true|false`, then asserts **pressed count ≡ drawn `.selected-item` count per group** across ≥4
groups. That coupling can genuinely red — the announced state and the drawn one cannot drift.
No injected-node control on this one specifically, which is the only reason it isn't 100%.
Deliberately not a radiogroup, and the reason is argued rather than defaulted.

### Item 4 — the rendered-name census, 44px floor on the chips · **CLOSED — 85%**

- The census reads **ranks** on names-on-the-card, not `.section-heading` count
  (`zone-grammar.spec.ts:28-43`), and it carries a **real negative control**: an `h2.section-heading`
  planted inside a well must move the count, asserted at `:76-92`. That is the GATE-1 pattern
  adopted, and it works.
- Names 6 → **7 at three ranks**, disclosed plainly in §8.6 rather than spun. Corroborated by
  RESULTS §2.
- The 44px floor gains its width dimension (`index.css` `.ctrl-btn { min-width: 2.75rem }` inside
  the coarse block) and is gated over **every visible chip in both dimensions**.
- Collateral, unbooked: `.ctrl-btn` is estate-wide at coarse — every game's panel inherits the
  width floor, and only sudoku's is gated. The census equality assertions are sudoku-specific
  (`toEqual(["Size","Difficulty"])`), so a game whose `sections` count differs is uncovered.

### Item 5 — rig debt · **PART — 65%**

| sub-item | status |
|---|---|
| `CheckStatus` unit tests, six-branch machine | **DONE** — 9 rows, off / live / armed / stale / sentence / recovery / AT-split / firm rung / live region, verified in file |
| vue-tsc + vitest logs **banked** | **NOT DONE.** `find` over `pass3/` returns no Lane-C gate log. Every `gates-*.log` on disk is MEASURE's, timestamped 20:20+. §6's "vue-tsc 0 · vitest 313/30 · e2e 84/84 · built-dist 13/13" has **zero artifact**. The order named the logs specifically. |
| uncontrolled gates G9/G12/G14/G17 get controls or get struck | **PART.** G14 now has its artifact; G17 now has content; the census got a control. **G9 (`useRasterStack` consumers) appears nowhere in the report** — `grep -i` returns 0. G12 (zone name ≡ visible tape) is now an e2e row with no control. Neither was struck. |
| six new outline mounts priced | **DONE** — 3 painted / 0 promoted where they'd have cost 12/12; gallery 24→12 painted, 24→8 promoted; and RESULTS §7 witnesses it on real WebKit (`will-change ≠ auto` **39 → 39**, live `filter` 17 → 17) |
| WebKit ink run | done on run 1; absent on the committed build |

### The pen — **CLOSED, on the order's own default — 100%**

M2 was not run; the branch deleted at pass-3 close, which is exactly what the registry
pre-authorised. No loser left beside the winner. Two cosmetic residues: the token
`CHECK_RENDERING` survives at `CheckStatus.vue:23` (a comment, so "it is gone" is loose), and the
"−42 code lines against pass 2" credit is measured against a worktree that is not the §7 ledger's
base and appears in no diff on main.

---

## 3 · MARK 6 — COLLATERAL DAMAGE

**Clean:**
- `AssistSettings.vue` / `PencilModeToggle.vue` deleted with **no dangling reference** anywhere in
  `src/` or `e2e/` (only a prose note at `GameControlPanel.vue:295`).
- The pose prune gates on `props.pose !== undefined`, so `0` is posed and unposed consumers (grid,
  drawer tab, error note, scene cards) are genuinely untouched. The latch is one-way and needs no
  new prop. **It paid B's idle regression back** — RESULTS §3.2: long frames 0/0/0 both arms,
  promoted layers 8 → 8. The cross-pollination graft worked in both directions.
- Five scene relays are one prop line each (`:proactive-check`), no contract change.
- `index.css:767` still lists `.mobile-heading-btn` in the coarse `min-height` block — the
  selector `blast-radius.md` C11 warned must not be deleted. Not deleted.
- The dark tape cure is confirmed **on Apple glass** by MEASURE §6.2, not just by this lane's
  rendered shot.

**Damage:**
1. **A new mixed-face string at the caption rank.** `.check-status` is `font-family:
   var(--font-hand)` (`CheckStatus.vue:65`) → `"Patrick Hand", cursive`, and that face is subset
   with a declared range (`index.css:91-92`) whose only uppercase is `U+0043, U+0052, U+0053`.
   The shipped visible text at `CheckStatus.vue:41` is `"board changed · Ask again"` — needing
   **U+0041 (A)** and **U+00B7 (·)**, neither in range. Two of the four visible states therefore
   render part Patrick Hand, part system cursive, at the exact rank this stage was hired to
   define. Estate-wide Patrick Hand coverage is an older, unledgered condition (`.game-card-range`
   already renders a `·`), so this is a new instance rather than a new class — but it is a new
   instance minted by the lane whose deliverable is typographic rank, and **no gate in the stage
   can see it**: `check-font-coverage.mjs` reads `fraunces-subset.woff2` and nothing else.
2. **The one font gate the stage touched, it narrowed** — corpus 7 strings → 3. The argument in
   the comment is sound for the script's §2 (range ≡ cmap, so the unre-cut subset stays legal),
   and the banked "28 codepoints / 13,788 B" is unchanged. But §1's coverage requirement shrank,
   and the subset now carries `C`, `M`, `N` with no remaining consumer — dead codepoints the gate
   is structurally unable to notice.
3. Ownership crossing: `--sheet-washi-neutral`'s dark arm is `blast-radius.md` §2.7 / C8 **Lane
   D's row**. Lane C shipped it. Disclosed and substantively right (it took the shot the row was
   waiting for), so this is a coordination note, not a defect.

---

## 4 · FAILURE-MODE CHECKLIST

| mode | finding |
|---|---|
| vacuous convergence | **PRESENT** — the settle blocker closes by deletion on the one session where its blocking precondition had cleared, and zero device cells were taken. |
| spec-cites-itself | **PRESENT** — the withdrawal cites "the registry's own narrowing" against the registry's own numbered order, where the settle is item 1. |
| gates that cannot fail | **PART** — census (injected node), `aria-pressed` (announced ≡ drawn), and the prune all red honestly. The font gate cannot see the face four names moved into. G12 has no control; G9 is undispositioned. |
| elegant-reduction | **PRESENT, mostly earned** — the pen deletes on the order's own default (clean); the settle deletes on a ruling the order didn't offer (not clean). |
| legacy aliases | **MINOR** — `CHECK_RENDERING` survives as a token in a comment; `C/M/N` survive in the Fraunces subset with no consumer. |
| masked fallbacks | **NOT FOUND** — no threshold is loosened anywhere in this stage's diff. Pass 2's named offense (the 19→17 loosening) is not repeated here. |
| unverified gestalt | **PRESENT** — a stage whose center is a phone card, with zero device cells, on an unlocked rig, publishing headless shots. §8.4 concedes it; conceding is not curing. |
| consumer-less substrate | **NOT FOUND** — `washi-tag`, the wells, and `CheckStatus` each have live consumers on both template branches. |

**Named pass-2 offenses — recurrence check.** Loosened assertions: not repeated. Non-interleaved
numbers: not applicable to this stage. Grep-as-sole-witness: not repeated, but its cousin appears
(two artifacts named `webkit` that carry `"engine": "chromium"`). **Stale specs: REPEATED, and
worse than pass 2's instance** — pass 2's was an edit 34 seconds after a gate; this is a full
re-run whose disagreeing number was in hand and went unpublished. §7's LOC ledger, by contrast,
**sums correctly this time** (178+43+20+17+17+1+5−8−99 = 174; 174+276 = 450), so pass 2's
arithmetic offense is genuinely retired.

---

## 5 · GAPS

**Blocking (3)**

1. The headline coarse figure is banked from a superseded build; the lane's own final-build
   artifact reads **579.61** at 375×812 (Δ −11.23, not −32.57) and the report never names it.
2. The stage's center — "−33px at every coarse cell" — does not hold on the tree that exists:
   375×812 is −11.23 and 1280×800-coarse is **+36.80, sign inverted**. One cell of three survives.
3. Order item 1 closes by subtraction, mislabeled "not deferred", on the session where its
   precondition cleared and the lane took no device cell.

**Major (4)**

4. Gate logs unbanked — the order names them; §6's five gate counts have no artifact on disk.
5. G9 undispositioned, G12 uncontrolled — order item 5 said controls or struck; neither happened.
6. New mixed-face string at the caption rank (`U+0041`, `U+00B7` outside the Patrick Hand range),
   invisible to all 13 gates, in a stage that narrowed the only font gate it touched.
7. The 375 movement is misattributed to `a2865f29` at pass level; the refuting artifact is this
   lane's own dist, 35 minutes earlier, with zero `.ctrl-options` in it.

**Minor (6)**

8. Light-arm α: report and commit body say 0.83; the code and its own new comment say **0.82**.
9. `CHECK_RENDERING` survives as a token; the −42 LOC credit is off-ledger.
10. Fraunces subset keeps `C/M/N` with no consumer after the corpus narrowing.
11. Census equalities are sudoku-shaped while `.ctrl-btn { min-width }` is estate-wide at coarse.
12. Commit body says "eleven identical unlabelled buttons"; the comment it ships says "eight".
13. `contrast.mjs` ran chromium-only while §5 reads as both-engine.

---

## 6 · WHAT IS GENUINELY EARNED, AND SHOULD SURVIVE ANY RE-CUT

The inkmass decontamination is the asset of the pass. Byte-identical shared references across
arms, `rectStable` on every row, the layout-box artifact reproduced as its own control, and
references pinned by rendered text — I checked all of it against the JSON and it holds. Every
other lane should be reading its own numbers through it.

The census that reads ranks, with a planted node that moves the count, is the successor metric
the registry asked for and it works. The `aria-pressed` coupling gate is stronger than the order
required. The pose prune is one primitive fix that two lanes inherited and that real WebKit
confirms. Item 3 was answered in the metric it was asked in and lost honestly rather than being
re-based. The pen died on its default with nothing left beside it.

None of that is in doubt. What is in doubt is the geometry the stage leads with — and the fix is
not a re-argument, it is a re-run of the three coarse cells on the head that exists, in both
engines, with the log on disk beside it.
