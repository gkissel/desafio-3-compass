import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { User } from '@/domain/challenge/enterprise/user'

import { UsersRepository } from '../../repositories/user.repository'

interface AddUserProfileServiceRequest {
  userId: string

  avatarUrl: string
}

type AddUserProfileServiceResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

export class AddUserProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    avatarUrl,
  }: AddUserProfileServiceRequest): Promise<AddUserProfileServiceResponse> {
    const user = await this.usersRepository.findById(new UniqueEntityID(userId))

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    user.avatarUrl = avatarUrl

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
