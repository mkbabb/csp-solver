# PAL-WALK · pass-4 adversarial critique (§11c, the hue walk)

Written by the pass-4 critic, who wrote neither the charter nor the prototype. Every number not
attributed to the lane was taken by this critic on its own servers, 2026-09-22:

- **My build** of the work tree (`wf_308fa864-c94-1`, uncommitted on `74a2b5d9`): private cacheDir,
  outDir in scratch, served on `:4240`. Identity `index-lnPxRYSQy7kV.js`, 43 files.
- **The control:** `w7-control` on `:4241`, identity `index-CubiZsMVSwTc.js`.
- **Dev servers:** the work tree on `:4242`; the control tree on `:4243`, whose private cacheDir is in scratch. Both were verified by source (`SELF_TAKES_A_HAND` 2 hits on `:4242`, 0 on `:4243`).
- Chromium and webkit throughout.

All four servers were killed by recorded PID. Instruments and condensed readings are in `critique/PAL-WALK/`.
**No frame is banked here.** The family's four-crop cap is spent by the lane's frames, and the one
picture this critique would add (row G2) is written up as numbers, with the re-shoot named.

**Verdict: ADVANCE. Convergence: 76%** (pass 3: 72). The lane closed most of the charter's thirteen rows
honestly, and I reproduced them. Four new gaps hold the number down, and each came from running an instrument
that could fail:

- the wire rule fails in the delivery order the wire actually produces;
- the tape "cure" is flat-card arithmetic, and on the painted ground it reads under 4.5 at night;
- the band comparer can't see a rebinding written anywhere except index.css's two arms;
- the F1 ballot pair is unpinned.

---

## 1 · Re-measured (both engines, my servers)

| row | lane | critic chromium | critic webkit |
|---|---|---|---|
| Tier 3 `e2e/peer-walk.spec.ts`, whole spec | 6/6 | **3/3 pass** | **3/3 pass** |
| §A ring worst of 144, light / dark | 3.158 i6 / 3.430 i5 (wk 3.450 i107) | **3.158 i6 / 3.430 i5** | **3.158 i6 / 3.450 i107** |
| §A AA digit bg/card/popover/wash, light | 7.098/7.270/7.164/6.687 | **same** | same |
| §A same, dark | 5.310/5.197/5.270/4.708 (wk wash 4.614) | **same** | same |
| §A tape arithmetic, ring string / digit string / HEAD | 10.790·5.216 / 6.493·2.993 / 4.777·5.474 | **same** | 10.783·5.216 / 6.489·2.993 / 4.774·5.474 |
| §A painted hue: nearest token, digit / ring | 12.906·13.048 / 12.906·13.066 | **same** | same |
| §A drift: digit / ring | 0.892·1.166 / 1.695·1.353 | **same** | same |
| §A §6 candidates α .55/.65/.80 | 3.158/4.091/6.288 · 3.430/4.321/5.876 | **same** | light same · dark 3.450/4.319/5.920 |
| §B five hands, core worst (dpr 3) | 3.158 i6 · 3.430 i5 | **3.158 i6 · 3.430 i5** | **3.158 i6 · 3.485 i5** |
| §C tape name on a real local session | 10.854 / 5.710 | **10.854 / 5.710** | **10.847 / 5.710** |
| filter census on a BUILT dist | 12/12 | **my clean build: 12/12** (G3.1–G3.5) | included |
| goldens on a built dist | 4/4 | **my clean build: 4/4** | (the golden config is chromium) |
| `filterBudget.ts` vs `74a2b5d9` | byte-identical | **cmp identical** | — |

**Session π, which is new here.** The lane's π is a SOLO census (854 nodes). A solo board binds no player ink, so
it can't see what this family moves in a room. I added a session census: a live two-page `?wire=local` room on
the encoded `?board=` payload, with the peer's digit in cell 8 and the peer's cursor on cell 80. I read the
computed paint (colour, fill, stroke, opacities, font, line-height, filter, transform) and the tag of every HTML
and classed-SVG node under `.board-wrapper`, prototype against `74a2b5d9`:

- **Negative control** (head-vs-head): 0.
- **π with the two claimed cells excluded:** **551 nodes · 0 one-sided · 0 paint/tag deltas · 0 rects >0.01 px**, in both engines.
- **Positive control** (claimed cells included): 563 nodes · **1 paint delta**, the `cell-ghost-path` ring (`oklch(0.5 0.11 137.5)` → `oklch(0.32 0.0576 181.79)`), in both engines.

The π claim holds in a room, not only solo.

**The gates, run bare** (`readings/gates-bare.txt`): all exit 0.

- The node gates: arcs, lanes, copy, motion, theme-tokens, sleep, ink, pw-projects, theme-selectors, catch, live-regions.
- eslint on the six touched files, `prettier --check src scripts`, `vue-tsc -b`.
- MOT-VERB's undefined-token census (copied from `wf_f72f3b5a-83a-59`): 140 declared, 0 bare `var()` undefined in any slot.
- M16: `check-copy-register` 0 dashes, 0 unadmitted.
- The @property law: this family registers nothing and consumes the tape's `var(--color-peer-cursor-ink)` bare. It's clear.

---

## 2 · What did not converge (new this pass, each measured)

### G1 · The wire rule fails in the order the wire actually delivers (BLOCKING for the section)

`onMessage("st")` returns on `!newer(e, ledger.epoch)` (`useSession.ts:846`) before `adoptInk` runs. A `hi` is
answered by every page that holds the board, and every answer carries the SAME epoch. So the page whose `st`
lands first decides the room's assignment for a joiner. If that page is a relayer, the author's word for the same
epoch is dropped whole.

U9 doesn't hold this case. It sends the author's word at a NEWER epoch (`e: 4` after the relayed `e: 3`), which
is not a frame the wire produces for one board. U1's comment says "relays the SAME epoch" and its frame says
`e: 4`, so it has the same defect.

**Measured.** I appended a unit to a SCRATCH copy of `useSession.test.ts` (`instruments/S1-same-epoch.unit.ts`,
`readings/S1-same-epoch.txt`). A relayer's `st` (`peer-3 → 9`), then the author's `st` at the same epoch
(`peer-3 → 6`), then `peer-3` joins. **S1 is RED.** The joiner inks peer-3 `oklch(var(--peer-ink-l) 0.0762
189.44deg)`, the relayer's hand, where the author says `0.1105 124.79deg`. The control S2 (author first, same
epoch) is green, and the other 44 units are green.

This is the family's own law broken in its most ordinary room: *"a colour that is one thing on your screen and
another on everyone else's is a page's colour, not a player's."* The lane's gap 4 named the case as "read from
code". It's now a red unit.

### G2 · The tape "cure" is flat-card arithmetic; the painted ground refutes it at night

§A, §C and B-TAPE's 5.308 all composite the washi over the flat `--color-card`. But the tape is translucent
(`hsl(24 5% 21% / 0.92)` dark, `hsl(0 0% 100% / 0.82)` light), and it always straddles the grid line between the
hovered cell and the one above it, with a digit often under it too.

**The instrument** (`instruments/critic.tape.spec.ts`): a real local session on the encoded board, the name
photographed twice (as drawn, then with its colour set transparent). Every pixel the text changed is read against
the ground the tape actually paints there. Three cells have a given above them, plus one top-row cell where the
tape flips below. 1280×800 dpr 3, fine pointer (mouse hover), peer i=1 (teal 181.79°).

| name on the painted tape, dark | chromium: spec vs painted ground, worst · px < 4.5 | chromium: painted core, worst · px < 4.5 | webkit: spec, worst · px < 4.5 | webkit: core, worst · px < 4.5 |
|---|---|---|---|---|
| **prototype (ring string, B-TAPE a)** | **4.374** · 93–477 of ~4430 per hover | **4.075** · 127–390 of ~3400 | **4.378** · 149–428 (top row 3.185 · 376) | **4.038** (top row 2.455) |
| HEAD `74a2b5d9` (its i=1 ink) | 4.589 · **0** | 4.372 · 10–26 | 4.594 · **0** (top row 3.342 · 20) | 4.340 |

In light, the prototype is clean (core worst 6.346 chromium / 6.250 webkit, 0 core px under 4.5). HEAD in light is
under at 3.469 core, which is HEAD's own row.

In dark, the painted ground under the name runs luminance 0.0474–0.0772, which is the flat composite up to the
grid line under the tape. So the shipped arm reads **4.374 against 5.710 on the arithmetic for the same hand**,
and it is **worse than HEAD on the same cell and board** (HEAD has 0 px under 4.5). §A's worst of 144 (5.216 at
i=68) puts the painted worst near 4.0 by the same drop; that figure is an estimate, not photographed.

"CURED" in the lane's row 4 is therefore unearned. The tape is the family's ballot row (U-10), and this is the
number the owner needs on it. Frame 4 shows the tape over a dark gap between cells; it doesn't show the grid line
under the text, so it is not the frame that decides.

### G3 · `check-peer-arcs` check 3 reads index.css's two arms and nothing else in the cascade

The ring and digit strings carry `var(--peer-*-l)`, so the painted lightness is whatever the CASCADE says at the
cell. The pass-3 ablation was exactly that: a runtime rebinding.

**Break battery** on a scratch copy (`instruments/palwalk-critic-breaks.sh`, `readings/check3-break-battery.txt`):

| | break | exit | verdict |
|---|---|---|---|
| B1 | `.game-cell { --peer-ring-l: 0.2 }` in `gameCell.css` | **0** | blind |
| B3 | `--peer-ring-l: 0.2` on `.attribution-tape` in `GameBoard.vue` | **0** | blind |
| B2 | a `prefers-contrast` arm in index.css | 1 | caught |
| B4 | a second `:root` declaration | 1 | caught |
| B5 | an inline literal table at the call site | 1 | caught |
| B6 | a table shadowed inside the `at` helper | 0 | benign direction: a darker band only lowers chroma |

B1 and B3 are the 0.32 → 0.20 catastrophe (18.258° measured in pass 3), written one file over, and CI stays
green. Tier 3 can't see them either:

- §A reads both bands off `document.documentElement`.
- §B sets the band on the root and asserts contrast only: a darker ring passes ≥3.0, and hue isn't asserted there.

The lane's self-declared scope ("reads one module") is the TS side of this hole. The CSS side is undeclared.

### G4 · The F1 ballot pair is unpinned (chair addendum 2026-09-19)

The lane's own probe (`probe/pal-walk-peer.spec.ts`) deals `SOLO = ?size=3&difficulty=EASY` with no `?board=`.
The YES arm wrote cells 1 and 3 and the NO arm cells 7 and 15 (chromium; webkit 6 and 14), so the two are two
boards. Under the addendum, a ballot pair is **contaminated until both arms load one encoded board**. The frame
also composites unequal crops over a #808080 fill (a grey slab under the YES arm).

The B-TAPE pair (frame 4) is ONE session with a style swap, so it is sound. Frames 1 and 2 are single-arm frames.

### G5 · The pin rule's headroom is density-scoped, and the comment doesn't say so

The token comment reads *"the LIGHTEST light arm … that clear 3.0 PAINTED … with at least 0.10 of headroom"*.
Every lane row was photographed at dpr 3. I re-ran §B at other densities (`readings/ring-core-dpr1-dpr2.txt`; five
hands per arm, isTheRing true on all 40):

| density · engine | light core worst | dark core worst |
|---|---|---|
| dpr 1 · chromium | **3.115** (i=6, headroom 0.115) | 3.367 |
| dpr 1 · webkit | **3.077** (i=6, headroom **0.077 < 0.10**) | 3.459 |
| dpr 2 · chromium | 3.158 | 3.430 |
| dpr 2 · webkit | 3.158 | 3.485 |

The core still clears 3.0 in every regime. The headroom clause the rule rests on fails at dpr 1 in webkit.

The same comment calls the ring "a 4px antialiased line". §B's own log paints `stroke 1.89px` (CSS px, path
54.8×54.7), so the width in the sentence is not the line's.

### G6 · The grafts row is mis-stated

The lane says *"there's no PLR-SELF pass-4 `substrate.diff` in this lane's reach"*. In fact
`pass4/prototype/PLR-SELF/substrate.diff` (111,301 B) was banked 2026-09-19 06:26, three days before this pass. It
seats `LOBBY_COPY`, the section's one copy home (registry §2.5), and it touches `BoardHost.vue`, `useSession.ts`
and `index.css`, three of this family's own files. The `{slug} is here` clause stays an un-homed string in
`useGameCell.ts`, and the fold conflict on three shared files is unpriced.

### Carried from the lane's own gaps (still open, agreed)

- **The flank statistic** (the chair's call, §2.4). At 90 % of core change, 107/144 light hands (wk 106) have a scan under 3.0. At i=6 it's **44/44 scans** (my run too). At 0.28 it's still 85/144 and costs chroma 0.0477.
- **F1's NO arm** reds U2/U7/U8. It builds but isn't green; that's the ballot's price.
- **The gestalt frames** (four and eight hands) are gone. The owner's picture for "four legible, eight not" has to be re-shot.

### Incidents I found in the record

1. **Built-arm identity isn't reproducible.** The lane's `index-_PLR3gP2PHUZ.js` isn't what the product files build. My clean build is `index-lnPxRYSQy7kV.js`. The only content difference is `index-*.css`, which carries two extra Tailwind utilities (`.text-wrap{}`, `.capitalize{}`) minted from a file present at the lane's build and gone since; they're in neither the product files nor the banked probes. The control carries neither. The effect is inert, and goldens 4/4 plus the filter census 12/12 re-run green on the clean build, so those rows stand on my build, not the lane's.
2. **The prettier incident is mis-described.** The lane says "`e2e/` isn't prettier-ignored in this tree". It is: `.prettierignore` names `e2e/` with the sleep-lint EXEMPT-anchor reason, the class's second bite. `--write` on `e2e/` is the trap, whatever the file.
3. **Row 8's "one consumer" of `--color-popover` is two.** `AttributionCard.vue:169` and `GameGallery.vue:1017` (`bg-popover`). Neither is a player surface, so the conclusion stands.

---

## 3 · Checklist

| item | verdict |
|---|---|
| vacuous convergence | clear: every row carries a number and a control |
| spec-cites-itself | **HIT (mild).** U9 is written to the critic's sentence, not to the wire's delivery; the same-epoch case it names is RED (G1) |
| gates that cannot fail | **HIT.** Check 3 is blind to a band rebinding outside index.css's two arms (B1/B3 exit 0); tier 3 §A reads the root |
| the elegant-reduction trap | **HIT.** The tape is "cured" on a flat-card composite; the painted ground (grid line under the text) is the hard part (G2) |
| legacy aliases | clear: `seedFor` is inlined, and the null-source branch is split honestly |
| masked fallbacks | clear for this diff (the tape var is bare; the `?? []` is gone). `gameCell.css:230/232` fallbacks are MRK-LIVE's cited rows |
| unverified gestalt | **HIT.** The F1 pair is two boards (G4); the four/eight-hand gestalt frames are gone |
| consumer-less substrate | clear: the exported band tables are read by the tier-2 unit |
| the generic default | clear |
| the pixel it moves that it did not declare (π) | clear: solo π 854 nodes (lane) and session π 551 nodes (mine), 0/0/0 both engines, with negative and positive controls |
| the constraint it forgot | **HIT.** AA from PAINTED bytes on the tape: dark 4.374 / 4.378 with up to 477 px under 4.5, worse than HEAD (G2). filterBudget 9 clear (12/12, `filterBudget.ts` identical). M16 clear. W2's mechanics untouched (π). Decided history: L6 correctly PROPOSED, not landed. @property: nothing registered. Undefined-token census: 0 |

## 4 · Open gaps, each a sentence that closes it

1. **G1:** in the `st` handler, let a same-epoch `st` whose sender is the epoch's author run `adoptInk(k, true)` without re-adopting the board, and land S1 (relayer first, author second, same epoch → author's index) beside U9, re-dating U1's and U9's frames to the same epoch.
2. **G2:** price the tape name on the PAINTED ground (the grid line under it) in both themes and engines. Either cure it (a darker or opaquer tape, or a name band chosen for the painted ground) until the dark row clears 4.5 over the line, or carry 4.374/4.378 (and HEAD's 4.589) into B-TAPE as its number, with a frame showing the name crossing the line.
3. **G3:** extend check 3 to fail on any `--peer-ink-l` / `--peer-ring-l` declaration in `src/**/*.{css,vue}` outside index.css's two arms, with B1 (gameCell.css) and B3 (GameBoard.vue) as self-test rows.
4. **G4:** re-shoot the F1 YES|NO pair on ONE encoded `?board=` payload (both arms decoding the same givens, the same cells written), with equal crops.
5. **G5:** scope the pin rule's "0.10 headroom" to dpr ≥ 2 in the token comment, or re-pin against dpr 1 webkit (3.077 at i=6), and correct "4px" to the painted 1.89 px stroke.
6. **G6:** take PLR-SELF's banked `substrate.diff` (`LOBBY_COPY`) as the copy home for `{slug} is here`, or state why the cell name is not lobby copy, and price the three-file fold overlap (`BoardHost.vue`, `useSession.ts`, `index.css`).
7. **The flank statistic:** the chair rules core versus 90 % flank for §2.4 (107/144 light hands, 44/44 scans at i=6).
8. **The gestalt:** re-shoot the four-hand and eight-hand frames for the owner on one encoded board, replacing a crop, not adding one.
9. **F1 NO:** re-aim U2/U7/U8 behind the switch so the NO arm is green as well as buildable, or state in the ballot that firing NO costs those three units.

## 5 · Strengths (earned)

- **Every lane number I re-ran reproduced to three decimals in both engines**: §A, §B at dpr 3, §C, the §6 candidates, the painted hues and drifts.
- **Row 1 closed:** `lint:arcs` is a CI step.
- **Row 2 closed for the invited edit**, with self-test rows that red.
- **Row 3 closed:** the ring's painted hue is held by a tier-2 unit on rounded bytes in CI.
- **The π claim now survives a room** (551 nodes, 0 deltas, positive control fires).
- **The 144-hand sweep and the audition priced the stricter statistic** instead of hiding it.
- **Seven born-RED controls were run and restored by `cmp`.**
- **The sleep-lint red that pass 3 missed was found and cured.**

## 6 · Cross-pollination

- **The painted-text instrument** (photograph the name twice, colour set transparent; every changed pixel read against the painted ground). It fits any text on a translucent ground: CTRL-TAPE's washi tag, NOTE-LEDGER's strip, ACC-SIX's tape census.
- **S1, the same-epoch relay race.** Every lane that touches `inkAgreed` or the `st` handler (PLR-SELF's substrate, PLR-PLACE) should carry it.
- **The density row.** A painted thin-line gate (MRK-LIVE's ring, ACC-FIVE's painted-line law, PAL-TIN's ring) should report core and headroom at dpr 1, 2 and 3; the 0.10 headroom fell to 0.077 at dpr 1 in webkit.
- **The cascade-scope comparer.** Any CSS scalar duplicated in TS should be held against EVERY declaration site in `src`, not one block.
- **Build identity.** Tailwind mints utilities from any scanned, non-ignored file, so a lane's scratch can change its dist's CSS. Built-dist rows should build with the scratch outside the tree, or diff the CSS against a clean build before citing an identity (the chair's housekeeping).
- **The session π census**, board subtree, with both controls. It's the right π for any family whose change only paints in a room.
