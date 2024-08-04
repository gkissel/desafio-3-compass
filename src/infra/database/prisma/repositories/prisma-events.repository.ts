import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EventsRepository } from '@/domain/challenge/application/repositories/events.repository'
import { DayOfWeek, Event } from '@/domain/challenge/enterprise/event'
import { prisma } from '@/server'

import { PrismaEventMapper } from '../mappers/prisma-event.mapper'

export class PrismaEventsRepository implements EventsRepository {
  async getMany({
    dayOfWeek,
    description,
  }: {
    dayOfWeek?: DayOfWeek
    description?: string
  }): Promise<Event[]> {
    const prismaEvents = await prisma.event.findMany({
      where: {
        dayOfWeek,
        description: {
          contains: description,
        },
      },
    })

    return prismaEvents.map((prismaEvent) =>
      PrismaEventMapper.toDomain(prismaEvent),
    )
  }

  async getById(id: UniqueEntityID): Promise<Event | null> {
    const prismaEvent = await prisma.event.findUnique({
      where: {
        id: id.toString(),
      },
    })

    if (!prismaEvent) {
      return null
    }

    return PrismaEventMapper.toDomain(prismaEvent)
  }

  async save(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPrisma(event)

    await prisma.event.update({
      where: {
        id: event.id.toString(),
      },
      data,
    })
  }

  async create(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPrisma(event)

    await prisma.event.create({
      data,
    })
  }

  async findById(id: UniqueEntityID): Promise<Event | null> {
    const prismaEvent = await prisma.event.findUnique({
      where: {
        id: id.toString(),
      },
    })

    if (!prismaEvent) {
      return null
    }

    return PrismaEventMapper.toDomain(prismaEvent)
  }

  async delete(event: Event): Promise<void> {
    await prisma.event.delete({
      where: {
        id: event.id.toString(),
      },
    })
  }
}
