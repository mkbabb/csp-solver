import { ref, onUnmounted } from 'vue';
import { Animation } from '@mkbabb/keyframes.js';

/**
 * Composable for SVG stroke-dashoffset draw-in animation using keyframes.js.
 * Creates an Animation per path element that drives stroke-dashoffset from pathLength to 0.
 */
export function useDrawIn() {
    const progress = ref(0);
    const animations: Animation<any>[] = [];

    const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Create a draw-in animation for a single SVG path element.
     */
    function createDrawIn(
        pathEl: SVGPathElement,
        options: {
            duration?: number;
            delay?: number;
            timingFunction?: string;
        } = {},
    ): Animation<any> {
        const pathLength = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = String(pathLength);
        pathEl.style.strokeDashoffset = String(pathLength);

        if (reducedMotion) {
            pathEl.style.strokeDashoffset = '0';
            const noopAnim = new Animation({ duration: 1 });
            return noopAnim;
        }

        const anim = new Animation<{ strokeDashoffset: number }>({
            duration: options.duration ?? 400,
            delay: options.delay ?? 0,
            fillMode: 'forwards',
            timingFunction: (options.timingFunction as any) ?? 'easeOutCubic',
            useWAAPI: false,
        });

        anim.addFrame(
            '0%',
            { strokeDashoffset: pathLength },
            (vars) => {
                pathEl.style.strokeDashoffset = String(vars.strokeDashoffset);
            },
        );
        anim.addFrame('100%', { strokeDashoffset: 0 });
        anim.parse();

        animations.push(anim);
        return anim;
    }

    /**
     * Play all created animations.
     */
    async function playAll(): Promise<void> {
        if (reducedMotion) return;
        await Promise.all(animations.map((a) => a.play()));
    }

    /**
     * Stop all animations and clean up.
     */
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

    return { progress, createDrawIn, playAll, stopAll, clear };
}
