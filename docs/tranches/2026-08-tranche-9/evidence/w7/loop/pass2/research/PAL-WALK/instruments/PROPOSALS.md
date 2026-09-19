# PAL-WALK pass 2 — instruments whose SUBJECT this family moves

Proposals only. Nothing under `loop/r0/` or `loop/pass1/` is written by this lane; each row
below is reported **MOVED** and lands as a diff in the same change that lands the walk
(the house rule: a ruling lands with its enforcing config in the same commit).

---

## MOVED-1 · R6 law 22 + `law-probe.mjs` row L6

**Subject** `r0/r6-idiom-history/R6-census.md:102` (law 22) and `r0/r6-idiom-history/law-probe.mjs:114-126`
(row L6, a π row, GREEN at HEAD; the file exits 1 when a standing law is broken).

L6's assertion, verbatim (`law-probe.mjs:121-124`):

```js
const walk = /137\.5/.test(p) && /0\.11/.test(p);
const band = (css.match(/--peer-ink-l:/g) ?? []).length;
return { ok: walk && band === 2, detail: `golden-angle walk: ${walk}; --peer-ink-l arms: ${band}` };
```

On PAL-WALK's tree `137.5` and `0.11` are both gone from `playerIdentity.ts`, so L6 prints
`golden-angle walk: false` and the probe exits 1. **The law's substance survives the re-cut**
(a formula, not a palette; a banded lightness); only its two literals die.

Proposed re-cut, law 22:

> 22. **A player's ink is a FORMULA, not a palette: a golden step over the arcs `index.css` has
>     not already spent, at the largest chroma sRGB holds at both bands.** No palette to exhaust,
>     no player cap. `--peer-ink-l` 0.5 light / 0.8 dark. The reserved set is re-derived from the
>     sheet by `scripts/check-peer-arcs.mjs`, never hand-kept. T6 mark 13 · T9-W7 §11c,
>     `playerIdentity.ts`.

Proposed L6 assertion — **it must not become a second name-list** (see MOVED-3):

```js
const formula = /golden|STEP|hueAt/.test(p) && !/0x|#[0-9a-f]{6}/i.test(p); // a formula, no hexes
const band = (css.match(/--peer-ink-l:/g) ?? []).length;
return { ok: formula && band === 2, detail: `formula walk: ${formula}; --peer-ink-l arms: ${band}` };
```

Negative control the re-pin owes: replace `hueAt` with a literal hue table in a scratch copy and
show L6 reds. Without it the re-pin is a gate re-worded to pass.

---

## MOVED-2 · `r0/r2-accent-family/probe/accent-kinship.probe.ts`

Two separate moves, and the first is a hazard to every lane, not just this one.

**(a) `OUT` is an ABSOLUTE r0 path** (`accent-kinship.probe.ts:62-63`):

```ts
const OUT =
  "/Users/…/evidence/w7/loop/r0/r2-accent-family/census";
```

Running this file from anywhere overwrites `r0`'s banked census — which is how
`exception-toll.json` was clobbered in pass 1. Any lane that runs it copies the file into its
own `instruments/` dir and re-points `OUT` FIRST:

```ts
const OUT = join(fileURLToPath(new URL(".", import.meta.url)), "../readings");
```

**(b) The peer-walk block hardcodes the shipped formula** (`accent-kinship.probe.ts:300-303`):

```ts
probe.style.setProperty(
  "color",
  `oklch(var(--peer-ink-l) 0.11 ${((i * 137.5) % 360).toFixed(1)}deg)`,
);
```

This is the same decoy class as `check-peer-arcs`: the probe asserts a property of a string it
wrote itself, so it stays GREEN whatever `playerIdentity.ts` emits. Proposed re-pin — ask the
PAGE for the module's own inks, which the pass-1 prototype already proved works
(`pass1/prototype/PAL-WALK/probe/palwalk-proto.spec.ts` imports the real module in page
context):

```ts
const inks = await page.evaluate(async (n) => {
  const m = await import("/src/games/shared/playerIdentity.ts");
  return Array.from({ length: n }, (_, i) => m.inkFor(i)["--color-user-ink"]);
}, 40);
// …then paint each `inks[i]` on the probe instead of a re-written formula.
```

The row's ASSERTION (peer worst ≥ 4.5 over 40 on `--color-card`) is unchanged and still passes:
re-pointed at the module in pass 1 it read **5.59** against HEAD's 5.36.

---

## MOVED-3 · `web/frontend/scripts/check-peer-arcs.mjs` (the family's own new gate)

Not an r0 instrument — this file is the family's, minted in pass 1 — but it is proposed for
re-cut here because the critique's mutation proof and this lane's §B measurement are two
independent failures of the same file.

1. `check2LawHolds` (`check-peer-arcs.mjs:156-170`) calls `walk(declaredArcs(ts), n)` —
   it re-derives its OWN walk and never asks the module. `STEP = 0.5` → exit 0 (critique §2a).
2. `RESERVED_TOKENS` (`:47-48`) is a hardcoded NAME list. It covers HEAD exactly (measured:
   29/29, zero chromatic tokens missed), and it is blind to both accent families' renames —
   under ACC-SIX's pass-1 diff the walk it green-lights lands **0.47°** from `--color-answer-pale`
   (`readings/coupling.txt` §B).

The re-cut is a TIERING, not a rewrite (see `README.md` §5). This file keeps tier 1 only —
"every chromatic token in the sheet is inside a declared arc" — with the name list replaced by
a chroma threshold so a rename cannot hide a hue.

---

## RETIRED · the 0.5° hue-exactness gate

The 8-bit round trip alone moves painted hue by up to **0.960°** (light, i=119) and **0.750°**
(dark, i=46), identical in both engines (`readings/measure.txt` §6). No design can meet 0.5°.
It is retired in favour of the painted-law gate, which is the honest statement of the same
intent. Retirement is a deletion with its reason in the commit, not a loosened number.
