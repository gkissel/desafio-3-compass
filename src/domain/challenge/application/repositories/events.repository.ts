import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { DayOfWeek, Event } from '../../enterprise/event'

export abstract class EventsRepository {
  abstract create(event: Event): Promise<void>
  abstract save(event: Event): Promise<void>
  abstract delete(event: Event): Promise<void>

  abstract getMany({
    dayOfWeek,
    description,
  }: {
    dayOfWeek?: DayOfWeek
    description?: string
  }): Promise<Event[]>

  abstract getById(id: UniqueEntityID): Promise<Event | null>
}
