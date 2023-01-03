import {config} from 'dotenv'

config()

const env = process.env

export const apisOptions = {
  jwtSecret: env.JWT_SECRET,
}
