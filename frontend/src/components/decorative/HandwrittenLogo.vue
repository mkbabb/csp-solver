<script setup lang="ts">
import { ref, onMounted } from 'vue';

const logoFilter = 'url(#wobble-logo)';

const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isDrawn = ref(reducedMotion);

onMounted(() => {
    if (!reducedMotion) {
        // Trigger on next frame so the initial clip-path state renders first
        requestAnimationFrame(() => {
            requestAnimationFrame(() => { isDrawn.value = true; });
        });
    }
});
</script>

<template>
    <svg
        class="handwritten-logo"
        :class="{ 'is-drawn': isDrawn }"
        viewBox="0 0 220 60"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="sudoku"
        role="heading"
    >
        <text
            class="logo-text"
            x="4"
            y="48"
            text-anchor="start"
            :filter="logoFilter"
        >sudoku</text>
    </svg>
</template>

<style scoped>
.handwritten-logo {
    height: 3.5rem;
    width: auto;
    color: var(--color-foreground);
    display: block;
    align-self: flex-start;
    clip-path: inset(0 100% 0 0);
    transition: clip-path 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.handwritten-logo.is-drawn {
    clip-path: inset(0 0% 0 0);
}

.logo-text {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: 52px;
    font-optical-sizing: auto;
    fill: currentColor;
    letter-spacing: 0.02em;
}

@media (prefers-reduced-motion: reduce) {
    .handwritten-logo {
        clip-path: none;
        transition: none;
    }
}

@media (min-width: 640px) {
    .handwritten-logo {
        height: 4.5rem;
    }
}

@media (min-width: 1024px) {
    .handwritten-logo {
        height: 5.5rem;
    }
}
</style>
