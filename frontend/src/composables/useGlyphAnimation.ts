import { ref, onUnmounted } from 'vue';
import { Animation } from '@mkbabb/keyframes.js';
import { DRAW_IN_PRESETS } from '@/lib/pencilConfig';

const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface SolveCellTarget {
    pathEl: SVGPathElement;
    pathLength: number;
    cellEl: HTMLElement;
    row: number;
    col: number;
}

/**
 * Composable to orchestrate the solve animation sequence.
 * Creates staggered draw-in animations for solved cells with a pencil cursor.
 */
export function useGlyphAnimation() {
    const isAnimating = ref(false);
    const pencilPosition = ref<{ x: number; y: number } | null>(null);
    let animations: Animation<any>[] = [];

    /**
     * Run the solve animation sequence.
     * @param targets - Array of cell targets to animate, sorted by row then column
     * @param staggerMs - Delay between each cell's animation start
     */
    async function playSolveSequence(
        targets: SolveCellTarget[],
        staggerMs: number = DRAW_IN_PRESETS.solveCell.stagger,
    ): Promise<void> {
        if (reducedMotion || targets.length === 0) {
            // Show all immediately
            targets.forEach((t) => {
                t.pathEl.style.strokeDasharray = 'none';
                t.pathEl.style.strokeDashoffset = '0';
            });
            return;
        }

        isAnimating.value = true;
        cleanup();

        // Sort by row, then column for natural writing order
        const sorted = [...targets].sort((a, b) => {
            if (a.row !== b.row) return a.row - b.row;
            return a.col - b.col;
        });

        const promises: Promise<void>[] = [];

        sorted.forEach((target, i) => {
            const { pathEl, pathLength } = target;

            pathEl.style.strokeDasharray = String(pathLength);
            pathEl.style.strokeDashoffset = String(pathLength);

            const anim = new Animation<{ offset: number }>({
                duration: DRAW_IN_PRESETS.solveCell.duration,
                delay: i * staggerMs,
                fillMode: 'forwards',
                timingFunction: DRAW_IN_PRESETS.solveCell.timing,
                useWAAPI: false,
            });

            anim.addFrame(
                '0%',
                { offset: pathLength },
                (vars) => {
                    pathEl.style.strokeDashoffset = String(vars.offset);

                    // Update pencil position to this cell's center
                    const rect = target.cellEl.getBoundingClientRect();
                    pencilPosition.value = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                    };
                },
            );
            anim.addFrame('100%', { offset: 0 });
            anim.parse();

            animations.push(anim);
            promises.push(anim.play());
        });

        await Promise.all(promises);
        isAnimating.value = false;
        pencilPosition.value = null;
    }

    function cleanup() {
        animations.forEach((a) => {
            try {
                a.stop();
            } catch {
                // ignore
            }
        });
        animations = [];
    }

    onUnmounted(() => {
        cleanup();
    });

    return {
        isAnimating,
        pencilPosition,
        playSolveSequence,
        cleanup,
    };
}
