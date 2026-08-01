# CRITIQUE A — non-author adversarial audit of pass-4 STAGE A (Lane A / F4)

Auditor is not an author of Lane A. Read-only: `git status --porcelain` empty before and after,
tree at `52ef014a`, nothing written outside this file.

Audited: `pass4/A-report.md`; the five commits `236d22fe → 2708716e → 94ce993e → c6eda619 →
3969f512` **as diffs**, not as narration; every log under `pass4/logs/A/` (26 files, all present);
the rigs at `pass4/rigA/`; `pass4/shots-A/` (36, counted); `pass4/measure/RESULTS.md` §1, §5, §9;
and, where a charge crosses lanes, `pass4/F3-report.md` §7–8 and the built artifact at
`pass4/measure/dist-head/assets/`.

The bar is **pass3-registry §2's five numbered Lane-A work orders**, with §1's A2–A15 beside them.

**Convergence: 88%** — an honest closed fraction of the lane's own order, up from 70%.
**Zero blocking · two major · eight minor.** All five numbered rows close with banked, born-RED
evidence, and the pass's one live data-loss hazard is cured and independently reproduced by a
non-author. The clean-pass clock still does not start, and the reason is the law's second clause,
not its first: the registry's condition is *clears the blocking rows **with zero new gaps***, and
this lane opened two majors — one of them a gate that only works on one of the estate's two
harnesses, already observed red by another lane and mis-diagnosed as a timing artifact by MEASURE.

---

## 1 · ORDER-BY-ORDER CLOSURE

| # | order (pass3-registry §2, Lane A) | verdict | closed |
|---|---|---|---|
| 1 | `attemptDeal` gains the dirty-mounted arm + an e2e cell that reds without it | **CLOSED** — cure is one line, subsumption argued at the site, born-RED `gate1-C1` reds `gallery-deal.spec.ts:314` alone (1 failed / 16 passed), restore 17/17, **re-run by MEASURE** and confirmed on real MobileSafari. Docked for the ungated subsumption (§3.2) and the two names on the ribbon (§4.7) | 0.90 |
| 2 | same-game deal handled for real at the `dealStaged`-false site + one same-game e2e row | **CLOSED, one row defective** — the false comment is dead, the branch's reachability is argued from the code and it is right; two rows shipped, and the BRIDGE row (`:412`) is sound everywhere. The deferred row (`:432`) is dev-server-only and known-red under preview (§3.1) | 0.70 |
| 3 | verb ink measured with the inkmass instrument, or struck in the open | **CLOSED — measured**, 12 cells, two engines, two themes, and the gate FAILS 4/4 in the `flat` arm, so it falsifies. Docked for the derivation slip in the sentence that does the arguing (§4.1) and for a fine-only regime on a mobile campaign (§4.2) | 0.85 |
| 4 | same-id `setGame` no-op adjudicated either way, ruling written | **CLOSED — KEPT**, argued at `App.vue:122`, and it is not only prose: `gate1-C5` reds the bridge row the moment a same-game deal routes off the bridge | 1.00 |
| 5 | census made hover-aware, or the registry-§4 grep pre-filter restored beside it | **CLOSED — hover-aware, in the shipped spec, both regimes**, born-RED **at source** (pass-2's rule re-authored in `OptionSelector.vue`, rebuilt: `button.ctrl-btn → +1` in both regimes, G3.1/3.2/3.3 green), resident injected control, stability precondition. MEASURE reads it green on the built dist. A15's population half stays open, disclosed | 0.95 |

`(0.90 + 0.70 + 0.85 + 1.00 + 0.95) / 5 = 0.880` → **88%**. No blocking row, so no round-down.

**§1's minors, disposed:** A2 restated honestly (the pass-3 claim *was* false when made; the
re-mint is Lane D's, and this lane re-baselined nothing — `gates-goldens.log` 4 passed +
`[golden-bytes] PASS`). A8 ✓ (the interface now says VALUE half and names the `initial.source`
clause it does not carry). A9 ✓ (8 on sudoku, 9 on futoshiki, both asserted). A10 ✓ with a scope
caveat (§4.5). A11 ✓ — verified in tree, `filter-census.spec.ts:153` is a real scanline union,
not a sum. A12/A13 **struck in the open** with reasons. A14 ✓ with its own control. A7 owner row,
third pass. A15 part-open, routed.

---

## 2 · BLOCKING

**None.** A1 — the pass's one live data-loss hazard — is closed, gated, and its RED reproduced by
a non-author who restored the pass-3 shape and re-ran the whole spec (`RESULTS.md` §5). The deploy
gate's A1 row reads PASS on glass: the ribbon fires on a dirty board, does not fire on a pristine
one, and confirming deals through.

---

## 3 · MAJOR

### A-M1 · The deferred-arm row works on the dev server and nowhere else — the hold is a no-op against a built artifact

`e2e/gallery-deal.spec.ts:432`, the row that closes order 2's harder half:

```ts
await page.route(/FutoshikiGame\.vue/, async (route) => { await held; await route.continue(); });
```

That regex can only ever match the **dev server's** module URL. The built artifact names the chunk
`FutoshikiGame-BR8c6IjeRjCp.js` (verified in `pass4/measure/dist-head/assets/`), so against any
preview or built-dist base URL the route never matches, the hold never applies, and the row
degrades to exactly the race it was written to replace. Two consequences, and both have already
happened:

- **It reds.** F3 ran the default suite at a vite preview and banked **114/115**, failing at
  `:432` on `.futoshiki-cell` **count 25 where 0 is demanded** — the "still resolving" precondition
  cannot hold when the chunk is a pre-built file. F3 reproduced it on the base tree through the
  same preview and routed it as "Lane A's row" (`F3-report.md` §7, §8.4). Correct destination,
  no diagnosis.
- **It can pass while asserting nothing.** `toHaveCount(0)` resolves immediately against a
  currently-empty DOM. If the unheld chunk lands after that read and before the click, the row
  goes green having exercised the *mounted* path — the vacuous-pass class, on the one row whose
  entire purpose is the unmounted path.

MEASURE saw the other half (dev server, 3/3 green) and wrote it off: *"a preview-timing artifact
of the lazy-chunk hold, not a tree defect"* (§1), and asked the registry to un-route the row. That
is the narrower statement, not the truer one. The defect is in the gate, it is in Lane A's file,
and it is one token wide — the hold must key on the module the harness actually serves (a
`**/*FutoshikiGame*` glob, or an inline `<script>`-level stall), and the precondition must be an
assertion the hold's success implies rather than a count that is trivially zero.

Both the report (§3, *"held deterministically, not raced"*) and the commit body (*"exercised
deterministically rather than raced"*) state a property that is true on one harness of two. CI is
not at risk today — `playwright.config.ts` boots `npm run dev` and CI runs bare `npx playwright
test` — which is why this is major and not blocking. It is still a lane's own gate that another
lane could not run.

### A-M2 · The subsumption is asserted, not gated — a one-token narrowing keeps 17/17 green and re-opens the loss

The cure's load-bearing sentence, in the report and in the code comment: the second arm

```ts
(props.dirty === true && props.currentId != null)
```

*"SUBSUMES pass 3's same-id fallback (`dirty && card.id === currentId`)"*. The subsumption is the
whole argument for deleting the fallback — and **no row exercises the case the fallback covered**.
Walk the seventeen: the two ribbon rows deal cross-game (`dirtySudoku` → `stepTo('kenken')`), the
source-arm control deals cross-game from a pristine board, the bridge row deals same-game from a
pristine board, the deferred row deals into nothing. A **dirty board + a same-game deal** — the
everyday re-deal the adjudication residue is about — is nowhere in the file.

So re-narrow the arm to `props.dirty === true && card.id !== props.currentId` and every one of the
seventeen stays green while the guard stops firing on the same-game deal: the first arm is false
(same-game targets are the mounted board's own ledger row, cleanly re-dealt), the second is now
false, and a dirty board unmounts silently. That is the pre-Wave-D asymmetry, re-openable by an
edit that reads like a tidy-up, on the lane's headline safety, in the pass whose blocking row was
that exact class of hole.

One row closes it: dirty sudoku → picker → `.staging-deal` on the *sudoku* card → ribbon visible,
sub-line `your marks aren't saved`. It is four lines and it uses helpers the file already has.

---

## 4 · MINOR

1. **The 85% is derived from the wrong denominator.** §4: *"hiding the die costs 113.77 CSS px² of
   770.53 — 14.8% … Pass 2's border-weight distinction … is ~85% of the measured ink difference."*
   113.77/770.53 is the die's share of the deal verb's **total** mass; `100 − 14.8` is therefore
   not a share of the **difference**. The difference is 770.53 − 333.74 = 436.79, of which the die
   is 113.77 = **26%**. The claim survives only through the arm the sentence does not cite: `flat`
   puts border+tint at 656.76 − 278.60 = 378.16 = **86.6%** of the gap (the text term is negative —
   "deal" is 4 glyphs against "start"'s 5). Right ballpark, invalid derivation, inside the sentence
   that rehabilitates a pass-2 decision.
2. **The ink instrument never leaves the fine regime.** `rigA/verb-ink.mjs` pins 1280×900, DPR2,
   default pointer — no coarse, no `hover:none`, no phone cell — on a campaign whose trigger is
   Safari/iOS and whose charter names ALL mobile interfaces. The rank claim is measured where the
   owner did not complain.
3. **`attrib-font-census-BASE-x3.log` is not bankable as written.** 369 bytes, three bare `1 failed`
   blocks, no tree stamp, no pass count, no timestamp — while every other log in the lane carries
   the AUDIT prepend (`gates-FINAL-static.log` opens `### TREE 3969f512 — clean: 0 files dirty`).
   The claim it supports — *"verified against the base tree with this lane's work stashed, 3/3
   deterministic"* — is not checkable from the artifact. The finding itself is almost certainly
   right; the evidence is the one unhardened log in the set.
4. **The e2e sub-ledger overstates by 8 while the total is exact.** §10 prints `e2e/ +318 / −8
   (… gallery-deal +189 …)`. `git diff --numstat 347826be..3969f512` reads gallery-deal **181/8**
   and e2e **310/8** — 189 is `--stat`'s churn column (181+8) read as insertions. The grand total
   `+392 / −27` is right (82+310, 19+8), so the block contradicts itself; *"318 of them gate"* is
   310. `src/ +82 / −19` reconciles to the byte.
5. **The band's `d` is broader than both the attribute and the gate.** `aria-keyshortcuts="d"`
   still sits on `.staging-deal` (`StagingBand.vue:146`), the handler sits on the band **root**
   (`@keydown` on `.staging-band`), and the new assertion presses `d` only on `.staging-deal`.
   Delivered scope is band-wide — a `d` on a difficulty chip deals — which is defensible and is
   what nobody wrote down or pinned. Pass 3's defect was a dead shortcut; the cure over-shoots it
   with no row for the intended radius.
6. **`ribbon-geom` is the lane's one instrument with no falsifying arm.** 36 cells, real journeys,
   honest raw — and no control: nothing forces a string long enough to prove the rig can *see* an
   overflow or a wrap. Every other instrument this lane shipped carries one (C1–C6, the injected
   `:hover` rule, the `flat` arm). Report also quotes chromium's `320×115.31` as the rect "at every
   width"; webkit reads 115.27. Per-engine identity holds, the printed constant does not.
7. **The guard now carries two names, and this lane's rows pin both.** `RESULTS.md` §9: the ribbon
   is `role="alertdialog"` with `aria-label="Deal a new board?"` while the drawn heading reads
   `deal over this puzzle?`. `gallery-deal.spec.ts:219` asserts the first and `:328` the second, so
   the divergence is now gated in place — in the same pass stage BC spent a gate one rank down on
   *"the accessible name and the drawn one are one string"*. Not a defect; an adjudicator row that
   arrived from MEASURE and is absent from A-report §8.
8. **Carried open, correctly disclosed** — A7's M4 blind read (owner, third pass; the ink
   measurement is the instrument leg, not a substitute) and A15's gallery population (17, measured,
   not allowlisted; the hover class is gated, the exact-match count is not).

**Precision note, not a gap.** §3's *"`dealStaged` returns `false` for exactly one reason — no
scene has mounted yet"* is one case short: `clearStagingSource` can null the source at unmount, so
`false` also says "the scene that was there is gone". The consumer analysis is unaffected — the
next mount's `consumeHandoff` takes the arm either way — but the rewritten comment's whole virtue
is that it is exact.

---

## 5 · THE NAMED PASS-3 OFFENCES, CHECKED

| offence | finding |
|---|---|
| stale tables | **clean.** §10's estate block reproduces from `gates-FINAL-*.log` line for line (vue-tsc 0 · vitest 332/31 · e2e default 110 · built-dist 16 · goldens 4 + bytes PASS); 110 = BC's 105 + the 5 rows this lane added, counted in the spec; built-dist 16 = filter-census 6 + wordmark 6 + theme-bake 4, counted in the log. No figure predates its build. |
| gates that cannot fail | **two, both named**: `ribbon-geom` has no falsifying arm (§4.6), and `:432` can pass vacuously off the dev server (§3.1). Everything else falsifies on disk — six born-REDs, each reding its own row and nothing else, verified line-number by line-number against the spec. |
| undisclosed deletions | **clean.** Eight files touched, all eight in §11's commit table; the deleted same-id fallback, the deleted comment and the rewritten 8-stop block are each argued in the open. |
| surface-name bookkeeping | **clean.** The census names the regime it measures and says which one `filterBudget.ts` does not cover; the ink rows name the selectors; no cost is booked against a surface it was not spent on. |
| arithmetic | one slip, §4.4 — sub-ledger 318 vs actual 310. Totals and every gate count reconcile. |

---

## 6 · WHAT IS GENUINELY EARNED

1. **Six born-REDs, one per claim, each banked and each surgical.** C1 reds `:314` alone (1/16),
   C2 `:338`, C3 `:253`, C4 `:432`, C5 `:412`, C6 both G3.5 rows **while G3.1/3.2/3.3 stay green**.
   I checked all six logs against the spec's line numbers; every one says what the report says.
2. **The headline cure was re-run by a non-author and confirmed on glass.** MEASURE restored the
   pass-3 shape itself rather than quoting the lane, got the same single red, and drove three
   transactions through real MobileSafari at 393×699 — control silent, row armed, same-game riding
   the bridge with the scene stamp intact.
3. **C6 is born-red AT SOURCE, not in the harness** — pass-2's `@media (hover:hover)` rule
   re-authored verbatim in `OptionSelector.vue` and the dist rebuilt. That is the strongest form of
   this evidence and it is rarer in the loop than it should be.
4. **The hover census is the right cure and knows why.** Pointer moved with `mouse.move` because
   `locator.hover()` scrolls the population being measured; the assertion is a **count**, because
   `url(#wobble-heart)` is resident and a value comparison would have missed the exact defect; a
   stability precondition ahead of it; an injected control that must fire and then must clear.
   And the picker regime is censused for the first time in the campaign.
5. **The ink instrument was made to falsify.** The first control didn't, so a second was written
   that FAILS 4/4 — the lane wrote the arm that could embarrass it.
6. **A cross-lane instrument defect found and disclosed**: `inkmass.mjs` accumulates signed
   `paper − pixel`, so **every dark-theme ink figure taken in passes 2–3 is 0 by construction**.
   Named, cured in this rig, and routed to the instrument's owner rather than quietly patched.
7. **An inherited red found, diagnosed and attributed rather than absorbed** (§9): BC's font census
   reads `FilterTuner`'s DEV-only badge; skipped by subtree with the reasoning at the site.
8. **Two rulings written where the code is, and one of them gated.** The `setGame` no-op is kept
   with an argument that survives the pass that wrote it, and C5 makes the bridge claim falsifiable.

---

## 7 · WHAT PASS 5 MUST CLOSE FOR LANE A TO POST ITS CLEAN PASS

1. **A-M1** — re-key the deferred row's hold to the module the harness serves and make its
   precondition an assertion the hold implies; then run the spec against **both** a dev server and
   a preview and bank both. Correct the two "deterministic, not raced" claims to their true scope.
2. **A-M2** — one row: dirty board + same-game deal → ribbon. Then re-run the C1 control with the
   arm narrowed to `card.id !== currentId` and bank the red, which is the proof the subsumption
   claim actually needed.
3. Fix the 85% derivation (§4.1) and the e2e sub-ledger (§4.4) — two sentences.
4. Take one coarse cell with the ink instrument, or scope the rank claim to the fine regime in
   writing.
5. Re-bank `attrib-font-census-BASE-x3.log` with the AUDIT prepend the rest of the lane's logs
   carry, or drop the "3/3 on the base tree" wording to what the file shows.
6. Give `ribbon-geom` a long-string arm, or say plainly that it is a measurement and not a gate.
7. Carry A7 and A15 forward unchanged; put the guard's two names (§4.7) in front of the
   adjudicator with MEASURE's crop.
