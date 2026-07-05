import { ref } from 'vue'

const reducedMotion = ref(
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

let initialized = false

function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  mql.addEventListener('change', (e) => {
    reducedMotion.value = e.matches
  })
}

export function useReducedMotion(): Readonly<import('vue').Ref<boolean>> {
  init()
  return reducedMotion
}
