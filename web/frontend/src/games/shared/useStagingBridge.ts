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
 * THREE SEAMS, one each:
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
 *
 * IMPORT DIRECTION, load-bearing: this module imports NOTHING from `@games/registry`. The
 * registry statically imports `SudokuGame.vue`, whose scene reaches `useGameState`, which
 * reaches here — a registry import would close that cycle and TDZ the app at boot (the §1 rule
 * of the blast-radius map). The five ledger sources are therefore PASSED IN by App, which
 * already imports both sides.
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

/** Where a game's board lives on disk — the registry's row, handed in (see IMPORT DIRECTION). */
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
 * the mounted one showed a registry default dressed as saved settings. One sweep of the five
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
  let added = false;
  for (const src of sources) {
    if (ledger.value[src.id]) continue;
    const row = readPersistedBoard(src.persistKey);
    if (!row) continue;
    ledger.value = { ...ledger.value, [src.id]: row };
    added = true;
  }
  if (added) writeLedger();
}

function readPersistedBoard(key: string): StagedLedgerEntry | null {
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
    const size = typeof b.size === "number" ? b.size : b.boardSize;
    if (typeof size !== "number" || typeof b.difficulty !== "string") return null;
    const values = (b.values ?? {}) as Record<string, unknown>;
    const givens = new Set(
      Array.isArray(b.givenCells) ? (b.givenCells as string[]) : [],
    );
    const cells = Object.entries(values).filter(([, v]) => v !== 0 && v != null);
    return {
      size,
      difficulty: b.difficulty,
      // `board` mirrors the VALUE half of `canRestore` — any non-zero cell (see the interface).
      board: cells.length > 0,
      userMoves: cells.some(([k]) => !givens.has(k)),
    };
  } catch {
    return null;
  }
}

/** The picker's read side — reactive, so a deal updates the chips without a remount. */
export function useStagedLedger(): Readonly<Ref<Record<string, StagedLedgerEntry>>> {
  return ledger;
}

/** Test seam ONLY — drops every ref to its boot state so units don't leak into each other.
 *  The app never calls it: a module singleton with a public reset is a second lifecycle. */
export function __resetStagingBridge(): void {
  mountedId.value = null;
  source.value = null;
  handoff.value = null;
  ledger.value = readLedger();
}
