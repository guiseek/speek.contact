import {Injectable} from '@angular/core'
import {SettingsConfig} from '../interfaces/settings-config'

@Injectable({
  providedIn: 'root',
})
export class StorageService<T = SettingsConfig> {
  private _storage: Storage

  constructor(storage: Storage) {
    this._storage = storage
  }

  getItem<K extends keyof T>(key: K) {
    const data = this._storage.getItem(String(key)) ?? null
    if (data) {
      try {
        return JSON.parse(data)
      } catch {
        return data
      }
    }
  }

  setItem<K extends keyof T>(key: K, value: T[K]) {
    if (value) {
      const data = typeof value !== 'string' ? JSON.stringify(value) : value

      this._storage.setItem(String(key), data)
    }
  }

  removeItem<K extends keyof T>(key: K) {
    this._storage.removeItem(String(key))
  }
}
