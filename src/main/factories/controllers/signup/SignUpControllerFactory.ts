import { DbAddAccountUseCase } from '../../../../data/usecases/addAccount/DbAddAccountUseCase'
import { BcryptAdapter } from '../../../../infra/criptography/bcryptAdapter/BcryptAdapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/AccountMongoRepository'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log/LogMongoRepository'
import { SignUpController } from '../../../../presentation/controllers/signup/SignUpController'
import { Controller } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/LogControllerDecorator'
import { makeDbAuthentication } from '../../useCases/authentication/DbAuthenticationFactory'
import { makeSignUpValidation } from './SignUpValidationFactory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccountUseCase(hasher, addAccountRepository)
  const controller = new SignUpController(addAccount, makeSignUpValidation(), makeDbAuthentication())
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(controller, logMongoRepository)
}
