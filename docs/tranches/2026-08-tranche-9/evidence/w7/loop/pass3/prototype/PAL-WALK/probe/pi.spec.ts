// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto; the rect census is a layout
// reading and motion moves nothing this file measures.
// π identity on the surfaces PAL-WALK does not claim: every element's rect on a solo board, read
// at the prototype and at the HEAD control (74a2b5d9), differenced. A solo page binds no player
// ink at all, so a rect that moved would be this family paying for a colour with a layout.
import { test, expect, type Page } from "@playwright/test";
import { encodeSudoku } from "./wire";

// THE SAME BOARD ON BOTH TREES. Two servers each deal their own puzzle, so a rect census over
// "?size=3&difficulty=EASY" compares two different boards and 60 DOM keys exist on one side only
// — which is the dealt puzzle, not a layout move. A `?board=` permalink pins one board on both.
const SOLO = `./?board=${encodeSudoku(3, { 0: 5, 10: 7, 20: 3, 40: 9 }, 81)}&wire=local`;
const BASES = {
  proto: process.env.PROTO_URL || "http://127.0.0.1:4244",
  head: process.env.HEAD_URL || "http://127.0.0.1:4247",
};

async function census(page: Page, base: string, arm: "light" | "dark") {
  await page.goto(`${base}/${SOLO.replace("./", "")}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  }, arm);
  await page.waitForTimeout(2600);
  return page.evaluate(() => {
    const out: Record<string, number[]> = {};
    // LAYOUT elements only, keyed by their position in the tree. An SVG path's `className` is an
    // `SVGAnimatedString` (it stringifies to one bucket for every path on the page) and its
    // GEOMETRY is the dealt puzzle's, which differs between two servers that each dealt their
    // own board — so glyph geometry is not a pi surface and is not read here.
    const pathOf = (el: Element): string => {
      const parts: string[] = [];
      for (let n: Element | null = el; n && n !== document.body; n = n.parentElement)
        parts.unshift(`${n.tagName}:${[...(n.parentElement?.children ?? [])].indexOf(n)}`);
      return parts.join("/");
    };
    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      if (el instanceof SVGElement) continue;
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      out[pathOf(el)] = [
        +r.x.toFixed(2),
        +r.y.toFixed(2),
        +r.width.toFixed(2),
        +r.height.toFixed(2),
      ];
    }
    return out;
  });
}

for (const arm of ["light", "dark"] as const) {
  test(`pi identity on the solo board, ${arm}`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const head = await census(page, BASES.head, arm);
    const proto = await census(page, BASES.proto, arm);
    const keys = new Set([...Object.keys(head), ...Object.keys(proto)]);
    let worst = 0;
    let where = "";
    let missing = 0;
    for (const k of keys) {
      const a = head[k];
      const b = proto[k];
      if (!a || !b) {
        missing++;
        continue;
      }
      for (let i = 0; i < 4; i++) {
        const d = Math.abs(a[i] - b[i]);
        if (d > worst) {
          worst = d;
          where = k;
        }
      }
    }
    console.log(
      `[${info.project.name}/${arm}] rects ${keys.size} · worst |Δ| ${worst.toFixed(2)}px at ${where} · keys only on one side ${missing}`,
    );
    expect(worst).toBeLessThanOrEqual(0.01);
    expect(missing).toBe(0);
  });
}
