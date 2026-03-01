import { ref, onUnmounted, onMounted } from 'vue';

/**
 * Composable for line-boil frame cycling at ~8fps.
 * Returns a reactive `currentFrame` index that cycles through `frameCount` frames.
 * Respects `prefers-reduced-motion`.
 */
export function useLineBoil(frameCount: number = 4, intervalMs: number = 125) {
    const currentFrame = ref(0);
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function start() {
        if (reducedMotion || intervalId !== null) return;
        intervalId = setInterval(() => {
            currentFrame.value = (currentFrame.value + 1) % frameCount;
        }, intervalMs);
    }

    function stop() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    onMounted(() => {
        start();
    });

    onUnmounted(() => {
        stop();
    });

    return { currentFrame, start, stop };
}
