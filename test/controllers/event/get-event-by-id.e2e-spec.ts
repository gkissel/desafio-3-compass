import { EventFactory } from '@test/factories/make-event'
import { UserFactory } from '@test/factories/make-user'
import { hash } from 'bcryptjs'
import supertest from 'supertest'

import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { prisma } from '@/server'

const request = supertest('http://localhost:3000')

describe('Get event by id (e2e)', () => {
  const userFactory = new UserFactory(prisma)

  const eventFactory = new EventFactory(prisma)

  const jwtEncrypter = new JwtEncrypter()
  it('should be able to get a event', async () => {
    const user = await userFactory.makePrismaUser({
      password: await hash('123456', 8),
    })

    const event = await eventFactory.makePrismaEvent()

    const response = await request
      .get(`/api/v1/events/${event.id.toString()}`)
      .withCredentials(true)
      .set(
        'Authorization',
        `Bearer ${await jwtEncrypter.encrypt({ sub: user.id.toString() })}`,
      )

    expect(response.statusCode).toEqual(200)
  })
})
