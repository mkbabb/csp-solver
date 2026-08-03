# W4 — THE MULTIPLAYER BATTERY (owner ask 2)

"A robust testing suite — not superfluous, within measure and proportion — for the
multiplayer facility, with mobile testing." The suite is shaped against the measured cost of
what exists, so proportion is enforced, not asserted.

## What exists (measured)

40 rows: 15 e2e (`multiplayer.spec.ts`, both engines, **1280×800 only** — no device
descriptor anywhere), 11 units (`useSession.test.ts`, `useSession.stress.test.ts`), 14 relay
rows (`web/relay/relay.test.ts`, **in no CI lane**). The MP spec is the estate's single most
expensive file — 19.5% of e2e serial cost — and its most load-sensitive: the three ≥3-page
webkit rows flaked under full-suite contention and passed clean in isolation. **Fence the
≥3-page rows (serial describe or a load-aware `boot()` budget) before adding any multi-page
row** — otherwise the additions buy flake, not coverage.

## The gaps that deserve a row (proportion-adjudicated)

Five candidate gaps were argued *out* as superfluous or misplaced: >4 players (topology is
proven at 4, authors at 16 in units), two-tab same-device (localWire is that), hibernation
wake (verifies Cloudflare), CDP network shaping (chromium-only = a HOLDOUT violation; belongs
in a relayWire unit), origin-allowlist (a design decision → owner ballot). What remains:

### e2e — three rows in the existing file (both engines)

| id | row (estate register) | born RED? |
|---|---|---|
| **M1** | *two phones sit at one table, and the well is reachable with the sheet shut* — open `.drawer-tab`, tap the invite, roster 2 on both, `.players-leave` clears the coarse 44px floor in both dimensions | **YES** — the leave target measures **40.09×44**; the estate's floor is ≥44 on width and height. Cure: `min-width:44px` on the coarse rule at `GameControlPanel.vue:1253-1257` |
| **M2** | *a digit tapped on a phone crosses, and the sheet does not move under the traffic* | no — measured stable |
| **R1** | *a page that reloads mid-session comes back to the same table and the same board* — deal-then-reload; B adopts the dealt board, not its stale `?board=` | no — measured green; a regression guard for the `readSessionParam→joinSession` vs `publishBoard` boot race |

Cost: +3 rows / +6 runs ≈ +44.5s serial in-suite (+4.1% on the whole config), ~+22s wall on
a 2-worker runner. Reuse `devices["iPhone 13"]` (the estate's incumbent) — do not mint a new
viewport number.

### units — four relay + two frontend

| id | row | born RED? |
|---|---|---|
| **U1** | *a socket that leaves is announced to the room* | **YES** — after `webSocketClose(b,1006)` the peer's sent log is `[]`; the ghost roster is born here. Cure: a close-announce in `Relay.webSocketClose`. This is cut-2 presence groundwork. |
| **U2** | *a frame past the fanout cap is refused, not relayed* | **YES** — a 5MB `content` is acked and fanned whole (5,000,140 B/subscriber); no size check in `relay.ts`. Cure: a frame cap in `Relay.webSocketMessage`. |
| **U3** | *the shipped subscription fits the hibernation attachment with room to spare* | no — budget row. **Corrects the round-1 premise:** the cap is 16,384 B (not 2 KB); the shipped REQ is 70 B (0.43%); the dead 250-topic batch is 8,004 B and *fits*. |
| **U4** | *the fanout survives a socket that dies mid-loop* | no — regression guard for `relay.ts:198`. |
| **U5** | *a dropped socket reconnects, re-subscribes, and re-announces* — the retry ladder + REQ-then-hi order | no — the deterministic home for the slow-network claim CDP would have tested single-engine. |
| **U6** | *both arms deliver the same script to the same handlers* — one parity harness over localWire and relayWire | no — needs `localWire` exported (`useSession.ts:190`). |

Cost: +6 tests, <50ms. Neither unit floor moves against them.

## The source cures the rows enforce

1. `min-width:44px` on `.players-leave` under `(pointer:coarse)` — M1.
2. A close-announce in `Relay.webSocketClose` — U1.
3. A frame-size cap in `Relay.webSocketMessage` — U2.
4. **`?wire=local` gated on `import.meta.env.DEV`** + `"wire=local"` in `check-prod-shake.mjs`'s
   `FORBIDDEN` — the leak cure, no new test. Today the param is read unconditionally
   (`useSession.ts:442`), survives every strip path, and rides copied invite links; the BUILT
   bundle's BroadcastChannel answers, so a recipient of a `wire=local` link gets a room that
   never reaches off their device. The whole MP battery runs against the dev server, so the
   DEV gate is transparent to it.
5. `export` on `localWire` — U6's seam.

## The relay lane (owner ask 2's structural half)

`web/relay` is in no CI workflow; 14 passing rows run nowhere. Add:
```json
"test:unit:relay": "vitest run --root ../relay"
```
and one CI step in the `fe-unit` job. Measured cost: **0.56s**. A separate step (not merged
into the main vitest run) keeps `check-unit-count.mjs`'s report shape reading the estate it
was floored against. Re-cut the fixture fossil: `relay.test.ts:32-37,52` builds fixtures from
trystero's dead 250-topic filter; re-aim at the shipped `{kinds:[20411], "#x":[one]}` filter.

**Flagged, not booked — the relayWire arm in CI:** a `playwright-relay.config.ts` whose
`webServer` runs `wrangler dev --port 4245`, carrying the existing opt-in `:682` row against a
local DO. Closes the "shipped arm untested in CI" gap without the public internet, ~30s. The
blocker is real: wrangler needs node@22 and every CI node lane pins 24. This is the owner's
decision, not the wave's to assume away.

## Acceptance

M1/M2/R1 land both engines with M1 born-RED-proven; U1–U6 land with U1/U2 born-RED-proven;
the relay lane runs in CI; the source cures land with their rows; the `wire=local` leak is
gated and prod-shake-enforced. The ≥3-page rows are fenced before the mobile rows land.
Total added cost stays within the measured proportion (+4.1% e2e, <50ms unit, 0.56s relay).
