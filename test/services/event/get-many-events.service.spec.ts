import { makeEvent } from '@test/factories/make-event'
import { makeUser } from '@test/factories/make-user'
import { InMemoryEventsRepository } from '@test/repositories/in-memory-events.repository'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { GetManyEventsService } from '@/domain/challenge/application/services/event/get-many-events.service'

let sut: GetManyEventsService
let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryEventsRepository: InMemoryEventsRepository
describe('Get Many Events Service', () => {
  beforeEach(async () => {
    inMemoryEventsRepository = new InMemoryEventsRepository()
    inMemoryUserRepository = new InMemoryUsersRepository()

    sut = new GetManyEventsService(
      inMemoryEventsRepository,
      inMemoryUserRepository,
    )
  })
  it('should be able to get all events', async () => {
    const user = makeUser()
    await inMemoryUserRepository.create(user)

    for (let index = 0; index < 10; index++) {
      const event = makeEvent()
      await inMemoryEventsRepository.create(event)
    }
    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({ events: expect.any(Array) }),
    )
  })

  it('should be able to get events filtered by day of week (Saturday)', async () => {
    const user = makeUser()
    await inMemoryUserRepository.create(user)

    for (let index = 0; index < 10; index++) {
      const event = makeEvent()
      await inMemoryEventsRepository.create(event)
    }
    const result = await sut.execute({
      userId: user.id.toString(),
      dayOfWeek: 'saturday',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({ events: expect.any(Array) }),
    )
    if (result.isRight()) {
      const events = result.value.events
      const filteredEvents = events.filter(
        (event) => event.dayOfWeek === 'saturday',
      )

      expect(events).toEqual(filteredEvents)

      expect(
        filteredEvents.every((event) => event.dayOfWeek === 'saturday'),
      ).toBe(true)
    }
  })

  it('should be able to get events filtered by description', async () => {
    const user = makeUser()
    await inMemoryUserRepository.create(user)

    const event1 = makeEvent({ description: 'Meeting' })
    await inMemoryEventsRepository.create(event1)

    const event2 = makeEvent({ description: 'Training' })
    await inMemoryEventsRepository.create(event2)

    const event3 = makeEvent({ description: 'Workshop' })
    await inMemoryEventsRepository.create(event3)

    const result = await sut.execute({
      userId: user.id.toString(),
      description: 'Meeting',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({ events: expect.any(Array) }),
    )
    if (result.isRight()) {
      const events = result.value.events
      const filteredEvents = events.filter(
        (event) => event.description === 'Meeting',
      )

      expect(events).toEqual(filteredEvents)

      expect(
        filteredEvents.every((event) => event.description === 'Meeting'),
      ).toBe(true)
    }
  })

  it('should not be able to get a event if user not exists', async () => {
    const user = makeUser()

    const event = makeEvent()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new NotAllowedError())
  })
})
