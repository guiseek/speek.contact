import {of} from 'rxjs'
import {SubAsync} from './sub-async'

describe('SubAsync', () => {
  let sub: SubAsync

  beforeEach(() => {
    sub = new SubAsync()
  })
  it('should work', () => {
    const spy = jest.spyOn(sub, 'unsub')

    const of$ = of(1)
    sub.async = of$.subscribe()

    expect(sub['_subs'].length).toEqual(1)

    sub.unsub()

    expect(spy).toHaveBeenCalled()

    expect(sub['_subs'].length).toEqual(0)
  })
})
