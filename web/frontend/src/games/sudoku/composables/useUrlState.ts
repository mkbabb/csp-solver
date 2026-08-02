import { toBase64Url, fromBase64Url } from "@/lib/base64url";
import type { Difficulty } from "@games/shared/types";

/** Sudoku's board on disk. Exported so `spec.urlCodec.key` NAMES this one string rather
 *  than mirroring it — the card row's ledger source reads it back off the spec. */
export const STORAGE_KEY = "sudoku-board-state";
const VALID_SIZES = [2, 3, 4];
// Reflected-DoS bound: a legit `?board=` is < 1 KB (size 4 → 256 cells → ~344 chars
// base64); reject anything past this before `atob`. Symmetric with Futoshiki's guard.
const MAX_BOARD_PARAM_LEN = 4096;
const VALID_DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

// 'url-board' — a shared `?board=` permalink was decoded into a full board and wins
// over storage (URL wins on load). Distinct from 'url-only' (bare size/difficulty) so
// the composable knows to RESTORE the synthesized board rather than auto-randomize.
type InitSource = "fresh" | "url-only" | "storage-only" | "url+storage" | "url-board";

export interface PersistedBoard {
  size: number;
  difficulty: Difficulty;
  values: Record<string, number>;
  givenCells: string[];
  originalGivenCells: string[];
  overriddenCells: string[];
  solvedValues: Record<string, number>;
  boardGeneration: number;
}

export interface InitialState {
  size: number;
  difficulty: Difficulty;
  source: InitSource;
  persisted: PersistedBoard | null;
  // The `?board=` decode outcome, observable by the UI: "absent" (no link),
  // "ok" (a shared board was restored), or "invalid" (a link was present but failed
  // to decode — the corrupt-link signal, never a silent fresh deal). Read by the
  // design lane to surface a one-line notice.
  boardLink: "absent" | "ok" | "invalid";
}

function parseUrlParams(): { size: number | null; difficulty: Difficulty | null } {
  const params = new URLSearchParams(window.location.search);
  const rawSize = params.get("size");
  const rawDiff = params.get("difficulty");

  const size = rawSize ? parseInt(rawSize, 10) : null;
  const difficulty = rawDiff?.toUpperCase() as Difficulty | undefined;

  return {
    size: size !== null && VALID_SIZES.includes(size) ? size : null,
    difficulty:
      difficulty && VALID_DIFFICULTIES.includes(difficulty) ? difficulty : null,
  };
}

function loadPersistedBoard(): PersistedBoard | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedBoard;
    // Basic shape validation
    if (
      !VALID_SIZES.includes(data.size) ||
      !VALID_DIFFICULTIES.includes(data.difficulty) ||
      typeof data.values !== "object" ||
      !Array.isArray(data.givenCells)
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function randomDifficulty(): Difficulty {
  return VALID_DIFFICULTIES[Math.floor(Math.random() * VALID_DIFFICULTIES.length)];
}

// ── Share-on-demand permalink codec (`?board=`) ─────────────────────────
// base64url of `${size}.${cells}` where `cells` is one base-36 char per cell
// value (0 = empty), length = size**4. Self-describing (carries its own size) so
// a board-only link — no `?size=` — still loads, and a mismatch fails closed. The
// base64url codec is hoisted to `@/lib/base64url` (shared with Futoshiki's).

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
  size: number,
  values: Record<string, number>,
  totalCells: number,
): string {
  let cells = "";
  for (let i = 0; i < totalCells; i++) cells += (values[String(i)] ?? 0).toString(36);
  // Prepend the codec version byte before base64url (T4-W3) — see readCodecVersion.
  return toBase64Url(String.fromCharCode(CODEC_VERSION) + `${size}.${cells}`);
}

// The decode outcome, made observable: "absent" (no `?board=`), "ok" (a board), or
// "invalid" (a link was present but failed closed). Replaces the old `null`-for-both
// silent degrade so the UI can tell a corrupt link from no link.
type BoardDecode =
  | { status: "absent" }
  | { status: "ok"; board: PersistedBoard }
  | { status: "invalid" };

// Synthesize a PersistedBoard from a decoded `?board=` — the only board-shaped object
// ever built from URL content (localStorage is the only other source). Non-zero cells
// become the givens (share = "solve this configuration"). FAILS CLOSED to `invalid` on
// any malformed/out-of-range/size-mismatched/unknown-version blob so a corrupt link
// degrades to the size/difficulty-only path, never a corrupt board — but the failure
// is now observable, not a silent fresh deal.
function decodeBoardParam(
  urlSize: number | null,
  urlDifficulty: Difficulty | null,
): BoardDecode {
  const raw = new URLSearchParams(window.location.search).get("board");
  if (!raw) return { status: "absent" };
  // Fail closed on an oversized param BEFORE decoding — symmetric DoS bound.
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
  const body = versioned.body;
  const dot = body.indexOf(".");
  if (dot < 1) return { status: "invalid" };
  const sizeStr = body.slice(0, dot);
  // Strict canonical size — reject leading whitespace / sign / hex `parseInt` leniency
  // (`" 2"`, `"-2"`, `"0x2"` fail closed here; G8-P3).
  if (!/^\d+$/.test(sizeStr)) return { status: "invalid" };
  const size = parseInt(sizeStr, 10);
  if (!VALID_SIZES.includes(size)) return { status: "invalid" };
  // (c) a `?size=` that disagrees with the board's own size fails closed.
  if (urlSize !== null && urlSize !== size) return { status: "invalid" };
  const cells = body.slice(dot + 1);
  const totalCells = size ** 4;
  // (c) a length mismatch (wrong cell count for the declared size) fails closed.
  if (cells.length !== totalCells) return { status: "invalid" };
  const maxVal = size ** 2;
  const values: Record<string, number> = {};
  const givenCells: string[] = [];
  for (let i = 0; i < totalCells; i++) {
    const v = parseInt(cells[i]!, 36);
    if (!Number.isInteger(v) || v < 0 || v > maxVal) return { status: "invalid" };
    values[String(i)] = v;
    if (v !== 0) givenCells.push(String(i));
  }
  return {
    status: "ok",
    board: {
      size,
      difficulty: urlDifficulty ?? "EASY",
      values,
      givenCells,
      originalGivenCells: givenCells,
      overriddenCells: [],
      solvedValues: {},
      boardGeneration: 1,
    },
  };
}

export function resolveInitialState(): InitialState {
  const url = parseUrlParams();
  // (b) a shared board decoded into a PersistedBoard, or a discriminated failure.
  const decoded = decodeBoardParam(url.size, url.difficulty);
  const boardLink = decoded.status;
  const boardState = decoded.status === "ok" ? decoded.board : null;
  // A REFUSED LINK LEAVES THE BAR, HERE (T5-W2 seal-fix). Failing closed and cleaning up are
  // one act: a `?board=` the app just refused to open would otherwise stand in the address bar
  // describing a board that isn't there, and a reload or a re-share re-serves the same lie.
  // Deleted at the decode, not as a side effect of the degraded path's mount deal — that route
  // only ever worked because a fresh deal happens to call `dropBoardParam` on the way past, so
  // the cleanup raced the solver and lost under WebKit (permalink.spec.ts row 6). The side
  // effect sits where `clearPersistedBoard()` below already sits: a resolve that finds the URL
  // and the world disagreeing corrects the world. `linkError` is read off `boardLink`, so the
  // corrupt-link notice still fires — the notice is the signal, the stale param never was.
  if (decoded.status === "invalid") dropBoardParam();
  const persisted = loadPersistedBoard();
  // (a) hasUrl ORs in a VALID board so a board-only link isn't silently dropped (an
  // invalid board fell closed → boardState null → falls through to size/difficulty
  // while boardLink carries the "invalid" corrupt-link signal for the UI).
  const hasUrl = url.size !== null || url.difficulty !== null || boardState !== null;

  // URL wins over storage: a valid shared board takes precedence over any saved game.
  if (boardState) {
    return {
      size: boardState.size,
      difficulty: boardState.difficulty,
      source: "url-board",
      persisted: boardState,
      boardLink,
    };
  }

  if (hasUrl && persisted) {
    const urlSize = url.size ?? persisted.size;
    const urlDiff = url.difficulty ?? persisted.difficulty;
    if (urlSize === persisted.size && urlDiff === persisted.difficulty) {
      return {
        size: urlSize,
        difficulty: urlDiff,
        source: "url+storage",
        persisted,
        boardLink,
      };
    }
    // URL disagrees with storage — URL wins
    clearPersistedBoard();
    return {
      size: urlSize,
      difficulty: urlDiff,
      source: "url-only",
      persisted: null,
      boardLink,
    };
  }

  if (hasUrl) {
    return {
      size: url.size ?? 3,
      difficulty: url.difficulty ?? "EASY",
      source: "url-only",
      persisted: null,
      boardLink,
    };
  }

  if (persisted) {
    return {
      size: persisted.size,
      difficulty: persisted.difficulty,
      source: "storage-only",
      persisted,
      boardLink,
    };
  }

  return {
    size: 3,
    difficulty: randomDifficulty(),
    source: "fresh",
    persisted: null,
    boardLink,
  };
}

export function syncToUrl(size: number, difficulty: Difficulty) {
  const url = new URL(window.location.href);
  url.searchParams.set("size", String(size));
  url.searchParams.set("difficulty", difficulty);
  history.replaceState(null, "", url.toString());
}

// Write `?board=` on an explicit share act only (never ambient — that would defeat
// the clean size/difficulty surface). Separate from syncToUrl, which by design only
// ever `.set()`s its own keys and never deletes.
export function writeBoardToUrl(encoded: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("board", encoded);
  history.replaceState(null, "", url.toString());
}

// Drop `?board=` on Randomize/Clear — the shared configuration is stale the moment a
// new board is dealt. A dedicated `.delete()` helper: syncToUrl never deletes keys.
// Only the ACTIVE game manages `?board=`: on a Futoshiki deep-link, App.vue still
// instantiates useSudoku in the background and its fire-and-forget init randomize would
// otherwise nuke Futoshiki's shared board before FutoshikiGame even mounts.
export function dropBoardParam() {
  const url = new URL(window.location.href);
  if (url.searchParams.get("game") === "futoshiki") return;
  if (!url.searchParams.has("board")) return;
  url.searchParams.delete("board");
  history.replaceState(null, "", url.toString());
}

export function persistBoard(state: PersistedBoard) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked — silently fail
  }
}

export function clearPersistedBoard() {
  localStorage.removeItem(STORAGE_KEY);
}
