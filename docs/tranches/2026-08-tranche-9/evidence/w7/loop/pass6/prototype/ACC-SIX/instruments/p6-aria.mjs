// ACC-SIX pass-6 — row 7's contract ONE (registry-v5 §2.3): aria-valuenow = the PERCENT with min/max 0/100, the
// COUNT in aria-valuetext, on the lane's dist beside the control, both engines, after 0 and 2 legal writes.
import { ENGINES, open, writeLegal, asset } from "./p6-common.mjs";
const R = () => { const b = document.querySelector('[role="progressbar"]'); return ["aria-valuemin", "aria-valuemax", "aria-valuenow", "aria-valuetext"].map((a) => b?.getAttribute(a)).join(" | "); };
for (const [eng, L] of ENGINES) { const br = await L.launch();
  for (const [arm, base] of [["tree", "http://127.0.0.1:4237"], ["control", "http://127.0.0.1:4238"]]) {
    const { ctx, page } = await open(br, base, { viewport: { width: 1280, height: 800 }, reduce: true });
    const a0 = await page.evaluate(R); await writeLegal(page, 250); await writeLegal(page, 250); const a2 = await page.evaluate(R);
    console.log(`${eng} ${arm} ${await asset(page)} :: fill0 ${a0} :: fill2 ${a2}`); await ctx.close(); }
  await br.close(); }
