# PASS-1 CHARTER · PAL-WALK · The walk over open arcs

Section: §11c the per-player colour system · §3's peer exception · §12
Lane port: 127.0.0.1:4244
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PAL-WALK/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

The per-player colour stays an uncapped golden-angle WALK — the room is uncapped by
design, and a walk never runs out — but over the ARCS THE HOUSE HAS NOT RESERVED: the
hue steps by 137.5° modulo the open arc, skipping the arcs around every reserved ink (the
rose/teacher-red arc, the orange/gold arc, the blue arc that holds your hand and the
focus ring, the violet arc that holds progress and the solver's second stop, and every
other solver stop), so no peer is ever a crayon, a verdict, the machine, or you. Peers
run at the WAX's chroma (0.166, the mean crayon chroma) instead of today's 0.110, so a
peer reads as a different person rather than a different material, inside the same
`--peer-ink-l` lightness band (0.5 light / 0.8 dark). And YOU join it: `k[self]` binds
your ink on your own page when a room exists; nothing binds on a solo board (byte-
identical). The join trace and the peer cursor ring draw from the same ink at the
reduced pressures they already use (the ranking is decided history).

The family carries a number it must face: skipping ~205° of reserved arc leaves ~155° of
wheel, so at 16 players the minimum separation falls to ~9°, under the full walk's 12.5°.
The reserved set is defined from the 29 hexes in `index.css` and the arc width is
derived, not chosen: state the anchor set you cleared (the five crayons and their tiers,
plus whatever the accent law names), and re-derive if it changes.

## Substrate on this tree (verify first, cite file:line)

- `playerIdentity.ts:64-70` `inkFor` (`oklch(var(--peer-ink-l) 0.11 (i×137.5)%360)`), `:12` the shipped header (5.26/9.56 over 40), `:78` ("never reassigned" — true of mint, false of adoptInk), `:98` IDENTITY_CAP, `:142`; `index.css` `--peer-ink-l` (two arms).
- `r0/r5-player-mark/ink-census.txt` (the 29 reserved hexes with hue, the nearest-reserved table, min separation by room size) and `instruments-family-law.mjs` (the 12° law; RED at HEAD, 37 collisions).
- `useSession.ts:537` (self `ink: {}`), `:553` (`adoptInk` unguarded), `:763/:782` (the `st` ordering) — the seam that binds `k[self]`; say what a solo board binds (nothing) and prove it.
- `gameCell.css:229-241` the cursor ring (stroke-opacity 0.55, fill 0.04); `HandDrawnGrid.vue:493-512` the join trace at its beat ceiling (0.95/0.65/0.45).
- `index.css:164-169` the crayon dark law (peers are not crayons but the law's spirit — hue held, lightness up — binds the band).

## What the family must answer

1. THE RESERVED SET — every arc named with its bounds and the hex that reserves it; the open arc's total width; the walk's step modulo the arc; the anchor set assumed (state it; re-derive if the accent law differs).
2. THE FAMILY LAW — `instruments-family-law.mjs` GREEN over the first 16 at 12° (and report 24 and 40); the solver-ink-5 (0.2°), your-blue (0.4°) and teacher-red (5.8°) collisions gone by construction.
3. SEPARATION — min hue separation at 4, 8, 16, 24 players on the open arc; two peers ~9° apart at 16: legible on the board (digits side by side, dpr3 crop) or not — say which room size the walk honestly serves.
4. AA — canvas read-back over 144 indices of the arc walk at chroma 0.166 on four grounds (`--color-background`, `--color-card`, light, dark), engine bytes not arithmetic; the worst case named; sRGB gamut at C 0.166 across L 0.5/0.8 (clipped hues paint alike — count them).
5. 3:1 — the cursor ring at 0.55 and the join trace at its ceiling, in the new chroma, four grounds.
6. YOU JOIN — `k[self]` on your own page: a DOM/style diff of a solo board before/after (byte-identical) and a room board (your digits in your room ink; what `--color-user-ink` becomes — the solo ink); print and forced-colors arms.
7. THE ROSTER — one colour system in the list (no Tailwind blue beside generated oklch); the swatch/mark in the same ink; I2 green.
8. THE SUBSTRATE'S OWN BOUNDS — F5/F6 (eviction, re-issued ids, `adoptInk` before belief) named as what the palette inherits; not cured here.

## First runnable prototype

`page.evaluate` patching `inkFor` (or an `addStyleTag` overriding the computed inks per index) on your dev server, two pages on `?wire=local`, both engines, both themes; `instruments-family-law.mjs` re-run against the arc walk (read the walk from your patched source, the hexes from `index.css`); the 144-index canvas read-back; one roster crop (light) and one board crop at dpr3 with two adjacent peers at the minimum separation.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r5-player-mark/instruments.spec.ts` I2 (a player's own swatch is the colour the room paints for them), I3 (a player mark lives in the head's left corner — role + accessible name, x<200, y<120 — and its press opens a lobby), I4 (an agreed ink index survives a rival `st`), I5 (a live claim is never re-issued) — all RED at HEAD both engines. I3 must green under your overlay; I2 is ruled by your F1 answer (green, or a stated reason it stays red); I4/I5 are substrate rows the family must SPEAK to (what the lobby says when identity is lost), not cure.
- `r0/r5-player-mark/instruments-family-law.mjs` — no peer ink in the first 16 within 12° of a reserved ink, both sides read from the real sources (RED at HEAD: 37 collisions). Re-run against whatever palette your family assumes and say which anchor set you cleared.
- `r0/r5-player-mark/probe.spec.ts` + `probe.config.ts` — the read-only census rig (`?wire=local`, two pages, the head's geometry, the engine's painted bytes for all 144 indices); reuse it for every live measurement.
- Canvas read-back AA on four grounds for every colour the mark or lobby paints; 3:1 non-text at the DRAWN opacity for any stroke, dot or stub.
- `web/frontend/scripts/check-font-coverage.mjs` over every rendered string the mark and lobby mint (the hand has no `j`, no `x`; the slug filter `/^[a-ik-wyz]+$/` guarantees only the slug).
- The 44×44 floor on the trigger, per dimension, in the phone's 250.5px free band beside the 75.5px @mbabb trigger; M19 (a peer arriving moves no focus and opens nothing); W3's live-region idiom (no second region saying what the roster already says).

## Kill conditions and risk

- ~155° for 16 players; if 9° is not legible on digits, the walk honestly serves fewer than the owner's "16+ within reason" and must say the number.
- Chroma 0.166 at L 0.5 may clip some hues out of sRGB.
- The reserved set moves with the accent family; a walk that clears five anchors may not clear six.

## Census ground (read before designing)

- `r0/r5-player-mark/README.md` (+ `ink-census.txt`, `engine-vs-maths.txt`, `instruments-family-law.txt`, `instruments-webkit.txt`, `frames/players-well-3up-light.png`, `frames/head-left-card-open.png`): F1 a player's colour is a PAGE's colour (self gets `ink: {}`; you are blue on your page and `oklch(0.5 0.11 0)` on your neighbour's); F2 the walk's cycle is 144, min separation 12.5° at 16; F3 AA holds over all 144 (light 5.22/5.35, dark 9.71/9.50 on background/card); F4 37 collisions with the 29 reserved inks inside the first 16 (index 11 at 0.2° from solver-ink-5, index 15 at 0.4° from your blue, index 8 at 5.8° from teacher-red); F5 `IDENTITY_CAP = 8` bites (a ninth room evicts your binding; a tenth page is handed a LIVE id); F6 `adoptInk` re-inks the room before the board is believed; F7 presence: `hi` every 15 s, expiry 45 s, a played `st` is 1,033 B; F8 the roster is 111px below a phone's fold with the dock open; F9 the roster reads six rows (`max-height 7.5rem`); F10 the `you` qualifier sits ~145px from the name it qualifies; F11 the tag overhangs the well by 14px; F12 three live regions already speak (`players-status` polite, `players-roster` `role="log"` 'who's on this board', `players-alone` sr-only); F13 395,025 names, no `j`, no `x`; F14 the @mbabb card: trigger 75.5×39.8 at (0,12) desk / (0,0) phone, card 256×151 at (0,51.8), popover 80%, 2px border 30%, radius 16, padding 16, hung off `--head-rule` at `left: 0`; the head's free band on a phone is 250.5px.
- `r0/r2-accent-family/README.md` (the peer walk at C 0.110 vs mean crayon C 0.166; you keep Tailwind blue-600 while every peer is a generated oklch) and `r0/r6-idiom-history/R6-census.md` (the walk puts player 0 at h 0.0, rose/teacher-red territory; no player is ever assigned wax or a rainbow stop; the peer cursor ring is deliberately lighter than yours on every axis and is a RING; there are no mouse pointers in a pencil world).
- `web/frontend/src/games/shared/playerIdentity.ts:12, :27, :64-70, :78, :98, :142`; `src/games/shared/useSession.ts:73-76, :537, :553, :570-649, :763, :782`; `src/games/shared/GameControlPanel.vue:1042, :1086-1188, :1646, :1768`; `src/pencil/chrome/AttributionCard/AttributionCard.vue:129-189`; `src/games/shared/gameCell.css:229-241`; `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:493-512` (the join trace, nothing mounted at rest); `web/relay/relay.ts:172` (MAX_FRAME); `useJoinWash` (boot suppression 1200 ms, coalesce 400 ms, per-id gap 4000 ms, nothing under PRM).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PAL-WALK/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PAL-WALK/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4244 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
