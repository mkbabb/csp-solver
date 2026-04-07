import { mulberry32 } from './random';

/** Wobble-seeded diamond polygon (4 vertices). Returns SVG polygon `points` string. */
export function wobbleDiamond(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
): string {
  const rng = mulberry32(seed);
  const wobble = (rng() - 0.5) * 1.5;
  return [
    `${(cx + wobble).toFixed(1)},${(cy - ry + (rng() - 0.5) * 2).toFixed(1)}`,
    `${(cx + rx + (rng() - 0.5) * 2).toFixed(1)},${(cy + wobble).toFixed(1)}`,
    `${(cx + wobble).toFixed(1)},${(cy + ry + (rng() - 0.5) * 2).toFixed(1)}`,
    `${(cx - rx + (rng() - 0.5) * 2).toFixed(1)},${(cy + wobble).toFixed(1)}`,
  ].join(' ');
}

/** Wobble-seeded 5-point star polygon (10 vertices). Returns SVG polygon `points` string. */
export function wobbleStarPolygon(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  seed: number,
): string {
  const rng = mulberry32(seed);
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(angle) * radius + (rng() - 0.5) * 2;
    const y = cy + Math.sin(angle) * radius + (rng() - 0.5) * 2;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ');
}

/**
 * Generate irregular sun rays with per-ray seeded variation.
 * Some rays tall and skinny, others short and wide.
 */
export function generateSunRays(seed: number): { outerPoly: string; innerPoly: string } {
  const rng = mulberry32(seed);
  const cx = 100;
  const cy = 100;
  const numRays = 10;
  const outerPoints: string[] = [];
  const innerPoints: string[] = [];

  for (let i = 0; i < numRays; i++) {
    const baseAngle = (Math.PI * 2 * i) / numRays - Math.PI / 2;
    const midAngle = baseAngle + Math.PI / numRays;

    const outerR = 75 + rng() * 25;
    const outerAngle = baseAngle + (rng() - 0.5) * ((8 * Math.PI) / 180);
    const outerWobble = (rng() - 0.5) * 2.5;
    outerPoints.push(
      `${(cx + Math.cos(outerAngle) * outerR + outerWobble).toFixed(1)},${(cy + Math.sin(
        outerAngle,
      ) * outerR + outerWobble).toFixed(1)}`,
    );

    const innerR = 48 + rng() * 12;
    const innerAngle = midAngle + (rng() - 0.5) * ((8 * Math.PI) / 180);
    const innerWobble = (rng() - 0.5) * 2.5;
    outerPoints.push(
      `${(cx + Math.cos(innerAngle) * innerR + innerWobble).toFixed(1)},${(cy + Math.sin(
        innerAngle,
      ) * innerR + innerWobble).toFixed(1)}`,
    );

    const outerR2 = outerR - 5 + (rng() - 0.5) * 3;
    const innerR2 = innerR + 2 + (rng() - 0.5) * 2;
    innerPoints.push(
      `${(cx + Math.cos(outerAngle) * outerR2 + (rng() - 0.5) * 2).toFixed(1)},${(
        cy +
        Math.sin(outerAngle) * outerR2 +
        (rng() - 0.5) * 2
      ).toFixed(1)}`,
    );
    innerPoints.push(
      `${(cx + Math.cos(innerAngle) * innerR2 + (rng() - 0.5) * 2).toFixed(1)},${(
        cy +
        Math.sin(innerAngle) * innerR2 +
        (rng() - 0.5) * 2
      ).toFixed(1)}`,
    );
  }

  return {
    outerPoly: outerPoints.join(' '),
    innerPoly: innerPoints.join(' '),
  };
}

