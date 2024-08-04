import { faker } from '@faker-js/faker'
import { UserFactory } from '@test/factories/make-user'
import { hash } from 'bcryptjs'
import supertest from 'supertest'

import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { prisma } from '@/server'

const request = supertest('http://localhost:3000')

describe('Create  event (e2e)', () => {
  const userFactory = new UserFactory(prisma)

  const jwtEncrypter = new JwtEncrypter()
  it('should be able to authenticate', async () => {
    const user = await userFactory.makePrismaUser({
      password: await hash('123456', 8),
    })

    const response = await request
      .post('/api/v1/events/')
      .send({
        description: faker.lorem.sentence(),
        dayOfWeek: 'sunday',
      })
      .withCredentials(true)
      .set(
        'Authorization',
        `Bearer ${await jwtEncrypter.encrypt({ sub: user.id.toString() })}`,
      )

    console.log(response.body)

    expect(response.statusCode).toEqual(201)
  })
})
