# PASS-3 RESEARCH · PLR-COUNT · The tally is the mark

§11 the player mark (icon · lobby) · M14. Read-only on the product; no server started, no port
taken, nothing under `r0/`, `pass1/` or `pass2/` written. Every number below is either read off
this tree today (file:line, or an instrument in `instruments/` whose output is in `readings/`)
or cited to the pass-2 record as a pass-2 reading.

Base for pass 3 is **`74a2b5d9`** (CHAIR §"The base moved"). The pass-2 diff stands uncommitted
in `.claude/worktrees/wf_8630d340-e56-53` on `a8fee1f5`; §1 below is the replay's conflict map.

---

## 1 · The base moved, and it moved UNDER two of this family's four non-component files

`git diff --stat a8fee1f5 74a2b5d9 -- web/frontend/` — 16 files, +1,586/−94. Three of them are
this family's:

| file | the fold's change | what it does to the pass-2 hunk |
|---|---|---|
| `scripts/check-copy-register.mjs` | **+937** (G17 r0/r1/r2 + B1b) | the `COPY_SOURCES` arm is **dead weight**: see §2 |
| `scripts/check-font-coverage.mjs` | +34 (`paperNoteCopy` derive; `zoneRowLabels` strings `["marks","candidates"]` → `["marks","what fits"]`) | the `lobbyStrings` hunk's context lines conflict; resolve TOWARD the fold |
| `src/games/shared/GameControlPanel.vue` | +13 at `:947`, `:978-987`, `:1301` (B1b copy) | PLR-COUNT deletes −213 lines elsewhere in this file; the three fold hunks are outside the players compartment and survive untouched |

`GameBoard.vue`, `BoardHost.vue`, `useGameCell.ts`, `DigitCell.vue` also moved (the attribution
tape and the coarse tape). PLR-COUNT touches none of them. `useSession.ts`, `App.vue`,
`DifficultyTally.vue`, `AttributionCard.vue`, `useHoverCard.ts`, `pencilConfig.ts`,
`useJoinWash.ts` — **unmoved by the fold**, so those seven hunks replay clean.

---

## 2 · THE FOLD ALREADY BUILT HALF OF GAP 9, AND IT BUILT IT BETTER

This is the single biggest saving available to pass 3.

**`check-copy-register.mjs:344` at `74a2b5d9`:**

```js
const COPY_TABLE_NAME =
  /(?<![\w.$])(?:const|let|var)\s+[A-Za-z0-9_$]*(?:COPY|Copy)[A-Za-z0-9_$]*\s*(?::[^=]*)?=\s*\{/g;
```

consumed at `:821-826` — `objectBody()` then `copyLiterals(body.text)`, which reads all three
quote grammars including a template literal's static segments. Verified against the real regex
today (`node -e` over the script's own source): it **matches `export const LOBBY_COPY = {`**.

So at the new base the register's five strings are already in the copy census **by discovery,
by name, with no enumeration and no block lookup to fail open**. The pass-2 arm

```js
const COPY_SOURCES = [{ where: "PlayerLobby.vue", name: "LOBBY_COPY" }];
… if (!block) continue;                       // ← the critic's gap 9
```

is redundant AND is the failure mode. **The cure for gap 9's copy half is DELETION**, and the
lane cites `check-copy-register.mjs:340-345` as the seat. The registry's coupling 16 (`LOBBY_COPY`
+ `COPY_SOURCES` taken WITH the fail-closed condition) is satisfied by the fold, not by a lane.

Proof route for the prototype (one gesture, revert after): plant `solver` inside `LOBBY_COPY` in
the worktree, run the gate bare, expect RED attributed to the arm `COPY table`. The fold's
`ADMITTED` ledger is **EMPTY** at `74a2b5d9` (`:178-190` — both T9-W7 strikes landed), so a new
jargon string has nowhere to hide. None of the five register strings trips the 25-entry lexicon
(`:144-172`): `player`, `players`, `you`, `seconds ago`, `and … more` are all clear.

**Gap 9's font-coverage half is ALREADY CLOSED and the critic mis-read it.** `lobbyStrings`'
`if (!block) return []` does **not** fail open, because the caller reds on an empty derivation:

```
check-font-coverage.mjs:495-501
  const found = ex.run();
  if (!found.length) problems.push(`… extractor \`${id}\` (${ex.what}) found NOTHING. An empty
    derivation contains anything, so this check would pass on a blind read — the construct was
    renamed, or the file moved.`);
… :597  if (problems.length) { … process.exit(1) }
```

The fold's own `paperNoteCopy` derive (`:117-131`) uses the identical `return body ? … : []`
shape, which is the estate declaring this the house form. **Report gap 9 as HALF STRUCK on a
measurement, not cured by a diff.**

---

## 3 · TWO CI GATES THE PASS-2 PROTOTYPE NEVER RAN, AND BOTH ARE RED ON ITS DIFF

Run bare in the pass-2 worktree today. Outputs banked in `readings/`.

### 3.1 `npm run lint:knip` — **EXIT 1**, three unused exports

```
Unused exports (3)
LOBBY_SAMPLES            src/games/shared/PlayerLobby.vue:33:14
tall                     src/games/shared/PlayerLobby.vue:54:10
tallyFrames    function  src/games/shared/useTallyStrokes.ts:51:17
```
(`readings/knip-pass2-worktree.txt`)

`knip.json` sets `"exports": "error"` and scopes `src/**/*.{ts,vue,css}`. So gap 8 is not a
taste question: **`LOBBY_SAMPLES` is a CI red**, and it brings two the critique did not name
(`tall`, `tallyFrames`). All three want `export` dropped, not a consumer invented.

### 3.2 `node scripts/check-pw-projects.mjs` — **EXIT 1**, check 6

```
✗ 6 SPEC MANIFEST — 1
  • [6 SPEC MANIFEST] player-tally.spec.ts: on disk, NOT in SPEC_MANIFEST. A new spec is a
    deliberate act — add it here in the same commit, and check its engine coverage while you
    are at it.
```
(`readings/check-pw-projects-pass2-worktree.txt`; the gate is CI's, `ci.yml:1203`)

`SPEC_MANIFEST` is a closed 34-name set at `check-pw-projects.mjs:230-265`. Adding
`player-tally.spec.ts` also moves the `chromium`/`webkit` count floors (listed 243 / live 242,
240 today) — the gate prints the band and the floors are stamped at `4686436f` in
`scripts/census.stamp.json`, so the lane names whether it re-stamps or lands inside the band.

**And the gate's check 4 is a trap for this family's own G11**: an undeclared per-ROW engine skip
(`test.skip(browserName === 'webkit')`) reds. The pass-2 spec has no such row — the webkit Tab
skip lives in the probe, not the shipped spec — and it must stay that way, or `HOLDOUTS` takes a
declared entry with a cite in the same commit.

**The local seal battery is a SUBSET of CI.** Add `lint:knip` and `test:e2e:projects` to this
family's battery; the pass-2 README's ten gates omit both.

---

## 4 · The surfaces and their exact seats

| surface | file:line (pass-2 worktree, replays onto `74a2b5d9`) |
|---|---|
| the head row + the `#mark` slot | `AttributionCard.vue` `.head-left-row` → `.attribution-disclosure` **then** the slot |
| the two mounts | `App.vue:805-841` (`desktopTally`, `mobileTally`, both `v-if="view === 'playing'"`, both joined to `closeAll()`) |
| the mark | `PlayerTally.vue:166-211` (`.pt-mark` button, `.pt-marks` svg, `.pt-count` span) |
| the register | `PlayerLobby.vue:128-144` (`.player-lobby[data-lobby]`, `.pl-state`, `.pl-rows > .pl-row > .pl-row-mark path + .pl-name + .pl-qualifier`, `.pl-more`) |
| the strokes | `useTallyStrokes.ts` (`tallyFrames`, `tallyPose0:66`, `useTallyStrokes:68`) |
| the count's clock | `useSession.ts` `PRESENCE_QUIET_MS = 20000`, `lastHeard` (reactive), stamped in `armPresenceExpiry` |
| the well's residue | `GameControlPanel.vue:1134` `.players-roster.sr-only` `role="log"`, `:1145` `.player-row`, `:1153` `.player-swatch`, `:1636-1641` the swatch rule |
| the deck's count | `GameGallery.vue:217-222` — `peers = players.length − 1`, `"1 other player"` / `` `${peers} other players` `` |

**Tokens consumed** (none minted): `--tap-floor` (`App.vue:961`, on `.page-root`),
`--color-user-ink`, `--color-pencil-graphite`, `--ink-press-quiet`, `--color-popover`,
`--color-border`, `--ease-standard`, `--font-hand`, `--type-tag` (= `--type-caption`),
`--type-small`, `--type-subheading`, `--peer-ink-l`.

---

## 5 · The numbers pass 3 must hit

### 5.1 The sheet-height law — **DO NOT TAKE PLR-SELF'S COEFFICIENTS**

Registry §2 coupling 16 hands this family "the corrected sheet-height law
`H = 57.36 + 21.6r + 18.96m`". **Those constants are PLR-SELF's box, not this one's**, and
taking them verbatim mis-predicts this sheet by **11.16 px at (r=4, m=1)** (162.72 predicted vs
173.88 measured in pass 2). The graft to take is the **derivation**, not the constants — and
derived from this box, PLR-COUNT's own law is already right to 0.05 px:

```
chrome        padding 1rem×2 = 32  +  border 2px×2 = 4                  = 36.000
state line    --type-tag × 1.35   (14.048 desk 1280 / 14.000 coarse 390) = 18.965 / 18.900
.pl-rows      margin-top 0.35rem                                        =  5.600
row           max(mark 22px, .pl-name 16×1.35 = 21.6)                    = 22.000
gap           0.1rem between rows, (r−1) of them                        =  1.600
foot          .pl-more margin-top 0.1rem + --type-tag × 1.35            = 20.565 / 20.500

H(r,m) = (36 + state + 5.6 − gap) + (22 + gap)·r + (foot)·m
       = 58.965 + 23.6r + 20.565m   (desk 1280)
       = 58.900 + 23.6r + 20.500m   (phone 390 coarse)
```

Checks against pass-2's measured boxes: desk (4,1) → **173.93** vs 173.88 · tall phone (4,1) →
**173.80** vs 173.75 · short phone (1,1) → **103.00** vs 102.97. The two laws differ because
`.pl-row` here is floored at the 22 px row mark (`.pl-row-mark { height: 22px }`,
`PlayerLobby.vue:213`) while PLR-SELF's stub row is the 21.6 px line box. Report the graft
**taken as method, refused as arithmetic**, with these three residuals.

### 5.2 The short-phone regime — priced, three ways

`PlayerLobby.vue:97-104`: `rows = tall ? 5 : 2`, `shown = people.length > rows ? slice(0, rows−1)
: people`. At N=3 short that is **one row and a foot** — the surface whose office is "who is
here" names only YOU.

| option | short at N=3 | H | sheet bottom (top 44) | vs grid top 131.73 |
|---|---|---|---|---|
| (a) today | `3 players` · `\| you` · `and 2 more` | **103.0** | 147.0 | laps 15.3 |
| (b) foot dies in the short regime, budget buys a name | `3 players` · `\| you` · `\| shiny-duck` | **106.1** | 150.1 | laps 18.4 |
| (c) the foot dies EVERYWHERE (one rule: show `min(N, ROWS)`, the state line carries N) | short as (b); tall at N=16 = `16 players` + 5 names | **176.9** tall (5,0) vs 173.8 today | +3.1 tall | tall phone clears by 0.9 (was 4.0) |

(b) costs **3.1 px of lap for one more name**, in a regime where every lapped-cell tap already
dismisses (11/11 measured, pass 2). (c) is the parsimonious one: `and N more` is arithmetic the
state line already permits at every N, so the foot earns its place only if the reader must not
subtract — and it retires one of the five strings, one derive row, one computed, and `.pl-more`
with its own AA row. **(c) narrows the tall phone's clearance to 0.9 px** — measure it before
recommending, and it is the one number that can kill (c).

### 5.3 The 5↔6 look — MEASURED, and the mark goes non-monotonic

The critic's gap 11 ("declared as geometry, never judged as a look") is now a number.
`instruments/ink-weight.mjs` over pass 2's banked head strip (coverage-weighted ink, right of
the wordmark; `readings/ink-weight-frame1.json`):

| N | chromium ink px² | webkit ink px² | ink box w×h (chromium) | runs |
|---|---|---|---|---|
| 1 | 309.28 | 272.62 | 8 × 51 | 1 |
| 3 | 839.01 | 791.55 | 51 × 51 | 3 |
| 5 | **1416.95** | 1324.67 | 93 × 51 | 5 |
| 6 | **206.79** | 212.75 | 15 × 29 | 1 |

**5 → 6 drops the mark's painted ink by 85.4 % (chromium) / 83.9 % (webkit)**, its ink box from
93×51 to 15×29. And the six-person mark carries **33 % less ink than the ONE-person mark**
(206.79 vs 309.28). One more person arriving makes the control the lightest it ever is. The
strip is ≈dpr 2.13 (stroke 51 dev px ÷ 23.9 CSS painted, digit 29 ÷ 13.6); the ratios are
scale-free, which is the claim.

Three priceable answers, all inside the existing tokens:
- **rung** — `.pt-count` `--type-subheading` 20.352px → `--type-heading` 1.618rem = 25.888px
  (+27 % linear, ≈ +62 % area). `.pt-mark`'s `min-height: 36px` absorbs it; the head line does
  not step (`PlayerTally.vue:240-243`).
- **weight/ink** — the digit is already 500 in `--color-user-ink`; nothing cheap left.
- **a kept stroke bed** — five strokes plus the written count. Buys monotonicity outright but
  breaks the family's own "one threshold, one object" doctrine (`PlayerTally.vue:9-14`) and
  re-words G1 to `runs == min(N, 5)`.
- **declare it intended** — the number above is then the frame the owner disposes on (U-10).

### 5.4 The rest, unchanged and re-confirmed as the targets

Width table `44 · 44 · 51.66 · 62.28 · 72.92 · 44` to 0.01, both engines · filterBudget **9**
live with the tally boiling AND the sheet open, ON THE DIST · AA on the opaque ground:
`.pl-state`/`.pl-qualifier`/`.pl-more` **5.159 / 6.021–6.099**, `.pl-name` **14.651 / 12.163**,
walk worst on `--color-popover` **5.28 light / 9.64 dark** (PLR-SELF's independent read) ·
44×44 coarse with the 40 px negative control · π against a HEAD control **named `74a2b5d9`**
(pass 2's `.corner-left` 75.53 → 119.53 on PLAYING only, exactly the mark's 44 — the wave's one
declared delta; `?view=gallery` byte-identical) · R6 hue census byte-identical to r0's 29 rows.

---

## 6 · The primitives to reuse, by name

| primitive | where | what it gives |
|---|---|---|
| `useTallyStrokes(strokes)` | `useTallyStrokes.ts:68` | baked pose stack + shared beat + per-member draw map; `poses`, `boilFrame`, `drawIn`, `settle`, `dashOffset` |
| `tallyPose0(s)` | `useTallyStrokes.ts:66` | the still form for the sheet's rows (a popover that does not breathe) |
| `claimHeadDisclosure(close)` | `useHoverCard.ts` (added by this family, seated once by PLR-SELF) | one open disclosure per head anchor |
| `createSequenceSubscription` | `@mkbabb/pencil-boil` | the one draw-in chain; `heldFrameCount`, `usePrefersReducedMotion`, `easeOutCubic`, `schedulerDebugInfo` are the same import |
| `generateLineBoilFrames` | `@pencil/grid/gridPaths` | grain-in-geometry; **zero live filters by construction** |
| `useBeatFrame` | `@pencil/composables/boilBeat` | the shared 125 ms beat, ref-counted — enrolls no new subscriber |
| `inkFor(index)` / `slugFor` | `playerIdentity.ts:49-70` | `oklch(var(--peer-ink-l) 0.11 {(i×137.5)%360}deg)`; **converge `seedFor` on PAL-TIN's hoisted form** — this family's `fnv1a(id) % 97` (`PlayerTally.vue:59-66`) is the same cure |
| `page.clock.setFixedTime()` | Playwright 1.61.1, `playwright-core/types.d.ts:18566` | §7.1's frozen clock |
| `expect.poll` over a peer write | `multiplayer.spec.ts:585-595` | §7.2's cure for G4's webkit half |

`createStrokeDrawIn(pathEl, …)` also exists in pencil-boil but wants a live `SVGGeometryElement`;
the pose stack re-renders four sibling groups, so the per-index handle map is the right shape.
Note it and refuse it with the reason.

---

## 7 · The routes for the gates that were never run

### 7.1 `N seconds ago` (gap 3) — the frozen clock exists in the estate's own Playwright

`page.clock.setFixedTime(t)` freezes `Date.now()`/`new Date()` and **keeps the timers running**,
which is exactly what this needs: the heartbeat must stay alive to hold the room, the two
`Date.now()` reads must not.

```
a.clock.setFixedTime(T0)            → boot A, invite, B joins
                                      armPresenceExpiry(B) stamps lastHeard[B] = T0
a.clock.setFixedTime(T0 + 26_000)   → press the mark: openedAt = T0+26000
                                      dt = 26000 ≥ PRESENCE_QUIET_MS (20000) → "26 seconds ago"
```

**The race to name:** B's 15 s heartbeat re-stamps `lastHeard[B]` at the frozen value, so steps 3
and 4 must land inside one beat. Assert the string, then read `.pl-qualifier`'s painted bytes for
the rung (5.159 light / 6.021 dark is the class's measured figure — the STRING is what has never
rendered, not the colour).

### 7.2 G4's webkit half (gap 13) — it is very likely a missing poll, not a rig limit

Prior art (background only): Playwright's own docs say every page in a context behaves as
focused and active, and `bringToFront()` is for genuinely visibility-dependent behaviour — so it
is the wrong instrument here. The estate's own counter-example is decisive:
`multiplayer.spec.ts:565-595` drives **four** pages in one context, each writing a digit, and
every page reads the other three — through `expect.poll(() => digitAt(p, cells[k]))`, not a
single read. The pass-2 probe used `locator.fill()` + an immediate read. **Re-cut G4 with
`expect.poll` and the estate's `writeFast` (`multiplayer.spec.ts:406-416`) before booking any
engine out of instrument reach.**

### 7.3 G13 (gap 6) — a two-server diff with one number behind it

Serve `74a2b5d9` read-only on the next free band port; on each tree read
`[...document.querySelectorAll('.dt-pose .dt-stroke')].map(p => p.getAttribute('d'))` — 4 poses ×
5 strokes = **20 `d` values** — and diff the sets. The extraction can only move them through two
constants, both verifiable statically first: `BOIL_CONFIG.tallyBoil === 0.6` (was
`DifficultyTally.vue:76`'s `TALLY_BOIL`) and `MOTION.tallyStaggerMs === 90` (was `:77`), both
landed at their shipped values in `pencilConfig.ts`. The third mover would be key ORDER inside
the wobble object (`{...TALLY_WOBBLE, seed}` vs `{roughness, segments, seed, jagged}`) — name it,
then let the 20-value diff answer it.

### 7.4 The re-point (gap 1) — send it to PLR-SELF with the target, and take theirs

CHAIR §6.9/§6.12 seats it ONCE under PLR-SELF. The three reads, exactly:

| read | today |
|---|---|
| `join-language.spec.ts:95-101` | `rosterInk = getComputedStyle(peerRow).color`, compared to `.join-trace`'s `stroke` |
| `join-language.spec.ts:162-177` | `peerColor !== selfColor` off `.player-row`'s `color`; `.player-swatch` backgroundColor `=== peerColor` |
| `multiplayer.spec.ts:193`, `:580` | `.player-swatch` backgroundColor, sets of 2 and 4 distinct |

`.player-swatch` **survives** this diff with `background: var(--color-user-ink)` on the row's
inline `p.ink` (`GameControlPanel.vue:1636-1641`), so the cheapest re-point is
`peerSwatch.backgroundColor` — zero gesture, no 700 ms settle, and `:175`/`:193`/`:580` already
read exactly that. The lobby target `[data-lobby] .pl-row .pl-row-mark path` costs a press and a
settle and only exists in THIS family's centre, so it cannot be the section's seat while three
lanes ship three different centres. **Recommend the swatch; flag the one risk**: `color` and
`background-color` may serialise differently from the same custom property (pass 2 read
`peerSwatchBg oklch(0.5 0.11 137.5)` against `.join-trace`'s `stroke` — measure the two strings
side by side before landing).

**The simplest close of gaps 1 and 2 is subtraction**: PLR-COUNT deleted
`.player-row { color: var(--color-user-ink) }` as tidy-up, not as design — the roster is
`sr-only`, so that rule paints nothing either way. Restoring the one line closes `:97` and `:165`
with zero design cost and leaves the re-point to PLR-SELF's own schedule.

### 7.5 `join-language-prm`'s four vacuous rows (gap 2)

`join-language-prm.spec.ts:83-100` reads `.player-name`'s `animationName`/`clipPath` and the
row's `is-arriving`/`is-returning`. Every class, keyframe and rule it names dies with
`useJoinWash`'s roster half (`useJoinWash.ts`: `arriving`, `departing`, `rowArmMs` ×2,
`rowHoldMs`, `armRow`, the `later`/`timers` pool). What SURVIVES that a PRM spec can still fail
on: the board ring (`.join-pose` / `.join-trace`, `progress` 0 under PRM — the file's own rows at
`:70-89` and `:145-155` already assert it), and this family's new stillness — the register's rows
carry no beat, and the tally's draw-in snaps to inked. Re-cut against those two, and take
**PLR-PLACE's PRM-specificity trap** while re-cutting: `.player-lobby.is-open` re-declares
`transition` at `PlayerLobby.vue:172-179` and a bare `@media (prefers-reduced-motion)` arm adds no
specificity, so a reduce arm written against `.player-lobby` alone loses to `.is-open`.

### 7.6 The register and a focus-driven AT (gap 7)

Zero focusables inside the sheet and `@focusout` on the mark closes it, so the names are a
virtual-cursor surface only. Two honest closes, and the spec must pick one and say so:

- **(i) State it, with the channel that survives.** The count is in the mark's accessible name at
  every N (`aria-label = stateLine`, 2.5.3 by construction). The NAMES have a live channel that
  this diff keeps: `.players-roster` is `role="log"` and `sr-only`
  (`GameControlPanel.vue:1134`). The honest limit: `role="log"` announces ADDITIONS, so a reader
  who joins late never hears who is already there.
- **(ii) Cure it with PLR-SELF's escape-refocus graft's sibling** — `@focusout` gated on
  `relatedTarget` staying inside the wrapper, `tabindex="-1"` on the sheet, focus moved in on a
  KEYBOARD open only, Escape returning focus to the mark. Six lines, no new mechanics, and it
  reopens the T7-W2 A4 debt: CHAIR §6.7 says §11's leader (PLR-SELF) writes the disposition row
  for A4 and PLR-COUNT/PLACE inherit it. **Do not land a tab stop ahead of that row.**

### 7.7 SOLO (gap 5) — M14's own words already lean

`people = players.length ? players : SOLO` (`PlayerTally.vue:48-52`) makes the mark structurally
permanent on every `view === 'playing'` board, reading `1 player`, its one register row `| you`
with no slug. M14 says the icon is "coloured **when** a session is live", which presupposes an
icon that is present and NOT coloured otherwise — and the uncoloured state this family ships is
the estate's own graphite (`.pt-marks.is-solo .pt-stroke`, `PlayerTally.vue:286-289`). Carry
both dispositions with that reading stated:

- **A · KEEP (the artifacts lean here).** Cost: a permanent 44×44 head control, `.corner-left`
  75.53 → 119.53 on every solo board, one new tab stop, a nameless register row.
- **B · GATE ON A ROOM** (`v-if="session.inRoom"`). Cost: a head that grows and shrinks with the
  wire mid-session, and an icon that is never seen uncoloured.

U-10 disposes. Frame A (the solo head at 390 coarse) is one of the four crops.

### 7.8 The deck's count (gap 15) — it is already owned, and the row is a citation

The prototype says "nothing anywhere says how many people are at the table you are leaving". Not
so: `GameGallery.vue:217-222` computes `peers = players.length − 1` and renders
`"1 other player"` / `` `${peers} other players` `` on the drag guard, and **R6 law 32 cites that
exact line** as the house's "counts, not feelings" precedent. So the deck's count is owned by the
deck's own sentence, in the one place the sentence is about the OTHERS who follow you — which is
this family's own §1 reasoning, satisfied. What the deck has no mark, and G12 asserts that on
purpose (`App.vue:805-841`, `?view=gallery` → 0 marks, 0 lobbies, π byte-identical). **Close gap
15 with the cite and the ruling, not with a design.**

### 7.9 `--tap-floor` (gap 10) and the note gap 8 got wrong

`PlayerTally.vue:240` and `:251` write `var(--tap-floor)` with no fallback. The token's own law
(`index.css:821-828`) says "the fallback IS the shipped literal, so a consumer mounted outside
`.page-root` still lands on 44px rather than on `initial`", and all five estate consumers obey it
(`index.css:834`, `:849`, `GameControlPanel.vue:1947-1948`, `DrawerTab.vue:181-182`). **Add
`, 2.75rem` at both sites.**

**The collision to state, not to silently resolve:** CHAIR §6.5 strikes `var(--x)` fallbacks and
requires `@property` + `initial-value`. That ruling is scoped to *measured tokens the estate
publishes* (`--masthead-foot`, `--pin-band`, `--card-pad-t`, `--washi-tag-rung`, the motion
rungs) — tokens written from TS before first paint. `--tap-floor` is a static CSS declaration on
`.page-root` (`App.vue:961`) with a written fallback law and five obeying consumers, so §6.5 does
not reach it. Say so in the spec with both cites; a reader will otherwise read §6.5 as striking
the `, 2.75rem` this gap asks for.

Gap 8's own note is wrong in the other direction: the token is not under a media query. It is on
`.page-root`. The probe read `documentElement` (`<html>`), which is not that element. The correct
read is `getComputedStyle(document.querySelector('.page-root')).getPropertyValue('--tap-floor')`
→ `2.75rem`. Correct the note; the 44×44 + 40px negative control stays as the surface proof.

### 7.10 The instrument resolver (gap 12) — **`NODE_PATH` DOES NOT WORK**

The charter says "bank NODE_PATH". Measured today on node v26.0.0: node's **ESM** resolver
ignores `NODE_PATH` (it is a CommonJS mechanism), so
`NODE_PATH=<frontend>/node_modules node <instrument>.mjs` still dies
`ERR_MODULE_NOT_FOUND: Cannot find package 'sharp'`. The working one-liner, banked and proven in
`instruments/ink-weight.mjs` (which runs from `/tmp`):

```js
import { createRequire } from "node:module";
const sharp = createRequire("<abs>/web/frontend/package.json")("sharp");
```

For the Playwright half (`Cannot find module '@playwright/test'` from the probe's own config), the
equivalent is to run `npx playwright test --config <abs probe cfg>` **with cwd = web/frontend**,
which is what the run that produced pass 2's numbers actually did; the README's recipe omits the
cwd. Bank the cwd, not an env var.

### 7.11 The Tab route (gap 14) — re-word it; the WebKit half is the platform

DOM order inside `.head-left-row` is `.attribution-disclosure` (trigger, then the card's two
links and the DEV toggle) **then** the `#mark` slot, and tab order is DOM order. Moving the mark
before the disclosure would put it visually left of `@mbabb` (the pose is the mark at x 75.5,
right of the trigger's 0–75.5); divorcing paint from DOM with `order` is a 2.4.3 smell the estate
would refuse. And the WebKit half is not a defect at all: **Tab does not move focus between links
and buttons in WebKit unless macOS full keyboard access is on, and Playwright cannot set it**
(background sources below). **Re-word PLR-SELF §3.1's claimed route to the measured one** —
chromium `@mbabb → card link → card link → [DEV toggle] → mark → sun`, three presses in a
production build; webkit asserts off `el.focus()` with the preference named — and leave the mark
where it is. The alternative (move the mark in DOM) is PLR-SELF's to rule, not this family's.

---

## 8 · Sketches

**A · the head at 390 coarse, the four states, with the ink measured (§5.3)**

```
  free band after @mbabb = 250.5px                        sun 64x64 @ x=326
  ┌──────────────────────────────────────────────────────────────────────┐
  │ @mbabb   │                                                      ☀    │
  │ 0   75.5 │ 119.5                                          326   390  │
  ├──────────┼───────────────────────────────────────────────────────────┤
  │  N=1     │ |                 w 44 (floor)   ink 309 px²   graphite    │
  │  N=3     │ | | |             w 51.66        ink 839       self+walk   │
  │  N=5     │ | | | | |         w 72.92        ink 1417      self+walk   │
  │  N=6     │ 6                 w 44           ink 207  ← 85% LESS than  │
  │          │                                    N=5, and 33% less than  │
  │          │                                    N=1. the non-monotone.  │
  └──────────┴───────────────────────────────────────────────────────────┘
      mark box 36 tall at every N; .pt-count is 20.35 tall inside it
```

**B · the register's height, derived from its own box (§5.1) — and the foot's three futures**

```
  ┌──────────────── min-width 16rem = 256 ────────────────┐  ┐
  │ 1rem pad + 2px border ............................ 36 │  │ chrome 36
  │ 3 players ............... --type-tag x 1.35 = 18.965  │  │ state
  │ .pl-rows margin-top 0.35rem ................... 5.600 │  │
  │ | crucial-chameleon  you ...... row 22 (mark floor)   │  │ 22 + gap 1.6
  │ | shiny-duck ................................. 22     │  │   per row
  │ | colorful-wasp  26 seconds ago .............. 22     │  │
  │ and 12 more ......... margin 1.6 + 18.965 = 20.565    │  │ foot
  └───────────────────────────────────────────────────────┘  ┘
    H(r,m) = 58.965 + 23.6r + 20.565m   (desk 1280; 58.9/23.6/20.5 at 390 coarse)
    PLR-SELF's 57.36 + 21.6r + 18.96m is ITS row box: off by 11.16 at (4,1) HERE.

    short phone, N=3:   (a) 1 row + foot = 103.0     names 1 of 3
                        (b) 2 rows, no foot = 106.1  names 2 of 3   (+3.1px of lap)
                        (c) no foot anywhere: tall (5,0) = 176.9, clearance 4.0 -> 0.9
```

**C · the copy census, before and after the fold (§2)**

```
  pass 2 (base a8fee1f5)                    pass 3 (base 74a2b5d9)

  LOBBY_COPY                                LOBBY_COPY
     │                                         │
     ├─> COPY_SOURCES arm      [ENUMERATED]    └─> COPY_TABLE_NAME   [DISCOVERED]
     │     if (!block) continue   FAILS OPEN         /.*(COPY|Copy).*=\s*\{/
     │                                               objectBody + copyLiterals
     └─> lobbyStrings derive                         cannot fail open: there is
           if (!block) return []                     no declared subject to miss
             ^ caught at check-font-coverage   └─> lobbyStrings derive  (KEEP)
               :495 "found NOTHING" -> exit 1         same empty-derivation guard
                                                      the fold's own paperNoteCopy uses

  => gap 9's copy half closes by DELETING the arm; its font half was never open.
```

---

## 9 · Risks

1. **The registry's own graft is wrong for this box.** Taking `57.36 + 21.6r + 18.96m` on the
   chair's list would ship a law that mis-predicts by 11.16 px and a G8 that passes on the wrong
   arithmetic. Take the method; keep the constants; report the graft MOVED with the residuals.
2. **The replay's two script files fight the fold.** `check-copy-register.mjs` (+937) and
   `check-font-coverage.mjs` (+34) both moved. Resolve toward the fold; the copy arm should not
   be re-applied at all (§2), and `zoneRowLabels`' declared strings are now `["marks","what fits"]`.
3. **`lint:knip` and `test:e2e:projects` are CI reds today** (§3) and are not in this family's
   battery. `check-pw-projects` also moves two count floors when the new spec lands.
4. **`watch(drawn, …)` watches a COUNT, not the id set** (`PlayerTally.vue:88-95`). One person
   leaving and one arriving in the same tick leaves `drawn` unchanged, so the watch never fires:
   the newcomer inherits the departed person's `reveal = 1` and appears with no draw-in, and the
   `draws` map is keyed by INDEX while the pose is keyed by PERSON. Watch `ids` and diff the sets.
5. **The swatch re-point's serialisation.** `getComputedStyle(x).color` vs `.backgroundColor` off
   the same custom property may not serialise identically; `join-language.spec.ts:101` is a
   string `toBe`. Measure both strings before the re-point lands, or compare parsed colours.
6. **§6.5 vs `index.css:821`.** Both are live rulings about `var()` fallbacks and they point
   opposite ways on `--tap-floor`. State the scoping (§7.9) or a reviewer will read the cure as a
   violation.
7. **Option (c) in §5.2 narrows the tall phone's clearance to 0.9 px** — inside measurement noise
   on a different phone. Measure before recommending; (b) is the safe pick.
8. **The frozen clock races the 15 s heartbeat** (§7.1). Steps must land inside one beat, or
   `lastHeard` is re-stamped at the frozen value and the qualifier never renders.
9. **The family law (12.7° webkit / 13.3° chromium minimum painted pairwise separation from N=3)
   is unmovable here.** It goes to PAL-WALK with `instruments/pixels.mjs` and the walk index;
   100 % is unreachable inside this family and the return must say so rather than round up.
10. **The deck's own live-region count.** Pass 2 measured the deck adding ONE region
    (`gallery-live`), not the spec's two. Whatever §3.5 says, G6's deck arm must assert what is
    mounted, and `check-live-regions` is the gate that will disagree first.

---

## 10 · Background (prior art — never the verdict)

- WebKit's Tab behaviour is a macOS "Press Tab to highlight each item on a webpage" preference
  that Playwright cannot set, which is why webkit Tab routes read empty while chromium's do not:
  [playwright#2114](https://github.com/microsoft/playwright/issues/2114),
  [playwright#5609](https://github.com/microsoft/playwright/issues/5609),
  [playwright#20629](https://github.com/microsoft/playwright/issues/20629).
- Playwright's documented stance is that every page in a context behaves as focused and active
  and `bringToFront()` is for genuinely visibility-dependent behaviour — so it is the wrong
  instrument for G4's peer half: [Pages | Playwright](https://playwright.dev/docs/pages),
  [playwright#36082](https://github.com/microsoft/playwright/issues/36082).
- `page.clock.setFixedTime()` (Playwright ≥1.45; this estate runs 1.61.1) freezes `Date.now()`
  while leaving timers running: [Keyboard/Clock API surface in
  `playwright-core/types/types.d.ts:18559-18566`] — verified on disk rather than from the docs.

The verdict in every row above comes from this codebase.
