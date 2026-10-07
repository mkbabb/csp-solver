// ACC-SIX pass 8 · the UNION build (74a2b5d9 + s13-s7-s3 + homes.on + this lane's on-union delta), out of tree.
//   ARM=gold (the union's default) | violet (the const flipped in memory, two lines of index.css)
import base from '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8/u8/web/frontend/vite.config.ts';
const ARM = process.env.ARM ?? 'gold';
const plant = { name: 'acc6p8-arm', enforce: 'pre' as const, transform(code: string, id: string) {
  if (ARM !== 'violet' || !id.endsWith('/assets/index.css')) return;
  const o = code.replace('--accent-ink: var(--accent-gold-ink);', '--accent-ink: var(--accent-violet-ink);').replace('--accent-glow: var(--accent-gold-glow);', '--accent-glow: var(--accent-violet-glow);');
  if (!o.includes('--accent-glow: var(--accent-violet-glow);') || !o.includes('--accent-ink: var(--accent-violet-ink);')) throw new Error('arm plant missed'); return o; } };
export default { ...base, plugins: [plant, ...(base.plugins ?? [])], cacheDir: '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8/cache-u8-' + ARM };
