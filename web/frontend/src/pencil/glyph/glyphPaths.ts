/**
 * Pre-defined SVG path data for digits 1-9, 0, and A-G (for 16x16).
 * Each glyph has 2-3 hand-drawn variants in viewBox="0 0 40 56".
 * Paths are open strokes suitable for stroke-dasharray animation.
 *
 * All variants of the same glyph share identical SVG command structure
 * (same number of M, C, L commands) so keyframes.js can numerically
 * interpolate between them for wiggle/morph.
 *
 * These variants have REAL hand-drawn variation: different curvature,
 * slant, weight perception, and organic imperfections — like drawn
 * with a thick pencil or crayon.
 */

export interface GlyphData {
    /** SVG path d attribute */
    d: string;
    /** Pre-computed approximate path length for stroke-dasharray */
    length: number;
}

export type GlyphVariants = GlyphData[];

/**
 * Map of character -> array of hand-drawn variants.
 * viewBox: 0 0 40 56
 */
export const glyphPaths: Record<string, GlyphVariants> = {
    /* ───────── 1 ───────── */
    // Structure: M C C L (serif stroke, approach curve, stem line)
    '1': [
        {
            // upright, slight serif
            d: 'M13,16 C15,14 17,11 20,9 C20,9 20,10 20,10 L20,48',
            length: 48,
        },
        {
            // leaning right, longer serif approach
            d: 'M11,18 C14,15 17,12 22,8 C22,8 22,9 22,9 L21,49',
            length: 52,
        },
        {
            // more curved serif, slightly left-leaning stem
            d: 'M15,19 C17,16 19,12 21,8 C21,8 20,9 20,9 L19,48',
            length: 49,
        },
    ],

    /* ───────── 2 ───────── */
    // Structure: M C C C C L (arc top, swoop middle, approach bottom, bottom stroke)
    '2': [
        {
            // standard rounded 2
            d: 'M10,18 C10,10 16,5 23,6 C30,7 33,13 31,19 C29,26 19,35 10,46 L32,46',
            length: 102,
        },
        {
            // wider top loop, more angular descent
            d: 'M8,16 C8,7 17,3 25,5 C33,7 35,15 30,22 C25,30 16,38 8,47 L34,47',
            length: 110,
        },
        {
            // tighter top, swoopier middle, tilted
            d: 'M12,20 C13,13 18,7 24,7 C30,7 31,12 28,18 C25,25 17,34 11,46 L31,46',
            length: 98,
        },
    ],

    /* ───────── 3 ───────── */
    // Structure: M C C C C C C (top arc, mid pinch, bottom arc, return)
    '3': [
        {
            // balanced 3
            d: 'M11,12 C14,5 22,3 28,8 C34,13 29,21 21,25 C29,27 36,35 28,43 C20,51 11,48 10,41',
            length: 108,
        },
        {
            // wider, rounder, more relaxed
            d: 'M9,14 C11,4 21,1 29,7 C37,13 32,22 22,26 C32,28 38,37 29,45 C20,53 9,49 8,40',
            length: 118,
        },
        {
            // tighter, more angular, leaning right
            d: 'M13,10 C16,4 24,4 28,10 C32,16 27,22 20,24 C27,25 33,32 27,41 C21,50 13,47 12,42',
            length: 100,
        },
    ],

    /* ───────── 4 ───────── */
    // Structure: M C L C L (horizontal bar with approach curve, diagonal, stem)
    '4': [
        {
            // standard 4
            d: 'M28,36 C28,36 6,36 6,36 L22,6 C22,6 22,48 22,48 L22,48',
            length: 94,
        },
        {
            // leaning, wider crossbar
            d: 'M30,34 C30,34 4,35 4,35 L24,5 C24,5 24,49 24,49 L24,49',
            length: 100,
        },
        {
            // angular, tighter, crossbar higher
            d: 'M27,33 C27,33 7,33 7,33 L21,7 C21,7 21,48 21,48 L21,48',
            length: 90,
        },
    ],

    /* ───────── 5 ───────── */
    // Structure: M L L C C C C (top bar, vertical, belly curves, tail)
    '5': [
        {
            // standard 5
            d: 'M30,8 L12,8 L10,26 C14,22 20,21 26,25 C32,29 32,40 25,46 C18,52 10,46 10,44',
            length: 108,
        },
        {
            // wider belly, more swoopy
            d: 'M32,7 L11,7 L9,24 C13,19 21,18 28,23 C35,28 35,42 26,48 C17,54 8,47 8,44',
            length: 116,
        },
        {
            // tighter, angular top, rounder belly
            d: 'M29,9 L14,9 L12,27 C15,24 21,23 25,26 C29,29 30,39 24,44 C18,49 11,45 11,43',
            length: 100,
        },
    ],

    /* ───────── 6 ───────── */
    // Structure: M C C C C C C (swoop in, body, belly loop)
    '6': [
        {
            // standard 6
            d: 'M28,12 C22,4 12,6 10,18 C8,30 10,44 20,46 C30,48 34,38 30,30 C26,22 18,22 14,26 C10,30 10,38 12,38',
            length: 112,
        },
        {
            // rounder, wider belly, tilted entry
            d: 'M30,10 C23,2 10,5 8,20 C6,35 9,46 21,48 C33,50 36,38 31,28 C26,18 16,20 12,25 C8,30 8,40 11,40',
            length: 122,
        },
        {
            // tighter curl, more compact
            d: 'M26,14 C21,6 14,8 12,18 C10,28 12,42 20,44 C28,46 32,37 29,30 C26,23 20,22 16,26 C12,30 12,36 13,36',
            length: 104,
        },
    ],

    /* ───────── 7 ───────── */
    // Structure: M C C C (top bar as curve, angled stroke as curves for organic feel)
    '7': [
        {
            // standard 7
            d: 'M9,8 C15,8 26,8 32,8 C32,8 24,28 18,48 C18,48 18,48 18,48',
            length: 70,
        },
        {
            // wider, more sweep, slight curve in downstroke
            d: 'M7,9 C14,7 27,7 34,9 C34,9 26,30 20,49 C20,49 20,49 20,49',
            length: 76,
        },
        {
            // angular, tilted crossbar
            d: 'M10,10 C16,8 25,7 31,7 C31,7 22,27 17,47 C17,47 17,47 17,47',
            length: 68,
        },
    ],

    /* ───────── 8 ───────── */
    // Structure: M C C C C C C C (top loop, pinch, bottom loop, return)
    '8': [
        {
            // standard 8
            d: 'M20,28 C12,24 8,17 12,11 C16,5 24,5 28,11 C32,17 28,24 20,28 C12,32 6,39 10,45 C14,51 26,51 30,45 C34,39 28,32 20,28',
            length: 120,
        },
        {
            // wider bottom, rounder top, more organic
            d: 'M20,27 C10,22 6,16 11,9 C16,2 26,3 30,10 C34,17 29,23 20,27 C10,31 4,40 9,47 C14,54 28,53 32,46 C36,39 29,32 20,27',
            length: 130,
        },
        {
            // tighter, more angular pinch, tilted
            d: 'M21,29 C14,26 10,19 13,13 C16,7 23,6 27,12 C31,18 27,25 21,29 C14,33 8,38 11,43 C14,48 25,49 29,44 C33,39 27,33 21,29',
            length: 115,
        },
    ],

    /* ───────── 9 ───────── */
    // Structure: M C C C C C C (top loop, body, descending tail)
    '9': [
        {
            // standard 9
            d: 'M30,22 C30,22 32,14 26,9 C20,4 12,8 10,16 C8,24 14,30 22,30 C30,30 34,22 30,34 C26,46 14,50 10,46',
            length: 114,
        },
        {
            // rounder loop, longer tail, tilted
            d: 'M32,20 C32,20 35,11 27,6 C19,1 9,7 8,17 C7,27 14,33 24,32 C34,31 36,20 31,36 C26,52 12,52 8,47',
            length: 126,
        },
        {
            // tighter, more compact, angular
            d: 'M28,24 C28,24 30,16 25,11 C20,6 14,9 12,16 C10,23 16,28 22,28 C28,28 31,22 28,32 C25,42 16,48 12,45',
            length: 104,
        },
    ],

    /* ───────── 0 ───────── */
    // Structure: M C C C C (oval/ellipse with 4 curves)
    '0': [
        {
            // standard oval
            d: 'M20,6 C30,6 36,16 36,28 C36,40 30,50 20,50 C10,50 4,40 4,28 C4,16 10,6 20,6',
            length: 100,
        },
        {
            // wider, more egg-shaped (wider at bottom)
            d: 'M20,5 C32,5 38,15 37,28 C36,42 29,52 19,52 C9,52 2,41 3,28 C4,14 10,5 20,5',
            length: 108,
        },
        {
            // taller, narrower, tilted slightly
            d: 'M21,4 C29,4 33,14 34,28 C35,42 30,52 21,52 C12,52 7,42 6,28 C5,14 11,4 21,4',
            length: 104,
        },
    ],

    /* ───────── Hex Digits ───────── */

    // A: Structure: M C L C L (left leg, apex, right leg, crossbar approach, crossbar)
    A: [
        {
            d: 'M4,48 C4,48 12,24 20,6 C28,24 36,48 36,48 L30,34 L10,34',
            length: 110,
        },
        {
            d: 'M3,49 C3,49 11,22 21,5 C30,22 38,49 38,49 L31,33 L9,33',
            length: 116,
        },
    ],

    // B: Structure: M L L C C L C C L (stem, top bump, mid, bottom bump, base)
    B: [
        {
            d: 'M10,8 L10,48 L10,8 C10,8 18,8 24,8 C32,8 34,16 28,22 L10,22 C10,22 20,22 26,22 C36,22 36,38 26,44 L10,44 L10,48',
            length: 150,
        },
        {
            d: 'M11,7 L11,49 L11,7 C11,7 19,6 25,7 C34,8 35,17 29,23 L11,23 C11,23 21,23 27,23 C38,24 37,40 27,46 L11,46 L11,49',
            length: 158,
        },
    ],

    // C: Structure: M C C C C (open arc with 4 curves)
    C: [
        {
            d: 'M32,14 C28,6 20,4 14,8 C8,12 6,22 6,28 C6,34 8,44 14,48 C20,52 28,50 32,42',
            length: 82,
        },
        {
            d: 'M34,12 C29,3 19,2 12,7 C5,12 4,23 4,30 C4,37 7,46 14,50 C21,54 30,51 34,43',
            length: 90,
        },
    ],

    // D: Structure: M L L C C C L (stem, top, arc out, arc back, base)
    D: [
        {
            d: 'M10,8 L10,48 L10,8 C10,8 18,8 22,8 C36,8 38,28 38,28 C38,28 36,48 22,48 L10,48',
            length: 124,
        },
        {
            d: 'M11,7 L11,49 L11,7 C11,7 19,6 24,7 C38,9 40,28 40,29 C40,30 37,49 23,49 L11,49',
            length: 130,
        },
    ],

    // E: Structure: M L L L M L L (top bar, stem top, mid bar, stem bottom, base bar)
    E: [
        {
            d: 'M30,8 L10,8 L10,28 L26,28 M10,28 L10,48 L30,48',
            length: 108,
        },
        {
            d: 'M32,7 L9,7 L9,27 L28,27 M9,27 L9,49 L32,49',
            length: 116,
        },
    ],

    // F: Structure: M L L L M L (top bar, stem top, mid bar, stem bottom)
    F: [
        {
            d: 'M30,8 L10,8 L10,28 L26,28 M10,28 L10,48',
            length: 88,
        },
        {
            d: 'M32,7 L9,7 L9,27 L28,27 M9,27 L9,49',
            length: 94,
        },
    ],

    // G: Structure: M C C C C L L (open arc, horizontal bar, vertical bar)
    G: [
        {
            d: 'M32,14 C28,6 20,4 14,8 C8,12 6,22 6,28 C6,34 8,44 14,48 C20,52 28,50 32,42 L32,28 L22,28',
            length: 102,
        },
        {
            d: 'M34,12 C29,3 19,2 12,7 C5,12 4,23 4,30 C4,37 7,46 14,50 C21,54 30,51 34,43 L34,29 L23,29',
            length: 110,
        },
    ],
};
