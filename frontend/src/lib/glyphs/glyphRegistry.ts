/**
 * Glyph registry: deterministic variant selection and display character mapping.
 */

import { glyphPaths, type GlyphData } from './glyphPaths';

/**
 * Deterministic hash using cell row, column, and character.
 * Uses the Knuth multiplicative hash to spread values evenly,
 * combined with character code mixing for extra entropy.
 * This ensures neighboring cells get genuinely different variants
 * while remaining stable across re-renders.
 */
function cellHash(char: string, cellPosition: number): number {
    // Decompose position into row/col for better spatial distribution
    // (position = row * boardSize + col, but we don't need exact decomposition)
    let h = (cellPosition * 2654435761) >>> 0; // Knuth multiplicative hash
    // Mix in character value with bit rotation
    for (let i = 0; i < char.length; i++) {
        h ^= char.charCodeAt(i) * 0x5bd1e995;
        h = ((h << 13) | (h >>> 19)) ^ h;
        h = (h * 5 + 0xe6546b64) >>> 0;
    }
    // Final avalanche
    h ^= h >>> 16;
    h = (h * 0x85ebca6b) >>> 0;
    h ^= h >>> 13;
    return h >>> 0;
}

/**
 * Pick a deterministic variant index based on character and cell position.
 * Uses spatial hashing so adjacent cells are very likely to get different variants.
 */
export function pickVariantIndex(
    char: string,
    cellPosition: number,
    variantCount: number,
): number {
    return cellHash(char, cellPosition) % variantCount;
}

/**
 * Get a specific glyph variant for a character at a given position.
 */
export function getVariant(char: string, cellPosition: number): GlyphData | null {
    const variants = glyphPaths[char];
    if (!variants || variants.length === 0) return null;

    const idx = pickVariantIndex(char, cellPosition, variants.length);
    return variants[idx];
}

/**
 * Get all variants for a character (for wiggle animation).
 */
export function getAllVariants(char: string): GlyphData[] {
    return glyphPaths[char] ?? [];
}

/**
 * Convert a numeric value to a display character, supporting hex for 16x16.
 */
export function toDisplayChar(value: number, boardSize: number): string {
    if (value === 0) return '';
    if (boardSize <= 9) return String(value);
    // 16x16: 1-9 as digits, 10-16 as A-G
    if (value <= 9) return String(value);
    return String.fromCharCode(55 + value); // 10 -> 'A', 11 -> 'B', etc.
}
