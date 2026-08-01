# LANE B — MEASURE-REQUESTS (for the MEASURE stage, real Safari / `perf-rig-iphone16`)

Build: Lane B worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_6e1b18f4-0f2-2`,
`web/frontend` → `npm run build`, serve `dist`. Lane B has run headless chromium + webkit; what
follows is only what a headless engine cannot answer. Baseline for every before/after row: the
same tree with the four source files at `git stash`ed HEAD (`vite build --outDir dist-base`).

## Poses to capture

| # | URL | viewport / device | what to capture |
|---|---|---|---|
| M1 | `/?size=3&difficulty=EASY` | iPhone 16 sim, portrait, real Safari | full-page screenshot scrolled to the control card; **before + after** |
| M2 | `/?game=futoshiki&size=5&difficulty=EASY` | same | same — the 4-option ticket row |
| M3 | `/?size=4&difficulty=HARD` | same | the 16×16 board; the ticket must not wrap the `4×4 9×9 16×16` row |
| M4 | `/?size=3&difficulty=EASY` | iPad landscape ≥1024, coarse | the row-regime card at `pointer: coarse` — `.play-controls` visible, ticket rows ≥44px targets |
| M5 | any | iPhone 16, dark mode | washi tape + well outline contrast in dark |

## Gates, with thresholds and negative controls

**G1 · The card no longer scrolls (row regime).** `#controls-drawer .controls-card`
`scrollHeight − clientHeight`.
· threshold **= 0** at 1024×768 and 1440×900, every game.
· headless says 0 (chromium + webkit); the ask is Safari's own layout.
· **negative control:** the same read on `dist-base` must return **448–486**. If it returns 0 too,
the instrument is pointed at the wrong element.

**G2 · Coarse tap targets in the ticket.** Bounding boxes of `.ctrl-btn`, `.icon-btn.deal-btn`,
`.peek-hold-surface`.
· threshold: Deal **≥44×44** (headless: 128.1×44); `.peek-hold-surface` **≥44** tall; `.ctrl-btn`
height **≥28** and horizontally separated ≥6px from its neighbours (the option gap dropped to
0.1rem — this is the row most likely to fail a real thumb).
· **negative control:** `.ticket-label` is not a target and must NOT be tappable.

**G3 · The mobile stack.** `document.documentElement.scrollHeight / innerHeight` and
board-bottom → Deal distance.
· expected **1.714** (before **1.800**) at 390×664; co-visibility need **205.1px**, must fit one
viewport.
· **negative control:** `dist-base` must return **1.800 / 225.8**. Equal numbers mean the wrong
build is being served.

**G4 · KEYPAD, the one thing only the device can answer.** Focus a below-fold blank cell so the
OS numeric keypad rises, then:
· (a) with the keypad up, scroll to the ticket — **is Deal reachable, and is any part of the card
permanently under the keypad?** Lane B ships nothing `position: fixed`, so the expected answer is
"reachable by scroll, nothing permanently occluded". Capture the frame.
· (b) record `visualViewport.height` and the keypad band, so the number can be compared against
the 336px figure pass 1 assumed without measuring.
· **negative control:** inject the 7-item fixed tray from
`pass2/laneB-rig/negctl2.mjs` (`build(page,"tray",7,true)`, 346px wide) and confirm it IS
occluded by the keypad — headless says 100% of its 52–54px height sits in the band. If the
injected tray is *not* occluded on device, F3's `--vv-height` graft is unnecessary and the tray
ruling should be revisited.

**G5 · Fraunces / Patrick Hand rendering on real Safari** — the mark-4 "low-res" hypothesis.
· Capture the ticket at 3× and inspect glyph fidelity of `Deal` (Fraunces, sentence case, fully
subset-covered) versus the option labels `Normal / Corner / Center / Off / Ask / Live / On`
(Fira Code, **not** covered — expected to render in a fallback face).
· **negative control:** `dist-base`'s `SIZE` / `DIFFICULTY` / `NEW GAME` headings — they must show
the same per-glyph mismatch (D and S in Fraunces, the rest in a system serif). If they look
uniform on device, the chimera finding is wrong and §0 of the dossier must be struck.

**G6 · Drawer glide, no distortion (≥lg only, iPad landscape).** Open/close the drawer twice.
· threshold: the card's drawn `HandDrawnOutline` frames (card + two wells) must not shear,
tear or lag the card box; no well outline may paint outside the card. Lane B adds no mover and no
counter-scale — the wells ride the rail's existing translate-only mover — so **any** distortion is
a finding.
· **negative control:** the board itself (which DOES ride translate+scale) is expected to travel;
if it doesn't, the drawer never glided and the pass is vacuous.

**G7 · Paint cost, if the perf harness is already running.** Idle paints / fps over 10s on the
playing view, before vs after.
· expectation **no regression**: the wells are `:pose="0"`, so they enrol no beat and add no
painter, and the diff removes one live filter reference (`.section-heading:hover`) and adds none.
· **negative control:** the grid's own boil must still register its steady-state cadence — a flat
zero everywhere means the sampler isn't seeing paints.

## Not requested (already settled headlessly, do not re-spend device time)

Strip clearance arithmetic (NC-1, both engines, both card widths) · 2-D board occlusion across a
scroll sweep · ink-mass rank · effective-opacity fade with its control · e2e 77/77 · unit 307/307 ·
mark-4 grep. Raw JSON for all of it is in `pass2/laneB-rig/`.
