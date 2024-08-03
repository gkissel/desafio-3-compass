import { Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/challenge/enterprise/user'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        password: raw.password,

        birthDate: raw.birthDate,

        city: raw.city,
        country: raw.country,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,

      password: user.password,
      birthDate: user.birthDate,
      city: user.city,
      country: user.country,
    }
  }
}
