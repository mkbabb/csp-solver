# census:info — T9-M16 "The 'i' button clicking does not properly scroll the panel"

Main tree `1e6cfbbf`, served read-only on 127.0.0.1:4251 (vite dev, private cacheDir under
`web/frontend/.owner-intake/info/`), killed by recorded PID (67878 listener, 67823 npx) after
the run. Instruments: `probe/probe-desk.mjs`, `probe/probe-coarse.mjs`, `probe/probe-cf-shot.mjs`.
Per-frame JSON is summarised here, not banked.

## Numbers first

**The "i" the owner pressed** is `GameControlPanel`'s `.info-btn` (aria-label "what the keys
do"), the trailing edge of the rail's action bar. It's the same strip as frame m18. It opens the
key crib `#keys-fold`. `AttributionCard` isn't an "i": its trigger is the `@mbabb` text button.

**Reproduced in 24 of 24 desk cells** (chromium and webkit · 1280×800, 1440×900, 1280×720 ·
card scrolled to the top or the end · real pointer click or keyboard Enter · light). Theme
doesn't matter: dark 1280×800 gives the same numbers in both engines. After the press, 1.5 s
later:

| engine · viewport | maxScroll before → after | scrollTop after (from top / from end) | crib `<dl>` h | crib visible | crib under the bar |
|---|---|---|---|---|---|
| chromium · 1280×800 | 534 → 636 | 534 / 534 | 93.80 | 0.13 px (0.001) | 93.67 px |
| chromium · 1440×900 | 504 → 608 | 504 / 504 | 95.73 | 0.19 px (0.002) | 95.55 px |
| chromium · 1280×720 | 614 → 716 | 614 / 614 | 93.80 | 0.13 px (0.001) | 93.67 px |
| webkit · 1280×800 | 535 → 641 | 535 / 535 | 97.80 | 0.16 px (0.002) | 97.64 px |
| webkit · 1440×900 | 505 → 612 | 505 / 505 | 99.67 | 0.36 px (0.004) | 99.31 px |
| webkit · 1280×720 | 615 → 721 | 615 / 615 | 97.80 | 0.16 px (0.002) | 97.64 px |

- `scrollIntoView` runs **exactly once per press** (hooked in every cell). At call time the
  target `#keys-fold` is **0.00 px tall** in all 24 cells.
- The scroll always lands on the **old** `maxScroll`. What's left over equals the fold's opened
  height: 101.8 / 103.7 px in chromium, 105.8 / 107.7 px in webkit. The crib's top edge sits on
  the bar's top edge (627.52 vs 627.64 at chromium 1280×800), so the whole `<dl>` is painted
  under the opaque sticky bar (z 60) and its skirt.
- Timing: the fold opens in 175–206 ms. From the top, the smooth scroll settles at
  364–406 ms in chromium and 207–239 ms in webkit, and stops at the old end. From the end, it
  doesn't move at all (Δ 0).
- **Ablation 1, PRM** (`reducedMotion: 'reduce'` makes `.legend-fold` `transition: none`): the
  target is already full height when `scrollIntoView` is called (101.8 / 105.8). scrollTop goes
  to the new max (636 / 641) and the crib is **1.000 visible, 0 px under the bar, in both
  engines**. So the only cause is the fold's transition.
- **Ablation 2, counterfactual**: the same `scrollIntoView({block:"nearest"})`, issued again
  after the 200 ms fold has settled, gives st 534→636 in chromium and 535→641 in webkit. The
  crib is 1.000 visible and its bottom sits 8 px above the bar (crop c3).
- **Coarse**:
  - At 390×844 `hasTouch` (dock, sheet open and settled), both engines have `.info-btn`
    nodes 0, `#keys-fold` 0 and `.keyboard-legend` 0. The strip reads "clear fill solve share".
    The phone has no "i".
  - On the coarse rail (1280×800 `hasTouch`), the `.info-btn` node exists with `display: none`,
    and the legend has `display: none`.
  - The `@mbabb` tap on the dock opens its card at 44–195 px (inside 390×844), and the panel's
    scrollTop stays 0. It isn't a panel scroll.

## The mechanism (file:line)

1. `web/frontend/src/games/shared/GameControlPanel.vue:148-156`: `toggleKeys()` flips
   `keysOpen` and, on `nextTick`, calls
   `#keys-fold.scrollIntoView({ block: "nearest", behavior: "smooth" })` (`:154`). `nextTick`
   is the DOM patch and nothing more. The class `is-open` is on, but the box is still at its
   `0fr` start.
2. `GameControlPanel.vue:2287-2296`: `.legend-fold` animates `grid-template-rows 0fr → 1fr`
   over 200 ms `--ease-drawOn`. So the scroll is aimed at a **zero-height** box and resolves
   against the **pre-growth** scroll range. A smooth scroll's destination is fixed at call time,
   and nothing re-aims it while the fold grows the range by about 102–108 px.
3. `GameControlPanel.vue:1219-1227` + `:1245` + `:2181-2194`: the fold is the last in-flow
   child before `.action-bar`, which is `position: sticky; bottom: 0; z-index: 60` and opaque.
   The growth therefore lands directly under the bar. `scroll-padding-bottom` (121 px =
   `--action-bar-h`, `scene.css:264`) is honoured, but the box it was honoured for is 0 px tall.
4. The comment at `:145-146` says "the fold rides into the scrollport as it opens". Measured,
   that's false in 24/24 cells. The PRM arm (`:2302-2306`, `transition: none`) is the only pose
   where it's true.

The defect sentence: **the scroll is issued once, before the thing it scrolls to has a
height, against a range that is about to grow, and what grows goes under an opaque sticky bar.**
The owner sees the "i" ring darken (aria-expanded true) and nothing else change. In webkit the
scrollbar thumb even reads "at the end" (c2).

## Crops (≤150 KB, pngquant)

- `c1-chromium-light-1280x800-fine-after-press.png` (chromium · light · 1280×800 · fine): the
  press lands, the ring darkens, and no crib is visible. It's the owner's m18 pose.
- `c2-webkit-light-1280x800-fine-after-press.png` (webkit · light · 1280×800 · fine): pressed
  from the top. The scroll ran to the old end, the thumb is at the bottom, and there's no crib.
- `c3-chromium-light-1280x800-fine-counterfactual-scroll-after-settle.png` (chromium · light ·
  1280×800 · fine): the same call issued after the settle. The crib (K/G/H/P/D/⌘Z/⇧⌘Z) is whole
  and 8 px above the bar.
- `c4-webkit-light-390x844-coarse-dock-open-no-i.png` (webkit · light · 390×844 · coarse
  `hasTouch`): the dock sheet is open and the strip has no "i".

## The design half (for pass-5 charter rows; nothing here retires M16, U-10)

- **Where the crib lives.** It belongs to the strip that holds its "i", not to the scroll
  content above that strip. Under T9-B8's firing default the bar MOVES to `#card-foot` (chair
  pass-4 §3). If the crib stays in the scrolling body while the "i" moves to a non-scrolling
  foot, the defect survives the move, because the crib is still at the scroll end behind the
  foot. So the charter row is: **the crib opens inside the foot, above the verbs, within the
  same drawn edge M18 asks for.** The foot grows and the scrollport shrinks by the crib's
  height, so the reader's eye never leaves the "i" and **no scroll is needed**. That makes M16
  a property of placement rather than a timing patch. Constraints that must hold, measured
  against the HEAD control:
  - The fold stays in flow and is clipped by `clip-path`, never `overflow: hidden`, never
    `display: none` (a11y 3.4 `innerText` in webkit, `:1210-1218`).
  - Its max-content still sizes the rail (card 324.22 chromium / board-left identity, π).
  - The foot's `padding-bottom: max(pad, env(safe-area-inset-bottom))` rule (§6.1) applies.
  - The crib must not cover any live control. `.action-bar` is z 60, so an out-of-flow layer
    is what CTRL-RULE's ribbon did (4 controls at 1.000). In flow is the only lawful form.
- **If the crib stays in the scroll body** (the minimum cure, the fallback): scroll **after**
  the fold's `transitionend` (filtered to `grid-template-rows`), or on the same frame aim at the
  fold's *final* height (`firstElementChild.scrollHeight`). Keep the PRM arm instant. The
  counterfactual (c3) is the acceptance shape: crib visible 1.000, bottom at least 0 px above
  the bar top, both engines, from the top and from the end, pointer and Enter.
- **Motion law.** An open-then-scroll that reads as two moves (the grow, then a 102 px jump)
  isn't a defined animation under M09. Either the crib grows where the eye already is (foot
  form, one move) or scroll and grow share one clock. PRM stays a cut.
- **Coarse.** The phone and the coarse rail have no "i" by design (the legend is keyboard
  shortcuts; `:1328-1331`, `:2308-2325`). M16 is a desk mark. Whether a touch reader gets an
  "i" at all is not in the owner's words, and it's not proposed here.
- **Row owners.** The §10 leader CTRL-FACE and the B8-default carrier (the `#card-foot` move,
  CTRL-TAPE/RULE's form) take the placement row. MOT-VERB/MOT-LADDER take the one-clock motion
  row. The e2e row is born RED on main: press the "i" at 1280×800 in both engines, from the top
  and from the end, and require crib visible ≥ 0.99. On main it reads 0.001–0.004.

## Gaps

- The dev server only (vite). No `dist` / preview read. The mechanism is script and CSS, so the
  build shouldn't change it, but that's unmeasured.
- No real Safari or iOS device (M19: no osascript). Playwright WebKit only.
- Webkit contexts on this server reloaded the page once shortly after load in 3 of about 18
  first attempts ("Execution context was destroyed"; the main frame navigated to `/` twice).
  Retries were clean and every number above is from a clean run. The cause wasn't investigated.
  It isn't this mark's subject, and it may be a dev-server artifact.
- The dock crop shows the dev-only FilterTuner `fx` FAB overlapping `share`. It's
  DEV-gated and absent from production, and not counted as a finding.
- `scene.css:264` `var(--action-bar-h, 0px)` is a var() fallback on a measured token (against
  the @property law). It's pre-existing and noted for CTRL-TAPE's registration block, not
  measured here.
- The foot-form crib is a design row, not a prototype. Its π cost (card width, board-left) is
  unmeasured.
