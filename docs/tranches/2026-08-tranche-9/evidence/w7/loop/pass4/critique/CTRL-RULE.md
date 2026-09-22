# T9-W7 · pass 4 · CRITIQUE · CTRL-RULE — the ruled page

I wrote neither the charter nor the prototype. I re-measured on the lane's own work tree
`wf_f72f3b5a-83a-28` (base `74a2b5d9`, 29 M + 3 untracked, uncommitted). I served its BUILT dist
(`index-DYckr8SLvCtH.js`, fresh: no source is newer than `dist/index.html`) on `127.0.0.1:4238`
and the shared `w7-control` dist (`index-CubiZsMVSwTc.js`) on `:4239`. I verified both ports by
asset hash and killed both by recorded PID (listeners 38588/38587, parents 38530/38532). The
band's four remaining listeners (:4240–4243) belong to siblings. Every π row names `74a2b5d9`.
Every browser row loads the lane's encoded board `ATMuNTMw…MDc5` (both arms decode it: 30
givens, param kept). The work tree's `git status` at my return is product files only, and my
scratch PW config dir was deleted.

The pass-4 advance was read as the difference against the pass-3 record: `pass3.diff` was
applied to a `git archive 74a2b5d9` scratch tree, without the woff2, which the patch could not
carry. That gives 28 files moved this pass; `GameControlPanel.vue` moved by 198 lines.

Instruments are in `critique/CTRL-RULE/instruments/`. Two are copies with OUT re-pointed
(`ribbon-case.copy.mjs`, `ribbon-case.ablate.mjs`); three are mine (`critic-probe.mjs`,
`critic-landscape.mjs`, `critic-webkit-card.mjs`). Readings are in `readings/`, which includes
`e2e-and-gates-critic.txt`. There is one crop, `frames/c1-…` (39.6 KB).

---

## 0 · Numbers I re-ran myself

| row | chromium | webkit | lane's | verdict |
|---|---|---|---|---|
| confirm ∩ live controls over the whole case, 390×844 light, `hasTouch` witnessed, 3 scroll states | **0.000** | **0.000** | 0.000 | REPRODUCED |
| born-RED (pass-3 `bottom:100%` re-injected), same run | 1.000 | 1.000 | 1.000 | REPRODUCED |
| **my second break**: the asked verbs un-hidden (`.is-asked{visibility:visible}`) | **0.8166 RED** | — | — | the gate has TEETH beyond its own control |
| swap price: foot / card clientHeight rest→armed | 77.97→77.97 · 540→540 | same | Δ 0.00 | REPRODUCED |
| COST contract: key arm → `keep`; Escape → keep, sheet open, focus back on `Clear the board`; lapse leaves the board dirty; press 2 clears | all true | all true | all true | REPRODUCED |
| π desk 1280×800, light + dark: masthead, wordmark, tab, toggle, cell, peek host | Δ 0.00, paint + tag identical | Δ 0.00, identical | Δ 0.00 | REPRODUCED |
| π desk: case / card (claimed) | case dy +0.49, dh −0.98; card width = control | dy +0.48, dh −0.98 | "324.22 = control" | width REPRODUCED |
| rule 1.4.11 at rest, worst painted column, all 7 rules (own decoder) | **3.530** light / **4.364** dark, 0 % < 3 | 3.530 / 4.364, 0 % | 3.53 / 4.364 rest | REPRODUCED (the forced-phase 3.304 not re-run) |
| keyboard ring (`--ring-ink` = `#3a7bc4`), PAINTED top band, `:focus-visible` asserted | **4.289** light / **4.286** dark | **4.289** / **4.286** | *never measured this pass* | CLEARS (my number, not the lane's) |
| filter census, built dist (`playwright-throttle`, 2 projects) | 12/12 exit 0 (both projects) | | 12/12 | REPRODUCED |
| goldens, built dist | 4/4 exit 0 | | 4/4 | REPRODUCED |
| `viewport-law.spec.ts`, prototype | 11/14 (red :287, :581, :616) | 11/14 (same three) | chromium only | the three reds are **both engines** |
| `viewport-law.spec.ts`, the CONTROL's own spec | — | **14/14** | — | the three reds are the prototype's |
| webkit: zone-grammar, mobile-affordances, visual-regression, access, font-census | — | 40/41 (visual-regression:809 only) | unrun in webkit | re-aims HOLD in webkit |
| check-copy-register bare / `--self-test` | exit 0 (0 unadmitted, 0 admitted) | | 0 | REPRODUCED |
| check-theme-tokens · font-coverage · ink-pressure · motion-contract (`--self-test`) | all exit 0 | | 0 | REPRODUCED |
| undefined-token census over the 11 touched style files | 0 undeclared (the `--washi-tag-*` / `--tap-floor` fallbacks are at `74a2b5d9` too) | | — | CLEAN |

---

## 1 · GAPS — what holds the number (each closable, numbers attached)

### 1.1 · NEW: the card scrolls sideways at every desk cell (the width law holds on the box, not in the scroll extent)

`scrollWidth − clientWidth` on `.controls-card`, prototype vs control, both engines:

```
1024×768   21 px  vs 0        1280×800   17 px  vs 0        1440×900   14 px  vs 0
390 · 320 · 844×390 · 812×375   0  (the dock does not overflow)
```

The culprit is the deal receipt's tally. `svg.dt-marks` ends at x 1161.1 against the card's
right edge at 1150.2 (1280×800, both engines). `contain: inline-size` on `.rp-field` stops the
field from sizing the card. That is how the case reads 324.22 = control. But the flex deal row
(verb + tally) cannot wrap, so its excess now overflows inside the scrollport instead. In WebKit
the overflow draws a **visible 17 px horizontal scrollbar** (`frames/c1`; card `offsetHeight`
531, `clientHeight` **514**), so WebKit's card loses 17 px of view that chromium keeps. The lane's
"bar overflow 0 at 7 cells" read the bar and never the card, and its §6.4 row read a width that
a scroll extent can exceed. Chair §6.4 says "content fits it"; the tally does not. **Close:**
the deal row wraps or the tally shrinks, and a row asserts `scrollWidth === clientWidth` on the
card at the three desk cells, both engines. Its negative control is the current tree.

### 1.2 · W2's landed mechanics: three estate rows RED in BOTH engines (control green)

- **§2.4 `viewport-law:287`**: the theme toggle's hit box owns the `4×4` chip at 1024×768. The
  overlap is **967.4 px²** in chromium and **999 px²** in WebKit (circleFrac 0.375). A tap at
  [920, 167.9] flips the theme. The lane found this in chromium; I confirm it in WebKit, and the
  control's own spec reads 14/14 in WebKit. The ruled page moved the first chip line up to
  y 163.5, under the toggle's box.
- **§2.6 `viewport-law:581/616`**: the pinned name's visibility is under W2's 0.9. `new game`
  reads **0.851** (rail, both engines). In the drawer, `new game` reads **0.797** in chromium
  and **0.8135** in WebKit. A two-line name's sticky travel is bounded by row 1 of its grid.

W2's mechanics are LANDED law, and "voice on top, no new mechanic" is the constraint. Both rows
are real cures, not re-aims. **Close:** the first line clears the toggle's published foot (a
measured token in the leader's block, never a literal). A two-line name gets a grid area whose
travel reaches 0.9, or the name is one line.

### 1.3 · NEW: DEAL's question lands 317 px from the verb that asked it

At 390×844 coarse (both engines, dirty board) a tap on `deal` puts `start a new board?` in the
case's foot: deal at y 385.6–463.2, ribbon at 780.2–835.4, **317 px below**. The deal verb itself
does not change (its sublabel stays `Deal`, asserted by the lane's own re-aim at
`mobile-affordances:435`). To ask about deal, the question also hides clear, fill, solve and
share. The section file's docblock (TAPE's `ConfirmRibbon.vue`) says the ask stands "in the row
the verb lives in". For deal it does not. The lane measured Clear alone: every ribbon row, frame
and price row is Clear's. **Close:** measure deal's arm in the ribbon instrument (∩, price, and
distance to the asking verb), both engines. Then either berth deal's question in the `new game`
field or state the remote-question cost to the owner with a frame.

### 1.4 · The doubled band has two species, and the lane counted one

The lane's claim "consecutive rules never sit nearer than 55.68 px" is true for rule→rule (mine:
55.78 minimum). The `new game` rule sits **15.10 px** above the zone `BoilDivider` at every desk
cell, in both engines and both themes, which is visible in the lane's own f3 at y ≈ 198/213.
Add the declared group-rule→foot-rule pair (15.5 px at 390 coarse, scrollTop 0) and the page
draws two double bands. No gate covers either. **Close:** a spacing row over ALL horizontal
drawn lines in the case (rules, BoilDivider, the foot's rule), with a floor and its negative
control.

### 1.5 · The iPad seal's teeth clause is left RED "by design" (`visual-regression:809`, now both engines)

The seal restamp (1227.5 → 1046.5) is a declared delta in chair §6.1's form. The `> 30` teeth
clause now reads 16.00 because the ruled field already wraps. That means the clause's subject
moved, and the LAWS' form for a moved subject is a PROPOSED re-cut under `instruments/` with the
row reported MOVED. It is not an estate red left standing. **Close:** bank the re-cut, or show
that the seam cost is still measurable on the ruled page.

### 1.6 · The foot costs the card's view at every cell, and the price comment is stale

Card content view, prototype vs control (the control's sticky bar subtracted):

```
844×390  224 vs 235.2   812×375  209 vs 220.2   390×844  540 vs 561.2   320×568  264 vs 285.2
1280×800 531 vs 543.2 (chromium) · 514 (webkit, the 1.1 scrollbar)   1024×768 500 / 483 vs 511.7
```

The foot is 77.97 px on the dock and 76.02 on the desk. `GameControlPanel.vue`'s publisher
comment still prices it at "67px dock / 65 desk", a retired number, which is the pass-3 critique
§3's class again. **Close:** re-word from these numbers and put the per-cell price in the
owner's ballot row.

### 1.7 · A destructive flake with no cause

The lane's gap 13: on chromium at 320×568, 1 of 6 runs **failed to arm and a Clear fired
unarmed**. That is the confirm's one job failing. "5 later runs green" is not a cause. **Close:**
reproduce it at N ≥ 20 per engine at 320×568 with a trace, and name the mechanism (a scroll-state
race on `isDirty`?) or bound it.

### 1.8 · The proposed R3 re-aim can be fooled (critic's break B)

`law-probe.R3.proposed.mjs` reads a 600-character TEXT window after `class="action-bar"`:

- As shipped: GREEN. Control: RED.
- Break A (the bar's `RuledLine` deleted): RED, correctly.
- Break B (the edge deleted and one HTML comment naming `outline-svg` inside the window):
  **GREEN**.

It is a window over text that includes comments, the same class as the struck law-20 window
(registry §2.10). **Close:** strip comments before matching, or read the rendered bar's DOM
(`.action-bar > svg.outline-svg` present, `border-*-width` 0).

### 1.9 · §6.1 the foot on the inset: landed, but its computed row cannot discriminate and no estate gate holds it

`padding-bottom: max(0.15rem, env(safe-area-inset-bottom))` is in `.card-foot`. The source
regex is true here and false on the control. The computed read is 2.4 px, but it would read
2.4 px with the `env()` term deleted, so only the regex bites. Both rows live in an evidence
probe, not in `e2e/`, so nothing guards the inset once the loop folds. The same holds for the
case-wide ∩ row (the leader's to land). The RUNSHEET line is the chair's and is still proposed.
**Close:** an estate row, with a discriminating computed arm if the engine supplies an inset
override (chromium CDP `Emulation.setSafeAreaInsetsOverride`, where available), both engines
otherwise by source.

### 1.10 · Carried, declared by the lane, still open

- 390×844 FINE: the case top crosses the masthead by 10.86 px (control 3.69). This is the
  leader's `--sheet-chrome`.
- σ floor margin 0.002 (3 px σ min 0.724 vs R3's band 0.722).
- 3 px equals the case's own stroke (owner).
- Merge watch unmet: `armGuard` (deal, clear) vs TAPE's `useTwoTap` (deal, fill, clear, solve).
  Same window, predicate and focus contract, two machines.
- `@property` clause 3 is AMBER: `initial-value: 0px` re-creates the struck `, 0px`
  byte-for-byte (TAPE's critic ruled the same on the leader's block; the leader's row).
- Unrun: hue census vs control, R7 I2/I4, webkit on the remaining e2e specs (I ran viewport-law
  plus five).
- ROW B is a tripwire, struck from the count (§2.10).
- R1 row 3 is scoped out at < 375 in writing.

### 1.11 · Gestalt the owner should see (not reds; U-10)

- At the desk every three-chip field stacks one chip per line (`size`, `level`, `marks`,
  `checking`: 3 chips on 3 lines, both engines). The 121.6 px margin leaves the field about
  160 px. The page reads as a vertical list, which the card's shorter content
  (`scrollHeight` 945 vs 1142) partly repays.
- The question `clear the board?` is set in Patrick Hand at 14 px, beside chips in Fira Code at
  20 px.
- A pointer arm leaves `document.activeElement` = BODY in chromium, because the tapped verb goes
  `visibility: hidden` under the question. `keep` restores none. This matches COST's contract
  ("a pointer arm restores none"), but it is stated nowhere as a consequence of the hide.

---

## 2 · The checklist

- **the constraint it forgot**: W2's landed §2.4 and §2.6 rows are RED in both engines (1.2).
- **the pixel it moves that it did not declare**: the card's 14–21 px horizontal scroll and
  WebKit's 17 px scrollbar (1.1); the content view −11 to −29 px (1.6).
- **the elegant-reduction trap**: `contain: inline-size` makes the card MEASURE right while its
  content overflows (1.1).
- **gates that cannot fail**: the safe-area computed arm (1.9); ROW B (tripwire); the R3
  proposal is fooled by a comment (1.8). The ∩ gate is NOT one of these: my second break reads
  0.8166.
- **unverified gestalt**: deal's question never measured or framed (1.3); the rule→BoilDivider
  double band un-gated (1.4).
- **masked fallbacks**: the `0px` initial equals the struck fallback (AMBER, 1.10).
- **Clear**: M16 · filterBudget (12/12 built, both engines) · painted AA (rules 3.53/4.364, ring
  4.289/4.286, both engines, both themes) · π identity on every unclaimed desk surface, paint and
  tag included · the undefined-token census · no generic-default tell · decided history (L3
  GREEN, R3 carried as PROPOSED and MOVED, r0 untouched).

## 3 · Strengths (earned, reproduced)

1. The block-on-fold row is CURED. The question takes the verbs' own grid cell, so ∩ = 0.000
   over the whole case in both engines at zero reflow (Δ 0.00). The gate is not vacuous: it reds
   on the pass-3 placement AND on a second break it was not written for (0.8166).
2. The section's one file really is one file: TAPE's `ConfirmRibbon.vue` byte-identical, with
   COST's focus contract (keyboard → `keep`, Escape at document capture) wired and reproduced.
3. The width law is restored on the box: every unclaimed desk surface is Δ 0.00 with identical
   paint, where pass 3 moved them 24.64 px.
4. The rule's 1.4.11 decision was made on a sweep that was re-cut honestly. Pass 3's dark sweep
   was blind (the ink term read zero on dark paper) and the lane found and said so. 3 px clears
   at rest in both engines and themes, and the knob plus its fallback are deleted.
5. The `, 0px` strikes are complete on the three tokens, and `--card-pad-x` is registered. The
   foot-inset born-RED fires on the declaring host.
6. 41 e2e re-aims, each marked. Their re-aims hold in WebKit (40/41, the declared seal only).
7. The incident list is honest, including a destructive flake a less honest lane would have
   buried.

## 4 · Convergence — **68**, and why not more

Pass 3 was 62. This pass cured the one block-on-fold row, the width law on the box, §6.1's
source, the rule's AA, the stale comments, the fallbacks, and the 42-red split. All of it
reproduced in my hands, in both engines. What holds the number: two W2 landed rows RED in both
engines (1.2); a new horizontal overflow at every desk cell the lane's own width instrument
could not see (1.1); a Clear that fired unarmed with no cause (1.7); deal's question unmeasured
and 317 px from its verb (1.3); two double bands (1.4); an estate red left standing instead of
re-cut (1.5); and gates that live only in probes (1.9). None is a missing primitive. Each closes
with a measurement, a wrap rule, or a token the leader already owns.

**ADVANCE.** First cures: 1.1 (a wrap rule), then 1.2 (the toggle's foot token, the two-line pin
travel), then 1.7 (the flake's cause).

## 5 · Cross-pollination

- **The whole §10 section ← this critique's 1.1**: any lane that meets chair §6.4 with
  `contain: inline-size` must also assert `scrollWidth === clientWidth` on the scrollport. The
  box can be right while the scroll extent is wrong. CTRL-COST used the same idiom (its "ruler
  law").
- **CTRL-FACE (leader) ← 1.9**: the case-wide ∩ gate and the foot-inset row belong in `e2e/`,
  not in probes. RULE's `ribbon-case.mjs` (predicate rooted at `.drawer-case`, painted extent,
  scrollport clip, re-injected born-RED) is the section's instrument to take, together with my
  ablation arm (un-hidden verbs → 0.8166).
- **CTRL-TAPE ← 1.3**: the section file's "in the row the verb lives in" is false for any verb
  whose question berths in the foot. TAPE covers four verbs, so deal/fill/solve are all exposed.
- **Every lane with a source-text probe ← 1.8**: strip comments before matching.
- **MRK-LIVE ← 0**: `--ring-ink` (`#3a7bc4`) paints 4.289 / 4.286 on the card, both engines and
  themes, as a consumer's painted witness for LIVE's one declaration.
