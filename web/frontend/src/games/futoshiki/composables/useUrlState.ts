/**
 * URL + localStorage persistence for Futoshiki. Own file (games never import each
 * other) with a materially different shape from Sudoku's:
 *   - The URL param is `board_size`, never bare `size` (F5). Sudoku owns `?size=`;
 *     Futoshiki owns `?board_size=`; `?difficulty=` is SHARED (T4-WU folded it in,
 *     closing the W6 residue) — safe because App.vue strips board/size/difficulty/
 *     board_size on a game switch and each game re-writes its own on mount, so both
 *     games co-exist in one URL while `?game=` selects which is active.
 *   - `PersistedBoard` carries `inequalities` — permanent board furniture — which does
 *     NOT participate in given/overridden bookkeeping.
 */
import { toBase64Url, fromBase64Url } from "@/lib/base64url";
import type { Difficulty } from "@games/shared/types";
import { VALID_BOARD_SIZES, type Inequality } from "../types";

/** Futoshiki's board on disk. Exported so `spec.urlCodec.key` NAMES this one string rather
 *  than mirroring it — the card row's ledger source reads it back off the spec. */
export const STORAGE_KEY = "futoshiki-board-state";
const DEFAULT_BOARD_SIZE = 5;
const DEFAULT_DIFFICULTY: Difficulty = "EASY";
const VALID_SIZES: readonly number[] = VALID_BOARD_SIZES;
// T4-WU/U2 — the W6 residue closed: futoshiki difficulty now threads through `?difficulty=` +
// localStorage, the twin of sudoku's, so a staged tier survives reload instead of resetting to
// EASY each mount (which made the "New game" surface lie for one game). Shared tier vocabulary.
const VALID_DIFFICULTIES: readonly Difficulty[] = ["EASY", "MEDIUM", "HARD"];

// Reflected-DoS bound: a legit `?board=` is < 1 KB (size 7 with the full 84-pair
// inequality furniture base64-encodes to ~750 chars); a crafted 100k-pair blob is
// ~600 KB. Reject anything past this before `atob` even runs — the raw-length cap is
// the primary DoS bound; adjacency + count + dedup below are the correctness/doc-truth
// closes (G8-P2). Shared magnitude with Sudoku's guard.
const MAX_BOARD_PARAM_LEN = 4096;

// 'url-board' — a shared `?board=` permalink decoded into a full board (values +
// inequality furniture) and wins over storage. Distinct from 'url-only' so the
// composable RESTORES the synthesized board rather than auto-randomizing.
type InitSource = "fresh" | "url-only" | "storage-only" | "url+storage" | "url-board";

export interface PersistedBoard {
  boardSize: number;
  // T4-WU/U2 — the staged difficulty, now a first-class persisted field (twin of sudoku's).
  difficulty: Difficulty;
  values: Record<string, number>;
  givenCells: string[];
  originalGivenCells: string[];
  overriddenCells: string[];
  inequalities: Inequality[];
  solvedValues: Record<string, number>;
  boardGeneration: number;
}

export interface InitialState {
  boardSize: number;
  difficulty: Difficulty;
  source: InitSource;
  persisted: PersistedBoard | null;
  // The `?board=` decode outcome, observable by the UI: "absent" (no link),
  // "ok" (a shared board was restored), or "invalid" (a link was present but failed
  // to decode — the corrupt-link signal, never a silent fresh deal). Read by the
  // design lane to surface a one-line notice.
  boardLink: "absent" | "ok" | "invalid";
}

function parseUrlParams(): {
  boardSize: number | null;
  difficulty: Difficulty | null;
} {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("board_size");
  const n = raw ? parseInt(raw, 10) : null;
  const rawDiff = params.get("difficulty");
  const difficulty = rawDiff?.toUpperCase() as Difficulty | undefined;
  return {
    boardSize: n !== null && VALID_SIZES.includes(n) ? n : null,
    difficulty:
      difficulty && VALID_DIFFICULTIES.includes(difficulty) ? difficulty : null,
  };
}

function loadPersistedBoard(): PersistedBoard | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedBoard;
    if (
      !VALID_SIZES.includes(data.boardSize) ||
      typeof data.values !== "object" ||
      !Array.isArray(data.givenCells) ||
      !Array.isArray(data.inequalities)
    ) {
      return null;
    }
    // Tolerate a legacy board saved before difficulty was persisted (or a corrupt tier) by
    // coercing to the default rather than discarding the whole board — the board is the
    // valuable unit; the tier degrades gracefully to EASY.
    if (!VALID_DIFFICULTIES.includes(data.difficulty))
      data.difficulty = DEFAULT_DIFFICULTY;
    return data;
  } catch {
    return null;
  }
}

// ── Share-on-demand permalink codec (`?board=`) ─────────────────────────
// base64url of `${boardSize}.${cells}.${ineqs}` — `cells` is one base-36 char per
// cell value (0 = empty), length = boardSize**2; `ineqs` is the printed inequality
// furniture as `greater-lesser` position pairs joined by ',' (empty when none).
// Self-describing (carries its own size) so a board-only link still loads and a
// mismatch fails closed. Inequalities are carried — a Futoshiki share without its
// constraints is not the same puzzle. The base64url codec is hoisted to
// `@/lib/base64url` (shared with Sudoku's).

// ── Codec version byte (T4-W3, ratcheted shut T5-W2 2.4d) ───────────────────
// A single leading byte tags the encoded payload so a breaking codec revision can't silently
// decode an old link into a *different* board. THE BYTE IS MANDATORY. It was not: an absent
// tag used to mean "version 0" and decode anyway — the graceful ratchet — which made the
// version byte advisory and left a permanent second accepted wire format that nothing writes
// and no test could distinguish from a corrupt link that happens to open with a digit. A
// payload that does not open with a version this build understands fails closed, which is what
// every other malformed-link arm here already does.
const CODEC_VERSION = 1;

// Peel the version byte off a decoded payload: returns the version and the remaining body, or
// null when the leading byte is not a version this build understands. An empty payload reads
// NaN and fails closed on the same comparison.
function readCodecVersion(payload: string): { version: number; body: string } | null {
  if (payload.charCodeAt(0) !== CODEC_VERSION) return null;
  return { version: CODEC_VERSION, body: payload.slice(1) };
}

export function encodeBoard(
  boardSize: number,
  values: Record<string, number>,
  totalCells: number,
  inequalities: Inequality[],
): string {
  let cells = "";
  for (let i = 0; i < totalCells; i++) cells += (values[String(i)] ?? 0).toString(36);
  const ineqs = inequalities.map(([a, b]) => `${a}-${b}`).join(",");
  // Prepend the codec version byte before base64url (T4-W3) — see readCodecVersion.
  return toBase64Url(
    String.fromCharCode(CODEC_VERSION) + `${boardSize}.${cells}.${ineqs}`,
  );
}

// The decode outcome, made observable: "absent" (no `?board=`), "ok" (a board), or
// "invalid" (a link was present but failed closed). Replaces the old `null`-for-both
// silent degrade so the UI can tell a corrupt link from no link.
type BoardDecode =
  | { status: "absent" }
  | { status: "ok"; board: PersistedBoard }
  | { status: "invalid" };

// Synthesize a PersistedBoard from a decoded `?board=` — the only board-shaped object
// ever built from URL content. Non-zero cells become the givens. FAILS CLOSED to
// `invalid` on any malformed/out-of-range/size-mismatched/unknown-version blob so a
// corrupt link degrades to the size-only path, never a corrupt board — but the failure
// is now observable, not a silent fresh deal.
function decodeBoardParam(
  urlSize: number | null,
  urlDifficulty: Difficulty | null,
): BoardDecode {
  const raw = new URLSearchParams(window.location.search).get("board");
  if (!raw) return { status: "absent" };
  // Fail closed on an oversized param BEFORE decoding — the DoS bound.
  if (raw.length > MAX_BOARD_PARAM_LEN) return { status: "invalid" };
  let payload: string;
  try {
    payload = fromBase64Url(raw);
  } catch {
    return { status: "invalid" };
  }
  // Strip the version byte; an absent or unknown version fails closed.
  const versioned = readCodecVersion(payload);
  if (!versioned) return { status: "invalid" };
  const parts = versioned.body.split(".");
  if (parts.length !== 3) return { status: "invalid" };
  const [sizeStr, cells, ineqStr] = parts;
  // Strict canonical size — reject leading whitespace / sign / hex `parseInt` leniency
  // (`" 4"`, `"-4"`, `"0x4"` all fail closed here; G8-P3).
  if (!/^\d+$/.test(sizeStr)) return { status: "invalid" };
  const boardSize = parseInt(sizeStr, 10);
  if (!VALID_SIZES.includes(boardSize)) return { status: "invalid" };
  // A `?board_size=` that disagrees with the board's own size fails closed.
  if (urlSize !== null && urlSize !== boardSize) return { status: "invalid" };
  const totalCells = boardSize ** 2;
  // A length mismatch (wrong cell count for the declared size) fails closed.
  if (cells.length !== totalCells) return { status: "invalid" };
  const values: Record<string, number> = {};
  const givenCells: string[] = [];
  for (let i = 0; i < totalCells; i++) {
    const v = parseInt(cells[i]!, 36);
    if (!Number.isInteger(v) || v < 0 || v > boardSize) return { status: "invalid" };
    values[String(i)] = v;
    if (v !== 0) givenCells.push(String(i));
  }
  const inequalities: Inequality[] = [];
  if (ineqStr.length > 0) {
    // The wire boundary the doc-invariant (types.ts) promises. Each pair must be
    // orthogonally adjacent — horizontal neighbors (|Δ|=1, same row) or vertical
    // (|Δ|=n) — the total is bounded at the maximum adjacent-pair count 2·n·(n−1),
    // and exact duplicates fail closed. Without this a crafted `?board=` renders one
    // floating `<FutoshikiCaret>` per pair (100k → main-thread freeze), and
    // non-adjacent pairs draw carets on edges that don't exist.
    const maxPairs = 2 * boardSize * (boardSize - 1);
    const seen = new Set<string>();
    for (const pair of ineqStr.split(",")) {
      const ab = pair.split("-");
      if (ab.length !== 2) return { status: "invalid" };
      // Strict canonical endpoints — uniform with the size guard above (`:156`).
      // Reject `parseInt` leniency (trailing garbage like `0-1abc`, leading
      // whitespace/sign/hex) so a crafted pair fails closed instead of silently
      // dropping the tail (SEC-4).
      if (!/^\d+$/.test(ab[0]) || !/^\d+$/.test(ab[1])) return { status: "invalid" };
      const a = parseInt(ab[0], 10);
      const b = parseInt(ab[1], 10);
      if (
        !Number.isInteger(a) ||
        !Number.isInteger(b) ||
        a < 0 ||
        a >= totalCells ||
        b < 0 ||
        b >= totalCells
      ) {
        return { status: "invalid" };
      }
      const adjacent =
        (Math.abs(a - b) === 1 &&
          Math.floor(a / boardSize) === Math.floor(b / boardSize)) ||
        Math.abs(a - b) === boardSize;
      if (!adjacent) return { status: "invalid" };
      const key = `${a}-${b}`;
      if (seen.has(key)) return { status: "invalid" };
      seen.add(key);
      if (seen.size > maxPairs) return { status: "invalid" };
      inequalities.push([a, b]);
    }
  }
  return {
    status: "ok",
    board: {
      boardSize,
      difficulty: urlDifficulty ?? DEFAULT_DIFFICULTY,
      values,
      givenCells,
      originalGivenCells: givenCells,
      overriddenCells: [],
      inequalities,
      solvedValues: {},
      boardGeneration: 1,
    },
  };
}

export function resolveInitialState(): InitialState {
  const url = parseUrlParams();
  // A shared board decoded into a PersistedBoard, or a discriminated failure.
  const decoded = decodeBoardParam(url.boardSize, url.difficulty);
  const boardLink = decoded.status;
  const boardState = decoded.status === "ok" ? decoded.board : null;
  // A refused link leaves the bar, here — the Sudoku port's twin (T5-W2 seal-fix; the reason
  // is written out there). Deleted at the decode rather than left to the degraded path's mount
  // deal, which raced the solver.
  if (decoded.status === "invalid") dropBoardParam();
  const persisted = loadPersistedBoard();
  // hasUrl ORs in a VALID board so a board-only link isn't silently dropped (an
  // invalid board fell closed → boardState null → falls through to the size path
  // while boardLink carries the "invalid" corrupt-link signal for the UI). T4-WU/U2:
  // a bare `?difficulty=` now also arms the URL path (difficulty is a URL param, twin of sudoku).
  const hasUrl =
    url.boardSize !== null || url.difficulty !== null || boardState !== null;

  // URL wins over storage: a valid shared board takes precedence over any saved game.
  if (boardState) {
    return {
      boardSize: boardState.boardSize,
      difficulty: boardState.difficulty,
      source: "url-board",
      persisted: boardState,
      boardLink,
    };
  }

  if (hasUrl && persisted) {
    const urlSize = url.boardSize ?? persisted.boardSize;
    const urlDiff = url.difficulty ?? persisted.difficulty;
    if (urlSize === persisted.boardSize && urlDiff === persisted.difficulty) {
      return {
        boardSize: urlSize,
        difficulty: urlDiff,
        source: "url+storage",
        persisted,
        boardLink,
      };
    }
    // URL disagrees with storage (size OR difficulty) — URL wins.
    clearPersistedBoard();
    return {
      boardSize: urlSize,
      difficulty: urlDiff,
      source: "url-only",
      persisted: null,
      boardLink,
    };
  }

  if (hasUrl) {
    return {
      boardSize: url.boardSize ?? DEFAULT_BOARD_SIZE,
      difficulty: url.difficulty ?? DEFAULT_DIFFICULTY,
      source: "url-only",
      persisted: null,
      boardLink,
    };
  }

  if (persisted) {
    return {
      boardSize: persisted.boardSize,
      difficulty: persisted.difficulty,
      source: "storage-only",
      persisted,
      boardLink,
    };
  }

  return {
    boardSize: DEFAULT_BOARD_SIZE,
    difficulty: DEFAULT_DIFFICULTY,
    source: "fresh",
    persisted: null,
    boardLink,
  };
}

export function syncToUrl(boardSize: number, difficulty: Difficulty) {
  const url = new URL(window.location.href);
  url.searchParams.set("board_size", String(boardSize));
  url.searchParams.set("difficulty", difficulty);
  history.replaceState(null, "", url.toString());
}

// Write `?board=` on an explicit share act only (never ambient). Separate from
// syncToUrl, which by design only ever `.set()`s `board_size` and never deletes.
export function writeBoardToUrl(encoded: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("board", encoded);
  history.replaceState(null, "", url.toString());
}

// Drop `?board=` on Randomize/Clear — the shared configuration is stale once a new
// board is dealt. A dedicated `.delete()` helper: syncToUrl never deletes keys. Guarded
// to the active game (`?game=futoshiki`) for symmetry with Sudoku's helper — Futoshiki's
// composable only mounts when active, so this is belt-and-suspenders, not load-bearing.
export function dropBoardParam() {
  const url = new URL(window.location.href);
  if (url.searchParams.get("game") !== "futoshiki") return;
  if (!url.searchParams.has("board")) return;
  url.searchParams.delete("board");
  history.replaceState(null, "", url.toString());
}

export function persistBoard(state: PersistedBoard) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked — silently fail.
  }
}

export function clearPersistedBoard() {
  localStorage.removeItem(STORAGE_KEY);
}
