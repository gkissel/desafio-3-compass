import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DayOfWeek, Event } from '@/domain/challenge/enterprise/event'

import { EventsRepository } from '../../repositories/events.repository'
import { UsersRepository } from '../../repositories/user.repository'

interface CreateEventServiceRequest {
  userId: string
  description: string
  dayOfWeek: DayOfWeek
}

type CreateEventServiceResponse = Either<
  NotAllowedError,
  {
    event: Event
  }
>

export class CreateEventService {
  constructor(
    private eventsRepository: EventsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    dayOfWeek,
    description,
    userId,
  }: CreateEventServiceRequest): Promise<CreateEventServiceResponse> {
    const user = await this.usersRepository.findById(new UniqueEntityID(userId))

    if (!user) {
      return left(new NotAllowedError())
    }

    const event = Event.create({
      dayOfWeek,
      description,
      userId: user.id,
    })

    await this.eventsRepository.create(event)

    return right({
      event,
    })
  }
}
