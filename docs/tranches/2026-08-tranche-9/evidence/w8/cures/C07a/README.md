# C07a — one request per font subset in WebKit: the mechanism, and what it refutes

2026-09-17 · track `wasm` · worktree `.claude/worktrees/w8-wasm`, branch `w8/wasm` ·
preSha `7b0610cc` · commit `63331bfc` · charter `../charters/C07.md` (first half only;
`bakeFace()` is C07b's, in another track, and `HandwrittenLogo.vue` was never opened).

**Verdict.** The chartered cure does not exist, because the defect it was chartered against is
not in the product. WebKit's second full 200 for every subset is produced by `Vary: Origin` — a
header `vite preview` sends and the live edge does not. Against a server that answers the way
sudoku.babb.dev answers, Playwright WebKit and Playwright chromium both read **4** woff2 GETs
cold, which is B6's gate met (≤ 1 per subset; fraunces's second is `bakeFace`, C07b's).
ATTRIBUTION row 6's **79.0 ms is refuted**: a `page.route` registered in one arm and not the
other biases WebKit board-ready by 73–98 ms all by itself, and the whole cost of every font load
on that mark is 21 ms.

What is committed is not a cure. It is the preview server's fidelity: one `preview: { cors:
false }` block in `vite.config.ts`, so the estate's stand-in for the edge stops telling a story
the edge never tells. The built `dist` is byte-identical to `dist-base`, all 43 files.

## 1. Identity, both ends

    dist-base  AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5
               fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB   (open and close, unmoved)
    dist       AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5
               fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB   (built at 63331bfc)
    aggregate, recipe stated so it reproduces (2026-09-18 correction; the verifier's round 1
    could not reproduce the figure this line first carried, `b3f098b8…`, because no recipe was
    given — the claim it supports does reproduce, and the figure is now re-derived here):
      `find <arm> -type f -exec md5 -q {} \; | sort | md5 -q`
          f705bd9e9fe011e5062b889dc8a35e60 — EQUAL both arms (the verifier's own figure)
      `(cd <arm> && find . -type f | sort | xargs md5 | md5 -q)`  (content and path)
          913ec5a80655b9d91d076d0424b01eab — EQUAL both arms

`sysctl -n vm.loadavg`: `{ 20.38 16.04 13.51 }` at the open, `{ 6.49 8.23 10.28 }` at the close
of the reading sets; up to ten sibling lanes on this host. Every count below is timing-free and
load-proof; every millisecond is a proxy on a contended host, and none is a Safari or iOS number.

## 2. The mechanism, found before a line of `src/`

The two requests are not a URL, `type`, `as` or declaration-order mismatch. Both arms ask for the
same absolute `/assets/<name>-subset-<hash>.woff2`. What differs is the **`Origin` request
header**, dumped off the server in `lab/reqhdr.mjs`:

| who asks | chromium | WebKit |
|---|---|---|
| `<link rel="preload" as="font" crossorigin>` | `Origin: <page origin>`, `sec-fetch-dest: font` | `Origin: <page origin>`, `sec-fetch-dest: font` |
| the `@font-face` load of that same same-origin URL | never issued — the preload is consumed | **no `Origin`**, `sec-fetch-dest: font` |

WebKit does not put a same-origin font load in CORS mode; chromium does. On its own that costs
nothing. Add `Vary: Origin` to the response and the cache key splits on exactly the header the
two requests disagree about, so WebKit cannot reuse the preloaded bytes and downloads all three
subsets a second time.

Header ablation, one at a time, same bytes, same HTML (`lab/font-lab.mjs`, WebKit, cold):

| response shape | woff2 GETs |
|---|---|
| plain (ACAO `*`, no `Vary`) | **4** |
| plain + `ETag`/`Last-Modified` | 4 |
| plain, ACAO removed | 4 |
| plain + **`Vary: Origin`** | **7** |
| the full `vite preview` shape | **7** |

`Cache-Control` is not the lever: `no-cache` and `public, max-age=31536000, immutable` both read
4 without `Vary` and 7 with it.

The head shape is already right, and the engines want opposite things — which is why the
engine-blind strip was refuted and why no single static tag can satisfy both under a
`Vary: Origin` server (`lab/font-lab.mjs`, `--serve preview`):

| head | WebKit | chromium |
|---|---|---|
| as built (`crossorigin`) | 7 | **4** |
| `crossorigin` dropped (v6) | **4** | 7 |
| `crossorigin` and `type` dropped (v7) | 4 | 7 |

## 3. What the edge actually answers (`raw/live-edge-headers.txt`)

    $ curl -sI https://sudoku.babb.dev/assets/fraunces-subset-qp6ShjBRhfYB.woff2
    access-control-allow-origin: *
    cache-control: public, max-age=31536000, immutable
    etag: "f917931beb5759a2705d95a4289ce5bd"
    cf-cache-status: HIT
    (no Vary, with or without an Origin request header — both arms curl'd)

    $ curl -sI http://127.0.0.1:4254/assets/…woff2        # vite preview, dist-base
    Vary: Origin
    Cache-Control: no-cache

## 4. The census, on the banked instrument (`A2/webkit-font-confirm.mjs`, unmodified)

| server | engine | woff2 GETs cold (fira / fraunces / patrick) | n |
|---|---|---|---|
| `vite preview` (the 8.1 regime) | webkit | **7** (2/3/2) — one window read 6 (1/3/2) | 5+3+3 |
| `vite preview` | chromium | 4 (1/2/1) | 5+3 |
| edge-faithful (`lab/edge-serve.mjs`) | webkit | **4** (1/2/1) | 3 |
| edge-faithful | chromium | 4 (1/2/1) | 3 |
| `vite preview`, **cors off** (`63331bfc`) | webkit | **4** (1/2/1) | 3/3 |
| `vite preview`, **cors off** | chromium | 4 (1/2/1) | 3/3 |

B6's gate — max requests per subset ≤ 1, fraunces ≤ 2 until C07b — **is met on both engines** the
moment the server stops varying on `Origin`. No `src/` byte was needed for it.

## 5. Row 6's 79.0 ms is an instrument artifact

Every cite behind row 6 ablated through `page.route` in the ablate arm only. WebKit reads faster
when a route is registered, whether or not it intercepts anything. The control is
`instrument/C07a-serve-interleave.mjs --nullroute`: the second arm registers a route for
`**/__c07a_never_requested__*`, a pattern nothing on the page ever asks for. Nothing is
intercepted. Both arms serve identical bytes and issue identical request counts.

board-ready (the W8 definition, INIT copied byte-identical from `refute/A2/xablate.mjs`),
webkit · no CDP · 1× · unthrottled · cold · 1280×800 dpr 1, 5+5 interleaved b,c,b,c, medians:

| arm b | arm c | b | c | Δ (c − b) | requests b/c |
|---|---|---|---|---|---|
| hints, `vite preview` | **null route only, nothing changed** | 266.0 | 168.0 | **−98.0** | 7/7 |
| hints, edge shape | null route + server-side strip | 223.0 | 150.0 | −73.0 | 4/4 |
| hints, `vite preview` | routed document, **handed back unchanged** | 228.0 | 152.0 | **−76.0** | 7/7 |
| hints, `vite preview` | routed document, hints stripped (xablate's own ablation) | 245.0 | 158.0 | −87.0 | 7/4 |
| hints, `vite preview` | banked `xablate --mode nopreload` | 232.0 | 155.0 | −77.0 | — |
| hints, `vite preview` | banked `xablate --mode fontabort` | 237.0 | 154.0 | −83.0 | — |
| **hints, server-side strip, preview shape** | | 246.0 | 241.0 | **−5.0** | 7/4 |
| **hints, server-side strip, edge shape** | | 222.0 | 233.0 | **+11.0** | 4/4 |
| **hints, server-side font-abort, preview shape** | | 230.0 | 209.0 | **−21.0** | 7/4 |

Read down: −77 to −98 whenever one arm carries a route, −5 to +11 when neither does. The
font-abort row is the ceiling — with the faces never served at all, WebKit board-ready moves
21 ms — so 79 ms was never available to three preload hints in the first place.

chromium · 4× · unthrottled · cold · desk dpr 1, same shape:

| arms | b | c | Δ | reading |
|---|---|---|---|---|
| hints vs **null route only** | 327.6 | 324.1 | −3.5 | chromium carries no route bias |
| hints vs routed strip (banked `xablate`) | 327.1 | 352.8 | **+25.7** | reproduces the lane's +23.5 |
| hints vs server-side strip, edge shape | 323.1 | 367.7 | **+44.6** | the hints are worth more than the lane could see |

The preloads stay. Stripping them is refuted twice over now: it costs chromium 26–45 ms and buys
WebKit nothing once the measurement is clean.

## 6. π and the gates

- Goldens **4/4 pass**, exit 0, against the cured dist on 4255. No `--update-snapshots`.
- `dist` ≡ `dist-base`, all 43 files, aggregate md5 equal — no pixel can move.
- `filterBudget` 9, pose count 4, no bake, boil, filter or transition touched: nothing in
  `src/` was opened.
- `npm run test:font-coverage` → **exit 0**: 2 subset faces covered as authored and as
  transformed, 3 bound tapes. The same three subsets ship, letter-exact.
- `test:unit` **exit 0 — Test Files 66 passed (66), Tests 810 passed (810)**.
- `lint`, `lint:eslint`, `lint:knip`, `lint:boundary`, `lint:tdz`, `lint:copy`,
  `lint:live-regions`, `lint:motion`, `typecheck:node`, `typecheck:e2e` — **all exit 0**.
- e2e surface battery: NOT RUN by the author. Nothing this commit touches reaches a served byte;
  the goldens and the byte-identity carry the pixel claim, and the e2e estate is not claimed
  either way here. The non-author verify ran it and it is green — font-census both engines 4/4,
  and the throttle config's filter-census, wordmark-integrity, throttled-void,
  theme-bake-freshness and theme-quadrants both engines 67/67, all against the cured dist on
  4255: `verify-r1/README.md` §5.

## 7. What the chair owes

1. **Strike or restate ATTRIBUTION row 6.** The count (7 GETs, 2/3/2, all 200) is real ON
   `vite preview` and reproduces 8/8 windows here. The **79.0 ms is refuted**, and so is the
   companion `−77.0` font-abort arm: both are the one-armed-route bias, measured at −76 to −98
   with nothing ablated. Row 6's budget line (B6) stands, and it already reads 4 on both engines
   against a server that speaks the edge's headers.
2. **Re-read every 8.1 row whose ablation registered a `page.route` in one arm only.** chromium
   shows −3.5 (clean), so rows 8, 9, 11 and 13 are not disturbed by this. WebKit's are: row 6 is
   the only WebKit row that ablated this way, but the bias belongs to the method, not the row.
3. **Decide whether `preview: { cors: false }` merges.** It changes no shipped byte and it makes
   the local proxy answer like the edge, but it changes the substrate every later
   `vite preview` reading is taken on. If the answer is no, revert `63331bfc`; the finding
   stands without it.
4. **No doc-truth row, no SPEC_MANIFEST entry, no README count** is owed: no product behaviour
   moved, no count in any README changed, and `dist` is identical.
5. **C07b is unaffected and still worth having.** fraunces's second request is `bakeFace()`'s own
   `fetch`, visible in every arm above (`initiatorType: fetch`, 14,936 B, ~35 ms), and it is the
   only remaining duplicate on the edge-faithful reading.

## 8. Held for the device (8.3)

- **The census on real Safari against the real edge.** Everything above says Safari should read
  4 (3 preloads consumed, plus `bakeFace`'s fetch). Playwright WebKit is not Safari and
  `vite preview` is not the CF edge; 8.3's `woff2Requests` closes it, timing-free:
  `getEntriesByType('resource')` filtered to `.woff2`, counted per boot.
- **Whether Safari consumes a `crossorigin` preload at all.** If it does not, the first half of
  the charter reopens against the device — and the cure would then be the engine-aware emission
  the charter describes, not anything here.
- **B6's RED itself.** Unset until the device runs.

## 9. Files

    instrument/webkit-font-confirm.mjs      the banked A2 instrument, copied verbatim, pointed at
                                            4254 / 4255 (only --port changed)
    instrument/C07a-serve-interleave.mjs    xablate.mjs --mode nopreload with the board-ready INIT
                                            copied byte-identical and the server made controllable:
                                            --serve preview|edge|external, --nullroute,
                                            --routecontrol, --fontabort
    lab/font-lab.mjs                        head-shape × response-shape census matrix (v0..v7)
    lab/reqhdr.mjs                          the request headers each engine sends per font
    lab/edge-serve.mjs                      dist-base served with the edge's headers
    raw/*.jsonl, raw/*.txt                  every window, every summary line, load at both ends
    raw/live-edge-headers.txt               the curl, both arms, plus vite preview's answer
    C07a-preview-cors.patch                 the committed change, 16 lines, for the chair
