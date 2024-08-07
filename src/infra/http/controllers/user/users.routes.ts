import { Router } from 'express'

import { AddUserProfileController } from './add-user-profile'
import { CreateUserController } from './create'
import { AuthenticateUserController } from './login'

const UserRouter = Router({
  mergeParams: true,
})
const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()
const addUserProfileController = new AddUserProfileController()

UserRouter.post('/sign-up', createUserController.execute)
UserRouter.post('/sign-in', authenticateUserController.execute)
UserRouter.post('/add-profile', addUserProfileController.execute)

export default UserRouter
