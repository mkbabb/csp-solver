# PAL-TIN · pass-7 prototype (§11c, the tin; PAL-WALK leads)

Work tree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2`, base and π control **`74a2b5d9`**, nothing committed. The pass-7 number is the critic's.

- **Start check.** `git diff --shortstat` read 17 files +659/−82, plus 3 untracked (802 + 1,123 + 127 lines = 2,052). That sums to BANKED.txt's `20 files changed, 2711 insertions(+), 82 deletions(-)`. `pass6.diff` (sha1 `e72d080f…`, equal to BANKED.txt) applied `--check` 0 to a fresh `74a2b5d9` archive.
- **Replay route: none, in place.** No merge, so no line-count check was owed.
- **At return.**
  - 17 M +733/−82 plus the same 3 untracked (now 2,573 lines).
  - `pass7.diff` is the full diff: sha1 `b4942134…`, 190,745 B, `git apply --check` 0 on a fresh `74a2b5d9`. An archive with it applied is `diff -rq`-equal to the tree (0 lines).
  - `pass7-delta.diff` is the delta against the pass-6 tree: 8 files +735/−140, sha1 `87da1373…`, 68,084 B, `--check` 0 on `74a2b5d9 + pass6.diff`.
- **§11c is not a merged section.** The integrated-tree `--check` is not owed.
- **Payload** is `?board=ATMuMzkx…YxMDYx` with its decode asserted. **B's peer id is pinned** as `p-0000000b0b0b`, so the tape reads "quickest-rodent" in every row, in both engines.

## Gaps first

1. **Two instruments are imported from the evidence tree.**
   - `check-peer-tin.mjs` imports the chair's `shape-census.mjs`, and `peer-tin.spec.ts` imports the chair's `glyph-pop.mjs`. Both use a default path relative to the repo, `docs/…/pass7/instruments/`, with `SHAPE_CENSUS` and `T9_INSTRUMENTS` as overrides. This is the "ONE copy" law (§I).
   - **That path exists only on main, after the pass-7 record.** On this work tree (at `74a2b5d9`), a bare `npm run lint:tin` without the env throws `ERR_MODULE_NOT_FOUND` and exits 1. Every run below set the env.
   - The fold has to land both libraries at a product path (`scripts/lib/`, `e2e/lib/`) and re-point the two imports. **That is a fold row, not closed here.**
2. **The chair's `glyph-pop.mjs` TAIL plant can't see a tail on this subject** (the probe's row is MOVED).
   - `applyTail` takes a Range over the element's contents. That Range counts the label's inline tally `<svg>` as part of the run, so the last 12 % lands on the tick and fades no glyph.
   - With the chair's copy, TAIL12 is **judged GREEN in both themes** (chromium DPR 1; the slices are identical to clean), and §2b exits 1 on it (`logs/spec-chaircopy2-chromium-dpr1.txt`).
   - `instruments/glyph-pop.tail-text-run.PROPOSED.diff` makes the Range cover text nodes only (sha1 `4c171ce5`; `paint-lib.mjs` is unchanged). With it, TAIL12 reds on G4 at slices 14 and 15 (1.6) in every config.
   - Every GREEN §2b row below ran on the PROPOSED copy. The spec requires TAIL12 RED, so **until the chair lands the PROPOSED, the spec is RED on its default path.**
3. **The absolute G2 floor can't be 4.5 in chromium at DPR 1.**
   - On the whole glyph population, this 600-weight hand face at DPR 1 is mostly antialiased edge.
   - HEAD's own ink, photographed off the subject, reads **1.739–1.954 light and 2.698–3.387 dark** there, and the tree's product binding reads 2.122–2.210 light and 2.954–3.448 dark.
   - Per LAWS §E ("≥ 4.5 wherever the control clears it"), those 36 chromium DPR-1 keys carry `clears: false`, with G2 at **0.9 × the stamp** and G3 at the fraction under 4.5 ≤ stamp + 0.05.
   - Every other key (chromium DPR 2, and WebKit at DPR 1 and 2) runs G2 at 4.5 absolute. G1 and G4 are never relaxed anywhere.
   - The chair may call the 0.9 × stamp a re-wording.
4. **The dark name arm loses to HEAD's own ink on the whole-population median in 10 of 72 chromium rows.** None of the 72 WebKit rows loses.

   | arm | where | loss vs HEAD |
   |---|---|---|
   | pink | DPR 2, cells 11 / 12 / 8 | −0.146 / −0.197 / −0.082 |
   | pink | DPR 1, cells 11 / 12 / 8 | −0.446 / −0.411 / −0.084 |
   | green | DPR 1 | −0.218 / −0.223 |
   | teal | DPR 1 | −0.256 / −0.293 |

   - The product binding (amber) beats HEAD in all 24 of its rows.
   - The rows are in `readings/name-arm-vs-head-whole-population-losses.txt`. This is B-TAPE's named loss (LAWS §G).
   - The pass-6 "beats HEAD at every cell" was measured on the ≥ 50 %-coverage core statistic. On the chair's whole-population statistic it does not hold for pink in chromium dark.
   - Pink moved to L 0.8564 this pass for separation (row 3). At 0.8597 its flat reading was 5.139, and it is 5.076 now.
5. **The light name arms are EXEMPT from the separation law, with the argument written into gate 2.** Their worst pair is green–teal at 0.0769, because the light names ARE the ring arms.
   - The gate re-derives the price every run: five sticks' hues hold 0.10 apart only at a common L ≥ 0.380, against the ring pair's 0.295.
   - Leaving the ring-arm alias to separate the light names would add five light hexes and lift them toward the stick's L 0.44, which paints 4.36 flat on the tape.
   - The exemption holds only while every light name resolves to its own ring arm. Even then it has a floor of 0.075; a light name spelled as its own colour is gated at 0.10. Both halves carry a self-test control.
   - **Accepting the exemption is the chair's call (a ballot row below).**
6. **D3 as the pass-6 critic wrote it stays GREEN, and I argue it is not a copy.** `lch(79.5% 36 350)` is CIE LCH `#ffacd2`, ΔE 0.0443 from the nearest arm, which is outside `COPY_DE` 0.03. The arm's own lch spelling, `lch(86.5% 50 345)` at ΔE 0.014, is the self-test control and reds. So 16 of the critic's 17 red, and D3 is argued.
7. **Roster n−1 at ten (charter row 6): cited, not cured, not re-run.** The pass-6 critic read 9/9/… on both trees, and the tenth joiner's write never reaches the host. That row belongs to the chair or W8, beside "sixteen, 0/16".
8. **WebKit paints no fill fade as a fade on this label** (PAL-WALK's pass-7 reading, reproduced). FADE80 is judged GREEN in 3 of 4 WebKit configs, and FADE65 is RED only on G3. Both are printed, not required, in WebKit. FAINT30, TAIL12, TAIL35 and EMPTY are required in both engines, and all of them red.
9. **The sha1 pair (LAWS §C).**
   - Every gate and unit was re-run on the final sha1: `check-peer-tin.mjs` `ba09afb5`, `useSession.ts` `411e934d` (the unit file 38/38 and the F1 plant 1 failed / 37).
   - The browser rows ran on spec `d90d4d74` (the final one) against a dev server serving `useSession.ts` **before** the prettier pass (formatting only).
   - The dists built before and after the prettier pass are hash-identical, `index-BRQ9Cl7IHzwm.js`, so the served bundle is the same bytes. Declared, not hidden.
10. **Inherited, unchanged, both sides.**
    - `lint:bands` and `lint:verbs` don't exist at `74a2b5d9` or on this tree: npm's missing-script error, exit 1 | 1.
    - `check-property-block`'s served clause reads the stale main dist it finds (0 | 0).
    - The filter census was not re-run. The delta adds no `filter`, `@property`, transition or animation (a grep of the `+` lines), and the dark 4/6 is the inherited `crayon-heart` row (the chair's ratified deletion).
    - The goldens were not re-run; π was read built against built instead.
11. **The §2b off-subject HEAD control is a CLONE of the tape** with the `attribution-tape` class struck, so no tape rule reaches it. A plant written into `SheetWashiLabel.vue`'s own scoped rule would still reach it.
    - It is a comparison row only, and no clause reads it.
    - A stamp's `clears` flag took HEAD's reading from the clean stamp run, frozen into the spec, never from the run under test.

## Numbers

### Row 1 · §2b on the whole glyph population (the chair's probe)

The spec file is `e2e/peer-tin.spec.ts`, sha1 `d90d4d74`. §2b binds the product (B, stick 1 lap 1, pinned), plus each of the five name arms by rebinding the label's `--color-user-ink` (one variable), over 3 cells × 2 themes. Clauses:

- G1: an empty or thin population (< 40 px) is RED.
- G2: 4.5 absolute, or 0.9 × stamp only where nothing cleared (gap 3).
- G3: the fraction under 4.5 ≤ stamp + 0.05.
- G4: the tail slices.
- The flat spec-vs-ground statistic ≥ 4.5 with 0 px under is kept.
- The pass-5 ring arm is the in-run negative on the flat statistic.

That makes 144 stamps, each `[median, fraction, clears]`, and a missing stamp is RED.

| run | exit | time | box load (1-min) |
|---|---|---|---|
| WHOLE FILE, chromium DPR 1 | **0 (7/7)** | 43.5 s | 22.1 |
| WHOLE FILE, webkit DPR 1 | **0 (7/7)** | 1.3 m | 16.9 |
| §2b, chromium DPR 2 | **0** | 41.6 s | — |
| §2b, webkit DPR 2 | **0** | 1.0 m | — |
| §2b with the **pass-6 critic's FAINT plant on the tape's own rule** (`instruments/plant-faint-text-on-the-tape-rule.diff`, a replica on :4246), chromium · webkit DPR 1 | **1 · 1**, 12/12 product rows RED in each | — | — |
| §2b with the chair's `glyph-pop.mjs` unpatched, chromium DPR 1 | **1** (TAIL12 GREEN; gap 2) | — | — |

**The product binding against HEAD, painted, with HEAD off the subject** (`readings/s2b-product-vs-head.txt`). Columns are core median / % < 4.5.

| engine · DPR | light: tree vs HEAD | dark: tree vs HEAD |
|---|---|---|
| chromium 1 | 2.12–2.21 / 70–80 % vs 1.74–1.95 / 88–98 % | 2.95–3.45 / 61–73 % vs 2.70–3.39 / 64–85 % |
| webkit 1 | 8.76–9.48 / 32 % vs 4.04–4.28 / 52–58 % | 5.92–6.06 / 33–35 % vs 5.42–5.62 / 35–37 % |
| chromium 2 | 5.48–5.65 / 47 % vs 3.38–3.48 / 60–63 % | 5.34–5.62 / 40 % vs 5.16–5.27 / 41–42 % |
| webkit 2 | 12.24–12.49 / 20–22 % vs 4.59–5.07 / 39–46 % | 6.79–6.81 / 22–24 % vs 5.81–5.93 / 24–26 % |

- **Flat**: every name arm reads 7.960–8.866 light and 5.076–5.689 dark, with 0 px under 4.5, in every row.
- **The in-run negative**, the dark pass-5 ring arm, reads 3.921 chromium and 3.926 webkit, which is < 4.5 as required.

**The text plants**, in-run on the product binding at cell 11, both themes, 4 configs (`readings/s2b-text-plants.txt`):

- FAINT30, TAIL12, TAIL35 and EMPTY are **RED 32/32**.
- Chromium FADE65 and FADE80 are **RED 8/8**.
- WebKit FADE65 is printed RED 4/4 (G3), and WebKit FADE80 is printed GREEN 3/4 (gap 8).
- EMPTY reds on G1 (population 0), never on `min(4.5, 0)`.

### Row 2 · GATE 4 on SHAPE, through the ONE colour parser (`scripts/check-peer-tin.mjs`, sha1 `ba09afb5`)

- **4a now reads:**
  - every text source under `src/`, `e2e/` and `public/` (`.css .vue .ts .mts .tsx .js .mjs .jsx .json .html .svg .webmanifest`) plus `index.html`, 251 files;
  - comments stripped by the library's string-aware strippers;
  - literal string concatenations constant-folded;
  - every colour through `shape-census.parseColor`/`colorLiterals` (hex 3/4/6/8, rgb/rgba with `%`, hsl in deg/turn, hwb, lab, lch, oklab, oklch, `color(srgb …)`, named, `color-mix`) plus numeric byte triples, scored by ΔE_ok against the 30 arms.
- **Two new shapes red.** A peer token named by arithmetic outside `var(` (a concatenation or a template), and a colour DERIVED from an arm (`color-mix(… var(--color-peer-N…))`, relative `from var(--color-peer-…)`).
- **`--dist <dir>` reads the BUILT bundle beside the source**, with the sheet's own `--color-peer-*:` declarations cut out. It is wired into CI's `dist` lane after dist identity.

| row | exit |
|---|---|
| the pass-6 critic's `g4attack6.sh`, run FIRST, final sha1 (`readings/gate4-critic-d1-d20-final.txt`) | clean 0 · **D1, D2, D4–D17 exit 1 (16/17)**; D3 exit 0 (argued, gap 6); D18–D20 exit 1; restored byte-equal |
| D22 (pink name `#eac2e3`, ΔE 0.062 from violet) | **1** (gate 2) |
| `--dist` on the tree's dist `index-BRQ9Cl7IHzwm.js` | 0 (286 files read) |
| `--dist` + a folded name arm (`["#ff"+"c1a1"]`) appended to the entry chunk | **1** (`dist:assets/index-BRQ9Cl7IHzwm.js spells #ffc1a1, ΔE 0.0000`) |
| `--self-test` (`lint:tin`) | **0: 59 controls RED** (D1–D17, D20, D22, the light exemption's two halves, a relative colour, a named colour, `public/404.html`, a bundle literal, and every pass-5 control); the GREEN control is unmoved (a consumer, a concatenated consumer `"var(--color-peer-" + k + "-name)"`, a comment, a bundle's own sheet) |

The nearest innocent literal is still `pencilConfig.ts #D16A32` at ΔE 0.0315, printed every run.

### Row 3 · the SEPARATION law (gate 2) and the chroma cost (`readings/separation-search.txt`, `gate2-name-arms.txt`)

| arm set | light min pair | dark min pair |
|---|---|---|
| sticks (gated 0.10) | 0.1162 green–teal | 0.1724 green–teal |
| ring arms (printed; the §2.4 pair's) | 0.0769 green–teal | 0.1495 teal–violet |
| name arms, pass 6 | 0.0769 (= ring) | **0.0983** violet–pink |
| **name arms, pass 7** | **0.0769, EXEMPT with floor 0.075** (gap 5) | **0.1011** violet–pink, gated 0.10 |

- **The move.** The dark pink name goes `#ffb4f3` → **`#ffb2f3`**: L 0.8564 (inside 4b's 0.86 ± 0.005), C 0.121, Δh +0.09°. Flat against the grid line it reads 5.076, where it read 5.139.
- **Alternatives searched.** Violet down to L 0.8425 (Y 0.593, 0.1005), or violet up to 0.885, which breaks 4b's band.
- **The chroma cost for B-TAPE** (dark name C vs its stick): amber 0.084 vs 0.175, violet 0.069 vs 0.189, pink 0.121 vs 0.216, green 0.214 vs 0.163, teal 0.146 vs 0.111.
- **Handed to WALK by sha1:** gate 2 in `check-peer-tin.mjs` `ba09afb5`, with `MIN_DE` 0.10, `EXEMPT_FLOOR` 0.075 and the alias test.

### Row 4 · B-RING, the chair's third-arm-or-0.86-pair row, priced on one payload (DPR 1)

§1 of the spec ran with the NAME arm seated as the ring (a scratch copy, one line changed), against the shipped ring arms in the same whole-file run. The figure is the core median.

| arm | dark chromium | dark webkit | light (either engine) |
|---|---|---|---|
| ring at the name arm (L 0.86) | **3.953–4.258** | **3.958–4.258** | 3.133–3.718, unchanged: the light name is the ring |
| shipped ring (L 0.79) | 3.279–3.615 | 3.277–3.620 | same |

- Raising the dark pair to 0.86 buys about +0.6 on the ring's dark median.
- It deletes the five dark name hexes and the `nameInkOf` lookup, and it moves registry-v4 §2.4's pair (the chair's).
- **The chair decides.**

### Row 5 · the consumer-less third key is struck; the slug is pinned; F1 is re-shot on the const

- `inkFor` returns TWO keys again (a unit asserts `Object.keys` for i = 0…11).
- The tape asks `nameInkOf(stick)`: `playerIdentity.ts` looks the stick up in the written-out `TIN_NAME`, and `useSession.ts` exports the wrapper.
- `--color-peer-name-ink` reads 0 in `src/`/`e2e/` by grep. The undefined-token census reads 0 bare plus 1 declared STALE `--refuse-dur` on both trees (exit 1 | 1).
- π built vs built (`readings/pi-built-vs-built.txt`): tree dist `index-BRQ9Cl7IHzwm.js` on :4242 vs `index-CubiZsMVSwTc.js` on :4249, hash-verified.
  - Desk 1280×800 FINE and phone 390×844 COARSE (hasTouch, regime witnessed), both themes, both engines: **DIFF ROWS 0** over 1155 / 1115 nodes.
  - Control-vs-control 0; the planted letter-spacing arm shows 81.
- **F1's unit carries its own in-run control.** `withSelfInk(next, takesAHand = SELF_TAKES_A_HAND)`, and one test runs YES and NO on one room: your ink is `inkFor(0)` against `{}`, the peer's ink doesn't move, a room of one binds neither arm, and a call site passing nothing reads the const.
  - Clean 38/38.
  - **Plant (the condition ignores the switch): 1 failed / 37, exit 1**, on the final sha1 `411e934d`.
- **Frame 1 is re-shot on the const**, with no URL arm (below).

### Row 7 · the retirement watch: the centre's price against WALK's (`readings/centre-price-tin-first-N.txt`)

| N players | TIN stick min pair light / dark | TIN at N = 6 |
|---|---|---|
| 2 | 0.1423 / 0.2089 | — |
| 3–5 | 0.1162 / 0.1724 | — |
| 6 and up | — | **0.0000**: two players share a stick, and the tick on the tape and the roster tells the lap |

- **WALK's pass-7 README.** Its digit reads 0.0758 / 0.0762 at N = 4, its ring 0.0514 / 0.0510, its name 0.0274 / 0.0271 at N = 4 (0.0373 at N = 3 light), and HEAD's one string 0.0991 / 0.0988.
- **TIN's centre is five sticks at 0.116 or more, plus a drawn lap.** It is bounded at five colours on the board and tells 30 apart on the roster by mark.
- **WALK has bound TIN's L 0.86 name ink but not the separation law** (its gate 2 is unchanged, per its README). So watch 2's condition is half met, and the chair opens or doesn't.

### The pre-return battery, BARE (`readings/battery-tree-final.txt`: a clean `74a2b5d9` archive plus the final diff, `diff -rq`-equal to the tree; `battery-control-74a2b5d9.txt`)

| row | tree | control 74a2b5d9 |
|---|---|---|
| `lint:tin` (59 controls) · `check-peer-tin` · `--dist` | 0 · 0 · 0 | 1 · 1 (script absent) |
| `check-copy-register` (0 dashes, 0 unadmitted, lexicon 25) | 0 | 0 |
| `lint:lanes` · `lint:theme-tokens` · `lint:sleep` | 0 · 0 · 0 | 0 · 0 · 0 |
| `lint:bands` · `lint:verbs` | 1 · 1 (missing script) | 1 · 1 (inherited) |
| `test:e2e:projects` · `check-pw-projects` | 0 · 0 | 0 · 0 |
| `check-property-block` (pass-6 copy; source + served) · `lint:motion` | 0 · 0 | 0 · 0 |
| `typecheck:e2e` · `eslint .` · `npm run lint` (CI's scoped prettier) | 0 · 0 · 0 (after a prettier pass on 3 src/scripts files, gap 9) | 0 · 0 · 0 (control with `web/relay` archived) |
| `vue-tsc -b` (archive only) | 0 | — |
| vitest, chunked | games 57/749 · pencil 8/73 · composables 3/16 = **68 files / 838, 0 failed** | — |
| `peer-tin.spec.ts` WHOLE file | 7/7 chromium · 7/7 webkit (DPR 1) | — |

Box load across the pass was 11.5–37.7 (1-min), with 37–82 sibling node processes. No timing row is gated here.

## Frames (one crop)

- **`frames/1-f1-yes-vs-no-const-1280-light-chromium-webkit-fine-dpr2.png`** (14,114 B, pngquant 60–90).
  - Row 1 is chromium and row 2 WebKit. Left is **YES** (the tree on :4245) and right is **NO** (a scratch replica with `SELF_TAKES_A_HAND = false` on :4246, killed).
  - Light, 1280×800, FINE pointer (mouse), DPR 2, payload `ATMuMzkx…`. It is a room of two: A hosts, and B joins pinned to `p-0000000b0b0b`.
  - A wrote cell 11 (5) and B wrote cell 12 (7). The one variable is the const.
  - Read from the page: YES paints A's 5 at `rgb(133,57,0)` (amber stick). NO paints it at `rgb(37,99,235)` (house blue). B's 7 is `rgb(69,92,0)` in both.
  - **It RETIRES `pass5/prototype/PAL-TIN/frames/1-f1-yes-vs-no-1280-light-chromium-webkit-fine.png` (45,444 B)**, the frame shot with the struck URL arm. The wave's net change is −31,330 B once the chair sweeps the retiree.
  - I looked at it: a lawful pair.
- **B-TAPE (pass-6 frame 1) is not re-shot.** It frames amber, which did not move. Pink moved by ΔE 0.005.

## Ballots for the owner / the chair

- **F1** (`SELF_TAKES_A_HAND` YES | NO): frame above, both arms built, the default YES. The NO arm is now held by a CI unit.
- **B-TAPE, the ink half**: pass-6 frame 1 stands. **The default's LOSS is named** (gap 4): the name arm loses to HEAD on the chair's whole-population median in 10 of 72 chromium dark rows (pink both DPRs, green and teal at DPR 1, −0.08…−0.45), and wins every WebKit row and every product (amber) row. The chroma cost is in row 3.
- **B-RING (the chair's)**: keep the third arm, or raise the dark ring pair to 0.86, which is worth +0.6 on the dark ring median (row 4).
- **The light-name separation exemption (the chair's)**: accept 0.0769 with the written argument and the 0.075 floor, or move the light names to L ≥ 0.38 as their own colours. That costs the ring alias and moves the name toward the stick's 4.36-flat lightness.
- **The PROPOSED glyph-pop TAIL fix (the chair's instrument)**: gap 2.

## r0 / R6 rows MOVED

- **The chair's `pass7/instruments/glyph-pop.mjs` (TAIL on a subject with a non-text child) is MOVED.** The PROPOSED diff is in `instruments/`. No r0 law row moved this pass; L6 stays WALK's (TIN's copy was struck in pass 6).

## Incidents (self-declared)

1. **My first gate-4 run redded this family's own spec.** `read(\`--color-peer-${i}\`)` names a peer token by arithmetic outside `var(`. The spec now passes `var(…)` (its `read` accepts either). The rule was not narrowed.
2. **The first stamp cut bounded G3 at a lowered floor.** The probe's fraction is measured under its `floor`, so G3 went vacuous wherever the floor dropped below 4.5 (46 % vs a 75 % bound). I stopped the running chain (TaskStop). The probe now runs at 4.5 always, and the 0.9 × stamp replaces G2 only in the spec's judge. Every GREEN cited is the re-cut's.
3. **I ran `prettier --write` on `e2e/peer-tin.spec.ts`**, which is in `.prettierignore` (a known trap). It was a no-op: the file diffs identical against the pre-run copy. Nothing was severed.
4. **`npm run lint` redded three files at the first final battery.** They were `useSession.ts`, `useSession.test.ts` and `check-peer-tin.mjs`. I ran prettier on those three, re-ran every sha-bound row, and rebuilt the dist, which came out hash-identical (gap 9).
5. **The critic's `g4attack6.sh` D18 `sed` targeted the old pink hex.** I re-pointed it at `#ffb2f3`; nothing else changed. Its delete calls were already `mv`.
6. **Plants lived in replicas:**
   - `paltin7-g4copy` (rsync) for the gate attacks, restored byte-equal;
   - `paltin7-noroot` for F1's NO arm;
   - `paltin7-plantroot` for the FAINT tape rule.

   The F1 unit plant ran on the tree once (restored `cmp`-equal) and once on the final archive.
7. **Servers**, all killed by recorded PID with their ports read empty after: 4245 (dev tree, 48943), 4246 (NO arm 64040, then the FAINT replica 83954), 4249 (the `w7-control` dist preview, 86972, `index-CubiZsMVSwTc.js`) and 4242 (the tree's dist preview, 86974). 4247/4248/4237–4241 were foreign and never touched. Every cacheDir sat outside the root in the scratchpad.
8. **No `rm` of any form.** Scratch is `<scratchpad>/paltin7-*`, and the in-tree `.paltin7/` was `mv`ed to `trash-paltin7-3/`. The tree's `git status` shows 17 M + 3 ?? product files. The ignored `web/frontend/tsconfig.tsbuildinfo` dates from 2026-09-23 (pass 6) and is not this pass's.

## What moved this pass (product)

- `src/assets/index.css`: the dark pink name arm is `#ffb2f3` (L 0.8564), and the comment states the separation law and the chroma price.
- `src/games/shared/playerIdentity.ts`: `inkFor` is back to two keys, and `nameInkOf(stick)` looks up `TIN_NAME`.
- `src/games/shared/useSession.ts`: the `nameInkOf` wrapper, and `withSelfInk(next, takesAHand = SELF_TAKES_A_HAND)` exported.
- `src/games/shared/GameBoard.vue`: `hoveredAuthor` binds `--color-user-ink` to `nameInkOf(authorInk[pos])`.
- `src/games/shared/useSession.test.ts`: the two-key unit, `nameInkOf`, and F1's both-arms test.
- `scripts/check-peer-tin.mjs`: gate 2 on the name arms with the light exemption; gate 4a on the shape-census parser and strippers (folding, triples, `public/`, `.json`/`.tsx`, arithmetic tokens, derived colours); `--dist`; 59 controls.
- `e2e/peer-tin.spec.ts`: §2b on the chair's glyph-pop with 144 stamps, the pinned B, HEAD off the subject, and the text plants in-run; `room(…, pinLast)`.
- `.github/workflows/ci.yml`: the `lint:tin` comment, and `check-peer-tin --dist dist` in the dist lane.
