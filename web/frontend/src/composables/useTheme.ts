import { useDark, useToggle, createGlobalState } from '@vueuse/core'

export const useTheme = createGlobalState(() => {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    disableTransition: false,
  })

  const toggleDark = useToggle(isDark)

  return { isDark, toggleDark }
})
