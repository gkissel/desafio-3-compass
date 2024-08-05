import { Router } from 'express'

import { verifyToken } from '../../middlewares/auth-middleware'
import { CreateEventController } from './create'
import { DeleteEventByIdController } from './delete-by-id'
import { DeleteManyEventsController } from './delete-many'
import { GetEventByIdController } from './get-by-id'
import { GetManyEventsController } from './get-many'

const EventRouter = Router({
  mergeParams: true,
})
const createEventController = new CreateEventController()
const getManyEventsController = new GetManyEventsController()
const deleteManyEventsController = new DeleteManyEventsController()
const getEventByIdController = new GetEventByIdController()
const deleteEventByIdController = new DeleteEventByIdController()

EventRouter.post('/', verifyToken, createEventController.execute)
EventRouter.get('/', verifyToken, getManyEventsController.execute)
EventRouter.delete('/', verifyToken, deleteManyEventsController.execute)
EventRouter.get('/:id', verifyToken, getEventByIdController.execute)
EventRouter.delete('/:id', verifyToken, deleteEventByIdController.execute)

export default EventRouter
