/**
 * Node 22+ defines experimental `localStorage` / `sessionStorage` getters on
 * globalThis. Without `--localstorage-file`, those getters return undefined
 * and jsdom will not install its own Storage — so specs that call
 * `localStorage.clear()` crash in CI on Node 26.
 */
class MemoryStorage implements Storage {
  readonly #store = new Map<string, string>();

  get length(): number {
    return this.#store.size;
  }

  clear(): void {
    this.#store.clear();
  }

  getItem(key: string): string | null {
    return this.#store.has(key) ? this.#store.get(key)! : null;
  }

  key(index: number): string | null {
    return [...this.#store.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.#store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#store.set(key, String(value));
  }
}

function storageWorks(name: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const storage = (globalThis as Record<string, unknown>)[name] as Storage | undefined;
    if (!storage || typeof storage.setItem !== 'function') {
      return false;
    }
    storage.setItem('__mikepattyn_storage_probe__', '1');
    storage.removeItem('__mikepattyn_storage_probe__');
    return true;
  } catch {
    return false;
  }
}

function install(name: 'localStorage' | 'sessionStorage'): void {
  try {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: new MemoryStorage(),
    });
  } catch {
    // Node's experimental getter can be non-configurable; CI also sets
    // NODE_OPTIONS=--localstorage-file so the native Storage API works.
  }
}

if (!storageWorks('localStorage')) {
  install('localStorage');
}

if (!storageWorks('sessionStorage')) {
  install('sessionStorage');
}

beforeEach(() => {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    /* Node experimental Storage can throw when unset */
  }
});
