import { mulberry32 } from '@mkbabb/pencil-boil';

const cache = new Map<string, string>();
const CACHE_MAX = 256;

function cached(key: string, generate: () => string): string {
    const hit = cache.get(key);
    if (hit) return hit;
    const result = generate();
    cache.set(key, result);
    if (cache.size > CACHE_MAX) {
        cache.delete(cache.keys().next().value!);
    }
    return result;
}

/** Generate a lighter ghost underline for hover state (thinner, more transparent). Returns data URI string. */
export function ghostUnderline(seed: number, color: string): string {
    return cached(`g:${seed}:${color}`, () => _ghostUnderline(seed, color));
}

function _ghostUnderline(seed: number, color: string): string {
    const rng = mulberry32(seed * 7 + 31);
    const w = 100, h = 12;
    const startX = 2 + rng() * 2;
    const endX = w - 2 - rng() * 2;
    const baseY = h * 0.5;

    let d = `M${startX.toFixed(1)},${(baseY + (rng() - 0.5) * 2).toFixed(1)}`;
    const segs = 3 + Math.floor(rng() * 2);
    for (let i = 1; i <= segs; i++) {
        const x = startX + ((endX - startX) * i) / segs;
        const y = baseY + (rng() - 0.5) * 3;
        const cpx = startX + ((endX - startX) * (i - 0.5)) / segs + (rng() - 0.5) * 6;
        const cpy = baseY + (rng() - 0.5) * 4;
        d += ` Q${cpx.toFixed(1)},${cpy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    }

    const sw = 1.2 + rng() * 0.8;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'><path d='${d}' fill='none' stroke='${color}' stroke-width='${sw.toFixed(1)}' stroke-linecap='round' stroke-linejoin='round' opacity='0.4'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Generate a hand-drawn scribble underline (double-stroke pencil effect). Returns data URI string. */
export function scribbleUnderline(seed: number, color: string): string {
    return cached(`s:${seed}:${color}`, () => _scribbleUnderline(seed, color));
}

function _scribbleUnderline(seed: number, color: string): string {
    const rng = mulberry32(seed * 13 + 47);
    const w = 100, h = 12;
    const startX = 2 + rng() * 1;
    const endX = w - 2 - rng() * 1;
    const baseY = h * 0.5;

    // First pass -- main wobbly stroke
    let d = `M${startX.toFixed(1)},${(baseY + (rng() - 0.5) * 3).toFixed(1)}`;
    const segs = 4 + Math.floor(rng() * 3);
    for (let i = 1; i <= segs; i++) {
        const x = startX + ((endX - startX) * i) / segs;
        const y = baseY + (rng() - 0.5) * 5;
        const cpx = startX + ((endX - startX) * (i - 0.5)) / segs + (rng() - 0.5) * 8;
        const cpy = baseY + (rng() - 0.5) * 6;
        d += ` Q${cpx.toFixed(1)},${cpy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    }

    // Second pass -- slightly offset retrace for pencil "double-stroke" effect
    const offset = 1.5 + rng() * 1.5;
    d += ` M${(endX - rng() * 4).toFixed(1)},${(baseY + offset + (rng() - 0.5) * 2).toFixed(1)}`;
    const segs2 = 3 + Math.floor(rng() * 2);
    for (let i = 1; i <= segs2; i++) {
        const x = endX - ((endX - startX) * i) / segs2;
        const y = baseY + offset + (rng() - 0.5) * 4;
        const cpx = endX - ((endX - startX) * (i - 0.5)) / segs2 + (rng() - 0.5) * 10;
        const cpy = baseY + offset + (rng() - 0.5) * 5;
        d += ` Q${cpx.toFixed(1)},${cpy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    }

    // Varying stroke width simulated via multiple thin strokes in the SVG
    const sw = 1.8 + rng() * 1.2;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'><path d='${d}' fill='none' stroke='${color}' stroke-width='${sw.toFixed(1)}' stroke-linecap='round' stroke-linejoin='round' opacity='0.85'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
