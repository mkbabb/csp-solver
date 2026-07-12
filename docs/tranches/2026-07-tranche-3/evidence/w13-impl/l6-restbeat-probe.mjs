import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { chromium } = pw;
const browser = await chromium.launch({ headless: true });
const page = await (
  await browser.newContext({ viewport: { width: 1440, height: 900 } })
).newPage();
await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const res = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const discSeen = new Set();
      const raySeen = new Set();
      const t0 = performance.now();
      const iv = setInterval(() => {
        const discPoses = Array.from(
          document.querySelectorAll('.rest-sun .rest-breathe > .rest-pose'),
        );
        const rayPoses = Array.from(
          document.querySelectorAll('.rest-sun .rest-ray-spin > .rest-pose'),
        );
        discSeen.add(discPoses.findIndex((el) => el.classList.contains('is-pose-active')));
        raySeen.add(rayPoses.findIndex((el) => el.classList.contains('is-pose-active')));
        if (performance.now() - t0 > 1600) {
          clearInterval(iv);
          resolve({
            discPoseCount: discPoses.length,
            rayPoseCount: rayPoses.length,
            discPosesSeen: Array.from(discSeen).sort(),
            rayPosesSeen: Array.from(raySeen).sort(),
            liveHidden: Array.from(document.querySelectorAll('.toggle-icon')).map(
              (el) => getComputedStyle(el).visibility,
            ),
            breathe: document.querySelector('.rest-breathe')?.style.transform,
            spin: document.querySelector('.rest-ray-spin')?.style.transform,
            moonStackHidden: getComputedStyle(document.querySelector('.rest-moon'))
              .visibility,
          });
        }
      }, 30);
    }),
);
console.log(JSON.stringify(res, null, 1));
await browser.close();
