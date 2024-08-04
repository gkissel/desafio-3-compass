import { Request, Response } from 'express'
import * as j from 'joi'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { CreateEventService } from '@/domain/challenge/application/services/event/create-event.service'
import { DayOfWeek } from '@/domain/challenge/enterprise/event'
import { PrismaEventsRepository } from '@/infra/database/prisma/repositories/prisma-events.repository'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users.repository'

export class CreateEventController {
  async execute(req: Request, res: Response) {
    const eventsRepository = new PrismaEventsRepository()
    const usersRepository = new PrismaUsersRepository()

    const createEvent = new CreateEventService(
      eventsRepository,
      usersRepository,
    )

    const createEventSchema = j.object({
      description: j.string().required(),
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
      userId: j.string().required(),
    })

    type createEventType = {
      description: string
      dayOfWeek: DayOfWeek
      userId: string
    }

    const { value, error } = createEventSchema.validate(req.body)

    const { dayOfWeek, description, userId }: createEventType = value

    if (error) {
      return res.status(400).json({
        statusCode: 400,
        errors: error.details,
        type: 'Validation Error',
      })
    }
    const result = await createEvent.execute({
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

    const event = result.value

    return res.status(201).json(event)
  }
}
