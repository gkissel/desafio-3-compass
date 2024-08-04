import { Request, Response } from 'express'
import * as j from 'joi'

import { WrongCredentialsError } from '@/domain/challenge/application/services/errors/wrong-credentials-error'
import { AuthenticateUserService } from '@/domain/challenge/application/services/user/authenticate-user.service'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users.repository'

export class AuthenticateUserController {
  async execute(request: Request, response: Response) {
    const usersRepository = new PrismaUsersRepository()

    const hasher = new BcryptHasher()

    const encrypter = new JwtEncrypter()

    const authenticate = new AuthenticateUserService(
      usersRepository,
      hasher,
      encrypter,
    )
    const loginSchema = j.object({
      email: j.string().email().required(),
      password: j.string().min(6).required(),
    })

    type LoginType = {
      email: string
      password: string
    }

    const { value, error } = loginSchema.validate(request.body)

    if (error) {
      return response.status(400).json(error)
    }

    const { email, password }: LoginType = value

    const result = await authenticate.execute({ email, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          return response.status(400).json({
            statusCode: 400,
            message: error.message,
          })
        default:
          return response.status(500).json({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Something went wrong',
          })
      }
    }

    const { accessToken } = result.value

    return response.status(201).json({ accessToken })
  }
}
