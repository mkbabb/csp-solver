# F5 — THE PROPORTION LEDGER · SPEC (pass 1, SYNTHESIS)

Lane: SYNTHESIS. Inputs: `charter-f5.md`, `f5-research.md`. Every number below is the
dossier's, spot-verified against source this pass (`AssistSettings.vue`, `DiceIcon.vue`,
`OptionSelector.vue`, `GameControlPanel.vue:390-596,735-973`, `typography.css:24-66,244-269`).
All paths under `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/`.

## The center, restated against rendered reality

Every control in the drawer sits on one rung: eight verb icons span 22–28px (exactly one √φ),
five option rows sit at 20/22px, six Fraunces-800 headings at 25.89px (the φ rung — the
charter's 1.272rem is the <768 arm nobody in the drawer sees), and the panel's sole commit
verb wears the panel's SMALLEST text (14.38px caption). Pressure runs backwards: the "quiet"
graphite-68% token (5.23:1) is louder than the muted-foreground every heading wears (4.65:1).
F5's bet: restore rank by proportion + ink pressure alone — nothing moves, nothing is added.

## Decisions (each resolves a dossier contradiction; C# = dossier numbering)

**D1 · Deal at rank 1 = die 32px + label at `--type-title`, NOT a 48–56px die.**
Resolves C4 + C5 + open Q1/Q4 in one move. 32px is the documented ceiling of the
`grain-static` 20–32px HOLD band (`pencilConfig.ts:264-266`) — no `grain-deal` preset, the
filter layer stays byte-untouched, mark 4 stays zero-interaction. Rendered stroke at 32px =
1.8×32/24 = 2.40px < `PENCIL.gridCell` 2.5 — no `strokeWidth` prop, `DiceIcon.vue` untouched.
The rank-1 mass comes from the LABEL: `.deal-btn .icon-sublabel` (class kept — e2e
`mobile-affordances.spec.ts:352,367` binds to it) rises caption → `--type-title` 2.058rem =
32.93px. Arithmetic signature: 32.93 = 25.89 × 1.272 — Deal's name sits exactly one √φ rung
ABOVE the headings that today out-shout it 1.8×. First live consumer of the ladder's top half
(zero-consumer today, dossier Q2a). Armed "sure?" inherits the same rung — the confirm shouts.

**D2 · The pressure ladder re-based on graphite, headings re-inked, three AA holes closed.**
Resolves C6 + the Q2b inversion. Four tokens in `typography.css :root`, formalizing the
shipped `heading-value` idiom (`color-mix(in srgb, var(--color-pencil-graphite,
var(--grid-line-color)) N%, transparent)`, `GameControlPanel.vue:962-966`):

| token | mix | light / dark on card | role |
|---|---|---|---|
| `--ink-press-full` | 100% | 14.78 / 12.03 | rank-1 verb ink |
| `--ink-press-firm` | 85% | 9.19 / 8.90 | rank-1 label, selected states |
| `--ink-press-med` | 75% | 6.57 / 7.14 | rank-2 zone headings |
| `--ink-press-light` | 68% | 5.23 / 6.06 | rank-3/4 eyebrows, ambient (canonizes :962) |

All four AA-clean both themes. Headings drop `text-muted-foreground` (4.65, 0.15 above the
floor, un-lightenable — a dead ramp) for `--ink-press-med`. This is the one visibly tonal
change; the prototype slice exists to put it in front of the owner (open Q2) — fallback is
headings stay muted and the ladder scopes to the new rungs only. Same pass, ~4 lines: the
sub-AA sites the charter's "respect the AA ledger" would otherwise canonize —
`KeyboardLegend.vue:55-60` text 55%→68% (3.53→5.23 light), `:95-100` kbd borders 40%→55%
(2.36→3.53, clears the 3:1 non-text floor), and `.icon-sublabel.is-armed`
`--color-crayon-rose`→`--color-red-ink` (4.10→4.98 — on Deal itself, the ink already minted
at `index.css:163` for exactly this hue, per the difficulty-heading precedent :786-788).

**D3 · Check + Candidates demoted to ONE caption-tier row inside `AssistSettings.vue`.**
Resolves C3 and the charter's demotion clause; honors dossier note 12. The two identical
stanzas (`:60-71`, `:75-89`) collapse to one hairline + one wrapping row: two inline groups,
each an `.eyebrow-caption` label ("Check", "Cands" — `aria-label`s "Check for errors" /
"Show candidate marks" kept verbatim) beside its OptionSelector. Both emit seams untouched —
the same-value re-emit on Ask is load-bearing (`:19-21`), so the row keeps full `.ctrl-btn`
buttons (44px coarse floor via `index.css:679-686` is automatic), never a switch, never inert.
Demotion mechanism: scoped `:deep(.ctrl-btn) { font-size: var(--type-caption) }` in
AssistSettings — unlayered scoped CSS beats the utilities layer, so **OptionSelector's API
gains nothing** (no `size` prop, no `--ctrl-size` plumbing — cheaper than both the charter's
variant and the dossier's counter-proposal). Recovers ≈216px desktop / ≈125px mobile (~20% of
the 616px card) — the largest single reclamation available, at zero e2e cost (0 refs).

**D4 · Rhythm: 0.25rem base, three tokens, zone breaks created not re-proportioned.**
Resolves C8 + open Q3. `--rhythm-1/-2/-3` = 0.25/0.5/0.75rem (fits 9 of 13 shipped
magnitudes). The desktop panel's top-level column (`GameControlPanel.vue:529`) and the mobile
column (`:330`) gain `gap: var(--rhythm-2)` — the zone-break spacing that today is literally
0px; `.deal-row`'s `margin-top: 0.6rem` and `.new-game-heading`'s `0.35rem` re-set to
`--rhythm-2`/`--rhythm-1`. The four decorative micro-gaps (0.05/0.15 within buttons) are
calligraphic kerning, explicitly grandfathered — rhythm governs stanza and zone breaks only.
Cost: ~5 new 8px breaks ≈ +40px, paid out of D3's 216px. No icon-stop token table: exactly
one icon changes size (Deal, D1) — a table with one consumer is unearned abstraction; the 32
stays a literal with the band-ceiling comment. (Resolves the charter's icon-stop clause by
refusal; open Q6 answered: one home, `typography.css`.)

**D5 · Picker: widen the ratio from below; the wordmark stays off-token.**
Resolves C9 + open Q5. `.game-card-name` height (viewBox doctrine, `GameCard.vue:395-397`,
`HandwrittenLogo.vue:390-394`) is untouched; `.game-card-range` drops `--type-body` →
`--type-small` — name/range goes 1.31 → 1.48 @1440 in one line. Pips (8.8px) already sit at
the ladder's floor; `GameGallery.vue` untouched. One ledger, two channels, honestly stated.

**D6 · Mobile: structural demotion only, and said so.** Resolves C10. Coarse 44px floors mean
the type rung buys 0px there; the ~125px comes from D3's stanza collapse. Deal's D1 treatment
applies as-is (title rung is fixed rem; 366px card carries it). No regime changes (refusal kept).

**Conceded (unchanged from charter):** mark 2 (drawer choreography) — proportion only makes
the freight read composed. And per C11: the drawer still scrolls (936→~760px against a
608–640px cap). F5 is not sold as un-scrolling the panel.

## Change inventory (file → change, net-LOC sign)

| file | change | Δ |
|---|---|---|
| `src/assets/typography.css` | 4 ink-pressure tokens + 3 rhythm tokens in `:root`; `.eyebrow-caption` register (Fraunces 800 caps @ `--type-caption`, `--ink-press-light`) in `@layer components` beside `.section-heading` | +20 |
| `src/games/shared/GameControlPanel.vue` | 2× `DiceIcon :size` 28→32 (`:396,:570`); `.deal-btn .icon-sublabel` → `--type-title`/`--ink-press-firm`; `.is-armed` → `--color-red-ink` (`:864-867`); heading color → `--ink-press-med` (template `text-muted-foreground` sites + `.new-game-heading:742`); top-level `gap` both regimes (`:330,:529`); `.deal-row`/`.new-game-heading` margins → rhythm | ~14 touched, +4 |
| `src/games/shared/AssistSettings.vue` | two stanzas → one hairline + one row; `.eyebrow-caption` inline labels (aria kept); `:deep(.ctrl-btn)` caption rung; emits/logic byte-untouched | −8 |
| `src/pencil/chrome/OptionSelector/OptionSelector.vue` | `"Fira Code", monospace` → `var(--font-mono)` (`:67`) | 0 |
| `src/pencil/chrome/KeyboardLegend.vue` | text 55%→68%; kbd border 40%→55% | 0 |
| `src/pencil/chrome/GameGallery/GameCard.vue` | `.game-card-range` → `--type-small` (`:417`) | 0 |

**6 files · ≈75 lines touched · net ≈ +16 · 0 new components · 0 new props · 0 filter-layer
bytes · 0 pose bakes** (DiceIcon is raster-free inline SVG, dossier Q3a). Down from the
dossier's +45 by dropping the strokeWidth prop, grain-deal preset, icon table, and pip touch.

## Prototype slice (ordered first — built to FALSIFY the center)

The center's falsifiable bet: **typography and ink pressure alone can out-rank geometry** —
a 32px die + 32.93px pressed label reads rank 1 without the 48–56px die the charter assumed.
Slice = D1 + D2 + D3 only (no rhythm, no picker), desktop drawer + 390px mobile card,
light + dark screenshots at 1440×900 and 390×844. Kill criteria:
1. Deal still reads subordinate to the option rows it commits → proportion loses to
   geometry; the family center fails and F5 concedes to a relocation/weight family.
2. The caption-tier assist row reads disabled/inert (note 12: re-tapping Ask IS the check
   trigger) → demotion depth wrong; retreat one rung before condemning the family.
3. Graphite-75% headings read as a different notebook (owner tone ruling, open Q2) →
   fallback: headings keep muted; ladder scopes to new rungs.
D4 + D5 land only after the slice survives.

## Success test (the family's own)

At 1440×900 drawer regime, light + dark:
- **Rank arithmetic**: Deal label 32.93px = heading 25.89 × √φ; exactly 4 rendered text rungs
  in the panel (title · heading · ctrl 20-22 · caption), monotone with the Q1e rank table —
  today's 1.8× inversion at the commit verb reads reversed.
- **Pressure monotone**: ink contrast strictly non-increasing with rank
  (firm 9.19 → med 6.57 → light 5.23); sub-AA sites in panel + legend: 3 → 0.
- **Pixels**: desktop panel content ≤780px (from 936); mobile card ≤510px (from ≈616),
  gaps included. No claim past that — the 640px cap still scrolls.
- **Guards green**: `visual-regression.spec.ts:150-153` first `.ctrl-btn` ≥19 (mobile Size,
  untouched); all 44px floors; `.icon-sublabel` reads "Deal"/"sure?"; 8/8 goldens untouched
  (no F5 surface is a golden subject).
- **Parsimony**: net LOC ≤ +20; OptionSelector API unchanged; `pencilConfig.ts` unchanged.
