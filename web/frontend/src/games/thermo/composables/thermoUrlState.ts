/**
 * Thermo-Sudoku's persistence + initial-state codec — the small per-game slice `useThermo`
 * hands the shared `useGameState` machine (the sibling of sudoku's `useUrlState`).
 *
 * v1 scope: the dealt board + its thermometer furniture persist to localStorage under a
 * THERMO-OWN key (never sudoku's, so the two games don't clobber each other's saved board);
 * the size/difficulty selectors ride the same blob. The `?board=` share permalink is NOT
 * yet wired for Thermo — `boardLink` is always `"absent"` and `writeShareUrl` is a no-op —
 * so a Thermo board round-trips across a reload but not (yet) across a shared URL. Sudoku's
 * technique engine is reused for grading (the sudoku half of the board); the thermometer
 * relation is enforced authoritatively by the wasm solve.
 */
import type { Difficulty } from "@games/shared/types";
import type { ThermoLine } from "../types";

/** The persisted Thermo board — the common board slice plus its thermometer furniture. */
export interface ThermoPersisted {
  values: Record<string, number>;
  givenCells: string[];
  originalGivenCells: string[];
  overriddenCells: string[];
  solvedValues: Record<string, number>;
  boardGeneration: number;
  thermometers: ThermoLine[];
}

/** The resolved initial state the machine boots from (common slice + the raw selector size). */
export interface InitialState {
  size: number;
  difficulty: Difficulty;
  source: string;
  persisted: ThermoPersisted | null;
  boardLink: "absent" | "ok" | "invalid";
}

/** Thermo's board on disk. Exported so `spec.urlCodec.key` NAMES this one string rather than
 *  mirroring it — the same discipline sudoku's `STORAGE_KEY` carries. */
export const STORAGE_KEY = "thermo-board-v1";
const DEFAULT_SIZE = 3;

function isDifficulty(v: unknown): v is Difficulty {
  return v === "EASY" || v === "MEDIUM" || v === "HARD";
}

/** Read the persisted board (if any) and the selector defaults from localStorage. */
export function resolveInitialState(): InitialState {
  let persisted: ThermoPersisted | null = null;
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
          thermometers: (p.thermometers as ThermoLine[]) ?? [],
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

/** v1: the selectors are not URL-synced for Thermo (they persist to localStorage instead). */
export function syncToUrl(_size: number, _difficulty: Difficulty): void {}

/** Persist the board + its thermometer furniture + the selectors under the Thermo key. */
export function persistBoard(
  state: ThermoPersisted & { difficulty: Difficulty; size: number },
): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable / over quota — persistence is best-effort.
  }
}

/** Drop the persisted Thermo board. */
export function clearPersistedBoard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // unavailable — nothing to clear.
  }
}

/** v1: no `?board=` permalink for Thermo yet, so there is no board param to drop. */
export function dropBoardParam(): void {}

/** v1: Thermo share permalink is not yet wired. */
export function writeShareUrl(): void {}
