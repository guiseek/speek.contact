type Nullable<T> = T | null | undefined
interface SubLike {
  unsubscribe(): void
}

const isFunction = <T>(fn: T) => typeof fn === 'function'

export class SubAsync {
  protected _subs: Nullable<SubLike>[] = []

  add(...subs: Nullable<SubLike>[]) {
    this._subs = this._subs.concat(subs)
  }

  set async(sub: Nullable<SubLike>) {
    this._subs.push(sub)
  }

  unsub() {
    const unsub = (sub: Nullable<SubLike>) => {
      return sub && isFunction(sub.unsubscribe) && sub.unsubscribe()
    }
    this._subs.forEach(unsub)
    this._subs = []
  }
}
