import {entityContainer} from './entity-container'

class FakeClass {}

describe('entityContainer', () => {
  it('should work', () => {
    entityContainer.add(FakeClass)
    expect(entityContainer.get()).toStrictEqual([FakeClass])
  })
})
