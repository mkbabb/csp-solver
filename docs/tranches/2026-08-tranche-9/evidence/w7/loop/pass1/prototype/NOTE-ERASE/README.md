# NOTE-ERASE · THE ERASER — pass-1 PROTOTYPE, run on the real surface

The spec (`../../synthesize/NOTE-ERASE.md`) plan steps 1–5 built and measured. It RUNS: a dev
server on the prototype worktree's own tree, chromium + webkit, 390×844 (DPR 1 and 3) and
1280×800, light and dark, PRM off and on.

- worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-53`, branch `worktree-wf_e58b4764-0fc-53`, off `aab67b92`. NOT committed.
- dev server `npx vite --host 127.0.0.1 --port 4249 --strictPort`; scratch playwright config `probe/pw.config.ts` (baseURL only, no webServer).
- diff: 5 product files, +240/−35 (`proto/note-erase.diff`), plus one new unit suite
  (`proto/useGameState.authorship.test.ts`, 6 rows, 3 of them born-RED at HEAD by measurement).

| file | what landed |
|---|---|
| `pencilConfig.ts` | `MOTION.note` in beats (2 / 1 / 8 / 4 / 24), the 250ms literal brought home |
| `index.css` | `@keyframes ink-rub-out` + `ink-rub-out-fade`; `--ease-accelIn`'s sixth consumer named |
| `MarginNote.vue` | `<Transition name="note" mode="out-in">`, write-in → `.note-enter-active`, `.note-leave-active` (rub-out, `transition: none`), the settle timer + `data-note-age`, the three `--note-*-ms` v-bound |
| `GameBoard.vue` | `setMargin`'s repeat clause (the board's own `announce()` idiom); the refusal's `refusalHoldBeats` timer, re-armed per refusal, cleared by every writer |
| `useGameState.ts` | the authorship seam as banked: `WriteOrigin` on BOTH `applyCellValue` and `applyHintInk`, `"peer"` at the one call site that knows |

## The gates, measured under the build

| gate | HEAD | measured now | verdict |
|---|---|---|---|
| G1 the exit exists | RED (removed same-frame) | leave = `ink-rub-out, ink-rub-out-fade` `0.125s, 0.125s` on `cubic-bezier(0.55,0.055,0.675,0.19)`; span absent 122ms (chromium) / 134ms (webkit) after the first leaving frame = the verb plus one frame; never reappears | GREEN |
| G2 the settle | RED (14.52 / 12.25) | settled painted **5.17 light / 6.07 dark**, DPR 1 AND DPR 3, colour `srgb 0.15 0.15 0.15 / 0.68` light and `0.82 0.812 0.78 / 0.68` dark; the attribute lands 1005ms (light) / 1008ms (dark) after the text | GREEN |
| G3 verdicts never settle | GREEN by construction | red `age=null`, painted **4.87 / 6.44**; gold `age=null` at 8 beats and after the crest, `rgb(140,105,29)` / `rgb(229,199,77)` (full pressure), painted 12.46 dark | GREEN |
| G4 the peer rows | RED / green-wrong / green-wrong / RED / RED | on `?wire=local`, delivery proven per row: join stands · peer elsewhere STANDS · peer at `hint.cell` rubbed out · peer at a `becauseCells` member rubbed out (webkit: named 19, peer wrote 21) · peer REVEAL at `hint.cell` rubbed out · refusal untouched | GREEN both engines |
| G5 the refusal leaves | RED (stands at 30s) | present at 23 beats, `.note-leave-active` at 24.5, absent at 25.5 beats (3213ms chromium / 3201ms webkit); a second refusal at beat 12 keeps it at 30 and 35 and takes it at 38 | GREEN, gate wording corrected (below) |
| G6 the repeat speaks | RED (0 / 0) | 4 live-region mutations and 1 `animationstart` (`ink-write-in`) — the repeat SPEAKS, but the old line is not rubbed out (below) | GREEN on the mutation count, mechanism differs |
| G7 PRM immortality | GREEN | under PRM `animationName: none`, `animation-duration 0s`, span gone ~16ms after the retraction, both engines, both viewports; no `animationend` anywhere in the removal path | GREEN |
| G8 no fill, no filter | GREEN guard | `FILL_ALLOWLIST` source census exact (1 row, unchanged); live filter census 9 exact at 4×4 / 9×9 / 16×16, chromium AND webkit; `filter: none` / `transform: none` on the span and every ancestor across the whole verb (`dirtyAncestors: []`, 8 cells) | GREEN |
| G9 a note cannot outlive its board | GREEN | `g` then cancel = same sentence, same box (both engines); deal → `""` (R3-g census, both engines) | GREEN |

## The censuses (π on what the family does not claim)

| instrument | HEAD | now |
|---|---|---|
| R3-d hint note (10 acts) | banked | 10/10 reproduce, presence for presence; the 30s row still stands (it settles, and the census reads opacity, which does not move) |
| R3-g board-changing acts (5) | banked | 5/5 reproduce both engines (second H → `""`, deal → `""`, clear → "the board is clear", fill → `""`, solve → "solved it!") |
| wobble σ | grid 1.443 / frame 1.145 / ring 0.092 / wash 0 | **identical to three decimals**, band 0.722–2.886 identical |
| filter budget | 9 / 9 / 9 | 9 / 9 / 9, both engines |
| hue census | 32 tokens | 32 tokens, **zero value diffs, zero new chromatic tokens**, `kin-arithmetic.json` byte-identical; per-pixel bins differ by the deal, not by a token |
| heading voice (control) | one voice 25.89/600/lowercase, 4 doc headings, option 20px | unmoved |
| `npm run lint:ink` | 3 rungs | unchanged: rule 3.53/4.36/4.76, quiet 5.23/6.06/7.86, 6 pinned surfaces |
| `check-copy-register` / `check-font-coverage` | — | 0 dashes, 0 unadmitted; Patrick Hand 46 codepoints / 4312 B, unmoved |
| rects (π) | — | board, controls and `scrollHeight` deltas **0** at 390 and 1280, both engines, across empty → fresh → settled → mid rub-out. Only the strip's own width moves (2.81px at 1280) with its own sentence |
| vue-tsc · units · eslint · prettier | — | 0 errors · 816/816 in 67 files (was 810/810 in 66) · clean · clean |

## Frames

`frames/settled-390-light.png`, `frames/settled-390-dark.png` — the settled hint, 390×844, chromium.
`frames/rubout-62ms-390-chromium.png` — the verb at t=62ms: `inset(0 14.248% 0 0)`, opacity 0.858, the line shorter from its END.
`frames/replace-200ms-1280-chromium.png` — 75ms into the replacement's write-in: `inset(0 16.78% 0 0)`.
The two verb frames are the build's own keyframes held at an exact offset (`animation-delay: -62ms; animation-play-state: paused`) — Vue removes the node at the computed duration, so no wall-clock screenshot can catch 62ms of a 125ms verb. The live verb's passage through those poses is the frame trace (`readings/p1-exit-*.json`).

## GAPS — every one, stated

1. **G5's wording is wrong by one beat.** The hold ENDS the note by rubbing it out, so absence lands at `refusalHoldBeats + rubOutBeats + 1 frame` (25.5 beats measured), never at "24 beats + 1 frame". The first cut of the probe read at 24.1 beats, caught the leaving span and reported RED; the corrected train is `readings/p4b-refusal-*.json`.
2. **The same-sentence repeat does not rub out.** `:key="text"` is identical across the empty-then-write, both ref changes land in one frame, and Vue re-uses the element (the leave is cancelled) — timeline in `readings/p9-repeat-*.json`: no leave class ever appears, `ink-write-in` starts once, 4 mutations. The repeat SPEAKS (G6's own criterion), but §4's "under out-in that is a rub-out and a fresh write-in" is half true. Cure if the rub-out is wanted: key the span on a write sequence, not on the string.
3. **Webkit traces 8 distinct clip states at 125ms**, under the brief's ≥9 (chromium 15–16, over its ≥12). The 9 came from the research overlay's 180ms. At one beat on a 60Hz raster, 8 frames is what a 125ms verb has; the bar is the frame rate's, not the design's.
4. **`.margin-note-meta` keeps its own `250ms` literal** and its own `ink-write-in`. The plan killed the ink span's literal only, so R6 law 4 is still broken once inside this very file.
5. **Painted bytes were read with `animations: "disabled"`**, which fast-forwards the 500ms colour step; the in-flight colour comes from computed style instead. The "8 beats + 1 frame" painted figure is therefore the settle's END pose. The steady-state numbers (5.17 / 6.07) are the gate's.
6. **The distinct because-member row landed on webkit only.** Chromium's deal gave a naked single, where the single `is-because` cell IS `hint.cell`, so that engine's row collapsed onto the named-cell row. The distinct case is proven at the unit level on both (`peerWrite(42)` with `becauseCells [40,41,42]`).
7. **G9's deal half comes from the R3-g census at 1280**, not from P6: my P6 sub-row ran at 390 where Deal sits in the closed drawer, and the click was swallowed. Probe defect, no product claim.
8. **The goldens were not run** (4/4 unmoved is unverified). They need a built dist and the wasm build; no golden frame contains the margin note (cell, grid-corner, logo, toggle-crest), and the index.css change is two added keyframes plus a comment.
9. **G3.2's LIVE half (built dist) was not run** — only the source census (`FILL_ALLOWLIST` exact). The live filter count is covered by the budget probe against the dev server: 9 exact, both engines, three sizes.
10. **No device.** M19 forbids the Safari rig from this lane; everything here is headless chromium + webkit.
11. **Lane hazard:** `r0/r2-accent-family/probe/hue-census.probe.ts` banks to an ABSOLUTE r0 path. Re-running it overwrote three r0 census files; they were restored byte-identical from `HEAD` (verified by diff). The next lane should copy it with `OUT` re-pointed before running it.
12. `refusalHoldBeats` 24 remains the ballot's low end (band 24–40, U-10). Nothing here closes it.
