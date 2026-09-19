# PASS-2 CRITIQUE · MRK-ABS · One visible hand

Adversarial. I did not write the spec or the prototype. Everything below that carries a number
was either re-measured on my own server (127.0.0.1:4241, private `cacheDir`, both engines,
killed and the port verified clear) or recomputed from the prototype's own model with one
parameter changed. My instruments and readings are under `critique/MRK-ABS/probe/` and
`critique/MRK-ABS/logs/` (72 KB, no crops — every finding below is a number or a source line).

**Convergence: 78%. Verdict: ADVANCE.**

---

## 1 · What I verified myself, and what held

| claim | my reading | verdict |
|---|---|---|
| token 4.29 card / 4.19 page light; 7.70 / 7.86 dark | recomputed WCAG from the shipped hexes over the shipped grounds: **4.278 / 4.195** light, **7.714 / 7.867** dark | HOLDS |
| board ring 3.92 light / 7.02 dark at stroke-opacity 0.95 | composited 0.95 over `--color-card` per theme: **3.933 / 7.056**. (Also confirms the SPEC's "~3.68 / ~6.52 at 0.95" is arithmetic that never happened — 3.62/6.44 are the 0.90 values, and 0.95 raises them, not lowers) | HOLDS; spec number REFUTED, prototype's correction right |
| the unit→px conversion every clearance number rests on (`boardPx / 1300`) | measured the ghost svg live, **both engines**: `.cell-ghost svg` is `inset-0` on the 39.75 px cell with `viewBox` 81.25 units (cell × 1.3), so px/unit = 39.75 / 81.25 = **0.48923 = 636/1300, exactly, chromium and webkit**. The grid's own svg is `0 0 1000 1000` at 636 px. The 1.3 squeeze is real and the model's `px()` is right | HOLDS — this is the load-bearing constant and it survives |
| `.live-face-slot` radius unchanged on focus | 0px blurred → 0px focused, **chromium and webkit, light and dark** | HOLDS |
| deck: reach 5, air 9.59, headroom 4.59, one owner, viewport `outline-style: none`, card radius 0 | reach 5, left air **9.59375**, owners **1**, `outline-style: none` on the viewport, card `2px solid` token at offset 3, radius **0px** — both engines, both themes | HOLDS |
| the fade is cured at its two shipped carriers | tab-walked with **no settle at all**: `.attribution-trigger` and `.ctrl-btn` read the token on the first frame. The two DEV-only stops read `currentColor` (115,115,115 light / 168,166,159 dark) at t=0 — the fade, still live, exactly where the prototype said it is | HOLDS |
| M16 / lint estate | `lint:copy` 0 dashes / 0 unadmitted jargon, `lint:theme-tokens`, `lint:theme-selectors`, `lint:ink`, `lint:motion` — all exit 0 on my own run | HOLDS |
| `ringSigmaUnits`/`ringK` gone; no `@property`; no `outline-ring`; `outline-style: auto` nowhere | greps: 0 / 0 / 0 / 0 (the one `outline: auto` hit is prose inside the new comment) | HOLDS |
| the record is frozen | nothing under `loop/r0/` or `loop/pass1/` modified today; the three instrument diffs are banked under `pass2/prototype/MRK-ABS/instruments/` | HOLDS |
| R6 laws 18 / 23 | `R6-census.md:98` and `:103` say what the spec says they say; the dark arm is an alias onto an existing crayon hex, zero new hex | HOLDS |

The prototype is honest to an unusual degree: it corrected **seven** of its own spec's numbers
(§4 of its README) including one that inverts the spec's stated reason for the cure, and it
declared ten gaps. Nothing it claimed was found false. What follows is what it did not find.

---

## 2 · The findings

### 2.1 MA-R is measured on ONE of the four tiers, and the heaviest tier clears by 0.049 px

`gameCell.css` draws the same `.cell-ghost-path` at four stroke weights, and the diff routes
all four through the new inset geometry (§1.5 says so explicitly: "every tier rides the inset
geometry"). `clearance-p2.mjs` hard-codes `HALF_STROKE = 7 / 2 // gameCell.css tier 2`. I
copied the probe, made that one number a parameter, and ran it over the four weights the sheet
actually declares (`probe/clearance-tiers.mjs`):

| tier | selector | stroke | B, desk 16×16 | B, phone 16×16 | B's ceiling |
|---|---|---|---|---|---|
| 4 peer cursor | `.is-peer-cursor` | 4 | +1.517 | +0.870 | board 20 |
| 1 hover | base `.cell-ghost-path` | 5 | +1.272 | +0.730 | board 19 |
| **2 selection (the only one measured)** | `:has(input:focus-visible)` | 7 | **+0.783** | **+0.449** | **board 18** |
| 3 conflict | `.is-invalid` | 9 | +0.294 | +0.169 | board 16 |
| 3 ∧ 2 conflict AND selected | `.is-invalid:has(input:focus-visible)` | **10** | **+0.049** | **+0.028** | **board 16** |

MA-R is still true by the letter (B ≥ 0, 256/256, every tier). But +0.049 CSS px is 0.15 device
px at dpr 3 and less than one device pixel at every dpr the product ships to: on a wrong digit
you are still sitting in at 16×16, the ring and the rule land in the same pixel. The law's own
sentence — "the ring never shares ink with the rule" — is what the design is FOR, and the state
where a player most needs to read the ring apart from the rule is the state that was not
measured. Worse for the record: `pencilConfig.ts`'s new comment ships "the law's ceiling is
board 24 on A, board 18 on B and board 38 on C" as if those were the law's ceilings; board 18
is tier 2's ceiling and the product's heaviest tier ceilings at **board 16** — the largest board
that ships. There is zero headroom and the comment says there is two boards of it.

Closable: run `clearance-p2.mjs` over the four declared strokes, report B per tier, make G-ABS-6
score the worst tier (half-stroke 5), and re-cut the ceiling comment to that tier.

### 2.2 The constant is size-free in ghost units, and the reader does not see ghost units

`maxDisplace = wanderUnits` exactly, at every board — I accept the derivation and the prototype's
σ readings. But px/unit is `boardPx/1300` and `boardPx` is **not** constant across boards: the
probe's own table has desk 4×4 at 412 px and 9×9/16×16 at 636 px. So the wander the reader sees is

- 4×4: σ = 2.392 × 0.3169 = **0.758 px** on a 103 px cell → 0.74 % of the cell
- 16×16: σ = 2.392 × 0.4892 = **1.170 px** on a 39.75 px cell → **2.94 %** of the cell

One number in units is 1.5× more wander in px and **4× more relative to the square** at 16×16
than at 4×4. `crop1` is the proof and the spec reads it as a success: at 16×16 the mark is a
crumpled quadrilateral whose edges bow visibly inward, which is the opposite pole from the "reads
as CAD" defect it cured, and no gate scores the pole it landed on. G-ABS-1's band [0.5, 2.0] is
the only shape gate and it is 4× wide with no derivation anywhere in the spec for either edge —
its measured value (0.657 px, or 0.854 in units; the gate does not say which quantity it scores,
and the two differ by exactly the 1.3 squeeze) is a restatement of the choice of 5.4 and cannot
fail without changing 5.4. The family measures σ's CONSTANCY beautifully and never measures σ's
FITNESS on the board where it is largest.

Closable: declare the reader's quantity (σ ÷ drawn edge, or σ in px at each shipped board), put a
band on it derived from the two poles the record already has (HEAD's 0.067 = CAD, and whatever
reading the owner refuses at the re-look), and say in G-ABS-1 whether its number is px or units.

### 2.3 A second focus ink and a third minted radius survive, and both gates are worded past them

`index.css:779` — untouched by this diff, in the file this diff rewrites:

```css
.sudoku-cell:focus-within {
  background: color-mix(in srgb, var(--color-accent) 50%, transparent);
  outline: 1px solid color-mix(in srgb, var(--color-ring) 30%, transparent);
  outline-offset: -1px;
  border-radius: 2px;
}
```

`.sudoku-cell` is live (`DigitCell.vue:92`). Its outline is neutralised in paint by the scoped
`.game-cell:focus-within { outline: none }` (`gameCell.css:301`) — but the `border-radius: 2px`
is NOT, and neither the ink nor the radius is visible to this family's gates, because both are
scoped to `:focus-visible` blocks and this is `:focus-within`. So:

- G-ABS-4 ("every `:focus-visible` stop … the same outline colour") cannot see a focus ink in a
  different token (`--color-ring`) on the product's most-focused element.
- G-ABS-9 ("a source grep for `border-radius` inside any `:focus-visible` block returns 0")
  cannot see the third minted radius, on a focus state, in the same stylesheet the law is
  authored in. The law says "a focus rule may not mint one"; the gate says `:focus-visible`.

A grep worded to its own law finds it in one line. That the rule is dead paint is the argument
for deleting it, not for leaving it: the family's whole claim is "one blue ring in the whole
product", and the old ring is still in the source under the old token, kept alive only by a
scoped override in another file.

Related and smaller, same shape: `gameCell.css:247` still reads
`fill: var(--color-focus-sketch, var(--color-crayon-blue))` — a fallback the family's own new
`index.css` comment now certifies "can never fire". Keeping a fallback whose only job is to hide
a case that cannot happen is the masked-fallback tell; delete it in the same diff that says so.

### 2.4 G-ABS-4's arrival clause is not executable in WebKit, and was not executed there

I tab-walked both engines. Chromium enumerated 14 distinct stops. **WebKit enumerated one** —
macOS WebKit's Tab reaches form controls only unless Full Keyboard Access is on, so a
Tab-driven census in WebKit is blind to every button and link on the page. The prototype's own
logs agree with what that implies: `tabwalk-chromium.json`, `arrival-chromium.json`,
`transition-chromium.json`, `budget-chromium.json` — no webkit twin exists for any of them,
and the return reports G-ABS-4 GREEN without naming an engine. The spec wrote the gate for both
(§2.3: "first sample already the token, both engines, every stop"). As worded — "`arrival.probe.ts`
reads the token at its FIRST sample on every shipped stop" — the gate cannot run on one of the
two engines the wave requires; it needs programmatic focus plus a keyboard-modality shim, or
`--enable-features` on the WebKit context.

The same instrument gap hides the census subtraction: G-ABS-4's first clause says "every
`:focus-visible` stop", and two stops (`.tuner-toggle` at 3 px / offset 0 with its own 50 %
radius, and DebugToggle) do not. Both are genuinely `import.meta.env.DEV`-gated (`App.vue:124`
ternary; `DebugToggle.vue:10`), so subtracting them is defensible — but subtracting BY NAME from
a census is a gate that cannot fail on a stop someone adds tomorrow. The spec already names the
honest form ("or the census runs on a built preview"), and it is deferred with everything else
dist-bound.

### 2.5 The cure's only board crop is taken in the theme where the hazard is weakest

The prototype's best correction is that ring-ink vs rule-ink reads **1.39 light** and 5.42 dark,
not the spec's 4.11 / 1.86 — the near-merge is in LIGHT. The four crops are: board dark, board
dark (f=0.90), deck light/webkit, guard dark. There is no crop of the board in light. The
lozenge-on-the-rule defect the family exists to cure is photographed only in the theme where
1.39:1 does not apply. The U-10 question put to the owner (0.86 vs 0.90) is likewise asked twice
in dark. One of the four crops should be light; the crop budget does not need raising, it needs
re-spending.

### 2.6 Smaller, each closable in a line

- **`kW4` ships and nothing in the product reads it.** `gridPaths.ts` destructures
  `{ wanderUnits, inset }`; `kW4` is quoted only by gates and comments, and rides into the
  bundle inside a frozen object. Either the gate imports it (good — then the gate and the ship
  share one number) or it belongs in the gate's own file, not in `pencilConfig.ts`.
- **The wordmark's ring corners go 5.6 px → 0 and only the deck's 8 px delta is declared.**
  `HandwrittenLogo.vue`'s deleted rule carried `border-radius: 0.35rem`; §2.4 declares the deck's
  8 px corner as a DELTA with a crop and says nothing about the logo's. Same act, same law, one
  sentence missing.
- **G-ABS-2's n=4096 arm checks the primitive against a constant fit on that same primitive in
  that same window.** It is a pencil-boil version canary, which is worth having — it is not a
  design gate, and the spec's circularity paragraph (one window for fit and verdict) answers a
  different charge than the one this arm invites. Say which it is.
- **The prototype's own gap 1 stands and I could not close it either:** `.drawer-tab` pools
  2.96/2.68 with `isTheRing=false` because `elementFromPoint` on its left band is
  `input.cell-native-input`. Per side the outward band reads the token clean (3.21 / 5.72). It is
  not a regression and it is not proven; a per-side form or an `elementFromPoint` filter closes it.
- **The `.guard-face` has no chromium ratio** (focus containment defeated the unfocused frame)
  and the attribution card's three inner stops were never read focused — my walk got the two
  links at the token, which closes two of those three; DebugToggle is the third and it is DEV-only.
- **Lane hygiene, one loose end:** the prototype's instruments live at
  `<worktree>/web/frontend/.pass2-mrkabs/` (untracked, 224 KB) as well as in the evidence dir.
  Harmless, and it dies with the worktree; worth a line in the fold so nobody replays from it.
- **Wave cap.** `evidence/w7/` is **41 MB** against a stated 2 MB cap (pass 1 16 MB, pass 2 12 MB,
  r0 2.8 MB). This family is 628 KB of it and is not the offender — but no lane can close the cap
  alone and nobody has been told to sweep it.

---

## 3 · The checklist, item by item

| item | verdict |
|---|---|
| vacuous convergence | **partial hit** — G-ABS-1's [0.5, 2.0] has no derivation and restates the chosen constant; G-ABS-2's n=4096 arm is a library canary, not a design gate |
| spec-cites-itself | **partial hit** — kW4 is fit on the primitive and the gate verifies the primitive against kW4. The window circularity the spec DID cure is genuinely cured |
| gates that cannot fail | **hit** — G-ABS-9's grep and G-ABS-4's colour clause are scoped to `:focus-visible` while their laws are written about focus rules; both are blind to `index.css:779`. G-ABS-7 is GREEN-at-HEAD by design and says so |
| elegant-reduction trap | **partial hit** — "on the board the hand, off it the token" is genuinely reduced, but the hard part (every stop's PAINTED ring, both engines) is three stops and one engine short |
| legacy aliases | **hit** — `--color-ring`'s focus ring survives at `index.css:779` after its global sweep was deleted; the dead `var(--color-focus-sketch, …)` fallback survives after being certified dead |
| masked fallbacks | **hit** — the certified-dead fallback above; the by-name subtraction of two DEV stops from a dev-server census |
| unverified gestalt | **partial hit** — three of four surfaces crop-proven on the real thing in one engine each, which is proportionate; the missing one is the board in LIGHT, the theme the run's own numbers make the hazard |
| consumer-less substrate | **minor hit** — `RING_GEOMETRY.kW4` |
| the generic default | **clear** — the tell review is real: the ink is the crayon's own tier, offset 3 is the tongue's `:outset`, the per-size table is refused, the corners are square because the house draws square. 2 px solid is the common shape, and it earns it |
| pi, the undeclared pixel | **minor hit** — the wordmark's 5.6 px ring corner; everything else that moves is declared, and no touched property is layout-affecting, so layout pi is zero by construction |
| the forgotten constraint | **clear on AA** (recomputed: 4.20–7.87 token, 3.93 / 7.06 board ring, all ≥ 3:1), **clear on M16** (0/0 on my run), **clear on the decided history** (laws 18/23 read and held), **clear on W2** (the toggle's 54 px ornament offset kept, the sticky `.icon-btn` clip named not asserted), **filterBudget 9 unverified by me** and chromium-only in the prototype's log |

---

## 4 · Strengths worth banking

1. **The load-bearing constant survives an independent check.** `boardPx / 1300` is the single
   conversion every px number in the family rests on, it is counter-intuitive (the ghost svg
   squeezes a 1.3× viewBox into the cell's box, so the ghost draws at 1/1.3 of the grid's scale),
   and it reads 0.48923 on both engines. Everything downstream is arithmetic over a measured number.
2. **`maxDisplace = wanderUnits` exactly.** Inverting the library's proportional law instead of
   tabulating per size is the right kind of fix: one constant, one deleted branch, and the
   invariant is in the geometry rather than in a comment.
3. **DOM `d` IS library `d`, byte-identical, both engines.** That is what makes the closed-form
   clearance trustworthy where the pixel walk cannot resolve it — and my own attempt at a pixel
   walk on a 39.75 px cell confirms the prototype's gap 5 from the other side: the surface cannot
   settle B at this scale, and the identity is the reason it does not have to.
4. **The negative control on specificity.** (0,4,0) buried the toggle's ring; (0,1,0) inside
   `@layer base` keeps every bespoke geometry rule winning. That is a design decision with a
   failed experiment behind it, which is rare.
5. **Self-refutation.** Seven spec numbers corrected against the prototype's own interest,
   including the one that inverts §1.3's stated reason for the cure. This is the behaviour the
   loop is supposed to produce.

## 5 · Why 78 %, and not more

Zero open gaps is the bar. There are eleven, five of them closable inside one commit
(the tier sweep, the two gate wordings, the dead rule, the dead fallback), and three that need
an instrument (WebKit modality, the per-side band, the built-preview census). The prototype runs,
both engines, and nothing it claims is false — which is why this is ADVANCE and not BLOCK: no
primitive here is as hard as the problem, and the incompatibilities with MRK-LIVE are stated
rather than papered over. It is not BANK because the heaviest tier's 0.049 px would go to the
owner as "0.78 px of air" and that would be the record lying about the thing the family is for.

## 6 · Cross-pollination

- The unit→px squeeze (`boardPx/1300` for anything drawn in a `.cell-ghost` svg, `boardPx/1000`
  for anything drawn in `hand-drawn-grid`) belongs in the wave's shared notes. Any family quoting
  a px figure about a cell-scoped mark and using the grid's scale is out by 1.3×.
- The parameterised clearance probe (`critique/MRK-ABS/probe/clearance-tiers.mjs`) generalises:
  any family that gates a drawn mark's clearance should sweep the tier table, not the tier it
  happened to screenshot.
- The WebKit Tab blindness is a wave-wide instrument fact, not this family's: every lane whose
  gate says "every tab stop, both engines" is either using programmatic focus already or is
  reporting a chromium number under a both-engines sentence.
- The RING BAND instrument (ink = median of CHANGED samples, verified against the computed
  `outline-color` composited over the measured ground) is the right primitive for every family
  claiming a focus-contrast number, and its `isTheRing` flag is what caught the `.drawer-tab`
  occlusion instead of reporting 2.96 as a ring reading. Graft it.
- The inset is gratable onto MRK-LIVE's pose stack (the family says so and the geometry supports
  it); the chrome half of this route costs 0 components and 0 paths and can be taken with either
  board.
