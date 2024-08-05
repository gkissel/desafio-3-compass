import { faker } from '@faker-js/faker'
import { DayOfWeek, PrismaClient } from '@prisma/client'
import { randomInt } from 'crypto'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Event, EventProps } from '@/domain/challenge/enterprise/event'
import { PrismaEventMapper } from '@/infra/database/prisma/mappers/prisma-event.mapper'

export function makeEvent(
  override: Partial<EventProps> = {},
  id?: UniqueEntityID,
) {
  const weekDays: DayOfWeek[] = [
    'friday',
    'monday',
    'saturday',
    'sunday',
    'thursday',
    'tuesday',
    'wednesday',
  ]
  const event = Event.create(
    {
      dayOfWeek: weekDays[randomInt(0, 6)],
      description: faker.lorem.paragraph(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return event
}

export class EventFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaEvent(data: Partial<EventProps> = {}): Promise<Event> {
    const event = makeEvent(data)

    await this.prisma.event.create({
      data: PrismaEventMapper.toPrisma(event),
    })

    return event
  }
}
