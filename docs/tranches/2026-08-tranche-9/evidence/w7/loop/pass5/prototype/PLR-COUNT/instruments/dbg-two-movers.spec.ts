import { test } from "@playwright/test";
test("dbg two movers", async ({ page }) => {
  const room = `dbg-two-${Date.now()}`;
  await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.waitForTimeout(1500);
  const trace = await page.evaluate(({ room }) => new Promise<unknown[]>((done) => {
    const ch = new BroadcastChannel(`board:${room}`);
    const out: unknown[] = []; const t0 = performance.now();
    const snap = () => { const ps = [...document.querySelectorAll("[data-player-mark] .pt-pose.is-active path")];
      return { t: Math.round(performance.now() - t0), n: ps.length, offs: ps.map((p) => +(+p.getAttribute("stroke-dashoffset")!).toFixed(1)), label: document.querySelector("[data-player-mark]")?.getAttribute("aria-label") }; };
    out.push({ pre: snap() });
    ch.postMessage({ kind: "hi", data: {}, from: "mover-a" });
    setTimeout(() => { out.push({ bSent: Math.round(performance.now() - t0) }); ch.postMessage({ kind: "hi", data: {}, from: "mover-b" }); }, 150);
    const tick = () => { out.push(snap()); if (performance.now() - t0 < 700) requestAnimationFrame(tick); else { ch.close(); done(out); } };
    requestAnimationFrame(tick);
  }), { room });
  console.log(JSON.stringify(trace.slice(0, 40)));
});
