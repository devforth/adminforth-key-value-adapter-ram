import type { KeyValueAdapter } from "adminforth";

export default class RAMKeyValueAdapter implements KeyValueAdapter {
  private data: Map<string, any>;

  constructor() {
    this.data = new Map();
  }

  validate() {

  }

  async get(key: string): Promise<string> {
    return this.data.get(key);
  }

  async set(key: string, value: any, expiresInSeconds?: number): Promise<void> {
    this.data.set(key, value);
    if (expiresInSeconds) {
      setTimeout(() => {
        this.data.delete(key);
      }, expiresInSeconds * 1000);
    }
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }
}