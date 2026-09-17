# 3A — THE LIVE-REGION CLASS IDIOM (T9-W3 §3.4)

Five sites, one mechanism, one gate, and the record's admission spent in the same tree.

## What was wrong, stated once

A live region announces MUTATIONS TO ITSELF. A region that enters the document with its
sentence already inside it has nothing to announce; a region that leaves the document at the
moment its subject changes cannot announce anything either. Both shapes read as correct
markup, both are silent, and that is why the estate landed the same defect three times in
three waves:

| site | born under | held at birth | never spoke |
| --- | --- | --- | --- |
| `players-status` | `v-if="!session.live"` | `connecting…` | the wire coming up |
| `players-alone` | `v-if="aloneInRoom"` | its whole sentence | a room of one |
| `players-roster` | `v-else`, `role="log"` | rows | the 0→1 arrival — T7-W2 cured 1→2 four lines away |

Third occurrence, so the CLASS bought a mechanism rather than a third local patch.

## The idiom

`web/frontend/src/composables/useLiveRegion.ts` — 65 lines, three clauses, and every site holds
all three.

- **BORN EMPTY** — the text starts `""` no matter what the state already says. An
  already-true source is read one flush LATER (`onMounted`), so its first word arrives as a
  change to a node the AT is already watching. This is the 0→1 clause, and it is the one a
  local patch never gets right because reading the source eagerly is the obvious thing to write.
- **PERSISTS** — the ELEMENT is unconditional for the whole life of the state it narrates; the
  CONTENT is the conditional half.
- **EMPTIES** — a region with nothing to say holds `""`, so nothing stale can be re-read, and
  at a drawn site it can leave flow and cost no pixels.

Two entry points, one mechanism: `useLiveRegion()` for utterances (an event speaks),
`useLiveRegion(() => …)` for narration (a state speaks). The persistence clause is markup, not
code, so it cannot live in the composable — it is policed statically instead.

The three well regions moved OUT of `v-if="session.roomId.value"` entirely: a region that
mounts at the same beat the room comes up is born populated all over again. `leave` is the only
thing left under that condition. The gallery's two regions had the shape right since T5-W3 and
are now INSTANCES of it rather than a second hand-rolled copy — which is the actual lesson, the
well repeated the defect because the cure lived in one file as a habit instead of anywhere as a
mechanism.

## Born-RED, measured before any cure

- `idiom-born-red-panel.txt` — the panel battery against the PRE-CURE tree: **8 of 9 rows RED**,
  each on the mechanism rather than on a string. `.players-status is not mounted: expected null
  not to be null`; `expected <p class="players-status">connecting…</p> to be null` (the node
  identity row — the region the AT was watching was a DIFFERENT node); the roster's 0→1 row red
  beside its 1→2 row green, which is the T7-W2 residue exactly.
- `idiom-green-at-head-gallery.txt` — **GREEN AT HEAD, 5/5, and it is banked as green rather
  than dressed as a red.** The gallery already held the idiom; its rows are a REGRESSION FENCE
  proving the convergence onto the shared composable changed no behaviour, not a cure.
- `idiom-police-plant-RED.txt` — the police against HEAD's own pre-cure source: **2 findings**,
  `:1017` and `:1100`, each naming the sentence it found sitting in the birth markup.
- `idiom-police-GREEN.txt` — the same police on the cured tree: 8 regions declared across 5
  files, **0 born speaking**, plus its own two-colour self-test (planted violation → RED,
  cured control → GREEN) which runs on every invocation.

## π LAW — MEASURED, NOT ARGUED. Zero pixels move.

`idiom-pi-ablation.txt`. The cure makes three regions permanent, so the pre-cure DOM for any
state is exactly this DOM minus the regions holding no text — removing them at runtime
reconstructs the before, in the same browser, in the same paint. No second tree, no
re-baselined golden.

The trap this had to clear is written in the estate's own CSS at `GameControlPanel.vue:1714`:
Tailwind v4 ships `sr-only` in the `utilities` LAYER, scoped SFC rules are UNLAYERED, and
unlayered beats layered at any specificity — so `.players-status`'s `margin: 0.35rem 0 0`
does survive the utility. It does not matter, and the measurement is why: `position` is
uncontested at all three sites, `absolute` wins, and an out-of-flow box's margin cannot reach
its siblings.

Measured at 1280×800, both engines, two states, ~240 rects per state:

| state | regions empty (= absent pre-cure) | card rect | scrollHeight | layout Δ |
| --- | --- | --- | --- | --- |
| A · no room | all three, each `position:absolute` 1×1px | identical | 1142 → 1142 | **0.000px** |
| C · live, room of one | `players-status` | identical | 1197 → 1197 | **0.000px** |

With a NEGATIVE CONTROL that proves the instrument is not blind: a no-op re-probe in chromium
state A moved 4 rects on its own — `dt-pose` / `boil-pose` `<g>`s, the boil swapping
pre-rastered variants on its own clock. The treatment moved those same 4 and no others. The
connecting state is covered by construction: state A already measures the empty roster in the
identical 1×1 absolute pose it wears while the wire comes up.

**No DELTA to declare. No golden re-baselined.** The one non-pixel change is keyboard, and it
is a cure: the empty log drops `tabindex`, because a focusable box with nothing in it is a dead
stop on the tab route. T7-W2's WCAG 2.1.1 pairing is untouched — a populated roster is still
`tabindex="0"`, and an empty list has nothing to scroll.

## The gate, and the admission it spends

`web/frontend/scripts/check-live-regions.mjs` (222 lines, zero dependencies, browser-free) reds
an element whose OWN opening tag carries all three of: a live-region claim (`aria-live`, or
`role="status"|"alert"|"log"`), a birth condition (`v-if`/`v-else-if`/`v-else`/`v-show`), and
non-empty INITIAL content. Interpolations, conditional children and comments are stripped
first — they are not there at birth. It deliberately does NOT read ancestors: the cured
`players-status` sits inside a conditionally drawn well, and a rule reading ancestors would red
the cure. That case is decided by the unit rows that assert node identity across the
transition. No allowlist, by choice; the record instrument is where an admission gets written
down.

And that is where the same-commit law lands. `scripts/ledger-diff.mjs`'s `LIVE_REGION_ADMITTED`
carried two entries dated 2026-08-28 (T9-W5) because W5 could see the defect and could not
reach the fence to cure it. The cure went in and the SPENT arm went red on the same tree
(`idiom-ledger-admission-SPENT.txt`), so both entries came out with it. The list stays,
**empty**, so the next occurrence has to be written down by whoever admits it. `--assert-state`
now prints `LIVE-REGION — clean` (`idiom-ledger-diff-CLEAN.txt`); the run's `exit 1` is a
CH-69 PROBE finding in `csp-solver/tests/killer.rs`, another lane's file, unchanged here.

## Counts and greens

63 test files / 773 rows green; vue-tsc exit 0; prettier and eslint clean on all seven lane
files (`idiom-reverify-post-wall.txt`, re-run after the session wall). This lane adds **3 test
files / 18 rows** and **1 npm lane** (`lint:live-regions`), and takes
`web/frontend/scripts/*.mjs` from 21 to 22 — the README pin is the chair's to restamp.

## Handoffs — three, all out-of-fence seams with the literal text to land

- **3A-1** `.github/workflows/ci.yml` after :942 — the gate's CI step. `lint:lanes` is RED until
  it lands (`idiom-lanes-RED.txt`: `[1 UNCLAIMED SCRIPT]`), which is the lane gate correctly
  refusing a script no lane names.
- **3A-2** `e2e/multiplayer.spec.ts:370` and `e2e/join-language.spec.ts:158` — two rows assert a
  region's ABSENCE; they become `toBeEmpty()`. Both get stronger: an absent element proves
  nothing about what was said. Land in the cure's commit or they red.
- **3A-3** `web/frontend/README.md:53` (21 → 22 `.mjs`, doc-truth RED banked at
  `idiom-doc-truth.txt`) and a coverage note: the copy-register's JARGON arm reads template text
  and `COPY_KEYS`, and two product strings moved into `useLiveRegion(…)` narration sources. The
  DASH arm still sees them and nothing ships wrong today; what is lost is coverage of the NEXT
  edit, and lane 3C's §3.5 strings will be authored in the same shape.
