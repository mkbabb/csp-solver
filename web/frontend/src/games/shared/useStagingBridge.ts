import { ref, shallowRef, type ComputedRef, type Ref } from "vue";

/**
 * THE STAGING BRIDGE (T4-P1 F4) — the picker↔game transport for "deal me THIS game at THESE
 * settings", plus the cross-game ledger the picker reads its truth from. A module-level
 * singleton on the `useDirtyBoard` register/identity-clear pattern.
 *
 * EVERYTHING HERE IS A `ref`. The pass-1 prototype held this state in plain module `let`s and
 * read it through a `computed` — a computed over non-reactive state evaluates once and never
 * invalidates, so the picker could never see a publish. Refs are the whole fix, and
 * `useDirtyBoard` is the shipped precedent (`dirty` IS a ref).
 *
 * FOUR SEAMS, one each (the fourth is T8-W3's — the table follows the switcher, so a board can
 * now arrive from the ROOM as well as from the picker):
 *   1. `publishMountedGame` — App owns `?game=` and the scene seam, so App names the mounted
 *      game; the bridge never parses a URL (no second truth). Published at BOOT and on every
 *      game change (the pass-1 `enterGallery`-only publish left deep-links and `?view=gallery`
 *      boots with a dead bridge).
 *   2. `registerStagingSource` / `dealStaged` — the MOUNTED game hands up its live pair and its
 *      deal act; a same-game picker deal rides this, no remount.
 *   3. `stageHandoff` / `consumeHandoff` — the one-shot for the four lazy games, ID-KEYED.
 *      Sizes are bare numbers with per-game meaning (sudoku 3 = 9×9, kenken 4 = 4×4), so an
 *      unkeyed arm consumed by whichever game mounted next produced a wrong-size board. The key
 *      closes it, and the arm is cleared by ANY mount — a mis-routed arm cannot outlive one
 *      mount, so there is no TTL, no clock, and no silent expiry fallback.
 *   4. `stageBoardFollow` / `consumeBoardFollow` — the SAME one-shot carrying the room's board
 *      and the size it was published at, for the game a peer's switch is about to mount.
 *
 * IMPORT DIRECTION, load-bearing: this module imports NOTHING from `@games/cards`. The table
 * statically imports the eager game's spec, whose model reaches `useGameState`, which reaches
 * here — a table import would close that cycle and TDZ the app at boot (the §1 rule of the
 * blast-radius map). The five ledger sources are therefore PASSED IN by App, which already
 * imports both sides.
 */

/** A staged pair: the game's OWN raw selector size (sudoku 3 = 9×9; kenken 4 = 4×4) + tier. */
export interface StagedPair {
  size: number;
  difficulty: string;
}

/**
 * A ledger row: the settings a game was last left at, and TWO distinct facts about its board.
 *
 * They are two fields because one flag cannot carry both truths, and pass 2 shipped the proof:
 * a single `board` computed as "any non-zero cell" is true the instant a board is DEALT (givens
 * are non-zero), so every freshly dealt, never-touched game read "in progress" and every deal
 * over it read as destroying work. Split:
 *
 *  · `board`     — a restorable board exists: the VALUE half of `useGameState`'s own `canRestore`
 *                  (some cell is non-zero), which is the picker's `resume` vs `start` truth.
 *                  Not the whole of `canRestore`, and the difference is named rather than
 *                  rounded off: that test also requires an `initial.source` of url+storage /
 *                  storage-only / url-board. Unreachable from the picker — `setGame` strips
 *                  `board`/`size`/`difficulty`/`board_size` on every switch, so a cold read is
 *                  always storage-only — but the ledger is a cache of a subset, not a copy.
 *  · `userMoves` — the user has written on it. The guard's truth: the ONLY thing a deal can
 *                  destroy. Givens are not work.
 */
export interface StagedLedgerEntry extends StagedPair {
  board: boolean;
  userMoves: boolean;
}

/** Where a game's board lives on disk — the card row's own key, handed in (see IMPORT DIRECTION). */
export interface LedgerSource {
  id: string;
  /** The game's own `localStorage` key. */
  persistKey: string;
}

const hasDom = typeof window !== "undefined";
const LEDGER_KEY = "staging-ledger-v1";

// ── 1 · The mounted game's identity (App publishes; the bridge transports) ──────────────
const mountedId = ref<string | null>(null);

/** App publishes the MOUNTED game id — at boot and at every scene change. */
export function publishMountedGame(id: string | null): void {
  mountedId.value = id;
}

/** The mounted game id, read by `useGameState` at setup to key its handoff + its ledger row. */
export function mountedGameId(): string | null {
  return mountedId.value;
}

// ── 2 · The mounted game's live pair + its deal act ─────────────────────────────────────
interface StagingSource {
  pair: ComputedRef<StagedPair> | Ref<StagedPair>;
  deal: (pair: StagedPair) => Promise<void>;
  /** write the pending debounced save NOW — see `flushMountedBoard`. */
  flush: () => void;
}
// `shallowRef`: the holder is a slot, not a reactive graph — deep-unwrapping the source's own
// `pair` computed would both flatten the identity guard's type and re-wrap what is already
// reactive. The picker never reads through here; it reads the ledger.
const source = shallowRef<StagingSource | null>(null);

export function registerStagingSource(s: StagingSource): void {
  source.value = s;
}

/** Identity-guarded (mount-before-unmount ordering during a swap — `useDirtyBoard`'s rule). */
export function clearStagingSource(s: StagingSource): void {
  if (source.value === s) source.value = null;
}

/**
 * Land the mounted board's pending save before somebody reads it off disk (T8-W3, D-3).
 *
 * App calls this the instant the live face DETACHES — the board stops being the live one and
 * becomes a deck still, and a still is read from `localStorage`, which the 300ms persist
 * debounce may be up to 300ms behind. One call, at the one seam that has the fact.
 */
export function flushMountedBoard(): void {
  source.value?.flush();
}

/** Apply a staged pair to the MOUNTED game and deal it. `false` = no game mounted to deal into
 *  (the caller then has nothing to await — never a silent success). */
export async function dealStaged(pair: StagedPair): Promise<boolean> {
  const s = source.value;
  if (!s) return false;
  await s.deal(pair);
  return true;
}

// ── 3 · The one-shot, ID-KEYED handoff (the four lazy games) ────────────────────────────
const handoff = ref<{ id: string; pair: StagedPair } | null>(null);

export function stageHandoff(id: string, pair: StagedPair): void {
  handoff.value = { id, pair };
}

/** Consumed at the incoming game's setup, BEFORE its init — so the staged pair seeds the one
 *  mount deal instead of racing a second one. Cleared unconditionally: a wrong-id arm dies at
 *  the first mount rather than lying in wait. */
export function consumeHandoff(id: string | null): StagedPair | null {
  const h = handoff.value;
  handoff.value = null;
  return h && h.id === id ? h.pair : null;
}

// ── 3b · THE FOLLOW (T8-W3) — the same one-shot, carrying a BOARD ───────────────────────
// The table follows the switcher, so the incoming game must mount holding the ROOM's board
// rather than its own saved one. That is the handoff idiom exactly — id-keyed, consumed before
// init, cleared by any mount so a mis-routed arm cannot outlive one — with a board blob and the
// size it was published at instead of a staged pair. Two arms rather than one field on the
// first, because the two say different things: `stageHandoff` is "deal me this", and this is
// "the room is holding this; do not deal at all".

/** A board off the wire, waiting for the game it belongs to. */
export interface StagedFollow {
  /** the RAW selector size the board was published at (`z` on the epoch). */
  size: number;
  /** the session's own `{b, m}` pool blob — opaque here, and read only by `useGameState`. */
  blob: unknown;
}

const follow = ref<{ id: string; staged: StagedFollow } | null>(null);

/** The session stages the room's board for the game that is about to mount. */
export function stageBoardFollow(id: string, size: number, blob: unknown): void {
  follow.value = { id, staged: { size, blob } };
}

/** Consumed at the incoming game's setup, BEFORE its init — the board it adopts INSTEAD of its
 *  localStorage restore. Cleared unconditionally, exactly as the pair handoff is. */
export function consumeBoardFollow(id: string | null): StagedFollow | null {
  const f = follow.value;
  follow.value = null;
  return f && f.id === id ? f.staged : null;
}

// ── THE CROSS-GAME LEDGER ──────────────────────────────────────────────────────────────
// The picker shows five cards and can only ever mount one game, so "what is futoshiki set to,
// and does it have a board?" has no live answer. Each game persists its board under its OWN
// storage key in its OWN shape (five codecs), so the picker cannot read them through the games.
// The ledger is the one shared row the mounted game writes as it goes: settings + the two board
// facts, id-keyed, one key. A card with no row says "new" — never a fabricated default
// presented as the board you left.
function readLedger(): Record<string, StagedLedgerEntry> {
  if (!hasDom) return {};
  try {
    const raw = window.localStorage.getItem(LEDGER_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<string, StagedLedgerEntry> = {};
    for (const [id, v] of Object.entries(parsed as Record<string, unknown>)) {
      const e = v as Partial<StagedLedgerEntry>;
      if (typeof e?.size === "number" && typeof e?.difficulty === "string")
        out[id] = {
          size: e.size,
          difficulty: e.difficulty,
          board: e.board === true,
          userMoves: e.userMoves === true,
        };
    }
    return out;
  } catch {
    return {};
  }
}

const ledger = ref<Record<string, StagedLedgerEntry>>(readLedger());

function writeLedger(): void {
  if (!hasDom) return;
  try {
    window.localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger.value));
  } catch {
    // best-effort, exactly like every per-game persist in the estate
  }
}

/** The mounted game publishes its row (settings + the two board facts). Keyed by the mounted id. */
export function publishStagedLedger(entry: StagedLedgerEntry): void {
  const id = mountedId.value;
  if (!id) return;
  const prev = ledger.value[id];
  if (
    prev &&
    prev.size === entry.size &&
    prev.difficulty === entry.difficulty &&
    prev.board === entry.board &&
    prev.userMoves === entry.userMoves
  )
    return;
  ledger.value = { ...ledger.value, [id]: entry };
  writeLedger();
}

/**
 * COLD-START BACKFILL (T4-P1 F4, pass-3 blocker 3). The ledger is a cache of a truth that
 * already exists on disk — five persisted boards — and pass 2 shipped it EMPTY on first run.
 * The whole installed base therefore saw `start` on games it had boards for, and every card but
 * the mounted one showed a table default dressed as saved settings. One sweep of the five
 * keys on the picker's first open repairs that without importing a single game.
 *
 * Only MISSING rows are filled: the mounted game publishes its own row live (an immediate
 * watch), and a live row is always fresher than disk — the debounced persist trails it by up
 * to 300ms. Backfill never overwrites.
 *
 * Two field names, one meaning: sudoku/thermo/killer persist `size`, futoshiki/kenken persist
 * `boardSize`. Both are read; whichever is a number wins. `userMoves` is the count of non-zero
 * cells that are NOT givens — the same "is there work here" question the live publisher answers
 * off the undo spine, asked of a board nobody has mounted this session.
 */
export function backfillLedger(sources: readonly LedgerSource[]): void {
  if (!hasDom) return;
  // The rows are BANKED as well as read: `previewFor` (below) is an id-keyed lazy read of the
  // same five keys, and App names the five in exactly one place. One call, one truth.
  ledgerSources = sources;
  let added = false;
  for (const src of sources) {
    if (ledger.value[src.id]) continue;
    const row = readPersistedBoard(src.persistKey);
    if (!row) continue;
    ledger.value = { ...ledger.value, [src.id]: rowOf(row) };
    added = true;
  }
  if (added) writeLedger();
}

// ── THE TRUTHFUL PREVIEW (T8-W3, M12) ──────────────────────────────────────────────────
// The deck's flank faces are canned arrays — five drawings of boards nobody ever played — and
// the board each card claims to show has been on disk under that game's own key the whole time.
// This is the read that makes the face true. It is the BACKFILL's parse, widened: the same
// five keys, the same one codec-agnostic reader, no longer throwing away the cells it decoded
// on its way to two booleans.
//
// LAZILY, AND NEVER STREAMED. The read happens at deck open and at warp, because while the deck
// is open the only board that changes is the mounted one — and the mounted one is the LIVE
// teleported face, never a poster. A boot-time sweep would go stale the moment a FOLLOW or a
// play session wrote disk; disk read at the moment of asking cannot lie.

/** A saved board, as the deck's still needs it. */
export interface PreviewBoard {
  /** the game's OWN raw selector size, in its own disk vocabulary (sudoku 3 = 9×9). */
  size: number;
  difficulty: string;
  values: Record<string, number>;
  givenCells: string[];
  /**
   * The saved blob whole. The clue furniture's FIELD NAME is the one thing only that game knows
   * (`thermometers` · `inequalities` · `cages`), so the poster reads its own off this rather
   * than this module minting a fifth name for it — the same reason the ledger takes `size` and
   * `boardSize` as they come.
   */
  saved: Record<string, unknown>;
  /**
   * WHOSE HAND WROTE EACH CELL (T8-R13) — per-cell `--color-user-ink` rebindings for the cells a
   * PEER authored, `useSession.authorInk`'s own shape and the live board's own binding.
   *
   * Disk holds digits, never authors, so this is the one field of a still that does NOT come off
   * disk: it is the room's clock, read at the moment the picture is asked for, and it is attached
   * to the MOUNTED game's still alone. Absent → every digit is the reading page's own ink, which
   * is what a solo still is and what every other card's saved board honestly says.
   */
  authorInk?: Record<string, Record<string, string>>;
}

let ledgerSources: readonly LedgerSource[] = [];

/**
 * The room's per-cell authorship, REGISTERED rather than imported (T8-R13).
 *
 * `useSession` imports THIS module — it stages the room's board for the game about to mount — so
 * a read in the other direction closes the cycle §IMPORT DIRECTION exists to keep open. App holds
 * both sides and hands the read down, exactly as it hands the five ledger sources in.
 */
let readAuthorInk: (() => Record<string, Record<string, string>>) | null = null;

/** App registers the session's `authorInk` read. Unregistered → solo, and every still is the one
 *  that shipped. */
export function registerAuthorInk(
  read: () => Record<string, Record<string, string>>,
): void {
  readAuthorInk = read;
}

/** The saved board for a game id, off disk, now — or `null`, which is the card's cue to draw
 *  its canned never-played face. A stated default, not a silent fallback. */
export function previewFor(id: string): PreviewBoard | null {
  if (!hasDom) return null;
  const src = ledgerSources.find((s) => s.id === id);
  const p = src ? readPersistedBoard(src.persistKey) : null;
  // THE MOUNTED BOARD ALONE. The clock is one shared board's; the other four cards are boards off
  // disk that nobody at this table has written on, and colouring them from this clock would be a
  // guess in a fact's clothes. An empty clock attaches nothing, so solo stays byte-identical.
  if (!p || id !== mountedId.value) return p;
  const ink = readAuthorInk?.();
  return ink && Object.keys(ink).length ? { ...p, authorInk: ink } : p;
}

/** The two board facts, derived from the parse rather than parsed a second time. */
function rowOf(p: PreviewBoard): StagedLedgerEntry {
  const givens = new Set(p.givenCells);
  const cells = Object.entries(p.values).filter(([, v]) => v !== 0 && v != null);
  return {
    size: p.size,
    difficulty: p.difficulty,
    // `board` mirrors the VALUE half of `canRestore` — any non-zero cell (see the interface).
    board: cells.length > 0,
    // GIVENS ARE NOT WORK — the flag that decides whether a deal destroys anything has to
    // exclude the cells the deal itself wrote.
    userMoves: cells.some(([k]) => !givens.has(k)),
  };
}

function readPersistedBoard(key: string): PreviewBoard | null {
  try {
    const raw = window.localStorage.getItem(key);
    const p: unknown = raw ? JSON.parse(raw) : null;
    if (!p || typeof p !== "object") return null;
    const b = p as {
      size?: unknown;
      boardSize?: unknown;
      difficulty?: unknown;
      values?: unknown;
      givenCells?: unknown;
    };
    // Two field names, one meaning: sudoku/thermo/killer persist `size`, futoshiki/kenken
    // persist `boardSize`. Both are read; whichever is a number wins.
    const size = typeof b.size === "number" ? b.size : b.boardSize;
    if (typeof size !== "number" || typeof b.difficulty !== "string") return null;
    const rawValues = (b.values ?? {}) as Record<string, unknown>;
    const values: Record<string, number> = {};
    for (const [k, v] of Object.entries(rawValues))
      if (typeof v === "number") values[k] = v;
    return {
      size,
      difficulty: b.difficulty,
      values,
      givenCells: Array.isArray(b.givenCells) ? (b.givenCells as string[]) : [],
      saved: p as Record<string, unknown>,
    };
  } catch {
    return null;
  }
}

/** The picker's read side — reactive, so a deal updates the chips without a remount. */
export function useStagedLedger(): Readonly<Ref<Record<string, StagedLedgerEntry>>> {
  return ledger;
}
