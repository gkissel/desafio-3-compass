import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Event } from '@/domain/challenge/enterprise/event'

import { EventsRepository } from '../../repositories/events.repository'
import { UsersRepository } from '../../repositories/user.repository'

interface DeleteEventByIdServiceRequest {
  id: string

  userId: string
}

type DeleteEventByIdServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    event: Event
  }
>

export class DeleteEventByIdService {
  constructor(
    private eventsRepository: EventsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    id,
    userId,
  }: DeleteEventByIdServiceRequest): Promise<DeleteEventByIdServiceResponse> {
    const user = await this.usersRepository.findById(new UniqueEntityID(userId))

    if (!user) {
      return left(new NotAllowedError())
    }

    const event = await this.eventsRepository.getById(new UniqueEntityID(id))

    if (!event) {
      return left(new ResourceNotFoundError())
    }

    await this.eventsRepository.delete(event)

    return right({
      event,
    })
  }
}
