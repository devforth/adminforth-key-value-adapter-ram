import type { AdapterOptions } from "./types.js";
import type { KeyValueAdapter } from "adminforth";

const data = new Map();

export default class RAMKeyValueAdapter implements KeyValueAdapter {
  options: AdapterOptions;

  constructor(options: AdapterOptions) {
    this.options = options;
  }

  validate() {

  }

  async get(key: string): Promise<string> {
    return data.get(key);
  }

  async set(key: string, value: string, expiresInSeconds?: number): Promise<void> {
    data.set(key, value);
    if (expiresInSeconds) {
      setTimeout(() => {
        data.delete(key);
      }, expiresInSeconds * 1000);
    }
  }

  async delete(key: string): Promise<void> {
    data.delete(key);
  }

}