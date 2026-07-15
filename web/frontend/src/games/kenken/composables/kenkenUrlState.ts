/**
 * KenKen / Calcudoku's persistence + initial-state codec — the small per-game slice
 * `useKenken` hands the shared `useGameState` machine (the sibling of futoshiki's
 * `useUrlState` and killer's `killerUrlState`).
 *
 * v1 scope: the dealt board + its operator-cage furniture persist to localStorage under a
 * KENKEN-OWN key (never sudoku's/futoshiki's/killer's, so the games don't clobber each
 * other's saved board); the size/difficulty selectors ride the same blob. The `?board=`
 * share permalink is NOT yet wired for KenKen — `boardLink` is always `"absent"` and
 * `writeShareUrl` is a no-op — so a KenKen board round-trips across a reload but not (yet)
 * across a shared URL. The futoshiki technique engine is reused for Latin grading; the cage
 * relations are enforced authoritatively by the wasm solve.
 */
import type { Difficulty } from "@games/futoshiki/types";
import type { KenKenCage } from "../types";

/** The persisted KenKen board — the common board slice plus its cage furniture. */
export interface KenKenPersisted {
  values: Record<string, number>;
  givenCells: string[];
  originalGivenCells: string[];
  overriddenCells: string[];
  solvedValues: Record<string, number>;
  boardGeneration: number;
  cages: KenKenCage[];
}

/** The resolved initial state the machine boots from (common slice + the raw selector size). */
export interface InitialState {
  boardSize: number;
  difficulty: Difficulty;
  source: string;
  persisted: KenKenPersisted | null;
  boardLink: "absent" | "ok" | "invalid";
}

const STORAGE_KEY = "kenken-board-v1";
const DEFAULT_BOARD_SIZE = 4;

function isDifficulty(v: unknown): v is Difficulty {
  return v === "EASY" || v === "MEDIUM" || v === "HARD";
}

/** Read the persisted board (if any) and the selector defaults from localStorage. */
export function resolveInitialState(): InitialState {
  let persisted: KenKenPersisted | null = null;
  let boardSize = DEFAULT_BOARD_SIZE;
  let difficulty: Difficulty = "EASY";

  try {
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const p = JSON.parse(raw) as Record<string, unknown>;
      if (p && typeof p === "object" && p.values && typeof p.values === "object") {
        persisted = {
          values: p.values as Record<string, number>,
          givenCells: (p.givenCells as string[]) ?? [],
          originalGivenCells: (p.originalGivenCells as string[]) ?? [],
          overriddenCells: (p.overriddenCells as string[]) ?? [],
          solvedValues: (p.solvedValues as Record<string, number>) ?? {},
          boardGeneration: (p.boardGeneration as number) ?? 0,
          cages: (p.cages as KenKenCage[]) ?? [],
        };
        if (typeof p.boardSize === "number") boardSize = p.boardSize;
        if (isDifficulty(p.difficulty)) difficulty = p.difficulty;
      }
    }
  } catch {
    persisted = null;
  }

  return {
    boardSize,
    difficulty,
    source: persisted ? "restored" : "default",
    persisted,
    boardLink: "absent",
  };
}

/** v1: the selectors are not URL-synced for KenKen (they persist to localStorage instead). */
export function syncToUrl(_boardSize: number, _difficulty: Difficulty): void {}

/** Persist the board + its cage furniture + the selectors under the KenKen key. */
export function persistBoard(
  state: KenKenPersisted & { difficulty: Difficulty; boardSize: number },
): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable / over quota — persistence is best-effort.
  }
}

/** Drop the persisted KenKen board. */
export function clearPersistedBoard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // unavailable — nothing to clear.
  }
}

/** v1: no `?board=` permalink for KenKen yet, so there is no board param to drop. */
export function dropBoardParam(): void {}

/** v1: KenKen share permalink is not yet wired. */
export function writeShareUrl(): void {}
