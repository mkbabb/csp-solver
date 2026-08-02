#!/usr/bin/env node
/**
 * dist-identity.mjs — the build-identity line for a rig's AUDIT prepend.
 *
 * T5-W4 pass-7 Lane D, closing D6-G3. `web/frontend/dist/` is `.gitignore`d, it is
 * rebuilt by whichever lane last ran `npm run build`, and it carries NO commit stamp
 * of its own — so a rig pointed at `npm run preview` measures whatever happens to be
 * on disk. Pass 5 banked exactly that: `dist/` held an ABLATE build and any lane that
 * did not rebuild measured an ablation without knowing it. That is a CLASS, not an
 * incident, and the class has two faces:
 *
 *   (1) the dist on disk is not the tree you think it is;
 *   (2) the server you are measuring is not serving the dist you built
 *       (PRECEPTS §3 `assert-the-SPA is tree-blind` — `global-setup`'s gate proves the
 *       port serves THE app, never YOUR app).
 *
 * Vite content-hashes the entry chunk, so `assets/index-<hash>.js` IS the identity: two
 * different trees cannot produce the same name except by producing the same bytes. This
 * prints that name (plus an `index.html` digest and the payload's extent) as ONE line
 * an AUDIT prepend can carry verbatim, and — given `--served <baseURL>` — fetches the
 * entry the server actually references and asserts it against the one on disk.
 *
 * It never writes, never builds, and never touches the dist.
 *
 * usage:
 *   node scripts/dist-identity.mjs [--dist <path>] [--served <baseURL>] [--self-test]
 *
 * exits 1 when the dist is missing, entry-less, or disagrees with the served page —
 * a rig whose AUDIT line cannot be derived has no business printing numbers.
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = resolve(HERE, "..");
const DEFAULT_DIST = join(FRONTEND_ROOT, "dist");

// PRECEPTS §4: own servers live in 4230-4260. The self-test's socket is torn down in
// a `finally` and the port is asserted dead by the lane's close transcript.
const SELF_TEST_PORT = 4247;

const ENTRY_RE = /^index-[A-Za-z0-9_-]+\.js$/;
const SERVED_ENTRY_RE = /assets\/(index-[A-Za-z0-9_-]+\.js)/;

const md5 = (buf) => createHash("md5").update(buf).digest("hex");

/** Walk a directory, summing file count and bytes, newest mtime wins. */
function extent(dir) {
  let files = 0;
  let bytes = 0;
  let newest = 0;
  const walk = (d) => {
    for (const ent of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, ent.name);
      if (ent.isDirectory()) {
        walk(p);
        continue;
      }
      const st = statSync(p);
      files += 1;
      bytes += st.size;
      if (st.mtimeMs > newest) newest = st.mtimeMs;
    }
  };
  walk(dir);
  return { files, bytes, newest };
}

/**
 * The identity of a dist on disk. Throws with a pointed message rather than
 * returning a half-answer — a build-identity line that says "unknown" is the
 * hole this instrument exists to fill.
 */
export function identify(distPath) {
  if (!existsSync(distPath))
    throw new Error(
      `no dist at ${distPath} — build one (\`npm run build\`) before a rig reads it`,
    );
  const assetsDir = join(distPath, "assets");
  if (!existsSync(assetsDir))
    throw new Error(
      `${distPath} has no assets/ — this is a husk, not a build (a \`.gitignore\`d dist ` +
        `that kept only \`_headers\`/\`_redirects\` looks exactly like this)`,
    );
  const entries = readdirSync(assetsDir).filter((f) => ENTRY_RE.test(f));
  if (entries.length !== 1)
    throw new Error(
      `expected exactly 1 entry chunk in ${assetsDir}, found ${entries.length}` +
        (entries.length
          ? ` (${entries.join(", ")}) — a stale chunk was left behind`
          : ""),
    );
  const indexHtml = join(distPath, "index.html");
  if (!existsSync(indexHtml)) throw new Error(`${distPath} has no index.html`);
  const { files, bytes, newest } = extent(distPath);
  return {
    entry: entries[0],
    indexMd5: md5(readFileSync(indexHtml)),
    files,
    bytes,
    builtAt: new Date(newest).toISOString(),
  };
}

/** The AUDIT prepend's one line. Stable shape, greppable, no swallowed stream. */
export function auditLine(id) {
  const kb = (id.bytes / 1024).toFixed(1);
  return (
    `AUDIT: build-identity — dist entry ${id.entry} · index.html md5 ${id.indexMd5} · ` +
    `${id.files} files / ${kb} KB · newest mtime ${id.builtAt}`
  );
}

async function servedEntry(baseURL) {
  const res = await fetch(baseURL, { redirect: "follow" });
  if (!res.ok)
    throw new Error(`${baseURL} answered ${res.status} — that is not the app`);
  const html = await res.text();
  const m = html.match(SERVED_ENTRY_RE);
  if (!m)
    throw new Error(
      `${baseURL} served no assets/index-*.js reference — it is serving something, but ` +
        `not a built dist (a dev server inlines /src/main.ts instead)`,
    );
  return m[1];
}

/* ------------------------------------------------------------------ self-test */

async function selfTest() {
  let pass = 0;
  let fail = 0;
  const check = async (name, fn) => {
    try {
      await fn();
      console.log(`  ok   ${name}`);
      pass += 1;
    } catch (err) {
      console.log(`  FAIL ${name} — ${err.message}`);
      fail += 1;
    }
  };
  const throws = (fn, needle) => {
    try {
      fn();
    } catch (err) {
      if (!err.message.includes(needle))
        throw new Error(`threw, but not for the stated reason: ${err.message}`, {
          cause: err,
        });
      return;
    }
    throw new Error("did not throw");
  };

  const root = mkdtempSync(join(tmpdir(), "dist-identity-"));

  await check("a missing dist is RED (as it must)", () =>
    throws(() => identify(join(root, "nope")), "no dist at"),
  );

  const husk = join(root, "husk");
  mkdirSync(husk, { recursive: true });
  writeFileSync(join(husk, "_headers"), "x\n");
  await check(
    "a husk — the .gitignore'd dist with no payload — is RED (as it must)",
    () => throws(() => identify(husk), "husk, not a build"),
  );

  const twoEntries = join(root, "two", "assets");
  mkdirSync(twoEntries, { recursive: true });
  writeFileSync(join(twoEntries, "index-AAAAAAAA.js"), "a\n");
  writeFileSync(join(twoEntries, "index-BBBBBBBB.js"), "b\n");
  writeFileSync(join(root, "two", "index.html"), "<html></html>\n");
  await check("a leftover stale entry chunk is RED (as it must)", () =>
    throws(() => identify(join(root, "two")), "found 2"),
  );

  const good = join(root, "good", "assets");
  mkdirSync(good, { recursive: true });
  writeFileSync(join(good, "index-C0FFEE00.js"), "console.log(1)\n");
  writeFileSync(
    join(root, "good", "index.html"),
    '<script src="/assets/index-C0FFEE00.js">\n',
  );
  await check("a well-formed dist yields its entry and a stable line", () => {
    const id = identify(join(root, "good"));
    if (id.entry !== "index-C0FFEE00.js") throw new Error(`entry read as ${id.entry}`);
    if (id.files !== 2) throw new Error(`file count read as ${id.files}`);
    const line = auditLine(id);
    if (!line.startsWith("AUDIT: build-identity — dist entry index-C0FFEE00.js"))
      throw new Error(`line shape drifted: ${line}`);
    if (!/md5 [0-9a-f]{32}/.test(line)) throw new Error(`no md5 in the line: ${line}`);
  });

  // The served-vs-disk arm, against a REAL socket on an own-range port. This is the
  // arm that cures the tree-blind trap, so it gets a real server rather than a
  // fixture comparison: one page that references a DIFFERENT entry than the dist on
  // disk must drive `main` to exit 1, and the matching page must drive it to 0.
  const server = createServer((req, res) => {
    const wanted = req.url === "/match" ? "index-C0FFEE00.js" : "index-DEADBEEF.js";
    res.writeHead(200, { "content-type": "text/html" });
    res.end(`<!doctype html><script type="module" src="/assets/${wanted}"></script>`);
  });
  await new Promise((ok) => server.listen(SELF_TEST_PORT, "127.0.0.1", ok));
  const base = `http://127.0.0.1:${SELF_TEST_PORT}`;
  try {
    await check(
      "a server serving ANOTHER tree's entry is RED (as it must)",
      async () => {
        const code = await main(["--dist", join(root, "good"), "--served", base]);
        if (code !== 1) throw new Error(`mismatch exited ${code}, not 1`);
      },
    );
    await check("the same entry on both sides passes", async () => {
      const code = await main([
        "--dist",
        join(root, "good"),
        "--served",
        `${base}/match`,
      ]);
      if (code !== 0) throw new Error(`match exited ${code}, not 0`);
    });
  } finally {
    await new Promise((ok) => server.close(ok));
  }

  rmSync(root, { recursive: true, force: true });
  console.log(
    `[dist-identity] self-test ${pass}/${pass + fail} — the instrument can fail on a known-bad dist.`,
  );
  return fail === 0 ? 0 : 1;
}

/* ----------------------------------------------------------------------- main */

async function main(argv) {
  if (argv.includes("--self-test")) return selfTest();

  const distArg = argv.indexOf("--dist");
  const distPath = distArg === -1 ? DEFAULT_DIST : resolve(argv[distArg + 1]);
  const servedArg = argv.indexOf("--served");

  const id = identify(distPath);
  console.log(auditLine(id));

  if (servedArg !== -1) {
    const baseURL = argv[servedArg + 1];
    const served = await servedEntry(baseURL);
    if (served !== id.entry) {
      console.error(
        `AUDIT: build-identity MISMATCH — ${baseURL} serves ${served}, this dist is ${id.entry}.\n` +
          `The rig is measuring a tree that is not the one on disk. Rebuild, or point the rig ` +
          `at the dist you built; do not reconcile this in prose.`,
      );
      return 1;
    }
    console.log(`AUDIT: build-identity — ${baseURL} serves the same entry (${served})`);
  }
  return 0;
}

const argv = process.argv.slice(2);
try {
  process.exit(await main(argv));
} catch (err) {
  console.error(`[dist-identity] ${err.message}`);
  process.exit(1);
}
