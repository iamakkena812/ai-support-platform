/**
 * Storage utility.
 *
 * Provides a strongly typed wrapper around browser
 * localStorage.
 */

export class StorageService {
  /**
   * Stores a value.
   *
   * @param key Storage key.
   * @param value Value to store.
   */
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Retrieves a stored value.
   *
   * @param key Storage key.
   * @returns Stored value or null.
   */
  get<T>(key: string): T | null {
    const value = localStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  /**
   * Removes a value.
   *
   * @param key Storage key.
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clears all storage.
   */
  clear(): void {
    localStorage.clear();
  }
}

/**
 * Shared storage instance.
 */
export const storage = new StorageService();