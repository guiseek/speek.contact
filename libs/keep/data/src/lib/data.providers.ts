import {DataSource, DataSourceOptions} from 'typeorm'
import {entityContainer} from '@speek/keep/utils'
import {SnakeNamingStrategy} from './strategies'
import {dataOptions} from './config/data-options'
import {Provider} from '@nestjs/common'

export const DATA_PROVIDERS: Provider<unknown>[] = [
  {
    provide: 'data.options',
    useValue: dataOptions,
  },
  {
    provide: 'data.source',
    useFactory: (dataOptions: DataSourceOptions) => {
      const entities = entityContainer.get()
      const namingStrategy = new SnakeNamingStrategy()
      const config = {namingStrategy, ...dataOptions, entities}
      const dataSource = new DataSource(config)
      return dataSource.initialize()
    },
    inject: ['data.options'],
  },
]
