export type ClassType<T> = {
  new (...args: unknown[]): T
}

class EntityContainer {
  private _container = new Set<ClassType<unknown>>([])

  add<T>(entity: ClassType<T>) {
    this._container.add(entity)
  }

  get() {
    return Array.from(this._container)
  }
}

export const entityContainer = new EntityContainer()
