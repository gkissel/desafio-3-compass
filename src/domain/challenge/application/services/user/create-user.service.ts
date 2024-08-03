import { Either, left, right } from '@/core/either'
import { User } from '@/domain/challenge/enterprise/user'

import { UsersRepository } from '../../repositories/user.repository'
import { PasswordsNotMatchError } from '../errors/passwords-not-match'
import { UserAlreadyExistsError } from '../errors/user-already-exists'

interface CreateUserServiceRequest {
  firstName: string
  lastName: string
  birthDate: string
  city: string
  country: string
  email: string
  password: string
  confirmPassword: string
}

type CreateUserServiceResponse = Either<
  UserAlreadyExistsError,
  | PasswordsNotMatchError
  | {
      user: User
    }
>

export class CreateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    birthDate,
    city,
    confirmPassword,
    email,
    country,
    firstName,
    lastName,
    password,
  }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    if (password !== confirmPassword) {
      return left(new PasswordsNotMatchError())
    }

    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError(email))
    }

    const user = User.create({
      birthDate,
      city,
      country,
      email,
      firstName,
      lastName,
      password,
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })
  }
}
