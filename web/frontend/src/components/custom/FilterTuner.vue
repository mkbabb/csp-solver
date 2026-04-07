<script setup lang="ts">
import { ref, computed } from 'vue'
import { Wrench, X, Copy, RotateCcw } from 'lucide-vue-next'
import {
  FILTER_PRESETS,
  DEFAULT_PRESETS,
  resetPreset,
  resetAllPresets,
  BOIL_CONFIG,
  resetBoilConfig,
} from '@/lib/pencilConfig'

const open = ref(false)
const selectedId = ref(Object.keys(FILTER_PRESETS)[0])
const copyFeedback = ref(false)

const preset = computed(() => FILTER_PRESETS[selectedId.value])
const presetIds = computed(() => Object.keys(FILTER_PRESETS))

/** Which filters reference each preset (approximate mapping) */
const usageMap: Record<string, string> = {
  'grain-static': 'Grid lines, glyphs, icon buttons (static)',
  'wobble-logo': '"sudoku" logo text',
  'wobble-celestial': 'Sun/moon icon, icon btn hover',
  'wobble-heart': 'Heart',
  'stroke-light': 'Control panel (light mode)',
  'stroke-dark': 'Control panel (dark mode)',
}

async function copyJson() {
  const data = JSON.stringify(FILTER_PRESETS[selectedId.value], null, 2)
  await navigator.clipboard.writeText(data)
  copyFeedback.value = true
  setTimeout(() => (copyFeedback.value = false), 1500)
}

function handleReset() {
  resetPreset(selectedId.value)
}

function handleResetAll() {
  resetAllPresets()
  resetBoilConfig()
}

const isModified = computed(() => {
  const current = FILTER_PRESETS[selectedId.value]
  const defaults = DEFAULT_PRESETS[selectedId.value]
  return JSON.stringify(current) !== JSON.stringify(defaults)
})
</script>

<template>
  <!-- Toggle button -->
  <button
    class="tuner-toggle"
    :class="{ 'is-open': open }"
    @click="open = !open"
    aria-label="Toggle filter tuner"
    style="filter: url(#wobble-heart)"
  >
    <Wrench :size="20" />
  </button>

  <!-- Panel -->
  <Teleport to="body">
    <Transition name="tuner-slide">
      <div v-if="open" class="tuner-panel" @click.stop>
        <!-- Header -->
        <div class="tuner-header">
          <span class="tuner-title">Filter Tuner</span>
          <button class="tuner-close" @click="open = false" aria-label="Close"><X :size="16" /></button>
        </div>

        <!-- Preset selector -->
        <div class="tuner-section">
          <label class="tuner-label">Preset</label>
          <select v-model="selectedId" class="tuner-select">
            <option v-for="id in presetIds" :key="id" :value="id">{{ id }}</option>
          </select>
          <div class="tuner-usage">{{ usageMap[selectedId] ?? '' }}</div>
        </div>

        <!-- Grain -->
        <template v-if="preset.grain">
          <div class="tuner-divider">Grain</div>
          <div class="tuner-row" title="Noise granularity. Lower = larger, smoother distortion blobs. Higher = finer, grainier texture.">
            <label>baseFreq</label>
            <input type="range" min="0.001" max="0.2" step="0.001" v-model.number="preset.grain.baseFrequency" />
            <span class="tuner-val">{{ preset.grain.baseFrequency.toFixed(3) }}</span>
          </div>
          <div class="tuner-row" title="Noise detail layers. Lower = smoother, blobby. Higher = more textured, organic.">
            <label>octaves</label>
            <input type="range" min="1" max="10" step="1" v-model.number="preset.grain.numOctaves" />
            <span class="tuner-val">{{ preset.grain.numOctaves }}</span>
          </div>
          <div class="tuner-row" title="Displacement intensity. Lower = subtle grain. Higher = heavy pencil texture distortion.">
            <label>scale</label>
            <input type="range" min="0" max="20" step="0.25" v-model.number="preset.grain.scale" />
            <span class="tuner-val">{{ preset.grain.scale.toFixed(2) }}</span>
          </div>
          <div class="tuner-row" title="Random seed for noise pattern. Different values produce different noise shapes.">
            <label>seed</label>
            <input type="range" min="0" max="100" step="1" v-model.number="preset.grain.seed" />
            <span class="tuner-val">{{ preset.grain.seed }}</span>
          </div>
        </template>

        <!-- Wobble (boil animation) -->
        <template v-if="preset.wobble">
          <div class="tuner-divider">Wobble</div>
          <div class="tuner-row" title="Center turbulence frequency. Lower = larger, smoother warping blobs. Higher = finer, tighter shake.">
            <label>baseFreq</label>
            <input type="range" min="0.001" max="0.15" step="0.001" v-model.number="preset.wobble.baseFrequency" />
            <span class="tuner-val">{{ preset.wobble.baseFrequency.toFixed(3) }}</span>
          </div>
          <div class="tuner-row" title="Noise detail layers. Lower = simple, blobby. Higher = complex, organic texture. Each octave doubles GPU cost.">
            <label>octaves</label>
            <input type="range" min="1" max="10" step="1" v-model.number="preset.wobble.numOctaves" />
            <span class="tuner-val">{{ preset.wobble.numOctaves }}</span>
          </div>
          <div class="tuner-row" title="Displacement intensity (pixels pushed). Lower = subtle shimmer. Higher = wild, drunken wobble.">
            <label>scale</label>
            <input type="range" min="0" max="30" step="0.5" v-model.number="preset.wobble.scale" />
            <span class="tuner-val">{{ preset.wobble.scale.toFixed(1) }}</span>
          </div>
          <div class="tuner-row" title="Amplitude multiplier on frequency offsets. Lower = barely perceptible shimmer. Higher = violent shaking.">
            <label>animScale</label>
            <input type="range" min="0" max="2" step="0.01" v-model.number="preset.wobble.animScale" />
            <span class="tuner-val">{{ preset.wobble.animScale.toFixed(2) }}</span>
          </div>
          <div class="tuner-row" title="Milliseconds between frames. Lower = frantic boil (50ms = 20fps). Higher = calm, slow breathe (1000ms = 1fps).">
            <label>interval</label>
            <input type="range" min="30" max="1000" step="10" v-model.number="preset.wobble.intervalMs" />
            <span class="tuner-val">{{ preset.wobble.intervalMs }}ms</span>
          </div>
          <div class="tuner-row tuner-row-seeds" title="Frequency offset cycle. Each tick, baseFreq += offset[i] * animScale. More values = longer cycle before repeating. Alternating signs create organic wobble.">
            <label>offsets</label>
            <input
              type="text"
              :value="JSON.stringify(preset.wobble.offsets)"
              @change="(e: Event) => {
                try { preset.wobble!.offsets = JSON.parse((e.target as HTMLInputElement).value) } catch {}
              }"
              class="tuner-seeds-input"
            />
          </div>
        </template>

        <!-- MultiPass -->
        <template v-if="preset.multiPass">
          <div class="tuner-divider">MultiPass</div>
          <div class="tuner-row" title="Base noise frequency for all passes. Lower = larger distortion blobs. Higher = finer grain.">
            <label>baseFreq</label>
            <input type="range" min="0.01" max="0.15" step="0.005" v-model.number="preset.multiPass.baseFrequency" />
            <span class="tuner-val">{{ preset.multiPass.baseFrequency.toFixed(3) }}</span>
          </div>
          <div class="tuner-row" title="Detail layers for all passes. Lower = smoother. Higher = more textured.">
            <label>octaves</label>
            <input type="range" min="1" max="6" step="1" v-model.number="preset.multiPass.numOctaves" />
            <span class="tuner-val">{{ preset.multiPass.numOctaves }}</span>
          </div>
          <template v-for="(pass, idx) in preset.multiPass.passes" :key="idx">
            <div class="tuner-row" title="Per-pass displacement intensity. Higher = more distorted stroke copy.">
              <label>pass{{ idx + 1 }}.scale</label>
              <input type="range" min="0.5" max="10" step="0.25" v-model.number="pass.scale" />
              <span class="tuner-val">{{ pass.scale.toFixed(1) }}</span>
            </div>
            <div class="tuner-row" title="Per-pass noise seed. Different seeds produce different stroke variations.">
              <label>pass{{ idx + 1 }}.seed</label>
              <input type="range" min="0" max="50" step="1" v-model.number="pass.seed" />
              <span class="tuner-val">{{ pass.seed }}</span>
            </div>
          </template>
        </template>

        <!-- General -->
        <div class="tuner-divider">General</div>
        <div class="tuner-row" title="Filter region overflow %. Prevents clipping at edges. Higher = more safe area but more GPU work.">
          <label>margin</label>
          <input type="range" min="0" max="20" step="1" v-model.number="preset.margin" />
          <span class="tuner-val">{{ preset.margin }}%</span>
        </div>

        <!-- Grid Boil (path-based) -->
        <div class="tuner-divider">Grid Boil</div>
        <div class="tuner-usage" style="margin-bottom: 0.3rem">Path-based boil for grid lines (frame/subgrid/cell)</div>
        <div class="tuner-row" title="Perturbation amount for outer frame lines (viewBox units). Higher = more hand-retraced wobble.">
          <label>frameBoil</label>
          <input type="range" min="0" max="6" step="0.1" v-model.number="BOIL_CONFIG.frameBoil" />
          <span class="tuner-val">{{ BOIL_CONFIG.frameBoil.toFixed(1) }}</span>
        </div>
        <div class="tuner-row" title="Perturbation amount for subgrid divider lines.">
          <label>subgridBoil</label>
          <input type="range" min="0" max="6" step="0.1" v-model.number="BOIL_CONFIG.subgridBoil" />
          <span class="tuner-val">{{ BOIL_CONFIG.subgridBoil.toFixed(1) }}</span>
        </div>
        <div class="tuner-row" title="Perturbation amount for thin cell lines.">
          <label>cellBoil</label>
          <input type="range" min="0" max="6" step="0.1" v-model.number="BOIL_CONFIG.cellBoil" />
          <span class="tuner-val">{{ BOIL_CONFIG.cellBoil.toFixed(1) }}</span>
        </div>
        <div class="tuner-row" title="Number of boil frames (2-8). More frames = longer cycle before repeating.">
          <label>frames</label>
          <input type="range" min="2" max="8" step="1" v-model.number="BOIL_CONFIG.frameCount" />
          <span class="tuner-val">{{ BOIL_CONFIG.frameCount }}</span>
        </div>
        <div class="tuner-row" title="Milliseconds between frames. 150 = ~6.7fps ('shooting on fours').">
          <label>interval</label>
          <input type="range" min="50" max="500" step="10" v-model.number="BOIL_CONFIG.intervalMs" />
          <span class="tuner-val">{{ BOIL_CONFIG.intervalMs }}ms</span>
        </div>

        <!-- Actions -->
        <div class="tuner-actions">
          <button class="tuner-btn" @click="copyJson">
            <Copy :size="14" />
            <span>{{ copyFeedback ? 'Copied!' : 'Copy JSON' }}</span>
          </button>
          <button class="tuner-btn" :disabled="!isModified" @click="handleReset">
            <RotateCcw :size="14" />
            <span>Reset</span>
          </button>
          <button class="tuner-btn tuner-btn-dim" @click="handleResetAll">
            <RotateCcw :size="14" />
            <span>Reset All</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tuner-toggle {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-card);
  color: var(--color-muted-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms;
  box-shadow: 2px 3px 0px var(--color-foreground);
}

.tuner-toggle:hover,
.tuner-toggle.is-open {
  color: var(--color-foreground);
  transform: scale(1.1);
}

.tuner-panel {
  position: fixed;
  bottom: 4rem;
  right: 1rem;
  z-index: 100;
  width: 20rem;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
  background: color-mix(in srgb, var(--color-card) 92%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 2px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 0.75rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.7rem;
  color: var(--color-foreground);
  box-shadow: 3px 4px 0px var(--color-foreground);
}

.tuner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.tuner-title {
  font-weight: 700;
  font-size: 0.8rem;
}

.tuner-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-muted-foreground);
  padding: 2px;
  border-radius: 4px;
}
.tuner-close:hover {
  color: var(--color-foreground);
  background: var(--color-accent);
}

.tuner-section {
  margin-bottom: 0.5rem;
}

.tuner-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--color-muted-foreground);
}

.tuner-select {
  width: 100%;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: inherit;
  font-size: inherit;
}

.tuner-usage {
  margin-top: 0.2rem;
  color: var(--color-muted-foreground);
  font-size: 0.65rem;
  font-style: italic;
}

.tuner-divider {
  font-weight: 700;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground);
  border-top: 1px solid var(--color-border);
  padding-top: 0.4rem;
  margin-top: 0.4rem;
  margin-bottom: 0.3rem;
}

.tuner-row {
  display: grid;
  grid-template-columns: 5rem 1fr 3.2rem;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.15rem;
}

.tuner-row label {
  color: var(--color-muted-foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tuner-row input[type="range"] {
  width: 100%;
  height: 4px;
  accent-color: var(--color-foreground);
  cursor: pointer;
}

.tuner-val {
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--color-foreground);
}

.tuner-row-seeds {
  grid-template-columns: 5rem 1fr;
}

.tuner-seeds-input {
  width: 100%;
  padding: 0.2rem 0.4rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: inherit;
  font-size: inherit;
}

.tuner-actions {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.tuner-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  background: var(--color-background);
  color: var(--color-foreground);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  transition: all 150ms;
}

.tuner-btn:hover:not(:disabled) {
  background: var(--color-accent);
}

.tuner-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tuner-btn-dim {
  color: var(--color-muted-foreground);
}

/* Slide transition */
.tuner-slide-enter-active {
  transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tuner-slide-leave-active {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.tuner-slide-enter-from,
.tuner-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
</style>
