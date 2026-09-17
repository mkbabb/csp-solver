# PASS-1 CHARTER · PLR-COUNT · The tally

Section: §11 the player mark (icon · lobby) · §12 · mark M14 (resolving M08)
Lane port: 127.0.0.1:4242
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PLR-COUNT/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

The mark is a COUNT, drawn as objects, readable without reading. The product already
draws tallies — `dealt ⊪` in the owner's own Frame B — so presence is one mark per
person, each in that person's ink: one stroke (or one crayon stub) per player, a
five-bar strike-through past four, and past a threshold a written count ('⊪⊪ 12'). Solo:
ONE graphite stroke — the mark is always present, always means the same thing, and is
legible from the first session. In a room: N marks in N inks. Drawn as a path so it
wobbles like everything else and costs zero filters.

F1 is RULED the other way: colour is a room-relative LABEL living on the mark and in the
lobby; the board keeps `--color-user-ink` for your own hand; nothing re-binds under a
player mid-session; the 24 user-ink sites and §12's peer chrome are untouched. The lobby
is the attendance register: the same small hung sheet in the @mbabb card's pose, a ruled
list, names in graphite with that person's coloured mark beside each, `you` beside your
name, 'last heard from' at the foot (never a connected dot), 16+ compressed to a count.
The roster's `role="log"` is reused, not duplicated; the mark's accessible name is the
count in plain words ('3 on this board'); a peer arriving never moves focus or opens the
sheet (M19). Whether the lobby MIRRORS the well's roster or MOVES it out of the controls
card (the well keeping invite and leave) is the family's second variable; the mark's
object (stroke vs stub) and the threshold are its first.

## Substrate on this tree (verify first, cite file:line)

- The tally glyph the deal counter draws (`GameControlPanel.vue`, the `dealt` tally — find its path or glyph and its seed) — the family draws the same object as a path.
- `AttributionCard.vue:129-189` the shell and pose; the phone's 250.5px free band.
- `playerIdentity.ts:64-70` `inkFor`; `useSession.ts:537` (self `ink: {}` — untouched under this F1 ruling); `GameControlPanel.vue:1086-1188` the roster and its three live regions.
- `gameCell.css:229-241` the peer cursor ring's ranking (unchanged); `HandDrawnGrid.vue:493-512` the join trace.
- `--tap-floor` (`index.css:821-834`); the z-ladder.

## What the family must answer

1. THE OBJECT — stroke vs stub at N = 1, 2, 3, 5, 8, 12 at 390 and 1280, dpr3: crops; each mark's own 1.4.11 ratio at its DRAWN opacity on four grounds (a 2–3px stroke in a player's ink is the smallest chromatic object in the product; R5's floors were derived for digits) — if colour does not survive at that size, say so and what the mark becomes.
2. THE FLOOR — a one-stroke mark needs an invisible 44×44 target: per-dimension negative control; the trigger inside the free band beside @mbabb.
3. THE READ — a five-second blind read at N=3 vs N=4 and at N=5 vs N=6 (the strike): a tally miscounted at a glance is a count that lies; the threshold for the written count.
4. F1 — the board unchanged (a DOM/style diff of a played board solo and in a room); the mark's ink for YOU is the room's `k[self]` colour while your digits stay blue: show both in one crop and say whether a reader is confused.
5. THE LOBBY — the register at 3 and 16; names in graphite (4.5:1) with the coloured mark beside each (3:1); `you`; 'last heard from' from the wire; mirror vs move and the live-region consequence.
6. SPEECH — I3 green; the accessible name is the count ('3 on this board'); the M19 row; what is announced on arrival while the sheet is shut (the roster's log, not a new region).
7. IDENTITY LOSS — what the register says when your binding is evicted or your live id is re-issued (I4/I5).
8. THE PALETTE COUPLING — the ink source assumed (the room's index into the estate's palette); what the mark needs from it (N distinguishable inks at 2–3px); do not design the palette.

## First runnable prototype

A static overlay over the live head (`page.evaluate` mounting the tally as an inline SVG path, N driven by a knob) at 390×844 and 1280×800, dpr3, both engines, both themes; a `?wire=local` pair for the room rows; R5's I3 re-run; canvas read-back on every mark; the blind-read crops (one strip of N = 1…12 per object, ≤150 KB).

## Instruments (re-run unchanged; add rows beside them)

- `r0/r5-player-mark/instruments.spec.ts` I2 (a player's own swatch is the colour the room paints for them), I3 (a player mark lives in the head's left corner — role + accessible name, x<200, y<120 — and its press opens a lobby), I4 (an agreed ink index survives a rival `st`), I5 (a live claim is never re-issued) — all RED at HEAD both engines. I3 must green under your overlay; I2 is ruled by your F1 answer (green, or a stated reason it stays red); I4/I5 are substrate rows the family must SPEAK to (what the lobby says when identity is lost), not cure.
- `r0/r5-player-mark/instruments-family-law.mjs` — no peer ink in the first 16 within 12° of a reserved ink, both sides read from the real sources (RED at HEAD: 37 collisions). Re-run against whatever palette your family assumes and say which anchor set you cleared.
- `r0/r5-player-mark/probe.spec.ts` + `probe.config.ts` — the read-only census rig (`?wire=local`, two pages, the head's geometry, the engine's painted bytes for all 144 indices); reuse it for every live measurement.
- Canvas read-back AA on four grounds for every colour the mark or lobby paints; 3:1 non-text at the DRAWN opacity for any stroke, dot or stub.
- `web/frontend/scripts/check-font-coverage.mjs` over every rendered string the mark and lobby mint (the hand has no `j`, no `x`; the slug filter `/^[a-ik-wyz]+$/` guarantees only the slug).
- The 44×44 floor on the trigger, per dimension, in the phone's 250.5px free band beside the 75.5px @mbabb trigger; M19 (a peer arriving moves no focus and opens nothing); W3's live-region idiom (no second region saying what the roster already says).

## Kill conditions and risk

- Colour may simply not survive at 2–3px; then the marks go graphite and the colour system loses its indication, which is most of M14.
- A tally past five needs a written count; a count is text in the masthead.
- Under this F1 ruling you are blue on the board and some other colour on the mark: two colours for one person on one page. Measure the confusion, don't argue it away.

## Census ground (read before designing)

- `r0/r5-player-mark/README.md` (+ `ink-census.txt`, `engine-vs-maths.txt`, `instruments-family-law.txt`, `instruments-webkit.txt`, `frames/players-well-3up-light.png`, `frames/head-left-card-open.png`): F1 a player's colour is a PAGE's colour (self gets `ink: {}`; you are blue on your page and `oklch(0.5 0.11 0)` on your neighbour's); F2 the walk's cycle is 144, min separation 12.5° at 16; F3 AA holds over all 144 (light 5.22/5.35, dark 9.71/9.50 on background/card); F4 37 collisions with the 29 reserved inks inside the first 16 (index 11 at 0.2° from solver-ink-5, index 15 at 0.4° from your blue, index 8 at 5.8° from teacher-red); F5 `IDENTITY_CAP = 8` bites (a ninth room evicts your binding; a tenth page is handed a LIVE id); F6 `adoptInk` re-inks the room before the board is believed; F7 presence: `hi` every 15 s, expiry 45 s, a played `st` is 1,033 B; F8 the roster is 111px below a phone's fold with the dock open; F9 the roster reads six rows (`max-height 7.5rem`); F10 the `you` qualifier sits ~145px from the name it qualifies; F11 the tag overhangs the well by 14px; F12 three live regions already speak (`players-status` polite, `players-roster` `role="log"` 'who's on this board', `players-alone` sr-only); F13 395,025 names, no `j`, no `x`; F14 the @mbabb card: trigger 75.5×39.8 at (0,12) desk / (0,0) phone, card 256×151 at (0,51.8), popover 80%, 2px border 30%, radius 16, padding 16, hung off `--head-rule` at `left: 0`; the head's free band on a phone is 250.5px.
- `r0/r2-accent-family/README.md` (the peer walk at C 0.110 vs mean crayon C 0.166; you keep Tailwind blue-600 while every peer is a generated oklch) and `r0/r6-idiom-history/R6-census.md` (the walk puts player 0 at h 0.0, rose/teacher-red territory; no player is ever assigned wax or a rainbow stop; the peer cursor ring is deliberately lighter than yours on every axis and is a RING; there are no mouse pointers in a pencil world).
- `web/frontend/src/games/shared/playerIdentity.ts:12, :27, :64-70, :78, :98, :142`; `src/games/shared/useSession.ts:73-76, :537, :553, :570-649, :763, :782`; `src/games/shared/GameControlPanel.vue:1042, :1086-1188, :1646, :1768`; `src/pencil/chrome/AttributionCard/AttributionCard.vue:129-189`; `src/games/shared/gameCell.css:229-241`; `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:493-512` (the join trace, nothing mounted at rest); `web/relay/relay.ts:172` (MAX_FRAME); `useJoinWash` (boot suppression 1200 ms, coalesce 400 ms, per-id gap 4000 ms, nothing under PRM).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PLR-COUNT/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PLR-COUNT/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4242 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
