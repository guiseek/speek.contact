import {Settings} from '@speek/type'

export class StorageService<T extends Settings = Settings> {
  private _storage: Storage

  constructor(storage: Storage) {
    this._storage = storage
  }

  getItem<K extends keyof T>(key: K) {
    const data = this._storage.getItem(String(key)) ?? null
    if (data) {
      try {
        return JSON.parse(data) as T[K] | null
      } catch {
        return data as T[K] | null
      }
    }
    return data as T[K] | null
  }

  setItem<K extends keyof T>(key: K, value: T[K]) {
    if (value) {
      const data =
        typeof value !== 'string' //
          ? JSON.stringify(value)
          : value

      this._storage.setItem(String(key), data)
    }
  }

  removeItem<K extends keyof T>(key: K) {
    this._storage.removeItem(String(key))
  }
}
