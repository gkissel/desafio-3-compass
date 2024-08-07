import { faker } from '@faker-js/faker'
import { makeUser } from '@test/factories/make-user'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AddUserProfileService } from '@/domain/challenge/application/services/user/add-user-profile.service'

let sut: AddUserProfileService
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create User Service', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new AddUserProfileService(inMemoryUsersRepository)
  })
  it('should be able to add a avatar url to a user', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      avatarUrl: faker.image.avatarGitHub(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })
  })

  it('should not be able change avatar url to a user if the user not exists', async () => {
    const user = makeUser()

    const result = await sut.execute({
      userId: user.id.toString(),
      avatarUrl: faker.image.avatarGitHub(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new ResourceNotFoundError())
  })
})
