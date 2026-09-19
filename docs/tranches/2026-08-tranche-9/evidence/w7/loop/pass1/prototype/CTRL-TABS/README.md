# CTRL-TABS · pass 1 (PROTOTYPE) — THE INDEX TABS, RUNNING

Section §10 (§1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13
Prototyper: Opus 5. Spec: `../../synthesize/CTRL-TABS.md`. Research: `../../research/CTRL-TABS/`.
Nothing closes here (U-10).

    TREE       worktree `.claude/worktrees/wf_e58b4764-0fc-39`, branch `worktree-wf_e58b4764-0fc-39`,
               cut from `aab67b92`. The MAIN tree was never written to except for this evidence
               directory. UNCOMMITTED by instruction — `git -C <worktree> diff --stat` is the patch.
    PATCH      10 files, +1,269 / −1,431. The overlay is GONE: every selector below is a product
               selector this patch mints (`proto/ctrl-tabs-proto.diffstat.txt`).
    SERVER     npx vite --host 127.0.0.1 --port 4238 --strictPort (4230–4237 and 4239 were taken)
    ENGINES    playwright chromium + webkit, headless, own scripts, own scratch configs
               (`probe/pw.config.ts`, `probe/e2e.config.ts`). Never the estate's default (it
               starts :3000). No Safari, no osascript. M19 clean.
    CELLS      390×844 · 375×812 · 430×932 · 900×500 · 844×390 · 1280×800 · 1440×900, light and
               dark where the claim is a colour one
    SETTLE     950 ms after every sheet tap — the sheet SLIDES
    VERDICT    IT RUNS, and it greens ten of the family's twelve born-RED rows on the real
               surface. Two rows it does NOT green are the family's own idea biting back (§5),
               and three estate suites must be re-aimed in the cure's own commit (§6).

---

## 1 · The paired read — HEAD and the prototype, one instrument, both engines

`probe/ab.probe.mjs`, run twice against the same server: once with the patch in the tree, once
with the ten files restored to HEAD (`readings/paired-head.json` / `paired-proto.json`). The HEAD
arm reproduces the research's born-RED numbers to the unit, which is what makes the other column
a measurement rather than a claim.

| row | HEAD | prototype |
|---|---|---|
| card scrollHeight / clientHeight, 390×844 | **699 / 628** (over 71) | **296 / 296 · FIT** |
| 375×812 | 699 / 596 (over 103) | 296 / 296 · FIT |
| 430×932 | 675 / 675 | 260 / 260 · FIT |
| **900×500 (the binding cell)** | **743 / 284** (over 459) | **260 / 260 · FIT** |
| 844×390 | 743 / 302 (over 441) | 260 / 260 · FIT |
| 1280×800 | 1142 / 608 (over 534) | 540 / 540 · FIT |
| 1440×900 | 1144 / 640 (over 504) | 540 / 540 · FIT |
| `role="tablist"` in the card | **0** | **1** (4 tabs, 5 on the desk) |
| heading voices in the card | 4 dock / 3 desk | **1** — `Patrick Hand · 25.89 · 600 · lowercase` |
| group names that are document headings | 4 / 10 dock · 2 / 8 desk | **8 / 8 dock · 9 / 9 desk** |
| name ÷ chip (R1 ROW 3, floor 1.23) | 1.0175 dock · **1.1768 at 900×500** · 1.2945 desk | **1.2945 at every cell** |
| I2 worst group coverage (390×844) | **0.8892** chromium / **0.8894** webkit | **0.0000** both |
| I2 the bar carries chrome of its own | **false** | **true** (border-top 2.5, inside the case's drawn box) |
| undo · redo · hint on screen and hit-testable, sheet shut | 4/4 portrait · **0/3 at 900×500 and 844×390** | **3/3 at all five mobile cells** |
| board left edge x, 1280×800 | 129.89 chromium / 129.84 webkit | **129.89 / 129.89** |
| board left edge x, 1440×900 | 191 / 191 | **191 / 191** |
| card inline-size, 1280×800 | 324.22 chromium / **324.31** webkit | **324.22 / 324.22** (pinned) |

The desk kill-condition guard holds: |Δ board x| = **0.00px** chromium, **0.05px** webkit at 1280
and **0.00px** both at 1440, against the 0.5px the gate allows and the −26 to −205 every unpinned
arm walked in research. The pin also removes webkit's own 0.09px shrink-to-fit disagreement.

## 2 · The strip, measured (`probe/proto.probe.mjs` → `readings/fit.json`, `logs/fit.log`)

Every tray face-up, every cell, both engines: **FIT ×4 (×5 on the desk)**, `scrollHeight ≤
clientHeight`, and no ancestor scrolls either (`census.scrollers` is empty at every cell).

| cell | tab boxes (w×h) | seams | strip spend / strip |
|---|---|---|---|
| 390×844 | 103.61×44 · 79.88×44 · 95.13×44 · 83.39×44 | 4 · 4 · 4 | 374.01 / 374 |
| 375×812 | 99.5×44 · 76.42×44 · 91.25×44 · 79.83×44 | 4 | 359 / 359 |
| 430×932 | 113.61×44 · 89.88×44 · 105.13×44 · 93.39×44 | 4 | 414.01 / 414 |
| 900×500 | 231.11×44 · 207.38×44 · 222.63×44 · 210.89×44 | 4 | 884.01 / 884 |
| 1280×800 (vertical-rl) | 48×102.28 · 48×78.55 · 48×93.8 · 48×82.06 · 48×54.73 (`keys`) | 4 | 427.42 long in a 540 card |

- **≥44 in BOTH dimensions at every cell, both engines**, with the per-dimension negative control
  firing exactly once on each axis at **every** cell: `negH = 1`, `negW = 1` (20 cells). The W arm
  needed the flex terms forced as well as `width` — a bare `width: 40px` is absorbed by the tab's
  own `flex: 1 1 auto`, and a control that cannot fail is not a control (banked in the probe).
- **Roving tabindex, automatic activation**: `tabindex="0"` count is **1** at every cell; Right /
  Left / Home / End each MOVE and ACTIVATE, and focus follows selection in all five probes.
- **ariaSnapshot** (both engines, verbatim): `tablist "controls"` → four (five)
  `heading [level=2]` → `tab`, one `[selected]`.
- **Hidden trays: 9 tabbables, 0 focusable**, every cell, both engines — `el.focus()` is attempted
  on each and `document.activeElement` never lands.
- **The case stops changing height**: card-height spread across all four (five) tabs = **0.00px**
  at every cell. It is `visibility: hidden` on a shared grid cell, not a `min-height` floor — the
  floor levelled only the short trays (measured: `new game` still stood 33.72px proud at 1280).
- Type: `--type-name` computes **25.888px**, weight 600, `letter-spacing: normal`, Patrick Hand;
  the chip computes **20px at every width** (the 22px arm is gone). Ratio **1.2944**.

## 3 · One dimming, never two (`readings/fit.json` → `contrast`)

Painted bytes, canvas read-back over the word's own box; the double-dim is the negative control
(0.68 opacity forced onto the unraised tab's face).

| reading | chromium light | chromium dark | webkit light | webkit dark |
|---|---|---|---|---|
| unraised word, ground at opacity 1 | **5.16** | **5.96 / 6.41** | 14.49 | 11.87 |
| raised word (`--color-foreground`) | 19.45 | 15.84 | 19.45 | 15.84 |
| **negative control** — quiet rung on a 0.68 ground | **2.75** | 3.37 / 3.56 | 5.16 | 5.99 |

Chromium lands within 0.1 of the research's 5.24 / 6.01 and reproduces its 2.75 exactly. WebKit's
extreme-pixel reader runs hot because WebKit rasters a heavier stem, so the extreme pixel sits
nearer the undiluted ink: the INK ITSELF is identical in both engines, asked directly —
`color(srgb 0.15 0.15 0.15 / 0.68)` light, `color(srgb 0.82 0.812 0.78 / 0.68)` dark, on a
`rgb(253,253,252)` / `rgb(19,18,17)` face at `opacity: 1` (`probe/ink.probe.mjs`). One dimming
holds by construction, and the 4.5:1 row is green in every cell under either reader.

**The authored ring** (`probe/frames.probe.mjs`, A/B difference — the ring's colour is whatever
changed when the outline was added): **3.72:1 light · 4.66–4.68:1 dark**, chromium and webkit, at
390 and at 1280, against the 3:1 a focus indicator owes. The band's extreme pixel is NOT the ring
(the tab's own drawn stroke at `outset: 3` lives there); the difference read is. At HEAD the same
instrument found **no pixel changed at all** in webkit at six of seven cells — the default
indicator does not paint on those controls.

## 4 · The floor, the confirm, the tool home

- **The floor** (`.action-bar`): one row, six acts, no wrap. Boxes at 390: deal 52.72×68.39 ·
  clear/fill/solve/share 45.36×57.98 · peek 56.22×44, with the `dealt ⊪` receipt (83.63×30.39)
  riding beside the die. Every act hit-tests to itself at its own centre, **6/6 at every mobile
  cell, both engines** (`readings/reach.json`).
- **The confirm** (§15 — the geometry research owed this pass, `readings/ribbon.json`): armed, the
  guard takes the floor's row at 390 — floor row 68.39 → ribbon **48.78, one line**, `clear the
  board?` · `keep` **45.33×44** · `clear` **47.98×44** (0 fails), `role="group"` named by the
  question, the destructive face in `--color-red-ink`. `keep` returns the floor **and restores
  focus to the verb that armed it** (M19) — true in both engines.
- **I4 stays RED, and it is W1 §1.5's**: at 390 dark, both engines, `deal` armed / `clear` armed /
  **`fill` wrote 18 cells** / `solve` wrote 1 on one tap. Reported beside, never claimed.
- **One tool home**: `#fold-tools` is **0 in the DOM**; `undo · redo · hint` sit on the board's
  edge under one outline, 44×49.58 each, at **0 taps** on all five mobile cells. At 844×390 and
  900×500 that is 0 where HEAD had **no home at all** (measured 0/3 above). On the desk they stay
  hidden — `.play-controls` is `@media (pointer: coarse)` only, which is HEAD's own rule, unmoved.
- **The strip remembers**: `sessionStorage` holds `pencils` across a reload in both engines; with
  `sessionStorage` replaced by a thrower the card still renders four tabs and raises `new game`
  (`readings/desk-boxes-and-memory.json`, `reach.json`).
- **The seam** (`.drawer-case` top − wordmark bottom, sheet settled): HEAD 1.27 / 9.77 / 18.11 at
  390 / 375 / 430 (chromium); prototype **292.06 / 268.56 / 392.53** — the gate's 6.00px floor is
  cleared, and cleared for a structural reason (the card is 296px, so the sheet's top edge is
  nowhere near the wordmark). NOTE, because the research's figure was −2.73/−3.02: this tree's
  HEAD reads **+1.27**, not −2.73 — that number came off a different tree state and should not be
  re-quoted from here without re-deriving it.

## 5 · The two rows the idea itself reds (and they are the owner's question)

Both come from the same fact: three (four) trays are hidden at rest.

1. **`access.spec.ts` 2.1 — "the marks-mode Normal button is reachable"** fails, both engines. It
   is in the `pencils` tray, which is not face up. The row can be re-aimed (raise the tab, then
   census) — but the re-aim is exactly the reach cost §7 of the spec owns in writing.
2. **`access.spec.ts` 2.3 — "a join and a leave each move a live region"** times out, both
   engines: the invite button and the three live regions T9-W3 landed live in the `players` tray,
   and a `visibility: hidden` subtree does not announce. **A roster that only speaks when its own
   tab is face up is a real loss**, and it is the sharpest thing this prototype found. Cures worth
   pricing in pass 2: hoist the three live regions out of the tray (they are `sr-only` and cost no
   pixels), or keep the players panel present to AT while it is off-screen.

Beside them, `a11y.spec.ts` 3.4 ("a keyboard-shortcuts help names k, g, h, p and d") fails for the
same reason: the crib moved into the desk-only `keys` tray and is inert until that tab is raised.

## 6 · What the patch already re-aimed, what it broke, and what it owes

**Cured in-pass, each with its own measurement:**

- `access.spec.ts:341` — `toHaveCount(4)` re-aimed from `.play-controls button` to
  `.edge-tools button, .drawer-tab` (the three tools plus the tongue); 2.2 is **GREEN both
  engines** after the second cure below.
- **T7-W2 A2's cover rule, restored and widened.** Deleting `ribbonCovered` left `undo · redo ·
  hint` at **100% burial and still tabbable** under the risen sheet — `access.spec.ts` 2.2 caught
  it (5 rows, both engines). The predicate now travels with the berth: `mobileDock && !drawerInert`
  on `.play-controls`. Sheet shut, the tools are still 3/3 hit-testable.
- **`filterBudget.ts`** — the divider's four-pose row deleted, `FILTER_BUDGET_TOTAL` **5**, and the
  union re-cut **coarse 6673 → 5702** (both engines agree). `filter-census.spec.ts` is **12/12
  green** at the new allowlist; before the union moved it was 10/2 with exactly the predicted
  failure (`[coarse] union raster area 5702 vs budget 6673 ±134`). CAVEAT: read on the dev server
  (`PLAYWRIGHT_BASE_URL` suppresses the config's own build+preview) — the seal must re-derive it
  from the built dist.
- **`check-copy-register.mjs`** — the `candidates` ADMITTED row struck with the copy it excused
  (`what fits` renders now). Gate **exit 0**: 0 em dashes, 0 unadmitted, 1 admitted.
- **`check-font-coverage.mjs`** — `what fits` added to the row-caption corpus, and the strip's and
  the ribbon's strings declared with two new extractors (`tabWords`, `guardLines`) so the corpus is
  compared to the tree rather than asserted. Gate **exit 0**.
- The two `.action-bar` rule blocks merged into one (R6 `law-probe` R3 flips **RED → GREEN**: the
  bar declares its own edge; the probe was reading the first of two blocks).

**Owed, and not done here — each one reds a gate in the cure's commit:**

- **`e2e/zone-grammar.spec.ts` — 9 rows × 2 engines**, all written against the wells, the tapes,
  the eyebrows and a scrolling card. The spec's plan names this re-aim; this pass did not do it.
- **`src/games/shared/GameControlPanel.test.ts` — 23 unit rows** (of 810; the other 787 pass, 65
  of 66 files green). Every failure names a deleted surface: the fold's play tools, the four
  wells, the mobile heading row, the `i` fold, the peek chip's old sublabel.
- **R6 `law-probe` L1 and L3** are HEAD-pinned literals that must move with their cures: L1 asserts
  `total === 9` (reads 5) and L3 asserts `ADMITTED.length === 2` (reads 1). Neither is a broken
  law; both are a law's number the cure changed.
- `a11y.spec.ts` 3.4 and `access.spec.ts` 2.1 / 2.3 per §5.

**Guards that held:** `vue-tsc -b` exit 0 (three times, including after the cure); the hue census
is **byte-identical to `hue-census-HEAD.txt`** (42 rows); R6 L2/L4/L5/L6 GREEN; the masthead-to-board
relationship and the tongue's own tuck and berths untouched; the goldens' subject — the desk board's
left edge — within 0.05px at 1280 and 0.00px at 1440.

## 7 · Frames (all crops ≤ 150 KB; 288 KB for nine)

| frame | what it shows |
|---|---|
| `f1-strip-tray-floor-390x844-{chromium,webkit}-dark.png` | the strip, `pencils` raised with its bottom edge omitted and running into the tray, the floor as one drawn piece under a 2.5 rule |
| `f2-binding-cell-900x500-{chromium,webkit}-light.png` | the binding cell: strip + tray + floor inside 284px, `new game` face up, the board-edge tools on the right flank |
| `f3-desk-whole-1280x800-chromium-light.png` | the desk entire: flank tabs in vertical-rl, the rail pinned at 324.22, the board's left edge at 129.89 |
| `f3b-desk-rail-1280x800-{chromium,webkit}-light.png` | the rail close: five tabs (`keys` included) down the card's left flank |
| `f4-ribbon-floor-row-390x844-{chromium,webkit}-light.png` | the confirm in the floor's row: `clear the board?` · `keep` · `clear`, both verbs ≥44×44 |

**What the frames show that no number did.** At 900×500 the edge strip and the `controls` tongue
read as TWO objects on the same flank rather than the one law §14 claims — the tools sit at the
board's top-right, the tongue lower down, and the risen sheet clips the strip's foot. And while a
verb is armed the card **shrinks 296.42 → 276.81px** (the guard row is 48.78 where the floor row
was 68.39), so the confirm moves the case under the thumb. Both are pass-2 work, and the numbers
said nothing about either.

## 8 · Files

| path | what it is |
|---|---|
| `proto/ctrl-tabs-proto.diffstat.txt` | the patch's shape; the patch itself is the worktree's uncommitted diff |
| `probe/proto.probe.mjs` → `readings/fit.json` | the strip, the trays, the floor, the tap floors + per-dimension controls, the hidden-tray census, painted contrast, ariaSnapshot, the keyboard contract |
| `probe/ab.probe.mjs` → `readings/paired-{head,proto}.json` | the paired read, one instrument, seven cells × two engines |
| `probe/ribbon.probe.mjs` → `readings/ribbon.json` | §15's geometry (the research's `guard-face.json` came back null) + I4 re-aimed at the floor |
| `probe/reach.probe.mjs` → `readings/reach.json` | zero-tap tools, the floor's hit test, the strip's memory with and without storage |
| `probe/frames.probe.mjs` / `frames2.probe.mjs` | the crops + the ring's A/B difference read |
| `probe/heading-voice-ext.spec.ts` | r0's R1 instrument with its selector set re-aimed at `.tab-word` + `.zone-row-label`, and the 900×500 cell added |
| `logs/*.txt` | vitest tail, the e2e runs, filter-census green, heading-voice, the law probe |

Re-run: `npx vite --host 127.0.0.1 --port 4238 --strictPort` from `web/frontend` in the worktree,
then `node .scratch-w7/<name>.probe.mjs`; specs with
`PLAYWRIGHT_BASE_URL=http://127.0.0.1:4238 npx playwright test --config=.scratch-w7/e2e.config.ts`.
