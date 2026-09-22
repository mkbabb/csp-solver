import { chromium, webkit } from "playwright";
const toks = "--color-border,--color-pencil-graphite,--color-popover,--color-user-ink,--ease-standard,--font-hand,--ink-press-quiet,--mark-ink,--presence-ink-dur,--tap-floor,--type-small,--type-tag,--type-title,".split(",").filter(Boolean);
for (const E of [chromium, webkit]) { const b = await E.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const room = "crit-tok-" + Date.now(); await p.goto("http://127.0.0.1:4238/?size=3&difficulty=EASY&wire=local&s=" + room);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await p.waitForTimeout(2500);
  await p.evaluate((room) => { const c = new BroadcastChannel("board:" + room); for (const f of ["t0","t1"]) c.postMessage({ kind: "hi", data: {}, from: f }); }, room); await p.waitForTimeout(1000);
  await p.locator("[data-player-mark]:visible").first().click(); await p.waitForTimeout(400);
  const r = await p.evaluate((toks) => { const m = [...document.querySelectorAll("[data-player-mark]")].find((e) => e.getBoundingClientRect().width > 0); const s = m.querySelector(".pt-stroke"); const l = [...document.querySelectorAll("[data-lobby]")].find((e) => e.getBoundingClientRect().width > 0); const row = l.querySelector(".pl-row");
    const o = {}; for (const t of toks) { o[t] = [m, s, l, row].map((e) => (e ? getComputedStyle(e).getPropertyValue(t).trim() : "-") || "EMPTY").join(" | "); }
    o.transitionMark = getComputedStyle(m).transition; o.transitionStroke = getComputedStyle(s).transition; return o; }, toks);
  console.log(E.name(), JSON.stringify(r, null, 0)); await b.close(); }
