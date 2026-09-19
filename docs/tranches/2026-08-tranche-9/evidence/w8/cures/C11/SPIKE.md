# C11 — THE SPIKE, AND WHAT IT ANSWERED

Branch `w8/bake-c11-spike` off `e694cc8c` (the bake track's tip, C07b), kept for the record.
Margin declared before the first reading: `MARGIN.md` — 3× on wall AND on blocking, on BOTH
engines, plus a 400 ms absolute floor for restore blocking at chromium 4× mobile dpr 3.

Instrument `c11-spike.mjs` (this dir). Its bake-pricing half is `attribution/A1/bake-census.mjs`'s
in-page instrument, copied — the same `Blob`/`createObjectURL`/`drawImage`/`toBlob`/longtask/rAF
hooks, the same surface classification off the pose SVG's own bytes, the same board-ready
definition. Dropped from A1: the fetch/decode/getContext/createImageBitmap/toDataURL hooks
(this prices encodes, not freight). Added: the restore harness. Nav 1 lets the page bake and
writes every mounted pose's PNG to a store; nav 2 is the warm load, and at DOCUMENT START — before
the app's first module runs — the harness opens the store, reads every pose back, mints an
object URL for each and decodes each into an `<img>`. **Both paths are priced inside the same
page load, on the same clock, under the same throttle, competing for the same main thread**: the
app re-bakes exactly as it does today while the harness restores the same poses beside it. That
contention inflates both arms and flatters the bake.

Base arm served on :4252 —
`AUDIT: build-identity — dist entry index-DT3aGxCK2_YJ.js · index.html md5 71db526c330253b274d0895282c9134e · 43 files / 811.6 KB`.

## 1. THE HEAD-TO-HEAD (`SPIKE-TABLES.txt`, 5 windows per row)

Restore = `indexedDB.open` → one `getAll` → `createObjectURL` ×32 → `img.decode()` ×32, for the
whole stored set (both themes: 16 poses each). "blocking ≤" is an UPPER BOUND — every longtask
(chromium) or rAF gap > 33.4 ms (WebKit) overlapping the restore is charged to it, including the
app's own boot, which is running in that same window.

| engine · regime · store | restore wall | open · read · mint · decode | blocking ≤ | bake bill (Σ toBlob) | bake wall | ratios |
|---|---|---|---|---|---|---|
| chromium 4× · 390×844 dpr 3 · warm · **IDB Blob** | **190.4 ms** (182.0–231.6) | 5.0 · 4.5 · 6.2 · 175.7 | 121.0 | 9,927.5 ms (boot-16: 9,132.5) | 3,653.3 ms | **19.2× wall · 75.5× blocking** |
| webkit · 390×844 dpr 3 · unthrottled · on-disk profile · **IDB Blob** | **97.0 ms** (77–101) | 9 · 59 · 0 · 28 | 87.0 | 1,155.0 ms (boot-16: 1,040) | 5,414.0 ms | **55.8× wall · 12.0× blocking** |
| chromium 4× · same · **IDB bytes** | 948.6 ms | 4.6 · **904.4** · 15.8 · 24.6 | 731.0 | 10,448.8 ms | 3,644.0 ms | 3.8× wall · 13.2× blocking |
| webkit · same · **IDB bytes** | 21.0 ms | 1 · 6 · 0 · 18 | 2.0 | 1,153.0 ms | 5,419.0 ms | 258× wall · 510× blocking |

Stored set: 32 poses · **2,098,690 B** chromium (995,045 light + 1,103,645 dark), **1,202,690 B**
WebKit (its grid is 728² under the licensed DPR cap, chromium's 1092²). Quota reported:
10.7 GB chromium, 20.6 GB WebKit on-disk (1.0 GB ephemeral). `persisted()` false in both.
Write cost, off the critical window: fetch-back 15.5–20.2 ms + put 1.2–4.3 ms (chromium),
6 ms + 13–15 ms (WebKit).

**The margin is cleared on every line**: 19.2×/75.5× and 55.8×/12.0× against a 3× bar, and
121 ms of upper-bound blocking against a 400 ms floor.

## 2. THE STORE IS A CHOICE, AND THE CONTROL PROVED IT (`raw/store-probe.txt`)

`wk-store-probe.mjs` writes a 256 KiB payload three ways and reads it back after one navigation
and in a second page, under an ephemeral context and under a real on-disk profile:

| engine · profile | IDB Blob | IDB bytes | Cache Storage |
|---|---|---|---|
| webkit · ephemeral | **put fails** — "Error preparing Blob/File data to be stored in object store" | survives | put reports ok, **entries gone after one navigation** |
| webkit · on-disk | survives | survives | **put does not take at all** (0 entries immediately) |
| chromium · ephemeral | survives | survives | survives |
| chromium · on-disk | survives | survives | survives |

So: Cache Storage is not a store on this WebKit, in either profile — it is out. A Blob row is a
HANDLE (chromium reads 2.1 MB back in 4.5 ms); a byte row is structure-cloned into the page's
heap (the same payload costs 904.4 ms at chromium 4×). The cure therefore writes **Blobs, with a
byte fallback the session latches if an engine refuses them** — which is exactly the WebKit
ephemeral case, and where bytes cost 6 ms.

A Playwright context is ephemeral; a real browser profile is not. The WebKit Blob failure is an
instrument artifact, and the control above is what says so rather than an assertion.

## 3. STALENESS — WHAT THE IDENTITY MUST CARRY, AND WHAT IT DOES

Read off the measurements, not reasoned: the same pose's PNG is **225,018 B** on chromium and
**113,406 B** on WebKit (different box, different encoder); light and dark differ (201,418 vs
228,616 B); the box and DPR set the raster outright. So a stored pose is only safe under
`build | agent | cacheKey | dpr | WxH | poseCount`, and the cure keys it that way — `build` being
the entry chunk's hashed filename, which Vite moves on any source change, and `agent` an FNV
hash of the user-agent so a browser update re-keys rather than re-serves.

Eviction on a real device could not be measured in this session and is NOT claimed: WebKit's
seven-day clearing of script-writable storage for a site the user has not interacted with is a
platform behaviour, and its only effect here is a MISS, which is today's bake. The device closes
this the way it closes every other budget, through 8.3.

## 4. THE RULING

The spike beat the re-bake by 19.2× (chromium wall), 75.5× (chromium blocking), 55.8× / 12.0×
(WebKit) against a declared 3×. It was therefore LANDED — `RECORD.md` holds the cure, its
acceptance, its π and its gates.
