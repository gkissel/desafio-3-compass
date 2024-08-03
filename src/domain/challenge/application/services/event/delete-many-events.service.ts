import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DayOfWeek } from '@/domain/challenge/enterprise/event'

import { EventsRepository } from '../../repositories/events.repository'
import { UsersRepository } from '../../repositories/user.repository'

interface DeleteManyEventsServiceRequest {
  dayOfWeek: DayOfWeek

  userId: string
}

type DeleteManyEventsServiceResponse = Either<NotAllowedError, null>

export class DeleteManyEventsService {
  constructor(
    private eventsRepository: EventsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    dayOfWeek,
    userId,
  }: DeleteManyEventsServiceRequest): Promise<DeleteManyEventsServiceResponse> {
    const user = await this.usersRepository.findById(new UniqueEntityID(userId))

    if (!user) {
      return left(new NotAllowedError())
    }

    const events = await this.eventsRepository.getMany({
      dayOfWeek,
    })

    events.map(async (event) => await this.eventsRepository.delete(event))

    return right(null)
  }
}
