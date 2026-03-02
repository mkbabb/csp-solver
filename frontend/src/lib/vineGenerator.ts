import rough from 'roughjs';
import { mulberry32 } from '@/lib/prng';
import { catmullRomToBezier } from '@/lib/pathGeneration';
import {
    type FruitPlacement,
    computeFruitPlacements,
    drawApple,
    drawBanana,
    drawGrapes,
    drawFlower,
    drawHeart,
    drawLeaf,
} from '@/lib/vineShapes';

export const VINE_PATH =
    'M 1880 1100 ' +
    'C 1885 980, 1875 860, 1875 740 ' +
    'C 1870 620, 1882 500, 1878 380 ' +
    'C 1874 260, 1880 160, 1870 90 ' +
    'C 1858 50, 1835 30, 1790 24 ' +
    'C 1700 18, 1600 22, 1500 26 ' +
    'C 1380 30, 1260 20, 1140 24 ' +
    'C 1020 28, 900 18, 780 22 ' +
    'C 660 26, 540 16, 420 20 ' +
    'C 300 24, 180 14, 60 20';

export function generateVine(
    svgRef: SVGSVGElement,
    reducedMotion: boolean,
    animateGrowth: (fruits: FruitPlacement[]) => void,
): void {
    const rc = rough.svg(svgRef);
    const vineGroup = svgRef.querySelector('.vine-main') as SVGGElement;
    const fruitGroup = svgRef.querySelector('.vine-fruits') as SVGGElement;
    if (!vineGroup || !fruitGroup) return;

    const rng = mulberry32(789);

    // Layer 1: Black outline (widest)
    const vineOutline = rc.path(VINE_PATH, {
        roughness: 1.8, stroke: '#1a1a1a', strokeWidth: 54,
        fill: 'none', seed: 40,
    });
    vineOutline.classList.add('vine-path');
    vineGroup.appendChild(vineOutline);

    // Layer 2: Main green fill
    const vineFill = rc.path(VINE_PATH, {
        roughness: 2.0, stroke: '#16a34a', strokeWidth: 36,
        fill: 'none', seed: 42,
    });
    vineFill.classList.add('vine-path');
    vineGroup.appendChild(vineFill);

    // Layer 3: Lighter highlight center
    const vineHighlight = rc.path(VINE_PATH, {
        roughness: 2.2, stroke: '#22c55e', strokeWidth: 15,
        fill: 'none', seed: 84,
    });
    vineHighlight.classList.add('vine-path');
    vineGroup.appendChild(vineHighlight);

    // Secondary vine strand — helically intertwines with the main vine
    const tempPathForHelix = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPathForHelix.setAttribute('d', VINE_PATH);
    svgRef.appendChild(tempPathForHelix);
    const helixLen = tempPathForHelix.getTotalLength();

    // Build a weaving path by sampling the main vine and offsetting perpendicular
    const helixPoints: [number, number][] = [];
    const helixSegments = 120;
    const waveFreq = 0.015;
    const waveFreq2 = 0.037; // secondary frequency
    const waveAmp = 24;
    const waveAmp2 = 8; // secondary amplitude

    for (let i = 0; i <= helixSegments; i++) {
        const t = (i / helixSegments) * helixLen;
        const pt = tempPathForHelix.getPointAtLength(t);
        const ptNext = tempPathForHelix.getPointAtLength(Math.min(t + 2, helixLen));

        const dx = ptNext.x - pt.x;
        const dy = ptNext.y - pt.y;
        const mag = Math.sqrt(dx * dx + dy * dy) || 1;

        const nx = -dy / mag;
        const ny = dx / mag;

        const wave = Math.sin(t * waveFreq) * waveAmp + Math.sin(t * waveFreq2) * waveAmp2 + (rng() - 0.5) * 6;
        const px = pt.x + nx * wave;
        const py = pt.y + ny * wave;

        helixPoints.push([px, py]);
    }

    const helixD = catmullRomToBezier(helixPoints);

    svgRef.removeChild(tempPathForHelix);

    // Draw the secondary vine strand (thinner, slightly different green)
    const helixOutline = rc.path(helixD, {
        roughness: 2.0, stroke: '#1a1a1a', strokeWidth: 28,
        fill: 'none', seed: 300,
    });
    helixOutline.classList.add('vine-path');
    vineGroup.appendChild(helixOutline);

    const helixFill = rc.path(helixD, {
        roughness: 2.2, stroke: '#15803d', strokeWidth: 20,
        fill: 'none', seed: 302,
    });
    helixFill.classList.add('vine-path');
    vineGroup.appendChild(helixFill);

    const helixHighlight = rc.path(helixD, {
        roughness: 2.4, stroke: '#4ade80', strokeWidth: 6,
        fill: 'none', seed: 304,
    });
    helixHighlight.classList.add('vine-path');
    vineGroup.appendChild(helixHighlight);

    // Thorns along the vine
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('d', VINE_PATH);
    svgRef.appendChild(tempPath);
    const vineLen = tempPath.getTotalLength();

    for (let dist = 40; dist < vineLen; dist += 30 + rng() * 30) {
        const pt = tempPath.getPointAtLength(dist);
        const ptNext = tempPath.getPointAtLength(Math.min(dist + 5, vineLen));

        const dx = ptNext.x - pt.x;
        const dy = ptNext.y - pt.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;

        const side = (Math.floor(dist / 60) % 2 === 0) ? 1 : -1;
        const nx = (-dy / len) * side;
        const ny = (dx / len) * side;

        const thornLen = 20 + rng() * 18;
        const thornPath = `M${pt.x},${pt.y} L${pt.x + nx * thornLen},${pt.y + ny * thornLen}`;

        const thorn = rc.path(thornPath, {
            roughness: 0.8, stroke: '#16a34a', strokeWidth: 6,
            fill: 'none', seed: Math.floor(rng() * 10000),
        });
        thorn.classList.add('vine-path');
        vineGroup.appendChild(thorn);
    }

    svgRef.removeChild(tempPath);

    // Small tendrils branching off the vine at intervals
    const tendrilPositions = [
        { x: 1878, y: 850, angle: 0.3, len: 90 },
        { x: 1872, y: 580, angle: -0.4, len: 82 },
        { x: 1880, y: 320, angle: 0.5, len: 97 },
        { x: 1870, y: 140, angle: -0.3, len: 75 },
        { x: 1750, y: 22, angle: -0.8, len: 82 },
        { x: 1300, y: 26, angle: -0.5, len: 75 },
        { x: 900, y: 22, angle: 0.6, len: 82 },
        { x: 600, y: 28, angle: -0.7, len: 75 },
        { x: 250, y: 24, angle: 0.5, len: 82 },
    ];

    tendrilPositions.forEach((t, i) => {
        const endX = t.x + Math.cos(t.angle) * t.len;
        const endY = t.y + Math.sin(t.angle) * t.len;
        // Curly tendril
        const ctrlX = t.x + Math.cos(t.angle + 0.8) * t.len * 0.7;
        const ctrlY = t.y + Math.sin(t.angle + 0.8) * t.len * 0.7;
        const tendrilPath = `M${t.x},${t.y} C${ctrlX},${ctrlY} ${endX + 5},${endY - 5} ${endX},${endY}`;
        const tendril = rc.path(tendrilPath, {
            roughness: 1.3,
            stroke: '#22c55e',
            strokeWidth: 5,
            fill: 'none',
            seed: 200 + i,
        });
        tendril.classList.add('vine-path');
        vineGroup.appendChild(tendril);
    });

    // Place fruits along the vine
    const fruits = computeFruitPlacements(rng);

    fruits.forEach((fruit, i) => {
        let fruitSvg: SVGGElement;

        switch (fruit.type) {
            case 'banana':
                fruitSvg = drawBanana(rc, fruit.x, fruit.y, fruit.size, fruit.seed);
                break;
            case 'grapes':
                fruitSvg = drawGrapes(rc, fruit.x, fruit.y, fruit.size, fruit.seed);
                break;
            case 'apple':
                fruitSvg = drawApple(rc, fruit.x, fruit.y, fruit.size, fruit.seed);
                break;
            case 'flower':
                fruitSvg = drawFlower(rc, fruit.x, fruit.y, fruit.size, fruit.seed);
                break;
            case 'heart': {
                const isLarge = i === fruits.length - 1; // Last one is the culminating heart
                fruitSvg = drawHeart(rc, fruit.x, fruit.y, fruit.size, fruit.seed, isLarge);
                break;
            }
            case 'leaf':
                fruitSvg = drawLeaf(rc, fruit.x, fruit.y, fruit.size, fruit.seed);
                break;
            default:
                return;
        }

        fruitSvg.classList.add('fruit-item');
        fruitSvg.setAttribute('data-t', String(fruit.t));
        fruitSvg.setAttribute('data-rotation', String(fruit.rotation));
        fruitSvg.style.transformOrigin = `${fruit.x}px ${fruit.y}px`;

        if (!reducedMotion) {
            fruitSvg.style.opacity = '0';
            fruitSvg.style.transform = 'scale(0)';
        } else {
            fruitSvg.style.transform = `rotate(${fruit.rotation}deg)`;
        }

        fruitGroup.appendChild(fruitSvg);
    });

    // Animate
    if (!reducedMotion) {
        animateGrowth(fruits);
    }
}
