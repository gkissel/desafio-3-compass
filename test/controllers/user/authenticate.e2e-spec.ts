import { UserFactory } from '@test/factories/make-user'
import { hash } from 'bcryptjs'
import supertest from 'supertest'

import { prisma } from '@/server'

const request = supertest('http://localhost:3000')

describe('Authenticate user (e2e)', () => {
  const userFactory = new UserFactory(prisma)

  it('should be able to authenticate', async () => {
    const user = await userFactory.makePrismaUser({
      password: await hash('123456', 8),
    })

    const response = await request.post('/api/v1/user/sign-in').send({
      email: user.email,
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
