<template>
  <!-- Credit to Kevin Powell at https://codepen.io/kevinpowell/pen/PomqjxO -->
  <button
    class="dark-mode-toggle-button"
    :class="{ 'is-dark': isDark, 'has-toggled': hasToggled }"
    v-bind="$attrs"
    @click="handleToggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <span v-if="hasToggled" class="pulse-ring" :class="{ 'is-dark': isDark }" />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="472.39"
      height="472.39"
      viewBox="0 0 472.39 472.39"
    >
      <g class="toggle-sun" :class="{ 'is-dark': isDark }">
        <path
          d="M403.21,167V69.18H305.38L236.2,0,167,69.18H69.18V167L0,236.2l69.18,69.18v97.83H167l69.18,69.18,69.18-69.18h97.83V305.38l69.18-69.18Zm-167,198.17a129,129,0,1,1,129-129A129,129,0,0,1,236.2,365.19Z"
        />
      </g>
      <g class="toggle-circle" :class="{ 'is-dark': isDark }">
        <circle cx="236.2" cy="236.2" r="90" />
      </g>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleDark } = useTheme()
const hasToggled = ref(false)

function handleToggle() {
  hasToggled.value = true
  toggleDark()
}
</script>

<style scoped>
.dark-mode-toggle-button {
  cursor: pointer;
  border: 0;
  opacity: 0.8;
  padding: 0;
  border-radius: 50%;
  position: relative;
  background: transparent;
  transition: opacity 200ms ease, transform 200ms ease, background 200ms ease;
}

.dark-mode-toggle-button svg {
  fill: var(--color-foreground);
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
  z-index: 1;
}

.dark-mode-toggle-button:hover,
.dark-mode-toggle-button:focus {
  outline: none;
  opacity: 1;
  transform: scale(1.25);
  background: hsl(0 0% 50% / 0.15);
}

/* Pulse ring — rendered as a real element (not ::before) to avoid Safari z-index bug */
.pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--color-foreground);
  pointer-events: none;
  animation: pulseToDark 650ms ease-out forwards;
}

.pulse-ring.is-dark {
  animation: pulseToLight 650ms ease-out forwards;
}

.toggle-sun {
  transform-origin: center center;
  transition: transform 750ms cubic-bezier(0.11, 0.14, 0.29, 1.5);
}

.toggle-sun.is-dark {
  transform: rotate(0.5turn);
}

.toggle-circle {
  transform: translateX(0%);
  transition: transform 500ms ease-out;
}

.toggle-circle.is-dark {
  transform: translateX(-15%);
}

@keyframes pulseToLight {
  0% {
    transform: scale(100);
    opacity: 0.5;
  }
  10% {
    transform: scale(1);
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

@keyframes pulseToDark {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  10% {
    transform: scale(1);
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}
</style>
