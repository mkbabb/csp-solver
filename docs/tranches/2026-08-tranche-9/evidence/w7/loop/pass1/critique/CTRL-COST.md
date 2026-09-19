# CTRL-COST · THE CONSEQUENCE LADDER — pass-1 ADVERSARIAL CRITIQUE

Adversarial reader, not the author of the spec or the prototype. Everything below that carries a
number was measured by this lane, in this lane's own instruments, against the prototype's own
worktree served on **127.0.0.1:4233** (identity verified in-probe: four `.cost-band` names, no
`.action-bar`, no `.zone-row-label`, five `.act-face`), with a HEAD baseline on **:4249**
(worktree `wf_e58b4764-0fc-53`, which touches neither `typography.css`, nor the controls card,
nor the gallery). Both engines everywhere.

    readings   critique/CTRL-COST/readings/critic.json   (berth · armed face · teleport focus · reflow · identity)
               critique/CTRL-COST/readings/critic2.json  (sheet walk · berth at a scrolled port · the gallery, both trees)
    probes     critique/CTRL-COST/probe/critic.mjs · critic2.mjs

    CONVERGENCE  70 %   ·   VERDICT  ADVANCE

---

## 1 · What I re-ran, and what held

| their row | my reading | verdict |
|---|---|---|
| G6 the ask moves nothing | 390×844, independently coded: band Δ **[0,0,0,0]**, deal Δ **[0,0,0,0]**, clear Δ **[0,0,0,0]**, card scrollHeight Δ **0**, chromium AND webkit | **CONFIRMED** |
| G8 dock height | `.controls-card` scrollHeight **744** / client 628, both engines | **CONFIRMED** |
| G7 the seam at 390 | `.drawer-case` top **216**, wordmark foot **212.52** (chromium) / **212.80** (webkit) → **+3.48 / +3.20** | **CONFIRMED** |
| G9 contrast | recomputed from the token algebra (8 % `--color-foreground` over `--color-card`, WCAG): asked word **4.22** light / **5.28** dark · `no` full ink **16.45** / 13.28 · `no` muted **3.94** · caption **4.66** / 7.68 · cure A **4.99** · cure B **4.57** | **CONFIRMED to ±0.01** — their painted-bytes instrument is sound, and the light RED is real |
| amendment A | focus sat on `undo` in the ribbon; the sheet rose; `undo`'s home became the **`writing`** band, `#fold-tools` held **0 buttons**, and focus landed on a live `.ctrl-btn` — no stranding, both engines | **CONFIRMED** |
| the ribbon's reservation | wordmark **[58.14, 141.30, 243.33, 71.22]** and board **[14, 219.52, 362, 362]** IDENTICAL shut → open → shut, `--fold-tools-h` published at **66px**, both engines | **CONFIRMED** (π holds on the board and the masthead at the dock) |
| G11 filters | DOM `<filter>` population **15** in the prototype AND on the HEAD baseline, same cells | **CONFIRMED** |
| the unit battery | `vitest run src/games/shared/GameControlPanel.test.ts` → **15 failed / 19 passed (34)** | **CONFIRMED** |
| G12 / G13 | `check-font-coverage.mjs` **RED** (`"players" misses "p"`, exit 1) · `check-copy-register.mjs` **exit 0**, 0 em dashes / 0 unadmitted / 0 admitted | **CONFIRMED** |

The record is honest where I could check it. Three of its four banked instrument traps I can
corroborate from my own run (the padding-box scrollport and the scroll-before-read one bit me
in drafting). **Nothing in the prototype's return was found overstated.** What follows is what
it did not measure.

---

## 2 · The berth is REFUTED on measurement

The family deletes `scene.css`'s `padding-bottom: 3.5rem` — T9-W2 §2.5's note berth, whose whole
argument was *content cannot enter a padding band at any scroll offset* — and replaces it with a
claim: "the head's right slack is the berth … the one strip of a band that content can never
enter" (`GameControlPanel.vue` scoped CSS, `README` §0). The tapes are re-homed by
`.cost-band { position: relative }` + `:deep(.washi-label) { top: 0; right: 0 }`.

That positions the tape against the band's **static** box, not against the **sticky** head. Two
consequences, both measured, both engines:

* **It covers a control.** Hovering `fill` on the desk rail draws its tape at **dy −41.9** (above
  the button, at the band's top-right) where it lies over **16.5 %** of `Redo move` (chromium) /
  **16.6 %** of `Undo last move` (webkit). The tape is 50.5px tall; the head it is supposed to
  berth in is ~32px. That is the same species, and almost the same number, as the defect W2
  §2.5 priced 3.5rem to kill (16.9 / 57.4 / 23.6 / 17.4 %).
* **It leaves the port entirely.** With the card parked at its bottom (`scrollTop = scrollHeight`)
  and the pointer moved to live coordinates — no playwright auto-scroll to re-park the band —
  hovering `what fits` and `checking` draws their tapes **fully off the scrollport**, clipped
  **163.0 / 163.4** px above it (chromium) and **164.0 / 164.5** px (webkit). The reader asks for
  the explanation and is shown nothing.

A third reading, softer but real: the note is **not** "beside the verb being hovered". Measured
distance from the caption to its own tape — `marks` **−181.2**, `what fits` **−249.9**,
`checking` **−318.1** px (chromium; webkit −182.3 / −251.0 / −319.3). The band's top-right is one
place for four rows' worth of notes.

The cure is one declaration deep — make the STICKY HEAD the positioned ancestor (or give the tape
`position: sticky; top: 0` in the band) so the berth travels with the thing that cannot be
entered — but it has to be made and measured, at the scrolled state, before the berth claim can
be repeated.

---

## 3 · A landed gate REDs, born-RED, and the pass did not run it

    HEAD (main tree)   node scripts/check-theme-selectors.mjs  →  OK, 0 failures
    the family's tree  node scripts/check-theme-selectors.mjs  →  1 failure

      [1 UNWRITTEN ATTRIBUTES] src/pencil/sheet/SheetWashiLabel.vue:190:11  `[data-under-bar] {`
      NOTHING in src writes `data-under-bar`.

The diff deleted the *writer* (`GameControlPanel`'s measure pass) and left the *rule*. The rule is
not decoration either: `.washi-tag[data-under-bar] { opacity: 0 }` is T9-W2 §2.3's own mechanism
— "the card's own chrome never straddles its case edge" — so this is a landed W2 mechanic whose
enforcement is now dead CSS. It is in CI as `npm run lint:theme-selectors`.

Two more orphans of the same sweep, not gated but of the same species as W6's *the dead die
census-zero*: `src/assets/index.css:665` still lists `html.theme-turning .action-bar` in the
theme-turn transition set, and `index.css:831,848` still spend the tap-floor `min-width` block on
`.mobile-heading-btn`, a class this diff deletes from the tree (its only remaining mentions are a
comment and the un-recut test).

**And the formatting gate is RED**: `npm run lint` (prettier --check) reports
`src/games/shared/GameControlPanel.vue` and `scripts/check-font-coverage.mjs`. ESLint on the
touched files is clean; `knip` is clean; `check-motion-contract`, `check-live-regions`,
`check-theme-tokens`, `check-ink-pressure` are all green. Five estate gates were not run by the
pass; two of them are RED.

---

## 4 · The ask is a pointer-only dialogue

Measured at 390×844 coarse, both engines, with the board dirty and `deal` armed:

* the button's accessible name swaps to **"Press again to deal a new board"** — good, and the only
  thing an AT gets;
* the second answer `no` is **visible: true** and **`aria-hidden`: true** — it is drawn, it is
  hit-testable (`elementFromPoint` lands inside the button), and it **does not exist in the
  accessibility tree**;
* **no live region says anything.** The only `[aria-live]` text in the card at that moment is
  `20 squares filled`, left over from the fill;
* **Escape does not disarm** (chromium and webkit: still `sure?` after `Escape`), and **Tab does
  not disarm** (still `sure?`). The disarm paths are: a pointer press on the invisible-to-AT `no`,
  a pointer press elsewhere in the card (`disarmElsewhere` is bound `pointerdown.capture`), or the
  4,000 ms lapse.

So a reader on a touch device with a keyboard, or any AT user, can arm a destructive verb and has
no announced way to answer it except waiting four seconds — and `pressedNo()` reads
`e.target.closest('.act-answer')`, which a keyboard `Enter` on the button can never satisfy, so
their second `Enter` **deals**. The family's own sentence is "`no` is a real answer"; it is a real
answer for a thumb only. This is a W3-shaped defect (the accessibility tree agreeing with the
visible truth) landing in the wave after W3 sealed.

Same band, a second asymmetry: the arm is gated `isCoarse.value && props.isDirty` (the shipped
T4-WU/U3 gate, kept). The spec's Ruling 1 says **tier 3 = the acts that ASK**, and the spec's §3.4
conditions the arm on `isDirty` alone. On a fine pointer `deal` and `clear` act at once — measured
by the prototype itself (`wrote 1` on the fine desk). The desk therefore draws the heavy 2.5-stroke
box, the 8 % ground and the band name `starting over`, and then does not ask. The card's "one
memorable thing" is invisible on the surface the rail crop is taken at.

---

## 5 · One declared cost does not exist

Delta 4 of the prototype's return, and README §7: *"the ROW-3 deletion re-ranks every
`.section-heading` below 768, and the GALLERY's staging axis labels are `.section-heading` too
(`StagingBand.vue:140,154`) … the spec priced +24px of card height and did not price the gallery."*

Measured, `g`-opened deck, proto against HEAD, both widths, both engines:

| | axis label px | `.staging-slip` | `.staging-band` |
|---|---|---|---|
| proto 390×844 | **16** | [4, 602.5, 382, 175.9] | [4, 578.5, 382, 199.9] |
| head 390×844 | **16** | [4, 602.5, 382, 175.9] | [4, 578.5, 382, 199.9] |
| proto 1280×800 | **16** | [368, 654.2, 544, 112] | [368, 630.2, 544, 136] |
| head 1280×800 | **16** | [368, 654.2, 544, 112] | [368, 630.2, 544, 136] |

Byte-identical geometry. The reason is in the source the claim cites: `StagingBand.vue:315`
overrides both axes of the register — `font-family: var(--font-hand); font-size: var(--type-small)`
— so the staging label never reads `--type-group-title` at all. The family's reach beyond the card
is **zero painted pixels**, and the only other `.section-heading` consumer in `src/` is that same
overriding file. Good news for the family; bad news for the record, which currently hands the chair
a cost to price that measurement says is not there. The prototype read the TOKEN and reported it as
the SURFACE — the estate's own proxy≠surface rule, one rung down.

---

## 6 · The hard part, named and unbuilt

The prototype is candid about this and it still has to be counted. `GameControlPanel.test.ts` is
**15 failed / 19 passed**, and five of the fifteen are not "addresses of deleted grammar" in the
decorative sense — they are the **SPOKEN** contract of a sealed wave:

    coarse: the row says what happened, on both outcomes
    fine: the row keeps its verb in every state — the tape is the one voice
    fine: the name never contradicts the label the reader can see
    coarse: the name and the label flip together, on both outcomes
    the outcome is spoken at BOTH pointer classes, failure sentence and all

They fail with `TypeError: Cannot read properties of undefined (reading 'trigger')` — the share
button's address (`.action-verbs button.icon-btn`) died with the bar. Until that file is re-cut,
T9-W1/W3's spoken-copy guarantee has **no regression net** in the unit estate. Same for the e2e
estate, step 7 unbuilt: `zone-grammar.spec.ts` (10 addresses), `viewport-law.spec.ts` (4),
`access.spec.ts`, `font-census.spec.ts`, `join-language.spec.ts` (1 each) still name the deleted
grammar. The golden battery was not run at all (it needs a dist), so G11's "goldens unmoved" is a
source argument, not a measurement.

---

## 7 · Smaller, still closable

* **A masked fallback with the wrong number.** `scene.css`: `min-height: var(--fold-tools-h, 3.5rem)`
  — the measured value is **66px**, the literal is 56px. The publisher runs in a `useResizeObserver`
  on the wrap, so the fallback covers exactly the frame before the first measure; a 10px shortfall
  there is small, but the number is spelled wrong in the one place the comment says never to spell
  it. The same block ratchets: the height is re-read **including** the min-height it set, so the
  band can only grow across a resize sequence.
* **`--card-pad-b, 0px`** in the new `.controls-card::after` gradient: if the publisher has not run,
  the fade paints a zero-width card-colour stop and the cue silently becomes a plain fade — the
  honest-fade doctrine's own failure mode, unmeasured.
* **I3′ is green and unstressed**, as the prototype says: the dock card scrolls 116px and `looking`
  owns the port in all five states (0.505 → 0.317). The gate never sees a handover, so it currently
  cannot fail. One cell with a populated roster would stress it.
* **The dock ceiling has 16px of headroom** (744 against 760) before any roster row, any longer
  band name (the `players` → `together` cure is a *longer* word), or a game with a third staged
  setting.
* **Tap counts are modelled, not pressed**: `reach` is derived from `onScreen && !inert && hit`
  geometry, not from a measured tap sequence. Fine as a proxy, and it should say so.
* **The gallery's guard ribbon was never hovered in a room** after `.guard-face` → `.act-face`
  moved; structural + typecheck only, by the prototype's own §8.

---

## 8 · Strengths, stated plainly

* The centre is proven on the real surface, in both engines, by instruments I could re-run and
  reproduce: four names / one voice / four of four `<h2>` / ratio 1.2944, strips 0, the ask that
  moves **nothing**, `fill`'s undo reachable in its own band under the risen sheet, and the card
  **353px shorter** than HEAD at the desk.
* **Amendment A is met with zero new controls and no `inert` row** — the Teleport-disable is the
  most transferable idea in this family. I verified the node changes parents, the ribbon empties to
  0 buttons, the reserved band holds the masthead and the board at Δ0, and focus is not stranded.
* The 1×1 word grid + present-but-hidden second answer is a genuinely small mechanism for a
  genuinely hard promise (a confirm that does not reflow), and it is measured on the band, both
  faces and the card's scrollHeight, on the arm **and** the disarm.
* −360 LOC net, one face class for two surfaces, one timing constant in `pencilConfig`, both copy
  admissions struck **with** their strings in the same commit. The gates that were run are run bare
  and read honestly, including the two that are RED.
* Four instrument traps banked, each of which had produced a false green or a false RED. The
  base-URL one (an r0 spec reading another lane's server through `process.env … || :4231`) is a
  lane-wide hazard and belongs in the loop's own laws.

---

## 9 · The open gaps (each a sentence that could be closed)

1. Re-home the hover tape to the STICKY band head (position it against the head, not the band) and
   re-measure at `scrollTop = scrollHeight`, so that no tape covers a control (today: 16.5 % of
   `redo`, chromium; 16.6 % of `undo`, webkit) and no tape is drawn off the port (today: 163–164.5
   px above it for `what fits` and `checking`, both engines).
2. Delete or re-key `.washi-tag[data-under-bar]` in `SheetWashiLabel.vue:190` in the same commit
   that deletes its writer, so `check-theme-selectors.mjs` returns to the green it holds at HEAD.
3. Sweep the two orphaned rules the bar's deletion leaves behind — `html.theme-turning .action-bar`
   (`index.css:665`) and the `.mobile-heading-btn` tap-floor block (`index.css:831,848`).
4. Run `npm run lint` and land prettier over `GameControlPanel.vue` and `check-font-coverage.mjs`.
5. Give the ask a keyboard and an AT answer: handle `Escape` (measured: it does not disarm today,
   both engines), decide whether `Tab` away disarms, and expose the second answer to the
   accessibility tree or replace it with an announced cancel — `no` is `aria-hidden` and
   `pressedNo()` can never be satisfied by a keyboard `Enter`, so a keyboard second `Enter` deals.
6. Rule on the fine-pointer tier 3: either arm on fine pointers too, or say in the taxonomy that
   `starting over` asks **on coarse only** and that the desk's heavy box is weight, not a question.
7. Strike the gallery re-rank from the deltas: `StagingBand.vue:315` overrides `font-size` and
   `font-family`, and proto-vs-HEAD geometry is byte-identical at 390 and 1280 in both engines.
8. Price `players`' missing `p` — either a Fraunces re-cut with its byte delta measured, or a
   fourth band name the cut already holds — and re-run `check-font-coverage.mjs` to green.
9. Apply one of the two priced AA cures for the asked word (A → 4.99, B → 4.57; as specced 4.22
   against a 4.5 floor, light, both engines) or take the chair's ruling that the ground stays.
10. Re-cut `GameControlPanel.test.ts` — 15 rows, five of them T9-W1/W3's SPOKEN contract, which has
    no regression net until they land.
11. Build step 7 (17 addresses across five e2e specs) and step 8 (the landscape quick set; landscape
    undo stands at 2 presses, measured), or record the family as declining both.
12. Run the golden battery against a built dist so G11's "this diff draws none of the four goldens"
    is a measurement rather than an argument.
13. Close the 430×932 seam (−20.52 / −20.81) at W2's `--sheet-chrome` cap, or record the family as
    390/375-only; the case top is pinned at 216 at all three widths, so it is the cap, not the card.
14. Correct the `--fold-tools-h` fallback literal (56px against a measured 66px) and guard the
    re-read so the published height cannot ratchet upward across resizes.
15. Stress I3′ on a cell where the pin must hand over (a populated roster, or a taller `players`),
    since at 116px of dock scroll `looking` owns every state and the gate cannot currently fail.

---

## 10 · Verdict

**ADVANCE at 70 %.** The grammar is the real thing: a ladder a reader can learn in one look, one
box that means one thing, an ask that does not move, and a phone that finally keeps a tier-2 act
within one press of its reversal — all of it built, served and measured in both engines, and the
card gets *smaller*. Nothing here needs a primitive the estate does not have: every gap above is a
declaration, a sweep, a ruling or a re-cut. But three gates are RED (font coverage, theme
selectors, prettier), one hard constraint is violated as specced (AA on the asked word, light), one
of the family's own claimed mechanisms is refuted by measurement (the berth), one declared cost
does not exist (the gallery), and the ask is a dialogue only a thumb can hold. None of that is 100,
and none of it is fatal.
