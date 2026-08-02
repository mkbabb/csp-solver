/**
 * THE PERSISTENCE + PERMALINK CODEC — one implementation, five games (T5-W2 2.4 / §1.1).
 *
 * Five `*UrlState.ts` files (1,696 raw lines) held two real codecs and three empty-body
 * no-ops. The two real ones were 71-of-74-line twins that diverged only where the clue
 * furniture entered the wire; the three stubs hard-coded `boardLink: "absent"` and shipped a
 * `writeShareUrl` that did nothing, so thermo/killer/kenken had a Share affordance over a
 * codec that was never written. The axis collapses here because it was never a per-game axis:
 * what a game alone knows is its KEY, its SIZE MATH, and its CLUE — and the clue already
 * carries its own codec pair on `spec.clues`, because the worker wire needed one.
 *
 * THE WIRE, whole:
 *
 *     base64url( <version byte> + "<rawSize>.<cells>" [ + ".<clue words>" ] )
 *
 *   · `rawSize`  — the game's own SELECTOR value (a boxed family's sub-grid root, a latin
 *                  family's board side). Self-describing, so a board-only link loads and a
 *                  disagreeing `?size=`/`?board_size=` fails closed.
 *   · `cells`    — one base-36 char per cell, `0` for empty, length `boardSide(rawSize)**2`.
 *   · `clue`     — the flat `Uint32Array` from `spec.clues.encode`, one base-36 word per
 *                  element, `,`-joined. The section is present exactly when the game HAS a
 *                  clue seam — sudoku's `clues: null` is a stated absence, so its body is two
 *                  parts and byte-identical to the wire it shipped with.
 *
 * THE ROUND-TRIP GUARD is what makes one decoder safe for four different clue vocabularies.
 * A decoded clue is re-encoded and compared to the incoming buffer word for word; anything
 * the clue codec would silently absorb — a dangling futoshiki endpoint, a truncated thermo
 * tube, a kenken operator ordinal outside the four — fails the comparison and the link fails
 * closed. The permalink therefore inherits every wire invariant the codec has, present and
 * future, without this module knowing what a cage is.
 *
 * A REFUSED LINK LEAVES THE BAR. Failing closed and cleaning up are one act: a `?board=` the
 * app just refused would otherwise stand in the address bar describing a board that isn't
 * there, and a reload or a re-share re-serves the same lie. The strip happens at the decode,
 * never as a side effect of the degraded path's mount deal — that route only ever worked
 * because a fresh deal happens to call `dropBoardParam` on the way past, so the cleanup raced
 * the solver and lost under WebKit.
 */
import { toBase64Url, fromBase64Url } from "@/lib/base64url";
import type { Difficulty } from "@games/shared/types";
import type { ClueCodec } from "@games/shared/solver/client";

/** The persisted-board fields every game's blob carries; each adds its size key + furniture. */
export interface PersistedCore {
  values: Record<string, number>;
  givenCells: string[];
  originalGivenCells: string[];
  overriddenCells: string[];
  solvedValues: Record<string, number>;
  boardGeneration: number;
}

/**
 * Where the boot state came from. `url-board` — a shared `?board=` decoded into a full board
 * and wins over storage — is distinct from `url-only` (bare selector params) so the machine
 * RESTORES the synthesized board rather than auto-randomizing.
 */
type InitSource = "fresh" | "url-only" | "storage-only" | "url+storage" | "url-board";

/** The `?board=` outcome, observable by the UI: no link, a board, or a link that fell closed. */
type BoardLink = "absent" | "ok" | "invalid";

interface ResolvedInitial<TPersisted> {
  /** the RAW selector size — `useGameState`'s `initialSize`, whatever the blob calls it on disk. */
  size: number;
  difficulty: Difficulty;
  source: InitSource;
  persisted: TPersisted | null;
  boardLink: BoardLink;
}

export interface PersistenceConfig<TClue> {
  /** the game id — `?game=`'s value, and the active-game guard `dropBoardParam` honours. */
  game: string;
  /** the localStorage key. `spec.urlCodec.key` NAMES this one string rather than mirroring it. */
  key: string;
  /** raw selector size → board side: boxed `n**2`, latin `n`. The model's own `boardSizeOf`. */
  boardSide: (rawSize: number) => number;
  /** the raw selector sizes this game deals at — `spec.deal.sizes`' values. */
  validSizes: readonly number[];
  defaultSize: number;
  /** the tier a fresh boot lands on: sudoku rolls one, the other four state EASY. */
  freshDifficulty: () => Difficulty;
  /**
   * The query key this game's raw size rides (`size` · `board_size`), or `null` for a family
   * whose selectors live in localStorage alone. `?difficulty=` is SHARED and rides with it —
   * one flag, because a game that URL-syncs one syncs both.
   */
  sizeParam: string | null;
  /** the size key inside the PERSISTED BLOB — the disk vocabulary, unchanged by this collapse. */
  sizeField: string;
  /** `spec.clues`' codec pair, or `null` for a game that prints no clue furniture (sudoku). */
  clue: ClueCodec<TClue> | null;
  /** the clue field inside the persisted blob (`thermometers` · `inequalities` · `cages`). */
  clueField: string | null;
  /**
   * The game's own semantic guard on an UNTRUSTED clue, run after the round-trip guard: the
   * invariants a well-formed buffer can still violate. Futoshiki's is the whole of it —
   * adjacency, dedup, endpoint range and the `2·n·(n−1)` pair bound, without which a crafted
   * link renders one floating caret per pair and freezes the main thread.
   */
  validateClue?: (clue: TClue, boardSide: number) => boolean;
}

export interface Persistence<TClue, TPersisted extends PersistedCore> {
  /** the localStorage key, for `spec.urlCodec.key` to name. */
  readonly key: string;
  resolveInitialState: () => ResolvedInitial<TPersisted>;
  syncToUrl: (rawSize: number, difficulty: Difficulty) => void;
  persistBoard: (state: TPersisted) => void;
  clearPersistedBoard: () => void;
  dropBoardParam: () => void;
  encodeBoard: (
    rawSize: number,
    values: Record<string, number>,
    totalCells: number,
    clue?: TClue,
  ) => string;
  writeShareUrl: (
    rawSize: number,
    values: Record<string, number>,
    totalCells: number,
    clue?: TClue,
  ) => void;
}

/**
 * The codec version byte (T4-W3, ratcheted shut T5-W2 2.4d). A single leading byte tags the
 * payload so a breaking codec revision can't silently decode an old link into a DIFFERENT
 * board. THE BYTE IS MANDATORY: an absent tag used to mean "version 0" and decode anyway,
 * which made the byte advisory and left a permanent second accepted wire format that nothing
 * wrote. A payload that does not open with a version this build understands fails closed.
 */
const CODEC_VERSION = 1;

/**
 * Reflected-DoS bound: a legit `?board=` is under 1 KB (a 16×16 sudoku is ~344 chars; a 7×7
 * futoshiki with its full 84-pair furniture ~750). Reject anything past this BEFORE `atob`.
 * The raw cap is the primary bound — it also bounds the clue word count, since every word
 * costs at least two payload chars.
 */
const MAX_BOARD_PARAM_LEN = 4096;

const VALID_DIFFICULTIES: readonly Difficulty[] = ["EASY", "MEDIUM", "HARD"];

const isDifficulty = (v: unknown): v is Difficulty =>
  VALID_DIFFICULTIES.includes(v as Difficulty);

/** Strict canonical base-36 word: no sign, no whitespace, no `0x`, no trailing garbage. */
const CANONICAL_WORD = /^[0-9a-z]+$/;

/** The game the address bar says is mounted. Sudoku is the default — it rides the main chunk. */
const activeGame = (params: URLSearchParams): string => params.get("game") ?? "sudoku";

export function createPersistence<TClue, TPersisted extends PersistedCore>(
  config: PersistenceConfig<TClue>,
): Persistence<TClue, TPersisted> {
  const { key, clue, clueField, sizeField, sizeParam } = config;

  // ── the wire ────────────────────────────────────────────────────────────

  function encodeClueSection(value: TClue | undefined): string {
    if (!clue) return "";
    const buf = clue.encode(value as TClue);
    let out = "";
    for (let i = 0; i < buf.length; i++) out += (i ? "," : "") + buf[i].toString(36);
    return out;
  }

  /** The clue words → the buffer the codec speaks, or `null` on anything non-canonical. */
  function readClueWords(section: string): Uint32Array | null {
    if (section.length === 0) return new Uint32Array(0);
    const words = section.split(",");
    const buf = new Uint32Array(words.length);
    for (let i = 0; i < words.length; i++) {
      if (!CANONICAL_WORD.test(words[i])) return null;
      const n = parseInt(words[i], 36);
      if (!Number.isSafeInteger(n) || n < 0 || n > 0xffffffff) return null;
      buf[i] = n;
    }
    return buf;
  }

  function encodeBoard(
    rawSize: number,
    values: Record<string, number>,
    totalCells: number,
    clueValue?: TClue,
  ): string {
    let cells = "";
    for (let i = 0; i < totalCells; i++) cells += (values[String(i)] ?? 0).toString(36);
    const body = clue
      ? `${rawSize}.${cells}.${encodeClueSection(clueValue)}`
      : `${rawSize}.${cells}`;
    return toBase64Url(String.fromCharCode(CODEC_VERSION) + body);
  }

  type BoardDecode =
    { status: "absent" } | { status: "ok"; board: TPersisted } | { status: "invalid" };

  /**
   * Synthesize a persisted board from a decoded `?board=` — the only board-shaped object ever
   * built from URL content. Non-zero cells become the givens (a share says "solve THIS
   * configuration"). Fails closed on anything malformed, out of range, size-mismatched or
   * unknown-version, so a corrupt link degrades to the selector path and never a corrupt board.
   */
  function decodeBoardParam(
    urlSize: number | null,
    urlDifficulty: Difficulty | null,
  ): BoardDecode {
    const raw = new URLSearchParams(window.location.search).get("board");
    if (!raw) return { status: "absent" };
    if (raw.length > MAX_BOARD_PARAM_LEN) return { status: "invalid" };

    let payload: string;
    try {
      payload = fromBase64Url(raw);
    } catch {
      return { status: "invalid" };
    }
    // An empty payload reads NaN and fails closed on the same comparison.
    if (payload.charCodeAt(0) !== CODEC_VERSION) return { status: "invalid" };

    const parts = payload.slice(1).split(".");
    if (parts.length !== (clue ? 3 : 2)) return { status: "invalid" };

    const [sizeStr, cellStr] = parts;
    // Strict canonical size — no leading whitespace, sign or `0x` (`parseInt` takes all three).
    if (!/^\d+$/.test(sizeStr)) return { status: "invalid" };
    const rawSize = parseInt(sizeStr, 10);
    if (!config.validSizes.includes(rawSize)) return { status: "invalid" };
    // A selector param that disagrees with the board's own size fails closed.
    if (urlSize !== null && urlSize !== rawSize) return { status: "invalid" };

    const side = config.boardSide(rawSize);
    const totalCells = side ** 2;
    if (cellStr.length !== totalCells) return { status: "invalid" };

    const values: Record<string, number> = {};
    const givenCells: string[] = [];
    for (let i = 0; i < totalCells; i++) {
      const v = parseInt(cellStr[i], 36);
      if (!Number.isInteger(v) || v < 0 || v > side) return { status: "invalid" };
      values[String(i)] = v;
      if (v !== 0) givenCells.push(String(i));
    }

    let clueValue: TClue | undefined;
    if (clue) {
      const buf = readClueWords(parts[2]);
      if (!buf) return { status: "invalid" };
      let decoded: TClue;
      try {
        decoded = clue.decode(buf, side);
      } catch {
        // The wire guard fired — a truncated group, an unknown ordinal. Fail closed.
        return { status: "invalid" };
      }
      // THE ROUND-TRIP GUARD — see the header. Anything the codec absorbed is a defect here.
      const back = clue.encode(decoded);
      if (back.length !== buf.length) return { status: "invalid" };
      for (let i = 0; i < back.length; i++)
        if (back[i] !== buf[i]) return { status: "invalid" };
      if (config.validateClue && !config.validateClue(decoded, side))
        return { status: "invalid" };
      clueValue = decoded;
    }

    const board = {
      [sizeField]: rawSize,
      difficulty: urlDifficulty ?? "EASY",
      values,
      givenCells,
      originalGivenCells: givenCells,
      overriddenCells: [],
      solvedValues: {},
      boardGeneration: 1,
      ...(clueField ? { [clueField]: clueValue } : {}),
    } as unknown as TPersisted;

    return { status: "ok", board };
  }

  // ── the address bar ─────────────────────────────────────────────────────

  function parseUrlParams(): { size: number | null; difficulty: Difficulty | null } {
    if (!sizeParam) return { size: null, difficulty: null };
    const params = new URLSearchParams(window.location.search);
    const rawSize = params.get(sizeParam);
    const n = rawSize ? parseInt(rawSize, 10) : null;
    const rawDiff = params.get("difficulty")?.toUpperCase();
    return {
      size: n !== null && config.validSizes.includes(n) ? n : null,
      difficulty: isDifficulty(rawDiff) ? rawDiff : null,
    };
  }

  function syncToUrl(rawSize: number, difficulty: Difficulty): void {
    if (!sizeParam) return;
    const url = new URL(window.location.href);
    url.searchParams.set(sizeParam, String(rawSize));
    url.searchParams.set("difficulty", difficulty);
    history.replaceState(null, "", url.toString());
  }

  /**
   * Drop `?board=` — on Deal/Clear, and on a refused link. A dedicated `.delete()`: `syncToUrl`
   * only ever `.set()`s its own keys. Guarded to the ACTIVE game, because App keeps every
   * game's model instantiated and a background game's fire-and-forget mount deal would
   * otherwise nuke the foreground game's shared board before its shell even mounts.
   */
  function dropBoardParam(): void {
    const url = new URL(window.location.href);
    if (activeGame(url.searchParams) !== config.game) return;
    if (!url.searchParams.has("board")) return;
    url.searchParams.delete("board");
    history.replaceState(null, "", url.toString());
  }

  /** Write `?board=` on an explicit share act only — never ambient, which would defeat the
   *  clean selector surface. */
  function writeShareUrl(
    rawSize: number,
    values: Record<string, number>,
    totalCells: number,
    clueValue?: TClue,
  ): void {
    const url = new URL(window.location.href);
    url.searchParams.set("board", encodeBoard(rawSize, values, totalCells, clueValue));
    history.replaceState(null, "", url.toString());
  }

  // ── the disk ────────────────────────────────────────────────────────────

  function loadPersistedBoard(): TPersisted | null {
    try {
      const raw =
        typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
      if (!raw) return null;
      const data = JSON.parse(raw) as Record<string, unknown>;
      if (
        !data ||
        typeof data !== "object" ||
        !config.validSizes.includes(data[sizeField] as number) ||
        typeof data.values !== "object" ||
        data.values === null ||
        !Array.isArray(data.givenCells) ||
        (clueField !== null && !Array.isArray(data[clueField]))
      ) {
        return null;
      }
      // A legacy or corrupt tier coerces to EASY rather than discarding the board — the board
      // is the valuable unit, the tier degrades. (Four of the five codecs this replaces
      // already did; sudoku's threw the board away with it.)
      if (!isDifficulty(data.difficulty)) data.difficulty = "EASY";
      return data as unknown as TPersisted;
    } catch {
      return null;
    }
  }

  function persistBoard(state: TPersisted): void {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage full, blocked, or absent — persistence is best-effort by contract.
    }
  }

  function clearPersistedBoard(): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Unavailable — there is nothing to clear.
    }
  }

  // ── the resolution ──────────────────────────────────────────────────────

  function resolveInitialState(): ResolvedInitial<TPersisted> {
    const url = parseUrlParams();
    const decoded = decodeBoardParam(url.size, url.difficulty);
    const boardLink = decoded.status;
    const boardState = decoded.status === "ok" ? decoded.board : null;
    if (decoded.status === "invalid") dropBoardParam();

    const persisted = loadPersistedBoard();
    const readSize = (b: TPersisted): number =>
      (b as Record<string, unknown>)[sizeField] as number;
    const readDiff = (b: TPersisted): Difficulty =>
      (b as Record<string, unknown>).difficulty as Difficulty;

    // URL wins over storage: a valid shared board takes precedence over any saved game.
    if (boardState) {
      return {
        size: readSize(boardState),
        difficulty: readDiff(boardState),
        source: "url-board",
        persisted: boardState,
        boardLink,
      };
    }

    // A VALID board ORs in above, so a board-only link is never silently dropped; an invalid
    // one fell closed and falls through here while `boardLink` carries the corrupt-link signal.
    const hasUrl = url.size !== null || url.difficulty !== null;

    if (hasUrl && persisted) {
      const size = url.size ?? readSize(persisted);
      const difficulty = url.difficulty ?? readDiff(persisted);
      if (size === readSize(persisted) && difficulty === readDiff(persisted)) {
        return { size, difficulty, source: "url+storage", persisted, boardLink };
      }
      // The URL disagrees with storage — the URL wins, and the stale board goes.
      clearPersistedBoard();
      return { size, difficulty, source: "url-only", persisted: null, boardLink };
    }

    if (hasUrl) {
      return {
        size: url.size ?? config.defaultSize,
        difficulty: url.difficulty ?? "EASY",
        source: "url-only",
        persisted: null,
        boardLink,
      };
    }

    if (persisted) {
      return {
        size: readSize(persisted),
        difficulty: readDiff(persisted),
        source: "storage-only",
        persisted,
        boardLink,
      };
    }

    return {
      size: config.defaultSize,
      difficulty: config.freshDifficulty(),
      source: "fresh",
      persisted: null,
      boardLink,
    };
  }

  return {
    key,
    resolveInitialState,
    syncToUrl,
    persistBoard,
    clearPersistedBoard,
    dropBoardParam,
    encodeBoard,
    writeShareUrl,
  };
}
