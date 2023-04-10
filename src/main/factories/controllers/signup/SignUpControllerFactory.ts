import { SignUpController } from '../../../../presentation/controllers/signup/SignUpController'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/LogControllerDecoratorFactory'
import { makeDbAddAccount } from '../../useCases/addAccount/DbAddAccountFactory'
import { makeDbAuthentication } from '../../useCases/authentication/DbAuthenticationFactory'
import { makeSignUpValidation } from './SignUpValidationFactory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())

  return makeLogControllerDecorator(controller)
}
