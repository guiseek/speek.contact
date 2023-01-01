import {State} from './state'

interface StateUserMock {
  id: number
  username: string
}
interface StateDataMock {
  user: StateUserMock | null
}

class StateMock extends State<StateDataMock> {
  user$ = this.select((state) => state.user)

  constructor() {
    super({
      user: null,
    })
  }

  setUser(user: StateUserMock) {
    this.setState({user})
  }
}

const userMock = {
  id: 0,
  username: 'Gui'
}

describe('State', () => {
  let state: StateMock

  beforeEach(() => {
    state = new StateMock()
  })

  it('should return null', () => {
    const spy = jest.spyOn(state.user$, 'subscribe')

    const {user} = state['state']
    state.user$.subscribe()

    expect(spy).toHaveBeenCalled()
    expect(user).toBeNull()
  })

  it('should return user', () => {
    const spy = jest.spyOn(state.user$, 'subscribe')

    state.setUser(userMock)
    const {user} = state['state']
    state.user$.subscribe()

    expect(spy).toHaveBeenCalled()
    expect(user).toStrictEqual(userMock)
  })
})
