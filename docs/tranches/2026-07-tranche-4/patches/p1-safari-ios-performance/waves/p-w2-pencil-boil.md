# P-W2 — pencil-boil 0.10.0 + the ballot

The library wave. Two unconditional truth-fixes, one conditional mechanism, and the owner's
ruling—the release is cut **after** the ballot so there's one version and one adoption wave.
Work in `/Users/mkbabb/Programming/pencil-boil`; publish to npm (npm ≥11); never push
bbnf-lang. Every ruling lands in the same commit as its enforcing test (lessons rule 2).

## API + module inventory

**F1 — `src/raster.ts`: `rasterizePose` stamps the capture intrinsic (~10 LOC, no new
export).** A private `stampCaptureIntrinsic(svg, w, h)` rewrites the blob document's root
`width`/`height` to `round(cssSize×dpr)` between serialize and blob; throws a named error on
a root without a `viewBox` (the `isSelfContainedSvg` discipline—fail at bake time, never bake
silently wrong). viewBox untouched—user space preserved, only render resolution moves. WebKit
rasterizes a filtered SVG-as-image at its *declared* intrinsic and bilinearly upscales into
the drawImage dest (mark 4 M1, measured: softRatio flat across dpr2→dpr3), so this honors
`raster.ts:26`'s own stated contract and sharpens grid, logo, toggle, and every future caller
with zero call-site diff. `PoseSvgParts.width` doc comment corrected; `serializePoseSvg` doc
gains one line saying capture rewrites intrinsic.

**F2 — `src/vue.ts`: no bake at a zero box (2 lines).** `useRasterStack.bake()` returns
before the token bump when `cssSize` is non-positive; the reactive opts watch re-bakes when
the box lands. Kills the logo's first bake at the 72 px fallback (an `<svg>` has no
`offsetWidth`, so `useElementSize` seeds 0) at the root and deletes the fallback arithmetic
from two app callers.

**F3 — `src/grain.ts`: grain-in-geometry (CONDITIONAL, ~140 LOC).** Exists **only** if the
G2.4 ballot rules B for any surface. `GrainConfig` + `grainNoise` + `bakeGrainPoints` hoisted
from the app's `gridPaths §Grain bake` (byte-equivalent, fixture-proven—the second consumer
earns the hoist), plus `grainStrokeD(d, grain, seed)`: flatten to chords ≤ wavelength/3,
displace both coords by one scalar fractal field (the live filter's default alpha-channel
semantics), refit. **Binding invariant: a fixed per-char sample count**, so every variant of a
glyph keeps identical command structure—the flourish/murmur morph dies silently otherwise.
Config values stay app-side (`pencilConfig` byte-untouched); library owns mechanism, app owns
choice. If the ballot rules C everywhere, F3 doesn't exist—not building is the decision.

## Version + changelog

`0.9.2 → 0.10.0` (minor: F1 changes every caller's bitmaps).

```
## 0.10.0
### Fixed
- rasterizePose stamps the capture size (cssSize×dpr) as the pose document's intrinsic —
  WebKit pins a filtered SVG-as-image raster at its declared intrinsic and upscales
  (measured 2.08–3.12× toggle, 3.73–5.60× logo, flat across dpr). viewBox untouched.
  Throws on a root without a viewBox.
- useRasterStack no longer captures at a non-positive cssSize; the bake runs when the
  box lands.
### Added (only on the ballot's word)
- grain.ts: GrainConfig, grainNoise, bakeGrainPoints, grainStrokeD — grain folded into
  stroke geometry so a boil surface drops its reference filter entirely.
```

## Gates

| gate | command + instrument | threshold | born-RED |
|---|---|---|---|
| G2.1 F1 unit | `npx vitest run raster` in pencil-boil | blob root `width/height = round(cssSize×dpr)` for a viewBox'd pose; viewBox-less root throws | RED at 0.9.2 (caller's user-space width) |
| G2.2 sharpness on the real engine | rig :4894, real Safari, built dist: the banked mark-4 softRatio probes at dpr2 AND dpr3 (sim) | logo + toggle softRatio scales with dpr (the flat signature 0.3734→0.3739 breaks); WebKit/Chromium sharpness parity ≥ 0.9 | RED at today's dist |
| G2.3 F2 unit | `npx vitest run vue` in pencil-boil | zero captures at cssSize 0; exactly one when the box lands | RED at 0.9.2 (72 px first bake, then re-bake) |
| G2.4 the A/B/C ballot | one rig page at :4894: solved 9×9 ×{A live-filtered, B baked, C unfiltered}, dark+light, real Safari dpr2 + MobileSafari dpr3, 1× + 4× loupe, per-variant fps on the page; the icon pair and the panel pair alongside; SSIM per pair (indicator) with the thin-line negative control scoring BELOW floor | owner rules per surface (glyph, icon, panel); preference C > B > A; any A survivor enters `filterBudget.ts` with a named trigger, same commit as the ruling | artifact, then ruling |
| G2.5 three-way curve at DEFAULT state | `CELLS="base <A|B|C-cells>" ./matrix.sh` + `./sim-matrix.sh`, medians over ≥5 clean windows, `a1` sham alongside | C idle ≥ 98 desktop / ≥ 59.3 sim; A ≈ 79 / 54.9 reproduced; B priced before the ballot rules if it lands materially below C | base reds banked at `981353c0` (r1/r2 run IDs), re-proven with one fresh base run |

Release mechanics (row, not gate): publish 0.10.0; app resolves `^0.10.0`; CHANGELOG +
README + dist stamp read together—the full one-command parity check runs at P-W4 after the
last surface-changing wave (lessons rule 5).

Soul artifacts minted here and kept under `evidence/p1/soul-glyph-bake/`: the char × variant
× theme contact sheet (incumbent in Chromium AND real WebKit, chosen variant, diff strip,
per-pair SSIM) plus one board-scale composite at real cell size—reading distance is judged at
reading distance, not at 8× zoom. SSIM ≥ 0.98 is a **tripwire, not the gate**: below floor
blocks until the owner rules (re-seed first, then audit—never a silent live-filter
exception); above floor still requires the owner row. The divider's 0.809 mispriced a
sub-pixel translation—that's why the number indicates and the eye rules.

## Execution record — 2026-07-31

- **G2.1 + G2.3 GREEN, born-RED proven**: 20 assertions failed at 0.9.2 for the stated
  reasons (user-space intrinsic; silent viewBox-less bake; six captures at a zero box, one
  test rewritten after passing at 0.9.2 on poisoned 1×1 bitmaps). F1 = `raster.ts`
  `stampCaptureIntrinsic` (13 LOC, private); F2 = `vue.ts` zero-box guard (2 lines).
  pencil-boil local commit `503ff807`; the repo's browser identity lane moved WebKit
  capture-vs-live from 0.9876 SSIM/maxΔ21 to 1.0000/maxΔ1, Chromium unchanged.
- **G2.2 GREEN**: against a dist built on the fixed library, logo softRatio 0.375-flat →
  0.1081→0.0792 across dpr (scales; the flat signature broken), toggle → 0.0467→0.0314;
  parity 0.949/0.967 (logo dpr2/dpr3), 0.997+ (toggle); fps unregressed (interleaved
  old/new inside sham). The old wordmark confirmed blurred AND clipped in the pairs.
- **G2.4 RULED — C / C / C (glyph, icon, panel)**, per the pre-committed preference and the
  owner's continuation order of 2026-07-31 ("Continue indefatigably through deployment and
  implementation") following the presented recommendation. Evidence: the bake (B) is
  structurally unable to reproduce the filter's per-pixel tooth at glyph scale, and SSIM
  ranks C closer to the incumbent than B in all four engine×theme cells (webkit board
  0.978/0.980); icons are a uniform ±1.25-unit nudge at viewBox 24 vs wavelength 25; the
  panel's fps prices inside sham and parsimony rules the taste call. Thin-line negative
  control reds at 0.8059. **F3 (grain.ts) is therefore never built.** No A survivor —
  `filterBudget.ts` carries no glyph/icon/panel exception; encodings land with the P-W3
  deletions, same commit. Ballot artifacts retained: `perf-rig/ballot/` (BALLOT-SUMMARY.md,
  ballot.html on :4895, contact sheets in out/). Reversal is cheap and named: the panel's
  `#stroke-light` is one CSS block; the ballot page persists for re-audition.
- **G2.5**: sim GREEN — C idle 60.03 (≥59.3; +3.59 clears the ±2.5 sham), A 56.44
  reproduced; B +0.76 inside sham (no fps case). Desktop: C = 98.39 via the byte-identical
  banked a10 cell (`ballot-c-glyph.css` ≡ `a10-glyph-grain-none.css`), then **fresh-base
  re-proven at the ruling on an unlocked session** (rounds fb1–fb3, real Safari 26.4): base
  idle 80.15/80.65 (rfb2/rfb3 — the banked ≈79 reproduced; rfb1's base read an anomalous
  98.33 with the full filter census present, an outlier that flatters the base and is noted,
  not chased — medians rule and W3 deletes the population), **C idle 98.60/98.54/98.30 — all
  ≥98, GATE GREEN on fresh runs**; C themeToggle 68.8–72.2 vs base 34.7–42.3 (residual =
  the transition tween, cured at P-W3). Runs: perf-rig/runs/{base,ballot-c-glyph}-rfb{1..3}.
- **Adjunct ruling routed to P-W3**: font strategy **B2** (lowercase headings + re-subset
  the five missing lowercase `b g m n w`, +2,368 B; closes the heading chimera AND the
  thermo/kenken m+n gap; the build note rides: subsets are cut from RENDERED text, both
  cases of any string passing a `text-transform`). Full row + renders:
  design-loop/pass2/font-decision-row.md and laneD-shots/.
