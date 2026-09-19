# C11 — THE MARGIN, DECLARED BEFORE THE SPIKE RUNS

Written 2026-09-18, before a single reading was taken, because the charter says the spike must
state the margin it holds itself to first. Branch `w8/bake-c11-spike` cut from `e694cc8c`
(the bake track's tip, C07b). Base arm `dist-base`:

    AUDIT: build-identity — dist entry index-DT3aGxCK2_YJ.js · index.html md5 71db526c330253b274d0895282c9134e · 43 files / 811.6 KB

## What the spike prices

Two ways to put sixteen baked poses on a warm load's screen, measured inside the SAME page load,
at chromium 4× · 390×844 · dpr 3 and on Playwright WebKit at the same pose:

- **RE-BAKE** (today): pose SVG → blob → `<img>` decode → `drawImage` → `toBlob` PNG, ×16.
  Priced as the census prices it: the `toBlob` bill (Σ ms), the pipeline wall (first `toBlob`
  start → last `toBlob` end), the PNG bytes.
- **RESTORE** (C11's proposal): `indexedDB.open` → one `getAll` of the stored PNG blobs →
  `createObjectURL` ×16 → `img.decode()` ×16. Priced end to end from the same clock.

## The margin — a clear margin is 3×, on both engines

C11 lands ONLY if all of these hold:

1. **Wall, 3×**: restore wall (open → last decode) ≤ 1/3 of the same window's bake wall.
2. **Blocking, 3×**: main-thread blocking attributable to restore (longtask overlap on chromium,
   rAF gaps > 33.4 ms on WebKit) ≤ 1/3 of the bake's `toBlob` bill in the same window.
3. **An absolute floor**: restore blocking ≤ 400 ms at chromium 4× mobile dpr 3. A cure that
   hands the boot 400 ms of storage work has moved the cost, not removed it.
4. **Correctness is free**: the identity that keys a stored pose can be computed without
   rendering the thing it keys (theme, DPR, box, pose count, label/face, build entry hash,
   engine). If a stale or lower-resolution bitmap can reach the screen under any of those, the
   charter closes REFUSED whatever the milliseconds say.
5. **Bounded**: the whole stored set fits a stated quota with a stated eviction, and the write
   never lands on the boot's critical window.

If 1, 2 or 3 fails on either engine, the charter closes **REFUSED ON EVIDENCE** with the numbers
and the spike branch stays for the record.
