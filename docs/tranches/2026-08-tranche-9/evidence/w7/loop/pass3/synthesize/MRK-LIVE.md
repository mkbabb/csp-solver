# PASS-3 SYNTHESIS · MRK-LIVE · The living mark

Section §5 wobble law · §6 focus rings. Section LEADER (registry-v2 §5, conv 78). Synthesizer:
Fable 5.1. Inputs: `../research/MRK-LIVE/README.md` (both engines at `74a2b5d9`, zero crops),
`../CHAIR-RULINGS.md` (§6.5 no-fallback · §6.6 the rank is §6's · §6.7 R1 landed · §7), the
pass-2 synthesis and critique, registry-v2 §2.4/§2.5, the r0 R3/R6 censuses, the owner's
frames. Read-only on the product. The frontend-design two-pass method was followed: plan →
tell review → spec. This is a DELTA on the pass-2 spec: what pass 2 wrote stands unless a
row below moves it, and every moved row says why with its number.

Every number is a pass-3 measurement at `74a2b5d9` unless it says PASS-2 (`a8fee1f5`) or
ARITHMETIC.

---

## 0 · Plan, then the tell review

**Tokens.** Colour: `--color-focus-sketch` `#3a7bc4`, ONE value, both themes, kept; the comment
carries both readings (chrome 4.19–4.38, board 3.61 light / 3.73 dark at 0.95 — PASS-2) and,
new this pass, the dark chrome reading against `--color-card` that MRK-ABS's ledger recomputed
(3.690 at 0.9 on the board, 4.29 opaque). `--ring-ink` minted beside it (registry §2.4): the
NAME §10's lanes consume as `var(--ring-ink, currentColor)`; its value is
`var(--color-focus-sketch)`; one comment says the two are name and value. Geometry:
`--focus-ring-outset`, the estate's FIRST `@property` (`<length>`, `inherits: false`,
`initial-value: 3px`) — the natural home for chair §6.5, cited by every lane that consumes a
measured token. Time: NONE new. The settle's clock is the motion's own (`getAnimations()` on
the target's ancestor chain); `MOTION.boardFoldMs` leaves `FocusRing.vue`; `markSettleBeats 4`
× `beatMs 125` = 500 ms stays the revolution. One CSS number kept from pass 2: the hint rim
under selection at 0.70.

**Type.** None. No rendered string is minted; M16's arm is free.

**Layout.** One axis — liveness — on two surfaces, unchanged; what pass 3 adds is the ring's
CLOCK, drawn as the one timeline the defect lives on:

```
  press .drawer-tab (focus resident)        the ring's settle, pass 3
  t=0 ──── WAAPI on the tab's chain ────── t=515/516 ── layout re-flip (onSettle) ──►
      │ ancestors(tab).getAnimations()      finished ⇒ measure; 3 still frames ⇒ stop
      │ = 2 (peak) · 0 at rest              no duration constant anywhere
      └ read on the NEXT frame, never in the click's capture phase (the glide
        starts in the button's own handler, after this listener)
  ring travels WITH the tab: framing error 190.11 / 194.16 px → ≤ 0.5 px
```

**Principles.** (1) The living cell is the focused cell — in the selector. (2) A mark is alive
from the frame it arrives: `1,2,3,0`, then nothing. (3) A mark weighs the same in both themes.
(4) A ring never draws on another line: 1 px of air over a drawn frame. (5) A ring lands on
something a reader can act on. (6) NEW: **a ring is bounded by the motion it chases, never by a
clock** — it waits on the animations that are actually running on its target's path and stops
the frame they end. The memorable thing per surface stands: the selection breathes once when
you land on it (board); the same breath answers focus on one drawn ring (chrome).

**Tell review.** The generic cures for a stranded overlay are a `transitionend` listener (the
pass-2 critique's own proposal — measured 0 events on the defect's motion, both engines), a
bigger timeout (520 → 740 → whatever W8 retunes next), and a permanent rAF follower (255
repositions per 900 ms idle, PASS-2). All three refused with the number that refuses them. The
generic answers for the rank are "raise the peer to 0.80 because the palettes asked" — refused:
it inverts T8-W3 M1's ladder against tier 1's 0.65 in the normal arm while the contrast arm
keeps peer 0.8 < base 0.9, two ladders in one file. What the mirror removed this pass: the
`OUTSET` JS fallback (dead under the registration — chair §6.5's masked fallback); the
`, 0px` on `--toggle-bleed` (three sites, not one); the "never null" sentence (re-worded, not
guarded — an empty scrollport has nothing to act on); the claim that conditional enrolment
"restores the beat's floor" (it cannot — `App.vue:816` + `DarkModeToggle.vue:378` hold the
driver on every page at HEAD).

---

## 1 · §5 · the living mark (delta on pass 2 §1)

### 1.1 The law — unchanged

> The living cell is the focused cell. From the frame it arrives it steps `1, 2, 3, 0` on the
> shared beat and rests on pose 0, which is `generateCellRects`' output byte for byte. Every
> other mark on the board is still, and the swap cannot reach it.

Cure A (`[data-mark-pose=N] .game-cell:has(input:focus-visible) …`, pass 2 §1.2) stands,
measured green at four poses on conflict/peer/hover in both engines (PASS-2, critic-confirmed).

### 1.2 THE RANK, RULED (chair §6.6 — the leader's row, every `gameCell.css` row carried)

The four tiers at `74a2b5d9`, computed, byte-identical between engines
(`../research/MRK-LIVE/readings/C-tiers-*.json`):

```
                    normal arm                 prefers-contrast: more
  tier 3 invalid    1.00  w9                   1.00  w9
  tier 2 focus      0.90  w7   ← 0.95 (ships)  0.90  w7   ← 0.95 (inherits the row)
  tier 1 hover      0.65  w5                   0.90  w5
  tier 4 peer       0.55  w4                   0.80  w4
```

**The rank is an ORDER, and it must hold in both media arms:** on `stroke-opacity`,
`tier 3 > tier 2 > tier 1 > tier 4`, strictly, in the normal arm and under
`prefers-contrast: more`. Two consequences, one of them a defect nobody had named:

1. **At HEAD the rank is BROKEN in the contrast arm**: tier 2 reads 0.9 and tier 1 reads 0.9
   (`gameCell.css:331` lifts the base to 0.9, and tier 2's own 0.9 no longer out-ranks it).
   Under `prefers-contrast: more` your selection and a hover press the pencil equally hard and
   differ by hue alone. The 0.95 graft (pass 2, MRK-WASH) is what restores the order — it was
   argued for contrast and it turns out to be the rank's cure too. So tier 2 → **0.95** in the
   normal rule (`:250`) and the contrast arm inherits it (no new row: `:331` lifts only the
   base selector).
2. **The peer stays 0.55 / 0.80** (HEAD). 0.80 in the normal arm is REFUSED: it puts tier 4
   above tier 1's 0.65, makes `:198-205`'s header ("lighter on every axis a tier has") false on
   one of three axes, reds `join-language-prm:153`, and leaves the contrast arm reading the
   opposite rank. The ladder's reason (a peer presses less hard than you) survives, and the
   header stays true as written.

**Candidate values for PAL-WALK / PAL-TIN** (chair §6.6 asks §6 to name them): the rank's
ceiling for tier 4 is `tier 1 − 0.05` in each arm, i.e. **≤ 0.60 normal / ≤ 0.85 contrast**.
The two lawful candidates are `0.55 / 0.80` (HEAD, the default) and `0.60 / 0.85`. A palette
that needs more than 0.60 to read its peer ink is asking the opacity axis to fix a lightness
problem: the lever is `--peer-ink-l` (0.5 light / 0.8 dark, `index.css:162`/`:375`, the
palette's own) or stroke width under tier 1's 5, never the rank. `join-language-prm:153` stays
green on both candidates only if it reads the SHIPPED value; it is theirs to keep green, not to
re-word (chair §6.6).

**Rows carried into this diff** (registry §2.5): `gameCell.css:250` 0.9 → 0.95; `:246`/`:248`
`var(--color-focus-sketch, var(--color-crayon-blue))` → `var(--color-focus-sketch)` (the
fallback is provably dead: the property is declared at `:root`, custom properties inherit, the
fallback cannot fire in either theme — MRK-ABS's one-line proof, adopted); `:243` and `:315`
modality sentences rewritten to the measured truth — *an `<input>` always matches
`:focus-visible`, so a click, a tap and an arrow key all paint tier 2; tier 1 graphite paints
only on hover without focus* (r0 R3 click/tap census, unchanged at this base); `:35` and
`:154` `animation: marks-fade-in 250ms …` → `marks-fade-in var(--motion-note) …` with NO
fallback (MOT-LADDER's rows, chair §6.5's form — the prototype tree carries MOT-LADDER's
`@property --motion-note` registration hunk, cited as theirs, so the rows compute; the fold
keeps the one publisher). The peer's `:234` is NOT touched.

### 1.3 The settle sentence — unchanged

4 swaps, `1,2,3,0`; first within one beat of the landing (33–116 ms, PASS-2), last at
`500 − φ` ms; PRM 0 swaps, both surfaces.

### 1.4 The hint laminate — unchanged (0.70 rim; the critic banked gate 2 at 4.52/5.57
chromium, 5.36/6.29 webkit, PASS-2). Pass 3 lands the laminate instrument in the lane's own
`instruments/` and the row cites it instead of the critic's read.

### 1.5 `boilBeat`'s floor — the honest row

`boilBeat.ts:18-19` promises a zero-subscriber floor that `App.vue:816` + `DarkModeToggle.vue:378`
make unreachable on every rendered page at HEAD. `useMarkPose` enrols unconditionally (one more
`watch` per 125 ms beat; one driver runs regardless of N, `boilBeat.ts:32`). The marginal
subscriber is PRICED, not hidden: idle paints per 900 ms with the ring mounted vs unmounted,
against T4-P1's census, in the background with a log. `boilBeat.ts:18-19`'s comment is
rewritten to say what the floor is (the toggle's, for the app's life), naming both lines. No
sentence claims the floor was restored.

---

## 2 · §6 · one drawn ring off the board (delta on pass 2 §2)

### 2.1 The law — one clause added

> Off the board, focus is one drawn ring: `HandDrawnOutline`'s hand in px-native geometry on
> whatever the accessibility tree says has focus, stroke 2.5, ink `--color-focus-sketch`,
> `outlineBoilPx 0.45`, alive from the frame it arrives (`1,2,3,0`) and then still. It lands on
> something a reader can act on and never draws on another line. **It travels with what it
> rings: while any animation is running on the target's own ancestor path, the ring follows
> per frame and stops the frame the last one ends.**

### 2.2 THE CURE — `settle()` re-cut on the motion's own clock

Measured on the defect: pressing `.drawer-tab` with focus resident fires **0** `transitionend`
and **0** `animationend` on the tab or any ancestor, both engines; what moves the tab is **two
WAAPI animations** on its own path (`div.board-peek-host`, `button.drawer-tab`), 520 ms,
`cubic-bezier(0.32, 0.72, 0, 1)`, visible to `getAnimations()` from t = 7 ms (chromium) /
3 ms (webkit) to t = 515/516 ms; `document.getAnimations()` reads **1 at rest** (so a
document-wide read is not an "in motion" test; the ancestor path reads 0 at rest, 2 at peak).
The pass-2 bound (`MOTION.boardFoldMs` 520 + `stable ≥ 3`) fails by ≈45 ms even with a correct
re-arm. So:

```ts
// FocusRing.vue — the settle is bounded by the animations it can see, not by a clock.
function chain(el: Element): Element[] {                     // target + ancestors, own animations only
  const out: Element[] = []; for (let e: Element | null = el; e; e = e.parentElement) out.push(e); return out;
}
function running(el: Element): Animation[] {
  return chain(el).flatMap((e) => e.getAnimations())        // App.vue:427's read, one level each
    .filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity)); // finite only
}
function settle() {
  cancelAnimationFrame(settling);
  let still = 0;
  const step = () => {                                        // FIRST read is one frame late on purpose:
    const el = target.value; if (!el) return;                 // the glide starts in the button's own
    measure();                                                //   handler, after our capture listener
    const anims = running(el);
    if (anims.length) {
      still = 0;
      Promise.allSettled(anims.map((a) => a.finished)).then(() => { settling = requestAnimationFrame(step); });
      settling = requestAnimationFrame(step);                 // and follow per frame meanwhile
      return;
    }
    if (++still < 3) settling = requestAnimationFrame(step);  // the drawer re-flips layout in onSettle
  };                                                          //   AFTER `finished`: three still frames
  settling = requestAnimationFrame(step);                     //   catch it; then this loop does not exist
}
```

Three rules the code above encodes, each with its reason in the record:

- **Armed on a landing AND on activation of a RESIDENT target.** `take()` calls `settle()`
  whenever it is given a target — same or new (`if (el === target.value) return measure()`
  dies; the revolution still answers only a NEW target because `useMarkPose` watches the ref,
  and `target.value = el` is not written when `el` is the same). Plus one capture-phase
  `click` listener on `document`: when `target.value` contains `event.target`, `settle()`.
  `click` fires for Enter/Space on a button as well as a pointer, so one listener covers both
  activations. The `aria-activedescendant` mutation path already lands a NEW target.
- **`allSettled`, never `all`** — a cancelled glide (the drawer's reversal-flip) rejects
  `finished`; `DarkModeToggle.vue:682`'s lesson. **Finite animations only** — an infinite
  animation on the path would never end; none exists on any focus stop's path at HEAD (gate
  G-LIVE-15 pins it), and the filter keeps the loop from ever hunting behind one.
- **No duration constant.** `MOTION.boardFoldMs` leaves the component; nothing new enters
  `pencilConfig`. The loop's life is: frames while animations run, then three still frames,
  then nothing. Idle cost is unchanged (event form, 4 repositions per 900 ms, PASS-2).

The rAF follower during a glide is the within-animation sampler pass 2 already allowed for a
landing; what changes is when it is armed and what ends it. `follow: 'raf'` as a permanent mode
stays refused.

### 2.3 The token, `--ring-ink`, and the R6 R1 row (chair §6.7 — LANDED)

`index.css:219` `--color-focus-sketch: #3a7bc4`, declared once in `:root`, no `.dark` arm; the
comment rewritten to carry both readings and the trade (pass 2 §2.2's text, plus the dark
chrome-on-card reading 4.29 opaque / board 3.690 at 0.9 that the shipped "5.3:1" lied about).
`--ring-ink: var(--color-focus-sketch);` minted on the next line with one comment: *the name
§10's chrome consumes; the value is the focus token's; retire one and the other follows.*
`--ring-ink`'s `currentColor` consumer-side fallback is CTRL-FACE's declared form and survives
(it is not a measured token). `--color-focus-sketch`'s two consumers lose their fallbacks (§1.2).

R6 row R1: **landed as the token's value, reported MOVED, the diff cited** —
`instruments/R6-rebase.diff` (this dir), which carries three rows because the lane holds the
only R6 diff and two more rows moved under the fold: **R1** (the rebased law: every chromatic
token's comment tells the truth about its themes — a token declared once in `:root` says so; a
token with a `.dark` arm names its arm's measured reading), **L3** (the probe counted `since: "`
occurrences and wanted 2, HEAD has 1 — a proxy; the row re-aims at the gate's own exit code,
which reads 0/0/0, lexicon 25, exit 0 at HEAD), **R2** (the probe reads the FILE and matches
the fold's own cure comment at `useGameCell.ts:140-144`; the row re-aims at the shipped
assignment, `revealed answer` at `:158`). Nothing under `r0/` is written.

### 2.4 `FocusRing.vue` — the pass-2 cures kept, three moved

| cure | pass 2 | pass 3 |
|---|---|---|
| the ribbon's owner | `.guard-btn.guard-keep` | unchanged |
| the deck's masked fallback | first-option fallthrough, "never null" | fallthrough kept; the sentence is **"a scrollport hands the ring its first option; an empty scrollport has nothing to act on and shows no ring"** (`querySelector` may return null and that is the truth, not a hole) |
| the settle bound | a DURATION (`MOTION.boardFoldMs`) | **the animation set** (§2.2); no duration |
| the re-bake key | `{w, h, outset}` | unchanged |
| the LRU | module-local 2-entry memo | unchanged |
| the outset read | `Number.isFinite(declared) ? declared : OUTSET` | `parseFloat(getComputedStyle(el).getPropertyValue("--focus-ring-outset"))`, no fallback; `OUTSET` dies; `initial-value: 3px` is the one home (chair §6.5). A born-RED row deletes the registration and the ring must VANISH (NaN geometry), so the gate can fail |

`EXEMPT` stays `.cell-native-input, .gallery-viewport`. z-index 70 stays and is now asserted:
the shipped ladder tops at 60 (`App.vue:1036`, `GameControlPanel.vue:2194`, `scene.css:475`);
the only 100s are DEV (`FilterTuner.vue`). The ring is the one 70.

### 2.5 The modality law, both directions

`:focus-visible` on a programmatic focus follows the LAST INPUT MODALITY: cold page → every
button reads `fv=true` both engines (this lane); after a pointer interaction → `fv=false`
(`GameControlPanel.vue:1606`, r0 R3). Both are true and the estate quoted each as the whole.
**The law is the equivalence, not a truth value:** the drawn ring exists ⇔
`document.activeElement.matches(":focus-visible")` (rank 2) or an `aria-activedescendant`
owner is declared (rank 1). Links get the same ring on the same condition; the masthead `<a>`s
compute `fv=false` under programmatic focus in both engines (a route nothing in the estate
takes) and `fv=true` on Tab. G-LIVE-16 pins three modalities on a button AND a link.

### 2.6 The ring clears the frame it rings — unchanged (5.5 / 5.5 / 6.5; house default 3)

The toggle: `--toggle-bleed` is NEGATIVE (−52 px, `App.vue:963`), so the ring's offset reads
+54 px and the ring is 212×212 around a 104×104 button — W2 §2.4's ornament range, kept, and
the first crop a reviewer looks at. Chair §6.5: `var(--toggle-bleed, 0px)` loses its fallback
at ALL THREE sites (`DarkModeToggle.vue:742`, `:760`, `:918`); `--toggle-bleed` is registered
(`<length>`, `inherits: true`, `initial-value: 0px`) in the one registration block §10's leader
lands, cited from here.

### 2.7 The fold moved this family's surface: the tape over the focused cell (coarse)

`74a2b5d9` mounts the attribution tape on the FOCUSED cell on a coarse pointer
(`GameBoard.vue:507-523`), clears it on `focusout` (`:473-482`), and deleted the `@media` hide
(`:1255-1261`). On a phone the focused cell carries tier 2's ring AND a washi name label
hanging `bottom: 100%` + `0.5rem` above it (`:1230-1253`; `SheetWashiLabel` z 50). Two facts,
two inks, and the design says what they are to each other:

> The label names who WROTE the digit, in that author's ink; the ring says where YOUR pencil
> is, in the focus ink. They never share a pixel: the label's bottom edge sits ≥ 4 px above the
> ring's outer ink, in every row including row 0 (where the label hangs over the frame).

ARITHMETIC at 16×16 desktop (boardPx 556): tier 2 stroke 7 u × 0.4277 = 2.99 px centred on the
ghost rect, wander 0.375 u; outer ink ≈ 1.7 px above the cell's own edge, label at 8 px:
≈ 6.3 px of air. Phone 16×16 (boardPx 365, PASS-2): stroke 1.97 px, air ≈ 7 px. Measured in
G-LIVE-17, the board being EXEMPT from the drawn ring (only tier 2 paints there).

### 2.8 Mobile, copy, motion — unchanged from pass 2 (§2.6/§2.7)

No copy. Nothing enters `MOTION`; one constant LEAVES a consumer (`boardFoldMs` out of
`FocusRing.vue`). PRM: pose 0, 0 swaps, the ring appears without stepping; the settle loop is
PRM-blind by design (it chases layout, not a flourish; under PRM the drawer snaps and the loop
exits in three frames).

### 2.9 `ringWhole()` — proposed to W3, banked as a diff

`spoken-gallery.spec.ts:219-234` cannot fire against a `position: fixed` ring. Proposed
replacement, `instruments/ringWhole.proposed.diff` (the prototyper cuts it against the live
spec): *the `.focus-ring` rect equals the active option's rect ± its outset within 0.5 px AND
the option's rect is inside the scrollport's rect* — which keeps r0 R3's 3.6 px headroom
reading meaningful. W3 owns the spec; not applied.

---

## 3 · Plan (files, order, what dies)

Fresh worktree off `74a2b5d9`; replay the pass-2 worktree `wf_8630d340-e56-36`'s diff (its
`filesTouched`, by file copy if `git` is refused across worktrees — state the route). A hunk
that conflicts with the fold's files (`GameBoard.vue`, `check-copy-register.mjs`,
`useGameCell.ts`) resolves TOWARD the fold and is named in the return.

1. `FocusRing.vue` — §2.2 `settle()` + `chain()`/`running()`; `take()` arms on a resident
   target; the capture `click` listener; `OUTSET` dies; `MOTION` import dies; the fallthrough
   sentence.
2. `index.css` — `@property --focus-ring-outset` (kept), `:219` comment, `--ring-ink` minted,
   `:727-732` DELETED (four-site edit with 3–4), the `@layer base` suppression/forced-colors
   block (kept).
3. `gameCell.css` — `:250` 0.95; `:246/:248` fallbacks struck; `:243`/`:315` comments; `:35`/`:154`
   `var(--motion-note)`; `:294-303` neutraliser DELETED (dead without `index.css:727`); `:7` and
   `:10-11` prose corrected. The peer rows untouched.
4. `DigitCell.vue:33-34` — the prose that certifies the deleted rule, corrected.
5. `DarkModeToggle.vue:742/:760/:918` — `, 0px` struck; `--toggle-bleed` registration cited.
6. `boilBeat.ts:18-19` — the floor comment rewritten to the truth.
7. `useMarkPose` unchanged; the marginal subscriber priced (§1.5) in the log.
8. Gates (§5) in the same commit, RED before step 1 where the row is HEAD's, RED on the pass-2
   build where the row is pass 2's.
9. `instruments/R6-rebase.diff` banked (this dir; the prototype copies it beside its own).
10. Dist-bound suites after a worktree build + `vite preview` with `PLAYWRIGHT_BASE_URL`
    (never main's dist — W8 §8.1).

Dies: `MOTION.boardFoldMs` in `FocusRing.vue`; the `OUTSET` fallback; three `, 0px`; two
`var(…, var(--color-crayon-blue))`; `index.css:727-732`; `gameCell.css:294-303`; the
`if (el === target.value) return measure()` early-out; the "never null" sentence; the 0.80
peer proposal. Kept from pass 2: everything else.

---

## 4 · Prototype brief (pass 3)

**Build.** Fresh worktree off `74a2b5d9`; replay pass 2; the §3 delta. Serve from
`<worktree>/web/frontend` on **127.0.0.1:4238** (`--strictPort`; next free in 4230–4249 if
taken) via `npx vite --config <evidence>/vite.lane.mts --host 127.0.0.1 --port 4238
--strictPort`, the two-line config spreading the worktree's `vite.config.ts` with `cacheDir:
'<worktree>/.vite-cache'` (symlink `node_modules` beside it if the plugins do not resolve).
HEAD control: a second read-only server on main at the next free port, named by commit
(`74a2b5d9`). Scratch PW config from `../research/MRK-LIVE/probe/pw.head.config.ts`, re-pointed.
Kill both servers; the band reads empty at return. Anything > 90 s runs in the background with
a log.

**Crops (≤ 4, ≤ 150 KB, dpr 3, cited):** (1) `.drawer-tab` focused, dock OPEN and settled
700 ms, the ring ON the tab at 393×699 — the defect's own frame, cured (chromium); (2) the
toggle's 212×212 ring, light, webkit — the one geometry the seam exists for; (3) the focused
cell on a coarse pointer WITH the author's label above it, 9×9 dark — the fold's collision,
measured; (4) optional: the deck's first-option fallthrough. Everything else is a number.

**Censuses (copied and re-pointed, never in r0):** `hue-census.mjs` byte-identical to
`hue-census-HEAD.txt` (the token is not re-valued; `--ring-ink` is an alias row — declare the
one-row delta); `law-probe.COPY.mjs` with R1/L3/R2 reported MOVED against the banked diff;
the r0 wobble probe (σ-space 0.092 unchanged at pose 0); `budget.probe.ts` 9/9/9 on BOTH
engines, ghosts 16/81/256, +3 on the living cell only; `check-copy-register.mjs` 0/0/0;
`lint:motion` with every new spec's PRM declared; `lint:knip`.

**Measure (both engines unless stated):** G-LIVE-4 on the tab (≤ 0.5 px after the glide vs
190.11/194.16 today), on a deck landing at 60 and 120 Hz emulation, on the drawer's REVERSAL
(open then press again mid-glide — `allSettled` must land it); the loop's exit (0 rAF steps
900 ms after the last animation; 4 repositions per 900 ms idle); the rank order in both media
arms (G-LIVE-14; `emulateMedia({ prefersContrast })` is chromium-only — say so); the three
modalities × {button, link} (G-LIVE-16); the coarse tape geometry (G-LIVE-17 — reuse the
estate's multiplayer fixture if the relay is reachable; else stub `cellAuthors` by the same
route `join-language-prm.spec.ts:137` uses for tier 4 and say so); the registration ablation
(G-LIVE-18); the marginal subscriber (§1.5, background, log); G-LIVE-3's bands at the four
framed stops with the `elementFromPoint` filter (`inert` blinds it — standing trap); the
laminate instrument; the forced-colors arm chromium-only BY INSTRUMENT (PW-WebKit cannot
emulate it — the row says so); the WebKit 16×16 phone trace only on a box under load 2, PRM
control beside it; `spoken-gallery` 16/16 (proposed diff NOT applied), `access` 2.1/2.2/2.3,
`a11y` 3.5, `GameGallery.a11y.test.ts`, `gallery-guard.spec.ts`, `join-language-prm:153`
green at 0.55; the six dist-bound suites off the worktree's built preview.

**Success is:** tab framing ≤ 0.5 px both engines after press and after reversal; deck
landing ≤ 0.05 px at 60 and 120 Hz; idle 4 repositions / 900 ms; rank 1 > 0.95 > 0.65 > 0.55
normal and 1 > 0.95 > 0.9 > 0.8 contrast; ring ⇔ `:focus-visible` in 3 × 2 cases; label–ring
air ≥ 4 px on every row on a coarse pointer; the ring vanishes under the registration
ablation; hue census = HEAD + one alias row; σ-space 0.092; 9/9/9 and +3; copy 0/0/0;
`join-language-prm:153` green; every suite green; dist suites green off the preview. Anything
short is the number, banked.

---

## 5 · Born-RED gates this family lands with

Pass-2 rows G-LIVE-1/2/3/5/6/7/8/9/10/11/12/13 stand as written (§5 of the pass-2 spec), with
G-LIVE-6 landed as an estate spec declaring its motion and its chromium-only arm. Re-cut and
new:

- **G-LIVE-4 (re-cut) — the ring travels with what it rings.** Focus `.drawer-tab`
  (programmatic + one key press for modality), press Enter, wait until no animation runs on
  the tab's chain + 100 ms: `|ring.left − (tab.left − outset)| ≤ 0.5 px`, same for top, both
  engines, at 1280×800 and 393×699; the same after a mid-glide reversal; a deck landing lands
  ≤ 0.05 px at 60 and 120 Hz; 0 writes per 900 ms idle. RED at the pass-2 build: 190.11 /
  194.16 px. The row asserts the PIXEL, never that a listener exists.
- **G-LIVE-14 — the rank is an order in both arms.** Computed `stroke-opacity` of tiers 3/2/1/4
  strictly descending in the normal arm and under `prefers-contrast: more` (chromium by
  instrument). RED at HEAD: tier 2 = tier 1 = 0.9 in the contrast arm.
- **G-LIVE-15 — no focus stop rests on a running animation.** For every named stop, at rest,
  `chain(stop).flatMap(getAnimations)` filtered to finite = 0, both engines; and during a tab
  press it reaches 2. RED as a negative control (an injected infinite animation on `body` must
  NOT enter the set).
- **G-LIVE-16 — the modality equivalence.** On `.drawer-tab` (button) and a masthead `a[href]`
  (link): cold+programmatic, Tab-arrived, pointer-then-programmatic — the `.focus-ring` count
  equals `+activeElement.matches(":focus-visible")` in all six cases, both engines. RED at
  HEAD (no ring node; the link has no indicator on any route).
- **G-LIVE-17 — the label and the ring never share a pixel (coarse).** With an author on the
  focused cell at a coarse-pointer context, the `.washi-label`'s bottom ≥ ring's outer ink +
  4 px, for a row-0 cell and an interior cell, 9×9 and 16×16, both engines. RED at HEAD?
  Unmeasured by anyone — RED until the first reading; if it is green at HEAD it is booked as a
  guard, not a cure.
- **G-LIVE-18 — the registration is load-bearing (chair §6.5).** Delete
  `@property --focus-ring-outset` in a test-only style injection: the ring's `width` computes
  NaN/0 and no `.focus-ring` with a box exists. RED on the pass-2 build (the JS `OUTSET`
  fallback masks the deletion).
- **G-LIVE-19 — three `, 0px` are gone.** grep 0 for `var(--toggle-bleed,` in `src/`, and the
  toggle's ring paints > 0 px at 1280 and 393 with the registration present. RED at HEAD (3).
- Guards that must stay green: `join-language-prm:153` at 0.55; σ-space 0.092; 9/9/9 and +3;
  hue census = HEAD + the `--ring-ink` alias row; copy 0/0/0; a11y 3.5; engine σ parity;
  the toggle's 54 / 12 px offset; `lint:knip` exit 0.

MOVED, not re-cut: R6 R1 (LANDED per chair §6.7, diff cited), L3 and R2 (the fold's own
cure; diff cited). OPEN by design: `ringWhole()` (W3's; diff proposed), the quiet-box trace
(a condition), the dist-bound run (off the worktree's preview). U-10: nothing here closes; the
owner sees crops 1–3.

## 6 · Coupling with MRK-ABS, stated for the agglomerator

Still INCOMPATIBLE on the two axes: (i) the token — one value here (R1 rebased and LANDED, the
comment tells the truth); MRK-ABS a dark alias whose fate its own frame-crossing gate decides
(MRK-ABS §2.2 concedes the token axis if the alias reds on the dark frame); (ii) the board's
geometry — pose 0 byte-identical to `generateCellRects` here; MRK-ABS insets to 0.86 for a
reason that has CHANGED this pass (MA-N at tier 10, not MA-R). Gratable either way: MRK-ABS's
`RING_GEOMETRY` onto this pose stack ("pose 0 is the inset rect's output byte for byte");
this family's `settle()` onto nothing in MRK-ABS (its chrome is a CSS outline and cannot
strand). The rank ruling (§1.2) binds both routes and every §11 palette.
