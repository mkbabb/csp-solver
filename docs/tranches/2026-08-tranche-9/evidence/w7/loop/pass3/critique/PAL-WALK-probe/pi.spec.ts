// The critic's own π row: the SOLO page's rect census, prototype (:4238) vs the HEAD control
// 74a2b5d9 (:4239). The wave does not claim the solo board, so every rect must agree.
import { test, type Page } from "@playwright/test";

const SOLO = "/?size=3&difficulty=EASY&wire=local";

async function census(page: Page, base: string, arm: "light" | "dark") {
  await page.goto(`${base}${SOLO}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.waitForTimeout(2500);
  await page.evaluate((x) => {
    document.documentElement.classList.toggle("dark", x === "dark");
  }, arm);
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
  return page.evaluate(() => {
    const out: Record<string, number[]> = {};
    const seen = new Map<string, number>();
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const cls = el.className && typeof el.className === "string" ? el.className.trim() : "";
      if (!cls) continue; // an unclassed <path> is the boil's own seed, re-rolled per load
      const tag = `${el.tagName}.${(el.className && typeof el.className === "string" ? el.className : "").trim().split(/\s+/).slice(0, 2).join(".")}`;
      const n = (seen.get(tag) ?? 0) + 1;
      seen.set(tag, n);
      out[`${tag}#${n}`] = [
        Math.round(r.x * 100) / 100,
        Math.round(r.y * 100) / 100,
        Math.round(r.width * 100) / 100,
        Math.round(r.height * 100) / 100,
      ];
    }
    return out;
  });
}

for (const arm of ["light", "dark"] as const) {
  test(`pi ${arm}`, async ({ page }, info) => {
    const proto = await census(page, "http://127.0.0.1:4238", arm);
    const head = await census(page, "http://127.0.0.1:4239", arm);
    const keys = new Set([...Object.keys(proto), ...Object.keys(head)]);
    let worst = 0;
    let worstKey = "";
    let onlyOne = 0;
    for (const k of keys) {
      const a = proto[k];
      const b = head[k];
      if (!a || !b) {
        onlyOne++;
        continue;
      }
      for (let i = 0; i < 4; i++) {
        const d = Math.abs(a[i] - b[i]);
        if (d > worst) {
          worst = d;
          worstKey = k;
        }
      }
    }
    console.log(
      `[${info.project.name}/${arm}] rects proto ${Object.keys(proto).length} head ${Object.keys(head).length} · one-sided ${onlyOne} · worst |Δ| ${worst}px at ${worstKey}`,
    );
  });
}

// NEGATIVE CONTROL: the same tree against itself. Whatever this reads is the probe's own noise.
test("pi control head-vs-head", async ({ page }, info) => {
  const a = await census(page, "http://127.0.0.1:4239", "light");
  const b = await census(page, "http://127.0.0.1:4239", "light");
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let worst = 0;
  let worstKey = "";
  let onlyOne = 0;
  for (const k of keys) {
    if (!a[k] || !b[k]) {
      onlyOne++;
      continue;
    }
    for (let i = 0; i < 4; i++) {
      const d = Math.abs(a[k][i] - b[k][i]);
      if (d > worst) {
        worst = d;
        worstKey = k;
      }
    }
  }
  console.log(
    `[${info.project.name}/control] one-sided ${onlyOne} · worst |Δ| ${worst}px at ${worstKey}`,
  );
});
