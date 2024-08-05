import { Request, Response } from 'express'
import * as j from 'joi'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DeleteManyEventsService } from '@/domain/challenge/application/services/event/delete-many-events.service'
import { DayOfWeek } from '@/domain/challenge/enterprise/event'
import { PrismaEventsRepository } from '@/infra/database/prisma/repositories/prisma-events.repository'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users.repository'

export class DeleteManyEventsController {
  async execute(req: Request, res: Response) {
    const eventsRepository = new PrismaEventsRepository()
    const usersRepository = new PrismaUsersRepository()

    const deleteManyEvents = new DeleteManyEventsService(
      eventsRepository,
      usersRepository,
    )

    const deleteManyEventsSchema = j.object({
      dayOfWeek: j
        .string()
        .valid(
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        )
        .required(),
    })

    type deleteManyEventsType = {
      description?: string
      dayOfWeek: DayOfWeek
    }

    const { value, error } = deleteManyEventsSchema.validate(req.query)

    const userId = req.body.userId

    const { dayOfWeek }: deleteManyEventsType = value

    if (error) {
      return res.status(400).json({
        statusCode: 400,
        errors: error.details,
        type: 'Validation Error',
      })
    }
    const result = await deleteManyEvents.execute({
      dayOfWeek,
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

        default:
          return res.status(500).json({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Something went wrong',
          })
      }
    }

    const events = result.value

    return res.status(204).json(events)
  }
}
