import { makeEvent } from '@test/factories/make-event'
import { makeUser } from '@test/factories/make-user'
import { InMemoryEventsRepository } from '@test/repositories/in-memory-events.repository'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { GetEventByIdService } from '@/domain/challenge/application/services/event/get-event-by-id.service'

let sut: GetEventByIdService
let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryEventsRepository: InMemoryEventsRepository
describe('Get Event Service', () => {
  beforeEach(async () => {
    inMemoryEventsRepository = new InMemoryEventsRepository()
    inMemoryUserRepository = new InMemoryUsersRepository()

    sut = new GetEventByIdService(
      inMemoryEventsRepository,
      inMemoryUserRepository,
    )
  })
  it('should be able to get a event', async () => {
    const user = makeUser()
    await inMemoryUserRepository.create(user)

    const event = makeEvent()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      userId: user.id.toString(),
      id: event.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ event })
  })

  it('should not be able to get a event if user not exists', async () => {
    const user = makeUser()

    const event = makeEvent()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      userId: user.id.toString(),
      id: event.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new NotAllowedError())
  })
})
