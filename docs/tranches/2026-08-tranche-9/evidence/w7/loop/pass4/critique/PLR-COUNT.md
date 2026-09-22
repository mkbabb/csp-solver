# PASS-4 CRITIQUE · PLR-COUNT · the tally of everyone (§11)

Adversarial. I didn't write the charter or the prototype. The work tree is `.claude/worktrees/wf_f72f3b5a-83a-52`, base `74a2b5d9`, 16 tracked files (+473/−472) and 6 untracked. It was byte-unchanged at my start and at my return.

**VERDICT: ADVANCE · convergence 80 % (pass 3: 72).**

## Servers

I stood up my own servers and killed each one by PID at return.

| port | what | how I verified it |
|---|---|---|
| 4238 | the work tree, dev | private cacheDir `.vite-cache-plrc-critic` |
| 4239 | the shared control's dist | `index-CubiZsMVSwTc.js` |
| 4240 | my own build of the work tree | `index-DNEPsusRQXVl.js`, byte-for-byte the prototype's identity. The dist reproduces. |
| 4241 | a dev-mode control | a two-line config over `w7-control` with a lane-named cacheDir. The control tree's `git status` was unchanged before and after. |

- **Board:** every π row and dist row loads the app's codec payload `ATMuNTMw…MDc5`. Cell 0 reads `5` on both arms in every scene.
- **Where things are banked:** instruments in `critique/PLR-COUNT/instruments/` (`probe.mjs`, `tokens.mjs`, `pw.config.ts`, the vite configs), readings in `readings/`, logs in `logs/`.

## 1 · What I re-ran (both engines unless stated)

| claim | prototype | my re-run | |
|---|---|---|---|
| π vs `74a2b5d9`, solo, built dist vs control dist | 1 key: corner 75.53 → 119.53 | desk 1280×800 fine: only `.corner-left.w` 75.53 → 119.53. Phone 390×844 `hasTouch` dpr 3: only `.mobile-attribution.w` 75.53 → 119.53. Regime witnessed on both pages (coarse true/true, fine false/false). Keys read: tag, rect, color, bg, font-family/size/line-height/weight, filter over 10 selectors. | REPRODUCES |
| π in a room of 3 | 127.19 | **like-for-like, dev proto vs DEV control** (see §2.2): only `.corner-left.w` 75.53 → 127.19 | REPRODUCES (method corrected) |
| live regions, room of 3 | 6 / 6 | dev control 6, dev proto 6, same order. The one change is `ul.players-roster` taking `sr-only`, not `p.players-status` as the README says: that one is `sr-only` on both arms. | REPRODUCES, element mis-named |
| G9 inner leaver at six | `[0,0,0,0,100]` / `[…,96.53]` | chromium `["0","0","0","0","100"]`, webkit `["0","0","0","0","100"]`, first rAF frame after `bye a1`; all 0 by 600 ms | REPRODUCES |
| G9b departure mid-draw | rises 0, still drawing | estate row green both engines. **Born-RED by me:** planting pass-3's `else settle(now)` in the watch reds it in BOTH engines (`afterBye.off` = 0), and the 4 sibling rows stay green (`logs/plantA.log`) | REPRODUCES, and it can fail |
| Escape keeps the caret; focus elsewhere shuts | INPUT stays; `{false,true}` | my own driver (`keys`): mouse press opens (`true`), active element stays `INPUT.cell-native-input`. Escape shuts it and the caret stays INPUT. Re-open, then focus another cell: `false`. A keyboard open then Escape leaves focus on the mark. Both engines. | REPRODUCES |
| G16, the 5↔6 swap | title/N5 0.362–0.435, floor vs N1 green | **independent metric** (luminance Δ vs the crop ground, one normaliser per engine × theme, ÷dpr², PRM so all strokes land inked): 6/5 = **0.387 / 0.393 light**, **0.424 / 0.403 dark**; 6/1 = 1.635 / 1.653 / 1.781 / 1.689 (floor GREEN). **6/2 = 0.965 / 0.977 in light**: six people paint lighter than TWO in light, both engines. The prototype's own table says the same (84.96 < 90.91, 84.38 < 94.75), but the README never says it. | REPRODUCES; the gap is sharper than stated |
| numeral painted AA | 6.136 light / 9.711 dark | core contrast **6.136 / 9.711**, identical in both engines. The peer stroke at N=2 is 5.522 / 5.45 light. | REPRODUCES |
| filterBudget, built dist | 9 / 3 ids, 0 in mark, "room of 5, sheet open" | **dist, solo, sheet open:** 9 = 9, ids `grain-static, wobble-celestial, wobble-heart`, 0 in mark/sheet, normal + PRM. **Dev room of 5, sheet open** (`5 players`, 5 strokes): 9 = 9 vs the dev control, 0 in mark/sheet, normal + PRM. | The number holds; the row's label is false (§2.1) |
| undefined-token census, the mark's 13 `var()`s | "all declared", a source grep | **runtime read** on the mark, a stroke, the sheet and a row in a live room with the sheet open. Every consumed token resolves in both engines. `--mark-ink` / `--presence-ink-dur` are empty only on the sheet, which consumes neither. Timing slots paint `color 0.4s cubic-bezier(0.4,0,0.2,1)` / `stroke 0.4s …`. | CLEAN |
| estate rows | 47 passed / 1 skipped / 0 failed | **47 / 1 / 0**, both engines, dev (`logs/estate.log`) | REPRODUCES |
| bare gates | 0 except check-pw-projects 1 | vue-tsc -b 0 · typecheck:e2e 0 · prettier (changed files) 0 · eslint src/e2e/scripts 0 · knip 0 · lint:copy 0 · test:font-coverage 0 · lint:motion 0 · lint:theme-tokens 0 · lint:live-regions 0 · **check-pw-projects 1** | REPRODUCES |
| lint:copy can fail | — | planted `and ${n} more — waiting` in `LOBBY_COPY` → EXIT 1, names `copy.ts:29`. Restored → 0. | CAN FAIL |
| font-coverage can fail | "jinxed" plant | planted `and ${n} more, next` (the cut has no `x`) → EXIT 1, "THIS IS THE RANSOM NOTE". Restored → 0. | CAN FAIL |

## 2 · What isn't converged

### 2.1 The dist census's "room of five with the sheet open" is a SOLO sheet

`useSession.ts:295–307`: `?wire=local` is DEV-ONLY. `asksLocalWire()` is called only behind `import.meta.env.DEV`, so the build folds it away. The prototype's `plrc-dist.spec.ts` posts `hi` on a BroadcastChannel to a built page that isn't listening. It never reads the label. `readings/summary.json` `dist-*.roomOfFiveSheetOpen` is a one-player sheet.

My run 1 did the same thing and read `1 player` on the dist in every "room" scene (`readings/probe-chromium-run1-DIST-ROOMLESS.json`). That's how I found it.

The claim survives: dev room of 5 with the sheet open reads 9 = 9 against a dev control, both engines, both regimes. But the row as titled is the pass-3 defect ("G5 on the dev server while titled built dist") in mirror image, and it needs re-titling. It's the dist SOLO sheet plus the dev ROOM; a room on a dist needs the relay.

### 2.2 The room π and live-region rows compared a room against a solo control

`plrc-census.spec.ts` (`piScene`, `live regions`) runs the CONTROL arm on the control dist (`:4230`), where `wire=local` can't form a room. So "deskRoom3 / deskRoom6 … exactly one key differs" and "room 3: 6 on control" are proto-in-a-room vs control-alone.

My like-for-like dev-vs-dev re-run confirms the numbers (1 key, 75.53 → 127.19; regions 6/6), so nothing is lost. But the rows as banked couldn't have seen a room-only delta on the control side. That's what the substrate moves: the control paints `ul.players-roster`, the proto sets it `sr-only`. The README attributes the difference to `p.players-status`, which is `sr-only` on both arms.

### 2.3 G14's "opaque ground" clause cannot fail, and the row asserts no legibility

`player-tally.spec.ts:496` is titled "the register's ground is opaque and its quiet rungs are legible on it". It asserts `expect(read.ground).not.toMatch(/,\s*0?\.\d+\)/)` plus the row and foot counts. I planted the exact regression it exists to catch, `background: color-mix(in srgb, var(--color-popover) 80%, transparent)`. Both engines serialise that as `color(srgb 0.9865 0.9859 0.9835 / 0.8)`: no comma before the alpha. **The row passed, 2/2** (`logs/groundplant.log`).

No contrast number is asserted anywhere in the row, so "legible" is its title, not its test. **Struck under registry §2.10 until re-cut:** parse the alpha from any serialisation (or composite the ground over black and white and require equality), and assert the painted ratio of `.pl-state` / `.pl-qual` / `.pl-more` on it.

### 2.4 The `settle()` cure has no gate

`useTallyStrokes.ts` `settle()` now stops the tween first (charter 3). I deleted those two lines (`draws.get(k)?.stop(); draws.delete(k);`) and ran the whole estate: **47 passed / 1 skipped / 0 failed, both engines** (`logs/plantB.log`).

The departure-during-draw row guards the WATCH's exclusion of mid-draw keys, which is real and born-RED (§1). The `settle` repair it names is guarded by nothing. Its only callers left are the PRM watch and PRM `drawIn`, and no row engages reduced motion mid-draw. Either write that row (emulateMedia reduce 80 ms into a draw-in, the dash reads 0 and stays 0), or delete the lines if the chain's PRM force-clear makes them redundant. The comment says it does.

### 2.5 The swap at six is not monotone: the owner's (B-COUNT-1), with one arm unbuilt

The swap reads 0.36–0.44 of five strokes in every cell (§1, reproduced by an independent metric). In light it reads lighter than TWO strokes in both engines.

Title is the smallest rung that clears the N=1 floor. That's a real improvement on pass 3, which cleared it only under a per-crop normaliser, and it doesn't step the head (44 × 44 coarse, 39.75 fine; π). But arm (c) of the ballot (no swap: five strokes and a written remainder) is **unbuilt and unframed**. U-10 needs both arms of a fork buildable and framed. As offered, the owner can only pick between two numerals.

G16 also remains an instrument (`plrc-strip.mjs`), not an estate row. Nothing reds if the rung drops back to `--type-heading`.

### 2.6 A CI gate is RED on this tree

`check-pw-projects` EXIT 1: check 8 FLOOR BAND, live 261 / 258 vs floors 214 / 212. The script rides the fe-unit lane (its own header). The tree adds 24 listed rows and pushes the band out. On `74a2b5d9` it reads 237 / 235 against the same floors, in band.

The prototype's reading of the script's law (`--restamp` is WGATE-only) is correct. But this means the tree can't fold without either a restamp or a red lane. That's a chair's row, and it must be written before the section folds.

### 2.7 Carried from the leader's substrate, still open in this tree

- **The short regime is still a viewport-height query.** `PlayerMark.vue:33` uses `(pointer: coarse) and (max-height: 799px)`. It no longer fires on a 1280×720 desk (reproduced by the estate row), but LAWS §Gates says to key on the space the sheet has.
- **844×390 / 812×375 reachability probe and card clientHeight not run.** `shortPhone` is TRUE at coarse landscape, so the 2-row budget there is unmeasured.
- **R6 L5 unreported.** `.player-lobby` draws `border: 2px solid color-mix(…)` (`PlayerLobby.vue:83`), a CSS border on a chrome surface minted this pass. It copies `AttributionCard.vue:170`'s pose on the control, but chair §1.3 says L5 "binds every drawn edge this pass mints". README §8 reports only the mark's `border: none`.
- **`--ring-ink` has no declaration on this base.** The mark's ring is `currentColor` (§6.7 open).
- **`poseFronts` isn't taken.** Segment counts were banked instead, as chair §6.9 allows.
- **The @mbabb hover region is −2.5 % (76 px²).** It's priced but not cured.

### 2.8 Smaller, each closable

- **Two runs cited as one.** `PlayerMark.vue:432–442` cites the G16 table as "one graphite stroke 60.42 / 60.42 … dark 58.69 / 62.04 … five strokes 230.84". Those are run-3 figures. The README's run-4 table reads 62.73 / 62.05, dark 62.42 / 59.82, five 230.73. Pick one run.
- **Unreproduced room collapse (INCIDENT 2).** N5 read as solo at t ≈ 7–8 s in both engines. It's not a presence expiry: `PRESENCE_EXPIRY_MS` is 45 000. My runs didn't reproduce it either. The cause is open.
- **No pass-4 frame shows the phone head in context.** Frames 1, 2 and 4 are isolated strips. Frame 3 is the desk in context, so the phone head is shown by π numbers alone.

## 3 · Checklist hits

| checklist item | where it hits |
|---|---|
| gates that cannot fail | G14's opaque clause (§2.3); the `settle` cure un-gated (§2.4) |
| unverified gestalt | the phone head in context has no frame (§2.8) |
| the constraint it forgot | R6 L5 on the sheet's border (§2.7); a CI lane red (§2.6) |
| mis-titled rows | dist "room of five" (§2.1); room π and live regions vs a solo control (§2.2) |
| the elegant-reduction trap | the swap ballot offers two arms of three (§2.5) |

Clear on every other item:

- **No vacuous or circular specs:** G9 and G9b fail when planted.
- **No legacy alias:** `drawing()` is gone and `PlayerTally.vue` / `PlayerLobby.vue` are deleted from `games/shared`.
- **No masked fallback:** `--tap-floor` is consumed bare in the mark.
- **No consumer-less substrate:** knip 0.
- **Not the generic default:** hand strokes, no cards or eyebrows.
- **π:** one declared width delta.
- **Constraints clean:** AA (painted), filterBudget 9, M16, the undefined-token census, and W2's tap floor.

## 4 · Strengths

1. **Both pass-3 reds are cured, and the cures fail when reverted.** G9's law is restated ("no survivor re-draws; only a stroke the tally didn't hold draws"), with an inner-leaver row. The watch excludes mid-draw keys, and the departure row goes RED in both engines under pass-3's watch (my plant).
2. **The four unrun gates now run and reproduce:** G4, G15, the quiet row (`page.clock`), and font coverage. Font coverage reads `LOBBY_COPY` by derive and reds on an uncovered glyph (my plant).
3. **Two real defects found in the leader's seat and cured with born-REDs.** Escape stole focus after a mouse open (INPUT → BUTTON). `@focusout` missed a mouse-opened leave. Both are reproduced here by an independent driver.
4. **G16 re-cut with one normaliser.** It exposed pass 3's green as an instrument artefact, and my independent luminance metric reproduces the new table's ratios to within ~0.03.
5. **The 13.3° family law is attributed to F1 with numbers** (82.2° / 52.5° under true, 13.3° under false), which is exactly the owner's evidence.
6. **The dist identity reproduces from source**, and π holds like-for-like on both engines at desk, phone and room.

## 5 · Convergence: 80 %

The centre has converged: the set law, the crossing, the width table, the one counting base, zero filters, painted AA, and the keys. It's reproduced in both engines, and the crossing and copy gates fail when broken.

Against it:

- One row can't fail and asserts no legibility (§2.3).
- A named cure has no gate (§2.4).
- Two instruments are mis-titled (§2.1–2.2). The numbers survive my like-for-like re-runs.
- A CI lane is red pending a chair's row (§2.6).
- The swap ballot is missing an arm (§2.5).
- The section's height-keyed regime and landscape cell are unmeasured (§2.7).

That's not zero gaps, and the streak is 0.

## 6 · Cross-pollination

- **Every lane with a ground or alpha assertion** takes §2.3's lesson: modern engines serialise `color-mix(…, transparent)` as `color(srgb … / a)`, and a comma regex never sees the alpha.
- **Every lane running π or a census with `?wire=local`** takes §2.1–2.2's lesson: the local wire is DEV-only. A dist or dist-control arm never forms a room, so room rows need a dev-mode control (the chair's two-line-config route).
- **Every ablation** takes §2.4's lesson: ablate each named cure line separately. Proving the row fails for one mechanism doesn't prove the other is guarded.
