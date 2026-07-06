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
  const cells = [...murmurCells.values()];
  const rng = mulberry32(seed * 31 + windowIndex);
  const pick = cells[Math.floor(rng() * cells.length)];
  pick?.wiggleOnce();
}
