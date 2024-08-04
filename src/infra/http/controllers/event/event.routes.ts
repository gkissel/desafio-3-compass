import { Router } from 'express'

import { verifyToken } from '../../middlewares/auth-middleware'
import { CreateEventController } from './create'

const EventRouter = Router({
  mergeParams: true,
})
const createEventController = new CreateEventController()

EventRouter.post('/', verifyToken, createEventController.execute)

export default EventRouter
