# T8 — the marks tranche · formation (2026-08-03)

Nineteen owner marks: fourteen (M1–M14) verbatim-faithful from the 2026-08-03 audit of the
live site (post-T7), four added the same day (M16–M19), and M20 added 2026-08-04. M15 was
never issued, so the top M-number runs one ahead of the membership — |M1–M14| + |M16–M20| =
19. Screenshots banked in `marks/` (m1–m9) — the temp paths in the owner's message are
ephemeral; these copies are the record. Binding law: the convergent-design-loop's
parsimony refinement (T6 precedent — process-lite, code-heavy, visual verification on the
real surface), O-12 (no browser CI lanes; suites are local instruments; validation is
visual on the live edge), U-10 (a mark closes ONLY on the owner's re-look — the record
states ladder position, never closure).

## The marks

| id | mark | shot |
|---|---|---|
| M1 | Hovering a written cell shows WHO wrote it (multiplayer attribution); peers' cursor/selection shown as a ghost | — |
| M2 | A dividing line above the deal/dealt block in the controls drawer | m1 |
| M3 | Prune ALL superfluous/duplicative text items — exemplar: "board changed — ask again" under Live | m2 |
| M4 | The new-game staging band's design language is off: misaligned (the `level` row wraps, Hard orphans below Easy/Medium), rounding/squaring inconsistent with the hand-drawn language | m3, m4 |
| M5 | Text items must CONSISTENTLY boil/not-boil on hover — audit the whole estate for consistent boiling | m4 |
| M6 | The sudoku/header logo frequently goes low-res | — |
| M7 | Gallery transition + game selection/deselection animation is jittery — define and smooth it; **Esc must deselect/exit here and doesn't** | m5 |
| M8 | The bottom controls (staging band) changing game-to-game reflows the page and its size — it must not | m5 |
| M9 | The dark-mode toggle's storybook transition regressed — it was properly defined many versions ago; find and re-use that | — |
| M10 | Clicking a FLANK gallery card should warp/center to it | m6 |
| M11 | Show more than two games at a time in the deck | m6 |
| M12 | Previews are LIVE and the ACTUAL state of each game; state persists and saves between gallery switches | m6 |
| M13 | Multiplayer × gallery: define ALL edge cases when a user switches gallery items mid-session | — |
| M14 | Join/leave properly animated: controls expand + draw the player in; the board draws in briefly with the joining player's color (debounced); leaving is the same muted + reversed; potentially a player icon | — |
| M17 | (added same day) The @mbabb logo is not aligned to the top of the screen correctly — it should form a properly defined line with the dark-mode toggle | m8 |
| M18 | (added same day) The main board's alignment with the title is wrong — and on other game boards | m9 |
| M19 | (added same day, owner's order, PERMANENT) Safari testing seized the owner's screen — "you cannot puppet the screen like that. Use a proper channel elsewhere… Change the safari puppeting immediately." safaridriver/Safari.app on the owner's desktop is BANNED; headless/background channels only; real-desktop-Safari claims are owner-hardware-scoped | — |
| M16 | (added same day, owner's words verbatim) "all language like this is to be abrogated completely and removed wholesale. 'a naked single'--what? And this is to be done generally, NOT just this one item. Abstract over it. If we ever do display language, we can never us an em dash, and never use metaphor, meta language, or contrivance--plain english only." THE COPY LAW: every user-visible string censused estate-wide; jargon/metaphor/meta/contrivance removed wholesale; survivors rewritten in plain English; NO em dashes in product copy, ever. This supersedes the register tolerance W1's M3 census graded under — every KEEP verdict re-adjudicates | m7 |
| M20 | (post-formation mark, 2026-08-04; text is the chair's paraphrase — verbatim unrecovered) The wordmark floats on the board: in a ~900-css-px-wide dark-mode window with the board filling the page top to bottom, "sudoku" and its caret lie mid-left ON the grid. Report + cure: `evidence/m20-float/report.md`, close-record §6.2 | — |

**NOTE (T9-W0, 2026-08-25):** M20's row is added here, and the header count trued from
"fourteen" to nineteen. The mark landed the day after this file was written, so the
manifest never carried it — the close record's §4 ladder and `evidence/m20-float/report.md`
did. The owner's shot for M20 is not in `marks/` (the dir holds m1–m9, re-counted at
`c917f9a7`); the report's opening description is the only surviving account of it, which is
why the row is flagged a paraphrase. This file is a manifest, not sealed narrative, so the
row and the count are edited in place. Registry family F6 (T9 formation).

## The waves

- **W1 — chrome cures** (Opus fanout, batch 1): M2 · M3 (census then cures) · M4 · M8.
  Fences: agent A owns `StagingBand.vue` + the controls-drawer components;
  `GameGallery.vue` belongs to agent B — A files wiring requests for it.
- **W2 — interaction cures** (batch 1): M7 (Esc + smoothing) · M10 (flank click-to-warp).
  M5 (boil census + invariant) · M9 (git archaeology: recover the old storybook
  definition) ride agent C. Fences: B owns `App.vue` view machine +
  `useCarouselGlide.ts` + `GameGallery.vue`; C owns `DarkModeToggle.vue` + hover/boil CSS.
- **W3 — the deep design pair** (thrice protocol, after batch 1): (a) M11+M12 the deck
  re-design — multi-card, live true-state previews, state persistence across switches;
  (b) M13+M14 the multiplayer session semantics × gallery + the join/leave animation
  language, with M1's attribution/ghost-cursor riding the same design. Fable designs,
  Opus implements, chair adjudicates.
- **W4 — the logo class** (M6): root-cause forensics on the recurring low-res bake
  (prior hypothesis on file: layout-size bakes + detached-blob font loss), then a class
  cure with a countable invariant — the third bite of this family, so the invariant comes
  first (lessons §3).
- **WGATE**: deploy per seal (gated chain), visual pass on the live edge both engines,
  ladder positions recorded per mark for the owner's re-look. No mark closes here.

## Standing discipline

Local instruments only (no CI browser lanes) — the drag block, unit estate, and doc-truth
still gate commits; born-RED where a mechanism is deterministically capturable; every cure
visually verified on the real surface before its seal; owner ballots asked when cheap,
never banked (lessons §8).
