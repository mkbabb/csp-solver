# T8-W7 G2 — M17 / M18 offsets

Every number below is a `getBoundingClientRect()` read on the live surface, banked by
`measure.mjs` / `head.mjs` (playwright, headless chromium + webkit, dev server on 127.0.0.1).
BEFORE is HEAD (`e296915a`) measured through the same instrument, with HEAD's three superseded
declarations re-injected verbatim — the tree's diff touches exactly those, so the two columns
differ by the cure and nothing else. Raw rows: `offsets-before.json`, `offsets-after.json`,
`head-before.json`, `head-after.json`, `head-ablation.json`.

## M17 — the head line

The badge's box top against the celestial's, across the width ladder. Playing view, dark; the
gallery rows and the light rows are in the raw files and agree to the pixel (the badge has no
mount in the gallery below 768 — see the exception below).

| width | `--toggle-size` | `--head-rule` | badge top BEFORE | toggle top BEFORE | badge top AFTER | toggle top AFTER |
|---|---|---|---|---|---|---|
| 320 | 4rem | `0px` | 10.00 | 0.00 | 0.00 | 0.00 |
| 375 | 4rem | `0px` | 10.00 | 0.00 | 0.00 | 0.00 |
| 390 | 4rem | `0px` | 10.00 | 0.00 | 0.00 | 0.00 |
| 480 | 4rem | `0px` | 10.00 | 0.00 | 0.00 | 0.00 |
| 481 | 5rem | `calc(0.75rem + 0px)` | 18.00 | 0.00 | 12.00 | 12.00 |
| 767 | 5rem | `calc(0.75rem + 0px)` | 18.00 | 0.00 | 12.00 | 12.00 |
| 768 | 5rem | `calc(0.75rem + 0px)` | 20.13 | 0.00 | 12.00 | 12.00 |
| 1023 | 5rem | `calc(0.75rem + 0px)` | 20.13 | 0.00 | 12.00 | 12.00 |
| 1024 | 13rem | `calc(0.75rem + 0px)` | 84.13 | 0.00 | 12.00 | 12.00 |
| 1280 | 13rem | `calc(0.75rem + 0px)` | 84.13 | 0.00 | 12.00 | 12.00 |
| 1440 | 13rem | `calc(0.75rem + 0px)` | 84.13 | 0.00 | 12.00 | 12.00 |
| 1920 | 13rem | `calc(0.75rem + 0px)` | 84.13 | 0.00 | 12.00 | 12.00 |

BEFORE the two boxes agree on a CENTRE at every rung (32.00 / 40.00 / 104.00) and on no top at
all; AFTER they agree on a TOP at every rung and the centres part (badge 31.88 against the
celestial's 116.00 on the desk — a 20px badge and a 208px sun cannot share both). The mark asks
for the top. webkit reads every top in this table to the pixel; the only engine difference
anywhere in the head is its badge box, 0.12px shorter, which shows up as a pre-cure centre of
103.88 against chromium's 104.00.

### The mobile arm, and why the rule is 0 there

At <=480 the wordmark button and the toggle share an x-column, so their vertical separation is
the whole hit-target clearance. The ablation forces the desk value at that rung:

| width | shared column | wordmark/toggle overlap SHIPPED | forced to 0.75rem | badge bottom -> wordmark top SHIPPED | forced |
|---|---|---|---|---|---|
| 320 | 24.17 | -31.91 | -19.91 | 51.91 | 39.91 |
| 375 | 13.36 | 0.06 | 12.06 | 19.94 | 7.94 |
| 390 | 5.86 | 7.58 | 19.58 | 12.42 | 0.42 |
| 480 | -39.14 | 52.67 | 64.00 | -32.67 | -44.67 |

webkit: 375 reads -0.23 shipped against 11.77 forced, 390 reads 7.28 against 19.28. The
celestial does not move at this rung (`top: 0` was already its pose), so every shipped figure
is byte-for-byte the pre-M17 one; the badge comes up 10.00 -> 0.00, which BUYS the badge/wordmark
pair 10px at every width.

**The one exception, stated rather than cured:** below 768 the badge has no mount in the gallery
— `AttributionCard mobile` is `v-show="view === 'playing'"` (T6 mark 7). There is no line to
break there because there is only one mark; changing that is a design decision beyond M17.

## M18 — the board rule

Desk rows, both engines, both themes (light and dark are identical to the pixel — the layout has
no theme term; only the light rows are printed).

**gap** = board top minus masthead bottom · **dx** = board left minus masthead left ·
**cardDy** = card top minus board top


### chromium · 1280

| game | board h | card h | gap BEFORE | gap AFTER | dx AFTER | cardDy BEFORE | cardDy AFTER |
|---|---|---|---|---|---|---|---|
| sudoku | 640.00 | 608.00 | 0.00 | 0.00 | 0.00 | 16.00 | 16.00 |
| futoshiki | 640.00 | 608.00 | 0.00 | 0.00 | 0.00 | 16.00 | 16.00 |
| thermo | 640.00 | 608.00 | 0.00 | 0.00 | 0.00 | 16.00 | 16.00 |
| killer | 640.00 | 608.00 | 0.00 | 0.00 | 0.00 | 16.00 | 16.00 |
| kenken | 416.00 | 608.00 | 96.00 | 0.00 | 0.00 | -96.00 | 0.00 |

### chromium · 1440

| game | board h | card h | gap BEFORE | gap AFTER | dx AFTER | cardDy BEFORE | cardDy AFTER |
|---|---|---|---|---|---|---|---|
| sudoku | 672.00 | 640.00 | 0.00 | 0.00 | 0.00 | 16.00 | 16.00 |
| futoshiki | 672.00 | 640.00 | 0.00 | 0.00 | 0.00 | 16.00 | 16.00 |
| thermo | 672.00 | 640.00 | 0.00 | 0.00 | 0.00 | 16.00 | 16.00 |
| killer | 672.00 | 640.00 | 0.00 | 0.00 | 0.00 | 16.00 | 16.00 |
| kenken | 416.00 | 640.00 | 112.00 | 0.00 | 0.00 | -112.00 | 0.00 |

### webkit · 1280

| game | board h | card h | gap BEFORE | gap AFTER | dx AFTER | cardDy BEFORE | cardDy AFTER |
|---|---|---|---|---|---|---|---|
| sudoku | 640.00 | 608.00 | (chromium) | 0.00 | 0.00 | (chromium) | 16.00 |
| futoshiki | 640.00 | 608.00 | (chromium) | 0.00 | 0.00 | (chromium) | 16.00 |
| thermo | 640.00 | 608.00 | (chromium) | 0.00 | 0.00 | (chromium) | 16.00 |
| killer | 640.00 | 608.00 | (chromium) | 0.00 | 0.00 | (chromium) | 16.00 |
| kenken | 416.00 | 608.00 | (chromium) | 0.00 | 0.00 | (chromium) | 0.00 |

### webkit · 1440

| game | board h | card h | gap BEFORE | gap AFTER | dx AFTER | cardDy BEFORE | cardDy AFTER |
|---|---|---|---|---|---|---|---|
| sudoku | 672.00 | 640.00 | (chromium) | 0.00 | 0.00 | (chromium) | 16.00 |
| futoshiki | 672.00 | 640.00 | (chromium) | 0.00 | 0.00 | (chromium) | 16.00 |
| thermo | 672.00 | 640.00 | (chromium) | 0.00 | 0.00 | (chromium) | 16.00 |
| killer | 672.00 | 640.00 | (chromium) | 0.00 | 0.00 | (chromium) | 16.00 |
| kenken | 416.00 | 640.00 | (chromium) | 0.00 | 0.00 | (chromium) | 0.00 |

BEFORE is measured in chromium only; the cure is a single `align-self` and webkit's AFTER
column reproduces chromium's to within its own 0.29px masthead-height difference, so a second
BEFORE engine buys nothing the AFTER column does not already show.

## Mobile — nothing moved

390x664, five games, both themes, both engines: gap 0.00, board left 12.00, `pageVh` 1.000,
board centred (masthead left runs 33.81 to 92.56 with the game's name length, which is what
centring means). Identical BEFORE and AFTER — the board rule is scoped `min-width: 1024px` and
the head rule resolves to the same 0 it shipped with.

## The gate

`e2e/masthead-alignment.spec.ts` — 8 rows, both engines: the head line at 1280/1440/390 in both
themes, the board rule over all five games at both desk rungs. Each row re-injects the superseded
declaration and requires the same assertions to FAIL against it. Ablated at the SOURCE as well
(both cures reverted in `App.vue` and `scene.css`): 4/4 red, cure restored, 8/8 green.
`e2e/mobile-platform.spec.ts`'s notch row is updated to follow the safe-area term to its new
home — it now asserts the term on `--head-rule` and BOTH corners' consumption of it, where it
used to ask only for `padding-top` on `.corner-right`. Ablated one arm (the left corner's
`padding-left`) to prove the strengthened row still bites: red, restored, green.

## The shots

`shots/` — chromium, dev server, pixel-settled (two identical frames, so the wordmark bake has
landed). The m9 case is `kenken-1280-{light,dark}-{BEFORE,AFTER}.png`: 96px of dead paper under
the title, gone. The m8 case is `head-sudoku-1280-light-{BEFORE,AFTER}.png`. Mobile centring is
unregressed in `killer-390-dark-AFTER.png`; the head line holds over the deck in
`gallery-1280-dark-AFTER.png`.

**Seen while shooting, NOT this lane's to cure:** the wordmark paints CLIPPED for the first
frames after every mount ("sudok", "kenke") and completes when the bake lands — reproduced in
the built `dist/` as well as on the dev server, so it is not a dev artifact. `HandwrittenLogo`
internals are fenced away from this lane (T8-W4's ground). Filed to the chair.
