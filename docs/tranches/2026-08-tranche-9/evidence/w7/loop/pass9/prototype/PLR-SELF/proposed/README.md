# PROPOSED to the ONE library · `edge-bands` clause `drawn` (the drawn-frame roster)

CHAIR-RULINGS pass 9 §7: a hand-drawn stroke frame floors B3 at its AUTHORED width × 0.9, read against the
authored reference, never `getComputedStyle`, and only at sites on a named roster that PLR-SELF lands in the
ONE library with plants. This is that roster, as a diff on homes v2 (`homes.diff` sha1 `1f70cfda`), for the
chair to fold or strike. It is NOT in this lane's bank: the bank carries homes v2 byte for byte.

- `edge-bands.drawn.diff` — `web/frontend/e2e/lib/edge-bands.mjs` + `edge-bands.d.mts`. `git apply --check`
  0 on homes v2 over `74a2b5d9` and on the WAVE union + `homes.on-WAVE.diff` (the two library files are
  byte-identical there). Its sha1, bytes and checks are in `../BANKED.txt`.

## What it adds

- `DRAWN_FRAMES` (frozen): `head-sheet` → `src/pencil/chrome/AttributionCard/HeadSheet.vue`, class
  `head-sheet-frame`, width **1.5**, **1** site (the one frame draws both head sheets: the @mbabb card and §11's
  lobby); `tray-well` → `src/games/shared/GameControlPanel.vue`, class `tray-well`, width **1.5**, **4** sites.
- `authoredStroke(name, {source?, fe?})`: reads the roster file, finds every `<HandDrawnOutline …>` open tag
  whose static `class` carries the roster class, and returns its `:stroke-width` literals and the reasons
  they break the pin (a width other than the roster's, or a site count other than the roster's).
- `fourBands(…, {drawn})`: B3's floor becomes the roster's width × `thickTol` (0.9 → **1.35**); clause
  **`drawn`** (new in `EDGE_CLAUSES`) reds a broken pin. A typed `thick` beside `drawn` throws (a lane-chosen
  parameter is refused, LAWS P8 §E). Off the roster, B3 keeps 2 × 0.9 = **1.80**.

## Plants (in the ONE `--self-test`, both themes, DPR 1 and 2)

| row | want | chromium (min depth · margin) | webkit |
|---|---|---|---|
| 1.5 px drawn frame at its authored floor | GREEN | 1.50 · +0.150 | 1.50–1.51 · +0.150/+0.160 |
| the same frame OFF the roster (the law's 1.80) | RED B3 | 1.50 · −0.300 | 1.50–1.51 · −0.300/−0.290 |
| 1.40 px (bound + ε, ε = 0.05) | GREEN | 1.40 · +0.050 | 1.40 · +0.050 |
| 1.30 px (bound − ε) | RED B3 | 1.30 · −0.050 | 1.29–1.30 · −0.060/−0.050 |
| 1 px | RED B3 | 1.00 · −0.350 | 1.00 · −0.350 |
| 0.55× (0.825 px) | RED B3 | 0.82–0.83 | 0.75–0.76 |
| the PIN: the source authors 1.4 | RED `drawn` | RED | RED |
| a typed `thick` beside `drawn` | REFUSED | REFUSED | REFUSED |

`--sabotage-battery`: `drawn` off → the self-test exits 3 (**BITES**: the pin row reads GREEN), both engines,
beside B0–B6 and `ownfill` (9/9 BITE). The DPR-2 rows and the exits are in `../readings/edge-*.log`.

## What it does not do

- It does not read a painted 1.40 px stroke as a defect: the ruling's floor is 1.35, and 1.40 clears it by
  0.05. What pins the house stroke at 1.5 is the SOURCE (the pin row), not the paint.
- The roster has no third entry. Every other drawn `HandDrawnOutline` (2.5 px DrawerTab, 3 px notes and
  gallery frames) keeps 1.80 until the chair names it.
