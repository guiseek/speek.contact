import {Provider} from '@nestjs/common'
import {DataSource, Repository} from 'typeorm'
import {UserServiceImpl} from './services/user.service.impl'
import {UserService} from './ports/user.service'
import {UserImpl} from './entities/user.impl'
import {User} from './ports/user'

export const USER_PROVIDERS: Provider<unknown>[] = [
  {
    provide: 'user.repository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserImpl),
    inject: ['data.source'],
  },
  {
    provide: UserService,
    useFactory: (userRepository: Repository<User>) =>
      new UserServiceImpl(userRepository),
    inject: ['user.repository'],
  },
]
