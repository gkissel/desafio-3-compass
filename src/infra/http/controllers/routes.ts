import { Router } from 'express'

// import UserRouter from './users/users.routes'

const routes = Router({
  mergeParams: true,
})

// routes.use('/user', UserRouter)

export default routes
