/**
 * Celebration beat 3 — the classroom murmur (design-refinement.md §1.3).
 *
 * The finite 3-beat celebration replaces the old post-solve infinite-wiggle swarm (up to
 * boardSize² perpetual `createBoilTicker` subscribers). Beats 1–2 live per-cell in
 * HandwrittenGlyph as one-shot `sequence` tweens; this module owns the steady-state tail:
 * once the board settles, ONE registered solved cell wakes per 2.5s window and plays a
 * single wiggle cycle — a >99% duty-cycle cut versus the swarm, with the board still
 * visibly alive if you watch it.
 *
 * Generic by construction (position-keyed, imports no domain code) so it respects the
 * pencil→games import boundary. The loop is a `setTimeout` chain, NOT a scheduler
 * subscriber, so between wiggles it adds zero to the rAF subscriber floor — a settled
 * board reports exactly the ambient floor, and each murmur wiggle is a lone transient
 * `sequence` subscriber that self-removes.
 */

import { mulberry32 } from '@mkbabb/pencil-boil';
import { CELEBRATION } from '@pencil/config/pencilConfig';

interface MurmurCell {
  wiggleOnce: () => void;
}

const murmurCells = new Map<number, MurmurCell>();
/** The felt heart's murmur seat (T3-W9, F2 §C / F7 §3.2): when a celebration heart is
 *  mounted, 1-in-8 seeded windows wiggle IT instead of a cell. At most one heart exists
 *  per app (both games share the mount), so a single slot suffices. */
let murmurHeart: MurmurCell | null = null;
let murmurTimer: ReturnType<typeof setTimeout> | null = null;
let windowIndex = 0;
let seed = 1;
let lastUserEditAt = -Infinity;

/** Reseed the murmur so replays on the same board are deterministic (per boardGeneration). */
export function setMurmurSeed(nextSeed: number): void {
  seed = nextSeed >>> 0;
  windowIndex = 0;
}

/** A user edit is being made — the page is being written on; skip the next window. */
export function notifyUserEdit(): void {
  lastUserEditAt = performance.now();
}

export function registerMurmurCell(position: number, cell: MurmurCell): void {
  murmurCells.set(position, cell);
  ensureMurmurLoop();
}

export function unregisterMurmurCell(position: number): void {
  murmurCells.delete(position);
  if (murmurCells.size === 0) stopMurmurLoop();
}

/** The celebration heart joins the classroom (T3-W9). It never drives the loop —
 *  the murmur only runs while solved cells are registered, which is always true
 *  whenever a celebration heart is mounted. */
export function registerMurmurHeart(heart: MurmurCell): void {
  murmurHeart = heart;
}

export function unregisterMurmurHeart(): void {
  murmurHeart = null;
}

/** Test/settle hook — drop all registrations and halt the loop (board clear/regeneration). */
export function resetMurmur(): void {
  murmurCells.clear();
  stopMurmurLoop();
}

function ensureMurmurLoop(): void {
  if (murmurTimer !== null) return;
  scheduleNextWindow();
}

function stopMurmurLoop(): void {
  if (murmurTimer !== null) {
    clearTimeout(murmurTimer);
    murmurTimer = null;
  }
}

function scheduleNextWindow(): void {
  murmurTimer = setTimeout(() => {
    murmurTimer = null;
    tickWindow();
    if (murmurCells.size > 0) scheduleNextWindow();
  }, CELEBRATION.murmurWindowMs);
}

function tickWindow(): void {
  windowIndex++;
  if (murmurCells.size === 0) return;
  // The page is being written on — hold the murmur this window.
  if (performance.now() - lastUserEditAt < CELEBRATION.murmurWindowMs) return;
  const rng = mulberry32(seed * 31 + windowIndex);
  // T3-W9 (F2 §C / F7 §3.2): 1-in-8 seeded windows the felt heart murmurs instead of a
  // cell. The gate draw is consumed unconditionally so cell picks stay deterministic
  // per (seed, windowIndex) whether or not a heart is mounted.
  const heartTurn = Math.floor(rng() * 8) === 0;
  if (heartTurn && murmurHeart) {
    murmurHeart.wiggleOnce();
    return;
  }
  const cells = [...murmurCells.values()];
  const pick = cells[Math.floor(rng() * cells.length)];
  pick?.wiggleOnce();
}
