# R2 — THE ACCENT FAMILY: the hue census and the token estate

T9-W7 round zero, lane R2. Owns W7 §3 (the accent family), and feeds §4 (the fill meter's
hue), §6 (focus rings), §11/§12 (the per-player colour system, the multiplayer chrome),
§15 (the confirm's face). Read-only on the product: nothing under `web/frontend/src`,
`e2e/` or `scripts/` was touched.

Measured at HEAD `4686436f` + the uncommitted W3/W6 tree, 2026-09-17, on
`http://127.0.0.1:4237` (lane-started dev server), chromium and webkit, light and dark.

---

## 0. What moved since formation

The formation census (registry F18, 2026-08-10, commit `7156460d`) is a token-level claim,
and at the token level **nothing moved**: `git diff 7156460d..HEAD -- src/assets/index.css`
is +43/−4 lines and **not one of them is a `--color-*` value or a hex**. The 43 added lines
are W2 §2.6's `--icon-act/verb/tool` ranks and the `--tap-floor` note. Every accent this
lane measures is the accent the formation measured.

What DID move is the surfaces the accents paint on: W1 added the given-write refusal (it
speaks in `--color-red-ink`, which is kin — §3 below) and the unit-naming conflict note;
W2 moved the controls tab to the board's bottom edge. Neither minted a hue.

Three formation figures do NOT reproduce, and the corrections sharpen the finding rather
than soften it:

| formation said | this tree measures | which way it cuts |
|---|---|---|
| "99.2% of resting chromatic content in ONE warm family" | **93.21%** light / **87.04%** dark (chromium); 93.06 / 86.67 (webkit) | the formation figure has no stated band or chroma floor, so it cannot be reproduced. §1 states both. The claim SURVIVES — the resting product really is one family — at 93%, not 99% |
| "two blues 15° apart" | **9.6°** in OKLCH, **9.5°** in HSL (`--color-user-ink` 262.9° vs `--color-focus-sketch` 253.3°) | **worse**: 9.6° is closer than 15°, and two hues 9.6° apart doing unrelated jobs are harder to tell apart, not easier |
| "violet only in the fill meter" | violet paints **three** places: the fill meter, solver rainbow stop 2 (`#7c3aed` light / `#c4b5fd` dark), and a hardcoded `rgba(196,181,253,…)` glow on the sparkle icon | **worse**: the violet is not a lone stripe, it is an unnamed sub-family with one token, one rainbow stop and one inline literal |

---

## 1. The hue census, re-run

**Method.** Not a DOM walk — a **pixel census**. Screenshot the 1280×800 viewport, decode to
raw RGB (`sharp`), convert every pixel to OKLCH, keep the pixels at chroma **C ≥ 0.012**, bin
their hue in 10° buckets. The floor is stated because it decides the answer: the cream paper
`hsl(48 15% 98%)` resolves to `rgb(251,250,249)` at C ≈ 0.002 and is **below** the floor, so
"chromatic content" here means ink, wax and wash — not the page.

**The house warm band** is declared as OKLCH hue **40°–115°**, and it is derived rather than
chosen: it is the arc the resting product already occupies — the cream papers, the graphite
rules, `crayon-orange` 68.7°, `crayon-gold` 83.7° — rounded out to the two crayons that
bound it.

| engine / theme / state | chromatic px (share of viewport) | in the warm family | off-family |
|---|---|---|---|
| chromium light **rest** | 19,609 (1.91%) | **93.21%** | 6.79% |
| chromium light focus | 21,383 (2.09%) | 85.48% | 14.52% |
| chromium light mid-board | 23,186 (2.26%) | 78.83% | **21.17%** |
| chromium dark **rest** | 10,778 (1.05%) | **87.04%** | 12.96% |
| chromium dark focus | 11,819 (1.15%) | 79.19% | 20.81% |
| chromium dark mid-board | 16,499 (1.61%) | 56.79% | **43.21%** |
| webkit light rest | 19,664 (1.92%) | 93.06% | 6.94% |
| webkit light mid-board | 28,213 (2.76%) | 64.86% | 35.14% |
| webkit dark rest | 10,761 (1.05%) | 86.67% | 13.33% |
| webkit dark mid-board | 15,805 (1.54%) | 59.01% | 40.99% |

**The finding, stated as a number.** At rest the product is one family (93% light / 87% dark).
Fourteen keystrokes into a board — the most ordinary thing a player does — off-family colour
goes from 6.79% to 21.17% of everything coloured on screen in light, and from 12.96% to
**43.21% in dark**. In dark mode, mid-board, nearly half the chromatic content of the page
belongs to no house family at all. The resting hue bands that carry the growth are
**240–260° (blue)** and **290–300° (violet)** in both engines.

Raw: `census/census-{chromium,webkit}-{light,dark}.json` → `pixels.{rest,focused,mid}`;
digested in `census/digest.json` → `readings`.

---

## 2. The token estate

Every `--color-*` in `web/frontend/src/assets/index.css`'s `@theme` block and its `.dark`
override, resolved by the live browser and converted to OKLCH. `h` is hue, `C` chroma,
`Δ` is circular hue distance to the nearest crayon anchor.

### The wheel (the five crayons — the wax, `index.css:170-176`)

| anchor | light | h | C | dark | h | C |
|---|---|---|---|---|---|---|
| `crayon-rose` | `#e8315b` | 14.2° | 0.216 | `#ff5c7c` | 12.2° | 0.198 |
| `crayon-orange` | `#f4a236` | 68.7° | 0.151 | `#f5b35c` | 71.8° | 0.129 |
| `crayon-gold` | `#c99a2e` | 83.7° | 0.131 | `#e5c74d` | 95.2° | 0.142 |
| `crayon-green` | `#2dc653` | 147.0° | 0.200 | `#3dd968` | 148.3° | 0.201 |
| `crayon-blue` | `#4a90d9` | 251.4° | 0.131 | `#6aabeb` | 249.3° | 0.115 |

**The wheel has a hole, and it is the biggest gap on it.** Sorted by span:

    251.4° → 14.2°   span 122.8°    ← crayon-blue to crayon-rose: the violet/magenta arc
    147.0° → 251.4°  span 104.4°    ← green to blue: the teal/cyan arc
     83.7° → 147.0°  span  63.3°
     14.2° →  68.7°  span  54.5°
     68.7° →  83.7°  span  15.0°

`--color-progress-ink` (292.7° light / 293.0° dark) sits **inside the 122.8° hole**, at 41.3°
and 43.7° from the nearest anchor. There is no house colour within 41° of the fill meter.

### The inks, by job

| job | token | light | h | Δ to nearest crayon | dark | h | Δ | kin at 5°? |
|---|---|---|---|---|---|---|---|---|
| **authorship** — your digit | `--color-user-ink` | `#2563eb` | 262.9° | **11.5°** (blue) | `#60a5fa` | 254.6° | **5.3°** | **NO** |
| **authorship** — a peer's digit | `playerIdentity.ts:69` | `oklch(0.5 0.11 i×137.5°)` | walks | 3.8–46.7° over 12 indices | `oklch(0.8 …)` | walks | — | excepted |
| **authorship** — whose pencil | `--color-peer-cursor-ink` | rebound per cell | — | — | — | — | — | rides the walk |
| **focus** — the board's ring | `--color-focus-sketch` | `#3a7bc4` | 253.3° | 1.9° (blue) | *never redefined* | 253.3° | 4.0° | yes |
| **focus** — a control's ring | `--color-ring` @ α0.5 | `hsl(0 0% 3.9%)` | achromatic | n/a | `hsl(48 8% 83%)` | achromatic | n/a | **no ink at all** |
| **selection** — the unit wash | `--color-crayon-blue` @ 7% | `#4a90d9` | 251.4° | 0° | `#6aabeb` | 249.3° | 0° | yes |
| **progress** — the fill meter | `--color-progress-ink` | `#8b5cf6` | 292.7° | **41.3°** | `#7c3aed` | 293.0° | **43.7°** | **NO** |
| **danger** — ring, wash, frame | `--color-teacher-red` → rose | `#e8315b` | 14.2° | 0° | `#ff5c7c` | 12.2° | 0° | yes |
| **danger** — the words | `--color-red-ink` | `#d02a52` | 13.6° | 0.6° | → wax | 12.2° | 0° | yes |
| **celebration** — solved frame | `--color-gold-star` → gold | `#c99a2e` | 83.7° | 0° | `#e5c74d` | 95.2° | 0° | yes |
| **celebration** — the words | `--color-gold-ink` | `#8c691d` | 82.4° | 1.3° | → wax | 95.2° | 0° | yes |
| **difficulty** — easy | `--color-green-ink` | `#1d7f35` | 147.2° | 0.2° | → wax | 148.3° | 0° | yes |
| **difficulty** — medium | `--color-orange-ink` | `#a26009` | 64.2° | **4.5°** | → wax | 71.8° | 0° | yes (the widest lock the estate ships) |
| **difficulty** — hard | `--color-red-ink` | `#d02a52` | 13.6° | 0.6° | → wax | 12.2° | 0° | yes |
| **answer** — solver stop 1 | `--color-solver-ink-1` | `#c2286e` | 359.0° | 15.2° | `#f9a8d4` | 346.0° | 26.2° | excepted |
| **answer** — stop 2 | `--color-solver-ink-2` | `#7c3aed` | 293.0° | 41.6° | `#c4b5fd` | 293.6° | 44.3° | excepted |
| **answer** — stop 3 | `--color-solver-ink-3` | `#2059c8` | 261.9° | 10.5° | `#93c5fd` | 251.8° | 2.5° | excepted |
| **answer** — stop 4 | `--color-solver-ink-4` | `#047857` | 165.6° | 18.6° | `#6ee7b7` | 165.0° | 16.7° | excepted |
| **answer** — stop 5 | `--color-solver-ink-5` | `#92600a` | 72.7° | 4.0° | `#fde68a` | 95.7° | 0.5° | excepted |
| **structure** — graphite | `--color-pencil-graphite` → `--grid-line-color` | `hsl(0 0% 15%)` | achromatic | n/a | `hsl(48 10% 80%)` | achromatic | n/a | n/a |
| **quiet** — hairlines / captions | `--ink-press-rule` 55% / `--ink-press-quiet` 68% | graphite mixes | achromatic | n/a | — | — | — | n/a |

### Where the inks came from

Eleven of twenty-two sampled inks are **byte-verbatim Tailwind default-palette colours**,
measured against the installed `tailwindcss/theme.css` on the same OKLCH L (±0.0015) and hue
(±0.5°) — chroma differs only because the framework states its palette in wide-gamut `oklch()`
and a hex is that colour gamut-mapped:

    --color-user-ink      #2563eb  =  blue-600      (L 0.5460 / h 262.88, exact)
    --color-progress-ink  #8b5cf6  =  violet-500    ·  #7c3aed = violet-600
    --color-solver-ink-2  #7c3aed  =  violet-600
    --color-solver-ink-4  #047857  =  emerald-700
    dark rainbow: #f9a8d4 pink-300 · #c4b5fd violet-300 · #93c5fd blue-300
                  #6ee7b7 emerald-300 · #fde68a amber-200
    sparkle glow  rgba(196,181,253,…) = violet-300, spelled inline

`--color-user-ink` dark `#60a5fa` is hue-exact against `blue-400` (Δh 0.00°) and 0.0067 off in
L — Tailwind-sourced, just under the strict bar.

**Zero of the five crayons match anything in that palette** (nearest: `crayon-rose` → rose-500
at Δh 2.28° / ΔL 0.032; `crayon-gold` → yellow-600 at Δh 7.84°). The wax is hand-cut. The inks
the player touches are stock. That is the census's one-sentence answer to M07.

Raw: `census/digest.json` → `stock`, `kinTable`, `wheelGaps`; `census/kin-arithmetic.json`.

---

## 3. Every accent's JOB, and which exceptions a11y actually requires

Six jobs, and the estate does not have six colours for them — it has five crayons, two
Tailwind blues, a Tailwind violet and an unbounded generated walk.

| job | what it must do | who owns it now | is the deviation a11y-REQUIRED? |
|---|---|---|---|
| **selection** | say which cell, and which row/col/box it reaches | `crayon-blue` @ 7% wash + graphite ghost ring | no — it is already kin |
| **authorship** | separate your hand from N peers' and from the solver's | `--color-user-ink` (blue-600) + a 137.5° walk at C 0.11 | **the SEPARATION is required; the hue is not.** `user-ink` could be `crayon-blue`'s ink tier and lose nothing |
| **focus** | be visible at ≥3:1 non-text (WCAG 1.4.11) | `--color-focus-sketch` on the BOARD; the user agent's own ring on every CONTROL | **contrast-required, hue-locked.** `focus-sketch` exists because raw `crayon-blue` measures **2.88:1** on `--color-card` and the darkened step measures **3.63:1**. A contrast floor moves LIGHTNESS; it never needs a new hue — and this one did not take one (Δ 1.9°) |
| **progress** | be legible over the frame line, in both themes, and never read as focus | `--color-progress-ink` (violet-500/600) | **no.** The stated constraint is *distinguishability from focus* ("NON-blue by construction, 46° off", `index.css:267`) — and `crayon-rose`, `crayon-gold` and `crayon-green` are 237°, 168° and 104° off `focus-sketch` respectively. The house wheel already satisfies the constraint the violet was minted for |
| **danger** | grade, refuse, conflict | `teacher-red` → `crayon-rose`, `red-ink` for words | no — kin, and the ink tier is a documented AA lightness move (4.87:1) |
| **celebration** | reward | `gold-star` → `crayon-gold`, `gold-ink` for words | no — kin |
| **difficulty** | three steps of one idea | green/orange/rose ink tiers | no — kin, hue-locked to 0.2/4.5/0.6° |
| **answer** | five stops, never mistakable for a hand | the solver rainbow | **YES — discriminability.** Five hues cannot fit a five-point wheel without colliding with the wax that owns those hues. It pays its toll: **5.29–6.21:1** on `--color-card` (measured this tree, matching the ledger at `index.css:200-202`) |
| **presence** | N unique inks, no cap | the 137.5° golden-angle walk | **YES — discriminability.** Any bounded palette either runs out or repeats. It pays its toll: the **LIGHTNESS BAND**, worst **5.36:1** over 40 indices on `--color-card` |

**The distinction the wave needs.** *Contrast-bearing* and *family-breaking* are not the same
thing, and the estate proves it five times over: `red-ink`, `green-ink`, `orange-ink`,
`gold-ink` and `focus-sketch` all exist purely to clear a contrast floor, and all five stayed
within 4.5° of their wax. **Only two jobs genuinely require a hue the wheel cannot supply**
(answer, presence), and neither of them is `user-ink` or `progress-ink`.

---

## 4. Three findings the token table does not show

### 4.1 Focus is three idioms, and one of them is the browser's

Ten consecutive tab stops inside the controls card, chromium, every one of them:

    outline-style: auto
    outline-color: oklab(0.144521 …/0.5)    ← --color-ring at 50%, achromatic

The ring is **half-authored, and the half that is authored is the achromatic half**.
`index.css:445` — `@layer base { * { @apply border-border outline-ring/50 } }` — sets
`outline-color` estate-wide and nothing else: no style, no width, no offset. `outline-style:
auto` is Chromium's own `:focus-visible` default filling the gap, so the geometry is the
browser's and the colour is `--color-ring` (`hsl(0 0% 3.9%)` light / `hsl(48 8% 83%)` dark) —
a neutral, at half alpha, on every control in the product. So the estate has:

1. **the board's cells** — a hand-drawn `crayon-blue` ghost ring, `stroke-width: 7`, sketched
   on over 180ms (`gameCell.css:245-260`);
2. **every control** — the user agent's default ring, in a near-black neutral;
3. **the guard ribbon's two buttons** — `outline: 2px solid color-mix(foreground 45%)` at
   `outline-offset: 4px` (`GameGallery.vue:1450`), a third geometry in a third colour.

Only the first is in the house's hand. Banked: `census/focus-ring-chromium.json`.

**The engine truth, and a trap for §6's gate.** The same walk in PW-WebKit reaches **zero**
controls — 20 tab stops, all board cells — because WebKit inherits macOS Full Keyboard Access,
where Tab skips buttons. A focus-ring gate written the obvious way **passes in the second
engine by having no subject**. The instrument in §5 refuses that pass with an explicit
subject-count assertion; any W7 cure's gate must carry the same guard or it ships an F1-family
vacuous green.

### 4.2 The dark focus ring is not the colour its own comment claims

`index.css:219-222` says of `--color-focus-sketch`: *"Dark mode keeps crayon-blue (5.3:1,
comfortable)."* The `.dark` block **never redefines `--color-focus-sketch`**, so the fallback
in `gameCell.css:246` (`var(--color-focus-sketch, var(--color-crayon-blue))`) is dead in both
themes. Measured on this tree:

    dark ring, actual   #3a7bc4 @ stroke-opacity 0.9 over --color-card  →  3.69:1
    dark ring, claimed  #6aabeb (crayon-blue) same conditions           →  6.42:1

It clears the 3:1 floor either way, so this is not an a11y failure — it is 1.7× of stated
headroom the cascade does not deliver, and a §6 re-cut that trusts the comment will re-derive
from the wrong number.

### 4.3 The destructive confirm has no accent at all

The deal guard, armed on a dirty board (M12's own subject, §15's face), measured whole:

    .guard-note-frame   background rgba(0,0,0,0)   border-top rgb(230,230,228) = --color-border
    .guard-note-text    rgb(10,10,10)              = --color-foreground,  Patrick Hand 18.18px
    .guard-note-sub     rgb(115,115,115)           = --color-muted-foreground, 16.36px
    .guard-btn          color rgb(10,10,10), background transparent
    .guard-leave        background color-mix(foreground 8%)   ← the only mark on the destructive verb
    text: "deal over this puzzle?" / "your marks aren't saved" / "keep" / "deal"

Zero chromatic content on the one surface in the product whose entire job is *stop and think*.
Meanwhile the estate already owns a danger ink that every other refusal uses: the refusal note
measured `rgb(208,42,82)` = `--color-red-ink`, and the failed frame `#e8315b` = `crayon-rose`.
§15's face has a house colour waiting for it and is not using it.

Banked: `census/states-chromium.json`, `census/states-webkit.json`.

**Engine coverage, stated rather than implied.** Of the interaction states in §4, the conflict
ring and the solved frame were reached in BOTH engines and agree to the byte (`rgb(232,49,91)`
and `rgb(201,154,46)` in each). The **refusal note** and the **guard ribbon** were reached in
chromium only — in webkit the lane's own probe could not drive them (the same Full-Keyboard-
Access / click-path gap as §4.1), so `states-webkit.json` carries `refusalNote: null` and no
`guard*` keys at all. Those two readings are chromium-only and are cited as such. They are a
gap in this lane's probe, not a measured engine difference, and W7's own gate must reach them
in both engines or declare the holdout at row grain.

---

## 5. The instrument (born RED)

`probe/accent-kinship.probe.ts` — five rows, run under `probe/hue-census.config.ts` against
the lane's own dev server, chromium and webkit.

**KIN, defined so it can be measured and not argued:** an accent is kin when its OKLCH hue
sits within **KIN_DEG = 5°** of one of the five crayon anchors. 5° is not a taste number — it
is the house's **own loosest hue-lock, re-derived**: `green-ink` 0.2° · `red-ink` 0.6° ·
`gold-ink` 1.3° · `focus-sketch` 1.9° · `orange-ink` **4.5°**. Raising it is a design ruling
and it may never be raised to make a failing row pass.

**Declared exceptions:** the solver rainbow and the peer walk, both on *discriminability*
grounds, both required to pay an a11y toll the instrument collects.

| row | asserts | reading at HEAD |
|---|---|---|
| kin (light) | every non-excepted interactive accent within 5° | **RED** — `--color-user-ink` 11.5° from crayon-blue · `--color-progress-ink` 41.3° |
| kin (dark) | same | **RED** — `--color-user-ink` 5.3° · `--color-progress-ink` 43.7° |
| control focus ring | a focused control's ring is drawn in `--color-focus-sketch`; ≥3 control stops must be REACHED (the vacuity guard) | **RED** both engines — chromium: 8 named controls on `outline-style: auto` in an achromatic ring; webkit: subject count 0, refused |
| off-token literals | no interactive surface paints a colour no token names | **RED** both engines — `drop-shadow(rgba(196,181,253,0.3) …)` on `.sparkle-icon` |
| exceptions pay their toll | rainbow ≥4.5:1 on `--color-card`; peer walk ≥4.5:1 over 40 indices | **GREEN** both engines — rainbow 5.40 / 5.60 / 6.21 / 5.39 / 5.29; peer worst **5.36** over 40 |

**4 RED / 1 GREEN, chromium and webkit.** The green row is load-bearing: an instrument that
cannot pass anywhere measures nothing.

    cd web/frontend
    npx playwright test --config <this dir>/probe/hue-census.config.ts --project=chromium -g "§3 kinship"

(The probe sources are banked here as the record. They resolve `@playwright/test` from
`web/frontend/node_modules`, so the runs were executed from a scratchpad copy with that
directory symlinked — no product file and no `package.json` was touched.)

---

## 6. The consumer map — what a re-cut costs

Derived by `probe/consumers.mjs` over every `.vue`/`.ts`/`.css` under `src/`, excluding
`index.css` itself. **VAR** = a `var(--token)` site. **CLASS** = a `crayon-*` utility-class
string (usually a data literal in `selectors.ts`) — it moves with the token only because
`index.css:464-475` maps the class to the ink; rename the token and forget the map and the
chip paints nothing.

| token | VAR | CLASS | blast radius |
|---|---|---|---|
| `--color-user-ink` | **24** | 0 | `GameBoard.vue` · `PosterBoard.vue` · `GameControlPanel.vue` · `gameCell.css` · `useSession.ts` · `useJoinWash.ts` · `useStagingBridge.ts` · `BoardHost.vue` · `playerIdentity.ts` · `HandwrittenGlyph.vue` · `HandDrawnGrid.vue` · `GameCard.vue` · `GameGallery/types.ts` — **the widest accent in the estate; a re-cut of authorship is a real change** |
| `--grid-line-color` | 16 | 0 | `DifficultyTally` · `PosterBoard` · `gameCell.css` · `MarginNote` · `HandDrawnGrid` |
| `--color-muted-foreground` | 13 | 0 | the OTHER quiet voice, and `index.css:249-256` states it is deliberately NOT on the ink ramp |
| `--ink-press-quiet` | 12 | 0 | `DifficultyTally` · `GameControlPanel` · `scene.css` · `MarginNote` · `CompletionVignette` · `KeyboardLegend` |
| `--color-crayon-rose` | 10 | 3 | `gameCell.css` (6 sites) · `SolverErrorNote` · `MarginNote` · `GameControlPanel` |
| `--color-teacher-red` | 9 | 0 | `gameCell.css` conflict + hint tiers; `useGameState.ts` classifies to the literal string `"teacher-red"` |
| `--color-border` | 9 | 0 | `SolverErrorNote` · `AttributionCard` · `FilterTuner` |
| `--color-pencil-graphite` | 6 | 0 | `DifficultyTally` · `gameCell.css` · `MarginNote` |
| `--color-accent` | 6 | 0 | `GameControlPanel` · `SolverErrorNote` · `pencilConfig.ts` · `StagingBand` · `GameGallery` |
| `--color-crayon-blue` | 5 | 13 | `gameCell.css` (wash + ring fallback); 13 CLASS hits, all `selectors.ts`/prose |
| `--peer-ink-l` | 4 | 0 | `playerIdentity.ts` + its unit gate |
| `--ink-press-rule` | 4 | 0 | `GameControlPanel` · `KeyboardLegend` |
| `--color-red-ink` | 3 | 0 | `GameControlPanel` · `SolverErrorNote` · `MarginNote` |
| `--color-peer-cursor-ink` | 3 | 0 | `gameCell.css` · `BoardHost.vue` |
| `--color-gold-ink` / `--color-crayon-gold` | 2 | 0 | `MarginNote` · `CompletionVignette` |
| `--color-focus-sketch` | **2** | 0 | `gameCell.css:246` and `:248`, and nothing else — **the board's focus ink is a two-line change** |
| `--color-solver-ink-1…5` | 1 each | 0 | `SvgFilters.vue:180-184`, the five gradient stops |
| `--color-progress-ink` | **1** | 0 | `HandDrawnGrid.vue:471` — **the fill meter's hue is a ONE-LINE change** |
| `--color-ring` | 1 | 0 | `DarkModeToggle.vue` — plus the preflight `outline-ring/50` in `index.css:445`, which is where every control's ring actually comes from |
| `--color-gold-star` · `--color-green-ink` · `--color-orange-ink` | 0 | 0/1/2 | consumed by `index.css` alone (`.solve-success`, `.crayon-*`) — blast radius is that file |

### Off-token literals — the hexes a token cannot reach

    #2563eb   HandwrittenGlyph.vue:85       var(--color-user-ink, #2563eb)   — a defensible fallback
    #c4b5fd   SvgFilters.vue:168            #sparkle-rainbow stop (chrome, deliberately not themed)
    rgb(196,181,253)  GameControlPanel.vue:2081  drop-shadow on .sparkle-icon    — NOT reachable by any token
    rgb(196,181,253)  GameControlPanel.vue:2087  hover drop-shadow               — NOT reachable by any token

The last two are the instrument's fourth RED: a violet glow on an interactive surface that no
theme can re-point and no grep over token names will find.

Raw: `census/consumers.json`.

---

## 7. The per-player colour system, measured (feeds §11/§12, M14)

`playerIdentity.ts:69` — one formula, one binding:

    "--color-user-ink": `oklch(var(--peer-ink-l) 0.11 ${(index * 137.5) % 360}deg)`

Measured on a live two-page `?wire=local` session: the roster's own row carries
`oklch(0.5 0.11 137.5)` inline, the swatch and the name both resolve to it, and your row keeps
the incumbent `rgb(37,99,235)`. So **you are a Tailwind blue and every peer is a generated
oklch** — two different colour systems in one list, and the list is the surface M14 moves to
the top-left.

Three measured facts a per-player palette has to answer:

1. **Peers are systematically flatter than the wax.** Fixed chroma 0.11 against a mean crayon
   chroma of **0.166** (range 0.131–0.216) — peers run **34% under** the house saturation.
   They read as a different material, not a different person.
2. **Peers are darker than the wax in light and lighter in dark, by design.** `--peer-ink-l`
   0.5 vs mean crayon L 0.694 (light); 0.8 vs 0.769 (dark). The dark arm sits in the wax's
   own lightness range; the light arm sits 0.194 below all of it.
3. **The walk crosses every anchor and lands on none.** Over the first 12 indices the distance
   to the nearest crayon runs 3.8° to **46.7°** (i=5, hue 327.5°, in the 122.8° hole). Indices
   4, 5 and 10 are 43–47° off everything.

The a11y toll is paid and should stay paid: worst **5.36:1** over 40 indices on
`--color-card`. Any re-cut that quantises the walk onto a small palette must re-derive that
worst case over the new set and must keep a cap-free story, or it trades a colour problem for
a "room full" problem.

Raw: `census/census-chromium-live.json`, `census/peer-chromium.json`, `census/exception-toll.json`.

---

## 8. Frames

Two crops, both 330×210 at the board's top-left corner, chromium.

- `frames/board-corner-light.png` (14,655 B) — in one glance: the **violet** fill-meter trace
  on the top frame line, the **blue** digits you wrote (`user-ink`), the pale **blue** unit
  wash across the selected row, and the graphite givens. Three jobs, two unrelated blue-violet
  hues, on 330 × 210 pixels.
- `frames/board-corner-dark.png` (18,490 B) — the same corner in dark: the violet trace over
  the light warm-grey frame is the single most chromatic object on the page, and it is the one
  thing on screen that carries no label.

Total 33,145 B against the wave's 2 MB evidence cap.

---

## 9. The design questions this sharpens

1. **Does `user-ink` need its own hue at all?** It is 11.5° from `crayon-blue`, verbatim
   Tailwind `blue-600`, and the wash that marks its selection is already `crayon-blue`. A
   `blue-ink` tier (the exact move `red-ink`/`green-ink`/`orange-ink`/`gold-ink` already model)
   would make authorship kin at zero cost to contrast — `user-ink` measures 5.08:1 on
   `--color-card` and 7.36:1 dark, both well over AA, so there is headroom to move.
2. **What hue is the fill meter, once "not blue" stops meaning "violet"?** The stated
   constraint is separation from focus, which `crayon-gold` (168° away), `crayon-green` (104°)
   and `crayon-rose` (237°) all satisfy. Gold is the strongest candidate on the house's own
   terms — `index.css:174` already says gold "comes to the page only when the work is done",
   which is a progress semantic. §4's label/placement decision and this hue decision are one
   decision.
3. **Does the house draw its own focus ring, or does it keep three?** The board's ring is a
   two-line change; every control's ring is a preflight default nobody chose. One idiom, or a
   stated reason for two.
4. **What marks the destructive verb?** The guard ribbon has zero colour and the house has an
   idle danger ink. §15 either uses it or says why a confirm should look like a caption.
5. **Does the peer walk quantise, or stay a walk?** M14 asks for "a unique colour" per player.
   A bounded palette can be kin; an unbounded walk cannot. The cap-free property and the
   kinship property are in direct tension and the owner picks one.
6. **Is the solver rainbow still five hues?** It is the estate's other true exception, and
   three of its five stops are stock Tailwind. If the answer only has to separate from *your*
   hand and *a peer's*, it may need fewer hues than five — which would shrink the exception
   list from two to one and a half.
