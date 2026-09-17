# PASS-1 CHARTER · PLR-PLACE · The seating chart

Section: §11 the player mark (icon · lobby) · §12 · mark M14 (resolving M08)
Lane port: 127.0.0.1:4243
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PLR-PLACE/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

Presence is a PLACE, not a name and not a number. The mark is a 24×24 miniature of the
board's own frame (the same `wobbleRect` seed at small scale, zero filters) with a
coloured dot where each person is looking; the lobby is that miniature at ~96px with the
names beside it, in the @mbabb card's pose. The wire already carries it (`cur`) and
'looked away' is already spoken. Solo: an EMPTY miniature — honest, and it teaches the
reader what the mark is before anyone arrives. In a room: dots. The lobby answers 'who is
here' and 'where are they' in one object, the only reading that makes the lobby worth
opening twice. F1: colour is positional, so the board keeps your blue and the chart
carries the room colours. Nothing shown is invented — id, slug, ink index and cursor are
all on the wire; there is no connected dot because there is no such fact. A peer's dot
moving never moves the reader's focus (M19).

The family's first measurement is MOTION THE READER DID NOT ASK FOR: `cur` arrives at up
to 8 Hz, and a dot moving eight times a second in the masthead is ambient motion the
restraint law refuses. Measure the wire's real rate over 60 s of ordinary play, then
choose the damping (quantise to the shared 125 ms beat; move only on a settled cell; or a
pose-swap at the beat). If the honest damping makes the dots effectively static, say so:
the family has then collapsed into a count and must be reported as such.

## Substrate on this tree (verify first, cite file:line)

- `useSession.ts` the `cur` message (what it carries, how often it is sent, what `looked away` means and speaks); the relay's frame cost (`relay.ts:172`); `useJoinWash`'s coalescing constants as the precedent for damping.
- `gridPaths.ts:42-70` the frame's `wobbleRect` seed at small scale; the pose-0 bake for a still miniature; `filterBudget.ts` (a new drawn surface must not join the census).
- `AttributionCard.vue:129-189` the shell; the phone's free band; `--tap-floor`.
- `playerIdentity.ts:64-70` `inkFor` (the dots' inks); `GameControlPanel.vue:1086-1188` the roster and live regions (the lobby's name list reuses the log).

## What the family must answer

1. THE RATE — `cur` messages per second over 60 s of two-page play on `?wire=local`, and the damping chosen; the dot's motion budget on the masthead (moves per minute) after damping; PRM: dots step, never glide.
2. THE DOTS — 3:1 at 24px on four grounds at their drawn size (sub-3:1 by construction is the family's stated risk: measure it); the miniature's frame at 24px readable as the board.
3. THE FLOOR — 44×44 per dimension around a 24×24 mark beside @mbabb in the 250.5px band.
4. SOLO — the empty miniature at rest: does a reader learn it (crops at 390 and 1280)?
5. THE LOBBY — the ~96px chart with names beside; every name/ink at AA; 16 dots on a 9×9 miniature (and a 16×16): legible?; 'last heard from'; a peer who 'looked away' shown how (dot absent? faded?) — derive it from the wire.
6. PRIVACY — a true but private fact on the most persistent surface: say what the product's own voice would say about it (M16) and whether a peer can opt out without a new message kind.
7. SPEECH — I3 green; the accessible name (a count and a place? 'heron is on row 3'?) — what the log already says, nothing minted twice; M19.
8. BUDGET — filterBudget 9 with the miniature mounted; DOM cost per peer.

## First runnable prototype

Two live pages on `?wire=local`, one arrowing around under a scripted 60 s traversal; a `page.evaluate`-mounted miniature (inline SVG, the frame path from `gridPaths` at small scale, one dot per peer from the session's `cur`) at 390×844 and 1280×800, both engines; the wire-rate log banked as a table; the damping arms compared by moves-per-minute; R5's I3; canvas read-back on the dots; at most two crops (the mark at N=3; the lobby).

## Instruments (re-run unchanged; add rows beside them)

- `r0/r5-player-mark/instruments.spec.ts` I2 (a player's own swatch is the colour the room paints for them), I3 (a player mark lives in the head's left corner — role + accessible name, x<200, y<120 — and its press opens a lobby), I4 (an agreed ink index survives a rival `st`), I5 (a live claim is never re-issued) — all RED at HEAD both engines. I3 must green under your overlay; I2 is ruled by your F1 answer (green, or a stated reason it stays red); I4/I5 are substrate rows the family must SPEAK to (what the lobby says when identity is lost), not cure.
- `r0/r5-player-mark/instruments-family-law.mjs` — no peer ink in the first 16 within 12° of a reserved ink, both sides read from the real sources (RED at HEAD: 37 collisions). Re-run against whatever palette your family assumes and say which anchor set you cleared.
- `r0/r5-player-mark/probe.spec.ts` + `probe.config.ts` — the read-only census rig (`?wire=local`, two pages, the head's geometry, the engine's painted bytes for all 144 indices); reuse it for every live measurement.
- Canvas read-back AA on four grounds for every colour the mark or lobby paints; 3:1 non-text at the DRAWN opacity for any stroke, dot or stub.
- `web/frontend/scripts/check-font-coverage.mjs` over every rendered string the mark and lobby mint (the hand has no `j`, no `x`; the slug filter `/^[a-ik-wyz]+$/` guarantees only the slug).
- The 44×44 floor on the trigger, per dimension, in the phone's 250.5px free band beside the 75.5px @mbabb trigger; M19 (a peer arriving moves no focus and opens nothing); W3's live-region idiom (no second region saying what the roster already says).

## Kill conditions and risk

- Ambient motion in the masthead is the first kill; sub-3:1 dots at 24px the second; a private fact on a persistent surface the third. It is the most interesting family in its section and the least likely; its prototype is built to say which of the three ends it.

## Census ground (read before designing)

- `r0/r5-player-mark/README.md` (+ `ink-census.txt`, `engine-vs-maths.txt`, `instruments-family-law.txt`, `instruments-webkit.txt`, `frames/players-well-3up-light.png`, `frames/head-left-card-open.png`): F1 a player's colour is a PAGE's colour (self gets `ink: {}`; you are blue on your page and `oklch(0.5 0.11 0)` on your neighbour's); F2 the walk's cycle is 144, min separation 12.5° at 16; F3 AA holds over all 144 (light 5.22/5.35, dark 9.71/9.50 on background/card); F4 37 collisions with the 29 reserved inks inside the first 16 (index 11 at 0.2° from solver-ink-5, index 15 at 0.4° from your blue, index 8 at 5.8° from teacher-red); F5 `IDENTITY_CAP = 8` bites (a ninth room evicts your binding; a tenth page is handed a LIVE id); F6 `adoptInk` re-inks the room before the board is believed; F7 presence: `hi` every 15 s, expiry 45 s, a played `st` is 1,033 B; F8 the roster is 111px below a phone's fold with the dock open; F9 the roster reads six rows (`max-height 7.5rem`); F10 the `you` qualifier sits ~145px from the name it qualifies; F11 the tag overhangs the well by 14px; F12 three live regions already speak (`players-status` polite, `players-roster` `role="log"` 'who's on this board', `players-alone` sr-only); F13 395,025 names, no `j`, no `x`; F14 the @mbabb card: trigger 75.5×39.8 at (0,12) desk / (0,0) phone, card 256×151 at (0,51.8), popover 80%, 2px border 30%, radius 16, padding 16, hung off `--head-rule` at `left: 0`; the head's free band on a phone is 250.5px.
- `r0/r2-accent-family/README.md` (the peer walk at C 0.110 vs mean crayon C 0.166; you keep Tailwind blue-600 while every peer is a generated oklch) and `r0/r6-idiom-history/R6-census.md` (the walk puts player 0 at h 0.0, rose/teacher-red territory; no player is ever assigned wax or a rainbow stop; the peer cursor ring is deliberately lighter than yours on every axis and is a RING; there are no mouse pointers in a pencil world).
- `web/frontend/src/games/shared/playerIdentity.ts:12, :27, :64-70, :78, :98, :142`; `src/games/shared/useSession.ts:73-76, :537, :553, :570-649, :763, :782`; `src/games/shared/GameControlPanel.vue:1042, :1086-1188, :1646, :1768`; `src/pencil/chrome/AttributionCard/AttributionCard.vue:129-189`; `src/games/shared/gameCell.css:229-241`; `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:493-512` (the join trace, nothing mounted at rest); `web/relay/relay.ts:172` (MAX_FRAME); `useJoinWash` (boot suppression 1200 ms, coalesce 400 ms, per-id gap 4000 ms, nothing under PRM).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PLR-PLACE/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PLR-PLACE/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4243 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
