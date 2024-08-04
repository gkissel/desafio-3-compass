import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UsersRepository } from '@/domain/challenge/application/repositories/user.repository'
import { User } from '@/domain/challenge/enterprise/user'
import { prisma } from '@/server'

import { PrismaUserMapper } from '../mappers/prisma-user.mapper'

export class PrismaUsersRepository implements UsersRepository {
  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    })
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await prisma.user.create({
      data,
    })
  }

  async findById(id: UniqueEntityID): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: {
        id: id.toString(),
      },
    })

    if (!prismaUser) {
      return null
    }

    return PrismaUserMapper.toDomain(prismaUser)
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!prismaUser) {
      return null
    }

    return PrismaUserMapper.toDomain(prismaUser)
  }

  async delete(user: User): Promise<void> {
    await prisma.user.delete({
      where: {
        id: user.id.toString(),
      },
    })
  }
}
