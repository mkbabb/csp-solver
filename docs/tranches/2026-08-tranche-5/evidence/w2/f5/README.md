# T5-W2 F5 — FAIL-EXPLICIT · THE 0.11 ADOPTION · THE QUARANTINE COMES OFF (moves 2.4 + 2.8 app-side)

**Lane** Opus, under the Fable team lead · **opened/closed** 2026-08-02 · **base** `e63af853`
(working tree carrying F1 + the three F2 lanes + F3 + F4) · **tree** working, uncommitted — the
lead commits.

The charter of record is `../wave-open.md` §2 rows 2.4a–2.4d and 2.8, §3's π schedule, and the
upstream bank at `../pencil-boil-0.11/`. This directory is the fail-explicit lane's evidence.

| File | What it holds |
|---|---|
| `00-before.txt` | the born-RED bank — every census failing, measured before a line of F5 |
| `10-tier-source-born-red.txt` | **the 2.4a experiment at HEAD**: 3/hard parked, build exits 0, artifact indistinguishable from a deliberate excision |
| `20-pi-exit.txt` | the four goldens on the final tree, the dist md5s they were taken against, and the one π red this lane caused |
| `30-dequarantined-throttle.txt` | the 39 built-dist rows the park had covered, green on darwin in both engines |
| `40-tier-source-green.txt` | the cure, with **three** negative controls — lost bank · stale declaration · unnamed bank |
| `50-censuses.txt` | every gate figure re-derived, plus the twin claim measured rather than inherited |
| `60-e2e-and-fences.txt` | the 227-test default suite, the codec specs, and the fence diff whole |
| `70-files.txt` | the file ledger, by move |
| `90-exit-gates.txt` | π · unit · tsc · build · lint:catch · boundary · eslint · knip · prettier · golden-bytes · prod-shake · font-coverage · ink · theme-tokens · support-floor · pw-projects · pw-retries |

---

## What landed

| | before | after |
|---|---|---|
| a lost `sudoku_puzzles/{n}/{d}` directory | **the build exits 0** and emits the same bytes as a deliberate excision | the build **throws, by name** — and so does a stale declaration, and so does an unnamed bank |
| which tiers ride the bank | inferred from `existsSync`, masked at read by `TEMPLATE_BANK[n]?.[…] ?? []` | **declared** in one `TIERS` table, checked against the disk both ways, read through `tierSource(n, d)` |
| `@mkbabb/pencil-boil` | `^0.10.1` | **`^0.11.0`**, lockfile and installed tree agreeing, registry shasum matching the upstream bank |
| `try { h.stop() } catch { /* ignore */ }` | **11** | **0**, with `npm run lint:catch` in CI so it cannot grow back |
| the `ImageBitmap` → re-draw → re-encode → close round trip | 3 exported helpers, 3 surfaces, 2 token machines, 5 revoke sites | **gone** — `useRasterStack` mints the URLs and owns them; the app holds one 12-line retention read |
| `createGlyphDrawIn` | a 44-line copy of a library export | **deleted**; `createStrokeDrawIn` at both call sites |
| the linux-WebKit bake quarantine | 174 lines + 2 imports + 2 calls, parking 20 rows | **deleted whole**; the rows speak, linux CI judges |
| an untagged `?board=` body | **decodes** — "the graceful ratchet" | fails closed, like every other malformed link |

## THE TIER TABLE IS THE RECORD, NOT THE DIRECTORY LISTING

The defect 2.4a names is not that a directory can go missing. It is that **a loss and a decision
emitted identical bytes**. `vite.config.ts` wrote an empty tier for both, and `useSudoku.ts` read
both through `?? []`, so `git rm`-ing the one bank sudoku actually needs would have shipped a
silent live-gen regression on the one tier live generation breaches the in-browser budget for.

So the cure is a declaration, and the declaration is checked in **three directions**, each with
its own transcript in `40-tier-source-green.txt`:

| Control | What it does | What the build says |
|---|---|---|
| a `bank` tier's directory is parked | the born-RED experiment, re-run | `tier 3/hard is declared \`bank\` but …/3/hard holds no template-*.json` — exit 1 |
| a `livegen` tier grows a directory | the same defect facing the other way — the bank moved, the table is stale | `tier 3/easy is declared \`livegen\` but …/3/easy holds 1 template-*.json` — exit 1 |
| a bank appears under an unnamed size | a bank that would ship nothing | `5/hard exist on disk but no TIERS row declares them \`bank\`` — exit 1 |

`SIZES` is now every size the picker offers (`subgridSizes` 2/3/4), not just the banked ones. The
old table said `[3, 4]`, so N=2 — a size the UI deals — was not a declaration at all, just an
absence that `?? []` happened to survive. It is now `livegen` because someone said so.

## THE 0.11 ADOPTION, AND THE ONE THING THE APP STILL KNOWS

0.11's `useRasterStack` reads its own capture canvas through `rasterizePoseToBlob()` and hands
back object URLs it owns (`RasterStackHandle.urls` — "never revoke these"). Everything the three
baked surfaces did between the bitmap and the `<image>` was that round trip: re-draw into a
second surface, PNG-encode it, `close()` the redundant bitmap, mint a URL, revoke the old set,
and run a monotonic token to drop a superseded conversion. All of it is deleted — `rasterPose.ts`
loses its whole encode half, and the three surfaces lose their watchers, their tokens and their
`onUnmounted` revokes.

What survives is the one thing the library cannot know: **when to hold a set across the null
window.** `urls` goes null for the duration of a re-bake, and a surface that reads it directly
drops to the live-filter fallback for a re-tint it could have ridden through — a visible flash
mid-Bloom. All three surfaces already retained; the policy is now stated once, in
`retainedPoseUrls(handle, resetKey?)`, and it is a **read, never a copy** — nothing is minted, so
nothing must be freed. `resetKey` carries HandDrawnGrid's structural escape: a board-size change
is not a re-tint, so its retained poses carry the wrong geometry and are dropped to the
frozen-pose path. Same behaviour as before, one home instead of three, zero lifetime management.

**π is the proof.** Four goldens, byte-stable on the built dist, no re-baseline — see below.

## THE SWALLOW CENSUS, AND THE LEAD'S §6.3 SCOPE QUESTION, ANSWERED WITH DATA

All eleven were `try { handle.stop() } catch { /* ignore */ }` against a contract pencil-boil did
not state until 0.11.0, where `stop()` cannot throw in any lifecycle phase — before start,
mid-flight, from inside its own tick, after completion, twice, after a central PRM clear, after
teardown, and under a host whose `cancelAnimationFrame` throws (`proofs/stop-contract.proof.ts`,
26 assertions, negative control included). Adopting the contract is the cure. Each site is now a
bare `stop()`.

The enforcing config lands in the same commit, and it is **not** the obvious lint row, because
the obvious lint row was tried and measured:

- core `no-empty` never saw these — a block holding a comment is not empty to it, and all eleven
  held `/* ignore */`;
- `no-restricted-syntax` on `CatchClause[body.body.length=0]` **was landed, run, and reverted**:
  it reds 11 *honest* sites in this estate whose catch bodies hold a real sentence and have no
  statement to write — eight `localStorage` best-effort writes across the five persistence
  modules, `useControlsDrawer`, `useStagingBridge`, and the logo's filter-defs read.

Neither instrument measures the ruling, so the ruling carries its own:
`scripts/check-empty-catch.mjs` (`npm run lint:catch`, wired into `ci.yml` beside `lint:ink`,
self-tested). **The rule: a catch body runs a statement OR says something.** `/* ignore */` says
nothing; a bare `catch {}` says less.

**SCOPE — decided, and the decision is the strict one.** All of `src`, `src/pencil/dev/**`
included. A dev-only swallow is still a swallow, and a rule with one file's carve-out is the
config-flag disease this estate keeps deleting. The single dev site — FilterTuner's hand-typed
offsets parse — now reports on the dev channel the whole panel already lives on; a half-finished
array mid-edit still holds the last good value, it just says so. The lead may narrow the rule to
exclude `dev/**`; narrowing costs that one row and nothing else.

## THE QUARANTINE CAME OFF BECAUSE IT WAS BUILT TO

W1's park read `web/frontend/package.json` at spec load and **threw** once the declared
`@mkbabb/pencil-boil` range reached `>=0.11.0`. Declaring `^0.11.0` and leaving the file in place
would have redded every parked row by design, so the bump and the removal are one act: the helper
is deleted whole, both imports and both call sites are gone, and both specs' headers now say the
park is over and why.

`30-dequarantined-throttle.txt` shows the 39 built-dist rows green on darwin in **both** engines,
including all 20 that were parked. That proves the de-quarantining broke nothing here. It cannot
judge the defect: the class was ubuntu+WebKit only and **nondeterministic per run per game**
across three runs. **Linux CI is the judge.** The lead pushes; if ubuntu-webkit still blanks, the
re-quarantine — re-pinned, against a fresh run id — is the lead's call, not this lane's.

## THE v0 RATCHET'S LAST TWO CONSUMERS WERE BOTH TEST FIXTURES

That is the measurement, and it was not sought — it arrived as a π red. With the ratchet gone,
`grid-corner-light` failed on the first run of the final tree, because `visual-golden.spec.ts`'s
own `encodeSudoku` wrote an **untagged** body: the pinned board opened only through the arm 2.4d
kills, so the golden captured a random deal. `permalink.spec.ts`'s six encoders did the same.
Nothing in production ever wrote one. Both fixtures now write the version byte the app writes,
and `permalink.spec.ts` gains a seventh row that sends the old untagged body deliberately and
asserts it fails closed — chromium and webkit, green.

`readCodecVersion` is now four lines in both codecs: the byte is mandatory, an empty payload
reads `NaN` and fails on the same comparison, and `VERSION_BYTE_FLOOR` is gone. There is exactly
one accepted wire format.

## 2.8 — ONE TWIN, TWO NON-TWINS, MEASURED

The wave-open row asserts three verbatim twins and a `0 · 0 · 0` green. **One is verbatim.** The
charter's own π schedule rules on the other case in advance: *"the draw-in twin swap is verbatim,
so a moved pixel means the twin isn't one."*

- **`createGlyphDrawIn` → `createStrokeDrawIn` — SWAPPED.** Same dash setup, same
  `createSequenceSubscription`, same `easeOutCubic`, same 350 ms default, same settle-to-`none`
  written against the same approximate-`pathLength` defect. The differences are option names and
  the PRM return (`null` vs an inert handle), and the inert handle reaches the identical end
  state at both call sites — checked line by line. The 44-line copy is deleted.
- **`generateRectBoilFrames` vs `boilRectFrames` — NOT A TWIN.** The app function takes `radius`
  and `grain`; the library function takes neither. `HandDrawnOutline.vue:115` passes both, live.
  The perturb strides differ too (`f*997` vs `f*1013`). Swapping deletes the jittered corner
  joins and the baked grain and re-seeds every frame — a pixel change on a load-bearing surface.
- **`arcBoilPoints` vs `ellipsePoints` — NOT A TWIN, and not the same shape.** A partial arc with
  a jitter amplitude floored at 0.75 (T3-W12 §3) is not a closed ring with a seeded past-2π
  overshoot and no floor.

**LEAD'S ROW:** restamp 2.8 to the measured shape, or hand the two rows to a lane licensed to
move the grid frame's pixels. The `0 · 0 · 0` green is not reachable without moving pixels, and
§3 forbids that.

## π

Four goldens, the built dist, one tree state, no rebuild between arms, `:4188`.

- **NO GOLDEN RE-BASELINED** — `e2e/goldens/` byte-untouched, all 8 files.
- The three load-bearing surfaces — `cell-light`, `grid-corner-light`, `logo-light` — **9/9**.
- `toggle-crest-dark`, the charter's declared non-convergent row on which no π claim rests: red
  once in nine batch runs under 4-worker contention, then **10/10** run alone. Reported, not
  claimed.
- The one red this lane caused was the fixture, not the pixels — see the ratchet section.

## Counts at exit

unit **349** (30 files; 348 at F4 exit, +1 — the sudoku ratchet row became two) · e2e **227** in
the default config (225 at F4; +2, the new untagged-body row × 2 engines) · `vue-tsc -b` 0 ·
build green · `lint:catch` 0 with its negative control · boundary 0 · eslint clean · knip 0 ·
prettier clean · golden-bytes 8/110 KB band · prod-shake pass · font-coverage pass · ink ladder
pass · theme-tokens 0 with its negative control · support-floor 0 violations (the two Safari<14
shims stayed dead) · doc-truth **0 RED / 13 GREEN**.

## What this lane owes the lead

1. **2.8's twin claim** — one swap landed, two refused on measurement. Restamp or re-lane.
2. **`no-empty-catch` scope** (the lead's §6.3 row) — decided strictly, all of `src` including
   `dev/**`, with the reasoning above. Narrowing is a one-row change.
3. **The fence** — `GameGallery.vue` moved 6 lines, and only the 2.4b unwrap the wave-open roster
   itself counts. Whole diff in `60-e2e-and-fences.txt`; the other two fenced files are 0 lines.
4. **Linux CI is the quarantine's judge** — the push is the lead's, and so is any re-pin.
5. **`gallery-deal.spec.ts:432` is dev-server-bound** by its own fixture (it routes on a source
   module path). Correct for its config; worth knowing before anyone re-points the default suite
   at a dist. F2's line, not cured here.
6. **The permalink universalisation is NOT in this lane.** 2.4d as charged here was "the v0
   ratchet dies", and it did. The wave-open's wider 2.4d clause — a current-version body
   round-tripping **for all five games** — still needs the V1-STUB collapse: `thermoUrlState.ts`,
   `killerUrlState.ts` and `kenkenUrlState.ts` remain empty-body no-ops (`writeShareUrl`,
   `dropBoardParam`, `syncToUrl`), and `boardLink` is hard-coded `"absent"` in all three. That is
   the owner-ratification row (§1.4.1), and it is unclaimed.
