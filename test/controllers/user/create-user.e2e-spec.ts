import { faker } from '@faker-js/faker'
import supertest from 'supertest'

const request = supertest('http://localhost:3000')

describe('Register user (e2e)', () => {
  it('should be able to register', async () => {
    const password = faker.internet.password()

    const response = await request.post('/api/v1/user/sign-up').send({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.past().toISOString().split('T')[0],
      city: faker.location.city(),
      country: faker.location.country(),
      email: faker.internet.email(),
      password,
      confirmPassword: password,
    })

    expect(response.statusCode).toEqual(201)
  })
})
