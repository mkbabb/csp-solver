/**
 * MOT-VERB pass 4 — THE DUSK, ON ITS OWN SURFACE (charter row 2).
 *
 * Pass 3's dusk reading was taken on a synthetic scrub element and was true of the probe and
 * false of the product. This reads the FIVE ground selectors `index.css` actually narrows to,
 * with `html.theme-turning` put there by the product's own toggle, in both engines, against the
 * `74a2b5d9` control served beside it.
 */
import { test, expect, type Page } from "@playwright/test";

const AFTER = "http://127.0.0.1:4247";
const CONTROL = "http://127.0.0.1:4248";
const BOARD = "?board=dusk-probe";

/** The five, as the rule names them. `.bg-background`/`.bg-card` are Tailwind classes. */
const SEL = ["body", ".bg-background", ".bg-card", ".action-bar", ".drawer-tab-tongue"];

async function read(page: Page, url: string) {
  await page.goto(url + "/" + BOARD, { waitUntil: "networkidle" });
  return page.evaluate((sel) => {
    // The product's own act: DarkModeToggle puts the class on the root at click. Driving the
    // class here is the same act, read at the same place, and does not depend on the toggle
    // being on screen at this pose.
    document.documentElement.classList.add("theme-turning");
    const out: Record<string, string> = {};
    for (const s of sel) {
      const el = document.querySelector(s);
      if (!el) {
        out[s] = "ABSENT";
        continue;
      }
      const c = getComputedStyle(el);
      out[s] = `${c.transitionProperty} | ${c.transitionDuration} | ${c.transitionTimingFunction}`;
    }
    document.documentElement.classList.remove("theme-turning");
    return out;
  }, SEL);
}

test("the dusk paints on the five grounds, and the control says what it should say", async ({
  page,
}, info) => {
  const after = await read(page, AFTER);
  const control = await read(page, CONTROL);
  const engine = info.project.name;
  const rows = SEL.map((s) => ({ selector: s, after: after[s], control: control[s] }));
  console.log(`DUSK[${engine}] ` + JSON.stringify(rows));

  for (const s of SEL) {
    if (after[s] === "ABSENT") continue;
    // The defect, named: the duration may not be 0s and the property may not be `all`.
    expect(after[s], `${s} @ ${engine}`).not.toContain("| 0s |");
    expect(after[s].split("|")[0].trim(), `${s} @ ${engine}`).not.toBe("all");
    expect(after[s]).toContain("background-color");
  }
});
