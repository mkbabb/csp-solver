# ACC-FIVE — pass-4 ADVERSARIAL CRITIQUE

Family: FIVE CRAYONS AT DIFFERENT PRESSURES (§3 §4 §12, owner of `poseFronts`). Base and π control
`74a2b5d9`. Prototype work tree `.claude/worktrees/wf_f72f3b5a-83a-41` (read, and written only for
two restored ablations, both sha-verified back). Critic's servers: prototype dev `:4239`, shared
read-only HEAD control preview `:4240` (identity `index-CubiZsMVSwTc.js`, verified by asset hash),
prototype dist preview `:4241` (`index-DCleUxXAr4B4.js`, verified by asset hash). All three killed
by recorded PID (74322 / 74323 / 74324); 4239/4240/4241 read FREE at return. Scratch dir
`web/frontend/.acc5crit/`, two vite caches and `test-results/` deleted; the work tree's
`git status` at return is the prototype's own 9 modified / 3 untracked, `+769 −97`.

**CONVERGENCE: 79% — EARNED. VERDICT: ADVANCE**, with the three MUSTs closed and five new rows.

The three pass-3 MUSTs are genuinely closed and I reproduced every one of them on my own servers,
in both engines. What this pass then did was look at two surfaces nobody asked it to look at, and
it mis-measured both of them — in the same way, for the same reason, and the reason is this
family's own new `transition: stroke 500ms`. Two of the three rows it hands the owner therefore
carry wrong numbers and one false sentence. And while it was pricing the join ring it had a THIRD
`poseFronts` consumer in the same diff, un-gated, which I measured at **2.2× the ceiling the
family declares** — the exact defect §3.1 struck, on the one consumer neither pass counted.

---

## 1 · What I did

- Read the whole diff in the work tree (`git -C … diff`, 9 modified / 3 untracked, +769 −97) against
  `pass3/prototype/ACC-FIVE/pass3.diff`, and the pass-4 README, instruments, readings and both crops.
- Served the work tree on `:4239` (dev, private cacheDir) and the shared control on `:4240`, plus
  the prototype's own dist on `:4241`, and re-ran FOUR of its measurements myself, both engines,
  both themes: the G10 rate, the `prefers-contrast: more` arm across the win, the print /
  forced-colors readings, and the corridor e2e.
- Benchmarked the memo the record only asserts (esbuild bundle of the work tree's `gridPaths.ts`).
- Ran all three node gates BARE, and then tried to make each one pass on a broken tree of my own
  (three ablations, each restored and sha-verified).
- Ablated the corridor gate INSIDE its own hue window — the arm neither pass ran.

## 2 · What holds, re-measured rather than taken on trust

**MUST 1 — the contrast hedge holds, and it is flat across the win.** My reading, both engines,
both themes, `prefers-contrast: more` witnessed true in-page, win driven by `[aria-label="Solve
puzzle"]`:

| cell | before the win | at the win |
|---|---|---|
| chromium / light | `rgb(140,105,29)` @12px | `rgb(140,105,29)` @12px |
| webkit / light | `rgb(140,105,29)` @12px | `rgb(140,105,29)` @12px |
| chromium / dark | `rgb(229,199,77)` @12px | `rgb(229,199,77)` @12px |
| webkit / dark | `rgb(229,199,77)` @12px | `rgb(229,199,77)` @12px |

Byte-identical across the win in every cell; the default arm lifts `rgb(168,126,19)` →
`rgb(201,154,46)` light in the same run, so the page was really winning. (My grounds are computed
backgrounds, not the prototype's painted modal, so my absolute ratios differ — 4.153 where the
painted instrument reads 4.967. The claim under test is the FLATNESS and it holds; the painted
absolute is the prototype's instrument and I do not dispute it.)

**MUST 2 — the rate is real, in all four cells, and it is under the ceiling.** Same instrument
shape, my own servers, `reducedMotion: no-preference` witnessed false in-page:

| engine / theme | panel | `d` records | re-cut frames | span | **rate** | prototype |
|---|---|---|---|---|---|---|
| chromium / light | 128 Hz | 88 | 11 | 212.3 ms | **51.8/s** | 56.3/s |
| chromium / dark | 128 Hz | 88 | 11 | 214.4 ms | **51.3/s** | 58.0/s |
| webkit / light | 63 Hz | 80 | 10 | 233.0 ms | **42.9/s** | 49.5/s |
| webkit / dark | 67 Hz | 72 | 9 | 205.0 ms | **43.9/s** | 43.3/s |

Against the declared 62.5/s. The two engines are within 21 % of each other on panels that differ
by 2×, which is the property the family claimed a rate would have. `stroke-opacity` 1, no
`pathLength`, no `stroke-dasharray`, 25 `L` segments in the cut front — all confirmed.

**MUST 3 — the corridor spec runs, and I ran it.** `e2e/progress-corridor.spec.ts` on my own
minimal PW config against `:4239`: **8 passed (55.8 s)**, exit 0, both engines, both themes —
within a second of the prototype's 8 / 55.2 s. The `pngjs` finding is correct and is a level
deeper than pass 3 reached: the spec could not resolve its own import, so "written and never
executed" understated it.

**The gate discriminates INSIDE its own window — the arm neither pass ran.** The pass-3 critique
called the closing `hueGap ≤ 5` near-circular because a 45° window pre-selects the sample. I
ablated the gauge to `#a8a713`, **25.3° off the gold anchor** (inside the window, outside the
assert), and the corridor row went **RED 4/4**, both engines, both themes (`vsLine` 1.482 dark
webkit). So the gate is not circular; it fails on an in-window ink. Honest caveat: my pick red on
the RATIO row before it reached the hue row, so the ≤5° line itself is still un-demonstrated — an
iso-luminant 25° pick would close it.

**The node gates break on MY broken trees.** Each edit made in the work tree and restored,
`shasum -c` clean:

| ablation | gate | result |
|---|---|---|
| `--color-progress-ink` → `#8b5cf6` (HEAD's violet) | `check-ink-pressure` BARE | **exit 1** — `kin light: --color-progress-ink is 151.0° from --color-crayon-gold` |
| `--color-card` → `hsl(48 30% 62%)` | `check-ink-pressure` BARE | **exit 1** — `corridor light: … 1.698 — under 3 + 0.25 of margin` |
| an em dash inside `aria-label="Solve puzzle"` | `check-copy-register` BARE | **exit 1** — 1 hit, named with file:line |

and all three bare runs are exit 0 on the untouched tree (137 files / 0 dashes / 0 unadmitted; 54
declared / 0 unreferenced), with all three `--self-test` arms exit 0 and their negative controls
RED. The violet ablation also **confirms the lane's own gap 11**: the CORRIDOR row stayed GREEN on
HEAD's violet; only KIN reds. The node arm is a drift guard and the return says so.

**The memo is real and BETTER than claimed — I measured what the record only asserts.** esbuild
bundle of the work tree's `gridPaths.ts`, node 26, 2,000 calls after a 200-call warm:

```
ring: 4 poses · d length 6,948 chars · 492 L segments        (confirms the 492 correction)
MEMO HIT    0.0604 ms/call
MEMO MISS   0.2595 ms/call   (fresh array identity — DifficultyTally's call shape)
saving      76.7 %
```

The critique asked for "halves the call"; the landed memo takes three quarters of it.

**Other things that hold.** The `?board=` pinning of both π arms, with the random-board confound
caught by reading the diff list and declared rather than deleted. The LAYERED-ablation incident,
re-confirmed independently for the second time. "The win is an ACT, not a threshold." The
segment-boundary table replacing the false "estate-wide" claim. Every landed contrast number I
could re-derive lands to the digit: `--color-user-ink` 5.065 / 4.945, the old blue-600 5.078 /
4.958, dark `#47a7ff` 7.341 against `#60a5fa` 7.360, `--color-red-ink` 4.990 light / 6.303 dark,
`keep` 19.44. The undefined-token census is clean for this family — both timing-slot `var()`s
(`--ease-noteWrite`, `--ease-standard`) are declared at `index.css:400/401`. No `@property` is
registered here, so the four clauses do not bind. No `--ring-ink` consumption. W2's mechanics are
untouched. `unit gridPaths.poseFronts.test.ts` — 6 tests, 0 failed.

## 3 · What is NOT converged

### 3.1 The THIRD `poseFronts` consumer is un-gated, and I measured it at 2.2× the family's own ceiling

`DifficultyTally.runDrawIn` writes `reveal[i]` straight from a raw `createSequenceSubscription`
`onProgress` — no `frontGate`, no `FRONT_MIN_MS`, nothing — and the template calls
`strokeFront(d, i)` per path per render. So the tally's `d` re-cut rides the panel. Measured by me,
`.dt-stroke` `d` mutations at the grade's draw-in, in the SAME page and the SAME run as the gauge
rows above:

| engine / theme | panel | `d` records | re-cut frames | span | **rate** | the gauge, same page |
|---|---|---|---|---|---|---|
| chromium / light | 128 Hz | 188 | 47 | 350.2 ms | **134.2/s** | 51.8/s |
| chromium / dark | 128 Hz | 192 | 48 | 343.6 ms | **139.7/s** | 51.3/s |
| webkit / light | 63 Hz | 72 | 19 | 312.0 ms | **60.9/s** | 42.9/s |
| webkit / dark | 67 Hz | 100 | 25 | 343.0 ms | **72.9/s** | 43.9/s |

134.2/s on a 128 Hz panel is the refresh rate wearing a budget's clothes — verbatim the sentence
`HandDrawnGrid.vue:141-156` writes about the defect it cured. 2.15× the declared 62.5/s in
chromium, 1.17× in webkit, and the chromium/webkit spread is 2.2× where the gauge's is 1.2×: the
number moves with the display, which is the whole test. The record's gap 9 names this call site —
but only to say it misses the memo, "correct and cheap". It is cheap per cut (4- and 8-segment
strokes at 0.26 ms/call against the ring's 492 segments) and that is not the point: the budget
this pass declared is stated as the design's property and does not bind the design's own third
consumer. §3.5's charge, one consumer further on.

Closes by putting `reveal` behind the same `frontGate` (or declaring the tally out of the budget
with this measurement as the reason) and re-measuring both consumers in one run.

### 3.2 G10 has no gate. None.

`grep -rn "FRONT_MIN_MS\|62.5" src e2e scripts` returns five hits, every one of them inside
`HandDrawnGrid.vue`'s own comment and its own constant. No unit row, no e2e row, no script reads
the ceiling; the corridor spec asserts the dash is gone but never counts a re-cut. The pass-3
critique struck a gate whose number was the reviewer's display. Pass 4 replaced it with a number
**no gate reads** — the enforcement is an instrument a lane runs by hand, and MUST 3's whole
lesson was that a written-and-unrun gate is not a gate. Closes with one e2e row that drives a
write at no-preference, counts `d` re-cut frames per second on `.progress-trace` AND `.dt-stroke`,
asserts ≤62.5/s, and carries the `FRONT_MIN_MS` 16→0 arm the lane already proved reds.

### 3.3 ROW B's print number is a transition artifact, and the finding is the family's own rule

The record's headline for gap 7 is "`rgb(2–4, 2–3, 0–1)` — near-black graphite — in ALL FOUR
engine×theme cells", and ROW B goes to the owner with those four figures as its cite. Read again
with the emulation allowed to settle:

| `media: print`, `.progress-trace` stroke | chromium/light | chromium/dark | webkit/light | webkit/dark |
|---|---|---|---|---|
| +200 ms (in flight) | `rgb(14,10,2)` | `rgb(10,8,1)` | `rgb(15,11,2)` | `rgb(12,10,1)` |
| **+2.2 s (settled)** | **`rgb(0,0,0)`** | **`rgb(0,0,0)`** | **`rgb(0,0,0)`** | **`rgb(0,0,0)`** |

The trace prints exactly `#000`. The "near-black" is a sample taken while **this pass's own**
`transition: stroke v-bind(traceWinMs) var(--ease-noteWrite)` was mid-flight — the family
instrumented its own tween and reported the tween.

And the mechanism is not a discovery. The rule that produces `#000` is in this diff, added by this
family, with this comment: *"The fill trace's print arm (T9-W7 §4). It had none: … so a printed
worksheet's gauge is the same graphite as the frame it retraces."* §6's gap 7 says "nobody has
said so" and "a five-crayon accent family that has measured its print arm and found no crayon in
it owes the row". The family said so, in the diff, on purpose. Booking one's own declared intent
as an uncured finding is a disposition dressed as a discovery, and it reaches the owner with four
wrong numbers attached. Closes by re-reading settled and restating ROW B as "the print arm we
chose — keep or re-colour", citing the comment that chose it.

### 3.4 ROW C is mid-flight too, and its central sentence is false on this tree

| `forced-colors: active` | chromium/light | chromium/dark | webkit/light | webkit/dark |
|---|---|---|---|---|
| record | `rgb(0,0,0)` | `rgb(251,251,251)` | `rgb(0,0,0)` | `rgb(0,0,0)` |
| **mine, settled** | `rgb(0,0,0)` | **`rgb(255,255,255)`** | `rgb(0,0,0)` | `rgb(0,0,0)` |

Same artifact, smaller. The substantive error is the sentence the ballot rests on: *"the trace and
the frame are the same colour AND the same width (both 12u), and the gauge is gone."* Read on this
tree at the default contrast arm, under `forced-colors: active`, **the frame is not CanvasText**:
`.grid-line` computes `rgb(38,38,38)` light and `rgb(209,207,199)` dark, in BOTH engines, at 12px,
while the trace takes CanvasText at 8px. They are neither the same colour nor the same width —
because the family's own forced-colors rule names `.progress-trace` and does not name `.grid-line`.
There IS a hole next door (a CanvasText-black trace against a `rgb(38,38,38)` frame is ~1.16:1),
and it is worth the owner's ruling; it is simply not the hole ROW C measured. The engine
disagreement is also mis-diagnosed: "one of the two is wrong about what the system foreground is"
is a Playwright/WebKit forced-colors emulation limit, not an estate finding. Closes by re-reading
settled, reading the FRAME in the same pass, and naming the ratio the gauge actually loses.

### 3.5 FORK A's two frames move three variables at once and skip the cell the fork is about

The default arm is **chromium · light · no-preference**; the contrast arm is **webkit · dark ·
`prefers-contrast: more`**. Engine, theme and arm all change together, so the pair cannot show what
the hedge does. The one cell the hedge exists for — **light, `prefers-contrast: more`, at the win**,
where the measured 4.967 → 2.533 inversion lived — is not framed at all, and the record itself says
"the dark arm was never the defect". Charter row 8 asked for "a frame vs a control for the owner's
eye": `win-light-nopref.png` is a frame with no control beside it (no `74a2b5d9` pane, though the
control was served on `:4237` all pass). One crop closes both: light, contrast:more, cured and
ablated panes with a control pane off the HEAD server.

### 3.6 The born-RED corridor row's message assertion cannot fail

```ts
const msg = noGaugePixel(scheme, offAnchor, line!, paper);
expect(msg).toContain("NO GAUGE PIXEL IN THE BAND");
expect(msg).toContain(`grounds: line ${line!.join(",")}`);
```

`noGaugePixel` is a pure builder the test just called; it always returns a string starting with
that literal, and the `grounds:` term is interpolated from `line` on both sides. The row never
observes the gate's actual `throw`. The load-bearing half of that row — `before.columns > 0` then
`columns === 0` — is excellent and is what makes the gate non-vacuous; the message half is a
tautology reported in the README as "the row requires the message". It does not. Closes by driving
the production row under the ablation and asserting the thrown error's text.

### 3.7 A landed docstring states the fact this pass retracted

`gridPaths.poseFronts.test.ts:12-13`:

> *Both arms of the guard are exercised against the estate's OWN generators, not a hand-written
> string: `generateGridBoilFrames` really does emit a four-subpath frame.*

The tests use `"M0,0 L100,0 L100,100 M300,300 …"` and a hand-shaped `C` curve, and README §4 says
plainly that neither estate generator is multi-subpath on this tree — which is the pass's own
correction to the pass-3 critique, and it is right. So the product carries, in a test file that
ships, the claim its record retracts. One paragraph. (Also: the README says "5 rows"; the file has
six `it()` blocks and vitest reports 6 tests.)

### 3.8 The `d`-per-frame figure in the record is half the measured one

§1 states "`d` writes are 4 × the re-cut frames (four poses)". I read **88 `d` records over 11
re-cut frames** in chromium and 80/10 in webkit — 8 per frame, because the estate mounts TWO
`HandDrawnGrid` instances (the props comment says so: "Both boards pass the identical prop, so the
twin is automatic"). So each commit serialises eight paths, and each tween runs two `poseFronts`
computeds, not one. The rate is unaffected; the cost sentence is. One
`document.querySelectorAll('.progress-trace').length` in the row closes it.

### 3.9 π's "nothing else moved" is clean for the gauge and silent for the rest of the family

1205 shared nodes on the pinned board route, 4 paint diffs and 8 rect diffs, all the trace's — a
good census, and it cannot have covered the two claimed surfaces that are not mounted on that
route: `GameGallery`'s `guard-leave` red ink (behind the leave guard) and `GameControlPanel`'s
`.sparkle-icon` gold glow (hover-only, `@media (hover: hover)`). Those are precisely the replayed
pass-2 hunks gap 1 says were never measured. The record's "nothing else on the page moved a
computed paint property or a rect, in any of the four cells" is true and narrower than it reads.

### 3.10 Carried unclosed, from the lane's own list — each still a row

G5 (the verb) and G9 (the per-anchor census) not run · no golden deltas, no R6 heading census, no
R3 wobble · F1's two arms unframed · the join wash's full 740–1180 ms handle unpriced (the 52.4 /
44.0 rates cover a ~500 ms window; the ≤74 ceiling is arithmetic off the constant) · G3's ΔL
band-median carried from pass 3 (+0.0944 / +0.3217) · the screen-reader announcement asserted by
construction · `#7D6902` alive once in an `index.css` comment · the node CORRIDOR row cannot fail
on HEAD's violet (I confirmed it).

## 4 · Constraints, checked

| constraint | reading |
|---|---|
| AA / 1.4.11 both themes, PAINTED | the default arm's painted pair is the prototype's and the corridor e2e asserts it on painted bytes, 8/8 green on my run. `prefers-contrast: more` is now FLAT across the win in all four cells — MUST 1 closed, re-measured by me. Uncured and now correctly scoped: the trace at 8px under `forced-colors` sits ~1.16:1 against a 12px `rgb(38,38,38)` frame (§3.4). |
| filterBudget 9 | the diff mints no new `filter=`; `.sparkle-icon` swaps two inline `rgba()` for two tokens inside the same one `drop-shadow`. The prototype ran `e2e/filter-census.spec.ts` 12 passed against its own dist (`index-DCleUxXAr4B4.js`, 43 files / 908 KB — I verified that dist exists and serves under that hash on `:4241`). I did not re-run the census; the budget is structurally unmoved. |
| M16 plain copy | `check-copy-register` BARE exit 0 on my run (137 files, 0 dashes, 0 unadmitted), and **exit 1** on my own em-dash plant. Non-vacuous, verified. |
| π on unclaimed surfaces vs `74a2b5d9` | clean on the board route, computed paint + tag + rect, `?board=` pinned; silent on the gallery and hover surfaces (§3.9). |
| decided history (r0/R6) | law 25's reversion sits in the tree from pass 3, untouched; the lane proposes no amendment and reports NO r0 row MOVED. Consistent with pass-4 CHAIR-RULINGS §1.3. Verified: nothing written under `r0/`, `pass1/`, `pass2/`, `pass3/` this pass. |
| W2's landed mechanics | untouched — no sticky tag, dock, bottom tab or tap-floor token anywhere in the diff. |
| the @property law | not engaged: the diff registers no `@property` and consumes no `--ring-ink`. |
| the undefined-token census | clean — `--ease-noteWrite` and `--ease-standard` both declared (`index.css:400/401`); every new `var()` in a timing slot resolves. |
| the record is frozen / crop cap | both crops are REPLACEMENTS naming the pass-3 crops they retire, 53,183 B total. Evidence dir 216 KB, raw census summarised. Clean. |
| ports / trees | 4239/4240/4241 free at my return; the control tree reads `74a2b5d9` and I neither edited, built nor `git`-touched it. |

## 5 · Failure-mode checklist — the hits

- **gates that cannot fail** — the born-RED corridor row's message assertion is a tautology
  (§3.6); and G10, the budget this whole pass exists to re-price, has **no gate at all** (§3.2).
- **spec-cites-itself circularity** — ROW B and ROW C book this family's own landed print and
  forced-colors rules as discovered findings, and one of them contradicts the diff's own comment
  (§3.3, §3.4).
- **the constraint it forgot** — the rate the family declares as the design's property does not
  bind the design's own third consumer, measured at 2.2× (§3.1).
- **the pixel it moves that it did not declare** — the tally's un-gated re-cut (§3.1); 8 `d`
  records per frame where the record says 4 (§3.8); π silent on two claimed surfaces (§3.9).
- **unverified gestalt** — FORK A's two frames change three variables and omit the cell the fork
  disposes; no control pane beside the light lift (§3.5).
- **the elegant-reduction trap** — "the front is geometry" is closed for the board and the join;
  "and then every consumer has to not step" is open on the third one.
- NOT HIT: vacuous convergence (the colour thesis reproduces to the byte, the kin gate reds at
  151°, the corridor gate reds at 25.3° inside its own window) · legacy aliases (the dash survivors
  are COUNTED, not renamed; `poseLengths` un-exported) · masked fallbacks (the glyph fallback hex
  dies with a born-RED unit row) · consumer-less substrate (theme-tokens exit 0, and its new
  allowlist arm reds on a planted fourth alias) · the generic default.

## 6 · Verdict — ADVANCE

Not BLOCK: nothing missing is as hard as the problem — one `frontGate` call, one e2e rate row, two
computed reads taken after a settle, one crop, one docstring, one assertion. Not RETIRE: no
rewording, and no constraint is violated on the shipped surface. Not BANK: this is §3's centre and
every row above closes inside one slice.

**79 %, and the eleven points pass 3 gained are earned.** The three MUSTs are closed and I
reproduced all three independently. What holds it under 80 is that this family's distinguishing
claim is that it is the most thoroughly measured artifact of the wave — and two of the three rows
it hands the owner carry numbers taken through its own tween, plus a sentence about the frame that
is false on this tree, plus a budget with no gate and a consumer at 2.2× of it.

**MUST 1 (pass 5) — gate the rate, and gate all three consumers.** One e2e row at no-preference
counting `d` re-cut frames per second on `.progress-trace` and `.dt-stroke`, ≤62.5/s, with the
`FRONT_MIN_MS` 16→0 born-RED arm. Put the tally's `reveal` behind `frontGate` or declare it out
with §3.1's table as the reason.

**MUST 2 — re-read ROW B and ROW C settled, and re-cut both ballots.** Print is `rgb(0,0,0)` in
all four cells by the family's own rule; forced-colors is `rgb(0,0,0)` / `rgb(255,255,255)`; the
frame is NOT CanvasText. Restate both rows as dispositions of rules this diff landed, with the
frame's own reading beside the trace's.

**MUST 3 — frame the cell the fork is about.** Light, `prefers-contrast: more`, at the win, cured
and ablated, with a `74a2b5d9` control pane. That is the one image FORK A needs and the one image
it does not have.

Then §3.6's tautology, §3.7's docstring and §3.8's count are one line each.

## 7 · Cross-pollination

1. **Read a computed style AFTER the estate's own transition has settled.** This family's new
   `transition: stroke 500ms` turned four print readings and one forced-colors reading into
   transients that were banked as findings. Any lane pairing `emulateMedia` with
   `getComputedStyle` must poll to a stable value, not wait a fixed 200 ms — the dock-sheet
   settle lesson, in colour.
2. **Ablate INSIDE the gate's own selection window.** A born-RED at 150.7° proves the window; a
   born-RED at 25.3° proves the assertion. Every hue-windowed or threshold-windowed gate in this
   wave wants the near ablation as well as the far one.
3. **Count a primitive's consumers before you price it.** `grep` the export, gate every call site,
   and measure them in the SAME page so one is the other's control — that is how §3.1's 134.2/s
   next to 51.8/s became a finding instead of an opinion.
4. **A "finding" whose mechanism is your own landed rule is a DISPOSITION.** Name the rule and the
   diff that landed it in the ballot row, or the owner is asked to rule on a surprise that was a
   decision.
5. **`poseFronts` is ready for ACC-SIX / the §10 tally / PLR-COUNT** with a measured memo (0.0604
   vs 0.2595 ms/call, 76.7 %) and an enforced precondition — and the call-shape trap must travel
   with it: `poseFronts([d], f)` builds a fresh array and misses the memo every call.
6. **Un-runnable ≠ un-run.** A spec importing a package the estate does not install could never
   have executed. Grep every new spec's imports against `package.json` before any lane reports it
   "written".
7. **A message assertion must observe the product's throw**, never a local call to the same
   builder — the cheapest way a born-RED row goes vacuous while looking rigorous.

## 8 · Incidents, self-declared

1. My first instrument read **0 `d` mutations in both engines**: the MutationObserver was installed
   only via `page.addInitScript`, and `document.body` is null when an init script runs, so
   `observe()` threw and the whole observer was lost. Caught because a zero in BOTH engines is not
   a finding, it is a bug. Re-cut to `page.evaluate(OBSERVER)` after load (the prototype's own
   instrument does both, which is why it worked); the confounded run's rows are not carried.
2. Two ablations were made in the prototype's work tree (`--color-progress-ink` → `#8b5cf6`;
   `--color-card` → `hsl(48 30% 62%)`) and one in `GameControlPanel.vue` (an em dash). All three
   were restored from a scratchpad copy and verified with `shasum -c` in the same command. The
   tree's `git diff --stat` at my return reads the prototype's own `+769 −97`.
3. My first PW config extended the repo's `playwright.config.ts` and died on its `globalSetup`
   relative path; re-cut as a standalone config with an absolute `testDir`. No product config was
   touched.
4. The 25.3°-off ablation ran from a COPY of the spec under `.acc5crit/`, never from `e2e/`; the
   copy, the config, both vite caches and the `test-results/` the failing run wrote were all
   deleted before return.
