import dotenv from 'dotenv'
import * as j from 'joi'

dotenv.config()

const envSchema = j.object({
  PORT: j.number().optional().default(3333),
  JWT_SECRET: j.string,
})

export const { value } = envSchema.validate(process.env)
