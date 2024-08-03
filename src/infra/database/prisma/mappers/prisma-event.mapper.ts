import { Event as PrismaEvent, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DayOfWeek, Event } from '@/domain/challenge/enterprise/event'

export class PrismaEventMapper {
  static toDomain(raw: PrismaEvent): Event {
    return Event.create(
      {
        dayOfWeek: raw.dayOfWeek,
        description: raw.description,
        userId: new UniqueEntityID(raw.userId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(event: Event): Prisma.EventUncheckedCreateInput {
    return {
      id: event.id.toString(),
      dayOfWeek: event.dayOfWeek as DayOfWeek,
      description: event.description,
      userId: event.userId.toString(),
    }
  }
}
