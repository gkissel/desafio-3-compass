import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/challenge/enterprise/user'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user.mapper'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
      birthDate: faker.date.birthdate(),
      city: faker.location.city(),
      country: faker.location.country(),
      ...override,
    },
    id,
  )

  return user
}

export class UserFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    return user
  }
}
