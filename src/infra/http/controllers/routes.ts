import { Router } from 'express'

import EventRouter from './event/event.routes'
import UserRouter from './user/users.routes'

const routes = Router({
  mergeParams: true,
})

routes.use('/user', UserRouter)
routes.use('/events', EventRouter)

export default routes
