# PLR-SELF · pass 5 — ADVERSARIAL CRITIQUE

§11's leader. Prototype: worktree `.claude/worktrees/w7-p4-PLR-SELF`, branch `w7/p4-plr-self`, base and
π control `74a2b5d9`, uncommitted, 23 product files (+1,762 / −401). I wrote neither the charter nor the
prototype. The pass-5 number is mine.

**Verdict: ADVANCE. Convergence 86 % (from 85).**

**The record's shape.** An earlier critic attempt on this pass left a file at this path (2026-09-22
19:55) and the `k1`–`k4` instruments and readings under `critique/PLR-SELF/`. The prototype tree hasn't
moved since: no file under `src/`, `e2e/` or `scripts/` is newer than that file. This critique replaces
that file. I re-ran its three load-bearing claims on my own instruments (the `c5-*` files beside its
`k*` files). All three reproduce, and two of them are stronger than it stated (§1 R3, R4). Its readings
stay banked. Where I cite one of them without re-running it, I say so.

The pass closes most of the charter. It takes the three grafts back with rows that fail, puts both head
disclosures on one sheet, counts one population, clears `lint:sleep`, and runs π dist-vs-dist with a
noise arm. What holds it below 90 is three defects of the "cannot fail" or "moved, not cured" kind:

- **The band regime is keyed on a proxy again, and pass 3's one-pixel cliff has moved to portrait
  phones.** 390×799 draws 1 row with 0 cells lapped. 390×800 draws 4 rows and laps 7 cells. Both
  engines.
- **The landed drawn-edge row passes an edge that paints nothing.** An `opacity: 0` edge and a
  transparent-ink edge both read 2/2 GREEN.
- **The PROPOSED L5b passes the exact regression it's named for.** With the pass-4 border put back at
  its own pass-4 site, `.player-lobby`, the row reads GREEN.

| my rig | |
|---|---|
| servers | worktree dev `:4241` (charter port; two-line config, cacheDir `scratchpad/plrself-c5/.vc-dev`, outside the tree) · my built dist `:4242` · the shared control dist `:4243` (`w7-control`, served by its own `.vite-control.config.ts`). Identity by asset hash, not by a 200: `:4242` serves `index-BQTW9FrsXaOa.js`, `:4243` serves `index-CubiZsMVSwTc.js`. **Killed by recorded PID** (listeners 10807 / 10810 / 10813, npx wrappers 10731–10733); 4241–4243 are free at return. `:4238` (a sibling's) was not touched |
| dist | built from the worktree, scratch and cacheDir outside it → **`index-BQTW9FrsXaOa.js`, 43 files**: the lane's cited identity, reproduced |
| instruments | `critique/PLR-SELF/instruments/c5-regime.spec.ts` (11 cells × 2 engines, seven at the table), `c5-dist.spec.ts` (filters + painted edge + corners, dist vs control, one minted payload per theme, control-vs-control noise arm), `c5-witness.spec.ts`, `l5b.mjs` (the PROPOSED body verbatim), `x1.sh`, `pw.config.ts` (every one in the session scratchpad; testDir and outputDir outside every tree). Readings are summarised under `readings/c5-*` |
| break tests | X1 and X2 on THIS tree (`HeadSheet.vue`, sha1 `b55d3fb1c3b7…` before, `shasum -c` OK after); L5b plants A/B/C on scratch copies of `src/pencil/chrome` |
| crops | none minted. Every claim below is a number |

---

## 0 · Gaps first (each closable, numbers attached)

1. **The short band's key is a proxy, and it has a one-pixel cliff in portrait.** The key is
   `(orientation: portrait) and (max-height: 799px)`. Seven at the table, coarse (`hasTouch`,
   `(pointer: coarse)` witnessed true), identical in chromium and WebKit:
   - 390×799: 1 row, sheet bottom 147.4, board top 199.2, **0 cells lapped**.
   - 390×800: 4 rows, sheet bottom 214.5, board top 199.7, **7 lapped**. One row would lap 0.
   - 390×820 laps 7. **360×800 laps 7** (board top 210.3). 430×800 laps 6. 390×844 laps 0.

   This is pass 3's desk cliff (1280×799/800), now at 390×799/800. What decides the lap is where the
   board's top sits against the four-row sheet's bottom (214.5). That varies with width: 360×800 and
   430×800 differ by 30.6 px of board top at one height. No height threshold separates the cells.
   **Close it** with a key that reads the board's top against the sheet's four-row bottom (one rect
   prop across the boundary `App.vue` already crosses for the rows), plus a landed row at 390×800 or
   360×800 that goes RED under the present query.
2. **The landscape re-key costs two cells, and the code says it costs none.** At 844×390, four rows lap
   **6** cells, where pass 4's one row lapped 4 (the README's own §2.4 figure). At 812×375 it's **5**
   against 3. Both engines. `PlayerMark.vue`'s comment reads "3–4 cells under a 256px sheet whatever it
   holds", which is false by 2. README §2.4 lists the old lap and not the new one. **Close it** by
   correcting the comment and pricing the +2 in the record, or by keeping the compressed budget in
   landscape.
3. **The landed drawn-edge row (`player-mark.spec.ts:566`) can't see paint.**
   - X1: `.head-sheet-edge { opacity: 0 }`, witnessed `"0"` on both visible edges in both engines,
     before and after the run. The row reads **2/2 GREEN**.
   - X2: `.head-sheet-edge { color: transparent }`, witnessed stroke `rgba(0, 0, 0, 0)`. Also
     **2/2 GREEN**.

   `drawn` is `path exists && stroke !== 'none'`, and `hugs` is a rect. Neither reads a byte, and LAWS
   says a rect is not paint. **Close it** by re-cutting the row to read painted bytes on the top band
   against the edge-OFF subtraction. The lane's own §2.2 statistic works: median 14–17.6 : 1 with the
   edge on, ≈1.00 with it off. Ship X1 and X2 as the row's negative controls in the same batch. The
   existing planted-border half (B5) stays.
4. **The PROPOSED L5b can't fail on its own regression.** It reads GREEN on the tree and RED on
   `74a2b5d9`, but:
   - Plant A (the pass-4 `border: 2px solid color-mix(…30%…)` on `AttributionCard.vue`'s `.hover-card`,
     a consumer) reads **GREEN**.
   - Plant B (the same border on `PlayerLobby.vue`'s `.player-lobby`, the very site pass 4 minted it)
     reads **GREEN**.
   - Only plant C (deleting `<HandDrawnOutline>` from `HeadSheet`) reds it.

   The row keys on "the rule that holds `top: 100%`", and after this diff the only such rule is
   `HeadSheet.vue`'s own. So it's a site-keyed row in the rule-shape's clothing. **Close it** by keying
   on every scoped rule in any `.vue` under `src/pencil/chrome` that renders `<HeadSheet` (or on the
   computed border of every `.head-sheet`), with plants A and B as its negative controls, before the
   chair lands it.
5. **The edge ballot isn't a lawful pair.** Crop 1's left and middle arms differ by two variables: the
   edge, and the player mark's presence (the +45.13 px head row). The only other arm is the L5-red
   incumbent. The quieter-ink arm (`.head-sheet-edge { color: var(--ink-press-quiet) }`, one line) is
   unbuilt, as the lane says itself. **Close it** by building that arm behind one const on this tree and
   shooting drawn-full vs drawn-quiet on one payload with the mark present in both (registry §2.9).
6. **The drawn frame squares the card's corners, and π doesn't list it.** In the card's two top
   corners, 106 px sit inside the box but outside its 16 px-rounded ground. Control vs prototype on one
   minted payload, **67 (ch light) / 67 (ch dark) / 70 (wk light) / 69 (wk dark) of them move by
   ≥ 40/255**, with the control-vs-control noise arm at **0** in every reading. The frame is `radius 3`
   over a `1rem` ground, so the @mbabb card's silhouette goes from rounded to near-square. π lists
   "frame 0 → 1", not the silhouette. **Close it** by declaring the corners as a moved pixel and putting
   the fact in the edge ballot's caption, or by taking the frame's radius from the ground.
7. **The state line fails AA under the ruled statistic in light.** These are the lane's own sensitivity
   figures; I didn't re-run them. `1 player`'s worst core column reads 1.36–2.07 : 1 at 50–100 % mass,
   with 32–46 % of columns under 4.5. The shipped @mbabb caption on the control is as thin (1.45–1.57,
   68–70 %), which makes this an estate class. It doesn't make it a pass. **Close it** by booking one
   estate row (the tag rung in light, the caption beside it), or by moving the state line one rung up
   and re-reading it.
8. **Every room row is dev-vs-dev.** That covers F1's deck swatch, room π, the +22 / −105 / −106
   figures and crop 2 (`?wire=local` is DEV-only). **Closes** when W8's relay arm lets a dist form a
   room. Inherited, not curable here.
9. **Nothing standing reads the head.** The four golden crops contain neither the mark nor a sheet, r0
   L5 reads only the guard verbs, and gaps 3 and 4 show the two new rows are blind to paint and to the
   consumer site. **Closes** with gaps 3 and 4.
10. **The pose floor stays U-10** (70 of 210 inked px move ≥ 8/255). Crop 3 shows the stub at rest as
    a flat grey bar, the same bar crop 1 shows beside `@mbabb`. Whether a bar reads as a player is the
    owner's call. Open until the owner looks.
11. **Inherited and unmoved.** The accent-family law (PAL-WALK); r0 I4/I5; M19 real iOS, which
    includes whether a tap on a real iOS `<button>` moves focus and so "tells the room you looked
    away"; the relay arm; `visual-regression.spec.ts:790` (T9-R3, red on both arms, the lane's
    reading); the dark filter count 11 on both arms (the chair's `crayon-heart` row); PLACE's
    touch-seam arm (b), and the own-chart-vs-room price of arm (a), named but not cured. `--ring-ink`
    stays `currentColor` until MRK-LIVE's line lands at the fold (§6.7, correct).

---

## 1 · What I re-measured (both engines, my own instruments)

### R1 — the dist is the tree
The fresh build is `index-BQTW9FrsXaOa.js`, 43 files, matching the lane's cited identity. The dist
numbers below describe this tree, not a stale build (the lane's incident 9).

### R2 — `player-mark.spec.ts`, whole file, dev, after my restores: **24 / 24** (43.0 s)

### R3 — the band regime (`c5-regime`, 11 cells × 2 engines, seven at the table) → gaps 1, 2

| cell | pointer | regime | rows | sheet bottom | board top ch / wk | board left | lapped ch / wk |
|---|---|---|---|---|---|---|---|
| 390×664 | coarse | short | 1 + `and 6 more` | 147.4 | 131.7 / 131.4 | 14 | 7 / 7 |
| **390×799** | coarse | short | 1 | 147.4 | 199.2 / 198.9 | 14 | **0 / 0** |
| **390×800** | coarse | **tall** | 4 + `and 3 more` | 214.5 | 199.7 / 199.4 | 14 | **7 / 7** |
| **360×800** | coarse | tall | 4 | 214.5 | 210.3 / 210.0 | 14 | **7 / 7** |
| 390×820 | coarse | tall | 4 | 214.5 | 209.7 / 209.4 | 14 | 7 / 7 |
| 430×800 | coarse | tall | 4 | 214.5 | 179.7 / 179.4 | 14 | 6 / 6 |
| 390×844 | coarse | tall | 4 | 214.5 | 221.7 / 221.4 | 14 | 0 / 0 |
| 844×390 | coarse | tall (pass-4 key TRUE) | 4 | 226.5 | 16 / 16 | 241 | **6 / 6** |
| 812×375 | coarse | tall (pass-4 key TRUE) | 4 | 226.5 | 16 / 16 | 232.5 | **5 / 5** |
| 700×780 | **fine** | **short** | 1 | 152 | 67.6 / 68 | 16 | 8 / 8 |
| 1280×800 | fine | tall | 4 | 222.4 | 124.5 / 124.2 | 124.8 | 3 / 3 |

This reproduces the earlier attempt's `k1` table cell for cell, and the README's 390×664 / 390×844 /
844×390 cells. Dropping the pointer from the key also sends a fine-pointer portrait desk window
(700×780) into the phone's budget, where one row still laps 8 cells. The landed row reads 390×664 and
844×390 only. Its in-row "negative controls" (`pass3` / `pass4`) evaluate the spec's own query strings
against the viewport, so they witness the cell, not the product. The product-side negative is the
lane's B4, which does red it.

### R4 — the drawn edge, painted, dist vs control, one minted payload per theme (`c5-dist`) → gaps 3, 6

1280×800 fine. Payloads were minted from the control's own givens (`ATMuMTcwMjA4NTA5Mj…` ch light,
`ATMuMjA3MDk1MTM2MT…` ch dark, `ATMuOTA2MTIwNzUwMT…` wk light, `ATMuMDIwODk2MDA3Mz…` wk dark), with
61 givens read back identical on all three arms (control, control again, prototype). The card is opened
by its own hover and settled when opacity is 1 and two reads of its rect agree. The box is
`{0, 52, 256, 131}` on every arm.

| | control edge median / cols < 3 | prototype edge median / cols < 3 | corner px outside the ground moved ≥ 40 (of 106), noise → prototype |
|---|---|---|---|
| chromium light | 1.063 / 1.00 | **17.645** / 0.007 | 0 → **67** |
| chromium dark | 1.062 / 1.00 | **14.398** / 0 | 0 → **67** |
| webkit light | 1.064 / 1.00 | **16.850** / 0.007 | 0 → **70** |
| webkit dark | 1.064 / 1.00 | **14.128** / 0.007 | 0 → **69** |

Chromium matches the lane's §2.2 to the third decimal. WebKit reads 0.4–0.5 lower on my recipe (best
of 5 rows vs the ground at y=10). The verdict is the same: an invisible ~1.06 : 1 hairline becomes a
full-weight line. The corner column is gap 6.

### R5 — filters, the estate's counting rule, on the built dist vs the control (`c5-dist`)

| shut / card open / lobby open | light | dark |
|---|---|---|
| control (both engines) | 9 / 9 / – | 11 / 11 / – |
| control again (noise) | 9 / 9 / – | 11 / 11 / – |
| prototype (both engines) | **9 / 9 / 9** | **11 / 11 / 11** |

**The filterBudget doesn't grow.** The dark 11 is the control's own population (the chair's
`crayon-heart` row). I read the desk only; the earlier attempt's `k4` read 390×844 coarse too, with the
same counts.

### R6 — break X1 / X2 on the landed edge row (`readings/c5-break-X1-X2.txt`) → gap 3

| plant (witnessed in-run, both engines, before and after) | `player-mark.spec.ts:566` |
|---|---|
| X1 `.head-sheet-edge { opacity: 0 }` (opacity `"0"` on both visible edges) | **2 passed, exit 0** |
| X2 `.head-sheet-edge { color: transparent }` (stroke `rgba(0, 0, 0, 0)`) | **2 passed, exit 0** |

Restored from backup, `shasum -c` OK (`b55d3fb1c3b7…`). The whole file then ran 24/24 (R2).

### R7 — the PROPOSED L5b, verbatim, on five copies (`readings/c5-l5b-plants.txt`) → gap 4

| copy | L5b |
|---|---|
| this tree | GREEN ("1 head sheet rule(s), each drawn, none bordered") |
| control `74a2b5d9` | RED ("AttributionCard.vue .hover-card paints a border draws no HandDrawnOutline") |
| **A**: pass-4 border on `AttributionCard.vue .hover-card` (the consumer) | **GREEN** |
| **B**: pass-4 border on `PlayerLobby.vue .player-lobby` (**the site pass 4 minted it**) | **GREEN** |
| C: `<HandDrawnOutline>` deleted from `HeadSheet`'s template | RED |

### R8 — gates, bare, tree / control

`check-copy-register` 0/0 (0 dashes, 0 unadmitted: **M16 holds**) · `check-sleep-lint` 0/0 (35 specs;
pass 4's six findings are gone) · `check-theme-tokens` 0/0 · `check-lane-membership` 0/0 ·
`check-motion-contract` 0/0 · `check-pw-projects` 0/0 (tree 35 specs / 571 resolved, control 34 /
547; check 8 green, no restamp). I didn't re-run `eslint .`, `prettier --check`, `vue-tsc` or vitest.
Those are the lane's `battery-final.txt`, and the earlier attempt reproduced them 0/0.

### R9 — the undefined-token census and the @property law, on the pass-5 delta

The new `var()` refs in the `src/` diff are `--color-popover`, `--color-user-ink`, `--ease-standard`,
`--font-hand`, `--head-rule`, `--ink-press-quiet`, `--mark-ink`, `--presence-ink-dur`, `--tap-floor`,
`--type-small` and `--type-tag`. Every one resolves:
- global: `index.css` `:root`/`@theme`, and `typography.css`
- file-local: `--mark-ink` on `.player-mark`
- inline: `--presence-ink-dur` on the mark's `:style`; `--tap-floor` on App's page root

There are **0 fallbacks** and no new `@property`; `--head-rule`'s one block (`initial-value: 0px`,
file scope) is pass 4's and unchanged. HeadSheet's transitions are byte-identical to the control
card's (150 ms `--ease-standard` + the UI-6 `visibility` delay).

---

## 2 · Strengths

- **The grafts came back with rows that fail.** B1 (Escape re-plants `el.focus()`), B2 (`focusin`
  unbound) and B3 (`@pointerdown.prevent`) each red a landed row. B3 reds in WebKit only, and a planted
  control in the same run asserts the engine asymmetry. The Escape theft pass 4's critic found is gone.
- **One sheet, not two patches.** `HeadSheet.vue` (+81) owns the hang, the fade, the UI-6 delay and the
  edge once, and both consumers shrink (−33, −29). The box is byte-identical (R4: `{0, 52, 256, 131}`
  on every arm) because the old 2 px band became padding. CH-71's rule holds by construction.
- **One population.** The state line, the accessible name, the rows and `and N more` count the same
  people. `others` and `alone` are struck, not renamed. The lane found its own blue-stub defect by
  looking at its crop and gated it (B7).
- **π dist-vs-dist with a noise arm on minted payloads.** That cures pass 4's confound, and my rebuild
  gives the same identity.
- **No new filters in either theme** (R5). **M16 holds** (R8). **No new registrations or fallbacks**
  (R9).
- **Incidents self-declared**, including a `pkill -f` and a `git status` in the control.

---

## 3 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | **HIT**: the edge row passes an unpainted edge (X1) and an inkless one (X2) |
| spec-cites-itself circularity | **HIT (partial)**: the regime row's in-row controls evaluate the spec's own query strings against the viewport. The "space" is the lane's two portrait cells, and the 800–835 band is outside both (R3) |
| gates that cannot fail | **HIT ×2**: `:566`'s paint half (X1, X2); the PROPOSED L5b at both consumer sites (plants A, B) |
| elegant-reduction trap | **HIT (declared)**: "a measured key needs the board's rect in a pencil component … was not built" is the hard part, left undone. R3 prices it at 7 lapped cells on 360×800 |
| legacy aliases | clear: `alone` / `others` / `playersLine` / the `stateLine` prop are struck, not renamed |
| masked fallbacks | clear: `SOLO` is a declared population, gated by B7. 0 `var(x, fallback)` added (R9) |
| unverified gestalt | **partial**: the edge is framed in chromium light only, and crop 1 shows the corner squaring without naming it |
| consumer-less substrate | clear: `HeadSheet` has two consumers and four instances |
| generic default | clear: no eyebrow, arrow, numbered marker or card set. The edge is the wells' own frame |
| π, undeclared | **HIT**: the card's corners (67–70 of 106 px, noise 0, gap 6); the landscape +2 lapped cells, which the code comment denies (gap 2) |
| forgotten constraint | **HIT**: AA under the ruled statistic in light (gap 7, the lane's own reading); U-10's one-variable pair (gap 5). filterBudget (R5), M16 (R8), @property and the token census (R9), W2's mechanics and the dock all hold |

---

## 4 · The frames, looked at

- **`1-edge-control-card-vs-drawn-card-and-lobby.png`** (chromium · light · 1280×800 · fine). The
  incumbent's hairline is barely there over the boiling wordmark. The drawn card reads as a new, heavier
  object with near-square corners. The stub beside `@mbabb` is present in arms 2 and 3 and absent in
  arm 1, so this is an illustration, not a ballot (gap 5).
- **`2-f1-true-vs-false.png`** (chromium · light · 1280×800 · fine · room of three, dev). It does its
  job. Under FALSE, the self blue (`guilty-tern`) sits beside the 275° peer's indigo (`compact-takin`).
  The self slug differs between arms. The caption says so, and it isn't an F1 variable.
- **`3-pose-floor-rest-vs-lifted-x4.png`**: a flat bar against a blob, ×4. Legible as a pose change.
  Whether a bar reads as a player is U-10 (gap 10).
- **`4-phone-dark-coarse-seven.png`** (chromium · dark · 390×664 · coarse). This is the short band as
  claimed, and the sheet still laps the board's top row (R3: 7 cells at 664, one row).

## 5 · Ballots for the owner (from the prototype, as I'd forward them)

- **F1**: crop 2, one payload, one variable. Forwardable as is.
- **The edge**: **not forwardable yet** (gap 5). Two lawful arms, drawn-full vs drawn-quiet, on one
  payload with the mark in both, and the corner squaring named in the caption.
- **The pose floor**: crop 3, U-10.

## 6 · My incidents

1. My first `playwright test` with the config in the scratchpad died before a test ran: `Cannot find
   module '@playwright/test'`, because nothing resolves from outside the frontend. I linked the main
   tree's `node_modules` into my scratch dir (a symlink in the scratchpad, not in any tree) and re-ran.
   No test was affected.
2. Five bare gates wrote their stdout to `/tmp/_o` (outside the session scratchpad) for one command.
   Deleted in the same command.
3. `check-pw-projects --self-test` ran in the control tree (a node read, no git). A `find -newer`
   afterwards shows no file in `w7-control` changed.
4. X1/X2 edited the prototype's `HeadSheet.vue` while my dev server was serving it (HMR). The file was
   restored from backup (`shasum -c` OK) and the whole spec file ran 24/24 afterwards.
5. The worktree's `git status` at return is the 23 product files. The ignored
   `web/frontend/tsconfig.tsbuildinfo` predates me (the lane's `vue-tsc -b`).

## 7 · Cross-pollination

- **The paint-blind edge row** (X1/X2's recipe: plant `opacity: 0` and then `color: transparent` on the
  drawn layer, witness it in-run, run the landed row). Every "edge present" gate owes it: CTRL-TAPE,
  CTRL-RULE and the chair's R3 re-cut (the bar's `HandDrawnOutline`).
- **A source-shape law row gets planted at every CONSUMER site**, not only at the site that was red
  (plants A and B). This applies to the chair's R3, L1 as a ceiling, and every L-row keyed on "a rule
  that does X".
- **Regime cells at 390×800 and 360×800**, not only 664 and 844. PLR-COUNT, PLR-PLACE and every §10
  sheet keyed on a height should read the band 800–835 and 360-wide phones.
- **The corner count** (ink outside the ground's own radius, noise arm beside it). It prices any drawn
  frame laid over a rounded ground (SolverErrorNote's `radius 0` over `0.75rem` is the precedent).
