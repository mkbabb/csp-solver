# PAL-WALK · pass-7 adversarial critique (§11c, the hue walk; the palette's leader)

I didn't write the charter or the prototype. Every number here that isn't attributed to the lane is mine, taken on
2026-09-23 on my own servers. Base and π control: `74a2b5d9`.

**Verdict: ADVANCE. Convergence: 87%** (up from 85).

The product move is right and it reproduces. The tape's name is now its own string, L 0.86 at night, and it beats
HEAD's ink on the painted glyph statistic in every cell I read in both engines. §C now reads the whole glyph
population against absolute floors and reds its plants.

What holds the number is the same class the last two critiques named. Check 4 and the L6 PROPOSED are cured for
the plants they were shown, and both are GREEN on new siblings I planted. §C is a second hand-rolled copy of the
chair's glyph-pop, and its pooled G3 stamp is what makes the WebKit 65 % fade "void". The CI tier holds the
0.86 cure only as "> 0.79". Row 3's light half is still open.

## The rig

- **Replica.** `git archive 74a2b5d9` + the work tree's `git diff --binary` (sha1 `02e85987…`, 87,764 B) + its two
  untracked files. `diff -rq` of `src/`, `e2e/` and `scripts/` against the tree: identical.
- **Pass-6 arm.** `74a2b5d9` + `pass6/prototype/PAL-WALK/pass6.diff` (applies 0). Against the replica it differs in
  exactly the six files the lane names, with 768 changed lines (the lane's +580/−188).
- **Work tree untouched.** Its `git diff --binary` sha1 is still `02e85987…` with 18 status entries at my return. I ran
  no git in `w7-control`.

| port | what | pid (killed, port read free) |
|---|---|---|
| 4246 | replica, dev, cacheDir in my scratch | 48600 (npx 48568) |
| 4247 | replica built dist `index-Bs79K2OL_vQZ.js`, 43 files | 56406 (npx 56340) |
| 4248 | `w7-control` dist `index-CubiZsMVSwTc.js`, verified by hash | 56404 (npx 56341) |

The pass-6 replica built to `index-iqdYCvIZwvfI.js`, which reproduces pass 6's identity. Every browser row used the
spec's own payload with B pinned: `p-0000000b0b0b` (quickest-rodent) and `p-00000000002e` (quintessential-guineafowl).
The box load was 17–35 (1-minute average) with 49–55 sibling node, playwright and vitest processes. No row here is a
timing row. **No frame is banked.**

---

## 1 · Re-measured (my servers, both engines)

| row | lane | mine |
|---|---|---|
| §C clean, chromium DPR 2 | 16/16 GREEN, dark name core 7.192 / pop 6.610 | **16/16 GREEN, 7.192 / 6.610** (0b0b); 7.082 / 6.252–6.268 (002e). Exit 0 |
| §C clean, WebKit DPR 2 | 16/16 GREEN, 7.192 / 7.192 | **16/16 GREEN, 7.192 / 7.192**, light 11.891 |
| §C clean, chromium DPR 1 | cell 8 dark 4.891 / 5.185, light 4.124 / 5.440 | **4.891 / 5.185 · 4.124 / 5.440**. Exit 0 |
| B-TAPE in-run HEAD ink, dark DPR 2 | 5.991 chromium and WebKit | **5.991 (0b0b) / 5.899 (002e)** chromium, **5.991** WebKit. The ring at 0.79 reads 5.691 / 5.604 |
| B-TAPE in-run HEAD ink, chromium DPR 1 dark | — | **4.959** given cells, **4.195 / 4.406** cell 8. The name is 5.875 / 4.891, so it wins everywhere |
| The lane's required plants | all RED | **all RED** in chromium DPR 1/2 and in WebKit DPR 2 (FAINT30/v, TAIL12, TAIL35, EMPTY; FADE65/80/v in chromium) |
| Pairwise ΔE_ok table (leader duty) | the README's table | **reproduces to the fourth decimal on every row** (digit, ring, name, HEAD at N = 2/3/4/5/8/16). Name chroma is under the ring's for 53/144 hands; the worst ratio is 0.625 at **i = 55** (hand 0 is 0.626, so the README's "(hand 0 …)" names the wrong index) |
| Check 4 clean, `--self-test` | 0, 65 ✓ | **0, 65 ✓** on a clean copy. The control has no file and exits 1 |
| Undefined-token census | tree 1 (`GameBoard.vue:1245 --color-peer-name-ink`); control 1 (STALE) | **same**. With the PROPOSED row the tree reads 0 bare and 1 STALE, like the control |
| Filter census, built dists, both themes | not run by the lane (gap 7) | **tree = control, bit for bit.** Dark: exit 1 on both trees in both engines, 2 failed (G3.1/G3.3, `svg.crayon-heart.idle saturate(0.85)`, the ratified deletion that isn't on this base). Light: 6/6 on both. The served CSS carries the same six `filter:` declarations as the control |
| π, served bytes pass 6 → pass 7 | "one string, the tape" | **The served CSS moves three declarations**: `.washi-label` `color: var(--color-peer-cursor-ink)` → `var(--color-peer-name-ink)`, plus `--peer-name-l: .295` and `.86`. Everything else is GameBoard's scope-hash rename. The JS moves `inkFor`'s third string. No unclaimed paint property moved |
| M16 | 0 / 0 | **`check-copy-register` bare 0 tree, 0 control** |
| @property | 0 / 0 | **`check-property-block` 0 / 0**. `--peer-name-l` is an unregistered custom property, so the law has nothing to bind |
| lint:theme-tokens · lint:sleep | 0 · 0 / 0 · 0 | **0 · 0 / 0 · 0** |

---

## 2 · What did not converge

### W1 · Check 4 is cured for its plants, not for the class (third pass running)

These were planted on an attack copy, run bare, and restored by rsync (`readings/check4-l6-attacks.txt`). Each is a
declaration the SHAPE law names.

| plant | check-peer-arcs |
|---|---|
| A2 · `el.style.cssText = "--color-peer" + "-name-ink: red"` (a concatenated cssText write, `.ts`) | **exit 0** |
| A3 · `el.setAttribute("style", "--color-peer-" + "name-ink:red")` | **exit 0** |
| A4 · an SFC `:style="{ [k]: 'red' }"` with `k = ["--color-peer", "name-ink"].join("-")` (a computed `:style` key) | **exit 0** |
| A5 · `@import "../../lib/peerx.css"` in `index.css`, and that file sets `.game-cell { --color-peer-name-ink: red }` (a stylesheet outside `src/`/`public/` that the cascade loads) | **exit 0** |
| A7 / A8 / A9 / A9b (stray arms, see W2) | exit 1 ×4 |
| clean, before and after | 0 · 0 |

`INK_TOKEN` needs the whole token in one literal, and the computed-name clause reads only `setProperty(expr)` and
`style[expr] =`. `sourceFiles()` walks `src/`, `e2e/` and `public/` and never follows `@import`. LAWS P6 §F lists
"concatenated and computed keys" and "every linked stylesheet", and §I says a hand-rolled second reader is a row
against the law. The chair's shape-census library reds concatenated `setProperty`, computed keys and `public/`
already.

### W2 · The L6 PROPOSED's pair half keys the ring only, and index.css only

This is the law the chair lands at the fold (WALK's form, pass7/CHAIR-RULINGS §2). I ran the lane's
`law-probe.PROPOSED.mjs` with `LAW_FE` on the attack copy.

| plant | L6 | check 4 |
|---|---|---|
| A7 · `html.dark { --peer-name-l: 0.5 }` in index.css | **GREEN** | 1 |
| A8 · `html.dark { --peer-ink-l: 0.2 }` in index.css | **GREEN** | 1 |
| A9 · `.dark { --peer-name-l: 0.5 }` in `typography.css` (which index.css `@import`s) | **GREEN** | 1 |
| A9b · `.dark { --peer-ring-l: 0.2 }` in `typography.css` | **GREEN** | 1 |

- `RING_ARM` matches `--peer-ring-l` and the ring inks only, so stray name and digit arms can't be seen.
- `armOf()` takes the first `--peer-name-l:` outside the first `.dark {` block, so a later stray arm never reaches the
  formula half either.
- The sheet read is `index.css` alone. A9b is a RING arm, the subject L6 claims, one `@import` away.

CI's check 4 reds all four, so nothing ships. But the law row's sentence ("every ring ARM … under ANY selector") is
false for an imported sheet, and the name's pair has no shape half at all.

### W3 · The CI tier holds the 0.86 cure only as "> 0.79"

A10 moves the name coherently to 0.80: `NAME_BANDS = [0.295, 0.80]` and `.dark { --peer-name-l: 0.80 }`.

- `useSession.test.ts` + `BoardHost.authors.test.ts`: **exit 0, 56/56**.
- `check-peer-arcs`: **exit 0**. L6 PROPOSED: **GREEN**.

The unit asserts only `NAME_BANDS[1] > RING_BANDS[1]`. The lane's own sweep puts 0.82 at 4.369 on chromium DPR 1
cell 8, and pass 6's 0.79 lost to HEAD in 16/16 cells. So a revert of this pass's whole B-TAPE cure to 0.80 is green in
CI, and only the local §C (O-12, never in CI) reds it. The sweep already names the floor: the unit can pin
`NAME_BANDS[1] ≥ 0.84` (the least L that clears 4.5 at cell 8), with A10 as its negative.

### W4 · §C re-implements the chair's glyph-pop, and the fork is what loses WebKit's 65 % fade

LAWS §I: "a family row that re-implements one of these is a row against this law and the critic reds it." The lane
ballots it (T9-B-PW7-2) and says the formulas match. They don't match in G3's bound, and that is the whole "void".

- **§C's bound** is the stamp + 0.05, and the stamp is the MAX over both payloads. WebKit DPR 2 dark is 0.229 (the
  002e name), so the bound is 0.279 for the 0b0b name as well, whose own clean fraction is 0.209–0.217.
- **The chair's glyph-pop** bounds each read at its own clean + 0.05 (0.260).
- **On this tree** (the lane's own `glyph-pop-chair-instrument.txt`, lines 75/82): FADE65 in WebKit reads 0.272 and is
  **RED** in the chair's instrument.
- **In my §C run** (WebKit DPR 2, dark, 0b0b): FADE65, FADE65v and my `color`-alpha twin CRIT_ALPHA65 read frac
  0.271, core 6.993 (×0.972), and are **GREEN** against 0.279. I required CRIT_ALPHA65, so it shows as "GREEN (a hole)"
  ×2 and the file exits 1. That failure is the plant's, not the tree's: every clean row is green.

So FADE65 isn't void in WebKit's pixels. It's caught by a per-payload bound at a margin of 0.012. FADE80 is void in both
readers (frac 0.236 against a clean 0.209; core ×1.000), and that one is honestly WebKit's.

**Light, WebKit DPR 2:** FADE65 is already RED on G2 (pop 10.591 < 10.70), but only as a printed READING.

My other plants were RED in both engines. `opacity: .7` on the label reds G1, down to 0–36 px. A `color` alpha at 80 %
reds G1 or G2.

### W5 · Row 3's light half is open (the lane says so; reproduced)

- Chromium DPR 1, cell 8 by day reads core **4.124** (0b0b), with the floor stamped at 0.9 × 4.124 = 3.71 and no 4.5.
- The control reads 2.790 on the same paper with HEAD's ink (the in-run control), or 2.718 on its own tree.
- The cure (L 0.22 → 4.767) is priced in T9-B-PW7-1 and not landed. Until the chair rules, this is the palette's red, not
  T9-R8's.

### W6 · B-TAPE's cost isn't in a ballot, and it lands where no frame looks

Binding the name to 0.86 bisects its chroma over [0.295, 0.86]. That lowers the name's chroma BY DAY for 53/144
hands, and by day the contrast gains nothing: the core is 11.891 either way.

- **Separation of the names.** The minimum ΔE_ok at N=2/3/4 goes from 0.1702 / 0.0528 / 0.0514 (pass 6's name = the
  ring string) to 0.1253 / 0.0528 / 0.0274 by day, and from 0.1712 / 0.0510 / 0.0510 to 0.1255 / 0.0513 / 0.0271 at night.
  HEAD's one string reads 0.2055 / 0.1477 / 0.0991.
- **Hand 0, the host.** Every joiner reads the host's name on the tape. Its chroma falls 0.1207 → 0.0756 in both
  themes. Hands 5, 8, 10 and 13 also fall among the first 16.
- **The payload hides it.** §C, both frames and B-TAPE read only B = index 1, whose chroma is the same under both
  tables. The pass-7 day-name move is painted on no read and no frame.
- **The ballot rows.** README gap 3 states the numbers, but none of T9-B-PW7-1/2/3 or B-TAPE names this loss.
  LAWS P6 §G: "a ballot names the LOSS of its default where the default loses on any measured axis".

### W7 · §C reads one hand, and it's a best case at night

Priced by spec over all 144 names against the painted paper (`readings/delta-e-and-144-names.txt`):

| theme | range | index 1 | worst |
|---|---|---|---|
| night, L 0.86 | 6.575–7.127 | 7.082, rank 129 of 143 | i = 13, 6.575 |
| day, L 0.295 | 11.738–12.841 | 11.793, rank 12 | i = 14, 11.738 |

Chromium DPR 1 cell 8 paints index 1 at 4.891. Scaled by spec, the worst hand projects to about 4.54 there, which is
0.04 over the floor. That's a projection, not a reading. The host's hand 0 (6.761, rank 37) is never painted: §C always
reads B on A's page. Closing it is a second subject, A's name read from B's page.

### Carried, declared by the lane (I agree with each)

- The undefined-token census's name row is PROPOSED, not applied (it's the chair's instrument). I reproduced 1 → 0.
- `lint:bands` and `lint:verbs` don't exist on either side (exit 1 both).
- Check 4 is the lane's own reader. It's balloted, and W1 is the cost of that.
- The dark filter red is inherited: the crayon-heart deletion, ratified pass7/CHAIR-RULINGS §2, lives on the
  integrated tree.
- The name key rides inert on every authored cell. The served bytes confirm no paint moves with it.
- The r2 kinship check wasn't re-run against the PROPOSED L6.

---

## 3 · Checklist

| item | verdict |
|---|---|
| vacuous convergence | clear: every claimed row reproduced with its control |
| spec-cites-itself | **mild.** §C's floors are stamped from this tree's own read (0.9×). Where no 4.5 applies (chromium DPR 1 light top) the floor is the tree's red restated. It's declared |
| gates that cannot fail | **HIT.** Check 4: A2–A5 exit 0 (W1). L6 PROPOSED: A7–A9b GREEN (W2). The CI tier on the cure: A10 green (W3). The WebKit FADE65 exemption rests on a pooled bound (W4) |
| elegant-reduction trap | clear. The paper is now occlusion-only, and the lane shows the name clears 4.5 on translucent paper (PAPER reading core 6.972–7.192 dark DPR 2, both engines) |
| legacy aliases | clear. The name no longer rides the ring's string, and `--color-peer-cursor-ink` left the tape |
| masked fallbacks | **mild.** The light top-cell key floors at 3.71 (W5, declared). A pooled stamp masks a per-payload fade (W4) |
| unverified gestalt | **HIT.** The pass-7 day-name chroma move (53/144 hands, the host among them) is on no frame and no painted read (W6). Frames 2 and 3 are lawful: frame 2 is one variable per row, and frame 3 has no focus band, with WebKit halves in both |
| consumer-less substrate | mild, declared: `--color-peer-name-ink` is inert on every cell |
| generic default | clear |
| π | clear. The served CSS diff pass 6 → pass 7 is three declarations on the claimed surface |
| the constraint it forgot | **§I (instruments)**: §C forks glyph-pop and check 4 forks the shape library; the fork costs W4 and W1. AA: dark cured, light cell 8 open (W5). filterBudget: tree = control, both themes, both engines. M16 0. @property n/a (0). Census: the name row PROPOSED. W2's mechanics untouched. Decided history: L6 is WALK's form, but amended short (W2) |

## 4 · Open gaps, each a sentence that closes it

1. **Check 4 (W1).** Read concatenated and computed writes in `cssText`, `setAttribute("style", …)` and `:style`
   object keys, and follow every `@import` from index.css to its file wherever it sits, with A2, A3, A4 and A5 as
   self-test rows that exit 1. Better still, run clause (v) on the chair's `shape-census.mjs` and delete the reader.
2. **L6 PROPOSED (W2).** Key the pair half on all three band vars (`--peer-ink-l`, `--peer-ring-l`, `--peer-name-l`) and
   the three ink tokens, over index.css plus every sheet it `@import`s, with A7, A8, A9 and A9b as its plants. Each is
   GREEN today.
3. **CI guard (W3).** Pin `NAME_BANDS[1] ≥ 0.84` in `useSession.test.ts` (the least L the lane's sweep clears 4.5 at
   chromium DPR 1 cell 8), and pin the sheet's `.dark` `--peer-name-l` to it in check 3, with A10 (coherent 0.80: 56/56
   green today) as the negative.
4. **§C's G3 (W4).** Stamp the fraction per payload, or bound each read at its own clean + 0.05 as glyph-pop does.
   Then FADE65 in WebKit DPR 2 dark (0.271 against 0.259) becomes a required plant. Or import `glyph-pop.mjs` (T9-B-PW7-2
   arm A) and delete the fork.
5. **Row 3 light (W5).** Land L 0.22 by day (4.767) at its stated ΔE price, or have the chair book chromium DPR 1 cell 8
   light (4.124 against the control's 2.718) as the palette's stamped row.
6. **B-TAPE's cost (W6).** Write the day-name loss into the ballot row: 53/144 hands, worst ×0.625, the host 0.1207 →
   0.0756, and name ΔE at N=4 0.0514 → 0.0274 by day, 0.0510 → 0.0271 at night, against HEAD's 0.0991. Frame it on a
   hand that moves (hand 0 on one payload, one variable). Or bisect the day name at RING_BANDS and state the chroma
   split between themes instead.
7. **The subject (W7).** Add A's name read from B's page (hand 0) as a second §C subject, so the population includes
   the name every joiner sees.
8. **Census.** The chair applies `undefined-token-census.name-row.PROPOSED.diff` (the tree goes 1 → 0 bare).

## 5 · Strengths (earned)

- **The ink is bound and it wins.** Dark name core 7.192 / 7.082 against HEAD's ink at 5.991 / 5.899 (DPR 2, both
  engines), and 5.875 / 4.891 against 4.959 / 4.195 at chromium DPR 1. The loss the pass-6 critique named (16/16 rows)
  has become a win in every cell read. The ring string (0.79) sits in the same run as the second in-run control, at
  5.691 / 5.604.
- **§C finally reads paint.** A whole population, absolute floors, G1–G4. FAINT30, TAIL12, TAIL35 and EMPTY are RED in
  both engines, and all six fades in chromium. My extra plants (opacity 0.7, `color` at 80 %) red in both engines.
  The spec-colour-only hole of pass 6 is closed.
- **Every number reproduces.** Each §C figure, the full ΔE table to four decimals, the census row and the check-4 clean
  and self-test reproduce, as does the byte-equal apply on `74a2b5d9`.
- **The move is small.** Three served CSS declarations and one string, π clean by the bytes, the filter census
  identical to the control.
- **Honest gaps.** Row 3 light, WebKit's fades, the separation cost, the census row and the §I tension are each
  declared with numbers.

## 6 · Cross-pollination

- **Per-payload (or per-read) G3 bounds** for every painted-text row that stamps a pooled SHIPPED fraction: TIN §2b,
  COUNT's `.pl-qual`, SELF's state line, ERASE/LEDGER's settled rung. A pooled max hands the tighter subject the
  looser one's slack.
- **The concatenated `cssText` / `setAttribute("style")` / computed `:style` key and the `@import`-followed sheet** as
  plants for the chair's `shape-census.mjs` and every one-publisher gate (MRK-LIVE's `--ring-ink`, §13's rungs, FACE
  CHECK 7).
- **"The CI tier pins the cure's value"**: every painted cure whose paint gate is local (O-12) owes a browserless pin
  at the least passing value, with a coherent sheet+module move as its negative. That applies to TIN's name arm too.
- **Read the most-seen subject, not the pinned one**: the host's name for any tape or name row.

## 7 · Incidents (mine)

- **No `rm`.** Scratch is under `<scratchpad>/critpw7/`. My PW configs and the critic spec copy were `mv`ed to
  `critpw7/trash-critpw7/`. Plants lived on an rsync'd attack copy, never on the work tree.
- **A self-inflicted red.** My critic spec copy in the replica made the replica's `check-peer-arcs` exit 1 (it's a
  second publisher, correctly). The clean-copy reads (0; self-test 65 ✓) are the ones cited.
- **A mis-invocation.** The undefined-token census failed on `--fe` (it reads `FE` from the environment). It was re-run
  correctly, and only the re-run is cited.
- **Wrapper PIDs.** My recorded PIDs were the `npx` wrappers. The listeners (48600, 56406, 56404) and the wrappers
  were all killed by PID, and ports 4246–4248 read free.
- **Load.** 17–35 (1-minute average), with 49–55 sibling processes. No timing row is cited.
