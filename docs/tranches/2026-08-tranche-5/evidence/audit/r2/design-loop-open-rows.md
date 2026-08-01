# DESIGN-LOOP OPEN STATE — the spec the T5 design waves consume

**Condensation, not design.** Every row below is lifted from the pass-1..4 registries, the pass-4
lane dossiers/critiques, MEASURE's `RESULTS.md`, the five charters, `round0-portfolio.md`, and the
owner's marks memo. No new design is proposed anywhere in this file; where the record says UNKNOWN
or OWNER, so does this file.

## 0 · PROVENANCE + TREE FACTS

| fact | value | evidence |
|---|---|---|
| design-loop record root | `docs/tranches/2026-08-tranche-5/evidence/design-loop/` | `pass{1,2,3,4}-registry.md` at root; `charter-f{1..5}.md`; `round0-portfolio.md`; `blast-radius.md`; per-pass subdirs `pass{1,2,3,4}/` |
| pass-4 close (loop HEAD of record) | **`52ef014a`** — "T4-P1 F3 carrier pass 4: the four banked assets and the keypad band, disposed row by row" | `pass4-registry.md:3`; `git log --oneline -1 52ef014a` |
| built artifact of record | `index-6v9S84SRo2al.js`, md5 `dc6424524ce09d0cc9e4865c561beeac` — MEASURE's `dist-head` byte-identical to F3's `dist-F3head` | `pass4-registry.md:4-7`; `pass4/measure/RESULTS.md` |
| base seal | `6800af04` (T4-P1 patch seal) | `pass4-registry.md:3` |
| production | **CF deployment `f1adfca5`** — untouched; nothing from passes 3 or 4 is deployed | `pass4-registry.md:3`, `:204` |
| audit r1 tree | `71456713d9f7361af80f09e1a456fc9787507e78` (master, clean) | `audit/r1/a11y.md:4`; `audit/r1/component-census.md:3` |
| **relation** | `52ef014a` **is an ancestor of** `71456713`, 7 commits behind it — the r1 audits were taken on a tree that CONTAINS all pass-4 design work | `git merge-base --is-ancestor 52ef014a 71456713` → true; `git rev-list --count 52ef014a..71456713` → 7 (all seven are T4-P1 KENKEN-REACHABILITY / ENGINE-PROOF-CLAMP / CI-RED commits, no design lane) |

Consequence, binding on §6: **the r1 a11y and census findings are live against the design loop's
own cures, not against a stale tree.** A collision below is a real double-ownership, never a
version artifact.

---

## 1 · PASS-5 WORK ORDERS, PER LANE

Condensed verbatim from `pass4-registry.md` §2 (`:152-191`). Numbering is the registry's. Each
lane's status line is the registry's §1 verdict. "Re-verified by the pass-5 audit" rows are the
registry's own `:186-191` list, folded in per lane.

### Lane D — INK/CONTRAST ESTATE · ADVANCE · 83% · 0 blocking / 3 major / 6 minor
*Evidence: `pass4-registry.md:15-42`, `:153-160`; `pass4/D-report.md`; `pass4/critique-D.md`; logs `pass4/logs/D/` (incl. `r3b.jsonl`, `r3b-headless-webkit.jsonl`).*

1. **Republish the flake rates from the logs** — toggle-crest-dark is **6/11 green · 5/11 red**, not the §2/§10 published 7/11 · 4/11; amend where commit `64fa37a4`'s body errs the same way (6/8 vs 5/8, three reds on logs two minutes older). A correction note beside the commit; **no history rewrite**. *(D-M1)*
2. **Print the pre-settle 21 beside the settled 9** in `filterBudget.ts` prose and in the census row, with the settle-window argument in the open — `r3b.jsonl`'s board arm reads `censusBeforeDeal` **spec 21 · device 21** on the phone (8 `svg.rest-pose` + 4 `g.logo-pose` above the settled 9) while §4 and `filterBudget.ts` say the board budget was never breached. *(D-M2)*
3. **Put the re-baseline ratification row to the team lead verbatim** — the `logo-light` darwin re-baseline was EXECUTED by the lane against pass3-registry §2 ("not any lane") and §4 row 6 ("team-lead election"), absent from all seven work orders. Authority, not concealment; evidence is the campaign's strongest. → §4 row 6. *(D-M3)*
4. **Minors** — a BEFORE arm or a movement disclaimer on the ink witnesses (state, not movement); a WebKit arm for at least the six ship-4 surfaces (ink witnesses are chromium-only on a WebKit campaign); one assertion or golden per ship-4 surface (six surfaces entered no assertion/golden); the ink rig's stderr banked (the one run with no log — the rig swallows a failed crop); `lint:ink` **executed on a runner with the run id banked** (parse-verified only today); the coarse union-area budget (6,488) given its own negative control; ship-1's **0.00px** healthy-pose margin sentence written (the real range runs only in the defect's direction).

### Lane BC — CADENCE + ZONE (merged) · ADVANCE · 88% · 0 blocking / 3 major / 6 minor
*Evidence: `pass4-registry.md:44-66`, `:161-166`; `pass4/BC-report.md`; `pass4/critique-BC.md`; logs `pass4/logs/BC/` (38 files); rig `pass4/rigBC/`; shots `pass4/shots-BC/`; dists `pass4/dist-{p4base,recon,BChead,FINAL}`.*

1. **Gate the pair branch's floor where the branch exists** — a `≥1024-coarse` describe asserting each `.options-pair` half **≥44px in both dimensions**. Today the branch is gated only as a ceiling (`panelH ≤ 1098.25`), under which a *collapsed* pair reads GREENER; the two-dimensional 44px floor runs only in the coarse-iPhone describe where the branch does not exist. The safety property the cure was sold on (each half **78.96 × 44**) was measured, banked, never gated. This is the one `test.use` that was missing. *(BC-M1)*
2. **Check the ledger both directions + widen the census one axis** (a second game or a second regime) **or print its scope on the gate** — "the population cannot grow silently again" over-reaches: the rendered font census is one game, one viewport, one regime, and the coarse-only strings sit in a LEDGER that can never red and never retire. Pass-3 C11 recurring on a new gate. *(BC-M2)*
3. **Re-dispose BC-M3 with a banked arm** — build the P1-base dist and measure Deal fine-1440, or strike the sentence. Pass-3 B1's second charge (Deal fine-1440 headroom flip) was disposed by an unbanked sentence: no P1-base arm exists, and both banked arms read a third number (**−16.28 / −15.94**) reconciled with neither −10.28 nor +18.47 — narration answering the row where narration was the offense. *(BC-M3)*
4. **Minors** — counts corrected (**39** logs not 38; **+4** test blocks not "+3/−1"; the "Δ vs seal" cell carries a vs-pass-3 number); the LOC stripper **named and committed beside the ledger** (product net **+16**, not +13); B-5's **coarse arm** for the heading lock (regime-scoped today, one `test.use` away); "all five `constants.ts`" re-worded — **there are three**; the seal column quoted under a "REPUBLISHED" heading survives only via MEASURE's re-serve; `gates-vue-tsc.log` stale vs the last commit (MEASURE re-ran at 0).

### Lane A — GALLERY/STAGING · ADVANCE · 88% · 0 blocking / 1 major / 8 minor
*Evidence: `pass4-registry.md:68-88`, `:167-172`, `:125-130` (the MEASURE correction); `pass4/A-report.md`; `pass4/critique-A.md`; rig `pass4/rigA/`; logs `pass4/logs/A/`.*

1. **Make the `:432` hold harness-independent and run RED-then-green on BOTH harnesses, banked** — `gallery-deal.spec.ts:432`'s deferred arm is dev-server-only: `page.route(/FutoshikiGame\.vue/)` cannot match the built chunk, so on preview/built-dist the hold is a no-op and the row degrades to the race it replaced (F3 banked it RED on preview; it can also pass vacuously via `toHaveCount(0)` on an empty DOM). Route the built-chunk pattern too, or pin the harness in the spec and say so. **Adjudicated in pass 4**: this red is neither "Lane A's tree defect" (F3's routing) nor a "preview-timing artifact" (MEASURE's write-off) — it is a GATE defect in Lane A's file, not a product defect. *(A-M1)*
2. **Add the dirty + SAME-game deal row (four lines)** so the same-id-fallback subsumption claim is gated — asserted, never gated; no such row exists among the 17.
3. **Pin the `d` radius** — assert band-wide or scope the handler, and move `aria-keyshortcuts` to match. The band's `d` is delivered band-wide while `aria-keyshortcuts` + the gate sit on `.staging-deal`.
4. **Minors** — §4's "~85%" corrected via the uncited `flat` arm (wrong denominator today); one **coarse** cell through the verb-ink rig (fine-regime-only on an iOS campaign); `attrib-font-census-BASE-x3.log` re-taken **with the AUDIT prepend** (369 B, unbankable as written); the e2e sub-ledger corrected (**+318 is 310** — churn column read as insertions; grand total right); a **long-string arm** for `ribbon-geom` (the one instrument with no falsifying arm).
5. **Carried, disclosed, not Lane A's to close alone** — A7's M4 blind read (owner row, §4 row 1); A15 gallery filtered population; the **guard's two names** row → cross-cutting, below.

### F3 — MOBILE CARRIER · ADVANCE, leash held short · 80% · **1 blocking** / 2 major / 7 minor
*Evidence: `pass4-registry.md:90-119`, `:173-181`; `pass4/F3-report.md`; `pass4/critique-F3.md`; rig `pass4/rigF3/`; logs `pass4/logs/F3/` (final single-tree set in `logs/F3/final/`); shots `pass4/shots-F3/`; dists `pass4/dist-{F3base,F3head,noopCTRL,curveCTRL}`.*

1. **Trigger (b)** — the T′ collapse **cashed with Lane C**, or the co-visibility target **formally re-scoped by the ADJUDICATOR** (not the lane) with the owner's mark quoted. *This is the campaign's spine and the only blocking row left in the loop.* → §2. *(F3-G1)*
2. **Write the landscape election up as a decision row for the team lead** — both arms' shots attached, the two intermediate rungs priced — **and give the fold overflow a real bound**. The renamed gate (`height ≤ innerHeight`) is satisfied at any cap and cannot bound the disclosed ~90px overflow; zero on-device landscape cells exist anywhere in the pass. *(F3-G2)*
3. **Correct the shipped `88.58` comment to the measured `90.58` / `89.98`** — the disagreement currently lives in a shipped source comment on an md5-identical artifact. *(F3-G4)*
4. **Re-label the keypad row CHARACTERIZED in the dossier** — pass 4 downgraded F3's "CLOSED, GREEN" (no OS keyboard ever raised against any tree; `installFakeVisualViewport` only; figures banked from the BASE dist). The mechanism argument and the inline strand-control stand; the label was ahead of them. **The owner row stays.** *(F3-G3)*
5. **Minors** — gate-table composition corrected (§6's built-dist composition is contradicted by its own log: filter-census 6 · wordmark 6 · theme-bake 4 · zero throttled rows; **4 of 5** projects ran, the fifth named); the fifth throttle project **run or struck**; "vitest 332/32 files" vs its own log's **31**; §5's "every cell byte-identical" re-stated over the complete cell set (**926×428 and 740×360 also move** — banked, but the claim is broader than its table); **`dt-name`** given a visible route or the removal put to the adjudicator **with alternatives priced** (`:hover`/`:focus-visible`/`:focus-within` all deleted; the stated replacement is an `aria-label`, not a visible surface); **`TallyDescriptor.expand`** dispositioned (consumer-less, 5 unit rows still test it).

### Cross-cutting
*Evidence: `pass4-registry.md:182-184`, `:271`.*

1. **The guard's two names AND the eyebrow two-register question go to the adjudicator TOGETHER** — same class, same rank, one surface: `aria-label="Deal a new board?"` vs the drawn `deal over this puzzle?` (pinned by GameGallery.vue `:219`/`:328` in the pass-4 record; live at `web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue:601` and `:609`), against the estate's own one-string principle (`GameControlPanel.vue:281` — "the visible tape and the announced name are one string"). The eyebrow question is in its **third** pass, now on glass.
2. **The idle-gate uniform-sign disclosure stands as an adjudicator watch-row with n=5 printed** (`RESULTS` §7; −0.43..−1.18 fps in-session, uniform sign across five scenarios, inside the ±2.5 law).

### What the pass-5 non-author audit must re-verify (registry `:186-191`)
The four numbers pass 4 corrects, **as printed in the lanes' pass-5 dossiers** — flake rate **6/11 · 5/11**; the **21** pre-settle; **310** e2e insertions; **90.58 / 89.98** overflow — plus: the pair-branch floor gate **born-RED**; the `:432` row **red-then-green on both harnesses**; the same-game-dirty row **born-RED**; **F3's trigger-(b) number on a fresh build**; and the standing checklist (stale tables, gates that cannot fail, undisclosed deletions, unbanked evidence) **against pass-5 diffs only**.

---

## 2 · THE BLOCKING ROW — F3-G1, trigger (b)

**Status: OPEN, third consecutive pass. The only blocking row in the entire loop.**
*Evidence: `pass4-registry.md:96-99`, `:173-175`; `pass4/critique-F3.md:86-94`, `:213-214`; `pass4/F3-report.md:250-251`; `pass4/measure/RESULTS.md:94-116`; raw `pass4/logs/F3/covis-p4{base,head}.log`, `out-covis-p4{base,head}-chromium.json`.*

**What trigger (b) is.** Pass 1 banked F3 with two re-entry triggers; **(b) = "the owner's 'ALL mobile
interfaces' mark survives pass 2 uncured"** (`pass1-registry.md:84-85`). It fired at pass 2
(`pass2-registry.md:163-165`) and F3 re-entered as the CARRIER — not a competing family, it carries
the winner's grammar (`pass2-registry.md:128-129`). On re-entry the charter's **first line** is
trigger (b) (`charter-f3.md`, mark coverage 3 = the core).

**The pageVh numbers, exactly.** The metric is total document height in viewport units at the
worst-case phone cell, `390×664`:

| pass | pageVh at 390×664 | movement bought |
|---|---|---|
| pass-2 close (best stack) | 1.632–1.665 viewports at the 1,072px case | — (`pass2-registry.md:165`) |
| P1 seal → pass-3 head | **1.800 → 1.705** | 0.045 of the 0.705-viewport gap (`RESULTS.md:101`) |
| pass-4 base → pass-4 head | **1.705 → 1.705** | **zero** (`pass4/F3-report.md:172`; `logs/F3/covis-p4base.log:3`) |

Both arms read `pageVh 1.705` on the **same md5-identical artifact**; MEASURE §3 prints the same
sentence the lane does — *"the whole stack is still 1.705 viewports at 390×664, and is still not
claimable."* Supporting cells at head, from the same run: `390×844` 1.341 · `375×812` 1.401 ·
`430×932` 1.258 · `820×1180` 1.212 · **`844×390` landscape 2.882** · `1280×800` 1.012 ·
`1440×900` 1.000 · `390×844`-fine NEG-CTRL 1.177. Band = 21/22px and **in flow** at every portrait
cell, both trees. Co-visibility at 390×664 needs 531.98 of 664 (board-top→first chip) and reads
**YES**; the open number is the *whole stack*, not co-visibility.

**Lane C's uncashed T′ collapse — what it is.** T′ is a pass-1 **declared deviation** in Lane C's
prototype, banked and never cashed into the tree: *"the two template branches collapse into one"* —
`GameControlPanel.vue` today carries a **full mobile tree AND a full desktop tree**; under T′,
`mobile` alone drives the grid class, `OptionSelector :mobile`, the hover-washi presence, and the
legend. Worth **≈−155 lines**; it widens the diff surface (+550/−437) and is flagged a golden-risk
item (`pass1/f2-proto/MANIFEST.md:141-149`). Pass 1 also ruled it **portable to any family** — "pure
parsimony, any family can take it" (`pass1/f2-critique.md:418`). Every subsequent pass names it as
the remaining lever and none has spent it: `pass2/lane-c-report.md:285`; `pass3/lane-c-report.md:179`;
`pass3/laneB-report.md:272`; `pass3/f3-carrier-report.md:223`, `:309`; `pass4/BC-report.md:329`
("~half of `GameControlPanel`'s +178 is the well markup written twice… remains the named closure");
`pass4/F3-report.md:251`.

**What "cashed" means, per the record.** The T′ collapse is **banked** — designed, LOC-priced,
prototyped in pass 1 — but **uncashed**: it has never landed in the tree, so its −155 lines have
never been subtracted from the live stack. To *cash* it is to land the single-branch template on
MAIN and re-measure the stack; the registry's alternative disposal is explicit and equal —
**"the covis target formally re-scoped by the ADJUDICATOR (not the lane) with the owner's mark
quoted"** (`pass4-registry.md:173-175`). Either the lever is spent and the number moves, or the
target itself is re-cut by someone who is not the measuring lane.

**Routing (unchanged into pass 5).** "G1 is the family's blocking row and is **not the lane's to
close alone** (Lane C's T′). It must stay the charter's first line into pass 5."
(`pass4/critique-F3.md:213-214`.) F3 posts no clean pass while it is open; the 100% clock does not
start (§5).

**Deploy-note disclosure that rides with the recommended cut**: *"trigger (b) remains unbought —
this cut ships pass 4's cures, not the ALL-mobile claim"* (`pass4-registry.md:215`).

---

## 3 · MARKS 3 / 5 / 6

Owner's words are quoted verbatim from
`~/.claude/projects/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/memory/design-refinement-marks-2026-07-31.md`
(line cited per mark). Marks 1, 2, 4 are out of scope for this section and tracked elsewhere in the
registries; **mark 4 is the standing engineering constraint, charged where found, never a lane**
(`pass2-registry.md:180-182`).

### MARK 3 — ALL mobile interfaces
**Owner (marks memo `:15`):** *"**ALL mobile interfaces** — the whole mobile surface, wholesale."*

**Current best cure design (per the registries).** F3 as CARRIER: the sheet substrate carries Lane
B's ticket grammar and Lane C's wells **as content** — reveal-order doctrine stays dead, content
order is the ticket's; it consumes its own four banked assets (`--vv-height` anchor, channel split,
`run()`-per-release, `drawerGlide ≡ vaul`); the keypad band is **296px MEASURED**, not the 336 pass 1
assumed; **no new sheet motion ships until the ~280ms drawer-open stall is attributed**
(`pass2-registry.md:166-173`). Landed against it in pass 4: the sub-1280 tally restore (one ref
replacing two languages, gated both directions, born-RED on base, probe taught to intersect clipping
ancestors, non-author-reproduced at seven widths); the landscape rung priced on a five-rung ladder
and shipped at `100dvh − 1.5rem` → **40.22px cell = portrait parity**, byte-identical both engines;
the 44px question answered as a **geometric impossibility** at 844×390 (a 9×9 at 44px is a 400px
board in a 390px viewport; `100dvh` itself lands 42.88); all five charter assets disposed **in the
tree** (`pass4/F3-report.md:1-120`, `:20-30`).

**What remains unbought.**
- **The number itself: pageVh 1.705, zero movement in pass 4** — §2 above. This is mark 3's whole claim and it is not claimable.
- **Landscape**: the board overflows the fold by **90.58 / 89.98px** against a 98.58px masthead; the named cure is the masthead, not a cap; the shipped source comment still says 88.58; the election is unratified and has **no on-device cell anywhere in the pass** (`pass4-registry.md:100-104`, `:110-112`).
- **The keypad band**: **CHARACTERIZED, not closed** — no OS keyboard has ever risen against any tree (`pass4-registry.md:105-109`).
- **No on-device cell in the F3 lane at all** — two headless engines agreeing to 0.00px is geometry (`pass4/F3-report.md:268-270`).

### MARK 5 — the controls-drawer CONTENT composition
**Owner (marks memo `:17`):** *"the controls-drawer CONTENT composition (second screenshot, drawer
panel) — **'this ui is not good'**: the Deal icon is oddly SMALL (a tiny ~24px glyph floating over
dead space, label beneath, orphaned between the difficulty list and the divider); the entire CHECK
area is 'contrived and not naturally integrated' — the drawer reads as stacked section headers
(MARKS/CHECK in display caps) with bare option lists, bolted-on rather than composed; hierarchy,
affordance weight, and spatial rhythm all off."*

**Current best cure design (per the registries).** The merged Lane BC line: the **ticket** (card
overflow 448–486 → 0 at every viewport both engines; **6 eyebrows → 2 wells + washi**; Deal dominant
at **1.52–1.54×** by measured rendered ink with a control that fails loudly on the shipped card at
0.07×; heading chimera ended in the card for zero bytes, device-confirmed) plus C's zone grammar
(`HandDrawnOutline :pose="0"` + persistent washi as the free compartment primitive, tier 2, zero
enrolment; `anchor="tag"` so the visible tape IS the accessible name) — `pass2-registry.md:59-72`,
`:94-107`. Pass 4 paid the price row structurally, twice: **payment 1** — a binary is a pair, not a
stack (`options.length === 2`, the data's own rule; 95.19 → **44.00** at 1280-coarse, each half
**78.96 × 44**; the phone has always drawn it this way, the rail was the outlier); **payment 2** —
the divider stops doubling a margin it does not own (**−16.00px**). Total **67.19** against the
64.8px bill; iPad card **1067.86 / 1067.83, 30.39 under the 1098.25 seal bar**
(`pass4/BC-report.md:26-58`). Alternatives were measured and **rejected on arithmetic, not skipped**:
row-packing the triples (max-content 204/240/288/192 against a 165.11px rail), gap 0.45→0.40rem
(7.2px of the 36.80 owed), rail widening (`cell-light` is a committed golden).

**What remains unbought.**
- **The pair floor is not gated where the branch exists** — ceiling-only; a collapsed pair reads GREENER (§1, BC-1).
- **The pen verdict**: `TeacherPen`/`PencilObject` demoted from decision to open question in pass 1; Check-as-red-pen was the owner's sorest point and its rendering was re-chartered with a typographic fallback competing against a redrawn pen (`pass1-registry.md:48-51`). The pen branch's disposal (M2 blind read or deletion) never ran — it folds into the **M4 + M2 blind reads** owner row (§4 row 1).
- **The settle is REFUSED, not impossible** — a conditional refusal that names its own expiry: if the ~200–360ms glide block is ever cured, the ≤120ms interior choreography becomes affordable (`pass4/BC-report.md:322-326`). Mark 2's interior-life coverage rides on it.
- **22 pre-existing mixed-face strings**, both subset faces, LEDGERED and gated but **not cured** — the cure is a woff2 re-cut whose byte cost **the owner declined once (P1-W3)**; owner row, not a lane row (`pass4/BC-report.md:315-317`). Independent of, and additive to, the marks memo's own **fraunces-subset cmap missing `m` and `n`** finding (memo `:24`: "thermo"/"kenken" fall through to Georgia mid-word — cure: re-derive the subset over all five labels).
- **The rail is still a 1067.86px column in a 608px window at the iPad** — under the seal and still a long scroll; nothing in the stage argues the rail's total height down. **The named closure is C's uncashed T′ collapse** — the same lever as §2 (`pass4/BC-report.md:328-331`).

### MARK 6 — the mobile solve-status band
**Owner (marks memo `:18`):** *"**mobile interface still sucks and this area takes up far too much
space — think of this from first principles.**"* — a ~100px star, "solved it!", "0 backtracks — 1ms",
a `difficulty` tally row: a standing **~350px slab** (CompletionVignette + DifficultyTally region)
between the keypad strip and the controls card, on the surface where vertical space is scarcest. The
memo's own **first-principles read**, which the loop adopted: *"solve-status is an EVENT, not a
REGION — the celebration already crests on the board itself (the `sequence` subscribers); the stats
are per-solve curiosity (margin-note/toast tier); the tally is board metadata (ticket/margin tier).
The band should dissolve — its content event-izes onto the board or folds into the ticket — and the
space returns to board + controls co-visibility."* Routing was pre-declared: *"strengthens the F3
carrier charter (mark 3) and joins Lane B's ticket as content, NOT a new standing surface."*

**Current best cure design (per the registries) — the most-converged of the three.** The band
**dissolved to one reserved line**: **51 → 21px** (52 → 22 on the larger cells), **in flow**, at every
portrait cell on both trees, now **carrying the tally on that line rather than collapsing**; the
tally's home reads `control-panel` (the ticket) on head against `board-margin` on the seal, at every
cell (`RESULTS.md:99-116`; `pass4/F3-report.md:180-183`). The grade **crests on the board — the
celebration never moves the page** (gated: `e2e/board-covisibility.spec.ts:98`, describe *"mark 6 —
the band dissolves"*; siblings at `:55` the tally files with the deal, `:78` the strip below the board
is one reserved line). Pass 4 restored the sub-1280 tally line that pass 3 had deleted undisclosed
(pass-3 F4: rendered NOWHERE below 1280 — `vignette-meta display:none` in base rule + MarginNote
`sr-only` on the gold path), with **1 paint at seven widths on both engines, 0 on the tree it shipped
broken**, plus an unclipped-plant control (`pass3-registry.md:127-129`, `:202`).

**What remains unbought.**
- **"The band dissolves" overstates 51→21** — a **permanent 21px strip** remains; the honest statement is the pass-3 minor F9 (`pass3-registry.md:137`), and the 21/22px line is what pass 4 ships.
- **`TallyDescriptor.expand` is consumer-less** with **5 unit rows still testing it** — disposition owed (§1, F3-5).
- **`dt-name`**: the retirement removes the only VISIBLE route to the hardest-step name (`:hover`/`:focus-visible`/`:focus-within` all deleted; the stated replacement is an `aria-label`, not a visible surface; no alternative weighed in the open) — adjudicator row with alternatives priced (§1, F3-5).
- **The space the band returned did not move the stack** — pageVh is unchanged at 1.705 (§2). Mark 6 bought its own row back; it did **not** buy mark 3.
- **The tally's dead tab stop survives into the audit tree** — see §6, collision C4.

---

## 4 · ADJUDICATOR + OWNER / TEAM-LEAD ROWS, WITH RANKS

Verbatim ranks from `pass4-registry.md` §5 (`:245-271`). Rank 1 is the registry's own ordering, not
a re-ranking by this file.

| rank | row | owner | state / evidence |
|---:|---|---|---|
| **1** | **M4 + M2 blind reads** — ≥4 uninstructed cold readers | OWNER | **FOURTH** pass carrying it; now the adjudication residue's sole human leg and A7's standing block. *"The single highest-leverage owner action in the campaign."* Artifacts staged since pass 3, now including MEASURE's **117-shot matrix**. `:247-250` |
| **2** | **Landscape eye on glass / sim rotation** | OWNER | **THIRD** pass; the cap CHANGED underneath it (**25.11 → 40.22**) and the election that changed it awaits ratification (F3-G2). Blocks the landscape row's closure, **not the cut**. `:251-253` |
| **3** | **Keypad rig row** | OWNER | F3's "CLOSED" **downgraded to CHARACTERIZED** by pass 4 (G3): no OS keyboard has ever risen against any tree; `installFakeVisualViewport` only. Unchanged in substance since pass 2. `:253-255` |
| **4** | **E8 device smoke** | OWNER | Standing since the T4 close; still **blocks the iOS claim** on the P1 line. `:256` |
| **5** | **2 dependabot highs** | OWNER | Booked at the P1 seal; untouched by passes 3 and 4. `:257` |
| **6** | **`logo-light` darwin re-baseline — RATIFICATION owed** | TEAM LEAD | Executed by Lane D against the registry's words (D-M3). Evidence is the campaign's strongest: **6/6 across two trees**, diff-reviewed scoped re-mint, **11/11 after**, MEASURE **8/8**, `golden:bytes` PASS. Ratify or revert `64fa37a4`'s baseline byte. **The registry recommends RATIFY**, with the process breach already booked as D-M3 — *"the same act may not be cited as precedent for lane-executed re-baselines."* `:258-263` |
| **7** | **`lint:ink` in CI** | TEAM LEAD | The step **LANDED** (Lane D) but is **parse-verified only**; `RESULTS` §10's "closed" is ahead of the evidence. **Open until one runner execution banks a run id.** `:264-265` |
| **8** | **`toggle-crest-dark` flake** | TEAM LEAD | Three rates, one host, one day: MEASURE **0/8** · D **5/11 corrected** · F3 **5/14** with a no-op arm at **3/14** → load/session-sensitive, which is what the sun-crest clause says. **NO re-baseline on any of these rates.** `:266-268` |
| **9a** | **Adjudicator, new: the guard's two names** | ADJUDICATOR | `alertdialog` label vs drawn heading — the estate's own one-string principle, **one rank up**. Goes up **together with 9b** (same class, same rank). `:269-271`, `:182-183` |
| **9b** | **Adjudicator: the eyebrow two-register question** | ADJUDICATOR | **Third** pass; now on glass. `:270-271` |
| **9c** | **Adjudicator watch-row: idle uniform-sign** | ADJUDICATOR | `RESULTS` §7, **n=5 printed**; −0.43..−1.18 fps in-session, uniform sign, inside the ±2.5 law — watch-row, not a blocker. `:271`, `:211-213` |
| **R** | **ADJUDICATION RESIDUE — ≥1024 drawer-vs-strip everyday-deal home** | ADJUDICATOR + OWNER | **OPEN, narrowed to its last two legs.** Analytic arm RUN and holds (D's blast §2.5: **no drawer below 1024**, `#controls-drawer` is `v-if="rowRegime"`, so the residue is strictly a ≥1024 question). Device arm: **3 of 4** transactions on glass; the FOURTH — everyday re-deal through the drawer at a ≥1024-coarse cell — needs an iPad-class device or the sim at 1280-coarse, one session. Blind-read arm **OWNER-BLOCKED** (= rank 1). Standing ruling unchallenged: **everyday re-deal lives in the drawer at ≥1024; the picker owns the cross-game switch.** Nothing here may be cited as having CLOSED the residue. `:220-241` |

---

## 5 · THE LOOP'S LAWS

*Evidence: `pass4-registry.md:7-9`, `:134-151`, `:195-216`; `pass3-registry.md:149-157`, `:229-251`; `pass2-registry.md:241-262`; `~/.claude/.../memory/convergent-design-loop.md` (binding on all design work).*

### 5.1 Clean-pass definition
- **Convergence law (standing):** earned 100% = **zero gaps + a fresh non-author audit + two consecutive clean passes, ≥3 passes total**.
- **Pass 4's clean bar, as ruled:** *"zero blocking gaps **AND** zero new gaps."*
- **Gaps are ENUMERATED, never averaged.** A lane's percentage is context, not a verdict. **Blocking gaps alone decide routing.**
- **NO FAMILY POSTED A CLEAN PASS IN PASS 4** — D: 0 blocking but 3 new majors. BC: 0 blocking, 3 new majors. A: 0 blocking, 1 new major + new minors (**the closest**). F3: **1 blocking** (G1) — *"the only lane still carrying a blocking row."*

### 5.2 The 100% clock
- **The clock does not start.** Earliest possible 100% is now **pass 6** — pass 5 clean + pass 6 clean-confirm with a fresh non-author audit.
- Clock history, for the record: pass 2 said earliest = pass 4; pass 3 said earliest = pass 5; pass 4 says **earliest = pass 6**. Each slip is one lane's blocking row.
- **The line the loop did cross:** pass 3 carried **11 blocking rows across five lanes**; pass 4 carries **ONE**, and the deploy gate cleared.

### 5.3 Deploy-gate rows — pass3-registry §5's gate, ruled verbatim row by row at the pass-4 close

| gate row | verdict | evidence |
|---|---|---|
| iPad coarse card ≤ 1098.25 | **PASS** | 1067.86 / 1067.83, **−30.39** under the bar, `regimeOk` in every cell (`RESULTS` §0/§2) |
| A1 ribbon closed with its failing e2e cell | **PASS** | born-RED at `:318` reproduced by MEASURE (1 failed / 16 passed → 17/17 restored); fires on glass, not on pristine (`RESULTS` §5) |
| `d4e8e41e` boot path attributed on JavaScriptCore | **PASS** | THIS build on iOS 19 MobileSafari: booted · 81 cells · dealt · errors `[]` · 2009 ms, trap ahead of the module script (`RESULTS` §6) |
| tally line restored or ruled | **PASS** | 1 paint at seven widths both engines, 0 on the tree it shipped broken, unclipped-plant control (`RESULTS` §4) |
| landscape rung priced or reverted | **PASS (priced)** | 40.22px = portrait parity; cost re-measured 90.58 / 89.98 overflow. The **ELECTION** goes to the team lead per F3-G2 — a governance row, not a gate failure |
| deploy ONLY via `npm run deploy`, owner-authorized | **HELD BY DESIGN** | the execution row; nothing deployed, production untouched at CF deployment `f1adfca5` |
| (standing mandate) the seal must not regress | **PASS w/ disclosure** | every geometry cell at or under the seal; three sim gates hold; uniform-sign −0.43..−1.18 fps in-session disclosed (`RESULTS` §7) |

**Ruling: every measurable row PASSES; THE CUT IS RECOMMENDED** — `52ef014a`, artifact
`index-6v9S84SRo2al.js` (md5 `dc6424524ce09d0cc9e4865c561beeac`), estate green at HEAD (**vue-tsc 0 ·
vitest 332/31 · e2e 115/115 dev · built-dist 17/17 · goldens 4/4 × 8 · `golden:bytes` PASS**).
**Execution stays the TEAM LEAD's, only via `npm run deploy`, owner-authorized** per the standing trap
ledger (npx-packument-OOM). **Three disclosures ride with the cut, in the deploy note:** (1) the idle
sim gate clears by **0.04 fps** with a uniform in-session sign across five scenarios — inside the
±2.5 law, watch-row, not a blocker; (2) the landscape fold overflow **~90px at 844×390** is the priced
cost of board-fits — the election awaits team-lead ratification and an eye on glass (owner row 2);
(3) **trigger (b) remains unbought** — this cut ships pass 4's cures, **not the ALL-mobile claim**.
The open gaps are dossier/gate defects, not product regressions; **none touches a gate row**.

### 5.4 MEASURE discipline (the non-author standard, binding on every T5 design wave)
1. **Single tree, by construction.** Every lane figure and every MEASURE figure must sit on ONE artifact, proven by **md5**, not by timestamp narration. Pass 3's named offense (§3.3 figures predating the dist by 5m52s) is cured this way; pass 4's `dist-head` ≡ `dist-F3head` is the pattern.
2. **MEASURE wins.** Where a lane's banked number disagrees with the evidence of record, **MEASURE wins and the disagreement becomes a gap row** (`pass3-registry.md:6-8`).
3. **An unbanked gate does not exist.** Every gate and rig run banked to disk with the AUDIT prepend; pass 3's B2/C4 offense is the precedent (zero Lane-B and zero Lane-C logs on disk).
4. **Born-RED, re-run rather than quoted.** Negative controls that have been *shown able to fail* (GATE-1 pattern: the negative control is the build patched back to the exact prior defect). A grep-only row is **NOT A GATE**.
5. **Regime observables before a figure is banked** — `regimeOk` from three independent observables; device arms carry them too.
6. **Rig-state traps get banked for the next taker** (pass 4's: census **+2** with a reused origin).
7. **Numbers are re-derived at citation**, not recited (the working-directive rule; D-M1 and BC-M3 are its two pass-4 violations).
8. **Evidence set of record** = `pass4/measure/RESULTS.md` + `pass4/measure-report.md`; the DEPLOY-GATE table is walked **row by row on the final artifact**.

---

## 6 · COLLISIONS — audit r1 × design-loop open rows

Both r1 audits sit at `71456713`, **7 commits after** the loop's `52ef014a` and on the same line
(§0), so each row below is a genuine two-owner collision, not a stale read. Every collision is named,
merged, and assigned to the T5 wave that should own the merged row. Wave names follow the lane
lineage the loop already uses (D = ink/contrast estate; BC = cadence+zone drawer; A = gallery/staging;
F3 = mobile carrier), which is the sequential integration order the pass-2 registry and blast map set:
**D → C → B → A → F3**.

### C1 · The guard speaks with two names AND speaks to nobody
- **a11y r1 H2** (high): `GameGallery.vue:596-603` — `role="alertdialog"` with `aria-label` only; live probe shows `activeInsideDialog:false`, `ariaModal:null`, `describedby:null`, the polite `.gallery-live` region silent about the ribbon. **A blind player's second Enter is the confirm — work is destroyed without the warning ever having been said aloud.** (`audit/r1/a11y.md:32-47`)
- **Design loop**: the **guard's two names** row — NEW ADJUDICATOR ROW at pass 4, ranked **9a**, sent up **together with the eyebrow question**: `aria-label="Deal a new board?"` (live at `GameGallery.vue:601`) vs the drawn `deal over this puzzle?` (`:609`), against the estate's own one-string principle (`GameControlPanel.vue:281`). (`pass4-registry.md:86-87`, `:182-183`)
- **Merged row**: *one guard surface, one string, and the string must actually reach AT.* The loop's row fixes **which** words; H2 fixes **whether they are spoken**. Fixing either alone leaves a guard that is still wrong. Bind `aria-describedby` onto `.guard-note-text` / move focus / add `aria-modal` **and** collapse the two strings in the same change, so the announced name and the drawn name are provably the same token.
- **Owner: the A wave (gallery/staging).** It owns `GameGallery.vue`, it owns the ribbon born-RED (`gallery-deal.spec.ts:318`), and the pass-4 record already pins the row to Lane A's file. The adjudicator still rules on **which** of the two strings survives (rank 9a) — the wave implements the ruling and adds the AT bridge regardless of which string wins.

### C2 · The picker is inert to AT while the picker owns the cross-game switch
- **a11y r1 H3** (high): `GameCard.vue:229-236` — `:inert="!isActive || undefined"` removes the four flanks from the a11y tree, so Chrome publishes a **one-item listbox** (`GALLERY {"listbox":1,"option":1}`; options `["sudoku, 1 of 5"]`). Operable via arrows, **not browsable**; UNKNOWN under VoiceOver (`a11y.md:49-62`, `:230`).
- **Design loop**: the **picker/deal family** — the standing adjudication ruling is *"the picker owns the cross-game switch"* (`pass2-registry.md:144-145`; unchallenged at pass 4, `pass4-registry.md:237-239`); the inert-at-rest **soul gate** (one boiling card, `pose 0` flanks + `inert`) is a charter constraint of F4/Lane A (`round0-portfolio.md`, F4 charter; `pass1-registry.md:94-96` — "the listbox break is staging hoisted OUT of `role=option`"); pass-4 minor **A15 gallery filtered population** is carried and disclosed; `aria-activedescendant`/StagingBand-outside-listbox are on the VERIFIED-CLEAN ledger (`a11y.md:225`).
- **Merged row**: the inert-flank rule is a **perf/soul constraint (mark 4 + the pose census) and an a11y defect at the same time** — they are the same declaration. The merged row prices the two together: does the deck stay a five-option listbox to AT while the flanks stay pose-frozen and unfiltered? Neither the census nor the a11y sweep can answer alone.
- **Owner: the A wave (gallery/staging)**, with a **mark-4 filter-census cell** required in the same change (the pass-2 gate re-cut: rendered filter census, zero new surfaces, union area ≤ 0, injected-node control must fire — `pass2-registry.md:213-218`). If un-inerting the flanks moves the census, the row escalates to the adjudicator, not to the wave.

### C3 · `K` peek — the shortcut, the separator, and the keypad band are one surface
- **a11y r1 M4** (medium): `useAnswerKeyPeek.ts:55-70` — window-level `keydown`, no `metaKey`/`ctrlKey`/`altKey` guard, `preventDefault()` at `:66`, so **Ctrl+K / Cmd+K are swallowed** and flash the answer key (`CTRL_K {"laminate":true,...}`). `k`,`g`,`h`,`p`,`d` are single-character shortcuts with no off switch and no remap; `k` is scoped to nothing (the `.board-cells` exemption was deliberately removed at `:61-65`) — a plain **WCAG 2.1.4 (Level A)** failure. Two handlers in the estate got it right: `App.vue:438-447` (`g`) and `GameGallery.vue:482` (`d`). (`a11y.md:66-78`)
- **a11y r1 L14** (low, same surface): `GameControlPanel.vue:496-505` (+ rail twin `:727-740`) — `role="separator"` carrying pointer-only gestures and a **100-character `aria-label`** advertising "press and hold, or press K, to peek at the answer key" (verified live in-tree at `GameControlPanel.vue:499`). The affordance and the mechanism are on different elements. (`a11y.md:181-185`)
- **Design loop, keypad rows**: BC's **B7** cured the bare `.peek-hold-surface` by **naming it for AT** — that name is exactly L14's paragraph (commit `6316ac53`, `pass4/BC-report.md` header table; ordered at `pass3-registry.md:170-172`). F3 owns the **296px keypad band** (rank-3 owner row, **CHARACTERIZED not closed**) and the **peek-slop recognizer + receipt** (pass-3 earned deliverables, `pass3-registry.md:119-120`). F3's minor also retires **`dt-name`**, replacing a visible route with *an `aria-label`, not a visible surface* — the same substitution class L14 flags.
- **Merged row**: the peek is currently **three half-owned pieces** — a global unguarded key handler (M4), a separator that announces an interaction it cannot receive (L14), and a keypad-band geometry row that has never met a real OS keyboard (F3-G3). The merged row is *one peek affordance, one accessible name, one guarded key*: add the modifier/editable-target guard to `useAnswerKeyPeek.ts` copying `App.vue:438-447` verbatim, give the peek a real focusable control or drop the separator's claim, and shorten the name to the one string the estate's own principle requires — **and re-run the keypad-band cell against it**, since both live in the same 296px strip.
- **Owner: the F3 wave (mobile carrier)** for the merged row — it holds the keypad band, the peek-slop recognizer, and the `dt-name` visible-route question, and the geometry cell must be re-taken with whatever control lands. **BC co-signs the accessible-name half** (it authored the current string under B7); the `dt-name` alternatives-priced question stays an **adjudicator** row (rank 9-class), not a wave decision.

### C4 · The drawer/mobile band vs the five-game twin estate
- **component-census r1**: `GameControlPanel.vue` is the sole importer of **11 modules** — `CheckStatus.vue`, `DifficultyTally.vue`, `useButtonAnimation.ts`, `BoilDivider.vue`, `KeyboardLegend.vue`, `SheetWashiLabel.vue`, and 7 of 8 icons; `GameBoard.vue` is the sole importer of **5** including `CompletionVignette.vue` (`component-census.md:76-81`). **77 of 189 modules (41%) have exactly one non-test importer** (`:74`). The regime split is confirmed as **two live arms, not a pinned flag**: `GameScene.vue:93` / `:113` pass `:mobile="true"` / `:mobile="false"` on the same named slot, read at `GameControlPanel.vue:91` and `showTabs` at `:128` (`:481-483`). Against it, the twin estate: **≈1,970 of 3,395 non-base code lines (58%) are neutralized-identical** across the five games (`:2.6`); `ThermoGame.vue`↔`KillerGame.vue` = **2 code-diff-lines** at 119 LOC each; `ControlPanel/` holds only `constants.ts` and **no `ControlPanel.vue` exists anywhere in the tree** — a 3-of-5 folder convention named after a component that does not live in it (`:3.7`, `:334`); `difficultyOptions` is **byte-identical** in all three `constants.ts` (`:230`).
- **Design loop**: **C's uncashed T′ collapse** — the same `GameControlPanel.vue` carrying a full mobile tree AND a full desktop tree, ≈−155 lines, banked at pass 1 and never cashed (`pass1/f2-proto/MANIFEST.md:141-149`); named as the closure for both the rail's total height (`pass4/BC-report.md:328-331`) and **trigger (b)** (`pass4/F3-report.md:251`; `pass4-registry.md:173`). Also colliding: pass-4 **BC-M2** — the rendered font census is "one game, one viewport, one regime" and the ledger can never red; the census's 58%-twin finding is the exact reason a one-game census cannot generalize. And **`TallyDescriptor.expand` consumer-less with 5 unit rows** (F3-5) plus **a11y L12's dead tab stop on `DifficultyTally.vue:196-202`** (`role="img"` + `tabindex="0"`, the reveal it existed for retired at pass 4, the `tabindex` stayed — `a11y.md:167-173`) are the same component's residue from the same retirement.
- **Merged row**: the census supplies the **denominator** the loop's parsimony ledger has been asserting without one. T′ is not merely a −155-line tidy: it is the **one branch collapse inside the file that owns 11 fan-out-1 modules and both regime arms**, and it is simultaneously (a) the named lever for the loop's only blocking row, (b) the named lever for the iPad rail's height, (c) the precondition for widening BC's census past one regime, and (d) the file where L12/`TallyDescriptor` residue lives. The merged row is **one collapse, priced against the census's real numbers, with the twin-estate rows kept OUT of it** — the five-game 58% duplication is a *separate* T5 parsimony row and must not be smuggled into the design lane's LOC ledger (pass-1's standing rule: the 419-LOC wrapper deletion "is NOT F4's to claim", `pass1-registry.md:107-109`).
- **Owner: the BC wave (cadence + zone / drawer)** owns cashing T′ and the residue cleanup (L12 tabindex, `TallyDescriptor.expand`), because it owns `GameControlPanel.vue` and the ticket grammar. **The F3 wave is the beneficiary and the measurer**, not the author — it re-runs `covis` on the collapsed tree and reports the pageVh delta against §2's 1.705. The **five-game twin estate (58%, `ControlPanel/` residue, byte-identical `difficultyOptions`) is NOT a design-lane row** — it belongs to a T5 parsimony/consolidation wave and is listed here only so no design wave claims its LOC.

### Collision hygiene
- a11y r1 rows with **no** design-loop counterpart (H1 `role="grid"` with no `row` layer; M5 double-announced digits; M6 93 unnamed graphics; M7 unnamed drawer region; M8 `Size` tab 41.2px; M9 `<h2>` in `<button>`; L10/L11/L13/L15) are **not collisions** — they are pure a11y-wave rows. Two are worth flagging to the design waves as *adjacent*, not merged: **M8** is a 44px-floor row on `.mobile-heading-btn`, the same floor family as BC-1's `.options-pair` gate; **M7** names the drawer region the F3 carrier will re-home. Neither is claimed here.
- **UNKNOWN, carried forward**: H3 under VoiceOver (`a11y.md:230`); whether Tailwind emits the 15 unreferenced `@theme` tokens into `dist/` (`component-census.md:562`); the runtime cost of the dead `subgridSize`/`cornerMarks`/`centerMarks` prop bindings (`:566-568`).

---

## 7 · WHAT A T5 DESIGN WAVE MAY NOT ASSUME

1. **Trigger (b) is not bought.** No wave may cite pass 4 as having cured the ALL-mobile mark; the deploy note says so in the loop's own words (§2, §5.3).
2. **The residue is not closed.** No pass-4 evidence may be cited as having CLOSED the ≥1024 drawer-vs-strip residue, and none supports re-opening the strip (§4 row R).
3. **No re-baseline on the `toggle-crest-dark` rates** (§4 row 8), and **the `logo-light` re-baseline may not be cited as precedent** for lane-executed re-baselines (§4 row 6).
4. **Deploy is the team lead's**, only via `npm run deploy`, owner-authorized per the standing trap ledger (§5.3).
5. **Gaps are enumerated, never averaged**; a percentage is a position report, never a settlement (§5.1).

ROW-COMPLETE
