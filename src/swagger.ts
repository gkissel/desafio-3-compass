import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'Desafio 3',
    description: 'Desafio 3 compass',
  },
  host: 'localhost:3333',
}

const outputFile = './swagger-output.json'
const routes = ['./src/infra/http/controllers/routes.ts']

swaggerAutogen()(outputFile, routes, doc)
