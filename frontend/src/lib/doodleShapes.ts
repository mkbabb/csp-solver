import type { RoughSVG } from 'roughjs/bin/svg';
import { mulberry32 } from '@/lib/prng';

// Yoshi's Story pastel palette
export const palette = [
    '#fbbf24', // amber
    '#f43f5e', // red/rose
    '#3b82f6', // blue
    '#22c55e', // green
    '#a855f7', // purple
    '#f97316', // orange
    '#ec4899', // pink
];

export interface Doodle {
    type: 'daisy' | 'music-note' | 'star' | 'heart-small' | 'spiral' | 'dot-cluster';
    x: number;
    y: number;
    size: number;
    color: string;
    opacity: number;
    seed: number;
}

/** Yoshi's Story daisy flower—big round petals around a smiley center. */
export function drawDaisy(
    rc: RoughSVG,
    cx: number,
    cy: number,
    s: number,
    doodle: Doodle,
): SVGGElement {
    const flowerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const petalCount = 6;
    const petalRadius = s * 0.22;
    const petalDist = s * 0.32;

    for (let p = 0; p < petalCount; p++) {
        const angle = (p / petalCount) * Math.PI * 2;
        const px = cx + Math.cos(angle) * petalDist;
        const py = cy + Math.sin(angle) * petalDist;

        const petal = rc.circle(px, py, petalRadius * 2, {
            roughness: 1.2,
            stroke: 'white',
            strokeWidth: 2,
            fill: 'white',
            fillStyle: 'solid',
            seed: doodle.seed + p,
        });
        flowerGroup.appendChild(petal);
    }

    // Orange center
    const center = rc.circle(cx, cy, s * 0.28, {
        roughness: 0.8,
        stroke: '#ea580c',
        strokeWidth: 2,
        fill: '#fb923c',
        fillStyle: 'solid',
        seed: doodle.seed + 10,
    });
    flowerGroup.appendChild(center);

    // Face dots (eyes)
    const leftEye = rc.circle(cx - s * 0.04, cy - s * 0.02, 3, {
        roughness: 0.5,
        stroke: '#7c2d12',
        strokeWidth: 1,
        fill: '#7c2d12',
        fillStyle: 'solid',
        seed: doodle.seed + 20,
    });
    const rightEye = rc.circle(cx + s * 0.04, cy - s * 0.02, 3, {
        roughness: 0.5,
        stroke: '#7c2d12',
        strokeWidth: 1,
        fill: '#7c2d12',
        fillStyle: 'solid',
        seed: doodle.seed + 21,
    });
    flowerGroup.appendChild(leftEye);
    flowerGroup.appendChild(rightEye);

    return flowerGroup as SVGGElement;
}

/** Single eighth note. */
export function drawMusicNote(
    rc: RoughSVG,
    cx: number,
    cy: number,
    s: number,
    doodle: Doodle,
): SVGGElement {
    const noteGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Stem
    const stem = rc.line(cx, cy, cx, cy - s * 0.6, {
        roughness: 1.0,
        stroke: doodle.color,
        strokeWidth: 2.5,
        seed: doodle.seed,
    });
    noteGroup.appendChild(stem);

    // Note head (filled ellipse)
    const head = rc.ellipse(cx - s * 0.08, cy, s * 0.22, s * 0.16, {
        roughness: 1.0,
        stroke: doodle.color,
        strokeWidth: 2,
        fill: doodle.color,
        fillStyle: 'solid',
        seed: doodle.seed + 1,
    });
    noteGroup.appendChild(head);

    // Flag
    const flag = rc.path(
        `M${cx},${cy - s * 0.6} C${cx + s * 0.2},${cy - s * 0.5} ${cx + s * 0.15},${cy - s * 0.35} ${cx + s * 0.05},${cy - s * 0.3}`,
        {
            roughness: 1.2,
            stroke: doodle.color,
            strokeWidth: 2,
            fill: 'none',
            seed: doodle.seed + 2,
        },
    );
    noteGroup.appendChild(flag);

    return noteGroup as SVGGElement;
}

/** Bold five-pointed star. */
export function drawStar(
    rc: RoughSVG,
    cx: number,
    cy: number,
    s: number,
    doodle: Doodle,
): SVGGElement {
    const pts: [number, number][] = [];
    for (let j = 0; j < 10; j++) {
        const angle = (j * Math.PI) / 5 - Math.PI / 2;
        const r = j % 2 === 0 ? s / 2 : s / 4.5;
        pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
    }
    return rc.polygon(pts, {
        roughness: 1.2,
        stroke: doodle.color,
        strokeWidth: 2.5,
        fill: doodle.color,
        fillStyle: 'hachure',
        fillWeight: 1.5,
        hachureGap: 4,
        seed: doodle.seed,
    }) as unknown as SVGGElement;
}

/** Small heart. */
export function drawHeartSmall(
    rc: RoughSVG,
    cx: number,
    cy: number,
    s: number,
    doodle: Doodle,
): SVGGElement {
    const heartPath = `M${cx},${cy + s * 0.15} C${cx},${cy + s * 0.15} ${cx - s * 0.3},${cy - s * 0.05} ${cx - s * 0.3},${cy - s * 0.15} C${cx - s * 0.3},${cy - s * 0.3} ${cx - s * 0.1},${cy - s * 0.35} ${cx},${cy - s * 0.15} C${cx + s * 0.1},${cy - s * 0.35} ${cx + s * 0.3},${cy - s * 0.3} ${cx + s * 0.3},${cy - s * 0.15} C${cx + s * 0.3},${cy - s * 0.05} ${cx},${cy + s * 0.15} ${cx},${cy + s * 0.15} Z`;
    return rc.path(heartPath, {
        roughness: 1.3,
        stroke: doodle.color,
        strokeWidth: 2.5,
        fill: doodle.color,
        fillStyle: 'hachure',
        fillWeight: 1.5,
        hachureGap: 3,
        seed: doodle.seed,
    }) as unknown as SVGGElement;
}

/** Bigger spiral. */
export function drawSpiral(
    rc: RoughSVG,
    cx: number,
    cy: number,
    s: number,
    doodle: Doodle,
): SVGGElement {
    let path = `M${cx},${cy}`;
    for (let t = 0; t < 16; t++) {
        const angle = (t / 16) * Math.PI * 3;
        const r = (t / 16) * s * 0.5;
        path += ` L${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
    }
    return rc.path(path, {
        roughness: 1.0,
        stroke: doodle.color,
        strokeWidth: 2.5,
        fill: 'none',
        seed: doodle.seed,
    }) as unknown as SVGGElement;
}

/** Cluster of randomized dots. */
export function drawDotCluster(
    rc: RoughSVG,
    cx: number,
    cy: number,
    s: number,
    doodle: Doodle,
): SVGGElement {
    const dotGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const dotRng = mulberry32(doodle.seed);
    for (let d = 0; d < 6; d++) {
        const dx = cx + (dotRng() - 0.5) * s;
        const dy = cy + (dotRng() - 0.5) * s;
        const dot = rc.circle(dx, dy, 6 + dotRng() * 8, {
            roughness: 0.8,
            stroke: doodle.color,
            strokeWidth: 1.5,
            fill: doodle.color,
            fillStyle: 'solid',
            seed: doodle.seed + d,
        });
        dotGroup.appendChild(dot);
    }
    return dotGroup as SVGGElement;
}

/** Dispatcher—calls the right draw function based on doodle.type. */
export function drawDoodleShape(
    rc: RoughSVG,
    cx: number,
    cy: number,
    s: number,
    doodle: Doodle,
): SVGGElement {
    switch (doodle.type) {
        case 'daisy':
            return drawDaisy(rc, cx, cy, s, doodle);
        case 'music-note':
            return drawMusicNote(rc, cx, cy, s, doodle);
        case 'star':
            return drawStar(rc, cx, cy, s, doodle);
        case 'heart-small':
            return drawHeartSmall(rc, cx, cy, s, doodle);
        case 'spiral':
            return drawSpiral(rc, cx, cy, s, doodle);
        case 'dot-cluster':
        default:
            return drawDotCluster(rc, cx, cy, s, doodle);
    }
}
