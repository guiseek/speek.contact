import {DataSourceOptions, LoggerOptions} from 'typeorm'
import {config} from 'dotenv'

config()

const env = process.env

export const dataOptions = {
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: +env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  dropSchema: env.DB_DROP_SCHEMA === 'true',
  synchronize: env.DB_SYNCHRONIZE === 'true',
  logging: env.DB_LOGGING as LoggerOptions,
} as DataSourceOptions
