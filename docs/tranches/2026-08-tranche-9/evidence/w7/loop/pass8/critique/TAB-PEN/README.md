# TAB-PEN · pass-8 adversarial critique (§12, the tab's pen)

Critic: Opus. I'm not the designer or the prototyper. Subject: worktree `.claude/worktrees/wf_b6676cd9-8c6-17` (base `1d0dc4fd` by the §2.16b waiver), bank `pass8/prototype/TAB-PEN/pass8.diff`. Standing number: 74 (the pass-7 critic's). U-10 applies, so this file retires nothing.

**Verdict: ADVANCE at 79 (74 → 79), and not higher.**
- **Closed on my runs:** every one of the twelve charter rows the lane claims closed reproduces. That covers the pass-7 critic's ten plants (C1–C10 all RED), the 54/54 sabotage battery, the arm table (H and B each one const, flips GREEN), the named losses, the fold collision, the empty `src/`, and both apply-checks.
- **What holds the number down:**
  - The clause-e link reader is the same species as the C6/C7 escapes. It reads `<link>` text after stripping comments, not the links a parser makes live. **Six new HTML edits ship no s, the wrong s, or a dark-only s, and read GREEN** (E1–E6).
  - Every numeric bound in clauses d and e is unplanted at its edge. **Six loosened copies of the gate keep the self-test GREEN.** A 12 × 12 ink square on the touch icon passes the tie.
  - The arm table is its own spec: edit `PEN.W` to a Z, run `npm run icons`, and the gate reads GREEN.

## 0 · Gaps first (the exact open rows)

1. **G-E1 · Clause e reads link TEXT, not live links (SHAPE law, class of C6/C7).** Six species run through the gate `fd3ef080` read GREEN, exit 0 (`crit-plants.c8.mjs` / `c8-plants.txt`):
   - E1 `media="(prefers-color-scheme: dark)"` on the SVG link: a light tab has no s.
   - E2 `type="text/plain"`: the UA skips an unsupported icon type.
   - E3 both links inside `<template>`: inert.
   - E4 both links inside `<noscript>`: raw text in `<head>` with scripting on.
   - E5 links deleted and their text kept in a `<script>` string.
   - E6 a `<base href="https://example.com/">` before the links: the icon loads off-origin.

   `htmlLinks` (`shape-census.mjs:2646`) strips `<!-- -->` only, and `exactlyOneLink` checks `rel` and `href` only. **The cure goes in the ONE library as a PROPOSED diff with these six plants:**
   - drop the contents of `<template>`, `<noscript>`, `<script>` and `<style>` before matching;
   - the gate holds each icon link's attributes to an allowlist (`rel`, `href`, and `type` = `image/svg+xml` on the SVG; no `media`; no `sizes` until the ladder);
   - a `<base>` element is RED.
2. **G-E2 · No behavioural row pairs the source law (LAWS P7 §F (iii)).** E7, where `src/main.ts` re-points `link[rel~=icon]` to a thick SVG at runtime, reads GREEN. Nothing in `src/` writes the icon today, so E7 is latent.
   - The row that would see E1–E7 at once is a product e2e row on the built page after hydration. It reads the live `link[rel~=icon]` and evaluates `matchMedia(link.media)` in both schemes. It checks the type, the resolved href's origin and path, and the fetched bytes' content-type and sha256.
   - G-TAB-4 and the glyph driver are lane scratch, not product rows.
3. **G-E3 · The numeric bounds are unplanted at their edges.** The sabotage battery switches clauses off; it never moves a threshold. On six scratch copies of `fd3ef080` (`threshold-loosen.txt`), `--self-test` still exits 0 with:
   - IoU 0.97 → 0.86;
   - mean |Δ| 0.02 → 0.03;
   - mass [0.18, 0.32] → [0.10, 0.40];
   - `WINDOWS` ± 0.02;
   - extent [0.55, 0.80] → [0.45, 0.90];
   - centre 0.5 → 1.5.

   The nearest tie plant sits at IoU 0.8512 (C5), 0.12 below the bound. **E8, a 12 × 12 ink square in the touch icon's paper, reads GREEN: tie 0.0054 / IoU 0.9754.** E9 (16 × 16, IoU 0.9612) and E10 (20 × 20, 0.9436) are RED.
   - The shipped pair reads 0.0010 / 0.9942, so the slack admits a visible mark of about 14 px at 180.
   - The cure is an edge plant just past each bound (the plant must red at bound + ε and a negative must pass at bound − ε).
   - Tighten the tie to what the rasteriser needs: IoU ≥ 0.985, or a max-component clause on |Δ| > 0.5.
4. **G-E4 · The arm table cites itself.** T1: I set `PEN.W` to a Z (`M9,6H23L9,26H23`) and ran the real `icons.mjs` (sharp). The gate reads a–e GREEN, exit 0, mass 0.2105, tie 0.0007 / 0.9841.
   - The pass-7 critic stated letter identity as "not a gap" for a source gate. The README now claims "the arm table now can" judge C3. It can only when the table itself is untouched.
   - The cure: pin the sha of each ballot arm's path (`W`, `H`) and the width set {4, 5} in the gate. Then a table edit that isn't a ballot arm reds `d.arm`, and a real re-cut of the pen becomes a declared gate edit.
   - T2, an N-shaped zigzag, reds only by accident (`d.extent` 0.531).
5. **Row 29 (second non-author reading): now GIVEN. See §3.** The owner still disposes T9-B27.
6. **Arm B's painted cost** (the lane's gap 3): G4 is RED in WebKit at 16 DPR 1 (1.67 / 1.85). I didn't re-read B's cells. It belongs in T9-B28's caption as the lane says, and it stays open until the caption lands.
7. **Row 30 (the ladder) collides with row 1's cure** (the lane's gap 8, confirmed on the code: `exactlyOneLink(..., "icon")`). It's open by its own terms. The G-E1 allowlist has to be cut with it: one link per (type, sizes).
8. **M19 whole.** No real tab was seen: not Chrome's favicon service, not Safari's tab, overview or in-SVG dark query, not the iOS web-clip mask, not Android or Firefox. Every painted number here is headless `<img>` emulation. The RUNSHEET line stands.
9. **Parsimony (a note, not a row):** the gate is 1,405 lines for a 496 B icon. 69 plants, each written as a block, is ceremony-weighted. The G-E1/E3/E4 cures should land as library clauses and table rows, not as another 300 lines.

## 1 · Re-measured (my own runs, bare; box load 15.4–22.9, 1-min)

| row | my reading | lane's claim |
|---|---|---|
| tree vs bank | temporary index (`GIT_INDEX_FILE`): write-tree `41f2351a`; diff 362,228 B, sha1 `30c53f52`, `17 files changed, 8210 insertions(+), 20 deletions(-)` | same ✓ |
| `git apply --check` | **0** on a fresh `1d0dc4fd` · **0** on a fresh `74a2b5d9` · the delta `45a19644` **0** on `74a2b5d9` + `s13-s7-s3` + `homes.on-s13-s7-s3`; there, the gate a–e GREEN exit 0 (bare), self-test exit 0, unresolved 30 | same ✓ |
| homes | `homes.diff` sha1 `a1d8adeb` applied on a fresh `1d0dc4fd`: 7/7 paths (6 instruments + `knip.json`) `cmp`-equal to the tree | same ✓ |
| gate clean (bank archive) | a–e GREEN exit 0; mass 0.2295; tie 0.0010 / 0.9942; 44 unresolved printed | same ✓ |
| `--self-test` | exit 0, 69 rows, 4.0 s at load ~21 | 69/69, 3.3 s ✓ |
| `--sabotage-battery` on frozen `fd3ef080` | **54/54 bite, exit 0** (`sabotage.txt`) | same ✓ |
| the pass-7 plants, FIRST, on both gates (`p7plants-on-*.txt`) | pass-7 gate: GREEN on C1 C2 C3 C5 C6 C7 C9, RED C4 (d), C8 (ce), C10 (c). **Pass-8 gate: RED on all 10**, with C1 de 0.420 · 0.2317/0.4706, C2 e 0.3250/0.2414, C3 de, C4 de 0.200, C5 de 0.0376/0.8512, C6 e 0/0 links, C7 e 2 links, C8 ce, C9 ce, C10 c | the C-table exact ✓ |
| arm flips (scratch copies, real sharp) | `ARM="H"`: svg `e0edd782`, 2,470 B, `icons --check` 0, gate 0, mass 0.2388, tie 0.0011/0.9936 · `WIDTH=5`: `b41ada6a`, 2,515 B, 0, 0, 0.2908, 0.0010/0.9972 | same ✓ |
| dist (fresh out-of-tree builds, private cacheDirs) | tree 48 files vs main `1d0dc4fd` 47; **45 byte-identical** incl. `index-ChSrVSqM0j8q.js` + `index-DSV8hl9eUGyP.css`; `index.html` differs by the 2 link lines; +icon.svg (`856c8ad5`) +apple-touch-icon.png (`b07f52f9`) −favicon.svg | same ✓ |
| served CSS (LAWS P7 §B) | :4240 `index-DSV8hl9eUGyP.css` `cmp`-equal to the clean main build; `@property` count 1 = main | ✓ |
| G-TAB-4 (tree :4240, control :4252 verified by `index-CubiZsMVSwTc.js`) | tree: `/icon.svg` 200 `image/svg+xml` 496 `856c8ad5` · `/apple-touch-icon.png` 200 `image/png` 2,473 `b07f52f9` · `/favicon.svg` 200 `text/html`. Control: html · html · `image/svg+xml` 1,961 `fc667540` | same ✓ |
| **painted, through the HOME** (`tab-glyph.mjs` → `../e2e/lib/glyph-pop.mjs`, `../e2e/lib/paint-lib.mjs`; the SERVED bytes, not lane copies; both engines) | 16 DPR 1 fraction < 4.5 (population), tree W vs control main: chromium light **0.375 (88)** vs **0.293 (174)** · chromium dark 0.341 vs 0.293 · WebKit light 0.389 (90) vs 0.411 (209) · WebKit dark 0.352 vs 0.411. W clean GREEN 8/8 cells; main RED G4 in 6/8 (terminal columns 3.34 / 3.93 / 3.17 / 1.81) | the home table exact ✓ |
| AA, painted | W glyph medians 9.34–11.59 at 16 DPR 1, 16.18–18.99 at 32 DPR 2; every G2 GREEN | ✓ |
| tile, painted | (251,250,249) light, (17,15,14) dark, both engines, both DPRs | ✓ |
| W's plants through the home | RED 49/56. FADE80 GREEN 6/8 cells, FADE65 GREEN 1/8 (WebKit dark 32 DPR 2); FAINT30, TAIL12, TAIL35, HEAD12 and EMPTY RED 8/8 | row 8's refutation stands ✓ |
| battery on the (unedited) worktree | `lint:favicon` 0 · `lint:lanes` 0 · `check-copy-register` bare 0 · `lint:theme-tokens` 0 · `eslint . --max-warnings 0` 0 · `lint:knip` 0 · `npm run lint` 0 · `shape-census --self-test` 0 (92/92, 40/40) | same ✓ (the control's exits are the lane's; I didn't re-run the control) |
| instrument imports | the gate: `./shape-census.mjs`, `./icons.mjs`; no `docs/` import in `e2e/` or `scripts/` (grep 0) | ✓ |

## 2 · Constraints

| constraint | reading |
|---|---|
| π vs `74a2b5d9` | by construction. The dist differs from main's only in the head's 2 links and 3 public files, and `src/` is empty. Against `74a2b5d9`, the rest is W8's fold (the waiver's base). I didn't re-run whole-DOM π; row 28 stays HELD, not re-claimed. |
| filterBudget 9 | untouched: the icon carries 0 filters (main's favicon carried 1, outside the DOM), and `src/` is empty. |
| M16 | `check-copy-register` bare 0; no UI copy. |
| AA (painted) | GREEN (above). The fringe loss is T9-B28's named cost, not a floor breach. |
| @property law | no CSS in the diff; the served `@property` count equals main's. |
| ballot pairs | no new frames; headroom spent **0 B** of 151,826 B. The pass-7 pairs (p7-f1/f2/f3) are kept; each is one payload per arm. |

## 3 · Row 29 · the second non-author reading (on the kept p7-f1 and p7-f3)

- **180 (p7-f3, both engines paint alike).**
  - W reads as a clean geometric rounded-sans s: a type specimen, not a hand. It's generic.
  - H's flat top and short up-tick read as a marker stroke's start. It reads as written, and as the board's hand. It doesn't read as the browser's fallback letter.
  - I agree with the pass-7 reader.
- **48 DPR 2 (p7-f1, right half).** H is legible and distinct from W. I read the squared top as a pen's entry, not a defect.
  - This is where I differ from pass 7 ("marginal"). At 48 its top edge sits close to a capital S with a flag, so a lay reader could take it as "S", not "s".
  - Two readers split on marginal vs legible. Neither reads it as illegible.
- **16 DPR 1 ×4.** W and H are near-indistinguishable blobs in both engines and both strips; H's top is only a slightly squarer shoulder. P reads heavier and more contrasty. The choice of hand is invisible at the tab's actual size. It matters at 48 and 180 (touch, overview).
- **P′ dead on the number:** I accept the lane's arithmetic (λ/H 1.9, peak ≤ 0.68 device px at 16 DPR 1). A grain under one device pixel can't be read at the tab.

## 4 · INTAKE-23 §4, re-read

- 22 CLOSED ✓.
- 23 **PARTLY**. The escapes the intake and the pass-7 critic named are RED. E1–E6 (G-E1) are the same class and read GREEN, and the thresholds are unplanted (G-E3).
- 24 CLOSED ✓ (C8/C9 RED).
- 25 CLOSED as numbers ✓.
- 26 CLOSED ✓, except that the touch icon's tie admits E8 (G-E3).
- 27 CLOSED ✓.
- 28 HELD.
- 29 reading GIVEN (§3); the arms are built; the owner disposes.
- 30 OPEN.
- 31 STATED.
- 36 noted ✓.

## 5 · Incidents (self-declared)

- **I ran two plain `git status` in the prototype's worktree** (read-only; it may refresh the real index's stat cache). Every cut went through `GIT_INDEX_FILE`.
- **`vite build` from my scratch archive** writes its config's temp bundle under the symlinked `web/frontend/node_modules/.vite-temp/`. Vite removes it (0 `crit8` entries remained).
- **The first build failed** (no `csp-solver/data` in the archive). I extracted the data and rebuilt.
- **Servers I started:** :4240 (listener 49780, wrapper 49727, cwd my scratch archive) and :4252 (listener 49788, wrapper 49728, cwd `w7-control`, identity `index-CubiZsMVSwTc.js`). I killed both by recorded PID after an ancestry and cwd check, and both ports read free.
- **What I didn't touch:** no `rm`, no git in the control tree, no install, no commit, push, stash or deploy, no Safari or osascript.
- **Scratch:** it lives in `<scratchpad>/tabpen-crit8/`. Plant dirs are new and lane-named.

## 6 · Replay

1. Extract `git archive 1d0dc4fd web/frontend .github .gitignore`, apply `pass8.diff`, and symlink `node_modules`.
2. Run `node crit-plants.p8.mjs` (the pass-7 plants) and `node crit-plants.c8.mjs <dir> <gate> <node_modules>` (E1–E10, T1–T2, NN).
3. For the threshold rows, apply the sed edits named in `threshold-loosen.txt` to a copy of the gate, then run `--self-test`.
4. Build out of tree with a private cacheDir. Serve it on :4240 and the control on :4252, then run `node .crit8/tab-glyph.mjs <out>` from `web/frontend` (it imports the homes relatively).
