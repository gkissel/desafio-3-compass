import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface UserProps {
  firstName: string
  lastName: string
  birthDate: Date
  city: string
  country: string
  email: string
  password: string
  avatarUrl?: string | null
}

export class User extends Entity<UserProps> {
  get firstName(): string {
    return this.props.firstName
  }

  get lastName(): string {
    return this.props.lastName
  }

  get birthDate(): Date {
    return this.props.birthDate
  }

  get city(): string {
    return this.props.city
  }

  get country(): string {
    return this.props.country
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  get avatarUrl(): string | undefined | null {
    return this.props.avatarUrl
  }

  set avatarUrl(value: string | undefined | null) {
    this.props.avatarUrl = value
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id)

    return user
  }
}
