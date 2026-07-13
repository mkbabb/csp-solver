import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SvgFilters from './SvgFilters.vue'
import { FILTER_PRESETS, wobblePoseFrequencies, wobblePoseId } from '@pencil/config/pencilConfig'

// FE-unit layer (T4-W2): the SVG-filter REGISTRY contract, migrated out of
// e2e/visual-regression.spec.ts (Test 1) into a jsdom mount — it never needed a real browser,
// only that SvgFilters renders one `<filter>`/`<linearGradient>` def per preset. The rendered
// PIXELS of these filters stay in the golden system (visual-golden.spec.ts); the CSS-cascade
// asserts (crayon vars, font-family, box-shadow) stay in e2e — jsdom applies no stylesheet.

describe('SvgFilters — filter registry DOM contract', () => {
  const wrapper = mount(SvgFilters)
  const has = (id: string) => wrapper.find(`[id="${id}"]`).exists()

  it('registers all six shipped filter presets', () => {
    for (const id of [
      'grain-static',
      'wobble-logo',
      'wobble-celestial',
      'wobble-heart',
      'stroke-light',
      'stroke-dark',
    ]) {
      expect(has(id), id).toBe(true)
    }
  })

  it('registers exactly one frozen pose variant per declared pose frequency (T3-W13 §1-P3)', () => {
    for (const id of ['wobble-logo', 'wobble-celestial', 'wobble-heart']) {
      const poses = wobblePoseFrequencies(FILTER_PRESETS[id])
      expect(poses.length).toBeGreaterThan(0)
      for (let i = 0; i < poses.length; i++) {
        expect(has(wobblePoseId(id, i)), wobblePoseId(id, i)).toBe(true)
      }
    }
  })

  it('registers the sparkle-rainbow and solver-ink gradients', () => {
    expect(has('sparkle-rainbow')).toBe(true)
    expect(has('solver-ink')).toBe(true)
  })
})
