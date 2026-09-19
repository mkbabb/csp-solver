// RUN: node pi-bytes-probe.mjs --engine chromium --port 4253 --out raw/pi-bytes-c.json
//      (cwd: web/frontend of the w8-bake worktree)
//
// C11's π obligation, taken at the bytes rather than argued: "a restored pose is byte-identical
// to the pose this engine would bake now."
//
//   arm 1  a fresh profile bakes         → sha-256 per mounted pose
//   arm 2  a SECOND fresh profile bakes  → the same hashes? (is a bake deterministic at all?)
//   arm 3  arm 1's profile loads again   → the store answers; the same hashes as arm 1?
//
// Arm 2 is the control. Without it, arm 3 proves only that a store returns what it was given.
import { writeFileSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const req = createRequire(pathToFileURL(process.cwd() + "/"));
const { chromium, webkit } = req("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > 0 ? process.argv[i + 1] : d;
};
const ENGINE = arg("engine", "chromium");
const PORT = arg("port", "4253");
const OUT = arg("out", "pi-bytes.json");
const BASE = `http://127.0.0.1:${PORT}/`;

const HASHES = async () => {
  const hex = (buf) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  const rows = [];
  const els = Array.from(
    document.querySelectorAll(".boil-frame-bitmap, .logo-pose-bmp, img.rest-pose"),
  );
  const seen = Object.create(null);
  for (const el of els) {
    const cls = el.getAttribute("class") || "";
    const owner =
      cls.indexOf("boil-frame-bitmap") >= 0
        ? "grid"
        : cls.indexOf("logo-pose-bmp") >= 0
          ? "logo"
          : el.closest(".rest-sun")
            ? "sun"
            : el.closest(".rest-moon")
              ? "moon"
              : "unknown";
    const href = el.getAttribute("href") || el.src || "";
    if (href.indexOf("blob:") !== 0) continue;
    const buf = await (await fetch(href)).arrayBuffer();
    const n = (seen[owner] = (seen[owner] || 0) + 1) - 1;
    rows.push({
      pose: `${owner}-${n}`,
      bytes: buf.byteLength,
      sha256: hex(await crypto.subtle.digest("SHA-256", buf)),
    });
  }
  return rows;
};

const engine = ENGINE === "webkit" ? webkit : chromium;
const OPTS = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  hasTouch: true,
  isMobile: true,
};
const profileA = mkdtempSync(join(tmpdir(), "c11-pi-a-"));
const profileB = mkdtempSync(join(tmpdir(), "c11-pi-b-"));

const read = async (ctx) => {
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(12000);
  const rows = await page.evaluate(HASHES);
  await page.close();
  return rows;
};

const ctxA = await engine.launchPersistentContext(profileA, OPTS);
const arm1 = await read(ctxA);
const ctxB = await engine.launchPersistentContext(profileB, OPTS);
const arm2 = await read(ctxB);
await ctxB.close();
const arm3 = await read(ctxA); // same profile: the store answers
await ctxA.close();

const map = (rows) => Object.fromEntries(rows.map((r) => [r.pose, r.sha256]));
const cmp = (x, y) => {
  const a = map(x),
    b = map(y);
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
  const same = keys.filter((k) => a[k] && a[k] === b[k]);
  const diff = keys.filter((k) => a[k] && b[k] && a[k] !== b[k]);
  const only = keys.filter((k) => !a[k] || !b[k]);
  return { poses: keys.length, identical: same.length, different: diff, unpaired: only };
};
const out = {
  engine: ENGINE,
  base: BASE,
  arm1,
  arm2,
  arm3,
  "bake vs bake (two fresh profiles)": cmp(arm1, arm2),
  "bake vs restored (same profile, second load)": cmp(arm1, arm3),
};
writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(
  JSON.stringify(
    {
      engine: ENGINE,
      bakeVsBake: out["bake vs bake (two fresh profiles)"],
      bakeVsRestored: out["bake vs restored (same profile, second load)"],
    },
    null,
    1,
  ),
);
