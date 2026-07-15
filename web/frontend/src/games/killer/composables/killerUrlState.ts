/**
 * Killer-Sudoku's persistence + initial-state codec — the small per-game slice `useKiller`
 * hands the shared `useGameState` machine (the sibling of sudoku's `useUrlState` and
 * thermo's `thermoUrlState`).
 *
 * v1 scope: the dealt board + its cage furniture persist to localStorage under a
 * KILLER-OWN key (never sudoku's/thermo's, so the games don't clobber each other's saved
 * board); the size/difficulty selectors ride the same blob. The `?board=` share permalink
 * is NOT yet wired for Killer — `boardLink` is always `"absent"` and `writeShareUrl` is a
 * no-op — so a Killer board round-trips across a reload but not (yet) across a shared URL.
 * Sudoku's technique engine is reused for grading (the sudoku half of the board); the cage
 * relation is enforced authoritatively by the wasm solve.
 */
import type { Difficulty } from "@games/sudoku/types";
import type { KillerCage } from "../types";

/** The persisted Killer board — the common board slice plus its cage furniture. */
export interface KillerPersisted {
  values: Record<string, number>;
  givenCells: string[];
  originalGivenCells: string[];
  overriddenCells: string[];
  solvedValues: Record<string, number>;
  boardGeneration: number;
  cages: KillerCage[];
}

/** The resolved initial state the machine boots from (common slice + the raw selector size). */
export interface InitialState {
  size: number;
  difficulty: Difficulty;
  source: string;
  persisted: KillerPersisted | null;
  boardLink: "absent" | "ok" | "invalid";
}

const STORAGE_KEY = "killer-board-v1";
const DEFAULT_SIZE = 3;

function isDifficulty(v: unknown): v is Difficulty {
  return v === "EASY" || v === "MEDIUM" || v === "HARD";
}

/** Read the persisted board (if any) and the selector defaults from localStorage. */
export function resolveInitialState(): InitialState {
  let persisted: KillerPersisted | null = null;
  let size = DEFAULT_SIZE;
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
          cages: (p.cages as KillerCage[]) ?? [],
        };
        if (typeof p.size === "number") size = p.size;
        if (isDifficulty(p.difficulty)) difficulty = p.difficulty;
      }
    }
  } catch {
    persisted = null;
  }

  return {
    size,
    difficulty,
    source: persisted ? "restored" : "default",
    persisted,
    boardLink: "absent",
  };
}

/** v1: the selectors are not URL-synced for Killer (they persist to localStorage instead). */
export function syncToUrl(_size: number, _difficulty: Difficulty): void {}

/** Persist the board + its cage furniture + the selectors under the Killer key. */
export function persistBoard(
  state: KillerPersisted & { difficulty: Difficulty; size: number },
): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable / over quota — persistence is best-effort.
  }
}

/** Drop the persisted Killer board. */
export function clearPersistedBoard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // unavailable — nothing to clear.
  }
}

/** v1: no `?board=` permalink for Killer yet, so there is no board param to drop. */
export function dropBoardParam(): void {}

/** v1: Killer share permalink is not yet wired. */
export function writeShareUrl(): void {}
