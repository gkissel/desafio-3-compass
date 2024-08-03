import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DayOfWeek, Event } from '@/domain/challenge/enterprise/event'

import { EventsRepository } from '../../repositories/events.repository'
import { UsersRepository } from '../../repositories/user.repository'

interface GetManyEventsServiceRequest {
  dayOfWeek: DayOfWeek
  description: string

  userId: string
}

type GetManyEventsServiceResponse = Either<
  NotAllowedError,
  {
    events: Event[]
  }
>

export class GetManyEventsService {
  constructor(
    private eventsRepository: EventsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    dayOfWeek,
    description,
    userId,
  }: GetManyEventsServiceRequest): Promise<GetManyEventsServiceResponse> {
    const user = await this.usersRepository.findById(new UniqueEntityID(userId))

    if (!user) {
      return left(new NotAllowedError())
    }

    const events = await this.eventsRepository.getMany({
      dayOfWeek,
      description,
    })

    return right({
      events,
    })
  }
}
