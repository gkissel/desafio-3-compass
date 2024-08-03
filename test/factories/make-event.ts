import { faker } from '@faker-js/faker'
import { DayOfWeek } from '@prisma/client'
import { randomInt } from 'crypto'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Event, EventProps } from '@/domain/challenge/enterprise/event'

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
