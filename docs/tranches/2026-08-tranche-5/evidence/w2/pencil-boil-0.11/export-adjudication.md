# E6 — the 20 unconsumed pencil-boil exports, adjudicated upstream

**Source of the census:** `evidence/audit/r1/consumer-truth.md` §2B (44 public names, 24
consumed, 20 not), re-derived against `src/index.ts` at pencil-boil `763f1c0` before the cut.
**Ruled and landed in** `@mkbabb/pencil-boil` 0.11.0 (`4e9bbc1`, tag `v0.11.0`). The same
table ships in the package CHANGELOG, which is where a consumer will look for it.

## The rule applied

An export is **PRUNED** when nothing consumes it AND it is a redundant specialization, an
alias, or a superseded output of another export that stays. It is **KEPT** when something
consumes it (the estate, or the library's own proofs), when it is the readable half of a
consumed pair, when it is the declared type of a kept value, or when it is a primary
primitive of the package's own vocabulary — and every keep is recorded with the consumer it
is for, so the row is falsifiable next time. 0.x semver permits the cuts.

## The ruling — 4 pruned, 16 kept

| # | Export | Ruling | Basis |
|---|---|---|---|
| 31 | `rasterizePose` | **PRUNED** | Superseded by `rasterizePoseToBlob` — the `ImageBitmap` was a copy taken on the way to the blob every consumer actually rendered |
| 32 | `rasterizePoseStack` | **PRUNED** | Superseded; `useRasterStack` owns the per-pose loop, and no non-Vue consumer ever called it |
| 26 | `useFilterParamBoil` | **PRUNED** | Retired by design downstream (`SvgFilters.vue:23` — the per-beat `baseFrequency` write is dead); `createBoilTicker` covers an imperative per-tick effect |
| 30 | `useBoilFrames` | **PRUNED** | An alias of `useBoilCache`, its own doc-comment kept "for the consumers that import it by name" — the census found none |
| 27 | `createStrokeDrawIn` | KEPT | **W2.8 adopter** — replaces the estate's local `createGlyphDrawIn` twin |
| 28 | `boilRectFrames` | KEPT | **W2.8 adopter** — replaces the estate's local prebaked-rect twin |
| 29 | `ellipsePoints` | KEPT | **W2.8 adopter** — replaces the estate's local ring twin |
| 33 | `isSelfContainedSvg` | KEPT | Consumed by `proofs/browser/fixture.js`; the guard a pose builder runs before capture |
| 25 | `useLineBoil` | KEPT | Primary primitive (README stage 3), and the engine `useRasterStack` drives its pose off |
| 34 | `isBoilHeld` | KEPT | The readable half of `acquireHold`/`releaseHold`, both consumed |
| 36 | `perturbPointsClosed` | KEPT | The closed-ring twin of the consumed `perturbPoints`; `ellipsePoints` boils through it |
| 35 | `catmullRomToBezier` | KEPT | The path family's smooth serializer, beside the consumed `pointsToLinear` |
| 37 | `wobbleLine` | KEPT | The string form of the consumed `wobbleLinePoints`; `wobbleRect` composes it |
| 38 | `easeInCubic` | KEPT | Reached by string through the consumed `resolveEasing` (`usePathAnimation.ts:169`) |
| 39 | `easeInOutCubic` | KEPT | Same route |
| 40 | `Easing` | KEPT | Declared type of `resolveEasing`'s return and of every sequence's `easing` |
| 41 | `BoilHandle` | KEPT | Declared return type of the consumed `createBoilTicker` |
| 42 | `RasterStackHandle` | KEPT | The consumed `useRasterStack`'s return type |
| 43 | `PoseSvgParts` | KEPT | The consumed `serializePoseSvg`'s parameter type |
| 44 | `RasterStackOptions` | KEPT | The consumed `useRasterStack`'s options type |

## One census row corrected at citation

`consumer-truth.md` row 41 justifies `BoilHandle` as unconsumed because "its two producers
(`useLineBoil`, `useFilterParamBoil`) are both retired". `createBoilTicker` also returns
`BoilHandle` (`src/vue.ts`), and `createBoilTicker` IS consumed (`pencil/composables/boilBeat.ts:22`).
The row's disposition (unconsumed as a NAME) still holds; its stated reason did not, and
`BoilHandle` is kept on the corrected one.

## Surface effect

44 → 41 (four pruned, `rasterizePoseToBlob` added). The three W2.8 adoption targets are
verified present in `api-shape.md`.
