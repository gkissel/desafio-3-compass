import { makeEvent } from '@test/factories/make-event'
import { makeUser } from '@test/factories/make-user'
import { InMemoryEventsRepository } from '@test/repositories/in-memory-events.repository'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DeleteManyEventsService } from '@/domain/challenge/application/services/event/delete-many-events.service'

let sut: DeleteManyEventsService
let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryEventsRepository: InMemoryEventsRepository
describe('Delete Many Events Service', () => {
  beforeEach(async () => {
    inMemoryEventsRepository = new InMemoryEventsRepository()
    inMemoryUserRepository = new InMemoryUsersRepository()

    sut = new DeleteManyEventsService(
      inMemoryEventsRepository,
      inMemoryUserRepository,
    )
  })
  it('should be able to Delete many events', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    for (let index = 0; index < 10; index++) {
      const event = makeEvent({ dayOfWeek: 'saturday' })
      await inMemoryEventsRepository.create(event)
    }

    const result = await sut.execute({
      userId: user.id.toString(),
      dayOfWeek: 'saturday',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to delete many events if the user not exists', async () => {
    const user = makeUser()

    for (let index = 0; index < 10; index++) {
      const event = makeEvent({ dayOfWeek: 'saturday' })
      await inMemoryEventsRepository.create(event)
    }

    const result = await sut.execute({
      userId: user.id.toString(),
      dayOfWeek: 'saturday',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toEqual(new NotAllowedError())
  })
})
