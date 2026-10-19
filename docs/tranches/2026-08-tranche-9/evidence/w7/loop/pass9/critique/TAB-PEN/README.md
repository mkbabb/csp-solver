# TAB-PEN · pass 9 · §12 the tab's pen — the critic's read

Critic of the pass-9 prototype (`pass9/prototype/TAB-PEN/`, bank `pass9.diff` sha1 `ad7af3d2`). I wrote neither the
charter nor the prototype. Everything below was re-derived on a `git archive` of the banked tree (`5c95b0a4`) and of
`1d0dc4fd` under my durable scratch, never on the lane's worktree, which I read only through a temporary index. The
number is mine (LAWS P8 §C).

## Numbers first

| row | the critic's reading |
|---|---|
| bank shas | `pass9.diff` 537,937 B sha1 `ad7af3d225ed…` · `pass9.delta.on-WAVE.diff` 100,015 B sha1 `9a602c31a91c…`: both equal BANKED.txt |
| `git apply --check` | **0** on `1d0dc4fd` (applied: tree `5c95b0a4` = BANKED) · **0** on `74a2b5d9` · the delta **0** on WAVE `acb9c08e` + `homes.on-WAVE` (`acde977b`), applied → `6a6c70e3` = BANKED · also 0 on the bare WAVE without the homes |
| worktree vs bank | temp index of `5c95b0a4` over the lane's worktree: `diff-files` empty, 0 untracked product files |
| contamination | the four contamination strings (the session scratch dir, the two temp roots, the durable scratch path): 0 hits in both banks; `+++` dot-paths: only `.github/`, `.gitignore` |
| homes v2 by sha | `1d0dc4fd` + `homes.diff` (`1f70cfda`) → tree `21617487`; its 13 home paths vs the bank tree: **0 residual** (`knip.json`'s one-line comment change from pass 8 is homes v2's own) |
| the pass-9 advance | pass-8 tree `41f2351a` → `5c95b0a4`: 15 files +4,128/−243, of which 12 are home paths (homes v2 moving from pass 8's v1); the lane's own: `check-favicon.mjs` +550/−74 (1,405 → 1,881 lines), `e2e/tab-pen.spec.ts` new (284), `ci.yml` comment |
| gate plain | a–e GREEN exit 0; mass 0.2295, tie 0.0010 / IoU 0.9942, blob 0 |
| `--self-test` | exit 0 · 71 RED as required · 8 GREEN as required · 22 EDGE PINNED · 0 FAILED (reproduces the lane) |
| `--threshold-battery` | 44/44 BITE, exit 0 (reproduces) |
| pass-8 plants FIRST (the pass-8 critic's `crit-plants.c8.mjs`, byte-identical copy, final gate) | E1–E6 RED 1 · **E7 GREEN 0** (source gate, by design) · E8/E9/E10 RED 1 · T1 RED d · T2 RED d · NN-a GREEN 0 — reproduces the lane's table |
| π vs `1d0dc4fd` (my fresh builds, private cacheDir, same `node_modules`) | 48 vs 47 files, **45 byte-identical** incl. `index-BWdQIfCEuZ3O.js` and `index-DSV8hl9eUGyP.css`; `index.html` differs by the two link lines only; +`icon.svg` (`856c8ad5`) +`apple-touch-icon.png` (`b07f52f9`) −`favicon.svg`: **π HELD**, the lane's 45/47 re-derived |
| **the tie's CLASS (critic plants, `crit9-plants.txt`)** | **11 of 12 non-square marks GREEN on the final gate** — see §1 |

Box: 1-minute load 34.8–70.1 across every row in this file (each log carries its `uptime` or `LOAD` lines), never above 120; no timing row is read here, and every paint row is a colour read, not a clock.

## 0 · Gaps first, the number, the verdict

**The critic's number for §12: 82** (from 79). **Verdict: ADVANCE.** Not converged.

Earned: row 1 CLOSED (E1–E6 RED on the pass-8 critic's own driver, both libraries' clauses in the sabotage battery);
row 2 LANDED and re-derived both engines (tree 0, control 1), with E7 RED on a real `src/` plant; row 4 CLOSED (T1/T2
RED, both `d.pin` disjuncts bite); row 8 GIVEN (§2); row 9 HELD and re-derived (45/47 on my builds); row 11 CLOSED
(three `--check` 0 re-run; `lint:favicon`, `--self-test` and `knip` 0 on the materialised union). The lane's tables
reproduce to the digit. That is a real pass. What holds the number down:

1. **Row 3 OPEN on the CLASS (§1).** 11 of 12 visible non-path marks pass the only CI reader of the touch icon:
   a 35 × 35 grey box, ten ink dots, a cream or cool paper, a navy or brown s. The colour clauses read ONE pixel each
   (paper = pixel 0; ink = the darkest pixel); the blob keys only |Δ| > 0.5. `icons --check` reds every class plant
   I tried and is not in CI (its linux-runner determinism is unread).
2. **Unpinned numeric bounds (LAWS P8 §F).** The tie's three `0.5` cuts sit outside `BOUNDS` with no edge row; moving
   the blob cut to 0.95 keeps `--self-test` at 0. `e.png-paper`'s edge plant moves pixel 0 only, so it pins the read
   and cannot see that the read is one pixel (checklist: spec-cites-itself).
3. **Disjunct holes (LAWS P8 §F):** 4 of 14 deletions keep `--self-test` at 0: the touch link's href disjunct (no
   plant points the touch link elsewhere), both `e.png-size` disjuncts (no non-square plant), the blob cut.
4. **The twin's two blind spots (§3):** it reads the icon's bytes with `fetch()` (CSP `connect-src`), not as the image
   load the UA makes (`img-src`): X1, an `img-src 'none'` policy, is GREEN in both engines while `new Image()` of the
   icon errors; production's `img-src` lives in `public/_headers`, which neither row reads. And it samples once, 400 ms
   after hydration: X2, a re-point at 1.5 s, is GREEN in both engines; the in-app theme toggle is never pressed.
5. **The `mutation` clause's claim (§6):** its observer starts at `DOMContentLoaded`, after the module script; the real
   `src/` E7 reds on `path`/`sha`, never on `mutation`. Narrow, stated, not a live defect.
6. **Row 5 OPEN, worse:** `check-favicon.mjs` +550/−74 → 1,881 lines (`selfTest()` alone is 594); the 69-plant table
   did not move. For a 496 B icon.
7. **Row 6 not landed:** T9-B28's caption is README text; B's G4 cost is still one pass-8 reading, never repainted.
8. **M19 whole:** no real tab, Safari in-SVG dark query, iOS web clip or Chrome favicon service; headless only.
9. **Diagnostics:** E1/E2 red `e.link-icon` with the message "carries 1 … link(s) (/icon.svg); exactly one, to
   /icon.svg, wanted", a reason that names no offending attribute (the red is right, its sentence is wrong).

Earliest 100: not pass 10 on this evidence unless gaps 1–4 close together; gap 1 has a one-line candidate
(`icons --check` in CI) whose cost is a runner reading, gap 4 a two-clause candidate (an `Image()` load per link, a
second read after the theme toggle). Neither is a design question. The batch gate's TAB-PEN arm (apply --check 0 on
`1d0dc4fd` and on the WAVE union) is MET, re-derived; ERASE's ghost plant and FIVE's D10 cap are other lanes' and
TAB-PEN rides neither `frontGate` nor `frontTween` (no `src/`).

## 1 · The tie is cured for its plants, not its class (row 3 OPEN — registry-v8 §2.12)

Row 3 asked that "a mark that isn't the s" red (E8's 12 × 12 square). The cure is `e.png-blob ≤ 16 px`, where `blob`
is the largest 4-connected run of pixels with |Δcoverage| > 0.5, beside IoU ≥ 0.97 and mean |Δ| ≤ 0.02. Every one of
those keys an OPAQUE mark. The touch icon's colour is read at TWO pixels: `e.png-paper` reads `img.rgba[0]` alone, and
`e.png-darkest` reads the single darkest pixel. And `icons --check`, the one reader that re-rasters the PNG with real
sharp, is not in CI: `lint:favicon` is `check-favicon.mjs --self-test`, and nothing else in `ci.yml` reads the PNG.

The class plants (`crit9-plants.mjs` → `crit9-plants.txt`, each a fresh copy of the bank's inputs read through
`--root`, the sidecar re-stamped the way the lane's own plants do it, because the sidecar is only the PNG's sha):

| plant (180 × 180 touch icon) | gate exit | mean \|Δ\| · IoU · blob |
|---|---|---|
| NN0 the shipped pixels re-encoded, no palette (negative control) | **0** GREEN | 0.0010 · 0.9942 · 0 |
| F35 a 35 × 35 box at ink coverage 0.45 on the paper (a mid-grey square, top-left) | **0 GREEN** | 0.0180 · 0.9942 · 0 |
| F40 a 40 × 40 box at coverage 0.30 | **0 GREEN** | 0.0158 · 0.9942 · 0 |
| F38 a 38 × 38 box at coverage 0.35 | **0 GREEN** | 0.0166 · 0.9942 · 0 |
| F30 a 30 × 30 box at coverage 0.49 | **0 GREEN** | 0.0146 · 0.9942 · 0 |
| D8 eight opaque 4 × 4 ink dots in a row across the paper | **0 GREEN** | 0.0049 · 0.9775 · 16 |
| D10 ten such dots | **0 GREEN** | 0.0059 · 0.9733 · 16 |
| T14/0/−14 every paper pixel but pixel 0 tinted (+14 R, −14 B: a cream paper) | **0 GREEN** | 0.0116 · 0.9942 · 0 |
| T0/−10/+20 every paper pixel but pixel 0 tinted cool | **0 GREEN** | 0.0051 · 0.9942 · 0 |
| T24/0/−24 a stronger cream | 1 RED (`e.png-delta` 0.0221) | — |
| K5/15/45 the whole stroke re-inked dark navy, the one darkest pixel kept | **0 GREEN** | 0.0119 · 0.9922 · 0 |
| K0/10/70 the stroke re-inked navy blue | **0 GREEN** | 0.0167 · 0.9903 · 0 |
| K60/20/10 the stroke re-inked brown | **0 GREEN** | 0.0198 · 0.9898 · 0 |

So **11 of 12 visible non-path marks pass `lint:favicon`**: a grey box a fifth of the tile wide, a dotted rule, a cream
paper, and a navy or brown s. I looked at the six composited (critic scratch only, not banked as a frame): each mark is
plain at 180 px. The one red (T24) is caught by the mean, not by any colour clause. The pass-8 critic's E8 class was
"a mark the path does not explain"; the cure answers only its opaque, single-component instance, which is exactly the
registry-v8 §2.12 pattern: **a gate cured for its plants and not its class is OPEN.**

What would close it, as a statement and not a design: the tie judged on the colour of EVERY pixel against the
analytic raster composited in the page's two tokens (a per-pixel ΔE budget, or the max over pixels of |Δ| per
channel, with its own edge plants), or `icons --check` (a real-sharp re-raster, max Δ 0) made a CI step beside
`lint:favicon`. The second is one line of `ci.yml` and already exists as code; the lane names neither.

The CI step has a cost the lane would have to price: `icons --check` demands max Δ 0 between the kept PNG and a fresh
sharp raster. On this host it reads the class plants as they should (NN0 max Δ 0 exit 0; F35 Δ 108, K0/10/70 Δ 60,
T14/0/−14 Δ 14, each exit 1; `logs/icons-check-*.txt`), but nobody has read it on the linux runner's libvips, where
an exact-zero raster match is not given. That reading is the cheapest close on offer and it is not in the bank.

## 2 · Row 8 · the pass-9 critic's non-author reading (p7-f1 at 48 DPR 2, p7-f3 at 180)

Asked of me by the lane. I read the kept frames themselves; I did not re-shoot them (the icon bytes are unchanged).

- **180 (p7-f3).** W is an even monoline s with round terminals; it reads at once as "s" and as type, not as hand.
  H's flat top bar with the upturned entry reads as a pen stroke, and reads as the board's hand. Read cold, H's flat
  cap with its down-turn also sits close to a numeral 5's cap; I read "s" on second look, never "5", but the first
  glance is the one a home-screen icon gets. W carries no such ambiguity.
- **48 DPR 2 (p7-f1, right half).** H is distinct from W and legible in both engines and both strips. Its top reads
  as a capital S with a flag more than a lower-case s; I side with the pass-8 critic's "legible" over pass 7's
  "marginal", with the same caveat about case.
- **16 DPR 1 ×4.** W and H are the same blob at the tab's real size; H's shoulder is a pixel squarer. The hand ballot
  (T9-B27) is decided at 48 and 180, never at 16.
- Two non-author readers now agree H is legible at 48 and 180. Neither reads it as illegible. The ballot stays the
  owner's. Row 8 is **GIVEN**.

## 3 · Row 2 · the live twin, re-derived and attacked (served bytes, both engines)

My own out-of-tree builds (private cacheDir under my scratch), served by `vite preview`: the bank's dist on `:4233`
(listener PID 37692, cwd my archive's `web/frontend`), the HEAD control `w7-control` on `:4256` (PID 37698, cwd
`w7-control/web/frontend`, `index-CubiZsMVSwTc.js`). The lane's spec, unedited, under a scratch config with no
`webServer` and no `globalSetup` (`.crit9-pw.config.ts`, never banked):

| run | exit | clean light / dark | plants as required | battery | load (1-min) start → end |
|---|---|---|---|---|---|
| tree chromium | **0** | GREEN / GREEN | 17/17 | 10/10 BITE | 38.45 → 35.24 |
| tree WebKit | **0** | GREEN / GREEN | 17/17 | 10/10 BITE | 35.24 → (see log) |
| control chromium | **1** | RED / RED | 2/17 (E6, E7) | 0/10 | (see log) |
| control WebKit | **1** | RED / RED | 2/17 (E6, E7) | 0/10 | 44.09 → 47.49 |

The lane's row 2 reproduces in both engines: tree exit 0, control exit 1, the control's clean RED on `path`/`sha`/`count`.

**What the twin cannot see (critic plants, a copy of the spec with two rows added, `crit9-tab-pen.spec.ts`, scratch only):**

| plant | chromium | WebKit |
|---|---|---|
| X1 a `<meta http-equiv=Content-Security-Policy content="img-src 'none'">` in the head | **red [] — the twin reads GREEN**; in the same page `new Image()` of `/icon.svg` fires `error` while `fetch('/icon.svg')` returns 200 | **red [] — GREEN**; image `error`, fetch 200 |
| X2 the icon re-pointed 1,500 ms after `load` (a theme-follow or a lazy module) | **red [] — GREEN** | **red [] — GREEN** |
| the other 17 rows, the same run | 17/17 as required | 17/17 as required |

X1 is the twin's measuring instrument, not a contrived page: it reads "the bytes the page itself fetches" with
`fetch()`, which CSP governs by `connect-src`, while the browser loads an icon as an image (`img-src`). A policy that
refuses the icon leaves every twin clause GREEN. In production the policy lives in `public/_headers`
(`img-src 'self' data: blob:` today), which `vite preview` never serves and neither the gate nor the twin reads: a
narrowed `img-src` there is a tab with no s and both of TAB-PEN's rows GREEN. X2 is the sampling window: the twin
reads once, 400 ms after hydration, so any write after that instant is invisible, including the one product shape a
favicon re-point is most likely to take (following the in-app theme toggle, which the twin never presses; it
emulates `prefers-color-scheme` only). The `mutation` clause's own text claims "every write after parse"; its
MutationObserver is installed on `DOMContentLoaded`, after Vite's module script has already run (§6 reads that
on a real `src/` plant).

## 4 · Constraints (each re-read, not taken from the lane)

- **π vs `1d0dc4fd`: HELD on byte identity**, re-derived from my own two fresh builds (table above). `src/` is
  untouched in the bank, so the §12 waiver stands; the rebuilt `index-BWdQIfCEuZ3O.js` / `index-DSV8hl9eUGyP.css`
  equal main's archive build byte for byte, so no gate or spec string minted a utility (T9-R6). π is not read on the
  WAVE union (the union's product differs from main by other sections' work; §12 adds only the two links there).
- **filterBudget 9:** `public/icon.svg` carries 0 `filter`s (grep 0) and `src/` is empty in the diff: unchanged.
- **M16:** no UI copy moved; `index.html`'s two link lines carry no visible text.
- **The @property law:** no CSS in the diff. Not engaged.
- **The union:** on `6a6c70e3` (WAVE + homes.on-WAVE + the delta, my own `git archive`): `check-favicon` a–e GREEN exit
  0, `--self-test` exit 0 (71 RED as required, 22 PINNED, 0 FAILED), `knip` exit 0 (the delta carries no `knip.json`
  and the union's entries hold). Box 44.1–46.3.
- **The ballot pair on one payload:** no new frame; the kept p7-f1/f2/f3 are the T9-B27/B28 frames. Headroom spent: 0 B.

## 5 · Paint and AA, re-derived (served bytes, both engines; `logs/glyph.txt`)

The pass-8 critic's `tab-glyph.mjs` with only its ports moved (`:4233` / `:4256`) and its payload tag renamed, run
from my archive's `web/frontend` so it imports the ONE home by relative path (`../e2e/lib/glyph-pop.mjs`,
`../e2e/lib/paint-lib.mjs`, homes v2 blob-equal). Box load 50.34 → 59.29 (1-min), under 120.

| cell (16 px DPR 1) | tree W: fraction < 4.5 (pop) · median | control: fraction (pop) · median |
|---|---|---|
| chromium light | 0.375 (88) · 9.343 | 0.293 (174) · 16.077 |
| chromium dark | 0.341 (88) · 9.353 | 0.293 (174) · 16.077 |
| WebKit light | 0.389 (90) · 11.592 | 0.411 (209) · 9.198 |
| WebKit dark | 0.352 (88) · 11.076 | 0.411 (209) · 9.198 |

- Clean: tree W **GREEN 8/8** cells, control **RED 6/8**. W's plants RED 49/56: FADE80 GREEN 6/8, FADE65 GREEN 1/8,
  every other plant RED 8/8. Tile painted (251,250,249) light and (17,15,14) dark, both engines, both DPRs. AA medians
  9.34–11.59 at 16 DPR 1 and 16.18–18.99 at 32 DPR 2. **Every figure equals the lane's to the third decimal.**
- The FADE80 slack is the home's (glyph-pop's `bound 0.425` on a clean fraction of 0.341–0.389), stated by the lane
  as such. It is not TAB-PEN's to cure, but T9-B28's caption must carry it, and it does only in the README's
  proposed text (row 6 is not landed).
- B (WIDTH 5) was not repainted by the lane or by me: its G4 cost in WebKit 16 DPR 1 (1.67 / 1.85) is still pass 8's
  single reading.

## 6 · E7 as a real `src/` plant (the lane's gap 1, built by the critic out of tree)

The pass-8 critic's E7, verbatim: `document.querySelector('link[rel~="icon"]')?.setAttribute("href", "/thick.svg");`
appended to `src/main.ts` (bytes checked with `od -c`), main's thick `favicon.svg` copied to `public/thick.svg`, built
from a copy of my archive with its own cacheDir (`index-B8HsS9omEDr-.js`, the string present in the chunk), served on
`:4233` (listener PID 66479, cwd the copy's `web/frontend`) after my bank server was stopped by its recorded PID. The
lane's spec, unedited:

| engine | exit | clean light / dark |
|---|---|---|
| chromium | **1** | RED / RED on `path` (/thick.svg) and `sha` (fc667540…) — **not on `mutation`** |
| WebKit | **1** | RED / RED on `path` and `sha` — **not on `mutation`** (box 59.30 → 63.41; chromium 70.06 → 59.30) |

So E7 reds on the built page, which closes the lane's gap 1 on a real plant. But the write that reds is read as
final STATE, never as a WRITE: Vite's `<script type=module>` runs before `DOMContentLoaded`, where the twin's
MutationObserver is installed, so the `mutation` clause is blind to every module-evaluation write. A module write
that is undone before `DOMContentLoaded` leaves no trace on any clause. That window is short and its harm is small
(the UA has not picked a favicon by then), so I record it as a gap in the clause's claim ("every attribute write to
the links after parse"), not as a live defect.

## 7 · The gate's batteries, re-run bare on the final bytes (browserless; box 39.5–63.4)

| battery | critic's exit | reading | control |
|---|---|---|---|
| `--self-test` | **0** | 71 RED as required, 8 GREEN as required, 22 EDGE PINNED, 0 FAILED | `1d0dc4fd` has no `check-favicon.mjs` (the row's own born-RED is its absence; the lane's control exit 1 is a missing file) |
| `--sabotage-battery` (clause) | **0** | 60/60 BITE (50 gate checks + `html-inert`, `link-allow`, `base-red` and 7 more library clauses; `d.pin` and `e.png-blob` included) | — |
| `--threshold-battery` | **0** | 44/44 BITE, unmoved edges PINNED | — |
| pass-8 plants first (`crit-plants.c8.mjs`) | E1–E6 1 · E7 0 · E8–E10 1 · T1, T2 1 · NN-a 0 | the pass-8 → pass-9 table reproduces row for row | pass-8 gate: E1–E8, T1 GREEN 0 (pass-8 critic's log) |
| disjunct battery (critic, `disjunct.mjs`, 14 deletions + 1 control) | **10 BITE · 4 HOLE** | HOLE (self-test still 0): `e.link-touch` href disjunct, `e.png-size` w disjunct, `e.png-size` h disjunct, the blob cut `|Δ| > 0.5` moved to 0.95 · BITE: both `d.arm` disjuncts, both `d.pin` disjuncts, both `e.link-icon` disjuncts, the `e.link-touch` ok disjunct, both IoU-union disjuncts, the paper read moved off pixel 0 | the unmodified copy exits 0 |

**The edge plants are shaped to the clause's reading (circularity, checklist item 2).** `e.png-paper`'s EDGES row
builds its plant as `repng((i, px) => (i === 0 ? nearPaper[n] : px))`: it moves pixel 0 and nothing else, which is
exactly the one pixel the clause reads. The edge is honestly pinned for the clause as written, and it can never tell
that the clause reads one pixel of 32,400 (T14/0/−14 and T0/−10/+20 above repaint the other 32,399 and stay GREEN).
`e.png-darkest`'s plant re-inks every pixel by coverage, so it pins the darkest-pixel read but likewise cannot see a
stroke whose darkest single pixel is kept (K-plants). The tie's three `0.5` cuts inside `tie()` (the IoU threshold on
`got` and `want`, and the `|Δ| > 0.5` that defines a blob pixel) are numeric bounds outside `BOUNDS` with no edge
row (LAWS P8 §F: "a bound with no boundary control in its band is unpinned"); the disjunct battery below moves the
blob cut.

## 8 · Incidents (the critic's, self-declared)

1. My first apply-check ran under zsh with the git command in a variable; zsh did not word-split it and every row
   read 127. Re-run as a bash script (`applycheck.sh`); only the bash run is cited.
2. The first class-plant run threw on a 44 px square (no all-paper square of that side in the four corners) and wrote
   nothing; the plant dir went to `trash/`, the size became 38 px, and a plant that cannot be built is now recorded
   FAILED, never thrown.
3. Two spec batches were void: zsh's `set -- $run` did not split, then `--project X file` took the file as a second
   project name. Every row exited 1 at startup with "Project(s) … not found"; the logs went to `trash/` and the runs
   were repeated with bash and `--project=`. No void log is cited.
4. One self-test tally printed to a background task's stdout instead of a log; it was re-counted from `selftest.txt`.
5. Git: `git archive` of `5c95b0a4`, `1d0dc4fd` and `6a6c70e3`; `read-tree` / `apply --cached` / `write-tree` on
   temporary indexes against the repo's object store (write-tree adds tree objects, no ref moves); `read-tree` +
   `diff-files` on a temporary index in the lane's worktree (its own index untouched). No commit, commit-tree,
   update-ref, stash, push or status anywhere; no git in the control tree.
6. Servers: bank dist `:4233` (listener 37692 / wrapper 37592), control `:4256` (37698 / 37593, serving
   `w7-control`'s pre-built dist), E7 dist `:4233` (66479 / 66335). Each killed by recorded PID after a cwd check;
   both ports read free after.
7. Scratch (archives, plant dirs, dists, vite caches, a `.crit9-vite.config.ts`, `.crit9-pw.config.ts`,
   `.crit9/tab-glyph.mjs` and `e2e/crit9-tab-pen.spec.ts` inside MY archive copy) all under my durable scratch dir;
   nothing written to the lane's worktree, main's product paths or the control tree. No `rm`; discards by `mv` to
   `trash/`. No install, deploy or publish.
8. Logs copied here are scrubbed of my scratch and repo prefixes (`<crit-scratch>`, `<repo>`).

## 9 · Replay

1. Banks: `GIT_INDEX_FILE=<tmp> git read-tree 1d0dc4fd && git apply --cached --check pass9.diff`; the same on
   `74a2b5d9`; WAVE: `read-tree 74a2b5d9`, `apply --cached pass8/integrate/WAVE.diff` (→ `acb9c08e`),
   `apply --cached pass9/instruments/homes.on-WAVE.diff` (→ `acde977b`), `apply --cached --check` the delta.
2. `git archive 5c95b0a4` with an empty root `.git` marker and `node_modules` symlinked; from `web/frontend`:
   `node scripts/check-favicon.mjs [--self-test | --sabotage-battery | --threshold-battery]`.
3. Class plants: `node crit9-plants.mjs <plantsDir> <archive>/web/frontend` (here). Disjuncts:
   `node disjunct.mjs <dir> <archive>/web/frontend` (here). Pass-8 plants: `MAIN_FAVICON=<main favicon.svg> node
   crit-plants.c8.mjs <dir with base/> <gate> <node_modules>` (pass8/critique, unedited).
4. Twin: build with a private cacheDir, `vite preview` on `:4233`, `w7-control` on `:4256`,
   `PLAYWRIGHT_BASE_URL=… npx playwright test --config <no webServer, no globalSetup> --project=chromium|webkit
   e2e/tab-pen.spec.ts`; the critic rows are `crit9-tab-pen.spec.ts.txt` (here) saved as `e2e/crit9-tab-pen.spec.ts`.
5. E7: append the pass-8 E7 line to `src/main.ts` of a COPY, copy main's `favicon.svg` to `public/thick.svg`, build,
   serve, run the lane's spec unedited.
6. Paint: the pass-8 critic's `tab-glyph.mjs` with ports `:4233`/`:4256`, run from `web/frontend/.crit9/`.
