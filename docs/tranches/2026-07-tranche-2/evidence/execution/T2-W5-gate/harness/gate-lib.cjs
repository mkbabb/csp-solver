// Shared helpers — board injection + settle polling, method-identical to the
// pass3 harness lib.cjs (buildPersistedBoard) and throttle-trace.cjs (settle poll).
const SIZE_PARAM = { 4: 2, 9: 3, 16: 4 }

function buildPersistedBoard(dim) {
  const size = SIZE_PARAM[dim]
  const totalCells = dim * dim
  const values = {}
  const givenCells = []
  for (let i = 0; i < totalCells; i++) {
    values[String(i)] = (i % dim) + 1
    givenCells.push(String(i))
  }
  return {
    size,
    difficulty: 'MEDIUM',
    values,
    givenCells,
    originalGivenCells: [...givenCells],
    overriddenCells: [],
    solvedValues: {},
    boardGeneration: 1,
  }
}

// Settled grid-line counts under the hoisted steady architecture (4 pre-baked
// sibling layers): 9x9 -> 17*4=68, 16x16 -> 31*4=124 (observed live: 68 at 9x9).
const SETTLED_LINES = { 9: 68, 16: 124 }

async function pollSettled(page, expected, timeoutMs = 20000) {
  const start = Date.now()
  let hold = 0
  while (Date.now() - start < timeoutMs) {
    const count = await page.evaluate(() => document.querySelectorAll('path.grid-line').length)
    if (count === expected) {
      hold++
      if (hold >= 2) return { settled: true, ms: Date.now() - start }
    } else hold = 0
    await page.waitForTimeout(100)
  }
  return { settled: false, ms: Date.now() - start }
}

function analyzeTrace(traceFile, fs) {
  const data = JSON.parse(fs.readFileSync(traceFile, 'utf8'))
  const events = data.traceEvents
  // Identify the renderer main thread via metadata
  const threadNames = {}
  for (const e of events) {
    if (e.ph === 'M' && e.name === 'thread_name')
      threadNames[`${e.pid}:${e.tid}`] = e.args.name
  }
  let tsMin = Infinity,
    tsMax = -Infinity
  const totals = { RasterTask: 0, Paint: 0, Layout: 0 }
  const counts = { RasterTask: 0, Paint: 0, Layout: 0 }
  let mainBusyUs = 0
  let longTaskCount = 0,
    longTaskTotalMs = 0,
    longTaskMax = 0
  let droppedFrames = 0,
    presentedFrames = 0
  for (const e of events) {
    if (typeof e.ts === 'number' && e.ts > 0 && e.ph !== 'M') {
      if (e.ts < tsMin) tsMin = e.ts
      const end = e.ts + (e.dur || 0)
      if (end > tsMax) tsMax = end
    }
    if (e.ph === 'X' && typeof e.dur === 'number') {
      if (totals[e.name] !== undefined) {
        totals[e.name] += e.dur
        counts[e.name]++
      }
      const tname = threadNames[`${e.pid}:${e.tid}`]
      if (
        (e.name === 'RunTask' || e.name === 'ThreadControllerImpl::RunTask') &&
        tname === 'CrRendererMain'
      ) {
        mainBusyUs += e.dur
        const ms = e.dur / 1000
        if (ms > 50) {
          longTaskCount++
          longTaskTotalMs += ms
          if (ms > longTaskMax) longTaskMax = ms
        }
      }
    }
    // PipelineReporter async events carry frame-drop status in modern Chrome
    if (e.name === 'PipelineReporter' && e.ph === 'b') presentedFrames++
    if (
      e.name === 'PipelineReporter' &&
      e.ph === 'e' &&
      e.args &&
      e.args.termination_status === 'dropped_frame'
    )
      droppedFrames++
    if (e.name === 'DroppedFrame') droppedFrames++
  }
  const wallMs = (tsMax - tsMin) / 1000
  return {
    wallMs: Math.round(wallMs),
    raster: { totalMs: totals.RasterTask / 1000, count: counts.RasterTask },
    paint: { totalMs: totals.Paint / 1000, count: counts.Paint },
    layout: { totalMs: totals.Layout / 1000, count: counts.Layout },
    rasterMsPerS: totals.RasterTask / 1000 / (wallMs / 1000),
    mainBusyMs: mainBusyUs / 1000,
    mainBusyPct: (mainBusyUs / 1000 / wallMs) * 100,
    longTasks: { count: longTaskCount, totalMs: longTaskTotalMs, maxMs: longTaskMax },
    frames: { presented: presentedFrames, dropped: droppedFrames },
    eventCount: events.length,
  }
}

const TRACE_CATEGORIES = [
  'devtools.timeline',
  'disabled-by-default-devtools.timeline',
  'disabled-by-default-devtools.timeline.frame',
  'blink',
  'blink.animations',
  'cc',
  'gpu',
  'benchmark',
]

module.exports = { SIZE_PARAM, buildPersistedBoard, SETTLED_LINES, pollSettled, analyzeTrace, TRACE_CATEGORIES }
