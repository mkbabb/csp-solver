/**
 * NOTE-LEDGER pass 5 · π AT REST, EMPTY — the voice's pass-5 reserve (<1024) against the control
 * with nothing asked, every cell below 1024 incl. W2 §2.2's two landscape cells, plus the desk.
 */
import { test, type Browser } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { encodeSudoku } from "../e2e/wire";
const G: Record<number, number> = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
const BOARD = encodeSudoku(3, G, 81);
const RIGS = [[390, 844, true], [393, 699, true], [844, 390, true], [812, 375, true], [1280, 800, false]] as const;
const KEYS = ["[role=grid]", ".board-margin", ".margin-note-block", ".margin-note", "#fold-tools", ".app-layout", "#controls-drawer", ".masthead", ".board-card", ".play-controls"];
async function read(browser: Browser, base: string, [w, h, coarse]: readonly [number, number, boolean], engine: string) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: coarse, isMobile: coarse && engine === "chromium" });
  const p = await ctx.newPage();
  await p.goto(`${base}/?board=${BOARD}`);
  await p.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await p.waitForTimeout(1800);
  const r = await p.evaluate((keys) => ({
    keys: keys.map((s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [s, +b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)]; }),
    sh: document.documentElement.scrollHeight,
    one: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
  }), KEYS);
  await ctx.close();
  return r;
}
test("empty: at rest, nothing asked", async ({ browser, browserName }) => {
  const rows = [];
  for (const rig of RIGS) {
    const a = await read(browser, "http://127.0.0.1:4249", rig, browserName);
    const b = await read(browser, "http://127.0.0.1:4248", rig, browserName);
    const d = a.keys.map((k, i) => { const c = b.keys[i]; if (!k || !c) return k || c ? `${KEYS[i]} presence` : null; const out = []; for (let j = 1; j < 5; j++) if (Math.abs((k[j] as number) - (c[j] as number)) > 0.01) out.push(`${KEYS[i]}.${"xywh"[j - 1]}${((k[j] as number) - (c[j] as number)).toFixed(2)}`); return out.join(" ") || null; }).filter(Boolean);
    const row = { rig: `${rig[0]}x${rig[1]}`, one: [a.one, b.one], scrollHeight: [a.sh, b.sh], deltas: d };
    rows.push(row);
    console.log(`EMPTY|${browserName}|${JSON.stringify(row)}`);
  }
  writeFileSync(`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/NOTE-LEDGER/logs/empty-${browserName}.json`, JSON.stringify(rows, null, 1));
});
