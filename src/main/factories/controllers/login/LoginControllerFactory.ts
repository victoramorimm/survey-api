import { LoginController } from '../../../../presentation/controllers/login/LoginController'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/LogControllerDecoratorFactory'
import { makeDbAuthentication } from '../../useCases/authentication/DbAuthenticationFactory'
import { makeLoginValidation } from './LoginValidationFactory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())

  return makeLogControllerDecorator(controller)
}
