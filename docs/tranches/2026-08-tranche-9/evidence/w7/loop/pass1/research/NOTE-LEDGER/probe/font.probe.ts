/**
 * NOTE-LEDGER pass 1 — THE FONT PRICE of any string the family mints.
 *
 * `check-font-coverage.mjs` is GREEN at HEAD and its Patrick Hand corpus does NOT claim the
 * margin's strings (the hand's ledgered population, `e2e/font-census.spec.ts`), so the cut is
 * priced here the way this lane prices everything else: on the painted surface. Each codepoint
 * is drawn twice — `"Patrick Hand", monospace` against bare `monospace`. Equal advance means
 * the browser FELL BACK, i.e. the codepoint is outside the 46-codepoint cut and the string
 * would paint a ransom note.
 */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
const OUT = process.env.NL_OUT || join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });

test("NL-6 FONT — every codepoint the ledger's strings need, against the hand's cut", async ({
  page,
  browserName,
}) => {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForTimeout(1500);
  const rows = await page.evaluate(async () => {
    await (document as unknown as { fonts: FontFaceSet }).fonts.ready;
    const probe = (ch: string, stack: string) => {
      const s = document.createElement("span");
      s.textContent = ch.repeat(20);
      s.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font-size:64px;font-family:${stack}`;
      document.body.appendChild(s);
      const w = s.getBoundingClientRect().width;
      s.remove();
      return Math.round(w * 100) / 100;
    };
    const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789 .,'!…’-";
    const out: Array<{ ch: string; hand: number; fallback: number; inCut: boolean }> = [];
    for (const ch of CHARS) {
      const hand = probe(ch, '"Patrick Hand", monospace');
      const fallback = probe(ch, "monospace");
      out.push({ ch, hand, fallback, inCut: Math.abs(hand - fallback) > 0.5 });
    }
    return out;
  });
  const strings = [
    "and 4 more",
    "4 more",
    "only 8 fits here",
    "that's a given clue",
    "check row 4",
    "the board is clear",
    "solved it!",
    "still solving…",
  ];
  const cut = new Set(rows.filter((r) => r.inCut).map((r) => r.ch));
  const verdicts = strings.map((s) => ({
    text: s,
    missing: [...s].filter((c) => !cut.has(c) && c !== " ").join(""),
  }));
  writeFileSync(
    join(OUT, `font-${browserName}.json`),
    JSON.stringify({ rows, verdicts }, null, 2),
  );
  // eslint-disable-next-line no-console
  console.log(
    "outside the cut: " + JSON.stringify(rows.filter((r) => !r.inCut).map((r) => r.ch).join("")),
  );
  // eslint-disable-next-line no-console
  console.log(verdicts.map((v) => `${v.missing ? "RANSOM" : "ok    "} "${v.text}" ${v.missing}`).join("\n"));
});
