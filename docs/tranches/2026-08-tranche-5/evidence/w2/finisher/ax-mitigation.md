# T5-W2 FINISHER — THE AX-TREE MITIGATION RECORD

**Lane** Opus (finisher, lane B), under the Fable team lead · **date** 2026-08-01
**Tree** `ff5a7cea` · **PRE recovered at** `f087a90d` · **capture log** `capture-log.txt`
**Instrument** `instrument/` · **raw captures + diffs** `capture/`

---

## 1 · THE OBLIGATION AS CHARGED

`evidence/w2/wave-open.md` §3, verbatim:

> **AX baseline.** The DAG puts W3 after W2, so no W3 floor exists to hold. W2 therefore captures
> the **AX-tree PRE-state at open as its own regression baseline** and asserts it unchanged at
> exit — the board's accessibility tree, the picker's options, the grid labels and roving
> tabindex. W2 does not *improve* a11y; it must not silently cost any.

Two acts, both binding: **capture at open**, **assert at exit**.

## 2 · THE MISS

**The obligation was missed. Neither act was performed.** No lane captured an AX PRE-state at
open, and no lane asserted one at exit. VERIFY caught it at the seal
(`evidence/w2/verify/wave-record-draft.md` §5, "Charter obligations VERIFY finds unclaimed"):

> **The AX baseline (§3).** The charter requires W2 to capture the **AX-tree PRE-state at open as
> its own regression baseline** and assert it unchanged at exit. **No lane banked one**, and none
> asserted it at exit. The obligation is open; it cannot be reconstructed after the fact from this
> tree, because the PRE-state is gone.

**Which lane.** None, and that's the defect. The charter put the obligation on *the wave* and
named no owning lane — every other §3 row lands on a numbered move (2.1–2.8) with a named probe,
this one on nobody. F1 is where it should have gone: it opened at `f087a90d` and banked the only
at-open baseline in the wave, `evidence/w2/f1/00-before.txt` — build, 4/4 goldens, 332 tests, 23
boundary errors, per-game file counts. No AX row in it. F2×4, F3, F4 and F5 each opened against an
already-moving tree, so none of them *could* have taken it. The one lane positioned to discharge it
didn't know it was theirs.

Downstream, F2-futoshiki cited the clause correctly while working
(`f2-futoshiki/30-slot-census.md:105` — "wave-open §3 holds W2 to the AX-tree PRE-state") and still
banked no figures. The clause was read; it was never executed.

**Class.** An obligation written into a charter without an owning lane and without an enforcing
gate row. `gates.json`'s W2 matrix has no AX row, so nothing failed when nothing was captured. This
is the lessons-file's *ruling lands with its enforcing config same-commit* rule, missed.

## 3 · THE SUBSTITUTE, AND WHY IT WASN'T NEEDED

The lead adjudicated a substitute instrument: the T5 R1 audit's banked figures
(`evidence/audit/r1/a11y.md`, re-probed adversarially in `evidence/audit/r2/verify-gate-criticals.md`
§5), which hold live AX censuses taken at `71456713` — before the wave opened.

That substitute is weaker than the charter's instrument on four counts, and they're worth recording
because §5 below still leans on one of them:

1. **Wrong tree.** `71456713` is not the wave-open tree. W1 and W6 both landed between it and
   `f087a90d`, so an r1↔HEAD difference isn't attributable to W2.
2. **One game of five, live.** r1 §C: "Killer, KenKen and Thermo boards were read statically only."
   The other four rest on a structural inference (all five render `GameBoard`).
3. **The instrument is gone.** r1's probes were "scratchpad, disposable" — `probe.mjs`…`probe5.mjs`,
   `contrast.mjs`, and r2's `r2probe.mjs`/`r2probe2.mjs`. Its DOM censuses can't be reproduced
   because their bucketing rules aren't recoverable.
4. **Unstated UI state.** r1's tab-order walk saw "Deal a new board", a rail control that's `inert`
   while the drawer is closed — so that walk ran with the drawer open. Nothing records it.

**The substitute wasn't needed.** The PRE-state is not unrecoverable. VERIFY's "it cannot be
reconstructed after the fact from this tree" is true of the *working tree* and false of the
repository: `git archive f087a90d | tar -x` extracts the pre-distill tree read-only, it builds, and
the identical instrument runs against both artifacts. That's the charter's own instrument, executed
late — not a proxy for it.

The reconstruction was verified to be the real pre-distill estate, not an accident: its build emits
`SudokuGame`, `FutoshikiGame`, `ThermoGame`, `KillerGame` and `KenKenGame` chunks — the five scenes
`GameShell` replaced — and the POST build emits none of them. Dist manifests differ
(`a032bcbe…` vs `c08193a4…`).

**What the reconstruction still can't attest.** It's a rebuild, not a capture at open, so it can
only speak to what git holds. `node_modules` is the current tree's, symlinked; the two lockfiles
were not compared, so a dependency that moved inside W2's window would ride into the PRE build
invisibly. Chromium/darwin only — Safari and Firefox map bare `<svg>`, `inert` and `alertdialog`
differently, and r1 already booked H3 as UNKNOWN under VoiceOver. No live screen-reader transcript.
This is evidence about the AX tree, not about speech.

## 4 · THE DIFF

Instrument: served dist, playwright 1.61.1 chromium, CDP `Accessibility.getFullAXTree` — r1/r2's
semantics. **43 rows per game × 5 games = 215 comparisons.** Full transcripts in `capture/`.

Proven non-vacuous before being believed (`capture/ax-diff-CANARY.txt`): three AX regressions
injected into the PRE capture — sudoku `gridcell` 81→80, futoshiki's grid label stripped of its
family, kenken's gallery `option` 1→5 — **3 injected, 3 caught**.

Row classification is measured, not assumed (`capture/ax-stability.txt`): the same tree probed
twice moved `image`, `StaticText`, `InlineTextBox` and the glyph census when kenken dealt a
different board, and moved nothing else. Those four are deal-variant and carry no signal; every
structural row held run-to-run, which is what makes a zero meaningful.

### PRE `f087a90d` → POST `ff5a7cea`

| game | grid | row | rowgroup | gridcell | cell | textbox | heading | tooltip | separator | main | grid label | Δ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| sudoku | 1 | 0 | 0 | 81 | 0 | 81 | 3 | 5 | 1 | 1 | `9 by 9 sudoku board, easy` | **0** |
| futoshiki | 1 | 0 | 0 | 25 | 0 | 25 | 3 | 5 | 1 | 1 | `5 by 5 futoshiki board` | **0** |
| thermo | 1 | 0 | 0 | 81 | 0 | 81 | 3 | 5 | 1 | 1 | `9 by 9 thermo board, easy` | **0** |
| killer | 1 | 0 | 0 | 81 | 0 | 81 | 3 | 5 | 1 | 1 | `9 by 9 killer board, easy` | **0** |
| kenken | 1 | 0 | 0 | 16 | 0 | 16 | 3 | 5 | 1 | 1 | `4 by 4 kenken board` | **0** |

Every figure identical on both trees. The rest of the 43 rows, likewise identical per game:

| row | PRE = POST | note |
|---|---|---|
| full AX role census | 19 roles, e.g. sudoku `generic:182 button:23 group:5 status:2 progressbar:1 term:5 definition:5` | byte-identical |
| `gridChildRoles` / count | `["gridcell"]` / N² | r2's stronger assertion — the grid's own AX childIds |
| `domRowRoles` | 0 | |
| `aria-rowcount`/`colcount` | 9/9, 5/5, 4/4 | |
| landmarks | `["main"]` | |
| gallery `listbox` / `option` (AX) | 1 / 1 | the inert flank, unchanged |
| gallery options (DOM / inert) | 5 / 4 | |
| gallery option name | `"<game>, N of 5"` | all five |
| duplicate ids · dangling IDREFs | `[]` · `[]` | |
| bare-SVG census | identical per game | |
| page errors | 0 | |

**Roving tabindex** (charter §3 names it explicitly), sudoku, keyboard-walk instrument —
`capture/ax-pre-taborder.json`, `capture/ax-post-taborder.json`:

| | PRE | POST |
|---|---|---|
| real tab stops (Tab until cycle) | 20 | 20 |
| cell inputs | 81 | 81 |
| cell input tabindex | `{0: 1, -1: 80}` | `{0: 1, -1: 80}` |
| focusable outside `<main>` | `["Show attribution card","@mbabb","View project on GitHub 🎉","Switch to dark mode"]` | identical |

**Verdict: 0 invariant deltas across 215 comparisons. W2 cost no accessibility.**

## 5 · THREE r1 FIGURES THAT DON'T REPRODUCE — W3's, not W2's

Recorded verbatim, not explained away. These are r1↔HEAD gaps, and W2 is **excluded** as their
cause because each figure is identical at PRE and POST under one instrument:

| figure | r1 at `71456713` | here, PRE `f087a90d` | here, POST `ff5a7cea` |
|---|---|---|---|
| tab stops | 25 | 20 | 20 |
| focusable outside `<main>` | 2 — `["Show attribution card","Switch to dark mode"]` | 4 (adds `@mbabb`, `View project on GitHub 🎉`) | 4, identical |
| glyph-svg on a dealt 9×9 | 62 | 61 | 61 |

Two candidate causes, and this lane does **not** adjudicate between them: r1's instrument (gone —
its walk ran with the drawer open, and a buttons-only selector would miss the two anchors, which
are `<a href>`), or something that landed between `71456713` and `f087a90d` (W1, W6). What's
settled is that W2 didn't move them.

**This matters to W3**, whose rows cite r1's numbers: L12's dead tab stop, L13's two orphans
outside every landmark, L15's "~20 of the page's 25 tab stops". W3 should re-derive against HEAD
before pricing those three, and prefer a keyboard walk to a selector census — `instrument/axprobe2.mjs`
does it and is banked.

## 6 · DISPOSITION

- **The obligation was missed** — capture and assertion both, by a charter clause with no owning
  lane and no `gates.json` row to fail. Books as a W2 process defect regardless of §4's result.
- **W2's AX-neutrality is EVIDENCED, by the charter's own instrument.** Not by the audit-bank
  substitute the lead adjudicated — that was the fallback, and §3 records why it was inferior. The
  PRE was recovered read-only, both trees were probed with one script, the differ was proven
  non-vacuous by ablation, and the invariant row set was fixed by a stability run. 215 comparisons,
  0 deltas, five games. The claim's strength is bounded by §3's last paragraph: chromium/darwin,
  no lockfile comparison, no screen-reader transcript.
- **FOR W3.** Every r1 a11y finding survives the distill intact — §4 is exactly the statement that
  nothing was cured either. H1 is still live and still red on all five boards
  (`grid:1, row:0, rowgroup:0, gridcell:N²`, grid childIds resolving to `gridcell` only, DOM
  `[role=row]` count 0). W3's rows are unaffected in substance, and one thing got cheaper: five
  boards are one `BoardHost`/`DigitCell` now, so the row-layer cure lands once instead of five
  times. Three r1 figures need re-deriving first — §5.
- **FOR THE LEAD.** If the AX baseline should bind future waves, it needs a `gates.json` row and a
  named lane, or it will be missed again the same way. The instrument to enforce it is banked and
  runs in about a minute per tree.

ROW-COMPLETE
