import { faker } from '@faker-js/faker'
import { makeUser } from '@test/factories/make-user'
import { InMemoryEventsRepository } from '@test/repositories/in-memory-events.repository'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { CreateEventService } from '@/domain/challenge/application/services/event/create-event.service'

let sut: CreateEventService
let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryEventsRepository: InMemoryEventsRepository
describe('Create Event Service', () => {
  beforeEach(async () => {
    inMemoryEventsRepository = new InMemoryEventsRepository()
    inMemoryUserRepository = new InMemoryUsersRepository()

    sut = new CreateEventService(
      inMemoryEventsRepository,
      inMemoryUserRepository,
    )
  })
  it('should be able to create a new event', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      dayOfWeek: 'sunday',
      description: faker.lorem.paragraph(),
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      event: inMemoryEventsRepository.items[0],
    })
  })

  it('should not be able to register a event if the user not exists', async () => {
    const user = makeUser()

    const result = await sut.execute({
      dayOfWeek: 'sunday',
      description: faker.lorem.paragraph(),
      userId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new NotAllowedError())
  })
})
