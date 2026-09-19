# CTRL-TABS · pass 2 (PROTOTYPE) — the join is geometry, and the AA failure is cured

Section §10 (§1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13
Prototyper: Opus 5. Spec: `../../synthesize/CTRL-TABS.md`. Chair: `../../CHAIR-RULINGS.md`.
Nothing closes here (U-10).

    TREE       worktree `.claude/worktrees/wf_8630d340-e56-35`, branch
               `worktree-wf_8630d340-e56-35`, cut from `a8fee1f5`. UNCOMMITTED by instruction.
    REPLAY     pass 1's `wf_e58b4764-0fc-39` carried in whole. `git -C <p1>` and `cd <p1> && git`
               are both REFUSED by this session's worktree isolation, so the diff was replayed
               file-by-file off a `diff -rq` of the two trees — the same ten files, byte for
               byte, plus `.scratch-w7/` (the pass-1 probes). Nothing conflicted: HEAD moved
               docs-only. `vue-tsc --noEmit -p tsconfig.json` GREEN on the replay and again at
               the end.
    SERVER     `npx vite --config .scratch-w7/vite.scratch.mts --host 127.0.0.1 --port 4232
               --strictPort` (private `cacheDir`), preview of the built dist on 4235. Both
               killed.
    ENGINES    playwright chromium + webkit, headless, own scripts, own scratch configs. No
               Safari, no osascript. M19 clean.
    SETTLE     950 ms after every sheet tap — the sheet SLIDES.
    VERDICT    IT RUNS. The BLOCKING CONDITION IS CLEARED on the real surface at the spec's own
               numbers in both engines and both themes. The join is one open path meeting
               another at 0.00px. The hoisted voice reads 1 with the tray down. Three gates do
               NOT green and each is named below with its number.

---

## 1 · The blocking condition, cured and measured (`readings/guard.json`)

Armed through the product's own predicate (a digit typed into an empty cell, then `clear`),
390×844, both engines, both themes:

| row | light | dark | spec asked |
|---|---|---|---|
| `clear` (destructive word) on its ground | **4.99** | **6.30** | 4.99 / 6.30 |
| that ground against the card | **1.00** | **1.00** | bare |
| `keep` on the card | **19.45** | **15.84** | 19.41 / 15.84 |
| greyscale gap between the two WORDS | **3.90** | **2.51** | 3.90 / 2.51 |
| `keep` carries a drawn box | **false** | **false** | bare |
| `clear` carries a drawn box | **true** | **true** | boxed at 2.5 |
| target boxes | 45.33×44 `keep` · 47.98×44 `clear` | same | ≥44 both dimensions |
| focus on arm | **on `keep`** | **on `keep`** | CTRL-COST's law |
| Escape | **disarms** (0 guard rows) | same | conditional stop |

Both files in one commit: `GameControlPanel.vue`'s 8% face and `GameGallery.vue`'s are deleted
together, and the gallery's `keep` goes bare with the card's. One confirm, two files.

## 2 · The join is geometry (`readings/geometry.json`)

`HandDrawnOutline` gained `omit` / `gap` / `gapSide`; `gridPaths.ts` gained `RectCuts` and an
`openRing` that re-assembles the four wobbled sides into ONE open polyline around the cut.

| row | 390×844 | 1280×800 | engines |
|---|---|---|---|
| `.tab.is-raised::after` computed `content` | **none** | **none** | both |
| the raised tab's path is CLOSED (ends `Z`) | **false** | **false** | both |
| the case's lid path is CLOSED | **false** | **false** | both |
| tab's open foot vs the lid's line | **0.00px** | — | both |
| flank tab's open foot vs the lid's line | — | **0.00px** | both |
| `url(#` inside `.tray[inert]` | **0** | **0** | both |
| hidden trays, and their `visibility` | 3 · all `hidden` | 4 · all `hidden` | both |

The seam is arithmetic, not a tuning: the tab's path ends `outset` (3) past its border box and
the lid begins `outset` (3) before its own, so 6px of flow between them is what makes the feet
land on the line — `margin-bottom: 6px` on the phone strip, `padding-left: 3rem + 6px` on the
desk's lane (inside a PINNED rail, so the tray's column pays it and the board does not move).

## 3 · The live regions, split and hoisted (`readings/regions.json`)

| row | pass-1 tree | this tree | engines |
|---|---|---|---|
| `getByRole('log')` with the players tray DOWN | 0 | **1** | both |
| live regions inside any `.tray` | 3 | **0** | both |
| `.roster-voice` / `.roster-status` at the panel root | 0 / 0 | **1 / 1** | both |
| all three root regions born empty | — | **yes** | both |
| the invite button in the players tray, raised | 1 | **1** | both |

`access.spec.ts` 2.3 carries both halves in the same diff: it raises the `players` tab to press
the invite verb (the re-aim) and then LOWERS it before the joiner arrives and asserts the
announcement anyway (the product half).

## 4 · The gates, one line each

GREEN: no scroll at the six cells (390×844 304/304 · 375×812 304/304 · 430×932 268/268 ·
900×500 268/268 · 844×390 268/268 · 1280×800 545/545, both engines, HEAD 699/628) ·
`role="tablist"` = 1 · R1 ROW 1 voices **1** · ROW 2 headings **8/8** dock **9/9** desk · ROW 3
ratio **1.2945** at every cell (floor 1.23) · tab targets ≥44 both dimensions with the
per-dimension control firing · undo/redo/hint 3/3 hit-testable at all five mobile cells
(HEAD 0/3 at 844×390 and 900×500) · I2 worst coverage **0.0000**, the bar carries its own
chrome · the raised edge has zero `::after` · `url(#` in `.tray[inert]` = 0 · `getByRole('log')`
= 1 tray down · the guard's word 4.99 light on bare card with the box as the non-colour channel ·
ring **3.72:1** on every control (WebKit's UA default read 2.15) · desk board x **129.89** at
1280 and **191** at 1440, both engines (|Δ| 0.00 chromium, 0.05 webkit against HEAD) · card
inline-size pinned 324.22 / 330 · filter census **12/12 off the BUILT DIST**, total **5**, union
coarse **5702** · goldens **4/4** byte-identical · hue census **30 rows byte-identical to r0's
HEAD reading** · `check-copy-register` exit 0, 0 dashes, 0 unadmitted · `check-font-coverage`
exit 0 with `keep`/`peek` now DERIVED from `BARE_WORD` · `vue-tsc` exit 0.

RED, and each is reported rather than claimed:

1. **The short-end law's two literals move by the card's own +8.** The law's SHAPE is confirmed
   exactly — `clientHeight = vh − 216` at 360×560 and 360×500, measured. What the spec derived
   from 296 of content this tree derives from **304**: it fits at **vh ≥ 520** (spec said 512)
   and overflows **20** at 360×500 (spec said 12 ± 1). The +8 is this family's, declared: 6px is
   the geometric seam §2.1 now needs, 2px is `deal`'s word rising to `--type-act`. Separately,
   the spec's own arithmetic does not close — it names the law as `vh − 234` and then derives
   512 and 12 from `vh − 216`. The measured law is 216.
2. **The seam at 844×390 is −86.85 / −87.30**, against a gate of ≥8. It is red at HEAD
   (−120.90) and was red in pass 1 (−78.85): the landscape sheet rises over the wordmark at
   every arm. This tree improves it 34px against HEAD and worsens it 8px against pass 1 — the
   same +8 card height, since the sheet is anchored to the bottom and grows upward. The seam at
   390 / 375 / 430 is 304.06 / 280.56 / 404.53 (green).
3. **I4 (fill/solve arming) stays RED.** W1 §1.5 owns the predicate; `fill` and `solve` still act
   on the first press. Not claimed.

## 5 · The instruments that MOVED (chair §6.9 / §7)

`instruments/law-probe-L1-L3-L5.moved.mjs` — the research record's L1′/L3′ plus **L5′, which
this prototype adds**: r0's L5 reads `class="guard-btn guard-keep"` within 400 chars of
`HandDrawnOutline`, and §15's cure deliberately unboxes that verb, so the row reds on a tree that
KEEPS the law and greens on one that grounds both verbs in a colour nobody can see. L5′ reads the
estate's two confirms instead: destructive boxed, safe bare, and no `.guard-*` rule declaring a
CSS border that paints. **3 GREEN / 0 RED** on this tree; the firing control (a `border: 2px
solid red` on `.guard-btn`, applied and reverted) REDS it. r0's own probe run against this tree
is banked beside it: L1 / L3 / L5 red as the three moved rows, R3 born-RED → **GREEN**.

`instruments/hue-census.copy.mjs` and `law-probe.copy.mjs` are r0's, copied and re-pointed at
this worktree before running. Nothing under `r0/` or `pass1/` was written.

## 6 · The estate's specs, re-aimed in this diff

31 unit rows red on the replay → **10**. Re-aimed here, each in the diff that moved its subject:
the two mount helpers' teleport berth (`#fold-tools` → `#board-edge-tools`, 13 rows, including
all 8 live-region rows), `shareBtn`'s positional address → `data-verb="share"` (5 rows — `peek`
now follows share on that floor, so the copy-act rows had silently started reading the peek
chip), the peek chip's home (`inFold` → the floor), and the hold-to-peek surface
(`.peek-hold-surface` → `.peek-chip`, the divider being deleted). `access.spec.ts` 2.1 and 2.3
raise the compartment they address. **access 12/12 GREEN both engines.**

THE 10 THAT REMAIN are pass 1's structural inheritance, not re-aimable by a selector: four
`.tray-well` groups named by four tapes, the six-eyebrows-become-two rows, the four hint tapes,
the `i` and its crib fold. All four subjects are deliberately gone (trays named by tabs; the crib
is the `keys` tray). They are a rewrite of those assertions into the tab grammar and they are
owed by the cure's own commit. Named, not hidden.

## 7 · Deviations from the spec, stated

- **Graft 3 (the share word's 1×1 grid) NOT built.** Its purpose was to keep the visible outcome
  the five copy-act rows read; those rows read it today, and a 1×1 grid holding both strings
  would make the node's `text()` read `Sharecopied!` — breaking the thing it was meant to
  protect. The reflow it also prevents is real and unmeasured; a pass-3 row.
- **`MOTION.confirmWindowMs: 2500` named but not spent.** Pass 1's "no timer" ruling is kept (a
  question that erases itself is one a reader can lose a race with); the constant is there for
  `useTwoTap`'s window when W1 §1.5 lands. `outcomeHoldMs: 1600` IS spent — it is the site's own
  shipped literal, hoisted and named.
- **`peek` is now coarse-only**, per §2.3. Pass 1 drew it at every width; the desk floor was
  paying a sixth target for a gesture that surface cannot make.
- **The `(i)` in §2.3's desk ASCII is not built** — §2.2 retires the `i` glyph to the `keys`
  tray, and the two cannot both be true. Row 2 is `clear · fill · solve · share`.
- **The sheet-shut case is a residual, and it is not this family's to cure.** With the sheet
  down the WHOLE card is out of the a11y tree (`getByRole('log')` = 0), so the hoisted voice is
  silent there too — as `.copy-status` already is at HEAD. Curing it needs a berth outside the
  sheet, which is W2's surface. Reported, not claimed.

## 8 · The two W2 ballots, asked not taken

1. **The rail pin** — built and proven: card inline-size 324.22 / 330 pinned, board x |Δ| 0.00
   chromium / 0.05 webkit, goldens 4/4 byte-identical. Cost attached: the desk floor's two rows
   (`deal · dealt` at y 529, the four verbs at y 602, 1280×800).
2. **Retiring `#fold-tools` and the sticky tag** — taken in the prototype (pass 1 took it), so
   every mobile number above is measured with it gone. If W2 declines, §2.6's fallback holds and
   the strip's acts duplicate the fold's.

## 9 · The board's declared move

| cell | HEAD | pass 1 | this tree |
|---|---|---|---|
| 390×844 chromium | 219.73 | 260.52 | **240.52** |
| 390×844 webkit | 219.42 | 260.20 | **240.20** |
| 375×812 chromium | 211.23 | 252.02 | **232.02** |
| 375×812 webkit | 210.92 | 251.72 | **231.72** |

The 40px in-flow berth (`--edge-strip-h`, = 48 − 8 tuck, portrait coarse only) gives back
**exactly −20.00** from pass 1 at both cells in both engines. Against HEAD the board stands
**+20.79 / +20.80** — the 0.78–0.80 is the residual pass 1's undeclared 40.78 already carried.
The portrait goldens crop the board, not the page, and are unmoved (4/4). Frame `f4`.

---

NOTE. Four PNGs sit at this directory's top level (`f1-join-390-dark.png` and siblings,
03:57) from the pass-2 prototype batch that died in the stall storm. They are the same four
poses shot from an earlier arm of this lane and are SUPERSEDED by `frames/` above. Left in
place rather than deleted: they are another run's record, not this one's to remove.
