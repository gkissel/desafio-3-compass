import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EventsRepository } from '@/domain/challenge/application/repositories/events.repository'
import { DayOfWeek, Event } from '@/domain/challenge/enterprise/event'

export class InMemoryEventsRepository implements EventsRepository {
  public items: Event[] = []

  async create(event: Event): Promise<void> {
    this.items.push(event)
  }

  async delete(event: Event): Promise<void> {
    this.items.filter((item) => item !== event)
  }

  async save(event: Event): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === event.id)

    this.items[itemIndex] = event
  }

  async getById(id: UniqueEntityID): Promise<Event | null> {
    const event = this.items.find((item) => item.id.equals(id))

    if (!event) {
      return null
    }

    return event
  }

  async getMany({
    dayOfWeek,
    description,
  }: {
    dayOfWeek?: DayOfWeek
    description?: string
  }): Promise<Event[]> {
    let events = this.items

    if (dayOfWeek) {
      events = events.filter((event) => event.dayOfWeek === dayOfWeek)
    }

    if (description) {
      events = events.filter((event) =>
        event.description.toLowerCase().includes(description.toLowerCase()),
      )
    }

    return events
  }
}
