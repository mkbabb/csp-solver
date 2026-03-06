/**
 * Singleton RAF scheduler for line-boil frame cycling.
 * Replaces per-instance useLineBoil RAF loops with a single shared loop.
 * All subscribers are ticked in one requestAnimationFrame callback.
 */

import { onMounted, onUnmounted, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

function normalizeFrameCount(value: number): number {
    if (!Number.isFinite(value)) return 1
    return Math.max(1, Math.floor(value))
}

function normalizeInterval(value: number): number {
    if (!Number.isFinite(value)) return 125
    return Math.max(16, Math.floor(value))
}

interface Subscriber {
    currentFrame: Ref<number>
    getFrameCount: () => number
    getInterval: () => number
    lastTick: number
    active: boolean
}

// ── Singleton scheduler ──────────────────────────────────────────

const subscribers = new Set<Subscriber>()
let rafId: number | null = null
let schedulerRunning = false

function schedulerTick(timestamp: number) {
    if (!schedulerRunning) return

    for (const sub of subscribers) {
        if (!sub.active) continue

        const frameTotal = sub.getFrameCount()
        const interval = sub.getInterval()
        if (sub.currentFrame.value >= frameTotal) sub.currentFrame.value = 0

        if (sub.lastTick === 0) sub.lastTick = timestamp

        const elapsed = timestamp - sub.lastTick
        if (elapsed >= interval) {
            const steps = Math.floor(elapsed / interval)
            sub.lastTick += steps * interval
            sub.currentFrame.value = (sub.currentFrame.value + steps) % frameTotal
        }
    }

    rafId = requestAnimationFrame(schedulerTick)
}

function ensureScheduler() {
    if (schedulerRunning || typeof window === 'undefined') return
    schedulerRunning = true
    rafId = requestAnimationFrame(schedulerTick)
}

function maybeStopScheduler() {
    let anyActive = false
    for (const sub of subscribers) {
        if (sub.active) { anyActive = true; break }
    }
    if (!anyActive && rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
        schedulerRunning = false
    }
}

// Pause/resume on tab visibility
if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            if (rafId !== null) {
                cancelAnimationFrame(rafId)
                rafId = null
                schedulerRunning = false
            }
        } else {
            // Reset lastTick so elapsed doesn't jump
            for (const sub of subscribers) {
                if (sub.active) sub.lastTick = 0
            }
            ensureScheduler()
        }
    })
}

// ── Composable (drop-in replacement for useLineBoil) ─────────────

function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useSharedBoil(
    frameCount: MaybeRefOrGetter<number> = 4,
    intervalMs: MaybeRefOrGetter<number> = 125,
) {
    const currentFrame = ref(0)

    const sub: Subscriber = {
        currentFrame,
        getFrameCount: () => normalizeFrameCount(toValue(frameCount)),
        getInterval: () => normalizeInterval(toValue(intervalMs)),
        lastTick: 0,
        active: false,
    }

    function start() {
        if (prefersReducedMotion()) return
        sub.active = true
        sub.lastTick = 0
        subscribers.add(sub)
        ensureScheduler()
    }

    function stop() {
        sub.active = false
        maybeStopScheduler()
    }

    onMounted(() => {
        start()
    })

    onUnmounted(() => {
        stop()
        subscribers.delete(sub)
        maybeStopScheduler()
    })

    return { currentFrame, start, stop }
}
