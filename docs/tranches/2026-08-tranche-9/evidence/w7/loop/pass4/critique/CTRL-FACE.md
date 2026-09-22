# CTRL-FACE — pass 4 ADVERSARIAL CRITIQUE

**Verdict: ADVANCE at 84%.** Twelve of the thirteen charter rows are closed with numbers I
reproduced on my own ports, in both engines, against the chair's `74a2b5d9` control. It is not
higher because the family's central law — the face law — is still falsifiable BOTH WAYS on the
card's most-repeated string, because the new cross-engine gate passes on a broken tree, because
the `@property` block landed citing a born-RED that does not exist in this tree, and because no
dist was built, so two of the LAWS' own gate rows were not run at all.

Critic's control commit: `74a2b5d9`. Prototype dev `127.0.0.1:4240`; HEAD control served two ways
— `vite preview` over the chair's pre-built dist on `:4242`, **verified by its own asset hash
`index-CubiZsMVSwTc.js`**, and a dev-mode control on `:4241` with a private cacheDir, so the deck
comparison is dev-against-dev and not dev-against-dist. A fourth server on `:4243` carried a
scratch COPY of the tree for the falsifications. **All four killed by recorded PID (99043, 99149,
99244, 7398); 4240–4243 read empty.** The lane's worktree is untouched: my scratch PW config and
`test-results/` are deleted and `git status` there is the 20 product files. Instruments and raw
readings: `critique/CTRL-FACE-probe/`.

---

## 1 · What I re-ran, and what it said

| I re-ran | result |
|---|---|
| the caption census, 4 cells × 2 engines, paired against `74a2b5d9` | **reproduced exactly** — §2.1 |
| the 768×1024 card delta | **reproduced**: +4.06 chromium / +4.00 webkit |
| the two struck tokens, read as computed PAINT | **reproduced**: `--ring-ink` `#3a7bc4` vs `""`; `--motion-whisper` `0s` vs `""`; the head transition `color cubic-bezier(0.4, 0, 0.2, 1)` with duration **0s** against HEAD's `all` |
| `check-face-engine-identity --self-test` on a fresh census | **PASS**, 32.667 vs 32.000 @dpr3 = 0.667px = 2.00 device px, band 3; **5 plants, 5 bite**; 11 of 14 chips carry a mark |
| the e2e estate on this tree | **92 passed / 0 failed** — `face-law` 50, `access`+`zone-grammar`+`font-census` 42, both projects |
| the gate battery, bare | 11/11 exit 0 (`critique/CTRL-FACE-probe/gates.log`) |
| `visual-regression.spec.ts` — **CHANGED this slice and NOT run by the lane** | I ran it: **2 passed**, both engines, at the restamped `SEAL = 1261` |
| the deck's CHIPS, dev vs dev, keyed | **π holds** — §5 |
| the new focus ring, from PAINTED bytes, both themes | **4.29:1 light, 4.29:1 dark** — §3.5 |

---

## 2 · The measured findings

### 2.1 The caption — every number in the README is true

Four cells, both engines, proto against the `74a2b5d9` control (`probe/card-paired.log`):

| cell | proto `marks` used / min-content | proto `what fits` | left spread | right spread | HEAD used |
|---|---|---|---|---|---|
| 320×568 coarse | 87.00 / 87.00 · wk 87.03 / 87.03 | 120.69 / 120.69 · wk 120.72 / 120.72 | **0.00** | 33.69 | **60.00**, both, right edges one at 76.00 |
| 390×844 coarse | 87.00 / 87.00 | 120.69 / 120.69 | **0.00** | 33.69 | 60.00 |
| 768×1024 coarse | 87.00 / 87.00 | 120.69 / 120.69 | **0.00** | 33.69 | 60.00 |
| 1280×800 fine | 87.00 / 87.00 · wk 87.03 | 120.69 / 120.69 · wk 120.72 | **0.00** | 33.69 (wk 33.68) | **268.22 / wk 268.31** |

`flex-basis` reads `auto`, `text-align` reads `start`, `align-self` reads `flex-start`, and the
rail's 268.22 → 87.00 collapse the lane self-reported as gap 3 is real on both engines. The
caption lane's e2e row is honest: (a) used == min-content with a real ablation, (b) the caption
never laps its strip, (c) the strip still holds 95.2px, (d) the two left edges within 0.5. (b),
(c) and (d) can fail on changes a card can actually make. (a) cannot — under `flex: 0 0 auto` +
`nowrap` the used width IS the max-content width by construction, for any word, at any width — so
(a) is a guard on the RULE, not on the card, and its ablation says so. That is acceptable and it
is stated here so the fold does not read (a) as a layout invariant.

### 2.2 THE FACE LAW IS STILL FALSIFIABLE BOTH WAYS — on the chip's word

The pass-3 hole (`.staging-axis-label`) is closed, at the site where it was opened. The CLASS is
not. Both halves of the law take their population from `FACE_SITES`' own keys: the source half
skips any block whose selector carries no listed class (`LISTED` is still built from the keys),
and the rendered half assigns `want` only to elements matching a `FACE_SITES` selector and reads
THAT element's computed family — not the element that owns the text.

`.ctrl-btn` is listed. The word inside it, `span.ctrl-word`, is not — and it is the span the
reader actually sees. On a scratch COPY of this tree I put the one thing the check's own header
promises to red on it:

```
.ctrl-word { font-family: "Comic Sans MS", cursive; ... }
```

- `node scripts/check-font-coverage.mjs` → **exit 0, `font coverage OK`**
- the rendered face law, all three routes → **3 passed**
- and the card really paints it: `4×4 -> "Comic Sans MS", cursive`, `9×9 -> …`, `16×16 -> …`,
  while `.ctrl-btn` still reports `"Patrick Hand", cursive` to the gate.

Every option chip on the card AND on the deck in a literal family string, and the family's own
law prints OK twice. `probe/verify-plant.mjs`, `probe/gates.log`.

The rendered row's negative control has the same shape: the ablation target is hardcoded to the
LAST table entry (`.staging-axis-label`), which renders only on the gallery, so on **both card
routes the ablation is annotated and not asserted**. Two of the three rendered rows ship with no
born-RED at all.

### 2.3 `check-face-engine-identity` PASSES ON A BROKEN TREE

The gate's verdict is about two JSON files and nothing binds them to the tree they describe — no
hash, no mtime, no stamp. On the scratch copy I planted the exact regression its own header says
it exists to catch (`background-size: calc(100% + 0.5rem)` → `6ch`, measured `background-size:
53.76px` against a census that records `paintedMark 32.667 / 32.000`), left the censuses where
they were, and ran it bare:

```
GREEN  both engines reported
GREEN  the word is one width
GREEN  the painted mark is one width
PASS — 0 violation(s), 0 blind check(s)     exit 0
```

`npm run lint:face-engine` is wired beside gates that read the tree, and it will report a card
that no longer exists. Two related facts fell out of running it: the census lives in Playwright's
`test-results/`, which Playwright **wipes at the start of every run** (my `visual-regression` run
destroyed the censuses my `face-law` run had just written — it fails closed, which is right), and
that makes the gate incompatible with the wave's own stall law of chunking Playwright BY PROJECT:
the second chunk erases the first chunk's census. The cure is one field — the census stamps the
files it describes, and the gate reds on a stamp that no longer matches.

### 2.4 THE `@property` BLOCK LANDED CITING A BORN-RED THAT IS NOT IN THIS TREE

`index.css:163` writes clause 4 into the block and names its instrument:

> `e2e/face-law.spec.ts`'s REGISTRATION TOOK / PUBLISHER RAN rows delete the publisher on
> `.controls-card`, which declares these names, and read both halves.

There are no such rows. `grep -rn "REGISTRATION TOOK\|PUBLISHER RAN" e2e/` returns nothing; no
file under `e2e/` mentions `@property` or `initial-value` at all. Fifteen registrations landed —
eight lengths, six rungs, and `--head-rule` at `0px` — and clause 4, the clause that says the
ablation must run on a host that DECLARES the token, has no instrument on this tree. The block's
π was checked by a probe (`registration-pi.log`, and I have no quarrel with its reading), but a
probe is evidence, not a standing gate. This is the same species the pass came to cure: a comment
that names an invariant nothing measures, written into the landed file.

### 2.5 The occlusion gate's baseline has no CEILING

`INHERITED` matches by surface NAME (`div.action-bar`, `::before`, `::after`) and `novel` is
everything else. The fraction is unbounded, so `players` going from 63.04% to 100% by the same
element stays green — which is precisely the direction the paired reading says HEAD already sits
in. One number per allowed name (the control's own reading, plus slack) turns the baseline from
an amnesty into a debt with a bound.

### 2.6 The seal moved to 1261 and the lane did not run it

`visual-regression.spec.ts` carries `SEAL = 1227.5 → 1261` (+33.5) with a new ≥28px caption
ablation. The lane's 92-row e2e estate does not include `visual-regression`, so the gate it
changed went unrun this pass. I ran it: **2 passed, both engines.** Two things still owe the
fold: the chair's §6.1 restamp is **+19.94 / +19.81** and CTRL-TAPE carries it on the same
constant, while this lane's purchase is **+31.25 / +31.28** — one seal, two lanes, two numbers,
and the README's sentence that this is "the same figure" is not supported by either lane's
arithmetic. The +4.06 at 768×1024 is a third number again.

### 2.7 The card's content height moved at every cell and one figure is in the record

`.control-panel-wrap` clientHeight, proto vs `74a2b5d9`: **+25 at 320**, **−14 at 390**, **+4 at
768**, **+31 at 1280 fine**. Only the 768 figure is declared. At 1280 the card's box is 608 on
both trees, so the desk rail's +31 is 31px more scrolling inside a fixed box — a consequence of
the printed rung on the claimed surface, allowed, but unpriced.

---

## 3 · The constraints, one by one

| constraint | verdict |
|---|---|
| **M16 plain copy** | **clear** — `lint:copy` bare exit 0, zero strings minted in the diff |
| **filterBudget 9** | **UNRUN.** No dist was built; the census is pass 3's. Argued from the diff (0 filter lines added), which is an argument, not the reading the LAWS ask for |
| **the goldens / the `-1lh` guard** | **UNRUN**, same reason; the guard `test.skip`s on a tree with no dist |
| **AA both themes, PAINTED, for a stroke** | **clear, and I am the one who measured it** — §3.5 |
| **π on unclaimed surfaces** | **holds where I could reach it**: the deck's chips are dBOX `[0,0,0,0]` on every chip, both engines (§5); the registration's 20 deltas are token TEXT, not paint |
| **the decided history (r0 / R6)** | **untouched.** No law re-worded; L17 cited at the chair's §1.3 wording; the r0 heading-voice instrument still a PROPOSED diff |
| **W2's landed mechanics** | **respected** — sticky tag, dock, bottom tab, tap floor all intact; no new mechanic |
| **the @property law, four clauses** | **1, 2, 3 met; clause 4 has no instrument** (§2.4) |
| **the undefined-token census** | run as MOT-VERB's copy? Not in the record. `--motion-whisper` has 1 consumer and 0 publishers and the lane says so, which is the census's finding arrived at by hand |
| **`?board=` pinning (registry §2.13)** | **not done** — every π instrument pins `size=3&difficulty=EASY`, never the deal |
| **4 crops ≤150 KB, each a replacement** | **met** — 4 crops, 67 KB, each naming the pass-3 crop it retires; f3/f4 do now show `checking` over `what fits` |

### 3.5 The new stroke, from painted bytes — the reading the record does not have

The slice lands `outline: 2px dashed var(--ring-ink)` at two sites and carries no contrast number
for either. I differenced two crops of the same chip (ring on / ring suppressed) at 390×844
coarse, dpr 3, after the ring's own colour settled:

| engine · theme | ring ink | card paper | **ratio** | stroke px |
|---|---|---|---|---|
| chromium · light | `rgb(58,123,196)` | `rgb(253,253,252)` | **4.29:1** | 2331 |
| chromium · dark | `rgb(58,123,196)` | `rgb(19,18,17)` | **4.29:1** | 2320 |
| webkit · light | `rgb(58,123,196)` | `rgb(253,253,252)` | **4.29:1** | 1938 |
| webkit · dark | `rgb(58,123,196)` | `rgb(19,18,17)` | **4.29:1** | 1930 |

**It clears WCAG 1.4.11's 3:1 by 1.29 on both themes.** `--ring-ink` is a single value with no
dark arm (`--color-focus-sketch: #3a7bc4`, one declaration), so both themes get the same ink and
both clear; that is luck rather than design and it is MRK-LIVE's R1 row, not this lane's.

Two things the measurement turned up that the lane owes anyway:

- **On WebKit the chip never reaches `:focus-visible`.** 80 Tab presses at 390×844 and the walk
  never lands on a card chip — a `<button>` is not in that engine's default Tab order. I had to
  force the state to price the stroke. The comment over the rule says "THE KEYBOARD GETS THE SAME
  ANSWER THE POINTER GETS"; on one of the two engines the estate is required to check, the
  keyboard does not get there. There is no e2e row for either ring site.
- **The ring fades in over 150ms under `prefers-reduced-motion: reduce`.** Measured on the chip
  with `reduce` emulated: `transition-duration: 0.15s`, `transition-property` including
  `outline-color`. That is the `transition-colors duration-150` still spelled in
  `OptionSelector.vue`'s template — the exact defect this lane cured on the tab heads, left
  standing in the component it edited in the same diff. So the card now snaps its tab-head ink at
  0ms (§6.5's trade, correctly reported) and tweens its chip ink and its focus ring at 150ms, and
  nothing gates either.

---

## 4 · The gates that cannot fail (registry §2.10 — struck until re-cut)

1. **the face law, both halves**, on any text-bearing element whose classes are not in
   `FACE_SITES` — demonstrated on `.ctrl-word`, which is every chip's visible word (§2.2).
2. **the rendered face law's negative control on the two CARD routes** — the ablation target
   renders only on the gallery, so it is annotated, never asserted (§2.2).
3. **`check-face-engine-identity`** against the tree it is run in — the census carries no stamp
   (§2.3).

Struck from the count. Everything else I planted against bit: the caption ablation, the five
engine-identity plants, the nine `check-support-floor` plants, the occlusion plant, the seal's two
negative controls.

---

## 5 · Strengths — what should survive the fold

- **The lane's own accounting of its instruments.** Three of four new gates were born unable to
  fail, each was caught by RUNNING it, and all three are named in the README with the plant that
  now reds them. The `rgb(255, 0, 0)`-read-as-transparent incident, the `fixed`-plant-inside-a-
  transform incident and the `test.info().attach()` incident are each a trap worth the wave's
  ledger. This is the most honest incident list in the pass.
- **The shared component was edited and the deck still does not move.** `OptionSelector.vue`
  gained a `.ctrl-word` span and moved 6px of padding off the button onto it. I measured the deck
  independently, dev against dev, keyed by tag+class+text: **every chip's button box is
  `[0,0,0,0]`** on both engines, and the mark's content-box origin agrees within 0.019px because
  `background-origin: content-box` puts it in the same place from either host. The claim is true
  and the evidence for the CHIPS did not exist until this file — the lane's gallery-π instrument
  measured tapes and tooltips.
- **Gate (i) written as the cross-engine gate it always claimed to be**, with the band split and
  each half carrying its reason in the unit it belongs in (device px, not CSS px). The instrument
  is right even though its input is unstamped.
- **The ordered `FACE_SITES` table** (last match wins), with the override written down as an
  override rather than hiding behind the rule it beats.
- **The occlusion gate found a real inherited defect on its first run and reported it paired
  against the control instead of allowlisting it quietly.**
- **`CSS_UNIT_FLOORS` scanned off `src/`** — 4 units where the hand list carried 1, with a RED for
  a modern unit that has no floor row.

---

## 6 · Open gaps — each a sentence someone can close

1. The face law's POPULATION is still `FACE_SITES`' own keys: put `font-family: "Comic Sans MS",
   cursive` on `.ctrl-word` and `check-font-coverage` exits 0 and all three rendered rows pass
   while every chip on the card and the deck paints it. Read the family on the element that owns
   the TEXT (the deepest text-bearing descendant), or census every rendered `font-family` in
   `src/` against the law rather than the nine the table lists.
2. The rendered face law's ablation target is the table's LAST entry, which renders only on the
   gallery, so the two card routes carry no negative control; pick a target present on the route.
3. `check-face-engine-identity` passes on a broken tree: with the mark re-priced to `6ch`
   (`background-size: 53.76px`) against a census recording `paintedMark 32.667 / 32.000` it prints
   `PASS — 0 violation(s)` and exits 0. Stamp the census with the files it describes and red on a
   mismatch.
4. The census lives in Playwright's `test-results/`, which every Playwright run wipes, so the gate
   cannot survive the wave's own "chunk playwright by project" rule; write it outside the run's
   output dir.
5. `index.css:163` cites `e2e/face-law.spec.ts`'s REGISTRATION TOOK / PUBLISHER RAN rows and
   neither row exists in this tree — clause 4 of the @property law has no instrument for fifteen
   registrations. Write the two rows, on `.controls-card`, which declares the names.
6. The occlusion baseline is allowed by NAME with no ceiling, so `players` worsening from 63.04%
   to 100% by `div.action-bar::before` stays green; give each allowed name the control's own
   measured fraction plus slack.
7. **NO DIST WAS BUILT.** The filterBudget census, the goldens and the `-1lh` build guard are pass
   3's runs; the LAWS require the dist built in the worktree and served for them. Build and run
   the three.
8. `visual-regression.spec.ts` was CHANGED (`SEAL 1227.5 → 1261`) and not run by the lane. I ran
   it and it passes; it belongs in the lane's own battery.
9. The seal now carries three different deltas for one restamp — the chair's §6.1 **+19.94 /
   +19.81** (CTRL-TAPE's too), this lane's **+31.25 / +31.28** at 1280 coarse, and **+4.06 /
   +4.00** at 768×1024. Say in one sentence which number the fold stamps and what the other two
   are, because two lanes are about to write one constant.
10. There is no e2e row for either new focus-ring site, and on WebKit the chip never reaches
    `:focus-visible` in 80 Tab presses at 390×844, so the keyboard claim in the rule's own comment
    is unverified on that engine. Write the row, both engines, and say what WebKit's Tab order
    means for the claim.
11. The chip's ink and its focus ring still tween 150ms under `prefers-reduced-motion: reduce`
    (measured `transition-duration: 0.15s`, `transition-property` including `outline-color`),
    which is the template-spelled duration this lane cured one file away. Either fence it or say
    why the chips keep it while the tab heads snap.
12. `.control-panel-wrap` clientHeight moved **+25 / −14 / +4 / +31** at 320 / 390 / 768 / 1280
    and only the 768 figure is in the record; declare the desk rail's +31px of added scroll.
13. No π instrument pins `?board=` (registry §2.13); every one pins `size=3&difficulty=EASY`, so
    the two arms deal different boards. Pin the deal or state why the surfaces read are
    board-independent.
14. `n === 8` is asserted on the sudoku route alone; the other four games' cards are not read, so
    "8 dies at a sixth game" is a law about one game's card.
15. CHECK 6's per-engine versions are still 18 MDN constants derivable from nothing on disk (the
    lane's own gap 7, unchanged).
16. The source half of the face law covers 9 of 41 `font-family` declarations in `src/` (the
    lane's gap 8, unchanged, and gap 1 above is its sharp edge).
17. The fresh-reader protocol is not scored /8 (the lane has no channel to another lane's agent —
    the orchestrator's row, not the lane's).
18. The section fork with CTRL-TAPE is unadjudicable until batch 2 runs; `ConfirmRibbon.vue` is
    cited, not landed, so CTRL-RULE's `∩ live control = 0` berth row is unrun here.
19. ROW 2 (document rank) is 2 of 8 and stays RED — W3's row, carried unsoftened, correctly.
20. `pencils` sits at −0.02 / −0.04px under its descender, unchanged, for the chair with its flow
    cost named.
21. The cross-engine PAINT band has 1 device pixel of headroom (2.00 measured against 3).
22. **And then the hard part.** The lane's own last gap stands and I will not soften it: nothing
    here says whether two captions ending 33.69px apart read better than two ending on one edge in
    a quieter face. f1 and f2 are the argument, the owner disposes, and the lane is right that
    "restore the column" costs a raster literal this wave refuses everywhere else.

---

## 7 · Verdict

**ADVANCE, 84%.** Up 5 on pass 3. The lane closed twelve of thirteen charter rows on the real
surface with numbers that reproduce, landed the section's registration block and its occlusion
gate, and told the truth about its own instruments five times over. It is not higher because the
law this family exists to enforce still passes with Comic Sans painting on every chip, because its
new cross-engine gate reports on a file rather than on a tree, because the registration block
cites an ablation that is not there, and because no dist was built so the filterBudget census, the
goldens and the build guard were not run at all.

None of that is a missing primitive (not BLOCK) and none of it is a rewording or a constraint
violation — AA clears on both themes from painted bytes, the filterBudget grows by no line, M16 is
clean, π holds on the deck's chips and tapes, the decided history is untouched and W2's mechanics
are intact (not RETIRE).

**Cross-pollination.** (1) The ring-differencing method in §3.5 prices ANY new stroke from painted
bytes and belongs with MRK-LIVE, MRK-ABS and the accent lanes. (2) "A browserless gate reading a
browser artifact must red on a stale artifact" belongs with MOT-VERB's undefined-token census and
NOTE-LEDGER. (3) The ordered last-match-wins law table belongs with any family whose cascade has a
legitimate override. (4) The occlusion gate with a per-name CEILING belongs with every §10 lane
and it is the class's fourth occurrence. (5) Tailwind's `transition-colors` includes
`outline-color`, and a template-spelled duration escapes every PRM arm — MOT-LADDER and MOT-VERB
should have that as a measured fact. (6) On Playwright WebKit a `<button>` is not in the Tab
order; every lane landing a focus ring needs to know it before it claims a keyboard cure.
