# PAL-WALK · pass-6 adversarial critique (§11c, the hue walk; the palette's leader)

I didn't write the charter or the prototype. Every number below that isn't attributed to the lane is mine, taken
on 2026-09-23 on my own servers in Chromium and WebKit. Base and π control: `74a2b5d9`.

**The rig.** I worked on replicas, never on the work tree `wf_308fa864-c94-1`:

- **The replica.** `git archive 74a2b5d9` plus the tree's `git diff --binary` (sha1 `83bed113…`, 84,569 B) plus its
  two untracked files. `diff -rq` of `src/`, `e2e/` and `scripts/` against the tree: identical.
- **The pass-6 delta.** `pass5/prototype/PAL-WALK/pass5.diff` applied to an archive differs from the tree in exactly
  four files (`e2e/peer-walk.spec.ts`, `scripts/check-peer-arcs.mjs`, `BoardHost.authors.test.ts`, `useSession.test.ts`).
  Every product file is `cmp`-equal, so no product source moved in pass 6.
- **Untouched at return.** The tree's `git diff --binary` sha1 is still `83bed113…`, with 18 status entries. I ran no
  git in `w7-control`. Its dist `index-CubiZsMVSwTc.js` was previewed read-only.

| port | what | pid (killed, port read free) |
|---|---|---|
| 4236 | replica, dev, no HMR, no watch, restarted after each plant | 97601 (the last of five recorded) |
| 4237 | control `74a2b5d9` archive, dev, private cacheDir | 67089 |
| 4238 | my clean build of the replica: `index-iqdYCvIZwvfI.js`, 43 files (pass 5's, reproduces) | 67033 |
| 4239 | `w7-control` dist `index-CubiZsMVSwTc.js` (verified by hash) | 67062 |

Every browser row used payload `ATMuMzkx…YxMDYx` (the spec asserts its decode) with B's id pinned: `p-0000000b0b0b`
→ `quickest-rodent` and `p-00000000002e` → `quintessential-guineafowl`. Instruments are in `critique/PAL-WALK/instruments/`
and condensed readings in `critique/PAL-WALK/readings/`. **No frame is banked.**

**Verdict: ADVANCE. Convergence: 85%** (up from 84).

All four pass-5 rows reproduce as closed on my servers, and so do the pass-5 plants. But the landed §C row, the
family's central gate, is still a gate that can't see its subject class, and the dark name loses to HEAD on the
estate's own text statistic.

- **The faint-name hole.** §C asserts the SPEC colour against the painted ground. A name painted at 65 % or 80 %
  stays GREEN while its painted glyph median falls to 3.358 / 4.189 in dark.
- **The loss to HEAD.** On the §2.11 glyph-text statistic, the dark name reads below HEAD's in 16 of 16 rows at
  DPR 3 and 14 of 16 at DPR 1.
- **Two more gates enumerate their plants.** Check 4 and the L6 PROPOSED diff are each cured for their named plants
  but not for the class.

---

## 1 · Re-measured (my servers, both engines)

The first two rows are the pass-5 PLANT, run first (LAWS P5).

| row | lane | mine, chromium | mine, webkit |
|---|---|---|---|
| Pass-5 plant: check 4 X1 (`var(--color-foreground)` in gameCell.css), X6 (`color-mix`), X2 (`:root` band in `index.html`), run bare, restored by sha1 | exit 1 ×3 | **exit 1 ×3**; clean exit 0 before and after | — |
| Pass-5 plant: §C (a) translucent paper, same batch as the negative | RED both | **RED**: dark cell 11, 4.359 | **RED**: 4.364 |
| §C negative control, whole file, restored tree, dpr 3 | 10/10 webkit, 3/3 chromium | **1/1 green** plus 2 §C-only | **3/3 whole-file green**, plus 3 §C-only after restores (batches 2–4) |
| same, dpr 1 · dpr 2 | green | **green · green (§C)** | **green** |
| WebKit top-row flip (cell 8) over all my webkit runs | 11.891 / 5.691, noise 0 | — | **11.891 / 5.691 on every run**, noise 0, off the ink line 0. C1 is closed under the freeze |
| B-TAPE dark minimum (spec vs painted ground), dpr 3, per slug | 5.691 / 5.604 chromium, 5.691 webkit | **5.691 (quickest) / 5.604 (quintessential)** | **5.691 / 5.691** |
| HEAD `74a2b5d9` name, same payload, same cells | dark 4.589/4.594 · light 3.382/3.418 | **dark 4.589 · light 3.382** (dpr 1 and 3) | **4.594 · 3.418** |
| Build identity, clean archive, outside the tree | `index-iqdYCvIZwvfI.js`, 43 | **`index-iqdYCvIZwvfI.js`, 43 files** | — |
| Filter census, built dists, both themes | dark 1 both trees (crayon-heart ×2); light 6/6 | **tree dark exit 1 · control dark exit 1**, identical 2 failed (G3.1/G3.3, `svg.crayon-heart.idle saturate(0.85)`); light 6/6 both | **same** |
| Units `BoardHost.authors` + `useSession` | 55/55 | **55/55**; plants K6/K6b/K13 (ink re-bound upstream of the admitted site) each **exit 1** (1 test), restored 55/55 | — |

**The pre-return battery, run bare** (`readings/battery.txt`). The control's exit code (the `74a2b5d9` archive) is after the bar:

| gate | tree \| control |
|---|---|
| lint:lanes | 0 \| 0 (my first tree run exited 2 because the copy lacked `.github`, a rig fault; it reads 0 re-run) |
| lint:theme-tokens · lint:sleep · test:e2e:projects · check-pw-projects | 0 · 0 · 0 · 0 \| 0 · 0 · 0 · 0 |
| lint:arcs | 0 \| 1 (the script is absent at base) |
| lint:copy · `check-copy-register` bare · lint:motion | 0 · 0 · 0 \| 0 · 0 · 0 |
| lint:theme-selectors · lint:ink · lint:catch · lint:live-regions | 0 · 0 · 0 · 0 \| 0 · 0 · 0 · 0 |
| check-property-block (pass-6 instrument) | 0 \| 0 |
| undefined-token-census (pass-6 instrument) | **1** \| 1. The tree has the STALE `--refuse-dur` row plus `GameBoard.vue:1246 --color-peer-cursor-ink`, which is the lane's PROPOSED fourth row (A.3 form). The control has the STALE row only |
| knip · `npm run lint` (the scoped prettier form) | 0 · 0 \| 0 · 0 |
| `eslint .` | 0 \| 0 (the first tree run exited 1 on MY scratch spec inside the copy; it reads 0 with that file moved out) |

---

## 2 · What did not converge

### W1 · §C can't see a faint name. It gates the spec colour, not the paint

The row asserts `t.spec === ring`, `corePx > 4 % of the box`, and `worst ≥ 4.5`. Here `worst` is the SPEC colour's
ratio against the painted ground under each glyph pixel. So the name's own paint only has to exist: it never has to
be legible. The glyph-text statistic (§2.11: the painted pixel against its own ground, core median) is printed and
never asserted.

The faint-text plant keeps the colour and fades the fill:
`-webkit-text-fill-color: color-mix(in srgb, currentColor N%, transparent)` on `.attribution-tape :deep(.washi-label)`.
It's lawful for this instrument, because the bare shot sets `color: transparent` and so is truly bare.
(`readings/batches.txt`, batch 2, restored by sha1, then the negative run green in the same batch.)

| plant (chromium, dpr 3) | §C exit | asserted minimum | painted glyph-text core median, dark | fraction of core < 4.5 |
|---|---|---|---|---|
| none (the tree) | 0 | 5.604 / 5.691 | 5.629 / 5.691 | 0.137–0.145 |
| **fill at 80 %** | **0 (GREEN)** | 5.604 / 5.691 | **4.189 / 4.235** | **1.000** |
| **fill at 65 %** | **0 (GREEN)** | 5.604 / 5.691 | **3.358** (light 4.376) | **1.000** |
| fill at 15 % | 1 | — | — | reds on "the name paints", not on legibility |

This is pass-6 chair A.5.3 ("existence is not visibility") in its text form. It's also the same hole pass 5 found in
the check's syntax, now in the photograph. The fix is one assertion: the core median ≥ 4.5 at dpr 2 and 3 (the tree
reads 5.604–11.899), with this plant as the in-batch negative.

**WebKit declared void.** I couldn't make the plant lawful in WebKit in three shapes:

- `currentColor` inside `color-mix` barely moved the paint (11.548 vs 11.891).
- A `var()` mix leaves the bare shot inked (0 px moved; it reds on "the name paints").
- `rgb(from currentColor … / 0.65)` paints black in the bare shot (it reds on a dark "ground").

The hole is in the assertion's logic, so it doesn't depend on the engine.

### W2 · On the §2.11 text statistic, the dark name loses to HEAD. B-TAPE and the estate row quote only the minimum

`readings/glyph-dpr3.txt` and `glyph-dpr1.txt` compare the same payload, slug and cell, tree vs control. The number
is the core median of the painted glyph against its own ground (the fraction of core under 4.5 is in the files).

| | dark, tree | dark, HEAD `74a2b5d9` | rows where the tree loses |
|---|---|---|---|
| chromium dpr 3 | 5.629–5.691 | 5.899–5.991 | **8/8** (−0.21 to −0.36) |
| webkit dpr 3 | 5.691 | 5.991 | **8/8** (−0.30) |
| chromium dpr 1 | 4.010–4.769 | 4.086–4.821 | **6/8** (−0.02 to −0.10) |
| webkit dpr 1 | 5.630–5.650 | 5.718–5.899 | **8/8** (−0.09 to −0.27) |

- **The variable is the INK, not the paper.** Arm (a), the translucent paper on this tree, reads the same median
  (5.691) as arm (b). The name's dark ink is `oklch(0.79 0.0531 181.79)` against HEAD's `oklch(0.8 0.11 137.5)`.
  Registry-v5 §2.7 books TIN's L ≥ 0.83 arm, or the chair raising the pair's dark half, as the name's cure.
- **The paper still pays in the minimum.** It lifts the worst pixel from 4.589 to 5.604–5.691 over the grid line.
- **The light name wins by a wide margin.** It reads 11.891–11.899 against HEAD's 5.025–5.067 at dpr 3.
- **The rows are misquoted.** The README and the spec comment quote the control at dpr 1 as "4.078–4.241" or "4.275".
  Those are cell 8 only; at cells 11, 12 and 14 the control reads 4.666–4.821.
- **LAWS P5 applies.** A ballot's firing default must not lose to the control on the same painted statistic, or the
  row names the loss with both numbers (A.6).

### W3 · At dpr 1 the name sits under 4.5 on the text statistic, and it's parked on a rung it doesn't use

Chromium dpr 1, cell 8 (the top-row flip) reads:

- **dark:** 4.010 (quickest) and 4.219 (quintessential), with 0.58–0.75 of the core under 4.5;
- **light:** 4.124, which the lane didn't state. The other cells read 5.440–6.796.

The spec comment says the statistic is "the estate's row (the hand's tag rung, pass6/CHAIR-RULINGS §1.4 and A.4)".
The tape's name isn't set in the tag rung. `SheetWashiLabel.vue:98–100` sets it at `--type-small`, weight 600. The tag
rung is `--type-tag` (`:175`), and it's used only by `anchor="tag"`. So the parking cites a row that doesn't hold this
text. The chair rules which it is. Until then §2.11's median is the gate, and the shipped tree fails it at chromium
dpr 1, cell 8, in both themes. The control fails there too: 4.086/4.241 dark, 2.718/3.051 light.

### W4 · Check 4 is cured for index.html and for its named plants, but not for the class of a cascade source outside `src/`

These were run bare on an attack copy, each restored by sha1 (`readings/check4-attacks.txt`, `readings/build-and-mint.txt`).

- **K1 · exit 0.** `public/peer.css` carries `:root{--peer-ring-l:.2} .game-cell{--color-peer-cursor-ink:var(--color-foreground)}`,
  and `index.html` links it with `<link rel="stylesheet" href="/peer.css">`. This is X2's class, one directory over.
  `sourceFiles()` reads only `src/`, `e2e/` and `index.html`.
- **The mint clause skips `public/`, and a candidate there ships.** I appended `<i class="[--color-peer-cursor-ink:red]">`
  to `public/404.html`. `check-peer-arcs` read it bare and exited 0. `vite build` moved the identity to
  `index-CEdHn5zBavob.js` (the lane's own pass-6 mint hash), and `index-D7qQiJYmxakR.css` carries
  `.\[--color-peer-cursor-ink\:red\]{--color-peer-cursor-ink:red}`. The skip list names `public` explicitly.
- **K12 · exit 0 (the digit half).** `.game-cell .glyph-svg { --color-user-ink: var(--color-foreground) }` aliases the
  peer's DIGIT ink on a descendant. Clause (v) keys only on `--color-peer-*` and `--color-player-*`. Half of the
  player's colour travels under the house name `--color-user-ink`, which is declared at exactly three sites today
  (`index.css` ×2 and `inkFor`'s return), so a site rule can key it.
- **Caught by tier 2, not by check 4, and that's fine.** K6/K6b re-bind BoardHost's local `ink` upstream of the
  admitted `ink` site, and K13 re-binds `pair[1]` before `inkFor` returns. Check 4 exits 0 on all three, but
  `BoardHost.authors.test` and `useSession.test` red each one (1 test each) in CI.

### W5 · The L6 PROPOSED diff enumerates its plants

This is the law the chair lands at the fold (`readings/l6-attacks.txt`, the lane's `law-probe.PROPOSED.mjs` with
`LAW_FE` on an attack copy):

| plant in index.css / playerIdentity.ts | L6 | check 4 |
|---|---|---|
| a dark arm on `.dark .game-cell { --peer-ring-l: 0.2 }` | **GREEN** | 1 |
| a dark arm on `html.dark { … 0.2 }` | **GREEN** | 1 |
| a light arm on `.board-cells { … 0.4 }` | **GREEN** | 1 |
| `inkFor` returns a fixed `oklch()` table, with STEP, `chromaAt`, `inGamut` and `RESERVED_ARCS` left standing | **GREEN** | 1 |

- **The pair half** reads only `@theme {`, `:root {` and `.dark {` blocks, so an arm under any other selector is invisible.
- **The formula half** greps spellings (`const STEP`, `Math.sqrt(5)`, `function chromaAt`), and a palette behind
  them passes.

CI's check 4 catches all four, but the law row's claim, "every ring ARM index.css publishes paints at the section's
pair", is false as written. It's the same shape as the pass-5 finding ("cured for those plants, not for the class").

### Carried, declared by the lane (I agree with each)

- **TIN's `?selfink`** still reads the URL on its own tree (`c94-2 useSession.ts:680`). WALK and SELF both name
  `SELF_TAKES_A_HAND`. The re-point is TIN's or the fold's.
- **The DARK filter census** is red on both trees on `crayon-heart` ×2 (I reproduced it). The deletion is the fold's first pick.
- **The frames are Chromium only.** In frame 3 the focus sits on cell 11 in the room of eight and cell 21 in the room
  of four. The lane declared the focus box but not the row, column and box tint bands that follow it. I sampled the
  crop: at (380,60) the room of eight reads `(253,253,252)` and the room of four `(240,245,249)`, and at (60,160) the
  reverse. That is a second visible variable in the gestalt pair. Frames 2 and 4 are lawful: in frame 4 every sampled
  tint-band point matches between the arms (only the frame stroke and the inks differ), and frame 2 is one inline
  background.
- **The undefined-token census.** The fourth INHERITED row is PROPOSED (A.3 form) and not applied.
- **Tier 3 is local (O-12).**

---

## 3 · Checklist

| item | verdict |
|---|---|
| vacuous convergence | clear: every row carries a number and a control, and I reproduced them |
| spec-cites-itself | clear |
| gates that cannot fail | **HIT.** §C can't fail on a faint name (W1). L6 PROPOSED can't fail on an arm under a new selector or a palette behind the formula's spellings (W5). Check 4 can't fail on `public/` or the digit half (W4) |
| the elegant-reduction trap | **mild.** "The paper is the estate cure" holds for the minimum, and the median's loss is left to TIN or the chair without being stated (W2) |
| legacy aliases | clear: the §A HEAD comparator and `CAPTURE_BAND` were deleted, not renamed |
| masked fallbacks | clear. Freezing §C at the test is lawful: the tape, paper and name aren't motion-gated (no reduced-motion rule touches `SheetWashiLabel` or `.attribution-tape`), and the ground is opaque paper |
| unverified gestalt | **mild.** Frames are Chromium only, and frame 3 carries an undeclared tint-band variable |
| consumer-less substrate | clear: `oklchBytes` is consumed, and knip reads 0 |
| the generic default | clear |
| π | clear. No product byte moved in pass 6 (four test and script files; the build is byte-identical), so pass 5's 854-node 0/0/0 π on the same dist stands |
| the constraint it forgot | **AA HIT on the named statistic** (W2, W3). filterBudget: no filter added, and dark red on both trees is inherited. M16: `check-copy-register` bare 0 on both. @property: none registered (check-property-block 0). Undefined-token census: the one row, declared. W2's mechanics: untouched. Decided history: L6 amended (W5) |

## 4 · Open gaps, each a sentence that closes it

1. **W1.** Assert §C's glyph-text core median ≥ 4.5 at dpr 2 and 3 in both engines (the tree reads 5.604–11.899),
   with the `color-mix(currentColor 65%, transparent)` fill plant as its in-batch negative. Chromium reads it GREEN
   today at a painted 3.358 dark. For WebKit, add a text-only fade that follows `color` so the bare shot stays bare.
2. **W2.** State in B-TAPE and the estate row that the dark name's glyph-text median loses to HEAD: 5.629–5.691 vs
   5.899–5.991 at dpr 3 (16/16 rows), 4.010–4.769 vs 4.086–4.821 (chromium dpr 1), 5.630–5.650 vs 5.718–5.899 (webkit
   dpr 1). Either bind the name to TIN's L ≥ 0.83 arm and show it no longer loses, or name the loss with both numbers.
   Correct the "control reads 4.078–4.241 / 4.275" quote to all four cells.
3. **W3.** Get the chair's ruling on whether the tape's name (`--type-small` 600, not `--type-tag`) belongs to the
   tag-rung estate row. If it doesn't, the chromium dpr-1 cell-8 readings (dark 4.010/4.219, light 4.124) are this
   family's red, to cure or book.
4. **W4.** Make check 4 read every stylesheet `index.html` links and everything under `public/` for clause (v) and for
   the Tailwind mint, with K1 and the `public/404.html` candidate as self-test rows. Key `--color-user-ink` by site
   (`index.css` ×2 and `inkFor`'s return), with K12 as the negative.
5. **W5.** Amend the L6 PROPOSED diff before the chair lands it:
   - the pair half counts every ring-arm declaration in `index.css` whatever its selector, and reds any outside the
     two theme blocks;
   - the formula half imports `inkFor` (as `check-peer-arcs` does) and checks the 144 hues against the golden step
     over the open arcs;
   - LA1–LA4 ship as its plants.
6. **Frame 3.** Re-shoot it with the focus on the same cell in both rooms, or caption the tint band.
7. **Carried, not this lane's to close alone:** TIN's `?selfink` re-point (fold), the `crayon-heart` dark deletion (fold pick 1), the census's fourth row (integrator).

## 5 · Strengths (earned)

- **C1 closed by the right mechanism.** WebKit's top-row flip reads 11.891 / 5.691 on every run I took, noise 0. The
  ABBA diagnosis is written into the spec, and the pages are frozen at the test only, with lint:motion green.
- **C2's class closed for its named shapes.** X1, X6 and X2 red. The three admitted sites are bound to their VALUES,
  so a site that starts writing something else reds. The self-test runs 48 rows, and three of the family's own
  sites were found and deleted.
- **C3 corrected into a finding.** Pinning B's id through the product's own `session-identity-v1` map shows the pass-5
  "per engine" split was two slugs, and one payload now reads one number in both engines.
- **The cure's minimum is real and reproduces.** 5.604–5.691 dark and 11.793–11.891 light, 0 px under 4.5, both
  engines, dpr 1/2/3. The translucent arm reds in the same batch. HEAD's light name (3.382/3.418) is a debt this tree
  pays.
- **Tier 2 guards what check 4 doesn't.** Upstream re-binds of the ink (K6, K6b, K13) are red in CI units.
- **Deletion over addition.** No product byte moved, and the build is identical.

## 6 · Cross-pollination

- **The faint-text plant** (a `text-fill` mix with `currentColor`, which keeps `color` and the spec check green) for every
  painted-text row that asserts a spec or declared colour: TIN's §2b, CTRL-TAPE's washi tag, NOTE-LEDGER's strip,
  PLR-SELF's state line. Existence is not visibility, in text form.
- **The ink-vs-HEAD glyph-median comparison** for TIN: its L ≥ 0.83 arm should be shown to beat HEAD's 5.899–5.991
  dark median, not only its 4.589 minimum.
- **`public/` as a cascade and Tailwind source** for every one-publisher and mint gate: MRK-LIVE's `--ring-ink`, §13's
  rungs, and FACE's CHECK 7.

## 7 · Incidents (mine)

- **No `rm`.** Scratch lives under `<scratchpad>/critpw6/`. My vitest config and the planted `public/peer.css` were
  `mv`ed to `<scratchpad>/critpw6/trash-critpw6/`.
- **Two rig faults in the battery.** The first `lint:lanes` exited 2 because the copy lacked `.github`. The first
  `eslint .` exited 1 on my own scratch spec. Both were re-run clean and are declared in `readings/battery.txt`.
- **A wasted build.** One attack-copy build failed because the copy lacked `csp-solver/`, and a first `404.html`
  plant didn't apply (no `</body>`); the bare check ran on the clean copy. Both were re-done.
- **Three void WebKit plants** (W1). None of them is cited as evidence.
- **Load and concurrency.** The box ran at load 27–34. Two builds ran beside the playwright batches.
