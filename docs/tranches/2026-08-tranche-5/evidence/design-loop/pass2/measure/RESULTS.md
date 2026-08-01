# MEASURE — design-loop pass 2, device results

Run 2026-07-31 06:03–06:34 local, one process, sequential, quiet box.
Raw JSONL: `measure/rig/runs/<runId>.jsonl` · fold with `node measure/rig/fold.mjs <runId…>`.

## 0 · Rig, and what the rig could not do

**The screen was LOCKED for the whole session** (`ioreg -n Root -d1 -a` →
`CGSSessionScreenIsLocked = true`). Consequences, recorded up front because three requested rows
depend on them:

- **No desktop GUI Safari, and therefore no Web Inspector timeline.** Every "paint count / raster
  area / idle paints = 0" threshold in the requests is **NOT MEASURABLE this pass**. Where a
  threshold asked for paints, the substitute is stated inline and labelled: rAF inter-frame gaps
  (a jank detector, not a painter census) and `MutationObserver` counters on the specific
  attributes a re-bake would have to touch (`d`, `transform`, `points`, `style`).
- The Simulator itself is unaffected by the lock — `simctl openurl`, `simctl io screenshot` and
  `simctl io recordVideo` all work, and MobileSafari kept focus (`hadFocus: true`,
  `visibility: "visible"`, `tainted: false` on every run).

**Devices**
- `perf-rig-iphone16` `1B3EB33C-9F51-4D70-B994-E35877EB65E8` — MobileSafari, iOS 19.0, viewport
  **393×699**, dpr 3, `pointer: coarse`, `hover: none`. Booted at start, shut down at exit.
- **`iPad Pro 13-inch (M4)` `751EA9FC-ADFB-45BA-9C03-284D30BAD57E` — added, and this is a
  deviation.** Lane C M1 and lane B G1/G6 all live in the `≥lg` drawer regime, and the iPhone
  never enters it: at 393px there is no `.drawer-tab` and no glide, the control card is a static
  below-fold section. The iPad in portrait is **1032×1248, dpr 2, `pointer: coarse`** — over the
  1024 `lg` breakpoint, real WebKit, real touch. Booted for those cells only, shut down at exit.
  It is portrait, not the landscape the requests name: rotating a sim needs GUI menu scripting,
  which the lock forecloses.

**Servers.** `measure/rig/mserver.mjs` is a copy of `perf-rig/probe-server.mjs` with one added
route (`/__ev/<file>`, so measurement scripts arrive over HTTP instead of the URL — `simctl
openurl` silently truncates a long query, which cost the first run of the session). Its probe is a
copy of `perf-rig/probe.js` with two added scenarios, `evalQ` and `actQ`. Runs land in
`measure/rig/runs`, a separate ledger. **`:4894` and `:4895` were neither touched nor restarted.**
Ports: `:4896` lane A, `:4897` lane B, `:4898` lane C. Each base cell was served **on the lane's
own port**, swapped in place, adjacent in time to the lane's own cells.

**Base dists.** Two, and they are not interchangeable:
- `perf-rig/dist-baseline-BsqxBJD` — the instructed fps baseline cell (lane A, `:4896`).
- `pass2/dist-base` — shipped HEAD `32198688`. All three worktrees sit at that HEAD with
  uncommitted diffs, so this is the correct **negative control** for every lane's own gates.

**Not run, and why**
| row | reason |
|---|---|
| lane A M4 · blind read of the verb crops | needs uninstructed human readers; none in the loop |
| lane C M2 · pen-vs-type bake-off read | same — ≥4 cold readers. Device artifacts banked instead |
| lane B G6 · drawer glide, iPad **landscape** | portrait only; no GUI to rotate the sim |
| lane A M6 · 375×667 and 1440×900 | sim viewport is fixed; desktop Safari locked out |
| lane C M3 · 390×844 and 375×812 | same — measured at the sim's real 393×699 |
| every "paints/s", "raster area", "idle paints = 0" | Web Inspector unavailable (§0) |

---

## 1 · LANE A — `wf_6e1b18f4-0f2-1`, `:4896`

### M1 · the re-deal, on glass — **threshold met, and the premise it rested on is refuted**

| row | gestures | scroll px | deal-tap → board | first gesture → board |
|---|---:|---:|---:|---:|
| M1a drawer path | **3** | **442** | 263 ms | 1670 ms |
| M1b picker band | **3** | **0** | **101 ms** | 1671 / 1644 ms |
| negative control · drawer already open, in view | 2 | 33 | — | 1169 ms |

Threshold — *M1b must not be slower in wall-clock than M1a* — **met** (+1 ms, i.e. a tie).

The interesting part is not the tie. Lane A's headless finding was *3 taps vs 2*. **On device it is
3 vs 3.** Deal sits at absolute y **732** in a **699** viewport (`dealBelowFold: true`,
`doc.scrollHeight` 1196), so the drawer path's scroll is not optional — it is a gesture, and it is
**442 px** of one. The picker costs zero.

Honest caveats: both totals are instrumentation-bound (my scripted settles, ~1.25–1.66 s, exceed
the work), so **the total wall-clock does not discriminate** — the numbers that survive are the
442-vs-0 px scroll and the 263-vs-101 ms deal latency. And the negative control did what it was
asked to do: **with the drawer already open and in view, the drawer wins** (2 gestures, ~500 ms
less). The picker's case is about the everyday cold path, not the warm one.

### M2 · band paint cost — **threshold met; the negative control CANNOT FAIL, which is the finding**

Over five `ArrowRight` snaps, on glass:

- band `HandDrawnOutline` `<path d>` — **unchanged**, all 4 paths (`bandPathDChanged: false`)
- band box — **unmoved**, 385×175.9 at y 505.7 before and after (`bandBoxMoved: false`)
- mutations observed on `d`/`transform`/`points`: **0**. The 24 recorded mutations are all
  `childList` on `DIV`/`BUTTON` plus `style` on `BUTTON` — the band rebinding its content to the
  new active card, which is what it is for. **Zero stroke re-bake.**

**Negative control, `--staging-reserve: 0px` forced** (read back from the live element as `"0px"`,
so the ablation landed): the band's box is **byte-identical** — 385×175.9, same y — and `d` is
still unchanged. The reservation cannot move the box because the band's content already exceeds
the reserve at this width. ⇒ **`--staging-reserve` is decorative at 393px, the control is
vacuous, and M2's regen threshold is not a discriminator.** Lane A's own honest §3 finding is
confirmed on device rather than argued.

### M3 · coarse targets — **confirmed on glass**

Chips min **44.0×44.0** (`4×4` 52.8, `9×9` 52.8, `16×16` 72.0, `Easy` 62.4, `Medium` 81.6,
`Hard` 62.4 — all ×44.0). Verbs min **44.0×44.0** (`resume` 87.9×44, `deal` 65.8×44).
Thumb arc: both verbs' bottoms sit **29.4 px above the viewport bottom**, at the foot of the deck
column — verified, not assumed.

### M5 · the shipped WebKit carousel defect — **DOES NOT REPRODUCE on real MobileSafari**

| probe | headless WebKit (lane A) | real MobileSafari iOS 19 |
|---|---|---|
| `ArrowRight` ×4 from card 0 | lands card **2** | **1 → 2 → 3 → 4** |
| index at +400 / +1200 ms | reverts | **4 / 4** |
| `End` | 4, reverts to 2 within ~400 ms | **4, held at +400 / +1200 / +2200 ms** |
| picker opened while PLAYING kenken | centres **thermo** | **index 4**, live text `kenken, 5 of 5` |

Scroller agrees with the index: `scrollLeft` 1187 of a 1187 maximum. Caveat, stated plainly:
these are synthetic `KeyboardEvent`s (the sim has no hardware keyboard) and the native swipe was
not driven. On this evidence the defect is **Playwright-WebKit-specific**, and "open the picker on
your current game is broken for kenken on Safari" is not true of the shipped device.

### M6 · screens

`laneA/A-gallery-{sudoku,kenken}-{light,dark}.png`, 393×699 at dpr 3. The hairline work the mark-4
low-res hypothesis threatens — band frame stroke, chip scribble underlines, verb borders — renders
**crisp at 3×**; no low-res bite visible on the band.

### fps sanity — no regression

| | idle3s (3 windows) | deal (3 windows) |
|---|---|---|
| lane A | 60.40 / 58.43 / 59.84 | 56.87 / 57.42 / 55.08 |
| base `dist-baseline-BsqxBJD`, same port | 59.21 / 58.61 / 58.12 | 56.21 / 55.34 / 56.66 |

Instrument check: lane A's *playing-view* geometry is identical to base to the tenth of a pixel
(`mbw.sh` 617, ratio 1.711, min tap 43.3 both) — correct, since lane A only touches the gallery.

---

## 2 · LANE B — `wf_6e1b18f4-0f2-2`, `:4897`

### G1 · the card no longer scrolls — **met, on real WebKit, with a live negative control**

At **1032×1248 coarse** (iPad Pro 13, portrait):

| build | `.controls-card` scrollHeight − clientHeight |
|---|---:|
| lane B | **0** ✓ |
| `dist-base`, same device, same session | **495** |

The control fails loudly, so the instrument is on the right element. **Not** measured at 1024×768
or 1440×900 — desktop Safari is locked out; the tablet portrait cell is the substitute, and 495 is
outside the stated 448–486 band because the viewport is taller, not because the element moved.

### G2 · coarse tap targets — **Deal and peek pass, SEPARATION FAILS**

| target | measured (393×699) | threshold | |
|---|---|---|---|
| `.icon-btn.deal-btn` | **115.9 × 44.0** | ≥44×44 | ✓ |
| `.peek-hold-surface` | **353 × 46** | ≥44 tall | ✓ |
| `.ctrl-btn` height | **44.0**, every one | ≥28 | ✓ |
| `.ctrl-btn` neighbour gap | **1.6 px**, every row | **≥6 px** | ✗ |

The gap is 1.6 px in every row of every regime — same 1.6 px again at 1032×1248. This is the row
lane B named as most likely to fail a real thumb, and it does. Narrowest chip is `On` at
**31.3 × 44** (base: 43.3 wide).
Negative control ✓: `.ticket-label` renders as five non-button spans, 14–15 px tall — not tappable,
not tap targets.

### G3 · the mobile stack — **direction and magnitude confirmed**

| | `dist-base` | lane B | Δ | lane B predicted Δ |
|---|---:|---:|---:|---:|
| `scrollHeight / innerHeight` | 1.711 | **1.632** | −0.079 | −0.086 |
| board bottom → Deal | 286.8 | **266.7** | **−20.1 px** | −20.7 px |
| board top → Deal bottom | 651.8 | **627.0** | −24.8 | — |

Negative control returned the base numbers, not the lane's ⇒ correct build served. The absolute
1.714/1.800 pair is not reproducible here: the sim's Safari viewport is 393×699, not 390×664.

### G4 · THE KEYPAD — the row only the device could answer

- `visualViewport.height` **699 → 403**. Keypad band = **296 px**.
  Pass 1 assumed **336 px** without measuring; it is **40 px high**.
- **Negative control PASSES (it can fail):** the injected 7-item fixed tray, 346 px wide × 53 px
  tall, comes back **100 % occluded** (53 / 53 px under the band). ⇒ F3's `--vv-height` graft is
  necessary for a fixed tray; the tray ruling stands.
- Lane B ships nothing fixed — the only `position: fixed` box on the page is `.corner-right`.
- **But Deal does not fully clear the keypad.** At maximum scroll (`scrollY` 352,
  `documentElement.scrollHeight` 1433 with the keypad up) Deal's bottom is **411.9** against a band
  top of **403** ⇒ **clearance −8.9 px**. About 20 % of the 44 px button stays under the keypad and
  no further scroll exists. Nothing is *permanently* occluded in the layout sense — the card's
  bottom clears — but the expected answer "reachable by scroll" fails by 8.9 px on glass.
  Frame: `laneB/B-M1-sudoku3-easy-light.png` (ticket at rest; the keypad cell is in the JSONL).

### G5 · the font chimera — **confirmed on real glass at 3×, control included**

- Lane B's ticket: `Deal` renders in Fraunces, sentence case, clean and fully covered. The option
  labels `9×9 / Easy / Normal / Ask / Off` render in the **mono fallback**, plainly a different
  face — exactly as predicted for uncovered Fira Code.
- **Negative control `dist-base`** (`laneB/BASE-negctl-headings-light.png`): `SIZE`, `DIFFICULTY`,
  `NEW GAME`, `MARKS`, `CHECK`, `CANDIDATES` all show the **per-glyph split** — the leading
  S/D/N/M/C in inky Fraunces, every remaining glyph in a lighter system serif. It is visible
  without a loupe. **§0 of the dossier stands.**

### G6 · drawer glide, no distortion — **NOT RUN as specified**

Landscape ≥1024 was unreachable (no GUI to rotate the sim). The glide *was* exercised at 1032 px
on the base and lane-C builds during lane C's M1 cells — translate-only, `drawerLeft` 569 → 746,
height constant at 640, `.control-panel-filtered` mutations **0**, no shear recorded — but that is
not lane B's build, so **lane B's own glide poses are not captured**.

### G7 · paint cost — no threshold breach, one thing to look at

| | idle3s (3) | deal (3) | idle frames > 33 ms |
|---|---|---|---|
| lane B | 56.98 / 57.48 / 57.10 | 56.25 / 58.66 / 56.21 | **8 / 9 / 7** |
| base, `:4896` | 59.21 / 58.61 / 58.12 | 56.21 / 55.34 / 56.66 | 4 / 4 / 3 |

Mean idle −1.4 fps, and the idle long-frame count roughly **doubles**. No `>50 ms` frame in two of
three idle windows, so nothing here is a jank event — but lane B is the only lane whose idle
long-frame count moves against base, and the expectation was *no regression*.
Negative control ✓: the counts are non-zero everywhere, so the sampler is seeing the grid's boil.

---

## 3 · LANE C — prebuilt dists, `:4898`

### M1 · the settle on real WebKit — **T1 met and then retired; the upstream stall CONFIRMED**

iPad Pro 13, 1032×1248, coarse. Drawer closed → tap the pull-tab → 1.15 s of per-frame sampling.

| cell | build | worst inter-frame gap | gaps >100 ms | frames | `.control-panel-filtered` mutations |
|---|---|---:|---:|---:|---:|
| M1-a ×2 | `dist-f2type` | **276 / 279 ms** | 2 / 2 | 38 / 38 | 0 |
| M1-b ×2 | `dist-base` (control) | **274 / 283 ms** | 1 / 1 | 39 / 41 | 0 |
| M1-c | `f2type`, Reduce Motion ON | 276 ms | 1 | 50 | 0 |

- **T1 — f2type worst ≤ base worst + 0 ms: met.** Mean 277.5 vs 278.5 ⇒ **Δ = −1.0 ms**. The
  settle is free.
- **And, exactly as lane C instructed: base and f2type come back indistinguishable to within
  noise, so T1 is retired as a discriminator rather than passed.** The instrument is not blind —
  the f2type runs see **6** `.tray-well`s, base sees **0**.
- **T3 — Reduce Motion records zero tape animation: met.** `rm: true` verified on the device
  (`ReduceMotionEnabled` written into the sim, Safari restarted); `is-taping` observed in **0**
  frames across all six wells. The worst gap is unchanged at 276 ms — **the stall is not the tape.**
- **T2 — idle paints = 0: NOT MEASURABLE** (Web Inspector, §0). The rAF proxy over 3 s with the
  drawer open shows **no idle regression**: f2type 49.65 fps / worst 61 ms / 5 frames >50 ms
  against base 45.77 fps / worst 64 ms / **18** frames >50 ms.

**The standing finding is confirmed, and it is the campaign row.** A **~280 ms main-thread stall at
drawer-open reproduces on real WebKit, on BOTH builds.** Headless WebKit reported 339–538 ms with
variance that swamped the build difference; the real device reports **274–284 ms across four runs,
σ ≈ 4 ms**. It is upstream of every family in this loop — the FLIP's forced layout plus the
three-pass stroke filter, not anyone's content grammar. Chromium's worst on the same gesture was
31–154 ms.

### M3 · the coarse height gate on glass — **met**

393×699, `pointer: coarse`, MobileSafari:

| gate | `dist-base` | `dist-f2type` | Δ | lane C predicted |
|---|---:|---:|---:|---|
| `.mobile-board-width` scrollHeight | 617 | **585** | **−32 px** | −33 px |
| min coarse tap target | 43.3 | **44.0** | floor closed | 44.0 |
| `scrollHeight / innerHeight` | 1.711 | **1.665** | −0.046 | — |
| board top → Deal bottom | 651.8 | **627.0** | −24.8 | — |

f2type < base at every coarse cell measured. 390×844 and 375×812 were unreachable (fixed sim
viewport); 393×699 is the real device's own number and it lands on lane C's headless figure.

### M4 · the zone grammar inside the boiling frame — captured, not adjudicated

10 s of video, card open at rest, on the sim: `laneC/C-M4-card-at-rest-light.mp4` and
`-dark.mp4`. This is an owner question, not a threshold, and it is left to the owner.

### M5 · dark-theme tape — **it reads struck-through**

`laneC/C-TYPE-tape-dark.png`. On real glass in dark, the three zone tapes (`new game`, `pencils`,
`teacher's`) and `hold to peek` render as a pale translucent band carrying near-invisible
light-on-light text — the band reads as a **highlighter strike across the word**, not as tape
under it. The 8.96:1 ratio does not capture it; lane C predicted exactly this failure mode and
routed it correctly. Per lane C's own routing: `--sheet-washi-neutral`'s dark value, **Lane D,
estate-wide** — not this lane.

### M2 · the bake-off blind read — **NOT RUN** (needs cold human readers)

Device artifacts banked for a later read, `ask_stale` reached the way a player reaches it (tap Ask,
then write a digit into a cell):
`laneC/C-PEN-stale-light.png` · `laneC/C-TYPE-stale-light.png` · `laneC/C-BASE-stale-light.png`.
The TYPE build renders `board changed · Ask again` in the teacher's compartment; the PEN build
renders the drawn pen. No verdict is offered here — Q2 is the discriminator and Q2 needs a reader.

### fps sanity — no regression

| | idle3s (3) | deal (3) |
|---|---|---|
| `dist-f2type` | 58.88 / 57.52 / 57.83 | 56.40 / 59.46 / 56.37 |
| `dist-base`, same port, adjacent | 60.17 / 58.63 | 58.69 / 55.68 |

---

## 4 · Cross-lane, and the two controls that could not fail

1. **A ~280 ms WebKit main-thread stall at drawer-open is real, on-device, and build-independent.**
   It is the largest number produced this session by an order of magnitude and it belongs to none
   of the three lanes. T4-P1 row.
2. **Lane A M2's negative control cannot fail** (`--staging-reserve` is decorative at 393 px) ⇒ the
   band's zero-re-bake claim is true but untested by its own control.
3. **Lane C M1-b's negative control fails to discriminate** (base ≈ f2type to within 1 ms) ⇒ T1 is
   retired, honestly, rather than claimed.
4. Lane B G4's control **does** fail correctly (fixed tray 100 % occluded), and in doing so
   confirms both the tray ruling **and** an 8.9 px shortfall in lane B's own Deal clearance.
5. The keypad band is **296 px**, not the 336 px pass 1 assumed.
6. The font chimera is visible to the naked eye at 3× on both builds.
