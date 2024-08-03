import { faker } from '@faker-js/faker'
import { FakeHasher } from '@test/cryptography/fake-hasher'
import { makeUser } from '@test/factories/make-user'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { PasswordsNotMatchError } from '@/domain/challenge/application/services/errors/passwords-not-match'
import { UserAlreadyExistsError } from '@/domain/challenge/application/services/errors/user-already-exists'
import { CreateUserService } from '@/domain/challenge/application/services/user/create-user.service'

let sut: CreateUserService
let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher

describe('This is a simple test', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateUserService(inMemoryUsersRepository, fakeHasher)
  })
  it('should be able to register a new user', async () => {
    console.log('test')
    const result = await sut.execute({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.birthdate().toISOString(),
      city: faker.location.city(),
      country: faker.location.country(),
      password: '123456',
      confirmPassword: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.birthdate().toISOString(),
      city: faker.location.city(),
      country: faker.location.country(),
      password: '123456',
      confirmPassword: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to register a user with the same email', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.birthdate().toISOString(),
      city: faker.location.city(),
      country: faker.location.country(),
      confirmPassword: '123456',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new UserAlreadyExistsError(user.email))
  })

  it('should not be able to register a user if the passwords not match', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.birthdate().toISOString(),
      city: faker.location.city(),
      country: faker.location.country(),
      confirmPassword: '123456',
      password: '12345690',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new PasswordsNotMatchError())
  })
})
