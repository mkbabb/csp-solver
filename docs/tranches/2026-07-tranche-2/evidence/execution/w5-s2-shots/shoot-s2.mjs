// Lane S2 proof harness — H3 (vbWidth special-case dead + caret optical-center),
// H4 (token binds render), I2 (no reveal replay on game swap).
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs'

const BASE = 'http://localhost:3000'
const OUT = new URL('.', import.meta.url).pathname

const results = { checks: [], shots: [] }
function check(name, ok, detail) {
    results.checks.push({ name, ok, detail })
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} — ${detail}`)
}

async function metrics(page) {
    return page.evaluate(() => {
        const svg = document.querySelector('.handwritten-logo')
        const text = svg.querySelector('.logo-text')
        const caret = document.querySelector('.logo-caret')
        const sr = svg.getBoundingClientRect()
        const tr = text.getBoundingClientRect()
        const cr = caret.getBoundingClientRect()
        const cs = getComputedStyle(text)
        const item = document.querySelector('.logo-menu-item')
        return {
            viewBox: svg.getAttribute('viewBox'),
            inkToCaretGap: cr.left - tr.right,
            svgRightToInkRight: sr.right - tr.right,
            textCenterY: (tr.top + tr.bottom) / 2,
            caretCenterY: (cr.top + cr.bottom) / 2,
            svgCenterY: (sr.top + sr.bottom) / 2,
            fontFamily: cs.fontFamily,
            logoHeight: getComputedStyle(svg).height,
            menuItemFont: item ? getComputedStyle(item).fontSize + ' / ' + getComputedStyle(item).fontFamily : null,
        }
    })
}

async function shoot(page, name) {
    const p = OUT + name
    await page.screenshot({ path: p, clip: { x: 0, y: 0, width: page.viewportSize().width, height: 420 } })
    results.shots.push(p)
}

const browser = await chromium.launch()
for (const [tag, vp] of [['desktop', { width: 1280, height: 900 }], ['mobile', { width: 375, height: 800 }]]) {
    const page = await browser.newPage({ viewport: vp })
    await page.goto(BASE)
    await page.waitForSelector('.handwritten-logo.is-drawn', { timeout: 10_000 })
    await page.waitForTimeout(1600) // fonts.ready re-measure + the mount reveal's 1.2s transition settle fully

    // ── closed state, sudoku ──
    const mSud = await metrics(page)
    console.log(tag, 'sudoku', JSON.stringify(mSud, null, 1))
    await shoot(page, `s2-${tag}-sudoku-closed.png`)

    // H3a: the 220 special-case is dead — sudoku's box is measured, not pinned.
    const vbw = Number(mSud.viewBox.split(' ')[2])
    check(`H3a ${tag}: sudoku vbWidth measured (not 220)`, vbw !== 220 && vbw > 120, `viewBox=${mSud.viewBox}`)
    // H4: token binds resolve to the real faces.
    check(`H4 ${tag}: wordmark --font-display`, /Fraunces/.test(mSud.fontFamily), mSud.fontFamily)

    // ── menu open ──
    await page.click('.logo-trigger')
    await page.waitForSelector('#logo-game-listbox')
    await page.waitForTimeout(350) // caret turn + menu-in settle
    const mOpen = await metrics(page)
    check(`H4 ${tag}: menu item rung+face`, /Patrick Hand/.test(mOpen.menuItemFont ?? ''), mOpen.menuItemFont)
    await shoot(page, `s2-${tag}-sudoku-open.png`)

    // ── I2: swap to futoshiki, assert the reveal never replays ──
    await page.evaluate(() => {
        const svg = document.querySelector('.handwritten-logo')
        window.__s2 = { lostDrawn: 0, clipSamples: [] }
        new MutationObserver(() => {
            if (!svg.classList.contains('is-drawn')) window.__s2.lostDrawn++
        }).observe(svg, { attributes: true, attributeFilter: ['class'] })
        const t = setInterval(() => {
            window.__s2.clipSamples.push(getComputedStyle(svg).clipPath)
        }, 50)
        setTimeout(() => clearInterval(t), 1500)
    })
    await page.click('#logo-game-opt-1')
    await page.waitForTimeout(1600)
    const swap1 = await page.evaluate(() => window.__s2)
    // A replay starts at inset(0 100% 0 0) and sweeps down — flag only a real wipe (>5%),
    // not sub-0.01% float residue from the mount transition's tail.
    const wipePct = (c) => Number((/inset\(\S+ ([\d.e-]+)%/.exec(c) ?? [0, 0])[1])
    const wiped = swap1.clipSamples.some((c) => wipePct(c) > 5)
    check(`I2 ${tag}: swap→futoshiki no re-reveal`, swap1.lostDrawn === 0 && !wiped,
        `lostDrawn=${swap1.lostDrawn}, clip variants=${[...new Set(swap1.clipSamples)].join(' | ')}`)

    const mFut = await metrics(page)
    console.log(tag, 'futoshiki', JSON.stringify(mFut, null, 1))
    await shoot(page, `s2-${tag}-futoshiki-closed.png`)
    // H3a uniform gap: ink→caret gap parity across labels (was 41.9 vs 14.4).
    check(`H3a ${tag}: ink→caret gap uniform`, Math.abs(mSud.inkToCaretGap - mFut.inkToCaretGap) < 2,
        `sudoku=${mSud.inkToCaretGap.toFixed(1)}px futoshiki=${mFut.inkToCaretGap.toFixed(1)}px`)
    // H3b caret optical-center: caret center sits below the box center, toward the ink mass.
    check(`H3b ${tag}: caret nudged to ink center`, mFut.caretCenterY > mFut.svgCenterY + 1,
        `caretCY=${mFut.caretCenterY.toFixed(1)} svgCY=${mFut.svgCenterY.toFixed(1)} inkCY=${mFut.textCenterY.toFixed(1)}`)

    // ── drive the listbox a SECOND time (back to sudoku) — same assertion ──
    await page.click('.logo-trigger')
    await page.waitForSelector('#logo-game-listbox')
    await page.waitForTimeout(350)
    await shoot(page, `s2-${tag}-futoshiki-open.png`)
    await page.evaluate(() => {
        const svg = document.querySelector('.handwritten-logo')
        window.__s2 = { lostDrawn: 0, clipSamples: [] }
        new MutationObserver(() => {
            if (!svg.classList.contains('is-drawn')) window.__s2.lostDrawn++
        }).observe(svg, { attributes: true, attributeFilter: ['class'] })
        const t = setInterval(() => {
            window.__s2.clipSamples.push(getComputedStyle(svg).clipPath)
        }, 50)
        setTimeout(() => clearInterval(t), 1500)
    })
    await page.click('#logo-game-opt-0')
    await page.waitForTimeout(1600)
    const swap2 = await page.evaluate(() => window.__s2)
    const wiped2 = swap2.clipSamples.some((c) => wipePct(c) > 5)
    check(`I2 ${tag}: swap→sudoku (2nd drive) no re-reveal`, swap2.lostDrawn === 0 && !wiped2,
        `lostDrawn=${swap2.lostDrawn}, clip variants=${[...new Set(swap2.clipSamples)].join(' | ')}`)

    await page.close()
}
await browser.close()
const fails = results.checks.filter((c) => !c.ok)
console.log(`\n${results.checks.length - fails.length}/${results.checks.length} checks passed`)
process.exit(fails.length ? 1 : 0)
