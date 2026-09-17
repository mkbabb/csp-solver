// The node runtime, as narrowly as the package's ROOT CONFIGS use it (T9-W6 §6.2, handoff 6b-2).
//
// Sibling to `e2e/node.d.ts`, same register, different subject: that file declares what the spec
// estate calls, this one declares what `vite.config.ts`, `vitest.config.ts` and the three
// playwright configs call. They are two programs (`tsconfig.e2e.json` and `tsconfig.node.json`)
// and neither ambient set reaches the other, which is deliberate — a shared file would widen
// both surfaces every time either one grew, and the point of declaring narrowly is that growth
// has to be written down.
//
// WHY THIS AND NOT `@types/node`. The chair's ruling at this fold, and the same argument
// `e2e/node.d.ts` carries: the package is not installed, and adding it is not a free act.
// `tsconfig.json` declares no `types` field, so every `@types/*` on disk goes ambient in the
// APP's typecheck too — `process`, `Buffer` and the whole node global surface would silently
// become available to `src/**`, which is browser code. The narrow route needs no lockfile edit
// and no `"types": []` pin in the app config to go with it.
//
// WHY NARROW IS NOT A COMPROMISE HERE. These are the five fs functions, two path functions, one
// url function and two globals the root configs actually call, in the exact shapes they call
// them. A call this file cannot type is a RED, not a silent pass — `readFileSync` without an
// encoding returns bytes in real node and a string under a loose shim; here it does not compile
// at all until someone declares what they meant.

declare module "node:fs" {
  /** `readFileSync(abs, 'utf8')` — the only form the configs call. */
  export function readFileSync(path: string, encoding: "utf8"): string;
  export function writeFileSync(path: string, data: string): void;
  export function existsSync(path: string): boolean;
  export function readdirSync(path: string): string[];
  export function statSync(path: string): { isDirectory(): boolean };
}

declare module "node:path" {
  export function join(...parts: string[]): string;
  export function resolve(...parts: string[]): string;
}

/**
 * `import path from 'path'` — vite.config.ts's alias block reaches for the BARE specifier while
 * its own template-bank plugin imports `node:path`. Both spellings resolve to the same builtin,
 * and both are declared rather than rewritten: this file's job is to type the tree as written,
 * not to edit it.
 */
declare module "path" {
  const path: {
    resolve(...parts: string[]): string;
    join(...parts: string[]): string;
  };
  export default path;
}

declare module "node:url" {
  export function fileURLToPath(url: string | URL): string;
}

/** `process.cwd()` and `process.env.<NAME>` — the two members the configs read. */
declare const process: {
  cwd(): string;
  readonly env: Readonly<Record<string, string | undefined>>;
};

/** CommonJS's directory global, which vite.config.ts resolves its aliases against. */
declare const __dirname: string;
