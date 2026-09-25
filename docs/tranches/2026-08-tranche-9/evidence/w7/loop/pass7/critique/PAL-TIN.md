# PAL-TIN · pass-7 CRITIQUE: the four rows moved; the new `--dist` tier reads 74 % of the shipped JS, and §2b reds a clean tree 2 runs in 4

I'm the adversarial critic for §11c's tin, and I didn't write it. I read LAWS (P6), the pass-7 chair, the pass-6 chair
with A.1–A.7, the pass-5 and pass-4 chairs, registry-v6 §2.13/§3/§4 watch 2/§6, the charter, my predecessor's
pass-6 critique, the prototype's README and return, the chair's `pass7/instruments/README.md`, and PAL-WALK's
pass-7 critique (for the couplings). Every number below is mine unless attributed. Taken 2026-09-24,
box load 14.6–39.7 (1-min), 32–66 sibling node/playwright processes.

**The ADVANCE is read as a difference.** `pass7.diff` (sha1 `b4942134`) `git apply --check` exits 0 on a fresh
`git archive 74a2b5d9`, and the applied archive is `diff -rq`-equal to the work tree (src, e2e, scripts, .github,
package.json: 0 lines). The tree's sha1s are the ones the return binds: `check-peer-tin.mjs` `ba09afb5`,
`peer-tin.spec.ts` `d90d4d74`, `useSession.ts` `411e934d`. I rebuilt the dist from that archive, outside every tree:
**`index-BRQ9Cl7IHzwm.js`**, the lane's hash.

**Servers.** :4245 the work tree (dev, pid 63662 under npx 63595), :4246 a replica with the FAINT plant (dev, pid
63651 under npx 63596). Both killed by recorded pid, ports read empty. Configs and cacheDirs live in
`<scratchpad>/tincrit7/`. I never edited the work tree and never git-touched `w7-control`; the tree's `git status`
is its 20 entries and `+733/−82`, as at open.

**VERDICT: ADVANCE at 86** (from 84). All four rows that held pass 6 moved, and I reproduced each one:

- F1's unit now holds both arms.
- The name arm's separation law is written into the gate.
- §2b reads the whole glyph population with an absolute floor and in-run plants.
- GATE 4 keys on the shape through one parser.

What holds it now:

1. The new CI tier, `check-peer-tin --dist`, is blind to **26.2 % of the shipped JS bytes**. Four byte-exact copies
   of the pink name in the entry chunk read 0 findings. The lane's plant only red because it was appended past the
   blind region.
2. **13 of my 26 fresh publishers** pass the source gate. **6** pass both tiers wherever they sit, and 4 more pass
   `--dist` depending on where the bundler puts them.
3. §2b is **RED on the clean tree in 2 of 4 chromium runs**: a stray far-right cluster fails the tail clause (G4).
4. The spec and the gate import the chair's libraries from `docs/…/pass7/instruments/`. On the work tree a bare
   `node scripts/check-peer-tin.mjs` exits 1 (`ERR_MODULE_NOT_FOUND`), and the spec's default path is RED until the
   chair lands the TAIL fix.

---

## 0 · NUMBERS FIRST (re-run by me)

### 0.1 §2b and the whole spec file, painted, DPR 1, 1280×800, FINE, B pinned `p-0000000b0b0b` ("quickest-rodent")

`readings/s2b-critic-runs.txt`. HEAD is the lane's off-subject clone in HEAD's best ink. My numbers match the lane's to
the third decimal on every product row.

| run (instruments) | exit | product core median, light · dark | HEAD off-subject, light · dark | load |
|---|---|---|---|---|
| WHOLE file, chromium (PROPOSED glyph-pop) | **1: 6 passed, §2b FAILED** on the clean tree (§1.3) | 2.122–2.210 · 2.954–3.448 | 1.739–1.954 · 2.698–3.387 | 21.5 |
| WHOLE file, webkit | **0: 7/7** | 8.755–9.484 · 5.923–6.063 | 4.040–4.276 · 5.423–5.620 | 39.7 |
| §2b re-run 2, chromium | 0 | same | same | 16.7 |
| §2b re-run 3, chromium | 0 | same | same | 22.5 |
| §2b, chromium, the CHAIR's unpatched glyph-pop | **1**: TAIL12 judged GREEN both themes (the lane's MOVED row, CONFIRMED) **and** the same clean-tree G4 stray at light cell 12 (1.33) | — | — | 20.0 |

**The in-run plants on the clean runs.**

- Chromium: 12 of 12 RED (six plants × two themes).
- WebKit: 11 of 12. FADE80 dark is printed GREEN, which is the WebKit fill-fade void the lane declared.
- The in-run negative, the pass-5 dark ring arm, reads 3.921 flat in chromium and 3.926 in WebKit, both < 4.5.

**The pass-6 PLANT, run first.** This is my predecessor's FAINT line on the tape's own rule
(`GameBoard.vue:1262`, `-webkit-text-fill-color: color-mix(in srgb, currentColor 30%, transparent)`), on a
replica. §2b **exits 1 in chromium and 1 in webkit**:

- **6 of 6 product keys RED per engine.** The lane's "12/12" counts each key twice; its own logs show 6 per engine.
- Chromium reds on G3 (fraction 1.000 against bounds of 0.660–0.850) plus G4.
- WebKit reds on the absolute G2 (2.717–2.988 < 4.5) plus G3.
- The flat statistic stays GREEN under the plant (8.423 light, 0 px under). The painted clauses are what see it,
  as they must.

### 0.2 GATE 4, bare, on an rsync replica (`readings/gate4-attack7.txt`, `instruments/g4attack7.sh`)

- **The pass-6 set, run first** and re-pointed at the moved pink (`#ffb2f3`): D1, D2, D4–D14 all exit 1 (13 of 13).
- **D3 is ACCEPTED as argued.** Through the shared parser, `lch(79.5% 36 350)` resolves to `rgb(255,172,210)`, which
  is ΔE 0.0443 from the pink name, outside `COPY_DE` 0.03. The arm's own lch spelling, `lch(86.5% 50 345)`, resolves
  to ΔE 0.0049 and reds.
- The baseline exits 0, the replica is restored byte-equal, and `lint:tin` (`--self-test`) exits 0.
- **Fresh publishers:** 26, as listed below.

| fresh publisher (source gate) | exit |
|---|---|
| D26 `color(display-p3 …)` · D27a `hsl(5.4rad …)` · D27b `hsl(343.8grad …)` · D31 `rgb(255 178 243 / 50%)` · D37 CIE `lab()` · D38 `oklch(… / 0.5)` · D40 `"#FfB2F3"` | **1** (7 of 7) |
| D23 `"#" + (0xffb2f3).toString(16)` | **0** |
| D24 `["#ff","b2f3"].join("")` | **0** |
| D25 `` `#ff${"b2f3"}` `` | **0** |
| D28 `"\x23ffb2f3"` | **0** |
| D29 CSS escape `#ff\62 2f3` | **0** |
| D30a `class="text-indigo-200"`: Tailwind's `oklch(87% .065 274)`, **ΔE 0.0111 from the violet name** | **0** |
| D30b `class="text-teal-800"`: **ΔE 0.0158 from the teal stick** (`readings/tailwind-palette-vs-arms.txt`: 8 Tailwind colours sit within 0.022 of an arm; `indigo-300` is 0.0088 from the dark violet ring) | **0** |
| D32 `color-mix(in oklch, var(--color-peer-cursor-ink) 60%, white)`, derived through the cell's indirection token | **0** |
| D33 `` setProperty(`--color-${"peer"}-${i}-name`, …) `` | **0** |
| D34 `"--color-peer-".concat(String(i), "-name")` | **0** |
| D35 `["--color-peer", i, "name"].join("-")` | **0** |
| D36 `oklch(from #000 0.856 0.121 332.4)`, a relative colour with literal channels; the parser returns NaN | **0** |
| D39 `const P = "b2f3"; "#ff" + P` | **0** |

### 0.3 GATE 4 `--dist` on BUILT bytes (`readings/gate4-dist-plant.txt`, `readings/dist-stripjs-blanking.txt`)

**The clean dist.** Built from the archive: `index-BRQ9Cl7IHzwm.js`, 286 files read, exit 0.

**The planted dist** (`index-BgsNT7DNdzER.js`). I appended the fresh plants to `src/main.ts` and `gameCell.css`,
built, and ran `--dist`. It exits 1, but **only on the CSS**:

- D29 is normalised to `#ffb2f3`.
- D30's `--color-teal-800` and `--color-indigo-200` are caught in hex, p3 and lab spellings.

**The entry chunk ships this verbatim:**

`__tincrit7=["#ffb2f3",["#ff","b2f3"].join(""),"#ffb2f3","#ffb2f3","oklch(from #000 0.856 0.121 332.4)","#ffb2f3",…]`

The bundler folded D23, D25, D28 and D39 into four byte-exact copies of the pink name. They drew **0 findings
from any `dist:*.js` file.**

**The mechanism.** The library's `stripJs` doesn't recognise regex literals. The entry chunk's
`.replace(/\//g,"_")` opens a `//` line comment on a line of about 200 KB, so everything to the newline is blanked.

| chunk | blanked | from |
|---|---|---|
| entry `index-*.js` | **14.3 %** | byte 185,750 of 217,448 |
| `vue-vendor-*.js` | **95.8 %** | byte 1,828, at `/\/\*[^]*?\*\//g` |
| all 25 JS chunks | **26.2 % of bytes** | — |

The lane's plant, `["#ff"+"c1a1"]`, was appended after the chunk's one newline, which is the only reason it reds.
The self-test's bundle control is a synthetic one-line file. **A gate that shipped with a negative placed where it
can't fail.**

**Through both tiers, six fresh shapes escape wherever they sit:** D24, D32, D33, D34, D35 and D36. **Four more
escape by position:** D23, D25, D28 and D39.

### 0.4 F1's unit (`readings/f1-unit-plants.txt`, on `useSession.ts` `411e934d`)

| plant | `useSession.test.ts` |
|---|---|
| clean | **38/38, exit 0** |
| `withSelfInk` ignores the switch (`SELF_TAKES_A_HAND &&`) | **1 failed / 37, exit 1** (the both-arms test) |
| both call sites pass `false` | **3 failed / 35, exit 1** |
| only the line-657 call site passes `false` | **3 failed / 35, exit 1** |

The unit is closed, and it holds at the call site as well as in the helper.

### 0.5 Constraints and battery rows (bare, on the archive = the tree)

| row | tree | control 74a2b5d9 |
|---|---|---|
| `check-copy-register` · `lint:copy` | 0 · 0 | the lane's 0 |
| `lint:tin` (env set) · bare `check-peer-tin` on the **work tree without the env** | 0 · **1 (`ERR_MODULE_NOT_FOUND`)** | script absent |
| `lint:theme-tokens` · `lint:lanes` · `lint:sleep` | 0 · 0 · 0 | the lane's 0 |
| undefined-token census (pass-6 copy, `FE=`) | **1** = 0 bare + 1 declared STALE | **1**, the same row (re-run on `w7-control`'s files, read-only) |
| `--color-peer-name-ink` in `src/` + `e2e/` | 0 | — |
| delta `+` lines naming filter / `@property` / transition / animation (product) | 0. `PlayerTick.vue`'s "no live filter" comment is the only hit | — |

- **The name arm has ONE consumer.** `nameInkOf` is read only at `GameBoard.vue:541` (`hoveredAuthor`), so the light
  exemption's argument ("one name at a time, on the tape") holds by grep.
- **Not re-run by me:** π built-vs-built (the lane's 0 over 1155/1115 nodes, with its 81 plant), the goldens,
  `vue-tsc`, the chunked vitest (the lane's 68 files / 838), and the DPR-2 rows. The delta is room-only by code-read:
  one `.dark` hex consumed only through `nameInkOf`, and the cell spread back to two keys.

---

## 1 · GAPS FIRST (each closable, numbers attached)

### 1.1 `--dist` can't read 26.2 % of the shipped JS, and its negative control sits where it can't fail

`--dist` is this pass's CI row, wired into the `dist` lane.

**The failure.** It passes a built bundle carrying four byte-exact copies of `#ffb2f3` in the entry chunk (§0.3). The
string-aware stripper treats a regex literal (`/\//g`, `/\/\*…/`) as a comment opener, so it blanks:

- **14.3 % of the entry chunk** (from byte 185,750);
- **95.8 % of `vue-vendor`**.

The lane's plant was appended after the chunk's newline.

**Closable:**

- The bundle is read without a comment stripper. Minified output carries no comments but its licence banner, and the
  shipped bytes are what ship.
- Or `stripJs` learns regex literals: this is the chair's library, a MOVED row, and I've written no PROPOSED diff.
- The `--dist` self-test plants its literal **inside** the real entry chunk, at an offset after the first regex
  literal, and reds.
- The planted build above (D23/D25/D28/D39 in `main.ts`) must exit 1 on a `dist:*.js` finding.

### 1.2 GATE 4's class is still enumerated: 13 of 26 fresh shapes pass the source gate, and 6 pass both tiers

**These red:** the colour spaces (p3, rad/grad, slash alpha, lab, mixed case).

**These don't:**

- the folds `fold()` doesn't do: `.join`, a template, a `\x23` escape, a CSS `\62` escape, a const identifier and a
  packed int;
- **Tailwind palette classes within ΔE 0.009–0.022 of an arm** (`text-indigo-200` against the violet name at 0.0111,
  `text-teal-800` against the teal stick at 0.0158);
- a colour derived through the cell's indirection token (`var(--color-peer-cursor-ink)`);
- three minted-token spellings (split template, `.concat`, `.join`);
- a relative colour with literal channels, which the parser returns as NaN.

`--dist` catches D29 and D30 on the CSS, and nothing in the JS (§1.1).

LAWS P6 §F says a gate cured for its plants is not cured for the class.

**Closable:**

- Read Tailwind utility classes: resolve `(text|bg|border|fill|stroke|…)-<palette>-<n>` against
  `tailwindcss/theme.css` (286 colours, all parsed by the shared parser), or rely on `--dist` once §1.1 holds.
- Key the minted rule on any `setProperty`/computed key whose first argument is not a string literal while the
  literal prefix `--color-` is in reach.
- Key DERIVED on `color-mix|from` over **any** `var()` that resolves (through `inkFor`'s keys) to a peer arm.
- The parser resolves relative colour syntax with literal channels.
- Or write the exempted shapes into the gate's header as the chair's estate row, with this table.

### 1.3 §2b is RED on the clean tree in 2 of 4 chromium runs, so the gate is not stable

The red rows:

- **Run 1** (whole file, load 21.5): `chromium·dpr1·dark·cell12·peer-1…5`, "G4 slice core (p95) under 3.00 … at
  **15:1.26**".
- **The chair-copy run** (load 20.0): the same five keys in **light**, "under 4.77–5.26 … at **15:1.33**".
- Re-runs 2 and 3 are GREEN, and the lane's own two whole-file runs were GREEN.

**What the red rows share.** Each is an override row at cell 12. The population carries a ≥ 8 px cluster in the
far-right slice at p95 1.26–1.33, with `transient 0`. On cell 11 the extent widens too: slices 0 and 12–15 are empty,
where the green runs read all 16.

**A hypothesis, not proven.** Something non-text under the label's clip changes between the ON and OFF photographs of
one pair. Two candidates: the tally svg (`${subject} *` turns it transparent too), or a live neighbour. The probe
prints `transient` for the ON pair only and never compares the OFF pair. The spec's own older `paintedTick` excludes
both pairs' movers.

This is not a rate gate, but LAWS P6 §F's rule applies in spirit: a red on a clean run is a defect, not noise.

**Closable:**

- Run §2b ≥ 5 times per engine on the clean tree with 0 reds, and print the far-right cluster's source.
- Clip the population to the TEXT RUN, as the PROPOSED TAIL fix already does for the tail. That makes a second
  PROPOSED row on the chair's glyph-pop.
- Or exclude a pixel that moved in either pair.

### 1.4 The two libraries are imported from the evidence tree, so the default path is RED

- **The gate.** On the work tree, a bare `node scripts/check-peer-tin.mjs` exits 1 with `ERR_MODULE_NOT_FOUND` (§0.5).
- **The spec.** It needs the lane's PROPOSED glyph-pop. With the chair's copy, TAIL12 is GREEN in both themes, and
  I confirm that (§0.1).

The lane declares both. They stay gaps, not credits.

**Closable:**

- The fold lands `shape-census.mjs` and the patched `glyph-pop.mjs` at product paths, re-points both imports, and
  re-runs `lint:tin` bare with no env, exit 0.
- CI's `dist` lane reads the same path.

### 1.5 B-TAPE's firing default loses to the control in 10 of 72 chromium dark rows

LAWS P5 §G: "A ballot's firing default must not lose to the control on the same painted statistic." It is kept. P6
adds: name the loss.

The lane named the loss (pink −0.08…−0.45; green and teal at DPR 1). I read it too: dark cell 11 pink −0.495, teal
−0.328, green −0.258.

**The catch.** "HEAD" here is HEAD's BEST hue (`oklch(0.8 0.11 137.5)`), not HEAD's ink for the same player index.
So the loss may be an artefact of a conservative control. The pass-6 critic's same-index reading had pink WINNING
(5.19–6.71 against 4.80–5.92, on the ≥ 50 %-coverage core).

**Closable:** re-read the 10 losing keys against HEAD's same-index ink (`oklch(0.8 0.11 190)` for B's index 4,
and so on) on the whole-population statistic.

- If pink still loses, the chair rules the P5 row against the named loss.
- If it wins, the ballot carries both controls.

### 1.6 The light name exemption leaves an ungated set of arms at ΔE 0.0769 that paint at the same time

- **The exemption is sound for NAMES.** They have one consumer, the hovered tape (§0.5). The 0.075 floor is written
  into the gate with its self-test halves, and I accept it.
- **But the same five light hexes ARE the ring arms.** Peers' cursor rings paint concurrently on one board, and their
  green–teal pair is 0.0769 with no gate reading ring separation. The gate prints it only.
- The exemption's own argument ("one at a time") doesn't cover them. This is the §2.4 pair, so it's the chair's row
  more than TIN's.

**Closable:** gate 2 prints the ring pair's floor and argument beside the name's, or the chair books ring
separation as §2.4's row with the 0.0769 figure.

### 1.7 Carried, with numbers, not the family's alone

- **The roster at ten reads n−1 on both trees.** Cited, not re-run, for the chair or W8.
- **WebKit voids the fill fades** (FADE80 GREEN 3/4, and 1/2 in my clean run). The chair's probe row.
- **Chromium DPR 1's G2 is 0.9 × the stamp.** It is lawful by LAWS §E's "wherever the control clears it", because
  HEAD reads 1.74–3.39 there. It is still a relative clause on the one config where the product reads under 4.5; G3
  and G4 carry the absolute load there.
- **WALK has bound the ink but not the separation law** (the lane's row 7). Watch 2 is half met, and it's the chair's
  to open.
- **Count inflation.** The lane's "12/12 product rows RED in each" engine is 6 keys per engine (§0.1). The claim holds
  and the count is doubled.

---

## 2 · The advance, credited

- **F1 is closed at both ends.** The switch is an argument, one test runs both arms, and the helper plant and both
  call-site plants red (1 fail and 3 fails).
- **§2b now does what pass 6's could not:**
  - it reads the whole glyph population with an absolute G2 wherever the control clears;
  - EMPTY reds on G1 and never on `min(4.5, 0)`;
  - FAINT, TAIL (with the PROPOSED fix) and EMPTY red in-run in both engines;
  - the pass-6 FAINT-on-the-rule plant reds 6/6 keys per engine on painted clauses while the flat statistic stays
    GREEN.

  The off-subject clone is a comparison row that no clause reads, so the pass-6 cancellation is gone.
- **The painted numbers reproduce to the third decimal.** Product light: chromium 2.122–2.210 and webkit
  8.755–9.484. Dark: 2.954–3.448 and 5.923–6.063. The flat ink reads 5.076–8.866 with 0 px under.
- **The separation law is real in dark.** The pink move is ΔE 0.005 (L 0.8564, inside 4b's band), and it lifts the
  pair from 0.0983 to 0.1011, gated at 0.10. D22 reds.
- **GATE 4 moved from spellings to a parser.** It reds 13/13 of the pass-6 set on the moved arm, and 7 of the 7
  colour-space variants I added. The TIN copy of the parser is not hand-rolled (LAWS §I).
- **The consumer-less third key is gone.** Both `inkFor` keys are unit-asserted for i = 0…11, and the name lookup has
  one reader.
- **The F1 frame is lawful.** I looked at it: one payload, one variable (the const), and YES amber `5` against NO
  blue `5` with the peer's olive `7` unmoved, in both engines. It replaces the struck-URL-arm frame by name.
- **The bank is honest.** `apply --check` gives 0, the applied archive is `diff -rq`-equal to the tree, the dist hash
  reproduces, and the sha1 pair is equal at battery and bank.

## 3 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | clear (F1 holds at both ends) |
| spec-cites-itself | clear. The pass-6 cancellation is cured; the stamps are the shipped reading + 0.05, which is lawful until the estate stamps |
| gates that cannot fail | **HIT**: `--dist`'s negative sits past the blanked region, so 26.2 % of the shipped JS can't red (§1.1) |
| elegant-reduction trap | **HIT (soft)**: "one parser" is claimed for the class, but 13/26 fresh shapes pass (§1.2) |
| legacy aliases | clear (the light name is the ring by design, argued, floored) |
| masked fallbacks | **HIT (soft)**: the default import path fails (`ERR_MODULE_NOT_FOUND`); env overrides mask it in every GREEN row (§1.4) |
| unverified gestalt | clear. F1 is framed; the pink move is ΔE 0.005 and unframed, which is lawful |
| consumer-less substrate | clear (the third key is struck) |
| the generic default | clear |
| π | not re-run by me: the lane's 0/1155/1115 with the 81 plant; room-only by code-read |
| the constraint it forgot | **HIT (soft)**: P5 §G, a default that loses to the control on the same statistic (§1.5); ring-arm separation (§1.6, the chair's) |
| AA both themes, PAINTED | CLEAR on the product binding both engines; chromium DPR 1 under 4.5 for HEAD and the tree alike (§1.7) |
| filterBudget | clear by construction (0 filter lines in the product delta) |
| M16 | clear (`check-copy-register` 0) |
| @property | n/a (nothing registered) |
| undefined-token census | clear: 1 STALE on both trees |
| decided history | L6 is WALK's; no r0 row moved; the chair's glyph-pop TAIL row is MOVED (the lane's, CONFIRMED) |
| W2's landed mechanics | respected |
| stability | **HIT**: §2b is RED on the clean tree in 2/4 chromium runs (§1.3) |

## 4 · Ballots (both frames looked at)

- **F1 (YES | NO).** Ready for the owner. The frame is lawful and the NO arm is held in CI.
- **B-TAPE, the ink half.** Pass-6 frame 1 stands, since amber did not move. The loss is named, but against HEAD's best
  hue. Re-read against HEAD's same-index ink before the chair applies P5 §G (§1.5). The chroma costs are stated.
- **B-RING (the chair's).** The lane priced the raise at dark ring 3.953–4.258 against 3.277–3.620 (not re-run by me).
- **The light exemption (the chair's).** Sound for names. The ring half is §1.6.

## 5 · What closing costs

A day. None of it is a missing primitive:

1. read the bundle unstripped, or regex-aware, and plant inside the chunk;
2. read Tailwind classes, minted keys by shape, and derivation through indirection;
3. clip the glyph population to the text run and prove 5 clean runs per engine;
4. land the two libraries at product paths;
5. read the losing keys against the same-index control.

## 6 · Incidents (self-declared)

1. **A bad build flag.** My first combined build passed `--root` to `vite build`, which rejected it (exit 1). I
   re-ran from the archive's own directory; that dist hashes to the lane's `index-BRQ9Cl7IHzwm.js`.
2. **A bad vitest flag.** My first F1 battery used `--cacheDir` on vitest, which rejected it (exit 1 on all four,
   no test run). I re-ran with `--no-cache`, and the numbers above are from that run.
3. **The planted build's `main.ts` plant also enters the SOURCE scan.** Its source findings are absent because the
   fresh shapes escape the source gate by design (§0.2). The `dist:*` rows are the ones read.
4. **Plants lived only in scratch.** They were in `tincrit7/g4` (rsync, restored byte-equal), `tincrit7/archp`
   (planted build) and `tincrit7/archf` (FAINT replica). The F1 plants ran on the rsync copy and were restored
   `cmp`-equal.
5. **No `rm` of any form.** The fresh-publisher files were `mv`ed to `trash-tincrit7-1/`. Scratch is
   `<scratchpad>/tincrit7/`, the chair's to clean. The Playwright config lived in the scratch archive, never in a
   tree.
