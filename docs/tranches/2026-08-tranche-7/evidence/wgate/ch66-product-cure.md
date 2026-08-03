# CH-66 — THE PRODUCT CURE: the pose stacks are hidden, never torn out

**2026-08-03 · T7-WGATE · runbook item 15 · darwin 25.4.0 · @playwright/test 1.61.1 · tree sealed through `141fdbad`**

The harness half of CH-66 sealed at W3 (`committed-press.ts`, `evidence/w3/futoshiki-coldchunk-forensics.txt`).
This is the PRODUCT half: a real Safari user pressing the wordmark while the raster bake lands got
nothing — no gallery, no feedback, press again — at ≈7% of first contacts. It is cured here, on the
disease's own instrument, and the cure is the estate's own immune grammar rather than a new idea.

Raw probe output for every run below: `ch66-probe-runs.txt` (same directory).

---

## 1. THE THREE SITES, AND WHAT CHANGED AT EACH

The census named exactly three tear-out sites in two components — the `v-for="…Baked ? [] : POSES"`
shape, which REMOVES the live pose stack from the document when the bake lands. All three now render
their stack unconditionally and hide it.

### Site 1 — `HandwrittenLogo.vue` (the wordmark; the site that was measured and felt)

```diff
-  v-for="(pid, f) in logoBaked ? [] : logoPoseIds"
-  class="logo-pose"
-  :class="{ 'is-active': f === 0 }"
+  v-for="(pid, f) in logoPoseIds"
+  :class="logoBaked ? 'logo-pose-parked' : ['logo-pose', { 'is-active': f === 0 }]"
```
```css
+ .logo-pose-parked { display: none; }
+ .logo-pose, .logo-pose-bmp { pointer-events: none; }
```

The class SWAPS rather than taking a modifier, and that is deliberate: `logo-pose` and `is-active`
are what the estate censuses as THE STACK (`visual-regression.spec.ts:196` asserts
`image.logo-pose-bmp, g.logo-pose` = 4 with exactly 1 active — a union across both arms). A parked
group is not a member of the stack; it is a node the pointer still has business with. Keeping the
name would have made a 4-layer stack read as 8 and broken an assertion that is measuring the right
thing. `HandDrawnGrid` can use a `baked-hidden` modifier because its own spec reads
`baked.length ? baked : filtered` instead of a union.

### Sites 2 and 3 — `DarkModeToggle.vue` (sun rest stack, moon rest stack)

```diff
-  v-for="(sparkles, i) in sunBaked ? [] : SPARKLE_POSES"
-  :class="{ 'is-pose-active': i === 0 }"
+  v-for="(sparkles, i) in SPARKLE_POSES"
+  :class="{ 'is-pose-active': !sunBaked && i === 0, 'baked-hidden': sunBaked }"
```
(and identically for `moonBaked` / `STAR_POSES_D`)
```css
+ .rest-pose.baked-hidden { display: none; }
```

`is-pose-active` is pinned OFF when parked rather than left on pose 0 — invisible either way under
`display: none`, and it keeps "exactly one pose visible per active sub-stack"
(`visual-regression.spec.ts:907`, which filters on computed opacity) true as a statement about
OPACITY, which is how the estate reads it.

**These two sites never dropped a press, and the reason is worth keeping:** `.toggle-rest` and
`.toggle-icon` are `pointer-events: none`, so the hit has always landed on the `<button>`. They are
converted because they are the same defect SHAPE and this is the estate's last two instances of it.

### The grammar, copied not invented

`HandDrawnGrid` / `HandDrawnOutline` bake identically and have always kept the live stack MOUNTED and
`display: none`. A `display: none` subtree generates no boxes, no layers and no filter raster — and
the live-filter census excludes it BY ITS OWN COUNTING RULE (own computed `display` ≠ none,
`filterBudget.ts`) — while its NODES stay connected, which is the entire property the pointer needs.

**On the scheduler (guard 3a), the cure is cheaper than its reference.** `HandDrawnGrid` lets
`is-active` keep following the beat on its hidden layers ("the pin is a no-op there"). Both surfaces
here are PINNED while parked, so the hidden stacks take not one write per beat. Nothing in either
component subscribes the parked stacks to the beat, and the toggle's parked bindings are static
module-scope arrays (`RAY_POSES`, `TWINKLE_BY_FRAME`) that cannot re-render.

### The second half, which the harness cure could not reach

The reset key (`label`-`vbWidth`) sends a baked wordmark BACK to the live arm on a game swap or a
post-font re-measure, and THAT tear-out is the `<image>` stack's. It cannot be cured by mounting: poses
baked at the old width would stretch into the new viewBox (the fringed wordmark this file's own
retention note rejects). So neither arm is a pointer target at all — `pointer-events: none` puts the
hit on the `<svg>`/`<button>`, which no bake in either direction unmounts. Measured: with the poses
transparent, `elementFromPoint` at the wordmark's centre returns `svg.handwritten-logo` in both
engines (§4).

---

## 2. THE DISEASE, REPRODUCED — 5/90 (5.6%)

Rig rebuilt from `evidence/w3/futoshiki-coldchunk-forensics.txt` §2/§5 (the W3 probes were scratch):
`futoshiki.spec.ts`'s exact path, one fresh browser context per iteration, document-level CAPTURE
listeners on mousedown/mouseup/click.

```
goto ?size=3&difficulty=EASY → waitForSelector 'svg.handwritten-logo'
                             → click 'button.logo-trigger'
                             → wait '.gallery-viewport' visible (15,000ms budget)
```

| run | engine | iterations | dropped |
|---|---|---|---|
| pre-cure 1 | webkit | 30 | **1** |
| pre-cure 2 | webkit | 60 | **4** |
| **pre-cure total** | **webkit** | **90** | **5 (5.6%)** |

Against the W3 banked figure of 2/30 (≈7%) and its arm-B cross-check of 4/30 first presses recovered
(13%) — same class, same order, three instruments.

**Every red printed the mechanism, and two printed it whole:**

```
iter 6  RED  down=0 up=1 click=0     mouseup@516  -> image.logo-pose-bmp
iter 3  RED  down=1 up=1 click=0     mousedown@526-> text.logo-text
                                     mouseup@531  -> image.logo-pose-bmp
iter 26 RED  down=1 up=1 click=0     mousedown@552-> text.logo-text
                                     mouseup@557  -> image.logo-pose-bmp
iter 35 RED  down=1 up=0 click=0     mousedown@515-> text.logo-text
iter 45 RED  down=1 up=0 click=0     mousedown@546-> text.logo-text
```

Iters 3 and 26 are STRONGER than anything W3 caught. W3 only ever saw a LONE half of the pair; here
**both halves reached the document** — `mousedown` on the live arm, `mouseup` on the baked arm, 5 ms
apart — **and no `click` was synthesized anyway.** That is the tear-out mechanism stated exactly: a
click's target is the nearest common ancestor of the down and up targets, and WebKit will not compute
one when the down target has been removed from the document. Chromium walks up to the nearest
connected ancestor instead, which is the whole engine split.

The state dump at all five reds agrees: `g.logo-pose` = 0, `image.logo-pose-bmp` = 4 — the tear-out
had landed, the app was alive, the URL carried no `?view=gallery`, the trigger was still a `BUTTON`.

---

## 3. THE CURE, MEASURED — 0/120 WEBKIT

Both terms measured separately, so the ledger's claim is attributed rather than assumed.

| arm | what is in the tree | engine | iterations | dropped |
|---|---|---|---|---|
| ARM 1 | mounted-and-hidden ONLY (`pointer-events` ablated to `auto`) | webkit | 30 | **0** |
| ARM 2 | **SHIPPED** — mounted-and-hidden + `pointer-events: none` | webkit | 90 | **0** |
| control | SHIPPED | chromium | 30 | **0** |

**ARM 1 carries the cure on its own** — the mounted-and-hidden term is sufficient, which is the term
the ledger names and the term the harness law predicted. `pointer-events: none` is banked as the belt
for the reverse swap (§1), not as the thing that fixed the measured defect.

Every one of the 150 post-cure iterations sent exactly ONE press and got exactly ONE click
(`clicks: 1 × 150`). Pre-cure 5/90 → post-cure 0/90 on the identical rig is p ≈ 0.03 one-sided
(Fisher); with ARM 1 folded in the post-cure denominator is 120.

---

## 4. THE DOM STATE THE CURE ASSERTS (settled board, both engines)

| read | chromium | webkit |
|---|---|---|
| `image.logo-pose-bmp` / `.is-active` | 4 / 1 | 4 / 1 |
| `g.logo-pose` (live, in-stack) | 0 | 0 |
| `g.logo-pose-parked` | 4 | 4 |
| computed `display` of the parked groups | `none` | `none` |
| **spec union** `image.logo-pose-bmp, g.logo-pose` / active | **4 / 1** | **4 / 1** |
| `elementFromPoint` at the wordmark centre | `svg.handwritten-logo` | `svg.handwritten-logo` |
| `.toggle-rest img.rest-pose` / `svg.rest-pose` | 8 / 8 | 8 / 8 |
| parked `svg.rest-pose.baked-hidden` display | `none` | `none` |
| `.toggle-rest.is-active .rest-pose` with opacity > 0 | **1** | **1** |
| **live-filter census (own display ≠ none)** | **9** | **9** |
| census rows | 4 `g.boil-pose` · 2 `svg.toggle-icon` · 2 crayon-heart `g` · 1 `svg.sparkle-icon` | same |

The gated population is unmoved and is exactly `filterBudget.ts`'s rows.

---

## 5. THE GATES

| gate | invocation | result |
|---|---|---|
| units | `npm run test:unit` | **483 passed** (47 files) |
| prettier | `npm run lint` | clean |
| eslint | `npx eslint` on both edited files | clean |
| typecheck + build | `npm run build` (`vue-tsc -b && vite build`) | clean |
| **filter census** | `test:e2e:throttle` → `filter-census-{chromium,webkit}` | **12/12 passed** — G3.1 row regime, G3.3 coarse, G3.5 board + picker hover, G3.2 fill ×2, both engines |
| built-dist gates (all) | `PLAYWRIGHT_BASE_URL=:4239 npm run test:e2e:throttle` | **67 passed** (adds wordmark-integrity, theme-bake-freshness, theme-quadrants, throttled-void) |
| **goldens (darwin)** | `PLAYWRIGHT_BASE_URL=:4237 npm run test:golden` | **4/4 passed** — logo wordmark (light), toggle crest (dark/moon), grid corner, cell glyph. **The two surfaces this wave touched are two of the four, and neither moved a pixel.** |
| the six converted specs | a11y · futoshiki · gallery-guard · permalink · gallery-deal, `--project=webkit` | **53 passed** |
| throttled-void | its own config, built dist | **1 passed** |
| default suite | `npx playwright test` (chromium + webkit) | **349 passed / 2 skipped**, twice (see §6) |

### Perf — `perf-rig/ci-subset.mjs --engines chromium --runs 3`, A/B on the same host, back to back

| metric | CONTROL (reverted) | CURED | gate |
|---|---|---|---|
| control-page fps | 134.27 | 134.25 | validity |
| median idle fps | 134.28 | **134.28** | ≥ 132.34 · GATE B **PASS** |
| median / max long33 | 0 / 0 | **0 / 0** | ≤ 0 · GATE A **PASS** |
| undoBurst fps | 134.67 | 134.23 | ≥ 120.83 · GATE C **PASS** |
| median boot TBT (4× CPU) | 367 ms | **385 ms** | ≤ 1750 · GATE D **PASS** |
| host CPU anchor | 117 ms | 117 ms | diagnostic |

`RESULT: GREEN — every gates.json threshold held on every engine.` A second cured run read boot TBT
362 ms, so the cured spread (362–385) straddles the control's 367 and the whole band sits ~4.5× under
the ceiling. **The cure prices at zero.** That is the expected shape: hiding twelve subtrees and
destroying twelve subtrees are the same work, and neither is paid again at steady state.

---

## 6. THE SUITE REDS THIS RUN PRODUCED, NAMED RATHER THAN LAUNDERED

The default suite was run four times over the cure and twice over a reverted control. **Two cured runs
were fully green; two carried reds:**

| run | tree | wall | result |
|---|---|---|---|
| 1 | cured | 2.3m | **7 failed** — gallery-guard ×2 (chromium), gallery:358 drag (chromium), multiplayer:497 (chromium), drawer ×3 (webkit) |
| 2 | control | 2.1m | 349 passed |
| 3 | cured | 2.5m | 349 passed |
| 4 | cured | 2.4m | **3 failed** — multiplayer:678, :723, :877, all webkit |
| 5 | control | 2.0m | 349 passed |

What the evidence says, stated as strongly as it deserves and no more:

- **The two red sets are DISJOINT.** No row red twice. A defect does not wander.
- **Every red row passes in isolation**, on the cured tree: gallery-guard + multiplayer chromium 23/23;
  drawer webkit 8/8; gallery chromium 13/13; the three multiplayer webkit rows in their file 16/17,
  and `multiplayer.spec.ts:497` — the one wordmark-touching row of the eleven — **5/5 green run alone**.
- **No red row asserts anything this diff touches.** Not one is a pose count, a filter census, an
  opacity read or a press on the wordmark's bake window.
- **The host was not quiescent.** The perf rig printed `load 34.79 / 57.34 / 50.52` at the finish of the
  run between them. Three sibling agent lanes were writing this same worktree throughout (§7).
- **The instrument built for exactly this question prices the change at zero** (§5), on the same host,
  minutes apart.

The one thing this does NOT establish: the control went 2/2 green while the cure went 2/4, and with an
uncontrolled host that asymmetry cannot be excluded by these runs alone. It is booked, not buried.
**The settling act is a full default-suite pass on a quiescent box**; the estate's own CH-64 class
(deadline-shaped webkit reds under contention, green on the next pass with no change to the surface)
is what these reds look like, and the wandering set is that class's own signature.

---

## 7. RESIDUE, for the chair

1. **THE TREE WAS NOT MINE ALONE.** Clean at `141fdbad` when this lane opened; by its close, sibling
   lanes had modified `.github/workflows/ci.yml`, `docs/tranches/2026-08-tranche-7/DISPOSITIONS.md`,
   `web/frontend/perf-rig/ci-subset.mjs`, `web/frontend/perf-rig/probe.js`, and added
   `evidence/wgate/ballots-fired.md`. **This lane touched none of them.** Its whole diff is the two
   components plus this directory.
2. **`web/frontend/.probe-swallow.mjs` (untracked, written 07:28 by another lane) REDS
   `npm run lint:eslint` estate-wide** — 6 errors (`'process' is not defined` ×5,
   `'suppressedRelease' assigned but never used`). It is not gitignored. It must be removed or ignored
   before the close, or the lint lane reds on a clean tree.
3. **`filterBudget.ts`'s PROSE — not its gated numbers — is now stale, and it is outside this lane's
   fence (a config).** The display-BLIND census (the perf-rig's rule, which does not consult `display`)
   reads **25 where the header's row 2 says 13**: +4 `g.logo-pose-parked`, +8 parked
   `svg.rest-pose.baked-hidden`. The GATED census (own `display` ≠ none) is unmoved at 9 in both
   engines and both regimes, and the union area is unmoved because the same rule excludes the same
   nodes. Three header rows want re-wording by whoever owns that file: row 2 (13 → 25), row 4's gallery
   figure (the `+4 g.logo-pose` term is now parked there too), and the "PRE-SETTLE cold load 21"
   arithmetic, which is unchanged in fact — the boot window is still the live stacks, rendered.
4. **A GATE D `INADMISSIBLE` was observed and is NOT a finding about this cure.** A cured perf run
   returned `anchor 116ms > 50ms ceiling` while the file's committed `ANCHOR_CEILING_MS` reads 350; a
   sibling lane was exercising a 50 ms canary in `ci-subset.mjs` mid-run. The re-run against the
   restored ceiling is the GREEN banked in §5.
5. **The harness law stays.** `committed-press.ts` and its ten converted sites are untouched, exactly as
   the fence required. Belt and braces do not conflict: the helper polls a committed invariant and is
   robust to cause, which is worth keeping whatever the product does.

---

## 8. COMMANDS

```
npx vite --port 4237 --strictPort
PROBE_BASE=http://localhost:4237 PROBE_ENGINE=webkit PROBE_ITERS=90 node ch66-press-probe.mjs
PLAYWRIGHT_BASE_URL=http://localhost:4237 npx playwright test
PLAYWRIGHT_BASE_URL=http://localhost:4237 npm run test:golden
VITE_BASE_URL=/ npx vite build --outDir dist-throttle && npx vite preview --outDir dist-throttle --port 4239 --strictPort
PLAYWRIGHT_BASE_URL=http://localhost:4239 npm run test:e2e:throttle
node perf-rig/ci-subset.mjs --build --port 4240 --engines chromium --runs 3
```

Ports 4237/4239/4240 only — `:3000`/`:3001` are the owner's and a foreign palette-api; 4230/4241/4250
were held by sibling lanes. The probe is scratch by the W3 convention (its numbers and its shape are
banked here and in `ch66-probe-runs.txt`, which is what reproduces it).

---

## 9. THE LEDGER ROW, drafted

The chair moves the row same-commit as the close. Proposed replacement state and text for CH-66:

> **CLOSED · harness cured W3, product cured WGATE** | WebKit dropped press across the pose-stack
> swap. The engine synthesizes `click` only from a mousedown/mouseup pair whose targets still share an
> ancestor IN THE DOCUMENT; the wordmark's bake tore the live `<g class="logo-pose">` stack out from
> under the pointer, so a straddling press lost the half whose target was destroyed and the handler
> never ran — silently, app alive, no console error. HARNESS CURED 2026-08-03 (`committed-press.ts`,
> ten sites, `evidence/w3/futoshiki-coldchunk-forensics.txt`); it stays, and it is worth keeping: it
> polls a committed invariant and is robust to cause. **PRODUCT CURED 2026-08-03, at WGATE
> (`evidence/wgate/ch66-product-cure.md`).** All three census sites in two components — `HandwrittenLogo`
> ×1, `DarkModeToggle` ×2 — drop the `v-for="…Baked ? [] : POSES"` tear-out and adopt the estate's own
> immune grammar, `HandDrawnGrid`/`HandDrawnOutline`'s mounted-and-`display:none`: the stack renders
> unconditionally and is HIDDEN when the bitmaps take the surface, so no box, no layer and no filter
> raster survive the bake while every NODE stays connected. **MEASURED ON THE DISEASE'S OWN
> INSTRUMENT**, the W3 rig rebuilt: **5 of 90 unaided darwin-WebKit presses dropped pre-cure (5.6%,
> against W3's banked 2/30 and its 13% arm-B cross-check), 0 of 90 post-cure, 0 of 30 chromium, every
> post-cure iteration one press one click.** Two of the five pre-cure reds caught the mechanism whole
> and more sharply than W3 did — `mousedown → text.logo-text`, `mouseup → image.logo-pose-bmp`, 5 ms
> apart, BOTH halves in the document, and still no click: it is the common-ancestor computation that
> fails, not event delivery. **ATTRIBUTED, not assumed:** the mounted-and-hidden term alone reads 0/30
> with `pointer-events` ablated, so it is sufficient; `pointer-events: none` on both pose arms ships
> as the belt for the direction mounting cannot reach — the reset key (`label`-`vbWidth`) sends a baked
> wordmark back to the live arm and tears out the `<image>` stack, which cannot be mounted through
> without fringing the wordmark, so the hit is moved to the `<svg>`/`<button>` (verified:
> `elementFromPoint` returns `svg.handwritten-logo`, both engines). COSTS GUARDED, measured not
> assumed: the gated live-filter census holds at **9/9 both engines both regimes** with union area
> unmoved (the counting rule excludes own-`display:none` by construction, which is why the grid's four
> `.baked-hidden` poses have never counted either); `test:e2e:throttle` 67/67; **darwin goldens 4/4,
> two of them the very surfaces touched**; units 483/483; and the perf rig A/B on one host reads idle
> **134.28 fps against a control's 134.28, long33 0/0, boot TBT 362–385 ms against 367 ms and a 1750 ms
> ceiling** — the cure prices at zero, as it must, since hiding a subtree and destroying one are the
> same work. The parked stacks are pinned rather than beat-following, so unlike the grid's reference
> they take not one write while hidden. RESIDUE, all outside this lane's fence: `filterBudget.ts`'s
> PROSE rows want re-wording (the display-BLIND perf-rig census reads 25 where the header says 13 —
> +4 parked logo poses, +8 parked rest poses; the GATED 9 is unmoved and so is every gate); and the
> default suite produced two disjoint sets of wandering reds on a host at load 35–57 with three sibling
> lanes writing the same worktree, every row of which passes in isolation and none of which asserts
> anything this diff touches — CH-64's class, and the settling act is one full-suite pass on a
> quiescent box. **Trigger, re-armed and narrowed:** any webkit spec red whose document capture shows a
> lone mousedown/mouseup — OR a PAIR with no click — targeting a pose surface. A fourth
> `v-for="…Baked ? [] : POSES"` site appearing anywhere in `src/` re-opens this row by construction.
