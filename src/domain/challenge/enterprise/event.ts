import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'

interface EventProps {
  description: string
  dayOfWeek: DayOfWeek

  userId: UniqueEntityID
}

export class Event extends Entity<EventProps> {
  get description(): string {
    return this.props.description
  }

  get dayOfWeek(): string {
    return this.props.dayOfWeek
  }

  get userId(): UniqueEntityID {
    return this.props.userId
  }

  static create(props: EventProps, id?: UniqueEntityID) {
    const event = new Event(props, id)

    return event
  }
}
