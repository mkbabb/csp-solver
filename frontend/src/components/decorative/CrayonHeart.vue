<script setup lang="ts">
withDefaults(
    defineProps<{
        size?: number;
    }>(),
    {
        size: 40,
    },
);
</script>

<template>
    <svg
        class="crayon-heart"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        :width="size"
        :height="size"
    >
        <g filter="url(#wobble-heart)">
            <!-- Layer 1: Shadow heart (offset +3px) -->
            <path
                d="M53 91 C 18 63, 11 38, 21 21 C 31 5, 51 15, 53 28 C 55 15, 75 5, 85 21 C 95 38, 88 63, 53 91 Z"
                fill="#C9184A"
            />

            <!-- Layer 2: Main body with black outline -->
            <path
                d="M50 88 C 15 60, 8 35, 18 18 C 28 2, 48 12, 50 25 C 52 12, 72 2, 82 18 C 92 35, 85 60, 50 88 Z"
                fill="#FF4D6D"
                stroke="#1a1a1a"
                stroke-width="3.5"
                stroke-linejoin="round"
            />

            <!-- Layer 3: White highlight arc on upper-left lobe -->
            <path
                d="M 25 25 C 20 35, 25 45, 30 50"
                fill="none"
                stroke="#FFF"
                stroke-width="4"
                stroke-linecap="round"
            />
            <circle cx="35" cy="20" r="3" fill="#FFF" />

            <!-- Layer 4: Black dot eyes -->
            <circle cx="38" cy="40" r="4" fill="#1a1a1a" />
            <circle cx="62" cy="40" r="4" fill="#1a1a1a" />

            <!-- Layer 5: Curved smile -->
            <path
                d="M 35 55 Q 50 70, 65 55"
                fill="none"
                stroke="#1a1a1a"
                stroke-width="4"
                stroke-linecap="round"
            />

            <!-- Layer 6: Pink blush ellipses -->
            <ellipse cx="28" cy="48" rx="5" ry="3" fill="#FFB3C6" opacity="0.8" />
            <ellipse cx="72" cy="48" rx="5" ry="3" fill="#FFB3C6" opacity="0.8" />
        </g>
    </svg>
</template>

<style scoped>
.crayon-heart {
    pointer-events: none;
    display: inline-block;
}

.crayon-heart:is(.dark *) {
    opacity: 0.75;
    filter: saturate(0.85);
}
</style>
