import { Request, Response } from 'express'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetEventByIdService } from '@/domain/challenge/application/services/event/get-event-by-id.service'
import { PrismaEventsRepository } from '@/infra/database/prisma/repositories/prisma-events.repository'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users.repository'

export class GetEventByIdController {
  async execute(req: Request, res: Response) {
    const eventsRepository = new PrismaEventsRepository()
    const usersRepository = new PrismaUsersRepository()

    const getEventById = new GetEventByIdService(
      eventsRepository,
      usersRepository,
    )

    const userId = req.body.userId

    const eventId = req.params.id

    const result = await getEventById.execute({
      id: eventId,
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          return res.status(401).json({
            statusCode: 401,
            error: 'Not Allowed',
            message: error.message,
          })

        case ResourceNotFoundError:
          return res.status(404).json({
            statusCode: 404,
            error: 'Not Found',
            message: error.message,
          })

        default:
          return res.status(500).json({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Something went wrong',
          })
      }
    }

    const event = result.value

    return res.status(200).json(event)
  }
}
