/**
 * NOTE-ERASE pass 5 · painted AA of the settled rung (light + dark, sensitivity row), the parked
 * record (F-ERASE-2: rect vs paint), PRM's leave and the repeat's hole. BUILT dist, one payload.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { bank, say, boardReady, armHint, refuseAGiven, watchLeave, leaveResult, paintedAA, PROTO, PAYLOAD } from "./lib";

async function settledHint(page: Page) {
  // The line is already armed; a second H on the named cell would REVEAL it and empty the note.
  await expect
    .poll(() => page.evaluate(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age")), { timeout: 5000 })
    .toBe("settled");
  // Read AFTER the dusk step settles: poll the computed colour to a stable value.
  let prev = "";
  for (let i = 0; i < 40; i++) {
    const c = await page.evaluate(() => getComputedStyle(document.querySelector(".margin-note-ink")!).color);
    if (c === prev) break;
    prev = c;
    await page.waitForTimeout(100);
  }
}

test("AA: the settled rung, painted, light and dark", async ({ browser }, info) => {
  const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD, cell: "1280x800 fine, DPR 1" };
  for (const scheme of ["light", "dark"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme });
    const page = await ctx.newPage();
    await boardReady(page, PROTO);
    await armHint(page, 0);
    rows[`${scheme}.fresh`] = await paintedAA(page);
    await settledHint(page);
    rows[`${scheme}.settled`] = await paintedAA(page);
    await ctx.close();
  }
  bank(`aa-${info.project.name}.json`, rows);
  say("aa", rows);
  for (const k of ["light.settled", "dark.settled"]) {
    const r = rows[k] as { coreRatio: number; age: string };
    expect(r.age).toBe("settled");
    expect(r.coreRatio, k).toBeGreaterThanOrEqual(4.5);
  }
});

test("park: the record's rect vs its paint (F-ERASE-2)", async ({ page }, info) => {
  await boardReady(page, PROTO);
  await armHint(page, 0);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press("g");
  let prev = "";
  for (let i = 0; i < 40; i++) {
    const r = await page.evaluate(() => JSON.stringify(document.querySelector(".margin-note-ink")?.getBoundingClientRect()));
    if (r === prev && i > 5) break;
    prev = r;
    await page.waitForTimeout(100);
  }
  const parked = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    const clippers: string[] = [];
    for (let n: HTMLElement | null = ink.parentElement; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.overflow !== "visible" || cs.clipPath !== "none") {
        const nr = n.getBoundingClientRect();
        clippers.push(`${n.tagName.toLowerCase()}.${(n.getAttribute("class") || "").split(/\s+/)[0]} overflow=${cs.overflow} bottom=${Math.round(nr.bottom * 100) / 100} containsNote=${nr.top <= r.top && nr.bottom >= r.bottom}`);
      }
    }
    return {
      text: (document.querySelector(".margin-note")?.textContent || "").trim(),
      box: { x: Math.round(r.x * 100) / 100, y: Math.round(r.y * 100) / 100, w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 },
      hit: hit ? `${hit.tagName.toLowerCase()}.${(hit.getAttribute("class") || "").split(/\s+/)[0]}` : null,
      hitIsTheNote: !!hit && (hit === ink || ink.contains(hit)),
      clippers,
    };
  });
  let bytes = null;
  if (parked && parked.box.w > 0) {
    const clip = { x: Math.floor(parked.box.x), y: Math.floor(parked.box.y), width: Math.ceil(parked.box.w), height: Math.ceil(parked.box.h) };
    const buf = await page.screenshot({ clip });
    const { data, info: im } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const counts = new Map<string, number>();
    for (let i = 0; i < data.length; i += im.channels) {
      const k = `${data[i]},${data[i + 1]},${data[i + 2]}`;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    bytes = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${v}px rgb(${k})`);
  }
  const row = { engine: info.project.name, payload: PAYLOAD, parked, bytes };
  bank(`park-${info.project.name}.json`, row);
  say("park", row);
  expect(parked).not.toBeNull();
});

test("PRM's leave, and the repeat's hole", async ({ browser }, info) => {
  const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD };
  for (const rm of ["reduce", "no-preference"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: rm });
    const page = await ctx.newPage();
    await boardReady(page, PROTO);
    await refuseAGiven(page, "5");
    await page.waitForTimeout(600);
    await watchLeave(page, false);
    await page.keyboard.press("5");
    rows[rm] = await leaveResult(page, true);
    await ctx.close();
  }
  bank(`prm-hole-${info.project.name}.json`, rows);
  say("prm", rows);
  const r = rows.reduce as { animationDuration: string; absentMs: number };
  expect(r.animationDuration.split(",").every((d) => parseFloat(d) === 0)).toBe(true);
});
