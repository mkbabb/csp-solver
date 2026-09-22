# PLR-SELF · pass 4 — ADVERSARIAL CRITIQUE

§11's leader, and the seat of the section's substrate (chair §6.9/§6.12). Prototype: worktree
`.claude/worktrees/w7-p4-PLR-SELF`, branch `w7/p4-plr-self`, base `74a2b5d9`, uncommitted,
20 product files (+1,382 / −361). I wrote neither the charter nor the prototype.

**Verdict: ADVANCE. Convergence 85 %.**

Pass 3's twelve gaps do close, mostly, and the two the pass-3 critic found in the primitives —
the `@property` born-RED that could not fire and the 1280×799 cliff — are genuinely dead: I
re-cut each one on a broken tree and watched the row go red. What pass 4 is not is clean.
**One repo gate the return does not name is RED on this tree and green on its base**
(`lint:sleep`, six failures, every one in the lane's own new spec), **the family's headline
seam is broken by its own Escape cure** (a mouse open keeps the cell's focus, and Escape then
takes it — both engines), and the diff retires a T8 owner mark's surface with no row written
for it.

| my instruments | |
|---|---|
| servers | prototype dev `127.0.0.1:4244` (worktree, private `cacheDir` `.vite-cache-critic-plr-self`), HEAD control `127.0.0.1:4245` = the shared read-only tree `w7-control` at `74a2b5d9` served by `vite preview` off its pre-built dist, **verified by its own asset hash `index-CubiZsMVSwTc.js`** — both **killed by recorded PID** (98928, 98967); 4244/4245 read free at return |
| probes | `k-critic.spec.ts` (K1–K6), `k2-card.spec.ts`, `k7.spec.ts`, `pw.critic.config.ts`, `pw.estate.critic.config.ts`, `vite.critic.config.mts` — all under `<worktree>/web/frontend/.plr-critic/`, **deleted before return**; the worktree's `git status` at return is the twenty product files and nothing else |
| break battery | four surgical edits to the tree with sha1 backup/restore, each reverted and re-verified (`shasum -c` OK on all three files) |
| crops | none minted — every claim below is a number |

---

## 1 · What I re-measured, and what it says

### C1 — `@property --head-rule` now FAILS VISIBLY, on both engines. Gap 2 closes.

Desk 1280×800, solo, prototype vs the named control at `74a2b5d9`:

| | token at `.page-root` | `.corner-left` top | `.corner-right` top | registered |
|---|---|---|---|---|
| prototype, publisher present | `12px` | 12 | 12 | yes |
| prototype, publisher struck **inline** | **`0px`** | **0** | **0** | yes |
| prototype, publisher struck by a `(0,1,0)` stylesheet rule | `12px` | 12 | 12 | yes |
| control `74a2b5d9`, present | `calc(.75rem + 0px)` | 12 | 12 | **no** |
| control, struck inline | `""` | 12 (the `, 0.75rem` fallback) | 12 | no |

Identical chromium and webkit. Three things are settled by that table: the registration lands,
the initial-value is visible (both head marks go hard against the viewport's top edge), and the
lane's own incident 3 is real — a `.page-root { … }` injection loses the cascade to Vue's
scoped `(0,2,0)` rule and strikes nothing, which is why the pass-3 form read green.

**BREAK TEST B.** I set `initial-value: 0px` back to `12px` in `src/assets/index.css` and ran
the landed row bare: `player-mark.spec.ts:207` **FAILS** at `expect(after.cornerTop).toBe(0)`.
The gate can fail. Restored, sha1 verified.

### C2 — π, including the two surfaces the lane's census left out. Clean.

The prototype's census reads seven keys. Two of the surfaces this diff **restructures** are not
among them: `.attribution-trigger` (the button that got a new wrapper) and `.hover-card` (whose
pose a template comment asserts is "byte-identical"). I read both, plus computed `display`,
`position` and `z-index`, against the control. Desk 1280×800 solo, both engines:

| key | control `74a2b5d9` | prototype | Δ |
|---|---|---|---|
| `.corner-left` | `[0, 12, **75.53**, 39.75]`, `display: block` | `[0, 12, **120.66**, 39.75]`, `display: **flex**` | **+45.13 w** (the mark's box), `display` block→flex, `align-items` normal→center |
| `.attribution-trigger` | `[0, 12, 75.53, 39.75]` | `[0, 12, 75.53, 39.75]` | **0** |
| `.hover-card` | `[12.8, 65.5, 230.4, 117.90]` | `[12.8, 66.5, 230.4, 135.90]` | +1.00 y, +18.00 h — **explained, not the lane's**: see below |
| `.corner-right` · `.masthead` · `.controls-card` · `.board-wrapper` · `.drawer-tab` · `.page-root` · cell 0 | — | — | **byte-identical**, both engines, both viewports |
| `.mobile-attribution` (390×844) | `[0, 0, 75.53, 39.75]`, block | `[0, 0, 120.66, 39.75]`, flex | +45.13 w |

The card's +18.00 px is the **DEV-only DebugToggle** (a 14.4 px button that the built dist does
not carry: `childCount` 4 vs 3, `debugToggle` true vs false), and the +1.00 y is that same
18 px seen through the closed sheet's `scale(0.9) translateY(8px)` — `(151 − 131)/2 × 0.9`.
I chased it to the arithmetic because it looked like a moved pixel and it is not. **The @mbabb
card's pose is unchanged.** Two consequences: the π claim survives a harder census than the one
the lane ran, and **the lane's own π method compared a DEV prototype against a DIST control
without saying so** — the confound is benign here only because every unclaimed box matches
exactly, which is the evidence the return should have carried.

### C3 — AA from PAINTED BYTES, which the lane says it did not do. Its numbers hold.

`page.screenshot({ scale: 'css' })` → `sharp` extract over the state line's and a name's own
rects → real 8-bit pixels, darkest-vs-lightest, WCAG relative luminance. Desk, three at the
table, theme flipped by the estate's own control:

| | ground (bytes) | ink (bytes) | ratio |
|---|---|---|---|
| light · state line | `rgb(252,251,251)` | `rgb(107,107,107)` | **5.16** |
| light · row name | `rgb(252,251,251)` | `rgb(148,69,97)` | **6.19** |
| dark · state line | `rgb(18,16,15)` | `rgb(147,145,139)` / wk `rgb(148,146,140)` | **6.02** ch / **6.10** wk |
| dark · row name | `rgb(18,16,15)` | `rgb(248,159,187)` | **9.64** |

Every rung clears 4.5:1 in both themes, **from painted bytes**, and the figures reproduce the
lane's canvas composite and the pass-3 critic's C3 to the hundredth. **The lane's own gap 5
is closed by this run** — it was more honest than it needed to be.

### C4 — the 1280×799 cliff is gone, and the regime it was re-keyed to actually fires.

Seven at the table, both engines:

| viewport | rows | compression | sheet h | sheet bottom | board top | old query | new regime |
|---|---|---|---|---|---|---|---|
| 1280×800 fine | 4 | `and 3 more` | 170.66 | 222.4 | 122.5 (wk 122.2) | true | false |
| 1280×799 fine | 4 | `and 3 more` | 170.66 | 222.4 | 122.5 | **false** | false |
| 1280×780 fine | 4 | `and 3 more` | 170.66 | 222.4 | 122.5 | false | false |
| **390×664 `hasTouch`, witnessed coarse**, five at the table | **1** | `and 4 more` | 103.36 | 147.4 | 129.7 (wk 129.4) | false | **true** |

Pass 3 read 1 row and `and 6 more` at 799. It now reads four, and the short arm the regime
exists to serve does fire, with `matchMedia('(pointer: coarse)')` asserted true in the same
context. **BREAK TEST C**: regime reverted to `(min-height: 800px)` → `player-mark.spec.ts:333`
**FAILS**. Restored.

### C5 — Escape has one owner, and it takes something it was not asked for.

**The claimed half reproduces**, both engines: peek up + sheet open + Escape → `aria-expanded`
false and the laminate still shown (count 1); sheet shut + Escape → laminate count 0. **BREAK
TEST D**: `{ capture: true }` → `{ capture: false }` → `player-mark.spec.ts:295` **FAILS** at
`expect(peekUp()).toBe(1)`. The row is a claim, not a tautology.

**The unclaimed half is a defect.** The family's headline seam is that a mouse press opens the
sheet and *the cell you were writing in keeps focus*. Measured, chromium and webkit, on this
tree:

| | `activeElement` inside a cell | on the mark | `aria-expanded` |
|---|---|---|---|
| cell clicked, then the mark clicked | **true** (`input.cell-native-input`) | false | `true` |
| …then Escape | **false** | **true** (`button.player-mark`) | `false` |

`onWindowEscape` ends with an unconditional `el.value?.focus()`. So Escape, pressed by a reader
who never focused the mark, shuts the sheet **and moves the caret out of the cell they were
typing in and onto a control they never touched**. The APG premise the charter cites returns
focus to the trigger *when focus is inside the disclosure*; nothing in this sheet is focusable,
and after a mouse open focus was never in it. The cure is one condition — return focus only
when the mark had it (or when `document.activeElement` is the mark or inside the sheet). No row
in `player-mark.spec.ts` reads where focus lands after a mouse open + Escape; the keyboard row
at `:130` only ever has focus on the mark to begin with.

### C6 — `lint:sleep` is RED on this tree and GREEN on its base. The return does not name it.

```
w7-control (74a2b5d9):      npm run lint:sleep   →  exit 0   ("34 specs")
w7-p4-PLR-SELF:             npm run lint:sleep   →  exit 1   (6 failures, 35 specs)
```

All six are in `e2e/player-mark.spec.ts`, the lane's own new file — `:36` and `:351`/`:353` are
fixed sleeps inside the `invite()` and `draw()` helpers that every call site inherits, and
`:69`, `:118`, `:176` each precede a one-shot read off a live surface asserted non-retrying.
This is the `lint:motion` incident (self-declared, §4.4) repeated on the gate next door, and
this one the lane did not catch: the return's gate table lists eleven gates and `lint:sleep` is
not among them. The cure is the gate's own two doors — poll the invariant, or tag the site
`sleep-ok: <reason>` where the elapsed time is the subject (the 700 ms dock settle and the
320 ms sheet settle plausibly qualify; the 500 ms and 700 ms one-shots do not).

Everything else I ran bare is green on this tree: `lint:copy` (0 dashes, 0 unadmitted, 142
files, every planted offence RED), `lint:motion` (35 specs, 35 declaring), `lint:live-regions`
0, `lint:theme-tokens` 0 with its negative control RED, `lint:knip` 0, `test:font-coverage` OK
(Patrick Hand 46 cp / 4,312 B, 27 strings / 5 groups), `lint:boundary`, `lint:ink`, `lint:tdz`,
`lint:catch`, `lint:lanes`, `lint:theme-selectors`, `eslint src e2e scripts`, `prettier --check
src/ scripts/ e2e/`, `vue-tsc -b`, `vue-tsc -p tsconfig.e2e.json`.

### C7 — the copy gate really does read the new copy home. Gap: the unit count fell by one.

**BREAK TEST A**: an em dash planted inside `LOBBY_COPY.alone` → `lint:copy` **exit 1**. The
fold's `COPY_TABLE_NAME` arm discovers `LOBBY_COPY` by name as claimed; M16 is not vacuous here.

`vitest run`: prototype **68 files / 829 tests**, base `74a2b5d9` **68 files / 830 tests**. The
return says "829, 0 failed" and does not say the tree lost one. It clears the floor (729) and
the loss is the A4 `tabindex` assertion the `liveRegions` re-cut deleted — but a leader whose
diff deletes a ratified mark's assertion owes that sentence in the return.

### C8 — the undefined-token census over the family's own rules. Clean, and the lane did not run it.

Every `var()` referenced by any rule matching the family's selectors, resolved at `.page-root`
and at the mark, fine / coarse (`hasTouch` witnessed) / `reducedMotion: reduce`, both engines:

```
12 references: --color-border --color-popover --color-user-ink --ease-standard --font-hand
               --head-rule --ink-press-quiet --mark-ink --presence-ink-dur --tap-floor
               --type-small --type-tag
0 carrying a fallback · 0 unresolved · --tap-floor = 2.75rem at root
min-width / min-height compute 44px at a coarse pointer, from var(--tap-floor) written BARE
transition: color 0.4s cubic-bezier(.4,0,.2,1)  →  transition-duration 0s under PRM, both engines
```

Pass-3 gap 12 closes on both halves, and `--ring-ink` is correctly NOT consumed (registry §2.9 —
LIVE's declaration does not exist on this tree, so pass 3's `var(--ring-ink, currentColor)` was
a fallback with no publisher).

### C9 — the substrate is real. I applied it myself.

`git apply --check` of `pass4/prototype/PLR-SELF/substrate.diff` against the untouched control
tree at `74a2b5d9`: **exit 0, 20 patches checked, zero rejects.** PLR-COUNT and PLR-PLACE can
replay it. The lane's honest "its substrate-ness is my word" is now somebody else's reading too.

### C10 — filters do not grow.

On my dev server, elements carrying a `url()` filter: **24 shut / 24 with the sheet open**, both
engines. That is not the estate's census number (which counts primitives, not elements), so it
corroborates rather than replaces the lane's dist run of 9 / 9 / 9 — which I did not repeat, and
which stands as its own reading.

---

## 2 · Strengths, said once

- **The primitive the whole wave copies now works.** A leader was asked to seat the first
  `@property` whose born-RED can fire; it does, on both engines, with the pass-3 form planted
  beside it as the negative control in the same run. Break test B proves it from outside.
- **Four gates, four break tests, four reds.** The copy gate, the head-rule row, the regime row
  and the Escape row each failed when I broke the thing they claim to guard. After pass 3's
  "G18 asserts the registration, not the publisher", that is the difference between a return and
  a record.
- **The instruments' own failures are named before the numbers are.** The hidden head instance,
  the 4× colour parser, the ablation that lost the cascade, the RED `lint:motion` — all four are
  §4 of the README, with the wrong number printed beside the right one. I fell into the first of
  them myself while writing K7.
- **The opaque ground is still the family's best decision**, and it is now backed by painted
  bytes rather than by arithmetic: 5.16 / 6.19 light, 6.02 / 9.64 dark, from PNG pixels.
- **The furniture is a substrate, and it is declared rather than inherited.** `min-height:
  1.4rem`, `gap: 0`, the two margins — the height law is exact to 0.05 px because those four
  declarations exist, and the README says plainly that the law read −8.034 before they were
  rebuilt. That is what COUNT and PLACE graft.
- **`SELF_TAKES_ROOM_INK` is one const, not exported, both arms buildable and framed.** Frames 3
  and 4 read at crop size — the true arm paints self in the room's pink on all three surfaces,
  the false arm paints the incumbent `#2563eb` while two peers keep their room inks. Compare
  pass 3's frame 3, which its critic read as one rectangle printed twice.

---

## 3 · Open gaps (each a sentence that could be closed)

1. **`lint:sleep` exits 1 on this tree** (6 findings, `player-mark.spec.ts:36, 69, 118, 176,
   351, 353`) and exits 0 at `74a2b5d9`: poll the invariant each one-shot names, or tag the dock
   and sheet settles `sleep-ok: <reason>`, and put the gate in the return's table.
2. **Escape moves focus a mouse never gave it**: after a cell click + a mark click,
   `activeElement` is `input.cell-native-input`; after Escape it is `button.player-mark`, both
   engines. Guard `el.value?.focus()` on the mark (or the sheet) having held focus, and add the
   row — no test in `player-mark.spec.ts` reads focus after a mouse open + Escape.
3. **T8-W3 M14's roster half is deleted with no disposition row.** `GameControlPanel.vue` loses
   the row fold, `player-row-open/close`, `player-name-quiet`, `is-arriving/is-returning/
   is-leaving` and the held departing row; the comment says they "DIED with the drawing". The
   lane drafted a row for T7-W2 A4 and none for M14 — write M14's in the same form (reason
   retired, replacing surface, holding gate) or restore it. U-10 sits over it either way.
4. **T7-W2 A4's reversal is LANDED while its disposition is only drafted**: the
   `liveRegions.test.ts` row that asserted `tabindex === "0"` now asserts the attribute is
   absent, and the unit count falls 830 → 829. Chair §6.7 gave the lane "write the row or
   restore it"; the row exists in the README and nowhere the chair can book it.
5. **`PlayerLobby.vue:64` mints `border: 2px solid color-mix(…)`** on a component this pass
   creates. Chair §1.3 as written — "L5 binds every drawn edge this pass mints; a `border` on
   chrome is a RED row, not a design choice" — makes that red today, whatever the @mbabb card
   does. The lane reports it as PROPOSED; the ruling already exists. The cure is a
   `HandDrawnOutline` on **both** head disclosures at once (CH-71's own rule), which is a pose
   decision and therefore the chair's.
6. **The deck swatch is unread** (`.game-card-swatch`, F1's fourth surface) **and G14's webkit
   race with it is unfixed**: `?view=gallery` reloads and evicts the room, so the route is the
   estate's own gallery control. Carried from pass 3 unmoved.
7. **The control estate's +22 dy / −79 scrollport is banked, not priced.** My own read is not
   independent of the lane's; §10's leader has not ruled, and the three figures in circulation
   now (pass 3's 150.1 → 45 / 1226 → 1120, pass 4's 123.3 → 45 / 1199 → 1120) differ by room
   composition, which is itself a reason to price it once with a stated room.
8. **The re-keyed regime has no coarse row in the landed gate.** `player-mark.spec.ts:333` reads
   the desk at 800 and 799 with the old query as its control; the arm the regime was re-keyed TO
   — `(pointer: coarse) and (max-height: 799px)` — is measured only in a throwaway probe. I read
   it (390×664, witnessed coarse, 1 row + `and 4 more`, both engines); the gate does not.
9. **The pose floor is still referred, not derived** — 1.143 CSS px at the widest vertex, 70 of
   231 inked pixels moving ≥8/255, 0/0 at `boilAmount 0`. Lawfully an owner's row (U-10), and it
   stays open until the owner looks.
10. **The battery is five specs.** `multiplayer.spec.ts` (LEDGER T9-R2) was not run, and it is
    the spec most exposed by this diff: `:379` asserts `.controls-card .players-roster` is
    visible and the roster is now unconditionally `sr-only`; `:181`/`:865` read `.player-self`'s
    text and `:193`/`:580` read `.player-swatch`'s colour out of a clipped list. The golden
    estate and `session-substrate.spec.ts` (`:29`, `:206`, `:225`) are in the same position.
11. **The π method is a DEV tree against a DIST control**, unstated. Benign here (every
    unclaimed box matches exactly, and I traced the one apparent delta to the DEV-only
    DebugToggle), but the next lane that copies the method will not be so lucky; say it, or
    build the prototype's dist for the π run as well as for the filter census.
12. **Inherited and unmoved**: the accent-family law (PAL-WALK), r0 I4/I5, real iOS (M19), any
    relay arm beyond `?wire=local`, and `--ring-ink` (correctly unconsumed — no declaration
    exists to copy).

---

## 4 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | **clear** — four break tests, four reds, on this tree with the file restored and sha1-verified |
| spec-cites-itself circularity | **HIT (declared)** — the pose floor is still pinned to this prototype's own reading; the lane refuses to certify it and refers it (gap 9) |
| gates that cannot fail | **clear** — pass 3's two (`G18`, the ROWS query) both fire now; the copy gate reads the new copy home; **but one gate that CAN fail is red and unnamed** (`lint:sleep`, gap 1) |
| the elegant-reduction trap | **clear** — no "and then the hard part": the regime, the two opens, the lap, the height law and the substrate are each built and measured. The lane's own "said plainly" paragraph is the honest form |
| legacy aliases | **clear** — `presenceQuietMs`, `COPY_SOURCES`, the provide/inject head plumbing and the `@keydown.enter` are struck, not renamed; `knip` 0 re-run by me |
| masked fallbacks | **clear** — 12 var() references in the family's rules, **0 with a fallback, 0 unresolved**, three regimes, both engines (C8). Pass 3's three hits are all gone |
| unverified gestalt | **partial** — desk 799 light, phone 664 dark coarse, and both F1 arms are framed on the real surface and legible; the deck swatch is framed nowhere (gap 6) |
| consumer-less substrate | **clear** — `SELF_TAKES_ROOM_INK` deliberately unexported, `claimHeadDisclosure`/`registerHeadDisclosure`/`closeHeadDisclosures`, `PRESENCE_QUIET_MS`, `quietMsOf`, `--presence-ink-dur` all have readers |
| the generic default | **clear** — no eyebrow, no arrow, no numbered marker, no rounded card set; the sheet is the incumbent card's ratified pose and the stub is the well's own seed 67 |
| the pixel it moves that it did not declare | **clear, and I looked harder than the lane did** — `.attribution-trigger` and `.hover-card` are identical once the DEV DebugToggle is controlled for; the only declared movers are `.corner-left`/`.mobile-attribution` (+45.13 w, `display` block→flex) and the §10 estate row the lane banks |
| the constraint it forgot | **HIT ×2** — R6 L5: a `border` minted on a new chrome component (gap 5); and the decided history at T8-W3 M14, retired in the diff with no row (gap 3). AA, M16, filterBudget, the tap floor, the dock, the sticky tag, L17 and law 39 all hold |

---

## 5 · The frames, looked at

`1-desk-799-four-names.png` (31,730 B · chromium · light · 1280×799 · fine) — this is the frame
that earns its replacement: the viewport that used to collapse the sheet to one name now draws
four, each in its own ink, `you` at the first row's end, `and 3 more` under them, over the
wordmark and the board's first cells (CH-71's banked pose). The ground reads opaque and the type
reads as one hand. `2-phone-dark-compressed.png` (18,224 B · chromium · dark · 390×664 ·
**coarse, `hasTouch`**) — `6 other players`, one row, `and 6 more`; in dark the sheet's ground
(18,16,15) sits within 2 of the page (17,15,14) and the 30 % border is the only edge, which is
gap 5 looking back at you. `3-f1-true.png` / `4-f1-false.png` (11,097 / 10,930 B · chromium ·
light · 1280×800 · fine) — the ballot, and they do their job: self reads `oklch(0.5 0.11 0)` in
one and `#2563eb` in the other while two peers hold their room inks in both. One thing the owner
should see that the crops do not show: in the FALSE arm the incumbent blue sits in the same
palette neighbourhood as a peer's own ink two rows down, so "one person, two colours" can also
become "two people, one colour" — and neither frame can show the other half of the argument,
which is what the OTHER pages paint you.

---

## 6 · Verdict

**ADVANCE at 85 %.**

Not 100: twelve gaps stand, and two of them are things a seal would stop at — a repo gate that
exits 1 on the lane's own file, and an Escape handler that moves a reader's caret off the board.
Neither is deep; both are a few lines.

Not BANK: nothing here is parked. The centre — one mark, one sheet, two honest opens, one
furniture law, one counting base — is the section's, the substrate applies clean to a fresh tree
at `74a2b5d9`, and COUNT and PLACE are already aimed at its selectors.

Not BLOCK: there is no missing primitive. Every row in §3 is a re-run, a number, a disposition
the chair books, or one rule of CSS.

Not RETIRE: no gate was re-worded to pass — the `lint:motion` fix rewrote the file to satisfy
the gate, which is the right direction — and the one constraint breach (L5's border) is declared
in the return and handed up rather than argued away.

**Cross-pollination.** (a) The break-test discipline — edit the tree, run the landed row, watch
it red, restore with a sha1 check — should be what every pass-4 lane means by "born-RED"; it is
the only thing that separates C4's two indistinguishable failures. (b) The painted-byte AA rig
(screenshot → `sharp` extract → WCAG luminance over the element's own rect) is eight lines and
should replace canvas compositing wherever a lane claims a contrast number. (c) The
family-scoped `var()` census (every reference in the family's own rules, resolved in three
regimes, counting fallbacks) is MOT-VERB's undefined-token census made cheap, and every lane
consuming a rung can run it. (d) `claimHeadDisclosure` as a module Set is the right shape for
any second surface hung off a shared origin — §10 and §12 both have one coming.
