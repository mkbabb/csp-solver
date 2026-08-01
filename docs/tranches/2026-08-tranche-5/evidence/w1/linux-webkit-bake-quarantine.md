# T5-W1 · the linux-WebKit blank-bake quarantine

Seal-fix on row 1.6. The revocation of the T4-era linux `test.skip`
(`wordmark-hoist-and-retries.md` §2) held, and it published a real defect on the first runner
pass. This is the explicit quarantine that row's own re-entry criterion demanded — *"an
explicit quarantine against a named run id, never a silent skip"* — plus the mechanism that
removes it.

Verification: `quarantine-darwin-verify.txt` (arm V live, arms Q1/Q2 canary).

---

## 1 · The class

**linux-WebKit blank bake, non-sudoku games.** On ubuntu + WebKit only, the pose bake decodes
to an entirely transparent bitmap for SOME games — not all of them, and not on any other
surface. `sudoku` and `thermo` ink normally on the same runner, in the same engine, off the
same page; chromium inks all five; darwin inks all five in both engines
(`wordmark-inked-GREEN.txt`, and 26/26 again here).

Two things this measurement kills. It is **not** the "unreproducible engine artefact" the
T4-era note recorded — runs 30719165442 and 30719158513 red the identical rows at
`retries: 0`, which is a deterministic defect with a per-game shape. And the skip that hid it
wasn't covering a ghost: it was swallowing a live product-adjacent red on the one platform CI
runs, for a tranche. Revoking it was right; what follows is the bill.

## 2 · The quarantined rows — exactly the observed reds

| spec · line | row | project | verdict that reds |
|---|---|---|---|
| `wordmark-integrity.spec.ts` :158 G3.4 | `futoshiki` | `wordmark-webkit` | edge-clip — "baked ink must sit inside its own W×H bitmap on all four edges", the fused verdict's `no-ink` term |
| `wordmark-integrity.spec.ts` :158 G3.4 | `kenken` | `wordmark-webkit` | same |
| `wordmark-integrity.spec.ts` :158 G3.4 | `killer` | `wordmark-webkit` | same |
| `theme-bake-freshness.spec.ts` :223 G4.5 | `futoshiki` × both directions | `theme-bake-webkit` | "fresh load: the logo bake decoded to nothing" (`logoInk === "no-ink"`) |
| `theme-bake-freshness.spec.ts` :223 G4.5 | `killer` × both directions | `theme-bake-webkit` | same |

Seven rows, and the census is closed — `QUARANTINED_ROWS` in
`web/frontend/e2e/linux-webkit-bake-quarantine.ts` is the whole of it.

`theme-bake-freshness` runs each game twice off that one declaration at :223, once per toggle
direction, and the observed reds name games rather than directions. Both directions of a named
game are parked, and the reason is in the failing assertion: the red lands on the **pre-toggle
fresh-load control**, which no `colorScheme` can reach. A direction-split census would claim a
distinction the instrument can't make.

Named runs, both: **30719165442** and **30719158513**, on `e6b19a4c`, ubuntu · webkit,
`retries: 0`, same rows both times.

## 3 · Loud, not silent — what the parked arm still does

`test.fixme(true, message)`, and the message is the whole point. Every parked row:

- **prints** the notice into the runner log (`console.log`) — the defect class, both run ids,
  the masked-since provenance, the cure owner, the declared version, and the record's path;
- **annotates** the report (`testInfo.annotations.push({ type: "quarantine", … })`), so the
  HTML artifact carries it too;
- **still bakes, still loads, still reads.** The call sits AFTER the read and after
  `attachBakeEvidence`, immediately in front of the assertion that reds. A parked row that
  hits a blank still ships its own pose PNG, href, intrinsic and font state. The class stays
  attributable while it's parked, which is the thing the T4 yield never did.

The one honest cost, stated: the quarantine is the only thing that now sits between the read
and the assert in `wordmark-integrity`, which is exactly the shape 1.6 argued against. It's
bounded to three named games, on one platform, in one engine, behind a version guard — where
the yield was five games, unconditional, and forever.

## 4 · Re-entry, mechanized

The guard reads the frontend's own `package.json` at spec load and throws — not warns — the
moment the cure's version is declared:

```ts
export function quarantineLinuxWebkitBake(
  spec: QuarantinedSpec,
  row: string,
  testInfo: TestInfo,
): void {
  if (process.platform !== "linux") return;
  if (!isWebkitArm(testInfo)) return;
  if (!QUARANTINED_ROWS[spec].includes(row)) return;

  const message = notice(spec, row, testInfo.project.name);

  // THE RE-ENTRY. Not a reminder — a red. The quarantine cannot survive its own cure.
  if (cureHasLanded(DECLARED_RANGE))
    throw new Error(`${CURE_LANDED_THROW}\n\n${message}`);

  testInfo.annotations.push({ type: "quarantine", description: message });
  console.log(`\n${message}\n`);
  test.fixme(true, message);
}
```

with

```ts
const CURE_VERSION = [0, 11, 0] as const;
const CURE_LANDED_THROW =
  "the W4b cure has landed — remove this quarantine and let the rows speak";

const DECLARED_RANGE: string = (() => {
  const pkg = JSON.parse(readFileSync(join(FRONTEND_ROOT, "package.json"), "utf8"));
  const range = pkg?.dependencies?.["@mkbabb/pencil-boil"];
  if (typeof range !== "string")
    throw new Error(
      "linux-webkit bake quarantine: no @mkbabb/pencil-boil in web/frontend/package.json " +
        "dependencies — the re-entry guard cannot read the version it is gated on, so the " +
        "quarantine does not stand. Fix the read or delete the quarantine.",
    );
  return range;
})();
```

**Cure owner: T5-W4b** — `@mkbabb/pencil-boil` 0.11's `rasterizePoseToBlob()` adoption
(`gates.json` W4.pencilBoil011; `waves/T5-W4-design.md` §W4b). That cure deletes the
`ImageBitmap` copy + PNG re-encode stage this blank lives in, so the cure and the removal are
one act: the wave that bumps `^0.10.1` → `^0.11.0` reds these seven rows on its own commit
until it deletes the quarantine with them.

Three failure modes are closed by construction, all loud: a missing dependency entry throws at
spec load; an unparseable range throws at spec load; a landed cure throws at the row. There is
no path where this file silently outlives its reason — which is the trap→config discipline
(lessons rule 7) applied to the trap that produced it.

## 5 · The spread detectors — why the passing rows stay fully live

Nothing outside §2's census is touched. Live everywhere, on every run:

| still live | what it detects |
|---|---|
| `sudoku`, `thermo` — both specs, linux + webkit | the blank widening to the games that currently ink. These two are the reason the class is *"some games"* rather than *"WebKit on linux"*; if either goes, the class was mis-stated and the whole disposition reopens. |
| `kenken` — `theme-bake-freshness`, linux + webkit | the sharpest one. `kenken` reds in `wordmark-integrity` and PASSES in `theme-bake` on the same runner, so the two specs disagree about one game today. Parking it in both would have erased the disagreement — which is data about the mechanism, not noise. |
| all five — chromium, both specs | the engine boundary. A red here says the defect crossed engines and stops being WebKit's. |
| all five — darwin, both engines | the platform boundary, and the local instrument every lane runs. |
| every other verdict on the parked rows | nothing. A parked row is parked whole — the price of `test.fixme`, and the reason the census is three games and not five. |

The blanket linux yield bought silence on 5/5 rows in one spec and left four fifths of the
labels with no vacuity guard anywhere. This buys it on 7 of 26 built-dist rows, keeps 19 live,
and keeps the instrument that measures whether 7 is still the number.

## 6 · Verification (darwin) — `quarantine-darwin-verify.txt`

`npx playwright test wordmark-integrity theme-bake-freshness --config playwright-throttle.config.ts`

| arm | tree | expectation | result |
|---|---|---|---|
| **V** | as committed | the quarantine must NOT fire off-linux; every row runs and passes | **26 passed, 0 skipped, exit 0**, 13.7 s — zero `QUARANTINED` notices in the log |
| **Q1** | the helper's single `process.platform` sed to `"linux"`, restored byte-identical after (sha1 `464786a9…`) | park exactly the seven, nothing else | **7 skipped, 19 passed, exit 0**, 13.5 s — the seven are wordmark futoshiki/kenken/killer and theme-bake-webkit futoshiki/killer × 2 directions; every chromium row and every sudoku/thermo/kenken-theme-bake row live and green |
| **Q2** | Q1 **plus** `package.json` `^0.10.1` → `^0.11.0`, restored (`git diff` carries no residue) | the guard throws instead of parking | **7 failed, 19 passed, exit 1** — all seven carrying `the W4b cure has landed — remove this quarantine and let the rows speak` |

Q1 is the quarantine born-firing and Q2 is the removal forcer born-red. No linux run is
claimed from this host; CI at the seal is the linux proof, and the rows that matter there are
the 19 that stayed live.

## 7 · Files

| file | change |
|---|---|
| `web/frontend/e2e/linux-webkit-bake-quarantine.ts` | new — the census, the notice, the version guard, the throw |
| `web/frontend/e2e/wordmark-integrity.spec.ts` | import + one call between the evidence attach and the hoisted verdict; header records the quarantine and what the runner pass measured |
| `web/frontend/e2e/theme-bake-freshness.spec.ts` | import + one call inside `assertAgrees` (behind the attach, in front of the expects), `game` threaded through; header records the same |
| `docs/…/evidence/w1/linux-webkit-bake-quarantine.md` | this record |
| `docs/…/evidence/w1/quarantine-darwin-verify.txt` | arms V / Q1 / Q2 in full |

## 8 · Open for the team lead

1. **The disposition is a park, not a fix.** Nothing here explains WHY ubuntu-WebKit blanks
   `futoshiki`/`kenken`/`killer` and not `sudoku`/`thermo`. The per-game split is the live lead
   — label width is the only thing that obviously varies (`futoshiki` 472 px is the widest,
   but `killer` 287 px is the narrowest), so width alone doesn't order it and the attribution
   is unclaimed.
2. **`kenken` disagrees with itself across the two specs** (§5) and no one owns that. It is
   either a second mechanism or a timing margin, and it's cheap to attribute at W4b when the
   raster path is being rewritten anyway.
3. **Book the class in the chronic ledger** with both run ids, so the W4b cure has something
   to close rather than a quarantine to notice.

---

## SPREAD ADDENDUM (team lead, run 30720212628 on baae148b)

The spread detectors fired on their first outing: thermo and kenken redded theme-bake
fresh-load no-ink — rows green on both prior runs, same `retries: 0`. Three runs, three
different game sets ⇒ the blank bake is NONDETERMINISTIC per run per game: a readiness
race on the ubuntu-WebKit bake path, not a per-game defect. The "deterministic, not a
flake" claim in the first cut is CORRECTED by this observation — it held for exactly two
runs.

Disposition: the quarantine widens from the observed-row list to the CLASS — every game's
bake-decode read, both specs, ubuntu+webkit only. Cross-engine and cross-platform
detection stays at full strength (all chromium arms including linux, all darwin arms);
the single parked cell is ubuntu·webkit·bake-decode. Re-entry unchanged: the guard THROWS
at pencil-boil ≥0.11 — and the race hypothesis strengthens the W4b cure's claim
(rasterizePoseToBlob deletes the async ImageBitmap/PNG round-trip the race lives in).
The W4b watch row from the perf report (linux-webkit window long33=24 vs control 1) is
plausibly the same mechanism seen from the frame side.
