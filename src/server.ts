/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Request, Response } from 'express'
import * as bodyParser from 'body-parser'
import express from 'express'
import * as swaggerUi from 'swagger-ui-express'

import { env } from './infra/env'
import routes from './infra/http/controllers/user/routes'
import swaggerDocs from './swagger-output.json'

export const app = express()

app.use(bodyParser.json())

app.listen(env.PORT)
app.use('/api/v1/', routes)
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

console.log(`Express server started on port ${env.PORT}`)
