import { ref } from 'vue'
import { Animation } from '@mkbabb/keyframes.js'
import { mulberry32 } from '@mkbabb/pencil-boil'
import { useReducedMotion } from './useReducedMotion'
import { DRAW_IN_PRESETS } from '@/lib/pencilConfig'

export function usePathAnimation(svgRef: import('vue').Ref<SVGSVGElement | null>) {
  const pathsVisible = ref(false)
  const reducedMotion = useReducedMotion()
  let drawAnimations: Animation<any>[] = []

  function getPathElements(): SVGPathElement[] {
    if (!svgRef.value) return []
    return Array.from(svgRef.value.querySelectorAll('path.grid-line'))
  }

  function setupPathLengths(pathEls: SVGPathElement[]): Map<SVGPathElement, number> {
    const lengths = new Map<SVGPathElement, number>()
    pathEls.forEach((el) => {
      const len = el.getTotalLength()
      lengths.set(el, len)
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
    })
    return lengths
  }

  function cleanup() {
    drawAnimations.forEach((a) => {
      try { a.stop() } catch { /* ignore */ }
    })
    drawAnimations = []
  }

  async function animateDrawIn() {
    cleanup()
    const pathEls = getPathElements()
    if (pathEls.length === 0) return

    if (reducedMotion.value) {
      pathEls.forEach((el) => {
        el.style.strokeDashoffset = '0'
      })
      pathsVisible.value = true
      return 'drawn' as const
    }

    const lengths = setupPathLengths(pathEls)

    const framePaths = pathEls.filter((el) => el.classList.contains('frame-line'))
    const subgridPaths = pathEls.filter((el) => el.classList.contains('subgrid-line'))
    const cellPaths = pathEls.filter((el) => el.classList.contains('cell-line'))

    const promises: Promise<void>[] = []
    const jitterRng = mulberry32(77)

    const groups = [
      { paths: framePaths, preset: DRAW_IN_PRESETS.gridFrame },
      { paths: subgridPaths, preset: DRAW_IN_PRESETS.gridSubgrid },
      { paths: cellPaths, preset: DRAW_IN_PRESETS.gridCell },
    ]

    for (const { paths: groupPaths, preset } of groups) {
      groupPaths.forEach((el, i) => {
        const len = lengths.get(el)!
        const jitter = Math.round((jitterRng() - 0.5) * preset.jitter * 2)
        const anim = new Animation<{ offset: number }>({
          duration: preset.duration,
          delay: Math.max(0, preset.baseDelay + i * preset.stagger + jitter),
          fillMode: 'forwards',
          timingFunction: preset.timing,
          useWAAPI: false,
        })
        anim.addFrame('0%', { offset: len }, (vars) => {
          el.style.strokeDashoffset = String(vars.offset)
        })
        anim.addFrame('100%', { offset: 0 })
        anim.parse()
        drawAnimations.push(anim)
        promises.push(anim.play())
      })
    }

    await Promise.all(promises)
    pathEls.forEach((el) => {
      el.style.strokeDasharray = 'none'
      el.style.strokeDashoffset = '0'
    })
    pathsVisible.value = true
    return 'drawn' as const
  }

  async function animateErase() {
    cleanup()
    const pathEls = getPathElements()
    if (pathEls.length === 0) return

    const lengths = pathEls.map(el => el.getTotalLength())

    if (reducedMotion.value) {
      pathEls.forEach((el, i) => {
        el.style.strokeDashoffset = String(lengths[i])
      })
      pathsVisible.value = false
      return 'hidden' as const
    }

    const promises: Promise<void>[] = []

    pathEls.forEach((el, i) => {
      const len = lengths[i]
      el.style.strokeDashoffset = '0'
      el.style.strokeDasharray = String(len)

      const anim = new Animation<{ offset: number }>({
        duration: 150,
        delay: i * 4,
        fillMode: 'forwards',
        timingFunction: 'easeInCubic',
        useWAAPI: false,
      })
      anim.addFrame('0%', { offset: 0 }, (vars) => {
        el.style.strokeDashoffset = String(vars.offset)
      })
      anim.addFrame('100%', { offset: len })
      anim.parse()
      drawAnimations.push(anim)
      promises.push(anim.play())
    })

    await Promise.all(promises)
    pathsVisible.value = false
    return 'hidden' as const
  }

  function showInstant() {
    const pathEls = getPathElements()
    pathEls.forEach((el) => {
      el.style.strokeDashoffset = '0'
      el.style.strokeDasharray = 'none'
    })
    pathsVisible.value = true
  }

  return { pathsVisible, animateDrawIn, animateErase, showInstant, cleanup }
}
