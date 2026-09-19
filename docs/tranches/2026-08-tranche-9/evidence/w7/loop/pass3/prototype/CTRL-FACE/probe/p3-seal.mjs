/** T9-W7 pass 3 · CTRL-FACE · the iPad coarse seal cell, shipped + both negative controls. */
import { chromium, webkit } from "playwright";

const H = () => {
  const p = document.querySelector(".controls-card .control-panel-wrap");
  return p ? +p.getBoundingClientRect().height.toFixed(2) : null;
};

async function run(engine, name, base, tag) {
  const b = await engine.launch();
  const ctx = await b.newContext({
    viewport: { width: 1280, height: 800 },
    hasTouch: true,
    isMobile: name === "chromium",
    deviceScaleFactor: 2,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const p = await ctx.newPage();
  await p.goto(`${base}/?size=3&difficulty=EASY`, { waitUntil: "load", timeout: 30000 });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
  await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  await p.waitForTimeout(700);
  const shipped = await p.evaluate(H);
  const ablate = async (css) => {
    const id = "ab";
    await p.evaluate(
      ([i, c]) => {
        const s = document.createElement("style");
        s.id = i;
        s.textContent = c;
        document.head.appendChild(s);
      },
      [id, css],
    );
    await p.waitForTimeout(150);
    const v = await p.evaluate(H);
    await p.evaluate((i) => document.getElementById(i)?.remove(), id);
    await p.waitForTimeout(150);
    return v;
  };
  const handRung = await ablate(
    ".zone-row-label { font-size: var(--type-tag) !important; line-height: 1.1 !important }",
  );
  console.log(
    `${tag} ${name}: PANEL_H shipped ${shipped} | captions back to the hand rung ${handRung} (delta ${shipped !== null && handRung !== null ? (shipped - handRung).toFixed(2) : "?"})`,
  );
  await b.close();
}

await run(chromium, "chromium", process.argv[2], process.argv[3]);
await run(webkit, "webkit", process.argv[2], process.argv[3]);
