import * as jwt from 'jsonwebtoken'

import { Encrypter } from '@/domain/challenge/application/cryptography/encrypter'

import { env } from '../env'

const { JWT_SECRET } = env

export class JwtEncrypter implements Encrypter {
  constructor() {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
  }
}
