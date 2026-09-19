// T9-W7 · pass 1 · CTRL-TABS §15 — THE GUARD RIBBON IN THE FLOOR'S ROW.
// The research owed this geometry (`guard-face.json` came back null at all four cells). Here it
// is driven on the real surface: a dirty board, the verb armed, the ribbon measured IN the row
// the floor held, `keep` measured for the M19 focus return.
//
//   node .scratch-w7/ribbon.probe.mjs
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4238/";
const OUT = process.env.OUT || "/tmp/ctrl-tabs-ribbon.json";
const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true, schemes: ["dark", "light"] },
  { name: "land-900x500", w: 900, h: 500, mobile: true, sheet: true, schemes: ["light"] },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, sheet: false, schemes: ["light"] },
];

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    for (const scheme of cell.schemes) {
      const key = `${cell.name}-${engine}-${scheme}`;
      const browser = await (engine === "webkit" ? webkit : chromium).launch();
      try {
        const ctx = await browser.newContext({
          viewport: { width: cell.w, height: cell.h },
          deviceScaleFactor: 1,
          isMobile: cell.mobile && engine === "chromium" ? true : undefined,
          hasTouch: cell.mobile,
          colorScheme: scheme,
        });
        await ctx.addInitScript((s) => {
          try {
            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem("sudoku-color-scheme", s);
          } catch {}
        }, scheme);
        const page = await ctx.newPage();
        await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
        await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
        await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
        await page.waitForTimeout(1400);

        // DIRTY THE BOARD — the arming predicate is `isDirty` (W1 §1.5's own row).
        await page.evaluate(() => {
          const i = [...document.querySelectorAll(".sudoku-cell input")].filter(
            (x) => !x.readOnly && !x.disabled && !x.value,
          )[0];
          i?.focus();
        });
        await page.keyboard.type("5");
        await page.waitForTimeout(400);

        if (cell.sheet) {
          await page.locator(".drawer-tab").click({ force: true });
          await page.waitForTimeout(950);
        }

        const before = await page.evaluate(() => {
          const bar = document.querySelector(".action-bar");
          const row = document.querySelector(".action-verbs");
          const b = bar.getBoundingClientRect();
          const r = row.getBoundingClientRect();
          return {
            bar: { y: +b.y.toFixed(2), h: +b.height.toFixed(2) },
            row: { y: +r.y.toFixed(2), h: +r.height.toFixed(2) },
            cells: [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join(""),
            cardH: +document.querySelector(".controls-card").getBoundingClientRect().height.toFixed(2),
          };
        });

        // ARM: the destructive verbs, one mechanism. `clear` is the one W1 §1.5 already arms.
        const armedRow = {};
        for (const verb of ["clear", "deal"]) {
          const btn = page.locator(`.action-verbs [data-verb="${verb}"]`);
          if (!(await btn.count())) {
            armedRow[verb] = { absent: true };
            continue;
          }
          await btn.click();
          await page.waitForTimeout(420); // MOTION.ribbonMs 240 + slack
          armedRow[verb] = await page.evaluate(() => {
            const g = document.querySelector(".guard-row");
            if (!g) return { armed: false };
            const gb = g.getBoundingClientRect();
            const bar = document.querySelector(".action-bar").getBoundingClientRect();
            const btns = [...g.querySelectorAll("button")].map((b) => {
              const r = b.getBoundingClientRect();
              return {
                word: b.innerText.replace(/\s+/g, " ").trim(),
                w: +r.width.toFixed(2),
                h: +r.height.toFixed(2),
                ok: r.width >= 44 && r.height >= 44,
              };
            });
            const ask = g.querySelector(".guard-ask");
            const card = document.querySelector(".controls-card");
            const go = g.querySelector(".guard-go .guard-face");
            return {
              armed: true,
              question: ask?.textContent.trim(),
              ariaLabel: g.getAttribute("aria-label"),
              role: g.getAttribute("role"),
              rowBox: { y: +gb.y.toFixed(2), h: +gb.height.toFixed(2), w: +gb.width.toFixed(2) },
              barBox: { y: +bar.y.toFixed(2), h: +bar.height.toFixed(2) },
              oneLine: gb.height <= 90,
              verbs: btns,
              verbFails: btns.filter((b) => !b.ok).length,
              redInk: go ? getComputedStyle(go).color : null,
              cardH: +card.getBoundingClientRect().height.toFixed(2),
              cells: [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join(""),
            };
          });
          // KEEP — the way back, and M19's focus return.
          const keep = page.locator(".guard-keep");
          if (await keep.count()) {
            await keep.click();
            await page.waitForTimeout(320);
            armedRow[verb].afterKeep = await page.evaluate((v) => {
              const a = document.activeElement;
              return {
                ribbonGone: !document.querySelector(".guard-row"),
                floorBack: !!document.querySelector(".action-verbs"),
                focusVerb: a?.getAttribute?.("data-verb") ?? a?.className ?? a?.tagName,
                focusIsArmedVerb: a?.getAttribute?.("data-verb") === v,
                cells: [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join(""),
              };
            }, verb);
          }
        }

        // I4's own question, re-aimed at the floor this family draws: on a DIRTY board, does one
        // tap on a destructive verb change a cell?
        const i4 = [];
        for (const verb of ["deal", "clear", "fill", "solve"]) {
          const r = await page.evaluate(async (v) => {
            // `deal` and `clear` carry `data-verb` (W1 §1.5's own hook); `fill` and `solve` do
            // not arm yet and are found by their aria-label, which is how I4 finds them too.
            const byLabel = (frag) =>
              [...document.querySelectorAll(".action-verbs button")].find((b2) =>
                (b2.getAttribute("aria-label") || "").toLowerCase().startsWith(frag),
              );
            const b =
              document.querySelector(`.action-verbs [data-verb="${v}"]`) ||
              byLabel({ fill: "fill in", solve: "solve", deal: "deal", clear: "clear" }[v]);
            if (!b) return { verb: v, absent: true };
            const pre = [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value);
            b.click();
            await new Promise((r2) => setTimeout(r2, 1200));
            const post = [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value);
            const armed = !!document.querySelector(".guard-row");
            const keep = document.querySelector(".guard-keep");
            keep?.click();
            return {
              verb: v,
              armed,
              cellsWritten: pre.filter((c, i) => c !== post[i]).length,
            };
          }, verb);
          i4.push(r);
          await page.waitForTimeout(300);
        }

        out[key] = { before, armedRow, i4 };
        console.log(
          `[${key}] floor row ${before.row.h} @${before.row.y} → ribbon ${armedRow.clear?.rowBox?.h}` +
            ` @${armedRow.clear?.rowBox?.y} oneLine=${armedRow.clear?.oneLine}` +
            ` verbs ${armedRow.clear?.verbs?.map((v) => `${v.word}:${v.w}x${v.h}`).join(",")}` +
            ` fails=${armedRow.clear?.verbFails} keepFocus=${armedRow.clear?.afterKeep?.focusIsArmedVerb}` +
            ` cardH ${before.cardH}→${armedRow.clear?.cardH}` +
            ` | I4 ${i4.map((x) => `${x.verb}:armed=${x.armed} wrote=${x.cellsWritten}`).join(" ")}`,
        );
      } catch (e) {
        out[key] = { error: String(e).slice(0, 400) };
        console.log(`[${key}] ERROR ${String(e).slice(0, 220)}`);
      }
      await browser.close();
    }
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("\nbanked " + OUT);
