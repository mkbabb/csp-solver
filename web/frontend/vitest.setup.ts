// FE-unit setup (T4-W2). This jsdom build provisions no Web Storage (`window.localStorage`
// is undefined), yet both games' `useUrlState` persist through bare `localStorage`. Install a
// tiny in-memory Storage so the codec's storage path is exercisable. Deliberately plain — no
// transform, no framework — so it survives the W5 TS bump. A fresh instance per test file
// (vitest isolates file globals); within a file, `localStorage.clear()` resets it.

class MemoryStorage {
  private store = new Map<string, string>()
  get length(): number {
    return this.store.size
  }
  key(i: number): string | null {
    return [...this.store.keys()][i] ?? null
  }
  getItem(k: string): string | null {
    return this.store.has(k) ? this.store.get(k)! : null
  }
  setItem(k: string, v: string): void {
    this.store.set(k, String(v))
  }
  removeItem(k: string): void {
    this.store.delete(k)
  }
  clear(): void {
    this.store.clear()
  }
}

const storage = new MemoryStorage() as unknown as Storage
globalThis.localStorage = storage
if (typeof window !== 'undefined') window.localStorage = storage
