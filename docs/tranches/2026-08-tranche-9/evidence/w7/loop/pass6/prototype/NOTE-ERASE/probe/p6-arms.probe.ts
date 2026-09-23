/**
 * NOTE-ERASE pass 6 · §7's rest-state question FRAMED (charter 9; leader duty): LEDGER's four arms
 * (HOLD / AGE / STEP / TINT, one const `LEDGER_FULFILLED`), built from LEDGER's PASS-5 BANK on a
 * scratch archive of 74a2b5d9 (the shipping `min-height: inherit` form), served one at a time on
 * ARM_URL and checked by hash. One encoded payload (the classic easy 9x9). Poses (LEDGER's driver,
 * copied): P1 ask·answer · P2 ask·answer·next write · P4 ask·answer·ask·answer; plus P1 in DARK.
 * Cells: 390x844 coarse (hasTouch, witnessed) DPR 3 and 1280x800 fine DPR 2, chromium. Panels go to
 * the scratchpad; the composite is assembled outside. Lines are banked per panel.
 */
import { test, type Page, type Browser } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { bank, say, EXPECTED, PAYLOAD, boardString, givensAria } from "./lib";

const ARM = process.env.ARM ?? "hold";
const ARM_ID = process.env.ARM_ID ?? "";
const BASE = process.env.ARM_URL ?? "http://127.0.0.1:4246";
const PANELS = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erase6-panels";
mkdirSync(PANELS, { recursive: true });
const SOLUTION = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
type Rig = { name: string; w: number; h: number; coarse: boolean; dpr: number };
const RIGS: Rig[] = [
  { name: "390x844-coarse", w: 390, h: 844, coarse: true, dpr: 3 },
  { name: "1280x800-fine", w: 1280, h: 800, coarse: false, dpr: 2 },
];
const lines = (page: Page) =>
  page.evaluate(() => {
    const one = document.querySelector<HTMLElement>(".board-margin .margin-note");
    const two = document.querySelector<HTMLElement>(".board-margin .margin-note-previous");
    return {
      one: one?.textContent?.trim() ?? "", two: two?.textContent?.trim() ?? "",
      oneColor: one ? getComputedStyle(one.querySelector(".margin-note-ink") ?? one).color : null,
      twoDisplay: two ? getComputedStyle(two).display : null,
      spent: !!one?.classList.contains("is-spent"),
      strip: document.querySelector(".board-margin")?.getBoundingClientRect().height ?? null,
      coarse: matchMedia("(pointer: coarse)").matches,
    };
  });
async function open(browser: Browser, rig: Rig, scheme: "light" | "dark") {
  const ctx = await browser.newContext({ viewport: { width: rig.w, height: rig.h }, deviceScaleFactor: rig.dpr, hasTouch: rig.coarse, isMobile: rig.coarse, colorScheme: scheme });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?board=${PAYLOAD}`);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  for (let i = 0; i < 80 && (await boardString(page)) !== EXPECTED; i++) await page.waitForTimeout(100);
  if ((await boardString(page)) !== EXPECTED || (await givensAria(page)) !== EXPECTED) throw new Error("payload not dealt");
  const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "");
  if (!id.includes(ARM_ID)) throw new Error(`${BASE} serves ${id}, expected ${ARM_ID}`);
  await page.waitForTimeout(900);
  return { ctx, page };
}
async function ask(page: Page) {
  await page.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
  await page.keyboard.press("h");
  await page.waitForTimeout(800);
}
async function answer(page: Page) {
  const s = (await lines(page)).one;
  const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1];
  if (!d) throw new Error(`no digit in "${s}"`);
  const target = await page.evaluate(([d, sol]) => [...document.querySelectorAll(".game-cell")].map((c, i) => ({ c, i })).filter(({ c, i }) => c.querySelector(".cell-because") && !(c.querySelector("input") as HTMLInputElement).value && sol[i] === d).map(({ i }) => i), [d, SOLUTION] as const);
  if (target.length !== 1) throw new Error(`"${s}": ${target.length} target cells`);
  await page.locator(".game-cell input").nth(target[0]).focus();
  await page.keyboard.type(d);
  await page.waitForTimeout(800);
}
async function nextWrite(page: Page) {
  const i = await page.evaluate(() => { const all = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]; const el = all.find((x) => !x.value); el?.focus(); return el ? all.indexOf(el) : -1; });
  await page.keyboard.type(SOLUTION[i]);
  await page.waitForTimeout(800);
}
const POSES = [
  { name: "P1", scheme: "light" as const, run: async (p: Page) => { await ask(p); await answer(p); } },
  { name: "P2", scheme: "light" as const, run: async (p: Page) => { await ask(p); await answer(p); await nextWrite(p); } },
  { name: "P4", scheme: "light" as const, run: async (p: Page) => { await ask(p); await answer(p); await ask(p); await answer(p); } },
  { name: "P1dark", scheme: "dark" as const, run: async (p: Page) => { await ask(p); await answer(p); } },
];
test(`arms: ${ARM} panels`, async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "panels are chromium");
  test.setTimeout(300000);
  const rows: Record<string, unknown> = { arm: ARM, id: ARM_ID, payload: PAYLOAD };
  for (const rig of RIGS)
    for (const pose of POSES) {
      const { ctx, page } = await open(browser, rig, pose.scheme);
      await pose.run(page);
      await page.waitForTimeout(1500); // past the settle, so the rest pose is what is framed
      await page.mouse.move(1, 1);
      await page.waitForTimeout(400);
      const clip = await page.evaluate(() => {
        const g = document.querySelector('[role="grid"]')!.getBoundingClientRect();
        const m = document.querySelector(".board-margin")!.getBoundingClientRect();
        const top = Math.floor(g.bottom - 24);
        return { x: Math.floor(g.left), y: top, width: Math.ceil(g.width), height: Math.ceil(m.bottom - top + 26) };
      });
      await page.screenshot({ path: join(PANELS, `${rig.name}-${pose.name}-${ARM}.png`), clip });
      rows[`${rig.name}-${pose.name}`] = { clip, lines: await lines(page) };
      await ctx.close();
    }
  bank(`arms-${ARM}-${browserName}.json`, rows);
  say(`arms.${ARM}`, rows);
});
