import dotenv from 'dotenv'
import * as j from 'joi'

dotenv.config()

export const envSchema = j.object({
  PORT: j.number().optional().default(3333),
  JWT_SECRET: j.string(),
  DATABASE_URL: j.string(),
})

// Odeio Joi
export type envType = {
  PORT: number
  JWT_SECRET: string
  DATABASE_URL: string
}

const { value } = envSchema.validate(process.env)

export const env: envType = value
