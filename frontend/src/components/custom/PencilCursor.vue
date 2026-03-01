<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    position: { x: number; y: number } | null;
    visible: boolean;
}>();

const style = computed(() => {
    if (!props.position) return { display: 'none' };
    return {
        position: 'fixed' as const,
        left: `${props.position.x - 8}px`,
        top: `${props.position.y - 32}px`,
        zIndex: 100,
        pointerEvents: 'none' as const,
        transition: 'left 60ms linear, top 60ms linear',
        opacity: props.visible ? 1 : 0,
    };
});
</script>

<template>
    <div :style="style" class="pencil-cursor" aria-hidden="true">
        <svg
            width="24"
            height="40"
            viewBox="0 0 24 40"
            xmlns="http://www.w3.org/2000/svg"
            style="transform: rotate(-30deg)"
        >
            <!-- Pencil body -->
            <rect x="8" y="2" width="8" height="28" rx="1" fill="#f59e0b" stroke="#92400e" stroke-width="1" />
            <!-- Pencil tip -->
            <polygon points="8,30 16,30 12,40" fill="#fbbf24" stroke="#92400e" stroke-width="1" />
            <!-- Tip point -->
            <polygon points="10.5,35 13.5,35 12,40" fill="#1c1917" />
            <!-- Eraser -->
            <rect x="8" y="0" width="8" height="4" rx="1" fill="#fb7185" stroke="#be123c" stroke-width="0.5" />
            <!-- Metal band -->
            <rect x="7.5" y="3" width="9" height="3" rx="0.5" fill="#a8a29e" stroke="#78716c" stroke-width="0.5" />
        </svg>
    </div>
</template>

<style scoped>
.pencil-cursor {
    filter: drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.2));
}
</style>
