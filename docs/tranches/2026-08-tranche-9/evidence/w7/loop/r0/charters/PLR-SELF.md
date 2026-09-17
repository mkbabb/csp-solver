# PASS-1 CHARTER · PLR-SELF · Your mark, in your ink

Section: §11 the player mark (icon · lobby) · §12 · mark M14 (resolving M08)
Lane port: 127.0.0.1:4241
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PLR-SELF/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

The mark in the head's left corner is YOU: one object, in your ink. Pressed, it opens a
small sheet in the house hand hung off `--head-rule` — the @mbabb card's pose is the one
existing precedent for a small opening surface in that corner (256×151, `left: 0`,
popover at 80%, 2px border at 30%, radius 16, padding 16) — listing everyone on the board
in their inks. F1 is RULED: your page paints you the colour the room paints you (`k`
already names your index on every page including your own), so colour arriving on your
own mark MEANS someone else is here; `--color-user-ink` becomes the solo ink only, and a
solo board binds nothing and stays byte-identical.

The family's research fork is the OBJECT'S FORM, and both must be prototyped: (a) your
written NAME — the slug's animal alone (5–11 characters in the hand, already spoken as
'tragic-mockingbird's entry 7'), written in your ink under @mbabb; a name written in a
colour needs no swatch; graphite when solo; (b) a drawn CRAYON STUB — one `wobbleRect`
fill in your ink, 44×44, graphite at rest — a mark that is always present and means the
same thing from the first session. Either way the resting solo state must be one the
reader can learn.

The lobby: a small ruled sheet; names left-aligned in their inks (a stub or a name-in-ink
per row, never a CAD dot); `you` directly after your own name (the qualifier sits ~145px
adrift today); a state line in plain words (`only you` / `3 on this board` — never `just
you`, the hand has no `j`); one plain line at the foot, 'last heard from … ' against the
45 s expiry, never a connected dot (the wire carries no such fact); 16+ names compress to
'and 7 more', never a scroll inside a scroll inside a sheet; the invite link with one
copy act and `leave` may ride it or stay in the well. Whether the lobby MIRRORS the
well's roster (two surfaces, W3's one-region law to answer) or MOVES it (the well keeps
only invite and leave, which is M14's 'controls stay in controls' read literally, and the
three live regions ride with it) is the family's second variable. The roster's `role="log"`
is reused, never duplicated; the mark's own accessible name is the state line; a peer
arriving never moves focus or opens the sheet (M19).

## Substrate on this tree (verify first, cite file:line)

- `AttributionCard.vue:129-189` the card's shell and pose; the phone's free band 250.5px (trigger ends at 75.5, the sun starts at x=326 on 390); T9-W3 §3.7 re-ordered the mobile instance in the DOM (head tabs left-then-right).
- `useSession.ts:537 mint()` (self gets `ink: {}`), `:553 adoptInk`, `:763/:782` the `st` arm ordering; `playerIdentity.ts:64-70` `inkFor`, `:27` the slug filter; `k` on every page (the substrate for F1).
- `GameControlPanel.vue:1086-1188` the three live regions and the roster markup (`max-height 7.5rem`, the row grammar swatch · name · flex gap · `you`); `:1042` the tag; the invite verb and its note berth (W2 §2.5); `leave`.
- `HandDrawnGrid.vue:493-512` the join trace (nothing mounted at rest) and `useJoinWash` — the room's existing "someone arrived" grammar the mark must agree with.
- The 44px floor token (`--tap-floor`, `index.css:821-834`); the z-ladder (the card's popover rung).

## What the family must answer

1. THE FORM — (a) name vs (b) stub at 390×844 and 1280×800 beside @mbabb, solo and in a room of 3 (`?wire=local`): crops open and shut; the trigger 44×44 per dimension inside the free band; does a 14px slug read as clutter beside @mbabb; does a stub read as anything at rest.
2. F1 — I2 green on both pages of a live pair: your ink on your own mark is the room's colour for you; the solo board byte-identical (a DOM/style diff of a solo board before and after the overlay).
3. THE LOBBY — the sheet at 3 and at 16 (compression at N); every ink at 4.5:1 on the sheet's ground both themes; `you` beside the name; 'last heard from' derived from the wire (`hi` cadence 15 s, expiry 45 s) — prove no invented fact.
4. MIRROR vs MOVE — under each: what the well shows, what the three live regions announce on a third person arriving while the lobby is shut, and whether a second region was minted (it may not be).
5. SPEECH — the mark's accessible name (the state line) measured; I3 green; the M19 row (a peer arriving: focus unmoved, nothing opened).
6. IDENTITY LOSS — what the lobby says when a ninth room evicts your binding or a second tab is handed your live id (I4/I5 RED at HEAD): a plain sentence, or silence, and why.
7. THE PALETTE COUPLING — state the ink source the family assumes (the room's `k` index into whatever palette the estate rules) and what the mark needs from it (one ink per person, AA on the sheet's ground); do not design the palette.
8. COPY + FONT — every string minted, in the register, through `check-font-coverage.mjs`.

## First runnable prototype

A static overlay injected over the live head on your dev server (`page.evaluate` mounting a trigger and a sheet cloned from `AttributionCard`'s shell; both forms), 390×844 and 1280×800, both engines, with a second page on `?wire=local` for the room rows; R5's I2/I3 re-run against it; the font check; two head-left crops (shut, open) per form at most.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r5-player-mark/instruments.spec.ts` I2 (a player's own swatch is the colour the room paints for them), I3 (a player mark lives in the head's left corner — role + accessible name, x<200, y<120 — and its press opens a lobby), I4 (an agreed ink index survives a rival `st`), I5 (a live claim is never re-issued) — all RED at HEAD both engines. I3 must green under your overlay; I2 is ruled by your F1 answer (green, or a stated reason it stays red); I4/I5 are substrate rows the family must SPEAK to (what the lobby says when identity is lost), not cure.
- `r0/r5-player-mark/instruments-family-law.mjs` — no peer ink in the first 16 within 12° of a reserved ink, both sides read from the real sources (RED at HEAD: 37 collisions). Re-run against whatever palette your family assumes and say which anchor set you cleared.
- `r0/r5-player-mark/probe.spec.ts` + `probe.config.ts` — the read-only census rig (`?wire=local`, two pages, the head's geometry, the engine's painted bytes for all 144 indices); reuse it for every live measurement.
- Canvas read-back AA on four grounds for every colour the mark or lobby paints; 3:1 non-text at the DRAWN opacity for any stroke, dot or stub.
- `web/frontend/scripts/check-font-coverage.mjs` over every rendered string the mark and lobby mint (the hand has no `j`, no `x`; the slug filter `/^[a-ik-wyz]+$/` guarantees only the slug).
- The 44×44 floor on the trigger, per dimension, in the phone's 250.5px free band beside the 75.5px @mbabb trigger; M19 (a peer arriving moves no focus and opens nothing); W3's live-region idiom (no second region saying what the roster already says).

## Kill conditions and risk

- Two names in the quietest corner (@mbabb and yours) are two authorship claims in one place; if the name must appear only in a room, the solo resting state is empty and an indication nobody sees at rest is one nobody learns — which then argues for the stub. Measure, then choose.
- Mirroring the roster says one thing twice (W3); moving it touches three live regions W3 just landed.
- A stub is an abstract glyph a reader must learn; a name is a word a reader must read. The family must say which the head can afford.

## Census ground (read before designing)

- `r0/r5-player-mark/README.md` (+ `ink-census.txt`, `engine-vs-maths.txt`, `instruments-family-law.txt`, `instruments-webkit.txt`, `frames/players-well-3up-light.png`, `frames/head-left-card-open.png`): F1 a player's colour is a PAGE's colour (self gets `ink: {}`; you are blue on your page and `oklch(0.5 0.11 0)` on your neighbour's); F2 the walk's cycle is 144, min separation 12.5° at 16; F3 AA holds over all 144 (light 5.22/5.35, dark 9.71/9.50 on background/card); F4 37 collisions with the 29 reserved inks inside the first 16 (index 11 at 0.2° from solver-ink-5, index 15 at 0.4° from your blue, index 8 at 5.8° from teacher-red); F5 `IDENTITY_CAP = 8` bites (a ninth room evicts your binding; a tenth page is handed a LIVE id); F6 `adoptInk` re-inks the room before the board is believed; F7 presence: `hi` every 15 s, expiry 45 s, a played `st` is 1,033 B; F8 the roster is 111px below a phone's fold with the dock open; F9 the roster reads six rows (`max-height 7.5rem`); F10 the `you` qualifier sits ~145px from the name it qualifies; F11 the tag overhangs the well by 14px; F12 three live regions already speak (`players-status` polite, `players-roster` `role="log"` 'who's on this board', `players-alone` sr-only); F13 395,025 names, no `j`, no `x`; F14 the @mbabb card: trigger 75.5×39.8 at (0,12) desk / (0,0) phone, card 256×151 at (0,51.8), popover 80%, 2px border 30%, radius 16, padding 16, hung off `--head-rule` at `left: 0`; the head's free band on a phone is 250.5px.
- `r0/r2-accent-family/README.md` (the peer walk at C 0.110 vs mean crayon C 0.166; you keep Tailwind blue-600 while every peer is a generated oklch) and `r0/r6-idiom-history/R6-census.md` (the walk puts player 0 at h 0.0, rose/teacher-red territory; no player is ever assigned wax or a rainbow stop; the peer cursor ring is deliberately lighter than yours on every axis and is a RING; there are no mouse pointers in a pencil world).
- `web/frontend/src/games/shared/playerIdentity.ts:12, :27, :64-70, :78, :98, :142`; `src/games/shared/useSession.ts:73-76, :537, :553, :570-649, :763, :782`; `src/games/shared/GameControlPanel.vue:1042, :1086-1188, :1646, :1768`; `src/pencil/chrome/AttributionCard/AttributionCard.vue:129-189`; `src/games/shared/gameCell.css:229-241`; `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:493-512` (the join trace, nothing mounted at rest); `web/relay/relay.ts:172` (MAX_FRAME); `useJoinWash` (boot suppression 1200 ms, coalesce 400 ms, per-id gap 4000 ms, nothing under PRM).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PLR-SELF/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/PLR-SELF/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4241 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
