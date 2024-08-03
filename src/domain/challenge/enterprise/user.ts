import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface UserProps {
  firstName: string
  lastName: string
  birthDate: string
  city: string
  country: string
  email: string
  password: string
}

export class User extends Entity<UserProps> {
  get firstName(): string {
    return this.props.firstName
  }

  get lastName(): string {
    return this.props.lastName
  }

  get birthDate(): string {
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

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id)

    return user
  }
}
