import { makeEvent } from '@test/factories/make-event'
import { makeUser } from '@test/factories/make-user'
import { InMemoryEventsRepository } from '@test/repositories/in-memory-events.repository'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteEventByIdService } from '@/domain/challenge/application/services/event/delete-event-by-id.service'

let sut: DeleteEventByIdService
let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryEventsRepository: InMemoryEventsRepository
describe('Delete Event Service', () => {
  beforeEach(async () => {
    inMemoryEventsRepository = new InMemoryEventsRepository()
    inMemoryUserRepository = new InMemoryUsersRepository()

    sut = new DeleteEventByIdService(
      inMemoryEventsRepository,
      inMemoryUserRepository,
    )
  })
  it('should be able to Delete a event', async () => {
    const user = makeUser()
    await inMemoryUserRepository.create(user)

    const event = makeEvent()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      userId: user.id.toString(),
      id: event.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to delete a event if the user not exists', async () => {
    const user = makeUser()

    const event = makeEvent()

    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      id: event.id.toString(),
      userId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new NotAllowedError())
  })

  it('should not be able to delete a event if the event not exists', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const event = makeEvent()

    const result = await sut.execute({
      id: event.id.toString(),
      userId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new ResourceNotFoundError())
  })
})
