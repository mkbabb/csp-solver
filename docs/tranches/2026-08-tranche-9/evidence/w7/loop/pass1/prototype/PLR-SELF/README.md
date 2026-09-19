# PLR-SELF · pass 1 (PROTOTYPE) — the crayon stub, built and measured

T9-W7 §11 · §12 · M14. The synthesis's §7 plan, built as product code in an isolated worktree
and run on the real surface, both engines. Nothing committed; nothing on the main tree but this
evidence. U-10 — this proposes.

| | |
|---|---|
| worktree | `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-46`, branch `worktree-wf_e58b4764-0fc-46` off `aab67b92` |
| dev server | `127.0.0.1:4242` (the charter's 4241 was already held by another lane's server; next free in the band, `--strictPort`) |
| probe | `probe/*.spec.ts` + `probe/plr-self.config.ts` (webServer dropped, chromium + webkit), readings `probe/readings.txt` — **24 passed · 6 failed**, and all six failures are the substrate rows below |
| frames | `frames/`, 10 crops, 48,969 B total |
| patch | `patch-tracked.diff` (6 files) + `new-files/` (4 new files) |

**Verdict: it builds, it runs, and it measures where the synthesis said it would — with one gate
refuted (G8) and one instrument that cannot pass as written (r0's I3).**

---

## 1 · Gates

| id | asserts | reading | verdict |
|---|---|---|---|
| r0 **I2** | your own swatch is the colour the room sees | `self=oklch(0.5 0.11 0)` · `room=oklch(0.5 0.11 0)` | **GREEN**, both engines (RED at HEAD) |
| r0 **I3** | a `/player/` button in the head, x<200 y<120, opens `[data-lobby]` | candidates **1** (0 at HEAD), box (75.5, 12) 45.1 × 39.8, the press opens the painted sheet | **GREEN on every clause it reaches; the row still fails** — §3.1 |
| r0 **I4** | an agreed index survives a rival `st` | 137.5° → 327.5° | RED unchanged (substrate) |
| r0 **I5** | a live claim is never re-issued | `collided: true` | RED unchanged (substrate; **flaky** — §3.5) |
| **G1** solo-identity | the board's ink palette, HEAD vs the mark | `["rgb(10,10,10)\|#2563eb\|", "rgb(10,10,10)\|#2563eb\|rgb(10,10,10)"]` — identical, both engines; and solo == in-room within a page (per-cell print, byte-equal) | **GREEN** |
| **G2** filter-census | 9, with the mark mounted and the sheet OPEN | 9 → 9 → 9 (HEAD · prototype shut · prototype open), both engines, desk and phone | **GREEN** |
| **G3** tap-floor | ≥44 in BOTH dimensions at coarse, with a 40px negative control | mark **45.1 × 44**; control **40 × 40** fails each arm | **GREEN** |
| **G4** sheet-geometry | right ≤256 at 390; never overflows; never scrolls | right **256** (the sun starts at 326 — 70px clear); `scrollHeight == clientHeight` at every count | **GREEN** |
| **G5** sheet-AA | first-16 walk ≥4.5:1 on popover-80% over background AND card, both themes, painted bytes | worst **5.31** light / **9.65** dark (chromium), **5.30 / 9.58** (webkit); quiet rung 5.15–5.19 / 6.03–6.09 | **GREEN** |
| **G6** live-regions | count and roll = HEAD's; the roster keeps `role="log"` | HEAD and prototype both: `margin-note · board-voice · players-status · players-roster · players-alone · copy-status` — **6 → 6**, same nodes, same order | **GREEN** |
| **G7** M19-whole | a third arrival: focus unmoved, sheet shut, name mutated | activeElement identical; `visibility: hidden`; `1 other player` → `2 other players` | **GREEN**, both engines |
| **G8** desk-bound | desk sheet bottom at six lines ≤ desk board top | desk board top **124.5**; the sheet's origin alone is y 51.8 and its ONE-line height is 78.9 | **REFUTED AS WRITTEN** — §3.2 |
| **G9** font-cut | coverage OK and the woff2 unchanged | `font coverage OK` · Patrick Hand **46 codepoints, 4,312 B** | **GREEN** |
| **G10** well-height | `.players-well` ≤ 284.2 × 48 with a live room | HEAD **284.2 × 109** → prototype **284.2 × 45** (webkit 284.3), same server, same room | **GREEN** — 64px to the controls card |

Censuses re-run, unchanged: R6 **hue census** byte-identical HEAD vs prototype (no token minted);
R6 **law probe** identical — 9 rows, 6 standing laws green, 3 born-RED still red; the **family
law** identical — 37 collisions, exit 1 (PAL-\*'s, not this family's); the **heading census**
identical — 4 washi tags (`new game · pencils · checking · players`), 2 zone labels, 2 section
headings, 2 `h2`, same rungs. **π on unclaimed geometry**: the grid's drawn paths are the same
lengths in the same order (`108 ×6 · 96 · 93 · 96 ×3`); the only new paths in the document are
the two stubs (397 chars each, pose 0, seed 67). **Frame times**: 241 rAF ticks / 2 s chromium in
both trees (worst gap 9.4 → 9.3), 121 ticks webkit (28 → 18), **0 long tasks** either way.

## 2 · The measurements that are the design

| | desk 1280×800 | phone 390×844, fine | phone 390×844, **coarse** dpr3 |
|---|---|---|---|
| @mbabb trigger | 75.5 × 39.8 at (0, 12) | 75.5 × 39.8 at (0, 0) | 75.5 × 44 at (0, 0) |
| the mark | **45.1 × 39.8 at (75.5, 12)** | 45.1 × 39.8 at (75.5, 0) | **45.1 × 44 at (75.5, 0)** |
| sheet origin | (0, 51.8) | (0, 39.8) | (0, 44) |
| sheet width / right edge | 256 / 256 | 256 / 256 | 256 / 256 (sun at 326) |
| state + 3 rows | h 122.1 | h 111.5 | — |
| state + 5 rows | — | — | **h 165.3, bottom 209.3** |
| state + 4 rows + `and 12 more` | h 162.7 | h 146.8 | h 162.5, bottom 206.5 |
| board top | 124.5 (left 131.9) | 252.5 | **221.7** (webkit 221.4) |
| row / state rung | 16 / 14.048 | 14 / 12.179 | **16 / 14** |
| `you` after the name | **5.6px**, every cell (153.3 in the well) | 5.6 | 5.6 |

- The mark rests at `--ink-press-quiet` (`color(srgb 0.15 0.15 0.15 / 0.68)`) solo **and in a room
  of one**, and takes `oklch(0.5 0.11 0)` light / `oklch(0.8 0.11 0)` dark the moment the room is
  two — both engines, both viewports (`frames/*-live-*.png`).
- Six lines is the ceiling **and at coarse it is nearly exact**: 209.3 against a board top of
  221.7 is **12.4px of headroom**; a seventh line (+21.6) would lap the board by 9.2px. A raised
  rung (M01) or a taller state line spends that margin.
- The sheet never scrolls at any count: `scrollHeight == clientHeight` (75/75, 161/161, 159/159).
- PRM: the ink transition resolves to `0s`; the sheet keeps the estate's own reduce arm.
- The two head disclosures share one origin and one dismissal: opening the lobby hides the
  attribution card, hovering the card hides the lobby, an outside click shuts both — both engines.
- READING THE FRAMES: in the two open-sheet crops the head's stub is GRAPHITE, not the room's
  ink, and that is the hover lift — the probe's pointer is still parked on the mark it just
  pressed, and `@media (hover: hover)` is live at a fine pointer. The live ink in the same scene
  is in the readings (`oklch(0.5 0.11 0)`); the shut-head crops show it painted.
- The qualifier is read at the OPEN and never ticks: a peer silent 21 s reads **`21 seconds ago`**,
  the same peer a moment earlier reads nothing, self reads `you`.

## 3 · Gaps, stated plainly

**3.1 · r0's I3 cannot pass as written, and the reason is the head's TWO instances.** The estate
mounts `AttributionCard` twice (desk `hidden md:flex`, mobile `md:hidden` + `v-show`), so a mark
slotted into both yields two `[data-lobby]` nodes and I3's last line —
`getByRole("dialog").or(locator("[data-lobby]"))` — is a strict-mode violation, not a failed
assertion. Everything before it is green: **1** candidate, x 75.5, y 12, and the press opens the
painted sheet (`quiet.spec.ts` runs the same row with `[data-lobby]:visible` and is **GREEN both
engines**, `lobbies: 2, visible: 1`). Two cures, neither this lane's to choose: add `:visible` to
the instrument (the research lane refused instrument edits and moved the copy instead), or render
one lobby for two marks (shared state or a `Teleport` — a new mechanism, which W2's landed grammar
forbids).

**3.2 · G8 is refuted, and the incumbent refutes it too.** The desk board's top is **124.5** and
its left edge **131.9**, so the sheet's origin (y 51.8) plus any content at all laps it — at one
line the bottom is already 130.7. The @mbabb card measured beside it: **230.4 × 135.9, bottom
202.4**, lapping the same board today, from the same origin, at HEAD. So the desk bound is not
"the sheet clears the board"; it is "a head disclosure floats over the board, as the estate's own
has since T6.2". Recommend G8 be re-cut to the two bounds that are real and measured: the sheet
clears the SUN (256 < 326) and the phone sheet clears the board (209.3 < 221.7).

**3.3 · Two unit assertions die by design.** `GameControlPanel.liveRegions.test.ts:209` (the
roster loses `sr-only` when it holds rows) and `:221` (the roster is `tabindex="0"` when it holds
rows) are exactly what §7.7 retires. Battery: **808/810 tests, 65/66 files** — those two, nothing
else. They want re-cutting to the new law in the cure's own commit.

**3.4 · The estate's e2e battery was not run** (O-12: local instruments, and this is a prototype).
Five specs address the roster's drawn grammar and should be read before the wave:
`join-language.spec.ts` (`.player-swatch` / `.player-self` — kept, so likely green),
`join-language-prm.spec.ts` (asserts the ABSENCE of `is-arriving` / `is-leaving` — now vacuously
true, a weaker test than it was), `multiplayer`, `presence`, `session-substrate` (`.player-name`
text — kept). The roster's markup was deliberately kept whole under `sr-only` for exactly this
reason; `.player-swatch`'s one background declaration stays because it is where the room's colour
resolves for every instrument that reads it.

**3.5 · r0's I5 is order-dependent.** Run alone it reports `collided: true`; inside the full suite
on webkit it once reported `collided: false` (`IDENTITY_CAP`'s ring reads storage an earlier test
left). Not this family's cure, but the row cannot be trusted until it clears its own storage.

**3.6 · The state line is a COMPUTED string** (`App.vue`, `` `${others} other players` ``), which
is precisely the blind spot R6's born-RED law R2 names: `check-copy-register` reads rendered
literals and cannot see it. The gate passes (0 unadmitted, the same 2 pre-existing admissions) but
it did not actually read this family's sentence. Checked by hand against the shipped 46-codepoint
cut: `no other players · 1 other player · N other players · you · N seconds ago · and N more` —
every glyph present, no `j`, no `x`, zero re-cut (asserted again at 4,312 B).

**3.7 · Not measured.** Real iOS (M19 forbids it here — Playwright webkit is the floor); the
gallery view's persistence of the mark (it is slotted inside the cards, so it follows @mbabb by
construction, but no frame was taken); landscape; the relay arm (the local arm is what the battery
drives); a 16-player room built from 16 real pages rather than synthetic `hi` frames.

**3.8 · Three small departures from the spec's letter**, each measured: the mark is **45.1** wide
at a fine pointer, not 45.2 (padding rounding); the qualifier's `margin-left: 0.35rem` was
**deleted** — with the row's own `gap` it measured 11.2px, two spacings for one relationship, and
the gap alone gives the spec's 5.6; `.corner-left` / `.mobile-attribution` take `flex items-center`
as **utilities**, not as a scoped `display`, because an unlayered scoped `display: flex` beats
Tailwind's layered `hidden` and would paint the desktop corner on a phone.

## 4 · What is in the patch

`useSession.ts` — `mint`/`adoptInk` give SELF its room index (F1; `mint` runs only inside a room,
so a solo board binds nothing); `PRESENCE_QUIET_MS = 20_000` beside the beat and the expiry;
`lastHeard` stamped at the one arming site; `quietMsOf(id)` exported. `pencilConfig.ts` —
`MOTION.presenceInkMs: 400`. `icons/PlayerStub.vue` — the 24×24 pose-0 rect, seed 67, static,
`aria-hidden`, no filter. `AttributionCard.vue` — the corner becomes a head ROW, the hover grammar
moves one level in (a `mouseenter` on the wrapper would have opened the card from the mark), a
`#mark` slot, and the disclosure registry. `useHoverCard.ts` — the `headDisclosures` contract.
`PlayerMark/` — the mark, the sheet, their two row types. `App.vue` — the rows, the ink and the
sentence cross the boundary here, as `deckSession` already does. `GameControlPanel.vue` — the
roster is `sr-only` unconditionally, keeps `role="log"` / `polite` / its label, and loses
`tabindex`, the departing rows, the three one-shots, the fold, the scrollport and the swatch's
pixels: **−206 / +45 in that file**.

Not cured, made visible: I4 (`adoptInk` unguarded), I5 (`IDENTITY_CAP` re-issue, and its
flakiness), the family law's 37 collisions — index 0, which the host always wears, still sits
1.0° from `--color-solver-ink-1`.
