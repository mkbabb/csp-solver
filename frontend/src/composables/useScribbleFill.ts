import { onUnmounted } from 'vue';
import { Animation } from '@mkbabb/keyframes.js';

/**
 * Composable for "traveling visible window" / snake effect on scribble fill strokes.
 * Drives stroke-dashoffset in a loop to create animated fill.
 */
export function useScribbleFill() {
    const animations: Animation<any>[] = [];

    const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Animate a single fill stroke with a traveling-window effect.
     */
    function createSnakeEffect(
        pathEl: SVGPathElement,
        options: {
            duration?: number;
            dashLength?: number;
            gapLength?: number;
        } = {},
    ): Animation<any> | null {
        if (reducedMotion) return null;

        const pathLength = pathEl.getTotalLength();
        const dashLen = options.dashLength ?? pathLength * 0.3;
        const gapLen = options.gapLength ?? pathLength * 0.7;

        pathEl.style.strokeDasharray = `${dashLen} ${gapLen}`;
        pathEl.style.strokeDashoffset = '0';

        const anim = new Animation<{ strokeDashoffset: number }>({
            duration: options.duration ?? 3000,
            iterationCount: Infinity,
            direction: 'normal',
            fillMode: 'none',
            timingFunction: 'linear',
            useWAAPI: false,
        });

        const totalDash = dashLen + gapLen;

        anim.addFrame(
            '0%',
            { strokeDashoffset: 0 },
            (vars) => {
                pathEl.style.strokeDashoffset = String(vars.strokeDashoffset);
            },
        );
        anim.addFrame('100%', { strokeDashoffset: -totalDash });
        anim.parse();

        animations.push(anim);
        return anim;
    }

    async function playAll(): Promise<void> {
        if (reducedMotion) return;
        // These are infinite, so don't await
        animations.forEach((a) => a.play());
    }

    function stopAll(): void {
        animations.forEach((a) => {
            try {
                a.stop();
            } catch {
                // ignore
            }
        });
    }

    function clear(): void {
        stopAll();
        animations.length = 0;
    }

    onUnmounted(() => {
        clear();
    });

    return { createSnakeEffect, playAll, stopAll, clear };
}
