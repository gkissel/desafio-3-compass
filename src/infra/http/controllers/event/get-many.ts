import { Request, Response } from 'express'
import * as j from 'joi'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { GetManyEventsService } from '@/domain/challenge/application/services/event/get-many-events.service'
import { DayOfWeek } from '@/domain/challenge/enterprise/event'
import { PrismaEventsRepository } from '@/infra/database/prisma/repositories/prisma-events.repository'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users.repository'

export class GetManyEventsController {
  async execute(req: Request, res: Response) {
    const eventsRepository = new PrismaEventsRepository()
    const usersRepository = new PrismaUsersRepository()

    const getManyEvents = new GetManyEventsService(
      eventsRepository,
      usersRepository,
    )

    const getManyEventsSchema = j.object({
      description: j.string().optional(),
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
        .optional(),
    })

    type getManyEventsType = {
      description?: string
      dayOfWeek?: DayOfWeek
    }

    const { value, error } = getManyEventsSchema.validate(req.query)

    const userId = req.body.userId

    const { dayOfWeek, description }: getManyEventsType = value

    if (error) {
      return res.status(400).json({
        statusCode: 400,
        errors: error.details,
        type: 'Validation Error',
      })
    }
    const result = await getManyEvents.execute({
      dayOfWeek,
      description,
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

    return res.status(200).json(events)
  }
}
