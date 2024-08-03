import { ServiceError } from '@/core/errors/service-error'

export class PasswordsNotMatchError extends Error implements ServiceError {
  constructor() {
    super(`The passwords did not match`)
  }
}
