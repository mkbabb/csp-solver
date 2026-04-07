import { ref } from 'vue'

export function useButtonAnimation(duration = 500) {
  const animating = ref(false)

  function trigger() {
    animating.value = true
    setTimeout(() => { animating.value = false }, duration)
  }

  return { animating, trigger }
}
