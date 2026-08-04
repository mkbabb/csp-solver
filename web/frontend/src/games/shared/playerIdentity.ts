/**
 * Who a player is, and what colour they write in — both DERIVED, neither negotiated
 * (T6 mark 13).
 *
 * A slug is a pure function of the peer's own id, so a name costs no wire traffic and no
 * round trip: the roster row is drawn the instant the connection opens. Ink is the
 * golden-angle walk — `hue_i = i × 137.5°` at a lightness the theme bands — which spreads
 * ANY number of players as far apart around the circle as a sequence can, so there is no
 * palette to run out of and no player cap to enforce. The band is what makes the contrast
 * claim structural rather than a table of hand-checked hexes: `--peer-ink-l` is 0.5 on paper
 * and 0.8 at night, and at chroma 0.11 the whole walk clears AA on both grounds (worst
 * 5.26:1 light, 9.56:1 dark, measured over 40 indices).
 *
 * The crayon tiers are DIFFICULTY's vocabulary and stay there; this module mints no token
 * and touches no wax.
 */
import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";
import { hashBlob } from "./useUndoHistory";

/**
 * The pencil can only write what its cut holds. `patrickhand-subset.woff2` ships a–i, k–w,
 * y and z — no `j`, no `x` — so `jaguar` would come out half in the hand and half in the
 * system cursive, mid-word, on every roster row that drew it. The library supplies the
 * words; this takes the ones the page can actually draw. 345 of 355 animals and 1145 of
 * 1202 adjectives survive, which is 395,025 names for a room that will hold sixteen.
 */
const WRITEABLE = /^[a-ik-wyz]+$/;
const DICTIONARIES = [
  adjectives.filter((w) => WRITEABLE.test(w)),
  animals.filter((w) => WRITEABLE.test(w)),
];

/**
 * `adjective-animal` off the peer id. Deterministic, so every page in the room reads the same
 * name for the same peer with no round trip.
 *
 * THE SEED IS HASHED HERE, AND IT HAS TO BE — measured, not assumed. `uniqueNamesGenerator`
 * takes `number | string`, and its string path reaches **128 distinct names over 20,000
 * seeds**: its `getFromSeed` folds a string down to something like a character sum, so a peer
 * id (which is exactly a long random string) lands in a 128-wide space where sixteen players
 * collide better than half the time. Numeric seeds reach 18,776 of 20,000. So the peer id goes
 * through the estate's own FNV-1a first and the library is handed a number — the same library,
 * the same words, one honest line between them.
 *
 * Two ids can still land on one name, so a taken name RE-ROLLS off the next seed rather than
 * growing a numeric suffix: "brave-otter" and "brave-otter-2" are one name said twice, and the
 * whole point of a slug is that it is a word you can say out loud.
 */
export function slugFor(peerId: string, taken: ReadonlySet<string>): string {
  const seed = parseInt(hashBlob(peerId).slice(0, 8), 16);
  for (let salt = 0; ; salt++) {
    const slug = uniqueNamesGenerator({
      dictionaries: DICTIONARIES,
      separator: "-",
      length: 2,
      seed: seed + salt,
    });
    if (!taken.has(slug)) return slug;
  }
}

/**
 * The remote player's ink, as ONE formula and ONE binding: rebinding `--color-user-ink` is
 * the whole of the mechanism, because `HandwrittenGlyph` already strokes with that var
 * (`HandwrittenGlyph.vue:85`). The local player keeps the incumbent blue — nothing is bound
 * on their cells, so solo is byte-identical.
 */
export const inkFor = (index: number): Record<string, string> => ({
  "--color-user-ink": `oklch(var(--peer-ink-l) 0.11 ${((index * 137.5) % 360).toFixed(1)}deg)`,
});

// ── THE BINDING (T8-W3 §2.9) — who you are in a room, kept ──────────────────────────────
//
// The owner's ruling: "your slug name and session should be preserved, such that if you switch
// back to a game as slug x, you rejoin that active session." Everything downstream of the peer
// id is ALREADY a pure function of it — the slug (`slugFor` above), the ink (`k[id]`, an index
// the epoch carries and never reassigns), authorship (`ledger.clock` keys authors by id) and
// the roster row (`known[id]` retains departed peers). So the whole of "rejoin as the same
// author" is: stop minting a new id per connection, and remember the one you had.
//
// ONE MAP, `room id → {peer id, at}`, bounded and pruned at write. Keyed by room because the
// id IS the room's capability-scoped name for you: two tables are two names, and a stranger's
// link cannot resurrect you at a table you never sat at.
//
// TWO LIVE TABS ON ONE DEVICE ARE TWO PLAYERS, and that is the hazard a bare durable map walks
// into: both tabs would read the same binding, publish under one pubkey, and filter each other
// out as self — a room of one, twice. So a live page CLAIMS its id for as long as it holds it
// (released at `pagehide` and at every teardown), and a second tab that finds the binding
// claimed mints fresh WITHOUT taking the binding over: the first tab keeps the name, the second
// is honestly somebody else, and the tab that closes hands its name back for its own return.
//
// `sessionStorage` carries the per-TAB half, which is what makes a reload continuous: a tab
// that already answered to an id answers to it again, ahead of the shared map, and never
// against a claim someone else now holds.
const IDENTITY_KEY = "session-identity-v1";
/** The prune bound: rooms and live claims both. Small on purpose — a browser holds a handful
 *  of tables, and the map is a convenience rather than a history. */
const IDENTITY_CAP = 8;

interface IdentityStore {
  rooms: Record<string, { id: string; at: number }>;
  /** peer ids a LIVE page is currently answering to (any room). */
  live: string[];
}

const hex = (n: number): string =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");

/** A fresh peer id. Arm-neutral: the two wires no longer mint their own, so an id is the
 *  page's identity rather than a transport's connection number. */
export const mintPeerId = (): string => `p-${hex(12)}`;

function readStore(): IdentityStore {
  try {
    const raw = window.localStorage.getItem(IDENTITY_KEY);
    const p = raw ? (JSON.parse(raw) as Partial<IdentityStore>) : null;
    if (!p || typeof p !== "object") return { rooms: {}, live: [] };
    const rooms: IdentityStore["rooms"] = {};
    for (const [room, v] of Object.entries(p.rooms ?? {})) {
      const e = v as { id?: unknown; at?: unknown };
      if (typeof e?.id === "string" && typeof e?.at === "number")
        rooms[room] = { id: e.id, at: e.at };
    }
    return {
      rooms,
      live: Array.isArray(p.live) ? p.live.filter((x) => typeof x === "string") : [],
    };
  } catch {
    // Storage blocked, absent or corrupt — the binding is a convenience, so a page that
    // cannot read one simply arrives as a stranger (exactly today's behaviour).
    return { rooms: {}, live: [] };
  }
}

function writeStore(store: IdentityStore): void {
  // PRUNED AT WRITE, both halves: the most recent rooms by `at`, and the newest claims.
  const rooms = Object.entries(store.rooms)
    .sort((a, b) => b[1].at - a[1].at)
    .slice(0, IDENTITY_CAP);
  const next: IdentityStore = {
    rooms: Object.fromEntries(rooms),
    live: store.live.slice(-IDENTITY_CAP),
  };
  try {
    window.localStorage.setItem(IDENTITY_KEY, JSON.stringify(next));
  } catch {
    // best-effort, exactly like every other persist in the estate
  }
}

/** The per-tab half — `room → id`, so a reload answers to the id it already had. */
function readTab(): Record<string, string> {
  try {
    const raw = window.sessionStorage.getItem(IDENTITY_KEY);
    const p = raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
    if (!p || typeof p !== "object") return {};
    const out: Record<string, string> = {};
    for (const [room, id] of Object.entries(p))
      if (typeof id === "string") out[room] = id;
    return out;
  } catch {
    return {}; // same reasoning as `readStore` — no binding is a stranger, never a failure
  }
}

function writeTab(room: string, id: string): void {
  const tab = readTab();
  tab[room] = id;
  try {
    window.sessionStorage.setItem(IDENTITY_KEY, JSON.stringify(tab));
  } catch {
    // best-effort; the shared map still carries the durable half
  }
}

/**
 * The id this page answers to in `room` — reclaimed if it is yours to reclaim, freshly minted
 * if it is not, and claimed either way for as long as this page holds it.
 *
 * The binding is only ever WRITTEN for a room this page owns the name of: a second live tab
 * takes a fresh id and leaves the map alone, so the first tab's return is still its own.
 */
export function claimIdentity(room: string): string {
  const store = readStore();
  const mine = readTab()[room];
  const bound = store.rooms[room];
  const free = (id: string | undefined): boolean => !!id && !store.live.includes(id);
  const id = free(mine) ? mine! : free(bound?.id) ? bound!.id : mintPeerId();
  if (!bound || bound.id === id) store.rooms[room] = { id, at: Date.now() };
  store.live = [...store.live.filter((x) => x !== id), id];
  writeStore(store);
  writeTab(room, id);
  return id;
}

/** Hand the id back. The BINDING survives (that is the whole point); only the live claim goes,
 *  so the next page to want this name may have it. */
export function releaseIdentity(id: string): void {
  const store = readStore();
  if (!store.live.includes(id)) return;
  store.live = store.live.filter((x) => x !== id);
  writeStore(store);
}
