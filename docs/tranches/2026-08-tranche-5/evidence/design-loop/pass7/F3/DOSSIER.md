# PASS-7 · LANE F3 — the five LAND orders, and the chair's eyebrow ruling

Host darwin 25.4.0 · node v26.0.0 · npm 11.12.1 · vite 8.1.4 · @playwright/test 1.61.1.
Tip at open: **`4b28f034`** ("T5-W4 PASS 6 SEALED"), working tree clean at the first build.
No git state changed by this lane. Ports **4237 / 4238** only, killed and verified dead at close;
`:3000` is foreign (pid 48206, the same squatter the pass-6 audit named) and was never served,
never touched. Goldens: `git status --porcelain e2e/goldens/` **empty** — nothing minted,
nothing re-baselined.

**Headline: order (1) returns a NEGATIVE result. The artifact hash did not survive the
comment-only restamp, and the reason is a mechanism the estate has not written down.**

---

## 1 · ORDER (1) — THE ARTIFACT HASH, RE-DERIVED ON THE SEALED TREE

The registry said the restamp was "comments only, so the artifact hash should survive it — and
must be re-derived, not assumed." It was re-derived. **It did not survive.**

```
pass-6 audit's artifact   assets/index-Cwxgaa3tBBf6.js   md5 920d107124c343e87452c4f23b0a62ad
SEALED TREE 4b28f034      assets/index-CzaSyutELAvX.js   md5 0929dfe4b88a5fb7e9ddb408031ed33a
                          assets/index-BFsVDjb1AEzk.css  md5 b1aa666a176c9bae1976e3cd631edcfd
                          39-file manifest (md5 over sorted per-file md5s)
                                                         5db4dd271a1c1bd0ef9846945cfdad22
```

### The instrument was proved before the finding was believed

A hash that differs proves nothing until the rig is shown to reproduce the reference. Two
controls, both run before any conclusion:

| control | expected | measured |
|---|---|---|
| BASE `abe533c4`, clean, `git archive` | audit's `index-BNMQu01IbxTY.js` `eee2d245c9d813a42507c456d4473484` | **byte-identical** |
| LAND's banked `dist-head.tar.gz` | its own `.md5`, and entry `920d1071…` | **verifies; entry `920d1071…` confirmed** |

So the toolchain here is the audit's toolchain, and the audit's number is real. The sealed tree
genuinely builds a different bundle.

### Born-RED ablation — one term, in a scratch copy

`git archive 4b28f034` into a scratch tree, revert **only** `GameBoard.vue` to its `abe533c4`
text (the L6-G1 restamp is that file's entire delta at the seal: +8/−7, all comment), rebuild:

```
ABLATED   assets/index-Cwxgaa3tBBf6.js   md5 920d107124c343e87452c4f23b0a62ad   ← the audit's, exactly
          assets/index-C80OgcLmoEAG.css  md5 1e578fcf01db5d2172bc6ce4db7b5801   ← the audit's, exactly
```

**The comment is the sole cause.** MAIN was never touched; the scratch component was restored and
md5-checked against MAIN after every probe.

### The mechanism, named

`@vitejs/plugin-vue` derives an SFC's `data-v-` scoped id from a hash over the component's
**source text, comments included**. `GameBoard.vue` has `<style scoped>` (:851), so editing its
comment block moved **`data-v-4aa1e43d` → `data-v-c560b2b2`** — one id of 32, confirmed by
diffing the scoped-id sets out of both CSS bundles (32 ids each side, exactly one swapped). The
id is 8 hex characters either way, so **both bundles are byte-for-byte the same length**
(CSS 77,161 = 77,161; JS 223,349 = 223,349) and only the content hash betrays the change.

Blast radius, measured rather than assumed — normalizing the scoped id and the cascaded
filenames, then comparing the two dists as multisets:

```
39 vs 39 files · 21 byte-identical · 12 equal after normalization · 0 real content differences
→ the two dists are IDENTICAL modulo {GameBoard's scoped id, the filenames that cascade off it}
```

but **17 of 39 assets change filename**, because the entry chunk carries the lazy chunks' names
in its own import map (`m.f=["assets/AnswerKeyLaminate-…js", …]`), so a rename cascades.
`e2e/board-covisibility.spec.ts` is not bundled at all (grep count 0 in the entry), so **its**
restamp is genuinely bundle-neutral; `GameBoard.vue`'s is not.

> **NEW GAP P7F3-G1 (class, not instance).** "Comments don't change bundles" is false for every
> SFC in this estate carrying `<style scoped>`, and the estate has a deploy gate that reasons
> about artifact identity. Any comment-only restamp of such a file renames a majority of the
> assets. The rule this wants: **an SFC comment edit is an artifact change — re-derive the hash,
> never assert neutrality** — and it belongs in `PRECEPTS.md` beside the golden discipline.

---

## 2 · ORDER (2) — THE `docGrowth` FLOOR, RE-CUT FROM MEASUREMENT (L6-G4)

Site: `e2e/board-covisibility.spec.ts`, the grade row's CONTROL arm. Pass 6 set `> 0` and wrote
*"measured 41 on this build, both engines, against 109 of real push."*

**Re-derived at the row's own context** (`test.use(COARSE)` = 390×664, hasTouch, isMobile) on the
sealed dist, 6 cold reps per engine — `rig/docgrowth2.mjs`, `logs/docgrowth-COARSE.log`:

| | pass 6 said | measured at head |
|---|---|---|
| control `docGrowth` | 41, "both engines" | **61 chromium · 60 webkit** — engine-SPLIT |
| control `ctrlPush` | 109 | **123.53** both engines |
| green arm | — | `docGrowth` 0 and `ctrlPush` 0, every rep |

Reps are exact (61×6, 60×6, 123.53×12): a layout constant, not a sample. **Neither pass-6 number
reproduces, at either engine.**

**Pass 6 also named the wrong mechanism**, and the replacement is measured (`rig/absorber.mjs`):
the doc is *already* exactly one viewport at rest (`scrollHeight` 664 ≡ `innerHeight`, slack
**0**), so there is no doc slack to absorb anything. What absorbs is the fold column's own
headroom — `#fold-tools` rests with its bottom at 601.16, **62.84 px above the viewport floor**,
and the scene box stays 664 throughout. The push travels 123.53; the first 62.84 merely spends
the headroom; only 123.53 − 62.84 = **60.69** reaches `scrollHeight`. That is the 61/60.

**FLOOR = half the measured minimum, rounded down → `> 30`.** Same discipline as the sibling
assertion in the same block (`ctrlPush > 50` against a measured 123.53), applied to a quantity
two-thirds the size. Landed with the derivation, the superseded figures, and the mechanism
correction written at the site.

**Born-RED, measured not asserted** (`rig/bornred.mjs`, `logs/docgrowth-BORN-RED.log`): forcing
`.completion-vignette { height: 80px }` (drawn 89.46, push 80) drops the control to **docGrowth
17 on both engines** — the new floor REDS, the pass-6 `> 0` floor still PASSES. That gap is the
discriminating power the re-cut recovers.

> One honest limit, disclosed: the floor is derived at the ONE cell this row runs at. Probing the
> other portrait cells (`rig/docgrowth.mjs`) shows the control's `docGrowth` reads **0** at
> 390×844, 375×812 and 430×932 — the headroom there swallows the whole push. The row does not run
> at those cells, so nothing is red; but the quantity is cell-specific and must not be lifted to
> another cell without re-measuring.

---

## 3 · ORDER (3) — THE LOC LEDGER, ONE BASIS PER COLUMN (L6-G2)

Basis: `git diff --numstat abe533c4 4b28f034` — the pass-6 landing **as sealed**. Every changed
file appears in **exactly one** column; the columns partition the diff and the total is the whole
diff. Evidence files are split by `--name-status` (`A` = new bank, `M` = a prior pass's record
restamped), which is what stops a restamped pass-4 report from being counted as pass-6 output.

| column | files | + | − |
|---|---:|---:|---:|
| src (non-test) | 11 | 685 | 217 |
| colocated tests | 3 | 100 | 41 |
| e2e specs | 7 | 415 | 79 |
| repo docs | 2 | 6 | 3 |
| repo scripts | 1 | 344 | 10 |
| prior-pass records restamped | 3 | 46 | 0 |
| pass-6 evidence bank (new) | 144 | 17,023 | 0 |
| **TOTAL — every changed file, once** | **171** | **18,619** | **350** |

*Restamped at the pass-7 seal (P7X-G5): the TOTAL above counts TEXT files only — `git diff --numstat` prints `-` for a binary, so a summed count silently drops them (the swallowed-stream class, caught by the audit inside the ledger built to stop an undercount). The diff holds **187 files = 171 text + 16 binary** (14 shots + 2 `.tar.gz` under `pass6/land/`); the +18,619/−350 line totals are exact and carry no binary lines by construction.*

Reconciliation to the pass-6 audit's own re-derivation, which was taken on the *uncommitted*
tree and so is one restamp short in two columns:

- src non-test: audit **+677/−210 (10)** → seal **+685/−217 (11)**; delta = `GameBoard.vue`
  **+8/−7**, the L6-G1 restamp, which also makes it the 11th file. ✔
- colocated tests: **+100/−41 (3)** both. ✔
- e2e: audit **+406/−75 (7)** → seal **+415/−79 (7)**; delta = `board-covisibility.spec.ts`
  **+9/−4**, the L6-G1 restamp. ✔
- docs+scripts: audit **+373/−10 across 5**. At the seal the same material is 6 files
  (`README.md` +3/−3 is the extra) totalling **+396/−13**. The residue does **not** reconcile and
  I will not invent a cause for it.

> **NEW GAP P7F3-G4.** That residue is unreconcilable *in principle*: the audit measured an
> uncommitted working tree that no longer exists, so its figure can never be re-derived by
> anyone. This is X6-G1's direct cost, arriving one pass later exactly as predicted — an unsealed
> pass does not merely lack a SHA, it makes its own numbers permanently unauditable.

---

## 4 · ORDER (4) — THE dt-NAME SHOT, BANKED (L6-G3)

The pass-6 LAND report cited `shots/case-390x664-AFTER-*.png`; those files were never banked.
**The shot now exists**, taken on the sealed dist at the cited cell, both engines
(`rig/dtname.mjs`):

```
shots/case-390x664-AFTER-chromium.png            shots/case-390x664-dtname-crop-chromium.png
shots/case-390x664-AFTER-webkit.png              shots/case-390x664-dtname-crop-webkit.png
logs/dtname-strings.json                         ← the strings, recorded beside the pixels
```

Both engines read identically, and reproduce the pass-6 audit's independent observation:

```
margin line       a fresh 9×9 — needs a naked single
tally aria-label  difficulty — needs a naked single (1 of 5)
"singles only" present anywhere in the rendered page:  false   (GRADE_PHRASE is gone)
```

The pass-6 report quoted a **hidden**-single tally. That is not a discrepancy to reconcile — **the
deal is random per load and the technique tracks it**, so no single phrase can be quoted as
though fixed. The LAND report is restamped to correct both the citation and the quoting habit,
and to state the claim the row actually makes: margin line and tally name **the same exact step
as each other**, from one vocabulary, whatever the deal.

---

## 5 · ORDER (5) — THE APOTHEOSIS'S SUPERSEDED EXPECTATIONS (L6-G5)

Restamped in place, correction grammar, nothing erased — the expectation stays visible and the
measured truth sits under it. Re-derived on the sealed tree, both engines
(`rig/openstate.mjs`, `logs/openstate-case.log`):

| quantity | §6/§9 expected | MEASURED at head |
|---|---|---|
| sheet top | ≈184 | **216** both engines |
| interior scroll | ≤55 | **79** both engines |
| grid left visible, open | ~52 px | **83.78 c / 84.38 w** — 23.1% / 23.3% of the board |
| board rect across the gesture | unmoved | **unmoved** — `{14, 132.22, 362, 362}`, webkit `y 131.63` |

Two of the three move in the design's favour. **The interior-scroll row does not** — it exceeds
the spec's bound, and it is a correction rather than a happy surprise. Its box is now named,
because this is the estate's three-numbers-one-quantity class again: the scroll does **not** live
on `.drawer-case` (`overflow-y: visible`; its `scrollHeight − clientHeight` reads a meaningless
**4**) but on **`.controls-card`**, the sheet's one `overflow-y: auto` descendant —
`527 − 448 = 79`, identical on both engines and stable across 8 cold loads
(`logs/interior-scroll-reps.log`).

> **NEW GAP P7F3-G3.** The pass-6 audit's fold census published **55** for this quantity and 55
> reproduces at **neither** referent. It is withdrawn rather than explained — no box I can find
> yields it. U-10 binds throughout: §9's risk 1 stays OPEN on the owner's eye; this restamp moves
> a number, not a disposition.

---

## 6 · THE CHAIR'S EYEBROW RULING — X6-G2, MEASURED FIRST THEN IMPLEMENTED

**Measurement, before any edit.** At head the drawer's surviving eyebrows are **two per game**
(`Size`/`Board Size`, `Difficulty`), **ten across the five specs**. Their drawn string is
`{{ section.heading }}`. Their announced name came from `:aria-label="section.ariaLabel"` — an
**optional second literal** on `ControlSection`, bound at **three** sites (the mobile tab, the
desktop staged rail, the single-section heading).

**No game ever supplied one.** All ten sections across `sudoku`, `futoshiki`, `thermo`, `killer`
and `kenken` pass `heading` alone, so the attribute never rendered and the accessible name
already fell back to the drawn text. Casing is already CSS and only CSS —
`.section-heading { text-transform: lowercase }` (`assets/typography.css`) — so the eyebrow draws
"size" while DOM text and accessible name both stay the authored "Size", which is exactly the
shape the ruling prescribes.

So the eyebrows were **one-string in fact and two-string by construction**. The ruling says the AT
name IS the drawn ink and casing is CSS, *never a second literal* — a latent optional second name
is a drift vector whether or not anyone has driven it. Implemented as a deletion, not a comment:

- `ControlSection.ariaLabel?: string` — **deleted**, with the ruling and the measurement written
  at the field it replaces.
- the three `:aria-label="section.ariaLabel"` bindings — **deleted**. Verified: exactly 3 lines,
  template otherwise untouched.
- the unit fixture's own `ariaLabel: "Size"` — deleted, and the row that asserted the two-string
  surface (`SECTIONS.map(s => "ariaLabel" in s ? …)`) retired with it. That row had been
  *blessing* the seam.

**Unit rows, the guardTitle pattern** (`GameGallery.a11y.test.ts` — "the accessible name IS the
drawn heading, character for character"), three added, in `GameControlPanel.test.ts`: the mobile
tabs, the desktop staged rail, and the single-section heading. Each asserts, per eyebrow,
`announced === drawn` where `announced = aria-label ?? text()`, plus `aria-label` absent outright.
The comparison is deliberately case-SENSITIVE, which is what makes "casing is CSS" enforceable.

**Born-RED, in a scratch tree, MAIN never touched** (component restored and md5-verified equal to
MAIN afterwards):

| ablation | result |
|---|---|
| a divergent second literal returns (`aria-label="Grid size"`) | **RED** — `expected 'Grid size' to be 'Size'` |
| a **casing-only** second literal (`:aria-label="section.heading.toLowerCase()"`) | **RED** — `expected 'size' to be 'Size'` |
| green arm (MAIN's two files, unablated) | 20/20 pass |

The second ablation is the one that matters: it is the exact shape the ruling forbids, and it
would have passed any assertion written case-insensitively.

**Verdict: the ruling is IMPLEMENTED, and it closed on more than measurement.** Had the
measurement alone been banked ("already one string, ruling closes"), the optional field and its
three bindings would have survived as a silent re-entry path.

---

## 7 · GATES, ON THE TREE THIS LANE LEAVES

`vue-tsc -b --force` exit 0 · `vitest` **448/448, 41 files** (445 at the pass-6 audit, **+3** =
the eyebrow rows) · full default e2e **279/279, zero red** (scope mirrored from
`playwright.config.ts`'s own `testIgnore`; `logs/e2e-full-sweep.log`) · fence-adjacent sweep
(covis + drawer + zone-grammar + a11y + font-census) **86/86** · `lint` exit 0 · `lint:boundary`,
`lint:knip`, `lint:ink`, `lint:catch`, `lint:tdz`, `test:e2e:projects`, `test:e2e:retries` all
exit 0 · goldens porcelain **empty**.

Two gate notes, both mine and both disclosed:

1. **My files initially FAILED `lint`** — under lane D's newly-landed scope
   (`prettier --check … src/ scripts/ ../../scripts/`, which landed in MAIN mid-lane). Caught by
   running the gate rather than assuming it, formatted, re-green. My files are now the only ones
   the gate touches that pass; the 4 remaining `eslint` errors in the repo are in lane D's new
   untracked `web/frontend/scripts/dist-identity.mjs`, not this fence.
2. **My first scratch Playwright config over-collected** — it omitted `testIgnore`, pulled in four
   other configs' specs, and reported **10 false reds** including four `visual-golden` rows. No
   golden was re-baselined (porcelain empty, verified). The config now mirrors the real one
   verbatim and is banked at `rig/playwright.pass7f3.config.ts`.

> **NEW GAP P7F3-G5.** An ad-hoc Playwright config is a born-wrong instrument by default: the
> estate's scope lives in one `testIgnore` and any lane rig that does not copy it will red the
> goldens and invite exactly the re-baseline the π law forbids. Cheap cure, and it already exists
> for ports: a lane rig must derive scope from the real config, never restate it.

---

## 8 · THE SHARED-TREE HAZARD — the finding I did not go looking for

Building the sealed tree a **second** time, from `git archive 4b28f034` (immune to the working
tree), produced a **different** entry chunk: `index-DuEMtcV6svqM.js` md5 `40604faf…`, while the
CSS matched `b1aa666a…` exactly. Normalized comparison isolates it to exactly one file —
**`animation-vendor`, 11,054 B vs 11,641 B**. The cause, confirmed:

```
sealed package.json pin   "@mkbabb/pencil-boil": "^0.11.0"
MAIN working tree now     "@mkbabb/pencil-boil": "^0.12.0"      (modified, uncommitted)
installed in node_modules  0.12.0
```

Lane BC's **release election landed in MAIN mid-pass**, mutating `package.json`, the lockfile and
the shared `node_modules` between my builds. My first three builds (`dist-seal`, `dist-base`,
`dist-abl`) all predate it — which is *provable*, because two of them reproduce the pass-6
audit's `eee2d245…` and `920d1071…` byte-for-byte. **So §1's answer stands**: `0929dfe4…` is the
sealed tree at 0.11.0, the pin the seal actually carries. Every later build, including the one my
final e2e sweep ran against, carries 0.12.0 and other lanes' edits, and is labelled as such in
its AUDIT prepend.

> **NEW GAP P7F3-G2 — and it is a discipline row, not a slip.** Two builds of the **same SHA**
> disagree because a sibling lane re-pointed a dependency underneath a shared `node_modules`.
> This is D6-G3's hazard promoted from `dist/` to the dependency tree, and it defeats
> cross-lane attribution outright: no lane can claim its diff caused its numbers while another
> lane can move the toolchain under it. Lane D's `dist-identity.mjs` build-identity line is the
> right shape and is **not enough** — the stamp must include the resolved version of every
> `file:`/`^`-pinned runtime dependency, not just the dist. Until it does, concurrent lanes
> sharing one checkout should build from `git archive <sha>` with an isolated `node_modules`, the
> way the pass-6 audit did.

---

## 9 · WHAT THIS LANE DID NOT DO

- **Nothing was closed on the owner's marks.** U-10 binds; marks 3 and 6 remain open on the
  owner's re-look, and §5's restamp moves a figure inside risk 1 without touching its disposition.
- **No golden re-baselined, no golden minted** — porcelain verified empty at close.
- **No git state changed**, no commit, no branch, no stash. The tree is left for the lead.
- **`:3000` was neither served nor killed**, though the foreign squatter (pid 48206) is still
  listening and is now confirmed to have outlived two passes.
- **The pass-6 audit's `55`** is withdrawn, not re-explained; I could not find a box that yields
  it and did not invent one.

## 10 · EVIDENCE MAP

```
pass7/F3/
  DOSSIER.md                          this file
  rig/    docgrowth.mjs docgrowth2.mjs bornred.mjs absorber.mjs openstate.mjs
          interior.mjs interior2.mjs dtname.mjs serve.mjs package.json
          playwright.pass7f3.config.ts        (the scratch PW config, banked at close)
  logs/   docgrowth-COARSE.log docgrowth-BORN-RED.log openstate-case.log
          interior-scroll-reps.log dtname-strings.json e2e-full-sweep.log
          artifact-hashes.log
  shots/  case-390x664-AFTER-{chromium,webkit}.png
          case-390x664-dtname-crop-{chromium,webkit}.png
```

Every log carries an AUDIT prepend naming host, node, the tree, **the dist entry md5 it was
measured against**, and the port. Every number in this dossier was re-derived at citation; none
is recited from the pass-6 record, and where the pass-6 record disagrees it is named and the
disagreement is left standing rather than smoothed.
