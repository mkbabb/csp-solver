import { useDark, useToggle } from '@vueuse/core'

export function useTheme() {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    disableTransition: false,
  })

  const toggleDark = useToggle(isDark)

  return { isDark, toggleDark }
}
