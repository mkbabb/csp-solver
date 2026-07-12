# b3-storybook-toggle — the storybook pop-up warp (Finding 5b, design lane)

W13 audit loop · design lane on Fable + frontend-design skill · spec only, no shipped code.
Owner verdict (2026-07-11): *"warp in and out like a storybook-popup (shrinking and growing, etc). Design and divine this from first principles, look to how our animation was previously."*

---

## 1. The lineage — three generations of this gesture

| generation | commit | shape | timing |
|---|---|---|---|
| **ORIGINAL** (value.js port, Feb 2026) | `3f7e4038` | rotation spring on the sun + a **radial ink pulse**: `::before` disc `pulseToDark` `scale(0)→scale(1)` / `pulseToLight` `scale(100)→scale(1)`, 650ms ease-out | rotation `750ms cubic-bezier(0.11, 0.14, 0.29, 1.5)` (overshoot spring), translate `500ms ease-out` |
| **BEFORE** (pre-tranche-3) | `3b75eca2` — `DarkModeToggle.vue` (whirl block) | both bodies: `translateX(-50%) rotate(-270deg) scale(0.1)` ↔ identity, crossfade | `transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)`; opacity in `300ms (0.4,0,0.2,1)`, out `800ms +100ms` delay |
| **CURRENT** (shipped, d0893614) | `web/frontend/src/pencil/celestial/DarkModeToggle.vue:384-503` | BEFORE whirl verbatim + three Yoshi accents: `toggle-squash` 0–120ms (:434-450), `plush-land` 950ms with identity to 84% (:455-472), star pop 500/580/660ms (:480-503) | ~950ms gesture window (`turning`, :307-334) |

Two prior audits already adjudicated this surface: the W10 "Set-and-Rise" phase machine was **RE-CUT wholesale** ("the stage goes empty mid-gesture, the deferred flip reads as lag" — `docs/tranches/2026-07-tranche-3/README.md:87`), and W12 restored the BEFORE whirl + accents. The owner's new verdict says the *whirl itself* is the wrong grammar: `-270°` of rotation plus a half-width slide is a *carousel* gesture — it travels. A pop-up book piece doesn't travel; it **rises out of the page and sinks back into it**. The oldest gene in this toggle (the `scale(0)↔scale(1)` ink pulse of `3f7e4038`) is already the radial shrink/grow the owner is asking for.

**First principles — the pop-up-book grammar.** Paper engineering gives four beats: (1) **the press** — the page dips as the reader begins the turn (anticipation, everything else reads as a jump-cut without it); (2) **the fold-down** — the outgoing piece collapses into the page, *faster than it rose* (paper stores no momentum going down), with a slight twist because no fold is square; (3) **the rise** — the incoming piece grows up out of the gutter, overshooting its standing height as the linkage snaps taut; (4) **the flex** — one or two diminishing paper wobbles as it settles plumb. Shrink and grow, not spin and slide.

---

## 2. The crispness contract (coordinate with b2 — Finding 5's raster half)

The low-res artifact's mechanism: `.corner-right` is a promoted layer (`will-change: transform`, `App.vue:212-224`), and the whirl animates **CSS transform on the filtered SVG** (`DarkModeToggle.vue:388-424`). CSS transform applies *after* `filter="url(#wobble-celestial)"` rasterizes its input — so the grow from `scale(0.1)` bitmap-scales a stale small raster up ~10×. b2 owns the trace; the design's obligation is to be implementable without ever bitmap-scaling a stale raster. The contract:

1. **Any scale excursion beyond ±8% of identity rides an in-viewBox warp group** — a `<g class="warp">` wrapping each icon's content, animated via CSS `transform` on the `<g>` (`transform-box: view-box`; origin in user units). The transform is then *inside* the filter's input: every frame is a fresh vector render at device resolution — crisp at scale 0.06 and at 1.0 alike, on both the 5rem and 13rem rungs.
2. **CSS-layer scaling is permitted only within ±8% of 1** (the button squash 0.94–1.01, the plush flex 0.95–1.05): raster stretch under 8% is sub-perceptual at 208px.
3. **Cost bound:** the in-SVG transform forces filter re-raster per frame — but only for the ≤1.05s gesture, on a ≤13rem (208px) region, and only one body at a time is above `opacity: 0`. This is gesture-scoped, unlike the idle-page findings; the boil beat already re-rasters this region every 125ms at rest.
4. **Wobble-at-small-scale note:** feTurbulence displacement is constant in user units, so at warp scale 0.1 the wobble reads ~10× proportionally larger — plausibly the *crinkle of folding paper*, plausibly shredding. Prototype call: if legibility breaks below scale ~0.3, freeze the filter seed for the first/last 2 beats of the warp. The T3-W10 keep (filter bound on both icons, parked icon `visibility: hidden` — README.md:84, DarkModeToggle.vue:371-382) is untouched.

---

## 3. The house curve ledger (grep tally, `web/frontend/src`)

| curve | count | role |
|---|---|---|
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | 14 | **the signature back-out spring** — the whirl, the squash release |
| `cubic-bezier(0.22, 1, 0.36, 1)` | 9 | easeOutQuint — arrivals |
| `cubic-bezier(0.4, 0, 0.2, 1)` | 9 | standard ease — opacity |
| `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | 2 | back-in-out — the star pop |
| `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | 3 | easeInCubic-family — exits |
| `cubic-bezier(0.32, 0, 0.67, 0)` | 3 | easeInCubic — exits |
| `cubic-bezier(0.215, 0.61, 0.355, 1)` | 2 | easeOutCubic — the drawer case |

Every curve below is drawn from this ledger. Beat = `MOTION.beatMs` 125ms (`pencilConfig.ts:116-126`); the gesture is free-running transitions (as the shipped whirl is — gestures don't quantize, only perpetual boils do), but phase boundaries are chosen to fall on or near beat multiples so mid-warp wobble-pose swaps land inside phases, not across their seams.

---

## 4. Alternative A — "THE HINGE" (paper-fold, gutter-anchored)

The literal pop-up: both icons hinge at the **page bottom** (`transform-origin: 100px 190px`, view-box units — the bottom of the 200×200 stage). The outgoing folds flat into the page; the incoming rises from the same fold line. scaleY leads scaleX throughout — paper folds along one axis.

| t (ms) | beats | element | action | curve |
|---|---|---|---|---|
| 0–70 | ~½ | outgoing `.warp` | **up-breath**: `scale(1 → 1.04)` — the page lifts before it folds | `ease-out` |
| 0–120 | ~1 | button | press squash `1 → 0.94 → 1.01 → 1` (CSS layer, ±8% rule) | `ease-out` → `(0.34,1.56,0.64,1)` |
| 70–320 | 2 | outgoing `.warp` | **fold-down**: `scale(0.85, 0.05) rotate(-8deg)`, sinking to the hinge | `(0.55, 0.055, 0.675, 0.19)` |
| 240–320 | ~⅔ | outgoing icon | opacity `1 → 0` (the sliver vanishes into the fold line) | `(0.4, 0, 0.2, 1)` |
| 250–950 | ~5½ | incoming `.warp` | **rise**: from `scale(0.7, 0.04) rotate(6deg)` → overshoot `scale(1, 1.07)` at ~780 → `1` | `(0.34, 1.56, 0.64, 1)` 700ms |
| 250–500 | 2 | incoming icon | opacity `0 → 1` | `(0.4, 0, 0.2, 1)` |
| 950–1150 | ~1½ | incoming icon | **paper flex** (CSS layer): `scaleY 1.05 → 0.97 → 1.01 → 1` | `ease-out` |
| 800 / 880 / 960 | — | stars/sparkles | staggered pop `0.2 → 1`, 150ms | `(0.68, -0.55, 0.265, 1.55)` |

Total ≈ 1150ms. The 250–320ms overlap keeps the stage occupied (the W10 lesson).

**Risks, honestly weighed:** (a) it's *sequenced* — fold-down completes before the rise carries; that's the same choreography class W10 died of, mitigated but not eliminated by the overlap; (b) `scale(*, 0.05)` under feTurbulence displacement is near-degenerate geometry — the wobble may shred the 10-unit-tall sliver (§2.4's freeze becomes mandatory, not optional); (c) the rise phases are keyframe-shaped (a from-pose that isn't the rest pose), so a mid-flight re-click can't retarget as pure transitions do — it needs the fresh-instance trick, more machinery; (d) 1150ms is 200ms past the shipped gesture.

---

## 5. Alternative B — "THE BLOOM" (radial warp, center-anchored) — **recommended**

The owner's own parenthetical — *"shrinking and growing"* — is radial, and radial is the toggle's oldest gene (`3f7e4038`'s `scale(0)↔scale(1)` pulse). The Bloom keeps the shipped architecture **exactly** (pure `.is-active` transitions → re-clicks retarget for free, no phase machine — the property W12 fought to restore, DarkModeToggle.vue:299-306) and swaps only the *shapes*: the `-270°` whirl and the `translateX(-50%)` slide die; the motion becomes shrink-into-the-page / grow-out-of-the-page, center-origin (`100px 100px`), with a small counter-twist for paper character and a `translateY` breath so down reads as *into* the page and up as *out of* it.

Rest pose (inactive `.warp`): `scale(0.06) rotate(12deg) translateY(6px)` — a wrung scrap pressed into the page.
Active pose: identity.

| t (ms) | beats | element | action | curve |
|---|---|---|---|---|
| 0–120 | 1 | button | **the press**: squash `1 → 0.94 → 1.01 → 1` (kept verbatim, :438-450) | `ease-out` → `(0.34,1.56,0.64,1)` |
| 0–340 | ~2¾ | outgoing `.warp` | **wring-down**: `scale 1 → 0.06`, `rotate 0 → -15deg`, `translateY 0 → +6px` — shrinks *and sinks*, twisting as paper does | `(0.55, 0.055, 0.675, 0.19)` |
| 240–340 | ~⅔ | outgoing icon | opacity `1 → 0` (only the last beat — the body is nearly a point before it fades; no mid-air ghost) | `(0.4, 0, 0.2, 1)` 100ms delay 240ms |
| 60–860 | ~6½ | incoming `.warp` | **the bloom**: `scale 0.06 → 1`, `rotate +12deg → 0`, `translateY -4px → 0` — the back-out spring peaks ~1.08 around t≈560 | `(0.34, 1.56, 0.64, 1)` 800ms delay 60ms |
| 60–360 | ~2½ | incoming icon | opacity `0 → 1` | `(0.4, 0, 0.2, 1)` 300ms delay 60ms |
| 860–1010 | ~1¼ | incoming icon | **plush flex** (CSS layer): `scale 1.04,0.96 → 0.98,1.02 → 1,1` — the shipped plush-land grown a second half-bounce | `ease-out` |
| 560 / 640 / 720 | — | stars/sparkles | staggered pop `0.2 → 1` onto the overshoot crest (shipped stagger +60ms) | `(0.68, -0.55, 0.265, 1.55)` |
| 0–350 | ~3 | page | dusk ease (`theme-turning`) — unchanged (:311-318) | `index.css` rule |

Total ≈ 1010ms — the shipped ~950ms window +60ms; the `turning` backstop moves 1000→1100ms and `plush-land`'s identity-hold ratio re-derives (860/1010 ≈ 85%).

**Why it wins the storybook verdict:** the outgoing body visibly *shrinks into the page* while the incoming *grows out of it* through the signature spring — shrink-and-grow is the whole sentence, exactly as the owner phrased it. It keeps everything two audits proved: the retarget-free transition structure, the squash/plush/star-pop accents, the 800ms spring that "look to how our animation was previously" points at, the T3-W10 filter/visibility economics. And it satisfies §2 by construction: the big scale ride lives on the in-viewBox `.warp` group (vector-crisp every frame); only the ±8% accents touch the CSS layer. Its overlapped crossfade never empties the stage. The Hinge is the purer paper metaphor, but it buys that purity with the W10 failure class, degenerate-sliver wobble risk, and re-click machinery — the Bloom is the storybook told in this house's grammar.

**Owner-taste checkpoints for the prototype:** (1) the wring-down's `-15deg` twist — if it reads as residual whirl, drop to `-8deg`; (2) overshoot 1.08 vs the spring's natural ~1.06 at these params — tune by eye; (3) the §2.4 wobble-at-small-scale call.

---

## 6. PRM variant

Unchanged from shipped — it survived both audits (`DarkModeToggle.vue:528-561`): theme flips at click, single 200ms opacity crossfade, `transform: none !important`, stars appear with the moon, boil frozen centrally. The warp adds one rule: `.toggle-icon .warp { transform: none !important; }` under the media query, and `handleToggle`'s existing `reducedMotion` early-return (:313) already suppresses the accents.

## 7. Implementation notes (for the W13 spec, not this lane)

- `<g class="warp">` wraps each icon's full content, **inside** the filtered `<svg>`; `transform-box: view-box; transform-origin: 100px 100px` (Hinge: `100px 190px`). The sun's existing `.sun-breathe` group nests inside it unchanged (its beat-stepped inline transform composes).
- The whirl's `visibility 0s linear 900ms` park delay (:392) re-derives to cover the wring-down (≥340ms; keep ~900ms — harmless, and the outgoing is `opacity: 0` from 340ms).
- `onGestureEnd`'s `plush-land` animationend contract (:330-334) carries over as-is; only the keyframe percentages shift.
- e2e: the shipped toggle specs assert `.is-active` classes, not transform values — the swap is test-transparent; add one visual assertion on the `.warp` rest pose.
