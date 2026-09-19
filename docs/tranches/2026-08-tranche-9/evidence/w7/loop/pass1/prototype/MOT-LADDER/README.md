# MOT-LADDER — pass 1 · PROTOTYPE · the duration ladder

T9-W7 §13 · marks M02 / M09. Worktree `.claude/worktrees/wf_e58b4764-0fc-51`, branch
`worktree-wf_e58b4764-0fc-51`, built at HEAD `aab67b92`. Uncommitted by charter — the
agglomerator reads `git -C <worktree> diff --stat`.

**It RUNS.** Both dists built and served; every row below is a number off a built artifact
or off the tree, not a claim. Where a row failed to reach its stated value, it says so in §7.

---

## 1 · The gate, born RED at HEAD and GREEN on the branch

`web/frontend/scripts/check-motion-bands.mjs` (715 lines), `npm run lint:bands`, CI lane
wired in the same diff (`ci.yml`, beside `lint:motion`). Six checks, seven sabotages.

| check | HEAD (`--empty-ledger`) | branch |
| --- | --- | --- |
| B1 NAMED | **RED — 80** | **GREEN** (24 admitted, closed both ways) |
| B2 CLOSED | **RED — 4** (the four band keys carry no rung ruling) | GREEN — 6 rungs, `beatMs` exempt by cite |
| B3 MIRROR+FALLBACK | **RED — 1** (no publisher) | GREEN — 6 published, every fallback byte-equal |
| B4 NO-ALL | **RED — 1** (`GameControlPanel.vue:2082`) | GREEN |
| B5 PRM-ARMED | **RED — 4** | GREEN |
| B6 NO-SHORTEN | **RED — 1** (SKIPPED: the HEAD tree is not a git tree) | GREEN |

Headline, both trees, re-derived with the final gate:

```
HEAD    76 declarations carry a time (72 shipped); 84 DURATION positions,
         0 on a rung, 81 literal (22 distinct); ladder 0 rungs
         top: 150ms x19, 200ms x16, 250ms x9, 500ms x6, 350ms x4, 240ms x4
BRANCH  76 declarations carry a time (72 shipped); 84 DURATION positions,
        55 on a rung, 28 literal (20 distinct); ladder 6 rungs
         top: 320ms x3, 280ms x3, 180ms x2, 100ms x2, 120ms x2, 200ms x2
```

**Two corrections to the numbers the brief carried**, both measured on this tree, both in
the honest direction:

- **80 unnamed positions at HEAD, not 76**, and **84 duration positions, not 78**. The
  brief's figures came from the research lane's narrower reader. The gate is born RED at
  what it actually measures.
- **4 unarmed files, not 3.** The research named `DrawerTab` / `SheetWashiLabel` /
  `CrayonHeart`; B5 also convicts `GameControlPanel.vue` itself, whose `.sparkle-icon` rule
  sat outside every `no-preference` block. That fourth is the one the runtime defect lived
  in (§4).

Self-test, seven sabotages, each turning its own check RED: a cured site regressing to a
literal · the ladder growing past a short closed set · a rung landing with no ruling · a
fallback drifting from its rung · `transition: all` returning · a rung consumer shipping
with no reduce arm · a re-point shortening a shipped length.

---

## 2 · Two gate defects found and cured in this pass

**The sentinels were raw control bytes.** The masking pass wrote NUL and SOH into the
source. `grep` answered `Binary file matches` and refused to print a line; the estate's own
eslint redded `no-control-regex` four times. Cured with printable sentinels that cannot
occur inside a `transition:` body. `lint:eslint` clean, `prettier --check` clean, and the
file is greppable text.

**B6 greened when its evidence was unreachable.** `git show HEAD:<file>` failing was caught
and `continue`d, so on a tree without a git dir B6 passed vacuously while leaking
`fatal: not a git repository` to stderr once per file. It now probes `git rev-parse` first
and returns `SKIPPED` — which is why HEAD's B6 above reads RED-1, not green.

**One ledger row rotted inside this very pass.** Two CHARACTER admissions cited
`GameControlPanel.vue:2452/:2473`; the prototype's own edits above them pushed those
literals to `:2457/:2478` and the both-ways ledger redded — correctly. Re-cited. **This is a
standing cost the synthesizer should price: a line-cited ledger reds on any edit above it,
including edits from the same wave.** A content-anchored cite (file + literal + a nearby
stable string) would survive; that is a design decision, not a bug.

---

## 3 · The ladder, published to both layers

```
MOTION.rungs = { whisper 150 · leave 200 · note 250 · dusk 350 · step 440 · throw 520 }
publishMotionRungs(document.documentElement)   // main.ts, before mount
```

Read back off the **built dist**, at runtime (`readings/prm-*.json`):

```
HEAD   {"whisper":"","leave":"","note":"","dusk":"","step":"","throw":""}
BRANCH {"whisper":"150ms","leave":"200ms","note":"250ms","dusk":"350ms","step":"440ms","throw":"520ms"}
```

`cardStepMs` / `boardFoldMs` / `chromeLeaveMs` are **deleted**, with no aliases — the whole
point, since a second name for one length is what blinded i3 (§6). `--card-step-ms` and its
GameGallery publisher are gone; `GameCard.vue:411` reads `var(--motion-step, 440ms)`.
`GLIDE_MS` is `MOTION.rungs.throw`. `vue-tsc --noEmit` **0**.

---

## 4 · PRM — the defect the research named, cured and measured

Engine-computed `transition-duration` under `newContext({ reducedMotion })`, on the built
dists, 390x844 (`readings/prm-before.json`, `readings/prm-after.json`):

| site | HEAD @ reduce | BRANCH @ reduce |
| --- | --- | --- |
| `DrawerTab.vue:144` | `transform 0.15s ease-out` | **`none 0s`** |
| `SheetWashiLabel.vue:109` | `opacity 0.15s ease` | **`none 0s`** |
| `.sparkle-icon` (was `transition: all`) | `all 0.2s ease` | **`none 0s`** |
| **dock tap roster** | **1 animation** (`visibility 200ms ease · sparkle-icon`) | **0 animations** |
| dock tap, no-preference | 2 animations | **1** (the `.scene-controls` mover alone) |
| the dusk | `background-color, color 0.35s ease, ease` | `0.35s cubic-bezier(0.4,0,0.2,1)` |

The research's stated residue (`.sparkle-icon` still reading `filter 0.2s` under PRM after
the narrowing) is **closed**: the reduce block landed inside GameControlPanel's existing PRM
block and the engine now answers `none 0s`.

---

## 5 · Frames — 15 gestures, 390x844, dsf3, 1x, built dists

`readings/frames-before-1x.json` / `frames-after-1x.json`. Roster = animations running.

| gesture | BEFORE max/>33/roster | AFTER max/>33/roster |
| --- | --- | --- |
| idle-control | 9.2 / 0 / 0 | 9.3 / 0 / 0 |
| **dock-open-1** | 33.3 / 0 / **2** | 25.1 / 0 / **1** |
| **dock-close-1** | 9.3 / 0 / **2** | 9.3 / 0 / **1** |
| **dock-open-2** | 9.3 / 0 / **2** | 9.4 / 0 / **1** |
| **dock-close-2** | 9.3 / 0 / **2** | 9.3 / 0 / **1** |
| theme-1-to-dark (cold) | 134.1 / **2** / 26 | 133.3 / **2** / 26 |
| theme-2-to-light | 17.6 / 0 / 34 | 9.3 / 0 / 34 |
| theme-3-to-dark-warm | 9.3 / 0 / 34 | 9.3 / 0 / 34 |
| theme-4-to-light-warm | 9.3 / 0 / 34 | 9.4 / 0 / 34 |
| gallery-enter-1 | 25 / 0 / 3 | 17.5 / 0 / 3 |
| card-step-1 (cold) | 200.9 / **4** / 7 | 141.6 / **4** / **5** |
| card-step-2 | 9.3 / 0 / 7 | 9.3 / 0 / 7 |
| gallery-exit-select | 25 / 0 / 6 | 15.63 / 0 / 6 |
| gallery-enter-2-warm | 25.9 / 0 / 3 | 9.4 / 0 / 3 |
| gallery-exit-cancel | 16.6 / 0 / 5 | 16.7 / 0 / 5 |

**No new frame over 33 ms.** The only long frames on either side are the two cold bakes with
named owners — the first dark toggle (`HandwrittenLogo.vue:343`) and the first card step
(`HandDrawnGrid.vue:216`), **W8 §8.1's, not this family's** — and they carry the same count
both sides (2 and 4). Nothing was shortened as a fix: of the re-pointed rows, 45 keep their
exact length and 9 LENGTHEN (240 to 250 x4, 500 to 520 x5); **zero shorten**, enforced per
row by B6 reading `git show HEAD:`.

**The twins now share one curve**, observed on the built dist during a real exit:

```
HEAD    opacity 200ms cubic-bezier(0.32, 0.72, 0, 1)   .gallery-fade-leave-active
BRANCH  opacity 200ms cubic-bezier(0.32, 0, 0.67, 0)   <- byte-identical to .scene-controls'
```

**The dock settles and does not move a pixel.** Open, wait 700 ms, read
(`readings/dock-settle-frozen-*.json`):

| | HEAD | BRANCH |
| --- | --- | --- |
| `getAnimations()` at +700 ms | 0 | 0 |
| sheet rect, chromium (light and dark) | 390 x 628 @ (0, 216) | **identical** |
| sheet rect, webkit (light and dark) | 390 x 627.98 @ (0, 216) | **identical** |

---

## 6 · The r0 instruments, re-run — one greens, two cannot

| instrument | HEAD | branch |
| --- | --- | --- |
| i2 incidental-transition census | RED — 16 of 39 | **GREEN — 39 of 39** |
| i3-A glass-curve mirror | GREEN | **GREEN** (unmoved, as required) |
| i3-B glass-curve home, **widened** | RED — 8 homeless | **RED — 5** |
| I6 owner's-eye, original arm | RED — 77 / 35 / 4 | RED — 77 / **36** / 7 |
| I6 owner's-eye, **widened** | RED — 77 / 35 / 4 (0 rung reads) | RED — 36 / 33 / 7 (**55 rung reads named**) |
| I6 widened, shipped only | RED — 73 / 35 | RED — **32 / 31** |
| `lint:motion` | GREEN | GREEN (34 specs) |
| `lint:copy` | GREEN | GREEN — no string moved |
| `check-font-coverage` | GREEN | GREEN — no rendered string moved |
| `lint:lanes` · `lint:theme-tokens` · `lint:eslint` · `prettier` | GREEN | GREEN |
| `vue-tsc --noEmit` | 0 | **0** |
| unit battery | — | **66/66 files, 810/810 tests** |

**The widening was proven behaviour-preserving before it was trusted**: the widened i3-B
reads HEAD identically to the original (8 homeless, same rows), and the lifted I6 reproduces
the banked r0 reading exactly (`77 declarations spell 35 distinct literal durations
(top: 150ms x21, 200ms x16, 250ms x9, 500ms x6) against 4 named in MOTION`).

**i3-B does not reach 0, and the reason is structural.** Its five remaining homeless rows
are exactly five ADMITTED GRADED rows — `GameControlPanel.vue:1724/:1735/:1744` (the player
set) and `AnswerKeyLaminate.vue:237/:238` (the ledger's `:236` declaration). i3-B has no
concept of an admission, and teaching it one would put the ledger in two homes, which is the
failure this family exists to kill. **B1 strictly subsumes i3-B**; the five it still flags
are the proof. Recommendation: i3-A stands as its own instrument, i3-B retires into B1.

**I6 cannot reach GREEN either, for the same reason at larger scale.** Its law is
`literals.size === 0` — an absolute with no exceptions clause — so it reds while any
CHARACTER or GRADED length exists, and it counts the dev rig and `0s` visibility swaps as
lengths. Widened, it drops from 73 to 32 shipped declarations still typing a literal and
names 55 positions that were anonymous; that is the honest measure of the mark's progress.
**Unwidened it reads 36 distinct literals against HEAD's 35 — a `var()` fallback is literal
text to the old reader, so an unwidened I6 reports the ladder as a regression.** I6 must
either learn the ledger or hand its law to B1.

---

## 7 · Every gap, stated

1. **The theme-flip criterion did not certify.** The brief asks for no frame over 100 ms
   after flip 0 on either side. Six alternating flips at 4x CPU, twice per tree
   (`readings/theme-*-4x*.json`): BEFORE crossed 100 ms once in ten post-flip-0 windows
   (100.3 ms), BRANCH three times (109.1, 115.9, 108.0). Flip 1 crossed on BRANCH in both
   runs. **This bench cannot separate that from load**: 18 of the 20 ports in the lane band
   were held by concurrent agents throughout, and every number on both sides ran high against
   the research's quiet-bench run (its worst post-flip-0 frame was 68.1 ms; mine was 100.3 on
   HEAD alone). Re-run on a quiet machine before this row is read either way. Nothing else in
   this family touches that path — the dusk's own curve and duration are computed-style reads
   and they are confirmed.
2. **`CrayonHeart.vue`'s reduce arm guards a rule nothing renders.** The `.face` groups are
   inside `v-if="variant === 'blush'"`, and **no shipped surface passes `blush`**:
   AttributionCard mounts the default, CelebrationHeart passes `celebration`. Measured on the
   built dist with the card opened, both engines, both media states — `.crayon-heart` mounts
   twice, `.crayon-heart .face` zero times. The arm is correct source hygiene and costs
   nothing, but **the family's runtime PRM claim rests on two arms plus the sparkle
   narrowing, not three**, and R4 §5's "3 unarmed shipped transitions" over-counts by one.
3. **Cost is over the stated ceiling on two of three axes.** 30 tracked files + 1 new
   (ceiling 20); +195 / -97 (ceiling +200 / -80 — deletions overrun by 17, in the good
   direction). **Bundle is well under**: `index-*.js` 215.29 to 215.40 kB (**+110 B**,
   ceiling +400), gzip 74.32 to 74.35 kB (**+30 B**, ceiling +150). The file count is what a
   grammar applied at 55 sites costs; the synthesizer should either raise the ceiling or cut
   the 16 incidental sites into their own row.
4. **The hue census was not run to a comparable number.** Its probe writes into the banked r0
   census dir and its readings were taken against a dev server, so a preview-dist run is not
   comparable. It executed 8/8 green; **it also overwrote seven banked r0 files, which were
   restored byte-for-byte from the committed copies and verified.** Colour identity rests
   instead on `theme-quadrants` 40/40 (below) and on the diff carrying no colour token.
5. **The exit-fold mechanism row is still uncured**, as the research assumed it would be. The
   branch's EXIT(cancel) roster shows `logo-menu` gliding its full 520 ms with no
   `.board-peek-host` beside it, while the ENTER roster carries both. `App.vue:447` is
   somebody else's cure; this family's curve ruling for the revived fold (throw, glass) is an
   audition, not a naming.
6. **Both charter ports were occupied.** :4246 and :4248 are held by worktrees `-0fc-48` and
   `-0fc-49`. Only :4244 was free in 4230-4249, so the two dists were served sequentially on
   it, each identity-verified by its `index-*.js` hash before every probe
   (`index-BEc8x9evhSKc.js` branch / `index-9rZPzI5DEcpe.js` HEAD).

---

## 8 · π identity — the family claims zero rest pixels, and pays for the claim

| instrument | result on the branch dist |
| --- | --- |
| **e2e visual goldens** | **4/4 passed**, unmoved (the estate's own settled/PRM/DPR2 contract) |
| **filter-census + theme-quadrants** | **40/40 passed**, both engines, on the built dist |
| **dock sheet crop, PRM-frozen** | **byte-identical HEAD vs branch**, all four of chromium/webkit x light/dark |
| dock sheet crop, boil live | 0.46 % of px differ >2, worst channel 118 — the ~8 Hz boil at an arbitrary beat, which is why the frozen capture is the one that answers |
| `check-font-coverage` | GREEN, no rendered string moved |
| rest rect, both engines both themes | identical to the pixel (§5) |

---

## Files

- `proto/mot-ladder-pass1.diff` · `proto/mot-ladder-pass1.diffstat.txt` — the patch
- `proto/check-motion-bands.mjs` — the gate as it stands (also the untracked file in the worktree)
- `probe/i6-standalone.mjs` — I6 lifted out of the playwright battery, `--widened` / `--no-dev`
- `probe/i3-glass-curve-home.widened.mjs` — i3 taught `rungs.<name>` and reading the WAAPI callers instead of a pinned dead key
- `probe/dock-settle.mjs` — the +700 ms settle, the rest rect, and the identity crops (`FREEZE=1`)
- `probe/pixdiff.mjs` — rest-state pixel delta (an md5 answers the boil, not the design)
- `probe/heart-pose.mjs` — the CrayonHeart pose, which is how §7.2 was found
- `readings/` — the gate both trees, PRM both trees, frames both trees, six flips x2 both trees, dock settle both trees
- `frames/` — two crops, PRM-frozen, both engines, 43.9 KB + 65.9 KB
