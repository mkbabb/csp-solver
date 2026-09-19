# PAL-WALK — PASS-2 RESEARCH (§11c the per-player colour system)

Read-only lane. **No product file touched, no dev server started, no port held** — every figure
below is either a `file:line` fact from the working tree at `a8fee1f5` or arithmetic over pass
1's own banked engine bytes. Zero crops banked (the wave is at 207 PNGs against a 2 MB cap;
nothing here needed a picture). Two scripts, two readings:

    calc/measure.mjs   → readings/measure.txt    the reserved set, the arc geometry, ΔE, the chroma
    calc/coupling.mjs  → readings/coupling.txt   PLR-COUNT's demand answered; the accent families' cost
    instruments/PROPOSALS.md                      the three MOVED rows, with exact anchors

The worktree `.claude/worktrees/wf_e58b4764-0fc-49` still carries pass 1's diff (7 files, 1
untracked script) on base `aab67b92`; `git diff --stat aab67b92 a8fee1f5 -- web/ .github/` is
**empty**, so the pass-1 diff is still against product-current source. Nothing to rebase.

---

## 1 · The capacity question, answered in ΔE — the number that decides the family

The charter says this question decides the family and must be answered in ΔE. It is answered.

**Peer-vs-peer, OKLab ΔE over the PAINTED bytes** (`readings/measure.txt` §4; identical in
chromium and webkit to four places):

| room N | 2 | 3 | 4 | 5–7 | 8 | 12 | 16 |
|---|---|---|---|---|---|---|---|
| light | 0.1992 | 0.0877 | 0.0413 | 0.0320 | 0.0237 | 0.0127 | 0.0110 |
| dark | 0.1988 | 0.0865 | 0.0415 | 0.0312 | 0.0241 | 0.0113 | 0.0099 |

**Capacity at a floor**, both themes, both engines:

| ΔE floor | 0.0764 (the house's own two nearest crayons) | 0.05 | 0.04 | 0.03 | 0.02 |
|---|---|---|---|---|---|
| hands the walk holds | **3** | 3 | 4 | 7 | 8 |

The house's own reference is `--color-crayon-orange` vs `--color-crayon-gold`, **ΔE 0.0764** —
re-derived here, not taken from pass 1. Prior art (background only, the verdict is the
codebase's): the commonly cited **ΔE(OK) JND is ≈0.02**, and categorical-palette practice asks
for roughly an order of magnitude above a JND. So the walk's "eight hands" sit at **1.2 JND**.
The honest sentence, and the one the synthesizer should write into the module's header:

> Three hands read as three people. Eight hands are distinguishable side by side and not
> identifiable apart. Sixteen is one colour said sixteen times.

**Peer-vs-token, ΔE over painted bytes** (`measure.txt` §3) — the promise "never mistakable for
a crayon, a verdict, the machine or you", priced in the family's own currency:

| theme | nearest hand of the first 8 | ΔE | hands (of 144) closer to a token than 0.0764 |
|---|---|---|---|
| light | i=1 → `--color-solver-ink-4` #047857 | **0.0315** | **75/144** |
| dark | i=2 → `--color-solver-ink-3` #93c5fd | **0.0333** | **100/144** |

The single worst over all 144: **ΔE 0.0272** (light, i=124 vs solver-ink-4); **0.0271** (dark,
i=44 vs solver-ink-2). So in ΔE a MAJORITY of the walk sits closer to a reserved ink than the
house's own two nearest crayons sit to each other. **The 12°/13° law is a statement about the
wheel; it does not deliver the sentence it is sold as delivering.** The synthesizer picks one:

- **(A) restate in degrees** — "no hand is ever within 13° of a reserved hue", and say plainly
  what that does not buy. Costs nothing; the module header carries the disclaimer already.
- **(B) re-cut the guard in ΔE** against the inks a mark shares a surface with. Priced below;
  it is expensive and it does not save the peer-vs-peer number.

The two questions are separable and should be ruled separately: peer-vs-token is a LAW (a hard
floor against a fixed set) and peer-vs-peer is a CAPACITY (a soft curve). Pass 1 fused them.

---

## 2 · The reserved set is not a constant, and the gate is blind to that

This is the finding this lane exists to hand over, and it is independent of the critique's
mutation proof.

`check-peer-arcs.mjs:47-48` names the reserved tokens by a hardcoded **regex over names**:

```
--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink)
```

Measured (`readings/coupling.txt` §B): at HEAD that regex is **exact** — 29 declarations, zero
chromatic tokens missed, 6 arcs, span 137.25°, step 52.42°. But **both accent families rename
the tokens it reads**, and they are in the same wave:

| tree | tokens the gate SEES | arcs | span | room@12° | tokens INVISIBLE to the gate | how close the green-lit walk gets to one |
|---|---|---|---|---|---|---|
| HEAD | 29 | 6 | 137.25° | 8 | — | — |
| + ACC-FIVE pass-1 diff | 27 | 6 | 138.51° | 8 | `--color-blue-ink` #026fc4, #47a7ff | 14.16° @ i=2 (clears) |
| + ACC-SIX pass-1 diff | 22 | 5 | 165.11° | 8 | `--color-blue-ink` #2f76bd, `--color-answer-pale` #c4b5fd, `--color-answer-mid` #8b5cf6, `--color-answer-deep` #7c3aed | **0.47° @ i=2** |

Under ACC-SIX's rename the **third hand dealt in every room is 0.47° from the night's verdict
rung**, and `check-peer-arcs.mjs` prints `✓ 2 THE LAW HOLDS` and exits 0, because it is looking
for a token name that no longer exists. That is the same disease as the walk re-derivation —
**a gate that enumerates instead of measuring** — and curing only the walk half leaves it live.

Sensitivity, for the plan (`coupling.txt` §C): one extra reserved hue placed where it hurts most
(192°) takes span 137.25° → **111.25°** and room 8 → **6**. The walk's capacity is a function of
a set another family owns.

**What the synthesizer must specify:** the reserved set is "every declaration in `index.css`
whose OKLCH chroma clears a threshold", not a list of names. Chroma is the honest discriminant —
the papers and graphites are near-achromatic and a hue law has nothing to say about them. A
`--self-test` that ADDS a renamed chromatic token and requires a RED is the negative control.

---

## 3 · Two rulings that are already in the tree, and one that is not

### 3a · The tie-break for the two-author `inkAgreed` race — the house already owns it

`useSession.ts:98` — `const newer = (a, b) => a[0] > b[0] || (a[0] === b[0] && a[1] > b[1])` —
is a TOTAL order on `[lamport, author]`, tie-broken by peer id, and the file's own comment
(`:94-95`) says it is "the SAME order on every page… used for cells (which write wins) and for
epochs (which board wins)". `holdsTheBoard` (`:685-687`) is a second total order (the LOWEST id
answers a newcomer's `hi`).

So no new order need be minted. **The defect in pass 1's `inkAgreed` is not a missing tie-break;
it is that agreement is not scoped to the epoch that produced it.** Three source facts:

1. `sendState` marks agreed when `ledger.epoch[1] === selfId` (pass-1 diff) — correct.
2. `adoptInk` marks agreed on **any** `st`, regardless of sender (pass-1 diff line
   `inkAgreed.add(id)` inside the loop). PAL-TIN's critique found the same hole independently
   and names the fix: gate on `from === d.ea`. `onMessage` already carries `from`
   (`useSession.ts:736`), and the `st` arm already has `d.ea` in hand (`:749`). Free.
3. `inkAgreed` is cleared **only at teardown** (`useSession.ts:861-895`, where the pass-1 diff
   adds `inkAgreed.clear()` beside `inkIndex = {}`). A page that was epoch author and
   then LOSES the epoch to a strictly newer one keeps refusing the new author's assignment for
   the life of the room. That is the divergence the prototype's gap 3 names, and it is
   permanent, not transient.

The rule that closes all three, in the estate's own words: **an agreement is made under an
epoch, and it dies with that epoch.** Hold `agreedEpoch: Stamp` beside the set; in the `st` arm,
when `newer(e, agreedEpoch) && e[1] !== agreedEpoch[1]`, clear `inkAgreed` before `adoptInk`.
Ink then converges by the same rule the board does, and no second order enters the file.

**Harness — it is a unit, not a probe.** `useSession.test.ts:185` `bootPage()` returns
`hear(kind, data, from)` and `stFrame({e, ea, g, z, k})` (`:234`). Two pages, two epochs, one
assertion: `Object.values(inkIndex)` has no duplicate, and `new Set(players.map(p => p.ink["--color-user-ink"]))`
has size `players.length`. That is charter rows 7 and 8 closed in vitest with no browser.

### 3b · The one-person room is worse than measured, and the cause is one line

`joinSession` sets `roomId.value = room` (`useSession.ts:836`) and mints self on the next line
(`:837`). With the pass-1 `mint` change, self's ink is `inkFor(0)` from that instant, so the
roster row recolours at the invite press — the critique measured that.

What the critique did not trace: **`authorInk` reads `ledger.clock`** (`:402-412`), and the clock
is written only by `mintOp` (`:152-163`), which is reached only through `noteWrite` — and
`noteWrite`'s first line is `if (!wire) return` (`:897-899`). **Solo writes therefore leave no
clock entry.** So in the one-person room:

    a cell you wrote BEFORE the invite press  → no clock entry → keeps #2563eb
    a cell you write AFTER the invite press   → clock entry, author = self, roomId ≠ null
                                              → inkFor(0) = oklch(… 0.1145 27.16deg), a terracotta

Your own board is **two colours of your own hand**, split at the moment you pressed invite, with
nobody else in the room and no join trace to explain it. This is a stronger statement of gap 4
and it is derivable from source; a probe confirms it rather than discovers it (write a digit,
press invite, write a second digit, read both `.glyph-svg path` strokes — they differ).

The ruling the synthesizer owes: either **self takes the walk only when a SECOND id is known**
(`Object.keys(known).length > 1`, which is the room actually existing) — and then the whole
board re-inks at the arrival, one event, explainable by the join trace that already fires — or
**self never takes the walk** (the F1 ruling's other side). `inkFor(0)`'s terracotta arriving
mid-solo-board with no company is the one reading that cannot be defended.

Note for the ballot: registry-v1 §201 records **F1 unresolved** — ACC-GRAPHITE + PLR-SELF say
self takes a room colour; ACC-FIVE/SIX + PLR-COUNT/PLR-PLACE + both PAL-* keep the board blue.
PAL-WALK's pass-1 diff puts it on the *opposite* side from where the registry books it. The
return must say so.

### 3c · PAL-WALK CURES PLR-COUNT's §6 collision, and the plan does not know it

PLR-COUNT's critique §6: at HEAD, self is `#2563eb` (h 262.88°) and walk index 2 is h 275°, so
painted min separation collapses to **12.7° webkit / 13.3° chromium from N=3 onward** — "the
count converges and the attribution does not, three people in", and PLR-COUNT's stated demand on
the PAL-* families is **≥30° over the first six**.

Measured on PAL-WALK's painted bytes (`coupling.txt` §A):

| N | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|
| min hue, light | 154.12° | 52.71° | 19.35° | 19.35° | 19.35° | 19.35° | 11.69° |
| min hue, dark | 154.25° | 52.13° | 19.48° | 19.48° | 19.48° | 19.48° | 11.98° |

So PAL-WALK takes N=3 from 12.7° to **52.7°** — a 4× improvement on exactly the row PLR-COUNT
could not close inside itself — and **misses the ≥30° demand from N=4 (19.35°)**. Two-thirds of
a cure, and the honest hand-back is the number, not the claim. (The mechanism: 262.88° ± 13 is
inside reserved arc [236.33°, 275.88°], so no walk hand can ever land where HEAD's index 2 did.)

---

## 4 · The chroma fallback: measured, and it is NOT three CSS rules

Pass 1 priced the two-var fallback and did not build it. **The measurement already exists in the
banked bytes** (`readings/bytes-*.json` carry a `paintedFb` array and a `<ground>|fallback` row):

| | mean painted C | min painted C | worst AA on `--color-background` | worst on `--color-card` |
|---|---|---|---|---|
| one string (shipped in the diff) | 0.1138 | 0.0845 | 5.453 light / 9.511 dark | 5.585 / 9.309 |
| two-var fallback | **0.1243 light · 0.1416 dark** | 0.0848 / 0.0845 | **5.453 / 9.511** | **5.585 / 9.309** |

**The fallback costs nothing on contrast** — worst and worst-index are identical, because the
worst hand is gamut-limited at both bands either way. It buys +0.0105 light and +0.0278 dark of
mean chroma. Against the incumbent's flat 0.110 the one-string form is +0.004 ("richer" does not
survive); the fallback is +0.014 light / +0.032 dark, which does.

**Gap in the banked reading:** the `fallback` rows carry only `{worst, worstIndex}` — no
`under45` count, no `bottom4`. The prototype lane must re-read the fallback arm with the full
counts before anything is claimed from it.

### Why "three CSS rules" is wrong — measured mechanism

A custom property's `var()` is substituted **at the element where the property is declared**, not
where it is used. So the obvious form fails:

```css
:root      { --peer-ink-c: var(--peer-ink-c-light); }  /* resolves on :root — the cell's */
.dark      { --peer-ink-c: var(--peer-ink-c-dark);  }  /* per-player value is not visible here */
```

The theme pick must be declared **on each bound element**, under an ancestor theme selector.
`useTheme` puts the class on `<html>` (`useTheme.ts:9-12`: `selector: "html"`, `attribute: "class"`,
`valueDark: "dark"`), so `html.dark <selector> { … }` is available. The bound sites, enumerated:

| site | file:line | how the ink arrives |
|---|---|---|
| every board cell | `BoardHost.vue` cell mount ← `authorInk` (`useSession.ts:402`) | `:style` record |
| the peer cursor ring | `BoardHost.vue:66-79` | **extracts the single string** `ink["--color-user-ink"]` and rebinds it as `--color-peer-cursor-ink` |
| the roster row + its name | `GameControlPanel.vue:1146`, `:1164`, colour at `:1666` | `:style="p.ink"` / `"r.ink"` |
| the roster swatch | `GameControlPanel.vue:1682-1687` | inherits; `background: var(--color-user-ink)` |
| the washi tape | `GameBoard.vue:1062` (`color:` at `:1213`) | `{...tapeAnchor.style, ...hoveredAuthor.ink}` |
| the deck posters | `PosterBoard.vue:204` `:style="inkAt(pos-1)"` | passed-through `authorInk` prop |

`BoardHost.vue:73` is the hard one: `inkOf.get(id)?.["--color-user-ink"]` takes ONE key out of
the record. A three-key ink breaks that extraction, and the cursor ring silently falls back to
`var(--color-user-ink)` (`gameCell.css:230-232`) — i.e. the ring would wear the *author's* hue
instead of the *pointer's*, which is precisely the bug the tier-4 comment (`gameCell.css:222-224`)
says two vars exist to prevent.

**`light-dark()` is not available.** `package.json:12-18` declares `safari >= 16.4` and
`chrome >= 111`; `light-dark()` needs Safari 17.5 / Chrome 123. The estate sets **no
`color-scheme` anywhere** (grep: zero hits in `index.css`, `main.ts`, `index.html`), so adding it
to reach `light-dark()` would also change UA form-control and scrollbar rendering — a π risk on a
wave whose goldens must stay 4/4.

**The third option, and the one worth costing:** make `inkFor(index, dark: boolean)` and let
`authorInk` read `useTheme().isDark`. One var stays, `BoardHost.vue:73` keeps working, every
site above is untouched, and the price is a recompute of ≤81 entries on theme flip. It breaks
"the ink string is theme-independent", which is what made pass 1's dark reading cheap — and it
puts a reactive theme dependency into a computed that runs per cell per op. Measure it before
choosing it.

---

## 5 · The gate, re-shaped: three tiers, because node cannot import the module

The charter asks that `check-peer-arcs.mjs` import `playerIdentity`'s emitted hues. **Measured:
node cannot.** On node v26.0.0 (host), type-stripping loads `.ts`, but the module's own import
graph does not resolve:

    $ node -e "import('./src/games/shared/playerIdentity.ts')"
    FAIL ERR_MODULE_NOT_FOUND  Cannot find module '…/games/shared/useUndoHistory'

(`playerIdentity.ts:18` imports `./useUndoHistory` extensionless for `hashBlob`; ESM needs the
extension, and `--experimental-specifier-resolution=node` is gone.) Options: a ~15-LOC resolve
hook, an esbuild pre-bundle (`node_modules/.bin/esbuild` is present), or the cheapest —

**the tiering, which also answers §2:**

| tier | home | what it proves | negative control |
|---|---|---|---|
| 1 | `scripts/check-peer-arcs.mjs`, `lint:arcs` (node, CI lane) | every chromatic declaration in `index.css` (chroma > threshold, NOT a name list) lies inside a declared arc | move a hex; **rename** a token |
| 2 | `useSession.test.ts` (vitest — already imports `inkFor` at `:127`) | the MODULE's emitted hues clear every arc; no two known ids share an ink string; the two-author race converges | `STEP = 0.5` must red |
| 3 | `e2e/` beside the arcs gate (local instrument, O-12: CI is browserless) | the PAINTED bytes clear every arc, AA over 4 grounds, the ring at its drawn opacity | the 0.55 ring (2.294 light, 144/144 under 3) |

Tier 2 is where the charter's "import the module's emitted hues" actually lands, and it costs
nothing: vite resolves the TS, and the harness is already in the file.

---

## 6 · Corrections to the critique (both in the family's favour)

**(a) The ring distinction is NOT width alone.** `gameCell.css:230-236` — peer cursor: ink
`--color-peer-cursor-ink`, width 4, opacity 0.55→0.80, fill 0.04. `gameCell.css:246-250` — own
focus: ink `--color-focus-sketch` (#3a7bc4, **h 253.28°**), width 7, opacity 0.9. 253.28° sits
inside reserved arc [236.33°, 275.88°], so **the family's own law guarantees ≥13° of hue between
any peer ring and your focus ring**, on top of 3 px and 0.10 opacity. The critique's "the
distinction is now width alone" is wrong.

**(b) The two rings never co-paint.** `gameCell.css:218-220`: tier 2's `(0,3,1)` out-ranks tier
4 "from anywhere… Every paint property this rule sets is re-asserted by both". A peer pointing
at your focused cell yields to your focus. The side-by-side crop the critique asks for is a
comparison of two states that cannot coexist on one box; a hue+width table is the honest frame,
and one crop per theme of the ring alone is enough.

**(c) `IDENTITY_CAP = 8` is an ACCIDENT, and a harmless one.** Born at `bfab089b` (T8-W3(A),
the same commit that introduced `k` adoption). `playerIdentity.ts:96-98` calls it "the prune
bound: rooms and live claims both… a browser holds a handful of tables", and it is spent at
`:139` (`rooms.slice(0, 8)`) and `:142` (`live.slice(-8)`). It counts **tables on a device and
live tab claims**, never players at a table. Two unrelated eights.

One latent hazard found while checking it, for the risk list and not for this family's diff:
`live.slice(-IDENTITY_CAP)` (`:142`) drops the OLDEST live claim past 8, and `claimIdentity`'s
`free()` (`:187`) treats an unclaimed id as reclaimable — so a 9th live tab on one device can
un-claim tab 1's id and a later tab can then answer to it. That is the "room of one, twice"
hazard the comment at `:85-90` exists to prevent, reachable at >8 live tabs.

---

## 7 · Primitives to reuse (name them, do not re-mint)

| primitive | where | use |
|---|---|---|
| `newer` / `wins` total order | `useSession.ts:98`, `:106` | the ink agreement's epoch scoping — no new order |
| `holdsTheBoard` lowest-id order | `useSession.ts:685-687` | if a non-epoch tie-break is ever needed |
| `bootPage()` + `hear()` +  `stFrame()` | `useSession.test.ts:185`, `:224`, `:235` | the two-author race, the no-duplicate-ink invariant, in vitest |
| `chromaAt` per-hue sRGB ceiling (~30 LOC, memoised) | pass-1 diff, `playerIdentity.ts` | cross-family: PAL-TIN, ACC-FIVE's ink-tier |
| ACC-FIVE's ink-tier algorithm | `pass1/critique/ACC-FIVE.md:189-191` | hold the hue, take max chroma, walk lightness to the floor; solve the BAND when the ground swaps |
| ink as a presentation attribute | `HandwrittenGlyph.vue:310` `:stroke="strokeColor"` (`:82-86`) | **already satisfied** on the glyph; PAL-TIN's finding bites on `GameControlPanel.vue:1666` `color:` and `:1687` `background:`, which are scoped SFC declarations |
| the legend-without-copy idiom | `pass1/critique/PAL-TIN.md:185`, `:202` | the roster row IS the legend; M16-cheapest |
| `check-ink-pressure.mjs` `--self-test` house pattern | `package.json` `lint:ink` | the shape every new gate copies |
| the print/forced-colours ground | `index.css:931-936` (`--color-user-ink: #000`), mechanism at `:939-947` | already proven to survive a room in pass 1 |

---

## 8 · Sketches

**(a) The wheel as the arcs actually stand at guard 13 (HEAD's 29 tokens → 6 reserved / 5 open,
span 137.25°, step 52.42°). Walk order marked at the painted hue.**

```
   0°        27.2°                108.7°      134.0°   178.6°           236.3°  275.9°  279.7°  306.6°  333.0°  360°
   |███ROSE███|·······OPEN·······|██ORANGE/GOLD██|··OPEN··|███GREEN/TEAL███|····OPEN····|█BLUE█|·O·|█VIOLET█|··OPEN··|██ROSE██|
                ^i0 27.4  ^i3 46.8                 ^i1 181.5                              ^i2 234.3        ^i5 320.3
                                                   ^i4 202.3                                              (i6 124.8 in the gold gap)
   reserved 222.75°  ·  open 137.25°  ·  the walk lives only in the five ·······
```

**(b) The one-person room, as the source has it today.**

```
  solo board                press INVITE                 still alone
  ┌───┬───┬───┐             roomId = "abc"               ┌───┬───┬───┐
  │ 7 │   │   │  #2563eb    known = {self}               │ 7 │ 4 │   │   7 = #2563eb  (no clock entry)
  ├───┼───┼───┤             roster row → oklch(…27.16°)  ├───┼───┼───┤   4 = 27.16°   (clock entry, self)
  │   │   │   │             board unchanged (no clock)   │   │   │   │
  └───┴───┴───┘                                          └───┴───┴───┘
        ↑ noteWrite returns early: `if (!wire) return`         ↑ two colours, one hand, no company
```

**(c) The gate as it is, and as it must be.**

```
  TODAY                                         PROPOSED
  index.css ──regex(NAME LIST)──▶ arcs          index.css ──every decl, chroma>τ──▶ arcs
                                   │                                                 │
  playerIdentity.ts ──declared────▶├─▶ walk()   playerIdentity.ts ───────────────────┤  tier 1: arcs agree
        (STEP, hueAt, chromaAt)    │   OWN            │                              │
              ✗ never asked ───────┘   walk           └── inkFor() ──▶ vitest ───────┤  tier 2: the MODULE's hues
                                        │                                            │
                                     ✓ green                 painted bytes ──e2e ────┘  tier 3: the PIXELS
```

---

## 9 · Risks, ranked

1. **The reserved set moves under this family within the same wave.** ACC-SIX's rename puts hand
   i=2 at 0.47° from a live token with the gate green (§2). Any PAL-WALK diff that lands before
   the accent ruling is a walk over arcs that are about to change. Mitigation: tier-1 by chroma,
   not by name, and a `--self-test` that RENAMES a token and demands a RED.
2. **The capacity ruling is the owner's, and the family's own numbers argue against it** at 8+.
   If "16+ within reason" binds on distinguishability, this family yields the palette and what
   survives is `chromaAt`, the ring at 0.80, the `inkAgreed` epoch rule, and the painted-byte
   method. Do not spend pass 2 defending 8.
3. **Self's ink is on the wrong side of F1 as the registry books it** (§3b). An owner re-look
   that reads "you keep the blue" makes the `authorInk`/`mint` half of the diff dead on arrival
   while the walk itself survives. Keep the two halves separable in the diff.
4. **`BoardHost.vue:73` single-key extraction** silently degrades if the ink record grows (§4) —
   and it degrades to *wrong colour*, not to *no colour*, which no existing gate would catch.
5. **`e2e/multiplayer.spec.ts:190` and `:218` comments become false** ("you are the incumbent
   blue"; "the cell B wrote itself… reads the incumbent blue"). The ASSERTIONS survive
   (`expect(inks.theirs).not.toBe(inks.mine)`; `new Set(swatches).size === 2`), so this is a
   MOVED comment row, not a red — but a comment that lies is the disease T8 named.
6. **The fallback's banked reading is incomplete** — `worst` only, no `under45` (§4). Any
   "AA-neutral" claim from it is unearned until re-read.
7. **Reading dark through the product's verb has a one-frame trap**, not a 700ms one:
   `useTheme.ts` sets `disableTransition: true`, which stamps `* { transition: none !important }`
   for a single frame around the class write (`useTheme.ts:14-34`). Settle on a rAF after the
   toggle, not a fixed wait; the dock's ~700ms rule is a different surface.
8. **The relay arm remains untested** (every reading is `?wire=local`). `asksLocalWire` is
   DEV-only and folded out of a build (`useSession.ts:302-307`), so a relay run is the only read
   of the shipped path. One run, and it is a real-network row, not a gate.
