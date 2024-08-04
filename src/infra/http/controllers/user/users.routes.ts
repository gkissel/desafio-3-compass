import { Router } from 'express'

import { CreateUserController } from './create'
import { AuthenticateUserController } from './login'

const UserRouter = Router({
  mergeParams: true,
})
const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()

UserRouter.post('/sign-up', createUserController.execute)
UserRouter.post('/sign-in', authenticateUserController.execute)

export default UserRouter
