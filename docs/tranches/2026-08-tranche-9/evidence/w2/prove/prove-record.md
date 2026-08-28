# T9-W2 — THE NON-AUTHOR PROVE RECORD

The four cure lanes' reports are not evidence here; the tree is. Every figure below was
re-derived in this lane, on this tree, against a dist this lane built.

    TREE        4dd9ec9c + the wave's uncommitted cures (46 modified, 11 untracked)
    BASELINE    ../born-red-head.txt — six product rows RED at HEAD `1453eb60`, both engines
    DATE        2026-08-28
    ARTIFACT    npx vite build --outDir dist-w2-prove --logLevel warn        exit 0
                npx vite preview --outDir dist-w2-prove --port 4241 --strictPort --host 127.0.0.1
                the default suite ran against `npx vite --port 4242 --host 127.0.0.1`
                (the README pins `npx playwright test`, whose webServer is `npm run dev`;
                :3000 is out of this lane's 4230-4260 band, so the same dev server was
                bound in band and `PLAYWRIGHT_BASE_URL` pointed at it. Ports :3000/:3001
                were never touched; zero Safari focus theft.)

The run configs are scratchpad twins of the shipped ones — same engines, same timeouts,
same `testIgnore`, same projects, `webServer` dropped and `testDir`/`globalSetup` made
absolute. Nothing in `web/frontend/` was added to carry them.

## 1 · THE BATTERY — five of six rows GREEN, one RED

    npx playwright test --config <scratchpad>/w2-prove-viewport.config.ts
    exit 1 · 26 passed · 2 failed · 19.3s

| row | charter | cell(s) | born-RED | now | verdict |
|---|---|---|---|---|---|
| 1 | §2.1 | 1440×640, 844×390 | visFrac 0.3023 / 0.0 | **visFrac 1.0000, all five names, both cells** | GREEN |
| 2 | §2.2 | 844×390, 812×375 | 0 openers, deal +192px | **drawerTab visible, box 48×92, both cells** | GREEN |
| 3 | §2.4 | 1024×768 | theft CONFIRMED, 1 of 1 | **overlaps [] · thefts []**, positive control fires | GREEN |
| 4 | §2.5 | 1440×900 | 9 overlaps, max 68.4% | **1 overlap, 11.4%** — see §2 | RED |
| 5 | §2.6 | 1440×900 rail, 375×667 drawer | tagVisFrac 0.0 both | **position sticky · tagVisFrac 1.0000 both** | GREEN |
| 6 | §2.7 | 390×844, 375×812, 430×932 | gap 54.8px vs ≤8 | **gapToPaper −6.0 at all three poses** | GREEN |
| B1 | M01 | 390×844 | banked | banks; the ≥44px floor holds | PASS |
| B2 | §2.3 | 1440×900, 1280×800 | banked | banks; the card still folds | PASS |

Both engines agree on every row, verdict and number — chromium and webkit differ only in
sub-pixel metrics (§2.5's residual reads 1192.1px² chromium / 1190.6px² webkit).

Notes taken while proving, none of them a row:

* §2.2's cure also collapsed the document: `docScrollH` 1157 → **409** at 844×390 (innerH
  390). The N1 status residue the charter said "rides the same media-arm work" is
  **unmoved at 19.19px** under the fold. No row asserts it; it is still open.
* §2.7's gap is NEGATIVE (−6.0) — the tongue tucks under the paper rather than meeting it,
  which is `board-covisibility.spec.ts`'s re-aimed tuck arm `[−8.5, −4]`, independently
  measured here at −6.00.
* the §2.6 rail crop shows the `new game` tag still pinned while the `pencils` group is the
  one on screen. §2.6 asserts a tag stays while its group is in view; it does not assert a
  tag LEAVES when its group does. Not a row — a question for W7's voice.

## 2 · THE ONE RED — §2.5, and it is the INSTRUMENT, not the cure

    Error: a tape must flip, shift or yield rather than cover a control;
    measured [{"tape":"new game","own":false,"target":"Medium","frac":0.114,"px":1192.1}]

Eight of the born-RED nine are gone outright, including both figures V7 opened the family
with (the invite note's 68.4% of `Live`, the bar verbs' 16.9–57.4% of `Play`). Every
HOVER note is cured — the berth under the bar's rule holds. What is left is one
ALWAYS-LAID compartment tag, and it is not the defect the row was built to catch.

THE STATE, reproduced and measured (`probe25b.mjs`, both engines):

    after hover: "Normal"      scrollTop 327   data-fold-above TRUE   --card-pad-t 20px
    card box        [919, 174.2, 330, 640]     → clip edge y = 174.2, solid band 174.2-194.2
    "new game" tag  [952.3, 175.7, 65.9, 23.9] position: sticky
    "Medium"        [947,   155.8, 274,  38  ] → only y 174.2-193.8 is inside the card at all
    overlap         y 175.7 → 193.8, 18.1 × 65.9 = 1192.1px²

The whole overlap lies inside `.controls-card::before` — the §2.3 fold sentinel, z-30,
`opacity: 1` under `data-fold-above`, painting **solid `--color-card` across the full 20px
padding band** before it fades. Medium's entire in-card extent (174.2 → 193.8) sits under
that solid strip. **Medium is 100% invisible at this scroll state whether the tape is there
or not.** `residual-25-chromium.png` is the crop: the pinned tag on plain paper, and no
difficulty option painted anywhere near it.

Three independent grounds that the row over-asserts here:

1. **The reserved band is paper by construction** — the adjudication's own graft to
   §2.3/§2.5. The tape covers paper, not a control.
2. **The tape lane law as adjudicated** permits a tape to cover "air, drawn frame, or the
   control it names". `Medium` lives inside the `new game` well; the tag is that
   compartment's name. The row computes `own` as `el.contains(tape)` — DOM descent — and
   then never uses it in the assertion.
3. **The cure lane declared this exact state and banked its crops.** `../delta/fold-and-tape.md`
   §2 describes `scrollTop 327` verbatim: "the tape is PINNED at the case edge and the chips
   dissolve into card colour under the top sentinel". `fold-card-mid-1440x900-{before,after}.png`
   are that state.

§2.5 and §2.6 are in structural tension: §2.6 requires the tag to pin inside the
scrollport, and a pinned box inside a scrollport necessarily overlaps whatever scrolls
beneath it. The census has no occlusion term, so it cannot tell "a tape over a control"
from "a tape over the chrome that already hid the control". At HEAD the tags never pinned,
so the state did not exist and the census was honest.

**THIS LANE DID NOT EDIT THE ROW.** The call turns on interpreting the adjudicated lane law
("the control it names"), which is the chair's ruling and not a prove-lane arithmetic fix —
and a prove lane that greens its own last red is the first species of lie this lane was sent
to hunt. The exact correction is in the handoffs, unapplied.

THE CORRECTION, AND THE ONE THAT WAS REJECTED. The obvious one-liner — widen the row's
unused `own` field from "the tape is a DOM descendant of the target" to "the tape and the
target share a `.tray-well`" — was tried on paper and **REJECTED**: the invite note and the
`Live` option share the players well, so that rule would have excused the family's own
flagship 68.4% defect. The surviving correction is narrower and is stated in the handoffs:
discount only overlap area lying inside the scrollport's declared top chrome band, and only
while that band is painted. At rest `data-fold-above` is FALSE (measured), so all nine
born-RED overlaps stay fully counted and the row keeps every ounce of its power.

## 3 · THE REGRESSION NET — 437 tests, 8 failed, 4 distinct rows

    npx playwright test --config <scratchpad>/w2-prove-default.config.ts
    exit 1 · 427 passed · 8 failed · 2 skipped · 2.3m   (437 = the derived pin)

| row | engines | classification |
|---|---|---|
| `viewport-law.spec.ts:396` §2.5 | both | this wave — §2 above |
| `drawer.spec.ts:390` `<1024 landscape: no tab…` | both | this wave — a SUPERSEDED spec left un-re-aimed |
| `masthead-alignment.spec.ts:108` M17 (light) | both | this wave — a DEAD PROXY, the ink is unmoved |
| `masthead-alignment.spec.ts:108` M17 (dark) | both | this wave — same |

All four are attributed to this wave BY MEASURED MECHANISM, not by elimination: §2.5 is
this wave's own new spec, and §3.1/§3.2 below each name the cure that moved the box the row
reads. This lane did not build a HEAD dist, so "no pre-existing red" is not claimed as a
run — it is inferred from those three mechanisms plus the born-RED record, which found
`check-doc-truth` the only gate red at HEAD. Two of the four are specs the cures superseded
without re-aiming.

### 3.1 `drawer.spec.ts:390` — the shipped rung the cure retired

At 900×500 the row asserts `await expect(page.locator('.drawer-tab')).toBeHidden()`. Its
own name is the superseded law: "LANDSCAPE holds the shipped rung … no tab". §2.2's cure
puts the tab in short landscape — that IS the born-RED §2.2 cure — and the adjudication
declared the supersession: "the T5 pass-6 landscape in-flow card rung is superseded by the
dock pose extending to every mobile orientation (M10's 'every mobile pose', verbatim)".
The DELTA was declared and the spec was never re-aimed.

### 3.2 `masthead-alignment.spec.ts:108` — M17 reads a box the keep deliberately moved

    Error: head rule at 1280 (light)   expect(52).toBeLessThan(0.5)

`HEAD_PROBE` (`:35`) reads `box(document.querySelector('.corner-right button'))`. The keep
split ORNAMENT from CONTROL exactly as adjudicated, so the button is no longer the
ornament's box. Measured this lane (`probe-masthead.mjs`), 3 cells × 2 themes × 2 engines:

| cell | badge.top | button.top | ornament (`.toggle-rest`) | M17 as written | THE INK |
|---|---|---|---|---|---|
| 1280×800 | 12 | 64 (104px) | 12 (208px) | 52 ✗ | **0.00** ✓ |
| 1440×900 | 12 | 64 (104px) | 12 (208px) | 52 ✗ | **0.00** ✓ |
| 390×664 | 0 | 10 (44px) | 0 (64px) | 10 ✗ | **0.00** ✓ |

Identical in light and dark, chromium and webkit. **The celestial still hangs from the head
rule to 0.00px at every cell.** M17's law holds on the surface it names; its selector no
longer names that surface. `--toggle-size` is unchanged (13rem desk / 4rem phone) and the
ornament box is still 208/64px — the keep moved the control, never the ink.

## 4 · π IDENTITY

| gate | result |
|---|---|
| `npx playwright test -c playwright-golden.config.ts` | **4/4 passed, exit 0** — logo wordmark, toggle crest (dark, moon), grid corner, single cell |
| `git status --short e2e/goldens/` | empty — **no baseline moved on disk**, nothing re-minted |
| `filter-census` chromium + webkit, built dist | **12/12 passed, exit 0** |
| live-filter census, re-counted by hand at 1280×800 | **9 non-zero-area sites**, both engines — wobble-heart, toggle-sun, toggle-moon, 4× boil-pose, sparkle-icon. The budget did not grow. |

The toggle-crest-dark golden is the 0.017 darwin soul floor, and it passes — which
discharges the adjudication's RISK CARRIED FORWARD on §2.4 (the bake ref had to leave the
button or the stack would bake at 104 and paint at 208). `celestialRef` sits on
`.toggle-rest`, measured 208px, and the crest golden is unmoved.

## 5 · GATES

| gate | exit | figure |
|---|---|---|
| `npx vitest run` | **0** | `Test Files  60 passed (60)` · `Tests  754 passed (754)` |
| `npx vue-tsc --noEmit` | **0** | clean |
| `node scripts/check-unit-count.mjs <report>` | **0** | 754 ≥ 661; band 641 owed on 754 |
| `node scripts/check-pw-projects.mjs` | **0** | 8/8 arms; chromium 221, webkit 216; 30 specs, 508 resolved |
| `node scripts/check-evidence-policy.mjs` | **0** | every image, wave and dist within policy |
| `node scripts/check-doc-truth.mjs` | **1** | 2 RED — both the e2e count pins, see handoffs |

`vitest` is 754/60 against the stamp's 735/57; the delta is the three untracked Poster
tests, which belong to another wave, and the band absorbs it without a restamp.

## 6 · THE TAP FLOOR — the keep never falls under 44px

`--toggle-hit: max(2.75rem, --toggle-size / 2)`, measured at eight rungs, both engines:

    1920×1080 · 1440×900 · 1280×800 · 1024×768   control 104×104   ornament 208
     844×390                                     control  44×44    ornament  80
     430×932 · 390×844 · 375×667                 control  44×44    ornament  64

`border-radius: 50%` and `pointer-events: auto` at every rung. The `max()` is load-bearing
at the 80px rung, where half the ornament is 40px and the floor clamps it to 44. The drawer
tongue is 92×48 portrait / 48×92 landscape. **No target under 44px anywhere.**

## 7 · THE LIE HUNT — four species, three clean

| species | verdict |
|---|---|
| a probe row weakened to pass | **CLEAN** |
| a cure that moved a golden | **CLEAN** |
| a tap target under 44px at the new scale | **CLEAN** |
| a sticky tag that pins on chromium but not webkit | **CLEAN** |

**Species 1.** `viewport-law.spec.ts` is untracked, so there is no git baseline — the
born-RED run's own line numbers are the baseline, and every one of them still lands:
describes/tests at 133/136, 192/195, 284/287, 393/396, 527/530, 562/565, 616/619, 672/675,
750/753, and the six failing assertions at :167, :264, :376, :462, :553, :590. Every
threshold matches the numbers born-RED states in prose: `LEGIBLE = 0.9` ("floor: visFrac >
0.9"), `EDGE_GAP = 8` ("floor: ≤8px"), the 40px push, the 120px unreachable bound, the
0.5px² sub-pixel floor, the five-slot and four-tag witnesses, and §2.4's positive control.
Nothing was loosened.

The one e2e spec a cure lane DID edit — `board-covisibility.spec.ts` — was audited line by
line and is a **strengthening**: mark A's three arms (membership / one line / in band)
become five (`onEdge`, `tuck` bounded at both ends, `overhang`, `floorFail`, `pressed`),
and the old lock's PASSING state is installed as the new lock's in-run inversion control.
It is a declared DELTA (M10) and it went up, not down.

**Species 2.** Goldens 4/4 green and byte-unmoved on disk; the census holds at 9.

**Species 3.** §6 above.

**Species 4.** §2.6 reads `position: sticky` and `tagVisFrac 1.0000` on the rail AND the
drawer in BOTH engines; §2.7 reads `gapToPaper −6.0` at all three poses in BOTH engines;
§2.4's census empties in both. No arm of this wave lands on one engine only.

The webkit focus ring was the one real suspicion: `focus-ring-1024x768-{head,cured}-webkit.png`
and `pi-celestial-1024x768-{head,cured}-webkit.png` are all four the same bytes
(`5c407642`), i.e. the focused webkit crop is the unfocused one. Chased and DISMISSED —
`../delta/toggle-keep.md` §5 discloses it (macOS Full Keyboard Access is off, so a Tab walk
does not arm `:focus-visible` in WebKit), and forcing focus proves the ring is real in both
engines: `outline 2px solid`, `outline-offset 54px`, `:focus-visible` matching, identical
chromium and webkit. 104 + 2×54 = 212 = 208 + 2×2 — the ring traces the ornament's edge, as
designed. An honest disclosure, verified rather than taken.

## 8 · THE DELTA LEDGER

33 crops banked, **every one within the 150KB cap** (largest 109,935 B), wave total
1,274,619 B against the 2,097,152 B cap; `check-evidence-policy.mjs` exits 0. Two crops are
added by this lane (`residual-25-{chromium,webkit}.png`, 15,324 / 21,903 B).

Claimed changes MISSING their crops, or crops missing their declaration:

* **§2.1 (deck) and §2.6/§2.7 (mobile) banked crops but wrote no ledger.** `delta/` holds
  `fold-and-tape.md` and `toggle-keep.md` only. The deck lane's declared DELTA (the caption
  letterhead move) and the mobile lane's two (the covisibility re-aim, the landscape rung's
  supersession) have pixels and no prose saying what the pixels claim.
* **§2.7 is cropped at one of its three cells.** `tab-390x844-{before,after}` exists;
  375×812 and 430×932 do not. The gap measured identical at all three, so one cell is
  defensible — but the gate spine says "at the probe's own cells".
* `landscape-844x390-open-after.png` has no `before` twin. Defensible: the pose it shows did
  not exist before.
* **The M17 break has no crops at all** — it is a defect this lane found, not a change any
  lane claimed.
