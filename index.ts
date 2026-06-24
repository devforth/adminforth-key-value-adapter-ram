import type { KeyValueAdapter } from "adminforth";

export default class RAMKeyValueAdapter implements KeyValueAdapter {
  private data: Map<string, any>;

  constructor() {
    this.data = new Map();
  }

  validate() {

  }

  protected getActualKey(key: string, collection?: string): string {
    if (collection) {
      return `${collection}:${key}`;
    }
    return key;
  }

  async get(key: string, collection?: string): Promise<string> {
    const actualKey = this.getActualKey(key, collection);
    return this.data.get(actualKey);
  }

  async set(key: string, value: any, expiresInSeconds?: number, collection?: string): Promise<void> {
    const actualKey = this.getActualKey(key, collection);
    this.data.set(actualKey, value);
    if (expiresInSeconds) {
      setTimeout(() => {
        this.data.delete(actualKey);
      }, expiresInSeconds * 1000);
    }
  }

  async delete(key: string, collection?: string): Promise<void> {
    const actualKey = this.getActualKey(key, collection);
    this.data.delete(actualKey);
  }

  async listByPrefix(prefix: string, limit?: number, collection?: string): Promise<Record<string, string>[]> {
    const actualPrefix = this.getActualKey(prefix, collection);

    const matchedKeys = Array.from(this.data.keys())
      .filter((key) => key.startsWith(actualPrefix))
      .sort();

    const limitedKeys = typeof limit === 'number' ? matchedKeys.slice(0, limit) : matchedKeys;

    return limitedKeys.map((key) => ({ [key]: this.data.get(key) }));
  }
}
