import { LogMongoRepository } from '../../../../infra/db/mongodb/log/LogMongoRepository'
import { LoginController } from '../../../../presentation/controllers/login/LoginController'
import { Controller } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/LogControllerDecorator'
import { makeDbAuthentication } from '../../useCases/authentication/DbAuthenticationFactory'
import { makeLoginValidation } from './LoginValidationFactory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(controller, logMongoRepository)
}
