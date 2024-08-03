import { faker } from '@faker-js/faker'
import { FakeEncrypter } from '@test/cryptography/fake-encrypter'
import { FakeHasher } from '@test/cryptography/fake-hasher'
import { makeUser } from '@test/factories/make-user'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { WrongCredentialsError } from '@/domain/challenge/application/services/errors/wrong-credentials-error'
import { AuthenticateUserService } from '@/domain/challenge/application/services/user/authenticate-user.service'

let sut: AuthenticateUserService
let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

describe('Authenticate User Service', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUserService(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate', async () => {
    const securePassword = faker.internet.password()

    const user = makeUser({
      password: await fakeHasher.hash(securePassword),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: user.email,

      password: securePassword,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: await fakeEncrypter.encrypt({ sub: user.id.toString() }),
    })
  })

  it('should not be able to authenticate with wrong password', async () => {
    const user = makeUser()

    const result = await sut.execute({
      email: user.email,

      password: user.password,
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toEqual(new WrongCredentialsError())
  })
})
