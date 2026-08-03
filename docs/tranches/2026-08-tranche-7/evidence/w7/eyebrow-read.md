# W7 · the eyebrow's two registers, rendered — CH-59 / T7-R15

**Row**: "The eyebrow read (CH-59 / T7-R15)" — the one chair-adjudicated read the row's been owed
for four closes. **This file states what the two registers are, where each is used today, and what
each costs. It carries NO verdict — the chair writes that.**

**Surface**: the dev server (vite, `web/frontend`, port 4238), chromium, DSF 2, 1440×900 (the rail)
and 390×844 (the portrait sheet, drawer open), light and dark. Board pinned `?size=3&difficulty=EASY`.
**Rig**: `rig/eyebrow-register-capture.mjs`; every measurement below is read off the same session as
its crop and banked in `eyebrow-register.json`.

## The two registers, as declared

| | **register 1 — the display eyebrow** | **register 2 — the washi tape** |
| --- | --- | --- |
| declared at | `assets/typography.css:261` (`.section-heading`) | `pencil/sheet/SheetWashiLabel.vue:141` (`.washi-tag`) |
| face | `--font-display` (Fraunces) | `--font-hand` (Patrick Hand) |
| rung | `--type-subheading` 1.272rem (√φ) → `--type-heading` 1.618rem (φ) at ≥768 | `--type-caption` |
| measured | **25.888px / 800** at 1440, **20.352px / 800** at 390 | **14.384px / 500** at 1440, **12.179px / 500** at 390 |
| paper | none — ink on the card | `--sheet-washi-neutral`, seeded torn ends (clip-path), seeded ±1.5° tilt |
| placement | in flow, centred <768, left + 0.75rem ≥768 | absolute, astride the well's drawn top-left edge (`translateY(-52%)`) |
| casing | `text-transform: lowercase`, CSS only | `text-transform: lowercase`, CSS only |
| a11y | a heading (`<h2>`, or the `<span>` inside `<h2 class="mobile-heading-head">` on the tabs) | the well's accessible name via `aria-labelledby`; drops `role="tooltip"` |

The card runs a third rank under both — `.zone-row-label` (`marks`, `candidates`): the hand, caption
rung, weight 400, **no paper**. And the option chips it all captions sit at **Fira Code 20px** on the
rail, 16px on the phone. The shipped ladder at 1440, top to bottom: eyebrow 25.9 → chip 20 → tape
14.4 (on paper) → caption 14.4 (bare). Eyebrow:tape is **1.80×** on the rail, **1.67×** on the phone.

## Where each is used today

**Register 1 — two names per game, ten across the five specs**, and they're all `Size` + `Difficulty`
(`sudoku/spec.ts:47,55` · `futoshiki:63,71` · `thermo:63,71` · `killer:66,74` · `kenken:69,77`; the
record's "Size/Board Size" phrasing is stale — no `Board Size` string survives at head). Three render
sites, one tree since F3's collapse: the mobile tab label (`GameControlPanel.vue:605`), the desktop
staged rail (`:631`), the single-section heading (`:643`).

**Register 2 — four wells**: `new game` (`GameControlPanel.vue:570`), `pencils` (`:745`), `teacher's`
(`:805`), `players` (`:841`).

**Both registers also run on a second surface**, the gallery's staging slip — and there they've already
half-merged. `StagingBand.vue:130` lays the *same* component, text and seed (`new game`, seed 13) as
the drawer's well, so register 2 is byte-identical across surfaces. But `:140`/`:154` take register 1's
CLASS and then pin two of its properties back (`:259`): the face to `--font-hand` and the size to
`--type-small` — because Fraunces' cut carries no `v` for `level`, and the chips that axis captions are
pinned to the body rung. So on the gallery, register 1 is already the hand.

## What the crops show, measured

Both mocks were rendered on the running app and proved live before each shot (`proof` in the JSON).

| | card height 1440×900 | card height 390×844 | mixed-face names |
| --- | ---: | ---: | --- |
| **shipped** (2 eyebrows + 4 tapes) | 1105.86px | 654.98px | none |
| **A** — the eyebrow absorbs the tape (6 eyebrows) | **1241.27px** (+135.41, +12.2%) | **763.83px** (+108.85, +16.6%) | **3 of 4**: `pencils` and `players` miss `p` (U+0070), `teacher's` misses `'` (U+0027) |
| **B** — the tape absorbs the eyebrow (every name at the tape rank) | **1083.83px** (−22.03, −2.0%) | 654.98px (±0.00) | none |

Three things the pixels say that the numbers don't:

- **A restores the flat rank the zone grammar was cut to remove.** `new game` and `size` land at the
  same rung, stacked, one above the other — six co-equal display names, which is the grammar
  `GameControlPanel.vue:325-337` names as the owner's "contrived."
- **A's subset debt is visible, not theoretical.** `eyebrow-register-A-detail-1440x900-light.png`:
  the `p` of `pencils` is Georgia mid-word against Fraunces' `encils`. Fraunces' cut is 28 codepoints
  taken from the strings it paints today; the well names have never been among them. This is the same
  woff2 re-cut the owner declined at P1-W3 (the standing T7-R10 / P1-D7 row), not a new cost.
- **B leaves the card with no name above the chips.** Every name renders at 14.4px against 20px
  options, so the loudest ink in the card becomes the answers rather than the questions. On the phone
  it buys nothing either — the tab row's height is set by other content, so B is ±0.00px there.
  What B does buy is one grammar: every name on the card is a strip of tape, and the taxonomy reads as
  one system with the gallery slip.

Register 2 is also constructionally bound to a drawn frame — the tape *straddles* a well's stroke.
In B, `size` and `difficulty` have no frame to straddle, so they sit in flow inside the `new game`
well and read as tape laid on the sheet rather than on a compartment (visible at
`eyebrow-register-B-1440x900-light.png`, the two tapes stacked under `new game`'s).

## What a ruling would touch

- **Source**: `GameControlPanel.vue` (:570/:605/:631/:643/:745/:805/:841), `assets/typography.css:261`
  or `SheetWashiLabel.vue:141`, and `StagingBand.vue:130/:140/:154` if the ruling is meant to hold on
  the gallery too.
- **Gates**: `e2e/zone-grammar.spec.ts:55` (rail) and `:541` (coarse card) pin **2 eyebrows / 4 tapes /
  2 captions** by rank *and* text. Their rank function reads the CLASS (`.section-heading` → eyebrow,
  `.washi-tag` → tape), so a pure restyle passes them untouched while a structural move reds them —
  worth knowing before a disposition is written either way. `GameControlPanel.test.ts:268` pins the
  eyebrow texts; the three `announced === drawn` rows are register-independent.
- **The one-string law is orthogonal.** Pass 7 deleted `ControlSection.ariaLabel` and its three
  bindings, so the AT name IS the drawn ink in both registers already; whichever register wins, that
  holds.

## The record's own disagreement, since the disposition has to cite something

`pass5-registry.md:457-479` states the row as a TYPE question — "whether one card should run two
naming registers at all, or whether one should absorb the other" — and leaves it open.
`pass7-registry.md:407-411` and `:435` mark 9b **CLOSED**, and what pass 7 measured and ruled was the
second-literal question: the optional `ariaLabel`, deleted, born-RED, verified. Both entries are in
the record. The T7 audit read the type question as still unterminated and folded it here; this file
is the material for that reading, and nothing in it decides between the two entries.

## Crops

| file | what |
| --- | --- |
| `eyebrow-register-shipped-{1440x900,390x844}-{light,dark}.png` | today's mix — 2 eyebrows, 4 tapes, 2 captions |
| `eyebrow-register-A-{1440x900,390x844}-{light,dark}.png` | one register: the display eyebrow |
| `eyebrow-register-B-{1440x900,390x844}-{light,dark}.png` | one register: the washi tape |
| `eyebrow-register-{shipped,A,B}-detail-1440x900-{light,dark}.png` | tight on the `pencils` well — read the face off it |
| `eyebrow-register.json` | per-shot clip, proof, name census (face/rung/weight/paper) and the subset arm |
| `rig/eyebrow-register-capture.mjs` | the rig, both mock stylesheets verbatim |

**Method, disclosed.** The two registers were rendered by an injected stylesheet, **not** a source
edit: W7 has several executors inside `GameControlPanel.vue` at once, and a temporary template edit
plus revert in a shared dirty tree races a sibling's write. The question is a type question — face,
rung, weight, paper — so the sheet renders it exactly on the real running app and touches nothing on
disk. `git status` on `src/` shows no change from this row; the three files that carry these
declarations were md5-identical before and after every run (`tree.stable: true`).

The crop also **unrolls** the card: `.controls-card` is a scrollport at both cells, so a plain viewport
crop shows the staged eyebrows and one tape with three wells below the card's own fold. The unroll
(`max-height: none`, the page top-aligned, the portrait sheet pinned to the viewport's top edge) is the
camera, never the subject — it changes no type declaration, and it's printed in the rig. Card heights
in the table are measured under it, so they're comparable to each other and not to a shipped
scroll-capped box. One consequence worth stating: the first pass of this rig lost its dev-chrome hide
to an HMR full reload from a sibling's save and banked a shot with the `fx` toggle in it. Every shot
here now injects its own sheet immediately before the shutter and proves it live off the DOM
afterwards, and each shot records the page's load count (`loads: 1` throughout).

---

## §VERDICT — the chair, 2026-08-03

**Two registers stand. The split is semantic, and the row closes TERMINAL.**

The pixels settle the type question the record left open: the two registers do different
jobs. Register 1 names AXES OF PLAY — `size`, `difficulty`, display-rank questions about
the game being configured. Register 2 names COMPARTMENTS OF THE SHEET — `new game`,
`pencils`, `teacher's`, `players`, tape laid astride a drawn well's stroke. Fraunces
speaks the game; the hand speaks the sheet. That's not two systems fighting — it's one
taxonomy with two kinds of thing in it, and the shipped ladder (eyebrow 25.9 → chip 20 →
tape 14.4) reads in the right order: question, answer, compartment.

**A is refused on three counts, each visible in its own crops:** +12.2%/+16.6% card
height; the flat co-equal rank restored — six display names stacked, the exact grammar
`GameControlPanel.vue:325-337` records the owner calling contrived; and the subset debt
made flesh (`pencils` opening on a Georgia `p` mid-word — the woff2 re-cut the owner
already declined at P1-W3, T7-R10/P1-D7).

**B is refused on two:** it leaves the card with no name above the 20px chips, so the
loudest ink becomes the answers rather than the questions; and it transplants the tape
off its constructional ground — `size` and `difficulty` have no frame to straddle, so
the register that MEANS "label on a compartment's edge" degrades to tape lying on the
sheet, which is the tape lying about what it's on.

The gallery's half-merge stands as the pragmatic pin it is (Fraunces carries no `v`;
the chips pin the rung) — a cited exception, not a leak in the ruling.

**The record's disagreement resolves with a split cite:** pass5-registry.md:457-479's
TYPE question is the one folded into this row and it closes HERE, on this file;
pass7-registry.md:407-411/:435's 9b-CLOSED stands for the second-literal (ariaLabel)
question it actually measured. DISPOSITIONS' restamp at WGATE cites both halves.
CH-59 / T7-R15: no fifth deferral. This is the disposition.
