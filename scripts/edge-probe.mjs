#!/usr/bin/env node
// edge-probe.mjs — what the deployed edge actually answers, read from outside it.
//
// LANE NOTE (T9-W5 chair fold retires the NOT-A-LANE claim this header carried): the GRADED rows read the LIVE deploy over the network, so their cadence stays the WGATE production pass, beside the deploy, per docs/tranches/2026-08-tranche-9/evidence/w5/runbook.md — while the offline `--self-test` (fixtures only, zero network) is the one arm CI runs, in the dist job.
//
// (The declaration is one line on purpose: `web/frontend/scripts/check-lane-membership.mjs`
// captures a `NOT-A-LANE:` claim to the end of ITS OWN line and then demands a cite in what
// it captured, so a reason wrapped across lines reads as a shrug. This file is named
// `*-probe.mjs`, which is one of that gate's two corpus forms — it sits outside the corpus
// DIRECTORY today, and this line is what keeps it honest if the corpus ever widens.)
//
// The rows that CAN be decided without a network (the fallback contract's static half, the
// CSP comparator) are decided in `--self-test`, which is offline and which any lane may run.
//
// Born at T9-W5 §5.1. Four rows, each about a claim the repo makes and could not check:
//
//   spa-fallback-contract  `_redirects` says what happens to a path that is not an asset.
//                          For four campaigns it said `/* /index.html 200` and the edge
//                          answered 404, because Cloudflare Pages serves a shipped
//                          `404.html` BEFORE it consults the splat (T7 close record:215).
//                          Nobody noticed for a campaign and a half. This row derives the
//                          answer from the artifacts, measures it on the edge, and reds on
//                          disagreement — and reds on the contradiction alone, offline,
//                          because a 200 rule under a shipped 404.html is a lie whatever
//                          any particular edge does with it.
//   asset-guard            an unknown `/assets/*` path must 404 and must NEVER be the app
//                          shell: `_headers` gives `/assets/*` a year of immutable cache,
//                          so one HTML body served there is cached as a stylesheet for a
//                          year (the 2026-07-15 poisoning).
//   console-clean          T9-B2. The Cloudflare Web Analytics beacon is injected into the
//                          HTML at the edge — for browser-shaped requests only, which is
//                          why a plain curl does not show it — and the site's own CSP
//                          allows `script-src 'self'` alone, so every page load prints a
//                          refusal in both engines. The row parses the injected scripts out
//                          of the served HTML and grades them against the served CSP, which
//                          is the whole of what the browser does before it refuses.
//   relay-revision         the relay Worker answers `GET /revision` with the sha
//                          `scripts/deploy-gated.sh` stamped at deploy. `unknown` is the
//                          default in `web/relay/wrangler.toml`, so `unknown` on the live
//                          Worker means something deployed it around the gate.
//
// Usage:
//   node scripts/edge-probe.mjs [--url <origin>] [--relay-url <origin>] [--expect-sha <sha>]
//   node scripts/edge-probe.mjs --local            # the artifacts, through a Pages emulator
//   node scripts/edge-probe.mjs --self-test        # offline; every arm shown able to red
//   node scripts/edge-probe.mjs --rows spa-fallback-contract,asset-guard
//
// Exit: 0 every selected row GREEN · 1 a row RED · 2 usage error
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = "web/frontend/public";
const DIST = "web/frontend/dist";
const DEFAULT_ORIGIN = "https://sudoku.babb.dev";

/** What a browser sends. The beacon injection keys off it: the same URL fetched with curl's
 *  default headers comes back WITHOUT the injected script, which is how a console error
 *  survived two campaigns of `curl` verification. */
const BROWSER_HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

const ROWS = [
  "spa-fallback-contract",
  "asset-guard",
  "console-clean",
  "relay-revision",
];

const USAGE = `usage: node scripts/edge-probe.mjs [--url <origin>] [--relay-url <origin>]
                                   [--expect-sha <sha>] [--rows <a,b>] [--local] [--self-test]`;

function parseArgs(argv) {
  const opts = {
    url: DEFAULT_ORIGIN,
    relayUrl: null,
    expectSha: null,
    rows: ROWS,
    local: false,
    selfTest: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const takesValue = new Set(["--url", "--relay-url", "--expect-sha", "--rows"]);
    const arg = argv[i];
    const value = takesValue.has(arg) ? argv[++i] : null;
    if (takesValue.has(arg) && value === undefined)
      die(`${arg} needs a value\n${USAGE}`);
    switch (arg) {
      case "--url":
        opts.url = value.replace(/\/$/, "");
        break;
      case "--relay-url":
        opts.relayUrl = value.replace(/\/$/, "");
        break;
      case "--expect-sha":
        opts.expectSha = value;
        break;
      case "--rows":
        opts.rows = value
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean);
        break;
      case "--local":
        opts.local = true;
        break;
      case "--self-test":
        opts.selfTest = true;
        break;
      case "-h":
      case "--help":
        console.log(USAGE);
        process.exit(0);
        break;
      default:
        die(`unknown argument: ${arg}\n${USAGE}`);
    }
  }
  const unknown = opts.rows.filter((r) => !ROWS.includes(r));
  if (unknown.length)
    die(`unknown row(s): ${unknown.join(", ")}\nknown: ${ROWS.join(", ")}`);
  return opts;
}

function die(message) {
  console.error(`edge-probe: ${message}`);
  process.exit(2);
}

// ── the artifacts ───────────────────────────────────────────────────────────────────────

const readRepo = (rel) => {
  const abs = resolve(REPO, rel);
  return existsSync(abs) && statSync(abs).isFile() ? readFileSync(abs, "utf8") : null;
};

/** `_redirects` as Cloudflare reads it: `<from> <to> <status>`, comments and blanks out. */
function parseRedirects(text) {
  return (text ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const [from, to, status] = l.split(/\s+/);
      return { from, to, status: Number(status ?? 200), line: l };
    });
}

const matchRule = (rule, path) =>
  rule.from.endsWith("/*")
    ? path.startsWith(rule.from.slice(0, -1))
    : rule.from === path;

/**
 * THE PRECEDENCE LAW, written down because it is the thing that bit.
 *
 * A shipped `404.html` is Cloudflare Pages' answer for any path matching no asset, and it
 * answers BEFORE a `_redirects` splat rewrite is honoured. So a `200` rule under a shipped
 * 404.html never fires — it is not a fallback, it is a sentence. `contradiction` is that
 * case, and it is decidable from the two artifacts alone, with no edge to ask.
 */
function predict({ rules, has404 }, path) {
  const rule = rules.find((r) => matchRule(r, path)) ?? null;
  const rewriteTo200 = rule && rule.status === 200;
  if (has404 && rewriteTo200)
    return {
      status: 404,
      shell: false,
      rule,
      contradiction:
        `${rule.line} declares a ${rule.status} rewrite, and public/404.html ships. ` +
        `Cloudflare Pages answers the 404 asset first, so the rewrite cannot fire: the ` +
        `file claims a fallback the edge does not perform. Retire the rule or move the ` +
        `404 asset out of the slot Pages reserves — and prove the change on the edge.`,
    };
  if (rewriteTo200)
    return { status: 200, shell: rule.to === "/index.html", rule, contradiction: null };
  if (rule) return { status: rule.status, shell: false, rule, contradiction: null };
  return { status: 404, shell: false, rule: null, contradiction: null };
}

/** The app shell, structurally — never by a copy string, which changes under every design
 *  wave. Vite's index.html mounts one div and names one entry module. */
const isShell = (body) =>
  /<div id="app">/.test(body) && /<script[^>]+src="\/assets\/index-/.test(body);

// ── the CSP comparator (B2) ─────────────────────────────────────────────────────────────

/** External `<script src>` origins in a document — the ones a CSP can refuse. */
function injectedScripts(html) {
  const out = [];
  for (const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    const src = m[1];
    if (/^https?:\/\//i.test(src)) out.push(src);
  }
  return out;
}

/** The directive a browser applies to a script: `script-src`, else `default-src`. */
function scriptSrc(csp) {
  if (!csp) return null;
  const parts = csp
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);
  const find = (name) =>
    parts.find(
      (p) => p.toLowerCase().startsWith(`${name} `) || p.toLowerCase() === name,
    );
  const d = find("script-src") ?? find("script-src-elem") ?? find("default-src");
  return d ? d.split(/\s+/).slice(1) : null;
}

/** Would this directive admit this URL? Host-source matching, narrowed to what the shipped
 *  CSP can express: a bare `*`, a scheme, an exact origin, or a `*.host` wildcard. `'self'`
 *  is deliberately NOT an admission — every URL reaching here is cross-origin. */
function admits(sources, url) {
  if (!sources) return true; // no CSP is no refusal
  const u = new URL(url);
  return sources.some((s) => {
    if (s === "*") return true;
    if (s === `${u.protocol}`) return true;
    if (s.startsWith("'")) return false;
    const src = s.replace(/\/$/, "");
    if (src === u.origin || src === u.host) return true;
    if (src.startsWith("*.")) return u.host.endsWith(src.slice(1));
    return false;
  });
}

/** The line the browser prints. Reproduced exactly so the row's report and a console
 *  screenshot are the same sentence. */
const refusalLine = (url, sources) =>
  `Refused to load the script '${url}' because it violates the following Content Security ` +
  `Policy directive: "script-src ${sources.join(" ")}".`;

// ── the Pages emulator (the --local preview) ────────────────────────────────────────────

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

/**
 * Cloudflare Pages' resolution order over a build output, as measured against the live edge
 * on 2026-08-25 (`evidence/w5/edge-measurements.txt`): an existing asset, then `/` →
 * index.html, then the 404 asset, then `_redirects`. The order is the point — putting the
 * 404 asset above the redirect table is the behaviour that killed the SPA fallback, and an
 * emulator that resolved redirects first would let the cure "pass" locally and fail live.
 *
 * Roots are searched in order, which is `vite build`'s own layering: `public/` is copied
 * over the bundle, so `public/` wins.
 */
function previewServer({ roots, indexHtml }) {
  const find = (rel) => {
    for (const root of roots) {
      const abs = join(root, rel);
      if (existsSync(abs) && statSync(abs).isFile()) return abs;
    }
    return null;
  };
  const send = (res, status, abs, body) => {
    const type = abs
      ? (TYPES[extname(abs)] ?? "application/octet-stream")
      : "text/html; charset=utf-8";
    res.writeHead(status, { "content-type": type });
    res.end(body ?? readFileSync(abs));
  };
  const rules = parseRedirects(readRepo(`${PUBLIC}/_redirects`));

  return createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://local").pathname);
    if (path === "/") return send(res, 200, "index.html", indexHtml);
    const asset = find(path.replace(/^\//, ""));
    if (asset) return send(res, 200, asset);
    const notFound = find("404.html");
    const rule = rules.find((r) => matchRule(r, path)) ?? null;
    if (notFound) return send(res, 404, notFound);
    if (rule && rule.status === 200 && rule.to === "/index.html")
      return send(res, 200, "index.html", indexHtml);
    if (rule) return send(res, rule.status, null, `${rule.status}\n`);
    return send(res, 404, null, "404\n");
  });
}

// ── the rows ────────────────────────────────────────────────────────────────────────────

const RED = [];
const say = (colour, row, detail) => {
  console.log(`${colour.padEnd(6)} ${row}${detail ? ` — ${detail}` : ""}`);
  if (colour === "RED") RED.push(row);
};

async function get(url, headers = {}) {
  const res = await fetch(url, { headers, redirect: "manual" });
  return { status: res.status, headers: res.headers, body: await res.text() };
}

async function rowFallbackContract(origin) {
  const rules = parseRedirects(readRepo(`${PUBLIC}/_redirects`));
  const has404 = existsSync(resolve(REPO, `${PUBLIC}/404.html`));
  const bare = "/no-such-path-edge-probe";
  const p = predict({ rules, has404 }, bare);

  console.log(
    `       declared: ${rules.length} rule(s) · public/404.html ${has404 ? "ships" : "absent"} ` +
      `· a bare path should answer ${p.status}${p.shell ? " with the shell" : ""}`,
  );
  if (p.contradiction) {
    say("RED", "spa-fallback-contract", p.contradiction);
    return;
  }
  const root = await get(`${origin}/`);
  const miss = await get(`${origin}${bare}`);
  const named = await get(`${origin}/kenken`);
  const faults = [];
  if (root.status !== 200 || !isShell(root.body))
    faults.push(
      `GET / answered ${root.status}${isShell(root.body) ? " with the shell" : " WITHOUT the shell"}`,
    );
  for (const [path, r] of [
    [bare, miss],
    ["/kenken", named],
  ]) {
    if (r.status !== p.status)
      faults.push(`GET ${path} answered ${r.status}, the artifacts say ${p.status}`);
    if (isShell(r.body) !== p.shell)
      faults.push(
        `GET ${path} ${isShell(r.body) ? "served" : "did not serve"} the app shell; the artifacts say it ${p.shell ? "should" : "should not"}`,
      );
  }
  if (faults.length) say("RED", "spa-fallback-contract", faults.join(" · "));
  else
    say(
      "GREEN",
      "spa-fallback-contract",
      `/ 200 shell · ${bare} ${miss.status} · /kenken ${named.status} — the edge does what the artifacts declare`,
    );
}

async function rowAssetGuard(origin) {
  const path = `/assets/edge-probe-${Date.now().toString(36)}.js`;
  const r = await get(`${origin}${path}`);
  const faults = [];
  if (r.status !== 404) faults.push(`answered ${r.status}, not 404`);
  if (isShell(r.body))
    faults.push(
      "served the APP SHELL under /assets/ — a year of immutable cache away from the 2026-07-15 poisoning",
    );
  if (faults.length) say("RED", "asset-guard", `GET ${path} ${faults.join(" · ")}`);
  else
    say("GREEN", "asset-guard", `GET ${path} → 404, ${r.body.length} B, not the shell`);
}

async function rowConsoleClean(origin) {
  const r = await get(`${origin}/`, BROWSER_HEADERS);
  const csp = r.headers.get("content-security-policy");
  const sources = scriptSrc(csp);
  const injected = injectedScripts(r.body);
  const refused = injected.filter((u) => !admits(sources, u));
  console.log(
    `       script-src ${sources ? sources.join(" ") : "<no CSP>"} · ${injected.length} cross-origin script(s) in the served HTML`,
  );
  if (!refused.length) {
    say(
      "GREEN",
      "console-clean",
      injected.length
        ? `${injected.length} cross-origin script(s), all admitted`
        : "no cross-origin script in the served HTML",
    );
    return;
  }
  say("RED", "console-clean", refused.map((u) => refusalLine(u, sources)).join(" · "));
}

/** The relay origin the SPA is allowed to reach, derived from the CSP the site ships rather
 *  than typed here — `_headers`' `connect-src` is one of the three files the origin has to
 *  agree across (doc-truth's `relay-origin-pair`). */
function relayOrigin() {
  const headers = readRepo(`${PUBLIC}/_headers`) ?? "";
  // One LINE, not one directive: the file's header block explains the CSP in prose above it,
  // and a pattern allowed to span newlines reads the explanation instead of the policy.
  const m = headers.match(/connect-src[^;\n]*\bwss:\/\/([^\s;\n]+)/);
  return m ? `https://${m[1]}` : null;
}

async function rowRelayRevision(origin, expectSha) {
  if (!origin) {
    say(
      "RED",
      "relay-revision",
      "no relay origin: `connect-src wss://…` is missing from web/frontend/public/_headers",
    );
    return;
  }
  const r = await get(`${origin}/revision`);
  const body = r.body.trim();
  if (r.status !== 200) {
    say(
      "RED",
      "relay-revision",
      `GET ${origin}/revision answered ${r.status} — the deployed Worker predates the revision endpoint, so which sha it runs cannot be read`,
    );
    return;
  }
  if (body === "unknown") {
    say(
      "RED",
      "relay-revision",
      `${origin}/revision says "unknown" — wrangler.toml's default, which means this Worker was deployed without scripts/deploy-gated.sh`,
    );
    return;
  }
  if (!/^[0-9a-f]{40}$/.test(body)) {
    say(
      "RED",
      "relay-revision",
      `${origin}/revision says "${body.slice(0, 60)}" — not a sha`,
    );
    return;
  }
  if (expectSha && body !== expectSha) {
    say(
      "RED",
      "relay-revision",
      `${origin}/revision says ${body}, the Pages build is ${expectSha} — the pair is SPLIT`,
    );
    return;
  }
  say(
    "GREEN",
    "relay-revision",
    `${origin}/revision → ${body}${expectSha ? " (== the Pages build)" : ""}`,
  );
}

// ── self-test ───────────────────────────────────────────────────────────────────────────

function selfTest() {
  let fail = 0;
  const ok = (name, got, want) => {
    const pass = got === want;
    if (!pass) fail++;
    console.log(
      `${pass ? "ok   " : "FAIL "} ${name} — ${got}${pass ? "" : ` (wanted ${want})`}`,
    );
  };
  const rules = (text) => parseRedirects(text);

  // The fallback contract's derivation, on the three artifact sets that matter.
  const trap = predict(
    { rules: rules("/assets/*  /404.html  404\n/*  /index.html  200\n"), has404: true },
    "/kenken",
  );
  ok(
    "HEAD's artifacts (404.html + a 200 splat) are a contradiction",
    Boolean(trap.contradiction),
    true,
  );
  ok(
    "…and the edge answer they really produce",
    `${trap.status}/${trap.shell}`,
    "404/false",
  );

  const cured = predict(
    { rules: rules("/assets/*  /404.html  404\n/*  /404.html  404\n"), has404: true },
    "/kenken",
  );
  ok("the cure (a stated 404) contradicts nothing", cured.contradiction, null);
  ok(
    "…and predicts the 404 the edge gives",
    `${cured.status}/${cured.shell}`,
    "404/false",
  );

  const restored = predict(
    { rules: rules("/*  /index.html  200\n"), has404: false },
    "/kenken",
  );
  ok(
    "a splat with NO 404 asset is a real fallback",
    `${restored.status}/${restored.shell}`,
    "200/true",
  );

  const guard = predict(
    { rules: rules("/assets/*  /404.html  404\n/*  /404.html  404\n"), has404: true },
    "/assets/nope.js",
  );
  ok(
    "the /assets guard is matched before the general rule",
    guard.rule.from,
    "/assets/*",
  );

  // The shell detector, which every live row leans on.
  ok(
    "the shell is recognised",
    isShell(
      '<div id="app"></div><script type="module" src="/assets/index-abc.js"></script>',
    ),
    true,
  );
  ok(
    "the 404 body is not the shell",
    isShell("<p>That page does not exist.</p>"),
    false,
  );

  // The CSP comparator (B2), on the live beacon and its two cures.
  const beacon = "https://static.cloudflareinsights.com/beacon.min.js/v4513226cdae";
  const shipped = scriptSrc(
    "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'",
  );
  ok("the shipped CSP refuses the injected beacon", admits(shipped, beacon), false);
  ok(
    "an allowlisted origin admits it (B2's other branch)",
    admits([...shipped, "https://static.cloudflareinsights.com"], beacon),
    true,
  );
  ok(
    "dropping the injection leaves nothing to refuse",
    injectedScripts('<script type="module" src="/assets/index-abc.js"></script>')
      .length,
    0,
  );
  ok(
    "the injection is found when it is there",
    injectedScripts(`<script src="${beacon}"></script>`)[0],
    beacon,
  );
  ok("no CSP is no refusal", admits(scriptSrc(null), beacon), true);
  ok(
    "the refusal line is the browser's",
    refusalLine(beacon, shipped),
    `Refused to load the script '${beacon}' because it violates the following Content Security Policy directive: "script-src 'self' 'wasm-unsafe-eval'".`,
  );

  console.log(
    fail
      ? `\n${fail} self-test row(s) FAILED`
      : "\n14/14 — every arm proved on fixtures, offline",
  );
  return fail === 0;
}

// ── run ─────────────────────────────────────────────────────────────────────────────────

const opts = parseArgs(process.argv.slice(2));

if (opts.selfTest) process.exit(selfTest() ? 0 : 1);

let origin = opts.url;
let server = null;
if (opts.local) {
  const roots = [resolve(REPO, PUBLIC), resolve(REPO, DIST)].filter((d) =>
    existsSync(d),
  );
  const distIndex = resolve(REPO, DIST, "index.html");
  const indexHtml = existsSync(distIndex)
    ? readFileSync(distIndex, "utf8")
    : '<!doctype html>\n<div id="app"></div>\n<script type="module" src="/assets/index-local.js"></script>\n';
  server = previewServer({ roots, indexHtml });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  origin = `http://127.0.0.1:${server.address().port}`;
  console.log(
    `[edge-probe] local preview of ${roots.map((r) => r.replace(`${REPO}/`, "")).join(" + ")} at ${origin}`,
  );
  opts.rows = opts.rows.filter(
    (r) => r === "spa-fallback-contract" || r === "asset-guard",
  );
}

console.log(`[edge-probe] ${origin} · rows: ${opts.rows.join(", ")}\n`);

for (const row of opts.rows) {
  // A row that cannot reach its surface is RED, never a crash and never a skip: an
  // unreachable edge is exactly the state this probe exists to report.
  try {
    if (row === "spa-fallback-contract") await rowFallbackContract(origin);
    if (row === "asset-guard") await rowAssetGuard(origin);
    if (row === "console-clean") await rowConsoleClean(origin);
    if (row === "relay-revision")
      await rowRelayRevision(opts.relayUrl ?? relayOrigin(), opts.expectSha);
  } catch (e) {
    say("RED", row, `the surface could not be read: ${e.cause?.message ?? e.message}`);
  }
}

if (server) server.close();

const head = (() => {
  try {
    return execFileSync("git", ["-C", REPO, "rev-parse", "--short", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
})();

console.log(
  `\n${RED.length} RED / ${opts.rows.length - RED.length} GREEN · ${origin} · tree ${head} · ${new Date().toISOString()}`,
);
process.exit(RED.length ? 1 : 0);
