# `@mkbabb/pencil-boil` 0.11.0 — the API shape

Upstream tree: `~/Programming/pencil-boil`, remote `git@github.com:mkbabb/pencil-boil.git`.
Release commit `4e9bbc1`, tag `v0.11.0`, npm shasum `fd40671555eab161786f0ff79aac65a374746d20`.
Derived 2026-08-01 by reading `src/index.ts` at the release commit.

## Surface count

**44 → 41.** Four pruned, one added, nothing renamed.

```
$ node -e "…parse src/index.ts…"   → 41
```

## The delta

| Change | Export | Shape |
| --- | --- | --- |
| ADDED | `rasterizePoseToBlob` | `(poseSvg: string, cssSize: {width,height}, dpr?: number, type?: string, quality?: number) => Promise<Blob>` |
| REMOVED | `rasterizePose` | was `(…) => Promise<ImageBitmap>` |
| REMOVED | `rasterizePoseStack` | was `(opts: RasterStackOptions) => Promise<ImageBitmap[]>` |
| REMOVED | `useFilterParamBoil` | was `(onTick, intervalMs?) => BoilHandle` |
| REMOVED | `useBoilFrames` | was a `useBoilCache<T[]>` alias |
| CHANGED | `RasterStackHandle` | `bitmaps: Ref<ImageBitmap[]｜null>` → `urls: Ref<string[]｜null>`; `ready`/`pose`/`rebake` unchanged |
| CHANGED | `BoilHandle.stop`, `SequenceHandle.stop` | same signature, new contract: cannot throw, ever |

`createStrokeDrawIn`, `boilRectFrames` and `ellipsePoints` — the three W2.8 adoption targets —
are **all still exported**, verified in the list below.

## The full 41

```
BoilHandle, Easing, PoseSvgParts, RasterStackHandle, RasterStackOptions, SequenceHandle,
WobbleOptions, acquireHold, boilLineFrames, boilRectFrames, catmullRomToBezier,
createBoilTicker, createSequenceSubscription, createStrokeDrawIn, easeInCubic,
easeInOutCubic, easeOutCubic, ellipsePoints, generateSunRays, heldFrameCount, isBoilHeld,
isSelfContainedSvg, linear, mulberry32, perturbPoints, perturbPointsClosed, pointsToLinear,
rasterizePoseToBlob, releaseHold, resolveEasing, schedulerDebugInfo, serializePoseSvg,
useBoilCache, useLineBoil, usePrefersReducedMotion, useRasterStack, wobbleDiamond,
wobbleLine, wobbleLinePoints, wobbleRect, wobbleStarPolygon
```

## What the app-side adoption owes (W2/W4b, NOT this lane)

The estate is on `^0.10.1` and does not compile against 0.11 until three edits land — listed
here as the consumer's map, not as work done:

1. `web/frontend/src/pencil/composables/rasterPose.ts` — `bitmapsToUrls`, `encodeBitmap` and
   `revokeUrls` are exactly the round trip 0.11 deletes. The whole encode half of that file
   dies; `readFilterDefs` / `resolveCssValue` stay.
2. The three baked surfaces — `HandwrittenLogo.vue`, `DarkModeToggle.vue`,
   `HandDrawnGrid.vue` — read `stack.urls` where they read `stack.bitmaps`, and stop revoking
   what they no longer mint.
3. The 11 `try { …stop() } catch {}` sites (roster in `evidence/audit/r2/verify-masked-and-drift.md`
   §2.1) unwrap to a bare `stop()`.

## The contract, stated

`stop()` — on `BoilHandle`, `SequenceHandle`, and the inert handle PRM hands back — returns
without throwing in every lifecycle phase: before start, mid-flight, from inside its own tick,
after completion, twice, after a central PRM clear, after teardown, and under a host whose
`cancelAnimationFrame` / `clearTimeout` throw. The withdrawal runs its two total statements
(a boolean write, `Set.delete`) first and guards only the host-facing teardown, so a throwing
host can never leave a withdrawn subscriber enrolled — asserted as a negative control beside
every no-throw arm.
