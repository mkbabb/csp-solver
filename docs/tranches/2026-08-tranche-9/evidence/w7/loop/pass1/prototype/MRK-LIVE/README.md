# PASS-1 PROTOTYPE · MRK-LIVE · The living mark

It RUNS. The §3 diff is source in a throwaway worktree, served on `127.0.0.1:4238`, and every
number below was taken off that server in BOTH engines. Nothing was measured from the overlay.

- Worktree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-44`
  (branch `worktree-wf_e58b4764-0fc-44`, base `aab67b92`). Uncommitted, by instruction.
- Probes: `probe/` (this dir) · logs: `logs/` · frames: `frames/` · config: `probe/pw.config.ts`.
- The estate's own specs ran against the same server through a scratch copy of
  `playwright.config.ts` (no webServer, no globalSetup, baseURL 4238).

## 1 · The gates

| gate | law | HEAD | prototype |
|---|---|---|---|
| G-LIVE-1 | σ_t inside the grid's own band at 4×4/9×9/16×16 | RED 0/0/0 | **GREEN** 0.0257 / 0.0421 / 0.0397 px, bands [0.0152,0.0606] / [0.0134,0.0536] / [0.0134,0.0536]; identical to 4 dp in both engines |
| G-LIVE-2 | ≥4 swaps in 700ms, 0 in the next 3s, final pose 0 | RED (0 swaps ever) | **GREEN** 4 swaps at 48/173/298/423ms (chromium), 64/195/336/446ms (webkit); final 0; 0 swaps in 3s; PRM 0 swaps |
| G-LIVE-3 | one ring owner off the board, ≤1px, deck rides the activedescendant card | RED (no such node) | **GREEN** 13 stops chromium / 7 named stops webkit, exactly one ring each, max error 0.00px (webkit 0.01); deck ring on `.game-card.is-center`, travels 352px on ArrowRight, lands 0.05px; `.gallery-viewport` outline none |
| G-LIVE-4 | ≤0.5px after a 240px scroll and 1280→1024, ≤8 repositions/900ms idle | RED | **GREEN** 0.00 / 0.00px both engines; **0** writes per 900ms idle |
| G-LIVE-5 | every stop ≥3:1 from painted bytes, both themes | RED (WebKit UA 1.78–2.15, logo 2.70, deck 2.70) | **GREEN** light 4.29 card / 4.19 page; dark 4.29 card / 4.38 page; identical in both engines |
| G-LIVE-6 | every `:focus-visible` stop computes `outline-style: solid` under forced colors, drawn ring hidden | RED (`3px none`) | **GREEN** with one declared exception: `.cell-native-input` computes `3px none` because the board's HC ring rides the CELL (`2px solid`, offset −2px, measured) |
| G-LIVE-7 | `beatsFor(BOIL_CONFIG.intervalMs) === 1` and no "6.7" in `pencilConfig.ts` | RED | **GREEN** 150/125 → 1; zero occurrences of `6.7` |

Guards, all still green: R3-a1 per unit of edge **0.951 / 1.132 / 0.685** (byte-identical to the
r0 census — pose 0 is `generateCellRects`' own output, so the resting geometry could not move);
σ over space **0.1377 / 0.092 / 0.0768**, unchanged; filter budget **9 / 9 / 9** with population
**19 / 84 / 259** (+3, never +N²) and every ghost path's computed `filter: none`; the deck view's
13 filtered elements are the deck's own (**0** of them the ring); a11y 3.5 and access 2.1/2.2/2.3
green; hue census byte-identical (zero new hexes); R6 law probe identical (6 GREEN, 3 born-RED).

## 2 · What the diff is

`git -C <worktree> diff --stat` — 16 files, +279/−88, plus one new component (`FocusRing.vue`, 222
lines). Six bespoke focus rules died, the `outline-ring/50` sweep died, two false comments died.

Three deviations from the plan, each measured into existence:

1. **The ring takes its target by `aria-activedescendant`, not by a provided ref.** `provide`
   cannot reach a sibling, and the accessibility tree already names the owner. `FocusRing` reads
   the attribute and watches it, so the deck needed no edit at all and the rule generalises to
   any activedescendant surface. Measured: the ring rides the card and moves with it.
2. **The pose swap is a cascade, not a prop.** Threading the index through the cell v-for
   re-rendered every cell at 8Hz — WebKit's 16×16 phone traversal crossed 33ms twice. The board
   writes one `data-mark-pose` on the grid and `gameCell.css` answers; the same shape as the
   grid's own `.boil-frame-layer.is-active` swap. One attribute write per beat.
3. **One composable, three consumers.** `useMarkPose(landed)` in `boilBeat.ts` is the one-shot
   sibling of `useBeatFrame`: the board's selection, the chrome ring, and the armed verb all take
   their single revolution from it. Seven lines once instead of three times.

Two deletions the plan did not name, both forced by measurement:

- `.sun-moon-toggle:focus { outline: none }` and its `:hover` twin. The plan deleted the
  `:focus-visible` rule only, and the scoped `:focus` pair then beat the forced-colors
  restoration — High Contrast computed `3px none` on that one control. Both are gone.
- `@property --focus-ring-outset` is registered as a `<length>` in `index.css`. Unregistered, the
  toggle's `calc(2px - var(--toggle-bleed))` reaches JavaScript unresolved and parses as NaN;
  registered, `getComputedStyle` hands back **54px** and the ring sits on the ornament edge,
  exactly where the T9-W2 ruling put it (measured on the stop walk).

## 3 · The frames (dpr3, ≤150 KB each, both engines)

| file | what | painted delta pose 0 → 2 |
|---|---|---|
| `a-cell-9x9-pose{0,2}-light.png` | the selected cell, 9×9, 1280×800, chromium | 1.62% of the crop, max Δ 57 |
| `b-cell-16x16-pose{0,2}-dark.png` | the selected cell, 16×16, 393×699, webkit | 3.61%, max Δ 36 |
| `c-ring-toggle-pose{0,2}-light.png` | the drawn ring on the toggle at its 54px ornament edge, chromium | 1.43%, max Δ 195 |
| `c-ring-deckcard-pose{0,2}-dark.png` | the drawn ring's corner on the deck's centre card, webkit | — |
| `d-verb-armed-pose{0,2}-light.png` | the armed destructive verb, chromium | 4.66%, max Δ 230 |

Poses are pinned: the board's by writing `data-mark-pose`, the drawn stacks by a one-rule
stylesheet naming which sibling paints. No geometry is touched by the pinning.

## 4 · Gaps, honestly

1. **The phone trace is not clean on a loaded machine.** WebKit, 16×16, 192 frames, four samples:
   living 2/8/0/0 frames over 33ms against a PRM control of 0/2/1/0. Chromium is 0 in every
   sample (max 12.1ms). The two bad samples were taken while other lanes held the machine, and
   the control failed in one of them. Read: 0 long frames when the machine is quiet, both
   engines — but it wants a re-measure on a quiet box before anyone calls it green.
2. **`spoken-gallery.spec.ts` had to be re-based, and that is a decision, not a fix.** Two of its
   helpers read `outline-style` on the card — the exact rule W7 §6 deletes — so the spec went red
   on its own terms while the sentence it asserts stayed true. I re-based `ringOwner`/`ringWhole`
   onto the drawn ring (both forms are still read, so a bespoke outline anywhere is still an
   owner). The W3 wave owns that instrument; the agglomerator should decide whether the re-base
   lands with this family or whether §6 keeps a card-side outline.
3. **R6's R1 row stays RED and cannot go green as written.** It asserts that a chromatic token
   painting in both themes carries a dark ARM. This family's ruling is the opposite: ONE value,
   measured flattest of five (4.19–4.38 on four grounds), and the "missing dark arm" was a
   comment lying about it. I rewrote the comment with the measured numbers; the row's law needs
   re-basing to "the token's comment tells the truth about its themes" or it will red forever.
4. **`.gallery-guard:focus { outline: none }` survives** (the ribbon container, `tabindex="-1"`).
   It is not a tab stop and programmatic focus does not match `:focus-visible`, so G-LIVE-6 does
   not see it — but it is a suppression at scoped specificity and the next wave that focuses that
   container by keyboard will find it.
5. **The armed verb is wired and measured, which is more than §1.4 promised and less than a
   ruling.** 4 swaps at 32/156/281/406ms (chromium) and 68/200/317/451 (webkit), final pose 0,
   zero filters. What is NOT decided is whether a destructive verb SHOULD breathe: it is the one
   place in the estate where movement reads as a warning rather than an invitation. Owner's eye.
6. **The ring settles over a landing with a bounded rAF burst** (≤36 frames, stops on stillness).
   A deck landing arrives mid-glide and a WAAPI transform fires no scroll, no resize and no
   ResizeObserver, so the pure event form left the ring 352px behind the card. Idle cost is still
   zero — measured 0 writes per 900ms — but this is a rAF loop the §6 spec said it refused, and
   it is bounded rather than absent. Name it plainly at the re-look.
7. **Not measured this pass:** the peer wash (banked, unchanged by this diff), the r0 heading
   census (no instrument shipped with r0 — the spoken-gallery head-order row stands in for it and
   is green), and real iOS.
