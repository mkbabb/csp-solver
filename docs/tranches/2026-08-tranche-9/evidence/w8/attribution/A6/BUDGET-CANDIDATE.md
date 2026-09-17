# T9-W8 born-RED — THE FIRST-LOAD READINESS BUDGET (lane A6's proposal)

## The metric: `boardDrawnMs` — the first boil tick, from navigationStart

Not board-ready, not LCP, not TBT alone, and here is why each was refused:

- **board-ready** is already fast — 282–314 ms at chromium 4× — and it does not move when the
  owner's complaint is true. A budget on it would be green at HEAD on a surface the owner calls
  poor. It stays as the wave's shared definition and as a *component*, never as the budget.
- **LCP** is, in all sixteen measured cells, the bake landing (within ~20 ms of `firstBake`).
  It is a restatement of one component and it carries a browser's own heuristic for "largest",
  which is not a promise across engines.
- **TBT** is CPU only. It is blind to transport and blind to the bake's wall time, and WebKit
  cannot see it at all — the device instrument would have to report the budget's own metric as
  NOT MEASURED, which is not a budget.

`boardDrawnMs` is the first `is-active` MOVE between the board's boil-frame siblings after
board-ready. It strictly dominates all three: it cannot fire before the board is ready, it
cannot fire before the bake has mounted its layers, and it lands 130–250 ms after the bake in
every cell measured. **One number that says: the board is up, drawn, and alive.** It is a
class-attribute mutation, so every engine can see it — including WebKit, where `longtask` does
not exist.

## The proxy number at chromium 4× on this tree

| regime | `boardDrawnMs` median of 3 | file |
| --- | --- | --- |
| **390×844 dpr 3, 4× CPU, Fast-3G-class, cold** | **3,317 ms** | `readiness.jsonl` / `readiness-table.md` |
| 390×844 dpr 3, 4× CPU, unthrottled link, cold | 2,813 ms | same |
| 1280×800, 4× CPU, Fast-3G-class, cold | 2,698 ms | same |
| 1280×800, 4× CPU, unthrottled link, cold | 2,067 ms | same |
| 390×844 dpr 3, 6× CPU, Fast-3G-class, cold | **never fired inside 3.6 s** | same |

The headline proxy is **3,317 ms** — the mobile pose in GATE D's own 4× rate on a
Fast-3G-class link, cold. Host load 6.7–7.6 at the time; zero tainted windows; dist identity
asserted unchanged either side.

**A companion row, same instrument, same load**: *first-toggle blocking* — 436 ms at the
mobile pose / 4× CPU on the first dark-mode invocation and 0 ms on the second
(`toggle-table.md`). The owner named the toggle by name in T9-M06 and again in T9-M09.

## The device method, and what the RED actually is

These proxy numbers are **darwin chromium under CDP throttling**. They are not a Safari number,
they are not an iOS claim, and they are not the threshold.

**The RED is the device baseline.** §8.3's owner-run instrument
(`8.3-device-instrument-charter.md`) reads `boardDrawnMs` off the deployed edge on the owner's
real iPhone, cold, using the same MutationObserver tell on the same class attribute — so the
device number and the proxy number are the same quantity, taken by the same rule. That reading
at HEAD, banked under `evidence/w8/`, IS the RED. 8.2's cure must beat it **on the device**,
read by the same instrument, before the wave closes. The proxy's job is to say where to look
and to let a cure be iterated without the phone in hand; it never closes the row.

Proposed gates.json shape, for WGATE to stamp once the device baseline exists — written here
as a candidate, not landed (this lane edits no config):

```
"boot": {
  "readiness": {
    "metric": "boardDrawnMs",
    "definition": "first is-active move between .boil-frame-bitmap/.boil-frame siblings after board-ready; board-ready = .board-group visible + first .cell-class rect non-zero + 1 rAF",
    "deviceMaxMs": "<the owner's cold iPhone reading at HEAD — the RED>",
    "proxyBasisMs": 3317,
    "proxyRegime": "chromium 4x CPU, 1.6Mbps/150ms, 390x844 dpr3, cold, darwin, HEAD 58014efd",
    "engines": "every engine — the tell is a class mutation, not a longtask",
    "note": "PROVISIONAL until a device reading exists. The proxy NEVER grades; it is the darwin basis."
  },
  "firstToggle": {
    "metric": "blocking ms across the first dark-mode invocation (rAF-gap proxy on WebKit)",
    "deviceMaxMs": "<owner's device reading at HEAD>",
    "proxyBasisMs": 436,
    "proxyRegime": "as above, chromium longtask",
    "note": "second invocation reads 0 at HEAD — the budget is on the FIRST"
  }
}
```

## Why this budget is safe under M09

`boardDrawnMs` gets *smaller* by scheduling the bake earlier or pre-warming it — never by
baking less. A cure that drops a pose, thins the boil or removes a filter would move this
number and would be **REFUSED** on sight, because the same evidence dir carries the filter
census and the π identity goldens that such a cure breaks. The metric is a *timing* of the
existing drawn quality, which is the only kind of budget the quality law admits.
