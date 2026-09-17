# A4-REFUTE — adversarial re-derivation of lane A4 (THE DRAWER'S JANK, M02)

T9-W8 §8.1. 2026-09-17, HEAD `7b0610cc` (working tree at `58014efd` + the CI cure; no source
touched, no rebuild). I did not write lane A4. Nothing under `web/frontend/src` was edited.

## Build identity — bracketing every reading

```
BEFORE  AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB · newest mtime 2026-09-17T17:53:45.987Z
BEFORE  AUDIT: build-identity — http://127.0.0.1:4257 serves the same entry (index-9rZPzI5DEcpe.js)
AFTER   AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB · newest mtime 2026-09-17T17:53:45.987Z
AFTER   AUDIT: build-identity — http://127.0.0.1:4257 serves the same entry (index-9rZPzI5DEcpe.js)
```

Byte-identical, and identical to the chair's pre-launch line and to lane A4's own bracket. No
lane rebuilt under this one.

**PORT**: assigned 4258, which was already held by a sibling lane (`lsof` showed 4252/4255/4256/
4258/4259/4260 LISTEN). Per the charter's "next free in the band", readings were taken on
**4257**, `--strictPort`, `--host 127.0.0.1`, killed on exit. Never :3000/:3001.

Board-ready: the wave's one definition, selector resolved as lane A4 resolved it
(`.board-cells .game-cell` — a bare `.cell` matches nothing on this estate). Regimes as charter.
Real Safari and real iOS absent (M19); no webkit number here is a Safari number or an iOS claim,
and webkit's per-subsystem ms are NOT MEASURED (no `longtask`, no trace).

## What was re-run, and at what load

`raw/loadavg.txt` banks the 1-minute load at every set. The session ran 10.54 → 3.53 → 5.73.
The findings were re-taken in the quiet window (load 3.5–5.3), not only under contention.

| lane instrument, re-run as banked | result |
| --- | --- |
| `gesture-geometry.mjs --engine chromium --regime mobile` | ran; 459.16 px close jump reproduced **exactly**, 2/2 cycles |
| `gesture-geometry.mjs --engine webkit --regime mobile` | ran; 458.85 px reproduced **exactly**, 2/2 cycles |
| `drawer-trace.mjs --engine chromium --regime mobile --cpu 4 --cycles 3` | ran; every onset/settle figure inside the lane's spread |
| `drawer-trace.mjs --engine chromium --regime mobile --cpu 6 --cycles 3` ×3 page loads | ran; first-gesture defect reproduced 3/3 at load 3.5–5.1 |
| `drawer-trace.mjs --engine webkit --regime mobile --cycles 3` | ran; long33 0, p50 17, trace correctly absent |
| `onset-ablate.mjs --regime mobile --cpu 4` | ran; DOM census exact, all four arms inside spread |

Every banked instrument ran as documented. None was VOID for un-rerunnability.

## What I added (the refuter's own instruments)

| file | what it asks | run |
| --- | --- | --- |
| `tongue-visible.mjs` | Lane A4's headline is a 459.16 px single-frame rect jump. A jump is a defect only if the eye can see it. This hit-tests `document.elementFromPoint` at the tongue's centre and 12px inside each corner, once per rAF, and reports how many frames the tongue was actually topmost, wholly occluded, and how long until it became topmost after the berth swap. | `node tongue-visible.mjs --engine chromium --port 4257 --cycles 2 --out raw/x.jsonl` |
| `vacated.mjs` | The same window from the other side: what paints at the spot the tongue LEFT, and where the sheet's top edge is, per frame. | `node vacated.mjs --engine chromium --port 4257 --cycles 1` |
| `loadpath.mjs` | LENS 3. Traces navigationStart → board-ready and asks whether any drawer suspect is on the board-ready path at all: the estate's presence/classes/`inert` at board-ready, main-thread recalc/layout/paint/raster before vs after the mark, and the longtask census before it. | `node loadpath.mjs --cpu 4 --port 4257 --out raw/x.jsonl` |

## The two things that did not hold

**1. The 459 px is a rect delta, not a visible flight.** On the mobile CLOSE the tongue's rect
moves (342,124) → (286,579.7) in one frame — reproduced to the pixel on both engines. But it
lands *under the still-risen sheet*: `hitsAfter` at the berth frame is the sheet's own content
(`ctrl-btn`, `zone-row`, `ctrl-options`, `control-panel-wrap mobile-control-panel`) at all five
probe points, and the tongue is wholly occluded for 11–12 frames on chromium and 5–6 on webkit —
**≈100 ms in both engines** — before it becomes topmost. `vacated.mjs` shows the other half: the
spot the tongue left is `board-group` from frame 1 onward. Opacity is 1 and `visibility` is
`visible` throughout, so the lane's instrument (rect + computed `visibility`) could not see the
occlusion. What the eye gets is a **disappearance and a delayed reveal ~100 ms later**, not an
object crossing half the viewport. The OPEN is the direction with a genuinely visible jump:
157.2 / 158.2 px chromium, 130.5 / 136.1 px webkit, tongue topmost 5/5 before AND after.

**2. Nothing in this lane is on the board-ready critical path.** At board-ready the drawer estate
is already mounted and settled — `drawerTabPresent: true`, `htmlClass: "drawer-closed"`,
`gridInert: false`, sheet `visibility: hidden`, 182 of 1087 doc nodes. The two longtasks before
board-ready (196 ms + 52 ms at 4×; 298 ms + 85 ms at 6×) are bootstrap, not drawer work. The
gesture itself begins ~400 ms *after* the mark. Every suspect in this lane happens after
board-ready and therefore cannot delay it. The one drawer fact that IS on the load path is the
opposite of a defect: the sheet is `visibility: hidden` at board-ready, so its 182 nodes cost
style and layout but **not raster** before the mark — which is exactly why gesture one pays
(97 Paint / 102 RasterTask at cycle 0 against 12 / 22 later, my run). Pre-warming the sheet
would move that cost back onto the board-ready path; it is lawful under M09 but it is a trade,
not a free win, and W7/8.2 should size it before taking it.

## Numbers of the lane's that did not reproduce (context, not findings)

- **board-ready at 6× mobile**: lane reports 1054.1 ms (matrix, its load 3.3) and 981.7–1169.2 ms
  (first-gesture set, its load 8.6–9.5). Same instrument, my load 3.5–5.1: **708.1 / 717.3 /
  717.7 ms** — ~32 % below the lane's quietest figure. ADJUST the lane's 6× board-ready down.
- The lane's `boardReadyDefinition` quotes "chromium mobile … 498.4–558.0 ms (4×)". **498.4 appears
  in neither `raw/summary.txt` nor `raw/readings.jsonl`**; the summary's 4× rows are 736.3 and
  409.1–558.0. Mine: 553.3 / 590.9 ms. The quoted lower bound is unsourced.
- 4× board-ready and every gesture figure are otherwise inside the lane's own spread.

## Where the lane was right, and strongly

The mechanism attribution is sound and reproduces cleanly. `inert` on `.board-cells` really is
the largest single restyle in the onset (599–665 elements against a 62–66 control, 6.2–8.1 ms at
4×), it really does land on the close SETTLE frame (912–979 elements, **raster exactly 0** — pure
style recalc, in the one frame whose contract is to do nothing), the DOM census is exact to the
node (414 / 81 / 937), the first gesture at 6× really is the only window that drops a frame
(3/3 runs, worst 41.9 / 57.9 / 50.2 ms, long50 2/3), and the backdrop-filter question really does
answer zero — `grep -rn backdrop-filter web/frontend/src` → 0 hits, and the single dist
occurrence is Tailwind's `.transition` property LIST, not a declared value.
