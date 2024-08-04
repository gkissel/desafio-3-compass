import { Request, Response } from 'express'
import * as j from 'joi'

import { PasswordsNotMatchError } from '@/domain/challenge/application/services/errors/passwords-not-match'
import { UserAlreadyExistsError } from '@/domain/challenge/application/services/errors/user-already-exists'
import { CreateUserService } from '@/domain/challenge/application/services/user/create-user.service'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users.repository'

export class CreateUserController {
  async execute(req: Request, res: Response) {
    const usersRepository = new PrismaUsersRepository()

    const hasher = new BcryptHasher()

    const createUser = new CreateUserService(usersRepository, hasher)

    const createUserSchema = j.object({
      firstName: j.string().required(),
      lastName: j.string().required(),
      birthDate: j.string().required(),
      city: j.string().required(),
      country: j.string().required(),
      email: j.string().required(),
      password: j.string().required(),
      confirmPassword: j.string().required(),
    })

    // Odeio Joi
    type createUserType = {
      firstName: string
      lastName: string
      birthDate: string
      city: string
      country: string
      email: string
      password: string
      confirmPassword: string
    }

    const { value, error } = createUserSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ statusCode: 400, error })
    }

    const result = await createUser.execute(value as createUserType)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case PasswordsNotMatchError:
          return res.status(400).json({
            statusCode: 400,
            message: error.message,
          })
        case UserAlreadyExistsError:
          return res.status(400).json({
            statusCode: 400,
            message: error.message,
          })
        default:
          return res.status(500).json({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Something went wrong',
          })
      }
    }

    const user = result.value

    return res.status(201).json(user)
  }
}
