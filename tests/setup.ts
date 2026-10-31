import '@testing-library/jest-dom';

// Robust mock for localStorage in jsdom environment
if (typeof window !== 'undefined') {
  class LocalStorageMock {
    [key: string]: any;

    getItem(key: string): string | null {
      return Object.prototype.hasOwnProperty.call(this, key) ? String(this[key]) : null;
    }

    setItem(key: string, value: string): void {
      this[key] = String(value);
    }

    removeItem(key: string): void {
      delete this[key];
    }

    clear(): void {
      for (const key of Object.keys(this)) {
        if (typeof this[key] !== 'function') {
          delete this[key];
        }
      }
    }

    get length(): number {
      return Object.keys(this).filter((k) => typeof this[k] !== 'function').length;
    }

    key(index: number): string | null {
      const keys = Object.keys(this).filter((k) => typeof this[k] !== 'function');
      return keys[index] || null;
    }
  }

  const mock = new LocalStorageMock();
  Object.defineProperty(window, 'localStorage', {
    value: mock,
    writable: true,
  });
}
