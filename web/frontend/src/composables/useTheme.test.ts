import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useTheme } from './useTheme'

// FE-unit layer (T4-W2): the dark-mode CLASS TOGGLE contract, migrated out of
// e2e/visual-regression.spec.ts (the light/dark `html.dark` half of Tests 2/3) into jsdom.
// The reachable unit truth is "toggling flips the `dark` class on <html> and the isDark ref
// tracks it" — no CSS needed. The rendered consequences that DO need a browser (the sun/moon
// `.is-active` swap, the `stroke-dark` filter on the control panel) stay in e2e.

describe('useTheme — dark-mode class toggle', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('toggleDark flips the `dark` class on <html> and mirrors isDark', async () => {
    const { isDark, toggleDark } = useTheme()
    const start = isDark.value

    toggleDark()
    await nextTick()
    expect(isDark.value).toBe(!start)
    expect(document.documentElement.classList.contains('dark')).toBe(!start)

    toggleDark()
    await nextTick()
    expect(isDark.value).toBe(start)
    expect(document.documentElement.classList.contains('dark')).toBe(start)
  })
})
