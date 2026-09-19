# PASS-3 CRITIQUE · MRK-LIVE · The living mark

Adversarial critic, non-author (did not write the spec, the plan or the prototype). Base
`74a2b5d9`. Prototype worktree `wf_f72f3b5a-83a-35`, served by ME on `127.0.0.1:4244` with a
private `cacheDir`; the HEAD control (`74a2b5d9`, main tree, read-only) on `127.0.0.1:4245`.
Both killed; the 4230–4249 band reads empty at return. My own probes, configs and logs:
`critique/MRK-LIVE/probe/`, `critique/MRK-LIVE/logs/`. Zero crops banked by me (the family's
four are cited). Nothing under `r0/`, `pass1/` or `pass2/` was written.

**Verdict: ADVANCE at 86%.** The cure lands the pixel it was cut for, and I reproduced it.
What it does not yet have is a gate that can fail where it says it can, a phone arm, and a
consumer for the token it minted.

---

## 1 · What I re-ran myself (both engines, my server, my probe)

| row | my reading | the family's |
|---|---|---|
| **G-LIVE-4 desk** — focus `.drawer-tab` (Tab for modality, then programmatic), press Enter, wait until nothing finite runs on the tab's ancestor path +100 ms | `dLeft 0.00 / dTop 0.00`, outset 6.5, `.focus-ring` count 1, `activeElement` still the tab — **chromium AND webkit** (`logs/CRITIC-1-g4-*.json`) | 0.00 / 0.00 — **reproduced** |
| **idle after the settle** | 0 style writes and 0 `getAnimations()` calls in a quiet 900 ms, both engines | 0 writes — **reproduced** |
| **G-LIVE-14 the rank, live computed** | tier 2 `0.95` vs tier 1 `0.65` normal; `0.95` vs `0.90` under `prefers-contrast: more`; `matchMedia` true in BOTH engines (`logs/CRITIC-2-rank-*.json`) | same, and the family is right against the spec: **PW-WebKit does emulate `prefers-contrast`** |
| **π, rect census vs the HEAD control** | 30 rects per engine over `logo-trigger`, `drawer-tab`, `.sun-moon-toggle`, `[role=grid]`, 12 `.game-cell`, 12 `.cell-ghost-path`, `main` — **maxDelta 0.00 px, both engines** (`logs/CRITIC-3-rects-*.json`) | hue census byte-identical — **consistent** |
| **AA, recomputed from the tokens, not quoted** | `#3a7bc4` opaque: 4.19 page / 4.28 card light, 4.38 / 4.30 dark. Board at 0.95 over its own 0.08 fill: 3.57 light card / 3.71 dark card (3.51 / 3.79 over the page). Every ground clears the 1.4.11 3:1 floor in both themes | the comment's 3.61 / 3.73 — close, see gap 8 |
| **M16** | `npm run lint:copy` exit 0 on the worktree, 0 dashes / 0 unadmitted jargon, self-test colours green | 0/0/0 — **reproduced** |
| **the touched unit files** | `vitest run DigitCell.test.ts gridPaths.test.ts GameGallery.a11y.test.ts` = 3 files / 53 tests, exit 0 | part of the unbanked 835, see gap 11 |
| **NEW — every focusable stop keeps an indicator** | 12 stops walked on the board route (2 per tag.class signature), each focused and read: 10 carry exactly one `.focus-ring`, the 2 cell inputs carry tier 2 ink at 0.95, **0 unindicated, both engines** (`logs/CRITIC-5-indicators-*.json`) | not measured — the family read 4 named stops |

The last row matters: the diff suppresses the UA outline globally (`@layer base
:focus-visible { outline: none }`) and kills the `outline-ring/50` sweep off `*`. That is the
single most dangerous thing in this family, and it holds on the route I walked.

## 2 · What I found that the family did not

### 2.1 The settle loop does not do what its own comment says (measured)

`FocusRing.vue:148-167` promises: *frames while animations run, then three still frames, then
this loop does not exist.* I counted every `Element.getAnimations()` call with its timestamp
through one tab press (chain length 9, so 9 calls = one `running()` sweep, each preceded by a
`measure()` = `getComputedStyle` + `getBoundingClientRect`):

```
chromium   36 calls/frame for 33 frames of the glide  = 4 concurrent settle chains
           594 calls in the frame at 528ms            = 66 sweeps in ONE frame
           191 sweeps total for one press
webkit     18 calls/frame = 2 chains; 315 calls (35 sweeps) in the frame at 544ms; 98 total
```

The mechanism: every frame of the glide, `step()` schedules BOTH `requestAnimationFrame(step)`
AND `Promise.allSettled(anims.map(a => a.finished)).then(() => requestAnimationFrame(step))`.
The promises never resolve until the animation ends, so ~33 of them resolve together and each
one starts its own chain. `settling` holds ONE handle, so `cancelAnimationFrame(settling)`
provably cannot reach the chains it did not create, and the shared `still` counter is raced to
3 within a single frame by the burst — so the "three still frames" the comment leans on
(*"the drawer re-flips layout in onSettle AFTER finished"*) is not what runs; what saves the
0.00 px is the burst re-measuring 66 times in that frame, not the stated invariant. Cost: ~66
forced style/layout reads in the one frame where the drawer is re-flipping its layout. Idle is
genuinely 0 — this is a transient, not a leak — but a mechanism whose comment and behaviour
disagree is not converged, and the fix is two lines (`.then` OR the rAF, not both; a generation
token so a newer `settle()` invalidates older chains).

### 2.2 G-LIVE-18 is false as worded, and green only on the host that cannot fail it

The family's ablation focuses `button.logo-trigger` — which declares no
`--focus-ring-outset`. I re-ran the identical ablation on `.drawer-tab`, which declares
`6.5px` (`DrawerTab.vue:79`), both engines (`logs/CRITIC-4-ablation-declaring-*.json`):

```
before  rings 1  ring width 61  declared "6.5px"
delete @property --focus-ring-outset  (deleted: 1)
after   rings 1  ring width 61  declared "6.5px"  parseFloat → 6.5     ← ring SURVIVES
```

Unregistered, the host's own `6.5px` still reaches JS as a token stream that `parseFloat`
reads. So the row's sentence — *"delete the registration and no `.focus-ring` with a box
exists"* — is true for `logo-trigger` and the toggle (whose `calc()` does die), and FALSE for
the three hosts that declare a plain length (`DrawerTab` 6.5, `StagingBand` 5.5,
`GameGallery` 5.5). Chair §6.5's "an absent publisher fails at computed-value time" holds only
for consumers that inherit the initial value. The gate must either name its host or ablate
`initial-value` (e.g. re-register with `syntax: "<angle>"`), or it is a gate that cannot fail
on three fifths of its surface.

### 2.3 `--ring-ink` is a consumer-less substrate (and a legacy alias)

`grep -rn -- "--ring-ink" src/ e2e/` returns exactly ONE line: its own declaration
(`index.css:233`). `FocusRing.vue:279` paints `stroke: var(--color-focus-sketch)`, not the
alias. So the pass ships a token that (a) nothing reads, (b) whose value is another token's,
and (c) which the family's own gap 8 admits the hue census cannot see. That is the checklist's
consumer-less substrate and its legacy-alias tell at once. Either the ring drinks from
`--ring-ink` in this diff or the mint waits for §10's lane that actually consumes it.

### 2.4 The no-fallback law is applied to two tokens and not to ten in the same file

Two `var(--color-focus-sketch, var(--color-crayon-blue))` fallbacks were struck with a proof
(*the property is declared at `:root`, so the fallback cannot fire*). `--color-teacher-red` is
declared at `:root` too (`index.css:212`), and `gameCell.css` still carries **ten**
`var(--color-teacher-red, var(--color-crayon-rose))` — two of them WRITTEN BY THIS DIFF (the
`.cell-because` yield at `:190` and its contrast arm at `:203`). The same one-line proof
retires all ten. Chair §6.5 is wave-wide; the file is the family's own.

### 2.5 `@property --motion-note`'s `initial-value: 0ms` is the masked fallback the family
struck elsewhere

`:root { --motion-note: 250ms }` plus `initial-value: 0ms`: if MOT-LADDER's publisher lands
and this stand-in is deleted without theirs arriving, `marks-fade-in` runs for 0 ms — the
pencil marks appear with no draw-in and **nothing fails**. No born-RED row deletes this
publisher. That is exactly the shape §6.5 forbids (a default that hides the case the design
does not handle), shipped in the same diff that strikes three `, 0px` for being that shape.

### 2.6 The tape's other neighbours are unmeasured (W2 §2.5, the chair's §6.1 class law)

G-LIVE-17 measures the label's bottom against the ring's outer ink on the SAME cell, and
reports 9.12–11.82 px of air. It never measures what the family's own crop 3 shows: at 9×9
phone the painted label is **110.27 × 33.38 px** over **40.55 px** cells, so a row-0
flip-below lands it across roughly 2.7 cells wide and 82% of a row's height — on top of other
`[role="gridcell"]` inputs (the crop shows two digits under it). `.washi-label` ships
`pointer-events: none`, so nothing is intercepted; but §2.5 as the chair restated it in §6.1
is a CLASS law about covering, measured against the tape's painted path bbox, and this family
declared the collision its own surface (§2.7). One reading closes it.

### 2.7 The modality premise the spec cites is contradicted by the family's own instrument

§2.5 of the spec says *after a pointer interaction → `fv=false`* (citing
`GameControlPanel.vue:1606`, r0 R3). `MODALITY-*.json` reads `pointer-then-programmatic` on
`.drawer-tab` as **fv=true, rings 1, in BOTH engines**. Nothing in the 6×2 grid measures the
gesture a mouse user actually makes — the pointer landing focus on the target itself — so
whether a mouse click paints a 212 px hand-drawn ring around the toggle is, this pass,
unmeasured and unframed. And in webkit **4 of the 6 rows are `0 == 0`** (the Tab walk never
reached either target in 40 presses; the masthead `<a>` never takes focus at all), so the
estate's named defect — *the link has no indicator on any route* — is proven cured on exactly
one row of twelve.

---

## 3 · Strengths (earned, not asserted)

1. **The defect is dead at the pixel, and it is the defect's own gesture.** 190.11 / 194.16 px
   of stray framing → 0.00 px, after the press AND after a mid-glide reversal, both engines,
   re-measured by a non-author on his own server.
2. **The clock is gone.** No duration constant in the component; `MOTION.boardFoldMs` left. A
   bound that asks the target's own path what is running cannot be de-tuned by W8's next
   retune of the 520.
3. **A defect nobody had named was found and cured by the value the wash already wanted:** at
   HEAD the contrast arm ranks tier 2 = tier 1 = 0.9; 0.95 restores a strict order in both
   arms, in both engines. The peer stayed at 0.55 against palette pressure, with the number
   that refuses the raise.
4. **The estate's `prefers-contrast` capability was corrected against the spec** (webkit does
   emulate it) rather than inherited as a chromium-only caveat.
5. **π is clean where the wave does not claim a pixel** — my independent 30-rect census reads
   0.00 px against the HEAD control in both engines.
6. **The record is honest.** Eleven gaps declared before I looked, including the two that most
   embarrass the spec (the phone gesture and the G-LIVE-16 wording). The replay route is
   stated, the r0 instruments are copies, and r0 is untouched.

## 4 · Checklist hits

- **gates that cannot fail** — G-LIVE-18 on a non-declaring host (§2.2); G-LIVE-16's four
  webkit `0 == 0` rows (§2.7); `lint:motion` exit 0 while no new estate spec exists.
- **masked fallbacks** — `--motion-note`'s silent `0ms` (§2.5); ten surviving
  `--color-teacher-red` fallbacks under a law that struck two others (§2.4).
- **consumer-less substrate / legacy alias** — `--ring-ink` (§2.3).
- **the elegant-reduction trap** — the family's own gap 12: landing these gates as estate
  specs is "an execution row", and G-LIVE-17's instrument "needs the invite path, so as an
  estate spec it is a multiplayer spec". The gates that carry the design live in probe files.
- **unverified gestalt** — the brief asked for crop 1 at 393×699 (the defect's phone frame);
  what shipped is 1280. Crop 3 is light where the brief said dark. No dark-theme frame exists
  this pass, though "a mark weighs the same in both themes" is principle 3.
- **the constraint it forgot** — W2 §2.5's class law on the tape's other neighbours (§2.6).
- NOT hit: the generic default (the mark is bespoke and measured); π (0.00 px on my census);
  AA (recomputed, every ground over 3:1 in both themes); filterBudget (9/9/9 banked, +3 ghosts
  only on the living cell); W2's landed mechanics (the design rides the tab, the dock and the
  coarse tape rather than minting new ones).

## 5 · Convergence: 86%, and what the missing 14 costs

Earned, not granted: a running prototype, proven in both engines by a non-author on his own
server, closing the pass-2 defect at the pixel with the wave's guards intact. Withheld: one
gate provably narrower than its sentence, one half-vacuous in webkit, a mechanism whose
comment disagrees with its measured behaviour, a phone arm that cannot be read as written, a
minted token with no consumer, a stand-in publisher that fails silently, and two of the
biggest green claims (835 unit tests, 78 e2e) with no banked log in this pass's dir.

## 6 · Cross-pollination

1. **`chain()` / `running()` / `settle()` on the animation set** — the general cure for any
   overlay that must follow a box moved by WAAPI: CTRL-TAPE's bar, NOTE-LEDGER's berth, the
   player cursors, any future tooltip. Graft it WITH the §2.1 fix.
2. **"`document.getAnimations()` reads 1 at rest, so a document-wide read is not an in-motion
   test; the ancestor path reads 0"** — one sentence that retires every `waitForTimeout(520)`
   in the estate's instruments.
3. **The rank is an ORDER, and it must hold in every media arm** — binds PAL-WALK, PAL-TIN,
   ACC-SIX, ACC-FIVE; the contrast arm is where ladders quietly collapse.
4. **The `@property` + no-fallback + ablation pattern**, with §2.2's correction: an ablation
   row must run on a host that DECLARES the token, or it proves nothing about the publisher.
5. **The indicator census** (`probe/indicator.probe.ts`) — every focusable stop focused, one
   of {drawn ring, board ink, computed outline > 0} required. Any family that suppresses a UA
   affordance owes this row; it is cheap and it is the WCAG 2.4.7 tripwire.
6. **The engine-capability correction discipline** — a spec that says "chromium-only" is a
   claim to re-measure, not a caveat to inherit.
