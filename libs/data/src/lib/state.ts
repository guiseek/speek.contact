import {BehaviorSubject, distinctUntilChanged, map, filter} from 'rxjs'

export abstract class State<T> {
  private _state: BehaviorSubject<T>
  protected get state(): T {
    return this._state.getValue()
  }

  constructor(initialState: T) {
    this._state = new BehaviorSubject<T>(initialState)
  }

  protected select<K>(mapFn: (state: T) => K) {
    return this._state.asObservable().pipe(
      map((state: T) => mapFn(state)),
      distinctUntilChanged()
    )
  }

  protected filter<K>(filterFn: (state: T) => boolean, mapFn: (state: T) => K) {
    return this._state.asObservable().pipe(
      filter((state: T) => filterFn(state)),
      map((state: T) => mapFn(state)),
      distinctUntilChanged()
    )
  }

  protected setState(newState: Partial<T>) {
    this._state.next({
      ...this.state,
      ...newState,
    })
  }
}
