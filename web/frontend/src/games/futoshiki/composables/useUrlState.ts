/**
 * URL + localStorage persistence for Futoshiki. Own file (games never import each
 * other) with a materially different shape from Sudoku's:
 *   - The URL param is `board_size`, never bare `size` (F5). Sudoku owns `?size=` +
 *     `?difficulty=`; Futoshiki owns `?board_size=`, so both games can co-exist in one
 *     URL while `?game=` (App.vue) selects which is active.
 *   - There is no `difficulty` (F3).
 *   - `PersistedBoard` carries `inequalities` — permanent board furniture — which does
 *     NOT participate in given/overridden bookkeeping.
 */
import { toBase64Url, fromBase64Url } from "@/lib/base64url";
import { VALID_BOARD_SIZES, type Inequality } from "../types";

const STORAGE_KEY = "futoshiki-board-state";
const DEFAULT_BOARD_SIZE = 5;
const VALID_SIZES: readonly number[] = VALID_BOARD_SIZES;

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
  source: InitSource;
  persisted: PersistedBoard | null;
  // The `?board=` decode outcome, observable by the UI: "absent" (no link),
  // "ok" (a shared board was restored), or "invalid" (a link was present but failed
  // to decode — the corrupt-link signal, never a silent fresh deal). Read by the
  // design lane to surface a one-line notice.
  boardLink: "absent" | "ok" | "invalid";
}

function parseUrlParams(): { boardSize: number | null } {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("board_size");
  const n = raw ? parseInt(raw, 10) : null;
  return { boardSize: n !== null && VALID_SIZES.includes(n) ? n : null };
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

// ── Codec version byte (T4-W3) ──────────────────────────────────────────────
// A single leading byte tags the encoded payload so a future breaking codec revision
// can't silently decode an old link into a *different* board. The byte's ABSENCE is
// version 0 — every pre-wave link (its payload opens with the size digit, char code
// ≥ 0x30) still decodes: the graceful ratchet. This wave writes version 1, whose body
// is structurally identical to v0 (`${boardSize}.${cells}.${ineqs}`), so v0 and v1
// share the decode below; only the tag differs. Any control-range (< 0x30) leading
// byte that isn't a version this build understands fails closed → the corrupt-link
// signal.
const CODEC_VERSION = 1;
const VERSION_BYTE_FLOOR = 0x30; // '0' — a v0 body always opens ≥ here (the size digit)

// Peel the version byte off a decoded payload: returns the numeric version and the
// remaining body, or null when the leading byte is control-range but not a version
// this build understands (fail closed).
function readCodecVersion(payload: string): { version: number; body: string } | null {
  const lead = payload.charCodeAt(0);
  // Empty payload → NaN; a digit-led legacy body → ≥ 0x30. Either way, version 0.
  if (Number.isNaN(lead) || lead >= VERSION_BYTE_FLOOR)
    return { version: 0, body: payload };
  if (lead !== CODEC_VERSION) return null; // unknown version → reject
  return { version: lead, body: payload.slice(1) };
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
function decodeBoardParam(urlSize: number | null): BoardDecode {
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
  // Strip the version byte (absent = v0); an unknown version fails closed.
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
  const decoded = decodeBoardParam(url.boardSize);
  const boardLink = decoded.status;
  const boardState = decoded.status === "ok" ? decoded.board : null;
  const persisted = loadPersistedBoard();
  // hasUrl ORs in a VALID board so a board-only link isn't silently dropped (an
  // invalid board fell closed → boardState null → falls through to the size path
  // while boardLink carries the "invalid" corrupt-link signal for the UI).
  const hasUrl = url.boardSize !== null || boardState !== null;

  // URL wins over storage: a valid shared board takes precedence over any saved game.
  if (boardState) {
    return {
      boardSize: boardState.boardSize,
      source: "url-board",
      persisted: boardState,
      boardLink,
    };
  }

  if (hasUrl && persisted) {
    if (url.boardSize === persisted.boardSize) {
      return { boardSize: url.boardSize!, source: "url+storage", persisted, boardLink };
    }
    // URL disagrees with storage — URL wins.
    clearPersistedBoard();
    return {
      boardSize: url.boardSize!,
      source: "url-only",
      persisted: null,
      boardLink,
    };
  }

  if (hasUrl) {
    return {
      boardSize: url.boardSize!,
      source: "url-only",
      persisted: null,
      boardLink,
    };
  }

  if (persisted) {
    return {
      boardSize: persisted.boardSize,
      source: "storage-only",
      persisted,
      boardLink,
    };
  }

  return { boardSize: DEFAULT_BOARD_SIZE, source: "fresh", persisted: null, boardLink };
}

export function syncToUrl(boardSize: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("board_size", String(boardSize));
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
