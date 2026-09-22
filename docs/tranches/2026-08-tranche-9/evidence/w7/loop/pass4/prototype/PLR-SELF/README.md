# PLR-SELF · pass 4 (PROTOTYPE) — the stub is you, rebuilt, and the section's furniture

T9-W7 §11's LEADER. The pass-3 worktree was lost by the chair, so this pass REBUILDS: the
banked pass-2 patch replayed onto a fresh tree at `74a2b5d9`, then every pass-3 delta re-authored
from `pass3/prototype/PLR-SELF/README.md` and verified against `pass3/critique/PLR-SELF.md`'s
numbers, then pass 4's own work on top. Nothing committed. U-10 — this proposes.

| | |
|---|---|
| worktree | `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF`, branch `w7/p4-plr-self`, base **`74a2b5d9`** |
| dev server | `127.0.0.1:4241`, `--strictPort`, private `cacheDir` `.vite-cache-plr-self` — **killed by PID** |
| HEAD control | `127.0.0.1:4242`, the shared read-only tree `.claude/worktrees/w7-control` at `74a2b5d9`, verified by its own asset hash **`index-CubiZsMVSwTc.js`** — **killed by PID** |
| built dist | `127.0.0.1:4243`, this tree's own build (`.vite-cache-plr-build`), identity **`index-CWsd8Tr1rdNS.js`** — **killed by PID** |
| probes | `.plr-self/p4-census · p4-rows · p4-aa · p4-dist · p4-f1` (copies under `instruments/`), run bare, logs under `logs/` |
| frames | 4 crops, 72,981 B total — each a REPLACEMENT, §5 names what it retires |
| substrate | **`substrate.diff` banked** (20 files, +1,382 / −361 against `74a2b5d9`) — PLR-COUNT and PLR-PLACE replay it instead of scaffolding |

**Verdict: the twelve pass-3 gaps close 8 whole, 2 in part, 2 not at all.** Every number below
was measured on this tree, both engines. Four of my own instruments were wrong before they were
right and each is named in §4 — a probe that reads the hidden head instance, a colour parser that
over-reported AA by 4×, a `@property` ablation that never won the cascade, and a height law that
was off by 8 px because two declarations had not been rebuilt.

---

## 1 · The replay, and every conflict

`git -C <worktree> apply --3way <pass2.diff>` — the chair's banked patch, base `a8fee1f5`, into
a tree at `74a2b5d9`. **38 files, 35 applied cleanly, 3 conflicted.** Each resolved TOWARD THE
FOLD, as the pass-3 rulings require:

| file | conflict | resolution |
|---|---|---|
| `scripts/check-copy-register.mjs` | 5 hunks (pass 2's `COPY_SOURCES` arm vs the fold's `COPY_TABLE_NAME`) | **pass 2's arm STRUCK WHOLE** — the fold's `:344` discovers `LOBBY_COPY` by name; the file is byte-identical to HEAD, and `lint:copy` reads the table (0 admissions) |
| `scripts/check-font-coverage.mjs` | 1 hunk (the fold's `paperNoteCopy` vs pass 2's `lobbyStrings`) | **both kept**, `lobbyStrings` re-seated in the fold's own shape |
| `docs/tranches/LEDGER.md` | 1 hunk (the fold's T9-R1/R2/R3 vs pass 2's CH-70/CH-71) | **both kept**, five rows |

**LINE-COUNT CHECK, every touched file** (`base at 74a2b5d9 + additions − deletions` against the
file on disk): **37 of 38 exact.** The one mismatch is `check-copy-register.mjs` — expected 1,549,
actual 1,422 — and it is the deliberate strike above, not a dropped hunk. `vue-tsc -b` exit **0**
on the replay before a line of pass 3 was rewritten.

The pass-2 patch also carried a `plr-self-probe/` directory at the REPO ROOT. It is not a product
file, so it was unstaged and moved to `web/frontend/.plr-self/` (deleted before return, per LAWS).

## 2 · The numbers

### 2.1 π against the HEAD control (`74a2b5d9`, `index-CubiZsMVSwTc.js`)

Seven chrome keys plus cell 0, reading **computed paint properties and tag names**, not rects
alone: box, `color`, `background-color`, `font-family/size/line-height/weight`, `tagName`. Desk
1280×800 solo AND in a room of five, phone 390×844 solo, both engines — **six comparisons.**

**Exactly one key differs, in every one of the six:**

`.corner-left` (desk) / `.mobile-attribution` (phone) **75.53 → 120.66 wide** — `+45.13`, the
mark's own box — same x, same y, same height (39.75), same `color`, same `background-color`, same
font, same tag. `.corner-right`, `.controls-card`, `.board-wrapper`, `.drawer-tab`, `.masthead`
and cell 0 (70.71 × 70.71 desk, 40.22 × 40.22 phone) are **identical on both trees**. The mark
costs the estate nothing it did not declare.

### 2.2 The control estate the "64 px" stood in for — PRICED (pass-3 gap 3)

Desk 1280×800, five at the table, both engines, both trees, at the same scroll position:

| | prototype | HEAD `74a2b5d9` | Δ |
|---|---|---|---|
| the well (`.tray-well` holding `.players-roster`) | 284.2 × **45** (wk 292.3 × 45) | 284.2 × **123.3** (wk 292.3 × 121.5) | **−78.3** / −76.5 |
| `.controls-card` `scrollHeight` | **1120** / 1121 | **1199** / 1198 | **−79** / −77 |
| `.control-panel-wrap` height | 1044.48 / 1045.45 | 1122.84 / 1122.02 | −78.36 / −76.57 |
| `.control-panel-wrap` y | −351.55 | −373.55 | **+22.00** |
| `.peek-hold-surface` y | 165.23 | 143.23 | **+22.00** |
| `.copy-status` y | −352.55 | −374.55 | **+22.00** |
| `.tray-well:first` y | −345.95 | −367.95 | **+22.00** |
| `.controls-card` outer box | 324.22 × 608 | 324.22 × 608 | **0** |

**SOLO the estate is byte-identical on both trees** (well 66.4, scrollHeight 1142/1143, every y
the same) — the delta exists only in a room, which is a sharper sentence than pass 3's. The card's
frame does not move; its content sits **22 px lower** and its scrollport is **79 px shorter**.
These pixels are §10's, not §11's. My figures differ from the critic's C6 (150.1 → 45, 1226 →
1120): same direction, same +22, different room composition. **The row is banked; the price is
§10's leader's to rule.**

### 2.3 The furniture law — exact to 0.05 px, both engines, two cells

`H = 36 + S + 5.6 + 22.4·r + (1.6 + S)·m`, S read from the sheet:

| cell | S | r · m | measured H | law | Δ |
|---|---|---|---|---|---|
| desk 1280×800 / 799 / 780, seven at the table | 18.953 | 4 · 1 | **170.66** | 170.71 | **−0.05** |
| phone 390×664 coarse `hasTouch`, five at the table | 18.891 | 1 · 1 | **103.36** | 103.38 | **−0.022** |

The law only holds once the furniture is DECLARED, and rebuilding it is what pass 4 had to do:
`min-height: 1.4rem` on `.pl-row` (the 22.4 term — the row was 21.6 without it), `gap: 0` said
out loud on `.pl-rows`, `margin-top: 0.35rem` on `.pl-rows` (the 5.6) and `margin-top: 0.1rem` on
`.pl-more` (the 1.6). Before they landed the law read **−8.034**; §4 tells that story.

### 2.4 The row budget — the 1280×799 cliff is gone (pass-3 gap 4)

Seven at the table, chromium and webkit:

| viewport | rows drawn | compression line | sheet h | sheet bottom | board top | `(min-height: 800px)` | the new regime |
|---|---|---|---|---|---|---|---|
| 1280×800 | **4** | `and 3 more` | 170.66 | 222.4 | 122.5 | true | false |
| 1280×799 | **4** | `and 3 more` | 170.66 | 222.4 | 122.5 | **false** | false |
| 1280×780 | **4** | `and 3 more` | 170.66 | 222.4 | 122.5 | false | false |

The regime is now `(pointer: coarse) and (max-height: 799px)` — the phone's board top, which is
the constraint `ROWS.short` actually serves, since the desk lap is CH-71's ratified pose.
**The born-RED lives in the same run**: the old query flips true → false across that pixel and
the drawing does not. `e2e/player-mark.spec.ts:333` asserts both halves.

### 2.5 AA, composited, on the sheet's own opaque ground

| | ground | opaque | state line / qualifier | row names |
|---|---|---|---|---|
| light | `rgb(252, 251, 251)` | yes | **5.16** | 5.59 · 5.97 · 6.02 · 6.19 |
| dark | `rgb(18, 16, 15)` | yes | **6.02** chromium / **6.10** webkit | 9.64 · 9.89 · 9.93 · 10.55 |

Every rung clears 4.5:1 in both themes. Independently reproduced against pass 3's own figures and
the critic's C3, to the hundredth. The theme is flipped by the estate's own control, not by a
class the probe invents.

### 2.6 The dist half (pass-3 gap 6) — RUN

Built in the worktree with its own `cacheDir`, served at `:4243`, identity `index-CWsd8Tr1rdNS.js`:

- **filter census 9 · 9 · 9** — shut, incumbent card open (the control), lobby open — both engines.
- **9 · 9 under `reducedMotion: reduce`** — both engines. `filterBudget` does not grow.
- the mark's box on the shipped artifact: **45.125 × 39.75** fine, **45.125 × 44** coarse.
- `min-width`/`min-height` compute **44px** from `var(--tap-floor)` written BARE.
- `patrickhand-subset-BqV1besB36ib.woff2` on the shipped artifact = **4,312 B**, the same byte as
  the source-side gate's figure. 46 codepoints, 27 declared strings over 5 groups.

### 2.7 The lap census, geometry re-read PER CELL (pass-3 gap 1) — the red RETIRES

**Short phone 390×664, `hasTouch`, witnessed coarse, five at the table**, sheet re-opened before
every read, nothing clicked in between:

| cells | lap w × h | top element at the lap's centre | tap → sheet | cells selected | focus into a cell |
|---|---|---|---|---|---|
| 0–5 | 40.2 × **15.6** (wk 15.9) | `div.player-lobby.is-open` | shut | 0 | no |
| 6 | **0.7** × 15.6 | `div.board-wrapper…` | shut | 0 | no |

Identical on both engines, and identical to the critic's C1. Cell 6's lap is a 0.7 px sliver at
the sheet's own right edge (sheet x 0–256, cell 6 x 255.4–295.6) — geometry, not a mystery.
**CAUSE NAMED: pass 3's probe re-used geometry measured before the cell-centre clicks its own
loop interleaved.** Re-read per cell, the red does not exist.

**Desk 1280×800, seven at the table** (CH-71's pose): **2 lapped cells**, 70.7 × 70.7 and 53.5 ×
70.7 (webkit 57.5), top element `li.pl-row` at both — the sheet — tap dismissed it, 0 cells
selected, focus never in a cell. Both engines.

### 2.8 Escape has one owner (pass-3 gap 5)

`useAnswerKeyPeek.ts:56` answers Escape unconditionally on a `window` keydown registered at
mount — earlier than the mark's and in the same phase, so `preventDefault` could never reach it
and `stopImmediatePropagation` cannot reach backwards past a listener that already ran. **The cure
is the phase**: the mark's listener is registered in CAPTURE on `window` and stops propagation,
so while the sheet is open nothing else reads the key. Measured, both engines:

- peek up, sheet open, Escape → sheet `aria-expanded false`, **peek still up** (laminate count 1).
- **negative control, same run**: sheet shut, Escape → peek down (count 0). The peek does own the
  key; the row is a claim, not a tautology.

### 2.9 `@property --head-rule`, with a born-RED that can fire (pass-3 gap 2)

Registered in `src/assets/index.css` — the FIRST STATIC STYLESHEET, never the file that publishes
it — `syntax: "<length>"`, `inherits: true`, **`initial-value: 0px`**. Both engines, desk:

| | `--head-rule` at `.page-root` | `.corner-left` top | the PLANTED pass-3 form (`initial-value: 12px`) |
|---|---|---|---|
| publisher present | `12px` | **12** | 12 |
| publisher STRUCK | **`0px`** | **0** — the head hard against the viewport edge | **12** — unmoved |

The planted token is the negative control and it is the pass-3 gate: same syntax, same publisher,
`initial-value: 12px`, struck the same way, indistinguishable from its own publisher. One run,
two ablations, one proving the other can fail. A CSSOM scan for `var(--head-rule,` returns **0**
across every stylesheet the page loads — both consumers (`App.vue:1055`,
`AttributionCard.vue:165`) were struck to the bare form in this diff.

### 2.10 F1's two arms, read (pass-3 gap 7)

`SELF_TAKES_ROOM_INK`, one const in `useSession.ts`, NOT exported (an exported flag with no
importer is a consumer-less substrate; `lint:knip` said so and it was right). Three surfaces read
in a room of three, chromium:

| surface | `true` | `false` |
|---|---|---|
| the head's mark (`color`) | `oklch(0.5 0.11 0)` | `rgb(37, 99, 235)` |
| the sheet's own row (`.pl-name`) | `oklch(0.5 0.11 0)` | `rgb(37, 99, 235)` |
| the roster's self swatch | `oklch(0.5 0.11 0)` | `rgb(37, 99, 235)` |

Both arms build and run; frames 3 and 4 are the two. The DECK swatch — the fourth surface — is
**not read**; see §5.

### 2.11 Gates and batteries, bare

| gate | reading |
|---|---|
| `vue-tsc -b` | **exit 0** |
| `vue-tsc --noEmit -p tsconfig.e2e.json` | **exit 0** |
| `vitest run` | **68 files / 829 tests, 0 failed** |
| `eslint src e2e scripts` | **exit 0** |
| `knip` | **exit 0** (after the F1 export came down) |
| `prettier --check src/ scripts/` | **exit 0** |
| `lint:copy` | **0 em/en dashes, 0 unadmitted jargon**, 142 files, self-test RED on every planted offence |
| `test:font-coverage` | **OK** — Patrick Hand 46 cp / 4,312 B, 27 strings over 5 groups; Fraunces 30 cp / 14,636 B |
| `lint:live-regions` | **0** |
| `lint:theme-tokens` | **0 unreferenced**, negative control RED |
| `lint:motion` | **OK, 35 specs** — it **RED at first** on this tree; §4 |
| estate battery (quiet box) | **64 passed / 0 failed**, both engines: `player-mark` (7 rows ×2), `masthead-alignment`, `join-language-prm`, `a11y`, `presence` — including `presence.spec.ts:177`, green on a dev server exactly as LEDGER T9-R1 says it must be |

## 3 · What the rebuild landed

`SELF_TAKES_ROOM_INK` (F1 behind one const) · the `@property --head-rule` registration with the
visible-failure initial · `PRESENCE_QUIET_MS` exported under its own name (the `presenceQuietMs`
alias deleted) · `claimHeadDisclosure` / `registerHeadDisclosure` / `closeHeadDisclosures` as a
module Set in `useHoverCard.ts`, replacing the provide/inject plumbing on both consumers ·
`PlayerStub`'s boil 0.4 → **2** (1.143 CSS px at the widest vertex; 0.4 moved 0.229) ·
`.lobby-*` → `.pl-state` / `.pl-rows` / `.pl-row` / `.pl-stub` / `.pl-name` / `.pl-qual` /
`.pl-more` · the roster `sr-only` and the `--color-popover` opaque ground (already in pass 2) ·
the row floor + the two margins that make the height law true · `var(--tap-floor, 2.75rem)` →
`var(--tap-floor)` · `var(--head-rule, 0.75rem)` → `var(--head-rule)` at both consumers.

`e2e/player-mark.spec.ts` carries **7 rows** (14 executed): the F1 ink, the mouse seam, the
keyboard toggles with Escape, the compression budget, the head-rule pair with its planted control,
Escape's single owner with its negative control, and the 800/799 pair with the old query as its
control. `--ring-ink` is **not consumed here** — MRK-LIVE's declaration does not exist on this
tree, and pass 3's `var(--ring-ink, currentColor)` was a fallback with no publisher anywhere. The
ring stays `currentColor` until LIVE's line lands, and then it is copied bare (registry §2.9).

## 4 · Four of my own instruments were wrong, and each is named

1. **The probe read the HIDDEN head instance.** `document.querySelector('[data-lobby]')` takes the
   desktop sheet, which is `display: none` on a phone: the first phone lap census returned **zero
   lapped cells** and a sheet of height 0, and I nearly reported "there is no lap at 390×664".
   Every probe now takes the first `[data-lobby]` with a non-zero box. The real reading is §2.7.
2. **The colour parser over-reported AA by 4× in light and 8× in dark.** Both engines return
   `color(srgb 0.15 0.15 0.15 / 0.68)` for a `color-mix()` rung — 0-to-1 floats with an alpha —
   and a regex over the digits read `0.15` as a byte and dropped the alpha: light's quiet rung
   came back **20.31** instead of 5.16, and dark came back **1.07**, which would have read as a
   catastrophic AA failure that does not exist. The probe now paints ground-then-ink on a 1×1
   canvas and reads the byte: the compositor's arithmetic, not mine.
3. **The `@property` ablation never won the cascade.** App.vue publishes `--head-rule` from a
   SCOPED block, so Vue emits `.page-root[data-v-…]` at (0,2,0); the injected `.page-root { … }`
   at (0,1,0) struck nothing and the row read `12px` after the strike on both engines — which
   looks exactly like the defect it is written to catch. The strike is inline now. A gate that
   cannot fail and a gate whose ablation does not land are indistinguishable from outside, which
   is the whole of C4's lesson repeated one layer down.
4. **`lint:motion` RED on the replayed tree.** `player-mark.spec.ts`'s PRM declaration was
   unparseable prose (`PRM: this file drives no motion…`); exactly two forms are lawful. Rewritten
   to `PRM: live, because …`, exit 0, 35 specs declaring.

Also corrected: the height law read **−8.034** until `min-height: 1.4rem`, `gap: 0` and the two
margins were rebuilt — the pass-3 README named the 22.391 px row floor in prose and the charter's
delta list did not, so it was nearly lost with the worktree.

## 5 · Open gaps, honestly

1. **The deck swatch is unread, and G14's webkit race with it** (pass-3 gaps 7, 11). F1's false
   arm is read on the mark, the sheet row and the roster swatch; the deck's `.game-card-swatch`
   is a different view, and reaching it by `?view=gallery` RELOADS the page and evicts the room,
   so the swatches read empty. The estate's own gallery control is the route and I did not take
   it. G14 is therefore still unfixed as well as unrun.
2. **The control estate's +22 / −79 is banked, not priced.** §2.2 is a reading against the named
   control; what the estate owes for it is §10's leader's ruling, and nobody has made it.
3. **The pose floor is still the owner's row.** The amount moved to 2 on a measurement (0.5713
   CSS px per unit, linear, nine samples — pass 3's), but WHAT FLOOR a pose swap owes a reader is
   not derived from anything but this prototype's own reading. Ballot in §6; the raster half's
   re-cut remains a declared re-wording, carried, not landed.
4. **T7-W2 A4's disposition row is drafted here and nowhere else** (pass-3 gap 8, chair §6.7). The
   reason: a roster inside the controls card was a tab stop whose content no keyboard reader could
   act on. The replacing surface: the head's mark, a single `<button>` in the natural head order
   whose accessible name IS the state line, with the roster kept mounted `sr-only` as the room's
   one `role="log"`. The holding gate: `e2e/player-mark.spec.ts`'s keyboard row plus
   `GameControlPanel.liveRegions.test.ts`'s re-cut rows. **It is a row for the chair to book, not
   a lane's to land**, and COUNT and PLACE inherit it.
5. **AA is composited from computed colours, not from screenshot bytes.** The canvas does the
   compositor's arithmetic on the engine's own parsed colours, which is a great deal better than
   token arithmetic and is still not a painted byte. A hairline or stroke row would need the real
   thing; the sheet's text is not a hairline, so this is a stated limit rather than a defect.
6. **The battery is five specs, not the estate.** `player-mark`, `masthead-alignment`,
   `join-language-prm`, `a11y`, `presence` — 64 green on a quiet box. `multiplayer.spec.ts` (the
   specs that ride the live relay, LEDGER T9-R2) and the golden estate were not run.
7. **Inherited and unmoved**: the accent-family law (PAL-WALK), r0 I4/I5, real iOS (M19), any
   relay arm beyond `?wire=local`, and `--ring-ink` (no declaration exists to consume yet).

## 6 · For the owner

- **F1 (chair §6.10 / registry §6.10)** — both arms buildable and framed. **TRUE**: your mark,
  your row and your swatch say the colour the room says (`oklch(0.5 0.11 0)` here), frame 3.
  **FALSE**: those three keep the incumbent blue (`#2563eb`) while every other page paints you
  from `k`, frame 4. Nothing else changes in either arm.
- **The pose floor (U-10)** — the hover/focus swap moves 1.143 CSS px at the widest vertex of a
  20 px stub and 70 of 231 inked pixels by ≥8/255, with 0/0 at `boilAmount 0` as its control. The
  question the artifacts cannot answer is whether that is enough to read as an affordance. The
  eye decides; the lane will not pin the floor to its own measurement again.

## 7 · The frames (4, 72,981 B, each a REPLACEMENT)

| frame | engine · theme · viewport · pointer | retires |
|---|---|---|
| `1-desk-799-four-names.png` (31,730 B) | chromium · light · 1280×799 · fine (mouse) | pass-3 `1-desk-mark-and-sheet.png` — the same sheet at the viewport that used to collapse it to one name |
| `2-phone-dark-compressed.png` (18,224 B) | chromium · dark · 390×664 · **coarse (`hasTouch`)** | pass-3 `2-phone-dark-compressed.png` |
| `3-f1-true.png` (11,097 B) | chromium · light · 1280×800 · fine (mouse) | pass-3 `3-pose-rest-vs-hovered.png` — the frame its critic read as one rectangle printed twice |
| `4-f1-false.png` (10,930 B) | chromium · light · 1280×800 · fine (mouse) | pass-3 `4-deck-swatch-in-a-room.png` |
