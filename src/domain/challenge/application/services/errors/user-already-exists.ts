import { ServiceError } from '@/core/errors/service-error'

export class UserAlreadyExistsError extends Error implements ServiceError {
  constructor(identifier: string) {
    super(`User with email: "${identifier}" already exists.`)
  }
}
