# CTRL-FACE — pass 1 CRITIQUE (adversarial, non-author)

Read: the spec, the prototype's README and its diff (`git -C .claude/worktrees/wf_e58b4764-0fc-34 diff`,
10 files, +411/−142), its four frames, its readings. Re-run on my own server
(`127.0.0.1:4242 --strictPort`, the one free port in 4230–4249; the prototype's server was down;
private vite `cacheDir`, so this lane evicted nobody's optimized deps), chromium + webkit.

**Verdict: ADVANCE at 62%.** The face law is real and it is proved: one voice at every cell in both
engines, the ratio at 900×500, the Georgia `p` killed by advance, a gate that can finally see a face
re-point. The prototype is honest about its own bill. What it does not see is that `.washi-tag` is a
SHARED class: the family re-faces the GALLERY, a surface it does not claim, does not frame, does not
gate — and the tape covenant it repairs breaks there by 4.8–5.8px per tape.

---

## 1. What I reproduced (independently, both engines)

| claim | my reading | agrees |
|---|---|---|
| ROW 1 — one voice over the eight names, dock-390 + land-900×500 | `['Fraunces · 25.89 · 800 · lowercase']`, n=8, chromium + webkit | ✅ |
| ROW 3 — name/option ≥ 1.23 | 25.89 / 20 = **1.2945** at both cells, both engines; chips `Patrick Hand · 400` | ✅ |
| `check-font-coverage.mjs` | `font coverage OK`, exit 0 — Fraunces 31 cp / 14,896 B, Patrick Hand 53 cp / 4,896 B | ✅ |
| AA from paint, LIGHT, dock-390 | shut head **4.659**, shut value `easy` **4.984**, unselected chip **4.659**, printed name on tape **17.362**, printed caption **19.451** — my instrument, their numbers to 3 decimals | ✅ |
| filterBudget — `e2e/filter-census.spec.ts` | **12 passed** both engines, census exact, area and all | ✅ |
| `e2e/zone-grammar.spec.ts` (44px floor + negative controls + heading lock) | **22 passed** both engines | ✅ |
| `e2e/access.spec.ts` 2.3 | **6 passed** both engines — including the roster live-region row that timed out in their lane (that gap is a lane artifact, not the diff's) | ✅ |
| M16 / register | `check-copy-register` 0 dashes, 0 unadmitted jargon; `check-ink-pressure`, `check-motion-contract` exit 0 | ✅ |
| **the bill** — `visual-regression` test 10, the iPad coarse seal | **FAILED both engines: 1276.75 / 1276.63 vs ≤ 1227.5** (22 of 24 pass; their webkit boil flake did not repeat) | ✅ RED |
| `tape ∩ any control = 0` | **FAILS**: `checking` ∩ `candidates` **416.1px²** chromium / **414.1px²** webkit at dock-390 and land-900×500 | ✅ RED |

Nothing the prototype reported was overstated. Its deltas section is the most useful page in the lane.

## 2. What it did not measure — PI on the gallery (my finding)

`.washi-tag` is not the controls' class. `StagingBand.vue:130` renders
`<SheetWashiLabel text="new game" :seed="13" anchor="tag" />` on the GAME PICKER, and the face law
re-faces it too. Scoped in-page ablation (HEAD's own `.washi-tag` declarations restored on the
staging band's tape ALONE, so nothing in the hidden controls card can be the cause) —
`probe/pi-staging-scoped.mjs`, `readings/pi-staging-scoped.json`:

| at `?view=gallery` | HEAD | as built | Δ |
|---|---|---|---|
| face / rung / weight | Patrick Hand · 14.0 · 500 | **Fraunces · 25.89 · 800** | — |
| painted box | 64.00 × 19.63 | **147.14 × 32.63** | **+130% wide, +66% tall** |
| tape leading | 1.5 (21.0px) | **1.5 (38.83px)** — the `var(--washi-tag-lh, 1.5)` FALLBACK, because only `.tray-well` sets the variable | the controls' tapes run 1.2 |
| **net flow per tape** | −1.64 / −0.64 | **−6.47** | **−4.76 chromium / −5.83 webkit** |
| staging band height | 136.00 / 199.94 | **150.83 / 214.77** | **+14.83** |
| first gallery card `y` | 149.41 | **141.98** | **−7.43** (both engines, 1280×800 and 390×844) |

Three things follow.

1. **The pixel it moves that it did not declare.** The deck and the dealt cards ride up 7.4px on a
   surface listed nowhere in the spec, with no frame banked and no golden run. Frame:
   `frames/critic-gallery-390x844-dark-staging-tape.png`.
2. **The covenant is not "zero by arithmetic".** The spec's own words: "net flow height zero BY
   ARITHMETIC at any font-size and any leading". On the one consumer that does not set
   `--washi-tag-lh` it is off by 4.8–5.8px per tape. The `, 1.5` fallback is a masked default that
   hides precisely the case the design does not handle.
3. **CHECK 6 locks the move in.** `FACE_SITES[".washi-tag"] = "Fraunces"` now REQUIRES the gallery
   tape be printed — an unmeasured surface made mandatory by a gate.

## 3. Failure-mode checklist, judged

- **pi — HIT, hard.** §2. Also the 768–1023 chip 22→20 is declared, and the desk `size` h2 ink is
  declared; the gallery is not.
- **masked fallback — HIT.** `var(--washi-tag-lh, 1.5)`, §2.
- **gates that cannot fail (where it counts) — HIT ×3.** (a) the net-flow and printed-count censuses
  visit board cells only, never `?view=gallery`, so both are blind to the surface the family just
  re-faced; (b) CHECK 6 resolves any `var()` chain to a family, so a site reading `--font-display`
  directly passes — the law says sites read a FACE token and the gate does not enforce that;
  (c) `access.spec.ts` `CONTRAST_TARGETS` is `.icon-sublabel` + `.ctrl-btn` only, so the four
  re-faced sites' AA is measured in this lane and gated nowhere.
- **the constraint it forgot — HIT ×2.** The spec capped the one geometry re-price at **≤ 0.5rem**;
  the build ships **1.5rem** (3× the cap) and that is 18.41px of the iPad breach. The spec priced the
  font at "+420 B, Patrick Hand nothing"; the build is **+844 B** with the hand re-cut.
- **elegant reduction ("and then the hard part") — HIT.** The voice is one token; the height budget,
  the caption's rung and the tape's second collision are all handed to pass 2.
- **unverified gestalt — HIT (partial).** Four crops, one engine each, controls only. No gallery
  crop, no light dock, and `visual-golden` was NOT run (dev server, not a built dist), which is the
  one instrument that would have caught §2 by eye.
- **legacy alias — MINOR.** `--face-printed` and `--font-display` both live and both satisfy the
  gate; two names for one family until something retires the old one at the sites.
- **the estate's instruments were edited to fit the arm — NOTED, and honestly declared.**
  `font-census.spec.ts` loses **11 ledger rows** and `zone-grammar.spec.ts` changes a selector. Both
  are defensible (the chips left Fira Code; `:text-is()` binds the smallest element) but the standing
  census is smaller than it was, and the gate row still reads "ledger exact-match unchanged".
- CLEAR: vacuous convergence (every gate is born-RED and two of them still fail), spec-cites-itself
  (numbers are measured, and the prototype refuted its own spec's `calc(100% + 6px)` arithmetic),
  consumer-less substrate (every new token has a site), generic default (house faces throughout),
  M16 (zero strings minted; casing is CSS), filterBudget (9, exact), W2's mechanics (sticky tag,
  dock, tab berths, `--tap-floor` all intact — 44.00×44.00 with zero headroom at 900×500 coarse).

## 4. Strengths worth keeping whatever pass 2 decides

- **CHECK 6 / `FACE_SITES`** — the first instrument in the estate that reads which face a selector
  actually renders in. It caught the live `"Fira Code"` literal and the Georgia `p`; it would have
  caught the T8 ransom class from the other side.
- **The ransom proof by ADVANCE**, not by cmap: `p` 16.714 vs 17.022 (chromium), 0 `fellBack`.
- **`.ctrl-word`** — the mark priced off the RENDERED advance, which kills two `ch`-count variables
  and the whole class of "the underline stopped tracking its word when the face changed".
- **The bill priced by ablation** (18.41 + 31.25 + 0.00 = 49.66, sum closes) rather than asserted.
- **The tape pull reading the tape's own leading** — right repair, wrong fallback.
- **A HEAD control served identically** (`git archive HEAD`, same node_modules and bank).

## 5. The owner's question the numbers cannot answer (U-10)

Two 25.89px printed captions (`marks`, `candidates`) beside a 20px written chip row; a `new game`
tape at the same rank as the `size` heading 4px below it (`p3-rail-1280×800`); the desk `size` h2
moved muted → foreground. `candidates` does not wrap (148.08px in a 60px-basis lane, measured). The
question is whether the sheet now has one voice or one SHOUT.

---

Instruments: `probe/critic.mjs` (voice + contrast-from-paint + overlap + the first pi read),
`probe/pi-staging-scoped.mjs` (the attribution), `probe/pi-gallery.mjs`, `probe/tag-inventory.mjs`,
`probe/gallery-crop.mjs`, `probe/crit-e2e.config.ts` (the estate's specs against this lane's server).
Readings in `readings/`, one frame in `frames/`. 76 KB total.
